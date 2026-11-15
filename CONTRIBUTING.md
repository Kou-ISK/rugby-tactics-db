# Contributing / コントリビューション

日本語・英語どちらでも歓迎します。まず小さな訂正から始められます。
We value useful, evidence-backed shared knowledge, not the largest unreviewed glossary.
Read the [community expectations](CODE_OF_CONDUCT.md) and [review policy](GOVERNANCE.md).

## Choose where to edit

| Work | Files / guide |
| --- | --- |
| Concept, alias, relationship or correction | `data/concepts/` and [data authoring](docs/DATA-AUTHORING.md) |
| Source or citation | `data/sources/`; evidence references in affected concepts |
| Dataset metadata / order / registering IDs | `data/catalog.json` |
| Strict classification / name origin / true synonym evidence | `data/classification.json`; [taxonomy](docs/TAXONOMY.md) |
| Site / search / validation | `src/`, `scripts/`, `test/` |
| Public schema or consumer contract | `schemas/`, design issue and `docs/decisions/` |
| Build output | Do not edit or commit `dist/` |
| Aggregate compatibility data | `data/dataset.json` is generated; run `npm run assemble` |

## Development

Node.js 22 or later. No package installation, API key, account or private team data is
required. Fork and clone the repository, create a focused branch, then:

```sh
npm run assemble     # after editing data authoring files
npm run check        # assembly parity, schema/graph, tests and static build
npm run serve        # http://localhost:4173 (build first; no hot reload)
npm run check:versions -- --base "$(git rev-parse origin/main)"
npm run audit:history
git diff --check
```

For a fork, use the actual upstream base SHA rather than a stale `origin/main`. If a check
fails, fix it or explain the blocker; do not change the tests simply to permit bad data.
No global tools, automatic Git hooks or new account permissions are installed.

## Proposal to merge

1. For a substantial concept/schema change, open the corresponding issue template first.
2. State whether a term is a new concept, contextual name, variant or genuinely distinct move.
3. Write an original concise summary; supply public primary evidence, locators and limits.
   Separate source-supported facts from editorial interpretation. Never copy private material
   or copyrighted long passages/media. See [data rights](DATA-LICENSE.md).
4. Keep abstract roles and `execution.ready: false`. New data remain `source-backed` with
   null reviewer fields. Do not fabricate expert review, reviewer consent or access dates.
5. Review strict kind and name origin separately. Update classification coverage, evidence and
   its dataset version/SHA after assembly. Bump dataset/concept/classification versions as
   applicable when exported content changes and update `CHANGELOG.md`.
   Never recycle IDs. Do not upgrade `contextual` to `synonym` merely because search is similar.
6. Run the checks above. For UI changes, verify desktop/mobile layout, keyboard use, empty/error
   states, detail → related detail → Back/Forward, query restoration and deep links.
7. Inspect **every outgoing commit**, not just the final diff. See [Git history](docs/GIT-HISTORY.md).
8. Open a draft PR using the checklist. Describe evidence, compatibility, tests and limits.
   Obtain technical review plus content/publication-rights review for data changes before merge.

AI-assisted contributions are welcome; disclose material assistance when describing review.
They receive the same checks and do not substitute for source inspection or expert validation.
Code contributions use the existing MIT license; original data use the existing CC BY 4.0
license. External sources retain their rights. This does not ask you to grant rights you do not own.

Security/privacy reports must follow [SECURITY.md](SECURITY.md), not disclose sensitive data in
public issues. No new paid services, license terms or security permissions should be bundled
into an ordinary contribution.
