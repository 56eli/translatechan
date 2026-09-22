# Orchestrator Working State

## Orchestrator Branch
`arena/01a0ca9d-translatechan` — provisioned working branch, adopted as the orchestrator
distribution channel per v4.9.0 Phase 1 Step 8. Never merges. Only `.orchestrator/prompts/*` and
this file are published here.

Note: this repository historically committed prompt files to `main` (sequences 042–060 are on the
default branch). That is the predecessor's practice, not the branch model. New prompts are published
on this branch only; the `main` copies are left untouched as lineage.

## Continuation
Empty — new engagement. The Continuation line of the governing prompt carried the unchanged
placeholder. Predecessor traces were ingested as repo content (H-2), not resumed:
`arena/01a09829-translatechan` (PR #113), plus the working state and prompt history that PR left on
`main`.

## Canonical Project Tracker
`docs/PROJECT_STATE.md` (resolved once, Phase 1 Step 7). Legacy trackers `.orchestrator/STATE.md`,
`ROADMAP.md`, `HANDOFF.md` and `AUDIT.md` are historical evidence, not canonical.

## Governing Prompt
ORCHESTRATOR CORE v4.9.0 — GENERAL PURPOSE. **Not yet materialized.** The spec record required by
the *Initialization spec record* section (`orchestrator/ORCHESTRATOR CORE v4.9.0 — GENERAL
PURPOSE.md` + sha256 anchor in the canonical tracker) does not exist in this repository, and cannot
be written by me — it must land on `main` via an agent PR. Queued as task 063. Recorded under
`## Known Gaps` until then.

## Express Operator Authorizations (verbatim, recorded at the moment given)

- **2026-09-22, PR-authorship authorization.** Operator answer to the "PR open?" question, quoted
  verbatim: `"We can remove the declared-new-file ruling again if it is redundant. Give a
  recommendation.    Also open PR:"`. I read `Also open PR:` as express authorization, given in
  advance, for ONE specific pull request: the task-061 P0 re-green from branch
  `fix/p0-regreen-main-17-docs` into `main`. This authorization is cited in that PR's description.
  It does NOT extend to any other pull request, and it is NOT authorization to open a PR from the
  orchestrator branch — that branch still never merges.

## Published Task Prompts
| Seq | Prompt path | Task | Agent branch | PR | Status |
|---|---|---|---|---|---|
| 042–060 | `.orchestrator/prompts/` on `main` | Predecessor's series (P0 integrity → P3 lineage expansion) | various | #29–#113 | Historical — inherited, not re-dispatched |
| 061 | .orchestrator/prompts/061-p0-regreen-main-17-docs.md | P0 re-green `main`: re-pin 3 gates to the 17-doc corpus | fix/p0-regreen-main-17-docs | — | Amended then executed by the orchestrator under express authorization (see above), not dispatched to an agent |

Burned IDs: 042–060 inclusive. 043 and 045 were published as 0-byte stubs by the predecessor and
stay burned. Next free sequence: **062**.

## Active Milestone
P0 — restore a green `main`. PR #113 merged with a failing Quality check; three checkers carry pins
derived from the superseded 16-document tree while the corpus on `main` holds 17 documents.

## Task Queue
- [x] PR #113: P1 Biyanlu re-key, 17 docs — Merged 2026-09-22 **RED** (CI run 35774726598 failed at
      the source-preservation step; owner merged deliberately to hand a fresh orchestrator a
      "good enough" tree)
- [ ] 061: P0 re-green `main` — Dispatched, awaiting PR
- [ ] 062: Tier2 yulu lane — Guiyang (0/6 verbatim) + Fayan (1/11) currently R-B labels only; R-A
      re-key where a carrier exists. Blocked on 061.
- [ ] 063: Materialize `orchestrator/ORCHESTRATOR CORE v4.9.0 — GENERAL PURPOSE.md` + sha256 anchor
      in the canonical tracker + the mechanical `bin/orchestrator-check` (five checkable duties).
      Blocked on 061.
- [ ] Botrunner export lane — export schema work per `docs/ANSWERS_FOR_BOTRUNNER_2026-09-21.md`:
      stable passage ids, explicit `type`/`parent_id`/`order`, `lifecycle_status` tombstones,
      `export_manifest.json` checksums. Owner names this a co-priority with corpus work.
- [ ] Later: 31 lineage edges pending exact locator; W2 verified-quotation spot-check; real-browser
      verification (frozen, no evidence obtainable); rights review (human-only)

## Interrupted Work
- None. No agent branch is in flight; no pushed branch awaits a PR.

## Deferred / Technical Debt
- Congronglu front matter + 著語 apparatus, gongan indexing — open
- Caoshan Benji sibling T47n1987B — probe only, not merged
- Translations for the enthusiast full-witness records — human editorial sign-off pending
- 31/31 lineage edges `traditional_link_pending_exact_locator`
- Real-browser screenshot/accessibility evidence unavailable (Chromium ECONNRESET, 2026-08-11)
- Branch protection on `main` unconfirmed (403) — see Known Gaps; PR #113 merging red is evidence
  that required checks are not enforced
- JSON Schema is declarative only; `scripts/validate_data.py` is the enforced contract
- Rights review — every `rights_manifest.json` source awaits human/jurisdiction review

## Scope Boundaries
- Public Pages scope is exactly 5 rooms (Reader, Matrix, Lineage, Gong'an Index, Lexicon),
  smoke-guarded. Translation Studio, Arena Agents and a header GitHub link stay out.
- Never generate source-looking Classical Chinese — only pinned, digest-verified CBETA witnesses.
- Never edit `.github/workflows/*` without owner approval; `OPERATIONS.md` is the sole register.
- OUT-OF-CBETA sourcing (the 31-document queue) is human work only — Ruling 4, 2026-09-12.
- Representation count never establishes completion — only explicit `completion_status` counts.
- `docs/` data and bundle files are generated; never hand-edited. Hand-written `docs/*.md` prose is
  edited normally.
- Never edit a checker to make a gate pass — when gate and prose disagree, the prose is wrong.
  Task 061 carries the single narrow, explicitly-authorized exception: re-pointing stale pins at
  values the manifest already declares authoritative, with no assertion weakened.
- Never re-point a withdrawn false witness claim at an unverified candidate — Ruling 3.

## Architectural Invariants
- Pipeline order fixed: `data/` → `validate_data.py` → `project_metrics.json` →
  `build_data_bundle.py` → root assets + byte-identical `/docs` mirror → Pages publishes `main/docs`.
- Six gates plus the artifact diff pass before every push (`GATE.md`).
- Gate execution: unprivileged, disposable, read-only, stdlib-only, Python 3.11 floor (CI pins 3.12).
  Every manifest file sha256-verified; a manifest nobody verifies proves nothing.
- Determinism: `build_data_bundle.py` twice must produce byte-identical `app_data.js` — currently
  8,143,477 B, sha256 `937e5467fefe661773f4c0ad5397399963612794d5becf341865d0bee242071b`.
- Source preservation: corpus byte-compared against `BASE_COMMIT`
  `f1207eaf461889d8819a9287904bdfaf354a3018`, which is **permanent**. Corpus growth is admitted only
  via a `DECLARED_NEW_CORPUS` registration with dated evidence prose. Owner asked 2026-09-22 whether
  this "ruling" was redundant; my recommendation: it IS redundant as a *new* decision (the mechanism
  has existed and been used for 9 documents since 2026-09-20), so task 061 records it in the tracker
  as a pre-existing invariant rather than announcing it as a fresh ruling. The behaviour is unchanged
  either way.
- Completion rule: complete ⇔ `complete_selected_witness` + `collated_to_claimed_witness` +
  unit_targets met.
- Witness rule: cite no work as a text's witness unless ≥1 evaluated content field matches it.
- R-A/R-B/R-C: R-A re-key verbatim where a carrier exists; R-B label as project retelling where not;
  R-C human work for OUT-OF-CBETA.
- Internal identifiers stay: `translatechan_*`, `window.TranslateChan`, `TRANSLATECHAN_DATA`; public
  brand "Fake Chan Factory"; the humour-forward tone is load-bearing, not decoration.
- `sessions/` is append-only — dated evidence is never edited or deleted.
- Documentation is under test: `validate_data.py` enforces ~25 doc-truthfulness rules across
  `README.md`, `HANDOFF.md`, `AUDIT.md`, `ROADMAP.md` and `index.html`.

## Known Gaps
- **Governing prompt not materialized.** No `orchestrator/` directory, no sha256 anchor in the
  canonical tracker. v4.9.0 rule 5 treats an absent anchor as a mismatch; the prescribed recovery is
  re-materialize *and record*. Cannot be done from this branch — queued as task 063.
- **No mechanical compliance checker** (`bin/orchestrator-check` or equivalent) covering the five
  checkable duties. Also task 063.
- **Branch protection on `main`: RESOLVED 2026-09-22 — there is none.** `gh api
  repos/56eli/translatechan/branches/main` returns `"protected": false`,
  `protection_url: null`, `required_status_checks.enforcement_level: "off"`, and
  `gh api repos/56eli/translatechan/rulesets` returns `[]`. The historical "403" note was a red
  herring: the 403 is only on the *protection-settings* endpoint, which the Arena bot token cannot
  read; the public branch object answers the question without it. So PR #113 did not bypass a gate —
  no gate exists. Nothing blocks a red merge today. Owner decision pending on whether to enable a
  required `Quality` check.
- No real-browser evidence for any Pages work; the revamp awaits owner visual review.
- The 630 / 486 / 127 flagged-field figures each carry a different denominator and supersession
  date. The chain is documented but hostile to a newcomer; a successor will likely misread it.

## Hardening Log
| Date | Seq | Category | Symptom | Impact | Disposition | Hardening |
|---|---|---|---|---|---|---|
| 2026-09-22 | 113 | Repository | PR adding the 17th corpus document did not re-pin the three checkers carrying 16-doc counts and the authoritative register path; `main` merged red | `main` RED at handoff, 30 rule failures + preservation + smoke | Hardening candidate | Task 061 fixes it and lands the rule in `docs/PROJECT_STATE.md` §3: any PR changing document count / complete set / authoritative register re-pins all three checkers in the same PR |
| 2026-09-22 | 113 | Repository | `DECLARED_NEW_CORPUS` mechanism existed and was the owner's chosen policy, but `biyanlu_cases.json` was never registered in it | preservation gate red; looked like a policy gap, was an omission | Scoped | Inlined as a Confirmed Fact in 061 §4 so the next worker does not re-litigate the policy |
| 2026-09-22 | 057 | Prompt | Predecessor pinned a task base to a fixed SHA that `main` had already moved past | blocked ~10 min, forced a rebase | Hardening candidate | Adopted: prompts pin "current `main`" and state the measured document count, never a frozen SHA |
| 2026-09-22 | 057 | Environment | Shallow clone with no merge-base between the arena branch and `main` — merge refused as unrelated histories | blocked ~5 min | Scoped | v4.9.0 depth rule (`--depth 50` for anything merged) is in 061 §9 |
| 2026-09-22 | — | Tooling | `gh api .../branches/main/protection` returns 403 for the Arena bot token, which the repo had recorded for weeks as "branch protection unconfirmed" | ~3 min, but the wrong conclusion persisted in 3 docs | Hardening candidate | Use `gh api repos/<o>/<r>/branches/main --jq .protected` + `/rulesets` instead — both readable without admin scope. Carried into the tracker by task 061. |

[Bounded session-log: keep ~20 recent entries. `Deferred (needs owner decision)` entries are exempt
from the bound and are never evicted.]
