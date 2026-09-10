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

Every derived figure is independently recomputed from the register's document
entries; stored totals are *checked*, never trusted — a stored number that happens
to agree with another stored number proves nothing about the underlying fields:

* per-document: `fields_total` vs the class summary, content+metadata vs total,
  collated vs total, summary vs content/metadata summaries, flagged-entry totals vs
  the actual `flagged` arrays, the stored status vs `source_review.derive_status`,
  and the witness/probe/reference-verification totals vs the two committed digest
  manifests;
* aggregate: document counts, flagged entries, field totals, class totals, status
  counts, and the drifted-reference list, recomputed from the document entries;
* reproduction: the historical-vs-authoritative comparison (compared documents,
  identical/differing classifications, changed-status count, per-document
  differences) recomputed from the two registers themselves;
* report prose: the numeric claims in the correction report (document counts,
  flagged-entry reconciliation, status counts, reference-verification counts,
  reproduction figures, the cited register/manifest digests) checked against the
  recomputation, so a claim that disagrees with the evidence fails the run.

Two records exist on purpose. `sessions/COLLATION_REGISTER_2026-09-09.json` is the
historical W1 register (34 documents) and is append-only evidence;
`sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` is a dated correction overlay
(35 documents, including the item the original run never mapped). The overlay is
authoritative for current status; the original stays readable and is still verified, so
"the register and the report are missing, wrong, or internally inconsistent" cannot be
papered over by editing one of them.

Reference provenance: a digest manifest maps work ids to SHA-256 digests of the
extracted reference texts. Per-reference `status`/`historical_status` in a register
are checked against the two committed manifests byte-for-byte (the digests recorded in
the register must equal the committed digests, and `verified`/`drift`/`unlisted` must
be the truth for that digest). A drifted or unlisted reference never upgrades a W1
status: a `collated_to_claimed_witness` claim whose claimed witness reference is not
byte-verified against both anchors is a validation failure.

Nothing here re-scores a document: classification comes from `scripts/collate_corpus.py`
and vocabulary/semantics from `scripts/source_review.py`.
"""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

import source_review

DATE_RE = re.compile(r"(20\d{2}-\d{2}-\d{2})")
#: CBETA work ids as published in the digest manifests (Taishō/Zokuzōkyō series).
WORK_ID_RE = re.compile(r"^[TXJ]\d{2}n\d{3,4}[A-Za-z]?$")
DIGEST_RE = re.compile(r"^[0-9a-f]{64}$")
MANIFEST_LINE_RE = re.compile(r"^([0-9a-f]{64}) {2}ref_([A-Za-z0-9]+)\.txt$")

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

#: The pinned CBETA XML P5 revision the authoritative references were extracted from.
#: Changing it is a re-designation of the evidence, not a cleanup.
PINNED_UPSTREAM_REVISION = "dbdea41071e1e260ad84b72faefd4587333cf76d"
UPSTREAM_REPO = "https://github.com/cbeta-org/xml-p5"
EXTRACTION_RULE_ID = "cbeta-p5-body-cjk-v1"

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
#: The historical digest manifest is part of the committed evidence even though the
#: manifest metadata only declares the correction side by name.
HISTORICAL_REFS_MANIFEST = "sessions/COLLATION_W1_2026-09-09_refs_manifest.txt"

#: Exact top-level keys each register must carry. The historical register is the
#: original, leaner schema; the overlay adds the reference/reproduction/aggregate
#: blocks that make the reference layer reproducible.
REQUIRED_HISTORICAL_KEYS = ("generated", "harness", "refs_manifest", "documents")
REQUIRED_AUTHORITATIVE_KEYS = (
    "kind",
    "generated",
    "harness",
    "corrects",
    "reference_extraction",
    "upstream",
    "refs_manifest",
    "historical_refs_manifest",
    "generation_parameters",
    "content_denominator",
    "status_scope",
    "documents",
    "reference_verification",
    "reproduction",
    "aggregate",
)

#: Per-document entry keys. `witness_note` is the one optional advisory field.
REQUIRED_ENTRY_KEYS_AUTHORITATIVE = (
    "witness",
    "probes",
    "summary",
    "content_summary",
    "metadata_summary",
    "fields_total",
    "content_fields_total",
    "content_fields_collated",
    "metadata_fields_total",
    "flagged",
    "source_review_status",
    "reference_verification",
    "refs_total",
    "refs_verified",
    "refs_historically_verified",
)
OPTIONAL_ENTRY_KEYS = ("witness_note",)
REQUIRED_ENTRY_KEYS_HISTORICAL = ("witness", "summary", "fields_total", "flagged")

REQUIRED_FLAG_KEYS = ("path", "class", "sim", "ref", "corpus", "ref_window", "simplified")
OPTIONAL_FLAG_KEYS = ("also_in",)

#: Harness classes that never appear in `flagged` (they *are* the collated text).
NEVER_FLAGGED_CLASSES = ("EXACT", "EMPTY")

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


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _collect_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    """object_pairs_hook that records (and still keeps) duplicate object keys."""
    keys = [key for key, _ in pairs]
    duplicates = [key for key, count in Counter(keys).items() if count > 1]
    if duplicates:
        raise DuplicateKeyError(sorted(set(duplicates)))
    return dict(pairs)


class DuplicateKeyError(ValueError):
    def __init__(self, keys: list[str]) -> None:
        super().__init__("duplicate JSON keys: " + ", ".join(keys))
        self.keys = keys


def read_json_strict(path: Path) -> tuple[Any, list[str] | None]:
    """Load a JSON file; returns (value, duplicate_keys) where duplicates are a
    blocking evidence defect (the register is a contract, not a bag)."""
    text = path.read_text(encoding="utf-8")
    try:
        return json.loads(text, object_pairs_hook=_collect_duplicates), None
    except DuplicateKeyError as exc:
        return None, exc.keys
    except json.JSONDecodeError as exc:
        raise


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
                payload, duplicates = read_json_strict(path)
            except json.JSONDecodeError as exc:
                issues.append(f"{key} is not valid JSON: {exc}")
                continue
            if duplicates:
                issues.append(f"{key} contains duplicate JSON keys ({', '.join(duplicates)}); "
                              "a register is a contract and duplicate keys hide an edit")
                continue
            records[key] = {"path": value, "json": payload}
        else:
            records[key] = {"path": value, "text": read_text(path)}
    # The historical digest manifest is committed evidence even though the manifest
    # metadata names it only through the registers; load it for provenance checks.
    hist_manifest_path = root / HISTORICAL_REFS_MANIFEST
    if hist_manifest_path.is_file():
        records["historical_refs_manifest_path"] = {
            "path": HISTORICAL_REFS_MANIFEST,
            "text": read_text(hist_manifest_path),
        }
    return {"root": root, "records": records, "load_errors": issues}


def parse_digest_manifest(text: Any, label: str, problems: EvidenceIssues) -> dict[str, str]:
    """`<sha256>  ref_<WorkId>.txt` lines -> {work: sha}. Malformed or duplicate lines fail."""
    digests: dict[str, str] = {}
    if not isinstance(text, str):
        problems.error(label, "digest manifest is missing or unreadable")
        return digests
    for lineno, line in enumerate(text.splitlines(), 1):
        if not line.strip():
            continue
        match = MANIFEST_LINE_RE.match(line)
        if not match:
            problems.error(label, f"line {lineno} is malformed: {line[:70]!r}")
            continue
        digest, work = match.group(1), match.group(2)
        if not WORK_ID_RE.match(work):
            problems.error(label, f"line {lineno}: work id {work!r} is not a CBETA work id")
        if work in digests:
            problems.error(label, f"work {work} is listed twice (lines with digests {digest} and {digests[work]})")
            continue
        digests[work] = digest
    if not digests:
        problems.error(label, "digest manifest lists no reference works")
    return digests


def _is_int(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


def _check_keys(entry: dict[str, Any], required: tuple[str, ...], optional: tuple[str, ...],
                path: str, problems: EvidenceIssues, kind: str) -> None:
    missing = [key for key in required if key not in entry]
    unknown = sorted(set(entry) - set(required) - set(optional))
    if missing:
        problems.error(path, f"{kind} is missing key(s): {', '.join(missing)}")
    if unknown:
        problems.error(path, f"{kind} has undeclared key(s): {', '.join(unknown)}; "
                             "evidence records carry a fixed key set")


def _check_summary_map(value: Any, path: str, problems: EvidenceIssues, label: str) -> dict[str, int]:
    if not isinstance(value, dict) or not value:
        problems.error(path, f"{label} must be a non-empty object of class -> count")
        return {}
    result: dict[str, int] = {}
    for cls, count in value.items():
        if not _is_int(count) or count < 0:
            problems.error(path, f"{label}.{cls} must be a non-negative integer, got {count!r}")
        else:
            result[str(cls)] = count
    return result


def _flag_classes(entry: dict[str, Any], path: str, problems: EvidenceIssues) -> dict[str, int]:
    """Validate the flagged array's shape and return per-class flagged counts."""
    flags = entry.get("flagged")
    if not isinstance(flags, list):
        problems.error(path, "flagged must be an array of field findings")
        return {}
    counts: dict[str, int] = {}
    for index, flag in enumerate(flags):
        flag_path = f"{path}.flagged[{index}]"
        if not isinstance(flag, dict):
            problems.error(flag_path, "must be an object")
            continue
        _check_keys(flag, REQUIRED_FLAG_KEYS, OPTIONAL_FLAG_KEYS, flag_path, problems, "flagged entry")
        cls = flag.get("class")
        if not isinstance(cls, str):
            problems.error(flag_path, f"class must be a string, got {cls!r}")
            continue
        if not isinstance(flag.get("path"), str) or not flag["path"]:
            problems.error(flag_path, "path must be a non-empty JSON-pointer-like string")
        if not _is_int(flag.get("sim")) and not (isinstance(flag.get("sim"), float)):
            problems.error(flag_path, f"sim must be a number, got {flag.get('sim')!r}")
        if not isinstance(flag.get("corpus"), str):
            problems.error(flag_path, "corpus must be the normalized corpus text")
        if not isinstance(flag.get("ref_window"), str):
            problems.error(flag_path, "ref_window must be a string (empty when none)")
        if not isinstance(flag.get("simplified"), list):
            problems.error(flag_path, "simplified must be the list of simplified characters found")
        counts[cls] = counts.get(cls, 0) + 1
    return counts


def validate_entry(key: str, entry: Any, required_keys: tuple[str, ...], is_authoritative: bool,
                   current_digests: dict[str, str], historical_digests: dict[str, str],
                   path: str, problems: EvidenceIssues) -> None:
    """One document entry: key integrity + all internal arithmetic + reference provenance."""
    if not isinstance(entry, dict):
        problems.error(path, f"{key}: evidence entry is not an object")
        return
    _check_keys(entry, required_keys, OPTIONAL_ENTRY_KEYS, path, problems, "document entry")

    witness = entry.get("witness")
    probes = entry.get("probes") if is_authoritative else []
    for label, value in (("witness", witness), ("probes", probes)):
        if not isinstance(value, list) or any(not isinstance(w, str) for w in value or []):
            problems.error(path, f"{key}: {label} must be a list of CBETA work ids")
            continue
        for work in value or []:
            if not WORK_ID_RE.match(work):
                problems.error(path, f"{key}: {label} contains non-work id {work!r}")

    summary = _check_summary_map(entry.get("summary"), path, problems, "summary")
    content_summary = _check_summary_map(entry.get("content_summary"), path, problems, "content_summary") if is_authoritative else {}
    metadata_summary = _check_summary_map(entry.get("metadata_summary"), path, problems, "metadata_summary") if is_authoritative else {}
    flag_counts = _flag_classes(entry, path, problems)

    for field in ("fields_total", "content_fields_total", "content_fields_collated", "metadata_fields_total"):
        if is_authoritative and not _is_int(entry.get(field)):
            problems.error(path, f"{key}: {field} must be a non-negative integer, got {entry.get(field)!r}")
    fields_total = entry.get("fields_total")
    if _is_int(fields_total) and fields_total != sum(summary.values()):
        problems.error(path, f"{key}: fields_total is {fields_total} but the class summary sums to "
                             f"{sum(summary.values())}; recompute it from the entries")
    if is_authoritative:
        c_total = entry.get("content_fields_total")
        m_total = entry.get("metadata_fields_total")
        c_collated = entry.get("content_fields_collated")
        if _is_int(c_total) and c_total != sum(content_summary.values()):
            problems.error(path, f"{key}: content_fields_total is {c_total} but content_summary sums to "
                                 f"{sum(content_summary.values())}")
        if _is_int(m_total) and m_total != sum(metadata_summary.values()):
            problems.error(path, f"{key}: metadata_fields_total is {m_total} but metadata_summary sums to "
                                 f"{sum(metadata_summary.values())}")
        if _is_int(c_total) and _is_int(m_total) and _is_int(fields_total) and c_total + m_total != fields_total:
            problems.error(path, f"{key}: content_fields_total + metadata_fields_total is {c_total} + {m_total} "
                                 f"but fields_total is {fields_total}")
        if _is_int(c_collated) and _is_int(c_total) and c_collated > c_total:
            problems.error(path, f"{key}: content_fields_collated ({c_collated}) exceeds content_fields_total ({c_total})")
        if _is_int(c_collated) and c_collated != sum(content_summary.get(cls, 0) for cls in source_review.COLLATED_CLASSES):
            problems.error(path, f"{key}: content_fields_collated is {c_collated} but the collating content classes "
                                 f"(EXACT/REWORDED) sum to {sum(content_summary.get(cls, 0) for cls in source_review.COLLATED_CLASSES)}")
        merged_classes: dict[str, int] = {}
        for table in (content_summary, metadata_summary):
            for cls, count in table.items():
                merged_classes[cls] = merged_classes.get(cls, 0) + count
        if merged_classes != summary:
            problems.error(path, f"{key}: content_summary + metadata_summary ({merged_classes}) does not "
                                 f"reconcile with summary ({summary})")

    # Flagged arrays must be exactly the non-collated findings: per-class counts agree
    # with the summary, and EXACT/EMPTY fields never appear.
    for cls, count in flag_counts.items():
        if cls in NEVER_FLAGGED_CLASSES:
            problems.error(path, f"{key}: {count} flagged {cls} entr{'y' if count == 1 else 'ies'} — "
                                 f"{cls} fields are collated text and are never flagged")
        elif summary.get(cls, 0) != count:
            problems.error(path, f"{key}: {count} flagged {cls} entr{'y' if count == 1 else 'ies'} but summary "
                                 f"counts {summary.get(cls, 0)}; the flagged array must list every non-collated field")
    for cls, count in summary.items():
        if cls in NEVER_FLAGGED_CLASSES:
            continue
        if flag_counts.get(cls, 0) != count:
            problems.error(path, f"{key}: summary counts {count} {cls} but only {flag_counts.get(cls, 0)} "
                                 "are in the flagged array")

    # The stored status must be the derived status; absence of evidence has no status.
    try:
        derived = source_review.derive_status(entry)
    except TypeError:
        derived = None
    stored = entry.get("source_review_status")
    if is_authoritative:
        if not isinstance(stored, str):
            problems.error(path, f"{key}: source_review_status must be a string")
        elif stored != source_review.UNAVAILABLE_STATUS and witness is None:
            problems.error(path, f"{key}: source_review_status without a witness list")
        if isinstance(stored, str) and derived is not None and stored != derived:
            problems.error(path, f"{key}: source_review_status is {stored!r} but the entry's own fields derive "
                                 f"{derived!r}")

    if not is_authoritative:
        return

    # Reference provenance: every claimed witness reference must be recorded with a
    # digest that equals the committed digest-manifest digests, and the status words
    # must be the truth for those digests. Drift/unlisted never supports a collated
    # claim.
    rv = entry.get("reference_verification")
    if not isinstance(rv, dict):
        problems.error(path, f"{key}: reference_verification must be an object")
        rv = {}
    witness_set = set(witness or [])
    probe_set = set(probes or [])
    for work in witness_set - set(rv):
        problems.error(path, f"{key}: claimed witness reference {work} has no digest verification record")
    for work in set(rv) - witness_set - probe_set:
        problems.error(path, f"{key}: reference_verification lists {work}, which is neither a claimed witness "
                             "nor a probe of this document")
    verified_witnesses = 0
    historically_verified_witnesses = 0
    for work in sorted(witness_set & set(rv)):
        detail = rv[work]
        detail_path = f"{path}.reference_verification.{work}"
        if not isinstance(detail, dict):
            problems.error(detail_path, "must be an object with sha256/status/historical_status")
            continue
        _check_keys(detail, ("sha256", "status", "historical_status"), (), detail_path, problems, "reference detail")
        sha = detail.get("sha256")
        if not DIGEST_RE.match(str(sha or "")):
            problems.error(detail_path, f"sha256 is not a 64-hex digest: {sha!r}")
            continue
        expected = current_digests.get(work)
        if expected is None:
            problems.error(detail_path, f"{work} is absent from the authoritative digest manifest, so its "
                                        "verification cannot stand")
            continue
        if sha != expected:
            problems.error(detail_path, f"recorded digest {sha[:12]}… does not match the committed "
                                        f"{work} digest {expected[:12]}… in the authoritative manifest")
        if detail.get("status") != "verified":
            problems.error(detail_path, f"status must be 'verified' when the digest matches the authoritative "
                                        f"manifest, got {detail.get('status')!r}")
        hist_expected = historical_digests.get(work)
        if hist_expected is None:
            expected_hist = "unlisted"
        else:
            expected_hist = "verified" if hist_expected == sha else "drift"
        if detail.get("historical_status") != expected_hist:
            problems.error(detail_path, f"historical_status is {detail.get('historical_status')!r} but the "
                                        f"committed historical manifest says {expected_hist!r} for this digest")
        if detail.get("status") == "verified":
            verified_witnesses += 1
        if detail.get("historical_status") in ("verified", "none"):
            historically_verified_witnesses += 1

    refs_total = entry.get("refs_total")
    refs_verified = entry.get("refs_verified")
    refs_hist = entry.get("refs_historically_verified")
    if _is_int(refs_total) and _is_int(refs_verified) and _is_int(refs_hist):
        if refs_total != len(witness_set):
            problems.error(path, f"{key}: refs_total is {refs_total} but the entry claims "
                                 f"{len(witness_set)} witness reference(s)")
        if refs_verified != verified_witnesses:
            problems.error(path, f"{key}: refs_verified is {refs_verified} but {verified_witnesses} claimed "
                                 "witness reference(s) are byte-verified against the authoritative manifest")
        if refs_hist != historically_verified_witnesses:
            problems.error(path, f"{key}: refs_historically_verified is {refs_hist} but "
                                 f"{historically_verified_witnesses} claimed witness reference(s) verify against "
                                 "the historical manifest")
        if stored == source_review.COLLATED_STATUS and (
            verified_witnesses != len(witness_set) or historically_verified_witnesses != len(witness_set)
        ):
            bad = sorted(work for work in witness_set & set(rv)
                         if isinstance(rv[work], dict)
                         and (rv[work].get("status") != "verified"
                              or rv[work].get("historical_status") not in ("verified", "none")))
            problems.error(path, f"{key}: claims {source_review.COLLATED_STATUS} but reference(s) "
                                 f"{', '.join(bad) or '(missing)'} do not verify against both digest anchors; "
                                 "a drifted or unlisted reference never upgrades a W1 status")


def _harness_normalizer():
    """The classification-identity rule lives with the harness (one definition)."""
    try:
        import collate_corpus  # noqa: PLC0415
    except Exception:  # noqa: BLE001
        return None
    return collate_corpus.normalize_entry


def recompute_reproduction(historical_docs: dict[str, Any], authoritative_docs: dict[str, Any]) -> dict[str, Any]:
    """Independently reconcile the overlay against the historical register.

    The stored `reproduction` block is checked against this, not trusted: document
    identity, per-document differences, and status movement are all re-derived from
    the two document maps with the harness's own classification-normalisation rule.
    """
    normalize = _harness_normalizer()
    compared = sorted(set(historical_docs) & set(authoritative_docs))
    identical = 0
    differing: list[dict[str, Any]] = []
    changed_status = 0
    for key in compared:
        before, after = historical_docs[key], authoritative_docs[key]
        same = (
            normalize(before) == normalize(after)
            if normalize and isinstance(before, dict) and isinstance(after, dict)
            else json.dumps(_classification(before), sort_keys=True, ensure_ascii=False)
            == json.dumps(_classification(after), sort_keys=True, ensure_ascii=False)
        )
        if same:
            identical += 1
            continue
        before_status = (before or {}).get("source_review_status") or _derived_or_empty(before)
        after_status = (after or {}).get("source_review_status") or _derived_or_empty(after)
        if before_status != after_status:
            changed_status += 1
        differing.append({
            "key": key,
            "status_changed": before_status != after_status,
            "historical_source_review_status": before_status,
            "corrected_source_review_status": after_status,
            "historical_flagged_entries": entry_flagged_count(before),
            "corrected_flagged_entries": entry_flagged_count(after),
        })
    return {
        "documents_compared": len(compared),
        "documents_classification_identical": identical,
        "documents_differing": len(differing),
        "documents_with_changed_status": changed_status,
        "flagged_entries": {
            "historical": sum(entry_flagged_count(historical_docs[k]) for k in compared),
            "this_run": sum(entry_flagged_count(authoritative_docs[k]) for k in compared),
        },
        "differences": differing,
        "compared_keys": compared,
        "overlay_only_keys": sorted(set(authoritative_docs) - set(historical_docs)),
        "dropped_keys": sorted(set(historical_docs) - set(authoritative_docs)),
    }


def _derived_or_empty(entry: Any) -> str:
    try:
        return source_review.derive_status(entry)
    except TypeError:
        return ""


def _classification(entry: Any) -> Any:
    """Fallback classification projection (used only when the harness is unreadable)."""
    if not isinstance(entry, dict):
        return entry
    keep = ("witness", "summary", "fields_total")
    payload = {k: entry.get(k) for k in keep}
    payload["flagged"] = [
        {k: flag.get(k) for k in ("path", "class", "sim", "ref", "also_in") if isinstance(flag, dict) and flag.get(k) is not None}
        for flag in (entry.get("flagged") or [])
    ]
    return payload


def validate_historical_register(reg: Any, path: str, record: dict[str, Any],
                                 problems: EvidenceIssues) -> None:
    """The append-only 2026-09-09 register: required shape, dates, per-entry arithmetic."""
    if not isinstance(reg, dict):
        problems.error(path, "the historical register is not a JSON object")
        return
    missing = [key for key in REQUIRED_HISTORICAL_KEYS if key not in reg]
    if missing:
        problems.error(path, "historical register is missing required key(s): " + ", ".join(missing))
    generated = reg.get("generated")
    if not isinstance(generated, str) or not DATE_RE.fullmatch(generated):
        problems.error(path, f"historical register must declare a YYYY-MM-DD generated date, got {generated!r}")
    elif generated != record.get("evidence_date"):
        problems.error(path, f"historical register declares generated={generated!r} but the manifest evidence "
                             f"date is {record.get('evidence_date')!r}; dated evidence files are never re-dated")
    if reg.get("harness") != "collate_v2":
        problems.error(path, f"historical register must identify its harness as 'collate_v2', "
                             f"got {reg.get('harness')!r}")
    docs = documents_of(reg)
    if not docs:
        problems.error(path, "historical register has no documents map")
        return
    for key in sorted(docs):
        validate_entry(key, docs[key], REQUIRED_ENTRY_KEYS_HISTORICAL, False, {}, {},
                       f"{path}.documents.{key}", problems)


def validate_authoritative_register(reg: Any, path: str, record: dict[str, Any],
                                    current_digests: dict[str, str],
                                    historical_digests: dict[str, str],
                                    historical_docs: dict[str, Any],
                                    harness_docs: set[str],
                                    problems: EvidenceIssues) -> dict[str, Any]:
    """The dated correction overlay: every stored figure recomputed from its own parts."""
    if not isinstance(reg, dict):
        problems.error(path, "the authoritative register is not a JSON object")
        return {}
    missing = [key for key in REQUIRED_AUTHORITATIVE_KEYS if key not in reg]
    if missing:
        problems.error(path, "authoritative register is missing required key(s): " + ", ".join(missing))
    docs = documents_of(reg)
    if not docs:
        problems.error(path, "authoritative register has no documents map")
        return {}

    # Fixed identity metadata: which run this is, and where its evidence lives.
    if reg.get("kind") != "w1-correction":
        problems.error(path, f"kind must be 'w1-correction', got {reg.get('kind')!r}")
    if reg.get("harness") != "scripts/collate_corpus.py":
        problems.error(path, f"harness must be 'scripts/collate_corpus.py', got {reg.get('harness')!r}")
    if reg.get("corrects") != record.get("w1_register_path"):
        problems.error(path, f"corrects must name the historical register ({record.get('w1_register_path')!r}), "
                             f"got {reg.get('corrects')!r}")
    if reg.get("refs_manifest") != record.get("correction_refs_manifest_path"):
        problems.error(path, f"refs_manifest must name {record.get('correction_refs_manifest_path')!r}, "
                             f"got {reg.get('refs_manifest')!r}")
    if reg.get("historical_refs_manifest") != HISTORICAL_REFS_MANIFEST:
        problems.error(path, f"historical_refs_manifest must name {HISTORICAL_REFS_MANIFEST!r}, "
                             f"got {reg.get('historical_refs_manifest')!r}")
    generated = reg.get("generated")
    if not isinstance(generated, str) or not DATE_RE.fullmatch(generated):
        problems.error(path, f"authoritative register must declare a YYYY-MM-DD generated date, got {generated!r}")
    elif generated != record.get("correction_evidence_date"):
        problems.error(path, f"authoritative register declares generated={generated!r} but the manifest "
                             f"correction evidence date is {record.get('correction_evidence_date')!r}; dated "
                             "evidence files are never re-dated")
    if reg.get("status_scope") != source_review.STATUS_SCOPE:
        problems.error(path, "the authoritative register must carry the containment/remediation scope sentence")
    extraction = reg.get("reference_extraction")
    if not isinstance(extraction, dict) or extraction.get("rule_id") != EXTRACTION_RULE_ID \
            or extraction.get("generator") != "scripts/collate_refs.py":
        problems.error(path, "reference_extraction must name scripts/collate_refs.py and rule "
                             f"{EXTRACTION_RULE_ID}")
    upstream = reg.get("upstream")
    if not isinstance(upstream, dict) or upstream.get("repo") != UPSTREAM_REPO \
            or upstream.get("revision") != PINNED_UPSTREAM_REVISION:
        problems.error(path, "upstream must pin the reference edition "
                             f"({UPSTREAM_REPO} @ {PINNED_UPSTREAM_REVISION})")
    denominator = str(reg.get("content_denominator") or "")
    for field in (*source_review.CONTENT_SOURCE_FIELDS, *source_review.METADATA_SOURCE_FIELDS):
        if field not in denominator:
            problems.error(path, f"content_denominator must name the {field} field")
    if "not proof of collation" not in denominator:
        problems.error(path, "content_denominator must state that the excluded metadata fields are not proof "
                             "of collation")

    # Generation parameters: the run must be replayable from the evidence itself.
    params = reg.get("generation_parameters")
    if not isinstance(params, dict) or not params:
        problems.error(path, "generation_parameters is missing; a register that cannot be replayed is a "
                             "receipt, not evidence")
    else:
        for field, expected in (
            ("kind", "w1-correction"),
            ("generated", generated),
            ("corrects", record.get("w1_register_path")),
            ("refs_manifest", record.get("correction_refs_manifest_path")),
            ("compare_historical_refs", HISTORICAL_REFS_MANIFEST),
            ("compare_register", record.get("w1_register_path")),
            ("upstream_repo", UPSTREAM_REPO),
            ("upstream_revision", PINNED_UPSTREAM_REVISION),
        ):
            if params.get(field) != expected:
                problems.error(path, f"generation_parameters.{field} must be {expected!r}, got {params.get(field)!r}")
        if params.get("require_verified_refs") is not True:
            problems.error(path, "generation_parameters.require_verified_refs must be true: the overlay was "
                                 "generated on byte-verified references")
        if params.get("refs_dir_provided") is not True:
            problems.error(path, "generation_parameters.refs_dir_provided must be true")
        if not isinstance(params.get("historical_report_flagged"), int):
            problems.error(path, "generation_parameters.historical_report_flagged must record the figure the "
                                 "historical report claimed")
        if not isinstance(params.get("note"), list):
            problems.error(path, "generation_parameters.note must be the verbatim operator notes")

    # Per-document arithmetic and reference provenance.
    for key in sorted(docs):
        validate_entry(key, docs[key], REQUIRED_ENTRY_KEYS_AUTHORITATIVE, True,
                       current_digests, historical_digests, f"{path}.documents.{key}", problems)

    # Top-level reference verification block, recomputed from the per-entry details
    # and the two committed manifests.
    verification = reg.get("reference_verification")
    if not isinstance(verification, dict):
        problems.error(path, "the authoritative register carries no reference_verification block; "
                             "generate it with --refs-manifest so hash verification is recorded, not assumed")
    else:
        verify_path = f"{path}.reference_verification"
        _check_keys(verification, ("manifest", "historical_manifest", "rule", "counts", "historical_counts",
                                   "drifted_refs", "refs"), (), verify_path, problems, "reference_verification")
        if verification.get("manifest") != reg.get("refs_manifest"):
            problems.error(verify_path, "manifest must name the register's own refs_manifest")
        if verification.get("historical_manifest") != reg.get("historical_refs_manifest"):
            problems.error(verify_path, "historical_manifest must name the register's historical_refs_manifest")
        expected_rule = ("statuses are byte-identity of the reference file against a named digest manifest; "
                         "`drift` never rescues a claim and never upgrades one")
        if verification.get("rule") != expected_rule:
            problems.error(verify_path, "rule must state that drift never rescues or upgrades a claim")
        refs = verification.get("refs")
        if not isinstance(refs, dict) or not refs:
            problems.error(verify_path, "refs must list every verified reference work")
            refs = {}
        union = set()
        for key, entry in docs.items():
            if isinstance(entry, dict):
                union |= set(entry.get("reference_verification") or {})
        if set(refs) != union:
            problems.error(verify_path, "refs must cover exactly the works the document entries verify "
                                        f"(missing: {sorted(union - set(refs)) or 'none'}, "
                                        f"extra: {sorted(set(refs) - union) or 'none'})")
        if set(refs) != set(current_digests):
            problems.error(verify_path, "refs must cover exactly the works in the authoritative digest manifest "
                                        f"(missing: {sorted(set(current_digests) - set(refs)) or 'none'}, "
                                        f"extra: {sorted(set(refs) - set(current_digests)) or 'none'})")
        status_counts: Counter[str] = Counter()
        historical_status_counts: Counter[str] = Counter()
        for work in sorted(refs):
            detail = refs[work]
            detail_path = f"{verify_path}.refs.{work}"
            if not isinstance(detail, dict):
                problems.error(detail_path, "must be an object")
                continue
            _check_keys(detail, ("sha256", "manifest", "status", "historical_manifest", "historical_status"),
                        (), detail_path, problems, "reference detail")
            if detail.get("manifest") != reg.get("refs_manifest"):
                problems.error(detail_path, "manifest must name the authoritative digest manifest")
            if detail.get("historical_manifest") != reg.get("historical_refs_manifest"):
                problems.error(detail_path, "historical_manifest must name the historical digest manifest")
            sha = detail.get("sha256")
            expected = current_digests.get(work)
            if not DIGEST_RE.match(str(sha or "")) or expected is None or sha != expected:
                problems.error(detail_path, f"recorded digest does not match the committed manifest digest for {work}")
            if detail.get("status") != "verified":
                problems.error(detail_path, f"status must be 'verified' (digest matches), got {detail.get('status')!r}")
            hist_expected = historical_digests.get(work)
            expected_hist = "unlisted" if hist_expected is None else ("verified" if hist_expected == sha else "drift")
            if detail.get("historical_status") != expected_hist:
                problems.error(detail_path, f"historical_status is {detail.get('historical_status')!r} but the "
                                            f"committed historical manifest says {expected_hist!r}")
            status_counts[str(detail.get("status"))] += 1
            historical_status_counts[str(detail.get("historical_status"))] += 1
        for label, counts, stored in (
            ("counts", status_counts, verification.get("counts")),
            ("historical_counts", historical_status_counts, verification.get("historical_counts")),
        ):
            if not isinstance(stored, dict):
                problems.error(verify_path, f"{label} must be an object")
                continue
            for state in ("verified", "drift", "unlisted", "none"):
                if stored.get(state) != counts.get(state, 0):
                    problems.error(verify_path, f"{label}.{state} is {stored.get(state)} but the per-reference "
                                                f"details count {counts.get(state, 0)}")
        drifted = sorted(work for work, detail in refs.items()
                         if isinstance(detail, dict) and "drift" in (detail.get("status"), detail.get("historical_status")))
        if verification.get("drifted_refs") != drifted:
            problems.error(verify_path, f"drifted_refs is {verification.get('drifted_refs')!r} but the per-reference "
                                        f"details name {drifted!r}")

    # Reproduction: recompute the whole historical comparison, do not trust the block.
    reproduction = reg.get("reproduction")
    if not isinstance(reproduction, dict):
        problems.error(path, "the correction register must record a reproduction block comparing it with the "
                             "historical register (collate_corpus.py --compare-register)")
    else:
        repro_path = f"{path}.reproduction"
        if reproduction.get("compared_register") != record.get("w1_register_path"):
            problems.error(repro_path, f"compared_register must name the historical register "
                                       f"({record.get('w1_register_path')!r})")
        recomputed = recompute_reproduction(historical_docs, docs)
        for field in ("documents_compared", "documents_classification_identical",
                      "documents_differing", "documents_with_changed_status"):
            stored_value = reproduction.get(field)
            if stored_value != recomputed[field]:
                problems.error(repro_path, f"{field} is {stored_value!r} but recomputing the comparison of the "
                                           f"two registers gives {recomputed[field]!r}; the reproduction block "
                                           "must describe the actual records")
        stored_flagged = reproduction.get("flagged_entries")
        if not isinstance(stored_flagged, dict) or stored_flagged != recomputed["flagged_entries"]:
            problems.error(repro_path, f"flagged_entries is {stored_flagged!r} but recomputing the compared "
                                       f"registers gives {recomputed['flagged_entries']!r}")
        stored_diffs = reproduction.get("differences")
        if not isinstance(stored_diffs, list):
            problems.error(repro_path, "differences must be an array")
        else:
            by_key = {d.get("key"): d for d in stored_diffs if isinstance(d, dict)}
            if sorted(by_key) != [d["key"] for d in recomputed["differences"]]:
                problems.error(repro_path, f"differences list covers {sorted(by_key)} but the records differ for "
                                           f"{[d['key'] for d in recomputed['differences']]}")
            for diff in recomputed["differences"]:
                stored_diff = by_key.get(diff["key"])
                if not isinstance(stored_diff, dict):
                    continue
                for field in ("status_changed", "historical_source_review_status",
                              "corrected_source_review_status", "historical_flagged_entries",
                              "corrected_flagged_entries"):
                    if stored_diff.get(field) != diff[field]:
                        problems.error(repro_path, f"differences[{diff['key']}].{field} is "
                                                   f"{stored_diff.get(field)!r} but the records give {diff[field]!r}")
        if reproduction.get("operator_notes") != (params.get("note") if isinstance(params, dict) else None):
            problems.error(repro_path, "operator_notes must be the verbatim generation_parameters notes")
        if isinstance(params, dict) and isinstance(params.get("historical_report_flagged"), int):
            if reproduction.get("historical_report_flagged_total") != params["historical_report_flagged"]:
                problems.error(repro_path, "historical_report_flagged_total must equal "
                                           "generation_parameters.historical_report_flagged")
            historical_flagged = recomputed["flagged_entries"]["historical"]
            reproduced = params["historical_report_flagged"] == historical_flagged
            if reproduction.get("historical_report_flagged_reproduced") is not reproduced:
                problems.error(repro_path, f"historical_report_flagged_reproduced is "
                                           f"{reproduction.get('historical_report_flagged_reproduced')!r} but the "
                                           f"claim {params['historical_report_flagged']} vs the register total "
                                           f"{historical_flagged} says {reproduced!r}")

    # Overlay scope: documents the overlay adds must be named in the correction
    # report, and the overlay must not silently drop historical documents.
    recomputed = recompute_reproduction(historical_docs, docs)
    for key in recomputed["dropped_keys"]:
        problems.error(path, f"the authoritative register drops historical document '{key}' without record; "
                             "the overlay only adds evidence, it never deletes it")

    # Aggregate block: every figure recomputed from the document entries.
    aggregate = reg.get("aggregate")
    if not isinstance(aggregate, dict):
        problems.error(path, "the authoritative register carries no aggregate block")
    else:
        agg_path = f"{path}.aggregate"
        derived_counts = source_review.status_counts(_derived_or_empty(e) for e in docs.values())
        recomputed = {
            "documents": len(docs),
            "flagged_entries": sum(entry_flagged_count(e) for e in docs.values()),
            "fields_total": sum(int(e.get("fields_total") or 0) for e in docs.values() if _is_int(e.get("fields_total"))),
            "content_fields_total": sum(int(e.get("content_fields_total") or 0) for e in docs.values()
                                        if _is_int(e.get("content_fields_total"))),
            "content_fields_collated": sum(int(e.get("content_fields_collated") or 0) for e in docs.values()
                                           if _is_int(e.get("content_fields_collated"))),
            "metadata_fields_total": sum(int(e.get("metadata_fields_total") or 0) for e in docs.values()
                                         if _is_int(e.get("metadata_fields_total"))),
            "class_totals": source_review.summary_flags(docs),
            "source_review_status_counts": derived_counts,
        }
        for field, value in recomputed.items():
            if field not in aggregate:
                problems.error(agg_path, f"aggregate is missing {field}")
                continue
            if aggregate[field] != value:
                problems.error(agg_path, f"aggregate.{field} is {aggregate[field]!r} but recomputing its own "
                                         f"documents gives {value!r}")
        unaddressed = aggregate.get("documents_without_evidence")
        if not isinstance(unaddressed, list) or unaddressed:
            problems.error(agg_path, f"documents_without_evidence must be [], got {unaddressed!r}")
        else:
            if harness_docs:
                missing_from_evidence = sorted(harness_docs - set(docs))
                if missing_from_evidence:
                    problems.error(agg_path, "harness documents without an evidence entry: "
                                             + ", ".join(missing_from_evidence))
        drifted_docs = sorted(
            key for key, entry in docs.items()
            if isinstance(entry, dict)
            and _is_int(entry.get("refs_total")) and _is_int(entry.get("refs_verified"))
            and _is_int(entry.get("refs_historically_verified"))
            and (entry["refs_total"] > entry["refs_verified"]
                 or entry["refs_verified"] > entry["refs_historically_verified"])
        )
        if aggregate.get("documents_with_drifted_references") != drifted_docs:
            problems.error(agg_path, f"documents_with_drifted_references is "
                                     f"{aggregate.get('documents_with_drifted_references')!r} but the reference "
                                     f"verification records give {drifted_docs!r}")
    return docs


def canonical_partitions(root: Path, documents: dict[str, Any], path: str,
                         problems: EvidenceIssues) -> dict[str, dict[str, Any]]:
    """Re-use the harness's pure selector, including CJK and speaker/author exclusions.

    The register stores only flagged paths; the unflagged complement comes from
    the corpus, never from a declared denominator. Do not rewrite dated evidence.
    """
    from collate_corpus import iter_fields

    canonical = {}
    for key, entry in documents.items():
        if not isinstance(entry, dict):
            continue
        try:
            data = json.loads((root / "data" / "corpus" / f"{key}.json").read_text(encoding="utf-8"))
        except (OSError, ValueError) as exc:
            problems.error(path, f"{key}: cannot derive source-field paths: {exc}")
            continue
        paths = dict(iter_fields(data))
        metadata = {p for p in paths if source_review.is_metadata_field(p)}
        content = set(paths) - metadata
        flags = [f for f in entry.get("flagged", []) if isinstance(f, dict)]
        flagged_paths = [f.get("path") for f in flags]
        if any(p not in paths for p in flagged_paths) or len(set(flagged_paths)) != len(flagged_paths):
            problems.error(path, f"{key}: content/metadata partition mismatch: flagged source-field paths "
                                 "must be unique members of the actual corpus field-path set")
        totals = {"fields_total": len(paths), "content_fields_total": len(content),
                  "metadata_fields_total": len(metadata)}
        for label, selected in (("content", content), ("metadata", metadata)):
            summary = entry.get(f"{label}_summary") or {}
            for cls, count in summary.items():
                if cls not in NEVER_FLAGGED_CLASSES:
                    actual = sum(f.get("path") in selected and f.get("class") == cls for f in flags)
                    if count != actual:
                        problems.error(path, f"{key}: content/metadata partition mismatch: {label}_summary "
                                             f"{cls} is {count}, actual field paths give {actual}")
        totals["content_fields_collated"] = len(content) - sum(
            f.get("path") in content and f.get("class") not in source_review.COLLATED_CLASSES
            for f in flags)
        for field, actual in totals.items():
            if entry.get(field) != actual:
                problems.error(path, f"{key}: content/metadata partition mismatch: {field} is "
                                     f"{entry.get(field)!r}, canonical corpus field paths give {actual}")
        canonical[key] = {**entry, **totals}
    return canonical


def validate_correction_report(text: str, path: str, record: dict[str, Any],
                               authoritative_docs: dict[str, Any],
                               historical_docs: dict[str, Any],
                               superseded_claim: int | None,
                               current_digests: dict[str, str],
                               historical_digests: dict[str, str],
                               register_sha: str | None,
                               manifest_sha: str | None,
                               problems: EvidenceIssues) -> None:
    """The correction report's numeric claims, checked against the recomputation.

    The report is dated evidence: its prose must state the same figures the register
    supports. A claim that disagrees with (or is absent from) the report fails the
    run — e.g. the 630 flagged-entry total cannot become 999 without failing here.
    """
    if not isinstance(text, str) or not text:
        problems.error(path, "correction report is missing or unreadable")
        return
    # Normalise hard line breaks so table/figure checks survive wrapped prose.
    prose = re.sub(r"\s*\n\s*", " ", text)

    auth_docs = authoritative_docs
    recomputed_flagged = sum(entry_flagged_count(e) for e in auth_docs.values())
    recomputed_docs = len(auth_docs)
    hist_flagged = sum(entry_flagged_count(e) for e in historical_docs.values())
    compared = sorted(set(historical_docs) & set(auth_docs))
    this_run_compared = sum(entry_flagged_count(auth_docs[k]) for k in compared)
    derived_counts = source_review.status_counts(_derived_or_empty(e) for e in auth_docs.values())

    def expect(pattern: str, label: str, expected: Any) -> None:
        match = re.search(pattern, prose)
        if not match:
            problems.error(path, f"correction report does not state {label}")
            return
        value = match.group(1)
        if expected is None or value == str(expected):
            return
        problems.error(path, f"correction report states {label} as {value!r} but the evidence supports "
                             f"{expected!r}")

    # §0: the two records and what each covers.
    expect(r"COLLATION_REGISTER_2026-09-09\.json` \((\d+) documents, (\d+) flagged entries\)",
           "the historical record's document/flagged coverage",
           None)
    hist_match = re.search(r"COLLATION_REGISTER_2026-09-09\.json` \((\d+) documents, (\d+) flagged entries\)", prose)
    if hist_match and (int(hist_match.group(1)), int(hist_match.group(2))) != (len(historical_docs), hist_flagged):
        problems.error(path, f"correction report covers the historical record as "
                             f"{hist_match.group(1)}/{hist_match.group(2)} documents/flags but the register holds "
                             f"{len(historical_docs)}/{hist_flagged}")
    auth_match = re.search(r"COLLATION_REGISTER_2026-09-10_CORRECTION\.json` \((\d+) documents, (\d+) flagged entries\)", prose)
    if auth_match and (int(auth_match.group(1)), int(auth_match.group(2))) != (recomputed_docs, recomputed_flagged):
        problems.error(path, f"correction report covers the authoritative record as "
                             f"{auth_match.group(1)}/{auth_match.group(2)} documents/flags but the register holds "
                             f"{recomputed_docs}/{recomputed_flagged}")
    if not auth_match:
        problems.error(path, "correction report does not state the authoritative record's document/flagged coverage")
    expect(r"each of the (\d+) current manifest items", "the current manifest item count", recomputed_docs)

    # §2: the 637 -> 622 -> 623 -> 630 reconciliation table.
    table_rows = re.findall(r"\|\s*\**(\d+)\**\s*\|\s*\**(\d+)\**\s*documents", prose)
    if not table_rows:
        problems.error(path, "correction report does not carry the flagged-entry reconciliation table")
    else:
        known = {
            (superseded_claim, len(historical_docs)): "the superseded 2026-09-09 report claim",
            (hist_flagged, len(historical_docs)): "the historical register total",
            (this_run_compared, len(historical_docs)): "the 2026-09-10 reproduction over the same 34 documents",
            (recomputed_flagged, recomputed_docs): "the authoritative register total",
        }
        seen: set[int] = set()
        for figure_raw, docs_raw in table_rows:
            figure, docs_count = int(figure_raw), int(docs_raw)
            if (figure, docs_count) not in known:
                problems.error(path, f"correction report reconciliation table row {figure}/{docs_count} documents "
                                     "does not match any figure the evidence supports "
                                     f"({sorted(known)})")
                continue
            seen.add(figure)
        for figure, label in sorted(known):
            if figure is None:
                continue
            if figure not in seen:
                problems.error(path, f"correction report reconciliation table is missing the row for {label} "
                                     f"({figure})")
        superseded_row = re.search(r"\|\s*\**" + str(superseded_claim or 0) + r"\**\s*\|[^|]*\|[^|]*\|([^|]*)\|", prose)
        if superseded_row and "superseded" not in superseded_row.group(1).lower():
            problems.error(path, "correction report must label the superseded figure as superseded in its "
                                 "reconciliation row")

    # §3: digest-manifest coverage and the verification table.
    expect(r"Verification results for the (\d+) works the collator actually reads",
           "the work count the collator reads", len(current_digests))
    expect(r"Across all (\d+) manifest works", "the historical manifest work count", len(historical_digests))
    current_row = re.search(
        r"COLLATION_W1_2026-09-10_refs_manifest\.txt` \([^)]*\)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|", prose)
    historical_row = re.search(
        r"COLLATION_W1_2026-09-09_refs_manifest\.txt` \([^)]*\)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|", prose)
    if not current_row:
        problems.error(path, "correction report does not state verification against the authoritative manifest")
    else:
        got = tuple(int(g) for g in current_row.groups())
        want = (sum(1 for d in current_digests.values() if d), 0, 0)
        if got != want:
            problems.error(path, f"correction report states {got[0]}/{got[1]}/{got[2]} verified/drift/unlisted "
                                 f"against the authoritative manifest but the committed digests say {want[0]}/"
                                 f"{want[1]}/{want[2]}")
    if not historical_row:
        problems.error(path, "correction report does not state verification against the historical manifest")
    else:
        got = tuple(int(g) for g in historical_row.groups())
        verified = sum(1 for work, sha in current_digests.items()
                       if historical_digests.get(work) == sha)
        drift = len(current_digests) - verified
        if got != (verified, drift, 0):
            problems.error(path, f"correction report states {got[0]}/{got[1]}/{got[2]} verified/drift/unlisted "
                                 f"against the historical manifest but the committed digests say "
                                 f"{verified}/{drift}/0")
    drifted = sorted(work for work, sha in current_digests.items()
                     if work in historical_digests and historical_digests[work] != sha)
    for work in drifted:
        if work not in prose:
            problems.error(path, f"correction report does not name the drifted reference {work}")

    # §4: the overlay-only document (e.g. shitou_sandokai) and its field counts.
    overlay_only = sorted(set(auth_docs) - set(historical_docs))
    for key in overlay_only:
        if key not in prose:
            problems.error(path, f"correction report does not document the overlay-only document {key}")
        entry = auth_docs.get(key)
        if isinstance(entry, dict) and _is_int(entry.get("content_fields_total")):
            fields_match = re.search(r"Content fields: (\d+) measured, (\d+) collated", prose)
            if fields_match and (int(fields_match.group(1)), int(fields_match.group(2))) != (
                entry["content_fields_total"], entry["content_fields_collated"]
            ):
                problems.error(path, f"correction report states Content fields {fields_match.group(1)}/"
                                     f"{fields_match.group(2)} but the {key} entry holds "
                                     f"{entry['content_fields_total']}/{entry['content_fields_collated']}")
            refs_match = re.search(r"refs_verified = (\d+) / refs_total = (\d+)", prose)
            if refs_match and (int(refs_match.group(1)), int(refs_match.group(2))) != (
                entry.get("refs_verified"), entry.get("refs_total")
            ):
                problems.error(path, f"correction report states refs_verified/refs_total "
                                     f"{refs_match.group(1)}/{refs_match.group(2)} but the {key} entry holds "
                                     f"{entry.get('refs_verified')}/{entry.get('refs_total')}")

    # §5: labeled aggregate claims, not historical figures or §4 document totals.
    section = re.search(r"^## 5\. Recomputed status counts[^\n]*\n(.*?)(?=^## |\Z)",
                        text, re.M | re.S)
    aggregate_prose = re.sub(r"\s+", " ", section.group(1)).replace("**", "") if section else ""
    totals = {
        "total fields": sum(e.get("fields_total", 0) for e in auth_docs.values()),
        "content fields": sum(e.get("content_fields_total", 0) for e in auth_docs.values()),
        "collated content fields": sum(e.get("content_fields_collated", 0) for e in auth_docs.values()),
        "metadata fields": sum(e.get("metadata_fields_total", 0) for e in auth_docs.values()),
    }
    for label, expected in totals.items():
        # Accept labeled prose or table rows; absent optional totals make no claim.
        patterns = [r"\b([\d,]+)\s+" + re.escape(label) + r"\b",
                    r"\b" + re.escape(label) + r"\s*[:=|]\s*([\d,]+)"]
        if label == "content fields":
            patterns[0] = r"(?<!collated )\b([\d,]+)\s+content fields\b"
        if label == "total fields":
            patterns.append(r"\b([\d,]+)\s+fields in total\b")
        claims = [m.group(1) for pattern in patterns for m in re.finditer(pattern, aggregate_prose, re.I)]
        if label == "metadata fields" and not claims:
            problems.error(path, "correction report does not state metadata fields in §5")
        for claim in claims:
            if int(claim.replace(",", "")) != expected:
                problems.error(path, f"correction report states {label} as {claim!r} but canonical "
                                     f"corpus field paths and evidence support {expected}")
    metadata_failed = sum(source_review.is_metadata_field(f.get("path"))
                          and f.get("class") not in source_review.COLLATED_CLASSES
                          for e in auth_docs.values() for f in e.get("flagged", []) if isinstance(f, dict))
    expect(r"metadata fields, (\d+) of them non-collating", "non-collating metadata fields", metadata_failed)
    expect(r"Derived from the merged evidence for all (\d+) manifest items",
           "the status section document count", recomputed_docs)

    # §5: the recomputed status counts.
    for status in source_review.VALID_SOURCE_REVIEW_STATUSES:
        row = re.search(r"`" + re.escape(status) + r"`\s*\|\s*(\d+)\s*\|", prose)
        if not row:
            problems.error(path, f"correction report does not state the {status} count")
        elif int(row.group(1)) != derived_counts[status]:
            problems.error(path, f"correction report states {status} = {row.group(1)} but the evidence derives "
                                 f"{derived_counts[status]}")

    # §3/§5: the reproduction figures quoted in prose.
    identity_pattern = r"documents_classification_identical = (\d+)`? of (\d+)"
    expect(identity_pattern, "the classification-identity figure", None)
    identity = re.search(identity_pattern, prose)
    if identity:
        recomputed = recompute_reproduction(historical_docs, auth_docs)
        if (int(identity.group(1)), int(identity.group(2))) != (
            recomputed["documents_classification_identical"], recomputed["documents_compared"]
        ):
            problems.error(path, f"correction report states {identity.group(1)} of {identity.group(2)} "
                                 "classification-identical documents but the registers give "
                                 f"{recomputed['documents_classification_identical']} of "
                                 f"{recomputed['documents_compared']}")
    expect(r"documents_with_changed_status\s*=?\s*(\d+)", "the changed-status figure",
           recompute_reproduction(historical_docs, auth_docs)["documents_with_changed_status"])

    # §7: the cited digests must be the committed files' actual digests.
    if register_sha and register_sha not in prose:
        problems.error(path, "correction report does not cite the authoritative register's committed sha256 "
                             "(or the cited digest no longer matches the file)")
    if manifest_sha and manifest_sha not in prose:
        problems.error(path, "correction report does not cite the authoritative refs manifest's committed sha256 "
                             "(or the cited digest no longer matches the file)")


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
    if not harness_docs:
        problems.error(path, "scripts/collate_corpus.py exposes no readable DOCS mapping; a manifest item "
                             "without a harness mapping is a containment gap, not evidence")

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
        problems.error(path, f"non_approval_statement must be exactly {source_review.NON_APPROVAL_STATEMENT!r}, got {non_approval!r}")
    metadata_note = str(record.get("metadata_field_note") or "").lower()
    if "title_zh" not in metadata_note or "name_zh" not in metadata_note or "not proof" not in metadata_note:
        problems.error(
            path,
            "metadata_field_note must say that title/name metadata (title_zh, name_zh) is excluded, so "
            "collated_to_claimed_witness is not proof that the excluded metadata fields were collated",
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

    # Digest manifests: structure, uniqueness, and the provenance every digest claim rests on.
    current_digests = parse_digest_manifest(
        loaded["records"].get("correction_refs_manifest_path", {}).get("text"),
        str(record.get("correction_refs_manifest_path") or "correction_refs_manifest_path"), problems)
    historical_digests = parse_digest_manifest(
        loaded["records"].get("historical_refs_manifest_path", {}).get("text"),
        HISTORICAL_REFS_MANIFEST, problems)

    validate_historical_register(historical, str(record.get("w1_register_path") or "w1_register_path"),
                                 record, problems)
    validate_authoritative_register(authoritative, str(record.get("correction_register_path") or
                                                       "correction_register_path"),
                                    record, current_digests, historical_digests,
                                    historical_docs, set(harness_docs or ()), problems)
    aggregates["class_totals"] = source_review.summary_flags(authoritative_docs)

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
        # The report's own title carries its evidence date; a re-dated title is a
        # re-dated record.
        first_date = DATE_RE.search(text)
        if first_date and first_date.group(1) != declared:
            problems.error(path, f"{label} title carries {first_date.group(1)} but the declared evidence "
                                 f"date is {declared!r}; dated evidence files are never re-dated in place")
    report_claim = re.search(r"(\d[\d,]*)\s+entries", report_text)
    superseded_claim = None
    if report_claim:
        superseded_claim = int(report_claim.group(1).replace(",", ""))
        aggregates["superseded"] = {
            "report_flagged_total": superseded_claim,
            "register_flagged_total": aggregates["historical_flagged_total"],
            "reproduced_flagged_total": None,
            "status": "current" if superseded_claim == aggregates["historical_flagged_total"] else "superseded",
        }
        if superseded_claim != aggregates["historical_flagged_total"]:
            if not isinstance(record.get("superseded_report_flagged_total"), int) or (
                record["superseded_report_flagged_total"] != superseded_claim
            ):
                problems.error(
                    path,
                    f"the 2026-09-09 report claims {superseded_claim} flagged entries while its register sums to "
                    f"{aggregates['historical_flagged_total']}; declare superseded_report_flagged_total "
                    f"= {superseded_claim} and keep the report unmodified",
                )
            if "superseded" not in correction_text.lower():
                problems.error(f"{path}.correction_report_path",
                               "the correction report must label the superseded report figure as superseded")

    canonical_docs = canonical_partitions(root, authoritative_docs,
                                          str(record.get("authoritative_register_path")), problems)
    stored_aggregate = authoritative.get("aggregate", {}) if isinstance(authoritative, dict) else {}
    for field in ("fields_total", "content_fields_total", "metadata_fields_total", "content_fields_collated"):
        actual = sum(e[field] for e in canonical_docs.values())
        if stored_aggregate.get(field) != actual:
            problems.error(path, f"content/metadata partition mismatch: aggregate {field} is "
                                 f"{stored_aggregate.get(field)!r}, canonical corpus field paths give {actual}")

    merged = dict(historical_docs)
    merged.update(authoritative_docs)
    merged.update(canonical_docs)
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
        entry = canonical_docs.get(key) or documents.get(key) or merged.get(key)
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
        aggregates["superseded"]["reproduced_flagged_total"] = (reproduction.get("flagged_entries") or {}).get("this_run")

    register_sha = None
    manifest_sha = None
    for key, label in (("authoritative_register_path", "register"), ("correction_refs_manifest_path", "manifest")):
        value = record.get(key)
        target = root / value if isinstance(value, str) else None
        if target and target.is_file():
            import hashlib
            sha = hashlib.sha256(target.read_bytes()).hexdigest()
            if label == "register":
                register_sha = sha
            else:
                manifest_sha = sha

    if correction_text or isinstance(authoritative, dict):
        validate_correction_report(
            correction_text,
            str(record.get("correction_report_path") or "correction_report_path"),
            record, {**authoritative_docs, **canonical_docs}, historical_docs, superseded_claim,
            current_digests, historical_digests, register_sha, manifest_sha, problems,
        )

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
