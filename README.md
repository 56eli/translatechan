# 🤖 Fake Chan Factory (`translatechan`)

> **A proudly-fake AI translation factory robolating Chan/Zen translator registers over source-tracked Classical Chinese excerpts.**
> *"A special transmission outside the scriptures, not founded upon words and letters; pointing directly to the human mind, seeing into one's nature and attaining Buddhahood."*

> ⚠️ **What this actually is.** The public app is **Fake Chan Factory**: most English renderings are **🤖 Robo** versions — AI text written in a famous translator's register, **not** their words and not citable as their work. Active Classical Chinese records are tied to named CBETA/Taishō witnesses and editorial status; the 2026-08-10 containment pass removed the uncollated Congronglu seed after finding generated source-looking placeholders. A **✅ Edition-verified quotation** badge means wording was checked against the recorded edition; rights/public-domain status is separate in its citation record. (Internal `translatechan` identifiers remain for continuity.)

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Ready-brightgreen.svg)](https://56eli.github.io/translatechan/)
[![License: MIT / CC-BY-SA](https://img.shields.io/badge/License-MIT%20%2F%20CC--BY--SA-blue.svg)](LICENSE)
[![Canonical Scope: CBETA](https://img.shields.io/badge/Canon-CBETA%20%2F%20Taishō%2047%2C%2048%2C%2051-gold.svg)](https://cbetaonline.dila.edu.tw/)

---

## 🌟 Overview

**Fake Chan Factory** is an open-source, computational, and *playfully honest* initiative created to:
1. **Source and Ingest** the complete classical Chinese Chan (Zen) literature of the ancient masters (*唐宋諸祖語錄與傳燈公案文獻*), referencing canonical CBETA / Taishō Tripiṭaka volumes (T47, T48, T51, and the Zokuzōkyō).
2. **Maintain a source-aware editorial workflow** for Classical Chinese parsing, multi-register project drafts, published-translation collation, and structured provenance data — with every AI-derived rendering disclosed as such.
3. **Provide Multi-Translator Comparative Alignment** side-by-side, analyzing historical and contemporary renderings (Red Pine, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, Philip Yampolsky **— now extended with ✅ verified registers from Nyogen Senzaki & Paul Reps, Eiichi Shimomissé, Katsuki Sekida, Kōun Yamada, Robert Aitken, Burton Watson, Yoel Hoffman, Andy Ferguson, Richard B. Clarke**) alongside AI-assisted hermeneutic synthesis.
4. **Map the Lineage Knowledge Graph** connecting the Six Patriarchs (Bodhidharma → Huineng) and the Five Houses and Seven Schools.
5. **Deploy a Zero-Backend Static GitHub Pages Web App** for bilingual reading, comparative translation, lineage study, Gong'an indexing, and lexicon lookup.

## 🏛️ English-First Walnut Hall Interface (2026-08-11)

The five-room public SPA keeps its dark-walnut Chan-hall structure while using a clearer, more distinctive **English-first factory/editorial identity**:

- **Identity:** `FC` monogram, asymmetric walnut introduction, edition/proof details, and the plain-language hook “The old texts are real. The translators are not.”
- **Hierarchy:** English leads navigation, room/document/unit headings, lineage, Gong'an, lexicon, and mobile controls; source Chinese remains available with `lang="zh"` and stays central inside the Reader.
- **Reading system:** grouped 2/2/31 library shelf, progressive provenance ledger, ruled reading sheets, Matrix proof rows, Lineage directory/network, Gong'an catalogue, and dictionary definitions.
- **Responsive and accessible behavior:** 1024px shelf collapse, 768px mobile layout, contrast-safe tokens, reduced-motion handling, keyboard tabs, reader-scoped mobile controls, and no HTML inline styles.
- **Progressive disclosure:** repeated hero/Matrix explanations and per-column Robo footers are removed; compact citations, coverage, Lineage, Lexicon, and search labels keep detailed provenance available on demand.
- **Resilience and honesty:** redundant Robo badges are suppressed without hiding verified-quotation status; malformed preferences fail soft; missing/malformed data renders reload/reset recovery UI; edition verification and rights status remain separate.

## ✅ Verified Quotation Campaign (2026-08-08)

Every visible translation register carries a **✅ Edition-verified quotation**, **🤖 Robolation**, or **🤖 Robo draft** badge. Every citation also exposes the recorded source and rights status. Edition verification establishes wording, not permission or public-domain status; all rights records still require their documented human review. A Robolation is project text using broad style characteristics associated with a scholar, **not** copied from or attributable as wording in that scholar's work, and is not citable as their translation. The campaign delivered:

- **177 verified quotation slots across 10 corpus texts + 2 verified comparative-matrix entries** (Wumenguan now 48/48 complete, every case carrying the verified 1934 Senzaki & Reps public-domain register). Corpus and Matrix verified items carry work/edition/verification fields plus a rights-manifest source identifier under provenance policy v2.2.
- **Wumenguan excerpt set is public-domain-complete**: every anchor carries the 1934 Senzaki & Reps *Gateless Gate* text (U.S. public domain via non-renewal) as a guaranteed-citable baseline — six ✅ editions stand side by side on Case 1 (Mu).
- All checks and honest negatives logged in [`sessions/AUDIT_archive_2026-08-08.md` §8](./sessions/AUDIT_archive_2026-08-08.md).

---

## 📚 Core Foundational Corpus (Seed Excerpts)

> **Honest status**: the active corpus contains **35 documents**: two `complete_selected_witness` works (Wumenguan 48/48 plus preface/epilogue; Xinxin Ming 37/37), two `partial_selected_witness` records (Biyanlu and Linji), and 31 excerpt seeds. Biyanlu has **100/100 cases** represented as case records, but source fields/human sign-off are incomplete. Platform Sutra has 10/10 chapter headings represented by selected excerpts (680 content CJK), not a complete text. The Congronglu seed was removed from the active bundle after the 2026-08-10 audit found uncollated generated placeholders and incorrect case-number/page claims. Generated metrics report **103,723 source-content CJK characters** (or 109,185 across every corpus JSON string, including metadata); representation counts never establish completion by themselves.

| Text Name (English) | Classical Chinese | CBETA Canon ID | Author / Compiler | Current Coverage |
| :--- | :--- | :--- | :--- | :--- |
| **The Gateless Gate** | 禪宗無門關 | **T2005** (Vol. 48) | Wumen Huikai (無門慧開, 1228 CE) | **48 / 48 cases ✅ complete** (+ preface, epilogue) |
| **The Record of Linji** | 鎮州臨濟慧照禪師語錄 | **T1985** (Vol. 47) | Linji Yixuan / Sansheng Huiran | 74 recorded sections; partial selected witness |
| **Transmission of Mind** | 黃檗山斷際禪師傳心法要 | **T2012A** (Vol. 48) | Huangbo Xiyun / Pei Xiu (裴休) | Opening sections (One Mind) |
| **Sayings of Zhaozhou** | 趙州真際禪師語錄 | **T1987** (Vol. 47) | Zhaozhou Congshen (趙州從諗) | Signature dialogues (狗子, 洗鉢盂…) |
| **Inscription on Faith in Mind** | 信心銘 | **T2010** (Vol. 48) | Third Patriarch Jianzhi Sengcan | **37 / 37 stanzas ✅ complete selected witness** |
| **Jewel Mirror Samadhi** | 寶鏡三昧歌 | **T1986** (Vol. 47) | Dongshan Liangjie (洞山良价) | Opening stanzas |
| **The Blue Cliff Record** | 佛果圓悟禪師碧巖錄 | **T2003** (Vol. 48) | Xuedou Chongxian / Yuanwu Keqin | **100 / 100 cases represented**; partial selected witness |
| **The Platform Sutra** | 六祖大師法寶壇經 | **T2007** (Vol. 48) | Sixth Patriarch Huineng / Fahai | 10 / 10 chapter headings represented by excerpts; **not complete** |
| **(+ 27 further yulu, treatises & poems)** | — | T/X canon | Mazu, Dongshan, Yunmen, Fayan, Guiyang, Dahui, Hanshan… | Excerpt/partial seeds — see `data/corpus/` |

---

## 🚀 Key Features

### 1. 📖 Interactive Bilingual Reader
- Sentence-by-sentence Classical Chinese with pinyin and disclosed English registers across all 35 active corpus documents.
- Switchable reading modes: **Bilingual**, **Multi-Translators Side-by-Side**, or **Classical Chinese Only**.
- Hover, focus, or tap key Chan terms (e.g. *本來面目*, *無*, *平常心是道*, *公案*) for immediate popup definitions.
- Visible source locations and validator-derived coverage disclosures that distinguish **complete selected witness**, **partial selected witness**, and **excerpt seed** from raw N/M representation counts; locator popups state granularity and review status.
- Client-side search across **all 35 active corpus documents and supported schema shapes** (case lists, sermons, dialogues, stanzas, chapters), with match counts, highlighting, and jump actions.

### 2. ⚖️ Multi-Translator Comparative Matrix
- Segment-level side-by-side comparison across major 20th and 21st-century renderings (4 exemplar entries today).
- Each displayed translation discloses translator, status, book/edition, page-or-section reference state, verification, and rights identifier through visible lines plus hover/focus/touch citation popups.
- Critical notes examine why renderings differ (e.g., *Mu* vs. *No* vs. *None* vs. *Emptiness*).
- 🤖 **Robo note**: translator-attributed renderings are Robolations unless individually checked against a recorded edition (then they are ✅ Edition-verified quotations). Verification and rights approval remain separate.

### 3. 🌳 Lineage Knowledge Graph Explorer
- Chronological and genealogical mapping from Bodhidharma (d. ~532 CE) through the Six Patriarchs, Mazu, Shitou, Baizhang, Huangbo, to the Five Houses — currently **34 master profiles** (30 researched seed profiles + 4 explicitly marked frontier scaffolds), with an SVG network graph and clickable dossiers.
- A visible chart-status disclosure distinguishes traditional links awaiting exact locators from future source-verified links; graph edges open source-chart/record details on click or keyboard activation.
- Filter by lineage school, dates, temple location, canonical text reference, and signature quotes.

### 4. 🗂️ Gong'an Cross-Reference Index
- Canonical cases indexed by theme, protagonist, and bibliographic cross-references across *Wumenguan*, *Biyanlu*, and *Congronglu* (the active Congronglu text is quarantined) — **24 indexed cases** at present (incl. 5 new Biyanlu entries, 2026-08-08), organized into **7 curated theme groups** (Buddha-Nature, Beyond Duality, What is Buddha, Direct Pointing, Everyday Way, Transmission & Causality, Existential Barrier) from the validator-enforced taxonomy in `data/gongan/theme_vocabulary.json`; cards keep a rich per-case theme descriptor while filter chips group by family.

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
│   ├── corpus_manifest.json    # Shared active-corpus order/navigation manifest (35 keys)
│   ├── canonical_locators.json # Document/case/unit source-locator registry
│   ├── project_metrics.json    # Deterministic, validator-generated project counts
│   ├── corpus/                 # 35 active structured source files (complete/partial/excerpt)
│   │   ├── wumenguan.json            # + preface/epilogue
│   │   ├── linji_yulu.json
│   │   ├── biyanlu_cases.json
│   │   ├── platform_sutra.json
│   │   └── ... (31 more: yulu, treatises, poems — see data/corpus/)
│   ├── editorial/          # Enforced document-level source-locator migration queue (33 seeds)
│   │   └── traceability_queue.json
│   ├── lineage/            # 34 profiles (30 seed profiles + 4 explicit frontier scaffolds)
│   │   ├── masters.json
│   │   ├── school_vocabulary.json   # Controlled school_key/display/color vocabulary (validator-enforced)
│   │   ├── lineage_verification.json  # 30 internal-edge + 4 frontier source-status records
│   │   └── profile_review_queue.json  # Enforced exact-locator review queue (34 profiles)
│   ├── translations/       # Comparative data, provenance, rights & Robo profiles
│   │   ├── comparative_matrix.json
│   │   ├── translator_profiles.json  # Evidence-grounded Robo-translator personalities (13 in-corpus-verified; 7 documented-external)
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

**Publishing flow for new work** (agent sessions commit to `arena/<session>-translatechan` branches):
1. Run `python3 scripts/validate_data.py`, `python3 scripts/build_data_bundle.py`, and `node scripts/smoke_test.mjs` on the session branch.
2. Commit generated metrics and mirrored `/docs` artifacts with the source change, push the session branch, and open a pull request into `main`.
3. On merge, GitHub Pages re-publishes automatically within about 60 seconds.

> The app at root `/` and the `/docs` copy are byte-identical by construction, so the branch could also publish from `/ (root)` if ever preferred.

---

## 📚 Documentation & Reference Guides

- 📜 **Grand Vision & Architectural Blueprint**: [`vision.md`](./vision.md)
- 🗺️ **Roadmap & Milestone Execution Plan**: [`ROADMAP.md`](./ROADMAP.md)
- 🧘 **UX/UI Improvement Roadmap (mobile + desktop, anti-overload)**: [`UX_ROADMAP.md`](./UX_ROADMAP.md)
- 🏯 **Original Walnut-Hall Vision**: [`WEB_VISION_2026-08-10.md`](./WEB_VISION_2026-08-10.md)
- 🎨 **Current English-First Design Audit**: [`sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md`](./sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md)
- 🔍 **Technical Audit & Remediation Log**: [`AUDIT.md`](./AUDIT.md)
- 🤝 **Pull Request & Deployment Handoff Guide**: [`HANDOFF.md`](./HANDOFF.md)
- 🎯 **Evidence-First Research Release Plan**: [`RESEARCH_RELEASE_PLAN.md`](./RESEARCH_RELEASE_PLAN.md)

---

## 📜 Canonical References & Acknowledgments

- **CBETA (Chinese Buddhist Electronic Text Association)**: *Taishō Shinshū Daizōkyō* (大正新脩大藏經) & *Shinsan Dainihon Zokuzōkyō* (卍新纂大日本續藏經).
- **Historical Translators**: Red Pine (Bill Porter), Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, Philip Yampolsky.

---

## 📄 License

- Project-authored corpus data and Robo translations: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); third-party quotations and CBETA-derived material remain subject to the exceptions/terms in [LICENSE](LICENSE).
- Software & Code: [MIT License](LICENSE)
