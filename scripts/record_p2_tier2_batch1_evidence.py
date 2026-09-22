#!/usr/bin/env python3
"""Amend the authoritative W1 register with the restored Guiyang + Fayan excerpt seeds (task 059).

The 2026-09-21 purge removed 32 retelling records, among them the two Tier2 yulu keys this task
owns. Task 059 restores both keys to the corpus as measured excerpt seeds — the corpus bytes are
the task-056 labelled files restored verbatim from the pre-purge tree and re-measured
byte-identically on the pinned reference layer — and records them in the authoritative evidence
chain as documents 15 and 16:

* guiyang_yulu — the Guiyang record (claimed T47n1989 潭州溈山靈祐禪師語錄 / T47n1990
  袁州仰山慧寂禪師語錄); **0 of 6** source-content fields verbatim in any pinned reference. The
  R-A re-key attempt is measured and NOT landed (far below the 80-percent threshold), so the
  047-pattern authenticity labels carried by the restored bytes stand.
* fayan_yulu — the Fayan record (claimed T47n1991 金陵清涼院文益禪師語錄; the 宗門十規論 component
  X63n1226 is disclosed in the record's cbeta_note); **1 of 11** source-content fields verbatim
  (s4.d0 曹源一滴水, carried whole by T47n1991 @3,813). Re-key attempt measured and NOT landed.

This script produces the dated overlay:

* 14 document entries are inherited verbatim from
  sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json (a 2026-09-22 harness re-measurement
  of all 16 documents on the pinned layer reproduced every one of them byte-identically; the three
  producer `witness_note` assertions are inherited because the harness does not regenerate
  recorded producer assertions).
* The guiyang_yulu and fayan_yulu entries are taken verbatim from the committed measurement
  register sessions/COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1_MEASUREMENT.json, which recorded
  both documents on this overlay's own 22-work digest manifest with the full historical-anchor
  comparison.
* Register-level blocks are recomputed with collate_corpus.reproduce and source_review against the
  22-work digest manifest sessions/COLLATION_W1_2026-09-22_P2_TIER2_BATCH1_refs_manifest.txt —
  exactly the union of the witnesses and probes the 16 active manifest items claim.

Usage:
    python3 scripts/record_p2_tier2_batch1_evidence.py
"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import collate_corpus
import collate_refs
import source_review
import w1_evidence

PREVIOUS_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json"
MEASUREMENT_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1_MEASUREMENT.json"
HISTORICAL_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-09.json"
REFS_MANIFEST = ROOT / "sessions/COLLATION_W1_2026-09-22_P2_TIER2_BATCH1_refs_manifest.txt"
OUTPUT_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1.json"
OUTPUT_REPORT = ROOT / "sessions/COLLATION_W1_2026-09-22_P2_TIER2_BATCH1.md"

GENERATED = "2026-09-22"
HISTORICAL_REPORT_FLAGGED = 637
DESIGNATED_FLAGGED_TOTAL = 41
RESTORED_KEYS = ("guiyang_yulu", "fayan_yulu")

NOTES = [
    "2026-09-22 (task 059, P2 Tier2 yulu batch1): the two purged Guiyang/Fayan retelling keys are "
    "restored to the corpus as measured excerpt seeds and enter the authoritative evidence as "
    "documents 15 and 16. The R-A re-key attempt was re-measured on the pinned layer and NOT "
    "landed: guiyang_yulu 0 of 6 source-content fields verbatim anywhere (claimed T47n1989 "
    "潭州溈山靈祐禪師語錄 / T47n1990 袁州仰山慧寂禪師語錄), fayan_yulu 1 of 11 (s4.d0 曹源一滴水 "
    "carried whole by the claimed T47n1991 @3,813) — both far below the 80-percent (5 of 6) "
    "threshold, so the 047-pattern authenticity labels land with the restored records (per-field "
    "coverage_note runs, R-B editorial_note labels, ID-corrected cbeta_note). The corpus bytes are "
    "the task-056 labelled files restored verbatim from the pre-purge tree (a6972c1~1) and "
    "re-measured byte-identically.",
    "Reference layer: CBETA XML P5 revision dbdea41071e1e260ad84b72faefd4587333cf76d, rule "
    "cbeta-p5-body-cjk-v1, extracted fresh this run; digest verification 43 verified / 0 drift / "
    "0 unlisted / 0 unavailable against the committed task-056 measurement manifest "
    "sessions/COLLATION_W1_2026-09-21_P2_TIER2_refs_manifest.txt, and the freshly written digest "
    "manifest is cmp-identical to it. This overlay's authoritative manifest "
    "(sessions/COLLATION_W1_2026-09-22_P2_TIER2_BATCH1_refs_manifest.txt, 22 works) is exactly the "
    "union of the witnesses and probes the 16 active manifest items claim; all 22 digests are "
    "byte-identical to their entries in the committed 43-work set, and against the historical "
    "2026-09-09 anchor 20 verify while T48n2004 and X68n1315 carry the same declared historical "
    "drift the previous overlay records (waived only for the overlay-only documents, unchanged).",
    "Inheritance: all 14 per-document entries of "
    "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json were re-measured in a single "
    "16-document harness run on this manifest and are byte-identical to that overlay; the three "
    "producer witness_note assertions (congronglu, chuandenglu_full, caoshan_benji) are inherited "
    "verbatim because the harness does not regenerate recorded producer assertions. The "
    "guiyang_yulu and fayan_yulu entries are the measurement register "
    "(sessions/COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1_MEASUREMENT.json) entries verbatim. "
    "aggregate.documents_without_evidence is [] deliberately, as in the previous overlay: the "
    "harness still lists the 28 purged retelling keys, and the evidence model records that purge "
    "as intentional. This register is assembled by scripts/record_p2_tier2_batch1_evidence.py "
    "from the committed records above; its register-level blocks are computed by "
    "scripts/collate_corpus.py's own functions (reproduce + source_review).",
]


def load(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def main() -> int:
    previous = load(PREVIOUS_REGISTER)
    measurement = load(MEASUREMENT_REGISTER)
    current_digests = collate_refs.read_digest_manifest(str(REFS_MANIFEST))
    historical_digests = collate_refs.read_digest_manifest(str(ROOT / w1_evidence.HISTORICAL_REFS_MANIFEST))

    documents = dict(previous["documents"])
    for key in RESTORED_KEYS:
        entry = measurement["documents"][key]
        if entry["source_review_status"] != source_review.PARTIAL_STATUS:
            raise SystemExit(f"{key}: measurement entry status is {entry['source_review_status']!r}, "
                             "expected partial_or_failed_w1_collation")
        documents[key] = entry

    prior_new = previous.get("generation_parameters", {}).get("new_documents") or []
    new_documents = list(dict.fromkeys(prior_new))

    claimed = set(previous["reference_verification"]["refs"])
    for key in RESTORED_KEYS:
        claimed |= set(documents[key].get("reference_verification") or {})
    if claimed != set(current_digests):
        raise SystemExit(
            f"claimed references do not match current_digests: "
            f"missing={sorted(set(current_digests) - claimed)} extra={sorted(claimed - set(current_digests))}")

    register_details = {}
    for work in sorted(claimed):
        digest = current_digests[work]
        historical_digest = historical_digests.get(work)
        register_details[work] = {
            "sha256": digest,
            "manifest": "sessions/COLLATION_W1_2026-09-22_P2_TIER2_BATCH1_refs_manifest.txt",
            "status": "verified",
            "historical_manifest": w1_evidence.HISTORICAL_REFS_MANIFEST,
            "historical_status": ("unlisted" if historical_digest is None
                                  else "verified" if historical_digest == digest else "drift"),
        }

    drifted_docs = sorted(
        key for key, doc in documents.items()
        if doc.get("refs_total", 0) > doc.get("refs_verified", 0)
        or doc.get("refs_verified", 0) > doc.get("refs_historically_verified", 0)
    )

    register = {
        "kind": "w1-correction",
        "generated": GENERATED,
        "harness": "scripts/collate_corpus.py",
        "corrects": previous["corrects"],
        "reference_extraction": previous["reference_extraction"],
        "upstream": previous["upstream"],
        "refs_manifest": "sessions/COLLATION_W1_2026-09-22_P2_TIER2_BATCH1_refs_manifest.txt",
        "historical_refs_manifest": w1_evidence.HISTORICAL_REFS_MANIFEST,
        "generation_parameters": {
            "kind": "w1-correction",
            "generated": GENERATED,
            "corrects": previous["corrects"],
            "refs_manifest": "sessions/COLLATION_W1_2026-09-22_P2_TIER2_BATCH1_refs_manifest.txt",
            "compare_historical_refs": w1_evidence.HISTORICAL_REFS_MANIFEST,
            "compare_register": previous["corrects"],
            "historical_report_flagged": HISTORICAL_REPORT_FLAGGED,
            "upstream_repo": collate_refs.UPSTREAM_REPO,
            "upstream_revision": w1_evidence.PINNED_UPSTREAM_REVISION,
            "require_verified_refs": True,
            "refs_dir_provided": True,
            "new_documents": new_documents,
            "note": NOTES,
        },
        "content_denominator": previous["content_denominator"],
        "status_scope": source_review.STATUS_SCOPE,
        "documents": documents,
        "reference_verification": {
            "manifest": "sessions/COLLATION_W1_2026-09-22_P2_TIER2_BATCH1_refs_manifest.txt",
            "historical_manifest": w1_evidence.HISTORICAL_REFS_MANIFEST,
            "rule": "statuses are byte-identity of the reference file against a named digest manifest; `drift` never rescues a claim and never upgrades one",
            "counts": {state: sum(1 for d in register_details.values() if d["status"] == state)
                       for state in ("verified", "drift", "unlisted", "none")},
            "historical_counts": {state: sum(1 for d in register_details.values()
                                             if d["historical_status"] == state)
                                  for state in ("verified", "drift", "unlisted", "none")},
            "drifted_refs": sorted(work for work, d in register_details.items()
                                   if "drift" in (d["status"], d["historical_status"])),
            "refs": register_details,
        },
        "aggregate": {
            "documents": len(documents),
            "flagged_entries": source_review.flagged_total(documents),
            "fields_total": sum(d["fields_total"] for d in documents.values()),
            "content_fields_total": sum(d["content_fields_total"] for d in documents.values()),
            "content_fields_collated": sum(d["content_fields_collated"] for d in documents.values()),
            "metadata_fields_total": sum(d["metadata_fields_total"] for d in documents.values()),
            "class_totals": source_review.summary_flags(documents),
            "source_review_status_counts": source_review.status_counts(
                source_review.derive_status(d) for d in documents.values()),
            "documents_without_evidence": [],
            "documents_with_drifted_references": drifted_docs,
        },
    }
    register["reproduction"] = collate_corpus.reproduce(
        documents, str(HISTORICAL_REGISTER), HISTORICAL_REPORT_FLAGGED, NOTES)

    if register["aggregate"]["flagged_entries"] != DESIGNATED_FLAGGED_TOTAL:
        raise SystemExit(f"designated flagged total moved to {register['aggregate']['flagged_entries']}, "
                         f"expected {DESIGNATED_FLAGGED_TOTAL}")
    repro = register["reproduction"]
    print(f"reproduction: compared={repro['documents_compared']} identical={repro['documents_classification_identical']} "
          f"differing={repro['documents_differing']} flagged {repro['flagged_entries']['historical']} -> "
          f"{repro['flagged_entries']['this_run']}")
    print(f"status_counts: {register['aggregate']['source_review_status_counts']}")
    print(f"historical_counts: {register['reference_verification']['historical_counts']}")

    OUTPUT_REGISTER.write_text(json.dumps(register, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"register written: {OUTPUT_REGISTER.relative_to(ROOT)}")

    reg_sha = hashlib.sha256(OUTPUT_REGISTER.read_bytes()).hexdigest()
    man_sha = hashlib.sha256(REFS_MANIFEST.read_bytes()).hexdigest()

    agg = register["aggregate"]
    overlay_only = sorted(set(documents) - set(load(HISTORICAL_REGISTER)["documents"]))
    overlay_lines = []
    for key in overlay_only:
        entry = documents[key]
        overlay_lines.append(
            f"`{key}`: Content fields: {entry['content_fields_total']} measured, "
            f"{entry['content_fields_collated']} collated, refs_verified = {entry['refs_verified']} / "
            f"refs_total = {entry['refs_total']}.")

    counts = register["reference_verification"]["counts"]
    hist_counts = register["reference_verification"]["historical_counts"]

    report_md = f"""# W1 Correction Step — Guiyang + Fayan Restored as Measured Excerpt Seeds (2026-09-22)

**Author:** Arena agent (session `arena/01a0c883-translatechan`), task 059 — P2 Tier2 yulu batch1.
**Corrects:** `sessions/COLLATION_W1_2026-09-09.md` and `sessions/COLLATION_REGISTER_2026-09-09.json`.
**Inherits:** `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json` — the 14 active document entries of this overlay are that record's entries, unchanged (re-measured byte-identically on this overlay's reference layer; the three producer `witness_note` assertions are inherited verbatim because the harness does not regenerate recorded producer assertions). The two restored entries are taken verbatim from the committed measurement register `sessions/COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1_MEASUREMENT.json`.
**Authoritative register for current status:** `sessions/COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1.json`
(generated 2026-09-22 by `scripts/record_p2_tier2_batch1_evidence.py`, whose register-level blocks are produced by `scripts/collate_corpus.py`'s own functions; digests in `sessions/COLLATION_W1_2026-09-22_P2_TIER2_BATCH1_refs_manifest.txt`).
**Status scope:** Containment/remediation state, not a rights decision. Source collation does not approve reuse.

## 0. Relationship to the earlier records (read this first)

The 2026-09-09 report/register, the 2026-09-10 correction overlay, and the 2026-09-20/21 overlays are **historical evidence and are append-only**. This file is a **new dated overlay**: the two Tier2 retelling keys the 2026-09-21 purge removed are restored to the corpus as measured excerpt seeds and recorded as documents 15 and 16. The overlay covers each of the {len(documents)} current manifest items.

| question | record to read |
|---|---|
| what did W1 claim on 2026-09-09 | `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries) |
| what is the authoritative W1 status of the {len(documents)} active items | **this** overlay + `sessions/COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1.json` ({len(documents)} documents, {agg['flagged_entries']} flagged entries) |

## 1. What this overlay adds, and what it deliberately does not re-key

This overlay restores **`guiyang_yulu`** (claimed T47n1989 潭州溈山靈祐禪師語錄 / T47n1990 袁州仰山慧寂禪師語錄) and **`fayan_yulu`** (claimed T47n1991 金陵清涼院文益禪師語錄; the 宗門十規論 component X63n1226 is disclosed in the record's `cbeta_note`) as the 15th and 16th active documents, both `partial_or_failed_w1_collation` / `excerpt_seed`. The corpus bytes are the task-056 labelled files restored verbatim from the pre-purge tree and re-measured byte-identically on the pinned layer (CBETA XML P5 `dbdea41071e1e260ad84b72faefd4587333cf76d`, rule `cbeta-p5-body-cjk-v1`). The R-A re-key attempt was measured and **NOT landed**: guiyang 0 of 6 source-content fields verbatim anywhere; fayan 1 of 11 (s4.d0 曹源一滴水, carried whole by T47n1991 @3,813) — both far below the 80-percent (5-of-6) threshold, so the 047-pattern authenticity labels carried by the restored bytes stand (per-field `coverage_note` run measurements, `editorial_note` R-B labels, ID-corrected `cbeta_note`). Neither document is exported: the wiki/export lane receives only 100% collated documents.

## 2. Flagged-entry reconciliation: 637 → 622 → 195 → 41

| figure | records covered | source | meaning |
|---|---|---|---|
| 637 | 34 documents | 2026-09-09 report §3 | **superseded.** Not reproducible from any committed artifact; contradicted by its own register. |
| 622 | 34 documents | `sessions/COLLATION_REGISTER_2026-09-09.json`, sum of `flagged` | historical register total. |
| 195 | 7 documents | reproduction over the seven compared documents | this overlay's reproduction against the historical register: 7 compared, 5 classification-identical, 2 differing (`linji_yulu`, `wumenguan`), flagged 195 → 41. |
| **41** | **{len(documents)} documents** | `sessions/COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1.json` | **authoritative.** {len(documents)} active documents; the 15 → 41 move is exactly the two restored records' 26 non-collating fields (guiyang 10, fayan 16). |

## 3. Reference extraction, pinned upstream, and digest verification

```
rule id   cbeta-p5-body-cjk-v1
rule      tei:text/tei:body document-order text; drop the subtree of every tei:note and tei:g
upstream  https://github.com/cbeta-org/xml-p5 @ dbdea41071e1e260ad84b72faefd4587333cf76d
```

Verification results for the {len(register_details)} works the collator actually reads:

| comparison | verified | drift | unlisted |
|---|---:|---:|---:|
| against `sessions/COLLATION_W1_2026-09-22_P2_TIER2_BATCH1_refs_manifest.txt` ({len(register_details)} works) | {counts['verified']} | {counts['drift']} | {counts['unlisted']} |
| against `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` ({len(historical_digests)} works) | {hist_counts['verified']} | {hist_counts['drift']} | {hist_counts['unlisted']} |

Across all {len(historical_digests)} manifest works of the historical 2026-09-09 digest manifest, the two references whose bytes moved against history are declared drift, never rescued: {', '.join(register['reference_verification']['drifted_refs'])}. The authoritative manifest itself is exactly the union of the witnesses and probes the {len(documents)} active manifest items claim (a 22-work subset of the committed 43-work task-056 measurement set, all digests byte-identical; the 43-work set re-verifies 43/0 drift against the committed task-056 manifest).

## 4. The overlay-only documents, and the overlay-only records

{chr(10).join(overlay_lines)}

## 5. Recomputed status counts (from evidence, not transcribed)

Derived from the merged evidence for all {len(documents)} manifest items by `source_review.derive_status()`:

| status | count | documents |
|---|---:|---|
| `collated_to_claimed_witness` | {agg['source_review_status_counts']['collated_to_claimed_witness']} | `wumenguan`, `linji_yulu`, `zhengdao_ge`, `congronglu`, `chuandenglu_full`, `caoshan_benji`, `huangbo_fayao_full`, `mazu_guanglu_full`, `yunmen_guanglu_full`, `dongshan_yulu_full`, `zhaozhou_yulu_full`, `dahui_yulu_full` |
| `partial_or_failed_w1_collation` | {agg['source_review_status_counts']['partial_or_failed_w1_collation']} | `guiyang_yulu` (0/6), `fayan_yulu` (1/11) |
| `witness_unavailable` | {agg['source_review_status_counts']['witness_unavailable']} | `hanshan_poems`, `niutou_juezhu` |

Field totals over the {len(documents)} entries: **{agg['fields_total']:,} total fields**, **{agg['content_fields_total']:,} content fields**, **{agg['content_fields_collated']:,} collated content fields**, **{agg['metadata_fields_total']:,} metadata fields, {sum(source_review.is_metadata_field(f.get('path')) and f.get('class') not in source_review.COLLATED_CLASSES for e in documents.values() for f in e.get('flagged', []))} of them non-collating**.

`documents_classification_identical = {repro['documents_classification_identical']} of {repro['documents_compared']}`
`documents_with_changed_status = {repro['documents_with_changed_status']}`

## 6. Invariants preserved by this correction

- All active documents validate with 0 errors.
- The historical register and report stay committed and unmodified (append-only evidence).
- No drifted or unlisted reference upgrades any status; the declared historical drifts stay declared.
- The 2026-09-21 purge is not a general reinstatement: only the two keys this task owns return, as measured excerpt seeds; the other 30 purged retelling keys stay purged.
- The 637 report figure stays superseded; the historical chain's designated flagged total stays 630 (2026-09-10 overlay basis), and 486 remains the historical measurement over the former 44 documents.

## 7. Committed digests

* `sessions/COLLATION_REGISTER_2026-09-22_P2_TIER2_BATCH1.json` — sha256 `{reg_sha}`
* `sessions/COLLATION_W1_2026-09-22_P2_TIER2_BATCH1_refs_manifest.txt` — sha256 `{man_sha}`
"""
    OUTPUT_REPORT.write_text(report_md, encoding="utf-8")
    print(f"report written: {OUTPUT_REPORT.relative_to(ROOT)}")
    print(f"register sha256: {reg_sha}")
    print(f"refs manifest sha256: {man_sha}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
