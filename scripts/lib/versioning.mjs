import { isDeepStrictEqual } from 'node:util';
const greater = (next, prev) => {
  if (!/^\d+\.\d+\.\d+$/.test(next) || !/^\d+\.\d+\.\d+$/.test(prev)) return false;
  const a = next.split('.').map(BigInt), b = prev.split('.').map(BigInt);
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
  return false;
};
const withoutVersion = ({ version, ...record }) => record;
export function validateVersionChange(before, after) {
  const errors = [];
  if (isDeepStrictEqual(before, after)) return errors;
  if (!greater(after.version, before.version)) errors.push('Changed dataset requires an increased dataset version');
  if (after.updated < before.updated) errors.push('Dataset update date must not move backwards');
  const next = new Map(after.concepts.map(c => [c.id, c]));
  for (const old of before.concepts) {
    const current = next.get(old.id);
    if (!current) {
      errors.push(`${old.id}: removal requires a separately designed migration/tombstone contract`);
      continue;
    }
    if (!isDeepStrictEqual(withoutVersion(old), withoutVersion(current)) && !greater(current.version, old.version)) {
      errors.push(`${old.id}: changed concept requires an increased concept version`);
    } else if (current.version !== old.version && !greater(current.version, old.version)) {
      errors.push(`${old.id}: concept version must not move backwards`);
    }
  }
  return errors;
}

export function validateClassificationVersionChange(before, after) {
  if (!before || isDeepStrictEqual(before, after)) return [];
  const errors = [];
  if (!greater(after.version, before.version)) errors.push('Changed classification requires an increased classification version');
  if (after.updated < before.updated) errors.push('Classification date must not move backwards');
  return errors;
}
