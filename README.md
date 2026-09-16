# 🤖 Fake Chan Factory (`translatechan`)

> **A proudly-fake AI translation factory robolating Chan/Zen translator registers over Classical Chinese corpus records with explicit source-review states.**
> *"A special transmission outside the scriptures, not founded upon words and letters; pointing directly to the human mind, seeing into one's nature and attaining Buddhahood."*

> ⚠️ **What this actually is.** The public app is **Fake Chan Factory**: most English renderings are **🤖 Robo** versions — AI text written in a famous translator's register, **not** their words and not citable as their work. Active Classical Chinese records retain named CBETA/Taishō witness claims where present, but W1 source-review status now distinguishes collated, partial/failed, and unavailable evidence; a named witness is not a completed collation claim. The 2026-08-10 containment pass removed the uncollated Congronglu seed after finding generated source-looking placeholders. A **✅ Edition-verified quotation** badge means wording was checked against the recorded edition; rights/public-domain status is separate in its citation record. (Internal `translatechan` identifiers remain for continuity.)

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Ready-brightgreen.svg)](https://56eli.github.io/translatechan/)
[![License: MIT / CC-BY-SA](https://img.shields.io/badge/License-MIT%20%2F%20CC--BY--SA-blue.svg)](LICENSE)
[![Canonical Scope: CBETA](https://img.shields.io/badge/Canon-CBETA%20%2F%20Taishō%2047%2C%2048%2C%2051-gold.svg)](https://cbetaonline.dila.edu.tw/)

---

## 🌟 Overview

**Fake Chan Factory** is an open-source, computational, and *playfully honest* initiative created to:
1. **Build toward and document** a source-aware collection of classical Chinese Chan (Zen) literature (*唐宋諸祖語錄與傳燈公案文獻*), referencing canonical CBETA / Taishō Tripiṭaka volumes (T47, T48, T51, and the Zokuzōkyō) without treating a representation count as proof of source completion.
2. **Maintain a source-aware editorial workflow** for Classical Chinese parsing, multi-register project drafts, published-translation collation, and structured provenance data — with every AI-derived rendering disclosed as such.
3. **Provide Multi-Translator Comparative Alignment** side-by-side, analyzing historical and contemporary renderings (Red Pine, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, Philip Yampolsky **— now extended with ✅ verified registers from Nyogen Senzaki & Paul Reps, Eiichi Shimomissé, Katsuki Sekida, Kōun Yamada, Robert Aitken, Burton Watson, Yoel Hoffman, Andy Ferguson, Richard B. Clarke**) alongside AI-assisted hermeneutic synthesis.
4. **Map the Lineage Knowledge Graph** connecting the Six Patriarchs (Bodhidharma → Huineng) and the Five Houses and Seven Schools.
5. **Deploy a Zero-Backend Static GitHub Pages Web App** for bilingual reading, comparative translation, lineage study, Gong'an indexing, and lexicon lookup.

## 🏛️ English-First Walnut Hall Interface

The five-room public SPA presents one walnut **gate**: a lintel carrying the brand and the controls, a directory of the five rooms beneath it, and a beam that tells the joke once. The hall is expressed as structure — lintel, rule lines, margins, the beam's shadow — not as texture, illustration or icon. (Re-composed 2026-09-13, Pages revamp Phase 1; the 2026-08-11 English-first pass established the hierarchy, this pass establishes the system.)

- **Identity:** `FC` monogram on the walnut lintel, brass rule under it, the beam's hook “The old texts are real. The translators are not.” set in a scholarly serif with the turn in italic, and the `PROUDLY FAKE ENGLISH` seal.
- **One token sheet:** 35 declarations plus 8 dark-theme overrides (43 total, re-measured in Phase 2), consolidated from 63 accreted declarations. Eight *theme primitives* — paper, panel, line, ink and four accents — are the only values the dark theme overrides; every other tint is derived from them with `color-mix()`, so a tint is written once instead of hand-picked per theme.
- **One type scale:** a single ~1.24 modular scale (`--type-hook` … `--type-small`) shared by English and Chinese at their own line-heights.
- **English voice (Checkpoint-C C-2):** **Source Serif 4** carries the hook, headings and translation prose (delivered in Phase 2 together with the Reader sheet, the ledger drawer, the thin case register and render-lazy boot); the system sans is for controls only; `ui-monospace` carries locators and counts. Source Serif 4 is served by Google Fonts, which the shipped CSP already allows, so it adds no repository bytes and no new third party; the CJK serif sits at the end of its stack so mixed headings never fall back to a system default. Self-hosting under `/fonts/` stays the documented alternative if a zero-third-party-request rule is ever wanted.
- **Hierarchy:** English leads navigation, room/document headings, lineage, Gong'an, lexicon, and mobile controls; source Chinese is present everywhere and subordinate everywhere, except inside the Reader sheet where it is the largest text on the page (Checkpoint-C C-3) and always carries `lang="zh"`.
- **Reading system (Phase 2):** grouped 2/2/31 library shelf above a minimal ruled sheet — one hairline between reading units, generous margins, the source Chinese governing the column, and translation prose set in the scholarly serif (C-2). The five disclosure ledgers fold into one always-visible *About this edition* drawer band under the document heading (calmer, never quieter: no ledger hides behind a disclosure; edition metadata is the one progressive line, expanding inline). The case index is a thin static register.
- **Secondary rooms (Phase 3, 2026-09-13):** the four hidden rooms were re-composed onto that same vocabulary instead of keeping their own card
  kits. The Matrix is a **collation table** — one source line, then one aligned register row per translator, with the Robo name, its work and the
  provenance badge in the margin rail and the machine-made English in the column beside it. Lineage leads with a **transmission register** — masters
  banded by generation, one ruled row each, house and dated record in fixed columns, signature quote in the margin rule — and the layered SVG
  network is now its *second* view, opened from the room's own switch (a hidden `<svg>` measures nothing, so the chart re-lays out on activation).
  The Gong'an index is a **case catalogue** (case no. · both titles · collection · theme group · canonical record, with the précis and
  cross-references on one detail line under each row) whose theme filter is a single row of text filters; the Lexicon runs as a **dictionary**
  (headword Chinese under its literal gloss, definition, category in the margin). Nothing was cut to get there: the register's master rows hand the
  summary, texts, names and evidence state to the dossier, which stays one activation away, and every disclosure the rooms carried before is still
  printed — including the lineage scaffold profiles' pending-locator wording.
- **Responsive and accessible behavior:** 1024 / 768 / 480 px breakpoints (the secondary rooms now carry all three: bands and catalogue rows collapse
  their column grids to stacked rows), contrast-safe tokens, reduced-motion handling, keyboard tabs, reader-scoped mobile controls regrouped into two
  clusters (text · move) with 44 px touch targets, `lang="zh"` on every source-Chinese block, and — since Phase 3 — **zero inline style attributes**
  in `index.html` and in `app.js` (`grep -c 'style="' app.js` is a smoke assertion), with every room template driving layout through classes and
  visibility through the semantic `hidden` attribute. What remains are four CSSOM custom-property writes — the measured runtime contracts
  `--shell-height`, `--zh-font-size` and the popover's `--pop-shift` — which `style-src` does not govern; `style-src 'unsafe-inline'` is therefore
  gone from the CSP meta. No real-browser evidence exists for any of this — the repository's standing note — so the visual result is owner-review work on live Pages.
- **Progressive disclosure:** repeated hero/Matrix explanations and per-column Robo footers are removed; compact citations, coverage, Lineage, Lexicon, and search labels keep detailed provenance available on demand.
- **Boot cost (Checkpoint-C C-4, Phase 2):** one bundle, render-lazy — the Reader renders at boot and the four hidden rooms (Matrix, Lineage, Gong'an, Lexicon) build their DOM on first tab activation; data loading and the byte-identical bundle contract are unchanged. Raw bundle `app_data.js` + `app.js` + `app.css` + `index.html` = 1,925,366 B (~1.84 MB) <2 MB ceiling, gzipped 586,529 B (~573 KB) — measured `gzip -c app_data.js app.js app.css index.html | wc -c` on main 3a6ae32.
- **Resilience and honesty:** redundant Robo badges are suppressed without hiding verified-quotation status; malformed preferences fail soft; missing/malformed data renders reload/reset recovery UI; edition verification and rights status remain separate.
- **Phase 4 evidence (2026-09-13):** Pages revamp Phases 1-3 complete (PRs #48 system+masthead tokens 63→43 serif Source Serif 4, #49 Reader minimal sheet + ledger drawer + thin register + 41 style=→0 + render-lazy, #50 secondary rooms re-composed + CSP without `unsafe-inline` + 0 style=). Frozen tracks **PR-B CSP hardening folded into Phase 3** and **PR-D perf measure-first folded into Phase 2 lazy** per Checkpoint-C C-5 (a); PR-A real-browser remains frozen. Final system: 43 global tokens (35+8) + 6 scoped composition dials, 0 `style=` literals in `index.html` and `app.js`, 4 CSSOM custom-property writes (`--shell-height`, `--zh-font-size`, `--pop-shift`) as runtime contracts, CSP `style-src 'self' https://fonts.googleapis.com` without `unsafe-inline`, bundle <2 MB, render-lazy. Dated current-vision doc `WEB_VISION_2026-09-13.md` finalised; owner light/dark desktop/mobile review on live Pages pending — no self-declared completion.

## ✅ Verified Quotation Campaign (historical snapshot, 2026-08-08)

This campaign is historical evidence about the English quotation layer. W1 source collation is a separate later review and supersedes the campaign's complete-witness wording for current corpus status.

Every visible translation register carries a **✅ Edition-verified quotation**, **🤖 Robolation**, or **🤖 Robo draft** badge. Every citation also exposes the recorded source and rights status. Edition verification establishes wording, not permission or public-domain status; all rights records still require their documented human review. A Robolation is project text using broad style characteristics associated with a scholar, **not** copied from or attributable as wording in that scholar's work, and is not citable as their translation. The campaign delivered:

- **177 verified quotation slots across 10 corpus texts + 2 verified comparative-matrix entries** (the historical Wumenguan quotation set covered 48/48 represented cases; this English quotation result is separate from W1 source collation). Corpus and Matrix verified items carry work/edition/verification fields plus a rights-manifest source identifier under provenance policy v2.2.
- **Historical Wumenguan quotation set:** every anchor carries the 1934 Senzaki & Reps *Gateless Gate* text as a recorded U.S. public-domain baseline — six ✅ editions stand side by side on Case 1 (Mu). This quotation/rights record is separate from W1 source collation and current rights review.
- All checks and honest negatives logged in [`sessions/AUDIT_archive_2026-08-08.md` §8](./sessions/AUDIT_archive_2026-08-08.md).

---

## 📚 Core Foundational Corpus (Seed Excerpts)

> **Honest status**: the active corpus contains **35 documents** and no current `complete_selected_witness` item after W1 containment. W1 evidence: **35 documents, 630 flagged source fields** (authoritative 2026-09-10 correction register: `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`; historical 2026-09-09 register: `sessions/COLLATION_REGISTER_2026-09-09.json` with 34 documents and 622 flagged fields — the 637 figure in the 2026-09-09 report is **superseded**); 593 of 924 source-content fields collate to their claimed witness, and 22 documents have no collating source-content field at all; a fresh collation of current `main` reports **532** flagged fields — the difference is the four merged re-keys (PRs #29, #30, #32, #34) — and the owner ruled on 2026-09-12 that the published post-remediation evidence pass (PR #41) does **not** supersede the register: **630** stays authoritative and 532 stays today's measurement of `main`. Wumenguan has **48 / 48 cases represented; W1 source-review status: `partial_or_failed_w1_collation`**; Xinxin Ming has 37/37 stanzas represented with the same partial/failed W1 state. Biyanlu and Linji remain `partial_selected_witness`; 31 records remain excerpt seeds. The manifest source-review counts are `collated_to_claimed_witness`: **1**, `partial_or_failed_w1_collation`: **32**, and `witness_unavailable`: **2**. Biyanlu has **100/100 cases** represented as case records, but source fields/human sign-off are incomplete. Platform Sutra has 10/10 chapter headings represented, but is not a complete text: its 13 source-content fields (680 content CJK) are now provenance-labelled — 1 verbatim in the primary witness T48n2007 (Dunhuang), 3 in the alternative T48n2008 (宗寶), and 9 in neither, disclosed as project précis. The Congronglu seed was removed from the active bundle after the 2026-08-10 audit found uncollated generated placeholders and incorrect case-number/page claims. Generated metrics report **104,564 source-content CJK characters** (or 110,348 across every corpus JSON string, including metadata); representation counts never establish completion by themselves.

| Text Name (English) | Classical Chinese | CBETA Canon ID | Author / Compiler | Current Coverage |
| :--- | :--- | :--- | :--- | :--- |
| **The Gateless Gate** | 禪宗無門關 | **T2005** (Vol. 48) | Wumen Huikai (無門慧開, 1228 CE) | **48 / 48 cases represented; W1 source-review status: `partial_or_failed_w1_collation`** |
| **The Record of Linji** | 鎮州臨濟慧照禪師語錄 | **T1985** (Vol. 47) | Linji Yixuan / Sansheng Huiran | 74 recorded sections; partial selected witness |
| **Transmission of Mind** | 黃檗山斷際禪師傳心法要 | **T2012A** (Vol. 48) | Huangbo Xiyun / Pei Xiu (裴休) | Opening sections (One Mind) |
| **Sayings of Zhaozhou** | 趙州真際禪師語錄 | **witness withdrawn (PR #43, 2026-09-12)**: the former claim **T1987** was **false** — T1987 is the Caoshan record — and the candidate Guzunsu yulu work X68n1315 is **unverified** (2 of 19 content fields collate, so the claim is not re-pointed) | Zhaozhou Congshen (趙州從諗) | Signature dialogues (狗子, 洗鉢盂…); carried as project text with no verified witness, sourcing queued for a human |
| **Inscription on Faith in Mind** | 信心銘 | **T2010** (Vol. 48) | Third Patriarch Jianzhi Sengcan | **37 / 37 stanzas represented; partial/failed W1 source collation** |
| **Jewel Mirror Samadhi** | 寶鏡三昧歌 | **T1986** (Vol. 47) | Dongshan Liangjie (洞山良价) | Opening stanzas |
| **The Blue Cliff Record** | 佛果圓悟禪師碧巖錄 | **T2003** (Vol. 48) | Xuedou Chongxian / Yuanwu Keqin | **100 / 100 cases represented**; partial selected witness |
| **The Platform Sutra** | 六祖大師法寶壇經 | **T2007** (Vol. 48) | Sixth Patriarch Huineng / Fahai | 10 / 10 chapter headings represented by excerpts; **not complete** |
| **(+ 27 further yulu, treatises & poems)** | — | T/X canon | Mazu, Dongshan, Yunmen, Fayan, Guiyang, Dahui, Hanshan… | Excerpt/partial seeds — see `data/corpus/` |

---

## 🔎 W1 Source-Review Status Model

The 2026-09-09 W1 report and register are the *historical* evidence for Classical Chinese source review; the dated 2026-09-10 correction overlay is the authoritative record and adds the item the first run never mapped. `scripts/validate_data.py` merges both and re-derives every status from them. These are containment/remediation states, **not rights decisions**:

- `collated_to_claimed_witness`: **1** document fully collated to its claimed witness in the W1-evaluated set.
- `partial_or_failed_w1_collation`: **32** manifest records are not fully supported by W1 collation; per-document remediation remains pending.
- `witness_unavailable`: **2** records need an authoritative non-CBETA witness before source claims can be reviewed.

The Reader keeps **five separate, always-visible ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review. Represented units describe what the Reader contains; source collation describes W1 evidence against a claimed witness; translation/edition verification describes wording checks for English registers; the canonical locator identifies where a text sits in the canon; rights review records permission and jurisdiction work. None of the five is inferred from another, and no ledger here approves reuse. Containment/remediation state, not a rights decision. Source collation does not approve reuse. Title and name metadata (title_zh, name_zh) is measured and reported separately from source content, so collated_to_claimed_witness is not proof that the excluded metadata fields were collated. Historical evidence: [`sessions/COLLATION_W1_2026-09-09.md`](./sessions/COLLATION_W1_2026-09-09.md) and [`sessions/COLLATION_REGISTER_2026-09-09.json`](./sessions/COLLATION_REGISTER_2026-09-09.json); authoritative evidence: the dated correction overlay [`sessions/COLLATION_W1_2026-09-10_CORRECTION.md`](./sessions/COLLATION_W1_2026-09-10_CORRECTION.md) with [`sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`](./sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json) and its [`sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`](./sessions/COLLATION_W1_2026-09-10_refs_manifest.txt) digest list (regenerate the reference layer with `scripts/collate_refs.py`).

## 🧾 Wave 1 source-integrity campaign (2026-09-10 → 2026-09-11)

Five documents were re-keyed to their pinned CBETA witnesses or provenance-labelled against them — `wumenguan` (#29), `biyanlu_cases` (#30), `linji_yulu` (#32), `xinxin_ming` (#34), and `platform_sutra` (labelled, #35) — and all 35 documents were independently inventoried against the pinned witness set across three inventories ([`.orchestrator/WITNESS_INVENTORY.md`](./.orchestrator/WITNESS_INVENTORY.md), [`WITNESS_INVENTORY_T48_T51.md`](./.orchestrator/WITNESS_INVENTORY_T48_T51.md), [`WITNESS_INVENTORY_XSERIES.md`](./.orchestrator/WITNESS_INVENTORY_XSERIES.md)), consolidated and ranked in [`.orchestrator/PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md). None of the five documents changed status and none became complete: representation does not establish completion, and the re-keys remain containment work until the post-remediation evidence pass publishes a new register. Measured numbers live in [`AUDIT.md`](./AUDIT.md), next actions in [`HANDOFF.md`](./HANDOFF.md), and the measurement method in [`WITNESS_INVENTORY.md`](./.orchestrator/WITNESS_INVENTORY.md).

## 🚀 Key Features

### 1. 📖 Interactive Bilingual Reader
- Sentence-by-sentence Classical Chinese with pinyin and disclosed English registers across all 35 active corpus documents.
- Switchable reading modes: **Bilingual**, **Multi-Translators Side-by-Side**, or **Classical Chinese Only**.
- Hover, focus, or tap key Chan terms (e.g. *本來面目*, *無*, *平常心是道*, *公案*) for immediate popup definitions.
- Visible source locations, W1 source-review disclosures, and validator-derived coverage disclosures distinguish **source collation status**, **complete/partial/excerpt representation**, and locator review; raw N/M representation counts never establish source completion. The Reader keeps **five separate, always-visible ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review.
- Client-side search across **all 35 active corpus documents and supported schema shapes** (case lists, sermons, dialogues, stanzas, chapters), with match counts, highlighting, and jump actions.
- The sheet is the unit: every template line carries its treatment in a named class (`.provenance-line`, `.dialogue-turn`, `.commentary-block.is-pointer`, …) rather than an inline `style=`; long case collections get the thin register rail, and the document header carries the drawer band above.

### 2. ⚖️ Multi-Translator Comparative Matrix
- Segment-level side-by-side comparison across major 20th and 21st-century renderings (4 exemplar entries today), composed as a **collation
  table**: one source line, then one aligned register row per translator with the Robo name, the work it imitates and the provenance badge in the
  margin rail. Source Chinese here is sized from `--zh-font-size`, so A−/A+ govern it too.
- Each displayed translation discloses translator, status, book/edition, page-or-section reference state, verification, and rights identifier through visible lines plus hover/focus/touch citation popups.
- Critical notes examine why renderings differ (e.g., *Mu* vs. *No* vs. *None* vs. *Emptiness*).
- 🤖 **Robo note**: translator-attributed renderings are Robolations unless individually checked against a recorded edition (then they are ✅ Edition-verified quotations). Verification and rights approval remain separate.

### 3. 🌳 Lineage Knowledge Graph Explorer
- Chronological and genealogical mapping from Bodhidharma (d. ~532 CE) through the Six Patriarchs, Mazu, Shitou, Baizhang, Huangbo, to the Five Houses — currently **34 master profiles** (30 researched seed profiles + 4 explicitly marked frontier scaffolds), with the network chart as its second view and clickable dossiers.
- A visible chart-status disclosure distinguishes traditional links awaiting exact locators from future source-verified links; graph edges open source-chart/record details on click or keyboard activation.
- Filter by lineage school; sort the register by generation (ruled bands), chronology, name or school. Each row carries the school, dated record,
  temple, canonical reference, teacher link and signature quote, and the dossier prints the full profile — including the pending-locator wording
  on the four frontier scaffolds.

### 4. 🗂️ Gong'an Cross-Reference Index
- Canonical cases indexed by theme, protagonist, and bibliographic cross-references across *Wumenguan*, *Biyanlu*, and *Congronglu* (the active Congronglu text is quarantined) — **24 indexed cases** at present (incl. 5 new Biyanlu entries, 2026-08-08), organized into **7 curated theme groups** (Buddha-Nature, Beyond Duality, What is Buddha, Direct Pointing, Everyday Way, Transmission & Causality, Existential Barrier) from the validator-enforced taxonomy in `data/gongan/theme_vocabulary.json`. The room reads as a **case catalogue** — one ruled row per case
  (case no. · both titles · collection · theme group · canonical record) with the précis and cross-references on one detail line — and the theme
  group filter is a single row of text filters rather than a field of pills.

### 5. 📚 Classical Chan Lexicon
- Dictionary of technical Chan idioms, Buddhist ontology, dialectical structures, and monastic expressions — **31 terms** today, expanding toward 150+ (see Roadmap Phase 3).
- Runs as a **dictionary list**: category and the recorded-occurrence tally in the margin, the literal gloss leading, the headword Chinese under
  it, then the definition and the canonical occurrence references (whose caveat stays on demand, one `title` per locator).

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
├── SECURITY.md              # Minimal security-disclosure policy (GitHub Security Advisories)
├── og-image.svg / og-image.png # Social-card image; SVG primary + PNG fallback (mirrored into docs/)
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
│   │   ├── translator_profiles.json  # Evidence-grounded Robo-translator personalities (14 in-corpus-verified; 6 documented-external; 1 not-applicable)
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
