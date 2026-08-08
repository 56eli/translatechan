# 🔍 TranslateChan — Full Technical Audit

> **Auditor**: Arena Agent (session `arena/019fe108-translatechan`)
> **Date**: 2026-08-08
> **Scope**: code, data, documentation, deployment — post PR #1 (`5fff7dc`)

---

## 0. Executive Verdict

TranslateChan has a **beautiful, well-architected static platform shell** with genuine Classical Chinese anchor text — **but the shipped application is currently broken at load time**, and the documentation materially overstates data coverage. The project is a strong seed (≈5–15% of its stated initial milestones in real content), not the near-complete corpus the docs describe.

| Area | Verdict | Grade |
|---|---|---|
| Application runtime | **Site is dead** — `app.js` has a fatal syntax error | 🔴 F (P0) |
| Frontend architecture | Clean vanilla-JS SPA, zero heavy dependencies | 🟢 B+ |
| Build & deploy tooling | Deterministic bundle, `/docs` in sync, Pages enabled | 🟢 A |
| Canonical text authenticity | Core anchor passages are genuine canonical Chinese | 🟢 A− |
| Data coverage vs. claims | Excerpt-level data presented as complete texts | 🔴 D |
| Translator attributions | Likely reconstructed, not verified verbatim quotations | 🟠 risk |
| Documentation accuracy | Systematic drift (counts, completion claims, missing files) | 🟠 C− |

---

## 1. 🔴 P0 — Critical: The Live Site Renders Nothing

### 1.1 `app.js` fails to parse (fatal)

```
$ node --check app.js
app.js:443 — SyntaxError: Unexpected token 'function'
```

**Root cause** (in `renderReader()`, ~line 406–441): an orphaned block that was clearly meant to be `if (doc.sample_records) { ... }` is missing its opening guard and has one closing brace too many:

```js
    elements.readerContent.innerHTML = html;        // ← premature assignment #1
      if (doc.overview) { ... }                     // ← orphaned, misindented
      doc.sample_records.forEach(rec => { ... });   // ← unguarded (TypeError on 35/36 texts)
    }                                               // ← closes renderReader early
    elements.readerContent.innerHTML = html;        // unreachable duplicates
  }                                                 // ← closes the IIFE early
function renderCaseItem(...) {                      // ← now outside any scope → SyntaxError
```

**Impact**: every view (Reader, Matrix, Lineage, Gong'an, Lexicon, Studio) is non-functional; `index.html` loads the script once and `init()` never runs. Both `main /docs` (live at <https://56eli.github.io/translatechan/>) and root carry the identical broken file — the bug was merged in PR #1.

### 1.2 Even after the syntax fix, latent runtime crashes remain

| # | Bug | Location | Impact |
|---|---|---|---|
| B1 | `doc.sample_records.forEach(...)` called without a guard | `renderReader()` orphaned block | `TypeError` for 35 of 36 corpus docs (only `chuandenglu` has `sample_records`) |
| B2 | `doc.overview` branch calls `doc.fascicle_structure.map(...)` without checking that field exists | same block | `TypeError` for `platform_sutra` (has `overview`, no `fascicle_structure`) |
| B3 | `window.TranslateChan = { openCase }` **overwrites** the earlier `window.TranslateChan` object that holds `openMasterDossier` | end of `app.js` | Lineage master cards / graph nodes throw `openMasterDossier is not a function` on click |
| B4 | `renderChapterItem()` is defined but **never called** from `renderReader()` | `app.js` (~L545) | **Platform Sutra page renders empty** — it is the only text using the `chapters` schema |

---

## 2. 🟠 P1 — Functional Gaps After Repair

1. **Global search only covers 7 of 36 texts.** `handleGlobalSearch()` iterates `doc.cases` exclusively; texts using `sections` / `dialogues` / `stanzas` / `chapters` / `five_ranks` schemas (29 texts) are never searched. It also calls `c.title_en.toLowerCase()` / `d.pinyin.toLowerCase()` without null-guards.
2. **Reader modes not differentiated.** `bilingual` slices translations to 2 columns, but `stacked` vs `multi_translators` fall through to the same "all columns" path; the mode buttons in `index.html` therefore don't all do something meaningful.
3. **Glossary tooltip inserter can double-annotate.** `annotateClassicalChinese()` regex-replaces terms into the *already-annotated* string; a term appearing inside a previous tooltip's definition text gets re-wrapped (nested `<span class="term-highlight">` chains). Also emits `<div>` inside `<span>` (invalid HTML nesting that browsers tolerate unevenly).
4. **Studio passages are hardcoded in `app.js`** (~7 passages, duplicated from `data/corpus/*.json`). Divergence risk; the studio should read from `TRANSLATECHAN_DATA`.
5. **Search has no highlighting** and no result count per text.

---

## 3. 📊 Data Audit — Coverage vs. Documentation Claims

### 3.1 Corpus: genuine text, but excerpt-scale

Total Classical Chinese across **all 36 corpus files: ≈ 9,610 characters** (about 3 pages of a single fascicle). The anchor passages I spot-checked are **genuine canonical Chinese** (verified against CBETA memory):

- ✅ 信心銘 opening (至道無難，唯嫌揀擇), 證道歌 opening (絕學無為閒道人), 壇經 verse (菩提本無樹…), 參同契 opening (竺土大仙心), 寶鏡三昧 opening, 臨濟「無位真人」 — all authentic.

But coverage is far below the README/HANDOFF/ROADMAP narrative ("Complete 48 Cases", "All 100 Cases", "30 Fascicles", "500+ Dialogues"):

| Text | Present | Canonical | Coverage |
|---|---|---|---|
| Wumenguan (T2005) | **11 cases** (+preface/epilogue) | 48 | 23% — ROADMAP marks this "complete" ✗ |
| Biyanlu (T2003) | **7 cases** | 100 | 7% |
| Congronglu (T2004) | **2 cases** | 100 | 2% |
| Zhengdao Ge (T2014) | **6 stanzas** | ~64 verse units | ~9% |
| Platform Sutra (T2007) | 4 chapters (unrendered) | 10 | present but invisible due to B4 |
| Chuandenglu (T2076) | structural metadata + 2 sample records | 30 fascicles | structural seed only |
| Remaining 30 yulu/treatises | 100–950 chars each | thousands–tens of thousands of chars each | excerpt scale |

### 3.2 Auxiliary datasets vs. claims

| Dataset | Actual | Documentation claims |
|---|---|---|
| Glossary (`chan_terms.json`) | **31 terms** | "150+ technical terms" (README, HANDOFF) |
| Lineage (`masters.json`) | **18 masters** | "complete genealogical graph" (ROADMAP ✓) |
| Comparative matrix | **4 entries** | "sentence-by-sentence alignment across corpus" |
| Gong'an index | **18 entries** | "indexed across Wumenguan, Biyanlu, Congronglu" |

### 3.3 Data quality nits

- **Duplicate CBETA IDs**: `T1986` claimed by both `baojing_sanmei` and `dongshan_yulu`; the combined string `"T1985 / T2076"` used by both `shitou_sandokai` and `deshan_yulu` (T1985 is strictly the *Record of Linji*; these texts are *embedded in* T2076 — the label should say "T2076 f.30" style references instead).
- `hanshan_poems` labeled `T2834` — Hanshan's poems are not in Taishō proper (Zokuzōkyō / Quan Tang Shi lineage); verify.
- No per-file **coverage metadata** (e.g. `coverage: "cases 1-11 of 48"`) — the single change that would make excerpt-level data honest.

### 3.4 ⚠️ Translator attribution risk (scholarly integrity)

The `translations` blocks credit Red Pine, Cleary, Sasaki, Suzuki, Blyth, Blofeld, Yampolsky per sentence. Work titles cited (e.g. Thomas Cleary, *No Barrier*, 1993) are real books, but several attributions are **not verifiable against any published translation** — e.g. Sasaki, Blofeld, and Wumenguan pairings; styling differences ("Mu" / "Wu" / "No" / "None") are plausibly *reconstructions in each scholar's known register*. Publishing these under the scholars' names as if quoted is a **citation-integrity and copyright risk** for the project's credibility.
**Recommendations (choose one)**: (a) verify each against print editions and mark `verified: true/false`; (b) relabel the UI tag from "Scholarly" to **"AI reconstruction — style reference"**; (c) keep attributions but add an explicit site-wide disclaimer. (a)+(c) is the scholarly path.

---

## 4. 📄 Documentation Drift

| Claim | Location | Reality |
|---|---|---|
| `scripts/align_translations.py` exists | ROADMAP Phase 2, structure tree | ❌ file does not exist |
| `.github/workflows/deploy.yml` exists | README + ROADMAP structure trees | ❌ no `.github/` directory at all (Pages works via legacy branch deploy — no workflow needed, but docs should say so) |
| `LICENSE` file | README badge links | ❌ missing (MIT/CC-BY-SA claimed) |
| "150+ technical terms" | README, HANDOFF | 31 |
| "Complete 48 Cases" Wumenguan ✓ | ROADMAP Phase 2 checklist | 11 |
| "8 Master Texts" / "36 canonical works complete" framing | ROADMAP Phase 1, HANDOFF | excerpts |
| "Merge `arena/019fe05c-translatechan`" instructions | README Deployment, HANDOFF | stale — that PR is merged; should describe ongoing flow from current branch |
| `ingest_cbeta.py` "CBETA automation" | README, ROADMAP, vision.md §7 | it is an offline punctuation-based segmenter demo; no CBETA fetching/normalization exists |
| Phase status percentages (60/85/90%) | ROADMAP overview matrix | not supported by measured coverage |

---

## 5. 🟢 What's Genuinely Good (keep protecting these)

1. **Build tooling**: `build_data_bundle.py` is deterministic (byte-identical re-run), covers all 36 corpus files with no silent exclusions, and synchronizes root + `/docs`. Zero drift between the two copies — verified.
2. **Deployment**: GitHub Pages is live (`status: built`, `main` + `/docs`, HTTPS enforced). No broken infrastructure.
3. **Architecture**: zero-backend vanilla SPA; only external dependency is Google Fonts; all content loads from a single `app_data.js`; no build step needed for contributors — exactly right for GitHub Pages longevity.
4. **Content authenticity of what's present**: anchor passages match CBETA-canonical wording; pinyin is consistently supplied; translator-register *contrast examples* (Mu/Wu/No/None) are pedagogically excellent.
5. **Schemas**: heterogeneous per genre (cases / sections / stanzas / chapters / five_ranks) — sensible domain modeling; the renderer mostly already knows how to walk them.
6. **HTML/ID contract**: every element ID referenced by `app.js` exists in `index.html` — verified all 26.

---

## 6. Remediation Plan (priority-ordered)

| Pri | Task | Effort | Files |
|---|---|---|---|
| **P0** | Repair `renderReader()` (syntax + B1/B2 guards), restore `window.TranslateChan` merge (B3), call `renderChapterItem` (B4); verify with `node --check` + live smoke test; rebuild bundle; push | ~1 h | `app.js`, `app_data.js`, `docs/` |
| **P1** | Doc-truth pass: correct counts, mark excerpts as excerpts, remove or create missing files (`LICENSE`, `align_translations.py` or update docs), fix stale merge instructions, add `.nojekyll` | ~1 h | `README.md`, `ROADMAP.md`, `HANDOFF.md`, `LICENSE` |
| **P1** | Translator attribution policy: add `verified` flags or "AI reconstruction" labeling + site-wide disclaimer | ~1 h | data + `app.js` tags |
| **P2** | Search across all schemas + highlight + guards; differentiate reader modes; fix tooltip nesting; studio reads from `TRANSLATECHAN_DATA` | ~2 h | `app.js` |
| **P2** | Coverage metadata per corpus file (`canonical_total`, `coverage_note`) shown in the UI header | ~30 min | corpus JSON + renderer |
| **P3** | Phase 2 content: complete Wumenguan 48 cases first (best ROI), then Biyanlu; upgrade `ingest_cbeta.py` to fetch real CBETA text | ongoing | corpus JSON |

## 7. Verification Appendix (checks run)

- `node --check app.js` → SyntaxError at line 443 (reproducible)
- Bundle re-run → byte-identical `app_data.js` (deterministic ✓)
- `cmp` root vs `docs/` for `index.html`, `app.css`, `app.js`, `app_data.js` → in sync ✓
- `diff -rq data/corpus docs/data/corpus` → identical ✓
- JSON schema survey of all 36 corpus files (key-set census) → heterogeneous genre schemas confirmed
- Chinese character census: 9,610 total `zh` chars; per-file counts recorded
- Canonical anchor grep: 信心銘/證道歌/壇經/參同契/寶鏡三昧/臨濟語錄 → present ✓ (證道歌 partial — excerpt)
- `gh api repos/56eli/translatechan/pages` → `status: built`, source `main /docs` ✓
- ID contract: 26/26 element IDs used by JS present in `index.html` ✓

---

## 8. Remediation Log

### 2026-08-08 — P0 repair completed ✅ (branch `arena/019fe108-translatechan`)

| Bug | Fix |
|---|---|
| Fatal syntax error (§1.1) | Restructured `renderReader()`: proper `if` guards, removed orphaned block + premature `innerHTML` assignment |
| B1 unguarded `sample_records` | Guarded with `if (doc.sample_records && doc.sample_records.length > 0)` |
| B2 `fascicle_structure.map` crash | Overview card now renders only when appropriate; fascicle grid separately guarded; five-ranks overview deduplicated |
| B3 `window.TranslateChan` overwrite (`openMasterDossier` lost) | Namespace merge via `window.TranslateChan.openCase = ...` |
| B4 Platform Sutra (`chapters`) never rendered | `doc.chapters` now routed through the existing `renderChapterItem()` |
| Shitou Sandokai sections (schema: `stanzas` inside `sections`) crashed renderer | `renderSectionItem` now handles `dialogue` and/or embedded `stanzas` |
| Search null-deref risk (`title_en`, `pinyin`) | Null-guards added in `handleGlobalSearch` |

**Verification**: `node --check app.js` ✓ · new dependency-free smoke test `scripts/smoke_test.mjs` (executes the app against a DOM stub, clicks through **all 36 corpus texts, all 4 reader modes, 5 search queries** — 0 crashes) ✓ · bundle rebuilt deterministically ✓ · `docs/` re-synced ✓ · all assets 200 via local server ✓

### 2026-08-08 — Documentation-truth pass completed ✅

| §4 drift item | Fix |
|---|---|
| Phantom `scripts/align_translations.py` | ROADMAP now marks it "(planned — not yet written)" |
| Phantom `.github/workflows/deploy.yml` | Removed from both structure trees; docs now state native branch publishing (no workflow needed) |
| Missing `LICENSE` | Created: dual MIT (code) + CC BY-SA 4.0 (datasets) + third-party rights notice for classical texts & modern translations |
| "150+ terms" | README/HANDOFF/ROADMAP corrected to measured **31**, with 150+ as target |
| "Complete 48 Cases" checkbox | Unchecked to measured **11/48**; all Phase 2 targets now show real counts |
| Stale merge instructions (`arena/019fe05c…`) | Rewritten around current session-branch → PR → `main` flow; Pages marked already-live |
| Phase status percentages (60/85/90%) | Replaced with measured ~10%/~20%/~60% + explicit "measured, not aspirational" note |
| `ingest_cbeta.py` oversold as CBETA automation | Described honestly as offline segmenter; real CBETA fetching listed as to-build |
| Corpus tables implying complete texts | Retitled "seed excerpts" with per-text coverage column; vision.md got an aspirational-doc banner |
| Missing `.nojekyll` | Added at root + `/docs` |
| Missing smoke test in docs workflows | Added to README dev quickstart + HANDOFF release checklist |

---

### 2026-08-08 — Attribution-integrity pass completed ✅ (§3.3 / §3.4)

| Item | Fix |
|---|---|
| §3.4 fabricated-citation risk | New machine-readable policy `data/translations/provenance.json` (v1.1): scholar-attributed renderings default to **`reconstruction_unverified`**; `verified_quotation` requires a per-item object with full source. Bundled into `app_data.js` as `translations_provenance`. |
| UI implied "Scholarly" status | `renderTranslationColumns` now badges every column: `⚠️ Register reconstruction` / `AI draft` / `✅ Verified quotation`, with hover explanation; supports object-form `{text, status, source}` translations (backward compatible). |
| Matrix view had no disclaimer | Sourcing banner added to matrix view in `index.html` (and mirrored in `/docs`). |
| Reader preface/epilogue hardcoded columns | Provenance note added under both hardcoded translator grids. |
| §3.3 `hanshan_poems` "T2834" miscite | Verified against CBETA Online: **T2834 = 大乘無生方便門** (Dunhuang, vol. 85) — corrected to "SBCK / Zoku lineage (not in Taishō)" with `cbeta_note`. |
| §3.3 `deshan_yulu` / `shitou_sandokai` wrongly labeled "T1985" (Linji's ID) | Corrected to embedded references: Deshan → "T2076 / X1565"; Sandokai → "T2076 f.30 / X1565", with `cbeta_note` documentation. `corpusMap` badges in `app.js` aligned. |
| `baojing_sanmei` vs `dongshan_yulu` both T1986 | Legitimate (poem embedded in the yulu) — retained; relation documented in AUDIT (this row). |

Remaining for full closure of §3.4: verifying individual renderings against print editions (gradual, per-text).

---

**Open work as of 2026-08-08**: §2 P1/P2 frontend items (full-schema search + highlighting, reader-mode differentiation, tooltip nesting, studio reads from bundle), §3.4 per-verified-verification of renderings (gradual), §6 P3 content work (Wumenguan 48 first). Everything ships to `main` via session-branch PRs.


