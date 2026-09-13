0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/004-phase1-system-masthead.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Read /tmp/task.md fully. Do not checkout orchestrator paths into worktree. Halt if empty or title mismatches.

1. TASK TITLE AND SCOPE
   Phase 1 — System + masthead: token sheet consolidation, scholarly serif English voice, shell/hero/mobile bar/OG redraw, per Checkpoint-C C-1..C-5 confirmed. One PR.

2. REQUIRED READING ORDER
   - /tmp/state.md — canonical tracker .orchestrator/STATE.md, Checkpoint-C section C-1..C-5 verbatim, main 239e3a9
   - .orchestrator/PAGES_REVAMP_PROPOSAL_2026-09-13.md — full proposal §2 current state, §4 approach, §5 zones Z1-Z8, §6 preserve vs change, §7 token/component plan, §9 Phase 1 exit criteria
   - .orchestrator/STATE.md Checkpoint-C section — owner answers: C-1 colors acceptable rest replaceable, C-2 serif, C-3 subordinate except Reader, C-4 lazy, C-5 full plan
   - index.html full 260 lines — current hero, shell, tabs, CSP, 0 inline styles
   - app.css 67KB — :root 63 custom props, 14 @media, :focus-visible, shell-height, zh-font-size
   - app.js head 500 lines — init() renders all 5 rooms at boot, theme, shell metrics
   - theme-init.js 876 B — pre-paint bootstrap
   - WEB_VISION_2026-08-10.md, vision.md, UX_ROADMAP.md, HANDOFF.md §3 — walnut hall direction, English-first
   - AGENTS.md — public scope 5 rooms, internal IDs stay, CSP script-src 'self', no inline handlers, data-* delegation
   - data/project_metrics.json — corpus 35, CJK 104564/110252, verified 177, etc.

3. PROJECT CONTEXT AND OWNER VISION
   Phase A complete (PRs #45,46,47 merged main 239e3a9). Phase B unblocked per Checkpoint-C: colors #2c2523 walnut etc acceptable, everything else may be replaced; scholarly serif for hook/headings/translations sans for controls; Chinese subordinate except inside Reader sheet where largest; render-lazy only (keep one bundle, hidden rooms render on first activation); full plan system+masthead → Reader → secondary rooms → CSP tightening → evidence, folding PR-B/PR-D. Owner wants drastic rework but guided questioning: continue with plain word, guided questioning. This slice is Phase 1: system + masthead — token sheet + type scale + English serif decision, header/hero/room-heading re-composition, mobile bar regroup, OG image redraw, docs prose updates. No Reader secondary rooms yet, no CSP tightening yet (classes first). Must keep 5 gates green.

4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES
   - Canonical tracker .orchestrator/STATE.md, Checkpoint-C answers verbatim recorded.
   - Public scope exactly 5 rooms smoke-guarded, internal IDs stay, brand Fake Chan Factory humor-forward.
   - Pipeline fixed: data/ → validate_data.py → project_metrics.json → build_data_bundle.py → root+docs mirror, 5 gates pass.
   - CBETA DR-1 read-only pinned revision.
   - No generation Classical Chinese, no re-designation 630, sessions append-only.
   - Current payload: app_data.js 1,641,935 B (now 1,642,473 B after dahui disclosure), app.js 173KB 3462 lines, app.css 67KB 2572 lines, index.html 17KB 260 lines, total ~1.90MB raw ~572KB gzip, 58 inline-style sites (41 literals + 17 prop writes) load-bearing for CSP unsafe-inline.
   - Responsive: 14 @media (4×1024,6×768,1×720,1×600min,1 print,1 reduced-motion), lang="zh" 26+10, :focus-visible 14.
   - No browser evidence per R-W3 — do not claim screenshot-verified.
   - This slice: system + masthead only, no Reader sheet redesign yet, no secondary rooms, no CSP meta change yet (prepare classes).

5. CORE OBJECTIVE
   Implement Phase 1 system + masthead per proposal §7 and Checkpoint-C: consolidated token sheet (63→~40 tokens), English scholarly serif (e.g. Source Serif Pro or Fraunces class) for hook/headings/translations, sans for controls, re-composed header/hero/room headings, mobile bar regroup, OG image redraw to match final system, docs prose updates. Exit: 5 gates green, owner can review live Pages, go/no-go on system before rooms touched. Done criteria: token sheet consolidated, serif chosen and loaded (self-hosted under /fonts/ or Google-served per decision — propose self-hosted open-licence or keep Google, document choice), hero/shell/mobile bar re-composed per C-1 colors acceptable rest replaceable, OG image redrawn, no inline-style count increase (ideally decrease in masthead templates), bundle still <2MB, smoke 35 texts.

6. EXACT DELIVERABLES
   - Modify: app.css — consolidate :root tokens 63→~40 (remove duplicates, document), add serif font-face (if self-hosted) or keep Google Fonts link but add serif stack, define type scale (hook, h1, h2, body, small, mono), component tokens for header/hero/mobile bar.
   - Modify: index.html — re-compose header/hero structure per new system (keep 5 role=tab buttons, keep CSP meta before scripts, keep 0 inline styles, keep FC monogram + hook "The old texts are real. The translators are not." + PROUDLY FAKE stamp + counts 35/21, keep theme-init.js sync before CSS), update hero kicker if needed but keep joke once per vision.
   - Modify: app.js — update masthead renderers (hero, header, room headings) to use new classes, not new inline styles; keep internal IDs, keep 5 rooms, keep data-* delegation, no new data-view.
   - Modify: theme-init.js — keep pre-paint bootstrap, adjust if token names changed.
   - Modify: og-image.svg — redraw to match final system (walnut beams, serif, counts, seal).
   - Modify: README.md, HANDOFF.md — update interface claims per new system (token count, serif choice, hero description).
   - Modify: app_data.js + docs/ mirror — rebuild via build_data_bundle.py (bundle bytes may change slightly due to CSS/JS changes? Actually app_data.js is data bundle only, not CSS/JS — CSS/JS changes do NOT affect app_data.js, but docs/ mirror for CSS/JS must be regenerated via build script? Build script mirrors app.css/app.js/index.html/theme-init.js/robots/sitemap/og-image + data/ — so run build_data_bundle.py).
   - Ensure: no new dependencies, no framework, no backend.

7. SUB-TASK BREAKDOWN AND CHECKPOINTS
   1. Measure current tokens, media queries, inline-style inventory — commit + push
   2. Consolidate app.css token sheet 63→~40, add serif font stack — commit + push
   3. Re-compose index.html header/hero structure — commit + push
   4. Update app.js masthead renderers to use new classes — commit + push
   5. Redraw og-image.svg — commit + push
   6. Update README/HANDOFF prose — commit + push
   7. Run full gates — commit + push final

8. BRANCH AND TARGET
   Base: main (239e3a9)
   Target: feature/pages-phase1-system-masthead
   Orchestrator: arena/01a09829-translatechan
   Resuming: fresh branch from main
   Align HEAD:
     git fetch --depth 50 origin +feature/pages-phase1-system-masthead:refs/remotes/origin/_resume
     git checkout -B feature/pages-phase1-system-masthead refs/remotes/origin/_resume
   If not found:
     git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B feature/pages-phase1-system-masthead origin/main

9. WORK PERSISTENCE AND PUSH CADENCE
   Checkpoint after each sub-task, before long ops, end.
   git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin feature/pages-phase1-system-masthead
   Open ONE PR at end when gates pass.
   Sync rule: rebase before first push only, merge after.

10. TECHNICAL REQUIREMENTS
    Language: CSS + HTML + vanilla JS, follow existing style, no framework.
    Must keep 5 rooms, internal IDs, CSP script-src 'self', no inline handlers, data-* delegation.
    Must keep bundle <2MB, total ~1.9MB raw, ~572KB gzip.
    Must reduce or keep inline-style count 58, not increase; masthead templates should use classes not style=.
    Must keep responsive 1024/768, reduced-motion, :focus-visible, lang="zh".
    TEST_COMMAND: python3 scripts/validate_data.py — PASS
    INTEGRATION_TEST_COMMAND: python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs — PASS
    FULL_SUITE_COMMAND: py_compile + validate + build + smoke + diff -rq data docs/data + structural diff git diff --exit-code -- app_data.js docs data/project_metrics.json
    COVERAGE_COMMAND: not configured
    MUTATION_TEST_COMMAND: python3 scripts/test_source_review_rules.py — 120 checks PASS
    LINT_COMMAND: not configured
    BUILD_COMMAND: python3 scripts/build_data_bundle.py

11. SAFETY AND COMPATIBILITY RULES
    - Must NOT break 5 gates.
    - Must NOT change data/corpus.
    - Must NOT re-designate 630.
    - Must NOT edit workflows.
    - Must NOT generate Classical Chinese.
    - Must keep 5-room scope and internal IDs.

12. CLEANUP RULES
    No commented code, debug logs, TODO. No unrelated mods. Clean worktree.

13. STRICT BOUNDARIES / OUT OF SCOPE
    - Do not push to orchestrator branch.
    - Do not implement Reader or secondary rooms yet (Phase 1 only).
    - Do not tighten CSP yet (prepare classes, assert style= count not increased).
    - Do not split bundle (render-lazy only per C-4, keep one bundle).
    - Do not fetch CBETA.

14. QUALITY CHECKS
    - py_compile PASS
    - validate_data PASS (3 lineage warnings)
    - build_data_bundle PASS
    - smoke_test PASS 35 texts
    - diff -rq data docs/data PASS
    - structural diff PASS
    - Confirm token sheet consolidated, serif chosen, hero/shell/mobile bar re-composed, OG redrawn, inline-style count not increased, bundle <2MB

15. PR DESCRIPTION REQUIREMENTS
    - Summary: Phase 1 system+masthead per Checkpoint-C
    - Measurements before/after (tokens 63→~40, inline-style count, bundle sizes)
    - Serif choice and hosting decision (self-hosted vs Google)
    - Preserve vs Change list for this slice
    - Test results
    - Breaking changes none (visual rework)
    - Safety: no data, no status, no rights, visual only
    - Session Irregularities

16. HARDENING REPORT — Session Irregularities
    Thresholded, or None significant.

