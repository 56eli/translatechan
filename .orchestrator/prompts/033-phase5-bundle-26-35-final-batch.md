# Phase 5 — Bundle 26-35 Final Batch Before Review — Keep 1-25, Add 26-35 More Usable Handpickable

## Base
- **Base branch:** `main` at `8896b9e` (PR #81 merged — bundle 16-25 more usable: keep 1-15, add 16 Progressive Scroll, 17 Modal Info, 18 Hover Cards, 19 Sentence-by-Sentence, 20 Chapter Chunks, 21 Work Dossier, 22 Teacher Dossier, 23 Two-Step, 24 Command Palette, 25 Trail+PrevNext+Slider+InlineOrigin, switcher 1-25 live, bundle <30MB, text integrity PASS, presentation OFF allowed to break)
- **Target branch:** `feature/phase5-bundle-26-35-final-batch`
- **Task:** Keep 1-25 untouched (1 ideal, 2 kept, 3-7 truly drastic PR79, 8-15 usable PR80, 16-25 more usable PR81), add 26-35 as 10 NEW more usable layouts with handpickable elements for targeted page build later, final batch before review per owner "26-35 yes". Each adds number, switcher 1-35 live, visually distinct but usable (nav visible, filter visible, English first). After this, review handpickable elements for targeted build.

## Context — 1-25 Live, Need Final Batch 26-35 Before Review

Main 8896b9e live https://56eli.github.io/translatechan/ 1-25:
- 1 Classic ideal no override, 2 Accordion Reader byte-identical kept
- 3-7 truly drastic PR79: 3 Focus 38rem centered no sidebar, 4 Timeline horizontal scroll, 5 Graph+Reader split 32% dots sticky / 68% reader, 6 Hamburger 3rem header nav in drawer, 7 Dossier info-first inverted — good news drastic changes, less good not usable yet, but individual elements handpickable
- 8-15 usable handpick PR80: 8 Tabbed+Breadcrumb, 9 Bottom Sheet, 10 Sticky TOC 16rem/1fr/16rem, 11 Search-First, 12 Question-Driven, 13 Side-by-Side, 14 Related Rail, 15 Footnotes+Glossary — nav visible filter reachable English first info sections 34/34 24/24 31/31
- 16-25 more usable PR81: 16 Progressive Scroll, 17 Modal Info, 18 Hover Cards, 19 Sentence-by-Sentence, 20 Chapter Chunks, 21 Work Dossier, 22 Teacher Dossier, 23 Two-Step, 24 Command Palette cmd+k, 25 Trail+PrevNext+Slider+InlineOrigin — each 300-600 lines CSS, nav+filter visible, visually distinct but usable, handpickable

Final batch 26-35 before review: 10 new more usable with handpickable elements, building on previous, covering remaining variants from LAYOUT_VARIANTS 6-35 plus new distinct structures beyond 35 where overlap not heavy.

**What we're doing to allow drastic + usable:**
- Bundle ceiling 30MB testing per RULING_BUNDLE_CEILING_2026-09-14.md PR #76 — Quality workflow doesn't check size, allows 28MB extra CSS/JS, key assets 2.5MB raw at 1-25, 26-35 will be ~4.5MB raw still <30MB
- Presentation gates OFF while experimenting per RULING_GATES_EXPERIMENT_2026-09-14.md PR #77 — text integrity REQUIRED (py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138), presentation OPTIONAL continue-on-error (smoke 35 texts, diff -rq mirror, git diff app_data.js docs) — agents CAN rewrite shell/nav/grid even if smoke fails
- Roadmap: MUST override shell+nav+body grid, MUST change nav paradigm but KEEP nav visible or easily accessible, MUST change measure/whitespace but KEEP English first visible, MUST keep filter visible or in accessible drawer, MUST be alternative renderer not wrapper, keep ideal colors of 1, keep common qualities light mental load English first not dense comfortable piece meal info sections

## 26-35 New Layouts — Final Batch More Usable + Handpickable (each 300-600 lines CSS, visually distinct, usable)

### 26 — Empty State Guidance (variant 32)
- **Idea:** When no work selected, plain language guide: what is Chan, where works from, who related, background piece meal
- **Shell:** Keep shell + nav + filter visible, `.room-body` for empty state shows centered 36rem guide with sections: What is Chan? (plain English), Where works from? (origin), Who related? (lineage), Background? (historical context) each expandable. When work selected, guide collapses to top small banner.
- **Rooms:** All rooms empty state same guide, then selected work shows English first.
- **Why usable:** Empty state reduces mental load for new users, plain language piece meal, nav + filter visible. Handpickable: empty state guidance component.
- **CSS:** `[data-design="26"] .empty-state` centered 36rem, `[data-design="26"] .room-body` 44rem.

### 27 — Comparison Slider (variant 34)
- **Idea:** For variant witnesses, slider to compare, default minimal English, extra behind toggle
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 48rem centered, Matrix room has slider `.comparison-slider` range input 0-100% that blends between two witnesses, left witness English, right witness English, slider middle shows diff. Other rooms have similar slider for Chinese vs English or context vs translation.
- **Rooms:** Matrix comparison slider, Reader Chinese vs English slider, Lineage teacher vs disciple slider, Cases theme slider, Terms definition slider.
- **Why usable:** Slider gives control, minimal default English, extra behind toggle, nav + filter visible. Handpickable: comparison slider.
- **CSS:** `[data-design="27"] .comparison-slider` range, `[data-design="27"] .room-body` 48rem.

### 28 — Inline Teacher Origin (variant 35)
- **Idea:** Lineage view each teacher row only name + era, hover expands where from + teacher/disciples + background
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 46rem centered, lineage rows `.lineage-master-row` only name + era visible default, hover/focus expands inline drawer with where from + teacher/disciples + background plain language, plus related works.
- **Rooms:** Lineage inline origin, Reader inline teacher origin per case, Matrix inline witness origin, Cases inline protagonist origin, Terms inline related teacher origin.
- **Why usable:** Minimal default name+era, extra behind hover, English first, nav + filter visible. Handpickable: inline origin hover.
- **CSS:** `[data-design="28"] .lineage-master-row` minimal, `[data-design="28"] .inline-drawer` hidden hover.

### 29 — Minimal Header + Full-Bleed Reading (new beyond 35)
- **Idea:** Header only 2rem, full-bleed 100vw reading, no sidebar, but filter in top bar, more usable than Focus 38rem
- **Shell:** `.site-shell` height 2rem minimal, `.shell-frame` padding 0.25rem 1rem, `.brand` only icon + title, `.room-nav` top bar horizontal flex row gap 0.5rem under shell, not sidebar, `.room-filter-rail` top bar second row, `.room-body` max-width 100vw padding 2rem 4vw, reading column 42rem centered but background full-bleed.
- **Rooms:** Reader full-bleed 42rem centered, Matrix full-bleed, Lineage full-bleed, Cases full-bleed, Terms full-bleed.
- **Why usable:** Minimal header saves space, full-bleed gives reading space, nav + filter visible top bar not hidden, more usable than Focus. Handpickable: minimal header 2rem + full-bleed + top nav bar.
- **CSS:** `[data-design="29"] .site-shell` 2rem, `[data-design="29"] .room-nav` top bar flex row, `[data-design="29"] .room-body` 100vw.

### 30 — Magazine Spread (new beyond 35)
- **Idea:** 2-column magazine layout, English left column, context right column, typography magazine
- **Shell:** Keep shell + nav + filter visible, `.room-body` grid 1fr 1fr gap 2rem max-width 56rem centered, left `.mag-left` English first with drop cap first letter, right `.mag-right` context where from / related / background + Chinese + notes, both columns balanced.
- **Rooms:** Reader magazine spread, Matrix magazine spread witnesses left context right, Lineage magazine spread teacher left related right, Cases magazine spread, Terms magazine spread.
- **Why usable:** Magazine familiar, English left context right, not dense, comfortable, nav + filter visible. Handpickable: magazine 2-col + drop cap.
- **CSS:** `[data-design="30"] .room-body` grid 1fr 1fr 56rem, `[data-design="30"] .mag-left` drop cap.

### 31 — Card Wall (new beyond 35)
- **Idea:** Works/teachers as card wall masonry, click expands dossier
- **Shell:** Keep shell + nav + filter visible, `.room-body` display grid grid-template-columns repeat(auto-fill, minmax(18rem, 1fr)) gap 1rem, cards `.card-wall-card` 18rem min-height 12rem background var(--panel) border 1px solid var(--line) border-radius var(--radius) padding 1rem, click expands to full dossier overlay or inline expanded.
- **Rooms:** All rooms card wall, Reader cases as cards, Matrix witnesses as cards, Lineage teachers as cards, Cases as cards, Terms as cards.
- **Why usable:** Card wall gives overview, click expands detail, English first on card, nav + filter visible. Handpickable: card wall masonry + expand.
- **CSS:** `[data-design="31"] .room-body` grid auto-fill 18rem, `[data-design="31"] .card-wall-card`.

### 32 — Vertical Timeline (new beyond 35)
- **Idea:** Vertical timeline with dots left, content right, chronological
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 48rem centered, left rail `.timeline-rail` 2rem wide with dots gold vertical line, right content `.timeline-content` 1fr, each unit `.timeline-unit` with dot left and card right.
- **Rooms:** Lineage vertical timeline chronological, Reader vertical timeline per case chronological, Matrix vertical timeline per dynasty, Cases vertical timeline per theme, Terms vertical timeline A-Z.
- **Why usable:** Vertical timeline familiar, chronological, dots give orientation, English first, nav + filter visible. Handpickable: vertical timeline + dots + line.
- **CSS:** `[data-design="32"] .timeline-rail` vertical line, `[data-design="32"] .room-body` grid 2rem 1fr.

### 33 — Split with Context Drawer Resizable (new beyond 35)
- **Idea:** 60% reader left, 40% context drawer right that can be resized via drag handle
- **Shell:** Keep shell + nav + filter visible, `.room-body` grid 60% 40% gap 0, left `.split-left` 60% English first, right `.split-right` 40% context drawer where from / related / background + Chinese + notes, handle `.resize-handle` 4px wide draggable to resize 30%-70%.
- **Rooms:** All rooms split resizable, Reader left English right context, Matrix left comparison right context, etc.
- **Why usable:** Split gives both reading and context, resizable gives control, nav + filter visible. Handpickable: split 60/40 + resizable handle.
- **CSS:** `[data-design="33"] .room-body` grid 60% 40%, `[data-design="33"] .resize-handle`.

### 34 — Plain Language Glossary Sidebar + Footnotes (new beyond 35)
- **Idea:** Glossary sidebar left 14rem with plain language terms, footnotes bottom, main reading center 38rem
- **Shell:** `.room-body` grid 14rem 1fr 14rem gap 1rem max-width 64rem centered, left `.glossary-sidebar` sticky top var(--shell-height) background var(--sunken) border-right 1px solid var(--line) padding 1rem, center `.reading-center` 38rem, right `.footnotes-sidebar` sticky top var(--shell-height) background var(--panel) border-left 1px solid var(--line) padding 1rem, glossary terms dotted underline hover shows plain language tooltip, footnotes bottom toggle.
- **Rooms:** Reader glossary sidebar + footnotes, Matrix glossary, Lineage glossary, Cases glossary, Terms glossary.
- **Why usable:** Glossary sidebar gives plain language, footnotes give background, center reading comfortable, nav + filter visible. Handpickable: glossary sidebar + footnotes sidebar + tooltip.
- **CSS:** `[data-design="34"] .room-body` grid 14rem 1fr 14rem, `[data-design="34"] .glossary-sidebar`.

### 35 — Focus + TOC Hybrid (new beyond 35)
- **Idea:** Centered 40rem + left mini TOC 10rem + right progress + bookmark trail hybrid of Focus and TOC and Trail
- **Shell:** Keep shell minimal 2.8rem like Focus but nav visible as mini TOC left 10rem sticky, `.room-body` grid 10rem 1fr 10rem gap 1rem max-width 60rem centered, left `.mini-toc` sticky titles only, center `.focus-center` 40rem English first, right `.progress-rail` sticky progress bar + bookmark trail + related rail minimal.
- **Rooms:** All rooms hybrid: mini TOC left, reading center, progress+trail right.
- **Why usable:** Combines best of Focus (centered 40rem whitespace) + TOC (navigation) + Trail (orientation), nav visible as mini TOC, filter in top bar, more usable than pure Focus. Handpickable: hybrid 10rem/40rem/10rem + mini TOC + progress rail + trail.
- **CSS:** `[data-design="35"] .room-body` grid 10rem 1fr 10rem, `[data-design="35"] .mini-toc`, `[data-design="35"] .progress-rail`.

## Implementation Steps

1. Branch from main 8896b9e: `git checkout main; git pull; git checkout -b feature/phase5-bundle-26-35-final-batch`
2. Edit app.css: keep 1-25 untouched (1 no override, 2 byte-identical, 3-7 truly drastic PR79, 8-15 usable PR80, 16-25 more usable PR81), add new section Layouts 26-35 each 300-600 lines overriding shell+nav+body but keeping nav+filter visible, visually distinct but usable, handpickable elements, final batch before review.
3. Edit app.js: extend DESIGN_VARIANTS 1-35 labels "26 Empty State", "27 Slider", "28 Inline Origin", "29 Full-Bleed", "30 Magazine", "31 Card Wall", "32 Vertical Timeline", "33 Split Resizable", "34 Glossary Sidebar", "35 Focus+TOC Hybrid", keep applyDesignVariant, extend enhanceRoomLayout for 26-35 per specs.
4. Mirror docs/: cp app.css docs/app.css; cp app.js docs/app.js; cp app_data.js docs/app_data.js (byte-identical rebuild via build_data_bundle.py)
5. Build: python3 scripts/build_data_bundle.py must produce byte-identical 1,693,251 B unchanged
6. Gates: text integrity MUST PASS (py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build deterministic, preservation 0 unauthorized, review 138), presentation allowed to break (smoke, diff -rq continue-on-error per RULING_GATES_EXPERIMENT), law gate must PASS (website ruling + common qualities)
7. Bundle raw <30MB (expect ~6MB with 35 layouts)
8. Live demo: switcher 1-35, 26-35 new final batch more usable, handpickable elements, before review

## LAW — Must Be In Prompt And PR Description Verbatim

**RULING 2026-09-14 definitive verbatim law:**
"In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask 'does this look good?', 'Is this the right direction?', 'how good is it on a scale from 1-10 where we aim for at least 8?'. This is definitive."

**COMMON_QUALITIES 2026-09-14 verbatim:**
"All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is."

**Additional rulings:**
- RULING_BUNDLE_CEILING_2026-09-14: Bundle ceiling 30MB testing phase, technically feasible
- RULING_GATES_EXPERIMENT_2026-09-14: Text integrity required, presentation optional while experimenting, allowed to break presentation
- Colors of 1 ideal already, whole issue is website design, layout-focused vary structure for light mental load
- 1-25 live main 8896b9e: 1 ideal, 2 kept, 3-7 truly drastic but not usable yet handpickable, 8-15 usable handpickable, 16-25 more usable handpickable, now 26-35 final batch before review per owner "26-35 yes"

## Acceptance Criteria

- [ ] PR from feature/phase5-bundle-26-35-final-batch to main, base 8896b9e
- [ ] Keeps 1-25 untouched (1 no override, 2 byte-identical, 3-7 truly drastic PR79, 8-15 usable PR80, 16-25 more usable PR81)
- [ ] Adds 26-35 final batch: 26 Empty State Guidance, 27 Comparison Slider, 28 Inline Teacher Origin, 29 Minimal Header Full-Bleed, 30 Magazine Spread, 31 Card Wall, 32 Vertical Timeline, 33 Split Resizable 60/40, 34 Glossary Sidebar + Footnotes, 35 Focus+TOC Hybrid 10rem/40rem/10rem
- [ ] Each 26-35 overrides shell+nav+body grid but keeps nav+filter visible, visually distinct but usable, 300-600 lines CSS each, handpickable elements, final batch before review
- [ ] All share ideal colors of 1, implement common qualities 34/34 teachers 24/24 cases 31/31 terms 4/4 lines measured
- [ ] Switcher 1-35 live, persistent
- [ ] Text integrity PASS: py_compile, validate_data, build deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138
- [ ] Presentation allowed to break but law gate PASS
- [ ] Bundle <30MB
- [ ] No style=, 4 setProperty, CSP untouched, no corpus edits
- [ ] PR description includes LAW verbatim + COMMON_QUALITIES + why 3-7 not usable but handpickable + why 8-15 and 16-25 usable handpickable + roadmap 26-35 final batch + questions per LAW

## BANNED COMMANDS

- NEVER git show <sha> on bundle commit — use --name-only or --stat or ls -lh app_data.js
- NEVER git log -p on bundle
- NEVER edit data/ corpus or app_data.js manually — only via build_data_bundle.py

## Questions Per LAW (must ask in PR)

- Does this final batch 26-35 look good before review?
- Is this the right direction — keep nav+filter visible, more usable, handpickable elements for targeted build later, final batch before review?
- How good is it 1-10 where we aim at least 8? Overall and per 26-35?
- Which of 26-35 feels most usable and most handpickable? Which elements to handpick for targeted page build?
- Which room closest/furthest? Info sections more/less?
- Ready for review and targeted build after 1-35?
