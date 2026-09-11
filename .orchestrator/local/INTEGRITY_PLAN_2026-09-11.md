# TranslateChan Integrity Plan — independent verification campaign (v1, 2026-09-11)

Owner directive (2026-09-11, binding, verbatim intent): *verify independently the claims this project
asserts; we cannot rely on the past work of inferior agents; false citations, false teacher
attribution, and misspellings are **P0**; **always prefer the oldest near-complete copy** over what
became popular later — with all texts, not just the Platform Sutra; and **everything can be cleanly
labeled as such, with notes referring to the alternative texts**.*

This document is the orchestrator's standing program. It is not a task prompt; prompts are generated
from its phases. It lives on the orchestrator branch because it is oversight material, not repo
contract. If a phase contradicts `.orchestrator/REMEDIATION_PLAN.md`, the owner ruling in this file
wins for *witness selection*; `REMEDIATION_PLAN` wins for *edit policy* (R-A/R-B/R-C).

---

## 1. What counts as P0

A finding is P0 iff it makes a public-facing claim false. Three families:

1. **Source integrity.** A `zh`/`text_zh`/`canonical_text` field presented as sourced from a witness,
   where the field is not verbatim in that witness — **or** the citation names the wrong work, the
   wrong volume, the wrong title, or a witness that is not in fact the text being followed.
2. **Attribution integrity.** A speaker/teacher/translator/lineage claim contradicted by the source or
   by history, including an "edition-verified quotation" tag (`W2`) that was never verified against the
   printed edition, and a translation attributed to a named person from a text they did not translate.
3. **Labeling integrity.** Absent, stale, or ambiguous labeling: no recension disclosure on a
   multi-recension text; a `coverage_note` whose numbers disagree with the register; "complete" where
   "represented" is meant; representation presented as completion.

**Explicitly NOT P0 — the over-correction trap.** A graph that *looks* wrong but is verbatim in the
cited witness is correct and must not be "fixed". Measured 2026-09-11: `linji_yulu`
`.sections[66].dialogue[0].zh` contains 机 (the modern simplified form of 機) — and it is **verbatim in
T47n1985**, which itself carries 机 twice and 機 eleven times. A spellcheck-driven correction there
would have introduced a false reading. Likewise 麁 for 粗, 沈惛 for 昏沉, 疎 for 疏, 却 for 卻: all
witness forms adopted by PR #34. **Corollary: no gate may be built on simplified-character detection
alone.** The `simplified` list in `scripts/collate_corpus.py` stays advisory, never a classification
input.

## 2. Verification protocol (the standard every claim must survive)

1. **Pin, then prove.** Reference edition = blobless sparse checkout of `cbeta-org/xml-p5` at
   `dbdea41071e1e260ad84b72faefd4587333cf76d`, extracted with `scripts/collate_refs.py` and
   `--verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`. Digest mismatch ⇒ stop;
   never substitute a remembered or transcribed reference text.
2. **Recompute, never read.** Run `scripts/collate_corpus.py --generated <date>` on the tree under
   review. Ad-hoc runs need `--generated`; an evidence register without a declared date is not
   reproducible (that omission is what made the 2026-09-09 records un-re-derivable).
3. **Field-level truth test.** For each content field:
   `strip_punct(new) in witness` **and** `strip_punct(old) not in witness`. The project's punctuation
   is formatting, not text; the reference is one unpunctuated line, and its clause pitch may be offset
   by a title (T48n2010 opens with the 3-graph `信心銘`, so verse clauses sit ≡3 mod 4). Align on text,
   never on index arithmetic.
4. **Negative claims need their own evidence.** "The witness lacks this" requires a full-text search
   result (0 hits) at several window sizes, not the absence of a collation hit.
5. **`ref_window` is a scored window, not a quote.** 5 of 13 in `xinxin_ming` were not substrings of
   the witness at all. Any prompt or report that pastes it as "the witness text" is fabricating.
6. **Arithmetic is a check, not a courtesy:** per document,
   `content_fields_collated + content_flags == content_fields_total`.
7. **Secrets/leak scan** on the full commit range, not just the net diff; hits must be read, not counted.

## 3. Witness-recension policy (implements the owner's rule)

For every document, in order:

1. Enumerate candidate witnesses **from evidence, not memory**: the works already in
   `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt` (39), plus the Taishō/Xuzang section for that
   text. Record each candidate's length and structure.
2. Select the **oldest near-complete** witness. Near-complete must be *defined per document* before
   selection (e.g. ≥90% of the transmitted clause sequence, or every traditional chapter/section
   present), so "oldest" cannot quietly mean "shortest surviving fragment".
3. Later, popular, expanded editions become **named alternatives**, never silently merged into the
   text and never deleted from the record.
4. Label cleanly (vocabulary in §4). The label is the deliverable, not a comment.
5. Where the older witness lacks material the project already publishes, prefer **additive R-B
   labeling** over deletion, per the owner's standing per-field ruling (Linji 行錄 67–73, 2026-09-11),
   unless the owner rules otherwise for that document.
6. Material not in CBETA at all is **human sourcing work**, not agent work: the older 臨錄 witness
   (the Dunhuang 鎮州臨濟惠運禪師語錄, P.t. 867) is a candidate that must be sourced and rights-checked
   by the owner before any agent re-keys toward it.

Measured baseline for the rule's first application: for 信心銘, `T48n2010` (588 graphs) matches
**33/37 stanzas and 142/146 clauses** of the project text, versus `T48n2012A` 0/37 and `T48n2012B`
0/37 — so the already-certified witness is also the oldest-shaped and shortest, and PR #34's work
survives the new rule unchanged. This is the standard the others must meet.

## 4. Labeling and note vocabulary (to be ratified in one PR, then enforced)

Structured, additive, machine-checkable fields. Nothing here renders as scripture text:

- `.witness_edition` — chosen witness id + era/date string + how it was ranked (§3.2 definition used).
- `.witness_alternatives` — list of `{work, relation}`, e.g. "Zongbao 1290 recension: expanded later
  edition, ~2.15× the length; material present there and not here is flagged, not silently merged."
- `.recension_note` — prose, one paragraph, no witness quotations.
- `.stanzas[i].editorial_note` / `.sections[i].editorial_note` — per-field R-B label, additive, with
  the measured 0-hit search result stated, and **no quoted witness clause** (the tension accepted as
  non-blocking in PR #32's review is now a rule).
- `.coverage_note` — must state the true ratio and keep the standing sentence *"representation does not
  establish complete selected-witness status."* Counts must match §2.6.
- Structural facts get counted, not assumed: `xinxin_ming` has 36 four-clause stanzas + one two-clause
  closer (`言語道斷，非去來今`); a note that says "37 four-clause stanzas" is wrong even when the
  totals are right.
- `reconstruction_unverified` (876 occurrences, all 35 files) is an honest label in the data. The gap
  is **visibility to the reader**, not honesty. Cheapest correct P0 fix: render the label in the Reader
  instead of running 876 re-verifications first.

## 5. Campaign phases

**Phase 1 — Full-corpus independent inventory** (prompts 006–008, ~3–4 PRs, grouped by witness family,
*never* one mega-PR). Deliverable: `INVENTORY_<date>.md` on the orchestrator branch plus one new repo
file `.orchestrator/WITNESS_INVENTORY.md`, one row per document:
`{doc, claimed_witness, my_measured {collated/total, flags by class}, best-matching witness by
measured coverage, structural alignment (section names vs witness), oldest-candidate ranking,
label present? (yes/no), P0 findings}`. Read-only on data. Method = §2, fully scripted, so the table
can be re-generated by anyone at any time. This phase is what makes "we can't rely on past work" a
measurement rather than a mood.

**Phase 2 — P0 remediation** (1 doc / PR, in P0-order):
`platform_sutra` first (largest gap between public claim and reality: 9 of 10 CJK-bearing content
fields are verbatim in **neither** T48n2007 nor T48n2008; 0/620 graphs in the cited Dunhuang text; its
10-chapter skeleton matches T48n2008's division while its note cites T2007) → then the attribution
audit → then per-document stale-note corrections.

**Phase 3 — Attribution and quotation verification.** 162 distinct `speaker` strings across 30 files:
each checked against its own witness and against lineage facts; then `W2`'s 177 "edition-verified
quotations" spot-checked against Senzaki & Reps 1934 and the other cited printings. Where the printed
edition is not fetchable, the claim is **removed or relabelled**, not asserted harder.

**Phase 4 — Evidence and status model.** New dated register overlay + `w1_evidence.py`/`validate_data.py`
merge; the only route to `collated_to_claimed_witness` for `wumenguan`, `biyanlu_cases`, `linji_yulu`,
`xinxin_ming`. Evidence-only; no text edits; `sessions/*` stays append-only.

**Phase 5 — Make it permanent, not virtuous.** Promote each invariant in §2/§4 into a script gate
(recension label required on multi-witness docs; `coverage_note` numbers vs register; §2.6 arithmetic;
no `#NN` placeholders in tracker lines; the `docs/` mirror contract). A rule that lives only in prose
decays — the scoreboard-era comments proved that within five PRs.

**Out of scope for agents, always:** rights review of the 14 `rights_manifest.json` sources; sourcing
texts CBETA does not carry; visual-system reset; PR-A/B/D (frozen).

## 6. Implementation rhythm (per work package)

Facts from the register + a fresh harness run (not from this file's tables, which go stale) → prompt
authored and published on `arena/01a08e15-translatechan` → short dispatch stub to the operator → coder
works → **I re-verify independently**: re-extract the witness, re-derive the replacements myself,
compare, re-run every gate in a real clone (never a worktree), diff leaf-level JSON trees for
allowlist set-equality, scan secrets over the whole commit range → verdict MERGE / REVISE / DO-NOT-MERGE
→ **the operator merges**. I never press the button, and I never pre-author against a base an open PR
will move.

Every prompt additionally requires: one commit per data-touching sub-task; no `#NN`/`PR #N` placeholder
in any committed tracker line; "verify, then trust" phrasing for any factual aside the prompt states;
and an explicit stop-and-report condition when the agent's measurement contradicts the prompt.

## 7. First ten steps, in order

1. Operator decision (already open): fold the 4 `#NN` fixes on `main` into prompt 006's deliverable
   set, or authorize a standalone docs PR.
2. Ratify §4's field names as the labeling contract (one docs PR; `schemas/` + `validate_data.py`
   learn to require `.witness_edition` on the 4 multi-recension docs, then all 35).
3. Prompt 006 = Phase 1 inventory, family 1: T47 (yulu/lu) documents — read-only, produces the table.
4. Prompt 007 = Phase 1 inventory, family 2: T48 + X-series + the 2 witness-unavailable docs
   (`hanshan_poems`, `niutou_juezhu`), which must be re-checked for non-CBETA oldest witnesses.
5. Prompt 008 = Phase 1 consolidation: repo `WITNESS_INVENTORY.md` + the per-doc P0 list, ranked.
6. Prompt 009 = `platform_sutra`, §3 applied: prefer the Dunhuang-era witness; where its text is absent
   from that witness and present in the Zongbao recension, label and cite the alternative rather than
   merge; delete the "not the complete T2007 text" implication of excerpt status that measurement
   disproves.
7. Prompt 010 = attribution audit of `speaker` fields (162 strings) against witnesses.
8. Prompt 011 = W2 quotation verification, first tranche (Senzaki & Reps 1934).
9. Prompt 012 = Reader rendering of `reconstruction_unverified` (makes the existing honest label visible).
10. Prompt 013 = Phase 4 evidence pass, statuses flipped only where the new register supports it.

## 8. What is already verified, and to what standard

Independent, this session, by me: `wumenguan` (#29), `biyanlu_cases` (#30), `linji_yulu` (#32),
`xinxin_ming` (#34) — each field-level, against freshly extracted digest-pinned references, plus the
scoreboard retirement (#31) and the tracker drift fix (#33). Wave 1 remediation claims for these five
documents are therefore not inherited trust. Everything else in the corpus has **not** been verified to
this standard, and Phase 1 exists to change that with a re-runnable measurement rather than an opinion.
