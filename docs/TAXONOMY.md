# What counts as a tactic? / 何を「戦術」として扱うか

**This corpus is not a list of interchangeable “tactics”.** It contains tactical systems,
arrangements, coordinated moves, decision principles, techniques and situations. A pass
technique can support a tactic without being a complete tactic itself. A source link is
evidence, not the database's primary product: each record should explain meaning, purpose,
roles, action and limits in original language.

The `level` field is the editor's primary classification of **what this record explains**,
not a universal rugby standard or a verbatim publisher taxonomy. A source can file a switch
under handling skills while this DB models the coordinated crossing of two runners as a move.

| Stable value | Display | Scope | Examples |
| --- | --- | --- | --- |
| `system` | 戦術体系 | Repeated team/unit organisation with choices | Drift defence; 1-3-3-1 |
| `shape` | 配置 | Relative arrangement; not a complete sequence | Three-player pod; attacking width/depth |
| `move` | 連係 | Coordinated action to exploit a situation | Loop; quick-tap attack; kick-and-chase |
| `principle` | 原則 | Decision guidance across possible actions | Contest or reload; identifying mismatches |
| `skill` | 技術 | An individual technique usable in many tactics | Cut-out pass; offload; draw-and-pass |
| `phase` | 局面 | A game situation in which tactics are chosen | Counter-attack |

Do not report the total record count as a count of complete tactical systems. Some records
are named, source-specific coaching models. Their names are not universal play calls.
Pure vocabulary that has no action model should not receive invented mechanics merely to
increase the record count. A separate glossary contract can be designed if needed.

## Review of the initial 14 records

The initial set was a useful seed but **thin in attacking systems and concrete attacking
patterns**. Its categories also mixed techniques and coordinated moves. The 0.2.0 dataset
keeps all original IDs while correcting four primary classifications:

| Record | Previous → current | Reason |
| --- | --- | --- |
| `rtk:cut-out-pass` | move → skill | The record explains a passing technique, not an entire attack. |
| `rtk:offload-continuity` | move → skill | The source centres on the carrier's passing technique during/after a tackle. |
| `rtk:maul-continuity` | shape → principle | The record concerns retention and continuation choices, not a fixed maul formation. |
| `rtk:restart-kick-chase` | shape → move | A coordinated kick and pursuit, not just starting positions. |

Those four concept versions increase to 0.1.1. The other ten retain their IDs and primary classification; three of them also receive
relation corrections/additions described below, with version increases. Within the original 14 the revised distribution is: 2 systems, 2 shapes,
2 moves, 3 principles, 4 skills and 1 phase. `close-support` remains an arrangement-focused
record, not an official formation name; `switch-pass` remains a movement-focused record.

## Names, variants and evidence

- Japanese names are editorial translations unless explicitly sourced otherwise.
- `synonym` requires actual supported equivalence. A broader technique name used for a
  narrower tactical application is `contextual`, not a synonym.
- A numeric formation, short call or “pod” may need a rugby/format/team context. Unknown
  and contextual-only exact matches remain unresolved/ambiguous as documented.
- Do not silently equate contact screen passes with pre-contact pull-back passes, or a
  phase-direction reversal with a switch pass.
- Group counts describe an attacking framework, not compulsory jersey assignments or
  a coordinate/timing recipe. All models remain non-executable.

## Current evidence limits

New content uses inspected federation material and coach-authored primary explanations.
Reading a coach's explanation is not independent expert validation of the resulting model.
No source diagrams, long excerpts or video files are redistributed, and no paid/login-only
material is treated as if it had been viewed.

For the original rush/sweeper sevens reference, direct re-fetch was not confirmed during
this review (404/403 responses while indexed text remained discoverable). Its earlier
access date is preserved, not advanced. This is an access limitation, not proof that the
original definition is false or a claim of fresh full-source verification.

## Evidence access record for the expansion

`accessed` records the date on which the editor inspected the available source content;
it does not guarantee a fresh direct response from the publisher. During this expansion,
five NZ Rugby article bodies were inspected through search-provided page text, while
separate direct requests returned 404: Plays from a Tap Penalty, Decisions After the
Tackle, Structuring Phase Play on the Run, Midfield Attack at the Scrum, and Ruck & Run.
The affected concepts' `review.note` explicitly records this limitation. Search snippets
alone were not used as complete evidence. Some other proposed lineout/No.8 articles were
excluded because their substantive text could not be inspected.

Rugby Coach Weekly articles were read through the available page text; a later batch of
direct requests returned HTTP 429. That is a rate-limit observation, not proof of source
removal. World Rugby pages, NZR skill pages and the cited public PDFs were reachable in
the spot-check. We do not claim all 39 sources were freshly retrieved end-to-end or that
videos were watched. No remote-source fetch runs in CI, and cached source text is not
copied into the public repository.

## Relationship direction

`enables` points from a supporting arrangement, skill or principle **toward the action it
supports**. It is not a replacement for “uses”, “contains”, or “may occur together”.
`partOf` identifies an explained component of a model, with scope in its note; it does
not mean that component only exists in that system. Relations remain editorial judgments.
The 0.2.0 review also corrects a reversed counter-attack/support relation and adds scoped
support/dummy-pass links, bumping those three existing concept versions to 0.1.1.
