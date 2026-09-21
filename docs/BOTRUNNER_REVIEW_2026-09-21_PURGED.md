# Botrunner Review — TranslateChan Export v1.1 Purged — 2026-09-21

**From:** translatechan (Role 1) — corpus owner, integrity gates, content authority
**To:** botrunner (Role 2) — VPS ops advisory, import pipeline, presentation — via owner
**Base:** main `a6972c1` — PURGED retellings removed
**Charter:** ROLE_CHARTER_nonduality_wiki_2026-09-20.md — translatechan owns words/sources/verification, botrunner owns serving/hosting/presenting, owner holds secrets/merges
**Consumer requirements:** TC-EXPORT-CONSUMER-REQUIREMENTS.md R1-R12

---

## 1. What changed — purge

**Purged 32 retellings filler** — quick coverage from 2026-08 before collation harness, 0/6 EXACT in 43 pinned refs (dbdea410), coverage_note per-field runs e.g. `s1.d0 24/34 @60,222`, editorial_note "Project retelling — no witness attribution". These were made-up stories without source.

Deleted: `wumenguan`, `linji_yulu`, `huangbo_chuanxin`, `zhaozhou_yulu`, `xinxin_ming`, `baojing_sanmei`, `biyanlu_cases`, `platform_sutra`, `chuandenglu`, `qinggui_monastic_codes`, `dongshan_yulu`, `yunmen_yulu`, `fayan_yulu`, `guiyang_yulu`, `dahui_hongzhi`, `shitou_sandokai`, `bodhidharma_erru`, `lidai_fabao_ji`, `dazhu_huihai`, `baizhang_guanglu`, `foyan_qingyuan`, `dahui_shobogenzo`, `mazu_yulu`, `nanquan_yulu`, `deshan_yulu`, `xuefeng_yantou`, `wudeng_huiyuan`, `sengzhao_zhaolun`, `huangbo_wanling`, `xuansha_yulu`, `caoxi_zhuan`, `yuanwu_letters`

**Remaining 12 docs:**
- 10 `collated_to_claimed_witness` 100% real old texts: `zhengdao_ge`, `congronglu` 100 cases 500/500 EXACT, `chuandenglu_full` 1,274 units 2,549 EXACT, `caoshan_benji` 84 units 169 EXACT, `huangbo_fayao_full` 19, `mazu_guanglu_full` 35, `yunmen_guanglu_full` 776, `dongshan_yulu_full` 322, `zhaozhou_yulu_full` 80, `dahui_yulu_full` 1,354 =2,586 units 302,592 CJK 5,178 EXACT 93.8% collation (plus 4 earlier)
- 2 `witness_unavailable` neutral: `hanshan_poems`, `niutou_juezhu` — no witness in pinned set, not checked

**Wiki receives ONLY 100% collated per owner ruling Q7 W3 — no imperfections.** Export manifest lists 10 collated docs, botrunner defense-in-depth fails if it ever sees partial.

**Metrics after purge:**
- corpus=12 | slots=46 | verified=1 | matrix=21 | locators=4044/4044
- W1: collated=10 | partial/failed=0 | unavailable=2 | flagged=15 | evidence 2026-09-21 → sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json (now 12 docs 15 flagged, refs_manifest 17 works)
- CJK: 751,084 content / 806,651 all-string (was 855,603/919,112)
- Provenance notes: 21 total, 11 rendered, 11 docs, cbeta_note 11 (was 184/142/37/30)
- Bundle: 7,230,634 B deterministic root/docs mirror diff clean

---

## 2. Q1-Q8 answered — plain language

**Q1 work=Book fascicle=Chapter passage=Page — CONFIRMED:** work JSON = Book, fascicle inside work = Chapter, smallest unit case/section/dialogue/stanza = Page. Example `chuandenglu_full` fascicle 6 → Chapter, case 128 Baizhang → Page. Stable ids `wumenguan_case_01`, `congronglu_case_001`, `chuandenglu_full_case_0128` + type + parent_id + order integer (R2,R8).

**Q2 claimed witness + W1 codes:**

- **Claimed witness = specific old woodblock we claim we copied from.** Example `wumenguan` claims `T48n2005` Song woodblock, `chuandenglu_full` claims `T51n2076` Jingde Chuandenglu 1004, 30 fascicles. Published as `source_id`, `source_edition`, `witness_path: T51n2076.xml`, `extraction_rule: cbeta-p5-body-cjk-v1`, `witness_revision: dbdea410`.

- **Collation = proving claim** — normalize field CJK by rule `cbeta-p5-body-cjk-v1` (TEI body only, drop notes/g, keep only CJK U+3400-U+9FFF/U+F900-U+FAFF, NFC), search contiguous runs ≥8 chars in claimed witness body. EXACT = verbatim run found.

- **W1 codes closed enum from `scripts/source_review.py`:**
  - `collated_to_claimed_witness` — Label "Collated to claimed witness" — every content field zh/verse_zh/commentary_zh/pointer_zh EXACT/REWORDED in claimed witness, metadata title_zh/name_zh excluded, never approves reuse. 100% collation.
  - `partial_or_failed_w1_collation` — Label "Partial or failed W1 collation" — claimed witness present but at least one field NOT collated (0/6 EXACT). Project retelling — no witness attribution. **PURGED from repo.**
  - `witness_unavailable` — Label "Witness unavailable — not collated" — no witness text in pinned set.

- Completion: `complete_selected_witness` (only allowed when W1 collated, enforced), `partial_selected_witness`, `excerpt_seed`
- Collation classes: EXACT, REWORDED (collated), MINOR, DIVERGENT, NOT_FOUND, TITLE_COMPOSITE, SHORT_UNMATCHED, WITNESS_UNAVAILABLE, EMPTY
- Lineage: `exact_locator_verified` (lb range T51n2076_pXXXX–pYYYY + verbatim), `source_verified`, `traditional_link_pending_exact_locator`, `disputed`
- 5 disclosure ledgers separate: source_collation, represented_units, translation_edition_verification, canonical_locator, rights_review — "Separate ledgers: none implies another."
- Badge must show machine code+label+explanation verbatim, fail-closed, unknown code → fail loudly.

**Q3 tombstones — CONFIRMED:** lifecycle_status `active`, `withdrawn`, `superseded`, `retracted_pending_review` + `superseded_by` id. Entity stays with status, not vanish. Absence alone never means deletion — botrunner reports warnings. Manifest checksums prove complete export.

**Q5 rights — Consideration only, not decided:** If maintenance low, want copyrighted flagged, leave access to owner, might make everything private with wiki account. Proposal as consideration: every page gets `rights_status` in_copyright/public_domain_candidate/needs_review + `is_ai_styled` boolean + visibility suggestion. Since only 10 collated old texts (public domain) + our AI-styled English (ours) are exported, likely all public, but flags emitted for future audit. Botrunner reads flags, dry-run diff.

**Q6 append-mostly + revisions — AFFIRMED:** Both — added 6 full-witness docs append + revised 6 Tier2 labels (465 permitted /0 unauthorized vs base 3cc7a8e). Importer idempotent keyed by stable R1 id, never duplicates.

**Q7 recommendations — LOCKED Q7 W3 wiki only 100% collated, no imperfections:**

1. Export manifest + sample: `export_manifest.json` schema_version 1.1, timestamp ISO8601, commit, files sha256 size, only_collated true, purged true, ready marker `export_ready.json` atomic (R12). Sample JSONL 5 masters +5 passages with all R1-R12 fields.
2. Schema docs: SCHEMA.md, BODY_FORMAT.md, GATE.md, CHANGELOG.md with all enums, mapping rule, BODY_FORMAT plain_cjk_markdown_subset_v1 no arbitrary HTML NFC, GATE `python3 scripts/validate_data.py` exit 0 safe read-only.
3. W1 filtering: export contains ONLY collated_to_claimed_witness, importer fails if sees partial.
4. Rights flags as consideration.
5. Tombstones.
6. Idempotency edge id `{teacher}_{disciple}`, passage id `wumenguan_case_01`, type parent_id order.
7. Gate as precondition.
8. Sample worth more than spec.

**Q8 retellings worse than unavailable:**

- Unavailable neutral, retelling actively fails — we have witness and text NOT in it, made-up story without source, from early 2026-08 filler before harness.
- Purged from repo, not just flagged. Git history keeps evidence, main now clean.

---

## 3. Schema v1.1 — R1-R12

See `docs/SCHEMA.md` full.

- R1 id stable immutable never reused, tombstoned
- R2 type + parent_id + order, work=Book fascicle=Chapter passage=Page
- R3 W1 code+label closed enum fail-closed
- R4 provenance source_key + is_ai_styled boolean explicit, absent=refuse import
- R5 schema_version + CHANGELOG.md
- R6 gate executable read-only exit 0 safe
- R7 tombstones lifecycle_status
- R8 order integer explicit
- R9 BODY_FORMAT.md conservative no arbitrary HTML NFC
- R10 cross-refs by id not title/URL
- R11 lang/script per unit `zh-Hant`, `zh-Latn` pinyin, `en`
- R12 manifest checksums+timestamp+commit+atomic ready marker, JSONL preferred

---

## 4. Gate

`python3 scripts/validate_data.py` — exit 0 safe, non-zero do not publish, read-only unless --write-metrics, needs checkout + Python 3.11, no extra deps. Secondary `build_data_bundle.py` determinism, `smoke_test.mjs`. See `docs/GATE.md`.

---

## 5. Sample export

`docs/sample_export.jsonl` 10 records: 5 masters +5 passages from collated docs with all fields: id, type, parent_id, order, lifecycle_status, w1_status {code,label,explanation}, provenance {source_key, source_edition, cbeta_id, witness_path, extraction_rule, witness_revision, is_ai_styled, import_reference {commit,timestamp,evidence_register_path}}, texts [{lang,script,transliteration_scheme,body,is_ai_styled}], body_format, rights_status, visibility, canonical_locator, cross_refs by id.

Example passage:
```json
{"id":"congronglu_case_001","type":"case","parent_id":"congronglu","order":1,"lifecycle_status":"active","w1_status":{"code":"collated_to_claimed_witness","label":"Collated to claimed witness"},"provenance":{"source_key":"congronglu","source_edition":"T48n2004","is_ai_styled":false,"import_reference":{"commit":"a6972c1","timestamp":"2026-09-21T15:27:00Z"}},"texts":[{"lang":"zh-Hant","script":"Hant","body":"...","is_ai_styled":false}],"body_format":"plain_cjk_markdown_subset_v1"}
```

---

## 6. What botrunner should do

1. Checkout at commit from export_manifest.json
2. Run gate `python3 scripts/validate_data.py` — capture output, abort if non-zero
3. Verify `export_ready.json` exists and timestamp+commit matches manifest, verify file sha256
4. Filter `only_collated=true` — export already filtered to 10 collated, defense-in-depth fail if sees partial_or_failed
5. Map work=Book, fascicle=Chapter, passage=Page by id+parent_id+order, idempotent keyed by stable id, never duplicates, title change keeps id
6. Render W1 badge verbatim code+label+explanation, link to evidence register, 5 ledgers separate
7. Emit provenance source_key + is_ai_styled boolean + import_reference on every page
8. Rights flags as metadata, dry-run diff public vs private, owner decides
9. Tombstones: never delete on absence alone, report warnings
10. Body format plain_cjk_markdown_subset_v1, no arbitrary HTML, no absolute wiki URLs, NFC

---

## 7. Most pressing corpus work — 2 new stubs

After purge, 33 masters have empty `linked_corpus_keys` — dossier shows "Project corpus link not yet curated". Most pressing is to re-key famous works properly from CBETA verbatim, replacing purged retellings with real 100% collated texts, like we did for 6 enthusiast fulls.

**Stub 1: Wumenguan proper re-key (P2.8)**
**Stub 2: Linji Yulu proper re-key (P2.9)**

See `docs/STUB_P2.8_WUMENGUAN_REKEY.md` and `docs/STUB_P2.9_LINJI_REKEY.md`.

*Botrunner lane advisory only — owner applies everything. Translatechan owns corpus, integrity gates, content authority, stable exports; does NOT run/configure VPS, does NOT write to BookStack directly, does NOT build websites/themes, does NOT make public framing decisions, does NOT dispatch importer or touch Chan bot code.*
