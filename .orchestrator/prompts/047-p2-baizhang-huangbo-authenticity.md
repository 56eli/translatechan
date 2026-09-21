# Task 047 — P2 Core Yulu Authenticity Labels — Baizhang Guanglu + Huangbo Wanling

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git log --oneline origin/main -5
   Verify main is 83f1cbd (Caoshan Benji landed 38 docs, corpus=38 locators=1606/1606 collated=4 flagged=630 evidence=2026-09-20 bundle 4,851,526 B, P0+P1 done)

1. TASK TITLE AND SCOPE
   P2 Core Yulu Authenticity — Baizhang Guanglu + Huangbo Wanling — 0/6 and 0/7 collating as project compositions, only carrier uncited X80n1565 Wudeng Huiyuan or no carrier. Requirement: coverage + attribution labels per WITNESS_INVENTORY pattern, no re-key if no carrier, honest coverage_note, cbeta_note, gates green.

2. REQUIRED READING ORDER
   - .orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md — P2 core yulu authenticity 0/6 collating as project compositions
   - .orchestrator/NEXT_TASKS_2026-09-19.md P2 — Priority order by reading frequency, Baizhang Guanglu + Huangbo Wanling authenticity labels (P2) 2 docs coverage + attribution labels per WITNESS_INVENTORY pattern no re-key if no carrier
   - .orchestrator/WITNESS_INVENTORY.md + WITNESS_INVENTORY_T48_T51.md + WITNESS_INVENTORY_XSERIES.md — per-doc carrier measurement pattern, authenticity labels, coverage_note pattern
   - data/corpus/baizhang_guanglu.json — current 3/3 sections 6 fields 0/6 collating, cbeta_id X1323 / X1315, coverage_note verbatim: 0 of 6 verbatim in either claimed witness (0 of 44, 0 of 38, 0 of 34, 0 of 27, 0 of 41, 0 of 40 runs), only carrier uncited X80n1565 4/6 fields 16-28 graph fragments s1.d0 24/34 @60,222 s1.d1 16/27 @60,252 s2.d0 18/41 @60,428 + @60,441 s2.d1 28/40 @60,465 + @60,485
   - data/corpus/huangbo_wanling.json — 0/7 in claimed T48n2012B and 0/7 in all 39 refs, 裴休/壁上畫像 and 噇酒糟漢 material retold not quoted, record names 宛陵錄 as witness but only one unit carries note, no coverage_note stating nothing verbatim
   - data/corpus/biyanlu_cases.json + congronglu.json + chuandenglu_full.json + caoshan_benji.json — pattern for honest coverage_note, cbeta_note, no generated placeholders
   - scripts/collate_corpus.py — collation measurement, 0/6 and 0/7 expected
   - vision.md §1.1 — Exhaustive Canonical Ingestion not met, 0 complete, 31 excerpt seeds, etc

3. PROJECT CONTEXT
   TranslateChan 38 docs after P1 (35→38), 1252 slots verified 177 matrix 21, locators 148→1606, 630 flagged authoritative stays, 0 unauthorized 373 permitted + 3 new docs, 145 checks, bundle 4,851,526 B deterministic. Headline "The old texts are real; the translators are not." Objectives at full strength not renegotiated. Pages out of scope per 2026-09-19. Evidence model: authoritative 2026-09-20 register 38 docs (CAOSHAN_BENJI), 630 authoritative, 486 fresh measurement. P2 core yulu are excerpt_seed with 0/6 collating — they are project compositions retelling not quoting, need honest authenticity labels per WITNESS_INVENTORY pattern, not re-key if no carrier.

4. CONFIRMED FACTS
   - Baizhang Guanglu X1323 / X1315 0/6 collating, no field verbatim in claimed witnesses, only carrier uncited X80n1565 4/6 fields 16-28 graph fragments
   - Huangbo Wanling T2012B 0/7 in claimed and 0/7 in all 39 refs, retold not quoted, 宛陵錄 witness but only one unit note, no coverage_note stating nothing verbatim
   - WITNESS_INVENTORY pattern: per-doc carrier measurement, coverage_note must state honest collation numbers, cbeta_note must state ID-corrected and carrier status, no re-key if no carrier, attribution label (e.g., "project composition retelling uncited X80n1565" or "retold not quoted")
   - Preservation base 3cc7a8e9681e, 0 unauthorized for existing 38 must hold
   - Bundle 4,851,526 B deterministic byte-identical

5. CORE OBJECTIVE
   Add authenticity labels to Baizhang Guanglu and Huangbo Wanling per WITNESS_INVENTORY pattern: honest coverage_note with collation numbers (0/6, 0/7, carrier fragments), cbeta_note with ID status and carrier status, attribution label (project composition retelling, retold not quoted), no re-key if no carrier, gates green, no generated placeholders.

6. EXACT DELIVERABLES
   - `data/corpus/baizhang_guanglu.json` updated — coverage_note honest: 3/3 sections 6 fields 0/6 verbatim in claimed witnesses X69n1323 and X68n1315 (0 of 44, 0 of 38, 0 of 34, 0 of 27, 0 of 41, 0 of 40 runs), only carrier uncited X80n1565 Wudeng Huiyuan 4/6 fields 16-28 graph fragments with offsets, project composition retelling not verbatim, W1 status partial_or_failed, no re-key
   - `data/corpus/huangbo_wanling.json` updated — coverage_note honest: 0/7 in claimed T48n2012B and 0/7 in all 39 refs, 裴休/壁上畫像 and 噇酒糟漢 material retold not quoted, record names 宛陵錄 as witness but only one unit note, no verbatim carrier, W1 status partial_or_failed or witness_unavailable, no re-key
   - `data/corpus_manifest.json` and `data/project_metrics.json` regenerated via validate_data.py + build_data_bundle.py — 38 docs still, metrics updated
   - `app_data.js` and `docs/app_data.js` regenerated deterministic, byte-identical, same size or slightly bigger due to notes
   - Report `sessions/P2_BAIZHANG_HUANGBO_AUTHENTICITY_2026-09-20.md` with:
     - Current collation measurement verbatim: collate_corpus.py --doc baizhang_guanglu and --doc huangbo_wanling 0/6 and 0/7
     - WITNESS_INVENTORY carrier measurements
     - Gate outputs verbatim (py_compile, validate_data corpus38, build_data_bundle 38 docs, preservation 0 unauthorized, review 145+, smoke 38 texts)
     - Before/after coverage_note, cbeta_note, authenticity labels
     - Statement no re-key if no carrier per pattern

7. SUB-TASK BREAKDOWN
   1. Run collate_corpus.py --doc baizhang_guanglu --require-verified-refs and --doc huangbo_wanling, record 0/6 and 0/7 verbatim
   2. Check WITNESS_INVENTORY for carrier measurements, verify X80n1565 offsets for baizhang, no carrier for huangbo
   3. Update baizhang_guanglu.json coverage_note and cbeta_note with honest numbers and attribution label per pattern, no re-key
   4. Update huangbo_wanling.json coverage_note and cbeta_note with honest numbers and retold not quoted label, no re-key
   5. Run validate_data.py, build_data_bundle.py, test_source_preservation.py, test_source_review_rules.py, smoke_test.mjs, mirror diff — quote verbatim
   6. Create sessions/P2_BAIZHANG_HUANGBO_AUTHENTICITY_2026-09-20.md
   7. Commit + push, PR description includes collation verbatim 0/6 0/7, carrier measurements, gate outputs verbatim, authenticity labels, BANNED COMMANDS followed

8. BRANCH AND TARGET
   Base: main 83f1cbd (Caoshan Benji landed 38 docs, P0+P1 done)
   Target: fix/p2-baizhang-huangbo-authenticity
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed, git log -p on bundle, copying generated placeholders, re-keying when no carrier. SAFE: --name-only, --stat, --oneline, ls -lh, cat, jq.
   Pages scope: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for. No Pages work.

10. TECHNICAL REQUIREMENTS
    - No new docs, only 2 docs updated with honest notes, no re-key if no carrier
    - No new runtime deps, no secrets, no style= (must stay 0), no new setProperty (census stays 4)
    - CBETA pin dbdea410, 41 refs verified (40 + T47n1987A + probe T48n2006? Actually 41 after Caoshan, check)
    - Preservation: updated files allowlisted as permitted changes (coverage_note, cbeta_note), 0 unauthorized for existing 38 must hold
    - Keep COMMON_QUALITIES, RULING_WEBSITE out-of-scope notice
    - Keep corpus integrity: 0 unauthorized, 38 docs, honest notes

11. SAFETY
    - No workflow edit (quality.yml retired text-integrity only, do not edit)
    - 630 authoritative stays authoritative, no re-designation
    - No claiming website beautiful/done — Pages out of scope
    - Do not re-key if no carrier — per WITNESS_INVENTORY pattern, authenticity label only

12. CLEANUP
    Clean worktree, no committed refs, no __pycache__, no /tmp/refs committed

13. OUT OF SCOPE
    - No Pages deployment/creation, no 36-layout work
    - No Dazhu Huihai + Nanquan re-key — that's next agent P2-2
    - No lineage exact locators — P3
    - No rights review — P4
    - No translation verified slots — P5
    - No full Zhaozhou full dialogue record

14. QUALITY CHECKS
    py_compile PASS, validate PASS corpus38 slots... , build PASS deterministic byte-identical, preservation PASS 0 unauthorized, review PASS 145+, smoke PASS 38 texts, collate baizhang 0/6 and huangbo 0/7 verbatim, mirror diff PASS, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired, authenticity labels per pattern

15. PR DESCRIPTION
    Summary Baizhang Guanglu + Huangbo Wanling authenticity labels, collation 0/6 0/7 verbatim, carrier measurements X80n1565 4/6 fragments and no carrier retold, gate outputs verbatim, before/after notes, no re-key per pattern, BANNED COMMANDS followed, Pages scope respected.

16. HARDENING REPORT
    Record collation verbatim, carrier measurements, branch mismatch if any, BANNED COMMANDS followed, no re-key, gate outputs.

