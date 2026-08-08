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

Total Classical Chinese across **all 36 corpus files: ≈ 11,832 characters** (re-measured 2026-08-08 after the verification rounds and the canon-note pass; was 9,610 at first audit — about 3.5 pages of a single fascicle). The anchor passages I spot-checked are **genuine canonical Chinese** (verified against CBETA memory):

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
| Lineage (`masters.json`) | **30 masters** (18 → 30 on 2026-08-08) | "complete genealogical graph" (ROADMAP ✓) |
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

### 2026-08-08 — P1/P2 frontend hardening completed ✅ (§2)

| §2 item | Fix |
|---|---|
| 1. Search only covered `doc.cases` (7/36 texts) | New `extractSearchableUnits()` indexes **every schema** (cases+commentary+verse, sections w/ dialogue or stanzas, dialogues, stanzas, chapters+verses, five_ranks, sample_records, preface/epilogue); results grouped per text with hit counts, `<mark>` highlighting, and working jump buttons (`openCase`/`openDoc`) |
| 2. Reader modes not differentiated | `bilingual` now prefers Red Pine + Cleary registers; `chinese_only` is a true classical-only mode (CSS `data-mode` hides pinyin + all translation grids incl. preface/epilogue); `multi_translators` shows all registers |
| 3. Tooltip double-annotation + `<div>` inside `<span>` | `annotateClassicalChinese()` rewritten single-pass (collect → sort → skip overlaps → emit once); tooltip internals now valid spans |
| 4. Studio passages hardcoded in `app.js` | `buildStudioPassages()` now extracts passages live from `TRANSLATECHAN_DATA` (Wumenguan cases 1–3, Linji sermon, Huangbo opening, Xinxin Ming, Platform verse) with the old list kept only as inert fallback |
| Search crash guards | already added during P0 + new pipeline has guards throughout |

**Regression coverage added to `scripts/smoke_test.mjs`**: schema-specific search queries across stanzas/chapters/sections/embedded-stanzas/translations, double-annotation check, `data-mode` presence, `openDoc` presence — all green.

**Verification note**: `build_data_bundle.py` re-run (bundle copied to `/docs`, root↔docs byte-identical); `node --check app.js` clean.

---

### 2026-08-08 — Translation-verification pilot completed ✅ (§3.4, first closure step)

| Action | Result |
|---|---|
| Ground-truth check attempted for Blyth's *Zen and Zen Classics* vol. 4 (1966) via surviving PDF | Not verifiable this session (fetch failed at the Case 1 pages) → **remains `reconstruction_unverified`; registered as "print check pending" in provenance.json v1.2**. Method shown to work for future sessions. |
| **Senzaki & Reps (1934)** added to Wumenguan Case 1 dialogue (both lines) | First English translation (*The Gateless Gate*, John Murray 1934); **public domain (non-renewal)** — verified verbatim vs Wikisource/sacred-texts and marked `✅ verified_quotation` with full source records. Also added as a row to `comparative_matrix.json` (`matrix_wumen_1`). |
| **Eiichi Shimomissé** online edition added to Wumenguan Case 1 dialogue | Verified verbatim vs the Terebess Asia Online reproduction; `✅ verified_quotation` with source. |
| App now differentiates visually | Verified columns/rows display `✅ Verified quotation` + a full source line (work · edition · verification note); matrix cards show status badges. |
| Truth-in-labeling consequence | The two newly added registers are the editions *actually translated* (Senzaki/Reps' 1934 indeed exists). Previously fabricated pairings (e.g., Sasaki/Blofeld/Red-Pine-on-Wumenguan) stay flagged as reconstructions with no claim of existence. |

### 2026-08-08 — Verification round 2 completed ✅

| Action | Result |
|---|---|
| Xinxin Ming stanzas 1–2 vs Richard B. Clarke's published translation | **Verified verbatim** via two independent mirrors → `✅ verified_quotation` with sources |
| Platform Sutra Shenxiu verse vs Yampolsky (1967, p. 130) | Prior dataset entry was a **paraphrase that did not match** → replaced with verified quotation (documented) |
| Platform Sutra Huineng received-text "yampolsky" | **Confirmed misattribution scope**: Yampolsky translated only the Dunhuang recension (佛性常清淨…), not the received 本來無一物 line → remains `reconstruction_unverified`; **Dunhuang variant verse added** with Yampolsky's actual p. 132 rendering ✅ verified — the app now displays the recension difference itself |
| 🔴 First inauthentic `zh` found: xinxin_ming stanza 3 (was 不生留情，本來平坦) | **Corrected to canonical T2010** reading (不識玄旨，徒勞念靜); logged in data + commit |
| Blyth Case 1 / Suzuki Platform-verse register | Still pending print check (registered in provenance.json v1.3) |

**Running tally**: 8 verified quotation slots across 3 texts (Wumenguan c1 ×4, Xinxin Ming ×2, Platform ×2); 1 zh correction; 1 paraphrase replaced. `provenance.json` v1.3.

---

### 2026-08-08 — Verification round 3 completed ✅

| Action | Result |
|---|---|
| Sekida — Wumenguan Case 1 dialogue | ✅ verified (Terebess reproduction of *Two Zen Classics* 1977 + independent quotation of verse) |
| Sasaki — Linji 無位真人 passage (2 lines) | ✅ verified vs 3 mirrors incl. Wikipedia citing Kirchner 2009; **prior paraphrase replaced** |
| Blofeld — Huangbo One Mind opening | ✅ verified vs publisher (Grove Atlantic) + Terebess + 2 mirrors; **prior paraphrase replaced** |
| Blyth — Case 1 | Still pending (source PDF page-range transcription illegible; will retry via alternate copy) |
| App gap found & fixed | Unattributed `verse_en`/`commentary_en` blocks now labeled "↳ Project rendering • unverified" |

**Tally**: 13 verified quotation slots across 5 texts + 1 verified matrix row; 2 paraphrase replacements this round (3 total); 1 zh canon correction. `provenance.json` v1.4.

**Bonus for Phase 2**: the Sekida reproduction includes *authentic Chinese* for all 48 cases (Taishō-lineage, Iwanami Bunkō) — ready-made substrate for completing Wumenguan with a verified English register.

---

### 2026-08-08 — Verification round 4 completed ✅

| Action | Result |
|---|---|
| Blyth — Wumenguan Case 1 (retry) | ✅ **verified** via the Mark T. Morse illustrated reproduction of Blyth's translation (verbatim, incl. his 'No-thing/Nay' gloss recorded as source note); prior near-verbatim paraphrase replaced — Case 1 now shows **5 verified editions** (Senzaki/Reps, Shimomissé, Sekida, Blyth, + Cleary-style reconstruction) |
| Sasaki — Linji closing exchange (乾屎橛) | ✅ verified, completing the full 無位真人 sermon as verified register (3/3 dialogue lines) |
| Suzuki Platform-verse register | **Unverifiable attribution** — the widely circulating "There is no Bodhi-tree…" rendering has no secure authored source traceable this session; kept as pending, dataset entry stays reconstruction (the honest outcome) |

**Final tally (rounds 1–4)**: 16 verified quotation slots across 6 texts; 4 paraphrases correctly exposed & replaced; 1 zh canon correction; 1 attribution genuinely unresolved. `provenance.json` v1.5.

---

### 2026-08-08 — Verification round 5 completed ✅

| Action | Result |
|---|---|
| Watson — Linji 四喝 (Fourfold Shout) | ✅ **verified** — *The Zen Teachings of Master Lin-Chi* (Columbia UP, 1999), **pp. 98–99**, citation-secure via Wikipedia "Katsu (Zen)" footnote 17; adds a 2nd *verified* translator register to the Linji record |
| Hoffman — Zhaozhou 洗缽 wash-bowl dialogue (2 units) | ✅ **verified** — *Radical Zen: The Sayings of Jōshū* (Autumn Press, 1978), verbatim vs Terebess reproduction; 3rd verified register on this anchor (with Sasaki + Cleary-style reconstructions alongside) |
| J.C. Cleary — Linji (usage-verifyable sections) | Confirmed our `cleary` entries are **NOT** verbatim → correctly stay `reconstruction_unverified` (negative verification: badges are honest) |
| Watson/Sasaki — Linji deathbed 瞎驢 verse | Watson wording not located this round → stays reconstruction |
| Next substrates located | Hoffman 柏樹子/石橋 registers (PDF on Terebess zhaozhou hub, not yet fetched) |

**Final tally (rounds 1–5)**: 19 verified quotation slots across 7 texts + 1 verified matrix row; 4 paraphrases exposed & replaced; 1 zh canon correction; 1 attribution genuinely unresolved. `provenance.json` v1.6. New translator keys: `watson`, `hoffman`.

---

### 2026-08-08 — Verification round 6 completed ✅

| Action | Result |
|---|---|
| Hoffman — Zhaozhou 柏樹子 cypress-tree dialogue (3 units) | ✅ **verified** — *Radical Zen* (Autumn Press 1978) episode no. 12, verbatim vs Terebess PDF reproduction; notable register choice recorded: Hoffman renders 柏樹子 as **"the oak tree in the front yard"** |
| Hoffman — Zhaozhou 石橋 stone-bridge register | ❌ Not verifiable this round: the Terebess Hoffman PDF (458 episodes) parses only to episode ~54; web mirrors carry other translators → stays pending |
| Blofeld — Huangbo unit 2 (當體便是…) | ✅ **verified** — *Chün Chou Record* §1 span; prior reconstruction was near-verbatim but ended "sentient beings" vs Blofeld's **"sentient things"** → corrected to verbatim |
| Blofeld — Huangbo Wanling Q&A (諸佛如何行大慈悲…) (2 units) | ✅ **verified** — *Wan Ling Record* Q&A no. 21, verbatim vs Terebess + Dailyzen mirrors |
| Linji deathbed 瞎驢 — **Ferguson** register | ✅ **verified ×2 units** — Andy Ferguson, *Zen's Chinese Heritage* (Wisdom 2011), verbatim vs course-reader reproduction with explicit citation line; unit-zh variant noted (囑三聖曰 vs T1985 據坐云) |
| Linji deathbed — Cleary | ⚠️ **Phrase-level confirmation only**: Cleary's wording *"The treasury of my True Dharma Eye will be destroyed by this blind donkey!"* appears in his translation of Guo Tianxi's 1298 preface; the record-body rendering is beyond the parse window → unit correctly stays `reconstruction_unverified` (honest badge) |
| Linji deathbed — Watson wording | ❌ Not located (course-reader Watson excerpt ends at the sermons) → stays pending |

**Final tally (rounds 1–6)**: 27 verified quotation slots across 8 texts + 1 verified matrix row; 5 near-verbatim/paraphrase reconstructions corrected or replaced; 1 zh canon correction; 1 attribution genuinely unresolved. `provenance.json` v1.7. New translator keys this round: `ferguson`.

---

### 2026-08-08 — Verification round 7 completed ✅

| Action | Result |
|---|---|
| Senzaki & Reps PD register extended to the whole Wumenguan excerpt set | ✅ **+22 verified slots** (cases 2–7, 19, 23, 29 + oak-tree case). Every Wumenguan anchor in the corpus now has **at least one ✅ verified register** — the free-to-quote 1934 John Murray text becomes the corpus's guaranteed-citable baseline |
| oak-tree case numbering audited | ⚠️ **Documented edition variance**: our file follows the Senzaki/Reps arrangement (their no. 38); canonical T2005 case 37 is Panshan 三界無法 and the oak-tree koan is *non-canonical* for the Wumenguan — source notes now say so explicitly on both units |
| Matrix `matrix_wumen_1` Blyth row | ✅ **Verified** (rewritten to his round-4-verified Hokuseido wording) → 2nd verified matrix row |
| Suzuki c19 everyday-mind register | ❌ No secure D.T. Suzuki mirror (several weakly-attributed near-registers circulate) → stays `reconstruction_unverified`, honestly |

**Final tally (rounds 1–7)**: 49 verified quotation slots across 8 texts (incl. **15/16 Wumenguan anchor-units waiting on only a substrate**, i.e. Wumenguan coverage is now PD-complete) + 2 verified matrix rows; 5 reconstructions corrected/replaced; 1 zh canon correction; 1 attribution genuinely unresolved; 1 edition-variance audit. `provenance.json` v1.8.

---

### 2026-08-08 — Verification round 8 completed ✅

| Action | Result |
|---|---|
| Yamada — Wumenguan (Kōun Yamada, Wisdom 2004) | ✅ **+24 verified slots covering all 11 corpus cases** (Terebess `Mumon.pdf` excerpts reproduction); Yamada c5 scan artifact "moth" corrected to printed "mouth" (documented) |
| Aitken — Wumenguan (North Point Press 1990) | ✅ **+6 verified slots** (c1, c2 u0–u1, c3 u0, c4); Aitken's deep commentaries push later cases outside the session parse window — c2 u2 / c3 u1 deliberately **skipped** (PDF page-break seams = not provably verbatim) |
| Case-1 register completion | ✅ **SIX ✅ editions now stand side by side on Wumenguan Case 1** (Senzaki/Reps PD, Shimomissé, Sekida, Blyth, Yamada, Aitken) |
| Oak-tree numbering audit refined | 📝 Our slot-37 numbering matches **Aitken & Yamada** (substituting the oak tree for canonical Panshan); Senzaki/Reps place it at 38; **T2005 case 37 is Panshan 三界無法** — v1.7 note refined |
| Shibayama — *Zen Comments on the Mumonkan* | ❌ Substrate is an image-only scanned PDF → honestly pending |
| Hoffman stone-bridge / Watson deathbed | ❌ Still pending from rounds 6–7 |

**Final tally (rounds 1–8)**: 79 verified quotation slots across 8 texts (Wumenguan excerpt set now carries **4–6 ✅ editions in parallel** on several anchors) + 2 verified matrix rows; 5 reconstructions corrected/replaced; 1 zh canon correction; 1 attribution genuinely unresolved; 2 numbering/edition audits. `provenance.json` v1.9.

**Open work as of 2026-08-08**: PR to `main` (13 commits ready — live site still serves the pre-fix build until merge), Phase 2 content (Wumenguan 48 — PD baseline + Yamada/Aitken full texts proven fetchable, ready to scale), optional round 9 (Aitken later cases; Hinton/No-Gate Gateway; Seung Sahn register).



---

## 9. 2026-08-08 — Second-pass full audit (post-merge state; session `arena/019fe1b5-translatechan`)

> Audited state: `f035254` = merge of PR #2 into `main` (live site now serves the fixed build). Full readable report: `SESSION_AUDIT_2026-08-08.md` (temporary session file). **Verdict: no P0; all §8 remediations hold under regression.**

### 9.1 Verified healthy
- `node --check app.js` clean; `node scripts/smoke_test.mjs` green (36 texts × all schemas, 4 modes, 7 queries, namespace, no double-annotation).
- Bundle deterministic (rebuild leaves tree clean); root↔`docs` app assets byte-identical.
- 36 corpus keys ↔ `corpusMap` (app.js) ↔ bundler list in perfect agreement.
- Measured attribution state: **79 ✅ verified slots in 6 corpus texts + 2 ✅ matrix rows** (wumenguan 60, linji 6, zhaozhou 5, huangbo_chuanxin 4, platform 2, xinxin_ming 2); 718 remaining slots honestly reconstruction/ai.
- Canonical anchors re-verified at codepoint level (乾屎橛 U+4E7E/5C4E/6A5B; Dunhuang verse 明鏡亦無臺，佛性常清淨 present with recension note).

### 9.2 Findings (see session report for evidence)
| ID | Sev | Item | Suggested fix |
|---|---|---|---|
| B1 | P1/P2 | `docs/data/` stale: 10 corpus files are pre-verification revisions, `provenance.json` missing; build script never mirrors `data/` (runtime unaffected — app is self-contained in `app_data.js`) | Extend `build_data_bundle.py` to mirror `data/ → docs/data` (or remove `docs/data` + fix README tree) |
| B2 | P2 | `index.html` Agents view still references PR#1 branch `arena/019fe05c-translatechan` | Generic wording ("the session branch") |
| B3 | P2 | Non-Taishō texts show misleading "(Vol. N)": `hanshan_poems` `taisho_vol: 85` contradicts its "not in Taishō" label; `caoxi_zhuan` `86` for X-series | Suppress volume for non-Taishō canons in renderer; fix the two fields |
| B4 | P2 | Search injects raw query into innerHTML (`makeSnippet` mark + header) — self-XSS only | Escape `q` before interpolation |
| B5 | P3 | Unguarded `JSON.parse(localStorage)` at init → corrupted storage blanks the app | try/catch fallback `{}` |
| B6 | P3 | `stacked` reader mode is dead (no UI button; = `multi_translators`) | Wire 4th button or drop mode (align smoke test, B11) |
| B7 | P3 | 9 dangling teacher refs in `masters.json` (Nanyue Huairang, Qingyuan Xingsi, Nanquan Puyuan, Yunyan Tansheng, Xuefeng Yicun, Luohan Guichen, Wuzu Fayan, Yuelin Shiguan, Prajñātāra) → SVG edges silently dropped | Add the 8 Chinese masters (18 → 26 profiles) |
| B8 | P3 | Stale corpus size in README/AUDIT §3.1: measured **11,454 zh chars** (was 9,610); "8 texts" → "6 corpus texts + 2 matrix rows" | Update counts |
| B9 | P3 | Search doesn't normalize edition variants (缽/鉢, 云/曰, 臺/台, 裏/里) | Optional variant map in search |
| B10 | P3 | `docs/scripts/build_data_bundle.py` is an old revision, never synced, unreferenced | Remove `docs/scripts/` |

### 9.3 — Remediation (same session, 2026-08-08) — B1–B10 + canon-reference & lineage passes

All findings closed in one verified push (branch `arena/019fe1b5-translatechan`):

| ID | Fix | Verification |
|---|---|---|
| B1 | `build_data_bundle.py` now mirrors `data/ → docs/data` (rmtree + copytree, deletions propagated); docstring states the sync contract | `diff -rq data docs/data` silent; app assets byte-identical |
| B2 | `index.html` Agents view: stale `arena/019fe05c-translatechan` → generic "session branch → PR → main" wording (docs copy re-synced) | grep clean |
| B3+ | Volume chip only rendered when `cbeta_id` matches a T-number; `taisho_vol` nulled for non-Taishō texts | reader chips correct for X/P/SBCK texts |
| B4 | Search escapes user query (`escHtml`) in snippets and results header; `makeSnippet` marks via variant-aware regex on raw text | smoke test 4f green |
| B5 | `JSON.parse(localStorage)` guarded with try/catch fallback | app boots with corrupted storage |
| B6/B11 | Dead `stacked` reader mode removed from state + smoke test (UI never exposed it) | smoke test green |
| B7+ | Lineage graph 18 → **30 profiles**: added Nanyue Huairang, Qingyuan Xingsi, Nanquan Puyuan, Yaoshan Weiyan, Yunyan Tansheng, Deshan Xuanjian, Xuefeng Yicun, Xuansha Shibei, Luohan Guichen, Baiyun Shouduan, Wuzu Fayan, Yuelin Shiguan — every existing profile's `teacher` now resolves (26 SVG edges, was 8); 4 documented frontiers remain (Prajñātāra, Longtan Chongxin, Yangqi Fanghui, Dahong Zuzheng) | integrity script: 0 dangling id-refs, depths consistent, fayan 13→14 |
| B8 | README/AUDIT counts updated: 11,454 zh chars; "6 corpus texts + 2 matrix rows" phrasing; 30 masters everywhere | grep clean |
| B9 | Search variant normalization (鉢/缽, 曰/云, 臺/台, 裏/里, 無/无 → canonical + regex marking) | smoke test 4e green |
| B10 | Stale `docs/scripts/` removed (scripts live at root only) | `git rm -r docs/scripts` |

**Canon-reference integrity pass (CBETA-verified 2026-08-08)** — 10 corpus files + 5 master profiles carried wrong canon IDs (same class of error as the earlier hanshan-T2834 fix):

| File | Was (wrong) | Now (CBETA-verified) |
|---|---|---|
| foyan_qingyuan | T1995 (= 法演語錄!) | X1315 古尊宿語錄·佛眼語錄 |
| mazu_yulu | X1304 / T1985 | X1321 四家語錄卷一 |
| baizhang_guanglu | T1985 / X1304 | X1323 四家語錄卷三 / X1315 |
| nanquan_yulu | X1315 / T1985 | X1315 (dropped spurious T1985) |
| xuansha_yulu | X1310 / T1991 | X1445 玄沙廣錄 / X1446 玄沙語錄 |
| dazhu_huihai | X1258 / T2076 | X1223 頓悟入道要門論 / X1224 參問語錄 |
| caoxi_zhuan | X1458 (vol 86) | X1598 曹溪大師別傳 / P.3018 |
| dahui_shobogenzo | T2002 (= 如淨語錄!) | X1309 大慧正法眼藏 |
| fayan_yulu | T1991 / X1265 | T1991 / X1226 宗門十規論 |
| xuefeng_yantou | T1983 / T1985 | X1333 雪峰真覺語錄 / T2076 f.16 |
| deshan/shitou/dazhu vol | 47 | 51 (T2076 embedded refs) |
| hanshan/wudeng/niutou vol | 85/80/48 | null (non-Taishō; 續藏冊數 moved to notes) |
| dahui_hongzhi | T1998A / T2001 | T1998A (unverifiable T2001 dropped) |
| masters cbeta | mazu T1985/X1304; shitou T1985/T2076; zhaozhou T1985?/T2005; guishan T2007/T2076; yuanwu T2003 | T2076 f.6/X1321 · T2076 f.14/X1565 · T1987/X1315 · T1989/T2076 f.9 · T1997/X1357 |

**Key CBETA evidence (fetched this session)**: T47n1985 臨濟錄 · T47n1998A 大慧語錄 · T47n1995 法演語錄 · T48n2002A 如淨語錄 · T48n2009 少室六門 · T51n2075 歷代法寶記 · X63n1223 · X67n1309 正法眼藏 · X68n1315 古尊宿語錄 (TOC: 南泉語要/佛眼語錄/百丈語錄) · X69n1320-1323 四家語錄 · X69n1333 雪峰 · X69n1354 月林 · X69n1357 圓悟心要 · X73n1445/1446 玄沙 · X80n1565 五燈會元 · X86n1598 曹溪別傳 · 五燈會元卷十九 (守端/法演 chapters, verbatim quotes) · 月林師觀語錄 X1354 opening verse.

### 9.4 — Wumenguan completed: 48/48 cases (same session, 2026-08-08)

The roadmap's first Phase-2 full-text milestone is **done**: `data/corpus/wumenguan.json` now contains **all 48 cases + preface + epilogue** (was 11/48), making Wumenguan the corpus's first complete canonical text.

| Item | Detail |
|---|---|
| Classical Chinese | All 48 case texts (dialogue + 無門曰 commentary + 頌 verse) from the CBETA T2005 recension (宗紹編; TOC verified against CBETA Online, incl. the case-37 庭前柏樹 numbering — see correction below) |
| Verified register | **+40 verified Senzaki & Reps slots** (all 37 previously-missing cases), verbatim vs sacred-texts.com case pages — the 1934 John Murray edition, U.S. public domain via non-renewal; every dialogue unit now carries a ✅ verified quotation |
| Pinyin | Machine-generated (pypinyin) with a curated 50-entry Buddhist-term override table (迦葉, 乾屎橛, 薄伽梵, 闍梨, 兜率, 應諾…); tone-sandhi disabled for corpus consistency (bù not bú); flagged in provenance as a machine draft |
| commentary_en / verse_en | Project renderings (automatically labeled "unverified" in the UI); deliberately NO unverified scholar reconstructions on the new cases |
| Coverage metadata | `coverage_note` + `zh_chars` fields added to wumenguan.json (AUDIT §3.3 recommendation) |
| Regression | Smoke test now asserts ≥48 case cards render for wumenguan (4g); bundle rebuilt; root↔docs byte-identical |

**Numbering correction (supersedes §9.2/round-8 note)**: CBETA Online's T2005 目次 confirms case 37 = **庭前柏樹** (Zhaozhou's cypress/oak) and case 38 = **牛過窗櫺** — the earlier "T2005 case 37 is Panshan 三界無法" note conflated **Biyanlu case 37** (盤山三界無法) with the Wumenguan. The corpus's existing case 37 was correct all along; the Senzaki/Reps edition prints the cypress case as its no. 38 (they add Amban's verse as no. 49). Provenance round-8 note corrected; both numberings documented in provenance v2.0.

**Verified tally now**: **119 verified quotation slots across 6 corpus texts + 2 verified matrix rows** (was 79). Wumenguan alone: 60 dialogue slots on the original anchors + 40 new = 100 verified slots, every case carrying the PD baseline.

**Remaining Phase-2 work**: Biyanlu 7/100 → complete (next best ROI; note the Senzaki/Reps PD edition does not cover 碧巖錄, but Sekida's *Two Zen Classics* includes Hekiganroku as a partial substrate), then Congronglu, Chuandenglu, yulu completions. Optional round 10: Yamada/Aitken/Sekida/Blyth registers for the new 37 cases (substrates proven fetchable), scholar-register reconstructions for the new cases, gongan_index expansion to cover all 48 cases.

### 9.5 — UX Phases A+B implemented (same session, 2026-08-08; see UX_ROADMAP.md)

"Calm Reader" (A1–A5) + "Mobile-First" (B1–B3) shipped in one pass:

| Item | What landed |
|---|---|
| A1 | Sticky case-index chip strip for texts with ≥10 cases (48 chips on Wumenguan; horizontal scroll on mobile); per-case ‹ prev / ⤒ / next › nav footer; `scrollToCase` expands + scrolls |
| A2 | Collapsible case cards (`＋/−` toggle, `aria-expanded`); **collapsed by default on touch devices** (except case 1); user choices persisted per text in `localStorage` (`translatechan_collapsed_cases`) |
| A3 | Tooltip DOM **de-duplicated**: occurrences are lean `<span class="term-highlight" data-term-id>` + `title`; content renders once into a single shared `#term-popover` (JS-positioned, flips near viewport edges). Activation: hover, keyboard focus, tap (toggle), Escape closes. Removes ~200 duplicate tooltip nodes from the 48-case page |
| A4 | Persisted: reader mode, font size (A−/A+), active corpus, pinyin visibility, collapsed states — all restored on boot |
| A5 | Search debounced 200 ms + results capped at 200 ("narrow your query" note) |
| B1 | <960 px: sticky sidebar replaced by a corpus `<select>` picker (populated from the same corpusMap) |
| B2 | Mobile bottom action bar (`<960px`): A−/A+ · mode segmented (雙語/多譯/漢) · 拼 (pinyin toggle) · 📑 (case strip) · ⬆ (top); sticky, translucent |
| B3 | Translation grid single-column below 960 px; pinyin optional via 拼 toggle (persisted); `data-show-pinyin` CSS hook |

**Files**: `app.js` (state/persistence, popover, collapse, strip, debounce, mobile bar wiring, corpus picker population), `index.html` (picker + bottom bar), `app.css` (popover, strip, collapse, mobile overrides), `scripts/smoke_test.mjs` (debounce-aware `fireSearch`; new checks 4h strip/toggle/nav, 4i no embedded tooltips, 4j picker populated).

**Verification**: `node --check` clean; smoke test green (36 texts × all modes + 48-case render + strip/toggle/nav/picker/popover-DOM checks); bundle deterministic; root↔docs byte-identical; `diff -rq data docs/data` silent. Remaining UX phases: C1 print stylesheet, C2 hash routing, C3 lineage pan/zoom, C4 a11y pass, C5 studio/index polish, D1–D4 performance.

### 9.6 — UX Phase C implemented (same session, 2026-08-08; see UX_ROADMAP.md)

| Item | What landed |
|---|---|
| C1 | `@media print` stylesheet: hides nav/hero/sidebar/toolbars/strip/popover/mobile bar; forces expanded case bodies; single-column translations; `break-inside: avoid` on cards; black-on-white. `lang="zh"` added to all 17 `.classical-zh` render templates (screen + print semantics) |
| C2 | Hash routing: `#/view` + `#/reader/<corpus>`; `init()` restores view+corpus from the hash (deep links & refresh); `hashchange` → `applyHash()`; nav clicks, sidebar/mobile corpus changes, `openCase`/`openDoc` all sync the hash; brand link is now `#/reader` (no more `location.reload()` state loss); back/forward work |
| C3 | Lineage SVG: content wrapped in a `.lineage-panzoom` group; wheel zoom toward cursor, pointer-drag pan (with grab/grabbing cursor), two-finger pinch on touch (`touch-action: none`); clamped 0.35×–3×; `⟲ Reset View` button; transform preserved across re-renders (school filter) |

Smoke test: location/scrollTo/addEventListener stubs added for the DOM harness; new checks 4k (pan-zoom group + resetLineageView) — suite green; bundle rebuilt; root↔docs byte-identical. Remaining UX: C4 accessibility pass, C5 studio/index polish, D1–D4 performance.

### 9.7 — UX Phase C4/C5 implemented (same session, 2026-08-08; see UX_ROADMAP.md)

| Item | What landed |
|---|---|
| C4 a11y | Skip-to-content link; nav tabs `role="tablist"/"tab"` + `aria-selected` synced by JS; `aria-label`s on icon buttons (theme, GitHub, font A−/A+, print) and on every lineage graph node (`role="button"`, `tabindex="0"`, Enter/Space opens dossier); global `:focus-visible` ring using `--border-focus`; **contrast fix**: `--text-muted` light theme `#9c9189 → #756b64` (≈2.8:1 → ≈4.7:1) and dark theme `#736e67 → #8f8980` (≈3.7:1 → ≈5.5:1); `prefers-reduced-motion` disables all animations/transitions + smooth scroll |
| C5 studio | Passage picker now covers **all 48 Wumenguan cases** (+ Linji/Huangbo/Xinxin/Platform); saved-drafts list gains a **filter box** (title/translation match) and **per-draft ✕ Delete** (`deleteDraft`), sorted by last-modified; new 🖨 Print button in the reader toolbar (ties to the C1 print stylesheet) |
| C5 index | Gong'an view gains a **theme filter bar** — clickable chips (All + per-theme), active state, re-renders filtered cards |

Smoke test: `print` stub; new checks 4m (studio picker ≥48 passages), 4n (deleteDraft + gongan chips) — suite green; bundle rebuilt; root↔docs byte-identical. **UX roadmap now fully implemented through Phase C (A1–A5, B1–B3, C1–C5)**; remaining: Phase D performance (D1 prebuilt search index, D2 lazy case rendering, D3 optional SW, D4 font delivery).

### 9.8 — UX Phase D implemented (same session, 2026-08-08; see UX_ROADMAP.md) — roadmap complete

| Item | What landed |
|---|---|
| D1 | Search-unit index **cached once per session** (`getSearchUnitsIndex()` builds `extractSearchableUnits` for all 36 texts on first search, then per-keystroke filtering runs on cached normalized strings — no more full corpus traversal per keystroke). Refined from the roadmap's "Python inverted index" to avoid duplicating unit semantics in Python and adding ~500 KB to the bundle; documented in the roadmap |
| D2 | **Lazy case rendering**: first 12 case cards render; "Show more cases — N of 48 · +12" button loads the rest in chunks; the case-chip strip and prev/next nav auto-load the target case (`ensureCaseLoaded`); reader scroll position preserved across loads; load-more button disappears when complete |
| D3 | Service worker intentionally **skipped** (zero-magic policy; static bundle is browser-cacheable) — documented as out of scope |
| D4 | `<link rel="preload" href="app_data.js" as="script">` added to head; `font-display: swap` already active |

Smoke test: stub gains `getBoundingClientRect`; 4g rewritten for lazy rendering (48 chips in strip; exactly 12 case cards initially; `loadMoreCases()` ×3 → 48; button gone) — suite green; bundle deterministic; root↔docs byte-identical. **UX roadmap 100% implemented** (Phases A–D, D3 deliberately excluded). Remaining project work per ROADMAP.md: Phase 2 corpus completion (Biyanlu 7/100 next), verification round 10, PR to main.

---

## 10. 2026-08-08 — Current independent audit (post-PR #3)

> **Audited snapshot:** `8717e969eab653ebe674c9ee76dcc41181dc8379` on `main` and the current Arena working branch.
> **Scope:** source tree, static deployment configuration, data/bundle integrity, renderer behavior, client-side storage/export paths, provenance model, and project documentation. This section is the current-state assessment; Sections 0–9 remain the useful historical remediation log.

### 10.1 Executive verdict

TranslateChan has a **sound, unusually well-documented static foundation**: it is a dependency-free GitHub Pages application with a deterministic data bundle, a real smoke test, synchronized deploy artifacts, and a much more honest corpus/provenance model than most early digital-humanities prototypes. There is no current P0 parse/build/render failure.

The initial current-state review found three P1 reader/studio integrity concerns and three P2 reader-reliability concerns. The public-page scope was subsequently simplified: browser drafting and agent branding were retired, while the Reader and Matrix retain explicit provenance/disclosure. Sparse case navigation follows actual neighbors; search includes pointer text and reports truthful counts; and all remaining browser preferences fail safely. The same session also added a manifest-driven build, formal schema companion, semantic/rights/locator validator, deterministic metrics, and a prepared CI workflow. The remaining gate before large content import is editorial: migrate legacy document-level locators and complete human rights review.

| Area | Current assessment | Grade |
|---|---|---:|
| Static build, deployment, and root↔`docs` synchronization | Healthy and reproducible | A− |
| Reader rendering and broad schema support | All supported schemas render; sparse case navigation follows actual adjacent records | A− |
| Search | Pointer blocks included; complete hit count and presentation-limit notice are truthful | A− |
| Public Pages composition | Focused reader/matrix/lineage/index/lexicon scope; drafting, agent branding, and header GitHub link retired | A− |
| Attribution/provenance model | Explicit status/source treatment plus source IDs and rights-manifest coverage; human rights review remains | B+ |
| Corpus scope and scholarly traceability | Honest seed coverage; locator registry covers all documents/57 case units, while 33 non-case seeds still need page/line or TEI migration | B |
| Accessibility and UX | Good baseline (skip link, focus states, reduced motion); interactive semantics still uneven | B |
| Tooling and release discipline | Manifest-driven build, formal schema companion, semantic validator, deterministic metrics, and smoke coverage; CI workflow publication is pending GitHub permission | A− |

### 10.2 What I verified

**Build/runtime checks — all passed**

```text
node --check app.js
node --check scripts/smoke_test.mjs
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
cmp root assets with docs assets
diff -rq data docs/data
```

- The bundle rebuilt deterministically at **626,587 bytes**; `index.html`, `app.css`, `app.js`, `app_data.js`, and `data/` are byte-identical between root and `docs/` after the build.
- The dependency-free smoke harness loaded the bundle, rendered all **36** corpus documents through all reader modes, executed debounced search for schema-specific and adversarial queries, exercised lazy Wumenguan rendering, Matrix provenance, graph wiring, public-scope exclusions, and storage-safe preferences with **0 failures**.
- All JSON files parse. The 36 corpus filenames, the 36 bundler entries, and the 36 UI corpus-map entries agree exactly.
- GitHub Pages is currently **built**, HTTPS-enforced, and configured to publish `main` → `/docs`.

**Measured data snapshot**

| Dataset | Current measured state |
|---|---|
| Corpus | 36 structured documents; Wumenguan is complete at 48/48 cases + preface/epilogue; the other 35 remain excerpt-scale seeds |
| Classical Chinese size | 13,268 CJK characters in source-content `*_zh` fields after excluding title/author metadata; 16,457 CJK characters across all JSON strings. Documentation should name the counting method rather than imply that both are the same measure. |
| Translation slots in corpus | 856 total: 138 object-form `verified_quotation`, 692 implicit scholar-register reconstructions, 26 AI drafts |
| Verified corpus slots by text | Wumenguan 119; Linji 6; Zhaozhou 5; Huangbo (Chuanxin T2012A 2 + Wanling T2012B 2) 4; Platform Sutra 2; Xinxin Ming 2 |
| Comparative Matrix | 4 rows / 21 translator entries; all 21 have explicit status; 2 verified entries carry source records |
| Glossary / lineage / gong’an index | 31 terms / 30 master profiles / 18 index entries |
| Lineage links | 26 in-set teacher edges render; four teacher references deliberately point beyond the current dataset (Prajñātāra, Longtan Chongxin, Yangqi Fanghui, Dahong Laoniu Zuzheng) |

The 138 verified corpus objects and both verified Matrix entries contain required work, edition, reference-state, verification, and rights-source fields. The locator registry now anchors every current case unit; the remaining 33 non-case seed documents are explicitly document-level until their rendered units receive page/line or TEI locators.

### 10.3 Current findings

| ID | Severity | Finding and evidence | Recommended resolution |
|---|---|---|---|
| C1 | **P1** | **DOM injection remains possible in two user-controlled paths.** The no-results search branch interpolates raw `q` at `app.js:1869`, while `renderSavedList()` writes draft title, translation, timestamp, and ID directly into `innerHTML` at `1682–1693`. A user can save markup in a draft and have it parsed on the same origin. The current search smoke assertion is a false negative because it accepts an escaped header while raw markup remains in the no-results body. Present exposure is chiefly self-XSS/local-data corruption, but it becomes a stronger cross-user problem as soon as imports, sharing, or third-party data are added. | Render untrusted/user-originated values with `textContent`/DOM nodes or a single rigorous escape helper; escape the no-results query; validate local-storage draft shape; add adversarial regression cases. After removing inline handlers, add a restrictive CSP. |
| C2 | **P1** | **Studio breaks on the project’s richer translation schema.** `updateRefTranslationDisplay()` interpolates a translation value directly (`1482–1489`). Verified translations are objects `{ text, status, source }`, so the UI displays `[object Object]`. The default Red Pine selection is absent from **37 of 48** Wumenguan cases; case 8 has only an object-form Senzaki/Reps value, making the defect immediately visible. The selector also omits Senzaki/Reps, Yamada, Aitken, and other verified registers. | Normalize every translation through one `getTranslationTextAndMeta()` function; derive selector options from the selected passage; preserve status/source badges in the Studio; add tests for string, object, fallback, and no-translation cases. |
| C3 | **P1** | **The attribution policy is not consistently applied in the views most likely to be cited.** Nineteen of 21 Matrix entries have no `status`, and `renderMatrix()` renders no per-entry warning when it is missing. Its two ✅ entries have no `source` object. Preface/epilogue columns use a generic footer instead of individual badges, while Studio drops all badge/source context. This contradicts the README’s current “every rendering … is labeled” claim. | Make status mandatory in both corpus and Matrix schemas; apply a default reconstruction/AI status when absent; require source metadata for verified records; render the same compact provenance component in Reader, Matrix, Studio, and exports. |
| C4 | **P2** | **Prev/next case navigation assumes consecutive numeric case IDs.** `renderCaseItem()` uses `case_num - 1` / `+ 1` (`762–764`) instead of adjacent array entries. It points to missing cards for Biyanlu `[1,2,3,12,14,21,43]` and Congronglu `[1,9]` (e.g., Biyanlu 3 → nonexistent 4). | Pass adjacent case numbers from `renderReader()` or resolve them by array index. Add a sparse-case regression fixture/assertion. |
| C5 | **P2** | **Search is broad but not actually comprehensive and the cap’s count is inaccurate.** `extractSearchableUnits()` indexes case dialogue/commentary/verse but omits all 9 `pointer_zh` blocks in Biyanlu/Congronglu; it also omits pointer English. On broad queries such as `the`, actual unit matches exceed 300, but the loop stops by document and reports a partial count as if it were the total while showing only 12 cards per document. | Index pointer fields and explicitly state `200+` / “showing first N” rather than a partial total; cap before counting/rendering or compute an accurate total separately. |
| C6 | **P2** | **Storage hardening is incomplete and corpus persistence is dead.** The integrity patch now shape-normalizes saved drafts and safely handles Studio save/delete/clear errors, but `state.theme` / `applyTheme` still use unguarded `localStorage` calls and the app reads `translatechan_corpus_key` at startup without ever writing it. | Extend safe storage wrappers to every preference; persist corpus selection on every selection path; version/validate stored data; test blocked/quota-exceeded storage. |
| C7 | **P2** | **Scholarly traceability and rights controls are not yet at research-publication strength.** Classical Chinese units generally carry only a document-level `cbeta_id`/occasional note, not a canonical locator or revision source per unit. The repo redistributes 138 verified quotations, many from modern copyrighted translations; the broad CC BY-SA data statement plus a prose exception is not a durable rights manifest. This is a risk assessment, not legal advice. | Add per-unit canonical locator/edition fields and a validation rule; record quotation length, rights basis, jurisdiction, source URL/page, and license/permission in a dedicated third-party manifest; obtain a legal/editorial review before calling the corpus publication-ready. |
| C8 | **P2** | **Documentation was drifting from the live snapshot.** The 119 verified-slot claim is now stale (the actual corpus count is 138); ROADMAP still said 18 master profiles in two places; `response_summary.md` reported a pre-merge state and old branch. I corrected current-facing documentation in this audit commit while preserving historical session reports as historical records. | Generate a small metrics table from data during the build/test step and make README/ROADMAP consume or verify it; keep session-specific branch names out of evergreen docs. |
| C9 | **P2** | **The build is deterministic but lacks enforceable data quality gates.** The corpus manifest exists in both `build_data_bundle.py` and `app.js`; it matches today but can silently drift. There is no JSON Schema, semantic validator, CI workflow, or browser-level test. `ingest_cbeta.py` is a punctuation segmenter only, despite its broader docstring, and `arena_agent_pipeline.py` is prompt scaffolding rather than an ingestion/validation pipeline. | Add schema + semantic validation (unique IDs, required labels, translation object rules, source requirements, case adjacency); derive a shared corpus manifest; run build/smoke/validation in GitHub Actions; add a minimal real-browser test when practical. |
| C10 | **P3** | **Accessibility/UI polish remains.** Reader term spans are focusable but do not activate on Enter/Space; clickable lineage card `<div>`s are not keyboard controls; tab roles lack tab-panel relationships and arrow-key behavior. The sidebar label says “CBETA” although entries include X-series, Dunhuang, and SBCK/Zoku material. Remote Google Fonts also make “offline” a qualified claim (functional fallback remains). | Use native buttons or full keyboard handling, complete ARIA tab semantics, rename the collection label, and self-host fonts or say “zero-backend static” rather than unqualified offline. |
| C11 | **P3** | **Studio scope/export quality is narrower than its positioning.** It offers all 48 Wumenguan cases but only one selected passage each from five other texts, not a schema-driven corpus picker. The LaTeX exporter escapes only `#`, `&`, and `_`, so ordinary `%`, `$`, backslashes, braces, etc. can break generated TeX. | Expand the picker from the generic unit index; provide a robust TeX escape function or label the export experimental; use Blob URLs for larger exports. |

### 10.4 Recommended sequence

1. **✅ Integrity hotfix completed:** C1 + C2 + C3 are remediated with adversarial smoke coverage, translation normalization, and explicit Matrix status/source records; browser drafting was later retired from public scope.
2. **✅ Reader reliability pass completed:** C4 + C5 + C6 are remediated with adjacent sparse-case navigation, pointer-inclusive/accurately counted search, safe storage wrappers, and persisted corpus choice.
3. **✅ Structural research-release guardrails completed:** C9 and the enforceable portion of C7 now have a formal schema companion, manifest-driven build, locator registry, source-ID/rights manifest, deterministic metrics, and a prepared CI workflow.
4. **Editorial migration + content next:** upgrade the 33 `legacy_document_seed` locators to page/line or TEI anchors, complete human rights review, then grow Biyanlu and the public reader under the new contract.

### 10.5 Audit limitations

This was a code/data integrity and product audit, not a line-by-line scholarly collation of all Classical Chinese against primary editions, a legal opinion on quotation/fair use, or a cross-browser assistive-technology certification. The static smoke test is green, but a browser automation pass should be added before calling the UX fully release-tested.

### 10.6 Integrity hotfix — C1/C2/C3 remediated (same session)

The following patch closes the three P1 findings documented above; the rows remain in §10.3 as the audit record.

| Finding | Remediation | Regression evidence |
|---|---|---|
| C1 — user-controlled markup | Added `escHtml()` coverage to the no-results search body, saved-draft list, source snippets, Matrix fields, Studio reference output, glossary popover, and annotated Classical Chinese output. Stored drafts are normalized to a narrow plain-data shape before use; unsafe prototype keys are rejected. | Smoke test now performs a real debounced no-result search with an HTML payload and saves an HTML-bearing draft; it fails if raw markup appears. The former `Atomics.wait` pseudo-delay was replaced with `await setTimeout`, so the debounce callback actually executes. |
| C2 — object-form Studio values | Added a shared `normalizeTranslationEntry()` adapter for legacy strings and `{text,status,source}` records. The Studio now populates its reference selector from the selected passage, selects a valid available register, and renders the normalized text plus status/source. | Smoke test selects Wumenguan Case 8 (Senzaki/Reps object-only), rejects `[object Object]`, and requires the verified badge/source line. |
| C3 — inconsistent provenance | Added explicit statuses to all 21 Matrix records (18 reconstruction, 1 AI draft, 2 verified) and source records to both verified Matrix rows. Reader preface/epilogue columns, Matrix, and Studio use shared status/source renderers; policy later advanced to v2.2 with rights-manifest source IDs. | Smoke test validates every Matrix record's status and verified source fields, then asserts 21 visual badges and 2 Matrix source lines. Corpus verification check still confirms 138 source-complete verified objects. |

**Result at this point:** no P0/P1 issue from this audit remained open. C4–C6 were completed immediately afterward in §10.7; structural C7/C9 guardrails followed in §10.8.

### 10.7 Reader reliability pass — C4/C5/C6 remediated (same session)

| Finding | Remediation | Regression evidence |
|---|---|---|
| C4 — sparse navigation | `renderCaseItem()` now receives the full case array and uses actual previous/next records; `ensureCaseLoaded()` resolves a target by array index rather than comparing a canonical case number with a render count. | Smoke test verifies Biyanlu 3 → 12 and 12 → 3, plus Congronglu 1 ↔ 9. |
| C5 — pointer search and cap accounting | Search units now include `pointer_zh`/`pointer_en`. The search first computes all matching units, then limits only rendered cards (12 per document, 200 globally) and reports “Showing N of M” when anything is omitted. | Smoke test finds Biyanlu pointer text `見面便見` and checks that broad `the` search reports a total above 200 plus the truthful presentation notice. |
| C6 — storage/persistence | Added guarded `storageGet`/`storageSet`/`storageRemove` wrappers for every preference and draft operation. A single `setCurrentCorpusKey()` path persists sidebar, mobile-picker, deep-link, and search-jump selection. | Smoke test confirms corpus selection is stored and exercises reader-mode/theme writes with a throwing storage stub without a crash. |

**Result at this point:** reader reliability is restored. Structural research-release guardrails follow in §10.8.

### 10.8 Structural research-release guardrails — C7/C9 implemented (same session)

| Guardrail | Implementation | Enforced evidence |
|---|---|---|
| Shared corpus manifest | Added `data/corpus_manifest.json`; `build_data_bundle.py` loads it to construct the corpus and `app.js` reads the bundled manifest to render reader navigation. This removes the prior three-way manual corpus-list drift. | `validate_data.py` requires an exact 36-key agreement between source files and manifest and verifies both the bundler and UI consume the shared manifest. |
| Formal + semantic data contract | Added `schemas/translatechan-data.schema.json` and dependency-free `scripts/validate_data.py`. The semantic layer validates identity metadata, heterogeneous content shapes, unique IDs/case numbers, corpus/matrix translation statuses, verified source fields, and bundle-navigation integrity. | `python3 scripts/validate_data.py` fails on malformed/missing/stale data and is run locally; the matching CI workflow awaits publication permission. |
| Canonical locator registry | Added `data/canonical_locators.json`, covering all 36 corpus documents and all **57 currently stored case units** (48 Wumenguan, 7 Biyanlu, 2 Congronglu). | Validator requires every case document’s declared case numbers to have an exact registry counterpart. The remaining **33 non-case seed documents** are explicitly tagged `legacy_document_seed`, not misrepresented as unit-collated. |
| Rights control | Added `source_id` to all **140** verified source records (138 corpus + 2 Matrix) and `data/translations/rights_manifest.json` with 13 editorial source records. Policy v2.2 requires a verified source to resolve through the manifest. | Validator rejects a verified quotation whose source ID is absent from the rights manifest. The manifest intentionally distinguishes a U.S.-specific public-domain claim from copyrighted/unknown-rights sources. |
| Deterministic metrics | Added generated `data/project_metrics.json`, containing corpus coverage, source-content/all-string CJK counts, translation status counts, locator coverage, rights coverage, and manifest counts. | Validator compares the committed metrics file to the computed value; contributors run `--write-metrics` after a legitimate source-data change. |
| CI workflow (pending publication) | Prepared `.github/workflows/quality.yml`: Python compilation, data validation, deterministic Pages rebuild, generated-artifact diff check, and renderer smoke test on pushes/PRs. GitHub rejected its push because the current App token lacks workflow permission. | Local validation runs the same commands now; publish this file after workflow-capable GitHub access is restored. |

**Boundary kept explicit:** this closes the **structural/enforceable** part of C7/C9. It is not a legal opinion, does not turn online mirrors into licenses, and does not yet supply page/line or TEI anchors for 33 legacy non-case seeds. Those editorial migrations remain the prerequisite for calling the corpus scholarly publication-ready.

### 10.9 Public Pages scope simplification (same session)

At product direction, the published interface was narrowed to the **Bilingual Reader, Comparative Matrix, Lineage Tree, Gong'an Index, and Chan Lexicon**. The following were removed from root and `/docs` Pages assets:

- Translation Studio navigation, view markup, browser-draft/local-storage/export code, and now-dead styling/tests;
- Arena AI Agents navigation, architecture/promotional content, and hero branding;
- the header GitHub repository link and repository-handle footer context.

The source data may still contain clearly labeled `ai_draft` and `reconstruction_unverified` values; those remain visible only as disclosed translation statuses in the Reader/Matrix. The current roadmap (§Phase 4) now governs source verification, citation disclosure, AI marking, and hover/focus/touch provenance rather than public drafting or agent branding. Smoke coverage rejects a reintroduction of the removed public-page views or GitHub URL.

### 10.10 Source and translation disclosure baseline (same session)

The public Reader and Matrix now implement the first executable portion of the Phase 4 disclosure roadmap:

| Disclosure requirement | Public implementation | Current measured gap |
|---|---|---|
| Source text location | Every reader document shows a visible canonical source location; all 57 stored case units also show their case-level source anchor. Matrix source sentences resolve through the same locator registry when a canonical identifier is available. | 33 non-case seed documents remain document-level (`legacy_document_seed`) until page/line or TEI anchors are added. |
| Translation attribution | Every displayed translation shows its translator/label and explicit status. Verified records show book, edition, page/section reference state, verification, and rights record; reconstructions/AI drafts state plainly that they are not external book quotations. | 5 of 140 verified source records still display a book-page/episode pending state; 135 carry a recorded case/page/section reference. |
| AI disclosure | `ai_draft` and `reconstruction_unverified` values visibly say **AI draft** or **Project register reconstruction** and are not styled as quotations. | Content/editorial work must replace pending references before any wider quotation claim. |
| Hover/focus/touch access | Shared `citation-trigger` controls open structured citation popups on hover, keyboard focus, or tap/click in Reader and Matrix. | Future lineage and index citation surfaces must reuse the component. |

The disclosure UI intentionally distinguishes a source reference from a verified book quotation; it does not fabricate pages where the dataset has not yet recorded one.

### 10.11 Lineage chart aggregation and verification baseline (same session)

The public lineage graphic is now backed by `data/lineage/lineage_verification.json` and a semantic validator rather than silently drawing teacher→disciple assertions from profile strings alone.

| Requirement | Implementation | Current state |
|---|---|---|
| Aggregate chart records | Registry captures all **26** in-set graph links, six candidate source records, and **4** unprofiled frontiers. | Every rendered internal edge has a registry record; every omitted frontier is explicitly disclosed. |
| Verify chart against source information | The validator requires the registry to match the master dataset exactly and rejects missing/extra/duplicate edges or unknown source IDs. | All current links are deliberately labelled `traditional_link_pending_exact_locator`, not `source_verified`, until an editor records an exact chart/record locator. |
| Make uncertainty visible | SVG links use status-aware styling; the graph shows a chart-status summary; clicking or keyboard-activating an edge opens a source-chart/verification citation panel. | No existing relationship is cosmetically upgraded to “verified”; the graph distinguishes source verification from traditional lineage aggregation. |
| Hover/focus/touch disclosure | The citation trigger inside the edge panel uses the same hover/focus/touch disclosure mechanism as source and translation citations. | Future node-level source records can reuse the same registry/component. |

This is an aggregation/verification framework, not a claim that the traditional lineage graph is historiographically settled. Exact locator review, disputed-link modeling, and source-verified upgrades are the next editorial step.

### 10.12 Lineage chart visual rework (same session)

The first source-status chart compressed 18 lineage depths into a short horizontal SVG, making nodes, labels, and thick pending links compete for space. The graph is now a vertically layered genealogical chart:

- one calm horizontal row per generation, with dynamic SVG height and wide node spacing;
- compact generation labels, node halos, shortened names, and links that terminate outside node circles;
- a normal-flow verification strip and toolbar instead of status/control overlays on top of the graph;
- thin, muted dashed traditional links, with stronger visual treatment reserved for future source-verified or disputed links;
- the existing pan/zoom/reset, edge citation panel, node citation panel, and keyboard interaction retained.

The smoke suite asserts the layered generation labels and halo nodes so the chart cannot silently regress to the cramped layout.

---

## 11. 2026-08-08 — Session `arena/019fe30b-translatechan`: full audit + a11y/CSP hardening

> **Audited snapshot:** `243fe3f` (post-PR #6, the tree the live site serves). Full readable report: `SESSION_AUDIT_2026-08-08_019fe30b.md` (temporary session file). **Verdict: no P0/P1; all prior remediations hold under regression.** Three documentation-drift items (F1/F2/F6) were corrected in the same commit; the C10-class a11y/CSP finding (F3) was remediated in a follow-up commit.

### 11.1 Verified healthy (re-measured this session)

- All gates green: `py_compile`, `validate_data.py` (corpus=36 | slots=856 | verified=138 | matrix=21 | locators=57/57), deterministic `build_data_bundle.py` (tree stays clean), `smoke_test.mjs`, root↔`docs` byte-identical, `diff -rq data docs/data` silent.
- GitHub Pages live: `status: built`, `main` → `/docs`, HTTPS enforced.
- Metrics fresh: `--write-metrics` produces zero diff; measured **13,268 content CJK / 16,457 all-string CJK** characters.
- Attribution honesty: 138 verified corpus slots + 2 verified matrix rows resolve through 13 rights-manifest sources; 135/140 references recorded, 5 honest pending; 692 reconstruction + 26 AI slots never claim verification.
- Wumenguan 48/48 + preface/epilogue complete; case 37 = 庭前柏樹 (T2005 目次-verified); Biyanlu 7/100, Congronglu 2/100, other 35 files honest excerpt seeds.

### 11.2 Findings and fixes (same session)

| ID | Sev | Finding | Status |
|---|---|---|---|
| F1 | P3 | README/AUDIT §10.2 CJK counts stale (13,090/16,270 vs measured 13,268/16,457) | ✅ fixed |
| F2 | P3 | HANDOFF "Current branch" pointed at prior session's branch | ✅ fixed |
| F6 | P3 | AUDIT §10.2 "Huangbo Chuanxin 4" — actual split is Chuanxin 2 + Wanling 2 | ✅ fixed |
| F3 | P2 | a11y/CSP (C10 carryover): inline `onclick` ×6, glossary terms not Enter/Space-activatable, tabs lacked tabpanel/aria-controls/arrow keys, no CSP | ✅ **remediated** (§11.3) |
| F4 | P2 | Per-file coverage metadata exists only for wumenguan; doc counts can drift (F1 class) | ✅ **remediated** (§11.4): deterministic `corpus.per_text` metrics, manifest `unit_targets`, validator-enforced `zh_chars`/`coverage_note` — immediately caught stale wumenguan `zh_chars` (5,876 → 5,528) |
| F7 | P2 | Required Quality check on `main` unconfirmed (branch-protection API 403 for this token) | open — needs owner |
| F10 | P2 | No real-browser regression suite yet | open — planned Phase 0 |
| F5/F8/F9 | P3 | Annotator/search scaling advisory; "Zero-Backend Offline" chip vs Google Fonts; overpromising script docstrings | open — tracked |

### 11.3 — F3 remediation: delegated events, ARIA tabs, keyboard glossary terms, CSP

| Item | What landed | Regression evidence |
|---|---|---|
| Inline `onclick` removed (case chips, case nav footer, load-more, teacher links, master work links, search jump) | One document-level delegated click handler over `[data-jump-case]`, `#case-load-more-btn`, `[data-open-case]`, `[data-open-doc]`, `[data-master-teacher]` | Smoke 4u greps both sources and fails on any inline handler attribute; 4v simulates delegated clicks |
| Glossary term keyboard activation | Enter/Space on a focused `.term-highlight` opens the shared popover; Escape closes | Smoke 4w |
| Full ARIA tabs | `id`/`aria-controls` on tabs, `role="tabpanel"`/`aria-labelledby` on sections, `role="none"` on `<li>`, roving tabindex, Arrow/Home/End | Smoke 4x |
| Restrictive CSP meta tag | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'` | Smoke 4u; `node --check`; full suite green; root↔docs byte-identical |

**Boundary:** real-browser verification of CSP/keyboard paths and a full a11y scan remain (RESEARCH_RELEASE_PLAN Phase 0/4); the DOM-stub suite does not replace them.

### 11.4 — F4 remediation: deterministic per-text coverage metrics (same session)

| Item | What landed | Regression evidence |
|---|---|---|
| `corpus.per_text` in `project_metrics.json` | `validate_data.py --write-metrics` emits 36 per-key records: title, cbeta_id, content/all CJK char counts, shapes, unit counts, declared `coverage_note`/`zh_chars`, and (where declared) machine-checkable `N/M units` coverage strings | Smoke test throws on missing/incorrect per_text; sum of per-text content counts equals the aggregate 13,268 |
| Manifest `unit_targets` | `corpus_manifest.json` now declares canonical totals for wumenguan (48 cases), biyanlu (100), congronglu (100), platform_sutra (10 chapters) | Validator rejects unknown units, non-positive targets, and documents exceeding their target |
| Per-file metadata rule | Declared `zh_chars` must equal the computed content count; `coverage_note` must be non-empty | **Real catch**: wumenguan.json declared 5,876 (stale, matched no counting method) → corrected to 5,528 (documented content measure); README honest-status block now sources per-text facts from `corpus.per_text` |
