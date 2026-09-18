# Phase 5 — Demo 36 Chan Buddhism Digital Library Integration — Keep 1-35, Add 36 From Provided Zip

## Base
- **Base branch:** `main` at `268bf9c` (PR #82 merged — bundle 26-35 final batch before review, keep 1-25, add 26-35 EmptyState/Slider/InlineOrigin/FullBleed/Magazine/CardWall/VerticalTimeline/SplitResizable/GlossarySidebar/FocusTOCHybrid, switcher 1-35 live, bundle <30MB ~6MB raw, text integrity PASS, presentation OFF allowed to break)
- **Target branch:** `feature/phase5-demo-36-chan-library-integration`
- **Task:** Keep 1-35 untouched (1 ideal no override, 2 kept, 3-7 truly drastic PR79, 8-15 usable PR80, 16-25 more usable PR81, 26-35 final batch PR82), add 36 as NEW layout that integrates the provided `chan-buddhism-digital-library.zip` as demo 36 on the page. Owner provided zip via attachment (check workspace root, /tmp, /home/user, arena-workspace, or ask via ask_user if not found). Refresh main per owner request, then integrate zip as demo 36.

## Context — Owner Provided Chan Buddhism Digital Library Zip

Owner: "Refresh main. I've provided chan-buddhism-digital-library.zip Can you let an agent integrate it as demo 36 on the page?"

**What to do with zip:**
1. **Find zip:** Check `ls -lh *.zip`, `ls -lh /tmp/*.zip`, `find /home -name "*.zip"`, `find / -maxdepth 4 -name "chan-buddhism-digital-library.zip"`, or ask owner via `ask_user` where file is if not found. In Arena, attached files may be in workspace root or /tmp/arena-workspace.
2. **Unzip:** `unzip -l chan-buddhism-digital-library.zip` to list, `unzip -o chan-buddhism-digital-library.zip -d /tmp/chan-library` to extract
3. **Inspect:** List files, check if it contains HTML/CSS/JS design for Chan Buddhism digital library — likely a reference design or prototype the owner wants as demo 36
4. **Integrate as layout 36:** Keep 1-35 untouched, add new layout 36 that implements that library's design language but adapted to TranslateChan's data (35 texts, 34 teachers, 24 cases, 31 terms) and common qualities. If zip contains full site, extract its CSS/JS structure and port as `[data-design="36"]` overrides + JS enhance path. If zip contains images/assets, include them in bundle but keep <30MB.
5. **Keep ideal colors?** Owner previously said colors of 1 ideal already, keep color of ideal 1 vary structure. For 36, you may use library's colors if they are part of its design, but try to keep ideal colors of 1 as base or blend — owner wants to see library as demo 36, so it's okay to have different colors for 36 as demonstration, but note in PR description.
6. **Common qualities:** Light mental load minimum default expand/hover/toggle, English first, not dense, comfortable to read easy navigate, piece meal plain language, info section every work/teacher where from what/who related background context — 34/34 teachers 24/24 cases 31/31 terms 4/4 lines measured.
7. **Bundle <30MB:** Keep <30MB raw, currently ~6MB at 1-35, adding 36 with assets should stay <30MB.

## Implementation Steps

1. Branch from main 268bf9c: `git checkout main; git pull; git checkout -b feature/phase5-demo-36-chan-library-integration`
2. Find and unzip provided zip per above, inspect
3. Edit app.css: keep 1-35 untouched (1 no override, 2 byte-identical 31 lines, 3-7 truly drastic PR79 400+ lines each, 8-15 usable PR80 300-600 lines each, 16-25 more usable PR81 300-600 lines each, 26-35 final batch PR82 300-600 lines each), add new section Layout 36 Chan Library Integration `[data-design="36"]` 500-1000 lines CSS that implements library's design — likely includes its own shell, nav, card layout, typography, etc., but adapted to TranslateChan's rooms.
4. Edit app.js: extend DESIGN_VARIANTS 1-36 label "36 Chan Library", keep applyDesignVariant, extend enhanceRoomLayout for 36 per library design — may need new render path that creates library-style cards, search, filters, dossier.
5. If zip contains assets (images, fonts), copy to `docs/` and root, ensure `docs/` mirror identical, keep bundle <30MB
6. Mirror docs/: cp app.css docs/app.css; cp app.js docs/app.js; cp app_data.js docs/app_data.js (byte-identical rebuild via build_data_bundle.py) + any new assets
7. Build: python3 scripts/build_data_bundle.py must produce byte-identical 1,693,251 B unchanged
8. Gates: text integrity MUST PASS (py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build deterministic, preservation 0 unauthorized, review 138), presentation allowed to break (smoke, diff -rq continue-on-error per RULING_GATES_EXPERIMENT), law gate must PASS (website ruling + common qualities)
9. Bundle raw <30MB (expect ~7MB with 36 layouts + assets)
10. Live demo: switcher 1-36, 36 new Chan Library integration

## LAW — Must Be In Prompt And PR Description Verbatim

**RULING 2026-09-14 definitive verbatim law:**
"In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask 'does this look good?', 'Is this the right direction?', 'how good is it on a scale from 1-10 where we aim for at least 8?'. This is definitive."

**COMMON_QUALITIES 2026-09-14 verbatim:**
"All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is."

**Additional rulings:**
- RULING_BUNDLE_CEILING_2026-09-14: Bundle ceiling 30MB testing phase, technically feasible
- RULING_GATES_EXPERIMENT_2026-09-14: Text integrity required, presentation optional while experimenting, allowed to break presentation
- Colors of 1 ideal already, whole issue is website design, layout-focused vary structure for light mental load, but for demo 36 Chan Library integration may use library's own colors as demonstration — note in PR
- 1-35 live main 268bf9c, now 36 Chan Library integration from provided zip

## Acceptance Criteria

- [ ] PR from feature/phase5-demo-36-chan-library-integration to main, base 268bf9c
- [ ] Keeps 1-35 untouched (1 no override, 2 byte-identical, 3-7 truly drastic PR79, 8-15 usable PR80, 16-25 more usable PR81, 26-35 final batch PR82)
- [ ] Adds 36 Chan Library integration from provided chan-buddhism-digital-library.zip — unzipped, inspected, integrated as [data-design="36"] 500-1000 lines CSS + JS enhance path, assets if any <30MB
- [ ] 36 implements library's design language but adapted to TranslateChan data (35 texts, 34 teachers, 24 cases, 31 terms) and common qualities 34/34 24/24 31/31 4/4
- [ ] Switcher 1-36 live, persistent
- [ ] Text integrity PASS: py_compile, validate_data, build deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138
- [ ] Presentation allowed to break but law gate PASS
- [ ] Bundle <30MB
- [ ] No style=, 4 setProperty, CSP untouched, no corpus edits (except allowlisted)
- [ ] PR description includes LAW verbatim + COMMON_QUALITIES + what zip contained + how integrated as 36 + questions per LAW

## BANNED COMMANDS

- NEVER git show <sha> on bundle commit — use --name-only or --stat or ls -lh app_data.js
- NEVER git log -p on bundle
- NEVER edit data/ corpus or app_data.js manually — only via build_data_bundle.py

## Questions Per LAW (must ask in PR)

- Does this demo 36 Chan Library integration look good compared to 1-35?
- Is this the right direction — integrate provided library design as demo 36, keep 1-35, add 36?
- How good is it 1-10 where we aim at least 8? Overall and per 36?
- Which elements from 36 should be handpicked for targeted build?
- Ready for review and targeted build after 1-36?
