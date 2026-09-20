# P1 Full 30-Fascicle Jingde Chuandeng Lu — T51n2076 witness ingestion (task 045)

**Date:** 2026-09-20 · **Branch:** `arena/01a0c0eb-translatechan` · **Base:** `main 3f34944`
**Witness:** CBETA XML P5 `T51n2076` @ `dbdea41071e1e260ad84b72faefd4587333cf76d`
**Status:** landed and gated. 1,274 units tiling all 30 fascicles verbatim; 2,549/2,549 fields
collating EXACT, 0 flagged.

## 1. What this task produced

* **`data/corpus/chuandenglu_full.json`** — the complete 30-fascicle 景德傳燈錄 as a single corpus
  document: **1,274 units** (971 biography entries, 69 titled works, 234 sections) covering all
  **350,269 CJK characters** of the 30-fascicle region, every one verbatim from the pinned witness.
  Sibling of the existing `chuandenglu` excerpt record (T2076/51, two sample records), which is
  **untouched**; nothing was copied from it.
* **`scripts/segment_chuandenglu.py`** — the deterministic producer. Its only inputs are the pinned
  witness file and its digest-verified reference extraction; it asserts at run time that the unit
  partition tiles the 30-fascicle region exactly (contiguous CJK, no gaps, no unexplained
  overlaps), and it emits case locators plus an extraction report.
* **Staging artifacts** (`data/staging/chuandenglu_full.json` / `_locators.json` /
  `_extraction_report.json`) — the producer's reproducible working state (the staging document is
  byte-identical to the landed corpus file). Kept out of the repository, per the convention that
  generated artifacts stay external: §2's commands regenerate them deterministically from the
  pinned witness.
* **`data/canonical_locators.json`** — 248 → **1,522** case locators (1,274 new, `T2076 fasc. N ·
  <name> · p.<lb>–p.<lb>`), anchored at the `lb` line head printed before each unit, with the last
  `lb` inside the unit as its closing line — the convention the 2026-08-10 containment table
  recorded.
* **Evidence chain** (all committed, all validated by `scripts/w1_evidence.py`):
  `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL_MEASUREMENT.json` (the harness's own
  measurement) → `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json` (the authoritative
  overlay, 37 documents, 630 flagged) → `sessions/COLLATION_W1_2026-09-20_CHUANDENGLU_FULL.md`
  (the dated correction report) → the pins in `scripts/w1_evidence.py`, `data/corpus_manifest.json`,
  and the regression fixtures.

## 2. Witness, geometry, and the deterministic producer

* Witness `T/T51/T51n2076.xml` (3,658,989 B, sha256
  `41e4717ce9c71ff6892f8a83d6a28438cf67a1dc09e8e938165b1222daa9e40e`); reference extraction
  `ref_T51n2076.txt` (1,075,503 B, **358,501 CJK**), rule `cbeta-p5-body-cjk-v1`, digest
  `a860907e…` — **byte-identical in the 2026-09-09 and the 2026-09-20 digest manifests**, so the
  reference verifies against **both** anchors (no waiver needed; the document is declared new only
  because the historical pass predates it).
* Geometry: 60 `jhead` headings; the 30-fascicle region runs [3995, 354264) — **350,269 CJK** —
  with 3,995 CJK of front matter (序) and 4,237 CJK appended matter (後序 and the 魏府華嚴長老示眾
  note) outside the region. 29 of 30 fascicles are contiguous between their close and the next
  open heading; **fascicle 13 is irregular** (its open heading sits mid-fascicle at 130860 and its
  close heading inside the last entry at 140797) and is recorded in the extraction report rather
  than asserted away.
* Unit rule (asserted, not heuristic): a witness `div` carrying its own `mulu` title and no
  `list` is a unit when its name matches its opening text (common prefix ≥2, or the text opens on
  a 3–16-character tail of the name), or the name is a work title (ending in 語偈頌詩歌談記銘箴論義要讚章篇文表吟式首), or it is in the two **explicit sets**
  pinned in the producer with per-name witness comments:
  * `WORK_EXPLICIT` = {菩提達磨略辨大乘入道四行, 南嶽石頭和尚參同契, 歸寂吟贈同住} — works whose
    bodies do not repeat the title line;
  * `ENTRIES_EXPLICIT` = 13 person entries (慧滿禪師, 洛京衛國院道禪師, 幽州盤山第二世和尚,
    洞山第三世師虔禪師, 仁王院俊禪師, 大龍山楚勛禪師, 白馬智倫禪師, 廣德周禪師, 廬山棲賢慧圓禪師,
    金陵奉先慧同禪師, 第二世黃龍和尚, 天台普聞智勤禪師, 南獄慧思禪師) whose first paragraph opens on
    a place-name *variant* of the mulu name (洛京→京兆, 南嶽→衡嶽, 幽州盤山→盤山, 金陵奉先慧同→
    昇州奉先寺淨照…慧同, 天台普聞→台州天台山紫凝普聞寺智勤, …; the mulu for 慧思 prints the variant
    character 獄 for 嶽). Generalized matching was audited and abandoned for these: the variants
    share no ≥4-character substring with the mulu in at least two cases.
* Unit span = [mulu CJK start, end of the unit's last *direct* `p`/`lg`]; a div that nests other
  entry divs (慧可 ⊃ 僧那/向居士/慧滿; 慧能 ⊃ the 262,627-character 法嗣 container) ends before
  them, so nested entries stay top-level units and the container becomes section scaffolding.
  Multi-part works without direct prose span their whole div, and their 13 titled sub-verses
  (最後語, 三界唯心, 華嚴六相義, 瞻須菩提, 金剛經為人輕賤章, 乾闥婆城, 正月偶示, 祖意,
  問答須知起倒, 一句子, 古今大意, 勵覺吟, 歸寂吟贈同住) are the only overlaps — 770 CJK, each
  listed in the extraction report.
* Per-fascicle census (biography / work / section): 1: 21/0/3 · 2: 13/0/2 · 3: 8/0/2 ·
  4: 27/0/13 · 5: 20/0/3 · 6: 14/1/3 · 7: 18/0/2 · 8: 43/0/2 · 9: 22/2/7 · 10: 29/0/11 ·
  11: 34/0/10 · 12: 56/0/16 · 13: 17/0/12 · 14: 30/0/9 · 15: 28/0/9 · 16: 38/0/4 · 17: 51/0/11 ·
  18: 14/0/2 · 19: 31/0/2 · 20: 69/0/16 · 21: 54/0/6 · 22: 64/0/8 · 23: 97/0/23 · 24: 62/0/26 ·
  25: 30/0/4 · 26: 71/0/21 · 27: 10/1/2 · 28: 0/12/2 · 29: 0/28/1 · 30: 0/25/2.
  Fascicle 28 (諸方廣語, 12 works), 29 (讚頌偈詩, 28 works) and 30 (銘記箴歌, 25 works) carry no
  biography entries, matching the book's own fascicle map.

## 3. The true inventory (stated, not force-fit)

The dispatch estimated "~1,700 biographies." The book's own later summaries (preface; corroborated
by the 教育百科 entry) say: **1,701 persons listed, 951 of them with records (機緣警句), the rest
listed-only (有名無文, roughly 750).** "1,700 biographies" is therefore the *listing* count, not
the *recorded-entry* count.

This census, verified against the pinned witness: **971 biography units** — 961 in fascicles 1–26
and the 10 傳燈錄 Chan dharma-heirs in fascicle 27 (寶誌, 善慧, 智異, 僧契, 曼禪, 梵僧, 寒山, 拾得,
布袋, 慧思). Of the 961, four masters are recorded **twice** (鎮州萬歲和尚, 郢州芭蕉和尚, 韶州林泉
和尚, 衡州華光範禪師 each appear under two later generations, plus the witness's own 臨濟義玄
repeat printed in both fascicle 12 and the fascicle 13 opening section), giving **957 distinct
masters** in fascicles 1–26.

The 6-master gap between 957 and the book's 951 is recorded here rather than force-fit: the book's
figures are its own later summaries (the in-text "已上N人見錄/不錄" notes double-count nested
法嗣 re-listings and sum to 1,707/1,964, not 951), and the census is the verifiable number. Both
figures are preserved in the document's `coverage_note` and in the W1 record.

## 4. Collation measurement (verbatim)

`scripts/collate_corpus.py --doc chuandenglu_full --refs-manifest
sessions/COLLATION_W1_2026-09-20_refs_manifest.txt --compare-historical-refs
sessions/COLLATION_W1_2026-09-09_refs_manifest.txt --require-verified-refs --new-document
chuandenglu_full` on the pinned reference:

| measure | value |
|---|---|
| fields measured | **2,549** (1,274 source content + 1,275 metadata) |
| EXACT | **2,549** |
| flagged | **0** |
| content-field collation rate | 1,274/1,274 = **100%** (requirement ≥80%, target 90%+) |
| status | `collated_to_claimed_witness` (the third document to hold it, with `zhengdao_ge` and `congronglu`) |
| reference T51n2076 | verified against the 2026-09-20 manifest **and** the 2026-09-09 manifest (`historical_status = verified`) |

The measurement register is committed at
`sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL_MEASUREMENT.json`.

## 5. Landing change set

* **Producer:** `scripts/segment_chuandenglu.py` (new); staging artifacts under `data/staging/`.
* **Corpus:** `data/corpus/chuandenglu_full.json` (new; declared in
  `scripts/test_source_preservation.py` as a second `DECLARED_NEW_CORPUS` document); `docs/data/corpus/`
  mirror rebuilt by the bundle.
* **Manifest:** `data/corpus_manifest.json` — 37th item (`chuandenglu_full`, unit_targets
  `cases: 1274`, `partial_selected_witness`, `collated_to_claimed_witness`); `source_review`
  re-pinned: `authoritative_documents` 36 → 37, `correction_report_path` / `correction_register_path`
  / `authoritative_register_path` → the 2026-09-20 Chuandeng Lu overlay; `evidence_model` extended.
  The designated flagged total stays **630** (the new document contributes none).
* **Locators:** `data/canonical_locators.json` — `documents.chuandenglu_full` (canonical_id
  `T2076`, granularity `case`, 1,274 case locators); registry keys still exactly the 37 corpus keys.
* **Harness:** `scripts/collate_corpus.py` `DOCS` — `'chuandenglu_full': (['T51n2076'], [])`.
* **Evidence:** `scripts/record_chuandenglu_evidence.py` (new; the overlay's register-level blocks
  are the harness's own functions) → `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json`
  (37 documents, 630 flagged, 4,465 fields, 40 refs verified / 33 historical / 7 drift,
  `documents_without_evidence: []`; `new_documents` is cumulative: `['congronglu',
  'chuandenglu_full']`); `sessions/COLLATION_W1_2026-09-20_CHUANDENGLU_FULL.md` (new dated
  correction report; the 2026-09-20 Congrong Lu report and its register stay committed and
  unmodified as the chain's historical record).
* **Pins:** `scripts/w1_evidence.py` `FIXED_METADATA` (authoritative chain moved to the new
  overlay); `scripts/test_source_review_rules.py` (waiver fixtures now pin the cumulative list and
  the new register/report paths and figures); `scripts/smoke_test.mjs` (36 → 37 throughout:
  manifest items, source-review counts 3/32/2, locator/per-text counts, partial-witness shelf 6,
  per-text coverage `chuandenglu_full: 1274/1274 cases`); `scripts/test_source_preservation.py`
  (second declared new corpus file).
* **Metrics + docs:** `data/project_metrics.json` regenerated (`corpus=37 | slots=1252 |
  verified=177 | matrix=21 | locators=1522/1522`; **540,668 content CJK / 568,899 all-string CJK**);
  README/AUDIT/HANDOFF/ROADMAP/vision/RESEARCH_RELEASE_PLAN/index.html/REMEDIATION_PLAN prose
  re-pinned to the generated figures.
* **Bundle:** `app_data.js` rebuilt **deterministically** (two builds byte-identical):
  **4,701,755 B** (baseline before this task: 2,136,279 B), `docs/app_data.js` mirror identical.

## 6. Gates (all run 2026-09-20 on the landed tree)

| gate | result |
|---|---|
| `scripts/validate_data.py` | ✅ PASSED — corpus=37, locators=1522/1522, W1 collated=3 / partial=32 / unavailable=2, flagged=630 → `COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json` |
| `scripts/collate_corpus.py --doc chuandenglu_full --require-verified-refs` | ✅ 2,549/2,549 EXACT, 0 flagged, `collated_to_claimed_witness`, no drifted references |
| `scripts/test_source_preservation.py` | ✅ 35 files vs base commit, 2 declared new documents, 373 permitted allowlisted changes, 0 unauthorized |
| `scripts/test_source_review_rules.py` | ✅ 145 rule checks (waiver declared cumulatively, dropping it fails, false declaration fails) |
| `scripts/build_data_bundle.py` ×2 | ✅ byte-identical rebuilds; 4,701,755 B > 2,136,279 B baseline |
| `node scripts/smoke_test.mjs` | ✅ PASSED — 37 corpus texts rendered, 0 crashes, all five ledgers present for every document |

## 7. Honest limits

* **No translations.** The document carries source text and structure only; every unit's
  `title_en` is a project label (`Fascicle N · Biography/Work/Section`, name-based for units), and
  there are no `translations` objects. Nothing is presented as a translation.
* **No page-level locators.** The project's pages work is out of scope; locators are `lb` line-head
  anchors, which is the recorded convention and what the reader's ledgers disclose.
* **The census is not "951".** 971 recorded units (957 distinct masters in fasc. 1–26 + 10
  dharma-heirs) is what the pinned witness prints; the book's 1,701/951/~750 figures are its own
  later summaries and are preserved as such in `coverage_note`. The 臨濟義玄 duplicate and the four
  twice-recorded masters are kept as the witness prints them, each with its own unit and locator.
* **Section scaffolding is content, not decoration.** The 234 section units carry fascicle
  headings, tables of contents, and generation lists verbatim so that the tiling is exact and every
  CJK character of the 30 fascicles belongs to exactly one unit (plus the 13 documented sub-verse
  overlaps inside multi-part works).
* **The reader's case renderer** treats each unit generically (`title_zh` + one `dialogue` block);
  biography entries render as single-speaker records with the unit's `title_zh` as heading. That is
  representation, not commentary: no field is annotated, abridged, or re-worded.
* **As everywhere in W1: source collation does not approve reuse.**
