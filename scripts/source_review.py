#!/usr/bin/env python3
"""Shared W1 source-review semantics for TranslateChan.

One module owns the contract so the validator, the generated metrics, the collation
harness, and the tests can never disagree about what a W1 source-review status means.
The browser runtime mirrors the two rules this module publishes
(``is_completion_source_review_compatible`` and the status vocabulary) in ``app.js``;
the smoke test asserts the JS copy against the generated
``corpus.source_review.completion_compatibility`` table, which is this module's output.

Contract
--------
* Status vocabulary: ``collated_to_claimed_witness`` / ``partial_or_failed_w1_collation``
  / ``witness_unavailable``.
* One completion-compatibility rule: ``complete_selected_witness`` is representable only
  when the item's W1 status is ``collated_to_claimed_witness``.
* A status is derived from collation evidence. It is never inferred from the *absence* of
  a register entry; a manifest item with no evidence record is a validation failure.
* Status semantics: ``Containment/remediation state, not a rights decision.``
* Evidence scope: title/name metadata is measured separately and excluded from the
  content denominator, so ``collated_to_claimed_witness`` never claims that metadata was
  collated, and it never approves reuse.
"""

from __future__ import annotations

from typing import Any, Iterable

VALID_COMPLETION_STATUSES = (
    "complete_selected_witness",
    "partial_selected_witness",
    "excerpt_seed",
)
VALID_SOURCE_REVIEW_STATUSES = (
    "collated_to_claimed_witness",
    "partial_or_failed_w1_collation",
    "witness_unavailable",
)

COLLATED_STATUS = "collated_to_claimed_witness"
PARTIAL_STATUS = "partial_or_failed_w1_collation"
UNAVAILABLE_STATUS = "witness_unavailable"

#: The manifest-level declaration of what a source-review status is and is not.
STATUS_SCOPE = "Containment/remediation state, not a rights decision."

#: Reader disclosure line that keeps the rights question out of the collation record.
NON_APPROVAL_STATEMENT = "Source collation does not approve reuse."

#: Source fields that are project metadata rather than witness content. The harness
#: classifies them (a composite title is itself a finding) but they are excluded from
#: the content denominator.
METADATA_SOURCE_FIELDS = ("title_zh", "name_zh")

#: Source-content fields the W1 denominator measures.
CONTENT_SOURCE_FIELDS = ("zh", "verse_zh", "commentary_zh", "pointer_zh")

#: Harness classes that mean "this content field is the claimed witness's text".
COLLATED_CLASSES = ("EXACT", "REWORDED")

#: The complete collation-class vocabulary, in the fixed order the harness writes summaries
#: with (`scripts/collate_corpus.py`'s SUMMARY_ORDER is this tuple). It is the classification
#: contract, not a list of suggestions: `EXACT`/`REWORDED` are the collated classes,
#: `TITLE_COMPOSITE` is the composite-title finding, `EMPTY` is a field with no source text,
#: and the rest are the non-collating finding grades. A record carrying a class outside this
#: vocabulary describes a finding the harness cannot produce, so it cannot be validated — and
#: an unknown label must never be silently counted as if it were one of these.
COLLATION_CLASSES = (
    "EXACT",
    "REWORDED",
    "MINOR",
    "DIVERGENT",
    "NOT_FOUND",
    "TITLE_COMPOSITE",
    "SHORT_UNMATCHED",
    "WITNESS_UNAVAILABLE",
    "EMPTY",
)

#: Five ledgers the public interface must keep visibly separate. `app.js` labels each
#: rendered disclosure with `data-ledger`; the smoke test requires all five.
DISCLOSURE_LEDGERS = (
    ("source_collation", "Source collation (W1)"),
    ("represented_units", "Represented units"),
    ("translation_edition_verification", "Translation & edition verification"),
    ("canonical_locator", "Canonical source locator"),
    ("rights_review", "Rights review"),
)
DISCLOSURE_LEDGER_KEYS = tuple(key for key, _ in DISCLOSURE_LEDGERS)
DISCLOSURE_LEDGER_LABELS = dict(DISCLOSURE_LEDGERS)

#: Rendered under the five blocks: the ledgers answer different questions and an answer to
#: one must never be read as an answer to another.
LEDGER_SEPARATION_NOTE = "Separate ledgers: none of these answers implies another."

#: Status labels shown to a reader. The exact machine status is always rendered next to
#: the label so a paraphrase can never quietly upgrade a claim.
SOURCE_REVIEW_STATUS_LABELS = {
    COLLATED_STATUS: "Collated to claimed witness",
    PARTIAL_STATUS: "Partial or failed W1 collation",
    UNAVAILABLE_STATUS: "Witness unavailable — not collated",
}


def is_completion_source_review_compatible(completion_status: Any, source_review_status: Any) -> bool:
    """True when an editorial completion status may be represented publicly.

    ``complete_selected_witness`` requires ``collated_to_claimed_witness``; every other
    completion status is compatible with any valid source-review status. This is the
    single definition of the rule; ``app.js`` mirrors it and the smoke test keeps the
    mirror honest against the generated compatibility table.
    """
    if completion_status != "complete_selected_witness":
        return True
    return source_review_status == COLLATED_STATUS


def completion_compatibility_matrix() -> dict[str, dict[str, bool]]:
    """Deterministic rule table: completion status -> source-review status -> allowed."""
    return {
        completion: {
            status: is_completion_source_review_compatible(completion, status)
            for status in VALID_SOURCE_REVIEW_STATUSES
        }
        for completion in VALID_COMPLETION_STATUSES
    }


def effective_completion_status(completion_status: Any, source_review_status: Any) -> str:
    """The completion status a work may actually be represented with.

    An incompatible ``complete_selected_witness`` claim degrades to
    ``partial_selected_witness`` everywhere (metrics, shelf grouping, complete marks,
    Reader status line) while the validator still rejects the underlying data.
    """
    if completion_status == "complete_selected_witness" and not is_completion_source_review_compatible(
        completion_status, source_review_status
    ):
        return "partial_selected_witness"
    return completion_status if isinstance(completion_status, str) else "excerpt_seed"


def is_metadata_field(path: Any) -> bool:
    """True when a register field path points at title/name metadata, not content."""
    leaf = str(path).rsplit(".", 1)[-1].split("[", 1)[0]
    return leaf in METADATA_SOURCE_FIELDS


def content_flagged_entries(entry: dict[str, Any]) -> list[dict[str, Any]]:
    """Flagged register entries that concern source content (metadata excluded)."""
    return [
        item
        for item in (entry.get("flagged") or [])
        if isinstance(item, dict) and not is_metadata_field(item.get("path", ""))
    ]


def derive_status(entry: dict[str, Any]) -> str:
    """Derive a W1 status from one register document entry.

    1. no claimed witness text in the reference set -> ``witness_unavailable``;
    2. claimed witness present and no uncollated source-content field
       -> ``collated_to_claimed_witness``;
    3. otherwise -> ``partial_or_failed_w1_collation``.

    A document absent from the evidence has *no* status: callers must treat that as a
    validation failure rather than defaulting it to anything.
    """
    if not isinstance(entry, dict):
        raise TypeError("register document entry must be an object")
    if not (entry.get("witness") or []):
        return UNAVAILABLE_STATUS
    return COLLATED_STATUS if not content_flagged_entries(entry) else PARTIAL_STATUS


def status_counts(statuses: Iterable[Any]) -> dict[str, int]:
    """Deterministic, always-complete status count map (absent statuses are zero)."""
    counts = {status: 0 for status in VALID_SOURCE_REVIEW_STATUSES}
    for status in statuses:
        if status in counts:
            counts[status] += 1
    return counts


def is_valid_source_review_status(status: Any) -> bool:
    return status in VALID_SOURCE_REVIEW_STATUSES


def flagged_total(documents: Any) -> int:
    """Flagged-entry arithmetic computed from register evidence (never hand-entered)."""
    if not isinstance(documents, dict):
        return 0
    return sum(
        len(entry.get("flagged") or [])
        for entry in documents.values()
        if isinstance(entry, dict)
    )


def summary_flags(documents: Any) -> dict[str, int]:
    """Aggregate harness class counts across a register's document entries."""
    totals: dict[str, int] = {}
    if not isinstance(documents, dict):
        return totals
    for entry in documents.values():
        if not isinstance(entry, dict):
            continue
        for cls, count in (entry.get("summary") or {}).items():
            if isinstance(count, int):
                totals[cls] = totals.get(cls, 0) + count
    return {key: totals[key] for key in sorted(totals)}


def manifest_statuses(manifest: Any) -> dict[str, str]:
    """`{corpus key: source_review_status}` from a corpus manifest (may be empty)."""
    items = manifest.get("items") if isinstance(manifest, dict) else None
    out: dict[str, str] = {}
    for item in items or []:
        if isinstance(item, dict) and isinstance(item.get("key"), str):
            status = item.get("source_review_status")
            out[item["key"]] = status if isinstance(status, str) else ""
    return out


def merge_registers(*registers: dict[str, Any] | None) -> dict[str, dict[str, Any]]:
    """Merge document maps from dated evidence records, oldest first.

    Later records only *add* documents; a later record never silently replaces an
    earlier one. Overlap must be reconciled by the caller (the validator requires an
    identical derived status for any key present in more than one record), so this
    returns the first record's entry for a shared key and exposes the rest.
    """
    merged: dict[str, dict[str, Any]] = {}
    for register in registers:
        documents = register.get("documents") if isinstance(register, dict) else None
        if not isinstance(documents, dict):
            continue
        for key, entry in documents.items():
            merged.setdefault(key, entry)
    return merged


def registers_documents(register: Any) -> dict[str, Any]:
    documents = register.get("documents") if isinstance(register, dict) else None
    return documents if isinstance(documents, dict) else {}


def derived_statuses(documents: dict[str, Any]) -> dict[str, str]:
    out: dict[str, str] = {}
    for key, entry in documents.items():
        try:
            out[key] = derive_status(entry)
        except TypeError:
            out[key] = ""
    return out
