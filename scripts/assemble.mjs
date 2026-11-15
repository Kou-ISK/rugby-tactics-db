import { checkDataset, writeDataset } from './lib/dataset.mjs';
const args = process.argv.slice(2);
if (args.length > 1 || (args.length && args[0] !== '--check')) throw new Error('Usage: node scripts/assemble.mjs [--check]');
if (args[0] === '--check') {
  await checkDataset();
  console.log('Authoring files and compatibility export match exactly');
} else {
  const data = await writeDataset();
  console.log(`Assembled ${data.concepts.length} concepts / ${data.sources.length} sources`);
}
