# Gate — how botrunner knows export is safe to publish

## Exact command

```bash
python3 scripts/validate_data.py
```

- Exit 0: safe to publish
- Exit non-zero: do NOT publish, report failure
- Read-only unless `--write-metrics` — never mutates data on normal run
- Needs: checkout of repo, Python 3.11+, no extra deps (jsonschema optional, used if installed)

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

## Secondary gates (optional but recommended)

```bash
python3 scripts/build_data_bundle.py
# Determinism check: two consecutive builds byte-identical, root/docs mirror diff clean
# Output: docs/data/ bundle 8,826,431 B sha256 41b4838...c1a5f548 (example)

node scripts/smoke_test.mjs
# Reader smoke: app.js renders 44 texts, 5 ledgers, W1 badges, lineage graph
```

## How botrunner uses gate

1. Checkout translatechan at commit from export_manifest.json
2. Run `python3 scripts/validate_data.py` — capture stdout/stderr
3. If exit !=0, abort import, attach gate output to import report, notify owner
4. If exit 0, proceed to import
5. Optional: run build_data_bundle.py determinism check — two builds identical

## Atomicity

- Export is atomic if `export_ready.json` exists and its timestamp+commit matches `export_manifest.json`
- `export_ready.json` is written last, after all files
- If `export_ready.json` missing or mismatched, export is incomplete — do not import

## Read-only promise

- Gate never writes to BookStack, never touches VPS, never holds credentials
- `validate_data.py` without flags is read-only
- With `--write-metrics` it regenerates `data/project_metrics.json` deterministically — only used by translatechan lane after legitimate data change

## Example

```bash
git clone https://github.com/56eli/translatechan.git
cd translatechan
git checkout 78e7495
python3 scripts/validate_data.py
echo $?
# 0 = safe
```

## Charter boundary

- Translatechan owns corpus, integrity gates, content authority, stable exports, quality bar for AI-styled layer
- Does NOT run/configure VPS (no BookStack settings/Caddy/DNS/bot hosting/backups), does NOT write to BookStack directly, does NOT build websites/themes/layouts/Discord features, does NOT make public framing decisions, does NOT dispatch importer or touch Chan bot code
- Botrunner owns VPS ops advisory (recommends, owner applies), import pipeline (gates first, idempotent, provenance on every page), presentation (W1 badges verbatim), ops honesty
