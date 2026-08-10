# Agent Handoff

> **Last updated:** 2026-08-10, session `arena/019febb1-translatechan`
> **Current fixed branch:** `arena/019febb1-translatechan` — do not switch or push elsewhere.
> **Baseline:** `3ef77320d28cc2a627723d8ad709f9a13ba83c29` (`main`, merged PR #14).

## Current state

This session completed three steps:

1. [full audit](../sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md);
2. [user-selected Congronglu containment](../sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md);
3. [user-selected P1 public-behavior hotfix](../sessions/FUNCTIONAL_HOTFIX_2026-08-10.md).

Current weighted score: **7.0/10**. `repo_ready = fail` because rights and operations gates remain. All `user_score` fields remain `null`.

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

1. **Rights governance:** all 14 rights sources remain review/jurisdiction-pending.
2. **Field-level source depth:** Biyanlu, Linji, Platform, and other non-case records need broader per-field provenance/review.
3. **Responsive/accessibility:** sticky/header geometry, 1100/960 breakpoint mismatch, mobile Reader controls on other views, contrast, and ARIA state relationships.
4. **Error handling:** no visible fatal-load state; malformed persisted state is not fully shape-validated.
5. **Operations:** four mirrored paths absent from CI diff; action majors target deprecated Node 20 runtimes; branch protection unreadable (403); browser suite still exits zero when Chromium is absent and is not required in CI.

## Recommended next sequence

1. Responsive/accessibility and error-state hardening.
2. Field-level source validation and human quotation-rights decisions.
3. Owner-approved workflow/action/branch-protection changes; non-skippable browser CI.
4. Re-audit release readiness.
5. Re-ingest Congronglu only under the source-pinned containment gate.

## Stable contracts

- Public brand: Fake Chan Factory; internal `translatechan_*`, `window.TranslateChan`, and `TRANSLATECHAN_DATA` remain.
- Public views: Reader, Matrix, Lineage, Gong’an, Lexicon only.
- Deployment: native GitHub Pages from `main /docs`, HTTPS.
- No source-looking Chinese may be generated or restored from quarantined history.
- N/N unit representation never establishes completion without explicit editorial status.
- Edition verification and rights approval are separate.
- Workflow changes require explicit user approval; exact edits are in `.scoreboard/manual-workflow-edits.md`.
- Before every push: compile, validate, build, smoke, and compare root/docs mirrors.
