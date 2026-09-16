0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/017-rekey-bodhidharma_erru.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is a2a4187 (RE-KEY biyanlu_cases merged).

1. TASK TITLE AND SCOPE
   RE-KEY 3/10 (major, ~1-2h, single text PR) — bodhidharma_erru. One PR, one doc, verbatim re-key 4 DIVERGENT fields + 1 NOT_FOUND? Actually 1/6 verbatim, 4 DIVERGENT, 1 NOT_FOUND. Under Ruling 1 exception, RE-KEY one per PR, with BANNED COMMANDS guard rail.

2. REQUIRED READING ORDER
   - /tmp/state.md — main a2a4187, LABEL complete, RE-KEY 2/10 done
   - PHASE2_PLAN.md rank 52 RE-KEY: bodhidharma_erru 1/6 verbatim, 4 DIVERGENT (0.949-0.973 single graphs + framing), 1 NOT_FOUND re-arranged, rank 53 LABEL zero notes, rank 43 LABEL attribution T2009 title 少室六門 third section
   - data/corpus/bodhidharma_erru.json
   - scripts/collate_corpus.py — T48n2009 witness, T51n2076 second carrier 2/6

3. PROJECT CONTEXT
   Pure LABEL complete, RE-KEY 2/10 done. Remaining 8 RE-KEY major. This doc small 6 fields, single text PR, guard rails prevent bundle dump (10 min vs 24h proven).

4. CONFIRMED FACTS
   - bodhidharma_erru 1/6 verbatim against T48n2009, 4 DIVERGENT, 1 NOT_FOUND
   - Witness T48n2009 @ dbdea410, 39 verified
   - Second carrier T51n2076 2/6 verbatim, not mentioned

5. CORE OBJECTIVE
   Re-key 4 DIVERGENT fields verbatim from T48n2009 (or T51n2076 if better), keep 1 NOT_FOUND as labelled retelling? Actually rank 52 says re-key covers DIVERGENT, NOT_FOUND? Check: rank 52 RE-KEY for bodhidharma_erru says re-key 4 DIVERGENT + 1 NOT_FOUND? Actually text: "1/6 verbatim against T48n2009; four fields at 0.949-0.973 differ by single graphs and framing (但/俱, 言/文, 都/皆; enumeration headings project additions) and the 三無所求行 field is re-arranged (38/58 8-graph windows, 13/42 24-graph windows in witness)" — so re-key 4 DIVERGENT + maybe keep NOT_FOUND as labelled? But prompt says RE-KEY.

6. EXACT DELIVERABLES
   - data/corpus/bodhidharma_erru.json — re-key 4 DIVERGENT .sections[].dialogue[].zh verbatim from T48n2009, update pinyin, add coverage_note honest: "1/6 verbatim against T48n2009, 4 DIVERGENT single-graph + framing, 三無所求行 re-arranged 38/58 windows, second carrier T51n2076 2/6 verbatim not mentioned, labeling zero notes"
   - allowlist, metrics, bundle, docs mirror

7. SUB-TASK BREAKDOWN
   1. Fetch CBETA @ dbdea410, extract refs, verify 39/0 — commit + push
   2. Collate before 1/6 — commit + push
   3. Re-key 4 fields — commit + push
   4. Coverage note — commit + push
   5. Full gates — commit + push

8. BRANCH AND TARGET
   Base: main a2a4187
   Target: fix/rekey-bodhidharma_erru
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   git add -A && git commit -qm "fix: bodhidharma_erru RE-KEY ..." && git push -qu origin <branch>
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed. SAFE: --name-only, --stat, --oneline, ls -lh.

10. TECHNICAL REQUIREMENTS
    R-A policy: re-key only from extracted ref, mechanically, never generate Chinese.

11. SAFETY
    No workflow edit, allowlist set-equal, 630 not re-designated.

12. CLEANUP
    Clean worktree, no committed refs.

13. OUT OF SCOPE
    Do not touch other docs.

14. QUALITY CHECKS
    py_compile PASS, validate PASS, build PASS, smoke PASS, diff PASS, structural diff PASS, collation after should be higher.

15. PR DESCRIPTION
    Summary RE-KEY bodhidharma_erru, before/after, witness, preserve vs change, test results, BANNED COMMANDS followed.

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed.
