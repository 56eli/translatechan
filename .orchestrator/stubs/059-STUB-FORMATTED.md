Task: P2 Tier2 Yulu Batch1 — Guiyang + Fayan authenticity labels or re-key

Base: main 43be5c6 14 docs, Tier2 core yulu 13 works per ROADMAP_ALL_ENCOMPASSING §3.3, 4 dispatched 047/048/054 (Baizhang Guanglu 0/6, Huangbo Wanling 0/7, Dazhu Huihai 0/6, Nanquan Yulu 0/6 labels landed), remaining 9 need treatment.

Why P2: Tier2 core yulu are core practice texts, excerpt_seed 0/6 collating as project compositions, only carrier X80n1565 Wudeng Huiyuan fragments or no carrier. Need honest coverage_note + cbeta_note + editorial_note R-B labels per 047 pattern, or R-A re-key if ≥80% carrier found.

Deliverables:
- data/corpus/guiyang_yulu.json (if missing after purge, create as excerpt_seed with honest notes) + fayan_yulu.json updated — either re-keyed verbatim from pinned CBETA dbdea410 cbeta-p5-body-cjk-v1 if ≥80% EXACT (5/6) else coverage_note with per-field run measurements like Baizhang pattern s0.d0 24/34 @60,222, editorial_note R-B "Project retelling — no witness attribution", cbeta_note ID-corrected, W1 status partial_or_failed, no placeholders
- data/project_metrics.json regenerated
- app_data.js + docs/app_data.js deterministic byte-identical twice
- Report sessions/P2_TIER2_BATCH1_2026-09-22.md with extraction digest verification 19→20 refs verified /0 drift, witness inventory, collation output verbatim, gate outputs verbatim, before/after, decision

Steps:
1. Inventory collation status via COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc guiyang_yulu --generated 2026-09-22 etc (if doc missing, measure via historical register)
2. Find CBETA witnesses: X69n1323 Sijia yulu juan3 for Baizhang etc, X68n1315 Guzunsu yulu, X80n1565 Wudeng Huiyuan, T47n1985 etc via collate_refs.py --verify-against manifest, extract to /tmp/refs
3. Inventory structure sections/dialogues/graphs total CJK
4. Attempt re-key: if ≥80% collating, create deterministic producer scripts/segment_<id>.py only input pinned witness asserts every content field contiguous CJK run
5. If <80%: enhance authenticity labels per 047 — editorial_note R-B, coverage_note per-field runs, cbeta_note correction history
6. Gates: py_compile, validate corpus14 or 15-16 if new, locators, collated, flagged, build deterministic, preservation 0 unauthorized, review 145+, smoke, mirror diff

80% rule: 5/6 EXACT → land full re-key which becomes 6/6 100% collated_to_claimed_witness; <80% → keep retellings with honest notes

Branch: fix/p2-tier2-batch1, orchestrator arena/01a09829-translatechan
Out of scope: No VPS, no BookStack writes, no website/theme/bot — botrunner lane
