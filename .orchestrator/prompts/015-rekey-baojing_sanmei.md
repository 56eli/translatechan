0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/015-rekey-baojing_sanmei.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 3b68483 (LABEL complete 18/18).

1. TASK TITLE AND SCOPE
   RE-KEY 1 of 10 (major, ~1-2h, single text PR) — baojing_sanmei. One PR, one doc, verbatim re-key from pinned CBETA witness. Under Ruling 1 exception, RE-KEY stays one per PR.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 3b68483, pure LABEL complete, remaining 10 RE-KEY
   - .orchestrator/STATE.md — Ruling 1 exception verbatim, Ruling 3 (fabricated text replaced where witness carries it)
   - .orchestrator/PHASE2_PLAN.md rank 26 RE-KEY: baojing_sanmei 4/6 stanzas diverge, carriers agree against data — 銀碗盛雪/來機便赴/背觸共忌/如面臨鏡容色相覷 occur in no ref, carriers read 銀盌/銀怨盛雪…來機亦赴…背觸俱非…如臨寶鏡形影相覩
   - .orchestrator/WITNESS_INVENTORY_T48_T51.md — baojing_sanmei block, witness T47n1986A/B + X80n1565
   - sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json — flagged entries for baojing_sanmei
   - data/corpus/baojing_sanmei.json — current zh fields
   - scripts/collate_corpus.py, collate_refs.py — pinned revision dbdea410, 39 refs
   - scripts/test_source_preservation.py — allowlist
   - AGENTS.md — DR-1 CBETA read-only pinned revision verification, no commit of refs

3. PROJECT CONTEXT
   Pure LABEL complete 18/18 main 3b68483, bundle 1,657,183 B, 138 checks PASS. Remaining RE-KEY 10 docs (major). This is first RE-KEY, small doc 6 stanzas, ideal for single text PR due to memory. Guard rails: BANNED git show without --name-only/--stat on bundle commits.

4. CONFIRMED FACTS
   - baojing_sanmei 2/6 verbatim, 4/6 DIVERGENT (0.93-0.97), carriers T47n1986A/B and X80n1565 agree against data
   - Witnesses in 39-ref set, pinned revision dbdea410, 39 verified /0 drift
   - No HUMAN-SOURCE, in-set witness exists, so RE-KEY per R-A policy
   - Content CJK 6 stanzas, small

5. CORE OBJECTIVE
   Re-key 4 divergent stanzas verbatim from pinned witness (choose T47n1986B as primary, document choice in coverage_note), keep 2 exact stanzas untouched, update pinyin if reading changes, update coverage_note honest, allowlist, metrics/bundle/mirror, gates green. One PR, one doc, one commit? Actually RE-KEY may need 1 commit per doc, but can be 1 commit total for single doc.

6. EXACT DELIVERABLES
   - data/corpus/baojing_sanmei.json — re-key 4 stanzas .stanzas[].zh from witness verbatim (NFKC-normalized, preserve witness graphemes), update .stanzas[].pinyin syllable-by-syllable if needed, add/extend coverage_note stating re-key from T47n1986B (or A) and that carriers agree, and that data's readings 銀碗盛雪 etc have 0 hits in all 39 refs
   - scripts/test_source_preservation.py — allowlist with exact pointers for re-keyed .zh + .pinyin + .coverage_note
   - data/project_metrics.json, app_data.js, docs/ mirror — regenerated, content_cjk may change slightly if grapheme count differs (e.g., 銀碗 vs 銀盌)
   - No STATE.md change (exception already recorded), no workflow edit

7. SUB-TASK BREAKDOWN
   1. Fetch CBETA xml-p5 @ dbdea410, sparse-checkout T47n1986A/B + X80n1565, extract refs via collate_refs.py, verify digests 39 verified — commit + push (no refs committed)
   2. Run COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc baojing_sanmei, record before collation 2/6 — commit + push
   3. Re-key 4 stanzas verbatim from witness, update pinyin — commit + push
   4. Update coverage_note honest — commit + push
   5. Full gates: py_compile, validate_data, build_data_bundle, smoke_test, diff -rq, structural diff, test_source_review_rules, test_source_preservation — commit + push final

8. BRANCH AND TARGET
   Base: main 3b68483
   Target: fix/rekey-baojing_sanmei
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   git add -A && git commit -qm "fix: baojing_sanmei RE-KEY ..." && git push -qu origin <branch>
   BANNED: git show <sha> without --name-only/--stat, git show <sha> | head, git diff HEAD~1 without --name-only/--stat when bundle changed. Use SAFE: --name-only, --stat, --oneline, ls -lh.

10. TECHNICAL REQUIREMENTS
    Keep 5 rooms, internal IDs, CSP, tokens 43, bundle <2MB+PNG, 0 style=, R-A policy: re-key only from extracted CBETA ref text, mechanically, never generate Chinese from memory.

11. SAFETY
    No workflow edit, no HUMAN-SOURCE fetch, no source-looking Chinese generation, allowlist set-equal, 630 not re-designated.

12. CLEANUP
    No scratch scripts, no debug output, clean worktree, no committed refs (refs in /tmp only).

13. OUT OF SCOPE
    Do not touch other docs, do not batch, do not change visual system.

14. QUALITY CHECKS
    py_compile PASS, validate PASS, build PASS 1.6MB, smoke PASS 35 texts + preservation 0 unauthorized, diff PASS, structural diff PASS, test_source_review_rules 138+ PASS, collation after should be 6/6 or documented residual.

15. PR DESCRIPTION
    Summary RE-KEY baojing_sanmei, before/after collation 2/6→6/6, witness chosen, grapheme changes, pinyin changes, preserve vs change, test results, safety.

16. HARDENING REPORT
    Record rewind hazard, branch mismatch, and that BANNED COMMANDS rule was followed (no bundle dump).
