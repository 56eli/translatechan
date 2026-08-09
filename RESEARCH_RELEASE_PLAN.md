# TranslateChan Research-Release Plan

> **Purpose:** turn a healthy static reader into a trustworthy, maintainable research corpus without treating generated text, online mirrors, or incomplete locators as scholarly completion.
>
> **Working rule:** no content expansion may weaken the source, provenance, rights, validation, or deploy contract already in place.

## Release standard

A text or translation is only presented at the strongest available status. “Complete,” “verified quotation,” and “source verified” each require auditable evidence—not a plausible web mirror or inferred attribution.

| Status | Minimum acceptance evidence |
|---|---|
| Canonical text unit | Named source/edition, canonical ID, stable locator (case, fascicle/page/line, or TEI ID), revision/source note, and human spot-check record |
| Verified modern quotation | Exact book/edition, translator, stable page/section reference, wording check, source ID resolving to a rights record, and editorial rights decision |
| Complete work | All canonical units accounted for against a stated edition/recension, explicit treatment of prefatory/end material and variants, unit-level locators, and validation/smoke coverage |
| Source-verified lineage edge | Named chart/record, edition and exact locator, editorial note on historiographical status; otherwise retain the visible traditional/pending state |
| Public release | Quality workflow green, generated assets committed, browser/a11y smoke pass, and no unresolved P1 scholarly-disclosure defect |

## Current baseline (2026-08-09, session `019fe838`)

- **Platform:** native GitHub Pages from `main` → `/docs`; the checked-in **Quality** workflow passes on session branches (owner still to require it in branch protection).
- **Corpus:** 36 structured documents. *Wumenguan* (48/48 cases plus preface/epilogue) and the *Biyanlu* (**100/100 cases** — pointer 垂示 where canonically present, 本則, pre-verse 評唱, 頌; collated from CBETA TEI T48n2003; post-verse 頌評唱 rendering and human collation sign-off still pending) are the two complete works; the *Linji Yulu* completion pilot (67 sections across prefaces, Ascending the Hall, 示眾 and 勘辨 divisions, CBETA P5 XML) is underway; the remaining corpus (34 excerpt seeds per validator metrics, including Linji) stays honestly excerpt-scaled. Per-text coverage is emitted deterministically in `project_metrics.json → corpus.per_text` and displayed in the Reader header.
- **Traceability:** all 150 stored case units (48 Wumenguan + 100 Biyanlu + 2 Congronglu seed cases) have case-level locators. The Linji pilot (4 sections, T1985) and Xinxin Ming pilot (7 stanzas, T2010) have CBETA line-head anchors marked `collated_with_normalization`, not source-checked: human editorial sign-off remains required. The remaining 33 non-case seed documents retain document-level `legacy_document_seed` records; the enforced migration queue is not evidence of collation. Huangbo material was separated by witness: the One Mind seed is T2012A, while the unconditioned-compassion Q&A now belongs to the T2012B Wanling seed and still needs unit-level collation.
- **Translation disclosure:** 138 verified corpus quotation records and 2 verified Matrix records resolve to 13 rights-manifest source records; 5 verified records still need exact page/section references; human rights review remains pending.
- **Lineage:** 30 internal edges are visibly traditional/pending (including four newly navigable frontier-profile links); none should be upgraded without exact source locators. `data/lineage/profile_review_queue.json` tracks all 34 profiles for source-locator review without upgrading their evidence status.

## Delivery sequence

### 0 — Release-engineering baseline (complete; maintain continuously)

- [x] Quality workflow checks Python syntax, semantic data validation, deterministic build output, deploy mirror, and dependency-free renderer smoke coverage.
- [ ] Enable `main` branch protection requiring the Quality check after an administrator sees its first successful run.
- [x] Real-browser regression suite (desktop + mobile): `scripts/browser_test.mjs` (Playwright) covers initial load, deep links, mobile corpus chooser/action bar, lazy case loading, case-chip jumps, citation and glossary popovers (pointer + keyboard), ARIA tab navigation, search escaping, CSP console cleanliness, and print view. It is **optional and not part of CI** (it skips gracefully without a browser); run locally with `npm install && npx playwright install chromium && npm run test:browser` before release checks.
- [ ] Add an accessibility review checklist and resolve keyboard semantics for every interactive control before the next public release. (Keyboard semantics for tabs, glossary terms, lineage nodes/edges, and cards are implemented; a formal screen-reader pass remains.)

**Exit evidence:** required GitHub check is green on PRs; browser suite covers initial load, deep links, mobile corpus chooser, lazy case loading, source popovers, keyboard interaction, and print view.

### 1 — Editorial traceability migration (highest scholarly priority)

1. Establish a per-unit editorial worksheet format: source edition/URL or TEI revision, locator, collation date, reviewer, variant note, and confidence/status. The Linji and Xinxin pilots are the reference implementation; their `collated_with_normalization` status is explicitly below human source-checked sign-off.
2. Migrate the 33 `legacy_document_seed` locators one text at a time. Start with texts already used in the Matrix and Gong’an Index.
3. Replace the 5 `Page/section locator pending` verified-quotation references with actual stable references or downgrade the item from verified status.
4. Add exact source locators for lineage edges; preserve disputed/traditional distinctions rather than forcing a single genealogy.

**Exit evidence:** no public displayed corpus unit relies only on a document-level seed locator; every verified quotation has a non-pending citation; every lineage edge has an explicit evidence status.

### 2 — Rights and quotation review (parallel to Phase 1)

1. Review each of the 13 modern-translation source records by jurisdiction, edition, quotation length, and intended public reuse.
2. Record a human editorial decision in `rights_manifest.json`; do not mistake online availability for a license.
3. Prefer public-domain/openly licensed translations for complete comparative registers; use short attributed excerpts for copyrighted works only when approved.
4. Keep AI/reconstruction labels explicit and never backfill a scholar’s name onto generated text.

**Exit evidence:** every visible modern quotation has a documented editorial decision and a source/reference suitable for its displayed status.

### 3 — Biyanlu completion campaign (✅ complete; contract now applies to the next texts)

*Biyanlu* was chosen as the expansion pilot because it exercises pointers, commentary, verse, case navigation, comparative reading, and Gong’an cross-references. The same per-case contract now governs the next targets — **Linji Yulu completion** (pilot landed 2026-08-09) and **Congronglu 100/100**:

For each new case:

1. Record the CBETA/edition source and canonical case locator before adding text.
2. Segment the Chinese conservatively; retain pointer, main case, commentary, and verse as distinct fields.
3. Add pinyin as a disclosed machine/editorial draft and have a reviewer spot-check proper names and Buddhist terms.
4. Add only translations with explicit status; verified quotations must meet the rights/source contract.
5. Add Gong’an index and glossary links where they provide genuine research value.
6. Run validator, generated metrics, build, smoke suite, and browser checks; commit source plus generated artifacts together.

**Pilot exit evidence:** the first 10 Biyanlu cases are complete against the selected edition, with unit locators and no unlabelled translations. Reassess data model, loading performance, and editorial throughput before scaling to 100 cases.

> ✅ **Pilot milestone (2026-08-08):** cases 1–10 complete (14/100) with CBETA TEI line locators, validator-checked coverage metadata, and regression coverage — the contract held end-to-end.
>
> ✅ **Campaign milestone (2026-08-09):** **Biyanlu COMPLETE at 100/100 cases** — cases 11/13/15–100 collated from `cbeta-org/xml-p5` TEI + CBETA Online; integrity repairs replaced mis-seeded cases 14/21 and a fabricated case-12 verse, completed truncated cases 1–3 verses, and gave case 43 its 垂示 + 評唱 (all disclosed in locator records); 22 canonical no-垂示 cases recorded. **Still pending per this plan's release standard:** post-verse 頌評唱 English rendering (tracked in the file's `coverage_note`), and human collation sign-off (the `collated_with_normalization` status never upgrades itself).

### 4 — Reader and research UX hardening

- [x] Replace inline `onclick` and clickable non-controls with delegated events/native buttons, then apply a restrictive Content Security Policy (completed 2026-08-08, session `arena/019fe30b`): all generated controls now use `data-*` attributes with a single document-level delegated click handler; the app ships a CSP meta tag with `script-src 'self'`; the smoke suite fails on any reintroduced inline handler attribute.
- [x] Ensure Enter/Space behavior and ARIA relationships for glossary terms, lineage cards/nodes/edges, tabs, and filters (completed 2026-08-08): Enter/Space opens glossary popovers; tabs are full ARIA `tablist`/`tab`/`tabpanel` with roving tabindex and arrow/Home/End navigation; lineage cards/nodes/edges already carry button semantics and Enter/Space activation.
- [ ] Add browser/screen-reader checks for citations on hover, focus, and touch (real-browser suite still pending — see Phase 0).
- [ ] Measure mobile first-load performance before corpus growth makes the monolithic bundle costly; choose lazy per-text data only if evidence justifies the added complexity.

**Exit evidence:** no keyboard-only dead end in public interaction paths; CSP permits no inline event handlers; mobile performance budget is documented and tested.

### 5 — Scale only after the pilot proves the contract

- Complete the remaining Biyanlu cases in editorial batches.
- Expand Congronglu and other texts only with the same locator/rights/provenance gates.
- Grow the glossary and Gong’an index from collated units, rather than through disconnected bulk additions.
- Publish periodic data-quality metrics and an editorial changelog.

## Definition of done for every change

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py --write-metrics  # only when source data changed
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
diff -rq data docs/data
```

Then commit the source, metrics, bundle, and `/docs` mirror together; push the session branch; require the Quality workflow to pass; and open a PR to `main`.
