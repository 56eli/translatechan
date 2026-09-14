0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/011-label-bundle-3-dazhu-deshan-fayan.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 2fa921b (LABEL bundle 2 merged).

1. TASK TITLE AND SCOPE
   LABEL bundle 3 (minor, <2h) — 3 pure LABEL docs under Ruling 1 exception: dazhu_huihai, deshan_yulu, fayan_yulu. One PR with 3 separate commits, no Chinese re-key, only honest disclosure notes. Third of 6 LABEL bundles.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 2fa921b, Ruling 1 exception, single text PRs note
   - .orchestrator/STATE.md — exception verbatim
   - .orchestrator/PHASE2_PLAN.md ranks:
     * dazhu_huihai rank 16 LABEL 2 fields no ≥8-graph run, rank 37 LABEL attribution X63n1223 zero runs, rank 61 LABEL coverage
     * deshan_yulu rank 29 LABEL 0/6 claimed witness carries nothing, rank 62 LABEL volume note only
     * fayan_yulu rank 3 CITATION done, rank 46 LABEL 宗門十規論 component summarizes X63n1226 not in 39 refs
   - data/corpus/dazhu_huihai.json, deshan_yulu.json, fayan_yulu.json
   - scripts/test_source_preservation.py, validate_data.py, test_source_review_rules.py

3. PROJECT CONTEXT
   Main 60112b4→2fa921b after bundles 1-2. 28 docs needed work, 6 done, 22 left. Pure LABEL 18 docs, 6 done, 12 left. This bundle 3 docs (6 rows) minor <2h.

4. CONFIRMED FACTS
   - dazhu_huihai 0/6, s1.d0/s1.d1 no ≥8-graph run, X63n1223 zero runs
   - deshan_yulu 0/6, claimed witness carries nothing, honest carriers are probes X80n1565/X68n1315
   - fayan_yulu 8 sermons from T1985/X1321 false citation already fixed via #43, remaining 宗門十規論 component no collatable witness
   - All pure LABEL, collation unchanged.

5. CORE OBJECTIVE
   Add honest coverage notes, keep zh untouched, allowlist, metrics/bundle/mirror, 3 commits.

6. EXACT DELIVERABLES
   - data/corpus/dazhu_huihai.json — coverage_note: "0/6 collated, s1.d0/s1.d1 no ≥8-graph run in all 39 refs, X63n1223 listed first contributes zero runs, best carrier T51n2076 44/54 @58,336 for s0.d1, project retellings retained"
   - data/corpus/deshan_yulu.json — coverage_note: "0/6 content fields match T2076/X68n1315/X1565 phrasing as blanket claim understates probe coverage: X80n1565 carries 5 fields runs, X68n1315 2, honest carriers are probes, primary witness assignment wrong, retellings retained"
   - data/corpus/fayan_yulu.json — coverage_note: "8 sermons citation fixed via #43, remaining 宗門十規論 component (5-item project summary) summarizes X63n1226 not in 39-ref set, no collatable witness, undisclosed, retained as project summary"
   - allowlist, metrics, bundle, docs mirror

7. SUB-TASK BREAKDOWN
   1. Measure before — commit + push
   2. dazhu_huihai — commit + push
   3. deshan_yulu — commit + push
   4. fayan_yulu — commit + push
   5. Full gates — commit + push

8. BRANCH AND TARGET
   Base: main 2fa921b
   Target: fix/label-bundle-3-dazhu-deshan-fayan
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE
   git add -A && git commit -qm "fix: <doc> LABEL ..." && git push -qu origin <branch>

10. TECHNICAL REQUIREMENTS
    Keep 5 rooms, internal IDs, CSP, tokens 43, bundle <2MB+PNG, 0 style=, no Chinese change.

11. SAFETY
    No zh change, allowlist set-equal, no HUMAN-SOURCE fetch.

12. CLEANUP
    Clean worktree.

13. OUT OF SCOPE
    Do not touch other docs, do not re-key.

14. QUALITY CHECKS
    py_compile PASS, validate PASS, build PASS, smoke PASS, diff PASS, structural diff PASS, 138+ checks PASS

15. PR DESCRIPTION
    Summary LABEL bundle 3, per-doc measurements unchanged, preserve vs change, test results, safety.

16. HARDENING REPORT
    Record rewind, branch mismatch.
