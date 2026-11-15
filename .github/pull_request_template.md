## What and why

<!-- Link the issue. State whether this changes data, schema, code, UI or docs. Japanese/English welcome. -->

## Compatibility and evidence

<!-- List affected concept/source IDs. Explain source support versus editorial interpretation.
If data changed, list dataset + concept version bumps and the base commit used below.
If a schema or consumer contract changes, link the migration/ADR. -->

## Review checklist

- [ ] I have authority to publish these contributions under the existing repository licenses.
- [ ] No private playbooks, personal data, credentials, copied source media or long passages are included, including earlier commits on this branch.
- [ ] Data: source URLs/locators and scope were checked, interpretations and uncertainty are explicit (or N/A).
- [ ] `npm run assemble`, `npm run check`, and `npm run check:versions -- --base <base SHA>` pass.
- [ ] `npm run audit:history` and `git diff --check` pass; the complete PR commit range was inspected.
- [ ] UI changes: desktop/mobile, keyboard, empty/error, deep links and Back/Forward tested (or N/A).
- [ ] P2P/RPM behavior is unchanged, or a separately reviewed adapter/migration explains the change.

## Review / limitations

<!-- Record technical review, data/publication-rights review where relevant, and tests not run.
AI assistance is welcome; it is not expert validation or permission to publish third-party content. -->
