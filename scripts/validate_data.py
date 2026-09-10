#!/usr/bin/env python3
"""Validate TranslateChan source data and keep its deterministic metrics current.

This project intentionally uses several corpus shapes (cases, sections, dialogues,
stanzas, chapters, five ranks, and sample records).  A generic JSON Schema alone
cannot express all of the scholarly invariants, so this dependency-free validator
combines a published schema with semantic checks:

* source JSON parses and corpus/UI/bundler manifests agree;
* required identity metadata and known content shapes are present;
* translation/provenance records are structurally valid;
* verified quotations link to the rights manifest;
* canonical locator registry covers every document and every case-based unit;
* manifest W1 evidence metadata and per-document source-review statuses are explicit;
* complete-selected-witness status is compatible with a collated W1 source-review status;
* generated project_metrics.json matches the live data;
* live prose docs (README.md, HANDOFF.md, index.html) quote the same deterministic
  numbers — the "doc truthfulness" gate (skip with --skip-docs if editing docs).

Run normally in CI to verify committed metrics, or pass --write-metrics after a
legitimate data change to regenerate data/project_metrics.json deterministically.
"""

from __future__ import annotations

import argparse
import json
import re
from contextlib import contextmanager
import sys
from collections import Counter
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
CORPUS_DIR = DATA_DIR / "corpus"
METRICS_PATH = DATA_DIR / "project_metrics.json"
CORPUS_MANIFEST_PATH = DATA_DIR / "corpus_manifest.json"
LOCATORS_PATH = DATA_DIR / "canonical_locators.json"
RIGHTS_PATH = DATA_DIR / "translations" / "rights_manifest.json"
LINEAGE_VERIFICATION_PATH = DATA_DIR / "lineage" / "lineage_verification.json"
LINEAGE_SCHOOL_VOCAB_PATH = DATA_DIR / "lineage" / "school_vocabulary.json"
GONGAN_THEME_VOCAB_PATH = DATA_DIR / "gongan" / "theme_vocabulary.json"
LINEAGE_PROFILE_QUEUE_PATH = DATA_DIR / "lineage" / "profile_review_queue.json"
TRACEABILITY_QUEUE_PATH = DATA_DIR / "editorial" / "traceability_queue.json"
PROVENANCE_PATH = DATA_DIR / "translations" / "provenance.json"
MATRIX_PATH = DATA_DIR / "translations" / "comparative_matrix.json"
SCHEMA_PATH = ROOT / "schemas" / "translatechan-data.schema.json"
BUILD_SCRIPT = ROOT / "scripts" / "build_data_bundle.py"
# The W1 status vocabulary, the completion/source-review compatibility rule, and the
# dated evidence merge live next to this script so the validator, the metrics, the
# collation harness and the regression tests cannot drift apart. `app.js` mirrors the
# same rule; the smoke test pins that mirror against the generated metrics table.
SCRIPTS_DIR = Path(__file__).resolve().parent
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import source_review  # noqa: E402
import w1_evidence  # noqa: E402


APP_SCRIPT = ROOT / "app.js"

VALID_TRANSLATION_STATUSES = {
    "verified_quotation",
    "reconstruction_unverified",
    "ai_draft",
}
VALID_RIGHTS_STATUSES = {
    "copyrighted_or_rights_uncertain",
    "online_rights_unverified",
    "public_domain_claimed_us",
}
VALID_REVIEW_STATUSES = {
    "needs_rights_review",
    "jurisdiction_review_required",
}
VALID_LINEAGE_EDGE_STATUSES = {
    "source_verified",
    "traditional_link_pending_exact_locator",
    "disputed",
}
VALID_LINEAGE_FRONTIER_STATUSES = {"frontier_unprofiled"}
VALID_TRACEABILITY_QUEUE_STATUSES = {"needs_unit_locator", "in_review", "blocked_source", "complete"}
VALID_TRACEABILITY_PRIORITIES = {"high", "normal"}
VALID_PROFILE_REVIEW_STATUSES = {"needs_exact_locator", "frontier_source_needed", "in_review", "complete"}
# The W1 status vocabulary and the completion/source-review compatibility rule live in
# scripts/source_review.py so the validator, the metrics, the collation harness and the
# regression tests cannot drift apart. `app.js` mirrors the same rule and the smoke test
# pins that mirror against the generated metrics table.
VALID_COMPLETION_STATUSES = set(source_review.VALID_COMPLETION_STATUSES)
VALID_SOURCE_REVIEW_STATUSES = set(source_review.VALID_SOURCE_REVIEW_STATUSES)
SOURCE_ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
REQUIRED_DOCUMENT_FIELDS = {
    "title_zh",
    "title_en",
    "title_pinyin",
    "cbeta_id",
    "author_zh",
    "era",
    "genre",
}
CONTENT_COLLECTIONS = {
    "cases",
    "sections",
    "dialogues",
    "stanzas",
    "chapters",
    "five_ranks",
    "sample_records",
}
# Order used for unit-count and coverage rendering (most meaningful first).
UNIT_COUNT_ORDER = ("cases", "chapters", "stanzas", "dialogues", "sections", "five_ranks", "sample_records")
CJK_RE = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]")


class Issues:
    """Small error collector so a contributor can fix several data defects at once."""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.blocking_count = 0
        self._nonblocking = False

    def error(self, path: str, message: str) -> None:
        self.errors.append(f"{path}: {message}")
        if not self._nonblocking:
            self.blocking_count += 1

    @contextmanager
    def nonblocking(self):
        """Collect issues that must fail the run but must not block metric generation.

        Prose that drifted out of sync with the numbers is a real failure, but the
        numbers themselves are still valid — refusing to write metrics for it would only
        force a contributor to guess the values the validator is supposed to compute.
        """
        previous = self._nonblocking
        self._nonblocking = True
        try:
            yield
        finally:
            self._nonblocking = previous

    def warning(self, path: str, message: str) -> None:
        self.warnings.append(f"{path}: {message}")

    def require(self, condition: bool, path: str, message: str) -> bool:
        if not condition:
            self.error(path, message)
            return False
        return True


def is_record(value: Any) -> bool:
    return isinstance(value, dict)


def nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def load_json(path: Path, issues: Issues) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        issues.error(str(path.relative_to(ROOT)), "missing required file")
    except json.JSONDecodeError as exc:
        issues.error(str(path.relative_to(ROOT)), f"invalid JSON: {exc}")
    return None


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def require_fields(record: Any, fields: Iterable[str], path: str, issues: Issues) -> None:
    if not is_record(record):
        issues.error(path, "must be a JSON object")
        return
    for field in fields:
        if not nonempty_string(record.get(field)):
            issues.error(path, f"missing non-empty '{field}'")


def validate_source(source: Any, path: str, issues: Issues) -> str | None:
    if not is_record(source):
        issues.error(path, "verified quotation requires a source object")
        return None
    require_fields(source, ("work", "edition", "reference", "verification", "source_id"), path, issues)
    extra_fields = set(source) - {"work", "edition", "reference", "verification", "source_id", "page", "note", "gloss", "verified_by", "verified_date"}
    if extra_fields:
        issues.error(path, f"has unknown source field(s): {sorted(extra_fields)}")
    source_id = source.get("source_id")
    if nonempty_string(source_id) and not SOURCE_ID_RE.fullmatch(source_id):
        issues.error(path, "source_id must use lowercase letters, digits, and hyphens")
    return source_id if nonempty_string(source_id) else None


def validate_translation_map(
    translations: Any,
    path: str,
    issues: Issues,
    stats: Counter[str],
    verified_source_ids: list[str],
) -> None:
    if not is_record(translations):
        issues.error(path, "translations must be an object keyed by register")
        return
    if not translations:
        issues.error(path, "translations must not be empty")
        return

    for register, value in translations.items():
        entry_path = f"{path}.{register}"
        stats["corpus_slots"] += 1
        if nonempty_string(value):
            # Legacy bare strings were supported while the corpus was seeded.
            # The 2026-08-09 migration converted every slot to an object with
            # explicit text/status; reject new plain strings so status remains
            # self-describing data rather than a key-naming convention.
            issues.error(entry_path, "legacy string translation; use { text, status } (run scripts/migrate_translations.py)")
            continue
        if not is_record(value):
            issues.error(entry_path, "must be a translation object { text, status }")
            continue
        if not nonempty_string(value.get("text")):
            issues.error(entry_path, "translation object requires non-empty 'text'")
        status = value.get("status")
        if status not in VALID_TRANSLATION_STATUSES:
            issues.error(entry_path, f"has invalid or missing status {status!r}")
            continue
        extra_fields = set(value) - {"text", "status", "source"}
        if extra_fields:
            issues.error(entry_path, f"has unknown translation field(s): {sorted(extra_fields)}; allowed keys are text, status, source")
        stats[status] += 1
        if status == "verified_quotation":
            source = value.get("source")
            source_id = validate_source(source, f"{entry_path}.source", issues)
            if source_id:
                verified_source_ids.append(source_id)
            stats["verified_reference_pending" if is_record(source) and "pending" in str(source.get("reference") or "").lower() else "verified_reference_recorded"] += 1


def walk_translation_maps(
    value: Any,
    path: str,
    issues: Issues,
    stats: Counter[str],
    verified_source_ids: list[str],
) -> None:
    if is_record(value):
        if "translations" in value:
            validate_translation_map(value["translations"], f"{path}.translations", issues, stats, verified_source_ids)
        for key, child in value.items():
            # The translations map was just validated, but its values may include
            # source objects; recursively walking them is harmless and catches
            # nested future structures without treating source as a translation map.
            walk_translation_maps(child, f"{path}.{key}", issues, stats, verified_source_ids)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            walk_translation_maps(child, f"{path}[{index}]", issues, stats, verified_source_ids)


def validate_case_shape(cases: Any, path: str, issues: Issues) -> None:
    if not isinstance(cases, list) or not cases:
        issues.error(path, "cases must be a non-empty list")
        return
    seen: set[str] = set()
    source_field_occurrences: dict[tuple[str, str], list[str]] = {}
    for index, case in enumerate(cases):
        case_path = f"{path}[{index}]"
        if not is_record(case):
            issues.error(case_path, "case must be an object")
            continue
        number = case.get("case_num")
        if isinstance(number, bool) or number is None or str(number).strip() == "":
            issues.error(case_path, "case requires case_num")
        else:
            number_key = str(number)
            if number_key in seen:
                issues.error(case_path, f"duplicate case_num {number_key}")
            seen.add(number_key)
        for field in ("title_zh", "title_en"):
            if not nonempty_string(case.get(field)):
                issues.error(case_path, f"case requires non-empty '{field}'")
        if "dialogue" in case and not isinstance(case["dialogue"], list):
            issues.error(case_path, "dialogue must be a list when present")
        # Exact repetition of a substantial case-specific source field across
        # three or more cases is a release blocker, not normal textual reuse.
        # This catches the 2026-08-10 Congronglu incident where one generic
        # project-authored commentary and verse were attributed to 28 cases.
        for field in ("pointer_zh", "commentary_zh", "verse_zh"):
            value = case.get(field)
            if isinstance(value, str) and len(value.strip()) >= 12:
                source_field_occurrences.setdefault((field, value.strip()), []).append(str(number))

    for (field, value), case_numbers in source_field_occurrences.items():
        if len(case_numbers) >= 3:
            issues.error(
                path,
                f"identical {field} appears in {len(case_numbers)} cases "
                f"({', '.join(case_numbers)}): {value[:60]!r}; quarantine or mark generated placeholders outside canonical source fields",
            )


def validate_corpus_document(
    key: str,
    document: Any,
    issues: Issues,
    stats: Counter[str],
    verified_source_ids: list[str],
) -> None:
    path = f"data/corpus/{key}.json"
    require_fields(document, REQUIRED_DOCUMENT_FIELDS, path, issues)
    if not is_record(document):
        return

    present_collections = [
        name for name in CONTENT_COLLECTIONS
        if isinstance(document.get(name), list) and document.get(name)
    ]
    if not present_collections and not document.get("preface") and not document.get("epilogue"):
        issues.error(path, "must contain at least one supported content collection or preface/epilogue")
    if "cases" in document:
        validate_case_shape(document["cases"], f"{path}.cases", issues)
    for name in CONTENT_COLLECTIONS - {"cases"}:
        if name in document and not isinstance(document[name], list):
            issues.error(path, f"'{name}' must be a list when present")

    # Per-file coverage metadata (AUDIT §3.3 recommendation): when a document
    # declares zh_chars it must match the computed content count, and any
    # coverage_note must be a non-empty string. This keeps per-text counts that
    # appear in docs and the UI verifiable rather than prose-only.
    declared_chars = document.get("zh_chars")
    if declared_chars is not None:
        if not isinstance(declared_chars, int) or declared_chars < 0:
            issues.error(path, "zh_chars must be a non-negative integer when present")
        else:
            computed = content_cjk_count(document)
            if declared_chars != computed:
                issues.error(
                    path,
                    f"declared zh_chars={declared_chars} does not match computed content count {computed}",
                )
    coverage_note = document.get("coverage_note")
    if coverage_note is not None and not nonempty_string(coverage_note):
        issues.error(path, "coverage_note must be a non-empty string when present")

    walk_translation_maps(document, path, issues, stats, verified_source_ids)


def validate_matrix(
    matrix: Any,
    issues: Issues,
    stats: Counter[str],
    verified_source_ids: list[str],
) -> None:
    path = rel(MATRIX_PATH)
    if not isinstance(matrix, list) or not matrix:
        issues.error(path, "must be a non-empty list")
        return
    seen_ids: set[str] = set()
    for index, row in enumerate(matrix):
        row_path = f"{path}[{index}]"
        require_fields(row, ("id", "source_ref", "sentence_zh", "sentence_pinyin"), row_path, issues)
        if not is_record(row):
            continue
        row_id = row.get("id")
        if nonempty_string(row_id):
            if row_id in seen_ids:
                issues.error(row_path, f"duplicate matrix id '{row_id}'")
            seen_ids.add(row_id)
        translators = row.get("translators")
        if not isinstance(translators, list) or not translators:
            issues.error(row_path, "requires a non-empty translators list")
            continue
        for entry_index, entry in enumerate(translators):
            entry_path = f"{row_path}.translators[{entry_index}]"
            require_fields(entry, ("translator", "work", "style", "text", "notes", "status"), entry_path, issues)
            if not is_record(entry):
                continue
            status = entry.get("status")
            if status not in VALID_TRANSLATION_STATUSES:
                issues.error(entry_path, f"has invalid status {status!r}")
                continue
            extra_fields = set(entry) - {"translator", "work", "style", "text", "notes", "status", "source"}
            if extra_fields:
                issues.error(entry_path, f"has unknown matrix translator field(s): {sorted(extra_fields)}")
            stats[f"matrix_{status}"] += 1
            stats["matrix_entries"] += 1
            if status == "verified_quotation":
                source = entry.get("source")
                source_id = validate_source(source, f"{entry_path}.source", issues)
                if source_id:
                    verified_source_ids.append(source_id)
                stats["verified_reference_pending" if is_record(source) and "pending" in str(source.get("reference") or "").lower() else "verified_reference_recorded"] += 1


def load_controlled_vocabulary(path: Path, issues: Issues, field: str) -> dict[str, str]:
    """Controlled vocabulary loader: key -> canonical display string.

    Used for the lineage-school vocabulary (field 'schools') and the gong'an
    theme taxonomy (field 'themes'); both enforce key/display membership here.
    """
    raw = load_json(path, issues)
    if not is_record(raw) or not isinstance(raw.get(field), list) or not raw[field]:
        issues.error(rel(path), f"requires a non-empty {field} list")
        return {}
    vocab: dict[str, str] = {}
    for index, entry in enumerate(raw[field]):
        entry_path = f"{rel(path)}.{field}[{index}]"
        if not is_record(entry) or not nonempty_string(entry.get("key")) or not nonempty_string(entry.get("display")):
            issues.error(entry_path, "each entry requires non-empty key and display strings")
            continue
        if entry["key"] in vocab:
            issues.error(entry_path, f"duplicate key '{entry['key']}'")
        vocab[entry["key"]] = entry["display"]
        # School vocabulary also carries the curated graph color; enforce a
        # 3/6-digit hex so the lineage graph can derive its palette from data
        # instead of a hardcoded map (audit A2, 2026-08-09).

        allowed = {"key", "display", "color", "note"} if field == "schools" else {"key", "display", "note"}
        extra_fields = set(entry) - allowed
        if extra_fields:
            issues.error(entry_path, f"has unknown {field[:-1]} field(s): {sorted(extra_fields)}")
        if field == "schools":
            color = entry.get("color")
            if not isinstance(color, str) or not re.fullmatch(r"#[0-9a-fA-F]{6}", color):
                issues.error(entry_path, "each school requires a 'color' string as a 6-digit hex (e.g. '#b53335') used by the lineage graph")
    return vocab


def validate_auxiliary_data(
    glossary: Any,
    lineage: Any,
    gongan: Any,
    provenance: Any,
    issues: Issues,
    school_vocab: dict[str, str] | None = None,
    theme_vocab: dict[str, str] | None = None,
    corpus_keys: set[str] | None = None,
) -> None:
    for label, records, fields in (
        ("data/glossary/chan_terms.json", glossary, ("id", "term", "pinyin", "literal", "definition", "category")),
        ("data/lineage/masters.json", lineage, ("id", "name_zh", "name_en", "school", "school_key", "teacher", "profile_status")),
        ("data/gongan/gongan_index.json", gongan, ("id", "title_zh", "title_en", "collection", "theme", "theme_group")),
    ):
        if not isinstance(records, list) or not records:
            issues.error(label, "must be a non-empty list")
            continue
        seen: set[str] = set()
        for index, record in enumerate(records):
            record_path = f"{label}[{index}]"
            require_fields(record, fields, record_path, issues)
            if not is_record(record):
                continue
            record_id = record.get("id")
            if nonempty_string(record_id):
                if record_id in seen:
                    issues.error(record_path, f"duplicate id '{record_id}'")
                seen.add(record_id)
            if label == "data/lineage/masters.json":
                aliases = record.get("alternative_names", [])
                links = record.get("linked_corpus_keys", [])
                evidence = record.get("profile_evidence")
                if not isinstance(aliases, list) or not all(nonempty_string(alias) for alias in aliases):
                    issues.error(record_path, "alternative_names must be a list of non-empty strings")
                elif not aliases:
                    # Soft warning (audit 2026-08-10, Tier-4 content completeness):
                    # front-end dossier renders an "alternative names not yet
                    # reviewed" notice when this is empty, so an empty list
                    # is a known state, but the data is incomplete. Warn
                    # loudly so future ingests know to fill it.
                    issues.warning(record_path, "alternative_names is empty — dossier will show 'Alternative names not yet reviewed'")
                if not isinstance(links, list) or not all(nonempty_string(key) for key in links):
                    issues.error(record_path, "linked_corpus_keys must be a list of non-empty corpus keys")
                elif not links:
                    issues.warning(record_path, "linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'")
                else:
                    # Tier-4 (audit 2026-08-10): verify every linked corpus
                    # key actually exists. Prevents dangling-link regressions
                    # if a corpus file is renamed or removed.
                    for key in links:
                        if not isinstance(key, str) or (corpus_keys is not None and key not in corpus_keys):
                            issues.error(record_path, f"linked_corpus_key {key!r} is not a known corpus document")
                if not is_record(evidence) or not nonempty_string(evidence.get("status")) or not nonempty_string(evidence.get("note")):
                    issues.error(record_path, "profile_evidence requires non-empty status and note")
                if school_vocab:
                    school_key = record.get("school_key")
                    if school_key not in school_vocab:
                        issues.error(record_path, f"school_key '{school_key}' is not in the controlled vocabulary (data/lineage/school_vocabulary.json)")
                    elif record.get("school") != school_vocab[school_key]:
                        issues.error(record_path, f"school must be the canonical display for key '{school_key}': {school_vocab[school_key]!r}")
            if label == "data/gongan/gongan_index.json" and theme_vocab:
                theme_group = record.get("theme_group")
                if theme_group not in theme_vocab:
                    issues.error(record_path, f"theme_group '{theme_group}' is not in the gong'an theme taxonomy (data/gongan/theme_vocabulary.json)")

    if not is_record(provenance):
        issues.error(rel(PROVENANCE_PATH), "must be an object")
        return
    require_fields(provenance, ("policy_version", "policy_date", "summary"), rel(PROVENANCE_PATH), issues)
    matrix_schema = provenance.get("matrix_entry_schema")
    if not is_record(matrix_schema):
        issues.error(rel(PROVENANCE_PATH), "must document matrix_entry_schema")
    rights_manifest = provenance.get("rights_manifest")
    if not is_record(rights_manifest) or not nonempty_string(rights_manifest.get("path")):
        issues.error(rel(PROVENANCE_PATH), "must document rights_manifest path")


def validate_lineage_verification(lineage: Any, registry: Any, issues: Issues) -> dict[str, Any]:
    path = rel(LINEAGE_VERIFICATION_PATH)
    if not isinstance(lineage, list) or not is_record(registry):
        issues.error(path, "requires lineage profiles plus a verification registry object")
        return {}

    masters = {master.get("id"): master for master in lineage if is_record(master) and nonempty_string(master.get("id"))}
    expected_edges = {
        (master["teacher"], master["id"])
        for master in masters.values()
        if master.get("teacher") in masters
    }
    expected_frontiers = {
        (str(master.get("teacher") or ""), master["id"])
        for master in masters.values()
        if master.get("teacher") not in masters
    }

    sources = registry.get("sources")
    if not isinstance(sources, list) or not sources:
        issues.error(path, "requires a non-empty sources list")
        source_ids: set[str] = set()
    else:
        source_ids = set()
        for index, source in enumerate(sources):
            source_path = f"{path}.sources[{index}]"
            require_fields(source, ("source_id", "title", "canonical_id", "reference", "source_type"), source_path, issues)
            if is_record(source):
                extra_fields = set(source) - {"source_id", "title", "canonical_id", "reference", "source_type"}
                if extra_fields:
                    issues.error(source_path, f"has unknown lineage source field(s): {sorted(extra_fields)}")
                if nonempty_string(source.get("source_id")):
                    source_id = source["source_id"]
                    if not SOURCE_ID_RE.fullmatch(source_id):
                        issues.error(source_path, "source_id must use lowercase letters, digits, and hyphens")
                    if source_id in source_ids:
                        issues.error(source_path, f"duplicate source_id '{source_id}'")
                    source_ids.add(source_id)

    edges = registry.get("edges")
    actual_edges: set[tuple[str, str]] = set()
    status_counts: Counter[str] = Counter()
    if not isinstance(edges, list):
        issues.error(path, "requires an edges list")
    else:
        for index, edge in enumerate(edges):
            edge_path = f"{path}.edges[{index}]"
            require_fields(edge, ("teacher", "disciple", "status", "source_id", "reference", "note"), edge_path, issues)
            if not is_record(edge):
                continue
            extra_fields = set(edge) - {"teacher", "disciple", "status", "source_id", "reference", "note"}
            if extra_fields:
                issues.error(edge_path, f"has unknown lineage edge field(s): {sorted(extra_fields)}")
            pair = (str(edge.get("teacher") or ""), str(edge.get("disciple") or ""))
            if pair in actual_edges:
                issues.error(edge_path, f"duplicate edge {pair[0]} → {pair[1]}")
            actual_edges.add(pair)
            status = edge.get("status")
            if status not in VALID_LINEAGE_EDGE_STATUSES:
                issues.error(edge_path, f"invalid edge status {status!r}")
            else:
                status_counts[status] += 1
            if edge.get("source_id") not in source_ids:
                issues.error(edge_path, f"unknown lineage source_id {edge.get('source_id')!r}")

    if actual_edges != expected_edges:
        missing = sorted(expected_edges - actual_edges)
        extra = sorted(actual_edges - expected_edges)
        if missing:
            issues.error(path, "missing internal lineage edge(s): " + ", ".join(f"{a}→{b}" for a, b in missing))
        if extra:
            issues.error(path, "unknown lineage edge(s): " + ", ".join(f"{a}→{b}" for a, b in extra))

    frontiers = registry.get("frontiers")
    actual_frontiers: set[tuple[str, str]] = set()
    if not isinstance(frontiers, list):
        issues.error(path, "requires a frontiers list")
    else:
        for index, frontier in enumerate(frontiers):
            frontier_path = f"{path}.frontiers[{index}]"
            require_fields(frontier, ("teacher_label", "disciple", "status", "source_id", "reference"), frontier_path, issues)
            if not is_record(frontier):
                continue
            pair = (str(frontier.get("teacher_label") or ""), str(frontier.get("disciple") or ""))
            actual_frontiers.add(pair)
            if frontier.get("status") not in VALID_LINEAGE_FRONTIER_STATUSES:
                issues.error(frontier_path, f"invalid frontier status {frontier.get('status')!r}")
            if frontier.get("source_id") not in source_ids:
                issues.error(frontier_path, f"unknown lineage source_id {frontier.get('source_id')!r}")

    if actual_frontiers != expected_frontiers:
        missing = sorted(expected_frontiers - actual_frontiers)
        extra = sorted(actual_frontiers - expected_frontiers)
        if missing:
            issues.error(path, "missing lineage frontier(s): " + ", ".join(f"{a}→{b}" for a, b in missing))
        if extra:
            issues.error(path, "unknown lineage frontier(s): " + ", ".join(f"{a}→{b}" for a, b in extra))

    return {
        "internal_edges": len(expected_edges),
        "frontiers": len(expected_frontiers),
        "statuses": dict(sorted(status_counts.items())),
        "source_records": len(source_ids),
    }


def validate_lineage_profile_queue(lineage: Any, queue: Any, issues: Issues) -> dict[str, Any]:
    path = rel(LINEAGE_PROFILE_QUEUE_PATH)
    expected = {m.get("id") for m in lineage if is_record(m) and nonempty_string(m.get("id"))} if isinstance(lineage, list) else set()
    if not is_record(queue) or not isinstance(queue.get("records"), list):
        issues.error(path, "requires an object with a records list")
        return {}
    actual: set[str] = set(); statuses: Counter[str] = Counter()
    for index, record in enumerate(queue["records"]):
        record_path = f"{path}.records[{index}]"
        require_fields(record, ("master_id", "priority", "review_status", "current_evidence_status", "next_action", "note"), record_path, issues)
        if not is_record(record): continue
        master_id = record.get("master_id")
        if master_id in actual: issues.error(record_path, f"duplicate master_id {master_id!r}")
        actual.add(master_id)
        if record.get("priority") not in VALID_TRACEABILITY_PRIORITIES: issues.error(record_path, "invalid priority")
        if record.get("review_status") not in VALID_PROFILE_REVIEW_STATUSES: issues.error(record_path, "invalid review_status")
        else: statuses[record["review_status"]] += 1
    if actual != expected:
        if expected - actual: issues.error(path, "missing profile queue record(s): " + ", ".join(sorted(expected - actual)))
        if actual - expected: issues.error(path, "unknown profile queue record(s): " + ", ".join(sorted(actual - expected)))
    return {"profile_queue_records": len(actual), "statuses": dict(sorted(statuses.items()))}


def validate_w1_evidence(corpus_manifest: Any, corpus: dict[str, Any], issues: Issues) -> dict[str, Any]:
    """Validate the dated W1 evidence records and return their computed aggregates.

    The manifest may only *declare* statuses; here every declaration is re-derived from the
    merged evidence (historical register + dated correction overlay). Missing evidence, extra
    evidence, a wrong date, a status no register supports, a register key with no manifest item,
    or a collated claim resting on a non-verified reference all fail the run.
    """
    try:
        import collate_corpus  # noqa: PLC0415 - only needed for its DOCS mapping keys
        harness_docs = set(collate_corpus.DOCS)
    except Exception as exc:  # noqa: BLE001 - an unreadable harness means no item can be mapped
        harness_docs = set()
        issues.error(rel(CORPUS_MANIFEST_PATH), f"W1 harness mapping could not be read ({exc}); a manifest "
                                                "item without a scripts/collate_corpus.py DOCS mapping is a "
                                                "containment gap, not evidence")
    aggregates = w1_evidence.validate(
        corpus_manifest, set(corpus), harness_docs, issues, root=ROOT
    )
    if not aggregates:
        return {}
    items = corpus_manifest.get("items") if is_record(corpus_manifest) else None
    declared = Counter(
        item.get("source_review_status")
        for item in (items or [])
        if is_record(item) and item.get("source_review_status") in VALID_SOURCE_REVIEW_STATUSES
    )
    for status, count in aggregates.get("status_counts", {}).items():
        if declared.get(status, 0) != count:
            issues.error(
                rel(CORPUS_MANIFEST_PATH),
                f"manifest declares {declared.get(status, 0)} item(s) with source_review_status={status!r} "
                f"but the merged evidence derives {count}; recompute the statuses from the registers",
            )
    return aggregates


def validate_manifest_sync(corpus: dict[str, Any], manifest: Any, issues: Issues) -> dict[str, int]:
    path = rel(CORPUS_MANIFEST_PATH)
    if not is_record(manifest) or not isinstance(manifest.get("items"), list):
        issues.error(path, "must contain an object with an items list")
        return {}

    if not manifest["items"]:
        issues.error(path, "items list must not be empty")
    corpus_keys = set(corpus)
    manifest_keys: set[str] = set()
    for index, item in enumerate(manifest["items"]):
        item_path = f"{path}.items[{index}]"
        require_fields(item, ("key", "title", "cbeta", "completion_status"), item_path, issues)
        if not is_record(item) or not nonempty_string(item.get("key")):
            continue
        key = item["key"]
        if key in manifest_keys:
            issues.error(item_path, f"duplicate corpus key '{key}'")
        manifest_keys.add(key)
        completion_status = item.get("completion_status")
        if completion_status not in VALID_COMPLETION_STATUSES:
            issues.error(
                item_path,
                f"completion_status must be one of {sorted(VALID_COMPLETION_STATUSES)}, got {completion_status!r}",
            )
        source_review_status = item.get("source_review_status")
        if source_review_status not in VALID_SOURCE_REVIEW_STATUSES:
            issues.error(
                item_path,
                f"source_review_status must be one of {sorted(VALID_SOURCE_REVIEW_STATUSES)}, got {source_review_status!r}",
            )
        elif not source_review.is_completion_source_review_compatible(completion_status, source_review_status):
            issues.error(
                item_path,
                "complete_selected_witness requires source_review_status='collated_to_claimed_witness'; "
                f"got {source_review_status!r}",
            )

        # Optional canonical unit targets (e.g. {"cases": 100} for Biyanlu) make
        # per-text coverage claims ("7/100 cases") verifiable against live data.
        targets = item.get("unit_targets")
        if targets is not None:
            if not is_record(targets) or not targets:
                issues.error(item_path, "unit_targets must be a non-empty object when present")
                continue
            for unit_name, target in targets.items():
                if unit_name not in CONTENT_COLLECTIONS:
                    issues.error(item_path, f"unit_targets has unknown unit '{unit_name}'")
                elif not isinstance(target, int) or target <= 0:
                    issues.error(item_path, f"unit_targets.{unit_name} must be a positive integer")
            document = corpus.get(key) if isinstance(corpus, dict) else None
            if is_record(document):
                for unit_name, target in targets.items():
                    present = len(document[unit_name]) if isinstance(document.get(unit_name), list) else 0
                    if present > target:
                        issues.error(
                            item_path,
                            f"unit_targets.{unit_name}={target} but {key} contains {present} units",
                        )

    missing = sorted(corpus_keys - manifest_keys)
    extra = sorted(manifest_keys - corpus_keys)
    if missing:
        issues.error(path, f"missing corpus key(s): {', '.join(missing)}")
    if extra:
        issues.error(path, f"unknown corpus key(s): {', '.join(extra)}")

    build_text = BUILD_SCRIPT.read_text(encoding="utf-8")
    app_text = APP_SCRIPT.read_text(encoding="utf-8")
    if "CORPUS_MANIFEST_FILE" not in build_text or "load_corpus_manifest" not in build_text:
        issues.error(rel(BUILD_SCRIPT), "must load the shared corpus manifest")
    if "state.data.corpus_manifest" not in app_text:
        issues.error(rel(APP_SCRIPT), "must render navigation from the shared corpus manifest")

    return {
        "corpus_files": len(corpus_keys),
        "shared_manifest_items": len(manifest_keys),
    }


def validate_canonical_locators(
    corpus: dict[str, Any],
    registry: Any,
    issues: Issues,
) -> dict[str, int]:
    path = rel(LOCATORS_PATH)
    if not is_record(registry):
        issues.error(path, "must be an object")
        return {}
    documents = registry.get("documents")
    if not is_record(documents):
        issues.error(path, "requires a documents object")
        return {}

    corpus_keys = set(corpus)
    registry_keys = set(documents)
    missing = sorted(corpus_keys - registry_keys)
    extra = sorted(registry_keys - corpus_keys)
    if missing:
        issues.error(path, f"missing document locator(s): {', '.join(missing)}")
    if extra:
        issues.error(path, f"unknown document locator(s): {', '.join(extra)}")

    case_count = 0
    case_locator_count = 0
    case_level_documents = 0
    document_level_documents = 0
    for key, document in corpus.items():
        entry = documents.get(key)
        entry_path = f"{path}.documents.{key}"
        if not is_record(entry):
            continue
        require_fields(entry, ("canonical_id", "canonical_locator", "granularity", "status"), entry_path, issues)
        if entry.get("canonical_id") != document.get("cbeta_id"):
            issues.error(entry_path, "canonical_id must exactly match corpus cbeta_id")
        cases = document.get("cases") if is_record(document) else None
        if isinstance(cases, list) and cases:
            case_level_documents += 1
            if entry.get("granularity") != "case":
                issues.error(entry_path, "case-based corpus document requires case granularity")
            locators = entry.get("case_locators")
            if not is_record(locators):
                issues.error(entry_path, "case-based corpus document requires case_locators")
                continue
            expected = {str(case.get("case_num")) for case in cases if is_record(case)}
            actual = set(locators)
            if expected != actual:
                issues.error(entry_path, "case_locators must cover exactly the declared case_num values")
            case_count += len(expected)
            for case_key in expected:
                value = locators.get(case_key)
                locator_path = f"{entry_path}.case_locators.{case_key}"
                if not is_record(value):
                    issues.error(locator_path, "must be an object")
                    continue
                require_fields(value, ("canonical_locator", "status"), locator_path, issues)
                case_locator_count += 1
        else:
            document_level_documents += 1
            if entry.get("granularity") != "document":
                issues.error(entry_path, "non-case seed document requires document granularity")

    return {
        "documents": len(corpus),
        "case_level_documents": case_level_documents,
        "document_level_seed_documents": document_level_documents,
        "declared_cases": case_count,
        "case_locators": case_locator_count,
    }


def validate_traceability_queue(corpus: dict[str, Any], locator_registry: Any, queue: Any, issues: Issues) -> dict[str, int]:
    path = rel(TRACEABILITY_QUEUE_PATH)
    if not is_record(locator_registry) or not isinstance(locator_registry.get("documents"), dict):
        return {}
    expected = {key for key, entry in locator_registry["documents"].items() if is_record(entry) and entry.get("granularity") == "document"}
    if not is_record(queue) or not isinstance(queue.get("records"), list):
        issues.error(path, "requires an object with a records list")
        return {}
    actual: set[str] = set()
    statuses: Counter[str] = Counter()
    for index, record in enumerate(queue["records"]):
        record_path = f"{path}.records[{index}]"
        require_fields(record, ("document_key", "canonical_id", "current_locator", "content_shape", "priority", "review_status", "next_action", "editorial_note"), record_path, issues)
        if not is_record(record):
            continue
        key = record.get("document_key")
        if key in actual:
            issues.error(record_path, f"duplicate document_key {key!r}")
        actual.add(key)
        if key not in corpus:
            issues.error(record_path, f"unknown corpus document {key!r}")
            continue
        locator = locator_registry["documents"].get(key, {})
        if record.get("canonical_id") != locator.get("canonical_id") or record.get("current_locator") != locator.get("canonical_locator"):
            issues.error(record_path, "canonical_id/current_locator must match canonical_locators.json")
        if record.get("review_status") not in VALID_TRACEABILITY_QUEUE_STATUSES:
            issues.error(record_path, f"invalid review_status {record.get('review_status')!r}")
        else:
            statuses[record["review_status"]] += 1
        if record.get("priority") not in VALID_TRACEABILITY_PRIORITIES:
            issues.error(record_path, f"invalid priority {record.get('priority')!r}")
    if actual != expected:
        if expected - actual: issues.error(path, "missing queue record(s): " + ", ".join(sorted(expected - actual)))
        if actual - expected: issues.error(path, "queue contains non-document-level record(s): " + ", ".join(sorted(actual - expected)))
    return {"document_level_queue_records": len(actual), "statuses": dict(sorted(statuses.items()))}


def validate_rights_manifest(
    manifest: Any,
    verified_source_ids: list[str],
    issues: Issues,
) -> dict[str, int]:
    path = rel(RIGHTS_PATH)
    if not is_record(manifest):
        issues.error(path, "must be an object")
        return {}
    sources = manifest.get("sources")
    if not isinstance(sources, list) or not sources:
        issues.error(path, "requires a non-empty sources list")
        return {}
    known: set[str] = set()
    for index, source in enumerate(sources):
        source_path = f"{path}.sources[{index}]"
        require_fields(
            source,
            ("source_id", "translator", "rights_status", "review_status", "redistribution_policy"),
            source_path,
            issues,
        )
        if is_record(source):
            if source.get("rights_status") not in VALID_RIGHTS_STATUSES:
                issues.error(source_path, f"invalid rights_status {source.get('rights_status')!r}")
            if source.get("review_status") not in VALID_REVIEW_STATUSES:
                issues.error(source_path, f"invalid review_status {source.get('review_status')!r}")
            if nonempty_string(source.get("source_id")):
                source_id = source["source_id"]
                if not SOURCE_ID_RE.fullmatch(source_id):
                    issues.error(source_path, "source_id must use lowercase letters, digits, and hyphens")
                if source_id in known:
                    issues.error(source_path, f"duplicate source_id '{source_id}'")
                known.add(source_id)
    unknown = sorted(set(verified_source_ids) - known)
    if unknown:
        issues.error(path, f"verified quotation source_id(s) missing from rights manifest: {', '.join(unknown)}")
    return {
        "manifest_sources": len(known),
        "verified_source_records": len(verified_source_ids),
        "distinct_verified_sources": len(set(verified_source_ids)),
    }


def iter_strings(value: Any, field_name: str | None = None) -> Iterable[tuple[str | None, str]]:
    if is_record(value):
        for key, child in value.items():
            yield from iter_strings(child, key)
    elif isinstance(value, list):
        for child in value:
            yield from iter_strings(child, field_name)
    elif isinstance(value, str):
        yield field_name, value


def cjk_count(text: str) -> int:
    return len(CJK_RE.findall(text))


def content_cjk_count(document: Any) -> int:
    total = 0
    excluded_metadata = {"title_zh", "author_zh", "name_zh"}
    for field_name, text in iter_strings(document):
        if field_name in excluded_metadata:
            continue
        if field_name == "zh" or (isinstance(field_name, str) and field_name.endswith("_zh")):
            total += cjk_count(text)
    return total


def all_cjk_count(document: Any) -> int:
    return sum(cjk_count(text) for _, text in iter_strings(document))


def content_shapes(document: Any) -> list[str]:
    if not is_record(document):
        return []
    return sorted(name for name in CONTENT_COLLECTIONS if isinstance(document.get(name), list) and document.get(name))


def unit_counts(document: Any) -> dict[str, int]:
    """Present unit counts per content collection (only non-empty lists)."""
    if not is_record(document):
        return {}
    return {
        name: len(document[name])
        for name in UNIT_COUNT_ORDER
        if isinstance(document.get(name), list) and document[name]
    }


def complete_document_keys(corpus: dict[str, Any], manifest: Any) -> list[str]:
    """Return documents explicitly approved as complete selected witnesses.

    Unit targets measure representation (for example, 100/100 case containers);
    they do not prove that every canonical field is present or reviewed. A work
    is counted complete only when the manifest's editorial completion_status is
    complete_selected_witness *and* all declared unit targets are met. This
    prevents excerpt containers such as the 680-CJK Platform Sutra seed, or a
    partial-field 100-case Biyanlu set, from becoming "complete" by arithmetic.
    """
    items = manifest.get("items") if is_record(manifest) else None
    items_by_key = {
        item.get("key"): item
        for item in items or []
        if isinstance(item, dict) and nonempty_string(item.get("key"))
    }
    complete = []
    for key, document in corpus.items():
        item = items_by_key.get(key, {})
        if item.get("completion_status") != "complete_selected_witness":
            continue
        # Same rule as the manifest check and the Reader: a document whose source was not
        # collated to its claimed witness is not complete, whatever its containers hold.
        if not source_review.is_completion_source_review_compatible(
            item.get("completion_status"), item.get("source_review_status")
        ):
            continue
        targets = item.get("unit_targets")
        if not is_record(targets) or not targets:
            continue
        counts = unit_counts(document)
        if all(
            isinstance(target, int) and target > 0 and counts.get(unit_name, 0) >= target
            for unit_name, target in targets.items()
        ):
            complete.append(key)
    return complete


def coverage_from_targets(counts: dict[str, int], targets: Any) -> str | None:
    """Render '7/100 cases, 4/10 chapters' style coverage from manifest targets."""
    if not is_record(targets):
        return None
    rendered = []
    for unit_name in UNIT_COUNT_ORDER:
        target = targets.get(unit_name)
        if isinstance(target, int) and target > 0:
            rendered.append(f"{counts.get(unit_name, 0)}/{target} {unit_name}")
    return ", ".join(rendered) if rendered else None


def per_text_metrics(corpus: dict[str, Any], manifest: Any, evidence: dict[str, Any] | None = None) -> dict[str, Any]:
    """Deterministic per-text coverage facts: zh counts, shapes, unit counts,
    declared coverage metadata, and (where the manifest declares targets) a
    machine-checkable '7/100 cases' coverage string. This is the single source
    of truth for the README/AUDIT per-text numbers."""
    manifest_by_key: dict[str, Any] = {}
    if is_record(manifest) and isinstance(manifest.get("items"), list):
        for item in manifest["items"]:
            if is_record(item) and nonempty_string(item.get("key")):
                manifest_by_key[item["key"]] = item
    evidence = evidence or {}
    out: dict[str, Any] = {}
    for key in sorted(corpus):
        document = corpus[key]
        item = manifest_by_key.get(key, {})
        counts = unit_counts(document)
        completion_status = str(item.get("completion_status") or "excerpt_seed")
        entry: dict[str, Any] = {
            "title": str(item.get("title") or document.get("title_en") or key),
            "cbeta_id": str(document.get("cbeta_id") or ""),
            "content_zh_chars": content_cjk_count(document),
            "all_cjk_chars": all_cjk_count(document),
            "shapes": content_shapes(document),
            "unit_counts": counts,
            "completion_status": completion_status,
            "source_review_status": item.get("source_review_status"),
            "is_complete": source_review.is_completion_source_review_compatible(
                completion_status, item.get("source_review_status")
            ) and completion_status == "complete_selected_witness",
        }
        per_doc = (evidence or {}).get("per_document", {}).get(key)
        if isinstance(per_doc, dict):
            entry["source_review"] = dict(per_doc)
        coverage_note = document.get("coverage_note")
        if isinstance(coverage_note, str) and coverage_note:
            entry["coverage_note"] = coverage_note
        declared_chars = document.get("zh_chars")
        if isinstance(declared_chars, int):
            entry["declared_zh_chars"] = declared_chars
        coverage = coverage_from_targets(counts, item.get("unit_targets"))
        if coverage:
            entry["coverage"] = coverage
        out[key] = entry
    return out


def compute_metrics(
    corpus: dict[str, Any],
    stats: Counter[str],
    locator_metrics: dict[str, int],
    rights_metrics: dict[str, int],
    lineage_metrics: dict[str, Any],
    traceability_metrics: dict[str, Any],
    profile_queue_metrics: dict[str, Any],
    manifest_metrics: dict[str, int],
    corpus_manifest: Any,
    w1_evidence_aggregates: dict[str, Any] | None = None,
) -> dict[str, Any]:
    matrix_statuses = {
        status.removeprefix("matrix_"): stats.get(f"matrix_{status}", 0)
        for status in sorted(VALID_TRANSLATION_STATUSES)
    }
    shapes = Counter()
    for document in corpus.values():
        for shape in content_shapes(document):
            shapes[shape] += 1
    complete_documents = complete_document_keys(corpus, corpus_manifest)
    manifest_items = corpus_manifest.get("items", []) if is_record(corpus_manifest) else []
    completion_statuses = Counter(
        item.get("completion_status")
        for item in manifest_items
        if is_record(item) and item.get("completion_status") in VALID_COMPLETION_STATUSES
    )
    source_review_statuses = Counter(
        item.get("source_review_status")
        for item in manifest_items
        if is_record(item) and item.get("source_review_status") in VALID_SOURCE_REVIEW_STATUSES
    )
    source_review_block = w1_evidence.metrics_block(w1_evidence_aggregates or {})
    return {
        "schema_version": "1.0",
        "measurement_method": {
            "content_cjk_characters": "CJK code points in source-content zh/_zh fields, excluding title_zh, author_zh, and name_zh metadata.",
            "all_corpus_cjk_characters": "CJK code points across every string in data/corpus JSON files.",
            "translation_slot": "One register value under a translations object; string values use policy defaults and object values use explicit status.",
            "complete_documents": "Documents marked complete_selected_witness whose unit targets are all met AND whose W1 source-review status is collated_to_claimed_witness; unit counts alone never establish completion.",
            "per_text": "Per-key coverage facts: zh char counts, content shapes, present unit counts, editorial completion status, W1 source-review evidence (status, per-document field and flag counts, byte-verified witnesses), declared coverage_note/zh_chars, and (when declared) an N/M representation string.",
            "source_review": "W1 containment ledger: computed only from the dated evidence records merged by scripts/w1_evidence.py (historical register plus the dated correction overlay); status counts, flagged-entry totals, content-field denominators and reference verification are recomputed from those files on every run.",
        },
        "corpus": {
            "documents": len(corpus),
            "complete_documents": complete_documents,
            "incomplete_documents": len(corpus) - len(complete_documents),
            "excerpt_seed_documents": completion_statuses.get("excerpt_seed", 0),
            "completion_statuses": dict(sorted(completion_statuses.items())),
            "source_review_statuses": {
                status: source_review_statuses.get(status, 0)
                for status in sorted(VALID_SOURCE_REVIEW_STATUSES)
            },

            "content_cjk_characters": sum(content_cjk_count(doc) for doc in corpus.values()),
            "all_corpus_cjk_characters": sum(all_cjk_count(doc) for doc in corpus.values()),
            "content_shapes": dict(sorted(shapes.items())),
            "source_review": source_review_block,
            "per_text": per_text_metrics(corpus, corpus_manifest, w1_evidence_aggregates),
        },
        "translations": {
            "corpus_slots": stats.get("corpus_slots", 0),
            "verified_corpus_texts": stats.get("verified_corpus_texts", 0),
            "corpus_statuses": {
                status: stats.get(status, 0) for status in sorted(VALID_TRANSLATION_STATUSES)
            },
            "matrix_entries": stats.get("matrix_entries", 0),
            "matrix_statuses": matrix_statuses,
            "verified_reference_coverage": {
                "recorded": stats.get("verified_reference_recorded", 0),
                "pending": stats.get("verified_reference_pending", 0),
            },
        },
        "canonical_locator_coverage": locator_metrics,
        "rights_coverage": rights_metrics,
        "lineage_verification": lineage_metrics,
        "editorial_traceability": traceability_metrics,
        "lineage_profile_review": profile_queue_metrics,
        "manifest_integrity": manifest_metrics,
    }


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"


def validate_doc_truthfulness(metrics: dict[str, Any], glossary: Any, lineage: Any, gongan: Any, school_vocab: dict[str, str], issues: Issues) -> None:
    """Guard the curated live docs against quoting stale deterministic numbers.

    Prose cannot be schema-validated, but every repeated drift incident (see
    sessions/AUDIT_archive_2026-08-08.md §11 F1, §12) came from docs echoing
    numbers the validator already computes.  Each rule below is (file, exact
    snippet, description): the snippet is built from live values, and the
    document must contain it — an absent snippet means the prose drifted (or
    was reworded: update the rule).  Dated session logs (sessions/*.md) are
    intentionally not checked; AUDIT.md's *current-verdict* section IS guarded
    because, per the §5 convention, it republishes live numbers rather than
    being a dated log (added after the 2026-08-09 audit found the "6 corpus
    texts" claim had drifted to 7 uncovered).
    """
    corpus = metrics["corpus"]
    translations = metrics["translations"]
    locators = metrics["canonical_locator_coverage"]
    lineage_registry = metrics.get("lineage_verification", {})
    ref_cov = translations.get("verified_reference_coverage", {})
    recorded = ref_cov.get("recorded", 0)
    pending = ref_cov.get("pending", 0)
    biyanlu = corpus.get("per_text", {}).get("biyanlu_cases", {})
    wumenguan = corpus.get("per_text", {}).get("wumenguan", {})
    verified_slots = translations["corpus_statuses"]["verified_quotation"]
    verified_texts = translations.get("verified_corpus_texts", 0)
    matrix_verified = translations.get("matrix_statuses", {}).get("verified_quotation", 0)
    source_review_statuses = corpus.get("source_review_statuses", {})
    checks = [
        ("README.md", f"**{corpus['content_cjk_characters']:,} source-content CJK characters** "
                      f"(or {corpus['all_corpus_cjk_characters']:,} across every corpus JSON string",
         "honest-status CJK counts"),
        ("README.md", f"manifest ({corpus['documents']} keys)", "manifest key count in repo tree"),
        ("README.md", "48 / 48 cases represented; W1 source-review status: `partial_or_failed_w1_collation`", "Wumenguan containment status in corpus table"),
        ("README.md", f"currently **{len(lineage)} master profiles**", "master profile count in lineage feature"),
        ("README.md", f"— **{len(gongan)} indexed cases** at present", "gong'an count in index feature"),
        ("README.md", f"**{len(glossary)} terms** today", "glossary count in lexicon feature"),
        ("HANDOFF.md", f"corpus={corpus['documents']} | slots={translations['corpus_slots']} | "
                       f"verified={translations['corpus_statuses']['verified_quotation']} | "
                       f"matrix={translations['matrix_entries']} | "
                       f"locators={locators.get('case_locators', 0)}/{locators.get('declared_cases', 0)}",
         "quality-gate summary numbers"),
        ("HANDOFF.md", f"**{recorded} / {recorded + pending}**", "verified-reference coverage split"),
        ("HANDOFF.md", f"the remaining **{pending}**", "verified-reference pending count"),
        ("HANDOFF.md", f"# {len(glossary)} Classical Chan & Buddhist lexicon terms", "glossary count in repo tree"),
        ("HANDOFF.md", f"# {len(gongan)} Gong'an cross-references index entries", "gong'an count in repo tree"),
        ("index.html", f"{corpus['documents']} Corpus Works", "hero corpus chip"),
        ("README.md", f"`collated_to_claimed_witness`: **{source_review_statuses.get('collated_to_claimed_witness', 0)}**", "W1 collated status count"),
        ("README.md", f"`partial_or_failed_w1_collation`: **{source_review_statuses.get('partial_or_failed_w1_collation', 0)}**", "W1 partial/failed status count"),
        ("README.md", f"`witness_unavailable`: **{source_review_statuses.get('witness_unavailable', 0)}**", "W1 unavailable status count"),
        ("HANDOFF.md", f"source-review: collated={source_review_statuses.get('collated_to_claimed_witness', 0)} | partial/failed={source_review_statuses.get('partial_or_failed_w1_collation', 0)} | unavailable={source_review_statuses.get('witness_unavailable', 0)}", "W1 source-review status counts"),
        ("AUDIT.md", f"Source review: **{source_review_statuses.get('collated_to_claimed_witness', 0)} collated**, **{source_review_statuses.get('partial_or_failed_w1_collation', 0)} partial/failed**, **{source_review_statuses.get('witness_unavailable', 0)} unavailable**", "current W1 source-review status counts"),
        # AUDIT 2026-08-09 turn-2: the verified-slot tallies must name the true
        # corpus-text spread (drifted 6 → 7 texts before this rule existed).
        ("README.md", f"**{verified_slots} verified quotation slots across {verified_texts} corpus texts + {matrix_verified} verified comparative-matrix entries**",
         "verified-slot corpus-text spread (campaign bullet)"),
        ("ROADMAP.md", f"**{verified_slots} verified corpus quotation slots across {verified_texts} texts + {matrix_verified} verified Matrix entries**",
         "verified-slot corpus-text spread (milestone note)"),
        # AUDIT.md §1 "Current verdict" republishes live numbers per the §5
        # convention — guard them like README/HANDOFF (previously unguarded).
        ("AUDIT.md", f"Corpus: **{corpus['documents']} documents**", "current-verdict corpus document count"),
        ("AUDIT.md", f"**{corpus['excerpt_seed_documents']} excerpt seeds**", "current-verdict excerpt-seed count"),
        ("AUDIT.md", f"**{corpus['content_cjk_characters']:,} content CJK / {corpus['all_corpus_cjk_characters']:,} all-string CJK**",
         "current-verdict CJK counts"),
        ("AUDIT.md", f"Translations: **{translations['corpus_slots']} corpus slots**; **{verified_slots} verified quotations**; **{translations['matrix_entries']} matrix registers**",
         "current-verdict translation tallies"),
        ("AUDIT.md", f"verified-reference coverage **{recorded} recorded / {pending} pending**", "current-verdict reference coverage"),
        ("AUDIT.md", f"Locators: **{locators.get('case_locators', 0)}/{locators.get('declared_cases', 0)} case-level**; **{locators.get('document_level_seed_documents', 0)} document-level seeds**",
         "current-verdict locator coverage"),
        ("AUDIT.md", f"Lineage: **{len(lineage)} masters**", "current-verdict master count"),
        ("AUDIT.md", f"**{len(school_vocab)} controlled `school_key` groups**", "current-verdict school vocabulary size"),
        ("AUDIT.md", f"**{lineage_registry.get('internal_edges', 0)} edge records + {lineage_registry.get('frontiers', 0)} frontiers**", "current-verdict lineage registry"),
        ("AUDIT.md", f"Glossary: **{len(glossary)} terms**; Gong'an index: **{len(gongan)} entries**", "current-verdict glossary/gong'an counts"),
    ]
    if biyanlu.get("coverage"):
        checks.append(("README.md", biyanlu["coverage"], "Biyanlu coverage string in honest status"))
        checks.append(("AUDIT.md", f"Biyanlu **{biyanlu['coverage']}**", "current-verdict Biyanlu coverage"))
    if wumenguan.get("coverage"):
        checks.append(("AUDIT.md", f"Wumenguan **{wumenguan['coverage']}** represented; W1 source-review status: `partial_or_failed_w1_collation`", "current-verdict Wumenguan containment status"))
    for filename, snippet, description in checks:
        path = ROOT / filename
        if not path.exists():
            issues.error(filename, f"doc truthfulness check cannot run — file missing ({description})")
            continue
        if snippet not in path.read_text(encoding="utf-8"):
            issues.error(
                filename,
                f"doc truthfulness: {description} drifted — expected snippet not found: {snippet!r} "
                f"(update the document, or the check rule in validate_data.py if the prose changed intentionally)",
            )

    validate_w1_doc_claims(metrics, issues)


def validate_w1_doc_claims(metrics: dict[str, Any], issues: Issues) -> None:
    """Current docs must state the merged evidence and must not repeat known-false claims.

    Two failure modes this guards, both of which actually happened here: a superseded figure kept
    circulating as if current (the 2026-09-09 report's 637 flagged entries, which its own register
    never supported), and a witness claim repeated after collation had proved it false (Zhaozhou
    "T1987", which is the Caoshan record). Presence checks pin the truthful sentences to generated
    numbers; absence checks forbid the false ones. Dated files under `sessions/` are historical
    snapshots and are deliberately not scanned.
    """
    w1 = metrics["corpus"].get("source_review") or {}
    if not w1:
        issues.error(rel(METRICS_PATH), "carries no corpus.source_review aggregate to check docs against")
        return
    auth = w1.get("authoritative") or {}
    historical = w1.get("historical") or {}
    superseded = w1.get("superseded") or {}
    ledgers = " · ".join(entry["label"] for entry in w1.get("disclosure_ledgers", []))
    if not ledgers:
        issues.error(rel(METRICS_PATH), "corpus.source_review.disclosure_ledgers is empty")
        return
    ledger_line = f"The Reader keeps **five separate, always-visible ledgers**: {ledgers}."
    evidence_bits = [
        f"**{auth.get('documents')} documents, {auth.get('flagged_entries'):,} flagged source fields**",
        str(auth.get("register_path")),
        str(historical.get("register_path")),
        str(historical.get("evidence_date")),
    ]
    # Docs that must carry the full truthful framing.
    framed = ("README.md", "AUDIT.md", "HANDOFF.md")
    for filename in framed + ("ROADMAP.md", ".orchestrator/REMEDIATION_PLAN.md"):
        path = ROOT / filename
        if not path.exists():
            issues.error(filename, "doc truthfulness: file missing for the W1 ledger rule")
            continue
        text = path.read_text(encoding="utf-8")
        if ledger_line not in text:
            issues.error(filename, f"doc truthfulness: the five-ledger separation sentence is missing or reworded: {ledger_line!r}")
        for snippet in evidence_bits:
            if snippet not in text:
                issues.error(filename, f"doc truthfulness: W1 evidence figure {snippet!r} is missing (it is generated from data/project_metrics.json)")
        if filename in framed:
            for snippet, description in (
                (str(w1.get("status_scope")), "containment-not-rights scope sentence"),
                (str(w1.get("non_approval_statement")), "explicit non-approval-of-reuse sentence"),
                (str(w1.get("metadata_field_note")), "metadata-exclusion caveat for collated_to_claimed_witness"),
            ):
                if snippet not in text:
                    issues.error(filename, f"doc truthfulness: {description} is missing: {snippet!r}")
            # The false Zhaozhou canonical claim must be *explained*, not merely
            # avoided: the document must say T1987 is the Caoshan record.
            if not any("T1987" in line and "caoshan" in line.lower()
                       for line in text.splitlines()):
                issues.error(filename, "doc truthfulness: the document must record that Zhaozhou's claimed "
                                       "witness T1987 is the Caoshan record (the W1 collation found the claim "
                                       "false); an unexplained T1987 is an unqualified false witness claim")
        if filename == "README.md":
            # The honest-status paragraph must keep saying no current document qualifies as
            # a complete selected witness while W1 containment is open.
            if "no current `complete_selected_witness`" not in text:
                issues.error(filename, "doc truthfulness: README must state that no current "
                                       "`complete_selected_witness` item exists after W1 containment; a stale "
                                       "completion claim is exactly what the W1 ledger exists to prevent")
    state = ROOT / ".orchestrator" / "STATE.md"
    if state.exists():
        state_text = state.read_text(encoding="utf-8")
        if str(auth.get("flagged_entries")) not in state_text:
            issues.error(".orchestrator/STATE.md", f"must quote the authoritative W1 flagged total {auth.get('flagged_entries')}")
        if "CORRECTED" not in state_text and "superseded" not in state_text:
            issues.error(".orchestrator/STATE.md", "must say which W1 figure is superseded / which record is corrected")

    scanned = ["README.md", "AUDIT.md", "HANDOFF.md", "ROADMAP.md", "index.html", ".orchestrator/STATE.md"]
    stale = {
        str(superseded.get("report_flagged_total")): "the 2026-09-09 report's flagged-entry total",
        str(historical.get("flagged_entries")): "the historical register's flagged-entry total",
    }
    stale.pop("None", None)
    qualified = ("supersed", "historical", "2026-09-09", "corrected", "not reproduced", "never reproduced", "addendum")
    for filename in scanned:
        path = ROOT / filename
        if not path.exists():
            continue
        prose = path.read_text(encoding="utf-8")
        for lineno, line in enumerate(prose.splitlines(), 1):
            for figure, label in stale.items():
                if figure and figure in line and not any(word in line.lower() for word in qualified):
                    issues.error(
                        filename,
                        f"line {lineno} states {figure} as a current W1 count without labelling it as {label}; "
                        f"the merged registers sum to {auth.get('flagged_entries')}",
                    )
            if "T1987" in line and "false" not in line.lower() and "caoshan" not in line.lower():
                issues.error(
                    filename,
                    f"line {lineno} presents Zhaozhou's T1987 witness claim without recording that the W1 collation "
                    "found it false (T1987 is the Caoshan record); the claim must not be restated as valid",
                )
            if "x68n1315a" in line.lower():
                issues.error(
                    filename,
                    f"line {lineno} uses the unsupported Zhaozhou identifier 'X68n1315A'; the W1 evidence supports "
                    "the Guzunsu yulu work id X68n1315, and an unbacked variant of a canonical identifier is a "
                    "fabricated locator",
                )
            if "of 34 evaluated" in line.lower() and not any(
                word in line.lower() for word in ("2026-09-09", "historical")
            ):
                issues.error(
                    filename,
                    f"line {lineno} states the superseded 'one of 34 evaluated documents' figure as current; the "
                    f"authoritative 2026-09-10 record covers {auth.get('documents')} documents — label any 34-document "
                    "statement as the historical 2026-09-09 register",
                )
        if re.search(r"\d[\d,]{4,}[-\s]*(?:raw\s+bytes|bytes|gzip)", prose):
            issues.error(
                filename,
                "quotes an exact bundle byte count; `scripts/build_data_bundle.py` prints the authoritative number "
                "at build time, so a hand-typed size in prose is stale by construction",
            )
        for phrase in ("rights approved", "approved for reuse", "cleared for redistribution", "rights review complete"):
            if phrase in prose.lower():
                issues.error(filename, f"claims {phrase!r}; W1 source review and rights review are separate and no ledger approves reuse")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--write-metrics",
        action="store_true",
        help="write the deterministic data/project_metrics.json file instead of failing when it is stale",
    )
    parser.add_argument("--quiet", action="store_true", help="only print errors/warnings")
    parser.add_argument(
        "--skip-docs",
        action="store_true",
        help="skip documentation-truthfulness checks (README/HANDOFF/index.html must quote live metrics)",
    )
    args = parser.parse_args()

    issues = Issues()
    schema = load_json(SCHEMA_PATH, issues)
    if is_record(schema):
        if not nonempty_string(schema.get("$schema")) or not is_record(schema.get("$defs")):
            issues.error(rel(SCHEMA_PATH), "must be a JSON Schema document with $schema and $defs")

    corpus: dict[str, Any] = {}
    for path in sorted(CORPUS_DIR.glob("*.json")):
        document = load_json(path, issues)
        if document is not None:
            corpus[path.stem] = document
    if not corpus:
        issues.error(rel(CORPUS_DIR), "contains no corpus JSON files")

    stats: Counter[str] = Counter()
    verified_source_ids: list[str] = []
    for key, document in corpus.items():
        before = len(verified_source_ids)
        validate_corpus_document(key, document, issues, stats, verified_source_ids)
        if len(verified_source_ids) > before:
            # Distinct corpus texts carrying at least one verified quotation —
            # quoted in README/ROADMAP prose and guarded by the doc gate.
            stats["verified_corpus_texts"] += 1

    matrix = load_json(MATRIX_PATH, issues)
    validate_matrix(matrix, issues, stats, verified_source_ids)
    glossary = load_json(DATA_DIR / "glossary" / "chan_terms.json", issues)
    lineage = load_json(DATA_DIR / "lineage" / "masters.json", issues)
    gongan = load_json(DATA_DIR / "gongan" / "gongan_index.json", issues)
    provenance = load_json(PROVENANCE_PATH, issues)
    school_vocab = load_controlled_vocabulary(LINEAGE_SCHOOL_VOCAB_PATH, issues, "schools")
    theme_vocab = load_controlled_vocabulary(GONGAN_THEME_VOCAB_PATH, issues, "themes")
    validate_auxiliary_data(glossary, lineage, gongan, provenance, issues, school_vocab, theme_vocab, corpus_keys=set(corpus.keys()))

    corpus_manifest = load_json(CORPUS_MANIFEST_PATH, issues)
    locator_registry = load_json(LOCATORS_PATH, issues)
    locator_metrics = validate_canonical_locators(corpus, locator_registry, issues)
    rights_manifest = load_json(RIGHTS_PATH, issues)
    rights_metrics = validate_rights_manifest(rights_manifest, verified_source_ids, issues)
    lineage_registry = load_json(LINEAGE_VERIFICATION_PATH, issues)
    lineage_metrics = validate_lineage_verification(lineage, lineage_registry, issues)
    traceability_queue = load_json(TRACEABILITY_QUEUE_PATH, issues)
    traceability_metrics = validate_traceability_queue(corpus, locator_registry, traceability_queue, issues)
    lineage_profile_queue = load_json(LINEAGE_PROFILE_QUEUE_PATH, issues)
    profile_queue_metrics = validate_lineage_profile_queue(lineage, lineage_profile_queue, issues)
    manifest_metrics = validate_manifest_sync(corpus, corpus_manifest, issues)
    w1_aggregates = validate_w1_evidence(corpus_manifest, corpus, issues)

    metrics = compute_metrics(corpus, stats, locator_metrics, rights_metrics, lineage_metrics, traceability_metrics, profile_queue_metrics, manifest_metrics, corpus_manifest, w1_aggregates)
    if not args.skip_docs:
        with issues.nonblocking():
            validate_doc_truthfulness(metrics, glossary, lineage, gongan, school_vocab, issues)
    expected_metrics = canonical_json(metrics)
    if args.write_metrics:
        if issues.blocking_count:
            # Never leave a regenerated metrics file behind that encodes invalid data.
            print(
                f"\n❌ --write-metrics refused: {issues.blocking_count} data error(s) must be fixed first "
                "(see the list below).",
                file=sys.stderr,
            )
        else:
            METRICS_PATH.write_text(expected_metrics, encoding="utf-8")
    elif not METRICS_PATH.exists():
        issues.error(rel(METRICS_PATH), "missing; run scripts/validate_data.py --write-metrics")
    elif METRICS_PATH.read_text(encoding="utf-8") != expected_metrics:
        issues.error(rel(METRICS_PATH), "is stale; run scripts/validate_data.py --write-metrics")

    for warning in issues.warnings:
        print(f"⚠️  {warning}")
    for error in issues.errors:
        print(f"❌ {error}", file=sys.stderr)
    if issues.errors:
        print(f"\nValidation failed with {len(issues.errors)} error(s).", file=sys.stderr)
        return 1

    if not args.quiet:
        print("✅ DATA VALIDATION PASSED")
        print(
            "   corpus={documents} | slots={slots} | verified={verified} | matrix={matrix} | locators={locators}/{cases}".format(
                documents=metrics["corpus"]["documents"],
                slots=metrics["translations"]["corpus_slots"],
                verified=metrics["translations"]["corpus_statuses"]["verified_quotation"],
                matrix=metrics["translations"]["matrix_entries"],
                locators=metrics["canonical_locator_coverage"].get("case_locators", 0),
                cases=metrics["canonical_locator_coverage"].get("declared_cases", 0),
            )
        )
        if args.write_metrics:
            print(f"   wrote {rel(METRICS_PATH)}")
        evidence = metrics["corpus"].get("source_review") or {}
        counts = evidence.get("status_counts") or {}
        if counts:
            print(
                "   W1 source review: collated={collated} | partial/failed={partial} | unavailable={unavailable}"
                " | flagged={flagged} | evidence={date} → {register}".format(
                    collated=counts.get("collated_to_claimed_witness", 0),
                    partial=counts.get("partial_or_failed_w1_collation", 0),
                    unavailable=counts.get("witness_unavailable", 0),
                    flagged=evidence.get("flagged_entries"),
                    date=(evidence.get("authoritative") or {}).get("evidence_date"),
                    register=(evidence.get("authoritative") or {}).get("register_path"),
                )
            )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
