# Task 058 — P1 Complete Marking — Make 10 partial docs complete_selected_witness

0. FETCH AND VERIFY
   git fetch --depth 1 origin main, main 43be5c6 14 docs 12 collated 1 complete (wumenguan) 13 partial

1. TASK TITLE AND SCOPE
   P1 Complete marking — 13 docs are partial_selected_witness though tiling verbatim contiguous (congronglu 100/100, chuandenglu_full 1274 units, caoshan 84/84, huangbo_fayao_full 19, mazu 35, yunmen 776, dongshan 322, zhaozhou 80, dahui 1354, linji 107, zhengdao_ge 6, etc). Need to add unit_targets and set completion_status complete_selected_witness where W1 status is collated_to_claimed_witness and unit counts meet targets. This is honest completion, not generated.

2. REQUIRED READING ORDER
   - data/corpus_manifest.json — current items completion_status, unit_targets
   - data/project_metrics.json — per_text coverage
   - scripts/validate_data.py complete_document_keys() — rule: complete_selected_witness + collated_to_claimed_witness + unit_targets met
   - docs/GATE.md — complete definition
   - .orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md — 0 fully ingested gap

3. CORE OBJECTIVE
   Update manifest to mark 10 docs as complete_selected_witness with honest unit_targets (e.g. congronglu cases 100, chuandenglu_full cases 1274? Actually check unit_counts, etc), regenerate metrics, docs truthfulness still green.

4. DELIVERABLES
   - data/corpus_manifest.json updated with unit_targets and completion_status complete_selected_witness for 10 docs
   - data/project_metrics.json regenerated
   - app_data.js deterministic
   - Report sessions/P1_COMPLETE_MARKING_2026-09-22.md

5. BRANCH
   Base main 43be5c6 Target fix/p1-complete-marking
