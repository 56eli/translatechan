Task: P3 Lineage Exact Locators Batch 2 — 10 edges + 1 unlinked master

Base: main ddce5c3 (44 docs after enthusiast 100% closer, 10 collated, 4,192 locators, 8.7M bundle, P0+P1+P2 done, enthusiast 100% closer done)

Why P3 batch2: After batch1 10 exact 21 pending, 1 unlinked handled 2 remaining — continue lineage second core objective scaffold not graph.

Steps:
1. Inventory remaining 21 edges pick next 10 edges (baizhang_huaihai→huangbo_xiyun, huangbo_xiyun→linji_yixuan, etc.)
2. For unlinked master pick next yangqi_fanghui/dahong_zuzheng/prajnatara/longtan_chongxin — handle
3. Update lineage_verification.json with exact locators status exact_locator_verified
4. Update masters.json
5. Gates: py_compile, validate corpus44 locators4192 collated10 flagged630, build 44 docs 8.7M deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 44, mirror diff
6. Report sessions/P3_LINEAGE_BATCH2_2026-09-21.md with exact locators for 10 edges, unlinked master handling, gate outputs verbatim, before/after warnings 2→1

Banned: git show <sha> without --name-only/--stat, git log -p on bundle. Safe: --name-only, --stat, --oneline, ls -lh, cat, jq.

Out of scope: Pages deployment/creation, corpus ingestion, English translations 049, rights P4, translation P5, CBETA inventory P6.

Verification: validate corpus44 locators4192 collated10 flagged630, build 44 docs 8.7M deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 44, mirror diff, exact locators for 10 edges verified, unlinked master handled, warnings 2→1 or 0, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired.

Branch: fix/p3-lineage-batch2, orchestrator arena/01a09829-translatechan
