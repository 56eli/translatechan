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
│  • vision.md    │  • Plot CBETA   │  • Cleary,      │  • LLM Prompt   │  • Middle      │
│  • Core App     │    T47/48 text  │    Sasaki,      │    Templates    │    Chinese     │
│  • 36 Text      │  • 48 Cases     │    Suzuki,      │    (staged)     │    Audio       │
│    Excerpt Seeds│    Wumenguan    │    Blofeld      │  • Personal     │  • DDB / SAT   │
│    (11/48 cases)│  • 7/100 Biyanlu│  • 31/150+ Chan │    Drafting     │    Integration │
│  • 18 Master    │  • Chuandenglu  │    Terms        │  • LocalStorage │  • Multi-ling  │
│    Profiles     │    architecture │  • 4 Matrix     │  • Markdown/JSON│    (FR/DE/ES)  │
│  • Search UI    │    only         │    Entries      │    Export       │                │
│  • Smoke Test   │  [STATUS: ~10%] │  [STATUS: ~20%] │  [STATUS: ~60%] │  [STATUS: Planned]
│  [STATUS: 100%✓│                 │                 │                 │                │
│   repaired 8/26]│                 │                 │                 │                │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴────────────────┘
```

> Statuses above are **measured** (see [`AUDIT.md`](./AUDIT.md) §3), not aspirational. Percentages estimate real content coverage against each phase's stated targets.
>
> **Attribution-integrity milestone (2026-08-08)**: provenance policy live (`data/translations/provenance.json` v1.9, UI badges ✅/⚠️); **79 verified quotation slots across 6 corpus texts + 2 verified matrix rows**, with the full provenance log in [`AUDIT.md` §8](./AUDIT.md). Phase-3 matrix curation now proceeds on a verified-only basis for scholarly citation.

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
  - Instant client-side search across **all 36 texts and every schema shape** (counts + highlighting + jump-to-anchor — landed 2026-08-08, [`AUDIT.md` §8](./AUDIT.md)).
  - Personal Translation Studio allowing users to draft personal translations, save to `localStorage`, and export to JSON, Markdown, or LaTeX.
  - Synchronized `/docs/` deployment bundle and handoff guide in [`HANDOFF.md`](./HANDOFF.md).
- [x] **Core Foundational Text Seeds** (36 files; authentic anchor passages, excerpt-scale — completion is Phase 2; canon IDs audited against CBETA 2026-08-08):
  1. *Wumenguan* (無門關 / The Gateless Gate, T2005 — preface, epilogue + 11/48 cases)
  2. *Linji Yulu* (臨濟語錄 / The Record of Linji, T1985 — 4 core sermons)
  3. *Huangbo Chuanxin Fayao* (黃檗傳心法要 / T2012A — opening sections)
  4. *Zhaozhou Yulu* (趙州語錄 / recorded-saying extracts)
  5. *Xinxin Ming* (信心銘 / opening stanzas)
  6. *Baojing Sanmei* (寶鏡三昧 / opening stanzas)
  7. *Biyanlu* (碧巖錄 / Blue Cliff Record, T2003 — 7/100 cases)
  8. *Platform Sutra* (六祖壇經 / T2007 — 4/10 chapters)
  9. *+28 further yulu, treatises & poems* (Mazu, Nanquan, Dongshan + Five Ranks, Yunmen, Fayan, Guiyang, Dahui, Hongzhi, Shitou, Hanshan, Sengzhao, monastic codes, Dunhuang texts…)

---

## 📍 Phase 2: Complete Canonical Ingestion & Data Structuring (In Progress)

- [x] **Standardized Data Schema**:
  - JSON schema for canonical texts with paragraph/sentence tokens, speaker tags, commentary blocks, and CBETA line references.
- [x] **Ingestion Tooling (seed level)**:
  - `scripts/ingest_cbeta.py` — offline punctuation-based Classical Chinese sentence segmenter (manual input; no live CBETA fetching yet).
  - `scripts/build_data_bundle.py` — deterministic bundle compiler + `/docs` sync.
  - `scripts/smoke_test.mjs` — regression test exercising every corpus text through the renderer.
- [ ] **Ingestion Tooling (to build)**:
  - Real CBETA source fetching/normalization (Kanripo API or CBETA TEI download).
  - `scripts/align_translations.py` — sentence-level translation alignment (not yet written).
- [ ] **Full-Text Ingestion Targets**:
  - [~] Wumenguan (**11 / 48 cases** — completion is the next data milestone)
  - [~] Biyanlu (**7 / 100 cases**)
  - [ ] Congronglu / Book of Serenity (All 100 Cases)
  - [ ] Jingde Chuandenglu (Complete 30 Fascicles, ~1,700 masters)
  - [ ] Baizhang Qinggui & Chanyuan Qinggui (Monastic codes)
  - [ ] Zhaozhou Yulu (Complete 500+ Dialogues)
  - [ ] Dongshan Yulu & Caoshan Yulu (Caodong Five Ranks complete texts)
  - [ ] Yunmen Yulu & Fayan Yulu

---

## 📍 Phase 3: Multi-Translator Comparative Engine & Critical Lexicon

- [~] **Multi-Translator Alignment** (format complete; **4 exemplar entries** populated):
  - Sentence-by-sentence alignment format storing historical translations side-by-side with source Chinese.
  - Target translator roster (register exemplars seeded; verbatim verification pending — [`AUDIT.md` §3.4](./AUDIT.md)):
    - **Red Pine (Bill Porter)** (Hermit hermeneutics, lyrical fidelity, Dunhuang & woodblock collation)
    - **Thomas Cleary** (Precision, Taoist/Buddhist cross-synthesizing)
    - **Ruth Fuller Sasaki** (First Soto/Rinzai scholarly standard)
    - **D.T. Suzuki** (Early Western pioneer & philosophical depth)
    - **R.H. Blyth** (Poetic, comparative world literature)
    - **John Blofeld** (Huangbo & Zen Mind translations)
    - **Steven Heine** (Modern hermeneutic & lineage analysis)
- [~] **Classical Chan Lexicon** (**31 / 150+ foundational terms** — growing):
  - Terms defined with Sanskrit equivalents, literal meanings, and Chan philosophical contexts.
  - Interactive hover tooltips embedded directly in the Chinese reader text.
  - ⚠️ Translator-attributed renderings are seed reconstructions pending verification — see [`AUDIT.md` §3.4](./AUDIT.md).
- [ ] **Expansion to 150+, then 1,000 Classical Terms**:
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
├── app.css / app.js / app_data.js
├── docs/                   # Byte-identical Pages copy (served from main /docs)
├── vision.md               # Grand Vision & Architectural Blueprint
├── ROADMAP.md              # Project Roadmap & Milestone Tracker
├── README.md / HANDOFF.md / AUDIT.md
├── data/
│   ├── corpus/             # 36 structured canonical-text files (JSON, excerpt-scale → growing)
│   ├── lineage/            # masters.json (18 profiles; schools.json planned)
│   ├── translations/       # comparative_matrix.json (4 entries)
│   ├── glossary/           # chan_terms.json (31 terms)
│   └── gongan/             # gongan_index.json (18 cases)
└── scripts/                # Ingestion, validation & parsing tools
    ├── ingest_cbeta.py        # Offline segmenter (manual input)
    ├── build_data_bundle.py   # Deterministic bundle + /docs sync
    ├── arena_agent_pipeline.py# Agent prompt templates & entry harness
    ├── smoke_test.mjs         # Dependency-free renderer regression test
    └── align_translations.py  # (planned — not yet written)
```

> Deployment is native GitHub Pages branch publishing (`main` + `/docs`) — no Actions workflow needed.
