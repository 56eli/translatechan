# Repository Operations

This file is the register of owner-controlled GitHub-side changes and
repository administration that agents may not perform themselves, such as
`.github/workflows/*` edits and branch-protection settings. It replaced
`.scoreboard/manual-workflow-edits.md` when the repository scoreboard was
retired on 2026-09-11; the three pending edits below were relocated here
with their content preserved.

## Policy

Agents must not edit `.github/workflows/*` unless the owner explicitly
requests it. Record exact changes in this file so an owner with the
necessary GitHub permissions can apply and verify them.

## Edit 1 — Cover every mirrored deploy asset in Quality — CLOSED STRUCTURALLY BY O-3 (2026-09-13)

**File:** `.github/workflows/quality.yml`
**Reason (historical):** `scripts/build_data_bundle.py` mirrors four files that the previous `git diff --exit-code` list omitted:

- `docs/theme-init.js`
- `docs/robots.txt`
- `docs/sitemap.xml`
- `docs/og-image.svg`

**Resolution — O-3 structural mirror-tree diff (PR #45, adopted 2026-09-13):** the Quality workflow now runs the structural check

```yaml
      - name: Require generated artifacts and deploy mirror to be committed
        run: |
          git diff --exit-code -- app_data.js docs data/project_metrics.json
```

This single structural diff covers root bundle, the entire `docs/` mirror tree, and generated metrics, so new mirrored assets (theme-init.js, robots.txt, sitemap.xml, og-image.svg) are guarded without enumerating each path. It satisfies Edit 1's intent without an explicit per-file list.

- **Status:** closed structurally by O-3 — `git diff --exit-code -- app_data.js docs data/project_metrics.json` is now the gate in `.github/workflows/quality.yml` (see `quality.yml:35`).
- **Verification:** `python3 scripts/build_data_bundle.py && git diff --exit-code -- app_data.js docs data/project_metrics.json` — PASS on main 3a6ae32 and on Phase B branches; re-confirmed 2026-09-14 (task 008) on main `766b97c` (PR #51), including the new `og-image.png` mirror path added to `scripts/build_data_bundle.py`'s copy list — the same structural diff covers it without an enumerated-list edit.
- **Remaining:** Edit 1 no longer requires owner action; the enumerated-list form in the original proposal is superseded by the structural form. Edits 2 and 3 below remain owner-held per `AGENTS.md` §6 (agents must not edit `.github/workflows/*` without explicit owner approval) — no agent edit to either has been attempted.

> This only closes mirror-path coverage. The full audit also recommends future owner-approved CI jobs for a non-skippable browser suite, HTML/JS/link checks, and accessibility checks after the underlying tests are corrected.

## Edit 2 — Update GitHub Action majors off deprecated Node 20 runtimes

The final audit-branch Quality run succeeded but GitHub annotated that these action versions target deprecated Node 20 and are only running because the runner forces Node 24:

```yaml
uses: actions/checkout@v4
uses: actions/setup-python@v5
uses: actions/setup-node@v4
```

GitHub API reported the current releases on 2026-08-10 as checkout `v7.0.1`, setup-python `v7.0.0`, and setup-node `v7.0.0`. After reviewing each major's migration notes, replace the workflow references with:

```yaml
uses: actions/checkout@v7
uses: actions/setup-python@v7
uses: actions/setup-node@v7
```

Rerun Quality and confirm checkout, Python 3.12, Node 22, validation, build, artifact diff, and smoke steps all pass without the runtime-deprecation annotation.

## Edit 3 — Verify and require Quality on `main`

**Location:** GitHub repository Settings → Branches or Rules → `main`.

The audit integration received HTTP 403 when reading classic branch protection, while the rulesets endpoint returned no visible rules. Therefore, do not repeat the old documentation’s unqualified claim that protection is definitely disabled; have an administrator verify it directly.

If Quality is not required:

1. Require a pull request before merging.
2. Require status checks to pass.
3. Select **Validate data, generated artifacts, and reader**.
4. Prefer at least one approving review and disallow bypass unless there is a documented emergency process.
5. Open a small test PR and confirm merge is blocked until Quality succeeds.

No Pages deployment workflow is needed: GitHub Pages currently publishes natively from `main /docs`, and the Pages API reports `built` with HTTPS enforced.

## Edit 4 — Retired 2026-09-19 — Pages scope out of scope

**File:** `.orchestrator/RULING_WEBSITE_2026-09-14.md`

**Reason:** 2026-09-19 owner directive: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for. Previous website ruling law (NOT beautiful NOT done etc.) stripped and replaced.

**Status:** Ruling file now contains only out-of-scope notice. `scripts/test_website_ruling.py` deleted. `quality.yml` no longer enforces website law.

## Edit 5 — Retired 2026-09-19 — Bundle ceiling and gates experiment reverted

**Files:** `.orchestrator/RULING_BUNDLE_CEILING_2026-09-14.md`, `.orchestrator/RULING_GATES_EXPERIMENT_2026-09-14.md`, `.github/workflows/quality.yml`

**Reason:** 2026-09-19 owner directive: revert bundle ceiling (30MB testing) and gates experiment (presentation allowed to break). Remove mention of both.

**Status:** Both ruling files deleted. `quality.yml` retired to text-integrity only: py_compile, validate_data, build_data_bundle, test_source_preservation, test_source_review_rules, mirror diff, smoke_test — no per-variant gate, no website ruling gate, no continue-on-error presentation mentions.

## Edit 6 — Retired 2026-09-19 — Per-variant acceptance gate retired, work letter distinct rebuild removed

**Files:** `.orchestrator/DESIGN_GRID_2026-09-18_36_DISTINCT.md`, `.orchestrator/CANARY_V3_PASS_2026-09-18.md`, `.orchestrator/prompts/035-041*`, `.orchestrator/stubs/035-041*`, `scripts/check_layout_variant.py`, `.github/workflows/quality.yml`

**Reason:** 2026-09-19 owner merged PR #91 one hall one margin, 36 demo layouts deleted (app.css 14,992→3,619 lines, app.js 8,746→~4,980 lines, net -39,194). Work order 2026-09-18-letter-002 36-distinct rebuild removed. Per-variant gate retired.

**Status:** DESIGN_GRID, CANARY, prompts 035-041, stubs 035-041, GITHUB_PAGES_OUTSOURCE_SPEC, PAGE_RULES_REVOCATION, EXTERNAL_GITHUB_PAGES_INSTRUCTIONS, check_layout_variant.py deleted. quality.yml retired to text-integrity only.

## Validation after either edit

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
diff -rq data docs/data
# plus the generated-artifact check from the "Require generated artifacts and deploy mirror to be committed" step in .github/workflows/quality.yml (single source of truth)
```

These checks do not clear the remaining rights and functional blockers;
release is still gated by the blockers enumerated in `HANDOFF.md` §5.

## Provenance

Relocated from `.scoreboard/manual-workflow-edits.md` on 2026-09-11.
Last audited: 2026-08-11, session `arena/019ff089-translatechan` (all
three edits remain applicable; no workflow file was changed in that
session). The `blocked_manual_workflow_edit` status vocabulary the old
file used is retired with the scoreboard; there is no replacement status.
