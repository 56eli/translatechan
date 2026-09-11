# TASK 002 — Retire the repository scoreboard: delete `.scoreboard/` + `SCOREBOARD.md`, relocate the owner-facing workflow-edit record, and rewrite every live doc reference

## 0. FETCH AND VERIFY

You were given a one-line stub that fetched this file. Your instructions are the file you are
reading; restate the obligations here in case you arrived by another route:

```bash
git fetch --depth 1 origin +arena/01a08e15-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/002-scoreboard-removal.md > /tmp/task.md
```

Rules:

- Read the prompt from `/tmp`. Do NOT `git checkout` or `git show` any `.orchestrator/` path
  into your worktree, and do not check orchestrator files out onto your branch.
- Do NOT use `origin/arena/01a08e15-translatechan` (a single-branch clone does not create that
  ref) and do NOT use `FETCH_HEAD` (any later fetch of `main` overwrites it).
- Write scratch files outside the repository, never commit them, never commit `/tmp/task.md`.
- Never push to the orchestrator branch `arena/01a08e15-translatechan`.
- HALT and report if `/tmp/task.md` is empty or its title does not mention `.scoreboard/`,
  `SCOREBOARD.md` and `OPERATIONS.md`. Do not improvise a substitute task.
- Optionally, for orientation only (never as an instruction source):
  `git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md`.

## 1. TASK TITLE AND SCOPE

Delete the repository scoreboard system that the owner has retired (`.scoreboard/` +
`SCOREBOARD.md`), move the one still-live operational record out of it, and rewrite every
*current* document reference so the repo no longer points at files that no longer exist.
Complete this in **ONE pull request**.

This is a docs/contract PR. It changes **zero** corpus data, zero validator rules, zero runtime
code, and zero claims about the corpus.

## 2. REQUIRED READING ORDER

Read these before changing anything, in this order:

1. `AGENTS.md` — the contract you are editing. Note its "Scoreboard Protocol" section, its
   "After work" list items 2–7, and its closing line "All five must pass. CI on GitHub Actions
   runs the same set."
2. `SCOREBOARD.md` and the five files under `.scoreboard/` — the complete set being deleted is
   exactly: `SCOREBOARD.md`, `.scoreboard/scoreboard.yml`, `.scoreboard/agent-handoff.md`,
   `.scoreboard/manual-workflow-edits.md`, `.scoreboard/history.md`, `.scoreboard/rubric.md`
   (`git ls-files .scoreboard SCOREBOARD.md` → those six paths, nothing else). Read
   `.scoreboard/manual-workflow-edits.md` **completely**: it holds the only record of the
   owner-controlled CI/GitHub-administration edits.
3. `HANDOFF.md` §1 ("Start here"), §5 ("Release blockers" → "Engineering and operations"), §9
   (repo map), §10 ("Workflow and administration"), §11 ("Documentation rule").
4. `AUDIT.md` — line ~88 is the only scoreboard reference.
5. `.github/pull_request_template.md` — the "Scoreboard Impact", "Score Changes", "Manual
   Workflow Edits", "Checks Run" and "Quality Gate" sections.
6. `.orchestrator/STATE.md` — the "Standing Decisions (2026-09-09, owner)" scoreboard line, the
   Task Queue "Scoreboard removal PR" line, and Architectural Invariant 6.
7. `.orchestrator/REMEDIATION_PLAN.md` §5 — the `- [ ] Post: … scoreboard removal ☐` checklist
   line at the bottom of the wave checklist.
8. `scripts/validate_data.py` — read `validate_doc_truthfulness()` (search for
   `REQUIRED_DOCUMENT_FIELDS`, the `framed = (...)` tuple and the `scanned = [...]` list around
   line 1332) so you know exactly which README/AUDIT/HANDOFF/ROADMAP/`index.html`/
   `.orchestrator/STATE.md` lines are machine-guarded and must survive verbatim.
9. `scripts/build_data_bundle.py` — the "sync contract" lists what gets mirrored into `docs/`;
   this determines where a new root file may be added.

## 3. PROJECT CONTEXT

Fake Chan Factory (`56eli/translatechan`) is a zero-backend static GitHub Pages reader for
Classical Chinese Chan literature with an enforced honest-disclosure contract. Fixed pipeline,
all artifacts in lockstep:

```
data/*.json → scripts/validate_data.py → data/project_metrics.json
            → scripts/build_data_bundle.py → root assets + byte-identical docs/ mirror → Pages
```

The scoreboard (`.scoreboard/` + `SCOREBOARD.md`) was the durable-context mechanism for
expiring sandbox agent sessions: 22 weighted aspects with AI scores, `user_score` overrides,
an `effective_score`/`repo_ready` gate, a history log, and a manual-workflow-edit register. It
is being removed because an orchestrator-oversight layer in `.orchestrator/` now carries that
role, by explicit owner decision (2026-09-09, recorded in `.orchestrator/STATE.md` §"Standing
Decisions": "Scoreboard: REMOVE `.scoreboard/` + `SCOREBOARD.md` entirely; orchestrator
oversight replaces it").

The `repo_ready` gate the old audit docs reference ("fail" at 7.2/10) lived only in the
scoreboard files, so deleting the scoreboard removes the gate; the release is still blocked by
the content/rights/operations blockers enumerated in `HANDOFF.md` §5, which remain true.

**Base state:** you start from `main` after PR #30 (W1 remediation, `biyanlu_cases` re-key) has
merged. Metrics on that base: content CJK **104,351** / all-string CJK **109,848**, corpus=35,
W1 flagged=630. Do not change any of it.

## 4. CONFIRMED FACTS AND CONSTRAINTS

Treat these as true without re-deriving:

- **The owner decision exists and is recorded in-repo** (`.orchestrator/STATE.md` §"Standing
  Decisions"). You do not need further approval to delete the scoreboard files.
- **`scripts/validate_data.py` contains no `scoreboard` string at all** (verified 2026-09-11:
  `grep -n -i scoreboard scripts/*` → no hits). Nothing in the validator requires these files
  to exist, so their deletion cannot break a gate by itself — but `validate_data.py` *does*
  machine-guard specific lines of `README.md`, `AUDIT.md`, `HANDOFF.md`, `ROADMAP.md`,
  `index.html` and `.orchestrator/STATE.md`, and several of those lines sit in files you are
  editing. Preserve the guarded content verbatim (section 2 item 8); use `--skip-docs` only
  while iterating, and always run the full validator at every checkpoint before pushing.
- The following references are **historical evidence and must NOT be rewritten** (append-only
  records, per the repo's documentation rule): `sessions/*` (notably
  `sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`,
  `sessions/COLLATION_W1_2026-09-10_CORRECTION.md`), `FULL_AUDIT_2026-08-10_019feaf5.md`,
  `docs/audits/2026-08-10-baseline.md`, `response_summary.md`, and every file under
  `.scoreboard/` itself right up to deletion. Dead links inside those dated reports are
  acceptable; a stale link in a *live* document is not.
- **`README.md` has zero scoreboard references** (verified 2026-09-11) — do not edit it.
- `docs/` is a generated mirror. `scripts/build_data_bundle.py` copies exactly
  `index.html`, `app.css`, `app.js`, `theme-init.js`, `robots.txt`, `sitemap.xml`,
  `og-image.svg`, the generated `app_data.js` and the whole `data/` tree into `docs/`; the
  hand-maintained `docs/audits/*.md` are not part of that contract. A new root `OPERATIONS.md` is
  therefore **not** mirrored: confirm by reading the script's sync list, and do not extend it.
  Do not create any file inside `docs/`.
- `.github/workflows/*` must not be edited (owner approval required; your session token
  additionally lacks the `workflows` scope). This PR removes the *template's* reference to the
  `.scoreboard/` file that recorded workflow edits — repoint it at the new `OPERATIONS.md`.
- `.scoreboard/scoreboard.yml` `user_score` fields are all `null`. Their loss is intended and
  must not be recorded as a score change anywhere: after this PR there is no score to change.
- Humor-forward brand and tone stay ("Fake Chan Factory" / 假禪工廠). Do not sanitize prose you
  are not required to edit.

## 5. CORE OBJECTIVE

After this PR merges, a reader of the repository's *current* documentation is never told to open,
update, or consult a scoreboard file, no live document or PR template links a deleted path, and
the owner-facing CI/administration record still exists at a new, discoverable top-level path.

"Done" criteria, all of them:

1. `git ls-files` contains no path matching `.scoreboard/` or `SCOREBOARD.md`.
2. `grep -rniE "scoreboard" --exclude-dir=.git --exclude-dir=sessions .` reports matches **only**
   in: `sessions/*`, `FULL_AUDIT_2026-08-10_019feaf5.md`, `docs/audits/*`, `response_summary.md`,
   and files whose text is deliberately describing the removal (`AGENTS.md`, `HANDOFF.md`,
   `AUDIT.md`, `.orchestrator/STATE.md` may each retain at most the single sentence recording
   that the scoreboard was retired).
3. `.scoreboard/manual-workflow-edits.md`'s three owner-controlled edits survive, re-homed in
   `OPERATIONS.md`, with content preserved (exact YAML/commands included).
4. All five quality gates pass, and the artifact check proves nothing in `docs/` went stale.
5. No corpus file, no metrics value, no validator rule, no workflow file changed.

## 6. EXACT DELIVERABLES

Delete:

- `.scoreboard/scoreboard.yml`, `.scoreboard/agent-handoff.md`, `.scoreboard/manual-workflow-edits.md`,
  `.scoreboard/history.md`, `.scoreboard/rubric.md` and the rest of `.scoreboard/`
  (`git rm -r .scoreboard`), and `SCOREBOARD.md`.

Create:

- `OPERATIONS.md` (root). Contents, in this order:
  1. A one-paragraph header: what this file is (the register of owner-controlled GitHub-side
     changes and repository administration that agents may not perform), and that it replaced
     `.scoreboard/manual-workflow-edits.md` when the scoreboard was retired.
  2. The old file's "Policy" section, re-worded so "record exact changes here" points at this
     file; keep the statement that agents must not edit `.github/workflows/*` unless the owner
     explicitly requests it.
  3. Edits 1, 2 and 3 copied from `.scoreboard/manual-workflow-edits.md` verbatim (including the
     `git diff --exit-code` path list and the `uses:` lines), with the two sentences that
     referenced `.scoreboard/scoreboard.yml` `next_action`/status values replaced by:
     "and mention it in the dispatch so the orchestrator records it in its working state."
  4. The old "Validation after either edit" command block, verbatim except that the final
     `git diff --exit-code …` list is replaced with a pointer to the "Require generated
     artifacts and deploy mirror to be committed" step in `.github/workflows/quality.yml`
     (single source of truth).
  5. `## Provenance` — one line: relocated from `.scoreboard/manual-workflow-edits.md` on
     2026-09-11, "Last audited: 2026-08-11, session `arena/019ff089-translatechan`" retained as
     the last audit date, plus: the status vocabulary the old file used
     (`blocked_manual_workflow_edit`) is retired with the scoreboard; there is no replacement
     status.

Modify:

- `AGENTS.md`:
  - Delete the `## Scoreboard Protocol` section (its "Before work" 1–6, "During work" 1–7) and
    put in its place a short `## Project state and priority setting` section: durable context
    lives in `AGENTS.md`, `HANDOFF.md`, `AUDIT.md`, `ROADMAP.md`, `.orchestrator/STATE.md` and
    append-only `sessions/`; priority is set by the task prompt you were dispatched with;
    `user_score`-style AI scoring is retired, so no file in this repo carries a score to update;
    a needed `.github/workflows/*` change is recorded as the exact edit in `OPERATIONS.md`
    (no status file to flip any more).
  - In "## After work": remove items 2–7 (all scoreboard bookkeeping) and renumber; keep
    "run the relevant checks", keep "Summarize remaining manual workflow edits in your final
    response" but point it at `OPERATIONS.md`; keep "Commit + push to the session branch".
  - In "## Working environment": change the Strict-CSP sentence and any other sentence you must
    touch only as required by scoreboard removal — otherwise leave untouched.
- `.github/pull_request_template.md`: remove the "Scoreboard Impact" aspect checklist and the
  "Score Changes" table block; keep "Manual Workflow Edits" but repoint its path at
  `OPERATIONS.md` and drop the `scoreboard.yml` status sentence; keep "Checks Run"; replace the
  "Quality Gate" section's `repo_ready` question with a `## Release impact` section asking
  whether the PR changes any blocker listed in `HANDOFF.md` §5; keep "Files Intentionally Not
  Changed" and "Risk Flags Touched", but re-word their pointer from `SCOREBOARD.md` /
  `.scoreboard/agent-handoff.md` to `HANDOFF.md` §5.
- `HANDOFF.md`: §1 items 2–4 → replace with the new reading list (`AGENTS.md`,
  `.orchestrator/STATE.md`, `OPERATIONS.md`) and renumber; drop "Never infer or change a
  `user_score`." and instead state that scoring is retired; §5 Engineering-and-operations
  bullet "CI omits four mirrored paths…" → keep the fact, point at `OPERATIONS.md` Edit 1;
  §9 repo map: remove the `.scoreboard/` line, add `OPERATIONS.md # owner-controlled CI/GitHub
  admin edits` in the same style; §10: repoint the "Exact pending changes are documented in …"
  link to `OPERATIONS.md`; §11: remove the three `SCOREBOARD.md` / `.scoreboard/*` bullets, add
  one bullet for `OPERATIONS.md`, and add to the task-queue wording that the scoreboard was
  retired by this PR.
- `AUDIT.md` (~line 88): keep the factual history, remove the live pointer. Replace "…the current
  [scoreboard](./SCOREBOARD.md) corrects the arithmetic and records only evidenced
  improvements" with wording that names the audit itself as the source of those recorded
  improvements, and state in one sentence that the scoreboard scoring system was retired
  (2026-09-11) so a reader does not go looking for it. Do not add a new score.
- `.orchestrator/STATE.md` (canonical tracker, on the default branch — this PR is its authorized
  update):
  - "Standing Decisions (2026-09-09, owner)" scoreboard line → append "(executed — PR #N)".
  - Task Queue "- [ ] **Scoreboard removal PR** …" → mark `- [x]` with the PR number and date.
  - Architectural Invariant 6 ("No edits to `.github/workflows/*` without explicit owner
    approval; `user_score` fields … are never inferred, invented, or changed.") → keep the
    workflow half, replace the second half with "`OPERATIONS.md` is the only record of
    owner-controlled CI/GitHub-side edits."
  - Add **one** new paragraph under the "W1 remediation started" area recording: scoreboard
    retired 2026-09-11 (PR #N); `.scoreboard/` history and `user_score` fields were deleted, not
    migrated (owner decision superseded them); the retired `blocked_manual_workflow_edit` status
    vocabulary is now a plain prose note in `OPERATIONS.md`.
- `.orchestrator/REMEDIATION_PLAN.md` §5: tick the post-line — change
  `scoreboard removal ☐` to `scoreboard removal ☑ (PR #N, 2026-09-11)`.

Do NOT modify: `README.md`, `ROADMAP.md`, `vision.md`, `UX_ROADMAP.md`,
`WEB_VISION_2026-08-10.md`, `RESEARCH_RELEASE_PLAN.md`, `index.html`, `app.js`, `app.css`,
`theme-init.js`, anything under `data/`, `docs/`, `scripts/`, `sessions/`, `schemas/`,
`.github/workflows/`, and any other corpus file.

## 7. SUB-TASK BREAKDOWN AND CHECKPOINTS

Each sub-task ends with one checkpoint (section 9's single command). This list IS your push
schedule; do not add extra verification ceremony around it.

1. **Capture + relocate.** Read `.scoreboard/manual-workflow-edits.md` in full; create
   `OPERATIONS.md` per section 6 with Edits 1–3 preserved. → checkpoint
2. **Delete the scoreboard.** `git rm -q SCOREBOARD.md && git rm -rq .scoreboard`. → checkpoint
3. **`AGENTS.md` contract rewrite** (section 6). → checkpoint
4. **PR template rewrite** (section 6). → checkpoint
5. **`HANDOFF.md` + `AUDIT.md` live references** (section 6). → checkpoint
6. **`.orchestrator/STATE.md` + `REMEDIATION_PLAN.md` §5** (section 6; fill `PR #N` with the
   number once you have it in sub-task 8 — leave a `PR #N` placeholder until then and do not
   open the PR twice). → checkpoint
7. **Verification pass.** Section 14's commands, all green, including the reference scan
   (objective 2) and the artifact check. Fix only what this PR broke. → checkpoint
8. **Open the ONE pull request** with the section-15 description; then substitute the real
   `PR #N` into `.orchestrator/STATE.md` and `.orchestrator/REMEDIATION_PLAN.md` §5 and push. → final checkpoint

## 8. BRANCH AND TARGET

- **Base branch:** `main` (never the orchestrator branch). This PR assumes PR #30 is already
  merged into `main`; if `git merge-base --is-ancestor` shows your `origin/main` fetch missing
  the #30 merge, HALT and report — do not rebase onto the unmerged PR branch.
- **Target branch:** the non-default `arena/*` working branch your session is already pinned to
  by the platform. Stay on it; never commit on `main`. Only if you somehow find yourself on
  `main`: `git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B
  docs/scoreboard-removal origin/main`.
- **Orchestrator branch:** `arena/01a08e15-translatechan` — fetch source only; never a base,
  never a target, never push to it.
- **Dependencies:** PR #30 (merged `data/corpus/biyanlu_cases.json`, regenerated
  `data/project_metrics.json`, regenerated `app_data.js` + `docs/`, plus `.orchestrator/*`,
  `AUDIT.md`, `HANDOFF.md`, `README.md`). This PR must be based on the merge commit that contains
  it, so its own `HANDOFF.md`/`AUDIT.md`/`.orchestrator/*` edits do not conflict with #30's.
- **Resuming:** fresh branch from `main`. No interrupted branch carries this task.

## 9. WORK PERSISTENCE AND PUSH CADENCE

Your session can expire without warning; unpushed work is lost. Checkpoint after each sub-task in
section 7, before any long operation (a full five-gate run), and at the end. There is no
time-based rule — section 7 is your schedule.

A checkpoint is ONE command — first push, later push, and the nothing-to-push no-op are the same
form. No `git status`/`git diff` ceremony around it:

```bash
git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin <branch>
```

- Commit messages follow the repo's Conventional Commits style: checkpoints are `chore: wip …`;
  the final content commit may be `docs: retire the repository scoreboard system`.
- Checkpoint commits may be broken; that is expected. Never commit secrets — and note that if a
  credential ever reaches a push it is disclosed even if a later commit deletes it: halt and
  report instead of cleaning up.
- Open exactly ONE PR at the end, when section 14 passes. Do not open a draft PR first.
- Never push to the orchestrator branch; never push anything from `/tmp`.
- **Sync rule:** rebase onto `origin/main` ONLY before your first push. After the first push,
  never rebase (that would force a force-push); integrate with
  `git fetch --depth 50 origin +main:refs/remotes/origin/main && git merge --no-edit origin/main`
  then `git push origin HEAD`.
- Never force-push unless explicitly instructed (you will not be). On a merge conflict: HALT and
  report the conflicting files. Same for a sync refusing "refusing to merge unrelated
  histories" — never pass `--allow-unrelated-histories` (raise the fetch depth instead).
- If a push or fetch fails with an auth/network error, report it plainly, keep working locally,
  and retry at the next checkpoint. Never claim work is pushed while a push has failed, and never
  modify credentials, remotes, or git config to work around it.
- Shallow-clone rules: fetch with explicit `+src:dst` refspecs into named refs and read from
  those refs; never `git show <sha>:<path>` for unfetched objects; never rely on `FETCH_HEAD`
  across fetches; do not unshallow.

## 10. TECHNICAL REQUIREMENTS

- **Style:** Markdown edits in the surrounding file's voice; keep existing line-wrapping and
  heading level; no reflowing of untouched paragraphs. `OPERATIONS.md` follows the repo's plain
  prose style (no emoji in a file addressed to GitHub administrators).
- **No code changes.** Do not touch a `.py`, `.mjs`, `.js`, `.css`, `.html`, `.json` or
  `.yml` file.
- **Do not "fix" the CI gaps** you find while reading `.github/workflows/quality.yml`
  (four missing mirrored asset paths, action majors). They are the content of `OPERATIONS.md`
  Edit 1/Edit 2 and are owner-controlled.
- **TEST_COMMAND:** `python3 scripts/test_source_preservation.py` → must pass and print
  `0 unauthorized changes` (it proves no corpus file drifted). Covered behavior: byte-identity
  of `data/corpus/` against pinned base `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43` apart from the
  pre-existing allowlist.
- **INTEGRATION_TEST_COMMAND:** `node scripts/smoke_test.mjs` → "✅ SMOKE TEST PASSED". It is the
  public-scope and renderer regression; this PR must not change any behavior it asserts, and it
  invokes the source-preservation + W1-rule suites internally.
- **FULL_SUITE_COMMAND (the repo's five gates, in order):**
  `python3 -m py_compile scripts/*.py` → `python3 scripts/validate_data.py` (zero errors; run
  WITHOUT `--skip-docs` to prove doc truthfulness still holds after your README/HANDOFF/AUDIT
  edits) → `python3 scripts/build_data_bundle.py` → `node scripts/smoke_test.mjs` →
  `diff -rq data docs/data`.
- **COVERAGE_COMMAND:** not configured (this repo has no coverage tool or threshold; do not
  invent one — documentation has no measurable coverage here).
- **MUTATION_TEST_COMMAND:** not warranted — no logic changes; the evidence mutation matrix
  (`scripts/test_source_review_rules.py`, run inside the smoke test) is untouched and still
  exercised by the smoke suite.
- **LINT_COMMAND:** `python3 -m py_compile scripts/*.py` (the only configured lint; there is no
  Markdown linter, so use the reference scan in section 14 as the docs equivalent of a lint).
- **BUILD_COMMAND:** `python3 scripts/build_data_bundle.py` (regenerates `app_data.js` + `docs/`;
  with no data change it must be a no-op, which is itself the check that `docs/` is not stale).

## 11. SAFETY AND COMPATIBILITY RULES

- **Must not break:** the five quality gates and the CI artifact check
  (`git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js
  docs/data data/project_metrics.json`); the validator's doc-truthfulness guards (do not alter a
  guarded line's quoted figure or phrasing); `AGENTS.md`'s still-live contracts (project identity
  and internal identifiers, no-runtime-dependency rule, CSP rules, the five-room public scope,
  the data contract, the honest-disclosure core); the PR template's ability to be filled out.
- **Must not change:** anything under `data/`, `docs/`, `scripts/`, `sessions/`,
  `.github/workflows/`; `README.md`; the corpus metrics or any W1/rights/status value; any
  historical dated report. No new dependency, no new script, no new `docs/` file.
- **Information loss must be deliberate and recorded.** `.scoreboard/history.md`, `rubric.md`,
  `agent-handoff.md` and `scoreboard.yml` are deleted, not migrated — say so plainly in the PR
  description (that is what an owner decision looks like, as opposed to a silent drop). The only
  file whose live content must survive is `manual-workflow-edits.md`.
- **Backward compatibility:** links inside `sessions/*` and the other historical documents may
  go dead; links in live documents may not. Anyone reading `AGENTS.md`/`HANDOFF.md` after this PR
  must find a consistent instruction set with no scoreboard step.

## 12. CLEANUP RULES

- By the final push: no commented-out remnants, no leftover "scoreboard" phrasing in sections you
  rewrote, no scratch notes, no `TODO` markers introduced by this PR, no half-rewritten
  sentences, consistent list numbering after deletions (`AGENTS.md` "After work", `HANDOFF.md`
  "Start here"), and no dead `./SCOREBOARD.md` or `./.scoreboard/` markdown links in live files.
- Do not commit `/tmp` artifacts or the fetched prompt file.
- Do not reformat untouched paragraphs; a reviewer must see only the removal in the diff.
- Intermediate checkpoint commits are exempt — clean up once, before opening the PR.

## 13. STRICT BOUNDARIES / OUT OF SCOPE

- Do NOT edit `.github/workflows/*`, and do not "improve" the CI while you are in the neighbourhood.
- Do NOT touch `.scoreboard/` content by migrating it into a new scoreboard: only
  `manual-workflow-edits.md`'s owner-facing payload is relocated. Do not create
  `.orchestrator/scoreboard*`, `SCOREBOARD/`, or any replacement scoring file or rubric.
- Do NOT edit any validator rule, `schemas/`, or `data/` file; do NOT regenerate metrics.
- Do NOT rewrite `README.md` (it has no scoreboard references).
- Do NOT touch `sessions/*`, `FULL_AUDIT_2026-08-10_019feaf5.md`, `AUDIT_*.md`,
  `docs/audits/*`, `response_summary.md`, `ROADMAP.md`, `vision.md`, `UX_ROADMAP.md`,
  `WEB_VISION_2026-08-10.md`, `RESEARCH_RELEASE_PLAN.md`.
- Do NOT add a new scoring/gate vocabulary (`repo_ready`, aspect weights, `effective_score`)
  anywhere in the repo. The gate is retired, not re-homed.
- Do NOT start the `linji_yulu` remediation, the visual-system reset, W2 quotation checking, the
  composite-title item, CSP/inline-style work, or performance work.
- Do NOT push to the orchestrator branch `arena/01a08e15-translatechan`. Do NOT force-push. Do
  NOT open a second PR.

## 14. QUALITY CHECKS

Run all of these; record each result for the PR description.

1. `python3 -m py_compile scripts/*.py` → clean.
2. `python3 scripts/validate_data.py` → `✅ DATA VALIDATION PASSED`, zero errors, run WITHOUT
   `--skip-docs` (proves the doc-truthfulness guards still pass after your doc edits).
3. `python3 scripts/build_data_bundle.py` → succeeds; then
   `git status --short` must show **nothing** in `docs/`, `app_data.js` or
   `data/project_metrics.json` (proves the sync contract was not disturbed and no new root file
   needs mirroring).
4. `node scripts/smoke_test.mjs` → `✅ SMOKE TEST PASSED`.
5. `diff -rq data docs/data` → no output.
6. `git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json`
   against your HEAD (i.e. `git status` clean for those paths) → the CI artifact gate.
7. Reference scan (objective 2):
   `grep -rniE "scoreboard" --exclude-dir=.git --exclude-dir=sessions --exclude-dir=node_modules .`
   → matches only in the allowed historical files listed in section 4. Also run
   `git ls-files | grep -i scoreboard` → **empty**.
8. Dead-link check on live docs: for every markdown link you added or kept in `AGENTS.md`,
   `HANDOFF.md`, `AUDIT.md`, `OPERATIONS.md` and `.github/pull_request_template.md`, confirm the
   target path exists (`ls` each one).
9. `git diff --check` and `git diff --check origin/main...HEAD` → clean.
10. Browser suite: `npm run test:browser` is not applicable — this PR changes no runtime asset,
    no HTML/CSS/JS. Record "not applicable — documentation-only change; no rendered surface is
    affected" instead of running it.
11. `git status` clean; all work pushed.

## 15. PR DESCRIPTION REQUIREMENTS

Title: `docs: retire the repository scoreboard system`. The description is the surviving
narrative of a squash merge and must contain:

- **Summary:** what was deleted, created and re-pointed; link `.orchestrator/STATE.md`
  §"Standing Decisions (2026-09-09, owner)" as the authorizing decision.
- **Deletion manifest:** the exact files removed, each with one line on what it held, and an
  explicit statement that `history.md`/`rubric.md`/`agent-handoff.md`/`scoreboard.yml` were
  deleted rather than migrated (owner decision), with `manual-workflow-edits.md` relocated to
  `OPERATIONS.md`.
- **Contract diff:** before/after wording of `AGENTS.md`'s replaced section and the PR template's
  removed sections, so a reviewer can see what agents are no longer asked to do.
- **Guards untouched:** one line each confirming no validator rule, no workflow file, no data or
  generated artifact changed, and that the five gates + artifact check pass with the outputs of
  section 14 pasted (commands and results).
- **Reference scan output** (section 14 item 7) proving no live document points at the deleted
  files.
- **Release impact:** the retired gate ("`repo_ready`", 7.2/10) and the fact that `HANDOFF.md` §5
  blockers are unchanged and still block release; no new score introduced.
- **Files intentionally not changed:** the historical documents listed in section 4, plus
  `README.md`, with the one-line reason for each.
- **Safety statement:** this PR changes no user-facing behavior and no corpus claim; the public
  Pages artifact is byte-identical (bundle and `docs/` rebuild as a no-op).
- Describe only this PR's own changes. Do not list PR #30's remediation work as yours.
