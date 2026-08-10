# 🧘 Fake Chan Factory — UX/UI Improvement Roadmap

> **Status (2026-08-10): historical functional roadmap.** Most 2026-08-08 items below were implemented, but their evidence/descriptions are snapshots and several visual assumptions were superseded. Current design authority is [`sessions/WEB_DESIGN_GAP_PLAN_2026-08-10.md`](./sessions/WEB_DESIGN_GAP_PLAN_2026-08-10.md); structural walnut shell + Reader Phase A+B is recorded in [`sessions/DESIGN_PHASE_AB_2026-08-10.md`](./sessions/DESIGN_PHASE_AB_2026-08-10.md). Phases C–E (visual consolidation, four secondary rooms, screenshots/accessibility/owner approval) remain.
>
> **Purpose**: get the GitHub Pages app to *perfect functionality without overloading the screen* — desktop and mobile.
> **Author**: session `arena/019fe1b5-translatechan`, 2026-08-08 · **Scope**: `index.html`, `app.css`, `app.js` (zero-backend SPA).
> **How to read**: every item = problem (evidence) → fix → effort (S/M/L) → phase. Phases are priority-ordered; each phase is shippable on its own.

---

## 0. Guiding Principles (design contract)

1. **Calm by default** — one primary action per screen; the reading surface must dominate; chrome must recede.
2. **Progressive disclosure** — everything available, nothing dumped: collapse, index, paginate, filter.
3. **Mobile is a first-class citizen** — hover-only features must have touch equivalents; no fixed-width assumptions.
4. **Zero-backend stays** — all fixes must work as static files on GitHub Pages (no build step, no server).
5. **Truth in UI** — labels/statuses stay honest (✅/⚠️ badges, "unverified" notes); never hide provenance to declutter.

---

## 1. Current Pain Points (measured)

| # | Pain point | Evidence |
|---|---|---|
| P1 | **Wumenguan reader is a mega-page** — all 48 cases × (2–3 dialogue units × translation columns + commentary + verse) render at once (~600 KB DOM, ~10× the old page). No table of contents, no case jump, no collapse. | `renderReader()` renders every case unconditionally; live dump of `/translatechan/` = one continuous scroll of 48 cases |
| P2 | **Translation grid multiplies length** — `multi_translators` shows 6–7 columns per unit; even `bilingual` stacks zh + pinyin + 2 boxes per unit × 48 cases. | `app.css` `.translation-grid` (`auto-fit, minmax(280px,1fr)`); case 1 carries 6 verified editions |
| P3 | **Glossary tooltips are hover-only** — `.term-tooltip` shows on `:hover`; touch devices (no hover) can never see them; keyboard users can't focus them either. The tooltip markup is also inlined once **per occurrence** (無 appears ~5×/case → ~250 duplicated tooltip nodes in the Wumenguan DOM). | `app.css` lines 656–681; live dump shows the 無 tooltip repeated inside every 無 |
| P4 | **Mobile corpus navigation is buried** — below 960 px the active-corpus sidebar stacks *above* the content: choose a text, then scroll past the full manifest every time; no collapse, no jump. | `@media (max-width:960px)` `.reader-layout` → 1 column |
| P5 | **Preferences don't persist** — reading mode, font size, and active text reset on reload (only theme persists). | `app.js` `setupEventListeners()` keeps `currentFontSize` in a local variable; `state.readerMode` never saved |
| P6 | **Search re-indexes on every keystroke** — `handleGlobalSearch()` walks all active texts × every schema unit per `input` event; noticeable lag on mobile. | `app.js` `extractSearchableUnits()` + input listener without debounce |
| P7 | **Lineage SVG is crowded** — 34 nodes across the current generation layout in a fixed 480 px-high SVG; nodes/tap targets overlap in "All" view; no pan/zoom. | `renderVisualLineageGraph()`; `masters.json` now 34 profiles (including 4 explicit frontier scaffolds) |
| P8 | **No long-page aids** — no scroll-to-top, no sticky case index, no "next case" affordance; no print stylesheet (a *scholarly* tool that can't produce a clean PDF). | `app.css` has no `@media print`; no floating controls |
| P9 | **Accessibility debt** — nav tabs lack `aria-selected`/roles; theme toggle is an unlabeled icon button; tooltips not focusable; no skip-link; muted text contrast ≈ 3.2:1 (`#9c9189` on `#faf8f5`) fails WCAG AA; no `prefers-reduced-motion`. | `index.html` header markup; `app.css` tokens |
| P10 | **SPA has no history integration** — view/text changes don't update the URL; browser back exits the app; the brand button force-reloads (`location.reload()`), losing all state. | `index.html` brand `onclick`; `switchView()` |

---

## 2. Roadmap (priority-ordered phases)

### Phase A — "Calm Reader" (fixes the overload where users live) · S–M · ~1 session · ✅ **implemented 2026-08-08** (commit e299187→)

**A1. Case index & jump strip (Wumenguan & any 10+ unit text)** — *fixes P1* · ✅ done
- Add a sticky (or header-adjacent) horizontal "case chip" strip: `第1則 … 第48則`, current case highlighted, click → scrollIntoView; plus ‹ Prev / Next › case buttons at the bottom of each case card.
- Data: derive from `doc.cases` — no schema change. Guard: strip only renders when `cases.length ≥ 10`.
- Acceptance: from case 1 you can reach case 48 in ≤2 clicks without scrolling; strip collapses to a `⤓` button on <600 px.

**A2. Case cards collapsible** — *fixes P1* · ✅ done
- Each case card gets a header toggle (「− / ＋」): collapsed = title + first dialogue zh only; expanded = full case (commentary, verse, translations). Default: expanded on desktop, **collapsed on mobile** (via CSS `@media (hover: none)`).
- State remembered in `localStorage` per text.
- Acceptance: mobile Wumenguan first paint ≈ 1/5 of today's scroll length; one tap expands a case.

**A3. Touch & keyboard tooltips** — *fixes P3* · ✅ done
- Add `focus`/`tap` activation: `:focus-within`/`:focus-visible` shows the tooltip; on touch, first tap highlights + shows tooltip (CSS-only via `@media (hover:none)` using `:active`-adjacent pattern), tap elsewhere closes.
- Bonus (S): stop re-annotating — render tooltip content **once per term per view** via a shared `<template>`/hidden glossary panel instead of per-occurrence markup (removes ~200 duplicate nodes in Wumenguan); occurrences become plain highlighted spans that open the shared popover.
- Acceptance: tooltip reachable via tap and keyboard on every annotated term; Wumenguan DOM node count drops measurably.

**A4. Preference persistence** — *fixes P5* · ✅ done
- Persist `readerMode`, `currentFontSize`, `currentCorpusKey` (+ later: collapsed states) in `localStorage`; restore on boot.
- Acceptance: reload keeps mode/font/text; toggle from any device setting works.

**A5. Search debounce + result cap** — *fixes P6* · ✅ done
- 200 ms debounce on the input event; cap results at 200 total with a "narrow your query" note (per-text cap already 12).
- Acceptance: typing feels instant on a mid-range phone with the 48-case corpus.

### Phase B — "Mobile-First Navigation" · S–M · ~1 session · ✅ **implemented 2026-08-08**

**B1. Corpus picker instead of stacked sidebar (< 960 px)** — *fixes P4* · ✅ done
- Mobile: the sidebar becomes a single `<select>`-style dropdown (or a collapsible "📚 Canonical Works" button) above the reader; below 960 px the sticky side list is hidden.
- Desktop unchanged (300 px sticky sidebar is good).
- Acceptance: on a 375 px phone, switching texts is 1 tap + 1 tap, and the reading surface starts above the fold.

**B2. Mobile reader toolbar** — *fixes P1/P2 on phones* · ✅ done
- Sticky bottom action bar on touch: `[A−][A+][☰ cases][⬆]` (font size, case index, scroll-to-top); reader mode switcher moves into it as a segmented control on <600 px.
- Acceptance: all reading controls reachable with one thumb; nothing overlaps text (bar is compact, translucent).

**B3. Default reading mode by device** — *fixes P2* · ✅ done (1 translation column on narrow screens; pinyin toggleable)
- `bilingual` remains default, but on touch devices default to 1 translation column (not 2) and hide pinyin until requested (a "show pinyin" toggle), cutting mobile page length ≈ 40 %.
- Acceptance: Wumenguan case 1 on mobile = zh + 1 column + optional pinyin, no other chrome.

### Phase C — "Deep-Functionality Polish" · M · ~1–2 sessions · ✅ **implemented 2026-08-08** (C1–C5)

**C1. Print / PDF stylesheet** — *fixes P8 (scholarly need)* · ✅ done
- `@media print`: hide nav/sidebar/hero/tooltips; one translation column; page-break-inside avoid on case cards; black-on-white; include title + canon ID per case; `lang="zh"` on Chinese blocks.
- Acceptance: `Print → Save as PDF` of any text is a clean scholarly handout.

**C2. Hash routing + back button** — *fixes P10* · ✅ done
- `#/reader/wumenguan`, `#/lineage`, `#/lexicon` …; `hashchange` drives `switchView`/`renderReader`; brand link becomes `href="#/reader"` (no reload).
- Acceptance: back/forward navigate views and texts; deep links work.

**C3. Lineage graph upgrade** — *fixes P7* · ✅ reworked 2026-08-08
- Vertically layered generation rows replace the cramped left-to-right strip; nodes receive spacious row gaps, quiet halos, shortened labels, and status-aware links.
- The chart-status strip and controls now sit in normal layout flow rather than over the SVG; pan/zoom/reset remains available for inspection.
- Acceptance: the 34-profile view has no overlapping generation labels, traditional links are visually quieter than source-verified links, and zooming to a branch remains fluid on touch.

**C4. Accessibility pass** — *fixes P9* · ✅ done
- Skip-to-content link, `role="tablist"`/`aria-selected` on nav, `aria-label` on icon buttons, `:focus-visible` ring using `--border-focus`, contrast fixes (`--text-muted` darkened, or used only ≥14 px), `prefers-reduced-motion` disables `sereneFade`, `lang="zh"` on Chinese spans.
- Acceptance: Lighthouse a11y ≥ 95 on desktop & mobile; full keyboard traversal of reader, matrix, lineage, index, and lexicon.

**C5. Index polish** — *fixes P10-adjacent gaps* · ✅ done
- Gong'an index: make theme chips clickable filters (group by collection/theme).
- Public-scope update (2026-08-08): browser drafting controls were deliberately retired; the public app remains focused on reading, comparison, lineage, index, and lexicon.

### Phase D — "Performance & Resilience" · M · later · ✅ **implemented 2026-08-08** (D1, D2, D4; D3 intentionally skipped)

**D1. Prebuilt search index** — *refined at implementation*: instead of a Python-generated inverted index (which would duplicate app.js unit semantics and add ~500 KB to the bundle), the app builds the normalized search-unit index **once per session** (`getSearchUnitsIndex()` cache) and filters cached strings per keystroke. Same user-visible win (no per-keystroke corpus traversal), zero bundle growth, single source of truth in JS. · ✅ done
**D2. Lazy case rendering** — first 12 case cards render, "Show more cases — N of 48 · +12" button loads the rest; jump chips / prev-next nav auto-load the target case (`ensureCaseLoaded`); scroll position preserved across loads. · ✅ done
**D3. Offline (optional)** — **skipped by design** (repo prefers zero-magic / no hidden runtime behavior; static bundle is already cacheable by the browser).
**D4. Image/font delivery** — `<link rel=preload as=script>` for `app_data.js` (parse earlier); `font-display: swap` already active via the Google Fonts URL. · ✅ done

---

## 3. Desktop vs Mobile matrix (target state after all phases)

| Capability | Desktop | Mobile |
|---|---|---|
| Corpus navigation | Sticky 300 px sidebar | Dropdown picker (B1) |
| Case navigation | Sticky chip strip + prev/next (A1) | Bottom bar + strip (A2/B2) |
| Case density | Expanded by default, collapsible | Collapsed by default (A2) |
| Translations | 2 cols bilingual / all in multi mode | 1 col, pinyin optional (B3) |
| Lexicon tooltips | Hover + focus (A3) | Tap-to-open popover (A3) |
| Font size / mode | Toolbar (persisted A4) | Thumb bar (B2, persisted A4) |
| Lineage graph | Pan/zoom + filters + reset (C3) | Same, touch pinch (C3) |
| Output | Print/PDF clean (C1) | Print/PDF clean (C1) |
| URL state | Hash routes + back (C2) | Same |

---

## 4. Effort & sequencing

```
✅ Session 1+2 (2026-08-08): A1–A5 + B1–B3   → "Calm Reader" + "Mobile-First" shipped
✅ Session 3 (2026-08-08): C1 + C2 + C3        → "Deep Polish" shipped
✅ Session 4 (2026-08-08): C4 + C5            → "Accessible & Complete" shipped
✅ Session 5 (2026-08-08): D1 + D2 + D4        → performance shipped (D3 skipped by policy)
```

Each release: `python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs`, root↔docs byte-identical, `diff -rq data docs/data` silent, smoke test gains a regression per feature (e.g. strip presence, collapsed default on touch, debounce timing, hash routing).

---

## 5. Explicitly out of scope (kept minimal on purpose)

- No framework, no build step, no backend, no external JS libs (D3 optional SW is the only conceivable addition).
- No redesign of the visual identity — the rice-paper/ink aesthetic stays; this roadmap reduces *load*, not *character*.
- No new data features (canon content lives in the main ROADMAP.md); this file is purely presentation & interaction.
