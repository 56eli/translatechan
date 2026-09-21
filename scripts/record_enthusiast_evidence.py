#!/usr/bin/env python3
"""Amend the authoritative W1 register with the six enthusiast full-witness documents (task 050).

The corpus gained six documents on 2026-09-21, every one produced by
`scripts/segment_full_witness.py` from the pinned CBETA XML P5 witnesses
(revision `dbdea41071e1e260ad84b72faefd4587333cf76d`), each tiling its witness region contiguously:

* `huangbo_fayao_full` — 黃檗山斷際禪師傳心法要 (T48n2012A), 19 units / 6,632 CJK;
* `mazu_guanglu_full` — the record printed as 馬祖道一禪師廣錄 四家語錄卷一 (X69n1321), 35 units / 4,732 CJK;
* `yunmen_guanglu_full` — 雲門匡真禪師廣錄 (T47n1988), 776 units / 43,678 CJK;
* `dongshan_yulu_full` — 洞山良价禪師語錄 both fascicle parts (T47n1986A+B), 322 units / 24,439 CJK;
* `zhaozhou_yulu_full` — 趙州真際禪師語錄 as printed in the Guzunsu yulu (X68n1315 juan 13–14), 80 units / 21,038 CJK;
* `dahui_yulu_full` — 大慧普覺禪師語錄 with the juan 25–30 letters, plus the 宗門武庫 (T47n1998A+B), 1,354 units / 202,073 CJK.

Measured together by `scripts/collate_corpus.py --doc …` (the run committed as
`sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT_MEASUREMENT.json`): 5,178 fields, 5,178
EXACT, 0 flagged — 2,586 source-content fields collating of 2,586, and 2,592 metadata fields
(witness-titled unit headings and the six root `title_zh`, all verbatim strings the witnesses print).

This script produces the dated overlay, with the smallest possible change:

* **38 document entries are inherited verbatim** from the 2026-09-20 Caoshan Benji overlay (which
  inherited the 2026-09-20 Chuandeng Lu overlay's 37 entries, itself inheriting the 2026-09-20
  correction overlay's 36). Re-measuring them here would move their measured classes — a
  re-designation of the evidence, which the standing rulings forbid.
* **Six document entries are appended**, copied verbatim from the harness's own measurement.
* **The register-level blocks are recomputed** with the harness's own code — `collate_corpus.reproduce`
  and `source_review` — never transcribed.

Declared exceptions: all six documents are new to the evidence record and carried in
`generation_parameters.new_documents` (cumulative with the three earlier waivers). Five of the six
claimed references verify byte-identically against both the authoritative (41-work) and the
historical 2026-09-09 anchor; `zhaozhou_yulu_full` claims X68n1315, whose reference carries recorded
drift against the historical manifest — the drift is recorded in the register
(`documents_with_drifted_references`) and in the entry, not waived away, and the authoritative
manifest's digest for that extraction is byte-identical. The six documents contribute no flags, so
the designated flagged total stays 630, and the reference set is unchanged as a set (41 works):
every claimed witness and probe was already in the manifest the Caoshan overlay committed.

Usage:
    python3 scripts/record_enthusiast_evidence.py
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

PREVIOUS_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json"
HISTORICAL_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-09.json"
MEASUREMENT = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT_MEASUREMENT.json"
OUTPUT = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json"

NEW_KEYS = ("huangbo_fayao_full", "mazu_guanglu_full", "yunmen_guanglu_full",
            "dongshan_yulu_full", "zhaozhou_yulu_full", "dahui_yulu_full")
GENERATED = "2026-09-21"
#: The figure the 2026-09-09 human-readable report claimed; its register sums to 622, so the claim
#: stays recorded as superseded (inherited through the correction chain).
HISTORICAL_REPORT_FLAGGED = 637
#: The designated flagged total this overlay must not move: the new documents contribute no flags.
DESIGNATED_FLAGGED_TOTAL = 630

NOTES = [
    "2026-09-21 (task 050): six full-witness documents enter the active manifest as documents 39–44, "
    "all extracted by scripts/segment_full_witness.py from the pinned CBETA XML P5 witnesses at "
    "revision dbdea41071e1e260ad84b72faefd4587333cf76d — huangbo_fayao_full (T48n2012A, 19 units, "
    "6,632 CJK), mazu_guanglu_full (X69n1321, 35 units, 4,732 CJK), yunmen_guanglu_full (T47n1988, "
    "776 units, 43,678 CJK), dongshan_yulu_full (T47n1986A+B, 322 units, 24,439 CJK), "
    "zhaozhou_yulu_full (X68n1315 juan 13–14, 80 units, 21,038 CJK) and dahui_yulu_full (T47n1998A+B, "
    "1,354 units, 202,073 CJK). Each producer run asserts that the concatenation of its unit texts "
    "equals the digest-verified reference extraction's region character for character, so no run of "
    "a witness is omitted, duplicated or invented; unit geometry (region bounds, region CJK, unit "
    "count) is pinned in the producer and fails the run on drift. Measured together: 5,178 fields, "
    "5,178 EXACT, 0 flagged; 2,586/2,586 source-content fields collate (recorded in "
    "sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT_MEASUREMENT.json). The 38 per-document "
    "entries this overlay inherits are the 2026-09-20 Caoshan overlay's entries verbatim, so the "
    "designated flagged total stays 630 — the new documents add none. The four earlier seeds these "
    "documents complete (huangbo_chuanxin, mazu_yulu, yunmen_yulu, dongshan_yulu) and the historical "
    "zhaozhou_yulu seed are left exactly as they stand: no re-designation.",
    "The reference set is unchanged as a set (41 works — every claimed witness and probe was already "
    "in the manifest the Caoshan overlay committed), and five of the six documents claim references "
    "whose digests are byte-identical in both the authoritative and the historical 2026-09-09 "
    "manifest. The exception is declared, not waived: zhaozhou_yulu_full claims X68n1315 (古尊宿語錄), "
    "whose reference extraction carries recorded drift against the historical anchor (one of the "
    "seven drifts the 2026-09-10 correction lists) while verifying byte-identically against the "
    "authoritative manifest — the entry therefore records refs_verified=1 of 1 against the current "
    "anchor and historical_verified=0, and the document enters "
    "reproduction.documents_with_drifted_references alongside the three records the earlier overlays "
    "already listed there. All six documents are new to the evidence record — the 2026-09-09 pass "
    "never covered them — so they are declared in generation_parameters.new_documents; the historical "
    "drift check is waived for them by that declaration, and for zhaozhou_yulu_full the drift is "
    "additionally recorded in the entry, not hidden by the waiver.",
]


def load(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def main() -> int:
    previous = load(PREVIOUS_REGISTER)
    measurement = load(MEASUREMENT)
    current_digests = collate_refs.read_digest_manifest(
        str(ROOT / w1_evidence.FIXED_METADATA["correction_refs_manifest_path"]))
    historical_digests = collate_refs.read_digest_manifest(str(ROOT / w1_evidence.HISTORICAL_REFS_MANIFEST))

    documents = dict(previous["documents"])
    for key in NEW_KEYS:
        if key in documents:
            raise SystemExit(f"{key} is already recorded in {PREVIOUS_REGISTER.name}; this overlay adds it")
    # The new-document waivers are cumulative: documents declared new in an earlier overlay
    # (congronglu, chuandenglu_full, caoshan_benji) must stay waived, because the collated-status
    # rule reads the waiver only from THIS register's generation_parameters.
    prior_new = previous.get("generation_parameters", {}).get("new_documents") or []
    new_documents = list(dict.fromkeys([*prior_new, *NEW_KEYS]))
    for key in NEW_KEYS:
        measured = measurement["documents"].get(key)
        if not isinstance(measured, dict):
            raise SystemExit(f"{MEASUREMENT.name} carries no {key} entry to record")
        if measured.get("source_review_status") != source_review.COLLATED_STATUS:
            raise SystemExit(f"{key} measures {measured.get('source_review_status')!r}, not a collated "
                             "document; the overlay would be recording a failed collation, not an ingestion")
        documents[key] = measured

    # Register-level reference verification: every work the entries claim (plus every work the
    # authoritative manifest lists — the two sets must be identical) with its status against both
    # anchors.
    claimed: set[str] = set(previous["reference_verification"]["refs"])
    for key in NEW_KEYS:
        claimed |= set(documents[key].get("reference_verification") or {})
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
                         f"{DESIGNATED_FLAGGED_TOTAL} (the new documents contribute no flags)")
    OUTPUT.write_text(json.dumps(register, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"register written: {OUTPUT.relative_to(ROOT)}")
    print(f"aggregate: {json.dumps(register['aggregate'], ensure_ascii=False)}")
    print(f"reference_verification: {json.dumps(register['reference_verification']['counts'])} "
          f"historical {json.dumps(register['reference_verification']['historical_counts'])}")
    print(f"drifted refs: {register['reference_verification']['drifted_refs']}")
    print(f"drifted docs: {register['aggregate']['documents_with_drifted_references']}")
    print(f"reproduction: compared={register['reproduction']['documents_compared']} "
          f"identical={register['reproduction']['documents_classification_identical']} "
          f"changed_status={register['reproduction']['documents_with_changed_status']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
