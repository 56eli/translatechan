FETCH AND VERIFY

```bash
git fetch --depth 1 origin +arena/01a08e15-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/017-pr44-branch-model-clause.md > /tmp/task.md
```

Read `/tmp/task.md` from there. Do not check orchestrator paths into the worktree, do not use
`origin/arena/01a08e15-translatechan` or `FETCH_HEAD`. Verify the file is non-empty and its TASK line says
`REVISION / FIX FOR PR #44`; otherwise halt and report.

```text
TASK: REVISION / FIX FOR PR #44
BRANCH: arena/01a097f7-translatechan — continue on it, do not start fresh:
    git fetch --depth 50 origin +arena/01a097f7-translatechan:refs/remotes/origin/_resume
    git checkout -B arena/01a097f7-translatechan refs/remotes/origin/_resume
SUPERSEDES: nothing. This repairs .orchestrator/prompts/016-tracker-continuation-block.md's one open item.
```

## FAILED ACCEPTANCE CRITERIA

- **§5, field 1 (Orchestrator branch).** The bullet states the channel "is never pushed to". The channel exists so
  that the *orchestrator* publishes prompts to it; that clause is a worker rule transplanted into a document a
  successor orchestrator reads as its own instructions. A cold start obeying it would never publish a prompt again —
  a silent pipeline stall, which is the one outcome this PR exists to prevent.

## REGRESSIONS / DEFECTS FOUND

- `.orchestrator/STATE.md`, inside the new `## Continuation (cold start)` block, the line beginning
  `- **Orchestrator branch:**` (locate it with
  `grep -n "^\- \*\*Orchestrator branch:\*\*" .orchestrator/STATE.md`, do not trust a line number). Everything else
  in the file is approved and must stay byte-identical.

## REQUIRED ACTIONS

1. Replace that single bullet with the audience-explicit form, keeping the branch name and the `ls-remote` output you
   already recorded:

   ```markdown
   - **Orchestrator branch:** `arena/01a08e15-translatechan` — the prompt **distribution channel**. The orchestrator
     publishes prompt files and its working state to it; it never merges into `main`, is never a PR base, and **no
     coding agent ever pushes to it or bases a branch from it** — a cold start fetches *from* it:
   ```

   Keep the fenced `bash` fetch block that follows it exactly as it is, and keep the sentence explaining that a
   single-branch clone has no `origin/arena/01a08e15-translatechan` ref.
2. Re-run, in order, and paste every exit code into the PR conversation:

   ```bash
   python3 scripts/validate_data.py            # the doc-truthfulness scan covers STATE.md: 622|637 and
                                               # CORRECTED|superseded must survive, and every T1987 line must
                                               # still name the Caoshan record
   python3 scripts/build_data_bundle.py
   git diff --exit-code data docs              # must print nothing: this PR moves no data
   node scripts/smoke_test.mjs
   python3 scripts/test_source_review_rules.py
   git diff --check
   git diff --numstat origin/main...HEAD       # expect 139+ 0- (or 140/1 if you re-wrap) — deletions must stay 0
   ```

   If a correction appears to *require* editing a gate-pinned string, stop and report it: the pin is the contract.
3. Append one line to the PR description under `#### Session Irregularities` — or `None additional` — stating whether
   this single-clause round cost anything beyond the fix.

## PUSH CADENCE

The branch is already published: **do not rebase it.** One command per action, no status/diff ceremony:

```bash
git add -A && (git diff --cached --quiet || git commit -qm "chore: wip branch-model clause") && git push -qu origin arena/01a097f7-translatechan
```

Sync with `git fetch --depth 50 origin +main:refs/remotes/origin/main && git merge --no-edit origin/main`, then push.
Never `--force`, never `--allow-unrelated-histories`; on a conflict or an unrelated-histories refusal, halt and report.
A non-fast-forward rejection is a base mismatch — halt and paste the raw text, do not `git pull`. If a push fails on
auth or network, report it, keep working locally, and retry at the next checkpoint; never say pushed what is not.
Never push to `arena/01a08e15-translatechan`. Update PR #44; do not open a second PR.

## DO NOT TOUCH

- Any other line of `.orchestrator/STATE.md` — including the other six Continuation fields, the census block, the
  measured-output fences, and the dated `104,564 / 110,165` paragraph under task 011 (its addendum belongs to 014b).
- `data/**`, `docs/**`, `README.md`, `AUDIT.md`, `HANDOFF.md`, `ROADMAP.md`, `vision.md`,
  `RESEARCH_RELEASE_PLAN.md`, `index.html`, `app.js`, `app.css`, `schemas/**`, `.github/workflows/**`,
  `sessions/**`, every `scripts/*.py`.
- The census sync and the `dahui_hongzhi` disclosure: both are **014b's** deliverables. Fixing them here is out of
  scope even though you know exactly how.

## CONTEXT

- Original prompt: `.orchestrator/prompts/016-tracker-continuation-block.md` (15,181 B).
- Your PR claimed: one appended section, seven fields, append-only, every number re-measured at `1b41d0b`.
- The diff confirms all of it. Stage 2 was green in the reviewer's own clone, and the census, the nine-line 014b
  citation and the `scripts/` counts all reproduced independently. The only failure is this clause — a defect the
  dispatching prompt created, not one you introduced.
