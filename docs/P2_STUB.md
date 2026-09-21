# P2 — Core Yulu Tier2 Next — translatechan lane only

**Role:** translatechan per ROLE_CHARTER_nonduality_wiki_2026-09-20.md — owns corpus, integrity gates, content authority, stable exports. Does NOT run VPS, does NOT write to BookStack, does NOT build websites.

**Base:** main 5982e3e — 44 docs, 10 collated, 4,192 locators, 8,783,101 B bundle, 630 flagged, lineage 20 exact +10 source +1 frontier =30 verified, masters 35 linked 33.

**Why:** Tier2 13 works per ROADMAP_ALL_ENCOMPASSING §3.3 — 6 dispatched (Baizhang, Huangbo, Dazhu, Nanquan, Guiyang, Fayan) 0/6 or 1/11 EXACT below 80% bar (5 of 6) → labels landed per 047 pattern. Remaining 7 need same: deshan_yulu, xuansha_yulu, xuefeng_yantou etc.

**Deliverables:**
- data/corpus/<id>.json — re-keyed verbatim from pinned CBETA dbdea410 cbeta-p5-body-cjk-v1 if ≥80% EXACT else coverage_note per-field measurements (Baizhang pattern s1.d0 24/34 @60,222) + editorial_note "Project retelling — no witness attribution" + cbeta_note ID-corrected, W1 partial_or_failed, no placeholders
- data/project_metrics.json regenerated
- app_data.js + docs/app_data.js deterministic byte-identical twice
- sessions/P2_TIER2_NEXT_2026-09-21.md — extraction digest 40→43 refs verified /0 drift, witness inventory X69n1323 X68n1315 X80n1565, collate output verbatim, gate outputs verbatim

**Steps:**
1. Inventory: collate_corpus.py --doc <id> --generated 2026-09-21
2. Extract: git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5, sparse-checkout X/X69/X69n1323.xml X/X68/X68n1315.xml X/X80/X80n1565.xml, checkout, collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs --work-list <ids> --write-digest-manifest /tmp/refs/manifest.txt
3. Inventory CJK chars vs corpus fields
4. Attempt re-key if ≥80% else enhance labels per 047
5. Gates: py_compile, validate corpus44 locators4192 collated10 flagged630, build 44 docs 8.78M deterministic, preservation 0 unauthorized, review 145+, smoke 44, mirror diff

**80% rule:** 5/6 EXACT → land full re-key which becomes 6/6 EXACT =100% collated_to_claimed_witness. <80% → keep retellings with honest notes. 100% is completeness, 80% is decision gate.

**Branch:** fix/p2-tier2-next, orchestrator arena/01a09829-translatechan

**Out of scope:** No VPS, no BookStack writes, no Caddy/DNS/backups, no website/theme/bot — botrunner lane per charter.
