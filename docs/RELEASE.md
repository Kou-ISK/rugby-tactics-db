# Versions, releases and rollback

Three versions serve different purposes:

- `package.json`: site/tooling version. A tooling-only release need not change dataset bytes.
- `data/catalog.json.version`: dataset content version. Any exported content change increases it.
- Each concept's `version`: changed concept meaning, model, evidence or metadata increases it.
- `schemaVersion`: public field semantics. Breaking changes need a major version and migration ADR.

Version strings are numeric `major.minor.patch`; prereleases are not supported by v1.
Before 1.0, use a minor dataset bump for intentional breaking semantics and document
migration; use patch for compatible corrections. Never recycle IDs or silently remove
concepts. The version guard conservatively rejects removals until a tombstone/migration
contract exists. Source-only edits bump the dataset; review affected concepts and bump
them too if the evidence changes their interpretation. Update `updated` to the actual
editorial update date (never fabricate a verification/access date).

## Check a candidate

```sh
npm run assemble
npm run check
npm run check:versions -- --base "$(git rev-parse origin/main)"
npm run audit:history
git diff --check
```

CI compares the dataset against the PR base, and against the previous main commit on
push. These checks catch missing version increases, not the correctness of a change or
compatibility of all downstream users. Run relevant consumer regressions separately.
Data changes also require an entry in `CHANGELOG.md` identifying IDs and limitations.

## Integration and publication

Open a draft PR, complete the review in [governance](../GOVERNANCE.md), then integrate
under the owner's current authorization. Existing Pages deployment follows `main`.
Verify check/build/deploy results for the exact merged SHA and fetch the public manifest,
dataset and a concept export. Check SHA-256 against the returned bytes, not a reserialized
JSON value. Deployment success and dataset/expert review are different claims.

For a durable release, a maintainer may create a version tag and GitHub Release only
within the authorized publishing scope. Record the exact commit, dataset/schema versions,
`manifest.json`, original export bytes, SHA-256 values, `LICENSE`, `DATA-LICENSE.md`,
changelog and verification limits. Never move a published version tag or replace release
assets with different bytes. Use a new version to correct them. No new write-enabled
release workflow or automatic tagging is enabled here.

Pages' `exports/rugby-tactics-db-<version>.json` is a snapshot of the current deployment,
**not an immutable archive**. Its old path may disappear on the next deployment. Until
a release archive actually exists, consumers must pin a commit and its content hash.

## Rollback

Prefer a reviewed revert or corrective commit rather than a force-push. A code-only
revert can redeploy the previous behavior. For data, publish corrected/restored content
with a new higher dataset version and appropriate concept versions rather than silently
reusing old versions; explain the history in the changelog. Restore files from the known
commit, reassemble, run all checks and verify the deployed hash. Source-rights incidents
may require a separate coordinated takedown; follow SECURITY.md rather than this ordinary
rollback path. Repository settings, access and paid services are not changed by release.
