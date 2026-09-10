# Orchestrator Working State

> Orchestration-local bookkeeping for session `arena/01a08c93-translatechan`.
> Agents never see this file unless told to fetch it. It is NOT canonical:
> the canonical project tracker is `ROADMAP.md` on `main`, plus the legacy
> coordination file `.orchestrator/STATE.md` on `main` (updated via agent PRs).

## Orchestrator Branch
`arena/01a08c93-translatechan` — distribution channel only. Never merges.
Never a base branch. Agents fetch prompts from it via a named ref.

## Canonical Project Tracker
`ROADMAP.md` on `main` (project roadmap/status) + `.orchestrator/STATE.md` on
`main` (task queue, standing decisions, invariants). Both are agent-editable
via PRs; `.orchestrator/REMEDIATION_PLAN.md` on `main` is the adopted
R-A/R-B/R-C work program.

## Published Task Prompts
| Seq | Prompt path | Task | Agent branch | PR | Status |
|---|---|---|---|---|---|
| 001 | `.orchestrator/prompts/001-rekey-wumenguan-t2005.md` | Wumenguan R-A re-key (70 flagged fields) with mechanical acceptance | arena/01a08caa-translatechan | #29 | MERGE (revision verified) |
| 002 | `.orchestrator/prompts/002-wumenguan-revision-case5-glyphs.md` | PR #29 revision: case-5 witness glyph + rare-glyph pinyin readings | arena/01a08caa-translatechan | #29 | Fulfilled (revision landed on #29; agent documented platform reason) |

## Active Milestone
Wave 1 remediation: wumenguan done pending merge of PR #29 (review verdict
MERGE, 2026-09-10). Next: biyanlu_cases (Wave 1, doc 2).

## Task Queue
- [x] PR #23 review — verdict DO-NOT-MERGE (see Interrupted Work)
- [~] Wave 1: wumenguan re-key — PR #29 verdict MERGE (awaiting owner merge);
      close PR #23 after
- [ ] Wave 1: biyanlu_cases (42 flagged), linji_yulu (10 + titles), xinxin_ming
      (12), platform_sutra (recension decision first) — one doc per PR
- [ ] W2 verified-quotation spot-check (177 slots; Senzaki & Reps 1934 first)
- [ ] Scoreboard removal PR (owner decision 2026-09-09)
- [ ] Post-remediation: README/HANDOFF/ROADMAP claim rewrite, validator
      collation rule, new authoritative evidence register pass; also
      collate_refs.py `<g>`-content extraction improvement (see debt)
- [ ] PR-A/B/D (frozen until corpus integrity established)

## Interrupted Work
- **PR #23** `arena/01a08836-translatechan` @ `4f9c27c8` (2026-09-09):
  Wumenguan T2005 re-key. Independent mechanical verification (2026-09-10,
  this session) found: 65/70 flagged fields untouched; 4 zh fields are
  truncated register `ref_window` fragments copied verbatim (missing
  punctuation/characters, e.g. `破顏微` lacking 笑); 1 zh field corrupted
  (`cases[4].dialogue[0].zh` 香嚴→香嚹, matches no witness); 8 pinyin fields
  garbled or desynced from zh (`Nuō mǒu yī fénɡ rén yɛ`, `fán yǒo`,
  `tóngzɿ`); `coverage_note` falsely rewritten to "Complete —". Branch base
  predates PRs #25–#28 (GitHub: `CONFLICTING`). Verdict: DO-NOT-MERGE.
  Review comment posted on PR #23. Owner advised to close; superseded by
  prompt 001.
- Prior orchestrator branch `arena/01a08852-translatechan` (fetched as
  refs/remotes/origin/_prev_orch): contains only `.orchestrator/` files
  (PR24_REMEDIATION_TASK_PROMPT.md + older STATE/REMEDIATION_PLAN snapshots).
  Its STATE.md predates the 2026-09-10 correction overlay and quotes the
  superseded 637 figure. Do not treat it as current; `main`'s copy wins.

## Deferred / Technical Debt
- Register `ref_window` values are extraction windows, not copy sources:
  several are fragmentary (see `.preface.zh`, `.cases[5].dialogue[0].zh`,
  `.cases[22].commentary_zh` windows). Agents must re-key from the CBETA XML
  itself, never paste windows. Consider an evidence-quality follow-up.
- **`collate_refs.py` drops `<g>` element CONTENT** (not just markup), so the
  reference layer carries gaps where the witness has rare glyphs (T48n2005
  has 8 `<g>`-with-content spots). Consequence (now live in PR #29): a
  verbatim-witness corpus field (case 5, 口啣樹枝) is flagged MINOR 0.9804
  against the artifact ref. Post-remediation improvement: keep `<g>` text
  content in extraction (breaks all committed ref digests → belongs to the
  full evidence-refresh pass, never a per-doc PR).
- Rare witness glyph reading sources, now recorded in PR #29: 何故𦗚 =
  聻-variant, interrogative nǐ (廣韻 乃里切; 正字通 cites 「何故聻」; editions
  vary 聻/聾); 扇子𨁝跳 = ⿰𧾷孛 variant of 勃, bó (standard editions print
  勃跳). Reuse these sources for future documents; do not re-derive.
- Pinyin regeneration is unautomated and error-prone (PR #23 failure mode).
  Every remediation prompt must require hand-aligned pinyin + before/after
  listing in the PR description.
- `.orchestrator/STATE.md` on main: fixed by PR #29 (evidence-hardening
  marked merged PRs #25–#28; wumenguan queue entry updated).
- Review notes: PR #29 review used a detached worktree, which breaks
  `smoke_test.mjs`/`test_source_preservation.py` (they copytree `.git`,
  which is a file in worktrees) — always review-gate in a real clone.
- PR #29 revision landed on the PR's own branch rather than a new PR: the
  platform provisioned the revision session on `arena/01a08caa-translatechan`
  (the PR head). Future revision prompts should instruct: append commits to
  the existing PR branch if the platform provisions it, else a new PR — and
  never rewrite published history (verified: the revision was linear
  commits on the reviewed head; no rewrite occurred).

## Architectural Invariants
- Never generate source-looking Classical Chinese; re-key ONLY mechanically
  from the extracted CBETA witness (repo-wide rule).
- `complete` ⇔ `completion_status == complete_selected_witness` AND
  `source_review_status == collated_to_claimed_witness`. Wumenguan stays
  `partial_or_failed_w1_collation` until the evidence layer says otherwise.
- `scripts/test_source_preservation.py` ALLOWED_CHANGES is the CI-enforced
  change scope: every remediation PR extends it pointer-by-pointer and never
  moves BASE_COMMIT `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43`.
- Append-only evidence: never edit the 2026-09-09 or 2026-09-10 registers/
  reports; new evidence = new dated files.
- No edits to `.github/workflows/*` (owner approval required).
- Five quality gates before every push; pipeline order data → validate →
  metrics → build → mirror.

## Known Gaps
- CBETA refs (21 MB) live outside the repo; every collation-dependent agent
  must re-acquire per `scripts/collate_corpus.py` docstring and verify
  digests against `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`.
- No local evidence yet that the visual-system reset has a written spec
  (`.orchestrator/STATE.md` references it; no spec file exists on main).
  Do not dispatch until a spec exists.
- Branch protection on `main` unconfirmed (integration endpoint 403 per
  prior state).
