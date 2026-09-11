# Task 007a — Independent witness inventory, family 2 (T45/T48/T51 + the witness-unavailable pair)

Working in `56eli/translatechan`, under the owner's 2026-09-11 integrity mandate: *verify the claims the
project asserts; prior agents' work is not evidence*. You **measure**; you do not repair. Read all 13
sections; §5 (read-only) and §8 (the two traps) decide whether this PR is usable.

---

## 1. Mission

Extend the Phase 1 inventory (started by task 006 for the nine T47n-family documents) to the T45/T48/T51
group and the two documents with no CBETA witness. For each document: what the project claims, what the
pinned witnesses actually contain, whether the **labeling** is honest, and what a clean label would say.
Output one new file. **No corpus file is modified.**

## 2. Scope — compute it, do not trust this paragraph

Work on every key in `scripts/collate_corpus.py`'s `DOCS` map whose claimed witnesses are **not** `T47n*`
AND which is not already inventoried by task 006 (006 covers: `linji_yulu`, `zhaozhou_yulu`,
`baojing_sanmei`, `dongshan_yulu`, `yunmen_yulu`, `fayan_yulu`, `guiyang_yulu`, `dahui_hongzhi`,
`yuanwu_letters`). Exclude the X-series (task 007b owns those).

My enumeration (parsed from the live `DOCS` object, not from memory) gives **14 documents = 12 in the
collation table + 2 in the witness-unavailable section**:
`wumenguan`, `xinxin_ming`, `biyanlu_cases`, `zhengdao_ge`, `platform_sutra`, `bodhidharma_erru`,
`huangbo_chuanxin`, `huangbo_wanling`, `sengzhao_zhaolun`, `lidai_fabao_ji`, `qinggui_monastic_codes`,
`shitou_sandokai`; separately `hanshan_poems` and `niutou_juezhu`, which cite **no** CBETA witness and
belong in a short section of their own rather than a collation table.
Note that `qinggui_monastic_codes` (X63n1245) and `shitou_sandokai` (X80n1565) **do** cite X-series works
— they are assigned here by precedence so the two inventory PRs stay disjoint; `chuandenglu` and
`deshan_yulu` also cite X works but only as *probes* against T51n2076, and they belong to task 007b.
Print your computed list and count in the PR body; **if it differs, proceed with yours and report the
difference** — `main` may have moved and your set is authoritative, not this text.

## 3. Base check — report before editing

```bash
git rev-parse --abbrev-ref HEAD   # YOUR pre-provisioned arena/* branch (never create one, never push main)
git rev-parse --short HEAD        # main at or after ef13b26
git status --porcelain            # empty
```

## 4. Method — pin, then recompute (full 39-work run, never a subset)

```bash
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
cd /tmp/xmlp5 && git rev-parse HEAD     # must be dbdea41071e1e260ad84b72faefd4587333cf76d
sed 's/.*  ref_//; s/\.txt$//' sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  | while read -r w; do printf '/%s/%s/%s.xml\n' "${w:0:1}" "${w:0:3}" "$w"; done > /tmp/paths.txt
git sparse-checkout set --no-cone $(tr '\n' ' ' < /tmp/paths.txt) && git checkout
cd "$REPO_ROOT"   # the repo you cloned; substitute your real path
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
  --work-list sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --upstream-revision "$(git -C /tmp/xmlp5 rev-parse HEAD)" --require-verified
```
Expected: `39 verified, 0 drift`. Subsetting changes the aggregate line and makes the digest comparison
non-equivalent, so run all 39 even though you only need a dozen. Then, per document:
`COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc <key> --generated 2026-09-11 --out /tmp/…`
(`--generated` is mandatory for any evidence run; a date-less register is not re-derivable by design).
If the revision or digest verification fails: stop and report. References in `/tmp` only, never the repo.

## 5. Read-only discipline

`data/**`, `docs/**`, `app_data.js`, `data/project_metrics.json`, `sessions/**`, `scripts/**` stay
**byte-identical** to your base. Do not run `validate_data.py --write-metrics`, do not run the build. Any
`data/` path in `git diff --name-only` means you repaired instead of measured — revert it. Findings feed
the next work package; they are not yours to fix.

## 6. Regression self-test (mandatory, and it is a check on *you*)

The published register at `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` predates four merged
remediations. Your run on current `main` must produce:

| doc | register (stale) | your run (must match) |
|---|---|---|
| `wumenguan` | 113/181, {NOT_FOUND 15, DIVERGENT 48, MINOR 5} | **174/181, 7 flags {NOT_FOUND 1, MINOR 6}** |
| `biyanlu_cases` | 353/395, 41 flags | **373/395, 22 flags {MINOR 22}** |
| `xinxin_ming` | 24/37, 13 flags | **36/37, 1 flag {NOT_FOUND 1}** |
| `zhengdao_ge` | 6/6, 0 flags | **6/6, 0 flags** ← unchanged on purpose |

Three rows must move and one must not. If all four match the register, your collation did not run
against current `main`. Paste the table with your numbers either way.

## 7. Output — `.orchestrator/WITNESS_INVENTORY_T48_T51.md`

One block per document, same field labels as 006's `.orchestrator/WITNESS_INVENTORY.md` (read it first and
match its format exactly — the two files are one dataset in two parts):

```
doc / claimed witness(es) / ref sha256 (first 16) + graph length
my_measured: collated X/Y, flags by class (+ Δ vs register)
per_flag: path, class, verbatim-in-witness(yes/no); for NOT_FOUND also your own 8/12/16/24-graph
          full-text hit counts
label_state: recension_note / editorial_note / coverage_note present? counts consistent?
p0_findings: source-integrity | attribution | labeling — each with the reproducing command
candidate_older_witness: per §9
proposed_label: the ONE sentence a clean label should say
```
Header: revision, manifest path, exact collation command line, and the number of fields
`collate_corpus.iter_fields()` reached per document (so a reader can confirm nothing was skipped — see
§8.1). Plus the two-doc `hanshan_poems` / `niutou_juezhu` section: state plainly that no CBETA witness
exists, what the data claims instead, and that sourcing is human work.

## 8. Two traps that generate fake findings (both fired this session)

1. **Never infer harness behaviour from a neighbouring constant.** `CONTENT_COLLECTIONS` in
   `scripts/validate_data.py` drives unit counting and status text only; the collator enumerates via its
   own **fully recursive** `iter_fields()` gated by `SRC_KEYS`, so nested fields
   (`sections[*].dialogue[*].zh`, `chapters[*].verses[*].zh`) **are** collated. A "nested verses are
   never collated" claim was published and retracted this session by the orchestrator itself. If you
   suspect a blind spot, **run the enumeration** and paste it.
2. **A graph that looks wrong but is verbatim in the witness is correct.** 机 (for 機), 麁 (粗), 沈惛
   (昏沉), 疎 (疏), 却 (卻) are all witness forms present in merged data. Never file a misspelling P0
   against them, never propose a spellcheck pass; the collator's `simplified` list is advisory by design.

## 9. Oldest-near-complete rule — evidence, not memory

Owner ruling 2026-09-11 (binding, all texts): prefer the oldest near-complete copy; label everything;
notes refer to the alternatives. You may **not** date a text by Taishō number or from memory. For each
document: list the candidate witnesses **available in the 39 refs**, record each one's graph length and
how much of the project text it matches verbatim, define "near-complete" for that document in one line
*before* ranking, and rank by measured coverage. Where the older text is not in CBETA at all, write
`candidate_older_witness: OUT-OF-CBETA — human sourcing required, not agent work` and stop.

This is load-bearing for `platform_sutra` (primary = T48n2007 Dunhuang, alternative = T48n2008 宗寶) and
for `huangbo_chuanxin` / `huangbo_wanling`, which cite `T48n2012A` / `T48n2012B` — measure whether they
cross-match, since A and B are recensions of one work rather than independent witnesses.

## 10. Priority feed (this is the point of the exercise)

Add a final ranked section: **documents with 0 or 1 collated content field and no honest label**, most
exposed first, with the specific P0 class for each. In my authoring-time numbers, that set includes
`sengzhao_zhaolun` (0/4), `bodhidharma_erru` (1/6), `qinggui_monastic_codes` (0/5), `deshan_yulu` (0/6),
`lidai_fabao_ji` (0/3), `chuandenglu` (1/6) — **re-verify, do not copy**; your run decides the list. This
ranking is what prompt 008 consolidates and what the next fix packages are sequenced by.

## 11. Allowed paths (hard scope)

```
.orchestrator/WITNESS_INVENTORY_T48_T51.md        (new; yours)
```
Nothing else — no tracker edits (006 owns the `#NN` fixes), no links added to `STATE.md` (008 will
register all three inventory files together), no other file. If you believe another path is needed,
report that instead of touching it.

Gates you *may* run read-only, reporting results without acting on them: `python3 -m py_compile
scripts/*.py`, `python3 scripts/validate_data.py`, `python3 scripts/test_source_preservation.py`,
`python3 scripts/test_source_review_rules.py`, `git diff --check`. All should pass on a clean base; if
one fails for a reason outside your diff, report the base SHA and the failure.

## 12. Commits, PR, report

One commit: `docs: add W1 witness inventory, family 2 (T45/T48/T51 + witness-unavailable pair)`.

PR body: base SHA; the `39 verified / 0 drift` line + revision; your §2 computed doc list and count; the
full §6 self-test table as measured; per-doc blocks; the §10 ranking; `git diff --name-only`; and an
explicit statement that no data file was modified (`git diff --stat` proving only the new file). Read your
PR number back with `gh pr view --json number` if you cite it anywhere — no `#NN`.

Open the PR against `main` and **stop**. Do not merge; the operator merges personally after independent
review, which here means re-running §4 and re-deriving two or three of your findings.

## 13. Non-goals

No re-keying, no label edits, no new note keys, no status changes, no rights work
(`rights_manifest.json` sources are human-reviewed by standing decision), no fetching non-CBETA sources,
and **never generating plausible Classical Chinese for an unsourced field** — if a passage is absent from
the witness, the correct output is a label, not text.
