#!/usr/bin/env python3
"""Build the TranslateChan browser bundle and synchronize GitHub Pages assets.

The ordered corpus manifest in data/corpus_manifest.json is the single source of
truth for both the bundle and the reader navigation.  Run
scripts/validate_data.py before this command when editing source data; CI enforces
that the generated metrics and deploy artifacts are committed.

Synchronization contract (verified by `diff -rq data docs/data` after each run):
  app assets (index.html, app.css, app.js, app_data.js) are copied byte-for-byte,
  and the data/ directory tree is mirrored into docs/data/.
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DOCS_DIR = BASE_DIR / "docs"
OUTPUT_FILE = BASE_DIR / "app_data.js"
DOCS_OUTPUT_FILE = DOCS_DIR / "app_data.js"
CORPUS_MANIFEST_FILE = DATA_DIR / "corpus_manifest.json"


def load_json(filepath: Path) -> Any:
    with filepath.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_corpus_manifest() -> tuple[dict[str, Any], list[dict[str, Any]]]:
    manifest = load_json(CORPUS_MANIFEST_FILE)
    if not isinstance(manifest, dict) or not isinstance(manifest.get("items"), list):
        raise ValueError(f"{CORPUS_MANIFEST_FILE} must contain an object with an items list")
    items = manifest["items"]
    seen: set[str] = set()
    for index, item in enumerate(items):
        if not isinstance(item, dict) or not isinstance(item.get("key"), str) or not item["key"]:
            raise ValueError(f"corpus_manifest.items[{index}] requires a non-empty key")
        key = item["key"]
        if key in seen:
            raise ValueError(f"corpus_manifest contains duplicate key: {key}")
        seen.add(key)
    return manifest, items


def load_corpus(items: list[dict[str, Any]]) -> dict[str, Any]:
    corpus: dict[str, Any] = {}
    for item in items:
        key = item["key"]
        corpus_path = DATA_DIR / "corpus" / f"{key}.json"
        if not corpus_path.exists():
            raise FileNotFoundError(f"manifest key '{key}' has no source file: {corpus_path}")
        corpus[key] = load_json(corpus_path)
    return corpus


def main() -> None:
    print("Bundling TranslateChan Classical Corpus...")
    corpus_manifest, corpus_items = load_corpus_manifest()
    corpus = load_corpus(corpus_items)

    data_bundle = {
        "glossary": load_json(DATA_DIR / "glossary" / "chan_terms.json"),
        "lineage": load_json(DATA_DIR / "lineage" / "masters.json"),
        "lineage_verification": load_json(DATA_DIR / "lineage" / "lineage_verification.json"),
        "lineage_school_vocab": load_json(DATA_DIR / "lineage" / "school_vocabulary.json"),
        "translations_matrix": load_json(DATA_DIR / "translations" / "comparative_matrix.json"),
        "translations_provenance": load_json(DATA_DIR / "translations" / "provenance.json"),
        "translations_rights": load_json(DATA_DIR / "translations" / "rights_manifest.json"),
        "canonical_locators": load_json(DATA_DIR / "canonical_locators.json"),
        "project_metrics": load_json(DATA_DIR / "project_metrics.json"),
        "gongan_index": load_json(DATA_DIR / "gongan" / "gongan_index.json"),
        "corpus_manifest": corpus_manifest,
        "corpus": corpus,
        "meta": {
            "version": "1.1.0",
            "project": "TranslateChan",
            "license": "CC-BY-SA 4.0 / MIT (third-party quotation exceptions apply)",
            "cbeta_sources": ["T47", "T48", "T51", "X-Series"],
            "data_contract": "schemas/translatechan-data.schema.json",
        },
    }

    js_content = (
        "// Auto-generated TranslateChan Master Corpus Bundle\n"
        f"window.TRANSLATECHAN_DATA = {json.dumps(data_bundle, ensure_ascii=False, indent=2)};\n"
    )

    OUTPUT_FILE.write_text(js_content, encoding="utf-8")
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    DOCS_OUTPUT_FILE.write_text(js_content, encoding="utf-8")

    for item in ("index.html", "app.css", "app.js"):
        src_path = BASE_DIR / item
        if src_path.exists():
            shutil.copy2(src_path, DOCS_DIR / item)

    docs_data = DOCS_DIR / "data"
    shutil.rmtree(docs_data, ignore_errors=True)
    shutil.copytree(DATA_DIR, docs_data)

    print(f"✅ Successfully compiled {len(corpus)} corpus documents: {OUTPUT_FILE} ({OUTPUT_FILE.stat().st_size:,} bytes)")
    print(f"✅ Successfully synchronized /docs for GitHub Pages deployment: {DOCS_DIR} (incl. data/ mirror)")


if __name__ == "__main__":
    main()
