# Task 067 — P2: Botrunner export schema — design document only, no implementation

## 0. FETCH AND VERIFY

You should already have this file at `/tmp/task.md`. If not, fetch it:

    git fetch --depth 1 origin +arena/01a0ca9d-translatechan:refs/remotes/origin/_orch
    git show refs/remotes/origin/_orch:.orchestrator/prompts/067-p2-botrunner-export-schema-design.md > /tmp/task.md

Read it from `/tmp`. Rules:

- Do NOT use `origin/arena/01a0ca9d-translatechan` (single-branch clones do not create that ref).
- Do NOT use `FETCH_HEAD` (your next fetch of `main` overwrites it).
- Do NOT `git checkout` orchestrator paths into the worktree. Read with `git show` into `/tmp` only.
- Never commit this file. Never push to the orchestrator branch.
- If the file is empty, or its first line is not
  `# Task 067 — P2: Botrunner export schema — design document only, no implementation`,
  HALT and report.

### Premise measured at `b8472bd69568e961c89935bd47e8a3cc83265270`

```bash
git fetch --depth 50 origin +main:refs/remotes/origin/main
git merge-base --is-ancestor b8472bd69568e961c89935bd47e8a3cc83265270 origin/main \
  && echo "premise intact" || echo "PREMISE MOVED — re-verify before working"
```

If this work is already present on `main`, **HALT AND REPORT**.

### Mandatory branch note

PR **#115** on `fix/p0-regreen-main-17-docs` is **out of bounds**: never push to it, check it out,
rebase onto it, cherry-pick from it, comment on it, close or merge it. Branch from `origin/main` only.

---

## 1. TASK TITLE AND SCOPE

Produce **one design document** specifying the botrunner export schema. **Write no exporter, generate
no export, change no data.** ONE pull request, and its only substantive artifact is a document.

`main` is GREEN and must stay green.

**Why design-only:** the export shape determines stable public identifiers for every passage in the
corpus. Once botrunner publishes against them, changing an id breaks idempotency downstream and
orphans pages. The id scheme is cheap now and expensive later. The owner rules on the mapping before
anyone writes an exporter.

---

## 2. REQUIRED READING ORDER

Read all four botrunner documents **first** — they contain the consumer's stated requirements and
the prior assessment. Do not re-derive what is already settled there.

1. `docs/TC_EXPORT_CONSUMER_ASSESSMENT_2026-09-21.md` — the gap analysis, requirements R1–R12. This
   is your primary input.
2. `docs/ANSWERS_FOR_BOTRUNNER_2026-09-21.md` — answers already given, including Q7/W3.
3. `docs/BOTRUNNER_REVIEW_2026-09-21_LAW.md` — the law governing this lane.
4. `docs/BOTRUNNER_REVIEW_2026-09-21_PURGED.md`.
5. `docs/PROJECT_STATE.md`, `GATE.md`, `AGENTS.md`.
6. The actual shapes you are describing: `data/corpus_manifest.json` (note `items` is a **list**),
   `data/project_metrics.json`, and two contrasting corpus documents, e.g.
   `data/corpus/wumenguan.json` and `data/corpus/chuandenglu_full.json`.

---

## 3. PROJECT CONTEXT AND OWNER VISION

Corpus work and **providing material to the botrunner project** are **co-priorities**, not a main
line and a side quest. Botrunner publishes to a BookStack instance whose hierarchy is
**Shelf → Book → Chapter → Page**, one level only. Already settled: **work = Book, fascicle =
Chapter, passage = Page**, and the wiki receives **only 100%-collated material**.

This corpus's honesty rules travel with the data. An export that drops `w1_status`, coverage notes,
or provenance labels would publish unlabelled retold text to a public wiki — the worst defect this
project can ship. The schema must make that structurally impossible.

---

## 4. CONFIRMED FACTS — from the assessment, verify against the data

Gaps the assessment identifies (R-numbers are its own):

- **R1 gap** — lineage edges have no explicit immutable id; they are matched by `(teacher, disciple)`
  pair, which breaks idempotency if an edge is split or retracted.
- **R2 gap, the big one** — **passages have no stable ids; they are array indices.** Corpus JSON
  nests arrays (`sections`, `cases`, `dialogue`) with no id on any element. Array position is not an
  identifier: insert one case and every subsequent page is silently re-pointed. Also missing: an
  explicit `type` from a closed enum, an explicit `parent_id`, and an explicit `order` integer.
- **R3 gap** — corpus docs carry no machine-readable `w1_status`; status lives in `coverage_note`
  prose or must be inferred from `corpus_manifest`. The consumer needs code + label + optional
  explanation **as data**.
- **R5 gap** — no export-level version. Several per-file `schema_version` fields exist but nothing
  versions the export as a whole. The assessment recommends `export_manifest.json` with
  `schema_version`, `export_timestamp`, `commit` (`git rev-parse HEAD`), and a files list with
  checksums.
- **R6 gap** — gate exit codes are not documented for an external consumer.

Structure facts: `corpus_manifest.json` has top-level keys `schema_version`, `description`,
`source_review`, `items`; `items` is a **list of 17** dicts keyed by `key`. Current bundle:
`b68eb436ac8c847a0f92ec0dea8d0f74597aa8ee79778b5e5dfe8920bb9cdba7`, 8,143,493 bytes, 17 docs.

**Invariants:** never edit a checker to pass · `sessions/` append-only · `docs/` data+bundle files
generated, never hand-edited (`docs/*.md` prose is fine) · never edit `.github/workflows/*` ·
representation ≠ completion.

---

## 5. CORE OBJECTIVE

Specify an export contract precise enough that an implementer has no design decisions left, and
explicit enough that the owner can rule on the open questions without reading any code.

---

## 6. EXACT DELIVERABLES

### 6.1 `docs/BOTRUNNER_EXPORT_SCHEMA_2026-09-23.md`

One document. It must cover, each as its own section:

**(a) Stable passage identifiers.** Propose a concrete, human-readable, permanently stable scheme —
e.g. `wumenguan_case_01` — and specify exactly how an id is derived, for every structural shape in
the corpus (`sections`, `cases`, `dialogue`, stanzas). Include a worked example for a *simple*
document and a *nested* one, with real ids from the real data. State the rules: ids are **never
reused**, **never renumbered**, and survive reordering and insertion. Explain explicitly why array
indices fail these tests.

**(b) Entity typing and hierarchy.** A closed enum for `type` (e.g. `work`, `fascicle`, `case`,
`section`, `dialogue`, `stanza`), plus `parent_id` and an explicit integer `order`. Map it onto
BookStack's Shelf→Book→Chapter→Page given work=Book, fascicle=Chapter, passage=Page. Corpus nesting
is deeper than BookStack's, so **state the flattening rule** — which levels collapse, and how a
collapsed level is preserved in the page body so no information is lost. This is a translatechan
decision, not botrunner's.

**(c) Machine-readable status.** `w1_status` as code + label + optional explanation, from the
existing closed sets (`collated_to_claimed_witness`, `partial_or_failed_w1_collation`,
`witness_unavailable`, and the `completion_status` set). Specify it at **both** document and passage
scope. **Critically: state the rule that only 100%-collated material is exported to the wiki, and
specify the mechanism that enforces it** — a filter an implementer could get wrong is not a
mechanism. Provenance notes (`recension_note`/`editorial_note`/`cbeta_note`/`coverage_note`) must
travel with their passage; say exactly how.

**(d) Lineage edge ids.** Per R1 — a stable scheme, never reused, with tombstones for retracted edges.

**(e) Lifecycle and tombstones.** How a withdrawn, superseded, or reclassified entity is represented
so the consumer can unpublish rather than silently orphan a page. Tie this to Ruling 3: a withdrawn
claim is withdrawn, never re-pointed.

**(f) `export_manifest.json`.** Full field list: `schema_version`, `export_timestamp`, `commit`,
files with sha256 checksums. Specify how a consumer verifies an export end to end.

**(g) Documented exit codes** for the gate an external consumer would run (R6), consistent with
`GATE.md`.

**(h) Open questions for the owner.** A short numbered list of decisions you could not make on the
evidence — each with your recommendation and its consequence. Do not silently pick for the owner;
do not punt everything either. Be decisive where the evidence supports it.

### 6.2 Tracker

A short entry in `docs/PROJECT_STATE.md` recording that the export schema is specified and awaiting
an owner ruling before implementation. Match the existing bullet style.

### 6.3 Explicitly NOT in this task

No exporter script. No `export_manifest.json` generated. No ids added to any corpus file. No change
to `data/`. If you find yourself editing JSON under `data/`, stop — you have left the task.

---

## 7. SUB-TASKS AND CHECKPOINTS

1. Read §2 in full; run the §1 premise check. → checkpoint
2. Verify the §4 gaps against the real data; note where the assessment is now stale. → checkpoint
3. Draft 6.1 (a)–(d). → checkpoint
4. Draft 6.1 (e)–(h). → checkpoint
5. Tracker entry; full §14 gate run. → checkpoint
6. ONE PR per §15.

---

## 8. BRANCH AND TARGET

- **Base branch:** `main` — never the orchestrator branch.
- **Target branch:** `docs/botrunner-export-schema` ← **this exact name, fresh.**
- **Orchestrator branch:** `arena/01a0ca9d-translatechan` — fetch source only.
- **Dependencies:** none.
- **Forbidden branch:** `fix/p0-regreen-main-17-docs`.

```bash
git fetch --depth 50 origin +docs/botrunner-export-schema:refs/remotes/origin/_resume
git checkout -B docs/botrunner-export-schema refs/remotes/origin/_resume
```

If no remote ref is found, the branch is new:

```bash
git fetch --depth 1 origin +main:refs/remotes/origin/main && git checkout -B docs/botrunner-export-schema origin/main
```

`couldn't find remote ref` here is **not** an environment failure. Do not commit on `main`.

---

## 9. WORK PERSISTENCE AND PUSH CADENCE

Checkpoint after each §7 sub-task, before any risky operation, before any idle pause or end of turn,
and once at the end. **Your session can expire without warning; unpushed work is lost work.**

```bash
git add -A && (git diff --cached --quiet || git commit -qm "chore: wip <sub-task>") && git push -qu origin docs/botrunner-export-schema
```

Conventional Commits (`fix:`, `feat:`, `chore:`, `docs:`). Never a bare `wip:`.

- ONE pull request at the end, when the gates pass. No draft PR first.
- **Never edit the same file with two parallel write calls** — a race in task 063 silently dropped a
  mandated edit. This task writes one long document in several passes, so the risk is real:
  sequential writes only, verify on disk before committing.
- **Before opening the PR, review the whole branch diff against `origin/main`.**
- Sync rule: rebase onto `origin/main` only before your first push; after that
  `git fetch --depth 50 origin +main:refs/remotes/origin/main && git merge --no-edit origin/main`.
- Never force-push unless instructed, then only `--force-with-lease`.
- On merge conflict or `refusing to merge unrelated histories`: **halt and report.**
- Push rejected non-fast-forward: halt and report the raw rejection. Do not `git pull`. Do not force-push.
- Auth failure (HTTP 401/403 "Bad credentials"): commit locally, then `ask_user` including the option
  verbatim "I reconnected GitHub — retry now", at most once per expiry event.

---

## 10. TECHNICAL REQUIREMENTS

Markdown matching the house style of the other `docs/*.md` prose documents. Every example id and
every field name must come from **real data you actually inspected** — no invented document keys, no
placeholder `foo`. Where you quote a corpus shape, quote it accurately. UTF-8, LF, trailing newline.

---

## 11. SAFETY AND COMPATIBILITY RULES

- **No `data/` changes. No `sessions/` changes. No script changes.** This PR should touch exactly two
  files: the new schema doc and `docs/PROJECT_STATE.md`.
- Bundle hash must be **unchanged**: `b68eb436ac8c847a0f92ec0dea8d0f74597aa8ee79778b5e5dfe8920bb9cdba7`.
- Suite stays at **146+** with no behaviour change.
- Never hand-edit generated `docs/` data or bundle files.

---

## 12. CLEANUP RULES

No scratch files; `git status` clean before the PR; no leftover drafts or `.bak` files.

---

## 13. STRICT BOUNDARIES / OUT OF SCOPE

Do **not**: write an exporter · add ids to corpus files · generate `export_manifest.json` · modify
`data/` or `sessions/` · change gates or workflows · decide the owner's open questions unilaterally ·
interact with PR #115. If you believe an out-of-scope change is required, **halt and report**.

---

## 14. QUALITY CHECKS

Even for a docs-only change, run the full set and record output — a docs PR that breaks a gate is
still a broken PR:

```bash
python3 -m py_compile scripts/*.py                        # exit 0
python3 scripts/validate_data.py                          # exit 0, corpus=17
python3 scripts/build_data_bundle.py                      # exit 0
python3 scripts/test_source_preservation.py               # exit 0, "0 unauthorized changes"
python3 scripts/test_source_review_rules.py               # exit 0, 146+ checks
node scripts/smoke_test.mjs                               # exit 0
git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json   # exit 0
```

Determinism — both builds must print the **unchanged** hash
`b68eb436ac8c847a0f92ec0dea8d0f74597aa8ee79778b5e5dfe8920bb9cdba7`.

**Schema self-check — mandatory.** Pick **three real passages** from three different documents with
different structural shapes, and derive their ids by hand following your own rules. Paste the
derivations. If any is ambiguous, your rule is underspecified — fix the rule, not the example.

---

## 15. PR DESCRIPTION REQUIREMENTS

- **Summary** — what the export contract now specifies and why it must precede implementation.
- **The id scheme**, stated in full, with the three worked derivations from §14.
- **The flattening rule** for corpus nesting → BookStack's one-level hierarchy, and what happens to
  the collapsed level.
- **The 100%-collated-only enforcement mechanism**, stated explicitly.
- **Open questions for the owner** — the §6.1(h) list, each with your recommendation and its
  consequence. Surface this prominently; it is the main thing the owner must act on.
- **Where the prior assessment is stale**, if anywhere, with evidence.
- **Gate transcript** — the seven §14 commands with real output, plus both determinism hashes stated
  as unchanged.
- **Explicit statement** that no `data/`, `sessions/`, or script file changed and that this PR
  implements nothing.
- **Breaking changes:** none expected — say so explicitly.
- Include `#### Session Irregularities` per §16.

---

## 16. HARDENING REPORT — Session Irregularities

Under `#### Session Irregularities`, report only irregularities meeting **all three** thresholds:
(a) it interfered with following this prompt, **and** (b) it cost >~10 min, blocked progress, or
required a workaround, **and** (c) it reveals a hidden repo/session invariant or prompt blind spot
that would recur for the next worker.

If none: `None significant`.

Otherwise one bullet each, 3–6 lines total:
`Category | Symptom (1 sentence) | Impact | Workaround | Hardening candidate`

Categories: Environment, Prompt, Repository, Tooling. No padding. This report does not affect the
merge verdict unless it reveals a missing deliverable.
