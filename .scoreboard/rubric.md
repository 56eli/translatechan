# Scoreboard Rubric

This document defines how scores, statuses, and priorities are computed in
`.scoreboard/scoreboard.yml`. The scoreboard separates AI audit judgment
from user satisfaction/override.

## 1. Purpose

The scoreboard exists because Arena/sandboxed agent sessions may expire
after a PR merge. Durable project context must live in repo files. The
scoreboard is the canonical machine-readable layer; this rubric is its
companion human-readable spec.

The scoreboard separates two questions:

- **AI: how healthy is this aspect on the evidence?** → `ai_score`
- **User: how satisfied or de-prioritized is the user for this aspect?** → `user_score`

The `effective_score` picks one and only one. AI scores diagnose; user
scores decide planning priority. They never get averaged.

## 2. Score scale

Use 0–10 integer scores only for individual aspect scores.

```text
10 = excellent
9  = very strong
8  = solid / ready
7  = good enough with some issues
6  = usable but needs improvement
5  = mixed / incomplete
4  = weak
3  = poor
2  = barely functional
1  = almost absent
0  = missing, broken, or unauditable
```

- Scores must be integers.
- `null` means unknown/missing.
- `null` is different from `0`.
- `0` means missing, broken, or unauditable.
- Do not use `0` to mean unknown.

## 3. Score types

```text
ai_score       evidence-based audit score
user_score     explicit owner/user score only (or null)
effective_score = user_score if present, otherwise ai_score
```

## 4. Effective score rule

```text
effective_score = user_score if present, otherwise ai_score
```

Never average AI and user scores. User scores control planning priority,
but they do not erase AI evidence, accepted debt, or risk flags.

PR approval, merge, or lack of user complaint does **not** imply a new
`user_score`. Only an explicit user instruction can set or change a
`user_score`.

## 5. Priority formula

```text
gap       = max(target - effective_score, 0)
priority  = gap * weight
```

Higher `priority` means future agents should address it sooner.

Calculated aggregate values like `overall_effective_score` may be
decimal values. Round aggregate scores to one decimal place.

## 6. Status definitions

| Status | Meaning |
|---|---|
| `pending_audit` | No AI score exists yet. |
| `pending_user_review` | AI score exists, but `user_score` is `null`, and no more urgent status applies. |
| `healthy` | Effective score >= target and no more specific status applies. |
| `needs_work` | Effective score < target and no more specific status applies. |
| `user_unhappy` | User score < target while AI score >= target. |
| `accepted_debt` | User score >= target while AI score < target. |
| `needs_audit` | AI score exists, but evidence is thin, confidence is low, or the score needs verification. |
| `stale` | Audit older than 45 days or predates major rewrite. |
| `blocked_manual_workflow_edit` | Improvement requires manual GitHub workflow edit. |
| `risk_accepted` | User explicitly accepts a documented risk, but the risk flag remains visible. |
| `not_applicable` | Aspect does not apply to this repo. |

Distinguish:

```text
pending_audit = no AI score exists yet
needs_audit   = AI score exists but evidence is thin, confidence is low, or verification is needed
```

Status precedence (most specific / actionable wins):

```text
not_applicable
pending_audit
blocked_manual_workflow_edit
user_unhappy
risk_accepted
accepted_debt
needs_audit
stale
needs_work
pending_user_review
healthy
```

Document stale precedence:

```text
stale should override healthy, needs_work, or pending_user_review unless
a more urgent status (blocked_manual_workflow_edit, user_unhappy,
risk_accepted, accepted_debt, needs_audit) applies.
```

## 7. User score protection

- Agents must not invent user scores.
- Agents must not infer user scores.
- Agents must not change user scores without explicit user instruction.
- Valid user score source must be explicit user instruction.

Valid user score examples:

```text
User: "Set GitHub Pages presentation to 4/10."
User: "Code hygiene is 10/10 for my purposes."
User: "README is now 8/10."
```

Invalid user score sources:

```text
PR was merged.
User did not complain.
Agent thinks the user will like it.
Agent assumes approval from silence.
```

## 8. AI score update rules

- AI score may change only after an evidence-based audit.
- Evidence must mention commands run, files reviewed, or observed repo state.
- If confidence is low, say why and consider `status: needs_audit`.

## 9. Risk flag rules

- Risk flags remain visible even if the user accepts the risk.
- Security, privacy, data-loss, deployment, correctness, and compliance
  risks should be flagged.
- If the user accepts a risk, use `risk_accepted` only when acceptance is
  explicit.

## 10. Quality gates

- Gates use `effective_score`.
- User overrides may satisfy numeric gates.
- Accepted debt and risk flags remain visible.
- If a gate passes due to user score while AI score is low, record
  `accepted_debt` or `risk_accepted` on the relevant aspect.
- Gate status: `pass`, `warning`, `fail`, or `unknown`.
- Store gate results in both `summary.repo_ready_gate_status` and
  `quality_gates.repo_ready.status`.

```text
pass    = overall score + all required aspect thresholds pass, no serious active risk flags
warning = numeric thresholds pass, but risk flags / accepted debt / low AI overridden by user / stale / low-confidence
fail    = one or more required aspect thresholds fail
unknown = insufficient audited data
```

## 11. Arena/sandbox handoff rule

- Agent sessions are sandboxed and may expire after a PR merge.
- Each agent must update `.scoreboard/agent-handoff.md` before finishing.
- Future agents must not rely on chat memory.

## 12. Manual workflow edit policy

- Do not edit `.github/workflows/*` unless the user explicitly instructs.
- Document needed edits in `.scoreboard/manual-workflow-edits.md`.
- If workflow changes block progress, use `status: blocked_manual_workflow_edit`.

## 13. Safe audit behavior

- Do not install new dependencies just to audit, unless necessary and safe.
- Do not run destructive commands.
- Prefer existing project scripts and read-only inspection.
- If checks cannot be run safely, record the limitation in evidence and
  the audit log.
