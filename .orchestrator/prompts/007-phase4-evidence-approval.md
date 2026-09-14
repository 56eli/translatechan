0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/007-phase4-evidence-approval.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Read /tmp/task.md fully. Halt if empty or title mismatches.

1. TASK TITLE AND SCOPE
   Phase 4 — Evidence and approval: owner light/dark desktop/mobile review, docs finalization, frozen tracks close, release checklist. One PR.

2. REQUIRED READING ORDER
   - /tmp/state.md — canonical tracker .orchestrator/STATE.md, Checkpoint-C C-1..C-5, main 3a6ae32, Phases 1-3 merged
   - .orchestrator/PAGES_REVAMP_PROPOSAL_2026-09-13.md — §9 Phase4 exit criteria, §8 risks, §10 C-1..C-5 answers
   - .orchestrator/STATE.md Checkpoint-C section — colors acceptable rest replaceable, serif, subordinate, lazy, full plan
   - README.md, HANDOFF.md, AUDIT.md, ROADMAP.md, WEB_VISION_2026-08-10.md, RESEARCH_RELEASE_PLAN.md, vision.md — current docs after Phases 1-3
   - index.html, app.css, app.js — final system after Phases 1-3 (tokens 43, serif, 0 style=, CSP without unsafe-inline, lazy boot)
   - data/project_metrics.json — corpus 35, CJK 104564/110252, verified 177, etc.
   - OPERATIONS.md — Edits 1-3, Edit1 now closed structurally by O-3, Edit2/3 still open
   - AGENTS.md — 5 rooms, internal IDs, pipeline, 5 gates

3. PROJECT CONTEXT AND OWNER VISION
   Phase A complete (PRs #45,46,47), Phase B Phases 1-3 merged (PRs #48 system+masthead, #49 Reader, #50 secondary rooms + CSP). Token sheet 63→43, serif Source Serif 4, gate structure, Reader minimal sheet + ledger drawer + thin register + render-lazy + 41 style=→0, secondary rooms re-composed, CSP without unsafe-inline, 0 style= literals, 4 CSSOM custom-property writes remain. Phase4 is evidence and approval: owner light/dark desktop/mobile review of live site, HANDOFF §3-§5, README interface section, and dated current-vision doc finalized, frozen tracks PR-B/PR-D closed or re-scoped, release checklist, ask whether required real-browser CI job is approved. No new code beyond docs finalization, but may include final polish (contrast, focus, print). Must keep 5 gates green.

4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES
   - Canonical tracker .orchestrator/STATE.md, Checkpoint-C verbatim, main 3a6ae32.
   - Public scope 5 rooms, internal IDs stay, brand Fake Chan Factory.
   - Pipeline fixed, 5 gates pass, structural diff.
   - CSP now without unsafe-inline, style= count 0, 4 custom-property writes remain as runtime contracts.
   - Bundle <2MB, total ~1.91MB raw.
   - No browser evidence per R-W3 — still no real-browser screenshots, but owner review of live Pages site is Phase4 exit.
   - Frozen tracks: PR-A real-browser still frozen, PR-B CSP hardening folded into Phase3, PR-D perf measure-first folded into Phase2 lazy.
   - This slice: evidence and approval, docs finalization, no new rooms, no bundle split.

5. CORE OBJECTIVE
   Finalize docs (README, HANDOFF, AUDIT, ROADMAP, vision, WEB_VISION successor or dated vision doc), record owner approval, close frozen tracks PR-B/PR-D as folded, update OPERATIONS.md Edit1 as closed structurally, and produce final evidence summary. Exit: owner approval recorded, no self-declared completion, 5 gates green.

6. EXACT DELIVERABLES
   - Modify: README.md — final interface section reflecting Phases 1-3 system (tokens, serif, gate, sheet, drawer, register, secondary rooms, CSP without unsafe-inline, lazy boot).
   - Modify: HANDOFF.md — §3 current design direction final, §5 known gaps update (inline styles 0, CSP without unsafe-inline, lazy boot, bundle <2MB), §6 fixed behavior.
   - Modify: AUDIT.md — current verdict update if needed (CJK 104564/110252, corpus 35, etc.), note PR-B/PR-D folded.
   - Modify: ROADMAP.md — Phase4 measured status update, note Pages revamp complete pending owner visual approval.
   - Modify: vision.md or create WEB_VISION_2026-09-13.md — dated current-vision doc reflecting final system after C-1..C-5 answers.
   - Modify: OPERATIONS.md — update Edit1 as closed structurally by O-3 (git diff --exit-code -- app_data.js docs data/project_metrics.json), note Edit2/3 still open.
   - Modify: .orchestrator/STATE.md — add Phase B completion note, update Task Queue marking Phases 1-3 merged and Phase4 in progress, record owner approval when obtained? Actually owner approval is via ask_user, not in this PR — this PR prepares evidence for approval, approval itself is recorded by orchestrator after owner answers.
   - Modify: app_data.js + docs/ mirror — rebuild if docs prose changes affect metrics? Metrics unchanged, but rebuild to ensure mirror byte-identical.
   - Ensure: no new inline styles, CSP remains without unsafe-inline, 5 gates pass.

7. SUB-TASK BREAKDOWN AND CHECKPOINTS
   1. Measure final system (tokens, style= count 0, CSP, bundle sizes) — commit + push
   2. Update README/HANDOFF/AUDIT/ROADMAP per Phases 1-3 — commit + push
   3. Create or update dated vision doc WEB_VISION_2026-09-13.md — commit + push
   4. Update OPERATIONS.md Edit1 as closed — commit + push
   5. Full gates — commit + push final

8. BRANCH AND TARGET
   Base: main (3a6ae32)
   Target: docs/pages-phase4-evidence
   Orchestrator: arena/01a09829-translatechan
   Align HEAD:
     git fetch --depth 50 origin +docs/pages-phase4-evidence:refs/remotes/origin/_resume
     git checkout -B docs/pages-phase4-evidence refs/remotes/origin/_resume
   If not found:
     git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B docs/pages-phase4-evidence origin/main

9. WORK PERSISTENCE AND PUSH CADENCE
   git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin docs/pages-phase4-evidence
   Open ONE PR at end.

10. TECHNICAL REQUIREMENTS
    Keep 5 rooms, internal IDs, CSP without unsafe-inline, no inline handlers, data-* delegation.
    Keep bundle <2MB.
    style= count 0, CSP without unsafe-inline.
    TEST_COMMAND: python3 scripts/validate_data.py — PASS
    INTEGRATION_TEST_COMMAND: python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs — PASS
    FULL_SUITE_COMMAND: py_compile + validate + build + smoke + diff -rq + structural diff
    MUTATION_TEST_COMMAND: python3 scripts/test_source_review_rules.py — 120 checks PASS
    BUILD_COMMAND: python3 scripts/build_data_bundle.py

11. SAFETY AND COMPATIBILITY RULES
    Must NOT break 5 gates, must NOT change data/corpus, no 630 re-designation, no workflow edits, no Classical Chinese generation, keep 5-room scope.

12. CLEANUP RULES
    No commented code, debug logs, TODO. Clean worktree.

13. STRICT BOUNDARIES / OUT OF SCOPE
    - Do not push to orchestrator branch.
    - Do not split bundle.
    - Do not fetch CBETA.
    - Do not add framework.

14. QUALITY CHECKS
    - py_compile PASS
    - validate_data PASS
    - build_data_bundle PASS
    - smoke_test PASS 35 texts
    - diff -rq PASS
    - structural diff PASS
    - Confirm docs final, token sheet 43, 0 style=, CSP without unsafe-inline, bundle <2MB

15. PR DESCRIPTION REQUIREMENTS
    - Summary: Phase4 evidence and approval preparation
    - Measurements final system
    - Docs updates list
    - Test results
    - Breaking changes none
    - Safety
    - Session Irregularities

16. HARDENING REPORT — Session Irregularities
    Thresholded or None significant.

