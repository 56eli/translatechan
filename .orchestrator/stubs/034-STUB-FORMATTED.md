translatechan agent

Your task prompt is on the orchestrator branch. Fetch it, then follow it exactly.

```
git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/034-phase5-demo-36-chan-library-integration.md > /tmp/task.md
```

Then read /tmp/task.md and complete it in ONE pull request.

If this stub and the fetched file disagree, the fetched file wins.

If GitHub auth fails mid-session with HTTP 401/403 "Bad credentials", that is

a known sandbox issue — follow the recovery procedure in the task prompt

(ask the operator via `ask_user` with the reconnect option); do not

improvise credentials.

Task: Phase 5 — Demo 36 Chan Buddhism Digital Library Integration — Keep 1-35 (1 Classic ideal no override, 2 Accordion Reader byte-identical kept, 3-7 truly drastic PR79 Focus 38rem/Timeline/Graph+Split/Hamburger/Dossier, 8-15 usable handpick PR80 Tabbed+Breadcrumb/BottomSheet/StickyTOC/SearchFirst/QuestionDriven/SideBySide/RelatedRail/FootnotesGlossary, 16-25 more usable PR81 Progressive/Modal/Hover/Sentence/Chunk/Dossier/TwoStep/Palette/Trail, 26-35 final batch PR82 EmptyState/Slider/InlineOrigin/FullBleed/Magazine/CardWall/VerticalTimeline/SplitResizable/GlossarySidebar/FocusTOCHybrid), add 36 from provided chan-buddhism-digital-library.zip as demo 36 on the page per owner "Refresh main. I've provided chan-buddhism-digital-library.zip Can you let an agent integrate it as demo 36 on the page?" — find zip (ls *.zip /tmp/*.zip find /home -name *.zip or ask via ask_user), unzip -l and unzip -o to /tmp/chan-library, inspect its HTML/CSS/JS design, integrate as [data-design="36"] 500-1000 lines CSS + JS enhance path + assets if any <30MB, keep 1-35 untouched, implement common qualities light mental load English first not dense comfortable piece meal info sections 34/34 teachers 24/24 cases 31/31 terms 4/4 lines, bundle <30MB testing, text integrity required presentation allowed to break per RULING_GATES_EXPERIMENT + RULING_BUNDLE_CEILING

Orchestrator branch: arena/01a09829-translatechan

Prompt file: .orchestrator/prompts/034-phase5-demo-36-chan-library-integration.md
