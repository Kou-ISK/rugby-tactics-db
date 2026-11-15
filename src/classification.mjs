/** Strict editorial taxonomy. Dataset v1 `level` remains a coarser compatibility field. */
export const kindLabels = {
  strategy: '戦略', system: 'システム', formation: '配置', pattern: '定型連係',
  tactic: '戦術的選択', technique: '技術', principle: '原則', role: '役割・行動',
  situation: '局面・状況', 'coaching-model': 'コーチ提案モデル',
};
export const namingLabels = {
  'source-attested': '資料に名称あり', 'source-specific': '著者固有の名称', editorial: '編集上の見出し',
};
export const collectionLabels = { core: '戦術・システム', supporting: '関連する要素・用語', examples: '著者固有の提案例' };
export const levelCrosswalk = {
  strategy: ['system', 'principle'], system: ['system'], formation: ['shape'],
  pattern: ['move'], tactic: ['move', 'principle'], technique: ['skill'],
  principle: ['principle'], role: ['shape', 'move', 'principle', 'skill'],
  situation: ['phase'], 'coaching-model': ['system', 'principle'],
};
export function collectionFor(record) {
  if (record.naming === 'source-specific' || record.kind === 'coaching-model') return 'examples';
  if (record.kind === 'tactic' && record.naming === 'editorial') return 'supporting';
  return ['strategy', 'system', 'pattern', 'tactic'].includes(record.kind) ? 'core' : 'supporting';
}
export function classificationMap(data, classification) {
  if (classification.datasetVersion !== data.version || !Array.isArray(classification.records)) throw new Error('Classification version mismatch');
  const map = new Map(classification.records.map(r => [r.conceptId, r]));
  if (map.size !== data.concepts.length || classification.records.length !== data.concepts.length || data.concepts.some(c => !map.has(c.id))) throw new Error('Classification coverage mismatch');
  for (const record of map.values()) {
    if (!Object.hasOwn(kindLabels, record.kind) || !Object.hasOwn(namingLabels, record.naming) || record.canonicalId !== record.conceptId) throw new Error('Invalid classification record');
  }
  return map;
}

/** Verify the actual response bytes, not merely a cache-key query parameter. */
export async function parseClassifiedDataset(raw, classification) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hash = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
  if (hash !== classification.datasetSha256) throw new Error('Classification dataset digest mismatch');
  const data = JSON.parse(raw);
  return { data, classifications: classificationMap(data, classification) };
}
