# COMMON QUALITIES — All 5 Design Directions Must Share (2026-09-14, owner definitive)

**Source:** Owner verbatim 2026-09-14 via ask_user, after RULING_WEBSITE_2026-09-14.md

**Status:** DEFINITIVE, must be reflected in all Phase5 prompts, PR descriptions, and failing gates. All 5 distinct directions must have these common qualities.

## Verbatim Owner Statement (law for common qualities)

"All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is."

## Interpretation as Common Base (must be in all 5 variants)

1. **Light mental load:** Minimum amount of information presented to viewer by default. Everything extra must be expandable, hoverable, or togglable (disclosure pattern, not dense dump).

2. **English first:** Primary reading experience is English. Chinese is present but subordinate everywhere except inside Reader where it is largest (per C-3), but even there English is first in visual hierarchy for mental load.

3. **Not dense layout:** No dense walls of text, no crowded UI. Generous whitespace, comfortable measure, clear hierarchy, breathable.

4. **Comfortable to read and easy to navigate:** High readability, clear navigation, persistent but minimal chrome, easy to find 5 rooms, easy to move between texts.

5. **Explanations piece meal, plain language:** No jargon dumps. Explanations broken into small pieces, plain language, progressive disclosure.

6. **Info section for every work and teacher:** Each work and each teacher must have an info section that puts into context:
   - Where they came from (origin, lineage, time, place)
   - What or who is related (related works, teachers, lineage links)
   - Background context (historical, doctrinal, why it matters)

## Implications for 5 Distinct Directions

- Distinct directions may vary in: color temperature, density (but all must be non-dense), typography voice, grid vs scroll, light vs dark emphasis, mood, visual metaphor — but ALL must keep common qualities above.

- Distinct directions must NOT violate common qualities. E.g., a direction cannot be dense, cannot be Chinese-first, cannot dump all info at once, cannot be hard to navigate.

- Failing gate `test_website_ruling.py` will be extended to check for common qualities: must have disclosure/expand pattern, English-first in index, not dense (check for excessive info density heuristics), plain language explanations, info section for work/teacher.

## Enforcement

- Phase5 prompt 025 must include these common qualities verbatim.
- PR descriptions for Phase5 must list how each of 5 variants implements light mental load, English-first, non-dense, comfortable, piece-meal plain language, info sections.
- Future `test_website_ruling.py` extension: check that app.js renders info sections for every work/teacher, that default view is minimal, that extra info is behind expand/hover/toggle.

## Relationship to Website Ruling Law

- Website ruling law (NOT beautiful, NOT done, NOT capable to judge, 100% owner feedback, 1-10 aim 8+) remains definitive.
- Common qualities are additional law for Phase5: all 5 examples must share light mental load etc., while distinct visual directions are scoped via owner 1-10 ratings.

## Questions for Owner (per law, must ask)

- Does this common-qualities interpretation look good?
- Is this the right direction for scoping all 5 variants?
- How good is it on a scale from 1-10 where we aim for at least 8?
