# Task 010b — Bring the status documents to today: `README.md`, `AUDIT.md`, `HANDOFF.md`

Working in `56eli/translatechan`, owner directive 2026-09-12 (*"update all documentation to the status quo…"*).
Step 2 of 3. These three files are the project's **measured-state** documents — and, uniquely in this repo,
they are **machine-gated**: `scripts/validate_data.py` asserts that specific sentences and numbers in them
still agree with the data. That makes this the most constrained prose edit in the campaign, and it is why
`vision.md`/`ROADMAP.md` (task 010) were split away from it.

---

## 1. Mission

Wave 1 re-keyed four documents to their witnesses, labelled a fifth, produced three independent witness
inventories and a Phase-2 plan — **and none of it is reflected in the three documents a newcomer or the owner
would read to learn where the project stands.** Add the campaign record, correct what has become false, and
leave every gate-pinned string exactly as the gate demands.

## 2. Base check

```bash
git rev-parse --abbrev-ref HEAD   # YOUR pre-provisioned arena/* branch; never create one, never push main
git rev-parse --short HEAD        # main at or after the merge of 010 (see dispatch note)
git status --porcelain            # empty
```
Pre-push: `git diff --name-status refs/remotes/origin/main HEAD` shows only §6's paths. Any `A` under
`.scoreboard/**` = stale-base reset; `git reset --hard` onto your remote tip, re-apply, re-check.

## 3. The gate contract — learn it before you type

Run this and read the output; do not proceed on assumption:

```bash
python3 - <<'PY'
import re,json
v=open('scripts/validate_data.py',encoding='utf-8').read()
m=re.search(r'framed = \(([^)]*)\)',v); print("framed files:",m.group(1).strip())
print("\nrules naming README/AUDIT/HANDOFF:")
for line in v.splitlines():
    if re.search(r'(README\.md|AUDIT\.md|HANDOFF\.md)',line) and re.search(r'(expected snippet|issues\.error|f"|in text)',line):
        print("  ",line.strip()[:150])
PY
python3 scripts/validate_data.py    # green baseline on main; note the exact pinned snippets it cites
```
The three data-generated sentences you must not disturb (read them off `data/project_metrics.json` →
`corpus.source_review`; they are f-stringed into the rule, so grepping the script finds nothing):
`Source collation does not approve reuse.` · `Containment/remediation state, not a rights decision.` ·
`Title and name metadata (title_zh, name_zh) is measured and reported separately from source content, so collated_to_claimed_witness is not proof that the excluded metadata fields were collated.`
Asymmetry to respect: `ROADMAP.md` and `.orchestrator/REMEDIATION_PLAN.md` must carry the ledger sentence and
the W1 figures but **not** those three — their absence there is by design, and task 010 must not "fix" it.

What that will show you: all three must carry verbatim (a) the five-ledger sentence
`The Reader keeps **five separate, always-visible ledgers**: …`, (b) `**35 documents, 630 flagged source
fields**`, (c) both register paths, (d) the non-approval-of-reuse, containment-not-rights and
metadata-exclusion sentences, and (e) **any line containing `T1987` must also contain `false` or
`Caoshan`** on the same line. `README.md` additionally must keep the phrase
`no current \`complete_selected_witness\` item`. And the CJK figures are recomputed from the data:
**`104,564` content / `110,165` all-string must stay**, because you will not change any corpus byte — if
either moves, you edited data, and that is a scope violation, not a metrics refresh. **Never run
`--write-metrics` in this task.**

## 4. What to change

**`README.md`**
1. The honest-status paragraph: it currently opens correctly (35 documents, no complete witness) but ends
   with `Platform Sutra has 10/10 chapter headings represented by selected excerpts (680 content CJK), not a
   complete text.` — that sentence predates #35 and is now the *false* framing the campaign was built to
   retire. Replace it with the labelled state: 13 source-content fields, **1 verbatim in the primary witness
   T48n2007 (Dunhuang), 3 in the alternative T48n2008 (宗寶), 9 in neither** and disclosed as project précis;
   680 content CJK unchanged. Keep the "not a complete text" conclusion — the edit sharpens it, never softens it.
2. Add one dated **Wave 1 integrity** paragraph: the five documents with their real PR numbers (#29 #30 #32
   #34 #35), the three inventories, `PHASE2_PLAN.md`, and the standing caveat that representation does not
   establish completion. Add the pointer to `AUDIT.md`/`HANDOFF.md` for numbers, and to
   `.orchestrator/WITNESS_INVENTORY.md` for method.
3. **The 630 sentence stays as-is.** It is explicitly labelled the *authoritative 2026-09-10 correction
   register* — that is what 630 means and it is still true of that register. Add one clause stating that a
   fresh collation of current `main` reports **532** flagged fields, that the difference is the merged
   re-keys, and that the register will be superseded only by the post-remediation evidence pass. Do **not**
   replace 630 with 532 — that would make the sentence quote a register that says otherwise.

**`AUDIT.md`**
4. "Current verdict" / measured-lines: record the campaign in the same voice and density as the rest of the
   file, with each number sourced to a command. Keep every pinned snippet byte-identical; your additions go
   in new bullet lines, not inside the gated ones.

**`HANDOFF.md`**
5. §4 "Measured snapshot" text block: add lines for the inventory/Phase-2 artefacts and the five labelled
   or re-keyed documents. Leave the existing `corpus=35 | slots=… | content CJK=104,564 | all-string
   CJK=110,165` lines **exactly as computed** — they are gate-checked. Add new lines beneath rather than
   editing those, unless a line there is arithmetically false, in which case report it instead of patching
   it silently.
6. HANDOFF is the operator-facing "what's next" document. Give it four bullets, each with the file to read:
   the post-remediation evidence pass; label visibility (task 011); the owner's fabricated-text decision
   (`PHASE2_PLAN.md` → `## Owner decision required`); and the 31-document `OUT-OF-CBETA` human-sourcing
   queue, marked **not agent-authorisable**.

## 5. Rules of composition

- **Append, don't rewrite**, except the two sentences §4.1 and §4.3 name. Rewording a gated line is the
  classic way this task fails.
- New prose in these three files must not introduce a `T1987` mention without `false`/`Caoshan` on the same
  line, and must not state `622`, `637` or `174` without a qualifier (`superseded`, `historical`,
  `2026-09-09`, `corrected`, `not reproduced`).
- Keep the file's existing voice: terse, measured, source-citing. No marketing register, no victory language
  — a document that describes 31 excerpt seeds and 0 complete witnesses should not also say the project now
  has "verified canonical sources".
- Every number you write gets the command that produces it, in the PR body.

## 6. Allowed paths (hard scope)

```
README.md
AUDIT.md
HANDOFF.md
```
Nothing else. No `data/**`, no `docs/**` (`build_data_bundle.py` copies `index.html`/`app.css`/`app.js`/
`theme-init.js` into `docs/`, but you edit none of those root files — so **no mirror may move**; if one
does, you touched a forbidden path), no `app.js`, no `scripts/**`, no `.orchestrator/**`, no
`vision.md`/`ROADMAP.md`/`RESEARCH_RELEASE_PLAN.md` (010 owns those), nothing under `.github/`.

## 7. Gates — all exit 0, in a real clone (never a `git worktree`)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
git diff --exit-code -- app_data.js docs/data data docs/app.css docs/app.js docs/index.html data/project_metrics.json
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
diff -rq data docs/data
git diff --check
```
Two of those deserve comment: `test_source_review_rules.py` re-runs the doc-truthfulness checks and will
catch a broken pinned sentence faster than `validate_data.py`; and `smoke_test.mjs` is the one that fails
with a *cascade* rather than a precise message, so run `validate_data.py` first and believe it. If a gate
fails on a path you are forbidden to edit, stop and report it.

## 8. Commits

```
1. docs: record the Wave 1 integrity campaign in README
2. docs: correct the Platform Sutra status to its labelled state
3. docs: update AUDIT measured lines and HANDOFF next-steps
```
Plus, only if the build genuinely regenerates them, a fourth: `chore: regenerate the README-derived docs
mirror`. Do not squash.

## 9. Report

Base SHA; the §3 rule enumeration as you measured it; before/after for the two sentences you rewrote (paste
both); the 630-vs-532 handling; every §7 command with exit status; `git diff --name-only`; and the explicit
statement that no data file, no metric and no CJK figure changed (`104,564`/`110,165` verbatim still present
in all three files — paste the grep). Read your PR number back via `gh pr view --json number`; no `#NN`.
Open against `main` and **stop**.

## 10. Stop-and-report

A pinned snippet turns out to be absent on main already (a gate gap worth knowing); the 680/CJK figures
disagree with your own measurement (report, do not "fix" data); you find a false claim in these three files
beyond §4's two sentences (list them — the next pass owns them rather than this PR ballooning); or `docs/`
needs a manual edit beyond the generated mirror.

## 11. Definition of done

A reader of `README.md` alone can tell: the corpus size, that zero documents are complete, that five have
been re-keyed or labelled in the last campaign, that nine Platform Sutra fields are project précis and now
say so, that 630 refers to a register while 532 is today's measurement, and that four specific items gate a
release. Same facts in `AUDIT.md` with numbers, and in `HANDOFF.md` with next actions — with all nine gates
green and no corpus byte touched.
