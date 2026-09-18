translatechan agent

Your task prompt is on the orchestrator branch. Fetch it, then follow it exactly.

```
git fetch --depth 1 origin +arena/01a09829-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/031-phase5-bundle-8-15-usable-handpick.md > /tmp/task.md
```

Then read /tmp/task.md and complete it in ONE pull request.

If this stub and the fetched file disagree, the fetched file wins.

If GitHub auth fails mid-session with HTTP 401/403 "Bad credentials", that is

a known sandbox issue — follow the recovery procedure in the task prompt

(ask the operator via `ask_user` with the reconnect option); do not

improvise credentials.

Task: Phase 5 — Bundle 8-15 Usable Handpick — Keep 1-7 (1 Classic ideal no override, 2 Accordion Reader byte-identical kept, 3-7 truly drastic from PR79 Focus 38rem/Timeline/Graph+Split/Hamburger/Dossier), add 8-15 more usable with handpickable elements before review per owner "good news drastic changes, less good not usable yet, however individual elements might be able to be handpicked later for targeted page build, lets first implement more examples before going into review" — 8 Tabbed+Breadcrumb, 9 Bottom Sheet, 10 Sticky TOC 16rem/1fr/16rem, 11 Search-First landing, 12 Question-Driven Where from/Who related/Background, 13 Side-by-Side English/Chinese collapsed, 14 Related Rail 18rem hover why related, 15 Footnotes+Glossary dotted hover plain language — each 300-600 lines CSS overriding shell+nav+body but keeping nav+filter visible, visually distinct but usable, keep ideal colors of 1, keep common qualities light mental load English first not dense comfortable piece meal info sections 34/34 teachers 24/24 cases 31/31 terms 4/4 lines, bundle <30MB testing, text integrity required presentation allowed to break per RULING_GATES_EXPERIMENT + RULING_BUNDLE_CEILING

Orchestrator branch: arena/01a09829-translatechan

Prompt file: .orchestrator/prompts/031-phase5-bundle-8-15-usable-handpick.md
