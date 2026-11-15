export const labels = {
  side: { attack: '攻撃', defence: '守備', both: '攻守' },
  level: { system: '戦術体系', shape: '配置', move: '連係', principle: '原則', skill: '技術', phase: '局面' },
  relation: { similarTo: '似ている', contrastsWith: '対比', partOf: '構成要素', enables: '支える', notSameAs: '同一ではない' }
};
export function normalize(s) { return String(s).normalize('NFKC').toLowerCase().replace(/[‐‑‒–—−]/g, '-').replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60)).trim(); }
export function searchConcepts(concepts, { q = '', side = '', level = '', format = '' } = {}) {
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  return concepts.map((c, i) => {
    const names = [c.name.ja, c.name.en, c.id, ...c.aliases.map(a => a.label)].map(normalize);
    const body = normalize([c.summary.ja, c.summary.en, ...c.tags, ...c.intent].join(' '));
    const matches = terms.every(t => names.some(n => n.includes(t)) || body.includes(t));
    const score = terms.reduce((n, t) => n + (names.includes(t) ? 12 : names.some(v => v.startsWith(t)) ? 6 : names.some(v => v.includes(t)) ? 3 : 1), 0);
    return { c, i, matches, score };
  }).filter(({ c, matches }) => matches && (!side || c.side === side || c.side === 'both') && (!level || c.level === level) && (!format || c.formats.includes(format)))
    .sort((a, b) => b.score - a.score || a.i - b.i).map(v => v.c);
}
/** Alias matching preserves ambiguity. Contextual aliases are never automatic equivalence. */
export function resolveTerm(concepts, term, { format, side } = {}) {
  const query = normalize(term);
  if (!query) return { status: 'unresolved', candidates: [] };
  const candidates = concepts.flatMap(c => {
    if (format && !c.formats.includes(format)) return [];
    if (side && c.side !== side && c.side !== 'both') return [];
    const official = [c.id, c.name.ja, c.name.en].some(n => normalize(n) === query);
    const aliases = c.aliases.filter(a => normalize(a.label) === query);
    return official || aliases.length ? [{ conceptId: c.id, version: c.version, match: official ? 'name' : aliases.some(a => a.kind !== 'contextual') ? 'alias' : 'contextual' }] : [];
  });
  return { status: candidates.length === 0 ? 'unresolved' : candidates.length > 1 || candidates[0].match === 'contextual' ? 'ambiguous' : 'matched', candidates };
}
