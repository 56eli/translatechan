0. FETCH AND VERIFY
   Your task prompt is on the orchestrator branch. Fetch it, then follow it exactly.
   The fetch MUST be `git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch`
   then `git show refs/remotes/origin/_orch:.orchestrator/prompts/002-pages-revamp-proposal.md > /tmp/task.md`.
   Do not use `origin/arena/01a09829-translatechan` (single-branch clones do not create it). Do not use FETCH_HEAD (the next fetch of main overwrites it).
   Do not `git checkout` orchestrator paths into the worktree.
   State: write outside the repository, never commit this file, never push to the orchestrator branch, halt if the file is empty or the title mismatches.
   Confirm: `git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md` exists as supplement.

1. TASK TITLE AND SCOPE
   Produce GitHub Pages revamp proposal (approach, zones, preserve vs change) + Checkpoint-C question set — NO CODE.
   Complete this in ONE pull request (docs-only).

2. REQUIRED READING ORDER
   - .orchestrator/local/ORCHESTRATOR_STATE.md (via /tmp/state.md) — canonical tracker .orchestrator/STATE.md, rulings DR-1..DR-3 + new D-1..D-4, O-1..O-3, Pages revamp top priority
   - /tmp/pack1.md Part A Steps 1-2 — scope boundaries Phase A then Phase B, Pages revamp proposal-first, no building before owner confirms
   - /tmp/pack2.md Lane 3 SPA integrity W-1..W-6, D-4 — current claims vs behavior, inline-style count 58, CSP, responsive, lang="zh", etc.
   - README.md § English-First Walnut Hall Interface (2026-08-11) and § Key Features and § Overview — current interface claims
   - HANDOFF.md §3 Current design direction (owner feedback 2026-08-11: prior Pages too plain/generic, too much focus on Chinese, preserve walnut-hall) and §6 Fixed behavior
   - index.html full 260 lines — CSP meta before scripts, 0 inline <style>, 4 external scripts, 5 role=tab nav tabs, hero structure
   - theme-init.js 876 B — pre-paint theme bootstrap
   - app.js 173,282 B — read head 500 lines + search for renderers: `grep -n "render.*Reader\|render.*Matrix\|render.*Lineage\|render.*Gongan\|render.*Lexicon\|PROVENANCE_NOTE_KEYS\|renderProvenanceNotes" app.js | head -n 100`
   - app.css 67,165 B — `grep -n "@media\|:focus-visible\|prefers-reduced-motion\|--shell-height\|--zh-font" app.css | head -n 100`
   - app_data.js — generated bundle 1,641,935 B, global TRANSLATECHAN_DATA, byte-identical rebuild via build_data_bundle.py
   - WEB_VISION_2026-08-10.md full 213 lines — Chan hall gate, walnut #2c2523, gold #9e7232, no Japanese, humor only in Robo names, 5 tabs, no footer/conveyor/CTA
   - UX_ROADMAP.md, vision.md — grand vision and measured distance
   - data/project_metrics.json — corpus 35, slots 1252, verified 177, matrix 21, locators 148/148, CJK 104564
   - AGENTS.md — public Pages scope exactly 5 rooms, smoke-guarded, no Translation Studio/Arena Agents/header GitHub link, CSP script-src 'self', no inline handlers, data-* delegation

3. PROJECT CONTEXT AND OWNER VISION
   Fake Chan Factory is zero-backend static Pages SPA from main/docs, 5 rooms (Reader, Matrix, Lineage, Gong'an, Lexicon). Current design: English-first walnut hall (FC monogram, dark walnut #2c2523 editorial/factory hero "The old texts are real. The translators are not.", English-first navigation, progressive disclosure, ruled reading sheets, Matrix proof rows, Lineage directory/network, Gong'an catalogue, dictionary). Owner feedback 2026-08-11: prior Pages too plain/generic, too much focus on Chinese characters, preserve walnut-hall direction. Current implementation has English-first brand, dark-walnut hero, compact mobile controls, progressive disclosure removing repeated Robo footers, no inline HTML styles, resilience (malformed prefs fail soft, missing bundle recovery UI), contrast-safe tokens, reduced-motion, keyboard tabs. Performance: full data global + hidden rooms init upfront (HANDOFF §5, AUDIT P2.5), bundle 1.64 MB uncompressed (~556KB gzip estimate, 1.9MB total with app.js/css). CSP needs unsafe-inline due to 58 JS inline-style sites (41 literals + 17 property writes, D-4). Owner now says Pages site will be reworked drastically — top engineering priority — but proposal-first, no code until confirmed. Owner Vision Context: site should feel like Chinese Chan hall in dark walnut — first 30s Chan literature/Zen feeling with Robo monks as practical joke, then serious literature, sophisticated minimal, no gimmicks, humor only in Robo names, no choppiness/overflow/distraction.

4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES
   - Canonical tracker .orchestrator/STATE.md per DR-3.
   - DR-1 CBETA pinned revision authorized read-only, never committed.
   - Public scope exactly 5 rooms smoke-guarded; Translation Studio/Arena Agents/header GitHub link stay out.
   - Internal identifiers stay: translatechan_* localStorage, window.TranslateChan, TRANSLATECHAN_DATA; brand Fake Chan Factory humor-forward stays.
   - Pipeline fixed: data/ → validate_data.py → project_metrics.json → build_data_bundle.py → root + docs/ mirror; 5 quality gates must pass.
   - No .github/workflows edits without owner approval except O-3 already approved.
   - No generation of Classical Chinese; corpus text only from authoritative sources.
   - No re-designation 630→532.
   - Pages publishes natively from main/docs, no deploy workflow, Pages API status built, https enforced, has_pages true.
   - Current claims substantiated at repo-gate level (W-1..W-6): 0 HTML inline styles, 58 JS injection sites, CSP style-src 'self' 'unsafe-inline' https://fonts.googleapis.com, 14 @media (4×1024px shelf collapse, 6×768px mobile, 1 reduced-motion), lang="zh" ×26 app.js + ×10 index.html, role=tablist, aria-selected, tabindex ×8, :focus-visible ×14, payload 1.9MB uncompressed, qualitative "Fast, zero-backend, responsive SPA" no numeric falsifiable.
   - Frozen tracks PR-A/B/D remain frozen, measured/reported not resumed.
   - This task is docs-only proposal, NO CODE changes to app.js/app.css/index.html/app_data.js.
   - Scope: proposal must cover approach, zones (what files/components), what changes vs preserved, risks, and Checkpoint-C questions on design direction.

5. CORE OBJECTIVE
   Read current SPA structure and interface claims, then produce a Pages revamp proposal document plus Checkpoint-C question set for owner confirmation before any code. Done criteria: proposal file exists with sections Approach, Zones, Preserve vs Change, Risks/Constraints, and Checkpoint-C questions (structured, 3-5 questions with discrete options, owner confirms direction). No code changes to app.js/app.css/index.html/docs mirror.

6. EXACT DELIVERABLES
   - Create: .orchestrator/PAGES_REVAMP_PROPOSAL_2026-09-13.md (or docs/PAGES_REVAMP_PROPOSAL_2026-09-13.md — pick one and document choice) — must contain:
     * Executive summary (one paragraph)
     * Current state assessment (measured: bundle sizes, 5 rooms, walnut hall, 58 inline-style sites, CSP, responsive, a11y, performance)
     * Owner feedback synthesis (too plain/generic, too much Chinese focus, preserve walnut)
     * Proposed approach (e.g., keep zero-backend static, keep data global but consider lazy-loading per-room, keep vanilla JS vs framework, keep CSP, reduce inline-style injection sites from 58→0 to allow style-src without unsafe-inline, etc. — propose, not implement)
     * Zones breakdown: HTML shell (index.html), theme bootstrap (theme-init.js), styles (app.css → component tokens), readers (app.js renderers per room), data consumption (app_data.js), deploy mirror (docs/), assets (og-image.svg, robots.txt, sitemap.xml)
     * What is preserved: 5-room scope, internal IDs, brand FC monogram, "The old texts are real. The translators are not." hook, English-first hierarchy, progressive disclosure, five ledgers, humor only in Robo names, no framework, no backend, recovery UI, reduced-motion, keyboard tabs, lang="zh" preservation
     * What changes: drastically reworked visual system (propose specifics: e.g., walnut hall consolidation, typography scale, ruled sheets → more sophisticated minimal, Matrix proof rows redesign, Lineage graph, Gong'an catalogue, Lexicon, mobile bar, hero, shell metrics, etc.), performance (lazy per-text data? measure-first), CSP hardening (remove inline styles), accessibility, etc.
     * Risks and constraints (e.g., bundle size, CSP, smoke-guarded scope, validator is spec, no browser evidence per R-W3)
     * Implementation plan phases (proposal → owner confirm → slice 1 masthead → slice 2 Reader → slice 3 secondary rooms → evidence/approval)
     * Checkpoint-C question set (3-5 questions, each with 2-4 discrete options + custom, e.g., visual direction, typography, performance strategy, CSP hardening, scope of revamp)
   - Modify: .orchestrator/local/ORCHESTRATOR_STATE.md is NOT an agent deliverable (orchestrator-only) — do NOT modify it.
   - Optional: create docs/PAGES_REVAMP_PROPOSAL_2026-09-13.md as mirror if you created under .orchestrator/ — but keep single source of truth, note in PR description.
   - Do NOT modify: app.js, app.css, app_data.js, index.html, theme-init.js, docs/ mirror, data/, scripts/, schemas/, .github/workflows/

7. SUB-TASK BREAKDOWN AND CHECKPOINTS
   1. Read current SPA files and measure baseline (bundle sizes, media queries, lang="zh" counts, inline-style inventory 41+17=58) → commit + push
   2. Synthesize owner feedback and current WEB_VISION/vision/UX_ROADMAP into proposal outline → commit + push
   3. Write full proposal with Approach, Zones, Preserve vs Change, Risks, Implementation phases → commit + push
   4. Draft Checkpoint-C questions (3-5, structured with options, per owner's discipline: verify target against zone before asking, record answers verbatim) → commit + push
   5. Run quality gates (py_compile, validate_data, build_data_bundle, smoke_test, diff -rq) to ensure proposal doesn't break gates (docs-only should pass) → commit + push final

8. BRANCH AND TARGET
   Base branch: main
   Target branch: docs/pages-revamp-proposal
   Orchestrator branch: arena/01a09829-translatechan
   Dependencies: none (but should be aware of 001 which fixes doc truthfulness gate — if 001 not yet merged, note dependency in PR description)
   Resuming: fresh branch from main
   Before first checkpoint, align HEAD:
     git fetch --depth 50 origin +docs/pages-revamp-proposal:refs/remotes/origin/_resume
     git checkout -B docs/pages-revamp-proposal refs/remotes/origin/_resume
   If not found:
     git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B docs/pages-revamp-proposal origin/main

9. WORK PERSISTENCE AND PUSH CADENCE
   Checkpoint after each sub-task in section 7, before any long operation, and at end. Session can expire; unpushed work lost.
   One command:
     git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin docs/pages-revamp-proposal
   Open ONE PR at end when quality checks pass. No draft PR unless explicitly told.
   Sync rule: rebase before first push only; after first push merge origin/main.
   Never push to orchestrator branch. Never force-push. On NFF halt and report. On auth/network failure report plainly and keep working locally.

10. TECHNICAL REQUIREMENTS
    Language: Markdown proposal, no code.
    Must quote measurements by copy, never recall: bundle sizes `ls -lh app_data.js app.js app.css`, media query counts `grep -c "@media" app.css`, lang="zh" counts, inline-style counts `grep -n "style=" app.js | wc -l` and `grep -n "\.style\." app.js | wc -l`, etc. Include commands labeled "confirm, do not copy".
    Must respect AGENTS.md public scope 5 rooms, internal IDs stay, humor-forward tone stays, CSP, no inline handlers.
    Must respect R-W3: repo gates only, no browser install/run, cite absence of browser evidence.
    Must not propose framework/backend/external JS — static remains.
    Must include Checkpoint-C questions per owner's discipline: each question has id, question text, 2-4 options + custom free-text enabled, target verified against zone.
    TEST_COMMAND: python3 scripts/validate_data.py — must PASS
    INTEGRATION_TEST_COMMAND: python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs — must PASS
    FULL_SUITE_COMMAND: same 5 gates as 001
    COVERAGE_COMMAND: not configured
    MUTATION_TEST_COMMAND: not warranted — docs-only
    LINT_COMMAND: not configured
    BUILD_COMMAND: python3 scripts/build_data_bundle.py

11. SAFETY AND COMPATIBILITY RULES
    - Docs-only, no code changes to SPA.
    - Must NOT break 5 quality gates.
    - Must NOT change data/ or corpus text.
    - Must NOT commit secrets.
    - Must NOT edit .github/workflows/*.
    - Must preserve 5-room scope and internal IDs.

12. CLEANUP RULES
    No commented-out code, debug logs, TODO markers introduced. No unrelated file modifications. No /tmp artifacts committed. Clean worktree at end.

13. STRICT BOUNDARIES / OUT OF SCOPE
    - Do not push to orchestrator branch.
    - Do not implement Pages revamp code — proposal only.
    - Do not edit app.js/app.css/index.html/app_data.js/docs mirror.
    - Do not fetch CBETA or run collation.
    - Do not add dependencies.

14. QUALITY CHECKS
    - Run: python3 -m py_compile scripts/*.py — PASS
    - Run: python3 scripts/validate_data.py — PASS (3 lineage warnings)
    - Run: python3 scripts/build_data_bundle.py — PASS
    - Run: node scripts/smoke_test.mjs — 35 texts, 0 crashes
    - Run: diff -rq data docs/data — PASS
    - Confirm proposal file exists and contains required sections + Checkpoint-C questions
    - Confirm git status clean, all pushed

15. PR DESCRIPTION REQUIREMENTS
    - Summary: Pages revamp proposal — approach, zones, preserve vs change, risks, no code
    - Current state measurements (bundle sizes, 58 inline-style sites, media queries, lang="zh" counts, 5 rooms)
    - Proposed approach and zones breakdown
    - Preserve vs Change list
    - Risks/constraints
    - Implementation phases
    - Checkpoint-C questions (list with ids, options)
    - Test results (5 gates)
    - Breaking changes: none (docs-only)
    - Safety/impact: no code, no data, no rights, proposal only
    - Include `#### Session Irregularities` per §16

16. HARDENING REPORT — Session Irregularities (thresholded, low-cost)
    In PR description under `#### Session Irregularities`, report significant irregularities per threshold (>10min, blocked, workaround, recurring invariant). If none, write `None significant`.

