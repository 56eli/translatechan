# TASK 003 — Re-key `linji_yulu`'s W1-flagged content fields to T47n1985 and rewrite its false completeness note (Wave 1, document 3)

## 0. FETCH AND VERIFY

Your instructions are this file, fetched from the orchestrator branch:

```bash
git fetch --depth 1 origin +arena/01a08e15-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/003-linji-yulu-rekey.md > /tmp/task.md
```

Rules:

- Read the prompt from `/tmp`. Do NOT `git checkout` or `git show` any `.orchestrator/` path into
  your worktree; read orchestrator files only with `git show <ref>:<path> > /tmp/...`.
- Do NOT use `origin/arena/01a08e15-translatechan` (a single-branch clone does not create that
  ref) and do NOT use `FETCH_HEAD` (the next fetch of `main` overwrites it).
- Scratch files live outside the repository. Never commit `/tmp` content or this prompt file.
- Never push to the orchestrator branch `arena/01a08e15-translatechan`.
- HALT and report if `/tmp/task.md` is empty or its title does not mention `linji_yulu`,
  `T47n1985` and "Wave 1, document 3". Do not improvise a substitute task.
- Optional orientation supplement (never a substitute for this file):
  `git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md`.

## 1. TASK TITLE AND SCOPE

Adjudicate the **10 W1-flagged source-content fields** of `data/corpus/linji_yulu.json` against
the document's claimed CBETA witness (鎮州臨濟慧照禪師語錄, `cbeta_id` **T1985** → reference work
**T47n1985**) under the owner-adopted hybrid R-A/R-B policy, and replace the document's false
`coverage_note` completeness claim with an honest post-remediation disclosure. Complete this in
**ONE pull request**.

Deliberately out of scope: the **74 flagged `title_zh` metadata fields** (composite-title plan
item, separate PR that also touches `app.js`), every English/`*_en`/`translations.*` field, the
document's `source_review_status`, `data/corpus_manifest.json`, and any new evidence register.

## 2. REQUIRED READING ORDER

Read these before changing anything, in this order:

1. `AGENTS.md` — the agent contract: project identity, the five quality gates, the 5-room public
   scope, the data contract, the honest-disclosure moral core. (Its scoreboard section is gone as
   of PR #31; there is no score file to read or update — do not go looking for one.)
2. `.orchestrator/REMEDIATION_PLAN.md` — §1 (R-A/R-B/R-C rules; the per-class handling rules;
   §1.1 Wave-0 dialogue-marker and graphic-variant policy), §2 (Wave 1 order, the `linji_yulu`
   work-order line), §4 (invariants during remediation).
3. `.orchestrator/STATE.md` — the two merged Wave-1 precedents: `wumenguan` (PR #29) and
   `biyanlu_cases` (PR #30), and the recorded PR #23 DO-NOT-MERGE failure mode.
4. `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` — the authoritative W1 evidence report.
5. `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` → `documents.linji_yulu` —
   **your work-order**: 164 fields total, 89 source-content fields, 79 already collating,
   **84 flagged = 10 content + 74 `title_zh`**. Each `flagged[]` entry carries `path` (0-based
   JSON pointer), `class`, `sim`, `ref`, `ref_window` (a locator aid — **not** a text source),
   `corpus` (current normalized text). Its `witness_note` reads: "Sections 67-73 are Xinglu-tradition
   retellings, not claimed T1985 text."
6. `scripts/collate_corpus.py` — docstring: reference acquisition, digest verification, the class
   definitions, and harness usage.
7. `data/corpus/linji_yulu.json` — 74 `sections[]` (`section_id`, `title_zh/-pinyin/-en`,
   `dialogue[]`, and a `division` key on the 行錄 sections 67–73), root `zh_chars` = 13993, root
   `coverage_note`.
8. `data/corpus/biyanlu_cases.json` and `data/corpus/wumenguan.json` — the two merged precedents.
   **Mirror their shape exactly**: re-keyed `zh` style, syllable-separated pinyin style, additive
   `editorial_note` R-B labels, and the honest `coverage_note` template.
9. `scripts/test_source_preservation.py` — `ALLOWED_CHANGES`: exact-JSON-pointer allowlist you must
   extend (it currently holds the wumenguan and biyanlu pointer sets); it is invoked by the smoke
   test, so CI covers it without any workflow change.
10. `scripts/smoke_test.mjs` — the Linji assertions you must keep green: the unit-locator anchor
    around lines 637–647 (`Section source: T47n1985_p0504a26–p0504a29` plus
    `canonical_locators.documents.linji_yulu.unit_locators['sections.four_shouts'].status ===
    'collated_with_normalization'`), and the search query `赤肉團` around line 703.
11. `data/canonical_locators.json` → `documents.linji_yulu` — read it; you change it **only** if a
    re-key demonstrably invalidates a unit-locator range (see §11).

## 3. PROJECT CONTEXT

Fake Chan Factory (`56eli/translatechan`) is a zero-backend static GitHub Pages reader for
Classical Chinese Chan literature, with an enforced honest-disclosure contract. Fixed pipeline;
every generated artifact must stay in lockstep or CI fails:

```
data/*.json → scripts/validate_data.py → data/project_metrics.json
            → scripts/build_data_bundle.py → root assets + byte-identical docs/ mirror → Pages
```

`scripts/validate_data.py` is the enforced spec (the JSON Schema in `schemas/` is declarative
decoration). It also runs **doc truthfulness**: `README.md`, `HANDOFF.md`, `AUDIT.md`,
`ROADMAP.md`, `index.html` and `.orchestrator/STATE.md` must quote the regenerated metrics, so a
CJK total change drags those files into your diff — the validator names every offending line.

W1 (2026-09-09, corrected 2026-09-10) collated every source-Chinese field of the 35-document
corpus against extracted CBETA XML P5 text and classified it: `EXACT`/`REWORDED` collate;
`MINOR` ≥0.98 (edition-graphic residue); `DIVERGENT` 0.85–0.98; `NOT_FOUND` <0.85;
`SHORT_UNMATCHED` ≤6 CJK and not contained; `TITLE_COMPOSITE` composite title. Remediation runs
under the owner-adopted hybrid policy, one document per PR: **R-A** re-key verbatim from the
witness, **R-B** keep the project text with the witness claim removed and an explicit label,
**R-C** quarantine. Wave 1 progress: `wumenguan` (PR #29) and `biyanlu_cases` (PR #30) are merged.
**This is document 3: `linji_yulu`.**

## 4. CONFIRMED FACTS AND CONSTRAINTS

Treat these as true; do not re-derive them and do not re-litigate them:

- **The witness is verified and this sandbox can reach it.** The reference work is **T47n1985**
  from CBETA XML P5 pinned at revision `dbdea41071e1e260ad84b72faefd4587333cf76d`; its published
  digest is `4317e5fa14996b3f414187adb4264f1d52efb303392402f797d6e2019aeb8359`
  (`sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`). PR #29, #30 and this session's review
  each re-extracted it successfully in this environment. Sub-task 1 still verifies before
  touching data and HALTS on mismatch.
- **The register is ground truth over any prose — including this prompt.** The 10 content flags
  below were generated from the register JSON. If a path or class here disagrees with the
  register, follow the register and record the discrepancy in the PR description (that is
  exactly what PR #30's coder did and it was the right call).
- **Owner decision of 2026-09-11, binding on this PR (sections 67–73, the 行錄 division):**
  adjudicate **per field**. Where T47n1985 demonstrably carries the passage, re-key to the witness
  (R-A). Where it does not, keep the project text, remove any witness attribution, and add an
  explicit project-authored R-B `editorial_note` in structured metadata. **Do not delete sections
  67–73** and do not blanket-relabel the whole division; the division stays represented so the
  Reader's 74-section list, search and `第N則`-style navigation are undisturbed.
- The 10 content flags (paths 0-based; `corpus`/`ref_window` CJK counts from the register):

  | pointer | class | sim | corpus CJK | ref_window CJK |
  |---|---|---:|---:|---:|
  | `.sections[0].dialogue[1].zh` | DIVERGENT | 0.9744 | 39 | 39 |
  | `.sections[68].dialogue[0].zh` | DIVERGENT | 0.9125 | 80 | 80 |
  | `.sections[67].dialogue[0].zh` | NOT_FOUND | 0.4634 | 120 | 120 |
  | `.sections[69].dialogue[0].zh` | NOT_FOUND | 0.7292 | 96 | 96 |
  | `.sections[70].dialogue[0].zh` | NOT_FOUND | 0.8333 | 42 | 42 |
  | `.sections[71].dialogue[0].zh` | NOT_FOUND | 0.0 | 53 | — |
  | `.sections[72].dialogue[0].zh` | NOT_FOUND | 0.0 | 38 | — |
  | `.sections[73].dialogue[0].zh` | NOT_FOUND | 0.5804 | 112 | 112 |
  | `.sections[43].dialogue[0].zh` | MINOR | 0.9975 | 120 | 120 |
  | `.sections[58].dialogue[0].zh` | MINOR | 0.997 | 120 | 120 |

  Reading of that table: 8 adjudicable fields (2 DIVERGENT + 6 NOT_FOUND) and **2 MINOR fields
  that stay untouched by policy** (REMEDIATION_PLAN §1: "EXACT/MINOR fields: leave untouched").
  `.sections[71]` and `.sections[72]` have an empty `ref_window`: the harness found no witness
  passage for them, so they are R-B candidates unless your own search of the full reference file
  proves otherwise.
- **`.sections[0].title_zh` is NOT in your set** — it is 1 of the 74 `title_zh` metadata flags and
  belongs to the composite-title PR.
- **`coverage_note` currently makes a claim the evidence falsifies.** It reads verbatim:
  `"74 / 74 canonical sections complete across all 4 divisions (序, 上堂, 示眾, 勘辨, 行錄)"` —
  it asserts completeness, lists five division names under "4", and ignores that only 79/89 content
  fields collate. Rewriting it honestly is a deliverable (§6), not an optional cleanup.
- `completion_status` stays `partial_selected_witness` and `source_review_status` stays
  `partial_or_failed_w1_collation`. Status flips belong to the separate post-remediation evidence
  pass (a new dated register), never to a data PR. Do not touch `data/corpus_manifest.json`.
- **Failure mode to avoid (PR #23, DO-NOT-MERGE):** truncated register `ref_window` fragments
  pasted in as source text, a corrupted field, garbled pinyin, and a false "Complete" claim.
  `ref_window` tells you *where* to look. The characters you write come from the full extracted
  reference file, copied — never reconstructed from model memory, never summarized, never
  "improved".
- Reference extraction detail you must respect: the pinned rule drops CBETA `<note>` apparatus and
  `<g>` gaiji subtrees, so a witness glyph encoded as `<g ref="#…">` is absent from the reference
  text. Reproduce the reference form and disclose it (PR #30 documented exactly this for case 82
  㵎). Dialogue markers and graphic variants follow the witness verbatim (Wave-0 policy §1.1): keep
  曰/云/蘗-vs-檗/爾-vs-你/钁-vs-鏵 etc. as the witness has them; apply no repo-wide normalization.
- Where a re-key materially changes meaning, **do not re-render the English**. Enumerate the
  divergent `ai_literal`/`*_en` fields in the PR description as follow-up editorial debt (the
  PR #30 precedent).
- The repo's PR template was rewritten by PR #31: it now has `## Release impact` (pointing at
  `HANDOFF.md` §5) instead of the old scoreboard sections. Fill it honestly; `user_score` scoring
  is retired — do not invent scores, and do not edit `.github/workflows/*`.

## 5. CORE OBJECTIVE

After this PR merges:

1. Each of the 8 adjudicable fields is either re-keyed verbatim from the verified T47n1985
   reference text (and then classifies `EXACT`/`REWORDED`) or is retained as clearly labelled
   project-authored text with no witness attribution (R-B `editorial_note`). Nothing in
   `data/corpus/linji_yulu.json` implies witness authority without collation.
2. A fresh harness run for `--doc linji_yulu` reports **zero DIVERGENT content flags** and zero
   NOT_FOUND content flags for fields the witness covers; the documented residual is the 2 MINOR
   content fields, the R-B-labelled fields with their reason, and the 74 `title_zh` metadata flags.
3. `coverage_note` is an honest post-remediation disclosure on the biyanlu template: represented
   units, X/89 collating content fields after re-key, the residual per class with reasons, the
   行錄 provenance statement (retellings per the owner's per-field ruling), and the closing
   sentence that representation does not establish complete selected-witness status.
4. `zh_chars` matches the validator's computed count; metrics, `app_data.js` and the `docs/`
   mirror are regenerated; guarded docs carry the new CJK totals; the preservation allowlist admits
   exactly the pointers this PR changes and nothing else; all five quality gates pass; and both
   statuses remain unchanged.

## 6. EXACT DELIVERABLES

Modify:

- `data/corpus/linji_yulu.json`:
  - the re-keyed `zh` fields (each `DIVERGENT`, plus every `NOT_FOUND` the witness covers) and the
    sibling `pinyin` rewritten syllable-by-syllable, space-separated, in the
    `data/corpus/biyanlu_cases.json` / `wumenguan.json` style;
  - additive `editorial_note` R-B labels on each kept non-witness field (short, factual, no witness
    attribution; mirror `biyanlu_cases.json .cases[95].dialogue[0].editorial_note` and the wumenguan
    epilogue label);
  - the rewritten root `coverage_note`;
  - the recomputed root `zh_chars`.
- `scripts/test_source_preservation.py` — a new `ALLOWED_CHANGES` entry
  `"data/corpus/linji_yulu.json"` listing **exactly** the pointers this PR changes (each re-keyed
  `*.zh`, each rewritten `*.pinyin`, each additive `editorial_note`, `.coverage_note`,
  `.zh_chars`). Nothing else. Update the module docstring's bullet list to describe this entry the
  way it describes the other two.
- `data/project_metrics.json` — via `python3 scripts/validate_data.py --write-metrics` after the
  data is final.
- `app_data.js`, `docs/app_data.js`, `docs/data/**`, `docs/index.html`, `docs/app.css`,
  `docs/app.js`, `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`, `docs/og-image.svg`
  — via `python3 scripts/build_data_bundle.py` only. Never hand-edit anything under `docs/`.
- `scripts/smoke_test.mjs` — **only** the strings this PR makes stale (e.g. the `赤肉團` query, or
  the locator anchor) and only if the corresponding text actually changed; prefer choosing
  re-keyed text that keeps an existing assertion true. One-line changes, each justified in the
  PR description. Do not add new assertions and do not restructure the file.
- `data/canonical_locators.json` — only if a re-key demonstrably invalidates a Linji unit-locator
  range; otherwise leave it untouched and say so in the PR description.
- `README.md` / `HANDOFF.md` / `AUDIT.md` / `ROADMAP.md` / `index.html` — only the figures the
  validator's doc-truthfulness gate flags (expect the content/all-string CJK pair to move; the
  "74 recorded sections" strings in `README.md:53`, `ROADMAP.md:60`, `ROADMAP.md:89` are coverage
  claims, not metrics — leave them unless the validator demands otherwise). For `index.html` that
  means a guarded `<meta>` description string **only** — no markup, structural or script change.
- `.orchestrator/STATE.md` — extend the Wave-1 record with the document-3 outcome (fields
  re-keyed / R-B-labelled / left MINOR, before→after class counts, the 行錄 per-field ruling you
  applied, PR number) and update the REMEDIATION task-queue line to "Wave 1 progress: wumenguan
  (PR #29), biyanlu_cases (PR #30), linji_yulu (PR #N); **next: xinxin_ming**".
- `.orchestrator/REMEDIATION_PLAN.md` — §5 checklist: on the `- [ ] Wave 1:` line (currently
  `wumenguan ☑ (PR #29, 2026-09-10) biyanlu_cases ☑ (PR #30, 2026-09-10) linji_yulu ☐ xinxin_ming ☐
  platform_sutra ☐`), mark `linji_yulu ☑ (PR #N, 2026-09-11)`, and add a short "Wave 1 progress —
  document 3" section with the before/after table and the per-class decisions, mirroring the
  document-2 section directly above it.

Do NOT modify: `data/corpus_manifest.json`, `scripts/validate_data.py`, `scripts/w1_evidence.py`,
`scripts/source_review.py`, `scripts/collate_corpus.py`, `scripts/collate_refs.py`, `app.js`,
`app.css`, `index.html` markup, `theme-init.js`, `OPERATIONS.md`, `.github/workflows/*`,
`data/corpus/*` for any other document, anything under `sessions/`, or the W1 registers/reports.

## 7. SUB-TASK BREAKDOWN AND CHECKPOINTS

Each sub-task ends with one checkpoint (section 9's single command). This list IS your push
schedule; a sub-task is one coherent unit — if one of these feels too large, commit in the middle
of it rather than going unpushed.

1. **Reference setup + "before" measurement.** Acquire the CBETA refs per the
   `scripts/collate_corpus.py` docstring (blobless sparse-checkout at the pinned revision),
   extract with `scripts/collate_refs.py`, and verify against
   `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`. **`ref_T47n1985.txt` must digest-verify as
   `4317e5fa…` or you HALT and report** — a failed fetch is an environment failure, not a licence
   to work from memory. Then run the harness for `--doc linji_yulu` and record the "before" class
   counts and the `sections.four_shouts` locator. → checkpoint
2. **Re-key the 2 DIVERGENT fields** (`.sections[0].dialogue[1].zh`,
   `.sections[68].dialogue[0].zh`) verbatim from the reference text, with sibling pinyin rewritten.
   → checkpoint
3. **Adjudicate the 6 NOT_FOUND fields** under the owner's per-field ruling: locate each passage
   in the **full** reference file; found → re-key verbatim + pinyin; not found → keep the project
   text, strip witness attribution, add the R-B `editorial_note`. Expect `.sections[71]`/`[72]` to
   be R-B, `[67]`/`[69]`/`[73]` to be partial-overlap cases needing your judgement on *which span*
   the witness covers, `[70]` close to the witness. Record one line of evidence per field (witness
   location, or the explicit absence finding). → checkpoint
4. **`coverage_note` + `zh_chars`.** Rewrite the note honestly on the biyanlu template, including
   the 行錄 provenance sentence naming the owner's per-field decision, and set `zh_chars` to the
   validator's computed content CJK count. Confirm the 2 MINOR fields are untouched. → checkpoint
5. **Allowlist + preservation.** Add the exact pointers to `ALLOWED_CHANGES` (with the docstring
   bullet), run `python3 scripts/test_source_preservation.py`; then verify
   `git diff data/corpus/linji_yulu.json` touches nothing outside the allowlist. → checkpoint
6. **Smoke + regenerate + gates.** Run `node scripts/smoke_test.mjs`; if an assertion went stale,
   apply the minimal string change from §6 and note it. Then `python3 scripts/validate_data.py
   --write-metrics`, fix any doc-truthfulness findings it reports, `python3
   scripts/build_data_bundle.py`, and the full five-gate suite plus the CI artifact check.
   Re-run the harness for `--doc linji_yulu` and record the "after" class counts. → checkpoint
7. **Canonical state.** Update `.orchestrator/STATE.md` and `.orchestrator/REMEDIATION_PLAN.md`
   §5 + the new progress section, using `PR #N` if the number is not yet known. → checkpoint
8. **Open the ONE pull request** with the section-15 description; substitute the real PR number
   into the two `.orchestrator/*` files; re-run the five gates once; final push. → final checkpoint

## 8. BRANCH AND TARGET

- **Base branch:** `main` — never the orchestrator branch. Required base: `e4b17f7` or a descendant
  of it (that merge is PR #31, which retired the scoreboard; `AGENTS.md`'s contract on that base is
  the one this prompt assumes). Verify with
  `git merge-base --is-ancestor refs/remotes/origin/main HEAD` after your first sync — and if
  `main` has moved, just sync per section 9.
- **Target branch:** the non-default `arena/*` working branch your session is pinned to by the
  platform. Stay on it; never commit on `main`. Only if you find yourself on `main`:
  `git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B feature/linji-yulu-rekey origin/main`.
- **Orchestrator branch:** `arena/01a08e15-translatechan` — fetch source only; never a base, never
  a target, never push to it.
- **Dependencies:** PR #31 (merged) and PR #30 (merged) — both are already in `main`; nothing else
  unmerged. If you are told to work on top of an unmerged PR, stop and report instead of stacking.
- **Resuming:** fresh branch from `main`. No interrupted branch carries this task.

## 9. WORK PERSISTENCE AND PUSH CADENCE

Your session can expire without warning; unpushed work is lost. Checkpoint after each sub-task in
section 7, before any long or risky operation (the CBETA fetch, the full test runs, a sync with
`main`), and at the end. There is no time-based rule — section 7 is your schedule.

A checkpoint is ONE command — first push, later pushes, and the nothing-to-push no-op are the same
form, with no status/diff ceremony around it:

```bash
git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin <branch>
```

- Open exactly ONE pull request at the end, when section 14 passes. Do not open a draft PR first.
- Checkpoint commits may be broken; that is expected. Never commit a secret: with continuous
  pushing, a credential that reaches one push is disclosed even if a later commit deletes it —
  halt and report it as an incident instead of cleaning it up.
- Never push to the orchestrator branch; never push anything from `/tmp`.
- **Sync rule:** rebase onto `origin/main` ONLY before your first push. After the first push, never
  rebase (that forces a force-push); integrate with
  `git fetch --depth 50 origin +main:refs/remotes/origin/main && git merge --no-edit origin/main`
  then `git push origin HEAD`.
- Never force-push unless explicitly instructed (you will not be). On a merge conflict: HALT and
  report the conflicting files. Same for a sync that refuses with "refusing to merge unrelated
  histories" — never pass `--allow-unrelated-histories`; raise the fetch depth (e.g. `--depth 200`)
  and merge again.
- If a push or fetch fails with an authentication or network error, report it plainly, keep working
  locally, and retry at the next checkpoint. Never claim work is pushed while a push has failed,
  and never modify credentials, remotes, or git config to work around it.
- Shallow-clone rules: always fetch with an explicit `+src:dst` refspec into a named ref and read
  from that ref; never `git show <sha>:<path>` for unfetched objects; never rely on `FETCH_HEAD`
  across fetches; do not unshallow. Do not run the checks inside a linked `git worktree` — the
  preservation and smoke scripts need a real `.git` directory.

## 10. TECHNICAL REQUIREMENTS

- **Style:** surgical JSON edits preserving the file's existing formatting (2-space indent,
  unescaped CJK, stable key order); untouched content stays byte-identical, because the
  preservation test byte-compares against the pinned base commit. Editing with Python `json` is
  fine **only** if you verify with `git diff` that no untouched key moved or reflowed.
- **Re-key mechanics:** locate each passage in `/tmp/refs/ref_T47n1985.txt` (NFKC; the collator
  applies its graphic-variant map to both sides, so tolerated residue is acceptable), copy the
  witness characters — do not type them from memory — and rewrite each sibling `pinyin`
  syllable-by-syllable, space-separated, matching the merged biyanlu/wumenguan style.
- **TEST_COMMAND (focused):** `python3 scripts/test_source_preservation.py` → exit 0, printing the
  `N permitted allowlisted changes / 0 unauthorized changes` lines; plus
  `python3 scripts/test_source_review_rules.py` → exit 0 (96 checks; the evidence rules are
  unchanged and must stay green). Collation oracle before/after, both runs on the verified refs:
  `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc linji_yulu --out /tmp/linji_{before,after}.json`.
- **INTEGRATION_TEST_COMMAND:** `node scripts/smoke_test.mjs` → `✅ SMOKE TEST PASSED`, with the
  Linji unit-locator anchor and the `赤肉團` search assertion green.
- **FULL_SUITE_COMMAND (the five gates, in order):**
  `python3 -m py_compile scripts/*.py` → `python3 scripts/validate_data.py` (zero errors; run
  WITHOUT `--write-metrics` and WITHOUT `--skip-docs` at the end, to prove committed metrics are
  current and docs truthful) → `python3 scripts/build_data_bundle.py` → `node scripts/smoke_test.mjs`
  → `diff -rq data docs/data`; plus the CI artifact check
  `git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json`.
- **COVERAGE_COMMAND:** not configured — this repo has no coverage tool or threshold. Do not invent
  one; report the harness's own X/89 collating-content figure as the measurable outcome.
- **MUTATION_TEST_COMMAND:** not warranted for this PR — it is a mechanical re-key whose oracle is
  the collation harness itself; the repo's existing mutation matrix (`scripts/test_source_review_rules.py`,
  11-case `--write-metrics` protection included) is run as a focused check and covers the evidence
  rules. Explain that reasoning in the PR description rather than skipping silently.
- **LINT_COMMAND:** `python3 -m py_compile scripts/*.py` (the only configured lint; there is no JS
  or Markdown linter).
- **BUILD_COMMAND:** `python3 scripts/build_data_bundle.py`.
- **Browser suite:** `npm run test:browser` is optional and dev-only. If Chromium cannot be
  installed or run (the `ECONNRESET` precedent on `cdn.playwright.dev`), skip it and record the
  skip with the reason — the smoke test is the required gate for a data-only change.

## 11. SAFETY AND COMPATIBILITY RULES

- **Must not break:** Linji rendering in the Reader (74-section list, the 行錄 `division` grouping,
  prev/next navigation, search across the `sections` schema shape, the `four_shouts` unit locator and
  its `collated_with_normalization` status), the five always-visible ledgers, the other 34 corpus
  documents (byte-identical), the `docs/` mirror invariant, CSP and the no-runtime-dependency rule,
  the 5-room public scope, and every validator rule (you change data, not rules).
- **Must not change:** `data/corpus_manifest.json` (both statuses stay as-is); the W1 evidence files
  under `sessions/`; the pinned base commit `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43` in
  `scripts/test_source_preservation.py`; the existing wumenguan/biyanlu allowlist entries; any
  English/`*_en`/`translations.*` field; any `title_zh`/`title_pinyin` field (composite-title PR);
  `.github/workflows/*`; `OPERATIONS.md`; `app.js`/`app.css`/`index.html`/`theme-init.js`.
- **Locator discipline:** a re-key that lengthens or shortens a section can desynchronise a
  `canonical_locators.json` range. If the smoke test's locator assertion fails because the range no
  longer matches, you have two permitted options, in order of preference: (a) keep the change small
  enough that the existing range still holds, or (b) update exactly the affected Linji locator and
  justify it in the PR description. Never weaken or delete the assertion to make it pass.
- **Honesty is the moral core:** the finished data must never imply witness authority for text that
  did not collate, and the note must never call the document complete. When in doubt between
  re-key, remove and label, choose the option that preserves honesty and record your reasoning.
  Edition verification and rights approval remain separate — touch no rights record.
- **Backward compatibility:** data + documentation only. No API surface change; `window.TranslateChan`,
  `TRANSLATECHAN_DATA` and all `translatechan_*` localStorage keys stay exactly as they are.

## 12. CLEANUP RULES

- By the final push: no commented-out code, no debug prints, no ad-hoc scratch scripts in the repo,
  no TODO markers introduced by this PR, no changes to unrelated files, no reformatting outside the
  allowlisted pointers, and no half-rewritten sentences in `coverage_note` or the docs.
- Do not commit `/tmp/refs`, `/tmp/xmlp5`, `/tmp/linji_*.json`, or the fetched prompt file. Remove
  `node_modules/` again if you installed it for the browser suite.
- Intermediate checkpoint commits are exempt from cleanup — clean up once, before opening the PR.

## 13. STRICT BOUNDARIES / OUT OF SCOPE

- Do NOT work the 74 `title_zh` metadata flags or split any composite title (`title_zh` stays as is;
  composite-title splitting is its own PR because it touches `app.js` and the smoke guards).
- Do NOT change any English/translation field, and do NOT "improve" pinyin beyond the rewritten
  siblings of re-keyed `zh` fields.
- Do NOT touch `.sections[43].dialogue[0].zh` or `.sections[58].dialogue[0].zh` (MINOR — left
  untouched by policy), and do NOT align any other MINOR/EXACT field.
- Do NOT delete or renumber sections; do NOT reorder `sections[]`.
- Do NOT flip `source_review_status` or `completion_status`, add a new evidence register, or modify
  `scripts/validate_data.py` / `scripts/w1_evidence.py` / `scripts/source_review.py` /
  `scripts/collate_*.py` (the post-remediation evidence pass is a separate task).
- Do NOT add `editorial_note` rendering to `app.js` (structured metadata only, as in the two
  merged precedents). Likewise no change to `app.js`, `app.css`, `index.html` (not even a meta
  string — that one is only reachable via §6 if the validator's doc gate demands it), `theme-init.js`
  or `OPERATIONS.md` markup/behaviour.
- Do NOT edit `.github/workflows/*` or `OPERATIONS.md`; do NOT touch `sessions/*`; do NOT edit any
  other corpus document.
- Do NOT generate source-looking Classical Chinese from model memory — the verified reference file
  is the only source of Chinese characters in this PR.
- Do NOT push to the orchestrator branch `arena/01a08e15-translatechan`. Do NOT rebase after your
  first push. Do NOT force-push. Do NOT open a second PR.

## 14. QUALITY CHECKS

Run all of these and record each outcome for the PR description:

1. `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc linji_yulu --out /tmp/linji_after.json`
   → zero DIVERGENT content flags; zero NOT_FOUND content flags for witness-covered fields; residual
   = the 2 MINOR fields + the R-B-labelled fields + 74 `title_zh` metadata flags. Paste before/after
   class counts.
2. `python3 scripts/collate_refs.py --refs-dir /tmp/refs --verify-against
   sessions/COLLATION_W1_2026-09-10_refs_manifest.txt` → `T47n1985` verified, 0 drift for that work.
3. `python3 scripts/test_source_preservation.py` → exit 0; `0 unauthorized changes`; the focused
   nested-`coverage_note` regression green.
4. `python3 scripts/test_source_review_rules.py` → exit 0 (96 checks).
5. `python3 -m py_compile scripts/*.py` → clean.
6. `python3 scripts/validate_data.py` → zero errors, run WITHOUT `--skip-docs` (proves committed
   metrics current + docs truthful).
7. `python3 scripts/build_data_bundle.py` then
   `git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json`
   → clean (artifacts committed).
8. `node scripts/smoke_test.mjs` → `✅ SMOKE TEST PASSED` (Linji anchor + search assertions green).
9. `diff -rq data docs/data` → no output.
10. `git diff --check` and `git diff --check origin/main...HEAD` → clean.
11. `git status` clean; all work pushed; nothing from `/tmp` in the tree
    (`git status --porcelain --ignored | grep -i refs` must not list repo-tracked ref files).
12. Browser suite: run, or record an evidenced skip (section 10).

## 15. PR DESCRIPTION REQUIREMENTS

Title: `Re-key linji_yulu to the T47n1985 witness (Wave 1, document 3)`. The description is the
surviving narrative of a squash merge and must contain:

- **Summary** — one paragraph: Wave 1, document 3 of the owner-adopted R-A/R-B/R-C remediation;
  name the register path (`sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` →
  `documents.linji_yulu`) and `.orchestrator/REMEDIATION_PLAN.md` §1–§2 as the authority, plus the
  owner's 2026-09-11 per-field ruling for the 行錄 division.
- **Per-field adjudication table** — one row per the 8 adjudicable fields: JSON pointer, class →
  action (re-key / keep with R-B label), and one line of evidence (witness locator, or the
  documented "witness lacks this passage" finding). Include the 2 MINOR fields as explicit
  "untouched by policy" rows so a reviewer can see the boundary was honoured.
- **Before/after collation** — harness class counts and the collating-content figure (79/89 → N/89),
  total flagged 84 → N, and the unchanged 74 `title_zh` count.
- **Documented residual** — the 2 MINOR content fields, each R-B-labelled section with its reason,
  and the 74 `title_zh` metadata flags (out of scope, composite-title plan item, metadata never
  blocks `collated_to_claimed_witness`).
- **`coverage_note` rewrite** — quote the old claim and the new note, and say plainly that the old
  one asserted completeness the evidence did not support (including "4 divisions" naming five).
- **Locator statement** — whether `data/canonical_locators.json` changed; if unchanged, state that
  you verified the `sections.four_shouts` range still holds.
- **English follow-up list** — every field whose existing `ai_literal`/`*_en` now diverges from the
  re-keyed `zh`, recorded as follow-up editorial debt and explicitly not done here.
- **Design rationale** — why verbatim re-key from the witness under R-A (and the PR #23 lesson), why
  the 行錄 division was adjudicated per field rather than blanket-labelled or dropped (owner
  decision, with its reasoning), why English is unchanged, why both statuses stay
  `partial_or_failed_w1_collation` / `partial_selected_witness` (the evidence pass is separate).
- **Test results** — every section-14 command with its outcome, each skipped check with its reason,
  and the reasoning for the "mutation testing not warranted" and "coverage not configured" calls.
- **Safety/impact statement** — no status change; no rights implications; no workflow edits; no new
  dependencies; no API surface change; the other 34 corpus documents byte-identical; `docs/`
  regenerated by the build script; smoke/browser state as measured.
- Describe only this PR's own changes. Do not present PR #29/#30/#31 work as yours; link them.
