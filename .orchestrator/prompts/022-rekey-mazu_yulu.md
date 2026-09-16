0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/022-rekey-mazu_yulu.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is ac57347 (RE-KEY huangbo_chuanxin merged).

1. TASK TITLE AND SCOPE
   RE-KEY 8/10 (major, ~1-2h, single text PR) — mazu_yulu. One PR, one doc, verbatim re-key Mazu Daoyi Yulu from T51n2076 / X79n1559 / T48n2012B? Actually Mazu sections in Jingde Chuandeng lu T51n2076 and Mazu yulu T48n2012B? Need to check. Under Ruling 1 exception, RE-KEY one per PR, with BANNED COMMANDS guard rail.

2. REQUIRED READING ORDER
   - /tmp/state.md — main ac57347, LABEL complete, RE-KEY 7/10 done
   - PHASE2_PLAN.md ranks for mazu_yulu — claimed T51n2076? Actually rank? Check
   - data/corpus/mazu_yulu.json
   - scripts/collate_corpus.py — T51n2076, T48n2012B witnesses

3. PROJECT CONTEXT
   Pure LABEL complete, RE-KEY 7/10 done. Remaining 3 RE-KEY. Single text PR.

4. CONFIRMED FACTS
   - mazu_yulu partial collation, needs re-key from claimed witness
   - Witnesses in 39-ref set

5. CORE OBJECTIVE
   Re-key DIVERGENT fields from claimed witness verbatim, keep NOT_FOUND as R-B labelled retellings where no witness, update coverage_note honest, allowlist, metrics/bundle/mirror.

6. EXACT DELIVERABLES
   - data/corpus/mazu_yulu.json — re-key zh verbatim, pinyin, coverage_note honest
   - allowlist, metrics, bundle, docs mirror

7. SUB-TASK BREAKDOWN
   1. Fetch CBETA @ dbdea410, extract refs, verify 39/0
   2. Collate before
   3. Re-key
   4. Coverage note
   5. Full gates

8. BRANCH AND TARGET
   Base: main ac57347
   Target: fix/rekey-mazu_yulu
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
    py_compile PASS, validate PASS, build PASS, smoke PASS, diff PASS, structural diff PASS.

15. PR DESCRIPTION
    Summary RE-KEY mazu_yulu, before/after, witnesses, preserve vs change, test results, BANNED COMMANDS followed.

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed.
