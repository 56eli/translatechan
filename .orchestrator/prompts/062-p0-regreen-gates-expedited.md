# Task 062 — EXPEDITED P0: Re-green `main` — re-pin the three gates to the 17-document corpus

## 0. FETCH AND VERIFY

You should already have this file at `/tmp/task.md`. If not, fetch it:

    git fetch --depth 1 origin +arena/01a0ca9d-translatechan:refs/remotes/origin/_orch
    git show refs/remotes/origin/_orch:.orchestrator/prompts/062-p0-regreen-gates-expedited.md > /tmp/task.md

Read it from `/tmp`. Rules:

- Do NOT use `origin/arena/01a0ca9d-translatechan` (single-branch clones do not create that ref).
- Do NOT use `FETCH_HEAD` (your next fetch of `main` overwrites it).
- Do NOT `git checkout` orchestrator paths into the worktree. Read with `git show` into `/tmp` only.
- Never commit this file. Never push to the orchestrator branch.
- If the file is empty, or its first line is not
  `# Task 062 — EXPEDITED P0: Re-green \`main\` — re-pin the three gates to the 17-document corpus`,
  HALT and report.

**SUPERSEDES:** `.orchestrator/prompts/061-p0-regreen-main-17-docs.md`. That prompt described the
same repair. Do not fetch or run it.

---

## 1. TASK TITLE AND SCOPE

Re-pin `scripts/test_source_review_rules.py`, `scripts/test_source_preservation.py` and
`scripts/smoke_test.mjs` to the 17-document corpus already on `main`, so the full quality gate passes
again. **Complete this in ONE pull request.**

`main` is RED. PR #113 added the 17th corpus document (`biyanlu_cases`) and repointed
`data/corpus_manifest.json` at a new authoritative register, but three checkers still carry pins
derived from the 16-document tree. **The data is correct; the pins are stale.** You are re-pointing
checks at values the manifest already declares authoritative — you are not weakening any assertion.

This is an **expedited** dispatch: `main` being red blocks every downstream lane. The diagnosis below
is complete and measured. Verify it rather than rediscovering it, and move.

### Mandatory branch note — read before anything else

There is an **open pull request from another branch proposing this same repair**. It is not yours and
it is out of bounds.

- Work **only** on the fresh branch named in §8.
- **Never** push to, check out, rebase onto, cherry-pick from, or otherwise touch the branch
  `fix/p0-regreen-main-17-docs`.
- **Never** comment on, close, merge, or reference any existing pull request.
- If you find your changes already present on `main` when you start, **HALT AND REPORT** — do not
  improvise a different task.

---

## 2. REQUIRED READING ORDER

1. `docs/PROJECT_STATE.md` — canonical project tracker (invariants, rulings, current state).
2. `GATE.md` — the six-gate contract and its execution rules.
3. `AGENTS.md` — repository contract, CSP rules, quality-gate checklist.
4. `scripts/test_source_review_rules.py` — `AUTH_REGISTER`, `CORRECTION_REPORT`, the
   `expected_complete` block, the waiver block, and `run_partition_and_report_regressions`.
5. `scripts/test_source_preservation.py` — the `DECLARED_NEW_CORPUS` map and the new-file check.
6. `scripts/smoke_test.mjs` — the `authoritativeEvidence` block, `expectedSourceReviewCounts`, the
   manifest-count assertions, and the `4ff` / `4hh` reader assertions.
7. `data/corpus_manifest.json` — the `source_review` block.
8. `sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json` — the current authoritative register
   (17 documents). Do not edit it; `sessions/` is append-only.

Line numbers rot — re-find every anchor with grep:

```bash
# confirm, do not copy
grep -n 'AUTH_REGISTER = \|CORRECTION_REPORT = ' scripts/test_source_review_rules.py
grep -n 'expected_complete = \|new_documents' scripts/test_source_review_rules.py
grep -n 'DECLARED_NEW_CORPUS = {' scripts/test_source_preservation.py
grep -n 'shared 16-item corpus manifest\|authoritativeEvidence\|expectedSourceReviewCounts' scripts/smoke_test.mjs
grep -n 'authoritative_register_path\|authoritative_flagged_total' data/corpus_manifest.json
```

---

## 3. PROJECT CONTEXT AND OWNER VISION

**Fake Chan Factory** (`56eli/translatechan`) is a zero-backend static GitHub Pages reader for
Classical Chinese Chan/Zen literature. Its moral core: the Chinese source text is real and verbatim
from pinned, digest-verified CBETA/Taishō witnesses; the English is mostly disclosed AI
"Robolation". The gates make that honesty mechanically checkable — the documentation itself is under
test.

**Owner Vision Context.** A red `main` disables every downstream promise: the botrunner export lane
treats `python3 scripts/validate_data.py` exit 0 as its precondition to publish anything, and the
gate is the project's only evidence that the corpus is what it claims. Re-greening `main` unblocks
the corpus and export lanes both.

**Orchestrator state you need (you cannot see the orchestrator branch).** PR #113 was merged
deliberately while red, to hand a fresh orchestrator a workable tree. No agent other than you is
working on this repository.

---

## 4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES

**Measured on `main` at `da7224981915ba2905721778bb710859b22814ec`.** Treat as true; verify cheaply,
do not re-derive from scratch:

- `python3 scripts/validate_data.py` **passes**: `corpus=17 | slots=209 | verified=2 | matrix=21 |
  locators=4192/4192`, W1 `collated=13 | partial/failed=2 | unavailable=2 | flagged=127`.
- The build is deterministic and the `/docs` mirror is clean. `app_data.js` is **8,143,477 bytes**,
  sha256 `937e5467fefe661773f4c0ad5397399963612794d5becf341865d0bee242071b`.
- Failing: `test_source_preservation.py` (2 problems), `test_source_review_rules.py` (**30**
  failures, 115 checks passing), `smoke_test.mjs` (`app_data.js is missing the shared 16-item corpus
  manifest`).
- `data/corpus_manifest.json` already declares
  `sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json` authoritative (17 documents);
  `test_source_review_rules.py` still pins the superseded 16-document
  `..._P2_TIER2_BATCH1.json`. **The manifest is right; the test pin is stale.**
- Derived status counts from the authoritative register via `scripts/source_review.py`:
  `{'collated_to_claimed_witness': 13, 'partial_or_failed_w1_collation': 2,
  'witness_unavailable': 2}` — matching metrics exactly. `biyanlu_cases` derives
  `collated_to_claimed_witness`, 400/400 content fields collated, 86 flagged **metadata** entries.
- `data/project_metrics.json` reports **12** complete documents, sorted: `biyanlu_cases,
  caoshan_benji, chuandenglu_full, congronglu, dahui_yulu_full, dongshan_yulu_full,
  huangbo_fayao_full, linji_yulu, mazu_guanglu_full, wumenguan, yunmen_guanglu_full,
  zhaozhou_yulu_full`.
- **Corpus-growth invariant (long-standing, not a new ruling):** `DECLARED_NEW_CORPUS` in
  `test_source_preservation.py` is the sole path by which a new corpus file is admitted, and four
  documents are already registered there. `BASE_COMMIT`
  (`f1207eaf461889d8819a9287904bdfaf354a3018`) is **permanent — never re-pin it.** PR #113 simply
  omitted the fifth registration. That omission is the bug.
- **Invariant — never edit a checker to make a gate pass.** This task is the narrow, explicitly
  authorized exception: re-pointing pins at data the manifest *already* declares authoritative, and
  re-deriving pinned lists from measured output. If fixing a pin would require removing a check,
  loosening a comparison, or accepting a value you cannot derive from measured output —
  **HALT AND REPORT.** That means the data is wrong, not the pin, and it is a different task.
- **`sessions/` is append-only.** Never edit or delete existing content there.
- **`docs/` data and bundle files are generated** by `scripts/build_data_bundle.py` — never
  hand-edit `docs/data/**`, `docs/app_data.js`, `docs/app.js`, `docs/app.css`, `docs/index.html`,
  `app_data.js`. Hand-written `docs/*.md` prose (including `docs/PROJECT_STATE.md`) is edited
  normally.
- **Never edit `.github/workflows/*`.** `OPERATIONS.md` is the sole register of owner-controlled CI
  changes.
- **`630` stays the historical register's designated flagged figure** (Ruling 2, 2026-09-12). The
  current 127 is a separate measurement.

**Scope boundaries — must NOT:** add/remove/re-key/edit any corpus document or Chinese source
character; change `data/corpus_manifest.json`; change `BASE_COMMIT` or any existing allowlist
pointer; touch `app.js`/`app.css`/`index.html` or the Pages UI; touch lineage, gongan, glossary,
translations or locator data; create a new collation register or run a new collation; refactor or
reformat anything outside the pins below.

---

## 5. CORE OBJECTIVE

Every gate in `GATE.md` passes on your branch, with the 17-document corpus unchanged.

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

### The complete pin inventory — all 16, each with its derivation

Every value below was measured on `main`. Re-derive each with the command in the last column and
confirm before writing it; if any derivation disagrees with the "New" column, **halt and report**.

| # | File | Pin | Old | New | Derive with |
|---|---|---|---|---|---|
| 1 | `test_source_preservation.py` | `DECLARED_NEW_CORPUS` | (no entry) | register `data/corpus/biyanlu_cases.json` | register: 400/400 content EXACT, 86 metadata flagged; `zh_chars` 103020 from the corpus file |
| 2 | `test_source_review_rules.py` | `AUTH_REGISTER` | `..._P2_TIER2_BATCH1.json` | `..._P1_BIYANLU.json` | `source_review.authoritative_register_path` in the manifest |
| 3 | `test_source_review_rules.py` | `CORRECTION_REPORT` | `..._P2_TIER2_BATCH1.md` | `..._P1_BIYANLU.md` | `source_review.correction_report_path` |
| 4 | `test_source_review_rules.py` | `expected_complete` | 11 keys | 12 keys (add `biyanlu_cases`, keep sorted) | `project_metrics.json → corpus.complete_documents` |
| 5 | `test_source_review_rules.py` | waiver `new_documents` | 9 keys, ingest order | same 9 keys, **sorted** | `generation_parameters.new_documents` of the authoritative register |
| 6 | `test_source_review_rules.py` | `authoritative_flagged_total` | 41 | 127 | `source_review.authoritative_flagged_total` |
| 7 | `test_source_review_rules.py` | partition forged aggregate | 4733 / 4235 | 4987 / 4285 | forged = one below honest; honest = 5134−151+5 = 4988 content, 4337−56+5 = 4286 metadata |
| 8 | `test_source_review_rules.py` | partition untouched-metrics | 4734 / 4236 | 5134 / 4337 | `project_metrics.json → corpus.source_review` (asserts the forgery wrote nothing) |
| 9 | `test_source_review_rules.py` | unrecorded-option replay test | borrowed premise | constructed premise | **see §6.1 — redesign, not a re-pin** |
| 10 | `smoke_test.mjs` | `collated_to_claimed_witness` | 12 | 13 | `validate_data.py` output |
| 11 | `smoke_test.mjs` | `authoritativeEvidence` (4 paths + 2 counts) | batch1 paths, 16 docs, 41 flagged | Biyanlu paths, 17 docs, 127 flagged | `source_review.*` in the manifest |
| 12 | `smoke_test.mjs` | manifest item count + message | 16 | 17 | `len(corpus_manifest.json → items)` |
| 13 | `smoke_test.mjs` | `manifest_integrity.corpus_files` + locator docs | 16 / 16 | 17 / 17 | `project_metrics.json` |
| 14 | `smoke_test.mjs` | `per_text` key count | 16 | 17 | `project_metrics.json → corpus.per_text` |
| 15 | `smoke_test.mjs` | `4ff` shelf group + complete marks | 11 | 12 | `project_metrics.json → corpus.completion_statuses` |
| 16 | `smoke_test.mjs` | `4hh` filter-restore count | 16 | 17 | it counts `data-corpus-key` entries in the restored shelf — a document count; confirm before editing |

Each re-pin gets a dated one-line comment saying what it was re-pinned from and why, matching the
existing comment style in each file.

### 6.1 — Pin 9 is a redesign, and the only behaviour change permitted

The check *"an option the register does not record is reported, not silently merged"* types
`--doc wumenguan` at the live register and relies on that register happening **not** to record
`--doc`. The 2026-09-22 P1 Biyanlu register records **every** replayable flag in
`collate_corpus.REPLAYABLE_FLAGS`, including `doc`. Under a plain re-pin this line would silently
start testing a *conflict* instead of an *unrecorded option* — green forever, asserting nothing.

Rebuild the premise instead of borrowing it: copy the register into a sandbox, strip the `doc` key
from `generation_parameters`, then type `--doc` at the stripped copy. Also assert that the live
register *does* record `doc`, so the setup cannot rot unnoticed. The assertion stays fail-closed and
unchanged in substance. Disclose this in the PR description.

This is the **only** permitted behaviour change. Everything else is a value re-pin.

### 6.2 — One evidence gap to close, append-only

`sessions/COLLATION_W1_2026-09-22_P1_BIYANLU.md` was committed without the `## 7. Committed digests`
section that every preceding W1 report carries, and that `test_source_review_rules.py` reads to
prove a mutated register is caught rather than replayed. Because `sessions/` is append-only,
**append** a clearly-marked dated addendum; never edit the sealed text above it. Digests to record
(verify with `sha256sum`):

```
sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json        bf7c5962d80c67cba586ba6c1eba87e1e89b829a9b8ed405e1f542b903bb8278
sessions/COLLATION_W1_2026-09-22_P1_BIYANLU_refs_manifest.txt 50180f029114b0e9a076fa79be7ba7088b1f0c9dcbf581f3b9a4440544293203
```

### 6.3 — Files

- **Modify:** `scripts/test_source_review_rules.py` (pins 2–9)
- **Modify:** `scripts/test_source_preservation.py` (pin 1 only — `BASE_COMMIT` and every existing
  allowlist pointer stay byte-identical)
- **Modify:** `scripts/smoke_test.mjs` (pins 10–16)
- **Modify:** `sessions/COLLATION_W1_2026-09-22_P1_BIYANLU.md` (append-only addendum, §6.2)
- **Create:** `sessions/P0_REGREEN_2026-09-22.md` — dated evidence record: the before state with
  quoted failure lines, the per-pin table with derivations, the redesign in §6.1, the after
  transcript of all seven §14 commands, and the determinism double-run. Follow the format of
  `sessions/P1_COMPLETE_MARKING_2026-09-22.md`.
- **Modify:** `docs/PROJECT_STATE.md` — milestone-grade, so the tracker ships with this PR:

  **(a)** In §2 *Architectural Invariants*, **extend the existing Source preservation bullet** (do
  not add a new one). Note also that its cited base `3cc7a8e9681e` is **stale** — the script's real
  `BASE_COMMIT` is `f1207eaf461889d8819a9287904bdfaf354a3018`; correct it. Append:

  ```markdown
 `BASE_COMMIT` is permanent and is never re-pinned — re-pinning it would reset the byte-preservation history that is the entire point of the test. Corpus growth is admitted by exactly one path: registering the new file in `DECLARED_NEW_CORPUS` with dated evidence prose naming its witness, its measured field counts, and its declared evidence files. An unregistered new corpus file is a gate failure by design.
  ```

  **(b)** In §3 *Settled Decisions & Rationale*, insert:

  ```markdown
- **Gate pins are part of a corpus PR's deliverables (from the PR #113 incident):** PR #113 merged red because it added the 17th document without re-pinning the three checkers that carry document counts and register paths — `test_source_review_rules.py` (`AUTH_REGISTER`, `CORRECTION_REPORT`, the complete-document list), `test_source_preservation.py` (`DECLARED_NEW_CORPUS`), `smoke_test.mjs` (the authoritative-evidence block and five count assertions). Any PR that changes the document count, the complete-document set, or the authoritative register must re-pin all three in the same PR. The corpus data and the pins that describe it ship together, or the gate is lying.
  ```

  **(c)** In §5 *Deferred / Technical Debt*, the line `Branch protection on main unconfirmed (403)`
  is **wrong** — replace it. Measured 2026-09-22: `gh api repos/56eli/translatechan/branches/main`
  reports `"protected": false`, `protection_url: null`,
  `required_status_checks.enforcement_level: "off"`, and `gh api .../rulesets` returns `[]`. The 403
  only ever affected the protection-*settings* endpoint, which sandbox tokens cannot read. Replace
  with:

  ```markdown
- Branch protection on `main`: **none** (measured 2026-09-22 — `branches/main` reports `protected: false`, `required_status_checks.enforcement_level: "off"`, and `rulesets` is `[]`). The long-standing "unconfirmed (403)" note was a tooling artefact: the 403 is on the protection-*settings* endpoint only. Consequence: nothing mechanically prevents merging a red PR — as PR #113 did. Enabling a required `Quality` check is an owner decision, pending.
  ```

  **(d)** In §4, correct the **Gates** line — it claims all gates passed at PR #113, which was
  untrue; that PR merged with a failing Quality run
  ([35774726598](https://github.com/56eli/translatechan/actions/runs/35774726598)). Record the real
  post-task state, including the rule suite moving **115 → 146** checks (31 tests had been aborting
  behind the stale register pin). Set **Immediate Next Task** to the Tier2 Guiyang/Fayan re-key lane
  (`guiyang_yulu` 0 of 6 source-content fields verbatim, `fayan_yulu` 1 of 11 — R-A re-key where an
  X-series carrier clears the ≥80% bar, else confirm R-B labelling, one document per PR per
  Ruling 3). Keep every other section intact.

Never list the orchestrator working state as a deliverable.

---

## 7. SUB-TASK BREAKDOWN AND CHECKPOINTS

This list IS your push schedule. Checkpoint after each — you do not decide when to push.

1. **Reproduce the red state.** Run all seven §14 commands on the fresh branch; save raw output as
   the "before" section of `sessions/P0_REGREEN_2026-09-22.md`. → commit + push
2. **Preservation (pin 1).** Re-run `test_source_preservation.py` — expect exit 0, 0 unauthorized
   changes, and a new `ℹ️` declared-new line for `biyanlu_cases.json`. → commit + push
3. **Rule suite, the register pin (pins 2–3).** Re-run. This is measured to drop failures from
   **30 to 7**. A materially different number means stop and re-read. → commit + push
4. **Rule suite, the remaining seven (pins 4–9).** Expected failure texts, verbatim:
   `the 11 complete documents (...)`, `per_text is_complete=true exactly for the 11 complete
   documents (...)`, `partition test finds the original register hash citation`,
   `partition: forged totals were not written`, `report test finds the labeled claim`,
   `the live overlay declares the documents it adds, cumulatively (...)`,
   `replay conflict: an option the register does not record is reported, not silently merged`.
   Note that the hash-citation one is fixed by §6.2, not by a pin. Expect **146 checks passing**
   when done. → commit + push
5. **Smoke test (pins 10–16).** Stale pins here surface in layers — fix, re-run, repeat until green;
   do not assume the first failure is the last. → commit + push
6. **Full gate battery.** All seven §14 commands plus the determinism double-run; append the
   transcript as the "after" section of the session record. → commit + push
7. **Tracker (a)–(d).** Then re-run `validate_data.py` — it enforces doc truthfulness, so a wrong
   figure in the tracker fails the gate. → commit + push
8. **Cleanup + PR.** §12 pass, confirm `git status` clean, open ONE pull request. → final push

---

## 8. BRANCH AND TARGET

- **Base branch:** `main` — never the orchestrator branch.
- **Target branch:** `fix/p0-regreen-gates-17-docs` ← **this exact name, a fresh branch.**
- **Orchestrator branch:** `arena/01a0ca9d-translatechan` — fetch source only. Never a base, never a
  target, never pushed to.
- **Dependencies:** none.
- **Resuming:** fresh branch from `main`.
- **Forbidden branch:** `fix/p0-regreen-main-17-docs` — never push to it, check it out, rebase onto
  it, or cherry-pick from it. It belongs to an out-of-bounds pull request.

Before your first checkpoint, align `HEAD` to a remote tip — being on a branch named
`fix/p0-regreen-gates-17-docs` is not evidence it is the remote branch of that name:

    git fetch --depth 50 origin +fix/p0-regreen-gates-17-docs:refs/remotes/origin/_resume
    git checkout -B fix/p0-regreen-gates-17-docs refs/remotes/origin/_resume

If that fetch cannot find the remote ref, the branch is new — create it from `main`:

    git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B fix/p0-regreen-gates-17-docs origin/main

Do not skip the fetch because you appear to already be on the branch. Do not commit on `main`.
`couldn't find remote ref` here is **not** an environment failure.

---

## 9. WORK PERSISTENCE AND PUSH CADENCE

Checkpoint after each sub-task in §7, before any long or risky operation, before any idle pause or
end of turn, and once at the end. **Your session can expire without warning; unpushed work is lost
work.** No time-based rule — §7 is the schedule.

A checkpoint is ONE command — first push, later pushes and the nothing-changed no-op are the same
form. No status/diff inspection around it:

```bash
git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin fix/p0-regreen-gates-17-docs
```

This repository uses Conventional Commits (`fix:`, `feat:`, `chore:`, `docs:`) — `git log` confirms.
Never a bare `wip:`.

- Open ONE pull request at the end, when quality checks pass. No draft PR first.
- Checkpoint commits may be broken — expected and correct.
- Never commit secrets. Never push to the orchestrator branch.
- **Sync rule:** rebase onto `origin/main` ONLY before your first push. After that:

      git fetch --depth 50 origin +main:refs/remotes/origin/main
      git merge --no-edit origin/main
      git push origin HEAD

- Never force-push unless explicitly instructed, and then only `--force-with-lease`.
- On merge conflict, or a sync refusing with `refusing to merge unrelated histories`: **halt and
  report the conflicting files.** Never pass `--allow-unrelated-histories`.
- Auth/network failure on push or fetch: report plainly, keep working locally, retry next
  checkpoint. Never claim work is pushed while a push failed; never modify credentials, remotes or
  git config. Known platform issue: sandbox GitHub credentials can expire mid-session (~hourly). On
  confirmed HTTP 401/403 "Bad credentials": commit locally first, then ask the operator via
  `ask_user` including the option verbatim "I reconnected GitHub — retry now", at most once per
  expiry event.
- Push rejected **non-fast-forward**: halt and report the raw rejection. That is a base mismatch, not
  an environment failure. Do not `git pull`. Do not force-push. Pushed checkpoints are safe.

---

## 10. TECHNICAL REQUIREMENTS

Python 3.11+ stdlib only — no new dependencies, no network access in any script. Node 22 for the
smoke test, dependency-free. Match existing style exactly: `test_source_preservation.py` uses long
parenthesised prose per `DECLARED_NEW_CORPUS` entry with a `Declared evidence:` tail;
`test_source_review_rules.py` uses dated `#` comments above pinned lists.

Every figure in a comment, declaration, session record or tracker edit must be **copied from a
command output**, never recalled. Paste the deriving command beside the claim in the PR description.

- **TEST_COMMAND:** `python3 scripts/test_source_review_rules.py` — the W1 rule suite: register pins,
  status-count derivation, complete-document list, `--write-metrics` mutation matrix. Expect exit 0
  and **146 checks passed**.
- **INTEGRATION_TEST_COMMAND:** `python3 scripts/validate_data.py && python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs`
  — crosses data → metrics → bundle → reader, exactly where the stale counts live.
- **FULL_SUITE_COMMAND:** the seven §14 commands in order — the repository's full gate set per
  `GATE.md`. There is no broader suite.
- **COVERAGE_COMMAND:** not configured — no coverage tooling in this repository. Do not invent a
  threshold.
- **MUTATION_TEST_COMMAND:** not warranted as a separate tool — `test_source_review_rules.py`
  already carries a hand-written mutation matrix (the `--write-metrics` forged-value tests)
  exercising exactly the logic re-pinned here. It must pass.
- **LINT_COMMAND:** `python3 -m py_compile scripts/*.py` — no configured linter; this is the
  documented equivalent.
- **BUILD_COMMAND:** `python3 scripts/build_data_bundle.py`

---

## 11. SAFETY AND COMPATIBILITY RULES

- **No Chinese source character may change.** Preservation must report `0 unauthorized changes`, and
  the only new output line should be the declared-new `ℹ️` notice for `biyanlu_cases.json`.
- **The generated bundle must not change.** `app_data.js` stays at 8,143,477 bytes, sha256
  `937e5467fefe661773f4c0ad5397399963612794d5becf341865d0bee242071b`. This task touches no data, so a
  changed hash means you changed something you should not have — **halt and report**.
- **Backward compatibility:** `window.TranslateChan`, `TRANSLATECHAN_DATA`, `translatechan_*` keys
  unchanged. No migration applies.
- No assertion may be deleted, relaxed, commented out or made conditional. Pins move to measured
  values; checks stay. The single permitted behaviour change is §6.1.

---

## 12. CLEANUP RULES

By the final push: no commented-out code, no debug prints, no temporary scripts, no TODO markers
introduced by this PR, no `__pycache__` committed. Do not modify unrelated files. Do not reformat
outside the pins in §6. Do not commit `/tmp/task.md` or anything else from `/tmp`. Intermediate
checkpoint commits are exempt — clean up once, before opening the PR.

---

## 13. STRICT BOUNDARIES / OUT OF SCOPE

Do NOT:

- push to the orchestrator branch `arena/01a0ca9d-translatechan`, ever;
- touch the branch `fix/p0-regreen-main-17-docs` in any way;
- comment on, close, merge or modify any existing pull request;
- change `BASE_COMMIT` or any existing allowlist pointer;
- edit existing content under `sessions/` (the §6.2 addendum is append-only; the §6 session record is
  a new file);
- edit `.github/workflows/*`;
- hand-edit generated files (`docs/data/**`, `docs/app_data.js`, `docs/app.js`, `docs/app.css`,
  `docs/index.html`, `app_data.js`);
- add, remove or re-key corpus documents, or run a new collation;
- touch the Pages UI, lineage, gongan, glossary, translations or locator data;
- re-designate the `630` historical register figure;
- weaken, delete or skip any check to make a gate pass — halt and report instead;
- open more than one pull request.

**Expected-absent:** `orchestrator/` — must NOT exist at delivery. If you find it, halt and report;
do not create, delete or work around it.

**Artifacts:** this task produces no build artifact. If one arises, do not commit it — write its path
and sha256 into the PR description and stop. Never create a git tag or a GitHub release.

---

## 14. QUALITY CHECKS

Run these seven in order; record exact output of each:

```bash
python3 -m py_compile scripts/*.py                        # exit 0
python3 scripts/validate_data.py                          # exit 0, reports corpus=17
python3 scripts/build_data_bundle.py                      # exit 0
python3 scripts/test_source_preservation.py               # exit 0, "0 unauthorized changes"
python3 scripts/test_source_review_rules.py               # exit 0, 146 checks passed
node scripts/smoke_test.mjs                               # exit 0
git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json   # exit 0
```

Determinism — build twice and compare:

```bash
python3 scripts/build_data_bundle.py && sha256sum app_data.js
python3 scripts/build_data_bundle.py && sha256sum app_data.js
# both must print 937e5467fefe661773f4c0ad5397399963612794d5becf341865d0bee242071b
```

An unchanged hash is mechanical proof no corpus data moved — state that in the PR. Confirm all work
is pushed and `git status` is clean before opening the PR.

---

## 15. PR DESCRIPTION REQUIREMENTS

A squash-merge collapses checkpoint history, so the description is the surviving narrative. Include:

- **Summary** — what was stale and why, not only what changed.
- **Design rationale** — why re-pinning is correct and is not "editing the checker to pass": the
  manifest already declared the 17-document register authoritative, no assertion was weakened, and
  the suite got *stricter* (115 → 146 checks).
- **Per-pin table:** file · pin · old · new · deriving command.
- **The §6.1 redesign**, disclosed explicitly as the one behaviour change.
- **Gate transcript:** the seven §14 commands with real output, plus the two determinism hashes.
- **Explicit statement** that no corpus byte, no `BASE_COMMIT`, and no bundle hash changed.
- **Breaking changes:** none expected — say so explicitly.
- Describe only this PR's own changes; never claim earlier merged work. Every file named in the
  description must appear in the changed-file list.
- Include `#### Session Irregularities` per §16.

---

## 16. HARDENING REPORT — Session Irregularities

Under the heading `#### Session Irregularities`, report only irregularities meeting **all three**
thresholds: (a) it interfered with following this prompt, **and** (b) it cost >~10 min, blocked
progress, or required a workaround, **and** (c) it reveals a hidden repo/session invariant or prompt
blind spot that would recur for the next worker.

If none: `None significant`.

If significant, one bullet each, 3–6 lines total:
`Category | Symptom (1 sentence) | Impact | Workaround | Hardening candidate`

Categories: Environment, Prompt, Repository, Tooling. Do not pad with trivial retries or expected
platform behaviour. This report does not affect the merge verdict unless it reveals a missing
deliverable.
