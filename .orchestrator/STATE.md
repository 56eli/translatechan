# Orchestrator State — Fake Chan Factory (`translatechan`)

> **Scope of this file:** the orchestrator's task queue and cross-session
> decisions only. The repository's own systems remain authoritative for agent
> contracts and scoring: [`AGENTS.md`](../AGENTS.md),
> [`.scoreboard/`](../.scoreboard/), [`HANDOFF.md`](../HANDOFF.md),
> [`AUDIT.md`](../AUDIT.md), and append-only [`sessions/`](../sessions/).
> Maintained by the orchestrator on branch `arena/01a087e2-translatechan`.
> Agents update it as a PR deliverable **only** when the task prompt says so;
> the human operator may also edit it directly.

## Active Milestone

**W1/W2 — Full corpus authenticity collation against official CBETA** (user directive 2026-09-09: W1/W2 exclusively first). Interim evidence: `audit-w1/REPORT_W1_INTERIM.md` (orchestrator workspace; final report to land in `sessions/` via PR). Interim verdict: **the "source-tracked" claim does not hold — fabrication suspects and witness misattributions exist even in the two `complete_selected_witness` texts** (Wumenguan, Xinxin Ming). Reference library acquired: 174 official CBETA texts (T45/T47/T48/T51) + collation harness in `audit-w1/`. Remaining: fix harness containment/title/REWORDED bugs, acquire X-collection + Dunhuang witnesses, itemize every non-collating field, then remediation PRs.

Previous milestone (superseded): lift 7.2/10 → gate 8.0 via small evidence-backed PRs. PR-C (lineage corpus keys) reviewed MERGE-approved, awaiting user merge (PR #20).

## Standing Decisions (2026-09-09, owner)

- **Vision:** vision.md in full is the target; the audit serves that ambition.
- **Collation depth:** FULL — 100% of source Chinese fields, all documents.
- **Scoreboard: REMOVE** `.scoreboard/` + `SCOREBOARD.md` entirely; orchestrator oversight replaces it (queued PR after W1/W2; update AGENTS.md contract accordingly; user_score protocol dies with the file).
- **Sequencing:** W1/W2 exclusive until corpus integrity is established. PR-A/B/D frozen.

## Task Queue

- [ ] **PR-C — Lineage corpus-key curation (6 profiles)** — *next; prompt issued 2026-09-09*
- [ ] **PR-A — Real-browser verification pass**: obtain Chromium, capture desktop/mobile × light/dark evidence of the merged design, fix what surfaces, extend `scripts/browser_test.mjs` only as needed
- [ ] **PR-B — CSP hardening**: remove the 41 JS-generated inline styles in `app.js` → drop `style-src 'unsafe-inline'` from `index.html`/`docs/index.html`
- [ ] **PR-D — Performance (measure first)**: benchmark first-load; lazy-render hidden rooms / split bundle only if measurements justify it (audit's explicit precondition)
- [ ] Later tranche — 30 lineage edges exact-locator groundwork
- [ ] Later tranche — Biyanlu / Linji / Platform / excerpt-seed field-level source review

## Deferred / Technical Debt

- **Congronglu reintroduction** — quarantined 2026-08-10 (generated source-looking placeholders). Blocked on source-pinned field-level collation from authoritative T48n2004 TEI. Do not restore.
- **`.github/workflows/quality.yml` artifact-diff gaps** (4 mirrored assets missing) — documented in [`.scoreboard/manual-workflow-edits.md`](../.scoreboard/manual-workflow-edits.md). Owner approval withheld 2026-09-09; remain blocked.
- **Rights review** — all 14 `rights_manifest.json` sources await human/jurisdiction review. Human decision; not agent work. Edition verification never implies rights approval.

## Architectural Invariants

1. **Never generate source-looking Classical Chinese.** Corpus text comes only from recorded authoritative sources (HANDOFF.md §8 workflow).
2. **N/N representation never establishes completion** — only explicit editorial `completion_status` counts; the validator is the spec.
3. **Edition verification ≠ rights approval**; both are tracked separately everywhere.
4. **Internal identifiers stay**: `translatechan_*` localStorage keys, `window.TranslateChan`, `TRANSLATECHAN_DATA`; public brand is "Fake Chan Factory". Humor-forward tone stays.
5. **Public scope is exactly 5 rooms** (Reader, Matrix, Lineage, Gong'an, Lexicon), smoke-guarded; Translation Studio / Arena Agents / header GitHub link stay out.
6. **No edits to `.github/workflows/*` without explicit owner approval**; `user_score` fields in the scoreboard are never inferred, invented, or changed.
7. **Pipeline order is fixed**: `data/` → `validate_data.py` → `project_metrics.json` → `build_data_bundle.py` → root assets + byte-identical `/docs` mirror. All five quality gates pass before every push.
8. **Durable memory lives in repo files**, not chat; dated evidence in `sessions/` is immutable.

## Known Gaps

- Real-browser screenshot/accessibility evidence for the current design is unavailable (Chromium network failure `ECONNRESET` in the 2026-08-11 session); do not describe the design as screenshot-verified.
- Branch protection on `main` unconfirmed (integration endpoint returns 403).
- 30/30 lineage edges remain `traditional_link_pending_exact_locator`; 6 profiles had empty `linked_corpus_keys` as of 2026-09-09 (PR-C addresses this).
- JSON Schema in `schemas/` is declarative only; the Python validator is the enforced contract.
