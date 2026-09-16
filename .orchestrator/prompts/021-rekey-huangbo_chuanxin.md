0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/021-rekey-huangbo_chuanxin.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 383db27 (RE-KEY dongshan_yulu merged).

1. TASK TITLE AND SCOPE
   RE-KEY 7/10 (major, ~1-2h, single text PR) — huangbo_chuanxin. One PR, one doc, verbatim re-key Chuanxin Fayao. Under Ruling 1 exception, RE-KEY one per PR, with BANNED COMMANDS guard rail.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 383db27, LABEL complete, RE-KEY 6/10 done
   - PHASE2_PLAN.md rank 31 RE-KEY: huangbo_chuanxin T48n2012A Chuanxin Fayao — claimed T48n2012B is Wanling Lu, s0.d0 大道盡越 vs 大道越卻, s1.d0 不見一法即如來 vs 即見如來, rank 45 LABEL?
   - data/corpus/huangbo_chuanxin.json — 7 fields
   - scripts/collate_corpus.py — T48n2012A/B witnesses

3. PROJECT CONTEXT
   Pure LABEL complete, RE-KEY 6/10 done. Remaining 4 RE-KEY. This doc moderate 7 fields, single text PR.

4. CONFIRMED FACTS
   - huangbo_chuanxin 0/7? Actually T48n2012A carries parts, T48n2012B is different work
   - Witnesses in 39-ref set

5. CORE OBJECTIVE
   Re-key 7 fields from T48n2012A verbatim (Chuanxin Fayao), update pinyin, coverage_note honest: "0/7→7/7 after re-key, previously T48n2012B claimed but T48n2012A is Chuanxin Fayao source, 大道盡越 vs 大道越卻 etc, now verbatim T48n2012A", allowlist, metrics/bundle/mirror.

6. EXACT DELIVERABLES
   - data/corpus/huangbo_chuanxin.json — re-key zh from T48n2012A, pinyin, coverage_note
   - allowlist, metrics, bundle, docs mirror

7. SUB-TASK BREAKDOWN
   1. Fetch CBETA @ dbdea410, extract refs, verify 39/0
   2. Collate before
   3. Re-key
   4. Coverage note
   5. Full gates

8. BRANCH AND TARGET
   Base: main 383db27
   Target: fix/rekey-huangbo_chuanxin
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed. SAFE: --name-only, --stat, --oneline, ls -lh.

10. TECHNICAL REQUIREMENTS
    R-A policy: re-key only from extracted ref, mechanically.

11. SAFETY
    No workflow edit, allowlist set-equal, 630 not re-designated.

12. CLEANUP
    Clean worktree, no committed refs.

13. OUT OF SCOPE
    Do not touch other docs.

14. QUALITY CHECKS
    py_compile PASS, validate PASS, build PASS, smoke PASS, diff PASS, structural diff PASS, collation after 7/7.

15. PR DESCRIPTION
    Summary RE-KEY huangbo_chuanxin, before/after, witnesses, preserve vs change, test results, BANNED COMMANDS followed.

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed.
