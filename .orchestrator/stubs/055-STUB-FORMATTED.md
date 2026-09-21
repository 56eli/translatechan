Task: P3 Lineage Frontier Finalization — 4 frontiers + X1565 lb anchors — final 0 pending

Base: main e2ee031 (44 docs after enthusiast + batch1+2+3 27 verified 4 frontier, 10 collated, 4,192 locators, 8,763,968 B bundle, 33/35 linked 2 unlinked yangqi reviewed + dahong, P2 Dazhu/Nanquan enhanced labels)

Why P3 frontier final: After batch3 27 verified 4 frontier pending, need 0 pending or fully documented frontier to unblock graph, lineage second core objective, enable BookStack wiki lineage trees.

Steps:
1. Clone CBETA XML P5 dbdea410: git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5, sparse-checkout X/X80/X80n1565.xml, checkout, extract via collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs --work-list X80n1565 --write-digest-manifest /tmp/refs/manifest.txt
2. Search X1565 ref 1.3M CJK for Baiyun Shouduan, Wuzu Fayan, Longtan Chongxin, Dahong Zuzheng, Yuelin Shiguan, Prajnatara — find fascicle/page-line and lb anchors if possible, also search chuandenglu_full 1,274 units for Longtan/Dahong
3. For each frontier: if witness found in X1565, update lineage_verification.json with exact_locator_verified (lb range+verbatim) or source_verified (fascicle/page-line), source_id wudeng-huiyuan or jingde-chuandenglu, note with verbatim
4. If no witness: mark frontier with explicit profile_evidence note explaining search method (searched chuandenglu_full 1,274 units, X1565 1.3M CJK, active corpus 44 docs, no biographical witness), keep linked_corpus_keys [] intentional, profile_status frontier_profile_reviewed_pending_exact_locator
5. Update masters.json profile_status and profile_evidence for yangqi/dahong/prajnatara/longtan
6. Gates: py_compile, validate corpus44 locators4192 collated10 flagged630 lineage 31 edges 31 verified or 27 verified +4 documented frontier pending 0 or intentional, build 44 docs 8.76M deterministic byte-identical root/docs twice, preservation 0 unauthorized, review 145+, smoke 44, mirror diff
7. Report sessions/P3_LINEAGE_FRONTIER_FINAL_2026-09-21.md with X1565 extraction digest verification, for each of 4 frontiers old status new status exact locator or frontier documentation, gate outputs verbatim, before/after warnings 2→0 or documented intentional

Banned: git show <sha> without --name-only/--stat, git log -p on bundle. Safe: --name-only, --stat, --oneline, ls -lh, cat, jq.

Out of scope: Pages deployment/creation, corpus ingestion, English translations 049, rights P4, translation P5, CBETA inventory P6.

Verification: validate corpus44 locators4192 collated10 flagged630 lineage 31 edges 31 verified or 27 verified +4 documented frontier pending 0 or intentional, build 44 docs 8.76M deterministic, preservation 0 unauthorized, review 145+, smoke 44, mirror diff, frontier masters handled with explicit evidence.

Branch: fix/p3-lineage-frontier-final, orchestrator arena/01a09829-translatechan
