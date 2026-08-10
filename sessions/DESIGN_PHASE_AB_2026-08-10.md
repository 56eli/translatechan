# Web Redesign Phase A+B — Shell & Reader — 2026-08-10

> **Session:** `arena/019febb1-translatechan`
> **Owner choices:** production shell + Reader together; structural walnut; front matter collapsed by default.
> **Plan:** [`WEB_DESIGN_GAP_PLAN_2026-08-10.md`](./WEB_DESIGN_GAP_PLAN_2026-08-10.md)
> **Status:** implemented and available in the live preview; explicit owner visual approval is still required before calling the vision fulfilled.

## Why this scope

A shell-only patch would have repeated the original failure: a themed edge around an unchanged dashboard. Phase A+B changes the production composition from the global lintel through the first reading viewport, while preserving all corpus, routing, search, provenance, print, and accessibility behavior.

## Phase A — walnut shell and first fold

### Structural walnut shell

- Replaced the wrapping light app header with a two-row dark-walnut shell.
- First row: restrained Chinese/English brand and compact search/theme/type utilities.
- Second row: the five approved rooms with Chinese names:
  - 閱藏堂 / Reader;
  - 對勘 / Matrix;
  - 傳法堂 / Lineage;
  - 公案架 / Gong’an;
  - 詞林 / Lexicon.
- Removed persistent nav emoji and the always-visible humorous Robo subtitle.
- Added structural wood tokens (`--wood-950/900/800`) rather than decorative motifs.

### Measured sticky geometry

- `ResizeObserver` measures the actual shell and writes `--shell-height`.
- Reader toolbar and corpus shelf use that value instead of hard-coded `top` offsets.
- Case rail is no longer sticky, eliminating the multi-row sticky wall.

### Initial-only gate

- Gate is shown only in Reader, not above all five rooms.
- Copy reduced to one joke line and one factual line.
- Removed duplicate English gate branding; the shell carries the persistent English name.
- Counts are plain mono facts, not pill cards.

### First source text

- Reader metadata is condensed into title/status plus progressive source/edition details.
- Preface is preserved as a collapsed `序 / Front matter` disclosure.
- Case 1 follows the compact case rail instead of a full preface card.
- Playwright now requires Case 1 to reach the first 1280×900 viewport.

## Phase B — Reader as literature

### Corpus shelf

Replaced 35 large rounded buttons with compact typographic rows grouped from live editorial status:

- Complete witnesses: 2;
- Partial witnesses: 2;
- Excerpt seeds: 31.

Each row separates English and Chinese titles, keeps canon/coverage compact, and uses a walnut/gold left rule for selection.

### Unified responsive breakpoint

- Desktop shelf hides at 1100px.
- Mobile work chooser appears at the same 1100px breakpoint.
- Removes the former 961–1100px state where a full-height sticky sidebar sat above the Reader.

### Document rail

- Removed “Active View,” “Side-by-Side Sentence Alignment,” and “Hover Lexicon Enabled” chips.
- Reading mode, type size, and Print now share one compact sticky rail below the measured shell.
- Reading-mode state exposes `aria-pressed`.

### Reading sheet

- Reader content is constrained to a 900px literary measure.
- Reader case cards become ruled, shadowless source units.
- Translation columns become paper columns separated by rules instead of nested cards.
- Commentary and verse are quieter ruled/indented blocks.
- Wumenguan/Biyanlu scholarly labels and all previously fixed behavior remain intact.

### Case rail

- 48–100 case controls stay on one horizontal line.
- Visual display is number-led; full Chinese title remains in accessible label/title markup.
- No title-wrapped sticky block.

### Mobile controls

- Bottom reading controls display only in Reader.
- Rail is start-aligned rather than centered-overflow.
- Body padding includes safe-area height only while Reader controls are active.
- Mobile Reader mode labels no longer use decorative emoji.

### Responsive Lineage safeguard

- Reduced graph minimum logical width from 720px to 360px to prevent forced narrow-screen overflow.

## Visual-system changes in this pass

- Reduced core button radius from pill/20px to 4px.
- Active states use paper/gold with dark text rather than low-contrast white on bright gold.
- Gong’an filters and Reader modes expose `aria-pressed` and use the safer active treatment.
- Static presentation emoji count reduced by removing nav/brand/mode decoration.
- Dark walnut is now a persistent architectural surface, not a 4px hero accent.

## Regression coverage

Dependency-free smoke now checks:

- walnut shell and five Chinese room labels;
- shell-height/current-view synchronization;
- grouped 2/2/31 corpus shelf;
- collapsed front matter and progressive document details;
- toolbar offset from `--shell-height`;
- static single-row case rail;
- Reader-only/start-aligned mobile controls;
- reader-mode `aria-pressed`;
- all prior containment and functional regressions.

Playwright additions require, when Chromium is available:

- five room labels and 2/2/31 shelf groups;
- collapsed front matter;
- Case 1 in the first desktop viewport;
- no desktop/mobile page overflow;
- Reader controls hidden after switching to Matrix.

## Still intentionally unfinished

This pass does **not** declare the vision fulfilled. Remaining design phases:

1. Phase C: remove most remaining inline styles, reduce generated emoji ≥70%, standardize notices/statuses/buttons, and contrast-test both themes.
2. Phase D: redesign Matrix as proof sheet, Lineage as transmission chart/directory, Gong’an as catalogue rows, Lexicon as dictionary rows.
3. Phase E: current light/dark screenshot matrix, non-skippable browser/visual tests, keyboard/screen-reader review, and explicit owner approval.

## Validation

```text
python3 -m py_compile scripts/*.py          PASS
python3 scripts/validate_data.py            PASS with 6 known lineage warnings
node --check app.js                         PASS
node --check scripts/smoke_test.mjs         PASS
node --check scripts/browser_test.mjs       PASS
python3 scripts/build_data_bundle.py        PASS; root/docs mirrored
node scripts/smoke_test.mjs                 PASS; 35 fixtures, 0 crashes
```

## One-sentence summary

The production shell and Reader now use structural walnut, Chinese room navigation, first-fold source text, a truthful grouped shelf, and a ruled literature layout—but owner screenshot/live-preview approval and the four secondary-room redesigns still stand between this pass and the full vision.
