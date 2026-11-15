import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
const audit = fileURLToPath(new URL('../scripts/audit-history.mjs', import.meta.url));
async function repository(fn) {
  const cwd = await mkdtemp(tmpdir() + '/rugby-history-');
  const git = args => execFileSync('git', args, { cwd, stdio: 'pipe' });
  try {
    git(['init', '-q']); git(['config', 'user.name', 'Test']); git(['config', 'user.email', 'test@example.org']);
    const commit = async (path, content) => {
      await mkdir(cwd + '/' + path.split('/').slice(0, -1).join('/'), { recursive: true });
      await writeFile(cwd + '/' + path, content); git(['add', '.']); git(['commit', '-qm', 'test fixture']);
    };
    await fn({ cwd, git, commit, scan: () => spawnSync(process.execPath, [audit], { cwd, encoding: 'utf8' }) });
  } finally { await rm(cwd, { recursive: true, force: true }); }
}
test('history audit permits explicit reserved-domain URL fixtures but not ordinary credential URLs', async () => {
  await repository(async ({ commit, scan }) => {
    await commit('test/url.mjs', 'https://user:password@example.org');
    assert.equal(scan().status, 0);
    await commit('README.md', 'https://user:password@example.org');
    assert.notEqual(scan().status, 0);
  });
});
test('history audit catches removed secret-like content and never prints the candidate', async () => {
  await repository(async ({ commit, scan }) => {
    const candidate = 'ghp_' + 'a'.repeat(36); // Deliberately fake, created only in the temporary fixture repository.
    await commit('config.txt', candidate);
    await commit('config.txt', 'removed');
    const result = scan();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /github-token/);
    assert.ok(!result.stderr.includes(candidate));
  });
});
test('history audit flags generated/private paths and large blobs', async () => {
  await repository(async ({ commit, scan }) => {
    await commit('dist/index.html', '<html>example</html>');
    assert.match(scan().stderr, /unexpected-publishable-path/);
    await commit('large.txt', 'x'.repeat(1024 * 1024 + 1));
    assert.match(scan().stderr, /blob-over-1-MiB/);
  });
});

test('history audit inspects duplicate blob paths and paths removed from the final tree', async () => {
  await repository(async ({ commit, git, scan }) => {
    await commit('a-safe.txt', 'same bytes');
    await commit('private/copy.txt', 'same bytes');
    git(['rm', 'private/copy.txt']); git(['commit', '-qm', 'remove private path']);
    assert.match(scan().stderr, /unexpected-publishable-path/);
  });
});
test('history audit refuses shallow clones rather than implying a complete audit', async () => {
  await repository(async ({ cwd, commit, git, scan }) => {
    await commit('README.md', 'one'); await commit('README.md', 'two');
    const head = git(['rev-parse', 'HEAD']).toString().trim();
    // Mark this disposable test repository as shallow using Git's documented boundary file.
    await writeFile(cwd + '/.git/shallow', head + '\n');
    assert.match(scan().stderr, /full clone/);
  });
});
