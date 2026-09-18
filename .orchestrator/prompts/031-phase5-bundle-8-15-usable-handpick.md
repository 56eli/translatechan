# Phase 5 — Bundle 8-15 Usable Handpick — Keep 1-7, Add 8-15 More Usable Examples Before Review

## Base
- **Base branch:** `main` at `1b5d929` (PR #79 merged — keep 1 and 2, completely redo 3-7 truly drastic: 3 Focus 38rem centered no sidebar whitespace 3x, 4 Timeline horizontal scroll cards 18-26rem, 5 Graph+Reader split 32% dots sticky / 68% reader, 6 Hamburger 3rem header nav in drawer, 7 Dossier info-first inverted, switcher 1-7 live, bundle <30MB, text integrity PASS, presentation OFF allowed to break)
- **Target branch:** `feature/phase5-bundle-8-15-usable-handpick`
- **Task:** Keep 1-7 untouched (1 Classic ideal no override, 2 Accordion Reader byte-identical kept, 3-7 truly drastic from PR79), add 8-15 as 8 NEW more usable layouts with handpickable elements for targeted page build later. Each adds number, switcher 1-15 live, visually distinct but usable (nav visible, filter visible, English first, not hiding everything). Before review per owner "Lets first implement more examples before going into review."

## Context — Good News Drastic Changes, Less Good Not Usable Yet, Elements Handpickable

Owner feedback 2026-09-14: "The good news is that there have been drastic changes. The less good news is that it's not useable yet. However there are individual elements that might be able to be handpicked later on for a targeted page build. Lets first implement more examples before going into review. Hand out a dispatch stub for 8-15."

**Why 3-7 not usable yet (measured main 1b5d929):**
- **3 Focus 38rem:** No sidebar, no filter, no hero, no room-heading, centered 38rem, English only, Chinese behind [i] — whitespace 3x good for reading but loses navigation, not usable for Compare/Lineage/Cases/Terms where filter needed
- **4 Timeline →:** `.room-body` flex row overflow-x auto scroll-snap, cards 18-26rem on gold rail — visually distinct but horizontal scroll not intuitive for long texts, loses vertical scanning, filter hidden
- **5 Graph+Reader Split 32/68:** New DOM split left dots sticky / right reader — dots unlabeled, no teacher names, not usable for discovery, but split concept handpickable
- **6 Hamburger 3rem:** Header 3rem only title+numbers, nav in drawer 18rem fixed right, filter rail in second drawer — hides nav behind hamburger, requires extra click, not usable for quick room switching but minimal header concept handpickable
- **7 Dossier inverted:** Info-first hero, translation collapsed behind "Read translation ↓" — inverts IA good for context but hides translation by default, not usable for reading-first but dossier concept handpickable

**Handpickable elements from 3-7:**
- Focus: centered 38rem measure, [i] drawer for Chinese/context
- Timeline: gold rail, scroll-snap cards, era/name face
- Graph+Split: 32/68 split, sticky left nav, dots navigation
- Hamburger: 3rem minimal header, drawer overlay, 42rem body
- Dossier: info section hero with Where from / Who related / Background, Read translation toggle

**What we're doing to allow drastic + usable:**
- Bundle ceiling 30MB testing per RULING_BUNDLE_CEILING_2026-09-14.md PR #76 — Quality workflow doesn't check size, allows 28MB extra CSS/JS
- Presentation gates OFF while experimenting per RULING_GATES_EXPERIMENT_2026-09-14.md PR #77 — text integrity REQUIRED (py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138), presentation OPTIONAL continue-on-error (smoke 35 texts, diff -rq mirror, git diff app_data.js docs) — agents CAN rewrite shell/nav/grid even if smoke fails
- Roadmap for truly drastic but usable: MUST override shell+nav+body grid, MUST change nav paradigm but KEEP nav visible or easily accessible, MUST change measure/whitespace but KEEP English first visible, MUST keep filter visible or in accessible drawer, MUST be alternative renderer not wrapper, keep ideal colors of 1, keep common qualities

## 8-15 New Layouts — Usable + Handpickable Elements (each 300-600 lines CSS, visually distinct, usable)

### 8 — Tabbed + Breadcrumb (variants 8 + 14)
- **Idea:** Tabs Translation/Chinese/Context/Related + top breadcrumb shows lineage path clicking expands background piece-meal
- **Shell:** Keep `.site-shell` walnut, `.room-nav` sidebar visible, `.room-heading` with breadcrumb row top: `Home > Work > Chapter` breadcrumb links, clicking breadcrumb expands context drawer below heading. `.room-body` max-width 48rem centered but sidebar still visible.
- **Rooms:** Reader 4 tabs (Translation default English first, Chinese, Context where from / who related / background, Related teachers), Compare 3 tabs (At a glance / Full / Context), Lineage 3 tabs (List / Timeline / Context), Cases 3 tabs (List / Theme / Context), Terms 3 tabs (A-Z / Detail / Context). Breadcrumb in each room shows path.
- **Why usable:** Tabs keep English first but all info accessible, breadcrumb gives context without hiding, nav visible, filter visible. Handpickable: tabbed rooms + breadcrumb.
- **CSS:** `[data-design="8"] .room-body` 48rem centered, `[data-design="8"] .layout-tabs` sticky top, `[data-design="8"] .breadcrumb` flex row gap 0.5rem, `[data-design="8"] .site-shell` same but `.shell-frame` padding 1rem.

### 9 — Bottom Sheet (variant 11)
- **Idea:** Bottom sheet slides up for extra info, desktop same as drawer, default hidden
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 46rem centered, bottom sheet `.bottom-sheet` position fixed bottom 0 left 0 right 0 height 40vh background var(--panel) border-top 1px solid var(--line) transform translateY(100%) transition, when open translateY(0), handle bar top center. Button "Show context" bottom right fixed opens sheet.
- **Rooms:** Reader extra (Chinese, notes, context, related) in bottom sheet, not inline. Compare extra in sheet, Lineage teacher dossier in sheet, Cases theme/locator in sheet, Terms occurrences in sheet.
- **Why usable:** Main view minimal English only, extra behind bottom sheet not hidden behind tiny [i], nav + filter visible, sheet easy to open/close. Handpickable: bottom sheet component.
- **CSS:** `[data-design="9"] .bottom-sheet`, `[data-design="9"] .room-body` 46rem, `[data-design="9"] .site-shell` same.

### 10 — Sticky Minimal TOC + Reader (variant 12)
- **Idea:** Left sticky minimal TOC titles only, main English, right context toggle
- **Shell:** `.room-body` grid 16rem 1fr 16rem gap 1.5rem, left `.toc-pane` sticky top var(--shell-height) height calc(100vh - var(--shell-height)) overflow-y auto background var(--sunken) border-right 1px solid var(--line) padding 1rem, center `.reader-pane` max-width 38rem margin 0 auto, right `.context-pane` sticky top var(--shell-height) height calc(100vh - var(--shell-height)) overflow-y auto background var(--panel) border-left 1px solid var(--line) padding 1rem, toggle button top-right "Context" shows/hides right pane.
- **Rooms:** Reader left TOC per case titles only, center English, right context where from / related / background. Matrix left witness list, center comparison, right context. Lineage left generation list, center teacher detail, right related works. Cases left case list, center detail, right theme. Terms left A-Z, center definition, right occurrences.
- **Why usable:** TOC always visible for navigation, center reading comfortable, context toggle optional, nav + filter visible. Handpickable: sticky TOC + 3-column layout.
- **CSS:** `[data-design="10"] .room-body` grid, `[data-design="10"] .toc-pane`, `[data-design="10"] .context-pane`.

### 11 — Search-First Landing (variant 17)
- **Idea:** Landing is search + plain English explanation, results minimal cards, expand for context
- **Shell:** `.room-body` for empty state shows search-first landing: centered search input large, plain English explanation "What is Chan? Where works from? Who related? Background piece meal" below search, results as minimal cards 20rem wide grid, click expands context. When work selected, search collapses to top bar small.
- **Rooms:** All rooms landing same search-first, then results. Reader after selection shows English first with context toggle. Compare/Lineage/Cases/Terms same search-first then cards.
- **Why usable:** Search-first reduces mental load for new users, plain English explanation piece meal, cards minimal, nav visible. Handpickable: search-first landing + card grid.
- **CSS:** `[data-design="11"] .search-landing` centered 32rem, `[data-design="11"] .room-body` grid cards, `[data-design="11"] .site-shell` same but `.room-heading` with small search.

### 12 — Question-Driven Disclosure (variant 18)
- **Idea:** Buttons "Where did this come from?" / "Who is related?" / "What is background?" Each reveals piece-meal
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 44rem centered, top question row `.question-row` flex gap 0.5rem, buttons "Where from?" "Who related?" "Background?" Each button toggles drawer below with plain language answer.
- **Rooms:** Reader top 3 question buttons, clicking reveals where from (origin, lineage, time, place), who related (related works, teachers), background (historical, doctrinal). Compare/Lineage/Cases/Terms same 3 questions per unit.
- **Why usable:** Question-driven reduces mental load, plain language, piece meal, English first, nav visible. Handpickable: question buttons + drawer answers.
- **CSS:** `[data-design="12"] .question-row`, `[data-design="12"] .question-drawer` border 1px solid var(--line) border-radius var(--radius) background var(--panel) padding 1rem margin-top 0.5rem, `[data-design="12"] .room-body` 44rem.

### 13 — Side-by-Side Minimal (variant 21)
- **Idea:** English left, Chinese right collapsed by default, toggle expand
- **Shell:** `.room-body` grid 1fr 1fr gap 1.5rem for Reader, left `.en-pane` English first, right `.zh-pane` collapsed behind toggle "Show Chinese" with Chinese + pinyin + provenance. For other rooms, left English summary, right details collapsed.
- **Rooms:** Reader side-by-side, Compare side-by-side witnesses, Lineage side-by-side teacher names + details, Cases side-by-side title + theme, Terms side-by-side headword + definition.
- **Why usable:** English first left, Chinese optional right, not dense, comfortable, nav + filter visible, side-by-side not hidden behind [i]. Handpickable: side-by-side grid + collapse toggle.
- **CSS:** `[data-design="13"] .room-body` grid 1fr 1fr, `[data-design="13"] .en-pane`, `[data-design="13"] .zh-pane` collapsed, `[data-design="13"] .site-shell` same.

### 14 — Related Rail (variant 23)
- **Idea:** Right rail shows only related works/teachers minimal, expands on hover to show why related
- **Shell:** `.room-body` grid 1fr 18rem gap 1.5rem, left main English, right `.related-rail` sticky top var(--shell-height) background var(--sunken) border-left 1px solid var(--line) padding 1rem, rail shows related teachers/works minimal (name + era), hover expands card with why related (one-line plain language).
- **Rooms:** Reader right rail related teachers, Compare related witnesses, Lineage related works, Cases related teachers, Terms related cases.
- **Why usable:** Related rail gives context without hiding, hover shows why related, nav + filter visible, English first. Handpickable: related rail + hover expand.
- **CSS:** `[data-design="14"] .room-body` grid 1fr 18rem, `[data-design="14"] .related-rail`, `[data-design="14"] .related-card` hover.

### 15 — Footnotes + Glossary (variants 28 + 24)
- **Idea:** Background context as footnotes at bottom, toggle footnotes section, technical terms dotted underline hover shows plain language explanation piece-meal
- **Shell:** `.room-body` max-width 44rem centered, main English, footnotes section bottom `.footnotes` border-top 1px solid var(--line) padding-top 1rem margin-top 2rem, toggle "Show footnotes" button. Terms dotted underline `.glossary-term` border-bottom 1px dotted var(--gold), hover shows tooltip plain language.
- **Rooms:** Reader footnotes for background context, glossary terms for technical terms. Compare footnotes for collation context, Lineage footnotes for generation context, Cases footnotes for theme context, Terms footnotes for etymology.
- **Why usable:** Footnotes familiar pattern, glossary hover plain language, not dense, comfortable, nav + filter visible. Handpickable: footnotes + glossary tooltip.
- **CSS:** `[data-design="15"] .footnotes`, `[data-design="15"] .glossary-term` dotted, `[data-design="15"] .glossary-tooltip` absolute.

## Implementation Steps

1. Branch from main 1b5d929: `git checkout main; git pull; git checkout -b feature/phase5-bundle-8-15-usable-handpick`
2. Edit app.css: keep 1-7 untouched (1 no override, 2 byte-identical 31 lines, 3-7 truly drastic from PR79 400+ lines each), add new section Layouts 8-15 each 300-600 lines overriding shell+nav+body but keeping nav + filter visible (except where search-first), visually distinct but usable, handpickable elements.
3. Edit app.js: extend DESIGN_VARIANTS 1-15 labels "8 Tabbed+Breadcrumb", "9 Bottom Sheet", "10 Sticky TOC", "11 Search-First", "12 Question-Driven", "13 Side-by-Side", "14 Related Rail", "15 Footnotes+Glossary", keep applyDesignVariant, extend enhanceRoomLayout for 8-15 per specs (create tabs, bottom sheet, TOC pane, search landing, question row, side-by-side, related rail, footnotes).
4. Mirror docs/: cp app.css docs/app.css; cp app.js docs/app.js; cp app_data.js docs/app_data.js (byte-identical rebuild via build_data_bundle.py)
5. Build: python3 scripts/build_data_bundle.py must produce byte-identical 1,693,251 B unchanged
6. Gates: text integrity MUST PASS (py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build deterministic, preservation 0 unauthorized, review 138), presentation allowed to break (smoke, diff -rq continue-on-error per RULING_GATES_EXPERIMENT), law gate must PASS (website ruling + common qualities)
7. Bundle raw <30MB (expect ~3.5MB with 15 layouts)
8. Live demo: switcher 1-15, 8-15 new more usable, handpickable elements

## LAW — Must Be In Prompt And PR Description Verbatim

**RULING 2026-09-14 definitive verbatim law:**
"In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask 'does this look good?', 'Is this the right direction?', 'how good is it on a scale from 1-10 where we aim for at least 8?'. This is definitive."

**COMMON_QUALITIES 2026-09-14 verbatim:**
"All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is."

**Additional rulings:**
- RULING_BUNDLE_CEILING_2026-09-14: Bundle ceiling 30MB testing phase, technically feasible
- RULING_GATES_EXPERIMENT_2026-09-14: Text integrity required, presentation optional while experimenting, allowed to break presentation
- Colors of 1 ideal already, whole issue is website design, layout-focused vary structure for light mental load
- 3-7 truly drastic now live main 1b5d929 per PR79, good news drastic changes, less good not usable yet, but individual elements handpickable for targeted page build later, implement more examples 8-15 before review

## Acceptance Criteria

- [ ] PR from feature/phase5-bundle-8-15-usable-handpick to main, base 1b5d929
- [ ] Keeps 1-7 untouched (1 no override, 2 byte-identical, 3-7 truly drastic from PR79)
- [ ] Adds 8-15 more usable: 8 Tabbed+Breadcrumb, 9 Bottom Sheet, 10 Sticky TOC 16rem/1fr/16rem, 11 Search-First landing, 12 Question-Driven Where from/Who related/Background, 13 Side-by-Side English/Chinese collapsed, 14 Related Rail 18rem hover why related, 15 Footnotes+Glossary dotted hover plain language
- [ ] Each 8-15 overrides shell+nav+body grid but keeps nav + filter visible (or accessible), visually distinct but usable, 300-600 lines CSS each, handpickable elements
- [ ] All share ideal colors of 1, implement common qualities 34/34 teachers 24/24 cases 31/31 terms 4/4 lines measured
- [ ] Switcher 1-15 live, persistent
- [ ] Text integrity PASS: py_compile, validate_data, build deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138
- [ ] Presentation allowed to break but law gate PASS
- [ ] Bundle <30MB
- [ ] No style=, 4 setProperty, CSP untouched, no corpus edits
- [ ] PR description includes LAW verbatim + COMMON_QUALITIES + why 3-7 not usable yet but handpickable + what we're doing to allow drastic+usable + roadmap 8-15 + questions per LAW

## BANNED COMMANDS

- NEVER git show <sha> on bundle commit — use --name-only or --stat or ls -lh app_data.js
- NEVER git log -p on bundle
- NEVER edit data/ corpus or app_data.js manually — only via build_data_bundle.py

## Questions Per LAW (must ask in PR)

- Does this bundle 8-15 more usable look good compared to 3-7 not usable yet?
- Is this the right direction — keep nav+filter visible, more usable, handpickable elements for targeted build later, before review?
- How good is it 1-10 where we aim at least 8? Overall and per 8-15?
- Which of 8-15 feels most usable and handpickable? Which elements to handpick for targeted page build?
- Which room closest/furthest? Info sections more/less?
