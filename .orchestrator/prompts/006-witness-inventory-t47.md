# Task 006 — Independent witness inventory, family 1 (T47 recensions) + `#NN` cleanup

Working in `56eli/translatechan`. This is the first work package of the owner's 2026-09-11 integrity
mandate: *independently verify the claims the project asserts — do not rely on prior agents' work*.
You will **measure**, not repair. Read all 14 sections; §5 (read-only discipline) and §8 (the two
traps) decide whether this PR is usable.

---

## 1. Mission

Produce a reproducible, per-document inventory of source-integrity facts for the nine documents whose
claimed witnesses are Taishō vol. 47 records of sayings. For each: what the project claims, what the
pinned CBETA witness actually contains, and what a **clean label** would say. No corpus file is
modified. Separately, fix four stale `#NN` references in the two `.orchestrator/` trackers.

## 2. Base check — report before editing

```bash
git rev-parse --abbrev-ref HEAD   # must be YOUR pre-provisioned arena/* branch
git rev-parse --short HEAD        # must be main at or after ef13b26
git status --porcelain            # empty
```
If any is false, stop and report. Never create a branch; never push to `main`.

## 3. Scope: exactly these nine documents

Enumerated from `scripts/collate_corpus.py`'s `DOCS` map (not from memory). Confirm with
`grep -n "T47n" scripts/collate_corpus.py` before proceeding:

| doc | claimed witness(es) | register's pre-remediation baseline |
|---|---|---|
| `linji_yulu` | T47n1985 | 79/89, flags {DIVERGENT 2, MINOR 2, NOT_FOUND 6} |
| `zhaozhou_yulu` | T47n1987A, T47n1987B | 0/19, {NOT_FOUND 19} |
| `baojing_sanmei` | T47n1986A, T47n1986B | 2/6, {DIVERGENT 3, NOT_FOUND 1} |
| `dongshan_yulu` | T47n1986A, T47n1986B | 1/21, {DIVERGENT 8, NOT_FOUND 12} |
| `yunmen_yulu` | T47n1988 | 0/12, {NOT_FOUND 11, DIVERGENT 1} |
| `fayan_yulu` | T47n1991 | 1/11, {NOT_FOUND 9, SHORT_UNMATCHED 1} |
| `guiyang_yulu` | T47n1989, T47n1990 | 0/6, {NOT_FOUND 6} |
| `dahui_hongzhi` | T47n1998A, T47n1998B, T48n2001 | 0/6, {NOT_FOUND 6} |
| `yuanwu_letters` | T47n1997, X69n1357 | 0/2, {NOT_FOUND 2} |

The middle column is what the **published** register says. Your numbers come from your own run and are
expected to differ for `linji_yulu` (re-keyed by PR #32: collated 84/89, flags {MINOR 2, NOT_FOUND 3}).
**If your `linji_yulu` row does NOT differ in that direction, your run is wrong** — that delta is your
self-test, and it must be reported either way.

## 4. Method — pin, then recompute

```bash
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
cd /tmp/xmlp5 && git rev-parse HEAD     # must be dbdea41071e1e260ad84b72faefd4587333cf76d
```
`xml-p5` is a **Linux filename case-sensitive** repo; if your checkout is case-preserved correctly,
`ls T/T47/ | wc -l` will be non-zero. Then extract and verify **all 39** manifest works (do not subset
it — a subset run produces different aggregate output and makes the digest step non-comparable):

```bash
cd "$REPO"
sed 's/.*  ref_//; s/\.txt$//' sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  | while read -r w; do printf '/%s/%s/%s.xml\n' "${w:0:1}" "${w:0:3}" "$w"; done > /tmp/paths.txt
git -C /tmp/xmlp5 sparse-checkout set --no-cone $(tr '\n' ' ' < /tmp/paths.txt) && git -C /tmp/xmlp5 checkout
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
  --work-list sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --upstream-revision "$(git -C /tmp/xmlp5 rev-parse HEAD)" --require-verified
COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --out /tmp/inv.json
```

Expected: `39 verified, 0 drift`. Ad-hoc collation runs **require** `--generated` (an evidence register
without a declared date is not re-derivable — that is deliberate). If the revision or digest
verification fails, stop and report; do not collate against an unpinned text.

## 5. Read-only discipline

`data/**`, `docs/**`, `app_data.js`, `data/project_metrics.json` must be **byte-identical** to `main` in
your final diff. Do not run any script that rewrites data (`validate_data.py --write-metrics`, build
steps) as part of this task; if you want the gates, run the read-only forms and report them. Any
`data/` path appearing in `git diff --name-only` means you repaired instead of measured — revert it.

## 6. Output: `.orchestrator/WITNESS_INVENTORY.md`

One section per document, machine-greppable, with exactly these labelled lines (a table if you prefer,
same fields):

```
doc / claimed witness(es) / reference sha256 (first 16) + length in graphs
my_measured: collated X/Y, flags by class        (and Δ vs register's baseline, §3)
per_flag: for each — path, class, verbatim-in-witness(yes/no),
          and for NOT_FOUND: your own full-text search result (hit count at 8/12/16/24 graphs)
candidate_older_witness: work id + how you established "older" (see §7)
label_state: does the doc carry recension_note / editorial_note / coverage_note?
             are their counts consistent with your measurement?
p0_findings: source-integrity / attribution / labeling (§9), each with the command that reproduces it
proposed_label: the ONE sentence a clean label should say for this doc
```

Also a header with: the revision, the manifest, your collation command line, and the exact number of
fields each doc's `iter_fields()` walk reached (so a later reader can confirm nothing was skipped).

## 7. The oldest-near-complete rule — and how to evidence it

Owner ruling 2026-09-11 (binding, all texts): prefer the **oldest near-complete** copy over what became
popular later; label everything; notes refer to the alternatives.

You may **not** date a text from its Taishō number or from memory. For each doc, evidence is limited to
what you can see: (a) which candidate witnesses exist in the 39-work refs; (b) their lengths and
internal structure; (c) how much of the project text each matches verbatim. Rank by *measured coverage*
and report the candidates; where the older text is **not in CBETA at all** (this is expected for
Dunhuang sayings-recensions such as the 867 鎮州臨濟惠運禪師語錄), write
`candidate_older_witness: OUT-OF-CBETA — human sourcing required, not agent work` and stop there.
Do not propose a re-key toward a text you cannot verify.

Define "near-complete" per document **before** ranking, in one line (e.g. "≥90% of the transmitted
clause sequence, or every traditional section present"), so "oldest" cannot silently mean "shortest
fragment".

## 8. Two traps that produce fake findings — both measured, not hypothetical

1. **Do not infer harness behaviour from a neighbouring constant.** `CONTENT_COLLECTIONS` in
   `scripts/validate_data.py` drives unit counting and status text only. The collator enumerates with
   its own fully recursive `iter_fields()` (`scripts/collate_corpus.py`) gated by `SRC_KEYS`, so it
   *does* reach nested fields such as `chapters[*].verses[*].zh` and `sections[*].dialogue[*].zh`.
   An orchestrator report claiming "nested verses are never collated" was disproved this way — if you
   suspect a blind spot, **run the enumeration** and paste its output, as §6 requires.
2. **A graph that looks wrong but is verbatim in the witness is CORRECT.** `linji_yulu`
   `.sections[66].dialogue[0].zh` contains 机 where 機 looks "proper"; T47n1985 itself carries 机 twice
   (機 eleven times). Same class: 麁/粗, 沈惛/昏沉, 疎/疏, 却/卻 in `xinxin_ming`. **Never file a
   misspelling P0 for a witness-verbatim graph**, and never propose a spellcheck pass. The `simplified`
   list in the collator is advisory by design.

## 9. Finding classes (P0 = makes a public-facing claim false)

- **source-integrity** — a `zh`/`text_zh` field presented as witness text that is not verbatim in that
  witness; or a citation naming the wrong work/volume/title, or a witness that is not the text followed.
- **attribution** — speaker/teacher/translator/lineage claims contradicted by the source. Check every
  distinct `speaker` string in these nine docs against the witness and against the document's own
  named master; `zhaozhou_yulu` is a known case (its `cbeta_id` history: T1987 is the Caoshan record —
  verify what the data claims **now**, on `main`, not what a report once said).
- **labeling** — missing `recension_note` where multiple recensions are cited; `coverage_note` numbers
  that disagree with your measurement; "complete" where "represented" is meant; representation offered
  as completion. Also: titles are collation-excluded, so **chapter/section name strings are a class the
  register structurally cannot catch** — check them separately against the witness (this is how
  `platform_sutra`'s 護法品第九 was found: attested in neither witness; 宗寶 uses 宣詔第九).

## 10. The `#NN` fix (second deliverable, separate commit)

On `main` at your base, four tracker lines cite an unknown-at-the-time PR number. Replace each `#NN`
with `#34`:

```bash
grep -n '#NN' .orchestrator/STATE.md .orchestrator/REMEDIATION_PLAN.md
```
Expected before: `STATE.md` lines 27 and 31; `REMEDIATION_PLAN.md` lines 165 and 223 (verify, do not
assume — the line numbers move if `main` has moved). Change **nothing else** in those files: no
rewording, no reflow, no other drift. After your edit, `grep -c '#NN'` over the repo must be **0**.

## 11. Allowed paths (hard scope)

```
.orchestrator/WITNESS_INVENTORY.md          (new; created by you)
.orchestrator/STATE.md                       (§10 only — the four #NN references)
.orchestrator/REMEDIATION_PLAN.md             (§10 only)
```

Forbidden, absolutely: `data/**`, `docs/**`, `app_data.js`, `app.js`, `app.css`, `index.html`,
`sessions/**` (append-only by policy), `schemas/**`, `scripts/**`, `AGENTS.md`, `README.md`,
`AUDIT.md`, anything under `.github/`. Do not "improve" the register, do not add refs, do not re-key a
field even if you find a P0 — file it for the next work package instead.

Link discipline: your new file must be **discoverable** — add one line to `.orchestrator/STATE.md`
pointing at it (same commit as §10, so STATE.md carries both edits). Verify every relative link you
write resolves; run `ls` on each target rather than trusting your path arithmetic.

## 12. Gates (run read-only; report, don't fix)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py                 # no flags at all
python3 scripts/test_source_preservation.py      # expect 0 unauthorized changes, and NO data edits
python3 scripts/test_source_review_rules.py
git diff --check
git diff --name-only                             # must equal §11 exactly
```
All must exit 0. If `validate_data.py` fails on something you did not cause, report the failure and the
base commit — do not "fix" an unrelated gate, and do not edit a test to pass it.

## 13. Commits, PR, and report

Two commits: (1) `docs: add W1 witness inventory, family 1 (T47 recensions)`; (2)
`chore: resolve PR #NN placeholders to #34 in W1 trackers`. Do not squash them; the inventory is the
work product, the second is housekeeping.

PR body must include: your base SHA; the extraction line (`39 verified / 0 drift`) and the `xml-p5`
revision; **the §3 self-test result** (whether `linji_yulu` moved to 84/89 as predicted); the nine
per-doc blocks with the reproducible command for every P0; a ranked list of which document is worst and
why; and the exact `git diff --name-only` output. Paste the number **after pushing** by running
`gh pr view --json number`, and use it in any tracker line you add — no `#NN`, ever.

Open the PR against `main`, then **stop**: paste the link into the orchestrator chat. Do not merge —
the operator merges personally after independent review, and review here means re-running §4 and
re-deriving your findings.

## 14. Non-goals

- No re-keying, no label edits to data, no schema additions. Findings feed prompts 007–009.
- No rights assessment: `rights_manifest.json` sources are human-reviewed by standing decision.
- No sourcing of texts CBETA does not carry (§7) — flag it, don't fetch a PDF or transcribe from memory.
- No generating plausible-looking Classical Chinese for any field, ever. If a passage is absent from
  the witness, the correct output is a label, not text.
