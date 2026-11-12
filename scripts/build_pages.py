#!/usr/bin/env python3
"""Synchronize the owner-stub GitHub Pages artifact.

The public layout authority is the repository-root ``index.html`` uploaded by
the owner. This script does not compile a JavaScript data bundle, inject a
shell, restyle the page, or copy retired frontend assets. It publishes the
stub unchanged together with the authoritative JSON tree and crawler files.

Run ``scripts/validate_data.py`` before this command when editing source data.
CI rebuilds and requires the committed ``docs/`` mirror to be byte-identical.
"""

from __future__ import annotations

import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DOCS_DIR = BASE_DIR / "docs"

# Allowlist: only the owner stub, crawler files, and the JSON data tree publish.
STATIC_FILES = ("index.html", "robots.txt", "sitemap.xml", ".nojekyll")

# Retired legacy layout/runtime artifacts. The build actively removes these
# from the deploy mirror so an old checkout cannot resurrect the walnut shell.
RETIRED_DEPLOY_FILES = (
    "app.css",
    "app.js",
    "app_data.js",
    "theme-init.js",
    "og-image.svg",
    "og-image.png",
)


def main() -> None:
    if not (BASE_DIR / "index.html").is_file():
        raise FileNotFoundError("missing owner-stub index.html at repository root")
    if not DATA_DIR.is_dir():
        raise FileNotFoundError("missing authoritative data/ tree")

    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    for name in RETIRED_DEPLOY_FILES:
        (DOCS_DIR / name).unlink(missing_ok=True)

    for name in STATIC_FILES:
        src = BASE_DIR / name
        if not src.is_file():
            raise FileNotFoundError(f"missing required Pages source file: {name}")
        shutil.copy2(src, DOCS_DIR / name)

    docs_data = DOCS_DIR / "data"
    shutil.rmtree(docs_data, ignore_errors=True)
    shutil.copytree(DATA_DIR, docs_data)

    print("✅ Published owner-stub index.html and authoritative data/ into docs/")
    print("✅ Retired legacy layout/runtime artifacts are absent from the deploy mirror")


if __name__ == "__main__":
    main()
