0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/025-phase5-five-design-switcher.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 662df41 (RE-KEY 10/10 FINAL merged, Chinese integrity ~100% verified, LAW gate PR #68 merged).

1. TASK TITLE AND SCOPE
   Phase5 human-readable website overhaul — 5 different website designs that owner can cycle through on live website via buttons. One PR, website work, must include LAW verbatim + failing gate.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 662df41, LABEL 18/18 complete, RE-KEY 10/10 complete, Chinese integrity ~100% verified, next utmost importance website per LAW
   - .orchestrator/RULING_WEBSITE_2026-09-14.md — DEFINITIVE LAW verbatim: website NOT beautiful NOT done, NOT capable to judge, 100% owner feedback, must ask does this look good? right direction? 1-10 aim 8+
   - .orchestrator/STATE.md — law section
   - scripts/test_website_ruling.py — failing gate that enforces law
   - PAGES_REVAMP_PROPOSAL_2026-09-13.md + WEB_VISION_2026-09-13.md — prior proposal, now superseded by 5-design approach
   - app.js, app.css, index.html — current functional gate-green (43 tokens, 0 style=, CSP without unsafe-inline, bundle <2MB, render-lazy)

3. PROJECT CONTEXT
   Pure LABEL 18/18 COMPLETE, RE-KEY 10/10 COMPLETE (PRs #53-#71), Chinese integrity as close to 100% verified as possible. LAW PR #68 merged main e85d5c5 — CI now fails if subjective standards not met. Main now 662df41 after final RE-KEY. Next utmost importance is website human-readable, easy-of-use, welcoming per LAW.

   Owner wants: 5 different website designs that can be cycled through on live website via buttons, to scope good visual without agent being able to subjectively gauge it. Owner needs to see examples on live website. Untested PRs have to be merged first which is unfortunate — mitigate by making PR small, gate-green, with smoke test 35 texts.

4. CONFIRMED FACTS
   - Website functional gate-green (5 gates + preservation + review rules + website ruling gate PASS) but NOT beautiful, NOT done per LAW
   - Owner ruling definitive: orchestrator and ALL dispatch agents ARE NOT CAPABLE TO JUDGE WEBSITE, 100% reliance on owner feedback, must provide examples/suggestions/demonstrations and ask does this look good? right direction? 1-10 aim 8+
   - Current site has 43 tokens, 0 style=, CSP style-src 'self' https://fonts.googleapis.com without unsafe-inline, bundle raw ~1.69MB <2MB, render-lazy, 35 texts
   - Pages publishes from main /docs, so to see on live website, PR must be merged to main (unfortunate but required)

5. CORE OBJECTIVE
   Implement 5 different website setups (design variants) with buttons to switch through them on live website, so owner can cycle and rate each 1-10 aiming for 8+. Provide examples, not judgments.

6. EXACT DELIVERABLES
   - app.css — 5 token maps: [data-design="a"], [data-design="b"], [data-design="c"], [data-design="d"], [data-design="e"] — each distinct visual direction, e.g.:
     A Scholarly Minimal (current base refined, serif dominant, max whitespace, quiet ledger)
     B Warm Editorial (magazine-like, warm paper, generous leading, welcoming)
     C Monastic Scroll (vertical rhythm, traditional, ink-like, contemplative)
     D Modernist Grid (Swiss grid, stark contrast, clear hierarchy)
     E Contemplative Dark (dark-first, soft, meditative)
     Each must be distinct but keep bundle <2MB, 0 style=, CSP compliant
   - app.js — renderDesignSwitcher() — persistent control (e.g., header or bottom corner) with 5 buttons to cycle through setups, stores choice in localStorage translatechan_design_variant, applies data-design attribute to html, keyboard accessible, no inline style=
   - index.html — add switcher container if needed, no style=
   - docs/ mirror — regenerated via build_data_bundle.py
   - Must keep 5 quality gates + preservation + review rules + website ruling gate PASS
   - Must NOT claim website is beautiful/done, must NOT self-judge, must include in PR description and in code comments: examples only, not judgments, and ask does this look good? right direction? 1-10 aim 8+

7. SUB-TASK BREAKDOWN
   1. Read LAW and existing tokens, design 5 distinct token maps (keep 43 base + 5 variants)
   2. Implement switcher UI in app.js (no style=, CSP safe, render-lazy compatible)
   3. Update app.css with 5 variants (scoped, no unsafe-inline)
   4. Build bundle, verify <2MB, docs mirror byte-identical
   5. Run full gates: py_compile PASS, validate PASS, build PASS, smoke PASS (35 texts), preservation PASS 0 unauthorized, review rules PASS 138 checks, website ruling PASS (must contain law + questions)
   6. Commit + push, PR description must include LAW verbatim + ask does this look good? right direction? 1-10 aim 8+

8. BRANCH AND TARGET
   Base: main 662df41
   Target: feature/phase5-five-design-switcher
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   git add -A && git commit -qm "feat: Phase5 5-design switcher — live website buttons to cycle setups, examples only, law enforced" && git push -qu origin <branch>
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed. SAFE: --name-only, --stat, --oneline, ls -lh.
   LAW: Website is NOT beautiful, NOT done. Orchestrator/agents NOT capable to judge. Must rely on owner feedback. Must provide examples/suggestions/demonstrations and ask does this look good? right direction? 1-10 aim 8+. Definitive.

10. TECHNICAL REQUIREMENTS
    - Keep bundle <2MB raw, gzipped <1MB, render-lazy, 0 style=, CSP without unsafe-inline
    - 5 variants must be distinct, but share same 35 texts, same 5 rooms, same functionality
    - Switcher must be accessible, keyboard navigable, no layout shift that breaks smoke test
    - No generation of source-looking Chinese, no workflow edit beyond allowed, allowlist set-equal, 630 not re-designated
    - Must pass test_website_ruling.py — this gate checks prompts >=24 contain does this look good? + 1-10 + NOT beautiful/NOT done + NOT CAPABLE TO JUDGE

11. SAFETY
    - No .github/workflows/* edit (Edit4 already done), no 630 re-designation, no other corpus docs touched
    - No claim website is beautiful/done — CI will fail if you do (website ruling gate)
    - Must include law verbatim in PR description and ask 1-10 scale

12. CLEANUP
    Clean worktree, no committed refs, no /tmp refs committed

13. OUT OF SCOPE
    Do not touch corpus Chinese, do not claim beauty, do not self-score website, do not merge without gates PASS

14. QUALITY CHECKS
    py_compile PASS, validate PASS (corpus 35, slots 1252, verified 177, matrix 21, locators 148/148, W1 collated 1/32/2 flagged 630), build PASS bundle <2MB deterministic, smoke PASS 35 texts render-lazy OK, diff -rq data docs/data PASS, structural diff PASS, preservation PASS 0 unauthorized, review rules PASS 138 checks, website ruling PASS — law enforced: NOT beautiful NOT done, NOT capable to judge, 1-10 aim 8+

15. PR DESCRIPTION (must include)
    - Summary: Phase5 5-design switcher, 5 setups with buttons on live website, examples only, no judgments
    - LAW verbatim: In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask "does this look good?", "Is this the right direction?", "how good is it on a scale from 1-10 where we aim for at least 8?". This is definitive.
    - Approach: 5 token maps A-E, switcher UI, localStorage, data-design attribute, bundle <2MB, 0 style=
    - Preserve vs change: preserve all corpus Chinese, translations, functionality; change app.css (5 variants), app.js (switcher), index.html (container)
    - Test results: all gates PASS including website ruling gate
    - Questions for owner: does this look good? Is this the right direction? How good is it on a scale from 1-10 where we aim for at least 8? (per law, must ask)
    - Note: untested PRs have to be merged first to see on live website which is unfortunate — mitigated by gate-green and smoke test

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed, website ruling gate PASS, LAW respected, no subjective judgment.
