# AGENTS.md

This file documents the contract between the project owners and any
sandboxed/Arena agent that works on this repository.

## Project identity

- **Public brand:** "Fake Chan Factory" (假禪工廠).
- **Repository identifier:** `56eli/translatechan` (kept for continuity).
- **Internal API namespace:** `window.TranslateChan`.
- **Persisted localStorage keys:** `translatechan_*`.
- **Data global:** `TRANSLATECHAN_DATA`.

If you change user-facing text, keep the "translatechan" identifier intact
in code, keys, and the data global. Only the user-facing brand was
rebranded.

## Working environment

- **Working branch:** `arena/<session>-translatechan`. Do not switch to
  or push to any other branch. The session is fixed to one branch.
- **No build step at runtime.** The deployed artifact is `index.html` +
  `app.css` + `app.js` + `app_data.js` + `theme-init.js` served as
  static files from `/docs` on GitHub Pages.
- **No runtime dependencies.** `package.json` only lists `playwright` as
  an optional devDependency for the browser test suite.
- **Strict Content-Security-Policy** is enforced: `script-src 'self'`.
  No inline `<script>` blocks, no `onclick=` / `onmouseover=` /
  `eval()` / `new Function()`. All interactivity is delegated via
  `data-*` attributes that the document-level click handler in `app.js`
  routes.

## Project state and priority setting

Arena/sandboxed agent sessions may expire after a PR merge, so durable
context lives in repo files: `AGENTS.md`, [`HANDOFF.md`](./HANDOFF.md),
[`AUDIT.md`](./AUDIT.md), [`ROADMAP.md`](./ROADMAP.md),
[`.orchestrator/STATE.md`](./.orchestrator/STATE.md), and append-only
[`sessions/`](./sessions/). Priority is set by the task prompt you were
dispatched with. The repository scoreboard was retired on 2026-09-11, so
`user_score`-style AI scoring is retired too: no file in this repo
carries a score to update. Do not directly edit `.github/workflows/*`
unless the user explicitly instructs you. If a workflow change is
needed, document the exact manual edit in
[`OPERATIONS.md`](./OPERATIONS.md); there is no status file to flip any
more.

## After work

1. Run the relevant checks where possible:
   ```bash
   python3 -m py_compile scripts/*.py
   python3 scripts/validate_data.py
   python3 scripts/build_data_bundle.py
   node scripts/smoke_test.mjs
   diff -rq data docs/data
   ```
2. Summarize remaining manual workflow edits from
   [`OPERATIONS.md`](./OPERATIONS.md) in your final response.
3. Commit + push to the session branch.

## Public Pages scope

The published interface is deliberately narrow:

- ✅ Bilingual Reader
- ✅ Comparative Matrix
- ✅ Lineage Tree
- ✅ Gong'an Index
- ✅ Chan Lexicon

NOT in the public Pages UI (intentional, smoke-guarded):

- ❌ Translation Studio
- ❌ Arena AI Agents
- ❌ Header GitHub link

The smoke test guards this scope — do not add them.

## Data contract

The schema lives in `schemas/translatechan-data.schema.json`; the
authoritative runtime check is `scripts/validate_data.py` (line count changes as rules evolve).
The validator is the spec, not the schema alone — it enforces:

- Status enum: `verified_quotation` / `reconstruction_unverified` / `ai_draft`
- `source.source_id` pattern and resolution to `data/translations/rights_manifest.json`
- Controlled `school_key` ↔ display + 6-digit hex color (lineage)
- Controlled `theme_group` ↔ display (gong'an)
- Per-file `zh_chars` ↔ computed content CJK count
- Explicit editorial `completion_status`; N/N unit representation alone never means complete
- Anti-placeholder rejection for repeated case-specific Chinese source fields
- Manifest / corpus / locators / queue agreement
- `data/project_metrics.json` ↔ live data
- Doc truthfulness (25+ rules across `README.md`, `HANDOFF.md`, `AUDIT.md`, `ROADMAP.md`, `index.html`)

When in doubt, prefer adding a rule to the validator over patching data
on the side.

## Quality-gate checklist before any push

```bash
python3 -m py_compile scripts/*.py     # syntax
python3 scripts/validate_data.py       # data + metrics + doc truthfulness
python3 scripts/build_data_bundle.py   # deterministic bundle; root + /docs synced
node scripts/smoke_test.mjs            # dependency-free renderer regression
diff -rq data docs/data                # byte-identical data mirror
```

All five must pass. CI on GitHub Actions runs the same set.

## Honest disclosure (the project's moral core)

- Every translation record carries a structural `status`
  (`verified_quotation` / `reconstruction_unverified` / `ai_draft`).
- A verified quotation must link to a `source_id` in the rights
  manifest. The manifest is the editorial control record, not a
  license grant.
- The brand is "Fake Chan Factory" precisely because most translations
  are AI reconstructions in a translator's register, **not** the
  translator's actual words. Real verified quotations keep the real
  name; everything else is a "Robolation". This is the joke and the
  honesty at once.
- The tone is humor-forward and self-aware. Continue it; do not strip
  the joke.
