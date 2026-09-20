Task: P0 Integrity & Trust Baseline — Keep gates green, auditor baseline

Base: main 274dc2a (PR91 one hall one margin) + roadmap 13b4bb1
Target: fix/p0-integrity-trust-baseline

Context: TranslateChan 35 docs 0 complete 31 excerpt_seed 4 partial, 104975 CJK 1-2% volume 25-30% title, 1252 slots 177 verified 21 profiles (not 3), fields range 2-395 (not 0-6), 31/34 masters linked, 81 notes 48/81 rendered, gates PASS corpus35 slots1252 verified177 matrix21 locators148/148 flagged630 auth / 532 measured, 0 unauthorized 373 permitted, 138 checks, 1,693,251 B bundle deterministic, Pages retired per 2026-09-19 out-of-scope notice (original law utmost importance NOT done in history at 6076170), headline "The old texts are real; the translators are not." — Chinese real measured, English Robo fake by design, brand PR #11 joke in first 30s then serious, vision.md objectives at full strength not renegotiated.

Objective: Ensure P0 stays green, correct stale tracker text (21 profiles, range 2-395), verify no law verbatim remains, RULING_WEBSITE out-of-scope, quality.yml text-integrity only, publish sessions/P0_INTEGRITY_2026-09-19.md with gate outputs verbatim.

Gates to quote verbatim:
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
node scripts/smoke_test.mjs
jq '.profiles | length' data/translations/translator_profiles.json # 21
jq '.corpus.per_text | to_entries[] | [.key, .value.source_review.content_fields_total, .value.source_review.content_fields_collated]' data/project_metrics.json

Banned: git show <sha> without --name-only/--stat, git log -p on bundle. Safe: --name-only, --stat, --oneline, ls -lh.

Out of scope: Pages deployment/creation, Congrong Lu, Chuandeng Lu full, Caoshan — those P1, lineage P3, rights P4, translation P5.

Verification: py_compile PASS, validate PASS, build PASS deterministic 1,693,251 B byte-identical, preservation PASS 0 unauthorized 373 permitted, review PASS 138, smoke PASS 35, mirror diff PASS, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired, corrected counts.

PR: fix/p0-integrity-trust-baseline, include gate outputs verbatim, corrected counts, auditor baseline confirmation.
