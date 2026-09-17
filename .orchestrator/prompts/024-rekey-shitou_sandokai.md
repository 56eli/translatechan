0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/024-rekey-shitou_sandokai.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 5df65d6 (RE-KEY sengzhao_zhaolun merged, law gate PR #68 merged).

1. TASK TITLE AND SCOPE
   RE-KEY 10/10 FINAL (major, ~1-2h, single text PR) — shitou_sandokai. One PR, one doc, verbatim re-key Sandokai from T51n2076? Actually T45n? Under Ruling 1 exception, RE-KEY one per PR, with BANNED COMMANDS guard rail + LAW website NOT beautiful NOT done.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 5df65d6, LABEL 18/18 complete, RE-KEY 9/10 done, LAW gate enforced
   - .orchestrator/RULING_WEBSITE_2026-09-14.md — definitive law: website NOT beautiful NOT done, NOT capable to judge, 100% owner feedback, 1-10 aim 8+
   - PHASE2_PLAN.md rank for shitou_sandokai — claimed T51n2076? Actually Sandokai lives in T51n2076? Check
   - data/corpus/shitou_sandokai.json
   - scripts/collate_corpus.py — T51n2076 witness

3. PROJECT CONTEXT
   Pure LABEL complete, RE-KEY 9/10 done (final doc). After this, Chinese integrity ~100% verified as close as possible. Then utmost importance is website human-readable overhaul per LAW. This doc final RE-KEY.

4. CONFIRMED FACTS
   - shitou_sandokai needs re-key from claimed witness verbatim
   - Witness in 39-ref set, pinned dbdea410
   - LAW: website NOT beautiful NOT done must be in all prompts after 024, and gate test_website_ruling.py must PASS

5. CORE OBJECTIVE
   Re-key shitou_sandokai zh from witness verbatim, update pinyin, coverage_note honest, allowlist, metrics/bundle/mirror. Ensure website ruling gate still PASS.

6. EXACT DELIVERABLES
   - data/corpus/shitou_sandokai.json — re-key zh verbatim, pinyin, coverage_note honest
   - allowlist, metrics, bundle, docs mirror
   - Must still pass test_website_ruling.py

7. SUB-TASK BREAKDOWN
   1. Fetch CBETA @ dbdea410, extract refs, verify 39/0
   2. Collate before
   3. Re-key
   4. Coverage note
   5. Full gates including website ruling gate

8. BRANCH AND TARGET
   Base: main 5df65d6
   Target: fix/rekey-shitou_sandokai
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed. SAFE: --name-only, --stat, --oneline, ls -lh.
   LAW: Website is NOT beautiful, NOT done. Orchestrator/agents NOT capable to judge. Must rely on owner feedback. This prompt is Chinese integrity, not website, so no 1-10 question required yet, but must not claim website beautiful/done.

10. TECHNICAL REQUIREMENTS
    R-A policy: re-key only from extracted ref, mechanically.

11. SAFETY
    No workflow edit, allowlist set-equal, 630 not re-designated, website ruling gate must PASS.

12. CLEANUP
    Clean worktree, no committed refs.

13. OUT OF SCOPE
    Do not touch other docs, do not claim website beautiful/done.

14. QUALITY CHECKS
    py_compile PASS, validate PASS, build PASS, smoke PASS, diff PASS, structural diff PASS, preservation PASS, review rules PASS, website ruling PASS, collation after higher.

15. PR DESCRIPTION
    Summary RE-KEY shitou_sandokai, before/after, witnesses, preserve vs change, test results including website ruling gate PASS, BANNED COMMANDS followed, LAW respected.

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed, website ruling gate PASS.
