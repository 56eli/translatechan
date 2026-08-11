# 🗺️ Fake Chan Factory Roadmap & Milestone Execution Plan

This document outlines the detailed engineering, data science, translation, and UI/UX roadmap for **Fake Chan Factory** (`translatechan`). It tracks the active development phases, milestones, technical deliverables, and future iterations.

---

## 🧭 Milestone Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               Fake Chan Factory Milestone Roadmap                          │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┬────────────────┤
│  Phase 1        │  Phase 2        │  Phase 3        │  Phase 4        │  Phase 5 & 6   │
│  Foundation &   │  Canon Ingestion│  Comparative    │  Source          │  Living Canon, │
│  Public Reader  │  & Data         │  Matrix &       │  Verification &  │  Phonetics &   │
│                 │  Structure      │  Lexicon        │  Disclosure      │  Community     │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼────────────────┤
│  • Public reader│  • 48/48        │  • 4 Matrix     │  • Primary text │  • Middle      │
│    + matrix +   │    Wumenguan    │    entries       │    aggregation   │    Chinese     │
│    lineage +    │  • 100/100 rec.│  • 31/150+      │  • Book/edition │  • DDB / SAT   │
│    index +      │    Biyanlu part.│    Chan terms    │    verification  │  • Multi-ling  │
│    lexicon      │  • 35 manifests │  • Status/rights │  • Hover/focus  │    / lineage   │
│  • Smoke test   │    + locators   │    disclosure    │    citations     │    verification│
│  [STATUS: 100%] │  [STATUS: ~30%] │  [STATUS: ~20%] │  [STATUS: ~40%] │  [Planned]     │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴────────────────┘
```

> Statuses above are **measured** (see [`sessions/AUDIT_archive_2026-08-08.md`](./sessions/AUDIT_archive_2026-08-08.md) §3), not aspirational. Percentages estimate real content coverage against each phase's stated targets.
>
> **Attribution-integrity milestone (2026-08-08)**: provenance policy v2.2 is live (`data/translations/provenance.json`, explicit Reader/Matrix badges ✅/⚠️/🤖); **177 verified corpus quotation slots across 10 texts + 2 verified Matrix entries** (Wumenguan 48/48 complete, 2026-08-08). Every verified source resolves through `rights_manifest.json`; Phase-3 curation proceeds on a provenance-first, rights-aware basis.

> **Website-design status (2026-08-11):** all five walnut rooms are implemented. After the owner found the result too plain/generic and too Chinese-dominant, the current branch introduced a bolder English-first factory/editorial hierarchy and three progressive copy-cleanup passes. PR #18 merged with green main Quality and Pages deployment; real-browser screenshots and accessibility evidence remain unavailable. See [`sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md`](./sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md).

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
  - Structural dark-walnut shell with English-first room navigation, a literature-first bilingual Reader, light/dark themes, and progressive disclosure (PR #18 merged; browser evidence pending).
  - Reading font-size controls (`A+` / `A-`) for mobile, tablet, and desktop.
  - Side-by-side bilingual reading view (Classical Chinese with pinyin & English).
  - Multi-Translator Comparison matrix with explicit scholar, verified-quotation, reconstruction, and AI-draft disclosure.
  - Interactive Chan Lineage Tree visualizer with master bios, dates, and lineage branches.
  - Classical Chan Dictionary / Lexicon hover and search system.
  - Instant client-side search across **all 35 active texts and primary schema shapes**, including case pointers (accurate matching-unit counts, highlighting, and jump-to-anchor — [`sessions/AUDIT_archive_2026-08-08.md` §10](./sessions/AUDIT_archive_2026-08-08.md#10-2026-08-08--current-independent-audit-post-pr-3)).
  - **Functional UX and five-room design implemented; English-first refinement merged (2026-08-11):** current work addresses owner feedback on generic styling, Chinese-dominant hierarchy, and repetitive copy; screenshot/accessibility evidence remains. See [`UX_ROADMAP.md`](./UX_ROADMAP.md) and the [current audit](./sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md).
  - Synchronized `/docs/` deployment bundle and handoff guide in [`HANDOFF.md`](./HANDOFF.md).
- [x] **Core Foundational Corpus** (35 active files after the 2026-08-10 Congronglu quarantine; editorial completion status is explicit in the manifest):
  1. *Wumenguan* (無門關 / The Gateless Gate, T2005 — **48/48 cases COMPLETE** + preface + epilogue, 2026-08-08)
  2. *Linji Yulu* (臨濟語錄 / T1985 — 74 recorded sections; partial selected witness)
  3. *Huangbo Chuanxin Fayao* (黃檗傳心法要 / T2012A — opening sections)
  4. *Zhaozhou Yulu* (趙州語錄 / recorded-saying extracts)
  5. *Xinxin Ming* (信心銘 / T2010 — 37/37 stanzas, complete selected witness)
  6. *Baojing Sanmei* (寶鏡三昧 / opening stanzas)
  7. *Biyanlu* (碧巖錄 / T2003 — **100/100 case records represented; partial selected witness**)
  8. *Platform Sutra* (六祖壇經 / T2007 — 10/10 chapter headings represented by selected excerpts; not complete)
  9. *+27 further yulu, treatises & poems* (Mazu, Nanquan, Dongshan + Five Ranks, Yunmen, Fayan, Guiyang, Dahui, Hongzhi, Shitou, Hanshan, Sengzhao, monastic codes, Dunhuang texts…)

---

## 📍 Phase 2: Complete Canonical Ingestion & Data Structuring (In Progress)

- [x] **Data Contract & Release Guardrails**:
  - Heterogeneous JSON shapes for cases, sections, dialogues, stanzas, chapters, five ranks, and sample records are supported by the renderer and described in [`schemas/translatechan-data.schema.json`](./schemas/translatechan-data.schema.json).
  - `scripts/validate_data.py` enforces semantic invariants, shared corpus-manifest integrity, translation provenance, rights-manifest coverage, case-level locator coverage, and deterministic metrics; `.github/workflows/quality.yml` runs Python compilation, data validation, deterministic artifact checks, deploy-mirror verification, and reader smoke coverage on pushes and pull requests.
  - `data/canonical_locators.json` covers all 35 active documents and 148 case records (48 Wumenguan + 100 Biyanlu). Thirty-three non-case documents remain at document granularity; Linji and Xinxin include limited unit-locator pilots. The quarantined Congronglu locator claims were removed after authoritative T48n2004 headings disproved their case numbering/page claims. `data/editorial/traceability_queue.json` tracks the 33 document-level migrations.
  - `data/lineage/lineage_verification.json` aggregates all 30 in-set graph links and 4 unprofiled frontiers with source-record status; `data/lineage/profile_review_queue.json` tracks all 34 profiles (1 in review, 29 awaiting exact locators, 4 frontier-source tasks). The public chart never renders a link as source-verified until exact locators are reviewed.
- [x] **Ingestion Tooling (seed level)**:
  - `scripts/segment_classical.py` — offline punctuation-based Classical Chinese sentence segmenter (manual input; no live CBETA fetching yet). `scripts/ingest_cbeta.py` remains as a deprecated compatibility wrapper.
  - `scripts/validate_data.py` — dependency-free schema/semantic/rights/locator validation + metrics generation.
  - `scripts/build_data_bundle.py` — manifest-driven bundle compiler + `/docs` sync.
  - `scripts/smoke_test.mjs` — regression test exercising every corpus text through the renderer.
- [ ] **Ingestion Tooling (to build)**:
  - Real CBETA source fetching/normalization (Kanripo API or CBETA TEI download).
  - `scripts/align_translations.py` — sentence-level translation alignment (not yet written).
- [ ] **Full-Text Ingestion Targets**:
  - [x] Wumenguan (**48 / 48 cases** — completed 2026-08-08; every case carries the verified Senzaki & Reps 1934 public-domain register)
  - [~] Biyanlu (**100 / 100 case records represented; partial selected witness** — post-verse commentary and human collation sign-off remain pending; N/N representation is not full-work completion)
  - [~] Linji Yulu (**74 recorded sections** — selected-witness completeness and full unit-level verification remain pending)
  - [!] Congronglu / Book of Serenity — **quarantined 2026-08-10** after generated source-looking placeholders and wrong case-number/page claims were found; reintroduce only from authoritative T48n2004 TEI with field-level collation tests
  - [ ] Jingde Chuandenglu (Complete 30 Fascicles, ~1,700 masters)
  - [ ] Baizhang Qinggui & Chanyuan Qinggui (Monastic codes)
  - [ ] Zhaozhou Yulu (Complete 500+ Dialogues)
  - [ ] Dongshan Yulu & Caoshan Yulu (Caodong Five Ranks complete texts)
  - [ ] Yunmen Yulu & Fayan Yulu

---

## 📍 Phase 3: Multi-Translator Comparative Engine & Critical Lexicon

- [~] **Multi-Translator Alignment** (format complete; **4 exemplar entries** populated):
  - Sentence-by-sentence alignment format storing historical translations side-by-side with source Chinese.
  - Target translator roster (register exemplars seeded; verbatim verification pending — [`sessions/AUDIT_archive_2026-08-08.md` §3.4](./sessions/AUDIT_archive_2026-08-08.md)):
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
  - ⚠️ Translator-attributed renderings are seed reconstructions pending verification — see [`sessions/AUDIT_archive_2026-08-08.md` §3.4](./sessions/AUDIT_archive_2026-08-08.md).
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
  - ✅ Every displayed translation now renders translator, status, book/edition, page/section reference state, verification status, and citation/rights identifier. Current metrics record 135 recorded case/page/section references and 5 honest `Page/section locator pending` records; replacing those pending values is a blocking editorial task, not a silent omission.
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
│   ├── corpus/                 # 35 active structured source files (complete/partial/excerpt)
│   ├── editorial/               # traceability_queue.json (33 source-locator reviews)
│   ├── lineage/                # masters.json + verification + profile_review_queue (30 links / 4 frontiers)
│   ├── translations/           # matrix, provenance, and rights manifest
│   ├── glossary/           # chan_terms.json (31 terms)
│   └── gongan/             # gongan_index.json (23 cases)
└── scripts/                # Ingestion, validation & parsing tools
    ├── segment_classical.py # Offline segmenter (manual input)
    ├── validate_data.py       # Semantic/rights/locator validator + metrics generator
    ├── build_data_bundle.py   # Manifest-driven deterministic bundle + /docs sync
    ├── arena_agent_pipeline.py# Agent prompt templates & entry harness
    ├── smoke_test.mjs         # Dependency-free renderer regression test
    └── align_translations.py  # (planned — not yet written)
```

> Deployment is native GitHub Pages branch publishing (`main` + `/docs`). The GitHub Actions Quality workflow verifies repository quality only; it does not deploy Pages.
