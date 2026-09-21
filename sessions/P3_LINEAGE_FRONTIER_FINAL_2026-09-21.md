# P3 LINEAGE FRONTIER FINAL — 2026-09-21

Task 055 (P3 Lineage Frontier Finalization): resolve the four P3 frontier edges and the
X1565 lb anchors; final state 0 unexplained pending (verified, or documented-intentional
frontier). Branch: this Arena session is fixed to `arena/01a0c39c-translatechan` (the
task stub's nominal branch `fix/p3-lineage-frontier-final` was not used, per session
branching rules).

## 1. Baseline state (measured, before any edit)

- Working tree at `5bb40f0` (the local tip == `main`; the stub's `e2ee031` is not in the
  local squashed history — the tree already matches the described base state).
- `validate_data.py`: **exit 1** — 2 errors (stale all-string CJK in README:85 / AUDIT:26,
  `917,778` vs live `917,810`), 10 warnings (2 of them the lineage
  `linked_corpus_keys is empty` warnings for `yangqi_fanghui` [33] and `dahong_zuzheng` [34]).
- `test_source_preservation.py`: **FAILED** — 8 unauthorized changes (P2 retry 054's
  document- and section-level `editorial_note` additions in `dazhu_huihai.json` and
  `nanquan_yulu.json` were never allowlisted) + the focused allowlist self-check failure
  that follows from it ("the temporary copy fails before any mutation").
- `scripts/smoke_test.mjs`: **3 failures** — (a) review-rules subprocess red from the same
  doc drift, (b) preservation subprocess red from the same allowlist gap, (c) the batch-1
  census pin `10 exact locators / 21 locator pending` vs the live 18/4 summary.
- `scripts/test_lineage_batch1.py`: red on its stale census asserts (10 exact / 21 pending).
- Lineage: 31 edges = 18 `exact_locator_verified` + 9 `source_verified` + 4
  `traditional_link_pending_exact_locator`; 4 `frontier_unprofiled` entries; profile queue
  1 in_review / 30 needs_exact_locator / 4 frontier_source_needed.
- Bundle: 8,763,968 B, 44 documents.

## 2. X1565 extraction and digest verification

Witness pin: CBETA XML P5, upstream repo `https://github.com/cbeta-org/xml-p5`,
**revision `dbdea41071e1e260ad84b72faefd4587333cf76d`** — the exact revision this project
already pins (the stub's "dbdea410"). Commands:

```
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
git -C /tmp/xmlp5 sparse-checkout set --no-cone X/X80/X80n1565.xml
git -C /tmp/xmlp5 checkout
git -C /tmp/xmlp5 rev-parse HEAD
# → dbdea41071e1e260ad84b72faefd4587333cf76d
```

Extraction (the stub's `--work-list X80n1565` is a work id; the script takes a file, so a
one-line work list was written):

```
printf 'X80n1565\n' > /tmp/worklist.txt
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
  --work-list /tmp/worklist.txt --write-digest-manifest /tmp/refs/manifest.txt \
  --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
  --report /tmp/refs/extraction_report.json
```

Result (`/tmp/refs/extraction_report.json`, rule `cbeta-p5-body-cjk-v1`):

- `ref_X80n1565.txt`: **581,588 CJK characters**, one line, no trailing newline
  (the stub's "1.3M CJK" estimate is not what the pinned extraction measures; the
  measured count is recorded here and in the data notes).
- sha256 digest (manifest `/tmp/refs/manifest.txt`):
  `a3d20a107ff69495609d555f261d28af9c4de62952fde0b32ac630dbcfe56766  ref_X80n1565.txt`
- digest verification status: `unlisted` (X80n1565 has no historical digest in the
  39/40-work pinned manifests — first extraction of this work into this pipeline; the
  digest is now recorded in this report, the source record, and the edge/master notes).
- X80n1565.xml checked out: 4.6 MB; pagination is X80 volume pagination (first lb
  `0028a01`), so X1565 locators are `pXXXXcXX` in that scheme.

lb-anchor mapping: a deterministic walk of the TEI tree using exactly the `collate_refs.py`
rule (drop `tei:note`/`tei:g` subtrees, keep tails, CJK-only) was recorded with every
`tei:lb @n` and every `tei:milestone unit='juan'` as an offset event; the joined CJK text
asserts byte-equal to `ref_X80n1565.txt`, then any substring maps to juan + start lb +
end lb (last lb marker at/before each offset). All locators below were measured that way
and every quoted fragment is a verbatim substring of the extraction.

## 3. Per-frontier results (old → new)

All witnesses: T2076 = `chuandenglu_full` (1,274 units, T51n2076 @ `dbdea410`); X1565 =
freshly extracted per §2. Verbatim text below is whitespace-joined, XML apparatus omitted.

### 3.1 prajnatara → bodhidharma — `traditional_link_pending_exact_locator` → `exact_locator_verified`

- Reference: `T51n2076_p0216a19–p0216b20 · fasc. 2 · 第二十七祖般若多羅 · chuandenglu_full case 38 + T51n2076_p0217a09–p0220b22 · fasc. 3 · 第二十八祖菩提達磨 · case 41`
- Verbatim (case 41, the 28th patriarch): `本名菩提多羅後遇二十七祖般若多羅至本國受王供養知師密迹因試令與二兄辨所施寶珠發明心要既而尊者謂曰汝於諸法已得通量夫達磨者通大之義也宜名達磨因改號菩提達磨` — the 28th patriarch was originally named Bodhidatta, met the 27th patriarch Prajñātāra, and was renamed Bodhidharma by him.
- Verbatim (case 38 close, the transmission): `我今囑汝聽吾偈曰心地生諸種因事復生理果滿菩提圓華開世界起`
- Corroborated in X1565 juan 1 (the 28-patriarch section): 第二十七祖般若多羅尊者 case at p0025a16, 第二十八祖菩提達磨 case at p0026a10 (`本名菩提多羅後遇二十七祖般若多羅…`).
- source_id → `jingde-chuandenglu` (required by the exact tier).

### 3.2 longtan_chongxin → deshan_xuanjian — `traditional_link_pending_exact_locator` → `exact_locator_verified`

- Reference: `T51n2076_p0317b13–p0318a27 · fasc. 15 · 朗州德山宣鑑禪師 · chuandenglu_full case 452 + T51n2076_p0313b10–p0313c05 · fasc. 14 · 澧州龍潭崇信禪師 · case 429`
- Verbatim (case 452): `因造龍潭信禪師問答皆一語而已師即時辭去龍潭留之一夕於室外默坐龍問何不歸來師對曰黑龍乃點燭與師師擬接龍便吹滅師乃禮拜龍曰見什麼曰從今向去不疑天下老和尚舌頭也` — Deshan went to Longtan Xin (Longtan Chongxin) and the lamp-candle encounter.
- Verbatim (case 429 close, Deshan inside Longtan's own case): `德山問久嚮龍潭到來潭又不見龍亦不現師曰子親到龍潭德山即休`
- Corroborated in X1565 juan 7: 澧州龍潭崇信禪師 case at p0229a04 (under 天皇悟禪師法嗣) and 鼎州德山宣鑑禪師 case at p0229b06 — Deshan's case is listed under the **龍潭信禪師法嗣** heir section.
- source_id → `jingde-chuandenglu`.

### 3.3 yangqi_fanghui → baiyun_shouduan — `traditional_link_pending_exact_locator` → `source_verified`

- Reference: `X80n1565 fasc. 19, p0724a11 (舒州白雲守端禪師 case, listed under the 楊歧會禪師法嗣 heir section) + p0721b05 (袁州楊岐方會禪師 case, listed under the 石霜圓禪師法嗣 section) · Wudeng Huiyuan, CBETA XML P5 revision dbdea410…`
- Verbatim (Baiyun case, p0724a11): `冠依茶陵郁禪師披削往參楊岐` and `歧曰渠愛人笑汝怕人笑師大悟巾侍久之` — Baiyun went to Yangqi (Fanghui) and awakened at "he loves people's laughter, you fear people's laughter."
- Fanghui's own case (p0721b05) records his awakening under 慈明 (石霜圓): `一日明適出雨忽作師偵之小徑既見遂搊住曰這老漢今日須與我說不說打你去…師大悟即拜於泥途`.
- source_id `wudeng-huiyuan`. Status is `source_verified` (fascicle/page-line), not
  `exact_locator_verified`: the validator's exact tier hard-requires a T51n2076 lb range
  with source_id `jingde-chuandenglu`, and this Song-era pair postdates T2076's 1004
  closing date — no T2076 lb anchor exists for this edge.

### 3.4 dahong_zuzheng → yuelin_shiguan — remains `traditional_link_pending_exact_locator`, **documented intentional frontier**

Search method (recorded in the edge note and `dahong_zuzheng`'s profile evidence):

- X1565 (581,588 CJK, juan 1–20): search terms 月林 / 師觀 → **0 name occurrences** (the two 月林 hits are verse lines: `林泉好商量` juan 12 p0429a13, `月林間鶴唳` juan 14 p0531a03). 祖政 → 0.
- The master's own case **does exist**: 隨州大洪老衲祖證禪師, X80n1565 fasc. 20 **p0823b11** — but it is on-platform sayings and two dialogues only (`上堂萬象之中獨露身…師曰速禮三拜`): no dates, no teacher, no heir named, so it cannot attest the link to Yuelin Shiguan.
- T2076 (`chuandenglu_full`, 1,274 units): 月林 → 0; the two 師觀 hits are the verb phrase (`塑師觀之` in the Huineng case, `祖師觀此土眾生` in the closing colophon), not a name.
- Active corpus, all 44 documents: 月林 / 師觀 / 祖證 / 祖政 / 大洪老衲 → 0 occurrences as this master.

No witness ⇒ per the task's no-witness branch: edge stays pending with the search method
recorded explicitly (not silently pending); `dahong_zuzheng.profile_evidence.status` =
`frontier_profile_reviewed_pending_exact_locator`; `linked_corpus_keys []` intentional
(no active-corpus document contains content about this master). Next step is human work:
source the link from a record that carries Yuelin Shiguan's biography (e.g. Tiantong ji,
outside the current witness set) or adjudicate the traditional claim.

### 3.5 Upgrade found while extracting: baiyun_shouduan → wuzu_fayan (batch-2 `page-line pending` → concrete locator)

- Old reference: "X80n1565 fascicle 19, page-line pending" (batch 2, 2026-09-21).
- New reference: `X80n1565 fasc. 19, p0729a07 (蘄州五祖法演禪師 case, listed under the 白雲端禪師法嗣 heir section) + p0724a11 (舒州白雲守端禪師 case) · Wudeng Huiyuan, CBETA XML P5 revision dbdea410…`
- Verbatim (Fayan case, p0729a07): `恐虗度子光陰可往依白雲此老雖後生吾未識面但見其頌臨濟三頓棒話有過人處必能了子大事師潸然禮辭至白雲` and `遂舉僧問南泉摩尼珠話請問雲叱之師領悟獻投機偈`.
- Status stays `source_verified` (X1565 witness); reference is now concrete.

## 4. Master profiles, queue, and corpus-key decisions

`data/lineage/masters.json` (the 4 frontier masters):

| master | old profile evidence status | new status | new exact locator recorded |
|---|---|---|---|
| prajnatara | frontier_profile_unverified | frontier_profile_reviewed_case_located_edge_verified | T51n2076_p0216a19–p0216b20 (+ p0217a09–p0220b22) |
| longtan_chongxin | frontier_profile_unverified | frontier_profile_reviewed_case_located_edge_verified | T51n2076_p0313b10–p0313c05 (+ p0317b13–p0318a27) |
| yangqi_fanghui | frontier_profile_unverified | frontier_profile_reviewed_case_located_edge_source_verified | X80n1565 fasc. 19 p0721b05 |
| dahong_zuzheng | frontier_profile_unverified | frontier_profile_reviewed_pending_exact_locator | X80n1565 fasc. 20 p0823b11 (sayings-only case) |

- `longtan_chongxin.linked_corpus_keys` gains `chuandenglu_full` (his own full case, case
  429, is in that document) → `[wumenguan, deshan_yulu, biyanlu_cases, chuandenglu_full]`.
- `yangqi_fanghui` and `dahong_zuzheng` keep `linked_corpus_keys []` **intentionally**:
  (a) the batch-1 smoke contract (`scripts/smoke_test.mjs` 4ee) requires both dossiers to
  still render "Project corpus link not yet curated"; (b) `dahui_yulu_full`'s 三脚驢
  quotations (cases 204/370/585/910) quote the master's signature line with 楊岐
  attribution — later-master citations, not this master's record; (c) for dahong, no
  active-corpus document carries any content about him. The rationale is recorded in each
  master's profile evidence note and in this report.
- The 4 `frontiers[]` entries in `lineage_verification.json` are unchanged (the validator
  fixes their status to `frontier_unprofiled`, and the four frontier teachers — the 26th
  patriarch line, 初悟和尚, 石霜圓 慈明, and dahong's unrecorded teacher — remain
  unprofiled; the T2076/X1565 cases identify some of them, but profiling new masters is
  out of scope for this task).
- `sources[]` record `wudeng-huiyuan` updated from "locator pending" to the reviewed
  fascicle/lb locators plus the extraction digest.
- `data/lineage/profile_review_queue.json`: prajnatara / longtan_chongxin / yangqi_fanghui
  → `review_status: complete` (named source edition + exact locator + source-status
  decision + editor review date 2026-09-21, per the queue's completion policy);
  dahong_zuzheng stays `frontier_source_needed` with the search-method next action.
  New counts: 1 in_review / 3 complete / 30 needs_exact_locator / 1 frontier_source_needed.

## 5. Baseline reds repaired in this landing (and why)

The task's gate set includes validate/pass, preservation "0 unauthorized", review 145+ and
smoke pass — all of which were red at baseline for reasons unrelated to the frontier
itself. Minimum repairs, all declared changes:

1. **README:85 + AUDIT:26** — all-string CJK `917,778` → `917,810` (the live
   `project_metrics.json` value; the prose had drifted after a corpus change). AUDIT:30's
   census line updated from the stale batch-1 "10 exact / 21 remaining" to the final
   20/10/1. (Gate-checked snippets `**31 edge records + 4 frontiers**` and the CJK
   snippets are what these edits restore.)
2. **`scripts/test_source_preservation.py` allowlist** — +8 pointers: `.editorial_note`
   + `.sections[0..2].editorial_note` on `dazhu_huihai.json` and `nanquan_yulu.json`
   (P2 retry 054's additive "project retelling, no witness attribution" labels, landed on
   main before this tree). This cleared the 8 unauthorized changes and the focused
   allowlist self-check failure.
3. **Stale census pins** — `scripts/smoke_test.mjs` (4ee): `10 exact locators / 21
   locator pending` → `20 exact locators / 1 locator pending`;
   `scripts/test_lineage_batch1.py`: census asserts 10/21 → 20/10/1. Both pins predate
   batches 2–3 and were failing at baseline.
4. **`.orchestrator/STATE.md`** — the stale "31/31 lineage edges remain
   traditional_link_pending_exact_locator" known-gap bullet replaced with the post-final
   state; a dated 2026-09-21 evidence entry added.

## 6. Warnings before → after

- Before: 10 warnings, of which 2 were the lineage `linked_corpus_keys is empty` warnings
  (`yangqi_fanghui`, `dahong_zuzheng`).
- After: 10 warnings, **same set** — the 2 lineage warnings remain by design and are
  **documented intentional** (task acceptance: "2→0 or documented intentional"): the
  batch-1 smoke contract requires both dossiers to disclose the missing corpus link, and
  no active-corpus document legitimately links either master (see §4).
- The other 8 warnings are unchanged pre-existing items (7 `gongan_index` protagonist
  "intentionally unprofiled" confirmations + 1 jsonschema-library-not-installed note).

## 7. Final lineage state

31 internal edges = **20 `exact_locator_verified` + 10 `source_verified` + 1
`traditional_link_pending_exact_locator`** (the documented intentional frontier
`dahong_zuzheng → yuelin_shiguan`); 4 `frontier_unprofiled` teacher entries; 0 unexplained
pending. Metrics regenerated via `validate_data.py --write-metrics`
(`lineage_verification.statuses`: 20/10/1).

## 8. Gate outputs (verbatim, post-landing)

```
$ python3 -m py_compile scripts/*.py
PYCOMPILE PASS

$ python3 scripts/validate_data.py
⚠️  data/lineage/masters.json[33]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/lineage/masters.json[34]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  schemas/translatechan-data.schema.json: jsonschema library not installed — declarative schema was not executed this run (pip install jsonschema to enable; see scripts/validate_data.py run_json_schema_checks)
⚠️  data/gongan/gongan_index.json[2]: protagonist 'juzhi' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[3]: protagonist 'huoan_shiti' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[4]: protagonist 'xiangyan_zhixian' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[5]: protagonist 'shakyamuni_and_mahakasyapa' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[14]: protagonist 'dongshan_shouchu' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[16]: protagonist 'zhimen_kuan' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[23]: protagonist 'huangbo' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
✅ DATA VALIDATION PASSED
   corpus=44 | slots=1252 | verified=177 | matrix=21 | locators=4192/4192
   W1 source review: collated=10 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-21 → sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json

$ python3 scripts/test_lineage_batch1.py
✅ LINEAGE BATCH 1: 20 exact edges, 10 source-verified, 1 documented frontier pending, 4 frontiers; 33/35 profiles linked; 4 negative checks passed (census per P3 frontier final)
XML replay not requested; offline corpus/registry/evidence checks passed

$ python3 scripts/test_source_preservation.py
35 corpus files compared
9 declared new corpus file(s): data/corpus/caoshan_benji.json, data/corpus/chuandenglu_full.json, data/corpus/congronglu.json, data/corpus/dahui_yulu_full.json, data/corpus/dongshan_yulu_full.json, data/corpus/huangbo_fayao_full.json, data/corpus/mazu_guanglu_full.json, data/corpus/yunmen_guanglu_full.json, data/corpus/zhaozhou_yulu_full.json
408 permitted allowlisted changes
0 unauthorized changes
✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes

$ python3 scripts/test_source_review_rules.py
145 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK

$ python3 scripts/build_data_bundle.py   (run twice)
✅ Successfully compiled 44 corpus documents: /home/user/translatechan/app_data.js (8,771,406 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)
# second run: identical (8,771,406 bytes); cmp app_data.js docs/app_data.js clean;
# cmp run1 vs run2 (root and docs) clean → deterministic, byte-identical root/docs
# mirror diff: index.html, app.css, app.js, theme-init.js, robots.txt, sitemap.xml,
# og-image.svg, og-image.png, app_data.js all byte-identical; diff -rq data docs/data clean

$ node scripts/smoke_test.mjs
W1 source-review rule suite: ✅ W1 SOURCE-REVIEW RULES OK
Source-preservation suite: ✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes
RENDER-LAZY: hidden rooms rendered on first tab activation
RENDERER: 44 corpus texts exercised, 0 crashes

✅ SMOKE TEST PASSED
```

Bundle: 44 documents, 8,771,406 B (8.77 MB) — deterministic across two runs,
root/docs byte-identical, mirror clean.

## 9. Files changed

- `data/lineage/lineage_verification.json` — 5 edges (3 frontier edges verified, 1
  documented frontier note, 1 batch-2 locator upgraded) + `wudeng-huiyuan` source record.
- `data/lineage/masters.json` — 4 frontier masters (profile_status, profile_evidence,
  summary, cbeta_id; longtan `linked_corpus_keys` + `chuandenglu_full`).
- `data/lineage/profile_review_queue.json` — 4 records (3 complete, 1 documented).
- `data/project_metrics.json` — regenerated (`--write-metrics`).
- `README.md`, `AUDIT.md`, `ROADMAP.md` — stale CJK/census/queue prose synced.
- `.orchestrator/STATE.md` — known-gap bullet + dated evidence entry.
- `scripts/smoke_test.mjs`, `scripts/test_lineage_batch1.py` — stale census pins.
- `scripts/test_source_preservation.py` — +8 allowlist pointers (P2 retry 054).
- `app_data.js`, `docs/**` — rebuilt bundle + mirror.
- `sessions/P3_LINEAGE_FRONTIER_FINAL_2026-09-21.md` — this report.

## 10. Left open (out of scope / human work)

- `dahong_zuzheng → yuelin_shiguan`: source the link from a record carrying Yuelin
  Shiguan's biography (e.g. Tiantong ji) or adjudicate the traditional claim.
- The 4 unprofiled frontier teachers (26th patriarch / 初悟和尚 / 石霜圓 慈明 /
  dahong's unrecorded teacher) — profiling new masters is a later tranche.
- `browser_test.mjs` real-browser pass remains frozen (no Chromium in this sandbox), as
  on every prior session.
