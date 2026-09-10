#!/usr/bin/env python3
"""Merge and check the W1 dated evidence records for TranslateChan.

One module owns the evidence contract so `scripts/validate_data.py`, the generated
metrics, and the regression tests ask the same questions of the same files:

* which dated records exist, and do the paths/dates/scope the manifest declares
  actually match them;
* does *every* manifest item have an evidence entry (and does every evidence entry
  have a manifest item) — a status with no evidence record is an error, and so is an
  evidence record for a document the manifest does not list;
* does each declared status equal the status derived from its evidence entry;
* do the aggregate figures quoted anywhere in the repository come from arithmetic over
  those records rather than from prose.

Two records exist on purpose. `sessions/COLLATION_REGISTER_2026-09-09.json` is the
historical W1 register (34 documents) and is append-only evidence;
`sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` is a dated correction overlay
(35 documents, including the item the original run never mapped). The overlay is
authoritative for current status; the original stays readable and is still verified, so
"the register and the report are missing, wrong, or internally inconsistent" cannot be
papered over by editing one of them.

Nothing here re-scores a document: classification comes from `scripts/collate_corpus.py`
and vocabulary/semantics from `scripts/source_review.py`.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import source_review

DATE_RE = re.compile(r"(20\d{2}-\d{2}-\d{2})")

#: The manifest metadata keys a compliant `data/corpus_manifest.json` must carry —
#: no more (unknown keys mean an undeclared evidence model) and no less.
REQUIRED_METADATA_KEYS = (
    "w1_report_path",
    "w1_register_path",
    "evidence_date",
    "status_scope",
    "correction_report_path",
    "correction_register_path",
    "correction_refs_manifest_path",
    "correction_evidence_date",
    "authoritative_register_path",
    "evidence_model",
    "historical_documents",
    "authoritative_documents",
    "historical_flagged_total",
    "authoritative_flagged_total",
    "superseded_report_flagged_total",
    "metadata_field_note",
    "non_approval_statement",
)

#: Values the repository has decided on; a change here is a deliberate re-designation
#: of the evidence, not a cleanup.
FIXED_METADATA = {
    "w1_report_path": "sessions/COLLATION_W1_2026-09-09.md",
    "w1_register_path": "sessions/COLLATION_REGISTER_2026-09-09.json",
    "evidence_date": "2026-09-09",
    "status_scope": source_review.STATUS_SCOPE,
    "non_approval_statement": source_review.NON_APPROVAL_STATEMENT,
    "correction_report_path": "sessions/COLLATION_W1_2026-09-10_CORRECTION.md",
    "correction_register_path": "sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json",
    "correction_refs_manifest_path": "sessions/COLLATION_W1_2026-09-10_refs_manifest.txt",
    "correction_evidence_date": "2026-09-10",
    "authoritative_register_path": "sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json",
}

PATH_METADATA_KEYS = (
    "w1_report_path",
    "w1_register_path",
    "correction_report_path",
    "correction_register_path",
    "correction_refs_manifest_path",
    "authoritative_register_path",
)
DATE_BEARING_KEYS = {
    "evidence_date": ("w1_report_path", "w1_register_path"),
    "correction_evidence_date": (
        "correction_report_path",
        "correction_register_path",
        "correction_refs_manifest_path",
        "authoritative_register_path",
    ),
}


class EvidenceIssues:
    """Minimal issue sink compatible with `validate_data.Issues`."""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, path: str, message: str, **_: Any) -> None:
        self.errors.append(f"{path}: {message}")

    def warn(self, path: str, message: str) -> None:
        self.warnings.append(f"{path}: {message}")


def date_in(value: Any) -> str | None:
    match = DATE_RE.search(str(value or ""))
    return match.group(1) if match else None


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def documents_of(register: Any) -> dict[str, Any]:
    documents = register.get("documents") if isinstance(register, dict) else None
    return documents if isinstance(documents, dict) else {}


def entry_flagged_count(entry: Any) -> int:
    if not isinstance(entry, dict):
        return 0
    return len(entry.get("flagged") or [])


def entry_content_collated(entry: Any) -> int:
    """Content fields the entry counts as collating, tolerating older registers."""
    if not isinstance(entry, dict):
        return 0
    if isinstance(entry.get("content_fields_collated"), int):
        return int(entry["content_fields_collated"])
    if isinstance(entry.get("content_summary"), dict):
        return sum(entry["content_summary"].get(cls, 0) for cls in source_review.COLLATED_CLASSES)
    summary = entry.get("summary") or {}
    collating = sum(summary.get(cls, 0) for cls in source_review.COLLATED_CLASSES)
    title_flags = sum(
        1 for flag in entry.get("flagged") or []
        if source_review.is_metadata_field(flag.get("path", "")) and flag.get("class") in source_review.COLLATED_CLASSES
    )
    return collating - title_flags


def entry_content_total(entry: Any) -> int:
    if not isinstance(entry, dict):
        return 0
    if isinstance(entry.get("content_fields_total"), int):
        return int(entry["content_fields_total"])
    total = entry.get("fields_total")
    if not isinstance(total, int):
        return 0
    metadata = sum(1 for flag in entry.get("flagged") or [] if source_review.is_metadata_field(flag.get("path", "")))
    declared_metadata = entry.get("metadata_fields_total")
    return total - (declared_metadata if isinstance(declared_metadata, int) else metadata)


def load(root: Path, metadata: Any) -> dict[str, Any]:
    """Load the dated records the manifest points at. Missing files are reported, not fatal."""
    root = Path(root)
    records: dict[str, Any] = {}
    issues: list[str] = []
    for key in PATH_METADATA_KEYS:
        value = metadata.get(key) if isinstance(metadata, dict) else None
        if not isinstance(value, str) or not value:
            issues.append(f"{key} is missing")
            continue
        path = root / value
        if not path.is_file():
            issues.append(f"{key} points to a missing file: {value}")
            continue
        if key.endswith(".json") or value.endswith(".json"):
            try:
                records[key] = {"path": value, "json": read_json(path)}
            except json.JSONDecodeError as exc:
                issues.append(f"{key} is not valid JSON: {exc}")
                continue
        else:
            records[key] = {"path": value, "text": read_text(path)}
    return {"root": root, "records": records, "load_errors": issues}


def validate(manifest: Any, corpus_keys: Any, harness_docs: Any, issues: EvidenceIssues | Any = None,
             root: Path | None = None) -> dict[str, Any]:
    """Check the manifest's evidence metadata and merged registers; return aggregates.

    `corpus_keys` is the set of corpus document keys actually present in `data/corpus/`,
    and `harness_docs` the keys `scripts/collate_corpus.py` can collate. Both take part in
    the coverage rules so an item cannot be declared `witness_unavailable` merely because
    the harness lacks a mapping for it.
    """
    path = "data/corpus_manifest.json.source_review"
    problems = issues if issues is not None else EvidenceIssues()
    record = manifest.get("source_review") if isinstance(manifest, dict) else None
    if not isinstance(record, dict):
        problems.error(path, "requires a manifest-level source_review object")
        return {}
    if root is None:
        root = Path(__file__).resolve().parent.parent

    missing = [key for key in REQUIRED_METADATA_KEYS if key not in record]
    unknown = sorted(set(record) - set(REQUIRED_METADATA_KEYS))
    if missing:
        problems.error(path, "source-review evidence metadata is missing field(s): " + ", ".join(missing))
    if unknown:
        problems.error(path, "unknown source-review field(s): " + ", ".join(unknown))
    for key, expected in FIXED_METADATA.items():
        if key in record and record.get(key) != expected:
            problems.error(path, f"{key} must identify the committed W1 evidence as {expected!r}, got {record.get(key)!r}")

    for key, expected_paths in DATE_BEARING_KEYS.items():
        declared = record.get(key)
        if not isinstance(declared, str) or not date_in(declared):
            problems.error(path, f"{key} must be a YYYY-MM-DD date, got {declared!r}")
            continue
        for ref in expected_paths:
            named = date_in(record.get(ref))
            if named and named != declared:
                problems.error(
                    path,
                    f"{key} ({declared}) does not match the date carried by {ref} filename ({named}); "
                    "dated evidence files are never re-dated in place",
                )

    scope = str(record.get("status_scope") or "")
    if scope != source_review.STATUS_SCOPE:
        problems.error(path, f"status_scope must be exactly {source_review.STATUS_SCOPE!r}, got {scope!r}")
    non_approval = str(record.get("non_approval_statement") or "")
    if non_approval != source_review.NON_APPROVAL_STATEMENT:
        problems.error(path, f"non_approval_statement must be exactly {source_review.NON_APPROVAL_STATEMENT!r}")
    metadata_note = str(record.get("metadata_field_note") or "").lower()
    if "title_zh" not in metadata_note or "name_zh" not in metadata_note or "not proof" not in metadata_note:
        problems.error(
            path,
            "metadata_field_note must say that title/name metadata (title_zh, name_zh) is excluded, so "
            "collated_to_claimed_witness is not proof that the excluded fields were collated",
        )
    model = str(record.get("evidence_model") or "").lower()
    if "historical" not in model or "authoritative" not in model:
        problems.error(path, "evidence_model must name which record is historical and which is authoritative")

    loaded = load(root, record)
    for note in loaded["load_errors"]:
        problems.error(path, note)

    items = [item for item in (manifest.get("items") or []) if isinstance(item, dict)]
    declared_by_key = {str(item.get("key")): item for item in items}

    historical = loaded["records"].get("w1_register_path", {}).get("json")
    authoritative = loaded["records"].get("authoritative_register_path", {}).get("json")
    aggregates: dict[str, Any] = {
        "metadata": dict(record),
        "historical_documents": 0,
        "authoritative_documents": 0,
        "historical_flagged_total": 0,
        "authoritative_flagged_total": 0,
        "per_document": {},
        "reference_verification": {},
        "reproduction": {},
        "status_counts": {status: 0 for status in source_review.VALID_SOURCE_REVIEW_STATUSES},
        "content_fields_total": 0,
        "content_fields_collated": 0,
        "metadata_fields_total": 0,
        "documents_without_collating_content": 0,
        "class_totals": {},
        "superseded": {},
    }

    historical_docs = documents_of(historical)
    authoritative_docs = documents_of(authoritative)
    if not historical_docs:
        problems.error(path, "the historical register has no usable documents map")
    if not authoritative_docs:
        problems.error(path, "the authoritative correction register has no usable documents map")

    aggregates["historical_documents"] = len(historical_docs)
    aggregates["authoritative_documents"] = len(authoritative_docs)
    aggregates["historical_flagged_total"] = sum(entry_flagged_count(e) for e in historical_docs.values())
    aggregates["authoritative_flagged_total"] = sum(entry_flagged_count(e) for e in authoritative_docs.values())
    for field, key in (
        ("historical_documents", "historical_documents"),
        ("authoritative_documents", "authoritative_documents"),
        ("historical_flagged_total", "historical_flagged_total"),
        ("authoritative_flagged_total", "authoritative_flagged_total"),
    ):
        declared = record.get(key)
        if isinstance(declared, int) and declared != aggregates[field]:
            problems.error(
                path,
                f"{key} is {declared} but the evidence records sum to {aggregates[field]}; "
                "recompute it from the register instead of editing the manifest",
            )

    report_text = str(loaded["records"].get("w1_report_path", {}).get("text") or "")
    correction_text = str(loaded["records"].get("correction_report_path", {}).get("text") or "")
    for label, text, key in (("W1 report", report_text, "evidence_date"),
                             ("correction report", correction_text, "correction_evidence_date")):
        declared = record.get(key)
        if not text or not isinstance(declared, str):
            continue
        if declared not in text:
            problems.error(path, f"{label} must carry its declared evidence date {declared!r}")
    report_claim = re.search(r"(\d[\d,]*)\s+entries", report_text)
    if report_claim:
        claim = int(report_claim.group(1).replace(",", ""))
        aggregates["superseded"] = {
            "report_flagged_total": claim,
            "register_flagged_total": aggregates["historical_flagged_total"],
            "reproduced_flagged_total": None,
            "status": "current" if claim == aggregates["historical_flagged_total"] else "superseded",
        }
        if claim != aggregates["historical_flagged_total"]:
            if not isinstance(record.get("superseded_report_flagged_total"), int) or (
                record["superseded_report_flagged_total"] != claim
            ):
                problems.error(
                    path,
                    f"the 2026-09-09 report claims {claim} flagged entries while its register sums to "
                    f"{aggregates['historical_flagged_total']}; declare superseded_report_flagged_total "
                    f"= {claim} and keep the report unmodified",
                )
            if "superseded" not in correction_text.lower():
                problems.error(f"{path}.correction_report_path",
                               "the correction report must label the superseded report figure as superseded")

    merged = dict(historical_docs)
    merged.update(authoritative_docs)
    aggregates["merged_documents"] = merged

    missing_evidence = sorted(set(declared_by_key) - set(merged))
    orphan_evidence = sorted(set(merged) - set(declared_by_key))
    for key in missing_evidence:
        item = declared_by_key[key]
        problems.error(
            f"{path}.items[{key}]",
            f"declares source_review_status={item.get('source_review_status')!r} with no evidence record in "
            "either W1 register — a status may not rest on the absence of a register entry",
        )
    for key in orphan_evidence:
        problems.error(path, f"the evidence registers cover '{key}' but data/corpus_manifest.json has no such item")

    missing_files = sorted(set(corpus_keys or ()) - set(declared_by_key))
    if missing_files:
        problems.error(path, "corpus files without a manifest item: " + ", ".join(missing_files))
    unmapped = sorted(set(declared_by_key) - set(harness_docs or ()))
    if unmapped:
        problems.error(
            path,
            "manifest item(s) have no mapping in scripts/collate_corpus.py DOCS: " + ", ".join(unmapped)
            + " — add the witness mapping and collate, instead of leaving the item without evidence",
        )

    documents = documents_of(authoritative) or merged
    aggregates["per_document"] = {}
    counts: dict[str, int] = {status: 0 for status in source_review.VALID_SOURCE_REVIEW_STATUSES}
    for key in sorted(declared_by_key):
        entry = documents.get(key) or merged.get(key)
        item = declared_by_key[key]
        if not isinstance(entry, dict):
            continue
        try:
            derived = source_review.derive_status(entry)
        except TypeError:
            problems.error(f"{path}.items[{key}]", "evidence entry is not an object")
            continue
        declared = item.get("source_review_status")
        counts[derived] = counts.get(derived, 0) + 1
        if declared != derived:
            problems.error(
                f"{path}.items[{key}]",
                f"source_review_status is {declared!r} but the evidence record derives {derived!r} "
                "(no claimed witness -> witness_unavailable; uncollated source-content field -> "
                "partial_or_failed_w1_collation; otherwise collated_to_claimed_witness)",
            )
        completion = item.get("completion_status")
        if not source_review.is_completion_source_review_compatible(completion, derived):
            problems.error(
                f"{path}.items[{key}]",
                f"completion_status {completion!r} is not representable with source_review_status {derived!r}",
            )
        aggregates["content_fields_total"] += entry_content_total(entry)
        aggregates["content_fields_collated"] += entry_content_collated(entry)
        aggregates["metadata_fields_total"] += int(entry.get("metadata_fields_total") or 0)
        if entry_content_collated(entry) == 0:
            aggregates["documents_without_collating_content"] += 1
        per_doc = {
            "status": derived,
            "flagged_entries": entry_flagged_count(entry),
            "content_fields_total": entry_content_total(entry),
            "content_fields_collated": entry_content_collated(entry),
            "witness_refs": list(entry.get("witness") or []),
            "probe_refs": list(entry.get("probes") or []),
            "refs_total": entry.get("refs_total"),
            "refs_verified": entry.get("refs_verified"),
            "evidence_date": record.get("correction_evidence_date")
            if key in documents else record.get("evidence_date"),
            "evidence_register": record.get("correction_register_path")
            if key in documents else record.get("w1_register_path"),
        }
        if isinstance(entry.get("witness_note"), str):
            per_doc["witness_note"] = entry["witness_note"]
        aggregates["per_document"][key] = per_doc
    aggregates["status_counts"] = {status: counts.get(status, 0) for status in source_review.VALID_SOURCE_REVIEW_STATUSES}

    verification = authoritative.get("reference_verification") if isinstance(authoritative, dict) else None
    if isinstance(verification, dict):
        aggregates["reference_verification"] = {
            "counts": verification.get("counts"),
            "historical_counts": verification.get("historical_counts"),
            "drifted_refs": list(verification.get("drifted_refs") or []),
            "manifest": verification.get("manifest"),
            "historical_manifest": verification.get("historical_manifest"),
        }
        drifted = {name for name, detail in (verification.get("refs") or {}).items()
                   if isinstance(detail, dict) and 'drift' in (detail.get('status'), detail.get('historical_status'))}
        for key, entry in documents.items():
            item = declared_by_key.get(key)
            if not isinstance(item, dict) or item.get("source_review_status") != source_review.COLLATED_STATUS:
                continue
            claimed = set((entry or {}).get("witness") or [])
            offenders = sorted(claimed & drifted)
            if offenders:
                problems.error(
                    f"{path}.items[{key}]",
                    f"claims {source_review.COLLATED_STATUS} on reference(s) {', '.join(offenders)} whose bytes "
                    f"do not match a committed digest manifest; verify the reference or downgrade the status",
                )
        for key, entry in documents.items():
            total = (entry or {}).get("refs_total")
            verified = (entry or {}).get("refs_verified")
            item = declared_by_key.get(key)
            if isinstance(total, int) and total and isinstance(verified, int):
                if item is not None and item.get("source_review_status") == source_review.COLLATED_STATUS and verified != total:
                    problems.error(f"{path}.items[{key}]",
                                   f"{verified}/{total} claimed witnesses are byte-verified")
    elif isinstance(authoritative, dict):
        problems.error(path, "the authoritative register carries no reference_verification block; "
                             "generate it with --refs-manifest so hash verification is recorded, not assumed")

    reproduction = authoritative.get("reproduction") if isinstance(authoritative, dict) else None
    if isinstance(reproduction, dict):
        aggregates["reproduction"] = {
            "compared_register": reproduction.get("compared_register"),
            "documents_compared": reproduction.get("documents_compared"),
            "documents_classification_identical": reproduction.get("documents_classification_identical"),
            "documents_differing": reproduction.get("documents_differing"),
            "documents_with_changed_status": reproduction.get("documents_with_changed_status"),
            "flagged_entries": reproduction.get("flagged_entries"),
            "historical_report_flagged_total": reproduction.get("historical_report_flagged_total"),
            "historical_report_flagged_reproduced": reproduction.get("historical_report_flagged_reproduced"),
        }
        changed = reproduction.get("documents_with_changed_status")
        if isinstance(changed, int) and changed:
            problems.error(
                path,
                f"the correction overlay moves {changed} document status(es); each one needs an explicit "
                "declaration in the correction report before it may change data/corpus_manifest.json",
            )
        aggregates["superseded"]["reproduced_flagged_total"] = (reproduction.get("flagged_entries") or {}).get("this_run")
    elif isinstance(authoritative, dict):
        problems.error(path, "the correction register must record a reproduction block comparing it with the "
                             "historical register (collate_corpus.py --compare-register)")

    if isinstance(authoritative, dict):
        declared_aggregate = authoritative.get("aggregate") or {}
        recomputed = {
            "documents": len(authoritative_docs),
            "flagged_entries": sum(entry_flagged_count(e) for e in authoritative_docs.values()),
            "content_fields_total": sum(entry_content_total(e) for e in authoritative_docs.values()),
            "content_fields_collated": sum(entry_content_collated(e) for e in authoritative_docs.values()),
            "metadata_fields_total": sum(int(e.get("metadata_fields_total") or 0) for e in authoritative_docs.values()),
            "source_review_status_counts": aggregates["status_counts"],
        }
        for field, value in recomputed.items():
            if field not in declared_aggregate:
                continue
            if declared_aggregate[field] != value:
                problems.error(
                    f"{path}",
                    f"authoritative register aggregate.{field} is {declared_aggregate[field]!r} but recomputing "
                    f"its own documents gives {value!r}",
                )
        unaddressed = declared_aggregate.get("documents_without_evidence")
        if isinstance(unaddressed, list) and unaddressed:
            problems.error(path, "the authoritative register lists documents without evidence: " + ", ".join(unaddressed))
        aggregates["class_totals"] = source_review.summary_flags(authoritative_docs)
        generated = authoritative.get("generated")
        if isinstance(generated, str) and generated != record.get("correction_evidence_date"):
            problems.error(path, f"correction register declares generated={generated!r} but the manifest metadata "
                                 f"says {record.get('correction_evidence_date')!r}")
        if authoritative.get("status_scope") != source_review.STATUS_SCOPE:
            problems.error(path, "the authoritative register must carry the containment/remediation scope sentence")
    return aggregates


def metrics_block(aggregates: dict[str, Any]) -> dict[str, Any]:
    """The deterministic public view of the evidence (goes into project_metrics.json)."""
    if not aggregates:
        return {}
    metadata = aggregates.get("metadata") or {}
    block = {
        "status_counts": aggregates.get("status_counts"),
        "documents": aggregates.get("authoritative_documents"),
        "flagged_entries": aggregates.get("authoritative_flagged_total"),
        "content_fields_total": aggregates.get("content_fields_total"),
        "content_fields_collated": aggregates.get("content_fields_collated"),
        "metadata_fields_total": aggregates.get("metadata_fields_total"),
        "documents_without_collating_content": aggregates.get("documents_without_collating_content"),
        "class_totals": aggregates.get("class_totals"),
        "status_scope": source_review.STATUS_SCOPE,
        "non_approval_statement": source_review.NON_APPROVAL_STATEMENT,
        "metadata_field_note": metadata.get("metadata_field_note"),
        "evidence_model": metadata.get("evidence_model"),
        "historical": {
            "report_path": metadata.get("w1_report_path"),
            "register_path": metadata.get("w1_register_path"),
            "evidence_date": metadata.get("evidence_date"),
            "documents": aggregates.get("historical_documents"),
            "flagged_entries": aggregates.get("historical_flagged_total"),
        },
        "authoritative": {
            "report_path": metadata.get("correction_report_path"),
            "register_path": metadata.get("correction_register_path"),
            "refs_manifest_path": metadata.get("correction_refs_manifest_path"),
            "evidence_date": metadata.get("correction_evidence_date"),
            "documents": aggregates.get("authoritative_documents"),
            "flagged_entries": aggregates.get("authoritative_flagged_total"),
        },
        "status_labels": dict(source_review.SOURCE_REVIEW_STATUS_LABELS),
        "disclosure_ledgers": [
            {"key": key, "label": label} for key, label in source_review.DISCLOSURE_LEDGERS
        ],
        "ledger_separation_note": source_review.LEDGER_SEPARATION_NOTE,
        "superseded": aggregates.get("superseded") or {},
        "reproduction": aggregates.get("reproduction") or {},
        "reference_verification": aggregates.get("reference_verification") or {},
        "completion_compatibility": source_review.completion_compatibility_matrix(),
    }
    return {key: value for key, value in block.items() if value not in (None, {}, [])}
