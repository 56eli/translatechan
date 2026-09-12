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
| Public release | Quality workflow green, generated assets committed, browser/a11y smoke pass, no unresolved P1 scholarly-disclosure defect, and the four Wave 1 close-out blockers resolved (see the release-blocking checklist below) |

## Current baseline (measured 2026-09-12; supersedes the 2026-08-10 containment state)

Every figure here is reproducible from `data/project_metrics.json`, `data/corpus_manifest.json` or the named artefact; the commands are in [`ROADMAP.md`](./ROADMAP.md) → Wave 1 source-integrity campaign.

- **Platform:** native GitHub Pages from `main /docs`; Quality passes, but `repo_ready` remains fail (audited score 7.2/10, `AUDIT.md` §1) until the P1 blockers below are resolved. No real-browser or screen-reader evidence exists, so no surface may be described as browser-verified.
- **Corpus:** 35 active documents, **0 complete** — `corpus.complete_documents` is empty. Completion statuses are **4 `partial_selected_witness`** (`wumenguan`, `biyanlu_cases`, `linji_yulu`, `xinxin_ming`) and **31 `excerpt_seed`**. W1 source-review states are **1 `collated_to_claimed_witness`** (`zhengdao_ge`), **32 `partial_or_failed_w1_collation`**, **2 `witness_unavailable`** (`hanshan_poems`, `niutou_juezhu`).
  - **Correction of the 2026-08-10 baseline, which is now false as written:** it stated that "Wumenguan and Xinxin Ming are explicitly `complete_selected_witness`". Neither is. W1 containment withdrew those claims (2026-09-09, corrected 2026-09-10) after collation found fabricated preface/verse material inside the former `complete_selected_witness` texts, and the validator now rejects `complete` unless the document is `complete_selected_witness` **and** `collated_to_claimed_witness`. Both documents were subsequently re-keyed to their pinned witnesses (PRs #29, #34) and **neither re-key upgraded its status**.
  - **Platform Sutra:** a 10-heading excerpt set, not complete, and now labelled rather than re-keyed (PR #35): primary witness T48n2007 (Dunhuang), alternative T48n2008 (宗寶); of 13 source-content fields **1** is verbatim in the primary witness, **3** in the alternative and **9** in neither — those 9 are disclosed as condensed project précis. Zero Chinese characters were rewritten; document content CJK stays 680.
  - **Congronglu: quarantined, 0 cases held.** Absent from the public bundle since 2026-08-10 after generated source-looking placeholders and case-number/page claims were disproved against the authoritative T48n2004 headings; it remains out by standing owner decision. It is still a named goal of the corpus taxonomy (`vision.md` §2 † note) and its 100 cases are a *target*, never a holding — see §3 and §5 below for the reinstatement contract.
- **Source-integrity evidence:** the authoritative W1 record is `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` — **35 documents, 630 flagged source fields**, evidence date 2026-09-10 — with the 2026-09-09 register retained as append-only historical evidence. **630 is the register's figure, not today's measurement:** a fresh collation of current `main` reports **532** flagged fields (`.orchestrator/PHASE2_PLAN.md` §2; `.orchestrator/WITNESS_INVENTORY_XSERIES.md`), the difference being the four merged re-keys. The drop is **not** a completion claim and changed no document's status; only the post-remediation evidence pass (blocker 1 below) may supersede the register. Field-level state: 593 of 924 source-content fields collate, 22 documents have no collating source-content field, and 391 `title_zh`/`name_zh` metadata fields are measured in a separate partition.
- **Traceability:** 148 active case records have case locators (48 Wumenguan + 100 Biyanlu) but only 2 documents are case-level; 33 remain document-level seeds with limited Linji/Xinxin unit pilots (queue: 30 `needs_unit_locator`, 3 `in_review`). A case-number anchor is not proof that every nested source field was collated — the W1 harness measures the fields, and it is what found the gaps.
- **Translation disclosure:** 177 corpus quotation slots and 2 Matrix registers are edition-verified; 176/179 verified source records have recorded references and 3 are pending. All **14** rights-manifest sources still require their documented rights/jurisdiction review (13 distinct source ids are referenced by verified quotations). Verification does not itself grant reuse rights or establish public-domain status, and no ledger records a rights decision.
- **Lineage:** 34 profiles, 30 internal edges — all `traditional_link_pending_exact_locator` — and 4 frontier tasks; no edge should be upgraded without exact source locators.
- **Disclosure presentation:** the corpus carries **49** provenance notes (`cbeta_note` 16, `recension_note` 14, `coverage_note` 11, `editorial_note` 8) across 26 documents, and the reader renders **one** site. Blocker 2 below.

## Delivery sequence

### 0 — Release-engineering baseline (complete; maintain continuously)

- [x] Quality workflow checks Python syntax, semantic data validation, deterministic build output, deploy mirror, and dependency-free renderer smoke coverage.
- [ ] Enable `main` branch protection requiring the Quality check after an administrator sees its first successful run.
- [x] Real-browser regression suite **written** (desktop + mobile) — and never executed: no Chromium run is on record (the 2026-08-11 session failed with `ECONNRESET`), so the box is ticked for the suite's existence, not for evidence. `scripts/browser_test.mjs` (Playwright) covers initial load, deep links, mobile corpus chooser/action bar, lazy case loading, case-chip jumps, citation and glossary popovers (pointer + keyboard), ARIA tab navigation, search escaping, CSP console cleanliness, and print view. It is **optional and not part of CI** (it skips gracefully without a browser); run locally with `npm install && npx playwright install chromium && npm run test:browser` before release checks.
- [ ] Add an accessibility review checklist and resolve keyboard semantics for every interactive control before the next public release. (Keyboard semantics for tabs, glossary terms, lineage nodes/edges, and cards are implemented; a formal screen-reader pass remains.)

**Exit evidence:** required GitHub check is green on PRs; browser suite covers initial load, deep links, mobile corpus chooser, lazy case loading, source popovers, keyboard interaction, and print view.

### 1 — Editorial traceability migration (highest scholarly priority)

1. Establish a per-unit editorial worksheet format: source edition/URL or TEI revision, locator, collation date, reviewer, variant note, and confidence/status. The unit pilots are the reference implementation — measured 2026-09-12 in `data/canonical_locators.json`: `biyanlu_cases` 100 unit anchors, `linji_yulu` 74 units, `xinxin_ming` 37 units, every one at `collated_with_normalization`, a status explicitly below human source-checked sign-off.
2. Migrate the 33 `legacy_document_seed` locators one text at a time. Start with texts already used in the Matrix and Gong’an Index.
3. Replace the pending verified-quotation references with actual stable references or downgrade the item from verified status. Measured 2026-09-12 the count is **3, not the 5 this plan previously carried** (the validator's own rule: a verified item whose `source.reference` contains `pending`): `zhaozhou_yulu` dialogue units 1 and 2 (`translation book episode/page pending`) and the Matrix's R.H. Blyth register for Wumenguan case 1 (`Case I (Hokuseido print page pending)`). Both `zhaozhou_yulu` references also cite the witness T1987, which is **false** — T1987 is the Caoshan record — so fixing these two means fixing the citation and the pagination together.
4. Add exact source locators for lineage edges; preserve disputed/traditional distinctions rather than forcing a single genealogy.

**Exit evidence:** no public displayed corpus unit relies only on a document-level seed locator; every verified quotation has a non-pending citation; every lineage edge has an explicit evidence status.

### 2 — Rights and quotation review (parallel to Phase 1)

1. Review each of the **14** modern-translation source records in `data/translations/rights_manifest.json` by jurisdiction, edition, quotation length, and intended public reuse (13 of the 14 are referenced by verified quotations; the manifest is the review unit, not the reference count).
2. Record a human editorial decision in `rights_manifest.json`; do not mistake online availability for a license.
3. Prefer public-domain/openly licensed translations for complete comparative registers; use short attributed excerpts for copyrighted works only when approved.
4. Keep AI/reconstruction labels explicit and never backfill a scholar’s name onto generated text.

**Exit evidence:** every visible modern quotation has a documented editorial decision and a source/reference suitable for its displayed status.

### 3 — Biyanlu as the next content pilot

Biyanlu now has 100 represented case records but still needs its missing source fields and human sign-off. **Wave 1 update (PR #30, 2026-09-11):** all 20 adjudicated W1-flagged content fields were re-keyed verbatim from the pinned, digest-verified T48n2003 witness and every one re-classifies EXACT — content flags 42 → 22, collating content fields 353/395 → 373/395. What remains is the documented residual (22 MINOR fields left by policy, 86 `title_zh` metadata flags, one disclosed unfixed coverage gap at case 42's 垂示), the post-verse 評唱 English, and human sign-off; the document stays `partial_or_failed_w1_collation` until the evidence pass re-adjudicates it.

**Congronglu is not a pilot candidate and holds 0 cases.** It must restart from authoritative T48n2004 TEI under field-level collation; none of the quarantined generated records may be copied back, and no *Congronglu* text may re-enter the bundle before every restored case collates against that witness. The 100-case figure in `vision.md` §7 is an ambition with this contract attached, not a coverage claim.

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
- Re-ingest Congronglu (**0 cases held today**; quarantined 2026-08-10, standing owner decision) from authoritative T48n2004 TEI only after field-level provenance and anti-placeholder gates exist — the gate set now does exist (`scripts/collate_refs.py` + `scripts/collate_corpus.py` + `scripts/test_source_preservation.py`), so the remaining condition is a collated witness for every restored case, and reinstatement stays an owner decision; expand other texts under the same contract.
- Grow the glossary and Gong’an index from collated units, rather than through disconnected bulk additions.
- Publish periodic data-quality metrics and an editorial changelog.

## Release-blocking checklist — Wave 1 close-out (added 2026-09-12)

Four items gate a research release that the 2026-08-10 checklist did not know about, because the measurement that exposed them landed after it. Each is stated with its evidence source, its exit criterion, and who may act. **None of them is closed by documentation**, and none may be reported as progress by re-wording a status.

- [ ] **1. Post-remediation evidence pass — publish a new register.** The authoritative figure is still the 2026-09-10 register's **630** flagged source fields, while a fresh collation of current `main` reports **532**; the project cannot honestly quote a current number until a new dated register and report are committed. *Exit:* a collation re-run over current `main` committed under `sessions/` with its refs manifest and every reference digest verified (39 verified / 0 drift at CBETA XML P5 revision `dbdea41071e1e260ad84b72faefd4587333cf76d`), the five re-keyed/labelled documents re-adjudicated, `data/project_metrics.json` regenerated through the protected `--write-metrics` path, and the gate-pinned figures in `README.md` / `AUDIT.md` / `HANDOFF.md` / `ROADMAP.md` re-pointed at the new record. *Who:* agent-executable, owner-merged. **Until it lands, `630` stays "the register" and `532` stays "today's data as measured" — and neither is a completion claim.**
- [ ] **2. Label visibility in the reader.** The corpus carries **49** provenance notes and the reader renders **one** site: `recension_note` at verse level only, `coverage_note` in the dossier's Reading ledger, while `cbeta_note` (16 fields — including recorded citation corrections such as `caoxi_zhuan`'s note that the prior "X1458" citation was wrong) and `editorial_note` (8 fields — including the labels marking `linji_yulu` sections 71–73 and `xinxin_ming` stanza 31 as project retellings with no witness attribution) are never rendered. `platform_sutra`'s **root** recension note, which discloses that 9 of its 13 source-content fields are project précis, is unreachable. *Exit:* every note key rendered at every node type that carries it (chapter, dialogue, verse, document root) through one shared renderer reusing the existing muted-note treatment — no new CSS, no redesign, no change to what a note says — plus a data-driven gate that fails whenever a `*_note` key in `data/corpus/*.json` is neither rendered nor on an explained exemption list. Zero data bytes and zero CJK movement. *Who:* agent-executable (reader + test only).
- [ ] **3. The owner's fabricated-text policy decision.** [`.orchestrator/PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md) → `## Owner decision required` frames the material attested in no pinned reference (`dahui_hongzhi`'s 默照銘 tail, `guiyang_yulu` 0/6, `yuanwu_letters` 0/2, and the other tier-2 rows) with three options: replace with witness text where the pinned set carries the passage, keep and label as project composition with the witness claim removed, or remove the document from the public set. *Exit:* a recorded owner ruling per document, then the corresponding `LABEL` / `RE-KEY` rows executed one document per PR. *Who:* **owner decision — not agent-authorisable.**
- [ ] **4. The human-sourcing queue — 31 documents with `OUT-OF-CBETA` witnesses.** Dunhuang P.3018 (`caoxi_zhuan`), P.2125 (`lidai_fabao_ji`), P.2885/S.5619 (`niutou_juezhu`), 趙州錄 editions, the 白頭宮女 recension of the Five Ranks (`dongshan_yulu`), the SBCK/Zokuzōkyō-lineage Hanshan copy, and the rest of the [`.orchestrator/PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md) §7 table. *Exit:* a human sequencing decision — which witnesses to acquire, in what order, at whose cost — and then per-document collation against the acquired witness. *Who:* **not agent-authorisable**: no agent may fetch, transcribe or evaluate any of these witnesses, and none of them is in CBETA.

Two further queues are release-relevant without being new blockers, both ranked with a reproduce command per row in `.orchestrator/PHASE2_PLAN.md`:

- the **6 `CITATION` rows** — false public claims still carried by the data, the worst being `zhaozhou_yulu`'s witness claim **T1987, which is false**: T1987 is the **Caoshan** record and the true in-set witness is X68n1315, while `data/corpus/zhaozhou_yulu.json`, `data/corpus_manifest.json` and two verified-quotation `reference` strings still cite it. There is no "keep and label" option for a wrong work name: the claim should simply stop being said. Agent-executable.
- the **51 `LABEL` rows** (27 documents) and **11 `RE-KEY` rows** (10 documents) under the adopted R-A/R-B/R-C policy — text absent from the claimed witness with no older substitute in the pinned set gets an honest note and keeps its text; text the pinned witness does carry gets re-keyed to it. Agent-executable, one document per PR.

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
