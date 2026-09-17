# Phase 5 — Truly Drastic Roadmap 8-12 — Why 1-7 Look Same + How To Fix

## Base
- **Base branch:** `main` at `ffa139a` (PR #78 merged — keep 1 and 2, reimplement 2-6 as 3-7 drastic ALL rooms, numbers 1-7 live, bundle 2.1MB <30MB)
- **Target branch:** `feature/phase5-truly-drastic-8-12-roadmap`
- **Task:** Implement 5 NEW truly drastic layouts 8-12 that are visually distinct websites, not 7x same shell + widget. Keep 1-7 untouched. Each adds number on switcher (now 1-12). Must be drastic across ALL rooms.

## Context — Why 1-7 Look Basically Same Even After Drastic Permission

Owner feedback 2026-09-14: "We've moved from 'very minor' in first batch to 'minor' changes. Changes appreciated but it's very much seven times the same website. Can you elaborate why all seven examples look basically the same? Even after permission for drastic changes has been given?"

**Measured on main ffa139a `docs/app.css` 3260 lines, `docs/app.js` 5000+ lines:**

1. **Same shell in all 7:** `.site-shell` walnut lintel, `.shell-frame` max-width 1400px, `.shell-lintel` brand left / controls right, `.room-nav` sidebar 5 rooms, `.room-heading`, `.room-filter-rail`, `.room-body` — no layout overrides any of those except hiding small parts. All 7 share identical masthead, hero beam, sidebar nav, filter rail, footer.

2. **Same token sheet:** `:root` primitives `--paper #f4efe5, --panel #fbf8f1, --line #d8cbb8, --ink #2c2523, --gold #8b622b, --wood #211814` — no layout overrides colors (per owner colors of 1 ideal, agent interpreted as keep *everything* ideal). Same `--type-hook/h1/h2/body`, same `--radius:4px`, `--shadow`, same serif/sans/mono, same background gradient.

3. **Same HTML:** `renderReader()`, `renderMatrix()`, `renderLineage()`, `renderGongan()`, `renderLexicon()` produce identical DOM for 1-7. Then `enhanceRoomLayout(room)` *wraps* existing DOM in `<details class="rm-acc">` or injects tabs/modal/hover — post-process patch, not alternative template.

4. **Tiny CSS per layout:**
   - 2: 31 lines `.acc-sec`
   - 3: 48 lines `.rm-acc` folds unit in every room
   - 4: 18 lines `.rm-pending` stubs
   - 5: 140 lines `.layout-tabs` adds tablist inside each room
   - 6: 35 lines `.rm-info-doorway` + modal chrome
   - 7: 20 lines `.hover-cardable`
   Total new CSS ~292 lines, all scoped to disclosure widgets. No grid, flex, position, max-width, typography scale change.

5. **Why permission didn't help:**
   - `ANALYSIS_DRASTIC_LAYOUT_2026-09-14.md` said safe path to keep 8 gates green = token swaps only. That mental model persisted.
   - `RULING_BUNDLE_CEILING_2026-09-14.md` extended 2MB -> 30MB testing, technically feasible, but PR #78 still 2.1MB raw, didn't use headroom.
   - `RULING_GATES_EXPERIMENT_2026-09-14.md` turned presentation gates to `continue-on-error: true` (mirror diff, smoke_test allowed to break), but agent still behaved as if required.
   - Agent implemented drastic as "fold ALL rooms" not "change visual language" — so 3-7 are old 2-6 generalized, not new architectures.

**Result:** 7x same website with different disclosure widget (accordion, progressive, tabs, modals, hover). Not 7 different layouts.

## Roadmap — What Must Change To Be Truly Drastic

**LAW — Keep ideal colors of 1:** Colors of 1 ideal already, whole issue is website design, layout-focused approach perfect keep color of ideal 1 vary structure for light mental load. So keep `:root` primitives `--paper, --panel, --line, --ink, --gold, --green, --blue, --red, --wood, --wood-ink, --brass` exactly as in 1. Only structure varies.

**MUST change (to be drastic):**
- **Shell:** `.site-shell`, `.shell-frame`, `.shell-lintel`, `.brand`, `.room-nav`, `.room-heading`, `.room-filter-rail`, `.room-body` — each new layout MUST override at least shell + nav + body grid. Not just hide small parts.
- **Navigation paradigm:** Sidebar vs hamburger vs timeline vs split vs bottom sheet vs focus mode — must be different paradigm, not same sidebar 5 rooms.
- **Grid / measure / whitespace:** `max-width`, `display: grid/flex`, `gap`, `padding`, `margin`, `line-height`, `type scale` — must vary significantly. One layout full-bleed 38rem centered, one horizontal scroll, one 30/70 split, one card wall, one dossier.
- **Information architecture:** Order of info sections — where-from / related / background / translation — must reorder per layout (e.g., info-first vs translation-first).
- **Typography emphasis:** English first law, but can vary size, weight, spacing, not just same serif everywhere. Still keep same font families to keep colors ideal, but vary scale.
- **No post-process only:** Must edit `render*` paths or CSS to produce alternative DOM structure, not just wrap existing DOM. Use `data-design` attribute on `<html>` to switch entire room templates.
- **Keep text integrity:** 0 `style=` attributes, 4 `style.setProperty` only (`--shell-height`, `--zh-font-size`, `--pop-shift` x2), CSP `style-src 'self' https://fonts.googleapis.com` without unsafe-inline, `app_data.js` byte-identical rebuild, no Chinese edits.
- **Bundle 30MB testing:** Allowed up to 30MB raw (currently 2.1MB), so can add distinct CSS per layout (500-1000 lines each) and JS renderers. Still keep `docs/` mirror identical to root.
- **Common qualities in ALL:** Light mental load minimum default expand/hover/toggle, English first, not dense, comfortable to read easy navigate, piece meal plain language, info section every work/teacher where from what/who related background context. 34/34 teachers 24/24 cases 31/31 terms 4/4 comparison lines per layout measured.
- **Each adds number:** Switcher now 1-12, persistent localStorage, header label "Layout".

## 5 New Truly Drastic Layouts 8-12 — Specs (from LAYOUT_VARIANTS 6-35)

### 8 — Focus Mode (variant 13)
- **Idea:** Button hides all chrome, leaving only English paragraph centered, tiny [i] to expand.
- **Shell:** `[data-design="8"] .site-shell` height 2.8rem transparent, `.room-nav` hidden by default, `.room-filter-rail` hidden, `.room-heading` hidden, `.shell-frame` max-width 100%, hero hidden.
- **Reader:** `#reader-content-target` max-width 38rem margin auto, line-height 1.9, English only visible, Chinese / pinyin / provenance / ledger hidden behind [i] toggle at end of each unit. Other rooms: same centered minimal, only English headlines, details behind [i].
- **Why distinct:** Full-bleed centered reading, no sidebar, whitespace 3x more than 1. Visually instantly different.
- **Common qualities:** Minimum default (English only), extra behind [i] expand, info sections behind [i] modal/drawer.

### 9 — Timeline View (variant 15)
- **Idea:** Works/teachers on horizontal timeline chronologically, clicking shows context card.
- **Shell:** `[data-design="9"] .room-body` display flex row overflow-x auto scroll-snap, timeline line `::before` gold, cards 18rem wide, gap 1.5rem, padding 2rem.
- **Rooms:** Lineage becomes horizontal timeline by generation, Matrix becomes timeline by dynasty, Gongan becomes timeline by theme, Lexicon becomes A-Z rail horizontal, Reader becomes chapter chunks on timeline.
- **Why distinct:** Horizontal scroll, not vertical list. No other layout does horizontal.
- **Common qualities:** Only era/name visible default, where-from / related / background behind click expand card.

### 10 — Graph + Reader Split (variant 16)
- **Idea:** Minimal lineage graph dots only left 32%, reader right 68%.
- **Shell:** `[data-design="10"] .room-body` display grid 32% 68%, gap 0, left panel sticky top var(--shell-height), background var(--sunken), right panel scroll.
- **Rooms:** Lineage left shows dots graph (divs, not SVG heavy), clicking dot shows teacher dossier right. Matrix left shows 4 witnesses dots, right shows comparison. Reader left shows TOC dots, right shows English. Gongan/Lexicon left shows index dots, right shows detail.
- **Why distinct:** Split-screen, not single column. First layout with two persistent panes.
- **Common qualities:** Left minimal dots (light load), right English first, extra behind hover/click.

### 11 — Minimal Header + Hamburger (variant 27)
- **Idea:** Header only title + switcher numbers 1-12, all navigation behind hamburger, default minimal, whitespace maximal.
- **Shell:** `[data-design="11"] .site-shell` height 3rem, `.room-nav` hidden, hamburger button top-right opens drawer overlay with room list + filters, `.room-filter-rail` inside drawer, `.shell-frame` padding 0.5rem, `.room-heading` font-size 1.2rem, margin 3rem 0 1rem.
- **Reader:** max-width 42rem, generous whitespace, no filter rail visible, no case rail visible unless hamburger open.
- **Why distinct:** No sidebar, no filter rail, header 50% smaller, whitespace 2x, hamburger paradigm.
- **Common qualities:** Minimal default (only English), everything extra behind hamburger drawer expand.

### 12 — Info-First Dossier (variant 22)
- **Idea:** Work page top is info section (where from, related, background) plain language, then translation collapsed.
- **Shell:** `[data-design="12"] .room-body` flex column, `.front-matter` / `.ledger-drawer` / context moved to top via CSS order or JS reorder, translation grid order last, border top gold.
- **Rooms:** Reader top dossier: witness coverage, where from, related teachers, background, then button "Read translation" expands English+Chinese. Matrix top dossier: what is collation, where from, related, background. Lineage top dossier: generation context. Gongan top: theme context. Lexicon top: headword context.
- **Why distinct:** Inverts 1 (which is translation-first). First layout where info section is hero, translation is secondary collapsed.
- **Common qualities:** Info section plain language piece meal at top, translation behind toggle, English first within translation.

## Implementation Steps

1. **Branch from main ffa139a:** `git checkout main; git checkout -b feature/phase5-truly-drastic-8-12-roadmap`
2. **Edit `app.css`:**
   - Keep `:root` and `[data-theme="dark"]` untouched (ideal colors).
   - Keep layout 1-7 CSS untouched (byte-identical for 2, keep 1 no override).
   - Add new section `/* Layouts 8-12 truly drastic */` with 5 blocks `[data-design="8"]` .. `[data-design="12"]` each 300-800 lines, overriding `.site-shell, .shell-frame, .shell-lintel, .room-nav, .room-heading, .room-filter-rail, .room-body, #reader-content-target, .case-card, .matrix-proof-sheet, .lineage-master-row, .catalogue-row, .lexicon-entry` etc. Must be visually distinct — change `display, grid-template-columns, max-width, padding, margin, gap, position, overflow`.
   - No `style=` attributes, no new `setProperty` beyond 4 existing, CSP untouched.
3. **Edit `app.js`:**
   - Extend `DESIGN_VARIANTS` array from 1-7 to 1-12, labels "8 Focus", "9 Timeline", "10 Graph+Reader", "11 Hamburger", "12 Dossier" etc.
   - `applyDesignVariant` keeps same, `renderDesignSwitcher` auto renders 12 buttons.
   - `enhanceReaderLayout()` + `enhanceRoomLayout(room)` dispatcher: keep 1-7 paths, add 8-12 paths. For 8-12, either CSS-only or JS reorder: e.g., for 12 move info to top via `prepend`, for 9 wrap rows into timeline track, for 10 create split container with left dots nav.
   - Keep `setupShellMetrics()` etc., keep 4 setProperty.
   - Ensure no `innerHTML` XSS, keep lazy render, keep 0 style=.
4. **Mirror to `docs/`:** `cp app.css docs/app.css; cp app.js docs/app.js; cp app_data.js docs/app_data.js; cp index.html docs/index.html` if index.html changed, ensure byte-identical `diff -rq` would be identical but presentation gates OFF so allowed to break temporarily — but try to keep identical.
5. **Build bundle:** `python3 scripts/build_data_bundle.py` must produce byte-identical `app_data.js` 1,693,251 B unchanged. If changed, revert data edits.
6. **Gates:**
   - **MUST PASS (text integrity):** `py_compile`, `validate_data.py` corpus35 slots1252 verified177 matrix21 locators148/148 W1 flagged630, `build_data_bundle.py` deterministic, `test_source_preservation.py` 0 unauthorized base 3cc7e8e? check main, `test_source_review_rules.py` 138 checks.
   - **Allowed to break while experimenting (continue-on-error per RULING_GATES_EXPERIMENT):** `smoke_test.mjs` 35 texts, `diff -rq data docs/data`, `git diff --exit-code -- app_data.js docs`.
   - **Kept ON:** `test_website_ruling.py` law + common qualities — must PASS (checks NOT beautiful NOT done, 1-10 aim 8+, light mental load, English first, not dense, comfortable, piece meal, info sections 34/34 teachers 24/24 cases 31/31 terms 4/4 lines).
7. **Bundle size:** raw <30MB (30*1024*1024=31,457,280 B). Current 2.1MB, new 5 layouts each ~50k CSS + 20k JS = ~350k extra, still <2.5MB, well inside 30MB.
8. **Live demonstration:** Switcher header Layout 1-12 persistent localStorage, each layout visually distinct at first glance (not just widget).

## LAW — Must Be In Prompt And PR Description Verbatim

**RULING 2026-09-14 definitive verbatim law:**
"In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask 'does this look good?', 'Is this the right direction?', 'how good is it on a scale from 1-10 where we aim for at least 8?'. This is definitive."

**COMMON_QUALITIES 2026-09-14 verbatim:**
"All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is."

**Additional rulings in force:**
- RULING_BUNDLE_CEILING_2026-09-14: Bundle ceiling 30MB testing phase, technically feasible
- RULING_GATES_EXPERIMENT_2026-09-14: Text integrity gates required, presentation gates optional while experimenting, allowed to break presentation
- Colors of 1 ideal already, whole issue is website design, layout-focused vary structure for light mental load

## Acceptance Criteria

- [ ] PR from `feature/phase5-truly-drastic-8-12-roadmap` to `main`, base `ffa139a`
- [ ] Keeps 1-7 untouched (1 no override, 2 byte-identical accordion Reader, 3-7 existing drastic)
- [ ] Adds 8-12 truly drastic: 8 Focus Mode centered 38rem no sidebar, 9 Timeline horizontal scroll, 10 Graph+Reader split 32/68, 11 Hamburger minimal header, 12 Info-First dossier inverted
- [ ] Each layout overrides shell + nav + body grid, not just disclosure widget — visually distinct at first glance
- [ ] All share ideal colors of 1 (no new :root primitives, only structure varies)
- [ ] All implement common qualities: light mental load minimum default expand/hover/toggle, English first, not dense, comfortable, piece meal plain language, info section every work/teacher 34/34 24/24 31/31 4/4 measured
- [ ] Switcher 1-12 live, persistent
- [ ] Text integrity gates PASS: py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138 PASS
- [ ] Presentation gates allowed to break but try to keep: smoke 35 texts 0 crashes, diff -rq identical, law gate PASS
- [ ] Bundle raw <30MB (expect ~2.5MB)
- [ ] No `style=` attributes, 4 `setProperty` only, CSP untouched, no corpus Chinese edits
- [ ] PR description includes LAW verbatim + COMMON_QUALITIES verbatim + why 1-7 looked same + roadmap what changed + questions: does this look good? right direction? 1-10 aim 8+? which of 8-12 feels 8+? which room closest/furthest? info sections more/less?

## BANNED COMMANDS (to avoid 24h stall)

- NEVER `git show <sha>` on bundle commit (3.2MB diff) — use `git show <sha> --name-only` or `--stat` or `ls -lh app_data.js`
- NEVER `git log -p` on bundle — use `--oneline --name-only`
- NEVER edit `data/` corpus or `app_data.js` manually — only via `build_data_bundle.py`

## Questions Per LAW (must ask in PR)

- Does this truly drastic 8-12 look good compared to 1-7 same-shell?
- Is this the right direction — shell + nav + grid + IA changes, not just disclosure widgets?
- How good is it 1-10 where we aim at least 8? Overall and per 8-12?
- How well do common qualities work 1-10?
- Which of 8-12 feels 8+? Which of 6-35 next?

