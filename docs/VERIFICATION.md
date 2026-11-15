# Verification record: v0.1.0

Date: 2026-11-14. This is technical verification, **not expert validation of rugby tactics**.

## Automated

- `npm run check`: dataset contract, graph integrity, search/alias tests, static build.
- Mutation coverage: duplicate and dangling IDs; missing/extra fields; unsafe source URLs;
  unknown actors/claims; sevens-only evidence broadened to XV; invalid dates/reviewer metadata;
  unsupported execution readiness.
- Build export hashes, snapshot equality, concept identifiers and relative local assets.
- Independent Python `jsonschema` Draft 2020-12 validation performed during initial build.
  It is an additional local check, not a required installed project dependency.
- `node --check src/app.mjs`.

## Browser checks

Cloud Chrome preview: home, English-name search, detail view, deep-link reload,
About navigation from detail, browser Back, return to filtered list, empty state and reset.
375 px content-width iframe (390 px frame with scrollbar): home/search/detail rendered without
horizontal overflow; both homepage and detail visually inspected. This checks responsive layout,
not native mobile hardware or every browser.

## Limits

No formal WCAG conformance audit, screen-reader session, native iOS/Android device test,
network-loss simulation or denied-clipboard permission test has been performed. Error and
clipboard fallback states exist in code. Automated tests do not check every coaching assertion.
Public source inspection is distinct from qualified coaching/safety review.

Review found and fixed: detail-to-About scroll restoration; source-format scope leakage;
invalid reviewer/date acceptance; duplicate hash/popstate renders losing keyboard focus; static wording that would mislabel future reviewed records.

Aliases/relationships/variations currently have notes and concept-level source context rather
than individual evidence pointers. Finer-grained claim-level review is a planned schema improvement.
No autonomous execution or live P2P/RPM adapter is enabled.

# Contribution foundation: tooling 0.2.0

Date: 2026-11-15. Dataset stays 0.1.0 and schema stays 1.0.0.

- Local Node 24.22.1: `npm run check`, all 32 tests passed; no dependencies installed.
- `check:versions` passed against `1e1ae1dcb4301f085270d00615b1ae74a7ff710d`.
- Independent Python JSON Schema Draft 2020-12 schema/data validation passed.
- Rebuilt the initial commit's site separately and compared all **24 existing deployed
  files byte for byte**. No differences, including UI, manifest, concept exports and
  dataset; only the two existing license documents are added to the new build.
- Dataset SHA-256 remains
  `bc9faec251165d47ad029913f90b6947179472365582df3b0326a4376bc60448`.
- Tests cover orphan/duplicate/missing IDs, unsafe paths, file/directory/output symlinks,
  stale aggregate exports, version/date regressions, removed concept IDs, historical
  duplicate/removed paths, secret-like redaction and shallow audit refusal.
- CI and Pages build both run version/history gates; PR code has no deployment access.
  Hosted Node 22 check/deployment results are recorded on the associated GitHub PR/run,
  not inferred from these local results.
- Independent technical review identified and corrected the deployment-gate gap,
  live-version-coupled test fixture, duplicate-blob path blind spot and output-symlink
  overwrite risk before publication.

No UI source, data claim, expert-review state, public schema or existing license text
changed. Existing UI assets are byte-identical, so this change does not claim a new
browser accessibility audit. No P2P/RPM integration or history rewrite was performed.
See [Git history](GIT-HISTORY.md) for the bounded full-history inspection and limitations.

# Tactical knowledge expansion: dataset 0.2.0 / site 0.3.0

Date: 2026-11-15. The corpus grows to 41 concepts / 39 references: 7 systems,
4 arrangements, 17 coordinated moves, 5 principles, 7 techniques and 1 game situation.
These counts are not a claim of 41 distinct complete tactical systems.

- `npm run check`: 38 unit/integration tests; deterministic assembly, schema/graph,
  search/aliases, versions, history tripwires, exports and corpus regression checks.
- Dataset/concept version checks against `b02bedd6b85d9b3e4b9464cae4f01976ea9dee82`.
- Independent Draft 2020-12 validation; all 14 original IDs retained; public schema bytes unchanged.
- All 27 new records contain original definitions, roles, relative positions, action/decision
  models, uncertainty and provenance. Direct source support is separate from interpretation.
- Independent content/technical review found and corrected relationship-direction errors
  and condition fields that repeated decision cues. Important source definitions were
  cross-checked; this is not a second exhaustive reading of all 39 references or expert approval.
- Browser execution in the local shell was blocked by the environment's socket restriction;
  the cloud browser could not connect to this workspace's localhost. No local visual pass is
  claimed. Public-site browser verification, hosted CI and exact-commit deployment results
  are recorded in the associated PR after publication.
- Source access methods and direct-retrieval limits are recorded in TAXONOMY.md and in
  affected review notes. Search-provided full page text is distinguished from a fresh direct
  publisher response. No video-viewing or screenshot/source-media rights are implied.

All execution flags remain false and all reviewer identities remain null. No live P2P/RPM
adapter, new license, repository permission change or history rewrite is included.
