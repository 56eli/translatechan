# P3 Lineage Locator Batch 3 — 2026-09-21 (remaining 13 edges: 9 internal + 4 frontiers)

Base: `6d36957` (44 docs after enthusiast + batch1+2, 10 collated, 4,192 locators, 8,754,966 B bundle, lineage 18 verified =10 exact+8 source, 13 pending, 33/35 linked 2 unlinked yangqi reviewed + dahong).

## Completed

The remaining 13 edges (9 internal + 4 frontier) were reviewed against the 1,274-unit `chuandenglu_full` witness anchored to CBETA XML revision `dbdea41071e1e260ad84b72faefd4587333cf76d` and Wudeng Huiyuan X80n1565 for Song masters.

**9 internal edges verified:**

1. **baizhang_huaihai → huangbo_xiyun** — `exact_locator_verified` — T51n2076_p0249b26–p0250c26 fasc 6 洪州百丈山懷海禪師 case 128 — verbatim: 即有溈山黃蘗當其首 — Baizhang's assembly lists Weishan and Huangbo as leading disciples. Also Huangbo case fasc 9 p0266a03: 往參百丈問曰從上宗承如何指示
2. **huangbo_xiyun → linji_yixuan** — `exact_locator_verified` — T51n2076_p0299b12–p0301c27 fasc 13 懷讓禪師第四世前洪州黃檗山希運禪師法嗣 case 270 — verbatim: 懷讓禪師第四世前洪州黃檗山希運禪師法嗣鎮州臨濟義玄禪師...初在黃檗隨眾參侍 — Linji listed as Huangbo's heir
3. **mazu_daoyi → nanquan_puyuan** — `exact_locator_verified` — T51n2076_p0257b18–p0259b04 fasc 8 池州南泉普願禪師 case 156 — verbatim: 初在江西大寂禪師處 — Nanquan studied under Mazu (Jiangxi Daji)
4. **shitou_xiqian → yaoshan_weiyan** — `exact_locator_verified` — T51n2076_p0309b01–p0309c14 fasc 14 石頭希遷大師 + p0311b16–p0312c02 澧州藥山惟儼禪師 case 314 — verbatim: 即謁石頭密領玄旨 — Yaoshan received mysterious旨 from Shitou
5. **yaoshan_weiyan → yunyan_tansheng** — `exact_locator_verified` — T51n2076_p0311b16–p0312c02 fasc 14 藥山 + p0314c24–p0315b18 雲巖曇晟禪師 case 320 — verbatim: 師問雲巖作什麼巖曰擔屎 — Yunyan as attendant/disciple of Yaoshan; Yunyan case: 藥山惟儼禪師法嗣
6. **deshan_xuanjian → xuefeng_yicun** — `exact_locator_verified` — T51n2076_p0317b13–p0318a27 fasc 15 朗州德山宣鑒禪師 case 326 — verbatim: 師令侍者喚義存存上來...雪峯問古人斬猫兒意如何 — Deshan calls Yicun (Xuefeng) and Xuefeng questions Deshan
7. **xuefeng_yicun → xuansha_shibei** — `exact_locator_verified` — T51n2076_p0327a11–p0328b13 fasc 16 雪峰義存禪師 case 344 + p0343c27–p0347b15 福州玄沙宗一師備大師 case 380 — verbatim: 與雪峯義存本法門昆仲而親近若師資雪峯以其苦行呼為頭陀 + 玄沙曰山頭老漢蹉過溈山也 — Xuansha close like teacher-student to Xuefeng
8. **xuansha_shibei → luohan_guichen** — `exact_locator_verified` — T51n2076_p0343c27–p0347b15 fasc 18 玄沙宗一師備大師 case 380 — verbatim: 羅漢云桂琛見有眼耳和尚作麼生接 — Luohan Guichen speaks in Xuansha's assembly as disciple
9. **baiyun_shouduan → wuzu_fayan** — `source_verified` — X80n1565 fascicle 19 Wudeng Huiyuan heir-list (Song masters postdate T2076, no T2076 lb anchor) — Baiyun Shouduan (1025-1072) → Wuzu Fayan (1024-1104) carried in X1565 fasc 19 heir-list, T51n2076 30 fascicles ends 1004 before Song

**4 frontier edges documented:**

- **prajnatara → bodhidharma** — frontier Indian patriarch, Prajñātāra linked via chuandenglu_full case 38 T51n2076_p0216a19–p0216b20 as 27th patriarch, teacher link remains traditional_link_pending_exact_locator frontier, no Chinese biographical witness
- **longtan_chongxin → deshan_xuanjian** — frontier, Longtan linked via wumenguan/deshan_yulu/biyanlu_cases but no exact biographical locator in T2076 for teacher link, remains frontier
- **yangqi_fanghui → baiyun_shouduan** — frontier, Yangqi reviewed batch2 2026-09-21, active corpus has no biographical witness for 楊岐方會, 方會 hits in Biyanlu commentary are grammatical phrase, linked_corpus_keys [] intentional, remains frontier pending exact locator
- **dahong_zuzheng → yuelin_shiguan** — frontier, Dahong no biographical witness in active corpus, linked_corpus_keys [] intentional, remains frontier

## Verification summary

- `lineage_verification.json`: 9 additional edges moved from pending to verified (8 exact + 1 source) — total now 18 exact + 9 source = 27 verified, 4 pending frontiers, total 31
- `masters.json`: 35 masters, 33 linked, 2 unlinked intentional frontiers yangqi_fanghui (reviewed) + dahong_zuzheng, prajnatara linked via chuandenglu_full case 38, longtan linked via wumenguan/deshan_yulu/biyanlu_cases
- Warnings: 2 unlinked intentional frontiers documented
- No corpus text changes, only lineage registry

## Method note

Locators recorded as fascicle/page-line references to full Jingde Transmission of the Lamp witness plus lb ranges. Where entry is carried in fascicle heir-list, reference identifies fascicle/list and preserves source-review caveat instead of fabricating quotation. Batch1 used T51n2076_pXXXX lb anchors with verbatim, batch2 used fascicle/page-line source_verified, batch3 continues both patterns — 8 exact with lb range + verbatim, 1 source with X1565 reference for Song masters beyond T2076 scope.

## Gates

```
py_compile PASS
validate_data PASS corpus44 slots1252 verified177 matrix21 locators4192/4192 collated10 flagged630 evidence2026-09-21 enthusiast overlay, lineage 31 edges 18 exact +9 source=27 verified 4 frontier pending
build_data_bundle PASS 44 docs 8,759,896 B deterministic byte-identical root/docs twice
preservation PASS 0 unauthorized
review PASS 145+
smoke PASS 44 texts
mirror diff PASS
```

## Open-ended scope note

ROADMAP_ALL_ENCOMPASSING 102 masters snapshot NOT exhaustive, target 150-200, more material in circulation — agents must continue searching beyond draft registry per 2026-09-21 disclaimer.
