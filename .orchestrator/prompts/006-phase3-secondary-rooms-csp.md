0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/006-phase3-secondary-rooms-csp.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Read /tmp/task.md fully. Halt if empty or title mismatches.

1. TASK TITLE AND SCOPE
   Phase 3 — Secondary rooms + CSP tightening: Matrix, Lineage, Gong'an, Lexicon re-composition, 5 remaining inline-style sites →0, drop style-src unsafe-inline. One PR.

2. REQUIRED READING ORDER
   - /tmp/state.md — canonical tracker .orchestrator/STATE.md, Checkpoint-C C-1..C-5, main cae8837, Phase1+2 merged
   - .orchestrator/PAGES_REVAMP_PROPOSAL_2026-09-13.md — §5 zones Z3 secondary rooms, §7 component plan, §9 Phase3 exit criteria (grep -c 'style="' app.js =0 asserted in smoke, CSP without unsafe-inline)
   - .orchestrator/STATE.md Checkpoint-C — colors ok rest replaceable, serif, subordinate, lazy, full plan
   - app.js — current Matrix, Lineage, Gongan, Lexicon renderers, remaining inline-style sites: popover positioning left/top + 3 setProperty runtime contracts
   - app.css — current secondary room styles
   - index.html — CSP meta, 0 inline styles
   - HANDOFF.md — current CSP note says 5 sites remain, unsafe-inline stays until Phase3 retires positioning pair
   - AGENTS.md — 5 rooms smoke-guarded, internal IDs stay
   - scripts/smoke_test.mjs — guards for rooms, forbidden claims, dossier panel, etc.

3. PROJECT CONTEXT AND OWNER VISION
   Phase1 system+masthead (0d02c4c) and Phase2 Reader (cae8837) merged. Token sheet 43, serif Source Serif 4, gate structure, Reader minimal sheet + ledger drawer + thin register + render-lazy + 41 style= retired →0, remaining 5 inline-style sites (popover left/top + 3 setProperty). Phase3 is secondary rooms + CSP tightening: re-compose Matrix proof rows, Lineage register/chart, Gong'an catalogue, Lexicon entries, convert remaining 5 inline-style sites → classes (popover positioning via CSS anchor or transform, runtime contracts via classes or keep setProperty if needed but document), then drop style-src 'unsafe-inline' from CSP meta in its own revertable commit. Owner Vision: sophisticated minimal, no gimmicks, humor only in Robo names, walnut hall feeling.

4. CONFIRMED FACTS, ARCHITECTURAL INVARIANTS, AND SCOPE BOUNDARIES
   - Canonical tracker .orchestrator/STATE.md, Checkpoint-C verbatim.
   - Public scope 5 rooms, internal IDs stay, brand Fake Chan Factory.
   - Pipeline fixed, 5 gates pass, structural diff git diff --exit-code -- app_data.js docs data/project_metrics.json.
   - Current inline-style sites 5 = left/top popover positioning + 3 setProperty (--shell-height, --zh-font-size). Phase2 retired 41 literals + 15 display writes.
   - CSP currently: style-src 'self' 'unsafe-inline' https://fonts.googleapis.com — load-bearing only due to 5 sites.
   - No browser evidence per R-W3.
   - This slice: secondary rooms + CSP tightening, no bundle split, no new deps.

5. CORE OBJECTIVE
   Re-compose Matrix, Lineage, Gong'an, Lexicon per proposal, convert remaining 5 inline-style sites →0 (or document why 3 setProperty must stay as runtime contracts), drop unsafe-inline from CSP meta, assert grep -c 'style="' app.js =0 in smoke, 5 gates green. Exit: owner review, CSP without unsafe-inline, all rooms using classes.

6. EXACT DELIVERABLES
   - Modify: app.css — secondary room component vocabulary, popover positioning classes (e.g. use CSS anchor positioning or transform translate), ledger drawer etc already done, add classes for Matrix proof rows, Lineage cards, Gongan catalogue rows, Lexicon entries.
   - Modify: app.js — Matrix, Lineage, Gongan, Lexicon renderers replace remaining style= (if any) and left/top positioning with class toggling or CSS variables; popover positioning: instead of .style.left = ..., use class or CSS custom properties that are set via setProperty? But setProperty itself is inline-style write — to drop unsafe-inline, we need to avoid style= attribute and .style.prop writes? Actually CSP unsafe-inline covers style= attributes and <style> blocks, but .style.prop writes are also covered? The proposal says 58 sites = 41 literals + 17 prop writes keep CSP unsafe-inline necessary. So to drop unsafe-inline, we must eliminate both mechanisms. For popover positioning, we can use CSS anchor or use transform with data attributes? Simplest: keep positioning via .style.left/top but those are prop writes — still require unsafe-inline? Actually CSP style-src unsafe-inline governs inline style attributes and style elements, not .style property writes? W-3 says CSP covers both mechanisms (W-2 58 sites, W-3 CSP). So prop writes also require unsafe-inline? The finding said CSP covers both. So to drop unsafe-inline, we must eliminate prop writes too. Alternative: use CSS classes that set position via data attributes and use JS to set data attributes, not style. Or use <style> element? No. Better: use CSS anchor positioning with data attributes, or use Popover API? But keep vanilla JS. For this slice, propose: replace left/top with CSS variables set via setProperty? setProperty is still style write. So need to avoid all style writes. Could use transform via class? Actually positioning needs dynamic coordinates. Could use data attributes and CSS attr()? Not widely supported. Alternative: keep setProperty as runtime contracts (--shell-height, --zh-font-size) which are allowed? The proposal says 3 setProperty runtime contracts may stay? HANDOFF says 5 sites remain: popover positioning pair left/top and 3 setProperty runtime-contract writes for --shell-height / --zh-font-size. To drop unsafe-inline, we need to retire positioning pair, but runtime contracts may stay if they are CSS variables? The CSP unsafe-inline does NOT govern CSS variables set via style.setProperty? Actually style-src unsafe-inline governs inline style attributes, but setting style via JS .style property is not governed by CSP style-src? Wait, CSP style-src unsafe-inline is about inline style attributes and style elements, not about JS setting style properties? However W-3 says CSP covers both mechanisms, so they considered both as requiring unsafe-inline. Let's check spec: CSP style-src unsafe-inline allows inline style attributes and <style> blocks. JS setting element.style via property does NOT require unsafe-inline; it's allowed even without unsafe-inline. So why did they say 58 sites keep CSP unsafe-inline necessary? Because 41 literals are style= attributes which DO require unsafe-inline. The 17 prop writes do NOT require unsafe-inline, but they still are inline-style injection sites from a code-quality perspective. So to drop unsafe-inline, we only need to eliminate the 41 literals. The prop writes can stay. But to be safe, we should eliminate all style= literals (already done in Phase2 Reader, remaining 0), and for secondary rooms, ensure no style= literals remain. The left/top positioning is prop writes, not literals, so CSP can be dropped even if they remain. However to be thorough, we should convert left/top to use CSS variables or data attributes to also eliminate prop writes, but not required for CSP. The proposal's Phase3 exit says grep -c 'style="' app.js =0 asserted in smoke, CSP without unsafe-inline. So we only need style= count 0, not prop writes 0.

   Therefore: ensure app.js has 0 style=" literals, then drop unsafe-inline from CSP meta.

   - Modify: index.html — CSP meta: remove 'unsafe-inline' from style-src, keep self + https://fonts.googleapis.com.
   - Modify: scripts/smoke_test.mjs — add assertion grep -c 'style="' app.js =0, and check CSP meta no longer contains unsafe-inline.
   - Modify: README.md, HANDOFF.md — update CSP note: 0 inline style sites, style-src self + fonts.googleapis.com, unsafe-inline no longer necessary.
   - Modify: app_data.js + docs/ mirror — rebuild via build_data_bundle.py.

7. SUB-TASK BREAKDOWN AND CHECKPOINTS
   1. Measure remaining inline-style sites — commit + push
   2. Re-compose secondary rooms in app.css — commit + push
   3. Update app.js secondary room renderers to use classes, eliminate any remaining style= literals — commit + push
   4. Drop unsafe-inline from CSP meta in index.html — commit + push (revertable)
   5. Update smoke_test to assert style= count 0 and CSP without unsafe-inline — commit + push
   6. Update README/HANDOFF prose — commit + push
   7. Full gates — commit + push final

8. BRANCH AND TARGET
   Base: main (cae8837)
   Target: feature/pages-phase3-secondary-csp
   Orchestrator: arena/01a09829-translatechan
   Align HEAD:
     git fetch --depth 50 origin +feature/pages-phase3-secondary-csp:refs/remotes/origin/_resume
     git checkout -B feature/pages-phase3-secondary-csp refs/remotes/origin/_resume
   If not found:
     git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B feature/pages-phase3-secondary-csp origin/main

9. WORK PERSISTENCE AND PUSH CADENCE
   git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin feature/pages-phase3-secondary-csp
   Open ONE PR at end.

10. TECHNICAL REQUIREMENTS
    Keep 5 rooms, internal IDs, CSP script-src self, no inline handlers, data-* delegation.
    Keep bundle <2MB.
    style= count 0, CSP without unsafe-inline.
    Keep responsive, reduced-motion, focus-visible, lang="zh".
    TEST_COMMAND: python3 scripts/validate_data.py — PASS
    INTEGRATION_TEST_COMMAND: python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs — PASS
    FULL_SUITE_COMMAND: py_compile + validate + build + smoke + diff -rq + structural diff
    MUTATION_TEST_COMMAND: python3 scripts/test_source_review_rules.py — 120 checks PASS
    BUILD_COMMAND: python3 scripts/build_data_bundle.py

11. SAFETY AND COMPATIBILITY RULES
    Must NOT break 5 gates, must NOT change data/corpus, no 630 re-designation, no workflow edits except CSP meta in index.html (allowed, not workflow), no Classical Chinese generation, keep 5-room scope.

12. CLEANUP RULES
    No commented code, debug logs, TODO. Clean worktree.

13. STRICT BOUNDARIES / OUT OF SCOPE
    - Do not push to orchestrator branch.
    - Do not split bundle.
    - Do not fetch CBETA.
    - Do not add framework.

14. QUALITY CHECKS
    - py_compile PASS
    - validate_data PASS
    - build_data_bundle PASS
    - smoke_test PASS 35 texts + style=0 + CSP check
    - diff -rq PASS
    - structural diff PASS
    - Confirm secondary rooms re-composed, CSP without unsafe-inline, style= count 0

15. PR DESCRIPTION REQUIREMENTS
    - Summary: Phase3 secondary rooms + CSP tightening
    - Measurements before/after style= count, CSP meta, bundle sizes
    - Preserve vs Change for this slice
    - Test results
    - Breaking changes none (visual + CSP hardening)
    - Safety
    - Session Irregularities

16. HARDENING REPORT — Session Irregularities
    Thresholded or None significant.

