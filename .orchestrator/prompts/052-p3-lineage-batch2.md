# Task 052 — P3 Lineage Exact Locators Batch 2 — 10 edges + 1 unlinked master

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git log --oneline origin/main -5
   Verify main is ddce5c3 (44 docs after enthusiast 100% closer, 10 collated, 4,192 locators, 553k+302k content CJK, 8.7M bundle, P0+P1+P2 done, enthusiast 100% closer done)

1. TASK TITLE AND SCOPE
   P3 Lineage Exact Locators Batch 2 — 10 edges + 1 unlinked master — second batch of P3. Current after batch1: ~21 edges traditional_link_pending_exact_locator remaining, ~28 masters needs_exact_locator, 2 unlinked frontier remaining (if batch1 handled 1). Why P3: lineage second core objective, scaffold not graph, unblocks graph. Steps: for each edge find exact T51n2076 or X80n1565 or chuandenglu_full page/line via CBETA refs, for unlinked masters either link to existing corpus key or mark frontier with explicit profile_evidence, update masters.json linked_corpus_keys, lineage_verification.json with exact locators.

2. REQUIRED READING ORDER
   - .orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md — Lineage 34 masters etc.
   - .orchestrator/NEXT_TASKS_2026-09-19.md P3 — same as batch1
   - data/lineage/masters.json — 35 masters, after batch1 maybe 35 with 1 linked, 2 unlinked remaining
   - data/lineage/lineage_verification.json — 31 edges, after batch1 10 exact, 21 pending — pick next 10
   - data/corpus/chuandenglu_full.json — 1,274 units enables exact locators
   - sessions/P3_LINEAGE_BATCH1_2026-09-21.md — pattern from batch1
   - scripts/collate_refs.py + collate_corpus.py — pinned dbdea410, 41 refs verified

3. PROJECT CONTEXT
   TranslateChan 44 docs after enthusiast 100% closer, 1252 slots verified 177 matrix 21, locators 4,192, 630 flagged authoritative stays, 0 unauthorized 373 permitted + 9 new docs, 145 checks, bundle 8.7M deterministic. Headline "The old texts are real; the translators are not." Objectives at full strength not renegotiated. Pages out of scope per 2026-09-19. Evidence model: authoritative 2026-09-21 register 44 docs, 630 authoritative. P3 batch1 done (10 edges exact + 1 unlinked), batch2 continues.

4. CONFIRMED FACTS
   - Lineage: 35 masters, 31 edges, after batch1 10 exact 21 pending, 1 unlinked handled 2 remaining
   - Chuandeng Lu full enables exact locators
   - CBETA pin dbdea410, 41 refs verified
   - Preservation base 3cc7a8e9681e, 0 unauthorized for existing 44 must hold
   - Bundle 8.7M deterministic

5. CORE OBJECTIVE
   Provide exact locators for next 10 lineage edges + 1 unlinked master in batch 2: for each edge find exact T51n2076 or X80n1565 or chuandenglu_full page/line via CBETA refs, update lineage_verification.json with exact locators status exact_locator_verified, for unlinked master either link to existing corpus key or mark frontier with explicit profile_evidence, update masters.json.

6. EXACT DELIVERABLES
   - `data/lineage/lineage_verification.json` updated — next 10 edges from traditional_link_pending_exact_locator → exact_locator_verified with exact page/line reference
   - `data/lineage/masters.json` updated — next unlinked master handled
   - `data/corpus_manifest.json` and `data/project_metrics.json` regenerated — 44 docs still
   - `app_data.js` and `docs/app_data.js` regenerated deterministic byte-identical if only lineage changed
   - Report `sessions/P3_LINEAGE_BATCH2_2026-09-21.md` with exact locators for 10 edges, unlinked master handling, gate outputs verbatim, before/after warnings

7. SUB-TASK BREAKDOWN
   1. Inventory lineage_verification.json remaining 21 edges, pick next 10 edges (e.g., baizhang_huaihai→huangbo_xiyun, huangbo_xiyun→linji_yixuan, linji_yixuan→... etc. — or any 10 not done in batch1)
   2. For unlinked master pick next: yangqi_fanghui, dahong_zuzheng, prajnatara, or longtan_chongxin — handle
   3. Update lineage_verification.json with exact locators status exact_locator_verified
   4. Update masters.json
   5. Run gates verbatim
   6. Create report
   7. Commit + push, PR description includes verbatim outputs

8. BRANCH AND TARGET
   Base: main ddce5c3 (44 docs after enthusiast 100% closer)
   Target: fix/p3-lineage-batch2
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed, git log -p on bundle. SAFE: --name-only, --stat, --oneline, ls -lh, cat, jq.
   Pages scope: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for. No Pages work.

10. TECHNICAL REQUIREMENTS
    - No edits to data/corpus/*.json manually — only lineage files + generated metrics/bundle
    - No new runtime deps, no secrets, no style= (must stay 0), no new setProperty (census stays 4)
    - CBETA pin dbdea410, 41 refs verified
    - Preservation: lineage files allowlisted as permitted, 0 unauthorized for existing 44 must hold
    - Keep COMMON_QUALITIES, RULING_WEBSITE out-of-scope notice
    - Use chuandenglu_full.json 1,274 units as source for exact locators

11. SAFETY
    - No workflow edit
    - 630 authoritative stays authoritative
    - No claiming website beautiful/done — Pages out of scope
    - Do not invent locators — must be verifiable

12. CLEANUP
    Clean worktree, no committed refs, no __pycache__, no /tmp/refs committed

13. OUT OF SCOPE
    - No Pages deployment/creation, no 36-layout work
    - No corpus ingestion — P1 done, P2 done, enthusiast 100% done
    - No English translations — task 049 roadmap draft
    - No rights review — P4
    - No translation verified slots — P5
    - No full CBETA inventory — P6

14. QUALITY CHECKS
    py_compile PASS, validate PASS corpus44 locators4192 collated10 flagged630, build PASS 44 docs 8.7M deterministic byte-identical, preservation PASS 0 unauthorized, review PASS 145+, smoke PASS 44 texts, mirror diff PASS, exact locators for 10 edges verified, unlinked master handled, warnings 2→1 or 0, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired

15. PR DESCRIPTION
    Summary P3 lineage exact locators batch 2 — 10 edges + 1 unlinked master — exact T51n2076 or chuandenglu_full page/line locators, gate outputs verbatim, before/after warnings, BANNED COMMANDS followed.

16. HARDENING REPORT
    Record CBETA pin, extraction verification, exact locators for 10 edges, unlinked master handling, branch mismatch, BANNED COMMANDS, gate outputs.

