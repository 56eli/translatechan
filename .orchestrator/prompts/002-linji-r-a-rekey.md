# TASK 002 — Re-key `linji_yulu` to its claimed T1985 witness per the W1 collation register (Wave 1, document 3)

## 0. FETCH AND VERIFY

Your instructions live on the orchestrator branch. You are reading them from there:

```bash
git fetch --depth 1 origin +arena/01a08d90-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/002-linji-r-a-rekey.md > /tmp/task.md
```

Rules:

- Do NOT use `origin/arena/01a08d90-translatechan` (a single-branch clone will not have
  that tracking ref) and do NOT use `FETCH_HEAD` (a later fetch of `main` overwrites it).
- Do NOT `git checkout` or `git show` any `.orchestrator/` path into your worktree. Read
  orchestrator files with `git show <ref>:<path> > /tmp/...` only.
- Write all scratch files outside the repository (`/tmp`). Never commit anything from
  `/tmp`. Never commit this prompt file.
- If `/tmp/task.md` is empty, or its title does not match this task ("linji_yulu",
  "T1985", "Wave 1, document 3"), HALT and report — do not improvise.
- Never push to the orchestrator branch `arena/01a08d90-translatechan`.

## 1. TASK TITLE AND SCOPE

Close out document 3 of Wave 1 in the owner-adopted R-A remediation program:
adjudicate the 10 W1-flagged **source-content** fields of
`data/corpus/linji_yulu.json` (the Record of Linji / 鎮州臨濟慧照禪師語錄) against the
document's claimed CBETA T1985 witness — re-keying verbatim from the verified reference
text where the witness carries the passage, and applying the R-B label (or removal)
only where the witness demonstrably lacks it. Complete this in **ONE pull request**.

Out of scope (deliberately): the 74 flagged `title_zh` metadata fields (separate
composite-title plan item), English translation fields, any source-review status
change, any new evidence register, other corpus documents, app/CI changes, and any
per-section witness-provenance schema work (section 13).

## 2. REQUIRED READING ORDER

Read these before changing anything, in this order:

1. `AGENTS.md` — the agent contract: project identity, the 5 quality gates, public
   scope, data contract, honest-disclosure core.
2. `.orchestrator/REMEDIATION_PLAN.md` — §1 (adopted R-A/R-B/R-C rules, per-class
   handling, Wave-0 dialogue-marker & variant policy), §2 (Wave 1 ordering; the
   `linji_yulu` work-order line), and the Wave 1 progress notes from documents 1–2.
3. `.orchestrator/STATE.md` — the W1 remediation record (PRs #29, #30 precedents and
   the recorded PR #23 DO-NOT-MERGE failure mode).
4. `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` →
   `documents.linji_yulu` — **your work-order**. 84 flagged entries = 10 content +
   74 `title_zh` metadata. Each entry carries `path` (JSON pointer), `class`, `sim`,
   `ref`, `ref_window` (best reference window — a locator aid, NOT a text source),
   `also_in`, `corpus`.
5. `scripts/collate_corpus.py` — docstring: exact reference acquisition + digest
   verification, class definitions, harness usage (note: any register write requires
   an explicit `--generated YYYY-MM-DD`).
6. `data/corpus/linji_yulu.json` — the document you will edit (74 `sections[]`, each
   `section_id`, `title_zh`, `title_pinyin`, `title_en`, `dialogue[]` with
   `{speaker, zh, pinyin, translations}`; top-level `coverage_note`, `zh_chars`).
7. `data/corpus/biyanlu_cases.json` + `data/corpus/wumenguan.json` — the post-PR #30 /
   #29 state: **the pattern to mirror** (re-keyed zh style, syllable pinyin style,
   `editorial_note` R-B labels, honest `coverage_note` template — biyanlu's is the
   newest).
8. `scripts/test_source_preservation.py` — `ALLOWED_CHANGES` (exact-JSON-pointer
   allowlist; you must extend it) and its focused nested-`coverage_note` regression.
9. `scripts/smoke_test.mjs` — the linji assertions you must keep green: the unit
   locator pilot `sections.four_shouts` (section idx 2; renders
   `Section source: T47n1985_p0504a26–p0504a29`; around lines 633–648) and the search
   query `赤肉團` (hits section idx 28 `sermon_1`; around line 703).
10. `data/corpus_manifest.json` → item `linji_yulu` — you will NOT change it.
11. `data/canonical_locators.json` → `documents.linji_yulu` — you will NOT change it
    (read it to know which section ids the locator pilot anchors on).

## 3. PROJECT CONTEXT

Fake Chan Factory (`56eli/translatechan`) is a zero-backend static GitHub Pages reader
for Classical Chinese Chan literature. No runtime dependencies; strict CSP
(`script-src 'self'`). Fixed pipeline — all five generated artifacts stay in lockstep:

```
data/*.json → scripts/validate_data.py → data/project_metrics.json
            → scripts/build_data_bundle.py → root assets + byte-identical docs/ mirror
            → GitHub Pages
```

`scripts/validate_data.py` is the enforced spec (schema, semantics, per-file
`zh_chars` ↔ computed content CJK count, doc-truthfulness over README/HANDOFF/AUDIT/
ROADMAP/index.html, W1 evidence merge). `scripts/test_source_preservation.py`
byte-compares `data/corpus/` against pinned base commit
`3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43` and permits only exact allowlisted JSON
pointers; it runs inside the smoke test, so CI covers it.

W1 (full-corpus collation vs CBETA) found 630 flagged fields corpus-wide; the
authoritative record is the 2026-09-10 correction register. Remediation runs under
the owner-adopted hybrid policy (R-A re-key from authoritative witness / R-B
keep-with-honest-label / R-C quarantine), one document per PR. Document 1
(`wumenguan`) merged as PR #29; document 2 (`biyanlu_cases`) is PR #30
(merged or in final hand-back at the time this prompt was authored — either way it
touches only biyanlu files, the shared state notes, and regenerated artifacts; your
file scope is disjoint from it). **This task is document 3 (`linji_yulu`).**

The repo's PR template contains a scoreboard section: until the (later, separate)
scoreboard-removal PR, fill it minimally and honestly — list affected aspects, never
touch a `user_score` field, no `.github/workflows/*` edits, gate status unchanged.

## 4. CONFIRMED FACTS AND CONSTRAINTS

Treat these as true without re-deriving. The per-class pointer lists below were
generated programmatically from the authoritative register (2026-09-10) — if any
entry you read in the register disagrees with this list, **the register is ground
truth**; handle it and record the discrepancy in the PR description.

- `linji_yulu` = 鎮州臨濟慧照禪師語錄, `cbeta_id` **T1985** (Taishō vol 47), 74
  sections. Manifest item: `completion_status: partial_selected_witness`,
  `source_review_status: partial_or_failed_w1_collation`. **Neither changes in this PR.**
- Register facts: 164 fields total, 89 content fields, 79 EXACT. 84 flagged =
  **10 content** + 74 `title_zh` metadata (metadata measured separately; out of
  scope for this PR; never blocks `collated_to_claimed_witness`).
- **Content DIVERGENT (2):**
  - `.sections[0].dialogue[1].zh` (sim 0.9744 — the 瞎驢邊 passage; the corpus reads
    問爾 where the witness reads 問什麼)
  - `.sections[68].dialogue[0].zh` (sim 0.9125 — 栽松; witness reads 什麼/钁頭/竪,
    corpus reads 甚麼/鏵頭/豎, plus small span differences)
- **Content NOT_FOUND (6)** — all in the 行錄 divisions (section idx 67–73,
  `xinglu_01`…`xinglu_07`):
  - `.sections[67].dialogue[0].zh` (sim 0.4634; 黃檗三度喫棒/大愚肋下三拳)
  - `.sections[69].dialogue[0].zh` (sim 0.7292; 普請鏵地/拄杖)
  - `.sections[70].dialogue[0].zh` (sim 0.8333; 參達磨塔頭)
  - `.sections[71].dialogue[0].zh` (sim 0.0, no window; 龍門遇普化驢鳴)
  - `.sections[72].dialogue[0].zh` (sim 0.0, no window; 參象田吸盡西江水)
  - `.sections[73].dialogue[0].zh` (sim 0.5804; 遷化示寂/傳法偈/澄靈塔 — the corpus
    field is a composite: a 傳法偈 + the death dialogue + the pagoda name)
- **Witness evidence already checked by the orchestrator** (from the register's
  `ref_window` fields — verify each against the full reference text yourself):
  T47n1985 **does carry** the 黃檗/大愚 story, the 栽松 story, the 普請 story, the
  達磨塔頭 story, and the closing death passage (言訖端然示寂/師諱義玄) — so
  sections 67, 68, 69, 70 and (at least in part) 73 are **re-keyable from the
  claimed witness** even though the corpus versions are retellings. Sections 71 and
  72 have **no window anywhere in T47n1985** (sim 0.0, `ref: null`) — the witness
  genuinely lacks those two stories (they live in other records, e.g. 傳燈錄/祖堂集;
  the register's probe list is `['T47n1985', 'X68n1315', 'T51n2076', 'X80n1565']`).
- **Content MINOR (2):** `.sections[43].dialogue[0].zh` (0.9975),
  `.sections[58].dialogue[0].zh` (0.997) — leave untouched (policy: "EXACT/MINOR
  fields: leave untouched").
- The top-level `coverage_note` currently claims "74 / 74 canonical sections complete
  across all 4 divisions (序, 上堂, 示眾, 勘辨, 行錄)" — **falsified** by the register
  (the 行錄 sections are retellings; the manifest status is `partial_selected_witness`)
  and self-inconsistent (says "4 divisions" while listing five). It must be
  re-written as an honest post-remediation disclosure (biyanlu's new note is the
  template).
- **Precedents — mirror their shape exactly** (same as prompt 001, sections 4 and 6):
  PR #29 (wumenguan) and PR #30 (biyanlu): verbatim re-key from the digest-verified
  reference (witness punctuation + variant glyphs preserved); sibling pinyin rewritten
  syllable-by-syllable, space-separated (style: `Lǎo rén yún. Nuò mǒu jiǎ fēi rén yě.
  …`); non-witness text kept only with an additive `editorial_note` R-B label in
  structured metadata and no witness attribution; **English translation fields left
  unchanged**; allowlist extended with exactly the changed pointers; `zh_chars`
  recomputed; metrics/bundle/docs mirror regenerated; before/after harness numbers in
  the PR description; `source_review_status` deliberately unchanged (the flip belongs
  to the separate post-remediation evidence pass).
- **Failure mode — PR #23 (DO-NOT-MERGE):** truncated register `ref_window` fragments
  pasted as source text, garbled pinyin, false "Complete" claim. `ref_window` tells
  you *where* in the witness to look; the text you write comes from the **full
  extracted reference file**, character for character.
- **Invariant (project moral core):** never generate source-looking Classical Chinese
  from model memory. If a field's text cannot be mechanically tied to the verified
  T1985 reference text, it is removed or R-B-labeled — never "reconstructed".
- Reference layer: acquired per the `scripts/collate_corpus.py` docstring (blobless
  sparse-checkout of `cbeta-org/xml-p5`), extracted with `scripts/collate_refs.py`,
  verified against `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`.

## 5. CORE OBJECTIVE

After this PR merges:

1. Every W1-flagged **content** field of `linji_yulu` is either (a) re-keyed verbatim
   to the T1985 witness (harness class EXACT/REWORDED), (b) removed because the
   witness demonstrably lacks it, or (c) retained with an explicit project-authored
   R-B label in structured metadata and no witness attribution. Composite fields
   (section 74, i.e. `.sections[73]`): the witness-present portion is re-keyed; any
   witness-absent fragment (e.g. a 傳法偈, if not in the witness) is removed or moved
   to an `editorial_note` (R-B) — never left in the source field implying witness
   authority.
2. A fresh harness run shows **zero DIVERGENT content flags**; the only remaining
   content flags are the 2 MINOR (acceptable residual per policy) plus, **only if the
   section-71/72 retellings are retained**, those two NOT_FOUND fields as a documented
   R-B-labeled residual (the wumenguan-epilogue pattern). The 74 `title_zh` metadata
   flags remain (out of scope; metadata never blocks `collated_to_claimed_witness`).
3. `coverage_note` is an honest post-remediation disclosure (biyanlu template);
   `zh_chars` matches the validator's computed content CJK count; metrics, bundle, and
   `docs/` mirror are regenerated; the source-preservation allowlist admits exactly
   the pointers this PR changes and nothing else.
4. All five quality gates pass, the smoke test passes (including the `sections
   .four_shouts` locator pilot and the `赤肉團` search), and
   `source_review_status` remains `partial_or_failed_w1_collation`.

## 6. EXACT DELIVERABLES

Modify:

- `data/corpus/linji_yulu.json` — re-keyed content fields (the 2 DIVERGENT + each
  NOT_FOUND field whose passage the witness demonstrably carries — expected to
  include sections 67, 69, 70 and the witness-present portion of 73; verify per
  field, the register is the work-order and the reference text is the authority),
  with rewritten syllable pinyin; additive `editorial_note` R-B labels where used
  (sections 71/72 and/or section-73 fragments; wumenguan-epilogue / biyanlu-case-95
  pattern); rewritten root `coverage_note`; recomputed root `zh_chars`.
- `scripts/test_source_preservation.py` — new `ALLOWED_CHANGES` entry
  `"data/corpus/linji_yulu.json"` listing **exactly** the JSON pointers this PR
  changes (every re-keyed `dialogue[N].zh` and its `.pinyin`, additive
  `editorial_note` pointers, removed-field pointers, `.coverage_note`, `.zh_chars`).
  Nothing else.
- `data/project_metrics.json` — regenerated (`python3 scripts/validate_data.py
  --write-metrics` after the data is correct).
- `app_data.js`, `docs/app_data.js`, `docs/data/corpus/linji_yulu.json`,
  `docs/data/project_metrics.json` — regenerated (`python3 scripts/build_data_bundle.py`).
- `.orchestrator/STATE.md` — canonical tracker: extend the W1 remediation record with
  the document-3 outcome (fields re-keyed / removed / R-B-labeled, before→after
  flagged counts, PR number) and update the REMEDIATION task-queue line (Wave 1
  progress: … linji_yulu done (PR #N); **next: xinxin_ming**).
- `.orchestrator/REMEDIATION_PLAN.md` — Wave 1 progress note for document 3 with the
  before/after collation summary and per-class decisions (including the explicit
  section-71/72 fate decision).
- `scripts/smoke_test.mjs` — **only** the `赤肉團` search-query string, and **only**
  if a re-keyed field removes it from the corpus (it currently hits section idx 28
  `sermon_1`, which is not in your adjudication set — so expect NO change; verify,
  and if no change is needed, do not touch the file). No other smoke changes.
- `AUDIT.md` / `HANDOFF.md` / `README.md` — **only** where the validator's
  doc-truthfulness rules flag changed figures (e.g. corpus CJK totals); update the
  numbers to the regenerated metrics, nothing else.

Do NOT modify (see also section 13): `data/corpus_manifest.json`,
`data/canonical_locators.json`, `scripts/validate_data.py`,
`scripts/w1_evidence.py`, `scripts/collate_corpus.py`, `scripts/collate_refs.py`,
`app.js`, `app.css`, `index.html`, `.github/workflows/*`, `.scoreboard/*`, any other
corpus file, anything under `sessions/` (append-only evidence), or the W1
registers/reports.

## 7. SUB-TASK BREAKDOWN AND CHECKPOINTS

Each sub-task ends with a checkpoint (section 9's single command). This list IS your
push schedule.

1. **Reference setup.** Acquire the CBETA XML P5 refs per the `collate_corpus.py`
   docstring; extract with `scripts/collate_refs.py` into `/tmp/refs`; verify digests
   against `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`. **`T47n1985` must
   verify byte-identical or you HALT and report** (a drifted/failed ref fetch is an
   environment failure — do not proceed from memory). Run the "before" measurement:
   `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc linji_yulu
   --generated <today's date YYYY-MM-DD> --out /tmp/linji_before.json` and record the
   class counts. → checkpoint
2. **Re-key the 2 DIVERGENT content fields** (`.sections[0].dialogue[1].zh`,
   `.sections[68].dialogue[0].zh`) from the verified `/tmp/refs/ref_T47n1985.txt`
   (verbatim, NFKC, witness punctuation/variants; `ref_window` is only a locator) and
   rewrite each sibling pinyin syllable-by-syllable. → checkpoint
3. **Adjudicate the 6 NOT_FOUND content fields (section idx 67–73), one by one.**
   For each: search the full reference text for the story/section. Passage present in
   the witness (expected for 67, 69, 70, and the death-passage portion of 73) →
   re-key verbatim the full witness passage + pinyin; for the composite section 73,
   witness-absent fragments (e.g. the 傳法偈, if absent) are moved to an additive
   `editorial_note` (R-B) or removed — record the choice. Witness demonstrably lacks
   the element (expected for 71 and 72 — no window, sim 0.0) → either (a) remove the
   content, or (b) retain it with an additive `editorial_note` R-B label (project
   retelling of the biographical story, no T1985 attribution). Retention (b) is the
   default when the retelling is a faithful rendering of the documented story
   (these are famous, attested Linji episodes); removal is a last resort and needs an
   explicit justification. Record every per-field decision (action + one-line
   evidence). → checkpoint
4. **Disclosures.** Rewrite root `coverage_note` on the biyanlu template (status
   line, post-re-key X/89 collate figure, documented residual with reasons,
   "Representation does not establish complete selected-witness status"). Recompute
   root `zh_chars` to the validator's expected computed content CJK count. →
   checkpoint
5. **Allowlist + preservation.** Extend `ALLOWED_CHANGES` with the exact
   `data/corpus/linji_yulu.json` pointers; run `python3
   scripts/test_source_preservation.py` — must pass, including the focused
   nested-`coverage_note` regression. `git diff data/corpus/linji_yulu.json` must
   touch nothing outside the allowlisted pointers (no reformatting of untouched
   content — the preservation test byte-compares against the pinned base). →
   checkpoint
6. **Smoke + regenerate + gates.** Verify the smoke expectations (the `赤肉團`
   query still hits; the `sections.four_shouts` locator pilot section is untouched —
   it is section idx 2, class EXACT, not in your adjudication set); run `node
   scripts/smoke_test.mjs` (all green); then `python3 scripts/validate_data.py
   --write-metrics` (zero errors) and `python3 scripts/build_data_bundle.py`; then
   the full five-gate suite (section 10) including the CI artifact check. →
   checkpoint
7. **Open the ONE pull request** with the full section-15 description. → checkpoint
8. **Canonical state + final.** With the PR number in hand, update
   `.orchestrator/STATE.md` and `.orchestrator/REMEDIATION_PLAN.md` (section 6);
   update AUDIT/HANDOFF/README figures only if the validator flagged them; run the
   five gates one last time; confirm a clean worktree; final push. → final
   checkpoint

## 8. BRANCH AND TARGET

- **Base branch:** `main` (never the orchestrator branch).
- **Target branch:** the non-default `arena/*` working branch your session is already
  on — the platform fixes it; do not switch branches. Only if you find yourself on
  `main`: `git fetch --depth 1 origin +main:refs/remotes/origin/main &&
  git checkout -B feature/linji-r-a-rekey origin/main`. Do not commit on `main`.
- **Orchestrator branch:** `arena/01a08d90-translatechan` — fetch source only; never a
  base, never a target, never receive a push from you.
- **Dependencies:** none for file scope (PR #30 / biyanlu is merged or in final
  hand-back; it touches only biyanlu files, the shared state notes, and regenerated
  artifacts — disjoint from yours). If `main` does not yet contain PR #30 when you
  start, that is fine: your work does not depend on it. Note the open/merged state of
  PR #30 in the PR description under Dependencies.
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
  and read from the named ref. Do not unshallow.

## 10. TECHNICAL REQUIREMENTS

- **Language/style:** surgical JSON edits preserving the file's existing formatting
  (2-space indent, unescaped CJK, stable key order) — untouched content must stay
  byte-identical. Verify with `git diff` that only allowlisted pointers changed.
  Re-keyed text and pinyin style: mirror post-PR #30 `data/corpus/biyanlu_cases.json`
  exactly (section 4).
- Additive `editorial_note` fields: short, factual, project-authored labels
  (biyanlu case-95 pattern: "Project editorial text removed from this source field: …
  No witness attribution for the …."). Validate them against `scripts/validate_data.py`
  — the schema must accept them (both precedents passed).
- **TEST_COMMAND (focused):** `python3 scripts/test_source_preservation.py` — covers
  the changed corpus file, allowlist exactness, and the focused regression; plus
  `python3 scripts/test_source_review_rules.py` (evidence-rule mutation matrix; must
  stay green — you do not touch evidence files).
- **Collation oracle (before/after):** `COLLATION_REFS=/tmp/refs python3
  scripts/collate_corpus.py --doc linji_yulu --generated <today's date> --out
  /tmp/linji_after.json` — record class counts before (sub-task 1) and after
  (sub-task 6).
- **INTEGRATION_TEST_COMMAND:** `node scripts/smoke_test.mjs` — dependency-free
  renderer regression: five-room scope, five ledgers, search across schemas (incl.
  the linji `赤肉團` query), the linji `sections.four_shouts` unit-locator pilot,
  and the in-suite preservation + W1-rule suites.
- **FULL_SUITE_COMMAND (all five gates, in order):**
  `python3 -m py_compile scripts/*.py` → `python3 scripts/validate_data.py` (zero
  errors; run WITHOUT `--write-metrics` at the end to prove committed metrics are
  current) → `python3 scripts/build_data_bundle.py` → `node scripts/smoke_test.mjs` →
  `diff -rq data docs/data`, plus the CI artifact check
  `git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css
  docs/app.js docs/data data/project_metrics.json` (must be clean after the rebuild).
- **COVERAGE_COMMAND:** not configured (the repository has no coverage tooling or
  threshold; do not invent one).
- **MUTATION_TEST_COMMAND:** not warranted — mechanical re-key whose correctness
  oracle is the collation harness itself; the repository's existing mutation matrix
  covers the evidence rules and is run as focused.
- **LINT_COMMAND:** `python3 -m py_compile scripts/*.py` (the only configured lint;
  no JS linter).
- **BUILD_COMMAND:** `python3 scripts/build_data_bundle.py` (deterministic bundle;
  root assets + `docs/` mirror).
- **Browser suite:** `npm run test:browser` (Playwright) is an optional dev-only
  extra. If Chromium cannot be installed/run in your sandbox (a known `ECONNRESET`
  precedent, now twice recorded), skip it and record the skip with the reason — the
  smoke test is the required gate.

## 11. SAFETY AND COMPATIBILITY RULES

- **Must not break:** linji rendering in the five-room reader (74-section
  representation, client-side search incl. `赤肉團`, the `sections.four_shouts`
  unit-locator pilot and its `Section source: T47n1985_p0504a26–p0504a29` disclosure,
  the five always-visible ledgers); the validator's status derivation (linji stays
  `partial_or_failed_w1_collation`; no `complete_selected_witness` claim anywhere);
  byte-identity of every other corpus file; the `docs/` mirror invariant;
  `data/canonical_locators.json` (the locator pilot's data source — do not touch);
  CSP / no-runtime-dependency constraints (no scripts, no inline code, no deps).
- **Must not change:** `data/corpus_manifest.json` statuses; the W1 evidence files
  under `sessions/`; the pinned base commit in
  `scripts/test_source_preservation.py` (`3cc7a8e…`); existing allowlist entries for
  other files; English translation fields (any `*_en`, `translations.*`) — where a
  re-keyed field's meaning materially diverges from the existing translations,
  record it in the PR description as follow-up editorial work; do not re-render
  English in this PR.
- **Backward compatibility:** data + documentation only; no API surface change;
  `window.TranslateChan`, `TRANSLATECHAN_DATA`, and all `translatechan_*`
  localStorage keys untouched.
- **Honest disclosure is the project's moral core:** the finished data must never
  imply witness authority for text that did not collate. When in doubt between
  re-key, remove, and label, choose the option that preserves honesty and record the
  reasoning.

## 12. CLEANUP RULES

- By the final push: no commented-out code, temporary debug logs, ad-hoc test
  scripts, or TODO markers introduced by this PR; no changes to unrelated files; no
  reformatting outside the allowlisted pointers.
- Do not commit the fetched prompt file or anything written to `/tmp`
  (`/tmp/refs`, `/tmp/xmlp5`, `/tmp/linji_*.json` stay out of the repo).
- Intermediate checkpoint commits are exempt from cleanup — clean up once, before
  the final push.

## 13. STRICT BOUNDARIES / OUT OF SCOPE

- Do NOT work the 74 `title_zh` metadata flags (composite-title splitting is a
  separate plan item that touches `app.js` and smoke guards).
- Do NOT change any English/translation field (follow-up editorial task).
- Do NOT flip any `source_review_status`, add a new evidence register, or touch
  `scripts/validate_data.py` / `scripts/w1_evidence.py` / `scripts/collate_*.py`
  (the post-remediation evidence pass is a separate task).
- Do NOT introduce per-section witness provenance (e.g. sourcing 行錄 sections from
  傳燈錄 X80n1565 / 祖堂集 T51n2076). That is a schema + validator + renderer change
  with its own review; if you believe the evidence demands it, record the case in the
  PR description as a proposed follow-up instead of building it.
- Do NOT add rendering for `editorial_note` (structured metadata only — `app.js`
  intentionally has no `editorial_note` handling).
- Do NOT edit `.github/workflows/*` (owner approval required; not needed here).
- Do NOT edit `.scoreboard/*`; never infer, invent, or change any `user_score`;
  fill the PR template's scoreboard section minimally and honestly.
- Do NOT touch other corpus documents, `data/canonical_locators.json`, `sessions/*`,
  or the W1 registers/reports.
- Do NOT push to the orchestrator branch `arena/01a08d90-translatechan`.
- Do NOT rebase after the first push; do NOT force-push.
- Do NOT generate source-looking Classical Chinese from model memory — the verified
  reference file is the only source.

## 14. QUALITY CHECKS

Before opening the PR, verify (exact commands, expected outcomes):

1. `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc linji_yulu --generated <today's date> --out /tmp/linji_after.json`
   → zero DIVERGENT content flags; NOT_FOUND content flags limited to retained
   R-B-labeled sections 71/72 (documented residual) or zero if removed; remaining
   content flags = the 2 MINOR (documented); title flags unchanged at 74. Record
   before/after class counts for the PR description.
2. `python3 scripts/test_source_preservation.py` → exit 0 (preservation + focused
   regression green).
3. `python3 scripts/test_source_review_rules.py` → exit 0 (unchanged evidence rules).
4. `python3 -m py_compile scripts/*.py` → clean.
5. `python3 scripts/validate_data.py` → zero errors (run AFTER `--write-metrics` to
   prove committed metrics are current and docs are truthful).
6. `python3 scripts/build_data_bundle.py` → rebuilds; then
   `git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css
   docs/app.js docs/data data/project_metrics.json` → clean (artifacts committed).
7. `node scripts/smoke_test.mjs` → zero failures (linji locator pilot, `赤肉團`
   search, and all other assertions green).
8. `diff -rq data docs/data` → byte-identical.
9. `git status` → clean; all work pushed to the target branch.
10. Browser suite: run or record an evidenced skip (section 10).

## 15. PR DESCRIPTION REQUIREMENTS

The description is the surviving narrative of a squash merge. It must contain:

- **Summary:** one paragraph — Wave 1, document 3 of the R-A remediation; what the PR
  accomplishes; links/refs to
  `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` → `documents.linji_yulu`
  and `.orchestrator/REMEDIATION_PLAN.md` §1–§2; the merged/open state of PR #30
  under Dependencies.
- **Per-field adjudication table:** for each of the 8 adjudicated content fields
  (2 DIVERGENT + 6 NOT_FOUND): JSON pointer, class → action (re-key / remove /
  R-B-label / split-composite), and one line of evidence (witness location in
  T47n1985, or the "witness demonstrably lacks this passage" finding). State the
  section-71/72 fate decision explicitly with its rationale, and the section-73
  composite handling (which fragment was re-keyed, which moved to `editorial_note`).
- **Before/after collation:** class counts from the harness before (sub-task 1) and
  after (sub-task 6); content-field collate figure (X/89); new total flagged.
- **Documented residual:** the 2 MINOR fields, any retained R-B-labeled NOT_FOUND
  fields, and the 74 `title_zh` metadata flags, and why each is acceptable per
  REMEDIATION_PLAN §1.
- **English follow-up list:** every re-keyed field whose existing translations no
  longer match the new text — recorded as follow-up editorial debt, not done here.
- **Design rationale:** why verbatim re-key from the witness under the adopted R-A
  policy (PR #23 lesson: no reconstruction, no register-window pasting); why the
  行錄 sections the witness carries were re-keyed rather than removed (the work-order
  paraphrase says "retellings"; the reference text was the authority — record where
  the witness carries each story); why any 71/72 text was retained or removed; why
  per-section witness provenance was left to a follow-up; why the status stays
  `partial_or_failed_w1_collation`.
- **Test results:** every section-10 command with its outcome, and any skipped check
  with the reason (browser suite, if skipped).
- **Safety/impact statement:** no status change; no rights implications; no workflow
  edits; no new dependencies; no API surface change; `canonical_locators.json` and
  all other corpus files byte-identical; `docs/` mirror regenerated.
- **Scoreboard section** (per the repo PR template): affected aspects filled
  honestly, no `user_score` changes, gate status unchanged.
