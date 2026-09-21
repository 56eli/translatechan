# Task 054 — P2 Core Yulu Re-key Retry — Dazhu Huihai + Nanquan — attempt ≥80% collation

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git log --oneline origin/main -5
   Verify main is 6d36957 (44 docs after enthusiast 100% closer + lineage batch1+2, 10 collated, 4,192 locators, 855,603 content CJK / 917,778 all-string, 125 provenance notes 83 rendering 35 docs cbeta_note 28, 630 flagged, bundle 8,754,966 B, P0+P1+P2 done with 047 Baizhang+Huangbo authenticity labels landed, 048 Dazhu+Nanquan re-key attempt failed 0/6 <80% NOT landed labels+coverage_notes only, enthusiast 100% 6 full-witness records, lineage 18 verified 13 pending 33/35 linked)

1. TASK TITLE AND SCOPE
   P2 Core Yulu Re-key Retry — Dazhu Huihai + Nanquan — 0/6 collating as project compositions, retry X-series carriers with thorough extraction. Requirement: attempt R-A re-key from X-series witnesses (X63n1223/X63n1224 for Dazhu, X68n1315 for Nanquan) with honest coverage_note, cbeta_note, gates green, no generated placeholders, aim ≥80% (5 of 6) collating to land re-keyed version, else keep project retellings with enhanced authenticity labels and document why carrier insufficient.

2. REQUIRED READING ORDER
   - .orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md — P2 core yulu authenticity 0/6 collating as project compositions, Tier 2 core yulu incomplete in corpus
   - .orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md §3.3 Tier 2 — Dazhu Huihai, Nanquan Puyuan listed as core yulu incomplete, open-ended disclaimer 102 masters snapshot NOT exhaustive
   - .orchestrator/NEXT_TASKS_2026-09-19.md P2 — Dazhu Huihai + Nanquan re-key attempt 2 docs try X-series carriers
   - .orchestrator/WITNESS_INVENTORY*.md — per-doc carrier measurement pattern, X-series carriers, re-key pattern, 41 refs verified after Caoshan, 40 after enthusiast
   - data/corpus/dazhu_huihai.json — current 0/6 collated, coverage_note: 6 fields across 3 sections, W1 status partial_or_failed, R-A re-key attempt from X63n1223/X63n1224 measured and failed 0/6 EXACT in 40 pinned refs dbdea410, 80% threshold 5/6 not met, X63n1223 contributes zero runs, best carrier T51n2076 44/54 @58,336 for s0.d1, project retellings retained, cbeta_id X63n1223/X63n1224, cbeta_note corrected 2026-08-08 prior X1258 wrong
   - data/corpus/nanquan_yulu.json — 0/6 collated, coverage_note: 6 fields across 3 sections, W1 status partial_or_failed, R-A attempt from X68n1315 failed 0/6 EXACT, largest shared run 23/27 s2.d?, fragmentary, parts carried by 傳燈錄/雲門 records, cbeta_id X68n1315, cbeta_note corrected dropped spurious T1985 pairing
   - data/corpus/dongshan_yulu.json + caoshan_benji.json + baizhang_guanglu.json — Caodong and Baizhang yulu template, re-key pattern, authenticity label pattern from 047
   - scripts/collate_refs.py + collate_corpus.py — pinned CBETA revision dbdea41071e1e260ad84b72faefd4587333cf76d, extraction rule cbeta-p5-body-cjk-v1, need X63n1223/X63n1224/X68n1315 inventory, collate --doc dazhu_huihai --require-verified-refs and --doc nanquan_yulu
   - sessions/P2_DAZHU_NANQUAN_REKEY_2026-09-20.md — previous attempt report, extraction and digest verification, witness inventory, collation output verbatim 0/6
   - vision.md §1.1 — Exhaustive Canonical Ingestion not met, 44 docs now
   - .orchestrator/BOOKSTACK_WIKI_VISION_2026-09-21.md — Oracle VPS 2 OCPU 12GB RAM Ubuntu 24.04 domain nonduality.duckdns.org

3. PROJECT CONTEXT
   TranslateChan 44 docs after enthusiast 100% closer (38→44 docs including congronglu 100 cases 500/500 EXACT + chuandenglu_full 1,274 units 2,549 EXACT + caoshan_benji 84 units 169 EXACT + 6 full-witness Huangbo 19 Mazu 35 Yunmen 776 Dongshan 322 Zhaozhou 80 Dahui 1,354 = 2,586 units 302,592 CJK 5,178 EXACT 93.8% collation 5,037/5,368, locators 4,192, 630 flagged authoritative stays, 0 unauthorized, 145 checks, bundle 8.75M deterministic). Headline "The old texts are real; the translators are not." Objectives at full strength not renegotiated. Pages out of scope per 2026-09-19. Evidence model: authoritative 2026-09-21 register 44 docs 630 authoritative. P2 core yulu are excerpt_seed with 0/6 collating — need to retry X-series carriers for re-key, or enhanced authenticity labels if no carrier. Task 047 Baizhang Guanglu + Huangbo Wanling authenticity labels landed per pattern (editorial_note R-B labels, coverage_notes), Task 048 Dazhu+Nanquan attempted but <80% NOT landed only labels.

4. CONFIRMED FACTS
   - Dazhu Huihai X63n1223 頓悟入道要門論 / X63n1224 諸方門人參問語錄 0/6 collated, no ≥8-graph run in 40 refs, X63n1223 contributes zero runs, best carrier T51n2076 44/54 @58,336 for s0.d1, project retellings retained, partial_or_failed
   - Nanquan Yulu X68n1315 古尊宿語錄·池州南泉普願禪師語要 0/6 collated, largest 23/27, s1.d0 19 graphs no ≥8-graph run, fragmentary, parts carried by 傳燈錄/雲門 records, partial_or_failed
   - WITNESS_INVENTORY pattern: try X-series carriers, if carrier found with ≥80% collating then R-A re-key verbatim from pinned witness, else authenticity label per 047 pattern
   - Preservation base 3cc7a8e9681e, 0 unauthorized for existing 44 must hold, updated files allowlisted as permitted
   - Bundle 8.75M deterministic byte-identical after lineage changes
   - CBETA pin dbdea410, 40-41 refs verified, extraction rule cbeta-p5-body-cjk-v1

5. CORE OBJECTIVE
   Retry R-A re-key of Dazhu Huihai and Nanquan from X-series witnesses with thorough extraction: extract X63n1223/X63n1224 and X68n1315 via collate_refs.py pinned dbdea410 --verify-against manifest, inventory structure (sections/dialogues/graphs), create deterministic producer scripts/segment_dazhu_huihai.py and scripts/segment_nanquan_yulu.py if re-keying — only input pinned witness, asserts every content field contiguous CJK run, measure zh_chars, honest coverage_note + cbeta_note, run collate_corpus.py --doc dazhu_huihai and --doc nanquan_yulu --require-verified-refs, if ≥80% (5 of 6) collating then land re-keyed version verbatim from witness, else keep project retellings with enhanced authenticity labels (editorial_note R-B labels like Baizhang/Huangbo) and detailed coverage_note explaining why carrier insufficient, gates green.

6. EXACT DELIVERABLES
   - `data/corpus/dazhu_huihai.json` updated — either re-keyed from X63n1223/X63n1224 verbatim if carrier found ≥80% (5 of 6 EXACT), or enhanced coverage_note: 0/6 collated, no ≥8-graph run in 40 refs, X63n1223 contributes zero, best carrier T51n2076 44/54 @58,336, project retellings retained, W1 status partial_or_failed, plus editorial_note authenticity labels per 047 pattern if applicable, honest cbeta_note
   - `data/corpus/nanquan_yulu.json` updated — either re-keyed from X68n1315 verbatim if carrier found ≥80%, or enhanced coverage_note: 0/6 collated, largest 23/27, s1.d0 19 graphs no ≥8-graph run, fragmentary, parts carried by 傳燈錄/雲門 records, retellings retained, plus editorial_note authenticity labels if applicable
   - `data/corpus_manifest.json` and `data/project_metrics.json` regenerated via validate_data.py --write-metrics
   - `app_data.js` and `docs/app_data.js` regenerated deterministic, byte-identical between root and docs, two consecutive builds identical
   - Report `sessions/P2_DAZHU_NANQUAN_RETRY_2026-09-21.md` with: X-series extraction and digest verification (40→43 refs if new X-series, 40 verified / 0 drift), witness inventory: X63n1223/X63n1224 and X68n1315 structure (sections/dialogues/graphs), collate_corpus.py --doc dazhu_huihai and --doc nanquan_yulu output verbatim — 0/6 or ≥80%, gate outputs verbatim (py_compile, validate_data corpus44 locators4192 collated10 flagged630, build_data_bundle 44 docs 8.75M deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 44 texts), before/after coverage_note, cbeta_note, re-key or authenticity label decision, statement no generated placeholders deterministic producer only input pinned witness if re-keyed, no corpus edits beyond 2 docs

7. SUB-TASK BREAKDOWN
   1. Find CBETA witnesses: check xml-p5 X/X63/X63n1223.xml, X/X63/X63n1224.xml, X/X68/X68n1315.xml via collate_refs.py --verify-against manifest, ensure 40→43 refs verified / 0 drift, extract via scripts/collate_refs.py or direct XML parsing, save to /tmp/refs/ref_X63n1223.txt etc for inspection (do not commit)
   2. Inventory witness structure: sections, dialogues, graphs, total CJK chars, compare to current corpus json content fields
   3. Create deterministic producer if re-keying: scripts/segment_dazhu_huihai.py and scripts/segment_nanquan_yulu.py — only input pinned witness, asserts every content field contiguous CJK run, outputs new json verbatim from witness, measures zh_chars
   4. Attempt re-key: generate new json from scratch source verbatim from /tmp/refs/ref_<witness>.txt, measure zh_chars, honest coverage_note + cbeta_note, run collate_corpus.py --doc dazhu_huihai and --doc nanquan_yulu --require-verified-refs, check ≥80% collating, if not then keep retellings with enhanced notes
   5. If <80%: enhance authenticity labels per 047 pattern — editorial_note marking sections as project retellings with no witness attribution if applicable, coverage_note with detailed carrier measurements, cbeta_note with correction history
   6. Run validate_data.py --write-metrics, validate_data.py, build_data_bundle.py twice, test_source_preservation.py, test_source_review_rules.py, smoke_test.mjs, diff -rq data docs/data — quote verbatim
   7. Create sessions/P2_DAZHU_NANQUAN_RETRY_2026-09-21.md
   8. Commit + push, PR description includes extraction, inventory, collation verbatim 0/6 or ≥80%, gate outputs verbatim, re-key or authenticity label decision, BANNED COMMANDS followed

8. BRANCH AND TARGET
   Base: main 6d36957 (44 docs after enthusiast + lineage batch1+2)
   Target: fix/p2-dazhu-nanquan-retry
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed, git log -p on bundle, copying generated placeholders. SAFE: --name-only, --stat, --oneline, ls -lh, cat, jq, python3 scripts/collate_corpus.py --doc <id> --require-verified-refs.
   Pages scope: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for. No Pages work.

10. TECHNICAL REQUIREMENTS
    - No new docs, only 2 docs updated — either re-keyed verbatim from X-series if carrier ≥80%, or honest notes if no carrier
    - No new runtime deps, no secrets, no style= (must stay 0), no new setProperty (census stays 4)
    - CBETA pin dbdea41071e1e260ad84b72faefd4587333cf76d, extraction rule cbeta-p5-body-cjk-v1, 40-41 refs verified / 0 drift
    - Preservation: updated files allowlisted as permitted changes, 0 unauthorized for existing 44 must hold (check scripts/test_source_preservation.py)
    - Keep COMMON_QUALITIES_2026-09-14 light mental load minimum info expand/hover/toggle English first not dense comfortable to read easy to navigate piece meal plain language info section for every work and teacher where from / related / background
    - Keep corpus integrity: 0 unauthorized, 44 docs, honest notes, no generated placeholders — must be verbatim from X-series witness if re-keying
    - Bundle deterministic byte-identical root/docs, two consecutive builds identical

11. SAFETY
    - No workflow edit (quality.yml retired text-integrity only, do not edit)
    - 630 authoritative stays authoritative, no re-designation
    - No claiming website beautiful/done — Pages out of scope
    - Do not copy generated placeholders — must be verbatim from X-series witness if re-keying, else retellings retained with honest notes
    - Open-ended scope: ROADMAP_ALL_ENCOMPASSING 102 masters snapshot NOT exhaustive, target 150-200, more material in circulation

12. CLEANUP
    Clean worktree, no committed refs, no __pycache__, no /tmp/refs committed, no large artifacts

13. OUT OF SCOPE
    - No Pages deployment/creation, no 36-layout work
    - No Baizhang + Huangbo Wanling — that's done 047
    - No lineage exact locators — that's P3 batch3 parallel task 053
    - No rights review — P4
    - No translation verified slots — P5
    - No full CBETA inventory — P6

14. QUALITY CHECKS
    py_compile PASS, validate PASS corpus44 slots1252 verified177 matrix21 locators4192 collated10 flagged630 (or collated12 if re-keyed ≥80% — then 12 collated), build PASS 44 docs 8.75M deterministic byte-identical root/docs two consecutive builds identical, preservation PASS 0 unauthorized, review PASS 145+, smoke PASS 44 texts, collate dazhu 0/6 or ≥80% and nanquan 0/6 or ≥80% verbatim, mirror diff PASS, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired, re-key or authenticity label per pattern, coverage_note and cbeta_note honest

15. PR DESCRIPTION
    Summary Dazhu Huihai + Nanquan re-key retry from X-series, extraction digest verification 40 verified / 0 drift, witness inventory X63n1223/X63n1224 and X68n1315 structure, collation output verbatim 0/6 or ≥80%, gate outputs verbatim, before/after notes, re-key or authenticity label decision, BANNED COMMANDS followed, Pages scope respected.

16. HARDENING REPORT
    Record CBETA pin dbdea410, extraction verification, witness inventory, collation before/after, branch mismatch if any, BANNED COMMANDS followed, no generated placeholders, gate outputs, bundle determinism.
