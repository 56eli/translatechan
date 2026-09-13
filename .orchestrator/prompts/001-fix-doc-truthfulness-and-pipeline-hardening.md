0. FETCH AND VERIFY
   Your task prompt is on the orchestrator branch. Fetch it, then follow it exactly.
   The fetch MUST be `git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch`
   then `git show refs/remotes/origin/_orch:.orchestrator/prompts/001-fix-doc-truthfulness-and-pipeline-hardening.md > /tmp/task.md`.
   Do not use `origin/arena/01a09829-translatechan` (single-branch clones do not create it). Do not use FETCH_HEAD (the next fetch of main overwrites it).
   Do not `git checkout` orchestrator paths into the worktree.
   State: write outside the repository, never commit this file, never push to the orchestrator branch, halt if the file is empty or the title mismatches.
   Confirm: `git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md` exists as supplement.

1. TASK TITLE AND SCOPE
   Fix D-1..D-4 doc-precision defects + O-1 full (stale census 49/38/22/16 → 50/39/23/17, PIN in gate, extend scan set) + O-2 self-validation + O-3 structural mirror-tree diff.
   Complete this in ONE pull request.

2. REQUIRED READING ORDER
   - .orchestrator/local/ORCHESTRATOR_STATE.md (via /tmp/state.md) — canonical tracker = .orchestrator/STATE.md, rulings DR-1..DR-3 + D-1..D-4, O-1..O-3
   - /tmp/pack1.md Pack 1 ENGAGEMENT (owner letter) — read fully, Steps 1-4, DR-3 resolution
   - /tmp/pack2.md Pack 2 FINDINGS & EVIDENCE — Lane 1 D-1/D-2/O-1, Lane 2 D-3/O-2, Lane 3 D-4, Lane 5 O-3, all VERIFIED rows
   - .orchestrator/STATE.md lines 40-60 (D-1 wording) — confirm, do not copy blindly: `grep -n "Reproduce the authoritative register" .orchestrator/STATE.md`
   - README.md line 151 — `grep -n "translator_profiles.json" README.md` (D-2)
   - scripts/validate_data.py docstring lines 12-22 and function validate_doc_truthfulness 1142-1350 (D-3 + O-1 gate)
   - HANDOFF.md line 110 — `grep -n "Forty-one.*inline styles" HANDOFF.md` (D-4)
   - ROADMAP.md lines 33, 161-180 — `grep -n "49.*provenance\|38 of 49\|22.*documents" ROADMAP.md` (O-1 stale census)
   - vision.md lines 55-95, 325-335 — `grep -n "49.*provenance\|38 of 49\|22.*documents" vision.md` (O-1 stale, 5 lines)
   - WEB_VISION_2026-08-10.md full 213 lines — check for census (currently clean, but will be added to gate per O-1)
   - RESEARCH_RELEASE_PLAN.md lines 30-35, 100-110 — `grep -n "49.*provenance\|38 of 49" RESEARCH_RELEASE_PLAN.md`
   - scripts/arena_agent_pipeline.py lines 60-110 — `create_translation_entry` (O-2)
   - .github/workflows/quality.yml — artifact-diff step (O-3)
   - OPERATIONS.md Edit 1 — exact expected diff command
   - data/translations/translator_profiles.json — to measure 14/6+1 for D-2: `python3 -c "import json;obj=json.load(open('data/translations/translator_profiles.json'));from collections import Counter;print(Counter(p['evidence_source'] for p in obj['profiles']))"`
   - data/corpus/*.json counts — to measure 50/39/23/17: `python3 - <<'PY'\nimport json,glob;notes=[];\nfor path in glob.glob('data/corpus/*.json'):\n    import json as js\n    d=js.load(open(path))\n    def col(o):\n        if isinstance(o,dict):\n            for k,v in o.items():\n                if k.endswith('_note'): notes.append(k)\n                col(v)\n        elif isinstance(o,list):\n            for x in o: col(x)\n    col(d)\nprint(len(notes))\nPY`

3. PROJECT CONTEXT AND OWNER VISION
   Fake Chan Factory is zero-backend static Pages SPA (app.js 173KB, app.css 67KB, app_data.js 1.64MB generated). Pipeline: data/ → validate_data.py → project_metrics.json → build_data_bundle.py → root + docs/ mirror. Public scope exactly 5 rooms smoke-guarded. W1 collation authoritative 630 flagged (correction overlay 2026-09-10) vs measured 532 on current main — 630 stays authoritative per owner ruling 2026-09-12. CBETA pinned revision dbdea41071e1e260ad84b72faefd4587333cf76d authorized read-only, never committed, per DR-1. This task is Phase A source-integrity first per Pack 1 Step 1, fixing doc-truthfulness defects that passed gate due to missing pins/scan set, and hardening pipeline per O-2/O-3. Owner Vision Context: honest disclosure is moral core — every number in prose must be measured, not re-typed; gates must pin figures that matter (O-1), and helpers must self-validate before gate (O-2).

4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES
   - Canonical tracker resolved per DR-3: .orchestrator/STATE.md — every mention of canonical tracker means that file.
   - DR-1: CBETA cbeta-org/xml-p5 @ dbdea410... authorized read-only pinned-revision verification, never committed, provenance lanes only. Everything else CBETA discovery-only zero automated requests.
   - DR-2: review material via letter/file fetch, not PR.
   - Prior owner rulings 2026-09-12 still binding: Ruling 1 six CITATION rows one PR (PR #43 done), Ruling 2 ledger stays 630 authoritative, Ruling 3 fabricated text replace/label, Ruling 4 OUT-OF-CBETA human-only.
   - New rulings 2026-09-13: D-1..D-4 approved, O-1 full (update census 50/39/23/17, PIN in gate, EXTEND scan set to WEB_VISION_2026-08-10.md and RESEARCH_RELEASE_PLAN.md), O-2 and O-3 adopted, Pages revamp top priority proposal-first.
   - Invariants: never generate Classical Chinese; N/N never proves complete; edition verification ≠ rights; internal IDs stay; 5 rooms only; pipeline order fixed; durable memory in repo files; harness probing ≠ collating (0/6 collate exception dahui_hongzhi bibliographic); source collation does not approve reuse.
   - Scope boundaries: Phase A first, Phase B Pages revamp proposal-first no code until owner confirms; nothing outside existing footprint without asking; no .github/workflows edits except O-3 which is explicitly approved; no agent fetch/transcription of OUT-OF-CBETA; no re-designation 630→532; no edits to sessions/ (append-only).
   - Measured baseline on main 6076170: corpus documents 35, content CJK 104564, all-string 110233, authoritative flagged 630, post-remediation measurement 532 flagged / 691 collating / 1-32-2 statuses, provenance notes 50 total = cbeta_note 17 + recension_note 14 + coverage_note 11 + editorial_note 8, rendered 39, coverage 11, docs with label 23, translator_profiles 21 = 14 in_corpus_verified + 6 documented_external + 1 not_applicable, inline-style sites 58 = 41 attribute literals + 17 property writes.
   - From Pack 2: D-1 wording conflates file-integrity hash with reproduction output; D-2 README stale 13/7 vs measured 14/6+1; D-3 validator docstring says only README/HANDOFF/index.html but gate also covers AUDIT.md, ROADMAP.md, .orchestrator/REMEDIATION_PLAN.md, .orchestrator/STATE.md; D-4 HANDOFF says 41 but measured 58.

5. CORE OBJECTIVE
   Fix all four MINOR doc-precision defects D-1..D-4 exactly as described, execute O-1 full (update 9 stale census lines to 50/39/23/17, PIN those four figures in doc-truthfulness gate, EXTEND gate scan set to WEB_VISION_2026-08-10.md and RESEARCH_RELEASE_PLAN.md), implement O-2 self-validation in arena_agent_pipeline.create_translation_entry rejecting verified_quotation lacking full source record, and implement O-3 structural mirror-tree diff in quality.yml (git diff --exit-code -- app_data.js docs data/project_metrics.json). All five quality gates must pass. Done criteria: D-1..D-4 prose corrected, O-1 census updated in all 9 locations (ROADMAP:163,179 vision:57,59,88,90,327 RESEARCH:32,103 plus any WEB_VISION lines if present), gate pins 50/39/23/17 and scans 8 files (README,HANDOFF,AUDIT,ROADMAP,WEB_VISION,RESEARCH,STATE,REMEDIATION_PLAN) + index.html, O-2 helper raises/rejects incomplete verified_quotation, O-3 workflow uses structural diff.

6. EXACT DELIVERABLES
   - Modify: .orchestrator/STATE.md (D-1 wording fix — clarify sha256 is file integrity of committed register, --reproduce writes current-state 532-flag register with reproduction-comparison block, does not re-emit historical 630 file bytes; keep both sha256s, keep command, fix conflation)
   - Modify: README.md line 151 (D-2 — change 13/7 to 14 in-corpus-verified; 6 documented-external + 1 not_applicable, i.e. 14/6+1)
   - Modify: scripts/validate_data.py docstring line 17-18 (D-3 — expand list to README.md, HANDOFF.md, index.html, AUDIT.md, ROADMAP.md, WEB_VISION_2026-08-10.md, RESEARCH_RELEASE_PLAN.md, .orchestrator/STATE.md, .orchestrator/REMEDIATION_PLAN.md)
   - Modify: HANDOFF.md line 110 and any duplicate (D-4 — Forty-one → Fifty-eight, or 58 sites = 41 attribute literals + 17 property writes; keep CSP unsafe-inline necessary explanation)
   - Modify: ROADMAP.md lines 163,179 (O-1 — 49→50, 38→39, 16→17, 22→23 where applicable; ensure 33 stays correct at 50/39/23/17; ensure 161 stays 23 docs correct)
   - Modify: vision.md lines 57-59, 88-90, 327, 333 (O-1 — same 49→50 etc; note 88,90 inside measured text block printed by script at :61-:82 — must be regenerated by re-running that script per continuation note, not retyped manually; update date on :84 accordingly)
   - Modify: RESEARCH_RELEASE_PLAN.md lines 32,103 (O-1 — 49→50, 38→39, 16→17)
   - Modify: WEB_VISION_2026-08-10.md — no stale census currently, but add to gate scan set per O-1 (if any future census appears, gate will catch); ensure file still passes new gate (no-op if clean)
   - Modify: scripts/validate_data.py function validate_doc_truthfulness — add PINs for 50/39/23/17 and extend scanned list to include WEB_VISION_2026-08-10.md and RESEARCH_RELEASE_PLAN.md (and ensure vision.md also covered? Check P-6 list currently README,HANDOFF,AUDIT,ROADMAP,index.html,STATE,REMEDIATION_PLAN — add WEB_VISION and RESEARCH and vision.md if not already)
   - Modify: scripts/arena_agent_pipeline.py — implement O-2 self-validation: in create_translation_entry, if trans status == verified_quotation and source missing or incomplete (requires work, edition, reference, verification, source_id) or source_id not in rights_manifest, then raise ValueError or downgrade to reconstruction_unverified and log; ensure existing valid entries still pass; add docstring note.
   - Modify: .github/workflows/quality.yml — implement O-3: replace enumerated artifact-diff list with structural form `git diff --exit-code -- app_data.js docs data/project_metrics.json` (per Lane5 O-3 suggestion). This also closes Edit 1 gap (four mirror files now covered structurally).
   - Modify: data/project_metrics.json — regenerated via --write-metrics if needed (but gate must still pass; metrics are generated)
   - Modify: app_data.js + docs/ mirrors — regenerated via build_data_bundle.py (deterministic, byte-identical)
   - Modify: .orchestrator/STATE.md Task Queue — mark 001 done if needed per task prompt? Actually per AGENTS.md, agents update STATE.md only when prompt says so; this prompt does NOT require STATE.md task queue update beyond D-1 fix — leave other updates to orchestrator.
   - Ensure: OPERATIONS.md Edit 1 now marked as superseded by structural diff? Do NOT edit OPERATIONS.md unless prompt says — leave as is, but PR description should note O-3 closes Edit 1 structurally.

7. SUB-TASK BREAKDOWN AND CHECKPOINTS
   1. Measure current provenance notes and translator profiles to confirm 50/39/23/17 and 14/6+1 — run python snippets from Required Reading — commit + push
   2. Fix D-1 in .orchestrator/STATE.md (wording) — commit + push
   3. Fix D-2 in README.md (profile counts) — commit + push
   4. Fix D-3 docstring in scripts/validate_data.py (gate coverage list) — commit + push
   5. Fix D-4 in HANDOFF.md (41→58) — commit + push
   6. Fix O-1 stale census in ROADMAP.md, vision.md (regenerate text block via script, not retype), RESEARCH_RELEASE_PLAN.md — commit + push
   7. Implement O-1 gate PINs and scan-set extension in scripts/validate_data.py (add checks for 50/39/23/17, extend scanned list to WEB_VISION and RESEARCH) — commit + push
   8. Implement O-2 self-validation in arena_agent_pipeline.py — commit + push
   9. Implement O-3 structural diff in .github/workflows/quality.yml — commit + push
   10. Run full quality gates: py_compile, validate_data.py, build_data_bundle.py, smoke_test.mjs, diff -rq data docs/data — commit + push final
   11. Update PR description with evidence

8. BRANCH AND TARGET
   Base branch: main — never the orchestrator branch
   Target branch: feature/fix-doc-truthfulness-and-pipeline-hardening
   Orchestrator branch: arena/01a09829-translatechan — fetch source only, never a base or target
   Dependencies: none
   Resuming: fresh branch from main
   Before the first checkpoint, align HEAD to a remote tip — being on a branch named <target> is not evidence it is the remote <target>:
     git fetch --depth 50 origin +feature/fix-doc-truthfulness-and-pipeline-hardening:refs/remotes/origin/_resume
     git checkout -B feature/fix-doc-truthfulness-and-pipeline-hardening refs/remotes/origin/_resume
   If that fetch cannot find the remote ref, the branch is new:
     git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B feature/fix-doc-truthfulness-and-pipeline-hardening origin/main
   Do not skip the fetch because you appear to be on <target>. Do not commit on main. "couldn't find remote ref" here is not an environment failure.

9. WORK PERSISTENCE AND PUSH CADENCE
   Checkpoint after each sub-task in section 7, before any long or risky operation, and at the end. Your session can expire without warning; unpushed work is lost. There is no time-based rule — section 7 is your push schedule.
   A checkpoint is ONE command — first push, later pushes, and the nothing-to-push no-op are all the same form. Do not run status/diff inspections around it.
     git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin feature/fix-doc-truthfulness-and-pipeline-hardening
   Match the project's commit convention for the subject (Step 4's rule); `chore: wip <sub-task>` is the fallback where no convention is detectable.
   Open ONE pull request at the end, when quality checks pass. Do not open a draft PR first unless this prompt explicitly tells you to.
   Checkpoint commits may be broken — that is expected. Never commit secrets. Never push to the orchestrator branch.
   Sync rule: rebase onto origin/main ONLY before your first push. After the first push, use "git fetch --depth 50 origin +main:refs/remotes/origin/main && git merge --no-edit origin/main", then "git push origin HEAD".
   Never force-push unless explicitly instructed, and then only with --force-with-lease.
   On merge conflict: halt and report the conflicting files. The same for a sync that refuses with "refusing to merge unrelated histories" — never pass --allow-unrelated-histories.
   If a push or fetch fails with an authentication or network error, report it plainly and keep working locally; retry the push at the next checkpoint. Never claim work is pushed while a push has failed, and never modify credentials, remotes, or git config to work around it.
   If the push is rejected non-fast-forward, halt and report the raw rejection. That is a base mismatch, not an environment failure. Do not git pull. Do not force-push. Already-pushed checkpoints on the remote are safe; a later agent will resume from them.

10. TECHNICAL REQUIREMENTS
    Language: Python + Markdown + YAML, follow existing style.
    Style: Keep existing tone, no humor removal, keep brand Fake Chan Factory.
    For D-1: preserve both sha256s, keep command `COLLATION_REFS=<refs> python3 scripts/collate_corpus.py --out /tmp/register.json --reproduce sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`, but clarify hash is file integrity, reproduction output is current-state 532 with comparison block.
    For D-2: count translator_profiles.json profiles by evidence_source — confirm 14 in_corpus_verified, 6 documented_external, 1 not_applicable = 21 total.
    For D-3: docstring must list all files gate actually scans after O-1 extension.
    For D-4: 58 = 41 literals + 17 property writes — wording must reflect both mechanisms.
    For O-1: update 9 stale lines: ROADMAP.md:163,179, vision.md:57,59,88,90,327, RESEARCH_RELEASE_PLAN.md:32,103 — but vision.md:88,90 inside text block must be regenerated by re-running script at vision.md:61-:82, not retyped; update date on :84.
    For O-1 gate: in validate_doc_truthfulness, add checks that pin 50/39/23/17 figures; extend scanned list from ["README.md","AUDIT.md","HANDOFF.md","ROADMAP.md","index.html",".orchestrator/STATE.md"] to also include "WEB_VISION_2026-08-10.md","RESEARCH_RELEASE_PLAN.md","vision.md" (check current P-6 list: README,HANDOFF,AUDIT,ROADMAP,index.html,STATE,REMEDIATION_PLAN — add WEB_VISION and RESEARCH). Ensure gate still passes after prose fixes.
    For O-2: in arena_agent_pipeline.create_translation_entry, validate: if status == "verified_quotation" then source must be dict with keys work, edition, reference, verification, source_id and source_id must exist in data/translations/rights_manifest.json; otherwise raise ValueError("verified_quotation requires full source record with rights_manifest entry") or downgrade. Add try/except around rights_manifest load. Keep existing behavior for reconstruction_unverified/ai_draft.
    For O-3: in quality.yml, replace artifact-diff step with structural form: `git diff --exit-code -- app_data.js docs data/project_metrics.json` — this covers all mirrored assets structurally.
    TEST_COMMAND: python3 scripts/validate_data.py — must PASS (3 lineage warnings expected)
    INTEGRATION_TEST_COMMAND: python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs — must PASS, 35 corpus texts, 0 crashes
    FULL_SUITE_COMMAND: python3 -m py_compile scripts/*.py && python3 scripts/validate_data.py && python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs && diff -rq data docs/data && git diff --exit-code -- app_data.js docs data/project_metrics.json
    COVERAGE_COMMAND: not configured — report not applicable
    MUTATION_TEST_COMMAND: python3 scripts/test_source_review_rules.py — must PASS 120 checks (or current count)
    LINT_COMMAND: not configured — skip
    BUILD_COMMAND: python3 scripts/build_data_bundle.py — deterministic bundle

11. SAFETY AND COMPATIBILITY RULES
    - Must NOT break existing 5 quality gates.
    - Must NOT change corpus source text (data/corpus/*.json) except via allowed provenance note fixes? This task is docs-only + pipeline hardening, no corpus text re-key.
    - Must NOT re-designate 630→532; keep 630 authoritative, 532 as measurement.
    - Must NOT edit sessions/ (append-only).
    - Must NOT commit CBETA refs (21 MB outside repo).
    - Must NOT edit .github/workflows/* beyond O-3 approved change.
    - Must NOT generate Classical Chinese.
    - Must NOT change public scope (5 rooms).
    - Must keep internal identifiers translatechan_*, window.TranslateChan, TRANSLATECHAN_DATA.

12. CLEANUP RULES
    By final push, leave no commented-out code, temporary debug logs, ad-hoc test scripts, console.log, TODO markers introduced by this PR. Do not modify unrelated files. Do not reformat code outside scope. Do not commit fetched prompt file or /tmp files. Intermediate checkpoint commits exempt — clean up once before opening PR.

13. STRICT BOUNDARIES / OUT OF SCOPE
    - Do not push to orchestrator branch arena/01a09829-translatechan.
    - Do not re-key corpus source fields (no R-A work).
    - Do not fix dahui_hongzhi disclosure (014b-2) unless it is already covered by census fix? Keep separate; this task is D-1..D-4 + O-1..O-3 only.
    - Do not start Pages revamp code (proposal-only phase).
    - Do not edit OPERATIONS.md (record of owner-controlled edits) — note O-3 closes Edit 1 structurally in PR description, but do not edit file.
    - Do not fetch CBETA or run collate_refs/collate_corpus beyond verification (read-only pinned revision only if needed, never committed).
    - Do not add new dependencies.

14. QUALITY CHECKS
    - Run: python3 -m py_compile scripts/*.py — syntax PASS
    - Run: python3 scripts/validate_data.py — must PASS (3 lineage warnings documented)
    - Run: python3 scripts/build_data_bundle.py — must rebuild byte-identical bundle after prose fixes? Note: prose fixes don't affect bundle, but run to ensure root/docs sync
    - Run: node scripts/smoke_test.mjs — 35 texts, 0 crashes, plus W1 rule suite OK, source-preservation 35 files match base
    - Run: diff -rq data docs/data — must PASS byte-identical
    - Run: git diff --exit-code -- app_data.js docs data/project_metrics.json — must PASS (structural diff)
    - Confirm: all work pushed; git status clean
    - Confirm: translator_profiles count 14/6+1 visible in README
    - Confirm: census 50/39/23/17 visible in ROADMAP, vision, RESEARCH
    - Confirm: HANDOFF 58 sites
    - Confirm: STATE.md wording fixed
    - Confirm: validator docstring lists extended scan set

15. PR DESCRIPTION REQUIREMENTS
    - Summary: Fix D-1..D-4 doc-precision + O-1 full + O-2 + O-3 per Pack 1 2026-09-13 rulings
    - For each D/O, cite file:line before/after and measurement command
    - D-1: explain conflation fix, keep sha256s, keep command, clarify file integrity vs reproduction output
    - D-2: show Counter(evidence_source) 14/6+1
    - D-3: show old vs new docstring
    - D-4: show 41+17=58 inventory: `grep -n "style=" app.js | wc -l` and `grep -n "\.style\." app.js | wc -l`
    - O-1: list 9 stale lines updated, show `python3` count 50/39/23/17, show gate PINs added and scan set extended to WEB_VISION and RESEARCH
    - O-2: show self-validation code snippet and test that incomplete verified_quotation raises
    - O-3: show old vs new quality.yml diff command and that it covers 4 mirror files structurally
    - Test results: py_compile, validate_data, build_data_bundle, smoke_test, diff -rq, structural diff
    - Breaking changes: none (docs-only + pipeline hardening)
    - Safety/impact: no corpus re-key, no status change, no rights decision, no CBETA commit
    - Include `#### Session Irregularities` per §16

16. HARDENING REPORT — Session Irregularities (thresholded, low-cost)
    In PR description under heading `#### Session Irregularities`, report significant irregularities per Hardening Loop threshold (cost >10min, blocked progress, required workaround, reveals recurring invariant). If none significant, write `None significant` (optionally one sentence, e.g., `No irregularity met the threshold; sync and checkpoints worked as written.`). If significant, per row/bullet format: Category | Symptom | Impact | Workaround | Hardening candidate. Do not pad with trivial retries.

