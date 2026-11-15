# Data authoring / データ編集

## Canonical files and generated compatibility export

Edit `data/concepts/<slug>.json` or `data/sources/<source-id>.json`. `data/catalog.json`
contains dataset metadata and the ordered ID lists. The lists deliberately preserve
v0.1 search/export order rather than silently changing existing consumers.

`data/dataset.json` remains committed at its original path for raw-file consumers, but
is **generated, not a second editable authority**. Run `npm run assemble` and include the
result in the same PR. CI and builds refuse divergence. Missing, orphaned, duplicate,
unsafe-path or symlinked records fail closed. The public `schemas/dataset.schema.json`
continues to describe the aggregate export; the graph validator checks cross-references.

## Add a concept

1. Discuss public evidence and whether this is a new concept, alias, variant or relation.
2. Use a stable `rtk:<lowercase-hyphenated-slug>` ID. Copy an existing record's structure,
   replacing every claim, role, source and uncertainty deliberately, not only the name.
3. Add any new public primary source as a separate source file. Include title, publisher,
   HTTPS URL, actual access date, format scope and a rights statement. Reference the
   relevant section/page/timestamp in each claim's evidence. Never invent an access check.
4. List new IDs once in `catalog.json`. File basename must match ID (without `rtk:`).
5. State Japanese/English display names, alias context, applicability, limits and at least
   two decision alternatives. Use abstract roles, not named players or fixed jersey IDs.
6. Distinguish `direct` source support from `interpretation`. Mechanics remain an editorial
   model. `source-backed` is not expert validation; reviewer fields stay null by default.
7. Keep `execution.ready: false`. This schema cannot authorize autonomous play execution.
8. Bump versions as in [release policy](RELEASE.md), assemble and run checks, open a draft PR.

## Evidence and rights review

- Public availability does not grant redistribution rights. Link to source material and
  write original concise summaries. Do not store its full text, screenshots, diagrams,
  photographs, video, download cache or scraped corpus in any commit.
- Contributor-created text must be publishable under the **existing** CC BY 4.0 grant.
  External source rights stay with their owners. Code remains MIT; no license is changed.
- Private team calls, playbooks, personal information and private conversations are out
  of scope even if an AI can access them. Do not cite a private conversation as public evidence.
- Check whether the source is XV, sevens, law/trial-specific or contextual. Do not broaden
  its scope or turn a named team's interpretation into a universal term.
- Claims, aliases, relationships and variations all need review. v1 lacks individual
  evidence fields for some of those structures, so explain support/interpretation in their
  existing note fields and the PR. Do not invent unsupported extra schema fields.
- `expert-reviewed` requires a real reviewer, consent to identification, date, exact scope
  and a linked public review record in `review.note`. A CI pass or AI review does not qualify.
- Broken/moved source links require an editorial check. Preserve what is known and report
  uncertainty; do not silently substitute another source or pretend it was re-read.

## Change a public contract

Document the reason, alternatives, migration and consumer impact in `docs/decisions/`.
Never alter field semantics, ID meaning, competition scope or alias equivalence as cosmetic
cleanup. P2P adapters, saved documents and player cognition are separate contracts.
[INTEGRATION.md](INTEGRATION.md) remains a proposal, not a live connection.
