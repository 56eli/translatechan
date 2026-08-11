# Agent Handoff

> **Last updated:** 2026-08-11 · **Session:** `arena/019ff0c0-translatechan`
> **Fixed branch:** `arena/019ff0c0-translatechan` — do not switch or push elsewhere.
> **Baseline:** `63dfe37` (`main`, merged PR #18) · **Latest work:** Chan-hall immersion pass (see commits since `1359398`)

## Current state

Second-pass owner feedback: the Pages site improved, but reading felt **unintegrated and shallow**, and the hero tagline gate (“The old texts are real. The translators are not.”) was a **horrible popup**. The owner selected **direction B — full Chan-hall immersion** over zen-minimal and editorial-print alternatives.

Implemented:

- hero popup fully retired (markup, app code, styles, OG art) with smoke guards banning its return;
- walnut wall + timber-post background with lamp falloff (day hall) and night-hall dark theme;
- sticky header = top beam with carved gold edge;
- every room hangs on a `.paper-sheet`; Reader content panel is the reading sheet;
- corpus sidebar = wooden shelf with pinned paper slips (active = pulled slip, cinnabar edge);
- reader toolbar = sheet lintel flush under the beam (`top: var(--shell-height)`);
- document headband: shelf-mark docket, double rule, colophon ledger, small red seal slip per room;
- folio units: hairline + gold-lozenge dinkus; 1.95 line-height Kai source; flattened commentary/verse insets;
- lineage graph framed with walnut dowels; mobile bar = walnut tray; light focus rings on timber;
- documentation (README/AUDIT/HANDOFF/scoreboard/history) synchronized.

Current weighted score: **7.2/10**; `repo_ready = fail`. All `user_score` fields remain `null`.

## Current measured state

```text
corpus=35 | slots=1252 | verified=177 | matrix=21 | locators=148/148
content CJK=103,723 | all-string CJK=109,185
complete=2 | partial=2 | excerpt seeds=31
lineage=34/30 edges | glossary=31 | gong'an=24
bundle=1,594,154 bytes raw | 497,352 gzip-9
```

## Verification

```text
compile                         PASS
semantic validator             PASS; 6 lineage warnings
build + root/docs sync         PASS
smoke (35 renderers)           PASS incl. retired-hero guards
HTML tag-balance parse         PASS
Playwright                     SKIP; Chromium unavailable (CDN + apt unreachable)
```

The Arena local preview serves the working build on port 8080. Do not describe this session as screenshot-verified.

## Remaining blockers

1. All 14 rights-manifest sources require human or jurisdiction review.
2. Biyanlu, Linji, Platform, and excerpt seeds need deeper field-level source review.
3. Browser execution remains skippable and is not required in CI; screenshots unavailable.
4. CI omits four mirrored paths; branch protection is unconfirmed.
5. Full bundle and all hidden rooms initialize up front.
6. Forty-one generated inline styles keep CSP `unsafe-inline` necessary.
7. Six lineage profiles lack linked corpus keys; 30 edges await exact locators.

## Recommended next sequence

1. Confirm the owner approves the hall-immersion direction on the live preview.
2. Open a PR into `main` when approved; verify the Pages deployment afterward.
3. Continue human rights/source review as a separate content tranche.
4. Apply workflow/browser/a11y changes only with explicit owner approval.

## Stable contracts

- Public brand: Fake Chan Factory; internal `translatechan_*`, `window.TranslateChan`, and `TRANSLATECHAN_DATA` remain.
- Public views: Reader, Matrix, Lineage, Gong'an, Lexicon only.
- Deployment: native GitHub Pages from `main /docs`, HTTPS.
- No source-looking Chinese may be generated or restored from quarantined history.
- N/N unit representation never establishes completion without explicit editorial status.
- Edition verification and rights approval are separate.
- Workflow changes require explicit user approval; exact edits remain in `.scoreboard/manual-workflow-edits.md`.
- Before each push: compile, validate, build, smoke, and compare root/docs mirrors.

## Canonical evidence

- [`../sessions/AUDIT_RESPONSE_2026-08-11_019ff0c0.md`](../sessions/AUDIT_RESPONSE_2026-08-11_019ff0c0.md)
- [`../AUDIT.md`](../AUDIT.md)
- [`../SCOREBOARD.md`](../SCOREBOARD.md)
- [`../HANDOFF.md`](../HANDOFF.md)
