#!/usr/bin/env python3
"""Segment the pinned CBETA XML P5 witness T47n1987A (Caoshan Benji's Record, task 046).

Producer for the Caoshan Benji ingest (task 046, P1-3, 2026-09-20). It reads one file — the pinned
witness `T/T47/T47n1987A.xml` of `cbeta-org/xml-p5` at revision
`dbdea41071e1e260ad84b72faefd4587333cf76d` — plus the digest-verified reference extraction of that
same witness (`ref_T47n1987A.txt`), and writes the corpus-shaped document
`data/corpus/caoshan_benji.json`, a per-unit locator map, and a machine-readable extraction report.

The witness and the master
--------------------------
`T47n1987A` is 撫州曹山元證禪師語錄 — the Taishō record of **Caoshan Benji** (曹山本寂, 840–901),
Dongshan Liangjie's dharma heir and the second founder of the Caodong (曹洞) house. The record is
one fascicle, preceded by a Japanese-edition preface (寶曆十一年, 1761) and edited by 遠孫沙門慧印.
Its body carries the master's biography and records, the 五位君臣旨訣 (the Five Ranks of Lord and
Vassal) he is credited with formulating, and six appended treatises on the Caodong teaching
(解釋洞山五位顯訣, 逐位頌竝注別揀, 五位旨訣, 三種墮, 四種異類, 三然燈). The sibling part of the same
Taishō number, `T47n1987B` 撫州曹山本寂禪師語錄 (the Japanese 曹洞語錄 recension), is *not* claimed
here: this document is a single-witness extraction, and 1987B is carried as a probe reference, so
the collator records it as an `also_in` cross-witness rather than as a witness of this text.

Representation (the record partitioned into contiguous units)
------------------------------------------------------------
Every unit is a verbatim, contiguous run of the pinned witness under the extraction rule in
`scripts/collate_refs.py` (`cbeta-p5-body-cjk-v1`: drop `tei:note`/`tei:g` subtrees keeping tails,
keep heads, CJK-only). The units are the witness's own structural blocks, in document order:

  * **preface** — the `cb:div type="xu"` front matter (its 目録 title line, its `head` and the
    editorial preface). One unit.
  * **heading** — the fascicle opening block: the `cb:juan` element's `jhead`
    (撫州曹山元證禪師語錄) plus the following `byline` (遠孫沙門慧印校訂). One unit.
  * **record** — each direct `p` of the main record `cb:div type="other"`: the biographical
    opening, the 五位君臣旨訣 passage, and the individual encounters/问答 that follow
    (雲門, 鏡清, 紙衣道者, 陸亙, 溈山 … down to the master's death record). 75 units.
  * **treatise** — each of the six remaining `cb:div type="other"` blocks, whole: 解釋洞山五位顯訣,
    逐位頌竝注別揀, 五位旨訣, 三種墮, 四種異類, 三然燈 (each carrying its own 目録 title line, head,
    and byline where the witness prints one). 6 units.
  * **end** — the fascicle close heading (`jhead` 撫州曹山元證禪師語錄終). One unit.

The units tile the whole reference extraction exactly: the producer asserts that the concatenation
of the unit texts equals the pinned reference text, character for character, so no run of the
witness is omitted, duplicated, or invented. Case locators anchor at the `lb` line head printed
before each unit, with the last `lb` inside the unit as its closing line (the Congrong Lu
convention).

Project labels, witness text
----------------------------
`title_zh` for the units whose witness prints a 目録/`jhead` title is that title verbatim. For the
record units the witness prints no heading at all, so `title_zh` is the unit's own first
`RECORD_TITLE_CHARS` CJK characters — a verbatim prefix of the witness, never a paraphrase. Every
`title_en`, and `speaker`, is project-authored metadata (the witness carries no romanization and no
translation); the Chinese source fields are witness text only.

Usage:
    python3 scripts/segment_caoshan_benji.py --source-dir /tmp/xmlp5 \\
        --ref /tmp/refs/ref_T47n1987A.txt \\
        --out data/corpus/caoshan_benji.json \\
        --locators-out data/staging/caoshan_benji_locators.json \\
        --report data/staging/caoshan_benji_extraction_report.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

sys.path.insert(0, str(Path(__file__).resolve().parent))
import collate_refs  # noqa: E402 - the pinned extraction rule lives there, not here

WORK_ID = "T47n1987A"
TAISHO_VOL = 47
UPSTREAM_REVISION = "dbdea41071e1e260ad84b72faefd4587333cf76d"
#: The pinned witness file's sha256 at UPSTREAM_REVISION (104,787 bytes).
WITNESS_SHA256 = "d0d0336d02c420f9b614be9a138322eb2ff4870853c5c8ac4afdca00342d1cfe"
#: CJK character count of the pinned reference extraction of this witness (37,029 bytes).
REF_CJK = 12_343
#: Characters of a record unit's own text used as its project-facing `title_zh` (verbatim prefix).
RECORD_TITLE_CHARS = 12
#: The six appended treatises, in witness order, with their project-facing English labels.
TREATISE_LABELS = {
    "解釋洞山五位顯訣": "Treatise · Explaining Dongshan's Five Ranks",
    "逐位頌竝注別揀": "Treatise · Verse for Each Rank, with Annotation",
    "五位旨訣": "Treatise · The Essential Teaching of the Five Ranks",
    "三種墮": "Treatise · The Three Falls",
    "四種異類": "Treatise · The Four Kinds of Different-Class Sojourn",
    "三然燈": "Treatise · The Three Lamps (Before, After, Exactly Now)",
}

SOURCE_EDITION = (f"CBETA XML P5 {WORK_ID} (T47 no. 1987A 撫州曹山元證禪師語錄), "
                  f"revision {UPSTREAM_REVISION}")

TEI = collate_refs.TEI_NS
TEI_NS_URI = TEI["tei"]
DROP = collate_refs.DROP_SUBTREE_TAGS


def localname(element: ET.Element) -> str:
    return element.tag.split("}")[-1]


def element_text(element: ET.Element) -> str:
    """Document-order text of one element under the pinned rule (dropped subtrees keep tails)."""
    parts: list[str] = []

    def visit(node: ET.Element) -> None:
        if node.text:
            parts.append(node.text)
        for child in node:
            if localname(child) not in DROP:
                visit(child)
            if child.tail:
                parts.append(child.tail)

    visit(element)
    return collate_refs.cjk_only("".join(parts))


def child_by_localname(element: ET.Element, name: str) -> ET.Element | None:
    """The witness mixes TEI elements with CBETA-namespace ones (`cb:mulu`, `cb:juan`), so
    structural lookups are by local name, not by namespace-qualified tag."""
    return next((child for child in element if localname(child) == name), None)


def body_of(root: ET.Element) -> ET.Element:
    body = root.find(".//tei:text/tei:body", TEI)
    if body is None:
        raise SystemExit("the CBETA file has no tei:text/tei:body element")
    return body


class Structure:
    """Everything the segmentation needs, collected in one document-order walk."""

    def __init__(self) -> None:
        self.offset = 0
        self.lb_marks: list[tuple[int, str]] = []      # (ref offset, lb n attribute)
        self.span: dict[int, tuple[int, int]] = {}     # id(element) -> (start, end)
        self.mulus: list[tuple[int, int, str, ET.Element]] = []   # (start, end, text, el)
        self.jheads: list[tuple[int, int, str]] = []   # (start, end, text) for a juan's jhead
        self.bylines: list[tuple[int, int, str]] = []
        self.juan_open: list[tuple[int, int]] = []     # spans of the open/close juan jheads

    @property
    def length(self) -> int:
        return self.offset


def walk(body: ET.Element, structure: Structure) -> None:
    def visit(node: ET.Element) -> None:
        if node.text:
            structure.offset += len(collate_refs.cjk_only(node.text))
        node_is_juan = localname(node) == "juan" and node.get("fun") in ("open", "close")
        for child in node:
            name = localname(child)
            if name in DROP:
                if child.tail:
                    structure.offset += len(collate_refs.cjk_only(child.tail))
                continue
            if name == "lb" and child.get("n"):
                structure.lb_marks.append((structure.offset, child.get("n")))
            child_start = structure.offset
            visit(child)
            child_end = structure.offset
            structure.span[id(child)] = (child_start, child_end)
            if name == "mulu":
                text = element_text(child)
                if child_end - child_start != len(text):
                    raise SystemExit(f"mulu at {child_start}: span length {child_end - child_start} "
                                     f"!= serialized length {len(text)}")
                structure.mulus.append((child_start, child_end, text, child))
            if name == "jhead" and node_is_juan:
                text = element_text(child)
                if child_end - child_start != len(text):
                    raise SystemExit(f"jhead at {child_start}: span length {child_end - child_start} "
                                     f"!= serialized length {len(text)}")
                structure.jheads.append((child_start, child_end, text))
                structure.juan_open.append((child_start, child_end))
            if name == "byline":
                structure.bylines.append((child_start, child_end, element_text(child)))
            if child.tail:
                structure.offset += len(collate_refs.cjk_only(child.tail))

    visit(body)


def build(source_dir: Path, ref_path: Path) -> tuple[dict, dict, dict]:
    xml_path = source_dir / WORK_ID[0] / WORK_ID[:3] / f"{WORK_ID}.xml"
    raw = xml_path.read_bytes()
    if hashlib.sha256(raw).hexdigest() != WITNESS_SHA256:
        raise SystemExit(f"witness {xml_path} sha256 != pinned {WITNESS_SHA256}")
    root = ET.fromstring(raw)
    body = body_of(root)

    ref = ref_path.read_text(encoding="utf-8").rstrip("\n")
    text = collate_refs.cjk_only(collate_refs.serialize_body(body))
    if text != ref:
        raise SystemExit("the pinned-rule serialization of the witness does not byte-match "
                         f"the reference extraction (len {len(text)} vs {len(ref)})")
    if len(ref) != REF_CJK:
        raise SystemExit(f"reference extraction length {len(ref)} != {REF_CJK}")

    structure = Structure()
    walk(body, structure)
    if structure.length != len(ref):
        raise SystemExit(f"walk ended at offset {structure.length}, expected {len(ref)}")

    # --- the witness's own blocks, in document order -------------------------------------------
    divs = [child for child in body if localname(child) == "div"]
    if len(divs) != 8:
        raise SystemExit(f"expected 8 body-level divs (1 preface + 1 record + 6 treatises), "
                         f"found {len(divs)}")
    preface_divs = [div for div in divs if (div.get("type") or "") == "xu"]
    other_divs = [div for div in divs if (div.get("type") or "") == "other"]
    if len(preface_divs) != 1 or len(other_divs) != 7:
        raise SystemExit(f"div types do not match the pinned structure: type=xu {len(preface_divs)}, "
                         f"type=other {len(other_divs)}")
    preface = preface_divs[0]
    record_div = other_divs[0]
    treatise_divs = other_divs[1:]
    if any(child_by_localname(div, "mulu") is None for div in treatise_divs):
        # namespace-qualified lookup is spelled out here so a witness change is a failure, not a surprise
        raise SystemExit("a treatise div carries no 目録 title line in the pinned witness")

    record_ps = [child for child in record_div if localname(child) == "p"]
    if len(record_ps) != 75:
        raise SystemExit(f"the main record div has {len(record_ps)} direct p elements, expected 75")
    if any(localname(child) not in ("p", "lb", "pb", "anchor", "milestone")
           for child in record_div if localname(child) not in DROP):
        raise SystemExit("the main record div carries a child kind the pinned partition does not cover")

    jheads = structure.jheads
    if len(jheads) != 2:
        raise SystemExit(f"expected exactly 2 juan jhead elements (open, close), found {len(jheads)}")
    open_head, close_head = jheads[0], jheads[1]
    byline = structure.bylines[0] if structure.bylines else None
    if byline is None:
        raise SystemExit("the pinned witness prints no byline")

    # --- the units: [preface] [juan head + byline] [75 record paragraphs] [6 treatises] [close] --
    units: list[dict] = []

    def add(kind: str, start: int, end: int, title_zh: str, title_en: str) -> None:
        if not (0 <= start < end <= len(ref)):
            raise SystemExit(f"{kind} unit span {start}:{end} is outside the reference")
        zh = ref[start:end]
        if not zh:
            raise SystemExit(f"{kind} unit at {start}:{end} is empty")
        if collate_refs.cjk_only(zh) != zh:
            raise SystemExit(f"{kind} unit at {start}:{end} is not pure CJK under the pinned rule")
        units.append({"kind": kind, "start": start, "end": end, "title_zh": title_zh,
                      "title_en": title_en})

    preface_start, preface_end = structure.span[id(preface)]
    add("preface", preface_start, preface_end, element_text(child_by_localname(preface, "mulu")),
        "Preface · Caoshan's Record")

    head_start = structure.span[id(preface)][1]
    head_end = byline[1] if byline else open_head[1]
    add("heading", head_start, head_end, open_head[2], "Fascicle opening heading")

    for index, paragraph in enumerate(record_ps, start=1):
        start, end = structure.span[id(paragraph)]
        zh = ref[start:end]
        add("record", start, end, zh[:RECORD_TITLE_CHARS], f"Record {index} · Caoshan Benji")

    for div in treatise_divs:
        title = element_text(child_by_localname(div, "mulu"))
        add("treatise", *structure.span[id(div)], title, TREATISE_LABELS[title])

    add("end", close_head[0], close_head[1], close_head[2], "Close of the record")

    # --- partition assertion: the units tile the whole reference exactly ------------------------
    cursor = 0
    for unit in units:
        if unit["start"] != cursor:
            raise SystemExit(f"the units do not tile the reference: {unit['kind']} unit starts at "
                             f"{unit['start']}, expected {cursor}")
        cursor = unit["end"]
    if cursor != len(ref):
        raise SystemExit(f"the units stop at {cursor}; the reference extraction is {len(ref)}")
    rebuilt = "".join(ref[unit["start"]:unit["end"]] for unit in units)
    if rebuilt != ref:
        raise SystemExit("the concatenation of the unit texts does not equal the reference extraction")

    # --- case assembly and locators -------------------------------------------------------------
    def lb_lines(start: int, end: int) -> tuple[str, str]:
        head_line = None
        close_line = None
        for offset, n in structure.lb_marks:
            if offset <= start:
                head_line = n
            elif offset < end:
                close_line = n
            else:
                break
        if head_line is None:
            raise SystemExit(f"no line head before unit at {start}")
        return head_line, (close_line or head_line)

    cases: list[dict] = []
    case_locators: dict[str, dict] = {}
    census: dict[str, int] = {}
    unit_report: list[dict] = []
    for number, unit in enumerate(units, start=1):
        zh = ref[unit["start"]:unit["end"]]
        head_line, close_line = lb_lines(unit["start"], unit["end"])
        cases.append({
            "case_num": number,
            "kind": unit["kind"],
            "title_zh": unit["title_zh"],
            "title_en": unit["title_en"],
            "dialogue": [{"speaker": "錄 / The Record", "zh": zh, "pinyin": ""}],
            "locator": {
                "taisho": f"{WORK_ID} (T47 no. 1987A)",
                "page_line": head_line,
                "case_close_line": close_line,
                "source_edition": SOURCE_EDITION,
            },
        })
        case_locators[str(number)] = {
            "canonical_locator": (f"T1987A · {unit['title_zh']} · p.{head_line}–p.{close_line}"),
            "status": "collated_with_normalization",
            "note": (f"Unit {unit['title_zh']!r} ({unit['kind']}) and line head {head_line} read "
                     f"from the pinned CBETA XML P5 {WORK_ID} (revision {UPSTREAM_REVISION}); the "
                     "unit's text is verbatim in that extraction under the pinned rule "
                     "(tei:note/tei:g apparatus dropped, no rewording), which is the documented "
                     "normalization; human sign-off pending."),
            "collation_note": ("The unit's single source field collates verbatim to the pinned "
                               "witness; the locator anchors the unit at its line head."),
            "source_edition": SOURCE_EDITION,
        }
        census[unit["kind"]] = census.get(unit["kind"], 0) + 1
        unit_report.append({
            "case_num": number,
            "kind": unit["kind"],
            "span": [unit["start"], unit["end"]],
            "cjk": len(zh),
            "title_zh": unit["title_zh"],
            "page_line": head_line,
            "case_close_line": close_line,
        })
    zh_chars = sum(len(case["dialogue"][0]["zh"]) for case in cases)
    if zh_chars != len(ref):
        raise SystemExit(f"unit texts sum to {zh_chars}; the reference extraction is {len(ref)}")

    record_titles = [case["title_zh"] for case in cases if case["kind"] == "record"]
    document = {
        "id": "caoshan_benji",
        "title_zh": "撫州曹山元證禪師語錄",
        "title_pinyin": "Fǔzhōu Cáoshān Yuánzhèng Chánshī Yǔlù",
        "title_en": "The Record of Caoshan Benji (Caoshan Yuanzheng Chanshi Yulu)",
        "cbeta_id": "T1987A",
        "taisho_vol": TAISHO_VOL,
        "author_zh": "唐 曹山本寂 說 / 日本 遠孫沙門慧印 校訂",
        "author_en": ("Spoken by Caoshan Benji (840–901); edition collated by the Japanese monk "
                      "Huiyin (Eiin), published 1761 (寶曆十一年)"),
        "era": "Late Tang Dynasty (9th century); Japanese edition 1761",
        "genre": "Caodong Cornerstone / Discourse Record (語錄, 五位君臣)",
        "overview": (
            "The Taishō record of Caoshan Benji (曹山本寂, 840–901), Dongshan Liangjie's dharma "
            "heir and the second founder of the Caodong (曹洞) house: his biography and encounter "
            "records, the 五位君臣旨訣 (Five Ranks of Lord and Vassal) that the tradition credits "
            "to him, and the six appended treatises on the Caodong teaching "
            "(解釋洞山五位顯訣, 逐位頌竝注別揀, 五位旨訣, 三種墮, 四種異類, 三然燈). This record "
            "carries the whole fascicle — preface, record, treatises and close — verbatim."
        ),
        "unit_structure": census,
        "cases": cases,
        "coverage_note": (
            f"All {len(cases)} units are verbatim and contiguous in the claimed witness {WORK_ID} "
            f"under the pinned extraction rule (scripts/collate_refs.py `cbeta-p5-body-cjk-v1`, "
            f"CBETA XML P5 revision {UPSTREAM_REVISION}); the producer asserts that their "
            f"concatenation equals the reference extraction character for character "
            f"({len(ref)} CJK characters in total). The fascicle is partitioned into "
            f"{census.get('preface', 0)} preface unit, {census.get('heading', 0)} opening-heading "
            f"unit, {census.get('record', 0)} record units (one per direct paragraph of the main "
            f"record: the biography, the 五位君臣旨訣 passage, and the individual encounters), "
            f"{census.get('treatise', 0)} treatise units and {census.get('end', 0)} closing unit; "
            "nothing is omitted, reordered or duplicated. Project labels are metadata, not source "
            "text: the units whose witness prints a 目録 or jhead title carry it verbatim as "
            f"`title_zh`; the record units carry their own first {RECORD_TITLE_CHARS} CJK "
            "characters, a verbatim prefix of the witness, because the witness prints them "
            "without any heading. Every `title_en` and every `speaker` is project-authored. This "
            "document represents the T47n1987A part of Taishō number 1987 only; the sibling part "
            "T47n1987B (撫州曹山本寂禪師語錄, the Japanese 曹洞語錄 recension) is a probe reference, "
            "not a claimed witness, and is not represented here. The witness's interlinear "
            "apparatus (tei:note/tei:g, including the 卍續-CB and 大 collation notes) is dropped "
            "by the pinned rule and is not represented. Representation does not establish "
            "complete selected-witness status, and source collation does not approve reuse."
        ),
        "cbeta_note": (
            f"Extracted 2026-09-20 from the pinned witness {WORK_ID} (CBETA XML P5 revision "
            f"{UPSTREAM_REVISION}, witness file sha256 {WITNESS_SHA256}); its reference extraction "
            "carries digest cdb2f4e2f2982ecfb4317e911cdfe96ff3ae6c7968f9909bbfbc6bde74768a18, "
            "which is byte-identical in the 2026-09-09 and the 2026-09-20 digest manifests, so the "
            "claim rests on a byte-verified reference with a verified historical anchor. The "
            "m-level witness title is 撫州曹山元證禪師語錄; the body head the extractor reads first "
            "is 曹山大師語錄序, and both belong to this one work. The master's name is read from "
            "the witness (師諱本寂，泉州莆田黃氏子 … 諡元證禪師). Related records are cited as "
            "probes rather than claimed witnesses: T47n1987B 撫州曹山本寂禪師語錄, X68n1315 古尊宿語錄 "
            "and T51n2076 景德傳燈錄 (the latter two carry Caoshan material about, not by, the "
            "master), and T48n2006 人天眼目, whose 曹洞宗 section carries a parallel recension of "
            "the 五位君臣旨訣 passage. English and pinyin titles are project-authored metadata "
            "(the witness carries no romanization); the Chinese source fields are witness text."
        ),
        "zh_chars": zh_chars,
    }
    report = {
        "work_id": WORK_ID,
        "upstream_revision": UPSTREAM_REVISION,
        "witness_sha256": hashlib.sha256(raw).hexdigest(),
        "reference_cjk": len(ref),
        "reference_sha256": hashlib.sha256(ref_path.read_bytes()).hexdigest(),
        "units": {
            "total": len(cases),
            **{kind: census.get(kind, 0) for kind in ("preface", "heading", "record", "treatise", "end")},
        },
        "record_title_chars": RECORD_TITLE_CHARS,
        "record_titles_unique": len(set(record_titles)) == len(record_titles),
        "unit_list": unit_report,
        "tiling": {"asserted": True, "concatenation_equals_reference": True, "cjk_total": len(ref)},
    }
    return document, {"documents": {"caoshan_benji": case_locators}}, report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", default="/tmp/xmlp5", type=Path,
                        help="checkout of cbeta-org/xml-p5 at the pinned revision")
    parser.add_argument("--ref", default="/tmp/refs/ref_T47n1987A.txt", type=Path,
                        help="the digest-verified reference extraction of the pinned witness")
    parser.add_argument("--out", required=True, type=Path, help="corpus-shaped document to write")
    parser.add_argument("--locators-out", type=Path, default=None,
                        help="per-unit locator map to write (merged into canonical_locators.json)")
    parser.add_argument("--report", type=Path, default=None,
                        help="machine-readable extraction report to write")
    args = parser.parse_args()

    document, locators, report = build(args.source_dir, args.ref)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(document, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"document written: {args.out} ({len(document['cases'])} units, {document['zh_chars']} CJK)")
    if args.locators_out:
        args.locators_out.parent.mkdir(parents=True, exist_ok=True)
        args.locators_out.write_text(json.dumps(locators, ensure_ascii=False, indent=1) + "\n",
                                     encoding="utf-8")
        print(f"locators written: {args.locators_out}")
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=1) + "\n",
                               encoding="utf-8")
        print(f"report written: {args.report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
