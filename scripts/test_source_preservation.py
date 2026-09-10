#!/usr/bin/env python3
"""Source-Chinese preservation test for the active corpus.

The W1 containment and correction work must not alter a single character of the
corpus source-Chinese fields. This test compares every `data/corpus/*.json` file
against an *explicit base commit* (pinned below — a commit, not a mutable fixture)
and reports the exact changed paths.

Rules
-----
* The base is `BASE_COMMIT`: the tree the W1 work started from (`origin/main`
  before the W1 containment PR). It is fetched on demand when the local clone
  does not contain the object (shallow CI checkouts); if it cannot be fetched the
  test fails instead of skipping.
* The only permitted corpus differences are the `coverage_note` fields of the two
  flagship texts (`wumenguan`, `xinxin_ming`) that the W1 containment work
  re-worded from a completeness claim into an honest W1 status disclosure. Every
  other field — in particular every source-Chinese field (`zh`, `verse_zh`,
  `title_zh`, `name_zh`, …) — must be byte-identical to the base.
* The set of corpus files must not grow or shrink.
* The `docs/data/corpus` mirror must be byte-identical to `data/corpus`.

Run: python3 scripts/test_source_preservation.py   (exit 0 = preserved)
Also invoked from scripts/smoke_test.mjs so the CI gate covers it without
workflow changes.
"""

from __future__ import annotations

import json
import subprocess
import sys
from typing import Any
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CORPUS_DIR = ROOT / "data" / "corpus"
DOCS_CORPUS_DIR = ROOT / "docs" / "data" / "corpus"

#: The tree the W1 work started from. Pinned deliberately: the base must not move
#: when the corpus moves. (origin/main at the merge base of the W1 PR.)
BASE_COMMIT = "3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43"

#: The only corpus fields the W1 work may have touched, and in which files.
ALLOWED_CHANGES = {
    "data/corpus/wumenguan.json": frozenset({"coverage_note"}),
    "data/corpus/xinxin_ming.json": frozenset({"coverage_note"}),
}


def run_git(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["git", "-C", str(ROOT), *args], capture_output=True, text=True)


def base_object_available() -> bool:
    return run_git("cat-file", "-e", f"{BASE_COMMIT}^{{commit}}").returncode == 0


def ensure_base_commit() -> str | None:
    """Return a usable base ref, fetching the pinned commit when the clone is shallow."""
    if base_object_available():
        return BASE_COMMIT
    # GitHub (and most servers) serve full reachable SHAs even from a shallow clone.
    result = run_git("fetch", "--depth", "1", "origin", BASE_COMMIT)
    if result.returncode != 0 or not base_object_available():
        return None
    return BASE_COMMIT


def base_file_listing(base_ref: str) -> set[str] | None:
    result = run_git("ls-tree", "--name-only", "-r", base_ref, "--", "data/corpus")
    if result.returncode != 0:
        return None
    return {line for line in result.stdout.splitlines() if line.endswith(".json")}


def base_file_bytes(base_ref: str, rel_path: str) -> bytes | None:
    result = run_git("show", f"{base_ref}:{rel_path}")
    if result.returncode != 0:
        return None
    return result.stdout.encode("utf-8")


def json_pointer(path_parts: list[str | int]) -> str:
    out = ""
    for part in path_parts:
        if isinstance(part, int):
            out += f"[{part}]"
        else:
            out += f".{part}"
    return out or "(root)"


def deep_diff(base: Any, current: Any, parts: list[str | int], out: list[str]) -> None:
    """Collect dotted/bracketed paths where base and current differ (structure or value)."""
    if type(base) is not type(current):
        out.append(json_pointer(parts))
        return
    if isinstance(base, dict):
        for key in sorted(set(base) | set(current), key=str):
            if key not in base or key not in current:
                out.append(json_pointer(parts + [key]))
            else:
                deep_diff(base[key], current[key], parts + [key], out)
    elif isinstance(base, list):
        for index in range(max(len(base), len(current))):
            if index >= len(base) or index >= len(current):
                out.append(json_pointer(parts + [index]))
            else:
                deep_diff(base[index], current[index], parts + [index], out)
    else:
        if base != current:
            out.append(json_pointer(parts))


def main() -> int:
    failures: list[str] = []
    changes: dict[str, list[str]] = {}

    base_ref = ensure_base_commit()
    if base_ref is None:
        print(f"🔴 source preservation FAILED: base commit {BASE_COMMIT} is not present in the clone "
              "and could not be fetched from origin; the corpus cannot be checked against its base. "
              "A missing base is a failure, not a skip — the base is an explicit commit, not a fixture.")
        return 1

    base_files = base_file_listing(base_ref)
    if base_files is None:
        print(f"🔴 source preservation FAILED: cannot list data/corpus at base commit {BASE_COMMIT}")
        return 1

    current_files = {f"data/corpus/{path.name}" for path in CORPUS_DIR.glob("*.json")}
    for rel in sorted(base_files - current_files):
        failures.append(f"corpus file {rel} exists at the base commit but is missing from the working tree "
                        "(corpus files are never deleted by W1 work)")
    for rel in sorted(current_files - base_files):
        failures.append(f"corpus file {rel} is new since the base commit "
                        "(corpus expansion is out of scope for W1 work)")

    for rel in sorted(base_files & current_files):
        base_bytes = base_file_bytes(base_ref, rel)
        if base_bytes is None:
            failures.append(f"cannot read {rel} at base commit {BASE_COMMIT}")
            continue
        current_bytes = (CORPUS_DIR / Path(rel).name).read_bytes()
        if base_bytes == current_bytes:
            continue
        try:
            base_doc = json.loads(base_bytes.decode("utf-8"))
            current_doc = json.loads(current_bytes.decode("utf-8"))
        except json.JSONDecodeError as exc:
            failures.append(f"{rel} is no longer valid JSON: {exc}")
            continue
        diffs: list[str] = []
        deep_diff(base_doc, current_doc, [], diffs)
        if not diffs:
            # Same JSON, different bytes: formatting was touched. Allow nothing.
            failures.append(f"{rel}: whitespace/formatting differs from the base commit")
            continue
        allowed = ALLOWED_CHANGES.get(rel, frozenset())
        for pointer in diffs:
            leaf = pointer.rsplit(".", 1)[-1].split("[", 1)[0]
            changes.setdefault(rel, []).append(pointer)
            if leaf not in allowed:
                failures.append(
                    f"{rel}{pointer} differs from base commit {BASE_COMMIT[:12]} "
                    f"(base: {json_get(base_doc, pointer)!r}, now: {json_get(current_doc, pointer)!r}); "
                    "only the declared coverage_note fields may change, and no source-Chinese field may"
                )
    for rel in sorted(changes):
        allowed = ALLOWED_CHANGES.get(rel, frozenset())
        permitted = [p for p in changes[rel]
                     if p.rsplit(".", 1)[-1].split("[", 1)[0] in allowed]
        if permitted:
            print(f"  ℹ️  {rel}: permitted coverage_note change: {', '.join(permitted)}")

    # The docs/ mirror is part of the shipped bundle: it must not drift from the
    # working corpus either.
    for path in sorted(CORPUS_DIR.glob("*.json")):
        mirror = DOCS_CORPUS_DIR / path.name
        if not mirror.is_file():
            failures.append(f"docs/data/corpus/{path.name} is missing from the deploy mirror")
            continue
        if mirror.read_bytes() != path.read_bytes():
            failures.append(f"docs/data/corpus/{path.name} differs from data/corpus/{path.name}; "
                            "rebuild with scripts/build_data_bundle.py")

    if failures:
        print(f"🔴 source preservation FAILED: {len(failures)} problem(s):")
        for line in failures:
            print(f"  ❌ {line}")
        return 1

    compared = len(base_files & current_files)
    print(f"✅ SOURCE-PRESERVATION OK: {compared} corpus files byte-compared against base commit "
          f"{BASE_COMMIT[:12]} ({BASE_COMMIT}); permitted coverage_note changes: "
          f"{sum(1 for rel in ALLOWED_CHANGES if rel in changes) or 'none found'}")
    return 0


def json_get(doc: Any, pointer: str) -> Any:
    node = doc
    rest = pointer.lstrip(".")
    while rest:
        if rest.startswith("["):
            index = int(rest[1:rest.index("]")])
            rest = rest[rest.index("]") + 1:].lstrip(".")
            node = node[index]
        else:
            dot = rest.find(".")
            bracket = rest.find("[")
            end = min(x for x in (dot, bracket, len(rest)) if x != -1)
            key = rest[:end]
            rest = rest[end:]
            node = node[key]
    return node


if __name__ == "__main__":
    raise SystemExit(main())
