# Task 009 — `platform_sutra`: label the recensions honestly (Dunhuang-primary ruling, label-only package)

Working in `56eli/translatechan`. Owner rulings in force (2026-09-11): **prefer the oldest
near-complete copy** for all texts — here CBETA **T48n2007** (Dunhuang) is primary over **T48n2008**
(宗寶, the later popular recension) — and **"everything can be cleanly labeled as such, with notes
referring to the alternative texts."** Read all 15 sections; §2 says why this PR must not touch a
single character of Chinese.

---

## 1. Mission

`data/corpus/platform_sutra.json` currently implies its Chinese is T2007-derived text. Measured against
both witnesses, it mostly is not. Your job is to make the file **tell the truth about itself**: add the
label fields the project already uses elsewhere, correct the misleading `coverage_note`, and disclose the
chapter-frame and chapter-name facts. **No `zh` field is rewritten in this package.** The text decision
follows separately, informed by the inventory work (tasks 006–008).

## 2. Why label-only (do not "help" by re-keying)

Nine of the thirteen content fields are verbatim in **neither** witness, so there is no "correct" text to
substitute without authoring new Chinese — which is prohibited project-wide. And the four fields that
*are* verbatim in a witness must keep the wording they have. So: the deliverable is **provenance
labels**, not provenance fixes. If you find yourself editing any `zh`, stop.

## 3. Base check — report before editing

```bash
git rev-parse --abbrev-ref HEAD   # YOUR pre-provisioned arena/* branch
git rev-parse --short HEAD        # main at or after ef13b26
git status --porcelain            # empty
```
Never create a branch; never push to `main`. If 006/007/008 have merged, their
`.orchestrator/WITNESS_INVENTORY.md` rows for `platform_sutra` are additional evidence — read them if
present, but re-verify anything you cite.

## 4. Witness pinning (the gate)

Same protocol as the repo documents in `scripts/collate_refs.py`'s header:

```bash
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
cd /tmp/xmlp5 && git rev-parse HEAD      # must be dbdea41071e1e260ad84b72faefd4587333cf76d
git sparse-checkout set --no-cone /T/T48/T48n2007.xml /T/T48/T48n2008.xml && git checkout
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
  --work-list sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --upstream-revision "$(git -C /tmp/xmlp5 rev-parse HEAD)" --require-verified
```
Run the **full 39-work** list so the aggregate line is comparable (`expect 39 verified / 0 drift`), and
confirm the two digests you depend on: `ref_T48n2007.txt` sha256 `4f6ac8de…` (**line 17**) and
`ref_T48n2008.txt` `71a340cb…` (**line 18**) of `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`
— read the line numbers yourself with `grep -n`, since they move if the manifest is ever amended.
Lengths: **12,124** graphs (Dunhuang) vs **26,043**
(宗寶). Any mismatch ⇒ stop and report. References live in `/tmp` only.

## 5. Measured state — reproduce this table yourself before writing any note

| field | graphs | verbatim in T48n2007 | verbatim in T48n2008 |
|---|---|---|---|
| `.chapters[0].verses[0].zh` (Shenxiu) | 20 | no | **yes** |
| `.chapters[0].verses[1].zh` (本來無一物) | 20 | no | **yes** |
| `.chapters[0].verses[2].zh` (佛性常清淨) | 20 | **yes** | no |
| `.chapters[1].dialogue[0].zh` | 60 | no | no |
| `.chapters[1].dialogue[1].zh` | 50 | no | no |
| `.chapters[2].zh` | 83 | no | no |
| `.chapters[3].dialogue[0].zh` | 53 | no | **yes** |
| `.chapters[4].dialogue[0].zh` | 55 | no | no |
| `.chapters[5].zh` | 56 | no | no |
| `.chapters[6].zh` | 73 | no | no |
| `.chapters[7].zh` | 36 | no | no |
| `.chapters[8].zh` | 83 | no | no |
| `.chapters[9].zh` | 71 | no | no |

Totals to confirm: **1** Dunhuang-verbatim, **3** 宗寶-verbatim, **9** in neither (535 of 620 graphs).
Comparison unit is `strip_punct(field) in ref` — the references are one unpunctuated CJK line, no
trailing newline. Also verify three structural claims, and report them as verified or not:
(a) `護法` occurs **0** times in both witnesses while 宗寶 titles that chapter `宣詔第九`;
(b) all ten `chapters[*].title_zh` cores (`行由品第一` … `付囑品第十`) are attested in **neither**
witness, and the 宗寶 table of contents writes `行由第一` without 品;
(c) the root `title_zh` 六祖大師法寶壇經 is verbatim in T48n2008 only — the Dunhuang witness opens with
its own long 南宗頓教…一卷 title.

## 6. What to write

1. **Root `recension_note`** (new sibling of `coverage_note`), stating: the owner's oldest-near-complete
   ruling selects CBETA T48n2007 (Dunhuang, Taishō 48 no. 2007) as the primary witness; T48n2008 (宗寶,
   later popular recension) is the named alternative; the 10-chapter frame and the chapter titles follow
   the 宗寶 division as a reading convenience and are **not** attested in either witness; and 9 of 13
   content fields are condensed project précis, verbatim in neither.
2. **Per-field `recension_note`** on each of the 13 content fields, one sentence each, exactly of the
   measured kind:
   - Dunhuang-verbatim → `verbatim in the primary witness T48n2007.`
   - 宗寶-verbatim → `verbatim in the alternative recension T48n2008 (宗寶), not in the primary witness;
     retained as the received reading and labelled.`
   - neither → `condensed project précis; not verbatim in T48n2007 or T48n2008; no witness attribution
     claimed.`
   - `chapters[0].verses[*]` already has one note on `verses[2]`: leave its text intact, and add notes to
     `verses[0]`/`verses[1]` in the same voice and the same field name. **Do not introduce a second note
     key** (`editorial_note` is for witness-attribution removal, `recension_note` is for recension
     provenance — this document is a recension case).
3. **`chapters[8].recension_note`**: the chapter title 護法品第九 is the project's label; 宗寶 titles this
   chapter 宣詔第九 and 護法 is absent from both witnesses. Keep the title (title rendering is a separate,
   already-scoped PR) and let the note carry the disclosure.
4. **Replace `coverage_note`.** Current text: `10/10 chapter headings represented by selected excerpts
   (680 content CJK); this is not the complete T2007 text.` Both clauses mislead — the content is not
   excerpts *of* T2007, and 10 chapter headings do not match the Dunhuang structure. Write an honest one
   that states the ratio (1 field verbatim in the primary witness, 3 in the alternative, 9 neither; 620
   of 680 content graphs accounted for), that a précis is not a text, and the standing sentence
   `Representation does not establish complete selected-witness status.`
5. Do **not** touch `title_zh` anywhere (root or per-chapter), `title_pinyin`, `title_en`,
   `translations.*`, `chapter_num`, or any `zh`. Metadata titles belong to the composite-title PR.

## 7. Allowed paths (hard scope)

```
data/corpus/platform_sutra.json
docs/data/corpus/platform_sutra.json          (build-generated only)
app_data.js, docs/app_data.js                   (build-generated only)
data/project_metrics.json, docs/data/project_metrics.json   (via validate_data.py --write-metrics)
scripts/test_source_preservation.py             (allowlist pointers only — §8)
.orchestrator/STATE.md, .orchestrator/REMEDIATION_PLAN.md   (one factual record each, §11)
```

Forbidden: `data/corpus_manifest.json` (**byte-identical** — no status promotion), `data/canonical_locators.json`,
`scripts/smoke_test.mjs`, `scripts/validate_data.py`, `scripts/collate_*.py`, `sessions/**`, `schemas/**`,
`app.css`, `app.js`, `index.html`, `README.md`, `AUDIT.md`, `HANDOFF.md`, everything under `.github/`,
and every other `data/corpus/*.json`. If a gate fails because of one of these, **report it; do not edit it.**

## 8. Allowlist (this is where over-reach becomes visible)

`scripts/test_source_preservation.py` has a per-file frozenset for `data/corpus/platform_sutra.json`.
Extend it with **exactly** the pointers you added notes to: the root `.recension_note`, root
`.coverage_note`, the 13 per-content-field `.recension_note` paths, and `.chapters[8].recension_note`
(16 total; `chapters[0].verses[2]` already carries its note, so do not double-list it — if the existing
note is already allowlisted, keep one entry). Set-equality is required: your allowlist additions for this
file == the changed leaf pointers for this file, computed at leaf level, 0 over-broad, 0 missing. Paste
both sets in the PR body.

## 9. Expected outcome (review re-measures these)

- Every `zh`/`text_zh`/`title_*`/`translations.*` byte-identical to `main`. Verify by leaf-level diff and
  report the count: **0** content-text changes, **0** title changes, **0** English changes.
- Collation unchanged: still 4/13 collated, 9 content flags. Labels do not improve collation and must not
  be presented as if they did. `source_review_status` stays `partial_or_failed_w1_collation`.
- CJK: `notes` add prose, so `coverage_note`/`recension_note` text changes the document's all-string CJK;
  content CJK must stay **680**. Report both numbers as measured (content-CJK-by-collection vs
  all-string), and check whether `data/project_metrics.json` needs `--write-metrics`: it does if and only
  if a metric it records moved.
- `corpus_manifest.json`, `canonical_locators.json`, `smoke_test.mjs`: byte-identical.

## 10. Gates, in order, in a real clone (never a `git worktree` —
`scripts/test_source_preservation.py` and `node scripts/smoke_test.mjs` both fail in linked worktrees)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py --write-metrics
python3 scripts/validate_data.py                     # re-run clean, no flag
python3 scripts/build_data_bundle.py
git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
diff -rq data docs/data
git diff --check
```
All exit 0. `--skip-docs` is never permitted on `validate_data.py`. `scripts/w1_evidence.py` is an
imported module, not a CLI.

## 11. Tracker records (2 lines, no more)

One dated paragraph in `.orchestrator/STATE.md` and one in `.orchestrator/REMEDIATION_PLAN.md` recording:
the owner's oldest-near-complete ruling, that this document is now *labelled* rather than *sourced*, the
measured 1/3/9 split, and that the text decision (replace the 9 précis fields with Dunhuang text, or keep
the précis) is **deferred pending the 006–008 inventory**. State PR numbers as `#34`-style real numbers
only — after pushing, run `gh pr view --json number` and amend in a final commit if you need your own
number. **No `#NN`.**

## 12. Commit cadence — one commit per sub-task

1. `docs: record platform_sutra recension provenance in data notes` — the 14 per-field notes.
2. `docs: correct platform_sutra coverage_note and add root recension_note` — root notes.
3. `chore: extend source-preservation allowlist for platform_sutra labels` — allowlist only.
4. `chore: regenerate artifacts and metrics for platform_sutra labels` — build + `--write-metrics`.
5. `docs: record Wave 1 platform_sutra labelling state` — the two tracker files.

Do not squash; do not amend after push.

## 13. Report (PR body)

Base SHA; §4's revision + the two digests + `39 verified / 0 drift`; your re-measured §5 table with any
row that disagrees highlighted (**disagreement is a finding, not an error to hide**); the 0-content-changes
proof (leaf-level diff); both allowlist pointer sets; §9's numbers as measured; every §10 command with exit
status; and an explicit line saying what you did **not** do (no re-key, no title change, no status flip).

## 14. Stop-and-report conditions

`main` has moved such that a §5 row is already fixed; the witnesses don't reproduce; you conclude a `zh`
field must change (that means the deferred text decision is being forced into this PR — say so instead);
you think a new note key is needed (it isn't — `recension_note` exists and is what the owner asked for);
or you believe a label would be nicer as a rename of `護法品第九` (it isn't, §6.3, because titles are a
separate PR by standing owner decision).

## 15. Definition of done

16 note pointers added and allowlisted (set-equal), root note honest, all `zh`/`title_*`/English bytes
untouched, manifest and locators byte-identical, collation unchanged at 4/13 with the reason stated, all
gates green in a clean clone, two tracker lines with real PR numbers — and a reader who opens this
document can now tell which lines are Dunhuang, which are 宗寶, and which are ours.
