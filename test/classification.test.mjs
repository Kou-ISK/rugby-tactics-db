import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateClassification } from '../scripts/lib/classification.mjs';
import { classificationMap, collectionFor, parseClassifiedDataset } from '../src/classification.mjs';
import { searchConcepts, resolveTerm } from '../src/search.mjs';
import { validateClassificationVersionChange } from '../scripts/lib/versioning.mjs';
const raw = await readFile(new URL('../data/dataset.json', import.meta.url), 'utf8');
const data = JSON.parse(raw);
const classification = JSON.parse(await readFile(new URL('../data/classification.json', import.meta.url)));
const schema = JSON.parse(await readFile(new URL('../schemas/classification.schema.json', import.meta.url)));
const map = classificationMap(data, classification);
const mutate = fn => { const copy = structuredClone(classification); fn(copy); return validateClassification(copy, schema, data, raw); };
test('all knowledge has one strict classification, matching dataset bytes and stable identity', () => {
  assert.deepEqual(validateClassification(classification, schema, data, raw), []);
  assert.equal(map.size, data.concepts.length);
  assert.ok([...map.values()].every(r => r.canonicalId === r.conceptId));
});
test('classification rejects missing, duplicate, unknown, merged or incompatible records', () => {
  assert.ok(mutate(c => c.records.pop()).length);
  assert.ok(mutate(c => c.records[1] = c.records[0]).length);
  assert.ok(mutate(c => c.records[0].conceptId = 'rtk:missing').length);
  assert.ok(mutate(c => c.records[0].canonicalId = c.records[1].conceptId).length);
  assert.ok(mutate(c => c.records[0].kind = 'technique').length);
  assert.ok(mutate(c => c.records[0].rationale = ' ').length);
});
test('classification rejects stale pairing and absent or unproven identity evidence', () => {
  assert.ok(mutate(c => c.datasetVersion = '0.0.0').length);
  assert.ok(mutate(c => c.datasetSha256 = '0'.repeat(64)).length);
  assert.ok(mutate(c => c.records[0].evidence[0].source = 'unknown').length);
  assert.ok(mutate(c => c.records[0].evidence = []).length);
  assert.ok(mutate(c => c.records.find(r => r.conceptId === 'rtk:cut-out-pass').equivalences[0].evidence[0].source = 'nz-sevens-defence').length);
  assert.ok(mutate(c => c.records.find(r => r.conceptId === 'rtk:cut-out-pass').equivalences = []).length);
  assert.ok(mutate(c => c.records.find(r => r.conceptId === 'rtk:cut-out-pass').equivalences[0].labels = ['Screen']).length);
});
test('browser fails closed on missing, stale or unknown strict classifications', () => {
  assert.throws(() => classificationMap(data, {}));
  assert.throws(() => classificationMap(data, { ...classification, datasetVersion: '0.0.0' }));
  const copy = structuredClone(classification); copy.records[0].kind = 'unknown';
  assert.throws(() => classificationMap(data, copy));
});
test('core tactics, component knowledge and author-specific examples are separate', () => {
  assert.equal(searchConcepts(data.concepts, { collection: 'core' }, map).length, 13);
  assert.equal(searchConcepts(data.concepts, { collection: 'supporting' }, map).length, 25);
  assert.equal(searchConcepts(data.concepts, { collection: 'examples' }, map).length, 3);
  assert.equal(searchConcepts(data.concepts, { kind: 'strategy' }, map).length, 0);
  assert.equal(searchConcepts(data.concepts, { collection: 'core', kind: 'system' }, map).length, 6);
  assert.equal(collectionFor(map.get('rtk:phase-direction-change')), 'supporting');
  assert.equal(collectionFor(map.get('rtk:quick-tap-attack')), 'examples');
  for (const id of ['chip-and-chase', 'grubber-behind-line', 'up-and-under-contest', 'maul-continuity', 'pull-back-pass']) assert.equal(map.get('rtk:' + id).kind, 'technique');
});
test('proven alternate names resolve to one canonical concept, not duplicate records', () => {
  for (const [term, id] of [['Scissors pass', 'switch-pass'], ['Miss pass', 'cut-out-pass'], ['Run around', 'loop-move'], ['Bomb', 'up-and-under-contest']]) {
    const found = resolveTerm(data.concepts, term);
    assert.equal(found.status, 'matched', term);
    assert.deepEqual(found.candidates.map(c => c.conceptId), ['rtk:' + id]);
  }
  for (const term of ['Screen pass', 'Blitz defence', 'tip-on', 'Split', 'ミスパス', 'クイックタップ']) assert.equal(resolveTerm(data.concepts, term).status, 'ambiguous', term);
});
test('classification-only edits require their own increased release version', () => {
  const before = { version: '0.1.0', updated: '2026-11-15', records: ['example'] };
  assert.deepEqual(validateClassificationVersionChange(null, before), []);
  assert.deepEqual(validateClassificationVersionChange(before, structuredClone(before)), []);
  assert.ok(validateClassificationVersionChange(before, { ...before, records: ['changed'] }).length);
  assert.deepEqual(validateClassificationVersionChange(before, { ...before, version: '0.1.1', records: ['changed'] }), []);
  assert.ok(validateClassificationVersionChange(before, { ...before, version: '0.1.1', updated: '2026-11-14' }).length);
});

test('browser compares actual dataset bytes, including same-version cache mismatch', async () => {
  const paired = await parseClassifiedDataset(raw, classification);
  assert.equal(paired.classifications.size, data.concepts.length);
  await assert.rejects(() => parseClassifiedDataset(raw + ' ', classification), /digest mismatch/);
  const changed = structuredClone(data); changed.concepts[0].name.en += ' stale';
  await assert.rejects(() => parseClassifiedDataset(JSON.stringify(changed), classification), /digest mismatch/);
});
