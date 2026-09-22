Task: P1 Complete Marking — Make 10 partial docs complete_selected_witness

Base: main 43be5c6 (14 docs, 1 complete wumenguan 48/48, 13 partial though tiling verbatim: congronglu 100/100, chuandenglu_full 1274 units, caoshan_benji 84/84, huangbo_fayao_full 19, mazu_guanglu_full 35, yunmen_guanglu_full 776, dongshan_yulu_full 322, zhaozhou_yulu_full 80, dahui_yulu_full 1354, linji_yulu 107, zhengdao_ge 6)

Why: ROADMAP_100PCT says 0 fully ingested, but 10 docs already tile verbatim contiguous from pinned witnesses per Wumenguan+Linji pattern. They are partial_selected_witness only because unit_targets missing and completion_status not set. Need honest complete marking per validate_data.py complete_document_keys() rule: complete_selected_witness + collated_to_claimed_witness + unit_targets met.

Steps:
1. Inventory each doc unit_counts via python -c "import json; print(unit_counts)"
2. For each collated doc, set data/corpus_manifest.json items: completion_status complete_selected_witness, unit_targets {cases: N} or {sections: N} etc matching present counts, source_review_status stays collated_to_claimed_witness
3. Validate: complete_document_keys() should return 11 docs (wumenguan +10)
4. Run validate_data.py --write-metrics, validate PASS corpus14 complete 11, build PASS deterministic, preservation 0 unauthorized (manifest change allowlisted as permitted? Actually manifest change is permitted if it makes complete marking honest — need to check test_source_preservation allowlist, but manifest not in corpus preservation, so OK), review PASS, smoke PASS, mirror clean
5. Update README/AUDIT/HANDOFF doc truthfulness: Corpus **14 documents** with **11 complete** etc? Actually need to check doc truthfulness rules for complete count — currently not guarded, but per_text coverage will show is_complete true
6. Report sessions/P1_COMPLETE_MARKING_2026-09-22.md with before/after manifest, unit_counts, gate outputs

Branch: fix/p1-complete-marking
