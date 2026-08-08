# GitHub Web Editor Guide — Enable TranslateChan Quality CI

> **Purpose:** add the missing quality gate through GitHub’s web editor. This workflow **does not deploy GitHub Pages**: Pages continues to publish natively from `main` → `/docs`.
>
> **Use this guide on:** the branch `arena/019fe272-translatechan`, then open a PR to `main`. Do not edit `main` directly.

## 1. Create the workflow file in GitHub’s web editor

1. Open the repository on GitHub and select branch **`arena/019fe272-translatechan`** from the branch selector.
2. In the file list, choose **Add file → Create new file**.
3. Enter this exact filename:

   ```text
   .github/workflows/quality.yml
   ```

4. Paste this complete replacement content:

```yaml
name: Quality

on:
  push:
    branches:
      - main
      - "arena/**"
  pull_request:
    branches:
      - main

# This workflow reads the repository only. It does not deploy Pages, create
# releases, write commits, or use third-party credentials.
permissions:
  contents: read

jobs:
  validate-build-smoke:
    name: Validate data, generated artifacts, and reader
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Check Python syntax
        run: python3 -m py_compile scripts/*.py

      - name: Validate source data and committed metrics
        run: python3 scripts/validate_data.py

      - name: Rebuild generated Pages artifacts
        run: python3 scripts/build_data_bundle.py

      - name: Require generated artifacts and deploy mirror to be committed
        run: |
          git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json

      - name: Run dependency-free reader smoke test
        run: node scripts/smoke_test.mjs
```

5. In the commit form:
   - Title: `ci: add quality gate for data and reader`
   - Choose **Commit directly to the `arena/019fe272-translatechan` branch**.
6. Select **Commit new file**.

Expected result: GitHub opens the **Actions** run automatically. The first run should finish in under a few minutes because the project has no package-install step.

## 2. If GitHub refuses to create the file

A message about workflow permissions means the account/App editing the repository lacks GitHub Actions workflow write permission.

Ask a repository administrator to do one of the following:

1. **Create the file manually** using the exact content above; or
2. Grant the connected GitHub App/account permission to write workflow files, then retry step 1.

Do **not** substitute a Pages deployment workflow. Pages is intentionally already configured to serve `main` `/docs` without Actions deployment.

## 3. Confirm the workflow behaves correctly

After the first Action run opens:

1. Open **Actions → Quality → latest run**.
2. Confirm these five steps are green:
   - Check Python syntax
   - Validate source data and committed metrics
   - Rebuild generated Pages artifacts
   - Require generated artifacts and deploy mirror to be committed
   - Run dependency-free reader smoke test
3. Open the pull request from `arena/019fe272-translatechan` into `main`.
4. Confirm the PR’s **Checks** tab lists `Validate data, generated artifacts, and reader` as successful.

A failure in the generated-artifact step is intentional: run the documented local commands, commit the regenerated `app_data.js`, `docs/`, and metrics changes, then push again.

## 4. Optional but recommended: require the check before merge

This must be performed by a repository administrator.

1. Open **Settings → Branches** (or **Settings → Rules → Rulesets**, depending on the repository UI).
2. Create/edit the rule for `main`.
3. Enable **Require a pull request before merging**.
4. Enable **Require status checks to pass before merging**.
5. Search for and select:

   ```text
   Validate data, generated artifacts, and reader
   ```

6. Save the rule.

Do not require this check until its first successful run has appeared; GitHub cannot list a check name that has never run.

## 5. Current-facing documentation replacements

After the workflow has been committed and its first run is green, use GitHub’s **Edit file** action on the current branch and make these exact substitutions. Historical notes inside `AUDIT.md` should remain historical; do not rewrite them.

### `README.md`

Find this sentence:

```text
> **Note on deployment automation**: GitHub Pages is served directly from the `main` branch `/docs` folder (native branch publishing). Run the documented validation/build/smoke commands before each PR; the prepared CI workflow requires workflow-capable GitHub access before it can be published.
```

Replace it with:

```text
> **Note on deployment automation**: GitHub Pages is served directly from the `main` branch `/docs` folder (native branch publishing). The GitHub Actions **Quality** workflow verifies Python syntax, source data/metrics, deterministic generated artifacts, deploy synchronization, and the reader smoke test on pushes and pull requests; it does not deploy Pages.
```

### `HANDOFF.md`

In the “Editorial Data Tooling” list, replace:

```text
A CI workflow is prepared locally but needs workflow-capable GitHub access before publication.
```

with:

```text
The checked-in GitHub Actions Quality workflow runs the same validation, deterministic-build, generated-artifact, and reader-smoke gate on pushes and pull requests; native GitHub Pages publishing remains separate.
```

Delete the entire historical-looking section headed:

```text
### GitHub/CI exception
```

including its paragraph about `arena/019fe1f6-translatechan`, because it becomes false and points to an old session branch.

In the release-checklist paragraph, replace:

```text
These commands are the authoritative local gate until the prepared CI workflow can be published.
```

with:

```text
Run these commands locally before opening a PR; the same checks are enforced by the GitHub Actions Quality workflow.
```

### `ROADMAP.md`

Replace:

```text
... and deterministic metrics; a CI workflow is prepared locally and awaits workflow-capable GitHub access before publication.
```

with:

```text
... and deterministic metrics; `.github/workflows/quality.yml` runs Python compilation, data validation, deterministic artifact checks, and reader smoke coverage on pushes and pull requests.
```

Replace:

```text
> Deployment is native GitHub Pages branch publishing (`main` + `/docs`). The prepared GitHub Actions quality workflow does not deploy Pages and awaits workflow-capable GitHub access before publication.
```

with:

```text
> Deployment is native GitHub Pages branch publishing (`main` + `/docs`). The GitHub Actions Quality workflow verifies repository quality only; it does not deploy Pages.
```

### `response_summary.md`

This is a session response file, not evergreen project documentation. If it is retained, update its A1 finding from “no workflow exists” to a dated historical note after the workflow’s first green run; otherwise delete it after review.

## 6. Future extension: browser tests

Do not add Playwright to this first drop-in workflow. The current smoke suite is dependency-free and reliable. Add a separate browser job only after a minimal Playwright/WebDriver test exists, so failures are actionable rather than infrastructure noise.

**Completion summary:** This guide gives you the exact web-editor workflow file, verification steps, branch-protection setup, and documentation replacements needed to turn TranslateChan’s local quality gate into GitHub-enforced CI.
