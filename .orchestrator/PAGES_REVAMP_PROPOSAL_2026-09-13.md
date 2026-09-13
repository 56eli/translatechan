# GitHub Pages Revamp — Proposal and Checkpoint-C Questions (2026-09-13)

> **Status:** proposal only — **no code in this PR**. Nothing here is implemented until the owner answers the Checkpoint-C questions in §10 and the answers are recorded verbatim in `.orchestrator/STATE.md`.
> **Location choice:** this file lives under `.orchestrator/` (coordination material) and is deliberately **not** mirrored into `docs/`, because `docs/` is the byte-identical Pages deploy mirror produced by `scripts/build_data_bundle.py` and must not carry hand-placed files. Single source of truth = this file.
> **Evidence discipline:** every number below was measured by copy on `main` @ `93afcb5` (2026-09-13). Commands are given so a reader can **confirm, do not copy**. No browser was run (R-W3); nothing here is screenshot-verified.

---

## 1. Executive summary

Fake Chan Factory's public site is a zero-backend, five-room static SPA (`index.html` + `theme-init.js` + `app.css` + `app.js` + generated `app_data.js`, mirrored into `docs/`) that already carries the owner's walnut-hall direction, an English-first hierarchy and honest provenance ledgers, but which the owner judged **too plain/generic and too Chinese-dominant** on 2026-08-11 and has now declared will be **reworked drastically** as the top engineering priority. This proposal recommends keeping every structural invariant (5 rooms, vanilla JS, no backend, no framework, CSP `script-src 'self'`, internal identifiers, data pipeline, humor only in Robo names) and spending the revamp budget on three things: (1) a **consolidated visual system** — one token sheet, one typographic scale, one component vocabulary per room — that makes the Chan-hall/walnut identity distinctive rather than decorative; (2) a **room-by-room re-composition** in slices (masthead → Reader → Matrix/Lineage/Gong'an/Lexicon) that each ship behind the five quality gates; and (3) two long-standing engineering debts folded into the same work because the revamp touches every render template anyway — **eliminating the 58 JS inline-style sites so `style-src 'unsafe-inline'` can be dropped**, and a **measure-first performance pass** on the 1.64 MB data global. Five owner decisions (visual intensity, typography posture, Chinese/English balance, performance strategy, revamp scope/sequencing) gate the work and are asked in §10.

---

## 2. Current state assessment (measured)

### 2.1 Payload

| Asset | Bytes (raw) | gzip -6 | Command (confirm, do not copy) |
|---|---:|---:|---|
| `app_data.js` | 1,641,935 | 513,169 | `ls -l app_data.js` · `gzip -c app_data.js \| wc -c` |
| `app.js` | 173,282 (3,462 lines) | 44,976 | `ls -l app.js` · `wc -l app.js` |
| `app.css` | 67,165 (2,572 lines) | 13,806 | `ls -l app.css` |
| `index.html` | 17,767 (260 lines) | — | `wc -l index.html` |
| `theme-init.js` | 876 | — | `ls -l theme-init.js` |
| `og-image.svg` / `robots.txt` / `sitemap.xml` | 2,954 / 82 / 246 | — | `ls -l og-image.svg robots.txt sitemap.xml` |
| **Total shipped JS+CSS+HTML** | **≈1.90 MB** | **≈572 KB** | sum of the above |

Data-global composition (`window.TRANSLATECHAN_DATA`, JSON string length per top-level key; `node -e` over `app_data.js`): `corpus` 958,663 · `canonical_locators` 184,779 · `lineage` 43,531 · `project_metrics` 36,979 · `translator_profiles` 16,985 · `glossary` 13,321 · `lineage_verification` 12,821 · `translations_provenance` 11,025 · `gongan_index` 11,024 · `translations_matrix` 9,180 · `corpus_manifest` 7,738 · `translations_rights` 5,736 · `lineage_school_vocab` 2,321 · `gongan_theme_vocab` 1,966 · `meta` 221. Inside `corpus`, three documents carry ~64 % of the bytes: `biyanlu_cases` 245,585 · `linji_yulu` 207,363 · `wumenguan` 160,106; the next largest is `xinxin_ming` 44,248. **This is the load-bearing fact for any lazy-loading proposal (§4.4).**

Bundle is < 2 MB (P2 threshold in `WEB_VISION` §7). The whole global plus all five rooms is parsed and rendered at boot (`app.js:197–222`, `init()` calls `renderReader(); renderMatrix(); renderLineage(); renderGonganIndex(); renderLexicon();`). No browser-measured timing exists (R-W3).

### 2.2 Rooms and shell

- Exactly **5** `role="tab"` buttons in `index.html` (`grep -c 'role="tab"' index.html` → 5): Read/閱藏堂, Compare/對勘, Lineage/傳法堂, Cases/公案架, Terms/詞林. `role="tablist"`, `aria-selected`, roving `tabindex` present. Smoke test forbids `data-view="studio"`, `data-view="agents"`, and the header GitHub link (`scripts/smoke_test.mjs:15`).
- Shell = sticky walnut header (`--wood-950 #211814 … --wood-800`), `FC` monogram, search, theme toggle, `Aa` settings (pinyin/rōmaji master names), room tabs; hero `zen-hero-banner` with kicker "Open Chan Lab · Edition 01 / 2026", hook **"The old texts are real. *The translators are not.*"**, `PROUDLY FAKE ENGLISH` stamp and two live counts (35 / 21). No footer (removed per owner). Mobile bottom action bar (A− A+ | Bi All Zh | Py # ↑).
- Scripts: 4 external (`theme-init.js` sync in head; `app_data.js` + `app.js` `defer`; Google Fonts stylesheet). 0 inline `<script>`, 0 inline event handlers.

### 2.3 Styling and CSP

- `index.html`: **0** `style=` attributes, **0** `<style>` blocks (`grep -c 'style=' index.html` → 0; `grep -c '<style' index.html` → 0). README's "no HTML inline styles" claim is true as worded (W-1).
- `app.js`: **41** `style="…"` attribute literals (`grep -n 'style="' app.js | wc -l` → 41, at lines 374, 1607, 1710, 1792–1843, 1892, 1928–1948, 1961, 1972, 1995, 2036, 2047, 2060, 2907, 2961–2967) **+ 17** `.style.prop =` writes (`grep -nE '\.style\.[a-zA-Z]+ *=[^=]|\.style\.setProperty' app.js` → 20 lines, of which 17 are distinct write sites: 15 `display`, 1 `left`, 1 `top`, plus 2 `setProperty` for `--shell-height` / `--zh-font-size`; the 9 `.style.display ===` reads are excluded) = **58 JS inline-style injection sites** (W-2 / D-4; HANDOFF.md:110 now states 58).
- Literal spot-checks show they are all *layout nudges that belong in classes*: `margin-top:.35rem;font-style:italic`, `font-size:0.75rem;color:var(--text-muted)`, `border-left:4px solid var(--accent-green)`, `font-size:1.2rem` on the `lang="zh"` classical blocks, `background:var(--bg-card);border-left-color:var(--accent-blue)`.
- Shipped CSP (`index.html:24`, precedes all scripts): `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'`. `'unsafe-inline'` is load-bearing only because of the 58 sites above (W-3).
- `app.css` `:root` declares **63** custom properties (`grep -c "^  --" app.css`), including `--shell-height: 7.25rem` (measured at runtime, `app.js:152`) and `--zh-font-size: 1.2rem` (user-adjustable). Font stacks: Noto Serif SC (Google), Kai fallbacks, system sans (Inter loaded from Google but listed after system fonts), `ui-monospace`.

### 2.4 Responsive and accessibility

- **14** `@media` rules (`grep -c "@media" app.css` → 14): 4 × `max-width: 1024px` (shelf/sidebar collapse), 6 × `max-width: 768px` (mobile layout), 1 × `max-width: 720px` (ledger rows), 1 × `min-width: 600px`, 1 × `print`, 1 × `prefers-reduced-motion: reduce` (`app.css:2028`).
- `lang="zh"` occurrences: **26** in `app.js`, **10** in `index.html` (`grep -o 'lang="zh"' app.js | wc -l`; same for `index.html`).
- `:focus-visible` **14** rules (`grep -c ':focus-visible' app.css`). `tabindex` **14** occurrences across `index.html` + `app.js`. Skip link present. Dossier is `role="dialog"` with focus management (HANDOFF §6). Contrast-safe tokens (`--text-muted` darkened to pass AA).
- Resilience: malformed `localStorage` prefs fail soft; missing/malformed bundle renders a recovery panel with reload/reset (HANDOFF §6).
- **No real-browser evidence** (screenshots, Lighthouse, axe) exists for the current build; Playwright suite is dev-only and skips as success without Chromium (HANDOFF §5). This proposal inherits that gap and does not claim otherwise.

### 2.5 Content the site must present honestly (from `data/project_metrics.json`)

35 corpus documents (0 complete, 4 `partial_selected_witness`, 31 `excerpt_seed`); 1,252 translation slots (177 `verified_quotation`, 199 `ai_draft`, 876 `reconstruction_unverified`); 21 matrix entries; 148/148 case locators; 104,564 content CJK characters; W1 source-review 1 / 32 / 2 (collated / partial-or-failed / unavailable); 5 disclosure ledgers (source collation, represented units, translation & edition verification, canonical locator, rights review); 14 rights records all pending human review. **The redesign must make these ledgers calmer, never quieter.**

---

## 3. Owner feedback synthesis

| Date | Feedback (verbatim or near) | What the current build did about it | Residual gap |
|---|---|---|---|
| 2026-08-10 | Chan hall in dark walnut; first 30 s = Chan literature/Zen feeling with Robo monks as practical joke, then serious literature; sophisticated minimal; no gimmicks; humor only in Robo names; no Japanese aesthetics; no footer / conveyor / CTA | Walnut tokens, `FC` mark, hero joke once, footer removed, no animation | Hall "feeling" never validated; owner later found result generic |
| 2026-08-11 | **Too plain and generic**; **too much focus on Chinese characters**; **preserve** the walnut-hall direction rather than replace it | English-first hierarchy, editorial/factory hero, progressive disclosure, Robo footers removed | Owner now says the site will be **reworked drastically** — the English-first pass fixed hierarchy but not distinctiveness |
| 2026-09-13 (Pack 1, STEP 2) | Pages revamp is the top engineering priority; **proposal first, no building** until direction is confirmed | — | This document |

Synthesis: the three feedback rounds are consistent, not contradictory. "Preserve walnut" + "too plain" + "too much Chinese" means: *keep the material and the honesty, change the composition and the confidence.* The generic feeling most plausibly comes from (a) a component vocabulary borrowed from dashboards — pills, chips, cards, badges, filter rows — applied identically in every room; (b) typography that is safe rather than composed (system sans for almost all English, Noto Serif SC for zh, nothing with a voice); (c) a hero that states the joke but a reading surface that looks like documentation; and (d) 58 ad-hoc inline nudges plus 63 tokens that were accreted rather than designed. "Too much Chinese" was addressed at the hierarchy level; the residual is that the *only* distinctive typographic material on the page is still the CJK, so when it is de-emphasised the page has nothing left to look like.

---

## 4. Proposed approach

### 4.1 Keep the architecture, change the surface

Static Pages from `main/docs`, vanilla ES2015+ IIFE, single global `TRANSLATECHAN_DATA`, CSP `script-src 'self'`, no inline handlers, `data-*` delegation — all unchanged. No framework, no bundler, no dependency additions, no backend, no external JS. The revamp is a **CSS + template rewrite** inside the existing renderers, not a re-platform.

### 4.2 One visual system, designed once, applied per room

- **Token consolidation:** reduce `:root` from 63 accreted properties to a designed set (target ≈ 40): palette (walnut 950/900/800, paper 3 steps, ink, tea, gold, verified green, Robo blue, one warning red), type scale (one modular scale, ~7 steps, shared by zh and en with distinct line-heights), spacing scale (6 steps), radius (2 values), elevation (2 values), motion (1 curve, 1 duration, zeroed under reduced-motion). Every `[data-theme="dark"]` override maps 1:1.
- **Typography with a voice:** the English needs its own material so the Chinese can recede without the page going blank. Proposal: an English serif for headings, hook and reading translations (candidates that stay inside current CSP: a self-hosted open-licence serif such as *Source Serif 4* or *Fraunces*, or a Google-served one via the already-allowed `fonts.googleapis.com`), system sans retained for UI controls only, `ui-monospace` retained for counts/locators. Chinese stays Noto Serif SC + Kai fallbacks for source text. Option set in Q2.
- **Component vocabulary per room, not one for all:** Reader gets *sheets*, Matrix gets *proof rows*, Lineage gets a *register/chart*, Gong'an gets a *catalogue table*, Lexicon gets *dictionary entries*. Pills/chips/cards survive only where they are genuinely the right control (filters), and get one shared style.
- **The Chan-hall gate is architecture, not ornament:** the walnut is expressed through structure (header lintel, hero beam, rule lines, margins) not textures, illustrations or icons. No new imagery; `og-image.svg` re-drawn to match the final system (PNG fallback remains a separate deferred item).

### 4.3 CSP hardening rides along

Every one of the 58 inline-style sites lives in a template or a show/hide toggle that the revamp touches anyway. Plan: 41 literals → named classes; 15 `display` writes → the `hidden` attribute or a `data-state`/class toggle; 2 popover `left`/`top` writes → CSS custom properties set via `setProperty` *is still inline style under CSP*, so instead position via `data-*` + CSS `anchor()`-free fallback: a small set of positional classes or a wrapper that is positioned by CSS `inset` from values placed on an attribute selector — or, if that proves impractical, accept 1–2 remaining `setProperty` calls and keep `'unsafe-inline'` with an honest note. Success criterion: `style-src 'self' https://fonts.googleapis.com` with 0 console violations in the (dev-only) Playwright run, and the smoke test extended to assert `grep -c 'style="' app.js == 0`. This resolves frozen track PR-B.

### 4.4 Performance: measure first, then decide per-room data loading

Facts: 1.64 MB raw / 513 KB gzip; Pages serves gzip/brotli; three documents are ~64 % of `corpus`. Options (Q4): (A) leave the single global and only defer hidden-room *rendering* to first activation (cheap, no pipeline change, removes the boot-time render of four hidden rooms); (B) split the build output into `app_data.core.js` (manifest, metrics, glossary, lineage, gong'an, matrix, locators, and the currently selected document) plus per-document `app_data.corpus.<key>.js` loaded on shelf selection via an injected `<script>` (still `script-src 'self'`, still static, but `build_data_bundle.py`, `smoke_test.mjs`, the docs mirror check and the recovery UI all need to learn about multiple files); (C) do nothing until real-browser timings exist. Recommendation: **A now, B only after a measured need** — it keeps the byte-identical-rebuild contract untouched. This resolves or formally closes frozen track PR-D.

### 4.5 Accessibility and responsiveness are part of the design, not a pass afterwards

Keep all current a11y behaviour (tabs, skip link, dialog focus, reduced motion, `lang="zh"` on every source span). Add: a single documented breakpoint set (proposal: 1024 / 768 / 480) replacing the mixed 1024/768/720/600 today; `:focus-visible` ring from one token; touch targets ≥ 44 px everywhere (currently only guaranteed on the mobile bar); heading outline that reads correctly per room; live-region announcements for shelf/filter result counts. Contrast re-checked against the new palette by computed ratio in the smoke script (no browser needed).

---

## 5. Zones breakdown

| Zone | Files | Today | Revamp touches | Preserve |
|---|---|---|---|---|
| **Z1 HTML shell** | `index.html` (260 lines) | Header, 5 tabs, hero, 5 `<section role="tabpanel">`, mobile bar, CSP meta, fonts links, preload | Hero re-composition, room-heading markup, mobile bar composition, font `<link>`s, CSP `style-src` tightening at the end of Phase 3 | CSP-before-scripts, 4 external scripts, `data-view` ids, `role=tab` × 5, skip link, canonical/OG meta, recovery panel hooks |
| **Z2 Theme bootstrap** | `theme-init.js` (876 B) | Pre-paint `data-theme` from `translatechan_theme` | Nothing functional; possibly also pre-apply persisted `--zh-font-size` class to avoid a text-size flash | Sync external file, try/catch storage, key name |
| **Z3 Styles / tokens** | `app.css` (2,572 lines, 63 tokens, 14 `@media`) | Accreted token sheet + per-feature blocks | Rewritten around the §4.2 system; expected to *shrink*; new class names for the 41 former literals | Dark theme parity, reduced-motion, print, `--shell-height` / `--zh-font-size` contract |
| **Z4 Renderers** | `app.js` — `renderReader` (1622), `renderMatrix` (2412), `renderLineage` + `renderVisualLineageGraph` (2612/2648), `renderGonganIndex` (3004), `renderLexicon` (3072), popovers (293–481), settings/mobile bar handlers | Template strings with inline styles; all rooms rendered at boot | Template markup per room; class-based show/hide; lazy first-render per room; **no data-shape or logic change** | `window.TranslateChan` API, `translatechan_*` keys, `escHtml` discipline, `data-*` delegation, fail-soft prefs, recovery UI, `PROVENANCE_NOTE_KEYS`, ledger rendering rules |
| **Z5 Data consumption** | `app_data.js` (generated), `scripts/build_data_bundle.py` | Single global, byte-identical rebuild | Phase 2 option A: none. Option B (only if chosen in Q4): split emit + loader | Pipeline order, validator as spec, byte-identical mirror |
| **Z6 Deploy mirror** | `docs/` (root assets + `docs/data/`) | Produced by build, checked by CI structural diff (O-3) | Never hand-edited; regenerated per slice | `diff -rq data docs/data`, mirror check |
| **Z7 Assets / SEO** | `og-image.svg`, `robots.txt`, `sitemap.xml`, favicon data-URI | Rice-paper OG card with 假禪工廠 | OG card redrawn to final system; favicon aligned | `robots`/`sitemap` unchanged |
| **Z8 Guards** | `scripts/smoke_test.mjs`, `scripts/validate_data.py` doc-truth gate, README/HANDOFF/WEB_VISION prose | Forbid extra rooms and GitHub link; pin counts | Add inline-style-zero assertion; update interface-claim prose *after* each slice so the doc-truth gate keeps passing | Everything already guarded |

---

## 6. What is preserved

- Public scope of **exactly 5 rooms** (Reader, Matrix, Lineage, Gong'an, Lexicon); no Translation Studio, Arena Agents, or header GitHub link.
- Internal identifiers: `translatechan_*` localStorage keys, `window.TranslateChan`, `window.TRANSLATECHAN_DATA`.
- Brand: **Fake Chan Factory**, `FC` monogram, the hook **"The old texts are real. The translators are not."**, humor-forward tone confined to Robo names (Robo Red Pine, Robo T-Cleary, Robozuki, Roblofeld …) — no humor in the reading flow.
- English-first hierarchy with source Chinese central *inside the Reader* and every source span keeping `lang="zh"`.
- Progressive disclosure (`<details>` ledgers/front matter, no repeated Robo footers) and the **five disclosure ledgers** with edition-verification and rights kept as separate statements.
- No framework, no backend, no external JS, no new dependency, no build tool; static from `main/docs`.
- Recovery UI, fail-soft prefs, reduced-motion handling, keyboard tabs, dialog focus management, skip link.
- Data pipeline and gates: `data/ → validate_data.py → project_metrics.json → build_data_bundle.py → root + docs/`; five gates before every push.
- Bundle budget < 2 MB raw; no added image payload beyond the redrawn SVG.
- Vision anti-goals: no Japanese aesthetics, no footer, no conveyor, no CTA buttons, no carousels/popups/tours, no gamification.

## 7. What changes

| Area | Today | Proposed |
|---|---|---|
| **Masthead / hero** | Editorial kicker + hook + stamp + 2 counts, dismissable; header and hero are two stacked bands | One composed walnut gate: lintel header, hook set in the new English serif, 假禪工廠 present but subordinate, counts as a quiet colophon line; the first Reader sheet visible in the first viewport on desktop (WEB_VISION §7 target) |
| **Typography** | System sans for nearly all English; Noto Serif SC for zh; no scale | One modular scale; English serif with a voice for headings/hook/translations; sans for controls; mono for locators; zh measure/line-height tuned per room |
| **Tokens** | 63 accreted | ≈ 40 designed, documented in a header comment block in `app.css` |
| **Reader** | Ruled sheets, breadcrumb, kicker, ledgers, case rail, per-unit cards for translations | Sheet as *the* unit: source column with generous measure, translations set as running prose beneath or beside (mode-dependent), ledgers folded into a single "About this edition" drawer, case rail retained but restyled as a thin register; fewer borders, more whitespace |
| **Matrix** | `matrix-proof-sheet` cards with registers grid | Proof rows: one source line, then translators as aligned rows with status glyph and Robo name in the margin — a collation table, not cards |
| **Lineage** | SVG network + directory cards, toolbar with Reset | Transmission register first (generations as ruled bands, houses as columns), network chart as an optional second view; dossier restyled as a sheet |
| **Gong'an** | Cards + theme chips | Catalogue table (case no., title, collection, theme, locator) with theme filter as a single row of text filters |
| **Lexicon** | Grid of definition cards, category select + search | Dictionary entries as running list (headword zh + pinyin + literal, definition, category in margin) |
| **Mobile** | Bottom bar with 8 pills | Same functions, regrouped to two clusters (size/mode · pinyin/jump), 44 px targets, hides when a popover is open |
| **Inline styles** | 58 JS sites, CSP needs `'unsafe-inline'` | 0 JS sites (or ≤ 2 documented), `style-src 'self' https://fonts.googleapis.com` |
| **Boot** | All 5 rooms rendered at init | Hidden rooms render on first activation (option A) |
| **Breakpoints** | 1024 / 768 / 720 / 600 mixed | 1024 / 768 / 480 documented |
| **OG image** | Prior-vision rice-paper card | Redrawn to match final system |
| **Docs** | README/HANDOFF/WEB_VISION describe the 08-11 build | Updated per slice; `WEB_VISION_2026-08-10.md` remains historical; a dated `WEB_VISION_2026-09-*.md` or a section in this file becomes current authority after Q1–Q5 answers |

---

## 8. Risks and constraints

| # | Risk / constraint | Mitigation |
|---|---|---|
| R1 | **No browser evidence** (R-W3): Chromium unavailable; Playwright skips as success. Visual claims cannot be verified in-repo | Ship each slice with repo-gate evidence only, state so explicitly; owner reviews the live Pages deployment per slice; no "screenshot-verified" language |
| R2 | **Doc-truthfulness gate** pins interface prose in README/HANDOFF/WEB_VISION; a slice that changes behaviour without updating prose fails `validate_data.py` | Each slice PR includes its prose update; gate run before push |
| R3 | **Smoke-guarded scope**: any new `data-view`, section id, or GitHub link fails smoke | Design never adds a room; secondary views (Lineage chart) live inside the existing section |
| R4 | **CSP tightening can break silently** (a missed inline style just stops applying) | Order of work: classes first, assert `style="` count = 0 in smoke, *then* change the CSP meta in a separate, revertable commit |
| R5 | **Bundle split (Q4 option B)** touches the build, mirror check, recovery UI and smoke; risk of breaking the byte-identical contract | Not chosen by default; if chosen, it is its own phase with its own gate extension |
| R6 | **Font choice** may add a third-party request or a self-hosted binary (~100–300 KB) | Decide in Q2; self-hosted must be open-licence and committed under a documented path; Google-served stays inside current CSP |
| R7 | **Validator is spec, schema is declarative** — the renderer must keep tolerating shapes exactly as today | No data-shape change in scope; renderers keep `isRecord`/`normalizeTranslationEntry` guards |
| R8 | **Regression of honesty**: a calmer ledger must not hide `partial_or_failed_w1_collation`, rights status, or Robo/AI markers | Smoke's forbidden-claim checks stay; ledger content unchanged, only its container restyled |
| R9 | **Scope creep** into frozen tracks PR-A (real browser), PR-B (CSP), PR-D (perf) | PR-B and PR-D are folded in deliberately and named; PR-A stays frozen |
| R10 | **Workflow edits** (a required browser job) need owner approval | Not proposed here; Phase 4 lists it as an ask, not a step |
| R11 | Session interruption mid-slice | Each slice is independently shippable and gate-green; no half-migrated CSP |

---

## 9. Implementation plan (phased; nothing starts before Checkpoint-C answers)

| Phase | Content | Exit criterion |
|---|---|---|
| **0 — Proposal** (this PR) | Proposal + Checkpoint-C questions | Owner answers recorded verbatim in `.orchestrator/STATE.md` |
| **1 — System + masthead** | Token sheet + type scale + English serif decision; header/hero/room-heading re-composition; mobile bar regroup; OG image redraw; docs prose | 5 gates green; owner reviews live Pages; go/no-go on the system before rooms are touched |
| **2 — Reader** | Sheet redesign, ledger drawer, case rail, all Reader inline styles → classes, hidden-room lazy first-render (perf option A) | 5 gates green; `style="` count in Reader templates = 0; owner review |
| **3 — Secondary rooms** | Matrix proof rows → Lineage register/chart → Gong'an catalogue → Lexicon entries (one PR each or two paired), remaining inline styles → classes, popover positioning without inline style; **then** CSP `style-src` tightened in its own commit | `grep -c 'style="' app.js` = 0 asserted in smoke; CSP without `'unsafe-inline'`; 5 gates green |
| **4 — Evidence and approval** | Owner light/dark desktop/mobile review of the live site; HANDOFF §3–§5, README interface section, and a dated current-vision doc finalised; frozen tracks PR-B/PR-D closed or re-scoped; **ask** (not do) whether a required real-browser CI job is approved | Owner approval recorded; no self-declared completion |

Each slice: one PR, base `main`, five gates before push, docs mirror regenerated by the build, no hand edits under `docs/`.

---

## 10. Checkpoint-C question set

Discipline: each question names the zone it targets (verified against §5 so that the answer is actionable in a specific file), offers 2–4 discrete options plus free text, and the owner's answer is recorded **verbatim** in `.orchestrator/STATE.md` before any code. Recommended option marked ★ where the proposer has one.

### C-1 · Visual intensity of the "drastic" rework — zones Z1, Z3 (all rooms)

How far from the current build should the walnut hall move?

- **(a) Re-compose** — keep the current palette and structure, redesign typography, spacing and every room's component vocabulary (§7). Recognisably the same site, clearly more composed. ★
- **(b) Re-build the surface** — same as (a) plus a new hero/shell architecture (e.g. hero and header merged into a single gate, first sheet visible immediately, tabs restyled as a hall directory).
- **(c) New visual identity on the same bones** — palette, marks and hero all reconsidered; only the walnut *material* and the honesty rules survive.
- **(d) Custom:** ________

### C-2 · English typographic voice — zones Z1, Z3

The page needs an English typeface with character so Chinese can recede without the page going generic. Which posture?

- **(a) Scholarly serif** (e.g. Source Serif / Fraunces class) for hook, headings and translations; sans only for controls. ★
- **(b) Editorial grotesk** — a distinctive sans (self-hosted, open-licence) for everything English; serif reserved for zh.
- **(c) Keep system fonts** — no new webfont; achieve voice through scale, weight and spacing only (lightest payload, least distinctive).
- **(d) Custom:** ________

Sub-decision (answer inline): webfonts **self-hosted under `/fonts/`** (no third-party request; adds ~100–300 KB, `font-src 'self'` only) or **Google-served** (current CSP, no repo bytes).

### C-3 · Chinese/English balance in the first viewport — zones Z1, Z4 (Reader)

"Too much focus on Chinese characters" was addressed at hierarchy level. In the redesigned first viewport, the source Chinese should be:

- **(a) Present but subordinate everywhere except inside the Reader sheet**, where it is the largest text on the page. ★
- **(b) Equal partner** — zh and en headings set at the same optical size in a two-language lockup, Reader unchanged.
- **(c) English-only masthead**; 假禪工廠 appears only in the OG card and the Reader.
- **(d) Custom:** ________

### C-4 · Performance strategy — zones Z4, Z5, Z6, Z8

The 1.64 MB single global is under budget and no browser timing exists. Choose:

- **(a) Render-lazy only** — keep one bundle; hidden rooms render on first activation. No pipeline change. ★
- **(b) Split the bundle** — core + per-document corpus files loaded on shelf selection (still static; touches build, mirror check, smoke, recovery UI).
- **(c) No performance work** in the revamp; revisit only after real-browser measurement (PR-A) is possible.
- **(d) Custom:** ________

### C-5 · Scope and sequencing of the revamp — all zones

- **(a) Full plan as §9**: system + masthead → Reader → four secondary rooms → CSP tightening → evidence. Fold PR-B (CSP) and PR-D (perf option) in. ★
- **(b) Masthead + Reader only** now; secondary rooms and CSP stay as separate later decisions.
- **(c) System + all rooms, but leave CSP `'unsafe-inline'`** as is (skip §4.3).
- **(d) Custom:** ________

Answers to C-1…C-5, recorded verbatim with date, unblock Phase 1. Anything not asked here (e.g. dark-theme parity, reduced motion, 5-room scope, humor rules) is treated as already ruled and will not be re-asked.

---

## Appendix A — Measurement commands (confirm, do not copy)

```
ls -l app_data.js app.js app.css index.html theme-init.js og-image.svg robots.txt sitemap.xml
gzip -c app_data.js | wc -c ; gzip -c app.js | wc -c ; gzip -c app.css | wc -c
wc -l index.html app.js app.css
grep -c "@media" app.css ; grep -n "@media\|prefers-reduced-motion" app.css
grep -n 'style="' app.js | wc -l                                   # 41
grep -nE '\.style\.[a-zA-Z]+ *=[^=]|\.style\.setProperty' app.js   # 20 lines; 17 distinct write sites + 2 setProperty (see §2.3)
grep -nE '\.style\.display ===' app.js | wc -l                     # 9 reads, excluded
grep -c 'style=' index.html ; grep -c '<style' index.html          # 0 / 0
grep -o 'lang="zh"' app.js | wc -l ; grep -o 'lang="zh"' index.html | wc -l   # 26 / 10
grep -n 'Content-Security-Policy' index.html
grep -c 'role="tab"' index.html ; grep -c ':focus-visible' app.css ; grep -c "^  --" app.css
grep -n "render.*Reader\|render.*Matrix\|render.*Lineage\|render.*Gongan\|render.*Lexicon\|PROVENANCE_NOTE_KEYS\|renderProvenanceNotes" app.js
python3 -c "import json;m=json.load(open('data/project_metrics.json'));print({k:v for k,v in m['corpus'].items() if k!='per_text'})"
```

## Appendix B — Sources read for this proposal

`.orchestrator/STATE.md` (canonical tracker), orchestrator working state (via `/tmp/state.md`), TC-PACK-1 Part A Steps 1–2, TC-PACK-2 Lane 3 W-1..W-6 / C-2 / C-3 / D-4, `README.md` §Overview / §English-First Walnut Hall Interface / §Key Features / §Public Pages Scope, `HANDOFF.md` §3 / §5 / §6, `index.html` (full), `theme-init.js` (full), `app.js` (head + renderer index), `app.css` (tokens + media queries), `app_data.js` (key sizes), `WEB_VISION_2026-08-10.md` (full), `UX_ROADMAP.md`, `vision.md`, `data/project_metrics.json`, `AGENTS.md`, `scripts/smoke_test.mjs` (scope guards), `scripts/build_data_bundle.py` (mirror), `sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md` (owner feedback record).
