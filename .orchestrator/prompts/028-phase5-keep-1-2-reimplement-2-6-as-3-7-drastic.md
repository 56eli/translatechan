0. FETCH AND VERIFY
   git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
   git show refs/remotes/origin/_orch:.orchestrator/prompts/028-phase5-keep-1-2-reimplement-2-6-as-3-7-drastic.md > /tmp/task.md
   git show refs/remotes/origin/_orch:.orchestrator/local/ORCHESTRATOR_STATE.md > /tmp/state.md
   Verify main is a1e132e (presentation gates OFF while experimenting, bundle 30MB testing, layouts 1-6 live but only Read changes).

1. TASK TITLE AND SCOPE
   Phase5 — Keep 1 and 2, reimplement 2-6 as 3-7 based on drastic changes approach. Having 2 double is intended. One PR, bundle 5 drastic reimplementations as 3-7, keep 1 current ideal and 2 Accordion Reader (which showed improvements). Must include LAW + COMMON QUALITIES + BUNDLE 30MB + GATES EXPERIMENT.

2. REQUIRED READING ORDER
   - /tmp/state.md — main a1e132e, layouts 1-6 live, owner feedback: only Read tab changes partially, Compare/Lineage/Cases/Terms don't, same tabs not necessarily intended nor forbidden, Accordion some improvements, all max 3/10, 1/10 approach needs revision, bundle ceiling 30MB, presentation gates OFF while experimenting
   - .orchestrator/RULING_WEBSITE_2026-09-14.md — LAW: NOT beautiful NOT done, NOT capable to judge, 1-10 aim 8+
   - .orchestrator/COMMON_QUALITIES_2026-09-14.md — COMMON: light mental load, English first, not dense, comfortable, piece meal, info sections
   - .orchestrator/RULING_BUNDLE_CEILING_2026-09-14.md — 30MB testing phase
   - .orchestrator/RULING_GATES_EXPERIMENT_2026-09-14.md — text integrity required, presentation allowed to break
   - .orchestrator/ANALYSIS_DRASTIC_LAYOUT_2026-09-14.md — why no drastic: safe path gates green, same tabs kept, only Read has safe hooks
   - .orchestrator/LAYOUT_VARIANTS_2026-09-14.md — 30 distinct 6-35, keep ideal colors of 1
   - app.js, app.css — current 1-6, but only Read changes, need drastic across ALL rooms

3. PROJECT CONTEXT
   Owner confirmed approach 10/10: keep ideal colors of 1, vary structure for light mental load. Owner feedback on PR #75: examples don't change much, only Read partially, Compare/Lineage/Cases/Terms don't, same tabs not necessarily intended nor forbidden, Accordion Reader some improvements, all max 3/10, 1/10 approach needs revision, bundle ceiling 30MB. Owner says analysis looks good, we can turn off presentation gates while experimenting. Now owner says: Approach sounds. Good keep 1 and 2. Then reimplement 2-6 as 3-7 based on drastic changes approach. Having 2 double is intended.

   So: Keep 1 (current ideal, colors ideal) and 2 (Accordion Reader which showed improvements), then reimplement previous 2-6 (Accordion, Progressive, Tabbed, Modal, Hover Cards) as 3-7 with drastic changes approach (ALL rooms, not just Read, different tab counts allowed, 30MB ceiling, presentation gates OFF). Having 2 double is intended — Accordion appears twice: old 2 kept + new drastic Accordion as 3, to compare.

4. CONFIRMED FACTS
   - Current live main a1e132e has 1-6: 1 Classic scroll ideal colors, 2 Accordion, 3 Progressive, 4 Tabbed, 5 Modal, 6 Hover Cards — but only Read changes partially
   - Owner wants keep 1 and 2, reimplement 2-6 as 3-7 drastic
   - Having 2 double intended — Accordion appears twice (old 2 + new 3)
   - Colors of 1 ideal kept for all
   - Common qualities must be in all: light mental load, English first, not dense, comfortable, piece meal, info sections
   - Text integrity gates required, presentation gates OFF while experimenting

5. CORE OBJECTIVE
   Keep layout 1 and 2, reimplement previous layouts 2-6 as 3-7 with drastic changes approach across ALL rooms.

   Mapping:
   - 1 = keep current ideal layout
   - 2 = keep old Accordion Reader
   - 3 = NEW drastic Accordion Reader (reimplementation of old 2, drastic across ALL rooms)
   - 4 = NEW drastic Progressive Disclosure Scroll
   - 5 = NEW drastic Tabbed Reader
   - 6 = NEW drastic Modal Info
   - 7 = NEW drastic Hover Cards

6. EXACT DELIVERABLES
   - app.css — keep [data-design="1"] ideal, keep [data-design="2"] old Accordion, add/replace [data-design="3"]...[data-design="7"] with drastic structures across ALL rooms, keep ideal colors, bundle <30MB testing
   - app.js — update renderDesignSwitcher() to show numbers 1-7, persistent control, disclosure patterns across ALL rooms: Compare (dense→minimal+expand), Lineage (dense→timeline/graph+ dossier), Cases (dense→cards+expand), Terms (dense→glossary hover+search-first), Reader (English-first, minimum info default, piece meal, info sections)
   - Info section for every work and teacher for each new layout 3-7: where from, what/who related, background
   - docs/ mirror — regenerated, allowed to break per experimenting ruling
   - Must keep text integrity gates PASS, website ruling gate PASS, presentation gates OFF allowed to fail
   - Must NOT claim beautiful/done, must include law verbatim + common qualities verbatim + ask does this look good? right direction? 1-10 aim 8+

7. SUB-TASK BREAKDOWN
   1. Read LAW, COMMON QUALITIES, BUNDLE 30MB, GATES EXPERIMENT, ANALYSIS, LAYOUT_VARIANTS, ideal colors
   2. Keep 1 and 2, design 5 new drastic layouts 3-7 sharing ideal colors and common qualities but drastic across ALL rooms
   3. Update switcher to numbers 1-7
   4. Implement drastic layouts
   5. Build bundle <30MB, docs mirror
   6. Run text integrity gates + website ruling gate
   7. Commit + push, PR description must include LAW verbatim + COMMON QUALITIES verbatim + ask 1-10

8. BRANCH AND TARGET
   Base: main a1e132e
   Target: feature/phase5-keep-1-2-reimplement-2-6-as-3-7-drastic
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed. SAFE: --name-only, --stat, --oneline, ls -lh.
   LAW: Website is NOT beautiful, NOT done. Orchestrator/agents NOT capable to judge. Must rely on owner feedback. Must provide examples/suggestions/demonstrations and ask does this look good? right direction? 1-10 aim 8+. Definitive.
   COMMON QUALITIES: light mental load, minimum info default, expand/hover/toggle, English first, not dense, comfortable, easy to navigate, piece meal plain language, info section for every work and teacher.

10. TECHNICAL REQUIREMENTS
    - Keep 1 and 2 as is, keep ideal colors of 1 as base for all new 3-7 — only structure varies drastically
    - Drastic changes across ALL rooms, different tab counts allowed, bundle <30MB testing
    - Text integrity gates must PASS, presentation gates OFF while experimenting
    - Each adds number on switcher, <2h per task bundled

11. SAFETY
    - No corpus Chinese touched, no 630 re-designation
    - No claim beautiful/done — website ruling gate kept ON
    - Keep 1 and 2, having 2 double intended

12. CLEANUP
    Clean worktree, no committed refs

13. OUT OF SCOPE
    Do not touch corpus Chinese, do not claim beauty, do not self-score, do not change ideal colors of 1

14. QUALITY CHECKS
    Text integrity: py_compile PASS, validate PASS, build PASS bundle <30MB, preservation PASS 0 unauthorized, review rules PASS 138 checks, website ruling PASS
    Presentation: mirror diff and smoke test allowed to break while experimenting per owner ruling

15. PR DESCRIPTION (must include)
    - Summary: Keep 1 and 2, reimplement 2-6 as 3-7 drastic — ALL rooms, ideal colors, numbers 1-7, having 2 double intended
    - LAW verbatim + COMMON QUALITIES verbatim + analysis why previous no drastic
    - Approach: Keep 1 current ideal, keep 2 old Accordion, reimplement 2-6 as 3-7 drastic across ALL rooms
    - Preserve vs change: preserve 1 and 2, preserve corpus; change app.css (5 new drastic structures 3-7), app.js (switcher 1-7 + drastic disclosure across ALL rooms + info sections)
    - Test results: text integrity PASS, website ruling PASS, presentation allowed to break
    - Questions: does this look good? right direction? 1-10 aim 8+? Which of 3-7 feels 8+? Having 2 double intended — compare old 2 vs new 3
    - Note: bundle ceiling 30MB testing, presentation gates OFF while experimenting

16. HARDENING REPORT
    Record rewind, branch mismatch, BANNED COMMANDS followed, website ruling gate PASS, LAW + COMMON QUALITIES + BUNDLE CEILING + GATES EXPERIMENT respected, keep 1 and 2, reimplement 2-6 as 3-7 drastic, having 2 double intended.
