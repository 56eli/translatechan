# TranslateChan — Independent Audit Response

> **Audited:** 2026-08-08 UTC · branch `arena/019fe272-translatechan` · baseline `ad8500f` (currently also `origin/main`)
>
> **Scope:** static app/runtime, build and deployment path, source-data contracts, test coverage, documentation, research/disclosure readiness, and repository operations. This is an independent current-state report; historical findings remain in [`AUDIT.md`](./AUDIT.md).

## Executive assessment

TranslateChan is a **healthy static research-reader foundation**, not yet a publication-ready scholarly corpus. The Pages build is live and reproducible; all local quality gates pass; the Reader successfully handles the project’s heterogeneous data shapes; and provenance/rights/locator work is substantially stronger than a typical early project. No current P0 load, parse, build, or deterministic-sync failure was found.

The principal risks are now editorial and release-engineering rather than a broken product: 35/36 texts remain excerpts, most non-case text locators are document-level, modern-translation rights review is incomplete, traditional lineage relationships lack exact source locators, and the intended CI workflow is not actually present in this checkout or on `main`.

| Area | Assessment | Grade |
|---|---|---:|
| Runtime/rendering | 36 documents render; search, sparse case navigation, lazy Wumenguan loading, disclosure UI, and storage fallbacks pass smoke coverage | A− |
| Build/deployment | Manifest-driven bundle; root and `/docs` assets/data synchronize exactly; Pages is built and HTTPS-enforced | A− |
| Data integrity tooling | Semantic validator, metrics, locator registry, provenance, and rights manifest are valuable and passing | A− |
| Test/release automation | Strong dependency-free smoke test, but no checked-in/published CI workflow and no real-browser test | B |
| Research/editorial readiness | Honest status labels and registries; locators/rights/source review remain incomplete | B− |
| Content breadth | Wumenguan is complete; the other 35 corpus files are deliberately excerpt-scale seeds | C |
| Accessibility/security hardening | Good baseline, but keyboard semantics and CSP-compatible event handling remain incomplete | B− |

## Evidence collected

All commands below completed successfully from the audit branch:

```text
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node --check app.js
node --check scripts/smoke_test.mjs
node scripts/smoke_test.mjs
cmp index.html docs/index.html
cmp app.css docs/app.css
cmp app.js docs/app.js
diff -rq data docs/data
```

Measured/current facts:

- **GitHub Pages:** `main` → `/docs`, status `built`, HTTPS enforced.
- **Bundle:** 36 corpus documents; generated `app_data.js` is **694,666 bytes** and root/`docs` copies are byte-identical.
- **Corpus:** 36 documents; **Wumenguan 48/48** plus preface/epilogue; the other **35** remain excerpt seeds.
- **Data contract:** validator reports **856** corpus translation slots, **138** verified corpus quotation objects, **21** matrix entries, and **57/57** case locators.
- **Supporting data:** 31 glossary terms, 30 master profiles, 26 registered internal lineage edges, 4 documented graph frontiers, 18 gong’an-index entries, and 4 comparative-matrix rows.
- **Renderer smoke test:** all 36 corpus texts exercised with zero crashes; checks include schema-specific/pointer/variant search, truthful result caps, escaped search input, sparse case navigation, blocked-storage preference writes, lazy 48-case rendering, public-scope exclusions, citation popovers, Matrix provenance, and lineage chart wiring.

## What is working well

1. **Appropriate architecture:** the dependency-free, zero-backend static application is a good fit for GitHub Pages and long-lived reference material.
2. **Reproducible artifacts:** `build_data_bundle.py` reads the shared manifest and mirrors both deploy assets and source JSON into `/docs`; audit comparisons are clean.
3. **Useful guardrails:** `validate_data.py` enforces many project-specific invariants that a generic schema would miss—manifest alignment, translation status/source requirements, rights source IDs, locator coverage, metrics freshness, and lineage registry coverage.
4. **Honest presentation:** the UI distinguishes verified quotation, reconstruction, and AI-draft records, and avoids presenting pending/legacy locators as exact citations.
5. **Reader resilience:** prior failure modes—corrupted storage, variant search, pointer omission, partial search counts, and nonconsecutive case navigation—have regression coverage.
6. **Scope discipline:** the public Pages surface is limited to the reader, matrix, lineage, gong’an index, and lexicon; browser drafting and agent marketing are absent.

## Open findings and recommended order

### A1 — P1: CI is documented as “prepared locally,” but no workflow exists in the repository

`git ls-tree -r HEAD` and `origin/main` show **no `.github/workflows/*` file**. `HANDOFF.md`, `README.md`, `ROADMAP.md`, and the prior summary describe a ready local workflow awaiting permission, but this checkout does not contain that draft. The local commands are healthy, yet a GitHub PR can merge without an enforceable quality gate.

**Recommendation:** either restore and commit `.github/workflows/quality.yml` when workflow permission is available, or change current-facing docs to say that CI is *planned*, not prepared. The workflow should run Python compilation, validator, deterministic build/artifact-diff check, smoke test, and (once added) browser tests.

### A2 — P1: Scholarly-release gate remains editorial, not automated

The project correctly records that 33 non-case documents are `legacy_document_seed` locators, 5 verified source records still have a page/section reference pending, and modern translations have rights-review states rather than publication clearance. The validator proves that required fields and IDs are present; it **cannot prove textual collation, quotation accuracy, copyright permission, or fair-use applicability**.

**Recommendation:** do not label the whole corpus publication-ready. Establish an editorial queue that upgrades non-case units to page/line, case/fascicle, or TEI anchors; records edition/revision evidence; resolves the five pending references; and signs off each rights-manifest record before expanding quotation reuse.

### A3 — P2: The “formal JSON Schema” is a companion, not an executed schema validation gate

`validate_data.py` loads `schemas/translatechan-data.schema.json` only to verify that it has `$schema` and `$defs`; it does not validate source JSON instances against that schema. Its semantic validation is substantial and currently the effective contract, but docs can be read as claiming schema execution.

**Recommendation:** either (a) say “schema companion plus dependency-free semantic validator” consistently, or (b) add an actual JSON-Schema validation step in CI (with a pinned dependency or a checked-in minimal validator). Keep the semantic rules in either case.

### A4 — P2: No real-browser or assistive-technology regression test

The Node smoke test is thoughtfully broad but evaluates `app.js` through a hand-built DOM stub and `eval`; it cannot validate layout, CSS breakpoints, SVG pointer/keyboard behavior, browser CSP behavior, real hash navigation, or screen-reader semantics.

**Recommendation:** add one Playwright/WebDriver browser smoke suite for desktop and mobile widths. Prioritize: initial load, hash deep link, mobile corpus picker/action bar, lazy case expansion, citation popover, keyboard activation, print stylesheet, and an accessibility scan. It may initially be optional if dependency installation is undesirable.

### A5 — P2: Accessibility and CSP hardening are incomplete

The app has a skip link, focus styling, reduced-motion handling, and some ARIA work, but interactive lineage **master cards are clickable `<div>` elements** and many generated controls rely on inline `onclick`. This makes keyboard behavior inconsistent and prevents a restrictive Content Security Policy without a refactor. Tooltip term spans are focusable but do not visibly implement Enter/Space activation in the current audit path.

**Recommendation:** convert controls to native buttons/links or attach delegated event listeners; add complete keyboard behavior and ARIA relationships; then introduce a CSP that removes inline script/event-handler allowances. Treat repository data as trusted only after escaping remains consistently enforced.

### A6 — P3: Content coverage is the main product limitation

The project’s documentation is candid, but 35/36 documents are still small seeds; Biyanlu is 7/100 and Congronglu 2/100. The 18-entry gong’an index and 31-term glossary are also intentionally early-stage.

**Recommendation:** expand **Biyanlu** next under the existing locator/provenance/rights contract, then synchronize gong’an-index and glossary growth with the newly added units. Do not add volume faster than source-location and editorial-review capacity can support.

### A7 — P3: Data is deployed redundantly and the first-load payload will grow linearly

The browser uses the complete 695 KB `app_data.js` bundle, while `/docs/data/` mirrors the same data for repository/deployment transparency. This is acceptable today, but the monolithic script will become a material initial-load cost as Biyanlu and other texts grow.

**Recommendation:** keep the current bundle while it is small and simple; before the next major corpus expansion, measure mobile performance and decide between (1) per-text JSON lazy loading with an offline/search index strategy, or (2) compressed/chunked prebuilt bundles. Preserve the deterministic source→deploy sync contract either way.

## Recommended next milestone

1. **Resolve A1 first:** make CI truthful and enforce it when permissions permit.
2. **Plan A2 as an editorial workstream:** start the locator/reference/rights review queue before substantial quotation expansion.
3. **Choose a content pilot:** complete Biyanlu under those guardrails, including canonical locators and source-status records as each case is added.
4. In parallel, complete **A4/A5** with a small browser/a11y pass before describing the public reader as release-tested across devices.

## Audit limitations

This audit did not independently collate every Chinese passage against CBETA/TEI, verify every modern quotation against print editions, provide legal advice on copyright/fair use, execute a live browser matrix, or certify screen-reader support. Passing local checks establishes code/data consistency—not scholarly or legal publication clearance.

**One-sentence completion summary:** The audit found a healthy, reproducible static reader with no critical runtime defects, while CI publication, editorial source/rights migration, browser/a11y verification, and corpus expansion remain the highest-value next work.
