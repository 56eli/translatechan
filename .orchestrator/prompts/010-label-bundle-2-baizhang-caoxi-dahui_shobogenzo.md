0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/010-label-bundle-2-baizhang-caoxi-dahui_shobogenzo.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Read /tmp/task.md fully. Halt if empty.
   Verify main is 60112b4 (LABEL bundle 1 merged).

1. TASK TITLE AND SCOPE
   LABEL bundle 2 (minor, <2h) — 3 pure LABEL docs under Ruling 1 exception 2026-09-14: baizhang_guanglu, caoxi_zhuan, dahui_shobogenzo. One PR with 3 separate commits, no Chinese re-key, only honest disclosure notes. Second of 6 LABEL bundles.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 60112b4, Ruling 1 exception, memory note single text PRs due to large docs
   - .orchestrator/STATE.md — exception recorded verbatim, Standing Decisions
   - .orchestrator/PHASE2_PLAN.md §5 — ranks:
     * baizhang_guanglu rank 20 LABEL 0/6, rank 31 LABEL attribution uncited X80n1565, rank 57 LABEL coverage
     * caoxi_zhuan rank 19 LABEL 0/4, rank 58 LABEL coverage, rank 33 HUMAN-SOURCE P.3018 (human only, do not touch)
     * dahui_shobogenzo rank 17 LABEL 0/4 (2 fields no source), rank 41 LABEL s1.d0 no source in claimed X67n1309, rank 60 LABEL coverage
   - data/corpus/baizhang_guanglu.json, caoxi_zhuan.json, dahui_shobogenzo.json
   - scripts/test_source_preservation.py — allowlist
   - scripts/validate_data.py, test_source_review_rules.py — 138 checks

3. PROJECT CONTEXT
   Main b1e303f→60112b4 after web polish + LABEL bundle 1. 28 docs needed work, 3 done, 25 left. Pure LABEL 18 docs, 3 done, 15 left. This bundle 3 docs (8 LABEL rows) minor <2h, single text PRs noted due to large docs memory. Ruling 1 exception allows up to 3 LABEL per PR, one commit per doc.

4. CONFIRMED FACTS
   - baizhang_guanglu 0/6 in claimed X69n1323/X68n1315 and 0/6 in all 39 refs, only carrier X80n1565 4/6 fragments
   - caoxi_zhuan 0/4, P.3018 out of CBETA, parallels are 壇經 recension fragments, cbeta_note ID-correct but no coverage note
   - dahui_shobogenzo 0/4, s2.d0 47 graphs no ≥8-graph run anywhere, cbeta_note ID-correct but no coverage
   - All pure LABEL, no Chinese re-key, collation unchanged.

5. CORE OBJECTIVE
   Add honest coverage_note/cbeta_note disclosures per PHASE2_PLAN, keep zh untouched, update allowlist, regenerate metrics/bundle/mirror, gates green, 3 commits.

6. EXACT DELIVERABLES
   - data/corpus/baizhang_guanglu.json — add/extend coverage_note: "0/6 content fields verbatim in claimed X69n1323/X68n1315 and in all 39 refs, only measured carrier is uncited X80n1565 (4/6 fields 16-28 graph fragments), wording is project retelling, no coverage_note previously"
   - data/corpus/caoxi_zhuan.json — add coverage_note: "0/4 collated, 3 fields no measured text in claimed X86n1598, P.3018 named by cbeta_id is out of CBETA (Dunhuang P.3018), measurable parallels are 壇經 recension fragments, human sourcing required for P.3018 per Ruling 4"
   - data/corpus/dahui_shobogenzo.json — add coverage_note: "0/4 collated, s2.d0 47 graphs no ≥8-graph run in all 39 refs, s1.d0 no source in claimed X67n1309 only 9/56 run in T51n2076 @142146, cbeta_note ID-correct but no coverage of double-carry and nowhere fields"
   - scripts/test_source_preservation.py — allowlist +3 docs exact pointers
   - data/project_metrics.json, app_data.js, docs/ mirror — regenerated
   - No STATE.md change (exception already recorded)

7. SUB-TASK BREAKDOWN
   1. Measure before collation from registers (0/6, 0/4, 0/4) — commit + push
   2. baizhang_guanglu note — commit + push
   3. caoxi_zhuan note — commit + push
   4. dahui_shobogenzo note — commit + push
   5. Full gates — commit + push

8. BRANCH AND TARGET
   Base: main 60112b4
   Target: fix/label-bundle-2-baizhang-caoxi-dahui_shobo
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE
   git add -A && git commit -qm "fix: <doc> LABEL ..." && git push -qu origin <branch>, one PR at end with 3 commits.

10. TECHNICAL REQUIREMENTS
    Keep 5 rooms, internal IDs, CSP, tokens 43, bundle <2MB+PNG, 0 style=, no Chinese change, no 630 re-designation, no workflow edit, no CBETA fetch.

11. SAFETY
    No zh change, allowlist set-equal, no HUMAN-SOURCE fetch, no source-looking Chinese generation.

12. CLEANUP
    Clean worktree.

13. OUT OF SCOPE
    Do not touch other docs, do not re-key, do not batch HUMAN-SOURCE, do not change visual system.

14. QUALITY CHECKS
    py_compile PASS, validate_data PASS, build PASS, smoke PASS 35 texts + preservation 0 unauthorized, diff PASS, structural diff PASS, test_source_review_rules 138+? PASS

15. PR DESCRIPTION
    Summary LABEL bundle 2, per-doc measurements before/after unchanged, preserve vs change, test results, safety, session irregularities.

16. HARDENING REPORT
    Record rewind hazard, branch mismatch.
