# P3 — Lineage Frontier Final — translatechan lane only

**Role:** translatechan per ROLE_CHARTER — owns corpus, integrity gates, content authority, stable exports. Does NOT run VPS, does NOT write to BookStack. Botrunner owns VPS advisory + import pipeline + presentation, LOSSLESS intermediary, never authors content.

**Base:** main 5982e3e — 44 docs, 10 collated, 4,192 locators, 8,783,101 B bundle, lineage 31 edges =20 exact T51n2076_pXXXX lb range + verbatim +10 source fascicle/page-line or X1565 +1 documented intentional frontier dahong→yuelin, masters 35 linked 33 unlinked 2 intentional yangqi reviewed + dahong, P2 Dazhu/Nanquan/Guiyang/Fayan enhanced labels.

**Why:** After batch1+2+3+frontier final rebase 30 verified 1 pending intentional dahong→yuelin (0 occurrences in X1565/T2076/44 docs). Need 0 pending or fully documented frontier to unblock graph, enable BookStack wiki lineage trees (botrunner imports after gates pass with provenance stamped).

**Deliverables:**
- data/lineage/lineage_verification.json — 4 frontiers: prajnatara→bodhidharma exact T51n2076_p0216a19–p0216b20 + p0217a09–p0220b22 verbatim 本名菩提多羅後遇二十七祖般若多羅…宜名達磨, longtan→deshan exact p0317b13–p0318a27 因造龍潭信禪師 + p0313b10–p0313c05, yangqi→baiyun source_verified X80n1565 p0724a11 披削往參楊岐… + p0721b05, dahong→yuelin documented intentional frontier 0 occurrences search method recorded, Baiyun→Wuzu X80n1565 p0729a07+p0724a11, status exact if lb range+verbatim else source else traditional with enhanced note
- data/lineage/masters.json — frontier masters yangqi, dahong, prajnatara, longtan with explicit profile_evidence frontier_profile_reviewed_pending_exact_locator, [] intentional, profile_status updated
- data/lineage/profile_review_queue.json — 3 complete +1 frontier_source_needed dahong
- data/project_metrics.json regenerated
- app_data.js + docs/app_data.js deterministic byte-identical twice
- sessions/P3_LINEAGE_FRONTIER_FINAL_2026-09-21.md — X1565 extraction digest verification 581,588 CJK sha256 a3d20a10... dbdea410 pinned, for each frontier old/new status exact locator or frontier documentation, gate outputs verbatim

**Steps:**
1. Clone CBETA XML P5 dbdea410: git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5, sparse-checkout X/X80/X80n1565.xml, checkout, extract via collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs --work-list X80n1565 --write-digest-manifest /tmp/refs/manifest.txt
2. Search X1565 for Baiyun, Wuzu, Longtan, Dahong, Yuelin, Prajnatara — find fascicle/page-line and lb anchors, also search chuandenglu_full 1,274 units
3. Update lineage_verification.json, masters.json
4. Gates: validate corpus44 locators4192 collated10 flagged630 lineage 31 edges 30 verified 1 frontier intentional or 31 verified, build 44 docs 8.78M deterministic, preservation 0 unauthorized, review 145+, smoke 44, mirror diff

**Branch:** fix/p3-lineage-frontier-final, orchestrator arena/01a09829-translatechan

**Out of scope:** No VPS advisory (botrunner lane), no BookStack writes, no Caddy/DNS/backups, no website/theme/bot, no public framing. Translatechan publishes verified data + schema; botrunner refines and imports with gates as preconditions, provenance stamped, idempotent, never authors content. Content problems downstream become content tickets to TC lane via owner.

**Open-ended scope:** ROADMAP_ALL_ENCOMPASSING 102 masters snapshot NOT exhaustive target 150-200 more material in circulation, 55-entry aliases.json and 129-entry english_references.json draft_seed 16 ISBNs verified 89 needs_lookup 24 none, agents must NOT assume 102/134/129 final.
