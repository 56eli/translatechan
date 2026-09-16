0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/016-rekey-biyanlu_cases.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 54876c4 (RE-KEY baojing_sanmei merged).

1. TASK TITLE AND SCOPE
   RE-KEY 2/10 (major, ~1-2h, single text PR) — biyanlu_cases. One PR, one doc, verbatim re-key 2 single-graph readings. Under Ruling 1 exception, RE-KEY stays one per PR, with BANNED COMMANDS guard rail.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 54876c4, LABEL complete 18/18, RE-KEY 1/10 done
   - .orchestrator/STATE.md — Ruling 1 exception, Ruling 3
   - .orchestrator/PHASE2_PLAN.md rank 68 RE-KEY: biyanlu_cases 2 of 22 MINOR fields are NOT witness text — 築 in case 10 (0× in pinned XML and ref) and 看 in case 64 (not at that position; witness uses 試舉看 at 60 other places) — other 20 are <g>-glyph residue
   - .orchestrator/PHASE2_PLAN.md rank 69 LABEL: coverage_note calls all 22 MINOR "edition-graphic residue" but measurement splits 20 <g>-glyph /2 project readings, so blanket description 20/22 accurate — wording fix
   - data/corpus/biyanlu_cases.json — cases[10].commentary_zh and cases[64].pointer_zh
   - scripts/collate_corpus.py — T48n2003 witness
   - scripts/test_source_preservation.py — allowlist

3. PROJECT CONTEXT
   Pure LABEL complete, RE-KEY 1/10 done (baojing_sanmei 2/6→6/6, 10 min). Remaining 9 RE-KEY. This doc is large (245KB, 64% bundle) but RE-KEY is only 2 graphs, so single text PR due to memory, major ~1h, guard rails prevent bundle dump.

4. CONFIRMED FACTS
   - biyanlu_cases 373/395 collated, 22 MINOR residual after PR #30 re-key
   - 2 of 22 MINOR are NOT witness text: 築 case10, 看 case64
   - Witness T48n2003 pinned dbdea410, 39 verified
   - Content CJK 75k+ chars, large

5. CORE OBJECTIVE
   Re-key 2 graphs verbatim from T48n2003, update coverage_note wording to reflect 20/22 <g>-glyph /2 project readings, keep pinyin if needed, allowlist, metrics/bundle/mirror, gates green.

6. EXACT DELIVERABLES
   - data/corpus/biyanlu_cases.json — re-key cases[10].commentary_zh 築→witness grapheme (check T48n2003), cases[64].pointer_zh 看→witness (remove or replace with 試舉看 if that's witness), update coverage_note: "22 MINOR fields: 20 <g>-glyph / charDecl residue +2 project readings (築 case10 0× in XML/ref, 看 case64 not at position, witness uses 試舉看 at 60 places)"
   - scripts/test_source_preservation.py — allowlist exact pointers for 2 zh + coverage_note
   - data/project_metrics.json, app_data.js, docs/ mirror — regenerated, content_cjk may change slightly if grapheme replacement length-neutral
   - No STATE.md change, no workflow edit

7. SUB-TASK BREAKDOWN
   1. Fetch CBETA xml-p5 @ dbdea410, sparse-checkout T48n2003, extract refs, verify 39/0 — commit + push (no refs committed)
   2. Run collate before 373/395 — commit + push
   3. Re-key 2 graphs verbatim — commit + push
   4. Update coverage_note wording — commit + push
   5. Full gates — commit + push final

8. BRANCH AND TARGET
   Base: main 54876c4
   Target: fix/rekey-biyanlu_cases
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   git add -A && git commit -qm "fix: biyanlu_cases RE-KEY ..." && git push -qu origin <branch>
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff HEAD~1 without --name-only/--stat when bundle changed. SAFE: --name-only, --stat, --oneline, ls -lh.

10. TECHNICAL REQUIREMENTS
    R-A policy: re-key only from extracted ref text, mechanically, never generate Chinese from memory, keep bundle <2MB+PNG.

11. SAFETY
    No workflow edit, no HUMAN-SOURCE fetch, allowlist set-equal, 630 not re-designated.

12. CLEANUP
    Clean worktree, no committed refs.

13. OUT OF SCOPE
    Do not touch other docs, do not batch.

14. QUALITY CHECKS
    py_compile PASS, validate PASS, build PASS, smoke PASS 35 texts + preservation 0 unauthorized, diff PASS, structural diff PASS, collation after 375/395? Actually 373+2=375/395, 20 MINOR residual.

15. PR DESCRIPTION
    Summary RE-KEY biyanlu_cases 2 graphs, before/after 373/395→375/395, witness T48n2003, preserve vs change, test results, safety, BANNED COMMANDS followed.

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed.
