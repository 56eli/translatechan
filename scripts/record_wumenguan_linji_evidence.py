#!/usr/bin/env python3
"""Amend the authoritative W1 register with the combined Wumenguan + Linji re-keys (tasks P2.8 + P2.9).

The two 2026-09-21 re-keys land as ONE dated overlay instead of two sequential overlays, because
each re-key's register rewrote the same shared surfaces (manifest metadata, traceability queue,
reference manifest, aggregate block) and merging them one after the other would always conflict.
This overlay is the combined resolution:

* wumenguan — The Gateless Gate (無門關 T48n2005), 48 cases / 7,663 CJK content; 207 fields
  measured, 207 EXACT, 0 flagged (151 source-content fields collating of 151, 56 metadata fields
  verbatim). Entry inherited verbatim from sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json.
* linji_yulu — The Record of Linji (鎮州臨濟慧照禪師語錄 T47n1985), the whole 16,366-CJK fascicle in
  107 verbatim sections; 215 fields measured, 215 EXACT, 0 flagged (107 source-content fields
  collating of 107, 108 metadata fields verbatim). Entry inherited verbatim from
  sessions/COLLATION_REGISTER_2026-09-21_LINJI.json.

This script produces the dated overlay:

* 12 document entries are inherited verbatim from COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json.
* The wumenguan and linji_yulu entries are appended (each exactly as its own 13-document register
  recorded it).
* Register-level blocks are recomputed with collate_corpus.reproduce and source_review against the
  combined 19-work digest manifest sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt.

Usage:
    python3 scripts/record_wumenguan_linji_evidence.py
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

PREVIOUS_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json"
WUMENGUAN_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json"
LINJI_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_LINJI.json"
HISTORICAL_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-09.json"
REFS_MANIFEST = ROOT / "sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt"
OUTPUT_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json"
OUTPUT_REPORT = ROOT / "sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI.md"

GENERATED = "2026-09-21"
HISTORICAL_REPORT_FLAGGED = 637
DESIGNATED_FLAGGED_TOTAL = 15

NOTES = [
    "2026-09-21 (tasks P2.8 + P2.9, combined overlay): the Wumenguan and Linji re-keys enter the "
    "active manifest together as documents 13 and 14 (45th and 46th evidence entries). Wumenguan "
    "(無門關) was extracted from the pinned CBETA XML P5 witness T48n2005 — all 48 cases tile 7,663 "
    "CJK characters verbatim; 207/207 fields EXACT, 0 flagged (151/151 source-content fields "
    "collated). The Record of Linji (鎮州臨濟慧照禪師語錄) was re-keyed from the pinned witness "
    "T47n1985 — 107 verbatim sections tile the whole 16,366-CJK fascicle; 215/215 fields EXACT, "
    "0 flagged (107/107 source-content fields collated). Both extractions come from CBETA XML P5 "
    "revision dbdea41071e1e260ad84b72faefd4587333cf76d under extraction rule cbeta-p5-body-cjk-v1. "
    "The 12 per-document entries this overlay inherits are the 2026-09-21 enthusiast overlay's "
    "entries verbatim, so the designated flagged total stays 15 — neither re-key adds a flag. The "
    "two per-document re-key entries are inherited verbatim from the single-re-key overlays "
    "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json and "
    "sessions/COLLATION_REGISTER_2026-09-21_LINJI.json, which stay committed as the evidence that "
    "each measurement happened; this combined overlay is the resolution that lets both re-keys ship "
    "without one merge cancelling the other's manifest, queue, and register-level blocks.",
    "Reference extractions ref_T48n2005.txt (SHA-256 "
    "83a298cc4ab4f3bebd933db3fe2fa656b3344731f37fc134251e3bea2464ff7f) and ref_T47n1985.txt (SHA-256 "
    "4317e5fa14996b3f414187adb4264f1d52efb303392402f797d6e2019aeb8359) verify byte-identically "
    "against both the combined 19-work manifest and the historical 2026-09-09 anchor "
    "(sessions/COLLATION_W1_2026-09-09_refs_manifest.txt, 187 works). The historical register "
    "already covers wumenguan and linji_yulu, so no new-document waiver is involved for either — "
    "generation_parameters.new_documents carries only the nine overlay-only additions declared by "
    "the inherited chain.",
]


def load(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def main() -> int:
    previous = load(PREVIOUS_REGISTER)
    wumenguan_register = load(WUMENGUAN_REGISTER)
    linji_register = load(LINJI_REGISTER)
    current_digests = collate_refs.read_digest_manifest(str(REFS_MANIFEST))
    historical_digests = collate_refs.read_digest_manifest(str(ROOT / w1_evidence.HISTORICAL_REFS_MANIFEST))

    documents = dict(previous["documents"])
    documents["wumenguan"] = wumenguan_register["documents"]["wumenguan"]
    documents["linji_yulu"] = linji_register["documents"]["linji_yulu"]

    prior_new = previous.get("generation_parameters", {}).get("new_documents") or []
    new_documents = list(dict.fromkeys(prior_new))

    claimed = set(previous["reference_verification"]["refs"]) | {"T48n2005", "T47n1985"}
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
            "manifest": "sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt",
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
        "refs_manifest": "sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt",
        "historical_refs_manifest": w1_evidence.HISTORICAL_REFS_MANIFEST,
        "generation_parameters": {
            "kind": "w1-correction",
            "generated": GENERATED,
            "corrects": previous["corrects"],
            "refs_manifest": "sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt",
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
            "manifest": "sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt",
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

    report_md = f"""# W1 Source Collation Report — Wumenguan T48n2005 + Linji T47n1985 Re-keys, Combined Overlay (2026-09-21)

**Author:** Arena agent (session `arena/01a0c618-translatechan`), combined resolution of tasks P2.8 (Wumenguan proper re-key) and P2.9 (Record of Linji re-key).
**Corrects:** `sessions/COLLATION_W1_2026-09-09.md` and `sessions/COLLATION_REGISTER_2026-09-09.json`.
**Inherits:** `sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json` — the 12 active document entries in this overlay are that record's entries, unchanged. The two re-key entries are inherited verbatim from the single-re-key overlays `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json` and `sessions/COLLATION_REGISTER_2026-09-21_LINJI.json`, which stay committed as the evidence each measurement happened.
**Authoritative register for current status:** `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json`
(generated 2026-09-21 by `scripts/record_wumenguan_linji_evidence.py`, whose register-level blocks are produced by `scripts/collate_corpus.py`'s own functions; digests in `sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt`).
**Status scope:** Containment/remediation state, not a rights decision. Source collation does not approve reuse.

## 0. Relationship to the earlier records (read this first)

The 2026-09-09 report/register, the 2026-09-10 correction overlay, and the 2026-09-20/21 overlays are **historical evidence and are append-only**. This file is a **new dated overlay**, reinstating `wumenguan` and re-keying `linji_yulu` in one combined step, because the two single-re-key overlays rewrote the same shared surfaces and could not be merged sequentially. The overlay covers each of the {len(documents)} current manifest items.

| question | record to read |
|---|---|
| what did W1 claim on 2026-09-09 | `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries) |
| what is the authoritative W1 status of the {len(documents)} active items | **this** overlay + `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json` ({len(documents)} documents, {agg['flagged_entries']} flagged entries) |

## 1. What this overlay adds, and what it deliberately does not re-measure

This overlay reinstates **`wumenguan`** (The Gateless Gate 無門關 T48n2005) and re-keys **`linji_yulu`** (The Record of Linji 鎮州臨濟慧照禪師語錄 T47n1985) as the 13th and 14th active documents. Wumenguan was re-keyed from the pinned CBETA XML P5 witness `T48n2005` under extraction rule `cbeta-p5-body-cjk-v1`: all 48 cases tile 7,663 CJK characters verbatim; 207/207 fields EXACT, 0 flagged (151/151 source-content fields collated). The Record of Linji is a from-scratch extraction of the pinned witness `T47n1985`: 107 verbatim sections tile the whole 16,366-CJK fascicle; 215/215 fields EXACT, 0 flagged (107/107 source-content fields collated). The purged Linji retelling was not read, patched, or carried over.

## 2. Flagged-entry reconciliation: 637 → 622 → 169 → 15

| figure | records covered | source | meaning |
|---|---|---|---|
| 637 | 34 documents | 2026-09-09 report §3 | **superseded.** Not reproducible from any committed artifact; contradicted by its own register. |
| 622 | 34 documents | `sessions/COLLATION_REGISTER_2026-09-09.json`, sum of `flagged` | historical register total. |
| 169 | 34 documents | reproduction over the same five compared documents | the 2026-09-21 combined overlay's reproduction: 5 compared, 2 differing (`wumenguan`, `linji_yulu`), flagged 169 → 15. |
| **15** | **{len(documents)} documents** | `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json` | **authoritative.** {len(documents)} active documents post-purge. |

## 3. Reference extraction, pinned upstream, and digest verification

```
rule id   cbeta-p5-body-cjk-v1
rule      tei:text/tei:body document-order text; drop the subtree of every tei:note and tei:g
upstream  https://github.com/cbeta-org/xml-p5 @ dbdea41071e1e260ad84b72faefd4587333cf76d
```

Verification results for the {len(register_details)} works the collator actually reads:

| comparison | verified | drift | unlisted |
|---|---:|---:|---:|
| against `sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt` ({len(register_details)} works) | {counts['verified']} | {counts['drift']} | {counts['unlisted']} |
| against `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` ({len(historical_digests)} works) | {hist_counts['verified']} | {hist_counts['drift']} | {hist_counts['unlisted']} |

Across all {len(historical_digests)} manifest works of the historical 2026-09-09 digest manifest, the four references whose bytes moved against history are declared drift, never rescued: {', '.join(register['reference_verification']['drifted_refs'])}.

## 4. The overlay-only documents, and the overlay-only records

{chr(10).join(overlay_lines)}

## 5. Recomputed status counts (from evidence, not transcribed)

Derived from the merged evidence for all {len(documents)} manifest items by `source_review.derive_status()`:

| status | count | documents |
|---|---:|---|
| `collated_to_claimed_witness` | {agg['source_review_status_counts']['collated_to_claimed_witness']} | `wumenguan`, `linji_yulu`, `zhengdao_ge`, `congronglu`, `chuandenglu_full`, `caoshan_benji`, `huangbo_fayao_full`, `mazu_guanglu_full`, `yunmen_guanglu_full`, `dongshan_yulu_full`, `zhaozhou_yulu_full`, `dahui_yulu_full` |
| `partial_or_failed_w1_collation` | {agg['source_review_status_counts']['partial_or_failed_w1_collation']} | |
| `witness_unavailable` | {agg['source_review_status_counts']['witness_unavailable']} | `hanshan_poems`, `niutou_juezhu` |

Field totals over the {len(documents)} entries: **{agg['fields_total']:,} total fields**, **{agg['content_fields_total']:,} content fields**, **{agg['content_fields_collated']:,} collated content fields**, **{agg['metadata_fields_total']:,} metadata fields, 0 of them non-collating**.

`documents_classification_identical = {repro['documents_classification_identical']} of {repro['documents_compared']}`
`documents_with_changed_status = {repro['documents_with_changed_status']}`

## 6. Invariants preserved by this correction

- All active documents validate with 0 errors.
- The historical register and report stay committed and unmodified (append-only evidence).
- No drifted or unlisted reference upgrades any status; the four historical drifts stay declared.
- The combined overlay supersedes the two single-re-key overlays `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json` and `sessions/COLLATION_REGISTER_2026-09-21_LINJI.json` for *current status only*; both stay committed as the dated evidence of their measurements.

## 7. Committed digests

* `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json` — sha256 `{reg_sha}`
* `sessions/COLLATION_W1_2026-09-21_WUMENGUAN_LINJI_refs_manifest.txt` — sha256 `{man_sha}`
"""
    OUTPUT_REPORT.write_text(report_md, encoding="utf-8")
    print(f"report written: {OUTPUT_REPORT.relative_to(ROOT)}")
    print(f"register sha256: {reg_sha}")
    print(f"refs manifest sha256: {man_sha}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
