Task: P2 Dazhu Huihai + Nanquan Re-key Attempt — Try X-series carriers

Base: main 83f1cbd (Caoshan Benji landed 38 docs, corpus=38 locators=1606/1606 collated=4 flagged=630 evidence=2026-09-20 bundle 4,851,526 B, P0+P1 done)

Why P2-2: Core yulu authenticity 0/6 collating as project compositions, try X-series carriers. Dazhu Huihai X1223/X1224 0/6 collated no ≥8-graph run in all 39 refs X63n1223 contributes zero best carrier T51n2076 44/54 @58,336 s0.d1 project retellings retained. Nanquan Yulu X1315 0/6 collated largest 23/27 s1.d0 19 graphs no ≥8-graph run fragmentary parts carried by 傳燈錄/雲門 records.

Requirement: attempt R-A re-key from X-series witnesses X1223/X1224 and X1315, honest coverage_note cbeta_note, gates green, no generated placeholders.

Steps:
1. Find witnesses X63n1223 X63n1224 X68n1315 via collate_refs.py pinned dbdea410 41→43 verified / 0 drift
2. Inventory witness structure sections dialogues graphs
3. Create deterministic producer scripts/segment_dazhu_huihai.py and scripts/segment_nanquan_yulu.py if re-keying — only input pinned witness asserts every content field contiguous CJK run
4. Attempt re-key: generate new json from scratch verbatim from /tmp/refs/ref_<witness>.txt, measure zh_chars honest notes, collate --doc dazhu_huihai and --doc nanquan_yulu --require-verified-refs check ≥80% collating if not keep retellings with honest notes
5. Gates: py_compile, validate corpus38, build deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 38, mirror diff
6. Report sessions/P2_DAZHU_NANQUAN_REKEY_2026-09-20.md with extraction digest verification, inventory, collation verbatim 0/6 or ≥80%, gate outputs verbatim, before/after notes, re-key or authenticity label decision
7. Commit + push, PR description includes verbatim outputs

Banned: git show <sha> without --name-only/--stat, git log -p on bundle, copying generated placeholders. Safe: --name-only, --stat, --oneline, ls -lh, cat, jq.

Out of scope: Pages deployment/creation, Baizhang + Huangbo P2-1, lineage exact locators P3, rights P4, translation P5.

Verification: extraction 41→43/0 drift, collation 0/6 or ≥80% verbatim, validate corpus38, build deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 38, mirror diff, re-key or authenticity label per pattern, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired.

Branch: fix/p2-dazhu-nanquan-rekey, orchestrator arena/01a09829-translatechan
