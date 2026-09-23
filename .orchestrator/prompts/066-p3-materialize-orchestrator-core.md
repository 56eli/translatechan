# Task 066 — P3: Materialize the orchestrator core doc, its sha256 anchor, and `bin/orchestrator-check`

## 0. FETCH AND VERIFY

You should already have this file at `/tmp/task.md`. If not, fetch it:

    git fetch --depth 1 origin +arena/01a0ca9d-translatechan:refs/remotes/origin/_orch
    git show refs/remotes/origin/_orch:.orchestrator/prompts/066-p3-materialize-orchestrator-core.md > /tmp/task.md

Read it from `/tmp`. Rules:

- Do NOT use `origin/arena/01a0ca9d-translatechan` (single-branch clones do not create that ref).
- Do NOT use `FETCH_HEAD` (your next fetch of `main` overwrites it).
- Do NOT `git checkout` orchestrator paths into the worktree. Read with `git show` into `/tmp` only.
- Never commit this file. Never push to the orchestrator branch.
- If the file is empty, or its first line is not
  `# Task 066 — P3: Materialize the orchestrator core doc, its sha256 anchor, and \`bin/orchestrator-check\``,
  HALT and report.

### Premise measured at `b8472bd69568e961c89935bd47e8a3cc83265270`

```bash
git fetch --depth 50 origin +main:refs/remotes/origin/main
git merge-base --is-ancestor b8472bd69568e961c89935bd47e8a3cc83265270 origin/main \
  && echo "premise intact" || echo "PREMISE MOVED — re-verify before working"
```

If this work is already present on `main`, **HALT AND REPORT**.

### Mandatory branch note

PR **#115** on `fix/p0-regreen-main-17-docs` is **out of bounds**: never push to it, check it out,
rebase onto it, cherry-pick from it, comment on it, close or merge it. Branch from `origin/main` only.

---

## 1. TASK TITLE AND SCOPE

Create the three artifacts the operating canon requires but which **do not exist in this repository**:
a canonical core document, a sha256 anchor pinning it, and a verifier that checks the two agree.
**ONE pull request.**

`main` is GREEN and must stay green. No corpus, data, or gate behaviour changes.

---

## 2. REQUIRED READING ORDER

1. `docs/PROJECT_STATE.md` — invariants and rulings; note how the tracker documents conventions.
2. `AGENTS.md` — the agent contract; your new doc must not contradict it.
3. `GATE.md` — the gate contract, and the house style for a normative document.
4. `OPERATIONS.md` — the sole place documenting workflow/CI policy.
5. `.github/workflows/quality.yml` — **read only**, to see what CI runs. Never edit it.

Orienting commands:

```bash
ls -la; cat GATE.md | head -40; grep -rn 'orchestrator' --include='*.md' . | grep -v '^\./\.orchestrator' | head
```

---

## 3. PROJECT CONTEXT AND OWNER VISION

This repository is run by an orchestrator/agent split: an orchestrator authors work orders and
reviews results, agents do the work. That split is currently **unwritten** — it lives only in session
memory, which does not survive. A P0 defect occurred when an orchestrator self-performed a task and
opened its own pull request; nothing in the repository said it must not.

The canon (ORCHESTRATOR CORE v4.9.0) also specifies a **sha256 anchor**: the core document's hash is
recorded, and a missing or mismatched anchor is treated as a mismatch — i.e. the operating rules must
be verifiably the ones everyone agreed to, not silently edited.

You are writing the constitution down and making it checkable.

---

## 4. CONFIRMED FACTS — measured on `b8472bd`

- `orchestrator/` does **not** exist. `bin/` does **not** exist. Verified:
  `ls orchestrator/ bin/` → `No such file or directory`.
- The only orchestrator path present is `.orchestrator/` (leading dot) — the orchestrator's **private**
  working area.
- **`.orchestrator/local/ORCHESTRATOR_STATE.md` is currently committed on `main`** (9,054 bytes,
  landed in `f0a768b`, 2026-09-22). That is a predecessor's private working state leaked into the
  shared tree. **Report it; do not delete it** — see §6.4.
- The repository is Python-3-stdlib-only with no package manifest; CI pins Python 3.12.

**Invariants:**
- Never edit a checker to make a gate pass.
- Never edit `.github/workflows/*` — owner approval required. This task does **not** have it.
- `sessions/` is append-only; `docs/` data+bundle files are generated.
- Do not change any existing gate's behaviour, exit code, or check count.

---

## 5. CORE OBJECTIVE

Make the operating rules **present in the repository and verifiable**, so the next orchestrator
inherits them from the tree rather than from a conversation.

---

## 6. EXACT DELIVERABLES

### 6.1 `orchestrator/ORCHESTRATOR CORE v4.9.0 — GENERAL PURPOSE.md`

Note the exact filename: spaces, an em dash, and `.md`. Create it at that path.

It must state, at minimum, as normative rules:

- **The orchestrator never authors or opens pull requests.** No emergency exception.
- **The orchestrator never merges and never closes any pull request**, including one it wrongly opened.
- **Task work is always dispatched to an agent, never self-performed.**
- **When `main` is red:** diagnose → record → dispatch expedited → notify the owner → **wait**.
- **Publish procedure:** before publishing any work order, re-measure `main`, record the measured tip
  SHA in the prompt, include a staleness/halt check, and list open PRs touching the same paths.
- **Review procedure:** verify a delivery independently (fresh clone, re-run the gates, re-run any
  mutation proof) rather than trusting a pasted transcript.
- **Merged-before-reviewed:** if a PR merges before review, run a retrospective health check and
  record the verdict; never re-merge.
- One document per PR for independent evidentiary claims.
- The orchestrator's private state lives under `.orchestrator/` and **must not** be committed to
  shared branches.

Write it as a normative document in this repository's voice — imperative, specific, reasoned. Each
rule gets a one-line rationale; a rule whose reason is unwritten gets rationalised away later. Do not
pad it into a style guide; it is a constitution, not an essay.

### 6.2 The sha256 anchor

Create `orchestrator/CORE_SHA256` containing the sha256 of the core document and its filename, in
`sha256sum` output format so it verifies with `sha256sum -c`:

```bash
cd orchestrator && sha256sum "ORCHESTRATOR CORE v4.9.0 — GENERAL PURPOSE.md" > CORE_SHA256
```

Confirm `sha256sum -c CORE_SHA256` passes from the `orchestrator/` directory. Handle the spaces and
the em dash in the filename correctly — quote paths everywhere.

### 6.3 `bin/orchestrator-check`

An executable (`chmod +x`, `#!/usr/bin/env python3`, stdlib only) that:

- Recomputes the core doc's sha256 and compares it to the anchor.
- Exits **0** when they match, printing a one-line confirmation including the short hash.
- Exits **non-zero** with a clear diagnostic when they differ.
- **Treats a missing core document or a missing anchor as a mismatch** (non-zero), never as "nothing
  to check" — this is explicit canon and the main thing to get right.
- Works regardless of the current working directory: resolve paths relative to the script location.
- Prints nothing sensitive and reads nothing outside the repository.

Document its exit codes in the core doc or `OPERATIONS.md`, consistent with how `GATE.md` documents
exit codes.

### 6.4 Report the leaked orchestrator state — do NOT delete it

`.orchestrator/local/ORCHESTRATOR_STATE.md` is committed on `main`. Deleting it is a judgement call
with history implications and is **not** in your scope. Instead:

- Add `.orchestrator/` to `.gitignore` **only if** doing so does not untrack the existing file or
  change any gate result — verify with `git status` and a full gate run, and report exactly what you
  observed.
- State the situation plainly in the PR description: what is committed, when it landed, and that
  removal is an owner decision.
- If adding the ignore rule has any side effect at all, **do not add it** — report instead.

### 6.5 Tracker

Add a short entry to `docs/PROJECT_STATE.md` recording that the orchestrator core is now materialized
and anchored, and how to verify it. Match the file's existing bullet style; do not restructure.

---

## 7. SUB-TASKS AND CHECKPOINTS

1. Read §2; run the §1 premise check; confirm §4 facts. → checkpoint
2. Write 6.1. → checkpoint
3. Generate 6.2; verify `sha256sum -c` passes. → checkpoint
4. Write 6.3; test all four paths (match / mismatch / missing doc / missing anchor). → checkpoint
5. 6.4 investigation and 6.5 tracker entry. → checkpoint
6. Full §14 gate run. → checkpoint
7. ONE PR per §15.

---

## 8. BRANCH AND TARGET

- **Base branch:** `main` — never the orchestrator branch.
- **Target branch:** `feat/orchestrator-core-anchor` ← **this exact name, fresh.**
- **Orchestrator branch:** `arena/01a0ca9d-translatechan` — fetch source only.
- **Dependencies:** none.
- **Forbidden branch:** `fix/p0-regreen-main-17-docs`.

```bash
git fetch --depth 50 origin +feat/orchestrator-core-anchor:refs/remotes/origin/_resume
git checkout -B feat/orchestrator-core-anchor refs/remotes/origin/_resume
```

If no remote ref is found, the branch is new:

```bash
git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B feat/orchestrator-core-anchor origin/main
```

`couldn't find remote ref` here is **not** an environment failure. Do not commit on `main`.

---

## 9. WORK PERSISTENCE AND PUSH CADENCE

Checkpoint after each §7 sub-task, before any risky operation, before any idle pause or end of turn,
and once at the end. **Your session can expire without warning; unpushed work is lost work.**

```bash
git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin feat/orchestrator-core-anchor
```

Conventional Commits (`fix:`, `feat:`, `chore:`, `docs:`). Never a bare `wip:`.

- ONE pull request at the end, when the gates pass. No draft PR first.
- **Never edit the same file with two parallel write calls** — a race in task 063 silently dropped a
  mandated edit. Sequential writes; verify on disk before committing.
- **Before opening the PR, review the whole branch diff against `origin/main`.**
- Sync rule: rebase onto `origin/main` only before your first push; after that
  `git fetch --depth 50 origin +main:refs/remotes/origin/main && git merge --no-edit origin/main`.
- Never force-push unless instructed, then only `--force-with-lease`.
- On merge conflict or `refusing to merge unrelated histories`: **halt and report.**
- Push rejected non-fast-forward: halt and report the raw rejection. Do not `git pull`. Do not force-push.
- Auth failure (HTTP 401/403 "Bad credentials"): commit locally, then `ask_user` including the option
  verbatim "I reconnected GitHub — retry now", at most once per expiry event.

---

## 10. TECHNICAL REQUIREMENTS

Python 3.11+ stdlib only; no new dependencies. `bin/orchestrator-check` must be executable and run
under CI's Python 3.12. Quote every path — the core filename contains spaces and a non-ASCII em dash;
an unquoted path is the single most likely bug in this task. UTF-8 throughout, LF endings, trailing
newline on every file.

---

## 11. SAFETY AND COMPATIBILITY RULES

- No corpus, `data/`, or `sessions/` changes whatsoever.
- No change to any existing gate's behaviour or check count — the suite stays at **146+**.
- Bundle hash must be **unchanged**: `b68eb436ac8c847a0f92ec0dea8d0f74597aa8ee79778b5e5dfe8920bb9cdba7`.
- Never edit `.github/workflows/*`. Do not wire the new check into CI — that needs owner approval;
  recommend it in the PR instead.

---

## 12. CLEANUP RULES

No scratch files; `git status` clean before the PR; no commented-out remnants; no stray test
fixtures left in `orchestrator/` or `bin/`.

---

## 13. STRICT BOUNDARIES / OUT OF SCOPE

Do **not**: edit or delete `.orchestrator/local/ORCHESTRATOR_STATE.md` · wire the checker into CI ·
edit workflows · change repository settings · touch corpus or gates · rewrite `AGENTS.md`, `GATE.md`
or `OPERATIONS.md` beyond the one documented exit-code addition · interact with PR #115. If you
believe an out-of-scope change is required, **halt and report**.

---

## 14. QUALITY CHECKS

```bash
python3 -m py_compile scripts/*.py                        # exit 0
python3 scripts/validate_data.py                          # exit 0, corpus=17
python3 scripts/build_data_bundle.py                      # exit 0
python3 scripts/test_source_preservation.py               # exit 0, "0 unauthorized changes"
python3 scripts/test_source_review_rules.py               # exit 0, 146+ checks
node scripts/smoke_test.mjs                               # exit 0
git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json   # exit 0
```

Determinism — both builds must print the **unchanged** hash
`b68eb436ac8c847a0f92ec0dea8d0f74597aa8ee79778b5e5dfe8920bb9cdba7`.

**Anchor proof — mandatory, four cases, paste all four transcripts:**

1. Match → `bin/orchestrator-check` exits **0**.
2. Core doc modified by one character → exits **non-zero** with a clear diagnostic.
3. Core doc absent → exits **non-zero** (missing is a mismatch, not a skip).
4. Anchor absent → exits **non-zero** (missing is a mismatch, not a skip).

Also show it works from a different working directory (e.g. run it from `/tmp`). Revert all four
mutations; `git status` clean.

---

## 15. PR DESCRIPTION REQUIREMENTS

- **Summary** — what did not exist, what now does, and why it matters (the P0 that motivated it).
- **The three artifacts**, each with its path and purpose.
- **Anchor proof** — all four §14 transcripts verbatim, plus the run from another directory. Without
  these the PR is incomplete.
- **Gate transcript** — the seven §14 commands with real output, plus both determinism hashes,
  stated as unchanged.
- **The §6.4 finding** — the committed orchestrator state file: what, when, and that removal is an
  owner decision. Say explicitly whether you added a `.gitignore` rule and what you observed.
- **Recommendation** — that `bin/orchestrator-check` be wired into CI, flagged as needing owner
  approval and explicitly **not** done here.
- **Explicit statement** that no corpus byte, no `sessions/` file, no gate behaviour and no bundle
  hash changed.
- **Breaking changes:** state explicitly.
- Every file named must appear in the changed-file list.
- Include `#### Session Irregularities` per §16.

---

## 16. HARDENING REPORT — Session Irregularities

Under `#### Session Irregularities`, report only irregularities meeting **all three** thresholds:
(a) it interfered with following this prompt, **and** (b) it cost >~10 min, blocked progress, or
required a workaround, **and** (c) it reveals a hidden repo/session invariant or prompt blind spot
that would recur for the next worker.

If none: `None significant`.

Otherwise one bullet each, 3–6 lines total:
`Category | Symptom (1 sentence) | Impact | Workaround | Hardening candidate`

Categories: Environment, Prompt, Repository, Tooling. No padding. This report does not affect the
merge verdict unless it reveals a missing deliverable.
