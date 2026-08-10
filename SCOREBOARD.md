# 📊 TranslateChan / Fake Chan Factory — Repo Scoreboard

> **Last updated:** 2026-08-10
> **Status legend:** [rubric](./.scoreboard/rubric.md) · [YAML](./.scoreboard/scoreboard.yml) · [history](./.scoreboard/history.md) · [agent-handoff](./.scoreboard/agent-handoff.md) · [manual-workflow-edits](./.scoreboard/manual-workflow-edits.md) · [latest audit](./docs/audits/2026-08-10-baseline.md)

## Scoring policy

This scoreboard separates two questions:

- **AI: how healthy is this aspect on the evidence?** → `ai_score`
- **User: how satisfied or de-prioritized is the user for this aspect?** → `user_score`

`effective_score = user_score if present, otherwise ai_score`. AI scores diagnose; user scores decide planning priority. They are never averaged. User scores must be set by explicit user instruction only — PR approval, merge, or silence is **not** a `user_score`.

Full rules: [`.scoreboard/rubric.md`](./.scoreboard/rubric.md).

## 🏟️ Arena/sandbox note

Agent sessions are sandboxed and may expire after a PR merge. **Durable context must live in repo files.** Future agents must read this scoreboard + `.scoreboard/agent-handoff.md` first; chat memory is not durable.

## Top priorities (sorted by `gap × weight`, descending)

| # | Aspect | Effective | Gap | Weight | Priority | Status |
|---|---|---:|---:|---:|---:|---|
| 1 | deployment_readiness | 7 | 1 | 4 | 4 | blocked_manual_workflow_edit |
| 2 | feature_completeness | 7 | 1 | 4 | 4 | needs_work |
| 3 | error_handling_logging | 7 | 1 | 3 | 3 | needs_work |
| 4 | performance | 7 | 1 | 3 | 3 | needs_work |
| 5 | content_quality | 7 | 1 | 3 | 3 | needs_work |

## Scoreboard table

| Aspect | Weight | Target | AI | User | Effective | Gap | Priority | Status | Confidence | Next Action |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|---|
| Project purpose / scope | 4 | 8 | 9 | — | 9 | 0 | 0 | healthy | high | — |
| README / onboarding | 4 | 7 | 8 | — | 8 | 0 | 0 | healthy | high | Optional: trim internal ingest scripts from repo tree (P3) |
| Repo organization | 3 | 8 | 8 | — | 8 | 0 | 0 | healthy | high | Optional: scripts/internal/ split (P3) |
| Code hygiene | 4 | 8 | 8 | — | 8 | 0 | 0 | healthy | high | — |
| Architecture | 4 | 8 | 8 | — | 8 | 0 | 0 | healthy | high | — |
| Maintainability | 4 | 8 | 8 | — | 8 | 0 | 0 | healthy | high | — |
| Type safety / validation | 3 | 8 | 9 | — | 9 | 0 | 0 | healthy | high | — |
| Error handling / logging | 3 | 8 | 7 | — | 7 | 1 | 3 | needs_work | medium | Optional: client-side error reporter (P3) |
| Dependency hygiene | 3 | 8 | 9 | — | 9 | 0 | 0 | healthy | high | — |
| Tests | 5 | 7 | 8 | — | 8 | 0 | 0 | healthy | high | Optional: combine validate + build + smoke into one 'ci' script (P3) |
| CI/CD | 4 | 7 | 7 | — | 7 | 0 | 0 | blocked_manual_workflow_edit | high | Owner: extend .github/workflows/quality.yml git diff --exit-code list (see manual-workflow-edits.md Edit 1) |
| Security / privacy | 5 | 8 | 9 | — | 9 | 0 | 0 | healthy | high | — |
| Performance | 3 | 8 | 7 | — | 7 | 1 | 3 | needs_work | medium | Compact JSON in build_data_bundle.py (~XS), or per-corpus lazy-load split (~M) |
| GitHub Pages presentation | 5 | 8 | 9 | — | 9 | 0 | 0 | healthy | high | Optional: og:image (P3) |
| UX / usability | 4 | 8 | 9 | — | 9 | 0 | 0 | healthy | high | — |
| Accessibility | 3 | 8 | 8 | — | 8 | 0 | 0 | healthy | high | Optional: aria-live announcements (P3) |
| Content quality | 3 | 8 | 7 | — | 7 | 1 | 3 | needs_work | medium | Populate alternative_names + linked_corpus_keys; consider next Phase 2 ingest |
| Feature completeness | 4 | 8 | 7 | — | 7 | 1 | 4 | needs_work | medium | Continue Phase 2 corpus ingest (Congronglu/Dongshan/etc.); expand glossary 31→150+ |
| Deployment readiness | 4 | 8 | 7 | — | 7 | 1 | 4 | blocked_manual_workflow_edit | high | Owner: enable branch protection requiring Quality check (see manual-workflow-edits.md Edit 2) |
| Agent readiness | 5 | 8 | 8 | — | 8 | 0 | 0 | healthy | high | — |
| Task hygiene | 3 | 8 | 8 | — | 8 | 0 | 0 | healthy | high | — |
| Auditability | 3 | 8 | 9 | — | 9 | 0 | 0 | healthy | high | — |

## AI / user disagreement

None yet — no `user_score` has been provided. If the user provides a `user_score` later, both perspectives are preserved here, the disagreement status (`user_unhappy` or `accepted_debt`) is set in the YAML, and risk flags are kept visible regardless.

## Critical risk flags

These remain visible even if the user accepts them:

- **CI workflow path list missing 3 files** (`docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`). Workflow change documented in [`.scoreboard/manual-workflow-edits.md` Edit 1](./.scoreboard/manual-workflow-edits.md). Low practical risk because the smoke test enforces them, but a future refactor could rotate them without CI noticing.
- **Branch protection on `main` does not require the Quality check.** PRs can currently merge without the gate. Owner action documented in [`.scoreboard/manual-workflow-edits.md` Edit 2](./.scoreboard/manual-workflow-edits.md).
- **Bundle size 1.87 MB** is a real first-paint cost on slow connections. Per-corpus lazy-load split is the recommended Tier-3 follow-up.
- **Robo renderings form 72% of all translation slots** (966 reconstruction_unverified + 199 ai_draft + 177 verified = 1342). By design — this is what "Fake Chan Factory" *is* — but worth re-stating for any new contributor or auditor.

## Aspects needing user review

All 22 aspects need a `user_score` (currently `null`). The most useful place to start:

- `ci_cd` and `deployment_readiness` (both `blocked_manual_workflow_edit`) — even a thumbs-up here would help triage whether the owner considers the missing workflow edit urgent.
- `content_quality` and `feature_completeness` (both `needs_work`, priority 3 and 4) — would the user prefer more Phase 2 ingest, or more polish on the data completeness (`alternative_names`, `linked_corpus_keys`)?
- `performance` (priority 3) — would the user accept the 1.87 MB bundle as is, or do they want the lazy-load split?

## Quality gate status

`repo_ready` = **warning**.

- All required-aspect numeric thresholds pass (security_privacy 8 ≥ 8, tests 8 ≥ 7, readme_onboarding 8 ≥ 7, ci_cd 7 ≥ 7, agent_readiness 8 ≥ 8).
- Gate is `warning` (not `pass`) because `ci_cd` and `deployment_readiness` are `blocked_manual_workflow_edit` — the numeric threshold is met, but the underlying risk flags are visible.
- After the two manual workflow edits land, the gate should move from `warning` → `pass`.

## Files

- Canonical machine-readable source: [`.scoreboard/scoreboard.yml`](./.scoreboard/scoreboard.yml)
- Scoring rubric: [`.scoreboard/rubric.md`](./.scoreboard/rubric.md)
- Change history: [`.scoreboard/history.md`](./.scoreboard/history.md)
- Agent-to-agent handoff: [`.scoreboard/agent-handoff.md`](./.scoreboard/agent-handoff.md)
- Manual GitHub workflow edits required: [`.scoreboard/manual-workflow-edits.md`](./.scoreboard/manual-workflow-edits.md)
- Latest audit log: [`docs/audits/2026-08-10-baseline.md`](./docs/audits/2026-08-10-baseline.md)
- Agent protocol section: [`AGENTS.md`](./AGENTS.md)
- PR template: [`.github/pull_request_template.md`](./.github/pull_request_template.md)
