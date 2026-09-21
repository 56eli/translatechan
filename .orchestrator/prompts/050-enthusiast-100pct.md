# Task 050 — Enthusiast 100% Closer — Zhaozhou Full, Mazu Full, Huangbo Full, Dongshan Full, Yunmen Full, Dahui Letters Full

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git log --oneline origin/main -5
   Verify main is 83f1cbd (38 docs, 4 collated, 1,606 locators, 553k content CJK, 4.85M bundle, P0+P1 done, P2 dispatched 047/048)

1. TASK TITLE AND SCOPE
   Enthusiast 100% Closer — Continue closing the "realistically all you will ever read as a Chan enthusiast" curriculum to 100% — Currently ~85-90% after P1 (Congrong Lu 100 cases, Chuandeng Lu full 30 fascicles 1,274 units, Caoshan Benji 84 units all 100% EXACT 0 flagged). Still missing for enthusiast 100%: full Zhaozhou Yulu X68n1315 (15 dialogues → full), full Mazu Yulu X1321 (excerpt → full), full Huangbo Chuanxin Fayao T2012A (0/7 → full), full Dongshan Yulu T1986 (partial → full), full Yunmen Yulu T1988 (partial → full), Dahui Letters full T47n1998A/B + T48n2001 (0/6 → full). Requirement: land at least 2-3 of these as full ingestion with field-level collation ≥80% target 90%+, honest coverage_note, cbeta_note, zh_chars, gates green, no generated placeholders. This is the enthusiast 100% closer — after this, daily practice curriculum is complete.

2. REQUIRED READING ORDER
   - .orchestrator/MASTER_REFERENCE_2026-09-20.md — §3 Tier1 still missing for enthusiast 100%: Zhaozhou Yulu full X68n1315 15→full, Mazu Yulu full X1321, Huangbo Chuanxin Fayao T2012A 0/7→full, Dongshan Yulu full T1986, Yunmen Yulu full T1988, Dahui Letters full T47n1998A/B+T48n2001 — next steps enthusiast 100%
   - .orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md — Is most missing obscure? Volume yes ~80% long tail, Importance no — 2 of top 10 most-read texts missing/quarantined plus Caoshan and full Zhaozhou, core curriculum ~70% as seeds at PR92, now ~85-90% after P1
   - data/corpus/zhaozhou_yulu.json — current 15 dialogues, cbeta_id claimed X68n1315 but withdrawn T1987 false, coverage_note 0/6? Actually need check — 15 dialogues excerpt_seed
   - data/corpus/mazu_yulu.json — current excerpt_seed, cbeta_id X1321, coverage_note 0/6? Check
   - data/corpus/huangbo_chuanxin.json — T2012A 0/7 in claimed and 0/7 in all 39 refs retold?
   - data/corpus/dongshan_yulu.json — T1986 partial
   - data/corpus/yunmen_yulu.json — T1988 partial
   - data/corpus/dahui_hongzhi.json — T47n1998A/B + T48n2001 6 fields 0/6
   - data/corpus/congronglu.json + chuandenglu_full.json + caoshan_benji.json — pattern for full ingestion from pinned CBETA witness, deterministic producer, 100% EXACT 0 flagged, repo convention kept
   - sessions/P1_CONGRONGLU_2026-09-20.md + P1_CHUANDENGLU_FULL_2026-09-20.md + P1_CAOSHAN_BENJI_2026-09-20.md — full ingestion pattern, evidence-model extension, repo convention, no generated placeholders
   - scripts/collate_refs.py + collate_corpus.py + w1_evidence.py — pinned CBETA revision dbdea410, extraction rule, 41 refs verified after Caoshan, need X68n1315, X1321, T2012A, T1986, T1988, T47n1998A/B, T48n2001 inventory

3. PROJECT CONTEXT
   TranslateChan 38 docs after P1, 1252 slots verified 177 matrix 21, locators 1606, 630 flagged authoritative stays, 0 unauthorized 373 permitted + 3 new docs, 145 checks, bundle 4.85M deterministic. Headline "The old texts are real; the translators are not." Objectives at full strength not renegotiated. Pages out of scope per 2026-09-19. Evidence model: authoritative 2026-09-20 register 38 docs (CAOSHAN_BENJI), 630 authoritative. P1 complete (Congrong Lu 100 cases, Chuandeng Lu full 30 fascicles 1,274 units, Caoshan Benji 84 units all 100% EXACT 0 flagged). P2 dispatched (Baizhang+Huangbo authenticity labels, Dazhu+Nanquan re-key). Enthusiast curriculum ~85-90% — need to close to 100% by landing Zhaozhou full, Mazu full, Huangbo full, Dongshan full, Yunmen full, Dahui Letters full.

4. CONFIRMED FACTS
   - Zhaozhou Yulu X68n1315 15 dialogues → full, witness withdrawn T1987 false, T1987 is Caoshan record, need X68n1315 古尊宿語錄
   - Mazu Yulu X1321 (四家語錄卷一·馬祖道一禪師廣錄) — excerpt → full
   - Huangbo Chuanxin Fayao T2012A — 0/7 in claimed and 0/7 in all 39 refs retold not quoted, need full T2012A
   - Dongshan Yulu T1986 — partial → full
   - Yunmen Yulu T1988 — partial → full
   - Dahui Letters T47n1998A/B + T48n2001 — 6 fields 0/6 — need full
   - CBETA pin dbdea410, extraction rule cbeta-p5-body-cjk-v1, 41 refs verified / 0 drift after Caoshan
   - Repo convention: cbeta_id short form T2012A, T1986, T1988, T1987, X1315, X1321 + taisho_vol for corpus doc, witness ID T48n2012A, T47n1986, etc. for harness/extraction separate
   - Preservation base 3cc7a8e9681e, 0 unauthorized for existing 38 must hold, new docs allowlisted
   - Bundle 4.85M deterministic byte-identical

5. CORE OBJECTIVE
   Close enthusiast 100% curriculum by landing at least 2-3 of the missing Tier1 enthusiast works as full ingestion: Zhaozhou Yulu full X68n1315, Mazu Yulu full X1321, Huangbo Chuanxin Fayao T2012A full, Dongshan Yulu full T1986, Yunmen Yulu full T1988, Dahui Letters full T47n1998A/B+T48n2001 — with field-level collation ≥80% target 90%+, honest coverage_note, cbeta_note, zh_chars, gates green, no generated placeholders. After this, daily practice curriculum is complete (Wumen Guan 48, Biyan Lu 100, Congrong Lu 100, Chuandeng Lu full, Caoshan Benji, Platform Sutra, Xinxin Ming, Zhengdao Ge, Sandokai, Baojing Sanmei, Linji Yulu, Mazu Yulu full, Huangbo full, Dongshan full, Yunmen full, Zhaozhou full, Dahui Letters full).

6. EXACT DELIVERABLES
   - At least 2 new/expanded corpus files from list: `data/corpus/zhaozhou_yulu.json` expanded full X68n1315, `data/corpus/mazu_yulu.json` expanded full X1321, `data/corpus/huangbo_chuanxin.json` expanded full T2012A, `data/corpus/dongshan_yulu.json` expanded full T1986, `data/corpus/yunmen_yulu.json` expanded full T1988, `data/corpus/dahui_letters_full.json` new or expanded dahui_hongzhi — each with sections/dialogues verbatim from pinned CBETA witness, field-level collation ≥80% target 90%+, honest coverage_note, cbeta_note, zh_chars
   - `data/corpus_manifest.json` and `data/project_metrics.json` regenerated — will show 40-41 docs if 2-3 new/expanded
   - `app_data.js` and `docs/app_data.js` regenerated deterministic, byte-identical, new size >4,851,526 B
   - `data/canonical_locators.json` updated with new locators for expanded works
   - Report `sessions/P2_ENTHUSIAST_100PCT_2026-09-20.md` with:
     - CBETA extraction and digest verification for each witness (41→43-44 refs)
     - Witness inventory for each work: sections, dialogues, graphs
     - `collate_corpus.py --doc <work> --require-verified-refs` output verbatim — must be ≥80% collating target 90%+
     - Gate outputs verbatim (py_compile, validate_data corpus40-41, build_data_bundle new size, preservation 0 unauthorized, review 145+, smoke 40-41 texts)
     - Before/after corpus counts, zh_chars, coverage_note
     - Statement no generated placeholders, deterministic producer only input pinned witness

7. SUB-TASK BREAKDOWN
   1. Choose 2-3 highest priority for enthusiast 100%: Zhaozhou full X68n1315 (most famous "Mu", "Oak tree", "Tea"), Huangbo Chuanxin Fayao T2012A (Transmission of Mind, famous), Dongshan full T1986 (Five Ranks, Baojing Sanmei) — or Mazu full, Yunmen full, Dahui Letters full — pick 2-3 that are feasible in 1 PR (estimate 2-3h each)
   2. Fetch CBETA xml-p5 at dbdea410, extract witnesses via collate_refs.py --verify-against manifest, ensure 41→43-44 refs verified / 0 drift
   3. Inventory witness structure for each chosen work: sections, dialogues, graphs
   4. Create deterministic producer scripts/segment_<work>.py for each — only input pinned witness, asserts every content field contiguous CJK run, anchors each section/dialogue at lb line head
   5. Generate expanded/new corpus json from scratch — source verbatim from /tmp/refs/ref_<witness>.txt, repo convention short form + taisho_vol for corpus doc, witness ID for harness/extraction separate
   6. Measure zh_chars, write coverage_note honest with collation numbers
   7. Run collate_corpus.py --doc <work> --require-verified-refs iterate R-A until ≥80% collating target 90%+
   8. Update canonical_locators.json with locators
   9. Run validate_data.py, build_data_bundle.py, test_source_preservation.py, test_source_review_rules.py, smoke_test.mjs, mirror diff — quote verbatim
   10. Create sessions/P2_ENTHUSIAST_100PCT_2026-09-20.md
   11. Commit + push, PR description includes CBETA extraction, witness inventory, collation verbatim ≥80%, gate outputs verbatim, no generated placeholders, BANNED COMMANDS followed

8. BRANCH AND TARGET
   Base: main 83f1cbd (38 docs, P0+P1 done, P2 dispatched)
   Target: feat/enthusiast-100pct
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed, git log -p on bundle, copying generated placeholders. SAFE: --name-only, --stat, --oneline, ls -lh, cat, jq.
   Pages scope: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for. No Pages work.

10. TECHNICAL REQUIREMENTS
    - At least 2 new/expanded corpus files, field-level collation ≥80% target 90%+, honest notes, no generated placeholders
    - No new runtime deps, no secrets, no style= (must stay 0), no new setProperty (census stays 4)
    - CBETA pin dbdea410, extraction rule, 41→43-44 refs verified
    - Preservation: new/expanded files allowlisted as permitted, 0 unauthorized for existing 38 must hold
    - Keep COMMON_QUALITIES, RULING_WEBSITE out-of-scope notice
    - Keep corpus integrity: 0 unauthorized, 38→40-41 docs, honest notes
    - Repo convention: cbeta_id short form + taisho_vol for corpus doc, witness ID for harness/extraction separate

11. SAFETY
    - No workflow edit (quality.yml retired text-integrity only, do not edit)
    - 630 authoritative stays authoritative, no re-designation
    - No claiming website beautiful/done — Pages out of scope
    - Do not copy generated placeholders — must be verbatim from witness

12. CLEANUP
    Clean worktree, no committed refs, no __pycache__, no /tmp/refs committed

13. OUT OF SCOPE
    - No Pages deployment/creation, no 36-layout work
    - No English translations yet — roadmap draft only, not working on it yet per user (that's task 049)
    - No lineage exact locators beyond what enthusiast works enable — P3 batch after this
    - No rights review — P4
    - No translation verified slots — P5
    - No long tail scholarly Tier3 — that's 80% volume, not enthusiast

14. QUALITY CHECKS
    py_compile PASS, validate PASS corpus40-41 slots... , build PASS deterministic new size byte-identical, preservation PASS 0 unauthorized for existing 38 + new/expanded, review PASS 145+, smoke PASS 40-41 texts, collate <work> ≥80% collating target 90%+, mirror diff PASS, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired, no generated placeholders, enthusiast curriculum ~85-90% → ~95-100%

15. PR DESCRIPTION
    Summary enthusiast 100% closer — Zhaozhou full X68n1315, Mazu full X1321, Huangbo full T2012A, Dongshan full T1986, Yunmen full T1988, Dahui Letters full — at least 2-3 landed as full ingestion with field-level collation ≥80% target 90%+, CBETA extraction digest verification, witness inventory, collation output verbatim ≥80%, gate outputs verbatim, before/after counts, no generated placeholders, BANNED COMMANDS followed, Pages scope respected.

16. HARDENING REPORT
    Record CBETA pin, extraction verification, witness inventory, collation before/after, branch mismatch if any, BANNED COMMANDS followed, no generated placeholders, gate outputs.

