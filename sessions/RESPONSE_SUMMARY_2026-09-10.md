# Session Result — 2026-09-10 (archived from root `response_summary.md`)

> Archived 2026-09-14 (task 008, web polish bundle): this file was the disposable
> per-session `response_summary.md` at repository root (see `HANDOFF.md` §11
> documentation rule). It is preserved here, in append-only `sessions/`, rather
> than deleted outright, and root no longer carries a live copy.

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

## Successor session — focused W1 gap closure (PR #27 follow-up)

Five small review findings left after PR #27 were closed in five separate pushed checkpoints.
PR #27's tree was merged in as a merge commit (`000d3cac76dcb24df2a574f548bb31fa3c04fe0c`) without
checking out its branch; PR #27 itself was not amended, force-pushed, merged or rewritten, and no
historical W1 evidence file was modified.

| Checkpoint | Commit | Fix |
| --- | --- | --- |
| Replay conflict detection | `8c249b17f9952ef60f05f2451b71a3e5b737d478` | `--reproduce` now normalizes both sides of the flag comparison, so a re-typed `--generated 1999-01-01` **and** `--generated=1999-01-01` are rejected before a reference directory is required. Only options the register's `generation_parameters` records are conflicts; `--refs-dir/--out/--print-refs/--reproduce` stay operational. |
| Source-preservation allowlist | `a33120d5ae4511e45f7b33ca5e0ceb81f873700e` | The allowlist is exact JSON pointers (`data/corpus/wumenguan.json:.coverage_note`, `data/corpus/xinxin_ming.json:.coverage_note`), not final key names: a nested `cases[0].coverage_note` now fails and is reported by its exact path. The run prints `35 corpus files compared / 2 permitted root coverage_note changes / 0 unauthorized changes`. |
| Historical metadata validation | `d03f92d2d0e08794b0215c9d2a3d7b8bb83b65e6` | The 2026-09-09 register's legacy `refs_manifest` declaration (`refs_manifest.txt (sha256)`) is pinned and bound to the committed `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt`: `sessions/fake.txt`, a missing manifest, and a claimed witness the manifest does not list all fail. |
| Evidence-class validation | `6ab20082dbd3e7a9427391b75a3c9960e36a8fec` | `source_review.COLLATION_CLASSES` is now the one class vocabulary (the harness `SUMMARY_ORDER` is that tuple) and is enforced in `summary`, `content_summary`, `metadata_summary`, `flagged[].class` and `aggregate.class_totals`; an unknown label such as `FORGED_CLASS` fails validation and is named in the error. |
| Documentation correction + final integration | `fb3ba78d0c0afcea4793ed6a666faf311c87e9b6` | `.orchestrator/REMEDIATION_PLAN.md` no longer presents the stale 174-reference count as current: it quotes the 187 entries the committed historical manifest lists, and `validate_data.py` now enforces that (counting the manifest, and rejecting an unqualified 174). |

Every invalid metrics run above exits nonzero with `--write-metrics` refused and leaves
`data/project_metrics.json` byte-identical (sha256 prefix `fd9493ca6bdcc7e8`).

Verification of the integrated tree:

```text
python3 -m py_compile scripts/*.py                     PASS
python3 scripts/test_source_review_rules.py            PASS (96 checks, incl. replay conflicts,
                                                             2 historical-metadata mutations,
                                                             6 evidence-class mutations,
                                                             174-claim documentation mutation)
python3 scripts/test_source_preservation.py            PASS (35 compared / 2 permitted / 0 unauthorized;
                                                             nested coverage_note copy exits 1 by exact path)
python3 scripts/validate_data.py --write-metrics       PASS (metrics hash unchanged: fd9493ca6bdcc7e8)
python3 scripts/validate_data.py                       PASS
python3 scripts/build_data_bundle.py                   PASS
node scripts/smoke_test.mjs                            PASS
diff -rq data docs/data                                PASS (identical)
npm audit --package-lock-only                          PASS (0 vulnerabilities)
git diff --check / git diff --check origin/main...HEAD PASS
```

Browser testing was not attempted for this focused pass (no UI, runtime API, CSP or
localStorage change is in scope), so no visual or accessibility verification is claimed.
