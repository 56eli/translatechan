#!/usr/bin/env python3
"""Segment the pinned CBETA XML P5 witness T51n2076 (Jingde Chuandeng Lu, 30 fascicles).

Producer for the full 30-fascicle ingestion (task 045, P1-2, 2026-09-20). It reads one file —
the pinned witness `T/T51/T51n2076.xml` of `cbeta-org/xml-p5` at revision
`dbdea41071e1e260ad84b72faefd4587333cf76d` — plus the digest-verified reference extraction of
that same witness (`ref_T51n2076.txt`), and writes the corpus-shaped document
`data/corpus/chuandenglu_full.json`, a per-case locator map, and a machine-readable
extraction report.

Representation (the full 30-fascicle text, partitioned into contiguous units):

  * **biography** — a `cb:div` entry whose `cb:mulu` name line is repeated by the entry's
    first paragraph (the witness's own convention: "第二十九祖慧可大師 … 第二十九祖慧可大師者
    武牢人也…"). The unit spans the name line through the end of the entry div.
  * **work** — a titled verse/prose work: the name line ends in a work-title character
    (語偈頌詩歌談記銘箴論義要讚章篇文表吟式首) or is in the explicit title set. Multi-part
    works (e.g. 誌公和尚十四科頌, 雲頂山僧德敷詩十首, 同安察禪師十玄談) are ONE unit whose
    text includes their nested sub-parts; the sub-parts' own short 目録 marks are carried
    inside the unit, not re-emitted as separate units.
  * **section** — every remaining contiguous run: fascicle heading lines, the generation
    tables of contents and 已上N人見錄/不錄 lists, the 諸方廣語 / 讚頌偈詩 / 銘記箴歌
    container heads. Sections exist so the 30 fascicles are represented in full — no run of
    the text is omitted, and none is invented.

Nested material is handled structurally, not by re-cutting: an entry's text ends at its last
direct paragraph/verse block, so entries the witness wraps inside another entry's div (e.g.
僧那禪師, 向居士 and 慧滿禪師 inside 第二十九祖慧可大師's div) become their own top-level
units; multi-part works keep their titled sub-verses as separate units nested in the parent
work unit, and those (the only) overlaps are recorded in the report with their character
counts. Front matter (before the fascicle-1 heading) and the appended matter (after the
fascicle-30 heading) lie outside the 30 fascicles and are disclosed by exact character count
in the document's `coverage_note`.

Every Chinese field is asserted to be a verbatim, contiguous run of the witness under the
pinned extraction rule in `scripts/collate_refs.py` (`cbeta-p5-body-cjk-v1`: drop
`tei:note`/`tei:g` subtrees keeping tails, keep heads, CJK-only), so a re-run cannot
silently drift. Case locators anchor at the `lb` line head printed before each unit (the
Congrong Lu convention) with the last `lb` inside the unit as the closing line.

Usage:
    python3 scripts/segment_chuandenglu.py --source-dir /tmp/xmlp5 \
        --ref /tmp/refs/ref_T51n2076.txt \
        --out data/corpus/chuandenglu_full.json \
        --locators-out data/staging/chuandenglu_full_locators.json \
        --report data/staging/chuandenglu_full_extraction_report.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

sys.path.insert(0, str(Path(__file__).resolve().parent))
import collate_refs  # noqa: E402 - the pinned extraction rule lives there, not here

WORK_ID = "T51n2076"
TAISHO_VOL = 51
UPSTREAM_REVISION = "dbdea41071e1e260ad84b72faefd4587333cf76d"
#: The pinned witness file's sha256 at UPSTREAM_REVISION (3,658,989 bytes).
WITNESS_SHA256 = "41e4717ce9c71ff6892f8a83d6a28438cf67a1dc09e8e938165b1222daa9e40e"
#: CJK character count of the pinned reference extraction of this witness.
REF_CJK = 358_501
N_FASCICLES = 30

SOURCE_EDITION = (f"CBETA XML P5 {WORK_ID} (T51 no. 2076 景德傳燈錄), revision {UPSTREAM_REVISION}")

#: Final character of a work title. A 目録 name ending in one of these is a titled work
#: (sayings/verses/inscriptions), not a person, even when its body does not repeat the name
#: (e.g. 禪門規式, 黃蘗希運禪師傳心法要, 雲頂山僧德敷詩十首).
WORK_END = set("語偈頌詩歌談記銘箴論義要讚章篇文表吟式首")
#: Individual works whose titles end in no work-title character; each is a single titled
#: work in the witness (the set is asserted by the per-fascicle census audit).
WORK_EXPLICIT: set[str] = {
    "菩提達磨略辨大乘入道四行",   # fasc. 30 — Bodhidharma's Four Practices, ends in 行
    "南嶽石頭和尚參同契",         # fasc. 30 — Shitou's Paramitantra, ends in 契
    "歸寂吟贈同住",               # fasc. 30 — a titled gatha, ends in 住
}
#: Entries whose first paragraph opens on a variant of the 目録 name (a place name
#: substituted or dropped: 洛京… -> 京兆…, 幽州盤山第二世和尚 -> 盤山和尚,
#: 金陵奉先慧同禪師 -> 昇州奉先寺淨照禪師慧同…). Each name is a person entry in the
#: pinned witness, asserted by the per-fascicle census audit.
ENTRIES_EXPLICIT: set[str] = {
    "慧滿禪師", "洛京衛國院道禪師", "幽州盤山第二世和尚", "洞山第三世師虔禪師",
    "仁王院俊禪師", "大龍山楚勛禪師", "白馬智倫禪師", "廣德周禪師",
    "廬山棲賢慧圓禪師", "金陵奉先慧同禪師", "第二世黃龍和尚", "天台普聞智勤禪師",
    "南獄慧思禪師",  # 目録 prints 獄 for 嶽; the entry text writes 衡嶽慧思禪師
}
#: Pure generation labels (第三世) are section heads, not entries; real names may embed
#: 第N世 (洞山第二世道全禪師), so only the bare form is excluded.
PURE_GENERATION_RE = re.compile(r"^第[一二三四五六七八九十百零]+世$")

TEI = collate_refs.TEI_NS
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


def body_of(root: ET.Element) -> ET.Element:
    body = root.find(".//tei:text/tei:body", TEI)
    if body is None:
        raise SystemExit("the CBETA file has no tei:text/tei:body element")
    return body


class Structure:
    """Everything the segmentation needs, collected in one document-order walk."""

    def __init__(self) -> None:
        self.offset = 0
        self.lb_marks: list[tuple[int, str]] = []          # (ref offset, lb n attribute)
        self.divs: list[dict] = []                          # {el, start, end} (end excludes own tail)
        self.heads: list[tuple[int, int, str]] = []         # (start, end, text) — head/jhead
        self.mulus: list[tuple[int, int, str, ET.Element]] = []  # (start, end, text, el)
        self.juans: list[tuple[str, str, int, int]] = []    # (fun, n, jhead start, jhead end)
        self.span: dict[int, tuple[int, int]] = {}          # id(element) -> (start, end)


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
            is_jhead_of_juan = name == "jhead" and node_is_juan
            visit(child)
            child_end = structure.offset
            structure.span[id(child)] = (child_start, child_end)
            if name == "div":
                structure.divs.append({"el": child, "start": child_start, "end": child_end})
            if is_jhead_of_juan:
                structure.juans.append((node.get("fun"), node.get("n") or "",
                                        child_start, child_end))
            if name == "head" or is_jhead_of_juan:
                text = element_text(child)
                if child_end - child_start != len(text):
                    raise SystemExit(f"{name} at {child_start}: span length {child_end - child_start} "
                                     f"!= serialized length {len(text)}")
                structure.heads.append((child_start, child_end, text))
            if name == "mulu":
                text = element_text(child)
                if child_end - child_start != len(text):
                    raise SystemExit(f"mulu at {child_start}: span length {child_end - child_start} "
                                     f"!= serialized length {len(text)}")
                structure.mulus.append((child_start, child_end, text, child))
            if child.tail:
                structure.offset += len(collate_refs.cjk_only(child.tail))

    visit(body)


def common_prefix_len(a: str, b: str) -> int:
    k = 0
    for ca, cb in zip(a, b):
        if ca != cb:
            break
        k += 1
    return k


def name_matches(name: str, body_text: str) -> bool:
    """The witness convention: the first paragraph of an entry repeats its 目録 name line
    (common prefix of length >= 2), or opens on a >= 3-character tail of it."""
    if common_prefix_len(name, body_text) >= 2:
        return True
    for length in range(min(16, len(name)), 2, -1):
        if body_text.startswith(name[-length:]):
            return True
    return False


def is_work_name(name: str) -> bool:
    return name[-1] in WORK_END or name in WORK_EXPLICIT


def _gap_name(structure: Structure, g_start: int, g_end: int, fallback: str) -> str:
    """The first head/目録 printed inside a gap; the fascicle's open heading when it has none."""
    marks = [m for m in structure.heads + structure.mulus if g_start <= m[0] < g_end]
    if marks:
        return min(marks, key=lambda m: m[0])[2]
    return fallback


def build(source_dir: Path, ref_path: Path) -> tuple[dict, dict, dict]:
    xml_path = source_dir / WORK_ID[0] / WORK_ID[:3] / f"{WORK_ID}.xml"
    raw = xml_path.read_bytes()
    if hashlib.sha256(raw).hexdigest() != WITNESS_SHA256:
        raise SystemExit(f"witness {xml_path} sha256 != pinned {WITNESS_SHA256}")
    root = ET.fromstring(raw)
    body = body_of(root)

    ref_file = ref_path.read_text(encoding="utf-8").rstrip("\n")
    text = collate_refs.cjk_only(collate_refs.serialize_body(body))
    if text != ref_file:
        raise SystemExit("the pinned-rule serialization of the witness does not byte-match "
                         f"the reference extraction (len {len(text)} vs {len(ref_file)})")
    if len(text) != REF_CJK:
        raise SystemExit(f"reference extraction length {len(text)} != {REF_CJK}")
    ref = text

    structure = Structure()
    walk(body, structure)
    if structure.offset != len(ref):
        raise SystemExit(f"walk ended at offset {structure.offset}, expected {len(ref)}")

    # --- the 30-fascicle region and the fascicle of each position ---
    # The witness's juan markers do not always delimit the fascicle content: the open marker of
    # fascicle 13 is printed AFTER the fascicle's first entry (the 臨濟義玄 entry opens at
    # 129234, right after the fascicle-12 close heading, while its open heading prints at
    # 130860), and the fascicle-13 close heading prints inside its last entry. The partition
    # is therefore global — the whole region from the fascicle-1 heading to the fascicle-30
    # close heading — and a unit belongs to the fascicle whose close-heading interval
    # [close_{N-1}_end, close_N_end) contains its start (close_0 = the region start). Both
    # irregularities are recorded in the report (units crossing a close heading; open headings
    # printed mid-fascicle).
    open_by_n: dict[int, tuple[int, int]] = {}
    close_by_n: dict[int, tuple[int, int]] = {}
    for fun, n, start, end in structure.juans:
        try:
            number = int(n)
        except ValueError:
            raise SystemExit(f"juan element with n attribute {n!r}")
        table = open_by_n if fun == "open" else close_by_n
        if number in table:
            raise SystemExit(f"duplicate {fun} juan n={n}")
        table[number] = (start, end)
    if set(open_by_n) != set(range(1, N_FASCICLES + 1)) or set(close_by_n) != set(range(1, N_FASCICLES + 1)):
        missing_open = sorted(set(range(1, N_FASCICLES + 1)) - set(open_by_n))
        missing_close = sorted(set(range(1, N_FASCICLES + 1)) - set(close_by_n))
        raise SystemExit(f"juan heads incomplete: missing open {missing_open} close {missing_close}")
    region_start = open_by_n[1][0]
    region_end = close_by_n[N_FASCICLES][1]
    for i in range(1, N_FASCICLES + 1):
        o_start, o_end = open_by_n[i]
        c_start, c_end = close_by_n[i]
        if not (o_start < o_end <= c_start < c_end):
            raise SystemExit(f"fascicle {i}: open heading {o_start}:{o_end} is not before "
                             f"close heading {c_start}:{c_end}")
        if i > 1 and o_start < close_by_n[i - 1][1]:
            raise SystemExit(f"fascicle {i}: open heading at {o_start} is before the "
                             f"fascicle {i - 1} close heading end")
    front_matter_cjk = region_start
    appended_matter_cjk = len(ref) - region_end
    fascicle_cjk = region_end - region_start
    # close_end[N] = end of the fascicle N close heading; close_end[0] is the region start
    # minus one so that fascicle 1's interval begins at region_start.
    close_end = [region_start - 1] + [close_by_n[i][1] for i in range(1, N_FASCICLES + 1)]

    def _fascicle_of(offset: int) -> int:
        for i in range(N_FASCICLES, 0, -1):
            if offset >= close_end[i - 1]:
                if offset < close_end[i]:
                    return i
                return N_FASCICLES
        raise SystemExit(f"offset {offset} is outside the 30-fascicle region")

    fasc_headings = {
        i: (ref[open_by_n[i][0]:open_by_n[i][1]], ref[close_by_n[i][0]:close_by_n[i][1]])
        for i in range(1, N_FASCICLES + 1)
    }

    # --- entry / work units ---
    mulu_span = {id(el): (start, end) for start, end, _text, el in structure.mulus}
    units: list[dict] = []  # {start, end, name, kind}
    for div in structure.divs:
        element = div["el"]
        kids = [child for child in element if localname(child) not in DROP]
        mulu_index = next((i for i, child in enumerate(kids) if localname(child) == "mulu"), None)
        if mulu_index is None:
            continue
        mulu_el = kids[mulu_index]
        name = element_text(mulu_el)
        if not (2 <= len(name) <= 16) or PURE_GENERATION_RE.match(name):
            continue
        after = kids[mulu_index + 1:]
        if any(localname(child) == "list" for child in after):
            continue  # generation table of contents / section container, not an entry
        body_children = [child for child in after if localname(child) in ("p", "lg")]
        if body_children:
            first_body = body_children[0]
            if not (name_matches(name, element_text(first_body)) or is_work_name(name)
                    or name in ENTRIES_EXPLICIT):
                continue
            kind = "work" if is_work_name(name) else "biography"
            # The witness wraps whole generation sections inside the last entry div of a
            # fascicle (e.g. 第三十三祖慧能大師's div runs through all of fascicle 26). The
            # entry's own text ends at its last direct paragraph/verse block; nested divs
            # after that are separate entries, represented by their own units.
            unit_end = max(structure.span[id(child)][1] for child in body_children)
        else:
            if not (any(localname(child) == "div" for child in after) and is_work_name(name)):
                continue  # narrative section head, not an entry
            kind = "work"  # multi-part work: name line + nested sub-parts
            unit_end = div["end"]
        start, _end = mulu_span[id(mulu_el)]
        if not (start < unit_end <= div["end"]):
            raise SystemExit(f"unit {name!r}: span {start}:{unit_end} is not inside its div "
                             f"ending {div['end']}")
        if not (region_start <= start and unit_end <= region_end):
            raise SystemExit(f"unit {name!r} at {start}:{unit_end} crosses the 30-fascicle region")
        units.append({"start": start, "end": unit_end, "name": name, "kind": kind})
    units.sort(key=lambda unit: unit["start"])

    # Overlaps: only a unit contained in an earlier unit (the witness nests entries).
    overlaps: list[tuple[str, str]] = []
    for i, outer in enumerate(units):
        for inner in units[i + 1:]:
            if inner["start"] < outer["end"]:
                if not (inner["start"] >= outer["start"] and inner["end"] <= outer["end"]):
                    raise SystemExit(f"units overlap non-nested: {outer['name']!r} vs {inner['name']!r}")
                overlaps.append((outer["name"], inner["name"]))
    overlap_cjk = 0
    for _outer, inner in overlaps:
        overlap_cjk += sum(u["end"] - u["start"] for u in units if u["name"] == inner)

    # Titled sub-verses nested inside a multi-part work (e.g. the fourteen 頌 inside
    # 大法眼禪師文益頌) are parts of that work, not person records: a unit contained in a
    # work unit inherits the work kind.
    work_units = [u for u in units if u["kind"] == "work"]
    for unit in units:
        if unit["kind"] != "biography":
            continue
        if any(w["start"] <= unit["start"] and unit["end"] <= w["end"] for w in work_units):
            unit["kind"] = "work"

    # --- section units: every remaining contiguous run inside the 30-fascicle region ---
    # A gap that runs over a fascicle boundary (close heading of N, open heading of N+1,
    # no entry between) is split at the boundary so each fascicle carries its own heading
    # and table of contents.
    boundaries = [close_end[i] for i in range(1, N_FASCICLES)]

    def gap_name(g_start: int, g_end: int) -> str:
        return _gap_name(structure, g_start, g_end,
                         fasc_headings[_fascicle_of(g_start)][0])

    section_units: list[dict] = []

    def add_gap(g_start: int, g_end: int) -> None:
        points = sorted({g_start, g_end} | {b for b in boundaries if g_start < b < g_end})
        for a, b in zip(points, points[1:]):
            section_units.append({"start": a, "end": b, "name": gap_name(a, b),
                                  "kind": "section"})

    cursor = region_start
    for unit in units:
        if unit["start"] > cursor:
            add_gap(cursor, unit["start"])
        cursor = max(cursor, unit["end"])
    if cursor < region_end:
        add_gap(cursor, region_end)
    section_units.sort(key=lambda unit: unit["start"])

    all_units = sorted(units + section_units, key=lambda unit: unit["start"])
    for a, b in zip(all_units, all_units[1:]):
        if b["start"] < a["end"] and a["kind"] != "section" and b["kind"] != "section":
            if not (a["start"] <= b["start"] and b["end"] <= a["end"]):
                raise SystemExit(f"units cross: {a['name']!r} vs {b['name']!r}")

    # --- partition assertion: units + sections tile the 30-fascicle region exactly ---
    merged: list[list[int]] = []
    for s, e in sorted((u["start"], u["end"]) for u in all_units):
        if merged and s <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    if merged != [[region_start, region_end]]:
        raise SystemExit(f"the 30-fascicle region is not tiled exactly by its units: {merged[:6]}…")

    # Witness irregularities, recorded (not asserted away): entries whose div runs past a
    # fascicle close heading, and open headings printed mid-fascicle.
    crossing_units = []
    for unit in units:
        for i in range(1, N_FASCICLES + 1):
            c_start, c_end = close_by_n[i]
            if unit["start"] < c_start < unit["end"]:
                crossing_units.append({"unit": unit["name"], "close_heading": f"fascicle {i}",
                                       "fascicle": _fascicle_of(unit["start"])})
    mid_fascicle_opens = [
        {"fascicle": i, "open_heading_at": open_by_n[i][0]}
        for i in range(2, N_FASCICLES + 1)
        if open_by_n[i][0] > close_by_n[i - 1][1]
    ]

    # --- case assembly ---
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
    per_fascicle: dict[str, dict[str, int]] = {}
    for number, unit in enumerate(all_units, start=1):
        fasc = _fascicle_of(unit["start"])
        zh = ref[unit["start"]:unit["end"]]
        if not zh:
            raise SystemExit(f"case {number}: empty unit")
        if collate_refs.cjk_only(zh) != zh:
            raise SystemExit(f"case {number}: unit text is not pure CJK under the pinned rule")
        head_line, close_line = lb_lines(unit["start"], unit["end"])
        kind = unit["kind"]
        label = {"biography": "Biography", "work": "Work", "section": "Section"}[kind]
        cases.append({
            "case_num": number,
            "kind": kind,
            "fascicle": fasc,
            "title_zh": unit["name"],
            "title_en": f"Fascicle {fasc} · {label}",
            "dialogue": [{"speaker": "錄 / The Record", "zh": zh, "pinyin": ""}],
            "locator": {
                "taisho": f"{WORK_ID} fascicle {fasc}",
                "page_line": head_line,
                "case_close_line": close_line,
                "source_edition": SOURCE_EDITION,
            },
        })
        case_locators[str(number)] = {
            "canonical_locator": (f"T2076 fasc. {fasc} · {unit['name']} · "
                                  f"p.{head_line}–p.{close_line}"),
            "status": "collated_with_normalization",
            "note": (f"Unit {unit['name']!r} ({kind}, fascicle {fasc}) and line head {head_line} "
                     f"read from the pinned CBETA XML P5 {WORK_ID} (revision {UPSTREAM_REVISION}); "
                     "the unit's text is verbatim in that extraction under the pinned rule "
                     "(tei:note/tei:g apparatus dropped, no rewording), which is the documented "
                     "normalization; human sign-off pending."),
            "collation_note": (f"The unit's single source field collates verbatim to the pinned "
                               f"witness; the locator anchors the {kind} at its heading line."),
            "source_edition": SOURCE_EDITION,
        }
        bucket = per_fascicle.setdefault(str(fasc), {"biography": 0, "work": 0, "section": 0})
        bucket[kind] += 1
        census[kind] = census.get(kind, 0) + 1

    zh_chars = sum(len(case["dialogue"][0]["zh"]) for case in cases)
    if zh_chars != fascicle_cjk + overlap_cjk:
        raise SystemExit(f"unit texts sum to {zh_chars}; the fascicle text plus the recorded "
                         f"nested overlaps is {fascicle_cjk + overlap_cjk}")

    document = {
        "id": "chuandenglu_full",
        "title_zh": "景德傳燈錄",
        "title_pinyin": "Jǐngdé Chuándēng Lù",
        "title_en": "The Jingde Record of the Transmission of the Lamp",
        "cbeta_id": "T2076",
        "taisho_vol": TAISHO_VOL,
        "author_zh": "宋 東吳沙門 道原 纂",
        "author_en": "Compiled by Shi Daoyuan (Dongwu), presented to Emperor Zhenzong in 1004 CE",
        "era": "Northern Song Dynasty (1004 CE)",
        "genre": "Transmission of the Lamp / Universal Lineage History (傳燈錄)",
        "overview": (
            "The thirty-fascicle universal history of the Chan lineage compiled by Daoyuan in 1004: "
            "from the Seven Ancient Buddhas and the 28 Indian patriarchs through the six Chinese "
            "patriarchs, down through the recorded dharma heirs of the Nanyue and Qingyuan systems, "
            "the Chan masters of the time, and the closing fascicles of extended sayings, eulogies "
            "and verses. This record carries all thirty fascicles: every master's entry, every "
            "titled work, and the tables of contents and generation lists between them, verbatim."
        ),
        "fascicle_structure": [
            {"fascicle": i, "open_heading": open_zh, "close_heading": close_zh}
            for i, (open_zh, close_zh) in
            ((i, (fasc_headings[i][0], fasc_headings[i][1])) for i in range(1, N_FASCICLES + 1))
        ],
        "cases": cases,
        "coverage_note": (
            f"All {len(cases)} units are verbatim and contiguous in the claimed witness {WORK_ID} "
            f"under the pinned extraction rule (scripts/collate_refs.py `cbeta-p5-body-cjk-v1`, "
            f"CBETA XML P5 revision {UPSTREAM_REVISION}). The 30 fascicles ({fascicle_cjk} CJK "
            f"characters) are partitioned into {census.get('biography', 0)} biography units, "
            f"{census.get('work', 0)} work units and {census.get('section', 0)} section units "
            "(fascicle headings, tables of contents and generation lists); the partition tiles "
            "every fascicle exactly, asserted by the producer. The only overlaps are the titled "
            f"sub-verses the witness nests inside its multi-part works ({len(overlaps)} sub-units, "
            f"{overlap_cjk} CJK characters counted both inside the parent work and as their own "
            "units, listed in the extraction report). What the 30 fascicles do not contain is "
            "disclosed, not omitted: the front matter before the fascicle-1 heading "
            f"({front_matter_cjk} CJK characters: imperial edict, the petition for publication, "
            f"the Xilai chronology and the table of contents) and the matter appended after the "
            f"fascicle-30 heading ({appended_matter_cjk} CJK characters). The witness's "
            "interlinear apparatus (tei:note/tei:g) is dropped by the pinned rule and is not "
            "represented. Representation does not establish complete selected-witness status, "
            "and source collation does not approve reuse."
        ),
        "cbeta_note": (
            f"Extracted 2026-09-20 from the pinned witness {WORK_ID} (CBETA XML P5 revision "
            f"{UPSTREAM_REVISION}, witness file sha256 {WITNESS_SHA256}); its reference extraction "
            "carries digest a860907edd3d34b99927b157849b8ac45c5e6c134abd67cde7b6a3400797ab10 in "
            "both the 2026-09-09 and the 2026-09-20 digest manifests, so the claim rests on a "
            "byte-verified reference with a verified historical anchor. The sibling excerpt "
            "record `data/corpus/chuandenglu.json` (T2076/51, two sample records) is untouched; "
            "this record is a sibling representation of the full work, not a replacement of that "
            "manifest item. English and pinyin titles are project-authored metadata (the witness "
            "carries no romanization); the Chinese fields are witness text."
        ),
        "zh_chars": zh_chars,
    }
    report = {
        "work_id": WORK_ID,
        "upstream_revision": UPSTREAM_REVISION,
        "witness_sha256": hashlib.sha256(raw).hexdigest(),
        "reference_cjk": len(ref),
        "front_matter_cjk": front_matter_cjk,
        "appended_matter_cjk": appended_matter_cjk,
        "fascicle_cjk": fascicle_cjk,
        "overlap_cjk": overlap_cjk,
        "fascicle_spans": [
            {"fascicle": i,
             "interval": [close_end[i - 1] + (0 if i > 1 else 1), close_end[i]],
             "open_heading": [open_by_n[i][0], open_by_n[i][1]],
             "close_heading": [close_by_n[i][0], close_by_n[i][1]]}
            for i in range(1, N_FASCICLES + 1)
        ],
        "units": {
            "total": len(all_units),
            "biography": census.get("biography", 0),
            "work": census.get("work", 0),
            "section": census.get("section", 0),
        },
        "per_fascicle": per_fascicle,
        "overlaps": overlaps,
        "units_crossing_close_headings": crossing_units,
        "mid_fascicle_open_headings": mid_fascicle_opens,
        "partition_assertion": "the 30-fascicle region is tiled exactly by its units (asserted)",
        "zh_chars": zh_chars,
    }
    return document, {"chuandenglu_full": case_locators}, report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--source-dir", type=Path, default=Path("/tmp/xmlp5"))
    parser.add_argument("--ref", type=Path, default=Path("/tmp/refs/ref_T51n2076.txt"))
    parser.add_argument("--out", type=Path)
    parser.add_argument("--locators-out", type=Path)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()

    document, locators, report = build(args.source_dir, args.ref)
    for path, payload in ((args.out, document), (args.locators_out, locators), (args.report, report)):
        if path:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"units: {report['units']}")
    for fasc, counts in sorted(report["per_fascicle"].items(), key=lambda kv: int(kv[0])):
        print(f"  fasc {int(fasc):2d}: {counts}")
    print(f"overlaps: {report['overlaps']}")
    print(f"front matter: {report['front_matter_cjk']} CJK; appended: {report['appended_matter_cjk']} CJK")
    print(f"zh_chars: {report['zh_chars']} (fascicle text {report['fascicle_cjk']} + overlaps "
          f"{report['overlap_cjk']}; reference {report['reference_cjk']})")
