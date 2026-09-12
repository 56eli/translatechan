# Orchestrator Working State

> Private to this orchestrator session. Agents never see this file. The canonical,
> owner-visible tracker in this repo is `.orchestrator/STATE.md` **on `main`**
> (de facto — this repo has no `docs/PROJECT_STATE.md`); it changes only via agent PRs.

## Orchestrator Branch

`arena/01a08e15-translatechan` — provisioned for this session, branched from `main`
@ `02e5db7` (the PR #29 merge). Distribution channel only: `.orchestrator/prompts/*`
and this file. Never merges, never a PR base, never a coder target, never receives
source changes. Divergence from `main` is expected and is not a defect.

## Canonical Project Tracker

- `.orchestrator/STATE.md` on `main` — task queue, standing decisions, invariants, known gaps.
- Supporting: `ROADMAP.md`, `HANDOFF.md` §5 (release blockers), `AGENTS.md` (agent contract +
  five quality gates), `.orchestrator/REMEDIATION_PLAN.md` (W1 work-order + wave checklist),
  `AUDIT.md`.
- **Divergence recorded (2026-09-11):** a previous orchestrator generation committed its state
  to `main` under the old layout. `main`'s `STATE.md` wins for merged history; this file wins
  for dispatch bookkeeping. Reconciliation of `main`'s stale "Next planned task" line is
  delegated to an agent PR, never done from this branch.
- **Known defect in the canonical tracker, re-verified on the post-#30 `main`:** `STATE.md:24`
  still ends "Next planned task: visual-system reset" and `:26-29` still sequence the scoreboard
  removal *last*; `:49` still carries an unchecked "Scoreboard removal PR" queue line even though
  prompt 002 is published; `:68` (Invariant 6) still binds agents to `user_score` handling.
  Owner direction of 2026-09-11 (this session) supersedes that ordering: **scoreboard removal is
  slot 2, dispatched immediately after the PR #30 review.** Prompt 002 repairs `:49` and `:68` as
  its own deliverable; the `:24-29` narrative lines are prompt 004's job. Corrected only by agent
  PRs — never from this branch.

## Published Task Prompts

| Seq | Prompt path | Task | Agent branch | PR | Status |
|---|---|---|---|---|---|
| 001 | — | Phase 2 alignment + Phase 4 review of PR #30 (no coder dispatched) | (prev-gen 001's coder) `arena/01a08da1-translatechan` | #30 | **Merged 2026-09-11 10:30 CEST** as `3dd86df`; verdict MERGE, independently re-verified before merge |
| 002 | `.orchestrator/prompts/002-scoreboard-removal.md` | Retire the scoreboard: delete `.scoreboard/` + `SCOREBOARD.md`, rewrite `AGENTS.md` / PR template / `HANDOFF.md` / `AUDIT.md` references, relocate the manual-workflow-edit record | `arena/01a08f97-translatechan` | #31 | **Merged 2026-09-11 11:04 CEST** as `e4b17f7`; verdict MERGE, all 3 stages passed, gates re-run locally on `db9f3c2` |
| 003 | `.orchestrator/prompts/003-linji-yulu-rekey.md` | W1 remediation Wave 1 doc 3: adjudicate `linji_yulu`'s 10 content flags against T47n1985 (2 DIVERGENT + 6 NOT_FOUND adjudicated, 2 MINOR untouched), rewrite the false `coverage_note`, 行錄 sections 67–73 per the owner's per-field ruling | `arena/01a08fd6-translatechan` | #32 | **Merged 2026-09-11 12:45 CEST** as `b82d904`; verdict MERGE, all 3 stages passed, witness re-extracted + harness re-run by me on `af1be55` |
| 004 | `.orchestrator/prompts/004-tracker-comment-drift.md` | Docs-only drift after PR #31/#32: `STATE.md` sequencing block, `HANDOFF.md` §9 map alignment, `app.css`/`docs/app.css` scoreboard-era comment | `arena/01a09041-translatechan` | #33 | **Merged 2026-09-11 15:32 CEST** as `83865a6`; verdict MERGE, mirror contract proven by idempotent build |
| 005 | `.orchestrator/prompts/005-xinxin-ming-rekey.md` | W1 Wave 1 doc 4: adjudicate `xinxin_ming`'s **13** content flags against T48n2010 — 12 re-key (1–4 graph variants) + `stanzas[31]` kept/labelled (witness lacks 一念萬年), `coverage_note` correction, allowlist extension | `arena/01a090ab-translatechan` | #34 | **Merged 2026-09-11 17:37 CEST** as `ef13b26`; verdict MERGE, 12/12 re-keys byte-identical to my own independent re-derivation, allowlist set-equal 24=24, all gates re-run. Post-merge `main`: Quality + Pages both success |

Numbering note: `.orchestrator/prompts/` is per-orchestrator-branch. This branch starts at
002 because 001 is reserved above for the review task. The predecessor generation's prompts
are addressable, not duplicated: `arena/01a08d90-translatechan:.orchestrator/prompts/001-biyanlu-r-a-rekey.md`
(PR #30's instructions) and `arena/01a08c93-translatechan:.orchestrator/prompts/00{1,2}-*wumenguan*`
(PR #29's instructions + its revision).

## Active Milestone

Retire the owner-superseded scoreboard system, then continue W1 remediation Wave 1
(`linji_yulu` next), under the owner-adopted hybrid R-A/R-B/R-C policy.

## Task Queue

- [x] **PR #30 review** (Wave 1 doc 2, `biyanlu_cases`) — verdict **MERGE**; recorded by the
  predecessor orchestrator at `arena/01a08d90-translatechan` @ `b80ac28` and independently
  re-verified by this session on freshly acquired, digest-verified CBETA refs.
- [x] **Operator merged PR #30** — `main` is `3dd86df` ("Merge pull request #30 …",
  2026-09-11 10:30 CEST); post-merge `main` Quality run `34579532339` **success**
  (42 s), Pages `34579531886` **success**, Pages status `built` / HTTPS enforced. Verified
  content on `main`: `早知是火` present, `content CJK=104,351`, `all-string CJK=109,848`.
- [x] **Prompt 002 — scoreboard removal** — PR #31 **merged 2026-09-11** as `e4b17f7`; post-merge
  `main` Quality `34582372810` success, Pages `34582371827` success, Pages `built` + HTTPS.
  Verified on merged `main`: 0 tracked paths matching `scoreboard`, `OPERATIONS.md` present.
  The scoreboard system is gone from the contract — prompts authored from here must not send
  agents to `.scoreboard/*` or `SCOREBOARD.md`.
- [x] **Prompt 003 authored + published — Wave 1 doc 3 `linji_yulu`.** Owner ruling of
  2026-09-11 recorded and encoded: **per-field** adjudication for the 行錄 division (re-key where
  T47n1985 carries the passage, additive R-B `editorial_note` + witness-claim removal where it does
  not; **no deletions, no blanket relabelling**), and the 74 `title_zh` flags stay out (separate
  composite-title PR). Field table in the prompt was generated from the register JSON and then
  re-verified row-by-row against it (10 rows, 0 mismatches) — the inherited hand-transcription
  failure was not repeated.
- [x] **Prompt 003 dispatched** — coder `arena/01a08fd6-translatechan` opened **PR #32**; reviewed
  2026-09-11, verdict **MERGE** (see Review Log).
- [x] **PR #32 merged** (2026-09-11, `b82d904`); 003 marked Merged above; `main` refreshed and this
  branch re-synced onto it (merge commit, delta vs `main` = the 3 orchestrator files).
- [x] **Prompt 004 authored** — tracker + comment drift only: `STATE.md` sequencing block
  (stale "Next planned task: visual-system reset" + "3. Then scoreboard-removal PR…"),
  `HANDOFF.md` §9 map 1-char misalignment, `app.css:2186` + mirrored `docs/app.css:2186`
  "Scoreboard P2 resiliency fix" comment. **Repo metadata was deliberately NOT bundled into the
  prompt**: `description`/`homepage`/`topics` are GitHub settings, not files, so no PR can carry
  them — it moved to the operator-actions queue below.
- [x] **Prompt 005 authored** — Wave 1 doc 4 `xinxin_ming`. Register-measured scope: **13** content
  flags (my earlier queue note said 12 — wrong), all `.stanzas[i].zh`; witness `T48n2010`, digest
  `9aaa3217…`, 588 graphs, opens with the 3-graph title `信心銘` so clause pitch is ≡3 mod 4.
  12 fields differ from the witness by 1–4 graph variants only → re-key; `stanzas[31]`'s 一念萬年 is
  **absent from the witness (0 hits)** and its aligned witness span is the *next* stanza's opening
  `無在不在`, so adopting it would delete a line and duplicate `stanzas[32]` → kept + `editorial_note`
  per the owner's per-field ruling. `.title_zh` (1 metadata flag) deferred to the composite-title PR.
- [x] **Prompt 004 dispatched** (2026-09-11) → coder branch `arena/01a09041-translatechan`,
  **PR #33** OPEN at `704d9fc`: 4 paths == 004 §6, one commit == §9 message, base `main` `b8f452f`'s
  ancestor `b82d904`, CI `Validate data, generated artifacts, and reader` pass. Full 3-stage review
  owed on merge (docs-only; the review is mostly scope + mirror-consistency).
- [x] **Prompt 005 dispatch message handed over** (2026-09-11) with the artifact gate (18,726 bytes,
  16 sections, sha256 `0b9e3f8e6b53c009…`) and the 4 stop conditions; to be sent after #33 merges.
- [x] **PR #33 merged** as `83865a6`; 004 marked Merged above; `main` refreshed and this branch
  re-synced onto it (delta = the 5 orchestrator files).
- [x] **Prompt 005 dispatched** → `arena/01a090ab-translatechan`, **PR #34 OPEN** at `b21b056`;
  reviewed 2026-09-11, verdict **MERGE** (see Review Log).
- [x] **PR #34 merged** as `ef13b26`; 005 marked Merged; `main` refreshed and verified (witness form
  `慎勿追尋` present / `慎莫追尋` absent on `main`, `[31]` note intact); post-merge Quality + Pages both green.
- [ ] **Blocked on operator (repo files are PR-gated, and I don't open PRs): `#NN` cleanup.** 4
  placeholders survive on `main` — `STATE.md` ×2, `REMEDIATION_PLAN.md` ×2 — all referring to PR #34,
  which is now known. Needs a 4-line docs PR (or fold into 006's deliverable set if the operator wants
  zero extra PRs). Prompts from 006 on must require: "no `#NN`/`PR #N` placeholder in any committed
  tracker line; read back your own PR number after opening, then amend in a final `docs:` commit."
- [x] **#35 MERGED as `3c838db`** (merge, parents `ef13b26` + `fd250e3`; `fd250e3` confirmed an ancestor of
  main, so nothing was re-committed under me). **Post-merge verification on main:** `recension_note` ×14
  present in `data/corpus/platform_sutra.json`; `WITNESS_INVENTORY.md` present; **0** residual `#NN` in
  any tracked doc; pinned all-string CJK reads `110,165` in README/AUDIT/HANDOFF. Wave 1 of the integrity
  campaign is now **complete as a wave**: 4 documents re-keyed to their witnesses (#29 #30 #32 #34) and 1
  honestly labelled (#35), with `platform_sutra`'s checkbox deliberately left open because its *text
  decision* is deferred to the inventory — the file records it as labelled-not-sourced, which is the true
  state. **My doc-count sync rule paid for itself on first use**: main landed with all nine gates green,
  so 007a/007b can be dispatched against `3c838db` without inheriting a red base.
- [x] **#36 MERGED as `b3cd14f`** — Phase 1 (measurement) closed on main: 3 inventory files, 35 doc
  blocks, 70 P0 bullets, 35 `OUT-OF-CBETA` routes. 007a/007b are **delivered — do not re-dispatch**.
- [x] **#37 MERGED as `29abad7`** (my MERGE recommendation taken; only the 3 allowed paths moved).
- [x] **PR #40 — task 011, the presentation fix — verdict MERGE** (head `1fbc5bf`, base `44d2d6e` = main
  after #39, 5 files / 4 commits, +287/−3). `app.js` +46/−1, `docs/app.js` byte-identical to it (regenerated,
  not hand-edited — I diffed them), `test_source_review_rules.py` +192/−1 (the single deletion is a docstring
  bullet's `.` → `;`), 2 tracker lines. **Zero** paths under `data/`, `docs/data`, `.github`, schemas, smoke,
  README/AUDIT/vision/ROADMAP; `data/project_metrics.json` sha `69a9c2f51ab4` identical to main; all nine
  gates exit 0 in a clean clone. **Implementation reviewed line by line:** one shared `renderProvenanceNotes`
  with a `typeof !== 'string'` guard and `.trim()` (missing/empty/whitespace/non-string all render nothing),
  `escHtml` on every note, the pre-existing style string reused verbatim so **no CSS and no new class** (I
  diffed the added `font-size`/`color` occurrences: 1 each, copied from the old verse site), the old inline
  verse expression **deleted** rather than left to double-render, precedence list as a named constant
  (`PROVENANCE_NOTE_KEYS`) so the test can parse it, and 17 call sites covering root/preface/epilogue/case/
  section/dialogue/stanza/chapter — every node type the data actually uses (verified by walking all 35 corpus
  files: `cbeta_note` 16 at ROOT, `editorial_note` 8 in dialogue×4/cases/sections/stanzas/epilogue,
  `recension_note` 14 at ROOT+chapters+dialogue+verses).
  **My own end-to-end render test** (extracted the four real functions from the PR's `app.js` and ran actual
  corpus JSON through them): `platform_sutra` ROOT recension ruling and `.chapters[2]` précis label both
  emit; `caoxi_zhuan`'s `X1458 is 宗門寶積錄` correction now reaches a reader — closing the loop on the exact
  orphaned-record finding that motivated 011; quotes/angle brackets escaped; 3 keys ⇒ 3 separate lines in
  R→E→C order, never concatenated.
  **The invariant test exceeds my spec and defends itself:** keys enumerated from data at run time (not a
  constant), rendered side parsed from `app.js`; exemptions must be *stale-proof* (exempted key must still
  exist in the corpus, must NOT be in the render list, reason ≥12 words, and its recorded alternative home
  must still exist) — so the list cannot be widened into a get-out-of-jail card nor quietly narrowed; markup
  count asserted == 1 (kills copy-paste drift); six named render functions each asserted to call the shared
  renderer. Negative case injects `fabrication_note` into a **scratch** copy, measures `before` first so the
  assertion is about the injected key even in an already-dirty tree, then proves the repo file is untouched.
  Coder's report also volunteered a detail I would otherwise have flagged: `coverage_note`'s app.js mention
  count moved 2→3 solely because the renderer comment explains the exemption, render sites unchanged.
  **First PR of the campaign I could not improve by review.**
- [x] **#39 MERGED as `44d2d6e`, #40 MERGED as `faff161`** — the doc-alignment campaign's 010/010b/011 are all on
  `main`. Current `main` = `faff161`, and every figure below was measured on it.
- [x] **Prompt 012 authored and pushed** — `.orchestrator/prompts/012-postremediation-evidence-pass.md`, the
  post-remediation evidence pass. My earlier scoping note ("it must edit `scripts/validate_data.py` and needs a
  checker carve-out") was **wrong, and reading `w1_evidence.py` is what disproved it**: `FIXED_METADATA`
  (`scripts/w1_evidence.py:101-113`) pins exactly ONE historical register + ONE correction overlay, and `:752-758`
  hard-requires `kind == "w1-correction"` with `corrects == sessions/COLLATION_REGISTER_2026-09-09.json`. A third
  dated record therefore **cannot** take authority without converting the pair into a chain — which drags in
  `metrics_block()`, the `historical`/`superseded`/`reproduction` blocks, `smoke_test.mjs`'s expected metadata and
  the verbatim `evidence_bits` of five documents. 012 is consequently **publish-only**: it measures and records, and
  leaves designation alone, using the room `validate_data.py:1240-1243` already grants — *"Dated files under
  `sessions/` are historical snapshots and are deliberately not scanned."* Zero checker edits, so the standing rule
  survives intact and the task can run beside anything.
- [x] **012's evidence base measured by me, end to end** (not assumed): sparse blobless clone of `cbeta-org/xml-p5`
  (39 works, 29 MB, ~3 s), HEAD still `dbdea410…` = `PINNED_UPSTREAM_REVISION`; `collate_refs.py` → **39 verified,
  0 drift**; full `collate_corpus.py` run → **flagged 630 → 532, content fields collated 593 → 691 of 924,
  `DIVERGENT` 111 → 37 across 16 docs, `NOT_FOUND` 334 → 310, `EXACT` 685 → 783, statuses unchanged 1/32/2,
  `documents_with_changed_status: 0`**. The `xinxin_ming` 像/象 residual is gone (its 12 `DIVERGENT` are now `EXACT`);
  `linji_yulu` and `platform_sutra` keep exactly 1 each, as the docs say they should. Two durable discoveries:
  (1) `--reproduce` + `cmp` of the **committed** 09-10 overlay **no longer matches** (47 differing JSON keys, in
  exactly 5 documents — `biyanlu_cases`, `deshan_yulu`, `linji_yulu`, `wumenguan`, `xinxin_ming`, i.e. the campaign's
  own five) so the 09-10 report's §7 "cannot drift apart" claim holds only while the corpus is static: 012 must
  publish that delta as the supersession evidence, not report it as a broken environment.
  (2) `deshan_yulu`'s lone delta is `witness_note` (`X1315` → `X68n1315`), which is **harness-side** — the id table
  inside `scripts/collate_corpus.py:214-242`, normalised in `7cde460` — so part of a document's claimed witness lives
  in the script, not the data: never "fix" a witness id by editing `data/corpus/*.json`.
- [x] **PR #41 — task 012, the post-remediation evidence pass — verdict REVISE (2 mechanical items, both traceable to
  my prompt, not the coder).** Head `e4a7e41`, base `faff161`, exactly 3 files (`ROADMAP.md` +3/−3, the new register
  +7724, the new report +276), 2 commits in the mandated order, Quality green, mergeState CLEAN. **Authenticity
  proved by me, not asserted:** I replayed *their* register from its own `generation_parameters`
  (`--reproduce sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`, my independent refs) and `cmp` is
  **byte-identical**, sha256 `6bb74de7445ca67b…` matching the digest they published in §7. Every figure re-derived
  from the two registers, not from their prose: 532 flagged, 691/924 content fields, `DIVERGENT` 37 across 16 docs,
  `NOT_FOUND` 310 across 33, `EXACT` 783, statuses 1/32/2, `documents_with_changed_status` 0; per-document flagged
  deltas (biyanlu −20, wumenguan −61, linji −5, xinxin −12) sum to exactly −98 = 630→532 **with no other document
  changing**; the two residual `DIVERGENT` fields they name exist verbatim in the register
  (`linji_yulu .sections[66].title_zh` sim 0.8571 序四… composite title; `platform_sutra .chapters[7].zh` sim 0.9444
  師示眾云 vs witness 師謂眾曰) and 09-10 had 3 and 1 as claimed; `platform_sutra`'s entry is byte-identical; the
  47-key/5-doc census (7 aggregate / 5 reproduction / 35 documents) and even the `cmp` failure offset
  (char 8938, line 265) reproduce my own run; `historical_counts` 33 verified / 6 drift and the 6 `drifted_refs`
  match the overlay exactly; the `2026R2` tag claim checks out against `git ls-remote` (`2026R2 → dbdea41071e1…`);
  no new digest manifest; all 9 gates exit 0 in a real clone with `git status --porcelain` empty after rebuild and
  `validate_data.py` still printing `flagged=630 | evidence=2026-09-10`, i.e. the no-re-designation rule held.
  **The two revise items:** (1) `upstream.revision` is the literal `"unrecorded"` — `collate_corpus.py:642` writes
  that unless `--upstream-revision` is passed, and my §3.4 command omitted it. Proved surgical: regenerating with
  `--upstream-revision dbdea410…` changes **exactly 2 leaf keys** (`upstream.revision`,
  `generation_parameters.upstream_revision`) and leaves `aggregate`, `documents`, `reproduction` identical.
  (2) Report §6 calls the register "a drop-in for a future re-designation": key-set parity is true, adoption is not —
  `w1_evidence.py:752-758/779-783` demand `kind == "w1-correction"`, `corrects == …2026-09-09.json`,
  `upstream.revision == PINNED_UPSTREAM_REVISION`. A future task reading that sentence would plan around a record it
  cannot adopt; the sentence must state what adoption actually requires. Patched 012's own §3.4/§5 so the class can't
  recur.
- [ ] **Follow-up found while reviewing #41 (main health, not #41's doing): the presentation tracker is stale by five
  lines since #40 merged.** `ROADMAP.md:33`, `:163` half (1) and `:179`, plus `RESEARCH_RELEASE_PLAN.md:32` and its
  open blocker `:103`, all still assert "the reader renders **one** site", that `cbeta_note`/`editorial_note` are
  "never rendered" and that `platform_sutra`'s root note "is unreachable" — false as of `faff161`, which shipped the
  shared renderer plus the orphan gate. #40 updated only `.orchestrator/REMEDIATION_PLAN.md` (+1) and
  `.orchestrator/STATE.md` (+2). My own prompt fenced #41 off those lines (`:178-181 … not yours`), so the fix
  belongs in a separate one-commit docs task (**013**), whose only job is to re-point those five claims at the
  shipped renderer (no numbers to invent; `grep -c` the render sites in `app.js` for the denominator).
- [x] **Prompt 010b delivered as PR #39** (head `e2b48c2`, base `c670e87`, 3 files / 3 commits, +18/−1) —
  **verdict MERGE.** Reviewed claim-by-claim, not diff-by-eye: §4.1's stale Platform-Sutra sentence replaced
  with the labelled state (1/3/9 split, 680 CJK, "not a complete text" retained); §4.3's 630/532 rule
  handled correctly (630 kept as *the register*, 532 attributed to #29/#30/#32/#34 and to `PHASE2_PLAN.md`
  §2, supersession reserved to the evidence pass — no quiet number swap); AUDIT +3 measured bullets; HANDOFF
  snapshot +3 lines and the four next-actions each naming the file to read. All pinned strings intact (my
  one red flag was a broken grep pattern on my side — disproved by running the identical pattern on main and
  head, both 1); zero unqualified `T1987`/`622`/`637`/`174` added; metrics byte-identical; all 9 gates
  exit 0 in a clean clone. **Reference integrity: every claim checked out** — 4 witness mappings match the
  data (`T2005`→`ref_T48n2005` work-id form handled correctly), cited PRs #29/#30/#32/#34/#35 all exist and
  are merged, `--require-verified-refs` is a real collator flag, and 3/3 inventory paths plus the
  `Release-blocking checklist` / `## Owner decision required` / `## 7.` anchors resolve. **Unprompted
  quality note:** both files add *"None of the five documents changed status and none became complete"*,
  closing the exact misreading (5 re-keyed docs + friendly prose = "done") this campaign exists to prevent.
  First PR whose report needed no correction from me at all.
- [x] **010 DELIVERED as #38, merged by the operator before orchestrator review ("accidentally"), head
  `c670e87`. Retrospective review = clean.** Scope exactly `vision.md`/`ROADMAP.md`/`RESEARCH_RELEASE_PLAN.md`
  (+196/−56, 0 data/docs/scripts paths); all metrics, `index.html`, `app.js`, both bundles byte-identical to
  `29abad7`; **all 8 gates exit 0 on main itself** in a fresh clone and the build leaves 0 files dirty (so the
  unreviewed merge did not break `main`). Every required correction present: Congronglu marked `†` in the
  ASCII taxonomy with a footnote naming it a goal rather than a holding (not deleted, as instructed);
  per-phase statuses rewritten as `5/5 rooms`, `0/35 complete`, `31/150 terms`, `5/35 re-keyed`, `Planned` —
  each with its denominator **and the command that produces it**; objective-4 got an element-by-element table
  with honest partials (`rights records`: policy + 14 sources, not per-item — verified: exactly 14;
  `hover/focus`: "implemented, not browser-evidenced"); and the 630-vs-532 rule stated as *"two different
  claims, and neither is a completion claim"*. All 3 `T1987` mentions qualified (false/Caoshan), no bare
  `174` anywhere in the scanned set, ROADMAP keeps its two required strings and correctly omits the three
  README/AUDIT/HANDOFF-only ones. **Numbers verified correct, including a subtlety I did not specify**:
  "22 documents carry provenance labels" excludes `coverage_note` (16+5+1=22; union with coverage is 26) —
  right judgement, and the first PR this campaign with no arithmetic error.
- [!] **False alarm worth recording, because I nearly reported it as a rewrite:** after the sandbox
  re-created my workspace as a **depth-1 clone**, `refs/remotes/origin/main` showed as a single **root**
  commit (`git rev-list --count` = 1, no parents, `29abad7` unknown, `merge-base` NONE, merge refused with
  "unrelated histories"). I did **not** conclude history was destroyed: `gh api …/commits/c670e87` showed
  two parents (`29abad7`, `bbfdd18`) and normal ancestry, and `.git/shallow` existed. Fix per the earlier
  graft lesson: `git fetch --deepen 500` on **both** `main` and my branch → 260/285 commits, real merge-base
  `b3cd14f`, merge clean, then removed `.git/shallow` and verified 293 commits. Standing rule: a
  *surprising* repo-level result must be confirmed against the GitHub API before I describe it to the owner,
  and never merge/rebase against a grafted ref.
- [x] **OWNER DIRECTIVE 2026-09-12 received and actioned:** *"update all documentation to the status quo and
  align the project with the vision of perfection of source integrity, referencing and presentation in its
  stated goals."* Survey → three prompts authored (**010**, **010b**, **011**), sequential A→B→C.
  - **Headline finding (the directive's real content):** **49 provenance notes sit in `data/corpus/*.json`
    and the public reader surfaces ONE.** Enumerated from the data, not from memory:
    `cbeta_note` 16 docs / 0 mentions in `app.js`; `editorial_note` 8 / 0; `recension_note` 14 / rendered at
    verse level only (so `platform_sutra`'s root note, its 9 chapter notes and 2 dialogue notes are
    unreachable); `coverage_note` 11 / dossier-only by design. The 16 `cbeta_note` records include
    `caoxi_zhuan`'s own account of a corrected false citation — a documented integrity fix with no path to
    a reader. **`vision.md` objective 4 names exactly this ("…hover/focus/touch citation details"), so the
    gap is a stated-goal violation, not a nice-to-have ⇒ 011.**
  - **Documentation status quo, measured:** **no top-level document cites any PR #29–#37** — seven merged
    work packages and the entire integrity campaign are invisible outside `.orchestrator/`; `vision.md`
    still lists **Congronglu** three times (quarantined since the 2026-08-10 audit) as if in the corpus;
    `ROADMAP.md` phase statuses are 2026-08-08-era (`100 / ~30 / ~20 / ~40 / Planned`) with percentages
    lacking denominators; `README.md` describes `platform_sutra` by its *pre-#35* framing.
  - **Deliberate scope decisions:** `AGENTS.md` and `OPERATIONS.md` verified current (they already record the
    2026-09-11 scoreboard retirement correctly) → no change; the 10 dated artifacts (`AUDIT_*`,
    `FULL_AUDIT_*`, `response_summary.md` — titled *"Current Session Result — 2026-09-10"*) are frozen
    historical records → **explicitly excluded** (prompt 011 says do not rewrite history). Visual-system
    reset stays deferred: 011 is presentation *completeness* using only existing markup patterns, with an
    explicit "no new CSS / no styling redesign ⇒ REVISE" clause.
  - **The 630/532 rule both prose prompts must obey:** `630` = flagged fields in the *authoritative
    2026-09-10 register*, verbatim-pinned by `validate_data.py` in five documents; a fresh run on today's
    data yields **532** because #29/#30/#32/#34 removed flags. Neither figure may be substituted for the
    other; only the post-remediation evidence pass may supersede the register.
  - **Two more of my own errors, caught by measuring:** I invented a `verification_note` key (it does not
    exist; the real orphaned key is `cbeta_note`) and undercounted the notes as 22 by restricting to
    Wave-1-created ones. Had I shipped the naive "every `*_note` key must be rendered" invariant, task 011
    would have failed on `coverage_note` on day one. Also corrected in-flight: 010b's §3 originally implied
    `ROADMAP.md` must carry the three `source_review` statements — it must not; that asymmetry is now
    documented in 010 §5 and 010b §3 so neither task "fixes" a rule that is satisfied by design.
- [!] **My published prompt number was wrong and 008's coder corrected it.** 008 §3 asserted "35
  `OUT-OF-CBETA` markers"; the true token count is **33** (9+12+12) across 31 documents. The coder did not
  quietly fix it — they measured with a published command, printed 33, and logged it under
  `Disagreements (d) Count discrepancy, not smoothed`. This is the third time a number I authored was
  wrong on inspection (after the 620/680 and 10/16 doc-count errors), and the pattern is identical: I add
  per-file figures from a rendered table instead of running the count. Standing rule for my own prompts:
  **any number I cite must come from a command I pasted, and must be labelled "confirm, do not copy" —
  which is exactly what I ask of coders and what saved this one.**
- [x] **Prompt 008 authored + published** (`.orchestrator/prompts/008-phase2-consolidation.md`, 14,099 B,
  sha256 `9eea38587f3127b1…`): consolidate the three inventories into `PHASE2_PLAN.md` (one row per
  finding, ranked, each classified `RE-KEY`/`LABEL`/`CITATION`/`HUMAN-SOURCE`/`NONE`); re-verify rather
  than aggregate (re-extract refs, re-run collation, spot-check 5 findings of the coder's choosing,
  including one top-ranked and one `OUT-OF-CBETA`); report disagreements between the three files; fix
  exactly three stale tracker facts (STATE.md's false "blocked on an owner recension ruling"; missing
  007a/007b links; REMEDIATION_PLAN's unticked `platform_sutra` → "labelled (#35), text decision
  deferred", **not** ticked done); end with the three questions only a human can answer. Base pinned to
  `b3cd14f` with stop-if-absent. Tracker-only scope, no data path.
  - **Self-corrections during authoring, both from measuring instead of recalling.** (1) My first §9 said
    the five-ledger sentence is required in `STATE.md`; re-reading `validate_data.py:1264-1300` shows it
    applies to `README/AUDIT/HANDOFF/ROADMAP/REMEDIATION_PLAN` only, `STATE.md` needing just `630` +
    `CORRECTED|superseded`. Rewritten — a wrong hazard warning sends a coder to preserve text the gate
    never asked for. (2) Found a **per-line** rule on the scanned files: any line containing `T1987` must
    also say `false`/`caoshan`, and superseded totals (`622`/`637`) must be qualified — a live trap for a
    consolidation doc whose top finding *is* `zhaozhou_yulu`/T1987. Both taught in 008, with the caveat
    that those snippets are f-strings generated from `data/project_metrics.json`, so grepping the script
    for them finds nothing.
  - **New owner-queue fact:** `README`/`AUDIT`/`HANDOFF` are *gate-enforced* to state that Zhaozhou's
    claimed T1987 is the Caoshan record and the claim is false, while `data/corpus/zhaozhou_yulu.json`
    still cites T1987 — docs and data contradict each other by design of the gate. Strongest argument yet
    for authorising the `CITATION` fix.
  - **[!] Sandbox failure mode escalated:** this ledger edit was applied, verified by the writing script,
    and then **silently discarded between the write and `git add`** (disk, HEAD and remote all 58,276 B,
    edit absent) — the first time a revert ate a change *inside* one of my own commands rather than
    between turns. Countermeasure now routine: write → `grep` for my marker → `git add` → `git diff
    --cached --name-only` must list every intended file → commit → verify `git show HEAD:<file> | grep
    marker` before pushing.
- [x] **PR #36 — 007a + 007b delivered together — verdict MERGE** (head `2ba6834`, 2 commits, 2 files,
  +1209/−0). Reviewer-grade verification, all independent of the PR's own tables: my own 39-work
  extraction (`39 verified / 0 drift`); my own `collate_corpus` run on current main agrees with the two
  inventories on **all 26 documents** (0 mismatches), including the four §6 self-test rows (wumenguan
  174/181, biyanlu 373/395, xinxin 36/37 all moved; zhengdao_ge 6/6 unmoved, as required); **35/35
  coverage** with no doc inventoried twice and no doc missed; 19 P0 bullets in family 2 and 35 in family
  3, each with a reproducing command (23/35 `Reproduce:` markers); the `sengzhao_zhaolun` splicing claim
  re-derived by me at 8-gram granularity (ref@1094 → ~ref@1579-1587 ⇒ ~470-493 graphs, matching their
  figure); `hanshan_poems`/`niutou_juezhu` correctly routed as witness-unavailable; `OUT-OF-CBETA` used
  24× with **no** claim of fetching, transcribing, or reconstructing anything; all eight gates exit 0 at
  the head and `validate_data.py`'s doc-truthfulness rule provably does *not* extend to
  `.orchestrator/WITNESS_INVENTORY*.md` (`framed` = README/AUDIT/HANDOFF + ROADMAP + REMEDIATION_PLAN), so
  1,209 new prose lines cannot trip it. Phase 1 of the integrity plan is therefore **done**.
- [!] **A false alarm I raised and then disproved against myself:** a substring test showed `X1458` still
  present in `data/corpus/caoxi_zhuan.json`, which looked like the corrected mis-citation surviving as a
  live claim. It is not — the only occurrence is *inside* `cbeta_note`, quoting the old error in order to
  record the fix ("prior 'X1458' wrong"). Lesson: `key in json.dumps(doc)` proves presence, never
  role; check the key before calling a P0. The inventory had this right by phrasing it as a question to
  check rather than an assertion — that framing is what made me test instead of file.
- [x] **006 DELIVERED — do not re-dispatch.** Its two deliverables (the 498-line family-1 inventory and
  the four `#NN`→`#34` fixes) rode into #35 rather than opening their own PR. Consequence accepted: #35
  became a two-package PR, which is against my own one-document-per-PR habit, but the inventory is
  read-only so the risk was zero and the `#NN` debt is now cleared permanently. **007a/007b must read the
  merged `WITNESS_INVENTORY.md` and match its block format** — their prompts already say so, and the file
  now exists on main rather than being a sibling-branch promise, so that instruction is satisfiable.
- [ ] **Live P0 findings from 006 awaiting a fix package** (008 sequences them; none is a re-key, so they
  are label/citation work): `zhaozhou_yulu`'s `coverage_note` claims "15 signature encounter dialogues
  excerpted from T1987" while measurement is 0/19 verbatim **and** T47n1987A/B is the 曹山 record (趙州 1
  vs 曹山 25/28 occurrences) — a false public citation, the worst in the family; `dahui_hongzhi` presents
  the 默照銘 with a tail found in no witness and omits its actual witness T48n2001; `guiyang_yulu` and
  `yuanwu_letters` are 100% unattested **and** 100% undisclosed (no notes at all). All reproduced by me
  independently, not taken on trust.
- [x] **Phase 1 completed in structure: 006 + 007a + 007b** (three disjoint inventory PRs, 9 + 14 + 12
  documents = 35/35). 007a/007b are **pure additions** — each creates exactly one new
  `.orchestrator/WITNESS_INVENTORY_*.md`, touches no tracker and no data — so all three can run in
  parallel with 009 without rebase risk. 008 (consolidation + ranking + registering the three files in
  `STATE.md`) is deliberately **not authored yet**: it consumes their outputs, so pre-writing it would
  be authoring against content that does not exist.
  Family split was derived by **importing `collate_corpus.DOCS`** (`T47n*` → 006: 9 docs; X-series →
  007b: 12; remainder → 007a: 14 = 12 + 2 witness-unavailable). `qinggui_monastic_codes` and
  `shitou_sandokai` cite X works but are assigned to 007a by precedence; `chuandenglu`/`deshan_yulu`
  cite X as probes and go to 007b — both notes are in the prompts so the coder cannot "correct" the split.
- [!] **Self-caught before publication:** my first draft of 007a/007b said 10 and 16 documents. Both
  wrong, produced by hand-counting a rendered table. Verification attempts then failed three times for
  tooling reasons (regexes that could not match the `X63n1223` id form or the manifest's `<sha>  ref_`
  line, plus a walrus reassigning a set inside a comprehension), which briefly made the corpus look like
  it contained **zero** X-series witnesses — a far more alarming and entirely fictional result. Fix:
  parse data structures by import, never by re-deriving their textual format. Recorded because it is the
  same failure mode I am auditing in others, and the near-miss was only caught by refusing to accept a
  surprising number.
- [x] **Standing rule (from PR #35 review).** Before any task that can change CJK *prose* in corpus files
  (notes, coverage text), the prompt must (1) require syncing the pinned all-string CJK figures in
  `README.md:48` and `AUDIT.md:20` (the doc-truthfulness rule recomputes them from data and fails the
  build otherwise; `HANDOFF.md` §4 also carries the same snapshot but is **not** pinned for these two
  numbers, so it is a consistency choice, not a gate), (2) name the exact target numbers, and (3) keep
  those doc edits in the same PR — a label/re-key PR that leaves `main` red on `validate_data.py` poisons
  the base for the next task. Applied retroactively: 007a/007b/006 are read-only (no CJK change ⇒ no
  sync needed); **008 and every future data-touching prompt must carry it.**
- [!] **My own prompt 009 contained a wrong figure** ("620 of 680 content graphs accounted for"). The
  coder's measured table superseded it. Consequence for me: numbers I put in a prompt are hypotheses;
  §5-style "re-measure before writing" language is what caught it, so that clause is now mandatory in
  every inventory/label prompt.
- [x] **Scope decision taken on the owner's "Continue"** = **(a) label, don't re-divide** (my
  recommendation; recorded as *recommended-and-adopted*, not owner-authored — if the owner wants (b),
  009's data edits are additive so (b) stays available as a later package). **Prompts 006 and 009
  authored + pushed** (both 12.4 KB / 12.8 KB, self-contained, all cited paths verified to exist, all
  cited commands verified real):
  - **006** = Phase 1 inventory, family 1 (the **9** docs whose witnesses are T47n records, enumerated
    from `collate_corpus.py`'s `DOCS` — not from memory: linji, zhaozhou, baojing, dongshan, yunmen,
    fayan, guiyang, dahui_hongzhi, yuanwu), read-only on `data/`, plus the 4 `#NN`→`#34` fixes. Carries
    an embedded **self-test**: the coder's `linji_yulu` row must move 79/89 → 84/89, because a run that
    *agrees* with the stale register means it didn't run. Also encodes both traps: don't infer harness
    behaviour from `validate_data.py`'s constants (my own retracted error), and never file a misspelling
    P0 against a witness-verbatim graph (机/麁/沈惛/疎/却).
  - **009** = `platform_sutra` **label-only**: 14 per-field `recension_note` + root note + honest
    `coverage_note` + `chapters[8]` note disclosing 護法品第九 vs 宗寶's 宣詔第九. Zero `zh`/`title_*`/
    English changes, manifest byte-identical, collation deliberately unchanged at 4/13, `recension_note`
    reused as the existing convention (no new key). My §5 decision table for it (1 Dunhuang / 3 宗寶 /
    9 neither of 13) was re-measured this turn from a fresh extraction, and I corrected one of my own
    facts in it before publishing (manifest lines 21/22 → **17/18**, checked with `grep -n`).
  - **Dispatch both in parallel**: they are provably disjoint (006 = inventory + 2 tracker files;
    009 = 1 corpus file + generated artifacts + allowlist + 2 tracker *paragraphs* appended at
    different anchors). 009's base check says "at or after `ef13b26`", so it survives 006 landing first.
- [x] **platform_sutra pre-audit (owner ruling received: Dunhuang primary).** Verified with my own
  digest-checked extraction (`ref_T48n2007.txt` = `4f6ac8de…`, `ref_T48n2008.txt` = `71a340cb…`, both ==
  manifest). (1) The 3 gāthās in `chapters[0].verses[]` are **correctly cited, not mixed**: Shenxiu's
  verse and the familiar 本來無一物 form are verbatim in **T48n2008** (so 本來無一物 is *not* a modern
  coinage), and the 佛性常清淨 variant is verbatim in **T48n2007**; the file already carries a
  `recension_note` doing exactly the labeling the owner asked for → **adopt `recension_note` as the
  label field instead of inventing `witness_alternatives`** (plan §4 amended). (2) All 10
  `chapters[*].title_zh` cores (行由品第一 … 付囑品第十) are attested in **neither** witness; 宗寶's TOC
  uses 行由第一 without 品, the Dunhuang text has no 品 headings at all. (3) **`護法品第九` is not a
  chapter name in either witness** — T48n2008 has `宣詔第九`; 護法 occurs 0× in both. Contained: 1
  occurrence, data only (README/AUDIT/HANDOFF/STATE clean), and chapter names are collation-excluded so
  the register structurally cannot catch it. (4) Root `title_zh` 六祖大師法寶壇經 is verbatim in T48n2008
  only; the Dunhuang witness opens with the long 南宗頓教…一卷 title. Open scope decision before 009:
  Dunhuang-primary = re-divide to the Dunhuang structure, or keep the 宗寶 chapter frame as a *labelled*
  convenience. Current content state is far better than "9/10 fields match neither" implied: the verses
  are sound and labelled, and 1 of the 10 narrative fields is verbatim in the 宗寶 witness.
- [x] **RETRACTION — my own near-miss, recorded so it is not repeated.** I reported a "collation blind
  spot": that `chapters[*].verses[*].zh` was never collated because `verses` is absent from
  `CONTENT_COLLECTIONS`. **False.** That constant lives in `validate_data.py` and drives unit counting
  and status rendering only; the collator enumerates through its own fully recursive `iter_fields()`
  (`scripts/collate_corpus.py:194`) gated by `SRC_KEYS`, and it does reach the verses — the register's
  13 content fields = 9 flagged + 4 collated, verses included. The lesson is precisely the owner's
  mandate: inferring system behaviour from one tool's neighbouring constant is how false findings get
  made. Verify by running the code, not by interpreting it.
- [x] **Integrity campaign opened.** `.orchestrator/local/INTEGRITY_PLAN_2026-09-11.md` published
  (P0 taxonomy, verification protocol, oldest-near-complete witness policy, labeling vocabulary,
  5 phases, first ten steps). Phase 1 = full-corpus independent inventory (prompts 006–008, read-only
  on data), which supersedes my earlier option list: 006 is now the T47-family inventory, not
  `platform_sutra` and not the evidence pass. Findings already measured with my own extraction
  (39/39 refs verified, 0 drift): register arithmetic holds for 35/35 docs (4 apparent gaps are my
  post-remediation runs vs the append-only 2026-09-10 register — expected); 0 Latin contamination in
  `zh` fields across all 35 files; `cbeta_id` vs collation witness agrees for 35/35; exactly 1 live
  `coverage_note` carries completeness language (`platform_sutra`, and it is the misleading one);
  `xinxin_ming` best-matching witness is `T48n2010` at 33/37 stanzas + 142/146 clauses vs `T48n2012A`
  and `T48n2012B` at 0/37, so #34's certified witness survives the new oldest-rule untouched;
  876 `reconstruction_unverified` labels across all 35 files (honest in data, invisible in Reader);
  162 distinct `speaker` strings across 30 files still un-audited — Phase 3.
- [ ] **Pick 006 (needs an operator/owner choice, so not authored yet).** Options measured this turn:
  (i) **Wave 1 doc 5 `platform_sutra`** — blocked on the owner's ruling, and **re-scoped by
  measurement (2026-09-11)**: the assumption "text is mixed between the two recensions" is **wrong**.
  Of the doc's 10 CJK-bearing content fields, **9 match neither witness verbatim** (0/620 graphs in
  T48n2007; 53/620 = 8% in T48n2008, that one field being ch[3].dialogue[0]); only `ch[3].dialogue[0]`
  is verbatim in T48n2008. The two witnesses barely overlap each other (16 of 1,627 sampled 16-graph
  T2008 spans occur in T2007; T2008 is 26,043 graphs vs T2007's 12,124 = 2.15×), so this is **not** a
  xinxin-style variant call — the "recension" choice selects a different book. The doc's 10-chapter
  skeleton (行由/般若/疑問/定慧/坐禪/懺悔/機緣/頓漸/護法/付囑) matches T2008's division; T48n2007 lacks
  the 行由/疑問/定慧/機緣 headings as section names. So the owner's real choice is: **(A)** treat it as
  a 宗寶-recension document and replace the 9 fields with T48n2008 text (large rewrite; `coverage_note`
  currently implies the 680 CJK are "selected excerpts" of T2007 and must be corrected either way);
  **(B)** keep the condensed reader text but strip/replace the T2007 witness claim and label it
  project-authored (the R-B shape) — **a doc-level R-B decision, which the linji-specific per-field
  ruling does NOT extend to**; **(C)** remove it from the public 5-room scope. My recommendation:
  **(B)** — least fabrication risk, no invented Classical Chinese, keeps the reader experience, and it
  is the only option I can encode without the agent having to write scripture. Awaiting owner choice.
  (ii) **Post-remediation evidence pass** for the 4 completed docs — new dated register overlay +
  validator merge; the only route to `collated_to_claimed_witness` for wumenguan / biyanlu_cases /
  linji_yulu / xinxin_ming. No owner decision needed; touches `validate_data.py` + `w1_evidence.py`
  semantics, so it must be scoped as evidence-only (no text edits).
  (iii) **English-rendering reconciliation** for the re-keyed docs: I expected ~24 stale fields; on
  measurement **only 1–2 actually need rewording** (xinxin `[16]` red_pine "surely enters" for
  必→心, and `[28]` cleary/red_pine "Serene/Still, empty and bright" for 寂然虛明→虛明自然) — 10 of the
  12 wording-sensitive renderings are pure graphic variants the English already renders correctly.
  So this is small, not a good standalone PR; better folded into (ii)'s report as a note.
  Also quantified: `reconstruction_unverified` appears **876 times across all 35 corpus files**
  (wumenguan 81, xinxin 74, zhaozhou 54 …) — the real Phase-5 debt, and human work by standing ruling.
- [ ] **Dispatch stubs for 004 and 005** (hand to operator): 004 first — it moves `main` and 005's
  base line depends on it; dispatch 005 only after 004 merges (standing rule: no pre-authoring
  against a base that an open PR will move).
- [ ] **Operator action (not an agent PR): GitHub repo metadata** — `description`, `homepage`,
  `topics` all verified empty on 2026-09-11; also 29 stale orphaned `arena/*` heads (137 refs) to
  prune at the operator's discretion. `gh api repos/56eli/translatechan/branches/main/protection`
  returns 403 for this token, so protection rules are unverified from here.
- [ ] Wave 1 doc 5 — `platform_sutra` (**owner must pick the recension first**: T2008 宗寶 vs
  Dunhuang T2007 — currently mixed in one document; do not let an agent choose).
- [ ] Composite-title plan item — measured from the register 2026-09-11: **299 `title_zh` flags across 35 documents** (biyanlu_cases 86, linji_yulu 74, zhaozhou_yulu 16, platform_sutra 10, huangbo_chuanxin 9 …); my earlier "86 + 73" note undercounted Linji (74) and ignored the other 216. Touches `app.js` +
  smoke guards; separate PR by design.
- [ ] Post-remediation evidence pass (new dated register overlay + validator merge; flips
  `wumenguan`/`biyanlu` statuses).
- [ ] Visual-system reset; W2 verified-quotation spot-check (177 slots; Senzaki & Reps 1934 first).
- [ ] Waves 2–4 remediation per `REMEDIATION_PLAN` §2.
- [ ] Frozen (owner): PR-A real-browser verification, PR-B CSP/inline-style hardening, PR-D
  performance (measure first).
- [ ] Not agent work: rights review of 14 `rights_manifest.json` sources; `.github/workflows/*`
  edits (owner approval; now tracked in the relocated workflow-edits file); branch-protection
  confirmation (403 for this integration).

## Interrupted Work

- **PR #30's coder session** (`arena/01a08da1-translatechan`) stalled on 2026-09-11 after
  "Now I'll run final hygiene checks and clean up". Impact: none — all 8 sub-tasks were pushed,
  CI green on the final commit `b767667`, and this session re-ran the full check set on that
  commit independently. The branch can be abandoned once #30 merges. The push cadence worked.

## Deferred / Technical Debt

- `biyanlu_cases` English `ai_literal` re-rendering where the re-keyed `zh` meaning diverges —
  13 fields enumerated in PR #30's description; separate editorial task, do not mix into a re-key.
- `biyanlu_cases` 86 `title_zh` metadata flags — separate composite-title plan item.
- `biyanlu` case-42 coverage gap (witness has a 垂示, document carries 78 of 79 pointers) —
  disclosed in `coverage_note`, deliberately unfixed; adding it is outside a 42-field work-order.
- Post-remediation evidence pass (status flips) — separate per the wumenguan precedent.
- Congronglu reintroduction — quarantined 2026-08-10; blocked on source-pinned field-level
  collation. Do NOT restore.
- `.github/workflows/quality.yml` artifact-diff gaps (4 mirrored assets) + Action majors +
  branch protection — owner-controlled; the exact edits live in `.scoreboard/manual-workflow-edits.md`
  until prompt 002 relocates that file.
- No real-browser/accessibility evidence obtainable in these sandboxes (Playwright Chromium
  download `ECONNRESET`, re-observed by PR #30). Never describe the design as screenshot-verified.
- `app.css:2186` comment `/* Error Boundary UI (Scoreboard P2 resiliency fix) */` is now a
  reference to a deleted system. **Do not hand-fix it**: the file is mirrored byte-identically to
  `docs/app.css`, so any edit must go through `python3 scripts/build_data_bundle.py` in a PR that
  touches CSS — fold into the visual-system reset (or PR-B), never into a docs PR.
- `data/corpus/*` English follow-up debt recorded by PR #30 (13 `ai_literal`/`*_en` fields now
  diverge from the re-keyed `zh`); keep it out of any re-key PR.

## Owner Rulings (this session)

- **2026-09-11, verification mandate (binding, program-level):** independently verify every claim the
  project asserts; **past agent work is not trusted evidence** — re-measure it. False citations, false
  teacher attribution, and misspellings are **P0**. Plan: `.orchestrator/local/INTEGRITY_PLAN_2026-09-11.md`.
- **2026-09-11, witness preference (binding, all texts):** prefer the **oldest near-complete** copy over
  what became popular later — not only for `platform_sutra`. Later/expanded editions become **named
  alternatives in notes**, never silently merged, never deleted. "Everything can be cleanly labeled as
  such, with notes referring to the alternative texts." This resolves the `platform_sutra` open question
  toward the Dunhuang-era witness as primary, with the 宗寶 recension cited as the alternative — subject
  to §3's near-complete definition being stated per document first.
- **Derived standing rule — no over-correction gates.** A graph that looks simplified/modern but is
  verbatim in the cited witness is CORRECT: measured today, `linji_yulu` `.sections[66].dialogue[0].zh`
  has 机 where 機 looks "proper", and T47n1985 itself carries 机 twice (機 eleven times). Same for
  麁/粗, 沈惛/昏沉, 疎/疏, 却/卻 from PR #34. So the `simplified` advisory list must never become a
  classification input or a CI gate. Recorded because the intuitive "fix the misspellings" pass would
  create false readings, which is itself a P0.

- **2026-09-11, sequencing:** Phase 2 priorities approved as proposed, with one change — the
  scoreboard removal moved from last to slot 2. Done (PR #31, merged `e4b17f7`).
- **2026-09-11, `linji_yulu` §67–73 (行錄 division):** per-field R-A where the witness has the
  passage, R-B (keep + label + strip witness attribution) where it does not. Explicitly rejected:
  blanket R-B over the whole division, and dropping the sections. Encoded in prompt 003 §4; treat
  as binding for any future re-run of this task.
- **2026-09-11, prompt 003 scope:** composite-title split stays a separate PR (it touches `app.js`
  and the smoke guards, unlike a mechanical re-key).
- **Still owed by the owner before doc 5:** the Platform Sutra recension decision (T2008 宗寶 vs
  Dunhuang T2007) — do not let an agent pick it.

## Architectural Invariants

Binding on every prompt authored here (from `main`'s `STATE.md` + owner decisions):

1. Never generate source-looking Classical Chinese. Corpus text comes only from recorded
   authoritative sources, re-keyed mechanically from digest-verified reference text.
2. N/N representation never establishes completion; `scripts/validate_data.py` is the spec.
3. Edition verification ≠ rights approval; tracked separately everywhere.
4. Internal identifiers stay (`translatechan_*`, `window.TranslateChan`, `TRANSLATECHAN_DATA`);
   public brand "Fake Chan Factory"; humor-forward tone stays.
5. Public scope is exactly 5 rooms (Reader, Matrix, Lineage, Gong'an, Lexicon), smoke-guarded.
6. No edits to `.github/workflows/*` without explicit owner approval. Until prompt 002 merges,
   the scoreboard contract still binds agents (fill its PR-template sections honestly, never
   infer or change a `user_score`); after 002, that paragraph is deleted, not silently ignored.
7. Pipeline order fixed: `data/` → `validate_data.py` → `project_metrics.json` →
   `build_data_bundle.py` → root assets + byte-identical `docs/` mirror. All five gates pass
   before every push.
8. Durable memory lives in repo files; dated evidence under `sessions/` is immutable and
   append-only; `data/corpus/` source text is protected by
   `scripts/test_source_preservation.py` against pinned base `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43`.
9. Orchestrator protocol (v3.2): prompts travel as files on this branch with short dispatch
   stubs; one agent at a time per repo unless provably file-disjoint; coders open PRs; the
   operator merges; this orchestrator advises MERGE / REVISE / DO-NOT-MERGE and never merges.

## Review Log

- **PR #37** — task 008 Phase-2 consolidation, base `b3cd14f`, head `c6206a0`, 2 commits, 3 files
  (+282/−2), 278-line `.orchestrator/PHASE2_PLAN.md`. **Verdict: MERGE** — the cleanest PR of the
  campaign. Verified independently: base contains `b3cd14f`; scope is *exactly* the 3 allowed paths, no
  data/artifact/script, no reintroduced deleted path (0 `.scoreboard` adds — checked because my own
  workspace ate a commit into a stale base today); the two tracker edits are precisely §7.1–§7.3 and the
  Wave-1 `platform_sutra` box is still **unchecked** with the honest `— labelled (#35); text decision
  deferred to PHASE2_PLAN` suffix; all gated lines in `REMEDIATION_PLAN.md` survive (five-ledger sentence,
  `**35 documents, 630 flagged source fields**`, historical-manifest count), and my earlier §9 mistake
  (implying STATE.md carries them) did not mislead the coder — they read the code and edited only the
  checklist line; `STATE.md` keeps `630` and `CORRECTED|superseded`. **Table integrity: 76 rows = 70 P0 +
  6 NONE, every row exactly one kind (CITATION 6 / RE-KEY 11 / LABEL 51 / HUMAN-SOURCE 2 / NONE 6), and
  all 35 inventory docs appear — nothing dropped**, which was the clause I most expected to be evaded.
  Their 5 spot-checks reproduce under my own commands (`曹山大師語錄序` opens T47n1987A; 趙州 1 vs 曹山 25;
  T47n1985 = 臨濟, X69n1321 = 馬祖; `雪覆夜沼 / 只這箇是 / 纖塵無表 / 深根不動` = 0 hits in all 39 refs;
  sengzhao 0/4). `--require-verified-refs` is real (not an invented flag). Their fresh-run figure **532**
  flagged matches my run exactly; 630 stays correct for the pinned 2026-09-10 register, and the delta is
  the removals from #29/#30/#32/#34 — no edit to README/AUDIT/HANDOFF is warranted, and they did not
  propose one. All nine gates exit 0 in a clean clone; artifacts deterministic.
  **Non-blocking nit:** §2 calls 532 "total fields" where `aggregate.flagged_entries` is the precise name,
  and attributes it to "007b's header"; harmless (the method is published), worth one sentence at the next
  touch. Also `index.html`/`ROADMAP.md` share the per-line `T1987` rule — future prompts should say the
  scanned set is those six files, not just README/AUDIT/HANDOFF.

| Date | Prompt seq | PR | Verdict | Notes |
|---|---|---|---|---|
| 2026-09-11 | 003 | #32 | **MERGE** | Net diff 12 files == prompt 003 §6 deliverables; no `smoke_test.mjs` change (correctly unnecessary: `赤肉團` still present, count 2) and `canonical_locators.json` untouched as authorized. Allowlist set-equal to the changed pointers (14/14, 0 over-broad, 0 missing). 0 `title_zh`/0 English changes proven by leaf-level pointer diff. Witness re-extracted here (39/39 verified, 0 drift; `ref_T47n1985.txt` = `4317e5fa…`); harness re-run: content flags 10 → 5, EXACT 79/89 → 84/89, total 84 → 79, residual = 2 MINOR (`[43]`,`[58]`) + 3 NOT_FOUND (`[71]`,`[72]`,`[73]`). Every re-keyed field verified verbatim in the witness; every kept field verified to contain **zero** collating fragments (my own 8/12/16/24-char window search of `[71]` found nothing; `龍門` count in witness = 0), so each R-B label was earned, not assumed. `[72]`'s note names the different 象田 exchange the witness *does* carry — I confirmed `不凡不聖，請師速道` is in the reference. `[73]`'s composite note verified: 傳法偈 phrases (`沿流不止`, `吹毛`) absent from the witness while the deathbed exchange is collated in `blind_donkey`, and `[0].dialogue[1]` is in fact that witness form — so the note's cross-reference is true, not decorative. Statuses unchanged, manifest byte-identical. Gates re-run: compile, validate (no `--skip-docs`), preservation (181 permitted / 0 unauthorized), 96 W1 rule checks, build + artifact check clean, smoke, mirror, both `git diff --check`. CI `34585791675`-family pass on final commit; secret scan clean over all 4 commits (only `secret`/`password` prose hits from Robolated Linji text); no `/tmp`/prompt leak; orchestrator branch untouched (`fa60595`). |
| 2026-09-11 | 003 | #32 | **MERGED by operator** | Merged into `main` as `b82d904`; base verified as `e4b17f7` before review so the two-dot net diff was the real net diff. Post-merge `main` `STATE.md` carries the exact numbers my own harness run produced (84/89, 84 → 79), i.e. tracker truth == measured truth. Two notes for future prompts: the coder's `STATE.md` paragraph quotes my §-verification prose including my own `PR #29/#30 style` phrasing (harmless, but prompts should not smuggle reviewer-internal references into deliverable text), and my own spot-check of the merge used a wrong path twice (`data/linji_yulu.json`, `data/canonical/…`) before reading `git ls-tree` — the prompt's paths were right, my assumption was not.
| 2026-09-11 | 005 | #34 | **MERGE** | Wave 1 doc 4. Head `b21b056` on `arena/01a090ab-translatechan`; merge-base == `main`@`83865a6` (so 2-dot diff == net diff); 12 files == prompt 005 §9's allowed set, 7 commits == §10's required cadence, message-for-message. Witness re-extracted by me: `xml-p5` HEAD `dbdea410…` (== pinned rev), 39/39 verified / 0 drift, `ref_T48n2010.txt` sha256 `9aaa3217…` == manifest line 20. **Decisive check**: I re-derived all 12 replacements myself from the reference (text-anchor alignment + punctuation-preserving map) and compared against what the PR wrote — **12/12 byte-identical, 0 mismatches**; every new form verbatim in the witness and every old form verifiably absent. `.stanzas[31]` untouched (`zh`+`pinyin` byte-identical) with an additive note containing **zero** CJK runs ≥4 graphs — the #32 witness-quote tension explicitly avoided, and the note's cross-reference (the clause opening stanza 33) is true. Harness re-run on both trees with `--generated`: collated **24/37 → 36/37**, content flags **13 → 1** (residual `stanzas[31]` NOT_FOUND 0.75), total **14 → 2**, `source_review_status` unchanged — no status promotion; `corpus_manifest.json`, `canonical_locators.json`, `smoke_test.mjs`, `AGENTS.md` all byte-identical; only `xinxin_ming.json` changed under `data/corpus/`. Pinyin: 10 rewritten, `[14]`/`[32]` deliberately left byte-identical (象/像 xiàng, 忘/妄 wàng — same reading), which is exactly what §6.2 asked to be reported. Allowlist leaf-level set-equality **24 == 24**, 0 over-broad, 0 missing. Gates re-run here: py_compile, validate (no `--skip-docs`; corpus 35 / slots 1252 / verified 177 / locators 148/148 / flagged 630 unchanged), build idempotent + CI artifact gate + mirror equality, smoke PASS, preservation (0 unauthorized), 96 rule checks, both `git diff --check`. Numbers I re-measured rather than trusted: content CJK **584 unchanged** ✓, doc all-string **604 → 607** (+3 = the 信心銘 in the new note) ✓, `all_corpus_cjk_characters` **110,078 → 110,081** ✓, `content_cjk_characters` 104,564 held ✓. 0 credential patterns over all 7 commits; 0 prompt-path/`/tmp` leakage; CI `34613262169` pass, `MERGEABLE/CLEAN`. **The PR also corrected my own prompt**: 005's §16 said the file is "37 stanzas" four-clause-shaped; the real distribution is 36×4-clause + `stanzas[36]` (`stanza_num` 37) two-clause `言語道斷，非去來今`, and its `coverage_note` says so precisely — accurate wording beat my sloppy phrasing, so no prompt-fix follow-up is owed. |
| 2026-09-11 | 004 | #33 | **MERGE** | Docs-only drift PR, head `704d9fca` on `arena/01a09041-translatechan`, base verified as `main`@`b82d904` (merge-base == main, so the 2-dot diff is the net diff): 4 files / +10/−9, == prompt 004 §6's allowed set exactly, zero forbidden paths (`data/`, `scripts/`, `.github/`, `sessions/`, `schemas/`, `AGENTS.md`, `README.md`, `AUDIT.md`, prompts dir all untouched). Content: the stale "Next planned task: visual-system reset" + 3-item list (whose step 3 still queued the long-merged scoreboard PR) replaced with the accurate Wave 1 block (Done: #29 wumenguan / #30 biyanlu_cases / #32 linji_yulu — all three attributions re-checked against main's own merge-commit history, not the prose); `platform_sutra` recorded as blocked on the owner recension ruling with the correct witnesses (T2008 宗寶 vs Dunhuang T2007); `HANDOFF.md` §9 map de-indented by exactly 1 space; the scoreboard-era CSS comment replaced with a provenance-neutral one. **Mirror contract proven, not assumed**: `build_data_bundle.py` on the PR head is a *no-op* — `git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json` passes and `cmp app.css docs/app.css` is identical, so `docs/app.css` was regenerated rather than hand-edited. All gates re-run in a real clone: py_compile, `validate_data.py` w/o `--skip-docs` (corpus 35 / slots 1252 / verified 177 / locators 148-of-148, W1 collated=1 partial=32 unavailable=2 flagged=630 — unchanged from main), build, CI artifact gate, smoke PASS, preservation (181 permitted / 0 unauthorized), 96 W1 rule checks, `git diff --check`, `diff -rq data docs/data`. Scoreboard-in-CSS/JS/HTML 2 → 0 measured on both trees. Overclaim scan on ADDED lines only (complete_selected_witness / 37/37 / 84/89 / "all … verified" / rights) = 0 hits; secret scan = 0; zero prompt-path leakage in the diff. One commit == §9's required message and count. `MERGEABLE`/`CLEAN`, CI `34595199913` pass. Non-blocking notes: (a) the numbered list dropped the "177 quotations (Senzaki & Reps 1934, fetch via Archive.org)" restatement but `W2 remains separate` preserves the pointer — §4's ban on restating counts makes that the compliant reading; (b) the new "Active track" paragraph re-states the R-A/R-B/R-C definitions that already live elsewhere in STATE.md (mild redundancy, and a dedupe elsewhere would have violated my own no-tidying rule); (c) my §8 grep hint `grep -c "OPERATIONS.md" HANDOFF.md → unchanged (1)` was itself wrong — the file legitimately has more than one mention — so the agent's silence on that check was correct and my hint was the defect. **During this review the workspace was re-created on the stale base `02e5db7` a 4th time (mid-turn); the published ledger `d4c9686` and all four prompts were unaffected and the review ran entirely in an isolated clone.** |
| 2026-09-11 | 003 | #32 | *(observations, non-blocking)* | (1) Cadence compressed: 4 commits for 8 sub-tasks — the single data commit `5aeb0bf` covers sub-tasks 2–4 (reference setup touches no repo file, so its "checkpoint" is unobservable). No work lost; next prompt must make each data-touching sub-task its own commit. (2) `.sections[72]`'s R-B note quotes a witness line (`不凡不聖，請師速道`); honest and non-rendered (`editorial_note` has no Reader rendering), but a witness quote inside a "no witness attribution" field is a tension the post-remediation evidence pass should either reword or promote to a structured `witness_alternative` field. (3) Coverage-note wording distinguishes "not re-keyed by policy" (MINOR) from "kept, labelled" (NOT_FOUND) — I first read it as conflating them and checked before flagging; no defect. |
| 2026-09-11 | 002 | #31 | **MERGE** | Docs/contract PR retiring the scoreboard. 12 changed files == prompt 002's deliverable list exactly, nothing else (no `data/`, `docs/`, `scripts/`, `sessions/`, workflow, `README.md` — all verified by path). Net +76/−1084. `OPERATIONS.md` registered as rename of `.scoreboard/manual-workflow-edits.md` (R069) with Edits 1–3 preserved verbatim; the only altered content lines are the two the prompt authorized (validation block → pointer to `quality.yml`; the `repo_ready`/P1 sentence). `git ls-files \| grep -i scoreboard` empty; reference scan clean — every surviving "scoreboard" string is in a deliberately-retiring sentence, an authorized queue/tick line, or a historical file left untouched. All 35 markdown links in touched live docs resolve to existing paths (incl. both `HANDOFF.md#5-release-blockers` anchors; heading is `## 5. Release blockers`). Gates re-run by me on the PR head: compile, `validate_data.py` (no `--skip-docs`), build (no-op; artifact gate clean **even with the 4 mirrored paths CI omits**), smoke, mirror diff, preservation (0 unauthorized), 96 W1 rule checks, both `git diff --check`. CI `34579974025` pass on the final commit; orchestrator branch untouched (`0fc5ae1` unchanged); secret scan 0 hits across all 7 commits, not just the net diff. 6 `chore: wip` checkpoints map 1:1 to sub-tasks 1–6 then one `docs:` final — cadence as designed. Minor, non-blocking: `HANDOFF.md:174` repo-map comment column is 1 char off the block's alignment; `app.css:2186` keeps a stale "(Scoreboard P2 resiliency fix)" comment (mirrored to `docs/` — must NOT be hand-edited). `STATE.md:32` left as-is with a written scope argument (names a PR, not a deleted path) — accepted; the stale sequencing block is prompt 004's job. |
| 2026-09-11 | prev-gen 001 | #30 | **MERGE** (independently re-verified by this session) | Net diff 13 files, all inside the prompt's deliverable list. Allowlist set == changed-pointer set (39 = 20 `zh`/`pointer_zh` + 17 pinyin + 2 `editorial_note` + `.coverage_note` + `.zh_chars`), 0 `title_zh`, 0 English. Independently re-extracted CBETA refs from `dbdea41…`; 39/39 verified, 0 drift; `ref_T48n2003.txt` sha256 `47678e84…` matches the published manifest. Harness re-run: content 353/395 → 373/395 EXACT; flagged 128 → 108; 0 DIVERGENT / 0 NOT_FOUND / 0 SHORT_UNMATCHED content residual; 22 MINOR + 86 titles untouched. 13 sampled re-keyed fields verified verbatim-contained in the witness CJK stream; two superseded main-side pointers confirmed absent from the witness. Gates re-run on `b767667` (py_compile, validate incl. committed metrics + doc truthfulness, build + clean artifact check, smoke incl. preservation + W1-rule suites, `diff -rq data docs/data`, `git diff --check`). No secrets in the net diff or the WIP commit (only `TRANSLATECHAN` identifier collisions); orchestrator branch `arena/01a08d90-translatechan` untouched by the coder (`db19997` → `b80ac28` are its own commits). Case-42 gap and case-82 gaiji are disclosed, not hidden. Status correctly left at `partial_or_failed_w1_collation`. |

- **PR #35 revision 2** (head `fd250e3`, 9 commits, 13 files) — **Verdict: MERGE**. The requested doc-count
  sync landed exactly (README.md:48, AUDIT.md:20, *and* HANDOFF.md §4 → 110,165; content 104,564
  correctly untouched). The branch also absorbed **task 006** (`654189a` inventory, `fd250e3` the four
  `#NN`→`#34` fixes) — so #35 is now two work packages; reviewed both rather than the diff alone.
  **Independent reproduction, all green:** full 39-work ref extraction by me (`39 verified / 0 drift`);
  my own `collate_corpus` run on main agrees with 006's inventory on **all nine docs** (linji 84/89 moved,
  other eight Δ=0 as predicted) ⇒ 006's self-test genuinely passed, not parroted; `zhaozhou` counts
  reproduce exactly (趙州 1/1, 曹山 25/28); `guiyang` 0×16-graph windows across all 39 refs ✓; `yuanwu`
  0/2 ✓; `fayan` coverage_note really cites T1985/X1321 ✓; `dahui_hongzhi` divergence at 雪覆夜沼 /
  功見照中 absent everywhere ✓. All nine gates exit 0 in a clean clone at the head, `git status` empty
  after build+`--write-metrics` (artifacts deterministic), zero `#NN` left in any tracked doc, and
  `data/corpus/` diff is still *only* `platform_sutra.json` (+26/−13, all notes) ⇒ 006's read-only rule
  held even with 006 riding on the same branch. Post-merge, **main is green on its own**, so the next
  task's base is clean — which was the point of insisting the two numbers move in this PR.
  Two notes, neither a blocker: (1) the `dahui_hongzhi` phrase-9 boundary counts 鑑/鑒 (a graphic variant
  `cc.norm()` does not fold) as a divergence; harmless — it matches the harness, which also flags the
  field DIVERGENT — but the wording reads as if the split were purely lexical; (2) `STATE.md` "Next (in
  order): 1. `platform_sutra` remediation — blocked on an owner recension ruling" is now false (the ruling
  exists and this PR implements it). No gate reads that line; queued for the 008 consolidation, which is a
  tracker-writing task and will own it.
- **PR #35** — `platform_sutra` recension labels (task 009), base `ef13b26`, head `cf4c9df`, 6 commits /
  9 files. **Verdict: REVISE** (one mechanical, gate-required edit set; everything else is merge-ready).
  Independently re-measured on a clean clone of the head: witnesses reproduce (`ref_T48n2007.txt`
  12,124 graphs `4f6ac8de…`, `ref_T48n2008.txt` 26,043 `71a340cb…`, 2 verified / 0 drift); **0 non-note
  changes** by full-tree walk (14 note leaf pointers, no new key types, `chapters[0].verses[2]` note left
  byte-identical as instructed); every claim in every note is true (1 field in 2007 = 20 graphs, 3 in
  2008 = 93, 9 in neither = 567, total 680 under the collator's own `norm()`; 護法 0 hits in both; all ten
  `title_zh` cores in neither; root title only in 2008; Dunhuang opens 南宗頓教 ✓); content CJK identical
  main↔head (107,527 by my walk, 104,564 by the project's rule — **unchanged**, so the zero-re-key claim
  holds); manifest/locators/smoke/collators byte-identical; allowlist set-equal at 14 pointers *and*
  correctly excludes the pre-existing note (over-broad pointers are uncatchable by the test —
  `classify_changes()` only rejects unauthorized *actual* changes — so that judgement was the coder's, and
  right). Gates: 3 red, one root cause — all-string CJK 110,081 → **110,165** (+84 from the note prose) is
  *pinned into README.md:48 and AUDIT.md:20 prose* by `validate_data.py`'s doc-truthfulness rule, which
  cascades into `smoke_test.mjs` and `test_source_review_rules.py`. Proved on clean main: 0 errors / 96 of
  96; proved the fix: editing only those two numbers → **all 7 gates exit 0**, no rebuild needed, no
  metrics churn. **The coder followed my prompt exactly and correctly refused to over-reach** — §7 forbade
  `README.md`/`AUDIT.md`, §10 said report-don't-edit, and that is what it did, while also (a) re-measuring
  under *both* normalizers, (b) correcting my own §5/§6 arithmetic (I wrote "620 of 680 accounted for"; the
  true split is 20+93+567 = **680**), and (c) explicitly declining the tempting cheat of romanizing 宗寶 /
  宣詔第九 to keep the metric flat. **My prompt defect, not theirs**: any PR adding or removing note prose
  must sync the two pinned all-string CJK figures. Recorded for the standing rule below.
## Prompt-Authoring Lessons (inherited + this session)

- **Standing step, not an incident note: verify my own base at the START of every turn.** The
  workspace has now been re-created on a stale base **three times** (`02e5db7` twice, once even
  mid-turn: `refs/remotes/origin/_orch` vanished between two commands while local HEAD sat on
  `02e5db7` with the working copy holding current `main` content + untracked `.orchestrator/`).
  Opening sequence for every turn: `git fetch --depth 1 origin +arena/01a08e15-translatechan:
  refs/remotes/origin/_orch` → compare `rev-parse HEAD` with it → if unequal, `cmp` my ledger and
  prompt files against `git show _orch:<path>` and only then `reset --hard`. Content in the working
  copy can look perfectly current while HEAD is stale, so `git status` alone proves nothing.

- **Prompts must forbid placeholder commits, not just tolerate them.** #32 and #34 both shipped
  `PR #NN` in tracker prose because the PR number is unknowable pre-open. Fix for 006: require the
  coder to push once, read back its own PR number via `gh pr view --json number`, then amend the
  tracker rows in a final `docs:` commit — or accept `#NN` and have the *orchestrator* fix it
  post-merge (what happened both times). Prefer the latter; stop leaving it implicit.
- **A prompt's own factual aside can be wrong and the coder should out-veto it.** 005 §16 implied 37
  uniform four-clause stanzas; the file has 36 + a two-clause closer, and the PR wrote the accurate
  note instead of parroting me. Prompts should therefore phrase incidental description as
  "verify, then trust" (as §2 does) — this is the second time an agent's correction beat my summary.
- **A register `ref_window` is a *scored* window, not a replacement string.** On `xinxin_ming`, 5 of
  13 `ref_window` values are not substrings of the witness at all and several are offset from the
  true stanza, because `classify()` reports the best-similarity span. A prompt that pastes
  `ref_window` in as "the witness text" would teach a coder to write fabricated "witness" readings.
  Rule: derive every replacement from the reference file, then require the verifier
  `strip_punct(new) in ref` → true and `strip_punct(old) in ref` → false.
- **Never hard-code positional arithmetic into a prompt.** My first 005 draft assumed verse clauses
  sit at multiples of 4; the ref opens with a 3-graph title (`信心銘`), so the pitch is ≡3 mod 4 and
  every alignment silently failed. State alignment rules as *text anchors* ("find a clause that occurs
  exactly once"), never as index formulas.
- **Re-measure queue facts from the register at prompt-authoring time.** I had carried "`xinxin_ming`
  12 flags" forward from a predecessor's summary; it is 13 content + 1 metadata. The same habit found
  my "86 + 73 titles" note undercounting 299 to 159.
- **Don't let reviewer-internal phrasing leak into deliverable text.** #32's `STATE.md` row echoed
  my own prompt wording ("PR #29/#30 style"); prompts should say *what* to write, not *how I talk*
  about it.

- **Never hand-transcribe per-class pointer lists into a prompt.** The predecessor's prompt 001
  mislabelled `.cases[2].pointer_zh` as DIVERGENT (register: NOT_FOUND) and omitted
  `.cases[1].dialogue[1].zh` (DIVERGENT), and its section 15 said "19 adjudicated fields" where
  the register says 20. The agent caught it and deferred to the register. Fix: emit the lists
  with a script from `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` and paste the output.
- **A `git worktree` cannot run this repo's verification scripts** — both
  `scripts/test_source_preservation.py` and `scripts/smoke_test.mjs` resolve paths through a
  real `.git` **directory** and die with `NotADirectoryError` in a linked worktree of a shallow
  clone. For PR review, use a second clone (`git clone` from the local repo, then `git remote
  set-url` + `git fetch --depth 50 origin +<target>:refs/remotes/origin/_pr2`, `checkout -B`).
  Judge "CI failed" only after ruling this out — PR #30's first worktree failure was environmental.
- **The refs pipeline works in this sandbox**: blobless sparse-checkout of `cbeta-org/xml-p5`
  + `collate_refs.py` verified 39/39 with 0 drift in ~3 s of transfer. Do not pre-emptively
  mark collation tasks network-blocked.
- Prompts must tell the coder the branch is platform-provisioned and pinned (`arena/*`) rather
  than inventing a `feature/*` name; the predecessor's shape worked and produced clean checkpoints.
- **The workspace can be re-created under the session.** Between two of this session's turns the
  sandbox was re-cloned: `git reflog` showed `clone: from …` at the then-current `main` followed by
  `checkout: moving from main to arena/01a08e15-translatechan`, which moved local `HEAD` off my
  published orchestrator commit while leaving the files on disk untracked. The remote branch was
  untouched (`1a66ec8`), so nothing published was lost. Recovery: `git fetch` the branch to a named
  ref, `diff` the working copies against `git show <ref>:<path>` to prove they match, then
  `git reset --hard <ref>` — never push from the reset-back state, which would attempt to rewind
  published history. Consequence for the protocol: always re-verify with a fetch-to-`_orch` +
  `git ls-tree` immediately before dispatching, and treat a *missing local commit* as a restore
  artifact, not as evidence that the publish failed.
- **Recur depth: the sandbox can re-create the workspace on a *stale* base between turns — and it
  will silently re-parent your commits.** Observed twice more after the first report: the tree
  content matched post-#31 `main`, but `HEAD` was re-pointed to `02e5db7` (post-#29), so my next
  commit got a wrong parent and the push was rejected as non-fast-forward. Detection is cheap and
  must be automatic: after every orchestrator commit, `git fetch` the branch ref and require
  `remote == local`; if they differ, `git reset --hard <ref>` (after backing up the two
  orchestrator files) and re-apply, because **the remote is the published truth and the local
  graph is disposable**. Never `--force` a stale base over published history, and never read a
  rejected push as a credentials/network failure — it is a base failure, and the fix is reset +
  re-apply, not force.
- **A stale orchestrator base silently "reverts" merged work in any branch-vs-main diff.** After
  #31 merged, `git diff main.._orch` listed `AGENTS.md`, `HANDOFF.md`, `.scoreboard/*` etc. as
  changed, because my branch tree still carried the pre-#31 state. Nothing was actually
  reintroduced (coders fetch a single file with `git show ref:path`, not the tree), but the diff was
  actively misleading — and this happened twice in one session. Rule: after **every** operator
  merge, sync this branch with `git fetch --depth N origin +main:…` + `git merge --no-edit` +
  ordinary push, then re-run the verify gate and expect the branch-vs-main delta to be exactly
  `.orchestrator/prompts/*` + `.orchestrator/local/ORCHESTRATOR_STATE.md`. Fix it before the
  prompt's own "base" language can be read as advice to branch from here. The re-cloned `arena/*` HEAD was
  pre-#30, so the branch tree lacked the merged remediation (`grep 早知是火` on
  `data/corpus/biyanlu_cases.json` returning 0 was the tell). Aligning it hit the shallow-graft
  failure the protocol predicts: `git merge origin/main` answered "refusing to merge unrelated
  histories" even though a merge-base exists on the real remote. Fix: deepen **both** sides
  (`git fetch --depth 200 origin +main:refs/remotes/origin/main`, same for the orchestrator ref);
  then `git merge-base` resolves, the merge is ordinary and additive, and the push is a plain
  fast-forward — no force-push, no rewrite. A single-parent "sync commit" would have been worse:
  its tree-vs-`main` delta would present #30's merged work as this branch's own.

## Known Gaps

- Branch protection on `main` unconfirmed (`branches/main/protection` → 403; rulesets not
  readable). Owner/GitHub-UI item, tracked in the manual-workflow-edits file.
- `main`'s `STATE.md` narrative lines are stale in two places (next-task ordering; PR #30 not
  yet recorded as merged) — corrected only by an agent PR after the merge actually happens.
- 30/30 lineage edges remain `traditional_link_pending_exact_locator`; 3 lineage profiles have
  honest empty `linked_corpus_keys` (frontier scaffolds).
- `schemas/translatechan-data.schema.json` is declarative only; the Python validator enforces.
- `editorial_note` is accepted but never *rendered* or schema-validated structurally — accepted
  for both merged re-keys; whether to surface it in the Reader is an open design question.

- **Name every path from a `test -f`, never from memory.** In 012's first draft I wrote `docs/ROADMAP.md` in six
  places; the file is `ROADMAP.md` at the repo root and `docs/` holds only the built reader. Same error class as
  last week's invented `verification_note` key. Standing remedy now applied before publishing any prompt:
  extract every backticked repo path from the draft and `Path.exists()` each one (`python3 - <<'PY'` + a regex over
  `data|docs|scripts|sessions|schemas|.orchestrator` prefixes) — it costs one command and it is how I caught this.
  Also compile any Python fragment the prompt asks the coder to run, and quote line numbers only from a `sed -n` of
  the file at the current base (`ROADMAP.md:198` in my draft was a phantom; `:163`/`:177` were real).
