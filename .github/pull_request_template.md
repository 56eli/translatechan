# Pull Request

> **Agent contract:** see [`AGENTS.md`](../AGENTS.md) and
> [`HANDOFF.md`](../HANDOFF.md) before opening this PR.

## Summary

<!-- What does this PR do? Why? Link the relevant session report in sessions/
     and the affected blocker in HANDOFF.md, if any. -->

## Workflow edits

- [ ] No workflow edits needed
- [ ] Workflow edits explicitly owner-authorized and documented in [`OPERATIONS.md`](../OPERATIONS.md)

> Agents must not edit `.github/workflows/*` unless explicitly instructed by the
> owner. The 2026-11-12 layout demolition authorized the Quality update recorded
> in OPERATIONS.md Edit 7.

## Checks run

- [ ] `python3 -m py_compile scripts/*.py`
- [ ] `python3 scripts/validate_data.py`
- [ ] `python3 scripts/build_pages.py`
- [ ] `python3 scripts/test_source_preservation.py`
- [ ] `python3 scripts/test_source_review_rules.py`
- [ ] `python3 scripts/test_pages_contract.py`
- [ ] `git diff --check`
- [ ] Not applicable

## Release impact

Does this PR change any blocker listed in [`HANDOFF.md`](../HANDOFF.md)?

- [ ] No — blockers unchanged
- [ ] Yes — describe which blocker and how:

## Files intentionally not changed

List any files intentionally not changed and why (e.g. historical session logs,
corpus data, rights records, GitHub settings):

## Risk flags touched

If this PR touches an active risk described in [`HANDOFF.md`](../HANDOFF.md),
list them here:
