# Stub P2.9 — Linji Yulu proper re-key — most pressing

> **STATUS — COMPLETED 2026-09-21:** the Linji re-key shipped in the combined Wumenguan + Linji overlay — 107 sections tiling the whole 16,366-CJK T47n1985 witness, 215/215 fields EXACT, 0 flagged, `data/corpus/linji_yulu.json` restored, `masters.json` link repaired, 107 `lb`-anchored section locators, queue record #4, evidence at `sessions/COLLATION_REGISTER_2026-09-21_LINJI.json` and the combined `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json`. The rest of this document is the planning record as written.

**Priority:** High — Record of Linji is foundational for Linji school, previously purged as retelling (0/6 EXACT), now missing, masters.json linji_yixuan has empty linked_corpus_keys, lineage edges depend on it.

**Goal:** Re-key `linji_yulu` from claimed witness `T47n1985` Linji Lu, CBETA XML P5 revision `dbdea410`, extraction rule `cbeta-p5-body-cjk-v1`, ~60 sections? Actually T47n1985 has ~60 encounters, 100% collated_to_claimed_witness, 0 flagged.

**Current state after purge:**
- `data/corpus/linji_yulu.json` deleted (was partial_or_failed)
- `data/corpus_manifest.json` 12 docs, no linji_yulu
- `data/project_metrics.json` 12 docs, no linji_yulu
- `data/lineage/masters.json` linji_yixuan linked_corpus_keys [] empty
- `data/canonical_locators.json` no linji_yulu
- `sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json` 12 docs, no linji_yulu

**What to do — translatechan lane only:**

1. Extract witness `T47n1985` via `scripts/collate_refs.py` rule `cbeta-p5-body-cjk-v1` — digest-verified, currently not in refs_manifest (need to add if missing — check sessions/COLLATION_W1_2026-09-21_ENTHUSIAST_100PCT_refs_manifest.txt has 17 works, T47n1985 not in union after purge, need to add).

2. Segment into sections/dialogues via `scripts/segment_classical.py` — each section: title_zh, dialogue array, locator {source_id: linji-yulu, reference: T47n1985_pXXXX, lb_range}

3. Ensure every content field EXACT in T47n1985 — collator should measure ~60 sections * ~3 fields = ~180 fields EXACT, 0 flagged.

4. Add `coverage_note`: "All XX units verbatim and contiguous in claimed witness T47n1985..."

5. Add `cbeta_note`: witness info, recension notes

6. Add to `data/corpus_manifest.json`: key linji_yulu, title "Record of Linji (臨濟語錄)", cbeta T1985, unit_targets sections ~60, completion_status partial_selected_witness or complete_selected_witness (allowed when collated), source_review_status collated_to_claimed_witness

7. Update `data/lineage/masters.json` linji_yixuan linked_corpus_keys ["linji_yulu"]

8. Update `data/canonical_locators.json` with document + section locators

9. Record evidence: `sessions/COLLATION_REGISTER_2026-09-21_LINJI.json` or add to authoritative register, witness_note "Task P2.9: Linji Yulu T47n1985 XX units tiling XXXX CJK verbatim"

10. Run gates: `validate_data.py --write-metrics --skip-docs` then full PASS, `build_data_bundle.py` deterministic

11. Update doc truthfulness numbers (corpus 13→14 docs after both stubs, CJK counts, provenance notes, etc.)

12. Commit, push, PR

**Acceptance:**
- `linji_yulu.json` exists, ~60 sections, every content field EXACT in T47n1985, 0 flagged, W1 collated_to_claimed_witness
- `validate_data.py` PASS, bundle deterministic
- Export includes linji_yulu, wiki can show as Book

**Why this is most pressing after Wumenguan:**
- Wumenguan is most famous koan collection, Linji is most famous yulu, both were filler retellings purged, both have clear CBETA witnesses T48n2005 and T47n1985 that can be re-keyed verbatim from scratch like 6 enthusiast fulls, restoring lineage links for 33 masters currently empty.

**Owner ruling:** Wiki receives ONLY 100% collated — this re-key qualifies, no imperfections.

**Note:** If T47n1985 not in current digest manifest, need to add reference extraction for it — follow pattern of `scripts/segment_full_witness.py` which asserts concatenation equals reference extraction char for char, so no run omitted/duplicated/invented.

---

## Delivered 2026-09-21 (session `arena/01a0c4aa-translatechan`)

Every numbered item above is done; the numbers differ from the stub's guesses because they were
measured, not assumed:

- **Witness:** T47n1985 (鎮州臨濟慧照禪師語錄, T47 no. 1985) from the pinned CBETA XML P5 revision
  `dbdea41071e1e260ad84b72faefd4587333cf76d`; body extraction digest
  `4317e5fa14996b3f414187adb4264f1d52efb303392402f797d6e2019aeb8359`, 16,366 CJK characters —
  byte-identical to the digest the historical 2026-09-09 refs manifest already carried for the
  same work, so no `new_documents` waiver is used. The authoritative refs manifest is the
  previous 17 works **+ T47n1985 = 18 works** (`sessions/COLLATION_W1_2026-09-21_LINJI_refs_manifest.txt`).
- **Segmentation:** 107 sections (not ~60 encounters: the record's whole fascicle tiles into
  107 contiguous units — prefaces, juan opening, main record, 勘辨, 行錄, close, colophon),
  produced by `scripts/segment_linji_yulu.py` with run-time tiling assertions (concatenation ==
  reference extraction, char for char; nothing omitted, duplicated or invented).
- **Collation:** `scripts/collate_corpus.py --doc linji_yulu` → **215/215 measured fields EXACT,
  0 flagged**; the document carries 107 sections / 16,366 CJK /
  `T47n1985_p0495a01–p0506c28`; sha256 `d1004987b6e9c886b58a6a6ea13a3f692c4037db424116d54cee7d15c70eb419`,
  byte-for-byte reproducible.
- **Manifest / lineage / locators / evidence:** `linji_yulu` is the 13th manifest item
  (`sections: 107`, `partial_selected_witness`, `collated_to_claimed_witness` — a complete
  witness is **not** claimed: the 行錄 division's provenance is still being reviewed);
  `masters.json` `linji_yixuan.linked_corpus_keys = ["linji_yulu"]`; 107 section locators in
  `data/canonical_locators.json`; evidence overlay `sessions/COLLATION_W1_2026-09-21_LINJI.md` +
  register `sessions/COLLATION_REGISTER_2026-09-21_LINJI.json` (13 documents, 15 flagged fields).
- **Gates:** `py_compile` OK · `validate_data.py --write-metrics --skip-docs` then full run
  **PASS** · `build_data_bundle.py` deterministic (two runs byte-identical) ·
  `diff -rq data docs/data` identical. The three pinned suites
  (`test_source_preservation.py`, `test_source_review_rules.py`, `smoke_test.mjs`) are red —
  **pre-existing on `f1207ea`** against the 13-document corpus, and repaired under
  [`STUB_P2.10_GATE_SUITE_REPIN.md`](./STUB_P2.10_GATE_SUITE_REPIN.md). P2.9 repins only the
  smoke suite's W1-evidence pointers and count pins (its own outputs), and the Linji-specific
  pins the suite already carried are satisfied by the new bundle (four-shouts section
  disclosure, `collated_with_normalization`, `赤肉團` search hit).
- **Export:** `export_manifest.json` was purged-era (commit `a77d577…`) and cannot be
  regenerated in-repo (no generator is committed); the P2.9 handoff records that
  `data/corpus/linji_yulu.json` must be added to it when the owner re-issues the export — the
  wiki's `linji_yulu` page and the "Book" mapping are otherwise ready (13 documents in the
  bundle, locators and ledgers rendering).
