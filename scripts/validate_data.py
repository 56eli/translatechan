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
* generated project_metrics.json matches the live data.

Run normally in CI to verify committed metrics, or pass --write-metrics after a
legitimate data change to regenerate data/project_metrics.json deterministically.
"""

from __future__ import annotations

import argparse
import json
import re
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
PROVENANCE_PATH = DATA_DIR / "translations" / "provenance.json"
MATRIX_PATH = DATA_DIR / "translations" / "comparative_matrix.json"
SCHEMA_PATH = ROOT / "schemas" / "translatechan-data.schema.json"
BUILD_SCRIPT = ROOT / "scripts" / "build_data_bundle.py"
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
CJK_RE = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]")


class Issues:
    """Small error collector so a contributor can fix several data defects at once."""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, path: str, message: str) -> None:
        self.errors.append(f"{path}: {message}")

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
            status = "ai_draft" if str(register).startswith("ai_") else "reconstruction_unverified"
            stats[status] += 1
            continue
        if not is_record(value):
            issues.error(entry_path, "must be a non-empty string or translation object")
            continue
        if not nonempty_string(value.get("text")):
            issues.error(entry_path, "translation object requires non-empty 'text'")
        status = value.get("status")
        if status not in VALID_TRANSLATION_STATUSES:
            issues.error(entry_path, f"has invalid or missing status {status!r}")
            continue
        stats[status] += 1
        if status == "verified_quotation":
            source = value.get("source")
            source_id = validate_source(source, f"{entry_path}.source", issues)
            if source_id:
                verified_source_ids.append(source_id)
            stats["verified_reference_pending" if is_record(source) and source.get("reference") == "Page/section locator pending" else "verified_reference_recorded"] += 1


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
            stats[f"matrix_{status}"] += 1
            stats["matrix_entries"] += 1
            if status == "verified_quotation":
                source = entry.get("source")
                source_id = validate_source(source, f"{entry_path}.source", issues)
                if source_id:
                    verified_source_ids.append(source_id)
                stats["verified_reference_pending" if is_record(source) and source.get("reference") == "Page/section locator pending" else "verified_reference_recorded"] += 1


def validate_auxiliary_data(
    glossary: Any,
    lineage: Any,
    gongan: Any,
    provenance: Any,
    issues: Issues,
) -> None:
    for label, records, fields in (
        ("data/glossary/chan_terms.json", glossary, ("id", "term", "pinyin", "literal", "definition", "category")),
        ("data/lineage/masters.json", lineage, ("id", "name_zh", "name_en", "school", "teacher")),
        ("data/gongan/gongan_index.json", gongan, ("id", "title_zh", "title_en", "collection", "theme")),
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


def validate_manifest_sync(corpus_keys: set[str], manifest: Any, issues: Issues) -> dict[str, int]:
    path = rel(CORPUS_MANIFEST_PATH)
    if not is_record(manifest) or not isinstance(manifest.get("items"), list):
        issues.error(path, "must contain an object with an items list")
        return {}

    if not manifest["items"]:
        issues.error(path, "items list must not be empty")
    manifest_keys: set[str] = set()
    for index, item in enumerate(manifest["items"]):
        item_path = f"{path}.items[{index}]"
        require_fields(item, ("key", "title", "cbeta"), item_path, issues)
        if not is_record(item) or not nonempty_string(item.get("key")):
            continue
        key = item["key"]
        if key in manifest_keys:
            issues.error(item_path, f"duplicate corpus key '{key}'")
        manifest_keys.add(key)

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


def compute_metrics(
    corpus: dict[str, Any],
    stats: Counter[str],
    locator_metrics: dict[str, int],
    rights_metrics: dict[str, int],
    manifest_metrics: dict[str, int],
) -> dict[str, Any]:
    matrix_statuses = {
        status.removeprefix("matrix_"): stats.get(f"matrix_{status}", 0)
        for status in sorted(VALID_TRANSLATION_STATUSES)
    }
    shapes = Counter()
    for document in corpus.values():
        for shape in content_shapes(document):
            shapes[shape] += 1
    complete_documents = [key for key, doc in corpus.items() if key == "wumenguan" and is_record(doc) and len(doc.get("cases", [])) == 48]
    return {
        "schema_version": "1.0",
        "measurement_method": {
            "content_cjk_characters": "CJK code points in source-content zh/_zh fields, excluding title_zh, author_zh, and name_zh metadata.",
            "all_corpus_cjk_characters": "CJK code points across every string in data/corpus JSON files.",
            "translation_slot": "One register value under a translations object; string values use policy defaults and object values use explicit status."
        },
        "corpus": {
            "documents": len(corpus),
            "complete_documents": complete_documents,
            "excerpt_seed_documents": len(corpus) - len(complete_documents),
            "content_cjk_characters": sum(content_cjk_count(doc) for doc in corpus.values()),
            "all_corpus_cjk_characters": sum(all_cjk_count(doc) for doc in corpus.values()),
            "content_shapes": dict(sorted(shapes.items())),
        },
        "translations": {
            "corpus_slots": stats.get("corpus_slots", 0),
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
        "manifest_integrity": manifest_metrics,
    }


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--write-metrics",
        action="store_true",
        help="write the deterministic data/project_metrics.json file instead of failing when it is stale",
    )
    parser.add_argument("--quiet", action="store_true", help="only print errors/warnings")
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
        validate_corpus_document(key, document, issues, stats, verified_source_ids)

    matrix = load_json(MATRIX_PATH, issues)
    validate_matrix(matrix, issues, stats, verified_source_ids)
    glossary = load_json(DATA_DIR / "glossary" / "chan_terms.json", issues)
    lineage = load_json(DATA_DIR / "lineage" / "masters.json", issues)
    gongan = load_json(DATA_DIR / "gongan" / "gongan_index.json", issues)
    provenance = load_json(PROVENANCE_PATH, issues)
    validate_auxiliary_data(glossary, lineage, gongan, provenance, issues)

    corpus_manifest = load_json(CORPUS_MANIFEST_PATH, issues)
    locator_registry = load_json(LOCATORS_PATH, issues)
    locator_metrics = validate_canonical_locators(corpus, locator_registry, issues)
    rights_manifest = load_json(RIGHTS_PATH, issues)
    rights_metrics = validate_rights_manifest(rights_manifest, verified_source_ids, issues)
    manifest_metrics = validate_manifest_sync(set(corpus), corpus_manifest, issues)

    metrics = compute_metrics(corpus, stats, locator_metrics, rights_metrics, manifest_metrics)
    expected_metrics = canonical_json(metrics)
    if args.write_metrics:
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
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
