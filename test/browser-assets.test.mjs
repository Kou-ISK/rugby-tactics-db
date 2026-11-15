import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareBrowserAssets } from '../scripts/lib/browser-assets.mjs';
const fixture = () => ({
  html: '<link href="./mark.svg"><link href="./style.css"><script src="./app.mjs"></script>',
  app: "import './search.mjs'; fetch('./data/dataset.json');",
  search: 'search', style: 'style', icon: 'icon', dataset: 'dataset',
});
test('browser dependency hashes are deterministic and change transitively', () => {
  const source = fixture();
  const initial = prepareBrowserAssets(source);
  assert.deepEqual(prepareBrowserAssets(source), initial);
  for (const key of ['search', 'dataset', 'app']) {
    const changed = prepareBrowserAssets({ ...source, [key]: source[key] + ' changed' });
    assert.notEqual(changed.app, initial.app);
    assert.notEqual(changed.html, initial.html);
  }
  for (const key of ['style', 'icon']) {
    const changed = prepareBrowserAssets({ ...source, [key]: source[key] + ' changed' });
    assert.equal(changed.app, initial.app);
    assert.notEqual(changed.html, initial.html);
  }
});
test('asset wiring fails closed if source references drift or duplicate', () => {
  const source = fixture();
  assert.throws(() => prepareBrowserAssets({ ...source, app: '' }), /Expected one asset reference/);
  assert.throws(() => prepareBrowserAssets({ ...source, html: source.html + '<script src="./app.mjs"></script>' }), /Expected one asset reference/);
});
