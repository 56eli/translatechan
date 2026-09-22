# Task 061 — P0: Re-green `main` — re-pin the three gates to the 17-document corpus

## 0. FETCH AND VERIFY

You should already have this file at `/tmp/task.md`. If not, fetch it:

    git fetch --depth 1 origin +arena/01a0ca9d-translatechan:refs/remotes/origin/_orch
    git show refs/remotes/origin/_orch:.orchestrator/prompts/061-p0-regreen-main-17-docs.md > /tmp/task.md

Read it from `/tmp`. Rules:

- Do NOT use `origin/arena/01a0ca9d-translatechan` (single-branch clones do not create that ref).
- Do NOT use `FETCH_HEAD` (your next fetch of `main` overwrites it).
- Do NOT `git checkout` orchestrator paths into the worktree. Read with `git show` into `/tmp` only.
- Never commit this file. Never push to the orchestrator branch.
- If the file is empty, or its first line is not
  `# Task 061 — P0: Re-green \`main\` — re-pin the three gates to the 17-document corpus`,
  HALT and report.

---

## 1. TASK TITLE AND SCOPE

Re-pin `scripts/test_source_review_rules.py`, `scripts/test_source_preservation.py` and
`scripts/smoke_test.mjs` to the 17-document corpus that is already on `main`, so the full
quality gate passes again. **Complete this in ONE pull request.**

`main` is currently RED. PR #113 added the 17th corpus document (`biyanlu_cases`) and updated
`data/corpus_manifest.json` to point at a new authoritative register, but three checkers still
carry pins derived from the 16-document tree. The data is correct; the pins are stale. This task
re-pins them — it does **not** weaken a single assertion.

---

## 2. REQUIRED READING ORDER

Read these before changing anything:

1. `docs/PROJECT_STATE.md` — canonical project tracker (invariants, rulings, current state).
2. `GATE.md` — the six-gate contract and its execution rules.
3. `AGENTS.md` — repository contract, CSP rules, quality-gate checklist.
4. `scripts/test_source_review_rules.py` — start at line 122 (`AUTH_REGISTER`), then the block
   at lines 776–805, then 955–995.
5. `scripts/test_source_preservation.py` — start at line 131 (`DECLARED_NEW_CORPUS`), then the
   block at lines 1347–1360 where new corpus files are checked.
6. `scripts/smoke_test.mjs` — lines 279–282, 328, 412–413, 419.
7. `data/corpus_manifest.json` — the `source_review` block, specifically
   `authoritative_register_path`.
8. `sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json` — the current authoritative register
   (17 documents). Do not edit it; `sessions/` is append-only.

Line numbers rot. Re-find each anchor with grep rather than trusting the number:

```bash
# confirm, do not copy
grep -n 'AUTH_REGISTER = ' scripts/test_source_review_rules.py
grep -n 'DECLARED_NEW_CORPUS = {' scripts/test_source_preservation.py
grep -n 'shared 16-item corpus manifest' scripts/smoke_test.mjs
grep -n 'authoritative_register_path' data/corpus_manifest.json
```

---

## 3. PROJECT CONTEXT AND OWNER VISION

**Fake Chan Factory** (`56eli/translatechan`) is a zero-backend static GitHub Pages reader for
Classical Chinese Chan/Zen literature. Its moral core: the Chinese source text is real and
verbatim from pinned, digest-verified CBETA/Taishō witnesses; the English is mostly disclosed AI
"Robolation". The gates exist to make that honesty mechanically checkable — the documentation
itself is under test.

**Owner Vision Context.** A red `main` disables every downstream promise the project makes: the
botrunner export lane (`docs/BOTRUNNER_REVIEW_2026-09-21_LAW.md`) treats
`python3 scripts/validate_data.py` exit 0 as its precondition to publish anything, and the gate
is the project's only evidence that the corpus is what it claims. Re-greening `main` is the
precondition for all corpus and export work that follows.

**Orchestrator state you need (you cannot see the orchestrator branch).** The owner merged PR #113
knowingly red, to leave the tree in a "good enough" state for a fresh orchestrator to pick up. This
is that pick-up task. No other agent is working on this repository right now. The next tasks after
this one are the Tier2 yulu re-key work and the botrunner export lane — both blocked on this PR.

---

## 4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES

Treat as true; do not re-derive:

- **The corpus data on `main` is correct.** `python3 scripts/validate_data.py` passes on `main`
  today (`corpus=17 | slots=209 | verified=2 | matrix=21 | locators=4192/4192`,
  `collated=13 | partial/failed=2 | unavailable=2 | flagged=127`). The build is deterministic and
  the `/docs` mirror is clean. Only the three checkers fail.
- **`data/corpus_manifest.json` already declares the correct authoritative register:**
  `sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json` (17 documents).
  `scripts/test_source_review_rules.py` line 122 still pins the superseded
  `sessions/COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1.json` (16 documents). The manifest is
  right; the test pin is stale.
- **Measured, from the authoritative register via `scripts/source_review.py`:** derived status
  counts are `{'collated_to_claimed_witness': 13, 'partial_or_failed_w1_collation': 2,
  'witness_unavailable': 2}` — matching the metrics exactly. `biyanlu_cases` derives
  `collated_to_claimed_witness` with 400/400 content fields collated and 86 flagged *metadata*
  entries.
- **`data/project_metrics.json` reports 12 complete documents**, sorted:
  `biyanlu_cases, caoshan_benji, chuandenglu_full, congronglu, dahui_yulu_full, dongshan_yulu_full,
  huangbo_fayao_full, linji_yulu, mazu_guanglu_full, wumenguan, yunmen_guanglu_full,
  zhaozhou_yulu_full`. The rule suite still pins the 11-document pre-Biyanlu list.
- **Owner ruling, 2026-09-22 (this task's authority):** the preservation test's growth policy is
  the **declared-new-file mechanism**, not a base re-pin. `DECLARED_NEW_CORPUS` in
  `scripts/test_source_preservation.py` already implements exactly this. `BASE_COMMIT`
  (`f1207eaf461889d8819a9287904bdfaf354a3018`) **stays as it is**. `biyanlu_cases.json` was simply
  never registered in `DECLARED_NEW_CORPUS` by PR #113 — that omission is the bug.
- **Invariant — never edit a checker to make a gate pass.** This task is the narrow, explicitly
  authorized exception: you are re-pointing pins at data the manifest *already* declares
  authoritative, and re-deriving pinned lists from measured output. You are **not** relaxing,
  deleting, or weakening any assertion. If fixing a pin would require removing a check, loosening a
  comparison, or accepting a value you cannot derive from measured output — **HALT AND REPORT**.
  That would mean the data is wrong, not the pin, and it is a different task.
- **Sessions are append-only.** Never edit or delete anything in `sessions/`. If this task needed a
  new register it would be out of scope — it does not; the 17-document register already exists.
- **`docs/` is generated.** Never hand-edit any file under `docs/data/`, `docs/app_data.js`,
  `docs/app.js`, `docs/app.css`, `docs/index.html`. They are produced by
  `scripts/build_data_bundle.py`. (`docs/PROJECT_STATE.md` and other hand-written `docs/*.md` prose
  files are *not* build artifacts and are edited normally.)
- **Never edit `.github/workflows/*`.** Owner approval required; `OPERATIONS.md` is the sole
  register of pending CI changes.
- **`630` stays the historical register's designated flagged figure** (Ruling 2, 2026-09-12). Do
  not re-designate it. The current measurement is 127 flagged and is a separate claim.

**Scope boundaries — this task must NOT:**

- add, remove, re-key, or edit any corpus document or any Chinese source character;
- change `data/corpus_manifest.json` contents (it is already correct);
- change `BASE_COMMIT` in `scripts/test_source_preservation.py`;
- touch `app.js`, `app.css`, `index.html`, or anything in the Pages UI;
- touch lineage, gongan, glossary, translations, or locator data;
- create a new collation register or run a new collation;
- refactor, reformat, or tidy anything outside the pins named below.

---

## 5. CORE OBJECTIVE

After this PR, every gate in `GATE.md` passes on the branch, with the 17-document corpus unchanged.

**Done criteria — all seven, each verified by its exact command in §14:**

1. `python3 -m py_compile scripts/*.py` → exit 0
2. `python3 scripts/validate_data.py` → exit 0, reports `corpus=17`
3. `python3 scripts/build_data_bundle.py` → exit 0, deterministic across two runs
4. `python3 scripts/test_source_preservation.py` → exit 0, **0 unauthorized changes**
5. `python3 scripts/test_source_review_rules.py` → exit 0, **0 failures**
6. `node scripts/smoke_test.mjs` → exit 0
7. `git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json` → exit 0

---

## 6. EXACT DELIVERABLES

- **Modify:** `scripts/test_source_review_rules.py` — re-pin `AUTH_REGISTER` to the register the
  manifest declares authoritative; re-pin the complete-document list from 11 to the measured 12;
  fix the remaining pins enumerated in §7.3. Keep or extend the explanatory comments; each re-pin
  gets a dated one-line comment saying what it was re-pinned from and why.
- **Modify:** `scripts/test_source_preservation.py` — add a `data/corpus/biyanlu_cases.json` entry
  to `DECLARED_NEW_CORPUS`, in the established prose style of the neighbouring entries, citing the
  PR #113 measurements and its declared evidence files. **Nothing else in this file changes** — in
  particular `BASE_COMMIT` and every allowlist pointer stay byte-identical.
- **Modify:** `scripts/smoke_test.mjs` — re-pin the four 16→17 document-count assertions
  (manifest item count and its message, `authoritative_documents`, `manifest_integrity.corpus_files`
  and canonical-locator document count, and the `per_text` key count). Leave the unrelated `16` at
  line ~1095 (a filter-restore count) alone unless a run proves it is also a document count — check
  before touching it.
- **Create:** `sessions/P0_REGREEN_2026-09-22.md` — dated evidence record: the failing state before
  (quote the actual failure lines), each pin changed with its old and new value, the reason each was
  stale, and the full transcript of the seven §14 commands passing after. Follow the format of
  `sessions/P1_COMPLETE_MARKING_2026-09-22.md`.
- **Modify:** `docs/PROJECT_STATE.md` — this is a milestone-grade change (it restores the gate
  contract), so the tracker update ships with this PR. Insert into §3 *Settled Decisions &
  Rationale*, preserving surrounding content:

  ```markdown
- **Corpus-growth policy settled (owner ruling 2026-09-22, task 061):** `scripts/test_source_preservation.py` keeps `BASE_COMMIT` `f1207eaf461889d8819a9287904bdfaf354a3018` permanently; corpus growth is admitted **only** by registering the new file in `DECLARED_NEW_CORPUS` with its dated evidence prose. A base re-pin was considered and rejected — it would reset the byte-preservation history that is the point of the test. An unregistered new corpus file is a gate failure by design, not an inconvenience.
- **Gate pins are part of a corpus PR's deliverables (task 061):** PR #113 merged red because it added the 17th document without re-pinning the three checkers that carry document counts and register paths — `test_source_review_rules.py` (`AUTH_REGISTER`, complete-document list), `test_source_preservation.py` (`DECLARED_NEW_CORPUS`), `smoke_test.mjs` (four count assertions). Any PR that changes the document count, the complete-document set, or the authoritative register re-pins all three in the same PR.
  ```

  Also update §4 *Active Milestone & Current State* so the recorded gate line matches reality
  (it currently claims all gates PASS, which was untrue at merge), and set the **Immediate Next
  Task** to the Tier2 yulu re-key lane. Keep every other section intact.

Never list the orchestrator working state as a deliverable; it is not yours to edit.

---

## 7. SUB-TASK BREAKDOWN AND CHECKPOINTS

This list IS your push schedule. Checkpoint after each one — you do not decide when to push.

1. **Reproduce the red state.** Run all seven §14 commands on the fresh branch and save the raw
   output into `sessions/P0_REGREEN_2026-09-22.md` as the "before" section. → commit + push
2. **Preservation:** add the `biyanlu_cases.json` entry to `DECLARED_NEW_CORPUS`. Re-run
   `python3 scripts/test_source_preservation.py` — expect exit 0, 0 unauthorized changes. → commit + push
3. **Rule suite, part 1 — the register pin.** Re-pin `AUTH_REGISTER` to
   `sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json`. Re-run the suite. This is measured to
   drop the failure count from **30 to 7**. If you get a materially different number, stop and
   re-read before continuing. → commit + push
4. **Rule suite, part 2 — the remaining 7.** They are, verbatim from the measured run:
   - `the 11 complete documents (wumenguan + the ten marked 2026-09-22) are reported, sorted, and nothing else`
   - `per_text is_complete=true exactly for the 11 complete documents under the shared rule`
   - `partition test finds the original register hash citation`
   - `partition: forged totals were not written`
   - `report test finds the labeled claim`
   - `the live overlay declares the documents it adds, cumulatively (new_documents=[...])`
   - `replay conflict: an option the register does not record is reported, not silently merged`

   The first two are the 11→12 complete-document re-pin (add `biyanlu_cases`, keep the list sorted).
   The others cite strings, hashes or parameters carried by the superseded register. For each:
   identify the exact stale citation, re-derive the correct value **from measured output**, and
   re-pin it. Quote the deriving command in your PR description for each one. If any of them is not
   a stale citation but a genuine data disagreement — **halt and report it**; do not make it pass.
   → commit + push
5. **Smoke test:** re-pin the four 16→17 assertions. Re-run `node scripts/smoke_test.mjs`. → commit + push
6. **Full gate battery:** run all seven §14 commands in order, capture the transcript, append it to
   `sessions/P0_REGREEN_2026-09-22.md` as the "after" section. → commit + push
7. **Tracker:** apply the `docs/PROJECT_STATE.md` edits from §6. Re-run `validate_data.py` — it
   enforces doc truthfulness, so a wrong figure in the tracker fails the gate. → commit + push
8. **Cleanup + PR:** §12 cleanup pass, confirm `git status` clean, open ONE pull request. → final push

---

## 8. BRANCH AND TARGET

- **Base branch:** `main` — never the orchestrator branch.
- **Target branch:** `fix/p0-regreen-main-17-docs`
- **Orchestrator branch:** `arena/01a0ca9d-translatechan` — fetch source only. Never a base, never
  a target, never pushed to.
- **Dependencies:** none. No other agent is active on this repository.
- **Resuming:** fresh branch from `main`.

Before your first checkpoint, align `HEAD` to a remote tip — being on a branch named
`fix/p0-regreen-main-17-docs` is not evidence that it is the remote branch of that name:

    git fetch --depth 50 origin +fix/p0-regreen-main-17-docs:refs/remotes/origin/_resume
    git checkout -B fix/p0-regreen-main-17-docs refs/remotes/origin/_resume

If that fetch cannot find the remote ref, the branch is new — create it from `main`:

    git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B fix/p0-regreen-main-17-docs origin/main

Do not skip the fetch because you appear to already be on the branch. Do not commit on `main`.
`couldn't find remote ref` here is **not** an environment failure.

---

## 9. WORK PERSISTENCE AND PUSH CADENCE

Checkpoint after each sub-task in §7, before any long or risky operation, before any idle pause or
end of turn, and once at the end. **Your session can expire without warning; unpushed work is lost
work.** There is no time-based rule — §7 is your push schedule.

A checkpoint is ONE command. First push, later pushes, and the nothing-changed no-op are all the
same form. Do not run `git status` / `git diff` inspections around it:

```bash
git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin fix/p0-regreen-main-17-docs
```

This repository uses Conventional Commits (`fix:`, `feat:`, `chore:`, `docs:`) — `git log` confirms.
`chore: wip <sub-task>` is a valid subject; never a bare `wip:`.

- Open ONE pull request at the end, when the quality checks pass. Do not open a draft PR first.
- Checkpoint commits may be broken — that is expected and correct.
- Never commit secrets. Never push to the orchestrator branch.
- **Sync rule:** rebase onto `origin/main` ONLY before your first push. After the first push:

      git fetch --depth 50 origin +main:refs/remotes/origin/main
      git merge --no-edit origin/main
      git push origin HEAD

- Never force-push unless explicitly instructed, and then only with `--force-with-lease`.
- On merge conflict, or a sync refusing with `refusing to merge unrelated histories`: **halt and
  report the conflicting files.** Never pass `--allow-unrelated-histories`.
- If a push or fetch fails with an authentication or network error: report it plainly, keep working
  locally, retry at the next checkpoint. Never claim work is pushed while a push has failed. Never
  modify credentials, remotes, or git config to work around it. Known platform issue: sandbox
  GitHub credentials can expire mid-session (roughly hourly). On a confirmed HTTP 401/403
  "Bad credentials": commit locally first, then ask the operator via `ask_user` with the option
  "I reconnected GitHub — retry now", at most once per expiry event.
- If a push is rejected **non-fast-forward**: halt and report the raw rejection. That is a base
  mismatch, not an environment failure. Do not `git pull`. Do not force-push. Already-pushed
  checkpoints are safe.

---

## 10. TECHNICAL REQUIREMENTS

Python 3.11+ stdlib only — no new dependencies, no network access in any script. Node 22 for the
smoke test, dependency-free. Follow the existing style exactly: `scripts/test_source_preservation.py`
uses long parenthesised prose strings for each `DECLARED_NEW_CORPUS` entry — match that voice,
including the "Declared evidence:" citation tail. `scripts/test_source_review_rules.py` uses dated
`#` comments above pinned lists explaining why the pin exists — match that too.

Every figure you write into a comment, a declaration string, the session record or the tracker must
be **copied from a command output**, never recalled. Paste the deriving command beside the claim in
your PR description.

- **TEST_COMMAND:** `python3 scripts/test_source_review_rules.py` — covers the W1 source-review rule
  suite including the register pins, status-count derivation, complete-document list, and the
  `--write-metrics` mutation matrix. Expect exit 0 and `0 failure(s)`.
- **INTEGRATION_TEST_COMMAND:** `python3 scripts/validate_data.py && python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs`
  — crosses the data → metrics → bundle → reader boundary, which is exactly where the stale counts
  live. Expect exit 0 from each.
- **FULL_SUITE_COMMAND:** the seven commands in §14, in that order. This is the repository's full
  gate set per `GATE.md`; there is no separate broader suite.
- **COVERAGE_COMMAND:** not configured — this repository has no coverage tooling. Do not invent a
  threshold.
- **MUTATION_TEST_COMMAND:** not warranted as a separate tool — `test_source_review_rules.py`
  already contains a hand-written mutation matrix (the `--write-metrics` forged-value tests) that
  exercises exactly the logic this task re-pins. It must pass.
- **LINT_COMMAND:** `python3 -m py_compile scripts/*.py` — this repository has no configured linter;
  syntax compilation is the documented equivalent.
- **BUILD_COMMAND:** `python3 scripts/build_data_bundle.py`

---

## 11. SAFETY AND COMPATIBILITY RULES

- **No Chinese source character may change.** `test_source_preservation.py` enforces this — it must
  report `0 unauthorized changes`, and the only new line in its output should be the declared-new
  `ℹ️` notice for `biyanlu_cases.json`.
- **The generated bundle must not change.** `app_data.js` stays at 8,143,477 bytes with SHA-256
  `937e5467fefe661773f4c0ad5397399963612794d5becf341865d0bee242071b`. This task touches no data, so
  a changed bundle hash means you changed something you should not have — halt and report.
- **Backward compatibility:** `window.TranslateChan`, `TRANSLATECHAN_DATA`, and `translatechan_*`
  localStorage keys are unchanged. No migration applies.
- No assertion in any checker may be deleted, relaxed, commented out, or made conditional. Pins move
  to measured values; checks stay.

---

## 12. CLEANUP RULES

By the final push: no commented-out code, no debug prints, no temporary scripts, no TODO markers
introduced by this PR. Do not modify unrelated files. Do not reformat code outside the pins named in
§6. Do not commit `/tmp/task.md` or anything else written to `/tmp`. Intermediate checkpoint commits
are exempt — clean up once, before opening the PR.

---

## 13. STRICT BOUNDARIES / OUT OF SCOPE

Do NOT:

- push to the orchestrator branch `arena/01a0ca9d-translatechan`, ever;
- change `BASE_COMMIT`, or any existing allowlist pointer, in `scripts/test_source_preservation.py`;
- edit anything under `sessions/` other than creating the one new dated file in §6;
- edit `.github/workflows/*`;
- hand-edit generated files (`docs/data/**`, `docs/app_data.js`, `docs/app.js`, `docs/app.css`,
  `docs/index.html`, `app_data.js`);
- add, remove or re-key corpus documents, or run a new collation;
- touch the Pages UI, lineage, gongan, glossary, translations or locator data;
- re-designate the `630` historical register figure;
- weaken, delete or skip any check to make a gate pass — halt and report instead;
- open more than one pull request.

**Expected-absent:** `orchestrator/` — this directory must NOT exist at delivery. If you find it,
halt and report; do not create, delete or work around it. (It is a separate task.)

**Artifacts:** this task produces no build artifact. If one somehow arises, do not commit it
anywhere — write its path and sha256 into the PR description and stop. Never create a git tag or a
GitHub release.

---

## 14. QUALITY CHECKS

Run these seven, in order, and record the exact output of each:

```bash
python3 -m py_compile scripts/*.py                        # exit 0
python3 scripts/validate_data.py                          # exit 0, reports corpus=17
python3 scripts/build_data_bundle.py                      # exit 0
python3 scripts/test_source_preservation.py               # exit 0, "0 unauthorized changes"
python3 scripts/test_source_review_rules.py               # exit 0, "0 failure(s)" / all checks passed
node scripts/smoke_test.mjs                               # exit 0
git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json   # exit 0
```

Additionally confirm determinism — run the build twice and compare:

```bash
python3 scripts/build_data_bundle.py && sha256sum app_data.js
python3 scripts/build_data_bundle.py && sha256sum app_data.js
# both must print 937e5467fefe661773f4c0ad5397399963612794d5becf341865d0bee242071b
```

Confirm all work is pushed and `git status` is clean before opening the PR.

---

## 15. PR DESCRIPTION REQUIREMENTS

A squash-merge collapses your checkpoint history, so the description is the surviving narrative.
Include:

- **Summary** — what was stale and why, not only what changed.
- **Design rationale** — why re-pinning is correct here and is not "editing the checker to pass":
  state explicitly that the manifest already declared the 17-document register authoritative and
  that no assertion was weakened.
- **Per-pin table:** file · what was pinned · old value · new value · the command that derived the
  new value.
- **Gate transcript:** the seven §14 commands with their real output, plus the two determinism hashes.
- **Explicit statement** that no corpus byte, no `BASE_COMMIT`, and no bundle hash changed.
- **Breaking changes:** none expected — say so explicitly, or describe them.
- Describe only this PR's own changes. Never list work from earlier merged PRs as your own. Every
  file named in the description must appear in the changed-file list.
- Include `#### Session Irregularities` per §16.

---

## 16. HARDENING REPORT — Session Irregularities

In the PR description, under the heading `#### Session Irregularities`, report only irregularities
that meet **all three** thresholds: (a) it interfered with following this prompt, **and** (b) it cost
more than ~10 minutes, blocked progress, or required a workaround, **and** (c) it reveals a hidden
repo/session invariant or prompt blind spot that would recur for the next worker.

If none: write `None significant`. That satisfies this section.

If significant, one bullet each, 3–6 lines total:
`Category | Symptom (1 sentence) | Impact | Workaround | Hardening candidate`

Categories: Environment (session drop, auth loss, network, rate limit), Prompt (wrong path, missing
context, ambiguous scope, stale `main`), Repository (flaky test, missing dep, branch protection,
undocumented prerequisite, hidden config), Tooling (command mismatch, runner not found).

Do not pad with trivial retries or expected platform behavior. This report does not affect the
merge verdict unless it reveals a missing deliverable.
