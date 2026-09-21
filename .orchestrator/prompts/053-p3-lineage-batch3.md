# Task 053 — P3 Lineage Exact Locators Batch 3 — remaining 13 edges (9 internal + 4 frontiers)

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git log --oneline origin/main -5
   Verify main is 6d36957 (44 docs after enthusiast 100% closer, 10 collated, 4,192 locators, 553k+302k content CJK, 8.75M bundle after batch1+2, P0+P1+P2 done, enthusiast 100% done, lineage 18 verified = 10 exact + 8 source, 13 pending, 33/35 linked 2 unlinked yangqi_fanghui reviewed + dahong_zuzheng)

1. TASK TITLE AND SCOPE
   P3 Lineage Exact Locators Batch 3 — remaining 13 edges (9 internal + 4 frontiers) — final batch of P3 to reach 0 pending or documented frontiers. Current after batch1+2: 31 edges total, 18 verified (10 exact_locator_verified with T51n2076_pXXXX lb ranges + verbatim, 8 source_verified with fascicle/page-line), 13 pending traditional_link_pending_exact_locator, 2 unlinked frontier (yangqi reviewed, dahong). Why P3 final: lineage is second core objective, 35 masters scaffold not graph, unblocks graph. Steps: for each of 9 internal edges find exact T51n2076 or X-series or chuandenglu_full page/line via CBETA refs (/tmp/refs/ref_T51n2076.txt and chuandenglu_full.json), for 4 frontier edges either verify if possible or mark frontier with explicit profile_evidence and keep linked_corpus_keys intentional empty, update masters.json linked_corpus_keys, lineage_verification.json with exact locators.

2. REQUIRED READING ORDER
   - .orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md §2 lineage — 102 masters snapshot NOT exhaustive, target 150-200, more material in circulation, open-ended disclaimer 2026-09-21
   - data/lineage/masters.json — 35 masters, after batch2 33 linked, 2 unlinked yangqi_fanghui (reviewed pending exact) + dahong_zuzheng, plus prajnatara linked via chuandenglu_full case38 but teacher link pending, longtan linked via wumenguan/deshan_yulu/biyanlu_cases but teacher link pending
   - data/lineage/lineage_verification.json — 31 edges, 18 verified, 13 pending: baizhang_huaihai->huangbo_xiyun (T2012A), huangbo_xiyun->linji_yixuan (T1985), mazu_daoyi->nanquan_puyuan (X1315/T2076 f.8), shitou_xiqian->yaoshan_weiyan (T2076 f.14/X1565), yaoshan_weiyan->yunyan_tansheng (T2076 f.14/X1565), deshan_xuanjian->xuefeng_yicun (X1333/T2076 f.16), xuefeng_yicun->xuansha_shibei (X1445/T2076 f.18), xuansha_shibei->luohan_guichen (T2076 f.21/X1565), baiyun_shouduan->wuzu_fayan (T1995/X1565 f.19), plus 4 frontiers prajnatara->bodhidharma, longtan_chongxin->deshan_xuanjian, yangqi_fanghui->baiyun_shouduan, dahong_zuzheng->yuelin_shiguan
   - data/corpus/chuandenglu_full.json — 30 fascicles 1,274 units 2,549 EXACT enables exact locators
   - sessions/P3_LINEAGE_BATCH1_2026-09-21.md + sessions/P3_LINEAGE_BATCH2_2026-09-21_REBASED.md — patterns from batch1 (exact lb anchors) and batch2 (source_verified fascicle anchors)
   - scripts/collate_refs.py + collate_corpus.py — pinned CBETA revision dbdea41071e1e260ad84b72faefd4587333cf76d, 40→41 refs verified after Caoshan, 44 docs after enthusiast
   - .orchestrator/WITNESS_INVENTORY*.md — per-doc carrier measurement pattern
   - .orchestrator/BOOKSTACK_WIKI_VISION_2026-09-21.md — Oracle VPS 2 OCPU 12GB RAM Ubuntu 24.04 domain nonduality.duckdns.org, BookStack structure

3. PROJECT CONTEXT
   TranslateChan 44 docs after enthusiast 100% closer (38→44 docs including congronglu 100 cases + chuandenglu_full 1,274 units + caoshan_benji 84 units + 6 full-witness Huangbo 19 Mazu 35 Yunmen 776 Dongshan 322 Zhaozhou 80 Dahui 1,354 = 2,586 units 302,592 CJK, 5,178 EXACT 93.8% collation 5,037/5,368, locators 148→4,192, 630 flagged authoritative stays, 0 unauthorized, 145 checks, bundle 8.75M deterministic after batch1+2). Headline "The old texts are real; the translators are not." Objectives at full strength not renegotiated. Pages out of scope per 2026-09-19. Evidence model: authoritative 2026-09-21 register 44 docs 630 authoritative preserved. Lineage is second core objective, 35 masters scaffold not graph, 31 edges, now 18 verified, 13 pending, 2 unlinked frontier — need exact locators for remaining 9 internal + 4 frontier handling to reach 0 pending or documented frontier.

4. CONFIRMED FACTS
   - Lineage: 35 masters, 31 edges, after batch1+2 10 exact 8 source =18 verified 13 pending, 33/35 linked, 2 unlinked yangqi_fanghui (reviewed) + dahong_zuzheng, prajnatara linked via chuandenglu_full case38 but teacher link pending, longtan linked via wumenguan etc but teacher link pending
   - Chuandeng Lu full T51n2076 30 fascicles 971 biographies 1,274 units 350,269 CJK verbatim 2,549/2,549 EXACT 0 flagged lb-anchored enables exact locators
   - CBETA pin dbdea410, 40-41 refs verified, 44 docs
   - Preservation base 3cc7a8e9681e, 0 unauthorized for existing 44 must hold
   - Bundle 8.75M deterministic byte-identical after lineage changes (lineage changes bundle size slightly)
   - P2 core yulu: Baizhang+Huangbo authenticity labels landed (047), Dazhu+Nanquan re-key attempt failed 0/6 (048) <80% NOT landed labels+coverage_notes only

5. CORE OBJECTIVE
   Provide exact locators for remaining 13 edges (9 internal + 4 frontiers) in batch3: for each internal edge find exact T51n2076 or X-series or chuandenglu_full page/line via CBETA refs, update lineage_verification.json with exact locators status exact_locator_verified (if lb range + verbatim available) or source_verified (if fascicle/page-line only), for frontier edges either verify if witness exists or mark frontier with explicit profile_evidence note explaining no biographical witness, keep linked_corpus_keys intentional empty, update masters.json profile_status and profile_evidence, gates green.

6. EXACT DELIVERABLES
   - `data/lineage/lineage_verification.json` updated — remaining 13 edges from traditional_link_pending_exact_locator → exact_locator_verified or source_verified with exact reference (T51n2076_pXXXX or fascicle/page-line or X-series), status upgrade, reference, source_id, note with verbatim if exact
   - `data/lineage/masters.json` updated — frontier masters handled: prajnatara teacher link, longtan, yangqi, dahong — either linked or marked frontier with explicit profile_evidence status frontier_profile_reviewed_pending_exact_locator or frontier_profile_unverified with note, linked_corpus_keys intentional empty if no witness, profile_status updated
   - `data/lineage/profile_review_queue.json` if exists updated with review statuses
   - `data/project_metrics.json` regenerated via validate_data.py --write-metrics
   - `app_data.js` and `docs/app_data.js` regenerated deterministic, byte-identical between root and docs
   - Report `sessions/P3_LINEAGE_BATCH3_2026-09-21.md` with: CBETA extraction digest verification, for each of 13 edges old status new status exact locator found method verification, for 4 frontiers old status new status linked_corpus_keys or frontier explicit evidence, gate outputs verbatim (py_compile, validate_data corpus44 locators4192 collated10 flagged630, build_data_bundle 44 docs 8.75M deterministic, preservation 0 unauthorized, review 145+, smoke 44 texts), before/after warnings for empty linked_corpus_keys (2→0 or documented intentional), statement no corpus edits only lineage

7. SUB-TASK BREAKDOWN
   1. Inventory lineage_verification.json remaining 13 edges, list each with current reference
   2. For 9 internal edges: baizhang→huangbo (T2012A Vol48 p379?), huangbo→linji (T1985 Vol47 p496?), mazu→nanquan (X1315/T2076 f8), shitou→yaoshan (T2076 f14/X1565), yaoshan→yunyan (T2076 f14/X1565), deshan→xuefeng (X1333/T2076 f16), xuefeng→xuansha (X1445/T2076 f18), xuansha→luohan (T2076 f21/X1565), baiyun→wuzu (T1995/X1565 f19) — find exact locators via /tmp/refs/ref_T51n2076.txt (extract via collate_refs.py) and chuandenglu_full.json fascicle/biography lb-anchored, also check X-series witnesses X68n1315, X80n1565 etc if needed
   3. For 4 frontier edges: prajnatara→bodhidharma (Indian patriarch, no Chinese biography, frontier), longtan→deshan (Longtan Chongxin), yangqi→baiyun (Yangqi Fanghui already reviewed no witness), dahong→yuelin (Dahong Zuzheng) — search active corpus for any biographical witness, if none mark frontier with explicit profile_evidence note explaining search method and why no linked_corpus_keys
   4. Update lineage_verification.json with exact locators: status exact_locator_verified if lb range + verbatim text available (T51n2076_pXXXX–pYYYY + Verbatim text), else source_verified with fascicle/page-line reference, source_id jingde-chuandenglu or appropriate X-series id, note with method
   5. Update masters.json with linked_corpus_keys and profile_evidence for frontier masters, ensure dahong_zuzheng and yangqi_fanghui have frontier reviews
   6. Run validate_data.py --write-metrics, validate_data.py, build_data_bundle.py twice for determinism, test_source_preservation.py (if exists), test_source_review_rules.py, smoke_test.mjs, diff -rq data docs/data — quote verbatim
   7. Create sessions/P3_LINEAGE_BATCH3_2026-09-21.md
   8. Commit + push, PR description includes exact locators for 13 edges verbatim, frontier handling, gate outputs verbatim, BANNED COMMANDS followed

8. BRANCH AND TARGET
   Base: main 6d36957 (44 docs after enthusiast + lineage batch1+2, 18 verified 13 pending, 33/35 linked)
   Target: fix/p3-lineage-batch3
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed, git log -p on bundle. SAFE: --name-only, --stat, --oneline, ls -lh, cat, jq.
   Pages scope: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for. No Pages work.

10. TECHNICAL REQUIREMENTS
    - No edits to data/corpus/*.json manually — only lineage files + generated metrics/bundle + sessions report
    - No new runtime deps, no secrets, no style= (must stay 0), no new setProperty (census stays 4)
    - CBETA pin dbdea41071e1e260ad84b72faefd4587333cf76d, extraction rule cbeta-p5-body-cjk-v1, 40-41 refs verified
    - Preservation: lineage files allowlisted as permitted, 0 unauthorized for existing 44 must hold
    - Keep COMMON_QUALITIES_2026-09-14 light mental load minimum info expand/hover/toggle English first not dense, info section for every work and teacher where from / related / background
    - Use chuandenglu_full.json 1,274 units as source for exact locators, plus T51n2076 XML via /tmp/refs/ref_T51n2076.txt if available, plus X-series witnesses if needed
    - Status vocabulary: exact_locator_verified requires T51n2076_pXXXX–pYYYY ordered lb range + source_id jingde-chuandenglu + Verbatim text in note; source_verified allows fascicle/page-line reference; traditional_link_pending_exact_locator is pending

11. SAFETY
    - No workflow edit (quality.yml retired text-integrity only, do not edit)
    - 630 authoritative stays authoritative, no re-designation
    - No claiming website beautiful/done — Pages out of scope
    - Do not invent locators — must be verifiable against pinned CBETA witness or chuandenglu_full.json
    - Open-ended scope: ROADMAP_ALL_ENCOMPASSING 102 masters snapshot NOT exhaustive, target 150-200, more material in circulation — do not assume closure

12. CLEANUP
    Clean worktree, no committed refs, no __pycache__, no /tmp/refs committed, no large artifacts

13. OUT OF SCOPE
    - No Pages deployment/creation, no 36-layout work
    - No corpus ingestion — P1 done, P2 done, enthusiast 100% done
    - No English translations — task 049 roadmap draft
    - No rights review — P4
    - No translation verified slots — P5
    - No full CBETA inventory — P6

14. QUALITY CHECKS
    py_compile PASS, validate PASS corpus44 locators4192 collated10 flagged630 lineage 31 edges 31 verified (10 exact+21 source or 31 exact if possible) pending 0, build PASS 44 docs 8.75M deterministic byte-identical root/docs, preservation PASS 0 unauthorized, review PASS 145+, smoke PASS 44 texts, mirror diff PASS, exact locators for 13 edges verified, frontier masters handled with explicit evidence, warnings 2→0 or documented intentional, no law verbatim, RULING_WEBSITE out-of-scope

15. PR DESCRIPTION
    Summary P3 lineage exact locators batch3 — remaining 13 edges (9 internal + 4 frontiers) — exact T51n2076 lb anchors + verbatim or fascicle/page-line locators, frontier handling, gate outputs verbatim, before/after warnings, BANNED COMMANDS followed, Pages scope respected, open-ended roadmap disclaimer noted.

16. HARDENING REPORT
    Record CBETA pin, extraction verification, exact locators for 13 edges, frontier handling, branch mismatch, BANNED COMMANDS, gate outputs.
