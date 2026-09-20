# Task 042 — P0 Integrity & Trust Baseline — Keep gates green, auditor baseline

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git show origin/main:.orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md > /tmp/roadmap.md
   git show origin/main:.orchestrator/NEXT_TASKS_2026-09-19.md > /tmp/next.md
   Verify main is 274dc2a (PR91 one hall one margin) + 13b4bb1 roadmap on arena branch.

1. TASK TITLE AND SCOPE
   P0 Integrity & Trust Baseline — Keep gates green, auditor baseline. This is the foundation for all P1-P6 work to 100% Chan 600-1400. No Pages work.

2. REQUIRED READING ORDER
   - /tmp/roadmap.md — ROADMAP_100PCT_600-1400_2026-09-19.md: current state 35 docs 0 complete 31 excerpt_seed 4 partial, 104975 CJK 1-2% volume 25-30% title, 1252 slots 177 verified 21 profiles (not 3), fields range 2-395 (not 0-6), 31/34 masters linked, 81 notes 48/81 rendered, gates PASS, Pages retired per 2026-09-19, auditor baseline acknowledged, vision.md objectives at full strength not renegotiated
   - /tmp/next.md — NEXT_TASKS_2026-09-19.md P0-P6
   - vision.md §1.1 Distance to each objective — 5 objectives at full strength, not renegotiated, nothing softened, Congronglu remains named goal
   - AUDIT.md — current verdict 7.2/10 repo_ready=fail, 35 docs 1 collated 32 partial/failed 2 unavailable, 630 flagged auth / 532 measured, 104,975 content CJK, 1252 slots 177 verified, 21 matrix registers, 148/148 locators, 34 masters 12 school_key 30 edges pending, 31 terms 24 gongan, Pages system tokens 43, 0 style=, 4 CSSOM writes, CSP without unsafe-inline, render-lazy, bundle 1,925,366 B <2MB
   - .orchestrator/RULING_WEBSITE_2026-09-14.md — Pages Scope 2026-09-19: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for (original law "utmost importance, NOT done, NOT CAPABLE TO JUDGE, 1-10 aim 8+" lives in git history)
   - .github/workflows/quality.yml — retired to text-integrity only (py_compile, validate_data, build_data_bundle, preservation, review, mirror diff, smoke_test) — no per-variant gate, no website ruling gate
   - sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json — authoritative 630 flagged, 924 total, 593 collating
   - sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json — measured 532 flagged / 691/924 collating after 8 re-keys

3. PROJECT CONTEXT
   TranslateChan = Fake Chan Factory. Headline "The old texts are real; the translators are not." — Chinese source layer claimed real and measured via CBETA pin dbdea41071e1e260ad84b72faefd4587333cf76d, extraction rule tei:text/tei:body..., collation harness collate_corpus.py + collate_refs.py + w1_evidence.py. English Robo explicitly fake and badged 🤖. Brand from PR #11 bot-authored, tolerated per "joke in first 30 seconds, then it's all serious" — joke is framing, not definition. Pages deployment out of scope per 2026-09-19.

4. CONFIRMED FACTS
   - Corpus 35 docs, 0 complete, 31 excerpt_seed, 4 partial_selected_witness (biyanlu_cases 100/100 records 353/395 collating, wumenguan 48/48 113/181, linji_yulu 74 sections 84/89 after re-key, xinxin_ming 37/37 24/37), 1 collated_to_claimed_witness zhengdao_ge 6/6, 32 partial_or_failed, 2 unavailable
   - Gates: validate_data PASS corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build_data_bundle 1,693,251 B deterministic byte-identical, preservation 0 unauthorized / 373 permitted vs base 3cc7a8e9681e, review 138 PASS, smoke_test 35 texts, py_compile PASS
   - Translator profiles: 21 profiles inside data/translations/translator_profiles.json (not 3 top-level keys), 4 exemplar passages carrying 21 registers
   - Content fields total range: 2 (yuanwu_letters) to 395 (biyanlu_cases), not 0-6
   - Lineage: 34 masters, 31/34 linked, 3 unlinked prajnatara/yangqi_fanghui/dahong_zuzheng, 30 edges pending exact locator
   - Provenance: 81 note strings (cbeta_note 18, recension_note 14, coverage_note 33, editorial_note 16) with 48/81 rendered at 26 sites
   - Pages: PR91 274dc2a clean house app.css 14,992→3,619 lines app.js 8,746→~4,980 lines net -39,194, grep data-design|rebuild:|design-switcher=0

5. CORE OBJECTIVE
   Ensure P0 Integrity & Trust Baseline stays green and becomes auditable reference. No corpus edits, no Pages work. Verify all gates reproduce auditor's independent verification, correct stale tracker text where needed, and publish a P0 report.

6. EXACT DELIVERABLES
   - Run and quote verbatim:
     python3 -m py_compile scripts/*.py
     python3 scripts/validate_data.py
     python3 scripts/build_data_bundle.py
     python3 scripts/test_source_preservation.py
     python3 scripts/test_source_review_rules.py
     node scripts/smoke_test.mjs
     jq '.profiles | length' data/translations/translator_profiles.json # must be 21
     jq '.corpus.per_text | to_entries[] | [.key, .value.source_review.content_fields_total, .value.source_review.content_fields_collated]' data/project_metrics.json | sort
     git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json || echo "mirror diff"
   - Verify no law verbatim remains: `! grep -R "In no way is the website beautiful" --include="*.md" --include="*.py" --include="*.yml" . | grep -v ".orchestrator/local"` → clean
   - Verify RULING_WEBSITE contains only out-of-scope notice
   - Verify quality.yml contains only text-integrity steps (no per-variant, no website ruling, no continue-on-error)
   - Create report `sessions/P0_INTEGRITY_2026-09-19.md` with gate outputs, corrected counts (21 profiles, range 2-395), and auditor baseline confirmation
   - Update `.orchestrator/STATE.md` Task Queue marking P0 as done, with reference to report

7. SUB-TASK BREAKDOWN
   1. Fetch origin/main and verify 274dc2a + roadmap files exist
   2. Run py_compile, validate_data, build_data_bundle, preservation, review, smoke_test — quote outputs verbatim in PR description
   3. Run corrected counts: translator profiles 21, content_fields_total range, masters linked 31/34, notes 81/48
   4. Verify no Pages law verbatim remains, RULING_WEBSITE out-of-scope, quality.yml retired
   5. Create sessions/P0_INTEGRITY_2026-09-19.md
   6. Commit + push, PR description includes gate outputs verbatim, corrected counts, auditor baseline confirmation, BANNED COMMANDS followed

8. BRANCH AND TARGET
   Base: main 274dc2a
   Target: fix/p0-integrity-trust-baseline
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed, git log -p on bundle. SAFE: --name-only, --stat, --oneline, ls -lh, cat.
   Pages scope: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for. No Pages work.

10. TECHNICAL REQUIREMENTS
    - No edits to data/corpus/*.json or app_data.js manually — only via build_data_bundle.py
    - No new runtime deps, no secrets, no style= (must stay 0), no new setProperty (census stays 4)
    - Keep COMMON_QUALITIES, RULING_WEBSITE out-of-scope notice
    - Keep corpus integrity: 0 unauthorized changes

11. SAFETY
    - No workflow edit (quality.yml already retired, do not edit further)
    - Allowlist set-equal, 630 authoritative not re-designated, 532 measured stays measurement
    - No claiming website beautiful/done — Pages out of scope

12. CLEANUP
    Clean worktree, no committed refs, no __pycache__

13. OUT OF SCOPE
    - No Pages deployment/creation, no 36-layout work, no Congrong Lu, no Chuandeng Lu full, no Caoshan — those are P1
    - No lineage exact locators — P3
    - No rights review — P4
    - No translation verified slots — P5

14. QUALITY CHECKS
    py_compile PASS, validate PASS, build PASS deterministic 1,693,251 B byte-identical, preservation PASS 0 unauthorized 373 permitted, review PASS 138, smoke PASS 35 texts, mirror diff PASS, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired, corrected counts 21 profiles range 2-395

15. PR DESCRIPTION
    Summary P0 Integrity, gate outputs verbatim, corrected counts (21 profiles, range 2-395, 31/34 masters linked, 81 notes 48/81 rendered), auditor baseline confirmation (factual core sound, edges previously unreliable, now corrected), BANNED COMMANDS followed, Pages scope respected, no corpus edits.

16. HARDENING REPORT
    Record branch mismatch, BANNED COMMANDS followed, gate outputs, corrected counts.

