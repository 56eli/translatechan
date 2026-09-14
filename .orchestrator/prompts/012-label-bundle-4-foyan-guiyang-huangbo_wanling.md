0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/012-label-bundle-4-foyan-guiyang-huangbo_wanling.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is e6d1243 (LABEL bundle 3 merged).

1. TASK TITLE AND SCOPE
   LABEL bundle 4 (minor, <2h) — 3 pure LABEL docs under Ruling 1 exception: foyan_qingyuan, guiyang_yulu, huangbo_wanling. One PR with 3 separate commits, no Chinese re-key.

2. REQUIRED READING ORDER
   - /tmp/state.md — main e6d1243, Ruling 1 exception, single text PRs note
   - .orchestrator/STATE.md — exception verbatim
   - .orchestrator/PHASE2_PLAN.md ranks:
     * foyan_qingyuan rank 12 LABEL 4/6 no ≥8-graph run, rank 40 LABEL double-carried, rank 63 LABEL coverage
     * guiyang_yulu rank 8 LABEL 0/6, rank 56 LABEL title asserts 96 圓相 but none, rank 29? actually 2 rows
     * huangbo_wanling rank 10 LABEL 0/7, rank 47 LABEL no coverage_note
   - data/corpus/foyan_qingyuan.json, guiyang_yulu.json, huangbo_wanling.json

3. PROJECT CONTEXT
   Main 2fa921b→e6d1243 after bundles 1-3. 9 docs done, 19 left. Pure LABEL 18 docs, 9 done, 9 left. This bundle 3 docs (7 rows) minor <2h.

4. CONFIRMED FACTS
   - foyan_qingyuan 0/6, 4 fields no ≥8-graph run, one substantial run 27/48 double-carried X68n1315 and T51n2076
   - guiyang_yulu 0/6, every field zero 16-graph windows, title asserts 96 圓相 but no content
   - huangbo_wanling 0/7 in claimed T48n2012B and all 39 refs, retold not quoted, no coverage_note
   - All pure LABEL, collation unchanged.

5. CORE OBJECTIVE
   Add honest coverage notes, keep zh untouched, allowlist, metrics/bundle/mirror, 3 commits.

6. EXACT DELIVERABLES
   - foyan_qingyuan.json — coverage_note: "0/6 collated, 4 fields no ≥8-graph run in all 39 refs, one substantial run 27/48 shared by claimed X68n1315 @4,284 and T51n2076 @87,323, double-carried, 4 works circulate, project retellings retained"
   - guiyang_yulu.json — coverage_note: "0/6 content fields verbatim in T47n1989/T47n1990 or any of 39 refs, every field zero 16-graph windows, title asserts 96 圓相 but no 圓相 content (witnesses mention 圓相 2×/3×), no coverage/recension note, retellings retained"
   - huangbo_wanling.json — coverage_note: "0/7 in claimed T48n2012B and 0/7 in all 39 refs (裴休/壁上畫像 and 噇酒糟漢 material retold not quoted), record names 宛陵錄 as witness but only one unit carries note, no coverage_note stating nothing verbatim"
   - allowlist, metrics, bundle, docs mirror

7. SUB-TASK BREAKDOWN
   1. Measure before — commit + push
   2. foyan_qingyuan — commit + push
   3. guiyang_yulu — commit + push
   4. huangbo_wanling — commit + push
   5. Full gates — commit + push

8. BRANCH AND TARGET
   Base: main e6d1243
   Target: fix/label-bundle-4-foyan-guiyang-huangbo_wanling
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
    Summary LABEL bundle 4, per-doc measurements unchanged, preserve vs change, test results, safety.

16. HARDENING REPORT
    Record rewind, branch mismatch.
