# Task 055 — P3 Lineage Frontier Finalization — 4 frontiers + X1565 lb anchors

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git log --oneline origin/main -5
   Verify main is e2ee031 (44 docs after enthusiast + batch1+2+3, 10 collated, 4,192 locators, 8,763,968 B bundle, lineage 27 verified =18 exact+9 source, 4 frontier pending traditional_link_pending_exact_locator: prajnatara->bodhidharma, longtan_chongxin->deshan_xuanjian, yangqi_fanghui->baiyun_shouduan, dahong_zuzheng->yuelin_shiguan, masters 35 linked 33 unlinked 2 yangqi reviewed + dahong, P2 Dazhu/Nanquan enhanced labels)

1. TASK TITLE AND SCOPE
   P3 Lineage Frontier Finalization — 4 frontiers + X1565 lb anchors — final 0 pending or fully documented frontier. Current after batch3: 31 edges total 27 verified (18 exact T51n2076_pXXXX lb range + verbatim, 9 source fascicle/page-line or X1565), 4 pending frontiers. Why: lineage second core objective, need 0 pending or explicit frontier documentation to unblock graph, enable BookStack wiki lineage trees. Steps: extract Wudeng Huiyuan X80n1565 (X1565) via CBETA XML P5 dbdea410, find exact lb anchors for Baiyun Shouduan->Wuzu Fayan (Song masters beyond T2076), Longtan Chongxin->Deshan Xuanjian, Dahong Zuzheng->Yuelin Shiguan, Prajnatara->Bodhidharma Indian tradition. For each frontier either verify with X1565 or T2076 or mark frontier with explicit profile_evidence explaining search method, no biographical witness, keep linked_corpus_keys [] intentional, update masters.json and lineage_verification.json.

2. REQUIRED READING ORDER
   - .orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md §2 lineage — 102 masters snapshot NOT exhaustive target 150-200 open-ended disclaimer 2026-09-21
   - data/lineage/masters.json — 35 masters, 33 linked, 2 unlinked yangqi_fanghui reviewed + dahong_zuzheng, prajnatara linked via chuandenglu_full case38 T51n2076_p0216a19–p0216b20, longtan linked via wumenguan/deshan_yulu/biyanlu_cases
   - data/lineage/lineage_verification.json — 31 edges 18 exact 9 source 4 pending frontier: prajnatara->bodhidharma (Indian), longtan->deshan, yangqi->baiyun, dahong->yuelin
   - data/corpus/chuandenglu_full.json — 30 fascicles 1,274 units T51n2076 2,549 EXACT — ends 1004, no Song masters beyond
   - sessions/P3_LINEAGE_BATCH3_2026-09-21.md — pattern batch3 8 exact +1 source +4 frontier documented
   - scripts/collate_refs.py — extraction rule cbeta-p5-body-cjk-v1, need X1565 extraction for Song masters
   - .orchestrator/BOOKSTACK_WIKI_VISION_2026-09-21.md — Oracle VPS 2 OCPU 12GB RAM Ubuntu 24.04 domain nonduality.duckdns.org

3. PROJECT CONTEXT
   TranslateChan 44 docs after enthusiast 100% closer + lineage batch1+2+3 + P2 retry enhanced labels, 1252 slots verified177 matrix21 locators4192 collated10 flagged630 evidence2026-09-21 enthusiast overlay, bundle 8.76M deterministic. Headline "The old texts are real; the translators are not." Pages out of scope per 2026-09-19. Lineage second core objective, 35 masters scaffold not graph, now 27 verified 4 frontier pending, 2 unlinked intentional — need 0 pending or fully documented frontier to reach 31 verified or 27 verified +4 documented frontier.

4. CONFIRMED FACTS
   - Lineage: 35 masters, 31 edges, 18 exact 9 source 4 frontier pending after batch3
   - Chuandeng Lu full T51n2076 30 fascicles 971 biographies 1,274 units 350,269 CJK verbatim 2,549 EXACT lb-anchored, ends 1004, no Song masters Baiyun Shouduan 1025-1072 Wuzu Fayan 1024-1104 Dahong Zuzheng Yuelin Shiguan etc — need X1565 Wudeng Huiyuan for Song
   - CBETA pin dbdea410, 40-41 refs verified, 44 docs
   - Preservation base 3cc7a8e9681e, 0 unauthorized must hold
   - Prajnatara Indian patriarch linked via chuandenglu_full case38 but teacher link prajnatara->bodhidharma frontier no Chinese witness
   - Longtan Chongxin linked via wumenguan/deshan_yulu/biyanlu_cases but teacher link longtan->deshan frontier
   - Yangqi Fanghui reviewed batch2 no biographical witness 方會 hits grammatical, [] intentional
   - Dahong Zuzheng no witness [] intentional

5. CORE OBJECTIVE
   Finalize 4 frontier edges: extract X80n1565 Wudeng Huiyuan via CBETA XML P5 dbdea410, find exact lb anchors for Baiyun->Wuzu, Longtan->Deshan, Dahong->Yuelin if possible, else mark frontier with explicit profile_evidence note explaining search method and why no linked_corpus_keys, update lineage_verification.json status exact_locator_verified if lb range+verbatim found else source_verified with X1565 fascicle/page-line else keep traditional_link_pending_exact_locator with enhanced note, update masters.json profile_status and profile_evidence for yangqi/dahong/prajnatara/longtan, gates green.

6. EXACT DELIVERABLES
   - `data/lineage/lineage_verification.json` updated — 4 frontier edges either exact_locator_verified with T51n2076_pXXXX or X80n1565_pXXXX lb range + verbatim, or source_verified with X1565 fascicle/page-line, or traditional_link_pending_exact_locator with enhanced frontier note documenting search and intentional empty linked_corpus_keys
   - `data/lineage/masters.json` updated — frontier masters handled with explicit profile_evidence status frontier_profile_reviewed_pending_exact_locator or frontier_profile_unverified with note, linked_corpus_keys intentional empty if no witness, profile_status updated
   - `data/project_metrics.json` regenerated
   - `app_data.js` and `docs/app_data.js` regenerated deterministic byte-identical root/docs twice
   - Report `sessions/P3_LINEAGE_FRONTIER_FINAL_2026-09-21.md` with X1565 extraction digest verification, for each of 4 frontiers old status new status exact locator or frontier documentation, gate outputs verbatim, before/after warnings 2→0 or documented intentional, statement no corpus edits only lineage

7. SUB-TASK BREAKDOWN
   1. Clone CBETA XML P5: git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5, sparse-checkout X/X80/X80n1565.xml, checkout, extract via collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs --work-list X80n1565 --write-digest-manifest /tmp/refs/manifest.txt
   2. Search X1565 ref for Baiyun Shouduan, Wuzu Fayan, Longtan Chongxin, Dahong Zuzheng, Yuelin Shiguan, Prajnatara — find fascicle/page-line and lb anchors if possible, also search chuandenglu_full for Longtan and Dahong
   3. For each frontier: if witness found in X1565, update lineage_verification.json with exact_locator_verified (if lb range+verbatim) or source_verified (fascicle/page-line), source_id wudeng-huiyuan or jingde-chuandenglu, note with verbatim
   4. If no witness: mark frontier with explicit profile_evidence note explaining search method (searched chuandenglu_full 1,274 units, X1565 1.3M CJK, active corpus 44 docs, no biographical witness), keep linked_corpus_keys [] intentional, profile_status frontier_profile_reviewed_pending_exact_locator
   5. Update masters.json
   6. Run validate_data.py --write-metrics, validate_data.py, build_data_bundle.py twice, preservation, review, smoke, mirror diff — quote verbatim
   7. Create report
   8. Commit + push, PR description includes exact locators or frontier documentation verbatim, gate outputs, BANNED COMMANDS followed

8. BRANCH AND TARGET
   Base: main e2ee031 (44 docs + lineage 27 verified 4 frontier)
   Target: fix/p3-lineage-frontier-final
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed, git log -p on bundle. SAFE: --name-only, --stat, --oneline, ls -lh, cat, jq.
   Pages scope: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for.

10. TECHNICAL REQUIREMENTS
    - No edits to data/corpus/*.json manually — only lineage files + generated metrics/bundle + sessions report
    - No new runtime deps, no secrets, no style= (must stay 0), no new setProperty (census stays 4)
    - CBETA pin dbdea410, extraction rule cbeta-p5-body-cjk-v1
    - Preservation: lineage files allowlisted as permitted, 0 unauthorized for existing 44 must hold
    - Status vocabulary: exact_locator_verified requires T51n2076_pXXXX–pYYYY or X80n1565_pXXXX–pYYYY ordered lb range + source_id + Verbatim text in note; source_verified allows fascicle/page-line; traditional_link_pending_exact_locator is pending frontier
    - Open-ended scope: 102 masters snapshot NOT exhaustive target 150-200 more material in circulation

11. SAFETY
    - No workflow edit
    - 630 authoritative stays authoritative
    - No claiming website beautiful/done — Pages out of scope
    - Do not invent locators — must be verifiable

12. CLEANUP
    Clean worktree, no committed refs, no __pycache__, no /tmp/refs committed

13. OUT OF SCOPE
    - No Pages deployment/creation
    - No corpus ingestion
    - No English translations 049
    - No rights review P4
    - No translation verified slots P5
    - No full CBETA inventory P6

14. QUALITY CHECKS
    py_compile PASS, validate PASS corpus44 locators4192 collated10 flagged630 lineage 31 edges 31 verified or 27 verified +4 documented frontier pending 0 or intentional, build PASS 44 docs 8.76M deterministic byte-identical root/docs twice, preservation PASS 0 unauthorized, review PASS 145+, smoke PASS 44, mirror diff PASS, frontier masters handled with explicit evidence

15. PR DESCRIPTION
    Summary P3 lineage frontier finalization — 4 frontiers + X1565 lb anchors — exact lb anchors or frontier documentation, gate outputs verbatim, before/after warnings, BANNED COMMANDS followed.

16. HARDENING REPORT
    Record CBETA pin, X1565 extraction verification, exact locators or frontier documentation for 4 edges, branch mismatch, BANNED COMMANDS, gate outputs.
