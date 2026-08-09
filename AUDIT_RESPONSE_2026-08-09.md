# 🔍 TranslateChan — Full Independent Audit (2026-08-09, session `019fe64a`)

> **One-sentence verdict:** The project is in genuinely strong shape — every quality gate is green, the data contract/doc-truthfulness/escaping tooling is unusually mature for a static corpus app, and I found **no P0/P1 defects**; the items below are P3/P4 polish, consistency, and future-proofing opportunities.

This is a temporary response file for review. Durable session history lives in
`sessions/` and the slim current-state summary in `AUDIT.md`.

---

## 0. How I audited

- Re-ran the full local gate chain (all pass):
  - `python3 -m py_compile scripts/*.py` ✅
  - `python3 scripts/validate_data.py` → `corpus=36 | slots=874 | verified=138 | matrix=21 | locators=64/64` ✅
  - `python3 scripts/build_data_bundle.py` → 798,825-byte deterministic bundle ✅
  - `node scripts/smoke_test.mjs` → 36 texts exercised, 0 crashes ✅
  - `node --check` on `app.js`, `smoke_test.mjs`, `browser_test.mjs` ✅
  - `diff -rq data docs/data` + root/docs asset sync → byte-identical ✅
- Read every top-level doc, all Python tooling, the JSON schema, the CI workflow,
  `index.html`, all 2,324 lines of `app.js`, and all 1,516 lines of `app.css`.
- Programmed checks for: broken internal markdown links, JSON validity across
  all data files, unescaped `innerHTML` interpolations, inline event handlers
  (CSP), headings/landmarks/alt text, translator-name drift, school/color
  provenance, and matrix/corpus status tallies.

---

## 1. Architecture & repository health — ✅ strong

| Area | Status | Notes |
|---|---|---|
| Zero-backend static design | ✅ | `app_data.js` global + dependency-free `app.js`; clean IIFE, `'use strict'`. |
| Deterministic build | ✅ | `build_data_bundle.py` produces canonical JSON; CI fails on uncommitted drift. |
| Data validation | ✅ | `validate_data.py` (~1,094 lines) enforces schema + cross-file semantics + rights + locators + **doc truthfulness (25 rules)** + controlled vocabularies. |
| Test coverage | ✅ | 568-line dependency-free smoke suite + optional Playwright browser tests. |
| CI | ✅ | `.github/workflows/quality.yml` mirrors the local gate chain on push/PR. |
| Security | ✅ | Strict CSP (`script-src 'self'`, no inline handlers), uniform `escHtml()` at every interpolation, storage input hardened, citation popovers carry structured data not HTML. |
| Accessibility baseline | ✅ | Skip link, ARIA tabs with roving tabindex, `aria-label`s, focus-visible styles, `prefers-reduced-motion`, `lang="zh"` on Classical Chinese blocks, keyboard-operable graph/cases. |
| a11y/UX polish already shipped | ✅ | Collapsed-on-touch case cards, debounced search, lazy case rendering, persisted prefs, print stylesheet, mobile action bar, hash deep links. |

**No P0/P1/P2 defects found.** The codebase is notably disciplined about the
things that usually rot in a project like this (provenance, escaping, doc/metric
drift, generated-artifact sync).

---

## 2. Findings (P3 = low-risk polish, P4 = nice-to-have)

### A. Documentation / consistency

**A1 — Broken historical links in two dated session reports (P4, trivial)** — ✅ FIXED 2026-08-09 (session `019fe64a`)
`sessions/SESSION_AUDIT_2026-08-08.md` and `sessions/SESSION_AUDIT_2026-08-08_019fe30b.md`
contained `./AUDIT.md` links that 404 from inside `sessions/`. Corrected to
`../AUDIT.md`; internal markdown-link check now reports zero broken links.

**A2 — "Graph colors derived from data" claim is half-true (P3, consistency)** — ✅ FIXED 2026-08-09 (session `019fe64a`)
Added a curated `color` hex to every school in
`data/lineage/school_vocabulary.json`; the validator now requires a 6-digit hex
per school (negative-tested: missing color → exit 1), the schema declares the
field, `app.js` derives the graph palette via `schoolColorMap()` (hardcoded map
removed), and smoke test `4m2b` guards both the absence of a hardcoded palette
and the presence of per-school colors in the bundle. The "graph colors are
derived from this vocabulary" claim in `HANDOFF.md` and the policy note is now
literally true.

**A3 — Matrix subtitle is hand-maintained and already fragile (P3)**
`index.html` line 142 hardcodes the translator list:
> "...across Red Pine, Cleary, Sasaki, Suzuki, Blyth, Blofeld, Yampolsky, Senzaki & Reps, and AI Synthesis"

There are exactly 9 unique translator labels today so it happens to match, but
this is exactly the class of string the doc-truthfulness gate was built to catch
— and it isn't guarded. The matrix has only 4 entries/21 registers, and the
subtitle names translators that don't appear on some rows. Consider either
generating the subtitle from the bundled unique-translator set at runtime, or
shortening it to a stable phrase ("side-by-side comparison across historical and
contemporary translators and AI synthesis") and dropping the proper-noun list.

**A4 — 736 corpus translation slots are still bare strings (P3, known/debt)** — ✅ FIXED 2026-08-09 (session `019fe64a`)
All **736 legacy bare-string corpus translations** were migrated with
`scripts/migrate_translations.py` to explicit objects:
`{"text": ..., "status": "reconstruction_unverified"}` for ordinary registers
and `{"text": ..., "status": "ai_draft"}` for `ai_*` registers. The validator
now rejects new bare strings with a named rule and migration hint, the JSON
schema requires a translation record rather than accepting strings, metrics are
unchanged (`692 reconstruction_unverified`, `44 ai_draft`, `138 verified`), and
smoke test `4m7` asserts that the bundle contains zero legacy string slots.
This makes disclosure status self-describing data instead of a key-naming
convention. The bundle grew from 799,242 to 873,042 bytes because each slot now
carries its status in the serialized client data.

### B. Front-end / UX

**B1 — Dark-theme flash of unstyled content (FOUC) on reload (P3)** — ✅ FIXED 2026-08-09 (session `019fe64a`)
Added an external `theme-init.js` loaded synchronously in `<head>` *before*
`app.css`; it reads `translatechan_theme` from `localStorage` and sets
`data-theme` before first paint. Kept external (not inline) to preserve the
strict CSP (`script-src 'self'`) without a hash/nonce. The build copies it to
`docs/`, the CI generated-artifact gate covers it, and the smoke test asserts it
is referenced, loads before the stylesheet, and performs the theme read/apply.
Returning dark-mode users no longer see a light-mode flash.

**B2 — No real document outline: view titles are `<div>`, not headings (P3, a11y)**
There are **zero `<h1>`–`<h6>` elements** in `index.html`; every section title is
a styled `<div class="text-title-zh/en">`, and reader document titles (app.js
line 863) are also `<div>`s. Sighted users see a hierarchy; screen-reader users
get an undifferentiated blob with no "next heading" navigation. The lowest-risk
fix is to promote each view's `.text-title-zh` to `<h1>` (or `<h2>` under a
visually-hidden `<h1>` per SPA), reader doc titles to `<h2>`, and case titles to
`<h3>`, reusing the existing classes so visual design is unchanged. This is
probably the highest-value accessibility improvement remaining.

**B3 — Decorative emoji are announced by screen readers (P4, a11y)** — ✅ FIXED 2026-08-09 (session `019fe64a`)
Decorative emoji spans in the brand, navigation tabs, search box, theme toggle, and hero chips now carry `aria-hidden="true"`; visible text labels remain intact. The theme toggle's JS-generated sun/moon glyph also renders inside an `aria-hidden` span. A smoke test guards that static decorative emoji spans in `index.html` are hidden from assistive technology.

**B4 — `app_data.js` preload/script loading (P4, perf)** — ✅ FIXED 2026-08-09 (session `019fe64a`)
The app data and application scripts now use `defer`, so browsers can start fetching the 873 KB bundle while parsing HTML instead of blocking at the end of body. The existing preload is retained for the classic global script, and order remains `app_data.js` before `app.js`; the app's DOM-ready path already supports deferred execution. A smoke test guards both the defer attributes and script order.

**B5 — No `theme-color`, Open Graph/Twitter cards, or sitemap/robots (P4, polish)** — ✅ FIXED 2026-08-09 (session `019fe64a`)
Added light/dark `theme-color` meta tags, canonical URL, Open Graph title/description/url, Twitter card metadata, and root-level `robots.txt` and `sitemap.xml`. The build now copies both crawler files into `docs/`, and the smoke test checks that the metadata and generated crawler files exist.

**B6 — Hero chip "8+ Translators Aligned" understates reality (P4, copy)** — ✅ FIXED 2026-08-09 (session `019fe64a`)
The hero corpus and translator counts are now data-derived at startup (`updateHeroCounts()`), replacing the hand-maintained `8+ Translators Aligned` chip with the actual number of unique non-AI translator labels in the comparative matrix. Smoke tests guard the data-derived behavior, and the decorative emoji in the hero chips are marked `aria-hidden`.

### C. Code quality / maintainability

**C1 — `app.js` is a 2,324-line single-file IIFE (P3, structural)**
It's well-organized with clear section comments, but it's now large enough that
onboarding and merge-conflict surface area suffer. Low-urgency, but a future
refactor into ES modules (`views/reader.js`, `views/matrix.js`,
`views/lineage.js`, `views/gongan.js`, `views/lexicon.js`, `lib/escape.js`,
`lib/citations.js`, `lib/search.js`) with a tiny bundler-free native-ESM build
would pay off. **Caveat:** the current zero-build, zero-dependency property is a
deliberate feature; any module split should preserve direct `<script type="module">`
loading or the deterministic `build_data_bundle.py` should concatenate. Don't
introduce a webpack/rollup toolchain just for this.

**C2 — JSON Schema is intentionally permissive (`additionalProperties: true`) (P4)**
The schema is a "companion" and the Python validator carries the real weight,
which is a reasonable division, but the schema won't catch typos in field names
or unknown properties. Consider tightening a few high-traffic objects
(`corpusDocument`, `translationRecord`) to `additionalProperties: false` once the
A4 string→object migration is done, so the schema starts earning its keep.

**C3 — `ingest_cbeta.py` is misnamed vs. its behavior (P4)**
Despite the name, the docstring says it does **not** fetch CBETA, generate
pinyin, or map canonical IDs — it's a local sentence segmenter. Either rename it
to `segment_classical.py` (and keep a shim) or extend it to actually ingest CBETA
TEI in Phase 2. The current name sets an expectation the file doesn't meet.

**C4 — No `pyflakes`/lint in CI (P4)**
There's no Python static analysis in the quality workflow (pyflakes isn't even
installed in the sandbox). `py_compile` catches syntax but not unused imports /
undefined names. Adding `ruff` or `pyflakes` to CI is a 5-minute, high-signal
addition.

**C5 — Bundle/ repo carries a full byte-identical `docs/` mirror (informational)**
`app_data.js` (~799 KB) + `app.js` + `app.css` + all of `data/` exist twice
(root and `docs/`), enforced by CI as a deployment mechanism for GitHub Pages.
This is a deliberate, documented choice and the build script keeps them in sync,
so it's not a defect — but it does double clone size and diff noise. If this ever
becomes a concern, GitHub Pages can serve from the repo root directly (Settings →
Pages → `/root`), eliminating the mirror. Flagging only as a known tradeoff, not
recommending a change today.

---

## 3. Items explicitly checked and cleared

- **Escaping:** every one of the 19 `innerHTML` assignment sites routes dynamic
  data through `escHtml()`; the only raw interpolations are static template
  literals or already-escaped sub-functions. The poison-fixture smoke test (4y)
  guards this. No inline `on*` handlers (CSP-clean).
- **Data integrity:** all 45 JSON files parse; validator enforces 874 slots,
  138 verified, 21 matrix registers, 64/64 case locators, 34 masters, 12 school
  groups, 31 glossary terms, 23 gongan entries across 7 theme groups.
- **Doc/metric drift:** the 25-rule doc-truthfulness gate covers README,
  HANDOFF, ROADMAP, AUDIT §1, and index.html; negative-tested previously.
- **Provenance/rights:** verified quotations require `source`; 135/140 recorded
  with 5 explicitly pending and disclosed; status badges (✅/⚠️/🤖) consistent
  between Reader and Matrix.
- **Generated artifacts:** bundle deterministic; root ↔ docs byte-identical;
  CI fails on uncommitted drift.
- **Lineage graph:** edges resolve through the verification registry; pending
  traditional links are visually distinct (dashed) and source-status aware.
- **Search:** debounced (200 ms), cached unit index, capped result rendering with
  truthful total counts, snippet escaping verified.
- **Responsive/mobile:** sidebar collapses to `<select>` below 960 px; bottom
  action bar on touch; print stylesheet; `prefers-reduced-motion` honored.
- **Hash routing / deep links:** `#/view/corpus` works; back/forward safe.
- **Storage hardening:** all `localStorage` reads wrapped in try/catch with
  type/numeric bounds; malformed prefs can't break rendering.
- **No secrets, no `.pyc` tracked, no `node_modules`; `.gitignore` sensible.**
- **License:** MIT (code) / CC-BY-SA (content) dual license present and matches
  the README badge.

---

## 4. Recommended priority order if you want me to act

1. **B2** — heading semantics (biggest a11y win, low visual risk)
2. **A2** — move graph colors into `school_vocabulary.json` (removes a real drift
   class and makes the docs true)
3. **B1** — dark-theme FOUC via early `theme-init.js`
4. **A1 + A3 + B6** — doc/copy consistency sweep (broken links, matrix subtitle,
   hero chip) — small and all could be gated
5. **B3** — `aria-hidden` decorative emoji
6. **C4** — add `ruff`/`pyflakes` to the Quality workflow
7. **B5** — `theme-color`, OG tags, `robots.txt`/`sitemap.xml`, canonical URL
8. **A4** — migrate bare-string translations to explicit status objects (large,
   mechanical, scriptable; pair with a validator-assisted codemod)
9. **C1/C2/C3** — structural/lint/naming improvements (no urgency)

The standing owner action from prior audits still stands: **require the Quality
check in `main` branch protection** (A1-ops, ~2 minutes, owner-only).

---

## 5. Standing items carried forward (unchanged)

- Editorial: resolve the **5 pending verified-source references**; migrate the
  **33 document-level locators** to unit/page-line anchors via
  `data/editorial/traceability_queue.json`; human rights sign-off per
  `rights_manifest.json`.
- Content Phase 2: continue CBETA-collated completion (Biyanlu 11–100, Linji are
  the natural next pilots).
- Formal screen-reader/assistive-tech pass; real mobile performance measurement.
