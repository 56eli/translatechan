0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/009-label-bundle-1-yuanwu-yunmen-zhengdao.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Read /tmp/task.md fully. Halt if empty or title mismatches.
   Verify main is b1e303f (web polish bundle merged).

1. TASK TITLE AND SCOPE
   LABEL bundle 1 (minor, <2h) — 3 pure LABEL docs under Ruling 1 exception 2026-09-14: yuanwu_letters, yunmen_yulu, zhengdao_ge. One PR with 3 separate commits, no Chinese re-key, only honest disclosure notes. This is the first of 6 LABEL bundles (18 pure LABEL docs /3).

2. REQUIRED READING ORDER
   - /tmp/state.md — canonical tracker .orchestrator/STATE.md, main b1e303f, Task Queue 010 Merged, 011 remaining, Ruling 1 exception 2026-09-14 recorded
   - .orchestrator/STATE.md — Standing Decisions 2026-09-12 four rulings + exception 2026-09-14: LABEL-only up to 3 per PR, RE-KEY one per PR, no HUMAN-SOURCE/OUT-OF-CBETA batching, one commit per doc, per-doc measurements required
   - .orchestrator/PHASE2_PLAN.md §5 — kind census LABEL 51 / RE-KEY 11, unique docs 28, pure LABEL 18, mixed 10
   - .orchestrator/WITNESS_INVENTORY*.md — per-doc findings:
     * yuanwu_letters rank 9: source-integrity 0/2 both letter fields absent from both claimed witnesses T47n1997/X69n1357 and from all 39 refs, no notes disclose it
     * yunmen_yulu rank 45: source-integrity 0/12 verbatim in T47n1988 (correct work 雲門匡真禪師廣錄, 11 NOT_FOUND), coverage note "from T1988" unsupported
     * zhengdao_ge rank 70: labeling metadata-only, root title_zh is project heading 永嘉真覺大師 證道歌 vs witness 永嘉證道歌, no note, content 6/6 verbatim
   - sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json + sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json — flagged counts per doc
   - data/corpus/yuanwu_letters.json, yunmen_yulu.json, zhengdao_ge.json — current notes (check for existing cbeta_note/coverage_note)
   - scripts/collate_corpus.py — WITNESS map, WITNESS_NOTES, how to run COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc <key>
   - scripts/test_source_preservation.py — allowlist mechanism, pinned base commit 3cc7a8e9681e
   - scripts/validate_data.py — doc-truthfulness gate, 50/39/23/17 census, P2.7 depth (optional jsonschema + cross_refs + evidence_source enum)
   - scripts/test_source_review_rules.py — 138 checks after PR #52, §15 orphan note gate, §16 web polish hygiene
   - AGENTS.md — one agent at a time, no .github/workflows edits, internal IDs stay, 5 rooms smoke-guarded, CBETA DR-1 pinned revision dbdea410 read-only
   - HANDOFF.md §5 — release blockers, presentation, bundle init, etc.

3. PROJECT CONTEXT AND OWNER VISION
   Phase A + Phase B + web polish bundle merged to main b1e303f. W1 queue 28 docs (18 pure LABEL minor +10 mixed major) remains. Ruling 1 originally forbade batching LABEL/RE-KEY (one doc per PR) to ensure precise work without contamination. Owner granted exception 2026-09-14: LABEL-only up to 3 per PR (minor ~1.5h), RE-KEY one per PR (major 1-2h), no HUMAN-SOURCE/OUT-OF-CBETA batching, one commit per doc, per-doc measurements required. Risk assessed as LOW for LABEL-only (no Chinese change, no collation cross-talk, only allowlist + review overhead). This prompt is first LABEL bundle (3 smallest docs, 1 row each, total 3 rows) to demonstrate exception works within 2h limit, then queue clears in 6+10=16 PRs instead of 28.

4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES
   - Canonical tracker .orchestrator/STATE.md, Ruling 1 exception recorded verbatim 2026-09-14.
   - Public scope 5 rooms, internal IDs stay, brand Fake Chan Factory, humor only in Robo names.
   - Pipeline fixed, 5 gates + structural diff git diff --exit-code -- app_data.js docs data/project_metrics.json, plus 138 rule checks.
   - Current main b1e303f: py_compile PASS, validate_data PASS (3 lineage warnings + jsonschema missing warning + 7 protagonist warnings), build 1,642,473 B, smoke 35 texts + lazy + preservation, diff PASS, structural diff PASS, 138 checks PASS, 0 style=, CSP without unsafe-inline, tokens 43, serif Source Serif 4, bundle <2MB + PNG 71KB.
   - W1 authoritative register 630 flagged, dated measurement 532 flagged on current main, statuses 1 /32 /2, complete 0.
   - These 3 docs are pure LABEL (no RE-KEY): yuanwu_letters 0/2 NOT_FOUND, yunmen_yulu 0/12 DIVERGENT 1 + NOT_FOUND 11, zhengdao_ge 6/6 verbatim but title metadata project heading.
   - No CBETA fetch for LABEL (no re-key), but may run collation harness read-only to measure before/after (0/2, 0/12, 6/6 unchanged).
   - No workflow edits, no OUT-OF-CBETA sourcing, no platform_sutra decision.
   - Each doc must be separate commit with its own collation note.

5. CORE OBJECTIVE
   Add honest disclosure notes to 3 pure LABEL docs, no Chinese re-key:
   - yuanwu_letters: add coverage_note stating both letter fields absent from claimed witnesses T47n1997/X69n1357 and from all 39 refs, retellings retained with claim removed, plus cbeta_note if needed. Keep existing fields, add note.
   - yunmen_yulu: add coverage_note stating 0/12 verbatim in correct work T47n1988 雲門匡真禪師廣錄, compressed retelling with formulaic proximity to X80n1565 only, honest disclosure.
   - zhengdao_ge: add recension_note or coverage_note stating root title_zh is project heading 永嘉真覺大師 證道歌 vs witness 永嘉證道歌, content 6/6 verbatim, title metadata project composition.
   All notes must be honest, not invent witness, not claim collation that does not exist. Update allowlist, regenerate metrics/bundle/mirror, keep gates green. One PR, 3 commits.

6. EXACT DELIVERABLES
   - Modify: data/corpus/yuanwu_letters.json — add coverage_note (or cbeta_note if more appropriate) with honest disclosure per PHASE2_PLAN rank 9: "0/2 content fields verbatim in claimed witnesses T47n1997/X69n1357 and in all 39 pinned refs (dbdea410), project retellings retained with witness claim removed, no measured source in CBETA set". Keep zh fields untouched.
   - Modify: data/corpus/yunmen_yulu.json — add coverage_note per rank 45: "0/12 verbatim in correct work T47n1988 雲門匡真禪師廣錄 (11 NOT_FOUND +1 DIVERGENT), compressed retelling with formulaic proximity to X80n1565 only, no verbatim carrier in 39 refs". Keep zh fields untouched.
   - Modify: data/corpus/zhengdao_ge.json — add recension_note or coverage_note per rank 70: "Root title_zh 永嘉真覺大師 證道歌 is project heading, witness attested title 永嘉證道歌 per T48n2014, content 6/6 verbatim". Keep zh fields untouched.
   - Modify: scripts/test_source_preservation.py — extend allowlist with exact JSON pointers changed (e.g., .coverage_note, .recension_note, .cbeta_note for each doc). Must be set-equal, no extra pointers.
   - Modify: data/project_metrics.json — regenerated via validate_data.py, CJK totals will increase slightly due to note strings (+~ few CJK), content_cjk unchanged (no Chinese change), all_corpus_cjk increases by note length.
   - Modify: app_data.js + docs/ mirror — regenerated via build_data_bundle.py, byte-identical docs/data vs data.
   - Modify: .orchestrator/STATE.md — record Ruling 1 exception verbatim in Standing Decisions section if not already present on main (check main b1e303f STATE.md, add new subsection "Ruling 1 exception 2026-09-14" with verbatim quote).
   - Modify: .orchestrator/local/ORCHESTRATOR_STATE.md — not in this PR (orchestrator branch only), but PR description must reference exception.
   - No modification to .github/workflows/*, no CBETA XML commit, no OUT-OF-CBETA fetch.

7. SUB-TASK BREAKDOWN AND CHECKPOINTS
   1. Measure before: COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc yuanwu_letters, --doc yunmen_yulu, --doc zhengdao_ge (if refs available, else use register JSON), record content_fields_collated / total, flagged counts. Also grep -n "_note" data/corpus/<doc>.json. Commit + push
   2. Doc 1 yuanwu_letters: add honest note, update allowlist, run validate_data.py, build_data_bundle.py, test_source_review_rules.py, commit "fix: yuanwu_letters LABEL honest disclosure (0/2)" + push
   3. Doc 2 yunmen_yulu: same, commit "fix: yunmen_yulu LABEL honest disclosure (0/12)" + push
   4. Doc 3 zhengdao_ge: same, commit "fix: zhengdao_ge LABEL title metadata disclosure (6/6)" + push
   5. Update .orchestrator/STATE.md with Ruling 1 exception verbatim if not present — commit + push
   6. Full gates: py_compile, validate_data, build_data_bundle, smoke_test, diff -rq, structural diff, test_source_review_rules (should be 138+3=141 checks) — commit + push final

8. BRANCH AND TARGET
   Base: main (b1e303f)
   Target: fix/label-bundle-1-yuanwu-yunmen-zhengdao
   Orchestrator: arena/01a09829-translatechan
   Align HEAD:
     git fetch --depth 50 origin +fix/label-bundle-1-yuanwu-yunmen-zhengdao:refs/remotes/origin/_resume || true
     git checkout -B fix/label-bundle-1-yuanwu-yunmen-zhengdao refs/remotes/origin/_resume 2>/dev/null || git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B fix/label-bundle-1-yuanwu-yunmen-zhengdao origin/main

9. WORK PERSISTENCE AND PUSH CADENCE
   After each sub-task: git add -A && (git diff --cached --quiet || git commit -qm "chore: <sub-task>") && git push -qu origin fix/label-bundle-1-yuanwu-yunmen-zhengdao
   Open ONE PR at end with 3 commits (one per doc) + 1 commit for STATE.md exception if needed.

10. TECHNICAL REQUIREMENTS
    - Keep 5 rooms, internal IDs, CSP, tokens 43, serif, lazy boot, bundle <2MB+PNG.
    - No Chinese re-key, no 630 re-designation, no workflow edit, no CBETA XML commit.
    - Each doc separate commit, per-doc collation before/after in PR description (content_fields_collated unchanged for LABEL).
    - Allowlist must be exact set-equal.
    - Notes must be honest, not invent witness, not claim collation.
    - Bundle regenerated deterministically.
    TEST_COMMAND: python3 scripts/validate_data.py
    INTEGRATION_TEST_COMMAND: python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs
    FULL_SUITE_COMMAND: py_compile + validate + build + smoke + diff -rq + structural diff + test_source_review_rules

11. SAFETY AND COMPATIBILITY RULES
    - Must NOT change data/corpus/*.json zh fields (Chinese source), only add *_note fields.
    - Must NOT weaken validator, only add allowlist pointers.
    - Must NOT edit .github/workflows/*, no OUT-OF-CBETA fetch.
    - Must NOT generate source-looking Chinese.
    - Keep sessions/ append-only.

12. CLEANUP RULES
    No commented code, debug logs, TODO, scratch scripts. Clean worktree.

13. STRICT BOUNDARIES / OUT OF SCOPE
    - Do not push to orchestrator branch.
    - Do not touch other corpus docs beyond these 3.
    - Do not re-key Chinese (RE-KEY stays separate).
    - Do not batch HUMAN-SOURCE or OUT-OF-CBETA.
    - Do not change tokens, serif, gate, Reader sheet.

14. QUALITY CHECKS
    - py_compile PASS
    - validate_data PASS (3 lineage warnings + jsonschema missing + protagonist warnings, 0 errors)
    - build_data_bundle PASS 1,642,473 B (Chinese unchanged, only notes)
    - smoke_test PASS 35 texts + source-preservation (0 unauthorized) + render-lazy
    - diff -rq PASS
    - structural diff PASS
    - test_source_review_rules 141 checks PASS (138 +3 new docs documented)
    - Confirm: yuanwu_letters, yunmen_yulu, zhengdao_ge each have new honest note, allowlist exact, metrics CJK all-string increased by note length, content_cjk unchanged, collation before/after unchanged (0/2, 0/12, 6/6)

15. PR DESCRIPTION REQUIREMENTS
    - Summary: LABEL bundle 1 (3 docs, minor, <2h) under Ruling 1 exception 2026-09-14
    - Per-doc measurements: before/after collation (content_fields_collated / total, flagged), note added, allowlist pointers
    - Preserve vs Change: preserve Chinese, collation, 630, 5 rooms, internal IDs; change notes only
    - Test results: py_compile, validate, build, smoke, diff, structural diff, 141 checks
    - Safety: no Chinese change, no 630 re-designation, no workflow edit, no CBETA fetch
    - Breaking changes: none
    - Session Irregularities: note branch mismatch advisory vs session-fixed branch per AGENTS.md

16. HARDENING REPORT — Session Irregularities
    Record any rewind hazard, credential drop, branch mismatch, or measurement drift. Target branch fix/label-bundle-1-yuanwu-yunmen-zhengdao is advisory, session fixed to arena/* per AGENTS.md.
