# 🔍 TranslateChan — Session Audit Report (2026-08-08, session `arena/019fe1b5-translatechan`)

> 🗂️ **Moved 2026-08-09** (session-artifact convention): this dated report now lives in `sessions/`; the current-state summary + index is repo-root [`AUDIT.md`](../AUDIT.md). Links in dated reports are historical.


> **Temporary response file** — created for review of this session's full-project audit. Durable log entry lives in [`AUDIT.md` §9](../AUDIT.md). Delete this file after review (it is not part of the project's canonical docs).
>
> **Fix status (same session)**: all findings B1–B10 below were remediated and pushed in commit `f074b7e` — see [AUDIT.md §9.3](../AUDIT.md) for the fix log. A bonus **CBETA canon-reference pass** corrected 10 corpus files and 5 master profiles (several IDs pointed at entirely different texts), the lineage graph grew 18 → 30 masters, and **Wumenguan was completed 48/48** (§9.4).
>
> Audit performed on the post-PR#2 state: branch based on `f035254` (Merge PR #2), i.e. what `main` and the live GitHub Pages site (`main`/`docs`) currently serve.

---

## 0. Executive Verdict

The project is in **substantially better health than the pre-PR#1 state documented in AUDIT §0**: the P0 parse bug, the 6 runtime crashes, the search gaps, tooltip double-annotation, and the stale-docs drift found in the previous audit are all genuinely fixed and stay fixed under regression testing. The app now loads, renders all 36 texts across all schemas, and every scholar attribution carries an honest ✅/⚠️ badge backed by a machine-readable provenance policy.

**No P0 issues found in this pass.** The findings below are P1–P3: one documentation-integrity gap (`docs/data` out of sync), one stale UI string, two data-label nits, and several small code/data/tooling improvements.

| Area | Verdict | Grade |
|---|---|---|
| Application runtime | Loads cleanly; 36 texts × all schemas render; search works; smoke test green | 🟢 A− |
| Build & deploy tooling | Deterministic bundle, root↔docs app assets byte-identical, Pages live on fixed build | 🟢 A− (docs/data sync gap → B1) |
| Data authenticity | Canonical anchors re-verified; variant orthography is edition-authentic | 🟢 A− |
| Attribution integrity | 79 ✅ verified slots in 6 corpus texts + 2 ✅ matrix rows; policy v1.9 enforced in UI | 🟢 A |
| Documentation accuracy | Mostly healed; 3 residual stale items (B2, B8, B10) | 🟢 B+ |
| Content coverage vs. Phase-2 goals | Wumenguan 11/48 etc. — measured honestly, still the main gap | 🟠 C (known, tracked) |

---

## 1. Verified Healthy (previous audit's remediations hold)

1. **`node --check app.js` clean**; `node scripts/smoke_test.mjs` passes end-to-end (all 36 corpus texts clicked through the renderer, 4 reader modes, 7 search queries incl. schema-specific ones, namespace checks, double-annotation check).
2. **Bundle determinism**: re-running `build_data_bundle.py` reproduces the committed `app_data.js` byte-for-byte (git status stays clean after rebuild).
3. **Root ↔ docs sync for app assets**: `cmp` confirms `index.html`, `app.css`, `app.js`, `app_data.js` are identical in root and `docs/`. **(`docs/data/` is NOT in sync — see B1.)**
4. **Key-set integrity**: the 36 `data/corpus/*.json` files ↔ the 36 keys in `app.js`'s `corpusMap` ↔ the 36 keys in `build_data_bundle.py` are in perfect agreement (no missing/extra keys).
5. **Attribution honesty**: measured programmatically — **79 `verified_quotation` slots** across 6 corpus texts (wumenguan 60, linji 6, zhaozhou 5, huangbo_chuanxin 4, platform 2, xinxin_ming 2) **+ 2 verified matrix rows** (Blyth, Senzaki & Reps on Wumenguan Case 1). Every verified slot carries `{text, status, source:{work, edition, verification}}`. All other 718 slots are correctly labeled reconstruction/ai and never claim verification.
6. **Canonical Chinese anchors re-spot-checked** with codepoint-level verification: 無位真人 / 乾屎橛 (Linji, T1985), 菩提本無樹 + the Dunhuang-recension variant 明鏡亦無臺，佛性常清淨 (Platform, T2007), 洗缽盂去 / 庭前柏樹子 (Zhaozhou, T1987). Orthographic variants in use (缽 vs 鉢, 云 vs 曰, 裏 vs 里) are legitimate edition forms, not errors.
7. **Lineage data integrity**: 18 master profiles, unique ids; all in-set teacher references resolve; orphaned SVG edges are limited to teachers that are (legitimately or not) absent from the dataset — see B7.
8. **Deployment**: origin `main` == `f035254` (PR #2 merged) → the live site now serves the fixed build; Pages source `main`/`docs` unchanged and correct.

---

## 2. New Findings (priority-ordered)

### B1 — 🟠 P1/P2: `docs/data/` is stale and missing files (documented sync contract broken)
`build_data_bundle.py` only copies `app_data.js`, `index.html`, `app.css`, `app.js` into `docs/` — it never mirrors `data/`. As a result, committed `docs/data/` contains **stale pre-verification-campaign versions of 10 corpus files** (deshan, hanshan, huangbo_chuanxin, linji, platform, shitou, wumenguan, xinxin_ming, zhaozhou, comparative_matrix) and **does not contain `provenance.json` at all**.
- **Runtime impact: none** — the app is fully self-contained in `app_data.js` (zero `fetch()` calls in `app.js`), so the live site is unaffected.
- **Integrity impact**: README/HANDOFF structure trees present `docs/data/` as part of the "byte-identical by construction" bundle; `diff -rq data docs/data` fails. A contributor could edit `docs/data/corpus/*.json` believing it feeds the app.
- **Fix options**: (a) extend the build script to mirror `data/ → docs/data` (restores the claim), or (b) remove `docs/data/` from the repo and drop it from the README tree (it is dead weight for the app). Recommendation: **(a)** — it preserves the documented contract and makes `diff -rq` a real guard.

### B2 — 🟠 P2: Stale branch reference in the UI (docs-truth pass missed it)
`index.html` (Agents view, line ~332, mirrored in `docs/`): *"Commits directly to `arena/019fe05c-translatechan` and `main`…"* — `arena/019fe05c` was PR #1's branch, merged long ago. Every `.md` doc was cleaned of this in the docs-truth pass; the HTML string was overlooked. Fix: generic phrasing ("the session branch") or the current branch.

### B3 — 🟡 P2: Non-Taishō texts show a misleading "(Vol. N)" chip
`renderReader()` prints `Canon: <cbeta_id> (Vol. <taisho_vol || 48>)` unconditionally. Two files carry wrong/misleading volume values:
- `hanshan_poems.json`: `taisho_vol: 85` while `cbeta_id` correctly reads "SBCK / Zoku lineage (not in Taishō)" → UI says "(Vol. 85)", contradicting its own label.
- `caoxi_zhuan.json`: `taisho_vol: 86` for X1458 / P.3018 (X-series / Dunhuang — no Taishō volume).
Fix: drop the volume suffix for non-Taishō canons in the renderer, and correct/remove the volume fields in those two files.

### B4 — 🟡 P2: Search result highlighting inserts raw query into innerHTML
`makeSnippet()` does `snip.split(q).join('<mark>' + q + '</mark>')` and the results header interpolates `"${q}"` directly into HTML — the user's raw query string is injected unescaped. Impact is **self-XSS only** (no URL-parameter search path, data is repo-owned), but it's a one-line fix (escape `q` before inserting) and cheap insurance.

### B5 — 🟡 P3: Unguarded `JSON.parse` of localStorage at init
`state.personalTranslations = JSON.parse(localStorage.getItem(...) || '{}')` — corrupted/truncated storage (or a past-schema value) throws during module evaluation, blanking the whole app. Fix: try/catch with `{}` fallback. Same pattern already used correctly elsewhere.

### B6 — 🟡 P3: 'stacked' reader mode is dead state
`app.js` supports 4 modes (`bilingual`, `stacked`, `chinese_only`, `multi_translators`) but the UI exposes 3 buttons (`stacked` absent); `stacked` behaves identically to `multi_translators`. Either wire the 4th button or remove the mode + the smoke-test entry.

### B7 — 🟡 P3 (content): 9 lineage-graph edges silently dropped — teachers absent from dataset
`masters.json` references 9 teachers that have no profile, so the SVG graph draws their students as unconnected nodes:
`Prajñātāra` (Bodhidharma's teacher, Indian line — acceptable to omit), **Nanyue Huairang** (Mazu's teacher), **Qingyuan Xingsi** (Shitou's teacher), **Nanquan Puyuan** (Zhaozhou's teacher), **Yunyan Tansheng** (Dongshan's teacher), **Xuefeng Yicun** (Yunmen's teacher), **Luohan Guichen** (Fayan's teacher), **Wuzu Fayan** (Yuanwu's teacher), **Yuelin Shiguan** (Wumen's teacher).
Adding the 8 Chinese masters (18 → 26 profiles) would complete every teacher→disciple chain in the current set — high pedagogical ROI, pure data work.

### B8 — 🟡 P3 (docs): Stale corpus-size numbers
README ("≈9,600 characters") and AUDIT §3.1 ("9,610") predate the verification rounds: measured now = **11,454 classical Chinese characters** across the 36 files (per-file census in §4 below). Also README's "79 verified slots across 8 texts" should read **"6 corpus texts + 2 verified matrix rows"** (the tally itself is exact).

### B9 — 🟢 P3 (search UX, optional): No variant normalization
Search matches literal strings only; edition-authentic variants (缽/鉢, 云/曰, 臺/台, 裏/里) don't cross-match — e.g. typing 鉢 or 台 finds nothing in texts that use 缽/臺. A small variant-map applied at search time (and optionally at display time) would fix this; low priority.

### B10 — 🟢 P3 (tooling): `docs/scripts/` is stale and unsynced
`docs/scripts/build_data_bundle.py` is an older revision (pre-docs-sync, pre-`provenance.json`). It's not referenced by the README tree and is never copied by the build script. Either sync or remove; recommendation: **remove** (scripts belong at root only; keep `docs/` a pure app bundle).

### B11 — ℹ️ Note: smoke test is intentionally stricter than the UI
`smoke_test.mjs` exercises 4 reader modes while the HTML exposes 3 — fine as a regression net, but if B6 lands ("drop stacked") the test must be aligned.

---

## 3. Data Measurements (this session)

| Dataset | Measured | Doc claim | Verdict |
|---|---|---|---|
| Corpus files | 36 (`data/corpus/*.json`) | 36 | ✅ |
| Classical Chinese total | **11,832 chars** (11,454 at audit; +378 from canon-note pass) | ~9,600 (README, stale) | 🟠 B8 (fixed) |
| Wumenguan coverage | 11 cases + preface + epilogue (cases 1–7, 19, 23, 29, 37) | 11/48 | ✅ honest |
| Biyanlu / Congronglu | 7 / 2 cases | 7/100, 2/100 | ✅ honest |
| Platform Sutra | 4 chapters, all rendering now | 4/10 | ✅ |
| Chuandenglu | structural seed + 2 sample records | structural seed | ✅ honest |
| Translation slots (corpus) | **797** (79 ✅ verified · 718 reconstruction/ai) | — | ✅ |
| Verified matrix rows | **2** (Blyth; Senzaki & Reps) | 2 | ✅ |
| Glossary | 31 terms, 6 categories | 31 (150+ target) | ✅ |
| Lineage | 18 masters (+9 dangling teacher refs) | 18 | 🟠 B7 |
| Gong'an index | 18 entries; collections Wumenguan + Biyanlu; Congronglu present via 5 cross_refs | 18, "across Wumenguan, Biyanlu, Congronglu" | ✅ (cross-refs satisfy the claim) |

---

## 4. Per-Text Character Census (zh chars, incl. metadata strings)

wumenguan 1457 · biyanlu 762 · dongshan 507 · bodhidharma_erru 456 · foyan 426 · platform 399 · dahui_hongzhi 367 · linji 364 · dazhu 334 · deshan 328 · qinggui 315 · congronglu 306 · caoxi_zhuan 303 · shitou 298 · xuansha 291 · baizhang 290 · mazu 286 · dahui_shobogenzo 263 · sengzhao 263 · guiyang 261 · fayan 254 · huangbo_wanling 239 · lidai_fabao 237 · nanquan 232 · xuefeng 231 · wudeng 220 · niutou 211 · yunmen 206 · huangbo_chuanxin 198 · chuandenglu 193 · zhengdao_ge 188 · hanshan 179 · zhaozhou 177 · yuanwu_letters 149 · xinxin_ming 140 · baojing_sanmei 124

---

## 5. What's Genuinely Good (keep protecting)

- **Zero-backend architecture**: single `app_data.js` bundle, no runtime fetches, no build step for contributors — ideal for GitHub Pages longevity.
- **Deterministic build + smoke test**: the safety net that made the previous audit's fixes stick.
- **Attribution-integrity discipline**: provenance policy v1.9, per-column badges, honest negatives (Suzuki platform verse, Cleary deathbed, Hoffman stone-bridge all stay flagged "pending/not verifiable" rather than being asserted).
- **Schema heterogeneity handled cleanly**: cases / sections / dialogues / stanzas / chapters / five_ranks / sample_records / preface / epilogue all render and all search.
- **Measured, not aspirational, documentation culture** (counts verified in this audit).

---

## 6. Recommended Next Steps (proposal — awaiting direction)

1. **B1 + B10**: extend `build_data_bundle.py` to mirror `data/ → docs/data`; remove stale `docs/scripts/`; re-run bundle; verify `diff -rq data docs/data` clean. (Restores the documented sync contract.)
2. **B2 + B3 + B4 + B5 + B8**: small truth/robustness patch (UI branch string, volume chip, query escaping, localStorage guard, char-count + "6 texts + 2 rows" corrections).
3. **B7**: add the 8 missing Chinese master profiles to complete the lineage graph (pure data, high value).
4. **B6/B11**: align reader modes (wire 4th button or drop 'stacked').
5. **B9**: variant-normalized search (optional, later).
6. Then Phase 2 content: complete Wumenguan 48 (substrates proven fetchable: Senzaki&Reps PD + Yamada + Aitken).

---

## 7. Verification Appendix (checks run this session)

- `node --check app.js` → clean · `node --check scripts/smoke_test.mjs` → clean
- `node scripts/smoke_test.mjs` → **SMOKE TEST PASSED**
- `python3 scripts/build_data_bundle.py` → deterministic (working tree clean after rebuild)
- `cmp` root vs `docs/` for index.html/app.css/app.js/app_data.js → identical
- `diff -rq data docs/data` → **10 corpus files differ + provenance.json missing** (B1)
- Programmatic census: 36↔36↔36 key agreement; 797 translation slots; 79 verified; per-file zh census
- Codepoint verification of canonical anchors (乾屎橛 = U+4E7E U+5C4E U+6A5B; 清淨 = U+6E05 U+6DE8)
- `git ls-remote` → origin/main = f035254 (PR #2 merged; live site on fixed build)
