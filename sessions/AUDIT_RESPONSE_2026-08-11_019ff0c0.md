# Full Audit + Chan-Hall Immersion Session — 2026-08-11 (second pass)

> **Session:** `arena/019ff0c0-translatechan` · **Baseline:** `63dfe37` (`main`, merged PR #18)
> **Scope:** full repository audit; second-pass owner feedback collection; implementation of the selected design direction.
> **Owner feedback (this pass):** the site improved a lot over earlier versions, but **everything that has to do with reading felt unintegrated and shallow**; the hero tagline **“The old texts are real. The translators are not.”** was a **horrible popup that needs to be removed**; room layout left to the implementer. Selected direction: **B — full Chan-hall immersion**. Scope granted: “touch everything; changes should be meaningful without regression.”

## 1. Executive verdict

The repository was verified green at baseline (all quality gates pass, mirrors synchronized, smoke suite exercises all 35 renderers). The Pages presentation gap was then driven by user experience, not by engineering: a popup-style greeting gate, and a reading surface assembled from workbench chrome instead of a composed book.

This session removes the gate entirely and rebuilds the page as a hall: timber wall and beam outside, one paper sheet per room inside, reading integrated into that sheet.

## 2. Implementation record

### The hall shell
- `body` is the wall: fixed timber-post background with lamp falloff; `--hall-wall*` tokens; dark theme becomes the night hall (`--paper` remapped to lacquered ink paper).
- Sticky header is the top beam: shared walnut, 3px gold beam edge, deep hall shadow.
- `main` rooms hang as paper sheets: `.paper-sheet` (paper bg, fiber rule, cut edge, hall shadow) + `.room-sheet` (padding scale); Reader's `.content-panel` carries the same sheet.

### Retired popup (owner instruction)
- The entire hero block, its dismiss/re-show buttons, `updateHeroCounts`, and `setupHeroDismiss` are removed; the legacy `translatechan_hero_dismissed` key remains only in the recovery-panel reset list for cleanup.
- The tagline is removed from `index.html`, `app.js`, `app.css`, and the social image; `scripts/smoke_test.mjs` now **fails** if any retired marker returns (regression guard against the exact complaint).
- The sidebar colophon keeps the validator-required literal `35 Canonical Works`, so the doc-truthfulness gate still passes.

### Reader integration (the “unintegrated and shallow” fix)
- Sidebar → wooden shelf slab on the wall (`--wood-900`, beam-gold top edge, hall shadow); works pinned as paper slips; active work = pulled slip with cinnabar edge; dark-styled shelf filter input.
- Reader toolbar → sheet **lintel**: paper-translucent band sticking flush under the beam (`top: var(--shell-height)`), hairline bottom edge, mono group labels, typographic controls (no pill boxes).
- Document headband: shelf-mark breadcrumb docket (uppercase mono), double top rule, hairline-separated colophon cells (source location · coverage · edition details).
- Folio reading units: hairline + gold lozenge dinkus between units; running-head case titles; Kai source text at 1.95 line height; dashed-rule pinyin; commentary/verse flattened into ruled 2px insets; collapsed folios align with the book column.
- Case index strip becomes a hairline-token TOC rail; load-more segmented controls inherit the typographic button language.
- The `.btn-pill` grammar is now typographic everywhere (underline-gold active state), removing boxed-pill clutter across all five rooms.

### Secondary rooms
- Matrix proof sheets use double-rule separators on the paper sheet.
- Lineage graph hangs as a scroll: walnut dowel bars cap the frame.
- Room headbands share a double rule + one small cinnabar seal slip (non-text, decorative).
- Gong'an chips, lineage filters, lexicon rows inherit the same control/hairline language.

### Mobile and print
- Bottom action bar is a walnut tray (beam-gold top edge, cream labels).
- Focus rings on timber (beam/shelf/tray) switch to a light ring (`#d8b87d`) — the paper-tuned walnut focus color failed contrast on dark wood.
- Print flattens sheets to white; retired hero removed from the hide list.

### Social image
`og-image.svg` redrawn as the hall: beam with brand, hanging sheet with headband/seal/folio lines, honest stat line (“35 source-tracked works · 21 comparison registers · every Robo disclosed”). The retired tagline is absent.

## 3. Verification

```text
node --check app.js                PASS
python3 -m py_compile scripts/*.py PASS (baseline)
python3 scripts/validate_data.py   PASS (35 docs, 1252 slots, 177 verified, 148/148 locators; 6 known lineage warnings)
python3 scripts/build_data_bundle.py PASS (root + docs/ mirror synchronized)
node scripts/smoke_test.mjs        PASS (35 renderers, retired-hero guards, hall-structure checks)
HTML tag-balance parse             PASS
diff data docs/data                PASS
git diff --check                   PASS
```

Notes: an intermediate commit tripped the N10 legibility floor (`font-size: 0.62rem` guard); fixed to 0.66rem and re-gated before this file was written. Chromium remains uninstallable in the sandbox (CDN + package mirrors unreachable), and `56eli.github.io` is not fetchable from here — **no screenshot claims are made**; the Arena live preview (port 8080) shows the working build.

## 4. Documentation synchronized

- `README.md` interface section rewritten for Chan-hall immersion.
- `AUDIT.md` current verdict updated (second pass).
- `HANDOFF.md` design direction + PR sections updated (PR #18 recorded as merged).
- `.scoreboard/scoreboard.yml` presentation aspect annotated; risk flag updated; score held at 7 pending browser evidence and owner approval.
- `.scoreboard/history.md` row added.
- `response_summary.md` is the disposable user-facing summary.

## 5. Remaining gaps (unchanged blockers from the scoreboard)

1. All 14 quotation-rights records await human/jurisdiction decisions.
2. Field-level source review (Biyanlu, Linji, Platform, excerpt seeds) incomplete.
3. Browser evidence still absent (non-skippable CI browser job needs owner approval — see `.scoreboard/manual-workflow-edits.md`).
4. 41 JS-generated inline styles keep CSP `style-src 'unsafe-inline'` necessary.
5. Six lineage profiles lack linked corpus keys; 30 edges await exact locators.
