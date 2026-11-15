# Governance and review

The repository owner, [Kou-ISK](https://github.com/Kou-ISK), is the maintainer and final
integration decision maker. Other contributors can propose issues and draft PRs; this
document does not grant merge rights, reviewer status or authority to speak for the project.

## Review by change type

| Change | Required review before integration |
| --- | --- |
| Docs / tooling / site without claim changes | Technical correctness, compatibility and publication safety |
| Concept, alias, source, relationship or interpretation | Technical checks **and** evidence/scope/publication-rights review |
| `expert-reviewed` status | Actual qualified reviewer, consent to identification, date, exact scope and linked review record |
| Schema semantics, stable IDs, executable adapter | Design issue/ADR, migration + consumer regression evidence |
| License, private data, credentials, paid services, permissions | Explicit owner decision; do not include as incidental cleanup |

A technical review does not turn `source-backed` into `expert-reviewed`. Maintainers
may accept a clearly labelled source-backed editorial contribution without pretending
it had expert review. Prefer an independent review when available; disclose self-review
or AI assistance rather than inventing a human sign-off. Contributors cannot self-certify
someone else's approval. Review reasons and unresolved limits belong in the PR.

## Decision process

1. Discuss substantial data/model changes in an issue before writing a large patch.
2. Keep PRs small enough to review. Open as draft; run the documented checks.
3. Resolve relevant review findings. Verify the actual final commit, not an older green run.
4. A maintainer decides readiness and merge. Follow existing owner authorizations for
   delegated work; this document is not standing permission for an arbitrary agent.
5. Verify main checks and the expected deployment; document rollbacks as new commits.

Branch protection and mandatory approvals are **not automatically enabled** by these
files. They are an owner-controlled GitHub configuration decision. A passing workflow
alone cannot enforce human review. There is no elected steering committee, SLA or
promise of response times at this early stage.

## Scope

Prioritize clear reusable public concepts, not the largest vocabulary. Private team
extensions stay private. P2P and player cognition integrations remain separate adapters
with explicit approval and regression tests, not accidental dependencies of this repo.
