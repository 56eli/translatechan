# P1 — Complete marking: ten collated documents become `complete_selected_witness` (task 058, 2026-09-22)

**Scope.** `main` @ `0d0b1ff` carried 14 documents of which exactly one — the re-keyed Gateless Gate —
was `complete_selected_witness`, while ten more documents already met every condition of the
validator's completion rule except the editorial status itself: each is `collated_to_claimed_witness`
with 0 flagged fields, each declares a `unit_targets` value equal to the units present, and each was
produced by a pinned-witness extractor that asserts a verbatim, contiguous tiling. The 2026-09-19
roadmap (`.orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md`) still said "0 fully ingested". This
session marks the ten documents complete — after re-deriving the evidence independently rather than
trusting the notes — regenerates the deterministic metrics and bundle, retires the containment-era
"no current `complete_selected_witness`" doc rule in favour of generated-number rules, and pins the new
state in the test suites.

**Base / branch.** `main` @ `0d0b1ffa2987a32a3457af351c9ffd668e30af80` (fetched and verified:
`origin/main` = `0d0b1ff`, 14 docs, 12 collated + 2 unavailable, 1 complete, 13 not complete) →
session branch `arena/01a0c881-translatechan` (the task's target designation `fix/p1-complete-marking`;
Arena sessions are fixed to their `arena/<session>` branch, so the designation is recorded here rather
than used as a branch name).

## 1. Before / after — `data/corpus_manifest.json`

Only `completion_status` changed, on exactly ten items; `unit_targets` and `source_review_status`
were already present and are unchanged. No corpus file was touched (`scripts/test_source_preservation.py`:
0 permitted, 0 unauthorized).

| key | witness | units present | `unit_targets` (unchanged) | W1 status (unchanged) | completion before | completion after |
|---|---|---:|---|---|---|---|
| `congronglu` | T48n2004 | 100 cases | `{cases: 100}` | collated_to_claimed_witness | partial_selected_witness | **complete_selected_witness** |
| `chuandenglu_full` | T51n2076 | 1274 cases | `{cases: 1274}` | collated_to_claimed_witness | partial_selected_witness | **complete_selected_witness** |
| `caoshan_benji` | T47n1987A | 84 cases | `{cases: 84}` | collated_to_claimed_witness | partial_selected_witness | **complete_selected_witness** |
| `huangbo_fayao_full` | T48n2012A | 19 cases | `{cases: 19}` | collated_to_claimed_witness | partial_selected_witness | **complete_selected_witness** |
| `mazu_guanglu_full` | X69n1321 | 35 cases | `{cases: 35}` | collated_to_claimed_witness | partial_selected_witness | **complete_selected_witness** |
| `yunmen_guanglu_full` | T47n1988 | 776 cases | `{cases: 776}` | collated_to_claimed_witness | partial_selected_witness | **complete_selected_witness** |
| `dongshan_yulu_full` | T47n1986A + T47n1986B | 322 cases | `{cases: 322}` | collated_to_claimed_witness | partial_selected_witness | **complete_selected_witness** |
| `zhaozhou_yulu_full` | X68n1315 juan 13–14 | 80 cases | `{cases: 80}` | collated_to_claimed_witness | partial_selected_witness | **complete_selected_witness** |
| `dahui_yulu_full` | T47n1998A + T47n1998B | 1354 cases | `{cases: 1354}` | collated_to_claimed_witness | partial_selected_witness | **complete_selected_witness** |
| `linji_yulu` | T47n1985 | 107 sections | `{sections: 107}` | collated_to_claimed_witness | partial_selected_witness | **complete_selected_witness** |
| `wumenguan` | T48n2005 | 48 cases (+2 preface, 5 epilogue) | `{cases: 48}` | collated_to_claimed_witness | complete_selected_witness | complete_selected_witness (unchanged) |
| `zhengdao_ge` | T48n2014 | 6 stanzas | — (none declared) | collated_to_claimed_witness | excerpt_seed | excerpt_seed (unchanged) |
| `hanshan_poems` | — | 4 stanzas | — | witness_unavailable | excerpt_seed | excerpt_seed (unchanged) |
| `niutou_juezhu` | — | 3 sections | — | witness_unavailable | excerpt_seed | excerpt_seed (unchanged) |

Unit-count inventory (step 1 of the task), read straight from `data/corpus/*.json`: every
`unit_targets[unit]` equals `len(document[unit])` — the manifest check that rejects
`present > target` and the completion rule that requires `present >= target` are both satisfied
with equality, so the targets are honest measurements, not ceilings.

## 2. Evidence — re-derived, not copied

### 2.1 References and register, reproduced

* The 19 CBETA XML P5 witness files named by the authoritative digest manifest were fetched at the
  pinned revision `dbdea41071e1e260ad84b72faefd4587333cf76d` (via the GitHub REST/blob API —
  `raw.githubusercontent.com` is unreachable from the sandbox). Every witness file's sha256 matches
  the digest each document's `cbeta_note` records (e.g. T47n1985 `d095b9ca…`, T47n1987A `d0d0336d…`,
  T48n2004 `838d8713…`, X68n1315 `adcddde4…`, T51n2076 `41e4717c…`).
* `scripts/collate_refs.py --source-dir … --verify-against sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt`
  → **19 verified, 0 drift, 0 unlisted, 0 unavailable**.
* `scripts/collate_corpus.py --reproduce sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json --refs-dir /tmp/refs`
  (with `--doc` for the 14 active keys, because the harness `DOCS` map still lists the 30 purged
  keys) → aggregate `documents 14 | flagged 15 | fields 8940 | content 4717, collated 4708 | EXACT 8925`,
  status counts 12 / 0 / 2 — and every one of the 14 per-document measurement blocks is JSON-equal to
  the committed register (the only differences are the three operator-written `witness_note` prose
  fields, which are not measurements). The 630 → 15 designation history is untouched; nothing was
  re-designated.

### 2.2 Tiling, measured independently

Machine-readable record: [`P1_COMPLETE_MARKING_2026-09-22_tiling.json`](./P1_COMPLETE_MARKING_2026-09-22_tiling.json)
(sha256 `e3e214f05a619d19ff7013d94058bdcfd1c3a0848e88d1ba13b152154165f2d5`). Method: walk each
document's source-content fields in document order and locate each one forward of a cursor in the
reference extraction; record the covered region, the reference text before and after it, any interior
gap no field carries, and any field found only inside an earlier unit (nested overlap) or nowhere.

| key | reference CJK | region walked | covered CJK | interior gaps | outside the region (disclosed in `coverage_note`) | verdict |
|---|---:|---|---:|---|---|---|
| `caoshan_benji` | 12,343 | [0, 12343] | 12,343 | 0 | none | tiles the whole witness |
| `huangbo_fayao_full` | 6,632 | [0, 6632] | 6,632 | 0 | none | tiles the whole witness |
| `mazu_guanglu_full` | 4,732 | [0, 4732] | 4,732 | 0 | none | tiles the whole witness |
| `yunmen_guanglu_full` | 43,678 | [0, 43678] | 43,678 | 0 | none | tiles the whole witness |
| `dongshan_yulu_full` | 15,843 + 8,596 | [0, 15843] + [0, 8596] | 24,439 | 0 | none | tiles both witnesses whole |
| `dahui_yulu_full` | 182,132 + 19,941 | [0, 182132] + [0, 19941] | 202,073 | 0 | none | tiles both witnesses whole |
| `linji_yulu` | 16,366 | [0, 16366] | 16,366 | 0 | none | tiles the whole witness |
| `zhaozhou_yulu_full` | 445,450 (whole 古尊宿語錄) | [101821, 122859] | 21,038 | 0 | the other masters' juan of the anthology (101,821 before / 322,591 after) | tiles the declared juan 13–14 region |
| `chuandenglu_full` | 358,501 | [3995, 354264] | 350,269 | 0 | 3,995 CJK before the fascicle-1 heading, 4,237 after fascicle 30 — exactly the note's figures; 13 nested sub-verses (770 CJK) found inside their parent works, the note's listed overlaps | tiles the 30-fascicle region |
| `congronglu` | 88,155 | [1980, 88136] | 85,511 | 99 gaps, 645 CJK, all structural (below) | 1,980 CJK front matter (prefaces, letter, Wansong's preface, 目錄, fascicle-1 heading, compiler line); 19 CJK closing `…從容庵錄卷六` | every field verbatim, contiguous, in order; no case text omitted |

The Congronglu gaps were classified one by one: **94** are the witness's own case-name marker — it
prints e.g. `達磨廓然` before the heading `第二則達磨廓然`, and the document carries the heading once —
and **5** (before cases 17, 33, 54, 67, 83) are the fascicle boundaries (`…從容庵錄卷N` close, the next
`…從容庵錄N侍者離知錄後學性一校生生道人梓` heading, then the marker). Nothing between the start of
case 1 and the final fascicle close is case text that a field fails to carry. Covered totals reconcile
with the documents' own `zh_chars`: Congronglu 85,511 − 857 `title_zh` metadata = 84,654; the
Chuandeng Lu 350,269 + 770 nested duplicates = 351,039; every other document equals its `zh_chars`.

### 2.3 What "complete" means here — and does not

`complete_selected_witness` is counted by `complete_document_keys()` only when the item is
`collated_to_claimed_witness` **and** every declared unit target is met; the status itself is an
editorial claim. The claim these ten marks make, verified above, is: *the document's units are a
verbatim, contiguous tiling of the pinned witness region under extraction rule `cbeta-p5-body-cjk-v1`,
nothing omitted, reordered or duplicated beyond what the `coverage_note` discloses.* It is the same
standard the Gateless Gate was marked under on 2026-09-21 (48 case containers verbatim and contiguous;
the witness's 目錄 and duplicated case-name heads are likewise not carried).

It is **not** a claim that:

* the interlinear apparatus is represented — the pinned rule drops every `tei:note`/`tei:g` subtree
  (Congronglu's 7,716-CJK 著語 layer, the Chuandeng Lu's apparatus) and each `coverage_note` says so;
* front and back matter outside the tiled region is represented — Congronglu's 1,980-CJK front matter
  and the Chuandeng Lu's 3,995 + 4,237 CJK are disclosed, not claimed;
* a human has signed the collation off, or that any reuse is approved — the source-review block's
  scope line and non-approval statement are unchanged ("Containment/remediation state, not a rights
  decision." / "Source collation does not approve reuse.");
* the English layer is anything other than what its per-slot `status` says.

The 2026-09-21 enthusiast session deliberately declined to claim completion for the six full-witness
records ("interlinear commentary, prefatory material that lives in other witnesses, and human sign-off
are out"). Those three facts are still true and still disclosed; what changed is the owner's dispatch
(task 058, in `0d0b1ff`) that the tiling-of-the-selected-witness standard already applied to the
Gateless Gate is the project's definition of complete, and the independent re-measurement above that
each of the ten meets it.

## 3. Changes

* `data/corpus_manifest.json` — ten `completion_status` values `partial_selected_witness` →
  `complete_selected_witness` (sha256 `d0487412…`). Nothing else in the file moved.
* `data/project_metrics.json` — regenerated with `--write-metrics` (sha256 `0fc290aa…`):
  `complete_documents` `["wumenguan"]` → the sorted 11-key list; `incomplete_documents` 13 → 3;
  `completion_statuses` `{complete 1, excerpt_seed 3, partial 10}` → `{complete 11, excerpt_seed 3}`;
  ten `per_text[*].completion_status`/`is_complete` flips. CJK totals (775,113 / 832,897), the W1
  ledger (14 docs, 15 flagged, 12/0/2), locators (4092/4092) and every other block are byte-identical.
* `app_data.js` + `docs/` mirror — rebuilt (7,513,283 → 7,513,447 B; sha256 `085a57a8…`); two
  consecutive builds byte-identical; `diff -rq data docs/data` clean.
* `scripts/validate_data.py` — doc-truthfulness: the containment-era rule "README must say no current
  `complete_selected_witness` exists" (true at 0 of 35 on 2026-09-09, already false-by-exception after
  the 2026-09-21 Wumenguan re-key) is replaced by generated-number rules: README/AUDIT/HANDOFF/
  RESEARCH_RELEASE_PLAN must quote `**{n} of {documents} documents** are `complete_selected_witness``,
  ROADMAP must quote `**Phase 2 — `{n}/{documents} complete`**`, and README must name every document
  that is *not* complete by key (so the remainder is never hidden behind a count).
* `scripts/test_source_review_rules.py` — the `complete_documents == ["wumenguan"]` pin becomes the
  exact sorted 11-key list plus `is_complete` true for exactly those keys (check count stays 145).
* `scripts/smoke_test.mjs` — shelf groups pinned to Complete 11 / Excerpt seeds 3 with no
  `partial_selected_witness` group rendered and exactly 11 `is-complete` marks; the N/N ratios that the
  shelf no longer shows for complete rows must remain visible in the Reader's represented-units ledger
  (`congronglu` 100/100, `caoshan_benji` 84/84) next to "Complete selected witness"; a new ledger case
  for `congronglu` requires the completion mark *and* the `coverage_note`'s "Coverage gaps, recorded
  rather than implied absent" disclosure on the same screen. Each new assertion was verified to fail
  when its expectation is deliberately broken.
* Docs quoting the completion count: `README.md` (honest-status paragraph), `AUDIT.md` §1 current
  verdict, `HANDOFF.md` (the completion paragraph — which still described Xinxin Ming, Biyanlu and the
  Platform Sutra, all purged on 2026-09-21 — is rewritten and the old sentence retired by name),
  `ROADMAP.md` (Phase 2 `1/14` → `11/14`, repo-tree comment), `RESEARCH_RELEASE_PLAN.md` (corpus bullet;
  "the only `complete_selected_witness` item" sentence), `vision.md` (the dated 2026-09-21 measurement
  "13 documents, 0 complete, 4,557 of 4,566" was already stale against `main`; re-measured 2026-09-22 as
  14 / 11 / 4,708 of 4,717). `.orchestrator/STATE.md` gets a dated delivery entry.

Untouched on purpose: every `data/corpus/*.json` (the `coverage_note` sentences "Representation does
not establish complete selected-witness status" remain literally true — representation did not
establish it, the editorial mark did); the evidence registers (append-only); `export_manifest.json` /
`export_ready.json` (pinned to commit `1753ca0`, see §5).

## 4. Gate outputs (after the change)

```
$ python3 -m py_compile scripts/*.py
OK
$ python3 scripts/validate_data.py
✅ DATA VALIDATION PASSED
   corpus=14 | slots=46 | verified=1 | matrix=21 | locators=4092/4092
   W1 source review: collated=12 | partial/failed=0 | unavailable=2 | flagged=15 | evidence=2026-09-21 → sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json
$ python3 scripts/build_data_bundle.py   (run twice)
✅ Successfully compiled 14 corpus documents: app_data.js (7,513,447 bytes)
085a57a871270c5e7ac12e006dfc7f17945e10e882fb6dda5562a28e9b441588  app_data.js        (both runs, root and docs/)
$ diff -rq data docs/data
(clean, exit 0)
$ python3 scripts/test_source_preservation.py
✅ SOURCE-PRESERVATION OK: 12 corpus files match base commit f1207eaf4618 apart from the allowlisted remediation pointers; 0 unauthorized changes
   (2 declared new: linji_yulu, wumenguan; 0 permitted allowlisted changes)
$ python3 scripts/test_source_review_rules.py
145 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK
$ node scripts/smoke_test.mjs
RENDERER: 14 corpus texts exercised, 0 crashes
✅ SMOKE TEST PASSED
$ python3 -c "import json;m=json.load(open('data/project_metrics.json'))['corpus'];print(m['documents'],len(m['complete_documents']),m['excerpt_seed_documents'])"
14 11 3
```

Baseline (before the change, same tree at `0d0b1ff`): validate PASS with the same ledger line,
bundle 7,513,283 B deterministic, preservation 0/0, review 145 PASS, smoke PASS, mirror clean —
i.e. the only gate-visible delta is the completion count.

## 5. Follow-ups this session does not do

* **Export re-issue.** `export_manifest.json` (commit `1753ca0`) hashes `data/corpus_manifest.json` and
  `data/project_metrics.json`, and `docs/sample_export.jsonl` still carries
  `completion_status: partial_selected_witness` on five passage records. The pinned export stays valid
  for its own commit (delivery is git-clone-at-commit), but the next re-issue must re-pin after this PR
  merges and the sample records should then read `complete_selected_witness` for the affected parents.
* **Stale surfaces outside this task's scope, noted for the next dispatch:** the README corpus table
  still lists purged documents (Blue Cliff Record, Xinxin Ming, Platform Sutra, the withdrawn Zhaozhou
  seed, "+28 further yulu"); `scripts/browser_test.mjs` (optional, not in CI) pins the 35-document
  shelf (2 complete / 2 partial / 31 excerpt); `scripts/collate_corpus.py`'s `DOCS` map still lists the
  30 purged keys, so a bare `--reproduce` of the 14-document register fails on the first missing file
  unless `--doc` is given fourteen times.
* **`zhengdao_ge`** is collated with 6/6 stanzas EXACT and 1 metadata flag but declares no
  `unit_targets`; whether the six stanzas are the whole of T48n2014 under the pinned rule was not
  measured here and it stays an excerpt seed.
