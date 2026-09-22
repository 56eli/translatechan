# Gate — Integrity Trust Baseline (P0)

This file documents the executable read-only gate that is the official delivery check for TranslateChan.

## Official delivery form

- **Form:** `git clone` at the commit pinned in `data/corpus_manifest.json` (`manifest.commit` / `manifest.timestamp` when present, otherwise HEAD) is the official delivery artifact. The Pages bundle `app_data.js` is derived, not authoritative.
- **Manifest checksums:** every file listed in `data/corpus_manifest.json` must be verified by SHA-256. A manifest nobody verifies proves nothing. The gate must compute `sha256(file)` for each manifest entry and compare to the declared checksum; any mismatch fails closed.
- **Atomic ready marker:** the manifest's ready marker (when present) must be checked last, after all checksums.

## Gate execution environment

- **Unprivileged disposable clone:** the gate must be executed in an unprivileged, disposable, network-isolated clone. It must not mutate the source checkout. It must be safe to run as an unprivileged user.
- **Read-only:** the gate is read-only — it never writes to `data/`, `docs/`, or the manifest. It exits 0 only when all checks pass; any failure exits non-zero.
- **Stdlib-only:** the gate is stdlib-only (Python standard library). Adding a dependency or network access is a new decision, not an implementation detail. No `pip install`, no network fetch.
- **Minimum version:** Python 3.11 minimum. Tested set: 3.11, 3.12, 3.13 (CI currently pins 3.12 in `.github/workflows/quality.yml`; 3.11 is the floor, 3.13 is validated locally). Future 3.13 on br1 must not create ambiguity — this file is the source of truth.
- **Determinism:** `python3 scripts/build_data_bundle.py` run twice must produce byte-identical `app_data.js` and `docs/app_data.js` (SHA-256 identical). `python3 scripts/validate_data.py` must pass.

## Checks performed (fail-closed)

1. `python3 -m py_compile scripts/*.py`
2. `python3 scripts/validate_data.py` (full doc truthfulness, provenance census, W1 source-review, locators, translations)
3. `python3 scripts/build_data_bundle.py` + `git diff --exit-code -- app_data.js docs/app_data.js docs/data data/project_metrics.json`
4. `python3 scripts/test_source_preservation.py` (allowlist, no unauthorized Chinese edits)
5. `python3 scripts/test_source_review_rules.py` (138 checks, including census pins)
6. `node scripts/smoke_test.mjs` (dependency-free reader smoke)

## References

- `data/corpus_manifest.json` — 17 keys (current), source_review, commit/timestamp when present
- `scripts/validate_data.py` — authoritative validator
- `.github/workflows/quality.yml` — CI gate (permissions: contents: read, setup-python 3.12)
- `data/project_metrics.json` — derived metrics, must be stale-checked by validator

## History

- Amendment 2026-09-21 second round: git clone at manifest commit is official delivery; system `python3` for gate, no container.
- Requirements (a) sha256 verification mandatory, (b) unprivileged disposable stdlib-only read-only, (c) minimum version + tested set documented here.

