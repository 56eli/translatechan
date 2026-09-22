Task: P1 Biyanlu Re-key — Blue Cliff Record 100 cases Tier1 top missing after purge

Base: main 43be5c6 (14 docs after combined Wumenguan+Linji overlay PR108, 12 collated 2 unavailable hanshan/niutou, 4092 locators +4 doc-level, 7,511,135 B bundle, 1 complete wumenguan, 13 partial, export 25 files commit 1753ca0)

Why P1: Tier1 top 3 most-read koan collections — Wumenguan 48 (now collated), Congronglu 100 (collated in 14-doc law), Biyanlu 100 missing after purge (historically 100/100 case records but 353/395 collating, 128 flagged). Biggest practitioner gap. Needs proper re-key from pinned CBETA T48n2003 verbatim, not retelling.

Requirement: Extract T48n2003 via collate_refs.py pinned dbdea41071e1e260ad84b72faefd4587333cf76d extraction rule cbeta-p5-body-cjk-v1, 19→20 refs verified 0 drift, manifest byte-identical. Segment 100 cases with cases shape: case_num, title_zh, title_en, pointer_zh, dialogue list, commentary_zh, verse_zh, capping etc — all contiguous CJK runs from ref_T48n2003.txt, assert concatenation equals reference extraction char for char (like wumenguan 48 cases 7,663 CJK and linji 107 sections 16,366 CJK pattern). Measure 400+ fields EXACT 0 flagged, zh_chars declared equals computed, coverage_note honest, cbeta_note T2003, no generated placeholders.

Steps:
1. git fetch --depth 1 origin main, verify main 43be5c6
2. collate_refs.py --verify-against sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt + extract T48n2003 to /tmp/refs/ref_T48n2003.txt, verify sha256  (should match historical manifest)
3. Inventory T48n2003 structure: 100 cases, each case pointer/commentary/verse/dialogue CJK counts, total CJK
4. Create deterministic producer scripts/segment_biyanlu_cases.py — only input pinned witness /tmp/refs/ref_T48n2003.txt, asserts every content field contiguous, lb-anchored locators, generates data/corpus/biyanlu_cases.json verbatim
5. Run COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc biyanlu_cases --require-verified-refs --generated 2026-09-22 → must be ≥90/100 collating target 100%, 0 flagged
6. Update data/corpus_manifest.json (add biyanlu_cases complete_selected_witness collated_to_claimed_witness unit_targets cases 100), data/canonical_locators.json 100 case locators, data/editorial/traceability_queue.json, data/project_metrics.json via validate_data.py --write-metrics
7. Gates: py_compile PASS, validate PASS corpus15 slots46 verified1 matrix21 locators4192+100=4192? Actually 4092+100=4192, collated 13 flagged15, build PASS 15 docs deterministic byte-identical root/docs twice, preservation declared new biyanlu_cases, review 145+, smoke PASS 15, mirror diff clean
8. Report sessions/P2_BIYANLU_REKEY_2026-09-22.md with extraction digest verification, witness inventory, collation output verbatim, gate outputs verbatim, before/after

Banned: git show <sha> without --name-only/--stat, git log -p on bundle, copying generated placeholders. Safe: --name-only, --stat, --oneline, ls -lh, cat, jq, collate_corpus.py --doc <id>.

Out of scope: Pages deployment/creation, lineage exact locators P3, rights P4, translation P5, long tail Tier3.

Branch: fix/p1-biyanlu-rekey, orchestrator arena/01a09829-translatechan
