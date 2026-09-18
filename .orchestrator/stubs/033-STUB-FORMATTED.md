translatechan agent

Your task prompt is on the orchestrator branch. Fetch it, then follow it exactly.

```
git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/033-phase5-bundle-26-35-final-batch.md > /tmp/task.md
```

Then read /tmp/task.md and complete it in ONE pull request.

If this stub and the fetched file disagree, the fetched file wins.

If GitHub auth fails mid-session with HTTP 401/403 "Bad credentials", that is

a known sandbox issue — follow the recovery procedure in the task prompt

(ask the operator via `ask_user` with the reconnect option); do not

improvise credentials.

Task: Phase 5 — Bundle 26-35 Final Batch Before Review — Keep 1-25 (1 Classic ideal no override, 2 Accordion Reader byte-identical kept, 3-7 truly drastic PR79 Focus 38rem/Timeline/Graph+Split/Hamburger/Dossier, 8-15 usable handpick PR80 Tabbed+Breadcrumb/BottomSheet/StickyTOC/SearchFirst/QuestionDriven/SideBySide/RelatedRail/FootnotesGlossary, 16-25 more usable PR81 Progressive/Modal/Hover/Sentence/Chunk/Dossier/TwoStep/Palette/Trail), add 26-35 final batch more usable handpickable before review per owner "26-35 yes" — 26 Empty State Guidance, 27 Comparison Slider, 28 Inline Teacher Origin, 29 Minimal Header Full-Bleed 2rem header top nav bar, 30 Magazine Spread 2-col drop cap, 31 Card Wall masonry 18rem, 32 Vertical Timeline dots left content right, 33 Split Resizable 60/40 drag handle, 34 Glossary Sidebar 14rem + Footnotes sidebar + tooltips, 35 Focus+TOC Hybrid 10rem/40rem/10rem mini TOC + progress rail + trail — each 300-600 lines CSS overriding shell+nav+body but keeping nav+filter visible, visually distinct but usable, keep ideal colors of 1, keep common qualities light mental load English first not dense comfortable piece meal info sections 34/34 teachers 24/24 cases 31/31 terms 4/4 lines, bundle <30MB testing, text integrity required presentation allowed to break per RULING_GATES_EXPERIMENT + RULING_BUNDLE_CEILING

Orchestrator branch: arena/01a09829-translatechan

Prompt file: .orchestrator/prompts/033-phase5-bundle-26-35-final-batch.md
