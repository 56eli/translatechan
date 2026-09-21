# Assessment — TC Export Consumer Requirements (botrunner lane) vs current translatechan exports

**From:** translatechan orchestrator (Role 1 — corpus and gates) — assessment requested by owner
**To:** owner + botrunner orchestrator (Role 2) via owner
**Date:** 2026-09-21
**Base:** main 5982e3e (44 docs, 10 collated, 4,192 locators, 8,783,101 B bundle, lineage 20 exact +10 source +1 frontier =30 verified, 1 pending dahong→yuelin intentional, masters 35 linked 33, P2 Tier2 Guiyang+Fayan labels 43-ref layer)
**Consumer doc:** TC-EXPORT-CONSUMER-REQUIREMENTS.md 2026-09-21 (290 lines, 12.6KB) — botrunner lane advisory, owner applies

**Charter:** ROLE_CHARTER_nonduality_wiki_2026-09-20.md — translatechan is database + integrity gate, only source of content, only authority on evidence states; botrunner is LOSSLESS middleman — reformats, structures, presents, never authors content; owner above both holds secrets and merges.

---

## Current exports inventory (translatechan lane)

- `data/corpus_manifest.json` — schema_version 1.0, description, source_review with w1_report_path, w1_register_path, evidence_date, correction overlay chain, authoritative_register_path, items array with key, title, cbeta, unit_targets, completion_status, source_review_status
- `data/corpus/*.json` — 44 docs, each id = filename (e.g. wumenguan), title_zh, title_pinyin, title_en, cbeta_id, taisho_vol, author_zh, author_en, era, genre, preface/epilogue/cases/sections/dialogues/stanzas/chapters, coverage_note, cbeta_note, editorial_note, recension_note, zh_chars
- `data/lineage/masters.json` — 35 masters, each id stable (e.g. zhaozhou_congshen), name_zh, name_pinyin, name_romaji, name_en, title, dates, era, school, school_key, location, lineage_depth, teacher (parent by id), disciples (children by id), texts, key_quote_zh/en, cbeta_id, summary, alternative_names, profile_status, linked_corpus_keys (by corpus id), profile_evidence
- `data/lineage/lineage_verification.json` — schema_version, policy, sources array (source_id, title, canonical_id, reference, source_type), edges array (teacher, disciple, status, source_id, reference, note), frontiers array (teacher_label, disciple, status, source_id, reference)
- `data/aliases.json` — _note, _status draft_seed, masters array (id, name_zh, name_en_popular, name_en_formal, aliases, works), works array, _meta
- `data/english_references.json` — _note, _status, references array (id, title_en, title_zh, author_zh, translator_en, publisher, year, isbn_10, isbn_13, isbn_status, pages, original_cbeta_id, tier, rights_status, url, notes)
- `data/project_metrics.json` — schema_version, corpus, lineage_verification (statuses), lineage_profile_review, editorial_traceability, canonical_locator_coverage, manifest_integrity, measurement_method, rights_coverage, translations
- `app_data.js` / `docs/app_data.js` — window.TRANSLATECHAN_DATA = {glossary, lineage, lineage_verification, lineage_school_vocab, translations_matrix, translator_profiles, translations_provenance, translations_rights, canonical_locators, project_metrics, gongan_index, gongan_theme_vocab, corpus_manifest, corpus, meta} — auto-generated bundle 8,783,101 B deterministic byte-identical root/docs
- Gate: `scripts/validate_data.py` — main() -> int, exit 0 = safe to publish, non-zero = do not publish, read-only unless --write-metrics flag, plus build_data_bundle.py determinism check

---

## Assessment per R1–R12

### R1 — Stable immutable id on every exported entity — MOSTLY PASS, 1 GAP

**Pass:**
- Corpus docs: id = filename, never changes, never reused, opaque (e.g. wumenguan, zhaozhou_yulu_full)
- Masters: id stable (zhaozhou_congshen), never reused
- English references: id stable (blue_cliff_record_cleary_2005 etc)
- Aliases masters/works: id = canonical lineage/corpus id, stable
- Glossary, gongan_index, translator_profiles: id stable

**Gap:**
- Lineage edges: currently identified by composite key (teacher, disciple) pair, no explicit edge id. If teacher id changes (unlikely) or edge is split, matching by pair breaks idempotency. Needs explicit immutable edge id, e.g. `edge_bodhidharma_huike` or UUID, never reused. Botrunner needs this for idempotency — without it, title-matching duplicate page risk applies to edges. Recommendation: add `id` field to each edge, stable, e.g. `{teacher}_{disciple}` as id, never reused even if edge retracted (then tombstone).

**Anti-requirement violation risk:** low — we already key on id for most entities, but edges violate.

### R2 — Explicit type on every entity, and explicit parent by id — PARTIAL PASS

**Pass:**
- Masters: teacher (parent by id), disciples (children by id), school_key, lineage_depth — explicit parent
- Lineage edges: teacher, disciple by id — explicit parent
- Corpus manifest items: key = corpus id, parent implicit via manifest ordering? Not explicit parent by id, but corpus docs themselves have no parent — they are top-level works. Could add explicit type field.

**Gap:**
- Corpus docs: no explicit `type` field with closed enum (e.g. type: yulu, denglu, gongan, qinggui, treatise). Currently genre field exists but not documented as closed enum. Need explicit `entity_type` e.g. `work` + `genre` as subtype, and parent = null for top-level works, or for nested structure (work → fascicle → section → passage) need explicit parent by id. Currently corpus JSON has nested arrays (cases, sections, dialogues) without ids on each passage. BookStack target has only Shelf→Book→Chapter→Page one level — something must flatten, and translatechan should decide mapping rule, not botrunner. Need to decide: e.g. every work = Book, every fascicle = Chapter, every passage (case/section/dialogue) = Page with parent chapter id. Currently passages have no stable id — they are array indices. This breaks R1 and R2 for passages.

**Recommendation:** Add stable id to every publishable passage (e.g. `wumenguan_case_01`), explicit `type` (work, fascicle, case, section, dialogue, stanza, chapter), explicit `parent_id` by id, explicit `order` integer (R8). Provide mapping rule doc: e.g. "every work is a Book, every fascicle is a Chapter, every passage is a Page" — owner to rule per R2 open question 1.

### R3 — Evidence state as machine-readable value plus display label — PARTIAL PASS

**Pass:**
- corpus_manifest items have `completion_status` (partial_selected_witness etc) and `source_review_status` (collated_to_claimed_witness, partial_or_failed_w1_collation, witness_unavailable) — machine-readable codes from closed set
- lineage_verification edges have `status` enum: exact_locator_verified, source_verified, traditional_link_pending_exact_locator, disputed — closed set, documented in validate_data.py VALID_LINEAGE_EDGE_STATUSES
- project_metrics has lineage_verification statuses counts

**Gap:**
- Corpus docs themselves have no explicit W1 code field, only coverage_note prose + cbeta_note. The gate derives status from collation register, not from doc field. Botrunner needs code + label + optional explanation as data, not prose, per R3. Currently it would need to parse coverage_note prose or read corpus_manifest. Better to add explicit `w1_status` field to each corpus doc and each passage with code, label, explanation.
- Complete list of possible codes and meanings not in single schema doc — scattered in source_review.py, validate_data.py, ROADMAP.md. Need schema doc listing all codes: collated_to_claimed_witness, partial_or_failed_w1_collation, witness_unavailable, plus completion_status enum, plus lineage statuses, plus profile_status enum, plus editorial_note types.
- Importer must fail loudly on unknown code — currently app.js mirrors codes but no explicit fail-closed doc for botrunner.

**Recommendation:** Publish schema doc `docs/SCHEMA.md` or `schemas/translatechan-data.schema.json` already exists but jsonschema library not installed in CI (warning). Need to ensure schema includes all enums with descriptions, and botrunner importer pins version and fails closed on unknown code.

### R4 — Provenance fields per publishable unit — PARTIAL PASS

**Pass:**
- Corpus docs have cbeta_id, taisho_vol, cbeta_note, coverage_note — source key
- Masters have cbeta_id, linked_corpus_keys, profile_evidence with status and note — attribution
- English references have original_cbeta_id, translator_en, publisher, year, url, rights_status

**Gap:**
- No explicit boolean `is_ai_styled` per unit. Charter requires AI-assisted output labelled with 🤖 marker. Currently translations are Robo fake by design (1,252 slots 177 verified quotations 876 reconstructions 199 AI drafts) but no explicit boolean field — botrunner would need to infer, which R4 says must be explicit boolean, absent = unknown = refuse import. Need to add `is_ai_styled: true/false` to every translation unit and to corpus docs that are project retellings (e.g. dazhu_huihai, nanquan_yulu, guiyang_yulu, fayan_yulu etc have editorial_note marking retellings but no boolean).
- Attribution fields not consistent: some docs have author_en, some not; translator, edition, date not always present.

**Recommendation:** Add `provenance` object to each publishable unit: source_key, source_edition, translator, edition_date, is_ai_styled boolean, import_reference (commit + timestamp). Ensure English references have rights_status and is_ai_styled false (human translations) vs true for Robo.

### R5 — Schema version and changelog — PARTIAL PASS

**Pass:**
- corpus_manifest has schema_version 1.0
- lineage_verification has schema_version
- project_metrics has schema_version
- app_data.js has meta with version?

**Gap:**
- No single version field in export covering all files — multiple schema_version fields but not one export-level version. Need export-level version field, e.g. in corpus_manifest or separate manifest.json with version, timestamp, commit.
- No changelog doc saying what changed between versions. Need `CHANGELOG.md` or `schemas/CHANGELOG.md` documenting added codes, new fields, etc. Charter wave model (TC announces, botrunner adapts, owner approves) needs version number to hang off — currently no version pin for botrunner importer to fail closed on unexpected version.

**Recommendation:** Add top-level `export_manifest.json` with schema_version, export_timestamp, commit (git rev-parse HEAD), files list with checksums (R12), and link to changelog. Document changelog.

### R6 — Gate I can run, with documented exit codes — PASS with documentation gap

**Pass:**
- Gate exists: `python3 scripts/validate_data.py` — exit 0 = safe to publish, non-zero = do not publish (binary contract). Output capturable, report attached to import report.
- Read-only: without --write-metrics flag, it is read-only (does not modify repo). With --write-metrics it writes project_metrics.json — should document that --write-metrics is NOT part of gate, gate is without flag.

**Gap:**
- Exact command line not documented in single place for botrunner — need to state: `python3 scripts/validate_data.py` is gate, exit 0 safe, non-zero do not publish, plus `python3 scripts/build_data_bundle.py` determinism check (two consecutive builds byte-identical) as secondary gate? Also `node scripts/smoke_test.mjs` for reader? Need to document which gates are preconditions for publication per charter.
- What gate needs in order to run: checkout of repo, Python 3.11, no extra deps (jsonschema optional). Need to document.

**Recommendation:** Publish `docs/GATE.md` with exact command lines, exit codes, read-only promise, and that botrunner must run gate first and import nothing on failure.

### R7 — Deletion and retraction semantics — FAIL, needs design

**Current:** If entity disappears from one export to next, botrunner cannot tell if withdrawn, retracted pending review, moved to different parent, or export truncated/bug. Currently no tombstones. Default botrunner will never delete published page on basis of absence alone, reports absences as warnings, until TC tells what absence means.

**Gap:** No tombstone status. Need explicit status such as `withdrawn` or `superseded` with optional `superseded_by` pointing to replacement id. For example, if a corpus doc is withdrawn, it should stay in export with status withdrawn, not vanish. Currently if we remove a file, it vanishes — botrunner would see absence and not know if bug or intentional.

**Recommendation:** Add `lifecycle_status` enum: active, withdrawn, superseded, retracted_pending_review, with `superseded_by` id. Keep tombstoned entities in export with that status. Document that absence alone never means deletion — botrunner must report warnings and never delete on absence.

### R8 — Explicit sibling ordering — FAIL

**Current:** corpus_manifest items array order is implicit file order, not explicit integer sort key. Corpus docs internal arrays (cases, sections, dialogues) have implicit order by array index, not explicit sort key. Titles change, alphabetical-by-title meaningless for transliterated names.

**Gap:** Need integer sort key or explicit ordered list of child ids. For example, each master has lineage_depth but not sort key among siblings with same teacher. Each corpus case has case_num but not explicit order field? Actually case_num exists for chuandenglu_full but not for other docs.

**Recommendation:** Add `order` integer field to every entity, or `children_ordered_ids` list in parent. For lineage, order disciples by traditional order or by case_num. For corpus, order cases/sections by case_num or explicit order.

### R9 — Declared body format, conservative — PARTIAL PASS

**Current:** Text payloads are plain CJK? Actually corpus JSON zh fields are plain CJK strings, pinyin, en. No explicit declaration of body format. Some fields may contain HTML? App.js renders with some HTML? Need to check.

**Gap:** Need to declare body format per text unit: plain text, Markdown, or defined subset of HTML. Keep to subset documented to avoid stored-XSS. Need to explicitly state how typographically special is represented: interlinear glosses, footnotes, textual variants, missing/illegible passages. Currently no convention documented — botrunner will pass through verbatim rather than invent one, which is correct but should be documented. Unicode normalization: need to state which form (NFC, NFKC etc). For CJK plus diacritics matters for search and duplicate detection. Currently extraction rule keeps only U+3400-U+9FFF and U+F900-U+FAFF, NFKC and graphic-variant map applied in collator, not baked into reference — need to document normalization form for export.

**Recommendation:** Publish `docs/BODY_FORMAT.md` stating: body is plain CJK + pinyin + English Markdown subset (bold, italic, code, links?), no arbitrary HTML, footnotes as separate field, variants as separate field, Unicode normalized to NFC (or NFKC) — decide and document.

### R10 — Cross-references by id, not by title or URL — MOSTLY PASS, some warnings

**Pass:**
- Masters: teacher by id, disciples by id, linked_corpus_keys by corpus id
- Lineage edges: teacher, disciple by id
- English references: master_ids, work_ids by id (if present)
- Aliases: id = canonical id

**Gap:**
- gongan_index.json has protagonist field that looks like internal lineage key but not in masters.json — 7 warnings: juzhi, huoan_shiti, xiangyan_zhixian, shakyamuni_and_mahakasyapa, dongshan_shouchu, zhimen_kuan, huangbo — confirm intentionally unprofiled figure. These are cross-refs by id but target not in masters.json — need to decide if intentionally unprofiled or missing profile.
- Some docs may have hardcoded nonduality.duckdns.org URLs in content? Need to check — requirement says absolute wiki URLs inside content rot on reorganisation, should never appear in corpus. Currently no absolute wiki URLs in corpus JSON (only in vision docs), but need to ensure.
- No absolute URLs in corpus — good.

**Recommendation:** Resolve gongan protagonist warnings: either add frontier profiles for juzhi etc with explicit profile_evidence, or document as intentionally unprofiled with reason. Ensure no hardcoded wiki URLs in data/.

### R11 — Language and script, per text unit — PARTIAL PASS

**Current:** Corpus docs have zh, pinyin, en fields, but no explicit language tag per unit (e.g. zh-Hant, zh-Latn-pinyin, en). Need explicit language, script, transliteration scheme.

**Gap:** A page holding original and translation needs units distinguishable so botrunner can present side by side rather than concatenating into one blob. Currently app.js does side-by-side but via field names, not explicit language tag.

**Recommendation:** Add `lang` field per text unit: e.g. `zh-Hant`, `zh-Latn-pinyin`, `en`, plus `script` and `transliteration_scheme` (e.g. Hanyu Pinyin). For each passage, have `texts` array with objects {lang, script, body, is_ai_styled}.

### R12 — Packaging: manifest, atomicity, integrity — PARTIAL PASS

**Current:**
- corpus_manifest.json exists but no checksums per file
- project_metrics.json has manifest_integrity but not file-level checksums
- No export-level timestamp and commit in single manifest — corpus_manifest has evidence_date but not commit, project_metrics has measurement_method but not commit? Need to check.
- No atomic publication marker — no ready marker written last or versioned directory.

**Gap:**
- Need manifest listing every file with checksum (sha256), so botrunner can prove complete export not half-written.
- Need export-level timestamp and commit/revision of corpus it was produced from — what provenance stamp cites.
- Need atomic publication: ready marker written last, or versioned directory.

**Recommendation:** Create `export_manifest.json` with version, timestamp (ISO8601), commit (git rev-parse HEAD), files array with path, sha256, size, plus ready marker file `export_ready.json` written last. Format can be JSON, JSONL preferred for diffability per doc — one record per line JSONL easiest to diff and stream, mild preference. Could publish both JSON and JSONL.

---

## Open questions from consumer doc §6 — answers from translatechan perspective

1. **Which entity types become books, chapters, pages?** — Needs owner ruling. Proposal: every work (corpus doc) is a Book, every fascicle (if present) is a Chapter, every passage (case/section/dialogue/stanza/chapter) is a Page with parent chapter id. For works without fascicles (wumenguan 48 cases), each case is a Page chapterless or under Chapter "Cases". Owner to rule.
2. **Complete set of W1 codes and what each renders as?** — Currently: collated_to_claimed_witness, partial_or_failed_w1_collation, witness_unavailable, plus completion_status partial_selected_witness etc, plus lineage statuses exact_locator_verified, source_verified, traditional_link_pending_exact_locator, disputed, plus profile_status Seed profile pending exact locator, Frontier profile — no exact biographical/source locator recorded, Frontier profile — reviewed; exact source locator still pending, Frontier profile — exact corpus entry located; biography and teacher frontier remain unverified, plus editorial_note types. Need to publish complete list in schema doc.
3. **What does absence from export mean?** — Currently undefined. Proposal: absence alone never means deletion — botrunner reports warnings, never deletes on absence. Deletion/retraction via tombstone lifecycle_status withdrawn/superseded/retracted_pending_review with superseded_by.
4. **Is a page ever composed of several records — original plus translation plus notes — or always one record, one page?** — Currently one corpus JSON contains original zh + pinyin + en translations (Robo fake) + notes (coverage_note, cbeta_note, editorial_note, recension_note). Proposal: one Page per passage composed of several text units (original zh-Hant, pinyin zh-Latn, en) plus notes as separate units, all linked by parent passage id. Owner to rule.
5. **Does any content need to be non-public at page granularity, or whole wiki public-read?** — Charter says public read, owner-locked write. No embargoed material currently. Confirm: whole wiki public-read.
6. **Is corpus append-mostly, or do published units get revised often?** — Append-mostly plus revisions: new docs added (38→44), existing docs revised for authenticity labels (Baizhang, Huangbo, Dazhu, Nanquan, Guiyang, Fayan) with 0 unauthorized but permitted allowlisted changes. So importer should optimise for updates (idempotent keyed by id, re-running updates same page, never duplicates).
7. **What is gate command and what does it need?** — Gate: `python3 scripts/validate_data.py` exit 0 safe to publish, non-zero do not publish, read-only unless --write-metrics. Needs checkout of repo, Python 3.11, no extra deps (jsonschema optional). Secondary: `python3 scripts/build_data_bundle.py` determinism check two consecutive builds byte-identical, `node scripts/smoke_test.mjs` reader smoke. Document in GATE.md.

---

## Recommendations — translatechan lane (owner to approve wave)

1. **Add explicit edge id** to lineage_verification.json edges — e.g. id = f"{teacher}_{disciple}", stable, never reused, tombstoned if withdrawn.
2. **Add stable id to every passage** (case/section/dialogue/stanza) — e.g. wumenguan_case_01, plus type, parent_id, order — and publish mapping rule Book/Chapter/Page for botrunner.
3. **Add explicit W1 status field** to each corpus doc and passage: code from closed enum, label, explanation — not prose parsing. Publish complete enum list in schema doc.
4. **Add is_ai_styled boolean** to every text unit — explicit, absent = refuse import.
5. **Publish export_manifest.json** with schema_version, export_timestamp, commit, files with sha256, ready marker, plus CHANGELOG.md.
6. **Implement tombstone lifecycle_status** — withdrawn/superseded/retracted_pending_review + superseded_by — never delete on absence alone.
7. **Add explicit order** integer or children_ordered_ids — not implicit file order or alphabetical-by-title.
8. **Publish BODY_FORMAT.md** — declared body format plain text/Markdown subset, no arbitrary HTML, how glosses/footnotes/variants/missing represented, Unicode normalization form (recommend NFC for export, NFKC applied in collator).
9. **Resolve gongan protagonist warnings** — add frontier profiles or document intentionally unprofiled.
10. **Add lang field per text unit** — zh-Hant, zh-Latn-pinyin, en, script, transliteration_scheme.
11. **Publish GATE.md** — exact command lines, exit codes, read-only promise.
12. **Sample export** — 5 records + paragraph explanation per consumer doc §7 — worth more than perfect spec.

---

## What is NOT asked for (per consumer doc §5) — and we will NOT do

- Not BookStack-shaped export — we export domain, botrunner does mapping — we will NOT model books/chapters.
- Not presentation decisions — no layout, ordering-for-effect, SEO titles, theme — botrunner lane.
- Not credentials — never hold secrets, owner applies.
- Not performance work — volumes small.
- Not delivery mechanism yet — owner decides release artifact, fetched file, or manual copy.

---

## Assessment verdict

**Current exports are 70% ready for botrunner import — R1, R2, R6, R10 mostly pass, R3-R5, R7-R9, R11-R12 need gaps closed.** No anti-requirements violated (no identity keyed on title/slug, no renumbering ids, no absolute wiki URLs inside content, no arbitrary HTML, gate read-only). Biggest gaps: no explicit passage ids (R1/R2), no is_ai_styled boolean (R4), no tombstones (R7), no explicit order (R8), no single export manifest with checksums + timestamp + commit + ready marker (R12), no schema changelog (R5), no complete W1 codes doc (R3). All gaps are fixable in translatechan lane as schema additions, not content changes, with owner-approved wave.

**Next step per consumer doc §7:** publish schema doc + sample export (5 records plenty) — e.g. export_manifest.json + sample JSONL with 5 masters + 5 corpus passages with all required fields — then botrunner writes importer as normal task: prompt published, one agent, one PR, gates-first, idempotent, provenance stamped, dry-run mode first so owner can see diff before anything written.

*Botrunner lane advisory only — owner applies everything.*
