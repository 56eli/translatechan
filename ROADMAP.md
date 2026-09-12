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
│    lexicon      │  • 35 manifests │  • Status/rights │  • Hover/focus  │    / lineage   │
│  • Smoke test   │    + locators   │    disclosure    │    citations     │    verification│
│  [5/5 rooms]    │  [0/35 complete]│  [31/150 terms] │  [5/35 re-keyed]│  [Planned]     │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴────────────────┘
```

> Statuses above are **measured on 2026-09-12** and each now names its own denominator. The previous `100% / ~30% / ~20% / ~40%` percentages dated from 2026-08-08 ([`sessions/AUDIT_archive_2026-08-08.md`](./sessions/AUDIT_archive_2026-08-08.md) §3) and are **retired, not re-estimated**: a bare percentage with no published denominator is the genre of claim this repository is eliminating, and no measurement in that archive states what each one was a percentage of.
>
> - **Phase 1 — `5/5 rooms`** · denominator: the five declared public rooms. `grep -c 'data-room-index' index.html` → **5** (`reader`, `matrix`, `lineage`, `gongan`, `lexicon`; full-text search is a cross-room feature, not a sixth room), all five exercised by `node scripts/smoke_test.mjs` (green). **Not** 100%: zero real-browser or screen-reader evidence exists (`scripts/browser_test.mjs` is optional and skips without Chromium), so the surface is implemented and unverified in a browser.
> - **Phase 2 — `0/35 complete`** · denominator: the 35 documents in `data/corpus/` measured against this phase's own target, *complete* canonical ingestion. `python3 -c "import json;m=json.load(open('data/project_metrics.json'))['corpus'];print(m['documents'],m['complete_documents'],m['excerpt_seed_documents'])"` → `35 [] 31`: no document is `complete_selected_witness`, 31 are excerpt seeds. The representation targets inside the box **are** met and are a different claim: 48/48 *Wumenguan* cases, 100/100 *Biyanlu* case records, 35/35 manifest items, 148/148 declared case locators (but only 2 documents are case-level; 33 remain document-level seeds).
> - **Phase 3 — `31/150 terms`** · denominator: the lexicon's own stated 150+ foundational-term target (`len(json.load(open('data/glossary/chan_terms.json')))` → **31**). Matrix side, same phase: **4** exemplar passages carrying **21** translator registers (18 `reconstruction_unverified`, 2 `verified_quotation`, 1 `ai_draft`) — the box's "4 Matrix entries" counts passages, and 21 counts registers, and the two are not interchangeable.
> - **Phase 4 — `5/35 re-keyed`** · denominator: corpus documents. Five documents were re-keyed to a pinned, digest-verified CBETA witness or labelled against one (PRs #29, #30, #32, #34, #35 — see the Wave 1 section below); all **35** were independently inventoried against the pinned witness set; **22** documents carry provenance labels; **593 of 924** source-content fields collate. The explicit unfilled gap: the corpus carries **49** provenance notes and the reader renders **one** site, so most labels never reach a reader (Phase 4 detail below).
> - **Phase 5 & 6 — `Planned`** · denominator: delivered units, of which there are none to count. The only active work in these phases is lineage verification, and it has moved nowhere: 30 internal edges, **all** `traditional_link_pending_exact_locator`, plus 4 frontiers (`data/lineage/lineage_verification.json`).
>
> **Attribution-integrity milestone (historical, 2026-08-08)**: provenance policy v2.2 is live (`data/translations/provenance.json`, explicit Reader/Matrix badges ✅/⚠️/🤖); **177 verified corpus quotation slots across 10 texts + 2 verified Matrix entries** (the Wumenguan quotation set covered 48/48 represented cases). Every verified source resolves through `rights_manifest.json`; this English quotation layer is separate from the current W1 source-collation status and rights decisions.

> **Website-design status (2026-08-11):** all five walnut rooms are implemented. After the owner found the result too plain/generic and too Chinese-dominant, the current branch introduced a bolder English-first factory/editorial hierarchy and three progressive copy-cleanup passes. PR #18 merged with green main Quality and Pages deployment; real-browser screenshots and accessibility evidence remain unavailable. See [`sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md`](./sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md).

> **W1 containment/status-model status (2026-09-09, corrected 2026-09-10):** the manifest now carries per-document source-review states from the full-corpus collation report/register. Current counts are **1** `collated_to_claimed_witness`, **32** `partial_or_failed_w1_collation`, and **2** `witness_unavailable`; complete selected-witness claims are blocked unless W1 status is collated. This state is remediation/containment evidence, not a rights decision. The Reader keeps **five separate, always-visible ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review. Edition-verified English quotations and rights review are never inferred from W1 collation, and represented-unit counts never establish source completion.
> W1 evidence: **35 documents, 630 flagged source fields** (authoritative 2026-09-10 correction register: `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`; historical 2026-09-09 register: `sessions/COLLATION_REGISTER_2026-09-09.json` with 34 documents and 622 flagged fields — the 637 figure in the 2026-09-09 report is **superseded**); 593 of 924 source-content fields collate to their claimed witness, and 22 documents have no collating source-content field at all. Authoritative record: `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (2026-09-10); historical record: `sessions/COLLATION_REGISTER_2026-09-09.json` (2026-09-09).
>
> **630 is the register; 532 is today's data — two different claims, and neither is a completion claim.** `630` is the flagged-source-field total *of the published authoritative register* named above, and it stays quoted as such wherever the validator pins it. A fresh collation of current `main` reports **532** flagged fields and **691 of 924** source-content fields collating to their claimed witness (up from 593), because PRs #29/#30/#32/#34 re-keyed fields to their witnesses; those figures are now published as a dated measurement record — [`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`](./sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json) with its report [`sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md`](./sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md) (2026-09-12, base `faff161`, kind `w1-post-remediation-measurement`, **not designated authoritative**) — which replaces the scratch measurement previously recorded in [`.orchestrator/PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md) §2 as the re-runnable source of the 532/691 figures. The drop buys **no status**: manifest states are unchanged at 1 / 32 / 2, `corpus.complete_documents` is still empty, and all five documents touched by the campaign remain `partial_or_failed_w1_collation` — the new register's own `reproduction.documents_with_changed_status` is 0. Reduced flags are not a finished corpus — that misreading is exactly what the five-ledger separation exists to prevent.

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

- The worst finding is a false public claim the data still carries: `zhaozhou_yulu`'s claimed witness **T1987 is false** — T1987 (T47n1987A/B) is the **Caoshan** record (extracted head 曹山大師語錄序; 趙州 occurs 1× against 曹山 25×/28× in the pinned witnesses), and the true in-set witness is X68n1315. It survives in `data/corpus/zhaozhou_yulu.json` (`cbeta_id`, `coverage_note`), in `data/corpus_manifest.json` (`cbeta`) and in two verified-quotation `reference` strings — the documents and the data currently contradict each other by design of the doc gate. Four more `CITATION` rows sit with it (ranks 3–6: `fayan_yulu`, `dongshan_yulu`, `mazu_yulu`, `dahui_hongzhi`).
- **Representation ≠ completion.** 48/48 *Wumenguan* cases, 100/100 *Biyanlu* case records and 37/37 *Xinxin Ming* stanzas remain representation claims; re-keying upgraded no status, and every document above is still `partial_or_failed_w1_collation`.
- **No source text was generated.** Every re-keyed graph came from a pinned, digest-verified CBETA reference (39 verified / 0 drift at XML P5 revision `dbdea41071e1e260ad84b72faefd4587333cf76d`), and `scripts/test_source_preservation.py` byte-compares `data/corpus/` against base commit `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43` permitting only exact allowlisted JSON pointers (218 permitted changes, 0 unauthorized on the 2026-09-12 run).
- **Owed, in order:** the post-remediation evidence pass (a new register, so the authoritative figure can honestly move), the six `CITATION` fixes, the 51 `LABEL` rows, label visibility in the reader, the owner's fabricated-text decision ([`PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md) → `## Owner decision required`), and the human-sourcing queue. [`RESEARCH_RELEASE_PLAN.md`](./RESEARCH_RELEASE_PLAN.md) carries these as release-blocking.

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
  1. *Wumenguan* (無門關 / The Gateless Gate, T2005 — **48/48 cases represented; partial/failed W1 source collation** + preface + epilogue; re-keyed to the pinned T48n2005 witness in PR #29, epilogue labelled project text)
  2. *Linji Yulu* (臨濟語錄 / T1985 — 74 recorded sections; partial selected witness; 5 fields re-keyed to T47n1985 and 3 行錄 retellings labelled project text in PR #32)
  3. *Huangbo Chuanxin Fayao* (黃檗傳心法要 / T2012A — opening sections)
  4. *Zhaozhou Yulu* (趙州語錄 / recorded-saying extracts — its recorded witness claim T1987 is **false**: T1987 is the Caoshan record, and the true in-set witness is X68n1315; the data still carries the claim and the fix is a queued `CITATION` row)
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
- [ ] **Full-Text Ingestion Targets** (status re-derived 2026-09-12; the Wave 1 section above carries the per-document harness deltas):
  - [~] Wumenguan (**48 / 48 cases represented; partial/failed W1 source collation** — source re-keyed to the pinned T48n2005 witness in PR #29, so per-document *re-keying* is done and what remains is the post-remediation evidence pass plus the documented residual: 5 MINOR fields, 2 SHORT_UNMATCHED `title_zh` composites, and the R-B-labelled project epilogue; the verified Senzaki & Reps quotation layer is separate)
  - [~] Biyanlu (**100 / 100 case records represented; partial selected witness** — re-keyed to the pinned T48n2003 witness in PR #30; post-verse commentary, 22 MINOR fields, 86 `title_zh` metadata flags, one disclosed unfixed coverage gap (case 42's 垂示) and human collation sign-off remain pending; N/N representation is not full-work completion)
  - [~] Linji Yulu (**74 recorded sections** — re-keyed to the pinned T47n1985 witness in PR #32 with three 行錄 retellings kept as labelled project text, and the false "74 / 74 canonical sections complete across all 4 divisions" `coverage_note` replaced by an honest disclosure; selected-witness completeness, 2 MINOR `<g>`-apparatus fields, 74 `title_zh` metadata flags and full unit-level verification remain pending)
  - [~] Xinxin Ming (**37 / 37 stanzas represented** — 12 of 13 flagged content fields re-keyed to the pinned T48n2010 witness in PR #34, content CJK unchanged at 584; the 13th, `.stanzas[31].zh`, is NOT_FOUND and was kept whole under an R-B `editorial_note` because the alignment span would have deleted a canonical line and duplicated stanza 33; 1 `title_zh` metadata flag remains)
  - [~] Platform Sutra (**10 / 10 chapter headings represented by selected excerpts** — labelled against two recensions in PR #35, zero characters re-keyed; 9 of 13 source-content fields are disclosed project précis with no witness, so the text decision — keep them labelled or re-key to the Dunhuang witness — is an open owner item in `.orchestrator/PHASE2_PLAN.md`)
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

> **Measured status 2026-09-12 — this phase moved the most, and it still has an unfilled gap.** Delivered: a witness-pinned collation harness (`scripts/collate_refs.py` → `scripts/collate_corpus.py` → `scripts/w1_evidence.py`, with `scripts/test_source_preservation.py` and `scripts/test_source_review_rules.py` as gates), **35/35** documents independently inventoried against the pinned CBETA reference set (39 references, 39 verified / 0 drift at XML P5 revision `dbdea41071e1e260ad84b72faefd4587333cf76d`), **22** documents carrying a provenance label (`cbeta_note` 16 + `editorial_note` 5 + `recension_note` 1, no overlap), and **5** documents re-keyed or labelled (PRs #29, #30, #32, #34, #35 — table in the Wave 1 section above). Measured field state: **593 of 924** source-content fields collate to their claimed witness, **22** documents have no collating source-content field at all (that count equals the 22 labelled documents, but the two sets are not the same — 15 documents are in both; 7 have no collating field *and* no label, among them `zhaozhou_yulu`, `guiyang_yulu`, `yunmen_yulu`, `qinggui_monastic_codes`; and 7 carry a label while collating at least partly, among them the five Wave 1 documents `wumenguan`, `biyanlu_cases`, `linji_yulu`, `xinxin_ming`, `platform_sutra`, whose labels are the campaign's own `editorial_note`/`recension_note` additions), and **391** `title_zh`/`name_zh` metadata fields sit in a separate measured partition (the metadata-exclusion caveat, the containment-not-rights scope sentence and the non-approval-of-reuse sentence are required verbatim of `README.md`/`AUDIT.md`/`HANDOFF.md` only — their absence from this file is by design, not an omission to repair).
>
> **The gap (both halves of it).** (1) *Presentation:* the corpus carries **49** provenance notes — `cbeta_note` 16, `recension_note` 14, `coverage_note` 11, `editorial_note` 8 — and the reader renders **one** site (`recension_note` at verse level, plus `coverage_note` in the dossier's Reading ledger). So 16 recorded citation corrections and 8 labels marking retained project retellings as having no witness attribution are invisible, and `platform_sutra`'s root recension note — the disclosure that 9 of its 13 source-content fields are project précis — is unreachable. Rendering every note the data carries is queued work and is release-blocking in [`RESEARCH_RELEASE_PLAN.md`](./RESEARCH_RELEASE_PLAN.md). (2) *Evidence:* the post-remediation register is now published — [`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`](./sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json) + [`sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md`](./sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md) (532 flagged fields, 691/924 content fields collating, no status change) — but it is a measurement record, not a designation, so the surviving half of the gap is that the authoritative flagged total is still the 2026-09-10 register's **630**: re-designating the evidence means converting `scripts/w1_evidence.py`'s fixed historical/overlay pair into a chain, which is queued as its own owner-ruled change (see the framing note above the Wave 1 section). Neither number is a completion claim.

- [~] **Source aggregation & verification**:
  - Aggregate Classical Chinese text from a recorded primary source (CBETA/TEI, Taishō, Zokuzōkyō, or named manuscript/edition), retaining canonical ID plus a locator appropriate to the source (case, fascicle, page/line, or TEI anchor).
  - Verify source text against that recorded source before display; do not upgrade a seed excerpt to “verified” merely because it is widely mirrored online.
  - Verify published translations against the named **book/edition**, translator, and page or stable section reference. A web mirror may assist wording comparison but never substitutes for bibliographic provenance or rights review.
- [~] **Content disclosure contract**:
  - ✅ The public Reader and Matrix now render canonical source locations plus hover/focus/touch citation popups. The Reader also shows each document's W1 source-review state (`collated_to_claimed_witness`, `partial_or_failed_w1_collation`, or `witness_unavailable`) as a visible ledger item. These are containment/remediation states, not rights decisions; until a page/line or TEI locator exists, the UI shows an honest `Locator pending`/document-level status rather than implying unit-level collation.
  - ✅ Every displayed translation now renders translator, translation status, book/edition, page/section reference state, edition-verification status, and citation/rights identifier. Measured 2026-09-12 (the previous "135 recorded / 5 pending" figures were stale): **176 of 179** verified source records carry a recorded reference and **3** are pending (`data/project_metrics.json` → `translations.verified_reference_coverage`): **2** in the corpus, where **175** of the 177 verified-quotation `reference` fields record a case/page/section state and 2 state `translation book episode/page pending` explicitly (both `zhaozhou_yulu`, whose cited witness is itself one of the queued `CITATION` fixes), and **1** in the Matrix (the R.H. Blyth register for Wumenguan case 1, `Case I (Hokuseido print page pending)`). The "135 recorded / 5 pending" figures this line previously carried were stale. Replacing the pending values is a blocking editorial task, not a silent omission. Edition verification and rights approval remain separate from W1 source collation.
  - ✅ Every AI-produced or AI-reconstructed item is visibly marked **AI draft** or **register reconstruction**; it never appears as a verified quotation or a scholar’s verbatim translation.
  - ✅ Citation/source badges are available by hover, keyboard focus, and touch popup in Reader and Matrix; future public surfaces must use the same component.
- [ ] **Editorial review queue** (re-derived 2026-09-12 from `.orchestrator/PHASE2_PLAN.md`, whose 76 consolidated rows carry a reproduce command each):
  - Upgrade the 33 `legacy_document_seed` locator records to page/line or TEI anchors (queue state: 30 `needs_unit_locator`, 3 `in_review`).
  - Complete human rights/editorial review for each of the **14** sources in `rights_manifest.json` before broader quotation reuse; all 14 remain pending and no ledger records a rights decision.
  - **Publish the post-remediation evidence pass** — measurement half done (2026-09-12): the dated register and report are committed as [`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`](./sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json) + [`sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md`](./sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md) (630 → 532 flagged fields, 593 → 691 of 924 content fields collating, statuses unchanged at 1 / 32 / 2, `documents_with_changed_status: 0`). **Re-designation half still open:** the authoritative flagged total cannot move from the 2026-09-10 register's 630 to the measured 532 in that PR's wake, because `scripts/w1_evidence.py` fixes the historical/overlay pair in `FIXED_METADATA` (an authoritative record must be a `w1-correction` correcting the 2026-09-09 register) — converting that pair into a chain is a separate, gate-touching change with its own owner ruling, and until it lands the five re-keyed/labelled documents stay `partial_or_failed_w1_collation` on the authoritative record's evidence.
  - **Fix the 6 `CITATION` rows** (ranks 1–6): `zhaozhou_yulu`'s manifest claim and its `coverage_note` both cite a witness that is **false** — T1987 is the Caoshan record and the true in-set witness is X68n1315 — plus `fayan_yulu` (T1985 / X1321), `dongshan_yulu` (X1321), `mazu_yulu` (T1986) and `dahui_hongzhi` (manifest omits T48n2001).
  - **Render the labels that already exist**: 49 provenance notes in `data/corpus/*.json`, 1 rendered site (see the gap note above). Until this ships, disclosure that exists in the data does not reach a reader.
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
│   ├── canonical_locators.json # Document/case source-locator registry (148/148 cases; 33 document-level seeds)
│   ├── project_metrics.json    # Deterministic generated project counts (incl. the corpus.source_review aggregate)
│   ├── corpus/                 # 35 active structured source files — 0 complete / 4 partial selected witness / 31 excerpt seeds
│   ├── editorial/              # traceability_queue.json (33 source-locator reviews)
│   ├── lineage/                # masters.json (34 profiles) + verification (30 links / 4 frontiers) + queues + school vocabulary
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
    ├── test_source_review_rules.py  # 96 source-review rule checks (mutation matrix included)
    ├── smoke_test.mjs          # Dependency-free renderer regression test
    ├── compat_runtime_check.mjs # Runtime completion/status compatibility checks
    ├── browser_test.mjs        # Optional Playwright suite (skips without Chromium; not in CI)
    ├── arena_agent_pipeline.py # Agent prompt templates & entry harness (not a public surface)
    ├── migrate_translations.py # One-off migration utility
    └── align_translations.py   # (planned — not yet written)
```

> Deployment is native GitHub Pages branch publishing (`main` + `/docs`). The GitHub Actions Quality workflow verifies repository quality only; it does not deploy Pages.
