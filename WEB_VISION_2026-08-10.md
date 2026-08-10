# 🏭 Fake Chan Factory — Website Vision (GitHub Pages Appeal Pass)

> **Purpose:** This is NOT another feature list. It's a vision for making the GitHub Pages site *want-to-stay* appealing, so every function we add has a home. Written in response to "we just add functions that aren't needed while the website itself doesn't become more appealing" (2026-08-10).  
> **Status:** RFC — read, react, then we implement in small slices. No heavy JS, no backend, keeps CSP `script-src 'self'`, keeps zero-deps.
> **Related:** `vision.md` is the scholarly/architectural blueprint. This doc is the *public-facing experience* blueprint.

---

## 0. One-line premise

**Fake Chan Factory should feel like walking into a small, sunlit Kyoto workshop where robots in ink-stained aprons are robolating woodblock prints of old Chan dialogues — not like opening a database.**

Today it feels like a very good reader app. That's correct but not delightful. The reader *works*; the factory *doesn't feel* like a factory. The joke ("proudly fake") is told once in a banner and then disappears. A first-time visitor should *get the joke in 2 seconds* and *want to pull a print off the line* — open a case, compare Robos, trace a master.

---

## 1. Audience & first 30 seconds

**Who lands here?**
- Zen-curious dev / designer (GitHub discovery) — wants a vibe, shares screenshot.
- Scholar / translator — wants source fidelity + citation, tolerates Robo if honest.
- Practitioner / reader — wants calm reading, not overload.

**First 30 seconds should be:**

1. **Brand snap (2s):** « 假禪工廠 — Fake Chan Factory — robots robolating the masters » — big type, Chinese seal, robot emoji as worker not gimmick.
2. **Scale snap (5s):** 36 works, 4 complete, 1.6 MB woodblocks ready — feels tangible, not number soup.
3. **Invitation (10-30s):** One perfect case on the conveyor: Zhaozhou's Dog — zh + pinyin + 2 Robo side-by-side, big, generous, you can tap a term.
4. **Curiosity hooks:** nearby chips → "See all 48 Wumenguan cases", "Compare 21 Robo voices", "Trace Bodhidharma → Mazu → Linji", "Look up 無".

Today first paint = hero banner text + sidebar 36 buttons + full Wumenguan case 1. That's *work*. We want first paint = factory floor + one inviting print.

---

## 2. Brand pillars (design system)

### 2.1 Four materials

We already have rice paper — make it a world:

- **Wood:** dark walnut `#2c2523` for header/ink, not just text. Grain via subtle noise — not image, via CSS `background-image: radial-gradient` noise pattern <1KB.
- **Rice paper:** `--bg-primary #faf8f5` stays, but add layered paper: `--bg-card #ffffff` + `--bg-card-subtle #fcfbfa` + shadow is print lifted off table.
- **Ink:** Chinese ink bleed — glossary highlight shouldn't be just dotted underline, should feel like seal stamp: `border-bottom: 2px solid var(--accent-gold)` becomes slightly irregular? Keep simple: use `box-shadow: inset 0 -0.35em 0 rgba(158,114,50,0.18)` for marker highlight, like brushed ink.
- **Vermillion seal:** New accent — `#c2452d` (seal red) for **Verified** badges only. Currently verified is green; green says "go", but seal red says "authentic stamp". Use green for lineage verified, red for textual verified. Factory stamp color.

### 2.2 Typography scale — from calm to confident

Current titles are 2rem zh + 1.15rem en — pleasant but small. Factory should shout a little:

- **Display:** `.display-2` for hero: `clamp(2.4rem, 6vw, 4rem)` Noto Serif SC 900 weight, letter-spacing `-0.02em`, line-height 0.95.
- **Section zh:** 2rem is right — but give it breathing: `margin-bottom 0.8em`, decorative rule above (thin gold line 32px).
- **Chinese reading:** `--zh-font-size 1.35rem` is comfortable, but add `font-variant-east-asian: ruby`? Keep Kai for classical — good.
- **En translation:** 0.95rem fine, but reduce contrast slightly — secondary, not competing with zh.
- **Mono for CJK count/meta:** use `--font-mono` for numbers (48/48, 37/37) → engineering meets woodblock.

### 2.3 Motion — ink, not bounce

- All existing motion uses `cubic-bezier(0.16,1,0.3,1)` — keep.
- Add two micro-motions only:
  1. **Seal stamp:** when opening a case or hovering verified badge, small scale 0.9→1 + slight rotation -2deg→0deg 200ms, like stamp pressed.
  2. **Conveyor:** case chips in jump strip slide in with slight stagger 30ms each on first load — feels like line moving.
- Respect `prefers-reduced-motion` → instantly `animation:none`.

### 2.4 Voice — keep humor, make it physical

Current banner: "「平常心是道。」— now freshly robot-stamped. 🤖" — perfect. Keep humor in UI microcopy:
- Empty corpus filter: "No works match 'zennn' — robots searched the shelves twice."
- Load-more: "Pull 12 more prints off the line" vs "Show more cases".
- Search zero: "No match — try a plant name, a shout, or 無".
- But keep provenance truth cold — humor never touches citation badges.

---

## 3. Site map & hierarchy — same 5 tabs, different story

We keep 5 tabs — Reader, Matrix, Lineage, Gong'an, Lexicon — that's public scope, smoke-guarded. We *reframe* them as factory stations:

- **Reader = The Press Floor** — where prints are made, you read side-by-side.
- **Matrix = The Proof Table** — lay translations side-by-side like printer's proofs, compare ink bleed.
- **Lineage = The Blueprint** — machine blueprint of transmission, pan/zoom blueprint table.
- **Gong'an = The Case Rack** — wooden rack of koan slips, grouped by theme.
- **Lexicon = The Type Drawer** — letterpress drawer of terms.

This framing can be subtle: add small sublabel under each view title in muted text, e.g. "Bilingual Reader — Press Floor / 印刷臺". Not renames, just poetry.

---

## 4. Concrete redesign slices (no new functions needed)

### 4.1 Hero — from banner to factory gate (S)

**Today:** card with quote + 3 meta chips + dismiss X. Text-heavy, hidden via aria-hidden (bad), giant 禪 watermark removed already.

**Vision:**

```
┌─────────────────────────────────────────────────────────────┐
│ 假  [seal: 廠]   FAKE CHAN FACTORY  🤖                     │
│ 禪工廠   Robots robolating the Chan masters                 │
│                                                             │
│ 「平常心是道。」 now freshly robot-stamped.                │
│ 36 woodblocks · 4 complete scrolls · 21 Robo hands          │
│                                                             │
│ [Open Wumenguan 48/48 →] [Peek at Lineage Blueprint →]     │
│                                                             │
│ ──────── conveyor belt animation (SVG, CSS-only) ───────── │
│  [Dog] → [Fox] → [Finger] → [Beardless] → … tiny prints   │
└─────────────────────────────────────────────────────────────┘
```

Implementation:

- Replace `.zen-hero-banner` background with layered paper + subtle wood edge at bottom (4px dark border).
- Display title: big Chinese 假禪工廠 (kai 900, 2.8rem) + English FAKE CHAN FACTORY small caps 0.9rem tracked.
- Remove meta chips grid, instead one line: `📜 36 woodblocks · ✅ 4 complete · 🤖 21 Robo hands` (same data, more story).
- Two CTA buttons: primary "Open the Gateless Gate (48/48) →" (scrolls to first case), secondary ghost "See the blueprint".
- Conveyor: purely decorative, CSS horizontal scroll of tiny case numbers with `aria-hidden=true`, infinite CSS animation (respect reduced-motion).
- Dismiss still exists but less needed because hero is now 40% shorter, not heavy.

### 4.2 Reader — from list to scroll (S/M)

**Today:** sidebar 260px list + content panel + sticky toolbar + case chips. Works, but feels like IDE file tree.

**Vision:**

- Sidebar: not just names, but status story. Keep search filter, but add grouping: "Complete Scrolls" (4) with gold left stripe, "Excerpt Seeds" (32) muted. Already have ✓ / N/M — make Complete group sticky top.
- Reader header: breadcrumb `📚 Reader › T2005 Wumenguan` is good, keep. Add seal stamp for complete: red seal "完 / Complete" next to title when coverage 100%.
- Case card: currently card-subtle + border + hover. Vision: case card like print with inked edge: `border: 1px solid var(--border-color)` + `box-shadow: 0 2px 0 rgba(0,0,0,0.04)` + on hover slightly lifted `transform: translateY(-1px)` + stronger shadow. Keep.
- Translation columns: currently equal grid. Make first column slightly wider if bilingual mode? Not needed. But add label "Robo press" small above grid when status reconstruction?
- Glossary highlight: change from dotted underline to brushed highlight described above.
- Empty state (search zero): illustration? Keep text, but humor.

### 4.3 Matrix — from cards to proof sheet (S)

**Today:** matrix cards with classical zh + pinyin + source location + grid of translator cols.

**Vision:** proof sheet on long table. Background slightly darker than reader (`var(--bg-primary)` vs `var(--bg-card)`) already is. Add subtle ruler line at top of matrix card, like proof sheet margin. No function change.

### 4.4 Lineage — blueprint table (M)

**Today:** SVG network + verification summary chip + graph controls.

**Vision:**

- Container background becomes blueprint blue-white: light blue grid `background-image: linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)` 20px grid, very subtle.
- Generation labels G1, G2 in mono, small.
- Nodes: keep halo, but add slight blueprint crosshair on hover.
- Dossier panel: currently card with gold left stripe, good — keep as blueprint callout.

### 4.5 Gong'an & Lexicon — drawers (S)

**Today:** filter chips, cards.

**Vision:** cards feel like index slips. Add slight rotation on hover 0.5deg? Might be too playful. Keep calm, but add typographic detail: theme icon via emoji? Already 🏷️, okay.

### 4.6 Footer — factory colophon (S)

**Today:** quote, nav, meta, fineprint. Proper nav now exists — good.

**Vision:** colophon like woodblock print colophon: left side wood maker mark, right side edition note. Keep current but add tiny factory mark: "Printed by 🤖 in Fake Chan Factory, 2026 — CBETA sources T47/48/51". Add link to GitHub repo? Smoke guards header GitHub link but footer GitHub link might be okay? Current smoke guards against header link, not footer. Check; if okay, add discreet GitHub link in fineprint.

### 4.7 Global — texture & image

- No images today except emoji. Keep zero-image philosophy, but add one SVG: `og-image.svg` 1200×630 for link previews. Design: rice paper background, big 假 in gold, FAKE CHAN FACTORY in small caps black, robot arm stamping seal "🤖" bottom-right, subtitle "Robo-translators robolating the Chan masters — proudly fake, honestly sourced".
- Also add favicon refinement: keep 🪷 data URI, but consider hand-drawn seal SVG for better cross-OS.

---

## 5. What NOT to do (anti-goals)

- **No framework, no backend, no external JS** — stays static.
- **No heavy illustrations / photos** — keep <10KB decorative SVGs, CSS patterns only.
- **No carousels, no popups, no onboarding tour** — calm by default.
- **No gamification** — factory metaphor stays visual, not points.
- **No removing provenance honesty** — seals help, but badges stay cold factual.
- **No adding new tabs** — 5 tabs is scope, guards it.
- **No changing content shapes** — 36 corpus files, validator stays king.

---

## 6. Implementation plan — appealing first, then functions

### Phase V1 — Hero + brand snap (30 min, ships now)

1. Fix OG description "channels" → "robolates" (Tier-1 drift).
2. New hero markup:
   - display title 假禪工廠 + seal
   - one-line scale: woodblocks · complete · Robo hands (data-derived counts)
   - 2 CTAs (Open Wumenguan, See Blueprint) + conveyor decorative div `aria-hidden`
   - Keep dismiss logic, but hero shorter, no shadow heavy.
3. CSS:
   - `.zen-hero-banner` → `background: var(--bg-card)` + bottom border 4px walnut + `padding: 1.25rem 1.5rem`
   - `.display-zh` class for big Chinese
   - conveyor: flex row, gap 0.3rem, overflow hidden, animation translateX -20% loop 30s linear
   - remove `aria-hidden=true` from hero chips OR add SR-only counts
4. Generate `docs/og-image.svg` + meta `og:image` + `twitter:image`.
5. Footer: remove inline style `opacity:0.7` → class.

Gates: `validate_data.py`, `build_data_bundle.py`, `smoke_test.mjs`, `diff -rq data docs/data`.

### Phase V2 — Reader polish: grouping + seal + highlight (1 session)

1. Sidebar grouping: complete vs excerpt, sticky header for complete group.
2. Reader header seal "完" when 100% coverage — small red seal CSS: square 28px, border 2px red, text 完, rotated -8deg.
3. Glossary highlight: `box-shadow: inset 0 -0.6em 0 rgba(158,114,50,0.16)` instead of dotted underline, keep border-bottom for fallback.
4. Case card hover lift: `transform: translateY(-1px)` + `shadow-md`.
5. Mobile bar: min-height 44px + `safe-area-inset-bottom`.

### Phase V3 — Matrix proof sheet + lineage blueprint (1 session)

1. Matrix card ruler line, slightly darker table background.
2. Lineage graph container blueprint grid background, generation mono.
3. Dossier blueprint callout shadow.

### Phase V4 — Motion & colophon (half session)

1. Seal stamp animation on verified badge hover (scale/rotation).
2. Case chip stagger on first load.
3. Reduced-motion respect for both.

Each phase: build + smoke + push, PR to main.

---

## 7. Metrics for "more appealing"

How to know vision worked without analytics (zero backend, no tracking)?

- **Qualitative:** Screenshot shareability — does hero make you want to screenshot? Does reader case look calm enough to read 2 minutes?
- **Quantitative proxy:** Time to first meaningful print: measure DOMContentLoaded → first case zh visible (should be <1.5s on 4G).
- **Accessibility:** Lighthouse a11y ≥95 already, but check color contrast for new seal red — must pass 4.5:1 for text if used as badge text.
- **Bundle:** Keep raw <2 MB, gz <500 KB.
- **No regression:** smoke 50+ checks still green.

---

## 8. Open questions for owner

- Should footer include discreet GitHub repo link? Current smoke guards header link, not footer. Clarify if footer GitHub is okay.
- Is vermillion seal red acceptable for verified badge (instead of green)? Green is conventional "verified", red is culturally "seal of authenticity". Could use red seal square + green text? Propose: verified badge = red seal border + green check.
- Conveyor decorative animation: is infinite CSS animation acceptable given "calm by default"? Could be paused by default, play on hover.
- Hero CTA "Open the Gateless Gate" — should pick 1 of 4 complete texts randomly or always Wumenguan (most iconic)?
- OG image: SVG is crisp, but Twitter/X may rasterize better with PNG. Provide both SVG source + exported PNG 1200×630?

---

## 9. One-sentence vision

**Fake Chan Factory should feel like a small, sunlit press room — rice paper, walnut, ink, vermillion seals, robot aprons — where each case is a print you want to pull off the line, not a database entry you have to parse; the factory's honesty about being fake is the charm that makes you stay.**

---

> Written 2026-08-10, session `arena/019feaf5-translatechan`, after full senior-dev+designer audit. References: `app.css` tokens, `index.html` hero, `app.js` rendering, scoreboard overall 8.2/10, 16 P3 nits, no P0/P1/P2. No functions added today — only vision. Next step: implement Phase V1 hero + OG image if owner approves.

