# Web Vision Gap Analysis & Redesign Plan — 2026-08-10

> **Session:** `arena/019febb1-translatechan`
> **Direction from owner:** the page does not come close to the approved “Chinese Chan hall in dark walnut; practical joke once, then serious literature” vision. Investigate what must change; full planning freedom granted.
> **Implementation update:** owner approved production shell + Reader, structural walnut, and collapsed front matter. Phase A+B is implemented in [`DESIGN_PHASE_AB_2026-08-10.md`](./DESIGN_PHASE_AB_2026-08-10.md), pending live visual approval. Phases C–E remain.

## 1. Verdict

The owner is correct. The site has a **Chinese Chan hall sentence and a four-pixel walnut border**, not a Chinese Chan hall experience. The previous completion sentence confused shipping one masthead slice with fulfilling the whole vision.

After the hero, the interface is still a generic rounded-card dashboard:

- a crowded multi-row app header;
- five emoji tab pills;
- a second duplicate brand block in the hero;
- a 35-button sidebar;
- chips for metadata/status;
- sticky toolbar plus a potentially multi-row sticky case index;
- repeated rounded cards, shadows, emoji labels, and inline styles;
- the actual first case pushed well below the “gate.”

The code currently contains **114 visible emoji/symbol occurrences** across static/generated presentation, **85 inline-style occurrences** (19 HTML + 66 JS templates), 14–20px card radii, pill controls throughout, and 291 CSS lines matching card/chip/grid/background/sticky/font visual vocabulary. That visual grammar reads as “small SaaS knowledge dashboard,” not “serious Chinese literature hall.”

The design needs a **shell and information-architecture redesign**, not more ornamental CSS.

## 2. Where the implementation contradicts the vision

| Vision promise | Current implementation | Gap |
|---|---|---|
| Enter a Chinese Chan hall in dark walnut | Light rice-paper header; walnut appears mainly as a 4px hero border | Wood is a comment/accent, not spatial structure |
| Practical joke once | Robot in persistent header, hero, counts, nav/mode controls, status system, and generated content | Humor/icon language remains persistent chrome |
| First case directly below the gate | Header → hero → toolbar → document metadata → case strip → full preface → Case 1 | Reading does not begin near the gate; it begins far below it |
| Serious literature after hero | Emoji metadata chips, rounded cards, status pills, popovers, shadows, repeated notices | Dashboard chrome dominates literary text |
| Transparent flow, no choppiness | Sticky global header, toolbar at `top:.25rem`, case strip at `top:4.4rem`; breakpoint split at 1100 vs sidebar hide at 960 | Overlap and discontinuous tablet layout are structurally built in |
| No overflow | Mobile action bar horizontally overflows with centered content; lineage uses 720px minimum; long case strip wraps/sticks | Multiple narrow-screen overflow risks |
| Chinese hall rooms | English emoji tab pills; Chinese room names from the vision are absent | Sitemap metaphor was documented but not implemented |
| Dark walnut lean | Most surfaces are white cards with rounded corners/shadows; dark mode is generic charcoal | Material hierarchy does not support the concept |
| Sophisticated minimal | 85 inline styles and over 100 emoji/symbol uses create many local visual decisions | No restrained component grammar |
| Literature-first hierarchy | Source, coverage, metadata, toolbar, badges, and controls precede text | Interface information outranks the literature |
| Humor only in Robo names after hero | Persistent “Robo-Translators Robolating…” header subtitle and “real-fakeness score” UI language | Joke never fully yields to the reading room |
| Calm responsive reading | At 961–1100px the sidebar becomes a full-width sticky block above the reader | Common tablet/laptop width is especially poor |
| Accessible refinement | Active gold/white contrast can be 2.46:1 in dark mode; several controls lack pressed/related tooltip semantics | “Sophisticated” is not yet inclusive or verified |

## 3. Why the first redesign did not land

### 3.1 It changed branding, not composition

The previous pass changed hero copy, border, type, OG art, and footer. It did not change the page skeleton, content order, navigation density, reader measure, responsive behavior, or card language. A visual concept cannot be delivered by one component while every surrounding component follows a different system.

### 3.2 It treated existing components as already good

The vision repeatedly says “keep” or “already” for the card system, matrix, dossier, sidebar, toolbar, and filters. That protected the generic dashboard structure from redesign. The new plan treats those as open design problems.

### 3.3 It used self-reported success criteria

Claims such as “wants screenshot? yes,” “feels calm,” “a11y ≥95,” and “first meaningful print <1.5s” were not measured. There is no screenshot baseline, Lighthouse run, browser viewport matrix, visual regression, or real-device review in CI. Goals were written as outcomes.

### 3.4 It optimized micro-polish before hierarchy

Z-index, emoji accessibility, ellipsis, OG art, and footer removal are useful details, but they cannot fix a page where the first source text comes after several layers of chrome.

### 3.5 The vision document contains stale product assumptions

It still described four “complete scrolls” and a Complete/Excerpt split. Current editorial truth is two complete selected witnesses, two partial selected witnesses, and 31 excerpt seeds. The visual IA must reflect the real editorial model.

## 4. Target experience

### 4.1 Design principle

**Use dark walnut as architecture, rice paper as reading surface, and ink as hierarchy. Do not use Chinese motifs as decoration.**

No temple illustration, fake parchment texture, seals, lanterns, lattice patterns, or animation are needed. The hall feeling should come from proportion, beams/rules, typography, quiet spacing, restrained color, and rooms that make sense.

### 4.2 Target first screen (desktop, 1280×800)

```text
┌──────────────── dark walnut lintel / global shell ────────────────┐
│ 假禪工廠  Fake Chan Factory          Search   Theme   Settings    │
│ 閱藏堂 Reader · 對勘 Matrix · 傳法堂 Lineage · 公案架 · 詞林     │
└────────────────────────────────────────────────────────────────────┘

  假禪工廠                 source-tracked Chinese · Robo disclosed
  「平常心是道。」          [small dismiss]
  ─────────────────────────────────────────────────────────────────

  無門關  The Gateless Gate                 T2005 · complete witness
  [Works shelf]       第一則 趙州狗子
  Complete (2)        狗子還有佛性也無？州云：無。
  Partial (2)         Gǒuzi hái yǒu fóxìng yě wú?...
  Excerpts (31)       ─────────────────────────────────────────────
                      Robo Red Pine             Robo T-Cleary
                      translation               translation
```

Acceptance target: on a 1280×800 viewport, the first source Chinese for the selected reading is visible without scrolling. The preface remains available as a quiet “序 / Front matter” disclosure, not a full card blocking Case 1.

### 4.3 Target mobile first screen (390×844)

```text
┌──── walnut shell ─────────────────────────┐
│ 假禪工廠                       Search  ☾  │
│ Reader · Matrix · Lineage · Index · Terms │
└────────────────────────────────────────────┘

假禪工廠 — practical joke once 🤖      ×
source-tracked Chinese · Robo disclosed
────────────────────────────────────────
無門關                    Change work
第一則 趙州狗子
狗子還有佛性也無？州云：無。
Gǒuzi hái yǒu...
────────────────────────────────────────
Robo Red Pine
...
```

The bottom Reader bar appears only in Reader. It is start-aligned and never clips its first control. Other views receive no irrelevant reading toolbar.

## 5. New visual system

### 5.1 Materials and tokens

Keep the existing palette family but change how it is used:

```css
--wood-950: #211814;   /* shell/lintel */
--wood-900: #2c211c;   /* primary timber */
--wood-800: #3a2a22;   /* raised/hover timber */
--paper-100: #fbf8f1;  /* page */
--paper-200: #f4eee2;  /* secondary page */
--paper-300: #e6dcc8;  /* rules */
--ink-950: #201b18;
--ink-700: #514842;
--ink-500: #726860;
--gold-700: #80591f;   /* AA-safe text on paper */
--verified-700: #285a45;
--robo-700: #254f6a;
```

Dark mode needs independently contrast-tested tokens; it must not reuse bright gold as a small white-text button background.

### 5.2 Shape grammar

- Main sections: square or 2–4px corners, ruled edges, no shadow.
- Reading sheets: 0–4px radius, one subtle border; no hover lift.
- Popovers/dossier: 6–8px radius and the only meaningful shadows.
- Pills: only true filters/statuses; ordinary buttons become quiet text/outlined controls.
- Stop using 14–20px rounded cards as the universal container.

### 5.3 Type grammar

- Hall/display: Chinese serif/Kai, large but not billboard-like.
- Source text: Chinese serif, line-height 1.9–2.05, constrained measure.
- Translation: serif for reading, sans only for UI metadata.
- UI: one small sans scale; avoid many 0.68–0.78rem variants.
- Counts/locators: mono where useful.

### 5.4 Icon grammar

Keep:

- one 🤖 in the dismissible gate;
- 🤖 in actual Robo translator names/status;
- ✅ for edition-verified wording;
- simple disclosure symbol where necessary.

Remove/reduce:

- nav emojis;
- metadata emojis (scroll, author, era, genre);
- card-title emojis;
- Matrix lightbulbs;
- dossier row emojis;
- Gong’an theme/link emoji decoration;
- Reader mode emoji where text/Chinese labels suffice.

Target: reduce non-content emoji/symbol presentation by at least 70%.

## 6. Information architecture changes

### 6.1 Global shell

1. Replace the wrapping three-cluster header with two stable rows inside one walnut shell:
   - row 1: brand + compact utilities;
   - row 2: five room links.
2. Add muted Chinese room labels:
   - 閱藏堂 / Reader;
   - 對勘 / Matrix;
   - 傳法堂 / Lineage;
   - 公案架 / Gong’an;
   - 詞林 / Lexicon.
3. Remove nav emojis and persistent humorous subtitle.
4. Keep global search, but compact it at narrow widths and open it without rearranging the whole header.
5. Measure shell height with `ResizeObserver` and set `--shell-height`; all sticky descendants use that variable.

### 6.2 Gate/hero

1. Show the gate only on initial Reader/home state, not above every room.
2. Reduce copy to one joke line and one factual line.
3. After dismissal or navigation, retain a tiny “About” utility; never reinsert the full gate automatically.
4. Eliminate duplicate English branding between shell and gate by making the gate primarily Chinese/title-led.
5. Treat the gate as an entry lintel, not another rounded card.

### 6.3 Reader hierarchy

1. Replace the 35 large corpus buttons with a typographic shelf:
   - Complete witnesses (2);
   - Partial witnesses (2);
   - Excerpt seeds (31).
2. Use compact rows with title, canon ID, and status; selected row gets a walnut rule, not a filled card.
3. At the same breakpoint where the shelf disappears, show the mobile work chooser. Remove the current 1100/960 split.
4. Combine reader toolbar and document header:
   - title/status on left;
   - mode/type/print on right;
   - details disclose author/era/genre/source when requested.
5. Remove “Active View,” “Side-by-Side Sentence Alignment,” and “Hover Lexicon Enabled” chips; they state obvious implementation features instead of helping reading.
6. Make the case index a single-row horizontal rail. Titles appear on focus/hover or in a separate jump menu; do not make 48–100 titled chips wrap into a sticky wall.
7. Put front matter in a restrained disclosure above Case 1, collapsed by default for returning readers.
8. Constrain the literary reading measure to approximately 820–900px; allow Matrix to use the wide canvas.
9. Make provenance progressive:
   - visible concise status/source line;
   - full detail on demand;
   - no repeated multi-line citation block under every short translation by default.

### 6.4 Mobile Reader controls

1. Add the active view as `data-current-view` on body/app shell.
2. Display the bottom action bar only for Reader.
3. Start-align the scroll rail; add edge fades/scroll affordance rather than centered overflow.
4. Include safe-area height in body padding.
5. Reduce controls to essential mode, type, case index, top; move rarely used actions into the document toolbar.

## 7. Room-by-room redesign

### 7.1 Reader / 閱藏堂

Goal: a calm edition, not a feed of cards.

- Case units separated by generous whitespace and fine rules.
- Source Chinese is the strongest object.
- Pinyin is quieter and optional.
- Translation columns are paper columns without nested card chrome.
- Status labels sit near translator names, not as colorful badges repeated below.
- Commentary and verse use typographic indents/rules, not tinted boxes.

### 7.2 Matrix / 對勘

Goal: a proof sheet.

- Source sentence forms one full-width header band.
- Translator registers form equal columns with a shared baseline.
- Work/edition/status is a compact header; source detail expands.
- Remove 💡 notes and generic card shadows; use marginal notes or a final critical-note row.
- On mobile, one register at a time with a selector; avoid squeezed columns.

### 7.3 Lineage / 傳法堂

Goal: a transmission chart on paper.

- Remove 720px minimum; responsive viewBox from actual container width.
- Use quiet edge legend and status line, not pill-heavy toolbar.
- Graph gets the room’s wide canvas; dossier appears as a side sheet on desktop and in-flow sheet on mobile.
- Cards mode becomes a compact chronological directory rather than generic cards.

### 7.4 Gong’an / 公案架

Goal: a shelf/catalogue.

- Theme groups become a compact index rail.
- Cases become ruled catalogue rows with collection/case, title, protagonist, and one-line summary.
- Cross-references are small textual links/tags without emoji.
- A selected theme updates a visible result count and `aria-pressed` state.

### 7.5 Lexicon / 詞林

Goal: a dictionary.

- Alphabetical/category index rail.
- Terms rendered as definition rows, not a card grid.
- Chinese headword, pinyin/literal, definition, occurrences in a consistent typographic grid.
- Search/category controls share one calm filter row.

## 8. Responsive and accessibility requirements

These are design acceptance criteria, not follow-up polish:

1. No horizontal page overflow at 320, 360, 390, 768, 1024, 1280, 1440px.
2. One breakpoint controls desktop shelf versus mobile chooser.
3. No sticky element sits beneath the measured shell.
4. Maximum two sticky layers in Reader: shell + compact document rail.
5. Reader bottom controls absent outside Reader.
6. All normal text/control contrast ≥4.5:1 in both themes.
7. Active filter/mode buttons expose `aria-pressed`; radio groups follow keyboard patterns.
8. Tooltips/popovers are related with `aria-describedby`/expanded state where appropriate.
9. 200% zoom remains usable with no clipped controls.
10. Forced-colors and reduced-motion behavior remain functional.
11. Keyboard order follows visual reading order.

## 9. Engineering cleanup required to make the design coherent

1. Replace 85 inline style occurrences with named components/classes before broad restyling.
2. Introduce layout primitives:
   - `.site-shell`, `.room-nav`, `.reading-sheet`, `.document-rail`, `.source-ledger`, `.catalog-row`, `.definition-row`, `.notice`.
3. Add `data-current-view` and `--shell-height` behavior.
4. Separate global shell styles, Reader styles, and room styles into ordered CSS sections or modules.
5. Stop leaving session/audit commentary in production CSS/JS; comments should explain enduring intent.
6. Add a visual-test route/state fixture for each room with deterministic data.
7. Make Playwright non-skippable in CI when the owner approves workflow changes.

## 10. Implementation sequence

### Phase A — Shell and first fold (highest visual return)

- Build walnut two-row shell and room navigation.
- Remove nav emojis/persistent joke subtitle.
- Restrict gate to initial Reader state and shorten it.
- Merge document header + toolbar.
- Collapse front matter and expose Case 1 in the first viewport.
- Add measured shell-height sticky offset.

**Exit evidence:** 1280×800 and 390×844 screenshots show source Chinese in the first viewport; no overlap.

### Phase B — Reader as literature

- Build grouped typographic corpus shelf (2/2/31).
- Replace card stack with ruled reading units and constrained measure.
- Make case rail single-row.
- Simplify metadata and progressive source ledger.
- Scope mobile action bar to Reader.

**Exit evidence:** no 961–1100 dead zone; no horizontal overflow; default Wumenguan reading has visibly dominant Chinese text.

### Phase C — Visual system consolidation

- Replace inline styles with classes.
- Apply reduced radius/shadow/icon system.
- Contrast-test both themes.
- Standardize buttons, filters, notices, statuses, source details.

**Exit evidence:** inline styles ≤10, decorative emoji reduced ≥70%, automated contrast audit passes.

### Phase D — Redesign the four secondary rooms

- Matrix proof sheet.
- Responsive Lineage transmission chart/directory.
- Gong’an catalogue rows.
- Lexicon dictionary rows.

**Exit evidence:** each room has its own literature-appropriate composition but shares shell/type/material tokens.

### Phase E — Verification

- Screenshot matrix: 390×844, 768×1024, 1024×768, 1280×800, 1440×1000; light/dark.
- Playwright overflow/sticky/first-source-visible checks.
- Lighthouse/accessibility and keyboard/screen-reader review.
- Owner visual review before calling the vision fulfilled.

## 11. Definition of “vision fulfilled”

Do not use the sentence “the website now feels like a Chinese Chan hall” until all are true:

- owner explicitly confirms the visual direction from current screenshots/live preview;
- first source text is visible in the first Reader viewport on desktop and mobile;
- global shell visibly uses walnut as structure, not a 4px accent;
- after the gate, only Robo names/status retain the joke;
- Reader no longer reads as stacked cards/chips;
- all five rooms implement the Chinese room framing;
- no 320–1440px overflow or sticky overlap;
- contrast/keyboard/screen-reader acceptance checks pass;
- visual regression screenshots are stored or attached to CI evidence.

## 12. What not to do

- Do not add temple illustrations, textures, red seals, lanterns, lattice borders, or animations to compensate for weak hierarchy.
- Do not add another hero layer, CTA, footer, onboarding, or feature tab.
- Do not start by recoloring existing cards; fix composition first.
- Do not remove provenance or editorial status to make the page look cleaner; make disclosure progressive.
- Do not call a design phase complete based only on CSS/code review.

## One-sentence summary

The vision requires a shell, hierarchy, and literature-layout redesign across all five rooms—not another hero polish pass—with screenshot-based owner approval as the completion gate.
