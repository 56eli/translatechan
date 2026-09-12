# Task 011 — Make the provenance labels visible: render every note the corpus carries

Working in `56eli/translatechan`. Owner directive 2026-09-12: *"align the project with the vision of
perfection of source integrity, referencing and presentation in its stated goals."* The first two words of
that clause are this PR's job. Steps 010/010b align the prose; **this one closes the presentation gap the
prose can only apologise for.**

---

## 1. The defect

Across the corpus there are **49 provenance notes in `data/corpus/*.json`, and the reader surfaces a single
one of them.** The project's integrity mechanism is in the data; its presentation is not.

Measured on `main` by enumerating every `"[a-z_]+_note"` key across all 35 corpus files (re-run this; my
counts are from 2026-09-12):

| note key | occurrences in `data/corpus/*.json` | mentions in `app.js` | state |
|---|---|---|---|
| `cbeta_note` | **16** (one per document: `baizhang_guanglu`, `caoxi_zhuan`, `dahui_hongzhi`, `dahui_shobogenzo`, `dazhu_huihai`, `deshan_yulu`, `fayan_yulu`, `foyan_qingyuan`, `hanshan_poems`, `mazu_yulu`, `nanquan_yulu`, `niutou_juezhu`, `shitou_sandokai`, `wudeng_huiyuan`, `xuansha_yulu`, `xuefeng_yantou`) | **0** | fully orphaned |
| `editorial_note` | **8** (`biyanlu_cases` 2, `linji_yulu` 3, `huangbo_wanling` 1, `wumenguan` 1, `xinxin_ming` 1) | **0** | fully orphaned |
| `recension_note` | **14** (all `platform_sutra`) | 2 | one render site, verse-level only ⇒ `chapters[*]`, `chapters[*].dialogue[*]` and the **root** note are unreachable |
| `coverage_note` | 11 | 2 | dossier "Reading" ledger only — never beside the text it describes |

`cbeta_note` is the largest single hole and the one most on-policy for this directive: it is where the
project records citation corrections, e.g. `caoxi_zhuan`'s "prior 'X1458' wrong — X1458 is 宗門寶積錄. The
曹溪大師別傳 is X86n1598 … plus the Dunhuang manuscript P.3018". That is a documented *fix of a false
citation* sitting in the data with no path to the reader — precisely the integrity/referencing/presentation
mismatch the owner asked to be aligned.

Every one of those labels is the *entire* honesty mechanism for an unsourced or re-labelled passage:
`linji_yulu` sections 71–73 and `xinxin_ming` stanza 31 are labelled "no witness attribution" precisely so
they are not read as canonical text, and `platform_sutra`'s 12 chapter/dialogue labels are what disclose that
9 of 13 fields are project précis. A reader sees none of it. The data is honest; the presentation is not.

Re-derive this table yourself before writing code (§3). If your measurement differs, **report it** — the
count drives the scope.

## 2. Base check

```bash
git rev-parse --abbrev-ref HEAD   # YOUR pre-provisioned arena/* branch; never create one, never push main
git rev-parse --short HEAD        # main at or after the merge of 010b (see the dispatch note)
git status --porcelain            # empty
```
`git diff --name-status refs/remotes/origin/main HEAD` before pushing: only §6's paths may appear, and any
`A` under `.scoreboard/**` means a stale-base reset — `git reset --hard` onto your own remote tip and re-apply.

## 3. Measure first (do this before editing anything)

```bash
python3 - <<'PY'
import json,glob,re,collections
c=collections.Counter(); where=collections.defaultdict(set)
for f in glob.glob('data/corpus/*.json'):
    s=open(f,encoding='utf-8').read()
    for k in ('editorial_note','recension_note','coverage_note'):
        n=s.count('"%s"'%k); c[k]+=n
js=open('app.js',encoding='utf-8').read()
for k in c: print(f"{k}: data={c[k]} app.js mentions={js.count(k)}")
print("render sites:",re.findall(r'[a-zA-Z.]*\.(\w*note)',js)[:20])
PY
```
Also locate every content-render path (verse, dialogue, chapter body, root/overview) and record which ones
can carry a note key in the data today. That map is your specification; paste it in the PR body.

## 4. What to build

1. **One shared renderer.** A single function that takes a note string and emits the existing muted-note
   treatment already used for `v.recension_note` (same markup shape, same escaping, same `ℹ️` affordance).
   Replace that inline expression with a call to it. **No new CSS, no class invention, no redesign** — the
   owner's visual-system reset is a separate deferred track, and `docs/app.css` is generated only by
   `scripts/build_data_bundle.py`. Style churn in this PR = REVISE.
2. **Call it at every content site that can carry a note:** chapter level, dialogue entries, verse entries,
   and the document root. Two root-level cases matter most: `platform_sutra`'s root `recension_note` (the
   single most important disclosure in the corpus, currently unreachable) and the 16 root `cbeta_note`
   citation-correction records. Root notes render once, in the document header area the reader already uses
   for `coverage_note`, not inside a passage. Precedence when several exist at one node:
   `recension_note` (recension provenance) → `editorial_note` (witness-attribution status) → `cbeta_note`
   (citation correction), each on its own line. Never concatenate them into one sentence — they mean different things and were
   introduced deliberately as distinct keys.
3. **Do not duplicate.** `coverage_note` already renders in the dossier's Reading ledger; leave that as the
   document-level home. Your job is the *per-passage* notes, next to the passage.
4. **Escaping/robustness:** notes are free prose containing CJK, parentheses and `—`; use the existing
   `escHtml` path, never raw interpolation. Empty string / missing / non-string ⇒ render nothing (test all
   three by construction, not by hoping).
5. **The invariant test — this is the part that makes the fix permanent.** Extend
   `scripts/test_source_preservation.py` *only if its charter already covers doc/data consistency*; if it
   does not, add the check to `scripts/test_source_review_rules.py` instead (it owns source-review semantics
   and is the right home). The rule: **every `*_note` key present in `data/corpus/*.json` must be either
   referenced in `app.js` or on an explicit, explained exemption list.** Enumerate keys from the data with
   the §3 command, so the check stays data-driven and cannot be satisfied by editing a constant.
   **Why a naive glob would break this PR on day one:** `coverage_note` exists in 11 documents but is
   deliberately surfaced at document level in the dossier's Reading ledger rather than per passage — it is a
   ledger field, not a passage label — so it belongs on the exemption list with that reason recorded in the
   test comment. `cbeta_note`, `editorial_note` and `recension_note` belong on the **rendered** side. If you
   find a key you believe should be exempted rather than rendered, argue it in the PR body and let the
   reviewer disagree; do not silently widen or narrow either list. That converts "someone wrote a label
   nobody shows" from a silent state into a red test, permanently.

## 5. Expected outcome (review re-measures these)

- Zero bytes changed under `data/**`, `docs/data/**`, `data/corpus_manifest.json`,
  `data/canonical_locators.json`, `data/project_metrics.json`. You are rendering existing content, not
  altering it. Consequently **`104,564` / `110,165` must not move**, and no allowlist entry is needed (the
  allowlist governs corpus *content* pointers, not the reader).
- `docs/app.js` changes only as the build-generated mirror of `app.js`; `docs/app.css`, `docs/index.html`,
  `app_data.js` byte-identical. If `app_data.js` moves, you touched data — revert.
- Rendered-site coverage goes from **1 of the 4 content-bearing note keys, at 1 of the 5 possible node
  types** to every key rendered at every node type that carries it — measured by re-running §3's script
  after your change and reporting `app.js mentions` ≥ 1 for `cbeta_note`, `editorial_note`,
  `recension_note`, with `coverage_note` unchanged (dossier only) and explained in the test's exemption
  comment.
- The invariant test fails when you deliberately orphan a key (prove it: add a fake `editorial_note` to a
  scratch copy outside the repo, run, paste the failure, then confirm the repo is untouched).

## 6. Allowed paths (hard scope)

```
app.js
docs/app.js                                   (build-generated mirror only)
scripts/test_source_review_rules.py           (preferred home for §4.5; test_source_preservation.py only if its charter fits — say which and why)
.orchestrator/STATE.md                        (one dated record paragraph)
.orchestrator/REMEDIATION_PLAN.md             (one dated record line)
```
Forbidden: everything under `data/`, `docs/data/`, `schemas/`, `.github/`, `scripts/validate_data.py`,
`scripts/collate_*.py`, `scripts/build_data_bundle.py`, `scripts/smoke_test.mjs`, `index.html`, `app.css`,
`README.md`/`AUDIT.md`/`HANDOFF.md`/`vision.md`/`ROADMAP.md` (010/010b own prose), all `data/corpus/*.json`.
If a gate demands a forbidden edit, **stop and report**. If `smoke_test.mjs` asserts on `app.js` structure
and fails, report the assertion rather than editing the test.

## 7. Gates — all exit 0, in a real clone (never a `git worktree`)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
git diff --exit-code -- app_data.js docs/index.html docs/app.css docs/data data
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
diff -rq data docs/data
git diff --check
```
No `--write-metrics`. Then, in a browser-free check, verify the rendered output actually contains a label
that previously could not appear — e.g. assert the string `condensed project précis` occurs in the rendered
`platform_sutra` chapter 2 markup produced by the reader function, and paste how you checked. A change that
passes every gate but renders nothing is a failure.

## 8. Commits

```
1. fix: render corpus provenance notes at every content node in the reader        (app.js)
2. test: fail when a corpus *_note key is not rendered by the reader             (test + nothing else)
3. chore: regenerate the docs reader mirror                                        (docs/app.js only)
4. docs: record label visibility in the trackers                                   (2 .orchestrator files)
```
One commit per sub-task; do not squash; do not amend after push.

## 9. Report

Base SHA; your re-measured §1/§3 table (before and after); the render-site map; the negative test (orphaned
key ⇒ red) with its output; every §7 command with exit status; the rendered-string proof; `git diff
--name-only`; and an explicit line: **no data byte, no metric, no CSS, no layout token changed**. Cite your
own PR number read back from `gh pr view --json number`; no `#NN`. Open against `main` and **stop**.

## 10. Non-goals

No styling redesign, no new CSS, no component extraction, no accessibility overhaul, no change to what the
notes *say* (their wording is a data-integrity matter owned by earlier tasks), no addition of note keys, and
absolutely no new Chinese text. If you conclude a note's wording is wrong or a label should be added to a
document, file it in the PR body for the owner — this PR only makes existing truth visible.
