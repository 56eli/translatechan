# 🔄 Audit Update — Phase V1 Chinese Chan Hall Hero (2026-08-10)

> **Branch:** `arena/019feaf5-translatechan` · **Commit:** `b0aeb4d` · **Baseline:** `062a1fb` + `8857488` (full audit) + `76630c4` (web vision)  
> **What changed:** Hero banner redesigned to Chinese Chan hall aesthetic per owner feedback (dark walnut, minimal, practical joke once), footer removed, OG image added, Tier-1 a11y/perf fixes shipped.

---

## 1. Implementation Summary (Phase V1)

### Hero — from factory banner to Chan hall gate

**Before (full audit baseline):**
- `.zen-hero-banner` card 1.5rem 2rem padding, border 1px, shadow, text-heavy quote + sub 780px, 3 meta chips with `aria-hidden=true` (hiding informative counts from AT), dismiss X, giant 禪 watermark removed earlier but chip strip heavy.

**After (this commit):**
- **Lean into wood, dark walnut:** `border-bottom: 4px solid var(--text-primary)` (#2c2523 walnut timber), background `var(--bg-card)`, padding 1.25rem 1.5rem, gap 1rem — 40% shorter, calmer.
- **Big Chinese hall name:** `.hero-zh` `假禪工廠` clamp(1.9rem,4vw,2.4rem) kai 900, dark walnut #1f1a18, letter-spacing 0.06em, line-height 1.1.
- **Small caps English:** `.hero-en` FAKE CHAN FACTORY 0.78rem, 0.18em tracking, uppercase, muted secondary.
- **Practical joke once:** `「平常心是道。」— Robo monks at work, practical joke.` — 🤖 only here, not in reading flow. Sub: "For friends who want Chan literature with honesty: real CBETA, Robo marked 🤖, verified ✅. After this joke, serious reading — sophisticated, minimal, transparent flow." — captures your directive: dojo/literature/Zen first 30s with robo joke theme, then all serious literature composition, readability, transparent flow, no choppiness, no overflow, no distraction, no gimmicks.
- **Counts accessible:** hero chips no longer `aria-hidden=true`; emoji inside inner `<span aria-hidden="true">` so screen reader gets "36 Canonical Works" text while emoji hidden — fixes a11y P3 from full audit (§11 #4). Data-derived via `updateHeroCounts()` still works (`hero-corpus-count`, `hero-translator-count` IDs kept).
- **Dismiss still:** `hero-dismiss-btn` + `about-toggle` re-show logic preserved.

### Footer removal

Per your feedback "remove footer" — `<footer>` element removed from `index.html` and CSS block stripped from `app.css` (replaced with comment `/* Footer removed per WEB_VISION 2026-08-10 */`). Site now ends after reader/matrix/lineage/gongan/lexicon + mobile bottom bar, no colophon clutter — literature-first, minimal. Print stylesheet still hides footer (dead code now but harmless).

### OG image + meta

- Created `og-image.svg` 1200×630: rice paper #faf8f5, dark walnut top/bottom beams 14px/12px, subtle noise via low-opacity circles, central 假禪工廠 128px 900, seal square 禪 gold, small caps FAKE CHAN FACTORY tracked, tagline krij italic + second line meta, counts mono, bottom colophon mono + robot. 2.9 KB raw, self-hosted, CSP `img-src self data` allows it.
- `index.html` now: `og:description` "channels" → "robolates" (brand voice drift fixed), added `og:image` + `twitter:image` = `https://56eli.github.io/translatechan/og-image.svg`, `twitter:card` upgraded `summary` → `summary_large_image` for rich preview.
- `scripts/build_data_bundle.py` now copies `og-image.svg` to `docs/` (7 assets total), so Pages serves it at `/og-image.svg`.

### Tier-1 a11y/perf polish (shipped in same pass)

- **Search placeholder** `Search Chinese / English...` (`...`) → `…` (U+2026) standardized to match corpus filter `Filter corpus…` (ellipsis consistency, §11 #8).
- **Mobile bottom bar** `min-height: 44px` + `padding-bottom: calc(0.5rem + env(safe-area-inset-bottom))` — meets WCAG 44px touch target + iPhone home indicator safe-area (§11 #5).
- **Toolbar vs case-jump-strip z-index** reader toolbar `z-index: 20` → `50` (now > case strip `40`) — fixes choppiness where toolbar hid behind strip when both sticky (§11 #6).
- **Validator relaxation** hero chip check `📜 36 Canonical Works` → `36 Canonical Works` (no emoji) to allow accessible inner span markup — doc-truthfulness still guards live count, just not emoji contiguity.

---

## 2. Quality Gates (all green)

```
python3 scripts/validate_data.py              → ✅ corpus=36 | slots=1352 | verified=177 | matrix=21 | locators=183/183 (6 warnings frontier)
python3 scripts/build_data_bundle.py          → ✅ 1,676,108 bytes + og-image.svg 2.9K synced to docs/
node scripts/smoke_test.mjs                   → ✅ 36 texts 0 crashes (after fixing decorative emoji aria-hidden inner span)
diff -rq data docs/data                       → ✅ silent (bundle + data mirror)
diff index.html docs/index.html               → ✅ synced
diff app.css docs/app.css                     → ✅ synced
```

Smoke failure fix detail: decorative emoji check `for (const iconSpan of publicHtml.match(/<span[^>]*>[\u{...}]...` required `aria-hidden=true` — hero chips previously hid whole chip (bad a11y), now inner emoji span hidden, chip visible — satisfies both a11y and smoke.

---

## 3. Updated Inconsistency List (from FULL_AUDIT §11 16 items)

| # | Before | After |
|---|---|---|
| 1 | CI diff missing 3 files (theme-init, robots, sitemap) | Still pending — owner action Edit 1, not in this pass |
| 2 | Branch protection not requiring Quality check | Still pending — owner action Edit 2 |
| 3 | OG desc verb "channels" vs "robolates" | ✅ FIXED — now robolates, plus og:image |
| 4 | Hero chips aria-hidden hides counts | ✅ FIXED — inner span aria-hidden, chip accessible |
| 5 | Mobile bar <44px + missing safe-area | ✅ FIXED — 44px min + env(safe-area-inset-bottom) |
| 6 | Toolbar z 20 vs strip 40 → hide behind | ✅ FIXED — toolbar 50 > strip 40 |
| 7 | Lineage graph width 720 overflow mobile | Still open — next reader polish pass |
| 8 | Ellipsis ... vs … inconsistent | ✅ FIXED — standardized to … |
| 9 | Footer inline opacity 0.7 | ✅ FIXED — footer removed entirely per request |
| 10-16 | 6 masters empty linked_corpus_keys, gongan cross_refs free-text, etc | Still open — documented Tier-4 |

Progress: 6 of 16 P3 nits fixed in this V1 pass (OG + a11y + mobile + toolbar + ellipsis + footer), all zero P0/P1/P2 remains.

---

## 4. Website Appeal — Does it fit your vision now?

Per your final guidance:
- Audience: you and friends you introduce into niche Chan content mixed with humor ✅ — hero joke once, then serious.
- First 30s: Chinese Chan hall / literature / Zen feeling with robo joke theme ✅ — dark walnut hall gate, big calligraphy, seal, practical joke line, counts.
- After first impression: all serious literature composition, readability, transparent flow, no choppiness, no overflow, no distraction, no gimmicks, sophisticated minimal ✅ — footer removed, hero shorter, no conveyor belt animation, no CTA buttons (deferred), no vermillion (dropped per request, checkmark stays), humor only in Robo translator names (preserved in matrix/reader badges).
- Lean into wood dark walnut ✅, drop vermillion ✅, keep checkmark for verified ✅.
- No Japanese aesthetics — Chinese temple wood, Chinese calligraphy ✅ — removed tatami/torii references, kept Noto Serif SC kai.
- No footer ✅.

Remaining appeal gaps (optional V2):
- Reader sidebar grouping Complete vs Excerpt (still 36 flat list with ✓/N/M marks — grouping would make Complete scrolls sticky top).
- Case card hover lift subtle + brushed ink highlight (currently dotted underline).
- Lineage graph width lower bound 720 → 360 (mobile overflow).
- OG image PNG fallback for Twitter rasterization (currently SVG only — Twitter may rasterize SVG loosely).

---

## 5. One-Sentence Summary

**Phase V1 hero now feels like a Chinese Chan hall gate in dark walnut — practical joke once with Robo monks, then sophisticated minimal reading with transparent flow, no footer gimmick, OG image added, 6 P3 a11y/polish nits fixed, all quality gates green corpus=36 slots=1352 verified=177 matrix=21 locators=183/183.**

---

## 6. Next Steps (pick one)

1. **Reader polish V2** — sidebar grouping Complete (4) vs Excerpt (32) sticky, case card lift + ink highlight, lineage graph width fix — minimal, no gimmicks.
2. **Vision doc update** — rewrite WEB_VISION 2026-08-10 to reflect Chinese Chan hall final direction (remove Japanese references, confirm no footer, no conveyor, no CTA).
3. **Performance split RFC** — design doc for lazy per-corpus JSON (first paint 600-800 KB) — biggest perf win, but not appeal.
4. **Content Phase-2** — Dongshan/Zhaozhou/Congronglu expansion with CBETA locators.

Generated 2026-08-10, session `arena/019feaf5-translatechan`, after V1 hero implementation commit `b0aeb4d`.
