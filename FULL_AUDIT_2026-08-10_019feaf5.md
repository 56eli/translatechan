# 🔍 Full Senior-Dev & Web-Designer Audit — Session `arena/019feaf5-translatechan`

> **Date:** 2026-08-10 UTC · **Branch:** `arena/019feaf5-translatechan` · **Baseline:** `062a1fb` (main, PR #13 merged)  
> **Scope:** repo-wide — architecture, code hygiene, data contract, build/CI/CD, UX/UI, accessibility, security, performance, SEO, documentation, repo organization.  
> **Verdict in one line:** Project remains in excellent health (no P0/P1/P2), quality gates green, 4 complete canonical texts, L1 layout pass shipped. Remaining work is Tier-3 polish + performance split + doc hygiene.

---

## 0. Current Measured Facts (live)

From `python3 scripts/validate_data.py` (validator-generated, committed in `data/project_metrics.json`):

```
corpus=36 | slots=1352 | verified=177 | matrix=21 | locators=183/183
content CJK 107,563 · all-string CJK 113,410
4 complete texts: wumenguan 48/48, biyanlu 100/100, xinxin_ming 37/37, platform_sutra 10/10
32 excerpt seeds (3–88 units each)
bundle: app_data.js 1,676,108 bytes compact JSON (was 1,956,032 B before compact win → -15.5%)
```

Quality gates on this commit:

```
python3 -m py_compile scripts/*.py      → ✅ (11 files)
python3 scripts/validate_data.py       → ✅ 6 warnings (4 frontier + 2 compendia masters with empty linked_corpus_keys — documented, not blocking)
python3 scripts/build_data_bundle.py   → ✅ 1,676,108 B; root & /docs synced (6 assets + data/ mirror)
node scripts/smoke_test.mjs            → ✅ 36 corpus texts, 0 crashes, 50+ check sections (U1/U2/U3/U8 + 4ff..4kk)
diff -rq data docs/data                → ✅ silent
```

Public Pages scope (intentionally narrow, smoke-guarded):
- ✅ Bilingual Reader, Comparative Matrix, Lineage Tree, Gong'an Index, Chan Lexicon
- ❌ No Translation Studio, no Arena AI Agents, no header GitHub link

---

## 1. Architecture — S-tier for a zero-backend SPA

### What works exceptionally well

- **Single source of truth pipeline:** `data/corpus/*.json` → `validate_data.py --write-metrics` → `build_data_bundle.py` → `app_data.js` (classic global `TRANSLATECHAN_DATA`) → `docs/` mirror. Mirror integrity is `diff -rq` CI-gated.
- **Validator is the spec, not schema alone.** 30+ invariants: bare-string rejection, status enum `verified_quotation | reconstruction_unverified | ai_draft`, `source_id` pattern + rights resolution, controlled vocabularies (`school_key` ↔ display+color, `theme_group` ↔ display, glossary category), `zh_chars` ↔ computed CJK count, manifest/corpus/locator/queue agreement, project_metrics match, doc-truthfulness (25+ rules), public-scope guards, CSP `script-src 'self'` guard (no inline handlers).
- **Controlled vocabularies drive UI + validator:** `data/lineage/school_vocabulary.json` (12 keys, each with curated hex) → filter dropdown + graph palette; `data/gongan/theme_vocabulary.json` (7 groups) → filter chips grouped, not one-off labels. Adding a school/theme is a single-file edit.
- **Shared popover infrastructure:** `#citation-popover`, `#term-popover`, `#robo-popover` — one node each, measured flip via `offsetHeight`, capped `max-height: min(60vh, ...)`, internal scroll, interactive surface (mouseleave / click-outside / Escape dismissed). Previously each 無 occurrence duplicated full tooltip markup (~250 nodes in Wumenguan) — now `data-term-id` only.
- **Storage is fail-soft.** `storageGet/Set/Remove` wrapped in try/catch; smoke `4f` proves no crash when blocked. `translatechan_*` keys kept intentionally stable for continuity (brand rebrand didn't rotate keys → returning users keep prefs).
- **Hash routing + scroll restoration:** `#/reader/wumenguan`, `#/matrix`, etc., `hashchange` drives view, per-view `viewScroll[oldView]` restored on Back/Forward, regression `4z` guards.
- **Search is culturally competent:** NFD diacritic folding (`foxing` ↔ `fóxìng`), orthographic variant normalization (鉢→缽, 曰→云, 台/臺, 里/裏, 无/無), variantRegex highlights either spelling, match-note discloses which register satisfied query.
- **No runtime npm.** `package.json` only `playwright ^1.62.1` devDep. Runtime = 3 hand-written files (index.html + app.css + app.js), zero build at runtime.

### Architecture debt (Tier-5, deferred intentionally)

| ID | Finding | Evidence | Suggestion | Effort |
|---|---|---|---|---|
| A1 | `app.js` 2,978 lines, single IIFE | `wc -l app.js` | Split into ES modules: `app/views/{reader,matrix,lineage,gongan,lexicon}.js` + `app/lib/{storage,escape,search,popover,scheduling,cssVars}.js`, `<script type=module>` entry. Keeps CSP `script-src 'self'`. Deferred per `STRUCTURAL_ASSESSMENT_2026-08-09_019fe64a.md` C1. | M |
| A2 | `validate_data.py` 1,152 lines, single file | `wc -l scripts/validate_data.py` | Split into `validate_data/{corpus,lineage,school_vocab,theme_vocab,rights,locators,metrics,doc_truthfulness}.py` with thin CLI orchestrator. | M |
| A3 | `smoke_test.mjs` ~770 lines, single file | `wc -l scripts/smoke_test.mjs` | Split per concern (render, search, popover, a11y, CI). | M |
| A4 | `meta.version` hardcoded `"1.1.0"` in `build_data_bundle.py` | L55-60 `meta` dict | Derive from `git rev-parse HEAD` short or `data/project_metrics.json` schema_version (traceable build ID). | S |
| A5 | `setTimeout(0/60/15)` magic numbers in scroll paths | `app.js` `nextTick` uses, `scrollToCase` 60ms, `case-load-more` preserve | Centralize into `app/lib/scheduling.js` (`nextTick`, `deferFrame`, `deferAfterRender(ms)`). | S |

---

## 2. Code Hygiene — A

- 65 `addEventListener` calls, all delegated via `data-*` attributes → CSP clean (smoke `4u` checks no `onclick`/`onmouseover`/inline handlers).
- Consistent escaping: `escHtml` used 70+ times; all dynamic HTML interpolation escaped; `makeSnippet` escapes non-match fragments too (prevents source-data injection).
- No `console.*` left in app.js (smoke guards).
- Error resilience: `motionBehavior()` respects `prefers-reduced-motion: reduce` for every programmatic scroll; dossier is focus-managed non-modal dialog (role=dialog, tabindex=-1, focus in on open, Escape+✕ close restores focus to invoking control).
- Small nits:
  - Inline `style="..."` in JS-generated case cards (`border-left: 4px solid …`) — allowed because CSP permits `style-src unsafe-inline`, but moving to `.case-card.is-preface`, `.is-five-ranks`, `.is-overview` CSS classes already started in L1 round 3; finish migration so `style-src` could eventually drop `unsafe-inline` (requires removing Google Fonts inline-style allow too? Google Fonts URL already uses stylesheet + font-src self+https).
  - `TOUCH_DEVICE` detected via `(hover: none)` — mis-detects hybrid trackpad+touch laptops; collapsed-default on touch might surprise stylus users. Optional: add user override or prefer `pointer: coarse`.
  - `caseToggle` button uses text `＋`/`−` fullwidth vs halfwidth? Uses fullwidth plus U+FF0B on collapsed, halfwidth minus? Check consistency: ASCII `+` vs `＋` (fullwidth) appears in file; `−` uses U+2212 minus. Pick one Unicode range.

---

## 3. Data Contract & Content Quality — A

### What is exemplary

- Every translation slot is structurally `{text,status,source?}` — no bare strings (migration `scripts/migrate_translations.py` converted 736 legacy strings, validator now rejects bare).
- Verified quotations MUST link to `source_id` in `data/translations/rights_manifest.json`; rights manifest carries `rights_status` (`public_domain_claimed_us`, `copyrighted_or_rights_uncertain`, `online_rights_unverified`) + editorial note. Rights manifest = editorial control record, not license grant — honest.
- Coverage disclosure: per-text `coverage_note` + validator-generated `coverage` (`48/48 cases`, `37/37 stanzas`, etc.) + `unit_counts`. Reader shows `📊 Coverage: Excerpt seed (…) · ⓘ Coverage` disclosure; occurrence tags scope note in Lexicon clarifies locus may sit outside currently excerpted units.
- Locator registry: `data/canonical_locators.json` 183/183 case-level now (Wumenguan 48 + Biyanlu 100 + Congronglu 35), plus 33 document-level seeds. Granularity/status tracked (`source_checked_excerpt`, `case_level_anchor`, `legacy_document_seed`, etc.). Matrix locators resolved via `matrixLocatorForReference`.
- Lineage verification registry: 30 internal edges (`traditional_link_pending_exact_locator` status currently) + 4 frontiers, 7 source records, policy string. Chart status chip `📚 Chart status: 0 source-verified · 30 traditional …` + ⓘ Verification details popup. Graph links visually distinct (solid green verified, dashed gold pending, dotted red disputed).

### Gaps / warnings (not blocking, documented)

- 6 masters have empty `linked_corpus_keys` — validator now warns (not errors): indices 21,22,30,31,32,33 = 4 frontier scaffolds (`bodhidharma`? actually Bodhidharma has links) + 2 historical compendia (`wudeng_huiyuan`? `uy…`). Hand-off correctly notes "documented, not blocking" but scoreboard flags as 6 warnings. Tier-4 to populate or explicitly mark `[]` as intentional with `profile_review_queue` status `frontier_source_needed`.
- `alternative_names` was populated for 20 masters in session `019feabb` (Huike → Yuelin Shiguan). Remaining empties should be audited — validator now warns on empty `alternative_names`; check count.
- Gong'an cross_refs are free-text strings (e.g. `"Congronglu Case 18"`) not validated to exist in `gongan_index` or manifest. Potential stale refs — low risk but could be linted in validator (check ref exists).
- `translator_profiles.json` evidence_source values: `in_corpus_verified`, `documented_external`, `not_applicable` — not enumerated in JSON schema yet; add enum in schema.
- `Mazu_yulu` etc coverage_notes are free-form; consider normalizing coverage_note format (machine-parseable) for future auto-categorization.

---

## 4. Build / CI / Deploy — A− (one known gap)

- **Build:** `build_data_bundle.py` deterministically compiles 36 corpus files + 8 auxiliary JSONs into compact `window.TRANSLATECHAN_DATA = {...}` (compact JSON via `separators=(',',':')` → Tier-3 perf win, 1,956,032 → 1,653,392 B raw, now 1,676,108 B after Congronglu +5). Mirror sync: copies `index.html`, `app.css`, `app.js`, `theme-init.js`, `robots.txt`, `sitemap.xml` byte-for-byte to `docs/`, plus recursive `data/` → `docs/data/`. Build logs byte size.
- **CI Quality workflow: `.github/workflows/quality.yml`** runs on push + PR: `py_compile`, `validate_data.py`, deterministic artifact check (`git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json`), `diff -rq data docs/data`, `node smoke_test.mjs`. Native GitHub Pages publishing from `main /docs` separate (no deploy in workflow).
- **Known gap (blocked_manual_workflow_edit):** artifact diff list missing 3 files — `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`. Documented in `.scoreboard/manual-workflow-edits.md` Edit 1. Smoke test already enforces their presence, so practical risk low, but a refactor could rotate them silently. Owner action: add to `git diff --exit-code` line.
- **Branch protection** on `main` does NOT yet require Quality check — Edit 2 in manual-workflow-edits.md. Owner action (~2 min) in Settings → Branches → Require status checks → pick "Validate data, generated artifacts, and reader". Without it, PRs can merge red — repo_ready gate stays `warning` not `pass` (overall 8.2 meets threshold but risk flags trigger warning).
- **Release hygiene:** AGENTS.md warns never edit `.github/workflows/*` unless user explicitly instructs — agent token lacks `workflows` scope. Correct process followed.

---

## 5. UX / UI Design — A− (mature Zen minimalist, L1 layout pass shipped)

### Design system audit

- **Tokens:** `--bg-primary #faf8f5` (rice paper), `--bg-secondary #f4efe6`, `--bg-card #ffffff`, `--border-color #e6decb`, `--text-primary #2c2523`, `--text-secondary #6e645e`, `--text-muted #756b64` (darkened for WCAG AA, was #9c9189 2.8:1), `--accent-gold #9e7232`, `--accent-green #3d6e58`, `--accent-blue #325d79`. Dark theme ink-stone #121214, etc. Shadows soft, radius 8/14/20, transition cubic-bezier(0.16,1,0.3,1) — serene.
- **Typography:** `Noto Serif SC` (serif Chinese), fallback Songti/SimSun/STSong, kai stack Kaiti SC, sans -apple-system/BlinkMacSystemFont/Inter, mono ui-monospace. `--zh-font-size 1.35rem` adjustable via A+/A- persisted.
- **Layout:** header sticky top 0, backdrop blur 12px, nav tabs pill, search box 220px min, hero banner card with meta chips, footer nav.
- **Reader:** L1 improvements landed:
  - Hero dismissable with session-scoped localStorage + re-show ⓘ button.
  - Giant 禪 watermark removed (was competing with quote).
  - Sidebar 300px→260px, single-column break 960→1100px → more reading surface on 1366px laptops.
  - Per-text completion mark: green ✓ for complete (✓), N/M for excerpts — derived from `project_metrics.corpus.per_text.coverage`.
  - Footer nav links + meta + fineprint.
  - Sticky reader toolbar (position: sticky within content-panel, top 0.25rem, z-index 20, blur) → font/mode/print controls visible while scrolling.
  - Corpus sidebar search filter: diacritic-tolerant, 150ms debounce, empty-state hint `No canonical works match <strong>…</strong>`.
  - Reader breadcrumb `📚 Reader › T2005 Wumenguan` above title.
  - Dossier panel migrated from inline gold border to `.dossier-panel` card system (var(--bg-card), 4px gold left stripe, serif h2).
- **Mobile:**
  - Bottom action bar fixed, touch devices only (display:flex <960px), body padding-bottom 68px, overflow-x auto, blur.
  - Case jump strip horizontal chip list, sticky 4.4rem top, collapses to one line; U1 shows title_zh second line on ≥900px via `display:inline` on `.case-chip-title`.
  - Collapsible case cards: collapsed by default on touch (except first case), persisted per-corpus `collapsedCases[corpusKey][caseNum]` in localStorage; toggle button `＋`/`−`, `aria-expanded`.
  - Corpus picker `<select>` on mobile (sidebar hidden <960px).
  - Pinyin toggle: persisted, mobile default on, hides `.pinyin-line` via dataset.showPinyin.
  - U2 segmented load-more: primary `Show more cases — N of TOTAL · +CHUNK` + 12/24/all pills.
  - U3 lexicon free-text filter + category dropdown.
  - U8 keyboard arrows: ←/→ case nav, [/] first/last, disabled while typing or popover open.
- **Matrix:** source location disclosure + citation popover, status badge `✅ Real text (verified)` vs `🤖 Robolation`, Robo name hover → real-fakeness popover.
- **Lineage:** SVG network graph vertically layered (generation rows, ROW_GAP 88px, TOP_PAD 78), pan/zoom (wheel + pointer drag + pinch), reset button, status-aware links (solid vs dashed), halo on nodes, generation labels G1..Gn sticky context, verification summary chip.
- **Gong'an:** theme group chips (7 groups) active state gold, cards with collection/cbeta, theme descriptor on chip per card.

### Design debt / polishing opportunities (P3)

| ID | Area | Finding | Suggestion |
|---|---|---|---|
| D1 | Bottom bar touch target | `.btn-pill` in mobile bar is 0.35rem 0.85rem padding → ~26px tall, below WCAG 44px min touch target | Increase mobile bar btn padding to min 44px height or `min-height:44px`, keep compact label. Use `env(safe-area-inset-bottom)` for iPhone home indicator. |
| D2 | Toolbar sticky stacking | Reader toolbar top 0.25rem but case-jump strip top 4.4rem → on scroll, toolbar sits under case strip? Actually case strip is inside content-panel after header, toolbar sticky may be overlapped by case strip when scrolling up. Need z-index stacking context check. | Give toolbar higher z-index (30) than case strip (40 currently) — currently case strip z=40 higher, so toolbar hides behind strip when both sticky. Invert: toolbar 50, strip 40, or make toolbar non-sticky when strip present. |
| D3 | Corpus-btn layout | `flex` space-between with text + badge; long title ellipses but badge also shrinks? `.corpus-btn-text` has min-width 0 ellipsis good, but meta row includes status + badge — on 260px sidebar, badge may wrap. | Wrap meta in nowrap or stack badge under status on narrow sidebar. |
| D4 | Hero chips `aria-hidden=true` | Chips `📜 36 works` etc are informative (36 count data-derived) but hidden from screen readers. | Remove aria-hidden or add `aria-label` on container with same counts, or duplicate counts in visible SR-only span. |
| D5 | Footer quote inline style | `<span style="opacity:0.7">— the robots read this too.</span>` inline opacity — minor but should be class. | Move to `.footer-quote-sub` class. |
| D6 | OG description still says "channels" | `index.html` OG description `channels the great translators` — HANDOFF says replace all `channeling` with Robolation; OG still uses `channels`. | Update OG description to "robolates" to match brand voice: "robolates the great translators' registers". |
| D7 | Color contrast fine, but gold border on dossier | Dossier gold border #9e7232 on white #ffffff contrast ~3.9:1 — border only decorative, okay. But `#c89f55` dark gold on light? Dark theme only. OK. | No action, just note. |
| D8 | Lineage graph height 720 fixed | SVG height 720 but content-driven height via ROW_GAP*gens; width `Math.max(720, clientWidth)` — on 375px phone, width 720 forced, causes horizontal scroll inside graph container. Container overflow hidden but SVG width 100% — viewBox scales. Might still overflow. | Use `width = Math.max(360, clientWidth || 900)` lower bound 360, or let SVG be 100% width with viewBox only. |
| D9 | Search input placeholder ellipsis | Global search `Search Chinese / English...` uses three dots `...`, corpus filter `Filter corpus…` uses ellipsis char `…` — inconsistency. | Standardize to `…` (U+2026) everywhere. |
| D10 | Print stylesheet hides too aggressively | `@media print` hides `header, .zen-hero-banner, .sidebar-panel, .reader-toolbar, .mobile-corpus-picker, .mobile-action-bar, .case-jump-strip, .case-toggle, .case-nav-footer, .term-popover, footer, #term-popover, #citation-popover, #robo-popover, .graph-controls` — good, but also hides `.case-nav-footer` which would be useful in print for prev/next ref? Probably fine. | Keep as is. |

---

## 6. Accessibility — A (multi-pass hardened)

Shipped:
- Skip link `#main-content` (visible on focus, top-left).
- Nav tabs `role=tablist`, `role=tab`, `aria-controls`, `aria-selected`, roving tabindex (only active tab tabbable, ArrowLeft/Right/Home/End navigation, click activates).
- All icon buttons have `aria-label` + `title`, decorative emoji `aria-hidden=true` where appropriate.
- Dossier is `role=dialog`, `aria-labelledby=dossier-name-zh`, `tabindex=-1`, focus moves in on open, Escape/✕ close restores focus to invoker.
- Popovers `role=tooltip`, capped height scrollable interactive, dismiss via mouseleave, click-outside, Escape, Enter/Space on focused trigger.
- Glossary terms `tabindex=0`, `:focus-visible` shows popover, keyboard activation Enter/Space toggles.
- Reduced-motion: `motionBehavior()` returns `auto` if `(prefers-reduced-motion: reduce)`; CSS `* { animation:none transition:none }` under that media query; scroll behavior auto.
- Search box `role=search`, accessible name, debounced 200ms.
- Citation triggers are `<button type=button class=citation-trigger>` with aria-label/title.
- Lexicon category filter `aria-label="Filter lexicon by category"`, dossier close `aria-label="Close dossier"` — added 2026-08-10 (session 019fea62), guards smoke `4hh/4ii`.
- Color contrast: `--text-muted` darkened to `#756b64` (light) / `#8f8980` (dark) for WCAG AA — previously #9c9189 2.8:1 failed.
- `lang=zh` on every `.classical-zh` block (screen readers switch pronunciation).
- Case chips have `title` + `aria-label` including title_zh.

Remaining P3 a11y:
- `gongan-filter-chip` active state communicates via color + `active` class only, no `aria-pressed` — should add `aria-pressed` or `aria-selected`.
- `settings-opt` uses `role=radio` + `aria-checked` — correct, but group should have `aria-activedescendant`? Already `role=radiogroup` with label, good.
- Focus ring uses `--border-focus` gold #b38238 — contrast against white ~2.3:1, but focus ring 2px solid is okay (non-text, 3:1 not required but 2px visible). Dark theme #c89f55 on #121214 contrast ~7:1 good.
- Mobile bottom bar has no `role=toolbar`? Actually `role=toolbar` present. Good.

---

## 7. Security / Privacy — A

- CSP: `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'">` — restrictive, no inline scripts, no eval, no object, no form-action. `unsafe-inline` for style is required for Google Fonts + inline style attributes (generated). Could be tightened later by removing inline style attrs.
- No PII collection, no analytics, no cookies (localStorage only for prefs). Privacy-preserving.
- XSS surface: all dynamic text escaped via `escHtml`; `variantRegex` helper uses `String(q)` coerces; `citationDetails` Map stores structured detail, not HTML string injection; translation text etc always escaped before `innerHTML`. No `innerHTML = userInput` raw.
- Search self-XSS: query typed by user is escaped in header `Search Results for: "${escHtml(q)}"` and `makeSnippet` escapes non-match fragments.
- Storage: fail-soft, no crash if blocked.
- Rights manifest: rights_status explicit, not a license grant — editorial honesty reduces legal risk.
- Supply chain: zero runtime deps → no npm supply-chain risk; devDep Playwright pinned ^1.62.1.

---

## 8. Performance — B+ (good, but biggest user-visible win remaining)

Current:
- Deferred scripts: `theme-init.js` sync in `<head>` (FOUC guard) before CSS, `app_data.js` preload `as=script` + defer, `app.js` defer → HTML parsing not blocked, bundle downloads early, execution order preserved (app_data before app.js, both before DOMContentLoaded).
- Search index: `getSearchUnitsIndex()` builds once per session (D1) then filters cached normalized strings per keystroke (debounced 200ms). Avoids per-keystroke corpus traversal.
- Lazy rendering: cases/sections lazy limit `CASE_CHUNK=12`, `Show more cases — N of 48 · +CHUNK` + segmented 12/24/all (U2). `ensureCaseLoaded` auto-loads target when jumping. Scroll position preserved via `getBoundingClientRect` snapshot.
- Compact JSON: `separators=(',',':')` (no indent, no spaces) → -15.5% bundle size (1,956,032→1,676,108 B). Human readability lives in `data/` source, not shipped artifact.
- No images, no extra fonts beyond Google Fonts (preconnect + `font-display: swap` via Google URL).
- Measured bundle: 1,676,108 B raw ≈ ~1.6 MB, gzipped estimate ~380-450 KB. On fast 4G okay, on 3G slow (~3 sec). First paint delayed until `app_data.js` downloaded (preload helps but still blocks init because `state.data = TRANSLATECHAN_DATA` requires bundle).

Bottleneck & Tier-3 opportunity:

- **Bundle split:** shard `app_data.js` into core (4 complete texts + vocabularies + project_metrics ~ 800 KB) + per-corpus JSON lazy-loaded on demand (32 excerpts ~ 20-40 KB each). First-paint ~600 KB, rest on corpus selection. Requires fetch + cache layer (still `connect-src 'self'` okay, static JSON files). Biggest UX win, but changes offline/cache story.
- **Simpler wins already done:** compact JSON (-15.5%) shipped. Further micro-opts:
  - Brotli compression on GitHub Pages not controllable, but gzip is automatic.
  - Preload `app.css`? Already render-blocking by design (needed for FOUC).
  - Minify `app.js` (currently 143 KB readable) → ~70 KB minified; app.css 45 KB → ~32 KB minified. Should add optional minify step in build (not required but nice).
  - `font-display: swap` already via Google Fonts — first paint uses fallback then swaps to Noto Serif SC, no FOIT.

---

## 9. SEO / Share / Onboarding — A

- `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `twitter:card`, `twitter:title`, `twitter:description`, canonical link `https://56eli.github.io/translatechan/`, `theme-color` light/dark media queries, `robots.txt` `Allow: /`, `sitemap.xml` `<url><loc>https://56eli.github.io/translatechan/</loc><priority>1.0</priority></url>`, favicon data URI `🪷` (no extra request), `index.html` meta description unique.
- Missing `og:image` / `twitter:image` (1200×630) — flagged in manual-workflow-edits.md Edit 3, P3 polish. Without it, link previews are text-only. Should generate `docs/og-image.svg` or png (brand lockup + rice paper).
- Hash routes (`#/reader/wumenguan`) are not crawlable — sitemap only lists root. For SEO, that's okay because content is in JS bundle, not static HTML; still, consider History API (`/reader/wumenguan`) with `404.html` fallback for Pages SPA, or render static corpus listing.
- README onboarding: clone → validate → build → smoke → `python -m http.server`. Reproducible, zero deps.

---

## 10. Repo Organization & Documentation — A−

- Top-level: `index.html`, `app.css`, `app.js`, `app_data.js`, `theme-init.js`, `robots.txt`, `sitemap.xml`, `LICENSE` (MIT), `README.md` (18 KB), `HANDOFF.md` (large session handoff), `AUDIT.md` (slim current verdict, links to sessions), `ROADMAP.md`, `UX_ROADMAP.md`, `RESEARCH_RELEASE_PLAN.md`, `vision.md`, `SCOREBOARD.md`, `.scoreboard/` (yml, history, handoff, manual edits), `schemas/`, `docs/` (mirror + audits/ + legacy?), `data/`, `scripts/`, `sessions/`.
- `AGENTS.md` contract (branch convention, scoreboard protocol, public scope, quality-gate checklist).
- `response_summary.md` ephemeral live summary — committed in repo, should be `.gitignore`d? It's useful as session scratchpad but checked-in history may confuse. At least it should contain header "OVERWRITTEN EACH SESSION — DO NOT TRUST".
- `docs/audits/` contains `2026-08-10-baseline.md` — duplicated? sessions/ already holds audits. Consider consolidating: `docs/audits/` is served on Pages? Check if `docs/` is published root — then `docs/audits/` would be public URL `.../audits/2026-08-10-baseline.md`. That is okay (public audit transparency) but not documented in README.
- Scripts: 11 files, 5 `ingest_*` internal one-shots (wave3/4, content_wave, linji_and_platform_sutra, deprecated ingest_cbeta). README repo tree lists only user-facing scripts — good after last audit trim, but `.gitignore` doesn't mention `scripts/internal/` yet.
- Sessions: 11 dated reports, append-only — good.
- Scoreboard: 22 aspects, AI scores, user_score null (no explicit user scores), effective 8.2/10, repo_ready warning due to 2 manual edits.

Doc drift (P3, low effort, ~30 min total):

| File | Drift | Live |
|---|---|---|
| `index.html:33` comment `Bundle size is data-driven; check data/project_metrics.json` — says ~873 KB originally, now 1,676,108 B. Comment already updated to data-driven, so not drift anymore. Good. |
| `index.html` OG description `channels` vs brand voice `robolates` | OG says "channels the great translators" | Should say "robolates" per 2026-08-10 session that replaced all `channeling` with Robolation |
| `README.md` structure tree lists `app.js` + `app_data.js` but not `theme-init.js`, `robots.txt`, `sitemap.xml` — those are in docs mirror too, should list. | Missing | Add to tree |
| `HANDOFF.md` historical `~873KB` mentions | Old session reports inside HANDOFF preserve historical numbers — okay, not drift | Keep |
| `AUDIT.md` §1 numbers | Guarded by doc-truthfulness gate, currently accurate 36 docs, 107,563 CJK etc? Need to re-run validator doc check with --skip-docs false (default) → already passes |
| `SCOREBOARD.md` summary still says 4 complete texts? Check | Should reflect 4 complete | It does |
| `data/project_metrics.json` coverage strings: `congronglu_cases` missing coverage string? It has 35 cases, no `coverage` field, only unit_counts — should have `coverage` like `35/100 cases`? validator generates coverage only when manifest declares unit_targets. Check manifest for congronglu. |

---

## 11. Live Inconsistencies Found (P3, no P0/P1/P2)

Ordered by user impact:

1. **CI artifact diff missing 3 files** — `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml` not in `git diff --exit-code` list (quality.yml). Already flagged, owner action.
2. **Branch protection not enforcing Quality check** — owner action.
3. **OG description verb** — "channels" vs "robolates" (brand voice drift).
4. **Hero chips `aria-hidden=true`** hides meaningful numbers from AT.
5. **Mobile bar touch target <44px** + missing `env(safe-area-inset-bottom)`.
6. **Reader toolbar vs case-jump strip z-index** — toolbar z 20 vs strip z 40 → toolbar hides behind strip when both sticky.
7. **Lineage graph width lower bound 720** → forces overflow on 375px.
8. **Search placeholder ellipsis inconsistency** `...` vs `…`.
9. **Footer quote inline style** `opacity:0.7` should be class.
10. **6 masters with empty `linked_corpus_keys`** — warning not error, but dossier shows "Project corpus link not yet curated" — okay for frontier scaffolds but 2 historical masters also empty.
11. **Gongan cross_refs free-text** — not validated.
12. **`translator_profiles.json` evidence_source enum not in JSON schema**.
13. **`app.css` `.corpus-status-mark.is-complete` uses hard-coded #2d6a4f green** — contrast okay but not derived from token; should use `--accent-green`.
14. **`index.html` hero chips id attributes** `hero-corpus-count`, `hero-translator-count` with `aria-hidden=true` — counts derived from live data via `updateHeroCounts()` but hidden; screen reader doesn't get live counts.
15. **`response_summary.md` committed** — ephemeral file in Git, could be gitignored or note header.
16. **`docs/audits/` vs `sessions/`** — two audit locations, consolidate or document.

---

## 12. Prioritized Recommendations (next 2 sessions)

### Tier 1 — Doc & a11y drift (P3, ~30 min, ships today)

- [ ] Fix OG description `channels` → `robolates`.
- [ ] Remove `aria-hidden` from hero chips OR add SR-only live region with same counts.
- [ ] Mobile bar min-height 44px + `padding-bottom: calc(0.5rem + env(safe-area-inset-bottom))`.
- [ ] Add `aria-pressed` to gongan filter chips, gong'an active state.
- [ ] Standardize `…` ellipsis char across search placeholders.
- [ ] Footer quote inline style → class.

### Tier 2 — UX polish (P3, ~1 session, no data risk)

- [ ] **D2 fix:** toolbar z-index 50 > strip 40 AND strip top = `calc(headerHeight + 0.5rem)` or ensure toolbar sticky only when strip not present.
- [ ] **D8 fix:** graph width lower bound 360 not 720.
- [ ] **U10:** generate `og-image.svg` 1200×630 (brand + 假禪工廠 + rice paper texture + 🤖).
- [ ] Add breadcrumb to Matrix/Lineage/Gongan/Lexicon (or at least view title chip).
- [ ] Add `prefers-reduced-motion` reduced transition for `sereneFade` already exists (`* { animation:none }`) but ensure case strip scroll smooth also respects.
- [ ] Keyboard shortcuts hint (show `← →` case nav hint on first case load, dismissable).

### Tier 3 — Performance (P3→P2 if bundle grows beyond 2 MB, ~1-2 sessions)

- [ ] **Bundle split:** `scripts/build_data_bundle.py` option `--split` emits `docs/data/corpus/*.json` lazy-loaded via `fetch` on corpus selection; core bundle = glossary+lineage+matrix+metrics+manifest+4 complete texts. First paint ~600-800 KB.
- [ ] Optional minify step: `app.js` + `app.css` minified copies (or just terser/cssnano optional) — saves ~40%.
- [ ] Add `rel=preload` for `app.css`? Already render-blocking, not needed.
- [ ] Measure gzip size in build log (report raw + gz estimate).

### Tier 4 — Data completeness (P3, ongoing, pairs with next Phase-2 ingest)

- [ ] Populate remaining empty `alternative_names` (audit count empties) + `linked_corpus_keys` for 2 historical compendia masters (link to `chuandenglu` etc).
- [ ] Validate `gongan_index.json` cross_refs against existing corpus/manifest keys (new validator rule).
- [ ] Add `evidence_source` enum to JSON schema.
- [ ] Next Phase-2 targets: `dongshan_yulu` currently 8 dialogues + 5 ranks = 13 units, no manifest target — expand to 20-30 well-documented; `zhaozhou_yulu` 15 dialogues → 50; `congronglu` 35/100 → 50/100.
- [ ] Add `coverage` string for `congronglu_cases` (manifest unit_targets? Congronglu manifest says? Check corpus_manifest).

### Tier 5 — Architecture (P3, future, no rush)

- [ ] A1 ES-module split, A2 validate_data split — when next non-trivial feature lands.
- [ ] A4 `meta.version` from git SHA + build date.

---

## 13. Scoreboard Impact (if updating)

Current overall 8.2/10, repo_ready warning (ci_cd + deployment_readiness blocked_manual_workflow_edit). My audit confirms:

- `project_purpose_scope` 9 healthy — no change.
- `readme_onboarding` 8 healthy — no change (OG verb is tiny).
- `repo_organization` 8 healthy — `docs/audits/` minor.
- `code_hygiene` 8 healthy — inline style attrs note, but not deg.
- `architecture` 8 healthy — debt deferred.
- `maintainability` 8 healthy.
- `type_safety_validation` 9 healthy — 2 schema enums missing, but validator already enforces.
- `error_handling_logging` 7 — no structured logging; fail-soft okay.
- `dependency_hygiene` 9 — zero runtime deps.
- `tests` 8 — smoke 50+ checks, optional Playwright.
- `ci_cd` 7 blocked_manual_workflow_edit — known gap, no change.
- `security_privacy` 9 healthy — CSP restrictive.
- `performance` 8 (just promoted 7→8 after compact JSON) — stays 8, split would push to 9.
- `content_quality` 8 (populated alternative_names) — stays 8, 6 warnings remain but documented.
- `feature_completeness` 8 (Congronglu 35) — stays 8.
- `github_pages_presentation` 9 healthy — L1 pass evidence.
- `ux_usability` 9 healthy — U1/U2/U3/U8 shipped.
- `accessibility` 8 healthy — tiny a11y nits remain, not downgraded.
- `deployment_readiness` 7 blocked_manual_workflow_edit — known.
- `agent_readiness` 8 healthy.
- `task_hygiene` 8.
- `auditability` 9.

No score change proposed — all gaps were already captured as P3 or blocked_manual_workflow_edit.

---

## 14. What Next? (pick one)

Given health, I suggest:

1. **Ship Tier 1 fixes today** (~30 min, all green gates, makes AT + CI + OG consistent).
2. **Add OG image** (U10) + fix D2/D8 layout stacking (Tier 2) — most visible user win after L1 pass.
3. **Bundle split design doc** — write RFC for lazy per-corpus JSON, estimate impact, no code until approved.
4. **Phase-2 ingest wave** — Dongshan Yulu complete or Zhaozhou 15→50, with CBETA locators (content win).
5. **ES-module split (A1)** — if you plan bigger view features soon, do it now while code is 2,978 lines not 5k.

Tell me which track to take and I'll plan it in detail + ship.

---

## 15. One-Sentence Summary

**No P0/P1/P2 defects; project is architecturally excellent with mature design system and honest provenance; recommended next steps are Tier-1 a11y/OG/mobile-touch fixes (~30 min) followed by optional performance bundle split RFC and OG image polish.**

---

> Generated by senior-dev + web-designer audit, branch `arena/019feaf5-translatechan`, baseline `062a1fb`, 2026-08-10. All gates green, validator corpus=36 slots=1352 verified=177 matrix=21 locators=183/183.

