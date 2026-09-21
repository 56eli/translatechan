# TranslateChan Export Schema — v1.1 (2026-09-21)

**Owner ruling Q1:** work=Book, fascicle=Chapter, passage=Page
**Owner ruling Q7 W3:** wiki receives ONLY `collated_to_claimed_witness` docs. Everything not 100% will NOT be exported at all. No imperfections on wiki.
**Owner consideration Q5:** rights_status + visibility flags emitted as metadata, not yet enforced. Wiki currently all-public for the 100% subset, but flags allow future private decision.

This doc satisfies R1-R12 of TC-EXPORT-CONSUMER-REQUIREMENTS.md.

---

## 1. Stable immutable IDs (R1)

- Every entity has `id`: lowercase, digits, hyphen/underscore, never reused, never renumbered on title change.
- Pattern:
  - work: `wumenguan`, `congronglu`, `chuandenglu_full`, `caoshan_benji`, `huangbo_fayao_full`, `mazu_guanglu_full`, `yunmen_guanglu_full`, `dongshan_yulu_full`, `zhaozhou_yulu_full`, `dahui_yulu_full`, `zhengdao_ge`
  - fascicle: `{work}_fascicle_{nn}` e.g. `chuandenglu_full_fascicle_06`
  - passage: `{work}_{type}_{nn}` e.g. `wumenguan_case_01`, `congronglu_case_001`, `chuandenglu_full_case_0128`, `zhengdao_ge_stanza_01`
  - master: `master_{id}` e.g. `master_bodhidharma`
  - lineage_edge: `{teacher}_{disciple}` e.g. `bodhidharma_huike` (R1 explicit edge id)
  - gongan: `gongan_{nn}`
- ID is primary key for BookStack import. Title/slug never used as key.
- Deleted entity stays as tombstone with same id, never reused.

## 2. Type + parent + order (R2, R8)

- `type`: closed enum `work`, `fascicle`, `case`, `section`, `dialogue`, `stanza`, `chapter`, `five_ranks`, `sample_record`, `master`, `lineage_edge`, `gongan`
- `parent_id`: id of parent, null for root work/master. Work=Book, fascicle=Chapter, passage=Page.
- `order`: integer sibling order, 1-based, stable, explicit. Not implicit file order, not alphabetical-by-title. `children_ordered_ids` optional for Book/Chapter.
- Mapping rule: Book = work JSON file, Chapter = fascicle inside work (if work has fascicles), Page = smallest readable unit (case/section/dialogue/stanza). For works without fascicles (wumenguan 48 cases), each case is a Page directly under Book (chapterless) with order 1..48.

## 3. W1 status (R3) — closed enum, fail-closed

From `scripts/source_review.py`:

- `VALID_SOURCE_REVIEW_STATUSES`:
  - `collated_to_claimed_witness` — Label "Collated to claimed witness" — every content field (zh, verse_zh, commentary_zh, pointer_zh) is EXACT/REWORDED in claimed witness. Metadata title_zh/name_zh excluded. Never approves reuse. This is 100% collation.
  - `partial_or_failed_w1_collation` — Label "Partial or failed W1 collation" — claimed witness present but at least one content field NOT collated (NOT_FOUND, DIVERGENT etc). Project retelling — no witness attribution.
  - `witness_unavailable` — Label "Witness unavailable — not collated" — no witness text in pinned set.

- `VALID_COMPLETION_STATUSES`:
  - `complete_selected_witness`
  - `partial_selected_witness`
  - `excerpt_seed`
  - Rule: `complete_selected_witness` only allowed when W1 is `collated_to_claimed_witness`. Enforced in source_review.py + mirrored in app.js + smoke test. Incompatible degrades to partial but validator rejects.

- `COLLATION_CLASSES` (per field, fixed order):
  - `EXACT`, `REWORDED` — collated
  - `MINOR`, `DIVERGENT`, `NOT_FOUND`, `TITLE_COMPOSITE`, `SHORT_UNMATCHED`, `WITNESS_UNAVAILABLE`, `EMPTY` — non-collating

- `VALID_LINEAGE_EDGE_STATUSES`:
  - `exact_locator_verified` — exact lb range T51n2076_pXXXX–pYYYY + verbatim
  - `source_verified`
  - `traditional_link_pending_exact_locator`
  - `disputed`

- `profile_status` examples:
  - Seed profile pending exact locator
  - Frontier profile — no exact biographical/source locator recorded
  - Frontier profile — reviewed; exact source locator still pending
  - Frontier profile — exact corpus entry located; biography and teacher frontier remain unverified

- `DISCLOSURE_LEDGERS` (5 separate blocks, must stay visibly separate, app.js labels each with data-ledger, smoke test requires all 5):
  - `source_collation` — Source collation (W1)
  - `represented_units` — Represented units
  - `translation_edition_verification` — Translation & edition verification
  - `canonical_locator` — Canonical source locator
  - `rights_review` — Rights review
  - Separation note: "Separate ledgers: none of these answers implies another."

- Badge rendering: must show machine code + label + explanation verbatim, never paraphrase upgrade. Unknown code → importer must fail loudly, never default to nicer badge. Page must never display better evidence than data says.

- **Wiki filtering (owner ruling):** export contains ONLY `collated_to_claimed_witness` docs. Importer defense-in-depth: if it ever sees `partial_or_failed_w1_collation` or `witness_unavailable`, fail.

## 4. Provenance + is_ai_styled (R4)

- `provenance`:
  - `source_key`: e.g. `jingde-chuandenglu`, `wumenguan`
  - `source_edition`: e.g. `T51n2076`, `T48n2005`
  - `cbeta_id`: e.g. `T2005`
  - `witness_path`: e.g. `T51n2076.xml`
  - `extraction_rule`: `cbeta-p5-body-cjk-v1` (TEI body only, drop notes/g, keep only CJK U+3400-U+9FFF/U+F900-U+FAFF, NFC)
  - `witness_revision`: `dbdea41071e1e260ad84b72faefd4587333cf76d`
  - `translator`: optional, e.g. `robo`, `red_pine`
  - `edition_date`: optional
  - `is_ai_styled`: boolean explicit, absent = refuse import. true = English is our AI-styled Robo fake, ours not copyrighted. false = human translation or original zh.
  - `import_reference`: {`commit`: git rev-parse HEAD, `timestamp`: ISO8601, `evidence_register_path`: sessions/COLLATION_REGISTER_...json, `w1_report_path`}
  - `source_id` for English verified_quotation: e.g. `blyth-mumonkan-1966`

- Every text unit in `texts` array has its own `is_ai_styled` boolean.

## 5. Schema version + changelog (R5)

- `schema_version`: e.g. `1.1` — semantic versioning, breaking change bumps major.
- `export_timestamp`: ISO8601 UTC
- `commit`: git commit hash of corpus it was produced from
- `CHANGELOG.md` documents version bumps.

## 6. Gate (R6)

- Gate command: `python3 scripts/validate_data.py` — exit 0 safe to publish, non-zero do not publish, read-only unless --write-metrics.
- Needs checkout of repo, Python 3.11+, no extra deps (jsonschema optional).
- Secondary: `python3 scripts/build_data_bundle.py` determinism check — two consecutive builds byte-identical, root/docs mirror diff clean.
- Tertiary: `node scripts/smoke_test.mjs` reader smoke.
- Documented in `docs/GATE.md`.

## 7. Tombstones (R7)

- `lifecycle_status`: closed enum `active`, `withdrawn`, `superseded`, `retracted_pending_review`
- `superseded_by`: id of replacement or null
- Entity stays in export with status withdrawn/superseded, not vanish.
- Absence alone never means deletion — botrunner default never deletes published page on basis of absence alone, reports absences as warnings.
- Export manifest with files checksums proves complete export not half-written, so absence can be distinguished from half-written export.

## 8. Order (R8)

- `order`: integer, 1-based, explicit sibling order.
- `children_ordered_ids`: optional array of child ids in order for Book/Chapter.

## 9. Body format (R9)

- Declared `body_format`: `plain_cjk_markdown_subset_v1`
- Body is plain CJK + pinyin + English Markdown subset (bold, italic, code, links), no arbitrary HTML, no absolute wiki URLs, footnotes as separate field, variants as separate field.
- Unicode normalized to NFC for export. Collator internally uses NFKC + graphic-variant map but reference extraction keeps only CJK U+3400-U+9FFF/U+F900-U+FAFF, line-joined.
- Documented in `docs/BODY_FORMAT.md`.

## 10. Cross-refs by id (R10)

- All cross-refs by id, not title/URL:
  - master.teacher: master id
  - master.disciples: array of master ids
  - master.linked_corpus_keys: array of work ids
  - lineage_edge.teacher, disciple: master ids
  - passage.protagonist: master id (if present, must exist in masters.json or be intentionally unprofiled documented)
  - English references master_ids, work_ids by id
  - aliases id = canonical id
- No absolute wiki URLs inside content (only in vision docs).

## 11. Lang/script per unit (R11)

- Every text unit in `texts` array:
  - `lang`: BCP-47 — `zh-Hant` (original), `zh-Latn` (pinyin), `en`
  - `script`: `Hant`, `Latn`
  - `transliteration_scheme`: e.g. `Hanyu Pinyin`, null for zh-Hant/en
  - `body`: string
  - `is_ai_styled`: boolean
- Page composed of several records — original plus translation plus notes — as `texts` array linked by parent passage id, not one blob.

## 12. Manifest, atomicity, integrity (R12)

- `export_manifest.json` with:
  - `schema_version`
  - `export_timestamp` ISO8601
  - `commit`
  - `files`: array of {`path`, `sha256`, `size`}
  - `only_collated`: true (owner ruling)
  - `w1_filter`: `collated_to_claimed_witness` only
- `export_ready.json` ready marker written last for atomicity — contains same timestamp+commit, written after all files.
- Format: JSONL preferred for diffability — one record per line, easiest to diff/stream. We publish both JSONL and JSON.
- Sample export: 5 masters +6 passages with all required fields, including one `section`-type record (`linji_yulu_section_078`) (see `docs/sample_export.jsonl`).

---

## What is NOT asked for (per consumer doc §5)

- Not BookStack-shaped export — we export domain, botrunner does mapping
- Not presentation decisions — layout, ordering-for-effect, SEO titles, theme — botrunner lane
- Not credentials — never hold secrets, owner applies
- Not performance work — volumes small
- Not delivery mechanism yet — owner decides release artifact, fetched file, manual copy
