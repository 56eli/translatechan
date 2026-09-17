# Layout Variants — Up to 30 More Distinct Suggestions (2026-09-14)

**Source:** Owner request 2026-09-14 — layout-focused approach perfect, keep color of ideal 1, vary structure for light mental load. Direction rated 10/10 for approach, results must be judged by actual implementation subjectively.

**Status:** Proposals only, not all have to be implemented immediately. Every implementation must add a number on the layout switcher. There can be as many example switches as technicalities allow, but agents shouldn't work longer than 2 hours on a task (so one variant per PR, ~1.5h).

**Common Base (LAW) — ALL variants must share, colors of ideal 1 kept:**
- Light mental load: minimum info by default, extra expand/hover/toggle
- English first, not dense layout
- Comfortable to read, easy to navigate
- Explanations piece meal, plain language
- Info section for every work and teacher: where they came from, what/who related, background context
- Colors of Design A (ideal 1) kept as common base — only structure varies

**Existing 5 (from Prompt 025, PR #73 merged main 31ac12a):**
- **1 / A — Single-column focus:** one column, max whitespace, extra behind Show more, Reader largest, info collapsed
- **2 / B — Two-pane list + reader:** left list titles only, right reader comfortable, related in toggle drawer
- **3 / C — Card overview + expand:** works/teachers as cards with 1-line plain English summary, click expands context
- **4 / D — Drawer-first:** minimal header, all extra (lineage, matrix, lexicon) in drawers, default only English + tiny Chinese
- **5 / E — Contextual sidebar:** main English-first, right sidebar info section (where from, related, background) hover/toggle

**Up to 30 More Distinct Suggestions (stop where overlap heavily) — each adds a number on switcher:**

**6 — Accordion Reader:** Each section (Translation / Chinese / Notes / Context) is accordion, only English open by default.

**7 — Progressive Disclosure Scroll:** As you scroll, more context appears piece-meal, not all at once.

**8 — Tabbed Reader:** Tabs: Translation (default), Chinese, Context, Related. English first tab active.

**9 — Modal Info:** Info sections open in modal overlay, not inline. Main view minimal.

**10 — Hover Cards:** Related teachers/works as hover cards on English names, not inline list.

**11 — Bottom Sheet:** Bottom sheet slides up for extra info, desktop same as drawer, default hidden.

**12 — Sticky Minimal TOC + Reader:** Left sticky minimal TOC (titles only), main English, right context toggle.

**13 — Focus Mode Toggle:** Button hides all chrome, leaving only English paragraph centered, tiny [i] to expand.

**14 — Breadcrumb Context:** Top breadcrumb shows lineage path, clicking expands background context piece-meal.

**15 — Timeline View:** Works/teachers on horizontal timeline (where from chronologically), clicking shows context card.

**16 — Graph + Reader Split:** Minimal lineage graph (dots only), clicking node shows teacher info side panel.

**17 — Search-First Landing:** Landing is search + plain English explanation, results minimal cards, expand for context.

**18 — Question-Driven Disclosure:** Buttons: "Where did this come from?" / "Who related?" / "Background?" Each reveals piece-meal.

**19 — Sentence-by-Sentence:** Each English sentence has [i] toggling Chinese + context for that sentence only.

**20 — Chapter Chunks:** Long texts broken into small chunks with "Continue", each chunk optional context toggle.

**21 — Side-by-Side Minimal (Chinese collapsed):** English left, Chinese right collapsed by default, toggle expand.

**22 — Info-First Dossier Landing:** Work page top is info section (where from, related, background) plain language, then translation collapsed.

**23 — Related Rail:** Right rail shows only related works/teachers minimal, expands on hover to show why related.

**24 — Plain Language Glossary:** Technical terms dotted underline, hover shows plain language explanation piece-meal.

**25 — Work Dossier Page:** Dedicated page per work: header info (witness + coverage, where from), related teachers, background, then translation expandable.

**26 — Teacher Dossier Page:** Dedicated page per teacher: origin, teacher/disciples, background, related works, expandable.

**27 — Minimal Header + Hamburger:** Header only title + switcher numbers, all navigation behind hamburger, default minimal.

**28 — Contextual Footnotes:** Background context as footnotes at bottom, toggle footnotes section.

**29 — Two-Step Reader:** First shows only first paragraph English + "Read more" + "Show context", second reveals rest piece-meal.

**30 — Command Palette (cmd+k):** Palette to jump to work/teacher, keeps UI minimal, extra behind palette.

**31 — Bookmark Trail:** Bookmark pieces, trail at bottom shows where you came from in plain language.

**32 — Empty State Guidance:** When no work selected, plain language guide: what is Chan, where works from, who related, background, piece meal.

**33 — Contextual Prev/Next:** Bottom prev/next shows related work/teacher with one-line why related.

**34 — Comparison Slider:** For variant witnesses, slider to compare, default minimal English, extra behind toggle.

**35 — Inline Teacher Origin:** Lineage view each teacher row only name + era, hover expands where from + teacher/disciples + background.

**Overlap check:** All 6-35 vary primary interaction: accordion vs tabs vs modal vs hover vs bottom sheet vs sticky TOC vs focus vs breadcrumb vs timeline vs graph vs search vs question-driven vs sentence vs chunks vs side-by-side vs info-first vs related rail vs glossary vs dossier pages vs minimal header vs footnotes vs two-step vs palette vs trail vs empty state vs prev/next vs slider vs inline origin. Stopped where overlap heavily would be color/font only — we vary structure.

**Implementation rule:** Every implementation adds a number on layout switcher (now 1,2,3... not A-E), one variant per PR <2h, owner picks which numbers to implement first after rating 1-10.

**Questions per LAW:** Does this list look good? Right direction — keep ideal colors of 1, vary structure for light mental load, each adds number, <2h? How good 1-10 aim 8+? Which numbers 6-35 should be implemented first?
