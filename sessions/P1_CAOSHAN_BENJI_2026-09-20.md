# P1 Caoshan Benji — T47n1987A witness ingestion (task 046)

**Date:** 2026-09-20 · **Branch:** `arena/01a0c128-translatechan` (session branch) · **Base:** `main e8f31a1`
**Witness:** CBETA XML P5 `T47n1987A` @ `dbdea41071e1e260ad84b72faefd4587333cf76d`
**Status:** landed and gated. 84 units tiling the whole fascicle verbatim (12,343 CJK); 169/169 fields
collating EXACT, 0 flagged.

## 1. What this task produced

* **`data/corpus/caoshan_benji.json`** — 撫州曹山元證禪師語錄, the Taishō record of **Caoshan Benji**
  (曹山本寂, 840–901), Dongshan Liangjie's dharma heir and the second founder of the Caodong (曹洞)
  house — the last of the Five Houses' founders to enter the corpus. It carries the **whole
  fascicle** (preface, record, six appended treatises and close) as **84 contiguous units**
  (1 preface, 1 opening heading, 75 record paragraphs, 6 treatises, 1 close) covering all **12,343
  CJK characters**, every one verbatim from the pinned witness.
* **`scripts/segment_caoshan_benji.py`** — the deterministic producer. Its only inputs are the
  pinned witness file and its digest-verified reference extraction; nothing is read from any other
  corpus record. It asserts at run time that the concatenation of the unit texts equals the
  reference extraction **character for character**, and it emits a per-unit locator map plus a
  machine-readable extraction report.
* **Staging artifacts** — the producer's reproducible working state (the staging document was
  byte-identical to the landed corpus file). The locator map and extraction report are archived at
  `sessions/P1_CAOSHAN_BENJI_2026-09-20_locators.json` and
  `sessions/P1_CAOSHAN_BENJI_2026-09-20_extraction_report.json`; the `data/staging/` scratch
  directory itself is not committed (the convention the 2026-09-20 Chuandeng Lu ingest recorded),
  and §2's commands regenerate everything from the pinned witness.
* **`data/canonical_locators.json`** — 1,522 → **1,606** case locators (84 new, `T1987A · <title> ·
  p.<lb>–p.<lb>`), anchored at the `lb` line head printed before each unit, with the last `lb`
  inside the unit as its closing line — the Congrong Lu convention.
* **Lineage links** — `data/lineage/masters.json` 34 → **35** profiles: `caoshan_benji`
  (depth 12, `caodong`, teacher `dongshan_liangjie`, `linked_corpus_keys: ["caoshan_benji"]`);
  `data/lineage/lineage_verification.json` 30 → **31** edges (`dongshan_liangjie → caoshan_benji`,
  still `traditional_link_pending_exact_locator`); `data/lineage/profile_review_queue.json`
  34 → **35** records (30 `needs_exact_locator`, 1 `in_review`, 4 `frontier_source_needed`). With
  this profile the previously dangling `caoshan_benji` disciple reference on Dongshan resolves, and
  the new corpus document is cross-referenced from a dossier.
* **Evidence chain** (all committed, all validated by `scripts/w1_evidence.py`):
  `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI_MEASUREMENT.json` (the harness's own
  measurement) → `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json` (the authoritative
  overlay, 38 documents, 630 flagged) → `sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI.md` (the
  dated correction report) → the pins in `scripts/w1_evidence.py`, `data/corpus_manifest.json`, and
  the regression fixtures.

## 2. Witness, geometry, and the deterministic producer

* Witness `T/T47/T47n1987A.xml` (104,787 B, sha256
  `d0d0336d02c420f9b614be9a138322eb2ff4870853c5c8ac4afdca00342d1cfe`); reference extraction
  `ref_T47n1987A.txt` (37,029 B, **12,343 CJK**), rule `cbeta-p5-body-cjk-v1`, digest
  `cdb2f4e2…` — **byte-identical in the 2026-09-09 and the 2026-09-20 digest manifests**, so the
  reference verifies against **both** anchors (`historical_status = verified`; the document is
  declared new only because the historical pass never covered it).
* Geometry: 8 top-level `cb:div`s / 8 `mulu` titles. The fascicle partition is
  * `cb:div type="xu"` — the Japanese-edition preface (寶曆十一年, 1761) with its 目録 title line,
    `head` and editorial note (one **preface** unit);
  * `cb:juan` opening block — `jhead` 撫州曹山元證禪師語錄 + `byline` 遠孫沙門慧印校訂 (one
    **heading** unit);
  * the main record `cb:div type="other"` — **75 direct `p`** blocks: the biographical opening
    (師諱本寂, 泉州莆田黃氏子), the 五位君臣旨訣 passage (正位即空界…), the encounters (雲門, 鏡清,
    紙衣道者, 陸亙, 溈山 …) down to the death record (天復辛酉 … 諡元證禪師);
  * six further `cb:div type="other"` treatises, whole: 解釋洞山五位顯訣, 逐位頌竝注別揀, 五位旨訣,
    三種墮, 四種異類, 三然燈;
  * the fascicle close `jhead` 撫州曹山元證禪師語錄終 (one **end** unit).
* Tiling (asserted, not heuristic): `concatenation_equals_reference: true`, `cjk_total: 12343` in
  the extraction report; no run of the witness is omitted, duplicated or invented.
* Project labels, witness text: `title_zh` for the units whose witness prints a 目録/`jhead` title
  is that title verbatim; for the record units — which the witness prints without any heading —
  `title_zh` is the unit's own first 12 CJK characters (a verbatim prefix, unique across the 84
  units). Every `title_en` and every `speaker` is project-authored. The witness's interlinear
  apparatus (`tei:note`/`tei:g`, including the 卍續-CB and 大 collation notes) is dropped by the
  pinned rule and is not represented.

## 3. Collation measurement (verbatim)

`COLLATION_REFS=<refs> python3 scripts/collate_corpus.py --doc caoshan_benji --refs-manifest
sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI_refs_manifest.txt --compare-historical-refs
sessions/COLLATION_W1_2026-09-09_refs_manifest.txt --require-verified-refs --new-document
caoshan_benji`:

| measure | value |
|---|---|
| fields measured | **169** (84 source content + 85 metadata) |
| EXACT | **169** |
| flagged | **0** |
| content-field collation rate | 84/84 = **100%** (requirement ≥80%, target 90%+) |
| status | `collated_to_claimed_witness` (the fourth document to hold it, with `zhengdao_ge`, `congronglu` and `chuandenglu_full`) |
| reference T47n1987A | verified against the 2026-09-20 manifest **and** the 2026-09-09 manifest (`historical_counts: verified 34 / drift 7` over the 41-work task manifest; the document itself has `refs_verified = refs_historically_verified = 1`, so it does not join `documents_with_drifted_references`) |

The measurement register is committed at
`sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI_MEASUREMENT.json`; the overlay
(`sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json`) records 38 documents, 630 flagged
fields, 4,634 fields total (content 2,451/2,782 collating; metadata 1,852 measured separately),
`new_documents` cumulative `['congronglu', 'chuandenglu_full', 'caoshan_benji']` and
`documents_without_evidence: []`.

## 4. Landing change set

* **Producer:** `scripts/segment_caoshan_benji.py` (new); evidence overlay generator
  `scripts/record_caoshan_evidence.py` (new).
* **Corpus:** `data/corpus/caoshan_benji.json` (new; declared in
  `scripts/test_source_preservation.py` as the third `DECLARED_NEW_CORPUS` document);
  `docs/data/corpus/` mirror rebuilt by the bundle.
* **Manifest:** `data/corpus_manifest.json` — 38th item (`caoshan_benji`, `unit_targets`
  `cases: 84`, `partial_selected_witness`, `collated_to_claimed_witness`); `source_review`
  re-pinned: `authoritative_documents` 37 → 38, `correction_report_path` / `correction_register_path`
  / `correction_refs_manifest_path` / `authoritative_register_path` → the 2026-09-20 Caoshan Benji
  overlay; `evidence_model` extended. The designated flagged total stays **630** (the new document
  contributes none).
* **Locators:** `data/canonical_locators.json` — `documents.caoshan_benji` (canonical_id `T1987A`,
  granularity `case`, 84 case locators); registry keys still exactly the 38 corpus keys.
* **Harness:** `scripts/collate_corpus.py` `DOCS` — `'caoshan_benji': (['T47n1987A'], ['T47n1987B',
  'X68n1315', 'T51n2076', 'T48n2006'])`, with the witness note that the probes carry material about
  the master or a parallel recension and are not claimed witnesses.
* **Evidence:** `sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI.md` (new dated correction report;
  the 2026-09-20 Chuandeng Lu overlay and every earlier register stay committed and unmodified as
  the chain's historical record) + `sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI_refs_manifest.txt`
  (41 works: the 40 of the 2026-09-20 manifest plus the probe `T48n2006`).
* **Lineage:** `data/lineage/masters.json`, `data/lineage/lineage_verification.json`,
  `data/lineage/profile_review_queue.json` (see §1).
* **Pins:** `scripts/w1_evidence.py` `FIXED_METADATA` (authoritative chain moved to the new
  overlay); `scripts/test_source_review_rules.py` (authoritative register/report re-pinned and the
  waiver/partition fixtures re-measured to the 38-document totals); `scripts/smoke_test.mjs`
  (37 → 38 throughout, lineage edges 30 → 31, per-text coverage `caoshan_benji: 84/84 cases`, shelf
  `partial_selected_witness` 6 → 7); `scripts/test_source_preservation.py` (third declared new
  corpus file).
* **Metrics + docs:** `data/project_metrics.json` regenerated (`corpus=38 | slots=1252 |
  verified=177 | matrix=21 | locators=1606/1606`; **553,011 content CJK / 583,291 all-string CJK**;
  provenance-note census 87 strings / 51 rendered / 29 documents / `cbeta_note` 21);
  README/AUDIT/HANDOFF/ROADMAP/vision/index.html prose re-pinned to the generated figures,
  including the lineage counts (35 masters / 31 edges).
* **Bundle:** `app_data.js` rebuilt **deterministically** (two builds byte-identical):
  **4,851,526 B** (baseline before this task: 4,701,755 B; the core corpus landing was 4,848,586 B
  before the lineage profile was added), `docs/app_data.js` mirror identical.

## 5. Gates (all run 2026-09-20 on the landed tree)

| gate | result |
|---|---|
| `python3 -m py_compile scripts/*.py` | ✅ clean |
| `scripts/validate_data.py` | ✅ PASSED — corpus=38, locators=1606/1606, W1 collated=4 / partial=32 / unavailable=2, flagged=630 → `COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json` |
| `scripts/collate_corpus.py --doc caoshan_benji --require-verified-refs` | ✅ 169/169 EXACT, 0 flagged, `collated_to_claimed_witness`, reference verified against both manifests |
| `scripts/test_source_preservation.py` | ✅ 35 files vs base commit, 3 declared new documents, 373 permitted allowlisted changes, 0 unauthorized |
| `scripts/test_source_review_rules.py` | ✅ 145 rule checks (authoritative chain, waiver declared cumulatively, partition/forgery probes on the 38-document totals) |
| `scripts/build_data_bundle.py` ×2 | ✅ byte-identical rebuilds; 4,851,526 B > 4,701,755 B baseline |
| `node scripts/smoke_test.mjs` | ✅ PASSED — 38 corpus texts rendered, 0 crashes, all five ledgers present for every document, lineage registry 31 edges / 4 frontiers |

## 6. Honest limits

* **A single witness.** The document is extracted from `T47n1987A` alone. Its sibling part
  `T47n1987B` (撫州曹山本寂禪師語錄, the Japanese 曹洞語錄 recension) is carried as a probe
  reference, not merged: it is a different recension whose text is not copied here, and the
  collation records it as `also_in` rather than as a witness of this text.
* **No translations.** The document carries source text and structure only; every unit's
  `title_en` and `speaker` is a project label, and there are no `translations` objects.
* **Metadata is measured, not collated into the claim.** The 85 title/name metadata fields are
  reported separately (the manifest's `metadata_field_note`), so `collated_to_claimed_witness` is
  not a claim that they were collated.
* **No page-level locators.** Locators are `lb` line-head anchors, the recorded convention; the
  project's pages work is out of scope.
* **The lineage edge stays pending.** `dongshan_liangjie → caoshan_benji` is recorded as
  `traditional_link_pending_exact_locator`: the corpus records carry the anchor text, but no chart
  or record locator has been editorially reviewed, and the new profile is a seed profile
  (`seed_profile_pending_exact_locator`) whose exact biographical locators remain queued.
* **Apparatus dropped by rule.** The witness's `tei:note`/`tei:g` collation apparatus is not
  represented, which is the pinned extraction rule, not an editorial selection.
* **The register chain stands.** The authoritative flagged total stays **630** (the 2026-09-09
  report's 637 figure and the historical register's 622 are superseded figures, unchanged), and a
  fresh collation of today's tree reports 486; the owner's 2026-09-12 ruling that the
  post-remediation pass does not supersede the register is respected, not re-litigated here.
* **As everywhere in W1: source collation does not approve reuse.**
