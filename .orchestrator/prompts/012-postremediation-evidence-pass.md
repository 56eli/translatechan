# Task 012 — Publish the post-remediation evidence pass: a new dated collation record, without re-designating the ledger

Working in `56eli/translatechan`. Owner directive 2026-09-12: *"align the project with the vision of perfection of
source integrity, referencing and presentation in its stated goals."* Tasks 010/010b aligned the prose, 011 made the
labels visible. This is the last item that needs no owner decision: **the corpus has been remediated, and the
evidence ledger has never been re-measured to say so.**

**Read §2 and §3 before anything else. This task publishes a measurement. It does NOT take authority away from the
2026-09-10 register, and if you find yourself editing `scripts/w1_evidence.py` or `data/project_metrics.json`, you
have misunderstood the task and must stop and report instead.**

---

## 1. The two facts

**(a) The repo's headline flagged-field number is a 2026-09-10 measurement of a corpus that no longer exists.** Five
documents cite `**35 documents, 630 flagged source fields**`, and `data/project_metrics.json → corpus.source_review`
still reports `content_fields_collated: 593` with `DIVERGENT: 111`. Since that register was published, PRs #29, #30,
#32, #34 and #36 re-keyed flagged text back to its witnesses and replaced fabricated lines with adjudicated labels.
`ROADMAP.md:43` acknowledges this — but it attributes the newer figure to a *scratch measurement recorded in
`.orchestrator/PHASE2_PLAN.md` §2*, not to an evidence record. There is no published post-remediation register, so
today's truth is unquotable. Publish one.

**(b) The evidence model is a hard-wired pair, and cannot absorb a third authoritative record.** Read these lines
before designing anything:

- `scripts/w1_evidence.py:101-113` — `FIXED_METADATA` names exactly one historical register (`…2026-09-09.json`),
  one correction overlay (`…2026-09-10_CORRECTION.json`) and one `authoritative_register_path`.
- `scripts/w1_evidence.py:752-758` — an authoritative record must carry `kind == "w1-correction"` and
  `corrects == "sessions/COLLATION_REGISTER_2026-09-09.json"`, or the validator errors.

So the schema has no slot for "the 2026-09-12 overlay that corrects the 2026-09-10 overlay". Making it exist means
converting a pair into a chain — recomputation, the `historical`/`superseded`/`reproduction` blocks, the metrics
generator, `smoke_test.mjs`'s expected metadata, and the verbatim `evidence_bits` that five documents must carry.
That is a deliberate **re-designation of the evidence**, it is gate-touching, and it is a separate task with its own
owner ruling. **012's deliverable is the evidence that re-designation needs, published in a form the current gates
cannot object to.** `validate_data.py:1240-1243` states the room you are using, verbatim: *"Presence checks pin the
truthful sentences to generated numbers; absence checks forbid the false ones. Dated files under `sessions/` are
historical snapshots and are deliberately not scanned."* You are adding a dated snapshot, not editing a truth claim.

---

## 2. Base check (run all of it; report the output)

Your base must contain `faff161` (PR #40, note rendering) so the labels this register describes are actually visible.

```bash
git rev-parse --short origin/main                     # expect faff161 or a descendant
git merge-base --is-ancestor faff161 HEAD && echo "base ok"
python3 scripts/validate_data.py                      # run the checker FIRST: it names the contract you must not break
for f in README.md AUDIT.md HANDOFF.md ROADMAP.md .orchestrator/REMEDIATION_PLAN.md; do
  printf "%-34s 630=%s authreg=%s histreg=%s histdate=%s\n" "$f" \
    "$(grep -c '\*\*35 documents, 630 flagged source fields\*\*' $f)" \
    "$(grep -c 'COLLATION_REGISTER_2026-09-10_CORRECTION.json' $f)" \
    "$(grep -c 'COLLATION_REGISTER_2026-09-09.json' $f)" "$(grep -c '2026-09-09' $f)"
done
```

Every one of those five files must print a non-zero count in every column. **Those sentences stay verbatim and
untouched for the whole task** — they are generated from `data/project_metrics.json`, which you are not moving. If
the loop prints `0` anywhere, your base predates PR #39; stop and re-sync.

---

## 3. Measure first — a ladder, and the step that is *supposed* to fail

The orchestrator ran this whole ladder on 2026-09-12 at base `faff161` and every expected value below is its actual
output. Re-run it; **confirm, do not copy.**

**3.1 Get the witness.** The recipe in `scripts/collate_corpus.py:25-33` is documentation and it is partly wrong: it
`cd`s twice and its `sed` builds paths from a hardcoded `/repo/` prefix. Build the path list from the manifest in
Python instead — ids contain a lowercase `n`, so never slice them (`T45n1858` → `/T/T45/T45n1858.xml`):

```bash
python3 - <<'PY'
import re
ids=sorted({m for l in open('sessions/COLLATION_W1_2026-09-10_refs_manifest.txt')
            for m in re.findall(r'ref_([TX]\d{2}n\d{3,4}[A-Z]?)\.txt', l)})
assert len(ids)==39, len(ids)
open('/tmp/paths.txt','w').write(''.join(f'/{i[0]}/{i[:3]}/{i}.xml\n' for i in ids))
print(len(ids),'works')
PY
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
git -C /tmp/xmlp5 sparse-checkout set --no-cone $(tr '\n' ' ' < /tmp/paths.txt) && git -C /tmp/xmlp5 checkout
find /tmp/xmlp5 -name '*.xml' | wc -l                                  # expect: 39
git -C /tmp/xmlp5 rev-parse HEAD        # must equal w1_evidence.PINNED_UPSTREAM_REVISION dbdea41071e1e260ad84b72faefd4587333cf76d
```

Never put the clone inside the repository. If HEAD differs from the pinned revision, **stop and report**: the
upstream moved, and that is an owner-level event, not a task detail.

**3.2 Extract and verify the reference layer with the committed rule:**

```bash
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
  --work-list sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt
```

Expect `references: 39 work(s)` and `digest verification: 39 verified, 0 drift, 0 unlisted, 0 unavailable`. Anything
but `0 drift` means the reference layer is not comparable to the published register: stop and report. **Do not
generate a new digest manifest.** The digests are byte-identical to the committed ones; re-publishing them under a
new name creates two files claiming authority over the same references.

**3.3 Reproduce the overlay, and record what you find.** `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` §7 tells
you `--reproduce` plus `cmp` proves the bytes:

```bash
COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --out /tmp/replay.json \
  --reproduce sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json
cmp /tmp/replay.json sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json   # THIS FAILS TODAY. It is expected.
```

`--reproduce` replays the recorded *generation parameters*, but the corpus under those parameters has moved.
Orchestrator's measured diff: **47 differing JSON keys — 7 in `aggregate`, 5 in `reproduction`, 35 inside
`documents`, affecting exactly 5 documents**: `biyanlu_cases`, `deshan_yulu`, `linji_yulu`, `wumenguan`,
`xinxin_ming`. Those are the five documents the remediation campaign touched; the other 30 documents, the whole
reference layer, and both manifests reproduce byte-for-byte.

Two things follow, and both belong in your report:

- The published §7 claim that "the documented command and the committed bytes cannot drift apart" is only true while
  the corpus is static. Do not "fix" it in this PR and do not edit the report — the `cmp` failure is *evidence of
  remediation*, not a broken environment. Report it as a finding.
- `deshan_yulu`'s single differing field is `witness_note`, where the replay prints `X68n1315` and the committed
  register prints `X1315`. That is **not** a corpus change: `data/corpus/deshan_yulu.json` has no such string at all.
  The note is assembled from a hard-coded witness table inside `scripts/collate_corpus.py` (≈`:214-242`) whose ids
  were normalised in `7cde460`. Know this, because the corollary matters for the rest of your run: **part of the
  witness claim lives in the harness, not the data.** Never "correct" a witness id by editing `data/corpus/*.json`.

**3.4 Produce the record** (see §4.2 for why each flag is there):

```bash
python3 scripts/collate_corpus.py --help | grep -c reproduce            # confirm the flag exists in YOUR checkout
RUN_DATE=$(date -u +%F); echo "RUN_DATE=$RUN_DATE"                      # use this date everywhere; do not reuse 2026-09-12
COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py \
  --out /tmp/register_${RUN_DATE}.json --generated "$RUN_DATE" \
  --kind w1-post-remediation-measurement \
  --refs-manifest sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
  --compare-register sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json \
  --require-verified-refs \
  --upstream-revision "$(git -C /tmp/xmlp5 rev-parse HEAD)" \
  --note "measurement-only record: this register is not designated authoritative, data/project_metrics.json still reports the 2026-09-10 overlay, and the five documents that cite it keep doing so verbatim" \
  --note "deshan_yulu's witness_note delta versus the 2026-09-10 register is a harness-side id normalisation (7cde460), not a corpus change"
```

Print the aggregate block and the per-document delta; those numbers, not prose, are your deliverable.

---

## 4. What to publish

### 4.1 Two new files under `sessions/`

`sessions/COLLATION_REGISTER_<RUN_DATE>_POSTREMEDIATION.json` and
`sessions/COLLATION_W1_<RUN_DATE>_POSTREMEDIATION.md`. The date is the day the run happened, in the naming style of
the existing `…_2026-09-10_CORRECTION…` pair. **The register is committed exactly as the harness wrote it**: before
moving it, `cmp /tmp/register_<date>.json <staged path>` must be clean. A hand-edited evidence record is worse than a
missing one — every number the report needs is already in the JSON, and the JSON has `generation_parameters` so the
command is recoverable.

### 4.2 Flag rules, each of which is load-bearing

| decision | why |
|---|---|
| **do not pass `--corrects`** | the validator requires `corrects == sessions/COLLATION_REGISTER_2026-09-09.json` for `kind == "w1-correction"`; pointing at the 09-10 register while claiming that kind is a contract violation, and pointing at 09-09 would create a second overlay competing for authority |
| **`--kind w1-post-remediation-measurement`** (not the default, never `w1-correction`) | the kind string is how a reader — or a future script — tells an overlay from a measurement; say what it is |
| explicit `--generated "$RUN_DATE"` | a false date in an evidence record is fabrication of the evidence itself |
| `--require-verified-refs` + `--refs-manifest` | an unverified-reference run is not comparable to the authoritative one; this is what earns `39 verified, 0 drift` in the record |
| `--compare-register …2026-09-10_CORRECTION.json` | makes the record self-describing: its own `reproduction` block carries 630 → today, documents compared, classification deltas, and the count of moved statuses |
| `--compare-historical-refs …2026-09-09_refs_manifest.txt` | the 187-work anchor is where upstream drift is measured; without it `historical_counts` reads `verified: 0` and looks like a failure |

### 4.3 The report — same shape as the overlay it measures

Mirror the section skeleton of `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` (numbered `## 0.`–`## 7.`, and read
its first 10 lines before writing yours). Required content, in this order:

1. **`## 0. Status of this record (read this first)`** — one paragraph that must say plainly: this is a dated
   post-remediation measurement, it is **not** designated authoritative, `data/project_metrics.json` and the five
   documents that cite the 2026-09-10 register are unchanged, and re-designation is a separate change to the
   evidence model. Include the two pinned sentences verbatim — `Source collation does not approve reuse.` and
   `Containment/remediation state, not a rights decision.` — they are the project's standing scope limits and a
   reader of a fresh register must not have to go elsewhere for them.
2. **What moved, per document** — a table taken from the register's own `reproduction.differences` and each
   document's `summary`, never from an eyeballed total: document, class counts then → now, flagged then → now.
3. **Reconciliation `630 → N`** — the flagged-field delta, attributed to the specific merged PRs that re-keyed or
   relabelled fields, with the sentence *"a reduced flag count is not a finished corpus"*. **Do not write a status
   change that did not happen**: check the register's own `reproduction.documents_with_changed_status` and state the
   number it gives.
4. **What did NOT move** — status counts stay 1 / 32 / 2; `corpus.complete_documents` stays empty; the two
   adjudicated residuals survive as exactly one `DIVERGENT` field each in `linji_yulu` (行錄 67–73) and
   `platform_sutra`; and the 31 `OUT-OF-CBETA` documents still have no witness to collate against.
5. **Reference layer** — the pinned revision, `39 verified, 0 drift`, and the fact that no new digest manifest was
   written (say why, §3.2).
6. **Reproduction** — the exact commands you ran, with output, plus the §3.3 `cmp` finding and its explanation. Any
   number here that you did not paste from a run of your own must be deleted.
7. **Invariants** — the file list `git diff --name-only` gives you, and the byte-identity checks from §7.

Every number in the report is copied mechanically from the register or from a command you pasted. `sha256sum` both
new files and put the digests in the report.

### 4.4 Point the tracker at the published record (docs only)

Edit `ROADMAP.md` **only** here, in a separate commit — repo root; there is no `docs/ROADMAP.md`:

- `:177` — the open item *"**Publish the post-remediation evidence pass**: re-run the collation over current `main`
  and commit a new dated register/report…"*: mark the measurement half done with a link to both new `sessions/`
  files, and leave the re-designation half explicitly open, naming the reason (`w1_evidence.py` fixes the
  historical/overlay pair, so authority cannot move in this PR).
- `:43` — the paragraph that today sources `532` from `.orchestrator/PHASE2_PLAN.md` §2: re-point it at the published
  record. The pinned `**35 documents, 630 flagged source fields**` sentence in `:41` must survive verbatim: the
  register it names is still the authoritative one. Add the newly measured content-collation figure only with
  attribution to your register (the register owns that figure, not the tracker), and keep the existing
  "two different claims, and neither is a completion claim" framing.
- `:163` — the gap note's clause *"*(2) Evidence:* no post-remediation register has been published"*. Once yours is
  merged that is false: re-point it at the two new files, and say which half survives (the authoritative total is
  still the overlay's, because designation has not moved). The `CITATION` / `LABEL` / `RE-KEY` queue rows at
  `:178-181` are not yours — leave them exactly as they are.

If you want to touch `README.md`, `AUDIT.md`, `HANDOFF.md` or `STATE.md`: don't. They cite the authoritative register,
which is still correct, and their pinned strings are a contract.

---

## 5. Expected outcome (review re-measures these)

From the orchestrator's 2026-09-12 run at `faff161`, over 35 documents — confirm against your own output:

| measure | 2026-09-10 register | fresh run |
|---|---|---|
| flagged source fields | 630 | **532** |
| content fields collated / total | 593 / 924 | **691 / 924** |
| `EXACT` | 685 | 783 |
| `DIVERGENT` | 111 | **37** (across 16 documents) |
| `NOT_FOUND` | 334 | 310 (across 33 documents) |
| `MINOR` / `SHORT_UNMATCHED` / `TITLE_COMPOSITE` / `WITNESS_UNAVAILABLE` | 30 / 109 / 32 / 14 | 31 / 108 / 32 / 14 |
| statuses `collated / partial_or_failed / witness_unavailable` | 1 / 32 / 2 | **1 / 32 / 2** (unchanged) |
| documents compared vs the overlay, classification deltas | 34 / 1 | **35 / 4**, `documents_with_changed_status: 0` |
| fields_total, metadata_fields_total | 1315, 391 | 1315, 391 |

`DIVERGENT` falling 111 → 37 is the substantive result: two-thirds of the fabrication-suspect class has been
adjudicated away, and **no document's status moved**. `ROADMAP.md` states no content-collation figure beyond the
register's 593; after this PR a reader can see 691 with a source they can re-run.

Also verify two things, and write them up honestly. (1) Key-set parity: your top-level key set must equal the
authoritative register's exactly (15 keys: `aggregate`, `content_denominator`, `corrects`, `documents`, `generated`,
`generation_parameters`, `harness`, `historical_refs_manifest`, `kind`, `reference_extraction`,
`reference_verification`, `refs_manifest`, `reproduction`, `status_scope`, `upstream`). Orchestrator measured this
parity as complete even without `--corrects`; if your run drops a key, the harness changed — report it.
(2) Do **not** describe the record as ready to be adopted: `w1_evidence.py:752-758` and `:779-783` require an
authoritative record to carry `kind = "w1-correction"`, `corrects = sessions/COLLATION_REGISTER_2026-09-09.json`
and `upstream.revision == PINNED_UPSTREAM_REVISION` (`collate_corpus.py:642` writes the literal `unrecorded` unless
`--upstream-revision` is passed), so a measurement-only kind is by construction *not* a drop-in. Say that plainly in
the report's invariants section: adoption means a deliberate re-run under the overlay flags, or a change to the
evidence model — which is exactly the decision §10 defers to the owner.

---

## 6. Allowed paths (hard scope)

Created: `sessions/COLLATION_REGISTER_<RUN_DATE>_POSTREMEDIATION.json`,
`sessions/COLLATION_W1_<RUN_DATE>_POSTREMEDIATION.md`. Modified: `ROADMAP.md` (repo root). **Nothing else, in any commit.**

Frozen and checked by you before pushing: no path under `data/` (including `data/project_metrics.json`), no path
under `docs/` at all (`docs/app.css`, `docs/index.html` and the generated mirror are frozen), no `scripts/**` — **including `w1_evidence.py` and `validate_data.py`, whose
standing "never edit the checker" rule stays fully in force for this task** — no `schemas/**`, no
`.github/workflows/**`, no `sessions/` file that already exists, no CBETA revision change, no new digest manifest,
no visual/CSS work, and no reformatting of anything you did not come to change. If completing the task appears to
require one of those, the task is not completable as written: stop and report what and why.

---

## 7. Gates — all exit 0, in a real clone (never a `git worktree` or archive export)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
git diff --exit-code data docs            # after the rebuild: ZERO files may be dirty
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
diff -rq data docs/data
git diff --check
git diff --name-status origin/main...HEAD  # must print exactly the 3 paths in §6
python3 - <<'PY'
import json
files=subprocess.check_output(['git','diff','--name-only','origin/main...HEAD']).decode().split()
new=json.load(open(next(f for f in files if f.endswith('_POSTREMEDIATION.json'))))
old=json.load(open('sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json'))
assert set(new)==set(old), (set(new)^set(old))
assert new['kind'] != 'w1-correction', new['kind']   # must not claim overlay status
assert new.get('corrects') is None, new.get('corrects')
assert len(new['documents']) == 35, len(new['documents'])
print('key parity ok; documents:',len(new['documents']),'flagged:',new['aggregate']['flagged_entries'])
PY
```

`smoke_test.mjs` reports a `validate_data.py` failure as a bare number, so run the checker first. And after the
build, `git status --porcelain` must be empty: a regenerated `docs/app_data.js` would mean a `data/` byte moved,
which this task forbids.

---

## 8. Commits

Two, in this order, each independently reviewable:

1. `docs(evidence): publish the post-remediation collation register and report` — the two new `sessions/` files, and
   only those. The register is the harness's bytes.
2. `docs: cite the post-remediation register in the tracker` — `ROADMAP.md` only, with the pinned 630 sentence
   surviving verbatim.

One record set per PR; every evidence-touching change in its own commit; no scoreboard references anywhere in the
diff.

---

## 9. Report

Paste: the §2 precondition output; the §3.1/3.2 outputs (work count, pinned revision match, `39 verified, 0 drift`);
the §3.3 `cmp` result plus the differing-key census; the §3.4 command with its full flag list and its aggregate line;
`sha256sum` of both new files; all §7 gate exits with `git status --porcelain` empty afterwards; the §5 table
re-measured from your own register; and one paragraph answering: *"what would have to change for this register to
become authoritative, and why is it not changed here?"* Do not open, merge, or rebase onto anything; do not push to
`main`.

---

## 10. Non-goals

Re-designating the ledger (owner ruling on pair → chain: `FIXED_METADATA`, `metrics_block()`, the
`historical`/`superseded`/`reproduction` blocks, `smoke_test.mjs`, and the verbatim strings in five documents);
editing `data/project_metrics.json`; changing the pinned `630`/`622`/`637` framing; moving the 31 out-of-CBETA
documents; adjudicating the remaining 37 `DIVERGENT` or 310 `NOT_FOUND` fields; changing `PINNED_UPSTREAM_REVISION`;
repairing the stale acquisition block in `scripts/collate_corpus.py` or the §7 `cmp` claim in the 2026-09-10 report
(both are real defects — report them, do not fix them here); rendering, CSS, or glossary work; and
`title_zh` composite titles.
