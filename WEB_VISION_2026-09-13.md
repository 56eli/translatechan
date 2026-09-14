# 🎨 Fake Chan Factory — Current Vision (2026-09-13, Pages Revamp Final)

> **Date:** 2026-09-13 — after Checkpoint-C C-1..C-5 and Phases 1-3 merged (PRs #48, #49, #50, main 3a6ae32).
> **Status:** Pages revamp system complete, pending owner light/dark desktop/mobile review on live Pages.
> **Supersedes:** `WEB_VISION_2026-08-10.md` as current visual authority; that file remains historical walnut-hall direction.
> **Scope:** exactly 5 rooms, vanilla JS, no backend, no framework, CSP without `unsafe-inline`, 0 `style=` literals.

## Checkpoint-C answers (verbatim, 2026-09-13, owner)

- **C-1 Visual intensity:** "Colors are acceptable. Everything else can be adapted as seen fit, even fully replaced if suited." (owner custom)
- **C-2 English typographic voice:** "(a) Scholarly serif for hook/headings/translations, sans for controls" — owner selected (a) scholarly serif.
- **C-3 Chinese/English balance:** "(a) Present but subordinate everywhere except inside the Reader sheet where it is largest"
- **C-4 Performance strategy:** "(a) Render-lazy only — keep one bundle, hidden rooms render on first activation"
- **C-5 Scope/sequencing:** "(a) Full plan: system+masthead → Reader → secondary rooms → CSP tightening → evidence, fold PR-B/PR-D"

Implication: colors #2c2523 walnut etc acceptable, everything else replaceable; serif chosen; subordinate; lazy; full plan.

## Final system (measured on main 3a6ae32)

### Tokens and type

- **Token sheet:** 35 declarations in `:root` plus 8 dark-theme overrides = **43 total** (was 63). Eight theme primitives — paper, panel, line, ink + four accents — are the only values dark overrides; every other tint derived via `color-mix()`. Scoped composition dials live outside the global sheet: `--reader-zh-scale`, `--reader-zh-lead`, `--reader-zh-secondary`, `--reader-measure` on the Reader, and `--room-measure`, `--room-zh`, `--room-zh-label` on `.room-body` — ratios and measures, not palette.
- **Type scale:** one ~1.24 modular scale (`--type-hook` … `--type-small`) shared by English and Chinese at distinct line-heights.
- **English voice (C-2):** **Source Serif 4** for hook, headings and translation prose (Phase 2), system sans for controls, `ui-monospace` for locators/counts. Served via Google Fonts already allowed by CSP (`style-src fonts.googleapis.com / font-src fonts.gstatic.com`), no repo bytes. Self-hosting under `/fonts/` remains documented alternative.
- **Chinese:** Noto Serif SC + Kai fallbacks, `lang="zh"` on every source block, subordinate everywhere except Reader sheet where it is largest (C-3).

### Shell and rooms

- **Gate:** walnut lintel (`--wood #211814`) carrying `FC` monogram, brand and controls, brass rule, directory of five rooms beneath, beam telling joke once — structure not texture.
- **Reader (Phase 2):** minimal ruled sheet — one hairline between units, wide margins, source Chinese governing column sized from `--zh-font-size` via sheet-scoped ratio, translation prose in serif voice. Five disclosure ledgers in one always-visible drawer band "About this edition" (calmer, never quieter). Case index is thin static register — one line, two hairlines, numbers only.
- **Secondary rooms (Phase 3):** re-composed onto Reader vocabulary, card kits deleted (24 selectors removed: `.matrix-card`, `.meta-chip`, etc.). Matrix = **collation table** (`.matrix-collation`, one `.matrix-register-row` per translator, name/work/badge in margin rail). Lineage = **transmission register** (`.lineage-band` per generation, `.lineage-master-row` with house·dated record·signature columns) with layered SVG network as second view. Gong'an = **case catalogue** (`.catalogue-row`) with single row of text filters. Lexicon = **dictionary list** (`.lexicon-entry`, category in margin).
- **Responsive:** 1024 / 768 / 480 px breakpoints (secondary rooms collapse column grids to stacked rows), print sheet covers rooms (rails/filters/chart dropped, rows never split).
- **Accessibility:** contrast-safe tokens, reduced-motion handling, keyboard tabs, `role="tab"` ×5, skip link, dossier `role="dialog"` focus, 44px touch targets, `lang="zh"` everywhere.

### Security and performance

- **Inline styles:** **0** `style=` literals in `index.html` and **0** in `app.js` (Phase 2 moved 41 Reader/popover literals to classes, Phase 3 re-composed secondary rooms). Smoke asserts count in source and rendered HTML of every room, dossier and chart.
- **CSP:** `style-src 'self' https://fonts.googleapis.com` — **`unsafe-inline` gone** (Phase 3). Meta precedes all scripts. What remains are **4 CSSOM custom-property writes** — runtime contracts `--shell-height`, `--zh-font-size` (init + A±) and `--pop-shift` — which `style-src` does not govern; mechanisms it does govern (`setAttribute('style',…)`, `style.cssText`, injected `<style>`) are asserted absent.
- **Boot (C-4):** one bundle, **render-lazy** — Reader renders at boot, Matrix/Lineage/Gong'an/Lexicon build DOM on first tab activation (Phase 2). No pipeline change, byte-identical contract intact.
- **Bundle:** raw `app_data.js` + `app.js` + `app.css` + `index.html` = **1,925,366 B (~1.84 MB)** <2 MB ceiling; gzipped **586,529 B (~573 KB)**. Measured via `gzip -c app_data.js app.js app.css index.html | wc -c`. `app_data.js` alone 1,642,473 B (printed by `build_data_bundle.py`). Three docs carry ~64% of corpus bytes: `biyanlu_cases`, `linji_yulu`, `wumenguan`.

### Frozen tracks

- **PR-A real-browser:** still frozen — no Chromium run on record (`ECONNRESET`), Playwright suite optional and skips as success. Owner review of live Pages is Phase4 exit per proposal §9.
- **PR-B CSP hardening:** **folded into Phase 3** — 58→0 inline styles, CSP drop `unsafe-inline`.
- **PR-D perf measure-first:** **folded into Phase 2** — render-lazy only per C-4 (a), bundle-split (option B) not taken, remains open if browser measurements justify.

### Evidence and approval (Phase 4)

- **Owner review:** light/dark desktop/mobile on live Pages — pending. No self-declared completion.
- **Docs finalization:** README interface section, HANDOFF §3-§5, AUDIT verdict, ROADMAP Phase4 status, and this dated vision doc finalised in this PR.
- **Gates:** 5 gates green — `py_compile`, `validate_data`, `build_data_bundle`, `smoke_test`, `diff -rq`, plus structural diff `git diff --exit-code -- app_data.js docs data/project_metrics.json` (O-3) and mutation suite `test_source_review_rules` 120 checks.
- **Release checklist:** see `RESEARCH_RELEASE_PLAN.md` — W1 630 authoritative / 532 measured, rights 14 pending, 31 OUT-OF-CBETA human queue, 51 LABEL + 11 RE-KEY queues.
- **Ask:** whether required real-browser CI job is approved — not done here, ask via `OPERATIONS.md` Edit proposal.

## Risks (from proposal §8)

- R1 No browser evidence — owner reviews live Pages, no screenshot-verified language.
- R2 Doc-truthfulness gate pins interface prose — each slice PR includes prose update.
- R4 CSP tightening can break silently — classes first, assert 0, then CSP meta.
- R8 Honesty regression — ledger content unchanged, only container restyled.

## What is preserved (from proposal §6)

- Exactly 5 rooms, internal IDs `translatechan_*`, `window.TranslateChan`, `TRANSLATECHAN_DATA`, brand Fake Chan Factory, humor only in Robo names, English-first hierarchy, 5 disclosure ledgers, no framework/backend, recovery UI, pipeline fixed.

## What changed (from proposal §7, now shipped)

- Masthead: one walnut gate, hook in serif, counts as quiet colophon.
- Typography: modular scale, English serif voice.
- Tokens: 63→43.
- Reader: sheet as unit, drawer band, thin register, 0 inline styles, render-lazy.
- Secondary rooms: collation table / transmission register / case catalogue / dictionary.
- Mobile: two clusters (text·move), 44px targets.
- Inline styles: 58→0, CSP without `unsafe-inline`.
- OG image redrawn to final system.

## Exit criteria (proposal §9 Phase4)

- Owner light/dark desktop/mobile review of live site.
- HANDOFF §3-§5, README interface, dated vision doc finalised.
- Frozen tracks PR-B/PR-D closed as folded, PR-A still frozen.
- Release checklist noted, real-browser CI job approval asked.
- No self-declared completion, 5 gates green.

## Commands to reproduce measurements

```bash
grep -c "^  --" app.css  # includes scoped, use :root count for 35
awk '/^:root \{/{f=1;next} f&&/^\}/{print c;exit} f&&/--/{c++}' app.css  # 35
awk '/\[data-theme="dark"\] \{/{f=1;next} f&&/^\}/{print c;exit} f&&/--/{c++}' app.css  # 8
grep -c 'style=' index.html  # 0
grep -c 'style="' app.js     # 0
grep -n "Content-Security-Policy" index.html
ls -l app_data.js app.js app.css index.html
cat app_data.js app.js app.css index.html | wc -c  # <2MB
gzip -c app_data.js app.js app.css index.html | wc -c
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
git diff --exit-code -- app_data.js docs data/project_metrics.json  # O-3 structural
```
