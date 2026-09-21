# Session Report — Task 049: All-Encompassing Chan Scope Roadmap (2026-09-20)

**Branch:** `arena/01a0c15f-translatechan` @ `83f1cbd` (= `origin/main`)
**Date:** 2026-09-21
**Prompt:** `.orchestrator/prompts/049-all-encompassing-roadmap.md` fetched from `origin/_orch`
(`afb4e07`) — the channel prompt file won over the chat stub per repo protocol; the prompt is
self-scoping (the agent determines scope from it).

## Deliverables (this PR)

| file | what | size |
|---|---|---|
| `.orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md` | the all-encompassing roadmap, §1–§9 + 40 numbered sources | 105,709 B |
| `data/aliases.json` | **draft** popular-name registry (not a bundle member yet) | 35 master + 20 work = **55 entries** |
| `data/english_references.json` | **draft** English reference list (not a bundle member yet) | **129 entries** (16 verified ISBNs / 89 `needs_lookup` / 24 `none`) |
| `docs/data/aliases.json`, `docs/data/english_references.json` | build-time mirrors (expected PR diff — see below) | byte-identical to the data/ originals (verified with `cmp`) |
| `sessions/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md` | this report | — |

## Gate outputs — BEFORE (baseline, run before any file touched by this task)

```
$ python3 -m py_compile scripts/*.py
→ all compiled, no errors
$ python3 scripts/validate_data.py
✅ DATA VALIDATION PASSED
corpus=38 | slots=1252 | verified=177 | matrix=21 | locators=1606/1606
W1 source review: collated=4 | partial/failed=32 | unavailable=2 | flagged=630
evidence=2026-09-20 → sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json
$ python3 scripts/build_data_bundle.py
✅ Successfully compiled 38 corpus documents: app_data.js (4,851,526 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment
$ python3 scripts/test_source_preservation.py
35 corpus files compared
0 unauthorized changes
✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes
$ python3 scripts/test_source_review_rules.py
145 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK
$ node scripts/smoke_test.mjs
✅ SMOKE TEST PASSED
$ git diff --exit-code (mirror)
→ clean
```

## Gate outputs — AFTER (run after all deliverables landed, before commit)

```
$ python3 -m py_compile scripts/*.py && node --check scripts/smoke_test.mjs
PY_COMPILE PASS (all scripts/*.py)
MJS_CHECK PASS
$ python3 scripts/validate_data.py
⚠️  data/lineage/masters.json[31]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
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
   corpus=38 | slots=1252 | verified=177 | matrix=21 | locators=1606/1606
   W1 source review: collated=4 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-20 → sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json
$ python3 scripts/build_data_bundle.py
Bundling TranslateChan Classical Corpus...
✅ Successfully compiled 38 corpus documents: /home/user/translatechan/app_data.js (4,851,526 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)
$ python3 scripts/test_source_preservation.py
Focused allowlist regression: unmutated copy exit=0, nested coverage_note rejected (exit=1) with the exact path reported
  ℹ️  (3 declared new corpus files + 373 permitted allowlisted changes — identical to baseline run)
35 corpus files compared
3 declared new corpus file(s): data/corpus/caoshan_benji.json, data/corpus/chuandenglu_full.json, data/corpus/congronglu.json
373 permitted allowlisted changes
0 unauthorized changes
✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes
$ python3 scripts/test_source_review_rules.py
  Focused mutation partition: exit=1, metrics_byte_identical=True
  Focused mutation report-metadata: exit=1, metrics_byte_identical=True
  corpus *_note keys measured now (data-driven): cbeta_note 21, coverage_note 36, editorial_note 16, recension_note 14
145 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK
$ node scripts/smoke_test.mjs
DATA loaded. corpus keys: 38
APP executed + init() completed without crash
RENDERER: 38 corpus texts exercised, 0 crashes
W1 source-review rule suite: ✅ W1 SOURCE-REVIEW RULES OK
Source-preservation suite: ✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e ... 0 unauthorized changes
RENDER-LAZY: hidden rooms rendered on first tab activation
✅ SMOKE TEST PASSED
$ git status --porcelain (mirror check)
?? .orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md
?? data/aliases.json
?? data/english_references.json
?? docs/data/aliases.json
?? docs/data/english_references.json
→ app_data.js and index.html UNCHANGED (bundle byte-identical: 4,851,526 B before and after)
→ docs/data mirror verified byte-identical to data/ originals (cmp)
```

**Before/after delta:** none in `app_data.js`, `index.html`, `data/corpus/`,
`data/lineage/`, `data/corpus_manifest.json`, `data/project_metrics.json`, or any gate script.
The `⚠️` lines in the after-validate run are pre-existing informational warnings (identical set to
baseline; they concern `gongan_index.json` protagonists and the optional `jsonschema` dependency,
not this task's files). The `docs/data/*.json` additions are the build mirror of the two new
draft JSON files — `docs/data/` is git-tracked (53 files), so this is an **expected, intentional
PR diff**, not drift.

## Why the bundle is byte-identical (safety argument, verified by the gates)

`build_data_bundle.py` bundles a **fixed list of keys** (the 38 corpus docs + canonical locators +
lineage + metrics + editorial + glossary + gongan). `data/aliases.json` and
`data/english_references.json` are not in that key list, so `app_data.js` is regenerated
byte-identically (confirmed: 4,851,526 B both runs). The files land on disk as drafts with a
`_status: "draft_seed"` marker; promotion to a bundle member is an owner-ratified future schema
change (roadmap §6).

## Search summary (the self-scoping work)

19 web searches + 2 full page fetches (Terebess `terebess.hu/zen/textindex.html`, 8 chunks —
the master index of 500+ online Chan texts and English translations; Zen Mountain Monastery
recommended reading, 2 chunks — the 9-stage practice shelf) + 8 ISBN-verification fetches
(Shambhala, Amazon ×5, Google Books ×3, VitalSource, Golden Lab, City Lights, Bookscouter,
H-Net, dokumen.pub, EoB) + targeted re-fetches (SEPP `buddhism-chan`, ZMM).

What the searches established (all cited inline in the roadmap by number):

- **Masters:** the five-houses systematization (Guiyang/Linji/Caodong/Yunmen/Fayan; three absorbed
  into Linji); Mazu's successors and dharma heirs with dates (Hongzhou school Wikipedia);
  Yunmen 862/864–949; Song-era dates (Hongzhi 1091–1157, Dahui 1089–1163, Wansong 1166–1246,
  Touzi 1032–1083, Danxia Zichun 1064–1117, Qingliao 1088–1151, Fenyang Shanzhao 947–1024,
  Muzhou Daoming ca. 780–877, Tianhuang Daowu 748–807); Mazu "139 dharma heirs"; East-Asian
  frontier (Chinul 1158–1210, Dōgen via Tiantong Rujing, Eisai, Keizan, Muju, Cao Tang).
- **Works:** the complete lamp-record sequence with dates and compilers (Jingde 1004 → Tiansheng
  1036 → Jianzhong 1101 → Zongmen tongyao ji 1133 → Liandeng 1183 → Jiatai 1204 → Wudeng 1253);
  Jingde scale (30 juan, 1,701 persons, 52 generations, 951 with full records); gong'an collection
  inventory (Konggu ji, Xutang ji, Jijie lu, Zhengfa yanzang 680 cases, Changuan cejin, Yuxuan
  yulu, Guzunsu yulu 48 fascicles c. 1267); qinggui chain (Xuefeng 901 → Guishan jingce →
  Chanyuan qinggui 1103 → Chixiu revision → Eihei shingi); the many-translations texts (Xinxin
  Ming ×23, Zhengdao Ge ×7, Sandokai ×8, Baojing ×7, Five Ranks ×4).
- **CBETA ids:** T47n1985 Linji, T47n1986b Dongshan, T47n1987b Caoshan, T47n1992 Fenyang Wude,
  T47n1996 (Mingjue — flagged as conflicting with MASTER_REFERENCE's T47n1996 = Yangqi),
  T47n1997 Yuanwu, T47n1998 Dahui, T48n2001 Hongzhi, T48n2003 Biyan, ZZ73n1451 Cishou,
  X68n1315 Guzunsu, X68n1319 Yuxuan, X71n1419 Yuansou, X72n1431 Yunwai, X62n1173 Xigui,
  T51n2076 Jingde — all from fetched scholarship, with the one id conflict flagged rather than
  silently resolved.
- **English front:** the full translator/publisher landscape (Cleary's whole Shambhala list,
  BDK America, Columbia, UH Press, Counterpoint, North Point, Grove, OUP, Wisdom, Tuttle, SUNY,
  Weatherhill, Kodansha, Princeton) and 16 ISBNs verified on fetched pages.
- **Verified ISBNs (the only ones asserted):** BCR Cleary 2005 `978-1-59030-232-3`;
  Secrets of BCR 2001 `978-1-57062-738-5`; Book of Serenity 2005 `978-1-59030-249-1`;
  Two Zen Classics 2005 `978-1-59030-282-8`; Gateless Barrier Aitken 1990
  `978-0-86547-441-3`/`978-0-86547-442-0`; Lin-Chi Watson 1993 `978-0-87773-891-6`;
  Record of Linji 2009 `978-0-8248-2821-9`/`978-0-8248-3319-0`; Joshu Green 1998
  `978-1-57062-414-8` / 2001 `978-1-57062-870-2`; Huang-Po Blofeld `978-0-80215-092-9`;
  Platform Yampolsky 1967 `978-0-231-08361-4`; Platform Red Pine 2006
  `978-1-59376-086-1`/`978-1-58243-995-2`; Zhongfeng Mingben Kirchner 2021
  `978-0-19-767297-6`; BDK Zen Texts `978-1-886439-28-3`; Suzuki Manual `978-0-80213-065-5`;
  Suzuki Essays 1 `978-0-80215-118-6`. Every other metadata value in the JSON is
  `needs_lookup` (113 of 129 entries).
- **Key negative result (kept in the document):** **no complete English translation of the Mazu
  yulu exists** — fragments only. We can lead the English front there, not follow it.

## Counts (roadmap tallies, machine-checked where possible)

| thing | count |
|---|---|
| Masters inventoried with sources (§2) | **102** = 35 profiled + 25 Tang + 23 Song + 13 genealogists + 6 frontier |
| Master target | 150–200 (path: Guzunsu yulu + denglu tail) |
| Works inventoried (§3) | **134** = 10 Tier 1 + 7 Tier 1 missing + 13 Tier 2 + 19 denglu + 20 gong'an + 27 yulu + 18 treatises + 7 codes + 8 histories |
| Works in corpus | 38 |
| English reference entries | **129** (16 verified / 89 needs_lookup / 24 none) |
| Alias registry entries | **55** (35 masters + 20 works) |
| Numbered sources | **40** (all cited inline; citation ↔ source cross-check passed programmatically) |
| CJK target (§8) | 5–10M (current 553,011 content CJK) |
| Hours target (§8) | 200–300 (plan estimate, trued up after first two full yulu ingests) |

Corrections made during drafting (recorded for the audit trail):

1. `foyan_qingyuan` was initially listed among the 35 profiled masters — **it is not**
   (verified against `data/lineage/masters.json`: 35 entries, no such id; it is a corpus doc id
   only). Removed from §2.1; recorded as a gap (§2.1 note + §2.6).
2. Citation-numbering collision: ZMM was cited as [2] (slot 2 = tricycle) in 35 places — all
   renumbered to [12].
3. The eScholarship Mingjue source initially occupied slot [21] (slot 21 = Shambhala BCR page) —
   moved to slot 38 (the previously-planned dharmanet slot, never cited, was dropped).
4. MASTER_REFERENCE ISBN contamination caught and quarantined: Yampolsky `…085466`, Red Pine
   `…433875`, McRae/BDK `…939990`, Watson `…624545` — all replaced by this session's verified
   values; the contaminated values appear nowhere in the deliverables.
5. Draft §2.2/§2.3 rows that carried guessed Chinese characters were checked against the fetched
   sources; characters are given only where a fetched source carried them, else `—`.

## Recorded discrepancies and deviations (per task 049 §8)

1. **Branch mismatch:** the channel prompt names a target branch `docs/all-encompassing-roadmap`;
   `STATE.md` pins all work to the session branch. The working-branch constraint supersedes the
   prompt. All work was done on **`arena/01a0c15f-translatechan`**; the PR targets `main`.
2. **No `docs/` copy of the roadmap:** the prompt asks for a docs/ copy "for visibility".
   `docs/` is **generated** output (rebuilt bundle + data mirror), so a hand-written copy there
   would be wrong architecture; the canonical single file is
   `.orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md`, visible on `main` via GitHub. No root
   copy either (single source of truth).
3. **Drafts, not bundle members:** `data/aliases.json` + `data/english_references.json` are draft
   seeds (`_status: "draft_seed"`), not yet bundle members — promotion is an owner-ratified schema
   change (roadmap §5 step 5 / §6). Consequence: the only new-tree diff is the two
   `docs/data/` mirrors (expected).
4. **Banned-command compliance:** no `git show <sha>` without `--name-only/--stat`, no
   `git show | head`, no unflagged `git diff` on bundle files, no `git log -p` on the bundle.
   Channel files were read via `git show refs/remotes/origin/_orch:<path>` (branch ref, not sha).
5. **Scope boundaries honored:** no corpus ingest (Task 050), no English translations written,
   no lineage locators (P3), no rights review (P4 — rights fields are first-pass labels only,
   and the roadmap states edition verification never implies rights clearance), no Pages deploy
   (the build's docs sync is the gate's normal behavior, not a deploy).

## What this PR does NOT do (per prompt)

- No corpus content changes (0 bytes in `data/corpus/`).
- No start on any of the §7/§8/§5 work — the roadmap is a map, not a work order.
- No owner decisions taken: naming-convention ratification, rights review, bundle schema change,
  and the AI-translation plan all wait on the owner.

**Gates: 5/5 green before, 5/5 green after, bundle byte-identical (4,851,526 B), 0 unauthorized
changes, 145/145 review rules, smoke passed.**
