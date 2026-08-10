# Release-Blocker Fixes — Session `019fecb1`

> **Date:** 2026-08-10 UTC
> **Branch:** `arena/019fecb1-translatechan`
> **Requested direction:** fix release blockers after the full audit
> **Scope:** Lineage directory visibility/responsive semantics and fatal data-bundle recovery

## 1. Lineage display-mode repair

The audit found that `#lineage-content-target` shipped with `hidden`, while the “Master Directory” handler only assigned `style.display = 'grid'`. Inline display cannot reliably override semantic hidden state.

Implemented:

- one `setLineageMode(mode)` state path for graph and directory;
- semantic `hidden` synchronization on both targets;
- synchronized `.active` and `aria-pressed` state;
- explicit `type="button"`, `aria-controls`, and a labeled mode group;
- initialization through the same state function;
- phone CSS reset for `.master-dir-quote` (`grid-column:auto`) to prevent an implicit second column after the directory becomes visible.

Regression coverage:

- dependency-free smoke test activates both modes and asserts target `hidden` plus button state in both directions;
- Playwright covers computed visibility, hidden-attribute removal, pressed state, graph restoration, mobile directory visibility, and mobile horizontal overflow.

## 2. Fatal bundle/init recovery

The audit found styled `.error-boundary-*` classes but no runtime implementation. Missing `app_data.js` left the Reader loading and secondary rooms blank.

Implemented:

- `hasUsableAppData()` validates required bundle records, arrays, manifest items, and corpus resolution before app setup;
- top-level initialization is guarded with `try/catch`;
- missing/malformed data or a render-time initialization error replaces the main surface with a focusable `role="alert"` recovery panel;
- the panel explains the problem without exposing internals, confirms saved display preferences are safe, and offers a wired reload action;
- body view state becomes `error`, suppressing Reader-only mobile controls;
- a concise console diagnostic preserves developer observability.

Regression coverage:

- the dependency-free smoke test executes production `app.js` in an isolated VM with no data global and verifies rendered markup, focus, error view state, and reload wiring;
- Playwright aborts `app_data.js` and verifies the computed recovery surface, alert role, focus, reload action, and replacement of the broken Reader surface.

## 3. Quality result

```text
JavaScript syntax                            PASS
Focused ESLint correctness/unused rules      PASS (0 errors; 0 warnings)
Dependency-free smoke                        PASS (35 corpus fixtures; 0 crashes)
Isolated missing-bundle recovery             PASS
Lineage semantic mode regression             PASS
Playwright test source syntax                 PASS
Real Playwright execution                     unavailable (Chromium not installed)
```

The normal validator/build/mirror suite is run after documentation and generated `/docs` synchronization.

## 4. Score impact

Evidence-based AI-score changes after implementation:

- code hygiene: 6 → 7;
- error handling/logging: 5 → 7;
- tests: 6 → 7;
- GitHub Pages presentation: 6 → 7;
- UX/usability: 6 → 7;
- accessibility: 6 → 7;
- feature completeness: 6 → 7.

Weighted score: `582 / 83 = 7.012...`, rounded to **7.0/10**. `repo_ready` remains **fail** because overall is below 8 and required security/privacy (7) and CI/CD (6) remain below threshold; non-case validation, rights/references, mandatory browser/a11y evidence, and operations work also remain.

## One-sentence summary

Repaired the hidden Lineage directory with semantic/ARIA/mobile regressions and implemented a focusable, reloadable fatal data-bundle boundary covered by dependency-free and Playwright test paths.
