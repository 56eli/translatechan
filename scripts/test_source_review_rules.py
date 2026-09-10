#!/usr/bin/env python3
"""Regression tests for the W1 source-review contract (statuses, evidence, metrics).

Run: python3 scripts/test_source_review_rules.py
(also invoked from scripts/smoke_test.mjs, because the CI workflows run only the node
smoke test for this repo.)

Every case mutates a *copy* of the repository inputs in a temp directory, so the real
`data/` tree is never touched, and asserts what `scripts/validate_data.py` must refuse:

* the shipped inputs validate, and their aggregates equal the independently
  recomputed evidence;
* a complete_selected_witness claim on an uncollated witness fails everywhere
  (validator, --write-metrics, complete_document_keys, per_text, and the rendered
  runtime output);
* a status with no evidence record fails, in both directions;
* editing a status or an evidence figure without editing the matching evidence fails;
* --write-metrics with any blocking data error exits nonzero and leaves
  data/project_metrics.json byte-identical (mutation matrix below).
"""

from __future__ import annotations

import json
import hashlib
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from collections import Counter

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
        # The baseline bundle ships into the sandbox: scripts/compat_runtime_check.mjs
        # renders from it (with an in-memory mutation only). It is never modified here,
        # and the --write-metrics assertions target data/project_metrics.json, not it.
        bundle = REPO / "app_data.js"
        if bundle.is_file():
            shutil.copy2(bundle, self.root / "app_data.js")

    def read(self, relative: str):
        return json.loads((self.root / relative).read_text(encoding="utf-8"))

    def write(self, relative: str, payload) -> None:
        text = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
        (self.root / relative).write_text(text, encoding="utf-8")

    def read_text(self, relative: str) -> str:
        return (self.root / relative).read_text(encoding="utf-8")

    def write_text(self, relative: str, text: str) -> None:
        (self.root / relative).write_text(text, encoding="utf-8")

    def mutate_manifest(self, transform) -> None:
        manifest = self.read("data/corpus_manifest.json")
        transform(manifest)
        self.write("data/corpus_manifest.json", manifest)

    def mutate_register(self, relative: str, transform) -> None:
        register = self.read(relative)
        transform(register)
        self.write(relative, register)

    def corpus(self) -> dict:
        return {
            path.stem: json.loads(path.read_text(encoding="utf-8"))
            for path in sorted((self.root / "data" / "corpus").glob("*.json"))
        }

    def metrics_text(self) -> str:
        return (self.root / "data" / "project_metrics.json").read_text(encoding="utf-8")

    def run(self, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(self.root / "scripts" / "validate_data.py"), "--skip-docs", *args],
            cwd=self.root, capture_output=True, text=True, timeout=600,
        )

    def run_with_docs(self, *args: str) -> subprocess.CompletedProcess[str]:
        """Validation including the documentation-truthfulness checks (no --skip-docs)."""
        return subprocess.run(
            [sys.executable, str(self.root / "scripts" / "validate_data.py"), *args],
            cwd=self.root, capture_output=True, text=True, timeout=600,
        )

    def cleanup(self) -> None:
        shutil.rmtree(self.root, ignore_errors=True)


AUTH_REGISTER = "sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json"
REMEDIATION_PLAN = ".orchestrator/REMEDIATION_PLAN.md"
HISTORICAL_REGISTER = "sessions/COLLATION_REGISTER_2026-09-09.json"
CORRECTION_REPORT = "sessions/COLLATION_W1_2026-09-10_CORRECTION.md"


def _is_metadata_path(path: str) -> bool:
    leaf = str(path).rsplit(".", 1)[-1].split("[", 1)[0]
    return leaf in ("title_zh", "name_zh")


def run_partition_and_report_regressions() -> None:
    """Focused forgeries must not write metrics, even with a valid register citation."""
    for label in ("partition", "report-metadata"):
        sandbox = Sandbox(label)
        try:
            metrics_path = sandbox.root / "data/project_metrics.json"
            before = metrics_path.read_bytes()
            if label == "partition":
                old_sha = hashlib.sha256((sandbox.root / AUTH_REGISTER).read_bytes()).hexdigest()
                register = sandbox.read(AUTH_REGISTER)
                entry = register["documents"]["baizhang_guanglu"]
                entry["content_summary"]["NOT_FOUND"] = 5
                entry["metadata_summary"]["NOT_FOUND"] = 5
                entry["content_fields_total"] = 5
                entry["metadata_fields_total"] = 5
                register["aggregate"]["content_fields_total"] = 923
                register["aggregate"]["metadata_fields_total"] = 392
                sandbox.write(AUTH_REGISTER, register)
                new_sha = hashlib.sha256((sandbox.root / AUTH_REGISTER).read_bytes()).hexdigest()
                report = sandbox.read_text(CORRECTION_REPORT)
                check(old_sha in report, "partition test finds the original register hash citation")
                sandbox.write_text(CORRECTION_REPORT, report.replace(old_sha, new_sha))
                expected_error = "content/metadata partition mismatch"
            else:
                report = sandbox.read_text(CORRECTION_REPORT)
                check("391 metadata fields" in report, "report test finds the labeled metadata claim")
                sandbox.write_text(CORRECTION_REPORT, report.replace("391 metadata fields", "999 metadata fields", 1))
                expected_error = "correction report states metadata fields as '999'"
            result = subprocess.run(
                [sys.executable, str(sandbox.root / "scripts/validate_data.py"), "--write-metrics"],
                cwd=sandbox.root, capture_output=True, text=True, timeout=600,
            )
            output = result.stdout + result.stderr
            unchanged = metrics_path.read_bytes() == before
            check(result.returncode != 0, f"{label}: forged totals exit nonzero")
            check(expected_error in output, f"{label}: failure identifies the forged claim")
            check("--write-metrics refused" in output, f"{label}: metrics refusal path is triggered")
            check(unchanged, f"{label}: metrics remain byte-identical")
            if label == "partition":
                check("cited digest no longer matches" not in output,
                      "partition: updated register hash avoids unrelated citation failure")
                metrics = sandbox.read("data/project_metrics.json")["corpus"]["source_review"]
                check(metrics["content_fields_total"] == 924 and metrics["metadata_fields_total"] == 391,
                      "partition: forged 923/392 totals were not written")
            print(f"Focused mutation {label}: exit={result.returncode}, metrics_byte_identical={unchanged}")
        finally:
            sandbox.cleanup()


def mutation_fields_total(root: Sandbox) -> None:
    def edit(register):
        register["documents"]["wumenguan"]["fields_total"] += 1
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_content_fields_and_aggregate(root: Sandbox) -> None:
    def edit(register):
        register["documents"]["wumenguan"]["content_fields_total"] += 2
        register["aggregate"]["content_fields_total"] += 2
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_aggregate_class_total(root: Sandbox) -> None:
    def edit(register):
        register["aggregate"]["class_totals"]["EXACT"] -= 1
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_report_total_to_999(root: Sandbox) -> None:
    text = root.read_text(CORRECTION_REPORT)
    text = text.replace("(35 documents, 630 flagged entries)", "(35 documents, 999 flagged entries)", 1)
    root.write_text(CORRECTION_REPORT, text)


def mutation_authoritative_date(root: Sandbox) -> None:
    def edit(register):
        register["generated"] = "2026-09-11"
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_drop_date_metadata(root: Sandbox) -> None:
    def edit(manifest):
        del manifest["source_review"]["correction_evidence_date"]
    root.mutate_manifest(edit)


def mutation_stale_reproduction(root: Sandbox) -> None:
    """Move wumenguan's derived status to collated (per-doc, aggregate, and manifest
    kept consistent) while the reproduction block still says 0 status changes."""
    register = root.read(AUTH_REGISTER)
    entry = register["documents"]["wumenguan"]
    kept = [flag for flag in entry["flagged"] if _is_metadata_path(flag["path"])]
    removed = [flag for flag in entry["flagged"] if not _is_metadata_path(flag["path"])]
    entry["flagged"] = kept
    meta_flags = Counter(flag["class"] for flag in kept)
    entry["summary"] = {"EXACT": 160, **{c: n for c, n in meta_flags.items() if c != "EXACT"}}
    entry["content_summary"] = {"EXACT": 113}
    entry["metadata_summary"] = {"EXACT": 47, **{c: n for c, n in meta_flags.items() if c != "EXACT"}}
    entry["fields_total"] = 113 + 47 + len(kept)
    entry["content_fields_total"] = 113
    entry["content_fields_collated"] = 113
    entry["metadata_fields_total"] = 47 + len(kept)
    entry["source_review_status"] = source_review.COLLATED_STATUS
    aggregate = register["aggregate"]
    aggregate["flagged_entries"] -= len(removed)
    for flag in removed:
        aggregate["class_totals"][flag["class"]] -= 1
    aggregate["source_review_status_counts"][source_review.COLLATED_STATUS] += 1
    aggregate["source_review_status_counts"][source_review.PARTIAL_STATUS] -= 1
    aggregate["fields_total"] -= len(removed)
    aggregate["content_fields_total"] -= len(removed)
    root.write(AUTH_REGISTER, register)

    def edit(manifest):
        for item in manifest["items"]:
            if item.get("key") == "wumenguan":
                item["source_review_status"] = source_review.COLLATED_STATUS

    root.mutate_manifest(edit)


def mutation_drop_evidence_entry(root: Sandbox) -> None:
    def edit(register):
        register["documents"].pop("shitou_sandokai")
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_orphan_evidence_entry(root: Sandbox) -> None:
    def edit(register):
        register["documents"]["orphan_document"] = dict(register["documents"]["hanshan_poems"])
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_manifest_status_without_evidence(root: Sandbox) -> None:
    def edit(manifest):
        for item in manifest["items"]:
            if item.get("key") == "wumenguan":
                item["source_review_status"] = source_review.COLLATED_STATUS
    root.mutate_manifest(edit)


def mutation_complete_plus_partial(root: Sandbox) -> None:
    def edit(manifest):
        for item in manifest["items"]:
            if item.get("key") == "wumenguan":
                item["completion_status"] = "complete_selected_witness"
    root.mutate_manifest(edit)


FORGED_CLASS = "FORGED_CLASS"


def mutation_class_in_summary(root: Sandbox) -> None:
    def edit(register):
        register["documents"]["wumenguan"]["summary"][FORGED_CLASS] = 1
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_class_in_content_summary(root: Sandbox) -> None:
    def edit(register):
        entry = register["documents"]["wumenguan"]
        first = sorted(entry["content_summary"])[0]
        entry["content_summary"][FORGED_CLASS] = entry["content_summary"].pop(first)
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_class_in_metadata_summary(root: Sandbox) -> None:
    def edit(register):
        entry = register["documents"]["wumenguan"]
        first = sorted(entry["metadata_summary"])[0]
        entry["metadata_summary"][FORGED_CLASS] = entry["metadata_summary"].pop(first)
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_class_in_flagged(root: Sandbox) -> None:
    def edit(register):
        register["documents"]["wumenguan"]["flagged"][0]["class"] = FORGED_CLASS
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_class_in_aggregate(root: Sandbox) -> None:
    def edit(register):
        totals = register["aggregate"]["class_totals"]
        totals[FORGED_CLASS] = totals.pop(sorted(totals)[0])
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_class_in_historical_register(root: Sandbox) -> None:
    def edit(register):
        register["documents"]["wumenguan"]["summary"][FORGED_CLASS] = 1
    root.mutate_register(HISTORICAL_REGISTER, edit)


def mutation_historical_refs_metadata(root: Sandbox) -> None:
    """A re-pointed historical reference manifest must not validate.

    The 2026-09-09 register is append-only and declares its reference manifest in the legacy
    free-text form that stands for `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt`; a fake
    name like `sessions/fake.txt` leaves the historical reference layer resting on a file the
    repository cannot re-derive.
    """
    def edit(register):
        register["refs_manifest"] = "sessions/fake.txt"
    root.mutate_register(HISTORICAL_REGISTER, edit)


def mutation_historical_witness_not_in_manifest(root: Sandbox) -> None:
    """A historical witness the committed manifest does not list must not validate."""
    def edit(register):
        register["documents"]["wumenguan"]["witness"] = ["T99n9999"]
    root.mutate_register(HISTORICAL_REGISTER, edit)


WRITE_METRICS_MUTATIONS = (
    ("change one document's fields_total", mutation_fields_total, "fields_total is"),
    ("change content_fields_total and adjust the aggregate", mutation_content_fields_and_aggregate,
     "content_fields_total is"),
    ("change one aggregate class total", mutation_aggregate_class_total, "aggregate.class_totals"),
    ("change the correction report's 630 claim to 999", mutation_report_total_to_999, "999"),
    ("change the authoritative register's date", mutation_authoritative_date, "2026-09-11"),
    ("remove required date metadata", mutation_drop_date_metadata, "missing field(s)"),
    ("alter authoritative status data with stale reproduction metadata", mutation_stale_reproduction,
     "reproduction"),
    ("remove an evidence entry", mutation_drop_evidence_entry, "no evidence record"),
    ("add an orphan evidence entry", mutation_orphan_evidence_entry, "no such item"),
    ("change a manifest status without changing the evidence", mutation_manifest_status_without_evidence,
     "derives"),
    ("pair a complete status with a non-collated W1 status", mutation_complete_plus_partial,
     "not representable"),
    ("re-point the historical register's reference metadata", mutation_historical_refs_metadata,
     "historical reference metadata"),
    ("claim a historical witness the committed manifest does not list",
     mutation_historical_witness_not_in_manifest, "committed historical manifest"),
    ("rename a summary class to FORGED_CLASS", mutation_class_in_summary, FORGED_CLASS),
    ("rename a content_summary class to FORGED_CLASS", mutation_class_in_content_summary, FORGED_CLASS),
    ("rename a metadata_summary class to FORGED_CLASS", mutation_class_in_metadata_summary, FORGED_CLASS),
    ("rename a flagged[].class to FORGED_CLASS", mutation_class_in_flagged, FORGED_CLASS),
    ("rename an aggregate class_totals class to FORGED_CLASS", mutation_class_in_aggregate, FORGED_CLASS),
    ("rename a historical summary class to FORGED_CLASS", mutation_class_in_historical_register, FORGED_CLASS),
)


def run_write_metrics_matrix() -> None:
    """--write-metrics with any blocking evidence/data error: nonzero exit and
    byte-identical data/project_metrics.json, every time."""
    for label, mutate, needle in WRITE_METRICS_MUTATIONS:
        sandbox = Sandbox(f"wm-{label[:18]}")
        try:
            before = sandbox.metrics_text()
            mutate(sandbox)
            result = sandbox.run("--write-metrics")
            combined = result.stdout + result.stderr
            after = sandbox.metrics_text()
            ok = (
                result.returncode != 0
                and after == before
                and needle in combined
                and "--write-metrics refused" in combined
            )
            check(ok, f"--write-metrics matrix: {label} fails with unchanged metrics")
            if not ok:
                print(f"  mutation: {label}")
                print(f"  rc={result.returncode} metrics_unchanged={after == before}")
                for line in combined.splitlines():
                    if "❌" in line:
                        print(f"    {line[:200]}")
        finally:
            sandbox.cleanup()


def run_reference_count_doc_regression() -> None:
    """The stale '174 extracted reference texts' claim must not validate.

    The committed historical manifest lists 187 entries, so the active remediation plan must
    quote that number and must never present 174 as the current count. The mutation restores
    the old prose in a temporary copy: validation (with the documentation checks enabled, not
    --skip-docs) must exit nonzero naming the plan, and --write-metrics must leave
    data/project_metrics.json byte-identical. The plan in the working tree is never edited.
    """
    import re

    sandbox = Sandbox("doc-174")
    try:
        plan = sandbox.read_text(REMEDIATION_PLAN)
        check("187" in plan and "174" in plan,
              "documentation: the plan states the committed manifest count and labels 174 as stale")
        control = sandbox.run_with_docs("--write-metrics")
        check(control.returncode == 0,
              "documentation: the shipped plan passes the documentation-truthfulness checks")
        before = sandbox.metrics_text()
        stale = plan.replace("187", "174")
        stale = re.sub(r"\s*\(count the file[^)]*\)", "", stale)
        check("187" not in stale, "documentation: the mutation removes the committed manifest count")
        sandbox.write_text(REMEDIATION_PLAN, stale)
        result = sandbox.run_with_docs("--write-metrics")
        combined = result.stdout + result.stderr
        check(result.returncode != 0, "documentation: the stale 174 count exits nonzero")
        check(REMEDIATION_PLAN in combined,
              "documentation: the failure names the stale plan instead of failing elsewhere")
        check("187" in combined and "174" in combined,
              "documentation: the failure contrasts the stale claim with the committed count")
        check(sandbox.metrics_text() == before,
              "documentation: the stale count writes no metrics")
    finally:
        sandbox.cleanup()


def run_replay_conflict_regressions() -> None:
    """`--reproduce` must reject a re-typed replay flag in either CLI spelling.

    The conflict check used to normalize neither side, so `--generated=1999-01-01` slipped past
    a comparison written for `--generated 1999-01-01` and the register's own date was replayed
    as if nothing had been typed. Both spellings must exit nonzero and name the conflict; the
    control run (`--print-refs` alone) must still succeed, and every one of these runs must get
    its answer without a CBETA reference checkout — no `--refs-dir`, no external reference files.
    """
    harness = str(REPO / "scripts" / "collate_corpus.py")
    control = subprocess.run(
        [sys.executable, harness, "--reproduce", AUTH_REGISTER, "--print-refs"],
        cwd=REPO, capture_output=True, text=True, timeout=600,
    )
    control_works = control.stdout.split()
    check(control.returncode == 0 and control_works,
          "replay conflict: the non-conflicting control still replays and prints refs")
    check(all(work[:1].isupper() and "n" in work for work in control_works),
          "replay conflict: the control prints the CBETA work ids it needs")
    check("--refs-dir" not in control.stdout + control.stderr,
          "replay conflict: the control is answered without a reference checkout")

    for label, extra in (
        ("space form (--generated 1999-01-01)", ["--generated", "1999-01-01"]),
        ("equals form (--generated=1999-01-01)", ["--generated=1999-01-01"]),
    ):
        result = subprocess.run(
            [sys.executable, harness, "--reproduce", AUTH_REGISTER, *extra, "--print-refs"],
            cwd=REPO, capture_output=True, text=True, timeout=600,
        )
        output = result.stdout + result.stderr
        check(result.returncode != 0, f"replay conflict rejected: {label} exits nonzero")
        check("--generated" in output and "--reproduce" in output,
              f"replay conflict identified: {label} names the conflicting option")
        check(result.stdout.strip() == "",
              f"replay conflict stops before any work id is printed: {label}")
        check("Set --refs-dir" not in output,
              f"replay conflict is reported before the reference directory is required: {label}")

    # Only options the register actually records are conflicts, and an unrecorded replayable
    # option is reported rather than silently folded into a run that claims to replay the register.
    unrecorded = subprocess.run(
        [sys.executable, harness, "--reproduce", AUTH_REGISTER, "--doc", "wumenguan", "--print-refs"],
        cwd=REPO, capture_output=True, text=True, timeout=600,
    )
    check(unrecorded.returncode == 0 and "does not replay --doc" in unrecorded.stderr,
          "replay conflict: an option the register does not record is reported, not silently merged")


def run_compatibility_regression() -> None:
    """One shared rule end to end: the complete+partial pairing must fail validation,
    write no metrics, be excluded from complete_documents, be is_complete=false in
    per_text, and render no completeness claim at runtime."""
    sandbox = Sandbox("compat")
    try:
        before = sandbox.metrics_text()
        mutation_complete_plus_partial(sandbox)
        result = sandbox.run("--write-metrics")
        combined = result.stdout + result.stderr
        check(result.returncode != 0, "compatibility: the complete+partial pairing fails validation")
        check(sandbox.metrics_text() == before,
              "compatibility: --write-metrics writes no metrics for the pairing")
        check("--write-metrics refused" in combined,
              "compatibility: the refusal message names --write-metrics")

        # The metrics functions themselves must apply the same rule to the mutated data.
        sys.path.insert(0, str(REPO / "scripts"))
        import validate_data  # noqa: E402 - pure functions only; no file access
        manifest = sandbox.read("data/corpus_manifest.json")
        corpus = sandbox.corpus()
        complete = validate_data.complete_document_keys(corpus, manifest)
        check("wumenguan" not in complete,
              "compatibility: complete_document_keys() excludes the uncollated work")
        per_text = validate_data.per_text_metrics(corpus, manifest)
        check(per_text["wumenguan"]["is_complete"] is False,
              "compatibility: per_text.is_complete is false for the pairing")
        check(per_text["wumenguan"]["completion_status"] == "complete_selected_witness",
              "compatibility: per_text still reports the (rejected) editorial status, not a silent rewrite")

        # The rendered runtime output for the same pairing must make no completeness claim.
        node = shutil.which("node")
        if not node:
            check(False, "compatibility: node is available to run the runtime check")
            return
        runtime = subprocess.run(
            [node, str(sandbox.root / "scripts" / "compat_runtime_check.mjs"), "wumenguan"],
            cwd=sandbox.root, capture_output=True, text=True, timeout=600,
        )
        check(runtime.returncode == 0,
              "compatibility: runtime output for the pairing has no 'Complete witness', no complete "
              "mark, and no represented-complete claim")
        if runtime.returncode != 0:
            print(runtime.stdout)
            print(runtime.stderr, file=sys.stderr)
    finally:
        sandbox.cleanup()


def run_public_api_check() -> None:
    app_src = (REPO / "app.js").read_text(encoding="utf-8")
    check("getSourceReviewStatus" not in app_src,
          "the removed public API getSourceReviewStatus is not present in app.js")
    docs_copy = REPO / "docs" / "app.js"
    if docs_copy.is_file():
        check("getSourceReviewStatus" not in docs_copy.read_text(encoding="utf-8"),
              "the removed public API getSourceReviewStatus is not present in docs/app.js")


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
            baseline.read(AUTH_REGISTER),
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
        before = conflict.metrics_text()

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
        check(conflict.metrics_text() == before, "--write-metrics writes nothing when the data is invalid")
    finally:
        conflict.cleanup()

    # 3. a status with no evidence record must fail, in both directions
    no_evidence = Sandbox("no-evidence")
    try:
        def drop_shitou(register):
            register["documents"].pop("shitou_sandokai", None)

        no_evidence.mutate_register(AUTH_REGISTER, drop_shitou)
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

        arithmetic.mutate_register(AUTH_REGISTER, inflate)
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

    # 10. the removed public API must stay removed
    run_public_api_check()

    # 11. --write-metrics protection matrix: every blocking evidence/data mutation
    #     must fail the run and leave data/project_metrics.json byte-identical.
    run_write_metrics_matrix()

    # 12. the full compatibility regression: validator, metrics functions, and runtime.
    run_compatibility_regression()

    run_partition_and_report_regressions()

    # 13. --reproduce flag conflicts: a re-typed replay flag fails in either CLI spelling,
    #     before the external reference directory is required.
    run_replay_conflict_regressions()

    # 14. documentation truthfulness: the stale "174 extracted reference texts" claim fails.
    run_reference_count_doc_regression()

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
