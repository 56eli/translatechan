# 📊 TranslateChan / Fake Chan Factory — Repo Scoreboard

> **Last updated:** 2026-08-10, session `arena/019febb1-translatechan`
> **Evidence:** [full audit](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md) · [containment record](./sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md) · [YAML](./.scoreboard/scoreboard.yml) · [rubric](./.scoreboard/rubric.md) · [history](./.scoreboard/history.md) · [agent handoff](./.scoreboard/agent-handoff.md)

## Current result

**Overall effective score: 6.5/10. `repo_ready = fail`.**

The initial audit reset the prior 8.2 score to 5.8 after finding a content-integrity P0 and several P1 defects. The user then selected containment: the entire unreliable Congronglu seed, locator claims, and four generating scripts were removed; authoritative CBETA T48n2004 headings showed that even the five purportedly collated records had wrong case numbers and pages. Explicit editorial completion status, anti-placeholder validation, bundle-absence regressions, corrected counts, and edition-verification/rights wording raise the post-containment score to 6.5.

No explicit user score has been supplied. Every `user_score` remains `null`.

## Highest priorities

| Priority | Aspect | Score | Gap × weight | Why |
|---:|---|---:|---:|---|
| 1 | Deployment readiness | 5 | 12 | P0 removed, but P1 rights and public behavior still block release |
| 2 | UX / usability | 5 | 12 | Hidden dossier, partial print, wrong order, empty chapters, responsive defects |
| 3 | Error handling / logging | 5 | 9 | No fatal load state; malformed storage path |
| 4 | Accessibility | 5 | 9 | Contrast and state/tooltip/radio semantics |
| 5 | Code hygiene | 6 | 8 | Remaining P1/P2 renderer defects |
| 6 | Maintainability | 6 | 8 | Coupled large files and behavior gaps |

## Score table

| Aspect | Weight | Target | AI | User | Effective | Status |
|---|---:|---:|---:|---:|---:|---|
| Project purpose / scope | 4 | 8 | 9 | — | 9 | healthy |
| README / onboarding | 4 | 7 | 7 | — | 7 | healthy |
| Repo organization | 3 | 8 | 7 | — | 7 | needs_work |
| Code hygiene | 4 | 8 | 6 | — | 6 | needs_work |
| Architecture | 4 | 8 | 7 | — | 7 | needs_work |
| Maintainability | 4 | 8 | 6 | — | 6 | needs_work |
| Type safety / validation | 3 | 8 | 7 | — | 7 | needs_work |
| Error handling / logging | 3 | 8 | 5 | — | 5 | needs_work |
| Dependency hygiene | 3 | 8 | 8 | — | 8 | healthy |
| Tests | 5 | 7 | 6 | — | 6 | needs_work |
| CI/CD | 4 | 7 | 6 | — | 6 | blocked_manual_workflow_edit |
| Security / privacy | 5 | 8 | 7 | — | 7 | needs_work |
| Performance | 3 | 8 | 7 | — | 7 | needs_work |
| GitHub Pages presentation | 5 | 8 | 7 | — | 7 | needs_work |
| UX / usability | 4 | 8 | 5 | — | 5 | needs_work |
| Accessibility | 3 | 8 | 5 | — | 5 | needs_work |
| Content quality | 3 | 8 | 6 | — | 6 | needs_work |
| Feature completeness | 4 | 8 | 6 | — | 6 | needs_work |
| Deployment readiness | 4 | 8 | 5 | — | 5 | needs_work |
| Agent readiness | 5 | 8 | 7 | — | 7 | needs_work |
| Task hygiene | 3 | 8 | 7 | — | 7 | needs_work |
| Auditability | 3 | 8 | 7 | — | 7 | needs_work |

## Containment completed

1. Removed `congronglu_cases` from active corpus, manifest, locators, bundle, navigation, and deployment data.
2. Deleted four obsolete ingestion snapshots capable of restoring generated/stale content.
3. Recorded authoritative T48n2004 heading/page mismatches and a fetched-file SHA-256.
4. Added `completion_status` to every manifest item.
5. Only Wumenguan and Xinxin Ming are `complete_selected_witness`; Biyanlu and Linji are partial; 31 documents are excerpt seeds.
6. N/N representation remains visible but no longer produces a green complete check by itself.
7. Validator rejects a substantial case-specific Chinese source field repeated identically across three or more cases.
8. Smoke tests require quarantined Congronglu to be absent and completion statuses to remain distinct.
9. Public copy now defines ✅ as edition-verified wording and explicitly separates rights/public-domain status.

## Active release blockers

1. **P1 functionality:** six direct-field Platform chapters render empty; Lineage dossier retains `hidden`; Print/PDF exports only lazy-loaded units; Wumenguan epilogue precedes cases; Biyanlu commentary is mislabeled as Wumen commentary.
2. **P1 rights governance:** all 14 rights-manifest sources still require their documented review/jurisdiction decision. Wording is corrected, but decisions are not complete.
3. **P2 source model:** Biyanlu/Platform/Linji need field-level coverage and broader human review beyond document-level status.
4. **P2 tests/accessibility/responsive:** browser execution is skippable; visible behavior, contrast, sticky geometry, and ARIA states are not release-gated.
5. **Operations:** CI omits four mirrored paths and uses action majors with deprecated Node 20 runtimes; branch protection needs administrator verification.

## Required gate failures

The repo-ready policy requires security/privacy ≥8, tests ≥7, README ≥7, CI/CD ≥7, agent readiness ≥8, and overall ≥8. README now passes at 7; current failing values are security 7, tests 6, CI 6, agent readiness 7, and overall 6.5. Active P1 flags independently block readiness.

## Recommended next order

1. Fix dossier, direct chapters, epilogue order, full Print/PDF, and collection labels.
2. Add real-browser regressions that fail when those paths are broken.
3. Complete rights decisions and field-level source coverage.
4. Finish responsive/accessibility pass.
5. Apply owner-approved CI/action/branch-protection changes.
6. Re-ingest Congronglu only under the containment record’s source-pinned gate.
