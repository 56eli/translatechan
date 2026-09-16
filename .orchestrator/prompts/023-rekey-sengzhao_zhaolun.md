0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/023-rekey-sengzhao_zhaolun.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 2b3e2b5 (RE-KEY mazu_yulu merged).

1. TASK TITLE AND SCOPE
   RE-KEY 9/10 (major, ~1-2h, single text PR) — sengzhao_zhaolun. One PR, one doc, verbatim re-key Zhao Lun from T45n1858. Under Ruling 1 exception, RE-KEY one per PR, with BANNED COMMANDS guard rail.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 2b3e2b5, LABEL complete, RE-KEY 8/10 done
   - PHASE2_PLAN.md rank 4 RE-KEY: sengzhao_zhaolun 0/12? Actually rank 4 says all 12 content fields DIVERGENT 0.85-0.95 single graphs + framing, claimed T45n1858, rank 10 CITATION etc
   - data/corpus/sengzhao_zhaolun.json
   - scripts/collate_corpus.py — T45n1858 witness

3. PROJECT CONTEXT
   Pure LABEL complete, RE-KEY 8/10 done. Remaining 2 RE-KEY. Single text PR, moderate size.

4. CONFIRMED FACTS
   - sengzhao_zhaolun 0/12? DIVERGENT, needs re-key from T45n1858
   - Witness in 39-ref set, pinned dbdea410

5. CORE OBJECTIVE
   Re-key 12 fields from T45n1858 verbatim, update pinyin, coverage_note honest, allowlist, metrics/bundle/mirror.

6. EXACT DELIVERABLES
   - data/corpus/sengzhao_zhaolun.json — re-key zh from T45n1858, pinyin, coverage_note: "0/12→12/12 after re-key, previously DIVERGENT 0.85-0.95 single graphs + framing, now verbatim T45n1858"
   - allowlist, metrics, bundle, docs mirror

7. SUB-TASK BREAKDOWN
   1. Fetch CBETA @ dbdea410, extract refs, verify 39/0
   2. Collate before
   3. Re-key
   4. Coverage note
   5. Full gates

8. BRANCH AND TARGET
   Base: main 2b3e2b5
   Target: fix/rekey-sengzhao_zhaolun
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
    Summary RE-KEY sengzhao_zhaolun, before/after, witnesses, preserve vs change, test results, BANNED COMMANDS followed.

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed.
