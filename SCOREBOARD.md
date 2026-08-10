# TranslateChan / Fake Chan Factory — Repo Scoreboard

> **Last updated:** 2026-08-10, session `arena/019fecb1-translatechan`
> **Evidence:** [current full audit](./sessions/AUDIT_RESPONSE_2026-08-10_019fecb1.md) · [release-blocker fixes](./sessions/RELEASE_BLOCKERS_2026-08-10_019fecb1.md) · [YAML](./.scoreboard/scoreboard.yml) · [history](./.scoreboard/history.md) · [handoff](./.scoreboard/agent-handoff.md)

## Current result

**Overall effective score: 7.0/10. `repo_ready = fail`.**

The full audit reconciled stale documentation and unsupported arithmetic, then the user-selected follow-up repaired the Lineage directory semantic/mobile defect and implemented fatal bundle/init recovery with dependency-free and Playwright regression paths. Release remains blocked by non-case validation, rights/references, mandatory browser/accessibility evidence, security/privacy hardening, and operations gates.

No explicit user score has been supplied. Every `user_score` remains `null`.

## Highest priorities

| Priority | Aspect | Score | Gap × weight | Why |
|---:|---|---:|---:|---|
| 1 | Maintainability | 6 | 8 | Large coupled files and heterogeneous render paths |
| 2 | Deployment readiness | 6 | 8 | Rights, validation, browser/a11y, security, and operations gates |
| 3 | Type safety / validation | 6 | 6 | Inert schema and malformed non-case fixtures pass |
| 4 | Content quality | 6 | 6 | Rights/reference and field-level source review remain |
| 5 | Security / privacy | 7 | 5 | CSP order/unsafe-inline/fonts/security policy |
| 6 | GitHub Pages presentation | 7 | 5 | Real-browser screenshots and owner approval remain |
| 7 | Tests / CI | 7 / 6 | 0 / 4 | Better regressions; browser remains success-skippable and non-CI |

## Score table

| Aspect | Weight | Target | AI | User | Effective | Status |
|---|---:|---:|---:|---:|---:|---|
| Project purpose / scope | 4 | 8 | 9 | — | 9 | healthy |
| README / onboarding | 4 | 7 | 7 | — | 7 | healthy |
| Repo organization | 3 | 8 | 7 | — | 7 | needs_work |
| Code hygiene | 4 | 8 | 7 | — | 7 | needs_work |
| Architecture | 4 | 8 | 7 | — | 7 | needs_work |
| Maintainability | 4 | 8 | 6 | — | 6 | needs_work |
| Type safety / validation | 3 | 8 | 6 | — | 6 | needs_work |
| Error handling / logging | 3 | 8 | 7 | — | 7 | needs_work |
| Dependency hygiene | 3 | 8 | 8 | — | 8 | healthy |
| Tests | 5 | 7 | 7 | — | 7 | needs_work |
| CI/CD | 4 | 7 | 6 | — | 6 | blocked_manual_workflow_edit |
| Security / privacy | 5 | 8 | 7 | — | 7 | needs_work |
| Performance | 3 | 8 | 7 | — | 7 | needs_work |
| GitHub Pages presentation | 5 | 8 | 7 | — | 7 | needs_work |
| UX / usability | 4 | 8 | 7 | — | 7 | needs_work |
| Accessibility | 3 | 8 | 7 | — | 7 | needs_work |
| Content quality | 3 | 8 | 6 | — | 6 | needs_work |
| Feature completeness | 4 | 8 | 7 | — | 7 | needs_work |
| Deployment readiness | 4 | 8 | 6 | — | 6 | needs_work |
| Agent readiness | 5 | 8 | 8 | — | 8 | healthy |
| Task hygiene | 3 | 8 | 7 | — | 7 | needs_work |
| Auditability | 3 | 8 | 8 | — | 8 | healthy |

Weighted total: `582 / 83 = 7.012...`, rounded to 7.0.

## Completed after the audit

- Lineage graph/directory mode uses one semantic state path for `hidden`, `.active`, and `aria-pressed`.
- Mode controls now have explicit button/group semantics and target relationships.
- Phone directory quote placement resets to one column.
- Missing/malformed required data renders a focusable `role="alert"` recovery panel with reload and a concise diagnostic.
- Initialization failures are caught at the top level.
- Smoke behavior-tests both Lineage directions and executes the missing-bundle recovery in an isolated VM.
- Playwright covers computed mode visibility/attributes, mobile overflow, and an aborted-bundle recovery path.

## Active release blockers

1. JSON Schema is inert and malformed/empty non-case units can pass validation.
2. All 14 rights records await human review; 3 verified references remain pending.
3. Playwright is success-skippable and absent from CI; no current visual/axe/owner evidence exists.
4. CSP order, `unsafe-inline` style dependence, runtime Google Fonts, and missing security guidance remain.
5. CI mirror paths/action majors and branch-protection verification require owner/admin work.
6. Thirty-three locator migrations, Biyanlu/Linji depth, 30 edge reviews, and 34 profile reviews remain.
7. Several toggle/tooltip/radio/search semantics and a formal screen-reader pass remain.

## Required gate failures

The gate requires security/privacy ≥8, tests ≥7, README ≥7, CI/CD ≥7, agent readiness ≥8, and overall ≥8. Tests, README, and agent readiness now pass. Current failures are security 7, CI/CD 6, and overall 7.0. Unresolved validation, rights/source, browser/accessibility, and operations risks independently block release.

## Recommended next order

1. Add strict non-case shape validation and checked-in negative fixtures.
2. Add non-skippable browser/axe/overflow/screenshots and obtain owner approval.
3. Complete rights/references and field-level source review.
4. Harden CSP/fonts/security guidance and remaining interaction semantics.
5. Apply owner-approved workflow/action/protection changes.
6. Remove remaining inline styles/dead CSS and measure lazy room/data loading.
