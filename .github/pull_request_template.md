# Pull Request

> **Agent contract:** see [`AGENTS.md`](../AGENTS.md) and
> [`HANDOFF.md`](../HANDOFF.md) before opening this PR.

## Summary

<!-- What does this PR do? Why? Link the relevant session report in
     sessions/ and the affected blocker in HANDOFF.md §5, if any. -->

## Manual Workflow Edits

- [ ] No workflow edits needed
- [ ] Workflow edits documented in [`OPERATIONS.md`](../OPERATIONS.md)
- [ ] Workflow edits must be manually applied in GitHub web editor

> Agents must not edit `.github/workflows/*` unless explicitly instructed
> by the user. The session token lacks the `workflows` scope. If a
> workflow change is needed, document the exact manual edit in
> [`OPERATIONS.md`](../OPERATIONS.md).

## Checks Run

- [ ] Tests (`node scripts/smoke_test.mjs`)
- [ ] Build (`python3 scripts/build_data_bundle.py`)
- [ ] Lint (`python3 -m py_compile scripts/*.py`)
- [ ] Manual review
- [ ] Not applicable

## Release impact

Does this PR change any blocker listed in
[`HANDOFF.md` §5](../HANDOFF.md#5-release-blockers)?

- [ ] No — blockers unchanged
- [ ] Yes — describe which blocker and how:

## Files Intentionally Not Changed

List any files intentionally not changed and why (e.g. workflow
files, branch protection, historical session logs, the data layer):

## Risk Flags Touched

If this PR touches any active risk described in
[`HANDOFF.md` §5](../HANDOFF.md#5-release-blockers),
list them here:
