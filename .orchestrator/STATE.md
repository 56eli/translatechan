# Orchestrator State — Fake Chan Factory (`translatechan`)

> **Scope of this file:** the orchestrator's task queue and cross-session
> decisions only. The repository's own systems remain authoritative for agent
> contracts and scoring: [`AGENTS.md`](../AGENTS.md),
> [`.scoreboard/`](../.scoreboard/), [`HANDOFF.md`](../HANDOFF.md),
> [`AUDIT.md`](../AUDIT.md), and append-only [`sessions/`](../sessions/).
> Maintained as a repository coordination file; it is not tied to an unrelated branch.
> Agents update it as a PR deliverable **only** when the task prompt says so;
> the human operator may also edit it directly.

## Active Milestone

**W1 COMPLETE (2026-09-09), CORRECTED (2026-09-10) — full-corpus collation evidence landed and is now reproducible.** Historical record (append-only): `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries; the report's 637 figure is superseded and was never the register's arithmetic). Authoritative record: `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` + `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (35 documents — the 2026-09-10 overlay adds the Shitou Sandokai item the first run never mapped — 630 flagged entries) with `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`. Reference layer is now regenerable from the repository: `scripts/collate_refs.py` implements the extraction rule, pins CBETA XML P5 revision `dbdea41071e1e260ad84b72faefd4587333cf76d`, and verifies every reference digest (33 of 39 byte-identical to the 2026-09-09 manifest; the 6 drifted references change no document verdict). Verdict: only 1 of 35 documents collates 100% to its claimed witness; 22 have no collating source-content field at all (the 2026-09-09 report's tier table narrated 27 under a different denominator); verified fabrications exist inside both former `complete_selected_witness` texts (Wumenguan preface/epilogue/verses, case-23 pointer); Zhaozhou's canonical claim (T1987) is false (T1987 = Caoshan) and the corpus record still carries it — re-pointing is R-A work, deliberately not done here. Title/name metadata is excluded from the content denominator (391 metadata fields measured separately), so `collated_to_claimed_witness` never claims excluded metadata was collated.

**W1 public status model integrated (2026-09-09, current work):** every manifest item now carries one of the exact source-review states `collated_to_claimed_witness`, `partial_or_failed_w1_collation`, or `witness_unavailable`; W1 report/register paths and evidence date are recorded at manifest level; completion/status incompatibilities are rejected; the Reader exposes the state visibly. This is a containment/remediation state, not a rights decision. No corpus source text was re-keyed. Per-document source remediation remains pending.

**Next planned task:** visual-system reset (separate from this containment/status-model work; do not begin it in this PR).

**Next (after the visual-system reset, in order):**
1. REMEDIATION under the adopted hybrid policy: R-A where authoritative witness text is available; R-B for retained project retellings with witness claims removed; R-C for material that cannot responsibly be sourced or relabeled. Per-doc work remains keyed to register entries.
2. W2 — spot-check the 177 "edition-verified quotations" vs public-domain editions (Senzaki & Reps 1934 first; fetchable via Archive.org if network allows).
3. Then scoreboard-removal PR + PR-A/B/D per earlier queue.

Reference state: extracted CBETA refs live OUTSIDE the repo (21 MB, never committed). Reproduce the authoritative register byte-for-byte with `COLLATION_REFS=<refs> python3 scripts/collate_corpus.py --out /tmp/register.json --reproduce sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (register sha256 `5369af1163e55eb25e2695160a0ec04805efc13a606841a6d6cb19b1936d3d31`, refs manifest sha256 `f3ac90b2ae9c7b969f157185d83651bcb00c24e535a0ef1f5ac143c4aa8174a9`); `--reproduce` replays the `generation_parameters` block the register itself records. The rule that produces them is committed: `python3 scripts/collate_corpus.py --print-refs` lists the works, `scripts/collate_refs.py` extracts + verifies them against a digest manifest, and `scripts/collate_corpus.py` collates on top of them (`--refs-manifest`, `--compare-historical-refs`, `--require-verified-refs`). Full command sequence: `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` §7.

## Standing Decisions (2026-09-09, owner)

- **Vision:** vision.md in full is the target; the audit serves that ambition.
- **Collation depth:** FULL — done (except 2 non-CBETA-witness docs: hanshan, niutou).
- **Scoreboard: REMOVE** `.scoreboard/` + `SCOREBOARD.md` entirely; orchestrator oversight replaces it (queued PR after W1/W2; update AGENTS.md contract accordingly; user_score protocol dies with the file).
- **Sequencing:** W1 evidence is now integrated into the public status model; per-document remediation remains pending. The visual-system reset is the next planned task; W2 and PR-A/B/D remain separate, with PR-A/B/D frozen.

## Task Queue

- [x] **Lineage corpus-key curation (6 profiles)** — integrated in the current baseline
- [x] **W1 — Full-corpus collation vs CBETA** — evidence is recorded in the immutable report/register
- [~] **W1 public status-model containment** — manifest statuses, validator guards, Reader disclosure, and current documentation integrated in the working tree; per-document source remediation remains pending
- [ ] **Visual-system reset** — next planned task after this containment/status-model work
- [ ] **REMEDIATION hybrid policy**: per-doc work packages in `.orchestrator/REMEDIATION_PLAN.md`; delegate to coder agents, one document per PR
- [ ] **W2 — Verified-quotation spot-check** (177 slots vs public-domain editions; Senzaki & Reps 1934 first) — sequencing at successor's discretion (before or parallel to remediation)
- [ ] **Scoreboard removal PR** — delete `.scoreboard/` + `SCOREBOARD.md`; update AGENTS.md contract (owner decision 2026-09-09)
- [ ] **PR-A — Real-browser verification pass** (frozen during audit; resume after remediation starts)
- [ ] **PR-B — CSP hardening** (frozen) · **PR-D — Performance, measure-first** (frozen)
- [ ] Later tranche — 30 lineage edges exact-locator groundwork
- [ ] Later tranche — Biyanlu / Linji / Platform / excerpt-seed field-level source review (fold into R-A packages)

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

- Per-document source remediation remains pending under the adopted hybrid R-A/R-B/R-C policy; the public status model prevents unsupported completion claims from being presented as verified and does not re-key source text.
- Real-browser screenshot/accessibility evidence for the current design is unavailable (Chromium network failure `ECONNRESET` in the 2026-08-11 session); do not describe the design as screenshot-verified.
- Branch protection on `main` unconfirmed (integration endpoint returns 403).
- 30/30 lineage edges remain `traditional_link_pending_exact_locator`; lineage corpus-key curation is complete for the recorded six-profile scope, while later exact-locator work remains.
- JSON Schema in `schemas/` is declarative only; the Python validator is the enforced contract.
