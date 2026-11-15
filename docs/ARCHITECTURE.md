# Design: semantics before execution

## Purpose

1. People find a term, distinguish nearby concepts, and inspect the reason for a claim.
2. Generative tools retrieve versioned knowledge without confusing vocabulary with implementation.
3. A future player model uses explicit prior knowledge without inventing observations.

This is an **additive candidate shared knowledge source**, not a declaration that
existing products have already adopted a new canonical database.

## Ownership boundary

| Layer | Owns | Does not own |
| --- | --- | --- |
| Rugby Tactics DB | Public, independently authored general concepts, evidence, terms, relationships, abstract role/decision models | Team secrets, player-specific state, fixed jersey bindings or rendering coordinates |
| Phrase2Play adapter | Bindings, supported rendering primitives, coordinate/time conversion, visual recipes | The universal meaning of rugby terms |
| Player cognition adapter | Perception, beliefs, memory, capabilities, decision policy | Omniscient world state disguised as perceived evidence |

Existing consumers are left unchanged in v0.1. No imports, deletions, automatic migration
or dependency switch are performed in other repositories.

## Data model

`data/catalog.json` plus `data/concepts/*.json` and `data/sources/*.json` are the
authoring source of truth. `data/dataset.json` is the deterministic, checked-in compatibility
export; `dist/` is derived and untracked. Builds reject divergence rather than choosing one
authority silently. See [ADR 0001](decisions/0001-split-authoring-stable-export.md).
The published JSON Schema defines exact required fields and rejects undeclared fields.

- `id`: stable, globally namespaced `rtk:<slug>`. Never recycle an ID for another concept.
- `version`: concept semantic version, independent of dataset version.
- `name`: display names, **not universal official terminology**. Japanese text is editorial.
- `aliases`: `synonym` supported by the cited usage, `translation` editorial, `contextual`
  potentially ambiguous. Neither alias nor textual similarity establishes interchangeability.
- `side`: attack / defence / both. Attack and defence filters include `both`.
- `level`: legacy coarse compatibility classification, constrained by the strict companion. system (team-wide organization), shape (relational arrangement), move (coordinated
  action), principle (decision guidance), skill (technique), phase (game situation).
  Taxonomy is editorial and can evolve; concept names do not determine level by themselves.
- `formats`: intended scope in this corpus, not certification under every competition's variations.
- `mechanics`: an explicitly **editorial model**, including abstract roles, relative positioning,
  ordered steps, cues and alternatives. No numerical coordinates or timings are universalized.
- `claims`: exact provenance links. `direct` means source support for the summary;
  `interpretation` means our organization of its ideas, not an endorsed execution policy.
- `relationships`: directional typed links. `similarTo` and `notSameAs` are not aliases.
  Semantic relations are editorial judgments and require review just as other content does.
- `review`: source-backed is not expert-reviewed. Expert review requires named review identity/date.
- `execution.ready`: **false by schema** in v1. A future executable contract requires a new
  design, not flipping a boolean in a concept file.

## Evidence and uncertainty

Only inspected public primary material is seeded. Original brief summaries are used, not
copied source paragraphs. Each structured role/step/decision references a claim whose
support explicitly says `interpretation`. Relations and taxonomy are editorial.

Source `formats` are the editor's applicability assessment of the source; they must not
be read as a federation certification. Sevens-only material must never silently become XV.
Law links are a prompt to verify the current applicable edition, trials and competition rules,
not an exhaustive legality checker. Access dates are provenance, not validity expiry dates.

A missing relation, alias or variation is unknown, not proof of absence. Unknown terms remain
unresolved. Ambiguous terms require context; retrieval must not silently choose a meaning.

## Validation and build

A dependency-free Node validator implements only the JSON Schema keywords used here.
It is not advertised as a complete JSON Schema engine. The test suite asserts every used
keyword is supported. Independent JSON Schema 2020-12 tools can validate the same file.

Additional graph rules reject duplicate IDs, unknown claims/roles/sources, dangling/self
relations, unsafe source URLs, source-scope broadening, invented reviewer state and execution readiness.
Tests cover search normalization, combined filters, contextual aliases and unknown terms.

The build fails on invalid data, emits a static website, one JSON per concept and SHA-256
manifest. No code is evaluated from knowledge. Browser text is escaped before HTML rendering.
No remote fonts, analytics, accounts or secrets are used. Links to sources open with `noopener`.

## Versioning and roadmap

Any meaning or model change bumps concept version and dataset version. Breaking field semantics
bump schema major version. Editorial spelling fixes still require a dataset version update.
Consumers pin a commit plus content hash. Do not overwrite a released meaning under the same ID/version.

Next: expert domain review, claim-level reviews, broader lineout/defensive coverage, additional
language variants, explicit alias namespaces, an immutable release archive, and adapter conformance
fixtures. Implement adapters only after their target consumers' regression suites are available.

## Contribution operations

[Data authoring](DATA-AUTHORING.md), [governance](../GOVERNANCE.md),
[release/version policy](RELEASE.md), and [Git history policy](GIT-HISTORY.md) define
review and publication boundaries. `npm run check` validates authoring/export parity;
PR/main CI additionally checks version changes and reachable-history tripwires.

[Taxonomy](TAXONOMY.md) distinguishes tactics from their component skills and game situations.
Dataset 0.2.0 expands the corpus; it does not make all records executable or expert-reviewed.

## Strict classification companion

`data/classification.json` and `schemas/classification.schema.json` add strict semantic kind,
name origin, canonical ID and evidenced equivalence without changing closed dataset schema 1.0.0.
The companion must cover every ID once, use the allowed kind/level crosswalk, and match the exact
dataset version and SHA-256. Both build and browser reject a mismatched pair. Browser response-byte
digest verification is separate from cache-key fingerprints.

Current canonical IDs equal existing IDs: the review did not establish any duplicate records.
Proven alternate names share an existing record; cross-ID redirects require a future explicit
migration contract. See ADR 0002 and CLASSIFICATION-REVIEW.md.
