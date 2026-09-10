#!/usr/bin/env python3
"""Deterministic CBETA reference extraction + digest verification for W1 collation.

Why this exists
---------------
`scripts/collate_corpus.py` collates corpus source-Chinese fields against reference
text files (`ref_<WorkId>.txt`) derived from the official CBETA XML P5 edition. Those
21 MB of reference text are deliberately *not* committed; the 2026-09-09 evidence
recorded only their SHA-256 digests
(`sessions/COLLATION_W1_2026-09-09_refs_manifest.txt`). That left nobody able to
re-derive the reference layer and check it — which is exactly how one corpus item
ended up with a W1 status and no evidence record at all.

So the extraction rule lives here, in the repository, and this script both extracts
and verifies. A register produced on top of `--require-verified-refs` references is
evidence; a register produced on top of hand-made text files is not.

Extraction rule (`EXTRACTION_RULE`)
-----------------------------------
For one CBETA P5 work file `<C>/<C><VV>/<WorkId>.xml`:

    1. parse the TEI tree and select the first `tei:text/tei:body`;
    2. walk it in document order, collecting element text and the tail text that
       follows each element;
    3. drop the subtree of every `tei:note` (CBETA apparatus) and every `tei:g`
       (non-encoded-character placeholder). The *tail* of a dropped element always
       belongs to its parent and is kept, so removing apparatus never truncates the
       surrounding narrative and a gap marker never becomes a spurious DIVERGENT hit;
    4. keep `tei:head` text — work and chapter titles are part of the witness record,
       and a composite project title is a collation *finding*, not something to hide;
    5. keep only characters in the CJK ranges U+3400-U+9FFF and U+F900-U+FAFF.
       NFKC and the graphic-variant map stay inside the collator (applied to both
       sides there), so they are never baked into the reference file;
    6. write the result as one UTF-8 line with no trailing newline.

Usage
-----
    # 1. acquire the reference edition (git protocol works where the raw CDN does not)
    git clone --filter=blob:none --no-checkout --depth 1 \
        https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
    cd /tmp/xmlp5
    # list the works from the published manifest, then check out exactly those files
    sed 's/.*  ref_//; s/\.txt$//' /repo/sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
        | while read -r w; do printf '/%s/%s/%s.xml\n' "${w:0:1}" "${w:0:3}" "$w"; done > /tmp/paths.txt
    git sparse-checkout set --no-cone $(tr '\n' ' ' < /tmp/paths.txt) && git checkout
    # the prefix "${w:0:3}" is the directory: T45n1858.xml lives under T/T45/

    # 2. extract every manifest work, verify digests, publish a new digest manifest
    python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
        --work-list sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
        --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
        --upstream-revision "$(git -C /tmp/xmlp5 rev-parse HEAD)" \
        --write-digest-manifest /tmp/refs/refs_manifest.txt --allow-drift

    # 3. prove the published manifest is reproducible, and re-verify the refs on disk
    cmp /tmp/refs/refs_manifest.txt sessions/COLLATION_W1_2026-09-10_refs_manifest.txt
    python3 scripts/collate_refs.py --verify-against \
        sessions/COLLATION_W1_2026-09-10_refs_manifest.txt --refs-dir /tmp/refs --require-verified

    # 4. collate on the verified references
    COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --out register.json

Reproducibility is reported, never assumed: references whose bytes differ from a
historical digest manifest are `drift`, listed by work id, and `--require-verified`
turns drift into a hard failure for the references a claim actually depends on.
Upstream CBETA releases revise text; drift is a finding to document, never a licence
to invent a result. `--work-list` accepts bare work ids or the manifest's own
"<digest>  ref_<work>.txt" lines, and `--verify-against` alone selects exactly the
works the anchor lists, so the committed evidence file is the input for both steps.
`--require-verified` also fails when the anchor covers none of the selected works, so a run without
an anchor cannot report a hollow "0 drift, all verified".
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree as ET

REPO = Path(__file__).resolve().parent.parent
TEI_NS = {"tei": "http://www.tei-c.org/ns/1.0"}
UPSTREAM_REPO = "https://github.com/cbeta-org/xml-p5"
WORK_ID_RE = re.compile(r"^[TXJ]\d{2}n\d{3,4}[A-Za-z]?$")
CJK_RANGES = ((0x3400, 0x9FFF), (0xF900, 0xFAFF))
#: Elements whose subtree is apparatus or a glyph placeholder, never witness text.
DROP_SUBTREE_TAGS = ("note", "g")
RULE_ID = "cbeta-p5-body-cjk-v1"
EXTRACTION_RULE = (
    "tei:text/tei:body document-order text; drop the subtree of every tei:note and tei:g "
    "(tails kept); tei:head kept; keep only U+3400-U+9FFF and U+F900-U+FAFF; one UTF-8 line, "
    "no trailing newline"
)


def localname(element: ET.Element) -> str:
    return element.tag.split("}")[-1]


def cjk_only(text: str) -> str:
    return "".join(ch for ch in text if any(lo <= ord(ch) <= hi for lo, hi in CJK_RANGES))


def serialize_body(body: ET.Element) -> str:
    parts: list[str] = []

    def visit(element: ET.Element) -> None:
        if element.text:
            parts.append(element.text)
        for child in element:
            if localname(child) not in DROP_SUBTREE_TAGS:
                visit(child)
            if child.tail:
                parts.append(child.tail)

    visit(body)
    return "".join(parts)


def work_file(work_id: str, source_dir: Path) -> Path:
    """`T48n2005` -> `<source>/T/T48/T48n2005.xml`."""
    if not WORK_ID_RE.match(work_id):
        raise ValueError(f"not a CBETA work identifier: {work_id!r}")
    path = source_dir / work_id[0] / work_id[:3] / f"{work_id}.xml"
    if not path.is_file():
        raise FileNotFoundError(path)
    return path


def extract_ref(work_id: str, source_dir: Path) -> str:
    path = work_file(work_id, source_dir)
    body = ET.parse(str(path)).getroot().find(".//tei:text/tei:body", TEI_NS)
    if body is None:
        raise ValueError(f"{path} has no tei:text/tei:body element")
    return cjk_only(serialize_body(body))


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def sha256_text(text: str) -> str:
    return sha256_bytes(text.encode("utf-8"))


def read_digest_manifest(path: Path) -> dict[str, str]:
    """Parse `<sha256>  ref_<WorkId>.txt` lines into `{work_id: sha256}`."""
    entries: dict[str, str] = {}
    for lineno, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        pieces = line.split()
        if len(pieces) != 2 or not re.fullmatch(r"[0-9a-f]{64}", pieces[0]) or not pieces[1].startswith("ref_"):
            raise ValueError(f"{Path(path).name}:{lineno} is not '<sha256>  ref_<WorkId>.txt'")
        entries[pieces[1][len("ref_"):].removesuffix(".txt")] = pieces[0]
    return entries


def write_digest_manifest(path: Path, refs: dict[str, dict[str, object]]) -> None:
    lines = [
        f"{value['sha256']}  ref_{work_id}.txt"
        for work_id, value in sorted(refs.items())
        if isinstance(value.get("sha256"), str)
    ]
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")


def iter_work_ids(source_dir: Path, limit: Iterable[str] | None = None) -> list[str]:
    allowed = set(limit) if limit is not None else None
    return sorted(
        path.stem
        for path in Path(source_dir).rglob("*.xml")
        if WORK_ID_RE.match(path.stem) and (allowed is None or path.stem in allowed)
    )


def upstream_revision(source_dir: Path) -> str:
    try:
        out = subprocess.run(
            ["git", "-C", str(source_dir), "rev-parse", "HEAD"],
            capture_output=True, text=True, check=True, timeout=30,
        )
        return out.stdout.strip()
    except Exception:  # noqa: BLE001 - a plain directory is legal; the revision is then explicit
        return "unrecorded"


def collect(work_id: str, source_dir: Path | None, refs_dir: Path | None) -> tuple[str | None, str, str | None]:
    """Return `(text, origin, error)` for one work: extracted, or read from a refs dir."""
    if refs_dir is not None:
        target = refs_dir / f"ref_{work_id}.txt"
        if target.is_file():
            return target.read_text(encoding="utf-8"), "existing-reference-file", None
        return None, "existing-reference-file", f"missing {target}"
    try:
        return extract_ref(work_id, source_dir), "extracted-from-cbeta-p5", None
    except FileNotFoundError:
        return None, "extracted-from-cbeta-p5", f"no P5 source file for {work_id} under {source_dir}"
    except ValueError as exc:
        return None, "extracted-from-cbeta-p5", str(exc)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--source-dir", type=Path, help="checked-out CBETA XML P5 tree to extract from")
    parser.add_argument("--out-dir", type=Path, help="directory to write ref_<WorkId>.txt files into")
    parser.add_argument("--refs-dir", type=Path, help="existing reference directory to verify instead of extracting")
    parser.add_argument("--from-digest-manifest", type=Path,
                        help="digest manifest that BOTH selects the works and verifies them")
    parser.add_argument("--verify-against", type=Path,
                        help="digest manifest used only for byte-verification (use with --work-list "
                             "to rebuild a subset while still checking it against historical evidence)")
    parser.add_argument("--work", action="append", default=[], help="explicit work id (repeatable)")
    parser.add_argument("--work-list", type=Path,
                        help="file with one work id per line (e.g. the output of "
                             "`scripts/collate_corpus.py --print-refs`)")
    parser.add_argument("--write-digest-manifest", type=Path,
                        help="write a fresh '<sha256>  ref_<WorkId>.txt' manifest of the results")
    parser.add_argument("--report", type=Path, help="write a JSON verification report")
    parser.add_argument("--upstream-revision", default=None,
                        help="pin the CBETA revision the references came from (recorded in the report)")
    parser.add_argument("--allow-drift", action="store_true",
                        help="exit 0 even when references differ from --from-digest-manifest")
    parser.add_argument("--require-verified", action="store_true",
                        help="fail unless every work in the digest manifest is byte-verified")
    args = parser.parse_args()

    if not args.source_dir and not args.refs_dir:
        parser.error("one of --source-dir or --refs-dir is required")
    if args.out_dir:
        args.out_dir.mkdir(parents=True, exist_ok=True)
    if args.out_dir and not args.source_dir:
        parser.error("--out-dir requires --source-dir (nothing to extract otherwise)")

    if args.verify_against and args.from_digest_manifest:
        parser.error("--verify-against replaces --from-digest-manifest for verification; pass one")
    verification_manifest = args.verify_against or args.from_digest_manifest
    expected: dict[str, str] = read_digest_manifest(verification_manifest) if verification_manifest else {}
    listed: list[str] = []
    if args.work_list:
        # Accepts either a bare work id per line or the published manifest's own
        # "<digest>  ref_<work>.txt" lines, so the committed evidence file doubles as the work list for
        # a reproduction run instead of needing to be transformed first.
        for raw in args.work_list.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split()
            candidate = parts[-1] if len(parts) > 1 else line
            if candidate.startswith("ref_") and candidate.endswith(".txt"):
                candidate = candidate[len("ref_"):-len(".txt")]
            if not WORK_ID_RE.match(candidate):
                parser.error(f"--work-list lines are not CBETA work ids: {line[:60]!r}")
            listed.append(candidate)
    works = sorted(
        (set(read_digest_manifest(args.from_digest_manifest)) if args.from_digest_manifest else set())
        | set(args.work)
        | set(listed)
        # Verifying an anchor with no other selection covers exactly the works that anchor lists.
        | (set(expected) if args.verify_against and not (args.work or listed or args.from_digest_manifest) else set())
    )
    if not works:
        if not args.source_dir:
            parser.error("--work, --work-list or --from-digest-manifest is required to select works")
        works = iter_work_ids(args.source_dir)
    if not works:
        parser.error("no CBETA works selected")

    refs: dict[str, dict[str, object]] = {}
    errors: dict[str, str] = {}
    for work_id in works:
        text, origin, error = collect(work_id, args.source_dir, args.refs_dir)
        if text is None:
            errors[work_id] = error or "unavailable"
            refs[work_id] = {"status": "unavailable", "detail": error, "origin": origin}
            continue
        if args.out_dir:
            (args.out_dir / f"ref_{work_id}.txt").write_text(text, encoding="utf-8", newline="\n")
        digest = sha256_text(text)
        want = expected.get(work_id)
        status = "unlisted" if want is None else ("verified" if want == digest else "drift")
        refs[work_id] = {
            "status": status,
            "sha256": digest,
            "historical_sha256": want,
            "characters": len(text),
            "origin": origin,
        }

    counts = {key: sum(1 for value in refs.values() if value.get("status") == key)
              for key in ("verified", "drift", "unlisted", "unavailable")}
    counts["total"] = len(refs)
    report = {
        "generator": "scripts/collate_refs.py",
        "rule_id": RULE_ID,
        "extraction_rule": EXTRACTION_RULE,
        "upstream_repo": UPSTREAM_REPO,
        "upstream_revision": args.upstream_revision or (upstream_revision(args.source_dir) if args.source_dir else "unrecorded"),
        "source_dir": str(args.source_dir) if args.source_dir else None,
        "refs_dir": str(args.refs_dir) if args.refs_dir else None,
        "out_dir": str(args.out_dir) if args.out_dir else None,
        "digest_manifest": str(verification_manifest) if verification_manifest else None,
        "counts": counts,
        "refs": refs,
        "errors": errors,
    }
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    if args.write_digest_manifest:
        write_digest_manifest(args.write_digest_manifest, refs)

    print(f"references: {counts['total']} work(s)")
    print(f"digest verification: {counts['verified']} verified, {counts['drift']} drift, "
          f"{counts['unlisted']} unlisted, {counts['unavailable']} unavailable"
          + (f" (against {verification_manifest.name})" if verification_manifest else ""))
    for work_id, detail in sorted(errors.items()):
        print(f"❌ {work_id}: {detail}", file=sys.stderr)
    if errors:
        return 1
    drifted = sorted(w for w, v in refs.items() if v.get("status") == "drift")
    if drifted:
        print(f"⚠️  {len(drifted)} drifted reference(s): {', '.join(drifted[:10])}"
              + (" …" if len(drifted) > 10 else ""))
    if (args.require_verified and (drifted or counts["unlisted"])) or (drifted and not args.allow_drift):
        print("❌ reference drift: record it explicitly (see collate_corpus.py "
              "--compare-historical-refs) or fix the pinned upstream revision", file=sys.stderr)
        return 1
    print("✅ reference extraction/verification complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
