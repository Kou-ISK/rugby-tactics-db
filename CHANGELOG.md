# Changelog

Site/tooling and dataset versions are independent. No tag or release archive is implied
by an entry here; use exact commits and the manifest hash until one is published.

## Dataset 0.3.0 / site 0.4.0 / classification 0.1.0 — 2026-11-15

- Audit all 41 records; split the main 13 named systems/combinations/options from 25 supporting
  items and 3 source-specific examples. No overarching strategy is claimed.
- Correct technique/principle/role classifications and editor-created headings; distinguish
  source-attested names from author-local proposals and editorial descriptions.
- Gather actual synonymous names under existing IDs: Switch/Scissors, Cut-out/Miss pass,
  Loop/Run around, Up-and-under/Bomb. Japanese ミスパス remains ambiguous.
- Correct man-on-man/drift's misleading fixed-assignment contrast and rush/sweeper relation.
- Add separately validated, versioned classification/identity metadata bound to dataset SHA.
  Keep all existing IDs, JSON paths and dataset schema 1.0.0; no speculative record deletion.
- Add browser response-byte pairing verification, strict-category filters and evidence displays.

## Dataset 0.2.0 / site 0.3.0 — 2026-11-15

- Grow from 14 to 41 concepts and from 14 to 39 references. These are not 41 interchangeable tactics.
- Add attacking systems (1-3-3-1, 2-4-2, a named Ruck & Run model), a three-player pod,
  pull-back/short-pass/loop combinations, unders/overs lines and a sourced scrum example.
- Add quick-tap, short-side, pick-and-go and direction-change attacks; width/depth and mismatch concepts.
- Add grubber/chip/high-ball/box/cross-field applications, backfield pendulum, man-on-man
  defence, defensive realignment, restart reception and counter-ruck.
- Reclassify cut-out/offload as skills, maul continuation as a principle, restart chase as
  a move. Those four concept versions become 0.1.1; their IDs are unchanged.
- Correct the direction of support relationships; counter-attack, close-support and dummy-pass
  also increase to 0.1.1 for relation edits.
- Explicitly distinguish tactics, techniques and situations in the site; show dataset version dynamically.
- Keep schema 1.0.0, existing URLs/IDs and all execution gates. No P2P/RPM connection.
- New evidence was read from public federation/coach-authored material; diagrams/videos and
  source prose are not redistributed. Expert rugby review and executable-model validation remain undone.
- Record direct-fetch limitations separately from inspected search-provided source text; the original
  sevens source keeps its earlier access date. See the evidence access record in TAXONOMY.md.

## Tooling 0.2.0 — 2026-11-15

- Split data authoring into per-concept/per-source files and an ordered catalog.
- Keep dataset 0.1.0, schema 1.0.0, every ID and all aggregate bytes unchanged.
- Add deterministic assembly/drift checks, version regression guards and history tripwire.
- Add contribution/review, source-rights, security, release and Git-history documentation.
- Add issue/PR templates; ship the existing code/data license texts in the static build.
- No P2P/RPM integration, expert-review promotion, repository permissions or licenses changed.

## Dataset 0.1.0 / initial site — 2026-11-14

- 14 source-backed concepts and 14 public primary references.
- Japanese/English search, concept exports and SHA-256 manifest.
- All records remain non-executable and not expert-reviewed.

## Site/tooling 0.3.1 — 2026-11-15

- Add deterministic content hashes to browser asset and dataset request URLs. Public-site
  checking caught new HTML briefly using cached old JavaScript/data after a deployment.
- Preserve every stable public path and dataset byte. No cache/security settings change.
- Test dependency-hash propagation and fail closed if build-time asset references drift.
