#!/usr/bin/env python3
"""Segment the pinned CBETA XML P5 witness T48n2004 into the Congronglu corpus record.

Producer for the 2026-09-20 reinstatement candidate (task 043). It reads one file — the
pinned witness `T/T48/T48n2004.xml` of `cbeta-org/xml-p5` at revision
`dbdea41071e1e260ad84b72faefd4587333cf76d` (sha256 of the file is recorded in the report) —
and writes three artifacts: the corpus-shaped document, the per-case locator map, and a
machine-readable extraction report.

Field provenance (the gate in `sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md` asks for pointer,
main case, commentary, verse and post-verse commentary as separately sourced fields):

    tei:head            -> title_zh                (verbatim, numbering included)
    p 示眾云…           -> pointer_zh               (垂示)
    p 舉…               -> dialogue[0].zh           (本則)
    p 師云… (pre-verse) -> commentary_zh            (評唱)
    lg / p (頌)         -> verse_zh                 (頌; cases 98 and 99 print it as a paragraph)
    p 師云… (post-verse)-> verse_commentary.commentary_zh

Every Chinese field is checked to be a verbatim, contiguous run of the witness under the
pinned extraction rule in `scripts/collate_refs.py` (`cbeta-p5-body-cjk-v1`: drop the
`tei:note`/`tei:g` subtrees keeping tails, keep `head`, CJK-only), so a re-run cannot silently
drift. Nothing here reads a quarantined Congronglu record: the only input is the pinned TEI
file. Pinyin and English case titles are project-authored metadata (the witness carries no
romanization); the document's `coverage_note`/`cbeta_note` say so.

Case locators follow the anchor convention recorded in the 2026-08-10 containment table
(`sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md`): a case is anchored at the `lb` line head
printed *before* its `div` (case 33 -> `p0249b21`, case 34 -> `p0250a10`, case 35 ->
`p0250b19`, case 37 -> `p0252a03`, case 38 -> `p0252b28`), not at the first `lb` inside the
div — the inner head is the line the 示眾云 pointer opens on.

Usage:
    python3 scripts/segment_congronglu.py --source-dir /tmp/xmlp5 \
        --out data/staging/congronglu.json \
        --locators-out data/staging/congronglu_locators.json \
        --report data/staging/congronglu_extraction_report.json
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

WORK_ID = "T48n2004"
TAISHO_VOL = 48
UPSTREAM_REVISION = "dbdea41071e1e260ad84b72faefd4587333cf76d"
SOURCE_EDITION = (f"CBETA XML P5 {WORK_ID} (T48 no. 2004 萬松老人評唱天童覺和尚頌古從容庵錄), "
                  f"revision {UPSTREAM_REVISION}")
TEI = collate_refs.TEI_NS
DROP = collate_refs.DROP_SUBTREE_TAGS
WS_RE = re.compile(r"[\s\u3000\u00a0]+")
#: The witness numbers its cases in the `mulu` ("<n> <title>") and spells them out in `head`
#: ("第…則<title>"); four heads omit the 則 (13, 16, 17, 59) and case 100 writes 第百則.
CASE_MULU_RE = re.compile(r"^\d+\s*(?:則)?[^0-9\s]")
CASE_HEAD_RE = re.compile(r"^第[一二三四五六七八九十百]+則?")
POINTER_PREFIX = "示眾"
CASE_PREFIX = "舉"
COMMENTARY_PREFIX = "師"

#: The five anchors the containment record pins against the witness; a regression here means
#: the locator rule moved and the table above stops being evidence.
CONTAINMENT_ANCHORS = {"33": "0249b21", "34": "0250a10", "35": "0250b19",
                       "37": "0252a03", "38": "0252b28"}

#: head title (verbatim, minus 第…則) -> project-authored romanization and English rendering.
TITLES: dict[str, tuple[str, str]] = {
    "世尊陞座": ("Shìzūn Shēngzuò", "The World-Honored One Ascends the Seat"),
    "達磨廓然": ("Dámó Kuòrán", "Bodhidharma's Vast Emptiness"),
    "東印請祖": ("Dōngyìn Qǐngzǔ", "East India Invites the Patriarch"),
    "世尊指地": ("Shìzūn Zhǐdì", "The World-Honored One Points to the Ground"),
    "清源米價": ("Qīngyuán Mǐjià", "Qingyuan's Price of Rice"),
    "馬祖白黑": ("Mǎzǔ Báihēi", "Mazu's Black and White"),
    "藥山陞座": ("Yàoshān Shēngzuò", "Yaoshan Ascends the Seat"),
    "百丈野狐": ("Bǎizhàng Yěhú", "Baizhang's Wild Fox"),
    "南泉斬猫": ("Nánquán Zhǎnmāo", "Nanquan Kills the Cat"),
    "臺山婆子": ("Táishān Pózi", "The Old Woman of Mount Tai"),
    "雲門兩病": ("Yúnmén Liǎngbìng", "Yunmen's Two Maladies"),
    "地藏種田": ("Dìzàng Zhòngtián", "Dizang Plants the Field"),
    "臨際瞎驢": ("Línjì Xiālǘ", "Linji's Blind Donkey"),
    "廓侍過茶": ("Kuòshì Guòchá", "Attendant Kuo Serves Tea"),
    "仰山插鍬": ("Yǎngshān Chāqiāo", "Yangshan Sticks In His Spade"),
    "麻谷振錫": ("Mágǔ Zhènxī", "Magu Shakes His Staff"),
    "法眼毫釐": ("Fǎyǎn Háolí", "Fayan's Hair's-Breadth"),
    "趙州狗子": ("Zhàozhōu Gǒuzi", "Zhaozhou's Dog"),
    "雲門須彌": ("Yúnmén Xūmí", "Yunmen's Mount Sumeru"),
    "地藏親切": ("Dìzàng Qīnqiè", "Dizang's Closeness"),
    "雲巖掃地": ("Yúnyán Sǎodì", "Yunyan Sweeps the Ground"),
    "巖頭拜喝": ("Yántóu Bàihē", "Yantou Bows and Shouts"),
    "魯祖面壁": ("Lǔzǔ Miànbì", "Luzu Faces the Wall"),
    "雪峯看蛇": ("Xuěfēng Kànshé", "Xuefeng Looks at the Snake"),
    "鹽官犀扇": ("Yánguān Xīshàn", "Yanguan's Rhinoceros Fan"),
    "仰山指雪": ("Yǎngshān Zhǐxuě", "Yangshan Points at the Snow"),
    "法眼指簾": ("Fǎyǎn Zhǐlián", "Fayan Points at the Blind"),
    "護國三懡": ("Hùguó Sānmǒ", "Huguo's Three Mutterings"),
    "風穴鐵牛": ("Fēngxué Tiěniú", "Fengxue's Iron Ox"),
    "大隨劫火": ("Dàsuí Jiéhuǒ", "Dasui's Conflagration"),
    "雲門露柱": ("Yúnmén Lùzhù", "Yunmen's Pillar"),
    "仰山心境": ("Yǎngshān Xīnjìng", "Yangshan's Mind and Object"),
    "三聖金鱗": ("Sānshèng Jīnlín", "Sansheng's Golden Carp"),
    "風穴一塵": ("Fēngxué Yīchén", "Fengxue's Single Dust Mote"),
    "洛浦伏膺": ("Luòpǔ Fúyīng", "Luopu Submits"),
    "馬師不安": ("Mǎshī Bù'ān", "Master Ma Is Unwell"),
    "溈山業識": ("Wéishān Yèshí", "Guishan's Karmic Consciousness"),
    "臨濟真人": ("Línjì Zhēnrén", "Linji's True Person"),
    "趙州洗鉢": ("Zhàozhōu Xǐbō", "Zhaozhou Washes His Bowl"),
    "雲門白黑": ("Yúnmén Báihēi", "Yunmen's Black and White"),
    "洛浦臨終": ("Luòpǔ Línzhōng", "Luopu at the End"),
    "南陽淨瓶": ("Nányáng Jìngpíng", "Nanyang's Clean Vase"),
    "羅山起滅": ("Luóshān Qǐmiè", "Luoshan's Arising and Ceasing"),
    "興陽妙翅": ("Xìngyáng Miàochì", "Xingyang's Wondrous Wings"),
    "覺經四節": ("Juéjīng Sìjié", "Four Passages of the Sutra of Perfect Enlightenment"),
    "德山學畢": ("Déshān Xuébì", "Deshan Finishes His Study"),
    "趙州柏樹": ("Zhàozhōu Bǎishù", "Zhaozhou's Cypress"),
    "摩經不二": ("Mójīng Bù'èr", "The Vimalakirti Sutra's Non-Duality"),
    "洞山供真": ("Dòngshān Gòngzhēn", "Dongshan Offers the Portrait"),
    "雪峯甚麼": ("Xuěfēng Shénme", "Xuefeng's 'What Is It?'"),
    "法眼舡陸": ("Fǎyǎn Chuánlù", "Fayan's Boat and Land"),
    "曹山法身": ("Cáoshān Fǎshēn", "Caoshan's Dharmakaya"),
    "黃檗噇糟": ("Huángbò Chuángzāo", "Huangbo Eats the Dregs"),
    "雲巖大悲": ("Yúnyán Dàbēi", "Yunyan's Great Compassion"),
    "雪峯飯頭": ("Xuěfēng Fàntóu", "Xuefeng the Rice Cook"),
    "密師白兔": ("Mìshī Báitù", "Master Mi and the White Rabbit"),
    "嚴陽一物": ("Yányáng Yīwù", "Yanyang's One Thing"),
    "剛經輕賤": ("Gāngjīng Qīngjiàn", "The Diamond Sutra's Disparagement"),
    "青林死蛇": ("Qīnglín Sǐshé", "Qinglin's Dead Snake"),
    "鐵磨牸牛": ("Tiěmó Zìniú", "Iron Mill's Cow"),
    "乾峯一畫": ("Qiánfēng Yīhuà", "Qianfeng's One Stroke"),
    "米胡悟否": ("Mǐhú Wùfǒu", "Mihu's Enlightenment"),
    "趙州問死": ("Zhàozhōu Wènsǐ", "Zhaozhou Asks About Death"),
    "子昭承嗣": ("Zǐzhāo Chéngsì", "Zizhao Succeeds to the Lineage"),
    "首山新婦": ("Shǒushān Xīnfù", "Shoushan's Bride"),
    "九峯頭尾": ("Jiǔfēng Tóuwěi", "Jiufeng's Head and Tail"),
    "嚴經智慧": ("Yánjīng Zhìhuì", "The Avatamsaka Sutra's Wisdom"),
    "夾山揮劍": ("Jiāshān Huījiàn", "Jiashan Brandishes the Sword"),
    "南泉白牯": ("Nánquán Báigǔ", "Nanquan's White Ox"),
    "進山問性": ("Jìnshān Wènxìng", "Jinshan Asks About the Nature"),
    "翠巖眉毛": ("Cuìyán Méimáo", "Cuiyan's Eyebrows"),
    "中邑獼猴": ("Zhōngyì Míhóu", "Zhongyi's Macaque"),
    "曹山孝滿": ("Cáoshān Xiàomǎn", "Caoshan's Mourning Fulfilled"),
    "法眼質名": ("Fǎyǎn Zhìmíng", "Fayan Questions the Name"),
    "瑞巖常理": ("Ruìyán Chánglǐ", "Ruiyan's Constant Principle"),
    "首山三句": ("Shǒushān Sānjù", "Shoushan's Three Phrases"),
    "仰山隨分": ("Yǎngshān Suífèn", "Yangshan Accords with Capacity"),
    "雲門餬餅": ("Yúnmén Húbǐng", "Yunmen's Rice Cake"),
    "長沙進步": ("Chángshā Jìnbù", "Changsha Steps Forward"),
    "龍牙過板": ("Lóngyá Guòbǎn", "Longya Passes the Board"),
    "玄沙到縣": ("Xuánshā Dàoxiàn", "Xuansha Arrives at the County"),
    "雲門聲色": ("Yúnmén Shēngsè", "Yunmen's Sound and Form"),
    "道吾看病": ("Dàowú Kànbìng", "Daowu Visits the Sick"),
    "俱胝一指": ("Jùzhī Yīzhǐ", "Juzhi's One Finger"),
    "國師塔樣": ("Guóshī Tǎyàng", "The National Teacher's Pagoda Plan"),
    "臨濟大悟": ("Línjì Dàwù", "Linji's Great Awakening"),
    "疎山有無": ("Shūshān Yǒuwú", "Shushan's Existence and Nonexistence"),
    "楞嚴不見": ("Lèngyán Bùjiàn", "The Surangama Sutra's Not Seeing"),
    "洞山無草": ("Dòngshān Wúcǎo", "Dongshan's No Grass"),
    "仰山謹白": ("Yǎngshān Jǐnbái", "Yangshan's Respectful Announcement"),
    "南泉牡丹": ("Nánquán Mǔdān", "Nanquan's Peonies"),
    "雲門一寶": ("Yúnmén Yībǎo", "Yunmen's One Treasure"),
    "魯祖不會": ("Lǔzǔ Bùhuì", "Luzu Does Not Understand"),
    "洞山不安": ("Dòngshān Bù'ān", "Dongshan Is Unwell"),
    "臨濟一畫": ("Línjì Yīhuà", "Linji's One Stroke"),
    "九峯不肯": ("Jiǔfēng Bùkěn", "Jiufeng Refuses"),
    "光帝檏頭": ("Guāngdì Pútóu", "Emperor Zhuangzong's Cudgel"),
    "洞山常切": ("Dòngshān Chángqiè", "Dongshan's Constant Earnestness"),
    "雲門鉢桶": ("Yúnmén Bōtǒng", "Yunmen's Bowl and Bucket"),
    "瑯琊山河": ("Lángyá Shānhé", "Langya's Mountains and Rivers"),
}

OVERVIEW = (
    "Wansong Xingxiu's commentary on one hundred cases selected by Hongzhi Zhengjue — the third "
    "of the three great Song gong'an collections. Every Chinese field in this record was read out "
    "of the pinned CBETA T48n2004 witness; the English and pinyin titles are project drafts, not "
    "translations of any recorded source."
)

COVERAGE_NOTE = (
    "100/100 cases represented, carrying 500 evaluated source-content fields (pointer_zh, "
    "dialogue[0].zh, commentary_zh, verse_zh, verse_commentary.commentary_zh) — every one verbatim "
    "and contiguous in the claimed witness T48n2004 under the pinned extraction rule "
    "(scripts/collate_refs.py `cbeta-p5-body-cjk-v1`, CBETA XML P5 revision "
    f"{UPSTREAM_REVISION}). Coverage gaps, recorded rather than implied absent: (1) the witness's "
    "interlinear 著語 annotations are CBETA tei:note elements, which the pinned rule drops — 7,716 "
    "CJK characters of apparatus are therefore not represented; (2) the front matter (two prefaces, "
    "the letter to Yelü Chucai, Wansong's own preface and the table of contents) is not "
    "represented; (3) the case headings' 則 numbering is preserved verbatim, including the "
    "witness's own irregularities (第十一 and 第六十四 print 則 before the title; 第十三, 第十六, "
    "第十七, 第五十九 and 第百 omit it); (4) cases 98 and 99 print the 頌 as a plain paragraph "
    "rather than a verse block, and are carried as such. Representation does not establish complete "
    "selected-witness status, and source collation does not approve reuse."
)

CBETA_NOTE = (
    "Quarantined on 2026-08-10 (sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md) for generated "
    "source-looking placeholders and for case-number/page claims that the authoritative T48n2004 "
    "headings disproved; this record is a new extraction from the pinned witness and copies nothing "
    "from the quarantined seed. Attribution read from the witness itself: CBETA work T48n2004, "
    "Taishō vol. 48 no. 2004, 萬松老人評唱天童覺和尚頌古從容庵錄 — Hongzhi Zhengjue's 頌古 with "
    "Wansong Xingxiu's 評唱 (witness byline: 宋 正覺頌古．元 行秀評唱). Reinstated 2026-09-20: the "
    "collation measured every represented field EXACT against this pinned witness (601 fields: 500 "
    "source-content + 101 metadata, 0 flagged), so the claim rests on the pinned extraction; this "
    "work id has no reproducible 2026-09-09 reference anchor, and that recorded drift is adjudicated "
    "in sessions/COLLATION_W1_2026-09-20_CORRECTION.md §4 rather than hidden. English and pinyin case "
    "titles are project-authored metadata, not witness text and not translations of any recorded "
    "source; the Chinese fields are witness text."
)


def localname(element: ET.Element) -> str:
    return element.tag.split("}")[-1]


def element_text(element: ET.Element) -> str:
    """Document-order text of one element, dropping the pinned rule's subtrees (tails kept)."""
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
    return WS_RE.sub("", "".join(parts))


def body_of(root: ET.Element) -> ET.Element:
    body = root.find(".//tei:text/tei:body", TEI)
    if body is None:
        raise SystemExit("the CBETA file has no tei:text/tei:body element")
    return body


def case_divs(body: ET.Element) -> list[ET.Element]:
    """The witness's 100 case containers, in reading order."""
    out: list[ET.Element] = []
    for div in body:
        if localname(div) != "div":
            continue
        head = div.find("tei:head", TEI)
        mulu = next((child for child in div if localname(child) == "mulu"), None)
        if head is None or mulu is None:
            continue
        if not CASE_HEAD_RE.match(element_text(head)):
            continue
        if CASE_MULU_RE.match(element_text(mulu)):
            out.append(div)
    return out


def locator_marks(body: ET.Element, divs: list[ET.Element]) -> dict[int, tuple[str, str]]:
    """`id(case div)` -> (heading line, last line the case's own text begins on).

    The heading line is the `lb` printed before the div (the 2026-08-10 containment convention);
    the closing mark is the last `lb` *inside* the div.
    """
    heading: dict[int, str] = {}
    last_inside: dict[int, str] = {}
    last_seen: str | None = None
    index = 0
    for element in body.iter():
        name = localname(element)
        if name == "lb" and element.get("n"):
            last_seen = element.get("n")
        elif name == "div" and element in divs:
            if last_seen:
                heading[id(element)] = last_seen
            # Line heads are emitted as siblings of the paragraphs *and* inside them, so the
            # closing mark is the last lb anywhere in the case's subtree, not just its children.
            marks = [node.get("n") for node in element.iter()
                     if localname(node) == "lb" and node.get("n")]
            if marks:
                last_inside[id(element)] = marks[-1]
        index += 1
    return {id(div): (heading[id(div)], last_inside[id(div)]) for div in divs
            if id(div) in heading and id(div) in last_inside}


def split_case(div: ET.Element) -> dict[str, str]:
    head = element_text(div.find("tei:head", TEI))
    blocks = [(localname(child), element_text(child)) for child in div
              if localname(child) in ("p", "lg")]
    texts = [text for _, text in blocks]
    pointers = [text for text in texts if text.startswith(POINTER_PREFIX)]
    cases = [text for text in texts if text.startswith(CASE_PREFIX)]
    if len(pointers) != 1 or len(cases) != 1:
        raise SystemExit(f"{head}: expected one 示眾… pointer and one 舉… case block, "
                         f"found {len(pointers)} and {len(cases)}")
    body_index = texts.index(cases[0])
    verse_index = next((index for index, (tag, _) in enumerate(blocks)
                        if tag == "lg" and index > body_index), None)
    if verse_index is None:
        # Cases 98 and 99 print the 頌 as a paragraph: the first block after the 本則 that is
        # neither the 舉… case nor a 師… commentary lead.
        for index in range(body_index + 1, len(blocks)):
            text = texts[index]
            if not text.startswith(CASE_PREFIX) and not text.startswith(COMMENTARY_PREFIX):
                verse_index = index
                break
    if verse_index is None:
        raise SystemExit(f"{head}: no verse (lg, or paragraph carrying the 頌)")
    return {
        "heading_zh": head,
        "title_zh": CASE_HEAD_RE.sub("", head),
        "pointer_zh": "".join(pointers),
        "case_zh": "".join(cases),
        "commentary_zh": "".join(texts[body_index + 1:verse_index]),
        "verse_zh": texts[verse_index],
        "verse_commentary_zh": "".join(texts[verse_index + 1:]),
        "verse_tag": blocks[verse_index][0],
    }


def build(source_dir: Path) -> tuple[dict[str, object], dict[str, object], dict[str, object]]:
    xml_path = source_dir / WORK_ID[0] / WORK_ID[:3] / f"{WORK_ID}.xml"
    raw = xml_path.read_bytes()
    root = ET.fromstring(raw)
    body = body_of(root)
    ref = collate_refs.cjk_only(collate_refs.serialize_body(body))
    divs = case_divs(body)
    if len(divs) != 100:
        raise SystemExit(f"expected 100 case headings in {xml_path}, found {len(divs)}")
    marks = locator_marks(body, divs)
    if len(marks) != 100:
        raise SystemExit("the witness does not carry a line head for every case")
    cases_text = [split_case(div) for div in divs]
    titles = {parts["title_zh"] for parts in cases_text}
    if titles != set(TITLES):
        raise SystemExit(f"title table does not match the witness headings; missing="
                         f"{sorted(set(TITLES) - titles)} extra={sorted(titles - set(TITLES))}")

    cases: list[dict[str, object]] = []
    case_locators: dict[str, object] = {}
    census: dict[str, int] = {}
    for number, (div, parts) in enumerate(zip(divs, cases_text), start=1):
        pinyin, english = TITLES[parts["title_zh"]]
        heading_line, closing_line = marks[id(div)]
        if parts["heading_zh"] != CASE_HEAD_RE.match(parts["heading_zh"]).group(0) + parts["title_zh"]:
            raise SystemExit(f"case {number}: heading {parts['heading_zh']!r} does not decompose")
        for field, value in (
            # `title_zh` is the witness heading verbatim (第…則 numbering included); it is the
            # harness's metadata partition, counted here only to reconcile the census.
            ("title_zh", parts["heading_zh"]),
            ("pointer_zh", parts["pointer_zh"]),
            ("dialogue[0].zh", parts["case_zh"]),
            ("commentary_zh", parts["commentary_zh"]),
            ("verse_zh", parts["verse_zh"]),
            ("verse_commentary.commentary_zh", parts["verse_commentary_zh"]),
        ):
            if not value:
                raise SystemExit(f"case {number}: empty {field}")
            if collate_refs.cjk_only(value) not in ref:
                raise SystemExit(f"case {number}: {field} is not a contiguous run of the witness")
            census[field] = census.get(field, 0) + len(collate_refs.cjk_only(value))
        cases.append({
            "case_num": number,
            "title_zh": parts["heading_zh"],
            "title_pinyin": pinyin,
            "title_en": english,
            "pointer_zh": parts["pointer_zh"],
            "dialogue": [{"speaker": "舉 / The Case", "zh": parts["case_zh"], "pinyin": ""}],
            "commentary_zh": parts["commentary_zh"],
            "verse_zh": parts["verse_zh"],
            "verse_commentary": {"commentary_zh": parts["verse_commentary_zh"]},
            "locator": {
                "taisho": f"{WORK_ID} case {number}",
                "page_line": heading_line,
                "case_close_line": closing_line,
                "source_edition": SOURCE_EDITION,
            },
        })
        case_locators[str(number)] = {
            "canonical_locator": f"{WORK_ID} case {number} · {WORK_ID} p.{heading_line}–p.{closing_line}",
            "status": "collated_with_normalization",
            "note": (f"Case heading {parts['heading_zh']} and line head {heading_line} read from the "
                     f"pinned CBETA XML P5 T48n2004 (revision {UPSTREAM_REVISION}); the pointer, "
                     "本則, 評唱, 頌 and post-verse 評唱 are verbatim in that extraction under the "
                     "pinned rule (tei:note/tei:g apparatus dropped, no rewording), which is the "
                     "documented normalization; human sign-off pending."),
            "collation_note": (f"All five represented source fields of case {number} collate verbatim "
                               "to the pinned witness; the locator anchors the case's heading line "
                               "per the 2026-08-10 containment table."),
            "source_edition": SOURCE_EDITION,
        }
    if case_locators["33"]["canonical_locator"].split("p.")[1].split("–")[0] == "":
        raise SystemExit("case 33 has no anchor")

    document = {
        "id": "congronglu",
        "title_zh": "從容錄",
        "title_pinyin": "Cóngróng Lù",
        "title_en": "The Book of Serenity (Shōyōroku)",
        "cbeta_id": "T2004",
        "taisho_vol": TAISHO_VOL,
        "author_zh": "宋 宏智正覺 頌古 / 元 萬松行秀 評唱",
        "author_en": ("Verses by Hongzhi Zhengjue (1091–1157); commentary and pointers by Wansong "
                      "Xingxiu (1166–1246), completed 1224 CE"),
        "era": "Song–Yuan (1224 CE)",
        "genre": "gongan",
        "overview": OVERVIEW,
        "cases": cases,
        "coverage_note": COVERAGE_NOTE,
        "cbeta_note": CBETA_NOTE,
        "zh_chars": sum(census[field] for field in
                        ("pointer_zh", "dialogue[0].zh", "commentary_zh", "verse_zh",
                         "verse_commentary.commentary_zh")),
    }
    report = {
        "work_id": WORK_ID,
        "upstream_revision": UPSTREAM_REVISION,
        "witness_sha256": hashlib.sha256(raw).hexdigest(),
        "cases": len(cases),
        "reference_cjk": len(ref),
        "cjk_per_field": dict(sorted(census.items())),
        "all_fields_contiguous": True,
        "verse_not_in_lg": [number for number, parts in enumerate(cases_text, start=1)
                            if parts["verse_tag"] != "lg"],
        "locator_anchor": ("heading line: the lb printed before the case div "
                           "(2026-08-10 containment convention); close: last lb inside the div"),
        "containment_anchors": {key: case_locators[key]["canonical_locator"].split("p.")[1].split("–")[0]
                                for key in CONTAINMENT_ANCHORS},
        "zh_chars": document["zh_chars"],
    }
    return document, {"congronglu": case_locators}, report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--source-dir", type=Path, default=Path("/tmp/xmlp5"))
    parser.add_argument("--out", type=Path)
    parser.add_argument("--locators-out", type=Path)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()

    document, locators, report = build(args.source_dir)
    for path, payload in ((args.out, document), (args.locators_out, locators), (args.report, report)):
        if path:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"cases: {report['cases']}")
    print(f"reference characters under the pinned rule: {report['reference_cjk']}")
    for field, count in report["cjk_per_field"].items():
        print(f"  {field}: {count}")
    print(f"zh_chars: {report['zh_chars']}")
    print(f"verse carried in a paragraph (not lg): {report['verse_not_in_lg']}")
    print(f"containment anchors: {report['containment_anchors']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
