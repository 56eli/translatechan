#!/usr/bin/env python3
"""Migrate legacy bare-string corpus translations to explicit record objects.

Before 2026-08-09, corpus `translations` maps allowed bare strings whose status
was inferred from the register key prefix (`ai_*` => ai_draft, otherwise
reconstruction_unverified). This one-shot codemod converts every such string
into `{"text": <value>, "status": <inferred status>}`, making the disclosure
status self-describing data instead of a key-naming convention. The validator
now rejects new bare strings.

Run from the repository root:
    python3 scripts/migrate_translations.py
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CORPUS_DIR = ROOT / "data" / "corpus"


def infer_status(register: str) -> str:
    return "ai_draft" if register.startswith("ai_") else "reconstruction_unverified"


def migrate_node(node: object) -> int:
    converted = 0
    if isinstance(node, dict):
        translations = node.get("translations")
        if isinstance(translations, dict):
            for register, value in list(translations.items()):
                if isinstance(value, str):
                    translations[register] = {
                        "text": value,
                        "status": infer_status(str(register)),
                    }
                    converted += 1
        for value in node.values():
            converted += migrate_node(value)
    elif isinstance(node, list):
        for value in node:
            converted += migrate_node(value)
    return converted


def main() -> int:
    total = 0
    files = 0
    for path in sorted(CORPUS_DIR.glob("*.json")):
        with path.open("r", encoding="utf-8") as handle:
            document = json.load(handle)
        converted = migrate_node(document)
        if converted:
            with path.open("w", encoding="utf-8") as handle:
                json.dump(document, handle, ensure_ascii=False, indent=2)
                handle.write("\n")
            total += converted
            files += 1
    print(f"Converted {total} legacy string translation(s) across {files} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
