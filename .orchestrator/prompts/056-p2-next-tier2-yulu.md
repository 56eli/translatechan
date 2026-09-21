# Task 056 — P2 Next Tier2 Yulu — Guiyang / Fayan / Xuansha / Xuefeng authenticity or re-key

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git log --oneline origin/main -5
   Verify main is e2ee031 (44 docs after enthusiast + lineage batch1+2+3 27 verified 4 frontier, 10 collated, 4,192 locators, 8,763,968 B bundle, P2 047 Baizhang+Huangbo labels landed, 048+054 Dazhu+Nanquan failed 0/6 <80% enhanced labels, enthusiast 6 full-witness records)

1. TASK TITLE AND SCOPE
   P2 Next Tier2 Yulu — Guiyang / Fayan / Xuansha / Xuefeng / Deshan — core yulu Tier2 incomplete in corpus, attempt authenticity labels or re-key. Current: guiyang_yulu 0/6? fayan_yulu 0/6? xuansha_yulu partial? xuefeng_yantou partial? Need to inventory Tier2 yulu per ROADMAP_ALL_ENCOMPASSING §3.3 Tier2 core yulu incomplete: 13 works, 0/6 P2 dispatch 047/048 done for Baizhang/Huangbo/Dazhu/Nanquan, remaining 9 need similar treatment. Why P2: Tier2 core yulu are core practice texts, need honest coverage_note + cbeta_note + editorial_note R-B labels per 047 pattern, or R-A re-key if ≥80% carrier found.

2. REQUIRED READING ORDER
   - .orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md §3.3 Tier2 — 13 works, Baizhang/Huangbo/Dazhu/Nanquan already dispatched, remaining: guiyang_yulu, fayan_yulu, xuansha_yulu, xuefeng_yantou, deshan_yulu, etc.
   - .orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md — P2 core yulu authenticity
   - data/corpus/guiyang_yulu.json, fayan_yulu.json, xuansha_yulu.json, xuefeng_yantou.json, deshan_yulu.json — current collation status, coverage_note, cbeta_note
   - data/corpus/baizhang_guanglu.json — 047 pattern: detailed coverage_note with per-field run measurements, no editorial_note at root but coverage_note honest
   - scripts/collate_refs.py + collate_corpus.py — pinned CBETA dbdea410, 40-41 refs verified, need X-series for Guiyang/Fayan etc: X69n1323 四家語錄, X68n1315 古尊宿語錄, X80n1565 五燈會元, T47n1985 etc.
   - sessions/P2_DAZHU_NANQUAN_RETRY_2026-09-21.md — previous retry pattern, extraction and collation verbatim
   - .orchestrator/WITNESS_INVENTORY*.md — per-doc carrier measurement pattern

3. PROJECT CONTEXT
   TranslateChan 44 docs after enthusiast 100% closer + lineage 27 verified 4 frontier + P2 retry enhanced labels, 1252 slots verified177 matrix21 locators4192 collated10 flagged630 evidence2026-09-21, bundle 8.76M deterministic. Headline "The old texts are real; the translators are not." Pages out of scope per 2026-09-19. P2 Tier2 yulu are excerpt_seed with 0/6 or partial collating — need honest authenticity labels if no carrier ≥80%, or R-A re-key verbatim if carrier found.

4. CONFIRMED FACTS
   - Tier2 core yulu: 13 works per ROADMAP_ALL_ENCOMPASSING §3.3, 4 dispatched 047/048/054 (Baizhang Guanglu, Huangbo Wanling, Dazhu Huihai, Nanquan Yulu) — 0/6 or partial, labels landed
   - Remaining: guiyang_yulu (Guishan Lingyou + Yangshan Huiji), fayan_yulu (Fayan Wenyi), xuansha_yulu (Xuansha Shibei), xuefeng_yantou (Xuefeng Yicun + Yantou Quanhuo), deshan_yulu (Deshan Xuanjian), etc. — likely 0/6 or partial, need inventory
   - WITNESS_INVENTORY pattern: try X-series carriers, if ≥80% collating then R-A re-key verbatim from pinned witness, else authenticity label per 047 pattern with detailed coverage_note per-field run measurements
   - Preservation base 3cc7a8e9681e, 0 unauthorized must hold
   - CBETA pin dbdea410, 40-41 refs verified

5. CORE OBJECTIVE
   Attempt R-A re-key or authenticity labels for 2-3 Tier2 yulu (pick guiyang_yulu + fayan_yulu as next): extract claimed witnesses via collate_refs.py pinned dbdea410, inventory structure, run collate_corpus.py --doc <id> --require-verified-refs --generated 2026-09-21, if ≥80% (5 of 6 or 5 of 7 etc) collating then land re-keyed version verbatim, else keep project retellings with enhanced authenticity labels (editorial_note R-B labels marking sections as project retellings with no witness attribution, coverage_note with per-field run measurements like Baizhang: s0.d0 24/34 @60,222 etc, cbeta_note with ID correction history), gates green.

6. EXACT DELIVERABLES
   - `data/corpus/guiyang_yulu.json` and/or `fayan_yulu.json` updated — either re-keyed verbatim if carrier ≥80% or enhanced coverage_note + editorial_note authenticity labels per 047 pattern, honest cbeta_note
   - `data/project_metrics.json` regenerated
   - `app_data.js` and `docs/app_data.js` regenerated deterministic byte-identical root/docs twice
   - Report `sessions/P2_TIER2_NEXT_2026-09-21.md` with extraction digest verification, witness inventory, collation output verbatim, gate outputs verbatim, before/after notes, re-key or authenticity label decision

7. SUB-TASK BREAKDOWN
   1. Inventory Tier2 yulu: check collation status for guiyang_yulu, fayan_yulu, xuansha_yulu, xuefeng_yantou, deshan_yulu via collate_corpus.py --doc <id> --generated 2026-09-21
   2. Find CBETA witnesses: X69n1323 四家語錄卷三 for Baizhang etc, X68n1315 古尊宿語錄 for many, X80n1565 五燈會元, T47n1985 for Linji-related etc via collate_refs.py --verify-against manifest
   3. Extract witnesses to /tmp/refs, inventory structure sections/dialogues/graphs
   4. Attempt re-key: if ≥80% collating, create deterministic producer scripts/segment_<id>.py only input pinned witness, asserts every content field contiguous CJK run, generate new json verbatim, measure zh_chars, honest notes
   5. If <80%: enhance authenticity labels per 047 — editorial_note R-B labels, coverage_note with detailed per-field run measurements (like Baizhang pattern), cbeta_note with correction history
   6. Run validate_data.py --write-metrics, validate_data.py, build_data_bundle.py twice, preservation, review, smoke, mirror diff — quote verbatim
   7. Create report
   8. Commit + push, PR description includes extraction, inventory, collation verbatim, gate outputs, decision, BANNED COMMANDS followed

8. BRANCH AND TARGET
   Base: main e2ee031 (44 docs + lineage 27 verified)
   Target: fix/p2-tier2-next
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed, git log -p on bundle, copying generated placeholders. SAFE: --name-only, --stat, --oneline, ls -lh, cat, jq, collate_corpus.py --doc <id>.
   Pages scope: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for.

10. TECHNICAL REQUIREMENTS
    - No new docs, only 2-3 docs updated — either re-keyed verbatim if ≥80% or honest notes
    - No new runtime deps, no secrets, no style= (must stay 0), no new setProperty (census stays 4)
    - CBETA pin dbdea410, extraction rule cbeta-p5-body-cjk-v1, 40-41 refs verified /0 drift
    - Preservation: updated files allowlisted as permitted, 0 unauthorized must hold
    - Keep COMMON_QUALITIES light mental load minimum info expand/hover/toggle English first not dense, info section for every work and teacher where from / related / background
    - Keep corpus integrity: 0 unauthorized, 44 docs, honest notes, no generated placeholders — must be verbatim from witness if re-keying
    - Bundle deterministic byte-identical root/docs twice

11. SAFETY
    - No workflow edit
    - 630 authoritative stays authoritative
    - No claiming website beautiful/done — Pages out of scope
    - Do not copy generated placeholders — must be verbatim from witness if re-keying, else retellings retained with honest notes
    - Open-ended scope: 102 masters snapshot NOT exhaustive target 150-200 more material in circulation

12. CLEANUP
    Clean worktree, no committed refs, no __pycache__, no /tmp/refs committed

13. OUT OF SCOPE
    - No Pages deployment/creation
    - No lineage exact locators — that's P3 parallel 055
    - No rights review P4
    - No translation verified slots P5
    - No full CBETA inventory P6

14. QUALITY CHECKS
    py_compile PASS, validate PASS corpus44 slots1252 verified177 matrix21 locators4192 collated10 or 11-12 if re-keyed flagged630, build PASS 44 docs 8.76M deterministic byte-identical root/docs twice, preservation PASS 0 unauthorized, review PASS 145+, smoke PASS 44, mirror diff PASS, collate <id> verbatim, coverage_note and cbeta_note honest, editorial_note R-B labels if <80%

15. PR DESCRIPTION
    Summary P2 Tier2 next yulu — Guiyang/Fayan etc — extraction digest verification, witness inventory, collation verbatim, gate outputs verbatim, before/after notes, re-key or authenticity label decision, BANNED COMMANDS followed.

16. HARDENING REPORT
    Record CBETA pin, extraction verification, witness inventory, collation before/after, branch mismatch, BANNED COMMANDS, no generated placeholders, gate outputs, bundle determinism.
