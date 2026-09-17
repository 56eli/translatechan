0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/027-phase5-drastic-layout-all-rooms.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is a1e132e (bundle ceiling 30MB + analysis + gates experiment merged, presentation gates OFF while experimenting).

1. TASK TITLE AND SCOPE
   Phase5 — Drastic layout changes across ALL rooms (Reader, Compare, Lineage, Cases, Terms), keep ideal colors of 1, different tab counts allowed, 30MB ceiling testing, presentation gates OFF while experimenting per owner ruling. One PR, bundle up to 5 drastic layouts, each adds number on switcher.

2. REQUIRED READING ORDER
   - /tmp/state.md — main a1e132e, Chinese integrity 10/10 complete, 5-design switcher live 1-6, but owner feedback 1/10 max 3/10 only Read tab changes
   - .orchestrator/RULING_WEBSITE_2026-09-14.md — LAW: NOT beautiful NOT done, NOT capable to judge, 1-10 aim 8+
   - .orchestrator/COMMON_QUALITIES_2026-09-14.md — COMMON: light mental load, English first, not dense, comfortable, piece meal, info sections for every work and teacher
   - .orchestrator/RULING_BUNDLE_CEILING_2026-09-14.md — 30MB testing phase, technically feasible
   - .orchestrator/RULING_GATES_EXPERIMENT_2026-09-14.md — text integrity gates required, presentation gates allowed to break while experimenting
   - .orchestrator/ANALYSIS_DRASTIC_LAYOUT_2026-09-14.md — why no drastic changes: safe path gates green, same tabs kept, only Read has safe hooks, Accordion improvements, all max 3/10
   - .orchestrator/LAYOUT_VARIANTS_2026-09-14.md — 30 distinct suggestions 6-35, keep ideal colors of 1, vary structure
   - app.js, app.css, index.html — current with 1-6 switcher but only Read changes

3. PROJECT CONTEXT
   Owner feedback on PR #75: examples don't change much, only Read tab changes partially, Compare/Lineage/Cases/Terms don't, same amount of tabs isn't necessarily intended nor forbidden, Accordion Reader some improvements, all max 3/10, 1/10 approach needs revision, bundle ceiling isn't helping, extend to 30MB testing feasible. Owner says analysis looks good, we can turn off gates that don't touch text integrity as website should just be presentation, and we're allowed to break presentation while experimenting.

   So now: text integrity gates remain required (validate, build, preservation, review rules, py_compile), presentation gates OFF (mirror diff, smoke test continue-on-error), bundle ceiling 30MB, ideal colors of 1 kept, drastic structure changes across ALL rooms allowed, different tab counts allowed.

4. CONFIRMED FACTS
   - Colors of Design 1 ideal already — keep as common base
   - Previous 5 layouts (2-6) only changed Read tab partially because agent took safe path to keep gates green and avoided touching Compare/Lineage/Cases/Terms
   - Same amount of tabs isn't intended nor forbidden — can change
   - Accordion Reader showed some improvements because it implements light mental load
   - All layouts max 3/10 per owner, need revision with drastic changes
   - Bundle ceiling extended to 30MB testing per owner, technically feasible
   - Presentation gates turned OFF while experimenting per owner, text integrity gates remain

5. CORE OBJECTIVE
   Implement drastic layout changes across ALL rooms (not just Read), keep ideal colors of 1, vary structure for light mental load, each adds number on switcher (7-11 next), bundle up to 5 into one dispatch <2h to test timing, presentation allowed to break while experimenting.

   Next 5 to bundle (11-15 from variants list):
   - 11 Bottom Sheet: bottom sheet slides up for extra info (all rooms)
   - 12 Sticky Minimal TOC + Reader: left sticky titles only, main English, right context toggle (all rooms)
   - 13 Focus Mode Toggle: button hides all chrome, only English paragraph centered (all rooms)
   - 14 Breadcrumb Context: breadcrumb shows lineage path, click expands background piece-meal (Lineage + Reader)
   - 15 Timeline View: works/teachers on timeline (where from chronologically) (Lineage + Compare)

   All must share ideal colors of 1 and common qualities, but drastically change layout of ALL rooms.

6. EXACT DELIVERABLES
   - app.css — drastic layout structures for [data-design="7"]...[data-design="11"] — each distinct structure across ALL rooms, not just Read, keep ideal colors of 1, bundle <30MB for testing, 0 style= ideally but allowed to break presentation while experimenting per ruling (smoke may fail but text integrity must PASS)
   - app.js — update renderDesignSwitcher() to show numbers 1-11 (1 current ideal stays, 2-6 previous, 7-11 new drastic), implement disclosure patterns across ALL rooms: Compare (dense table → minimal overview + expand), Lineage (dense list → timeline/graph minimal + dossier), Cases (dense catalogue → cards + expand), Terms (dense lexicon → glossary hover + search-first), Reader (keep English-first, minimum info default, piece meal, info sections)
   - Implement info section for every work and teacher for each new layout: where from, what/who related, background context, plain language, piece meal
   - docs/ mirror — regenerated, but allowed to break per experimenting ruling (mirror diff continue-on-error)
   - Must keep text integrity gates PASS: py_compile, validate, build, preservation 0 unauthorized, review rules 138 checks, website ruling gate PASS (law + common qualities)
   - Presentation gates OFF: smoke test and mirror diff allowed to fail while experimenting, but should still try to keep them green if possible
   - Must NOT claim website is beautiful/done, must NOT self-judge, must include law verbatim + common qualities verbatim + ask does this look good? right direction? 1-10 aim 8+

7. SUB-TASK BREAKDOWN
   1. Read LAW, COMMON QUALITIES, BUNDLE CEILING 30MB, GATES EXPERIMENT, ANALYSIS, LAYOUT_VARIANTS, existing ideal colors
   2. Keep current layout as 1 ideal, design 5 new drastic layouts 7-11 sharing ideal colors and common qualities but changing ALL rooms
   3. Update switcher to numbers 1-11
   4. Implement drastic layouts in app.css + app.js across ALL rooms
   5. Build bundle, verify <30MB for testing, docs mirror
   6. Run text integrity gates + website ruling gate (presentation gates allowed to break)
   7. Commit + push, PR description must include LAW verbatim + COMMON QUALITIES verbatim + analysis why previous no drastic + ask 1-10

8. BRANCH AND TARGET
   Base: main a1e132e
   Target: feature/phase5-drastic-layout-7-11
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   git add -A && git commit -qm "feat: Phase5 drastic layouts 7-11 — ALL rooms, keep ideal colors of 1, vary structure, 30MB testing, presentation allowed to break" && git push -qu origin <branch>
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed. SAFE: --name-only, --stat, --oneline, ls -lh.
   LAW: Website is NOT beautiful, NOT done. Orchestrator/agents NOT capable to judge. Must rely on owner feedback. Must provide examples/suggestions/demonstrations and ask does this look good? right direction? 1-10 aim 8+. Definitive.
   COMMON QUALITIES: light mental load, minimum info default, expand/hover/toggle, English first, not dense, comfortable, easy to navigate, piece meal plain language, info section for every work and teacher.

10. TECHNICAL REQUIREMENTS
    - Keep ideal colors of 1 as base for all new variants — only structure varies drastically
    - Drastic changes across ALL rooms: Reader, Compare, Lineage, Cases, Terms — not just Read
    - Different number of tabs allowed — same amount isn't intended nor forbidden
    - Bundle <30MB for testing phase per RULING_BUNDLE_CEILING
    - Text integrity gates must PASS: py_compile, validate, build, preservation, review rules, website ruling
    - Presentation gates OFF while experimenting: mirror diff and smoke test allowed to fail (continue-on-error), per RULING_GATES_EXPERIMENT
    - Each adds number on switcher, <2h per task bundled to test timing

11. SAFETY
    - No corpus Chinese touched, no 630 re-designation, no workflow edit beyond allowed Edit5
    - No claim website is beautiful/done — website ruling gate kept ON
    - Current layout stays as 1 ideal

12. CLEANUP
    Clean worktree, no committed refs

13. OUT OF SCOPE
    Do not touch corpus Chinese, do not claim beauty, do not self-score, do not change ideal colors of 1

14. QUALITY CHECKS
    Text integrity: py_compile PASS, validate PASS, build PASS bundle <30MB deterministic, preservation PASS 0 unauthorized, review rules PASS 138 checks, website ruling PASS — law + common qualities
    Presentation: mirror diff and smoke test allowed to break while experimenting per owner ruling, but try to keep green

15. PR DESCRIPTION (must include)
    - Summary: Phase5 drastic layouts 7-11 — ALL rooms, keep ideal colors of 1, vary structure, numbers 7-11 on switcher
    - LAW verbatim + COMMON QUALITIES verbatim + analysis why previous no drastic (safe path gates green, same tabs kept, only Read has safe hooks, Accordion improvements, max 3/10, 1/10 approach needs revision, bundle ceiling 30MB)
    - Approach: 5 drastic structures sharing ideal colors: Bottom Sheet, Sticky Minimal TOC, Focus Mode, Breadcrumb Context, Timeline View — all rooms changed
    - Preserve vs change: preserve current layout as 1 ideal, preserve corpus Chinese/translations; change app.css (drastic layouts), app.js (switcher numbers 1-11 + disclosure across ALL rooms + info sections), docs mirror
    - Test results: text integrity PASS, website ruling PASS, presentation allowed to break per experimenting ruling
    - Questions: does this look good? right direction? 1-10 aim 8+? How well common qualities work 1-10? Which of 7-11 feels 8+?
    - Note: presentation gates OFF while experimenting per owner, bundle ceiling 30MB testing

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed, website ruling gate PASS, LAW + COMMON QUALITIES + BUNDLE CEILING + GATES EXPERIMENT respected, drastic changes across ALL rooms, no subjective judgment.
