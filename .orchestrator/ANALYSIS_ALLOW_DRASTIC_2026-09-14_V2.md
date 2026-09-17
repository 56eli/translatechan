# ANALYSIS — What We're Doing To Allow Drastic Changes (2026-09-14 v2)

## Owner Feedback
"We've moved from 'very minor' in first batch to 'minor' changes. Changes appreciated but it's very much seven times the same website. Can you elaborate why all seven examples look basically the same? Even after permission for drastic changes has been given? You haven't actually given a roadmap on what to change for agents to act drastically. First of all elaborate on what you're doing to allow for drastic changes, then 3-7 must be completely redone in next batch"

## Why 1-7 Look Same (Recap)

Main ffa139a (PR #78):
- 1 = ideal, no override
- 2 = Accordion Reader (31 lines CSS, folds inside Reader)
- 3 = Accordion ALL rooms (48 lines, folds unit)
- 4 = Progressive reveal ALL rooms (18 lines, stubs)
- 5 = Tabbed ALL rooms (140 lines, tablist inside each room)
- 6 = Modal info ALL rooms (35 lines + modal chrome, ⓘ)
- 7 = Hover cards ALL rooms (20 lines, hover)

All 7 share:
- `.site-shell` walnut lintel, `.shell-frame` 1400px, `.room-nav` sidebar 5 rooms, `.room-heading`, `.room-filter-rail`, `.room-body` — no layout overrides shell
- `:root` primitives same colors, same type scale, same radius/shadow, same serif/sans/mono, same background gradient
- Same HTML from `renderReader()`, `renderMatrix()`, `renderLineage()`, `renderGongan()`, `renderLexicon()` — then `enhanceRoomLayout()` wraps DOM in details/tabs/modal/hover — post-process patch, not alternative template
- Total new CSS ~292 lines scoped to disclosure widgets, no grid/flex/position/max-width change
- Bundle raw 2,098,979 B ~2.1MB, still old 2MB mindset, not using 30MB headroom

## What We're Doing To Allow Drastic Changes — Technical Measures

### 1. Bundle Ceiling 2MB -> 30MB Testing (RULING_BUNDLE_CEILING_2026-09-14.md, PR #76 main d9fd30a)
- **Before:** Functional gate-green bundle <2MB (raw 1.9MB, gzipped 0.6MB). Agent self-limited: "if I add 500 lines CSS per layout x5 = 2.5k lines ~50k, I'll cross 2MB, fail gate". So only token swaps.
- **After:** 30MB testing ceiling, technically feasible — Quality workflow `quality.yml` does NOT check bundle size directly, only `git diff --exit-code -- app_data.js docs` mirror. `app_data.js` 1.7MB + `app.js` + `app.css` + `index.html` ~0.3MB = 2MB. 30MB allows 28MB extra CSS/JS = ~500 distinct layouts theoretically, or 5 layouts each with 1000 lines CSS + alternative renderers + images if needed. PR #78 still 2.1MB, didn't use headroom — next batch MUST use it.
- **Enforcement:** `scripts/test_website_ruling.py` updated to allow <30MB during testing, not <2MB. `HANDOFF.md`, `AUDIT.md`, `OPERATIONS.md` note testing phase 30MB.

### 2. Presentation Gates OFF While Experimenting (RULING_GATES_EXPERIMENT_2026-09-14.md, PR #77 main a1e132e)
- **Before:** 8 gates required to PASS: py_compile, validate_data, build_data_bundle deterministic, smoke_test 35 texts + 0 style= + CSP + render-lazy, diff -rq docs mirror identical, preservation 0 unauthorized, review 138 checks, website ruling law+common. Changing shell/nav/grid breaks smoke (style= count, setProperty count, render-lazy, CSP shape) and mirror diff — agent avoided.
- **After:** Text integrity gates REQUIRED (failing): py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build_data_bundle deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138 PASS. Presentation gates OPTIONAL while experimenting (`continue-on-error: true` in quality.yml): smoke_test, mirror diff allowed to break. Means agents CAN rewrite shell, nav, grid, even if smoke fails or docs mirror not byte-identical, as long as text integrity PASS.
- **Website ruling gate kept ON:** Enforces LAW verbatim (NOT beautiful NOT done, NOT capable to judge, 1-10 aim 8+) + COMMON_QUALITIES (light mental load, English first, not dense, comfortable, piece meal, info sections 34/34 teachers 24/24 cases 31/31 terms 4/4 lines).

### 3. Roadmap For Truly Drastic — What Must Change (New Law For Agents)
- **MUST override shell:** Each new layout MUST have CSS for `[data-design="X"] .site-shell, .shell-frame, .shell-lintel, .room-nav, .room-heading, .room-filter-rail, .room-body` — not just `.rm-acc` or `.layout-tabs`. Change `display, grid-template-columns, max-width, padding, margin, gap, position, overflow, height`.
- **MUST change navigation paradigm:** Sidebar vs hamburger vs timeline horizontal vs split 32/68 vs bottom sheet vs focus mode vs dossier — not same sidebar 5 rooms in all 7.
- **MUST change grid / measure / whitespace:** One layout centered 38rem, one horizontal scroll, one card wall, one full-bleed, one dossier inverted — visually distinct at first glance, not just widget.
- **MUST change IA order:** Info-first vs translation-first vs timeline vs graph — reorder DOM via CSS order or JS `prepend`/`append`, not just hide/show.
- **MUST be alternative renderer, not post-process wrapper:** Edit `render*` paths or create new render function per layout that produces different DOM structure, not just wrap existing DOM in `<details>`.
- **Keep ideal colors of 1:** Keep `:root` primitives exactly — only structure varies, per owner "colors of 1 ideal already".
- **Keep common qualities:** Light mental load minimum default expand/hover/toggle, English first, not dense, comfortable, piece meal plain language, info section every work/teacher where from what/who related background.
- **Each adds number:** Switcher 1-12 persistent localStorage, header label "Layout".
- **Banned:** `style=` attributes (0), only 4 `setProperty` (`--shell-height`, `--zh-font-size`, `--pop-shift` x2), CSP `style-src 'self' https://fonts.googleapis.com` no unsafe-inline, `app_data.js` byte-identical, no Chinese edits.

### 4. Concrete Next Batch — 3-7 Completely Redone (Owner Request)
- **Keep:** 1 Classic scroll ideal (no override, :root base), 2 Accordion Reader kept (owner saw improvements, byte-identical 2,336 chars)
- **Redo:** 3-7 completely redone as truly drastic, not minor disclosure:
  - 3 = Focus Mode (variant 13) — centered 38rem, no sidebar, no filter rail, English only, whitespace 3x
  - 4 = Timeline (variant 15) — horizontal scroll timeline, cards 18rem, scroll-snap
  - 5 = Graph+Reader Split (variant 16) — left 32% dots graph sticky, right 68% reader scroll
  - 6 = Minimal Header + Hamburger (variant 27) — header 3rem only title+numbers, nav behind hamburger drawer, filter rail inside drawer, whitespace 2x
  - 7 = Info-First Dossier (variant 22) — info section top plain language, translation collapsed behind "Read translation" button, inverted order

Each overrides shell+nav+body grid, visually distinct at first glance, 300-800 lines CSS each, 20-50 lines JS reorder, bundle ~2.5MB <30MB, text integrity PASS, presentation allowed to break but try to keep.

### 5. How We Will Measure Drastic
- Screenshot at first glance: can owner tell 3 vs 4 vs 5 vs 6 vs 7 without reading labels? If not, not drastic.
- Shell diff: does `[data-design="X"] .site-shell` exist? Does `.room-nav` change display? Does `.room-body` change grid? If no, not drastic.
- CSS lines: <100 lines = minor, 300-800 lines = drastic.
- Navigation paradigm: same sidebar = not drastic, hamburger/timeline/split/dossier = drastic.
- IA: same order = not drastic, inverted/reordered = drastic.

## Enforcement In Next Prompt 030

Prompt 030 will require:
- Base main ffa139a, target feature/phase5-redo-3-7-truly-drastic
- Keep 1 and 2 untouched, redo 3-7 completely per specs above
- Each 3-7 overrides shell+nav+body, visually distinct, 300-800 lines CSS each
- Keep ideal colors, implement common qualities, add numbers 1-7 (2 double still intended but 3-7 new)
- Text integrity required, presentation allowed to break, bundle <30MB
- PR description includes LAW verbatim + COMMON_QUALITIES + why 1-7 same + what we're doing to allow drastic + roadmap + questions per LAW

## Questions Per LAW

- Does this elaboration of what we're doing to allow drastic changes look good?
- Is this the right direction — bundle 30MB + presentation OFF + shell+nav+grid+IA must change + alternative renderer not wrapper?
- How good is it 1-10 where we aim at least 8?
- Which of 3-7 redo specs feels most drastic (Focus, Timeline, Graph+Split, Hamburger, Dossier)?
- Should 3-7 be completely redone as 3-7 new truly drastic, keeping 1 and 2, as you requested?
