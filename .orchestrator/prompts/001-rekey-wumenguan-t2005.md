# 001 — Re-key Wumenguan (無門關) to the T2005 witness per the W1 collation register

## 0. FETCH AND VERIFY

If you arrived at this file by any route other than fetching it yourself, do so now:

```bash
git fetch --depth 1 origin arena/01a08c93-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/001-rekey-wumenguan-t2005.md > /tmp/task.md
```

Then verify: the file must not be empty and its title must match
`001 — Re-key Wumenguan (無門關) to the T2005 witness per the W1 collation register`.
Write `/tmp/task.md` OUTSIDE the repository. Never commit it, never push it,
never push to the orchestrator branch `arena/01a08c93-translatechan`. Halt and
report if the file is empty or the title mismatches.

## 1. TASK TITLE AND SCOPE

Re-key all re-keyable source-Chinese fields of `data/corpus/wumenguan.json`
from the authoritative CBETA T2005 witness, per the W1 collation register and
the adopted R-A/R-B policy, replacing the failed attempt in PR #23. **Complete
this in ONE pull request.**

## 2. REQUIRED READING ORDER

1. `AGENTS.md` — agent contract, five quality gates, honest-disclosure rules.
2. `.orchestrator/REMEDIATION_PLAN.md` — adopted policy; §1 R-A/R-B rules,
   §1.1 Wave-0 dialogue-marker/variant/recension policy, §2 Wave 1 wumenguan item.
3. `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` — authoritative evidence
   report; read §7 command sequence and the wumenguan sections.
4. `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` →
   `documents.wumenguan` — the 70-entry work order (paths, classes, `ref_window`).
5. `scripts/collate_corpus.py` — docstring (reference acquisition + usage) and
   the classification rules; `scripts/collate_refs.py` — extraction rule.
6. `scripts/test_source_preservation.py` — the ALLOWED_CHANGES gate this PR
   must extend; read the whole file.
7. `data/corpus/wumenguan.json` — the file you are re-keying (renderer fields:
   grep `app.js` for `preface`, `epilogue`, `commentary_zh`, `verse_zh` to see
   what the Reader displays).
8. `scripts/validate_data.py` — the enforced spec (esp. `validate_corpus_document`,
   `validate_w1_evidence`, doc-truthfulness checks).
9. PR #23 (`gh pr view 23 --json body,files` and `gh pr diff 23`) — read as an
   ANTI-EXAMPLE. Its failure modes are listed in §4; do not copy any of its
   output, pinyin, or coverage text.

## 3. PROJECT CONTEXT

Fake Chan Factory (`56eli/translatechan`) is a zero-backend static GitHub Pages
reader for Classical Chinese Chan literature, with an honest-disclosure model:
most English renderings are AI "Robolations" and are labeled as such; source
Chinese must come only from recorded authoritative sources — never from model
memory. Deployment: `data/*.json` → `scripts/validate_data.py` (enforced spec)
→ `data/project_metrics.json` → `scripts/build_data_bundle.py` → root assets +
byte-identical `/docs` mirror. CI runs five gates: `python3 -m py_compile
scripts/*.py`, `python3 scripts/validate_data.py`, `python3
scripts/build_data_bundle.py`, `node scripts/smoke_test.mjs` (which embeds
`test_source_preservation.py` and `test_source_review_rules.py`), and a
committed-artifact diff. All five must pass before the PR.

W1 (a full-corpus collation vs CBETA XML P5) found that only 1 of 35 corpus
documents fully collates to its claimed witness. For wumenguan (T48n2005),
the authoritative register records **70 flagged source fields**: 15
NOT_FOUND, 48 DIVERGENT, 5 MINOR, 2 SHORT_UNMATCHED. Wumenguan's manifest
`source_review_status` is `partial_or_failed_w1_collation` and its
`completion_status` is `partial_selected_witness`; the completion rule is
`complete` ⇔ `complete_selected_witness` + `collated_to_claimed_witness`.
Per-document remediation proceeds under the owner-adopted hybrid policy
(R-A re-key where a witness exists; R-B relabel retained project text;
R-C quarantine the unsourceable). This task is the Wave 1, document 1 R-A/R-B
package.

PR #23 (branch `arena/01a08836-translatechan`, head `4f9c27c8`, title
"Wumenguan T2005 Re-key: Fix 70 flagged fields") attempted this work and was
independently verified as defective (see §4). This task supersedes it and
starts fresh from current `main`. Do not build on, cherry-pick from, or merge
PR #23's branch.

## 4. CONFIRMED FACTS AND CONSTRAINTS

Treat these as true; do not re-derive or second-guess them:

- **The register is the work order.** `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`
  is the authoritative evidence. For every `documents.wumenguan.flagged[]`
  entry, `path` is the JSON pointer (e.g. `.cases[4].dialogue[0].zh`), `class`
  the classification, `corpus` the current (old) field text, `ref_window` the
  best reference window, `also_in` where the probe found the text elsewhere.
- **Class policy:** re-key DIVERGENT (48) and NOT_FOUND (15) fields from the
  witness. Leave MINOR (5) and SHORT_UNMATCHED (2, both `title_zh` fields)
  untouched. Do NOT split/rename `title_zh` fields in this PR (composite-title
  splitting is separate plan work touching the renderer).
- **Witness policy (Wave-0, §1.1 of the remediation plan):** one recension for
  the whole document — the CBETA T2005 宗紹編 text you extract. Re-keyed
  fields reproduce that witness verbatim, NFKC-normalized, preserving the
  witness's own dialogue markers (曰/云/問/…) and graphic variants (説/說,
  爲/為, …) exactly. No repo-wide character or marker normalization.
- **Punctuation:** the CBETA XML carries punctuation; reproduce it verbatim
  (the existing collated fields in the corpus do the same). The extracted
  `ref_*.txt` files are CJK-only for matching purposes — never paste raw
  `ref_window` fragments into the corpus. The register's windows are evidence
  pointers and several are fragmentary (e.g. `.preface.zh` window ends
  mid-sentence at `滯言句`; `.cases[5].dialogue[0].zh` window begins
  `尊昔在靈山` mid-word and ends `破顏微` without 笑). Locate the FULL
  passage in the CBETA XML and re-key the complete, correct span for the
  field's role (dialogue turn = that speaker's utterance; commentary = the
  full 無門曰 passage; verse = the full verse).
- **Epilogue (R-B):** T2005 has no epilogue; the corpus epilogue is
  project-authored. Keep it (the renderer reads it), but add an explicit
  structured provenance field to the `epilogue` object marking it
  project-authored with NO witness attribution (e.g. `"editorial_note":
  "Project-authored verse; T48n2005 contains no epilogue. No witness
  attribution."`). Keep `zh`/`pinyin`/translations of the epilogue untouched.
  Do not delete it, do not re-key it.
- **Pinyin:** for EVERY zh field you change, rewrite the sibling `pinyin`
  field (and `verse_pinyin`, `commentary_pinyin` where present) so it
  corresponds syllable-by-syllable to the NEW zh. Hand-align it; follow the
  file's existing conventions (tone marks, spacing between syllables, commas/
  periods mirroring zh punctuation, colon + quotes around speech, initial
  capital per sentence). PR #23's pinyin is garbage — never copy it. If a zh
  change makes a neighboring pinyin stale, that pinyin is part of your scope.
- **Translations are OUT OF SCOPE for editing.** Do not modify any English
  text or translation `status`/`source_id` fields. Wording audits for the
  English layer are W2, a separate work item. Where a re-keyed zh makes an
  existing English rendering incoherent, LIST the pair in the PR description
  (deferred list) — do not edit it.
- **Statuses are derived, not declared by hand.** `validate_data.py` +
  `scripts/w1_evidence.py` recompute manifest `source_review_status` counts
  from the committed evidence files on every run. This PR must NOT edit
  `data/corpus_manifest.json` statuses, NOT edit any file under `sessions/`
  (append-only evidence), and NOT hand-write any "collated" claim. After this
  PR, wumenguan's status legitimately remains `partial_or_failed_w1_collation`
  until the post-remediation evidence pass re-derives it.
- **PR #23 failure modes (do not repeat):** (a) 65/70 flagged fields left
  untouched; (b) 4 zh fields were truncated register-window fragments pasted
  verbatim; (c) 1 zh field corrupted (`香嚴`→`香嚹` in
  `.cases[4].dialogue[0].zh`); (d) 8 pinyin fields garbled or desynced; (e)
  `coverage_note` rewritten to claim "Complete —", which is false and
  violates the completion rule; (f) branch based on stale main. Your PR must
  fix all 63 re-keyable fields, leave the 7 excluded fields documented as
  untouched, keep pinyin truthful, and keep the non-complete honest wording.

## 5. CORE OBJECTIVE

Every flagged field in `data/corpus/wumenguan.json` is either re-keyed from
the CBETA T2005 witness (R-A) or explicitly and honestly labeled
(R-B epilogue), with a fresh `collate_corpus.py --doc wumenguan` run as the
mechanical acceptance criterion, all five quality gates green, and the
project's completion invariant intact.

**Done means:** (1) the 63 re-keyable fields (15 NOT_FOUND + 48 DIVERGENT)
re-keyed verbatim from the witness with matching pinyin; (2) the 5 MINOR and
2 SHORT_UNMATCHED fields byte-identical to main; (3) epilogue structured-label
added, text untouched; (4) a local re-run of the collation harness reports the
before/after table in the PR description; (5) `scripts/test_source_preservation.py`
ALLOWED_CHANGES extended with exactly the pointers you changed; (6) all five
gates pass; (7) PR opened with the required description.

## 6. EXACT DELIVERABLES

- **Modify: `data/corpus/wumenguan.json`** — re-keyed zh fields + matching
  pinyin for the 63 re-keyable flagged fields; structured provenance field on
  the `epilogue` object; updated `zh_chars` (set to the computed value the
  validator reports; current declared value is 5528 and will change);
  `coverage_note` updated honestly, in the style of main's current note but
  with post-re-key figures — MUST contain "48/48 cases represented" and the
  W1 status disclosure `partial_or_failed_w1_collation`, MUST NOT contain any
  "Complete" claim, and should state the documented residual after the re-run
  (expected residual: the 5 MINOR + 2 SHORT_UNMATCHED fields + the
  project-authored epilogue).
- **Modify: `scripts/test_source_preservation.py`** — extend
  `ALLOWED_CHANGES["data/corpus/wumenguan.json"]` with exactly the JSON
  pointers you changed in that file (each re-keyed `zh`, each rewritten
  `pinyin`, `.epilogue.<new-field>`, `.zh_chars`; `.coverage_note` is already
  allowed). Keep `BASE_COMMIT` pinned at
  `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43`. Update the module docstring
  prose (it currently says "only permitted corpus differences are two exact
  JSON pointers") to describe the remediation-aware allowlist without
  weakening the rule's mechanics. The nested-regression test must still pass.
- **Modify: `data/project_metrics.json`** — regenerate via
  `python3 scripts/validate_data.py --write-metrics` (or the metric update
  the validator itself performs); never hand-edit figures.
- **Modify: `app_data.js`, `docs/app_data.js`, `docs/data/**` mirror** — via
  `python3 scripts/build_data_bundle.py`. Never hand-edit.
- **Modify (only as the validator demands): `README.md`, `HANDOFF.md`,
  `AUDIT.md`, `ROADMAP.md`, `index.html`** — the doc-truthfulness checks
  guard aggregate CJK totals (currently "103,723 source-content CJK
  characters (or 109,181 across every corpus JSON string)") and other
  metrics that change when zh text changes. Run the validator; fix exactly
  the failing claims with the values it reports. `.orchestrator/STATE.md`
  must keep quoting the authoritative W1 flagged total (630) — that figure
  is register-derived evidence and does not change in this PR.
- **Modify: `.orchestrator/STATE.md`** — under Task Queue, mark the
  wumenguan remediation item done with this PR number; in the queue note that
  PR #23 is superseded (verdict DO-NOT-MERGE); keep the standing decisions
  intact.
- **Modify: `.orchestrator/REMEDIATION_PLAN.md`** — check the wumenguan box
  in the §5 Wave checklist (`- [ ] Wave 1: wumenguan ☐ …` → `[x]`).

## 7. SUB-TASK BREAKDOWN AND CHECKPOINTS

Each step is a push point — commit and push after every step (see §9).
This list IS your push schedule.

1. Preflight: read all required-reading files; acquire the CBETA refs per the
   `collate_corpus.py` docstring (sparse checkout of `cbeta-org/xml-p5`,
   extract with `collate_refs.py`, verify digests against
   `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`); record the witness
   text locations (file/行号) you will use. If the network blocks acquisition,
   HALT and report the blocker — do not re-key from memory.
   → commit + push
2. Re-key `preface.zh` + the flagged fields of cases 0–10 from the XML
   (full passages, witness punctuation/markers verbatim). → commit + push
3. Re-key the flagged fields of cases 11–22. → commit + push
4. Re-key the flagged fields of cases 24–47; add the epilogue structured
   provenance field. → commit + push
5. Rewrite sibling pinyin for every changed zh field (hand-aligned, file
   conventions). → commit + push
6. Update `coverage_note` + `zh_chars`; extend
   `scripts/test_source_preservation.py` ALLOWED_CHANGES + docstring.
   → commit + push
7. Regenerate metrics and the bundle/mirror
   (`validate_data.py --write-metrics` then `build_data_bundle.py`); fix any
   doc-truthfulness claims the validator reports. → commit + push
8. Update `.orchestrator/STATE.md` and `.orchestrator/REMEDIATION_PLAN.md`;
   run the complete verification suite (§10, §14); open the PR with the full
   description (§15). → commit + push

## 8. BRANCH AND TARGET

- **Base branch:** `main` (fetch latest origin/main first). Never branch from
  the orchestrator branch.
- **Target branch:** your Arena-provisioned session branch
  `arena/<session>-translatechan`, which already exists locally in this
  environment (project contract: AGENTS.md "Working branch"). If it is
  absent, create it from `main` before the first checkpoint.
- **Orchestrator branch:** `arena/01a08c93-translatechan` — fetch source
  only, never a base or target.
- **Dependencies:** none. Do not depend on PR #23; it is superseded.
- **Resuming:** fresh branch from `main`. Do not reuse PR #23's branch.

## 9. WORK PERSISTENCE AND PUSH CADENCE

Your session can expire without warning; unpushed work is lost. Checkpoint
after each sub-task in §7 and before any long or risky operation (ref
acquisition, full validator run, build). There is no time-based rule — §7 is
your push schedule. A checkpoint is ONE command, not a procedure:

First push (sets upstream):
```bash
git add -A && git commit -qm "chore: wip <sub-task>" && git push -qu origin <branch>
```
Every push after:
```bash
git add -A && git diff --cached --quiet || { git commit -qm "chore: wip <sub-task>" && git push -q; }
```

- Checkpoint commits may be broken — that is expected and fine.
- Never commit secrets. Never commit the fetched prompt or anything from
  `/tmp`. Never commit extracted CBETA refs (they live outside the repo).
- Never push to the orchestrator branch. Never force-push.
- Sync rule: rebase onto `origin/main` ONLY before your first push. After the
  first push: `git fetch origin main && git merge --no-edit origin/main`.
- On merge conflict: halt and report the conflicting files.
- Open ONE PR at the end, when quality checks pass. No draft PR first.

## 10. TECHNICAL REQUIREMENTS

Language: Python 3.12 (tooling) + hand-curated JSON data. No runtime JS
changes in this PR. Style: follow the existing patterns in
`data/corpus/wumenguan.json` and the five-gate contract in `AGENTS.md`.

- TEST_COMMAND: `node scripts/smoke_test.mjs` — must print "✅ SMOKE TEST
  PASSED", including "SOURCE-PRESERVATION OK" for 34 files and the wumenguan
  allowlist, and "W1 SOURCE-REVIEW RULES OK". Additionally
  `python3 scripts/test_source_review_rules.py` — must pass (11-case mutation
  matrix).
- INTEGRATION_TEST_COMMAND (the mechanical acceptance for this task):
  `COLLATION_REFS=<refs-dir> python3 scripts/collate_corpus.py --doc wumenguan
  --out /tmp/wumenguan_after.json` — then diff its `documents.wumenguan`
  `summary`/`flagged` against the authoritative register's wumenguan section.
  Report the before/after table in the PR description (§15). The re-keyed
  fields must no longer appear as NOT_FOUND/DIVERGENT; the documented
  residual is 5 MINOR + 2 SHORT_UNMATCHED + epilogue (NOT_FOUND, R-B).
- FULL_SUITE_COMMAND: the five gates —
  `python3 -m py_compile scripts/*.py` ;
  `python3 scripts/validate_data.py` (and `--write-metrics` once) ;
  `python3 scripts/build_data_bundle.py` (run twice; identical hashes) ;
  `node scripts/smoke_test.mjs` ; `diff -rq data docs/data` ;
  plus `git diff --check` and `git status --short` clean.
- COVERAGE_COMMAND: not configured (no code coverage tooling; data PR).
- MUTATION_TEST_COMMAND: not warranted — the acceptance evidence is the
  deterministic collation re-run, the preservation gate, and the validator's
  recomputation; the existing `test_source_review_rules.py` mutation matrix
  is part of TEST_COMMAND.
- LINT_COMMAND: `python3 -m py_compile scripts/*.py` (repo's only lint).
- BUILD_COMMAND: `python3 scripts/build_data_bundle.py`.
- Optional (report as skipped if Chromium unavailable; never describe the
  design as screenshot-verified): `npm run test:browser`.

## 11. SAFETY AND COMPATIBILITY RULES

- Do not alter any source-Chinese field that is NOT in the flagged list
  (except the sibling pinyin that must follow a changed zh — those are
  deliberate and must be listed in the PR description).
- Do not change any English translation, translation `status`, `source_id`,
  or rights field. Do not touch `data/translations/**`, `rights_manifest.json`.
- Do not change manifest `source_review_status`/`completion_status` values.
- Do not edit anything under `sessions/` (append-only evidence).
- Do not edit `.github/workflows/*`, `.scoreboard/**`, `SCOREBOARD.md`.
- Do not change renderer behavior: no `app.js`/`app.css`/`index.html`
  structural edits (index.html only if a guarded metric string demands it).
- Do not touch other corpus documents, the gong'an/lineage/glossary layers.
- Do not add, remove, or rename corpus fields the renderer reads (`zh`,
  `pinyin`, `verse_zh`, `commentary_zh`, `title_zh`, `coverage_note`,
  `zh_chars`, translation maps). The epilogue's new field is additive only.
- The completion rule is absolute: no path may display or record "Complete"
  for wumenguan while `source_review_status` is `partial_or_failed_w1_collation`.

## 12. CLEANUP RULES

By the final push: no commented-out code, no debug prints, no scratch scripts
committed, no TODO/FIXME markers introduced, no `/tmp` artifacts in git, no
extracted CBETA refs in git, no fetched prompt file in git. Do not reformat
JSON outside the fields you changed (the repo uses 2-space indent, trailing
newline — keep `git diff --check` clean). Intermediate checkpoint commits are
exempt; clean up once before opening the PR.

## 13. STRICT BOUNDARIES / OUT OF SCOPE

- Do NOT push to the orchestrator branch.
- Do NOT merge, close, or comment-as-owner on PR #23. Do NOT reuse its branch
  or copy its text.
- Do NOT touch the 2026-09-09 or 2026-09-10 evidence files, or write a new
  evidence overlay (the post-remediation evidence pass is a separate task).
- Do NOT re-key from model memory or from the register's `ref_window`
  fragments — from the extracted CBETA XML only.
- Do NOT perform any other document's remediation, W2 quotation audits,
  scoreboard edits, workflow edits, or visual redesign.
- Do NOT split `title_zh` composite fields.
- Do NOT claim source-review status changes; do NOT change
  `data/corpus_manifest.json`.

## 14. QUALITY CHECKS

Before opening the PR, run and record:

1. `python3 -m py_compile scripts/*.py` — exit 0.
2. `python3 scripts/validate_data.py` — "✅ DATA VALIDATION PASSED".
3. `python3 scripts/build_data_bundle.py` twice — identical `sha256sum
   app_data.js docs/app_data.js` across both runs; `diff -rq data docs/data`
   clean.
4. `node scripts/smoke_test.mjs` — "✅ SMOKE TEST PASSED" with
   SOURCE-PRESERVATION and W1 RULES OK.
5. `python3 scripts/test_source_review_rules.py` — exit 0.
6. `python3 scripts/test_source_preservation.py` — exit 0 (allowlist
   extended correctly).
7. The collation re-run (`--doc wumenguan`) — capture the after-summary.
8. `git diff --check` clean; `git status --short` clean; all work pushed.

## 15. PR DESCRIPTION REQUIREMENTS

The PR description must contain:

- **Summary:** what was re-keyed and why; one sentence stating this PR
  supersedes PR #23 (which is DO-NOT-MERGE: 65/70 fields untouched, truncated
  window fragments pasted as text, one corrupted field, garbled pinyin, false
  "Complete" claim).
- **Before/after table** from the collation re-run: per class (EXACT /
  REWORDED / MINOR / DIVERGENT / NOT_FOUND / TITLE_COMPOSITE /
  SHORT_UNMATCHED / WITNESS_UNAVAILABLE), before = authoritative register
  wumenguan section, after = `/tmp/wumenguan_after.json` results; plus the
  documented residual (5 MINOR + 2 SHORT_UNMATCHED + R-B epilogue) and why
  each residual is acceptable.
- **Per-field decisions:** for each changed field: register path, class,
  decision (re-keyed / untouched-MINOR / untouched-SHORT_UNMATCHED /
  R-B-labeled), and witness locator (CBETA file + XML element context).
  List the fields whose pinyin you rewrote because zh changed.
- **Deferred incoherent translation pairs** (if any) — pairs where the
  existing English no longer matches the re-keyed zh, listed for the W2/
  translation layer.
- **Safety statement:** no English/translation/rights/status edits; no other
  document touched; no evidence files touched; ALLOWED_CHANGES extended
  pointer-by-pointer and BASE_COMMIT unchanged; completion invariant intact;
  all five gates green with outputs.
- **Verification commands and results** (exact command lines + key output
  lines), including the collation re-run.
- **Files changed** list, and a note that `sessions/` evidence and the
  correction register were deliberately not modified.

Do not merge the PR. Do not mark it complete-witness. Leave a concise
handoff note in the PR for the next Wave 1 document (biyanlu_cases).
