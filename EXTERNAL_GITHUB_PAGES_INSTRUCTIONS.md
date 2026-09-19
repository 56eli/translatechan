# External GitHub Pages Agents — Instructions — TranslateChan — 2026-09-18

This file is a concise hand-off for agents outside `56eli/translatechan` who will build the new GitHub Pages site. Full spec: `.orchestrator/specs/GITHUB_PAGES_OUTSOURCE_SPEC_2026-09-18.md`

## Quick Start

```bash
git clone https://github.com/56eli/translatechan.git
cd translatechan
git checkout main  # pin 82e59d5 — complete 36 distinct rebuild DONE
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
python3 scripts/test_website_ruling.py
```

Live current site: https://56eli.github.io/translatechan/ — switcher 1-36, each variant is a NEW skeleton per grid six-axis unique (not CSS reskin).

## What to Build

- **Goal:** One beautiful, usable, hand-pickable page (or a small set) that feels 8+/10 — not 36 permutations. Pick best elements from variants 3-36 (owner rated 3-12 all 6/10, 13-35 awaiting rating) or propose a new structure.
- **Keep:** Text integrity hard law — no Chinese normalised, Compare room carries both readings, every work/teacher has info section where from / related / background.
- **Light mental load:** Minimum info default, extra behind expand/hover/toggle, English first, not dense, comfortable to read, easy to navigate, piece meal plain language.

## Constraints (must not break)

- `data/corpus/*.json` frozen — only via `build_data_bundle.py`
- `app_data.js` deterministic 1,693,251 B — never manual edit
- `index.html` style= count 0
- `app.js` setProperty census 4 (at 160,220,336,5668) — rebuild adds 0
- CSP meta untouched
- Floor ≥0.72rem — no font-size <0.72rem introduced in variant scope (check via `scripts/check_layout_variant.py N`)
- Weight ≤40KB per variant own CSS+JS
- Distinctness: no duplicated rule bodies above 10% threshold, own namespace (e.g., `v31w-`)
- Isolation: pure append at tails if keeping old site, neighbors byte-untouched, idempotent guards, `resetLayoutRuntime` hooked
- Bundle <30MB, switcher intact if keeping switcher, no new runtime deps, no secrets

## GitHub Pages Deployment Options

Current: `main` branch `/docs` folder deployed. `docs/` is mirror synced by `build_data_bundle.py`.

You may:
- **Keep /docs** — update `app.css`/`app.js`/`docs/app.css`/`docs/app.js` via pure append
- **New /docs** — rebuild docs from scratch, document supersession
- **gh-pages branch** — create `gh-pages` branch with new site, document in PR and README, update GitHub Pages settings to deploy from `gh-pages` root
- **main root** — deploy from main root, document

Document your choice in PR description and README.

## PR Requirements (per LAW)

Every PR description must include verbatim:

**RULING 2026-09-14 law:**
"In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask 'does this look good?', 'Is this the right direction?', 'how good is it on a scale from 1-10 where we aim for at least 8?'. This is definitive."

**COMMON_QUALITIES:**
"All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is."

Plus: work order reference (https://github.com/56eli/temp/blob/main/2026-09-18-letter-002-36-distinct-rebuild.md), design grid reference, acceptance script output verbatim if layout-touching, canary reference, and questions per LAW.

## Questions to Ask Owner (required)

- Does this look good?
- Is this the right direction?
- How good is it on a scale from 1-10 where we aim for at least 8? Overall and per variant/room?
- Which feels 8+? Which room closest/furthest? Info sections more/less?
- Ready for owner rating before next batch? Any <6 will be rebuilt from scratch never patched.

## Verification

```bash
python3 scripts/check_layout_variant.py 31
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
python3 scripts/test_website_ruling.py
git diff --stat  # appends only if keeping old site
grep -c 'style=' index.html  # 0
```

## Banned Commands

- NEVER `git show <sha>` on bundle commit — use `--name-only` or `--stat`
- NEVER `git log -p` on bundle
- NEVER edit `data/` or `app_data.js` manually

## References

- Work order: https://github.com/56eli/temp/blob/main/2026-09-18-letter-002-36-distinct-rebuild.md
- Design grid: `.orchestrator/DESIGN_GRID_2026-09-18_36_DISTINCT.md`
- Spec: `.orchestrator/specs/GITHUB_PAGES_OUTSOURCE_SPEC_2026-09-18.md`
- Main: `82e59d5` — PRs #84-#90 merged, 36 distinct DONE
- Live: https://56eli.github.io/translatechan/
