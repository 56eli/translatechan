# Session 019ff0c0 — Audit + Design Feedback Collection (2026-08-11)

## What this session is

You are still not happy with the GitHub Pages page. This file is my full audit of the current state plus the design directions I prepared for your decision. Answer the questions in chat to pick a direction; I implement immediately after.

## Audit verification (just ran)

```text
Branch baseline            63dfe37 (main, merged PR #18 — the English-first redesign)
python3 -m py_compile      PASS
validate_data.py           PASS (35 docs, 1252 slots, 177 verified, 148/148 locators; 6 known lineage warnings)
build_data_bundle.py       PASS (root + docs/ byte-identical)
smoke_test.mjs             PASS (35 renderers, 0 crashes)
diff -rq data docs/data    PASS
Scoreboard                 7.2/10, repo_ready = fail (unchanged; top gaps: content rights, CI, Pages presentation, deployment)
```

The live site at `https://56eli.github.io/translatechan/` is byte-identical to what I have locally — so everything I audit here is exactly what you see live.

**Live preview of my workspace copy is running in Arena** (port 8080) so you can click through while deciding.

## What bothers people about the current page (my read as designer)

The last redesign (merged as PR #18) fixed "too plain + too Chinese-heavy": English-first headings, dark walnut hero, "The old texts are real. The translators are not." What it did NOT change — and my candidates for your unhappiness:

1. **Hero is the only designed moment.** Below the hero, the page still reads as a dashboard: dense sidebar of 35 works, pill toolbars, stacked panels. The identity dies after the first screen.
2. **Hero composition is still quiet.** 22rem walnut slab, small kicker, two stats. Competent, but it does not punch. The joke lands once, softly.
3. **The Reader (the product's core) has workbench chrome first:** mobile picker, sidebar, toolbar, document metadata, case strip — then text.
4. **Secondary rooms (Compare/Lineage/Cases/Terms)** share one visual grammar printed from the same molds; fine but samey.
5. **No screenshot evidence ever existed** (Chromium won't install in any sandbox so far) — so prior iterations flew blind. It is very possible real rendering issues (spacing, font loading, contrast) went unnoticed.

## Three prepared directions (mockups in `.arena/`)

- **A — Zen-minimal archive** (`design-concept-A-zen-minimal.png`): rice paper, giant serif English headline, red seal accent, hairline rules, no cards at all. The calmest option.
- **B — Full Chan-hall immersion** (`design-concept-B-chan-hall.png`): the whole site becomes the dark walnut hall — timber structure everywhere, paper reading sheets hung inside it. The most atmospheric; riskiest for readability if overdone.
- **C — Editorial print / factory** (`design-concept-C-editorial-print.png`): newspaper-grid, huge condensed type, mono metadata, red FAKE stamp over the headline. Boldest; leans hardest into the joke.
- **D — Refine current walnut** (no mockup): keep PR #18 structure, fix specifics you name (spacing, density, hero, rooms).

All four keep the five-room scope, zero-backend constraint, source-honesty badges, and the joke intact.

## Standing constraints I will respect

- Public views stay: Reader, Matrix, Lineage, Cases, Terms (smoke-guarded).
- Internal IDs (`translatechan_*`, `TRANSLATECHAN_DATA`) unchanged.
- No editing `.github/workflows/*` without your explicit OK (3 pending owner edits documented in `.scoreboard/manual-workflow-edits.md`).
- Quality gates re-run before every push; push every ~15 min / per sub-task.
