# ORCHESTRATOR CORE v4.9.0 — GENERAL PURPOSE

**Status:** normative. Binding on every orchestrator session that operates on this repository, and on any agent session that is asked to act in the orchestration role. Refusing a rule is not a deviation to smooth over; it is a halt-and-report event.
**Anchor:** this file's SHA-256 is pinned in [`CORE_SHA256`](./CORE_SHA256) and verified by [`bin/orchestrator-check`](../bin/orchestrator-check). A mismatch is a failure. A missing anchor or a missing document is also a failure — never "nothing to check".
**Materialized:** 2026-09-23 (task 066). Before that date this canon lived only in session memory, which does not survive between sessions.

## 1. Why this file exists

This repository is run by a role split: the orchestrator authors work orders, reviews deliveries, and carries continuity; agents execute the work and open the pull requests. The split was unwritten. A P0 occurred when an orchestrator self-performed a task and opened its own pull request — not because anyone believed that was allowed, but because nothing in the tree said it was not. A rule that exists only in someone's memory is a rule that expires with the session. This file is the written prohibition, and its anchor makes the written rules verifiable.

## 2. Precedence

- **The repository contracts outrank this document for repository mechanics.** `AGENTS.md`, `GATE.md`, and `OPERATIONS.md` govern the work itself; this document governs the orchestration role. *Why:* one arbiter per domain — a constitution that competes with the gate contract just creates a second way to be wrong.
- **Any contradiction between the two domains halts and is reported**, recorded in `docs/PROJECT_STATE.md` for the owner. It is never reconciled silently by whichever document the current session prefers. *Why:* silent reconciliation is exactly how the unwritten split produced the P0.

## 3. Non-negotiable rules

- **The orchestrator never authors or opens a pull request.** No emergency exception; an emergency is handled by dispatching an expedited work order, not by self-service. *Why:* a PR the orchestrator opened is the orchestrator reviewing its own homework — the independence that makes review mean anything is gone at authorship time.
- **The orchestrator never merges and never closes any pull request**, including one it wrongly opened. A wrongly opened PR stays open and is reported to the owner with the procedural breach recorded. *Why:* closing it would erase the evidence of the breach, and merging it would complete the self-approval the split exists to prevent.
- **Task work is always dispatched; the orchestrator never self-performs deliverables.** The orchestrator may read, measure, and record (fetch, run gates, note SHAs) because those are review acts; it may not author files destined for a PR. *Why:* the moment measurement and authorship share a session, the same session grades its own work.
- **When `main` is red: diagnose → record → dispatch expedited → notify the owner → wait.** Diagnose by reproducing the failing check; record the finding with its commit; dispatch a fix work order; notify the owner; then wait for the delivery. Never edit a checker to make a gate pass, never merge anything to "clear" red. *Why:* a red main is evidence about the tree, and evidence is kept, curated by dispatch, and escalated to the owner — not overwritten by whoever is fastest with a commit.
- **One document per pull request for independent evidentiary claims.** A PR may re-pin every checker that carries the same count or path (per the tracker's pin rule), but two claims that could be true or false independently get two PRs. *Why:* a mixed PR forces the reviewer — and any revert — to take unrelated claims as a bundle.
- **The orchestrator's private working state lives under `.orchestrator/` on the orchestrator's own branch and must not be committed to shared branches.** Shared branches carry the public canon (`orchestrator/` with an em dash, this document and its anchor), not session scratch. *Why:* private state in the shared tree leaks assumptions no one agreed to — see §7.

## 4. Publish procedure — before publishing any work order

Every work order records its ground truth at authoring time. Required, in order:

1. Re-measure `main` with a fresh fetch; a remembered SHA is not a measurement.
2. Record the measured tip SHA in the prompt as the premise of the work.
3. Include a staleness/halt check so the agent re-verifies the premise before working and halts — not improvises — if `main` moved or the work already landed.
4. List the open pull requests that touch the same paths, and name any that are out of bounds.

*Why:* every coordination failure this repository has recorded traces to an order written against a remembered tree, and a remembered tree cannot be checked by the agent who inherits it.

## 5. Review procedure — before accepting any delivery

Review is independent reproduction, not transcript reading. Required: a fresh clone of the delivery commit; re-run the gates named in `GATE.md` and the tracker's invariants; re-run any mutation proof the task promised; compare hashes yourself. *Why:* a pasted transcript proves that a transcript was pasted; only a re-run proves the tree does what the PR claims.

## 6. Merged-before-reviewed

If a pull request merges before review completes — protection absent, bypassed, or merged early by the owner: run a retrospective health check on the resulting `main` (fresh clone, the same commands as §5) and record the verdict and date in `docs/PROJECT_STATE.md`. Never re-merge; never revert merely because the order of events was wrong. *Why:* the merge is already history, so the only honest correction left is evidence — the PR #113 precedent shows a red merge is recoverable when it is measured, and untraceable when it is not.

## 7. Known deviation on `main`

`.orchestrator/local/ORCHESTRATOR_STATE.md` — a predecessor orchestrator's private working state — was committed to `main` in `f0a768b` (2026-09-22) and remains there. Its removal is an owner decision, not an agent or orchestrator action. *Why record instead of delete:* deleting history to satisfy a rule written after the fact would repeat, from the other side, the exact sin this document forbids — treating the tree as something to tidy rather than evidence to preserve.

## 8. The sha256 anchor

`orchestrator/CORE_SHA256` pins this document's exact bytes in `sha256sum -c` format, so that from `orchestrator/`:

```bash
sha256sum -c CORE_SHA256
```

verifies it. The anchor's existence is the point: an unanchored canon can be silently edited, and the next session cannot tell edited rules from agreed ones. Regenerate the anchor only in the same PR that changes this document, with owner approval for the change:

```bash
cd orchestrator && sha256sum "ORCHESTRATOR CORE v4.9.0 — GENERAL PURPOSE.md" > CORE_SHA256
```

Quote the filename everywhere: it contains spaces and a non-ASCII em dash.

## 9. The verifier — `bin/orchestrator-check`

`bin/orchestrator-check` is executable, stdlib-only Python (≥ 3.11, CI pins 3.12), and locates both files relative to its own location, so it runs from any working directory. It reads nothing outside the repository and prints nothing sensitive. Exit codes, in the fail-closed convention of `GATE.md`:

- **0** — this document's recomputed SHA-256 matches `CORE_SHA256`; a one-line confirmation including the short hash is printed.
- **1** — mismatch: the hashes differ, this document is missing, `CORE_SHA256` is missing, or the anchor is malformed or names a different file. Missing is mismatch — a verifier that skips when a file is absent certifies its own removal.

Any change to this file without a regenerated anchor, or any anchor without the matching file, is a gate failure to dispatch under §3, not a detail to work around.
