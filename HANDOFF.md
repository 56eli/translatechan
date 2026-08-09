# 🤝 TranslateChan: Project Handoff, Pull Request & Deployment Guide

> **Repository**: `56eli/translatechan`
> **Working branch convention**: agent sessions work on `arena/<session>-translatechan`; completed branches/PRs are historical, not instructions for the next session.
> **Target Branch**: `main`
> **GitHub Pages URL**: `https://56eli.github.io/translatechan/` (**live**: branch `main`, folder `/docs`)

---

## 📋 Executive Summary of Deliverables

The TranslateChan project has been fully established with:
1. **Grand Vision & Architectural Blueprint** ([`vision.md`](./vision.md)): Canonical scope spanning CBETA / Taishō Tripiṭaka Volumes 47, 48, and 51.
2. **Project Roadmap & Milestone Execution Plan** ([`ROADMAP.md`](./ROADMAP.md)): Phased milestones from foundational corpus to living knowledge graph (statuses measured, not aspirational).
3. **Core Canonical Corpus Seeds** (`data/corpus/`): 36 excerpt-scale canonical works and foundational treatises across Tang, Five Dynasties, Song, and Yuan dynasties (authentic anchor passages; completion tracked in [`ROADMAP.md` Phase 2](./ROADMAP.md)).
4. **Master Lineage Knowledge Graph** (`data/lineage/masters.json`): 34 master profiles (30 researched seeds plus 4 clearly labeled frontier scaffolds) with genealogies, dates, temples, and signature quotes from Bodhidharma and the Six Patriarchs through the Five Houses of Chan (expanded 2026-08-08: Nanyue Huairang, Qingyuan Xingsi, Nanquan, Yaoshan, Yunyan, Deshan, Xuefeng, Xuansha, Luohan Guichen, Baiyun Shouduan, Wuzu Fayan, Yuelin Shiguan; **school affiliation normalized 2026-08-09** into the validator-enforced `school_key` vocabulary in `data/lineage/school_vocabulary.json`, which now drives the filter UI and graph colors).
5. **Classical Chan Lexicon** (`data/glossary/chan_terms.json`): 31 technical terms (growing toward 150+), Sanskrit roots, and philosophical definitions with real-time hover lookup.
6. **Multi-Translator Comparative Matrix** (`data/translations/comparative_matrix.json`): 4 exemplar sentence-aligned entries in the registers of Red Pine, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, and Philip Yampolsky — **2 ✅ verified registers on the Case-1 (Mu) row** (Senzaki & Reps PD; Blyth per Hokuseido 1966). Reader and Matrix display the same provenance status; verified rows resolve through source records and `rights_manifest.json` (policy v2.2).
7. **Interactive Zero-Backend Public Reader** (`index.html`, `app.css`, `app.js`, `app_data.js`): Responsive, contemplative reader/matrix/lineage/index/lexicon interface with dark/light mode, search, and an SVG lineage network graph. Translation Studio, Arena AI Agents, and the header GitHub link are intentionally absent from the public Pages UI. *(Fatal parse bug shipped in PR #1 was repaired 2026-08-08 — see [`sessions/AUDIT_archive_2026-08-08.md` §8](./sessions/AUDIT_archive_2026-08-08.md); `node scripts/smoke_test.mjs` must pass before every push.)*
8. **Synchronized GitHub Pages Bundle** (`docs/`): Fully compiled, zero-dependency static bundle; Pages publishing already active from `main /docs`.
9. **Editorial Data Tooling** (`scripts/`): `validate_data.py` schema/semantic/rights/locator validator with deterministic metrics, `build_data_bundle.py` manifest-driven bundler, `segment_classical.py` offline segmenter (with deprecated `ingest_cbeta.py` compatibility wrapper), and `smoke_test.mjs` renderer regression test. The checked-in GitHub Actions **Quality** workflow runs the same validation, deterministic-build, generated-artifact, and reader-smoke gate on pushes and pull requests; native GitHub Pages publishing remains separate.

---

## ✅ Current Session Handoff — 2026-08-09 (session `arena/019fe64a-translatechan`)

### Public Pages scope

The published interface remains deliberately limited to **Bilingual Reader, Comparative Matrix, Lineage Tree, Gong'an Index, and Chan Lexicon** (no Translation Studio, agent branding, or header GitHub link; the smoke test guards against their return).

### What this session delivered (PR #9, all gates green; full report: [`sessions/AUDIT_RESPONSE_2026-08-09_019fe64a.md`](./sessions/AUDIT_RESPONSE_2026-08-09_019fe64a.md))

Independent full-project audit found no P0/P1/P2 defects. Shipped improvements:

1. **Semantic document outline (a11y B2):** every public view title is a real `h1` and every card/unit title is a real `h2`; visuals unchanged via heading reset; smoke `4m6`.
2. **Data-derived lineage graph colors (A2):** each school in `data/lineage/school_vocabulary.json` now carries a curated `color`; the hardcoded palette was removed; validator/schema/smoke `4m2b` enforce it.
3. **Historical link repair (A1):** corrected three stale `./AUDIT.md` links in dated session reports.
4. **Dark-theme FOUC guard (B1):** external CSP-clean `theme-init.js` applies persisted `data-theme` before first paint; build/docs/smoke covered.
5. **Explicit translation records (A4):** converted all 736 legacy bare-string corpus translations to `{text,status}` objects via `scripts/migrate_translations.py`; validator/schema/smoke `4m7` reject regression.
6. **a11y/SEO/copy polish (B3/B5/B6):** decorative emoji are `aria-hidden`; hero corpus/translator counts are data-derived; added `theme-color`, canonical URL, Open Graph/Twitter metadata, `robots.txt`, and `sitemap.xml`.
7. **Script loading/perf (B4):** `app_data.js` and `app.js` now use `defer` while preserving order.
8. **Tooling clarity (C3):** renamed `ingest_cbeta.py` to `segment_classical.py` and kept a deprecated compatibility wrapper; docs updated.
9. **Schema/validator hardening (C2):** strict additional-property rules for translation records, quotation sources, matrix translators, lineage edges, lineage sources, and controlled-vocabulary entries.

### Source, translation, and lineage disclosure

- Every public Reader document/case shows a canonical source location plus hover/focus/touch details and a validator-derived coverage disclosure (e.g. `48/48 cases`, `16/100 cases`, `Excerpt seed (N units)`).
- Every displayed translation exposes its translator/label, status, book/edition, page-or-section state, verification, and rights record. **135 / 140** verified quotation records have a recorded reference; the remaining **5** are explicitly pending.
- AI/project text is visibly disclosed as **AI draft** or **Project register reconstruction**, never as a named scholar's book quotation.
- The lineage graphic reads from the verification registry and the data-derived school palette; **30** in-set links and **4** frontiers remain source-status aware.

### Quality gate run before handoff

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py          # corpus=36 | slots=871 | verified=138 | matrix=21 | locators=66/66
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
node --check scripts/browser_test.mjs     # optional Playwright suite; skips without Chromium
diff -rq data docs/data
diff -q theme-init.js docs/theme-init.js  # FOUC guard
diff -q robots.txt docs/robots.txt
diff -q sitemap.xml docs/sitemap.xml
```

All commands pass. Root and `/docs` assets/data are synchronized.

### Owner follow-up: CI workflow path list

The session token lacks GitHub App `workflows` permission, so `.github/workflows/quality.yml` was not modified — **re-confirmed 2026-08-09 (session `019fe731`): the one-line fix was committed and rejected by GitHub on push (`refusing to allow a GitHub App to create or update workflow ... without workflows permission`) and reverted.** Extend the generated-artifact gate path list to include:

```text
docs/theme-init.js
docs/robots.txt
docs/sitemap.xml
```

Local gates and smoke tests already enforce these files. (Alternatively, grant the sessions GitHub App token the `workflows` scope so agent sessions can maintain CI themselves.)

### GitHub Actions quality gate

`.github/workflows/quality.yml` is checked in and runs on pushes to `main` and `arena/**`, plus pull requests targeting `main`. It validates Python syntax, source data/metrics, deterministic generated artifacts, the `/docs` mirror, and the dependency-free reader smoke suite. It does **not** deploy Pages; Pages remains native branch publishing from `main` `/docs`.

Owner follow-up (2026-08-09): the session token could not update workflow YAML, so `.github/workflows/quality.yml`'s generated-artifact `git diff --exit-code` path list should be extended to include `docs/theme-init.js`, `docs/robots.txt`, and `docs/sitemap.xml`. Local gates already enforce these via `diff -q`; the smoke test also requires their presence.

### Repository administration — require the Quality check on `main` (owner action, ~2 minutes)

The Quality workflow is the merge gate; **requiring** it is a one-time admin step that no agent token can perform:

1. **Confirm the workflow has run at least once** — any push/PR run appears under *Actions → Quality* (job name: **Validate data, generated artifacts, and reader**). It reads the repo only and needs no secrets.
2. Open **Settings → Branches → Add branch protection rule** (or edit the existing rule) for branch `main`:
   - ☑ **Require status checks to pass before merging**
   - In the search box pick **Validate data, generated artifacts, and reader** (the job name above), then confirm it is listed.
   - Recommended extras: ☑ **Require a pull request before merging** (with at least 1 approving review), and leave **Do not allow bypassing the above settings** checked.
3. Save. Do **not** add any Pages/deploy workflow — native branch publishing from `main` → `/docs` republishes automatically on merge.

The same commands the workflow runs are the local release checklist above, so the required check should always be green for conforming PRs.

### Session artifacts convention (est. 2026-08-09, audit P2-D)

- **Dated session reports and the audit history archive live in [`sessions/`](./sessions/)** — write `sessions/SESSION_AUDIT_<date>[_<session>].md` per session; never rewrite them afterwards.
- **Repo-root `AUDIT.md` stays slim**: current verdict, standing recommendations, gates, and the session index — append your session row there, don't absorb the whole report.
- **`response_summary.md` at root is the live session working summary** (overwritten by each session, not canonical docs).
- Guarded by design: the validator's doc-truthfulness gate checks README/HANDOFF/index.html numbers; it intentionally does **not** check session logs (dated records).

### Merge readiness

Current branch: `arena/019fe5d5-translatechan`. Before merging, confirm the local quality gate above and the green **Quality** check; after merge, GitHub Pages republishes `main` → `/docs` automatically (~60 s).

---

## 📍 Historical Session Deltas (compact)

**PR #7 is merged into `main` (session `arena/019fe30b-translatechan`, 2026-08-08); compact map** (full detail in [`sessions/SESSION_AUDIT_2026-08-08_019fe30b.md`](./sessions/SESSION_AUDIT_2026-08-08_019fe30b.md) + `sessions/AUDIT_archive_2026-08-08.md` §11): full-project audit (no P0/P1, prior remediations verified holding); a11y/CSP hardening (delegated `data-*` handlers replacing all inline `onclick`, full ARIA tabs, restrictive CSP meta); deterministic per-text coverage metrics (`project_metrics.json → corpus.per_text` for all 36 texts); optional Playwright real-browser suite (12 tests, desktop + mobile, graceful skip); **Biyanlu 4–10 pilot** (first 10 cases complete, zh collated byte-exact from CBETA TEI T48n2003; index 18 → 23); reader 📊 coverage disclosures (excerpts can no longer be mistaken for complete texts) + UX pass.

**PR #3 is merged into `main`; this is its historical one-sentence map** (full detail in [`sessions/AUDIT_archive_2026-08-08.md` §9](./sessions/AUDIT_archive_2026-08-08.md)):

1. **`8ea6c46`** Second-pass full audit → no P0; all PR#2 remediations verified holding; 10 new findings B1–B10 ([`sessions/AUDIT_archive_2026-08-08.md` §9.2](./sessions/AUDIT_archive_2026-08-08.md); readable report [`sessions/SESSION_AUDIT_2026-08-08.md`](./sessions/SESSION_AUDIT_2026-08-08.md)).
2. **`f074b7e`** **B1–B10 remediation + CBETA canon-reference pass**: `docs/data` mirror restored; stale UI branch string; volume-chip truth; search escaping + variant normalization (鉢/缽, 曰/云, 臺/台, 裏/里, 無/无); localStorage guard; dead `stacked` mode dropped; `docs/scripts` removed; **lineage 18 → 30 masters** (four documented frontier teacher references remain outside the seed set); **canon IDs corrected vs CBETA for 10 corpus files + 5 master profiles** (foyan T1995→X1315, mazu/baizhang→四家語錄 X1321/X1323, xuansha→X1445, dazhu→X1223, caoxi→X1598, dahui_shobogenzo T2002→X1309, xuefeng T1983→X1333, fayan→X1226, dahui_hongzhi T2001 dropped, taisho_vol truth).
3. **`e299187`** **Wumenguan completed 48/48** — the corpus's first complete canonical text: all 48 cases + preface + epilogue (zh per CBETA T2005 宗紹編), **+40 verified Senzaki & Reps 1934 PD slots → the historical 119-slot tally at that milestone**; CBETA numbering correction (case 37 IS 庭前柏樹); coverage metadata; `provenance.json` v2.0.
4. **`11ad640`** UX/UI improvement roadmap ([`UX_ROADMAP.md`](./UX_ROADMAP.md)) — 10 measured pain points, phases A–D, mobile + desktop, zero-backend contract.
5. **`2ed729c` + `584a51f` + `b7083b4` + `15e1f9d`** **UX Phases A–D implemented (historical)**: case-index strip + collapsible cards; tap/focus shared glossary popover; persisted preferences; debounced + capped search; mobile corpus picker + bottom action bar; single-column mobile translations; print/PDF stylesheet; hash routing + deep links; lineage pan/zoom/reset; WCAG-AA a11y pass; Gong'an theme filters; cached search index; lazy case rendering; `app_data.js` preload. Public scope was subsequently narrowed to reader/matrix/lineage/index/lexicon.

**Historical release verification:** `scripts/smoke_test.mjs` ✅ (36 texts × reader modes + lazy rendering + strip/toggle/nav/popover/pan-zoom/index checks) · deterministic bundle ✅ · root↔`docs` byte-identical ✅ · `diff -rq data docs/data` silent ✅. Pages now serves `main` `/docs`.

---

## 🔀 Merging & GitHub Pull Request Instructions

Session work is committed and pushed to its current Arena session branch. To merge into `main`:

### Method 1: Via GitHub Web UI
1. Open a pull request from the current `arena/<session>-translatechan` branch to `main` (use GitHub's compare view or `gh pr create`).
2. Give the PR a descriptive title (conventional-commit style preferred), click **Create Pull Request**, then **Merge Pull Request**.

### Method 2: Via GitHub CLI (`gh`) — from the session branch
```bash
# Agent sessions must stay on their own branch; open the PR from there:
gh pr create --base main --head "$(git branch --show-current)" --title "..." --body "..."
# Merging is performed by the repository owner (or via `gh pr merge`).
```

---

## 🌐 GitHub Pages Status (Already Active)

✅ Pages is **already enabled**: `Deploy from a branch` → `main` + `/docs`, HTTPS enforced.
On every merge into `main`, the site re-publishes automatically within ~60 seconds.
👉 **`https://56eli.github.io/translatechan/`**

> **Release checklist before opening any PR affecting the app/data**: `python3 scripts/validate_data.py && python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs` must pass, `cmp app.js docs/app.js` (etc.) must show root/docs in sync, and `diff -rq data docs/data` must be silent (data mirror). Run these commands locally before opening a PR; the same checks are enforced by the GitHub Actions Quality workflow. Optionally (dev machines only, not CI): `npm install && npx playwright install chromium && npm run test:browser` runs the real-browser Playwright suite (desktop + mobile); it prints a clear SKIP when no Chromium is available.

---

## 📂 Repository Layout & File Manifest

> Corpus file descriptions below name the **canonical work and its scope**; current file contents are excerpt-scale seeds (see [`sessions/AUDIT_archive_2026-08-08.md` §3](./sessions/AUDIT_archive_2026-08-08.md) for measured coverage).

```
translatechan/
├── index.html              # Root entry point (Zen responsive single page app)
├── app.css                 # Serene tea & paper palette, responsive typography
├── app.js                  # Client-side router, hover lexicon, lineage graph, reader views
├── app_data.js             # Generated master bundle (zero-latency execution)
├── schemas/                # Formal data-contract schema
├── docs/                   # Synchronized GitHub Pages deployment directory
│   ├── index.html
│   ├── app.css
│   ├── app.js
│   ├── app_data.js
│   └── data/               # Canonical JSON datasets (mirrored byte-identically by build_data_bundle.py)
├── vision.md               # Grand Vision & Architectural Specification
├── ROADMAP.md              # Project Roadmap & Multi-Phase Tracker
├── README.md               # User documentation & Quickstart guide
├── HANDOFF.md              # This handoff & deployment document
├── data/
│   ├── corpus_manifest.json    # Shared ordered reader/bundle manifest
│   ├── canonical_locators.json # Document/case/unit canonical locator registry
│   ├── project_metrics.json    # Deterministic generated metrics
│   ├── corpus/                 # 36 Canonical Texts in structured JSON
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
│   │   ├── dahui_shobogenzo.json       # Dahui Shobogenzo Vols 1 & 2 (X1309)
│   │   ├── shitou_sandokai.json        # Sandokai & Grass Hut Song (embedded T2076 / X1565)
│   │   ├── zhengdao_ge.json            # Song of Enlightenment (T2014)
│   │   ├── bodhidharma_erru.json       # Two Entrances & Four Practices (T2009)
│   │   ├── niutou_juezhu.json          # Dunhuang Juezhu Lun (P.2885)
│   │   ├── lidai_fabao_ji.json         # Dunhuang Baotang Record (T2075)
│   │   ├── dazhu_huihai.json           # Sudden Awakening & Faxing (X1223)
│   │   ├── baizhang_guanglu.json       # Three Propositions & Guanglu (X1323)
│   │   ├── foyan_qingyuan.json         # Instant Zen & Rain Sound (X1315)
│   │   ├── mazu_yulu.json              # Ordinary Mind is the Way (X1321)
│   │   ├── nanquan_yulu.json           # Water Buffalo & Peony Flower (X1315)
│   │   ├── deshan_yulu.json            # Thirty Blows & Longtan Candle (embedded T2076 / X1565)
│   │   ├── xuefeng_yantou.json         # Mount Ao Awakening (X1333)
│   │   ├── sengzhao_zhaolun.json       # Zhao Lun: Immutability of Things (T1858)
│   │   ├── hanshan_poems.json          # Cold Mountain Poems (SBCK/Zoku lineage; not Taishō)
│   │   ├── caoxi_zhuan.json            # Dunhuang Caoxi Biezhuan (X1598)
│   │   └── yuanwu_letters.json         # Yuanwu Xinyao Zen Letters (X1357)
│   ├── editorial/
│   │   └── traceability_queue.json     # 33 document-level seed locator reviews
│   ├── lineage/
│   │   ├── masters.json                # 34 profiles (incl. 4 frontier scaffolds)
│   │   ├── school_vocabulary.json      # Controlled school vocabulary (filter UI + graph colors)
│   │   ├── lineage_verification.json  # 30 edge records + 4 disclosed frontiers
│   │   └── profile_review_queue.json  # 34 exact-locator profile reviews
│   ├── translations/
│   │   ├── comparative_matrix.json     # 4 exemplar sentence-aligned matrix entries
│   │   ├── provenance.json             # Citation/status policy
│   │   └── rights_manifest.json        # Editorial third-party rights controls
│   ├── glossary/
│   │   └── chan_terms.json             # 31 Classical Chan & Buddhist lexicon terms
│   └── gongan/
│       ├── gongan_index.json           # 24 Gong'an cross-references index entries
│       └── theme_vocabulary.json       # Controlled 7-group theme taxonomy (drives index filter chips)
└── scripts/
    ├── build_data_bundle.py            # Bundles data/ and synchronizes /docs
    ├── arena_agent_pipeline.py         # Prompt templates & entry harness for sandboxed agent work
    ├── segment_classical.py            # Offline Classical Chinese segmenter (manual input)
    ├── validate_data.py                # Semantic/rights/locator validator + metrics generator
    ├── smoke_test.mjs                  # Dependency-free renderer regression test
    └── browser_test.mjs                # Optional Playwright real-browser suite (not in CI)
```

---

## 🛠️ Ongoing Editorial Maintenance Workflow

When new canonical texts or translations are added by editorial contributors:
1. Save the structured JSON file in `data/corpus/<name>.json`, add its display/order entry to `data/corpus_manifest.json`, and add a canonical locator record in `data/canonical_locators.json`. Verified modern quotations also require `source.source_id` plus `source.reference`, resolving to `data/translations/rights_manifest.json`. New lineage links require a source/status record in `data/lineage/lineage_verification.json`. Every master profile carries a `school_key` from `data/lineage/school_vocabulary.json` plus the matching canonical `school` display string — extend the vocabulary file first if a genuinely new group appears (the lineage filter UI and graph colors derive from it automatically). Gong'an index entries likewise carry a `theme_group` from `data/gongan/theme_vocabulary.json` (7 curated theme families drive the index chips); the per-entry `theme` string stays the rich, case-specific descriptor.
2. Regenerate and validate deterministic metrics:
   ```bash
   python3 scripts/validate_data.py --write-metrics
   python3 scripts/validate_data.py
   ```
3. Run the automated bundler and renderer regression test:
   ```bash
   python3 scripts/build_data_bundle.py   # updates app_data.js + syncs /docs
   node scripts/smoke_test.mjs
   ```
4. Commit generated metrics/bundle artifacts and push **to the session branch**:
   ```bash
   git add .
   git commit -m "feat: add new canonical text"
   git push origin <session-branch>
   ```

---

*TranslateChan is completely open-source, non-sectarian, and ready for long-term preservation and translation of ancient Chinese Chan literature.*
