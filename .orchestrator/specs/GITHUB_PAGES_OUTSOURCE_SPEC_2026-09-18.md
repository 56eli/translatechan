# GitHub Pages Outsource SPEC — TranslateChan — 2026-09-18

**Purpose:** Hand-off spec for external agents (outside `56eli/translatechan`) to build a new GitHub Pages site for TranslateChan. This spec is self-contained; external agents do not need access to the internal orchestrator branch `arena/01a09829-translatechan`.

**Reference pin:** `main` at `82e59d5` — Merge PR #90 — Phase 1 Batch 6 final batch variants 31,32,33,34,35 rebuilt from scratch on NEW skeletons per grid, acceptance PASS x5, complete 3-35 rebuild + 36 faithful rebuild DONE per work order 2026-09-18-letter-002-36-distinct-rebuild.md. Live at https://56eli.github.io/translatechan/ with switcher 1-36.

## 1. Project Overview

TranslateChan = Fake Chan Factory — a playful AI translation factory for Classical Chan/Zen texts. Core data: 35 corpus files in `data/corpus/*.json`, 1252 slots, 177 verified, 21 matrix, 148/148 locators, 630 flagged, W1 source review. The site has 5 rooms: Read (reader), Compare (matrix), Lineage (lineage), Cases (gongan), Terms (lexicon). Each room renders Classical Chinese + English renderings + provenance.

**Text integrity is hard law:** No Chinese has been normalised, punctuated silently or corrected. Where editions disagree, Compare room carries both readings rather than resolving them. Every work and teacher must have an info section: where from, what/who related, background context.

## 2. Current GitHub Pages Setup (as of main 82e59d5)

- **Source:** `main` branch, `/docs` folder is deployed via GitHub Pages settings (Settings → Pages → Source: Deploy from a branch → Branch: main → Folder: /docs)
- **Root files:** `index.html` (24KB), `app.css` (~600KB after 36 distinct rebuilds), `app.js` (~550KB after rebuilds), `app_data.js` (1,693,251 bytes deterministic bundle), `theme-init.js`, `og-image.svg`, `robots.txt`, `sitemap.xml`
- **Mirror:** `docs/` contains identical copies of `index.html`, `app.css`, `app.js`, `app_data.js`, `data/` mirror, `theme-init.js`, etc. `docs/` is generated/synced by `python3 scripts/build_data_bundle.py` which:
  - Bundles 35 corpus JSON into `app_data.js` (deterministic, byte-identical)
  - Syncs root artifacts to `docs/` (including `data/` mirror)
- **CI:** `.github/workflows/quality.yml` — Quality workflow runs on push to main and PRs to main:
  - `py_compile` scripts/*.py
  - `validate_data.py` — corpus 35 slots 1252 verified 177 matrix 21 locators 148/148 flagged 630
  - `build_data_bundle.py` — rebuilds app_data.js deterministic
  - `test_source_preservation.py` — 0 unauthorized changes vs base 3cc7a8e9681e
  - `test_source_review_rules.py` — 138 W1 checks PASS
  - Per-variant acceptance gate for rebuilt layouts: detects `rebuild:N begin` in diff and runs `python3 scripts/check_layout_variant.py N` for each N — **required**, replaces continue-on-error presentation steps for rebuilt variants 3-36, variants 1-2 grandfathered
  - Mirror diff and smoke_test.mjs are `continue-on-error` while experimenting per RULING_GATES_EXPERIMENT_2026-09-14, but text-integrity gates are required
  - `test_website_ruling.py` — LAW enforced, kept ON

## 3. What External Agents Should Build

**Goal:** A new GitHub Pages site that is beautiful, done, usable, hand-pickable — not 36 permutations of one shared skeleton (F1/F2 failure). The current main 82e59d5 already has 36 DISTINCT skeletons per grid (six-axis unique), each structurally real (nav paradigm, reading-area DOM structure, IA order, density model, typography scale ≥0.72rem floor, interaction/disclosure). External agents should:

- **Option A (preferred):** Pick the best elements from variants 3-36 (owner rated 3-12 all 6/10, 13-35 awaiting rating) and build ONE targeted page that feels 8+/10 — light mental load, English first, not dense, comfortable to read, easy to navigate, piece meal plain language, info sections for every work and teacher.
- **Option B:** Propose a completely new GitHub Pages structure (e.g., separate pages per work/teacher, or a new shell) that still respects text-integrity and COMMON_QUALITIES, and that can be deployed via `docs/` or via GitHub Pages from `main` root or via `gh-pages` branch — document the choice.

**Out of scope for external agents:**
- No edits to `data/corpus/*.json` or `app_data.js` manually — only via `build_data_bundle.py`
- No new runtime dependencies (registry-free, zero-backend)
- No secrets committed
- No `style=` attributes (must stay 0), no new `.style.setProperty` (census stays 4 at app.js:160,220,336,5668), CSP meta untouched (`default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'`)
- No `git show <sha>` on bundle commit, no `git log -p` on bundle

## 4. Design Grid Reference (Phase 0 item 1, approved)

33 slots 3-35 six axes unique, no tuple reused — `.orchestrator/DESIGN_GRID_2026-09-18_36_DISTINCT.md`:

| Variant | NP | RA | IA | DM | TS | ID | Description |
|---|---|---|---|---|---|---|---|
| 3 | none-focus | single-continuous-column | english-first-then-source | sparse-single-idea | scale-1.25-min-0.85rem | native-details | Focus Mode 38rem centered |
| 4 | bottom-tab-bar | horizontal-timeline | chronological | comfortable-default | scale-1.2-min-0.8rem | progressive-scroll | Timeline horizontal scroll-snap |
| 5 | side-rail-left | split-60-40-resizable | teacher-first | comfortable-default | scale-1.2-min-0.78rem-alt | tabs | Graph+Reader Split 32/68 resizable |
| 6 | hamburger-drawer | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.78rem | two-step | Minimal header + hamburger drawer |
| 7 | top-lintel | single-continuous-column | dossier-first | comfortable-default | scale-1.33-min-0.9rem | two-step | Info-First Dossier |
| 8 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.2-min-0.8rem | tabs | Tabbed + Breadcrumb |
| 9 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.85rem-alt | bottom-sheet | Bottom Sheet 46rem |
| 10 | side-rail-left | magazine-2col | english-first-then-source | comfortable-default | scale-1.25-min-0.85rem | native-details | Sticky TOC 16rem/1fr/16rem |
| 11 | top-lintel | card-stream | search-first | comfortable-default | scale-1.2-min-0.8rem | native-details | Search-First 32rem + 20rem cards |
| 12 | top-lintel | single-continuous-column | question-driven | comfortable-default | scale-1.125-min-0.78rem | native-details | Question-Driven drawers |
| 13 | side-rail-right | side-by-side-panes | english-first-then-source | comfortable-default | scale-1.2-min-0.78rem-alt | native-details | Side-by-Side |
| 14 | side-rail-right | single-continuous-column | work-first | comfortable-default | scale-1.25-min-0.85rem | expand-on-hover | Related Rail |
| 15 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.85rem-alt | expand-on-hover | Footnotes + Glossary |
| 16 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.2-min-0.8rem | progressive-scroll | Progressive Scroll |
| 17 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.78rem | modal | Modal Info |
| 18 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.2-min-0.8rem | expand-on-hover | Hover Cards |
| 19 | top-lintel | single-continuous-column | english-first-then-source | sparse-single-idea | scale-1.25-min-0.85rem | sentence-toggle | Sentence-by-Sentence |
| 20 | top-lintel | paginated-chapters | english-first-then-source | comfortable-default | scale-1.2-min-0.8rem | two-step | Chapter Chunks |
| 21 | top-lintel | single-continuous-column | work-first | comfortable-default | scale-1.33-min-0.9rem | two-step | Work Dossier |
| 22 | side-rail-left | single-continuous-column | teacher-first | comfortable-default | scale-1.25-min-0.85rem | native-details | Teacher Dossier |
| 23 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.78rem | two-step | Two-Step Reader |
| 24 | top-lintel | single-continuous-column | search-first | comfortable-default | scale-1.2-min-0.8rem | command-palette | Command Palette |
| 25 | top-bar+side-rail | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.85rem-alt | bookmark-trail | Trail+PrevNext+Slider+InlineOrigin |
| 26 | top-lintel | single-continuous-column | english-first-then-source | comfortable-default | scale-1.2-min-0.78rem-alt | native-details | Empty State Guidance |
| 27 | top-lintel | side-by-side-panes | english-first-then-source | compact-reference | scale-1.2-min-0.8rem | native-details | Comparison Slider |
| 28 | side-rail-left | single-continuous-column | teacher-first | comfortable-default | scale-1.125-min-0.78rem | expand-on-hover | Inline Teacher Origin |
| 29 | top-bar+side-rail | full-bleed | english-first-then-source | comfortable-default | scale-1.25-min-0.85rem | native-details | Minimal Header Full-Bleed |
| 30 | top-lintel | magazine-2col | english-first-then-source | comfortable-default | scale-1.33-min-0.9rem | native-details | Magazine Spread |
| 31 | top-lintel | masonry-wall | thematic | comfortable-default | scale-1.2-min-0.8rem | modal | Card Wall masonry |
| 32 | side-rail-left | vertical-timeline | chronological | comfortable-default | scale-1.2-min-0.78rem-alt | native-details | Vertical Timeline |
| 33 | side-rail-right | split-60-40-resizable | english-first-then-source | comfortable-default | scale-1.125-min-0.85rem-alt | native-details | Split Resizable 60/40 |
| 34 | side-rail-left | single-continuous-column | english-first-then-source | comfortable-default | scale-1.125-min-0.78rem | expand-on-hover | Glossary Sidebar |
| 35 | bottom-sheet-nav | single-continuous-column | english-first-then-source | sparse-single-idea | scale-1.25-min-0.85rem | bookmark-trail | Focus+TOC Hybrid |

Variant 36 not in grid — Batch 0 alone, rebuilt faithfully from owner's zip `chan-buddhism-digital-library.zip` 293KB, visual system on its own structure, not assimilated into shared skeleton (F7 cure), native structures preserved, 112 CSS rules 20916B +13296B JS =33.4KB ≤40KB.

Each slot's six-tuple must be structurally real: DOM structure actually changes, not CSS reskin. New class namespace over old DOM is exactly F1/F2 failure and fails distinctness gate item 2(d).

## 5. Acceptance Criteria (from work order section 3)

For any new GitHub Pages work that touches layout:

1. Unique grid combination implemented structurally if reusing grid — variant realizes its slot's six-axis tuple as real DOM-structure change, and that tuple is unique across approved grid
2. Acceptance script PASS for any rebuilt variant — floor (a), invariants (b), weight (c), distinctness (d), isolation (e) all PASS with file:line evidence — run `python3 scripts/check_layout_variant.py N`
3. Suites green — required text-integrity gates pass unchanged: py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build deterministic app_data.js 1,693,251 B unchanged, preservation 0 unauthorized, review 138, website ruling PASS
4. Switcher intact — variant registers in switcher and applies/tears down through existing mechanism app.js:601-694 without breaking any other variant (if keeping switcher)
5. Neighbors byte-untouched — diff is pure append; no other variant's scope or base shell changed (app.css/app.js receive appends only at tails, no reorganization/dedup per out of scope) — if building a new site, document why this rule is superseded and how you preserve old site
6. Quoted script output in PR — batch PR quotes acceptance script's verbatim PASS output
7. Owner rating recorded — owner's 1-10 rating recorded before next batch (item 7)
8. <6 ⇒ rebuild — any variant rated below 6 is rebuilt from scratch from fresh grid slot, never patched

## 6. LAW — Must Be In Prompt And PR Description Verbatim

**RULING 2026-09-14 definitive verbatim law:**
"In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask 'does this look good?', 'Is this the right direction?', 'how good is it on a scale from 1-10 where we aim for at least 8?'. This is definitive."

**COMMON_QUALITIES 2026-09-14 verbatim:**
"All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is."

**Additional rulings:**
- RULING_BUNDLE_CEILING_2026-09-14: Bundle ceiling 30MB testing phase, technically feasible
- RULING_GATES_EXPERIMENT_2026-09-14: Text integrity required, presentation optional while experimenting, allowed to break presentation — AMENDED narrowly per work order item 3: presentation gates RETURN for rebuilds as per-variant acceptance checks (scripts/check_layout_variant.py), while free experimentation elsewhere continues, variants 1-2 grandfathered
- Work order 2026-09-18-letter-002: 36-distinct rebuild, 33 slots six axes unique grid approved, acceptance script required, canary PASS variant 3, Batch0 variant 36 faithful rebuild PASS PR84 merged main f110e41, Batch1 3-6 PASS PR85 merged main 4bf40dc owner rating all 6/10, Batch2 7-12 PASS PR86 merged main d57aa4c owner rating all 6/10, Batch3 13-18 PASS PR87 merged main 22e2f27, Batch4 19-24 PASS PR88 merged main 493bde3, Batch5 25-30 PASS PR89 merged main 577882e, Batch6 31-35 final batch PASS PR90 merged main 82e59d5, complete 3-35 rebuild + 36 faithful rebuild DONE per work order, 36 DISTINCT achieved structurally

## 7. Verification Runbook (for external agents)

```
# 1. Acceptance per variant (if touching layout):
python3 scripts/check_layout_variant.py 31
# → expect per-check PASS with file:line evidence, quote verbatim in PR

# 2. Required text-integrity gates:
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
python3 scripts/test_website_ruling.py

# 3. Isolation proof:
git diff --stat  # appends only at app.css/app.js tails if keeping old site
grep -c 'style=' index.html  # stays 0
grep -c '\.style\.setProperty' app.js  # stays 4
ls -lh app_data.js docs/app_data.js  # 1,693,251 B deterministic
```

## 8. Handoff Instructions for External Agents

1. **Fetch main:** `git clone https://github.com/56eli/translatechan.git && cd translatechan && git checkout main` — pin at `82e59d5` or latest main.
2. **Read this spec** and `.orchestrator/DESIGN_GRID_2026-09-18_36_DISTINCT.md` and work order letter 002 at https://github.com/56eli/temp/blob/main/2026-09-18-letter-002-36-distinct-rebuild.md
3. **Do not edit** `data/corpus/*.json` or `app_data.js` manually. If you need to rebuild bundle, run `python3 scripts/build_data_bundle.py`.
4. **Build new GitHub Pages:**
   - If you keep current site: append only at `app.css`/`app.js` tails, use `rebuild:N begin/end` markers, follow acceptance script, keep `docs/` mirror synced.
   - If you build a new site: create a new branch `feature/new-pages-*`, document in PR why you supersede pure-append rule, ensure old site remains accessible via switcher or via `/docs` archive, and ensure text-integrity gates still PASS.
   - GitHub Pages can be deployed from `main` `/docs` (current), from `main` root, or from `gh-pages` branch — document your choice in PR and update `README.md` with deployment instructions.
5. **Test locally:** `python3 -m http.server 8000` or `npx serve docs` and open https://{port}-{sandboxId}.e2b.app preview — bind to 0.0.0.0, allow preview host.
6. **Ask owner per LAW:** Every PR description must include LAW verbatim + COMMON_QUALITIES verbatim + work order reference + design grid reference + acceptance script output verbatim (if layout-touching) + questions: "does this look good?", "Is this the right direction?", "how good is it on a scale from 1-10 where we aim for at least 8?" — aim 8+.
7. **No schedule pressure:** Owner rates 1-10 before next batch, <6 rebuilt from scratch never patched. Switcher count is non-metric.
8. **Security:** Never commit secrets, never request GitHub tokens. If `gh` auth fails with 401/403 Bad credentials, ask operator to reconnect GitHub.

## 9. Deliverables Expected from External Agents

- One PR per batch (4-6 variants) or one PR for a single new Pages site — base `main`, pure append if keeping old site, or documented supersession if building new.
- PR description includes: LAW verbatim, COMMON_QUALITIES verbatim, work order reference, design grid reference, acceptance script output verbatim, canary reference, questions per LAW.
- Live preview link and screenshots (optional but helpful).
- Updated `README.md` with how to run Pages locally and how GitHub Pages is configured.

## 10. Out of Scope

- Variants 1-2 and base shell untouched unless you document why; floor cleanup deferred (grandfathered)
- Text integrity / corpus / scripts not part of presentation rebuild
- New runtime dependencies none
- Ratings-file / infrastructure niceties owner-deferred
- No base-file refactor beyond pure appends unless building a new site and documenting supersession

## 11. References

- Work order: https://github.com/56eli/temp/blob/main/2026-09-18-letter-002-36-distinct-rebuild.md
- Design grid: `.orchestrator/DESIGN_GRID_2026-09-18_36_DISTINCT.md`
- Canary: `.orchestrator/CANARY_V3_PASS_2026-09-18.md`
- Acceptance script: `scripts/check_layout_variant.py`
- Quality workflow: `.github/workflows/quality.yml`
- Current live: https://56eli.github.io/translatechan/
- Main pin: `82e59d5` — complete 3-35 rebuild + 36 faithful rebuild DONE
