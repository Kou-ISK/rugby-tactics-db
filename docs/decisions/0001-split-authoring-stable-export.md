# ADR 0001: Split authoring, preserve the public aggregate

Status: accepted for the contribution-foundation change (2026-11-15).

## Context

The initial 14 concepts and 14 sources share an 83,827-byte dataset. A single file is
simple to consume but produces unnecessary merge conflicts as outside contributors edit
different concepts. Public raw-file and Pages consumers already have stable aggregate URLs.

## Decision

Use one file per concept and source, with an explicit ordered catalog. Deterministically
assemble the existing aggregate with exactly the same serialization and validate it.
Commit the aggregate for compatibility but reject drift in CI and builds. Preserve all
existing dataset bytes, IDs, order, versions, schema and published UI/assets in this change.
Add separate authoring/version tests and document ownership boundaries.

## Alternatives and consequences

- Keeping only the monolith is simplest today, but scales poorly for independent reviews.
- Removing the aggregate would break raw-file consumers and require an unnecessary migration.
- Alphabetic reordering is deterministic but changes output/search order and hash without
  a semantic benefit; the explicit catalog keeps compatibility.
- Adding a database/API/build framework introduces operation and dependency burden not
  justified by this corpus; the Node-only static build remains.

The catalog adds a small registration step and the checked-in generated export creates
review noise. `linguist-generated` marks that export and CI eliminates dual-authority drift.
A future schema migration is a separate decision; the current data are not executable.
