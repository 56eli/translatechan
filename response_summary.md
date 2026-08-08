# 🪷 TranslateChan — Current Project Summary

> **Baseline audited snapshot:** `8717e969eab653ebe674c9ee76dcc41181dc8379` (2026-08-08); the current branch adds the integrity and reader-reliability remediations recorded in [`AUDIT.md` §§10.6–10.7](./AUDIT.md#106-integrity-hotfix--c1c2c3-remediated-same-session).
> **Full current audit:** [`AUDIT.md` §10](./AUDIT.md#10-2026-08-08--current-independent-audit-post-pr-3). Historical session reports remain in `AUDIT.md` §§0–9 and `SESSION_AUDIT_2026-08-08.md`.

## Current state

- **Deployment:** static GitHub Pages, publishing `main` → `/docs`; Pages status is built and HTTPS is enforced. Public navigation is limited to Reader, Matrix, Lineage, Gong’an Index, and Lexicon (no Translation Studio, Arena AI Agents view, or header GitHub link).
- **Architecture:** vanilla HTML/CSS/JS; a shared `corpus_manifest.json` drives the bundle and reader navigation; source JSON is deterministically bundled into `app_data.js`; root assets and `/docs` data mirror are synchronized by `scripts/build_data_bundle.py`.
- **Corpus:** 36 structured texts. *Wumenguan* is complete (48/48 cases plus preface/epilogue); the other 35 texts are explicitly excerpt-scale seeds.
- **Measured data:** 31 glossary terms, 30 lineage profiles, 26 registered in-set lineage links plus 4 disclosed frontiers, 18 gong’an index entries, 4 comparative-matrix rows, 856 corpus translation slots, and 138 verified corpus quotation objects (plus 2 Matrix entries marked verified).
- **Validation completed:** formal schema + semantic/rights/locator validation, deterministic metrics, Python/JavaScript syntax checks, bundle rebuild, root↔`docs` comparison, and the expanded smoke suite all pass; a CI workflow is prepared locally and awaits workflow-capable GitHub access before publication.

## What is strong

1. The zero-backend deployment is simple, portable, and currently healthy.
2. The bundle/build/smoke-test discipline catches broad renderer regressions across all 36 corpus schemas, including real debounced search, sparse navigation, pointer search, and blocked-storage execution.
3. The corpus candidly distinguishes complete Wumenguan coverage from excerpt seeds.
4. Reader and Matrix now share explicit reconstruction/AI/verified badges plus visible book/edition/page-reference disclosure and hover/focus/touch citation popups; verified entries expose source metadata and a rights-manifest identifier.
5. Public scope is deliberately focused on comparative reading and research discovery rather than browser-based drafting or agent branding.
6. Manifest-driven bundling, schema/semantic validation, canonical-locator registry, rights controls, deterministic metrics, and a prepared CI workflow will prevent silent data/deploy drift once workflow-capable GitHub access is restored.
7. The lineage graph now exposes a chart-status summary, source-aware edge styling, and click/keyboard citation details rather than silently presenting all traditional links as settled fact.

## Highest-priority open work

1. **Migrate legacy scholarly coverage:** upgrade the 33 document-level seed locators and 26 traditional lineage links to page/line, record, or TEI anchors; replace the 11 visible book-page/episode pending records with exact book references; and complete human editorial/rights review for modern quotation sources.
2. **Expand content under the new rails:** complete Biyanlu and deepen the public reader’s source/citation disclosure.
3. **Finish accessibility/disclosure polish:** keyboard activation for all interactive controls and consistent hover/focus/touch citation popups.

> **Integrity, reader reliability, and research-release guardrails shipped in this session:** dynamic markup is escaped; verified translations/provenance are explicit; sparse navigation/search/storage are robust; the corpus manifest, locator registry, rights manifest, schema/semantic validator, deterministic metrics, and a prepared CI workflow protect future changes once workflow-capable GitHub access is restored.

## Recommended next milestone

Start **Biyanlu expansion under the new guardrails**, while separately planning page/line locator migration and editorial rights review for legacy seeds.
