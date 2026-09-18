translatechan agent

Your task prompt is on the orchestrator branch. Fetch it, then follow it exactly.

```
git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/032-phase5-bundle-16-25-more-usable.md > /tmp/task.md
```

Then read /tmp/task.md and complete it in ONE pull request.

If this stub and the fetched file disagree, the fetched file wins.

If GitHub auth fails mid-session with HTTP 401/403 "Bad credentials", that is

a known sandbox issue — follow the recovery procedure in the task prompt

(ask the operator via `ask_user` with the reconnect option); do not

improvise credentials.

Task: Phase 5 — Bundle 16-25 More Usable Handpick — Keep 1-15 (1 Classic ideal no override, 2 Accordion Reader byte-identical kept, 3-7 truly drastic PR79 Focus 38rem/Timeline/Graph+Split/Hamburger/Dossier, 8-15 usable handpick PR80 Tabbed+Breadcrumb/BottomSheet/StickyTOC/SearchFirst/QuestionDriven/SideBySide/RelatedRail/FootnotesGlossary), add 16-25 more usable with handpickable elements before review per owner "now next stub for 16-25" — 16 Progressive Disclosure Scroll, 17 Modal Info, 18 Hover Cards, 19 Sentence-by-Sentence, 20 Chapter Chunks, 21 Work Dossier Page, 22 Teacher Dossier Page, 23 Two-Step Reader, 24 Command Palette cmd+k, 25 Bookmark Trail + Prev/Next + Comparison Slider + Inline Teacher Origin — each 300-600 lines CSS overriding shell+nav+body but keeping nav+filter visible, visually distinct but usable, keep ideal colors of 1, keep common qualities light mental load English first not dense comfortable piece meal info sections 34/34 teachers 24/24 cases 31/31 terms 4/4 lines, bundle <30MB testing, text integrity required presentation allowed to break per RULING_GATES_EXPERIMENT + RULING_BUNDLE_CEILING

Orchestrator branch: arena/01a09829-translatechan

Prompt file: .orchestrator/prompts/032-phase5-bundle-16-25-more-usable.md
