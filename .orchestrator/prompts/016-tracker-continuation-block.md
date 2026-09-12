# Task 016 — Make `main` cold-startable: a Continuation block in the canonical tracker

**0. FETCH AND VERIFY**
You fetched this file with:

```bash
git fetch --depth 1 origin +arena/01a08e15-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/016-tracker-continuation-block.md > /tmp/task.md
```

Read `/tmp/task.md`; that is this file. Verify it is non-empty and that its first line contains
`Task 016`, then proceed. If the file is empty or the title does not match, halt and report — do not improvise a
task. Write only inside the repository you cloned; never commit `/tmp/task.md`; never push to
`arena/01a08e15-translatechan` (that branch is a distribution channel and never merges); do not read this task from
`origin/arena/01a08e15-translatechan` (single-branch clones have no such ref) and do not use `FETCH_HEAD`.

**1. TASK TITLE AND SCOPE**

Add one clearly-delimited `## Continuation (cold start)` block to `.orchestrator/STATE.md` on `main`, so an orchestrator
or developer who has only the default branch can resume work without reading any unmerged branch. Complete this in
ONE pull request.

**2. REQUIRED READING ORDER**

1. `.orchestrator/STATE.md` — the file you are editing; note its existing headings and the append-only convention.
2. `HANDOFF.md` §"What's next" — the sibling list your block must not contradict.
3. `ROADMAP.md:161`-`:180` — the Phase-2 status block whose figures your block cites.
4. `.orchestrator/PHASE2_PLAN.md` §11-§12 — the adjudication and owner-question record.
5. `scripts/validate_data.py`, the `doc truthfulness` scan near the end (search for `framed` and for
   `"T1987"`) — it enforces on `STATE.md` the strings listed in §4 below.

**3. PROJECT CONTEXT AND OWNER VISION**

translatechan is a read-only CBETA corpus reader (native GitHub Pages, `docs/` served from `main`). The owner's
current objective is source integrity: every public claim about *which witness holds a text* must be backed by a
reproducible collation, and nothing may be presented as complete that is not. This task advances that by making the
project's own memory survivable: the orchestrator session that produced PRs #38-#43 can expire, and the successor
must be able to continue the campaign from `main` alone.

Owner Vision Context: the campaign continues after this session; a handoff that loses the queue, the rulings, or the
two open follow-ups forces the owner to re-teach them, which is the exact failure the repository-memory rule exists
to prevent.

**4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES**

Treat these as true and do not re-derive them:

- The canonical tracker is `.orchestrator/STATE.md` (not `docs/PROJECT_STATE.md`; no such file exists and you must
  not create one). It is append-only by project convention: **edit nothing that is already there** except by adding
  a new section; if an existing line looks stale, report it instead of rewriting it.
- `scripts/validate_data.py` runs a doc-truthfulness scan over six files **including** `.orchestrator/STATE.md`. Your
  edit must keep, verbatim, every string it currently requires: the pair `622` and `637` somewhere on the lines that
  discuss the W1 totals, and both `CORRECTED` and `superseded` in the same document. It also rejects any line
  mentioning `T1987` that does not also say it is the Caoshan record. **Run `python3 scripts/validate_data.py` before
  you edit anything**, and again after; if a required string forces an awkward sentence, keep the string and note it.
- Current measured truth, as of `main` = `1b41d0b` (reproduce, do not copy — every one of these comes from a command
  in §5): 35 corpus documents; `complete_selected_witness` count 0; **50** provenance-note strings of which **39**
  render beside a passage (`cbeta_note` 17, `editorial_note` 8, `recension_note` 14) and **11** `coverage_note`
  strings are exempt by design; **23** documents carry at least one rendered label; source-content CJK **104,564**
  and all-string CJK **110,233**; the authoritative W1 register still holds **630** flagged fields and the 2026-09-12
  post-remediation measurement **532** stays a dated measurement, not a replacement.
- Three invariants from the campaign that the block must state, because no other file records them:
  (a) *the harness probing a witness is not the same as a field collating in it* — cite no work as a text's witness
  unless ≥1 evaluated content field matches it (`dahui_hongzhi`'s T48n2001 pairing is the current exception, see §5);
  (b) *representation never establishes completion*; (c) *source collation does not approve reuse*.
- Scope boundaries: do not touch `data/**`, `docs/**`, `app.js`, `app.css`, `index.html`, `schemas/**`,
  `.github/workflows/**`, `sessions/**`, or any `scripts/*.py`. Do not edit `README.md`, `AUDIT.md`, `HANDOFF.md`,
  `ROADMAP.md`, `vision.md`, `RESEARCH_RELEASE_PLAN.md` or `.orchestrator/REMEDIATION_PLAN.md`. This is a
  **single-file, append-only** task.

**5. CORE OBJECTIVE**

Insert a new section into `.orchestrator/STATE.md`, immediately before its final section, titled
`## Continuation (cold start) — added 2026-09-13`, containing exactly the seven fields below. Every number and path
must be one you re-ran in this session with the command shown, pasted into the PR description.

| field | required content | how to reproduce it |
|---|---|---|
| Orchestrator branch | `arena/01a08e15-translatechan` — distribution channel, never merges, never a base | `git ls-remote origin refs/heads/arena/01a08e15-translatechan` |
| How to resume | the two fetch forms: `git fetch --depth 1 origin +arena/01a08e15-translatechan:refs/remotes/origin/_orch` then `git show refs/remotes/origin/_orch:.orchestrator/prompts/<NNN>-<slug>.md` — plus the note that a successor must copy the prompt set and the working state forward rather than start a new index | run both against one real prompt and paste the output |
| Prompt inventory | one line per published prompt 002-016, each `NNN · title · PR · state` | `git ls-tree --name-only refs/remotes/origin/_orch .orchestrator/prompts/` |
| Immediate next task | **014b**: (1) sync the stale provenance-label census — `ROADMAP.md:163` and `:179`, `vision.md:57`, `:59`, `:88`, `:90`, `:327`, `RESEARCH_RELEASE_PLAN.md:32` and `:103` still assert 49/38/22/16 where main now measures 50/39/23/17; `vision.md:88` and `:90` sit inside a `text` block of measured output and must be regenerated, not retyped; (2) `dahui_hongzhi.cbeta_note` must disclose that the T48n2001 pairing is bibliographic (from `scripts/collate_corpus.py`'s witness note) and that 0 of 6 content fields collate, and `cbeta_id` either names all three works or states it covers the letters only | `grep -n "of the 49\|49\*\* provenance\|22 documents carry\|cbeta_note\` in 16\|cbeta_note\` 16" ROADMAP.md vision.md RESEARCH_RELEASE_PLAN.md` and `python3 -c` over `sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json` for `documents.dahui_hongzhi` |
| Owner rulings in force | the four 2026-09-12 rulings, one line each, with what each forbids | the `## Standing Decisions` section of this same file, written by PR #43 |
| Frozen surface | the five quality gates and the "never edit the checker" rule; `docs/app.css` is rewritten only by `scripts/build_data_bundle.py`; identifiers `translatechan_*` / `window.TranslateChan` / `TRANSLATECHAN_DATA` stay; public scope is exactly 5 rooms; `sessions/*` is append-only | `ls scripts/` and the AGENTS.md contract lines |
| Open environment hazard | the Arena sandbox can rewind the worktree to an old SHA and can drop GitHub credentials mid-session; before any conclusion about lost history, confirm with `gh api repos/56eli/translatechan/commits/<sha>` and `git ls-remote`; never `git pull` to fix a rejected push | prose, no command |

Done means: the block exists, all seven fields are filled with reproduced values, `validate_data.py` exits 0 before
and after, and no file other than `.orchestrator/STATE.md` changed.

**6. EXACT DELIVERABLES**

- Modify: `.orchestrator/STATE.md` — one added section, nothing else.
- Create: nothing.
- The canonical tracker does not need a second update beyond this file; `docs/PROJECT_STATE.md` must not be created.

**7. SUB-TASK BREAKDOWN AND CHECKPOINTS**

Each line is a push point.

1. Read §2's five files; run `validate_data.py` to capture the baseline gate state → commit + push
2. Run every §5 reproduction command; paste outputs into a scratch note in the PR body draft → commit + push
3. Insert the block's first three fields (branch, resume, inventory) → commit + push
4. Insert `Immediate next task` (014b) and `Owner rulings in force` → commit + push
5. Insert `Frozen surface` and `Open environment hazard`; re-run `validate_data.py` → commit + push
6. Final: full quality checks in §14, tidy the PR description, open the PR → push

**8. BRANCH AND TARGET**

- Base branch: `main` (never the orchestrator branch). `main` must contain `1b41d0b`.
- Target branch: `docs/tracker-continuation-block`
- Orchestrator branch: `arena/01a08e15-translatechan` — fetch source only.
- Dependencies: none. PR #43 is merged, so its follow-up (014b) is described here rather than depended on.
- Resuming: fresh branch from `main`. Before the first checkpoint, align `HEAD` to a remote tip — being on a branch
  named `<target>` is not evidence it is the remote `<target>`:

  ```bash
  git fetch --depth 50 origin +docs/tracker-continuation-block:refs/remotes/origin/_resume && git checkout -B docs/tracker-continuation-block refs/remotes/origin/_resume
  ```

  If that fetch cannot find the remote ref, the branch is new:

  ```bash
  git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B docs/tracker-continuation-block origin/main
  ```

  Do not commit on `main`. "couldn't find remote ref" here is not an environment failure.

**9. WORK PERSISTENCE AND PUSH CADENCE**

One command at every §7 checkpoint — first push, later pushes and the nothing-to-push no-op are the same form; do not
wrap it in status/diff inspections:

```bash
git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin docs/tracker-continuation-block
```

Rebase onto `origin/main` only before your first push; after it, sync with
`git fetch --depth 50 origin +main:refs/remotes/origin/main && git merge --no-edit origin/main`, then push. Never
force-push; never pass `--allow-unrelated-histories`; on a conflict or that refusal, halt and report. A
non-fast-forward rejection is a base mismatch: halt and report the raw text, do not `git pull`. If a push fails on
auth or network, report it and keep working locally, retrying at the next checkpoint; never claim pushed what is not
on the remote. Open ONE pull request at the end.

**10. TECHNICAL REQUIREMENTS**

Markdown only, matching the file's existing style (`##` heading, `- **Field:**` bullets, fenced `bash` blocks). No
new tools, no dependencies.

- `TEST_COMMAND: python3 scripts/validate_data.py` — covers the doc-truthfulness scan over the six framed files,
  which is the only gate that can fail on a prose edit to `STATE.md`.
- `INTEGRATION_TEST_COMMAND: node scripts/smoke_test.mjs` — it runs the validators and the data-consumer smoke checks;
  it reports `validate_data.py` failures as a cascade, so read the validator output first.
- `FULL_SUITE_COMMAND: python3 -m py_compile scripts/*.py && python3 scripts/validate_data.py && python3 scripts/build_data_bundle.py && git diff --exit-code data docs && node scripts/smoke_test.mjs && python3 scripts/test_source_preservation.py && python3 scripts/test_source_review_rules.py && diff -rq data docs/data && git diff --check`
- `COVERAGE_COMMAND: not configured` — the repo has no coverage tooling; do not invent a threshold.
- `MUTATION_TEST_COMMAND: not warranted` — the deliverable is one appended prose section with no branch logic; the
  repo's equivalent of mutation resistance for prose is the doc-truthfulness scan, which §14 runs.
- `LINT_COMMAND: git diff --check` (whitespace) — no linter is configured for markdown.
- `BUILD_COMMAND: python3 scripts/build_data_bundle.py` — must produce **no** diff, since this PR changes no data.

**11. SAFETY AND COMPATIBILITY RULES**

Nothing under `data/` or `docs/` may change; `build_data_bundle.py` must leave the tree clean. No existing line of
`STATE.md` may be deleted or reworded. The gate-pinned strings in §4 must survive. `index.html` and the `docs/`
mirror must stay byte-identical to their `main` state (there is no markdown mirror; a prose PR that moves
`docs/index.html` has edited the wrong file).

**12. CLEANUP RULES**

No TODO markers, no scratch files, nothing from `/tmp` committed. Do not reformat untouched prose. Leave the worktree
clean at the final push.

**13. STRICT BOUNDARIES / OUT OF SCOPE**

- Do not fix the census drift yourself: that is 014b's deliverable and it touches files this PR must not.
- Do not edit `scripts/validate_data.py` even if a pinned string makes the prose awkward — report it instead.
- Do not touch `data/corpus/dahui_hongzhi.json`, `ROADMAP.md`, `vision.md`, `RESEARCH_RELEASE_PLAN.md`, or any
  `docs/` path.
- Do not create `docs/PROJECT_STATE.md`, an ADR directory, or a `.orchestrator/` file of your own.
- Never push to the orchestrator branch. Never open a PR from it.

**14. QUALITY CHECKS**

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py                      # exit 0, and identical in kind to your pre-edit baseline
python3 scripts/build_data_bundle.py
git diff --exit-code data docs                          # must be empty
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
diff -rq data docs/data
git diff --check
git diff --name-only origin/main...HEAD                 # exactly one path: .orchestrator/STATE.md
git diff --stat origin/main...HEAD | tail -1            # 0 deletions expected (append-only)
```

Then paste all of it into the PR description. An empty `git diff --exit-code` line is itself evidence; quote the
command even when it prints nothing.

**15. PR DESCRIPTION REQUIREMENTS**

Title: `docs: give the canonical tracker a cold-start continuation block`. Body must contain: the one-paragraph
purpose; the §5 reproduction outputs (each command with its real output, not a summary); the exact block as it will
land; the §14 gate list; and a statement of what this PR deliberately does **not** do (014b's census fix, the
`dahui_hongzhi` disclosure, any data change). Close with `#### Session Irregularities` per §16. No breaking change:
state that explicitly.

**16. HARDENING REPORT — Session Irregularities**

In the PR description, under `#### Session Irregularities`, report per the threshold (interfered with following this
prompt **and** cost ≳10 min / blocked progress / required a workaround **and** would recur for the next worker):
`Category | Symptom | Impact | Workaround | Hardening candidate`. If nothing meets it, write `None significant`.
