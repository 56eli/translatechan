Task: P2 Core Yulu Re-key Retry — Dazhu Huihai + Nanquan — attempt ≥80% collation

Base: main 6d36957 (44 docs after enthusiast + lineage batch1+2, 10 collated, 4,192 locators, 855,603 content CJK / 917,778 all-string, 125 provenance notes 83 rendering 35 docs cbeta_note 28, 630 flagged, bundle 8,754,966 B, P0+P1+P2 done with 047 Baizhang+Huangbo authenticity labels landed, 048 Dazhu+Nanquan failed 0/6 <80% NOT landed labels+coverage_notes only, enthusiast 6 full-witness records, lineage 18 verified 13 pending 33/35 linked)

Why P2 retry: Dazhu Huihai X63n1223/X63n1224 and Nanquan X68n1315 are core yulu Tier 2 incomplete in corpus 0/6 collating as project compositions — need thorough X-series extraction retry to reach ≥80% (5 of 6) to land re-keyed version, else enhanced authenticity labels per 047 pattern.

Steps:
1. Find CBETA witnesses xml-p5 X/X63/X63n1223.xml, X/X63/X63n1224.xml, X/X68/X68n1315.xml via collate_refs.py --verify-against manifest, ensure 40→43 refs verified /0 drift, extract to /tmp/refs/ref_X*.txt for inspection (do not commit)
2. Inventory witness structure sections/dialogues/graphs total CJK chars compare to current corpus json
3. Create deterministic producer scripts/segment_dazhu_huihai.py and scripts/segment_nanquan_yulu.py if re-keying — only input pinned witness, asserts every content field contiguous CJK run
4. Attempt re-key: generate new json verbatim from witness, measure zh_chars, honest coverage_note + cbeta_note, run collate_corpus.py --doc dazhu_huihai and --doc nanquan_yulu --require-verified-refs, check ≥80%
5. If <80%: enhance authenticity labels per 047 — editorial_note R-B labels, coverage_note with detailed carrier measurements, cbeta_note with correction history, keep project retellings retained with honest notes
6. Gates: py_compile, validate corpus44 locators4192 collated10 (or 12 if re-keyed) flagged630, build 44 docs 8.75M deterministic byte-identical root/docs twice, preservation 0 unauthorized, review 145+, smoke 44, mirror diff, collate dazhu 0/6 or ≥80% and nanquan 0/6 or ≥80% verbatim
7. Report sessions/P2_DAZHU_NANQUAN_RETRY_2026-09-21.md with extraction digest verification, witness inventory, collation output verbatim, gate outputs verbatim, before/after notes, re-key or authenticity label decision

Banned: git show <sha> without --name-only/--stat, git log -p on bundle, copying generated placeholders. Safe: --name-only, --stat, --oneline, ls -lh, cat, jq, python3 scripts/collate_corpus.py --doc <id> --require-verified-refs.

Out of scope: Pages deployment/creation, Baizhang+Huangbo done 047, lineage P3 batch3 parallel 053, rights P4, translation P5, CBETA inventory P6.

Verification: validate corpus44 slots1252 verified177 matrix21 locators4192 collated10 or 12 flagged630, build 44 docs 8.75M deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 44, mirror diff, collate dazhu and nanquan verbatim, coverage_note and cbeta_note honest, no generated placeholders.

Branch: fix/p2-dazhu-nanquan-retry, orchestrator arena/01a09829-translatechan
