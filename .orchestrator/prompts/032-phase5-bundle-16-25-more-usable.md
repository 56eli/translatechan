# Phase 5 — Bundle 16-25 More Usable Handpick — Keep 1-15, Add 16-25 Before Review

## Base
- **Base branch:** `main` at `7cdf4b1` (PR #80 merged — bundle 8-15 usable handpick: keep 1-7, add 8 Tabbed+Breadcrumb, 9 Bottom Sheet, 10 Sticky TOC 16rem/1fr/16rem, 11 Search-First, 12 Question-Driven, 13 Side-by-Side, 14 Related Rail, 15 Footnotes+Glossary, switcher 1-15 live, bundle <30MB, text integrity PASS, presentation OFF allowed to break)
- **Target branch:** `feature/phase5-bundle-16-25-more-usable`
- **Task:** Keep 1-15 untouched (1 ideal, 2 kept, 3-7 truly drastic PR79 Focus/Timeline/Graph+Split/Hamburger/Dossier, 8-15 usable handpick PR80), add 16-25 as 10 NEW more usable layouts with handpickable elements for targeted page build later. Each adds number, switcher 1-25 live, visually distinct but usable (nav visible, filter visible, English first). Before review per owner "Lets first implement more examples before going into review" + "now next stub for 16-25".

## Context — 1-15 Live, 3-7 Drastic But Not Usable, 8-15 Usable Handpickable, Need More Examples

Main 7cdf4b1 live https://56eli.github.io/translatechan/ 1-15:
- 1 Classic ideal no override, 2 Accordion Reader byte-identical kept
- 3-7 truly drastic PR79: 3 Focus 38rem centered no sidebar whitespace 3x, 4 Timeline horizontal scroll cards 18-26rem gold rail, 5 Graph+Reader split 32% dots sticky / 68% reader new DOM split, 6 Hamburger 3rem header nav in drawer 42rem body, 7 Dossier info-first inverted — good news drastic changes, less good not usable yet, but individual elements handpickable
- 8-15 usable handpick PR80: 8 Tabbed+Breadcrumb, 9 Bottom Sheet, 10 Sticky TOC, 11 Search-First, 12 Question-Driven, 13 Side-by-Side, 14 Related Rail, 15 Footnotes+Glossary — each 300-600 lines CSS, nav visible filter reachable English first info sections 34/34 24/24 31/31 4/4, ideal colors, visually distinct but usable, handpickable elements

Need more examples before review: 16-25 as 10 new more usable with handpickable elements, building on 8-15 usability.

**What we're doing to allow drastic + usable:**
- Bundle ceiling 30MB testing per RULING_BUNDLE_CEILING_2026-09-14.md PR #76 — Quality workflow doesn't check size, allows 28MB extra CSS/JS, key assets 2.30MB raw at 1-15, 16-25 will be ~3.5MB raw still <30MB
- Presentation gates OFF while experimenting per RULING_GATES_EXPERIMENT_2026-09-14.md PR #77 — text integrity REQUIRED (py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138), presentation OPTIONAL continue-on-error (smoke 35 texts, diff -rq mirror, git diff app_data.js docs) — agents CAN rewrite shell/nav/grid even if smoke fails
- Roadmap: MUST override shell+nav+body grid, MUST change nav paradigm but KEEP nav visible or easily accessible, MUST change measure/whitespace but KEEP English first visible, MUST keep filter visible or in accessible drawer, MUST be alternative renderer not wrapper, keep ideal colors of 1, keep common qualities light mental load English first not dense comfortable piece meal info sections

## 16-25 New Layouts — More Usable + Handpickable (each 300-600 lines CSS, visually distinct, usable)

### 16 — Progressive Disclosure Scroll (variant 7)
- **Idea:** As you scroll, more context appears piece-meal, not all at once
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 44rem centered, `.progressive-unit` initially only English visible, as scroll near viewport add class `.revealed` via IntersectionObserver that shows Chinese + context + related with fade-in. Progress bar top thin gold shows how far.
- **Rooms:** Reader each case reveals context on scroll, Matrix reveals witnesses on scroll, Lineage reveals teacher dossier on scroll, Cases reveals theme on scroll, Terms reveals occurrences on scroll.
- **Why usable:** Progressive reduces mental load, piece-meal, English first, nav + filter visible, scroll natural. Handpickable: scroll reveal + progress bar.
- **CSS:** `[data-design="16"] .room-body` 44rem, `[data-design="16"] .progressive-unit` opacity 0.95, `[data-design="16"] .progressive-unit.revealed` opacity 1, `[data-design="16"] .progress-bar` fixed top.

### 17 — Modal Info (variant 9)
- **Idea:** Info sections open in modal overlay, not inline. Main view minimal
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 46rem centered English only, info buttons `ⓘ` per unit open modal overlay with where from / who related / background plain language. Modal chrome shared, backdrop click close, Esc close, focus trap.
- **Rooms:** Reader each case has ⓘ for context, Matrix each witness has ⓘ, Lineage each teacher has ⓘ, Cases each case has ⓘ, Terms each term has ⓘ.
- **Why usable:** Main minimal English, extra behind modal not inline, nav + filter visible, modal familiar. Handpickable: modal info component.
- **CSS:** `[data-design="17"] .room-body` 46rem, `[data-design="17"] .modal-root` fixed overlay, `[data-design="17"] .modal-panel` centered.

### 18 — Hover Cards (variant 10)
- **Idea:** Related teachers/works as hover cards on English names, not inline list
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 46rem centered, English names `.hover-cardable` dotted underline gold, hover/focus shows card with teacher/work info (where from, who related, background) plain language, card positioned near name.
- **Rooms:** Reader hover teacher names, Matrix hover witness names, Lineage hover teacher names, Cases hover protagonist names, Terms hover related terms.
- **Why usable:** Hover reduces inline clutter, English first, extra behind hover, nav + filter visible. Handpickable: hover cards.
- **CSS:** `[data-design="18"] .hover-cardable` dotted, `[data-design="18"] .hover-card` absolute card.

### 19 — Sentence-by-Sentence (variant 19)
- **Idea:** Each English sentence has [i] toggling Chinese + context for that sentence only
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 44rem centered, each English sentence `.sentence` with [i] button inline, clicking shows Chinese + pinyin + provenance + ledger for that sentence only in drawer below sentence.
- **Rooms:** Reader sentence-by-sentence, Matrix sentence per witness, Lineage sentence per teacher, Cases sentence per case, Terms sentence per definition.
- **Why usable:** Sentence granularity piece-meal, English first, Chinese optional per sentence, nav + filter visible. Handpickable: sentence [i] + per-sentence drawer.
- **CSS:** `[data-design="19"] .sentence`, `[data-design="19"] .sentence-drawer` border.

### 20 — Chapter Chunks (variant 20)
- **Idea:** Long texts broken into small chunks with "Continue", each chunk optional context toggle
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 44rem centered, text broken into chunks `.chunk` 2-3 paragraphs each, "Continue" button bottom of each chunk reveals next chunk, each chunk has "Show context" toggle for where from / related / background.
- **Rooms:** Reader chunks per case, Matrix chunks per witness group, Lineage chunks per generation, Cases chunks per theme, Terms chunks per letter.
- **Why usable:** Chunks reduce mental load, Continue gives control, context toggle per chunk, nav + filter visible. Handpickable: chunk + Continue + context toggle.
- **CSS:** `[data-design="20"] .chunk`, `[data-design="20"] .continue-btn`.

### 21 — Work Dossier Page (variant 25)
- **Idea:** Dedicated page per work: header info witness + coverage where from, related teachers, background, then translation expandable
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 48rem centered, top dossier `.work-dossier` with witness coverage, where from, related teachers, background plain language, then translation collapsed behind "Read translation" button per work.
- **Rooms:** Reader work dossier top, Matrix work dossier, Lineage work dossier, Cases work dossier, Terms work dossier (headword dossier).
- **Why usable:** Dossier gives context first, translation optional, English first within dossier, nav + filter visible. Handpickable: work dossier component.
- **CSS:** `[data-design="21"] .work-dossier` border-top gold, `[data-design="21"] .room-body` 48rem.

### 22 — Teacher Dossier Page (variant 26)
- **Idea:** Dedicated page per teacher: origin, teacher/disciples, background, related works, expandable
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 48rem centered, teacher dossier `.teacher-dossier` with origin, teacher/disciples, background, related works plain language, then quotes/works expandable.
- **Rooms:** Lineage teacher dossier, Reader teacher dossier per case, Matrix teacher dossier, Cases teacher dossier, Terms teacher dossier.
- **Why usable:** Teacher context first, works optional, nav + filter visible. Handpickable: teacher dossier.
- **CSS:** `[data-design="22"] .teacher-dossier`.

### 23 — Two-Step Reader (variant 29)
- **Idea:** First shows only first paragraph English + "Read more" + "Show context", second reveals rest piece-meal
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 44rem centered, first paragraph visible, "Read more" button reveals rest, "Show context" button reveals where from / related / background drawer.
- **Rooms:** Reader two-step per case, Matrix two-step per witness, Lineage two-step per teacher, Cases two-step per case, Terms two-step per term.
- **Why usable:** Two-step reduces initial load, Read more gives control, context toggle, nav + filter visible. Handpickable: two-step + Read more.
- **CSS:** `[data-design="23"] .two-step`, `[data-design="23"] .read-more-btn`.

### 24 — Command Palette (variant 30)
- **Idea:** Palette to jump to work/teacher, keeps UI minimal, extra behind palette (cmd+k)
- **Shell:** Keep shell + nav + filter visible but minimal, `.room-body` max-width 46rem centered English, palette `.cmd-palette` fixed center overlay hidden by default, cmd+k or button opens palette with search input + results minimal cards for works/teachers/cases/terms, selecting jumps to room and scrolls to unit.
- **Rooms:** All rooms palette search, results cards plain English.
- **Why usable:** Palette reduces nav clutter, minimal UI, quick jump, nav still visible but palette faster. Handpickable: command palette.
- **CSS:** `[data-design="24"] .cmd-palette` overlay, `[data-design="24"] .room-body` 46rem.

### 25 — Bookmark Trail + Prev/Next + Slider + Inline Origin (variants 31+33+34+35)
- **Idea:** Bookmark trail bottom shows where you came from in plain language, contextual prev/next shows related work/teacher with one-line why related, comparison slider for variant witnesses, inline teacher origin hover expands where from + teacher/disciples + background
- **Shell:** Keep shell + nav + filter visible, `.room-body` max-width 46rem centered, bottom `.bookmark-trail` fixed bottom 0 left 0 right 0 background var(--panel) border-top 1px solid var(--line) padding 0.5rem 1rem shows trail plain language, prev/next bottom `.prev-next` flex row gap 1rem with related work/teacher cards why related, slider `.comparison-slider` for Matrix witnesses range input, inline origin `.inline-origin` dotted underline teacher name hover expands dossier.
- **Rooms:** All rooms trail + prev/next, Matrix slider, Lineage inline origin.
- **Why usable:** Trail gives orientation, prev/next gives related, slider gives comparison, inline origin gives teacher context, nav + filter visible. Handpickable: trail + prev/next + slider + inline origin.
- **CSS:** `[data-design="25"] .bookmark-trail`, `[data-design="25"] .prev-next`, `[data-design="25"] .comparison-slider`, `[data-design="25"] .inline-origin`.

## Implementation Steps

1. Branch from main 7cdf4b1: `git checkout main; git pull; git checkout -b feature/phase5-bundle-16-25-more-usable`
2. Edit app.css: keep 1-15 untouched (1 no override, 2 byte-identical, 3-7 truly drastic PR79, 8-15 usable PR80), add new section Layouts 16-25 each 300-600 lines overriding shell+nav+body but keeping nav+filter visible, visually distinct but usable, handpickable elements.
3. Edit app.js: extend DESIGN_VARIANTS 1-25 labels "16 Progressive", "17 Modal Info", "18 Hover Cards", "19 Sentence-by-Sentence", "20 Chapter Chunks", "21 Work Dossier", "22 Teacher Dossier", "23 Two-Step", "24 Command Palette", "25 Trail+PrevNext+Slider+Inline", keep applyDesignVariant, extend enhanceRoomLayout for 16-25 per specs.
4. Mirror docs/: cp app.css docs/app.css; cp app.js docs/app.js; cp app_data.js docs/app_data.js (byte-identical rebuild via build_data_bundle.py)
5. Build: python3 scripts/build_data_bundle.py must produce byte-identical 1,693,251 B unchanged
6. Gates: text integrity MUST PASS (py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build deterministic, preservation 0 unauthorized, review 138), presentation allowed to break (smoke, diff -rq continue-on-error per RULING_GATES_EXPERIMENT), law gate must PASS (website ruling + common qualities)
7. Bundle raw <30MB (expect ~5MB with 25 layouts)
8. Live demo: switcher 1-25, 16-25 new more usable, handpickable elements

## LAW — Must Be In Prompt And PR Description Verbatim

**RULING 2026-09-14 definitive verbatim law:**
"In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask 'does this look good?', 'Is this the right direction?', 'how good is it on a scale from 1-10 where we aim for at least 8?'. This is definitive."

**COMMON_QUALITIES 2026-09-14 verbatim:**
"All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is."

**Additional rulings:**
- RULING_BUNDLE_CEILING_2026-09-14: Bundle ceiling 30MB testing phase, technically feasible
- RULING_GATES_EXPERIMENT_2026-09-14: Text integrity required, presentation optional while experimenting, allowed to break presentation
- Colors of 1 ideal already, whole issue is website design, layout-focused vary structure for light mental load
- 1-15 live main 7cdf4b1: 1 ideal, 2 kept, 3-7 truly drastic but not usable yet handpickable, 8-15 usable handpickable, now 16-25 more usable before review

## Acceptance Criteria

- [ ] PR from feature/phase5-bundle-16-25-more-usable to main, base 7cdf4b1
- [ ] Keeps 1-15 untouched (1 no override, 2 byte-identical, 3-7 truly drastic PR79, 8-15 usable PR80)
- [ ] Adds 16-25 more usable: 16 Progressive Scroll, 17 Modal Info, 18 Hover Cards, 19 Sentence-by-Sentence, 20 Chapter Chunks, 21 Work Dossier, 22 Teacher Dossier, 23 Two-Step, 24 Command Palette, 25 Trail+PrevNext+Slider+InlineOrigin
- [ ] Each 16-25 overrides shell+nav+body grid but keeps nav+filter visible, visually distinct but usable, 300-600 lines CSS each, handpickable elements
- [ ] All share ideal colors of 1, implement common qualities 34/34 teachers 24/24 cases 31/31 terms 4/4 lines measured
- [ ] Switcher 1-25 live, persistent
- [ ] Text integrity PASS: py_compile, validate_data, build deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138
- [ ] Presentation allowed to break but law gate PASS
- [ ] Bundle <30MB
- [ ] No style=, 4 setProperty, CSP untouched, no corpus edits
- [ ] PR description includes LAW verbatim + COMMON_QUALITIES + why 3-7 not usable but handpickable + why 8-15 usable handpickable + roadmap 16-25 + questions per LAW

## BANNED COMMANDS

- NEVER git show <sha> on bundle commit — use --name-only or --stat or ls -lh app_data.js
- NEVER git log -p on bundle
- NEVER edit data/ corpus or app_data.js manually — only via build_data_bundle.py

## Questions Per LAW (must ask in PR)

- Does this bundle 16-25 more usable look good compared to 8-15?
- Is this the right direction — keep nav+filter visible, more usable, handpickable elements for targeted build later, before review?
- How good is it 1-10 where we aim at least 8? Overall and per 16-25?
- Which of 16-25 feels most usable and most handpickable? Which elements to handpick for targeted page build?
- Which room closest/furthest? Info sections more/less?
