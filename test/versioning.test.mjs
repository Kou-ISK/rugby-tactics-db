import test from 'node:test';
import assert from 'node:assert/strict';
import { validateVersionChange } from '../scripts/lib/versioning.mjs';
// Deliberately independent of the evolving production dataset and release number.
const data = { version: '0.1.0', updated: '2026-11-14', sources: [{ title: 'Example' }],
  concepts: [{ id: 'rtk:example', version: '0.1.0', summary: { en: 'Example concept' } }] };
const errors = fn => { const after = structuredClone(data); fn(after); return validateVersionChange(data, after); };
test('no dataset bump is required for byte-preserving tooling or documentation changes', () => assert.deepEqual(errors(() => {}), []));
test('source changes require a dataset version increase', () => {
  assert.ok(errors(d => d.sources[0].title += ' correction').length);
  assert.deepEqual(errors(d => { d.sources[0].title += ' correction'; d.version = '0.1.1'; }), []);
});
test('concept changes require both dataset and concept version increases', () => {
  assert.equal(errors(d => d.concepts[0].summary.en += ' correction').length, 2);
  assert.deepEqual(errors(d => { d.concepts[0].summary.en += ' correction'; d.version = '0.1.1'; d.concepts[0].version = '0.1.1'; }), []);
});
test('version regression, date regression and removed concept IDs fail closed', () => {
  assert.ok(errors(d => { d.version = '0.0.9'; }).length);
  assert.ok(errors(d => { d.version = '0.1.1'; d.updated = '2026-11-13'; }).length);
  assert.ok(errors(d => { d.version = '0.1.1'; d.concepts[0].version = '0.0.9'; }).length);
  assert.ok(errors(d => { d.version = '0.1.1'; d.concepts.pop(); }).length);
});
