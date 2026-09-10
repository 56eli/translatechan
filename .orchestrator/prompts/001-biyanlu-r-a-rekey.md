# TASK 001 — Re-key `biyanlu_cases` to its claimed T2003 witness per the W1 collation register (Wave 1, document 2)

## 0. FETCH AND VERIFY

Your instructions live on the orchestrator branch. You are reading them from there:

```bash
git fetch --depth 1 origin +arena/01a08d90-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/001-biyanlu-r-a-rekey.md > /tmp/task.md
```

Rules:

- Do NOT use `origin/arena/01a08d90-translatechan` (a single-branch clone will not have
  that tracking ref) and do NOT use `FETCH_HEAD` (a later fetch of `main` overwrites it).
- Do NOT `git checkout` or `git show` any `.orchestrator/` path into your worktree. Read
  orchestrator files with `git show <ref>:<path> > /tmp/...` only.
- Write all scratch files outside the repository (`/tmp`). Never commit anything from
  `/tmp`. Never commit this prompt file.
- If `/tmp/task.md` is empty, or its title does not match this task ("biyanlu_cases",
  "T2003", "Wave 1, document 2"), HALT and report — do not improvise.
- Never push to the orchestrator branch `arena/01a08d90-translatechan`.

## 1. TASK TITLE AND SCOPE

Re-key the 42 W1-flagged **source-content** fields of `data/corpus/biyanlu_cases.json`
to the document's claimed CBETA T2003 witness (the Blue Cliff Record / 佛果圓悟禪師碧巖錄),
mechanically from verified reference text, and close out document 2 of Wave 1 in the
owner-adopted R-A remediation program. Complete this in **ONE pull request**.

Out of scope for this PR (deliberately): the 86 flagged `title_zh` metadata fields
(separate composite-title plan item), English translation fields, any source-review
status change, any new evidence register, other corpus documents, and app/CI changes.
See sections 6 and 13.

## 2. REQUIRED READING ORDER

Read these before changing anything, in this order:

1. `AGENTS.md` — the agent contract: project identity, the 5 quality gates, public
   scope, data contract, honest-disclosure core.
2. `.orchestrator/REMEDIATION_PLAN.md` — §1 (the adopted R-A/R-B/R-C rules, including
   the per-class handling rules for DIVERGENT / NOT_FOUND / MINOR fields and the
   Wave-0 dialogue-marker & variant policy), §2 (Wave 1 ordering; the `biyanlu_cases`
   work-order line).
3. `.orchestrator/STATE.md` — the "W1 remediation started" paragraph and the
   REMEDIATION task-queue line: the wumenguan precedent (PR #29) and the recorded
   PR #23 DO-NOT-MERGE failure mode.
4. `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` — the authoritative W1 evidence
   report (method, verdict).
5. `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` → `documents.biyanlu_cases`
   — **your work-order**. `flagged[]` entries carry `path` (JSON pointer), `class`,
   `sim`, `ref`, `ref_window` (best reference window — a locator aid, NOT a text
   source). 128 flagged entries total = 42 content + 86 `title_zh` metadata.
6. `scripts/collate_corpus.py` — docstring: exact reference acquisition + digest
   verification procedure, class definitions, harness usage.
7. `data/corpus/biyanlu_cases.json` — the document you will edit (top-level
   `coverage_note`, `zh_chars`, 100 `cases[]` with `pointer_zh`, `dialogue[]`,
   `verse_zh`, `commentary_zh` and their pinyin/translation siblings).
8. `data/corpus/wumenguan.json` — the post-PR #29 state: **the pattern to mirror**
   (re-keyed zh style, syllable-separated pinyin style, the epilogue `editorial_note`
   R-B label, the honest `coverage_note` template).
9. `scripts/test_source_preservation.py` — `ALLOWED_CHANGES` (exact-JSON-pointer
   allowlist; you must extend it) and its focused nested-`coverage_note` regression.
10. `scripts/smoke_test.mjs` — the biyanlu assertions you must keep green (search
    query `見面便見` around line 704; cases 4/6/8 pilot content, `第N則` navigation,
    collection-specific `圜悟評唱 / Yuanwu Commentary` and `雪竇頌 / Xuedou Verse`
    labels around lines 755–775; `100/100 cases` representation and `is_complete ===
    false` around lines 415–421).
11. `data/corpus_manifest.json` → item `biyanlu_cases` — you will NOT change it; read
    it to confirm the statuses you must leave untouched.

## 3. PROJECT CONTEXT

Fake Chan Factory (`56eli/translatechan`) is a zero-backend static GitHub Pages reader
for Classical Chinese Chan literature. No runtime dependencies; strict CSP
(`script-src 'self'`). Fixed pipeline — all five generated artifacts must stay in
lockstep:

```
data/*.json → scripts/validate_data.py → data/project_metrics.json
            → scripts/build_data_bundle.py → root assets + byte-identical docs/ mirror
            → GitHub Pages
```

`scripts/validate_data.py` is the enforced spec (schema, semantics, per-file
`zh_chars` ↔ computed content CJK count, doc-truthfulness rules over README/HANDOFF/
AUDIT/ROADMAP/index.html, W1 evidence merge). `scripts/test_source_preservation.py`
byte-compares `data/corpus/` against pinned base commit `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43`
and permits only exact allowlisted JSON pointers; it is invoked by the smoke test, so
CI covers it without workflow changes.

W1 (full-corpus collation vs CBETA, 2026-09-09/10) found 630 flagged source fields
across the corpus; the authoritative record is the 2026-09-10 correction register.
Remediation runs under the owner-adopted hybrid policy (R-A re-key from authoritative
witness / R-B keep-with-honest-label / R-C quarantine), one document per PR.
Document 1 (`wumenguan`, 62 fields) merged as PR #29 on 2026-09-10. **This task is
document 2 (`biyanlu_cases`).**

The repo's PR template contains a scoreboard section: until the (later, separate)
scoreboard-removal PR, fill it minimally and honestly — list affected aspects, do not
touch any `user_score` field, do not edit `.github/workflows/*`, and state the
`repo_ready` gate status unchanged.

## 4. CONFIRMED FACTS AND CONSTRAINTS

Treat these as true without re-deriving:

- `biyanlu_cases` = 佛果圓悟禪師碧巖錄, `cbeta_id` **T2003** (Taishō vol 48), 100 cases.
  Manifest item: `completion_status: partial_selected_witness`,
  `source_review_status: partial_or_failed_w1_collation`. **Neither changes in this PR.**
- Authoritative register facts for this document (2026-09-10 correction register):
  128 flagged = **42 content fields** (12 DIVERGENT, 7 NOT_FOUND, 22 MINOR,
  1 SHORT_UNMATCHED) + 86 `title_zh` metadata flags (71 SHORT_UNMATCHED, 11 NOT_FOUND,
  4 TITLE_COMPOSITE). 395 content fields total; 353 already EXACT.
  Content fields are `dialogue[].zh`, `pointer_zh`, `verse_zh`, `commentary_zh`
  (`CONTENT_SOURCE_FIELDS` in `scripts/source_review.py`).
- The 42 content flags by class (paths in the register are 0-based; read the register
  itself as ground truth):
  - **DIVERGENT (12):** `.cases[0].dialogue[2]`, `.cases[1].pointer_zh`,
    `.cases[2].pointer_zh`, `.cases[2].dialogue[0]`, `.cases[14].dialogue[0]`,
    `.cases[17].dialogue[0]`, `.cases[30].dialogue[0]`, `.cases[50].dialogue[0]`,
    `.cases[81].dialogue[0]`, `.cases[87].dialogue[0]`, `.cases[97].dialogue[0]`,
    `.cases[98].dialogue[0]`
  - **NOT_FOUND (7):** `.cases[0].pointer_zh`, `.cases[2].pointer_zh`,
    `.cases[19].verse_zh`, `.cases[22].dialogue[0]`, `.cases[74].dialogue[0]`,
    `.cases[80].pointer_zh`, `.cases[95].dialogue[0]`
  - **SHORT_UNMATCHED (1):** `.cases[11].dialogue[1].zh`
  - **MINOR (22):** mostly `commentary_zh`; leave untouched (policy).
- Work-order specifics (REMEDIATION_PLAN §2, `biyanlu_cases` line): the witness has
  **no 垂示 (pointer)** for the case 1/2/80 pointers (verify each flagged pointer
  against the actual reference text — the register is the work-order, the reference
  text is the authority); case 19 verse; dialogue retouches (e.g. cases 22, 74);
  `cases[95].dialogue[0]` carries **editorial text embedded in the source field**
  (the parenthetical 「…三轉語之末「真佛屋裏坐」即在評唱所引。」) which must be moved to
  structured metadata. Also: the top-level `coverage_note` contains claims the
  register falsifies (e.g. "zh collated from CBETA TEI T48n2003") and must be
  re-written honestly.
- **Precedent — wumenguan PR #29 (merged 2026-09-10), mirror its shape exactly:**
  flagged fields re-keyed **verbatim** from the pinned CBETA reference text (NFKC,
  witness's own punctuation and variant glyphs — e.g. `。`-separated phrases, 竪/却/者/底);
  sibling pinyin rewritten **syllable-by-syllable, space-separated** (style:
  `Lǎo rén yún. Nuò mǒu jiǎ fēi rén yě. …`); non-witness text kept only with an
  additive `editorial_note` R-B label in structured metadata (epilogue pattern);
  **English translation fields left unchanged**; allowlist extended with exact
  pointers; `zh_chars` recomputed; metrics/bundle/docs mirror regenerated; before/after
  harness numbers in the PR description; `source_review_status` deliberately left
  unchanged pending the separate post-remediation evidence pass.
- **Failure mode — PR #23 (DO-NOT-MERGE, superseded):** truncated register `ref_window`
  fragments pasted as source text, one corrupted field, garbled pinyin, false
  "Complete" claim. `ref_window` tells you *where* in the witness to look; the text you
  write comes from the **full extracted reference file**, character for character.
- **Invariant (project moral core):** never generate source-looking Classical Chinese
  from model memory. If a field's text cannot be mechanically tied to the verified
  T2003 reference text, it is removed or R-B-labeled — never "reconstructed".
- The CBETA reference layer: extracted refs live outside the repo (21 MB, never
  committed). Acquire per the `scripts/collate_corpus.py` docstring (blobless
  sparse-checkout of `cbeta-org/xml-p5`), extract with `scripts/collate_refs.py`, and
  verify digests against `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`.

## 5. CORE OBJECTIVE

After this PR merges:

1. Every W1-flagged **content** field of `biyanlu_cases` is either (a) re-keyed
   verbatim to the T2003 witness (harness class EXACT/REWORDED), (b) removed because
   the witness demonstrably lacks the element, or (c) retained with an explicit
   project-authored R-B label in structured metadata and no witness attribution.
   Nothing implies witness authority without collation.
2. A fresh harness run shows **zero DIVERGENT and zero NOT_FOUND content flags**; the
   only remaining content flags are the 22 MINOR fields (acceptable residual per
   REMEDIATION_PLAN §1: "EXACT/MINOR fields: leave untouched") and, at most, the
   documented handling of the case-11 SHORT_UNMATCHED field. The 86 `title_zh`
   metadata flags remain (out of scope; metadata is measured separately and never
   blocks `collated_to_claimed_witness`).
3. `coverage_note` is an honest post-remediation disclosure (wumenguan template);
   `zh_chars` matches the validator's computed content CJK count; metrics, bundle, and
   `docs/` mirror are regenerated; the source-preservation allowlist admits exactly
   the pointers this PR changes and nothing else.
4. All five quality gates pass, the smoke test passes, and `source_review_status`
   remains `partial_or_failed_w1_collation` (status flips belong to the separate
   post-remediation evidence pass).

## 6. EXACT DELIVERABLES

Modify:

- `data/corpus/biyanlu_cases.json` — re-keyed content fields (12 DIVERGENT + the
  adjudicated NOT_FOUND/SHORT_UNMATCHED fields) with rewritten syllable pinyin;
  case-95 editorial text moved to a structured metadata field; any additive
  `editorial_note` R-B labels (wumenguan epilogue pattern); rewritten root
  `coverage_note`; recomputed root `zh_chars`.
- `scripts/test_source_preservation.py` — new `ALLOWED_CHANGES` entry
  `"data/corpus/biyanlu_cases.json"` listing **exactly** the JSON pointers this PR
  changes (every re-keyed `*_zh` and its `*_pinyin`, additive `editorial_note`
  pointers, removed-field pointers, `.coverage_note`, `.zh_chars`). Nothing else.
- `data/project_metrics.json` — regenerated (`python3 scripts/validate_data.py
  --write-metrics` after the data is correct).
- `app_data.js`, `docs/app_data.js`, `docs/data/corpus/biyanlu_cases.json`,
  `docs/data/project_metrics.json` — regenerated (`python3 scripts/build_data_bundle.py`).
- `.orchestrator/STATE.md` — canonical tracker: extend the "W1 remediation started"
  record with the document-2 outcome (fields re-keyed / removed / R-B-labeled,
  before→after flagged counts, PR number) and update the REMEDIATION task-queue line
  (Wave 1 progress: wumenguan done, biyanlu done (PR #N); **next: linji_yulu**).
- `.orchestrator/REMEDIATION_PLAN.md` — Wave 1 progress note for document 2 with the
  before/after collation summary and the per-class decisions taken.
- `scripts/smoke_test.mjs` — **only** the `見面便見` search-query string, and **only**
  if the re-keyed `.cases[0].pointer_zh` no longer contains it (choose a stable CJK
  substring that IS in the new text). No other smoke changes.
- `AUDIT.md` / `HANDOFF.md` / `README.md` — **only** where the validator's
  doc-truthfulness rules flag changed figures (e.g. corpus CJK totals); update the
  numbers to the regenerated metrics, nothing else.

Do NOT modify (see also section 13): `data/corpus_manifest.json`,
`scripts/validate_data.py`, `scripts/w1_evidence.py`, `scripts/collate_corpus.py`,
`scripts/collate_refs.py`, `app.js`, `app.css`, `index.html`, `.github/workflows/*`,
`.scoreboard/*`, any other corpus file, anything under `sessions/` (append-only
evidence), or the W1 registers/reports.

## 7. SUB-TASK BREAKDOWN AND CHECKPOINTS

Each sub-task ends with a checkpoint (section 9's single command). This list IS your
push schedule.

1. **Reference setup.** Acquire the CBETA XML P5 refs per the `collate_corpus.py`
   docstring; extract with `scripts/collate_refs.py` into `/tmp/refs`; verify digests
   against `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`. **`T48n2003` must
   verify byte-identical or you HALT and report** (a drifted/failed ref fetch is an
   environment failure — do not proceed from memory). Also run the "before" harness
   measurement: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py
   --doc biyanlu_cases --out /tmp/biyanlu_before.json` and record the class counts.
   → checkpoint
2. **Re-key the 12 DIVERGENT content fields** from the verified `/tmp/refs/T48n2003.txt`
   (verbatim, NFKC, witness punctuation/variants; locate each passage in the witness —
   `ref_window` is only a locator) and rewrite each sibling pinyin
   syllable-by-syllable. → checkpoint
3. **Adjudicate the 7 NOT_FOUND content fields.** For each: search the full reference
   text for the case's section. Passage present in witness → re-key verbatim + pinyin.
   Witness demonstrably lacks the element (e.g. no 垂示 for that case; the work-order
   says so for the case 1/2/80 pointers — confirm per field) → either remove the
   content or retain it with an additive `editorial_note` R-B label, no witness
   attribution. `.cases[95].dialogue[0].zh`: move the embedded parenthetical editorial
   text to structured metadata **regardless** of the re-key/keep choice. Record every
   per-field decision (action + one-line evidence). → checkpoint
4. **Case-11 SHORT_UNMATCHED + disclosures.** Handle `.cases[11].dialogue[1].zh`
   (≤6 CJK: verify against witness; re-key or apply the NOT_FOUND options). Rewrite
   root `coverage_note` on the wumenguan template (status line, post-re-key
   X/395 collate figure, documented residual with reasons, "Representation does not
   establish complete selected-witness status"). Recompute root `zh_chars` to the
   validator's expected computed content CJK count. → checkpoint
5. **Allowlist + preservation.** Extend `ALLOWED_CHANGES` with the exact
   `data/corpus/biyanlu_cases.json` pointers; run
   `python3 scripts/test_source_preservation.py` — must pass, including the focused
   nested-`coverage_note` regression. `git diff data/corpus/biyanlu_cases.json` must
   touch nothing outside the allowlisted pointers (no reformatting of untouched
   content — the preservation test byte-compares against the pinned base). → checkpoint
6. **Smoke + regenerate + gates.** Update the smoke search string if (and only if)
   required; run `node scripts/smoke_test.mjs` (all green, especially the biyanlu
   assertions in section 2 item 10); then `python3 scripts/validate_data.py
   --write-metrics` (zero errors, metrics regenerated) and
   `python3 scripts/build_data_bundle.py`; then the full five-gate suite (section 10)
   including the CI artifact check. → checkpoint
7. **Open the ONE pull request** with the full section-15 description. → checkpoint
8. **Canonical state + final.** With the PR number in hand, update
   `.orchestrator/STATE.md` and `.orchestrator/REMEDIATION_PLAN.md` (section 6);
   update AUDIT/HANDOFF/README figures only if the validator flagged them; run the
   five gates one last time; confirm a clean worktree; final push. → final checkpoint

## 8. BRANCH AND TARGET

- **Base branch:** `main` (never the orchestrator branch).
- **Target branch:** the non-default `arena/*` working branch your session is already
  on — the platform fixes it; do not switch branches. Only if you find yourself on
  `main`: `git fetch --depth 1 origin +main:refs/remotes/origin/main &&
  git checkout -B feature/biyanlu-r-a-rekey origin/main`. Do not commit on `main`.
- **Orchestrator branch:** `arena/01a08d90-translatechan` — fetch source only; never a
  base, never a target, never receive a push from you.
- **Dependencies:** none (base is current `main`; PR #29 is already merged).
- **Resuming:** fresh branch from main (no interrupted branch for this task).

## 9. WORK PERSISTENCE AND PUSH CADENCE

Checkpoint after each sub-task in section 7, before any long or risky operation (the
CBETA fetch, full test runs, the `main` sync), and at the end. Your session can expire
without warning; unpushed work is lost. There is no time-based rule — section 7 is
your push schedule.

A checkpoint is ONE command — first push, later pushes, and the nothing-to-push no-op
are all the same form. Do not run status/diff inspections around it:

```bash
git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin <branch>
```

- Open ONE pull request at the end (sub-task 7), when quality checks pass. Do not open
  a draft PR first.
- Checkpoint commits may be broken — that is expected. Never commit secrets.
- Never push to the orchestrator branch; never push anything from `/tmp`.
- **Sync rule:** rebase onto `origin/main` ONLY before your first push. After the
  first push, never rebase; integrate with:
  `git fetch --depth 50 origin +main:refs/remotes/origin/main && git merge --no-edit origin/main`
  then `git push origin HEAD`.
- Never force-push unless explicitly instructed, and then only with
  `--force-with-lease` (you will not be instructed to).
- On merge conflict: HALT and report the conflicting files. Same for a sync that
  refuses with "refusing to merge unrelated histories" — never pass
  `--allow-unrelated-histories` (raise fetch depth if needed).
- If a push or fetch fails with an authentication or network error, report it plainly
  and keep working locally; retry the push at the next checkpoint. Never claim work is
  pushed while a push has failed. Never modify credentials, remotes, or git config to
  work around it.
- Shallow-clone rules: never `git show <sha>:<path>` for objects you have not fetched;
  never rely on `FETCH_HEAD` across fetches; fetch with explicit `+src:dst` refspecs
  (as above) and read from the named ref. Do not unshallow.

## 10. TECHNICAL REQUIREMENTS

- **Language/style:** surgical JSON edits preserving the file's existing formatting
  (2-space indent, unescaped CJK, stable key order) — untouched content must stay
  byte-identical. Python (`json`) or careful direct edits are fine; verify with
  `git diff` that only allowlisted pointers changed. Re-keyed text style and pinyin
  style: mirror post-PR #29 `data/corpus/wumenguan.json` exactly (section 4).
- Additive `editorial_note` fields: short, factual, project-authored labels
  (wumenguan epilogue: "Project-authored verse; T48n2005 contains no epilogue. No
  witness attribution."). Validate them against `scripts/validate_data.py` — the
  schema must accept them (wumenguan's passed).
- **TEST_COMMAND (focused):** `python3 scripts/test_source_preservation.py` — covers
  the changed corpus file, allowlist exactness, and the focused regression; plus
  `python3 scripts/test_source_review_rules.py` (evidence-rule mutation matrix;
  must stay green — you do not touch evidence files).
- **Collation oracle (before/after):** `COLLATION_REFS=/tmp/refs python3
  scripts/collate_corpus.py --doc biyanlu_cases --out /tmp/biyanlu_after.json` —
  record class counts before (sub-task 1) and after (sub-task 6).
- **INTEGRATION_TEST_COMMAND:** `node scripts/smoke_test.mjs` — dependency-free
  renderer regression: five-room scope, five ledgers, search across schemas (incl.
  the biyanlu pointer query), biyanlu case 4/6/8 pilot content, navigation,
  collection-specific labels, and the preservation test invocation.
- **FULL_SUITE_COMMAND (all five gates, in order):**
  `python3 -m py_compile scripts/*.py` → `python3 scripts/validate_data.py` (zero
  errors; run WITHOUT `--write-metrics` at the end to prove committed metrics are
  current) → `python3 scripts/build_data_bundle.py` → `node scripts/smoke_test.mjs` →
  `diff -rq data docs/data`, plus the CI artifact check
  `git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css
  docs/app.js docs/data data/project_metrics.json` (must be clean after the rebuild).
- **COVERAGE_COMMAND:** not configured (the repository has no coverage tooling or
  threshold; do not invent one).
- **MUTATION_TEST_COMMAND:** not warranted — this is a mechanical re-key whose
  correctness oracle is the collation harness itself; the repository's existing
  mutation matrix (`scripts/test_source_review_rules.py`) covers the evidence rules
  and is run as focused.
- **LINT_COMMAND:** `python3 -m py_compile scripts/*.py` (the only configured lint;
  there is no JS linter).
- **BUILD_COMMAND:** `python3 scripts/build_data_bundle.py` (deterministic bundle;
  root assets + `docs/` mirror).
- **Browser suite:** `npm run test:browser` (Playwright) is an optional dev-only
  extra. If Chromium cannot be installed/run in your sandbox (a known
  `ECONNRESET` precedent), skip it and record the skip with the reason in the PR
  description — the smoke test is the required gate.

## 11. SAFETY AND COMPATIBILITY RULES

- **Must not break:** biyanlu rendering in the five-room reader (100/100 case
  representation string, client-side search, sparse prev/next `第N則` navigation,
  case 4/6/8 pilot content, collection-specific commentary/verse labels, the five
  always-visible ledgers); the validator's status derivation (biyanlu stays
  `partial_or_failed_w1_collation`; no `complete_selected_witness` claim anywhere);
  byte-identity of every other corpus file; the `docs/` mirror invariant; CSP /
  no-runtime-dependency constraints (you add no scripts, no inline code, no deps).
- **Must not change:** `data/corpus_manifest.json` statuses; the W1 evidence files
  under `sessions/`; the pinned base commit in
  `scripts/test_source_preservation.py` (`3cc7a8e…`); the existing wumenguan allowlist
  entries; English translation fields (any `*_en`, `translations.*`, including
  `ai_literal`) — where a re-keyed field's meaning materially diverges from the
  existing `ai_literal`, record it in the PR description as follow-up editorial work;
  do not re-render English in this PR.
- **Backward compatibility:** data + documentation only; no API surface change;
  `window.TranslateChan`, `TRANSLATECHAN_DATA`, and all `translatechan_*` localStorage
  keys untouched.
- **Honest disclosure is the project's moral core:** the finished data must never
  imply witness authority for text that did not collate. When in doubt between re-key,
  remove, and label, choose the option that preserves honesty and record the
  reasoning.

## 12. CLEANUP RULES

- By the final push: no commented-out code, temporary debug logs, ad-hoc test
  scripts, or TODO markers introduced by this PR; no changes to unrelated files; no
  reformatting outside the allowlisted pointers.
- Do not commit the fetched prompt file or anything written to `/tmp`
  (`/tmp/refs`, `/tmp/xmlp5`, `/tmp/biyanlu_*.json` stay out of the repo).
- Intermediate checkpoint commits are exempt from cleanup — clean up once, before
  the final push.

## 13. STRICT BOUNDARIES / OUT OF SCOPE

- Do NOT work the 86 `title_zh` metadata flags (composite-title splitting is a
  separate plan item that touches `app.js` and smoke guards).
- Do NOT change any English/translation field (follow-up editorial task).
- Do NOT flip any `source_review_status`, add a new evidence register, or touch
  `scripts/validate_data.py` / `scripts/w1_evidence.py` / `scripts/collate_*.py`
  (the post-remediation evidence pass is a separate task).
- Do NOT add rendering for `editorial_note` (structured metadata only, same as the
  wumenguan epilogue — `app.js` intentionally has no `editorial_note` handling).
- Do NOT edit `.github/workflows/*` (owner approval required; not needed here).
- Do NOT edit `.scoreboard/*`; never infer, invent, or change any `user_score`;
  fill the PR template's scoreboard section minimally and honestly.
- Do NOT touch other corpus documents, `sessions/*`, or the W1 registers/reports.
- Do NOT push to the orchestrator branch `arena/01a08d90-translatechan`.
- Do NOT rebase after the first push; do NOT force-push.
- Do NOT generate source-looking Classical Chinese from model memory — the verified
  reference file is the only source.

## 14. QUALITY CHECKS

Before opening the PR, verify (exact commands, expected outcomes):

1. `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc biyanlu_cases --out /tmp/biyanlu_after.json`
   → zero DIVERGENT content flags, zero NOT_FOUND content flags; remaining content
   flags = the 22 MINOR (documented) + documented case-11 handling; title flags
   unchanged at 86. Record before/after class counts for the PR description.
2. `python3 scripts/test_source_preservation.py` → exit 0 (preservation + focused
   regression green).
3. `python3 scripts/test_source_review_rules.py` → exit 0 (unchanged evidence rules).
4. `python3 -m py_compile scripts/*.py` → clean.
5. `python3 scripts/validate_data.py` → zero errors (run this AFTER
   `--write-metrics` to prove the committed metrics are current and docs are truthful).
6. `python3 scripts/build_data_bundle.py` → rebuilds; then
   `git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css
   docs/app.js docs/data data/project_metrics.json` → clean (artifacts committed).
7. `node scripts/smoke_test.mjs` → zero failures (all biyanlu assertions green).
8. `diff -rq data docs/data` → byte-identical.
9. `git status` → clean; all work pushed to the target branch.
10. Browser suite: run or record an evidenced skip (section 10).

## 15. PR DESCRIPTION REQUIREMENTS

The description is the surviving narrative of a squash merge. It must contain:

- **Summary:** one paragraph — Wave 1, document 2 of the R-A remediation; what the
  PR accomplishes; links/refs to `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`
  → `documents.biyanlu_cases` and `.orchestrator/REMEDIATION_PLAN.md` §1–§2.
- **Per-field adjudication table:** for each of the 19 adjudicated content fields
  (12 DIVERGENT + 7 NOT_FOUND + 1 SHORT_UNMATCHED): JSON pointer, class → action
  (re-key / remove / R-B-label), and one line of evidence (witness location, or the
  "witness demonstrably lacks this element" finding). Include the case-95 editorial
  move explicitly.
- **Before/after collation:** class counts from the harness before (sub-task 1) and
  after (sub-task 6); content-field collate figure (X/395); new total flagged.
- **Documented residual:** the 22 MINOR fields and the 86 `title_zh` metadata flags,
  and why each is acceptable per REMEDIATION_PLAN §1 (MINOR left untouched by policy;
  titles out of scope, separate plan item, metadata never blocks collation status).
- **English follow-up list:** every re-keyed field whose existing `ai_literal` no
  longer matches the new text — recorded as follow-up editorial debt, not done here.
- **Design rationale:** why verbatim re-key from the witness under the adopted R-A
  policy (PR #23 lesson: no reconstruction, no register-window pasting); why English
  is unchanged in this PR; why the status stays `partial_or_failed_w1_collation`
  (post-remediation evidence pass is separate).
- **Test results:** every section-10 command with its outcome, and any skipped check
  with the reason (browser suite, if skipped).
- **Safety/impact statement:** no status change; no rights implications; no
  workflow edits; no new dependencies; no API surface change; other corpus files
  byte-identical; `docs/` mirror regenerated.
- **Scoreboard section** (per the repo PR template): affected aspects filled
  honestly, no `user_score` changes, gate status unchanged.
