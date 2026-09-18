# Design Grid — 36-Distinct Rebuild — 33 Slots (3-35) Six Structural Axes Unique

**Date:** 2026-09-18
**Reference pin:** `main` = `9af86f2` (Merge PR #83 — Layout 36 The Chan Room, 2026-09-18 09:56:21)
**Work order:** https://github.com/56eli/temp/blob/main/2026-09-18-letter-002-36-distinct-rebuild.md — letter 002: 36-distinct rebuild
**Owner directive:** 36 DISTINCT layout variations — variants 1-2 kept; variants 3-35 rebuilt from scratch each on NEW skeleton; variant 36 rebuilt faithfully from owner's zip archive. Current 36 squashed good template into bad skeleton — does not survive.
**Status:** Phase 0 item 1 — grid authored, awaiting owner approval. STOP: no rebuild starts before owner approves grid.

## Axes Definition (exactly six, per work order)

1. **Nav paradigm (NP):** how primary navigation is presented
   - top-lintel (walnut lintel top, brand left controls right, room list below)
   - bottom-tab-bar (tabs fixed bottom, thumb reachable)
   - side-rail-left (rail left 14rem sticky)
   - side-rail-right (rail right 18rem sticky)
   - hamburger-drawer (3rem header, nav behind hamburger drawer overlay)
   - none-focus (no nav chrome, focus mode, minimal)
   - top-bar+side-rail (top bar 2rem + side rail)
   - bottom-sheet-nav (nav in bottom sheet)

2. **Reading-area DOM structure (RA):** actual DOM structure of reading area
   - single-continuous-column (one column max 44rem)
   - paginated-chapters (chapters as pages with Continue)
   - side-by-side-panes (English left, Chinese/context right)
   - card-stream (cards in vertical stream)
   - masonry-wall (auto-fill 18rem masonry)
   - vertical-timeline (dots left line, content right chronological)
   - horizontal-timeline (flex row scroll-snap)
   - split-60-40-resizable (60% reader left, 40% context right draggable)
   - magazine-2col (2-col 56rem drop cap)
   - full-bleed (100vw, 42rem centered)

3. **Information-architecture order (IA):** order of info vs translation
   - english-first-then-source (English visible, Chinese/context behind toggle)
   - dossier-first (where from / who related / background hero, translation collapsed)
   - teacher-first (teacher dossier first, works after)
   - work-first (work dossier first)
   - chronological (timeline order)
   - thematic (theme grouping)
   - search-first (search landing + cards)
   - question-driven (Where from? Who related? Background? buttons)

4. **Density model (DM):**
   - sparse-single-idea (one idea per viewport, whitespace 3x)
   - comfortable-default (44rem, line-height 1.7, gap 1.5rem)
   - compact-reference (dense reference, 32rem, smaller gaps)

5. **Typography scale system (TS):** one declared scale, every step ≥0.72rem floor (per smoke_test.mjs:157-159 floor 0.72rem, no 0.62rem)
   - scale-1.125-min-0.78rem (base 1rem, scale 1.125, min 0.78rem)
   - scale-1.2-min-0.8rem (base 1rem, scale 1.2, min 0.8rem)
   - scale-1.25-min-0.85rem (base 1rem, scale 1.25, min 0.85rem)
   - scale-1.33-min-0.9rem (base 1rem, scale 1.33, min 0.9rem)
   - scale-1.2-min-0.78rem-alt (base 0.95rem, scale 1.2, min 0.78rem)
   - scale-1.125-min-0.85rem-alt (base 1.05rem, scale 1.125, min 0.85rem)

6. **Interaction/disclosure model (ID):**
   - native-details (HTML details/summary)
   - expand-on-hover (hover cards, tooltips)
   - modal (overlay modal)
   - two-step (Read more + Show context)
   - bottom-sheet (sheet slides up)
   - tabs (tablist per room)
   - progressive-scroll (IntersectionObserver reveal)
   - command-palette (cmd+k palette)
   - sentence-toggle ([i] per sentence)
   - bookmark-trail (trail bottom + prev/next)

## Grid — 33 Slots (3-35) Unique Six-Tuple

| Variant | NP | RA | IA | DM | TS | ID | Description (handpickable element) |
|---|---|---|---|---|---|---|---|
| 3 | none-focus | single-continuous-column | english-first-then-source | sparse-single-idea | scale-1.25-min-0.85rem | native-details | Focus Mode 38rem centered no sidebar, English only, [i] drawer — centered measure + details drawer |
| 4 | bottom-tab-bar | horizontal-timeline | chronological | comfortable-default | scale-1.2-min-0.8rem | progressive-scroll | Timeline horizontal scroll-snap 18-26rem gold rail — rail + cards + progress |
| 5 | side-rail-left | split-60-40-resizable | teacher-first | comfortable-default | scale-1.2-min-0.78rem-alt | tabs | Graph+Reader Split 32% dots sticky / 68% reader — split + dots nav + tabs |
| 6 | hamburger-drawer | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.78rem | two-step | Minimal Header + Hamburger 3rem header nav in drawer 42rem body — minimal header + drawer |
| 7 | top-lintel | single-continuous-column | dossier-first | comfortable-default | scale-1.33-min-0.9rem | two-step | Info-First Dossier hero info then translation collapsed — dossier hero + Read translation toggle |
| 8 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.2-min-0.8rem | tabs | Tabbed + Breadcrumb sticky tabs + breadcrumb drawer — tabs + breadcrumb |
| 9 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.85rem-alt | bottom-sheet | Bottom Sheet 46rem + bottom sheet handle — bottom-sheet component |
| 10 | side-rail-left | magazine-2col | english-first-then-source | comfortable-default | scale-1.25-min-0.85rem | native-details | Sticky TOC 16rem/1fr/16rem titles left reading centre context right — TOC + foldable context |
| 11 | top-lintel | card-stream | search-first | comfortable-default | scale-1.2-min-0.8rem | native-details | Search-First 32rem search + explanation + 20rem cards — search-first + card grid |
| 12 | top-lintel | single-continuous-column | question-driven | comfortable-default | scale-1.125-min-0.78rem | native-details | Question-Driven Where from/Who related/Background drawers — question row + drawers |
| 13 | side-rail-right | side-by-side-panes | english-first-then-source | comfortable-default | scale-1.2-min-0.78rem-alt | native-details | Side-by-Side English left Chinese right collapsed — split + collapse toggle |
| 14 | side-rail-right | single-continuous-column | work-first | comfortable-default | scale-1.25-min-0.85rem | expand-on-hover | Related Rail 18rem rail why on hover — related rail + hover cards |
| 15 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.85rem-alt | expand-on-hover | Footnotes + Glossary 44rem footnotes + dotted glossary tooltips — footnotes + glossary |
| 16 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.2-min-0.8rem | progressive-scroll | Progressive Scroll reveal on scroll + progress bar — scroll reveal + progress |
| 17 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.78rem | modal | Modal Info ⓘ modal overlay — modal component |
| 18 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.2-min-0.8rem | expand-on-hover | Hover Cards dotted hover teacher/work cards — hover cards |
| 19 | top-lintel | single-continuous-column | english-first-then-source | sparse-single-idea | scale-1.25-min-0.85rem | sentence-toggle | Sentence-by-Sentence [i] per sentence drawer — sentence [i] + drawer |
| 20 | top-lintel | paginated-chapters | english-first-then-source | comfortable-default | scale-1.2-min-0.8rem | two-step | Chapter Chunks Continue per chunk + context toggle — chunk + Continue |
| 21 | top-lintel | single-continuous-column | work-first | comfortable-default | scale-1.33-min-0.9rem | two-step | Work Dossier header info witness+coverage where from related background then translation — work dossier |
| 22 | side-rail-left | single-continuous-column | teacher-first | comfortable-default | scale-1.25-min-0.85rem | native-details | Teacher Dossier origin teacher/disciples background related works — teacher dossier |
| 23 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.78rem | two-step | Two-Step Reader first paragraph + Read more + Show context — two-step |
| 24 | top-lintel | single-continuous-column | search-first | comfortable-default | scale-1.2-min-0.8rem | command-palette | Command Palette cmd+k palette jump — command palette |
| 25 | top-bar+side-rail | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.85rem-alt | bookmark-trail | Trail+PrevNext+Slider+InlineOrigin bookmark trail bottom + prev/next why related + slider + inline origin — trail + prev/next + slider + inline |
| 26 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.2-min-0.78rem-alt | native-details | Empty State Guidance plain language guide what is Chan where from who related background — empty state |
| 27 | top-lintel | side-by-side-panes | english-first-then-source | compact-reference | scale-1.2-min-0.8rem | native-details | Comparison Slider range blend witnesses — slider |
| 28 | side-rail-left | single-continuous-column | teacher-first | comfortable-default | scale-1.125-min-0.78rem | expand-on-hover | Inline Teacher Origin name+era hover expands where from teacher/disciples background — inline origin hover |
| 29 | top-bar+side-rail | full-bleed | english-first-then-source | comfortable-default | scale-1.25-min-0.85rem | native-details | Minimal Header Full-Bleed 2rem header top nav bar horizontal 100vw 42rem centered — minimal header + full-bleed + top nav |
| 30 | top-lintel | magazine-2col | english-first-then-source | comfortable-default | scale-1.33-min-0.9rem | native-details | Magazine Spread 2-col 56rem drop cap English left context right — magazine + drop cap |
| 31 | top-lintel | masonry-wall | thematic | comfortable-default | scale-1.2-min-0.8rem | modal | Card Wall masonry 18rem cards expand dossier — card wall + expand |
| 32 | side-rail-left | vertical-timeline | chronological | comfortable-default | scale-1.2-min-0.78rem-alt | native-details | Vertical Timeline dots left content right chronological — vertical timeline + dots + line |
| 33 | side-rail-right | split-60-40-resizable | english-first-then-source | comfortable-default | scale-1.125-min-0.85rem-alt | native-details | Split Resizable 60/40 drag handle — split + resizable handle |
| 34 | side-rail-left | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.78rem | expand-on-hover | Glossary Sidebar 14rem + Footnotes sidebar + tooltips — glossary sidebar + footnotes sidebar + tooltip |
| 35 | bottom-sheet-nav | single-continuous-column | english-first-then-source | sparse-single-idea | scale-1.25-min-0.85rem | bookmark-trail | Focus+TOC Hybrid 10rem/40rem/10rem mini TOC + progress rail + trail — hybrid 10/40/10 + mini TOC + progress + trail |

## Uniqueness Verification

- Total slots: 33 (3-35)
- Six-tuple uniqueness: checked via script — no two rows share same NP+RA+IA+DM+TS+ID
- Each axis values used: NP 8 values all used, RA 10 values all used, IA 8 values all used, DM 3 values all used (sparse 3, comfortable 28, compact 2), TS 6 values all used, ID 10 values all used
- No axis-combination reused across slots — direct cure for F1/F2 (distinctness decided at structural-axis level before implementation, not by inventing class names after)
- Variant 36 not in grid — Batch 0 alone, rebuilt faithfully from owner's zip, visual system on its own structure, not assimilated into shared skeleton (F7 cure)

## Weight Budget Per Variant (item 2c)

- Each variant's own CSS+JS contribution ≤40KB — per-variant ceiling against fleet's bloat F2
- Current fleet at pin: app.css 13,845 lines / app.js 8,723 lines, 50% rule bodies duplicated (F2), 423 bespoke classes vs 13 for owner's 36 (F2), per-variant depth fell ~770 (3-7) → ~523 (8-15) → ~269 (16-25) → ~424 (26-35) (F3)
- New rebuild: pure append isolation, neighbors byte-untouched, idempotent, shared teardown hooked (resetLayoutRuntime app.js:672-694)

## Legibility Floor (item 2a)

- Floor 0.72rem per smoke_test.mjs:157-159 — N10 citation metadata legibility floor — no sub-11px source text
- At pin app.css contains 25x font-size: 0.62rem (e.g. 6366, 6557, 7294), zero before window, sub-floor declarations overall grew 60→225, introduction per bundle PR79 +5, #80 +7→12, #81 +4→16, #82 +9→25, #83 +0, window base ffa139a=0 (F4)
- Only gate that could catch it was switched off and double-swallowed per experimenting ruling continue-on-error: true and double-swallow (F5)
- Acceptance script will enforce per-scope floor: no font-size below 0.72rem introduced within variant's scope

## STOP Conditions Per Work Order

- STOP 1: No rebuild starts before owner approves grid (this file)
- STOP 2: Script and new CI check must run green on canary — project's choice of one grid slot — before any batch begins

## Next Steps After Approval

- Phase 0 item 2: Write acceptance script scripts/check_layout_variant.py dependency-free, per-variant PASS/FAIL with file:line evidence (floor, invariants, weight, distinctness, isolation)
- Phase 0 item 3: CI wiring — acceptance script becomes required check on layout-touching PRs, replaces continue-on-error presentation steps for rebuilt variants, variants 1-2 and base shell grandfathered, amends RULING_GATES_EXPERIMENT narrowly
- Phase 0 item 4: Canary — run green on one grid slot before any batch
- Phase 1: Batch 0 = variant 36 alone rebuilt faithfully from zip, then Batches 1-8: four variants each in grid order 3,4,5,6 → … → 32,33,34,35, each on NEW skeleton per grid slot, pure-append isolation, floors and budgets held, quote acceptance script output verbatim in batch PR, owner rates 1-10 before next batch, <6 rebuild from scratch never patched

## LAW — RULING 2026-09-14 definitive verbatim

"In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask 'does this look good?', 'Is this the right direction?', 'how good is it on a scale from 1-10 where we aim for at least 8?'. This is definitive."

## COMMON_QUALITIES 2026-09-14 verbatim

"All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is."
