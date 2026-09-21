# P2 Core Yulu — Baizhang Guanglu + Huangbo Wanling authenticity labels (task 047)

**Date:** 2026-09-20 · **Branch:** `arena/01a0c142-translatechan` (session branch) · **Base:** `main 83f1cbd`
**Target (per dispatch):** `fix/p2-baizhang-huangbo-authenticity` — session-branch constraint lands both P2
tasks on the session branch as one commit each (see task 048 report); PR opened from the session branch.
**Reference layer:** CBETA XML P5 @ `dbdea41071e1e260ad84b72faefd4587333cf76d` (upstream HEAD at run time),
40 works extracted with the pinned rule (`scripts/collate_refs.py`, `cbeta-p5-body-cjk-v1`), digests
**40 verified / 0 drift / 0 unlisted / 0 unavailable** against
`sessions/COLLATION_W1_2026-09-20_refs_manifest.txt`; the freshly written digest manifest is
`cmp`-identical to the committed one.
**Status:** landed and gated. Authenticity labels per the WITNESS_INVENTORY pattern; **no re-key**
(no verbatim carrier exists in any of the 40 pinned refs for any field of either document).

## 1. What this task produced

* **`data/corpus/baizhang_guanglu.json`** — six additive dialogue-level `editorial_note` R-B labels
  (one per source-content field), each naming the field's measured carrier state. The existing
  `coverage_note` (task 010, 2026-09-14) and `cbeta_note` (ID-correct) are **unchanged** — the
  2026-09-20 re-measurement below reproduces them exactly, so the note text (which quotes the
  39-ref-era measurement) stays true: every number it carries re-verifies on the 40-work set.
* **`data/corpus/huangbo_wanling.json`** — `.coverage_note` rewritten as the full per-field disclosure
  (replacing the 2026-09-14 finding-style sentence), additive `.cbeta_note` (the T2012A/T2012B fascicle
  split and why the T2012B citation stands), seven additive dialogue-level `editorial_note` R-B labels,
  and `.sections[3].editorial_note` closed from "Unit-level collation remains pending" to the measured
  state. No `zh`/`pinyin`/translation field changed; `cbeta_id` T2012B stands.
* **`scripts/test_source_preservation.py`** — allowlist extended with exactly the 15 new/changed
  pointers (baizhang: 6; huangbo: 9), each with its provenance comment. Existing 38 corpus files:
  **0 unauthorized** (gate below).
* **`data/project_metrics.json`** — regenerated (`--write-metrics`); only the two rewritten
  `coverage_note` strings and the all-string CJK figure changed (the rewrite kept the Huangbo
  coverage note's CJK character count at 13 and every new note string ASCII-only).
* **Docs** — provenance-note census refreshed in the six pinned docs (87 → 101 total;
  cbeta_note 21 → 22, editorial_note 16 → 29, coverage_note 36, recension_note 14;
  51 → 65 rendered; 29 labelled documents, unchanged), with dated census-refresh lines per the
  series convention (README/AUDIT carry no census totals; their CJK snippets are unchanged).
* **Measurement register** — `sessions/COLLATION_REGISTER_2026-09-20_P2_BAIZHANG_HUANGBO_MEASUREMENT.json`
  (the harness's own per-document registers, merged; measurement only — the authoritative W1 register
  chain and all 38 manifest `source_review_status` values are untouched).

## 2. Measurement (re-run 2026-09-20 on the digest-verified 40-ref layer)

Harness: `COLLATION_REFS=<refs> python3 scripts/collate_corpus.py --generated 2026-09-20 --doc <key>
--require-verified-refs --refs-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt`;
carrier analysis: greedy longest-first LCS decomposition, floor 8 graphs, per ref, offsets in graphs
of the CJK-only normalized reference (same method as `WITNESS_INVENTORY_XSERIES.md`).

### `baizhang_guanglu` (claimed X69n1323 四家語錄卷三 / X68n1315 古尊宿語錄)

* **0 of 6** source-content fields collate (`{"NOT_FOUND": 6}`); refs 2/2 verified.
* No field carries a run of ≥ 8 graphs in either claimed work (0/44, 0/38, 0/34, 0/27, 0/41, 0/40).
* Carriers of the project's wording (runs ≥ 8 graphs, per ref, with offsets):

| field | claimed X69n1323 / X68n1315 | other measured carriers |
|---|---|---|
| s0.d0 (44) | 0 | none in any of the 40 refs |
| s0.d1 (38) | 0 | none in any of the 40 refs |
| s1.d0 (34) | 0 | **X80n1565 (uncited) 24/34 @60,222** (17 of 27 eight-graph windows) |
| s1.d1 (27) | 0 | **X80n1565 (uncited) 16/27 @60,252** (9 of 20 windows) |
| s2.d0 (41) | 0 | **X80n1565 (uncited) 18/41 @60,428 + @60,441** (6 of 34 windows) |
| s2.d1 (40) | 0 | **X80n1565 (uncited) 28/40 @60,465 + @60,485** (14 of 33 windows) |

* **Adjudication: R-B, no re-key.** The only measured carrier is the uncited 五燈會元 X80n1565, as
  16–28-graph fragments — no field is carried verbatim by any of the 40 refs, so there is nothing to
  re-key to. s0.d0/s0.d1 have no run in any ref. An older complete copy is OUT-OF-CBETA human
  sourcing, not agent work.

### `huangbo_wanling` (claimed T48n2012B 宛陵錄, 4,534 graphs in the pinned extraction)

* **0 of 7** source-content fields collate (`{"DIVERGENT": 1, "NOT_FOUND": 6}`); refs 1/1 verified.
* No field is verbatim in the claimed T48n2012B or in any of the 40 refs.

| field | claimed T48n2012B | other measured carriers |
|---|---|---|
| s0.d0 (38, 裴休 壁上畫像) | 0 (no run ≥ 8; the name 裴休 does not occur in T2012B, which addresses the questioner by title) | none in any of the 40 refs |
| s0.d1 (21) | 0 | none in any of the 40 refs |
| s1.d0 (33, 噇酒糟漢) | 0 (max run 3) | fragments only — max single run 17 graphs; best run total 26/33 T48n2003 @16,495 + @16,512; also T47n1990 @6,720 + @6,737 (23/33), T48n2001 @28,822 + @28,839, T47n1998A, T48n2004, X67n1309, X68n1315, X80n1565, T47n1997, T51n2076, T47n1989 |
| s1.d1 (27) | 0 | X80n1565 10/27 @84,874; X68n1315 9/27 @426,389 |
| s2.d0 (44) | 0 | none in any of the 40 refs (T2012B carries the void-and-mind theme in different wording) |
| s3.d0 (15) | **14/15 @2,571** (DIVERGENT 0.9333) | — |
| s3.d1 (36) | 0 (max run 7) | none ≥ 8 anywhere (compressed retelling of T2012B's own compassion Q&A answer) |

* The s3.d0 near-carrier, measured: the pinned T48n2012B holds the question **anonymously** inside the
  裴相公 session (`…所以有別本源之性何得有別｜問諸佛如何行大慈悲為眾生說法師云…`); the project field
  prefixes the questioner's one-graph attribution, which the witness does not carry. The R-A re-key of
  this DIVERGENT field is a **separate RE-KEY work item**, deliberately not landed in this labelling
  task (task 047: no re-key without a verbatim carrier).
* **Adjudication: R-B, no re-key.** A project retelling bearing the 宛陵錄 name; the citation names
  the right work (T2012B stands — see the new `cbeta_note`); a witness that would carry the text as
  written is OUT-OF-CBETA human sourcing, not agent work.

## 3. Gates (on the landed tree, quoted verbatim)

```
$ python3 -m py_compile scripts/*.py
<no output — PASS>

$ python3 scripts/validate_data.py
✅ DATA VALIDATION PASSED
   corpus=38 | slots=1252 | verified=177 | matrix=21 | locators=1606/1606
   W1 source review: collated=4 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-20 → sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json

$ python3 scripts/build_data_bundle.py
✅ Successfully compiled 38 corpus documents: app_data.js (4,860,738 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: docs (incl. data/ mirror)
   (second build byte-identical — deterministic)

$ python3 scripts/test_source_preservation.py
✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes

$ python3 scripts/test_source_review_rules.py
✅ W1 SOURCE-REVIEW RULES OK   (145 W1 source-review rule checks passed)

$ node scripts/smoke_test.mjs
✅ SMOKE TEST PASSED   (38 texts)

$ diff -rq data docs/data
<clean>
```

Reference-layer reproduction (before the gate run):

```
$ python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --work-list sessions/COLLATION_W1_2026-09-20_refs_manifest.txt \
    --verify-against sessions/COLLATION_W1_2026-09-20_refs_manifest.txt \
    --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
    --write-digest-manifest /tmp/refs/refs_manifest.txt --allow-drift
references: 40 work(s)
digest verification: 40 verified, 0 drift, 0 unlisted, 0 unavailable (against COLLATION_W1_2026-09-20_refs_manifest.txt)
✅ reference extraction/verification complete
$ cmp /tmp/refs/refs_manifest.txt sessions/COLLATION_W1_2026-09-20_refs_manifest.txt
<identical>
```

## 4. Out of scope (per dispatch)

* **Pages** — deployment/creation out of scope; nothing under the public-scope guard changed.
* **Re-keys** — none landed by design (no verbatim carrier); the s3.d0 DIVERGENT re-key and the
  OUT-OF-CBETA sourcing of the 裴休 story stay queued.
* **Status** — all 38 `source_review_status` values unchanged (`partial_or_failed_w1_collation`
  stays for both documents; the authoritative register total stays 630).
