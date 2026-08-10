# Manual Workflow Edits

GitHub Actions workflow edits may need to be performed manually in the GitHub web editor.

## Policy

Agents must not edit `.github/workflows/*` unless explicitly instructed by the user. The session token's GitHub App does not have the `workflows` scope (confirmed 2026-08-08 and 2026-08-09 in HANDOFF.md), and even if it did, the policy is to ask before touching CI configuration.

If a workflow change is needed, this file should hold the **exact** manual edit (file path, reason, paste-this content, validation steps).

## Needed Manual Edits

### Edit 1 — Extend CI generated-artifact path list

**File:** `.github/workflows/quality.yml`

**Reason:** The Quality workflow's `git diff --exit-code` gate currently checks `app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json`. It is missing three files that the build script (`scripts/build_data_bundle.py`) also mirrors into `/docs`:

- `docs/theme-init.js` (FOUC guard, smoke-guarded)
- `docs/robots.txt` (crawler policy, smoke-guarded)
- `docs/sitemap.xml` (sitemap, smoke-guarded)

The local smoke test already enforces all three, so the practical risk today is low, but a future refactor that rotates those files would not fail the CI gate.

**Paste this replacement for the existing step** (replace the line starting `run: | git diff --exit-code -- ...`):

```yaml
      - name: Require generated artifacts and deploy mirror to be committed
        run: |
          git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/theme-init.js docs/robots.txt docs/sitemap.xml docs/data data/project_metrics.json
```

**After editing:**

- Commit through GitHub web editor (or local checkout + push if you have workflows scope).
- Re-run the Quality workflow on the next push to confirm it still passes.
- Ask an agent to re-audit the `ci_cd` aspect; expect the `blocked_manual_workflow_edit` status to drop back to `healthy` (or `warning` if `deployment_readiness` still requires Edit 2).

### Edit 2 — Require the Quality check on main (branch protection)

**File:** `Settings → Branches → main → Branch protection rules` (GitHub web UI, not a workflow file)

**Reason:** The Quality workflow is the merge gate, but branch protection on `main` does not currently require it. A PR could be merged without the gate passing. This is a one-time admin step that no agent token can perform.

**Steps:**

1. Confirm the workflow has run at least once — any push/PR run appears under *Actions → Quality* (job name: **Validate data, generated artifacts, and reader**).
2. Open **Settings → Branches → Add branch protection rule** (or edit the existing rule) for branch `main`:
   - ☑ **Require status checks to pass before merging**
   - In the search box pick **Validate data, generated artifacts, and reader** (the job name above), then confirm it is listed.
   - Recommended extras: ☑ **Require a pull request before merging** (with at least 1 approving review), and leave **Do not allow bypassing the above settings** checked.
3. Save. Do **not** add any Pages/deploy workflow — native branch publishing from `main` → `/docs` republishes automatically on merge.

**After editing:**

- Open a test PR to confirm the required-check gate blocks merges without the green Quality run.
- Ask an agent to re-audit the `deployment_readiness` and `ci_cd` aspects; both should drop `blocked_manual_workflow_edit` (and the `repo_ready` quality gate should move from `warning` → `pass`).

### Edit 3 (optional) — Add og:image / twitter:image meta tags

Not a workflow edit, but listed here for completeness: if you want richer link previews, generate `docs/og-image.svg` (1200×630) and add to `index.html` `<head>`:

```html
<meta property="og:image" content="https://56eli.github.io/translatechan/og-image.svg">
<meta name="twitter:image" content="https://56eli.github.io/translatechan/og-image.svg">
```

This is a content edit, not a workflow edit, and is therefore in the agent's normal authority. Listed here only because audit 2026-08-10 flagged it as a P3 polish item.

## Validation Steps After Any Edit

- The local release checklist (`python3 scripts/validate_data.py && python3 scripts/build_data_bundle.py && node scripts/smoke_test.mjs && diff -rq data docs/data`) should still pass.
- The Quality workflow on the next push to `arena/**` or `main` should still succeed.
- If you changed `quality.yml`, re-check that the new file path is mirrored in `docs/` after `python3 scripts/build_data_bundle.py`.
