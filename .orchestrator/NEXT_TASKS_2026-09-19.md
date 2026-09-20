# Next Tasks — Most Important — TranslateChan — 2026-09-19

**Derived from:** `ROADMAP_100PCT_600-1400_2026-09-19.md` + auditor baseline + `vision.md` §1.1 distance. Pages out of scope per 2026-09-19.

## P0 — Integrity & Trust Baseline (must stay green)

- **Gate maintenance:** `py_compile`, `validate_data`, `build_data_bundle`, `test_source_preservation` (0 unauthorized), `test_source_review_rules` (138), `smoke_test` 35 texts. Already retired `check_layout_variant` and `test_website_ruling`. Keep `quality.yml` text-integrity only.
- **Auditor file:** Keep `AUDIT.md` + `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` as trust baseline. Every dispatch checked against it.

## P1 — Glaring missing, heavily read (Chan practitioner impact)

### 1. Reinstate Congrong Lu (Book of Serenity, Wansong 1224, 100 cases) — quarantined at 0 cases
- **Why P1:** Top 3 gongan collection alongside Biyan Lu and Wumen Guan, daily practice, biggest gap.
- **Requirement per vision.md Phase 2 note:** Field-level collation of all 100 cases against T48n2004 before re-entering bundle. Cannot copy quarantined generated records.
- **Steps:**
  1. Extract T48n2004 via `collate_refs.py` pinned `dbdea410`
  2. Segment 100 cases into `data/corpus/congronglu.json` with `sections` or `cases` shape, `cbeta_id=T48n2004`, `coverage_note` honest, `cbeta_note`
  3. Collate `collate_corpus.py --doc congronglu --require-verified-refs` → must be ≥90/100 collating before PR
  4. R-A re-key any DIVERGENT/NOT_FOUND verbatim
  5. Gates + bundle 1,693,251→new size deterministic
- **Verification:** `python3 scripts/collate_corpus.py --doc congronglu` reports collated, `validate_data.py` PASS, preservation allowlist, review rules
- **Estimate:** 3-4h

### 2. Full Jingde Chuandeng Lu (1004, 30 fascicles, ~1700 biographies) — we have 6 fields sample 1/6 collating
- **Why P1:** Lineage backbone, source for 30 pending edge locators.
- **Requirement:** Not sample, but full ingestion as `chuandenglu_full` or expand existing with 30 fascicles, each biography as section with locator T51n2076 page/line.
- **Steps:** Inventory T51n2076 structure (358,501 graphs), segment by fascicle, create 30 sections, add lineage links.
- **Estimate:** 8-12h (large), can be split per fascicle batch

### 3. Caoshan Benji Yulu — missing, Five Houses imbalance
- **Why P1:** Caodong second founder, Soto lineage.
- **Steps:** Find CBETA witness (likely X-series), extract, segment, collate.
- **Estimate:** 1-2h

## P2 — Core yulu authenticity (0/6 collating as project compositions)

These are in corpus as excerpt_seed but 0/6 collating — only carrier is uncited X80n1565 Wudeng Huiyuan or no carrier. Need R-A re-key or honest coverage label.

**Priority order by reading frequency:**

- `baizhang_guanglu` 0/6 — only carrier X80n1565 fragments 16-28 graphs, no run in claimed X69n1323/X68n1315. Needs coverage label + human sourcing note OUT-OF-CBETA or re-key discussion.
- `huangbo_wanling` 0/7 — 0/7 in claimed T48n2012B and 0/7 in all 39 refs. Needs same.
- `dazhu_huihai` 0/6 — largest run 23/27, no ≥8 in all 39 refs for some fields. Needs re-key attempt vs X-series.
- `deshan_yulu`, `fayan_yulu`, `guiyang_yulu`, `nanquan_yulu`, `xuansha_yulu`, `xuefeng_yantou`, `wudeng_huiyuan` (3 sections only), `mazu_yulu` (8 fields 0/8), `lidai_fabao_ji`, `foyan_qingyuan`, `dahui_hongzhi` (6 fields 0/6), `dahui_shobogenzo`, `qinggui_monastic_codes` (5 fields composite), `caoxi_zhuan` (0/4, P.3018 out-of-CBETA)

**For each:** Run `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc <key>` to measure carriers, document offsets, propose label (coverage + attribution) per WITNESS_INVENTORY pattern, or R-A re-key if witness carries it verbatim.

**Estimate:** 1h per doc × 15 docs = 15h, can be parallelized as separate PRs one doc per PR per REMEDIATION_PLAN.

## P3 — Lineage exact locators (unblocks graph)

- **Current:** 30 edges `traditional_link_pending_exact_locator`, 29 masters `needs_exact_locator`, 3 unlinked `prajnatara`, `yangqi_fanghui`, `dahong_zuzheng`
- **Why P3:** Lineage is second core objective, 34 masters is scaffold, not graph.
- **Steps:**
  1. For each edge in `data/lineage/lineage_verification.json`, find exact T51n2076 or X80n1565 page/line via CBETA refs
  2. For unlinked masters, either link to existing corpus key (Yangqi Fanghui → need Yangqi yulu ingestion) or mark frontier with explicit `profile_evidence`
  3. Update `masters.json` linked_corpus_keys, `lineage_verification.json` with exact locators
- **Verification:** `validate_data.py` warnings for empty linked_corpus_keys should go from 3 to 0, edges pending → exact
- **Estimate:** 4-6h

## P4 — Rights review (release blocker)

- **Current:** 14 sources in `data/translations/rights_manifest.json` need human/jurisdiction review, per AUDIT.md P1 blocker. Source collation ≠ rights approval.
- **Steps:** Human review, not agent fetch. Agent can prepare work orders listing source, translator, publication year, public-domain evidence, but not transcribe.
- **Estimate:** Human work, agent can generate work order list in 1h

## P5 — Translation matrix verified quotations

- **Current:** 1252 slots (177 verified, 876 reconstructions, 199 AI drafts), 21 translator profiles, 4 exemplar passages carrying 21 registers. Most roster real wording not held.
- **Steps:** For each translator profile, add verified quotation with `evidence_source` enum, book-page reference, rights id, per `validate_data.py` checks (cross_refs, evidence_source enum)
- **Estimate:** Ongoing, 1 verified slot = ~15min

## P6 — Define 100% scope (CBETA full inventory)

- **Current:** 39 refs verified, 35 docs. Need full inventory of Chan in T47 (12), T48 (~60), T51 (~80), X (~200+).
- **Steps:** `scripts/collate_refs.py --list-all` or manual CBETA catalog, produce `docs/CHAN_CANON_600-1400_INVENTORY.md` with ~150-200 titles, mark which of our 35 cover, which missing, prioritize by reading frequency vs scholarly value.
- **Estimate:** 2-3h

## Suggested dispatch order for next 8 agents (parallelizable where noted)

1. **Agent 1 — Congrong Lu reinstatement** (P1-1) — 1 PR, 100 cases, field-level collation T48n2004
2. **Agent 2 — Caoshan Benji Yulu ingestion** (P1-3) — 1 PR, new doc, collation
3. **Agent 3 — Baizhang Guanglu + Huangbo Wanling authenticity labels** (P2) — 2 docs, coverage + attribution labels per WITNESS_INVENTORY pattern, no re-key if no carrier
4. **Agent 4 — Dazhu Huihai + Nanquan re-key attempt** (P2) — 2 docs, try X-series carriers
5. **Agent 5 — Lineage exact locators batch 1** (P3) — 10 edges + 1 unlinked master
6. **Agent 6 — Lineage exact locators batch 2** (P3) — 10 edges + 1 unlinked
7. **Agent 7 — CBETA full inventory** (P6) — produces inventory doc, defines 100% denominator
8. **Agent 8 — Rights work order list** (P4) — generates human review queue from rights_manifest

Each PR must: `py_compile`, `validate_data`, `build_data_bundle`, `test_source_preservation` (0 unauthorized), `test_source_review_rules` (138), `smoke_test`, `git diff --stat` shows only intended files, no `style=` etc. Quote `collate_corpus.py --doc <key>` output verbatim.

**Not in scope:** Pages deployment/creation unless specifically asked for (per 2026-09-19 ruling). No new runtime deps, no secrets.

## Verification for auditors

```bash
python3 scripts/validate_data.py # corpus35 slots1252 verified177 matrix21 locators148/148 flagged630
python3 scripts/build_data_bundle.py # 1,693,251 B
python3 scripts/test_source_preservation.py # 0 unauthorized / 373 permitted
python3 scripts/test_source_review_rules.py # 138
node scripts/smoke_test.mjs
jq '.profiles | length' data/translations/translator_profiles.json # 21
cat .orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md # this roadmap
cat vision.md # objectives at full strength
```

