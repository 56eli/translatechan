# Task 048 — P2 Core Yulu Re-key Attempt — Dazhu Huihai + Nanquan

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git log --oneline origin/main -5
   Verify main is 83f1cbd (Caoshan Benji landed 38 docs, corpus=38 locators=1606/1606 collated=4 flagged=630 evidence=2026-09-20 bundle 4,851,526 B, P0+P1 done)

1. TASK TITLE AND SCOPE
   P2 Core Yulu Re-key Attempt — Dazhu Huihai + Nanquan — 0/6 collating as project compositions, try X-series carriers. Requirement: attempt R-A re-key from X-series witnesses (X1223/X1224 for Dazhu, X1315 for Nanquan), honest coverage_note, cbeta_note, gates green, no generated placeholders.

2. REQUIRED READING ORDER
   - .orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md — P2 core yulu authenticity 0/6 collating as project compositions
   - .orchestrator/NEXT_TASKS_2026-09-19.md P2 — Dazhu Huihai + Nanquan re-key attempt (P2) 2 docs try X-series carriers
   - .orchestrator/WITNESS_INVENTORY*.md — per-doc carrier measurement pattern, X-series carriers, re-key pattern
   - data/corpus/dazhu_huihai.json — current 0/6 collated, s1.d0/s1.d1 no ≥8-graph run in all 39 refs, X63n1223 listed first contributes zero runs, best carrier T51n2076 44/54 @58,336 for s0.d1, project retellings retained, cbeta_id X1223 / X1224
   - data/corpus/nanquan_yulu.json — 0/6 collated, largest contiguous run 23/27, s1.d0 19 graphs no ≥8-graph run in any of 39 refs, fragmentary wording, parts carried by 傳燈錄/雲門 records, retellings retained, cbeta_id X1315
   - data/corpus/dongshan_yulu.json + caoshan_benji.json — Caodong yulu template, re-key pattern
   - scripts/collate_refs.py + collate_corpus.py — pinned CBETA revision dbdea410, extraction rule, 41 refs verified after Caoshan, need X1223/X1224/X1315 inventory
   - vision.md §1.1 — Exhaustive Canonical Ingestion not met, etc

3. PROJECT CONTEXT
   TranslateChan 38 docs after P1, 1252 slots verified 177 matrix 21, locators 1606, 630 flagged authoritative stays, 0 unauthorized 373 permitted + 3 new docs, 145 checks, bundle 4,851,526 B deterministic. Headline "The old texts are real; the translators are not." Objectives at full strength not renegotiated. Pages out of scope per 2026-09-19. Evidence model: authoritative 2026-09-20 register 38 docs (CAOSHAN_BENJI), 630 authoritative. P2 core yulu are excerpt_seed with 0/6 collating — need to try X-series carriers for re-key, or honest authenticity labels if no carrier.

4. CONFIRMED FACTS
   - Dazhu Huihai X1223 (頓悟入道要門論) / X1224 (諸方門人參問語錄) 0/6 collated, no ≥8-graph run in all 39 refs, X63n1223 contributes zero runs, best carrier T51n2076 44/54 @58,336 for s0.d1, project retellings retained
   - Nanquan Yulu X1315 (古尊宿語錄·池州南泉普願禪師語要) 0/6 collated, largest 23/27, s1.d0 19 graphs no ≥8-graph run, fragmentary, parts carried by 傳燈錄/雲門 records
   - WITNESS_INVENTORY pattern: try X-series carriers, if carrier found with ≥80% collating then R-A re-key verbatim from pinned witness, else authenticity label
   - Preservation base 3cc7a8e9681e, 0 unauthorized for existing 38 must hold
   - Bundle 4,851,526 B deterministic byte-identical

5. CORE OBJECTIVE
   Attempt R-A re-key of Dazhu Huihai and Nanquan from X-series witnesses: extract X1223/X1224 and X1315 via collate_refs.py pinned dbdea410, inventory structure, segment verbatim, collate --doc dazhu_huihai and --doc nanquan_yulu --require-verified-refs, if ≥80% collating then land re-keyed version, else keep project retellings with honest coverage_note and authenticity label per pattern, gates green.

6. EXACT DELIVERABLES
   - `data/corpus/dazhu_huihai.json` updated — either re-keyed from X1223/X1224 verbatim if carrier found ≥80%, or honest coverage_note: 0/6 collated, no ≥8-graph run in all 39 refs, X63n1223 contributes zero, best carrier T51n2076 44/54 @58,336, project retellings retained, W1 status partial_or_failed
   - `data/corpus/nanquan_yulu.json` updated — either re-keyed from X1315 verbatim if carrier found ≥80%, or honest coverage_note: 0/6 collated, largest 23/27, s1.d0 19 graphs no ≥8-graph run, fragmentary, parts carried by 傳燈錄/雲門 records, retellings retained
   - `data/corpus_manifest.json` and `data/project_metrics.json` regenerated via validate_data.py + build_data_bundle.py — 38 docs still
   - `app_data.js` and `docs/app_data.js` regenerated deterministic, byte-identical
   - Report `sessions/P2_DAZHU_NANQUAN_REKEY_2026-09-20.md` with:
     - X-series extraction and digest verification (41→43 refs if new X-series)
     - Witness inventory: X1223/X1224 and X1315 structure
     - `collate_corpus.py --doc dazhu_huihai` and `--doc nanquan_yulu` output verbatim — 0/6 or re-keyed ≥80%
     - Gate outputs verbatim (py_compile, validate_data corpus38, build_data_bundle 38 docs, preservation 0 unauthorized, review 145+, smoke 38 texts)
     - Before/after coverage_note, cbeta_note, re-key or authenticity label decision
     - Statement no generated placeholders, deterministic producer only input pinned witness if re-keyed

7. SUB-TASK BREAKDOWN
   1. Find CBETA witnesses: check xml-p5 X/X63/X63n1223.xml, X/X63/X63n1224.xml, X/X68/X68n1315.xml via collate_refs.py --verify-against manifest, ensure 41→43 refs verified / 0 drift
   2. Inventory witness structure: sections, dialogues, graphs
   3. Create deterministic producer scripts/segment_dazhu_huihai.py and scripts/segment_nanquan_yulu.py if re-keying — only input pinned witness, asserts every content field contiguous CJK run
   4. Attempt re-key: generate new json from scratch source verbatim from /tmp/refs/ref_<witness>.txt, measure zh_chars, honest coverage_note + cbeta_note
   5. Run collate_corpus.py --doc dazhu_huihai and --doc nanquan_yulu --require-verified-refs, check ≥80% collating, if not then keep retellings with honest notes
   6. Run validate_data.py, build_data_bundle.py, test_source_preservation.py, test_source_review_rules.py, smoke_test.mjs, mirror diff — quote verbatim
   7. Create sessions/P2_DAZHU_NANQUAN_REKEY_2026-09-20.md
   8. Commit + push, PR description includes extraction, inventory, collation verbatim 0/6 or ≥80%, gate outputs verbatim, re-key or authenticity label decision, BANNED COMMANDS followed

8. BRANCH AND TARGET
   Base: main 83f1cbd (Caoshan Benji landed 38 docs, P0+P1 done)
   Target: fix/p2-dazhu-nanquan-rekey
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed, git log -p on bundle, copying generated placeholders. SAFE: --name-only, --stat, --oneline, ls -lh, cat, jq.
   Pages scope: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for. No Pages work.

10. TECHNICAL REQUIREMENTS
    - No new docs, only 2 docs updated — either re-keyed verbatim from X-series if carrier ≥80%, or honest notes if no carrier
    - No new runtime deps, no secrets, no style= (must stay 0), no new setProperty (census stays 4)
    - CBETA pin dbdea410, extraction rule, 41→43 refs verified
    - Preservation: updated files allowlisted as permitted changes, 0 unauthorized for existing 38 must hold
    - Keep COMMON_QUALITIES, RULING_WEBSITE out-of-scope notice
    - Keep corpus integrity: 0 unauthorized, 38 docs, honest notes

11. SAFETY
    - No workflow edit (quality.yml retired text-integrity only, do not edit)
    - 630 authoritative stays authoritative, no re-designation
    - No claiming website beautiful/done — Pages out of scope
    - Do not copy generated placeholders — must be verbatim from X-series witness if re-keying, else retellings retained with honest notes

12. CLEANUP
    Clean worktree, no committed refs, no __pycache__, no /tmp/refs committed

13. OUT OF SCOPE
    - No Pages deployment/creation, no 36-layout work
    - No Baizhang + Huangbo Wanling — that's other P2 agent
    - No lineage exact locators — P3
    - No rights review — P4
    - No translation verified slots — P5

14. QUALITY CHECKS
    py_compile PASS, validate PASS corpus38 slots... , build PASS deterministic byte-identical, preservation PASS 0 unauthorized, review PASS 145+, smoke PASS 38 texts, collate dazhu 0/6 or ≥80% and nanquan 0/6 or ≥80% verbatim, mirror diff PASS, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired, re-key or authenticity label per pattern

15. PR DESCRIPTION
    Summary Dazhu Huihai + Nanquan re-key attempt from X-series, extraction digest verification, witness inventory, collation output verbatim 0/6 or ≥80%, gate outputs verbatim, before/after notes, re-key or authenticity label decision, BANNED COMMANDS followed, Pages scope respected.

16. HARDENING REPORT
    Record CBETA pin, extraction verification, witness inventory, collation before/after, branch mismatch if any, BANNED COMMANDS followed, no generated placeholders, gate outputs.

