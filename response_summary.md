# Current Session Result — 2026-09-10

## Completed

- Brought PR #25's W1 hardening into the session branch and made it merge-ready (new PR open against `main`, not merged).
- Hardened `scripts/w1_evidence.py`: every derived figure is now independently recomputed — per-document field arithmetic (totals vs class summaries vs flagged arrays), per-document reference provenance against both committed digest manifests, the aggregate block, and the historical-vs-authoritative reproduction comparison. A drifted/unlisted reference can never upgrade a W1 status; duplicate register keys, wrong/malformed entry keys, and report claims that disagree with the evidence all fail validation.
- Protected `--write-metrics`: any blocking evidence/data error exits nonzero and leaves `data/project_metrics.json` byte-identical (11-case mutation matrix added to `scripts/test_source_review_rules.py`).
- One shared completion rule verified end-to-end (validator, `complete_document_keys()`, `per_text_metrics()`, Reader, shelf, smoke test, and `scripts/compat_runtime_check.mjs`): complete ⇔ `complete_selected_witness` + `collated_to_claimed_witness`.
- Added `scripts/test_source_preservation.py` (CI-gated via the smoke test): `data/corpus/` byte-compared against pinned base commit `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43`; only the two intended `coverage_note` changes are permitted; it fails with the exact changed paths.
- Removed the accidental public API `window.TranslateChan.getSourceReviewStatus` (no replacement API); smoke-guarded against re-appearance.
- Documentation: removed `AUDIT.md:3` trailing whitespace (both `git diff --check` forms now pass); fixed the stale current-verdict date (2026-09-09 → 2026-09-10); replaced the stale "one of 34 evaluated documents" current claims (AUDIT/HANDOFF) with the authoritative 35-document record; README's unsupported `X68n1315A` → supported `X68n1315`; HANDOFF now records that T1987 is the Caoshan record; strengthened doc checks so unsupported Zhaozhou identifiers, unqualified T1987 claims, stale "34 evaluated" totals, and a missing "no current `complete_selected_witness`" statement fail; fixed the correction report's malformed backticks, its historical-vs-current digest-manifest file-count description, the contradictory Shitou harness comment, and Xinxin Ming's stale 25/37 collation figure (authoritative: 24/37); added the 2026-09-10 row to the AUDIT report index.
- Regenerated `data/project_metrics.json` and the `app_data.js` + `/docs` mirror deterministically.

## Current gate

All five quality gates pass locally (compile / validate / build / smoke / mirror diff). No corpus source-Chinese field, translation, edition record, rights decision, localStorage key, CSP rule, workflow, or scoreboard file was touched; the 2026-09-09 evidence files are untouched (append-only).

## Verification

```text
python3 -m py_compile scripts/*.py      PASS
python3 scripts/validate_data.py        PASS
python3 scripts/validate_data.py --write-metrics   PASS (metrics deterministic)
python3 scripts/build_data_bundle.py x2 + sha256sum   PASS (stable)
python3 scripts/test_source_review_rules.py   PASS (57 checks, incl. 11-case mutation matrix)
python3 scripts/test_source_preservation.py   PASS (35 files vs base commit)
node scripts/smoke_test.mjs             PASS
diff -rq data docs/data                 PASS
git diff --check                        PASS
git diff --check origin/main...HEAD     PASS
```
