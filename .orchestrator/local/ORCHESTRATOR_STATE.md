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
| 003 | `.orchestrator/prompts/003-linji-yulu-rekey.md` | W1 remediation Wave 1 doc 3: adjudicate `linji_yulu`'s 10 content flags against T47n1985 (2 DIVERGENT + 6 NOT_FOUND adjudicated, 2 MINOR untouched), rewrite the false `coverage_note`, 行錄 sections 67–73 per the owner's per-field ruling | next coder session | — | Published 2026-09-11 — dispatch-ready; base `main` = `e4b17f7` |

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
- [ ] **Operator action: dispatch prompt 003** to a fresh coder session using the stub handed over
  2026-09-11. One agent at a time on this repo.
- [ ] **Prompt 004 (to author, after #31 merges) — tracker-drift + repo metadata PR**: rewrite
  `main`'s `STATE.md` "Next planned task" and "Next (after the visual-system reset, in order)"
  block (currently still lists the scoreboard removal as step 3, which PR #31 completes) to
  post-scoreboard reality; fix `HANDOFF.md` §9 repo-map comment alignment at `OPERATIONS.md`
  (1 char, flagged in the #31 review); set GitHub repo `description`, `homepage`, `topics`
  (verified empty 2026-09-11) — that half is likely owner work via `gh`, not an agent PR.
- [ ] Wave 1 docs 4–5 — `xinxin_ming` (per-field recension decision), `platform_sutra`
  (**owner must pick the recension first**: T2008 宗寶 vs Dunhuang T2007).
- [ ] Composite-title plan item (86 `biyanlu title_zh` + 73 Linji titles) — touches `app.js` +
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

| Date | Prompt seq | PR | Verdict | Notes |
|---|---|---|---|---|
| 2026-09-11 | 002 | #31 | **MERGE** | Docs/contract PR retiring the scoreboard. 12 changed files == prompt 002's deliverable list exactly, nothing else (no `data/`, `docs/`, `scripts/`, `sessions/`, workflow, `README.md` — all verified by path). Net +76/−1084. `OPERATIONS.md` registered as rename of `.scoreboard/manual-workflow-edits.md` (R069) with Edits 1–3 preserved verbatim; the only altered content lines are the two the prompt authorized (validation block → pointer to `quality.yml`; the `repo_ready`/P1 sentence). `git ls-files \| grep -i scoreboard` empty; reference scan clean — every surviving "scoreboard" string is in a deliberately-retiring sentence, an authorized queue/tick line, or a historical file left untouched. All 35 markdown links in touched live docs resolve to existing paths (incl. both `HANDOFF.md#5-release-blockers` anchors; heading is `## 5. Release blockers`). Gates re-run by me on the PR head: compile, `validate_data.py` (no `--skip-docs`), build (no-op; artifact gate clean **even with the 4 mirrored paths CI omits**), smoke, mirror diff, preservation (0 unauthorized), 96 W1 rule checks, both `git diff --check`. CI `34579974025` pass on the final commit; orchestrator branch untouched (`0fc5ae1` unchanged); secret scan 0 hits across all 7 commits, not just the net diff. 6 `chore: wip` checkpoints map 1:1 to sub-tasks 1–6 then one `docs:` final — cadence as designed. Minor, non-blocking: `HANDOFF.md:174` repo-map comment column is 1 char off the block's alignment; `app.css:2186` keeps a stale "(Scoreboard P2 resiliency fix)" comment (mirrored to `docs/` — must NOT be hand-edited). `STATE.md:32` left as-is with a written scope argument (names a PR, not a deleted path) — accepted; the stale sequencing block is prompt 004's job. |
| 2026-09-11 | prev-gen 001 | #30 | **MERGE** (independently re-verified by this session) | Net diff 13 files, all inside the prompt's deliverable list. Allowlist set == changed-pointer set (39 = 20 `zh`/`pointer_zh` + 17 pinyin + 2 `editorial_note` + `.coverage_note` + `.zh_chars`), 0 `title_zh`, 0 English. Independently re-extracted CBETA refs from `dbdea41…`; 39/39 verified, 0 drift; `ref_T48n2003.txt` sha256 `47678e84…` matches the published manifest. Harness re-run: content 353/395 → 373/395 EXACT; flagged 128 → 108; 0 DIVERGENT / 0 NOT_FOUND / 0 SHORT_UNMATCHED content residual; 22 MINOR + 86 titles untouched. 13 sampled re-keyed fields verified verbatim-contained in the witness CJK stream; two superseded main-side pointers confirmed absent from the witness. Gates re-run on `b767667` (py_compile, validate incl. committed metrics + doc truthfulness, build + clean artifact check, smoke incl. preservation + W1-rule suites, `diff -rq data docs/data`, `git diff --check`). No secrets in the net diff or the WIP commit (only `TRANSLATECHAN` identifier collisions); orchestrator branch `arena/01a08d90-translatechan` untouched by the coder (`db19997` → `b80ac28` are its own commits). Case-42 gap and case-82 gaiji are disclosed, not hidden. Status correctly left at `partial_or_failed_w1_collation`. |

## Prompt-Authoring Lessons (inherited + this session)

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
- **…and the restore can also leave the branch on a stale base.** The re-cloned `arena/*` HEAD was
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
