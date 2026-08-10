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

## Scoreboard Protocol

This repo uses a persistent scoreboard because Arena/sandboxed agent
sessions may expire after PR merge. Durable context must live in repo
files.

### Before work

1. Read [`SCOREBOARD.md`](./SCOREBOARD.md).
2. Read [`.scoreboard/scoreboard.yml`](./.scoreboard/scoreboard.yml).
3. Read [`.scoreboard/agent-handoff.md`](./.scoreboard/agent-handoff.md).
4. Read [`.scoreboard/manual-workflow-edits.md`](./.scoreboard/manual-workflow-edits.md).
5. Identify affected scoreboard aspects.
6. Prioritize high-priority, low-effective-score, high-weight,
   risk-flagged, or user-unhappy aspects.

### During work

1. Preserve `user_score` fields. Do not invent, infer, or change
   `user_score` without explicit user instruction.
2. PR approval, merge, or user silence does **not** imply a new
   `user_score`.
3. Do not chase perfect AI scores if the user has accepted the area
   (status `accepted_debt` or `risk_accepted`).
4. If AI score is high but user score is low, follow user notes and
   desired direction.
5. If AI score is low but user score is high, treat as accepted debt
   unless risk flags exist or the task touches that area.
6. Do not directly edit `.github/workflows/*` unless the user explicitly
   instructs you. If a workflow change is needed, document the exact
   manual edit in `.scoreboard/manual-workflow-edits.md` and set the
   affected aspect status to `blocked_manual_workflow_edit`.
7. If a workflow change is needed, also add it as a `next_action` on
   the affected aspect in `.scoreboard/scoreboard.yml`.

### After work

1. Run the relevant checks where possible:
   ```bash
   python3 -m py_compile scripts/*.py
   python3 scripts/validate_data.py
   python3 scripts/build_data_bundle.py
   node scripts/smoke_test.mjs
   diff -rq data docs/data
   ```
2. Update only audited AI scores in `.scoreboard/scoreboard.yml` with
   evidence.
3. Recalculate `effective_score`, `gap`, `priority`, and `status` for
   every affected aspect.
4. Recalculate `summary.overall_effective_score` (rounded to one
   decimal) and `summary.repo_ready_gate_status`. Update
   `quality_gates.repo_ready` with the same values.
5. Update `summary.top_priorities` and `summary.active_risk_flags`.
6. Add a row to `.scoreboard/history.md` for every aspect whose AI
   score changed.
7. Update `.scoreboard/agent-handoff.md` for the next sandboxed
   agent.
8. Summarize remaining manual workflow edits in your final response.
9. Commit + push to the session branch.

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
authoritative runtime check is `scripts/validate_data.py` (1152 lines).
The validator is the spec, not the schema alone — it enforces:

- Status enum: `verified_quotation` / `reconstruction_unverified` / `ai_draft`
- `source.source_id` pattern and resolution to `data/translations/rights_manifest.json`
- Controlled `school_key` ↔ display + 6-digit hex color (lineage)
- Controlled `theme_group` ↔ display (gong'an)
- Per-file `zh_chars` ↔ computed content CJK count
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
