# Task 057 — P1 Biyanlu Cases Re-key — Blue Cliff Record 100 cases Tier1 top missing

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git log --oneline origin/main -5
   Verify main is 43be5c6 (14 docs after combined Wumenguan+Linji overlay PR108, 12 collated 2 unavailable, 4092 locators, 7,511,135 B bundle, export 25 files)

1. TASK TITLE AND SCOPE
   P1 Biyanlu re-key — Blue Cliff Record (Biyan Lu, Yuanwu Keqin 1125, 100 cases) was purged as retelling after W1 found 353/395 collating, now missing. It's Tier1 top 3 most-read alongside Wumenguan and Congronglu. Need proper re-key from pinned CBETA T48n2003 witness verbatim, tiling all 100 cases.

2. REQUIRED READING ORDER
   - .orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md §3.2 Tier1 — Biyanlu missing
   - .orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md — Biyanlu 100/100 case records but 353/395 collating
   - sessions/COLLATION_REGISTER_2026-09-09.json — historical Biyanlu entry 128 flagged, 353/395 collating
   - data/corpus/wumenguan.json + linji_yulu.json — 2026-09-21 re-key pattern: tiling asserts concatenation equals reference extraction char for char, 207/207 and 215/215 EXACT
   - scripts/collate_refs.py + collate_corpus.py — pinned dbdea410, extraction rule cbeta-p5-body-cjk-v1
   - scripts/record_wumenguan_linji_evidence.py — combined overlay generator pattern

3. PROJECT CONTEXT
   TranslateChan 14 docs after purge + combined overlay, 1 complete (wumenguan), 13 partial, 775k CJK, 7.5M bundle. Pages out of scope. Biyanlu is biggest practitioner gap after Congronglu reinstatement (Congronglu already reinstated as 100 cases collated in 14-doc law? Actually congronglu in 14-doc law is partial_selected_witness collated — check manifest, it is collated. Biyanlu is missing).

4. CORE OBJECTIVE
   Re-key Biyanlu from T48n2003 pinned witness verbatim, 100 cases, each case with pointer_zh, dialogue_zh, commentary_zh, verse_zh etc tiling contiguous, no generated placeholders, 400+ fields EXACT, 0 flagged, coverage_note honest, cbeta_note with T2003, zh_chars declared equals computed.

5. EXACT DELIVERABLES
   - data/corpus/biyanlu_cases.json new — 100 cases, verbatim from T48n2003, 400/400 fields EXACT
   - data/corpus_manifest.json + data/project_metrics.json + canonical_locators + traceability_queue updated
   - app_data.js deterministic byte-identical root/docs twice
   - Report sessions/P2_BIYANLU_REKEY_2026-09-22.md with extraction digest, collation verbatim, gate outputs

6. BRANCH AND TARGET
   Base: main 43be5c6, Target: fix/p1-biyanlu-rekey, Orchestrator: arena/01a09829-translatechan

7. QUALITY CHECKS
   py_compile PASS, validate PASS corpus15, build PASS 15 docs deterministic, preservation declared new, review 145+, smoke PASS, mirror clean
