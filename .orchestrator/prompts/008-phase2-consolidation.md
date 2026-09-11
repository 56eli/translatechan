# Task 008 — Consolidate the three witness inventories into one Phase-2 decision instrument

Working in `56eli/translatechan`, under the owner's 2026-09-11 integrity mandate. Phase 1 (measurement) is
**done**: tasks 006, 007a, 007b are merged and their reports are on `main`. Your job is to **consolidate**
them, **re-verify** them, and produce the single ranked document that sequences Phase 2. You decide
nothing about the corpus text and change no data file: this is a tracker deliverable, and the choices that
belong to a human must be *framed* for them, not taken.

---

## 1. Mission, in three parts

1. **`.orchestrator/PHASE2_PLAN.md`** (new) — one row per finding across all three inventories, ranked,
   each classified into exactly one remediation kind, with the inventory's reproducing command carried
   forward or a better one substituted.
2. **`STATE.md` / `REMEDIATION_PLAN.md` corrections** — three specific stale facts (§7).
3. **A disagreement report** — where the three inventories contradict each other or contradict a
   re-measurement you ran (§6). Finding a contradiction is a *success*, not a problem to smooth over.

## 2. Base check — hard gate, report before editing

```bash
git rev-parse --abbrev-ref HEAD    # YOUR pre-provisioned arena/* branch. Never create a branch.
git rev-parse --short HEAD         # MUST be at or after b3cd14f (the merge of #36)
git status --porcelain             # empty
```
If `HEAD` does not contain `b3cd14f` (`git merge-base --is-ancestor b3cd14f HEAD` exits 0), **stop and
report**: the third inventory has not landed and this task is unrunnable rather than partially runnable.
Also stop if any `.orchestrator/WITNESS_INVENTORY*.md` is absent — all three must exist on your base.
Never push to `main`. Never push a commit whose diff reintroduces a path that `main` has deleted (check
`git diff --name-status refs/remotes/origin/main HEAD` before pushing; any `A` on `.scoreboard/**` means
your workspace was reset onto a stale base — `git fetch` + reset onto your remote branch and re-apply).

## 3. Inputs — read all three, in this order

```
.orchestrator/WITNESS_INVENTORY.md            (006: 9 docs, T47-recension family)
.orchestrator/WITNESS_INVENTORY_T48_T51.md    (007a: 14 doc blocks = 12 measured + 2 witness-unavailable)
.orchestrator/WITNESS_INVENTORY_XSERIES.md    (007b: 12 docs, compendium witnesses)
```
Authoring-time counts to **confirm, not copy**: 35 doc blocks total (= all of `data/corpus`), 70 P0-class
bullets (16/19/35 per file), 35 `OUT-OF-CBETA` markers, 23 + 35 `Reproduce` markers in 007a/007b and only
4 in 006. If your count differs, **your method is the one to document** — state the exact `grep`/parse you
used in the plan's header, because a count without its recipe is the same unanchored claim this whole
campaign exists to retire.

## 4. Re-verify, don't just aggregate

Aggregation alone would launder three unreviewed documents into one authoritative-looking one. So:

- **Re-run the extraction and collation** as `006 §4` / `007a §4` prescribe (xml-p5 at
  `dbdea41071e1e260ad84b72faefd4587333cf76d`, full 39-work list, expect `39 verified / 0 drift`, then
  `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --out …`). References
  in `/tmp` only.
- **Spot-check 5 findings of your choosing across all three files** by running *their* commands, and record
  for each: reproduces / reproduces-with-difference / does-not-reproduce. Pick at least one
  `source-integrity`, one `attribution`, one `labeling`, one `OUT-OF-CBETA` claim, and one whose severity
  you intend to rank in the top 5 — a ranking built on unverified findings is just a better-formatted guess.
- **Known method gap to close, not inherit:** `dahui_hongzhi`'s `~470 graphs apart` type of claim is only
  reproducible at fragment granularity (8-gram offsets land ~493 apart). Where an inventory asserts an
  offset or distance, re-derive it and publish *your* command. If theirs was loose, say "loose but
  directionally right" rather than silently restating or silently "correcting" it.

## 5. The classification — every finding gets exactly one kind

| kind | meaning | who acts |
|---|---|---|
| `RE-KEY` | a witness exists in the pinned set and carries the passage; the project's field diverges | coder PR |
| `LABEL` | text absent from the claimed witness, no older substitute in the set → honest note, keep text | coder PR |
| `CITATION` | the public claim names a **wrong or absent** work (e.g. `zhaozhou_yulu` citing T47n1987A/B, the 曹山 record; `fayan_yulu` citing T1985/X1321) | coder PR, highest urgency |
| `HUMAN-SOURCE` | older near-complete witness exists outside CBETA (`OUT-OF-CBETA`) | owner/operator; **never** an agent |
| `NONE` | already honest and labelled (e.g. `linji_yulu`, `xinxin_ming`, `zhengdao_ge`, `platform_sutra`) | none |

Rules: a `CITATION` finding outranks a `RE-KEY` of the same document (a false public claim damages more
than a textual variant); `HUMAN-SOURCE` never becomes `RE-KEY` by inference; and **no finding may be
dropped for being inconvenient** — every P0 bullet in the three files appears in your table or in an
explicit "deferred, reason" list.

## 6. Ranking, and the disagreement report

Rank findings by: false public claim > fabricated text (graphs attested in no ref) > unattested-and-
undisclosed > divergent-but-labelled. Then write `## Disagreements`, listing (a) any two inventories that
characterise the same document differently, (b) any of your spot-checks that failed to reproduce, (c) any
finding you could not classify from the text alone. Silence here is suspicious: with 70 bullets from three
independent authors, expect at least a few. (Known cross-file pair to check: `fayan_yulu`'s citation of
X1321 appears in 006, while 007b's X-series pass covers the Mazu/Fayan adjacency — confirm they do not
describe the same defect with opposite severities.)

## 7. The three stale-fact corrections (the only edits to existing files)

1. `STATE.md` — the "Next (in order)" list currently opens with
   `1. platform_sutra remediation — blocked on an owner recension ruling: CBETA T2008 宗寶 vs Dunhuang T2007.`
   That is false: the ruling was given and #35 implemented it as labelling. Replace the entry with the true
   state (`platform_sutra` labelled via #35; text decision awaiting this plan).
2. `STATE.md` — it links `WITNESS_INVENTORY.md` (006) but **not** the other two. Add one link line for
   `PHASE2_PLAN.md` and pointers to both other inventories.
3. `REMEDIATION_PLAN.md` §5 Wave-1 checklist — `platform_sutra ☐` with no state. Record it as
   `labelled (#35); text decision deferred to PHASE2_PLAN` — **do not tick it done**, and leave the box
   unchecked: the wave genuinely is not finished.

Do not rewrite history, do not "tidy" other lines, do not touch the 006/007a/007b files (they are the
evidence record — immutable once merged).

## 8. Allowed paths (hard scope)

```
.orchestrator/PHASE2_PLAN.md            (new; yours)
.orchestrator/STATE.md                  (§7.1, §7.2 only)
.orchestrator/REMEDIATION_PLAN.md       (§7.3 only)
```
**Nothing else.** No `data/**`, no `docs/**`, no `scripts/**`, no `sessions/**`, no `README.md`,
`AUDIT.md`, `HANDOFF.md`, nothing under `.github/`. If a correction you want requires another path, report
it in the PR body instead of making it.

## 9. Gate hazard — read before writing any prose anywhere in this repo

`scripts/validate_data.py` has two rules that can catch a consolidation document. Both were re-read from
the source at authoring time; my earlier draft of this section misstated the first one, so trust the code:

1. **The five-ledger / evidence-figure rule applies to `README.md`, `AUDIT.md`, `HANDOFF.md`,
   `ROADMAP.md`, `.orchestrator/REMEDIATION_PLAN.md` — NOT to `STATE.md`.** Each of those five must contain
   verbatim `The Reader keeps **five separate, always-visible ledgers**: <labels>` and
   `**35 documents, 630 flagged source fields**` plus both register paths. **These strings are generated
   from `data/project_metrics.json` (`corpus.source_review`), so grepping the script for them finds
   nothing** — read the values off the metrics file before you touch any of those documents. `STATE.md` is
   only required to contain the authoritative flagged total (`630`) and either `CORRECTED` or `superseded`.
   So: **§7.3 edits `REMEDIATION_PLAN.md`, which IS gated — append the `platform_sutra` state inside the
   checklist line itself and change nothing else in that file.**
2. **Per-line rules that can fire on new prose** (scanned files are `README.md`, `AUDIT.md`, `HANDOFF.md`,
   `ROADMAP.md`, `index.html`, `.orchestrator/STATE.md`):
   - a line containing `T1987` is an error unless the same line also contains `false` or `caoshan`
     (case-insensitive). `zhaozhou_yulu` is your top finding and its witness id is T1987 — **so write
     "T1987 … the Caoshan record" on one line, never a bare T1987 mention.** `PHASE2_PLAN.md` is not
     scanned, but STATE.md is, so §7.2's link line must not add an unqualified T1987 reference.
   - a line stating the superseded totals (`622` historical, `637` report) without a qualifier from
     `supersed / historical / 2026-09-09 / corrected / not reproduced / never reproduced / addendum` is an
     error. If you cite those numbers at all, qualify them in the same line.
   - `REMEDIATION_PLAN.md` additionally forbids a bare `174` (must be labelled superseded) and must keep
     quoting the committed historical manifest's entry count.
Run the §10 gates and fix **your prose**, never a checker. If a gate demands an edit outside §8's allowed
paths, stop and report it — that means the finding is real and belongs in the PR body, not in the file.

## 10. Gates — all must exit 0, in a real clone (never a `git worktree`)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py --write-metrics
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
diff -rq data docs/data
git diff --check
```
Your PR changes no data, so every artifact must be byte-identical: if any of those paths shows as modified
after the build, you touched data and must revert it. `--skip-docs` is never permitted on
`validate_data.py`. `scripts/w1_evidence.py` is an imported module, not a CLI.

## 11. Also produce: the Phase-2 owner decision block

End `PHASE2_PLAN.md` with `## Owner decision required`, containing exactly the questions that cannot be
answered by measurement, each with options and a recommendation:

1. **Fabricated text** (e.g. `dahui_hongzhi`'s 默照銘 tail attested in no witness; `guiyang_yulu` /
   `yuanwu_letters` at 0 of N in everything). Options: (a) replace with witness text where one exists in
   CBETA; (b) keep and label as project composition with the claim removed; (c) remove the document from
   the public set. **Recommendation: (b) now, (a) where the pinned set carries the passage** — because
   (c) is a curation decision and (a) is already what `RE-KEY` covers.
2. **False citations** — the `CITATION` set. There is no (b): a public claim naming the wrong work should
   simply stop being said. Note the asymmetry you must record: `README.md`, `AUDIT.md` and `HANDOFF.md` are
   already *gate-enforced* (`validate_data.py`) to state that Zhaozhou's claimed T1987 is the Caoshan
   record and that the claim is false — so the prose around the corpus knows it is false while
   `data/corpus/zhaozhou_yulu.json` still asserts it via `cbeta_id`/`coverage_note`. The public documents
   and the data contradict each other **by design of the gate**, which is the strongest possible argument
   for fixing the record. Ask only whether to fix all `CITATION` findings in one PR or per document
   (**recommend one PR**, since the edits are all note/citation strings of one kind).
3. **`HUMAN-SOURCE` queue** — 35 `OUT-OF-CBETA` markers name witnesses agents must not fetch (Dunhuang
   P.3018, 趙州錄 editions, the 白頭宮女 recension of the Five Ranks). Present it as a list for a human to
   sequence; state plainly that no agent work is authorised against it.
Ask nothing that measurement already settled, and do not pretend this PR can resolve any of it.

## 12. Commits, PR body, report

```
1. docs: add Phase-2 consolidation plan over the three W1 witness inventories   (PHASE2_PLAN.md)
2. docs: correct stale platform_sutra and inventory-link state in the trackers  (§7 edits)
```
PR body: base SHA + the `b3cd14f`-contains check; your §3 counts **with the method you used**; §4's
re-extraction line (`39 verified / 0 drift`) and the 5 spot-checks each with its outcome; the ranking table;
`## Disagreements` (or an explicit "none found, here is what I checked"); the §11 decision block; §10 with
every exit status; `git diff --name-only` proving only the three allowed paths; and one line stating that
no data file, artifact, or gate script was modified. Cite real PR numbers via `gh pr view --json number` —
**no `#NN`**, and do not cite a number you have not read back.

Open against `main` and **stop**. Do not merge; the operator merges personally, and review of this PR means
re-running §4 and checking your table against the three sources.

## 13. Non-goals

No corpus edits of any kind, no label PRs smuggled in "while we're here", no re-keying, no new note keys,
no `source_review_status` or manifest changes, no rights work (`rights_manifest.json` sources are
human-reviewed by standing decision), no editing the three inventories, no fetching non-CBETA sources, no
transcribing from memory, and **never generating plausible Classical Chinese** for an unsourced field. If a
finding looks trivially fixable, that is Phase 2's business — your output is the queue, not the fix.
