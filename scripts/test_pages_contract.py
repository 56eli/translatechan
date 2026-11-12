#!/usr/bin/env python3
"""Regression tests for the owner-stub Pages contract.

This suite protects the demolition boundary, not a visual design:

* the retired walnut-shell assets and runtime bundle stay deleted;
* ``docs/index.html`` is a byte-identical copy of the root owner stub;
* ``docs/data`` is a byte-identical copy of the authoritative ``data`` tree;
* the stub does not reference retired assets;
* ``scripts/build_pages.py`` is deterministic and removes retired deploy files
  instead of resurrecting them.

Run: python3 scripts/test_pages_contract.py
"""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
failures: list[str] = []
passes: list[str] = []

RETIRED_ROOT_FILES = (
    "app.css",
    "app.js",
    "app_data.js",
    "theme-init.js",
    "og-image.svg",
    "og-image.png",
)
RETIRED_SCRIPTS = (
    "scripts/build_data_bundle.py",
    "scripts/smoke_test.mjs",
    "scripts/compat_runtime_check.mjs",
    "scripts/browser_test.mjs",
    "scripts/update_docs.py",
)
RETIRED_PACKAGE_FILES = ("package.json", "package-lock.json")
RETIRED_DESIGN_DOCS = (
    "WEB_VISION_2026-09-13.md",
    "WEB_VISION_2026-08-10.md",
    "UX_ROADMAP.md",
    ".orchestrator/COMMON_QUALITIES_2026-09-14.md",
    ".orchestrator/RULING_WEBSITE_2026-09-14.md",
    ".orchestrator/BOOKSTACK_WIKI_VISION_2026-09-21.md",
    "docs/STUB_P2.10_GATE_SUITE_REPIN.md",
)
STATIC_FILES = ("index.html", "robots.txt", "sitemap.xml", ".nojekyll")
RETIRED_BANNER = "RETIRED / NON-AUTHORITATIVE (2026-11-12)"


def check(condition: bool, label: str) -> bool:
    if condition:
        passes.append(label)
    else:
        failures.append(label)
    return bool(condition)


def tree_bytes(root: Path) -> dict[str, bytes]:
    return {
        str(path.relative_to(root)): path.read_bytes()
        for path in sorted(root.rglob("*"))
        if path.is_file()
    }


def run_build(root: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(root / "scripts" / "build_pages.py")],
        cwd=root,
        capture_output=True,
        text=True,
        timeout=120,
    )


def main() -> int:
    for name in RETIRED_ROOT_FILES:
        check(not (REPO / name).exists(), f"retired root asset stays deleted: {name}")
        check(not (REPO / "docs" / name).exists(), f"retired deploy asset stays deleted: docs/{name}")
    for name in RETIRED_SCRIPTS:
        check(not (REPO / name).exists(), f"retired legacy gate/build script stays deleted: {name}")
    for name in RETIRED_PACKAGE_FILES:
        check(not (REPO / name).exists(), f"retired npm gate mechanism stays deleted: {name}")

    for path, needle in (
        ("AGENTS.md", "owner-uploaded root `index.html` stub"),
        ("docs/PROJECT_STATE.md", "owner-uploaded root `index.html` stub"),
    ):
        text = (REPO / path).read_text(encoding="utf-8") if (REPO / path).is_file() else ""
        check("Current layout authority" in text and needle in text,
              f"{path} declares the owner stub as current layout authority")
    for path in RETIRED_DESIGN_DOCS:
        text = (REPO / path).read_text(encoding="utf-8") if (REPO / path).is_file() else ""
        check(RETIRED_BANNER in text[:1200], f"retired design spec is labelled non-authoritative: {path}")

    index = REPO / "index.html"
    docs_index = REPO / "docs" / "index.html"
    check(index.is_file(), "root owner stub exists")
    check(docs_index.is_file() and index.read_bytes() == docs_index.read_bytes(),
          "docs/index.html is byte-identical to the root owner stub")

    html = index.read_text(encoding="utf-8") if index.is_file() else ""
    for name in RETIRED_ROOT_FILES:
        check(name not in html, f"owner stub does not reference retired asset {name}")
    check('fetch("data/"' in html, "owner stub fetches the deploy-relative data/ tree")

    for name in STATIC_FILES:
        src = REPO / name
        dst = REPO / "docs" / name
        check(src.is_file(), f"required Pages source file exists: {name}")
        check(src.is_file() and dst.is_file() and src.read_bytes() == dst.read_bytes(),
              f"docs/{name} mirrors root {name}")

    check(tree_bytes(REPO / "data") == tree_bytes(REPO / "docs" / "data"),
          "docs/data is byte-identical to authoritative data/")

    # Determinism and negative resurrection case in a disposable minimal tree.
    with tempfile.TemporaryDirectory(prefix="pages-contract-") as tmp:
        sandbox = Path(tmp)
        (sandbox / "scripts").mkdir()
        shutil.copy2(REPO / "scripts" / "build_pages.py", sandbox / "scripts" / "build_pages.py")
        shutil.copy2(index, sandbox / "index.html")
        for name in STATIC_FILES[1:]:
            if (REPO / name).is_file():
                shutil.copy2(REPO / name, sandbox / name)
        shutil.copytree(REPO / "data", sandbox / "data")
        docs = sandbox / "docs"
        docs.mkdir()
        (docs / "index.html").write_text("retired shell", encoding="utf-8")
        for name in RETIRED_ROOT_FILES:
            (docs / name).write_text("retired", encoding="utf-8")
        (docs / "data").mkdir()
        (docs / "data" / "stale.json").write_text("{}", encoding="utf-8")

        first = run_build(sandbox)
        check(first.returncode == 0, "build_pages.py succeeds in a disposable tree")
        snapshot = tree_bytes(docs)
        second = run_build(sandbox)
        check(second.returncode == 0 and tree_bytes(docs) == snapshot,
              "build_pages.py is deterministic across consecutive runs")
        check((docs / "index.html").read_bytes() == (sandbox / "index.html").read_bytes(),
              "build replaces a stale docs/index.html with the owner stub")
        check(tree_bytes(sandbox / "data") == tree_bytes(docs / "data"),
              "build replaces stale docs/data with the authoritative data tree")
        for name in RETIRED_ROOT_FILES:
            check(not (docs / name).exists(), f"build removes retired deploy file docs/{name}")
        check(not (sandbox / "app_data.js").exists(), "build does not regenerate root app_data.js")

        # Fail-closed negative cases: a missing stub or required crawler file must
        # not silently publish a partial mirror.
        (sandbox / "index.html").unlink()
        missing_stub = run_build(sandbox)
        check(missing_stub.returncode != 0, "build fails when the owner stub is missing")
        shutil.copy2(index, sandbox / "index.html")
        (sandbox / "robots.txt").unlink()
        missing_static = run_build(sandbox)
        check(missing_static.returncode != 0, "build fails when a required Pages static file is missing")

    print(f"\n{len(passes)} Pages contract checks passed")
    if failures:
        print(f"🔴 {len(failures)} failure(s):", file=sys.stderr)
        for label in failures:
            print(f"  ❌ {label}", file=sys.stderr)
        return 1
    print("✅ PAGES CONTRACT OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
