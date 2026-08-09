# Structural Assessment — C1/C2/C3 (2026-08-09)

This is a temporary response file for review. It assesses the remaining
structural/maintainability items without changing code yet.

## C1 — `app.js` size and modularization

**Current state:** `app.js` is a single 2,300+ line IIFE. It is organized better
than most files this size: clear sections, no global leakage, consistent
escaping, and the DOM/render/data concerns are mostly separated by function.
However, it now contains six views plus shared infrastructure (search,
citations, glossary popovers, lineage pan/zoom, storage, routing).

**Recommendation:** Defer a full module split until the next feature that
naturally touches multiple view files. A pre-emptive split now risks a large
diff with little functional benefit.

When ready, use native ES modules with no bundler:

```text
app/
  main.js
  lib/
    dom.js
    escape.js
    storage.js
    citations.js
    search.js
  views/
    reader.js
    matrix.js
    lineage.js
    gongan.js
    lexicon.js
```

Load with `<script type="module" src="app/main.js" defer></script>` and keep
`window.TRANSLATECHAN_DATA` as a global for zero-build simplicity. If GitHub
Pages MIME/module path issues arise, `build_data_bundle.py` can concatenate
deterministically.

**Important constraints:**
- Preserve exact rendering output and smoke-test behavior.
- Do not introduce npm/React/Vite/webpack; zero-build is a project feature.
- Keep CSP as `script-src 'self'`; no inline module bootstrap.
- Move `escHtml` first because many modules need it.
- Keep `window.TranslateChan` public helpers stable for deep links.

## C2 — JSON Schema strictness — partial progress shipped 2026-08-09

**Completed:**

- `translationValue` now points only at `translationRecord`; legacy bare strings
  are no longer schema-valid.
- `translationRecord.additionalProperties` is now `false`, so corpus translation
  records only allow `text`, `status`, and `source`.
- `validate_data.py` mirrors this strictness by rejecting unknown corpus
  translation fields.

**Still recommended:**

1. Tighten a small, stable object next (for example `quotationSource` after
   confirming every source field in use).
2. Add explicit schemas for corpus shape fields (`cases`, `sections`,
   `dialogues`, `stanzas`, `chapters`, `five_ranks`, `sample_records`).
3. Do **not** tighten heterogeneous corpus documents all at once; the Python
   validator remains the better place for cross-shape semantics.
4. A formal JSON Schema evaluator is not currently added (the runtime has no
   `jsonschema` package and the project avoids extra dependencies); the Python
   validator enforces the same invariants.

## C3 — `ingest_cbeta.py` naming — ✅ shipped 2026-08-09

Renamed the local punctuation/dialogue segmenter to
`scripts/segment_classical.py`. `scripts/ingest_cbeta.py` remains as a
deprecated compatibility wrapper that prints a warning and delegates to the new
script; README/HANDOFF/ROADMAP references were updated. Dated session reports
keep the historical filename intentionally.

## Suggested order

1. **C3 now or never-ish:** 15-minute rename/doc cleanup with no data risk.
2. **C2 incrementally:** tighten `translationRecord` first, then corpus core
   metadata only.
3. **C1 opportunistically:** split when the next non-trivial view feature begins,
   not as a standalone large refactor.

## Risk summary

| Item | Effort | Risk | Value | Recommendation |
|---|---:|---:|---:|---|
| C1 module split | Medium | Medium | Medium | Defer until next view feature |
| C2 schema strictness | Small/medium | Small | Medium | Incremental, starting with translationRecord |
| C3 rename | XS | XS | Small | Do in isolated cleanup if no real ingest is imminent |
