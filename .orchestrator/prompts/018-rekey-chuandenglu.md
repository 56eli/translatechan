0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/018-rekey-chuandenglu.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 9e444e8 (RE-KEY bodhidharma_erru merged).

1. TASK TITLE AND SCOPE
   RE-KEY 4/10 (major, ~1-2h, single text PR) — chuandenglu. One PR, one doc, verbatim re-key where witness carries passage. Under Ruling 1 exception, RE-KEY one per PR, with BANNED COMMANDS guard rail (proven 10x faster).

2. REQUIRED READING ORDER
   - /tmp/state.md — main 9e444e8, LABEL complete 18/18, RE-KEY 3/10 done
   - PHASE2_PLAN.md rank 25 LABEL s0.d2 no k=12 window, rank 36 RE-KEY attribution three works carry parts — claimed T51n2076, probe X80n1565 best for s0.d3 and s1.d1, uncited T48n2001 alone carries s1.d0 whole 17/17 @66,315, rank 59 LABEL no coverage note, 1/6 collated credit rests on five-graph line 一曰圖作佛
   - data/corpus/chuandenglu.json — 6 fields, 1/6 collated
   - scripts/collate_corpus.py — T51n2076, X80n1565, T48n2001 witnesses

3. PROJECT CONTEXT
   Pure LABEL complete, RE-KEY 3/10 done (baojing_sanmei 2/6→6/6, biyanlu_cases 373→375, bodhidharma_erru 1/6→6/6). Remaining 7 RE-KEY. This doc small 6 fields, single text PR, guard rails prevent 24h stall.

4. CONFIRMED FACTS
   - chuandenglu 1/6 verbatim, DIVERGENT 2, NOT_FOUND 3, single collated field five-graph line
   - Three works carry parts: claimed T51n2076, probe X80n1565, uncited T48n2001 alone carries s1.d0 whole
   - Witnesses in 39-ref set

5. CORE OBJECTIVE
   Re-key s1.d0 from T48n2001 whole 17/17 @66,315, re-key s0.d3 and s1.d1 from X80n1565 best, keep s0.d2 as labelled retelling? Actually rank 25 LABEL says s0.d2 has no k=12 window in any ref (paraphrase) — keep as labelled retelling with note. Update coverage_note honest, allowlist, metrics/bundle/mirror.

6. EXACT DELIVERABLES
   - data/corpus/chuandenglu.json — re-key 3 fields verbatim from witnesses (T48n2001 for s1.d0, X80n1565 for s0.d3/s1.d1), keep s0.d2 as project paraphrase with editorial_note label, update coverage_note: "1/6 collated (一曰圖作佛 five-graph), three works carry parts: T51n2076 claimed, X80n1565 best for s0.d3/s1.d1, T48n2001 alone carries s1.d0 whole 17/17 @66,315, s0.d2 no k=12 window in any ref paraphrase retained"
   - allowlist, metrics, bundle, docs mirror

7. SUB-TASK BREAKDOWN
   1. Fetch CBETA @ dbdea410, extract refs, verify 39/0
   2. Collate before 1/6
   3. Re-key 3 fields
   4. Coverage note
   5. Full gates

8. BRANCH AND TARGET
   Base: main 9e444e8
   Target: fix/rekey-chuandenglu
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   git add -A && git commit -qm "fix: chuandenglu RE-KEY ..." && git push -qu origin <branch>
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
    py_compile PASS, validate PASS, build PASS, smoke PASS, diff PASS, structural diff PASS, collation after higher.

15. PR DESCRIPTION
    Summary RE-KEY chuandenglu, before/after, witnesses, preserve vs change, test results, BANNED COMMANDS followed.

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed.
