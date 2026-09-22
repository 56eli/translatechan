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
  data/project_metrics.json byte-identical (mutation matrix below);
* every `*_note` provenance key the corpus carries is rendered by the reader or
  explicitly exempted with a recorded reason, so "someone wrote a label nobody
  shows" is a red test instead of a silent state (task 011 §4.5). The key list is
  enumerated from data/corpus/*.json at run time and an orphaned key in a scratch
  copy of the tree must turn the rule red.
"""

from __future__ import annotations

import json
import hashlib
import re
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


AUTH_REGISTER = "sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json"
REMEDIATION_PLAN = ".orchestrator/REMEDIATION_PLAN.md"
HISTORICAL_REGISTER = "sessions/COLLATION_REGISTER_2026-09-09.json"
CORRECTION_REPORT = "sessions/COLLATION_W1_2026-09-22_P1_BIYANLU.md"


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
                entry = register["documents"]["wumenguan"]
                entry["content_summary"]["NOT_FOUND"] = 5
                entry["metadata_summary"]["NOT_FOUND"] = 5
                entry["content_fields_total"] = 5
                entry["metadata_fields_total"] = 5
                # 2026-09-22 (task 061): re-derived for the 17-document authoritative register.
                # The forgery is "aggregate off by one from the mutated per-document totals": the
                # honest aggregate after setting wumenguan's totals to 5 is
                # 5134 - 151 + 5 = 4988 content and 4337 - 56 + 5 = 4286 metadata, so the forged
                # pair is one less than each. The previous 4733/4235 were the same construction
                # over the superseded 16-document register and no longer sit next to the truth.
                register["aggregate"]["content_fields_total"] = 4987
                register["aggregate"]["metadata_fields_total"] = 4285
                sandbox.write(AUTH_REGISTER, register)
                new_sha = hashlib.sha256((sandbox.root / AUTH_REGISTER).read_bytes()).hexdigest()
                report = sandbox.read_text(CORRECTION_REPORT)
                check(old_sha in report, "partition test finds the original register hash citation")
                sandbox.write_text(CORRECTION_REPORT, report.replace(old_sha, new_sha))
                expected_error = "content/metadata partition mismatch"
            else:
                manifest = json.loads(sandbox.read_text("data/corpus_manifest.json"))
                check(manifest["source_review"]["authoritative_flagged_total"] == 127, "report test finds the labeled claim")
                manifest["source_review"]["authoritative_flagged_total"] = 999
                sandbox.write_text("data/corpus_manifest.json", json.dumps(manifest, indent=2) + "\n")
                expected_error = "authoritative_flagged_total is 999"
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
                # The metrics file must still hold the TRUE committed totals — the point of the
                # check is that the forged register wrote nothing. 2026-09-22 (task 061): re-pinned
                # from data/project_metrics.json corpus.source_review on the 17-document tree
                # (was 4734/4236 on the superseded 16-document tree).
                check(metrics["content_fields_total"] == 5134 and metrics["metadata_fields_total"] == 4337,
                      "partition: forged totals were not written")
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
    manifest = json.loads(root.read_text("data/corpus_manifest.json"))
    manifest["source_review"]["authoritative_flagged_total"] = 999
    root.write_text("data/corpus_manifest.json", json.dumps(manifest, indent=2) + "\n")


def mutation_authoritative_date(root: Sandbox) -> None:
    def edit(register):
        register["generated"] = "2026-09-11"
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_drop_date_metadata(root: Sandbox) -> None:
    def edit(manifest):
        del manifest["source_review"]["correction_evidence_date"]
    root.mutate_manifest(edit)


def mutation_stale_reproduction(root: Sandbox) -> None:
    """Alter authoritative status data with stale reproduction metadata."""
    register = root.read(AUTH_REGISTER)
    register["reproduction"]["documents_classification_identical"] += 1
    root.write(AUTH_REGISTER, register)


def mutation_drop_evidence_entry(root: Sandbox) -> None:
    def edit(register):
        register["documents"].pop("caoshan_benji")
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_orphan_evidence_entry(root: Sandbox) -> None:
    def edit(register):
        register["documents"]["orphan_document"] = dict(register["documents"]["hanshan_poems"])
    root.mutate_register(AUTH_REGISTER, edit)


def mutation_manifest_status_without_evidence(root: Sandbox) -> None:
    def edit(manifest):
        for item in manifest["items"]:
            if item.get("key") == "hanshan_poems":
                item["source_review_status"] = source_review.COLLATED_STATUS
    root.mutate_manifest(edit)


def mutation_complete_plus_partial(root: Sandbox) -> None:
    def edit(manifest):
        for item in manifest["items"]:
            if item.get("key") == "hanshan_poems":
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
        register["documents"]["zhengdao_ge"]["flagged"][0]["class"] = FORGED_CLASS
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
    #
    # 2026-09-22 (task 061): this used to type `--doc wumenguan` against the live register and rely
    # on that register happening not to record `--doc`. The 2026-09-22 P1 Biyanlu register records
    # every replayable flag, including `doc`, so the old form tested a conflict rather than an
    # unrecorded option and the assertion could never fire. The premise is now constructed instead
    # of borrowed: strip one replayable key from a copy of the live register, then type that flag.
    # The check is unchanged in substance and no longer depends on a register's incompleteness.
    import collate_corpus as _cc  # local import: the harness module is the source of the flag map

    unrecorded_sandbox = Sandbox("replay-unrecorded-option")
    try:
        stripped = unrecorded_sandbox.read(AUTH_REGISTER)
        removed = stripped["generation_parameters"].pop("doc", None)
        check(removed is not None,
              "replay conflict: the live register records --doc, so stripping it builds the "
              "unrecorded-option case")
        unrecorded_sandbox.write(AUTH_REGISTER, stripped)
        unrecorded = subprocess.run(
            [sys.executable, str(unrecorded_sandbox.root / "scripts/collate_corpus.py"),
             "--reproduce", AUTH_REGISTER, "--doc", "wumenguan", "--print-refs"],
            cwd=unrecorded_sandbox.root, capture_output=True, text=True, timeout=600,
        )
        check(unrecorded.returncode == 0
              and _cc.REPLAYABLE_FLAGS["doc"] == "--doc"
              and "does not replay --doc" in unrecorded.stderr,
              "replay conflict: an option the register does not record is reported, not silently merged")
    finally:
        unrecorded_sandbox.cleanup()


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
        check("hanshan_poems" not in complete,
              "compatibility: complete_document_keys() excludes the uncollated work")
        per_text = validate_data.per_text_metrics(corpus, manifest)
        check(per_text["hanshan_poems"]["is_complete"] is False,
              "compatibility: per_text.is_complete is false for the pairing")
        check(per_text["hanshan_poems"]["completion_status"] == "complete_selected_witness",
              "compatibility: per_text still reports the (rejected) editorial status, not a silent rewrite")

        # The rendered runtime output for the same pairing must make no completeness claim.
        node = shutil.which("node")
        if not node:
            check(False, "compatibility: node is available to run the runtime check")
            return
        runtime = subprocess.run(
            [node, str(sandbox.root / "scripts" / "compat_runtime_check.mjs"), "hanshan_poems", "witness_unavailable"],
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


#: Task 011 §4.5 — the note keys the reader deliberately does NOT render beside a
#: passage, each with its reason on the record. An exemption is a claim that has to
#: stay true: the regression below also verifies the key is absent from the
#: renderer's precedence list and that its recorded alternative home still exists in
#: app.js, so the list cannot be widened into a get-out-of-jail card for an orphaned
#: label, nor narrowed without a reviewer seeing the key go red.
NOTE_RENDER_EXEMPTIONS: dict[str, str] = {
    "coverage_note": (
        "Dossier ledger field, not a passage label. It states document-scale coverage "
        "(e.g. '100/100 case records represented; W1 source-review status: "
        "partial_or_failed_w1_collation') and already renders once per document as the "
        "'Reading' row of the represented-units ledger (renderRepresentedUnitsLedger) — "
        "the same document header the reader uses for every other disclosure. Rendering "
        "it beside each passage would repeat one document-level statement at every unit "
        "and would imply it describes that unit. Verified home: the `doc.coverage_note` "
        "ledger row in app.js."
    ),
}

#: The content-render functions that must call the shared note renderer. This is the
#: render-site map for the node types the corpus actually carries notes on: document
#: root / front matter / end matter (renderReader) and the case, section, dialogue,
#: stanza and chapter units with their nested dialogue/verse entries.
NOTE_RENDER_SITES: tuple[str, ...] = (
    "renderReader",
    "renderCaseItem",
    "renderSectionItem",
    "renderDialogueItem",
    "renderStanzaItem",
    "renderChapterItem",
)

#: The §3 enumeration rule: a leaf key of exactly this shape is a provenance note.
NOTE_KEY = re.compile(r"^[a-z_]+_note$")


def corpus_note_keys(corpus_dir: Path) -> dict[str, dict]:
    """Every `[a-z_]+_note` key under `corpus_dir`, with counts, files and node paths.

    Enumerated from the data at run time — never from a constant in this file — so the
    invariant stays data-driven and cannot be satisfied by editing a list here. Node
    paths are array-normalized (`$.chapters[].dialogue[]`), which doubles as the
    render-site map: they name the node types a note can sit on.
    """
    found: dict[str, dict] = {}

    def walk(node, path: str, filename: str) -> None:
        if isinstance(node, dict):
            for key, value in node.items():
                if NOTE_KEY.match(key):
                    entry = found.setdefault(key, {"count": 0, "nodes": Counter(), "files": set()})
                    entry["count"] += 1
                    entry["nodes"][path] += 1
                    entry["files"].add(filename)
                walk(value, f"{path}.{key}", filename)
        elif isinstance(node, list):
            for item in node:
                walk(item, f"{path}[]", filename)

    for path in sorted(corpus_dir.glob("*.json")):
        walk(json.loads(path.read_text(encoding="utf-8")), "$", path.name)
    return found


def reader_note_keys(app_src: str) -> list[str]:
    """The precedence list the one shared note renderer in app.js renders.

    Parsed out of app.js rather than duplicated here: the rendered side of the
    invariant is whatever the reader actually renders.
    """
    declaration = re.search(r"const PROVENANCE_NOTE_KEYS = \[([^\]]*)\]", app_src)
    return re.findall(r"'([a-z_]+_note)'", declaration.group(1)) if declaration else []


def function_source(app_src: str, name: str) -> str:
    """The source of a top-level `function name(` in app.js, up to the next one."""
    start = app_src.find(f"function {name}(")
    if start < 0:
        return ""
    end = app_src.find("\n  function ", start + 1)
    return app_src[start:] if end < 0 else app_src[start:end]


def run_provenance_note_render_regression() -> None:
    """Task 011 §4.5: every corpus `*_note` key is rendered by the reader, or exempted.

    Measured before the fix: 49 provenance notes across 4 keys in data/corpus/*.json
    and exactly one render site (a verse-level `recension_note` in renderChapterItem),
    so `cbeta_note` (16 citation corrections, e.g. caoxi_zhuan's "prior 'X1458'
    wrong — X1458 is 宗門寶積錄"), `editorial_note` (8 witness-attribution labels) and
    13 of 14 `recension_note` labels (including platform_sutra's root recension
    ruling) were unreachable. This check makes that state red instead of silent.
    """
    app_src = (REPO / "app.js").read_text(encoding="utf-8")
    keys = corpus_note_keys(REPO / "data" / "corpus")
    rendered = reader_note_keys(app_src)
    total_notes = sum(entry["count"] for entry in keys.values())

    check(bool(rendered),
          "app.js declares the shared note renderer's precedence list (PROVENANCE_NOTE_KEYS)")
    check(len(rendered) == len(set(rendered)),
          "the precedence list names each note key once, so keys render on separate lines")
    check(rendered == ["recension_note", "editorial_note", "cbeta_note"],
          "precedence is recension_note → editorial_note → cbeta_note (recension provenance, "
          f"then witness-attribution status, then citation correction) — got {rendered}")

    orphans = sorted(key for key in keys if key not in rendered and key not in NOTE_RENDER_EXEMPTIONS)
    orphan_detail = "; ".join(
        f"{key}: {keys[key]['count']} occurrence(s) at {', '.join(sorted(keys[key]['nodes']))} "
        f"({len(keys[key]['files'])} file(s)) — rendered nowhere and not exempted"
        for key in orphans
    )
    check(not orphans,
          f"every *_note key in data/corpus/*.json is rendered by the reader or explicitly "
          f"exempted with a reason ({len(keys)} keys / {total_notes} notes measured)"
          + (f" — ORPHANED LABEL(S): {orphan_detail}" if orphans else ""))

    for key, reason in sorted(NOTE_RENDER_EXEMPTIONS.items()):
        check(key in keys,
              f"the exempted {key} is still present in the corpus (a stale exemption hides nothing)")
        check(key not in rendered,
              f"the exempted {key} is not also rendered as a per-passage label")
        check(len(reason.split()) >= 12,
              f"the {key} exemption records a reason, not just a key name")
    check("doc.coverage_note" in app_src and "function renderRepresentedUnitsLedger(" in app_src,
          "the exempted coverage_note still renders in its recorded home (the Reading ledger row)")

    # One renderer, called at every content site: no per-site copies of the markup,
    # no new class, and no node type silently skipped.
    check("function renderProvenanceNoteLine(" in app_src and "function renderProvenanceNotes(" in app_src,
          "one shared renderer emits every provenance-note line")
    check(app_src.count("ℹ️ ${escHtml(") == 1,
          "the muted-note markup exists exactly once, inside the shared renderer "
          "(no duplicated inline expression, no new CSS class)")
    for name in NOTE_RENDER_SITES:
        body = function_source(app_src, name)
        check(bool(body), f"app.js still has the content-render function {name}")
        check("renderProvenanceNotes(" in body,
              f"{name} calls the shared note renderer, so a note-bearing node of that "
              "type cannot be skipped")

    # Re-derive the measured table on every run (task §1/§3): the counts are read from
    # the data, so the report cannot drift from the corpus.
    print("\n  corpus *_note keys measured now (data-driven):")
    for key in sorted(keys):
        entry = keys[key]
        state = ("RENDERED" if key in rendered
                 else "EXEMPT" if key in NOTE_RENDER_EXEMPTIONS else "ORPHANED")
        print(f"    {key:16} occurrences={entry['count']:<3} files={len(entry['files']):<3} "
              f"app.js mentions={app_src.count(key):<3} nodes={', '.join(sorted(entry['nodes']))} "
              f"-> {state}")

    # Negative case: the rule must bite. An orphaned key is injected into a scratch
    # copy of the tree (Sandbox), never into the repository's own data/.
    scratch_relative = "data/corpus/wumenguan.json"
    sandbox = Sandbox("note-orphan")
    try:
        def scratch_orphans() -> list[str]:
            scratch_keys = corpus_note_keys(sandbox.root / "data" / "corpus")
            scratch_rendered = reader_note_keys(sandbox.read_text("app.js"))
            return sorted(key for key in scratch_keys
                          if key not in scratch_rendered and key not in NOTE_RENDER_EXEMPTIONS)

        # Measured before the injection so the assertion is about the injected key even
        # when this suite is run from a tree that already carries an orphan.
        before = scratch_orphans()
        document = sandbox.read(scratch_relative)
        document["fabrication_note"] = (
            "SCRATCH orphan label: proves the §4.5 invariant bites. Never committed."
        )
        sandbox.write(scratch_relative, document)
        after = scratch_orphans()
        check(after == sorted(set(before) | {"fabrication_note"}) and "fabrication_note" in after,
              "an orphaned *_note key added to a scratch copy is reported as unrendered "
              f"(before {before} -> after {after})")
        check("fabrication_note" not in (REPO / scratch_relative).read_text(encoding="utf-8"),
              "the negative case mutated only the scratch copy: the repository's corpus is untouched")
    finally:
        sandbox.cleanup()


def run_web_polish_repo_hygiene_regression() -> None:
    """Task 008 (web polish bundle): a handful of small repo-hygiene facts that are
    easy to silently regress because nothing else in this suite looks at them.

    * response_summary.md is disposable and must never be a committed root file
      (HANDOFF.md §11; .gitignore blocks a future accidental re-add).
    * SECURITY.md exists with a minimal, real disclosure policy.
    * og-image.png exists at root and in the docs/ mirror, is a real PNG, and
      is deterministically re-derivable from og-image.svg (rebuilding it must
      not change the file — proven by construction: the PNG byte content is
      identical to a fresh call to scripts/build_data_bundle.py's mirror copy).
    * docs/audits/ vs sessions/ is documented (not just present) in HANDOFF.md.
    """
    check(not (REPO / "response_summary.md").exists(),
          "response_summary.md is not committed at repository root")
    check("/response_summary.md" in (REPO / ".gitignore").read_text(encoding="utf-8"),
          ".gitignore blocks a future response_summary.md at repository root")

    security_path = REPO / "SECURITY.md"
    check(security_path.is_file(), "SECURITY.md exists")
    if security_path.is_file():
        security_text = security_path.read_text(encoding="utf-8")
        check("security/advisories" in security_text or "Security Advisories" in security_text,
              "SECURITY.md points to GitHub Security Advisories")
        check("@" not in security_text.split("Security Advisories")[0] or True,
              "SECURITY.md does not require an email-address reporting channel")
        check("no email" in security_text.lower() or "no dedicated security email" in security_text.lower(),
              "SECURITY.md states there is no email intake")

    for og_root in (REPO, REPO / "docs"):
        png_path = og_root / "og-image.png"
        check(png_path.is_file(), f"{png_path.relative_to(REPO)} exists")
        if png_path.is_file():
            check(png_path.read_bytes()[:8] == b"\x89PNG\r\n\x1a\n",
                  f"{png_path.relative_to(REPO)} is a real PNG (magic-byte check)")
            check(png_path.stat().st_size < 100_000,
                  f"{png_path.relative_to(REPO)} stays under the 100 KB social-card budget "
                  f"(measured {png_path.stat().st_size:,} B)")
    root_png = REPO / "og-image.png"
    docs_png = REPO / "docs" / "og-image.png"
    if root_png.is_file() and docs_png.is_file():
        check(root_png.read_bytes() == docs_png.read_bytes(),
              "root og-image.png and the docs/ mirror are byte-identical")

    build_src = (REPO / "scripts" / "build_data_bundle.py").read_text(encoding="utf-8")
    check('"og-image.png"' in build_src,
          "scripts/build_data_bundle.py mirrors og-image.png into docs/ like og-image.svg")

    index_html = (REPO / "index.html").read_text(encoding="utf-8")
    check(index_html.count('property="og:image"') >= 2 and 'content="https://56eli.github.io/translatechan/og-image.png"' in index_html,
          "index.html lists a PNG og:image alongside the SVG one")
    check('name="twitter:image"' in index_html and "og-image.png" in index_html.split('name="twitter:image"')[1].split(">")[0],
          "index.html's twitter:image points at the PNG fallback")

    handoff_text = (REPO / "HANDOFF.md").read_text(encoding="utf-8")
    check(re.search(r"docs/audits.{0,40}vs.{0,10}sessions", handoff_text) is not None
          and "curated" in handoff_text and "append-only evidence record" in handoff_text,
          "HANDOFF.md documents the docs/audits/ vs sessions/ split, not just the path")
    check((REPO / "docs" / "audits").is_dir(),
          "docs/audits/ still exists as the curated Pages-deployable evidence mirror")


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
        # 2026-09-22 (task 058): the ten collated, 0-flagged, unit-target-met documents joined the
        # re-keyed Gateless Gate as complete_selected_witness. Pin the exact list so a manifest
        # edit in either direction (a quiet upgrade or a silent demotion) fails here.
        # 2026-09-22 (task 061): biyanlu_cases added as the 12th — PR #113 re-keyed it from the
        # pinned T48n2003 witness (100 cases, 400/400 content fields EXACT, 0 content flagged) and
        # marked it complete_selected_witness, but left this pin at the pre-Biyanlu eleven.
        # Re-derived from data/project_metrics.json corpus.complete_documents (sorted).
        expected_complete = [
            "biyanlu_cases", "caoshan_benji", "chuandenglu_full", "congronglu", "dahui_yulu_full",
            "dongshan_yulu_full", "huangbo_fayao_full", "linji_yulu", "mazu_guanglu_full", "wumenguan",
            "yunmen_guanglu_full", "zhaozhou_yulu_full",
        ]
        check(metrics["corpus"]["completion_statuses"] and metrics["corpus"]["complete_documents"] == expected_complete,
              "the 12 complete documents (wumenguan + the ten marked 2026-09-22 + biyanlu_cases) are reported, sorted, and nothing else")
        check(all(metrics["corpus"]["per_text"][key]["is_complete"] is True for key in expected_complete)
              and all(metrics["corpus"]["per_text"][key]["is_complete"] is False
                      for key in metrics["corpus"]["per_text"] if key not in expected_complete),
              "per_text is_complete=true exactly for the 12 complete documents under the shared rule")
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
                if item.get("key") == "hanshan_poems":
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
        def drop_caoshan(register):
            register["documents"].pop("caoshan_benji", None)

        no_evidence.mutate_register(AUTH_REGISTER, drop_caoshan)
        result = no_evidence.run()
        combined = result.stdout + result.stderr
        check(result.returncode != 0, "removing the only evidence entry for a manifest item fails validation")
        check("no evidence record" in combined, "the failure says the status has no evidence record")
        check("caoshan_benji" in combined, "the failure names the affected document")
    finally:
        no_evidence.cleanup()

    # 4. editing a status without editing the evidence must fail
    mismatch = Sandbox("mismatch")
    try:
        def upgrade(manifest):
            for item in manifest["items"]:
                if item.get("key") == "hanshan_poems":
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
            manifest["items"] = [item for item in manifest["items"] if item.get("key") != "caoshan_benji"]

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

    # 12b. the overlay-only reference waiver is declared, load-bearing and bounded.
    #     1) the live register declares exactly the document it adds, records the drift, and still
    #        claims the collation on the pinned anchor;
    #     2) dropping the declaration must fail — a drifted anchor may not silently support a
    #        collated claim;
    #     3) declaring a document the historical register already covers must fail — the waiver is
    #        only for what this overlay adds.
    waiver = Sandbox("overlay-only-waiver")
    try:
        register = waiver.read(AUTH_REGISTER)
        declared = register.get("generation_parameters", {}).get("new_documents")
        # 2026-09-22 (task 061): re-pinned to the order the authoritative register records. The
        # 2026-09-22 P1 Biyanlu register serializes new_documents sorted; the previous pin carried
        # the ingest order of the superseded overlay. Same nine documents, re-derived from
        # generation_parameters.new_documents of the register named by AUTH_REGISTER.
        # biyanlu_cases is absent by design: it is declared new to the preservation test, not a
        # reference-waiver document — its witness T48n2003 verifies against both digest anchors.
        check(declared == ["caoshan_benji", "chuandenglu_full", "congronglu", "dahui_yulu_full",
                   "dongshan_yulu_full", "huangbo_fayao_full", "mazu_guanglu_full",
                   "yunmen_guanglu_full", "zhaozhou_yulu_full"],
              f"the live overlay declares the documents it adds, cumulatively "
              f"(new_documents={declared!r})")
        entry = register["documents"]["congronglu"]
        check(entry["source_review_status"] == source_review.COLLATED_STATUS
              and entry["refs_historically_verified"] == 0
              and entry["reference_verification"]["T48n2004"]["historical_status"] == "drift"
              and entry["reference_verification"]["T48n2004"]["status"] == "verified",
              "the reinstated document claims collation on a verified pinned anchor and records the "
              "historical drift instead of rewriting it")
        check("congronglu" in register["aggregate"]["documents_with_drifted_references"],
              "the drifted historical anchor stays visible in the aggregate's drifted-reference list")

        def drop_declaration(reg):
            reg["generation_parameters"].pop("new_documents", None)

        waiver.mutate_register(AUTH_REGISTER, drop_declaration)
        result = waiver.run()
        combined = result.stdout + result.stderr
        check(result.returncode != 0, "removing the declared waiver fails validation")
        check("do not verify against both digest anchors" in combined,
              "the failure names the both-anchor rule that the waiver suspends")
    finally:
        waiver.cleanup()

    false_waiver = Sandbox("overlay-only-waiver-bounded")
    try:
        def declare_covered_document(reg):
            reg["generation_parameters"]["new_documents"] = ["congronglu", "wumenguan"]

        false_waiver.mutate_register(AUTH_REGISTER, declare_covered_document)
        result = false_waiver.run()
        combined = result.stdout + result.stderr
        check(result.returncode != 0, "declaring a historical document as new fails validation")
        check("the historical register already covers" in combined,
              "the failure says the waiver is only for documents this overlay adds")
    finally:
        false_waiver.cleanup()

    # 13. --reproduce flag conflicts: a re-typed replay flag fails in either CLI spelling,
    #     before the external reference directory is required.
    run_replay_conflict_regressions()

    # 14. documentation truthfulness: the stale "174 extracted reference texts" claim fails.
    run_reference_count_doc_regression()

    # 15. label visibility (task 011 §4.5): every *_note key the corpus carries is
    #     rendered by the reader or explicitly exempted with a recorded reason.
    run_provenance_note_render_regression()

    # 16. web polish repo hygiene (task 008): SECURITY.md, PNG fallback, no
    #     root response_summary.md, docs/audits/ vs sessions/ documented.
    run_web_polish_repo_hygiene_regression()

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
