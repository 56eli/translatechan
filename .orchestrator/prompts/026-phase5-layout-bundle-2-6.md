0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/026-phase5-layout-bundle-2-6.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is 24578bd (LAYOUT_VARIANTS 30 distinct merged, 5-design switcher live main 31ac12a).

1. TASK TITLE AND SCOPE
   Phase5 — Bundle first 5 new layout variants as numbers 2-6 on switcher, keep current layout as 1 (ideal colors). One PR, website work, bundle 5 layouts into one dispatch agent to see how long layout changes take. Must include LAW + COMMON QUALITIES verbatim + failing gate.

2. REQUIRED READING ORDER
   - /tmp/state.md — main 24578bd, Chinese integrity 10/10 complete, LAW + COMMON QUALITIES enforced, 5-design switcher live
   - .orchestrator/RULING_WEBSITE_2026-09-14.md — DEFINITIVE LAW: website NOT beautiful NOT done, NOT capable to judge, 100% owner feedback, must ask does this look good? right direction? 1-10 aim 8+
   - .orchestrator/COMMON_QUALITIES_2026-09-14.md — COMMON QUALITIES: light mental load (minimum info default, expand/hover/toggle), English first, not dense layout, comfortable to read, easy to navigate, piece meal plain language, info section for every work and teacher (where they came from, what/who related, background context)
   - .orchestrator/LAYOUT_VARIANTS_2026-09-14.md — 30 distinct suggestions 6-35, keep ideal colors of 1, vary structure, each adds number, <2h per task (now bundling first 5 to test timing)
   - .orchestrator/STATE.md — law + common qualities sections
   - scripts/test_website_ruling.py — failing gate checks law + common qualities for seq>=25
   - app.js, app.css, index.html, theme-init.js — current live with 5 color variants A-E, but owner says colors of 1 ideal already, current layout should stay as 1, so new work keeps colors of ideal 1 and varies structure

3. PROJECT CONTEXT
   Chinese integrity 10/10 COMPLETE (PRs #53-#71, main 662df41), LAW gates PR #68 + common qualities PR #72 merged, 5-design color switcher live PR #73 main 31ac12a (A-E), layout variants list PR #74 main 24578bd (30 distinct 6-35). Owner confirmed approach 10/10: keep color of ideal 1 and vary structure for light mental load. Owner wants first 5 new layouts bundled into one dispatch agent to see how long layout changes take, current layout should stay as 1, adding layouts with cycle buttons 2-6 to main.

4. CONFIRMED FACTS
   - Website functional gate-green but NOT beautiful NOT done per LAW
   - Colors of Design 1 (ideal) are ideal already — keep as common base for all new variants
   - Previous 5 designs merely changed colors/fonts because agent took safe path to keep gates green (only CSS variables, no DOM/layout change)
   - Owner wants layout-focused, not color-focused: 5 distinct layout structures sharing ideal colors and common qualities
   - Every implementation must add a number on layout switcher, <2h per task but bundling first 5 to test timing per owner instruction 2026-09-14

5. CORE OBJECTIVE
   Implement first 5 new layout variants from LAYOUT_VARIANTS list (6-10) as numbers 2-6 on switcher, keep current layout as 1 (ideal colors). Bundle into one PR to test how long layout changes take.

   First 5 to bundle (6-10):
   - 6 Accordion Reader: Translation/Chinese/Notes/Context accordion, only English open by default
   - 7 Progressive Disclosure Scroll: as you scroll, more context appears piece-meal
   - 8 Tabbed Reader: tabs Translation (default)/Chinese/Context/Related
   - 9 Modal Info: info sections in modal overlay, main minimal
   - 10 Hover Cards: related teachers/works as hover cards on English names

   All 5 must share: ideal colors of 1, light mental load (minimum info default, expand/hover/toggle), English first, not dense layout, comfortable to read, easy to navigate, piece meal plain language, info section for every work and teacher (where from, what/who related, background).

6. EXACT DELIVERABLES
   - app.css — keep ideal colors of 1 as base, add 5 new layout variants scoped as [data-design="2"], [data-design="3"], [data-design="4"], [data-design="5"], [data-design="6"] — each distinct structure, not just colors/fonts, all keep ideal colors, all implement common qualities, bundle <2MB, 0 style=, CSP compliant
   - app.js — update renderDesignSwitcher() to show numbers 1-6 (1 = current ideal layout stays, 2-6 = new 5 layouts), persistent control with buttons to cycle, stores choice in localStorage, applies data-design attribute, keyboard accessible, no inline style=. Implement for each new layout: disclosure pattern (accordion, progressive, tabs, modal, hover cards) that keeps minimum info by default and extra expand/hover/toggle
   - Implement info section for every work and teacher for each new layout: where they came from, what/who related, background context, plain language, piece meal, light by default, built only from existing data fields (no invented Chinese)
   - index.html / theme-init.js — ensure switcher container, theme-init applies data-design before first paint
   - docs/ mirror — regenerated via build_data_bundle.py
   - Must keep all gates PASS: py_compile, validate, build, smoke 35 texts, preservation 0 unauthorized, review rules 138 checks, website ruling gate PASS (checks law + common qualities + does this look good? + 1-10)
   - Must NOT claim website is beautiful/done, must NOT self-judge, must include in PR description: examples only, not judgments, law verbatim, common qualities verbatim, and ask does this look good? right direction? 1-10 aim 8+ plus how well common qualities work

7. SUB-TASK BREAKDOWN
   1. Read LAW, COMMON QUALITIES, LAYOUT_VARIANTS, existing tokens (ideal colors of 1)
   2. Keep current layout as 1 (ideal colors), design 5 new layout structures 2-6 (6-10 from list) sharing ideal colors and common qualities
   3. Implement switcher UI update to numbers 1-6
   4. Implement 5 layout variants in app.css (structure, not just colors) + app.js disclosure patterns + info sections
   5. Build bundle, verify <2MB, docs mirror byte-identical
   6. Run full gates including website ruling gate with common qualities
   7. Commit + push, PR description must include LAW verbatim + COMMON QUALITIES verbatim + ask 1-10

8. BRANCH AND TARGET
   Base: main 24578bd
   Target: feature/phase5-layout-bundle-2-6
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   git add -A && git commit -qm "feat: Phase5 bundle layouts 2-6 — keep ideal colors of 1, vary structure for light mental load, 5 new layouts" && git push -qu origin <branch>
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed. SAFE: --name-only, --stat, --oneline, ls -lh.
   LAW: Website is NOT beautiful, NOT done. Orchestrator/agents NOT capable to judge. Must rely on owner feedback. Must provide examples/suggestions/demonstrations and ask does this look good? right direction? 1-10 aim 8+. Definitive.
   COMMON QUALITIES: All directions need to have a light mental load. Minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is.

10. TECHNICAL REQUIREMENTS
    - Keep bundle <2MB raw, gzipped <1MB, render-lazy, 0 style=, CSP without unsafe-inline
    - Keep ideal colors of 1 as base for all 5 new variants — only structure varies
    - 5 variants must be distinct layout structures (accordion, progressive scroll, tabs, modal, hover cards), not just colors/fonts
    - All must share common qualities: light mental load, English first, not dense, comfortable, piece meal plain language, info sections
    - Switcher must show numbers 1-6, accessible, keyboard navigable, no layout shift breaking smoke
    - Must pass test_website_ruling.py — checks law + common qualities + does this look good? + 1-10 for seq>=25
    - Agents shouldn't work longer than 2 hours on a task — bundling first 5 to test timing per owner, so scope to ~1.5-2h total for 5 layouts (approx 20-25 min per layout)

11. SAFETY
    - No .github/workflows/* edit (Edit4 done), no 630 re-designation, no corpus Chinese touched
    - No claim website is beautiful/done — CI fails if you do (website ruling gate)
    - Must include law verbatim + common qualities verbatim in PR description and ask 1-10 scale
    - Current layout should stay as 1 — preserve existing ideal colors

12. CLEANUP
    Clean worktree, no committed refs, no /tmp refs committed

13. OUT OF SCOPE
    Do not touch corpus Chinese, do not claim beauty, do not self-score website, do not merge without gates PASS, do not change ideal colors of 1

14. QUALITY CHECKS
    py_compile PASS, validate PASS (corpus 35, slots 1252, verified 177, matrix 21, locators 148/148, W1 collated 1/32/2 flagged 630), build PASS bundle <2MB deterministic, smoke PASS 35 texts render-lazy OK, diff -rq data docs/data PASS, structural diff PASS, preservation PASS 0 unauthorized, review rules PASS 138 checks, website ruling PASS — law enforced: NOT beautiful NOT done, NOT capable to judge, 1-10 aim 8+, common qualities: light mental load, English first, not dense, comfortable, piece meal, info sections

15. PR DESCRIPTION (must include)
    - Summary: Phase5 bundle layouts 2-6 — keep ideal colors of 1, vary structure for light mental load, 5 new layouts (6-10 from variants list), current layout stays as 1, switcher now 1-6
    - LAW verbatim: In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask "does this look good?", "Is this the right direction?", "how good is it on a scale from 1-10 where we aim for at least 8?". This is definitive.
    - COMMON QUALITIES verbatim: All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is.
    - Approach: 5 layout structures 2-6 sharing ideal colors of 1: Accordion Reader, Progressive Disclosure Scroll, Tabbed Reader, Modal Info, Hover Cards — all implement light mental load, English first, not dense, comfortable, piece meal, info sections
    - Preserve vs change: preserve current layout as 1 ideal colors, preserve all corpus Chinese/translations/functionality; change app.css (5 new layout structures), app.js (switcher numbers 1-6 + disclosure patterns + info sections), index.html/theme-init.js
    - Test results: all gates PASS including website ruling gate with common qualities
    - Questions for owner: does this look good? Is this the right direction? How good is it on a scale from 1-10 where we aim for at least 8? How well do common qualities work 1-10? Which of 2-6 feels 8+?
    - Note: bundled first 5 into one dispatch to see how long layout changes take, per owner instruction, <2h target

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed, website ruling gate PASS, LAW + COMMON QUALITIES respected, no subjective judgment, current layout stays as 1 ideal.
