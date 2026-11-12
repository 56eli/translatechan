# Gate — Integrity Trust Baseline

This file documents the executable repository gate after the 2026-11-12 layout
demolition. It protects source data, metrics, preservation, and the owner-stub
Pages mirror. It does not protect the retired walnut-shell DOM.

## Official delivery form

- Git clone at the commit under review is the delivery artifact.
- `data/corpus_manifest.json` and the dated W1 evidence records remain the source
  of truth for corpus identity and source-review status.
- The Pages artifact is derived: root `index.html` + `data/` are mirrored into
  `docs/` by `scripts/build_pages.py`. There is no `app_data.js` bundle.

## Gate execution environment

- Unprivileged disposable clone, stdlib-only, no network fetch required.
- Normal validation is read-only. `--write-metrics` is only for legitimate source
  data changes and must fail closed on blocking errors.
- Python 3.11 minimum; CI pins Python 3.12.

## Checks performed

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_pages.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
python3 scripts/test_pages_contract.py
git diff --exit-code -- docs/index.html docs/data docs/robots.txt docs/sitemap.xml docs/.nojekyll data/project_metrics.json
git diff --check
```

## Pages contract

- `docs/index.html` is byte-identical to the owner-stub root `index.html`.
- `docs/data/` is byte-identical to `data/`.
- Retired frontend assets and legacy presentation gates stay deleted.
- `scripts/build_pages.py` is deterministic and removes retired deploy files
  instead of resurrecting them.

## References

- `scripts/validate_data.py` — authoritative data/metrics/doc-truthfulness validator.
- `scripts/test_source_preservation.py` — corpus byte preservation and declared growth.
- `scripts/test_source_review_rules.py` — W1 evidence/status/metrics regressions.
- `scripts/test_pages_contract.py` — owner-stub deploy mirror and demolition boundary.
- `.github/workflows/quality.yml` — CI gate.
