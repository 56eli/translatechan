Task: P3 Lineage Expansion — 25 new masters from Guzunsu yulu to reach 60

Base: main 43be5c6 35 masters, 24 gongan, target 150-200 per ROADMAP_ALL_ENCOMPASSING §2.1-2.3

Why P3: Lineage is second core objective, 35 profiled is scaffold not graph, 30 edges traditional_link_pending_exact_locator, 3 unlinked frontier. Guzunsu yulu (X68n1315, 48 fascicles, compiled 1267) holds records of ~20 eminent masters from Nanquan to Zhimen Guangzuo — ready-made source for next ~20 Tang/Song profiles per §2.6.

Deliverables:
- data/lineage/masters.json 60 masters — add 25 Song-era masters: Xuedou Chongxian (980-1052, Biyanlu verse author), Hongzhi Zhengjue (1091-1157, Congronglu verse), Wansong Xingxiu (1166-1246, Congronglu compiler), Fenyang Shanzhao (947-1024, first verse commentaries), Huanglong Huinan (1002-1069), Furong Daokai (1043-1118), Qingliao (1088-1151), Shoushan Shengnian (926-993), Xutang Zhiyu (1185-1269), Yongming Yanshou (904-975, Zongjing lu), Juefan Huihong (1071-1128, Chanlin sengbao), plus 14 more from Guzunsu yulu fascicles — each with name_zh, dates, house, works, source citations [1](https://terebess.hu/zen/textindex.html) etc, linked_corpus_keys where possible
- data/lineage/lineage_verification.json updated — 10 edges exact locator from T51n2076 or X80n1565
- data/lineage/profile_review_queue.json updated
- data/project_metrics.json regenerated
- app_data.js deterministic byte-identical
- Report sessions/P3_LINEAGE_60_2026-09-22.md with source verification

Steps:
1. Fetch .orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md §2.3 table 23 new Song masters + §2.4 genealogists
2. For each master, web search + cbeta lookup for dates/house, add to masters.json with honest source
3. For 10 edges, search CBETA XML P5 dbdea410 X80n1565 for exact page/line, update lineage_verification.json
4. Gates: validate PASS, build PASS, preservation 0 unauthorized, review PASS, smoke PASS 35→60 texts? Actually smoke counts corpus texts not masters, but lineage count in metrics
5. Commit + push

Branch: fix/p3-lineage-60, orchestrator arena/01a09829-translatechan
Out of scope: No VPS advisory, no BookStack writes, no website/theme/bot
