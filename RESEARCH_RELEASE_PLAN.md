# Fake Chan Factory Research-Release Plan

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

## Current baseline (2026-08-10 containment state)

- **Platform:** native GitHub Pages from `main /docs`; Quality passes, but `repo_ready` remains fail on the Lineage directory defect, rights/source review, non-case validation, mandatory browser/accessibility evidence, and operations gates.
- **Corpus:** 35 active documents. Wumenguan and Xinxin Ming are explicitly `complete_selected_witness`; Biyanlu has 100/100 case records but is `partial_selected_witness`; Platform Sutra is a 10-heading excerpt set, not complete. Congronglu is quarantined and absent from the public bundle after generated source-looking placeholders and incorrect case-number/page claims were confirmed against authoritative T48n2004 headings.
- **Traceability:** 148 active case records have case locators (48 Wumenguan + 100 Biyanlu); 33 non-case documents remain document-level with limited Linji/Xinxin unit pilots. A case-number anchor is not proof that every nested source field was collated.
- **Translation disclosure:** 177 corpus quotation slots and 2 Matrix slots are edition-verified; 176/179 have recorded references. All 14 rights-manifest sources still require their documented rights/jurisdiction review. Verification does not itself grant reuse rights or establish public-domain status.
- **Lineage:** 30 internal edges remain traditional/pending and four frontier tasks remain; no edge should be upgraded without exact source locators.

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
3. Replace the 3 pending verified-quotation references with actual stable references or downgrade the items from verified status.
4. Add exact source locators for lineage edges; preserve disputed/traditional distinctions rather than forcing a single genealogy.

**Exit evidence:** no public displayed corpus unit relies only on a document-level seed locator; every verified quotation has a non-pending citation; every lineage edge has an explicit evidence status.

### 2 — Rights and quotation review (parallel to Phase 1)

1. Review all 14 translation-source rights records by jurisdiction, edition, quotation length, and intended public reuse.
2. Record a human editorial decision in `rights_manifest.json`; do not mistake online availability for a license.
3. Prefer public-domain/openly licensed translations for complete comparative registers; use short attributed excerpts for copyrighted works only when approved.
4. Keep AI/reconstruction labels explicit and never backfill a scholar’s name onto generated text.

**Exit evidence:** every visible modern quotation has a documented editorial decision and a source/reference suitable for its displayed status.

### 3 — Biyanlu as the next content pilot

Biyanlu now has 100 represented case records but still needs its missing source fields and human sign-off. Congronglu must restart from authoritative T48n2004 TEI; none of the quarantined generated records may be copied back.

For each new case:

1. Record the CBETA/edition source and canonical case locator before adding text.
2. Segment the Chinese conservatively; retain pointer, main case, commentary, and verse as distinct fields.
3. Add pinyin as a disclosed machine/editorial draft and have a reviewer spot-check proper names and Buddhist terms.
4. Add only translations with explicit status; verified quotations must meet the rights/source contract.
5. Add Gong’an index and glossary links where they provide genuine research value.
6. Run validator, generated metrics, build, smoke suite, and browser checks; commit source plus generated artifacts together.

**Pilot exit evidence:** the first 10 Biyanlu cases are complete against the selected edition, with unit locators and no unlabelled translations. Reassess data model, loading performance, and editorial throughput before scaling to 100 cases.

> ✅ **Pilot milestone (2026-08-08):** cases 1–10 complete (14/100) with CBETA TEI line locators, validator-checked coverage metadata, and regression coverage — the contract held end-to-end. Post-verse 評唱 English and human sign-off on the `collated_with_normalization` anchors remain; cases 11–100 are next.

### 4 — Reader and research UX hardening

- [x] Replace inline `onclick` and clickable non-controls with delegated events/native buttons, then apply a restrictive Content Security Policy (completed 2026-08-08, session `arena/019fe30b`): all generated controls now use `data-*` attributes with a single document-level delegated click handler; the app ships a CSP meta tag with `script-src 'self'`; the smoke suite fails on any reintroduced inline handler attribute.
- [x] Ensure Enter/Space behavior and ARIA relationships for glossary terms, lineage cards/nodes/edges, tabs, and filters (completed 2026-08-08): Enter/Space opens glossary popovers; tabs are full ARIA `tablist`/`tab`/`tabpanel` with roving tabindex and arrow/Home/End navigation; lineage cards/nodes/edges already carry button semantics and Enter/Space activation.
- [ ] Add browser/screen-reader checks for citations on hover, focus, and touch (real-browser suite still pending — see Phase 0).
- [ ] Measure mobile first-load performance before corpus growth makes the monolithic bundle costly; choose lazy per-text data only if evidence justifies the added complexity.

**Exit evidence:** no keyboard-only dead end in public interaction paths; CSP permits no inline event handlers; mobile performance budget is documented and tested.

### 5 — Scale only after the pilot proves the contract

- Complete Biyanlu's missing source fields and human review in editorial batches.
- Re-ingest Congronglu from authoritative TEI only after field-level provenance and anti-placeholder gates exist; expand other texts under the same contract.
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
