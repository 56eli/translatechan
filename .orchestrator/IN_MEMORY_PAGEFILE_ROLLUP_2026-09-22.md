# In-Memory Pagefile Rollup — 2026-09-22 post PR108 14-doc law

## Current State (main 43be5c6 after PR108 merge)
- Corpus: 14 docs (12 collated_to_claimed_witness +2 witness_unavailable hanshan/niutou), 1 complete_selected_witness (wumenguan 48/48), 13 partial_selected_witness/excerpt_seed
- Content CJK: 775,113 / all-string 832,897 (was 758,747/814,652 before Linji/Wumenguan)
- Locators: 4092/4092 case-level +4 doc-level seeds
- Flagged: 15 authoritative (630 historical ledger stays)
- Bundle: 7,511,135 B deterministic, root/docs mirror byte-identical
- Export: 25 files, commit 1753ca0, sha256 mandatory OK, ready marker OK
- Gates: validate PASS, build PASS, preservation 12+2 declared new, review 145 PASS, smoke PASS
- Lineage: 35 masters, 24 gongan indexed, 31 glossary terms

## What PR108 Fixed
- Combined Wumenguan T48n2005 48 cases 207/207 EXACT + Linji T47n1985 107 sections 215/215 EXACT as one dated overlay
- traceability_queue 4 records, reference manifest 19 works (T48n2005 + T47n1985), reproduction 5 compared 2 differing 169→15
- Docs truthfulness updated, GATE law compliant (git clone at manifest commit official delivery, mandatory sha256, unprivileged disposable stdlib-only, Python min 3.11 tested 3.11/3.12)

## Glaring Corpus Issues (from ROADMAP_ALL_ENCOMPASSING §3 + ROADMAP_100PCT + WITNESS_INVENTORY)
### Tier1 — heavily read, missing after purge (biggest practitioner gap)
- biyanlu_cases: 100 cases Blue Cliff Record, previously 100/100 case records but 353/395 collating, purged as retelling — needs proper re-key from T48n2003 verbatim
- platform_sutra: 10 chapters, 680 CJK currently but recension split Dunhuang T48n2007 vs Zongbao T48n2008 — needs honest recension_note + R-B labels, decision keep 9 précis or re-key to T48n2007
- xinxin_ming: 37 stanzas Trust in Mind, previously 24/37 collating — needs re-key T48n2010
- No complete_selected_witness except wumenguan — 13 docs partial though tiling verbatim (congronglu 100/100, chuandenglu_full 1274 units, caoshan 84/84, huangbo_fayao_full 19, mazu 35, yunmen 776, dongshan 322, zhaozhou 80, dahui 1354, linji 107) — need unit_targets + completion_status update to complete_selected_witness

### Tier2 — core yulu 0/6 collating as project compositions (13 works per §3.3)
- baizhang_guanglu 0/6 only carrier X80n1565 fragments 16-28 graphs
- huangbo_wanling 0/7 0/7 in all 39 refs
- dazhu_huihai 0/6 largest run 23/27
- guiyang_yulu (Guishan + Yangshan) 0/6
- fayan_yulu (Fayan Wenyi) 0/6
- xuansha_yulu (Xuansha Shibei) partial
- xuefeng_yantou (Xuefeng Yicun + Yantou Quanhuo) partial
- deshan_yulu (Deshan Xuanjian) 0/6
- nanquan_yulu 0/6
- etc — all need WITNESS_INVENTORY measurement via collate_corpus --doc <id> + authenticity labels per 047 pattern or R-A re-key if ≥80% carrier found

### Tier3 — long tail (80% of missing CJK volume, scholarly lookup)
- Wudeng Huiyuan full (we have 3 sections), Guzunsu yulu 48 fascicles ~20 masters, Zutangji 952, etc — 100+ X-series yulu

### Lineage & Gong'an
- 35 masters vs target 150-200, 30 edges traditional_link_pending_exact_locator, 3 unlinked frontier
- 24 gongan indexed vs 100 cases Biyanlu + 100 Congronglu + 48 Wumenguan = 248 potential

## Next Dispatch Priority (owner ruling: Pages out of scope, no workflow edit, 630 stays authoritative, no generated placeholders)
1. P1 Biyanlu + Platform + Xinxin re-key (Tier1 top 3 missing)
2. P1 Complete marking — make 10+ partial docs complete_selected_witness by adding unit_targets
3. P2 Tier2 yulu batch1 — Guiyang + Fayan authenticity labels or re-key
4. P2 Tier2 yulu batch2 — Xuansha + Xuefeng + Deshan
5. P3 Lineage expansion batch — 25 new masters from Guzunsu yulu + exact locators

Each PR: one doc per PR per Ruling 3 (except complete marking batch allowed), py_compile PASS, validate PASS, build deterministic byte-identical root/docs twice, preservation 0 unauthorized, review 145+, smoke PASS, mirror clean, collate output verbatim quoted.
