#!/usr/bin/env python3
"""Re-key the Record of Linji (task P2.9) from the pinned CBETA XML P5 witness T47n1985.

Producer for the Linji Yulu re-key (task P2.9, 2026-09-21). The corpus's previous
`linji_yulu` document was a project retelling: the 2026-09-09 W1 pass measured 0 of its
source-content fields EXACT in the claimed witness T47n1985, the owner-adopted R-A/R-B
remediation re-keyed 5 fields and labelled 3 kept 行錄 retellings (PR #32), and the
2026-09-21 purge removed the record altogether. This script rebuilds the document from
scratch out of the witness itself, in the same way `scripts/segment_full_witness.py`
rebuilt the six enthusiast-full documents:

* **one input pair** — the pinned witness `T/T47/T47n1985.xml` of `cbeta-org/xml-p5` at
  revision `dbdea41071e1e260ad84b72faefd4587333cf76d`, plus the digest-verified reference
  extraction of that witness (`ref_T47n1985.txt`, rule `cbeta-p5-body-cjk-v1` in
  `scripts/collate_refs.py`). No corpus record is read: nothing is copied from the purged
  retelling, and no other witness contributes a character.
* **a contiguous tiling** — the witness body is walked in document order counting CJK
  characters exactly as the pinned extraction rule serializes them; every `p`, `div` and
  `juan` element start is a unit boundary, plus the region start and end. Units are the
  consecutive boundary pairs, so they tile the whole extraction `[0, 16366)`. The script
  asserts at run time that the concatenation of the unit texts equals the reference
  extraction character for character, that the units' CJK sum equals the reference length,
  and that every unit's span is non-empty: no run of the witness is omitted, duplicated or
  invented.
* **sections, not cases** — the Record of Linji is a continuous yulu, not a numbered case
  collection, and the reader's `sections` schema (with per-section `unit_locators`) is what
  the earlier Linji locator pilot used; the document is therefore written with a `sections`
  collection whose entries carry `title_zh`, a `dialogue` array and a witness locator.
* **verbatim Chinese fields** — a section's `title_zh` is the witness's own 目録/`jhead`
  text where the witness prints one and otherwise the unit's own first
  `RECORD_TITLE_CHARS` CJK characters (a verbatim prefix, never a paraphrase); a
  `dialogue[0].zh` is the unit's whole text, verbatim and contiguous. Every `title_en` and
  every `speaker` is project-authored metadata, and the witness prints no romanization, so
  the dialogue `pinyin` fields are empty rather than invented.
* **locators** — each section carries `{source_id, reference, lb_range, taisho,
  source_edition}`: the head is the last `lb` line mark printed at or before the unit start
  (the Congronglu/Caoshan convention) and the close is the last `lb` inside the unit. The
  same anchors are published as `sections.<section_id>` unit locators for
  `data/canonical_locators.json`.

Pinned facts — the assertions that make a rerun a check rather than a rebuild: the witness
file's sha256 at the revision, the reference extraction's digest and CJK length, the region
bounds, the region CJK count and the unit count. A witness or reference change fails the run,
and a rerun reproduces `data/corpus/linji_yulu.json` byte for byte (sha256
`d1004987b6e9c886b58a6a6ea13a3f692c4037db424116d54cee7d15c70eb419`, recorded in the
extraction report).

Usage:
    python3 scripts/segment_linji_yulu.py --source-dir /tmp/xmlp5 --refs-dir /tmp/refs \\
        --out data/corpus/linji_yulu.json \\
        --locators-out sessions/P2_LINJI_YULU_2026-09-21_locators.json \\
        --report sessions/P2_LINJI_YULU_2026-09-21_extraction_report.json
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
import segment_full_witness as sfw  # noqa: E402 - the shared tiling walk + lb convention

WORK_ID = "T47n1985"
TAISHO_VOL = 47
UPSTREAM_REVISION = sfw.UPSTREAM_REVISION
EXTRACTED = "2026-09-21"
#: sha256 of `T/T47/T47n1985.xml` at UPSTREAM_REVISION (138,324 bytes).
WITNESS_SHA256 = "d095b9ca7e7b0c4818541889f16ae07bfbee04ff5812a7aa94c5108190c113d5"
#: sha256 of the digest-verified reference extraction of that witness (rule cbeta-p5-body-cjk-v1).
REF_SHA256 = "4317e5fa14996b3f414187adb4264f1d52efb303392402f797d6e2019aeb8359"
#: CJK character count of that reference extraction (16,366).
REF_CJK = 16_366
#: The tiled region: the whole extraction.
REGION = (0, 16_366)
UNITS = 107
#: Characters of an untitled unit's own text used as its project-facing `title_zh` (verbatim prefix).
RECORD_TITLE_CHARS = sfw.RECORD_TITLE_CHARS
SOURCE_ID = "linji-yulu"

#: Curated project-facing English labels for the witness's own headings (keyed by title_zh).
EN_LABELS = {
    "臨濟慧照玄公大宗師語錄序": "Preface to the Record of Linji Hui Zhao (元 preface: 目録 and head, verbatim)",
    "鎮州臨濟慧照禪師語錄序": "Preface to the Zhenzhou Record of Linji (by Ma Fang 馬防, verbatim)",
    "鎮州臨濟慧照禪師語錄": "Fascicle opening heading (title and compiler byline, verbatim)",
    "勘辨": "Examination and Discrimination (勘辨 heading)",
    "行錄": "Conduct Record (行錄 heading)",
    "鎮州臨濟慧照禪師語錄終": "Fascicle close heading",
}

#: Curated stable `section_id`s for the passages the project names elsewhere (masters.json's
#: canonical anchor, the Linji locator pilot). Every other section id is generated from its
#: kind and ordinal, so the scheme is deterministic and reproducible.
SECTION_ID_OVERRIDES = {
    22: "true_person_of_no_rank",   # 上堂云赤肉團上有一無位真人… (T47n1985_p0496c10)
    78: "four_shouts",             # 師問僧有時一喝如金剛王寶劍… (T47n1985_p0504a26)
    84: "conduct_record_biography",  # 師初在黃蘗會下… (the 行錄 biography opening)
    103: "death_record",           # 師臨遷化時據坐… (the master's death record)
}

COVERAGE_NOTE = (
    "All {units} sections are verbatim and contiguous in the claimed witness T47n1985 "
    "(鎮州臨濟慧照禪師語錄), under the pinned extraction rule (scripts/collate_refs.py "
    "`cbeta-p5-body-cjk-v1`, CBETA XML P5 revision {revision}). The producer "
    "scripts/segment_linji_yulu.py asserts at run time that the concatenation of the section texts "
    "equals the reference extraction character for character ({cjk} CJK characters, the whole "
    "witness), so nothing is omitted, reordered or duplicated. The sections are the witness's own "
    "blocks in document order: every `p`, every `div` lead and both 卷 headings open one section — "
    "the four 序 prefaces ({prefaces} sections), the record body ({record}), 勘辨 ({kanbian}), "
    "行錄 ({xinglu}), and the fascicle and printing close ({close}). `title_zh` is the block's own "
    "目録 or jhead text where the witness prints one and otherwise the section's first "
    "{record_title_chars} CJK characters, always a verbatim run of the witness and never a "
    "paraphrase; `dialogue[0].zh` is the section's whole text. Every `title_en` and every `speaker` "
    "is project-authored metadata; the witness prints no romanization, so no pinyin is invented for "
    "these sections (the `pinyin` fields are empty rather than reconstructed). The witness's "
    "interlinear apparatus (tei:note/tei:g) is dropped by the pinned rule and is not represented, "
    "and the historic 2026-08-10/2026-09-11 project retelling is not read, patched or carried over: "
    "this document is a new extraction from the witness alone. The parallel printing of the same "
    "master's record in the Guzunsu yulu anthology (X68n1315, opening 鎮州臨濟慧照禪師語錄 with its own "
    "惠然 attribution) is a different recension and is carried as a probe reference only, never "
    "merged and never cited in a section. Representation does not establish complete selected-witness "
    "status, and source collation does not approve reuse."
)

CBETA_NOTE = (
    "Extracted {date} from the pinned witness T47n1985 (CBETA XML P5 revision {revision}; witness file "
    "sha256 {witness_sha256}; reference extraction sha256 {ref_sha256}, {cjk} CJK characters under rule "
    "`cbeta-p5-body-cjk-v1`). English and pinyin titles are project-authored metadata (the witness "
    "carries no romanization); the Chinese source fields are witness text. Recension notes carried in "
    "the witness itself: the Taishō fascicle is the late-Yuan recension — its four 序 are the 元貞二年 "
    "(1296) preface by 林泉老人從倫, the 大德二年 (1298) preface by 郭天錫, the 五峯普秀 preface and 馬防's "
    "preface — printed with the 住三聖嗣法小師慧然集 compiler byline, the 住鎮州保壽嗣法小師延沼 行錄 colophon, the "
    "住大名府興化嗣法小師存獎校勘 line, and the Japanese 永享九年 (1437) 法性寺東經所 printing note at the close. "
    "The same Taishō number carries no second part; the parallel record in the Guzunsu yulu anthology "
    "(X68n1315) and the 景德傳燈錄 account (T51n2076) are probes, not witnesses of this document. The "
    "full-text collation is measured by scripts/collate_corpus.py --doc linji_yulu; the dated "
    "measurement and overlay registers live under sessions/."
)


def block_kind_for(structure: "sfw.Structure", start: int, end: int) -> str:
    """Kind of the body block a unit sits in: preface / record / kanbian / xinglu / colophon."""
    owner = None
    for (span_start, span_end, kind, element) in structure.elements:
        if kind != "div":
            continue
        if span_start <= start and end <= span_end and (
            owner is None or (span_end - span_start) < (owner[1] - owner[0])
        ):
            owner = (span_start, span_end, element)
    if owner is None:
        return "record"
    element = owner[2]
    div_type = element.get("type") or ""
    if div_type == "xu":
        return "preface"
    if div_type == "w":
        return "colophon"
    mulu = structure.mulus.get(id(element), "")
    if mulu == "勘辨":
        return "kanbian"
    if mulu == "行錄":
        return "xinglu"
    return "record"


BLOCK_LABELS = {
    "preface": "序 / Preface",
    "record": "語錄 / The Record",
    "kanbian": "勘辨 / Examination and Discrimination",
    "xinglu": "行錄 / Conduct Record",
    "colophon": "刊記 / Printing colophon",
}


def build(source_dir: Path, refs_dir: Path):
    xml_path = source_dir / WORK_ID[0] / WORK_ID[:3] / f"{WORK_ID}.xml"
    raw = xml_path.read_bytes()
    if hashlib.sha256(raw).hexdigest() != WITNESS_SHA256:
        raise SystemExit(f"witness {xml_path} sha256 != pinned {WITNESS_SHA256}")
    root = ET.fromstring(raw)
    body = root.find(".//tei:text/tei:body", sfw.TEI)
    if body is None:
        raise SystemExit(f"{WORK_ID}: the CBETA file has no tei:text/tei:body element")
    ref_path = refs_dir / f"ref_{WORK_ID}.txt"
    ref = ref_path.read_text(encoding="utf-8").rstrip("\n")
    if hashlib.sha256(ref_path.read_bytes()).hexdigest() != REF_SHA256:
        raise SystemExit(f"{WORK_ID}: reference extraction digest != pinned {REF_SHA256}")
    if len(ref) != REF_CJK:
        raise SystemExit(f"{WORK_ID}: reference extraction length {len(ref)} != pinned {REF_CJK}")
    text = collate_refs.cjk_only(collate_refs.serialize_body(body))
    if text != ref:
        raise SystemExit(f"{WORK_ID}: the pinned-rule serialization of the witness does not byte-match "
                         f"the reference extraction (len {len(text)} vs {len(ref)})")
    structure = sfw.Structure()
    sfw.walk(body, structure, top=True)
    if structure.length != len(ref):
        raise SystemExit(f"{WORK_ID}: walk ended at offset {structure.length}, expected {len(ref)}")

    start, end = REGION
    units = sfw.units_for(structure, start, end)
    if [start, end] != list(REGION):
        raise SystemExit(f"{WORK_ID}: region {start}:{end} != pinned {list(REGION)}")
    if end - start != REF_CJK:
        raise SystemExit(f"{WORK_ID}: region CJK {end - start} != pinned {REF_CJK}")
    if len(units) != UNITS:
        raise SystemExit(f"{WORK_ID}: {len(units)} units != pinned {UNITS}")
    cursor = start
    for unit in units:
        if unit["start"] != cursor or unit["end"] <= unit["start"]:
            raise SystemExit(f"{WORK_ID}: units do not tile the region: expected {cursor}, got {unit}")
        cursor = unit["end"]
    if cursor != end:
        raise SystemExit(f"{WORK_ID}: units stop at {cursor}, region ends at {end}")
    if "".join(ref[u["start"]:u["end"]] for u in units) != ref[start:end]:
        raise SystemExit(f"{WORK_ID}: section concatenation does not equal the region slice")

    sections: list[dict] = []
    locators: dict[str, dict] = {}
    report_units: list[dict] = []
    census: dict[str, int] = {}
    ordinal_by_kind: dict[str, int] = {}
    number = 0
    for unit in units:
        zh = ref[unit["start"]:unit["end"]]
        base_kind = unit["kind"]
        el = unit["el"]
        block = block_kind_for(structure, unit["start"], unit["end"])
        if base_kind == "juan-head":
            kind = "fascicle-heading"
        elif base_kind == "juan-close":
            kind = "fascicle-close"
        elif base_kind == "heading":
            kind = f"{block}-heading"
        elif base_kind == "record":
            kind = block if block != "preface" else "preface"
        else:
            kind = base_kind
        title_zh = ""
        if base_kind == "heading" and el is not None:
            mulu = structure.mulus.get(id(el), "")
            if mulu and zh.startswith(mulu) and len(zh) == 2 * len(mulu):
                title_zh = mulu
        if not title_zh and base_kind in ("juan-head", "juan-close") and el is not None:
            jhead = structure.jheads.get(id(el), "")
            if jhead and zh.startswith(jhead):
                title_zh = jhead
        if not title_zh:
            title_zh = zh[:RECORD_TITLE_CHARS]
        head_line, close_line = sfw.lb_lines(structure, unit["start"], unit["end"])
        number += 1
        ordinal_by_kind[kind] = ordinal_by_kind.get(kind, 0) + 1
        census[kind] = census.get(kind, 0) + 1
        section_id = SECTION_ID_OVERRIDES.get(number, f"{kind.replace('_', '-')}-{ordinal_by_kind[kind]:02d}")
        reference = f"T47n1985_p{head_line}–p{close_line}"
        title_en = EN_LABELS.get(title_zh)
        if title_en is None:
            title_en = {
                "fascicle-heading": f"Fascicle opening heading ({WORK_ID})",
                "fascicle-close": f"Fascicle close heading ({WORK_ID})",
            }.get(kind) or f"{BLOCK_LABELS.get(block, '語錄 / The Record')} {number} ({WORK_ID})"
        sections.append({
            "section_id": section_id,
            "kind": kind,
            "title_zh": title_zh,
            "title_en": title_en,
            "dialogue": [{"speaker": "錄 / The Record", "zh": zh, "pinyin": ""}],
            "locator": {
                "source_id": SOURCE_ID,
                "reference": reference,
                "lb_range": [head_line, close_line],
                "taisho": f"{WORK_ID} (T47 no. 1985)",
                "source_edition": f"CBETA XML P5 {WORK_ID}, revision {UPSTREAM_REVISION}",
            },
        })
        locators[f"sections.{section_id}"] = {
            "canonical_locator": reference,
            "status": "collated_with_normalization",
            "note": (f"Section {title_zh!r} ({kind}) and line head {head_line} read from the pinned "
                     f"CBETA XML P5 {WORK_ID} (revision {UPSTREAM_REVISION}); the section's text is "
                     "verbatim and contiguous in that extraction under the pinned rule "
                     "(tei:note/tei:g apparatus dropped, no rewording), which is the documented "
                     "normalization; human sign-off pending."),
            "collation_note": ("The section's single source field (`dialogue[0].zh`) collates verbatim "
                               "to the pinned witness, and the producer asserts that the 107 section "
                               "texts concatenate to the whole reference extraction; the locator "
                               "anchors the section at its `lb` line head and the last `lb` inside it."),
            "source_edition": (f"CBETA XML P5 {WORK_ID} (T47 no. 1985 鎮州臨濟慧照禪師語錄), "
                               f"revision {UPSTREAM_REVISION}"),
        }
        report_units.append({"section_num": number, "section_id": section_id, "kind": kind,
                             "span": [unit["start"], unit["end"]], "cjk": len(zh),
                             "title_zh": title_zh, "head_line": head_line, "close_line": close_line})
    content_cjk = sum(len(s["dialogue"][0]["zh"]) for s in sections)
    if content_cjk != REF_CJK:
        raise SystemExit(f"content CJK {content_cjk} != reference CJK {REF_CJK}")

    document = {
        "id": "linji_yulu",
        "title_zh": "鎮州臨濟慧照禪師語錄",
        "title_pinyin": "Zhènzhōu Línjì Huìzhào Chánshī Yǔlù",
        "title_en": ("The Record of Linji (臨濟語錄 / 鎮州臨濟慧照禪師語錄, T47n1985 — the whole "
                     "Taishō fascicle: prefaces, 語錄, 勘辨, 行錄 and close)"),
        "cbeta_id": "T1985",
        "taisho_vol": TAISHO_VOL,
        "author_zh": "唐 鎮州臨濟義玄 說 / 住三聖嗣法小師慧然 集",
        "author_en": ("Spoken by Linji Yixuan (臨濟義玄, d. 866), dharma heir of Huangbo Xiyun; the "
                      "record compiled by his heir Huiran of Sansheng (住三聖嗣法小師慧然集)"),
        "era": "Late Tang Dynasty (9th century); the printing recension is late Yuan (元貞二年 1296 / 大德二年 1298 prefaces)",
        "genre": "Linji Cornerstone / Discourse Record (語錄: 上堂, 示眾, 勘辨, 行錄)",
        "overview": (
            "The whole of CBETA T47n1985, the 鎮州臨濟慧照禪師語錄 — the record of Linji Yixuan, the "
            "founder of the Linji (Rinzai) house, as the Taishō printing preserves it: the four "
            "prefaces (the 元貞二年 1296 preface by 林泉老人從倫, the 大德二年 1298 preface by 郭天錫, 五峯普秀's "
            "preface and 馬防's 鎮州臨濟慧照禪師語錄序), the fascicle heading with the 慧然集 compiler byline, "
            "the record itself (the 府主王常侍 ascension, 赤肉團上有一無位真人, the 三玄三要 and 四料簡 "
            "teachings, 逢佛殺佛 and the long 示眾 addresses), the 勘辨 examinations (黃檗 at the rice "
            "kitchen, 普化, 大覺, 趙州, 麻谷, 龍牙 and the 四喝 passage), the 行錄 conduct record (the three "
            "blows under 黃檗, the 大愚 encounter, the 栽松 and 鋤地 exchanges, the pilgrimage to 溈山, "
            "鳳林 and 金牛, the final 正法眼藏 exchange with 三聖 and the death record) and the printing "
            "close (存獎校勘, the Japanese 永享九年 1437 法性寺東經所 note) — every section verbatim and "
            "contiguous, in the witness's own order."
        ),
        "unit_structure": dict(sorted(census.items())),
        "sections": sections,
        "coverage_note": COVERAGE_NOTE.format(
            units=len(sections), revision=UPSTREAM_REVISION, cjk=content_cjk,
            prefaces=census.get("preface-heading", 0) + census.get("preface", 0),
            record=census.get("record", 0), kanbian=census.get("kanbian", 0),
            xinglu=census.get("xinglu", 0),
            close=(census.get("fascicle-close", 0) + census.get("colophon-heading", 0)
                   + census.get("colophon", 0) + census.get("fascicle-heading", 0)),
            record_title_chars=RECORD_TITLE_CHARS,
        ),
        "cbeta_note": CBETA_NOTE.format(date=EXTRACTED, revision=UPSTREAM_REVISION,
                                        witness_sha256=WITNESS_SHA256, ref_sha256=REF_SHA256,
                                        cjk=content_cjk),
        "zh_chars": content_cjk,
    }
    report = {
        "kind": "linji-yulu-rekey",
        "document": "linji_yulu",
        "work_id": WORK_ID,
        "upstream_revision": UPSTREAM_REVISION,
        "witness_sha256": WITNESS_SHA256,
        "reference_sha256": REF_SHA256,
        "reference_cjk": REF_CJK,
        "region": list(REGION),
        "region_cjk": end - start,
        "units": len(sections),
        "kinds": dict(sorted(census.items())),
        "record_title_chars": RECORD_TITLE_CHARS,
        "content_cjk": content_cjk,
        "section_ids": [s["section_id"] for s in sections],
        "unit_list": report_units,
        "tiling": {"asserted": True, "concatenation_equals_region_slice": True},
    }
    return document, locators, report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--source-dir", default=Path("/tmp/xmlp5"), type=Path)
    parser.add_argument("--refs-dir", default=Path("/tmp/refs"), type=Path)
    parser.add_argument("--out", type=Path, default=None)
    parser.add_argument("--locators-out", type=Path, default=None)
    parser.add_argument("--report", type=Path, default=None)
    args = parser.parse_args()
    document, locators, report = build(args.source_dir, args.refs_dir)
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(document, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        digest = hashlib.sha256(args.out.read_bytes()).hexdigest()
        report["document_sha256"] = digest
        print(f"document written: {args.out} ({len(document['sections'])} sections, "
              f"{document['zh_chars']} CJK, sha256 {digest})")
    if args.locators_out:
        args.locators_out.parent.mkdir(parents=True, exist_ok=True)
        args.locators_out.write_text(
            json.dumps({"linji_yulu": locators}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"locators written: {args.locators_out} ({len(locators)})")
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"report written: {args.report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
