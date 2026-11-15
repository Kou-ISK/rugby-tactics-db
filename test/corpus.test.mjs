import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { searchConcepts, resolveTerm, labels } from '../src/search.mjs';
const data = JSON.parse(await readFile(new URL('../data/dataset.json', import.meta.url)));
const byId = id => data.concepts.find(c => c.id === 'rtk:' + id);
test('expanded corpus retains concrete tactical systems, moves and non-tactical components', () => {
  for (const id of ['one-three-three-one', 'two-four-two', 'backfield-pendulum']) assert.equal(byId(id).level, 'system');
  for (const id of ['quick-tap-attack', 'short-side-attack', 'loop-move', 'cross-field-kick']) assert.equal(byId(id).level, 'move');
  for (const id of ['cut-out-pass', 'offload-continuity', 'draw-and-pass']) assert.equal(byId(id).level, 'skill');
  assert.equal(byId('maul-continuity').level, 'principle');
  assert.equal(byId('restart-kick-chase').level, 'move');
  assert.equal(byId('counter-attack').level, 'phase');
  assert.equal(labels.level.skill, '技術');
});
test('Japanese and English search find newly collected tactical knowledge', () => {
  for (const [q, id] of [['1-3-3-1', 'one-three-three-one'], ['2-4-2', 'two-four-two'],
    ['ポッド', 'three-player-pod'], ['プルバック', 'pull-back-pass'], ['unders', 'unders-line'],
    ['ペンデュラム', 'backfield-pendulum'], ['short-side', 'short-side-attack'], ['chip', 'chip-and-chase']]) {
    assert.ok(searchConcepts(data.concepts, { q }).some(c => c.id === 'rtk:' + id), q);
  }
});
test('contextual short names are not silently promoted to unambiguous executable calls', () => {
  for (const term of ['1-3-3-1', '2-4-2', 'tip-on', 'Split']) {
    assert.equal(resolveTerm(data.concepts, term, { format: 'XV' }).status, 'ambiguous', term);
  }
  assert.equal(resolveTerm(data.concepts, '1-3-3-1', { format: 'sevens' }).status, 'unresolved');
});
test('related but different actions are explicitly distinguished', () => {
  for (const [from, to] of [['pull-back-pass', 'screen-pass-contact'], ['phase-direction-change', 'switch-pass'], ['short-pass-before-contact', 'offload-continuity']]) {
    assert.ok(byId(from).relationships.some(r => r.type === 'notSameAs' && r.target === 'rtk:' + to));
  }
});
test('every knowledge record contains supported meaning and non-executable editorial mechanics', () => {
  for (const c of data.concepts) {
    assert.ok(c.claims.some(claim => claim.evidence.some(e => e.support === 'direct')), c.id);
    assert.ok(c.mechanics.roles.length && c.mechanics.sequence.length && c.mechanics.decisions.every(d => d.options.length >= 2), c.id);
    assert.equal(c.execution.ready, false);
  }
});
test('support and component relationships preserve their direction', () => {
  assert.ok(byId('close-support').relationships.some(r => r.type === 'enables' && r.target === 'rtk:counter-attack'));
  assert.ok(!byId('counter-attack').relationships.some(r => r.type === 'enables' && r.target === 'rtk:close-support'));
  assert.ok(byId('three-player-pod').relationships.some(r => r.type === 'partOf' && r.target === 'rtk:one-three-three-one'));
  assert.ok(!byId('one-three-three-one').relationships.some(r => r.type === 'enables' && r.target === 'rtk:three-player-pod'));
});
