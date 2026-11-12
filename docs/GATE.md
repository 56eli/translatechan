# Gate — how botrunner knows export is safe to publish

## Official delivery

Git clone at the commit pinned in `export_manifest.json` is the official delivery
mechanism. No release tarball, no artifact hosting.

```bash
git clone https://github.com/56eli/translatechan.git /tmp/tc-$COMMIT
cd /tmp/tc-$COMMIT
git checkout $COMMIT  # $COMMIT = export_manifest.json.commit
```

Botrunner is read-only by charter — clone is read-only, no push, no credentials.

## Exact gate command

```bash
python3 scripts/validate_data.py
```

- Exit 0: safe to publish only after the mandatory export-manifest checks below.
- Exit non-zero: do NOT publish; report failure and attach stdout/stderr.
- Read-only unless `--write-metrics`; never mutates data on normal run.
- Must stay stdlib-only; `jsonschema` is optional.

## Execution environment

- Unprivileged, disposable clone, not the live wiki tree, not root, no BookStack
  credentials.
- Stdlib-only and read-only on normal run. No `pip install`, no network access,
  no filesystem writes outside the clone, no BookStack API calls.
- Adding a dependency, network access, or wiki writes is a new owner decision.
- `--write-metrics` is translatechan-lane only and never used by botrunner.

## Python version

- Minimum: Python 3.11.
- CI pins Python 3.12.
- If the system Python major/minor changes, revalidate once and update this doc.

## What the data gate checks

- Source JSON parses and corpus manifest agrees with corpus files.
- Required identity metadata and known content shapes present.
- Translation/provenance records structurally valid.
- Verified quotations link to `rights_manifest.json`.
- Canonical locator registry covers every document and case-based unit.
- Manifest W1 evidence metadata and per-document source-review statuses explicit.
- `complete_selected_witness` compatible only with `collated_to_claimed_witness`
  and satisfied unit targets.
- Generated `project_metrics.json` matches live data.
- Current prose docs quote measured data claims.
- Lineage verification edges have valid status, source_id, reference.
- The five disclosure categories remain separate in the data contract.

The retired browser runtime is not part of this gate. There is no `app_data.js`
bundle and no old smoke/DOM contract.

## Mandatory export integrity checks

A manifest nobody verifies proves nothing. Botrunner must:

1. Verify `export_ready.json` exists and its `timestamp+commit` matches
   `export_manifest.json`; if missing or mismatched, export is incomplete.
2. Verify every file listed in `export_manifest.json.files[]` by `sha256` and
   `size`; fail closed on any mismatch.
3. Only then run `validate_data.py`.

```bash
COMMIT=$(jq -r .commit export_manifest.json)
TIMESTAMP=$(jq -r .export_timestamp export_manifest.json)
jq -e --arg c "$COMMIT" --arg t "$TIMESTAMP" '.commit==$c and .export_timestamp==$t and .ready==true' export_ready.json
jq -r '.files[] | "\(.sha256)  \(.path)"' export_manifest.json | sha256sum -c -
python3 scripts/validate_data.py
```

If any step fails, abort import, report failure, notify owner.

## Current export artifact status

The root `export_manifest.json` / `export_ready.json` are known stale relative to
the current corpus/metrics and fail closed. The 2026-11-12 layout demolition did
not implement or reissue an exporter. Do not import from them.

## Secondary repository gates

```bash
python3 scripts/build_pages.py
python3 scripts/test_pages_contract.py
```

These verify the owner-stub Pages mirror, not botrunner export safety. The export
gate remains the manifest/ready/data-validation sequence above.

## Atomicity

- Export is atomic only if `export_ready.json` exists and matches the manifest.
- `export_ready.json` is written last, after all files.
- Missing or mismatched ready marker means incomplete export; do not import.

## Charter boundary

- Translatechan owns corpus, integrity gates, content authority, stable exports,
  and quality bar for the AI-styled layer.
- Botrunner owns VPS ops advisory, import pipeline, gates first, mandatory sha256,
  idempotence, provenance on every page, and presentation.
- Translatechan does not run/configure VPS, write to BookStack directly, build
  Discord features, or dispatch the importer.
