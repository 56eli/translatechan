Task: P2 Baizhang Guanglu + Huangbo Wanling Authenticity Labels

Base: main 83f1cbd (Caoshan Benji landed 38 docs, corpus=38 locators=1606/1606 collated=4 flagged=630 evidence=2026-09-20 bundle 4,851,526 B, P0+P1 done)

Why P2: Core yulu authenticity 0/6 collating as project compositions, only carrier uncited X80n1565 or no carrier. Baizhang Guanglu X1323/X1315 0/6 collating no field verbatim in claimed witnesses (0 of 44, 0 of 38, 0 of 34, 0 of 27, 0 of 41, 0 of 40 runs), only carrier uncited X80n1565 4/6 fields 16-28 graph fragments s1.d0 24/34 @60,222 s1.d1 16/27 @60,252 s2.d0 18/41 @60,428 + @60,441 s2.d1 28/40 @60,465 + @60,485. Huangbo Wanling T2012B 0/7 in claimed and 0/7 in all 39 refs retold not quoted 宛陵錄 witness but only one unit note no coverage_note stating nothing verbatim.

Requirement: coverage + attribution labels per WITNESS_INVENTORY pattern, no re-key if no carrier, honest coverage_note cbeta_note, gates green.

Steps:
1. Run collate_corpus.py --doc baizhang_guanglu and --doc huangbo_wanling 0/6 0/7 verbatim
2. Check WITNESS_INVENTORY carrier measurements
3. Update baizhang_guanglu.json coverage_note honest 0/6 no verbatim in claimed witnesses only carrier uncited X80n1565 4/6 fragments offsets, project composition retelling not verbatim, no re-key
4. Update huangbo_wanling.json coverage_note honest 0/7 in claimed and all refs retold not quoted 宛陵錄 only one unit note no verbatim carrier, no re-key
5. Gates: py_compile, validate corpus38, build deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 38, mirror diff
6. Report sessions/P2_BAIZHANG_HUANGBO_AUTHENTICITY_2026-09-20.md with collation verbatim 0/6 0/7, carrier measurements, gate outputs verbatim, before/after notes, no re-key per pattern
7. Commit + push, PR description includes verbatim outputs and authenticity labels

Banned: git show <sha> without --name-only/--stat, git log -p on bundle, copying generated placeholders, re-keying when no carrier. Safe: --name-only, --stat, --oneline, ls -lh, cat, jq.

Out of scope: Pages deployment/creation, Dazhu + Nanquan re-key P2-2, lineage exact locators P3, rights P4, translation P5.

Verification: collate 0/6 0/7 verbatim, validate corpus38, build deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 38, mirror diff, authenticity labels per pattern, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired.

Branch: fix/p2-baizhang-huangbo-authenticity, orchestrator arena/01a09829-translatechan
