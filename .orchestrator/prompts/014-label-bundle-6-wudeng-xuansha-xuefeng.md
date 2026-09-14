0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/014-label-bundle-6-wudeng-xuansha-xuefeng.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 26b807a (LABEL bundle 5 merged).

1. TASK TITLE AND SCOPE
   LABEL bundle 6 (minor, <2h) — last 3 pure LABEL docs: wudeng_huiyuan, xuansha_yulu, xuefeng_yantou. One PR 3 commits, no Chinese re-key. Final pure LABEL bundle, after this only RE-KEY 10 docs remain.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 26b807a, Ruling 1 exception, single text PRs note
   - PHASE2_PLAN.md ranks:
     * wudeng_huiyuan rank 15 LABEL s0.d0 no measured source, rank 30 LABEL carrier T48n2008 not claimed X80n1565, rank 65 LABEL only volume correction
     * xuansha_yulu rank 13 LABEL s2.d0 no ≥8-graph run, rank 39 LABEL X73n1445 carries one 10-graph run, rank 66 LABEL coverage
     * xuefeng_yantou rank 14 LABEL s0.d0 no ≥8-graph run, rank 32 LABEL cbeta_id claims T51n2076 no run, rank 67 LABEL coverage
   - data/corpus/wudeng_huiyuan.json, xuansha_yulu.json, xuefeng_yantou.json

3. PROJECT CONTEXT
   Main 26b807a after 5 bundles (15 docs). Pure LABEL 18 docs, 15 done, 3 left. This bundle final pure LABEL, minor <2h. After this, only RE-KEY 10 docs remain (major, one per PR).

4. CONFIRMED FACTS
   - wudeng_huiyuan 0/3, s0.d0 59 graphs no source, carriers T48n2008 not claimed
   - xuansha_yulu 0/5, s2.d0 72 graphs no run, X73n1445 one 10-graph run
   - xuefeng_yantou 0/4, s0.d0 80 graphs no run, T51n2076 claim unmet
   - All pure LABEL, collation unchanged.

5. CORE OBJECTIVE
   Add honest coverage notes, keep zh untouched, allowlist, metrics/bundle/mirror, 3 commits.

6. EXACT DELIVERABLES
   - wudeng_huihai? actually wudeng_huiyuan.json — coverage_note: "0/3 collated, s0.d0 59 graphs no measured source in 39 refs, 2 六祖 fields carrier is uncited T48n2008 (18/40 @4,914; 35/67 @4,952), not claimed X80n1565 (0/40 and 12/67), only volume correction note, retellings retained"
   - xuansha_yulu.json — coverage_note: "0/5 collated, s2.d0 72 graphs no ≥8-graph run in any of 39 refs, X73n1445 carries one 10-graph run in 5 fields, for 3 fields 傳燈錄 equals/exceeds X73n1446, cbeta_note ID-correct but no coverage of unused X73n1445, retellings retained"
   - xuefeng_yantou.json — coverage_note: "0/4 collated, s0.d0 80 graphs no ≥8-graph run in any of 39 refs, largest run 21/49, cbeta_id claims 景德傳燈錄 卷16 T51n2076 as witness but wording has no ≥8-graph run in T51n2076, cbeta_note ID-correct but no coverage of unmet claim, retellings retained"
   - allowlist, metrics, bundle, docs mirror

7. SUB-TASK BREAKDOWN
   1. Measure before — commit + push
   2. wudeng_huiyuan — commit + push
   3. xuansha_yulu — commit + push
   4. xuefeng_yantou — commit + push
   5. Full gates — commit + push

8. BRANCH AND TARGET
   Base: main 26b807a
   Target: fix/label-bundle-6-wudeng-xuansha-xuefeng
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
    Summary LABEL bundle 6 final pure LABEL, per-doc measurements unchanged, preserve vs change, test results, safety.

16. HARDENING REPORT
    Record rewind, branch mismatch.
