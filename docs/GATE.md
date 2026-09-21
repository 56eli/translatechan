# Gate — how botrunner knows export is safe to publish

## Official delivery

Git clone at the commit pinned in `export_manifest.json` is the official delivery mechanism (owner decision 2026-09-21). No release tarball, no artifact hosting.

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

- Exit 0: safe to publish
- Exit non-zero: do NOT publish, report failure, attach stdout/stderr to import report
- Read-only unless `--write-metrics` — never mutates data on normal run
- Must stay stdlib-only — `jsonschema` optional, but gate must pass without it

## Execution environment — unprivileged, disposable, stdlib-only, read-only

- Gate is executed **unprivileged** in a **disposable clone** (`/tmp/tc-$COMMIT`), not in the live wiki tree, not as root, not with BookStack credentials.
- Gate must stay **stdlib-only and read-only** on normal run. No `pip install`, no network access, no filesystem writes outside the clone, no BookStack API calls.
- Adding a dependency, adding network access, or making the gate write to the wiki is **a new owner decision**, not an implementation detail. If a future change needs a dependency, it must be proposed in `docs/SCHEMA.md` + `CHANGELOG.md` + `GATE.md` and approved by owner before merging.
- `--write-metrics` is translatechan-lane only — it regenerates `data/project_metrics.json` deterministically and is never used by botrunner.

## Python version — minimum and tested set

- **Minimum:** Python 3.11
- **Tested set:** 3.11, 3.12 — CI (`quality.yml`) runs `python-version: "3.12"`, br1 system `python3` is 3.12.3 and is accepted without container.
- **Future 3.13+:** not ambiguous — if br1 upgrades to 3.13, gate must be re-validated once (`python3 --version` + `validate_data.py` + `build_data_bundle.py` determinism) and tested set in this doc updated. No container required unless owner decides.
- **No container:** system `python3` is official. Container (`python:3.12-slim`) only if owner explicitly decides for isolation, with extra maintenance cost.

## What gate checks

- Source JSON parses and corpus/UI/bundler manifests agree
- Required identity metadata and known content shapes present
- Translation/provenance records structurally valid
- Verified quotations link to rights_manifest.json
- Canonical locator registry covers every document and every case-based unit
- Manifest W1 evidence metadata and per-document source-review statuses explicit
- complete_selected_witness compatible only with collated_to_claimed_witness (source_review.py rule mirrored in app.js, smoke test pins mirror)
- Generated project_metrics.json matches live data
- Live prose docs (README.md, HANDOFF.md, AUDIT.md, ROADMAP.md, etc.) quote same deterministic numbers — doc truthfulness gate (skip with --skip-docs if editing docs)
- Lineage verification edges have valid status, source_id, reference
- 5 disclosure ledgers present and visibly separate

## Mandatory integrity checks — sha256 verification is mandatory, not optional

A manifest nobody verifies proves nothing. Botrunner **must**:

1. Verify `export_ready.json` exists and its `timestamp+commit` matches `export_manifest.json` — if missing or mismatched, export is incomplete, do not import.
2. Verify **every** file listed in `export_manifest.json.files[]` by `sha256` and `size` — fail-closed if any mismatch.
3. Only then run `validate_data.py`.

Example mandatory verification:

```bash
COMMIT=$(jq -r .commit export_manifest.json)
TIMESTAMP=$(jq -r .export_timestamp export_manifest.json)
# 1. ready marker
jq -e --arg c "$COMMIT" --arg t "$TIMESTAMP" '.commit==$c and .export_timestamp==$t and .ready==true' export_ready.json
# 2. sha256 of every file — mandatory
jq -r '.files[] | "\(.sha256)  \(.path)"' export_manifest.json | sha256sum -c -
# 3. gate
python3 scripts/validate_data.py
```

If any step fails, abort import, report failure, notify owner.

## Secondary gates (optional but recommended)

```bash
python3 scripts/build_data_bundle.py
# Determinism check: two consecutive builds byte-identical, root/docs mirror diff clean
# Output: docs/data/ bundle 7,230,634 B deterministic (example)

node scripts/smoke_test.mjs
# Reader smoke: app.js renders texts, 5 ledgers, W1 badges, lineage graph
```

## How botrunner uses gate — full sequence

1. Read `export_manifest.json` — get `commit`, `export_timestamp`, `files[]` sha256
2. `git clone https://github.com/56eli/translatechan.git /tmp/tc-$COMMIT && cd /tmp/tc-$COMMIT && git checkout $COMMIT` — disposable, unprivileged clone
3. Verify `export_ready.json` timestamp+commit matches manifest — mandatory
4. Verify sha256/size of every file in manifest — **mandatory**, not optional
5. Run `python3 scripts/validate_data.py` — capture stdout/stderr, exit 0 safe else abort
6. If exit 0, proceed to import (only_collated=true already enforced in export, defense-in-depth fail if sees partial_or_failed)
7. Optional: run `build_data_bundle.py` determinism check — two builds identical

## Atomicity

- Export is atomic if `export_ready.json` exists and its timestamp+commit matches `export_manifest.json`
- `export_ready.json` is written last, after all files
- If `export_ready.json` missing or mismatched, export is incomplete — do not import

## Read-only promise

- Gate never writes to BookStack, never touches VPS, never holds credentials
- `validate_data.py` without flags is read-only, stdlib-only, no network
- With `--write-metrics` it regenerates `data/project_metrics.json` deterministically — only used by translatechan lane after legitimate data change, never by botrunner

## Example end-to-end

```bash
# on br1, unprivileged user, disposable dir
COMMIT=$(curl -s https://raw.githubusercontent.com/56eli/translatechan/main/export_manifest.json | jq -r .commit)
git clone https://github.com/56eli/translatechan.git /tmp/tc-$COMMIT
cd /tmp/tc-$COMMIT
git checkout $COMMIT
jq -r '.files[] | "\(.sha256)  \(.path)"' export_manifest.json | sha256sum -c -
python3 scripts/validate_data.py
echo $?  # 0 = safe
```

## Charter boundary

- Translatechan owns corpus, integrity gates, content authority, stable exports, quality bar for AI-styled layer
- Does NOT run/configure VPS (no BookStack settings/Caddy/DNS/bot hosting/backups), does NOT write to BookStack directly, does NOT build websites/themes/layouts/Discord features, does NOT make public framing decisions, does NOT dispatch importer or touch Chan bot code
- Botrunner owns VPS ops advisory (recommends, owner applies), import pipeline (gates first, mandatory sha256, idempotent, provenance on every page), presentation (W1 badges verbatim), ops honesty
