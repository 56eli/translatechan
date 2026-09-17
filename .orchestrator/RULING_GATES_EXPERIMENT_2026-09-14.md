# RULING 2026-09-14 — Turn Off Presentation Gates While Experimenting, Keep Text Integrity Gates

**Date:** 2026-09-14 (owner feedback on PR #75 analysis)
**Source:** Owner verbatim: "Your analysis looks good. We can turn off gates that don't touch text integrity as website should just be presentation, and we're allowed to break presentation while experimenting."

**Status:** DEFINITIVE for experimenting phase, must be reflected in CI and docs.

## Verbatim Owner Statements

- Analysis looks good.
- We can turn off gates that don't touch text integrity as website should just be presentation, and we're allowed to break presentation while experimenting.

## Interpretation as Law

1. **Text integrity gates — MUST stay ON, required, failing:**
   - `python3 -m py_compile scripts/*.py` — Python syntax, affects all
   - `python3 scripts/validate_data.py` — corpus 35, slots 1252, verified 177, matrix 21, locators 148/148, W1 flagged 630 — text integrity
   - `python3 scripts/build_data_bundle.py` — deterministic bundle, text integrity (app_data.js)
   - `python3 scripts/test_source_preservation.py` — 0 unauthorized Chinese edits — text integrity
   - `python3 scripts/test_source_review_rules.py` — 138 W1 source-review rule checks — text integrity

2. **Presentation gates — CAN be turned OFF while experimenting, allowed to break presentation:**
   - `node scripts/smoke_test.mjs` — 35 texts render-lazy, 0 style=, CSP — presentation, can break while experimenting
   - `git diff --exit-code -- app_data.js docs data/project_metrics.json` + `diff -rq data docs/data` — docs mirror byte-identical — presentation, can break while experimenting
   - `python3 scripts/test_website_ruling.py` — law + common qualities — this enforces subjective law (NOT beautiful NOT done, NOT capable to judge, 1-10 aim 8+, light mental load etc.) — this is about presentation law, but should stay ON even while experimenting? Owner says turn off gates that don't touch text integrity, so website ruling gate doesn't touch text integrity, but it enforces law that prevents agents claiming beauty. Decision: keep website ruling gate ON even while experimenting, because it enforces LAW, not presentation quality. However, if it blocks drastic layout changes, we can make it warning not failing during experimenting? For now, keep ON but allow 30MB ceiling and drastic changes.

3. **Bundle ceiling 30MB for testing phase** — per RULING_BUNDLE_CEILING_2026-09-14.md, technically feasible, Quality workflow doesn't enforce size directly

4. **Allowed to break presentation while experimenting:** Means agents can implement drastic layout changes across ALL rooms (Reader, Compare, Lineage, Cases, Terms), different number of tabs allowed, even if smoke_test fails or docs mirror not byte-identical, as long as text integrity gates PASS. Presentation breakage is acceptable during experimenting phase.

5. **After experimenting phase, presentation gates will be re-enabled** — owner will decide when to turn them back on.

## Enforcement

- Update `.github/workflows/quality.yml` to have two jobs or comment out presentation gates with note "turned off while experimenting per owner ruling 2026-09-14"
- For now, keep text integrity gates as required status checks, make presentation gates optional (continue-on-error: true) or remove from required checks
- Document in OPERATIONS.md Edit5: presentation gates turned off while experimenting
- `scripts/test_website_ruling.py` stays ON to enforce law (NOT beautiful NOT done etc.) + common qualities, but should NOT fail on bundle >2MB during testing (allow 30MB) and should NOT fail on smoke-related presentation breakage

## Relationship to Other Rulings

- Website ruling law (NOT beautiful NOT done, NOT capable to judge, 1-10 aim 8+) remains definitive, enforced
- Common qualities law (light mental load, English first, not dense, comfortable, piece meal, info sections, ideal colors of 1) remains definitive, enforced
- Bundle ceiling 30MB testing phase remains definitive
- This ruling adds: text integrity gates required, presentation gates optional while experimenting, allowed to break presentation

## Questions per LAW (must ask)

- Does turning off presentation gates while keeping text integrity gates look good?
- Is this the right direction — allow breaking presentation while experimenting to enable drastic layout changes?
- How good is it on a scale from 1-10 where we aim for at least 8?
