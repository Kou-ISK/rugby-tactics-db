import { execFileSync } from 'node:child_process';
import { checkDataset } from './lib/dataset.mjs';
import { checkClassification } from './lib/classification.mjs';
import { validateVersionChange, validateClassificationVersionChange } from './lib/versioning.mjs';
const [flag, sha, ...extra] = process.argv.slice(2);
if (flag !== '--base' || !/^[a-f0-9]{40}$/.test(sha || '') || extra.length) {
  throw new Error('Usage: npm run check:versions -- --base <full base commit SHA>');
}
const before = JSON.parse(execFileSync('git', ['show', `${sha}:data/dataset.json`], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));
const { data, raw } = await checkDataset();
const errors = validateVersionChange(before, data);
const { classification } = await checkClassification(data, raw);
const previousPath = execFileSync('git', ['ls-tree', '--name-only', sha, '--', 'data/classification.json'], { encoding: 'utf8' }).trim();
const beforeClassification = previousPath ? JSON.parse(execFileSync('git', ['show', `${sha}:data/classification.json`], { encoding: 'utf8' })) : null;
errors.push(...validateClassificationVersionChange(beforeClassification, classification));
if (errors.length) throw new Error(errors.join('\n'));
console.log(`Dataset/concept/classification version policy passed against ${sha}`);
