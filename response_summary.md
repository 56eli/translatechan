# 🪷 TranslateChan — Current Project Summary

> **Baseline audited snapshot:** `8717e969eab653ebe674c9ee76dcc41181dc8379` (2026-08-08); the current branch adds the integrity and reader-reliability remediations recorded in [`AUDIT.md` §§10.6–10.7](./AUDIT.md#106-integrity-hotfix--c1c2c3-remediated-same-session).
> **Full current audit:** [`AUDIT.md` §10](./AUDIT.md#10-2026-08-08--current-independent-audit-post-pr-3). Historical session reports remain in `AUDIT.md` §§0–9 and `SESSION_AUDIT_2026-08-08.md`.

## Current state

- **Deployment:** static GitHub Pages, publishing `main` → `/docs`; Pages status is built and HTTPS is enforced.
- **Architecture:** vanilla HTML/CSS/JS; source JSON is deterministically bundled into `app_data.js`; root assets and `/docs` data mirror are synchronized by `scripts/build_data_bundle.py`.
- **Corpus:** 36 structured texts. *Wumenguan* is complete (48/48 cases plus preface/epilogue); the other 35 texts are explicitly excerpt-scale seeds.
- **Measured data:** 31 glossary terms, 30 lineage profiles, 18 gong’an index entries, 4 comparative-matrix rows, 856 corpus translation slots, and 138 verified corpus quotation objects (plus 2 Matrix entries marked verified).
- **Validation completed:** JavaScript syntax checks, Python compilation, deterministic bundle rebuild, full JSON parse, root↔`docs` comparison, and a debounced-search-aware `node scripts/smoke_test.mjs` covering sparse navigation, pointers, cap accounting, and blocked storage all pass.

## What is strong

1. The zero-backend deployment is simple, portable, and currently healthy.
2. The bundle/build/smoke-test discipline catches broad renderer regressions across all 36 corpus schemas, including real debounced search, sparse navigation, pointer search, and blocked-storage execution.
3. The corpus candidly distinguishes complete Wumenguan coverage from excerpt seeds.
4. Reader, Matrix, and Studio now share explicit reconstruction/AI/verified badges; verified corpus and Matrix entries expose source metadata.
5. The Studio safely renders object-form verified translations and dynamically offers only registers available for the selected passage; corpus choice and all preferences now use safe browser-storage access.

## Highest-priority open work

1. **Add research-release guardrails:** schema/semantic validation, per-unit canonical locators, a third-party quotation/rights manifest, derived metrics, and CI before large-scale corpus ingestion.
2. **Expand content only after those rails:** complete Biyanlu and broaden the Studio’s schema-driven passage picker.
3. **Finish accessibility/export polish:** keyboard activation for all interactive controls and robust LaTeX escaping.

> **Integrity and reader-reliability patches shipped in this session:** dynamic markup is escaped; stored drafts are shape-normalized; rich verified translations no longer render as `[object Object]`; Matrix status/source metadata is explicit; sparse case navigation follows actual records; pointer search is indexed; result caps report truthfully; and corpus/preferences persist safely.

## Recommended next milestone

Ship **research-release guardrails** (schema/semantic validation, canonical locators, rights manifest, and CI) before expanding Biyanlu or adding more translations.
