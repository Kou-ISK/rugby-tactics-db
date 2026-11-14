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
invalid reviewer/date acceptance; static wording that would mislabel future reviewed records.

Aliases/relationships/variations currently have notes and concept-level source context rather
than individual evidence pointers. Finer-grained claim-level review is a planned schema improvement.
No autonomous execution or live P2P/RPM adapter is enabled.
