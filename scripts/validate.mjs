import { readFile } from 'node:fs/promises';
import { checkClassification } from './lib/classification.mjs';
import { validateDataset } from '../src/contract.mjs';
const data = JSON.parse(await readFile(new URL('../data/dataset.json', import.meta.url)));
const schema = JSON.parse(await readFile(new URL('../schemas/dataset.schema.json', import.meta.url)));
const errors = validateDataset(data, schema);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Valid: ${data.concepts.length} concepts / ${data.sources.length} sources / dataset ${data.version}`);

if (!errors.length) { await checkClassification(data, await readFile(new URL('../data/dataset.json', import.meta.url), 'utf8')); console.log('Valid: strict classification and identity evidence'); }
