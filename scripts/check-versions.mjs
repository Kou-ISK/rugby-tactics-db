import { execFileSync } from 'node:child_process';
import { checkDataset } from './lib/dataset.mjs';
import { validateVersionChange } from './lib/versioning.mjs';
const [flag, sha, ...extra] = process.argv.slice(2);
if (flag !== '--base' || !/^[a-f0-9]{40}$/.test(sha || '') || extra.length) {
  throw new Error('Usage: npm run check:versions -- --base <full base commit SHA>');
}
const before = JSON.parse(execFileSync('git', ['show', `${sha}:data/dataset.json`], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));
const { data } = await checkDataset();
const errors = validateVersionChange(before, data);
if (errors.length) throw new Error(errors.join('\n'));
console.log(`Dataset/concept version policy passed against ${sha}`);
