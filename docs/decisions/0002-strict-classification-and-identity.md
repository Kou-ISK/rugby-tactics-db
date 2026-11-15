# ADR 0002: Strict classification and identity without breaking dataset v1

Status: accepted for dataset 0.3.0 / site 0.4.0, 2026-11-15.

## Problem

A collection of named systems, techniques, general coaching responsibilities and editorial
headings was being counted together. Adding purpose, roles or a sequence to a record does not
turn it into an independently established tactic. Similar words do not prove identical meaning.

## Decision

- Keep dataset schema 1.0.0 and all 41 existing IDs/JSON paths. Names, aliases and coarse levels
  can be corrected with concept/dataset version increases; no IDs are deleted or repurposed.
- Add an independently versioned `data/classification.json` companion and its own schema.
  It is authoritative for strict `kind`, name provenance, reasons and synonym evidence.
  Existing `level` remains a coarser compatibility field, constrained by an allowed crosswalk.
- Bind the companion to an exact dataset version and SHA-256. Validate all IDs exactly once.
  The browser checks actual response bytes before rendering, in addition to build-time checks
  and cache-key fingerprints. Missing/mismatched metadata produces an explicit loading error.
- Record canonical IDs explicitly. No pair of existing records was proven identical in this
  review, so all canonical IDs equal their existing IDs. Cross-record redirects are rejected
  until a separate migration contract provides evidence, tombstones and consumer behavior.
- Proven alternate names share the same record. Contextual names remain ambiguous; all true
  synonyms require explicit evidence. Non-contextual name collisions are rejected.
- The default view contains 13 source-attested systems, basic combinations and tactical options.
  Separate views expose 25 supporting elements/topics and 3 source-specific examples. This is
  navigation, not a claim that supporting skills are unimportant. There are no strategy records.

## Alternatives rejected

Adding fields directly to dataset v1 would break its closed schema. Deleting component records
would break existing IDs and discard useful knowledge. Merging similar moves to reduce the count
would erase meaningful distinctions. Calling every intentional action a tactic would retain the
original classification problem.

## Limits

This remains an editorial ontology, not an official federation standard or expert certification.
The companion cannot prove that a coaching assertion is true. Browser digest checks verify that
files agree, not publisher authenticity. Immutable releases and live P2P adapters remain separate.
