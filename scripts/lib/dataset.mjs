import { randomUUID } from 'node:crypto';
import { readFile, readdir, lstat, writeFile, rename, rm } from 'node:fs/promises';
import { validateDataset } from '../../src/contract.mjs';

export const root = new URL('../../', import.meta.url);
export const serialize = value => JSON.stringify(value, null, 2) + '\n';
async function regular(base, path, directory = false) {
  const info = await lstat(new URL(path, base));
  if (directory ? !info.isDirectory() : !info.isFile()) throw new Error(`${path}: expected regular ${directory ? 'directory' : 'file'} (no symlinks)`);
}
const keys = ['schemaVersion', 'version', 'updated', 'license', 'sourceIds', 'conceptIds'];

/** Assemble local authoring files only. No source URLs are fetched or executed. */
export async function assembleDataset(base = root) {
  await regular(base, 'data/', true);
  await regular(base, 'schemas/', true);
  await regular(base, 'data/catalog.json');
  await regular(base, 'schemas/dataset.schema.json');
  const catalog = JSON.parse(await readFile(new URL('data/catalog.json', base), 'utf8'));
  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog) ||
      Object.keys(catalog).length !== keys.length || keys.some(k => !Object.hasOwn(catalog, k))) {
    throw new Error('catalog: expected only ' + keys.join(', '));
  }
  const data = Object.fromEntries(keys.slice(0, 4).map(k => [k, catalog[k]]));
  for (const [kind, idKey, pattern] of [
    ['sources', 'sourceIds', /^[a-z0-9]+(?:-[a-z0-9]+)*$/],
    ['concepts', 'conceptIds', /^rtk:[a-z0-9]+(?:-[a-z0-9]+)*$/],
  ]) {
    const ids = catalog[idKey];
    if (!Array.isArray(ids) || !ids.length || ids.some(id => typeof id !== 'string' || !pattern.test(id))) {
      throw new Error(`catalog.${idKey}: expected nonempty safe IDs`);
    }
    if (new Set(ids).size !== ids.length) throw new Error(`catalog.${idKey}: duplicate ID`);
    const paths = ids.map(id => id.replace(/^rtk:/, '') + '.json');
    const directory = new URL(`data/${kind}/`, base);
    await regular(base, `data/${kind}/`, true);
    const entries = await readdir(directory, { withFileTypes: true });
    if (entries.some(e => !e.isFile() || !paths.includes(e.name)) || entries.length !== paths.length) {
      throw new Error(`${kind}: every regular JSON file must be listed in catalog (no symlinks or orphan files)`);
    }
    data[kind] = await Promise.all(paths.map(async (path, i) => {
      const record = JSON.parse(await readFile(new URL(path, directory), 'utf8'));
      if (record?.id !== ids[i]) throw new Error(`${kind}/${path}: ID does not match catalog`);
      return record;
    }));
  }
  const schema = JSON.parse(await readFile(new URL('schemas/dataset.schema.json', base), 'utf8'));
  const errors = validateDataset(data, schema);
  if (errors.length) throw new Error(errors.join('\n'));
  return data;
}

export async function checkDataset(base = root) {
  const data = await assembleDataset(base);
  await regular(base, 'data/dataset.json');
  const raw = await readFile(new URL('data/dataset.json', base), 'utf8');
  if (raw !== serialize(data)) throw new Error('data/dataset.json is stale. Run npm run assemble and commit the generated export.');
  return { data, raw };
}

/** Replace the export atomically; never follow an existing output symlink. */
export async function writeDataset(base = root) {
  const data = await assembleDataset(base);
  const target = new URL('data/dataset.json', base);
  try { await regular(base, 'data/dataset.json'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const temporary = new URL(`data/.dataset-${randomUUID()}.tmp`, base);
  try {
    await writeFile(temporary, serialize(data), { flag: 'wx' });
    await rename(temporary, target);
  } finally { await rm(temporary, { force: true }); }
  return data;
}
