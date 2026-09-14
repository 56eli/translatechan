0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/003-record-checkpoint-c-and-dahui-disclosure.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   git clone --depth 1 https://github.com/56eli/temp /tmp/tc-pack
   cp /tmp/tc-pack/TC-PACK-1-ENGAGEMENT.md /tmp/pack1.md
   cp /tmp/tc-pack/TC-PACK-2-FINDINGS-EVIDENCE.md /tmp/pack2.md
   Read /tmp/task.md fully. Do not checkout orchestrator paths into worktree. Halt if empty or title mismatches.

1. TASK TITLE AND SCOPE
   Record Checkpoint-C answers (C-1..C-5) verbatim into .orchestrator/STATE.md and fix dahui_hongzhi disclosure (014b-2).
   Complete this in ONE pull request.

2. REQUIRED READING ORDER
   - /tmp/state.md — working state, canonical tracker .orchestrator/STATE.md, rulings, active milestone Phase B ready
   - /tmp/pack1.md Part A — scope Phase B Pages revamp top priority, proposal-first
   - .orchestrator/PAGES_REVAMP_PROPOSAL_2026-09-13.md — proposal §10 Checkpoint-C questions C-1..C-5
   - .orchestrator/STATE.md Continuation block Immediate next task 014b item 2 — dahui_hongzhi disclosure requirement
   - data/corpus/dahui_hongzhi.json — current cbeta_id T1998A (大慧普覺禪師語錄) and cbeta_note "Corrected 2026-08-08: dropped unverified '/T2001' pairing..."
   - data/corpus_manifest.json entry for dahui_hongzhi — cbeta "T1998A / T1998B + T48n2001 (宏智禪師廣錄, 默照銘)"
   - sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json — dahui_hongzhi witness ['T47n1998A','T47n1998B','T48n2001'] 0/6 collate, witness_note "Hongzhi's Mozhaoming lives in T2001 Hongzhi guanglu, not claimed T1998A"
   - scripts/collate_corpus.py WITNESS map note for dahui_hongzhi
   - HANDOFF.md, README.md, AUDIT.md — must keep W1 ledger and rights separation sentences
   - Owner answers from 2026-09-13 (recorded verbatim in orchestrator working state hardening log and in ask_user answers): C-1 "Colors are acceptable. Everything else can be adapted as seen fit, even fully replaced if suited."; C-2 (a) scholarly serif; C-3 (a) subordinate except Reader; C-4 (a) render-lazy only; C-5 (a) full plan incl PR-B/PR-D fold-in; plus "I merged. Continue with plain word, guided questioning."

3. PROJECT CONTEXT AND OWNER VISION
   Fake Chan Factory zero-backend static SPA, 5 rooms, walnut hall, 58 inline-style sites, CSP unsafe-inline load-bearing. Phase A doc fixes merged (PR #45) and proposal merged (PR #46, main a1ebcef). Owner confirmed Pages revamp direction: colors acceptable, everything else adaptable/replaceable, serif, subordinate, lazy, full scope. Before any code, answers must be recorded verbatim in canonical tracker .orchestrator/STATE.md per proposal discipline. Also predecessor task 014b-2 still open: dahui_hongzhi manifest vs document disclosure mismatch — document says dropped T2001, manifest says T1998A/B + T48n2001. Must disclose bibliographic pairing and 0/6 collation per invariant "harness probing ≠ collating". Owner Vision Context: honesty — no witness claim without collation evidence; dahui_hongzhi T48n2001 is bibliographic exception.

4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES
   - Canonical tracker .orchestrator/STATE.md per DR-3.
   - DR-1 CBETA pinned revision read-only.
   - Owner answers 2026-09-13 verbatim: C-1 Colors are acceptable. Everything else can be adapted as seen fit, even fully replaced if suited.; C-2 (a) scholarly serif; C-3 (a) subordinate; C-4 (a) render-lazy; C-5 (a) full plan; plus merge confirmations.
   - Invariant: harness probing ≠ collating — cite no work as witness unless ≥1 evaluated content field matches; dahui_hongzhi 0/6 is recorded exception, bibliographic.
   - Dahui_hongzhi: manifest cbeta T1998A / T1998B + T48n2001, document cbeta_id currently T1998A only, cbeta_note says dropped T2001 — mismatch. Witnesses ['T47n1998A','T47n1998B','T48n2001'], 0/6 collate, witness_note "Hongzhi's Mozhaoming lives in T2001 Hongzhi guanglu, not claimed T1998A".
   - No corpus source text re-key in this task — only disclosure notes and cbeta_id.
   - No re-designation 630→532.
   - Sessions append-only.
   - No workflow edits.
   - Internal IDs stay, 5 rooms only, pipeline fixed, 5 gates pass.

5. CORE OBJECTIVE
   - Record Checkpoint-C answers verbatim into .orchestrator/STATE.md under new section "## Checkpoint-C — Pages Revamp Direction (2026-09-13, owner)" with date and verbatim answers, plus update Task Queue to reflect direction confirmed and next slice.
   - Fix dahui_hongzhi disclosure: update data/corpus/dahui_hongzhi.json cbeta_id to name all three works or state covers 看話書問 letters only, and cbeta_note to disclose T48n2001 pairing is bibliographic from collate_corpus.py witness note and 0/6 evaluated content fields collate in any of three witnesses.
   - Ensure validator still passes (3 lineage warnings), bundle rebuild, smoke, diff.

6. EXACT DELIVERABLES
   - Modify: .orchestrator/STATE.md — add section after Standing Decisions (2026-09-12) and before Task Queue:
     ```
     ## Checkpoint-C — Pages Revamp Direction (2026-09-13, owner — proposal PR #46)
     - Date: 2026-09-13
     - Source: owner answers to C-1..C-5 via structured questions, recorded verbatim
     - C-1 Visual intensity: "Colors are acceptable. Everything else can be adapted as seen fit, even fully replaced if suited." (owner custom)
     - C-2 English typographic voice: "(a) Scholarly serif for hook/headings/translations, sans for controls" + sub-decision self-hosted vs Google-served pending? Owner selected (a) scholarly serif.
     - C-3 Chinese/English balance: "(a) Present but subordinate everywhere except inside the Reader sheet where it is largest"
     - C-4 Performance strategy: "(a) Render-lazy only — keep one bundle, hidden rooms render on first activation"
     - C-5 Scope/sequencing: "(a) Full plan: system+masthead → Reader → secondary rooms → CSP tightening → evidence, fold PR-B/PR-D"
     - Additional: "I merged. Continue with plain word, guided questioning."
     - Implication: colors #2c2523 walnut etc acceptable, everything else may be replaced if suited; serif chosen; subordinate; lazy; full plan.
     ```
     Also update Task Queue: mark visual-system reset as unblocked and next is Phase 1 system+masthead per full plan.
   - Modify: data/corpus/dahui_hongzhi.json — cbeta_id: change from "T1998A (大慧普覺禪師語錄)" to either "T47n1998A / T47n1998B + T48n2001 (大慧普覺禪師語錄 + 宏智禪師廣錄, 默照銘)" or "T47n1998A (大慧普覺禪師語錄, 看話書問 letters)" with note that T48n2001 is bibliographic; cbeta_note: replace "Corrected 2026-08-08: dropped unverified '/T2001' pairing; the 看話書問 (letters) material is the 示/答 sections of the 語錄 itself (T47n1998A)." with disclosure: "Bibliographic pairing T48n2001 (宏智禪師廣錄, 默照銘) from scripts/collate_corpus.py witness note 'Hongzhi's Mozhaoming lives in T2001 Hongzhi guanglu, not claimed T1998A' — 0 of 6 evaluated content fields collate in any of the three witnesses T47n1998A, T47n1998B, T48n2001 (harness probing ≠ collation, invariant 1). The 看話書問 letters are the 示/答 sections of T47n1998A; the 默照銘 tail is not represented as collated source text."
   - Modify: data/corpus_manifest.json — ensure cbeta field already "T1998A / T1998B + T48n2001 (宏智禪師廣錄, 默照銘)" stays (already correct) — do not change status (still partial_or_failed_w1_collation)
   - Modify: data/project_metrics.json — regenerated if needed via build? Actually metrics generated by validate_data.py --write-metrics? But per pipeline, validate_data generates metrics; ensure still passes.
   - Modify: app_data.js + docs/ mirror — rebuild via build_data_bundle.py (byte-identical except dahui_hongzhi disclosure change will change bundle bytes — that's expected, and bundle will be regenerated)
   - Ensure: no other corpus files changed.

7. SUB-TASK BREAKDOWN AND CHECKPOINTS
   1. Measure dahui_hongzhi current state and manifest vs document mismatch — commit + push
   2. Update .orchestrator/STATE.md with Checkpoint-C verbatim answers section — commit + push
   3. Fix data/corpus/dahui_hongzhi.json cbeta_id and cbeta_note per disclosure spec — commit + push
   4. Run validator, build bundle, smoke, diff — commit + push
   5. Final PR description

8. BRANCH AND TARGET
   Base branch: main
   Target branch: fix/dahui-disclosure-and-checkpoint-c
   Orchestrator branch: arena/01a09829-translatechan
   Dependencies: PR #45 and #46 merged (main a1ebcef) — base is now a1ebcef
   Resuming: fresh branch from main
   Align HEAD:
     git fetch --depth 50 origin +fix/dahui-disclosure-and-checkpoint-c:refs/remotes/origin/_resume
     git checkout -B fix/dahui-disclosure-and-checkpoint-c refs/remotes/origin/_resume
   If not found:
     git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B fix/dahui-disclosure-and-checkpoint-c origin/main

9. WORK PERSISTENCE AND PUSH CADENCE
   Checkpoint after each sub-task, before long ops, and at end.
   git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin fix/dahui-disclosure-and-checkpoint-c
   Open ONE PR at end when gates pass.
   Sync rule: rebase before first push only, merge after.

10. TECHNICAL REQUIREMENTS
    Language: JSON + Markdown + Python, follow existing style.
    For STATE.md: add new section verbatim owner answers, keep existing structure, do not reword.
    For dahui_hongzhi.json: ensure JSON valid, cbeta_id and cbeta_note updated honestly, no source text re-key (zh fields untouched), zh_chars unchanged? Actually cbeta_note change may affect all-string CJK count? cbeta_note is English, so CJK unchanged, but metrics may need regen.
    TEST_COMMAND: python3 scripts/validate_data.py — PASS
    INTEGRATION_TEST_COMMAND: python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs — PASS
    FULL_SUITE_COMMAND: py_compile + validate + build + smoke + diff -rq data docs/data + structural diff git diff --exit-code -- app_data.js docs data/project_metrics.json
    COVERAGE_COMMAND: not configured
    MUTATION_TEST_COMMAND: python3 scripts/test_source_review_rules.py — 120 checks PASS
    LINT_COMMAND: not configured
    BUILD_COMMAND: python3 scripts/build_data_bundle.py

11. SAFETY AND COMPATIBILITY RULES
    - Must NOT re-key source text (no R-A).
    - Must NOT change completion_status or source_review_status.
    - Must NOT re-designate 630.
    - Must NOT edit sessions/.
    - Must NOT break 5 gates.
    - Must keep internal IDs, 5 rooms.

12. CLEANUP RULES
    No commented code, debug logs, TODO. No unrelated file mods. No /tmp artifacts. Clean worktree.

13. STRICT BOUNDARIES / OUT OF SCOPE
    - Do not push to orchestrator branch.
    - Do not start Pages revamp code (only STATE.md + dahui disclosure).
    - Do not edit workflows.
    - Do not fetch CBETA.

14. QUALITY CHECKS
    - py_compile PASS
    - validate_data PASS (3 lineage warnings)
    - build_data_bundle PASS
    - smoke_test PASS 35 texts
    - diff -rq data docs/data PASS
    - structural diff PASS
    - Confirm STATE.md contains verbatim Checkpoint-C answers and new section
    - Confirm dahui_hongzhi.json cbeta_note discloses bibliographic pairing and 0/6

15. PR DESCRIPTION REQUIREMENTS
    - Summary: Record Checkpoint-C answers verbatim + fix dahui_hongzhi disclosure (014b-2)
    - Owner answers verbatim list C-1..C-5 + "I merged. Continue with plain word..."
    - Dahui disclosure before/after file:line, measurement of 0/6 collation
    - Test results
    - Breaking changes none
    - Safety: no source re-key, no status change, disclosure-only
    - Session Irregularities

16. HARDENING REPORT — Session Irregularities
    Report thresholded irregularities or None significant.

