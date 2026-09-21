# Stub P2.9 — Linji Yulu proper re-key — most pressing

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
