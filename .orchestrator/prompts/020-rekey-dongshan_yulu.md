0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/020-rekey-dongshan_yulu.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is ddb9576 (RE-KEY dahui_hongzhi merged).

1. TASK TITLE AND SCOPE
   RE-KEY 6/10 (major, ~1-2h, single text PR) — dongshan_yulu. One PR, one doc, verbatim re-key Five Ranks verses + commentary. Under Ruling 1 exception, RE-KEY one per PR, with BANNED COMMANDS guard rail (proven 10x faster, 10 min vs 24h).

2. REQUIRED READING ORDER
   - /tmp/state.md — main ddb9576, LABEL complete 18/18, RE-KEY 5/10 done
   - PHASE2_PLAN.md ranks 27-28 RE-KEY: dongshan_yulu all five five_ranks.commentary_zh are paraphrases verbatim in no ref — 正位即是空界 vs 背理就事, source lives in T47n1987B 曹洞語錄, and 4/5 five_ranks verse_zh follow recension absent from CBETA — 偏中正 白頭宮女卸殘妝 has 0 hits, claimed T47n1986B carries 失曉老婆逢古鏡, river-story 過水睹影 vs 涉水睹影
   - data/corpus/dongshan_yulu.json — five_ranks
   - scripts/collate_corpus.py — T47n1987B, T47n1986A/B witnesses

3. PROJECT CONTEXT
   Pure LABEL complete, RE-KEY 5/10 done. Remaining 5 RE-KEY. This doc moderate 5 ranks + verses, single text PR, guard rails.

4. CONFIRMED FACTS
   - dongshan_yulu 0/12? Actually content_fields_collated 0/12? Check register: 0/12 verbatim in T47n1988 correct work, but RE-KEY targets are T47n1987B for commentary and T47n1986A/B for verses
   - Witnesses in 39-ref set, pinned dbdea410

5. CORE OBJECTIVE
   Re-key 5 commentary_zh from T47n1987B, re-key 4 verse_zh from T47n1986B (失曉老婆 etc), keep river-story maybe re-key 過水睹影, update coverage_note honest, allowlist, metrics/bundle/mirror.

6. EXACT DELIVERABLES
   - data/corpus/dongshan_yulu.json — re-key five_ranks[].commentary_zh verbatim from T47n1987B, re-key five_ranks[].verse_zh verbatim from T47n1986B (or A where appropriate), update pinyin, add coverage_note: "Five Ranks commentary previously paraphrases verbatim in no ref (正位即是空界 vs witness 正位即空界 etc), source T47n1987B 曹洞語錄, verses previously 白頭宮女 recension 0 hits in 39 refs, now re-keyed to T47n1986B 失曉老婆逢古鏡 recension, river-story 涉水→過水 per witness"
   - allowlist, metrics, bundle, docs mirror

7. SUB-TASK BREAKDOWN
   1. Fetch CBETA @ dbdea410, extract refs, verify 39/0
   2. Collate before
   3. Re-key commentary + verses
   4. Coverage note
   5. Full gates

8. BRANCH AND TARGET
   Base: main ddb9576
   Target: fix/rekey-dongshan_yulu
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   git add -A && git commit -qm "fix: dongshan_yulu RE-KEY ..." && git push -qu origin <branch>
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
    Summary RE-KEY dongshan_yulu, before/after, witnesses, preserve vs change, test results, BANNED COMMANDS followed.

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed.
