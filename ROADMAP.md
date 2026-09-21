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
│    + matrix +   │    represented  │    entries       │    aggregation   │    Chinese     │
│    lineage +    │  • 100/100 rec.│  • 31/150+      │  • Book/edition │  • DDB / SAT   │
│    index +      │    Biyanlu part.│    Chan terms    │    verification  │  • Multi-ling  │
│    lexicon      │  • 36 manifests │  • Status/rights │  • Hover/focus  │    / lineage   │
│  • Smoke test   │    + locators   │    disclosure    │    citations     │    verification│
│  [5/5 rooms]    │  [0/36 complete]│  [31/150 terms] │  [5/36 re-keyed]│  [Planned]     │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴────────────────┘
```

> Statuses above are **measured on 2026-09-13** and each now names its own denominator. The previous `100% / ~30% / ~20% / ~40%` percentages dated from 2026-08-08 ([`sessions/AUDIT_archive_2026-08-08.md`](./sessions/AUDIT_archive_2026-08-08.md) §3) and are **retired, not re-estimated**: a bare percentage with no published denominator is the genre of claim this repository is eliminating, and no measurement in that archive states what each one was a percentage of.
>
> - **Phase 1 — `5/5 rooms`** · denominator: the five declared public rooms. `grep -c 'data-room-index' index.html` → **5** (`reader`, `matrix`, `lineage`, `gongan`, `lexicon`; full-text search is a cross-room feature, not a sixth room), all five exercised by `node scripts/smoke_test.mjs` (green). **Not** 100%: zero real-browser or screen-reader evidence exists (`scripts/browser_test.mjs` is optional and skips without Chromium), so the surface is implemented and unverified in a browser.
> - **Phase 2 — `0/36 complete`** · denominator: the 36 documents in `data/corpus/` measured against this phase's own target, *complete* canonical ingestion. `python3 -c "import json;m=json.load(open('data/project_metrics.json'))['corpus'];print(m['documents'],m['complete_documents'],m['excerpt_seed_documents'])"` → `36 [] 31`: no document is `complete_selected_witness`, 31 are excerpt seeds. The representation targets inside the box **are** met and are a different claim: 48/48 *Wumenguan* cases, 100/100 *Biyanlu* case records, 100/100 *Congronglu* case records, 36/36 manifest items, 248/248 declared case locators (but only 3 documents are case-level; 33 remain document-level seeds).
> - **Phase 3 — `31/150 terms`** · denominator: the lexicon's own stated 150+ foundational-term target (`len(json.load(open('data/glossary/chan_terms.json')))` → **31**). Matrix side, same phase: **4** exemplar passages carrying **21** translator registers (18 `reconstruction_unverified`, 2 `verified_quotation`, 1 `ai_draft`) — the box's "4 Matrix entries" counts passages, and 21 counts registers, and the two are not interchangeable.
> - **Phase 4 — `5/36 re-keyed` + Pages revamp complete pending owner approval** · denominator: corpus documents for W1, plus Pages system. Five documents were re-keyed to a pinned, digest-verified CBETA witness or labelled against one (PRs #29, #30, #32, #34, #35); the W1 inventory covered the then-35 documents; the 36th is the 2026-09-20 Congronglu reinstatement, extracted from the pinned T48n2004 witness and fully collated (100/100 cases, 500/500 source-content fields, 0 flagged); **24** documents carry provenance labels; **1,093 of 1,424** source-content fields collate. Presentation gap **closed (PR #40)**: 40 of 70 provenance-note strings render beside passages at 17 sites, 30 `coverage_note` stay ledgered by exemption, 120 rule checks. **Pages revamp track:** tokens 43 (35+8) + 6 scoped, serif Source Serif 4, gate, sheet, drawer, register, secondary rooms re-composed, 0 style=, CSP without unsafe-inline, 4 CSSOM writes, render-lazy, bundle raw 1,925,366 B <2 MB gzipped 586,529 B — Phases 1-3 merged main 3a6ae32 (PRs #48, #49, #50). Frozen PR-B/PR-D folded per C-5 (a), PR-A still frozen. Docs finalised in Phase4 PR, dated vision `WEB_VISION_2026-09-13.md`, owner light/dark desktop/mobile review pending.
> - **Phase 5 & 6 — `Planned`** · denominator: delivered units, of which there are none to count. The only active work in these phases is lineage verification, and it has moved nowhere: 31 internal edges, **all** `traditional_link_pending_exact_locator`, plus 4 frontiers (`data/lineage/lineage_verification.json`).
>
> **Attribution-integrity milestone (historical, 2026-08-08)**: provenance policy v2.2 is live (`data/translations/provenance.json`, explicit Reader/Matrix badges ✅/⚠️/🤖); **177 verified corpus quotation slots across 10 texts + 2 verified Matrix entries** (the Wumenguan quotation set covered 48/48 represented cases). Every verified source resolves through `rights_manifest.json`; this English quotation layer is separate from the current W1 source-collation status and rights decisions.

> **Website-design status (2026-08-11):** all five walnut rooms are implemented. After the owner found the result too plain/generic and too Chinese-dominant, the current branch introduced a bolder English-first factory/editorial hierarchy and three progressive copy-cleanup passes. PR #18 merged with green main Quality and Pages deployment; real-browser screenshots and accessibility evidence remain unavailable. See [`sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md`](./sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md).

> **W1 containment/status-model status (2026-09-09, corrected 2026-09-10, 2026-09-20):** the manifest now carries per-document source-review states from the full-corpus collation report/register. Current counts are **2** `collated_to_claimed_witness`, **32** `partial_or_failed_w1_collation`, and **2** `witness_unavailable`; complete selected-witness claims are blocked unless W1 status is collated. This state is remediation/containment evidence, not a rights decision. The Reader keeps **five separate, always-visible ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review. Edition-verified English quotations and rights review are never inferred from W1 collation, and represented-unit counts never establish source completion.
> W1 evidence: **38 documents, 630 flagged source fields** (authoritative 2026-09-20 Caoshan Benji overlay: `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json`, inheriting the 37 entries of the 2026-09-20 full-Jingde-Chuandeng-Lu overlay `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json`, itself inheriting the 36 entries of `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json`, the 35 entries of `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` plus the Congrong Lu reinstatement; historical 2026-09-09 register: `sessions/COLLATION_REGISTER_2026-09-09.json` with 34 documents and 622 flagged fields — the 637 figure in the 2026-09-09 report is **superseded**); 2,451 of 2,782 source-content fields collate to their claimed witness, and 22 documents have no collating source-content field at all. Authoritative record: `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json` (2026-09-20); historical record: `sessions/COLLATION_REGISTER_2026-09-09.json` (2026-09-09).
>
> **630 is the register; 486 is today's data — two different claims, and neither is a completion claim.** `630` is the flagged-source-field total *of the published authoritative register* named above, and it stays quoted as such wherever the validator pins it. A fresh collation of current `main` reports **486** flagged fields and **2,591 of 2,782** source-content fields collating to their claimed witness, because PRs #29/#30/#32/#34 re-keyed fields to their witnesses and the 2026-09-20 Congronglu reinstatement added 500 collating fields with no flags; the earlier 532/691 figures were published as a dated measurement record — [`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`](./sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json) with its report [`sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md`](./sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md) (2026-09-12, base `faff161`, kind `w1-post-remediation-measurement`, **not designated authoritative**, per the owner's ruling) — and are this measurement's predecessor, not the current one. The drop buys **no status**: manifest states are unchanged at 1 / 32 / 2, `corpus.complete_documents` is still empty, and all five documents touched by the campaign remain `partial_or_failed_w1_collation` — the new register's own `reproduction.documents_with_changed_status` is 0. Reduced flags are not a finished corpus — that misreading is exactly what the five-ledger separation exists to prevent.

---

## 🧾 Wave 1 source-integrity campaign (2026-09-10 → 2026-09-12)

Recorded here because, until this alignment, **no top-level document in the repository mentioned any of it**. The campaign is seven merged integrity work packages — PRs #29, #30, #32, #34, #35 (five documents) and #36, #37 (measurement) — read back with `gh pr list --state merged`. The same range also contains #31 and #33, which retired the scoreboard and its tracker/comment drift; they are not integrity packages and are not counted here.

**The five documents.** Harness deltas as recorded in each merged PR body; `C <key>` abbreviates `COLLATION_REFS=<refs> python3 scripts/collate_corpus.py --doc <key>` against the digest-verified reference set.

| document | PR | pinned witness | what was done | harness before → after |
|---|---|---|---|---|
| `wumenguan` | #29 | CBETA T48n2005 | every re-keyable W1-flagged source field re-keyed verbatim from the witness; the epilogue stays project text under an R-B `editorial_note` with no witness attribution | flagged **70 → 8**; content fields collating **113/181 → 175/181**; residual = 5 MINOR + 2 SHORT_UNMATCHED titles + the R-B epilogue |
| `biyanlu_cases` | #30 | CBETA T48n2003 | all **20** adjudicated content fields (12 DIVERGENT + 7 NOT_FOUND + 1 SHORT_UNMATCHED) re-keyed, each re-classifying EXACT; 2 additive R-B notes; 15 sibling pinyin fields rewritten | content flags **42 → 22**; flagged **128 → 108**; collating **353/395 → 373/395**; `zh_chars` 75658 → 75854 |
| `linji_yulu` | #32 | CBETA T47n1985 | **5** fields re-keyed (R-A); **3** NOT_FOUND 行錄 retellings kept as project text with `editorial_note` labels and no witness attribution (owner's 2026-09-11 per-field ruling); 2 MINOR untouched by policy | content flags **10 → 5**; flagged **84 → 79**; collating **79/89 → 84/89**; `zh_chars` 13993 → 14206 |
| `xinxin_ming` | #34 | CBETA T48n2010 | **12** DIVERGENT fields re-keyed by clause-anchored derivation from the reference (punctuation positions preserved); `.stanzas[31].zh` (NOT_FOUND) kept as labelled project text | content flags **13 → 1**; flagged **14 → 2**; collating **24/37 → 36/37** |
| `platform_sutra` | #35 | T48n2007 (Dunhuang) primary; T48n2008 (宗寶) alternative | **label-only — zero Chinese characters re-keyed.** Of 13 source-content fields: **1** verbatim in the primary witness, **3** in the alternative, **9** in neither and disclosed as project précis | document content CJK **680 → 680** (unchanged); document all-string CJK 905 → 989 (the notes); collation unchanged at 4/13 with 9 content flags |

**The measurement layer**: three independent witness inventories covering all **35** documents — [`WITNESS_INVENTORY.md`](./.orchestrator/WITNESS_INVENTORY.md) (family 1, the nine T47-recension documents; merged inside PR #35), [`WITNESS_INVENTORY_T48_T51.md`](./.orchestrator/WITNESS_INVENTORY_T48_T51.md) (family 2: T45/T48/T51 plus the witness-unavailable pair) and [`WITNESS_INVENTORY_XSERIES.md`](./.orchestrator/WITNESS_INVENTORY_XSERIES.md) (family 3: X-series), families 2–3 merged as PR #36 — consolidated, re-verified and ranked in PR #37's [`PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md): 70 P0 findings + 6 explicit `NONE` entries = **76 rows**, dispositioned **51 `LABEL`** (27 documents) / **11 `RE-KEY`** (10 documents) / **6 `CITATION`** / **2 `HUMAN-SOURCE`** / **6 `NONE`**, plus a **31-document** `OUT-OF-CBETA` human-sourcing queue that is explicitly **not agent-authorisable**.

**What the campaign established — and what it deliberately did not:**

- **All six `CITATION` rows are fixed (PR #43, 2026-09-12).** The worst of them was a false public claim the data carried: `zhaozhou_yulu`'s claimed witness **T1987 is false** — T1987 (T47n1987A/B) is the **Caoshan** record (extracted head 曹山大師語錄序; 趙州 occurs 1× against 曹山 25×/28× in the pinned witnesses) — and the claim is now **withdrawn everywhere it stood**: `data/corpus/zhaozhou_yulu.json` (`cbeta_id`, `coverage_note` and the two verified-quotation `reference` strings), `data/corpus_manifest.json` (`cbeta`), the `canonical_locators` and `traceability_queue` seeds, and the lineage edge `reference`. It is **not** re-pointed: the candidate Guzunsu yulu work X68n1315 is unverified — a probe with it as the sole witness collates 2 of 19 content fields, and the probe's 10 EXACT fields are 9 `title_zh` metadata fields plus 1 content field. Ranks 3–6 (`fayan_yulu`, `dongshan_yulu`, `mazu_yulu`, `dahui_hongzhi`) are fixed in the same PR and now name the witnesses the harness actually pins.
- **Representation ≠ completion.** 48/48 *Wumenguan* cases, 100/100 *Biyanlu* case records and 37/37 *Xinxin Ming* stanzas remain representation claims; re-keying upgraded no status, and every document above is still `partial_or_failed_w1_collation`.
- **No source text was generated.** Every re-keyed graph came from a pinned, digest-verified CBETA reference (39 verified / 0 drift at XML P5 revision `dbdea41071e1e260ad84b72faefd4587333cf76d`), and `scripts/test_source_preservation.py` byte-compares `data/corpus/` against base commit `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43` permitting only exact allowlisted JSON pointers (218 permitted changes, 0 unauthorized on the 2026-09-12 run).
- **Owed, in order:** the *designation half* of the post-remediation evidence pass — the measurement half is published (2026-09-12 register; `documents_with_changed_status: 0`), but the authoritative figure cannot honestly move from 630 to 532 until the owner-ruled evidence-model change release blocker 1 describes — the six `CITATION` fixes, the 51 `LABEL` rows, the owner's fabricated-text decision ([`PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md) → `## Owner decision required`), and the human-sourcing queue. Label visibility in the reader is **delivered** (PR #40; release blocker 2 ticked — implemented and gate-guarded, not browser-verified). [`RESEARCH_RELEASE_PLAN.md`](./RESEARCH_RELEASE_PLAN.md) carries the blockers.

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
  - Instant client-side search across **all 36 active texts and primary schema shapes**, including case pointers (accurate matching-unit counts, highlighting, and jump-to-anchor — [`sessions/AUDIT_archive_2026-08-08.md` §10](./sessions/AUDIT_archive_2026-08-08.md#10-2026-08-08--current-independent-audit-post-pr-3)).
  - **Functional UX and five-room design implemented; English-first refinement merged (2026-08-11):** current work addresses owner feedback on generic styling, Chinese-dominant hierarchy, and repetitive copy; screenshot/accessibility evidence remains. See [`UX_ROADMAP.md`](./UX_ROADMAP.md) and the [current audit](./sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md).
  - Synchronized `/docs/` deployment bundle and handoff guide in [`HANDOFF.md`](./HANDOFF.md).
- [x] **Core Foundational Corpus** (36 active files: 35 after the 2026-08-10 Congronglu quarantine, plus the 2026-09-20 reinstatement of Congronglu itself from the pinned T48n2004 witness; editorial completion status is explicit in the manifest):
  1. *Wumenguan* (無門關 / The Gateless Gate, T2005 — **48/48 cases represented; partial/failed W1 source collation** + preface + epilogue; re-keyed to the pinned T48n2005 witness in PR #29, epilogue labelled project text)
  2. *Linji Yulu* (臨濟語錄 / T1985 — 74 recorded sections; partial selected witness; 5 fields re-keyed to T47n1985 and 3 行錄 retellings labelled project text in PR #32)
  3. *Huangbo Chuanxin Fayao* (黃檗傳心法要 / T2012A — opening sections)
  4. *Zhaozhou Yulu* (趙州語錄 / recorded-saying extracts — its recorded witness claim T1987 is **false**: T1987 is the Caoshan record; the claim was **withdrawn** in PR #43 (2026-09-12) rather than re-pointed, because the candidate in-set witness X68n1315 is unverified at 2 of 19 content fields, so these extracts remain project text with no verified witness)
  5. *Xinxin Ming* (信心銘 / T2010 — 37/37 stanzas represented; partial/failed W1 source collation; 12 fields re-keyed to the pinned T48n2010 witness in PR #34, stanza 31 kept as labelled project text)
  6. *Baojing Sanmei* (寶鏡三昧 / opening stanzas)
  7. *Biyanlu* (碧巖錄 / T2003 — **100/100 case records represented; partial selected witness**; all 20 adjudicated content fields re-keyed to the pinned T48n2003 witness in PR #30)
  8. *Platform Sutra* (六祖壇經 — 10/10 chapter headings represented by selected excerpts; **not complete**. Labelled in PR #35 against two recensions: primary witness T48n2007 (Dunhuang), alternative T48n2008 (宗寶). Of its 13 source-content fields, 1 is verbatim in the primary witness, 3 in the alternative and 9 in neither — those 9 are disclosed as condensed project précis, 680 content CJK, zero characters re-keyed)
  9. *+27 further yulu, treatises & poems* (Mazu, Nanquan, Dongshan + Five Ranks, Yunmen, Fayan, Guiyang, Dahui, Hongzhi, Shitou, Hanshan, Sengzhao, monastic codes, Dunhuang texts…)

---

## 📍 Phase 2: Complete Canonical Ingestion & Data Structuring (In Progress)

- [x] **Data Contract & Release Guardrails**:
  - Heterogeneous JSON shapes for cases, sections, dialogues, stanzas, chapters, five ranks, and sample records are supported by the renderer and described in [`schemas/translatechan-data.schema.json`](./schemas/translatechan-data.schema.json).
  - `scripts/validate_data.py` enforces semantic invariants, shared corpus-manifest integrity, translation provenance, rights-manifest coverage, case-level locator coverage, and deterministic metrics; `.github/workflows/quality.yml` runs Python compilation, data validation, deterministic artifact checks, deploy-mirror verification, and reader smoke coverage on pushes and pull requests.
  - `data/canonical_locators.json` covers all 36 active documents and 248 case records (48 Wumenguan + 100 Biyanlu + 100 Congronglu). Thirty-three non-case documents remain at document granularity; Linji and Xinxin include limited unit-locator pilots. The quarantined Congronglu locator claims were removed after authoritative T48n2004 headings disproved their case numbering/page claims; the reinstated document's 100 case locators are heading-line anchors read from the same pinned witness, and they reproduce the five anchors the 2026-08-10 containment table recorded. `data/editorial/traceability_queue.json` tracks the 33 document-level migrations.
  - `data/lineage/lineage_verification.json` aggregates all 31 in-set graph links and 4 unprofiled frontiers with source-record status; `data/lineage/profile_review_queue.json` tracks all 35 profiles (1 in review, 30 awaiting exact locators, 4 frontier-source tasks). The public chart never renders a link as source-verified until exact locators are reviewed.
- [x] **Ingestion Tooling (seed level)**:
  - `scripts/segment_classical.py` — offline punctuation-based Classical Chinese sentence segmenter (manual input; no live CBETA fetching yet). `scripts/ingest_cbeta.py` remains as a deprecated compatibility wrapper.
  - `scripts/validate_data.py` — dependency-free schema/semantic/rights/locator validation + metrics generation.
  - `scripts/build_data_bundle.py` — manifest-driven bundle compiler + `/docs` sync.
  - `scripts/smoke_test.mjs` — regression test exercising every corpus text through the renderer.
- [ ] **Ingestion Tooling (to build)**:
  - Real CBETA source fetching/normalization (Kanripo API or CBETA TEI download).
  - `scripts/align_translations.py` — sentence-level translation alignment (not yet written).
- [ ] **Full-Text Ingestion Targets** (status re-derived 2026-09-12; the Wave 1 section above carries the per-document harness deltas):
  - [~] Wumenguan (**48 / 48 cases represented; partial/failed W1 source collation** — source re-keyed to the pinned T48n2005 witness in PR #29, so per-document *re-keying* is done and what remains is the post-remediation evidence pass plus the documented residual: 5 MINOR fields, 2 SHORT_UNMATCHED `title_zh` composites, and the R-B-labelled project epilogue; the verified Senzaki & Reps quotation layer is separate)
  - [~] Biyanlu (**100 / 100 case records represented; partial selected witness** — re-keyed to the pinned T48n2003 witness in PR #30; post-verse commentary, 22 MINOR fields, 86 `title_zh` metadata flags, one disclosed unfixed coverage gap (case 42's 垂示) and human collation sign-off remain pending; N/N representation is not full-work completion)
  - [~] Linji Yulu (**74 recorded sections** — re-keyed to the pinned T47n1985 witness in PR #32 with three 行錄 retellings kept as labelled project text, and the false "74 / 74 canonical sections complete across all 4 divisions" `coverage_note` replaced by an honest disclosure; selected-witness completeness, 2 MINOR `<g>`-apparatus fields, 74 `title_zh` metadata flags and full unit-level verification remain pending)
  - [~] Xinxin Ming (**37 / 37 stanzas represented** — 12 of 13 flagged content fields re-keyed to the pinned T48n2010 witness in PR #34, content CJK unchanged at 584; the 13th, `.stanzas[31].zh`, is NOT_FOUND and was kept whole under an R-B `editorial_note` because the alignment span would have deleted a canonical line and duplicated stanza 33; 1 `title_zh` metadata flag remains)
  - [~] Platform Sutra (**10 / 10 chapter headings represented by selected excerpts** — labelled against two recensions in PR #35, zero characters re-keyed; 9 of 13 source-content fields are disclosed project précis with no witness, so the text decision — keep them labelled or re-key to the Dunhuang witness — is an open owner item in `.orchestrator/PHASE2_PLAN.md`)
  - [x] Congronglu / Book of Serenity — **reinstated 2026-09-20** (task 043) from the authoritative T48n2004 TEI with field-level collation: 100/100 cases, 500/500 source-content fields EXACT against the pinned witness, 0 flagged, no quarantined record copied; the containment gate set (producer contract, containment anchors, anti-placeholder checks, collation ≥90/100) is met and the one evidence caveat — no reproducible 2026-09-09 anchor for that reference — is adjudicated in `sessions/COLLATION_W1_2026-09-20_CORRECTION.md` §4. Open: human editorial sign-off, unrepresented front matter and interlinear 著語 apparatus, and gong'an indexing of the 100 cases
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

## 📍 Phase 4: Source Verification, Disclosure & Editorial Workflow + Pages Revamp Final (2026-09-13)

> **Public Pages scope:** the published GitHub Pages app is a reader, comparative matrix, lineage explorer, gong'an index, and lexicon. The Translation Studio, Arena AI Agents view, and header GitHub link are deliberately removed from the public navigation. Editorial/AI-assisted work may exist in repository data, but it is never presented as a public product feature or as a human scholar’s voice.

> **Pages revamp track (2026-09-13, Phases 1-3 merged main 3a6ae32) — FINAL:**
> - Tokens 43 total (35 in :root + 8 dark) + 6 scoped composition dials, down from 63; serif Source Serif 4 for hook/headings/translations (C-2); gate lintel/directory/beam (C-1); Reader minimal sheet + drawer band + thin register, 41 style=→0, render-lazy (C-4); secondary rooms collation table / transmission register / case catalogue / dictionary, 0 style=, CSP without unsafe-inline (PR-B folded), bundle <2 MB raw 1,925,366 B gzipped 586,529 B (Phase-3 measurement; the 36-document bundle of 2026-09-20 measures raw 2,525,870 B / gzipped 787,454 B, so the tracking line is exceeded — never a gate), render-lazy (PR-D folded); frozen PR-B/PR-D closed as folded, PR-A still frozen; docs finalised README/HANDOFF/AUDIT/ROADMAP + dated vision WEB_VISION_2026-09-13.md; OPERATIONS Edit1 closed structurally by O-3; owner light/dark desktop/mobile review pending on live Pages — no self-declared completion. See WEB_VISION_2026-09-13.md for full measurements.

> **Owner review 2026-09-14 (ask_user):** Light/dark desktop/mobile functional, but UX insufficient — layout really bad for human reader. Overhauling for human-readable, easy-of-use, welcoming space is highest priority. AI agents limited, heavily rely on user feedback to forge vision. Real-browser CI: keep_frozen. Implication: Phases 1-3 functionally complete and gate-green (43 tokens, 0 style=, CSP without unsafe-inline, 4 CSSOM writes, render-lazy, bundle <2MB), but next top priority is human-readable overhaul — new proposal-first track beyond Phase B.

> **Web polish + validation-depth queue clear (2026-09-14, task 008 — P3.8-P3.11):** before returning to the human-readable overhaul, the low/medium documentation queue was cleared in one bundled PR so it cannot drift further underneath that work. Delivered: `response_summary.md` removed from repository root (archived to `sessions/RESPONSE_SUMMARY_2026-09-10.md`, `.gitignore` now blocks a future root copy); [`SECURITY.md`](./SECURITY.md) added (GitHub Security Advisories, no email, `main` only); `og-image.png` (1200×630, deterministic PNG rasterized from `og-image.svg`) added as the primary social-card image with the SVG kept as a secondary `og:image`; `docs/audits/` vs `sessions/` split documented in `AUDIT.md`/`HANDOFF.md` (curated public mirror vs full append-only evidence); the three frontier lineage profiles (`prajnatara`, `yangqi_fanghui`, `dahong_zuzheng`) and the 30 `traditional_link_pending_exact_locator` edges are now explicitly documented as by-design frontier/later-tranche states, not bugs; `scripts/validate_data.py` gained optional JSON Schema execution plus new semantic checks (gong'an `cross_refs`/`protagonist` cross-references, `evidence_source` enum on translator profiles) without weakening any existing gate; `OPERATIONS.md` records that Edit 1 stays closed structurally by O-3 on this main and that Edits 2-3 remain owner-held. No corpus Chinese field, rights record, workflow file, or the 630 authoritative W1 figure was touched.



> **Measured status refresh 2026-09-20 (P2 core-yulu authenticity labels, task 047):** the corpus carries **101** provenance-note strings across four keys (`cbeta_note` 22, `coverage_note` 36, `editorial_note` 29, `recension_note` 14), **65 of 101** rendering beside a passage (the 36 `coverage_note` lines stay ledgered by exemption), **29** documents carrying at least one label (unchanged — `baizhang_guanglu` and `huangbo_wanling` already carried labels) — task 047 adds 6 per-field R-B `editorial_note` labels to `baizhang_guanglu` and 7 plus one new `cbeta_note` to `huangbo_wanling`, rewrites the Huangbo `coverage_note` as the full per-field disclosure of the re-measured 0/7 (40-work pinned set, refs 40 verified / 0 drift), and lands no re-key (no verbatim carrier).
> **Measured status refresh 2026-09-20 (Caoshan Benji ingest):** the corpus carries **87** provenance-note strings across four keys (`cbeta_note` 21, `coverage_note` 36, `editorial_note` 16, `recension_note` 14), **51 of 87** rendering beside a passage (the 36 `coverage_note` lines stay ledgered by exemption), **29** documents carrying at least one label — the new Caoshan Benji document adds one rendered `cbeta_note` and one exempted `coverage_note`; the W1 register's document count moves 37 → 38 with the flagged total unchanged at 630.
> **Measured status refresh 2026-09-20 (full 30-fascicle Jingde Chuandeng Lu ingest):** the corpus carries **85** provenance-note strings across four keys (`cbeta_note` 20, `coverage_note` 35, `editorial_note` 16, `recension_note` 14), **50 of 85** rendering beside a passage (the 35 `coverage_note` lines stay ledgered by exemption), **28** documents carrying at least one label — the new document adds one `cbeta_note` and one `coverage_note`, and its units carry no note of their own.
> **Measured status refresh 2026-09-20 (Congronglu reinstatement):** the corpus carries **83** provenance-note strings across four keys (`cbeta_note` 19, `coverage_note` 34, `editorial_note` 16, `recension_note` 14), **49 of 83** rendering beside a passage (the 34 `coverage_note` lines stay ledgered by exemption), **27** documents carrying at least one label — the new document adds one `cbeta_note` and one `coverage_note`, and the reinstated document's own coverage disclosure is one of the 31 ledgered `coverage_note` lines, so 49 of 83 render beside their passages and the remaining 34 stay ledgered.
> **Measured status refresh 2026-09-17 (after RE-KEY PRs #59–#67, sengzhao_zhaolun in progress):** the corpus carries **81** provenance-note strings across four keys (`cbeta_note` 18, `recension_note` 14, `coverage_note` 33, `editorial_note` 16); **48 of 81** note strings render at passage level (the three rendered keys `recension_note` → `editorial_note` → `cbeta_note` at 26 documents); the remaining **33** are `coverage_note` ledger strings under the recorded exemption. CJK totals measured **104,975 content / 111,708 all-string** after the sengzhao_zhaolun re-key. The authoritative flagged total remains 630 (2026-09-10 register); the latest measurement record is not re-designated.
>
> **Measured status 2026-09-12 — this phase moved the most, and it still has an unfilled gap.** Delivered: a witness-pinned collation harness (`scripts/collate_refs.py` → `scripts/collate_corpus.py` → `scripts/w1_evidence.py`, with `scripts/test_source_preservation.py` and `scripts/test_source_review_rules.py` as gates), **35/35** documents independently inventoried against the pinned CBETA reference set (39 references, 39 verified / 0 drift at XML P5 revision `dbdea41071e1e260ad84b72faefd4587333cf76d`), **24** documents carrying a provenance label (`cbeta_note` 17 + `editorial_note` 6 + `recension_note` 1, no overlap), and **5** documents re-keyed or labelled (PRs #29, #30, #32, #34, #35 — table in the Wave 1 section above). Measured field state: **593 of 924** source-content fields collate to their claimed witness, **22** documents have no collating source-content field at all (the 23 labelled documents and these 22 are not the same set — 16 documents are in both; 6 have no collating field *and* no label, among them `guiyang_yulu`, `yunmen_yulu`, `qinggui_monastic_codes`; and 7 carry a label while collating at least partly, among them the five Wave 1 documents `wumenguan`, `biyanlu_cases`, `linji_yulu`, `xinxin_ming`, `platform_sutra`, whose labels are the campaign's own `editorial_note`/`recension_note` additions), and **391** `title_zh`/`name_zh` metadata fields sit in a separate measured partition (the metadata-exclusion caveat, the containment-not-rights scope sentence and the non-approval-of-reuse sentence are required verbatim of `README.md`/`AUDIT.md`/`HANDOFF.md` only — their absence from this file is by design, not an omission to repair).
>
> **The gap, closed further (2026-09-20).** The evidence model now chains dated overlays (2026-09-20 inherits 2026-09-10's 35 entries and adds one measured document), so the authoritative record can grow without re-designating the figure it carries. (1) *Presentation — closed by PR #40; release blocker 2 ticked, with the not-browser-verified qualifier:* the corpus carries **70** provenance-note strings — `cbeta_note` 17, `recension_note` 14, `coverage_note` 30, `editorial_note` 9 — and one shared renderer now prints the three passage-level keys (precedence `recension_note` → `editorial_note` → `cbeta_note`, one line each, never concatenated) at **17** content sites covering every node type that carries a note (document root, preface/epilogue, case, section, dialogue, stanza, chapter and nested verse entries): **40 of the 70** strings now render beside their passage. The 17 recorded citation corrections — including `caoxi_zhuan`'s correction of the prior "X1458" citation (X1458 is 宗門寶積錄; the 曹溪大師別傳 is X86n1598 plus Dunhuang P.3018) — the 8 labels marking retained project retellings as having no witness attribution (`linji_yulu` sections 71–73, `xinxin_ming` stanza 31), and `platform_sutra`'s root recension note — the disclosure that 9 of its 13 source-content fields are project précis — now reach a reader alongside its 6 chapter + 4 dialogue recension notes (the document holds 14 in all: 1 root + 3 verse + 6 chapter + 4 dialogue; only the 3 verse-level ones rendered before). The **30** `coverage_note` strings deliberately do not render beside passages: document-scale ledger fields, they keep their one rendering as the "Reading" row of the represented-units ledger and are the sole explained exemption (`NOTE_RENDER_EXEMPTIONS` in `scripts/test_source_review_rules.py`, reason recorded), so the honest figure is **40 of 70**, never "all 70". The gate is data-driven and permanent: §15 of `scripts/test_source_review_rules.py` enumerates `*_note` keys from the data at run time and fails on any key neither rendered nor exempted (the suite now runs **120** rule checks), but no real-browser run is on record. (2) *Evidence:* the post-remediation register is now published — [`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`](./sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json) + [`sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md`](./sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md) (532 flagged fields, 691/924 content fields collating, no status change) — but it is a measurement record, not a designation, so the surviving half of the gap is that the authoritative flagged total is still the 2026-09-10 register's **630**: re-designating the evidence means converting `scripts/w1_evidence.py`'s fixed historical/overlay pair into a chain, which is queued as its own owner-ruled change (see the framing note above the Wave 1 section). Neither number is a completion claim.

- [~] **Source aggregation & verification**:
  - Aggregate Classical Chinese text from a recorded primary source (CBETA/TEI, Taishō, Zokuzōkyō, or named manuscript/edition), retaining canonical ID plus a locator appropriate to the source (case, fascicle, page/line, or TEI anchor).
  - Verify source text against that recorded source before display; do not upgrade a seed excerpt to “verified” merely because it is widely mirrored online.
  - Verify published translations against the named **book/edition**, translator, and page or stable section reference. A web mirror may assist wording comparison but never substitutes for bibliographic provenance or rights review.
- [~] **Content disclosure contract**:
  - ✅ The public Reader and Matrix now render canonical source locations plus hover/focus/touch citation popups. The Reader also shows each document's W1 source-review state (`collated_to_claimed_witness`, `partial_or_failed_w1_collation`, or `witness_unavailable`) as a visible ledger item. These are containment/remediation states, not rights decisions; until a page/line or TEI locator exists, the UI shows an honest `Locator pending`/document-level status rather than implying unit-level collation.
  - ✅ Every displayed translation now renders translator, translation status, book/edition, page/section reference state, edition-verification status, and citation/rights identifier. Measured 2026-09-12 (the previous "135 recorded / 5 pending" figures were stale): **176 of 179** verified source records carry a recorded reference and **3** are pending (`data/project_metrics.json` → `translations.verified_reference_coverage`): **2** in the corpus, where **175** of the 177 verified-quotation `reference` fields record a case/page/section state and 2 state `translation book episode/page pending` explicitly (both `zhaozhou_yulu`, whose false witness claim was withdrawn in PR #43 — those two `reference` strings now name the candidate X68n1315 as unverified, and their pending state is unchanged, so this split does not move), and **1** in the Matrix (the R.H. Blyth register for Wumenguan case 1, `Case I (Hokuseido print page pending)`). The "135 recorded / 5 pending" figures this line previously carried were stale. Replacing the pending values is a blocking editorial task, not a silent omission. Edition verification and rights approval remain separate from W1 source collation.
  - ✅ Every AI-produced or AI-reconstructed item is visibly marked **AI draft** or **register reconstruction**; it never appears as a verified quotation or a scholar’s verbatim translation.
  - ✅ Citation/source badges are available by hover, keyboard focus, and touch popup in Reader and Matrix; future public surfaces must use the same component.
- [ ] **Editorial review queue** (re-derived 2026-09-12 from `.orchestrator/PHASE2_PLAN.md`, whose 76 consolidated rows carry a reproduce command each):
  - Upgrade the 33 `legacy_document_seed` locator records to page/line or TEI anchors (queue state: 30 `needs_unit_locator`, 3 `in_review`).
  - Complete human rights/editorial review for each of the **14** sources in `rights_manifest.json` before broader quotation reuse; all 14 remain pending and no ledger records a rights decision.
  - **Publish the post-remediation evidence pass** — measurement half done (2026-09-12): the dated register and report are committed as [`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`](./sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json) + [`sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md`](./sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md) (630 → 532 flagged fields, 593 → 691 of 924 content fields collating, statuses unchanged at 1 / 32 / 2, `documents_with_changed_status: 0`). **Re-designation half — resolved 2026-09-20 by the owner-ruled chain extension:** the authoritative record is now the 2026-09-20 overlay (`scripts/w1_evidence.py`'s `FIXED_METADATA` points at it), which inherits the 2026-09-10 overlay's 35 entries verbatim and records the Congronglu reinstatement as the 36th document. The designated flagged total therefore stays **630** — the new document contributes none — while today's data measures **486** flagged fields and **1,233 of 1,424** content fields collating. The five re-keyed/labelled documents keep `partial_or_failed_w1_collation` on the inherited evidence: 630 keeps its register role and 486 is published as a measurement, exactly as the ruling requires.
  - **Fix the 6 `CITATION` rows — delivered by PR #43 (2026-09-12)**: `zhaozhou_yulu`'s manifest claim and its `coverage_note` both cited a witness that is **false** — T1987 is the Caoshan record — and the claim is withdrawn rather than re-pointed (the candidate X68n1315 is unverified at 2 of 19 content fields); `fayan_yulu` now names T47n1991 (with the X63n1226 gap for 宗門十規論 recorded), `dongshan_yulu` names T47n1986A/B, `mazu_yulu` names X69n1321 with its count corrected to the 8 source-content fields the harness evaluates, and `dahui_hongzhi`'s manifest citation names T48n2001, the 默照銘 witness. No source text was re-keyed and no status was upgraded.
  - **Render the labels that already exist — delivered by PR #40 (2026-09-12)**: one shared renderer prints the three passage-level keys at **17** content sites — **40 of the 70** note strings beside their passages (see the gap note above) — while the 30 `coverage_note` strings remain in the represented-units ledger as the one recorded, reason-carrying exemption, and §15 of `scripts/test_source_review_rules.py` fails CI on any future orphan key. Implemented and gate-guarded; no real-browser evidence exists, so it is not browser-verified (release blocker 2 ticked on that basis).
  - Work the **51 `LABEL` rows** (27 documents) and **11 `RE-KEY` rows** (10 documents) under the adopted R-A/R-B/R-C policy, one document per PR.
  - **Owner decisions, not agent work:** the fabricated-text ruling for material attested in no pinned reference ([`PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md) → `## Owner decision required`), and the **31-document `OUT-OF-CBETA` human-sourcing queue** (Dunhuang P.3018, P.2125, P.2885/S.5619, 趙州錄 editions, the 白頭宮女 recension of the Five Ranks, the SBCK/Zokuzōkyō Hanshan lineage …) — explicitly **not agent-authorisable**: no agent may fetch, transcribe or evaluate those witnesses.

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
├── index.html              # GitHub Pages entry point (fast, zero-backend, responsive SPA; 5 public rooms)
├── app.css / app.js / app_data.js
├── theme-init.js           # Pre-paint persisted-theme bootstrap (dark-mode FOUC guard)
├── schemas/                # Formal source-data contract (declarative; the Python validator is the enforced contract)
├── docs/                   # Byte-identical Pages copy (served from main /docs)
├── vision.md               # Grand Vision & Architectural Blueprint (+ §1.1 measured distance to each objective)
├── ROADMAP.md              # Project Roadmap & Milestone Tracker (this file)
├── RESEARCH_RELEASE_PLAN.md# Evidence-first release standard + release-blocking checklist
├── README.md / HANDOFF.md / AUDIT.md / OPERATIONS.md / AGENTS.md
├── UX_ROADMAP.md / WEB_VISION_2026-08-10.md
├── sessions/               # Dated, append-only evidence (W1 reports, registers, refs manifests, audits)
├── .orchestrator/          # Coordination: STATE.md, REMEDIATION_PLAN.md, PHASE2_PLAN.md, 3 WITNESS_INVENTORY files
├── data/
│   ├── corpus_manifest.json    # Shared reader/bundle ordering manifest + per-document W1 source-review state
│   ├── canonical_locators.json # Document/case source-locator registry (248/248 cases; 33 document-level seeds)
│   ├── project_metrics.json    # Deterministic generated project counts (incl. the corpus.source_review aggregate)
│   ├── corpus/                 # 35 active structured source files — 0 complete / 4 partial selected witness / 31 excerpt seeds
│   ├── editorial/              # traceability_queue.json (33 source-locator reviews)
│   ├── lineage/                # masters.json (35 profiles) + verification (31 links / 4 frontiers) + queues + school vocabulary
│   ├── translations/           # comparative_matrix (4 passages / 21 registers), provenance, translator profiles, rights manifest (14 sources)
│   ├── glossary/               # chan_terms.json (31 terms)
│   └── gongan/                 # gongan_index.json (24 cases) + theme vocabulary (7 groups)
└── scripts/                # Ingestion, validation, collation & test tools (ls scripts/ → 15 files)
    ├── segment_classical.py    # Offline segmenter (manual input; no live CBETA fetching)
    ├── ingest_cbeta.py         # Deprecated compatibility wrapper
    ├── validate_data.py        # Semantic/rights/locator validator + metrics generator + doc-truthfulness gate
    ├── build_data_bundle.py    # Manifest-driven deterministic bundle + /docs sync
    ├── collate_refs.py         # W1: extract the 39 CBETA references + verify every digest
    ├── collate_corpus.py       # W1: collate every source-content field against the pinned witnesses
    ├── w1_evidence.py          # W1: recompute every published figure; --write-metrics is protected
    ├── source_review.py        # Shared source-review status/completion rules
    ├── test_source_preservation.py  # Byte-compares data/corpus/ against the pinned base + exact allowlist
    ├── test_source_review_rules.py  # 120 source-review rule checks (mutation matrix included)
    ├── smoke_test.mjs          # Dependency-free renderer regression test
    ├── compat_runtime_check.mjs # Runtime completion/status compatibility checks
    ├── browser_test.mjs        # Optional Playwright suite (skips without Chromium; not in CI)
    ├── arena_agent_pipeline.py # Agent prompt templates & entry harness (not a public surface)
    ├── migrate_translations.py # One-off migration utility
    └── align_translations.py   # (planned — not yet written)
```

> Deployment is native GitHub Pages branch publishing (`main` + `/docs`). The GitHub Actions Quality workflow verifies repository quality only; it does not deploy Pages.
