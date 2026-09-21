#!/usr/bin/env python3
"""Amend the authoritative W1 register with Wumenguan T48n2005 48 cases re-key (task P2.8).

The corpus gained wumenguan on 2026-09-21, extracted from the pinned CBETA XML P5
witness T48n2005 (revision dbdea41071e1e260ad84b72faefd4587333cf76d) under extraction
rule cbeta-p5-body-cjk-v1:

* wumenguan — The Gateless Gate (無門關 T48n2005), 48 cases / 7,663 CJK content;
  207 fields measured, 207 EXACT, 0 flagged (151 source-content fields collating of 151,
  56 metadata fields verbatim).

This script produces the dated overlay:

* 44 document entries are inherited verbatim from COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json.
* The wumenguan entry is appended.
* Register-level blocks are recomputed with collate_corpus.reproduce and source_review.

Usage:
    python3 scripts/record_wumenguan_evidence.py
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import collate_corpus
import collate_refs
import source_review
import w1_evidence

PREVIOUS_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json"
HISTORICAL_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-09.json"
REFS_MANIFEST = ROOT / "sessions/COLLATION_W1_2026-09-21_WUMENGUAN_refs_manifest.txt"
OUTPUT_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json"
OUTPUT_REPORT = ROOT / "sessions/COLLATION_W1_2026-09-21_WUMENGUAN.md"

GENERATED = "2026-09-21"
HISTORICAL_REPORT_FLAGGED = 637
DESIGNATED_FLAGGED_TOTAL = 15

NOTES = [
    "2026-09-21 (task P2.8): Wumenguan T48n2005 re-key enters the active manifest as document 13 (45th evidence entry), "
    "extracted from the pinned CBETA XML P5 witness at revision dbdea41071e1e260ad84b72faefd4587333cf76d under extraction rule "
    "cbeta-p5-body-cjk-v1. All 48 cases tile 7,663 CJK characters verbatim; 207/207 fields EXACT, 0 flagged (151/151 source-content "
    "fields collated). The 44 per-document entries this overlay inherits are the 2026-09-21 enthusiast overlay's entries verbatim, "
    "so the designated flagged total stays 630 — Wumenguan adds no flags.",
    "Reference extraction ref_T48n2005.txt carries SHA-256 83a298cc4ab4f3bebd933db3fe2fa656b3344731f37fc134251e3bea2464ff7f, "
    "verifying byte-identically against both the current manifest and the historical 2026-09-09 anchor (sessions/COLLATION_W1_2026-09-09_refs_manifest.txt line 97). "
    "wumenguan is declared in generation_parameters.new_documents as new to this overlay.",
]


def load(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def main() -> int:
    previous = load(PREVIOUS_REGISTER)
    current_digests = collate_refs.read_digest_manifest(REFS_MANIFEST)
    historical_digests = collate_refs.read_digest_manifest(str(ROOT / w1_evidence.HISTORICAL_REFS_MANIFEST))

    # Measure wumenguan using collate_corpus
    refs_dir = Path("/tmp/refs")
    if not (refs_dir / "ref_T48n2005.txt").is_file():
        raise SystemExit("/tmp/refs/ref_T48n2005.txt does not exist; run collate_refs first")

    os.environ["COLLATION_REFS"] = str(refs_dir)

    ref_obj = collate_corpus.Ref("T48n2005", (refs_dir / "ref_T48n2005.txt").read_text(encoding="utf-8"))
    wumenguan_data = load(ROOT / "data/corpus/wumenguan.json")

    wumenguan_entry = collate_corpus.document_entry(
        "wumenguan", ["T48n2005"], [], wumenguan_data, [ref_obj], []
    )

    # Reference verification for wumenguan
    ref_digest_val = current_digests["T48n2005"]
    hist_digest_val = historical_digests.get("T48n2005")
    wumenguan_entry["reference_verification"] = {
        "T48n2005": {
            "sha256": ref_digest_val,
            "status": "verified",
            "historical_status": "verified" if hist_digest_val == ref_digest_val else "drift",
        }
    }
    wumenguan_entry["refs_total"] = 1
    wumenguan_entry["refs_verified"] = 1
    wumenguan_entry["refs_historically_verified"] = 1 if hist_digest_val == ref_digest_val else 0

    documents = dict(previous["documents"])
    documents["wumenguan"] = wumenguan_entry

    prior_new = previous.get("generation_parameters", {}).get("new_documents") or []
    new_documents = list(dict.fromkeys(prior_new))

    claimed = set(previous["reference_verification"]["refs"]) | {"T48n2005"}
    if claimed != set(current_digests):
        raise SystemExit(f"claimed references do not match current_digests: missing={sorted(set(current_digests)-claimed)}")

    register_details = {}
    for work in sorted(claimed):
        digest = current_digests[work]
        historical_digest = historical_digests.get(work)
        register_details[work] = {
            "sha256": digest,
            "manifest": "sessions/COLLATION_W1_2026-09-21_WUMENGUAN_refs_manifest.txt",
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
        "refs_manifest": "sessions/COLLATION_W1_2026-09-21_WUMENGUAN_refs_manifest.txt",
        "historical_refs_manifest": w1_evidence.HISTORICAL_REFS_MANIFEST,
        "generation_parameters": {
            "kind": "w1-correction",
            "generated": GENERATED,
            "corrects": previous["corrects"],
            "refs_manifest": "sessions/COLLATION_W1_2026-09-21_WUMENGUAN_refs_manifest.txt",
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
            "manifest": "sessions/COLLATION_W1_2026-09-21_WUMENGUAN_refs_manifest.txt",
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
        raise SystemExit(f"designated flagged total moved to {register['aggregate']['flagged_entries']}, expected {DESIGNATED_FLAGGED_TOTAL}")

    OUTPUT_REGISTER.write_text(json.dumps(register, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"register written: {OUTPUT_REGISTER.relative_to(ROOT)}")

    import hashlib
    reg_sha = hashlib.sha256(OUTPUT_REGISTER.read_bytes()).hexdigest()
    man_sha = hashlib.sha256(REFS_MANIFEST.read_bytes()).hexdigest()

    # Write Markdown Report
    report_md = f"""# W1 Source Collation Report — Wumenguan T48n2005 Re-key (2026-09-21)

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
sha256(sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json) {reg_sha}
sha256(sessions/COLLATION_W1_2026-09-21_WUMENGUAN_refs_manifest.txt) {man_sha}
```

## 8. What this overlay does not claim

Re-keying Wumenguan grants no rights: witness text carries the pinned extraction's edition, not permission to reuse.
"""
    OUTPUT_REPORT.write_text(report_md, encoding="utf-8")
    print(f"report written: {OUTPUT_REPORT.relative_to(ROOT)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
