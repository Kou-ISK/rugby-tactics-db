import { readFile, lstat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { validateSchema } from '../../src/contract.mjs';
import { levelCrosswalk, classificationMap } from '../../src/classification.mjs';
import { normalize } from '../../src/search.mjs';
export function validateClassification(classification, schema, data, raw) {
  const errors = validateSchema(classification, schema);
  if (errors.length) return errors;
  try { classificationMap(data, classification); } catch (error) { errors.push(error.message); }
  if (classification.datasetSha256 !== createHash('sha256').update(raw).digest('hex')) errors.push('classification dataset digest mismatch');
  if (classification.updated !== data.updated) errors.push('classification date must match dataset');
  const byId = new Map(data.concepts.map(c => [c.id, c]));
  const sources = new Map(data.sources.map(s => [s.id, s]));
  const sourceIds = new Set(sources.keys());
  const identities = new Map();
  for (const r of classification.records) {
    const c = byId.get(r.conceptId);
    if (!c) continue;
    // No cross-record merge has yet been evidenced. A future merge needs a migration
    // contract; do not silently recycle or redirect a published ID.
    if (r.canonicalId !== c.id) errors.push(`${c.id}: cross-record merge requires a reviewed migration contract`);
    if (!levelCrosswalk[r.kind]?.includes(c.level)) errors.push(`${c.id}: strict kind and legacy level disagree`);
    if (r.kind === 'coaching-model' && r.naming !== 'source-specific') errors.push(`${c.id}: coaching model must identify its source-specific name`);
    for (const ev of [...r.evidence, ...r.equivalences.flatMap(e => e.evidence)]) {
      if (!sourceIds.has(ev.source)) errors.push(`${c.id}: unknown classification evidence source`);
    }
    const equivalentLabels = new Set();
    for (const group of r.equivalences) {
      for (const ev of group.evidence) if (sources.has(ev.source) && c.formats.some(format => !sources.get(ev.source).formats.includes(format))) errors.push(`${c.id}: equivalence source scope is narrower than concept`);
      for (const label of group.labels) {
        const n = normalize(label);
        if (equivalentLabels.has(n)) errors.push(`${c.id}: duplicate equivalent label`);
        equivalentLabels.add(n);
        if (![c.name.ja, c.name.en, ...c.aliases.filter(a => a.kind !== 'contextual').map(a => a.label)].some(a => normalize(a) === n)) errors.push(`${c.id}: equivalence is absent from non-contextual names`);
      }
    }
    for (const alias of c.aliases) if (alias.kind === 'synonym' && !equivalentLabels.has(normalize(alias.label))) errors.push(`${c.id}: synonym lacks explicit equivalence evidence`);
    for (const label of [c.name.ja, c.name.en, ...c.aliases.filter(a => a.kind !== 'contextual').map(a => a.label)]) {
      const n = normalize(label);
      if (identities.has(n) && identities.get(n) !== c.id) errors.push(`non-contextual name collision: ${n}`);
      identities.set(n, c.id);
    }
  }
  return errors;
}
export async function checkClassification(data, raw, base = new URL('../../', import.meta.url)) {
  for (const path of ['data/classification.json', 'schemas/classification.schema.json']) {
    if (!(await lstat(new URL(path, base))).isFile()) throw new Error(`${path}: expected regular file`);
  }
  const text = await readFile(new URL('data/classification.json', base), 'utf8');
  const classification = JSON.parse(text);
  const schema = JSON.parse(await readFile(new URL('schemas/classification.schema.json', base), 'utf8'));
  const errors = validateClassification(classification, schema, data, raw);
  if (errors.length) throw new Error(errors.join('\n'));
  return { classification, raw: text };
}
