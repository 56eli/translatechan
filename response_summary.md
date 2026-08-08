# 🪷 TranslateChan — Current Project Summary

> **Baseline audited snapshot:** `8717e969eab653ebe674c9ee76dcc41181dc8379` (2026-08-08); the current branch adds the integrity remediation recorded in [`AUDIT.md` §10.6](./AUDIT.md#106-integrity-hotfix--c1c2c3-remediated-same-session).
> **Full current audit:** [`AUDIT.md` §10](./AUDIT.md#10-2026-08-08--current-independent-audit-post-pr-3). Historical session reports remain in `AUDIT.md` §§0–9 and `SESSION_AUDIT_2026-08-08.md`.

## Current state

- **Deployment:** static GitHub Pages, publishing `main` → `/docs`; Pages status is built and HTTPS is enforced.
- **Architecture:** vanilla HTML/CSS/JS; source JSON is deterministically bundled into `app_data.js`; root assets and `/docs` data mirror are synchronized by `scripts/build_data_bundle.py`.
- **Corpus:** 36 structured texts. *Wumenguan* is complete (48/48 cases plus preface/epilogue); the other 35 texts are explicitly excerpt-scale seeds.
- **Measured data:** 31 glossary terms, 30 lineage profiles, 18 gong’an index entries, 4 comparative-matrix rows, 856 corpus translation slots, and 138 verified corpus quotation objects (plus 2 Matrix entries marked verified).
- **Validation completed:** JavaScript syntax checks, Python compilation, deterministic bundle rebuild, full JSON parse, root↔`docs` comparison, and a debounced-search-aware `node scripts/smoke_test.mjs` all pass.

## What is strong

1. The zero-backend deployment is simple, portable, and currently healthy.
2. The bundle/build/smoke-test discipline catches broad renderer regressions across all 36 corpus schemas, including real debounced search execution.
3. The corpus candidly distinguishes complete Wumenguan coverage from excerpt seeds.
4. Reader, Matrix, and Studio now share explicit reconstruction/AI/verified badges; verified corpus and Matrix entries expose source metadata.
5. The Studio safely renders object-form verified translations and dynamically offers only registers available for the selected passage.

## Highest-priority open work

1. **Repair reader correctness/resilience:** sparse Biyanlu/Congronglu prev-next links, pointer-text search, truthful capped search counts, and safe/persistent `localStorage` handling.
2. **Add research-release guardrails:** schema/semantic validation, per-unit canonical locators, a third-party quotation/rights manifest, and CI before large-scale corpus ingestion.
3. **Expand content only after those rails:** complete Biyanlu and broaden the Studio’s schema-driven passage picker.

> **Integrity hotfix shipped in this session:** search and saved-draft markup are escaped; stored drafts are shape-normalized; rich verified translations no longer render as `[object Object]`; the Studio selector is passage-aware; and all 21 Matrix entries now carry explicit status, with source records on its two verified rows.

## Recommended next milestone

Ship a focused **“reader correctness and resilience”** patch (sparse navigation, pointer search, truthful caps, and storage persistence) with regression tests before expanding Biyanlu or adding more translations.
