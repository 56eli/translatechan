0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/005-phase2-reader.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Read /tmp/task.md fully. Halt if empty or title mismatches.

1. TASK TITLE AND SCOPE
   Phase 2 — Reader: sheet redesign, ledger drawer, case rail, inline styles → classes, render-lazy hidden rooms (C-4). One PR.

2. REQUIRED READING ORDER
   - /tmp/state.md — canonical tracker .orchestrator/STATE.md, Checkpoint-C C-1..C-5, main 0d02c4c, Phase1 merged
   - .orchestrator/PAGES_REVAMP_PROPOSAL_2026-09-13.md — §5 zones Z3 Reader, §7 token/component plan, §9 Phase2 exit criteria (style= count in Reader templates =0, owner review)
   - .orchestrator/STATE.md Checkpoint-C section — C-1 colors ok rest replaceable, C-2 serif for translations, C-3 subordinate except Reader sheet largest, C-4 lazy, C-5 full plan
   - app.js — current Reader renderers: renderReader, renderProvenanceNotes, case rail, dossier, ledger
   - app.css — current Reader styles: .content-panel, .text-header, .zen-reading, .dossier-panel, case rail
   - index.html — Reader section structure, mobile bar clusters
   - data/project_metrics.json — 35 docs, 104564 content CJK, etc.
   - AGENTS.md — 5 rooms smoke-guarded, internal IDs stay

3. PROJECT CONTEXT AND OWNER VISION
   Phase1 system+masthead merged main 0d02c4c: token sheet 63→43 (34+8+? actually 35+8=43), Source Serif 4 for hook/headings, shell as gate (lintel+directory+beam), mobile bar two clusters 44px, OG redrawn. Phase2 is Reader — primary room where source Chinese is largest text (C-3). Must redesign sheet, ledger drawer, case rail, convert Reader inline styles (41 literals + 17 prop writes) → classes, and implement render-lazy for hidden rooms (C-4: keep one bundle, hidden rooms render on first activation). No secondary rooms yet, no CSP tightening yet (prepare classes). Owner Vision: sophisticated minimal reading, transparent flow, no choppiness/overflow, Chinese hall feeling.

4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES
   - Canonical tracker .orchestrator/STATE.md, Checkpoint-C answers verbatim.
   - Public scope 5 rooms, internal IDs stay, brand Fake Chan Factory.
   - Pipeline fixed, 5 gates pass.
   - Current inline-style sites 58 = 41 literals + 17 prop writes (Phase1 kept 41+20? Actually Phase1 kept 41 literals + 20 write lines, same). Reader templates contain many of those literals (margin-top:.35rem, font-size:0.75rem, border-left:4px solid var(--accent-green) etc).
   - Performance: full data global + all rooms init at boot (app.js init() calls all renderers). C-4 chooses render-lazy only — hidden rooms render on first activation, no bundle split.
   - No browser evidence per R-W3.
   - This slice: Reader only, no Matrix/Lineage/Gongan/Lexicon redesign, no CSP meta change yet.

5. CORE OBJECTIVE
   Implement Phase2 Reader per proposal: sheet redesign (ruled sheets → sophisticated minimal), ledger drawer (progressive disclosure), case rail (static single-row), convert all Reader inline styles → classes (so style= count in Reader templates →0), implement render-lazy for hidden rooms (Matrix, Lineage, Gong'an, Lexicon render on first tab activation, not at boot). Exit: 5 gates green, style= count in Reader templates =0 asserted, owner review.

6. EXACT DELIVERABLES
   - Modify: app.css — add Reader sheet tokens, ledger drawer, case rail classes; define classes for previously inline styles (e.g. .note-muted, .provenance-line, .zh-block, etc.); keep token sheet discipline (derived tints via color-mix).
   - Modify: app.js — Reader renderers: replace style="..." literals with class names, replace .style.display = "none"/"block" etc with class toggling where possible (keep .style for shell-height/zh-font-size runtime contracts), implement render-lazy: init() only renders Reader, other rooms render on first tab activation (track rendered flag, call renderMatrix etc on demand).
   - Modify: index.html — Reader section structure if needed for ledger drawer, keep 5 tabs, keep 0 inline styles.
   - Modify: README.md, HANDOFF.md — update Reader description per new sheet/drawer/rail and lazy.
   - Modify: app_data.js + docs/ mirror — rebuild via build_data_bundle.py.
   - Ensure: no increase total inline-style sites beyond 58, Reader portion →0.

7. SUB-TASK BREAKDOWN AND CHECKPOINTS
   1. Measure Reader inline-style sites — commit + push
   2. Add Reader classes in app.css — commit + push
   3. Replace Reader style= literals in app.js with classes — commit + push
   4. Implement render-lazy for hidden rooms — commit + push
   5. Update README/HANDOFF — commit + push
   6. Full gates — commit + push final

8. BRANCH AND TARGET
   Base: main (0d02c4c)
   Target: feature/pages-phase2-reader
   Orchestrator: arena/01a09829-translatechan
   Align HEAD:
     git fetch --depth 50 origin +feature/pages-phase2-reader:refs/remotes/origin/_resume
     git checkout -B feature/pages-phase2-reader refs/remotes/origin/_resume
   If not found:
     git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B feature/pages-phase2-reader origin/main

9. WORK PERSISTENCE AND PUSH CADENCE
   git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin feature/pages-phase2-reader
   Open ONE PR at end.

10. TECHNICAL REQUIREMENTS
    Keep 5 rooms, internal IDs, CSP script-src self, no inline handlers, data-* delegation.
    Keep bundle <2MB.
    Reader style= count →0, total 58→? should decrease.
    Keep responsive 1024/768, reduced-motion, focus-visible, lang="zh".
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
    - Do not implement secondary rooms (Phase3) or CSP tightening (Phase3) — prepare classes only.
    - Do not split bundle (lazy only).
    - Do not fetch CBETA.

14. QUALITY CHECKS
    - py_compile PASS
    - validate_data PASS
    - build_data_bundle PASS
    - smoke_test PASS 35 texts
    - diff -rq PASS
    - structural diff PASS
    - Confirm Reader style= count 0, total inline-style sites decreased, render-lazy implemented, bundle <2MB

15. PR DESCRIPTION REQUIREMENTS
    - Summary: Phase2 Reader per Checkpoint-C
    - Measurements before/after inline-style counts, token usage, bundle sizes
    - Preserve vs Change for Reader slice
    - Test results
    - Breaking changes none (visual)
    - Safety
    - Session Irregularities

16. HARDENING REPORT — Session Irregularities
    Thresholded or None significant.

