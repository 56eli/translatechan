0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/013-label-bundle-5-lidai-nanquan-qinggui.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 1ccfc77 (LABEL bundle 4 merged).

1. TASK TITLE AND SCOPE
   LABEL bundle 5 (minor, <2h) — 3 pure LABEL docs: lidai_fabao_ji, nanquan_yulu, qinggui_monastic_codes. One PR 3 commits, no Chinese re-key.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 1ccfc77, Ruling 1 exception, single text PRs note
   - PHASE2_PLAN.md ranks:
     * lidai_fabao_ji rank 21 LABEL 0/3 + rank 34 HUMAN-SOURCE P.2125 (do not touch HUMAN-SOURCE)
     * nanquan_yulu rank 18 LABEL 0/6 + rank 38 LABEL attribution + rank 64 LABEL coverage
     * qinggui_monastic_codes rank 22 LABEL 0/5 + rank 48 LABEL composite
   - data/corpus/lidai_fabao_ji.json, nanquan_yulu.json, qinggui_monastic_codes.json

3. PROJECT CONTEXT
   Main 1ccfc77 after 4 bundles (12 docs). Pure LABEL 18 docs, 12 done, 6 left. This bundle 3 docs (6 rows) minor <2h.

4. CONFIRMED FACTS
   - lidai_fabao_ji 0/3, field1 condenses two witness runs, fields 2-3 no ≥8-graph run, P.2125 out of CBETA
   - nanquan_yulu 0/6, largest run 23/27, s1.d0 no ≥8-graph run
   - qinggui_monastic_codes 0/5 in T48n2025/X63n1245 and all 39 refs, composite with no note which field from which
   - All pure LABEL.

5. CORE OBJECTIVE
   Add honest coverage notes, keep zh untouched, allowlist, metrics/bundle/mirror, 3 commits.

6. EXACT DELIVERABLES
   - lidai_fabao_ji.json — coverage_note: "0/3 collated, field1 condenses two witness runs 20/53 graphs at T51n2075@8,796/@8,808, fields 2-3 share nothing ≥8 graphs with any ref, P.2125 named by cbeta_id is out of CBETA (Dunhuang P.2125) → human sourcing Ruling 4, project retellings retained"
   - nanquan_yulu.json — coverage_note: "0/6 collated, largest contiguous run 23/27, s1.d0 19 graphs no ≥8-graph run in any of 39 refs, fragmentary wording, parts carried by 傳燈錄/雲門 records, retellings retained"
   - qinggui_monastic_codes.json — coverage_note: "0/5 in T48n2025/X63n1245 and all 39 refs, composite citing two 清規 with no note which field from which, 百丈 一日不作一日不食 at T48n2025@10,064 and 坐禪儀 36/52 in X63n1245@25,973 only measured fragments, retellings retained"
   - allowlist, metrics, bundle, docs mirror

7. SUB-TASK BREAKDOWN
   1. Measure before — commit + push
   2. lidai_fabao_ji — commit + push
   3. nanquan_yulu — commit + push
   4. qinggui_monastic_codes — commit + push
   5. Full gates — commit + push

8. BRANCH AND TARGET
   Base: main 1ccfc77
   Target: fix/label-bundle-5-lidai-nanquan-qinggui
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
    Summary LABEL bundle 5, per-doc measurements unchanged, preserve vs change, test results, safety.

16. HARDENING REPORT
    Record rewind, branch mismatch.
