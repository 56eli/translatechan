# Why No Layout Incorporated Drastic Changes — Analysis 2026-09-14

**Owner feedback verbatim on PR #75 (layouts 1-6):**
1. Website examples don't change much. Only the "Read" tab changes partially. "Compare","Lineage","Cases","Terms" don't, and that there are the same amount of tabs isn't necessarily intended, nor forbidden. At least the colors stay.
2. Need to be revised.
3. 1/10 points, approach needs to be revised.
4. don't work much. But i do see some improvements in "Accordion Reader".
5. all layouts are at maximum 3/10.
6. Bundle ceiling isn't helping us. Lets extend it to 30mb for testing phase if technically feasible.
7. Elaborate why no layout incorporated drastic changes the website layout. It's all pretty much the same.

## Root Cause Analysis — Why Only Colors/Fonts Changed

### 1. Safe Path to Keep Gates Green
- **5 quality gates + 3 extra gates** must PASS before every push: py_compile, validate_data, build_data_bundle deterministic, smoke_test 35 texts + 138 W1 checks, diff -rq data docs/data, preservation 0 unauthorized, review rules 138 checks, website ruling gate (law + common qualities).
- Changing **colors/fonts** = editing only CSS variables under `[data-design="2"]` etc. — no new DOM, no style=, no setProperty, no layout shift, smoke still passes, bundle stays <2MB, 0 style= invariant holds, CSP holds.
- Changing **drastic layout** = touching app.js structure for all 5 rooms (Reader, Compare/Matrix, Lineage, Cases/Gongan, Terms/Lexicon), index.html containers, adding disclosure patterns (accordion, progressive scroll, tabs, modal, hover cards) across all rooms, not just Reader. This risks:
  - Breaking smoke_test (35 texts render, 5 rooms, lazy boot, 138 checks)
  - Adding inline style= or new CSSOM writes → CSP fail, 0 style= fail
  - Breaking diff -rq data docs/data or bundle determinism
  - Crossing 2MB bundle ceiling (PR #75 already 1.93 MiB raw, just over decimal 2M) — agent flagged this as honest measurement needing owner awareness, so it self-limited to avoid crossing ceiling

### 2. Same Amount of Tabs — Not Intentionally Preserved, Just Safest
- Prompt 025/026 said "5 rooms" smoke-guarded, so agent assumed same amount of tabs must stay to keep smoke green. Owner clarified: same amount of tabs isn't necessarily intended nor forbidden — so we CAN change tab count, merge rooms, split rooms, etc. Agent didn't know, so it kept 5 tabs identical across all layouts.
- Only Read tab changed partially because Reader is the only room with explicit disclosure hooks (renderChapterItem, renderProvenanceNoteLine, etc.) that agent could safely modify without breaking other rooms' renderers.

### 3. Why Accordion Reader Showed Some Improvements
- Accordion implements **light mental load**: minimum info by default (only English open), extra behind expand — exactly common qualities law: minimum amount presented, extra expand/hover/toggle, English first, not dense, comfortable, piece meal.
- Other layouts (Progressive Scroll, Tabbed, Modal, Hover Cards) only partially implemented common qualities or only in Reader, not in Compare/Lineage/Cases/Terms — so they felt same.

### 4. Why All Layouts Max 3/10
- Because they were **token swaps, not structural redesigns**. Colors of 1 ideal already, so varying colors doesn't help. Owner wants structure variation for light mental load, but agent delivered color variation.
- No drastic changes to information architecture: Compare still dense table, Lineage still dense list, Cases still dense catalogue, Terms still dense lexicon — all violate light mental load, English-first, not dense, comfortable, piece-meal, info sections.

### 5. Bundle Ceiling 2MB Was Constraining
- Agent measured PR #75 raw 2,023,631 B = 1.93 MiB, gzipped 617,755 B <1MB, but decimal 2,000,000 ceiling would fail. So agent self-limited, avoided adding more CSS/JS for drastic changes. Owner now extends ceiling to 30MB for testing phase — technically feasible, Quality workflow doesn't enforce size directly, only git diff --exit-code, so we can now do drastic changes.

## Revised Approach — Drastic Layout Changes, Keep Ideal Colors of 1

**Per owner: approach confirmed 10/10, keep ideal colors of 1, vary structure for light mental load, bundle first 5 to test timing, current layout stays as 1, adding 2-6.**

**New approach for next bundle (2-6 revised, or 7-11 next):**

1. **Keep colors of ideal 1 as common base for ALL** — no color variations, only structure
2. **Drastic changes across ALL rooms, not just Read:**
   - **Reader:** Accordion, progressive, tabs, modal, hover — but also English-first, minimum info default, piece-meal plain language, info section for every work/teacher (where from, what/who related, background)
   - **Compare/Matrix:** Currently dense table — revise to light mental load: minimal overview by default, expand row for details, plain English explanations, not dense
   - **Lineage:** Currently dense list — revise to timeline or graph minimal, teacher dossier expandable, info section where from / teacher/disciples / background
   - **Cases/Gongan:** Currently dense catalogue — revise to card overview with 1-line plain English, click expands context, related works/teachers
   - **Terms/Lexicon:** Currently dense lexicon — revise to glossary with dotted underline hover plain language, search-first, piece-meal
   - **Number of tabs:** Can vary — same amount isn't intended nor forbidden. Could merge, split, or hide behind hamburger to reduce mental load.

3. **Each layout variant distinct structure:**
   - Example: Layout 2 = Accordion across ALL rooms (Compare rows accordion, Lineage dossiers accordion, Cases cards accordion, Terms glossary accordion)
   - Layout 3 = Tabbed across ALL rooms (each room has tabs: Overview / Details / Context / Related)
   - Layout 4 = Drawer-first across ALL rooms (all extra info in drawers, default minimal)
   - Layout 5 = Modal-first across ALL rooms (info sections in modals)
   - Layout 6 = Hover/Cards across ALL rooms (related info as hover cards)

4. **Bundle ceiling 30MB for testing phase** — allows drastic CSS/JS without trimming, per RULING_BUNDLE_CEILING_2026-09-14.md

5. **Every implementation adds a number on switcher, <2h per task** — bundling 5 to test timing worked (~20-25 min per layout), so we can continue bundling but now with drastic changes

## Enforcement

- Update test_website_ruling.py to allow 30MB for testing phase, but still enforce law + common qualities
- Update HANDOFF.md, AUDIT.md, ROADMAP.md to note testing phase ceiling 30MB
- Future prompts must require drastic changes across all 5 rooms, not just Read, and allow different number of tabs
- Must still ask per law: does this look good? right direction? 1-10 aim 8+? How well common qualities work 1-10?

## Questions for Owner per LAW

- Does this analysis of why no drastic changes look good?
- Is revised approach (keep ideal colors of 1, drastic structure changes across ALL rooms, different tab counts allowed, 30MB ceiling for testing) the right direction?
- How good is it on a scale from 1-10 where we aim for at least 8?
- Which of 6-35 variants should be implemented with drastic changes first?
