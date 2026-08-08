# 🗺️ TranslateChan Roadmap & Milestone Execution Plan

This document outlines the detailed engineering, data science, translation, and UI/UX roadmap for **TranslateChan** (`translatechan`). It tracks the active development phases, milestones, technical deliverables, and future iterations.

---

## 🧭 Milestone Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               TranslateChan Milestone Roadmap                          │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┬────────────────┤
│  Phase 1        │  Phase 2        │  Phase 3        │  Phase 4        │  Phase 5 & 6   │
│  Foundation &   │  Canon Ingestion│  Comparative    │  Source          │  Living Canon, │
│  Public Reader  │  & Data         │  Matrix &       │  Verification &  │  Phonetics &   │
│                 │  Structure      │  Lexicon        │  Disclosure      │  Community     │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼────────────────┤
│  • Public reader│  • 48/48        │  • 4 Matrix     │  • Primary text │  • Middle      │
│    + matrix +   │    Wumenguan    │    entries       │    aggregation   │    Chinese     │
│    lineage +    │  • 7/100        │  • 31/150+      │  • Book/edition │  • DDB / SAT   │
│    index +      │    Biyanlu      │    Chan terms    │    verification  │  • Multi-ling  │
│    lexicon      │  • 36 manifests │  • Status/rights │  • Hover/focus  │    / lineage   │
│  • Smoke test   │    + locators   │    disclosure    │    citations     │    verification│
│  [STATUS: 100%] │  [STATUS: ~30%] │  [STATUS: ~20%] │  [STATUS: ~40%] │  [Planned]     │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴────────────────┘
```

> Statuses above are **measured** (see [`AUDIT.md`](./AUDIT.md) §3), not aspirational. Percentages estimate real content coverage against each phase's stated targets.
>
> **Attribution-integrity milestone (2026-08-08)**: provenance policy v2.2 is live (`data/translations/provenance.json`, explicit Reader/Matrix badges ✅/⚠️/🤖); **138 verified corpus quotation slots across 6 texts + 2 verified Matrix entries** (Wumenguan 48/48 complete, 2026-08-08). Every verified source resolves through `rights_manifest.json`; Phase-3 curation proceeds on a provenance-first, rights-aware basis.

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
  - Multi-Translator Comparison matrix with explicit scholar, verified-quotation, reconstruction, and AI-draft disclosure.
  - Interactive Chan Lineage Tree visualizer with master bios, dates, and lineage branches.
  - Classical Chan Dictionary / Lexicon hover and search system.
  - Instant client-side search across **all 36 texts and primary schema shapes**, including case pointers (accurate matching-unit counts, highlighting, and jump-to-anchor — [`AUDIT.md` §10](./AUDIT.md#10-2026-08-08--current-independent-audit-post-pr-3)).
  - **UX/UI improvement roadmap implemented (Phases A–D, 2026-08-08)** — calm reader (case strip, collapsible cards, shared tap/focus popover, persisted preferences, debounced search), mobile-first navigation (corpus picker, bottom action bar, single-column translations), deep polish (print/PDF, hash routing, lineage pan/zoom, WCAG-AA a11y), performance (cached search index, lazy case rendering). See [`UX_ROADMAP.md`](./UX_ROADMAP.md).
  - Synchronized `/docs/` deployment bundle and handoff guide in [`HANDOFF.md`](./HANDOFF.md).
- [x] **Core Foundational Text Seeds** (36 files; authentic anchor passages, excerpt-scale — completion is Phase 2; canon IDs audited against CBETA 2026-08-08):
  1. *Wumenguan* (無門關 / The Gateless Gate, T2005 — **48/48 cases COMPLETE** + preface + epilogue, 2026-08-08)
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

- [x] **Data Contract & Release Guardrails**:
  - Heterogeneous JSON shapes for cases, sections, dialogues, stanzas, chapters, five ranks, and sample records are supported by the renderer and described in [`schemas/translatechan-data.schema.json`](./schemas/translatechan-data.schema.json).
  - `scripts/validate_data.py` enforces semantic invariants, shared corpus-manifest integrity, translation provenance, rights-manifest coverage, case-level locator coverage, and deterministic metrics; a CI workflow is prepared locally and awaits workflow-capable GitHub access before publication.
  - `data/canonical_locators.json` now covers every document and all 57 current case units. The 33 non-case seed documents remain honestly tagged `legacy_document_seed` until page/line or TEI locators are migrated.
- [x] **Ingestion Tooling (seed level)**:
  - `scripts/ingest_cbeta.py` — offline punctuation-based Classical Chinese sentence segmenter (manual input; no live CBETA fetching yet).
  - `scripts/validate_data.py` — dependency-free schema/semantic/rights/locator validation + metrics generation.
  - `scripts/build_data_bundle.py` — manifest-driven bundle compiler + `/docs` sync.
  - `scripts/smoke_test.mjs` — regression test exercising every corpus text through the renderer.
- [ ] **Ingestion Tooling (to build)**:
  - Real CBETA source fetching/normalization (Kanripo API or CBETA TEI download).
  - `scripts/align_translations.py` — sentence-level translation alignment (not yet written).
- [ ] **Full-Text Ingestion Targets**:
  - [x] Wumenguan (**48 / 48 cases** — completed 2026-08-08; every case carries the verified Senzaki & Reps 1934 public-domain register)
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

## 📍 Phase 4: Source Verification, Disclosure & Editorial Workflow

> **Public Pages scope:** the published GitHub Pages app is a reader, comparative matrix, lineage explorer, gong'an index, and lexicon. The Translation Studio, Arena AI Agents view, and header GitHub link are deliberately removed from the public navigation. Editorial/AI-assisted work may exist in repository data, but it is never presented as a public product feature or as a human scholar’s voice.

- [~] **Source aggregation & verification**:
  - Aggregate Classical Chinese text from a recorded primary source (CBETA/TEI, Taishō, Zokuzōkyō, or named manuscript/edition), retaining canonical ID plus a locator appropriate to the source (case, fascicle, page/line, or TEI anchor).
  - Verify source text against that recorded source before display; do not upgrade a seed excerpt to “verified” merely because it is widely mirrored online.
  - Verify published translations against the named **book/edition**, translator, and page or stable section reference. A web mirror may assist wording comparison but never substitutes for bibliographic provenance or rights review.
- [~] **Content disclosure contract**:
  - ✅ The public Reader and Matrix now render canonical source locations plus hover/focus/touch citation popups. Until a page/line or TEI locator exists, they show an honest `Locator pending`/document-level status rather than implying unit-level collation.
  - ✅ Every displayed translation now renders translator, status, book/edition, page/section reference state, verification status, and citation/rights identifier. Current metrics record 17 explicit references and 123 honest `Page/section locator pending` records; replacing those pending values is a blocking editorial task, not a silent omission.
  - ✅ Every AI-produced or AI-reconstructed item is visibly marked **AI draft** or **register reconstruction**; it never appears as a verified quotation or a scholar’s verbatim translation.
  - ✅ Citation/source badges are available by hover, keyboard focus, and touch popup in Reader and Matrix; future public surfaces must use the same component.
- [ ] **Editorial review queue**:
  - Upgrade the 33 `legacy_document_seed` locator records to page/line or TEI anchors.
  - Complete human rights/editorial review for each modern-translation source in `rights_manifest.json` before broader quotation reuse.

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

- [~] **Lineage chart aggregation & verification**:
  - Aggregate lineage relationships from named lineage charts, canonical transmission records, and scholarly reference works; preserve each node/edge source, edition, locator, and confidence/status.
  - Verify the public SVG lineage tree against the aggregated chart records before release; flag disputed, legendary, and frontier relationships rather than drawing them as settled fact.
  - Give every public node and edge a hover/focus/touch citation popup showing source chart/record, date/edition, and verification state.
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
├── schemas/                # Formal source-data contract
├── docs/                   # Byte-identical Pages copy (served from main /docs)
├── vision.md               # Grand Vision & Architectural Blueprint
├── ROADMAP.md              # Project Roadmap & Milestone Tracker
├── README.md / HANDOFF.md / AUDIT.md
├── data/
│   ├── corpus_manifest.json    # Shared reader/bundle ordering manifest
│   ├── canonical_locators.json # Document/case source-locator registry
│   ├── project_metrics.json    # Deterministic generated project counts
│   ├── corpus/                 # 36 structured canonical-text files (JSON, excerpt-scale → growing)
│   ├── lineage/                # masters.json (30 profiles; schools.json planned)
│   ├── translations/           # matrix, provenance, and rights manifest
│   ├── glossary/           # chan_terms.json (31 terms)
│   └── gongan/             # gongan_index.json (18 cases)
└── scripts/                # Ingestion, validation & parsing tools
    ├── ingest_cbeta.py        # Offline segmenter (manual input)
    ├── validate_data.py       # Semantic/rights/locator validator + metrics generator
    ├── build_data_bundle.py   # Manifest-driven deterministic bundle + /docs sync
    ├── arena_agent_pipeline.py# Agent prompt templates & entry harness
    ├── smoke_test.mjs         # Dependency-free renderer regression test
    └── align_translations.py  # (planned — not yet written)
```

> Deployment is native GitHub Pages branch publishing (`main` + `/docs`). The prepared GitHub Actions quality workflow does not deploy Pages and awaits workflow-capable GitHub access before publication.
