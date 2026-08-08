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
3. **Provide Multi-Translator Comparative Alignment** side-by-side, analyzing historical and contemporary renderings (Red Pine, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, Philip Yampolsky) alongside AI-assisted hermeneutic synthesis.
4. **Map the Lineage Knowledge Graph** connecting the Six Patriarchs (Bodhidharma → Huineng) and the "Five Houses and Seven Schools" (*五家七宗*: Linji, Caodong, Yunmen, Guiyang, Fayan).
5. **Deploy a Zero-Backend Static GitHub Pages Web App** for personal research, bilingual reading, hover lexicon tooltips, comparative translation matrix, Gong'an index, and a personal translation & annotation studio.

---

## 📚 Core Foundational Corpus Included

| Text Name (English) | Classical Chinese | CBETA Canon ID | Author / Compiler | Genre |
| :--- | :--- | :--- | :--- | :--- |
| **The Gateless Gate** | 禪宗無門關 | **T2005** (Vol. 48) | Wumen Huikai (無門慧開, 1228 CE) | Gong'an Collection (48 Cases) |
| **The Record of Linji** | 鎮州臨濟慧照禪師語錄 | **T1985** (Vol. 47) | Linji Yixuan / Sansheng Huiran | Recorded Sayings (語錄) |
| **Transmission of Mind** | 黃檗山斷際禪師傳心法要 | **T2012A** (Vol. 48) | Huangbo Xiyun / Pei Xiu (裴休) | Mind Essentials (傳心法要) |
| **Sayings of Zhaozhou** | 趙州真際禪師語錄 | **T1987** (Vol. 47) | Zhaozhou Congshen (趙州從諗) | Encounter Dialogues (機鋒) |
| **Inscription on Faith in Mind** | 信心銘 | **T2010** (Vol. 48) | Third Patriarch Jianzhi Sengcan | Mind Inscription (心銘) |
| **Jewel Mirror Samadhi** | 寶鏡三昧歌 | **T1986** (Vol. 47) | Dongshan Liangjie (洞山良价) | Caodong Samadhi Poem (五位) |
| **The Blue Cliff Record** | 佛果圓悟禪師碧巖錄 | **T2003** (Vol. 48) | Xuedou Chongxian / Yuanwu Keqin | Gong'an & Verses (評唱) |
| **The Platform Sutra** | 六祖大師法寶壇經 | **T2007** (Vol. 48) | Sixth Patriarch Huineng / Fahai | Foundational Scripture (壇經) |

---

## 🚀 Key Features

### 1. 📖 Interactive Bilingual Reader
- Sentence-by-sentence Classical Chinese with standard Pinyin romanization and English translations.
- Switchable reading modes: **Bilingual**, **Multi-Translators Side-by-Side**, or **Classical Chinese Only**.
- Hover on key Chan terms (e.g. *本來面目*, *祖師西來意*, *無*, *棒喝*, *平常心是道*, *四料簡*, *默照*) for immediate popup definitions and Sanskrit roots.

### 2. ⚖️ Multi-Translator Comparative Matrix
- Segment-level side-by-side comparison across major 20th and 21st-century scholars.
- Critical notes examining why translators rendered terms differently (e.g., *Mu* vs. *No* vs. *None* vs. *Emptiness*).

### 3. 🌳 Lineage Knowledge Graph Explorer
- Chronological and genealogical mapping from Bodhidharma (d. ~532 CE) through the Six Patriarchs, Mazu, Shitou, Baizhang, Huangbo, to the Five Houses.
- Filter by lineage school, dates, temple location, canonical text reference, and signature quotes.

### 4. 🗂️ Gong'an Cross-Reference Index
- Canonical cases indexed by theme, protagonist, and cross-references across *Wumenguan*, *Biyanlu*, and *Congronglu*.

### 5. 📚 Classical Chan Lexicon
- Rich dictionary of technical Chan idioms, Buddhist ontology, dialectical structures, and monastic expressions.

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
├── vision.md               # Grand Vision & Architectural Specification
├── ROADMAP.md              # Multi-Phase Project Roadmap & Milestone Tracker
├── README.md               # Project documentation
├── data/
│   ├── corpus/             # Structured canonical texts (JSON)
│   │   ├── wumenguan.json
│   │   ├── linji_yulu.json
│   │   ├── huangbo_chuanxin.json
│   │   ├── zhaozhou_yulu.json
│   │   ├── xinxin_ming.json
│   │   ├── baojing_sanmei.json
│   │   ├── biyanlu_cases.json
│   │   └── platform_sutra.json
│   ├── lineage/            # Master genealogies and biographies
│   │   └── masters.json
│   ├── translations/       # Sentence-aligned comparative translations
│   │   └── comparative_matrix.json
│   ├── glossary/           # Classical Chan & Buddhist lexicon
│   │   └── chan_terms.json
│   └── gongan/             # Gong'an cross-reference catalog
│       └── gongan_index.json
├── scripts/
│   ├── build_data_bundle.py # Compiles data/ into app_data.js
│   └── ingest_cbeta.py     # Ingests and segments raw Classical Chinese CBETA texts
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions automated Pages deployment
```

---

## 💻 Local Development & Data Compilation

To run locally without any build tools or dependencies:

```bash
# 1. Clone the repository
git clone https://github.com/56eli/translatechan.git
cd translatechan

# 2. Rebuild the data bundle (if modifying files in data/)
python3 scripts/build_data_bundle.py

# 3. Launch a local preview server
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

---

## 🌐 Deploying to GitHub Pages

This project is structured for zero-backend, instant deployment on GitHub Pages through any of the following standard options:

### Option 1: Deploy from `/docs` folder on `main` (Recommended & Ready)
1. Merge the `arena/019fe05c-translatechan` branch into `main`.
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Set Branch to **`main`** and folder to **`/docs`**, then click **Save**.
5. Your site is live immediately at `https://56eli.github.io/translatechan/`!

### Option 2: Deploy from `root /` on `main`
- Under **Settings** > **Pages** > **Source**, choose Branch **`main`** and folder **`/ (root)`**.

### Option 3: Automated Continuous Ingestion via Arena AI Agents
- Sandboxed Arena AI agents run ingestion scripts (`scripts/arena_agent_pipeline.py` and `scripts/build_data_bundle.py`), updating canonical JSON files and compiling `app_data.js` directly to both root and `/docs` on every push.

---

## 📜 Canonical References & Acknowledgments

- **CBETA (Chinese Buddhist Electronic Text Association)**: *Taishō Shinshū Daizōkyō* (大正新脩大藏經) & *Shinsan Dainihon Zokuzōkyō* (卍新纂大日本續藏經).
- **Historical Translators**: Red Pine (Bill Porter), Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, Philip Yampolsky.

---

## 📄 License

- Text Corpus & Translations: [Creative Commons Attribution-ShareAlike 4.0 (CC-BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)
- Software & Code: [MIT License](LICENSE)
