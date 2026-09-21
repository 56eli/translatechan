# Botrunner Review — TranslateChan Export v1.1 — 2026-09-21 — LAW

**From:** translatechan (Role 1) — corpus owner, integrity gates, content authority
**To:** botrunner (Role 2) — VPS ops advisory, import pipeline, presentation — via owner
**Base:** `pr-106` `cf53edd` / `main` `58964d8` + P2.8/P2.9 Wumenguan & Linji re-keys (combined overlay) — 14 docs, 12 collated 100% verified, 2 unavailable, 12 exported
**Charter:** ROLE_CHARTER_nonduality_wiki_2026-09-20.md — translatechan owns words/sources/verification, botrunner owns serving/hosting/presenting, owner holds secrets/merges
**Consumer requirements:** TC-EXPORT-CONSUMER-REQUIREMENTS.md R1-R12
**Law amendments 2026-09-21:** (a) sha256 verification mandatory not optional, (b) gate executed unprivileged in disposable clone stdlib-only read-only, adding dep/network is new decision, (c) Python minimum 3.11 tested set 3.11, 3.12 system python3 br1 3.12.3 accepted no container, future 3.13 must be re-validated

---

## 1. Current corpus — law

**14 docs — 12 collated_to_claimed_witness 100% real old texts +2 witness_unavailable neutral — 12 exported to wiki per Q7 W3:**

- `zhengdao_ge` — Yongjia Zhengdao Ge, excerpt_seed, T51n2014
- `congronglu` — Book of Serenity, 100 cases 500/500 EXACT, T48n2004
- `chuandenglu_full` — Transmission of the Lamp Complete 30 fascicles, 1,274 units 2,549 EXACT, T51n2076
- `caoshan_benji` — Record of Caoshan Benji, 84 units 169 EXACT, T47n1987A
- `huangbo_fayao_full` — Huangbo Transmission of Mind Complete, 19 units, T48n2012A
- `mazu_guanglu_full` — Mazu Recorded Sayings Complete, 35 units, X69n1321
- `yunmen_guanglu_full` — Yunmen Expanded Record Complete, 776 units, T47n1988
- `dongshan_yulu_full` — Dongshan Yulu Complete, 322 units, T47n1986A+B
- `zhaozhou_yulu_full` — Zhaozhou Yulu Complete, 80 units, X68n1315 juan 13-14
- `dahui_yulu_full` — Dahui Yulu Complete, 1,354 units, T47n1998A+B
- `linji_yulu` — Record of Linji (臨濟語錄), 107 sections 215/215 EXACT 0 flagged, T47n1985 — re-keyed from scratch P2.9, tiling 16,366 CJK, asserts concatenation equals digest-verified reference extraction char for char, no run omitted/duplicated/invented
- Total for 7 full-witness docs incl. Linji: 2,693 units ~318,958 CJK 5,393 EXACT (previous 6 enthusiast fulls 2,586 units 302,592 CJK 5,178 EXACT + Linji 107 units 16,366 CJK 215 EXACT)

- `hanshan_poems` — Hanshan Cold Mountain Poems, witness_unavailable neutral, SBCK/Zoku — no witness in pinned set
- `niutou_juezhu` — Niutou Farong Juezhu Lun, witness_unavailable neutral, P.2885

**Wiki receives ONLY 100% collated per owner ruling Q7 W3 — no imperfections on wiki.** Export manifest lists 12 collated docs (scope correction kept from the previous re-issue: manifests list only 100% collated documents, never the 2 witness_unavailable excerpt seeds, per Q7 W3), botrunner defense-in-depth fails if it ever sees partial_or_failed.

**Metrics (law):**
- corpus=13 | slots=46 | verified=1 | matrix=21 | locators=4044/4044 case-level + 107 section locators Linji lb-anchored
- W1: collated=12 | partial/failed=0 | unavailable=2 | flagged=15 | evidence 2026-09-21 → sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json (14 docs 15 flagged, refs_manifest 19 works = previous 17 + T48n2005 + T47n1985, both digests byte-identical to the historical anchor, no waiver)
- CJK: ~767,450 content / 824,896 all-string (was 751,084/806,651 before Linji)
- Provenance notes: 21+ total, 11+ rendered, cbeta_note 11+
- Bundle: 7,440,122 B deterministic root/docs mirror diff clean (was 7,230,634 B before Linji)
- Lineage: 31 edges =20 exact_locator_verified +11 source_verified =31/31 verified 0 pending, masters 35, linji_yixuan linked_corpus_keys ["linji_yulu"] restored, school vocab 12 groups

---

## 2. Q1-Q7 answered — plain language + law amendments

**Q1 work=Book fascicle=Chapter passage=Page — CONFIRMED:** work JSON = Book, fascicle inside work = Chapter, smallest unit case/section/dialogue/stanza = Page. Example `chuandenglu_full` fascicle 6 → Chapter, case 128 Baizhang → Page, `linji_yulu` section 78 → Page. Stable ids `congronglu_case_001`, `chuandenglu_full_case_0128`, `zhengdao_ge_stanza_01`, `linji_yulu_section_078` + type + parent_id + order integer (R2,R8).

**Q2 claimed witness + W1 codes:**

- **Claimed witness = specific old woodblock we claim we copied from.** Example `congronglu` claims `T48n2004`, `chuandenglu_full` claims `T51n2076`, `linji_yulu` claims `T47n1985` 鎮州臨濟慧照禪師語錄. Published as `source_id`, `source_edition`, `witness_path: T47n1985.xml`, `extraction_rule: cbeta-p5-body-cjk-v1`, `witness_revision: dbdea410`.

- **Collation = proving claim** — normalize field CJK by rule `cbeta-p5-body-cjk-v1` (TEI body only, drop notes/g, keep only CJK U+3400-U+9FFF/U+F900-U+FAFF, NFC), search contiguous runs ≥8 chars in claimed witness body. EXACT = verbatim run found. Linji tiling asserts concatenation equals reference extraction char for char, so no run omitted/duplicated/invented.

- **W1 codes closed enum from `scripts/source_review.py`:**
  - `collated_to_claimed_witness` — Label "Collated to claimed witness" — every content field EXACT/REWORDED in claimed witness, metadata title_zh/name_zh excluded, never approves reuse. 100% collation. 11 docs.
  - `partial_or_failed_w1_collation` — Label "Partial or failed W1 collation" — claimed witness present but at least one field NOT collated. **Not present in current corpus (0), export filtered, importer must fail if seen.**
  - `witness_unavailable` — Label "Witness unavailable — not collated" — no witness text in pinned set. Neutral. 2 docs.

- Completion: `complete_selected_witness` (only allowed when W1 collated), `partial_selected_witness`, `excerpt_seed` — Linji ships as `partial_selected_witness` / `collated_to_claimed_witness`, not complete (行錄 provenance human work).
- Collation classes: EXACT, REWORDED (collated), MINOR, DIVERGENT, NOT_FOUND, TITLE_COMPOSITE, SHORT_UNMATCHED, WITNESS_UNAVAILABLE, EMPTY
- Lineage: `exact_locator_verified` (lb range T47n1985_p0504a26–p0504a29 + verbatim), `source_verified`, `traditional_link_pending_exact_locator`, `disputed`
- 5 disclosure ledgers separate: source_collation, represented_units, translation_edition_verification, canonical_locator, rights_review — "Separate ledgers: none implies another."
- Badge must show machine code+label+explanation verbatim, fail-closed, unknown code → fail loudly.

**Q3 tombstones — CONFIRMED:** lifecycle_status `active`, `withdrawn`, `superseded`, `retracted_pending_review` + `superseded_by` id. Entity stays with status, not vanish. Absence alone never means deletion — botrunner reports warnings. Manifest checksums prove complete export not half-written. **Mandatory sha256 verification (amendment a) is what makes tombstone distinction possible — a manifest nobody verifies proves nothing.**

**Q5 rights — Consideration only, not decided:** If maintenance low, want copyrighted flagged, leave access to owner, might make everything private with wiki account. Proposal as consideration: every page gets `rights_status` in_copyright/public_domain_candidate/needs_review + `is_ai_styled` boolean + visibility suggestion. Since only 12 collated old texts (public domain) + our AI-styled English (ours) are exported, likely all public, but flags emitted for future audit. Botrunner reads flags, dry-run diff.

**Q6 append-mostly + revisions — AFFIRMED:** Both — added 7 full-witness docs append (6 enthusiast fulls + Linji) + revised labels (465 permitted /0 unauthorized vs base 3cc7a8e). Importer idempotent keyed by stable R1 id, never duplicates, title change keeps id.

**Q7 recommendations — LOCKED Q7 W3 wiki only 100% collated, no imperfections — LAW:**

1. Export manifest + sample: `export_manifest.json` schema_version 1.1, timestamp ISO8601, commit, files sha256 size, only_collated true, ready marker `export_ready.json` atomic (R12). **Official delivery (law): git clone at commit pinned in manifest** — `git clone https://github.com/56eli/translatechan.git /tmp/tc-$COMMIT && git checkout $COMMIT`. **sha256 verification mandatory not optional** — `jq -r '.files[] | "\(.sha256)  \(.path)"' export_manifest.json | sha256sum -c -`. Sample JSONL 5 masters +6 passages (Linji adds first section-type record `linji_yulu_section_078`) with all R1-R12 fields.
2. Schema docs: SCHEMA.md, BODY_FORMAT.md, GATE.md, CHANGELOG.md with all enums, mapping rule, BODY_FORMAT plain_cjk_markdown_subset_v1 no arbitrary HTML NFC, GATE `python3 scripts/validate_data.py` exit 0 safe read-only **executed unprivileged in disposable clone, must stay stdlib-only read-only — adding dep/network is new decision**, Python minimum 3.11 tested set 3.11, 3.12 system python3 br1 3.12.3 accepted no container future 3.13 must be re-validated.
3. W1 filtering: export contains ONLY collated_to_claimed_witness (11 docs), importer fails if sees partial.
4. Rights flags as consideration.
5. Tombstones.
6. Idempotency edge id `{teacher}_{disciple}`, passage id `congronglu_case_001`, `linji_yulu_section_078`, type parent_id order.
7. Gate as precondition — mandatory sha256 + ready marker + gate.
8. Sample worth more than spec.

---

## 3. Schema v1.1 — R1-R12 — law

See `docs/SCHEMA.md` full.

- R1 id stable immutable never reused, tombstoned — `linji_yulu`, `linji_yulu_section_078`
- R2 type + parent_id + order, work=Book fascicle=Chapter passage=Page
- R3 W1 code+label closed enum fail-closed — collated=11 partial=0 unavailable=2
- R4 provenance source_key + is_ai_styled boolean explicit, absent=refuse import — Linji provenance `source_key linji-yulu, source_edition T47n1985, witness_path T47n1985.xml, extraction_rule cbeta-p5-body-cjk-v1, witness_revision dbdea410, is_ai_styled false, import_reference commit+timestamp+evidence_register_path`
- R5 schema_version + CHANGELOG.md — 1.1 stays, export re-issue after Linji documented as files not schema change
- R6 gate executable read-only exit 0 safe, **unprivileged disposable clone, stdlib-only read-only, mandatory sha256, Python min 3.11 tested 3.11, 3.12, no container, future 3.13 re-validated** — law amendments (b)(c)
- R7 tombstones lifecycle_status
- R8 order integer explicit — Linji 107 sections order 1..107
- R9 BODY_FORMAT.md conservative no arbitrary HTML NFC — Linji body plain CJK
- R10 cross-refs by id not title/URL — linji_yixuan linked_corpus_keys ["linji_yulu"]
- R11 lang/script per unit `zh-Hant`, `zh-Latn` pinyin, `en`
- R12 manifest checksums+timestamp+commit+atomic ready marker, JSONL preferred, **official delivery git clone at manifest commit, mandatory sha256 verification (amendment a)** — law

---

## 4. Gate — law — official delivery, mandatory sha256, unprivileged stdlib-only, Python min/tested

**Official delivery (owner decision 2026-09-21, law):** git clone at commit pinned in `export_manifest.json` — `git clone https://github.com/56eli/translatechan.git /tmp/tc-$COMMIT && git checkout $COMMIT`. No release tarball, no artifact hosting. Botrunner read-only by charter, clone is read-only, no credentials. System `python3` on br1 is 3.12.3 accepted without container.

**Exact command:**
```bash
python3 scripts/validate_data.py
```
Exit 0 safe, non-zero do not publish, read-only unless --write-metrics, must stay stdlib-only — jsonschema optional but gate must pass without it.

**Execution environment — unprivileged, disposable, stdlib-only, read-only (amendment b):**
- Gate executed unprivileged in disposable clone `/tmp/tc-$COMMIT`, not in live wiki tree, not as root, not with BookStack credentials.
- Gate must stay stdlib-only and read-only on normal run. No pip install, no network, no filesystem writes outside clone, no BookStack API calls.
- Adding dependency, network, or wiki write is new owner decision, not impl detail. Must be proposed in SCHEMA+CHANGELOG+GATE and approved.

**Python version — minimum and tested set (amendment c):**
- Minimum: 3.11
- Tested set: 3.11, 3.12 — CI quality.yml runs 3.12, br1 system python3 3.12.3 accepted without container.
- Future 3.13+: must be re-validated once (python3 --version + validate_data.py + build_data_bundle.py determinism) and doc updated. No container unless owner decides.

**Mandatory integrity checks — sha256 verification mandatory not optional (amendment a):**
A manifest nobody verifies proves nothing. Botrunner must:
1. Verify export_ready.json exists and timestamp+commit matches export_manifest.json — if missing/mismatched, incomplete, do not import.
2. Verify every file in files[] by sha256 and size — fail-closed if any mismatch.
3. Only then run validate_data.py.

Example:
```bash
COMMIT=$(jq -r .commit export_manifest.json)
TIMESTAMP=$(jq -r .export_timestamp export_manifest.json)
jq -e --arg c "$COMMIT" --arg t "$TIMESTAMP" '.commit==$c and .export_timestamp==$t and .ready==true' export_ready.json
jq -r '.files[] | "\(.sha256)  \(.path)"' export_manifest.json | sha256sum -c -
python3 scripts/validate_data.py
```

**What gate checks:**
- Source JSON parses and manifests agree
- Required identity metadata and known content shapes present
- Translation/provenance records structurally valid
- Canonical locator registry covers every document and every case-based unit (4044 cases + 107 Linji sections lb-anchored)
- Manifest W1 evidence metadata and per-document source-review statuses explicit
- complete_selected_witness compatible only with collated_to_claimed_witness
- Generated project_metrics.json matches live data
- Live prose docs quote same deterministic numbers — doc truthfulness gate
- Lineage verification edges valid, 5 disclosure ledgers separate

**Secondary gates:**
```bash
python3 scripts/build_data_bundle.py
# Determinism check: two consecutive builds byte-identical, root/docs mirror diff clean
# Output: 7,440,122 B deterministic (with Linji)

node scripts/smoke_test.mjs
# Reader smoke
```

See `docs/GATE.md` law.

---

## 5. Sample export — law

`docs/sample_export.jsonl` 11 records: 5 masters +6 passages (5 previous + Linji section-type `linji_yulu_section_078`) with all fields: id, type, parent_id, order, lifecycle_status, w1_status {code,label,explanation}, provenance {source_key, source_edition, cbeta_id, witness_path, extraction_rule, witness_revision, is_ai_styled, import_reference {commit,timestamp,evidence_register_path}}, texts [{lang,script,transliteration_scheme,body,is_ai_styled}], body_format, rights_status, visibility, canonical_locator, cross_refs by id.

Example passage:
```json
{"id":"congronglu_case_001","type":"case","parent_id":"congronglu","order":1,"lifecycle_status":"active","w1_status":{"code":"collated_to_claimed_witness","label":"Collated to claimed witness"},"provenance":{"source_key":"congronglu","source_edition":"T48n2004","is_ai_styled":false,"import_reference":{"commit":"4ff62a7","timestamp":"2026-09-21T16:45:26Z"}},"texts":[{"lang":"zh-Hant","script":"Hant","body":"...","is_ai_styled":false}],"body_format":"plain_cjk_markdown_subset_v1"}
```
Example Linji section:
```json
{"id":"linji_yulu_section_078","type":"section","parent_id":"linji_yulu","order":78,"w1_status":{"code":"collated_to_claimed_witness"},"provenance":{"source_key":"linji-yulu","source_edition":"T47n1985","witness_path":"T47n1985.xml","extraction_rule":"cbeta-p5-body-cjk-v1","witness_revision":"dbdea410"},"canonical_locator":"T47n1985_p0504a26–p0504a29"}
```

---

## 6. What botrunner should do — law — mandatory sha256, unprivileged disposable clone

1. Read `export_manifest.json` — get `commit`, `export_timestamp`, `files[]` sha256 — official delivery is git clone at manifest commit
2. `git clone https://github.com/56eli/translatechan.git /tmp/tc-$COMMIT && cd /tmp/tc-$COMMIT && git checkout $COMMIT` — disposable, unprivileged, no credentials
3. Verify `export_ready.json` exists and timestamp+commit matches manifest — **mandatory** not optional — if missing/mismatched, abort
4. Verify sha256+size of every file in manifest via `sha256sum -c -` — **mandatory** not optional — a manifest nobody verifies proves nothing — if any mismatch, abort
5. Run gate `python3 scripts/validate_data.py` — unprivileged, stdlib-only, read-only, no network, no container (system python3 3.12.3 accepted, minimum 3.11 tested set 3.11+3.12 future 3.13 must be re-validated) — capture output, abort if non-zero
6. Filter `only_collated=true` — export already filtered to 12 collated, defense-in-depth fail if sees partial_or_failed or witness_unavailable
7. Map work=Book, fascicle=Chapter, passage=Page by id+parent_id+order, idempotent keyed by stable id, never duplicates, title change keeps id
8. Render W1 badge verbatim code+label+explanation, link to evidence register, 5 ledgers separate — Linji badge "collated_to_claimed_witness — 107/107 content fields EXACT in T47n1985, 0 flagged, evidence sessions/COLLATION_REGISTER_2026-09-21_LINJI.json"
9. Emit provenance source_key + is_ai_styled boolean + import_reference on every page
10. Rights flags as metadata, dry-run diff public vs private, owner decides
11. Tombstones: never delete on absence alone, report warnings
12. Body format plain_cjk_markdown_subset_v1, no arbitrary HTML, no absolute wiki URLs, NFC

---

## 7. PR 106 — Linji Yulu re-key — included in law

- PR https://github.com/56eli/translatechan/pull/106 — branch `arena/01a0c4aa-translatechan` — 107 sections tiling whole 16,366-CJK T47n1985 fascicle, 215 measured fields 215 EXACT 0 flagged, `collated_to_claimed_witness`
- Witness: CBETA XML P5 `dbdea41071e1e260ad84b72faefd4587333cf76d` work T47n1985, rule `cbeta-p5-body-cjk-v1`, reference `ref_T47n1985.txt` 16,366 CJK sha256 `4317e5fa14996b3f...9aeb8359`, document `data/corpus/linji_yulu.json` sha256 `d1004987b6e9c886...c70eb419`
- Segmentation: `scripts/segment_linji_yulu.py` follows `segment_full_witness.py` pattern, asserts concatenation equals digest-verified reference extraction char for char
- Evidence: `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json` (14 docs 15 flagged) + `sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt` 19-work manifest = previous 17 + T48n2005 + T47n1985, both digests byte-identical to the historical anchor, no waiver
- Export re-issue: 25 files, all hashes recomputed from one commit, only_collated true, 12 collated incl. wumenguan + linji_yulu, sample keeps its first section-type record (linji_yulu_section_078)
- Gates: validate_data PASS corpus=13 slots=46 verified=1 matrix=21 locators=4044/4044, build deterministic 7,440,122 B
- Honest reds: test_source_preservation, test_source_review_rules, smoke_test still pin pre-purge 44-doc world — already red on f1207ea, scoped in STUB_P2.10_GATE_SUITE_REPIN.md, not caused by Linji branch

---

*Botrunner lane advisory only — owner applies everything. Translatechan owns corpus, integrity gates, content authority, stable exports; does NOT run/configure VPS, does NOT write to BookStack directly, does NOT build websites/themes/layouts/Discord features, does NOT make public framing decisions, does NOT dispatch importer or touch Chan bot code. Law version includes official delivery git clone at manifest commit, mandatory sha256 verification, gate unprivileged disposable stdlib-only read-only, Python min 3.11 tested 3.11+3.12, no container, future 3.13 re-validated.*
