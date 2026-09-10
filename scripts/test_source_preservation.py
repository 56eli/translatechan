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
* Every corpus difference must be an exact, pre-declared JSON pointer in
  `ALLOWED_CHANGES` for that file. Membership is the pointer, not the leaf key
  name: a `coverage_note` (or `zh`) anywhere else — for instance
  `cases[0].coverage_note` in any of the 48 Wumenguan cases — is a corpus edit
  and fails. The allowlist is remediation-aware:
  - `data/corpus/xinxin_ming.json`: the root `.coverage_note`, the completeness
    claim the W1 containment work re-worded into an honest W1 status disclosure.
  - `data/corpus/wumenguan.json`: the same root `.coverage_note`, plus exactly
    the pointers the owner-adopted R-A/R-B remediation (PR re-keying wumenguan
    to the CBETA T2005 witness per the 2026-09-10 W1 correction register)
    touched: each re-keyed source field and its rewritten sibling pinyin, the
    additive `epilogue.editorial_note` provenance label (project-authored text,
    no witness attribution — the `zh`/`pinyin`/translations stay untouched), and
    the recomputed `zh_chars` total. No other field — in particular no
    unlisted source-Chinese field (`verse_zh`, `title_zh`, `name_zh`, …) and no
    English/translation field — may differ from the base.
* The allowlist is exercised by a focused regression on a temporary copy of the
  tree: a nested `coverage_note` change must exit nonzero and name the exact
  path. The repository's own corpus files are never modified by any check here.
* The set of corpus files must not grow or shrink.
* The `docs/data/corpus` mirror must be byte-identical to `data/corpus`.

Run: python3 scripts/test_source_preservation.py   (exit 0 = preserved)
Also invoked from scripts/smoke_test.mjs so the CI gate covers it without
workflow changes.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from typing import Any
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CORPUS_DIR = ROOT / "data" / "corpus"
DOCS_CORPUS_DIR = ROOT / "docs" / "data" / "corpus"

#: The tree the W1 work started from. Pinned deliberately: the base must not move
#: when the corpus moves. (origin/main at the merge base of the W1 PR.)
BASE_COMMIT = "3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43"

#: Set only for the temporary copy that the nested-`coverage_note` regression runs: the copy
#: then performs the real comparison but not the regression that spawned it. Nothing else sets
#: it, so a normal run — including the smoke test — always runs the focused regression.
NESTED_REGRESSION_MARKER = "PRESERVATION_NESTED_REGRESSION"

#: The only corpus paths the W1 work may have touched: exact JSON pointers, per file. The
#: allowlist is the pointer itself, never the leaf key name — ``.cases[0].coverage_note`` in
#: any of the 48 Wumenguan cases is a *corpus content* change and must fail, even though its
#: final key is spelled the same as the two permitted root notes.
ALLOWED_CHANGES = {
    "data/corpus/wumenguan.json": frozenset({
        # .coverage_note: W1 containment re-wording into an honest status disclosure (prior PR)
        ".coverage_note",
        # 2026-09-10 R-A re-key of the W1-flagged fields to the T2005 witness (62 zh + 62 pinyin),
        # the additive R-B epilogue provenance label, and the recomputed zh_chars total:
        ".cases[0].commentary_pinyin",
        ".cases[0].commentary_zh",
        ".cases[10].dialogue[0].pinyin",
        ".cases[10].dialogue[0].zh",
        ".cases[10].dialogue[1].pinyin",
        ".cases[10].dialogue[1].zh",
        ".cases[11].commentary_pinyin",
        ".cases[11].commentary_zh",
        ".cases[12].dialogue[0].pinyin",
        ".cases[12].dialogue[0].zh",
        ".cases[13].dialogue[0].pinyin",
        ".cases[13].dialogue[0].zh",
        ".cases[13].dialogue[1].pinyin",
        ".cases[13].dialogue[1].zh",
        ".cases[16].verse_pinyin",
        ".cases[16].verse_zh",
        ".cases[17].commentary_pinyin",
        ".cases[17].commentary_zh",
        ".cases[18].commentary_pinyin",
        ".cases[18].commentary_zh",
        ".cases[18].dialogue[0].pinyin",
        ".cases[18].dialogue[0].zh",
        ".cases[18].dialogue[2].pinyin",
        ".cases[18].dialogue[2].zh",
        ".cases[18].dialogue[3].pinyin",
        ".cases[18].dialogue[3].zh",
        ".cases[19].commentary_pinyin",
        ".cases[19].commentary_zh",
        ".cases[19].dialogue[0].pinyin",
        ".cases[19].dialogue[0].zh",
        ".cases[19].verse_pinyin",
        ".cases[19].verse_zh",
        ".cases[1].commentary_pinyin",
        ".cases[1].commentary_zh",
        ".cases[1].dialogue[1].pinyin",
        ".cases[1].dialogue[1].zh",
        ".cases[1].dialogue[2].pinyin",
        ".cases[1].dialogue[2].zh",
        ".cases[20].commentary_pinyin",
        ".cases[20].commentary_zh",
        ".cases[22].commentary_pinyin",
        ".cases[22].commentary_zh",
        ".cases[22].dialogue[0].pinyin",
        ".cases[22].dialogue[0].zh",
        ".cases[22].dialogue[1].pinyin",
        ".cases[22].dialogue[1].zh",
        ".cases[22].dialogue[2].pinyin",
        ".cases[22].dialogue[2].zh",
        ".cases[22].verse_pinyin",
        ".cases[22].verse_zh",
        ".cases[24].verse_pinyin",
        ".cases[24].verse_zh",
        ".cases[26].dialogue[0].pinyin",
        ".cases[26].dialogue[0].zh",
        ".cases[28].commentary_pinyin",
        ".cases[28].commentary_zh",
        ".cases[28].dialogue[0].pinyin",
        ".cases[28].dialogue[0].zh",
        ".cases[28].dialogue[1].pinyin",
        ".cases[28].dialogue[1].zh",
        ".cases[28].verse_pinyin",
        ".cases[28].verse_zh",
        ".cases[29].verse_pinyin",
        ".cases[29].verse_zh",
        ".cases[2].commentary_pinyin",
        ".cases[2].commentary_zh",
        ".cases[2].dialogue[0].pinyin",
        ".cases[2].dialogue[0].zh",
        ".cases[2].dialogue[1].pinyin",
        ".cases[2].dialogue[1].zh",
        ".cases[2].verse_pinyin",
        ".cases[2].verse_zh",
        ".cases[31].dialogue[0].pinyin",
        ".cases[31].dialogue[0].zh",
        ".cases[31].dialogue[1].pinyin",
        ".cases[31].dialogue[1].zh",
        ".cases[32].verse_pinyin",
        ".cases[32].verse_zh",
        ".cases[34].commentary_pinyin",
        ".cases[34].commentary_zh",
        ".cases[36].verse_pinyin",
        ".cases[36].verse_zh",
        ".cases[39].commentary_pinyin",
        ".cases[39].commentary_zh",
        ".cases[39].dialogue[1].pinyin",
        ".cases[39].dialogue[1].zh",
        ".cases[39].verse_pinyin",
        ".cases[39].verse_zh",
        ".cases[3].commentary_pinyin",
        ".cases[3].commentary_zh",
        ".cases[3].dialogue[0].pinyin",
        ".cases[3].dialogue[0].zh",
        ".cases[3].verse_pinyin",
        ".cases[3].verse_zh",
        ".cases[43].verse_pinyin",
        ".cases[43].verse_zh",
        ".cases[45].verse_pinyin",
        ".cases[45].verse_zh",
        ".cases[46].commentary_pinyin",
        ".cases[46].commentary_zh",
        ".cases[46].verse_pinyin",
        ".cases[46].verse_zh",
        ".cases[47].commentary_pinyin",
        ".cases[47].commentary_zh",
        ".cases[47].dialogue[1].pinyin",
        ".cases[47].dialogue[1].zh",
        ".cases[4].commentary_pinyin",
        ".cases[4].commentary_zh",
        ".cases[4].dialogue[0].pinyin",
        ".cases[4].dialogue[0].zh",
        ".cases[4].verse_pinyin",
        ".cases[4].verse_zh",
        ".cases[5].commentary_pinyin",
        ".cases[5].commentary_zh",
        ".cases[5].dialogue[0].pinyin",
        ".cases[5].dialogue[0].zh",
        ".cases[5].verse_pinyin",
        ".cases[5].verse_zh",
        ".cases[6].dialogue[0].pinyin",
        ".cases[6].dialogue[0].zh",
        ".cases[9].verse_pinyin",
        ".cases[9].verse_zh",
        ".epilogue.editorial_note",
        ".preface.pinyin",
        ".preface.zh",
        ".zh_chars",
    }),
    "data/corpus/xinxin_ming.json": frozenset({".coverage_note"}),
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


def classify_changes(rel: str, diffs: list[str]) -> tuple[list[str], list[str]]:
    """Split one file's changed JSON pointers into (permitted, unauthorized).

    Membership is exact-pointer membership in `ALLOWED_CHANGES`. Matching the leaf key name
    instead is what used to let `data/corpus/wumenguan.json.cases[0].coverage_note` through:
    the same final key is a permitted disclosure at the document root and an unauthorized
    corpus edit anywhere below it.
    """
    allowed = ALLOWED_CHANGES.get(rel, frozenset())
    permitted = [pointer for pointer in diffs if pointer in allowed]
    unauthorized = [pointer for pointer in diffs if pointer not in allowed]
    return permitted, unauthorized


def focused_allowlist_regression() -> list[str]:
    """Prove the allowlist is exact: a nested `coverage_note` change must fail, by exact path.

    Two levels, both on throwaway copies — the repository's corpus files are never touched:

    * the classifier the real comparison uses, on a synthetic nested change, must report
      `.cases[0].coverage_note` as unauthorized and permit nothing;
    * the script itself, run in a temporary copy of the tree with a nested
      `cases[0].coverage_note` added to `data/corpus/wumenguan.json`, must exit nonzero and
      name that exact pointer, while the same copy unmutated must exit zero.
    """
    problems: list[str] = []

    base_doc = {"coverage_note": "before", "cases": [{"coverage_note": "case note", "zh": "一二三四"}]}
    nested_doc = {"coverage_note": "before", "cases": [{"coverage_note": "reworded", "zh": "一二三四"}]}
    diffs: list[str] = []
    deep_diff(base_doc, nested_doc, [], diffs)
    permitted, unauthorized = classify_changes("data/corpus/wumenguan.json", diffs)
    if permitted:
        problems.append(f"nested coverage_note change was permitted: {permitted}")
    if ".cases[0].coverage_note" not in unauthorized:
        problems.append("nested coverage_note change did not report the exact path "
                        f".cases[0].coverage_note (reported: {unauthorized or 'nothing'})")
    for rel in sorted(ALLOWED_CHANGES):
        permitted, unauthorized = classify_changes(rel, list(ALLOWED_CHANGES[rel]))
        if sorted(permitted) != sorted(ALLOWED_CHANGES[rel]) or unauthorized:
            problems.append(f"{rel}: an ALLOWED_CHANGES pointer was not recognised as permitted")
        permitted, unauthorized = classify_changes(rel, [".cases[0].coverage_note"])
        if permitted or ".cases[0].coverage_note" not in unauthorized:
            problems.append(f"{rel}: nested coverage_note change was not reported as unauthorized")

    sandbox = Path(tempfile.mkdtemp(prefix="preservation-nested-"))
    try:
        # Only what the comparison reads: the git objects (for the pinned base), the script,
        # the corpus, and the deploy mirror.
        for piece in (".git", "scripts", "data/corpus", "docs/data/corpus"):
            source = ROOT / piece
            if not source.exists():
                return problems + [f"nested-path regression: cannot copy {piece} into the temporary tree"]
            shutil.copytree(source, sandbox / piece, symlinks=True,
                            ignore=shutil.ignore_patterns("__pycache__", ".pytest_cache"))

        def run_in_sandbox() -> subprocess.CompletedProcess[str]:
            # NESTED_REGRESSION_MARKER tells the copied script it is the subject of this check:
            # without it the copy would copy and run itself again, forever. The marker is only
            # ever set here, so a normal run (and CI) always executes the full regression.
            env = dict(os.environ, **{NESTED_REGRESSION_MARKER: "1"})
            return subprocess.run([sys.executable, str(sandbox / "scripts" / "test_source_preservation.py")],
                                  cwd=sandbox, capture_output=True, text=True, timeout=600, env=env)

        clean = run_in_sandbox()
        if clean.returncode != 0:
            problems.append("the temporary copy fails before any mutation, so it cannot prove "
                            f"the nested change is what fails: {clean.stdout[-400:]}{clean.stderr[-400:]}")

        mutated = sandbox / "data" / "corpus" / "wumenguan.json"
        document = json.loads(mutated.read_text(encoding="utf-8"))
        document["cases"][0]["coverage_note"] = "unauthorized nested note"
        mutated.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        result = run_in_sandbox()
        output = result.stdout + result.stderr
        if result.returncode == 0:
            problems.append("nested coverage_note change passed the temporary-copy run")
        if ".cases[0].coverage_note" not in output:
            problems.append("nested coverage_note failure did not name the exact path "
                            ".cases[0].coverage_note in a temporary copy of the tree")
        if "0 unauthorized changes" in output:
            problems.append("nested coverage_note change was counted as authorized")
        print(f"Focused allowlist regression: unmutated copy exit={clean.returncode}, "
              f"nested coverage_note rejected (exit={result.returncode}) with the exact path reported")
    finally:
        shutil.rmtree(sandbox, ignore_errors=True)
    return problems


def main() -> int:
    if os.environ.get(NESTED_REGRESSION_MARKER):
        failures: list[str] = []
        print("nested-regression copy: focused self-test skipped, corpus comparison still enforced")
    else:
        failures = [f"focused allowlist regression: {line}" for line in focused_allowlist_regression()]
    changes: dict[str, dict[str, list[str]]] = {}

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
        permitted, unauthorized = classify_changes(rel, diffs)
        changes[rel] = {"permitted": permitted, "unauthorized": unauthorized}
        for pointer in unauthorized:
            failures.append(
                f"{rel}{pointer} differs from base commit {BASE_COMMIT[:12]} "
                f"(base: {json_get(base_doc, pointer)!r}, now: {json_get(current_doc, pointer)!r}); "
                "only the declared coverage_note fields may change, and no source-Chinese field may"
            )
    for rel in sorted(changes):
        permitted = changes[rel]["permitted"]
        if permitted:
            print(f"  ℹ️  {rel}: permitted allowlisted change: {', '.join(permitted)}")

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

    compared = len(base_files & current_files)
    permitted_total = sum(len(changes[rel]["permitted"]) for rel in changes)
    unauthorized_total = sum(len(changes[rel]["unauthorized"]) for rel in changes)
    print(f"{compared} corpus files compared")
    print(f"{permitted_total} permitted allowlisted changes")
    print(f"{unauthorized_total} unauthorized changes")

    if failures:
        print(f"🔴 source preservation FAILED: {len(failures)} problem(s):")
        for line in failures:
            print(f"  ❌ {line}")
        return 1

    print(f"✅ SOURCE-PRESERVATION OK: {compared} corpus files match base commit "
          f"{BASE_COMMIT[:12]} ({BASE_COMMIT}) apart from the allowlisted remediation pointers; "
          "0 unauthorized changes")
    return 0


def json_get(doc: Any, pointer: str) -> Any:
    """The value at `pointer`, or a readable placeholder when the pointer is absent.

    An added key (a pointer present in one version only) must produce a report, not a
    traceback: the failure message is the thing that tells a reviewer which path moved.
    """
    node = doc
    rest = pointer.lstrip(".")
    try:
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
    except (KeyError, IndexError, TypeError):
        return "<absent in this version>"
    return node


if __name__ == "__main__":
    raise SystemExit(main())
