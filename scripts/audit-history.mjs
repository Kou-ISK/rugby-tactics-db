import { execFileSync } from 'node:child_process';
const git = args => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') throw new Error('History audit requires a full clone (not shallow)');
// This intentionally narrow tripwire is not a complete secret scanner or legal review.
// Never print matching content, URLs, commit metadata or token fragments.
const rules = [
  ['private-key', new RegExp('-----BEGIN ' + '(?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----')],
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ['aws-access-key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['service-secret', /\b(?:sk_live_|rk_live_|xox[baprs]-)[A-Za-z0-9-]{20,}\b/],
];
// A blob can appear at multiple paths, including a private path in an older commit.
// Enumerate every reachable root tree; deduplicate only content inspection, not paths.
const paths = new Map();
const trees = new Set(git(['log', '--all', '--format=%T']).trim().split('\n').filter(Boolean));
for (const tree of trees) {
  for (const entry of git(['ls-tree', '-r', '-z', tree]).split('\0').filter(Boolean)) {
    const tab = entry.indexOf('\t');
    const [, type, sha] = entry.slice(0, tab).split(' ');
    if (type !== 'blob') continue;
    if (!paths.has(sha)) paths.set(sha, new Set());
    paths.get(sha).add(entry.slice(tab + 1));
  }
}
if (!paths.size) throw new Error('No reachable committed files to inspect');
const metadata = execFileSync('git', ['cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize)'], {
  input: [...paths.keys()].join('\n') + '\n', encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
}).trim().split('\n');
let blobs = 0, findings = 0;
function report(sha, rule) { findings++; console.error(`Review required: blob ${sha} (${rule}); content redacted`); }
for (const line of metadata) {
  const [sha, type, size] = line.split(' ');
  if (type !== 'blob') continue;
  blobs++;
  if (Number(size) > 1024 * 1024) { report(sha, 'blob-over-1-MiB'); continue; }
  for (const path of paths.get(sha)) {
    if (/(^|\/)(?:node_modules|dist|private)(\/|$)|(^|\/)\.env(?:\.[^/]+)?$|\.(?:p12|pfx|key)$/i.test(path) && !/\.env\.example$/.test(path)) report(sha, 'unexpected-publishable-path');
  }
  const content = git(['cat-file', 'blob', sha]);
  for (const [name, pattern] of rules) if (pattern.test(content)) report(sha, name);
  for (const [candidate] of content.matchAll(/https?:\/\/[^\s<>"'`]+/g)) {
    try {
      const url = new URL(candidate);
      // Reserved example domains are permitted only for deliberate test fixtures.
      const fixture = [...paths.get(sha)].every(path => path.startsWith('test/')) && /^(?:[^.]+\.)*example\.(?:org|com|net)$/.test(url.hostname);
      if ((url.username || url.password) && !fixture) report(sha, 'credentials-in-url');
    } catch { /* non-URL prose */ }
  }
}
console.log(`Inspected ${blobs} reachable Git blobs across locally available refs; ${findings} candidate findings. Not a guarantee of no secrets or rights issues.`);
if (findings) process.exitCode = 1;
