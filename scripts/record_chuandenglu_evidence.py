#!/usr/bin/env python3
"""Amend the authoritative W1 register with the full Jingde Chuandeng Lu (task 045, 2026-09-20).

The corpus gained one document on 2026-09-20: `data/corpus/chuandenglu_full.json`, extracted from
scratch out of the pinned CBETA XML P5 witness `T51n2076` (30 fascicles; 1,274 units — 971
biography entries, 69 titled works, 234 sections — every one verbatim and contiguous; 2,549
fields measured, 2,549 EXACT, 0 flagged). The authoritative W1 register has to record it. This
script produces the dated overlay that does so, with the smallest possible change:

* **36 document entries are inherited verbatim** from the 2026-09-20 correction overlay
  (`sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json`, which itself inherited the
  2026-09-10 overlay's 35 entries verbatim and recorded the Congrong Lu reinstatement).
  Re-measuring them here would move their measured classes — a re-designation of the
  evidence, which the standing rulings forbid.
* **One document entry is appended**, copied verbatim from the harness's own measurement of
  that document (`scripts/collate_corpus.py --doc chuandenglu_full --compare-historical-refs …
  --new-document chuandenglu_full --require-verified-refs`), whose run is committed as
  `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL_MEASUREMENT.json`.
* **The register-level blocks are recomputed** with the harness's own code —
  `collate_corpus.reproduce` for the reproduction block and `source_review` for the
  class/status arithmetic — never transcribed.

The declared exception: `chuandenglu_full` is new to the evidence record — the 2026-09-09 pass
never covered it — so it is declared in `generation_parameters.new_documents`. Unlike the
Congrong Lu reinstatement, its reference T51n2076 carries the same digest
(a860907edd3d34b99927b157849b8ac45c5e6c134abd67cde7b6a3400797ab10) in both the 2026-09-09 and
the 2026-09-20 digest manifests, so the entry records `historical_status = 'verified'` and the
document does NOT enter `documents_with_drifted_references`: the collated claim rests on a
byte-verified reference with a byte-verified historical anchor. The new document contributes no
flags, so the designated flagged total stays 630.

Inputs (all committed):
* `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json` — the 36 inherited entries;
* `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL_MEASUREMENT.json` — the new
  document as measured;
* `sessions/COLLATION_REGISTER_2026-09-09.json` — the historical register the chain corrects;
* `sessions/COLLATION_W1_2026-09-20_refs_manifest.txt` (40 works) and
  `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` (the 187-work historical anchor).

Output: `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json` (deterministic
byte-for-byte).

Usage:
    python3 scripts/record_chuandenglu_evidence.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import collate_corpus  # noqa: E402 - the harness's own reproduction builder
import collate_refs  # noqa: E402
import source_review  # noqa: E402
import w1_evidence  # noqa: E402

PREVIOUS_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json"
HISTORICAL_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-09.json"
MEASUREMENT = ROOT / "sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL_MEASUREMENT.json"
OUTPUT = ROOT / "sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json"

NEW_KEY = "chuandenglu_full"
GENERATED = "2026-09-20"
#: The figure the 2026-09-09 human-readable report claimed; its register sums to 622, so the claim
#: stays recorded as superseded (inherited through the 2026-09-20 correction overlay).
HISTORICAL_REPORT_FLAGGED = 637
#: The designated flagged total this overlay must not move: the new document contributes no flags.
DESIGNATED_FLAGGED_TOTAL = 630

NOTES = [
    "2026-09-20 (task 045): data/corpus/chuandenglu_full.json enters the active manifest as the "
    "37th document, extracted from scratch out of the pinned CBETA XML P5 witness T51n2076 "
    "(upstream dbdea41071e1e260ad84b72faefd4587333cf76d; reference digest "
    "a860907edd3d34b99927b157849b8ac45c5e6c134abd67cde7b6a3400797ab10, 358,501 CJK). The "
    "producer scripts/segment_chuandenglu.py partitions all 30 fascicles (350,269 CJK "
    "characters) into 1,274 contiguous units — 971 biography entries, 69 titled works and 234 "
    "sections (fascicle headings, tables of contents and generation lists) — and asserts the "
    "partition tiles the 30-fascicle region exactly. Its collation is 2,549/2,549 fields EXACT "
    "(1,274 source-content + 1,275 metadata) with 0 flagged, measured by "
    "scripts/collate_corpus.py --doc chuandenglu_full (recorded in "
    "sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL_MEASUREMENT.json). The 36 "
    "per-document entries this overlay inherits are the 2026-09-20 correction overlay's entries "
    "verbatim, so the designated flagged total stays 630 — the new document adds none.",
    "The new document's reference has a verified historical anchor, and that is recorded rather "
    "than implied: T51n2076's digest is byte-identical between the 2026-09-09 and the 2026-09-20 "
    "manifests, so the entry records historical_status='verified' and the document does not enter "
    "documents_with_drifted_references. The document itself is new to the evidence record — the "
    "2026-09-09 pass never covered it — and is declared in generation_parameters.new_documents. "
    "The sibling excerpt record data/corpus/chuandenglu.json (T2076/51, two sample records) is "
    "unchanged.",
]


def load(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def witness_note() -> str:
    return (
        "Recorded 2026-09-20 from the pinned witness: all 1,274 units (971 biography entries, "
        "69 titled works, 234 sections) are verbatim and contiguous in T51n2076 — 2,549 fields "
        "measured, 2,549 EXACT, 0 flagged. The producer asserts the partition tiles the "
        "30-fascicle region exactly (350,269 CJK characters); the only overlaps are the titled "
        "sub-verses the witness nests inside its multi-part works (13 sub-units, 770 CJK "
        "characters, listed in the extraction report). Case locators anchor at the lb line head "
        "printed before each unit, with the last lb inside the unit as the closing line. This "
        "document is new to the evidence: the 2026-09-09 pass never covered it, so it is declared "
        "in generation_parameters.new_documents; its reference T51n2076 verifies byte-identically "
        "against both the authoritative and the historical manifest (historical_status="
        "'verified'), so the collated claim rests on a byte-verified reference with a byte-"
        "verified historical anchor. No existing corpus record was read: the producer's only "
        "inputs are the pinned witness file and its digest-verified reference extraction, and "
        "every field is asserted to be a contiguous run of that extraction."
    )


def main() -> int:
    previous = load(PREVIOUS_REGISTER)
    historical = load(HISTORICAL_REGISTER)["documents"]
    measurement = load(MEASUREMENT)
    current_digests = collate_refs.read_digest_manifest(
        str(ROOT / w1_evidence.FIXED_METADATA["correction_refs_manifest_path"]))
    historical_digests = collate_refs.read_digest_manifest(str(ROOT / w1_evidence.HISTORICAL_REFS_MANIFEST))

    documents = dict(previous["documents"])
    if NEW_KEY in documents:
        raise SystemExit(f"{NEW_KEY} is already recorded in {PREVIOUS_REGISTER.name}; this overlay adds it")
    # The new-document waivers are cumulative: a document declared new in an earlier overlay
    # (congronglu, whose T48n2004 has no historical-manifest entry) must stay waived, because the
    # collated-status rule reads the waiver only from THIS register's generation_parameters.
    prior_new = previous.get("generation_parameters", {}).get("new_documents") or []
    new_documents = list(dict.fromkeys([*prior_new, NEW_KEY]))
    measured = measurement["documents"].get(NEW_KEY)
    if not isinstance(measured, dict):
        raise SystemExit(f"{MEASUREMENT.name} carries no {NEW_KEY} entry to record")
    if measured.get("source_review_status") != source_review.COLLATED_STATUS:
        raise SystemExit(f"{NEW_KEY} measures {measured.get('source_review_status')!r}, not a collated "
                         "document; the overlay would be recording a failed collation, not a reinstatement")
    entry = dict(measured)
    entry["witness_note"] = witness_note()
    documents[NEW_KEY] = entry

    # Register-level reference verification: every work the entries claim (plus every work the
    # authoritative manifest lists — the two sets must be identical) with its status against both
    # anchors.
    claimed = set(previous["reference_verification"]["refs"]) | set(entry.get("reference_verification") or {})
    if claimed != set(current_digests):
        raise SystemExit("the entries' reference set does not match the authoritative digest manifest: "
                         f"missing={sorted(set(current_digests) - claimed)} extra={sorted(claimed - set(current_digests))}")
    register_details = {}
    for work in sorted(claimed):
        digest = current_digests[work]
        historical_digest = historical_digests.get(work)
        register_details[work] = {
            "sha256": digest,
            "manifest": w1_evidence.FIXED_METADATA["correction_refs_manifest_path"],
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
        "refs_manifest": w1_evidence.FIXED_METADATA["correction_refs_manifest_path"],
        "historical_refs_manifest": w1_evidence.HISTORICAL_REFS_MANIFEST,
        "generation_parameters": {
            "kind": "w1-correction",
            "generated": GENERATED,
            "corrects": previous["corrects"],
            "refs_manifest": w1_evidence.FIXED_METADATA["correction_refs_manifest_path"],
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
            "manifest": w1_evidence.FIXED_METADATA["correction_refs_manifest_path"],
            "historical_manifest": w1_evidence.HISTORICAL_REFS_MANIFEST,
            "rule": "statuses are byte-identity of the reference file against a named digest "
                    "manifest; `drift` never rescues a claim and never upgrades one",
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
            "documents_without_evidence": sorted(set(collate_corpus.DOCS) - set(documents)),
            "documents_with_drifted_references": drifted_docs,
        },
    }
    register["reproduction"] = collate_corpus.reproduce(
        documents, str(HISTORICAL_REGISTER), HISTORICAL_REPORT_FLAGGED, NOTES)

    if register["aggregate"]["flagged_entries"] != DESIGNATED_FLAGGED_TOTAL:
        raise SystemExit(f"the overlay moves the designated flagged total to "
                         f"{register['aggregate']['flagged_entries']}; it must stay at "
                         f"{DESIGNATED_FLAGGED_TOTAL} (the new document contributes no flags)")
    OUTPUT.write_text(json.dumps(register, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"register written: {OUTPUT.relative_to(ROOT)}")
    print(f"aggregate: {json.dumps(register['aggregate'], ensure_ascii=False)}")
    print(f"reference_verification: {json.dumps(register['reference_verification']['counts'])} "
          f"historical {json.dumps(register['reference_verification']['historical_counts'])}")
    print(f"reproduction: compared={register['reproduction']['documents_compared']} "
          f"identical={register['reproduction']['documents_classification_identical']} "
          f"changed_status={register['reproduction']['documents_with_changed_status']} "
          f"flagged={register['reproduction']['flagged_entries']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
