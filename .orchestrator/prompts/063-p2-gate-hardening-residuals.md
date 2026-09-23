# Task 063 — P2: Gate hardening — de-fragilize the pin-9 fixture and correct two tracker facts

## 0. FETCH AND VERIFY

You should already have this file at `/tmp/task.md`. If not, fetch it:

    git fetch --depth 1 origin +arena/01a0ca9d-translatechan:refs/remotes/origin/_orch
    git show refs/remotes/origin/_orch:.orchestrator/prompts/063-p2-gate-hardening-residuals.md > /tmp/task.md

Read it from `/tmp`. Rules:

- Do NOT use `origin/arena/01a0ca9d-translatechan` (single-branch clones do not create that ref).
- Do NOT use `FETCH_HEAD` (your next fetch of `main` overwrites it).
- Do NOT `git checkout` orchestrator paths into the worktree. Read with `git show` into `/tmp` only.
- Never commit this file. Never push to the orchestrator branch.
- If the file is empty, or its first line is not
  `# Task 063 — P2: Gate hardening — de-fragilize the pin-9 fixture and correct two tracker facts`,
  HALT and report.

---

## 1. TASK TITLE AND SCOPE

Replace one fragile test fixture in `scripts/test_source_review_rules.py` with a constructed one, and
correct two factually wrong lines in `docs/PROJECT_STATE.md`. **Complete this in ONE pull request.**

`main` is **GREEN** and must stay green. This is *not* a repair task — nothing is failing today. You
are removing a latent trap that will silently disable a test later, and fixing two statements that
are measurably false. Expected end state: **7/7 gates, 146 checks** (up from 145), **bundle hash
unchanged**.

### Premise measured at `21f0ba7ef2af8ffeb3f1a2384307359b898c81d2`

That was `main`'s tip when this prompt was written (`Merge pull request #114`). Before doing any work:

```bash
git fetch --depth 50 origin +main:refs/remotes/origin/main
git merge-base --is-ancestor 21f0ba7ef2af8ffeb3f1a2384307359b898c81d2 origin/main \
  && echo "premise intact" || echo "PREMISE MOVED — re-verify before working"
```

If `main` has moved, re-verify every §4 fact before changing anything. **If the changes described in
§6 are already present on `main`, HALT AND REPORT** — do not improvise a different task.

### Mandatory branch note — read before anything else

There is an **open pull request, #115, on branch `fix/p0-regreen-main-17-docs`, that touches every
file this task touches.** It is out of bounds and is not a base for your work.

- Work **only** on the fresh branch named in §8.
- **Never** push to, check out, rebase onto, cherry-pick from, or otherwise touch
  `fix/p0-regreen-main-17-docs`.
- **Never** comment on, close, merge, or reference any existing pull request.
- Branch from `origin/main` only.

---

## 2. REQUIRED READING ORDER

1. `docs/PROJECT_STATE.md` — canonical project tracker (invariants, rulings, current state).
2. `GATE.md` — the six-gate contract and its execution rules.
3. `AGENTS.md` — repository contract and quality-gate checklist.
4. `scripts/test_source_review_rules.py` — read `AUTH_REGISTER` (line ~123), the `Sandbox` class
   (line ~54), and the whole replay-conflict block (lines ~425–470) including the pin-9 fixture at
   line ~460.
5. `scripts/collate_corpus.py` — lines ~662–690, the `--reproduce` conflict/unrecorded logic. This is
   the behaviour under test; read it before you change the test.

Orienting commands:

```bash
grep -n 'AUTH_REGISTER' scripts/test_source_review_rules.py
sed -n '450,470p' scripts/test_source_review_rules.py
sed -n '662,690p' scripts/collate_corpus.py
```

---

## 3. PROJECT CONTEXT AND OWNER VISION

This repository's gates are its only evidence that the corpus is what it claims to be. The project's
standing law is **never edit a checker to make a gate pass** — a test that stops discriminating is
worse than a test that fails, because it reports success while asserting nothing.

Task 061/#114 re-pinned three gates to the 17-document corpus and got `main` green. In doing so it
made one test pass by *borrowing a different premise* rather than constructing one. That is the
subject of this task. The gate is green and honest today; the fixture underneath it is not stable.

This is **P2**: nothing is blocked. Correctness and clarity matter more than speed. Do not rush.

---

## 4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES

Every fact below was measured on `21f0ba7` by the orchestrator. Verify, do not rediscover.

**Facts:**

- `AUTH_REGISTER = "sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json"` (line ~123) — the live
  authoritative register, 17 documents.
- The live register **does** record `doc`: `generation_parameters.doc` is a 17-element list.
- `sessions/COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1.json` is a **superseded** register that
  happens **not** to record `doc`.
- Line ~460 pins that superseded file as `unrecorded_register` purely for that incidental property.
- `scripts/collate_corpus.py` decides "unrecorded" by testing whether a replayable flag appears in
  the register's `generation_parameters` block; if absent it prints
  `warning: --reproduce does not replay --doc: ...` to **stderr** and exits **0**.
- The current suite reports **145 checks**. Adding the live-register assertion in §6.1 makes it
  **146**.
- Bundle hash on `main` is
  `b68eb436ac8c847a0f92ec0dea8d0f74597aa8ee79778b5e5dfe8920bb9cdba7` (8,143,493 B). This task must
  **not** change it.

**Invariants — do not violate:**

- **Never edit a checker to make a gate pass.** You are making a test *stricter*, never weaker. If
  any change would reduce what is asserted, stop and report.
- `sessions/` is **append-only**. Never edit, never delete, never rewrite any file there — including
  the superseded BATCH1 register. Strip keys only on a **temporary copy outside the repository**.
- `docs/` data and bundle files (`docs/app_data.js`, `docs/index.html`, `docs/app.css`,
  `docs/app.js`, `docs/data/*`) are **generated** by `scripts/build_data_bundle.py` — never
  hand-edited. `docs/PROJECT_STATE.md` is hand-written prose and **is** in scope.
- Never edit `.github/workflows/*` — owner approval required.
- Do not change `BASE_COMMIT`, `DECLARED_NEW_CORPUS`, `AUTH_REGISTER`, or any corpus byte.

---

## 5. CORE OBJECTIVE

A test must construct the condition it tests. The pin-9 fixture currently *finds* a file that happens
to exhibit the condition. Those differ: the first keeps testing forever, the second stops testing the
moment the found file changes — silently, while still reporting green.

Make the unrecorded-option test build its own fixture from the live register, and assert the property
it was implicitly relying on. Then correct two tracker statements that are measurably false.

---

## 6. EXACT DELIVERABLES

### 6.1 Rebuild the pin-9 fixture — `scripts/test_source_review_rules.py` (~line 455–466)

Replace the superseded-register fixture with a sandboxed copy of the **live** register with the `doc`
key stripped.

**Required behaviour:**

1. **New assertion first** — the live register records `doc`. This is the premise the test depends
   on; if it ever stops being true the stripped-copy fixture would be testing nothing, and it must
   fail loudly rather than pass vacuously. This is the 146th check.
2. Load `AUTH_REGISTER`, `pop` `doc` from its `generation_parameters` block, and write the result to
   a **temporary path outside the repository** (`tempfile`). The module already imports `json`,
   `tempfile`, `subprocess` and `sys`.
3. Run the harness with `--reproduce <stripped copy> --doc wumenguan --print-refs` and keep the
   existing assertion: exit 0 **and** `does not replay --doc` in stderr.
4. Clean up the temporary file/directory.
5. Delete the `# 2026-09-22 (task 061): re-pin this fixture from AUTH_REGISTER` comment — it
   documents the removed approach. Replace it with a comment explaining *why* the fixture is
   constructed rather than borrowed.
6. **No reference to `COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1.json` may remain** in the file.

This approach is verified working. The orchestrator ran exactly this against `21f0ba7`:

```
live register records doc?  True
rc: 0
warns as required?  True
stderr: warning: --reproduce does not replay --doc: /tmp/.../stripped.json records no value for
        --doc, so the replayed run is no longer identical to the register it names
```

Check-name strings must read as assertions about behaviour, matching the file's existing style. Keep
`replay conflict: ...` phrasing for the existing check.

### 6.2 Tracker fact (a) — `docs/PROJECT_STATE.md` line 26

Currently cites stale base `3cc7a8e9681e`. Line 36 of the same file correctly states `BASE_COMMIT`
`f1207eaf461889d8819a9287904bdfaf354a3018`, so the tracker contradicts itself. Correct line 26 to the
real base commit. Change nothing else on that line — the "218 permitted changes, 0 unauthorized"
figures stay unless your own run of the preservation gate disagrees, in which case report it.

### 6.3 Tracker fact (b) — `docs/PROJECT_STATE.md` line 80

Currently reads `- Branch protection on main unconfirmed (403)`. Measured false. Replace with the
measured finding:

- `main` has **no** branch protection and **no** rulesets: `protected: false`,
  `enforcement_level: "off"`, `rulesets: []`.
- The 403 was from `GET /repos/{o}/{r}/branches/main/protection` — the protection-*settings*
  endpoint, which this token cannot read. It never meant protection existed.
- Reproduce with `gh api repos/56eli/translatechan/branches/main --jq .protected` and
  `gh api repos/56eli/translatechan/rulesets --jq 'length'`.
- **Consequence, state it plainly:** nothing mechanically prevents merging a red PR into `main`.
  PR #113 was merged red. Enabling a required status check is an open owner decision — record it as
  such, do not present it as done or recommend it as resolved.

Match the file's existing bullet style. Do not restructure the section.

### 6.4 Record only — no code change

Pin 7's forged aggregates ship as `5133/4336` (measured−1) rather than the analysed `4987/4285`.
Identical fail-closed effect, different derivation. **Change nothing.** Note it in the PR description
as a known cosmetic deviation so the next reader does not re-litigate it.

---

## 7. SUB-TASK BREAKDOWN AND CHECKPOINTS

1. Read §2. Run the §1 premise check. Confirm the §4 facts. → checkpoint
2. Implement 6.1. Run `python3 scripts/test_source_review_rules.py` — expect **146 checks**. → checkpoint
3. **Prove the new fixture still discriminates** (see §14 mutation proof). → checkpoint
4. Implement 6.2 and 6.3. → checkpoint
5. Full §14 gate run including determinism. → checkpoint
6. Open ONE PR per §15.

---

## 8. BRANCH AND TARGET

- **Base branch:** `main` — never the orchestrator branch.
- **Target branch:** `fix/gate-hardening-pin9-tracker` ← **this exact name, a fresh branch.**
- **Orchestrator branch:** `arena/01a0ca9d-translatechan` — fetch source only. Never a base, never a
  target, never pushed to.
- **Dependencies:** none.
- **Resuming:** fresh branch from `main`.
- **Forbidden branch:** `fix/p0-regreen-main-17-docs` — never push to it, check it out, rebase onto
  it, or cherry-pick from it. It belongs to out-of-bounds PR #115.

Before your first checkpoint, align `HEAD` to a remote tip — being on a branch named
`fix/gate-hardening-pin9-tracker` is not evidence it is the remote branch of that name:

    git fetch --depth 50 origin +fix/gate-hardening-pin9-tracker:refs/remotes/origin/_resume
    git checkout -B fix/gate-hardening-pin9-tracker refs/remotes/origin/_resume

If that fetch cannot find the remote ref, the branch is new — create it from `main`:

    git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B fix/gate-hardening-pin9-tracker origin/main

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
git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin fix/gate-hardening-pin9-tracker
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

- Python 3, standard library only. No new dependencies.
- Match the surrounding code style: `check(<condition>, "<assertion phrased as behaviour>")`.
- Temporary files via `tempfile`, always outside the repository tree, always cleaned up.
- The test suite must remain runnable offline and must not require a refs checkout — the
  `--print-refs` path is chosen precisely because it short-circuits before `--refs-dir` is needed.
- Keep runtime comparable; do not add a full `Sandbox` copy if a single temp file suffices.

---

## 11. SAFETY AND COMPATIBILITY RULES

- No corpus byte changes. No `data/` changes. No bundle regeneration beyond the §14 determinism runs.
- Do not weaken, delete, or skip any existing check. Net check count must **increase** by exactly 1.
- Do not touch any file in `sessions/`.
- Do not change `AUTH_REGISTER`, `BASE_COMMIT`, or `DECLARED_NEW_CORPUS`.

---

## 12. CLEANUP RULES

- Remove temporary files your test creates, including on failure paths.
- No stray scratch files in the repository. `git status` clean before the PR.
- No commented-out remnants of the old fixture.

---

## 13. STRICT BOUNDARIES / OUT OF SCOPE

Do **not**, in this PR:

- Re-key any Tier2 document (Guiyang/Fayan) — that is a separate queued task.
- Touch the botrunner export lane or its schema.
- Create `orchestrator/ORCHESTRATOR CORE v4.9.0 — GENERAL PURPOSE.md`, its sha256 anchor, or
  `bin/orchestrator-check`.
- Change pin 7's forged aggregates (§6.4 is record-only).
- Enable branch protection or change any repository setting — owner decision.
- Interact with PR #115 or its branch in any way.
- Refactor unrelated parts of the test suite.

If you believe an out-of-scope change is required, **halt and report** instead.

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
# both must print b68eb436ac8c847a0f92ec0dea8d0f74597aa8ee79778b5e5dfe8920bb9cdba7
```

**Mutation proof — mandatory, and the real point of this task.** A green suite does not show the new
fixture discriminates. Prove it does, and paste both transcripts in the PR:

1. Temporarily make the stripped copy retain `doc` (skip the `pop`). The unrecorded-option check must
   **FAIL**. If it still passes, the fixture asserts nothing — stop and report.
2. Temporarily point the new live-register assertion at a register that does not record `doc`. It
   must **FAIL**.
3. Revert both. Full suite green at 146.

Confirm all work is pushed and `git status` is clean before opening the PR.

---

## 15. PR DESCRIPTION REQUIREMENTS

A squash-merge collapses checkpoint history, so the description is the surviving narrative. Include:

- **Summary** — what was fragile and why, not only what changed. State plainly that no gate was
  failing; this removes a latent silent-pass trap.
- **Design rationale** — why a constructed fixture beats a borrowed one: the old fixture depended on
  an incidental property of a superseded, append-only file, so any future touch to that file would
  have disabled the test while it kept reporting green. Note that the suite got *stricter*
  (145 → 146) and that this is the opposite of editing a checker to pass.
- **Mutation proof** — both §14 failure transcripts, verbatim. Without these the PR is incomplete.
- **Tracker corrections** — quote the old and new text of both lines; include the two `gh api`
  commands that measured the branch-protection finding.
- **Gate transcript** — the seven §14 commands with real output, plus the two determinism hashes.
- **Explicit statement** that no corpus byte, no `BASE_COMMIT`, no `AUTH_REGISTER` and no bundle hash
  changed, and that no file in `sessions/` was modified.
- **Known cosmetic deviation** — the §6.4 pin-7 aggregates note.
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
