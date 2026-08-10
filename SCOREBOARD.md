# 📊 TranslateChan / Fake Chan Factory — Repo Scoreboard

> **Last updated:** 2026-08-10, session `arena/019febb1-translatechan`
> **Evidence:** [full audit](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md) · [containment](./sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md) · [functional hotfix](./sessions/FUNCTIONAL_HOTFIX_2026-08-10.md) · [YAML](./.scoreboard/scoreboard.yml) · [history](./.scoreboard/history.md) · [handoff](./.scoreboard/agent-handoff.md)

## Current result

**Overall effective score: 6.8/10. `repo_ready = fail`.**

The audit reset an unsupported 8.2 score to 5.8; containment and functional fixes raised engineering health to 7.0. The owner then explicitly rejected the prior visual-completion claim. A fresh design-gap audit found that the site still uses generic dashboard composition despite the Chinese Chan hall vision, lowering the current evidence-based score to 6.8.

No explicit user score has been supplied. Every `user_score` remains `null`.

## Highest priorities

| Priority | Aspect | Score | Gap × weight | Why |
|---:|---|---:|---:|---|
| 1 | GitHub Pages presentation | 5 | 15 | Accepted Chinese Chan hall/literature-first vision is not implemented |
| 2 | Error handling / logging | 5 | 9 | No fatal-load UI; malformed storage path remains |
| 3 | UX / usability | 6 | 8 | First source text and literary flow remain buried under dashboard chrome |
| 4 | Deployment readiness | 6 | 8 | Rights and operations gates still block release |
| 5 | Accessibility | 6 | 6 | Contrast and ARIA state/tooltip/radio semantics |
| 6 | Content quality | 6 | 6 | Rights decisions and field-level source review |

## Score table

| Aspect | Weight | Target | AI | User | Effective | Status |
|---|---:|---:|---:|---:|---:|---|
| Project purpose / scope | 4 | 8 | 9 | — | 9 | healthy |
| README / onboarding | 4 | 7 | 7 | — | 7 | healthy |
| Repo organization | 3 | 8 | 7 | — | 7 | needs_work |
| Code hygiene | 4 | 8 | 7 | — | 7 | needs_work |
| Architecture | 4 | 8 | 7 | — | 7 | needs_work |
| Maintainability | 4 | 8 | 7 | — | 7 | needs_work |
| Type safety / validation | 3 | 8 | 7 | — | 7 | needs_work |
| Error handling / logging | 3 | 8 | 5 | — | 5 | needs_work |
| Dependency hygiene | 3 | 8 | 8 | — | 8 | healthy |
| Tests | 5 | 7 | 7 | — | 7 | needs_work (browser can skip) |
| CI/CD | 4 | 7 | 6 | — | 6 | blocked_manual_workflow_edit |
| Security / privacy | 5 | 8 | 7 | — | 7 | needs_work |
| Performance | 3 | 8 | 7 | — | 7 | needs_work |
| GitHub Pages presentation | 5 | 8 | 5 | — | 5 | needs_work |
| UX / usability | 4 | 8 | 6 | — | 6 | needs_work |
| Accessibility | 3 | 8 | 6 | — | 6 | needs_work |
| Content quality | 3 | 8 | 6 | — | 6 | needs_work |
| Feature completeness | 4 | 8 | 7 | — | 7 | needs_work |
| Deployment readiness | 4 | 8 | 6 | — | 6 | needs_work |
| Agent readiness | 5 | 8 | 7 | — | 7 | needs_work |
| Task hygiene | 3 | 8 | 7 | — | 7 | needs_work |
| Auditability | 3 | 8 | 8 | — | 8 | healthy |

## Completed this session

### Content containment

- Removed all unreliable Congronglu data, locators, deployment copies, and generating scripts.
- Authoritative T48n2004 headings disproved even the five purportedly collated records.
- Added explicit completion status, anti-placeholder validation, corrected counts/claims, and edition-verification/rights separation.

### Public-behavior hotfix

- Dossier now removes/restores semantic `hidden` and is visible/focus-managed.
- All six direct-field Platform chapters render source text and source disclosure.
- Wumenguan epilogue follows case units.
- Print/PDF renders all lazy cases/sections before print; Wumenguan exports 48 cases followed by epilogue.
- Wumenguan and Biyanlu labels name their actual commentator/verse author.
- Smoke and Playwright cover every repaired path.

## Active release blockers

1. **Design vision:** current page is still a crowded rounded-card/emoji dashboard; execute the linked shell/first-fold/five-room redesign and require screenshot-based owner approval.
2. **Rights governance:** all 14 rights-manifest sources still require their documented human rights/jurisdiction decision.
3. **Source depth:** Biyanlu, Linji, Platform, and other non-case records need field-level coverage and broader human review.
4. **Responsive/accessibility:** sticky geometry, mobile Reader controls on other views, contrast, and ARIA state relationships remain.
5. **Error handling:** missing bundle/fatal state and malformed persisted-state hardening remain.
6. **Operations:** generated deploy paths and action majors need owner-approved workflow edits; branch protection needs administrator verification; browser execution is not required in CI.

## Required gate failures

The gate requires security/privacy ≥8, tests ≥7, README ≥7, CI/CD ≥7, agent readiness ≥8, and overall ≥8. Tests and README now meet 7. Current failures are security 7, CI 6, agent readiness 7, and overall 6.8. Unresolved rights decisions independently block release readiness.

## Recommended next order

1. Execute `sessions/WEB_DESIGN_GAP_PLAN_2026-08-10.md`: shell/first fold, Reader literature hierarchy, visual-system consolidation, then four secondary rooms.
2. Require current light/dark mobile/desktop screenshots and explicit owner approval before declaring the vision fulfilled.
3. Complete responsive/accessibility and error-state hardening as part of the redesign.
4. Complete field-level source validation and quotation rights decisions.
5. Apply owner-approved CI/action/branch-protection changes and make browser tests non-skippable in CI.
6. Re-audit release readiness; re-ingest Congronglu only under the containment gate.
