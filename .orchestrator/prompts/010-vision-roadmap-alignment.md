# Task 010 — Align the vision and roadmap documents to the measured status quo

Working in `56eli/translatechan`. Owner directive 2026-09-12: *"update all documentation to the status quo and
align the project with the vision of perfection of source integrity, referencing and presentation in its
stated goals."* This is step 1 of 3: the **aspirational** documents (`vision.md`, `ROADMAP.md`,
`RESEARCH_RELEASE_PLAN.md`). Steps 2–3 (the gated status documents, then the reader's note rendering) are
separate PRs and must not be folded in here.

---

## 1. Mission

Three documents describe what the project intends to be. Two of them now describe a project that no longer
exists — not because the code moved, but because these files were never updated across the whole Wave 1
integrity campaign. **No top-level document in the repository mentions any of PRs #29–#37**, which are seven
merged work packages and the entire source-integrity story the vision asks for. Your job: make these three
documents state today's measured reality *inside* the vision's own frame, so the ambition and the ledger
agree.

**Do not soften the vision.** The instruction is alignment, not retreat: where the project still fails an
objective, say so precisely and keep the objective stated at full strength.

## 2. Base check — report before editing

```bash
git rev-parse --abbrev-ref HEAD   # YOUR pre-provisioned arena/* branch. Never create a branch, never push main.
git rev-parse --short HEAD        # main at or after 29abad7 (the merge of #37)
git status --porcelain            # empty
```
Before pushing: `git diff --name-status refs/remotes/origin/main HEAD` must show **only** the three paths
in §7 — and **any `A` on a `.scoreboard/**` path means your workspace was reset onto a stale base: fetch,
`git reset --hard` onto your own remote branch tip, re-apply, re-check.** This repo deleted the scoreboard in
#31; resurrecting it via a mis-based commit is the known failure mode here.

## 3. The measured status quo — verify each figure with the given command, then cite it

Do not copy these numbers; run the command, and report any row where reality differs (a difference is a
finding about my prompt, not about the repo).

| claim | verify with | current value |
|---|---|---|
| corpus documents | `ls data/corpus/*.json \| wc -l` | **35** |
| all are still incomplete | `python3 -c "import json;m=json.load(open('data/project_metrics.json'));print(m['corpus']['incomplete_documents'],m['corpus']['excerpt_seed_documents'])"` | **35 incomplete, 31 excerpt seeds** |
| W1 authoritative aggregate | `python3 -c "import json;print(json.load(open('data/project_metrics.json'))['corpus']['source_review']['authoritative'])"` | `flagged_entries: 630`, `evidence_date 2026-09-10`, register `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` |
| field-level state | same `source_review` block, `documents` | **593 of 924 content fields collate; 22 documents have no collating content field; 391 metadata fields measured separately** |
| CJK volume | `python3 -c "import json;m=json.load(open('data/project_metrics.json'))['corpus'];print(m['content_cjk_characters'],m['all_corpus_cjk_characters'])"` | **104,564 / 110,165** |
| manifest statuses | `python3 -c "import json,collections;m=json.load(open('data/corpus_manifest.json'));print(collections.Counter(i['source_review_status'] for i in m['items']))"` | **1 collated, 32 partial/failed, 2 unavailable; 0 complete** |
| Wave 1 remediation actually done | `gh pr list --state merged --limit 12` | #29 wumenguan, #30 biyanlu, #32 linji, #34 xinxin_ming, #35 platform_sutra (labelled), #36 inventories, #37 Phase-2 plan |
| integrity evidence set | `ls .orchestrator/WITNESS_INVENTORY*.md .orchestrator/PHASE2_PLAN.md` | 3 inventories (35 docs) + Phase-2 plan |

**The one number you must handle with care.** `630` is the count of flagged source fields *in the published
authoritative register* and is quoted, verbatim-pinned, by `scripts/validate_data.py` in `README.md`,
`AUDIT.md`, `HANDOFF.md`, `ROADMAP.md` and `.orchestrator/REMEDIATION_PLAN.md`. A fresh collation of current
`main` yields **532**, because #29/#30/#32/#34 removed flags and no new register has been published since.
So: keep `630` whenever you mean "the authoritative register", state `532` whenever you mean "today's data
as measured", and **never** present the drop as a completion claim. Record it as the standing consequence of
"a post-remediation evidence pass is still owed" — that is exactly what `PHASE2_PLAN.md` queues. If these
two framings are not clearly separated, a reader will mistake reduced flags for a finished corpus, which is
the single misreading this whole campaign has been fighting.

## 4. `vision.md` — corrections required

1. **`Congronglu` is not in the corpus.** It appears in the §2 taxonomy ASCII diagram, in the T48 volume
   table row, and in a checklist item ("all 100 cases of *Congronglu*"). It was removed from the active bundle
   after the 2026-08-10 audit found uncollated generated placeholders and false case/page claims, and it
   remains **quarantined by standing owner decision**. Do not delete the ambition — mark it: state that the
   work is a named goal, that the seed was removed for source-integrity reasons, and that reinstatement
   requires a collated witness. A reader must not be able to conclude the corpus holds 100 Congronglu cases.
2. **The public scope is exactly five rooms.** Any text implying more surface than that must say so
   explicitly. (Verifying command: count the rooms in `index.html` / `app.js`; report what you find.)
3. **Objective 4 ("Source Verification & Disclosure Workflow") gets a status paragraph.** Quote its own
   words — *primary-source locators, book/edition references, page-or-section states, rights records, and
   hover/focus/touch citation details* — and mark each element honestly: what exists (canonical locators,
   per-document W1 status, provenance notes in the data, witness digests, the refs manifest, the collation
   harness), what partially exists (rights records: `data/translations/rights_manifest.json` carries
   `policy` + `sources` with human review, not per-item entries), and what does **not** render yet (per
   task 011: most `editorial_note`/`recension_note` labels exist in data but are not displayed). This is the
   most important paragraph you will write, because it converts an aspiration into a checked list.
4. Keep the document's declared character: it is *aspirational with a current public-scope note*. Add the
   "as of" date and point to `AUDIT.md` for measured status, as the header already promises.

## 5. `ROADMAP.md` — corrections required

- The milestone diagram's statuses (`100% / ~30% / ~20% / ~40% / Planned`) are 2026-08-08-era. Re-derive each
  from measurement and update with one line of justification per phase; do not inflate. Phase 4 (Source
  Verification & Disclosure) has moved the most — it now has a witness-pinned collation harness, 35
  inventoried documents, 22 provenance labels, and 5 re-keyed/labelled documents — and it also has an
  explicit unfilled gap (task 011). Give both.
- **`ROADMAP.md` is inside the gate-scanned set, partially.** It must keep the five-ledger sentence and the
  W1 evidence figures verbatim (§3's caution) — but *not* the three `status_scope` / `non_approval_statement`
  / `metadata_field_note` sentences, which the rule requires only of README/AUDIT/HANDOFF. Their absence from
  `ROADMAP.md` is by design; do not "fix" it. Its per-line rules do apply — a line containing
  `T1987` must also contain `false` or `Caoshan`, and `174` may only appear labelled as the superseded
  2026-09-09 report figure. Check with `grep -n "T1987" ROADMAP.md` before you finish.
- Add a dated "Wave 1 integrity campaign" section: the 5 documents, their PRs, the three inventories, the
  Phase-2 plan, and the honest statement that representation ≠ completion.
- If a phase status is a percentage, state what it is a percentage **of** and how it was measured. A bare
  `~40%` with no denominator is the genre of claim this repo is busy eliminating.

## 6. `RESEARCH_RELEASE_PLAN.md` — corrections required

It repeats the `Congronglu` coverage goal (3 mentions). Apply the §4.1 treatment. Then add to its
release-blocking checklist, verbatim in intent: (a) the post-remediation evidence pass (a new register, so
630 can become an honest current figure); (b) label visibility in the reader (task 011); (c) the owner's
fabricated-text policy decision (`PHASE2_PLAN.md` → `## Owner decision required`); (d) the human-sourcing
queue of 31 documents with `OUT-OF-CBETA` witnesses, marked **not agent-authorisable**.

## 7. Allowed paths (hard scope)

```
vision.md
ROADMAP.md
RESEARCH_RELEASE_PLAN.md
```
Nothing else. No `data/**`, no `docs/**`, no `app.js`, no `index.html`, no `app.css`, no `scripts/**`,
no `.orchestrator/**`, no `README.md`/`AUDIT.md`/`HANDOFF.md`/`AGENTS.md`/`OPERATIONS.md`/`UX_ROADMAP.md`/
`WEB_VISION_2026-08-10.md` (steps 010b/011 own those), nothing under `.github/`. Your three files are prose
outside the corpus, so **no CJK metric, artifact or manifest may move** — if `docs/` or `app_data.js`
changes at all, you ran something you shouldn't have.

## 8. Gates — all must exit 0, in a real clone (never a `git worktree`)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
git diff --exit-code -- app_data.js docs data
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
diff -rq data docs/data
git diff --check
```
No `--write-metrics`: you change no data, so there is nothing to re-measure, and writing metrics would
signal you did. `--skip-docs` is never permitted. If a doc-truthfulness error names one of your three files,
fix **your prose**; if it demands an edit to a forbidden path, stop and report — do not cross §7.

## 9. Commits, PR body, report

```
1. docs: align vision.md to the measured status quo (Congronglu, public scope, objective 4 checklist)
2. docs: re-derive ROADMAP phase statuses and record the Wave 1 integrity campaign
3. docs: update the release plan's blocking checklist to the open Phase-2 items
```
PR body: base SHA; the §3 table with **your** measured value beside each claim; a short "what I deliberately
did not soften" note (the vision's objectives stay stated at full strength); the 630/532 framing you used,
quoted; every §8 command with its exit status; `git diff --name-only`; and one line confirming no data,
artifact or gate script changed. Cite PR numbers only after reading them back (`gh pr view --json number`) —
**no `#NN`**. Open against `main` and **stop**; the operator merges personally.

## 10. Stop-and-report conditions

`main` has moved so a §3 row is already stale; a §4/§5 claim turns out to be true as written (then say so and
leave it — do not manufacture a change to have something to commit); a gate demands an out-of-scope edit;
or you disagree with the 630/532 handling (argue it in the PR body, do not silently pick your own rule).

## 11. Definition of done

A newcomer reading these three files can state, without opening `data/`: what the corpus is (35 documents,
0 complete, 31 seeds), what the integrity campaign did (5 documents, 7 PRs, 3 inventories), what remains
(evidence pass, label visibility, owner decisions, human sourcing), and where each claim is checkable. And
the vision's own ambitions — including Congronglu and the full disclosure workflow — are still named as goals,
now with their true distance to completion attached.
