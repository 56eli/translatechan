Task: P3 Lineage Exact Locators Batch 3 — remaining 13 edges (9 internal + 4 frontiers) — final batch

Base: main 6d36957 (44 docs after enthusiast + batch1+2, 10 collated, 4,192 locators, 8.75M bundle, 18 verified =10 exact+8 source, 13 pending, 33/35 linked 2 unlinked yangqi reviewed + dahong)

Why P3 batch3 final: After batch1+2 18 verified 13 pending, 2 unlinked frontier — need 0 pending or documented frontier to unblock graph, lineage second core objective.

Steps:
1. Inventory remaining 13 edges: 9 internal baizhang→huangbo T2012A, huangbo→linji T1985, mazu→nanquan X1315/T2076 f8, shitou→yaoshan T2076 f14/X1565, yaoshan→yunyan T2076 f14/X1565, deshan→xuefeng X1333/T2076 f16, xuefeng→xuansha X1445/T2076 f18, xuansha→luohan T2076 f21/X1565, baiyun→wuzu T1995/X1565 f19 + 4 frontiers prajnatara→bodhidharma, longtan→deshan, yangqi→baiyun, dahong→yuelin
2. For 9 internal: find exact locators via /tmp/refs/ref_T51n2076.txt + chuandenglu_full.json 1,274 units + X-series X68n1315/X80n1565 etc — aim exact_locator_verified with T51n2076_pXXXX lb range + Verbatim text, else source_verified fascicle/page-line
3. For 4 frontiers: search active corpus for biographical witness, if none mark frontier with explicit profile_evidence note, keep linked_corpus_keys [] intentional, profile_status frontier_profile_reviewed_pending_exact_locator
4. Update lineage_verification.json status, reference, source_id, note
5. Update masters.json linked_corpus_keys, profile_status, profile_evidence for yangqi/dahong/prajnatara/longtan
6. Gates: py_compile, validate corpus44 locators4192 collated10 flagged630 lineage 31 edges 31 verified pending 0, build 44 docs 8.75M deterministic byte-identical root/docs twice, preservation 0 unauthorized, review 145+, smoke 44, mirror diff
7. Report sessions/P3_LINEAGE_BATCH3_2026-09-21.md with exact locators for 13 edges, frontier handling, gate outputs verbatim, before/after warnings 2→0 or documented intentional

Banned: git show <sha> without --name-only/--stat, git log -p on bundle. Safe: --name-only, --stat, --oneline, ls -lh, cat, jq.

Out of scope: Pages deployment/creation, corpus ingestion, English translations 049, rights P4, translation P5, CBETA inventory P6.

Verification: validate corpus44 locators4192 collated10 flagged630 lineage 31 edges 31 verified pending 0 (10 exact+21 source or 31 exact if possible), build 44 docs 8.75M deterministic, preservation 0 unauthorized, review 145+, smoke 44, mirror diff, exact locators for 13 edges verified, frontier masters handled with explicit evidence, warnings 2→0 or documented intentional.

Branch: fix/p3-lineage-batch3, orchestrator arena/01a09829-translatechan
