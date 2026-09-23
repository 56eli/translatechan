# Task 065 — P2: Tier2 authenticity — Fayan (`fayan_yulu`), one document only

## 0. FETCH AND VERIFY

You should already have this file at `/tmp/task.md`. If not, fetch it:

    git fetch --depth 1 origin +arena/01a0ca9d-translatechan:refs/remotes/origin/_orch
    git show refs/remotes/origin/_orch:.orchestrator/prompts/065-p2-tier2-fayan-authenticity.md > /tmp/task.md

Read it from `/tmp`. Rules:

- Do NOT use `origin/arena/01a0ca9d-translatechan` (single-branch clones do not create that ref).
- Do NOT use `FETCH_HEAD` (your next fetch of `main` overwrites it).
- Do NOT `git checkout` orchestrator paths into the worktree. Read with `git show` into `/tmp` only.
- Never commit this file. Never push to the orchestrator branch.
- If the file is empty, or its first line is not
  `# Task 065 — P2: Tier2 authenticity — Fayan (\`fayan_yulu\`), one document only`,
  HALT and report.

### Premise measured at `b8472bd69568e961c89935bd47e8a3cc83265270`

`main`'s tip when this was written (`Merge pull request #116`). Before any work:

```bash
git fetch --depth 50 origin +main:refs/remotes/origin/main
git merge-base --is-ancestor b8472bd69568e961c89935bd47e8a3cc83265270 origin/main \
  && echo "premise intact" || echo "PREMISE MOVED — re-verify before working"
```

If `main` moved, re-verify §4 before changing anything. If this work is already present, **HALT AND REPORT**.

### Mandatory branch note

PR **#115** on branch `fix/p0-regreen-main-17-docs` is **out of bounds**: never push to it, check it
out, rebase onto it, cherry-pick from it, comment on it, close or merge it. Branch from `origin/main`
only, onto the branch named in §8.

---

## 1. TASK TITLE AND SCOPE

Resolve the authenticity status of **exactly one** corpus document, `fayan_yulu`, by applying the
project's R-A/R-B policy, and record the decision with evidence. **ONE document, ONE pull request.**

`main` is GREEN and must stay green. This is not a repair.

**Why one document per PR:** Ruling 3 territory. Each authenticity decision is an independent
evidentiary claim; bundling them makes a reviewer accept or reject several claims with one verdict.
Guiyang is task 064 and is explicitly **not** yours.

---

## 2. REQUIRED READING ORDER

1. `docs/PROJECT_STATE.md` — invariants and the numbered Rulings. Read Rulings 2, 3 and the
   **R-A/R-B/R-C policy** (line ~32) before anything else.
2. `GATE.md`, `AGENTS.md` — gate contract and repository contract.
3. `sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json` — `documents.fayan_yulu`.
4. `scripts/collate_corpus.py` — how collation is run and replayed.
5. `scripts/source_review.py`, `scripts/w1_evidence.py` — how status codes are derived.
6. A prior worked example of the same decision: `git log --oneline --all -- data/corpus/` and the
   047 Baizhang/Huangbo authenticity pattern referenced in the tracker.

---

## 3. PROJECT CONTEXT AND OWNER VISION

This corpus claims its Chinese text is real, sourced, attributable primary material. Where the claim
cannot be supported it must be **labelled**, not quietly dropped and not repaired with invented text.
**Representation ≠ completion.** A clearly-labelled project retelling is honest and acceptable; an
unlabelled one is the single worst defect this repository can ship.

---

## 4. CONFIRMED FACTS — measured on `b8472bd`, verify don't rediscover

From `data/corpus_manifest.json` → `items[]` (a **list**, not a dict; key is `key`):

```json
{"key": "fayan_yulu", "title": "Fayan Yulu & Ten Rules (法眼十規論)", "cbeta": "T1991",
 "completion_status": "excerpt_seed", "source_review_status": "partial_or_failed_w1_collation"}
```

From the authoritative register, `documents.fayan_yulu`:

- `witness: ["T47n1991"]`
- `content_fields_total: 11`, **`content_fields_collated: 1`** → **1/11 verbatim (≈9%)**
- `summary: {"EXACT": 4, "NOT_FOUND": 11, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 3}`
- `content_summary: {"EXACT": 1, "NOT_FOUND": 9, "SHORT_UNMATCHED": 1}`
- `metadata_summary: {"EXACT": 3, "NOT_FOUND": 2, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 2}`
- `.title_zh` is `TITLE_COMPOSITE` at `sim 0.65` — corpus `金陵清涼院文益禪師語錄與宗門十規論`
  vs witness `金陵清涼院文益禪師語錄` plus remainder `與宗門十規論`.

**Read the EXACT counts carefully.** Fayan has 4 `EXACT` in the *overall* summary but only **1** of
those is a content field — the other 3 are metadata. A careless reading of `summary` inflates the
verbatim rate fourfold. The bar is measured on **content** fields: `content_fields_collated /
content_fields_total` = 1/11.

**The 80% bar:** R-A (re-key verbatim) requires a pinned witness that actually carries the text.
1/11 ≈ 9% is far below it. **On the evidence above the expected outcome is R-B (label as project
retelling).** You must still verify this yourself — but do not manufacture an R-A.

**A partial-carrier trap specific to Fayan.** One content field *does* collate EXACT, and the title
is a composite whose first half the witness carries. That is not a licence to re-key the document
piecemeal into a half-verbatim, half-retold text with no way for a reader to tell which sentence is
which. If you believe per-field re-keying is justified, **halt and report** — mixed provenance
inside one document is an owner decision, not yours.

**Invariants:**
- Never edit a checker to make a gate pass.
- `sessions/` is append-only. New dated evidence only; never edit or delete an existing record.
- `docs/` data+bundle files are generated; never hand-edited. `docs/PROJECT_STATE.md` prose is fine.
- Never edit `.github/workflows/*`.
- **Ruling 3:** never re-point a withdrawn or unsupported claim at an unverified candidate. If
  `T1989`/`T1990` do not carry the text, you may **not** go shopping for an X-series text that might.
  Label it.
- **Ruling 2:** `630` stays the historical register's designated figure. Do not touch
  `w1_evidence.py` `FIXED_METADATA`.
- **OUT-OF-CBETA sourcing is human-only (Ruling 4).** If the honest answer needs a non-CBETA source,
  that is R-C: stop and report, do not source it yourself.

---

## 5. CORE OBJECTIVE

Determine, on evidence, whether `fayan_yulu` qualifies for **R-A** or **R-B**, apply that outcome
to exactly one document, and leave behind the evidence that justifies it.

---

## 6. EXACT DELIVERABLES

### 6.1 Determination, with evidence

Re-run the collation for this document and record real output:

```bash
python3 scripts/collate_corpus.py --reproduce sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json --print-refs
# then the collation itself per GATE.md / the register's reproduction block
```

State plainly: content fields total, collated, and the resulting verbatim rate. Apply the bar:
**≥80% ⇒ R-A; below ⇒ R-B.** Show the arithmetic.

### 6.2a If R-B (expected)

- Add/extend the document's `coverage_note` and/or `editorial_note` in `data/corpus/fayan_yulu.json`
  so a reader is told, in plain language at the point of reading, that the Chinese text is a
  **project retelling** which the pinned witness does not carry verbatim, naming `T47n1991` and the
  measured rate. If you keep the one EXACT content field as verbatim, the note must say precisely
  which part is sourced and which is retold — an unqualified blanket label over mixed content is
  itself a false claim.
- Follow the existing note conventions exactly: precedence `recension_note` → `editorial_note` →
  `cbeta_note`, one line each, and `coverage_note` is the document-scale ledger rendered as the
  "Reading" row. Check `NOTE_RENDER_EXEMPTIONS` before inventing anything.
- Update `items[]` for `fayan_yulu` in `data/corpus_manifest.json` only if a status code becomes
  inaccurate as a result. Codes come from the existing closed sets — do not invent a new code.
- The note census in `docs/PROJECT_STATE.md` (line ~28) will shift; update the counts to your
  measured values.

### 6.2b If R-A (only on evidence)

Re-key the content verbatim from the pinned witness, one field at a time, with the collation proving
each. Do not touch translations. Report before proceeding — an unexpected R-A is a finding.

### 6.3 Evidence record — new file, append-only

`sessions/TIER2_FAYAN_2026-09-23.md`: the determination, the measured rates, the commands run with
real output, the resulting label text, and an explicit statement of which Rulings constrained the
outcome. Never edit an existing `sessions/` file.

### 6.4 Tracker

Tick the Fayan half of the 059 line in `docs/PROJECT_STATE.md` (line ~69) and update the Active
Milestone to name the next lane. Do **not** tick Guiyang — that is task 064.

**Likely conflict:** task 064 edits the same line for Guiyang. If it merged first you will hit a
conflict here — resolve it by keeping **both** ticks. If the line already reads as fully done,
re-read it before assuming your edit is unnecessary.

---

## 7. SUB-TASKS AND CHECKPOINTS

1. Read §2; run the §1 premise check; verify §4 facts. → checkpoint
2. Re-run collation; compute the rate; make the determination. → checkpoint
3. Apply 6.2a or 6.2b. → checkpoint
4. Write 6.3; update 6.4. → checkpoint
5. Full §14 gate run. → checkpoint
6. ONE PR per §15.

---

## 8. BRANCH AND TARGET

- **Base branch:** `main` — never the orchestrator branch.
- **Target branch:** `fix/tier2-fayan-authenticity` ← **this exact name, fresh.**
- **Orchestrator branch:** `arena/01a0ca9d-translatechan` — fetch source only.
- **Dependencies:** none. Task 064 (Guiyang) is a sibling; do not do its work.
- **Forbidden branch:** `fix/p0-regreen-main-17-docs`.

```bash
git fetch --depth 50 origin +fix/tier2-fayan-authenticity:refs/remotes/origin/_resume
git checkout -B fix/tier2-fayan-authenticity refs/remotes/origin/_resume
```

If that fetch finds no remote ref, the branch is new:

```bash
git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B fix/tier2-fayan-authenticity origin/main
```

`couldn't find remote ref` here is **not** an environment failure. Do not commit on `main`.

---

## 9. WORK PERSISTENCE AND PUSH CADENCE

Checkpoint after each §7 sub-task, before any risky operation, before any idle pause or end of turn,
and once at the end. **Your session can expire without warning; unpushed work is lost work.**

```bash
git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin fix/tier2-fayan-authenticity
```

Conventional Commits (`fix:`, `feat:`, `chore:`, `docs:`). Never a bare `wip:`.

- ONE pull request at the end, when the gates pass. No draft PR first.
- **Never edit the same file with two parallel write calls** — a race in task 063 silently dropped a
  mandated edit. Sequential writes to one file; verify on disk before committing.
- **Before opening the PR, review the whole branch diff against `origin/main`**, not just your last
  commit.
- Sync rule: rebase onto `origin/main` only before your first push; after that
  `git fetch --depth 50 origin +main:refs/remotes/origin/main && git merge --no-edit origin/main`.
- Never force-push unless instructed, then only `--force-with-lease`.
- On merge conflict or `refusing to merge unrelated histories`: **halt and report.**
- Push rejected non-fast-forward: halt and report the raw rejection. Do not `git pull`. Do not force-push.
- Auth failure (HTTP 401/403 "Bad credentials"): commit locally, then `ask_user` including the option
  verbatim "I reconnected GitHub — retry now", at most once per expiry event.

---

## 10. TECHNICAL REQUIREMENTS

Python 3 stdlib only; no new dependencies. Match surrounding JSON style (2-space indent,
`ensure_ascii=False`, trailing newline). Chinese text is never transcoded, normalised, or
"tidied" — byte fidelity or nothing.

---

## 11. SAFETY AND COMPATIBILITY RULES

- Exactly **one** corpus document may change: `data/corpus/fayan_yulu.json`.
- Never weaken, delete or skip a check. The suite must stay at **146+**.
- Do not change `BASE_COMMIT`, `AUTH_REGISTER`, or `DECLARED_NEW_CORPUS`.
- If the preservation gate reports an unauthorized change, **stop** — that means you edited a
  protected corpus byte. Report; do not add an allowlist entry to silence it.

---

## 12. CLEANUP RULES

No scratch files; `git status` clean before the PR; no commented-out remnants.

---

## 13. STRICT BOUNDARIES / OUT OF SCOPE

Do **not**: touch `guiyang_yulu` (task 064) · touch any other corpus document · source anything outside
CBETA (Ruling 4, human-only) · re-point a withdrawn claim (Ruling 3) · change `630` or
`FIXED_METADATA` (Ruling 2) · alter workflows or repository settings · interact with PR #115 ·
refactor unrelated code. If you believe an out-of-scope change is required, **halt and report**.

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

Determinism — build twice, hashes must match each other:

```bash
python3 scripts/build_data_bundle.py && sha256sum app_data.js
python3 scripts/build_data_bundle.py && sha256sum app_data.js
```

The bundle hash **will** change if you changed corpus content — that is expected here, unlike a
hardening task. Report the old and new hash and byte size, and state which document caused it.

---

## 15. PR DESCRIPTION REQUIREMENTS

- **Summary** — the determination and the evidence for it, in one paragraph.
- **The arithmetic** — content fields total/collated, rate, and the bar applied.
- **Which Rulings constrained the outcome** and how.
- **The exact label text** added, quoted, plus where a reader encounters it.
- **Gate transcript** — the seven §14 commands with real output, plus both determinism hashes and
  the bundle-hash delta with its cause.
- **Explicit statement** of which corpus documents changed (must be exactly one) and that no
  `sessions/` file was edited (only added).
- **Breaking changes:** state explicitly.
- Describe only this PR's changes; every file named must appear in the changed-file list.
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

Categories: Environment, Prompt, Repository, Tooling. No padding with trivial retries. This report
does not affect the merge verdict unless it reveals a missing deliverable.
