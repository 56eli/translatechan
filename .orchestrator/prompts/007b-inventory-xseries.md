# Task 007b — Independent witness inventory, family 3 (X-series witnesses)

Working in `56eli/translatechan`, under the owner's 2026-09-11 integrity mandate: *verify the claims the
project asserts; prior agents' work is not evidence*. You **measure**; you do not repair. Read all 12
sections; §5 (read-only) and §8 (the two traps) decide whether this PR is usable.

---

## 1. Mission

Third and last block of the Phase 1 inventory (006 = T47n family, 007a = T45/T48/T51). Cover every
document whose claimed witnesses include an **X-series** (Xuzangjing) work — the group most likely to
carry unlabelled précis, because these witnesses are compendia that quote other books. Output one new
file. **No corpus file is modified.**

## 2. Scope — compute it, do not trust this paragraph

Take the keys in `scripts/collate_corpus.py`'s `DOCS` whose witness list contains any `X` id, minus
those already inventoried by 006 (`linji_yulu`, `zhaozhou_yulu`, `baojing_sanmei`, `dongshan_yulu`,
`yunmen_yulu`, `fayan_yulu`, `guiyang_yulu`, `dahui_hongzhi`, `yuanwu_letters` — 006 takes all of those
including its X probes) and minus those 007a owns (`qinggui_monastic_codes`, `shitou_sandokai`,
`hanshan_poems`, `niutou_juezhu`).

My enumeration (parsed from the live `DOCS` object) gives **12**: `mazu_yulu`, `baizhang_guanglu`,
`xuefeng_yantou`, `dazhu_huihai`, `foyan_qingyuan`, `nanquan_yulu`, `xuansha_yulu`, `dahui_shobogenzo`,
`wudeng_huiyuan`, `caoxi_zhuan`, **`chuandenglu`**, **`deshan_yulu`** (the last two cite X only as
*probes* against T51n2076; they are yours because their primary witness is a compendium and the X
comparison is the whole point). `qinggui_monastic_codes` and `shitou_sandokai` also cite X works but are
assigned to 007a by precedence, so the two inventory PRs stay disjoint. Print your computed list and
count; **if it differs, use yours and report the difference** — `main` may have moved. Note `caoxi_zhuan`: its record's `cbeta_note` says an earlier revision cited
`X1458` wrongly (X1458 is 宗門寶積錄) and that the correct works are X86n1598 plus the Dunhuang
manuscript **P.3018**. P.3018 is **not in CBETA**: inventory it as `candidate_older_witness:
OUT-OF-CBETA — human sourcing required`, and check whether the project still repeats the corrected
claim anywhere else.

## 3. Base check — report before editing

```bash
git rev-parse --abbrev-ref HEAD   # YOUR pre-provisioned arena/* branch (never create one, never push main)
git rev-parse --short HEAD        # main at or after ef13b26
git status --porcelain            # empty
```

## 4. Method — pin, then recompute (full 39-work run, never a subset)

Identical to 006 §4 / 007a §4: clone `cbeta-org/xml-p5` at
`dbdea41071e1e260ad84b72faefd4587333cf76d`, check out all 39 manifest works, run
`collate_refs.py --require-verified` expecting `39 verified, 0 drift`, then per document
`COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc <key> --generated 2026-09-11 --out …`.
`--generated` is mandatory for evidence runs. References in `/tmp` only, never in the repo.

For this family specifically, record for each doc **which** of its cited works carries a match: several
cite two (e.g. `X69n1323` + `X68n1315`). A match found only in a compendium that *quotes* another book is
a provenance finding in itself — say so, with the work id and the offset of the match.

## 5. Read-only discipline

`data/**`, `docs/**`, `app_data.js`, `data/project_metrics.json`, `sessions/**`, `scripts/**` stay
**byte-identical**. Do not run `--write-metrics` or the build. Any `data/` path in your diff means you
repaired instead of measured — revert it.

## 6. Regression self-test (a check on *you*)

`xinxin_ming` was re-keyed by PR #34; the published register predates it. Your run must produce
**36/37 collated, 1 content flag {NOT_FOUND 1}**, where the stale register says **24/37, 13 flags**.
If you reproduce the stale numbers, you are not collating current `main` (wrong checkout, missing
`COLLATION_REFS`, or a stale `/tmp/refs`). Paste both numbers.

## 7. Output — `.orchestrator/WITNESS_INVENTORY_XSERIES.md`

Same labelled fields as 006/007a (read those files first; all three are one dataset in three parts):
claimed witnesses + ref sha256(16) + graph lengths; `my_measured` collated X/Y and flags by class with Δ
vs register; per-flag verbatim test and, for NOT_FOUND, your own 8/12/16/24-graph hit counts;
`label_state`; `p0_findings` with reproducing commands; `candidate_older_witness`; `proposed_label`.
Header records the revision, the manifest, the exact command line, and the field count
`collate_corpus.iter_fields()` reached per document.

## 8. Two traps that generate fake findings (both fired this session)

1. **Never infer harness behaviour from a neighbouring constant.** `CONTENT_COLLECTIONS` in
   `scripts/validate_data.py` governs unit counting and status text only; the collator walks
   recursively via `iter_fields()` + `SRC_KEYS`, so nested fields such as `sections[*].dialogue[*].zh`
   **are** collated. A "nested fields are never collated" claim was published and retracted this session.
   Suspect a blind spot ⇒ run the enumeration and paste it.
2. **A graph that looks wrong but is verbatim in the witness is correct.** 机 / 麁 / 沈惛 / 疎 / 却 are
   witness forms in merged data. No misspelling P0 against them; no spellcheck proposal; the `simplified`
   list is advisory by design.

## 9. Oldest-near-complete rule — evidence, not memory

Owner ruling 2026-09-11 (binding, all texts): prefer the oldest near-complete copy; label everything;
notes refer to alternatives. Never date by Taishō/X number or from memory: list candidate witnesses
available in the 39 refs, give graph lengths and measured verbatim coverage, define "near-complete" for
that document in one line *before* ranking. Much of this family's material also survives inside
`T51n2076` (景德傳燈錄) — where the project cites a X-series compendium but the same passage exists in an
older stratum of the 傳燈錄, **that is a ranking finding**; record both offsets so the comparison is
checkable. Anything older but outside CBETA is `OUT-OF-CBETA — human sourcing required`, full stop.

## 10. Priority feed

Final ranked section: **docs with 0 or 1 collated content field and no honest label**, most exposed first,
with the P0 class. My authoring-time numbers put nearly this whole family in that set (0/8, 0/6, 0/6,
0/6, 0/6, 0/5, 0/4, 0/4, 0/3, 0/4) — **re-verify; your run decides the list.** 008 consolidates all three
files into one priority order.

## 11. Allowed paths (hard scope)

```
.orchestrator/WITNESS_INVENTORY_XSERIES.md        (new; yours)
```
Nothing else. No tracker edits (006 owns `#NN`), no STATE.md links (008 registers all three files).
Gates you may run read-only, reporting without acting: `py_compile`, `validate_data.py`,
`test_source_preservation.py`, `test_source_review_rules.py`, `git diff --check`.

## 12. Commits, PR, report

One commit: `docs: add W1 witness inventory, family 3 (X-series witnesses)`.

PR body: base SHA; `39 verified / 0 drift` + revision; your §2 computed list and count; the §6 self-test
result as measured; per-doc blocks; the §10 ranking; `git diff --name-only`; and `git diff --stat`
proving the only change is the new file. Cite your own PR number via `gh pr view --json number` if needed —
no `#NN`. Open against `main` and **stop**; do not merge, the operator does, and review means re-running
§4 and re-deriving a few findings.

Non-goals: as §5 — no re-keying, no labels added to data, no new note keys, no status flips, no rights
work, no fetching non-CBETA sources, and never generating plausible Classical Chinese for an unsourced
field. Absent from the witness ⇒ the correct output is a label, not text.
