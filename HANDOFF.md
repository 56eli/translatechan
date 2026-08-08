# 🤝 TranslateChan: Project Handoff, Pull Request & Deployment Guide

> **Repository**: `56eli/translatechan`  
> **Working Branch**: `arena/019fe05c-translatechan`  
> **Target Branch**: `main`  
> **GitHub Pages URL**: `https://56eli.github.io/translatechan/`

---

## 📋 Executive Summary of Deliverables

The TranslateChan project has been fully established with:
1. **Grand Vision & Architectural Blueprint** ([`vision.md`](./vision.md)): Canonical scope spanning CBETA / Taishō Tripiṭaka Volumes 47, 48, and 51.
2. **Project Roadmap & Milestone Execution Plan** ([`ROADMAP.md`](./ROADMAP.md)): Phased milestones from foundational corpus to living knowledge graph.
3. **Core Canonical Corpus** (`data/corpus/`): 36 canonical works and foundational treatises across Tang, Five Dynasties, Song, and Yuan dynasties.
4. **Master Lineage Knowledge Graph** (`data/lineage/masters.json`): Genealogies, dates, temples, and signature quotes from Bodhidharma and the Six Patriarchs through the Five Houses of Chan (*Linji, Caodong, Yunmen, Guiyang, Fayan*).
5. **Classical Chan Lexicon** (`data/glossary/chan_terms.json`): 150+ technical terms, Sanskrit roots, and philosophical definitions with real-time hover lookup.
6. **Multi-Translator Comparative Matrix** (`data/translations/comparative_matrix.json`): Sentence-by-sentence side-by-side alignment across Red Pine, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, and Philip Yampolsky.
7. **Interactive Zero-Backend Web App & Studio** (`index.html`, `app.css`, `app.js`, `app_data.js`): Responsive, contemplative Zen aesthetic with dark/light mode, full-text search, D3/SVG lineage network graph, and personal translation studio with LaTeX/Markdown export.
8. **Synchronized GitHub Pages Bundle** (`docs/`): Fully compiled, zero-dependency static bundle ready for immediate activation under GitHub Pages.
9. **Arena AI Agent Ingestion Pipeline** (`scripts/arena_agent_pipeline.py`, `scripts/build_data_bundle.py`): Automation harnesses for sandboxed sessioned agents.

---

## 🔀 Merging & GitHub Pull Request Instructions

All work is committed and pushed to `origin arena/019fe05c-translatechan`. To merge into `main`:

### Method 1: Via GitHub Web UI
1. Navigate to: **`https://github.com/56eli/translatechan/pull/new/arena/019fe05c-translatechan`**
2. Title: `feat: establish TranslateChan corpus, comparative matrix, and GitHub Pages web app`
3. Click **Create Pull Request** and then **Merge Pull Request** (Create a merge commit or Squash and merge).

### Method 2: Via GitHub CLI (`gh`) or Git Terminal
```bash
# Check out main branch
git checkout main

# Merge the arena branch
git merge arena/019fe05c-translatechan

# Push to origin main
git push origin main
```

---

## 🌐 Activating GitHub Pages (1-Click Deployment)

Once the branch is merged into `main`:

1. In your repository on GitHub, open **Settings** > **Pages** (left sidebar).
2. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main`.
   - **Folder**: Select `/docs` (or `/ (root)`).
3. Click **Save**.
4. In ~60 seconds, your site will be live at:
   👉 **`https://56eli.github.io/translatechan/`**

---

## 📂 Repository Layout & File Manifest

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
│   │   ├── dahui_shobogenzo.json       # Dahui Shobogenzo Vols 1 & 2 (T2002)
│   │   ├── shitou_sandokai.json        # Sandokai & Grass Hut Song (T1985)
│   │   ├── zhengdao_ge.json            # Song of Enlightenment (T2014)
│   │   ├── bodhidharma_erru.json       # Two Entrances & Four Practices (T2009)
│   │   ├── niutou_juezhu.json          # Dunhuang Juezhu Lun (P.2885)
│   │   ├── lidai_fabao_ji.json         # Dunhuang Baotang Record (T2075)
│   │   ├── dazhu_huihai.json           # Sudden Awakening & Faxing (X1258)
│   │   ├── baizhang_guanglu.json       # Three Propositions & Guanglu (X1304)
│   │   ├── foyan_qingyuan.json         # Instant Zen & Rain Sound (T1995)
│   │   ├── mazu_yulu.json              # Ordinary Mind is the Way (X1304)
│   │   ├── nanquan_yulu.json           # Water Buffalo & Peony Flower (X1315)
│   │   ├── deshan_yulu.json            # Thirty Blows & Longtan Candle (T1985)
│   │   ├── xuefeng_yantou.json         # Mount Ao Awakening (T1983)
│   │   ├── sengzhao_zhaolun.json       # Zhao Lun: Immutability of Things (T1858)
│   │   ├── hanshan_poems.json          # Cold Mountain Poems (T2834)
│   │   ├── caoxi_zhuan.json            # Dunhuang Caoxi Biezhuan (X1458)
│   │   └── yuanwu_letters.json         # Yuanwu Xinyao Zen Letters (X1357)
│   ├── lineage/
│   │   └── masters.json                # Master genealogies, dates, and quotes
│   ├── translations/
│   │   └── comparative_matrix.json     # Sentence-by-sentence multi-translator matrix
│   ├── glossary/
│   │   └── chan_terms.json             # 150+ Classical Chan & Buddhist lexicon
│   └── gongan/
│       └── gongan_index.json           # Gong'an cross-references index
└── scripts/
    ├── build_data_bundle.py            # Bundles data/ and synchronizes /docs
    ├── arena_agent_pipeline.py         # Multi-register Arena AI agent harness
    └── ingest_cbeta.py                 # CBETA text segmentation and tokenizer
```

---

## 🛠️ Ongoing Maintenance & Arena Agent Workflow

When new canonical texts or translations are added by sessioned Arena AI agents:
1. Save the structured JSON file in `data/corpus/<name>.json`.
2. Run the automated bundler:
   ```bash
   python3 scripts/build_data_bundle.py
   ```
3. The script will automatically update `app_data.js` and synchronize all files into `/docs/`.
4. Commit and push:
   ```bash
   git add .
   git commit -m "feat: add new canonical text"
   git push origin <branch>
   ```

---

*TranslateChan is completely open-source, non-sectarian, and ready for long-term preservation and translation of ancient Chinese Chan literature.*
