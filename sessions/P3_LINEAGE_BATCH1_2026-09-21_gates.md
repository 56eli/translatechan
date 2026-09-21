# P3 lineage batch 1 — verbatim gate output, 2026-09-21

All commands below exited 0. Empty code blocks mean no stdout/stderr.
Validation environment: `PYTHONPATH=$PWD/.cache/lineage/deps` (jsonschema 4.26.0 installed locally; no dependency files changed).

## `python3 -m py_compile scripts/*.py`

```text
```

## `python3 scripts/validate_data.py --write-metrics`

```text
⚠️  data/lineage/masters.json[33]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/lineage/masters.json[34]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/gongan/gongan_index.json[2]: protagonist 'juzhi' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[3]: protagonist 'huoan_shiti' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[4]: protagonist 'xiangyan_zhixian' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[5]: protagonist 'shakyamuni_and_mahakasyapa' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[14]: protagonist 'dongshan_shouchu' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[16]: protagonist 'zhimen_kuan' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[23]: protagonist 'huangbo' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
✅ DATA VALIDATION PASSED
   corpus=44 | slots=1252 | verified=177 | matrix=21 | locators=4192/4192
   wrote data/project_metrics.json
   W1 source review: collated=10 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-21 → sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json
```

## `python3 scripts/validate_data.py`

```text
⚠️  data/lineage/masters.json[33]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/lineage/masters.json[34]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
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
```

## `python3 scripts/test_lineage_batch1.py --xml .cache/lineage/T51n2076.xml`

```text
✅ LINEAGE BATCH 1: 10 exact edges, 21 pending, 4 frontiers; 33/35 profiles linked; 4 negative checks passed
✅ Pinned XML: digest, lb ranges and verbatim quotations replayed
```

## `python3 scripts/build_data_bundle.py (first run)`

```text
Bundling TranslateChan Classical Corpus...
✅ Successfully compiled 44 corpus documents: /home/user/translatechan/app_data.js (8,754,636 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)
```

## `python3 scripts/build_data_bundle.py (second run)`

```text
Bundling TranslateChan Classical Corpus...
✅ Successfully compiled 44 corpus documents: /home/user/translatechan/app_data.js (8,754,636 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)
```

## `sha256sum app_data.js docs/app_data.js (both runs identical)`

```text
388aa6eec699574eb320558dfd6db0201c03fec87dec5c5f3744d61d21ec6c55  app_data.js
388aa6eec699574eb320558dfd6db0201c03fec87dec5c5f3744d61d21ec6c55  docs/app_data.js
```

## `python3 scripts/test_source_preservation.py`

```text
Focused allowlist regression: unmutated copy exit=0, nested coverage_note rejected (exit=1) with the exact path reported
  ℹ️  data/corpus/caoshan_benji.json: declared new document — 2026-09-20 Caoshan Benji record (task 046, P1-3): a new extraction from the pinned CBETA T47n1987A witness (撫州曹山元證禪師語錄; 84 units — 1 preface, 1 opening heading, 75 record paragraphs, 6 Caodong treatises, 1 close — tiling all 12,343 CJK characters of the fascicle; 169/169 fields EXACT, 0 flagged; 84/84 source-content fields collating; the sibling T47n1987B recension, X68n1315, T51n2076 and T48n2006 are probes, not claimed witnesses, and nothing is copied from them). Declared evidence: sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json + sessions/P1_CAOSHAN_BENJI_2026-09-20.md.
  ℹ️  data/corpus/chuandenglu_full.json: declared new document — 2026-09-20 full 30-fascicle Jingde Chuandeng Lu (task 045): a new extraction from the pinned CBETA T51n2076 witness (1,274 units — 971 biography entries, 69 titled works, 234 sections — tiling all 350,269 CJK characters of the 30 fascicles; 2,549/2,549 fields EXACT, 0 flagged; sibling of the untouched `chuandenglu` excerpt record, nothing copied from it). Declared evidence: sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json + sessions/P1_CHUANDENGLU_FULL_2026-09-20.md.
  ℹ️  data/corpus/congronglu.json: declared new document — 2026-09-20 Congronglu reinstatement (task 043, owner-ruled): a new extraction from the pinned CBETA T48n2004 witness (100 cases, 500/500 source-content fields EXACT, 0 flagged, no quarantined record copied). Declared evidence: sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json + sessions/COLLATION_W1_2026-09-20_CORRECTION.md.
  ℹ️  data/corpus/dahui_yulu_full.json: declared new document — 2026-09-21 task 050: 大慧普覺禪師語錄 T47n1998A (182,132 CJK, the juan 25–30 書 letters included) + 宗門武庫 T47n1998B (19,941 CJK), 1,354 units tiling 202,073 CJK characters; 2,709/2,709 fields EXACT, 0 flagged. T48n2001 (Hongzhi's Guanglu — the corpus's dahui_hongzhi selection claims nothing from it and this record claims nothing from it either) is a probe; the six-field dahui_hongzhi selection is the untouched sibling.
  ℹ️  data/corpus/dongshan_yulu_full.json: declared new document — 2026-09-21 task 050: 洞山良价禪師語錄, both Taishō parts (T47n1986A 15,843 + T47n1986B 8,596 CJK), 322 units tiling 24,439 CJK characters; 645/645 fields EXACT, 0 flagged; T47n1987A is a probe (its Five Ranks treatises are collated in caoshan_benji), and the earlier dongshan_yulu and baojing_sanmei records are untouched.
  ℹ️  data/corpus/huangbo_fayao_full.json: declared new document — 2026-09-21 task 050: 黃檗山斷際禪師傳心法要, complete from the pinned T48n2012A witness (19 units tiling all 6,632 CJK characters; 39/39 fields EXACT, 0 flagged; T48n2012B and X68n1315 are probes, not claimed, and the earlier huangbo_chuanxin seed is untouched).
  ℹ️  data/corpus/mazu_guanglu_full.json: declared new document — 2026-09-21 task 050: the record printed as X69n1321 (catalogued 馬祖道一禪師廣錄, 四家語錄卷一), complete (35 units tiling all 4,732 CJK characters; 71/71 fields EXACT, 0 flagged; T51n2076 and X68n1315 are probes, and the earlier mazu_yulu seed is untouched).
  ℹ️  data/corpus/yunmen_guanglu_full.json: declared new document — 2026-09-21 task 050: 雲門匡真禪師廣錄, complete from the pinned T47n1988 witness (776 units tiling all 43,678 CJK characters; 1,553/1,553 fields EXACT, 0 flagged; the anthology parallel in X68n1315 is a probe, and the earlier ten-section yunmen_yulu seed — whose retellings collate 0 against their claim — is left as it stands, not patched).
  ℹ️  data/corpus/zhaozhou_yulu_full.json: declared new document — 2026-09-21 task 050: 趙州真際禪師語錄 as printed in the Guzunsu yulu (X68n1315 juan 13–14, region-pinned between the anthology work heading and 古尊宿語錄卷第十五), 80 units tiling 21,038 CJK characters; 161/161 fields EXACT, 0 flagged. X68n1315 carries recorded historical reference drift (declared, not waived away); the corpus's prior 'T1987' claim stays recorded as false on the historical zhaozhou_yulu seed, which is untouched.
  ℹ️  data/corpus/baizhang_guanglu.json: permitted allowlisted change: .coverage_note, .sections[0].dialogue[0].editorial_note, .sections[0].dialogue[1].editorial_note, .sections[1].dialogue[0].editorial_note, .sections[1].dialogue[1].editorial_note, .sections[2].dialogue[0].editorial_note, .sections[2].dialogue[1].editorial_note
  ℹ️  data/corpus/baojing_sanmei.json: permitted allowlisted change: .coverage_note, .stanzas[1].pinyin, .stanzas[1].zh, .stanzas[2].pinyin, .stanzas[2].zh, .stanzas[3].pinyin, .stanzas[3].zh, .stanzas[5].pinyin, .stanzas[5].zh
  ℹ️  data/corpus/biyanlu_cases.json: permitted allowlisted change: .cases[0].dialogue[2].pinyin, .cases[0].dialogue[2].zh, .cases[0].pointer_zh, .cases[1].dialogue[1].pinyin, .cases[1].dialogue[1].zh, .cases[1].pointer_zh, .cases[2].dialogue[0].pinyin, .cases[2].dialogue[0].zh, .cases[2].pointer_zh, .cases[10].commentary_zh, .cases[11].dialogue[1].pinyin, .cases[11].dialogue[1].zh, .cases[14].dialogue[0].pinyin, .cases[14].dialogue[0].zh, .cases[17].dialogue[0].pinyin, .cases[17].dialogue[0].zh, .cases[19].editorial_note, .cases[19].verse_zh, .cases[22].dialogue[0].pinyin, .cases[22].dialogue[0].zh, .cases[30].dialogue[0].pinyin, .cases[30].dialogue[0].zh, .cases[50].dialogue[0].pinyin, .cases[50].dialogue[0].zh, .cases[64].pointer_zh, .cases[74].dialogue[0].pinyin, .cases[74].dialogue[0].zh, .cases[80].pointer_zh, .cases[81].dialogue[0].pinyin, .cases[81].dialogue[0].zh, .cases[87].dialogue[0].pinyin, .cases[87].dialogue[0].zh, .cases[95].dialogue[0].editorial_note, .cases[95].dialogue[0].pinyin, .cases[95].dialogue[0].zh, .cases[97].dialogue[0].pinyin, .cases[97].dialogue[0].zh, .cases[98].dialogue[0].pinyin, .cases[98].dialogue[0].zh, .coverage_note, .zh_chars
  ℹ️  data/corpus/bodhidharma_erru.json: permitted allowlisted change: .coverage_note, .sections[0].dialogue[1].pinyin, .sections[0].dialogue[1].zh, .sections[1].dialogue[0].pinyin, .sections[1].dialogue[0].zh, .sections[1].dialogue[1].pinyin, .sections[1].dialogue[1].zh, .sections[2].dialogue[0].pinyin, .sections[2].dialogue[0].zh, .sections[2].dialogue[1].pinyin, .sections[2].dialogue[1].zh
  ℹ️  data/corpus/caoxi_zhuan.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/chuandenglu.json: permitted allowlisted change: .coverage_note, .sample_records[0].dialogue[2].editorial_note, .sample_records[0].dialogue[3].pinyin, .sample_records[0].dialogue[3].zh, .sample_records[1].dialogue[1].pinyin, .sample_records[1].dialogue[1].zh
  ℹ️  data/corpus/dahui_hongzhi.json: permitted allowlisted change: .cbeta_id, .cbeta_note, .coverage_note, .sections[0].dialogue[0].pinyin, .sections[0].dialogue[0].zh, .sections[0].dialogue[1].pinyin, .sections[0].dialogue[1].zh, .sections[1].dialogue[0].pinyin, .sections[1].dialogue[0].zh, .sections[1].dialogue[1].pinyin, .sections[1].dialogue[1].zh, .sections[2].dialogue[0].pinyin, .sections[2].dialogue[0].zh, .sections[3].dialogue[0].pinyin, .sections[3].dialogue[0].zh
  ℹ️  data/corpus/dahui_shobogenzo.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/dazhu_huihai.json: permitted allowlisted change: .coverage_note, .sections[0].dialogue[0].editorial_note, .sections[0].dialogue[1].editorial_note, .sections[1].dialogue[0].editorial_note, .sections[1].dialogue[1].editorial_note, .sections[2].dialogue[0].editorial_note, .sections[2].dialogue[1].editorial_note
  ℹ️  data/corpus/deshan_yulu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/dongshan_yulu.json: permitted allowlisted change: .coverage_note, .five_ranks[0].verse_pinyin, .five_ranks[0].verse_zh, .five_ranks[1].verse_pinyin, .five_ranks[1].verse_zh, .five_ranks[2].verse_pinyin, .five_ranks[2].verse_zh, .five_ranks[3].verse_pinyin, .five_ranks[3].verse_zh, .five_ranks[4].verse_pinyin
  ℹ️  data/corpus/fayan_yulu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/foyan_qingyuan.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/guiyang_yulu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/huangbo_chuanxin.json: permitted allowlisted change: .coverage_note, .sections[0].dialogue[1].pinyin, .sections[0].dialogue[1].zh, .sections[1].dialogue[0].editorial_note, .sections[2].dialogue[0].editorial_note, .sections[3].dialogue[0].pinyin, .sections[3].dialogue[0].zh, .sections[5].dialogue[0].editorial_note, .sections[7].dialogue[0].editorial_note, .sections[8].dialogue[0].editorial_note, .sections[9].dialogue[0].editorial_note
  ℹ️  data/corpus/huangbo_wanling.json: permitted allowlisted change: .cbeta_note, .coverage_note, .sections[0].dialogue[0].editorial_note, .sections[0].dialogue[1].editorial_note, .sections[1].dialogue[0].editorial_note, .sections[1].dialogue[1].editorial_note, .sections[2].dialogue[0].editorial_note, .sections[3].dialogue[0].editorial_note, .sections[3].dialogue[1].editorial_note, .sections[3].editorial_note
  ℹ️  data/corpus/lidai_fabao_ji.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/linji_yulu.json: permitted allowlisted change: .coverage_note, .sections[0].dialogue[1].zh, .sections[67].dialogue[0].pinyin, .sections[67].dialogue[0].zh, .sections[68].dialogue[0].pinyin, .sections[68].dialogue[0].zh, .sections[69].dialogue[0].pinyin, .sections[69].dialogue[0].zh, .sections[70].dialogue[0].pinyin, .sections[70].dialogue[0].zh, .sections[71].dialogue[0].editorial_note, .sections[72].dialogue[0].editorial_note, .sections[73].dialogue[0].editorial_note, .zh_chars
  ℹ️  data/corpus/mazu_yulu.json: permitted allowlisted change: .coverage_note, .sections[0].dialogue[0].pinyin, .sections[0].dialogue[0].zh, .sections[1].dialogue[0].editorial_note, .sections[1].dialogue[1].pinyin, .sections[1].dialogue[1].zh, .sections[1].dialogue[2].pinyin, .sections[1].dialogue[2].zh, .sections[2].dialogue[0].pinyin, .sections[2].dialogue[0].zh, .sections[4].dialogue[0].pinyin, .sections[4].dialogue[0].zh, .sections[5].dialogue[0].pinyin, .sections[5].dialogue[0].zh
  ℹ️  data/corpus/nanquan_yulu.json: permitted allowlisted change: .coverage_note, .sections[0].dialogue[0].editorial_note, .sections[0].dialogue[1].editorial_note, .sections[1].dialogue[0].editorial_note, .sections[1].dialogue[1].editorial_note, .sections[2].dialogue[0].editorial_note, .sections[2].dialogue[1].editorial_note
  ℹ️  data/corpus/platform_sutra.json: permitted allowlisted change: .chapters[0].verses[0].recension_note, .chapters[0].verses[1].recension_note, .chapters[1].dialogue[0].recension_note, .chapters[1].dialogue[1].recension_note, .chapters[2].recension_note, .chapters[3].dialogue[0].recension_note, .chapters[4].dialogue[0].recension_note, .chapters[5].recension_note, .chapters[6].recension_note, .chapters[7].recension_note, .chapters[8].recension_note, .chapters[9].recension_note, .coverage_note, .recension_note
  ℹ️  data/corpus/qinggui_monastic_codes.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/sengzhao_zhaolun.json: permitted allowlisted change: .author_en, .author_zh, .cbeta_note, .coverage_note, .era, .genre, .overview, .sections[0].dialogue[0].pinyin, .sections[0].dialogue[0].translations.cleary.text, .sections[0].dialogue[0].translations.liebenthal.text, .sections[0].dialogue[0].translations.red_pine.text, .sections[0].dialogue[0].zh, .sections[0].dialogue[1].pinyin, .sections[0].dialogue[1].translations.cleary.text, .sections[0].dialogue[1].translations.liebenthal.text, .sections[0].dialogue[1].translations.red_pine.text, .sections[0].dialogue[1].zh, .sections[0].title_en, .sections[0].title_pinyin, .sections[0].title_zh, .sections[1].dialogue[0].pinyin, .sections[1].dialogue[0].translations.cleary.text, .sections[1].dialogue[0].translations.liebenthal.text, .sections[1].dialogue[0].translations.red_pine.text, .sections[1].dialogue[0].zh, .sections[1].title_en, .sections[1].title_pinyin, .sections[1].title_zh, .sections[2].dialogue[0].pinyin, .sections[2].dialogue[0].translations.cleary.text, .sections[2].dialogue[0].translations.liebenthal.text, .sections[2].dialogue[0].translations.red_pine.text, .sections[2].dialogue[0].zh, .sections[2].section_id, .sections[2].title_en, .sections[2].title_pinyin, .sections[2].title_zh, .title_en, .title_pinyin, .title_zh
  ℹ️  data/corpus/shitou_sandokai.json: permitted allowlisted change: .coverage_note, .sections[0].stanzas[5].zh, .sections[0].stanzas[6].pinyin, .sections[0].stanzas[6].zh, .sections[0].stanzas[7].pinyin, .sections[0].stanzas[7].zh, .sections[0].stanzas[9].pinyin, .sections[0].stanzas[9].zh, .sections[1].stanzas[0].pinyin, .sections[1].stanzas[0].translations.cleary.text, .sections[1].stanzas[0].translations.red_pine.text, .sections[1].stanzas[0].translations.sasaki.text, .sections[1].stanzas[0].zh
  ℹ️  data/corpus/wudeng_huiyuan.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/wumenguan.json: permitted allowlisted change: .cases[0].commentary_pinyin, .cases[0].commentary_zh, .cases[1].commentary_pinyin, .cases[1].commentary_zh, .cases[1].dialogue[1].pinyin, .cases[1].dialogue[1].zh, .cases[1].dialogue[2].pinyin, .cases[1].dialogue[2].zh, .cases[2].commentary_pinyin, .cases[2].commentary_zh, .cases[2].dialogue[0].pinyin, .cases[2].dialogue[0].zh, .cases[2].dialogue[1].pinyin, .cases[2].dialogue[1].zh, .cases[2].verse_pinyin, .cases[2].verse_zh, .cases[3].commentary_pinyin, .cases[3].commentary_zh, .cases[3].dialogue[0].pinyin, .cases[3].dialogue[0].zh, .cases[3].verse_pinyin, .cases[3].verse_zh, .cases[4].commentary_pinyin, .cases[4].commentary_zh, .cases[4].dialogue[0].pinyin, .cases[4].dialogue[0].zh, .cases[4].verse_pinyin, .cases[4].verse_zh, .cases[5].commentary_pinyin, .cases[5].commentary_zh, .cases[5].dialogue[0].pinyin, .cases[5].dialogue[0].zh, .cases[5].verse_pinyin, .cases[5].verse_zh, .cases[6].dialogue[0].pinyin, .cases[6].dialogue[0].zh, .cases[9].verse_pinyin, .cases[9].verse_zh, .cases[10].dialogue[0].pinyin, .cases[10].dialogue[0].zh, .cases[10].dialogue[1].pinyin, .cases[10].dialogue[1].zh, .cases[11].commentary_pinyin, .cases[11].commentary_zh, .cases[12].dialogue[0].pinyin, .cases[12].dialogue[0].zh, .cases[13].dialogue[0].pinyin, .cases[13].dialogue[0].zh, .cases[13].dialogue[1].pinyin, .cases[13].dialogue[1].zh, .cases[16].verse_pinyin, .cases[16].verse_zh, .cases[17].commentary_pinyin, .cases[17].commentary_zh, .cases[18].commentary_pinyin, .cases[18].commentary_zh, .cases[18].dialogue[0].pinyin, .cases[18].dialogue[0].zh, .cases[18].dialogue[2].pinyin, .cases[18].dialogue[2].zh, .cases[18].dialogue[3].pinyin, .cases[18].dialogue[3].zh, .cases[19].commentary_pinyin, .cases[19].commentary_zh, .cases[19].dialogue[0].pinyin, .cases[19].dialogue[0].zh, .cases[19].verse_pinyin, .cases[19].verse_zh, .cases[20].commentary_pinyin, .cases[20].commentary_zh, .cases[22].commentary_pinyin, .cases[22].commentary_zh, .cases[22].dialogue[0].pinyin, .cases[22].dialogue[0].zh, .cases[22].dialogue[1].pinyin, .cases[22].dialogue[1].zh, .cases[22].dialogue[2].pinyin, .cases[22].dialogue[2].zh, .cases[22].verse_pinyin, .cases[22].verse_zh, .cases[24].verse_pinyin, .cases[24].verse_zh, .cases[26].dialogue[0].pinyin, .cases[26].dialogue[0].zh, .cases[28].commentary_pinyin, .cases[28].commentary_zh, .cases[28].dialogue[0].pinyin, .cases[28].dialogue[0].zh, .cases[28].dialogue[1].pinyin, .cases[28].dialogue[1].zh, .cases[28].verse_pinyin, .cases[28].verse_zh, .cases[29].verse_pinyin, .cases[29].verse_zh, .cases[31].dialogue[0].pinyin, .cases[31].dialogue[0].zh, .cases[31].dialogue[1].pinyin, .cases[31].dialogue[1].zh, .cases[32].verse_pinyin, .cases[32].verse_zh, .cases[34].commentary_pinyin, .cases[34].commentary_zh, .cases[36].verse_pinyin, .cases[36].verse_zh, .cases[39].commentary_pinyin, .cases[39].commentary_zh, .cases[39].dialogue[1].pinyin, .cases[39].dialogue[1].zh, .cases[39].verse_pinyin, .cases[39].verse_zh, .cases[43].verse_pinyin, .cases[43].verse_zh, .cases[45].verse_pinyin, .cases[45].verse_zh, .cases[46].commentary_pinyin, .cases[46].commentary_zh, .cases[46].verse_pinyin, .cases[46].verse_zh, .cases[47].commentary_pinyin, .cases[47].commentary_zh, .cases[47].dialogue[1].pinyin, .cases[47].dialogue[1].zh, .coverage_note, .epilogue.editorial_note, .preface.pinyin, .preface.zh, .zh_chars
  ℹ️  data/corpus/xinxin_ming.json: permitted allowlisted change: .coverage_note, .stanzas[10].pinyin, .stanzas[10].zh, .stanzas[14].zh, .stanzas[16].pinyin, .stanzas[16].zh, .stanzas[17].pinyin, .stanzas[17].zh, .stanzas[18].pinyin, .stanzas[18].zh, .stanzas[21].pinyin, .stanzas[21].zh, .stanzas[22].pinyin, .stanzas[22].zh, .stanzas[23].pinyin, .stanzas[23].zh, .stanzas[27].pinyin, .stanzas[27].zh, .stanzas[28].pinyin, .stanzas[28].zh, .stanzas[31].editorial_note, .stanzas[32].zh, .stanzas[34].pinyin, .stanzas[34].zh
  ℹ️  data/corpus/xuansha_yulu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/xuefeng_yantou.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/yuanwu_letters.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/yunmen_yulu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/zhaozhou_yulu.json: permitted allowlisted change: .cbeta_id, .cbeta_note, .coverage_note, .dialogues[1].dialogue[0].translations.hoffman.source.reference, .dialogues[1].dialogue[1].translations.hoffman.source.reference, .taisho_vol
  ℹ️  data/corpus/zhengdao_ge.json: permitted allowlisted change: .coverage_note
35 corpus files compared
9 declared new corpus file(s): data/corpus/caoshan_benji.json, data/corpus/chuandenglu_full.json, data/corpus/congronglu.json, data/corpus/dahui_yulu_full.json, data/corpus/dongshan_yulu_full.json, data/corpus/huangbo_fayao_full.json, data/corpus/mazu_guanglu_full.json, data/corpus/yunmen_guanglu_full.json, data/corpus/zhaozhou_yulu_full.json
400 permitted allowlisted changes
0 unauthorized changes
✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes
```

## `python3 scripts/test_source_review_rules.py`

```text
Focused mutation partition: exit=1, metrics_byte_identical=True
Focused mutation report-metadata: exit=1, metrics_byte_identical=True

  corpus *_note keys measured now (data-driven):
    cbeta_note       occurrences=28  files=28  app.js mentions=2   nodes=$ -> RENDERED
    coverage_note    occurrences=42  files=42  app.js mentions=4   nodes=$ -> EXEMPT
    editorial_note   occurrences=41  files=11  app.js mentions=2   nodes=$.cases[], $.cases[].dialogue[], $.epilogue, $.sample_records[].dialogue[], $.sections[], $.sections[].dialogue[], $.stanzas[] -> RENDERED
    recension_note   occurrences=14  files=1   app.js mentions=2   nodes=$, $.chapters[], $.chapters[].dialogue[], $.chapters[].verses[] -> RENDERED

145 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK
```

## `node scripts/smoke_test.mjs`

```text
DATA loaded. corpus keys: 44
APP executed + init() completed without crash
RENDERER: 44 corpus texts exercised, 0 crashes
W1 source-review rule suite: ✅ W1 SOURCE-REVIEW RULES OK
Source-preservation suite: ✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes
RENDER-LAZY: hidden rooms rendered on first tab activation

✅ SMOKE TEST PASSED
```

## `diff -rq data docs/data`

```text
```

## Baseline `python3 scripts/validate_data.py` (before edits; exit 1)

```text
❌ README.md: doc truthfulness: honest-status CJK counts drifted — expected snippet not found: '**855,603 source-content CJK characters** (or 917,778 across every corpus JSON string' (update the document, or the check rule in validate_data.py if the prose changed intentionally)
❌ AUDIT.md: doc truthfulness: current-verdict CJK counts drifted — expected snippet not found: '**855,603 content CJK / 917,778 all-string CJK**' (update the document, or the check rule in validate_data.py if the prose changed intentionally)
❌ ROADMAP.md: doc truthfulness: missing pinned provenance-note census figure ('**125** provenance'); measured totals: total=125, rendered=83, docs=35, cbeta_note=28
❌ vision.md: doc truthfulness: missing pinned provenance-note census figure ('**125** provenance'); measured totals: total=125, rendered=83, docs=35, cbeta_note=28
❌ RESEARCH_RELEASE_PLAN.md: doc truthfulness: missing pinned provenance-note census figure ('**125** provenance'); measured totals: total=125, rendered=83, docs=35, cbeta_note=28
❌ data/project_metrics.json: is stale; run scripts/validate_data.py --write-metrics

Validation failed with 6 error(s).
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
```
