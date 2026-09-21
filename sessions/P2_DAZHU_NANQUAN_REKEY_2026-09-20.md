# P2 Core Yulu — Dazhu Huihai + Nanquan Puyuan re-key attempt (task 048)

**Date:** 2026-09-20 · **Branch:** `arena/01a0c142-translatechan` (session branch) · **Base:** `main 83f1cbd`
**Target (per dispatch):** `fix/p2-dazhu-nanquan-rekey` (P2-2) — session-branch constraint lands both P2
tasks on the session branch as one commit each (see task 047 report); PR opened from the session branch.
**Reference layer:** CBETA XML P5 @ `dbdea41071e1e260ad84b72faefd4587333cf76d` (upstream HEAD at run time),
40 works extracted with the pinned rule (`scripts/collate_refs.py`, `cbeta-p5-body-cjk-v1`), digests
**40 verified / 0 drift / 0 unlisted / 0 unavailable** against
`sessions/COLLATION_W1_2026-09-20_refs_manifest.txt`; freshly written digest manifest `cmp`-identical.
**Status:** landed and gated. **Re-key attempt executed and measured → NOT landed**
(0 of 6 fields EXACT in any witness for dazhu; 0 of 6 in the claimed X68n1315 for nanquan — both far
below the 80-percent operational threshold of 5 of 6). Retellings retained with honest notes that
record the attempt and its measured outcome.

## 1. What this task produced

* **`data/corpus/dazhu_huihai.json`** — `.coverage_note` rewritten (0 CJK, same as before) from the
  2026-09-16 ledger sentence into the full per-field disclosure of the re-measured collation and the
  failed R-A attempt; six additive dialogue-level `editorial_note` R-B labels (one per field).
* **`data/corpus/nanquan_yulu.json`** — `.coverage_note` rewritten (5 → 7 CJK: 傳燈錄 + 圓悟語錄, once
  each) the same way, now including the correction that the inventory's "雲門 record" claim was wrong —
  the verbatim carrier of s2.d0 is **T47n1997, the 圓悟佛果禪師語錄** (head-verified); six additive
  dialogue-level `editorial_note` R-B labels.
* **`scripts/test_source_preservation.py`** — allowlist extended with exactly the 12 new/changed
  pointers (dazhu: 6; nanquan: 6), each with its provenance comment. Existing 38 corpus files:
  **0 unauthorized** (gate below).
* **`data/project_metrics.json`** — regenerated (`--write-metrics`); the all-string CJK total moves
  **583,291 → 583,293** (the +2 comes from the nanquan coverage note's CJK budget), source-content
  CJK unchanged at 553,011.
* **Docs** — census refreshed in the six pinned docs (101 → 113 total; editorial_note 29 → 41;
  cbeta_note 22, coverage_note 36, recension_note 14; 65 → 77 rendered; 29 labelled documents
  unchanged) with dated census-refresh lines per the series convention; README:85 and AUDIT source
  volume updated to 583,293.
* **Measurement register** — `sessions/COLLATION_REGISTER_2026-09-20_P2_DAZHU_NANQUAN_MEASUREMENT.json`
  (harness per-document registers, merged; measurement only — the authoritative W1 register chain and
  all 38 manifest `source_review_status` values are untouched).

## 2. The re-key attempt, measured

Operational threshold (per dispatch): a re-key lands only if **≥ 80% of content fields are EXACT vs
the claimed witness after re-key (5 of 6)**. Adjudication is per field against all 40 pinned refs.

### `dazhu_huihai` (claimed X63n1223 頓悟入道要門論 / X63n1224 參問語錄)

* **0 of 6** source-content fields EXACT in any of the 40 refs → **re-key NOT landed** (best span
  4 of 6 even counting the near-carriers, i.e. below the 80% bar).
* X63n1223 (listed first, a treatise) contributes **zero runs of 8 or more graphs to every field**.
* X63n1224 (the record proper) rearranges the material:

| field | claimed X63n1223 / X63n1224 | other measured carriers (runs ≥ 8 graphs) |
|---|---|---|
| s0.d0 (60) | 0 / 35 of 60 in three runs (23, 32, 54) | X80n1565 55/60 (10 @71,293 + 15 @71,303 + 30 @71,318); T47n1998A 38/60; X69n1321 (四家語錄卷一, the Mazu fascicle) 27/60; T51n2076 26/60 |
| s0.d1 (54) | 0 / 40 of 54 single run @88 | T51n2076 44/54 single run @58,336 (best); X69n1321 36/54 @2,400; X80n1565 35/54; T47n1998A 32/54 |
| s1.d0 (21) | 0 | none — no run of 8+ in any of the 40 refs (0/14 windows) |
| s1.d1 (50) | 0 | none — no run of 8+ in any of the 40 refs (0/43 windows) |
| s2.d0 (32) | 0 / 28 of 32 @1,353 | X80n1565 23/32 @72,566; T51n2076 20/32 @59,580 |
| s2.d1 (43) | 0 / 16 of 43 @1,381 (opening exchange; the field's closing attribution adds a one-graph name prefix the witness lacks, and its middle compresses the witness's longer answer) | the same 16-graph span also in X80n1565 @72,597 and T51n2076 @59,608 — no complete copy anywhere |

* **Adjudication: keep retellings, record the attempt** (R-B labels per field). A witness that would
  carry a field as written is OUT-OF-CBETA human sourcing, not agent work.

### `nanquan_yulu` (claimed X68n1315 古尊宿語錄)

* **0 of 6** source-content fields EXACT in the claimed X68n1315 (or complete in any of the 40 refs)
  → **re-key NOT landed**.
* Largest shared run with the claimed witness: 23 of 27 (s2.d0), split at variant points
  (10 graphs @433,963 + 13 graphs @433,978).

| field | claimed X68n1315 | other measured carriers (runs ≥ 8 graphs) |
|---|---|---|
| s0.d0 (15) | 8 of 15 @92,337 | X80n1565 9/15 @189,146 (best); T47n1987A/T47n1987B 8/15 |
| s0.d1 (33) | 9 of 33 @92,350 | X80n1565 11/33 @66,082 (best); T51n2076 10/33 @75,502; T48n2004 9/33; T47n1989 8/33 |
| s1.d0 (19) | 0 — no run of 8+ in any of the 40 refs (0/12 windows) | none |
| s1.d1 (28) | 9 of 28 @93,279 | formulaic wording in 9–10-graph spans across 11 refs — T48n2005 (傳燈錄) 9/28 @4,467, T48n2001 10/28, X80n1565 10/28 @73,230, T47n1997 9/28, T48n2003 9/28, T51n2076 9/28, T47n1998A/B 9/28, X67n1309 9/28, X69n1357 9/28 |
| s2.d0 (27) | 23 of 27 split at variant points | **T47n1997 (圓悟佛果禪師語錄, head-verified) 27 of 27 verbatim @114,323** — the only verbatim carrier of any field; T48n2003 20/27; X80n1565 13/27; T47n1998A 13/27; T45n1858 12/27; T48n2001/T48n2004/X67n1309 12/27 |
| s2.d1 (26) | 11 of 26 @434,001 | X80n1565 20/26 @65,513 (best); T48n2001 13/26; T48n2004 13/26; T48n2003 11/26; T51n2076 8/26 |

* **Correction of the record:** `WITNESS_INVENTORY_XSERIES.md` attributed the s2.d0 material to a
  "雲門 record"; the measurement shows the verbatim carrier is **T47n1997 圓悟佛果禪師語錄** (a
  jǔzhuàng record quoting the case) — the new `coverage_note` states this, and the field note leaves
  the actual re-key decision (claimed work's wording vs T47n1997 wording) as a separate RE-KEY work
  item, not landed here.
* **Adjudication: keep retellings, record the attempt** (R-B labels per field). OUT-OF-CBETA sourcing
  of the remaining fields stays owner-held human work.

## 3. Gates (on the landed tree, quoted verbatim)

```
$ python3 -m py_compile scripts/*.py
<no output — PASS>

$ python3 scripts/validate_data.py
✅ DATA VALIDATION PASSED
   corpus=38 | slots=1252 | verified=177 | matrix=21 | locators=1606/1606
   W1 source review: collated=4 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-20 → sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json

$ python3 scripts/build_data_bundle.py
✅ Successfully compiled 38 corpus documents: app_data.js (4,871,076 bytes)
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

## 4. Out of scope (per dispatch)

* **Pages** — deployment/creation out of scope; nothing under the public-scope guard changed.
* **Re-keys** — none landed by design (both attempts measured below threshold); the nanquan s2.d0
  decision (re-key to T47n1997's verbatim wording) and all OUT-OF-CBETA sourcing stay queued.
* **Status** — all 38 `source_review_status` values unchanged (`partial_or_failed_w1_collation`
  stays for both documents; the authoritative register total stays 630).
