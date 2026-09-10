# Orchestrator Working State

> Private to this orchestrator session. Agents never see this file. The canonical,
> owner-visible tracker on `main` is `.orchestrator/STATE.md` (de facto — no
> `docs/PROJECT_STATE.md` exists in this repo); it changes only via agent PRs.

## Orchestrator Branch

`arena/01a08d90-translatechan` — provisioned for this session, branched from `main` @
`02e5db7` (PR #29 merge). Distribution channel only. Never merges, never a PR base,
never receives non-orchestrator content. Divergence from `main` is expected.

## Canonical Project Tracker

- `.orchestrator/STATE.md` on `main` (task queue, standing decisions, invariants, known gaps).
- Supporting: `ROADMAP.md` (long-horizon roadmap), `HANDOFF.md` (release blockers, measured snapshot),
  `AGENTS.md` (agent contract + quality gates), `.orchestrator/REMEDIATION_PLAN.md` (W1 work-order).
- Divergence note (recorded 2026-09-11): the previous orchestrator generation committed
  its state to `main` under the old layout. Under this protocol, dispatch bookkeeping
  stays in this file on the orchestrator branch; `main`'s `STATE.md` wins for merged
  history, this file wins for dispatch bookkeeping.

## Published Task Prompts

| Seq | Prompt path | Task | Agent branch | PR | Status |
|---|---|---|---|---|---|
| 001 | .orchestrator/prompts/001-biyanlu-r-a-rekey.md | W1 remediation Wave 1 doc 2: re-key biyanlu_cases to T2003 (42 content fields) | arena session at dispatch | — | Dispatched 2026-09-11 |

Numbering note: no `.orchestrator/prompts/` directory exists on `main` or on any
reachable arena branch (checked 2026-09-11, incl. `arena/01a08caa-translatechan`, the
PR #29 source). This sequence starts at 001 with this orchestrator generation. The
"prompt-002 revision" referenced in `main`'s STATE.md (wumenguan) lived on a defunct
branch and is not retrievable; its content is recoverable from the merged PR #29 diff
(`cb832ab..02e5db7`).

## Active Milestone

W1 per-document remediation under the owner-adopted hybrid R-A/R-B/R-C policy —
Wave 1, document 2 (`biyanlu_cases`) in flight. Owner-confirmed sequencing
(2026-09-11): remediation wave continuation → visual-system reset → W2
quotation spot-check → scoreboard removal (last).

## Task Queue

- [x] Wave 1 doc 1 — `wumenguan` re-keyed to T2005 (PR #29, merged 2026-09-10)
- [ ] Wave 1 doc 2 — `biyanlu_cases` re-key to T2003 (prompt 001, dispatched 2026-09-11)
- [ ] Wave 1 doc 3 — `linji_yulu` (10 content flags + fate of sections 67–73 retellings + 73 titles)
- [ ] Wave 1 doc 4 — `xinxin_ming` (12 flags; adopt T2010 recension or document printed edition per field)
- [ ] Wave 1 doc 5 — `platform_sutra` (decide recension policy FIRST: T2008 宗寶 vs Dunhuang T2007; 9 flags + titles)
- [ ] Post-remediation evidence pass — new dated register overlay + validator merge; flips wumenguan/biyanlu statuses. Scope after Wave 1.
- [ ] Visual-system reset (owner direction in HANDOFF.md §3: English-first, walnut-hall, "too plain" feedback)
- [ ] W2 — verified-quotation spot-check (177 slots vs public-domain editions; Senzaki & Reps 1934 first; needs sandbox network)
- [ ] Waves 2–4 remediation per REMEDIATION_PLAN §2 (misattributed / wholesale-failure / no-CBETA-witness docs)
- [ ] Scoreboard removal PR (owner decision 2026-09-09; last, per owner-confirmed order) — delete `.scoreboard/` + `SCOREBOARD.md`, update AGENTS.md + PR template contract
- [ ] Frozen (owner): PR-A real-browser verification, PR-B CSP hardening, PR-D performance
- [ ] Not agent work: rights review (14 sources), `.github/workflows/*` edits (owner approval), branch-protection confirmation (owner/GitHub UI)

## Interrupted Work

(none yet — no expired agents this generation)

## Deferred / Technical Debt

- `biyanlu_cases` English `ai_literal` re-rendering where re-keyed zh meaning diverges (PR 001 records the list; separate editorial task)
- `biyanlu_cases` 86 `title_zh` metadata flags (71 SHORT_UNMATCHED, 11 NOT_FOUND, 4 TITLE_COMPOSITE) — separate composite-title plan item; touches `app.js` + smoke guards
- Post-remediation evidence pass (status flips) — deliberately separate per wumenguan precedent
- Congronglu reintroduction — quarantined 2026-08-10; blocked on source-pinned field-level collation; do NOT restore
- W1 work-order figure note: "42 flagged" = content fields only; the register's total for biyanlu is 128 (86 title metadata)
- Known gaps (from main's STATE.md): no real-browser design evidence; branch protection on `main` unconfirmed (403); 30/30 lineage edges `traditional_link_pending_exact_locator`; `schemas/` is declarative only, the Python validator is the enforced contract

## Architectural Invariants

Binding on every prompt (from `main`'s STATE.md "Architectural Invariants" + owner decisions):

1. Never generate source-looking Classical Chinese. Corpus text comes only from recorded authoritative sources.
2. N/N representation never establishes completion; the validator is the spec.
3. Edition verification ≠ rights approval; tracked separately everywhere.
4. Internal identifiers stay (`translatechan_*`, `window.TranslateChan`, `TRANSLATECHAN_DATA`); public brand "Fake Chan Factory"; humor-forward tone stays.
5. Public scope is exactly 5 rooms (Reader, Matrix, Lineage, Gong'an, Lexicon), smoke-guarded; Translation Studio / Arena Agents / header GitHub link stay out.
6. No edits to `.github/workflows/*` without explicit owner approval; `user_score` fields are never inferred, invented, or changed.
7. Pipeline order is fixed: `data/` → `validate_data.py` → `project_metrics.json` → `build_data_bundle.py` → root assets + byte-identical `/docs` mirror. All five quality gates pass before every push.
8. Durable memory lives in repo files; dated evidence in `sessions/` is immutable.

Plus this generation (v3.2 protocol): orchestrator branch never merges; task prompts
travel as files on the orchestrator branch with short dispatch stubs; one agent at a
time per repo unless provably disjoint; PRs come from coders via the operator; this
orchestrator advises MERGE / REVISE / DO-NOT-MERGE and never merges.

## Known Gaps

- Agent-sandbox network to `github.com/cbeta-org/xml-p5`: worked for PR #29 (2026-09-10); prompt 001 sub-task 1 verifies and halts on failure.
- Branch protection on `main` unconfirmed (integration endpoint 403).
- Real-browser evidence unavailable in audit environments (Chromium `ECONNRESET`, 2026-08-11).
- `main`'s STATE.md "Next planned task" line still says visual-system reset even though PR #29 (remediation doc 1) already landed; owner confirmed (2026-09-11) the actual order is remediation continuation first. That line will be corrected when a PR updates the canonical tracker.

## Review Log

| Date | Prompt seq | PR | Verdict | Notes |
|---|---|---|---|---|
| 2026-09-11 | 001 | — | — | Dispatched; awaiting PR hand-back |
