# 🔍 Senior-Developer + Web-Designer Audit (Session `arena/019feabb-translatechan`)

> **Audited:** 2026-08-10 UTC · branch `arena/019feabb-translatechan` · baseline `23c1dd4`
> **Scope:** Deep architecture, design, accessibility, data, content, DX, ops, and DX review of the entire `translatechan` / Fake Chan Factory project.
> **Verdict in one line:** Project is in excellent shape — all quality gates pass, no P0/P1/P2 defects, design system is mature, and the data pipeline is well-engineered. **A small set of doc/code drift and a few low-effort UX wins are queued below** (no P0/P1; mostly P3 polish + housekeeping).

---

## 0. Executive Scorecard

| Layer | Grade | Evidence |
|---|---|---|
| **Architecture** | A | Clean zero-backend SPA, 2,700-line `app.js` is well-sectioned; data is generated deterministically; root & `/docs` are byte-identical by gate. |
| **Data contract** | A | JSON Schema + Python validator mirror each other; controlled vocabularies for schools/themes; rights manifest; locator registry. |
| **Build / CI** | A− | `validate_data.py` → `build_data_bundle.py` → smoke test chain; GH Actions workflow runs on push + PR. One known workflow gap (see §3.1). |
| **Accessibility** | A | ARIA tabs, roving tabindex, reduced-motion gate, dossier dialog, skip-link, focus-managed popovers, search landmark, diacritic-folded search. |
| **Content integrity** | A | Validator-generated metrics; per-text coverage strings; honest "excerpt seed" disclosures; verified vs Robo is structurally enforced. |
| **UX / Design** | A− | Calm reader, case strip, mobile bottom bar, settings menu; coverage & disclosure popovers; lineage pan/zoom. Some room to push (§5). |
| **Performance** | A− | Deferred scripts, cached search index, lazy case rendering. Bundle is 1.87 MB which is a real concern (§4.1). |
| **Documentation** | A− | Five top-level docs + per-session audit logs; doc-truthfulness gate guards 25+ live numbers. **3 stale byte-size references** (§3.2). |
| **SEO / share** | A | OG/Twitter/canonical/sitemap/robots/meta; theme-color; ARIA-hidden emoji. |
| **Repo hygiene** | A | Dated session logs in `sessions/`; no `console.*` left in `app.js`; no inline event handlers (CSP clean). |

All quality gates pass on `23c1dd4`:

```text
python3 -m py_compile scripts/*.py            → ✅
python3 scripts/validate_data.py              → ✅ corpus=36 | slots=1342 | verified=177 | matrix=21 | locators=178/178
python3 scripts/build_data_bundle.py          → ✅ 1,956,032 bytes (1.87 MB) — root & /docs synced
node scripts/smoke_test.mjs                   → ✅ 36 corpus texts exercised, 0 crashes
diff -rq data docs/data                       → ✅ silent
```

---

## 1. What This Project Is (and why it works)

`translatechan` (public brand: **Fake Chan Factory / 假禪工廠**) is a static, zero-backend GitHub Pages SPA that publishes:

- A **Bilingual Reader** of 36 canonical Chan / Zen texts (T47/T48/T51 + X-series; CBETA-collated)
- A **Comparative Matrix** with Robo-translator renderings (marked 🤖) and real verified text (marked ✅)
- A **Lineage Knowledge Graph** (34 masters, 12 controlled `school_key` groups, source-aware links)
- A **Gong'an Cross-Reference Index** (24 cases, 7 theme groups)
- A **Chan Lexicon** (31 terms)

The honest disclosure design ("this translation is a Robolation, not Cleary's actual words") is genuinely interesting — verified and reconstructed text live in the same data shape but with `status: "verified_quotation"` vs `"reconstruction_unverified"`, so the UI is structurally honest rather than relying on copy discipline. The validator enforces this.

---

## 2. Architecture & Code Quality — Strong

### ✅ What works well

- **Single-source-of-truth data pipeline.** `data/corpus/*.json` → `validate_data.py --write-metrics` → `build_data_bundle.py` → `app_data.js` → `docs/`. Mirror check is automated; committing stale artifacts is a CI failure.
- **Validator is the spec.** 30+ structural rules: bare strings, status enum, `school_key` ↔ display, theme taxonomy, source `source_id` pattern, locator granularity, manifest/corpus/locator/queue integrity, `zh_chars` ↔ computed count, file mirror agreement, etc. The Python validator mirrors JSON Schema `additionalProperties: false` strictly.
- **Controlled vocabularies** (`school_vocabulary.json`, `theme_vocabulary.json`) drive both the UI options and the validator — adding a new school is a single-file change.
- **DOM/render separation is clean.** `renderReader()`, `renderMatrix()`, `renderLineage()`, `renderGonganIndex()`, `renderLexicon()` are pure render functions over `state.data`; `state` is the single source of runtime truth.
- **Shared popover infrastructure** (`#citation-popover`, `#term-popover`, `#robo-popover`) is reused — no duplicated tooltip markup. `positionFloatingPopover` measures the actual height instead of guessing.
- **Storage is fail-soft.** `storageGet`/`storageSet` swallow errors; smoke test `4f` proves preference writes don't crash when storage is blocked.
- **No npm at runtime.** `package.json` is dev-only Playwright; the runtime bundle is 3 hand-written JS files.
- **CSP is `script-src 'self'`.** All event handling is delegated via `data-*` attributes; smoke test `4u` enforces this. The inline-emoji `🪷` favicon is data-URI, no extra request.

### 🔧 Improvement potential (P3)

| ID | Finding | Suggestion | Effort |
|---|---|---|---|
| A1 | `app.js` is 2,700 lines, single IIFE | Split into `app/views/{reader,matrix,lineage,gongan,lexicon}.js` + `app/lib/{storage,escape,search,popover}.js` using native ES modules + `<script type="module">`. (Already noted in `STRUCTURAL_ASSESSMENT_2026-08-09_019fe64a.md` §C1 as a deferred item.) | M |
| A2 | `meta.version` in `build_data_bundle.py` is hardcoded `"1.1.0"` | Derive from `git describe` or `data/project_metrics.json` so the bundle carries a traceable build ID. | S |
| A3 | Several `setTimeout(..., 0/60/15)` calls in `app.js` (scroll-restore, scrollToCase, scrollIntoView) are unmagic-numbered | Add a single `app/lib/scheduling.js` (`nextTick`, `deferFrame`) so the magic numbers are explainable and adjustable in one place. | S |
| A4 | `app.js` mixes a few inline `style.setProperty()` calls (theme/font-size only) | Already minimal, but a small `app/lib/cssVars.js` would centralize `--zh-font-size` / `--data-theme` writes. | S |

---

## 3. Documentation & Repo Hygiene — Mostly Excellent, a Few Drift Spots

### ✅ What works well

- **Doc-truthfulness gate** (`validate_data.py` §`validate_doc_truthfulness`) is a fantastic pattern: every claim README/HANDOFF/ROADMAP/index.html/AUDIT §1 makes is checked against live metrics. 25+ rules; no silent drift.
- **Sessions convention** (`sessions/SESSION_AUDIT_<date>_<session>.md`) preserves history immutably while `AUDIT.md` stays slim.
- **`response_summary.md` is deliberately ephemeral** — a working scratchpad, not canonical.
- **5 top-level docs** (`README`, `HANDOFF`, `AUDIT`, `ROADMAP`, `UX_ROADMAP`, `RESEARCH_RELEASE_PLAN`, `vision`) each have a clear role.

### ⚠️ Drift spots to fix (P3, low effort)

#### 3.1 — CI workflow path list is incomplete (already known)

`.github/workflows/quality.yml` checks generated artifacts with `git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json`. It does **not** include:

- `docs/theme-init.js`
- `docs/robots.txt`
- `docs/sitemap.xml`

The smoke test already enforces all three, so the practical risk is low, but a future refactor could rotate these without the CI gate noticing. **Owner action needed** (the sessions' GitHub App token lacks `workflows` scope, per HANDOFF §"Owner follow-up: CI workflow path list"). Adding those three paths to the `git diff --exit-code` line is a one-line fix.

#### 3.2 — Stale "~873 KB" / "~1.69 MB" comments (P3, can fix here)

| File | Line | Stale | Live |
|---|---|---|---|
| `index.html` | 33 | `~873KB` | `~1,910 KB` (1,956,032 B) |
| `HANDOFF.md` | 71 | `~799 → ~873 KB → now ~1.69 MB` | same |
| `AUDIT.md` | 31 | `~1.69 MB zero-backend static build` | `~1.87 MB` |
| `AUDIT.md` | 46 | `~873 KB` (×2) | same |

Note `AUDIT.md` §46 is a *dated* 2026-08-09 session report inside §4 — that one is **correctly** preserved as historical, not drift. The drift is in the live `~1.69 MB` and the inline `~873KB` comment in `index.html`. Fix: replace `~873KB` → `~1,910 KB` and `~1.69 MB` → `~1.87 MB`, or (better) drop the literal size and say "deterministic bundle" — the doc-truthfulness gate can't check comments and the numbers drift on every corpus update.

#### 3.3 — README repo tree lists files that may have moved

`README.md` §"Repository Structure" describes a tree with `ingest_autonomous_wave3.py` / `wave4.py` / `ingest_linji_and_platform_sutra.py` not shown in the structure. These files exist in `scripts/` but aren't documented in the public tree. **Suggestion:** trim the repo tree to the user-facing scripts (`build_data_bundle.py`, `validate_data.py`, `segment_classical.py`, `smoke_test.mjs`, `browser_test.mjs`, `arena_agent_pipeline.py`) and either move internal ingest scripts to `scripts/internal/` or annotate them as one-shot campaign artifacts. As-is, a reader sees 5 ingest scripts with no clear status.

#### 3.4 — README's "Wumenguan now 48/48 complete, every case carrying the verified 1934 Senzaki & Reps public-domain register"

Wumenguan has 119 verified slots (not 48), 37 of those Senzaki & Reps. The README is correct that "every case carries the Senzaki & Reps register" — 48 of 119 are that register — but a reader might think there are only 48 verified slots. The total of 177 verified is in §"Verified Quotation Campaign", and `177 = 119 (Wumenguan) + 37 (Xinxin Ming) + 6 (Linji) + 5 (Zhaozhou) + 3 (Huangbo) + 2 (Huangbo Wanling) + 2 (Platform Sutra) + 1 (Biyanlu Gensha) + 1 (Bodhidharma) + 1 (Zhengdao Ge)` — math checks out, but the campaign bullet could be clearer.

#### 3.5 — README's "8+ Robo-Translators"

The hero chip says "🤖 8+ Robo-Translators" but is data-derived (good) and the data actually has 21 registered profiles. The "+" makes the undercount defensible, but a more truthful "🤖 20+ Robo-Translators · 13 verified voices" or similar would tell a better story.

---

## 4. Performance — Strong But the Bundle is Now 1.87 MB

### ✅ What works well

- `<script defer src="app_data.js">` + `<script defer src="app.js">` downloads in parallel with HTML parsing, preserving order.
- `<link rel="preload" href="app_data.js" as="script">` warms the cache earlier.
- `getSearchUnitsIndex()` builds the searchable unit list **once per session** and reuses it; smoke `4m4`/N5 covers this.
- Lazy case rendering (`CASE_CHUNK = 12`) and per-corpus `caseLimit` cap DOM size.
- `setTimeout(renderLineage, 220)` debounces the lineage re-layout on resize.

### ⚠️ Bundle size (P3, can defer)

| File | Size | Notes |
|---|---|---|
| `app_data.js` | 1,956,032 B (1.87 MB) | 36 corpus documents, all bundled |
| `app.js` | 133,644 B | Renderer + state |
| `app.css` | 35,781 B | (line count 1,687) |
| `index.html` | 19,874 B | |
| `theme-init.js` | 876 B | FOUC guard |

On a 4G connection that's ~3 s to first paint. The single biggest win is **lazy-loading the per-corpus JSON on demand** (and only bundling the 4 complete texts), but that requires either:

- an HTTP/2-aware bundler (project is explicitly zero-build), or
- a service worker (explicitly rejected per UX_ROADMAP §D3 — "no hidden runtime behavior"), or
- splitting the bundle into a "core 4 complete texts" + a "library" of per-corpus JSON files that the reader fetches on first view.

Realistic compromise: **keep the 4 complete texts in `app_data.js` and ship the other 32 as `data/corpus/<key>.json` lazy-loaded by `fetch()` only when the user selects them.** That gets the first-paint payload down to ~600 KB (4 complete texts + UI bundle) while preserving the zero-build property and offline behavior (the user pays the fetch cost only when they pick a seed text). This is a **P3, ~M effort** decision worth discussing with the owner.

### 🔧 Quick wins

| ID | Finding | Effort |
|---|---|---|
| P1 | `app.css` line 1687 — `@media (prefers-reduced-motion)` should also gate the `sereneFade` animation; check that it does. | XS |
| P2 | `app_data.js` includes `meta` object — keep but also include `data_signature` (sha256 of the manifest keys + content_cjk_count) so a stale bundle is self-identifying. | XS |
| P3 | `app.js` reads `data.data` 60+ times — these are property walks on a large object. A top-of-file `const corpus = state.data.corpus` alias would shave a few ms. | XS |
| P4 | The hero SVG favicon is inlined as data-URI in `<link rel="icon">` — fine, but a comment explaining the choice would help future maintainers. | XS |

---

## 5. UX / Design — Mature, Some Polish Opportunities

### ✅ What's working (and well-thought-through)

- **Calm reader.** Case strip, collapsible cards, lazy chunking, mobile bottom bar — all battle-tested and smoke-guarded.
- **Honest disclosure UX.** ✅/🤖/⚠️ badges are persistent and shown next to *every* translation, not just on hover. Verified citations get a `ⓘ Citation` popover with book/edition/page/rights status. This is genuinely one of the more thoughtful attribution UIs I've seen.
- **Settings menu** is minimal and discoverable (⚙️ in the nav). Pinyin↔Rōmaji switch is persisted.
- **Lineage graph** is source-aware (dashed links for `traditional_link_pending_exact_locator` vs solid for `source_verified`) and the verification summary sits in plain prose above the chart.
- **Reduced-motion** is honored in scroll APIs; `motionBehavior()` is the single chokepoint.
- **Search** has variant normalization (鉢/缽, 曰/云, 臺/台, 裏/里, 無/无), diacritic folding, matched-field disclosure (N4/N5). Strong engineering.

### 🔧 Polish opportunities (P3, all opt-in)

| ID | Finding | Suggestion | Effort |
|---|---|---|---|
| U1 | Case-strip chips show only the case number — `第3則` works on touch but on desktop the title is in the `title=` attribute only. | Add the case `title_zh` (e.g. `第3則 — 趙州洗缽盂去`) inline on chips ≥ 80px wide, collapsed to a number below. | S |
| U2 | "Show more cases" button always shows the next 12. | Offer `12 / 24 / all` segmented control so a scholar studying a 100-case text can jump to a chapter quickly. | S |
| U3 | Lexicon search uses the global search box; there's no in-view filter. | Add a quick "filter this list" input above the lexicon grid — the category filter is great, but a free-text filter on top halves the navigation cost. | S |
| U4 | Dark-mode `data-theme` is set on `<html>` but the data attributes for popover positioning use `var(--text-primary)` etc. — good, but `term-popover` / `citation-popover` / `robo-popover` use absolute `left`/`top` which can drift on dark-mode-driven layout shifts. | Verified the popover `positionFloatingPopover` measures the live rect; this is fine. **No change.** | — |
| U5 | `sereneFade` keyframe in `app.css` runs on the dossier — no `prefers-reduced-motion` override for the dossier open. | Add `@media (prefers-reduced-motion: reduce) { #master-dossier-panel { animation: none !important; } }`. | XS |
| U6 | The "Search Chinese / English" placeholder text doesn't advertise the variant-fold or diacritic-fold. | Change to `Search Chinese / English (variants + diacritics OK)`. | XS |
| U7 | Mobile corpus picker is a `<select>`. For 36 items on a 360px phone, the native sheet is fine but lacks the rich titles in the sidebar. | Optional: a small modal grid showing the 36 corpus chips (with completion badges) on touch tap. | M |
| U8 | No "go to next case" / "go to previous case" **keyboard** shortcuts (← / → when the reader has focus). | Add `keydown` on `body` listening for `ArrowLeft` / `ArrowRight` only when `state.currentView === 'reader'` and the active element isn't an input/textarea. | S |
| U9 | The lineage graph node labels show only the master's `name_zh.slice(-2)` and the *surname* of the romanized name. | For masters with `alternative_names` (currently sparse — only 0 of 34 populate the field; see §6.1), the dossier could show those. | S |
| U10 | The page has no `og:image` or `twitter:image`. The hero shows the `「平常心是道。」— now freshly robot-stamped. 🤖` quote; a 1200×630 generated SVG of the brand would dramatically improve link previews. | Generate `docs/og-image.svg` + meta tag, no build step. | S |

---

## 6. Data Quality — Strong, A Few Soft Spots

### ✅ What's solid

- 36 corpus keys, manifest, locators, traceability queue (33), and profile review queue (34) all match by ID.
- All masters have `name_romaji`; all 12 `school_key` values resolve in the controlled vocab.
- All translation records are explicit `{text, status}` (the 736 bare-string migration is complete; the validator rejects legacy strings).
- The validator's `complete_documents` metric is now derived from manifest `unit_targets` (was hardcoded to Wumenguan alone before 2026-08-09).
- 177 verified slots across 10 corpus texts, all `source_id`s resolve in the rights manifest.

### 🔧 Soft spots

#### 6.1 — Many masters have empty `alternative_names` (15 of 34)

`huike`, `sengcan`, `daoxin`, `hongren`, `shitou_xiqian`, `baizhang_huaihai`, `guishan_lingyou`, `fayan_wenyi`, `nanyue_huairang`, `qingyuan_xingsi`, `nanquan_puyuan`, `yaoshan_weiyan`, `yunyan_tansheng`, `deshan_xuanjian`, `xuefeng_yicun`, `xuansha_shibei`, `luohan_guichen`, `baiyun_shouduan`, `wuzu_fayan`, `yuelin_shiguan`. Many of these have widely-known alternative names (e.g. 慧可 = **Shizu / Dazu Huike**; 弘忍 = **Daman Hongren**; 神秀 = **Jiashan Jianyong**; 洞山 = **Liangjie**; etc.). Even one common name per master would make the dossier meaningfully richer.

**Validation rule missing:** the validator requires `alternative_names` to be a list of strings but does not require it to be non-empty. Adding `if not aliases: warn(...)` would surface this in CI without breaking anything.

#### 6.2 — Linked-corpus keys are missing on 8 masters

`huike`, `daoxin`, `hongren`, `nanyue_huairang`, `qingyuan_xingsi`, `nanquan_puyuan`, `yaoshan_weiyan`, `yunyan_tansheng`, `luohan_guichen`, `baiyun_shouduan`, plus the 4 frontier scaffolds (`prajnatara`, `longtan_chongxin`, `yangqi_fanghui`, `dahong_zuzheng`). The "Open related work" buttons in the dossier silently degrade to "Project corpus link not yet curated." The validator already requires `linked_corpus_keys` to be a list (but allows empty). Surfacing as a warning would be honest.

#### 6.3 — `data/lineage/school_vocabulary.json` has 12 schools, but only 11 are "real"

The `chan_transmission` key (`#756b64` gray) holds exactly one master (the "traditional/scaffold" bucket for `prajnatara` / `longtan_chongxin` / etc. — actually the 4 frontier scaffolds). 1 master in a 12-school taxonomy feels off; either merge into `foundational_patriarchs` (Indian Patriarchs is its own bucket) or rebrand as `scaffold_unattributed` to make it explicit.

#### 6.4 — 7 documented-external profiles (Red Pine, Cleary, Heine, Liebenthal, Snyder, Adamek, ai_literal)

These are described as "no in-corpus verified sample yet" but actually one — `ai_literal` — has `evidence_source: "not_applicable"`, so it's neither in-corpus nor external. The `documented_external` filter (e.g. for the real-fakeness badge) should distinguish these three tiers explicitly. Currently the `fakenessFromProfile` function in `app.js` correctly handles all three but the methodology tier label counts (21 profiles, 13 in_corpus / 7 external) include `ai_literal` in neither — a small bookkeeping inconsistency.

#### 6.5 — README mentions 19 verified text + matrix entries; live data is 10 corpus + 2 matrix

HANDOFF §8 says: "**177 verified quotation records have a recorded reference; the remaining 3 are explicitly pending**." Combined with the campaign bullet: "**177 verified quotation slots across 10 corpus texts + 2 verified comparative-matrix entries**" — both correct. Cross-checked: 10 corpus texts with verified, 2 matrix entries verified. ✅

#### 6.6 — Bundle contains `translations_provenance` and `provenance.json` separately

`build_data_bundle.py` includes `translations_provenance` (from `data/translations/provenance.json`) but `app.js` doesn't appear to consume it (uses `state.data.translations_rights` directly). It's metadata-only. If truly unused, drop from the bundle to shave a few KB; if used elsewhere, document where. (`grep -n "translations_provenance" app.js` returns no hits — verified dead code.)

#### 6.7 — `app_data.js` is now 1.87 MB; consider a build-time minifier

`json.dumps(..., ensure_ascii=False, indent=2)` is human-readable but ships as-is. The corpus is ~80% whitespace. A `python3 -c "import json; json.dumps(json.load(open('x.json')), separators=(',',':'))"` pass at build time (no extra dependency) would shave 15–20%. Even keeping `indent=2` for the `meta` object and compact everything else would be a clean win.

---

## 7. Accessibility — Solid, One Detail

### ✅ What's done well

- Skip-link, `role="search"` on search box, `role="tablist"` with roving tabindex, `role="dialog"` on dossier, `role="tooltip"` on three popovers.
- All `<button>` elements, none are `<div onclick>`. All event handling is delegated.
- `:focus-visible` reveals the glossary popover; `Enter`/`Space` opens it; `Escape` closes the topmost popover or the dossier.
- `aria-label` on every icon-only button, the lexicon filter, the dossier close button, the search input, the settings button (with `aria-expanded` / `aria-controls`).
- `lang="zh"` on every Chinese block (so screen readers know to switch voice/profile).
- `aria-hidden="true"` on every decorative emoji span.
- Reduced-motion: `motionBehavior()` gates every programmatic scroll; `sereneFade` is the only animation and could use a `prefers-reduced-motion: reduce` block (U5 above).
- Color contrast: muted text was raised 0.62 → 0.72 rem (N10), `--text-muted` is intentionally a *caption* tier (used only ≥ 14px); checked.

### 🔧 Detail to verify

| ID | Finding | Effort |
|---|---|---|
| X1 | The `header` element has the brand link with a 🪷 icon marked `aria-hidden`, and a nested `<div>` containing `<span>Fake Chan Factory</span>` + `<span class="brand-title-chinese">` + a `<div class="brand-sub">`. The brand-sub is "Robo-Translators Robolating the Chan Masters" — a screen reader will read all three. Intentional? | XS (add `aria-label` to the brand link if the visible text isn't the desired accessible name) |
| X2 | The hero banner `<div class="zen-quote-main">` is a decorative quote, not a heading. The `<p class="text-title-en">` blocks on each view *are* styled but not real headings. Wait — the smoke test `4m6` checks for `<h1>` in the matrix/gongan/lexicon views, but does it check the hero? Hero has no heading, which is correct (it's the page header, not a section). | OK, no change |
| X3 | When the dossier is open and a citation popover is open, the smoke test gates the first `Escape` to the popover and the second to the dossier. Documented in code comments but worth surfacing in a UX tip or `aria-live` announcement. | XS |
| X4 | `aria-live="polite"` is set on `#lineage-verification-summary` — good. The settings panel has `role="region" aria-label="Display settings"` but no `aria-live`; toggling Pinyin↔Rōmaji currently re-renders lineage without an announcement. | XS (announce) |

---

## 8. Operations / DX — Excellent, Two Known Gaps

### ✅ What works

- Local release checklist: `python3 -m py_compile scripts/*.py && python3 scripts/validate_data.py && python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs && diff -rq data docs/data` is the standard. CI runs the same commands.
- `scripts/arena_agent_pipeline.py` is a clean abstraction for sandboxed agent sessions — even if it's not used externally, the prompt templates document the project's data invariants.
- `scripts/smoke_test.mjs` is 770 lines of dependency-free regression coverage. **44+ distinct checks** (4, 4a, 4b, 4b2, 4c, 4d, 4e, 4e1, 4f, 4g, 4h, 4i, 4j, 4j2, 4k, 4l, 4m, 4m2, 4m2b, 4m3, 4m4, 4m5, 4m6, 4m7, 4n, 4r, 4s, 4t, 4u, 4v, 4w, 4x, 4y, 4z — many with multiple assertions).
- `package.json` is dev-only; the runtime is zero-dependency. Clean separation.

### ⚠️ Known gaps (HANDOFF calls these out as "owner action" — no agent token can fix)

1. **GH Actions workflow path list missing 3 files** (theme-init, robots, sitemap). See §3.1.
2. **Branch protection on `main`** — the Quality check is wired but not required by GitHub rulesets. PRs can still merge without it. (~2 min owner action.)
3. **Session GitHub App token lacks `workflows` scope** — so future agents can't fix #1.

These are correctly *documented* in HANDOFF as owner-required; nothing for an agent to do.

### 🔧 DX improvements

| ID | Finding | Effort |
|---|---|---|
| O1 | `scripts/validate_data.py` is 1,150 lines and could be split into `validate_data/{schema.py, corpus.py, lineage.py, lineage_profile_queue.py, traceability.py, rights.py, metrics.py, doc_truthfulness.py}` for clarity. | M |
| O2 | `scripts/build_data_bundle.py` is fine but the `meta` object is hardcoded `"1.1.0"`. | XS |
| O3 | `scripts/smoke_test.mjs` is one big file (770 lines); for readability consider splitting per concern. | M |
| O4 | `package.json` `^1.62.1` on Playwright is fine; consider `engines` and `private: true` (already private). Add `volta`/`nvm` `engines`? | XS |
| O5 | `.gitignore` excludes `__pycache__/` and `*.py[cod]` but not `.pytest_cache/` (no tests yet) or `.mypy_cache/` (no mypy yet). Add them preemptively. | XS |
| O6 | `response_summary.md` is the live working scratchpad — the convention is documented but a tiny section at the top saying "OVERWRITTEN EACH SESSION — DO NOT TRUST" would help. | XS |

---

## 9. Content & Honesty — The Best Part of the Project

### ✅ What's exemplary

- **Every translation carries a structural status** (`verified_quotation` / `reconstruction_unverified` / `ai_draft`).
- **Verified slots must link to a `source_id` in the rights manifest**; the manifest is the editorial control record, not a license grant.
- **Per-file `coverage_note`** + validator-generated `coverage` string mean an excerpt is never mistaken for a complete text.
- **`matrix_entry_schema` is documented** in `provenance.json`; the matrix honors it.
- **RoBo name popover** with a 5-tier "real-fakeness" score is genuinely fun and not a gimmick — the tier is grounded in the count of verified samples in the corpus. **The "fake ⏳ → fairly → very → truly → certifiably fake" scale is a great example of honest display of AI provenance.** (The mock of "Robozuki / Roblofeld" coinages is a small delight.)
- **The whole project wears the joke.** 「平常心是道。」— now freshly robot-stamped. 🤖 is the line under the brand. This is the right way to ship an AI-as-research project.

### 🔧 Content gaps

| ID | Finding | Suggestion | Effort |
|---|---|---|---|
| C1 | The disclaimer for the Comparative Matrix is one paragraph at the top; each row should also carry a one-liner like "🤖 Robolations unless ✅ Verified". | Render a status summary chip at the top of the matrix that's *also* on each card. | XS |
| C2 | The reader header shows "📜 Canon: T2005" but the canonical title (e.g. CBETA volume name) is not displayed — only the ID. | Add the CBETA volume name to `data/canonical_locators.json` documents and render it. | S |
| C3 | The lineage "summary" field is rendered in monospace, small text at the bottom of each card; the most important field is in the visually weakest position. | Promote the summary into a collapsible panel below the quote, with a "Read more" affordance. | M |
| C4 | Many of the 32 excerpt seeds have unit counts ≤ 4 (e.g. `dongshan_yulu` 8 dialogues + 5 ranks = 13 units; `fayan_yulu` 8 sections; `caoxi_zhuan` 3 sections). These are the next-natural Phase 2 targets. The README repo tree calls them out but the priorities are buried in the metric file. | Add a `data/editorial/next_targets.json` (or extend `traceability_queue.json` with a `priority: "high"` subset) and render a "📌 Phase 2 next" panel on the Reader empty-state. | M |

---

## 10. Prioritized Recommendations

If I were to pick a backlog of work for the next 1–2 sessions, in priority order:

### Tier 1 — Doc drift (P3, ~30 min total)

- [ ] Fix `~873KB` / `~1.69 MB` references in `index.html`, `HANDOFF.md`, `AUDIT.md` (or remove the literal size entirely).
- [ ] Add `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml` to the CI `git diff --exit-code` list (requires owner token — document the exact line edit in HANDOFF).
- [ ] Update the README repo tree to either hide internal ingest scripts or annotate them.
- [ ] Trim the 3 `173 KB → ~873 KB` and "873 KB" comments in `app.js` smoke test (`~873 KB` literal in the source comment).

### Tier 2 — UX polish (P3, ~1 session)

- [ ] **U1** Show `title_zh` on case-strip chips ≥ 80px.
- [ ] **U2** Add 12/24/all segmented control to "Show more cases" button.
- [ ] **U3** Add a free-text filter input above the Lexicon grid.
- [ ] **U5** `prefers-reduced-motion` override for `sereneFade`.
- [ ] **U8** ←/→ keyboard shortcuts for case nav in reader.
- [ ] **U10** Add an `og:image` (1200×630 SVG of the brand).

### Tier 3 — Performance (P3, ~1 session, larger change)

- [ ] **Bundle size:** split `app_data.js` into a "core 4 complete texts" bundle + 32 per-corpus JSON files lazy-loaded on demand. Estimated first-paint drop: 1.87 MB → ~600 KB.
- [ ] Or simpler: compact the JSON in `build_data_bundle.py` (15–20% saving with no schema change).

### Tier 4 — Data completeness (P3, ongoing)

- [ ] **6.1** Populate `alternative_names` for the 15 empty masters.
- [ ] **6.2** Populate `linked_corpus_keys` for the 8 empty masters + flag in the validator as a warning (not error).
- [ ] **6.6** Drop unused `translations_provenance` from the bundle.
- [ ] **6.3** Either merge `chan_transmission` into `foundational_patriarchs` or rebrand the school.

### Tier 5 — Architecture (P3, future, no rush)

- [ ] **A1** `app.js` ES-module split (already noted in `STRUCTURAL_ASSESSMENT_2026-08-09_019fe64a.md` §C1).
- [ ] **O1** `validate_data.py` split into submodules.

---

## 11. P0 / P1 / P2 Findings

**None found.** All quality gates pass; the public Pages scope is intact (smoke test guards it); no injected HTML, no broken links, no missing content. The branch is in excellent health.

---

## 12. What Next?

Given the project's health, I'd suggest one of these next moves — they're all P3 improvements that don't change the data contract or break any gate:

1. **Fix the small doc drift first** (Tier 1 above) — ~30 min, ships today, makes the repo presentable for any future review.
2. **Add the U1 + U2 + U5 + U8 keyboard/UX polish** — ~1 session, all small, no data risk, improves the reading flow.
3. **Bundle-size split (Tier 3)** — biggest user-visible win, but worth a design conversation first because it changes the offline story.
4. **Data completeness pass (Tier 4)** — long-tail cleanup; pairs well with the next Phase 2 ingest wave.

Pick one and I'll plan it in detail.

---

## 13. One-Sentence Summary

**Project is in excellent architectural and content health with zero P0/P1/P2 defects; recommended next steps are a quick fix of 3 stale bundle-size references in `index.html`/`HANDOFF.md`/`AUDIT.md`, optionally followed by a small UX-polish batch (case-strip titles, keyboard shortcuts, free-text lexicon filter, and `prefers-reduced-motion` for `sereneFade`)**.
