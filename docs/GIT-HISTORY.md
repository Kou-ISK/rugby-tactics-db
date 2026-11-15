# Git history is a published artifact

A public repository exposes old commits as well as the latest files. Treat every
commit intended for push as publishable. `.gitignore` does not remove tracked files
and squashing a PR does not reliably erase its original commits from GitHub.

## Before push

```sh
git status --short
git diff --check
git diff --cached --stat
git diff --cached              # inspect locally; do not paste sensitive output in an issue
git log --oneline <base>..HEAD  # inspect every intended commit, not only the final tree
npm run audit:history          # full clone; locally reachable refs only
```

Review added/deleted files, commit messages and author email. Use a GitHub noreply
address if you do not want to publish a personal email. Never commit credentials,
`.env`, private team material, recordings, source PDFs/screenshots or generated `dist/`
/ `node_modules/`. Keep test fixtures fictional and clearly labelled. Use meaningful
commits; separate schema/data changes from mechanical moves where practical.

`audit:history` scans locally available reachable blobs for a small set of secret-like
patterns, credential URLs, unexpected paths and blobs above 1 MiB. It redacts matches
and fails on candidates. Review false positives locally; never silence a real finding
merely to obtain green CI. It does not inspect deleted/unavailable remote refs, hosted
logs, forks, private GitHub state, natural-language personal information or every token
format. It is a tripwire, **not a comprehensive secret scanner or rights audit**. Inspect
new staged changes manually before committing; rerun the audit after committing, before
pushing. CI has no ability to undo a leak that was already pushed.

## After publication

Do not rewrite public history for cosmetic cleanup, author impersonation, or to hide
review findings. Prefer an additive corrective commit. For an actual secret or rights
incident, follow [SECURITY.md](../SECURITY.md): stop redistribution, revoke credentials
where relevant, coordinate remediation with the owner, then consider history and
hosting cleanup. Do not force-push or delete tags/releases unilaterally. An approved
rewrite still cannot recall copies other people already downloaded.

## Initial audit boundary (2026-11-15)

A full mirror of the public repository at `1e1ae1dcb4301f085270d00615b1ae74a7ff710d`
contained three reachable commits, one branch, no tags, and 26 unique blobs totaling
182,872 bytes. Largest blob: the 83,827-byte dataset. Git integrity checks passed.
No private-key/token-pattern candidates, private assets, generated build directories,
source media or non-noreply author emails were identified. One credential-bearing
example URL was a deliberate reserved-domain validation fixture, not a live credential.

This is a bounded technical inspection of the available history, not a guarantee that
all secrets or personal information would be detected, and not a legal determination
about every paraphrase. No history rewrite was performed.
