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

## Edit 4 — Enforce website ruling law + source gates in CI (2026-09-14, owner definitive ruling)

**File:** `.github/workflows/quality.yml`
**Reason:** Owner ruling 2026-09-14 definitive: "In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask 'does this look good?', 'Is this the right direction?', 'how good is it on a scale from 1-10 where we aim for at least 8?'. This is definitive."

Adding documentation where nobody reads is not enough. Owner requires gates that FAIL if subjective standards are not met.

**Changes (applied 2026-09-14, main 2b3e2b5+):**

```yaml
      - name: Enforce source-preservation allowlist (no unauthorized Chinese edits)
        run: python3 scripts/test_source_preservation.py

      - name: Enforce W1 source-review rule suite (138 checks)
        run: python3 scripts/test_source_review_rules.py

      - name: Enforce website ruling law — NOT beautiful, NOT done, owner feedback 1-10 aim 8+
        run: python3 scripts/test_website_ruling.py
```

**Gate `test_website_ruling.py` enforces:**

1. Ruling file `.orchestrator/RULING_WEBSITE_2026-09-14.md` exists and contains verbatim law phrases
2. Canonical tracker `.orchestrator/STATE.md` contains "Website is NOT beautiful, NOT done" + "NOT CAPABLE TO JUDGE" + 1-10 scale
3. Working state `.orchestrator/local/ORCHESTRATOR_STATE.md` contains same law
4. No repo prose (README/AUDIT/HANDOFF/ROADMAP/vision.md/WEB_VISION) claims "website is beautiful/done" without NOT qualification
5. Future website prompts seq >=24 that are website/human-readable Phase5 must contain:
   - "does this look good?"
   - "1-10" scale question
   - "NOT beautiful, NOT done" reference
   - "NOT CAPABLE TO JUDGE"
   Failure = CI fails, subjective standard not met

**Status:** Applied per owner explicit request to introduce failing gates (scope boundary allows workflow edit with explicit owner approval). Verified locally: `python3 scripts/test_website_ruling.py` PASS on main 2b3e2b5+ with law files present. CI will now fail any PR that self-declares website beautiful/done or omits owner feedback questions.

## Edit 5 — Turn off presentation gates while experimenting, keep text integrity gates (2026-09-14, owner)

**File:** `.github/workflows/quality.yml`
**Reason:** Owner feedback on PR #75: all layouts max 3/10, only Read tab changes partially, Compare/Lineage/Cases/Terms don't, same amount of tabs isn't necessarily intended nor forbidden, Accordion Reader some improvements, bundle ceiling 2MB isn't helping. Owner says: "We can turn off gates that don't touch text integrity as website should just be presentation, and we're allowed to break presentation while experimenting."

**Changes (applied 2026-09-14, main d9fd30a+):**

Text integrity gates — MUST stay ON, required, failing:
- `python3 -m py_compile scripts/*.py`
- `python3 scripts/validate_data.py` — corpus 35, W1 flagged 630
- `python3 scripts/build_data_bundle.py` — deterministic bundle
- `python3 scripts/test_source_preservation.py` — 0 unauthorized Chinese edits
- `python3 scripts/test_source_review_rules.py` — 138 W1 checks

Presentation gates — CAN be turned OFF while experimenting, allowed to break presentation, continue-on-error: true:
- `git diff --exit-code -- app_data.js docs data/project_metrics.json` + `diff -rq data docs/data` — docs mirror byte-identical — presentation, allowed to break
- `node scripts/smoke_test.mjs` — 35 texts render-lazy, 0 style=, CSP — presentation, allowed to break
- Bundle ceiling extended from 2MB to 30MB for testing phase per RULING_BUNDLE_CEILING_2026-09-14.md — technically feasible, Quality workflow doesn't enforce size directly

Website ruling law gate — kept ON even while experimenting because it enforces LAW (NOT beautiful NOT done, NOT capable to judge, 1-10 aim 8+, light mental load etc.), not presentation quality.

```yaml
      - name: Require generated artifacts and deploy mirror to be committed (presentation — allowed to break while experimenting per owner ruling 2026-09-14)
        continue-on-error: true
        run: |
          git diff --exit-code -- app_data.js docs data/project_metrics.json || echo "⚠️ Presentation mirror diff failed — allowed while experimenting"

      - name: Run dependency-free reader smoke test (presentation — allowed to break while experimenting per owner ruling 2026-09-14)
        continue-on-error: true
        run: |
          node scripts/smoke_test.mjs || echo "⚠️ Smoke test failed — allowed while experimenting"

      - name: Enforce website ruling law — NOT beautiful, NOT done, owner feedback 1-10 aim 8+ (law — kept ON even while experimenting)
        run: python3 scripts/test_website_ruling.py
```

**Status:** Applied per owner explicit request to turn off presentation gates while experimenting (scope boundary allows workflow edit with explicit owner approval). Text integrity gates remain required. Presentation breakage allowed to enable drastic layout changes across ALL rooms (Reader, Compare, Lineage, Cases, Terms), different tab counts allowed, ideal colors of 1 kept, 30MB ceiling.

## Edit 6 — Retire the per-variant acceptance gate now that the demo layouts are gone (2026-09-19)

**File:** `.github/workflows/quality.yml`
**Reason:** the step *"Per-variant acceptance gate for rebuilt layouts"* derives its variant list
from the diff (`git diff … -- app.css | grep -o 'rebuild:[0-9][0-9]* begin'`) and then runs
`scripts/check_layout_variant.py N` for each N. The 2026-09-19 Pages rebuild deleted every
`rebuild:NN` block (3–36) from `app.css` and `app.js`, so the only occurrences of that token in
the diff are the *deleted* lines: the gate now resolves variants 3–36, looks for blocks that no
longer exist, and fails with `variant N: no marked rebuild block 'rebuild:N begin' in app.css`.
The gate polices a scaffold that this PR removes, so it cannot pass by construction.

**Suggested patch** (owner-side; agents may not edit workflow files):

```yaml
      - name: Per-variant acceptance gate for rebuilt layouts
        run: |
          if git grep -q 'rebuild:[0-9][0-9]* begin' -- app.css app.js; then
            git fetch --depth=1 origin main 2>/dev/null || true
            variants="$(git diff --unified=0 FETCH_HEAD -- app.css 2>/dev/null | grep -o 'rebuild:[0-9][0-9]* begin' | grep -o '[0-9][0-9]*' | sort -un || true)"
            status=0
            for v in $variants; do
              echo "Acceptance — variant $v"
              python3 scripts/check_layout_variant.py "$v" || status=1
            done
            exit $status
          fi
          echo "No rebuild:NN variant scaffold in the tree — per-variant acceptance gate retired."
```

**Also pending (same reason, cosmetic):** `scripts/check_layout_variant.py` and its `__pycache__`
entry are dead weight once no `rebuild:NN` block exists; deleting the script is an owner call.
Nothing else in `scripts/` references the variant scaffold (verified 2026-09-19: the only repo
files still naming `rebuild:`/`data-design` are `check_layout_variant.py` itself and this record).

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
