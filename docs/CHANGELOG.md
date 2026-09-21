# Changelog — TranslateChan Export Schema

## Export re-issue — 2026-09-22 — after the combined Wumenguan + Linji re-key overlay — `schema_version` stays `1.1`

**Why:** the previous re-issue pinned the 13-document Linji-only tree; corpus has since gained BOTH re-keys as one combined overlay — the re-keyed Gateless Gate (T48n2005, 48 cases, 207/207 EXACT, 0 flagged) and the re-keyed Record of Linji (T47n1985, 107 sections, 215/215 EXACT, 0 flagged) — under the combined authoritative register `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json` (14 documents, 15 flagged). The two single-re-key overlays rewrote the same manifest/queue/register surfaces and could not merge sequentially, so this re-issue ships them together.

**Law unchanged:** sha256 verification of every manifest file is **mandatory**; official delivery is **git clone at the manifest commit** (`git clone https://github.com/56eli/translatechan.git /tmp/tc-$COMMIT && git checkout $COMMIT`); gate stays unprivileged, disposable-clone, stdlib-only, read-only; Python minimum 3.11, tested set 3.11/3.12.

**Changed (files, not schema):**
- `export_manifest.json` — 25 files: 12 collated corpus documents (the previous 10 plus `data/corpus/wumenguan.json` and `data/corpus/linji_yulu.json`), the 6 shared data registries, `docs/sample_export.jsonl`, `docs/SCHEMA.md`, `docs/BOTRUNNER_REVIEW_2026-09-21_LAW.md`, and the four dated evidence registers (combined WUMENGUAN_LINJI authoritative + WUMENGUAN + LINJI single-re-key overlays + inherited ENTHUSIAST_100PCT); all sha256/size recomputed from the content commit named in `commit`; only_collated true, w1_filter collated_to_claimed_witness, remaining_docs 14, exported_to_wiki 12, purged_retellings 32
- `export_ready.json` — same timestamp+commit as manifest, written last

**Unchanged:** record schema and enums (schema_version stays 1.1 — export re-issue, not schema change); 1.1 rulings Q1-Q7 W3, only_collated, fail-closed badges, tombstones; the sample export (5 masters +6 passages, including the first section-type record `linji_yulu_section_078`) already covered both re-keys' schema shapes.

**Honest note:** no script generates export_manifest.json / export_ready.json — produced with sha256 computed from the content commit named in the manifest (verified: `jq -r '.files[] | "\(.sha256)  \(.path)"' export_manifest.json | sha256sum -c -` passes).


## Export re-issue — 2026-09-21 — after the Linji re-key (task P2.9) + law amendments — `schema_version` stays `1.1`

**Why:** the 1.1 manifest was written in the purge commit and pinned `commit: a77d577`, a pre-purge tree whose hashes no longer matched three files, and corpus has since gained re-keyed Record of Linji (107 sections, 215/215 EXACT, 0 flagged, T47n1985). The re-issue recomputes every hash from one tree and includes law amendments for official delivery.

**Law amendments 2026-09-21 (owner + botrunner agreement) — included in this re-issue:**
- (a) sha256 verification of every manifest file is **mandatory**, not optional — manifest nobody verifies proves nothing
- (b) gate executed **unprivileged in disposable clone** and must stay **stdlib-only and read-only** — adding dep/network is new decision
- (c) GATE.md states **minimum version 3.11 and tested set 3.11, 3.12** — system python3 br1 3.12.3 accepted no container, future 3.13 must be re-validated
- Official delivery: **git clone at manifest commit** is official — `git clone https://github.com/56eli/translatechan.git /tmp/tc-$COMMIT && git checkout $COMMIT` — no tarball, no container, read-only by charter

**Changed (files, not schema):**
- `export_manifest.json` — 21 files (was 22): 11 collated docs now include `data/corpus/linji_yulu.json`; all sha256/size recomputed from content commit; commit names that commit; only_collated true, w1_filter collated_to_claimed_witness, remaining_docs 13, exported_to_wiki 11, purged_retellings 32
- `export_ready.json` — same timestamp+commit as manifest, written last
- **Scope correction (declared):** 1.1 manifest listed 12 corpus files including 2 witness_unavailable seeds while claiming 10 exported; Q7 W3 says wiki receives ONLY 100% collated, so re-issue lists 11 collated only
- `docs/sample_export.jsonl` / `json` — 11 records (5 masters +6 passages): new `linji_yulu_section_078` first section-type unit
- `docs/GATE.md` — rewritten with official delivery + mandatory sha256 + execution env + Python min/tested (law)
- `docs/SCHEMA.md` — R6 and R12 updated with official delivery + mandatory sha256, sample export 5+6, work pattern includes linji_yulu
- `docs/BOTRUNNER_REVIEW_2026-09-21_LAW.md` — new law version 13 docs 11 collated incl. Linji, official delivery, mandatory sha256, unprivileged disposable stdlib-only, Python min/tested

**Unchanged:** record schema and enums (schema_version stays 1.1 — export re-issue not schema change); 1.1 rulings Q1-Q7 W3, only_collated, fail-closed badges, tombstones; gate command and read-only promise (now with law amendments).

**Honest note:** no script generates export_manifest.json / export_ready.json — produced manually with sha256 computed from content commit named in manifest.

## 1.1 — 2026-09-21 — Only 100% collated export, stable ids, manifest, tombstones — amended same day official delivery + mandatory sha256 + gate execution env (main 58964d8)

**Amendment 2026-09-21 (owner + botrunner agreement):**
- (a) sha256 verification of every manifest file is **mandatory**, not optional — manifest nobody verifies proves nothing
- (b) gate executed **unprivileged in disposable clone** and must stay **stdlib-only and read-only** — adding dependency or network access is new decision not impl detail
- (c) GATE.md states **minimum version 3.11 and tested set 3.11, 3.12** — system python3 on br1 is 3.12.3 accepted without container, future 3.13 must be re-validated and doc updated
- Official delivery: **git clone at manifest commit** is official — `git clone https://github.com/56eli/translatechan.git /tmp/tc-$COMMIT && git checkout $COMMIT` — no release tarball, no container, read-only by charter
- Docs updated: `docs/GATE.md` rewritten with official delivery + mandatory sha256 example + execution env + Python min/tested, `docs/SCHEMA.md` R6 and R12 updated, `docs/ANSWERS_FOR_BOTRUNNER_2026-09-21.md` Q7 updated, `docs/BOTRUNNER_REVIEW_2026-09-21_PURGED.md` gate section updated

## 1.1 — 2026-09-21 — Only 100% collated export, stable ids, manifest, tombstones (original)

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
