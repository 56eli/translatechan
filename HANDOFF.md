# 🤝 TranslateChan: Project Handoff, Pull Request & Deployment Guide

> **Repository**: `56eli/translatechan`  
> **Working Branch**: agent sessions work on session branches (e.g. `arena/019fe05c-translatechan` → merged as PR #1; current: `arena/019fe108-translatechan`)  
> **Target Branch**: `main`  
> **GitHub Pages URL**: `https://56eli.github.io/translatechan/` (**live**: branch `main`, folder `/docs`)

---

## 📋 Executive Summary of Deliverables

The TranslateChan project has been fully established with:
1. **Grand Vision & Architectural Blueprint** ([`vision.md`](./vision.md)): Canonical scope spanning CBETA / Taishō Tripiṭaka Volumes 47, 48, and 51.
2. **Project Roadmap & Milestone Execution Plan** ([`ROADMAP.md`](./ROADMAP.md)): Phased milestones from foundational corpus to living knowledge graph (statuses measured, not aspirational).
3. **Core Canonical Corpus Seeds** (`data/corpus/`): 36 excerpt-scale canonical works and foundational treatises across Tang, Five Dynasties, Song, and Yuan dynasties (authentic anchor passages; completion tracked in [`ROADMAP.md` Phase 2](./ROADMAP.md)).
4. **Master Lineage Knowledge Graph** (`data/lineage/masters.json`): 30 master profiles with genealogies, dates, temples, and signature quotes from Bodhidharma and the Six Patriarchs through the Five Houses of Chan (expanded 2026-08-08: Nanyue Huairang, Qingyuan Xingsi, Nanquan, Yaoshan, Yunyan, Deshan, Xuefeng, Xuansha, Luohan Guichen, Baiyun Shouduan, Wuzu Fayan, Yuelin Shiguan).
5. **Classical Chan Lexicon** (`data/glossary/chan_terms.json`): 31 technical terms (growing toward 150+), Sanskrit roots, and philosophical definitions with real-time hover lookup.
6. **Multi-Translator Comparative Matrix** (`data/translations/comparative_matrix.json`): 4 exemplar sentence-aligned entries in the registers of Red Pine, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, and Philip Yampolsky — **2 rows now carry ✅ verified quotations** (Senzaki & Reps PD; Blyth per Hokuseido 1966), others labeled honestly (see sourcing note in [`AUDIT.md` §3.4](./AUDIT.md)).
7. **Interactive Zero-Backend Web App & Studio** (`index.html`, `app.css`, `app.js`, `app_data.js`): Responsive, contemplative Zen aesthetic with dark/light mode, search, SVG lineage network graph, and personal translation studio with LaTeX/Markdown export. *(Fatal parse bug shipped in PR #1 was repaired 2026-08-08 — see [`AUDIT.md` §8](./AUDIT.md); `node scripts/smoke_test.mjs` must pass before every push.)*
8. **Synchronized GitHub Pages Bundle** (`docs/`): Fully compiled, zero-dependency static bundle; Pages publishing already active from `main /docs`.
9. **Agent Pipeline & Tooling** (`scripts/`): `arena_agent_pipeline.py` prompt templates, `build_data_bundle.py` deterministic bundler, `ingest_cbeta.py` offline segmenter, `smoke_test.mjs` regression test.

---

## 📍 Session Delta Since PR #1 (all on `arena/019fe108-translatechan`, 2026-08-08)

15 commits ready for `main`. One-sentence map (full detail in [`AUDIT.md` §8](./AUDIT.md)):

1. **`37b263a`** Post-PR#1 full project audit → [`AUDIT.md`](./AUDIT.md) (P0 found: app wouldn't even parse).
2. **`2a160c6`** P0 repair: fatal `app.js` syntax error + 6 runtime crashes; new `scripts/smoke_test.mjs` regression harness.
3. **`84a59eb`** Docs-truth pass: measured statuses, `LICENSE` (MIT + CC BY-SA 4.0 + third-party notice), `.nojekyll`, phantom refs purged.
4. **`5405a60`** Attribution-integrity: `provenance.json` provenance policy + ✅/⚠️ badges in the UI + mis-cited canon IDs fixed.
5. **`5c35834`** Universal search (all 36 texts × all schemas), true reader modes, single-pass clean tooltips, Studio builds from the data bundle.
6. **`7dbfec0`–`934b7ef` (7 commits)** Verified-quotation campaign rounds 1–8 → **79 verified slots across 6 corpus texts + 2 verified matrix rows**; six ✅ editions on Wumenguan Case 1; Wumenguan anchors now public-domain complete (Senzaki & Reps 1934); `provenance.json` v1.9. Highlights: first-ever honest ✅/⚠️ labels on every scholar-attributed rendering; 4 paraphrases/near-paraphrases caught and replaced with verified wording; 1 non-canonical Chinese stanza corrected to T2010.

**Release readiness**: `scripts/smoke_test.mjs` ✅ · deterministic bundle ✅ · `/docs` byte-synced ✅ · live site will self-heal on merge (Pages serves `main` `/docs`).

---

## 🔀 Merging & GitHub Pull Request Instructions

Session work is committed and pushed to the session branch (currently `origin arena/019fe108-translatechan`). To merge into `main`:

### Method 1: Via GitHub Web UI
1. Navigate to: **`https://github.com/56eli/translatechan/pull/new/arena/019fe108-translatechan`** (substitute the current session branch).
2. Give the PR a descriptive title (conventional-commit style preferred), click **Create Pull Request**, then **Merge Pull Request**.

### Method 2: Via GitHub CLI (`gh`) — from the session branch
```bash
# Agent sessions must stay on their own branch; open the PR from there:
gh pr create --base main --head arena/019fe108-translatechan --title "..." --body "..."
# Merging is performed by the repository owner (or via `gh pr merge`).
```

---

## 🌐 GitHub Pages Status (Already Active)

✅ Pages is **already enabled**: `Deploy from a branch` → `main` + `/docs`, HTTPS enforced.
On every merge into `main`, the site re-publishes automatically within ~60 seconds.
👉 **`https://56eli.github.io/translatechan/`**

> **Release checklist before opening any PR affect­ing the app**: `python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs` must pass, `cmp app.js docs/app.js` (etc.) must show root/docs in sync, and `diff -rq data docs/data` must be silent (data mirror).

---

## 📂 Repository Layout & File Manifest

> Corpus file descriptions below name the **canonical work and its scope**; current file contents are excerpt-scale seeds (see [`AUDIT.md` §3](./AUDIT.md) for measured coverage).

```
translatechan/
├── index.html              # Root entry point (Zen responsive single page app)
├── app.css                 # Serene tea & paper palette, responsive typography
├── app.js                  # Client-side router, hover lexicon, lineage graph, studio
├── app_data.js             # Compiled master bundle (420 KB, zero-latency execution)
├── docs/                   # Synchronized GitHub Pages deployment directory
│   ├── index.html
│   ├── app.css
│   ├── app.js
│   ├── app_data.js
│   └── data/               # Canonical JSON datasets
├── vision.md               # Grand Vision & Architectural Specification
├── ROADMAP.md              # Project Roadmap & Multi-Phase Tracker
├── README.md               # User documentation & Quickstart guide
├── HANDOFF.md              # This handoff & deployment document
├── data/
│   ├── corpus/             # 36 Canonical Texts in structured JSON
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
│   │   ├── shitou_sandokai.json        # Sandokai & Grass Hut Song (T1985)
│   │   ├── zhengdao_ge.json            # Song of Enlightenment (T2014)
│   │   ├── bodhidharma_erru.json       # Two Entrances & Four Practices (T2009)
│   │   ├── niutou_juezhu.json          # Dunhuang Juezhu Lun (P.2885)
│   │   ├── lidai_fabao_ji.json         # Dunhuang Baotang Record (T2075)
│   │   ├── dazhu_huihai.json           # Sudden Awakening & Faxing (X1223)
│   │   ├── baizhang_guanglu.json       # Three Propositions & Guanglu (X1323)
│   │   ├── foyan_qingyuan.json         # Instant Zen & Rain Sound (X1315)
│   │   ├── mazu_yulu.json              # Ordinary Mind is the Way (X1321)
│   │   ├── nanquan_yulu.json           # Water Buffalo & Peony Flower (X1315)
│   │   ├── deshan_yulu.json            # Thirty Blows & Longtan Candle (T1985)
│   │   ├── xuefeng_yantou.json         # Mount Ao Awakening (X1333)
│   │   ├── sengzhao_zhaolun.json       # Zhao Lun: Immutability of Things (T1858)
│   │   ├── hanshan_poems.json          # Cold Mountain Poems (T2834)
│   │   ├── caoxi_zhuan.json            # Dunhuang Caoxi Biezhuan (X1598)
│   │   └── yuanwu_letters.json         # Yuanwu Xinyao Zen Letters (X1357)
│   ├── lineage/
│   │   └── masters.json                # 30 master profiles: genealogies, dates, quotes
│   ├── translations/
│   │   └── comparative_matrix.json     # 4 exemplar sentence-aligned matrix entries
│   ├── glossary/
│   │   └── chan_terms.json             # 31 Classical Chan & Buddhist lexicon terms
│   └── gongan/
│       └── gongan_index.json           # 18 Gong'an cross-references index entries
└── scripts/
    ├── build_data_bundle.py            # Bundles data/ and synchronizes /docs
    ├── arena_agent_pipeline.py         # Multi-register Arena AI agent harness
    ├── ingest_cbeta.py                 # Offline Classical Chinese segmenter (manual input)
    └── smoke_test.mjs                  # Dependency-free renderer regression test
```

---

## 🛠️ Ongoing Maintenance & Arena Agent Workflow

When new canonical texts or translations are added by sessioned Arena AI agents:
1. Save the structured JSON file in `data/corpus/<name>.json` (declare any new key in `build_data_bundle.py`'s corpus list **and** `app.js`'s `corpusMap`).
2. Run the automated bundler:
   ```bash
   python3 scripts/build_data_bundle.py   # updates app_data.js + syncs /docs
   ```
3. Run the renderer regression test and confirm zero crashes:
   ```bash
   node scripts/smoke_test.mjs
   ```
4. Commit and push **to the session branch**:
   ```bash
   git add .
   git commit -m "feat: add new canonical text"
   git push origin <session-branch>
   ```

---

*TranslateChan is completely open-source, non-sectarian, and ready for long-term preservation and translation of ancient Chinese Chan literature.*
