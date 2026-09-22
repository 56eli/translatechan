# Task 059 — P2 Tier2 Yulu Batch1 — Guiyang + Fayan authenticity labels or re-key

0. FETCH AND VERIFY
   main 43be5c6 14 docs, Tier2 core yulu 13 works per ROADMAP_ALL_ENCOMPASSING §3.3, 4 dispatched 047/048/054 (Baizhang, Huangbo, Dazhu, Nanquan), remaining 9 need treatment.

1. SCOPE
   Guiyang Yulu (Guishan Lingyou + Yangshan Huiji) + Fayan Yulu (Fayan Wenyi) — both 0/6 collating as project compositions per WITNESS_INVENTORY. Attempt R-A re-key if ≥80% carrier found in X-series (X68n1315 Guzunsu yulu, X80n1565 Wudeng Huiyuan, X69n1323 Sijia yulu), else authenticity labels per 047 pattern: coverage_note with per-field run measurements (s0.d0 24/34 @60,222 etc), editorial_note R-B labels marking sections as project retellings with no witness attribution, cbeta_note with ID correction history.

2. READING ORDER
   - ROADMAP_ALL_ENCOMPASSING §3.3 Tier2
   - data/corpus/guiyang_yulu.json, fayan_yulu.json — current 0/6 status (if exist, else need inventory — they may be missing after purge, need to check main 43be5c6 has 14 docs only, so Guiyang/Fayan missing — need to create as excerpt_seed with honest notes first)
   - data/corpus/baizhang_guanglu.json 047 pattern
   - scripts/collate_refs.py + collate_corpus.py pinned dbdea410

3. OBJECTIVE
   Either re-key verbatim if carrier ≥80% or enhance authenticity labels honest.

4. DELIVERABLES
   - data/corpus/guiyang_yulu.json + fayan_yulu.json updated or created
   - metrics + bundle deterministic
   - Report sessions/P2_TIER2_BATCH1_2026-09-22.md

5. BRANCH
   Base main 43be5c6 Target fix/p2-tier2-batch1
