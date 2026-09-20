# P0 — Integrity & Trust Baseline — 2026-09-19

**Task:** 042 — P0 Integrity & Trust Baseline (dispatch prompt `.orchestrator/prompts/042-p0-integrity-trust-baseline.md`, stub `.orchestrator/stubs/042-STUB-FORMATTED.md`).
**Purpose:** prove every P0 gate reproduces the auditor's independent verification on the post-retirement baseline, verify the Pages-law retirement state, correct stale tracker text, and publish the corrected counts as the trust reference for P1–P6 dispatches (`ROADMAP_100PCT_600-1400_2026-09-19.md` § "Auditor baseline — trust").
**Date:** 2026-09-19 (session work landed 2026-09-20).
**Scope held:** no corpus edits (`git diff --name-only 274dc2a..HEAD -- data/` is empty for this PR's own changes), no Pages work, no workflow edits, no new dependencies.

## 0. Base and branch record (disclosed upfront)

- Dispatch stated: base `main 274dc2a`, target `fix/p0-integrity-trust-baseline`, required reading on `origin/main`.
- **Branch mismatch (as anticipated by prompt §16):** at execution time `origin/main` was exactly `274dc2a` and did **not** contain `ROADMAP_100PCT_600-1400_2026-09-19.md` / `NEXT_TASKS_2026-09-19.md` — those, the law-strip and the workflow retirement live in `13b4bb1` ("chore: strip Pages laws and add 100% roadmap — final clean on top of main 274dc2a"), parent of the orchestrator dispatch head `b767fa0` on `arena/01a09829-translatechan`, not yet merged to main.
- This session branch `arena/01a0c046-translatechan` was pinned at `274dc2a`; it was **fast-forwarded to `b767fa0`** so every verification below runs against the intended baseline (13b4bb1's stripped tree + the dispatch prompt/stub). Working branch never changed.
- `fix/p0-integrity-trust-baseline` is not pushable from this session; the PR carries the task title instead (see §6).

## 1. Gates — verbatim outputs (baseline `b767fa0`, clean tree)

```console
$ python3 -m py_compile scripts/*.py
[exit 0]
```

```console
$ python3 scripts/validate_data.py
⚠️  data/lineage/masters.json[30]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/lineage/masters.json[32]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/lineage/masters.json[33]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  schemas/translatechan-data.schema.json: jsonschema library not installed — declarative schema was not executed this run (pip install jsonschema to enable; see scripts/validate_data.py run_json_schema_checks)
⚠️  data/gongan/gongan_index.json[2]: protagonist 'juzhi' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[3]: protagonist 'huoan_shiti' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[4]: protagonist 'xiangyan_zhixian' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[5]: protagonist 'shakyamuni_and_mahakasyapa' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[14]: protagonist 'dongshan_shouchu' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[16]: protagonist 'zhimen_kuan' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[23]: protagonist 'huangbo' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
✅ DATA VALIDATION PASSED
   corpus=35 | slots=1252 | verified=177 | matrix=21 | locators=148/148
   W1 source review: collated=1 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-10 → sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json
[exit 0]
```

Eleven `⚠️` advisory lines, zero failures: the 3 empty-links are the known unlinked frontier scaffolds (§2.3), and the 7 `gongan` protagonist notices name intentionally unprofiled figures. `flagged=630` is the authoritative register designation; the 532 current-state figure is the measurement (§3).

```console
$ python3 scripts/build_data_bundle.py
Bundling TranslateChan Classical Corpus...
✅ Successfully compiled 35 corpus documents: /home/user/translatechan/app_data.js (1,693,251 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)
[exit 0]
```

Deterministic and byte-identical: after the rebuild `git status --short` lists nothing — the committed `app_data.js`, `/docs` mirror and `data/project_metrics.json` are reproduced exactly (1,693,251 B, matching the roadmap figure).

```console
$ python3 scripts/test_source_preservation.py   # tail (35 per-file ℹ️ allowlist enumerations above the summary)
35 corpus files compared
373 permitted allowlisted changes
0 unauthorized changes
✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes
[exit 0]
```

0 unauthorized / 373 permitted vs pinned base `3cc7a8e9681e` — the allowlist is exactly the merged remediation pointers; no re-designation was attempted. (Full per-file pointer enumeration is one ℹ️ line per changed document; re-run the command to print it.)

```console
$ python3 scripts/test_source_review_rules.py
Focused mutation partition: exit=1, metrics_byte_identical=True
Focused mutation report-metadata: exit=1, metrics_byte_identical=True

  corpus *_note keys measured now (data-driven):
    cbeta_note       occurrences=18  files=18  app.js mentions=2   nodes=$ -> RENDERED
    coverage_note    occurrences=33  files=33  app.js mentions=4   nodes=$ -> EXEMPT
    editorial_note   occurrences=16  files=8   app.js mentions=2   nodes=$.cases[], $.cases[].dialogue[], $.epilogue, $.sample_records[].dialogue[], $.sections[], $.sections[].dialogue[], $.stanzas[] -> RENDERED
    recension_note   occurrences=14  files=1   app.js mentions=2   nodes=$, $.chapters[], $.chapters[].dialogue[], $.chapters[].verses[] -> RENDERED

138 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK
[exit 0]
```

138 PASS. The data-driven census in the same run independently reproduces §2.4's note numbers (18+14+33+16 = 81; 18+16+14 = 48 rendered, 33 coverage ledger lines exempted).

```console
$ node scripts/smoke_test.mjs
DATA loaded. corpus keys: 35
APP executed + init() completed without crash
RENDERER: 35 corpus texts exercised, 0 crashes
W1 source-review rule suite: ✅ W1 SOURCE-REVIEW RULES OK
Source-preservation suite: ✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes
RENDER-LAZY: hidden rooms rendered on first tab activation

✅ SMOKE TEST PASSED
[exit 0]
```

```console
$ git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json
[exit 0]
```

Mirror diff clean — generated artifacts and the deploy mirror are committed byte-identical (a hard step in the retired `quality.yml`, no `continue-on-error`).

## 2. Corrected counts — verified against live data, not tracker prose

### 2.1 Translator profiles: 21, not 3

```console
$ jq '.profiles | length' data/translations/translator_profiles.json
21
```

The stale "3" was the file's top-level key count — `["methodology","profiles","schema_version"]` — read as profiles by a previous tracker; inside `.profiles` there are 21 registers, carried by 4 exemplar passages. 21 also equals `matrix=21` in validate output.

### 2.2 Per-document content-field totals: range 2–395, not 0–6

```console
$ jq '.corpus.per_text | to_entries[] | [.key, .value.source_review.content_fields_total, .value.source_review.content_fields_collated]' data/project_metrics.json | sort
["baizhang_guanglu",6,0]
["baojing_sanmei",6,2]
["biyanlu_cases",395,353]
["bodhidharma_erru",6,1]
["caoxi_zhuan",4,0]
["chuandenglu",6,1]
["dahui_hongzhi",6,0]
["dahui_shobogenzo",4,0]
["dazhu_huihai",6,0]
["deshan_yulu",6,0]
["dongshan_yulu",21,1]
["fayan_yulu",11,1]
["foyan_qingyuan",6,0]
["guiyang_yulu",6,0]
["hanshan_poems",4,0]
["huangbo_chuanxin",11,2]
["huangbo_wanling",7,0]
["lidai_fabao_ji",3,0]
["linji_yulu",89,79]
["mazu_yulu",8,0]
["nanquan_yulu",6,0]
["niutou_juezhu",5,0]
["platform_sutra",13,4]
["qinggui_monastic_codes",5,0]
["sengzhao_zhaolun",4,0]
["shitou_sandokai",11,6]
["wudeng_huiyuan",3,0]
["wumenguan",181,113]
["xinxin_ming",37,24]
["xuansha_yulu",5,0]
["xuefeng_yantou",4,0]
["yuanwu_letters",2,0]
["yunmen_yulu",12,0]
["zhaozhou_yulu",19,0]
["zhengdao_ge",6,6]
```

min=2 (`yuanwu_letters`), max=395 (`biyanlu_cases`), n=35 documents — verified with `jq '[.corpus.per_text[].source_review.content_fields_total] | {min: min, max: max, docs: length}'` → `{"min":2,"max":395,"docs":35}`. The stale "0–6" range was a sample of small excerpt seeds taken as the distribution; no document has 0 fields.

### 2.3 Lineage: 31/34 masters linked

`data/lineage/masters.json` holds 34 masters; 31 carry a non-empty `linked_corpus_keys`. The three unlinked frontier scaffolds are exactly `prajnatara`, `yangqi_fanghui`, `dahong_zuzheng` — the same three the validator surfaces as advisories above. All 30 edges remain `traditional_link_pending_exact_locator` (P3 work; nothing moved here).

### 2.4 Provenance notes: 81 strings, 48/81 rendered

`cbeta_note` 18 (rendered) + `recension_note` 14 (rendered) + `editorial_note` 16 (rendered) + `coverage_note` 33 (exempt dossier-ledger lines) = **81**, with **48/81** rendered at 26 document sites per the `vision.md` 2026-09-17 refresh; the rule suite's data-driven census (§1) reproduces the occurrences and per-key RENDERED/EXEMPT state from the current tree.

## 3. Auditor baseline confirmation

Confirmed as stated in `ROADMAP_100PCT_600-1400_2026-09-19.md`: **the factual core is sound and the previously unreliable edges are corrected.**

- Core, each re-reproduced this run (§1): 35 docs · 1,252 slots (177 verified / 876 reconstructions / 199 AI drafts) · 21 matrix registers · 148/148 locators · 630 flagged authoritative · 0 unauthorized / 373 permitted vs `3cc7a8e9681e` · 138 rule checks · 1,693,251 B deterministic byte-identical bundle · smoke 35 texts.
- Flag figures, both registers verified against the committed files: authoritative `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` `{"documents":35,"flagged_entries":630,"content_fields_total":924,"content_fields_collated":593}`; measured `sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json` `{"documents":35,"flagged_entries":532,"content_fields_total":924,"content_fields_collated":691}`; status counts identical in both (`1 / 32 / 2`). **630 stays the authoritative designation, 532 stays the post-remediation measurement** — no re-designation was performed or implied by this PR.
- Edges corrected (were stale tracker prose, now verified against live data): profiles 3→21 (§2.1), field range 0–6→2–395 (§2.2), 31/34 masters linked (§2.3), 81 notes 48 rendered (§2.4).
- `vision.md` §1.1 objectives stand at full strength, not renegotiated (Congronglu remains a named goal, quarantined at 0 cases); its dated figures are self-labelled as the last full recompute and were left untouched per that convention.

## 4. Pages-law retirement verification

- **No verbatim law remains.** `grep -R "In no way is the website beautiful" --include="*.md" --include="*.py" --include="*.yml" . | grep -v ".orchestrator/local"` → no matches (exit 1). A full-tree grep (no include filters, excluding `.git`) also finds nothing; what remains are only retirement sentences describing the stripped law in shorthand (this file, the STATE.md Pages-Scope replacement line, ROADMAP/NEXT_TASKS, and prompt 042 itself).
- **RULING_WEBSITE is the out-of-scope notice only.** `.orchestrator/RULING_WEBSITE_2026-09-14.md` is now exactly: title `# Pages Scope — 2026-09-19` + the sentence "github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for".
- **Original law in history — anchor corrected.** The dispatch and roadmap cited `6076170` for the law text; verified via the GitHub contents API, `6076170b965f` is the PR #44 merge of **2026-09-13** ("give the canonical tracker a cold-start continuation block") and contains **zero** occurrences of the ruling sentence in STATE.md, RULING_WEBSITE, OPERATIONS.md. The commit where the full law verbatim actually entered main's history is `6a00d9f453e92650a882dbcff84b82bb9409b799` (2026-09-17, "chore: LAW — enforce website ruling via failing gate + CI (Edit4)"), which carries the verbatim law in `.orchestrator/RULING_WEBSITE_2026-09-14.md` (1 occurrence). ROADMAP corrected in §5.
- **quality.yml retired to text-integrity only.** Steps now: checkout, Python/Node setup, `py_compile`, `validate_data`, `build_data_bundle`, `test_source_preservation`, `test_source_review_rules`, hard (non-tolerated) mirror-diff, `smoke_test`. No per-variant acceptance gate, no website-ruling gate, no `continue-on-error` step. `scripts/check_layout_variant.py` and `scripts/test_website_ruling.py` are deleted. Not edited by this PR (AGENTS.md §6 / prompt §11 — workflow is owner-controlled; verification only).

## 5. Stale tracker text corrected in this PR

1. `.orchestrator/STATE.md` 2026-09-18 variant-36 section: the law-strip sed had mechanically corrupted the recorded gate command to `python3 scripts/pages scope out of scope 36`; restored to what actually ran (`python3 scripts/check_layout_variant.py 36`), noted the script's 2026-09-19 deletion, and appended a dated supersession line closing the stale "owner rates variant 36 … Batch 1" next-step (PR #91 deleted the layouts; OPERATIONS Edits 4–6 retired the track).
2. `.orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md`: history anchor `6076170` → verified `6a00d9f453e9`, with the discrepancy recorded (§4).
3. `.orchestrator/STATE.md` Task Queue: P0 marked done, pointing at this file.

Nothing under `data/`, `docs/`, `schemas/`, `scripts/`, or the tracked root assets was touched beyond this file and the two tracker documents.

## 6. Hardening report

- **Branch mismatch:** recorded in §0 — required-reading files were not yet on `origin/main`; consumed from dispatch head `b767fa0` via read-only `git show`/`git ls-tree`, then fast-forwarded this session branch onto it; PR target `fix/p0-integrity-trust-baseline` not pushable from the session (fixed to `arena/01a0c046-translatechan`), so the PR from the session branch carries the task.
- **BANNED COMMANDS guard observed:** no bare `git show <sha>`, no `git show | head`, no `git log -p`, no bare `git diff` on the bundle — only `--stat`, `--name-only`, `--oneline`, `ls`, `cat`; the bundle was only ever compared via `git diff --exit-code`.
- **Corpus integrity:** zero edits to `data/corpus/*.json`; allowlist untouched; preservation 0 unauthorized / 373 permitted.
- **Pages out of scope:** no deployment/creation work, no layout work, no Pages claims (no judgment of beauty/done in either direction — scope retired).
- **Cleanliness:** no `__pycache__` committed (git-ignored), no committed refs, worktree clean apart from this PR's three edited/new files; no new dependencies; no secrets.
- **Post-edit re-run:** `validate_data`, `py_compile`, build+mirror diff and smoke re-run after the document edits — all green (doc edits sit outside the validator's truthfulness surface but were checked regardless).
