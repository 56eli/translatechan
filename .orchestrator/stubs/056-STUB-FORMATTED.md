Task: P2 Next Tier2 Yulu — Guiyang / Fayan / Xuansha / Xuefeng authenticity or re-key

Base: main e2ee031 (44 docs after enthusiast + lineage batch1+2+3 27 verified 4 frontier, 10 collated, 4,192 locators, 8,763,968 B bundle, P2 047 Baizhang+Huangbo labels landed, 048+054 Dazhu+Nanquan failed 0/6 <80% enhanced labels, enthusiast 6 full-witness records)

Why P2 next: Tier2 core yulu 13 works per ROADMAP_ALL_ENCOMPASSING §3.3, 4 dispatched (Baizhang Guanglu, Huangbo Wanling, Dazhu Huihai, Nanquan Yulu) 0/6 or partial labels landed, remaining 9 need similar treatment — Guiyang, Fayan, Xuansha, Xuefeng Yantou, Deshan etc — core practice texts need honest coverage_note + cbeta_note + editorial_note R-B labels per 047 pattern, or R-A re-key if ≥80% carrier found.

Steps:
1. Inventory Tier2 yulu collation status for guiyang_yulu, fayan_yulu, xuansha_yulu, xuefeng_yantou, deshan_yulu via collate_corpus.py --doc <id> --generated 2026-09-21
2. Find CBETA witnesses X69n1323 四家語錄卷三, X68n1315 古尊宿語錄, X80n1565 五燈會元, T47n1985 etc via collate_refs.py --verify-against manifest, ensure 40→43 refs verified /0 drift, extract to /tmp/refs for inspection (do not commit)
3. Extract witnesses to /tmp/refs, inventory structure sections/dialogues/graphs total CJK chars compare to current corpus json
4. Attempt re-key: if ≥80% collating, create deterministic producer scripts/segment_<id>.py only input pinned witness, asserts every content field contiguous CJK run, generate new json verbatim, measure zh_chars, honest notes
5. If <80%: enhance authenticity labels per 047 — editorial_note R-B labels marking sections as project retellings with no witness attribution, coverage_note with detailed per-field run measurements like Baizhang pattern s0.d0 24/34 @60,222 etc, cbeta_note with correction history
6. Gates: py_compile, validate corpus44 locators4192 collated10 or 11-12 if re-keyed flagged630, build 44 docs 8.76M deterministic byte-identical root/docs twice, preservation 0 unauthorized, review 145+, smoke 44, mirror diff, collate <id> verbatim
7. Report sessions/P2_TIER2_NEXT_2026-09-21.md with extraction digest verification, witness inventory, collation output verbatim, gate outputs verbatim, before/after notes, re-key or authenticity label decision

Banned: git show <sha> without --name-only/--stat, git log -p on bundle, copying generated placeholders. Safe: --name-only, --stat, --oneline, ls -lh, cat, jq, collate_corpus.py --doc <id>.

Out of scope: Pages deployment/creation, Baizhang+Huangbo done 047, lineage P3 batch3 parallel 055, rights P4, translation P5, CBETA inventory P6.

Verification: validate corpus44 slots1252 verified177 matrix21 locators4192 collated10 or 11-12 flagged630, build 44 docs 8.76M deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 44, mirror diff, collate <id> verbatim, coverage_note and cbeta_note honest, editorial_note R-B labels if <80%.

Branch: fix/p2-tier2-next, orchestrator arena/01a09829-translatechan
