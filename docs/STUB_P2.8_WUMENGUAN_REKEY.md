# Stub P2.8 — Wumenguan proper re-key — most pressing

**Priority:** High — The Gateless Gate is the most famous koan collection, previously purged as retelling (0/6 EXACT), now missing from corpus, masters.json wumen_huikai has empty linked_corpus_keys.

**Goal:** Re-key `wumenguan` from claimed witness `T48n2005` Wumenguan Song woodblock, CBETA XML P5 revision `dbdea410`, extraction rule `cbeta-p5-body-cjk-v1`, 48 cases, 100% collated_to_claimed_witness, 0 flagged.

**Current state after purge:**
- `data/corpus/wumenguan.json` deleted (was partial_or_failed 48/48 cases but paraphrased)
- `data/corpus_manifest.json` 12 docs, no wumenguan
- `data/project_metrics.json` 12 docs, no wumenguan
- `data/lineage/masters.json` wumen_huikai linked_corpus_keys [] empty
- `data/canonical_locators.json` no wumenguan
- `sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json` 12 docs, no wumenguan

**What to do — translatechan lane only (owner holds secrets/merges):**

1. Extract witness `T48n2005` via `scripts/ingest_cbeta.py` or `scripts/collate_refs.py` with rule `cbeta-p5-body-cjk-v1` — TEI body only, drop notes/g, keep only CJK U+3400-U+9FFF/U+F900-U+FAFF, NFC, one line, digest-verified against committed manifest `sessions/COLLATION_W1_2026-09-21_ENTHUSIAST_100PCT_refs_manifest.txt` (or create new if T2005 not in manifest — currently not, need to add reference).

2. Segment into 48 cases via `scripts/segment_classical.py` or similar — each case: title_zh, title_pinyin, title_en, dialogue array with speaker zh/pinyin, pointer_zh, commentary_zh, verse_zh, verse_commentary, locator {source_id: wumenguan, reference: T48n2005_pXXXX, lb_range: T48n2005_pXXXX–pYYYY}

3. Ensure every content field zh/verse_zh/commentary_zh/pointer_zh is verbatim contiguous run in T48n2005 body — collator `scripts/collate_corpus.py` should measure 48 cases * ~5 fields = ~240 fields EXACT, 0 flagged.

4. Add `coverage_note`: "All 48 cases verbatim and contiguous in claimed witness T48n2005 under pinned extraction rule cbeta-p5-body-cjk-v1, CBETA XML P5 revision dbdea410..."

5. Add `cbeta_note`: extended witness info, preface/epilogue handling (T48n2005 has preface, no epilogue? Actually has)

6. Add to `data/corpus_manifest.json` item: key wumenguan, title "The Gateless Gate (無門關)", cbeta T2005, unit_targets cases 48, completion_status partial_selected_witness (or complete_selected_witness if you claim complete representation — but complete only allowed when W1 collated, which it will be, so complete_selected_witness is allowed), source_review_status collated_to_claimed_witness

7. Update `data/lineage/masters.json` wumen_huikai linked_corpus_keys ["wumenguan"]

8. Update `data/canonical_locators.json` with document entry for wumenguan and 48 case locators

9. Record evidence: create `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json` or add to existing authoritative register via `scripts/record_*_evidence.py` pattern, with witness_note "Task P2.8: Wumenguan T48n2005 48 cases tiling XXXX CJK verbatim"

10. Run gates: `python3 scripts/validate_data.py --write-metrics --skip-docs` then `python3 scripts/validate_data.py` full (must PASS), `python3 scripts/build_data_bundle.py` deterministic, `node scripts/smoke_test.mjs` optional

11. Update doc truthfulness numbers in README/AUDIT/HANDOFF/ROADMAP/vision/RESEARCH_RELEASE_PLAN via script (CJK counts will increase, provenance notes, corpus 13 docs, collated 11, etc.)

12. Commit, push to arena branch, open PR from arena to main, owner merges

**Acceptance:**
- `wumenguan.json` exists, 48 cases, every content field EXACT in T48n2005, 0 flagged, W1 collated_to_claimed_witness
- `validate_data.py` PASS, bundle deterministic
- Export manifest includes wumenguan, wiki can show it as Book with 48 Pages

**Anti-requirements:** No BookStack-shaped export, no presentation decisions, no credentials, no performance work, no delivery mechanism yet.

**Owner ruling:** Wiki receives ONLY 100% collated docs — this re-key qualifies.
