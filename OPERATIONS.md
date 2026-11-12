# Repository Operations

Register of owner-controlled GitHub-side changes and repository administration.
Agents may not edit `.github/workflows/*` or GitHub settings unless the owner
explicitly requests it. Record exact authorized changes here.

## Policy

- Workflow edits require explicit owner authorization.
- Branch protection, required checks, Pages settings, and repository metadata are
  owner-side GitHub administration.
- The current quality gate is defined by `.github/workflows/quality.yml` and
  `GATE.md`.

## Edit 7 — Owner-authorized layout demolition Quality update — CLOSED 2026-11-12

**File:** `.github/workflows/quality.yml`

**Authorization:** owner request to "exhaustively destroy the old layout protected
by the build process, documentation, and tests." The old workflow steps referenced
deleted frontend assets and presentation gates, so leaving them unchanged would
keep CI permanently red and resurrect the retired contract.

**Change:**

- job renamed to `validate-build-pages` / "Validate data, source integrity, and
  Pages mirror";
- removed Node.js setup and `node scripts/smoke_test.mjs`;
- replaced `scripts/build_data_bundle.py` with `scripts/build_pages.py`;
- added `python3 scripts/test_pages_contract.py`;
- artifact diff now covers `docs/index.html`, `docs/data`, crawler files,
  `docs/.nojekyll`, and `data/project_metrics.json`;
- retained Python syntax, data validation, source preservation, and W1 source
  review gates.

**Status:** closed on the demolition session branch. No GitHub-side setting was
changed by this edit.

## Edit 3 — Verify and require Quality on `main` — OPEN

**Location:** GitHub repository Settings → Branches or Rules → `main`.

If Quality is not required:

1. Require a pull request before merging.
2. Require status checks to pass.
3. Select **Validate data, source integrity, and Pages mirror**.
4. Prefer at least one approving review and disallow bypass unless there is a
   documented emergency process.
5. Open a small test PR and confirm merge is blocked until Quality succeeds.

No Pages deployment workflow is needed: GitHub Pages publishes natively from
`main /docs`.

## Edit 2 — GitHub Action majors — OPEN / OWNER-REVIEW

The workflow currently uses `actions/checkout@v4` and `actions/setup-python@v5`.
Any major-version upgrade should be owner-reviewed against current GitHub Action
release notes and CI runtime deprecation annotations. The demolition did not
upgrade action majors.

## Historical edits superseded by demolition

- Edit 1 (mirror asset enumeration) is superseded: there is no runtime bundle or
  retired frontend asset list. The Pages contract now checks the owner-stub mirror
  and data tree.
- Edits 4–6 (Pages scope/out-of-scope notices, bundle ceiling, per-variant gates)
  are historical. The 2026-11-12 owner demolition request explicitly authorized
  this layout/build/test reset.

## Validation after workflow changes

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_pages.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
python3 scripts/test_pages_contract.py
diff -rq data docs/data
git diff --check
```

These checks do not clear rights, source-remediation, or stub-port blockers; see
`HANDOFF.md` and `docs/PROJECT_STATE.md`.
