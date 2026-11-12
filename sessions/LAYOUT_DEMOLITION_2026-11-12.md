# Layout Demolition — 2026-11-12

**Branch:** `arena/ab741fb2-translatechan`
**Base:** `48e8e13219d750928e1667c9441eb4a6dbda9dd7`
**Owner request:** exhaustively destroy the old layout protected by the build process,
documentation, and tests. The re-uploaded root `index.html` stub is the sole layout
authority. Functionality porting into the stub follows this demolition.

## Scope executed

- Deleted the retired walnut-shell frontend and deploy mirror assets:
  `app.css`, `app.js`, `app_data.js`, `theme-init.js`, `og-image.svg`, `og-image.png`
  at root and under `docs/`.
- Deleted retired presentation/build gates:
  `scripts/build_data_bundle.py`, `scripts/smoke_test.mjs`,
  `scripts/compat_runtime_check.mjs`, `scripts/browser_test.mjs`,
  `scripts/update_docs.py`, `package.json`, `package-lock.json`.
- Replaced the bundle publisher with `scripts/build_pages.py`: root owner stub +
  crawler files + authoritative `data/` are mirrored into `docs/`; retired deploy
  files are removed; no JavaScript bundle is generated.
- Added `scripts/test_pages_contract.py`: deletion permanence, root/docs stub byte
  equality, data mirror equality, deterministic rebuild, anti-resurrection, and
  fail-closed missing-source checks.
- Re-pointed `scripts/validate_data.py`, `scripts/source_review.py`,
  `scripts/test_source_preservation.py`, and `scripts/test_source_review_rules.py`
  away from the retired DOM/bundle contract while retaining source-data, W1 evidence,
  metrics, preservation, and doc-truthfulness protections.
- Updated `.github/workflows/quality.yml` under the owner's demolition request;
  recorded as `OPERATIONS.md` Edit 7.
- Rewrote current authority docs (`AGENTS.md`, `docs/PROJECT_STATE.md`, `README.md`,
  `HANDOFF.md`, `AUDIT.md`, `ROADMAP.md`, `vision.md`, `RESEARCH_RELEASE_PLAN.md`,
  `GATE.md`, `docs/GATE.md`, `OPERATIONS.md`, `SECURITY.md`, PR template, LICENSE code
  scope) to the stub-era contract.
- Labelled retired design specs and old gate-repin/dispatch documents
  `RETIRED / NON-AUTHORITATIVE (2026-11-12)`. Historical `sessions/`, `docs/audits/`,
  and the SHA-pinned orchestrator core were not edited.

## Local gate evidence

```text
python3 -m py_compile scripts/*.py bin/orchestrator-check  → OK
python3 scripts/validate_data.py                           → PASS
  corpus=17 | slots=209 | verified=2 | matrix=21 | locators=4192/4192
  W1 source review: collated=13 | partial/failed=2 | unavailable=2 | flagged=127
  evidence=2026-09-22 → sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json
python3 scripts/build_pages.py                             → OK
python3 scripts/test_source_preservation.py                → PASS
  12 corpus files compared; 5 declared new corpus files; 0 unauthorized changes
python3 scripts/test_source_review_rules.py                → PASS (96 checks)
python3 scripts/test_pages_contract.py                     → PASS (59 checks)
python3 scripts/test_lineage_batch1.py                     → PASS (offline)
python3 bin/orchestrator-check                             → OK
diff -rq data docs/data                                    → clean
git diff --check                                           → clean
```

## Preserved boundaries

- No corpus source text, manifest status, locator, translation, rights record, or
  `data/project_metrics.json` was changed by this demolition.
- `sessions/` dated evidence and `docs/audits/` curated evidence remain append-only /
  preserved.
- `export_manifest.json` / `export_ready.json` remain known stale and fail closed; no
  exporter was implemented or reissued.

## Known follow-up gaps

- The owner stub is a reset point, not a finished port: cases-only reader, placeholder
  Gallery, localStorage-only Account UI, and missing comparative/provenance surfaces.
- No real-browser evidence exists for the current stub.
- Rights review and OUT-OF-CBETA sourcing remain human work.
