# W1 Source Collation Report — Wumenguan T48n2005 + Linji T47n1985 Re-keys, Combined Overlay (2026-09-21)

**Author:** Arena agent (session `arena/01a0c618-translatechan`), combined resolution of tasks P2.8 (Wumenguan proper re-key) and P2.9 (Record of Linji re-key).
**Corrects:** `sessions/COLLATION_W1_2026-09-09.md` and `sessions/COLLATION_REGISTER_2026-09-09.json`.
**Inherits:** `sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json` — the 12 active document entries in this overlay are that record's entries, unchanged. The two re-key entries are inherited verbatim from the single-re-key overlays `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json` and `sessions/COLLATION_REGISTER_2026-09-21_LINJI.json`, which stay committed as the evidence each measurement happened.
**Authoritative register for current status:** `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json`
(generated 2026-09-21 by `scripts/record_wumenguan_linji_evidence.py`, whose register-level blocks are produced by `scripts/collate_corpus.py`'s own functions; digests in `sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt`).
**Status scope:** Containment/remediation state, not a rights decision. Source collation does not approve reuse.

## 0. Relationship to the earlier records (read this first)

The 2026-09-09 report/register, the 2026-09-10 correction overlay, and the 2026-09-20/21 overlays are **historical evidence and are append-only**. This file is a **new dated overlay**, reinstating `wumenguan` and re-keying `linji_yulu` in one combined step, because the two single-re-key overlays rewrote the same shared surfaces and could not be merged sequentially. The overlay covers each of the 14 current manifest items.

| question | record to read |
|---|---|
| what did W1 claim on 2026-09-09 | `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries) |
| what is the authoritative W1 status of the 14 active items | **this** overlay + `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json` (14 documents, 15 flagged entries) |

## 1. What this overlay adds, and what it deliberately does not re-measure

This overlay reinstates **`wumenguan`** (The Gateless Gate 無門關 T48n2005) and re-keys **`linji_yulu`** (The Record of Linji 鎮州臨濟慧照禪師語錄 T47n1985) as the 13th and 14th active documents. Wumenguan was re-keyed from the pinned CBETA XML P5 witness `T48n2005` under extraction rule `cbeta-p5-body-cjk-v1`: all 48 cases tile 7,663 CJK characters verbatim; 207/207 fields EXACT, 0 flagged (151/151 source-content fields collated). The Record of Linji is a from-scratch extraction of the pinned witness `T47n1985`: 107 verbatim sections tile the whole 16,366-CJK fascicle; 215/215 fields EXACT, 0 flagged (107/107 source-content fields collated). The purged Linji retelling was not read, patched, or carried over.

## 2. Flagged-entry reconciliation: 637 → 622 → 169 → 15

| figure | records covered | source | meaning |
|---|---|---|---|
| 637 | 34 documents | 2026-09-09 report §3 | **superseded.** Not reproducible from any committed artifact; contradicted by its own register. |
| 622 | 34 documents | `sessions/COLLATION_REGISTER_2026-09-09.json`, sum of `flagged` | historical register total. |
| 169 | 34 documents | reproduction over the same five compared documents | the 2026-09-21 combined overlay's reproduction: 5 compared, 2 differing (`wumenguan`, `linji_yulu`), flagged 169 → 15. |
| **15** | **14 documents** | `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json` | **authoritative.** 14 active documents post-purge. |

## 3. Reference extraction, pinned upstream, and digest verification

```
rule id   cbeta-p5-body-cjk-v1
rule      tei:text/tei:body document-order text; drop the subtree of every tei:note and tei:g
upstream  https://github.com/cbeta-org/xml-p5 @ dbdea41071e1e260ad84b72faefd4587333cf76d
```

Verification results for the 19 works the collator actually reads:

| comparison | verified | drift | unlisted |
|---|---:|---:|---:|
| against `sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt` (19 works) | 19 | 0 | 0 |
| against `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` (187 works) | 15 | 4 | 0 |

Across all 187 manifest works of the historical 2026-09-09 digest manifest, the four references whose bytes moved against history are declared drift, never rescued: T47n1987B, T48n2001, T48n2004, X68n1315.

## 4. The overlay-only documents, and the overlay-only records

`caoshan_benji`: Content fields: 84 measured, 84 collated, refs_verified = 1 / refs_total = 1.
`chuandenglu_full`: Content fields: 1274 measured, 1274 collated, refs_verified = 1 / refs_total = 1.
`congronglu`: Content fields: 500 measured, 500 collated, refs_verified = 1 / refs_total = 1.
`dahui_yulu_full`: Content fields: 1354 measured, 1354 collated, refs_verified = 2 / refs_total = 2.
`dongshan_yulu_full`: Content fields: 322 measured, 322 collated, refs_verified = 2 / refs_total = 2.
`huangbo_fayao_full`: Content fields: 19 measured, 19 collated, refs_verified = 1 / refs_total = 1.
`mazu_guanglu_full`: Content fields: 35 measured, 35 collated, refs_verified = 1 / refs_total = 1.
`yunmen_guanglu_full`: Content fields: 776 measured, 776 collated, refs_verified = 1 / refs_total = 1.
`zhaozhou_yulu_full`: Content fields: 80 measured, 80 collated, refs_verified = 1 / refs_total = 1.

## 5. Recomputed status counts (from evidence, not transcribed)

Derived from the merged evidence for all 14 manifest items by `source_review.derive_status()`:

| status | count | documents |
|---|---:|---|
| `collated_to_claimed_witness` | 12 | `wumenguan`, `linji_yulu`, `zhengdao_ge`, `congronglu`, `chuandenglu_full`, `caoshan_benji`, `huangbo_fayao_full`, `mazu_guanglu_full`, `yunmen_guanglu_full`, `dongshan_yulu_full`, `zhaozhou_yulu_full`, `dahui_yulu_full` |
| `partial_or_failed_w1_collation` | 0 | |
| `witness_unavailable` | 2 | `hanshan_poems`, `niutou_juezhu` |

Field totals over the 14 entries: **8,940 total fields**, **4,717 content fields**, **4,708 collated content fields**, **4,223 metadata fields, 0 of them non-collating**.

`documents_classification_identical = 3 of 5`
`documents_with_changed_status = 2`

## 6. Invariants preserved by this correction

- All active documents validate with 0 errors.
- The historical register and report stay committed and unmodified (append-only evidence).
- No drifted or unlisted reference upgrades any status; the four historical drifts stay declared.
- The combined overlay supersedes the two single-re-key overlays `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json` and `sessions/COLLATION_REGISTER_2026-09-21_LINJI.json` for *current status only*; both stay committed as the dated evidence of their measurements.

## 7. Committed digests

* `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json` — sha256 `b8cd90a12a6f5b047c3836af2298042d7bd522fb5f572894244bbc37d9a8ca8b`
* `sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt` — sha256 `8adf999b4269ae1d10392da2e55aa6470c41817cf8aa4cf886cbeeb8b6091813`
