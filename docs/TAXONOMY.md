# 戦術・用語・同一性の分類 / Strict taxonomy

Dataset 0.3.0 keeps 41 knowledge records, but **does not call them 41 tactics**.
The strict classification companion is the current authority; `level` in dataset v1 is a
coarser compatibility field. See [ADR 0002](decisions/0002-strict-classification-and-identity.md)
and the [full 41-record review](CLASSIFICATION-REVIEW.md).

## What belongs in the main view?

- **13 core entries:** 6 systems, 2 basic combinations, 5 tactical options with source-attested names.
- **25 supporting entries:** techniques, principles, roles, a formation, a situation/play family,
  and an editorial topic about changing attacking direction.
- **3 source-specific examples:** Snook's Ruck & Run model, Split scrum play and quick-tap application.
- **0 strategies:** no current record establishes an overarching match/tournament resource plan.

A name alone, a desirable outcome, or an editor-written sequence does not establish a tactic.
A system specifies recurring collective organisation; a pattern coordinates a particular
combination; a tactical option is an intentional means in a situation. Technique describes
execution, principle guides choices, role describes responsibility, formation describes
arrangement, and situation identifies the context in which choices are made.

`counter-attack` is a play family/situation here, not one uniquely specified tactical plan.
Width/depth, recognising mismatches and defensive realignment are not newly discovered systems.
Chip/grubber/up-and-under remain techniques with tactical uses. Restart basics are general
principles or unit skills. The pendulum is a named role-rotation system, not merely lateral motion.

## Names are a separate axis

- `source-attested`: the source uses the name. It does not mean universal standard, official
  Japanese terminology, independent validation or acceptance by every coach.
- `source-specific`: an author's named proposal or a bounded example. Do not promote it to a
  universal play call. Snook explicitly permits readers to make up their own play names.
- `editorial`: a descriptive heading chosen to organise source content, not a source-coined tactic.

Japanese names are editorial translations. Name origin is not proof of semantic category.
A source can organise a collective system under a skills menu; the actual meaning is reviewed.

## Same concept, different names

One canonical record now collects the supported names **Switch / Scissors**, **Cut-out / Miss pass**,
**Loop / Run around**, and **Up-and-under / Bomb**. Counterattack is a spelling variant.
Evidence and scope are stored in `classification.json` rather than implied by spelling similarity.

Japanese **ミスパス** can mean an unsuccessful pass, so it remains contextual even though the English
Miss pass is supported as an alternate name for cut-out in the cited drill. Screen, Blitz, tip-on
and source-local Split are not automatically merged with other meanings. Contextual-only matches
remain ambiguous. Translation is not evidence that every use of a word shares the same meaning.

No pair of the existing 41 IDs was proven fully identical. None was deleted to manufacture a
lower count. Components, applications, similar actions and prerequisites are not synonyms.
Every old ID and its individual JSON remains available; true names converge on that record.

## Source access and review limits

The new Miss Pass Drill source describes general handling. XV/sevens applicability is editorial,
not sevens-specific experimental validation. The loop/run-around explanation was inspected in
search-provided full text; direct re-fetch timed out. No source images/videos or long passages
are redistributed. The Japanese ambiguity example is an official match report, not a coaching
endorsement of this database's terminology.

This is source-grounded editorial review, not qualified coaching/safety certification. All
execution flags remain false. Semantic decisions, including name equivalence, can be corrected
by evidence-backed contributions; changes require versioning and review.

## Earlier expansion access record

The following limitations from the 0.2.0 expansion remain relevant. They are not a claim that
every cited URL was freshly accessible during the current review.

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
