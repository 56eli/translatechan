Task: Enthusiast 100% Closer — Zhaozhou Full, Mazu Full, Huangbo Full, Dongshan Full, Yunmen Full, Dahui Letters Full

Base: main 83f1cbd (38 docs, 4 collated, 1,606 locators, 553k content CJK, 4.85M bundle, P0+P1 done, P2 dispatched)

Why: Continue closing "realistically all you will ever read as a Chan enthusiast" curriculum to 100% — currently ~85-90% after P1 (Congrong Lu 100 cases, Chuandeng Lu full 30 fascicles 1,274 units, Caoshan Benji 84 units all 100% EXACT 0 flagged). Still missing for enthusiast 100%: full Zhaozhou Yulu X68n1315 15→full (famous Mu, Oak tree, Tea), full Mazu Yulu X1321 excerpt→full, full Huangbo Chuanxin Fayao T2012A 0/7→full (Transmission of Mind), full Dongshan Yulu T1986 partial→full (Five Ranks, Baojing Sanmei), full Yunmen Yulu T1988 partial→full, Dahui Letters full T47n1998A/B+T48n2001 0/6→full. After this daily practice curriculum complete (Wumen Guan 48, Biyan Lu 100, Congrong Lu 100, Chuandeng Lu full, Caoshan Benji, Platform Sutra, Xinxin Ming, Zhengdao Ge, Sandokai, Baojing Sanmei, Linji Yulu, Mazu full, Huangbo full, Dongshan full, Yunmen full, Zhaozhou full, Dahui Letters full).

Requirement: land at least 2-3 of these as full ingestion with field-level collation ≥80% target 90%+, honest coverage_note cbeta_note zh_chars gates green no generated placeholders. This is enthusiast 100% closer.

Steps:
1. Choose 2-3 highest priority: Zhaozhou full X68n1315 (Mu, Oak tree, Tea), Huangbo Chuanxin Fayao T2012A (Transmission of Mind), Dongshan full T1986 (Five Ranks) — or Mazu full, Yunmen full, Dahui Letters full — pick 2-3 feasible in 1 PR (2-3h each)
2. Fetch CBETA xml-p5 at dbdea410 extract witnesses via collate_refs.py 41→43-44 verified / 0 drift
3. Inventory witness structure sections dialogues graphs
4. Create deterministic producer scripts/segment_<work>.py for each — only input pinned witness asserts every content field contiguous CJK run anchors each section/dialogue at lb line head
5. Generate expanded/new corpus json from scratch verbatim from /tmp/refs/ref_<witness>.txt repo convention short form + taisho_vol for corpus doc witness ID for harness/extraction separate
6. Measure zh_chars honest coverage_note + cbeta_note
7. Collate collate_corpus.py --doc <work> --require-verified-refs iterate R-A until ≥80% collating target 90%+
8. Update canonical_locators.json with locators
9. Gates: py_compile, validate corpus40-41, build new size deterministic byte-identical, preservation 0 unauthorized for existing 38 + new/expanded, review 145+, smoke 40-41, mirror diff
10. Report sessions/P2_ENTHUSIAST_100PCT_2026-09-20.md with extraction digest verification inventory collation verbatim ≥80% gate outputs verbatim before/after counts no generated placeholders
11. Commit + push, PR description includes extraction inventory collation verbatim ≥80% gate outputs verbatim

Banned: git show <sha> without --name-only/--stat, git log -p on bundle, copying generated placeholders. Safe: --name-only, --stat, --oneline, ls -lh, cat, jq.

Out of scope: Pages deployment/creation, English translations yet (roadmap draft only that's task 049), lineage exact locators beyond enthusiast works P3, rights P4, translation P5, long tail scholarly Tier3 80% volume not enthusiast.

Verification: extraction 41→43-44/0 drift, collation ≥80% target 90%+ verbatim, validate corpus40-41, build deterministic new size byte-identical, preservation 0 unauthorized, review 145+, smoke 40-41, mirror diff, no generated placeholders, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired, enthusiast curriculum ~85-90% → ~95-100%.

Branch: feat/enthusiast-100pct, orchestrator arena/01a09829-translatechan
