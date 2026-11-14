import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateSchema,validateDataset } from '../src/contract.mjs';
import { searchConcepts,resolveTerm,normalize } from '../src/search.mjs';
const data=JSON.parse(await readFile(new URL('../data/dataset.json',import.meta.url)));
const schema=JSON.parse(await readFile(new URL('../schemas/dataset.schema.json',import.meta.url)));
const mutate=fn=>{const clone=structuredClone(data);fn(clone);return validateDataset(clone,schema);};
test('dataset satisfies public schema and graph invariants',()=>assert.deepEqual(validateDataset(data,schema),[]));
test('schema rejects missing keys and unexpected private payloads',()=>{
  assert.ok(mutate(d=>delete d.concepts[0].claims).length);
  assert.ok(mutate(d=>d.concepts[0].privateTeamNotes='secret').length);
});
test('invalid source / dangling graph / duplicate ID fail closed',()=>{
  assert.ok(mutate(d=>d.sources[0].url='javascript:alert(1)').length);
  assert.ok(mutate(d=>d.sources[0].url='https://user:password@example.org').length);
  assert.ok(mutate(d=>d.concepts[0].relationships.push({type:'similarTo',target:'rtk:missing',note:'test'})).length);
  assert.ok(mutate(d=>d.concepts.push(d.concepts[0])).length);
});
test('actors, claim evidence and positioning require valid references',()=>{
  assert.ok(mutate(d=>d.concepts[0].mechanics.sequence[0].actor='missing').length);
  assert.ok(mutate(d=>d.concepts[0].claims[0].evidence[0].source='missing').length);
  assert.ok(mutate(d=>d.concepts[0].mechanics.sequence[0].claimRefs=['missing']).length);
});
test('execution and expert-review gates cannot be claimed without a new contract',()=>{
  assert.ok(mutate(d=>d.concepts[0].execution.ready=true).length);
  assert.ok(mutate(d=>d.concepts[0].review.status='expert-reviewed').length);
});
test('source verification is never implicit expert review',()=>assert.ok(data.concepts.every(c=>c.review.status==='source-backed' && !c.review.reviewedBy)));
test('all source evidence is HTTPS and all original text marked licensed',()=>{assert.equal(data.license,'CC-BY-4.0');assert.ok(data.sources.every(s=>s.url.startsWith('https://')));});
test('validator supports every keyword used in published schema',()=>{
  const allowed=new Set(['$schema','$id','title','type','properties','required','additionalProperties','enum','const','minLength','pattern','items','minItems']);
  function walk(s){for(const k of Object.keys(s))assert.ok(allowed.has(k),`unsupported keyword ${k}`);if(s.properties)Object.values(s.properties).forEach(walk);if(s.items)walk(s.items);}
  walk(schema);assert.ok(validateSchema([], {type:'array',minItems:1}).length);
});
test('Japanese, case and full-width search normalize',()=>{
  assert.equal(normalize('ＤＲＩＦＴ'),'drift');assert.equal(normalize('ドリフト'),'どりふと');
  assert.ok(searchConcepts(data.concepts,{q:'DRIFT'}).some(c=>c.id==='rtk:drift-defence'));
  assert.ok(searchConcepts(data.concepts,{q:'どりふと'}).some(c=>c.id==='rtk:drift-defence'));
});
test('combined filters, empty result, and empty query',()=>{
  assert.equal(searchConcepts(data.concepts,{}).length,data.concepts.length);
  assert.equal(searchConcepts(data.concepts,{q:'does-not-exist-987'}).length,0);
  assert.ok(searchConcepts(data.concepts,{side:'defence',format:'sevens'}).every(c=>c.formats.includes('sevens')&&['defence','both'].includes(c.side)));
});
test('exact names resolve; unknown and empty inputs remain unresolved',()=>{
  assert.equal(resolveTerm(data.concepts,data.concepts[0].name.en).status,'matched');
  assert.equal(resolveTerm(data.concepts,'unknown').status,'unresolved');
  assert.equal(resolveTerm(data.concepts,'').status,'unresolved');
});
test('homonyms and contextual aliases remain ambiguous',()=>{
  const clone=structuredClone(data.concepts[0]);clone.id='rtk:other';
  assert.equal(resolveTerm([data.concepts[0],clone],clone.name.en).status,'ambiguous');
  clone.aliases=[{label:'ambiguous alias',kind:'contextual',language:'en',note:'context dependent'}];
  assert.equal(resolveTerm([clone],'ambiguous alias').status,'ambiguous');
});
test('sevens-specific rush must not match XV',()=>assert.equal(resolveTerm(data.concepts,'rtk:rush-defence-sevens',{format:'XV'}).status,'unresolved'));

test('sevens source cannot silently be generalized to XV',()=>assert.ok(mutate(d=>d.concepts.find(c=>c.id==='rtk:rush-defence-sevens').formats.push('XV')).length));

test('dates and reviewer metadata are real, nonempty and not future',()=>{
  assert.ok(mutate(d=>d.sources[0].accessed='2026-02-31').length);
  assert.ok(mutate(d=>{d.concepts[0].review={status:'expert-reviewed',note:'test',reviewedBy:' ',reviewedAt:'not-a-date'};}).length);
  assert.ok(mutate(d=>d.updated='2026-13-01').length);
});
