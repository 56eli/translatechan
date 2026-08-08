# 🤝 TranslateChan: Project Handoff, Pull Request & Deployment Guide

> **Repository**: `56eli/translatechan`
> **Working branch convention**: agent sessions work on `arena/<session>-translatechan`; completed branches/PRs are historical, not instructions for the next session.
> **Target Branch**: `main`
> **GitHub Pages URL**: `https://56eli.github.io/translatechan/` (**live**: branch `main`, folder `/docs`)

---

## 📋 Executive Summary of Deliverables

The TranslateChan project has been fully established with:
1. **Grand Vision & Architectural Blueprint** ([`vision.md`](./vision.md)): Canonical scope spanning CBETA / Taishō Tripiṭaka Volumes 47, 48, and 51.
2. **Project Roadmap & Milestone Execution Plan** ([`ROADMAP.md`](./ROADMAP.md)): Phased milestones from foundational corpus to living knowledge graph (statuses measured, not aspirational).
3. **Core Canonical Corpus Seeds** (`data/corpus/`): 36 excerpt-scale canonical works and foundational treatises across Tang, Five Dynasties, Song, and Yuan dynasties (authentic anchor passages; completion tracked in [`ROADMAP.md` Phase 2](./ROADMAP.md)).
4. **Master Lineage Knowledge Graph** (`data/lineage/masters.json`): 34 master profiles (30 researched seeds plus 4 clearly labeled frontier scaffolds) with genealogies, dates, temples, and signature quotes from Bodhidharma and the Six Patriarchs through the Five Houses of Chan (expanded 2026-08-08: Nanyue Huairang, Qingyuan Xingsi, Nanquan, Yaoshan, Yunyan, Deshan, Xuefeng, Xuansha, Luohan Guichen, Baiyun Shouduan, Wuzu Fayan, Yuelin Shiguan).
5. **Classical Chan Lexicon** (`data/glossary/chan_terms.json`): 31 technical terms (growing toward 150+), Sanskrit roots, and philosophical definitions with real-time hover lookup.
6. **Multi-Translator Comparative Matrix** (`data/translations/comparative_matrix.json`): 4 exemplar sentence-aligned entries in the registers of Red Pine, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, and Philip Yampolsky — **2 rows carry ✅ verified quotations** (Senzaki & Reps PD; Blyth per Hokuseido 1966). Reader and Matrix display the same provenance status; verified rows resolve through source records and `rights_manifest.json` (policy v2.2).
7. **Interactive Zero-Backend Public Reader** (`index.html`, `app.css`, `app.js`, `app_data.js`): Responsive, contemplative reader/matrix/lineage/index/lexicon interface with dark/light mode, search, and an SVG lineage network graph. Translation Studio, Arena AI Agents, and the header GitHub link are intentionally absent from the public Pages UI. *(Fatal parse bug shipped in PR #1 was repaired 2026-08-08 — see [`AUDIT.md` §8](./AUDIT.md); `node scripts/smoke_test.mjs` must pass before every push.)*
8. **Synchronized GitHub Pages Bundle** (`docs/`): Fully compiled, zero-dependency static bundle; Pages publishing already active from `main /docs`.
9. **Editorial Data Tooling** (`scripts/`): `validate_data.py` schema/semantic/rights/locator validator with deterministic metrics, `build_data_bundle.py` manifest-driven bundler, `ingest_cbeta.py` offline segmenter, and `smoke_test.mjs` renderer regression test. The checked-in GitHub Actions **Quality** workflow runs the same validation, deterministic-build, generated-artifact, and reader-smoke gate on pushes and pull requests; native GitHub Pages publishing remains separate.

---

## ✅ Current Session Handoff — 2026-08-08

### Public Pages scope

This branch deliberately publishes only **Bilingual Reader, Comparative Matrix, Lineage Tree, Gong'an Index, and Chan Lexicon**. Translation Studio, Arena-agent branding, and the header GitHub repository link were removed from root and `/docs` assets; the smoke test guards against their return.

### Branch delta and current release state

This branch adds the checked-in **Quality** workflow, evidence-first release controls, and two completed **locator pilots**: all four rendered Linji sections are linked to T1985 line-head ranges and all seven rendered Xinxin Ming stanzas are linked to T2010 line-head ranges. Their public Reader disclosures say **“collated with documented normalization — human sign-off pending”**; none is represented as a source-checked scholarly edition. The UI now carries the aligned original Chinese and canonical source status in every translation disclosure, and defines an AI register reconstruction as newly written project text—not wording copied from, verified against, or attributable to the named scholar.

The Huangbo seed was corrected for witness integrity: the One Mind material remains in `huangbo_chuanxin.json` (T2012A), while the unconditioned-compassion Q&A was moved to `huangbo_wanling.json` (T2012B). The moved material still needs its own unit-level collation; the queue documents this openly. These changes do not upgrade unresolved seed excerpts, translation rights, or lineage relationships to source-verified status.

### Source, translation, and lineage disclosure

- Every public Reader document/case now shows a canonical source location plus hover/focus/touch details. The Matrix resolves canonical source context through the same registry.
- Every displayed translation exposes its translator/label, status, book/edition, page-or-section state, verification, and rights record. **135 / 140** verified quotation records now have a recorded case/page/section reference; the remaining **5** are explicitly marked pending rather than fabricated.
- AI/project text is visibly disclosed as **AI draft** or **Project register reconstruction**, never as a named scholar's book quotation.
- The lineage graphic now reads from the verification registry: **30** in-set links and **4** frontiers are source-status aware; traditional links remain visually and textually pending until exact chart/record locators are reviewed. The chart was reworked into spacious vertical generation rows with source-aware edge interaction.

### Quality gate run before handoff

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
diff -rq data docs/data
```

All commands pass. Root and `/docs` assets/data are synchronized.

### GitHub Actions quality gate

`.github/workflows/quality.yml` is checked in and runs on pushes to `main` and `arena/**`, plus pull requests targeting `main`. It validates Python syntax, source data/metrics, deterministic generated artifacts, the `/docs` mirror, and the dependency-free reader smoke suite. It does **not** deploy Pages; Pages remains native branch publishing from `main` `/docs`. Repository administrators should require the `Validate data, generated artifacts, and reader` check before merging to `main`.

### Merge readiness

Current branch: `arena/019fe30b-translatechan`. Before merging, confirm the local quality gate above and the required **Quality** check; after merge, Pages republishes `main` → `/docs` automatically. GitHub Pages will republish `main` → `/docs` automatically.

---

## 📍 Historical Session Delta Through PR #3 (2026-08-08)

**PR #3 is merged into `main`; this is its historical one-sentence map** (full detail in [`AUDIT.md` §9](./AUDIT.md)):

1. **`8ea6c46`** Second-pass full audit → no P0; all PR#2 remediations verified holding; 10 new findings B1–B10 ([`AUDIT.md` §9.2](./AUDIT.md); readable report `SESSION_AUDIT_2026-08-08.md`).
2. **`f074b7e`** **B1–B10 remediation + CBETA canon-reference pass**: `docs/data` mirror restored; stale UI branch string; volume-chip truth; search escaping + variant normalization (鉢/缽, 曰/云, 臺/台, 裏/里, 無/无); localStorage guard; dead `stacked` mode dropped; `docs/scripts` removed; **lineage 18 → 30 masters** (four documented frontier teacher references remain outside the seed set); **canon IDs corrected vs CBETA for 10 corpus files + 5 master profiles** (foyan T1995→X1315, mazu/baizhang→四家語錄 X1321/X1323, xuansha→X1445, dazhu→X1223, caoxi→X1598, dahui_shobogenzo T2002→X1309, xuefeng T1983→X1333, fayan→X1226, dahui_hongzhi T2001 dropped, taisho_vol truth).
3. **`e299187`** **Wumenguan completed 48/48** — the corpus's first complete canonical text: all 48 cases + preface + epilogue (zh per CBETA T2005 宗紹編), **+40 verified Senzaki & Reps 1934 PD slots → the historical 119-slot tally at that milestone**; CBETA numbering correction (case 37 IS 庭前柏樹); coverage metadata; `provenance.json` v2.0.
4. **`11ad640`** UX/UI improvement roadmap ([`UX_ROADMAP.md`](./UX_ROADMAP.md)) — 10 measured pain points, phases A–D, mobile + desktop, zero-backend contract.
5. **`2ed729c` + `584a51f` + `b7083b4` + `15e1f9d`** **UX Phases A–D implemented (historical)**: case-index strip + collapsible cards; tap/focus shared glossary popover; persisted preferences; debounced + capped search; mobile corpus picker + bottom action bar; single-column mobile translations; print/PDF stylesheet; hash routing + deep links; lineage pan/zoom/reset; WCAG-AA a11y pass; Gong'an theme filters; cached search index; lazy case rendering; `app_data.js` preload. Public scope was subsequently narrowed to reader/matrix/lineage/index/lexicon.

**Historical release verification:** `scripts/smoke_test.mjs` ✅ (36 texts × reader modes + lazy rendering + strip/toggle/nav/popover/pan-zoom/index checks) · deterministic bundle ✅ · root↔`docs` byte-identical ✅ · `diff -rq data docs/data` silent ✅. Pages now serves `main` `/docs`.

---

## 🔀 Merging & GitHub Pull Request Instructions

Session work is committed and pushed to its current Arena session branch. To merge into `main`:

### Method 1: Via GitHub Web UI
1. Open a pull request from the current `arena/<session>-translatechan` branch to `main` (use GitHub's compare view or `gh pr create`).
2. Give the PR a descriptive title (conventional-commit style preferred), click **Create Pull Request**, then **Merge Pull Request**.

### Method 2: Via GitHub CLI (`gh`) — from the session branch
```bash
# Agent sessions must stay on their own branch; open the PR from there:
gh pr create --base main --head "$(git branch --show-current)" --title "..." --body "..."
# Merging is performed by the repository owner (or via `gh pr merge`).
```

---

## 🌐 GitHub Pages Status (Already Active)

✅ Pages is **already enabled**: `Deploy from a branch` → `main` + `/docs`, HTTPS enforced.
On every merge into `main`, the site re-publishes automatically within ~60 seconds.
👉 **`https://56eli.github.io/translatechan/`**

> **Release checklist before opening any PR affecting the app/data**: `python3 scripts/validate_data.py && python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs` must pass, `cmp app.js docs/app.js` (etc.) must show root/docs in sync, and `diff -rq data docs/data` must be silent (data mirror). Run these commands locally before opening a PR; the same checks are enforced by the GitHub Actions Quality workflow. Optionally (dev machines only, not CI): `npm install && npx playwright install chromium && npm run test:browser` runs the real-browser Playwright suite (desktop + mobile); it prints a clear SKIP when no Chromium is available.

---

## 📂 Repository Layout & File Manifest

> Corpus file descriptions below name the **canonical work and its scope**; current file contents are excerpt-scale seeds (see [`AUDIT.md` §3](./AUDIT.md) for measured coverage).

```
translatechan/
├── index.html              # Root entry point (Zen responsive single page app)
├── app.css                 # Serene tea & paper palette, responsive typography
├── app.js                  # Client-side router, hover lexicon, lineage graph, reader views
├── app_data.js             # Generated master bundle (zero-latency execution)
├── schemas/                # Formal data-contract schema
├── docs/                   # Synchronized GitHub Pages deployment directory
│   ├── index.html
│   ├── app.css
│   ├── app.js
│   ├── app_data.js
│   └── data/               # Canonical JSON datasets (mirrored byte-identically by build_data_bundle.py)
├── vision.md               # Grand Vision & Architectural Specification
├── ROADMAP.md              # Project Roadmap & Multi-Phase Tracker
├── README.md               # User documentation & Quickstart guide
├── HANDOFF.md              # This handoff & deployment document
├── data/
│   ├── corpus_manifest.json    # Shared ordered reader/bundle manifest
│   ├── canonical_locators.json # Document/case/unit canonical locator registry
│   ├── project_metrics.json    # Deterministic generated metrics
│   ├── corpus/                 # 36 Canonical Texts in structured JSON
│   │   ├── wumenguan.json              # Gateless Gate (T2005)
│   │   ├── linji_yulu.json             # Record of Linji (T1985)
│   │   ├── huangbo_chuanxin.json       # Transmission of Mind (T2012A)
│   │   ├── huangbo_wanling.json        # Wanling Record (T2012B)
│   │   ├── zhaozhou_yulu.json          # Sayings of Zhaozhou (T1987)
│   │   ├── xinxin_ming.json            # Faith in Mind (T2010)
│   │   ├── baojing_sanmei.json         # Jewel Mirror Samadhi (T1986)
│   │   ├── biyanlu_cases.json          # Blue Cliff Record (T2003)
│   │   ├── congronglu_cases.json       # Book of Serenity (T2004)
│   │   ├── platform_sutra.json         # Platform Sutra (T2007)
│   │   ├── chuandenglu.json            # Jingde Chuandenglu 30 Fascicles (T2076)
│   │   ├── wudeng_huiyuan.json         # Compendium of Five Lamps (X1565)
│   │   ├── qinggui_monastic_codes.json # Baizhang & Chanyuan Qinggui (T2025)
│   │   ├── dongshan_yulu.json          # Five Ranks & Fengqu Verse (T1986)
│   │   ├── yunmen_yulu.json            # Three Phrases & One-Word Barriers (T1988)
│   │   ├── fayan_yulu.json             # Ten Rules & Mind-Only (T1991)
│   │   ├── guiyang_yulu.json           # 96 Circular Figures (T1989)
│   │   ├── dahui_hongzhi.json          # Kanhua Letters & Mozhao Ming (T1998A)
│   │   ├── dahui_shobogenzo.json       # Dahui Shobogenzo Vols 1 & 2 (X1309)
│   │   ├── shitou_sandokai.json        # Sandokai & Grass Hut Song (embedded T2076 / X1565)
│   │   ├── zhengdao_ge.json            # Song of Enlightenment (T2014)
│   │   ├── bodhidharma_erru.json       # Two Entrances & Four Practices (T2009)
│   │   ├── niutou_juezhu.json          # Dunhuang Juezhu Lun (P.2885)
│   │   ├── lidai_fabao_ji.json         # Dunhuang Baotang Record (T2075)
│   │   ├── dazhu_huihai.json           # Sudden Awakening & Faxing (X1223)
│   │   ├── baizhang_guanglu.json       # Three Propositions & Guanglu (X1323)
│   │   ├── foyan_qingyuan.json         # Instant Zen & Rain Sound (X1315)
│   │   ├── mazu_yulu.json              # Ordinary Mind is the Way (X1321)
│   │   ├── nanquan_yulu.json           # Water Buffalo & Peony Flower (X1315)
│   │   ├── deshan_yulu.json            # Thirty Blows & Longtan Candle (embedded T2076 / X1565)
│   │   ├── xuefeng_yantou.json         # Mount Ao Awakening (X1333)
│   │   ├── sengzhao_zhaolun.json       # Zhao Lun: Immutability of Things (T1858)
│   │   ├── hanshan_poems.json          # Cold Mountain Poems (SBCK/Zoku lineage; not Taishō)
│   │   ├── caoxi_zhuan.json            # Dunhuang Caoxi Biezhuan (X1598)
│   │   └── yuanwu_letters.json         # Yuanwu Xinyao Zen Letters (X1357)
│   ├── editorial/
│   │   └── traceability_queue.json     # 33 document-level seed locator reviews
│   ├── lineage/
│   │   ├── masters.json                # 34 profiles (incl. 4 frontier scaffolds)
│   │   ├── lineage_verification.json  # 30 edge records + 4 disclosed frontiers
│   │   └── profile_review_queue.json  # 34 exact-locator profile reviews
│   ├── translations/
│   │   ├── comparative_matrix.json     # 4 exemplar sentence-aligned matrix entries
│   │   ├── provenance.json             # Citation/status policy
│   │   └── rights_manifest.json        # Editorial third-party rights controls
│   ├── glossary/
│   │   └── chan_terms.json             # 31 Classical Chan & Buddhist lexicon terms
│   └── gongan/
│       └── gongan_index.json           # 18 Gong'an cross-references index entries
└── scripts/
    ├── build_data_bundle.py            # Bundles data/ and synchronizes /docs
    ├── ingest_cbeta.py                 # Offline Classical Chinese segmenter (manual input)
    ├── validate_data.py                # Semantic/rights/locator validator + metrics generator
    └── smoke_test.mjs                  # Dependency-free renderer regression test
```

---

## 🛠️ Ongoing Editorial Maintenance Workflow

When new canonical texts or translations are added by editorial contributors:
1. Save the structured JSON file in `data/corpus/<name>.json`, add its display/order entry to `data/corpus_manifest.json`, and add a canonical locator record in `data/canonical_locators.json`. Verified modern quotations also require `source.source_id` plus `source.reference`, resolving to `data/translations/rights_manifest.json`. New lineage links require a source/status record in `data/lineage/lineage_verification.json`.
2. Regenerate and validate deterministic metrics:
   ```bash
   python3 scripts/validate_data.py --write-metrics
   python3 scripts/validate_data.py
   ```
3. Run the automated bundler and renderer regression test:
   ```bash
   python3 scripts/build_data_bundle.py   # updates app_data.js + syncs /docs
   node scripts/smoke_test.mjs
   ```
4. Commit generated metrics/bundle artifacts and push **to the session branch**:
   ```bash
   git add .
   git commit -m "feat: add new canonical text"
   git push origin <session-branch>
   ```

---

*TranslateChan is completely open-source, non-sectarian, and ready for long-term preservation and translation of ancient Chinese Chan literature.*
