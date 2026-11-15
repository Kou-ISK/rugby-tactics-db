import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { assembleDataset, checkDataset, writeDataset, serialize, root } from '../scripts/lib/dataset.mjs';
async function fixture(fn) {
  const dir = await mkdtemp(tmpdir() + '/rugby-authoring-');
  const base = pathToFileURL(dir + '/');
  try {
    for (const path of ['data', 'schemas']) await cp(new URL(path, root), new URL(path, base), { recursive: true });
    await fn(base);
  } finally { await rm(dir, { recursive: true, force: true }); }
}
async function edit(base, path, fn) {
  const file = new URL(path, base);
  const value = JSON.parse(await readFile(file)); fn(value); await writeFile(file, serialize(value));
}
test('split authoring preserves every byte of the public dataset export', async () => {
  const { raw, data } = await checkDataset();
  assert.equal(serialize(data), raw);
});
test('authoring rejects path traversal and duplicate catalog IDs', async () => {
  await fixture(async base => {
    await edit(base, 'data/catalog.json', c => c.sourceIds[0] = '../catalog');
    await assert.rejects(assembleDataset(base), /safe IDs/);
  });
  await fixture(async base => {
    await edit(base, 'data/catalog.json', c => c.conceptIds.push(c.conceptIds[0]));
    await assert.rejects(assembleDataset(base), /duplicate ID/);
  });
});
test('authoring rejects orphan files, ID mismatch, missing files and symlinks', async () => {
  await fixture(async base => {
    await writeFile(new URL('data/concepts/orphan.json', base), '{}');
    await assert.rejects(assembleDataset(base), /every regular JSON/);
  });
  await fixture(async base => {
    await edit(base, 'data/concepts/drift-defence.json', c => c.id = 'rtk:other');
    await assert.rejects(assembleDataset(base), /ID does not match/);
  });
  await fixture(async base => {
    await rm(new URL('data/concepts/drift-defence.json', base));
    await assert.rejects(assembleDataset(base), /every regular JSON/);
  });
  await fixture(async base => {
    const file = new URL('data/concepts/drift-defence.json', base);
    await rm(file); await symlink(new URL('data/catalog.json', base), file);
    await assert.rejects(assembleDataset(base), /every regular JSON/);
  });
});
test('stale export and unknown catalog metadata fail instead of silently publishing', async () => {
  await fixture(async base => {
    await writeFile(new URL('data/dataset.json', base), '{}\n');
    await assert.rejects(checkDataset(base), /stale/);
  });
  await fixture(async base => {
    await edit(base, 'data/catalog.json', c => c.privateNotes = 'not public');
    await assert.rejects(assembleDataset(base), /expected only/);
  });
});

test('authoring rejects symlinked catalog and record directories', async () => {
  await fixture(async base => {
    const file = new URL('data/catalog.json', base);
    await rm(file); await symlink(new URL('data/dataset.json', base), file);
    await assert.rejects(assembleDataset(base), /no symlinks/);
  });
  await fixture(async base => {
    const directory = new URL('data/concepts/', base);
    await rm(directory, { recursive: true });
    await symlink(new URL('data/sources/', base), new URL('data/concepts', base), 'dir');
    await assert.rejects(assembleDataset(base), /no symlinks/);
  });
});

test('assembly writing refuses an output symlink and never changes its target', async () => {
  await fixture(async base => {
    const target = new URL('data/catalog.json', base);
    const before = await readFile(target);
    const output = new URL('data/dataset.json', base);
    await rm(output); await symlink(target, output);
    await assert.rejects(writeDataset(base), /no symlinks/);
    assert.deepEqual(await readFile(target), before);
  });
});
test('assembly can generate a missing export and update a stale regular export', async () => {
  await fixture(async base => {
    const output = new URL('data/dataset.json', base);
    await rm(output); await writeDataset(base); await checkDataset(base);
    await writeFile(output, '{}'); await writeDataset(base); await checkDataset(base);
  });
});
