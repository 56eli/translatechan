# P2 + P3 Simple Stubs — Role Charter Compliant — translatechan lane only

Per ROLE_CHARTER_nonduality_wiki_2026-09-20.md:
- translatechan owns corpus, integrity gates, content authority, stable exports
- Does NOT run/configure VPS, does NOT write to BookStack directly, does NOT build websites/themes/Discord features, does NOT make public framing, does NOT dispatch importer
- Botrunner owns VPS advisory + import pipeline + presentation, is LOSSLESS intermediary, never authors content
- Seam: translatechan publishes verified data + schema, botrunner refines and imports with gates as preconditions, provenance stamped

Base main 5982e3e: 44 docs 10 collated 4,192 locators 8,783,101 B bundle 630 flagged 125 provenance 83 rendering 35 docs, lineage 20 exact +10 source +1 frontier =30 verified 1 pending dahong→yuelin intentional, masters 35 linked 33 unlinked 2 intentional yangqi reviewed + dahong, P2 Dazhu/Nanquan/Guiyang/Fayan enhanced labels below 80% bar, all-encompassing roadmap 102 masters snapshot NOT exhaustive target 150-200 open-ended disclaimer 2026-09-21, Oracle VPS 2 OCPU 12GB RAM Ubuntu 24.04 domain nonduality.duckdns.org is botrunner lane advisory only.

---

## P2 — Core Yulu Tier2 Next

See file P2_TIER2_NEXT_STUB.md for full stub — summary:

- Task: Guiyang / Fayan / Xuansha / Xuefeng / Deshan authenticity or re-key
- Why: Tier2 13 works, 6 dispatched 0/6 or 1/11 below 80% bar (5 of 6) → labels landed per 047 pattern, remaining 7 need same
- Deliverables: data/corpus/<id>.json updated — either re-keyed verbatim from pinned CBETA dbdea410 cbeta-p5-body-cjk-v1 if ≥80% EXACT else coverage_note per-field run measurements + editorial_note "Project retelling — no witness attribution" + cbeta_note ID-corrected, W1 status partial_or_failed, no placeholders; project_metrics.json regenerated; app_data.js + docs/app_data.js deterministic byte-identical twice; sessions/P2_TIER2_NEXT_2026-09-21.md with extraction digest verification 40→43 refs verified /0 drift, witness inventory, collate output verbatim, gate outputs verbatim
- Steps: inventory collation, extract witnesses X69n1323 X68n1315 X80n1565 via collate_refs.py, inventory CJK chars, attempt re-key if ≥80% else enhance labels, gates py_compile validate corpus44 locators4192 collated10 flagged630 build 44 docs 8.78M deterministic preservation 0 unauthorized review 145+ smoke 44 mirror diff
- 80% rule: 5/6 EXACT → land full re-key which becomes 6/6 EXACT =100% collated_to_claimed_witness; <80% → keep retellings with honest notes; 100% is completeness, 80% is decision gate
- Branch: fix/p2-tier2-next, orchestrator arena/01a09829-translatechan
- Out of scope: No VPS, no BookStack writes, no Caddy/DNS/backups, no website/theme/bot — botrunner lane

---

## P3 — Lineage Frontier Final

See file P3_FRONTIER_FINAL_STUB.md for full stub — summary:

- Task: 4 frontiers + X1565 lb anchors — final 0 pending
- Why: After batch1+2+3+frontier final rebase 30 verified 1 pending intentional dahong→yuelin, need 0 pending or fully documented frontier to unblock graph, enable BookStack wiki lineage trees (botrunner imports after gates)
- Deliverables: lineage_verification.json updated — prajnatara→bodhidharma exact p0216a19–p0216b20 + p0217a09–p0220b22 verbatim 本名菩提多羅..., longtan→deshan exact p0317b13–p0318a27 因造龍潭信禪師 + p0313b10–p0313c05, yangqi→baiyun source_verified X80n1565 p0724a11 披削往參楊岐… + p0721b05, dahong→yuelin documented intentional frontier 0 occurrences, Baiyun→Wuzu X80n1565 p0729a07+p0724a11; masters.json updated with explicit profile_evidence frontier_profile_reviewed_pending_exact_locator, [] intentional; profile_review_queue.json 3 complete +1 frontier_source_needed dahong; project_metrics.json regenerated; app_data.js + docs/app_data.js deterministic byte-identical twice; sessions/P3_LINEAGE_FRONTIER_FINAL_2026-09-21.md with X1565 extraction digest verification 581,588 CJK sha256 a3d20a10... dbdea410 pinned
- Steps: clone CBETA XML P5 dbdea410 X80n1565, extract via collate_refs.py, search X1565 for Baiyun/Wuzu/Longtan/Dahong/Yuelin/Prajnatara, update lineage_verification.json, masters.json, gates validate corpus44 locators4192 collated10 flagged630 lineage 31 edges 30 verified 1 frontier intentional or 31 verified, build 44 docs 8.78M deterministic, preservation 0 unauthorized, review 145+, smoke 44, mirror diff
- Branch: fix/p3-lineage-frontier-final, orchestrator arena/01a09829-translatechan
- Out of scope: No VPS advisory (botrunner lane), no BookStack writes, no Caddy/DNS/backups, no website/theme/bot, no public framing. Translatechan publishes verified data + schema; botrunner refines and imports with gates as preconditions, provenance stamped, idempotent, never authors content.

---

Full stub files:
- .orchestrator/stubs/055-STUB-FORMATTED.md (P3 frontier final)
- .orchestrator/stubs/056-STUB-FORMATTED.md (P2 next Tier2)
- Simplified versions: /tmp/stubs_simple/P2_TIER2_NEXT_STUB.md and /tmp/stubs_simple/P3_FRONTIER_FINAL_STUB.md
