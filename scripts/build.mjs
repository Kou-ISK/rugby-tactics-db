import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { checkDataset } from './lib/dataset.mjs';
import { prepareBrowserAssets } from './lib/browser-assets.mjs';
const root=new URL('../',import.meta.url);
const { data, raw } = await checkDataset();
await rm(new URL('dist',root),{recursive:true,force:true});
await mkdir(new URL('dist/data/concepts/',root),{recursive:true});
await mkdir(new URL('dist/exports/',root),{recursive:true});
for(const file of ['index.html','style.css','app.mjs','search.mjs','mark.svg']) await cp(new URL('src/'+file,root),new URL('dist/'+file,root));
const browserAssets = await prepareBrowserAssets({
  html: await readFile(new URL('src/index.html', root), 'utf8'),
  app: await readFile(new URL('src/app.mjs', root), 'utf8'),
  search: await readFile(new URL('src/search.mjs', root)),
  style: await readFile(new URL('src/style.css', root)),
  icon: await readFile(new URL('src/mark.svg', root)),
  dataset: raw,
});
await writeFile(new URL('dist/index.html', root), browserAssets.html);
await writeFile(new URL('dist/app.mjs', root), browserAssets.app);
for (const file of ['LICENSE', 'DATA-LICENSE.md']) await cp(new URL(file,root),new URL('dist/'+file,root));
await mkdir(new URL('dist/schemas/',root),{recursive:true});
await cp(new URL('schemas/dataset.schema.json',root),new URL('dist/schemas/dataset.schema.json',root));
await cp(new URL('data/dataset.json',root),new URL('dist/data/dataset.json',root));
await cp(new URL('data/dataset.json',root),new URL(`dist/exports/rugby-tactics-db-${data.version}.json`,root));
const sha=value=>createHash('sha256').update(value).digest('hex');
const manifest={schemaVersion:data.schemaVersion,datasetVersion:data.version,updated:data.updated,license:data.license,dataset:'./data/dataset.json',snapshot:`./exports/rugby-tactics-db-${data.version}.json`,schema:'./schemas/dataset.schema.json',sha256:sha(raw),concepts:[]};
for(const c of data.concepts){
  const text=JSON.stringify(c,null,2)+'\n';const path=`data/concepts/${c.id.slice(4)}.json`;
  await writeFile(new URL('dist/'+path,root),text);
  manifest.concepts.push({id:c.id,version:c.version,path:'./'+path,sha256:sha(text),executionReady:c.execution.ready});
}
await writeFile(new URL('dist/manifest.json',root),JSON.stringify(manifest,null,2)+'\n');
await writeFile(new URL('dist/.nojekyll',root),'');
console.log(`Built dist/ with ${data.concepts.length} concepts and SHA-256 manifest`);
