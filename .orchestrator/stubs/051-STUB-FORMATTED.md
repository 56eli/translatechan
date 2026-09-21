Task: P3 Lineage Exact Locators Batch 1 — 10 edges + 1 unlinked master

Base: main ddce5c3 (44 docs after enthusiast 100% closer, 10 collated, 4,192 locators, 553k+302k content CJK, 8.7M bundle, P0+P1+P2 done, enthusiast 100% closer done)

Why P3: Lineage second core objective, 35 masters scaffold not graph, 31 edges traditional_link_pending_exact_locator, 29 masters needs_exact_locator, 3 unlinked frontier prajnatara/yangqi_fanghui/dahong_zuzheng + longtan_chongxin frontier — need exact locators now enabled by Chuandeng Lu full 1,274 units 2,549/2,549 EXACT 0 flagged lineage backbone source for 30 pending edge locators.

Steps:
1. Inventory lineage_verification.json 31 edges, pick first 10 edges (bodhidharma→huike, huike→sengcan, sengcan→daoxin, daoxin→hongren, hongren→huineng, huineng→nanyue_huairang, huineng→qingyuan_xingsi, nanyue_huairang→mazu_daoyi, qingyuan_xingsi→shitou_xiqian, mazu_daoyi→baizhang_huaihai) find exact locators via /tmp/refs/ref_T51n2076.txt and chuandenglu_full.json sections lb-anchored
2. For unlinked master pick one prajnatara/yangqi_fanghui/dahong_zuzheng/longtan_chongxin — link to existing corpus key or mark frontier explicit profile_evidence
3. Update lineage_verification.json with exact locators status exact_locator_verified reference page/line source_id note
4. Update masters.json linked_corpus_keys profile_evidence
5. Gates: py_compile, validate corpus44 locators4192 collated10 flagged630, build 44 docs 8.7M deterministic byte-identical docs mirror identical, preservation 0 unauthorized, review 145+, smoke 44, mirror diff
6. Report sessions/P3_LINEAGE_BATCH1_2026-09-21.md with exact locators for 10 edges, unlinked master handling, gate outputs verbatim, before/after warnings empty linked_corpus_keys 3→2
7. Commit + push, PR description includes verbatim outputs

Banned: git show <sha> without --name-only/--stat, git log -p on bundle. Safe: --name-only, --stat, --oneline, ls -lh, cat, jq.

Out of scope: Pages deployment/creation, corpus ingestion (P1 done P2 done enthusiast 100% done), English translations (049 roadmap draft), rights P4, translation P5, CBETA inventory P6.

Verification: py_compile PASS, validate corpus44 locators4192 collated10 flagged630, build 44 docs 8.7M deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 44, mirror diff, exact locators for 10 edges verified via T51n2076 or chuandenglu_full, unlinked master handled, warnings 3→2, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired.

Branch: fix/p3-lineage-batch1, orchestrator arena/01a09829-translatechan
