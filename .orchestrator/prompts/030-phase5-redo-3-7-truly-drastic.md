# Phase 5 — Redo 3-7 Truly Drastic — Keep 1 and 2, Completely Redo 3-7

## Base
- **Base branch:** `main` at `ffa139a` (PR #78 merged — keep 1 and 2, reimplement 2-6 as 3-7 but still minor, numbers 1-7 live, bundle 2.1MB)
- **Target branch:** `feature/phase5-redo-3-7-truly-drastic`
- **Task:** Completely redo 3-7 as truly drastic layouts per owner request "3-7 must be completely redone in next batch". Keep 1 and 2 untouched. 2 double no longer needed — 3-7 new truly drastic. Each adds number, switcher 1-7 live, visually distinct at first glance, not 7x same shell.

## Context — Why 1-7 Look Same + What We're Doing To Allow Drastic

**Why same (measured):**
- `docs/app.css` 3260 lines: 1 = no override ideal, 2 = 31 lines `.acc-sec`, 3 = 48 lines `.rm-acc`, 4 = 18 lines `.rm-pending`, 5 = 140 lines `.layout-tabs`, 6 = 35 lines `.rm-info-doorway`, 7 = 20 lines `.hover-cardable` — total new CSS ~292 lines scoped to disclosure widgets, no shell/grid change.
- Same shell `.site-shell` walnut lintel 1400px, `.room-nav` sidebar 5 rooms, `.room-heading`, `.room-filter-rail`, `.room-body` — no layout overrides shell.
- Same HTML from `renderReader()`, `renderMatrix()`, `renderLineage()`, `renderGongan()`, `renderLexicon()` identical for 1-7, then `enhanceRoomLayout()` wraps in `<details>`/tabs/modal/hover — post-process patch, not alternative template.
- Bundle 2,098,979 B ~2.1MB, still old 2MB mindset.

**What we're doing to allow drastic (technical measures, must be in PR description):**

1. **Bundle ceiling 2MB -> 30MB testing (RULING_BUNDLE_CEILING_2026-09-14.md PR #76):** Quality workflow does NOT check bundle size directly. 30MB allows 28MB extra CSS/JS = 5 layouts each 1000 lines CSS + alternative renderers. Next batch MUST use headroom, not stay at 2.1MB. Enforcement: `test_website_ruling.py` allows <30MB during testing.

2. **Presentation gates OFF while experimenting (RULING_GATES_EXPERIMENT_2026-09-14.md PR #77):** Text integrity gates REQUIRED failing: py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build_data_bundle deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138 PASS. Presentation gates OPTIONAL continue-on-error: smoke_test 35 texts, diff -rq docs mirror, git diff app_data.js docs. Agents CAN rewrite shell/nav/grid even if smoke fails, as long as text integrity PASS. Website ruling gate kept ON (law + common qualities).

3. **Roadmap — what must change to be truly drastic:**
   - MUST override shell: `[data-design="X"] .site-shell, .shell-frame, .shell-lintel, .room-nav, .room-heading, .room-filter-rail, .room-body` — change display, grid-template-columns, max-width, padding, margin, gap, position, overflow, height. Not just `.rm-acc`.
   - MUST change navigation paradigm: sidebar vs hamburger vs timeline horizontal vs split 32/68 vs bottom sheet vs focus vs dossier — not same sidebar 5 rooms.
   - MUST change grid/measure/whitespace: centered 38rem vs horizontal scroll vs card wall vs full-bleed vs dossier inverted — visually distinct at first glance.
   - MUST change IA order: info-first vs translation-first vs timeline vs graph — reorder DOM via CSS order or JS prepend/append, not just hide/show.
   - MUST be alternative renderer, not post-process wrapper: edit render* paths or create new render function per layout that produces different DOM structure.
   - Keep ideal colors of 1: keep :root primitives exactly — only structure varies per owner "colors of 1 ideal already".
   - Keep common qualities: light mental load minimum default expand/hover/toggle, English first, not dense, comfortable, piece meal plain language, info section every work/teacher.
   - Each adds number: switcher 1-7 persistent localStorage.
   - Banned: style= attributes 0, only 4 setProperty (--shell-height, --zh-font-size, --pop-shift x2), CSP style-src 'self' https://fonts.googleapis.com no unsafe-inline, app_data.js byte-identical, no Chinese edits.

## New 3-7 Completely Redone — Specs (must be truly drastic, keep 1 and 2)

### Keep
- **1 — Classic scroll ideal:** No `[data-design="1"]` rule, :root base untouched — ideal colors you said ideal
- **2 — Accordion Reader kept:** Owner saw improvements, keep byte-identical 2,336 chars enhanceAccordionReader + CSS byte-identical — inner sections fold (Translation/Chinese/Notes/Context) only English open by default

### Redo Completely — 3-7 New Truly Drastic (each 300-800 lines CSS, visually distinct)

**3 — Focus Mode (variant 13 from LAYOUT_VARIANTS):**
- Shell: `[data-design="3"] .site-shell` height 2.8rem, background var(--wood) but border-bottom none, `.shell-frame` padding 0.5rem 1rem, `.room-nav` display none, `.room-filter-rail` display none, `.room-heading` display none, hero `.hero` display none, `.brand-mark` hidden, `.brand` only text.
- Reader: `#reader-content-target` max-width 38rem margin 0 auto, padding 3rem 1rem, line-height 1.9, font-size 1.15rem, `.translation-grid` only English visible, `.classical-zh, .pinyin-line, .provenance-line, .ledger-drawer` hidden behind tiny [i] button at end of each unit that toggles drawer. Other rooms: same centered minimal, only English headlines, details behind [i].
- Why drastic: No sidebar, no filter, no hero, whitespace 3x, centered reading — first glance instantly different from 1. Must override shell+nav+body.
- Common qualities: Minimum default English only, extra behind [i] expand, info sections behind [i] drawer plain language where from / related / background.

**4 — Timeline View (variant 15):**
- Shell: `[data-design="4"] .site-shell` same walnut but `.room-body` display flex flex-direction row overflow-x auto scroll-snap-type x mandatory, gap 1.5rem, padding 2rem 1rem, timeline line `::before` absolute top 50% height 2px background var(--line) gold, `.room-heading` position sticky left 0 background var(--paper) z-index 2.
- Rooms: Lineage becomes horizontal timeline by generation — each `.lineage-band` width 22rem flex-shrink 0 scroll-snap-align start, card. Matrix becomes timeline by dynasty — each `.matrix-proof-sheet` width 24rem. Gongan becomes timeline by theme — each `.catalogue-row` width 20rem. Lexicon becomes A-Z rail horizontal — each `.lexicon-entry` width 18rem. Reader becomes chapter chunks on timeline — each `.case-card` width 26rem.
- Why drastic: Horizontal scroll, not vertical list. No other layout does horizontal. Must change `.room-body` display from block to flex row.
- Common qualities: Only era/name visible default, where-from / related / background behind click expand card.

**5 — Graph + Reader Split (variant 16):**
- Shell: `[data-design="5"] .room-body` display grid grid-template-columns 32% 68% gap 0 min-height calc(100vh - var(--shell-height)), left panel `.rm-graph-pane` background var(--sunken) border-right 1px solid var(--line) position sticky top var(--shell-height) height calc(100vh - var(--shell-height)) overflow-y auto padding 1rem, right panel `.rm-reader-pane` padding 2rem overflow-y auto.
- Rooms: JS creates left dots nav: for Lineage, dots for each master (div 8px circle, gold active), clicking dot scrolls right to teacher dossier. For Matrix, 4 witness dots. For Reader, TOC dots per case. For Gongan/Lexicon, index dots. Right pane shows detail English first.
- Why drastic: Split-screen two persistent panes, first layout with left nav sticky + right scroll. Must create new DOM split container via JS, not just wrap.
- Common qualities: Left minimal dots light load, right English first, extra behind hover/click.

**6 — Minimal Header + Hamburger (variant 27):**
- Shell: `[data-design="6"] .site-shell` height 3rem min-height 3rem, `.shell-frame` padding 0.5rem 1rem, `.shell-lintel` justify-content space-between, `.brand` only "TranslateChan" text no mark, `.room-nav` display none, hamburger button `.hamburger-btn` display block top-right (three lines), when open adds `.nav-open` class to html, `.room-nav` becomes drawer overlay position fixed top 3rem right 0 width 18rem height calc(100vh - 3rem) background var(--panel) border-left 1px solid var(--line) z-index 200 overflow-y auto padding 1rem, `.room-filter-rail` inside drawer hidden by default visible when drawer open, `.room-heading` font-size 1.2rem margin 3rem 0 1rem, `.room-body` max-width 42rem margin 0 auto padding 0 1rem.
- Reader: max-width 42rem, generous whitespace, no case rail visible unless hamburger open.
- Why drastic: No sidebar, no filter rail visible, header 50% smaller, whitespace 2x, hamburger paradigm — first glance different.
- Common qualities: Minimal default only English, everything extra behind hamburger drawer expand, info sections inside drawer plain language.

**7 — Info-First Dossier (variant 22):**
- Shell: `[data-design="7"] .room-body` display flex flex-direction column, `.front-matter` / `.ledger-drawer` / context moved to top via CSS order -1 or JS prepend, translation grid order 1, border-top 2px solid var(--gold) padding-top 1.5rem.
- Rooms: Reader top dossier: witness coverage, where from, related teachers, background plain language, then button "Read translation" expands English+Chinese (translation grid display none by default, button toggles). Matrix top dossier: what is collation, where from, related, background. Lineage top dossier: generation context. Gongan top: theme context. Lexicon top: headword context.
- Why drastic: Inverts 1 (which is translation-first). First layout where info section is hero, translation secondary collapsed — IA inverted.
- Common qualities: Info section plain language piece meal at top, translation behind toggle, English first within translation, info sections for every work/teacher.

Each 3-7 must:
- Override shell+nav+body grid (CSS must contain `[data-design="X"] .site-shell` and `[data-design="X"] .room-nav` and `[data-design="X"] .room-body`)
- Be visually distinct at first glance (screenshot diff)
- 300-800 lines CSS each, 20-50 lines JS reorder
- Keep ideal colors of 1 (no new :root primitives)
- Implement common qualities measured 34/34 teachers 24/24 cases 31/31 terms 4/4 lines
- Bundle <30MB (expect ~2.5MB)

## Implementation Steps

1. Branch from main ffa139a: `git checkout main; git pull; git checkout -b feature/phase5-redo-3-7-truly-drastic`
2. Edit app.css: keep :root and dark and layout 1-2 untouched (2 byte-identical), completely replace layout 3-7 CSS with new truly drastic blocks per specs above, each 300-800 lines overriding shell+nav+body.
3. Edit app.js: keep DESIGN_VARIANTS 1-7 but labels new "3 Focus", "4 Timeline", "5 Graph+Split", "6 Hamburger", "7 Dossier", keep applyDesignVariant, keep enhanceAccordionReader byte-identical for 2, completely redo enhanceRoomLayout for 3-7 per specs (create split, timeline track, hamburger drawer, focus centered, dossier reorder).
4. Mirror docs/: cp app.css docs/app.css; cp app.js docs/app.js; cp app_data.js docs/app_data.js (byte-identical rebuild via build_data_bundle.py)
5. Build: python3 scripts/build_data_bundle.py must produce byte-identical 1,693,251 B unchanged
6. Gates: text integrity MUST PASS (py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build deterministic, preservation 0 unauthorized, review 138), presentation allowed to break (smoke, diff -rq continue-on-error), law gate must PASS (website ruling + common qualities)
7. Bundle raw <30MB
8. Live demo: switcher 1-7, 3-7 new truly drastic, 1-2 kept, visually distinct

## LAW — Must Be In Prompt And PR Description Verbatim

**RULING 2026-09-14 definitive verbatim law:**
"In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask 'does this look good?', 'Is this the right direction?', 'how good is it on a scale from 1-10 where we aim for at least 8?'. This is definitive."

**COMMON_QUALITIES 2026-09-14 verbatim:**
"All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is."

**Additional rulings:**
- RULING_BUNDLE_CEILING_2026-09-14: Bundle ceiling 30MB testing phase, technically feasible
- RULING_GATES_EXPERIMENT_2026-09-14: Text integrity required, presentation optional while experimenting, allowed to break presentation
- Colors of 1 ideal already, whole issue is website design, layout-focused vary structure for light mental load
- 3-7 must be completely redone in next batch per owner

## Acceptance Criteria

- [ ] PR from feature/phase5-redo-3-7-truly-drastic to main, base ffa139a
- [ ] Keeps 1 Classic scroll ideal no override, 2 Accordion Reader byte-identical kept
- [ ] Completely redoes 3-7 as truly drastic per specs: 3 Focus Mode centered 38rem no sidebar, 4 Timeline horizontal scroll, 5 Graph+Reader split 32/68, 6 Hamburger minimal header, 7 Info-First dossier inverted
- [ ] Each 3-7 overrides shell+nav+body grid, visually distinct at first glance, 300-800 lines CSS each
- [ ] All share ideal colors of 1, implement common qualities 34/34 teachers 24/24 cases 31/31 terms 4/4 lines measured
- [ ] Switcher 1-7 live, 3-7 new truly drastic
- [ ] Text integrity PASS: py_compile, validate_data, build deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138
- [ ] Presentation allowed to break but law gate PASS
- [ ] Bundle <30MB
- [ ] No style=, 4 setProperty, CSP untouched, no corpus edits
- [ ] PR description includes LAW verbatim + COMMON_QUALITIES + why 1-7 same + what we're doing to allow drastic (bundle 30MB + presentation OFF + shell+nav+grid+IA must change) + roadmap + questions per LAW

## BANNED COMMANDS

- NEVER git show <sha> on bundle commit — use --name-only or --stat or ls -lh app_data.js
- NEVER git log -p on bundle
- NEVER edit data/ corpus or app_data.js manually — only via build_data_bundle.py

## Questions Per LAW (must ask in PR)

- Does this redo of 3-7 truly drastic look good compared to previous minor 3-7?
- Is this the right direction — shell+nav+grid+IA changes, alternative renderer not wrapper, bundle 30MB, presentation OFF?
- How good is it 1-10 where we aim at least 8? Overall and per 3-7?
- Which of new 3-7 feels 8+? Which room closest/furthest?
- Info sections more/less?
