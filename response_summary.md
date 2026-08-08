# 🪷 TranslateChan — Current Project Summary

> **Current audited snapshot:** `8717e969eab653ebe674c9ee76dcc41181dc8379` (2026-08-08).
> **Full current audit:** [`AUDIT.md` §10](./AUDIT.md#10-2026-08-08--current-independent-audit-post-pr-3). Historical session reports remain in `AUDIT.md` §§0–9 and `SESSION_AUDIT_2026-08-08.md`.

## Current state

- **Deployment:** static GitHub Pages, publishing `main` → `/docs`; Pages status is built and HTTPS is enforced.
- **Architecture:** vanilla HTML/CSS/JS; source JSON is deterministically bundled into `app_data.js`; root assets and `/docs` data mirror are synchronized by `scripts/build_data_bundle.py`.
- **Corpus:** 36 structured texts. *Wumenguan* is complete (48/48 cases plus preface/epilogue); the other 35 texts are explicitly excerpt-scale seeds.
- **Measured data:** 31 glossary terms, 30 lineage profiles, 18 gong’an index entries, 4 comparative-matrix rows, 856 corpus translation slots, and 138 verified corpus quotation objects (plus 2 Matrix entries marked verified).
- **Validation completed:** JavaScript syntax checks, Python compilation, deterministic bundle rebuild, full JSON parse, root↔`docs` comparison, and `node scripts/smoke_test.mjs` all pass.

## What is strong

1. The zero-backend deployment is simple, portable, and currently healthy.
2. The bundle/build/smoke-test discipline catches broad renderer regressions across all 36 corpus schemas.
3. The corpus candidly distinguishes complete Wumenguan coverage from excerpt seeds.
4. Object-form verified corpus translations already carry work/edition/verification provenance, providing a solid model to extend.

## Highest-priority open work

1. **Secure and normalize dynamic rendering:** remove remaining raw `innerHTML` paths for user-originated data and fix Studio’s `[object Object]` display of verified translations.
2. **Make provenance consistent:** require/render status and source metadata in Matrix and Studio, not only most Reader columns.
3. **Repair reader correctness/resilience:** sparse Biyanlu/Congronglu prev-next links, pointer-text search, truthful capped search counts, and safe/persistent `localStorage` handling.
4. **Add research-release guardrails:** schema/semantic validation, per-unit canonical locators, a third-party quotation/rights manifest, and CI before large-scale corpus ingestion.

## Recommended next milestone

Ship a focused **“reader/studio integrity”** patch covering the first three priorities, with regression tests, before expanding Biyanlu or adding more translations.
