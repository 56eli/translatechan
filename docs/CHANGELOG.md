# Changelog — TranslateChan Export Schema

## Export re-issue — 2026-09-21 — after the Linji re-key (task P2.9) · `schema_version` stays `1.1`

**Why:** the 1.1 manifest was written in the purge commit and pinned `commit: a77d577662a168e4db437f781da4d7c16c642573`, a
pre-purge tree whose own hashes no longer matched three of its files (`data/corpus_manifest.json`,
`data/canonical_locators.json`, `data/lineage/masters.json` — i.e. it was internally inconsistent at issue time), and the
corpus has since gained the re-keyed Record of Linji. The re-issue recomputes every hash from one tree.

**Changed (files, not schema):**
- `export_manifest.json` — 23 files (was 22): the 11 `collated_to_claimed_witness` documents now include
  `data/corpus/linji_yulu.json`; all `sha256`/`size` values recomputed from the exported content commit; `commit` names that
  commit (the manifest and its `export_ready.json` marker are the release artifacts committed immediately after the content
  commit, and neither is listed in `files`, so the tree they describe is exactly the tree the hashes verify against);
  `only_collated: true`, `w1_filter: collated_to_claimed_witness`, `remaining_docs: 13`, `exported_to_wiki: 11`,
  `purged_retellings: 32`.
- `export_ready.json` — same timestamp + commit as the manifest, written last (atomicity rule unchanged).
- `docs/sample_export.jsonl` / `docs/sample_export.json` — 11 records (5 masters + 6 passages): the new
  `linji_yulu_section_078` record is the sample's first `section`-type unit (parent `linji_yulu`, order 78, locator
  `T47n1985_p0504a26–p0504a29`, `w1_status.code = collated_to_claimed_witness`, the document's own `coverage_note`, and
  `provenance.import_reference.commit` naming the commit the re-key's data landed in).

**Unchanged:** record schema and every enum (`schema_version` stays `1.1` — this is an export re-issue, not a schema change);
the 1.1 rulings (Q1-Q7 W3, `only_collated`, fail-closed badges, tombstones); the gate command and read-only promise in
`docs/GATE.md`.

**Honest note:** no script in this repository generates `export_manifest.json` / `export_ready.json`. The 1.2 files were
produced by the 2026-09-21 P2.9 session with `sha256` values computed from the content commit named in the manifest, and this
entry records that fact rather than implying a generator exists. If the release process wants a scripted artifact, that is a
new task.

## 1.1 — 2026-09-21 — Only 100% collated export, stable ids, manifest, tombstones

**Owner rulings:**
- Q1: work=Book, fascicle=Chapter, passage=Page — confirmed
- Q2: W1 codes complete set documented, badge rendering fail-closed
- Q3: tombstones confirmed — lifecycle_status active/withdrawn/superseded/retracted_pending_review + superseded_by
- Q5: rights_status + visibility flags as consideration, not decided — emitted as metadata
- Q6: append-mostly + revisions affirmed — importer idempotent keyed by stable id
- Q7 W3: wiki receives ONLY 100% collated docs (`collated_to_claimed_witness`). Everything not 100% will NOT be exported at all. No imperfections on wiki.

**Added:**
- `docs/SCHEMA.md` — full schema R1-R12, all enums, mapping rule, filtering rule only_collated
- `docs/BODY_FORMAT.md` — plain_cjk_markdown_subset_v1, no arbitrary HTML, NFC, extraction rule cbeta-p5-body-cjk-v1, notes separate
- `docs/GATE.md` — exact gate command `python3 scripts/validate_data.py` exit 0 safe, read-only promise, atomicity via export_ready.json
- `docs/ANSWERS_FOR_BOTRUNNER_2026-09-21.md` — plain language Q1-Q7, claimed witness explained, Q5 as consideration, Q7 W3 locked
- `export_manifest.json` — schema_version, timestamp, commit, files sha256/size, only_collated true
- `export_ready.json` — atomic ready marker written last
- `docs/sample_export.jsonl` — 5 masters +5 passages JSONL with all required fields: id stable immutable never reused, type + parent_id + order, w1_status code+label+explanation closed enum fail-closed, provenance source_key + is_ai_styled boolean, lang/script per unit, body_format, rights_status + visibility, lifecycle_status tombstones, cross-refs by id, canonical_locator, import_reference
- Lineage edge id explicit `{teacher}_{disciple}` e.g. `bodhidharma_huike`
- Passage stable ids e.g. `wumenguan_case_01`, `congronglu_case_001`, `chuandenglu_full_case_0128`
- `is_ai_styled` boolean explicit per text unit, absent = refuse import
- `lifecycle_status` + `superseded_by` tombstones
- `order` integer explicit sibling order

**Changed:**
- Export filtered to 10 collated docs only (zhengdao_ge, congronglu, chuandenglu_full, caoshan_benji, huangbo_fayao_full, mazu_guanglu_full, yunmen_guanglu_full, dongshan_yulu_full, zhaozhou_yulu_full, dahui_yulu_full) — 34 partial docs stay as research projects in translatechan, never exported
- ANSWERS doc Q5 proposal rewritten as consideration
- ANSWERS doc Q2 expanded with claimed witness explanation

**Fixed:**
- 3 unverifiable locators fixed (xuefeng→yunmen, wuzu→yuanwu, yuelin→wumen) — PR104
- 4 paraphrase quotes corrected — PR104
- Dahong→Yuelin closed X80n1566 p0902b07-b08 + T51n2077 p0701a01-a02 — PR104
- P2 Tier2 12 docs below 80% bar labels landed 45 pointers 27 dialogue-level R-B labels — PR105

**Base:** main 78e7495 (44 docs, 10 collated, 184 notes 142 rendered 37 labelled, 4,192 locators, 8,826,431 B bundle byte-identical root/docs deterministic, lineage 31/31 verified 20 exact+11 source 0 pending 4 frontiers derived from masters.json unchanged, masters 35 linked 33 unlinked 2 intentional yangqi+dahong)

## 1.0 — 2026-09-09 — Initial manifest

- corpus_manifest.json schema_version 1.0
- 34 docs, 35 per-document entries, 622 flagged total historical, 630 authoritative
- source_review: W1 report/register paths, evidence_date, status_scope, non_approval_statement
- W1 statuses: collated_to_claimed_witness, partial_or_failed_w1_collation, witness_unavailable
- Completion statuses: complete_selected_witness, partial_selected_witness, excerpt_seed
- Collation classes: EXACT, REWORDED, MINOR, DIVERGENT, NOT_FOUND, TITLE_COMPOSITE, SHORT_UNMATCHED, WITNESS_UNAVAILABLE, EMPTY
- Lineage edge statuses: source_verified, exact_locator_verified, traditional_link_pending_exact_locator, disputed
- 5 disclosure ledgers
- Build bundle deterministic

## 0.x — 2026-08 — Seeding

- 38 docs → 44 docs append
- 6 enthusiast fulls re-keyed verbatim from CBETA: Huangbo 19 units, Mazu 35, Yunmen 776, Dongshan 322, Zhaozhou 80, Dahui 1,354 =2,586 units 302,592 CJK 5,178 EXACT 93.8% collation
- congronglu 100 cases 500/500 EXACT, chuandenglu_full 1,274 units 2,549 EXACT, caoshan_benji 84 units 169 EXACT
