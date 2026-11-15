import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root=new URL('../',import.meta.url);
const sha=v=>createHash('sha256').update(v).digest('hex');
test('build exports exactly the manifest bytes and valid relative assets',async()=>{
  execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root});
  const manifest=JSON.parse(await readFile(new URL('dist/manifest.json',root)));
  const raw=await readFile(new URL('dist/'+manifest.dataset,root));
  assert.equal(sha(raw),manifest.sha256);
  assert.deepEqual(await readFile(new URL('dist/'+manifest.snapshot,root)),raw);
  for(const item of manifest.concepts){
    const content=await readFile(new URL('dist/'+item.path,root));
    assert.equal(sha(content),item.sha256);
    assert.equal(JSON.parse(content).id,item.id);
    assert.equal(item.executionReady,false);
  }
  const html=await readFile(new URL('dist/index.html',root),'utf8');
  for(const [,path] of html.matchAll(/(?:href|src)="(\.\/[^"#?]+)(?:\?[^"#]*)?"/g)){
    if(path==='./')continue;
    await readFile(new URL('dist/'+path,root));
  }
  const app = await readFile(new URL('dist/app.mjs', root), 'utf8');
  for (const [path, hash] of [...html.matchAll(/(?:href|src)="(\.\/[^"?]+)\?sha256=([a-f0-9]{64})"/g)].map(m => [m[1], m[2]])) {
    assert.equal(sha(await readFile(new URL('dist/' + path, root))), hash);
  }
  assert.match(html, /app\.mjs\?sha256=[a-f0-9]{64}/);
  assert.ok(app.includes(`'./data/dataset.json?sha256=${manifest.sha256}'`));
  const search = await readFile(new URL('dist/search.mjs', root));
  assert.ok(app.includes(`'./search.mjs?sha256=${sha(search)}'`));
  assert.ok(!/src="https?:/.test(html));
  assert.ok(html.includes('Content-Security-Policy'));
  assert.ok(html.includes('id="dataset-version"'));
  assert.ok(!html.includes('OPEN RUGBY KNOWLEDGE · v0.1'));
  assert.ok(html.includes('すべてを「戦術」とは数えません'));
  for (const file of ['LICENSE', 'DATA-LICENSE.md']) {
    assert.deepEqual(await readFile(new URL('dist/' + file, root)), await readFile(new URL(file, root)));
  }
});
