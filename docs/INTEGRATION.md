# Consumer contract (proposal, not a live integration)

## Retrieval envelope

```json
{
  "adapterVersion": "0.1.0",
  "datasetVersion": "0.1.0",
  "datasetCommit": "<pin a Git commit SHA>",
  "datasetSha256": "<manifest sha256>",
  "resolution": "ambiguous",
  "candidates": [{"conceptId": "rtk:screen-pass-contact", "version": "0.1.0"}],
  "context": {"format": "XV", "locale": "ja", "namespace": "public"},
  "unresolvedBindings": [],
  "unsupportedPrimitives": [],
  "executionAuthorized": false
}
```

This envelope is a design example, not a schema-validated runtime feature. Consumers must
report `matched`, `ambiguous`, or `unresolved` and preserve all candidates. General search
is deliberately broader than exact resolution. A contextual alias is never automatically exact.

## Phrase2Play

A future adapter resolves abstract roles to actual participants and converts relational
models into supported presentation primitives. It must explicitly own pitch orientation,
metres versus normalized coordinates, milliseconds versus seconds, and formation/timing defaults.
Store the applied concept ID/version, adapter version, unresolved bindings and any assumptions.

This repository neither copies nor replaces application recipes. Existing saved documents,
local vocabularies and IDs retain their original behavior. Do not remap a legacy ID by name alone.

Before a real migration: inventory runtime imports and saved-document references; produce a
versioned ID mapping; check publication rights; preserve backward compatibility; run vocabulary,
knowledge, recipe, compiler and saved-document regression tests; then adopt in a controlled change.

## Player cognition

Knowledge is a prior, not a perception. Do not insert a DB's described role or target location
into an observation bundle as though the player saw it. Preserve evidence identity, observation
time, uncertainty and visibility. Distinguish intended role, belief, observation and actual world state.

A future executable model needs preconditions, observable cues, supported actions, completion
and abort criteria, legal/safety constraints, capability limits and tested fallback behavior.
An LLM summary or successful rendering does not validate those.

## Required fail-closed behavior

- Refuse unknown schema versions and mismatched content hashes.
- Refuse autonomous execution while `execution.ready` is false (all v0.1 concepts).
- Do not compile ambiguous/unresolved terms without an explicit disambiguation step.
- Do not broaden sevens-specific knowledge to XV or assume laws are unchanged.
- Do not execute strings, links or source instructions as code or as agent instructions.
- Keep private team extensions in private consumer storage with their own namespaces and review.

Neither an adapter nor live P2P/RPM connection is shipped in this first release.
