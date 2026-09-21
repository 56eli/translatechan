# Task 051 — P3 Lineage Exact Locators Batch 1 — 10 edges + 1 unlinked master

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git log --oneline origin/main -5
   Verify main is ddce5c3 (44 docs after enthusiast 100% closer, 10 collated, 4,192 locators, 553k+302k content CJK, 8.7M bundle, P0+P1+P2 done, P1-3 Caoshan, P2 Baizhang+Huangbo+Dazhu+Nanquan, enthusiast 100% 6 full-witness records)

1. TASK TITLE AND SCOPE
   P3 Lineage Exact Locators Batch 1 — 10 edges + 1 unlinked master — Lineage is second core objective, 35 masters is scaffold, not graph. Current: 31 edges traditional_link_pending_exact_locator, 29 masters needs_exact_locator, 3 unlinked prajnatara/yangqi_fanghui/dahong_zuzheng + longtan_chongxin frontier. Why P3: lineage is second core objective, 35 masters scaffold not graph, unblocks graph. Steps: for each edge in data/lineage/lineage_verification.json find exact T51n2076 or X80n1565 or T51n2076 full (chuandenglu_full) page/line via CBETA refs, for unlinked masters either link to existing corpus key or mark frontier with explicit profile_evidence, update masters.json linked_corpus_keys, lineage_verification.json with exact locators. Verification: validate_data.py warnings for empty linked_corpus_keys should go from 3 to 0, edges pending → exact. Estimate 4-6h.

2. REQUIRED READING ORDER
   - .orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md — Lineage 34 masters 12 school_key groups 30 edges + 4 frontiers all 30 edges traditional_link_pending_exact_locator 29 masters needs_exact_locator 3 unlinked frontier scaffolds prajnatara yangqi_fanghui dahong_zuzheng (31/34 linked)
   - .orchestrator/NEXT_TASKS_2026-09-19.md P3 — Current 30 edges traditional_link_pending_exact_locator 29 masters needs_exact_locator 3 unlinked prajnatara yangqi_fanghui dahong_zuzheng, Why P3 lineage second core objective, Steps for each edge find exact T51n2076 or X80n1565 page/line via CBETA refs, for unlinked masters either link to existing corpus key or mark frontier with explicit profile_evidence, update masters.json linked_corpus_keys lineage_verification.json with exact locators, Verification warnings empty linked_corpus_keys 3→0 edges pending→exact Estimate 4-6h
   - data/lineage/masters.json — 35 masters, profile_status Seed profile pending exact locator, linked_corpus_keys, alternative_names, lineage_depth, teacher, disciples
   - data/lineage/lineage_verification.json — 31 edges, each teacher disciple status traditional_link_pending_exact_locator source_id jingde-chuandenglu reference Candidate source context T2076 Vol 51 p.220b note Traditional lineage relation awaits editorial verification
   - data/corpus/chuandenglu_full.json — 30 fascicles 1,274 units 971 biographies 2,549/2,549 EXACT 0 flagged — lineage backbone source for 30 pending edge locators, now full, enables exact locators
   - data/corpus/chuandenglu.json — sample 6 fields 4/6 collating, 2 sample records
   - data/corpus/congronglu.json + biyanlu_cases.json + wumenguan.json — gongan collections with case locators
   - sessions/P1_CHUANDENGLU_FULL_2026-09-20.md — full ingestion pattern, deterministic producer, 100% EXACT, locators lb-anchored
   - scripts/collate_refs.py + collate_corpus.py — pinned CBETA revision dbdea410, 41 refs verified after Caoshan, now 44 docs after enthusiast, need T51n2076 inventory for exact locators
   - .orchestrator/WITNESS_INVENTORY*.md — per-doc carrier measurement pattern

3. PROJECT CONTEXT
   TranslateChan 44 docs after enthusiast 100% closer (was 35 docs 0 complete 31 excerpt_seed 4 partial, now 44 docs including congronglu 100 cases + chuandenglu_full 1,274 units + caoshan_benji 84 units + 6 full-witness records Huangbo 19 Mazu 35 Yunmen 776 Dongshan 322 Zhaozhou 80 Dahui 30 juan + huku 1,354 — 2,586 units 302,592 CJK, 5,178/5,178 EXACT 0 flagged, collation 2,451/2,782 → 5,037/5,368 93.8%, locators 148→4,192, 630 flagged authoritative stays, 0 unauthorized 373 permitted + 9 new docs, 145 checks, bundle 8.7M deterministic). Headline "The old texts are real; the translators are not." Objectives at full strength not renegotiated. Pages out of scope per 2026-09-19. Evidence model: authoritative 2026-09-21 register 44 docs? Actually 38→44 docs, 630 authoritative preserved. Lineage is second core objective, 35 masters scaffold not graph, 31 edges pending exact locator, 3 unlinked frontier — need exact locators now enabled by Chuandeng Lu full 1,274 units.

4. CONFIRMED FACTS
   - Lineage: 35 masters, 31 edges, 30 edges traditional_link_pending_exact_locator, 29 masters needs_exact_locator, 3 unlinked prajnatara/yangqi_fanghui/dahong_zuzheng + longtan_chongxin frontier, 31/34 linked before Caoshan, now 35 masters with caoshan_benji depth 12 teacher dongshan_liangjie linked_corpus_keys [caoshan_benji]
   - Chuandeng Lu full T51n2076 30 fascicles ~1,701 persons listed 951 with records ~750 listed-only, census 971 recorded units, 1,274 units tiling 350,269 CJK verbatim, 2,549/2,549 EXACT 0 flagged, locators lb-anchored, enables exact locators for 30 pending edge locators
   - CBETA pin dbdea41071e1e260ad84b72faefd4587333cf76d, extraction rule cbeta-p5-body-cjk-v1, 41 refs verified after Caoshan, 44 docs after enthusiast
   - Preservation base 3cc7a8e9681e, 0 unauthorized for existing 44 must hold
   - Bundle 8.7M deterministic byte-identical

5. CORE OBJECTIVE
   Provide exact locators for 10 lineage edges + 1 unlinked master in batch 1: for each edge in lineage_verification.json find exact T51n2076 or X80n1565 or chuandenglu_full page/line via CBETA refs (use /tmp/refs/ref_T51n2076.txt and chuandenglu_full.json sections), update lineage_verification.json with exact locators (source_id, reference with page/line, status exact_locator_verified), for unlinked master either link to existing corpus key (Yangqi Fanghui → need Yangqi yulu ingestion? Or mark frontier with explicit profile_evidence), update masters.json linked_corpus_keys and profile_evidence, gates green.

6. EXACT DELIVERABLES
   - `data/lineage/lineage_verification.json` updated — 10 edges from traditional_link_pending_exact_locator → exact_locator_verified with exact T51n2076 or X80n1565 or chuandenglu_full page/line reference (e.g., T51n2076 Vol 51 p.0220b line, or chuandenglu_full fascicle 1 biography 1 lb-anchored)
   - `data/lineage/masters.json` updated — at least 1 unlinked master linked or marked frontier with explicit profile_evidence, linked_corpus_keys updated if applicable, profile_status updated if exact locator found
   - `data/corpus_manifest.json` and `data/project_metrics.json` regenerated via validate_data.py + build_data_bundle.py — 44 docs still, metrics updated
   - `app_data.js` and `docs/app_data.js` regenerated deterministic, byte-identical if only lineage changed (bundle same size as no corpus change, only lineage)
   - Report `sessions/P3_LINEAGE_BATCH1_2026-09-21.md` with:
     - CBETA extraction and digest verification for T51n2076 (40→41 refs)
     - For each of 10 edges: teacher → disciple, old status, new status, exact locator found (page/line, method), verification
     - For 1 unlinked master: old status, new status, linked_corpus_keys or frontier explicit profile_evidence
     - Gate outputs verbatim (py_compile, validate_data corpus44 locators4192 collated10 flagged630, build_data_bundle 44 docs 8.7M deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 44 texts)
     - Before/after warnings for empty linked_corpus_keys (3→2 or 0)
     - Statement no corpus edits, only lineage

7. SUB-TASK BREAKDOWN
   1. Inventory lineage_verification.json 31 edges, pick first 10 edges (bodhidharma→huike, huike→sengcan, sengcan→daoxin, daoxin→hongren, hongren→huineng, huineng→nanyue_huairang, huineng→qingyuan_xingsi, nanyue_huairang→mazu_daoyi, qingyuan_xingsi→shitou_xiqian, mazu_daoyi→baizhang_huaihai) — or any 10 — find exact locators via /tmp/refs/ref_T51n2076.txt and chuandenglu_full.json sections (fascicle/biography lb-anchored)
   2. For unlinked master pick one: prajnatara (Bodhidharma's teacher, Indian, frontier), yangqi_fanghui (Yangqi branch founder), dahong_zuzheng, or longtan_chongxin — either link to existing corpus key if possible or mark frontier with explicit profile_evidence note
   3. Update lineage_verification.json with exact locators: status exact_locator_verified, reference with page/line, source_id, note
   4. Update masters.json with linked_corpus_keys and profile_evidence for unlinked master
   5. Run validate_data.py, build_data_bundle.py, test_source_preservation.py, test_source_review_rules.py, smoke_test.mjs, mirror diff — quote verbatim
   6. Create sessions/P3_LINEAGE_BATCH1_2026-09-21.md
   7. Commit + push, PR description includes exact locators for 10 edges verbatim, unlinked master handling, gate outputs verbatim, BANNED COMMANDS followed

8. BRANCH AND TARGET
   Base: main ddce5c3 (44 docs after enthusiast 100% closer, 10 collated, 4,192 locators, 630 flagged, P0+P1+P2 done, enthusiast 100% closer done)
   Target: fix/p3-lineage-batch1
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed, git log -p on bundle. SAFE: --name-only, --stat, --oneline, ls -lh, cat, jq.
   Pages scope: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for. No Pages work.

10. TECHNICAL REQUIREMENTS
    - No edits to data/corpus/*.json manually — only lineage files + generated metrics/bundle
    - No new runtime deps, no secrets, no style= (must stay 0), no new setProperty (census stays 4)
    - CBETA pin dbdea410, 41 refs verified
    - Preservation: lineage files allowlisted as permitted changes, 0 unauthorized for existing 44 must hold
    - Keep COMMON_QUALITIES, RULING_WEBSITE out-of-scope notice
    - Keep corpus integrity: 0 unauthorized, 44 docs, honest notes
    - Use chuandenglu_full.json 1,274 units as source for exact locators — lb-anchored page/line

11. SAFETY
    - No workflow edit (quality.yml retired text-integrity only, do not edit)
    - 630 authoritative stays authoritative, no re-designation
    - No claiming website beautiful/done — Pages out of scope
    - Do not invent locators — must be verifiable via T51n2076 or chuandenglu_full lb anchors

12. CLEANUP
    Clean worktree, no committed refs, no __pycache__, no /tmp/refs committed

13. OUT OF SCOPE
    - No Pages deployment/creation, no 36-layout work
    - No corpus ingestion — that's P1 done, P2 done, enthusiast 100% done
    - No English translations — that's task 049 roadmap draft
    - No rights review — P4
    - No translation verified slots — P5
    - No full CBETA inventory — P6

14. QUALITY CHECKS
    py_compile PASS, validate PASS corpus44 locators4192 collated10 flagged630, build PASS 44 docs 8.7M deterministic byte-identical docs mirror identical, preservation PASS 0 unauthorized, review PASS 145+, smoke PASS 44 texts, mirror diff PASS, exact locators for 10 edges verified via T51n2076 or chuandenglu_full, unlinked master handled, warnings empty linked_corpus_keys 3→2, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired

15. PR DESCRIPTION
    Summary P3 lineage exact locators batch 1 — 10 edges + 1 unlinked master — exact T51n2076 or chuandenglu_full page/line locators, gate outputs verbatim, before/after warnings, BANNED COMMANDS followed, Pages scope respected.

16. HARDENING REPORT
    Record CBETA pin, extraction verification, exact locators for 10 edges, unlinked master handling, branch mismatch if any, BANNED COMMANDS followed, gate outputs.

