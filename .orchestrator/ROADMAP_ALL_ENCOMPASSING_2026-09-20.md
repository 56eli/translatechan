# All-Encompassing Chan Scope Roadmap — Ideal Vision — 2026-09-20

**Kind:** ideal-vision roadmap document. It lands on `main` as a complete drafting of the all-encompassing
Chan scope (600–1400). **It does not have to be followed yet** — it is a target map, not a work order.
No corpus ingestion is performed here; nothing in this document changes a byte under `data/corpus/`.

**Base:** `main` = `83f1cbd` (38 docs, 4 collated, 1,606 locators, 553,011 content CJK, 4,851,526 B bundle,
P0 + P1 done, P2 dispatched).

**Method (task 049):** the agent scoped this himself. The starting point was
`.orchestrator/MASTER_REFERENCE_2026-09-20.md` (published on the orchestrator channel `origin/_orch`,
376 lines — channel-only file, not in this tree) plus the measured repository state. Everything else below was expanded by live web
search and page fetch on 2026-09-21 (Terebess Zen literature index, Zen Mountain Monastery recommended
reading, publisher and book-tracker pages, Wikipedia, Stanford Encyclopedia, lineage-chart sources).
Every external fact carries an inline citation [n](url); the full source list is at the end.
**No ISBN is asserted unless it was seen in a fetched page during this session; every other entry is
marked `needs_lookup`** (better many honest entries than a few fabricated ones). Chinese characters for
a figure are given only where the fetched source carried them; otherwise `—`.

**Scope of "all-encompassing Chan 600–1400":**

1. **All Chinese masters** of the period, with popular / in-use names and aliases (§2)
2. **All works** (yulu, denglu, gong'an collections, qinggui, treatises, histories), tiered
   enthusiast / scholarly / long-tail (§3)
3. **All notable English books** — translations with author, translator, publisher, year, ISBN where
   verified, original Chinese title, CBETA id, rights status (§4)
4. **A roadmap to overtake the English front** (Terebess, Zen Mountain Monastery, Shambhala, BDK,
   Columbia, Hawaii) — drafted, not worked (§5)
5. **The future wiki + database + reference-manifest file structure** (§6)
6. **Next steps** for enthusiast 100% (§7) and exhaustive 600–1400 100% (§8)
7. **Verification** — the measured state this roadmap was written against (§9)

The headline does not change: **"The old texts are real; the translators are not."** The Chinese source
layer stays real and collated against pinned CBETA witnesses; the English layer stays explicitly fake
(Robo, 🤖-badged) until a future, owner-approved AI-translation plan changes that. This document is the
map of *what "everything" would have to mean*.

---

## §1 Naming Convention — Why `zhaozhou_yulu` vs **Zhaozhou Congshen**, `qinggui_monastic_codes` vs **Baizhang Huaihai**

**The problem.** Corpus file ids are work-centric (`zhaozhou_yulu`, `baizhang_guanglu`,
`qinggui_monastic_codes`), lineage ids are master-centric (`zhaozhou_congshen`, `baizhang_huaihai`), and
every reader-facing name in the wild mixes the two: people say "Joshu" for the master and "Zhaozhou
Yulu" for the work, "Baizhang's monastic code" for the Qinggui (which is not Baizhang Huaihai's own
record at all — it is the Chanyuan qinggui compiled by Changlu Zongze in 1103, later revised as the
Chixiu Baizhang qinggui by Dongyang Dehui [1](https://terebess.hu/zen/textindex.html)). Without a registry, every future ingest has
to re-invent the name decision, and cross-references (master ↔ work ↔ English book) stay ad hoc.

**Measured current state (38 docs + 35 masters):**

| Corpus id (work-centric) | Lineage id (master-centric) | Popular name(s) in use |
|---|---|---|
| `zhaozhou_yulu` | `zhaozhou_congshen` (趙州從諗, 778–897) | Zhaozhou, Joshu, Jushin, Chao-chou Ts'ung-shen |
| `baizhang_guanglu` | `baizhang_huaihai` (百丈懷海, 720–814) | Baizhang, Hyakujo Ekai |
| `qinggui_monastic_codes` | (no single master — Changlu Zongze 1103, Baizhang tradition) | "Baizhang's monastic code", Chanyuan Qinggui |
| `dongshan_yulu` + `baojing_sanmei` | `dongshan_liangjie` (洞山良价, 807–869) | Dongshan, Tōzan Ryōkai, Tung-shan Liang-chieh |
| `wumenguan` | `wumen_huikai` (無門慧開, 1183–1260) | Wumen, Mumon, "the Gateless Gate/Barrier" |
| `biyanlu_cases` | `yuanwu_keqin` (compiler) + verse author Xuedou Chongxian (not yet a profile) | Blue Cliff Record, Hekiganroku |
| `congronglu` | verse author Hongzhi Zhengjue (not yet a profile) + compiler Wansong Xingxiu (not yet a profile) | Book of Serenity, Shōyōroku |

Note the last two rows: **a work can legitimately have two author figures** (verse author + compiler).
That is exactly why the registry needs an `authors` list, not a single `author_master_id`, and why the
two verse-author/compiler profiles (Xuedou, Hongzhi, Wansong) belong in the next master tranche (§2.3).

**The rule (proposed, for owner ratification):**

1. **Master ids** stay master-centric, `surname+given` pinyin, e.g. `zhaozhou_congshen`.
2. **Work ids** stay work-centric and describe the *work*, e.g. `zhaozhou_yulu` (the *record* of
   Zhaozhou), `biyanlu_cases` (the *work* at the Blue Cliff).
3. **Every master and every work gets a registry entry** with popular and formal names plus all known
   aliases (Wade-Giles, Japanese, Korean, Vietnamese, temple/posthumous titles, English renderings).
4. **Reader-facing display** prefers the popular name (Joshu, Baizhang, Blue Cliff Record); the formal
   name and aliases live in the expandable dossier — light mental load, one name on the surface, the
   full alias set one expansion away (per the 2026-09-14 Common Qualities ruling).
5. **`popular_name` → canonical id** is a committed lookup table (`data/aliases.json`), so any future
   search box, wiki, or database resolves "Joshu" / "Joshu Jushin" / "Chao-chou" to the same record.

**Registry entry shape (proposed; draft lives in `data/aliases.json` this PR):**

```json
{
  "id": "zhaozhou_congshen",
  "name_zh": "趙州從諗",
  "name_pinyin": "Zhàozhōu Cóngshěn",
  "name_en_popular": "Zhaozhou",
  "name_en_formal": "Zhaozhou Congshen",
  "name_ja": "Jōshū Jūshin",
  "name_ko": "Joju Chongshim",
  "aliases": ["Joshu", "Joshu Jushin", "Chao-chou Ts'ung-shen", "Zhaozhou Zhenji", "Joshu the Zen Master"],
  "works": ["zhaozhou_yulu"],
  "popular_work_names": ["The Recorded Sayings of Zen Master Joshu", "Zhaozhou's Recorded Sayings"]
}
```

Work entries carry the same idea: `id`, `title_zh`, `title_en_popular` (Recorded Sayings of Zhaozhou /
Joshu), `title_en_scholarly` (Zhaozhou Zhenji Chanshi Yulu), `authors` (list of master ids), `cbeta_id`,
`tier`, `aliases` (Gateless Gate → Mumonkan → Wu-men kuan → Gateless Barrier…), `english_translations`
(list of `english_references.json` ids).

**Implementation path (future work, not this PR):** extend `data/lineage/masters.json` with
`popular_name`/`works`; extend `data/corpus_manifest.json` items with `title_en_popular` + `authors`;
promote `data/aliases.json` (drafted here, 50 entries) into the enforced registry; the Reader's dossier
UI reads it. The draft registry and the draft English reference list land in this PR; promotion to the
bundle is a later, owner-ratified step.

---

## §2 All Chinese Masters 600–1400, With Aliases

Target for "exhaustive": **150–200 masters**. Below: the 35 already profiled in
`data/lineage/masters.json`, then everything found in this session's searches, grouped by era. Dates
follow the cited sources; where sources disagree, the range is given as-is (e.g. Mazu "709–788 or
688–763" [14](https://thesanghakommune.org/2014-12-07/chan-master-ma-zu-dao-yi-%E9%A9%AC%E7%A5%66%E9%81%93%E4%B8%80/)).
The tail beyond these (~100 more minor masters) lives inside the Guzunsu yulu and the denglu biographies
(1,701 persons in the Jingde Chuandeng Lu alone [8](https://grokipedia.com/page/The_Jingde_Record_of_the_Transmission_of_the_Lamp)[9](https://ctext.org/datawiki.pl?if=en&res=970171)) — that is the long-tail
ingestion queue, not a hand-typed list.

### 2.1 Already profiled (the exact 35 in `data/lineage/masters.json`)

| id | name_zh | popular | formal / aliases | house | works in corpus |
|---|---|---|---|---|---|
| `bodhidharma` | 菩提達摩 | Bodhidharma | Damo, Bodaidaruma (Daruma) | frontier (Indian) | `bodhidharma_erru` |
| `prajnatara` | 般若多羅 | Prajñātāra | Prajna Tara | frontier (Indian) | — |
| `huike` | 二祖慧可 | Dazu Huike | Shengguang 神光, Eka | Early | — |
| `sengcan` | 三祖僧璨 | Sengcan | Sōsan; Xinxin Ming attrib. | Early | `xinxin_ming` |
| `daoxin` | 四祖道信 | Dayi Daoxin | Daoyi | Early | — |
| `hongren` | 五祖弘忍 | Daman Hongren | Hongren | Early | — |
| `huineng` | 六祖慧能 | Huineng | Hui-neng, Rinen | Early (Nanhua) | `platform_sutra` |
| `nanyue_huairang` | 南嶽懷讓 | Nanyue Huairang | Nanyue (677–744) | Hongzhou ancestor | — |
| `qingyuan_xingsi` | 青原行思 | Qingyuan Xingsi | Qingyuan (660?–740) | Caodong/Yunmen ancestor | — |
| `mazu_daoyi` | 馬祖道一 | Mazu Daoyi | Ma-tsu Tao-i, Baso Dōitsu; 88 close disciples, 139 dharma heirs [4](https://en.wikipedia.org/wiki/Hongzhou_school) | Hongzhou | `mazu_yulu` |
| `shitou_xiqian` | 石頭希遷 | Shitou Xiqian | Sekitō Kisen (700–790) | Caodong ancestor | `shitou_sandokai` |
| `baizhang_huaihai` | 百丈懷海 | Baizhang Huaihai | Hyakujo Ekai (720–814) | Hongzhou → rules | `baizhang_guanglu` |
| `yaoshan_weiyan` | 藥山惟儼 | Yaoshan Weiyan | Yakusan Igen (745–828) | Caodong | — |
| `nanquan_puyuan` | 南泉普願 | Nanquan Puyuan | Nansen Fugan (748–835) | Hongzhou | `nanquan_yulu` |
| `huangbo_xiyun` | 黃檗希運 | Huangbo Xiyun | Ōbaku Kiun (d. 850) | Linji line | `huangbo_chuanxin`, `huangbo_wanling` |
| `linji_yixuan` | 臨濟義玄 | Linji Yixuan | Rinzai Gigen (d. 866) | **Linji** | `linji_yulu` |
| `zhaozhou_congshen` | 趙州從諗 | Zhaozhou / Joshu | Chao-chou Ts'ung-shen, Jōshū Jūshin (778–897) | Hongzhou | `zhaozhou_yulu` |
| `deshan_xuanjian` | 德山宣鑑 | Deshan Xuanjian | Tokusan Senkan (807–865) | Linji | `deshan_yulu` |
| `xuefeng_yicun` | 雪峰義存 | Xuefeng Yicun | Seppō Gison (822–908) | Linji | `xuefeng_yantou` |
| `longtan_chongxin` | 龍潭崇信 | Longtan Chongxin | Lung-tan Ch'ung-hsin (790–865) | Linji | — |
| `yunyan_tansheng` | 雲巖曇晟 | Yunyan Tansheng | Ungan Donjō (804–865) | Caodong | — |
| `dongshan_liangjie` | 洞山良价 | Dongshan Liangjie | Tōzan Ryōkai (807–869) | **Caodong** | `dongshan_yulu`, `baojing_sanmei` |
| `caoshan_benji` | 曹山本寂 | Caoshan Benji | Sōzan Honjaku (840–901) | **Caodong** | `caoshan_benji` |
| `yunmen_wenyan` | 雲門文偃 | Yunmen Wenyan | Ummon Bun'en (862/864–949) [5](https://en.wikipedia.org/wiki/Yunmen_Wenyan) | **Yunmen** | `yunmen_yulu` |
| `guishan_lingyou` | 溈山靈祐 | Guishan Lingyou | Isan Reiyū (771–853) | **Guiyang** | `guiyang_yulu` |
| `fayan_wenyi` | 法眼文益 | Fayan Wenyi | Hōgen Bun'eki (847–955) | **Fayan** | `fayan_yulu` |
| `xuansha_shibei` | 玄沙師備 | Xuansha Shibei | Gensha Shibi (806–890) | Linji | `xuansha_yulu` |
| `luohan_guichen` | 羅漢桂琛 | Luohan Guichen | Rakan Keichin (804–890) | Fayan line | — |
| `yangqi_fanghui` | 楊岐方會 | Yangqi Fanghui | Yōki Hōe (949–992) | Linji-Yangqi | — |
| `baiyun_shouduan` | 白雲守端 | Baiyun Shouduan | Hakuun Shutan (907–976) | Linji-Yangqi | — |
| `wuzu_fayan` | 五祖法演 | Wuzu Fayan | Goso Hōen (964–1032) | Linji-Yangqi | — |
| `yuanwu_keqin` | 圓悟克勤 | Yuanwu Keqin | Engo Kokugon (1063–1135) [16](http://www.rgm.hu/index.php?mid=178) | Linji-Yangqi | `yuanwu_letters`, `biyanlu_cases` (compiler) |
| `wumen_huikai` | 無門慧開 | Wumen Huikai | Mumon Ekai (1183–1260) | Linji-Yangqi | `wumenguan` |
| `yuelin_shiguan` | 月林師觀 | Yuelin Shiguan | Getsurin Shikan (1180–1250) | Linji-Yangqi | — |
| `dahong_zuzheng` | 大洪老衲祖證 | Dahong Zuzheng | Dahong Laonü, 大洪祖證 | frontier | — |

The five houses, in the standard order: **Guiyang, Linji, Caodong, Yunmen, Fayan** — the
systematization is Song; Guiyang, Fayan and Yunmen were later absorbed into the dominant Linji line
[2](https://tricycle.org/buddhism-meditation-schools/#lineage-transmission)[3](https://en.wikipedia.org/wiki/Chan_Buddhism).

*Gap inside the profiled set:* Foyan Qingyuan (佛眼清遠, 967–1037) has a corpus doc (`foyan_qingyuan`)
but **no** master profile in `masters.json` — it belongs in the next profile batch (§2.6). The table
above is the exact 35.

### 2.2 Missing Tang-era masters (618–907) found in this session's searches

(Chinese characters given only where a fetched source carried them; otherwise `—`.)

| proposed id | name_zh | popular | dates (per source) | house / relation | works / why notable | source |
|---|---|---|---|---|---|---|
| `yongjia_xuanjue` | 永嘉玄覺 | Yongjia Xuanjue | 665–713 | Huineng-era; met the Sixth Patriarch | **Zhengdao Ge** (證道歌, T2014) — already collated in corpus | [1](https://terebess.hu/zen/textindex.html) |
| `niutou_farong` | 牛頭法融 | Niutou Farong | 594–657 | Niutou school (Sichuan) | Xin Ming (心銘); corpus `niutou_juezhu` (witness_unavailable) | [1](https://terebess.hu/zen/textindex.html) |
| `baotang_wuzhu` | 保唐無住 | Baotang Wuzhu | 714–774 | Baotang school (Yizhou) | disciples compiled `lidai_fabao_ji` (in corpus) | [1](https://terebess.hu/zen/textindex.html) |
| `shenxiu` | 神秀 | Shenxiu | 606?–706 | Northern school (Hongren's dharma heir) | "polishing the mirror" tradition | [1](https://terebess.hu/zen/textindex.html) |
| `falu` | 法如 | Faru | 637–689 | Northern school, between Hongren and Shenxiu | lineage bridge, unique to Chuan fa bao ji | [1](https://terebess.hu/zen/textindex.html) |
| `shenhui` | 神會 | Shenhui | 704–758 | Huineng's champion; Shenshan | defended the Southern school at the court assembly | [1](https://terebess.hu/zen/textindex.html) |
| `nanyue_mingzan` | 懶瓚 | Lazy Zan / Lanzan | 8th c. | Nanyue lineage | **Ledao Ge** (樂道歌, "Song of Enjoying the Way") | [1](https://terebess.hu/zen/textindex.html) |
| `xitang_zhizang` | 西堂智藏 | Xitang Zhizang | d. 788-era | Mazu's successor at Kaiyuan | little survives; neglected in later sources | [4](https://en.wikipedia.org/wiki/Hongzhou_school) |
| `fenzhou_wuye` | 汾州無業 | Fenzhou Wuye | 761–823 | Mazu disciple | Hongzhou second generation | [4](https://en.wikipedia.org/wiki/Hongzhou_school) |
| `guizong_zhichang` | 歸宗智常 | Guizong Zhichang | n.d. | Mazu disciple | Hongzhou second generation | [4](https://en.wikipedia.org/wiki/Hongzhou_school) |
| `xingshan_weikuan` | 行山惟寬 | Xingshan Weikuan | 755–817 | Mazu disciple | Hongzhou second generation | [4](https://en.wikipedia.org/wiki/Hongzhou_school) |
| `zhangjing_huaihui` | — | Zhangjing Huaihui | 756–815 | Mazu disciple | Hongzhou second generation | [4](https://en.wikipedia.org/wiki/Hongzhou_school) |
| `danxia_tianran` | 丹霞天然 | Danxia Tianran | 739–824 | Mazu disciple | the furnace story; later canonized | [4](https://en.wikipedia.org/wiki/Hongzhou_school) |
| `yanguan_qian` | — | Yanguan Qian | 8th c. | Mazu's heirs | ch. 9 of *Zen Masters of China* | [15](https://archive.org/details/zenmastersofchin0000unse) |
| `panshan_baoji` | — | Panshan Baoji | 735–824 | Mazu's heirs | ch. 9 of *Zen Masters of China* | [15](https://archive.org/details/zenmastersofchin0000unse) |
| `shigong_huicang` | — | Shigong Huicang | 8th c. | Mazu's heirs | ch. 9 of *Zen Masters of China* | [15](https://archive.org/details/zenmastersofchin0000unse) |
| `damei_fachang` | — | Damei Fachang | 752–839 | Mazu's heirs ("one word opened my heart") | ch. 9 of *Zen Masters of China* | [15](https://archive.org/details/zenmastersofchin0000unse) |
| `hanshan` | — | Hanshan | 8th c. | poet-monk (with Shide) | corpus `hanshan_poems` (witness_unavailable) | [15](https://archive.org/details/zenmastersofchin0000unse) |
| `shide` | — | Shide | 8th c. | poet-monk (with Hanshan) | paired corpus item | [15](https://archive.org/details/zenmastersofchin0000unse) |
| `muzhou_daoming` | 睦州道明 | Muzhou Daoming | ca. 780–877 | Huangbo's dharma heir | sent Yunmen to Xuefeng; "Venerable Chen" | [6](https://wwzc.org/master-list-masters/) |
| `yangshan_huiji` | 仰山慧寂 | Yangshan Huiji | 815–890 | Guishan's dharma heir | **co-founder of Guiyang** (house named after both) | [2](https://tricycle.org/buddhism-meditation-schools/#lineage-transmission)[3](https://en.wikipedia.org/wiki/Chan_Buddhism) |
| `changsha_jingcen` | 長沙景岑 | Changsha Jingcen | 770–830 | Nanyue lineage; "Changsha line" | yulu in T47 (n1983) | MASTER_REFERENCE §3 |
| `tianhuang_daowu` | 天皇道悟 | Tianhuang Daowu | 748–807 | Nanyue lineage | ancestors of the Fayan and Yunmen lines through his heirs | [6](https://wwzc.org/master-list-masters/) |
| `moheyan` | 摩訶衍 | Moheyan (Mahāyāna) | 8th c. | frontier (Tibet) | the "instant enlightenment" debate at the Imperial Assembly | [1](https://terebess.hu/zen/textindex.html) |
| `kim_hwasang` | 金和尙 | Gim Hwasang / Jeongjung Musang | 680–756 (alt. 684–762) | frontier (Korea) | founder of Korean San (Seon) Buddhism | [1](https://terebess.hu/zen/textindex.html) |

**Count: 25 new Tang-era (+ frontier) masters.**

### 2.3 Missing Song-era masters (960–1279) found in this session's searches

| proposed id | name_zh | popular | dates (per source) | house / relation | works / why notable | source |
|---|---|---|---|---|---|---|
| `hongzhi_zhengjue` | 宏智正覺 | Hongzhi Zhengjue | 1091–1157 | Caodong (revival, Tiantong) | silent-illumination (mozhao) doctrine; verses of the **Book of Serenity**; *Hongzhi chanshi guanglu* T48n2001 | [3](https://en.wikipedia.org/wiki/Chan_Buddhism)[16](http://www.rgm.hu/index.php?mid=178)[17](http://www.thezensite.com/ZenEssays/HistoricalZen/Bright_Field_of_Spirit_Hongzhi.html) |
| `dahui_zonggao` | 大慧宗杲 | Dahui Zonggao | 1089–1163 | Linji-Yangqi | invented **kanhua** (huatou) practice; *Zhengfa yanzang* X1309; letters T47n1998A/B | [3](https://en.wikipedia.org/wiki/Chan_Buddhism)[16](http://www.rgm.hu/index.php?mid=178) |
| `wansong_xingxiu` | 萬松行秀 | Wansong Xingxiu | 1166–1246 | Caodong | compiled the **Congrong Lu** (1224) | [1](https://terebess.hu/zen/textindex.html)[6](https://wwzc.org/master-list-masters/) |
| `xuedou_chongxian` | 雪竇重顯 | Xuedou Chongxian | 980–1052 | Linji (Qiyuan lineage) | capping verses of the **Biyan Lu**; *Puquan ji* | [1](https://terebess.hu/zen/textindex.html) |
| `touzi_yiqing` | 投子義青 | Touzi Yiqing | 1032–1083 | Linji | *Konggu ji* (100 koans with verses) | [1](https://terebess.hu/zen/textindex.html)[16](http://www.rgm.hu/index.php?mid=178) |
| `danxia_zichun` | 丹霞子淳 | Danxia Zichun | 1064–1117 | Caodong | Hongzhi's main teacher; verses in *Xutang ji* | [16](http://www.rgm.hu/index.php?mid=178)[1](https://terebess.hu/zen/textindex.html) |
| `linquan_conglun` | 林泉從倫 | Linquan Conglun | n.d. | Caodong | commentaries in *Konggu ji* / *Xutang ji* | [1](https://terebess.hu/zen/textindex.html) |
| `fenyang_shanzhao` | 汾陽善昭 | Fenyang Shanzhao | 947–1024 | Linji; dharma heir of Dongshan | **first to add verse commentaries to koans**; ancestor of all surviving Linji lineages (through Ciming Quyuan) | [6](https://wwzc.org/master-list-masters/) |
| `fenyang_wude` | 汾陽無德 | Fenyang Wude | 962–1049 | Linji-Fenyang | *Fenyang Wude chanshi yulu*, T47n1992 | [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu) |
| `huanglong_huinan` | 黃龍慧南 | Huanglong Huinan | 1002–1069 | Linji-Huanglong | co-founder (with Yangqi) of the Linji split; yulu T47n1993 | MASTER_REFERENCE §2 |
| `furong_daokai` | 芙蓉道楷 | Furong Daokai | 1043–1118 | Caodong | revival of the Caodong house in the mid-Song | [17](http://www.thezensite.com/ZenEssays/HistoricalZen/Bright_Field_of_Spirit_Hongzhi.html) |
| `qingliao` | — | Qingliao | 1088–1151 | Caodong | Hongzhi's era peer; a work published 1134 | [16](http://www.rgm.hu/index.php?mid=178) |
| `shoushan_shengnian` | 首山省念 | Shoushan Shengnian | 926–993 | Linji | *Tiansheng guangdeng lu* compiled to document him and his disciples | [1](https://terebess.hu/zen/textindex.html) |
| `xutang_zhiyu` | 虛堂智愚 | Xutang Zhiyu | 1185–1269 | Linji | *Xutang heshang yulu*; Hakuin later commented on it | [1](https://terebess.hu/zen/textindex.html) |
| `yongming_yanshou` | 永明延寿 | Yongming Yanshou | 904–975 | Tiantai-Caodong synthesis | **Zongjing lu** (Records of the Source Mirror, 100 fascicles, 960) | [1](https://terebess.hu/zen/textindex.html) |
| `juefan_huihong` | 覺範慧洪 | Juefan Huihong | 1071–1128 | Linji | **Chanlin sengbao zhuan**, **Linjian lu** | [1](https://terebess.hu/zen/textindex.html) |
| `zifu` | — | Zifu | 9th–10th c. | Guiyang | transmitted 97 mandalas; Guiyang merged into Linji mid-10th c. | [6](https://wwzc.org/master-list-masters/) |
| `cishou_huaishen` | 慈受懷深 | Cishou Huaishen | 10th c. | Linji (early Song) | *Cishou Huaishen chanshi guanglu*, ZZ 73 no. 1451 | [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu) |
| `yuansou_xingduan` | 元叟行端 | Yuansou Xingduan | 1226–1311 | Linji-Yangqi (Dahui wing) | four "abbacy yulu"; the "bureaucratic" Five-Mountains abbot; yulu X71n1419 | [19](https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568)[20](https://dokumen.pub/the-recorded-sayings-of-chan-master-zhongfeng-mingben-bilingualnbsped-0197672973-980197672976.html) |
| `xueyan_zuqin` | 雪巖祖欽 | Xueyan Zuqin | ?–1287 | Linji | earliest known Chinese spiritual autobiographies (yulu genre) | [20](https://dokumen.pub/the-recorded-sayings-of-chan-master-zhongfeng-mingben-bilingualnbsped-0197672973-980197672976.html) |
| `ying_an` | — | Ying-an | n.d. | Song | contributor in *Infinite Mirror* (Cleary anthology) — name to verify | [37](https://www.shambhala.com/zen-tang-dynasty/) |
| `mi_an` | — | Mi-an | n.d. | Song | contributor in *Infinite Mirror* — name to verify | [37](https://www.shambhala.com/zen-tang-dynasty/) |
| `xia_tang` | — | Xiatang | n.d. | Song | contributor in *Infinite Mirror* — name to verify | [37](https://www.shambhala.com/zen-tang-dynasty/) |

**Count: 23 new Song-era masters** (three *Infinite Mirror* entries flagged honestly as needing the
proper Chinese names before profiling).

### 2.4 Denglu compilers and genealogists (the "editors" of the lineage)

| proposed id | name_zh | popular | dates (per source) | work | source |
|---|---|---|---|---|---|
| `jingjue` | 淨覺 | Jingjue | 683–750? | *Lengqie shizi ji* (Record of the Lankāvatāra school) | [1](https://terebess.hu/zen/textindex.html) |
| `du_fei` | 杜朏 | Du Fei | d.u. (c. 713) | *Chuan fa bao ji* (lay compiler, Dunhuang manuscript) | [1](https://terebess.hu/zen/textindex.html) |
| `zhiju` | 智矩 (or 慧矩) | Zhiju/Huiju | 801 | *Baolin zhuan* (10 rolls, incomplete) | [1](https://terebess.hu/zen/textindex.html) |
| `daoyuan` | 道原 | Daoyuan (Yongan) | fl. ca. 1000, d.u. | **Jingde Chuandeng lu** (1004; edited under Yang Yi 974–1020) | [1](https://terebess.hu/zen/textindex.html)[8](https://grokipedia.com/page/The_Jingde_Record_of_the_Transmission_of_the_Lamp)[10](https://open.library.ubc.ca/cIRcle/collections/ubccommunityandpartnerspublicati/52387/items/1.0438211) |
| `li_zunxu` | 李遵勗 | Li Zunxu | 988–1038 | *Tiansheng guangdeng lu* (1029/1036, official) | [1](https://terebess.hu/zen/textindex.html) |
| `foguo_weibai` | 佛國惟白 | Foguo Weibai | d.u. | *Jianzhong Jingguo xudeng lu* (1101/1103) | [1](https://terebess.hu/zen/textindex.html) |
| `zongyong` | 宗永 | Zongyong | n.d. | *Zongmen tongyao ji* (1,107 koans, 1133) | [1](https://terebess.hu/zen/textindex.html) |
| `huiweng_wuming` | 晦翁悟明 | Huiweng Wuming | d.u. | *Zongmen liandeng huiyao* (1183) | [1](https://terebess.hu/zen/textindex.html) |
| `leian_zhengshou` | 雷庵正受 | Leian Zhengshou | 1146–1208 | *Jiatai pudeng lu* (1204) | [1](https://terebess.hu/zen/textindex.html) |
| `dachuan_puji` | 大川普濟 | Dachuan Puji | 1179–1253 | **Wudeng huiyuan** (1252/1253) | [1](https://terebess.hu/zen/textindex.html) |
| `fori_qisong` | 佛日契崇 | Fori Qisong | 1007–1072 | edited *Chuanfa zhenzong ji* (pub. 1591) | [1](https://terebess.hu/zen/textindex.html) |
| `qu_ruji` | 瞿汝稷 | Qu Ruji | 1548–1610 | **Zhiyue lu** (32 juan, 1595) | [1](https://terebess.hu/zen/textindex.html) |
| `nie_xian` | 聶先 | Nie Xian | active 1679 | *Xu zhiyue lu* (20 juan) | [1](https://terebess.hu/zen/textindex.html) |

**Count: 13 genealogists** (most are compilers, not practice masters — the future `data/masters/`
record should carry a `role: master | compiler | both` field).

### 2.5 East-Asian transmission frontier (the scope edge, 1100–1400 and just beyond)

| proposed id | name_zh | popular | dates | why in scope | source |
|---|---|---|---|---|---|
| `chinul` | 知訥 | Chinul (Jinul) | 1158–1210 | Korea; Seon synthesis; subject of Buswell's *Tracing Back the Radiance* | [12](https://zmm.org/teachings-and-training/recommended-reading/) |
| `dogen_kigen` | 道元 | Dōgen | 1200–1253 | Japan; received transmission from Caodong master Tiantong Rujing; *Shōbōgenzō*, *Eihei shingi* | [13](https://www.scribd.com/doc/251590366/Ferguson-Lineage-Chart-of-the-Zen-Ancestors-in-China)[1](https://terebess.hu/zen/textindex.html) |
| `eisai` | 栄西 | Eisai | 1141–1215 | Japan; brought Rinzai back from China (transmission from Xuan Huaichang) | [13](https://www.scribd.com/doc/251590366/Ferguson-Lineage-Chart-of-the-Zen-Ancestors-in-China) |
| `keizan_jokin` | 瑩山紹瑾 | Keizan Jōkin | 1268–1325 | Japan (Sōtō); *Denkōroku*, *Zazen yōjinki* | [1](https://terebess.hu/zen/textindex.html) |
| `mujū_ichien` | 無住一円 | Muju Ichien | 1226–1312 | Japan; *Shaseki shū* (101 Zen Stories) | [1](https://terebess.hu/zen/textindex.html) |
| `cao_tang` | — | Cao Tang | 11th c. | Vietnam; disciple of Xuedou Chongxian, founded the Thao-Duong school | [13](https://www.scribd.com/doc/251590366/Ferguson-Lineage-Chart-of-the-Zen-Ancestors-in-China) |

### 2.6 The long tail (~100 more) and gaps

- **Guzunsu yulu** (古尊宿語錄, X68n1315, 48 fascicles, compiled 1267) holds records of ~20 eminent
  masters from Nanquan to Zhimen Guangzuo (d. 1031) [1](https://terebess.hu/zen/textindex.html) — the
  ready-made source for the next ~20 Tang/Song master profiles.
- **Jingde Chuandeng Lu** itself: 1,701 persons across 52 generations, 951 with full biographical
  treatment [8](https://grokipedia.com/page/The_Jingde_Record_of_the_Transmission_of_the_Lamp)[9](https://ctext.org/datawiki.pl?if=en&res=970171) — the
  ceiling of what "exhaustive 600–1400" means for *named* figures, and it is already 1,274 units in our
  corpus (`chuandenglu_full`).
- **Wudeng huiyuan** (X1565) and the other four lamps overlap heavily; the marginal master set added
  by the later lamps is modest (that is why Wudeng is the canonical compendium) [1](https://terebess.hu/zen/textindex.html).
- **Yuan-dynasty masters (1271–1368, in period):** Zhongfeng Mingben (d. 1333 — full bilingual English
  translation exists, Kirchner, Oxford 2021 [20](https://dokumen.pub/the-recorded-sayings-of-chan-master-zhongfeng-mingben-bilingualnbsped-0197672973-980197672976.html)), Tianru Weize, Gaofeng Yuanmiao (X70)
  [20](https://dokumen.pub/the-recorded-sayings-of-chan-master-zhongfeng-mingben-bilingualnbsped-0197672973-980197672976.html).
- **Gaps to close before the list is "150–200":** the three *Infinite Mirror* names without Chinese
  characters (§2.3); Foyan Qingyuan (佛眼清遠, 967–1037) — corpus doc without a master profile
  (§2.1 note); Dazhu Huihai's exact dates (trad. 720–804 — not re-verified this session, the
  existing profile stands); Fayan Wenyi's dates (trad. 847–955 — same).

**Session tally: 35 profiled + 25 Tang + 23 Song + 13 genealogists + 6 frontier = 102 masters
inventoried with sources; the path to 150–200 is the Guzunsu yulu + denglu tail above.**

---

## §3 All Works Tiered — Enthusiast / Scholarly / Long-Tail

CBETA ids marked `needs_lookup` were not re-verified against cbeta.org in this session and must be
checked before any ingest pin (the project's rule: a work is cited as a text's witness only when ≥1
*evaluated content field* collates in it — the W1 continuation invariant). "In corpus" rows carry the
measured W1 state from `data/corpus_manifest.json` + the 2026-09-20 register (630 flagged,
authoritative).

### 3.1 Tier 1 — Enthusiast daily practice, top 10 most-read (current corpus state)

| # | corpus id | title_zh | popular English | CBETA | measured state (2026-09-20) |
|---|---|---|---|---|---|
| 1 | `wumenguan` | 無門關 | The Gateless Gate / Gateless Barrier (48 cases) | T2005 | 48/48 case records; 113/181 fields collating — `partial_or_failed_w1_collation` |
| 2 | `biyanlu_cases` | 碧巖錄 | The Blue Cliff Record (100 cases) | T2003 | 100/100 case records; 353/395 fields collating — `partial` |
| 3 | `congronglu` | 從容錄 | The Book of Serenity (100 cases) | T2004 | **100/100 cases, 500/500 fields EXACT — `collated_to_claimed_witness`** (P1-1) |
| 4 | `chuandenglu_full` (+ `chuandenglu` excerpt) | 景德傳燈錄 | Record of the Transmission of the Lamp (30 fascicles, 1,701 persons) | T51n2076 | **1,274 units, 2,549/2,549 EXACT — `collated_to_claimed_witness`** (P1-2) |
| 5 | `caoshan_benji` | 曹山本寂禪師語錄 | Caoshan Benji's Recorded Sayings (84 units) | T47n1987A | **84/84 units, 169/169 EXACT — `collated_to_claimed_witness`** (P1-3); sibling T47n1987B cross-referenced as probe |
| 6 | `platform_sutra` | 六祖壇經 | The Platform Sutra (recension pair) | T2007 (primary) / T2008 (alt) | 13 source-content fields; Dunhuang-primary labels, 9 labelled précis, 0 re-keyed |
| 7 | `xinxin_ming` | 信心銘 | The Inscription on Faith in Mind / Xinxin Ming | T2010 | 37/37 stanzas; 24/37 fields collating — `partial` (1 NOT_FOUND stanza kept by owner ruling) |
| 8 | `zhengdao_ge` | 證道歌 | The Song of Enlightenment / Song of Realization | T2014 | **6/6 fields — `collated_to_claimed_witness`** |
| 9 | `linji_yulu` | 臨濟語錄 | The Recorded Sayings of Linji (74 sections) | T1985 | 74 sections; 84/89 fields collating — `partial` (3 R-B-labelled 行錄 retellings kept) |
| 10 | `shitou_sandokai` + `baojing_sanmei` | 參同契 / 寶鏡三昧 | The Song of Identity / Sandokai + Jewel Mirror Samadhi | T2076 f.30 / T1986 | excerpt_seed; part of the Caodong poetic core |

### 3.2 Tier 1 — still missing for enthusiast 100% (the next ingests, queued as Task 050)

| proposed id | title_zh | popular English | CBETA | notes (measured) |
|---|---|---|---|---|
| `zhaozhou_yulu_full` | 趙州真際禪師語錄 (in 古尊宿語錄) | Recorded Sayings of Zhaozhou / Joshu (full) | X68n1315 | corpus carries 15 dialogues (19 fields, 2 collating); the false T1987 claim was withdrawn (T1987 = Caoshan); full X68n1315 fascicle is the goal; 12 of the 100 Blue Cliff cases and 5 of the 48 Gateless Gate cases are Zhaozhou [33](https://books.google.com/books/about/The_Recorded_Sayings_of_Zen_Master_Joshu.html?id=Vcc_PgAACAAJ) |
| `mazu_yulu_full` | 馬祖道一禪師廣錄 | Recorded Sayings of Mazu (full) | X1321 | corpus `mazu_yulu` is excerpt_seed; no complete English translation found in this session (fragments only — see §4) |
| `huangbo_chuanxin_full` | 黃檗傳心法要 | Huangbo's Essentials of Transmitting the Mind (full) | T2012A | corpus `huangbo_chuanxin` excerpt_seed; English front: Blofeld 1958 + BDK *Zen Texts* 2006 |
| `dongshan_yulu_full` | 洞山良价禪師語錄 (瑞州洞山良价禪師語錄) | Recorded Sayings of Dongshan (full) | T1986 (T47n1986b per [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu)) | corpus `dongshan_yulu` excerpt_seed; English front: Powell 1986 |
| `yunmen_yulu_full` | 雲門匡真禪師廣錄 | Recorded Sayings of Yunmen (full) | T1988 | corpus `yunmen_yulu` excerpt_seed; English front: Urs App *Master Yunmen* 1994 |
| `dahui_letters_full` | 大慧普覺禪師語錄 | Dahui's Letters (full) | T47n1998A/B + T48n2001 | corpus `dahui_hongzhi` 0/6 (bibliographic pairing, not collation); the 宏智禪師廣錄 T48n2001 pairing is the Mozhaoming location per the W1 witness note |
| `qingyi_lu` (optional sibling) | 請益錄 | Record of Further Inquiries (Wansong + Hongzhi, 100 cases) | X1307 (linked as X67n1307 at [1](https://terebess.hu/zen/textindex.html)) | the natural companion to `congronglu`; 2 public cases already in English at Terebess |

### 3.3 Tier 2 — core yulu incomplete in corpus (P2 dispatch: 047/048)

| corpus id | title_zh | CBETA (as claimed) | measured state |
|---|---|---|---|
| `baizhang_guanglu` | 百丈懷海禪師廣錄 | X1323 | 3/3 sections, 6 fields, 0/6 collating — P2-1 authenticity labels |
| `huangbo_wanling` | 黃檗宛陵錄 | T2012B | 0/7 in claimed witness; 0/7 across all 39 refs — P2-1 |
| `dazhu_huihai` | 頓悟入道要門論 / 諸方門人參問語錄 | X1223 / X1224 | 0/6 collated, no ≥8-graph run — P2-2 re-key attempt |
| `nanquan_yulu` | 南泉普願禪師語要 | X1315 | 0/6 collated (largest run 23/27) — P2-2 |
| `deshan_yulu` | 德山宣鑑禪師語錄 | T2076 f.15 / X1565 f.7 | excerpt_seed |
| `fayan_yulu` | 法眼文益禪師語錄 | T1991 / X1226 | excerpt_seed |
| `guiyang_yulu` | 溈仰語錄 | T1989 / T1990 | excerpt_seed |
| `xuansha_yulu` | 玄沙師備禪師廣錄 | X1445 (alt. X1446) | excerpt_seed |
| `xuefeng_yantou` | 雪峰義存禪師語錄 | X1333 / T2076 f.16 | excerpt_seed |
| `yuanwu_letters` | 圓悟克勤禪師語錄 (佛果圜悟禪師語錄) | X1357 / T47n1997 [19](https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568) | excerpt_seed |
| `foyan_qingyuan` | 佛眼清遠禪師語錄 | X1315 | excerpt_seed |
| `caoxi_zhuan` | 曹溪大師別傳 | X1598 | excerpt_seed (a *zhuan*, not a yulu) |
| `sengzhao_zhaolun` | 肇論 | T1858 | excerpt_seed (pre-Chan philosopher, boundary case) |

### 3.4 Tier 3a — Denglu (lamp records) and genealogies — long-tail scholarly

| # | title_zh | English | compiler / date | CBETA | status |
|---|---|---|---|---|---|
| 1 | 景德傳燈錄 | Record of the Transmission of the Lamp | Daoyuan, 1004 (ed. Yang Yi) | T51n2076 | **in corpus, collated** (1,274 units) |
| 2 | 天聖廣燈錄 | Tiansheng Expanded Lamp Record | Li Zunxu, 1029/1036 | X1556 (MASTER_REFERENCE) | missing |
| 3 | 建中靖國續燈錄 | Continued Lamp Record (Jianzhong Jingguo era) | Foguo Weibai, 1101/1103 | needs_lookup | missing [1](https://terebess.hu/zen/textindex.html) |
| 4 | 宗門聯燈會要 | Essentials of the United Lamp Records | Huiweng Wuming, 1183 | X1557 (MASTER_REFERENCE) | missing |
| 5 | 嘉泰普燈錄 | Jiatai Universal Lamp Record | Leian Zhengshou, 1204 | X1559 (MASTER_REFERENCE) | missing |
| 6 | 五燈會元 | A Compendium of the Five Lamps | Dachuan Puji, 1252/1253 | X1565 | in corpus (3 sections, excerpt_seed) |
| 7 | 宗門統要集 | Essential Collection of the Lineage (1,107 koans) | Zongyong, 1133 | needs_lookup | missing [1](https://terebess.hu/zen/textindex.html) |
| 8 | 傳法寶紀 | Annals of the Transmission of the Dharma Jewel | Du Fei (lay), c. 713 | T85n2838 [1](https://terebess.hu/zen/textindex.html) | missing (Dunhuang ms) |
| 9 | 楞伽師資記 | Record of the Lankāvatāra School | Jingjue, 683–750? | needs_lookup | missing |
| 10 | 歷代法寶記 | Record of the Dharma-Jewel through the Ages | disciples of Baotang Wuzhu, c. 778–780 | T2075 / P.2125 | in corpus, 0/3 collated |
| 11 | 寶林傳 | Chronicle of the Bejeweled Forest | Zhiju/Huiju, 801 | P.2126 (Dunhuang) | missing (incomplete extant) |
| 12 | 祖堂集 | Collection from the Halls of the Patriarchs (253 figures) | Jing & Jun, 952 | needs_lookup | missing (the earliest surviving Chan genealogy) |
| 13 | 宗鏡錄 | Records of the Source Mirror (100 fascicles) | Yongming Yanshou, 960 | needs_lookup | missing [1](https://terebess.hu/zen/textindex.html) |
| 14 | 傳法正宗記 | Record of the Orthodox Tradition's Transmission | Fori Qisong (ed.), pub. 1591 | needs_lookup | missing |
| 15 | 禪林僧寶傳 | Chronicles of the Sangha Jewel in the Forests of Chan | Juefan Huihong, c. 1128 | needs_lookup | missing [1](https://terebess.hu/zen/textindex.html) |
| 16 | 指月錄 | The Finger Pointing at the Moon (32 juan) | Qu Ruji (lay), 1595 | needs_lookup | missing [1](https://terebess.hu/zen/textindex.html) |
| 17 | 續指月錄 | Continuation of the Finger Pointing (20 juan) | Nie Xian, 1679 | needs_lookup | missing |
| 18 | 高僧傳 (Tang) | Tang Biographies of Eminent Monks | Daoxuan, 645/665 | T50n2059 [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu) | missing (background) |
| 19 | 宋高僧傳 | Song Biographies of Eminent Monks | Zanning, 988 | needs_lookup | missing [1](https://terebess.hu/zen/textindex.html) |

### 3.5 Tier 3b — Gong'an (koan) collections beyond the big three

| # | title_zh | English | master / date | CBETA | status |
|---|---|---|---|---|---|
| 1 | 無門關 | The Gateless Gate (48) | Wumen Huikai, 1228 | T2005 | in corpus (Tier 1) |
| 2 | 碧巖錄 | The Blue Cliff Record (100) | Xuedou verses + Yuanwu, 1125 | T2003 | in corpus (Tier 1) |
| 3 | 從容錄 | The Book of Serenity (100) | Hongzhi verses + Wansong, 1223 | T2004 | in corpus (Tier 1) |
| 4 | 請益錄 | Record of Further Inquiries (100) | Hongzhi + Wansong | X1307 | missing (§3.2) |
| 5 | 擊節錄 | The Measuring Tap (100) | Xuedou + Yuanwu | needs_lookup | missing; English: Cleary [1](https://terebess.hu/zen/textindex.html) |
| 6 | 雪竇百則頌古集 | Odes to a Classic Hundred Standards | Xuedou (pre-Biyan form) | needs_lookup | missing [1](https://terebess.hu/zen/textindex.html) |
| 7 | 雪竇百則拈古集 | Verses on One Hundred Old Cases (pre-Jijie form) | Xuedou | needs_lookup | missing |
| 8 | 空谷集 | Empty Valley Collection (100) | Touzi Yiqing verses + Linquan Conglun, 11th c. | X1303 [1](https://terebess.hu/zen/textindex.html) | missing; 2 cases in English (Cleary) |
| 9 | 虛堂集 | Vacant Hall Collection (100) | Danxia Zichun verses + Linquan Conglun | needs_lookup | missing; 3 cases in English (Cleary), full 100 by Dōshō Port |
| 10 | 正法眼藏 | Treasury of the True Dharma Eye (680 cases) | Dahui Zonggao, 1147–1150 | X1309 | in corpus (`dahui_shobogenzo`, excerpt_seed) |
| 11 | 禪關策進 | The Chan Whip (1600) | Yunqi Zhuhong | needs_lookup | missing; full English PDF at Terebess |
| 12 | 御選語錄 | Imperial Selections of Recorded Sayings | Yongzheng emperor | X68n1319 [19](https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568) | missing |
| 13 | 古尊宿語錄 | Recorded Sayings of the Ancient Worthies (48 juan, ~20 masters) | compiled 1267 (rev. of 1144 guzunsu yuyao) | X68n1315 [1](https://terebess.hu/zen/textindex.html) | missing as a work — it is also the Zhaozhou witness vehicle (§3.2); excerpts in Lu Kuan Yu 1974 |
| 14 | 十牛圖頌 | The Ten Ox-Herding Pictures (verses) | attributed variously (Niutou/Zhiguan tradition) | needs_lookup | missing; multiple English versions indexed at Terebess [1](https://terebess.hu/zen/textindex.html) |
| 15 | 宗門葛藤集 | Entangling Vines (282 koans, Myōshin-ji, 1689) | Japanese | — (Japanese text) | outside CBETA scope; English index exists [39](https://www.egreenway.com/buddhism/koans.htm) |
| 16 | 湘南葛藤錄 | The Warrior Koans (100) | Muin, 1545 (reedited 1925) | Japanese | English: Trevor Leggett [1](https://terebess.hu/zen/textindex.html) |
| 17 | 沙石集 | Sand and Pebbles / 101 Zen Stories | Muju Ichien, 13th c. | Japanese | English: Senzaki & Reps [1](https://terebess.hu/zen/textindex.html) |
| 18 | 鐵笛倒吹 | The Iron Flute (100 koans, 1783) | Genrō Ōryū + Fūgai Honkō | Japanese | English: Senzaki & McCandless [1](https://terebess.hu/zen/textindex.html) |
| 19 | 禪林句集 | Zen Phrase Books | attributed Tōyō Eichō (1428–1504) | Japanese | missing (index only) |
| 20 | 現代相似禪評論 | A Critique of Present-day Pseudo-Zen (1916) | pseud. Tominaga Shūho | Japanese | excerpts in English [1](https://terebess.hu/zen/textindex.html) |

### 3.6 Tier 3c — Yulu (recorded sayings) beyond Tier 1–2 — the scholarly long tail

| # | title_zh | master | CBETA | status |
|---|---|---|---|---|
| 1 | 鎮州臨濟慧照禪師語錄 | Linji Yixuan | T1985 | in corpus (Tier 1) |
| 2 | 趙州真際禪師語錄 | Zhaozhou Congshen | X68n1315 | partial in corpus (§3.2) |
| 3 | 馬祖道一禪師廣錄 | Mazu Daoyi | X1321 | excerpt in corpus (§3.2) |
| 4 | 黃檗山斷際禪師傳心法要 | Huangbo Xiyun | T2012A | excerpt in corpus (§3.2) |
| 5 | 黃檗宛陵錄 | Huangbo Xiyun | T2012B | in corpus (Tier 2) |
| 6 | 瑞州洞山良价禪師語錄 | Dongshan Liangjie | T1986 / T47n1986b [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu) | excerpt in corpus (§3.2) |
| 7 | 撫州曹山本寂禪師語錄 | Caoshan Benji | T47n1987A (B = sibling part) | **in corpus, collated** (P1-3) |
| 8 | 雲門匡真禪師廣錄 | Yunmen Wenyan | T1988 | excerpt in corpus (§3.2) |
| 9 | 百丈懷海禪師廣錄 | Baizhang Huaihai | X1323 | in corpus (Tier 2) |
| 10 | 長沙景岑禪師語錄 | Changsha Jingcen | T47n1983 (MASTER_REFERENCE) | missing |
| 11 | 汾陽無德禪師語錄 | Fenyang Wude | T47n1992 [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu) | missing |
| 12 | 黃龍慧南禪師語錄 | Huanglong Huinan | T47n1993 (MASTER_REFERENCE) | missing |
| 13 | 圓悟佛果禪師語錄 | Yuanwu Keqin | T47n1997 / X1357 [19](https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568) | in corpus (Tier 2) |
| 14 | 明覺禪師語錄 | Mingjue Chanshi | T47n1996 per [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu)[38](https://escholarship.org/content/qt8n07675j/qt8n07675j_noSplash_7d5925b89b24bb270d22d7c23e9408d2.pdf) — **conflicts with MASTER_REFERENCE's T47n1996 = Yangqi Fanghui yulu; resolve at ingest** | missing |
| 15 | 楊岐方會禪師語錄 | Yangqi Fanghui | T47n1996 (MASTER_REFERENCE) | missing (see id conflict above) |
| 16 | 大慧普覺禪師語錄 | Dahui Zonggao | T47n1998A/B [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu) | excerpt in corpus (§3.2) |
| 17 | 宏智禪師廣錄 | Hongzhi Zhengjue | T48n2001 [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu) | missing (the largest Song yulu corpus) |
| 18 | 慈受懷深禪師廣錄 | Cishou Huaishen | ZZ73n1451 [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu) | missing |
| 19 | 虛堂智愚禪師語錄 | Xutang Zhiyu | needs_lookup (X1443 family) | missing |
| 20 | 元叟行端禪師語錄 | Yuansou Xingduan | X71n1419 [19](https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568) | missing (Yuan) |
| 21 | 雲外雲岫禪師語錄 | Yunwai Yunxiu | X72n1431 [19](https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568) | missing (Yuan) |
| 22 | 西歸直指 | Xigui Zhizhi | X62n1173 [19](https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568) | missing (Yuan) |
| 23 | 中峰明本禪師語錄 | Zhongfeng Mingben | needs_lookup (Yuan) | missing — **full bilingual English exists (Kirchner, Oxford 2021)** [20](https://dokumen.pub/the-recorded-sayings-of-chan-master-zhongfeng-mingben-bilingualnbsped-0197672973-980197672976.html) |
| 24 | 天如惟則禪師語錄 | Tianru Weize | needs_lookup (1403) [20](https://dokumen.pub/the-recorded-sayings-of-chan-master-zhongfeng-mingben-bilingualnbsped-0197672973-980197672976.html) | missing (Yuan) |
| 25 | 高峰原妙禪師語錄 | Gaofeng Yuanmiao | X70 [20](https://dokumen.pub/the-recorded-sayings-of-chan-master-zhongfeng-mingben-bilingualnbsped-0197672973-980197672976.html) | missing (Yuan) |
| 26 | 禪林句集 / 禪門備用 | misc. Tang minor yulu | Guzunsu yulu fascicles (X68) | missing as ~20 individual records |
| 27 | 古尊宿語要 | Essential Sayings of the Ancient Worthies (4 juan) | X68n1316 (TOC only, extant) [1](https://terebess.hu/zen/textindex.html) | missing (historical) |

### 3.7 Tier 3d — Treatises, short texts, monastic codes

| # | title_zh | English | author | CBETA | status |
|---|---|---|---|---|---|
| 1 | 信心銘 | Inscription on Trusting the Mind | Sengcan (attrib.) | T2010 | in corpus (Tier 1) |
| 2 | 證道歌 | Song of Enlightenment | Yongjia Xuanjue | T2014 | in corpus (Tier 1, collated) |
| 3 | 參同契 | The Song of Identity / Sandokai | Shitou Xiqian | T2076 f.30 | in corpus (Tier 1) |
| 4 | 艸庵歌 | Song of the Grass-Roof Hermitage | Shitou Xiqian | needs_lookup | missing [1](https://terebess.hu/zen/textindex.html) |
| 5 | 寶鏡三昧 | Jewel Mirror Samadhi | Dongshan Liangjie | T1986 | in corpus (Tier 1) |
| 6 | 五位 (君臣) | The Five Ranks | Dongshan Liangjie | needs_lookup (embedded in yulu) | missing as standalone |
| 7 | 心王銘 | Mind-King Inscription | Fu Xi / Fu Dashi (497–569) | needs_lookup | missing; 4 English versions at Terebess |
| 8 | 心銘 | Mind Inscription | Niutou Farong | needs_lookup | missing; 4 English versions at Terebess |
| 9 | 樂道歌 | Song of Enjoying the Way | Nanyue Mingzan (Lazy Zan) | needs_lookup | missing; Jeff Shore translation [1](https://terebess.hu/zen/textindex.html) |
| 10 | 二入四行論 | The Two Entries and Four Practices | Bodhidharma (attrib.) | T2009 | in corpus (excerpt_seed) |
| 11 | 牛頭隸主? (juezhu) | — | Niutou Farong | P.2885 | in corpus — witness_unavailable |
| 12 | 溈山警策 | Guishan's Admonitions | Guishan Lingyou (comp. c. 850) | needs_lookup | missing; Poceski chapter [1](https://terebess.hu/zen/textindex.html) |
| 13 | 師規制 | Teacher's Rules / Xuefeng's Code | Xuefeng Yicun, 901 | needs_lookup | missing; Poceski translation [1](https://terebess.hu/zen/textindex.html) |
| 14 | 坐禪儀 | Models for Sitting Meditation | Changlu Zongze | needs_lookup | missing; Bielefeldt + Cleary translations [1](https://terebess.hu/zen/textindex.html) |
| 15 | 坐禪儀 | Guidelines for Sitting Meditation | Foxin Bencai | needs_lookup | missing; Cleary translation |
| 16 | 默照銘 | The Verse of Silent Illumination | Hongzhi Zhengjue | (within T48n2001) | missing (named in manifest pairing) |
| 17 | 法界聖凡水陸大齋法輪寶懺 | — | — | X74n1499 [19](https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568) | missing (liturgical, boundary) |
| 18 | 無量壽經起信論 | — | — | X22n0400 [19](https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568) | missing (boundary, skip) |

### 3.8 Tier 3e — Monastic codes (qinggui) and practice manuals

| # | title_zh | English | author | status |
|---|---|---|---|---|
| 1 | 禪苑清規 | Rules of Purity for the Chan Monastery | Changlu Zongze, 1103 | in corpus (`qinggui_monastic_codes`, claims T2025); full annotated English by Yifa (Terebess PDF) [1](https://terebess.hu/zen/textindex.html) |
| 2 | 勅修百丈清規 | The Baizhang Zen Monastic Regulations (revised) | Dongyang Dehui (rev.) | missing; Ichimura translation PDF [1](https://terebess.hu/zen/textindex.html); Collcutt 1983 chapter |
| 3 | 永平清規 | Eihei Rules of Purity | Dōgen | Japanese; Leighton & Okumura SUNY 1995 [12](https://zmm.org/teachings-and-training/recommended-reading/) |
| 4 | 佛心本才坐禪儀 | Guidelines for Sitting Meditation | Foxin Bencai | (= §3.7 row 15) |
| 5 | 普勸坐禪儀 | Universal Recommendation for True Zazen (Fukan zazen gi) | Dōgen | in BDK *Zen Texts* 2006 [36](https://bookscouter.com/book/9781886439283-zen-texts-bdk-english-tripitaka) |
| 6 | 坐禪用心記 | Advice on the Practice of Zazen | Keizan Jōkin | 4 English versions at Terebess (Nearman, Hoshin & Dainen, Masunaga, Cleary) [1](https://terebess.hu/zen/textindex.html) |
| 7 | 法藏? (Treatise on Letting Zen Flourish to Protect the State) | Fazhan lun — author needs_lookup | Song-dynasty monk | in BDK *Zen Texts* 2006 [36](https://bookscouter.com/book/9781886439283-zen-texts-bdk-english-tripitaka) |

### 3.9 Tier 3f — Histories, biographies, boundary works

| # | title_zh | English | status |
|---|---|---|---|
| 1 | 歷代法寶記 | Record of the Dharma-Jewel through the Ages | in corpus (0/3 collated) |
| 2 | 寶林傳 | Chronicle of the Bejeweled Forest | missing (§3.4) |
| 3 | 祖堂集 | Patriarch's Hall Anthology (952) | missing — the *Zutang ji* is the source substrate of the Five Houses genealogy [10](https://open.library.ubc.ca/cIRcle/collections/ubccommunityandpartnerspublicati/52387/items/1.0438211) |
| 4 | 曹溪大師別傳 | Separate Biography of the Caoshi Master (Huineng) | in corpus (`caoxi_zhuan`, X1598) |
| 5 | 禪林僧寶傳 | Transmission of Monk's Treasures from the Chan Grove | missing (§3.4) |
| 6 | 寒山詩 / 拾得詩 | Hanshan and Shide poems | in corpus (`hanshan_poems`, witness_unavailable — Dunhuang/Chang Wu collection) |
| 7 | 日本洞上聯燈錄 | The Unbroken Lamp of Japanese Sōtō (1727) | Japanese; out of CBETA scope, frontier |
| 8 | 禪苑集英 (Thiền uyển tập anh) | Collection of Outstanding Figures of Zen (Vietnam, 1337) | Vietnamese-Chinese; English: Cuong Tu Nguyen *Zen in Medieval Vietnam* UH Press 1998 [1](https://terebess.hu/zen/textindex.html) |

### 3.10 CBETA scope note (measured, not asserted)

What this session verified from fetched pages: the corpus-relevant T47 ids 1983/1985/1986(b)/1987(A/B)/1988/1989/1990/1991/1992/1993/1996/1997/1998(A/B) and T48 ids 2001/2003/2006 [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu)[19](https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568); T51n2076 for Jingde [1](https://terebess.hu/zen/textindex.html); the X68 family (n1307, n1309, n1315, n1316, n1319) [1](https://terebess.hu/zen/textindex.html)[19](https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568); the X-series yulu scatter (X1223, X1224, X1303, X1315, X1321, X1323, X1333, X1357, X1445, X1451, X1556–X1565, X1598, X62/X70/X71/X72) from MASTER_REFERENCE + fetched scholarship. The *full* T47/T48/T51/X inventories (hundreds of entries) are the job of a dedicated CBETA crawl (§5 step 1), not a hand list.

**Session tally: 10 (Tier 1) + 7 (Tier 1 missing) + 13 (Tier 2) + 19 (denglu) + 20 (gong'an) + 27 (yulu) + 18 (treatises) + 7 (codes) + 8 (histories) = 134 works inventoried, of which 38 are already in the corpus.**

---

## §4 All English Books — Renowned Translations, Translators, Publishers

**Verification policy (task 049 rule):** `verified` = the ISBN/publisher/year was seen on a page
fetched or returned during this session (cited). `needs_lookup` = the work is real and sourced, but its
metadata was *not* re-verified in this session — the draft JSON carries `isbn_status: "needs_lookup"`.
No ISBN in this document or in `data/english_references.json` is asserted without one of those two
labels. Rights status is a first pass: `in_copyright` (living translator / post-1960), `public_domain_candidate`
(d. before 1966, i.e. Suzuki et al. — jurisdiction check still P4 human work), `needs_review` (default).

### 4.1 The great koan collections (book-level translations)

| title (English) | translator | publisher, year | ISBN | original / CBETA | rights |
|---|---|---|---|---|---|
| The Blue Cliff Record | J.C. Cleary & Thomas Cleary | Shambhala 2005 (Classics of Buddhism and Zen vol. 1) | **verified** 978-1-59030-232-3 (688 pp) [21](https://www.shambhala.com/the-blue-cliff-record-250.html) | Biyan lu T2003 | in_copyright (d. 2021) |
| The Blue Cliff Record (earlier ed.) | Thomas & J.C. Cleary | Shambhala 1977 | needs_lookup (ZMM lists 1977 [12](https://zmm.org/teachings-and-training/recommended-reading/)) | T2003 | in_copyright |
| The Blue Cliff Record | Thomas Cleary | BDK America 2006 | needs_lookup (978-0-962561-88-7 per MASTER_REFERENCE) | T2003 | in_copyright |
| The Blue-Cliff Record | David Hinton | Shambhala 2024 ("Great Koan Collections of Ch'an and Zen" series) | needs_lookup (978-1-64547-270-4 per MASTER_REFERENCE; Amazon listing confirmed in this session's search [22](https://www.amazon.com/Secrets-Blue-Cliff-Record-Explanations/dp/157062738X)) | T2003 | in_copyright |
| Secrets of the Blue Cliff Record: Zen Comments by Hakuin and Tenkei | Thomas Cleary | Shambhala 2001 | **verified** 978-1-57062-738-5 [22](https://www.amazon.com/Secrets-Blue-Cliff-Record-Explanations/dp/157062738X) | T2003 + Japanese commentary | in_copyright |
| The Blue Cliff Record | Katsuki Sekida | (in *Two Zen Classics*) | see below | T2003 | in_copyright |
| The Blue Cliff Record (excerpts, verses) | Joan Sutherland & John Tarrant | — | needs_lookup | T2003 | needs_review |
| The Blue Cliff Record: Zen Echoes | David Rothenberg | — | needs_lookup | T2003 | needs_review |
| Hekigan-roku (unpublished Teisho on all 100 cases) | Koun Yamada (trans.) | sanbo.zen (online) | needs_lookup | T2003 | needs_review [40](https://www.patheos.com/blogs/monkeymind/2017/07/meredith-garmons-koan-index.html) |
| The Book of Serenity: One Hundred Zen Dialogues | Thomas Cleary | Shambhala 2005 | **verified** 978-1-59030-249-1 (512 pp) [25](https://books.google.com/books/about/The_Book_of_Serenity.html?id=NN9OEAAAQBAJ); 1998 ed. per ZMM [12](https://zmm.org/teachings-and-training/recommended-reading/) | Congrong lu T2004 | in_copyright |
| The Book of Serenity / Equanimity | Joan Sutherland & John Tarrant | — | needs_lookup | T2004 | needs_review |
| Two Zen Classics: The Gateless Gate and the Blue Cliff Records | Katsuki Sekida | Shambhala 2005 | **verified** 978-1-59030-282-8 (416 pp) [32](https://citylights.com/taoism-buddhism/2-zen-classics/) | T2005 + T2003 | in_copyright |
| The Gateless Barrier: The Wu-Men Kuan (Mumonkan) | Robert Aitken | North Point 1990 | **verified** hc 978-0-86547-441-3 / pb 978-0-86547-442-0 (332 pp) [24](https://www.goldenlabbookshop.com/book/9780865474420) | Wumen guan T2005 | in_copyright (d. 2003) |
| Unlocking the Zen Koan: The Gateless Barrier | Thomas Cleary | Shambhala (1993) | needs_lookup | T2005 | in_copyright [23](https://blogs.sfzc.org/blog/2021-07-15/in-appreciation-of-thomas-cleary-a-personal-remembrance/) |
| The Gateless Barrier: Zen Comments on the Mumonkan | Zen Shibayama | Shambhala 2000 | needs_lookup | T2005 | in_copyright [12](https://zmm.org/teachings-and-training/recommended-reading/) |
| The Gateless Gate | Koun Yamada | Shambhala (1993) | needs_lookup | T2005 | in_copyright [1](https://terebess.hu/zen/textindex.html) |
| The Gateless Gate | Eiichi Shimomissa | Shambhala (1978) | needs_lookup | T2005 | in_copyright |
| The Gateless Gate | Nyogen Senzaki & Paul Reps | (in *Zen Flesh, Zen Bones*) | needs_lookup | T2005 | needs_review |
| The Barrier That Has No Gate | Seung Sahn (comments), compiled Paul Lynch | Terebess (online) | n/a | T2005 | needs_review [1](https://terebess.hu/zen/textindex.html) |
| The Gateless Gate: The Classic Book of Zen Koans | Senzaki & Reps | Counterpoint | needs_lookup | T2005 | needs_review |
| Zen Flesh, Zen Bones: A Collection of Zen and Pre-Zen Writings | Nyogen Senzaki & Paul Reps | Counterpoint (1956) | needs_lookup | anthology incl. T2005 | needs_review |
| Zen Training: Methods and Philosophy | Katsuki Sekida | Shambhala (1975/1995) | needs_lookup | practice | in_copyright |
| The Zen Koan: With An Introduction to Its Nature and Use | Isshu Miura & Ruth Fuller Sasaki | Harcourt 1966 | needs_lookup [12](https://zmm.org/teachings-and-training/recommended-reading/) | koan practice | needs_review |
| The Iron Flute ("Blowing the [Solid-Iron] Flute Upside-Down," 100 koans) | Nyogen Senzaki & Ruth Strout McCandless | (1962) | needs_lookup | Tetteki tōsui (Japanese) | public_domain_candidate |
| 101 Zen Stories (Shaseki shū) | transcribed Nyogen Senzaki & Paul Reps | (1956) | needs_lookup | Japanese | public_domain_candidate |
| The Warrior Koans (Shōnan kattōroku, 100) | Trevor Leggett | Terebess (online) | n/a | Japanese | needs_review [1](https://terebess.hu/zen/textindex.html) |
| The Storehouse of the True Dharma Eye (Zhengfa yanzang, 680 cases) | (no complete English translation found in this session) | — | — | X1309 | — |
| The Measuring Tap (Jijie lu) | Thomas Cleary | (online, Terebess PDF) | n/a | Jijie lu | in_copyright |
| Odes to a Classic Hundred Standards (Xuedou baize songgu) | Gregory Wonderwheel | Terebess (online) | n/a | pre-Biyan | needs_review |
| The Record of Empty Hall (Xutang ji, 100 koans) | Dōshō Port | (online) | needs_lookup | Xutang ji | needs_review [1](https://terebess.hu/zen/textindex.html) |

### 4.2 Recorded sayings (yulu) translations

| title (English) | translator | publisher, year | ISBN | original / CBETA | rights |
|---|---|---|---|---|---|
| The Zen Teachings of Master Lin-Chi | Burton Watson | Shambhala 1993 | **verified** 978-0-87773-891-6 (140 pp; 1999 ed. 112 pp) [30](https://www.amazon.com/Teachings-Master-Lin-Chi-Shambhala-Editions/dp/0877738912) | Linji yulu T1985 | in_copyright (d. 2008) |
| The Recorded Sayings of Ch'an Master Lin-chi Hui-chao of Chen Prefecture | Ruth Fuller Sasaki | Institute for Zen Studies, Kyoto 1975 | needs_lookup (original project edition) | T1985 | public_domain_candidate (d. 1998) |
| The Record of Linji (annotated, trilingual layout) | trans. Sasaki et al., ed. Thomas Yūhō Kirchner | University of Hawai'i Press 2009 | **verified** hc 978-0-8248-2821-9 / pb 978-0-8248-3319-0 (xxxii + 485 pp) [27](https://www.h-net.org/reviews/showrev.php?id=23133) | T1985 | in_copyright |
| The Recorded Sayings of Zen Master Joshu | James Green | Shambhala 1998 (Sacred Literature Series) | **verified** 978-1-57062-414-8 (180 pp); 2001 ed. **verified** 978-1-57062-870-2 (208 pp) [33](https://books.google.com/books/about/The_Recorded_Sayings_of_Zen_Master_Joshu.html?id=Vcc_PgAACAAJ) | Zhaozhou yulu X68n1315 | in_copyright |
| The Sayings of Joshu the Zen Master / Radical Zen | Yoel Hoffmann | (1990s) | needs_lookup | X68n1315 | in_copyright |
| The Zen Teaching of Huang-Po: On the Transmission of Mind | John Blofeld | Grove Press 1958 | **verified** 978-0-80215-092-9 (144 pp, 1994 printing) [31](https://us.amazon.com/Zen-Teaching-Huang-Po-Transmission/dp/0802150926) | Huangbo chuanxin T2012A | in_copyright (d. 1984 — but Grove edition; jurisdiction check) |
| Essentials of the Transmission of Mind (Huangbo) + 3 more texts | John R. McRae, Gishin Tokiwa, Yoshida Osamu, Steven Heine et al. (BDK) | BDK America 2005/2006 | **verified** 978-1-886439-28-3 (328 pp) [36](https://bookscouter.com/book/9781886439283-zen-texts-bdk-english-tripitaka) | T2012A + Fazhan lun + Fukan zazen gi + Zazen yojinki | in_copyright |
| The Record of Tung-shan (Dongshan) | William F. Powell | University of Hawai'i Press 1986 | needs_lookup (978-0-8248-0926-6 per MASTER_REFERENCE) [12](https://zmm.org/teachings-and-training/recommended-reading/) | Dongshan yulu T1986 | needs_review |
| Just This Is It: Dongshan and the Practice of Suchness | Taigen Dan Leighton | — | needs_lookup | T1986 | in_copyright |
| Master Yunmen: From the Record of the Chan Teacher "Gate of the Clouds" | Urs App | Kodansha International 1994 | needs_lookup [12](https://zmm.org/teachings-and-training/recommended-reading/) | Yunmen yulu T1988 | in_copyright |
| The Recorded Sayings of Chan Master Zhongfeng Mingben [bilingual] | Thomas Kirchner | Oxford University Press 2021 | **verified** 978-0-19-767297-6 [20](https://dokumen.pub/the-recorded-sayings-of-chan-master-zhongfeng-mingben-bilingualnbsped-0197672973-980197672976.html) | Zhongfeng yulu (Yuan) | in_copyright |
| A Man of Zen: The Recorded Sayings of Layman P'ang | Ruth Fuller Sasaki, Yoshitaka Iriya, Dana R. Fraser | Weatherhill 1992 | needs_lookup [12](https://zmm.org/teachings-and-training/recommended-reading/) | Layman Pang (Song) | public_domain_candidate |
| The Recorded Sayings of Mazu | — | **no complete English translation found in this session** (fragments only: *Infinite Mirror* [37](https://www.shambhala.com/zen-tang-dynasty/), *Zen Masters of China* [15](https://archive.org/details/zenmastersofchin0000unse)) | — | X1321 | — |
| The Transmission of the Mind Outside the Teaching (Guzunsu excerpts) | Lu Kuan Yü (Charles Luk) | Rider 1974 | needs_lookup [1](https://terebess.hu/zen/textindex.html) | Guzunsu yulu X68 | public_domain_candidate |
| Every End Exposed (Xutang, selected) | Yoel Hoffmann | (1995) | needs_lookup [1](https://terebess.hu/zen/textindex.html) | Xutang heshang yulu | in_copyright |

### 4.3 Short texts and treatises (the many-translations texts)

| original | English renderings found (translator → vehicle) |
|---|---|
| Xinxin Ming (信心銘, T2010) | **23 versions** on Terebess alone: Arthur Waley ("On Trust in the Heart"), R.H. Blyth, Richard B. Clarke, Dusan Pajin, **Burton Watson** ("Inscription on Trust in the Mind"), Shih Shen-Lung, Robert F. Olson, Hae Kwang, Zen Buddhist Order of Hsu Yun, Stanley Lombardo, Master Sheng-yen (with commentaries), Charles Luk, Philip Dunn & Peter Jourdan, Chung Tai Translation Committee, Gregory Wonderwheel, **D.T. Suzuki** (Manual of Zen + Essays in Zen), Osho (after Clarke), Hakuun Barnhard, John Balcom, Andy Ferguson, Eric Putkonen (interpretation), Yoshida Osamu (dBET Alpha: Three Chan Classics 1999, pp. 115–129) [1](https://terebess.hu/zen/textindex.html) |
| Zhengdao Ge (證道歌, T2014) | **7 versions**: D.T. Suzuki, Robert Aitken & Eido Shimano, Anzan Hoshin & Yasuda Joshu Dainen, Osho, Nyogen Senzaki & Ruth Stout McCandless ("Song of Realization"), John Balcom, Chang Chung-yuan [1](https://terebess.hu/zen/textindex.html) |
| Platform Sutra (六祖壇經, T2007/T2008) | Yampolsky 1967 (**verified** 978-0-231-08361-4, Columbia, Dunhuang text, 246 pp [26](https://books.google.com/books/about/The_Platform_Sutra_of_the_Sixth_Patriarc.html?id=bbAinrNvdlMC)); Red Pine 2006 (**verified** 978-1-58243-995-2 e / 978-1-59376-086-1 print, Counterpoint [28](https://www.vitalsource.com/products/the-platform-sutra-red-pine-v9781582439952)[29](https://encyclopediaofbuddhism.org/wiki/Red_Pine_(author))); John McRae 1999/2000 (BDK, needs_lookup 978-1-886439-99-0 per MASTER_REFERENCE); Wing-Tsit Chan 1963 (St. John's University Press, needs_lookup [34](https://www.amazon.com/Platform-Scripture-Basic-Classic-Buddhism/dp/B000JNP6P2)); Price & Wong Mou-lam 1990 (*The Diamond Sutra and the Sutra of Hui-neng*, Shambhala, needs_lookup [12](https://zmm.org/teachings-and-training/recommended-reading/)) |
| Sandokai (參同契) | **8 versions**: James Mitchell & Yulie Lou (3 renderings incl. *The Record of Shitou Xiqian*, *Song of the Grass Shack*), Daniel Leighton ("Song of the Grass-Roof Hermitage"), Gregory Wonderwheel, Sotoshu Shumucho, Hakuun Barnhard, **Thomas Cleary** ("Merging of Difference and Unity"), San Francisco Zen Center, Master Sheng-yen (commented) [1](https://terebess.hu/zen/textindex.html) |
| Baojing Sanmei (寶鏡三昧) | **7 versions**: William F. Powell (2: *Jewel Mirror Samadhi* + in *Record of Tung-shan*), Thomas Cleary, Sotoshu Shumucho, Charles Luk, Jiyu Kennett, Hakuun Barnhard, Master Sheng-yen (commented) [1](https://terebess.hu/zen/textindex.html) |
| The Five Ranks (五位) | **4 versions**: H. Dumoulin, Thomas Cleary, William F. Powell, Chang Chung-yuan [1](https://terebess.hu/zen/textindex.html) |
| Mind-King Inscription (心王銘, Fu Xi) | Jess Row; John C.H. Wu / D.T. Suzuki / Charles Luk / John Balcom (gathas) [1](https://terebess.hu/zen/textindex.html) |
| Mind Inscription (心銘, Niutou) | Jess Row; Henrik H. Sørensen; Sheng Yen; Chang Chung-yuan [1](https://terebess.hu/zen/textindex.html) |
| Song of Enjoying the Way (樂道歌, Lazy Zan) | Jeff Shore (poem only + with commentary, PDF) [1](https://terebess.hu/zen/textindex.html) |
| The Ten Ox-Herding Pictures (十牛圖頌) | indexed at Terebess "English versions index" (multiple: Shunryu Suzuki commentary, Red Pine, etc.) [1](https://terebess.hu/zen/textindex.html) |
| The Zen Teaching of Bodhidharma | Red Pine (North Point 1987, needs_lookup [12](https://zmm.org/teachings-and-training/recommended-reading/)); also in D.T. Suzuki *Zen Training* (needs_lookup) |
| Lankavatara Sutra | D.T. Suzuki & Dwight Goddard 1933 (in *A Buddhist Bible*; needs_lookup); Red Pine 2012 (Counterpoint, needs_lookup [29](https://encyclopediaofbuddhism.org/wiki/Red_Pine_(author))) |

### 4.4 Denglu / genealogies and biographies in English

| title (English) | translator | publisher, year | notes |
|---|---|---|---|
| Original Teachings of Ch'an Buddhism: Selected from the Transmission of the Lamp | Chang Chung-yuan | Random House (Pantheon) 1969 | Jingde selections [1](https://terebess.hu/zen/textindex.html)[12](https://zmm.org/teachings-and-training/recommended-reading/) |
| The Transmission of the Lamp: Early Masters | Sohaku Ogata | Longwood Academic 1990 | [1](https://terebess.hu/zen/textindex.html) |
| Records of the Transmission of the Lamp, vols. 1–8 (books 1–30) | Randolph S. Whitfield | Kindle 2015–2020 | the only complete English attempt at all 30 fascicles [1](https://terebess.hu/zen/textindex.html) |
| Zen's Chinese Heritage: The Masters and their Teachings (Wudeng excerpts) | Andy Ferguson | Wisdom 2000 | [1](https://terebess.hu/zen/textindex.html)[12](https://zmm.org/teachings-and-training/recommended-reading/) |
| The Records of the Transmission of the Lamp (Jingde), partial | — | NTI Reader (glossary/vocabulary tool) | [1](https://terebess.hu/zen/textindex.html) |
| Zen Masters of China: The First Step East (Tang narrative, ch. 9 = Mazu's heirs) | (author ed.) | (archive.org) | [15](https://archive.org/details/zenmastersofchin0000unse) |
| Robes Purple and Gold: Transmission of the Robe in the "Lidai fabao ji"; The Mystique of Transmission | Adam Yaeko McLaughlin | (SUNY 2011) | Terebess-hosted PDFs [1](https://terebess.hu/zen/textindex.html) |
| Biographies of the Chan Masters (Song gaoseng zhuan selection) | Thich Hang Dat | (online PDF) | [1](https://terebess.hu/zen/textindex.html) |
| Zen in Medieval Vietnam: A Study and Translation of Thiền uyển tập anh | Cuong Tu Nguyen | University of Hawai'i Press 1998 | [1](https://terebess.hu/zen/textindex.html) |
| Zen Conquests: Buddhist Transformations in Contemporary Vietnam | Alexander Soucy | University of Hawai'i Press 2022 | [1](https://terebess.hu/zen/textindex.html) |
| Tracing Back the Radiance: Chinul's Korean Way of Zen | Robert E. Buswell Jr. (ed.) | University of Hawai'i Press 1991 | [12](https://zmm.org/teachings-and-training/recommended-reading/) |
| Zen Monastic Experience | Robert E. Buswell Jr. | — | needs_lookup (MASTER_REFERENCE) |

### 4.5 Monastic rules and practice manuals in English

| title (English) | translator | publisher, year | notes |
|---|---|---|---|
| An Annotated Translation and Study of the Chanyuan qinggui | Yifa | Terebess (online PDF) | [1](https://terebess.hu/zen/textindex.html) |
| The Baizhang Zen Monastic Regulations | Shohei Ichimura | Terebess (online PDF) | [1](https://terebess.hu/zen/textindex.html) |
| "The Early Ch'an Monastic Rule" (chapter) | Martin Collcutt | in *Early Ch'an in China and Tibet* (Lai & Lancaster, 1983) | [1](https://terebess.hu/zen/textindex.html) |
| Guishan's Admonitions + "The Ethical Foundations of Chan Practice" | Mario Poceski | in *Zen Classics: Formative Texts in the History of Zen Buddhism* (Oxford UP 2006) | [1](https://terebess.hu/zen/textindex.html) |
| Xuefeng's Code | Mario Poceski | Terebess (online PDF) | [1](https://terebess.hu/zen/textindex.html) |
| Dogen's Manual of Zen Meditation (Fukan zazen gi + Zazen yojinki) | Carl Bielefeldt | University of California Press 1988 | [12](https://zmm.org/teachings-and-training/recommended-reading/) |
| Dogen's Pure Standards for the Zen Community (Eihei shingi) | Taigen Daniel Leighton & Shohaku Okumura | SUNY Press 1995 | [12](https://zmm.org/teachings-and-training/recommended-reading/) |
| Form of Zazen (Fukan zazen gi) | Shohaku Okumura | Terebess (online PDF) | [1](https://terebess.hu/zen/textindex.html) |
| Stopping and Seeing: A Comprehensive Course in Buddhist Meditation (Chih-i) | Thomas Cleary | Shambhala 1997 | Tiantai practice, boundary [12](https://zmm.org/teachings-and-training/recommended-reading/) |
| Advice on the Practice of Zazen (4 versions) | Hubert Nearman; Anzan Hoshin & Yasuda Dainen; Reiho Masunaga; Thomas Cleary | Terebess (online) | [1](https://terebess.hu/zen/textindex.html) |

### 4.6 Dōgen (the Japanese Sōtō front — in scope via the Caodong lineage)

Six-plus complete renderings of the *Shōbōgenzō* in English, plus a dozen chapter-level ones (MASTER_REFERENCE
+ this session's fetches): **Reiho Masunaga** *The Sōtō Approach to Zen* (1958) and *Shobogenzo Zuimonki*
(1971); **Jiyu Kennett** *Selling Water by the River* (1972); **Yokoi Yuho & Daizen Victoria** *Zen Master
Dōgen* (1975); **Norman Waddell & Masao Abe** (Eastern Buddhist journal); **Gudo Nishijima & Chodo Cross**
(*Master Dōgen's Shōbōgenzo* books 1–3, Windbell 1996–1998 [12](https://zmm.org/teachings-and-training/recommended-reading/)); **Shohaku Okumura**; **Kazuaki Tanahashi** (ed.) *Moon in a Dewdrop* (North Point 1995 [12](https://zmm.org/teachings-and-training/recommended-reading/)); **Thomas Cleary** *Shobogenzo: Zen Essays by Dōgen* (2007 [23](https://blogs.sfzc.org/blog/2021-07-15/in-appreciation-of-thomas-cleary-a-personal-remembrance/)); **Taigen Dan Leighton**; **Francis Dojun Cook** (*How to Raise an Ox* 1993, *Sounds of Valley Streams* 1988, *The Record of Transmitting the Light* 1991 [12](https://zmm.org/teachings-and-training/recommended-reading/)); **Steven Heine** *Dōgen and the Koan Tradition* (SUNY 1994 [12](https://zmm.org/teachings-and-training/recommended-reading/)). All needs_lookup except where a publisher/year came from ZMM.

### 4.7 Pioneer and scholarly literature

| author | role | key works (ISBN needs_lookup unless noted) | source |
|---|---|---|---|
| **D.T. Suzuki** (1870–1966) | pioneer translator (public-domain candidate) | *Manual of Zen Buddhism* — **verified** 978-0-80213-065-5 (Shambhala) [34](https://www.amazon.com/Manual-Zen-Buddhism-D-T-Suzuki/dp/0802130658); *Essays in Zen Buddhism* 1st series — **verified** 978-0-80215-118-6 (Shambhala) [35](https://www.amazon.com/Essays-Buddhism-First-D-T-Suzuki/dp/0802151183); 2nd series (Samuel Weiser 1970) & 3rd series (1976) per ZMM [12](https://zmm.org/teachings-and-training/recommended-reading/); *An Introduction to Zen Buddhism* (1956); *The Way of Zen* (1956); *The Zen Doctrine of No-Mind* (1949); *Zen and Japanese Culture* (Princeton, 1993 ed. per ZMM); *The Lankavatara Sutra* (with Goddard, 1933); *Mysticism: Christian and Buddhist* (1957); *The Awakening of Zen* (Shambhala Dragon) | [34](https://www.amazon.com/Manual-Zen-Buddhism-D-T-Suzuki/dp/0802130658)[35](https://www.amazon.com/Essays-Buddhism-First-D-T-Suzuki/dp/0802151183)[12](https://zmm.org/teachings-and-training/recommended-reading/) |
| **Thomas Cleary** (1949–2021) | most prolific — "translator of over seventy volumes of Buddhist, Taoist, Confucian, and Islamic texts" [21](https://www.shambhala.com/the-blue-cliff-record-250.html) | BCR (above), Book of Serenity (above), Secrets of BCR (above), Unlocking the Zen Koan, *Timeless Spring: A Sōtō Zen Anthology* (1990), *The Five Houses of Zen* (1990), *Infinite Mirror* (anthology of 18 Tang/Song masters [37](https://www.shambhala.com/zen-tang-dynasty/)), *Shobogenzo: Zen Essays by Dōgen* (2007), *Transmission of Light* (Keizan's Denkoroku, Shambhala 2002 [12](https://zmm.org/teachings-and-training/recommended-reading/)), *The Measuring Tap*, *Minding Mind*, *Zen Dawn* (with J.C. Cleary, BDK 1986 — early Dunhuang texts), plus the single-text versions in §4.3 [23](https://blogs.sfzc.org/blog/2021-07-15/in-appreciation-of-thomas-cleary-a-personal-remembrance/) |
| **J.C. (Christopher) Cleary** (1947–2023) | BCR co-translator; *Zen Dawn: Early Texts from Tun Huang* (BDK 1986) | [21](https://www.shambhala.com/the-blue-cliff-record-250.html) |
| **Burton Watson** (1925–2008) | Lin-Chi (verified above); *The Lotus Sutra* (Columbia 1993 [12](https://zmm.org/teachings-and-training/recommended-reading/)); Xinxin Ming (Terebess) |
| **Ruth Fuller Sasaki** (1911–1998) | Linji 1975 (original); *The Record of Linji* 2009 (verified above); *A Man of Zen* 1992; *The Zen Koan* 1966 (with Miura) |
| **John R. McRae** (1947–2011) | *The Northern School and the Formation of Early Ch'an Buddhism* (UH Press 1986/1987 [12](https://zmm.org/teachings-and-training/recommended-reading/)); *The Platform Sutra* (BDK 1999/2000, needs_lookup); BDK *Zen Texts* 2006 (verified above); "preeminent scholar of Chinese Buddhism… Chair of the Bukkyō Dendō Kyōkai Publication Committee" [36](https://bookscouter.com/book/9781886439283-zen-texts-bdk-english-tripitaka) |
| **Jeffrey Broughton** | Northern Chan scholarship (task starting point; ISBNs needs_lookup) | MASTER_REFERENCE / task 049 starting point |
| **Bernard Faure** | "Chan/Zen Studies in English: State of the Field; Bodhidharma anthology" (task starting point; ISBNs needs_lookup) | MASTER_REFERENCE / task 049 starting point |
| **Robert Buswell** | *Tracing Back the Radiance* (1991, ZMM); *Zen Monastic Experience* (1992, needs_lookup) |
| **Urs App** | *Master Yunmen* (Kodansha 1994, ZMM); *An Overview of the T'ang Dynasty Masters* [37](https://www.shambhala.com/zen-tang-dynasty/) |
| **Carl Bielefeldt** | Dōgen practice works (§4.5) |
| **Heine, Wright (eds.)** | *The Kōan: Texts and Contexts in Zen Buddhism* (2000; contains Ishii Shūdō / Albert Welter ch. 4 on the Zongmen tongyao ji) [1](https://terebess.hu/zen/textindex.html) |
| **Peter N. Gregory (ed.)** | *Traditions of Meditation in Chinese Buddhism* (Kuroda/UH Press 1986 [12](https://zmm.org/teachings-and-training/recommended-reading/)) |
| **Heinrich Dumoulin** | *Zen Buddhism: A History — India and China* (Prentice Hall 1994 [12](https://zmm.org/teachings-and-training/recommended-reading/)) |
| **Shunryu Suzuki** | *Zen Mind, Beginner's Mind* (Weatherhill 2001 [12](https://zmm.org/teachings-and-training/recommended-reading/)) |
| **Philip Kapleau** | *The Three Pillars of Zen* (Anchor 2000 [12](https://zmm.org/teachings-and-training/recommended-reading/)) |
| **Red Pine (Bill Porter)** | Platform (verified), Bodhidharma, Lankavatara 2012, Diamond 2001, Heart Sutra [29](https://encyclopediaofbuddhism.org/wiki/Red_Pine_(author)) |
| **Robert Aitken** | Gateless Barrier (verified); *Taking the Path of Zen* (modern practice, out of period scope) [24](https://www.goldenlabbookshop.com/book/9780865474420) |
| **Koun Yamada / Hakuin line** | Teisho on Hekiganroku (100 cases, online) [40](https://www.patheos.com/blogs/monkeymind/2017/07/meredith-garmons-koan-index.html) |
| **Sheng-yen** | *Faith in Mind* (Dharma Drum 1993); Xinxin Ming / Sandokai / Baojing commentaries (Terebess) |
| **Master Seung Sahn** | Mumonkan comments (Terebess); modern practice |

### 4.8 Publisher register (the English front's supply chain)

| publisher | role in the English Chan front |
|---|---|
| **Shambhala** (Boston) | the biggest single supplier: Classics of Buddhism and Zen series (BCR, Book of Serenity), Cleary's whole list, Sekida, Aitken, Yamada, Shimomissa, Hinton's koan series, Dōgen titles [21](https://www.shambhala.com/the-blue-cliff-record-250.html) |
| **BDK America / Numata Center** (Honolulu) | *BDK English Tripitaka* series — *Zen Texts* (verified above); McRae's Platform Sutra; *Classics of Buddhism and Zen* origins; J.C. Cleary *Zen Dawn* [36](https://bookscouter.com/book/9781886439283-zen-texts-bdk-english-tripitaka) |
| **Columbia University Press** | Yampolsky's Platform Sutra (verified); Yampolsky's *The Zen Master Hakuin* (1985, ZMM); Watson's *Lotus Sutra* (1993, ZMM) |
| **University of Hawai'i Press** | the academic anchor: Sasaki/Kirchner *Record of Linji* (verified); Powell *Record of Tung-shan*; Buswell; McRae; Gregory; Cuong Tu Nguyen; the Kuroda Institute *Studies in East Asian Buddhism* series [27](https://www.h-net.org/reviews/showrev.php?id=23133) |
| **Counterpoint** (Washington DC) | Senzaki & Reps *Zen Flesh, Zen Bones*; Red Pine's *Platform Sutra* (verified) |
| **North Point Press** (San Francisco) | Aitken *Gateless Barrier* (verified); Red Pine *Bodhidharma*; Tanahashi *Moon in a Dewdrop*; Waddell *The Unborn* (Bankei) |
| **Grove Press / Evergreen** | Blofeld *Huang-Po* (verified); Shunryu Suzuki *Zen Mind, Beginner's Mind* (original) |
| **Oxford University Press** | Kirchner's *Zhongfeng Mingben* bilingual (verified); Poceski chapter in *Zen Classics* |
| **Wisdom Publications** (Boston) | Ferguson *Zen's Chinese Heritage*; contemporary practice |
| **Tuttle** | Leighton & Yi Wu *Cultivating the Empty Field* (Hongzhi, 2000); Okumura & Leighton *The Wholehearted Way* (1997) [12](https://zmm.org/teachings-and-training/recommended-reading/) |
| **SUNY Press** | Leighton & Okumura *Eihei Shingi* (1995); Heine (1994); McLaughlin *Robes Purple and Gold* |
| **Weatherhill** | *A Man of Zen* (1992); *Zen Mind, Beginner's Mind* (2001) [12](https://zmm.org/teachings-and-training/recommended-reading/) |
| **Kodansha International** | Urs App *Master Yunmen* (1994) [12](https://zmm.org/teachings-and-training/recommended-reading/) |
| **Princeton University Press** | Suzuki *Zen and Japanese Culture*; *Buddhism in China* (Ch'en, 1974) [12](https://zmm.org/teachings-and-training/recommended-reading/) |
| **Terebess.hu** (Gábor Terebess, online) | **the largest free English Chan library**: 500+ indexed items across 10 categories — the crawl target of §5 step 1 [1](https://terebess.hu/zen/textindex.html) |
| **Zen Mountain Monastery (zmm.org)** | the reference practice curriculum — 9 stages of recommended reading, every entry a real book (fetched in full this session) [12](https://zmm.org/teachings-and-training/recommended-reading/) |

### 4.9 What Terebess has that we do not have English for (the gap front)

From the full index fetch (8 chunks) [1](https://terebess.hu/zen/textindex.html): Guzunsu yulu (20 master
records); Chanlin sengbao zhuan; Linjian lu; Chanyuan qinggui (Yifa full); Xutang yulu (Hoffmann excerpt
only); Zhiyue lu; Lidai fabao ji (Adamec excerpts + McLaughlin); Baolin zhuan; Zongmen tongyao ji;
Tiansheng/Jianzhong/Jiatai/Wudeng (Ferguson partial + Whitfield 8 vols in progress-as-of-2020);
Yongming Zongjing lu (100 fascicles — none found); 100+ short-text translations (Xinxin Ming ×23,
Zhengdao Ge ×7, Sandokai ×8, Baojing ×7, Five Ranks ×4, Ox-Herding index); the entire Japanese koan
front (Iron Flute, 101 Zen Stories, Warrior Koans, Entangling Vines, Shaseki); Korean Seon index;
Vietnamese thien (Cường Tử full translation); Tibetan Chan (Baotang Wuzhu, Moheyan, Gim Hwasang).
A full crawl of the index page would yield **500+ discrete English items** — this draft JSON
(`data/english_references.json`) records the **129 entries** the agent could attribute from this
session's searches and fetches (books, online editions, and multi-version index rows); the crawl
(§5 step 1) is what turns "500+ items" into verified rows.

**Session tally: 129 entries in `data/english_references.json`; 16 with verified ISBNs (seen on a
fetched page this session), 89 honestly `needs_lookup`, 24 `none` (online / uncollected works —
including the Mazu "no complete translation exists" flag).**

---

## §5 Roadmap to Overtake the English Front (draft — not working yet)

"Overtake" means: for every Chinese work we carry (and eventually every work in §3), we carry an English
layer that is *at least* as complete and as well-sourced as Terebess/ZMM/Shambhala/BDK/Columbia/Hawaii —
and for the works they carry that we don't (the §4.9 gap front), we carry them too. Five steps, in order,
none started:

1. **Inventory phase (P6 English crawl).** Crawl `terebess.hu/zen/textindex.html` (500+ items, 10
   categories — fetched in full this session, 8 chunks) plus zmm.org recommended reading (9 stages,
   fetched in full), Shambhala's Zen catalogue, BDK America/Numata catalogue, Columbia and UH Press
   Zen series. Extract per item: title_en, title_zh, author_master, translator, publisher, year, ISBN,
   pages, original CBETA id where identifiable, rights signal, URL. Output: a *verified*
   `data/english_references.json` (this PR's 82-entry draft is the schema + seed). This is read-only
   web work — no corpus touch, no rights decisions.
2. **Gap analysis.** Join the inventory against our 38 docs on `original_cbeta_id`: (a) English
   translations exist for our docs → link via `english_translations` in the work registry (§1);
   (b) English translations exist for Chinese works we don't have → candidate ingest queue (§3.4–3.9);
   (c) our docs with *no* English front at all → the AI-translation priority list (e.g. Mazu — §4.2
   shows **no complete English translation exists**; we could be first with a verified one).
3. **Rights manifest pass (P4, human work).** For every entry: public-domain candidate (Suzuki et al.,
   d. < 1966 — still needs jurisdiction check), in-copyright (Cleary d. 2021, Hinton 2024, etc.),
   needs-review (default). **Edition verification never implies rights approval** (architectural
   invariant 3); the 14 existing `rights_manifest.json` sources remain pending human review.
4. **AI translation plan (owner-gated).** For public-domain-or-permitted works, generate Robo-style AI
   translations into the existing slot system (1,252 slots: 177 verified, the rest reconstructions /
   AI drafts) — each with provenance, each explicitly badged, each verified-quotable against the
   *Chinese* witness we already pin. The plan must state what "verified slot" means for an AI
   translation (candidate: the English text must be showably generated from, and re-derivable from, the
   collated Chinese field — the inverse of today's Robo pipeline).
5. **Build `data/english_references.json` as a first-class bundle member** (today it is a draft on
   disk, not shipped): promote to the bundle with an owner-ratified schema change, wire the Reader's
   work dossiers to render "English editions" under each work, and wire the search box through
   `data/aliases.json` so "Joshu", "Blue Cliff", and "Hekiganroku" all resolve.

---

## §6 Master List for the Exhaustive Wiki + Database + Reference Manifest (future structure)

The target data model — one file per entity, all cross-referenced by id, all validated by
`scripts/validate_data.py` once ratified:

```
data/masters/            one JSON per master (~150-200 files when exhaustive)
  id, name_zh, name_pinyin, name_en_popular, name_en_formal, name_ja, name_ko, name_vi,
  aliases[], dates, era, house, role (master|compiler|both), lineage_depth, teacher_id,
  disciples[], works[], popular_work_names[], cbeta_refs[], summary, key_quotes[],
  profile_status, linked_corpus_keys[], profile_evidence
data/works/              one JSON per work (~150-200 files when exhaustive)
  id, title_zh, title_pinyin, title_en_popular, title_en_scholarly,
  authors[] (master ids — verse author + compiler supported), cbeta_id, taisho_vol,
  era, genre (yulu|denglu|gongan|qinggui|treatise|history),
  tier (enthusiast|scholarly|long-tail), units_total, units_represented,
  collation_state, zh_chars, aliases[], english_translations[] (english-reference ids),
  coverage_note, cbeta_note
data/english_references/ one JSON per English book (~650+ files when exhaustive)
  id, title_en, title_zh, author_zh, translator_en, publisher, year,
  isbn_10, isbn_13, isbn_status (verified|needs_lookup), pages,
  original_cbeta_id, tier, rights_status (in_copyright|public_domain_candidate|needs_review),
  url, notes, source_citation
data/aliases.json        popular → canonical for masters AND works (50-entry draft lands this PR)
data/lineage/masters.json  stays the enforced contract until the per-master split is ratified
```

Cross-reference invariants: every `work.authors[i]` resolves to a master id (or `needs_profile`);
every `english_reference.original_cbeta_id` resolves to a work or an *unclaimed* CBETA id (flagged);
every `master.works[i]` resolves to a work id; no popular_name maps to two canonical ids
(`data/aliases.json` must be a function).

The wiki front (when built) is the 5-room public scope plus a 6th "Reference" room *only* with owner
approval (invariant 5: public scope is exactly 5 rooms, smoke-guarded).

---

## §7 Next Steps — Enthusiast 100%

Definition: every Tier 1 work (§3.1) is fully collated to its claimed CBETA witness with no
unexplained field left behind, and every Tier 1 work has its verified English front linked
(§4). Task 050 and successors; **no auto-ingest** — each item below is its own gated task.

| order | item | witness | why |
|---|---|---|---|
| 1 | `zhaozhou_yulu_full` — the full Zhaozhou record (X68n1315 fascicle) | X68n1315 | the most-translated master in the English front has only 15 dialogues in our corpus; 12 BCR + 5 Wumen cases are his; also retires the corpus doc-id/name collisions noted in §9 |
| 2 | `mazu_yulu_full` | X1321 | the single most important Tang yulu with **no complete English translation in existence** (§4.2) — the one place we can lead the English front rather than follow it |
| 3 | `huangbo_chuanxin_full` | T2012A | Tier 1 missing; Blofeld + BDK give the pairing |
| 4 | `dongshan_yulu_full` | T1986 (T47n1986b) | Tier 1 missing; Powell 1986 gives the pairing |
| 5 | `yunmen_yulu_full` | T1988 | Tier 1 missing; Urs App 1994 gives the pairing |
| 6 | `dahui_letters_full` | T47n1998A/B + T48n2001 | the 0/6 `dahui_hongzhi` pairing becomes a real collation; Mozhaoming (默照銘) lands inside T48n2001 |
| 7 | Close the three Tier 1 partials: `wumenguan` (113/181), `biyanlu_cases` (353/395), `linji_yulu` (84/89) — every non-matching field either fixed, or explicitly labelled R-A/R-B with an owner note (the standing policy) | T2005 / T2003 / T1985 | "enthusiast 100%" = no unexplained partial |
| 8 | Complete the P2 dispatch already in flight (047/048: `baizhang_guanglu` 0/6, `huangbo_wanling` 0/7, `dazhu_huihai` 0/6, `nanquan_yulu` 0/6, plus the Tier 2 excerpt_seed set) | per manifest | already queued, not re-planned here |
| 9 | English-link pass: for each of the 10 Tier 1 works, attach the §4 verified editions via `english_translations` in the work registry | — | makes the Reader dossier show "English editions" |

Volume note: measured at ingest time, not estimated here (X68 fascicles run to several hundred
thousand CJK each; the Jingde benchmark in §9 is 1,274 units from a 30-fascicle lamp record).

## §8 Next Steps — Exhaustive 600–1400, 100%

Target, stated plainly: **150–200 masters, 150–200 works, ~5–10M CJK characters in corpus,
200–300 hours of focused collation work.** No auto-ingest: every ingestion is a discrete task with
the five gates, an evidence entry in `sessions/`, and a collation register row.

**The math (honest, not marketing):**
- Masters: 102 inventoried with sources this session (§2) → Guzunsu yulu (~20 Tang/Song masters,
  §3.6 line 26) + the denglu tail (the Jingde's 1,701 persons is the ceiling; we profile a curated
  150–200 of them, the rest stay as cited biography rows) [8](https://grokipedia.com/page/The_Jingde_Record_of_the_Transmission_of_the_Lamp).
- Works: 134 inventoried this session (§3) → 150–200 once the T47/T48/X crawl (§5 step 1) fills in
  the `needs_lookup` CBETA ids; the long-tail yulu cluster (§3.6) is the bulk.
- Volume: current corpus is 553,011 content CJK across 38 docs (§9). The Jingde (one work) contributes
  the largest share. 150+ yulu at a median of ~30–60k CJK each → ~5–9M, plus the five lamps' overlap
  adds the remainder. 5–10M CJK is the defensible planning figure.
- Hours: the Jingde's 1,274-unit collation (P1-2) is the unit-cost benchmark — roughly a week of
  focused agent work per 1.5–2.5M CJK once field extraction is template-stable. 5–10M CJK → 200–300h.
  This is a *plan estimate*, to be trued up after the first two full yulu ingests land.

**Phase order (nothing started here):**
1. **P0/P1 — DONE** (38 docs, 4 fully collated, 630 flagged, P2 dispatched).
2. **P2 — dispatched** (047/048 Tier 2 yulu per §7 line 8).
3. **P3 — enthusiast 100%** (§7).
4. **P4 — rights manifest, human work** (§5 step 3; 14 sources pending human review).
5. **P5 — English reference catalog** (§5 steps 1–2; verified `english_references.json`).
6. **P6 — exhaustive ingestion** (the 150–200 master/work target, §2.6 + §3 tail), each tranche its
   own task: Tang yulu cluster first (Mazu, Zhaozhou, Huangbo, Dongshan, Yunmen, then the Guzunsu
   tail), then the Song yulu cluster (Hongzhi's 400+ juan T48n2001 as its own multi-task project —
   it is the largest single Song corpus [18](https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu)), then the
   denglu set (Tiansheng → Wudeng), then treatises/codes, then the East-Asian frontier (Korea/
   Japan/Vietnam as separate, explicitly-labelled tranches).

## §9 Verification — Current State, Measured (before this roadmap was written)

Branch: `arena/01a0c15f-translatechan` @ `83f1cbd` (= `origin/main`). Five-gate baseline, all green,
run before any file touched by this task (the "after" run is recorded verbatim in the sibling report
`sessions/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md`):

```
$ python -m py_compile scripts/*.py scripts/smoke_test.mjs   (mjs: node --check)
→ all compiled, no errors
$ python scripts/validate_data.py
✅ DATA VALIDATION PASSED
corpus=38 | slots=1252 | verified=177 | matrix=21
locators=1606/1606
W1: collated=4 | partial/failed=32 | unavailable=2 | flagged=630
evidence=2026-09-20 → sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json
$ python scripts/build_data_bundle.py
✅ Successfully compiled 38 corpus documents → data_bundle/app_data.js (4,851,526 bytes)
$ python scripts/test_source_preservation.py
0 unauthorized changes
✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e…
$ python scripts/test_source_review_rules.py
145 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK
$ node scripts/smoke_test.mjs
✅ SMOKE TEST PASSED
$ git diff --exit-code data_bundle … docs mirror …
→ clean (mirror in sync)
```

**Corpus state (from `data/corpus_manifest.json` + `data/project_metrics.json`, measured):**

- 38 docs; 553,011 content CJK (583,291 all CJK); 1,252 slots (177 verified).
- Fully collated to claimed witness (4): `congronglu` T2004 (500/500), `chuandenglu_full` T2076
  (2,549/2,549), `caoshan_benji` T47n1987A (169/169), `zhengdao_ge` T2014 (6/6).
- Partial (32 docs): worst Tier 1 — `wumenguan` 113/181, `biyanlu_cases` 353/395, `linji_yulu`
  84/89, `xinxin_ming` 24/37. 630 slots flagged overall; 2 docs witness-unavailable
  (`niutou_juezhu` P.2885, `hanshan_poems`).
- **Known manifest anomalies (must be fixed at ingest, not ignored):**
  1. `zhaozhou_yulu` claims X68n1315 (Guzunsu yulu) — the *prior* T1987 claim was retracted as
     FALSE (T1987 = Caoshan); X68n1315 is plausible but the fascicle-level pin is unverified.
  2. `foyan_qingyuan` and `nanquan_yulu` **both claim X1315** — at most one is right; the full
     Guzunsu yulu's master set (§3.6 line 26) is the arbiter.
  3. `deshan_yulu` claims T2076 f.15 / X1565 f.7 — plausible (Deshan is in both lamps) but
     unverified at unit level.
  4. `title_zh` is blank in **every** manifest row — the §1 registry work populates it.
  5. Corpus ids use *posthumous temple names* (`zhaozhou` = 趙州) while `data/lineage/masters.json`
     uses *names* (`zhaozhou_congshen` = 趙州從諗) — the same split this roadmap's naming convention
     (§1) formalizes. The academic register (SEPP: Hershock, *Chan Buddhism* [7](https://plato.stanford.edu/entries/buddhism-chan/))
     and the popular register (e.g. the Baidu Baike 景德傳燈錄 article [11](https://baike.baidu.com/item/景德傳燈錄))
     both carry the dual-name habit — the registry is the only fix.

**Branch discrepancy (recorded per task 049 §8):** the channel prompt names a target branch
`docs/all-encompassing-roadmap`; `STATE.md` pins all work to the session branch
`arena/01a0c15f-translatechan`, and the working-branch constraint supersedes the prompt. Work was
done, and will be committed, on `arena/01a0c15f-translatechan`; the PR targets `main`.

**Deviations from the prompt, recorded:** (a) the prompt asks for a `docs/` copy of the roadmap "for
visibility"; `docs/` is generated output (rebuilt bundle + mirror), so no hand-written copy is made —
the canonical single file is `.orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md` and it is visible
on `main` via GitHub. (b) `data/aliases.json` + `data/english_references.json` are *drafts* on disk
(schema + seed data), not yet bundle members; they will mirror into `docs/data/` after the rebuild —
an expected, intentional PR diff, everything else byte-identical.

---

## Sources (numbered; inline `[n](url)` cites in §1–§9 use these numbers)

1. Gábor Terebess, **Terebess.hu — Zen text index** (full 8-chunk fetch, 2026-09-21): the master
   index of online Chinese/Japanese/Korean/Vietnamese Chan texts and their English translations —
   source for §2.2–2.6, §3.4–3.9, §4.3–4.5, §4.9. <https://terebess.hu/zen/textindex.html>
2. **Tricycle — Buddhism: Meditation & Schools (lineage transmission)** — the five-houses
   systematization (Guiyang/Linji/Caodong/Yunmen/Fayan; three absorbed into Linji).
   <https://tricycle.org/buddhism-meditation-schools/#lineage-transmission>
3. **Wikipedia — Chan Buddhism** — five-house order, Hongzhi/Dahui contrast (silent illumination
   vs. kanguo), house dates (Caoshan 840–901, Fenyang 947–1024, Zifu, Guiyang merger).
   <https://en.wikipedia.org/wiki/Chan_Buddhism>
4. **Wikipedia — Hongzhou school** — Mazu's successors (Xitang Zhicang, Baizhang, Nanquan),
   dharma heirs (Fenzhou Wuye 761–823, Guizong Zhichang, Xingshan Weikuan 755–817, Zhangjing
   Huaihui 756–815, Danxia Tianran 739–824), Zutang ji as first anecdote source.
   <https://en.wikipedia.org/wiki/Hongzhou_school>
5. **Wikipedia — Yunmen Wenyan** — dates 862/864–949, Hongzhou→Linji lineage.
   <https://en.wikipedia.org/wiki/Yunmen_Wenyan>
6. **Worldwide Zen Center — Master list** — dates (Caoshan 840–901, Fenyang Shanzhao 947–1024,
   Muzhou Daoming ca. 780–877, Wansong Xingxiu 1166–1246, Tianhuang Daowu 748–807).
   <https://wwzc.org/master-list-masters/>
7. Peter Hershock, **"Chan Buddhism", Stanford Encyclopedia of Philosophy** — academic register
   for the five houses / five-lamps; dual-name register note in §9.
   <https://plato.stanford.edu/entries/buddhism-chan/>
8. **Grokipedia — The Jingde Record of the Transmission of the Lamp** — 1004, 30 juan, 1,701
   masters, 52 generations, 951 with full records; Daoyuan Fayan.
   <https://grokipedia.com/page/The_Jingde_Record_of_the_Transmission_of_the_Lamp>
9. **CText.org DataWiki — Jingde Chuandeng lu** — CBETA cross-reference.
   <https://ctext.org/datawiki.pl?if=en&res=970171>
10. **UBC open.library (Yang Yi / 1760 ed. study)** — the 974–1020 official edition history and the
    Zutang ji genealogical substrate. <https://open.library.ubc.ca/cIRcle/collections/ubccommunityandpartnerspublicati/52387/items/1.0438211>
11. **Baidu Baike — 景德傳燈錄** — the popular-register entry (Chinese).
    <https://baike.baidu.com/item/景德傳燈錄>
12. **Zen Mountain Monastery — Recommended Reading** (full fetch, Stages I–VIII+): the practice-
    world reference shelf — publishers/years for §4.1–4.8 (Powell 1986, Cleary, Leighton,
    Nishijima & Cross, Green 2000, Shibayama 2000, App 1994, Buswell 1991, McRae 1987, Dumoulin,
    Heine 1994, Suzuki). <https://zmm.org/teachings-and-training/recommended-reading/>
13. **Ferguson lineage chart (Scribd, Andy Ferguson, *Zen's Chinese Heritage*)** — East-Asian
    transmission frontier (Dōgen via Tiantong Rujing, Eisai, Cao Tang Vietnam, Keizan, Muju).
    <https://www.scribd.com/doc/251590366/Ferguson-Lineage-Chart-of-the-Zen-Ancestors-in-China>
14. **Sangha Kommune — Chan Master Ma-tzu (Mazu Daoyi)** — "88 close disciples, 139 dharma heirs".
    <https://thesanghakommune.org/2014-12-07/chan-master-ma-zu-dao-yi-%E9%A9%AC%E7%A5%66%E9%81%93%E4%B8%80/>
15. **archive.org — *Zen Masters of China* (ch. 9: Mazu's heirs)** — Yanguan Qian, Panshan Baoji
    735–824, Shigong Huicang, Damei Fachang 752–839, Hanshan, Shide.
    <https://archive.org/details/zenmastersofchin0000unse>
16. **rgm.hu — Zen master database (id 178)** — Song-era dates (Yuanwu Keqin 1063–1135, Hongzhi
    1091–1157, Dahui 1089–1163, Touzi Yiqing 1032–1083, Danxia Zichun 1064–1117, Qingliao
    1088–1151). <http://www.rgm.hu/index.php?mid=178>
17. **The Zen Site — "The Bright Field of Spirit" (Hongzhi Zhengjue essay)** — Tiantong 1129,
    Furong Daokai revival, Danxia Zichun teacher line.
    <http://www.thezensite.com/ZenEssays/HistoricalZen/Bright_Field_of_Spirit_Hongzhi.html>
18. **"Poetics of Silence: Hongzhi Zhengjue (1091–1157) and the Practice of Poetry in Song Dynasty
    Chan Yulu" (academia.edu, 2023)** — the CBETA T47/T48 id table: T47n1985 Linji, T47n1986b
    Dongshan, T47n1987b Caoshan, T47n1992 Fenyang Wude, T47n1993 Huanglong, T47n1996 (Mingjue —
    id conflict noted in §3.6), T47n1997 Yuanwu, T47n1998 Dahui, T48n2001 Hongzhi, T48n2003 Biyan,
    ZZ73n1451 Cishou, T50n2059 Tang gaoseng zhuan, T50n2053 Song gaoseng zhuan.
    <https://www.academia.edu/41075850/Poetics_of_Silence_Hongzhi_Zhengjue_1091-1157_and_the_Practice_of_Poetry_in_Song_Dynasty_Chan_Yulu>
19. **Kramerius (Austria National Library) — digitized Chan text scan** — X68n1319 Yuxuan yulu,
    T47n1997 Yuanwu Foguo yulu, X71n1419 Yuansou Xingduan, X72n1431 Yunwai Yunxiu, X62n1173 Xigui
    Zhizhi. <https://kramerius.lib.cas.cz/search/nimg/IMG_FULL/uuid:c377ee68-d1c4-4d5c-94e0-2f5dc2ae9568>
20. **dokumen.pub — *The Recorded Sayings of Chan Master Zhongfeng Mingben*, bilingual ed.**
    (Kirchner, OUP 2021) — ISBN 978-0-19-767297-6; Yuan yulu list (Tianru Weize 1403, Gaofeng
    Yuanmiao X70). <https://dokumen.pub/the-recorded-sayings-of-chan-master-zhongfeng-mingben-bilingualnbsped-0197672973-980197672976.html>
21. **Shambhala — *The Blue Cliff Record* product page** — ISBN 978-1-59030-232-3, 2005, 688 pp;
    Thomas Cleary "translator of over seventy volumes…"; Cleary's Shambhala catalogue (Five Houses,
    Unlocking the Zen Koan, Timeless Spring, Infinite Mirror, Shobogenzo: Zen Essays).
    <https://www.shambhala.com/the-blue-cliff-record-250.html>
22. **Amazon — *Secrets of the Blue Cliff Record* (Thomas Cleary, Shambhala 2001)** — ISBN
    978-1-57062-738-5. <https://www.amazon.com/Secrets-Blue-Cliff-Record-Explanations/dp/157062738X>
23. **San Francisco Zen Center blog — "In Appreciation of Thomas Cleary: A Personal Remembrance"
    (2021-07-15)** — Cleary 1949–2021; catalogue confirmation (Unlocking the Zen Koan, Shobogenzo:
    Zen Essays by Dōgen). <https://blogs.sfzc.org/blog/2021-07-15/in-appreciation-of-thomas-cleary-a-personal-remembrance/>
24. **Golden Lab Bookshop — *The Gateless Barrier* (Robert Aitken, North Point 1990)** — ISBN
    978-0-86547-441-3 hc / 978-0-86547-442-0 pb, 332 pp.
    <https://www.goldenlabbookshop.com/book/9780865474420>
25. **Google Books — *The Book of Serenity: One Hundred Zen Dialogues* (Thomas Cleary, Shambhala
    2005)** — ISBN 978-1-59030-249-1, 512 pp.
    <https://books.google.com/books/about/The_Book_of_Serenity.html?id=NN9EEAAAQBAJ>
26. **Google Books — *The Platform Sutra of the Sixth Patriarch* (Philip B. Yampolsky, Columbia UP
    1967)** — ISBN 978-0-231-08361-4, 246 pp, Dunhuang text.
    <https://books.google.com/books/about/The_Platform_Sutra_of_the_Sixth_Patriarc.html?id=bbAinrNvdlMC>
27. **H-Net review — *The Record of Linji* (Ruth Fuller Sasaki tr., Thomas Yūhō Kirchner ed., UH
    Press 2009)** — ISBN 978-0-8248-2821-9 hc / 978-0-8248-3319-0 pb, xxxii + 485 pp; the trilingual
    (English/Chinese/Japanese) annotation method. <https://www.h-net.org/reviews/showrev.php?id=23133>
28. **VitalSource — *The Platform Sutra* (Red Pine, Counterpoint)** — e-book ISBN 978-1-58243-995-2.
    <https://www.vitalsource.com/products/the-platform-sutra-red-pine-v9781582439952>
29. **Encyclopedia of Buddhism — "Red Pine (author)"** — Red Pine's translation list (Platform
    2006/2018 Wilder Prize, Lankavatara 2012, Diamond 2001, Heart Sutra).
    <https://encyclopediaofbuddhism.org/wiki/Red_Pine_(author)>
30. **Amazon — *The Zen Teachings of Master Lin-Chi* (Burton Watson, Shambhala)** — ISBN
    978-0-87773-891-6 (1993, 140 pp; 1999 ed. 112 pp).
    <https://www.amazon.com/Teachings-Master-Lin-Chi-Shambhala-Editions/dp/0877738912>
31. **Amazon — *The Zen Teaching of Huang-Po: On the Transmission of Mind* (John Blofeld, Grove
    Press)** — ISBN 978-0-80215-092-9 (144 pp, 1994 printing of the 1958 text).
    <https://us.amazon.com/Zen-Teaching-Huang-Po-Transmission/dp/0802150929>
32. **City Lights — *Two Zen Classics: The Gateless Gate and the Blue Cliff Records* (Katsuki
    Sekida, Shambhala 2005)** — ISBN 978-1-59030-282-8, 416 pp.
    <https://citylights.com/taoism-buddhism/2-zen-classics/>
33. **Google Books — *The Recorded Sayings of Zen Master Joshu* (James Green, Shambhala)** — ISBN
    978-1-57062-414-8 (1998, 180 pp) and 978-1-57062-870-2 (2001, 208 pp); "12 of the 100 Blue Cliff
    cases and 5 of the 48 Gateless Gate cases are Zhaozhou".
    <https://books.google.com/books/about/The_Recorded_Sayings_of_Zen_Master_Joshu.html?id=Vcc_PgAACAAJ>
34. **Amazon — *Manual of Zen Buddhism* (D.T. Suzuki, Shambhala)** — ISBN 978-0-80213-065-5.
    <https://www.amazon.com/Manual-Zen-Buddhism-D-T-Suzuki/dp/0802130658>
35. **Amazon — *Essays in Zen Buddhism, First Series* (D.T. Suzuki, Shambhala)** — ISBN
    978-0-80215-118-6. <https://www.amazon.com/Essays-Buddhism-First-D-T-Suzuki/dp/0802151183>
36. **Bookscouter — *Zen Texts* (BDK English Tripitaka, BDK America 2005/2006)** — ISBN
    978-1-886439-28-3, 328 pp; McRae/Tokiwa/Yoshida/Heine credits; McRae "Chair of the Bukkyō
    Dendō Kyōkai Publication Committee".
    <https://bookscouter.com/book/9781886439283-zen-texts-bdk-english-tripitaka>
37. **Shambhala — "Zen: Tang Dynasty" anthology page (*Infinite Mirror* contributors)** — Mazu,
    Hadhi, Linji, Yangshan, Fayan, Fenyang, Xuedou, Huanglong, Yangqi, Wuzu, Yuanwu, Foyan, Dahui,
    Hongzhi, Ying-an, Mi-an, Xiatang, Yuansou; Urs App overview.
    <https://www.shambhala.com/zen-tang-dynasty/>
38. **eScholarship — Mingjue chanshi yulu (明覺禪師語錄) citation** — T 47, no. 1996, 712c28–713a2
    (the id that conflicts with MASTER_REFERENCE's T47n1996 = Yangqi Fanghui; flagged in §3.6).
    <https://escholarship.org/content/qt8n07675j/qt8n07675j_noSplash_7d5925b89b24bb270d22d7c23e9408d2.pdf>
39. **E. Greenway — koan index** — the English koan-collection count table (BCR 100, BOS 100, DSE
    95, GB 48, IF 100, OM 60, REH 100, RID 415, SAM 100, SOH 148, ENT 272, Flock of Fools 98).
    <https://www.egreenway.com/buddhism/koans.htm>
40. **Patheos/Monkey Mind — Meredith Garmon's koan index (2017-07)** — Yamada Teisho on all 100
    Hekigan cases (sanbo.zen), case-by-case English coverage audit.
    <https://www.patheos.com/blogs/monkeymind/2017/07/meredith-garmons-koan-index.html>

*Compiled 2026-09-21 on `arena/01a0c15f-translatechan` from 19 web searches, 2 full page fetches
(Terebess index, 8 chunks; ZMM reading list, 2 chunks), and 8 ISBN-verification fetches. All 40
sources fetched or returned during the session; no source is cited from memory alone.*
