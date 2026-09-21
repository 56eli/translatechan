#!/usr/bin/env python3
"""Segment pinned CBETA XML P5 witnesses into full-tiling corpus documents (task 050, 2026-09-21).

This is the deterministic producer for the six "enthusiast 100% closer" documents: the complete
records of Huangbo's Transmission of Mind (T48n2012A), Mazu (X69n1321), Yunmen (T47n1988),
Dongshan (T47n1986A+B), Zhaozhou as printed in the Guzunsu yulu anthology (X68n1315 juan 13–14)
and Dahui's recorded sayings including the letters juan (T47n1998A+B). For each document it reads
one or two witness files of `cbeta-org/xml-p5` at revision
`dbdea41071e1e260ad84b72faefd4587333cf76d`, plus each witness's digest-verified reference
extraction (`ref_<WorkId>.txt`, rule `cbeta-p5-body-cjk-v1` in `scripts/collate_refs.py`), and
writes the corpus-shaped document, a per-unit locator map and a machine-readable extraction report.

The tiling rule (the Caoshan producer's rule, generalized):

  * The witness's body is walked in document order, counting CJK characters exactly as the pinned
    extraction rule serializes them; every `p`, `lg`, `div` and `juan` element start is a unit
    boundary, plus the region start and region end.
  * Units are consecutive boundary pairs — `[b_i, b_{i+1})` slices of the reference extraction. By
    construction they tile the region contiguously; the producer asserts at run time that
    `"".join(unit texts) == ref[region_start:region_end]` and that the units' CJK sum equals the
    region length. No run of the witness is omitted, duplicated or invented.
  * A region is either the whole extraction (`mode: "full"`) or a named anthology span — for
    Zhaozhou: from the body-level `div` whose 目録 opens 趙州真際禪師語錄 (古尊宿語錄卷第十三) up
    to the next work's opening heading 古尊宿語錄卷第十五, so the span covers 卷第十三 (record and
    行狀) and 卷第十四 (語錄之餘) with their colophons.
  * Unit `kind`: the element that owns the boundary (`juan-head`/`juan-close` for a 卷 heading,
    `heading` for a div's structural lead, `record` for a prose paragraph, `verse` for a verse
    block, `section` for a text run before the first split). `title_zh` is the div's 目録 text (or
    the juan heading's `jhead` text) when the witness prints one — verbatim from the extraction —
    and otherwise the unit's own first `RECORD_TITLE_CHARS` CJK characters, also verbatim. Every
    `title_en` and `speaker` is project-authored metadata; the Chinese source fields are witness
    text only.

Pinned facts — the assertions that make a rerun a check rather than a rebuild: each witness's
file sha256 at the revision, its reference extraction's CJK length, the region bounds, the region
CJK count and the unit count per witness. A witness or reference change fails the run.

Usage (one document per run):
    python3 scripts/segment_full_witness.py --doc huangbo_fayao_full \
        --source-dir /tmp/xmlp5 --refs-dir /tmp/refs --out data/corpus/huangbo_fayao_full.json \
        --locators-out data/staging/huangbo_fayao_full_locators.json \
        --report data/staging/huangbo_fayao_full_extraction_report.json
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

UPSTREAM_REVISION = "dbdea41071e1e260ad84b72faefd4587333cf76d"
EXTRACTED = "2026-09-21"
RECORD_TITLE_CHARS = 12
TEI = collate_refs.TEI_NS
DROP = collate_refs.DROP_SUBTREE_TAGS
SPLIT_TAGS = ("p", "lg", "div", "juan")

# --------------------------------------------------------------------------------------
# Witness pins: sha256 of the XML at the revision, the reference extraction's CJK length, the
# locator prefix and the Taishō citation. Region geometry is pinned per target below.
# --------------------------------------------------------------------------------------
WITNESSES: dict[str, dict] = {
    "T48n2012A": {"sha256": "89cbe7536d6c049456110d9acdf3c45f6abd18e144758c37d43c8faa389a3ba4",
                  "ref_cjk": 6632, "tag": "T2012A", "taisho": "T48 no. 2012A",
                  "ref_sha256": "8f46065b6d1be313d6d68c7c99a6f4c3cee28306e3cbb8695a765912537ee58d"},
    "X69n1321":  {"sha256": "e1c98d66981ea41f3d5cdd1d70d115730ff3d3b1b658f92c854b411d42b37305",
                  "ref_cjk": 4732, "tag": "X1321", "taisho": "X69 no. 1321",
                  "ref_sha256": "652ba08698e51d5e7e44c8d6d3209ba5c8c85f0c5192a50909ce284d0cff3e13"},
    "T47n1988":  {"sha256": "7f095758fe1ec81e8d90d4a1e4225c408c5c911a27caed5a53054de7198aa39c",
                  "ref_cjk": 43678, "tag": "T1988", "taisho": "T47 no. 1988",
                  "ref_sha256": "38b9347dda4c5f5ce7c02ffb66fd8599f046536b16907f5219d63cc3847321cb"},
    "T47n1986A": {"sha256": "cc4f368b0b7af9d73543f01117d8c58b589286fa2eb7fd2806f5bb61ff8f7ec2",
                  "ref_cjk": 15843, "tag": "T1986A", "taisho": "T47 no. 1986A",
                  "ref_sha256": "c53e4ffde1dccb93f566ab91ef1b252ffb79ff6243aebf51fdba2f68dd42b03b"},
    "T47n1986B": {"sha256": "6d64049f765dc967adaa9b0c582ae8f1d3b083bd0e76c199767526f343c22332",
                  "ref_cjk": 8596, "tag": "T1986B", "taisho": "T47 no. 1986B",
                  "ref_sha256": "7ed62050f1b6321db5a8503de7e027ae40d126e1a11b0eeac47eb4d15fd2f2f2"},
    "X68n1315":  {"sha256": "adcddde4ee7665799c6e471f6e2e4fd7b9d3746960de642c89e6937c76e9c2bf",
                  "ref_cjk": 445450, "tag": "X1315", "taisho": "X68 no. 1315",
                  "ref_sha256": "36727779ec415315fe716971174d303eb8161ebad2614a3ec929de3dd337d243"},
    "T47n1998A": {"sha256": "995ce772f0f6bac1162d3cce427b861a03023cc98be9775bd2dc8cc05c693bc3",
                  "ref_cjk": 182132, "tag": "T1998A", "taisho": "T47 no. 1998A",
                  "ref_sha256": "eb71385d71e5c3ff1ff0d827dc47da476dfda18b723399842b7b0d3fc28e6798"},
    "T47n1998B": {"sha256": "03869a17ae333e4494f9989950e215825bb4ab70ac3d4e7a59d9e25855290d61",
                  "ref_cjk": 19941, "tag": "T1998B", "taisho": "T47 no. 1998B",
                  "ref_sha256": "8b37b4663395ac69d794b2b5030a5529faaf08884a13cac8815c6d07b7f6d819"},
}

# --------------------------------------------------------------------------------------
# Targets: geometry pins (measured once from the pinned witness and frozen so a rerun verifies
# them), the corpus document's root metadata, curated English labels for the witness's own
# heading titles, and the honest coverage/cbeta notes.
# --------------------------------------------------------------------------------------
TARGETS: dict[str, dict] = {
    "huangbo_fayao_full": {
        "witnesses": [{"work": "T48n2012A", "mode": "full", "region": [0, 6632],
                        "region_cjk": 6632, "units": 19}],
        "taisho_vol": 48,
        "doc": {
            "id": "huangbo_fayao_full",
            "title_zh": "黃檗山斷際禪師傳心法要",
            "title_pinyin": "Huángbó Shān Duànjì Chánshī Chuánxīn Fǎyào",
            "title_en": "Huangbo's Transmission of Mind, Complete (Chuanxin Fayao, from the T48n2012A witness)",
            "cbeta_id": "T2012A",
            "author_zh": "唐 黃檗希運 說 / 唐 裴休 集",
            "author_en": ("Spoken by Huangbo Xiyun (d. 850); recollected and compiled by the Tang "
                          "statesman Pei Xiu (裴休, 797–870)"),
            "era": "Late Tang Dynasty (9th century)",
            "genre": "Linji Cornerstone / Dharma Essentials (法要)",
            "overview": (
                "The complete Transmission of Mind as printed in Taishō fascicle 2012A: Pei Xiu's "
                "preface, the dated close of the record, and the dharma essentials themselves — 即心是佛 "
                "and the one mind teaching from the bureau hall, the 九月一日 exchange on the patriarchs, "
                "and the encounter questions down to 不落階級 — every paragraph verbatim and contiguous. "
                "The sibling 宛陵錄 (T48n2012B) preserves the rest of Pei Xiu's recollections and stays "
                "a separate corpus document."
            ),
        },
        "en_labels": {
            "斷際心要序": "Pei Xiu's preface (目録 and head, verbatim)",
            "黃檗山斷際禪師傳心法要": "Fascicle opening heading",
            "唐大中十一年十一月初八日": "Preface's dated close (857)",
            "有大禪師法諱希運住洪州高": "Pei Xiu introduces the master at Huangbo",
            "黃檗山際禪師傳心法要終": "Fascicle close heading",
        },
    },
    "mazu_guanglu_full": {
        "witnesses": [{"work": "X69n1321", "mode": "full", "region": [0, 4732],
                        "region_cjk": 4732, "units": 35}],
        "taisho_vol": None,
        "doc": {
            "id": "mazu_guanglu_full",
            "title_zh": "江西馬祖道一禪師語錄",
            "title_pinyin": "Jiāngxī Mǎzǔ Dàoyī Chánshī Yǔlù",
            "title_en": "Mazu Daoyi's Recorded Sayings, Complete as Printed in the Manji Zokuzōkyō (X69n1321, Sijia yulu juan 1)",
            "cbeta_id": "X1321",
            "author_zh": "唐 馬祖道一 說",
            "author_en": "Spoken by Mazu Daoyi (馬祖道一, 709–788)",
            "era": "Mid-Tang Dynasty (8th century)",
            "genre": "Linji Cornerstone / Discourse Record (語錄)",
            "overview": (
                "The whole of CBETA X69n1321 — the Manji Zokuzōkyō printing catalogued as 馬祖道一禪師廣錄 "
                "(四家語錄卷一), whose own opening heading reads 江西馬祖道一禪師語錄: the biography opening, "
                "the 即心即佛 / 非心非佛 and 即心 is-dao exchanges, the 三句 teachings, and the 四家 record of "
                "West Hall, Baizhang and Nanquan attending the master watching the moon — every paragraph "
                "verbatim and contiguous."
            ),
        },
        "en_labels": {
            "江西馬祖道一禪師語錄": "Opening heading of the record",
            "江西道一禪師漢州什方縣人": "Biographical opening (record unit 1)",
        },
    },
    "yunmen_guanglu_full": {
        "witnesses": [{"work": "T47n1988", "mode": "full", "region": [0, 43678],
                        "region_cjk": 43678, "units": 776}],
        "taisho_vol": 47,
        "doc": {
            "id": "yunmen_guanglu_full",
            "title_zh": "雲門匡真禪師廣錄",
            "title_pinyin": "Yúnmén Kuāngzhēn Chánshī Guǎnglù",
            "title_en": "The Expanded Record of Yunmen Kuangzhen, Complete (three fascicles, T47n1988)",
            "cbeta_id": "T1988",
            "author_zh": "唐 雲門文偃 說 / 門人等 集",
            "author_en": ("Spoken by Yunmen Wenyan (雲門文偃, 864–949); the Guanglu as compiled by his "
                          "dharma heirs"),
            "era": "Late Tang / Five Dynasties (10th century)",
            "genre": "Yunmen Cornerstone / Expanded Record (廣錄, 對機 語要 勘辨 行錄)",
            "overview": (
                "The entire Yunmen Guanglu in its Taishō printing: the preface; 對機三百二十則 with its "
                "forty-seven record blocks; the 十二時歌 and 偈頌; 卷中's 室中語要 (one hundred eighty-nine "
                "paragraphs) and 垂示代語 (two hundred eighty-five); 卷下's 勘辨, 遊方遺錄, 大師遺表, 遺誡, "
                "the 行錄 and 請疏; and the appended 頌雲門三句語 with the twelve verse blocks (函蓋乾坤 … "
                "委曲商量) — every block verbatim and contiguous."
            ),
        },
        "en_labels": {
            "雲門匡真禪師廣錄序": "Preface to the Expanded Record",
            "對機三百二十則": "Three Hundred Twenty Encounters (block heading)",
            "十二時歌": "Song of the Twelve Hours",
            "偈頌": "Verses and Gathas",
            "室中語要": "Essential Words in the Chamber",
            "垂示代語": "Directed Answers and Substitute Words",
            "勘辨": "Examination and Discrimination",
            "遊方遺錄": "Remaining Records of the Pilgrimage",
            "大師遺表": "The Master's Memorial Left Behind",
            "遺誡": "Final Admonitions",
            "雲門山光泰禪院匡真大師行錄": "Conduct Record of the Kuangzhen Master of Yunmen Mountain",
            "請疏": "Invitation Memorials",
            "頌雲門三句語": "Verses on Yunmen's Three Phrases",
            "函蓋乾坤": "Verse — Covers the Whole World (函蓋乾坤)",
            "截斷眾流": "Verse — Cuts Off the Streams (截斷眾流)",
            "隨波逐浪": "Verse — Follows the Waves (隨波逐浪)",
            "三句外別置一頌": "Verse Set Apart Beyond the Three Phrases",
            "褒貶句": "Verse — Praising and Blaming Phrases",
            "辨親疎": "Verse — Distinguishing Close and Distant",
            "辨邪正": "Verse — Distinguishing Deviant and Correct",
            "通賓主": "Verse — Guest and Host in Common",
            "擡薦商量": "Verse — Advancing and Proposing (Deliberation)",
            "提綱商量": "Verse — Raising the Outline (Deliberation)",
            "據實商量": "Verse — According to the Fact (Deliberation)",
            "委曲商量": "Verse — Twisting and Turning (Deliberation)",
        },
    },
    "dongshan_yulu_full": {
        "witnesses": [{"work": "T47n1986A", "mode": "full", "region": [0, 15843],
                        "region_cjk": 15843, "units": 214},
                       {"work": "T47n1986B", "mode": "full", "region": [0, 8596],
                        "region_cjk": 8596, "units": 108}],
        "taisho_vol": 47,
        "doc": {
            "id": "dongshan_yulu_full",
            "title_zh": "洞山良价禪師語錄",
            "title_pinyin": "Dòngshān Liángjiè Chánshī Yǔlù",
            "title_en": "The Recorded Sayings of Dongshan Liangjie, Complete (T47n1986A+B, incl. the Baojing sanmei song with commentary and the letters)",
            "cbeta_id": "T1986A + T1986B",
            "author_zh": "唐 洞山良价 說 / 日本 慧印 校訂",
            "author_en": ("Spoken by Dongshan Liangjie (洞山良价, 807–869); the 1986A part carries the "
                          "Japanese recension collated by 慧印"),
            "era": "Late Tang Dynasty (9th century)",
            "genre": "Caodong Cornerstone / Discourse Record (語錄, 寶鏡三昧, 五位)",
            "overview": (
                "Both Taishō parts of Dongshan's record, whole: T47n1986A (筠州洞山悟本禪師語錄) — the "
                "序, the record's one hundred thirty-nine paragraphs from 師幼歲從師 to the death record, "
                "the 歌頌寶鏡三昧歌 with its eight commentary blocks, 規誡, the 辭北堂書 / 後寄北堂書 "
                "letters with their verses and the mother's reply 附孃回書, 語錄之餘, and the three appended "
                "prefaces; then T47n1986B (瑞州洞山良价禪師語錄), the hundred-and-seven-paragraph second "
                "fascicle including the Five Ranks exchanges — every block verbatim and contiguous."
            ),
        },
        "en_labels": {
            "洞山大師語錄序": "Preface to Dongshan's Record",
            "筠州洞山悟本禪師語錄": "Opening heading (Yunzhou fascicle)",
            "洞山悟本禪師語錄": "The Record of Dongshan Wuben",
            "歌頌寶鏡三昧歌": "Jewel Mirror Samadhi — Song and Commentary",
            "規誡": "Rules and Admonitions",
            "辭北堂書": "Letter Taking Leave of His Mother",
            "後寄北堂書": "Letter Sent Later to His Mother",
            "附孃回書": "The Mother's Reply Attached",
            "洞山悟本禪師語錄之餘": "Remainder of the Record (語錄之餘)",
            "洞山悟本大師語錄序": "Appended Preface (Japanese edition)",
            "重集洞山悟本大師語要自序": "Self-Preface to the Recollected Essential Words",
            "書洞山語錄尾": "Colophon at the End of Dongshan's Record",
            "瑞州洞山良价禪師語錄": "Opening heading (Ruizhou fascicle)",
        },
    },
    "zhaozhou_yulu_full": {
        "witnesses": [{"work": "X68n1315",
                       "mode": {"anthology_div": "趙州真際禪師語錄",
                                "stop_at_juan_head": "古尊宿語錄卷第十五"},
                       "region": [101821, 122859], "region_cjk": 21038, "units": 80}],
        "taisho_vol": None,
        "doc": {
            "id": "zhaozhou_yulu_full",
            "title_zh": "趙州真際禪師語錄",
            "title_pinyin": "Zhàozhōu Zhēnjì Chánshī Yǔlù",
            "title_en": "The Recorded Sayings of Zhaozhou, Complete as Printed in the Guzunsu yulu (X68n1315 juan 13–14)",
            "cbeta_id": "X1315 juan 13–14",
            "author_zh": "唐 趙州從諗 說 / 宋 赜古 編 古尊宿語錄",
            "author_en": ("Spoken by Zhaozhou Congshen (趙州從諗, 778–897); preserved in the Guzunsu yulu "
                          "(古尊宿語錄), comp. by Ze gu (宋 赜古編)"),
            "era": "Late Tang Dynasty (9th century); anthology Song-dynasty compilation",
            "genre": "Heutian Lineage / Discourse Record (語錄, 古尊宿語錄卷十三–十四)",
            "overview": (
                "Zhaozhou's whole record as printed in the Guzunsu yulu anthology: juan 13 (趙州真際禪師語錄"
                "并行狀卷上, including the 行狀 biography, the 平常心是道 exchange with Nanquan, the 上堂 "
                "series, the 狗子無佛性 Mu, 庭前柏樹子, the 木佛 warming question and the 喫茶去 passages in "
                "their anthology placement) and juan 14 (趙州真際禪師語錄之餘, the supplementary records), "
                "each closed with the 澄諟 colophon line — every paragraph verbatim and contiguous. The "
                "anthology's other forty juan of masters lie outside this document's region and are not "
                "claimed here."
            ),
        },
        "en_labels": {
            "趙州真際禪師語錄并行狀卷上南嶽下四世嗣南泉願": "Zhaozhou's Record with Parallel Conduct, juan shang (anthology heading)",
            "語錄": "Section heading: Recorded Sayings",
            "師即南泉門人也俗姓郝氏本": "Conduct record (行狀) opening",
            "古尊宿語錄卷第十三": "Anthology juan 13 heading",
            "古尊宿語錄卷第十三終": "Close of anthology juan 13",
            "古尊宿語錄卷第十四": "Anthology juan 14 heading",
            "古尊宿語錄卷第十四終": "Close of anthology juan 14",
            "廬山棲賢寶覺禪院住持傳法": "Editor Chengdi's colophon (repeated at the close of each juan)",
            "趙州真際禪師語錄之余": "The Remainder of Zhaozhou's Record (語錄之餘 opening)",
        },
    },
    "dahui_yulu_full": {
        "witnesses": [{"work": "T47n1998A", "mode": "full", "region": [0, 182132],
                        "region_cjk": 182132, "units": 1232},
                       {"work": "T47n1998B", "mode": "full", "region": [0, 19941],
                        "region_cjk": 19941, "units": 122}],
        "taisho_vol": 47,
        "doc": {
            "id": "dahui_yulu_full",
            "title_zh": "大慧普覺禪師語錄",
            "title_pinyin": "Dàhuì Pǔjué Chánshī Yǔlù",
            "title_en": "The Recorded Sayings of Dahui Zonggao, Complete (30 juan — the letters of juan 25–30 included — with the Zongmen huku)",
            "cbeta_id": "T1998A + T1998B",
            "author_zh": "宋 蘄育王山沙門 僧辯 等 編集 大慧普覺禪師語錄",
            "author_en": ("The sayings of Dahui Zonggao (大慧宗杲, 1089–1163), compiled by his disciples "
                          "(the printed record carries 參學比丘道謙編 for the Zongmen huku)"),
            "era": "Southern Song (12th century)",
            "genre": "Kanhwa Seon / Recorded Sayings and Letters (語錄, 書問, 宗門武庫)",
            "overview": (
                "The complete Dahui Pujue Chanshi Yulu as printed in Taishō 1998A (thirty juan — the "
                "ascension and hall sayings, the chamber encounters and 頌古, the verse-dedications, the "
                "dharma-talks and, as juan 25–30, the 書: the letters to Zhang Shangshu, Fan Tixing, "
                "Liu Anfu, Xianshu, Yang Jiaoshou, Tang Chengxiang, Shengquan Gui and the rest of the lay "
                "correspondents) followed by the Zongmen huku (1998B, the armory of the school compiled by "
                "the disciple Daoqian in one hundred twenty entries) — every block verbatim and contiguous. "
                "This is the letters-ingestion named in the Phase 2 plan: the corpus's existing six-field "
                "`dahui_hongzhi` selection stays untouched as its sibling, and Hongzhi's own Guanglu "
                "(T48n2001) is carried as a probe, not claimed here."
            ),
        },
        "en_labels": {
            "進大慧禪師語錄奏劄": "Memorial presenting the Yulu to the throne",
            "大慧普覺禪師塔銘": "Stupa inscription",
            "室中機緣": "Encounters in the Chamber (juan 9)",
            "頌古": "Verses on the Ancients (juan 10)",
            "謝降賜大慧禪師語錄入藏奏劄": "Memorial of thanks for the canon bestowal",
            "大慧普覺禪師宗門武庫": "The Zongmen huku (Armory of the School)",
        },
    },
}

COVERAGE_SUFFIX = {
    "huangbo_fayao_full": (
        "This document represents the T48n2012A part of Taishō number 2012 only: the sibling 宛陵錄 "
        "(T48n2012B) is a separate corpus document (`huangbo_wanling`) and is carried here as a probe, "
        "not claimed; the parallel Huangbo record inside the Guzunsu yulu anthology (X68n1315) is not "
        "merged. The corpus's earlier ten-section `huangbo_chuanxin` seed is left exactly as it stands. "
        "The witness's interlinear apparatus (tei:note/tei:g) is dropped by the pinned rule and is not "
        "represented. Representation does not establish complete selected-witness status, and source "
        "collation does not approve reuse."
    ),
    "mazu_guanglu_full": (
        "This document is the whole of X69n1321 as printed — the record catalogued at the work level as "
        "馬祖道一禪師廣錄 (四家語錄卷一). It is not a merge of other Mazu witnesses: the 馬祖大寂行狀 "
        "(X68n1315 juan 1) and the 景德傳燈錄 account (T51n2076 juan 6–7) are carried as probes only, "
        "and the corpus's earlier eight-field `mazu_yulu` seed (with its 2026-09-16 re-keys) is untouched. "
        "The witness's interlinear apparatus is dropped by the pinned rule and is not represented. "
        "Representation does not establish complete selected-witness status, and source collation does "
        "not approve reuse."
    ),
    "yunmen_guanglu_full": (
        "The corpus's earlier ten-section `yunmen_yulu` seed (with the withdrawn 'T1988' retelling claim) "
        "is left exactly as it stands. The parallel Yunmen printing inside the Guzunsu yulu anthology "
        "(X68n1315 juan 15–18) is a different recension and is not merged or claimed here. The "
        "witness's interlinear apparatus is dropped by the pinned rule and is not represented. "
        "Representation does not establish complete selected-witness status, and source collation does "
        "not approve reuse."
    ),
    "dongshan_yulu_full": (
        "Both Taishō parts of number 1986 are claimed witnesses of this single document; the sibling part "
        "of number 1987, the Caoshan record (T47n1987A), which carries the appended treatises explaining "
        "Dongshan's Five Ranks, is the separate corpus document `caoshan_benji`, and its 解釋洞山五位顯訣 "
        "is a cross-reference, not merged here. The standalone 寶鏡三昧歌 selection lives in `baojing_sanmei` "
        "(its 2026-09-16 stanzas re-keyed against 1986A) and is untouched; this document carries the "
        "1986A 歌頌寶鏡三昧歌 blocks as part of the whole fascicle. The corpus's earlier `dongshan_yulu` "
        "seed is left exactly as it stands. The witness's interlinear apparatus is dropped by the pinned "
        "rule and is not represented. Representation does not establish complete selected-witness status, "
        "and source collation does not approve reuse."
    ),
    "zhaozhou_yulu_full": (
        "This document is the Zhaozhou span of the Guzunsu yulu anthology (X68n1315 juan 13–14: the "
        "record with its 行狀 and the 語錄之餘), not the whole anthology — the other masters' juan lie "
        "outside the region and are not claimed. The corpus's prior 'T1987' witness claim remains "
        "recorded as false on the historical `zhaozhou_yulu` seed, which is left untouched (T1987 is the "
        "Caoshan record); this document never cites it. The 古尊宿語錄's own preface, the other forty "
        "juan, and the anthology colophons outside juan 13–14 are not part of this document. The "
        "witness's interlinear apparatus is dropped by the pinned rule and is not represented. "
        "Representation does not establish complete selected-witness status, and source collation does "
        "not approve reuse."
    ),
    "dahui_yulu_full": (
        "This document represents the whole of T47n1998A (三十卷, the 書 letters of juan 二十五–三十 "
        "included — 答張侍郎 and the other lay-correspondent letters are individual heading-and-paragraph "
        "units inside the tiling) and T47n1998B (宗門武庫). Hongzhi's side of the exchanges — the "
        "宏智禪師廣錄 T48n2001 — is carried as a probe reference only: nothing is claimed from it and it "
        "is not ingested here; the corpus's six-field `dahui_hongzhi` selection stays its untouched "
        "sibling. The witness's interlinear apparatus is dropped by the pinned rule and is not "
        "represented. Representation does not establish complete selected-witness status, and source "
        "collation does not approve reuse."
    ),
}


def localname(element: ET.Element) -> str:
    return element.tag.split("}")[-1]


def element_text(element: ET.Element) -> str:
    """Document-order CJK text of one element under the pinned rule (dropped subtrees keep tails)."""
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


class Structure:
    def __init__(self) -> None:
        self.offset = 0
        self.lb_marks: list[tuple[int, str]] = []
        self.elements: list[tuple[int, int, str, ET.Element]] = []   # SPLIT_TAGS, any depth
        self.top: list[tuple[int, int, str, ET.Element]] = []        # direct body children
        self.mulus: dict[int, str] = {}
        self.jheads: dict[int, str] = {}

    @property
    def length(self) -> int:
        return self.offset


def walk(node: ET.Element, structure: Structure, top: bool = False) -> None:
    if node.text:
        structure.offset += len(collate_refs.cjk_only(node.text))
    for child in node:
        name = localname(child)
        if name in DROP:
            if child.tail:
                structure.offset += len(collate_refs.cjk_only(child.tail))
            continue
        child_start = structure.offset
        if name == "lb" and child.get("n"):
            structure.lb_marks.append((child_start, child.get("n")))
        walk(child, structure, top=False)
        child_end = structure.offset
        if top:
            structure.top.append((child_start, child_end, name, child))
        if name in SPLIT_TAGS:
            structure.elements.append((child_start, child_end, name, child))
            if name == "div":
                mulu = next((x for x in child if localname(x) == "mulu"), None)
                if mulu is not None:
                    structure.mulus[id(child)] = element_text(mulu)
            if name == "juan":
                jhead = next((x for x in child if localname(x) == "jhead"), None)
                if jhead is not None:
                    structure.jheads[id(child)] = element_text(jhead)
        if child.tail:
            structure.offset += len(collate_refs.cjk_only(child.tail))


def load_witness(source_dir: Path, refs_dir: Path, work: str) -> tuple[str, Structure]:
    cfg = WITNESSES[work]
    xml_path = source_dir / work[0] / work[:3] / f"{work}.xml"
    raw = xml_path.read_bytes()
    if hashlib.sha256(raw).hexdigest() != cfg["sha256"]:
        raise SystemExit(f"witness {xml_path} sha256 != pinned {cfg['sha256']}")
    root = ET.fromstring(raw)
    body = root.find(".//tei:text/tei:body", TEI)
    if body is None:
        raise SystemExit(f"{work}: the CBETA file has no tei:text/tei:body element")
    ref_path = refs_dir / f"ref_{work}.txt"
    ref = ref_path.read_text(encoding="utf-8").rstrip("\n")
    text = collate_refs.cjk_only(collate_refs.serialize_body(body))
    if text != ref:
        raise SystemExit(f"{work}: the pinned-rule serialization of the witness does not byte-match "
                         f"the reference extraction (len {len(text)} vs {len(ref)})")
    if len(ref) != cfg["ref_cjk"]:
        raise SystemExit(f"{work}: reference extraction length {len(ref)} != {cfg['ref_cjk']}")
    if hashlib.sha256(ref_path.read_bytes()).hexdigest() != cfg["ref_sha256"]:
        raise SystemExit(f"{work}: reference extraction digest != pinned {cfg['ref_sha256']}")
    structure = Structure()
    walk(body, structure, top=True)
    if structure.length != len(ref):
        raise SystemExit(f"{work}: walk ended at offset {structure.length}, expected {len(ref)}")
    return ref, structure


def select_region(work: str, mode, ref: str, structure: Structure) -> tuple[int, int]:
    if mode == "full":
        return 0, len(ref)
    if isinstance(mode, dict) and "anthology_div" in mode:
        prefix = mode["anthology_div"]
        stop_head = mode.get("stop_at_juan_head")
        start = None
        start_index = None
        for i, (s, e, k, el) in enumerate(structure.top):
            if k == "div":
                mulu_el = next((x for x in el if localname(x) == "mulu"), None)
                mulu = structure.mulus.get(id(el), "") or (element_text(mulu_el) if mulu_el is not None else "")
                if mulu.startswith(prefix):
                    start = s
                    start_index = i
                    break
        if start is None:
            raise SystemExit(f"{work}: no body-level div whose 目録 starts with {prefix!r}")
        end = None
        for (s, e, k, el) in structure.top[start_index + 1:]:
            if k == "juan" and (el.get("fun") or "") == "open":
                jhead = structure.jheads.get(id(el), "")
                if stop_head is None:
                    end = s
                    break
                if jhead == stop_head:
                    end = s
                    break
        if end is None:
            raise SystemExit(f"{work}: the region stop heading {stop_head!r} was not found as a "
                             "body-level 卷-open heading")
        return start, end
    raise SystemExit(f"{work}: unknown region mode {mode!r}")


def units_for(structure: Structure, start: int, end: int) -> list[dict]:
    """Tile [start, end) at p/lg/div/juan element starts; units are consecutive boundary pairs."""
    priority = {"juan": 0, "div": 1, "lg": 2, "p": 3}
    boundaries: dict[int, tuple[str, ET.Element]] = {}
    for (s, e, k, el) in structure.elements:
        if start <= s < end:
            prev = boundaries.get(s)
            if prev is None or priority[k] < priority[prev[0]]:
                boundaries[s] = (k, el)
    offsets = sorted(set([start, end] + [b for b in boundaries if start < b < end]))
    units: list[dict] = []
    for a, b in zip(offsets, offsets[1:]):
        if a >= b:
            continue
        kind, el = boundaries.get(a, (None, None))
        if kind == "p":
            kind = "record"
        elif kind == "lg":
            kind = "verse"
        elif kind == "juan":
            kind = "juan-close" if (el is not None and (el.get("fun") or "") == "close") else "juan-head"
        elif kind == "div":
            kind = "heading"
        else:
            kind = "section" if units else "region-head"
        units.append({"start": a, "end": b, "kind": kind, "el": el})
    return units


def lb_lines(structure: Structure, start: int, end: int) -> tuple[str, str]:
    head_line = None
    close_line = None
    for offset, n in structure.lb_marks:
        if offset <= start:
            head_line = n
        elif offset < end:
            close_line = n
        else:
            break
    return (head_line or "?"), (close_line or head_line or "?")


def build(document_key: str, source_dir: Path, refs_dir: Path):
    target = TARGETS[document_key]
    cases: list[dict] = []
    case_locators: dict[str, dict] = {}
    witness_reports: list[dict] = []
    census: dict[str, int] = {}
    number = 0
    for cfg in target["witnesses"]:
        work = cfg["work"]
        meta = WITNESSES[work]
        ref, structure = load_witness(source_dir, refs_dir, work)
        start, end = select_region(work, cfg["mode"], ref, structure)
        units = units_for(structure, start, end)
        if [start, end] != cfg["region"]:
            raise SystemExit(f"{work}: region {start}:{end} != pinned {cfg['region']}")
        if end - start != cfg["region_cjk"]:
            raise SystemExit(f"{work}: region CJK {end - start} != pinned {cfg['region_cjk']}")
        if len(units) != cfg["units"]:
            raise SystemExit(f"{work}: {len(units)} units != pinned {cfg['units']}")
        unit_report = []
        for unit in units:
            zh = ref[unit["start"]:unit["end"]]
            kind = unit["kind"]
            el = unit["el"]
            title_zh = ""
            if kind == "heading" and el is not None:
                mulu = structure.mulus.get(id(el), "")
                if mulu and zh.startswith(mulu):
                    title_zh = mulu
            elif kind in ("juan-head", "juan-close") and el is not None:
                jhead = structure.jheads.get(id(el), "")
                if jhead and jhead in zh:
                    title_zh = jhead
            if not title_zh:
                title_zh = zh[:RECORD_TITLE_CHARS]
            head_line, close_line = lb_lines(structure, unit["start"], unit["end"])
            number += 1
            census[kind] = census.get(kind, 0) + 1
            label = target["en_labels"].get(title_zh)
            if label is None:
                label = {"record": f"Record paragraph {number}",
                         "verse": f"Verse block {number}",
                         "heading": f"Section heading {number}",
                         "juan-head": "Fascicle opening heading",
                         "juan-close": "Fascicle close heading",
                         "section": f"Section lead {number}",
                         "region-head": "Opening lead"}.get(kind, f"Unit {number}")
                label = f"{label} ({work})"
            cases.append({
                "case_num": number,
                "kind": kind,
                "witness": work,
                "title_zh": title_zh,
                "title_en": label,
                "dialogue": [{"speaker": "錄 / The Record", "zh": zh, "pinyin": ""}],
                "locator": {
                    "taisho": f"{work} ({meta['taisho']})",
                    "page_line": head_line,
                    "case_close_line": close_line,
                    "source_edition": f"CBETA XML P5 {work}, revision {UPSTREAM_REVISION}",
                },
            })
            case_locators[str(number)] = {
                "canonical_locator": f"{meta['tag']} · {title_zh} · p.{head_line}–p.{close_line}",
                "status": "collated_with_normalization",
                "note": (f"Unit {title_zh!r} ({kind}) and line head {head_line} read from the pinned "
                         f"CBETA XML P5 {work} (revision {UPSTREAM_REVISION}); the unit's text is "
                         "verbatim in that extraction under the pinned rule (tei:note/tei:g apparatus "
                         "dropped, no rewording), which is the documented normalization; human sign-off "
                         "pending."),
                "collation_note": ("The unit's single source field collates verbatim to the pinned "
                                   "witness; the locator anchors the unit at its line head."),
                "source_edition": f"CBETA XML P5 {work}, revision {UPSTREAM_REVISION}",
            }
            unit_report.append({"case_num": number, "kind": kind,
                                "span": [unit["start"], unit["end"]], "cjk": len(zh),
                                "title_zh": title_zh, "page_line": head_line,
                                "case_close_line": close_line})
        cursor = start
        for unit in units:
            if unit["start"] != cursor:
                raise SystemExit(f"{work}: units do not tile the region: gap at {cursor}")
            cursor = unit["end"]
        if cursor != end:
            raise SystemExit(f"{work}: units stop at {cursor}, region ends at {end}")
        if "".join(ref[u["start"]:u["end"]] for u in units) != ref[start:end]:
            raise SystemExit(f"{work}: unit concatenation does not equal the region slice")
        witness_reports.append({
            "work": work,
            "witness_sha256": meta["sha256"],
            "reference_sha256": meta["ref_sha256"],
            "reference_cjk": meta["ref_cjk"],
            "region": [start, end], "region_cjk": end - start, "units": len(units),
            "kinds": {k: sum(1 for u in units if u["kind"] == k)
                      for k in sorted({u["kind"] for u in units})},
            "unit_list": unit_report,
        })
    content_cjk = sum(len(c["dialogue"][0]["zh"]) for c in cases)
    if content_cjk != sum(w["region_cjk"] for w in witness_reports):
        raise SystemExit("content CJK does not equal the tiled region total")

    doc = dict(target["doc"])
    doc["unit_structure"] = dict(sorted(census.items()))
    doc["cases"] = cases
    works = " + ".join(w["work"] for w in target["witnesses"])
    n = len(cases)
    digests = "; reference digests " + ", ".join(f"{w['work']} {w['reference_sha256']}"
                                                 for w in witness_reports)
    drift_note = {
        "zhaozhou_yulu_full": (" The reference extraction's digest matches the authoritative manifest "
                               "byte-for-byte; against the 2026-09-09 historical manifest this work's "
                               "reference carries recorded drift (X68n1315 is among the seven drifts the "
                               "2026-09-10 correction lists) — the document is new to the evidence record, "
                               "the drift is recorded in the register, not waived away."),
    }.get(document_key, (" Every claimed reference verifies byte-identically against both the authoritative "
                         "and the historical (2026-09-09) digest manifests."))
    doc["coverage_note"] = (
        f"All {n} units are verbatim and contiguous in the claimed witness(es) {works} under the pinned "
        f"extraction rule (scripts/collate_refs.py `cbeta-p5-body-cjk-v1`, CBETA XML P5 revision "
        f"{UPSTREAM_REVISION}). The producer scripts/segment_full_witness.py asserts at run time that the "
        f"concatenation of the unit texts equals the reference extraction's region character for character "
        f"({content_cjk} CJK characters across {len(witness_reports)} witness region(s)), so nothing is "
        "omitted, reordered or duplicated. Units are the witness's own blocks in document order: every "
        "`p` and `lg`, every `div` lead and every 卷 heading opens a unit. `title_zh` is the block's own "
        "目録 or jhead text where the witness prints one and the unit's first "
        f"{RECORD_TITLE_CHARS} CJK characters otherwise — always verbatim, never a paraphrase; every "
        "`title_en` and every `speaker` is project-authored metadata. " + COVERAGE_SUFFIX[document_key]
    )
    doc["cbeta_note"] = (
        f"Extracted {EXTRACTED} from the pinned witness(es) {works} (CBETA XML P5 revision "
        f"{UPSTREAM_REVISION}; witness file sha256 "
        + ", ".join(f"{w['work']} {w['witness_sha256']}" for w in witness_reports)
        + f";{digests}).{drift_note} English and pinyin titles are project-authored metadata (the "
        "witness carries no romanization); the Chinese source fields are witness text. The full-text "
        "collation is measured by scripts/collate_corpus.py --doc "
        f"{document_key}; the dated measurement and overlay registers live under sessions/."
    )
    doc["zh_chars"] = content_cjk
    if target["taisho_vol"] is not None:
        doc["taisho_vol"] = target["taisho_vol"]

    report = {
        "kind": "full-witness-extraction",
        "document": document_key,
        "upstream_revision": UPSTREAM_REVISION,
        "record_title_chars": RECORD_TITLE_CHARS,
        "witnesses": witness_reports,
        "units_total": n,
        "kinds": dict(sorted(census.items())),
        "content_cjk": content_cjk,
        "tiling": {"asserted": True, "concatenation_equals_region_slice": True},
    }
    order = ["id", "title_zh", "title_pinyin", "title_en", "cbeta_id", "taisho_vol", "author_zh",
             "author_en", "era", "genre", "overview", "unit_structure", "cases", "coverage_note",
             "cbeta_note", "zh_chars"]
    doc = {k: doc[k] for k in order if k in doc}
    return doc, case_locators, report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--doc", required=True)
    parser.add_argument("--source-dir", default=Path("/tmp/xmlp5"), type=Path)
    parser.add_argument("--refs-dir", default=Path("/tmp/refs"), type=Path)
    parser.add_argument("--out", type=Path, default=None)
    parser.add_argument("--locators-out", type=Path, default=None)
    parser.add_argument("--report", type=Path, default=None)
    args = parser.parse_args()
    if args.doc not in TARGETS:
        raise SystemExit(f"unknown doc {args.doc!r}; targets: {sorted(TARGETS)}")
    doc, case_locators, report = build(args.doc, args.source_dir, args.refs_dir)
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"document written: {args.out} ({len(doc['cases'])} units, {doc['zh_chars']} CJK)")
    if args.locators_out:
        args.locators_out.parent.mkdir(parents=True, exist_ok=True)
        args.locators_out.write_text(
            json.dumps({"documents": {args.doc: case_locators}}, ensure_ascii=False, indent=1) + "\n",
            encoding="utf-8")
        print(f"locators written: {args.locators_out} ({len(case_locators)})")
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=1) + "\n",
                               encoding="utf-8")
        print(f"report written: {args.report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
