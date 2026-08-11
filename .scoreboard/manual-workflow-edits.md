# Manual Workflow / GitHub Administration Edits

> **Last audited:** 2026-08-11, session `arena/019ff089-translatechan`
> **2026-08-11 status:** all three owner-controlled edits remain applicable; no workflow file was changed in this session.

## Policy

Agents must not edit `.github/workflows/*` unless the user explicitly requests it. Record exact changes here so an owner with the necessary GitHub permissions can apply and verify them.

## Edit 1 — Cover every mirrored deploy asset in Quality

**File:** `.github/workflows/quality.yml`
**Reason:** `scripts/build_data_bundle.py` mirrors four files that the current `git diff --exit-code` list omits:

- `docs/theme-init.js`
- `docs/robots.txt`
- `docs/sitemap.xml`
- `docs/og-image.svg`

Replace the existing generated-artifact command with:

```yaml
      - name: Require generated artifacts and deploy mirror to be committed
        run: |
          git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/theme-init.js docs/robots.txt docs/sitemap.xml docs/og-image.svg docs/data data/project_metrics.json
```

Then rerun Quality on an `arena/**` push and confirm the job **Validate data, generated artifacts, and reader** passes.

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

## Validation after either edit

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
diff -rq data docs/data
git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/theme-init.js docs/robots.txt docs/sitemap.xml docs/og-image.svg docs/data data/project_metrics.json
```

These checks do not clear the remaining P1 rights and functional blockers; re-evaluate `repo_ready` only after those are remediated and tested.
