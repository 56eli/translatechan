#!/usr/bin/env python3
"""Regression tests for the W1 source-review contract (statuses, evidence, metrics).

Run: python3 scripts/test_source_review_rules.py
(also invoked from scripts/smoke_test.mjs, because the CI workflows run only the node
smoke test for this repo.)

Every case mutates a *copy* of the repository inputs in a temp directory, so the real
`data/` tree is never touched, and asserts what `scripts/validate_data.py` must refuse.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import source_review

REPO = Path(__file__).resolve().parent.parent
failures: list[str] = []
passes: list[str] = []


def check(condition: bool, label: str) -> bool:
    if condition:
        passes.append(label)
    else:
        failures.append(label)
    return bool(condition)


class Sandbox:
    """A minimal repo copy with mutable inputs; validation runs against the copy."""

    def __init__(self, label: str) -> None:
        self.root = Path(tempfile.mkdtemp(prefix=f"w1-{label}-"))
        # Copy the repository (minus VCS, the built bundle, and the Pages mirror) so the
        # validator sees a real tree: it reads the docs it guards and the build script it
        # quotes. Nothing is mutated in the working copy.
        shutil.copytree(
            REPO, self.root, symlinks=True, dirs_exist_ok=True,
            ignore=shutil.ignore_patterns(".git", "docs", "app_data.js", "node_modules", "__pycache__", ".pytest_cache"),
        )

    def read(self, relative: str):
        return json.loads((self.root / relative).read_text(encoding="utf-8"))

    def write(self, relative: str, payload) -> None:
        text = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
        (self.root / relative).write_text(text, encoding="utf-8")

    def mutate_manifest(self, transform) -> None:
        manifest = self.read("data/corpus_manifest.json")
        transform(manifest)
        self.write("data/corpus_manifest.json", manifest)

    def mutate_register(self, relative: str, transform) -> None:
        register = self.read(relative)
        transform(register)
        self.write(relative, register)

    def run(self, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(self.root / "scripts" / "validate_data.py"), "--skip-docs", *args],
            cwd=self.root, capture_output=True, text=True, timeout=600,
        )

    def cleanup(self) -> None:
        shutil.rmtree(self.root, ignore_errors=True)


def main() -> int:
    # 1. the shipped inputs must validate, and their aggregates must equal the evidence
    baseline = Sandbox("baseline")
    try:
        result = baseline.run()
        check(result.returncode == 0, "baseline copy validates cleanly")
        if result.returncode != 0:
            print(result.stdout[-4000:])
            print(result.stderr[-4000:], file=sys.stderr)
        metrics = baseline.read("data/project_metrics.json")
        evidence = metrics["corpus"]["source_review"]
        registers = [
            baseline.read("sessions/COLLATION_REGISTER_2026-09-09.json"),
            baseline.read("sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json"),
        ]
        authoritative = registers[1]["documents"]
        derived = {key: source_review.derive_status(entry) for key, entry in authoritative.items()}
        recomputed = source_review.status_counts(derived.values())
        check(evidence["status_counts"] == recomputed,
              f"metrics status counts {evidence['status_counts']} equal evidence-derived {recomputed}")
        check(evidence["flagged_entries"] == source_review.flagged_total(authoritative),
              "metrics flagged_entries equals the sum of register flagged arrays")
        check(metrics["corpus"]["completion_statuses"] and metrics["corpus"]["complete_documents"] == [],
              "no document is reported complete while W1 containment is open")
        check(all(entry["is_complete"] is False for entry in metrics["corpus"]["per_text"].values()),
              "every per_text entry is_complete=false under the shared rule")
        check(evidence["completion_compatibility"] == source_review.completion_compatibility_matrix(),
              "published completion-compatibility table equals the shared rule")
        check(source_review.SOURCE_REVIEW_STATUS_LABELS.get(source_review.UNAVAILABLE_STATUS, "").startswith("Witness unavailable"),
              "unavailable status label stays non-boosting")
    finally:
        baseline.cleanup()

    # 2. a complete_selected_witness claim on an uncollated witness must fail everywhere
    conflict = Sandbox("conflict")
    try:
        before = (conflict.root / "data" / "project_metrics.json").read_text(encoding="utf-8")

        def mark_complete(manifest):
            for item in manifest["items"]:
                if item.get("key") == "wumenguan":
                    item["completion_status"] = "complete_selected_witness"

        conflict.mutate_manifest(mark_complete)
        result = conflict.run("--write-metrics")
        combined = result.stdout + result.stderr
        check(result.returncode != 0, "manifest mutation to complete_selected_witness fails validation")
        check("requires source_review_status='collated_to_claimed_witness'" in combined or
              "not representable with source_review_status" in combined,
              "the failure names the completion/source-review rule")
        after = (conflict.root / "data" / "project_metrics.json").read_text(encoding="utf-8")
        check(after == before, "--write-metrics writes nothing when the data is invalid")
    finally:
        conflict.cleanup()

    # 3. a status with no evidence record must fail, in both directions
    no_evidence = Sandbox("no-evidence")
    try:
        def drop_shitou(register):
            register["documents"].pop("shitou_sandokai", None)

        no_evidence.mutate_register("sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json", drop_shitou)
        result = no_evidence.run()
        combined = result.stdout + result.stderr
        check(result.returncode != 0, "removing the only evidence entry for a manifest item fails validation")
        check("no evidence record" in combined, "the failure says the status has no evidence record")
        check("shitou_sandokai" in combined, "the failure names the affected document")
    finally:
        no_evidence.cleanup()

    # 4. editing a status without editing the evidence must fail
    mismatch = Sandbox("mismatch")
    try:
        def upgrade(manifest):
            for item in manifest["items"]:
                if item.get("key") == "wumenguan":
                    item["source_review_status"] = source_review.COLLATED_STATUS

        mismatch.mutate_manifest(upgrade)
        result = mismatch.run()
        combined = result.stdout + result.stderr
        check(result.returncode != 0, "declaring collated_to_claimed_witness against failing evidence fails")
        check("derives" in combined, "the failure reports the status derived from evidence")
    finally:
        mismatch.cleanup()

    # 5. an evidence entry with no manifest item must fail (register/manifest drift)
    orphan = Sandbox("orphan")
    try:
        def drop_item(manifest):
            manifest["items"] = [item for item in manifest["items"] if item.get("key") != "shitou_sandokai"]

        orphan.mutate_manifest(drop_item)
        result = orphan.run()
        combined = result.stdout + result.stderr
        check(result.returncode != 0, "a register entry with no manifest item fails validation")
        check("no such item" in combined, "the failure names the orphaned evidence key")
    finally:
        orphan.cleanup()

    # 6. evidence dates must match the dated records, not just each other
    dates = Sandbox("dates")
    try:
        def redate(manifest):
            manifest["source_review"]["correction_evidence_date"] = "2026-09-11"

        dates.mutate_manifest(redate)
        result = dates.run()
        combined = result.stdout + result.stderr
        check(result.returncode != 0, "an evidence date that contradicts the dated files fails validation")
        check("does not match the date carried by" in combined, "the failure points at the filename mismatch")
    finally:
        dates.cleanup()

    # 7. a register aggregate that disagrees with its own documents must fail
    arithmetic = Sandbox("arithmetic")
    try:
        def inflate(register):
            register["aggregate"]["flagged_entries"] = register["aggregate"]["flagged_entries"] + 5

        arithmetic.mutate_register("sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json", inflate)
        result = arithmetic.run()
        combined = result.stdout + result.stderr
        check(result.returncode != 0, "a hand-edited register aggregate fails validation")
        check("recomputing" in combined, "the failure shows the recomputed arithmetic")
    finally:
        arithmetic.cleanup()

    # 8. the compatibility rule is one rule: no complete mark without collation, in either order
    matrix = source_review.completion_compatibility_matrix()
    check(matrix["complete_selected_witness"][source_review.COLLATED_STATUS] is True
          and matrix["complete_selected_witness"][source_review.PARTIAL_STATUS] is False
          and matrix["complete_selected_witness"][source_review.UNAVAILABLE_STATUS] is False,
          "compatibility rule allows complete only for collated_to_claimed_witness")
    check(all(row[source_review.PARTIAL_STATUS] is True and row[source_review.UNAVAILABLE_STATUS] is True
              for status, row in matrix.items() if status != "complete_selected_witness"),
          "the rule restricts only the complete claim, so containment cannot silently downgrade partial states")
    check(source_review.effective_completion_status("complete_selected_witness", source_review.PARTIAL_STATUS)
          == "partial_selected_witness",
          "incompatible runtime claims degrade to partial instead of rendering as complete")

    # 9. the five ledgers exist, are named once, and the runtime mirrors them
    app_src = (REPO / "app.js").read_text(encoding="utf-8")
    for key, label in source_review.DISCLOSURE_LEDGERS:
        check(f"'{key}'" in app_src or f'"{key}"' in app_src, f"app.js renders the {key} ledger")
        check(label in app_src or key == "rights_review", f"app.js carries the {label!r} ledger label")
    check(app_src.count("data-ledger=") >= 1 and ".ledger-block" in (REPO / "app.css").read_text(encoding="utf-8"),
          "ledger blocks are styled separately rather than folded into one line")
    check("function renderDocumentLedgers(" in app_src and "renderRightsLedger(corpusKey)" in app_src,
          "the Reader renders the five ledgers from one function")
    check("isCompletionSourceReviewCompatible" in app_src
          and "completion_compatibility" in app_src,
          "the runtime reads the generated compatibility table instead of a second rule")

    print(f"\n{len(passes)} W1 source-review rule checks passed")
    if failures:
        print(f"🔴 {len(failures)} failure(s):", file=sys.stderr)
        for label in failures:
            print(f"  ❌ {label}", file=sys.stderr)
        return 1
    print("✅ W1 SOURCE-REVIEW RULES OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
