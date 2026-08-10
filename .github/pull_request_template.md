# Pull Request

> **Scoreboard protocol:** see [`SCOREBOARD.md`](../SCOREBOARD.md) and
> [`.scoreboard/agent-handoff.md`](../.scoreboard/agent-handoff.md) before
> opening this PR.

## Summary

<!-- What does this PR do? Why? Link the relevant session report in
     sessions/ and the affected aspects in .scoreboard/scoreboard.yml. -->

## Scoreboard Impact

Affected aspects:

- [ ] Project purpose / scope
- [ ] README / onboarding
- [ ] Repo organization
- [ ] Code hygiene
- [ ] Architecture
- [ ] Maintainability
- [ ] Type safety / validation
- [ ] Error handling / logging
- [ ] Dependency hygiene
- [ ] Tests
- [ ] CI/CD
- [ ] Security / privacy
- [ ] Performance
- [ ] GitHub Pages presentation
- [ ] UX / usability
- [ ] Accessibility
- [ ] Content quality
- [ ] Feature completeness
- [ ] Deployment readiness
- [ ] Agent readiness
- [ ] Task hygiene
- [ ] Auditability
- [ ] Other: _____

## Score Changes

| Aspect | AI Before | AI After | User Score Changed? | Evidence |
|---|---:|---:|---|---|
|  |  |  | No |  |

> Reminder: agents must not change `user_score` unless explicitly
> provided by the user. PR approval, merge, or silence does **not**
> imply a new `user_score`. The scoreboard separates AI audit
> judgment from user satisfaction/override.

## Manual Workflow Edits

- [ ] No workflow edits needed
- [ ] Workflow edits documented in [`.scoreboard/manual-workflow-edits.md`](../.scoreboard/manual-workflow-edits.md)
- [ ] Workflow edits must be manually applied in GitHub web editor

> Agents must not edit `.github/workflows/*` unless explicitly instructed
> by the user. The session token lacks the `workflows` scope. If a
> workflow change is needed, set the affected aspect status to
> `blocked_manual_workflow_edit` in
> [`.scoreboard/scoreboard.yml`](../.scoreboard/scoreboard.yml) and
> document the exact manual edit in
> [`.scoreboard/manual-workflow-edits.md`](../.scoreboard/manual-workflow-edits.md).

## Checks Run

- [ ] Tests (`node scripts/smoke_test.mjs`)
- [ ] Build (`python3 scripts/build_data_bundle.py`)
- [ ] Lint (`python3 -m py_compile scripts/*.py`)
- [ ] Manual review
- [ ] Not applicable

## Quality Gate

`repo_ready` status after this PR (per
[`.scoreboard/scoreboard.yml`](../.scoreboard/scoreboard.yml) `summary`):

- [ ] `pass`
- [ ] `warning`
- [ ] `fail`
- [ ] `unknown`

## Files Intentionally Not Changed

List any files intentionally not changed and why (e.g. workflow
files, branch protection, historical session logs, the data layer):

## Risk Flags Touched

If this PR touches any active risk flag listed in
[`SCOREBOARD.md`](../SCOREBOARD.md) or
[`.scoreboard/agent-handoff.md`](../.scoreboard/agent-handoff.md),
list them here:
