# 🪷 TranslateChan (`translatechan`)

> **The Classical Chinese Chan/Zen Masters Corpus, Comparative Translation Matrix & Personal Research Studio**  
> *"A special transmission outside the scriptures, not founded upon words and letters; pointing directly to the human mind, seeing into one's nature and attaining Buddhahood."*

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Ready-brightgreen.svg)](https://56eli.github.io/translatechan/)
[![License: MIT / CC-BY-SA](https://img.shields.io/badge/License-MIT%20%2F%20CC--BY--SA-blue.svg)](LICENSE)
[![Canonical Scope: CBETA](https://img.shields.io/badge/Canon-CBETA%20%2F%20Taishō%2047%2C%2048%2C%2051-gold.svg)](https://cbetaonline.dila.edu.tw/)

---

## 🌟 Overview

**TranslateChan** is an open-source, scholarly, and computational initiative created to:
1. **Source and Ingest** the complete classical Chinese Chan (Zen) literature of the ancient masters (*唐宋諸祖語錄與傳燈公案文獻*), referencing canonical CBETA / Taishō Tripiṭaka volumes (T47, T48, T51, and the Zokuzōkyō).
2. **Deploy Sandboxed Arena AI Agents** to autonomously parse Classical Chinese texts, generate multi-register translation drafts (Literal, Hermeneutic, and Poetic Zen Cadence), align contemporary published translations, and commit structured JSON datasets to the repository.
3. **Provide Multi-Translator Comparative Alignment** side-by-side, analyzing historical and contemporary renderings (Red Pine, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, Philip Yampolsky **— now extended with ✅ verified registers from Nyogen Senzaki & Paul Reps, Eiichi Shimomissé, Katsuki Sekida, Kōun Yamada, Robert Aitken, Burton Watson, Yoel Hoffman, Andy Ferguson, Richard B. Clarke**) alongside AI-assisted hermeneutic synthesis.

## ✅ Verified Quotation Campaign (2026-08-08)

Every rendering shown under a scholar's name is labeled: **✅ Verified quotation** (checked verbatim against a specific edition, source recorded) or **⚠️ Register reconstruction** (AI-composed in that scholar's documented style — *not* citable). The pioneering audit and eight verification rounds delivered:

- **119 verified quotation slots across 6 corpus texts + 2 verified comparative-matrix rows** (Wumenguan now 48/48 complete, every case carrying the verified 1934 Senzaki & Reps public-domain register), each with full work/edition/verification provenance in `data/translations/provenance.json` (v2.0).
- **Wumenguan excerpt set is public-domain-complete**: every anchor carries the 1934 Senzaki & Reps *Gateless Gate* text (U.S. public domain via non-renewal) as a guaranteed-citable baseline — six ✅ editions stand side by side on Case 1 (Mu).
- All checks and honest negatives logged in [`AUDIT.md` §8](./AUDIT.md).
4. **Map the Lineage Knowledge Graph** connecting the Six Patriarchs (Bodhidharma → Huineng) and the "Five Houses and Seven Schools" (*五家七宗*: Linji, Caodong, Yunmen, Guiyang, Fayan).
5. **Deploy a Zero-Backend Static GitHub Pages Web App** for personal research, bilingual reading, hover lexicon tooltips, comparative translation matrix, Gong'an index, and a personal translation & annotation studio.

---

## 📚 Core Foundational Corpus (Seed Excerpts)

> **Honest status**: 35 of the 36 corpus files in `data/corpus/` are **excerpt-scale seeds** (Wumenguan is the first **complete text**: 48/48 cases) (≈16,300 Classical Chinese characters total — re-measured 2026-08-08 after Wumenguan 48/48 completion), with authentic CBETA-verified anchor passages — not complete texts. Per-text coverage is tracked in [`AUDIT.md §3`](./AUDIT.md); Phase 2 (see [`ROADMAP.md`](./ROADMAP.md)) drives completion, Wumenguan is now **complete: all 48 cases** (2026-08-08); next up is Biyanlu.

| Text Name (English) | Classical Chinese | CBETA Canon ID | Author / Compiler | Current Coverage |
| :--- | :--- | :--- | :--- | :--- |
| **The Gateless Gate** | 禪宗無門關 | **T2005** (Vol. 48) | Wumen Huikai (無門慧開, 1228 CE) | **48 / 48 cases ✅ complete** (+ preface, epilogue) |
| **The Record of Linji** | 鎮州臨濟慧照禪師語錄 | **T1985** (Vol. 47) | Linji Yixuan / Sansheng Huiran | 4 core sermons incl. 無位真人 |
| **Transmission of Mind** | 黃檗山斷際禪師傳心法要 | **T2012A** (Vol. 48) | Huangbo Xiyun / Pei Xiu (裴休) | Opening sections (One Mind) |
| **Sayings of Zhaozhou** | 趙州真際禪師語錄 | **T1987** (Vol. 47) | Zhaozhou Congshen (趙州從諗) | Signature dialogues (狗子, 洗鉢盂…) |
| **Inscription on Faith in Mind** | 信心銘 | **T2010** (Vol. 48) | Third Patriarch Jianzhi Sengcan | Opening stanzas |
| **Jewel Mirror Samadhi** | 寶鏡三昧歌 | **T1986** (Vol. 47) | Dongshan Liangjie (洞山良价) | Opening stanzas |
| **The Blue Cliff Record** | 佛果圓悟禪師碧巖錄 | **T2003** (Vol. 48) | Xuedou Chongxian / Yuanwu Keqin | 7 / 100 cases |
| **The Platform Sutra** | 六祖大師法寶壇經 | **T2007** (Vol. 48) | Sixth Patriarch Huineng / Fahai | 4 / 10 chapters (incl. 菩提本無樹 verse) |
| **(+ 28 further yulu, treatises & poems)** | — | T/X canon | Mazu, Dongshan, Yunmen, Fayan, Guiyang, Dahui, Hanshan… | Excerpt seeds — see `data/corpus/` |

---

## 🚀 Key Features

### 1. 📖 Interactive Bilingual Reader
- Sentence-by-sentence Classical Chinese with standard Pinyin romanization and English translations across all 36 corpus texts.
- Switchable reading modes: **Bilingual**, **Multi-Translators Side-by-Side**, or **Classical Chinese Only**.
- Hover on key Chan terms (e.g. *本來面目*, *無*, *平常心是道*, *公案*) for immediate popup definitions.
- Client-side search across **all 36 corpus texts and all schema shapes** (case lists, sermons, dialogues, stanzas, chapters), with match counts, `<mark>` highlighting, and jump-to-anchor actions.

### 2. ⚖️ Multi-Translator Comparative Matrix
- Segment-level side-by-side comparison across major 20th and 21st-century renderings (4 exemplar entries today).
- Critical notes examining why renderings differ (e.g., *Mu* vs. *No* vs. *None* vs. *Emptiness*).
- ⚠️ **Sourcing note**: translator-attributed renderings in the seed data are *reconstructions in each scholar's register* unless individually verified against print editions; a verification/labeling pass is tracked in [`AUDIT.md` §3.4](./AUDIT.md).

### 3. 🌳 Lineage Knowledge Graph Explorer
- Chronological and genealogical mapping from Bodhidharma (d. ~532 CE) through the Six Patriarchs, Mazu, Shitou, Baizhang, Huangbo, to the Five Houses — currently **30 master profiles** (seed set), with SVG network graph and clickable dossiers.
- Filter by lineage school, dates, temple location, canonical text reference, and signature quotes.

### 4. 🗂️ Gong'an Cross-Reference Index
- Canonical cases indexed by theme, protagonist, and cross-references across *Wumenguan*, *Biyanlu*, and *Congronglu* — **18 indexed cases** at present.

### 5. 📚 Classical Chan Lexicon
- Dictionary of technical Chan idioms, Buddhist ontology, dialectical structures, and monastic expressions — **31 terms** today, expanding toward 150+ (see Roadmap Phase 3).

### 6. ✍️ Personal Translation & Research Studio
- In-browser translation and annotation editor.
- Automatically persists your translation drafts and study notes in browser storage (`localStorage`).
- One-click export to **JSON** or **Markdown** notebook.

---

## 📂 Repository Structure

```
translatechan/
├── index.html              # GitHub Pages entry point (Fast, zero-backend, responsive SPA)
├── app.css                 # Zen minimalist light/dark styling & typography
├── app.js                  # Client-side routing, search, lexicon popups, and studio engine
├── app_data.js             # Compiled master data bundle for zero-latency client-side search
├── docs/                   # Synchronized duplicate of the app (GitHub Pages serves main /docs)
├── vision.md               # Grand Vision & Architectural Specification
├── ROADMAP.md              # Multi-Phase Project Roadmap & Milestone Tracker
├── AUDIT.md                # Post-merge technical audit + remediation log (2026-08)
├── README.md / HANDOFF.md  # Project documentation / operational guide
├── data/
│   ├── corpus/             # 36 structured canonical-text files (JSON, excerpt-scale → growing)
│   │   ├── wumenguan.json            # + preface/epilogue
│   │   ├── linji_yulu.json
│   │   ├── biyanlu_cases.json
│   │   ├── platform_sutra.json
│   │   └── ... (32 more: yulu, treatises, poems — see data/corpus/)
│   ├── lineage/            # Master genealogies and biographies (30 profiles)
│   │   └── masters.json
│   ├── translations/       # Sentence-aligned comparative translations (4 entries)
│   │   └── comparative_matrix.json
│   ├── glossary/           # Classical Chan & Buddhist lexicon (31 terms)
│   │   └── chan_terms.json
│   └── gongan/             # Gong'an cross-reference catalog (18 cases)
│       └── gongan_index.json
└── scripts/
    ├── build_data_bundle.py   # Compiles data/ into app_data.js + syncs /docs (deterministic)
    ├── arena_agent_pipeline.py# Prompt templates & entry harness for sandboxed agent work
    ├── ingest_cbeta.py        # Offline Classical Chinese sentence segmenter (manual input)
    └── smoke_test.mjs         # Dependency-free regression test (node scripts/smoke_test.mjs)
```

> **Note on deployment automation**: GitHub Pages is served directly from the `main` branch `/docs` folder (native branch publishing — no GitHub Actions workflow is required or present).

---

## 💻 Local Development & Data Compilation

To run locally without any build tools or dependencies:

```bash
# 1. Clone the repository
git clone https://github.com/56eli/translatechan.git
cd translatechan

# 2. Rebuild the data bundle (after modifying files in data/)
python3 scripts/build_data_bundle.py

# 3. Run the regression smoke test after any app.js or data change
node scripts/smoke_test.mjs

# 4. Launch a local preview server
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

---

## 🌐 GitHub Pages Deployment (Live)

✅ **Already active**: Pages publishes from branch **`main`**, folder **`/docs`**, HTTPS enforced.
👉 Live at `https://56eli.github.io/translatechan/`

**Publishing flow for new work** (agent sessions commit to session branches such as `arena/<session>-translatechan`; current: `arena/019fe1b5-translatechan`):
1. On the session branch, run `python3 scripts/build_data_bundle.py` (syncs root + `/docs`) and `node scripts/smoke_test.mjs`.
2. Commit, push the branch, and open a pull request into `main`.
3. On merge, GitHub Pages re-publishes automatically within ~60 seconds.

> The app at root `/` and the `/docs` copy are byte-identical by construction, so the branch could also publish from `/ (root)` if ever preferred.

---

## 📚 Documentation & Reference Guides

- 📜 **Grand Vision & Architectural Blueprint**: [`vision.md`](./vision.md)
- 🗺️ **Roadmap & Milestone Execution Plan**: [`ROADMAP.md`](./ROADMAP.md)
- 🧘 **UX/UI Improvement Roadmap (mobile + desktop, anti-overload)**: [`UX_ROADMAP.md`](./UX_ROADMAP.md)
- 🔍 **Technical Audit & Remediation Log**: [`AUDIT.md`](./AUDIT.md)
- 🤝 **Pull Request & Deployment Handoff Guide**: [`HANDOFF.md`](./HANDOFF.md)

---

## 📜 Canonical References & Acknowledgments

- **CBETA (Chinese Buddhist Electronic Text Association)**: *Taishō Shinshū Daizōkyō* (大正新脩大藏經) & *Shinsan Dainihon Zokuzōkyō* (卍新纂大日本續藏經).
- **Historical Translators**: Red Pine (Bill Porter), Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, Philip Yampolsky.

---

## 📄 License

- Text Corpus & Translations: [Creative Commons Attribution-ShareAlike 4.0 (CC-BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)
- Software & Code: [MIT License](LICENSE)
