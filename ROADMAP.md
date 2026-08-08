# 🗺️ TranslateChan Roadmap & Milestone Execution Plan

This document outlines the detailed engineering, data science, translation, and UI/UX roadmap for **TranslateChan** (`translatechan`). It tracks the active development phases, milestones, technical deliverables, and future iterations.

---

## 🧭 Milestone Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               TranslateChan Milestone Roadmap                          │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┬────────────────┤
│  Phase 1        │  Phase 2        │  Phase 3        │  Phase 4        │  Phase 5 & 6   │
│  Foundation &   │  CBETA Canon    │  Comparative    │  AI Multi-Draft │  Living Canon, │
│  GitHub Pages   │  Ingestion &    │  Matrix &       │  & Translation  │  Academic PWA  │
│  Interactive App│  Lineage Graph  │  Lexicon Engine │  Studio Sync    │  & Community   │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼────────────────┤
│  • vision.md    │  • CBETA T47/48 │  • Cleary,      │  • LLM Prompt   │  • Middle      │
│  • Core App     │  • 48 Cases     │    Sasaki,      │    Pipelines    │    Chinese     │
│  • Lineage Tree │    Wumenguan    │    Suzuki,      │  • Personal     │    Audio       │
│  • 8 Master     │  • 100 Cases    │    Blofeld      │    Drafting     │  • DDB / SAT   │
│    Texts        │    Biyanlu      │  • 500+ Chan    │  • LocalStorage │    Integration │
│  • Glossaries   │  • 30 Fascicles │    Terms        │  • Markdown/JSON│  • Multi-ling  │
│  • Search UI    │    Chuandenglu  │  • Sanskrit IDs │    Export       │    (FR/DE/ES)  │
│  [STATUS: 100%] │  [STATUS: 60%]  │  [STATUS: 85%]  │  [STATUS: 90%]  │  [STATUS: Planned]
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴────────────────┘
```

---

## 📍 Phase 1: Foundation, Architecture & Web App (Completed)

- [x] **Repository Structure & Conventions**:
  - `data/corpus/`: Source canonical Chinese texts with pinyin, English segments, and CBETA metadata.
  - `data/lineage/`: Complete genealogical graph of Chinese Chan masters (Patriarchs, Five Houses, Song masters).
  - `data/translations/`: Sentence-aligned multi-translator comparative datasets.
  - `data/glossary/`: Classical Chan & Buddhist technical terminology lexicon.
  - `data/gongan/`: Master index of classic Gong'an / Koan collections with cross-references.
  - `src/` or `app/`: Production-ready, client-side web application designed for instant GitHub Pages deployment.
- [x] **Interactive Web Application (GitHub Pages)**:
  - Responsive, Zen-minimalist interface with Dark and Light mode themes.
  - Reading font-size controls (`A+` / `A-`) for mobile, tablet, and desktop.
  - Side-by-side bilingual reading view (Classical Chinese with pinyin & English).
  - Multi-Translator Comparison matrix (Red Pine, Cleary, Sasaki, Suzuki, Blyth, Blofeld, Heine, AI Drafts, Personal Workspace).
  - Interactive Chan Lineage Tree visualizer with master bios, dates, and lineage branches.
  - Classical Chan Dictionary / Lexicon hover and search system.
  - Instant client-side full-text search across Classical Chinese and all English translations.
  - Personal Translation Studio allowing users to draft personal translations, save to `localStorage`, and export to JSON, Markdown, or LaTeX.
  - Synchronized `/docs/` deployment bundle and handoff guide in [`HANDOFF.md`](./HANDOFF.md).
- [x] **Core Foundational Texts Included**:
  1. *Wumenguan* (無門關 / The Gateless Gate, T2005 - Cases & Prefaces)
  2. *Linji Yulu* (臨濟語錄 / The Record of Linji, T1985)
  3. *Huangbo Chuanxin Fayao* (黃檗傳心法要 / Essentials of the Transmission of Mind, T2012A)
  4. *Zhaozhou Yulu* (趙州語錄 / Recorded Sayings of Zhaozhou)
  5. *Xinxin Ming* (信心銘 / Inscription on Faith in Mind - Sengcan)
  6. *Baojing Sanmei* (寶鏡三昧 / Jewel Mirror Samadhi - Dongshan)
  7. *Biyanlu* (碧巖錄 / Blue Cliff Record, T2003 - Sample cases & verses)
  8. *Platform Sutra* (六祖壇經 / T2007 - Selected core chapters)

---

## 📍 Phase 2: Complete Canonical Ingestion & Data Structuring (In Progress)

- [x] **Standardized Data Schema**:
  - JSON schema for canonical texts with paragraph/sentence tokens, speaker tags, commentary blocks, and CBETA line references.
- [x] **Ingestion Tooling**:
  - Python scripts (`scripts/ingest_cbeta.py`, `scripts/align_translations.py`) for automated text normalization, traditional-to-simplified mapping, and sentence segmentation.
- [ ] **Full-Text Ingestion Targets**:
  - [x] Wumenguan (Complete 48 Cases)
  - [ ] Biyanlu (All 100 Cases + Pointers + Verses + Commentaries)
  - [ ] Congronglu / Book of Serenity (All 100 Cases)
  - [ ] Jingde Chuandenglu (Complete 30 Fascicles, ~1,700 masters)
  - [ ] Baizhang Qinggui & Chanyuan Qinggui (Monastic codes)
  - [ ] Zhaozhou Yulu (Complete 500+ Dialogues)
  - [ ] Dongshan Yulu & Caoshan Yulu (Caodong Five Ranks complete texts)
  - [ ] Yunmen Yulu & Fayan Yulu

---

## 📍 Phase 3: Multi-Translator Comparative Engine & Critical Lexicon

- [x] **Multi-Translator Alignment**:
  - Sentence-by-sentence alignment format storing historical translations side-by-side with source Chinese.
  - Integrated historical translators:
    - **Red Pine (Bill Porter)** (Hermit hermeneutics, lyrical fidelity, Dunhuang & woodblock collation)
    - **Thomas Cleary** (Precision, Taoist/Buddhist cross-synthesizing)
    - **Ruth Fuller Sasaki** (First Soto/Rinzai scholarly standard)
    - **D.T. Suzuki** (Early Western pioneer & philosophical depth)
    - **R.H. Blyth** (Poetic, comparative world literature)
    - **John Blofeld** (Huangbo & Zen Mind translations)
    - **Steven Heine** (Modern hermeneutic & lineage analysis)
- [x] **Classical Chan Lexicon**:
  - 150+ foundational technical terms defined with Sanskrit equivalents, literal meanings, and Chan philosophical contexts.
  - Interactive hover tooltips embedded directly in the Chinese reader text.
- [ ] **Expansion to 1,000+ Classical Terms**:
  - Tang/Song vernacular particles (*這箇*, *遮裏*, *生盲*, *沒弦琴*, *泥牛入海*).
  - Technical monastic titles (*首座*, *維那*, *侍者*, *典座*, *方丈*).
  - Gong'an idioms (*野狐禪*, *磨磚作鏡*, *一口吸盡西江水*, *騎驢覓驢*).

---

## 📍 Phase 4: AI Multi-Draft Translation Pipeline & Personal Studio

- [x] **AI Translation Pipeline & Arena AI Agent Integration**:
  - Sandboxed Arena AI agent sessions perform classical Chinese extraction, sentence segmentation, and term alignment.
  - Multi-register draft generation:
    - Mode 1: *Literal & Philological* (Preserves Chinese syntactic structure and particles).
    - Mode 2: *Philosophical & Hermeneutic* (Expands Mahayana & Chan technical concepts).
    - Mode 3: *Poetic & Zen Cadence* (Short, sharp, enigmatic cadence matching the original encounter dialogues).
  - Contemporary published translation collation (Red Pine, Cleary, Sasaki, Suzuki, Blyth, Blofeld, Heine).
- [x] **Personal Translation Workspace**:
  - Inline editing of any sentence or case.
  - Personal commentary and study notes editor.
  - Local browser persistence via `localStorage`.
  - Export personal translations as standard JSON or structured Markdown.
- [ ] **Automated GitHub Integration**:
  - Webhook or direct GitHub PR generation from personal translation work.
  - Community translation diff viewer.

---

## 📍 Phase 5: Phonetics, Middle Chinese & Multilingual Global Canon

- [ ] **Phonetic & Chanting Modules**:
  - Middle Chinese reconstructions (Baxter-Sagart and Karlgren phonetic notation).
  - Modern Mandarin Pinyin and Sino-Japanese Kanbun / On'yomi readings for traditional chanting.
- [ ] **Multilingual Translations**:
  - European translations (French: Paul Demiéville, Catherine Despeux; German: Heinrich Dumoulin; Spanish, Italian).
  - Modern Japanese scholarly editions (Iriya Yoshitaka, Yanagida Seizan).

---

## 📍 Phase 6: Living Knowledge Graph & Academic Community

- [ ] **Graph Database & Visual Navigation**:
  - D3.js / WebGL dynamic lineage graph visualization.
  - Search by teacher-student lineage path (e.g. Bodhidharma → ... → Mazu → Baizhang → Huangbo → Linji).
  - Gong'an cross-reference network (which masters commented on which ancient cases).
- [ ] **Integration with Universal Buddhist Resources**:
  - Direct deep-links to CBETA Online, SAT Daizōkyō, and Digital Dictionary of Buddhism (DDB).
  - TEI-XML P5 compliance export for academic libraries.

---

## 🛠️ Tech Stack & Directory Structure

```
translatechan/
├── index.html              # GitHub Pages entry point (Fast, zero-backend, responsive SPA)
├── vision.md               # Grand Vision & Architectural Blueprint
├── ROADMAP.md              # Project Roadmap & Milestone Tracker
├── README.md               # Project Readme & Getting Started Guide
├── data/
│   ├── corpus/             # Structured Canonical Texts (JSON & Markdown)
│   │   ├── wumenguan.json
│   │   ├── linji_yulu.json
│   │   ├── huangbo_chuanxin.json
│   │   ├── zhaozhou_yulu.json
│   │   ├── xinxin_ming.json
│   │   ├── baojing_sanmei.json
│   │   ├── biyanlu_cases.json
│   │   └── platform_sutra.json
│   ├── lineage/            # Lineage Graph & Master Biographies
│   │   ├── masters.json
│   │   └── schools.json
│   ├── translations/       # Sentence-aligned Comparative Translations
│   │   └── comparative_matrix.json
│   ├── glossary/           # Classical Chan & Buddhist Lexicon
│   │   └── chan_terms.json
│   └── gongan/             # Gong'an Case Cross-Reference Index
│       └── gongan_index.json
├── scripts/                # Ingestion, validation & parsing tools
│   ├── ingest_cbeta.py
│   ├── build_data_bundle.py
│   └── align_translations.py
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions automated Pages deployment
```
