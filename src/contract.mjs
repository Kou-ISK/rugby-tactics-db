/** A dependency-free validator for the JSON Schema keywords used by this project.
 * Not a general-purpose JSON Schema implementation. */
export function validateSchema(value, schema, path = '$', errors = []) {
  if (schema.const !== undefined && value !== schema.const) errors.push(`${path}: expected ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: invalid enum value`);
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
    if (!types.includes(actual)) { errors.push(`${path}: expected ${types.join('|')}, got ${actual}`); return errors; }
  }
  if (typeof value === 'string') {
    if (schema.minLength && value.trim().length < schema.minLength) errors.push(`${path}: empty string`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: invalid pattern`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems && value.length < schema.minItems) errors.push(`${path}: too few items`);
    if (schema.items) value.forEach((v, i) => validateSchema(v, schema.items, `${path}[${i}]`, errors));
  } else if (value && typeof value === 'object') {
    for (const key of schema.required || []) if (!(key in value)) errors.push(`${path}.${key}: required`);
    for (const [key, v] of Object.entries(value)) {
      if (schema.properties?.[key]) validateSchema(v, schema.properties[key], `${path}.${key}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${path}.${key}: unknown property`);
    }
  }
  return errors;
}
export function validateDataset(data, schema) {
  const errors = validateSchema(data, schema);
  const realDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
  if (errors.length) return errors;
  if (!realDate(data.updated)) errors.push('invalid dataset date');
  const unique = (list, label) => { const ids = new Set(); for (const item of list) { if (ids.has(item.id)) errors.push(`duplicate ${label}: ${item.id}`); ids.add(item.id); } return ids; };
  const sourceIds = unique(data.sources, 'source');
  const ids = unique(data.concepts, 'concept');
  const sourceMap = new Map(data.sources.map(s => [s.id, s]));
  for (const source of data.sources) {
    try { const u = new URL(source.url); if (u.protocol !== 'https:' || u.username || u.password) errors.push(`${source.id}: unsafe source URL`); } catch { errors.push(`${source.id}: invalid source URL`); }
    if (!realDate(source.accessed)) errors.push(`${source.id}: invalid access date`);
    if (source.accessed > data.updated) errors.push(`${source.id}: access date after dataset update`);
  }
  for (const c of data.concepts) {
    const claims = unique(c.claims, `${c.id} claim`);
    const roles = unique(c.mechanics.roles, `${c.id} role`);
    unique(c.mechanics.sequence, `${c.id} step`); unique(c.mechanics.decisions, `${c.id} decision`);
    for (const claim of c.claims) for (const e of claim.evidence) {
      if (!sourceIds.has(e.source)) errors.push(`${c.id}/${claim.id}: unknown source ${e.source}`);
      else if (e.support === 'direct' && c.formats.some(f => !sourceMap.get(e.source).formats.includes(f))) errors.push(`${c.id}/${claim.id}: concept format exceeds direct source scope`);
    }
    for (const item of [...c.mechanics.roles, ...c.mechanics.positioning, ...c.mechanics.sequence, ...c.mechanics.decisions]) {
      for (const ref of item.claimRefs) if (!claims.has(ref)) errors.push(`${c.id}: unknown claim ${ref}`);
    }
    for (const step of c.mechanics.sequence) if (!roles.has(step.actor)) errors.push(`${c.id}: unknown actor ${step.actor}`);
    for (const p of c.mechanics.positioning) for (const ref of [p.subject, p.object]) if (!roles.has(ref)) errors.push(`${c.id}: unknown positioning role ${ref}`);
    const edges = new Set();
    for (const r of c.relationships) {
      if (!ids.has(r.target)) errors.push(`${c.id}: dangling relation ${r.target}`);
      if (r.target === c.id) errors.push(`${c.id}: self relation`);
      const key = r.type + r.target; if (edges.has(key)) errors.push(`${c.id}: duplicate relation`); edges.add(key);
    }
    if (c.review.status === 'expert-reviewed' && (!c.review.reviewedBy?.trim() || !realDate(c.review.reviewedAt) || c.review.reviewedAt > data.updated)) errors.push(`${c.id}: reviewer identity and date required`);
    if (c.review.status === 'source-backed' && (c.review.reviewedBy || c.review.reviewedAt)) errors.push(`${c.id}: no implied expert review`);
  }
  return errors;
}
