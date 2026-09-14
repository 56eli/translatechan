0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/008-web-polish-and-validation-depth.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Read /tmp/task.md fully. Halt if empty or title mismatches.
   Verify main is 766b97c (Phase B complete) via git rev-parse origin/main.

1. TASK TITLE AND SCOPE
   Web polish bundle + P2.7 validation depth + lineage documentation: clear the low/medium queue so W1 per-doc remediation and human-readable overhaul can proceed without doc drift. One PR, docs-only + scripts enhancement + static asset, no corpus re-key, no workflow edit.

2. REQUIRED READING ORDER
   - /tmp/state.md — canonical tracker .orchestrator/STATE.md, main 766b97c, Task Queue 010 remaining deferred
   - .orchestrator/STATE.md — Standing Decisions 2026-09-12 four rulings (R1 CITATION one PR done #43, R2 ledger stays 630, R3 RE-KEY/LABEL one doc per PR, R4 OUT-OF-CBETA human only)
   - .orchestrator/PHASE2_PLAN.md §5-§7 — kind census LABEL 51 / RE-KEY 11 / CITATION 6 / HUMAN-SOURCE 2 / NONE 6, OUT-OF-CBETA 31-doc queue (no agent work)
   - HANDOFF.md §5 — release blockers: artifact-diff gaps, branch protection, bundle init, inline-style retired, JSON Schema not executed, presentation gaps
   - OPERATIONS.md — Edit 1 structurally closed via O-3 (git diff --exit-code -- app_data.js docs data/project_metrics.json), Edit 2 checkout v4→v7 setup-python v5→v7 setup-node v4→v7 (owner-controlled, annotated deprecated Node20), Edit 3 branch protection 403 (owner verification)
   - ROADMAP.md — P3.8-P3.11 web polish items
   - vision.md / AUDIT.md — JSON Schema declarative only, Python validator enforced contract
   - schemas/translatechan-data.schema.json — declarative schema (P2.7 gap: not executed)
   - scripts/validate_data.py — current validator, doc-truthfulness gate (50/39/23/17 census), cross_refs unvalidated, evidence_source enum absent
   - scripts/test_source_review_rules.py — 120 checks, §15 orphan note gate
   - index.html — CSP meta style-src 'self' https://fonts.googleapis.com without unsafe-inline (Phase3), og:image meta points to og-image.svg only
   - app_data.js / docs/ — bundle 1,642,473 B, total shipped raw ~1.92MB <2MB
   - docs/audits/ — exists with copies of sessions files, but split vs sessions/ undocumented
   - response_summary.md — root file, 7399 B, disposable per HANDOFF §9, should not be permanent
   - AGENTS.md — no .github/workflows edits without owner approval, internal IDs stay, 5 rooms smoke-guarded

3. PROJECT CONTEXT AND OWNER VISION
   Phase A (D-1..D-4, O-1..O-3) and Phase B Pages revamp (Phases 1-4) merged to main 766b97c. Owner quote: "Light dark and desktop mobile is functional, however the user experience on the website is insufficient. The layout is really bad for a human reader. Overhauling the website for a human-readable, easy-of-use, welcoming space is highest priority. Consider that AI agents are limited in their ability and heavily rely on user feedback to forge that vision."
   Per user instruction 2026-09-14, we first clear the queue by bundling safe tasks, then return to live human-readable page. This prompt bundles web polish + validation depth + lineage docs that are safe to do in one PR without touching corpus Chinese or workflows.
   Vision: walnut hall preserved, English-first, sophisticated minimal, no gimmicks, humor only in Robo names. Bundle budget <2MB stays.

4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES
   - Canonical tracker .orchestrator/STATE.md, Checkpoint-C verbatim recorded (colors acceptable, rest replaceable, serif, subordinate except Reader, lazy, full plan).
   - Public scope exactly 5 rooms, internal IDs translatechan_* / window.TranslateChan / TRANSLATECHAN_DATA stay, brand Fake Chan Factory.
   - Pipeline fixed: data/ → validate_data.py → project_metrics.json → build_data_bundle.py → root + docs mirror, 5 gates + structural diff.
   - Current gates on main 766b97c: py_compile PASS, validate_data PASS 3 lineage warnings, build 1,642,473 B, smoke 35 texts + lazy + source-preservation, diff -rq PASS, structural diff PASS, 120 checks PASS, 0 style=, CSP without unsafe-inline, tokens 43.
   - Rulings: R1 CITATION one PR done, R2 630 stays authoritative, R3 RE-KEY/LABEL one doc per PR (forbids batching multiple docs), R4 OUT-OF-CBETA human only, no agent fetch/transcription.
   - OPERATIONS.md Edits 2-3 are owner-controlled per AGENTS.md §6, agents must not edit .github/workflows/* without explicit owner approval — therefore Edit 2/3 remain owner tasks, documented not executed.
   - response_summary.md is disposable per HANDOFF §9 and §11 — its presence at root is technical debt from 2026-09-10 session.
   - docs/audits/ contains 19 files (COLLATION_REGISTER_*, COLLATION_W1_*, AUDIT_RESPONSE_*, etc.) that are copies/mirrors of sessions/ evidence but split is undocumented — P3 gap.
   - og-image.svg exists (4,728 B redrawn to gate system), og-image.png does NOT exist — PNG fallback recommended per HANDOFF §5 presentation.
   - SECURITY.md does NOT exist — GitHub security policy gap (P3.10).
   - P2.7 gaps: JSON Schema not executed, cross_refs (data/gongan cross refs? lineage cross?) unvalidated, evidence_source enum absent (translation provenance).
   - Lineage: 34 masters / 30 edges, 3 profiles lack linked_corpus_keys (prajnatara, yangqi_fanghui, dahong_zuzheng — frontier scaffolds, reviewed 2026-09-09), all 30 edges traditional_link_pending_exact_locator — later tranche groundwork.

5. CORE OBJECTIVE
   Bundle safe, non-corpus, non-workflow tasks into one PR to clear queue:
   - Remove response_summary.md from root (or move to sessions/ and add to .gitignore), document as disposable.
   - Document docs/audits/ vs sessions/ split in AUDIT.md and HANDOFF.md (audits/ is Pages-deployable mirror of selected sessions/ evidence for public audit trail, sessions/ is append-only source).
   - Add SECURITY.md (minimal, no email, GitHub security advisory process).
   - Generate PNG fallback for og-image.svg: create og-image.png (root) and docs/og-image.png via build_data_bundle.py or checked-in asset, update index.html og:image + twitter:image to include PNG fallback or keep SVG primary + add PNG secondary meta, ensure build_data_bundle.py mirrors it and OPERATIONS Edit 1 coverage includes it.
   - P2.7 validation depth: execute JSON Schema (schemas/translatechan-data.schema.json) in validate_data.py if jsonschema library available, else document as optional and add cross_refs validation (gongan cross-refs exist, lineage edges) and evidence_source enum check (if field exists). Do NOT weaken existing validator, only add checks.
   - Lineage documentation: ensure HANDOFF.md / AUDIT.md / ROADMAP.md correctly state 3 frontier scaffolds lack linked_corpus_keys by design (no active-corpus occurrence) and 30 edges pending exact locator is later tranche, not a bug.
   - OPERATIONS.md: record that Edit 1 is closed structurally via O-3 (git diff --exit-code -- app_data.js docs data/project_metrics.json), Edit 2/3 remain owner-held, no agent edit attempted.
   - Update README.md / HANDOFF.md interface section to reflect 0 style=, CSP without unsafe-inline, bundle <2MB, PNG fallback, SECURITY.md exists.
   All in one PR, docs-only + scripts enhancement + static asset.

6. EXACT DELIVERABLES
   - Delete: response_summary.md from root (if policy says disposable, remove; add to .gitignore if needed, or move its content to sessions/RESPONSE_SUMMARY_2026-09-10.md if not already there — check sessions/ for existing file).
   - Modify: .gitignore — add response_summary.md to ignore list if not present.
   - Create: SECURITY.md — minimal policy: report via GitHub Security Advisories, no email, supported versions main only, no bounty, reference AGENTS.md for agent contract.
   - Create: og-image.png (root) + docs/og-image.png — PNG fallback rendered from og-image.svg (use python cairosvg or rsvg-convert or node sharp if available, else commit a pre-rendered PNG via base64 decode of existing SVG rasterization — ensure deterministic). Size target ~1200x630, <100KB. Update build_data_bundle.py mirror list to include og-image.png if not already (check line 104).
   - Modify: index.html — keep og:image SVG primary, add second og:image meta for PNG fallback (or change primary to PNG for better compatibility, keep SVG as secondary) and twitter:image to PNG. Ensure CSP img-src 'self' data: already allows.
   - Modify: scripts/validate_data.py — add P2.7 depth:
     * Try import jsonschema, if available validate data/corpus/*.json + data/corpus_manifest.json + data/project_metrics.json against schemas/translatechan-data.schema.json (draft 2020-12), report errors but do not fail if library missing (print warning).
     * Add cross_refs validation: if data/gongan/ or data/lineage/ contains cross references, verify they point to existing corpus keys / gongan keys.
     * Add evidence_source enum check: if translations/provenance contains evidence_source, ensure enum is known (e.g., 'edition', 'colophon', 'external', etc.) — log warning if unknown, do not fail hard unless clearly invalid.
     * Keep existing doc-truthfulness gate (50/39/23/17 census, etc.) intact, extend scan set if needed to include new SECURITY.md? No, keep scan set as is.
   - Modify: scripts/test_source_review_rules.py — add check that SECURITY.md exists, og-image.png exists, response_summary.md does NOT exist at root, docs/audits/ documented.
   - Modify: AUDIT.md — add paragraph documenting docs/audits/ vs sessions/: audits/ is selected public mirror for Pages deployment (19 files), sessions/ is full append-only evidence (including private working notes). Both are evidence, not current instructions.
   - Modify: HANDOFF.md — §5 presentation: update PNG fallback from "recommended" to "present: og-image.svg + og-image.png fallback, meta includes both"; §9 repo map: add SECURITY.md, og-image.png, docs/audits/ description; §11 documentation rule: add SECURITY.md role, response_summary.md disposable, audits/ vs sessions/ split; §4 measured snapshot: update bundle size after PNG addition (ensure <2MB raw still).
   - Modify: README.md — if it mentions social card, update to mention PNG fallback.
   - Modify: ROADMAP.md — mark P3.8-P3.11 items done: response_summary.md removed, audits/ vs sessions/ documented, SECURITY.md added, PNG fallback present, 3 lineage profiles documented as frontier scaffolds (not bug), 30 edges pending documented as later tranche.
   - Modify: OPERATIONS.md — add note: Edit 1 closed structurally via O-3 (PR #45), verified on main 766b97c with git diff --exit-code -- app_data.js docs data/project_metrics.json; Edit 2/3 remain owner-held, no agent edit attempted per AGENTS.md §6.
   - Rebuild: python3 scripts/build_data_bundle.py — must regenerate app_data.js + docs mirror, include og-image.png in docs/ mirror, ensure docs/data/ still byte-identical to data/.

7. SUB-TASK BREAKDOWN AND CHECKPOINTS
   1. Measure current state: ls response_summary.md, ls SECURITY.md, ls og-image.png, ls docs/audits/, grep og:image index.html, python3 -m py_compile — commit + push
   2. Remove response_summary.md, update .gitignore — commit + push
   3. Create SECURITY.md — commit + push
   4. Generate og-image.png root + docs/ + update build_data_bundle.py mirror list if needed — commit + push
   5. Update index.html og:image meta to include PNG fallback — commit + push
   6. Enhance validate_data.py with P2.7 depth (jsonschema optional, cross_refs, evidence_source enum) — commit + push
   7. Update test_source_review_rules.py with new assertions (SECURITY.md, PNG, no response_summary, audits/ documented) — commit + push
   8. Document audits/ vs sessions/ split in AUDIT.md + HANDOFF.md + README.md + ROADMAP.md + OPERATIONS.md Edit 1 closure note — commit + push
   9. Full gates: py_compile, validate_data, build_data_bundle, smoke_test, diff -rq, structural diff, test_source_review_rules — commit + push final

8. BRANCH AND TARGET
   Base: main (766b97c)
   Target: chore/web-polish-and-validation-depth
   Orchestrator: arena/01a09829-translatechan
   Align HEAD:
     git fetch --depth 50 origin +chore/web-polish-and-validation-depth:refs/remotes/origin/_resume || true
     git checkout -B chore/web-polish-and-validation-depth refs/remotes/origin/_resume 2>/dev/null || git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B chore/web-polish-and-validation-depth origin/main

9. WORK PERSISTENCE AND PUSH CADENCE
   After each sub-task: git add -A && (git diff --cached --quiet || git commit -qm "chore: <sub-task>") && git push -qu origin chore/web-polish-and-validation-depth
   Open ONE PR at end from chore/web-polish-and-validation-depth to main.

10. TECHNICAL REQUIREMENTS
    - Keep 5 rooms, internal IDs, CSP script-src self, no inline handlers, data-* delegation.
    - Keep bundle <2MB raw (PNG <100KB, total raw ~1.92MB + PNG <2.1MB still ok, but aim <2MB; if PNG pushes over, document and note in PR).
    - 0 style= literals, CSP without unsafe-inline (already).
    - Keep responsive, reduced-motion, focus-visible, lang="zh".
    - No corpus Chinese re-key, no 630 re-designation, no workflow edits.
    - PNG generation must be deterministic (same bytes on rebuild) — use fixed version of conversion or commit static PNG.
    - SECURITY.md minimal, no PII.
    - validate_data.py enhancement must not break existing gates when jsonschema not installed — warn only.
    TEST_COMMAND: python3 scripts/validate_data.py
    INTEGRATION_TEST_COMMAND: python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs
    FULL_SUITE_COMMAND: python3 -m py_compile scripts/*.py && python3 scripts/validate_data.py && python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs && diff -rq data docs/data && git diff --exit-code -- app_data.js docs data/project_metrics.json && python3 scripts/test_source_review_rules.py

11. SAFETY AND COMPATIBILITY RULES
    - Must NOT break 5 gates, must NOT change data/corpus/*.json (no Chinese), no rights_manifest change, no 630 re-designation.
    - Must NOT edit .github/workflows/* (Edit 2/3 owner-held).
    - Must NOT generate source-looking Classical Chinese.
    - Must NOT fetch CBETA or OUT-OF-CBETA witnesses.
    - Keep docs/ mirror generated by build_data_bundle.py, no hand edits under docs/ except via build.
    - Keep sessions/ append-only, do not delete evidence files.

12. CLEANUP RULES
    No commented code, debug logs, TODO, scratch scripts. Clean worktree.

13. STRICT BOUNDARIES / OUT OF SCOPE
    - Do not push to orchestrator branch arena/01a09829-translatechan.
    - Do not touch data/corpus/ (W1 queue separate, one doc per PR).
    - Do not edit .github/workflows/ (Edit 2/3 owner tasks).
    - Do not re-key platform_sutra (owner decision pending).
    - Do not fetch OUT-OF-CBETA witnesses (31-doc queue human only).
    - Do not change tokens, serif, gate structure, Reader sheet — web polish only, no visual-system reset.
    - Do not add framework, backend, external JS.

14. QUALITY CHECKS
    - python3 -m py_compile scripts/*.py — PASS
    - python3 scripts/validate_data.py — PASS (3 lineage warnings expected, plus optional jsonschema warnings if library missing)
    - python3 scripts/build_data_bundle.py — PASS, 1,642,473 B app_data.js + docs mirror including og-image.png
    - node scripts/smoke_test.mjs — PASS 35 texts + source-preservation + render-lazy + new assertions (SECURITY.md exists, PNG exists, no response_summary at root)
    - diff -rq data docs/data — PASS
    - git diff --exit-code -- app_data.js docs data/project_metrics.json — PASS (structural diff O-3)
    - python3 scripts/test_source_review_rules.py — 120+ checks PASS (new checks added)
    - Confirm: response_summary.md absent at root, .gitignore contains it, SECURITY.md exists, og-image.png exists root+docs, index.html og:image includes PNG, docs/audits/ documented in AUDIT.md/HANDOFF.md, OPERATIONS.md Edit 1 closed note, bundle <2MB raw (or documented if slightly over due to PNG).

15. PR DESCRIPTION REQUIREMENTS
    - Summary: web polish bundle + P2.7 validation depth + lineage docs
    - Before/after measurements: response_summary.md present→absent, SECURITY.md absent→present, og-image.png absent→present (size), docs/audits/ undocumented→documented, validate_data.py depth added, bundle sizes
    - Preserve vs Change: preserve 5 rooms, internal IDs, CSP, tokens, serif, bundle pipeline; change docs, SECURITY.md, PNG fallback, validator depth, .gitignore
    - Test results: py_compile, validate_data, build_data_bundle, smoke_test, diff -rq, structural diff, test_source_review_rules — all PASS with outputs pasted
    - Safety: no corpus Chinese change, no 630 re-designation, no workflow edit, no CBETA fetch
    - Breaking changes: none (docs + asset + validator enhancement)
    - Session Irregularities: thresholded or None significant, note any sandbox rewind hazard if encountered

16. HARDENING REPORT — Session Irregularities
    Record any rewind hazard, credential drop, branch mismatch, or measurement drift. Note that target branch chore/web-polish-and-validation-depth is advisory, session fixed to arena/* per AGENTS.md.
