# 🪷 TranslateChan (`translatechan`)

> **The Classical Chinese Chan/Zen Masters Corpus, Comparative Translation Matrix & Research Reader**
> *"A special transmission outside the scriptures, not founded upon words and letters; pointing directly to the human mind, seeing into one's nature and attaining Buddhahood."*

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Ready-brightgreen.svg)](https://56eli.github.io/translatechan/)
[![License: MIT / CC-BY-SA](https://img.shields.io/badge/License-MIT%20%2F%20CC--BY--SA-blue.svg)](LICENSE)
[![Canonical Scope: CBETA](https://img.shields.io/badge/Canon-CBETA%20%2F%20Taishō%2047%2C%2048%2C%2051-gold.svg)](https://cbetaonline.dila.edu.tw/)

---

## 🌟 Overview

**TranslateChan** is an open-source, scholarly, and computational initiative created to:
1. **Source and Ingest** the complete classical Chinese Chan (Zen) literature of the ancient masters (*唐宋諸祖語錄與傳燈公案文獻*), referencing canonical CBETA / Taishō Tripiṭaka volumes (T47, T48, T51, and the Zokuzōkyō).
2. **Maintain a source-aware editorial workflow** for Classical Chinese parsing, multi-register project drafts, published-translation collation, and structured provenance data — with every AI-derived rendering disclosed as such.
3. **Provide Multi-Translator Comparative Alignment** side-by-side, analyzing historical and contemporary renderings (Red Pine, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, Philip Yampolsky **— now extended with ✅ verified registers from Nyogen Senzaki & Paul Reps, Eiichi Shimomissé, Katsuki Sekida, Kōun Yamada, Robert Aitken, Burton Watson, Yoel Hoffman, Andy Ferguson, Richard B. Clarke**) alongside AI-assisted hermeneutic synthesis.

## ✅ Verified Quotation Campaign (2026-08-08)

Every visible translation register in the Reader and Comparative Matrix carries a **✅ Verified quotation**, **⚠️ AI register reconstruction**, or **🤖 AI draft** badge. Every translation disclosure also quotes its aligned original Chinese and shows the canonical source locator/status. A verified item exposes its recorded edition and verification details; a register reconstruction is newly written project text using broad style characteristics associated with a scholar, **not** copied from, checked against, or attributable as wording in that scholar's work, and is *not* citable. The verification campaign delivered:

- **138 verified quotation slots across 7 corpus texts + 2 verified comparative-matrix entries** (Wumenguan now 48/48 complete, every case carrying the verified 1934 Senzaki & Reps public-domain register). Corpus and Matrix verified items carry work/edition/verification fields plus a rights-manifest source identifier under provenance policy v2.2.
- **Wumenguan excerpt set is public-domain-complete**: every anchor carries the 1934 Senzaki & Reps *Gateless Gate* text (U.S. public domain via non-renewal) as a guaranteed-citable baseline — six ✅ editions stand side by side on Case 1 (Mu).
- All checks and honest negatives logged in [`sessions/AUDIT_archive_2026-08-08.md` §8](./sessions/AUDIT_archive_2026-08-08.md).
4. **Map the Lineage Knowledge Graph** connecting the Six Patriarchs (Bodhidharma → Huineng) and the "Five Houses and Seven Schools" (*五家七宗*: Linji, Caodong, Yunmen, Guiyang, Fayan).
5. **Deploy a Zero-Backend Static GitHub Pages Web App** for focused bilingual reading, hover lexicon tooltips, comparative translation, lineage study, and Gong'an indexing.

---

## 📚 Core Foundational Corpus (Seed Excerpts)

> **Honest status**: 35 of the 36 corpus files in `data/corpus/` are **excerpt-scale seeds** — Wumenguan is the first **complete text** (48/48 cases), and the Biyanlu is **COMPLETE at 100/100 cases** (pointer, 本則, pre-verse 評唱, 頌). The generated metrics report **96,327 source-content CJK characters** (or 100,864 across every corpus JSON string, including metadata) — not complete texts. Per-text coverage facts (zh-character counts, unit counts, and machine-checkable coverage strings like `100/100 cases`) are emitted deterministically into `data/project_metrics.json → corpus.per_text` by `scripts/validate_data.py --write-metrics`; the validator also verifies any per-file `zh_chars`/`coverage_note` metadata it finds. Historical context is tracked in [`sessions/AUDIT_archive_2026-08-08.md` §10](./sessions/AUDIT_archive_2026-08-08.md#10-2026-08-08--current-independent-audit-post-pr-3); Phase 2 (see [`ROADMAP.md`](./ROADMAP.md)) drives completion, Wumenguan is complete and Biyanlu is complete (100/100).

| Text Name (English) | Classical Chinese | CBETA Canon ID | Author / Compiler | Current Coverage |
| :--- | :--- | :--- | :--- | :--- |
| **The Gateless Gate** | 禪宗無門關 | **T2005** (Vol. 48) | Wumen Huikai (無門慧開, 1228 CE) | **48 / 48 cases ✅ complete** (+ preface, epilogue) |
| **The Record of Linji** | 鎮州臨濟慧照禪師語錄 | **T1985** (Vol. 47) | Linji Yixuan / Sansheng Huiran | 4 core sermons incl. 無位真人 |
| **Transmission of Mind** | 黃檗山斷際禪師傳心法要 | **T2012A** (Vol. 48) | Huangbo Xiyun / Pei Xiu (裴休) | Opening sections (One Mind) |
| **Sayings of Zhaozhou** | 趙州真際禪師語錄 | **T1987** (Vol. 47) | Zhaozhou Congshen (趙州從諗) | Signature dialogues (狗子, 洗鉢盂…) |
| **Inscription on Faith in Mind** | 信心銘 | **T2010** (Vol. 48) | Third Patriarch Jianzhi Sengcan | Opening stanzas |
| **Jewel Mirror Samadhi** | 寶鏡三昧歌 | **T1986** (Vol. 47) | Dongshan Liangjie (洞山良价) | Opening stanzas |
| **The Blue Cliff Record** | 佛果圓悟禪師碧巖錄 | **T2003** (Vol. 48) | Xuedou Chongxian / Yuanwu Keqin | **100 / 100 cases ✅ complete** |
| **The Platform Sutra** | 六祖大師法寶壇經 | **T2007** (Vol. 48) | Sixth Patriarch Huineng / Fahai | 4 / 10 chapters (incl. 菩提本無樹 verse) |
| **(+ 28 further yulu, treatises & poems)** | — | T/X canon | Mazu, Dongshan, Yunmen, Fayan, Guiyang, Dahui, Hanshan… | Excerpt seeds — see `data/corpus/` |

---

## 🚀 Key Features

### 1. 📖 Interactive Bilingual Reader
- Sentence-by-sentence Classical Chinese with standard Pinyin romanization and English translations across all 36 corpus texts.
- Switchable reading modes: **Bilingual**, **Multi-Translators Side-by-Side**, or **Classical Chinese Only**.
- Hover, focus, or tap key Chan terms (e.g. *本來面目*, *無*, *平常心是道*, *公案*) for immediate popup definitions.
- Visible canonical source locations for every reader document/case, plus a **validator-derived coverage disclosure** (`48/48 cases`, `100/100 cases`, or `Excerpt seed (N units)` with a full coverage note) so excerpts are never mistaken for complete texts; reviewed unit-level source disclosures for the Linji (4 sections) and Xinxin Ming (7 stanzas) pilots; hover/focus/touch popups state locator granularity, collation status, and pending human review honestly.
- Client-side search across **all 36 corpus texts and all schema shapes** (case lists, sermons, dialogues, stanzas, chapters), with match counts, `<mark>` highlighting, and jump-to-anchor actions.

### 2. ⚖️ Multi-Translator Comparative Matrix
- Segment-level side-by-side comparison across major 20th and 21st-century renderings (4 exemplar entries today).
- Each displayed translation discloses translator, status, book/edition, page-or-section reference state, verification, and rights identifier through visible lines plus hover/focus/touch citation popups.
- Critical notes examine why renderings differ (e.g., *Mu* vs. *No* vs. *None* vs. *Emptiness*).
- ⚠️ **Sourcing note**: translator-attributed renderings in the seed data are *reconstructions in each scholar's register* unless individually verified against print editions; AI drafts/reconstructions are visibly marked and never presented as book quotations.

### 3. 🌳 Lineage Knowledge Graph Explorer
- Chronological and genealogical mapping from Bodhidharma (d. ~532 CE) through the Six Patriarchs, Mazu, Shitou, Baizhang, Huangbo, to the Five Houses — currently **34 master profiles** (30 researched seed profiles + 4 explicitly marked frontier scaffolds), with an SVG network graph and clickable dossiers.
- A visible chart-status disclosure distinguishes traditional links awaiting exact locators from future source-verified links; graph edges open source-chart/record details on click or keyboard activation.
- Filter by lineage school, dates, temple location, canonical text reference, and signature quotes.

### 4. 🗂️ Gong'an Cross-Reference Index
- Canonical cases indexed by theme, protagonist, and cross-references across *Wumenguan*, *Biyanlu*, and *Congronglu* — **24 indexed cases** at present (incl. 5 new Biyanlu entries, 2026-08-08), organized into **7 curated theme groups** (Buddha-Nature, Beyond Duality, What is Buddha, Direct Pointing, Everyday Way, Transmission & Causality, Existential Barrier) from the validator-enforced taxonomy in `data/gongan/theme_vocabulary.json`; cards keep a rich per-case theme descriptor while filter chips group by family.

### 5. 📚 Classical Chan Lexicon
- Dictionary of technical Chan idioms, Buddhist ontology, dialectical structures, and monastic expressions — **31 terms** today, expanding toward 150+ (see Roadmap Phase 3).

---

## 🧭 Public Pages Scope

The public GitHub Pages app intentionally contains the **Bilingual Reader**, **Comparative Matrix**, **Lineage Tree**, **Gong'an Index**, and **Chan Lexicon** only. The Translation Studio, Arena AI Agents view, and header GitHub link are not part of the public interface. AI-derived content that remains in the corpus/matrix is disclosed by its visible status badge and provenance record.

---

## 📂 Repository Structure

```
translatechan/
├── index.html              # GitHub Pages entry point (Fast, zero-backend, responsive SPA)
├── theme-init.js           # Pre-paint persisted-theme bootstrap (dark-mode FOUC guard)
├── app.css                 # Zen minimalist light/dark styling & typography
├── app.js                  # Client-side routing, search, lexicon popups, and reader views
├── app_data.js             # Generated master data bundle for zero-latency client-side search
├── robots.txt / sitemap.xml# Crawler policy + sitemap (mirrored into docs/)
├── package.json + lock     # Optional Playwright browser-test devDependency only
├── schemas/                # Formal JSON Schema companion to semantic validation
├── docs/                   # Synchronized duplicate of the app (GitHub Pages serves main /docs)
├── vision.md               # Grand Vision & Architectural Specification
├── ROADMAP.md              # Multi-Phase Project Roadmap & Milestone Tracker
├── RESEARCH_RELEASE_PLAN.md # Evidence-first corpus, rights, lineage & release plan
├── AUDIT.md                # Current-state audit summary + session index (durable history in sessions/)
├── sessions/               # Dated session audit reports + historical audit archive (append-only)
├── README.md / HANDOFF.md  # Project documentation / operational guide
├── response_summary.md     # Live working summary of the current session (overwritten per session)
├── data/
│   ├── corpus_manifest.json    # Shared corpus order/navigation manifest (36 keys)
│   ├── canonical_locators.json # Document/case/unit source-locator registry
│   ├── project_metrics.json    # Deterministic, validator-generated project counts
│   ├── corpus/                 # 36 structured canonical-text files (JSON, excerpt-scale → growing)
│   │   ├── wumenguan.json            # + preface/epilogue
│   │   ├── linji_yulu.json
│   │   ├── biyanlu_cases.json
│   │   ├── platform_sutra.json
│   │   └── ... (32 more: yulu, treatises, poems — see data/corpus/)
│   ├── editorial/          # Enforced document-level source-locator migration queue (33 seeds)
│   │   └── traceability_queue.json
│   ├── lineage/            # 34 profiles (30 seed profiles + 4 explicit frontier scaffolds)
│   │   ├── masters.json
│   │   ├── school_vocabulary.json   # Controlled school_key/display/color vocabulary (validator-enforced)
│   │   ├── lineage_verification.json  # 30 internal-edge + 4 frontier source-status records
│   │   └── profile_review_queue.json  # Enforced exact-locator review queue (34 profiles)
│   ├── translations/       # Comparative data, provenance, and rights controls
│   │   ├── comparative_matrix.json
│   │   ├── provenance.json
│   │   └── rights_manifest.json
│   ├── glossary/           # Classical Chan & Buddhist lexicon (31 terms)
│   │   └── chan_terms.json
│   └── gongan/             # Gong'an cross-reference catalog (24 cases)
│       ├── gongan_index.json
│       └── theme_vocabulary.json # Validator-enforced 7-group theme taxonomy
└── scripts/
    ├── build_data_bundle.py   # Compiles data/ into app_data.js + syncs /docs (deterministic)
    ├── arena_agent_pipeline.py# Prompt templates & entry harness for sandboxed agent work
    ├── segment_classical.py   # Offline Classical Chinese sentence segmenter (manual input)
    ├── ingest_cbeta.py        # Deprecated compatibility wrapper → segment_classical.py
    ├── migrate_translations.py# One-time bare-string → {text,status} record migration (reference)
    ├── validate_data.py       # Schema/semantic/rights/locator validator + metrics generator
    ├── smoke_test.mjs         # Dependency-free renderer regression test (CI gate)
    └── browser_test.mjs       # Optional Playwright real-browser suite (desktop + mobile; not in CI)
```

> **Note on deployment automation**: GitHub Pages is served directly from the `main` branch `/docs` folder (native branch publishing). The checked-in GitHub Actions **Quality** workflow verifies Python syntax, source data/metrics, deterministic generated artifacts, deploy synchronization, and the reader smoke test on pushes and pull requests; it does not deploy Pages.

---

## 💻 Local Development & Data Compilation

To run locally without any build tools or dependencies:

```bash
# 1. Clone the repository
git clone https://github.com/56eli/translatechan.git
cd translatechan

# 2. After modifying source data, regenerate and verify deterministic metrics
python3 scripts/validate_data.py --write-metrics
python3 scripts/validate_data.py
#    (also enforces doc truthfulness: README/HANDOFF/ROADMAP.md/AUDIT.md §1/
#     index.html must quote live metrics — pass --skip-docs only while
#     intentionally editing the prose)

# 3. Rebuild the bundle (also syncs root assets and docs/)
python3 scripts/build_data_bundle.py

# 4. Run the dependency-free renderer regression suite
node scripts/smoke_test.mjs

# 5. (Optional) Run the real-browser Playwright suite (desktop + mobile)
npm install                    # devDependency: playwright
npx playwright install chromium  # once per machine; `install-deps` on Linux if needed
npm run test:browser           # skips gracefully when no Chromium is available

# 6. Launch a local preview server
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

---

## 🌐 GitHub Pages Deployment (Live)

✅ **Already active**: Pages publishes from branch **`main`**, folder **`/docs`**, HTTPS enforced.
👉 Live at `https://56eli.github.io/translatechan/`

**Publishing flow for new work** (agent sessions commit to branches such as `arena/<session>-translatechan`):
1. On the session branch, run `python3 scripts/validate_data.py`, `python3 scripts/build_data_bundle.py` (syncs root + `/docs`), and `node scripts/smoke_test.mjs`.
2. Commit generated metrics/bundle artifacts with the source change, push the branch, and open a pull request into `main`.
3. On merge, GitHub Pages re-publishes automatically within ~60 seconds.

> The app at root `/` and the `/docs` copy are byte-identical by construction, so the branch could also publish from `/ (root)` if ever preferred.

---

## 📚 Documentation & Reference Guides

- 📜 **Grand Vision & Architectural Blueprint**: [`vision.md`](./vision.md)
- 🗺️ **Roadmap & Milestone Execution Plan**: [`ROADMAP.md`](./ROADMAP.md)
- 🧘 **UX/UI Improvement Roadmap (mobile + desktop, anti-overload)**: [`UX_ROADMAP.md`](./UX_ROADMAP.md)
- 🔍 **Technical Audit & Remediation Log**: [`AUDIT.md`](./AUDIT.md)
- 🤝 **Pull Request & Deployment Handoff Guide**: [`HANDOFF.md`](./HANDOFF.md)
- 🎯 **Evidence-First Research Release Plan**: [`RESEARCH_RELEASE_PLAN.md`](./RESEARCH_RELEASE_PLAN.md)

---

## 📜 Canonical References & Acknowledgments

- **CBETA (Chinese Buddhist Electronic Text Association)**: *Taishō Shinshū Daizōkyō* (大正新脩大藏經) & *Shinsan Dainihon Zokuzōkyō* (卍新纂大日本續藏經).
- **Historical Translators**: Red Pine (Bill Porter), Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, Philip Yampolsky.

---

## 📄 License

- Text Corpus & Translations: [Creative Commons Attribution-ShareAlike 4.0 (CC-BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)
- Software & Code: [MIT License](LICENSE)
