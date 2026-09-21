#!/usr/bin/env python3
"""Amend the authoritative W1 register with the re-keyed Record of Linji (task P2.9).

The corpus regained its Linji document on 2026-09-21: the purged retelling was replaced by
`data/corpus/linji_yulu.json`, a from-scratch extraction produced by
`scripts/segment_linji_yulu.py` from the pinned CBETA XML P5 witness `T47n1985`
(鎮州臨濟慧照禪師語錄) at revision `dbdea41071e1e260ad84b72faefd4587333cf76d` — the whole
16,366-CJK fascicle, tiled in 107 verbatim contiguous sections:

* the four 序 prefaces (元貞二年 1296 by 林泉老人從倫, 大德二年 1298 by 郭天錫, 五峯普秀, 馬防),
* the fascicle heading with the 住三聖嗣法小師慧然集 compiler byline,
* 38 record sections (上堂/示眾: 赤肉團上有一無位真人, 三玄三要, 四料簡 …),
* 23 勘辨 sections (黃檗, 普化, 大覺, 趙州, 麻谷, 龍牙, the 四喝 passage …),
* 21 行錄 sections (the biography opening, 大愚, 栽松, 溧山, 鳳林, 金牛, the death record),
* the fascicle close and the printing colophon (存獎校勘, 永享九年 1437).

Measured by `scripts/collate_corpus.py --doc linji_yulu` (the run committed as
`sessions/COLLATION_REGISTER_2026-09-21_LINJI_MEASUREMENT.json`): **215 fields measured, 215
EXACT, 0 flagged** — 107 of 107 source-content fields collating and 108 metadata fields (the 107
section `title_zh` headings plus the root title, all verbatim witness strings). Because the witness
is claimed, the reference T47n1985 had to enter the authoritative digest manifest; the published
manifest is the previous 17-work manifest plus that one line (byte-identical otherwise), and the
extraction's digest is also byte-identical to the historical 2026-09-09 manifest's entry for
T47n1985 — so this document is *not* new to the evidence record and needs no new-document waiver;
the historical register already covered it (hiding the status move behind a waiver would be worse
than recording it).

This script produces the dated overlay, with the smallest possible change:

* **12 document entries are inherited verbatim** from the 2026-09-21 enthusiast-fulls overlay
  (which inherited the 2026-09-20 Caoshan overlay's 38 entries). Re-measuring them here would move
  their measured classes — a re-designation of the evidence, which the standing rulings forbid.
* **One document entry is appended**, copied verbatim from the harness's own measurement.
* **The register-level blocks are recomputed** with the harness's own code — `collate_corpus.reproduce`
  and `source_review` — never transcribed.

Declared facts, not waived ones: the new manifest has 18 works (the 17 the enthusiast overlay
committed plus T47n1985); the entry's reference verification records status `verified` against the
new manifest and `historical_status` `verified` against the 2026-09-09 anchor for the same digest;
the reproduction block compares 4 documents now (the three purge-surviving seeds plus Linji) and
records Linji's derived status moving from `partial_or_failed_w1_collation` to
`collated_to_claimed_witness` as the one difference — the same move the 2026-09-10 correction
overlay recorded as `documents_with_changed_status: 0` when nothing moved, and the reason the
figure is recomputed rather than asserted. The document contributes no flags, so the active
flagged total stays 15 with 13 documents.

Usage:
    python3 scripts/record_linji_evidence.py
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

PREVIOUS_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json"
HISTORICAL_REGISTER = ROOT / "sessions/COLLATION_REGISTER_2026-09-09.json"
MEASUREMENT = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_LINJI_MEASUREMENT.json"
OUTPUT = ROOT / "sessions/COLLATION_REGISTER_2026-09-21_LINJI.json"

NEW_KEYS = ("linji_yulu",)
GENERATED = "2026-09-21"
#: The figure the 2026-09-09 human-readable report claimed; its register sums to 622, so the claim
#: stays recorded as superseded (inherited through the correction chain).
HISTORICAL_REPORT_FLAGGED = 637
#: The active flagged total this overlay must not move: the new document contributes no flags.
DESIGNATED_FLAGGED_TOTAL = 15

NOTES = [
    "2026-09-21 (task P2.9): the Record of Linji enters the active manifest as the 13th document — "
    "not as a patched retelling but as a from-scratch extraction of the pinned witness T47n1985 "
    "(鎮州臨濟慧照禪師語錄) by scripts/segment_linji_yulu.py. The producer tiles the whole 16,366-CJK "
    "fascicle in 107 sections (4 序 prefaces, the fascicle heading, 38 record sections, 23 勘辨, "
    "21 行錄, the close and the printing colophon) and asserts at run time that the concatenation of "
    "the section texts equals the digest-verified reference extraction character for character, so no "
    "run of the witness is omitted, duplicated or invented; the region bounds, region CJK count and "
    "unit count are pinned in the producer and fail the run on drift. Measured: 215 fields, 215 EXACT, "
    "0 flagged — 107 of 107 source-content fields collating (recorded in "
    "sessions/COLLATION_REGISTER_2026-09-21_LINJI_MEASUREMENT.json). Each section carries its own "
    "`lb`-anchored locator (sessions/P2_LINJI_YULU_2026-09-21_locators.json → "
    "data/canonical_locators.json `unit_locators`). The purged retelling is not read, patched or "
    "carried over; the 2026-09-10 correction's finding that its content collated 0/6 EXACT in the "
    "claimed witness stays on the historical record.",
    "The reference layer changes by one line: sessions/COLLATION_W1_2026-09-21_LINJI_refs_manifest.txt "
    "is the 17-work manifest of the enthusiast overlay plus T47n1985, and that extraction's digest is "
    "byte-identical to the 2026-09-09 historical manifest's entry for the same work — so the claimed "
    "reference verifies against both anchors and the document needs no new-document waiver (the "
    "historical register already covered it). The reproduction block therefore compares four "
    "documents and records exactly one classification difference: linji_yulu's derived status moves "
    "from partial_or_failed_w1_collation (84 flagged entries, 80 of 164 fields EXACT on the retelling) "
    "to collated_to_claimed_witness (0 flagged, 215 of 215 fields EXACT on the witness). The other "
    "three compared documents reproduce byte-identically. The inherited 12 entries are not "
    "re-measured and the designated flagged total stays 15.",
]

#: Purge-era convention (2026-09-21): the authoritative documents map holds the active documents, so
#: the harness mapping still lists the purged keys that no register entry carries. The previous
#: overlay records that state as an empty list; this overlay inherits it rather than re-deriving a
#: list of withdrawn documents from the harness's mapping.
DOCUMENTS_WITHOUT_EVIDENCE: list[str] = []


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
        measured = measurement["documents"].get(key)
        if not isinstance(measured, dict):
            raise SystemExit(f"{MEASUREMENT.name} carries no {key} entry to record")
        if measured.get("source_review_status") != source_review.COLLATED_STATUS:
            raise SystemExit(f"{key} measures {measured.get('source_review_status')!r}, not a collated "
                             "document; the overlay would be recording a failed collation, not a re-key")
        documents[key] = measured
    # The new-document waivers are cumulative and unchanged: linji_yulu is covered by the historical
    # register, so it must NOT be added here (w1_evidence rejects a waiver for a covered key).
    new_documents = list(previous.get("generation_parameters", {}).get("new_documents") or [])
    for key in NEW_KEYS:
        if key in new_documents:
            raise SystemExit(f"{key} is already waived as a new document, but the historical register "
                             "covers it; the waiver would misstate the evidence chain")

    # Register-level reference verification: this overlay's manifest is the union the entries need,
    # and it must be exactly that set (w1_evidence checks both directions).
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
            "documents_without_evidence": list(DOCUMENTS_WITHOUT_EVIDENCE),
            "documents_with_drifted_references": drifted_docs,
        },
    }
    register["reproduction"] = collate_corpus.reproduce(
        documents, str(HISTORICAL_REGISTER), HISTORICAL_REPORT_FLAGGED, NOTES)

    if register["aggregate"]["flagged_entries"] != DESIGNATED_FLAGGED_TOTAL:
        raise SystemExit(f"the overlay moves the active flagged total to "
                         f"{register['aggregate']['flagged_entries']}; it must stay at "
                         f"{DESIGNATED_FLAGGED_TOTAL} (the new document contributes no flags)")
    if register["reproduction"]["documents_with_changed_status"] != 1:
        raise SystemExit("the reproduction block must record exactly one status move "
                         f"(linji_yulu), got {register['reproduction']['documents_with_changed_status']}")
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
    for diff in register["reproduction"].get("differences", []):
        print(f"  difference: {diff['key']} {diff['historical_source_review_status']} -> "
              f"{diff['corrected_source_review_status']} (flagged "
              f"{diff['historical_flagged_entries']} -> {diff['corrected_flagged_entries']})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
