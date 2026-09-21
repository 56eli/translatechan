# W1 Source Collation Report — Wumenguan T48n2005 Re-key (2026-09-21)

**Author:** Arena agent (session `arena/01a0c4a6-translatechan`), task P2.8 (Wumenguan proper re-key).
**Corrects:** `sessions/COLLATION_W1_2026-09-09.md` and `sessions/COLLATION_REGISTER_2026-09-09.json`.
**Inherits:** `sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json` — the 12 active document entries in this overlay are that record's entries, unchanged.
**Authoritative register for current status:** `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json`
(generated 2026-09-21 by `scripts/record_wumenguan_evidence.py`, whose register-level blocks are produced by `scripts/collate_corpus.py`'s own functions; digests in `sessions/COLLATION_W1_2026-09-21_WUMENGUAN_refs_manifest.txt`).
**Status scope:** Containment/remediation state, not a rights decision. Source collation does not approve reuse.

## 0. Relationship to the earlier records (read this first)

The 2026-09-09 report/register, the 2026-09-10 correction overlay, and earlier 2026-09-20/21 overlays are **historical evidence and are append-only**. This file is a **new dated overlay**, reinstating `wumenguan`.

| question | record to read |
|---|---|
| what did W1 claim on 2026-09-09 | `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries) |
| what is the authoritative W1 status of the 13 active items | **this** overlay + `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json` (13 documents, 15 flagged entries) |

## 1. What this overlay adds, and what it deliberately does not re-measure

This overlay reinstates **`wumenguan`** (The Gateless Gate 無門關 T48n2005) as the 13th active document, re-keyed from the pinned CBETA XML P5 witness `T48n2005` under extraction rule `cbeta-p5-body-cjk-v1`. All 48 cases tile 7,663 CJK characters verbatim; 207/207 fields EXACT, 0 flagged (151/151 source-content fields collated).

## 2. Flagged-entry reconciliation: 637 → 622 → 15

| figure | records covered | source | meaning |
|---|---|---|---|
| 637 | 34 documents | 2026-09-09 report §3 | **superseded.** Not reproducible from any committed artifact; contradicted by its own register. |
| 622 | 34 documents | `sessions/COLLATION_REGISTER_2026-09-09.json`, sum of `flagged` | historical register total. |
| **15** | **13 documents** | `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json` | **authoritative.** 13 active documents post-purge. |

## 3. Reference extraction, pinned upstream, and digest verification

```
rule id   cbeta-p5-body-cjk-v1
rule      tei:text/tei:body document-order text; drop the subtree of every tei:note and tei:g
upstream  https://github.com/cbeta-org/xml-p5 @ dbdea41071e1e260ad84b72faefd4587333cf76d
```

Verification results for the 18 works the collator actually reads:

| comparison | verified | drift | unlisted |
|---|---:|---:|---:|
| against `sessions/COLLATION_W1_2026-09-21_WUMENGUAN_refs_manifest.txt` | 18 | 0 | 0 |
| against `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` | 18 | 0 | 0 |

## 4. The overlay-only document(s), and the overlay-only records

`wumenguan`: Content fields: 151 measured, 151 collated, refs_verified = 1 / refs_total = 1.

## 5. Recomputed status counts (from evidence, not transcribed)

Derived from the merged evidence for all 13 manifest items by `source_review.derive_status()`:

| status | count | documents |
|---|---:|---|
| `collated_to_claimed_witness` | 11 | `wumenguan`, `zhengdao_ge`, `congronglu`, `chuandenglu_full`, `caoshan_benji`, `huangbo_fayao_full`, `mazu_guanglu_full`, `yunmen_guanglu_full`, `dongshan_yulu_full`, `zhaozhou_yulu_full`, `dahui_yulu_full` |
| `partial_or_failed_w1_collation` | 0 | |
| `witness_unavailable` | 2 | `hanshan_poems`, `niutou_juezhu` |

Field totals over the 13 entries: **8,725 total fields**, **4,610 content fields**, **4,601 collated content fields**, **4,115 metadata fields, 0 of them non-collating**.

`documents_classification_identical = 11` of 12
`documents_with_changed_status = 1`

## 6. Invariants preserved by this correction

- All active documents validate with 0 errors.
- Designated authoritative flagged total is 15.

## 7. Committed digests and how to reproduce this overlay

```
sha256(sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json) 9d970373cfd6d988b5fa9a77065edba0faef61e4d9307c9632a36a50f5890824
sha256(sessions/COLLATION_W1_2026-09-21_WUMENGUAN_refs_manifest.txt) bbb1ca9fbb5bbe3611a73bf4fa1c61471909740cf8014e1d7a0269ce4ca21941
```

## 8. What this overlay does not claim

Re-keying Wumenguan grants no rights: witness text carries the pinned extraction's edition, not permission to reuse.
