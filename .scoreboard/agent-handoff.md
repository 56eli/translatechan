# Agent Handoff

> **Last updated:** 2026-08-10, session `arena/019febb1-translatechan`
> **Current fixed branch:** `arena/019febb1-translatechan` — do not switch or push elsewhere.
> **Baseline:** `3ef77320d28cc2a627723d8ad709f9a13ba83c29` (`main`, merged PR #14).

## Current state

This session completed three steps:

1. [full audit](../sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md);
2. [user-selected Congronglu containment](../sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md);
3. [user-selected P1 public-behavior hotfix](../sessions/FUNCTIONAL_HOTFIX_2026-08-10.md);
4. [owner-directed web vision gap analysis and redesign plan](../sessions/WEB_DESIGN_GAP_PLAN_2026-08-10.md);
5. [owner-approved structural walnut shell + Reader Phase A+B](../sessions/DESIGN_PHASE_AB_2026-08-10.md).

Current weighted score: **6.9/10** after Phase A+B implementation, pending visual approval. `repo_ready = fail` because four-room design completion, rights, and operations gates remain. All `user_score` fields remain `null`.

## Completed containment

- Removed all unreliable Congronglu source data, locator claims, deploy copies, and four generating scripts.
- Authoritative CBETA T48n2004 headings disproved even the five purportedly collated records.
- Added explicit editorial completion status; only Wumenguan/Xinxin are complete selected witnesses, Biyanlu/Linji are partial, and 31 documents are excerpt seeds.
- Added anti-placeholder validation, active-bundle absence tests, honest count/completion copy, and edition-verification/rights separation.

## Completed public-behavior fixes

- Lineage dossier removes/restores semantic `hidden`, becomes visible/focused, and closes correctly.
- Six direct-field Platform chapters now render source text, translations, and chapter source disclosure.
- Wumenguan epilogue follows all rendered cases.
- Print/PDF expands all lazy cases/sections before invoking print; smoke/Playwright require 48 Wumenguan cases followed by epilogue.
- Wumenguan labels Wumen; Biyanlu labels Yuanwu and Xuedou.
- Smoke and Playwright regressions cover all five paths.

## Current measured state

```text
corpus=35 | slots=1252 | verified=177 | matrix=21 | locators=148/148
content CJK=103,723 | all-string CJK=109,185
complete=2 | partial=2 | excerpt seeds=31
bundle=1,594,154 bytes raw | approximately 498 KB gzip-9
```

## Remaining blockers

1. **Design completion:** structural walnut shell and Reader are implemented; visual-system consolidation, Matrix/Lineage/Gong’an/Lexicon redesign, screenshot evidence, and explicit owner approval remain.
2. **Rights governance:** all 14 rights sources remain review/jurisdiction-pending.
3. **Field-level source depth:** Biyanlu, Linji, Platform, and other non-case records need broader per-field provenance/review.
4. **Responsive/accessibility:** sticky/header geometry, 1100/960 breakpoint mismatch, mobile Reader controls on other views, contrast, and ARIA state relationships.
5. **Error handling:** no visible fatal-load state; malformed persisted state is not fully shape-validated.
6. **Operations:** four mirrored paths absent from CI diff; action majors target deprecated Node 20 runtimes; branch protection unreadable (403); browser suite still exits zero when Chromium is absent and is not required in CI.

## Recommended next sequence

1. Continue Phase C visual-system consolidation (inline styles, emoji, controls, contrast).
2. Execute Phase D four-room redesign.
3. Execute Phase E screenshot/accessibility verification and obtain explicit owner approval.
4. Complete field-level source validation and human quotation-rights decisions.
5. Apply owner-approved operations changes and re-audit; re-ingest Congronglu only under its containment gate.

## Merge status

PR [#15](https://github.com/56eli/translatechan/pull/15) merged into `main` as `26feff0dbc4286da0c7a1e4c46ff341288b9d0f3`. Main Quality and Pages deployment both succeeded. The real site is live for owner review at `https://56eli.github.io/translatechan/`.

Next agent: wait for owner visual feedback before Phase C/D. Do not infer approval from merge or silence, and do not set a user score without an explicit numeric instruction.

## Stable contracts

- Public brand: Fake Chan Factory; internal `translatechan_*`, `window.TranslateChan`, and `TRANSLATECHAN_DATA` remain.
- Public views: Reader, Matrix, Lineage, Gong’an, Lexicon only.
- Deployment: native GitHub Pages from `main /docs`, HTTPS.
- No source-looking Chinese may be generated or restored from quarantined history.
- N/N unit representation never establishes completion without explicit editorial status.
- Edition verification and rights approval are separate.
- Workflow changes require explicit user approval; exact edits are in `.scoreboard/manual-workflow-edits.md`.
- Before every push: compile, validate, build, smoke, and compare root/docs mirrors.
