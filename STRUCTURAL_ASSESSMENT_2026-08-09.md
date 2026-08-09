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

## C2 — JSON Schema strictness

**Current state:** The schema is permissive (`additionalProperties: true`) because
`validate_data.py` carries most cross-file semantic checks. That is reasonable,
but typos in optional fields can currently pass unnoticed.

**Recommended incremental path:**

1. After the A4 migration has settled, tighten `translationRecord` and
   `corpusDocument` to forbid unknown properties.
2. Add explicit schemas for corpus shape fields (`cases`, `sections`,
   `dialogues`, `stanzas`, `chapters`, `five_ranks`, `sample_records`).
3. Do **not** tighten everything at once; corpus shapes are intentionally
   heterogeneous and the Python validator handles them better than JSON Schema.
4. Add a CI/schema-validation step only if the repository adopts a
   dependency-free validator or a pinned Python package; avoid adding a Node
   package just for schema validation.

Best immediate target: the `translationRecord` object now has a stable shape and
no legacy string union, so it is the safest first `additionalProperties: false`
candidate after checking real records for optional metadata.

## C3 — `ingest_cbeta.py` naming

**Current state:** The filename overpromises. It is a local Classical Chinese
segmentation helper, not a CBETA ingestion pipeline. The docstring already says
this, but the name remains misleading.

**Recommendation:** Rename in a small, isolated PR:

- New name: `scripts/segment_classical.py`
- Keep a tiny compatibility wrapper `scripts/ingest_cbeta.py` that prints a
  deprecation notice and imports/calls the new implementation, or simply update
  references if none exist outside docs.
- Update README/HANDOFF references if any.

Alternatively, if Phase 2 will build real CBETA TEI ingestion soon, keep the
name but expand it into the actual pipeline rather than renaming twice.

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
