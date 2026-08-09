# 🔍 TranslateChan — Full Independent Audit (2026-08-09, session `019fe731`)

> **One-sentence verdict:** The project remains in genuinely strong shape — every quality gate is green, the validator/smoke/doc-truthfulness toolchain is unusually mature for a zero-backend static corpus app, and I confirmed **no P0/P1/P2 defects**; everything below is P3/P4 polish, a11y depth, search UX, and small documentation-housekeeping inconsistencies.

This is a temporary response file for review. Durable session history lives in
`sessions/` and the slim current-state summary in `AUDIT.md`.

---

## 0. How I audited (all locally re-verified)

- Full gate chain, all pass:
  - `python3 -m py_compile scripts/*.py` ✅
  - `python3 scripts/validate_data.py` → `corpus=36 | slots=874 | verified=138 | matrix=21 | locators=64/64` ✅
  - `node scripts/smoke_test.mjs` → 36 texts exercised, 0 crashes ✅
  - `diff -rq data docs/data` ✅; root ↔ docs mirrors byte-identical for `index.html`, `app.js`, `app.css`, `theme-init.js`, `robots.txt`, `sitemap.xml` ✅
- Read all 2,346 lines of `app.js`, all 1,529 lines of `app.css`, `index.html`, `theme-init.js`, `build_data_bundle.py`, the doc-truthfulness section of `validate_data.py`, the CI workflow, the smoke test, and spot-checked the data layer (wumenguan/biyanlu shapes, matrix labels, pinyin characteristics, metrics).
- Cross-checked every claim against prior audit artifacts (`AUDIT.md`, `AUDIT_RESPONSE_2026-08-09.md`, `STRUCTURAL_ASSESSMENT_2026-08-09.md`, session reports) so this report only carries **genuinely new findings** plus carried-forward standing items.

Prior audits already shipped: heading outline, data-derived graph colors, FOUC guard, bare-string→record migration (736 slots), aria-hidden emoji, data-derived hero counts, OG/Twitter/robots/sitemap/canonical, deferred scripts, segmenter rename, schema strictness wave 1–2. Verified all present and guarded.

---

## 1. New findings (P3 = low-risk polish, P4 = nice-to-have)

### Front-end / accessibility

**N1 — JS smooth-scrolling ignores `prefers-reduced-motion` (P3, a11y)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
All 7 programmatic scrolls (case-strip jump, scroll-to-top ×2, view switch, dossier open ×2, case deep-link) now route through a centralized `motionBehavior()` helper that returns `'auto'` for reduced-motion users; CSS still covers declarative animation. Smoke-guarded (no `behavior: 'smooth'` literal may regress).
`app.css:1513` neutralizes CSS animation/scroll-behavior for reduced-motion users, but `app.js` performs 7 programmatic `behavior: 'smooth'` scrolls (`window.scrollTo` ×4, `scrollIntoView` ×3 — lines 441–446, 639, 1918, 1970, 2317) without consulting `matchMedia('(prefers-reduced-motion: reduce)')`. CSS `scroll-behavior: auto !important` does **not** override behavior passed explicitly to the scroll APIs. Vestibular-sensitive users still get animated scrolling for case jumps, view switches, dossier opens, and "load more". Fix: one `prefersReducedMotion()` helper returning `'auto'` vs `'smooth'` (~10 lines), centralized like `escHtml`.

**N2 — Dossier panel is not a dialog (P3, a11y)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
`#master-dossier-panel` now carries `role="dialog" aria-labelledby="dossier-name-zh" tabindex="-1"`; shared `openDossierPanel()` moves focus into the panel on open (both master and edge views) and records the invoking control; `closeDossierPanel()` is reached from the ✕ button and Escape (with an open tooltip absorbing the first press) and restores focus to the invoker. Smoke-guarded.
`#master-dossier-panel` opens on node/card/edge activation but has no `role="dialog"`/`aria-modal`/`aria-labelledby`, focus is not moved into it, Escape does not close it (only citation/term popovers handle Escape), and background content is not inert. Keyboard/SR users get no signal that content appeared above their position. Fix: set focus to the panel (or close button) on open, `Escape` → close + restore focus to the invoker, add role/aria attributes. All static markup already exists — pure JS/attribute change, no redesign.

**N3 — Glossary popover not shown on keyboard focus (P3, a11y/discoverability)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
Tab-focusing a `.term-highlight` now reveals the shared definition popover (gated on `:focus-visible` so mouse click-to-toggle semantics are unchanged); both the glossary and citation popovers now carry `role="tooltip"`. Enter/Space toggle still works. Smoke-guarded.
`.term-highlight` spans are `tabindex="0"` and Enter/Space toggles the popover, but plain Tab-focus shows nothing (only a dotted-outline style change). The shared document-level `focusin` handler covers `.citation-trigger` only; terms get `mouseover`/`click`/`keydown` on the reader root. Keyboard users cannot discover that a definition exists without guessing a key. Fix: handle `focusin`/`focusout` for `.term-highlight` the same way the citation popover does. Related P4: neither popover carries `role="tooltip"` or an `aria-describedby` link from the trigger.

**N4 — English/translation search hits never surface the matched text (P3, UX)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
Result cards now render a `.search-match-note` disclosing the field that satisfied the query: the first matching translation register by name with a windowed quote (“⚖️ Matched in translations — **Red Pine (Bill Porter)**: …”), or the pinyin line, or the title/speaker label. Units carry per-register English pairs alongside the search blob; empty-Chinese title units no longer render an empty zh block. Behaviorally smoke-guarded (`Buddha-nature` → "Matched in translations").
`handleGlobalSearch()` matches against `u.blob` (zh + pinyin + **all translation text**), but the result card only renders `makeSnippet(u.zh, q)` — a windowed snippet of the *Classical Chinese only*. Query `emptiness` or `fox` matches translations and titles, yet the card shows 80 chars of unmarked Chinese (`raw.search(re) === -1` → `center = 0`). The user cannot see *what* matched. Fix: when zh doesn't contain the query, render the matched field instead (translation/pinyin/title) with a small "matched in translations" label, or append a translation snippet under the Chinese.

**N5 — Toneless/partial pinyin search fails (P3, UX)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
`normalizeForSearch()` now applies NFD + combining-mark strip (on top of the CJK variant map, which is unaffected), so `foxing`, `zhaozhou`, `wu`… match `fóxìng`/`Zhàozhōu`/`wú`. Behaviorally smoke-guarded with `foxing` — a word that exists in the corpus **only** as tone-marked pinyin (6× `fóxìng`, 0× plain ASCII), so the match can only come through folding.
Corpus pinyin is tone-marked (14,660 combining-mark characters across `data/corpus/*.json`, e.g. `Zhàozhōu … fóxìng`), and `normalizeForSearch()` lowercases + maps 5 glyph variants but never strips diacritics. A user typing `wu`, `foxing`, or `zhaozhou` (the realistic romanization query) gets zero pinyin hits. Fix: NFD-normalize and strip `\p{M}` in addition to the variant map (one line with Unicode property escapes; Node 22 + all modern browsers support it).

**N6 — Global search input has no accessible name (P4, a11y)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
The input is now `type="search"` with `aria-label="Search all corpus texts — Chinese, pinyin, or English"` inside a `role="search"` landmark wrapper. Smoke-guarded.
`<input id="global-search" type="text" placeholder="Search Chinese / English...">` relies on the placeholder alone (the three `<select>`s all have `aria-label`; this input doesn't). Add `aria-label="Search all corpus texts"` and consider `type="search"` for semantics/mobile keyboards. One-attribute fix.

**N7 — Lineage graph never re-lays out on viewport change (P4, UX)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
A debounced (220 ms) `resize` listener re-renders the lineage view while it is visible, recomputing the layout from the live viewport width; pan/zoom state survives by design (`svg._panzoom` re-applies on redraw). Smoke-guarded.
`renderVisualLineageGraph()` computes `width` once per render from `svg.clientWidth`; there is no `resize` listener. Rotate a phone or resize a desktop window and the viewBox keeps the stale width until the user changes a filter/sort. Fix: debounced `resize` listener that re-renders while the lineage view is visible (preserve pan/zoom state, which already survives re-renders by design).

**N8 — Popovers can't be scrolled and guess their height (P4, UX)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
Both popovers are now capped at `min(60vh, …)` with internal scrolling and are interactive surfaces (hovering into them keeps them open; click/tap-outside and Escape dismiss). A shared `positionFloatingPopover()` measures the real rendered height for the flip decision, replacing the ~160/190 px guesses. Smoke-guarded (CSS invariants + shared positioner).
`.citation-popover`/`.term-popover` are `pointer-events: none` with no `max-height`/`overflow`, and the flip logic hardcodes ~160–190 px content guesses. A long citation near the viewport bottom on mobile can overflow with no way to read it. Fix: `max-height: 60vh; overflow-y: auto` (keep `pointer-events: none` if hover-to-dismiss is preferred, but measure real height for the flip).

### Documentation / repo hygiene

**N9 — Session `019fe64a` is missing from AUDIT.md §4 index; its report lives at root (P3, convention consistency)** 🆕
The most recent merged session (PR #9, commit `c464181`) is summarized in AUDIT.md §2 but has **no row in the §4 session archive index table**, and its full report `AUDIT_RESPONSE_2026-08-09.md` sits at repo root — contradicting the §5 convention ("`sessions/` holds dated session reports", root files are "temporary"). `STRUCTURAL_ASSESSMENT_2026-08-09.md` is likewise a lingering temporary file. Fix: move both into `sessions/` (dated filenames), add the §4 index row, delete the root copies. Zero content risk.

**N10 — Small doc drift the gates can't see (P4)** 🆕
- `theme-init.js:4` comment still says "~799 KB data bundle"; the bundle has been 873,042 bytes since the A4 migration (index.html's D4 comment correctly says ~873 KB).
- README "Repository Structure" tree omits `theme-init.js`, `robots.txt`, `sitemap.xml`, `.nojekyll`, `package.json/package-lock.json`, `scripts/ingest_cbeta.py` (deprecated wrapper), `scripts/migrate_translations.py`, `gongan/theme_vocabulary.json`, and `response_summary.md` — all shipped/handled by gates. One small tree refresh closes the gap.
- ~~`.translation-source` renders at **0.62 rem (~10 px)**~~ ✅ FIXED 2026-08-09 (session `019fe731`): raised to 0.72 rem; smoke-guarded legibility floor.

---

## 2. Carried forward (already documented, still open — verified unchanged)

| ID | Item | Owner/Blocker |
|---|---|---|
| CF-1 | **CI artifact gate misses `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`** (workflow line 48 path list). Files can drift root→docs without CI failing. HANDOFF documents this as an owner follow-up because the previous session token lacked `workflows` permission — **this session should attempt the one-line fix and push; if GitHub rejects it, it stays an owner action.** | token permission (test) |
| CF-2 | `switchViewRaw` scroll-restore on back/forward (AUDIT.md §2 editorial candidate) | editorial |
| CF-3 | A1 ops: require the Quality check in `main` branch protection (~2 min, owner-only) | owner |
| CF-4 | A2 editorial: 5 pending verified-source references; 33 doc-level locator migrations; rights sign-off | editorial |
| CF-5 | C1 module split (opportunistic, zero-build preserved); C2 schema strictness wave 3 (corpus shape objects); C4 lint in CI (also blocked on workflows permission) | structural |
| CF-6 | Content Phase 2: Biyanlu 11–100, Linji completion pilots | content |

## 3. Recommended order (all batches independently shippable, gates all green after each)

1. **Housekeeping batch (~30 min, zero risk):** N9 (session files → `sessions/` + §4 index row), N10 (stale comment + README tree), CF-1 attempt (one-line CI path fix — best-effort per token permission).
2. **A11y depth batch (~1 h):** N1 (reduced-motion helper + guard), N3 (focus shows term popover + role/aria-describedby), N2 (dossier dialog semantics/Escape/focus), N6 (search label). Smoke tests can assert each (the suite already static-guards HTML patterns).
3. **Search UX batch (~1–2 h):** N5 (diacritic-fold in `normalizeForSearch` + regression test), N4 (matched-field snippet + "matched in translations" label).
4. **P4 sweep (opportunistic):** N7 resize re-layout, N8 popover max-height, 0.62 rem citation legibility.

---

## 4. Explicitly checked and cleared (no action needed)

- Escaping/XSS: every `innerHTML` interpolation routes through `escHtml()`; no inline `on*` handlers; poison-fixture smoke test guards it.
- Data contract: all 36 corpus JSON + support files parse; matrix labels (9 unique, 8 non-AI) match validator tallies; wumenguan/biyanlu shapes match renderer field expectations.
- Deterministic build, docs mirror, metrics/doc-truthfulness rules (27 active checks incl. AUDIT.md §1).
- Hero counts are data-derived at runtime (static HTML fallback is gated against the live count).
- CSP (`script-src 'self'`), storage hardening, smoke coverage of all 36 texts/modes/search.
- Git state clean; single-commit shallow history is the environment's checkout, not a project issue.
