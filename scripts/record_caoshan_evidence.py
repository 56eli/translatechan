#!/usr/bin/env python3
"""Amend the authoritative W1 register with Caoshan Benji's record (task 046, 2026-09-20).

The corpus gained one document on 2026-09-20: `data/corpus/caoshan_benji.json`, extracted from
scratch out of the pinned CBETA XML P5 witness `T47n1987A` (撫州曹山元證禪師語錄, the Taishō record
of Caoshan Benji; 84 units — preface, opening heading, 75 record paragraphs, six Caodong treatises,
close — every one verbatim and contiguous; 169 fields measured, 169 EXACT, 0 flagged). The
authoritative W1 register has to record it. This script produces the dated overlay that does so,
with the smallest possible change:

* **37 document entries are inherited verbatim** from the 2026-09-20 Chuandeng Lu overlay
  (`sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json`, which itself inherited the
  2026-09-20 correction overlay's 36 entries verbatim and recorded the full 30-fascicle Jingde
  Chuandeng Lu). Re-measuring them here would move their measured classes — a re-designation of the
  evidence, which the standing rulings forbid.
* **One document entry is appended**, copied verbatim from the harness's own measurement of that
  document (`scripts/collate_corpus.py --doc caoshan_benji --compare-historical-refs …
  --new-document caoshan_benji --require-verified-refs`), whose run is committed as
  `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI_MEASUREMENT.json`.
* **The register-level blocks are recomputed** with the harness's own code — `collate_corpus.reproduce`
  for the reproduction block and `source_review` for the class/status arithmetic — never transcribed.

The declared exception: `caoshan_benji` is new to the evidence record — the 2026-09-09 pass never
covered it — so it is declared in `generation_parameters.new_documents`. Its claimed reference
T47n1987A carries the same digest (cdb2f4e2…) in the 2026-09-09 historical anchor and in this
overlay's manifest, so the entry records `historical_status = 'verified'` and the document does NOT
enter `documents_with_drifted_references`: the collated claim rests on a byte-verified reference
with a byte-verified historical anchor. The new document contributes no flags, so the designated
flagged total stays 630.

This overlay also carries the task's 41st reference work: the probe `T48n2006` (人天眼目), whose
曹洞宗 section carries a parallel recension of the record's 五位君臣旨訣 passage. It is a probe — it
is recorded in the entry's `reference_verification` (so the register's reference set and the
committed manifest agree) but never claims a field, and its own digest is byte-identical to the
2026-09-09 manifest (`verified`, so it adds no drift).

Inputs (all committed):
* `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json` — the 37 inherited entries;
* `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI_MEASUREMENT.json` — the new document as
  measured;
* `sessions/COLLATION_REGISTER_2026-09-09.json` — the historical register the chain corrects;
* `sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI_refs_manifest.txt` (41 works) and
  `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` (the 187-work historical anchor).

Output: `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json` (deterministic byte-for-byte).

Usage:
    python3 scripts/record_caoshan_evidence.py
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

PREVIOUS_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json"
HISTORICAL_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-09.json"
MEASUREMENT = ROOT / "sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI_MEASUREMENT.json"
OUTPUT = ROOT / "sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json"

NEW_KEY = "caoshan_benji"
GENERATED = "2026-09-20"
#: The figure the 2026-09-09 human-readable report claimed; its register sums to 622, so the claim
#: stays recorded as superseded (inherited through the 2026-09-20 correction overlay).
HISTORICAL_REPORT_FLAGGED = 637
#: The designated flagged total this overlay must not move: the new document contributes no flags.
DESIGNATED_FLAGGED_TOTAL = 630
#: The probe work this task adds to the reference set (人天眼目, the Caodong five-ranks anthology).
NEW_PROBE = "T48n2006"

NOTES = [
    "2026-09-20 (task 046): data/corpus/caoshan_benji.json enters the active manifest as the 38th "
    "document, extracted from scratch out of the pinned CBETA XML P5 witness T47n1987A (撫州曹山"
    "元證禪師語錄 — the Taishō record of Caoshan Benji; upstream "
    "dbdea41071e1e260ad84b72faefd4587333cf76d; reference digest "
    "cdb2f4e2f2982ecfb4317e911cdfe96ff3ae6c7968f9909bbfbc6bde74768a18, 12,343 CJK). The producer "
    "scripts/segment_caoshan_benji.py partitions the fascicle into 84 contiguous units — 1 preface, "
    "1 opening heading, 75 record paragraphs, 6 Caodong treatises and 1 close — and asserts that "
    "their concatenation equals the pinned reference extraction character for character. Its "
    "collation is 169/169 fields EXACT (84 source-content + 85 metadata) with 0 flagged, measured by "
    "scripts/collate_corpus.py --doc caoshan_benji (recorded in "
    "sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI_MEASUREMENT.json). The 37 per-document "
    "entries this overlay inherits are the 2026-09-20 Chuandeng Lu overlay's entries verbatim, so the "
    "designated flagged total stays 630 — the new document adds none.",
    "The record's own reference has a verified historical anchor, and that is recorded rather than "
    "implied: T47n1987A's digest is byte-identical between the 2026-09-09 and this overlay's manifest, "
    "so the entry records historical_status='verified' and the document does not enter "
    "documents_with_drifted_references. The document itself is new to the evidence record — the "
    "2026-09-09 pass never covered it — and is declared in generation_parameters.new_documents. The "
    "reference set grows by one work with this task: T48n2006 (人天眼目) enters as a probe of "
    "caoshan_benji because its 曹洞宗 section carries a parallel recension of the record's 五位君臣旨訣 "
    "passage; a probe only annotates `also_in` and never a class, and its digest is byte-identical to "
    "the 2026-09-09 manifest (historical_status='verified'), so it adds a reference without adding "
    "drift. The sibling record data/corpus/dongshan_yulu.json, whose five_ranks commentaries are "
    "paraphrases of material this record carries verbatim, is unchanged: re-pointing it is R-A work "
    "and is not done by this overlay.",
]


def load(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def witness_note() -> str:
    return (
        "Recorded 2026-09-20 from the pinned witness: all 84 units (preface, opening heading, 75 "
        "record paragraphs, 6 Caodong treatises, close) are verbatim and contiguous in T47n1987A — "
        "169 fields measured, 169 EXACT, 0 flagged. The producer asserts that the concatenation of "
        "the unit texts equals the digest-verified reference extraction character for character "
        "(12,343 CJK characters), so no run of the witness is omitted, duplicated or invented. Unit "
        "locators anchor at the lb line head printed before each unit, with the last lb inside the "
        "unit as its closing line. This document is new to the evidence: the 2026-09-09 pass never "
        "covered it, so it is declared in generation_parameters.new_documents; its reference "
        "T47n1987A verifies byte-identically against both the authoritative and the historical "
        "manifest (historical_status='verified'), so the collated claim rests on a byte-verified "
        "reference with a byte-verified historical anchor. The sibling part of the same Taishō number "
        "(T47n1987B, the 曹洞語錄 recension), X68n1315, T51n2076 and T48n2006 are probes, not claimed "
        "witnesses: they carry material about the master or a parallel recension, and the extract "
        "does not borrow a character from any of them. No existing corpus record was read: the "
        "producer's only inputs are the pinned witness file and its digest-verified reference "
        "extraction."
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
                         "document; the overlay would be recording a failed collation, not an ingestion")
    if NEW_PROBE not in (measured.get("probes") or []):
        raise SystemExit(f"{MEASUREMENT.name} does not carry {NEW_PROBE} among {NEW_KEY}'s probes; the "
                         "reference set this overlay declares would not match the committed manifest")
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
          f"changed_status={register['reproduction']['documents_with_changed_status']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
