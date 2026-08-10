# Scoreboard History

| Date | Aspect | AI Before | AI After | User Before | User After | Changed By | Evidence / Notes |
|---|---|---:|---:|---:|---:|---|---|
| 2026-08-10 | project_purpose_scope | — | 9 | — | null | Arena agent | Baseline audit. Scope is sharply defined; 36 canonical texts, 4 complete, honest Robo/verified disclosure is structural. |
| 2026-08-10 | readme_onboarding | — | 8 | — | null | Arena agent | Baseline audit. README + HANDOFF + AUDIT + 4 more docs, doc-truthfulness gate guards 25+ numbers. |
| 2026-08-10 | repo_organization | — | 8 | — | null | Arena agent | Baseline audit. data/ + scripts/ + schemas/ + sessions/ + docs/ mirror all clean. |
| 2026-08-10 | code_hygiene | — | 8 | — | null | Arena agent | Baseline audit. Single IIFE, no console.*, no inline handlers, escHtml 70+ uses. |
| 2026-08-10 | architecture | — | 8 | — | null | Arena agent | Baseline audit. Zero-backend SPA, controlled vocabularies, validator-as-spec. C1 module split deferred. |
| 2026-08-10 | maintainability | — | 8 | — | null | Arena agent | Baseline audit. Shared popover infra, smoke test 44+ checks, data-driven filters. |
| 2026-08-10 | type_safety_validation | — | 9 | — | null | Arena agent | Baseline audit. JSON Schema + Python validator mirror each other; 30+ structural rules. |
| 2026-08-10 | error_handling_logging | — | 7 | — | null | Arena agent | Baseline audit. Fail-soft storage, motionBehavior, but no structured logging or user-visible error reporting. |
| 2026-08-10 | dependency_hygiene | — | 9 | — | null | Arena agent | Baseline audit. Zero runtime deps; only devDep is Playwright. |
| 2026-08-10 | tests | — | 8 | — | null | Arena agent | Baseline audit. 770+ line smoke test, 44+ checks, optional Playwright suite. |
| 2026-08-10 | ci_cd | — | 7 | — | null | Arena agent | Baseline audit. Quality workflow exists, but git diff --exit-code list missing 3 files + branch protection not requiring check. Status: blocked_manual_workflow_edit. |
| 2026-08-10 | security_privacy | — | 9 | — | null | Arena agent | Baseline audit. Restrictive CSP, no PII, search self-XSS guarded, rights manifest. |
| 2026-08-10 | performance | — | 7 | — | null | Arena agent | Baseline audit. Deferred scripts + lazy chunking + search cache, but 1.87 MB bundle. |
| 2026-08-10 | github_pages_presentation | — | 9 | — | null | Arena agent | Baseline audit. Full SEO, theme-color, canonical, robots, sitemap, FOUC guard, data-derived hero. |
| 2026-08-10 | ux_usability | — | 9 | — | null | Arena agent | Baseline audit. Calm reader + case strip + U1/U2/U3/U8 just shipped. |
| 2026-08-10 | accessibility | — | 8 | — | null | Arena agent | Baseline audit. ARIA tabs, role=dialog, focus management, prefers-reduced-motion. |
| 2026-08-10 | content_quality | — | 7 | — | null | Arena agent | Baseline audit. 4/36 complete, 32 excerpt seeds, 177 verified slots, 15 masters with empty alternative_names. |
| 2026-08-10 | feature_completeness | — | 7 | — | null | Arena agent | Baseline audit. Public scope complete; 32 excerpt seeds + 31/150 glossary terms = ROADMAP Phase 2. |
| 2026-08-10 | deployment_readiness | — | 7 | — | null | Arena agent | Baseline audit. Pages live, /docs mirrored, but Quality check not enforced. Status: blocked_manual_workflow_edit. |
| 2026-08-10 | agent_readiness | — | 8 | — | null | Arena agent | Baseline audit. HANDOFF + AUDIT + sessions/ + scoreboard (this PR) + arena branch convention. |
| 2026-08-10 | task_hygiene | — | 8 | — | null | Arena agent | Baseline audit. Dated session reports; no TODO/FIXME in public surface. |
| 2026-08-10 | auditability | — | 9 | — | null | Arena agent | Baseline audit. Validator + smoke + sessions + scoreboard. |
