0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/019-rekey-dahui_hongzhi.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 813ac18 (RE-KEY chuandenglu merged).

1. TASK TITLE AND SCOPE
   RE-KEY 5/10 (major, ~1-2h, single text PR) — dahui_hongzhi. One PR, one doc, verbatim re-key 默照銘 tail + 4 看話 letters. Under Ruling 1 exception, RE-KEY one per PR, with BANNED COMMANDS guard rail.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 813ac18, LABEL complete, RE-KEY 4/10 done
   - PHASE2_PLAN.md rank 7 RE-KEY: dahui_hongzhi 默照銘 fields match T48n2001 only through 露月星河 then diverge — 雪覆夜沼 etc occur in no ref, 4 看話 letter fields 0/4 verbatim in T47n1998A/B, rank 6 CITATION done, rank 42 LABEL title names recipient 張九成 not in T47n1998A
   - data/corpus/dahui_hongzhi.json — 6 fields 0/6
   - scripts/collate_corpus.py — T47n1998A/B + T48n2001 witnesses

3. PROJECT CONTEXT
   Pure LABEL complete, RE-KEY 4/10 done. Remaining 6 RE-KEY. This doc small 6 fields but fabricated tail, single text PR, guard rails.

4. CONFIRMED FACTS
   - dahui_hongzhi 0/6, 默照銘 tail fabricated, 4 letters 0/4
   - Witnesses T47n1998A/B + T48n2001 in 39-ref set, pinned dbdea410
   - Needs re-key from T48n2001 for 默照銘 and T47n1998A/B for letters

5. CORE OBJECTIVE
   Re-key 默照銘 fields from T48n2001 whole, re-key 4 letters from T47n1998A/B, update coverage_note honest, allowlist, metrics/bundle/mirror.

6. EXACT DELIVERABLES
   - data/corpus/dahui_hongzhi.json — re-key 2 默照銘 zh from T48n2001 verbatim, re-key 4 letters zh from T47n1998A/B verbatim, update pinyin, add coverage_note: "0/6→6/6 after re-key, 默照銘 tail previously fabricated (雪覆夜沼 etc 0 hits in 39 refs) now verbatim T48n2001, 4 letters 0/4→4/4 verbatim T47n1998A/B, recipient 張九成 not in T47n1998A disclosed"
   - allowlist, metrics, bundle, docs mirror

7. SUB-TASK BREAKDOWN
   1. Fetch CBETA @ dbdea410, extract refs, verify 39/0
   2. Collate before 0/6
   3. Re-key 6 fields
   4. Coverage note
   5. Full gates

8. BRANCH AND TARGET
   Base: main 813ac18
   Target: fix/rekey-dahui_hongzhi
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   git add -A && git commit -qm "fix: dahui_hongzhi RE-KEY ..." && git push -qu origin <branch>
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
    py_compile PASS, validate PASS, build PASS, smoke PASS, diff PASS, structural diff PASS, collation after 6/6.

15. PR DESCRIPTION
    Summary RE-KEY dahui_hongzhi, before/after, witnesses, preserve vs change, test results, BANNED COMMANDS followed.

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed.
