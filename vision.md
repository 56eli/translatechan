# 🤖 Fake Chan Factory: Vision & Architectural Blueprint

> **Document type**: *aspirational architecture with a current public-scope note*. For **measured current status**, see [`AUDIT.md`](./AUDIT.md); for phase tracking, see [`ROADMAP.md`](./ROADMAP.md); for operational flow, see [`HANDOFF.md`](./HANDOFF.md). The public Pages interface is deliberately limited to Reader, Matrix, Lineage, Gong'an Index, and Lexicon; it does not expose browser drafting, Arena-agent branding, or a header GitHub link.

> 🤖 **Brand note (2026-08-09).** The public app is branded **Fake Chan Factory**: the English renderings are *Robo channelings* — AI text written in a famous translator's register, clearly badged and not citable as that translator's work. Genuine public-domain/verified quotations are badged **✅ Real text (verified)** and keep their real attribution. This document describes the *architecture and scholarly infrastructure* (canonical sources, lineage graph, locators, provenance) that the Factory runs on — that infrastructure is real whether a given rendering is Robo or verified.

> *"A special transmission outside the scriptures,  
> Not founded upon words and letters;  
> Pointing directly to the human mind,  
> Seeing into one's nature and attaining Buddhahood."*  
> — Bodhidharma (attributed)

---

## 1. Executive Summary & Mission

**Fake Chan Factory** (`translatechan`) is a dedicated comparative and computational repository and platform designed to locate, source, digitize, categorize, compare, and generate *Robo* renderings of the complete classical corpus of Chinese Chan (Zen) Masters of old (*唐宋諸祖語錄與傳燈公案文獻*). The Classical Chinese sources are canonical and real; the English renderings are openly AI-generated "fakes" in each translator's register (clearly badged), except where a genuine verified quotation is held.

Centuries of profound dialogues, encounter dialogues (*機緣問答*), recorded sayings (*語錄*), transmission of the lamp records (*傳燈錄*), monastic rules of purity (*清規*), and classic gong'an/koan collections (*公案*) form one of the richest spiritual and philosophical traditions in human history. Yet much of this vast literature remains untranslated, scattered across disparate volumes of the Taishō Tripiṭaka (*大正新脩大藏經*) and CBETA (*中華電子佛典協會*), or locked in isolated translations that often diverge radically in terminology, interpretation, and nuance.

### The Core Objectives of Fake Chan Factory:
1. **Exhaustive Canonical Ingestion**: Systematically index and ingest the classical Chinese Chan literature preserved in CBETA / Taishō (principally Volumes 47, 48, and 51, alongside the *Zokuzōkyō* / 卍續藏經), establishing authoritative, verified Classical Chinese source texts with modern punctuation and paragraph segmentation.
2. **Comprehensive Lineage & Genre Taxonomy**: Build a multi-dimensional knowledge graph that links masters, disciples, monasteries, eras, genres, and gong'an cross-references from the legendary First Patriarch Bodhidharma (*達摩*) through the Six Patriarchs, the "Five Houses and Seven Schools" (*五家七宗*), and the Song/Yuan transmission zen masters.
3. **Multi-Translator Comparative Analysis**: Provide a sentence-aligned, side-by-side comparative matrix contrasting historical translations (e.g., Red Pine / Bill Porter, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, John Blofeld, R.H. Blyth, Steven Heine, Christoph Anderl) against one another and the original source.
4. **Source Verification & Disclosure Workflow**: Combine classical Chinese philology, technical glossaries, and clearly disclosed project/AI drafts with primary-source locators, book/edition references, page-or-section states, rights records, and hover/focus/touch citation details.
5. **Zero-Backend Public Research Reader**: Deliver an ultra-fast, responsive GitHub Pages application for source-aware side-by-side reading, comparison, lineage exploration, gong'an indexing, and lexicon study.

---

## 2. Corpus Scope & Canonical Taxonomy

The Fake Chan Factory corpus is systematically structured around the standard historical Chinese Buddhist canons, cross-referenced with CBETA identifiers and historical lineage records.

```
                                  ┌──────────────────────────────────────────────┐
                                  │           Fake Chan Factory Master Corpus        │
                                  └──────────────────────┬───────────────────────┘
                                                         │
         ┌───────────────────────┬───────────────────────┼───────────────────────┬───────────────────────┐
         ▼                       ▼                       ▼                       ▼                       ▼
   ┌───────────┐           ┌───────────┐           ┌───────────┐           ┌───────────┐           ┌───────────┐
   │  語 錄    │           │  公 案    │           │  傳 燈    │           │  清 規    │           │  心 銘    │
   │ Discourse │           │   Koan    │           │Transmiss'n│           │ Monastic  │           │Inscript'ns│
   │  Records  │           │Collection │           │  Lamps    │           │   Rules   │           │ & Verses  │
   └─────┬─────┘           └─────┬─────┘           └─────┬─────┘           └─────┬─────┘           └─────┬─────┘
         │                       │                       │                       │                       │
   • Linji Yulu            • Wumenguan             • Jingde Chuandeng      • Baizhang Qinggui      • Xinxin Ming
   • Zhaozhou Yulu         • Biyanlu               • Tiansheng Guangdeng   • Chanyuan Qinggui      • Sandokai
   • Huangbo Chuanxin      • Congronglu            • Wudeng Huiyuan        • Chiting Qinggui       • Baojing Sanmei
   • Dongshan Yulu         • Xuetang Yulu          • Jiatai Pudeng         • Ruzhong Riyong        • Zhengdao Ge
```

### 2.1 Canonical Volume Breakdown

| CBETA / Taishō Canon | Category | Key Classical Works Included | Focus & Structure |
| :--- | :--- | :--- | :--- |
| **Taishō Vol. 48 (T1985–T2025)** | **Discourse & Gong'an (諸宗部五)** | *Wumenguan* (無門關 T2005), *Biyanlu* (碧巖錄 T2003), *Congronglu* (從容錄 T2004), *Linji Yulu* (臨濟語錄 T1985), *Platform Sutra* (六祖壇經 T2007/T2008), *Huangbo Chuanxin Fayao* (傳心法要 T2012A) | Foundational recorded sayings, classic encounter dialogues, case pointers (*垂示*), main cases (*本則*), verses (*頌*), and commentary (*評唱*). |
| **Taishō Vol. 47 (T1957–T1984)** | **Sectarian & Recorded Sayings (諸宗部四)** | *Zhaozhou Yulu* (趙州語錄), *Dongshan Liangjie Yulu* (洞山良价語錄 T1986), *Caoshan Benji Yulu* (曹山本寂語錄 T1987), *Yunmen Yulu* (雲門語錄 T1988), *Xuanling Yulu* (玄沙語錄) | Detailed monastics discourse records, sermons (*上堂*), evening instructions (*晚參*), and question-and-answer encounters. |
| **Taishō Vol. 51 (T2075–T2089)** | **Histories & Transmission Records (史傳部三)** | *Jingde Chuandenglu* (景德傳燈錄 T2076, 30 fascicles), *Tiansheng Guangdenglu* (天聖廣燈錄), *Wudeng Huiyuan* (五燈會元, X1565) | The complete genealogy of Chan transmission from the Seven Buddhas of Antiquity and Indian Patriarchs through the Chinese lineage generations. |
| **Taishō Vol. 48 (T2021–T2025)** | **Monastic Codes & Rules of Purity (清規部)** | *Baizhang Qinggui* (敕修百丈清規 T2025), *Chanyuan Qinggui* (禪苑清規, X1245) | Chan monastic guidelines, daily life routines, communal work (*普請* / "A day without work is a day without food"), ritual protocols. |
| **Early Tang & Dunhuang Manuscripts** | **Early Lineage Texts (敦煌文獻)** | *Erru Sixing Lun* (二入四行論 / Bodhidharma's Two Entrances and Four Practices), *Juezhu Lun* (絕觀論 / Niutou Farong), *Lidai Fabao Ji* (歷代法寶記) | Proto-Chan texts, earliest direct records predating Song-dynasty editorial redactions. |

---

## 3. The Lineage Knowledge Graph

Fake Chan Factory models the Chan tradition not merely as static text files, but as a dynamic **Lineage Knowledge Graph** connecting masters, dharma heirs, geographical temples, historical eras, and classic dialogue partners.

```
                            [Bodhidharma 菩提達摩] (d. ~532)
                                       │
                              [Huike 二祖慧可] (487–593)
                                       │
                             [Sengcan 三祖僧璨] (d. 606)  ──► [Xinxin Ming 信心銘]
                                       │
                             [Daoxin 四祖道信] (580–651)
                                       │
                             [Hongren 五祖弘忍] (601–674)
                                       │
                   ┌───────────────────┴───────────────────┐
                   ▼                                       ▼
        [Shenxiu 北宗神秀] (606–706)              [Huineng 六祖慧能] (638–713) ──► [Platform Sutra 壇經]
        (Northern School: Gradual)              (Southern School: Sudden)
                                                           │
                                ┌──────────────────────────┴──────────────────────────┐
                                ▼                                                     ▼
                     [Nanyang Huizhong 南陽慧忠]                               [Nanyue Huairang 南嶽懷讓] (677–744)
                                                                                      │
                                                                           [Mazu Daoyi 馬祖道一] (709–788)
                                                                           ("Ordinary Mind is the Way")
                                                                                      │
                                                                           [Baizhang Huaihai 百丈懷海] (720–814)
                                                                                      │
                                            ┌─────────────────────────────────────────┴──────────────────────────┐
                                            ▼                                                                    ▼
                                [Huangbo Xiyun 黃檗希運] (d. 850)                                       [Guishan Lingyou 溈山靈祐]
                                            │                                                                    │
                                 [Linji Yixuan 臨濟義玄] (d. 866)                                     [Yangshan Huiji 仰山慧寂]
                                            │                                                                    │
                                    ┌───────┴───────┐                                                            ▼
                                    ▼               ▼                                                    【 溈仰宗 GUIYANG 】
                           【 臨濟宗 LINJI 】  [Xinghua Cunjiang]
                                    │
                                    ▼
                          [Fenyang Shanzhao 汾陽善昭]
                                    │
                           [Shishuang Chuyuan 石霜楚圓]
                                    │
                   ┌────────────────┴────────────────┐
                   ▼                                 ▼
         【 楊岐派 YANGQI 】                【 黃龍派 HUANGLONG 】
       [Yangqi Fanghui 楊岐方會]           [Huanglong Huinan 黃龍慧南]
                   │
         [Wuzu Fayan 五祖法演]
                   │
                   ├─────────────────────────────────┐
                   ▼                                 ▼
       [Yuanwu Keqin 圓悟克勤]              [Foyan Qingyuan 佛眼清遠]
         (Compiler: Biyanlu 碧巖錄)
                   │
         [Dahui Zonggao 大慧宗杲]
           (Kanhua Chan 看話禪)
```

### The Five Houses of Chan (五家七宗) Taxonomy

1. **Linji School (臨濟宗)**: Founded by Linji Yixuan (*臨濟義玄*). Hallmark: Dynamic shouting (*喝*), stick-strikes (*棒*), Four Processes of Subject and Object (*四料簡*), Host and Guest (*主賓*), and vigorous kanhua koan examination.
2. **Caodong School (曹洞宗)**: Founded by Dongshan Liangjie (*洞山良价*) and Caoshan Benji (*曹山本寂*). Hallmark: Five Ranks (*五位*), Silent Illumination (*默照禪*), Jewel Mirror Samadhi (*寶鏡三昧*), subtle dialectics of real and apparent.
3. **Yunmen School (雲門宗)**: Founded by Yunmen Wenyan (*雲門文偃*). Hallmark: One-word barriers (*一字關*), Three Phrases of Yunmen (*雲門三句*), direct piercing brevity.
4. **Guiyang School (溈仰宗)**: Founded by Guishan Lingyou (*溈山靈祐*) and Yangshan Huiji (*仰山慧寂*). Hallmark: Circular symbols (*圓相*), harmonious master-disciple interaction, esoteric gestures.
5. **Fayan School (法眼宗)**: Founded by Fayan Wenyi (*法眼文益*). Hallmark: Mind-only integration (*唯心*), Six Characteristics of Dharma (*六相*), synthesizing Huayan metaphysics with Chan realization.

---

## 4. The Multi-Translator Comparative Architecture

One of the central innovations of Fake Chan Factory is its **Multi-Translator Sentence-Aligned Comparative Matrix**.

A single Gong'an or Yulu passage often carries multiple distinct translations in English, each reflecting a different translator's philosophical stance, poetic register, or understanding of classical Buddhist idioms. In the live **Fake Chan Factory** app these comparative registers are presented as **🤖 Robo** channelings (AI text in the scholar's style, *not* their published words); only a genuinely verified quotation keeps the real name and the **✅ Real text (verified)** badge. The table below illustrates the *comparative concept*.

### Comparative Matrix Example: Wumenguan Case 1 (Zhaozhou's Dog / 趙州狗子)

```
[ Classical Source ] 趙州和尚因僧問：「狗子還有佛性也無？」州云：「無。」
[ Pinyin / Reading ] Zhàozhōu héshang yīn sēng wèn: "Gǒuzi hái yǒu fúxìng yě wú?" Zhōu yún: "Wú."
```

| Translator | Translation Register | Rendered Text | Commentary & Nuance |
| :--- | :--- | :--- | :--- |
| **Thomas Cleary** (*No Barrier*, 1993) | Precise, philosophical, minimalist | *"A monk asked Master Zhaozhou, 'Does a dog have Buddha-nature?' Zhaozhou said, 'No.'"* | Renders *無* directly as "No", preserving the categorical negation while letting the subsequent commentary unfold the non-dual context. |
| **Ruth Fuller Sasaki** (*Record of Linji*, glossary ref.) | Scholarly, historical Japanese Rinzai lineage | *"A monk asked Master Jōshū, 'Does even a dog have the Buddha-nature, or not?' Jōshū said, 'Mu!'"* | Preserves the phonetic *Mu* (*無*) as an untranslated mantric/koan dynamic syllable rather than a mere logical negative. |
| **R.H. Blyth** (*Zen and Zen Classics*, Vol. 4) | Literary, poetic, existential | *"A monk asked Jōshū, 'Has a dog the Buddha Nature?' Jōshū answered, 'Mu!'"* | Focuses on the instantaneous punch of the encounter dialogue; draws parallels with Western poetry and mysticism. |
| **John Blofeld** (*Zen Teaching of Huang Po / Zen*) | Classical British Buddhist scholarship | *"A monk asked Zhaozhou: 'Has a dog Buddha-nature or not?' The Master replied: 'None!'"* | Emphasizes the emptiness (*śūnyatā*) aspect of *wu*. |
| **Steven Heine** (*Like Cats and Dogs*, 2014) | Critical hermeneutic, contextual | *"A monk asked Master Zhaozhou, 'Does a dog also have Buddha-nature, or not?' Zhaozhou replied, 'Wu.'"* | Explores the duality between the *Wu* answer and the alternative *You* (*有* / "Yes") version recorded in the *Zhaozhou Yulu*. |
| **Project AI draft** | Clearly labeled literal / contextual / poetic draft | *Displayed only with an AI-draft badge, no claimed book quotation, and a disclosure popup.* | AI output never impersonates a scholar or verified edition. |
| **Citation disclosure** | Source-aware public reading | *Canonical locator, book/edition, page-or-section state, verification, and rights record.* | Hover, focus, or touch reveals the full structured provenance. |

---

## 5. Editorial Verification & AI Disclosure Workflow

Fake Chan Factory treats AI assistance as an **editorial provenance category**, not a public persona or autonomous authority. The public site does not expose an Arena-agent view. Any project-generated wording must remain visibly categorized as `AI draft` or `register reconstruction`, while source text and verified quotations receive their own structured records.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                  Source Verification & Disclosure Flow                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [ Canonical source / edition ] → [ Locator + segmentation ] → [ Reader / Matrix ]    │
│                                      │                         │                      │
│                                      ▼                         ▼                      │
│                         [ Source / book verification ]   [ Visible disclosure ]        │
│                         • canonical location             • translator + status         │
│                         • edition + page/section         • rights identifier           │
│                         • exact-locator status           • hover/focus/touch detail    │
│                                      │                                                │
│                                      ▼                                                │
│                         [ Clearly labeled project / AI draft ]                         │
│                         • never a scholar quotation                                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Editorial rules
1. **Primary-source fidelity**: each displayed Chinese passage must carry a canonical locator or an explicit pending state.
2. **Book verification**: each verified modern translation must carry translator, work, edition, and page/section reference; pending pagination is surfaced rather than invented.
3. **AI disclosure**: project/AI wording is displayed only with an explicit status and no fabricated bibliographic citation.
4. **Lineage verification**: every rendered teacher→disciple link is represented in the lineage verification registry and visually distinguishes verified, disputed, traditional-pending, and frontier states.

---

## 6. Technical Architecture (Zero-Backend GitHub Pages)

The Fake Chan Factory web application is architected to run **100% client-side on GitHub Pages** with zero backend server dependencies, ensuring maximum longevity, speed, offline accessibility, and portability.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               Fake Chan Factory Client-Side Web App                        │
│                                  (Hosted on GitHub Pages)                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │ 📖 Bilingual Reader  │  │ ⚖️ Comparison Matrix │  │ 🌳 Interactive Lineage Graph │  │
│  │  • source locations  │  │  • book/page status  │  │  • status-aware links        │  │
│  │  • term + cite popup │  │  • AI disclosure     │  │  • chart-source details      │  │
│  │  • Pinyin & Hanzi    │  │  • rights records    │  │  • master dossiers           │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────────────┘  │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │ 🗂️ Gong'an Index     │  │ 📚 Classical Lexicon │  │ 🔍 Fast Full-Text Search     │  │
│  │  • collection/theme  │  │  • Chan/Buddhist Dict│  │  • Classical Chinese search  │  │
│  │  • canonical refs    │  │  • Sanskrit roots    │  │  • English search            │  │
│  │  • cross-references  │  │  • Occurrence count  │  │  • filter by source text     │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                    Embedded Data Store (JSON + provenance registries)                 │
│  • Corpus • locators • translation rights • lineage verification • Gong'an • Lexicon   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Technical Features:
1. **Zero-Dependency Static Bundle**: Fully self-contained HTML/CSS/JavaScript with responsive, accessible UI, dark/light Zen aesthetics, and typography optimized for Classical Chinese (FangSong, KaiTi, Noto Serif CJK) and English reading.
2. **Interactive Classical Chinese Lexicon**: Hovering over any term in the original text (e.g. *本來面目*, *祖師西來意*, *棒喝*, *頓悟*, *轉語*, *四料簡*) reveals the definition, Sanskrit origin where applicable, and contextual cross-references.
3. **Lineage Tree Visualizer**: Dynamic, interactive graphical tree of Chan transmission from Bodhidharma to the modern era, allowing users to filter texts and encounter dialogues by master and school.
4. **Citation & Disclosure Layer**: Every public source/translation surface exposes canonical location or explicit pending state, translator/work/edition/reference state, AI status, rights identifier, and hover/focus/touch details.
5. **Client-Side Full-Text Search**: Instant search across Classical Chinese and English translation values with highlighting, accurate match-unit accounting, and reader jump actions.

---

## 7. Comprehensive Multi-Phase Roadmap

### Phase 1: Foundation, Architecture & Vision (Current)
- [x] Establish project vision, canonical taxonomy, and architecture specification (`vision.md`).
- [x] Create comprehensive project roadmap (`ROADMAP.md`).
- [x] Structure repository directories: `data/corpus/`, `data/lineage/`, `data/translations/`, `data/glossary/`, `data/gongan/`, `src/`, `scripts/`.
- [x] Construct foundational classical Chan dictionary & terminology database (`data/glossary/chan_terms.json`).
- [x] Construct complete Master Lineage Graph data (`data/lineage/masters.json`).
- [x] Ingest foundational canonical texts with sentence-aligned segmentations:
  - *Wumenguan* (無門關 / The Gateless Gate, T2005)
  - *Linji Yulu* (臨濟語錄 / Record of Linji, T1985)
  - *Huangbo Chuanxin Fayao* (黃檗傳心法要 / Essentials of Mind Transmission, T2012A)
  - *Zhaozhou Yulu* (趙州語錄 / Recorded Sayings of Zhaozhou)
  - *Xinxin Ming* (信心銘 / Inscription on Faith in Mind)
  - *Baojing Sanmei* (寶鏡三昧 / Jewel Mirror Samadhi)
  - *Biyanlu* Cases (碧巖錄 / Blue Cliff Record, T2003)
- [x] Collate comparative multi-translator datasets (Cleary, Sasaki, Suzuki, Blyth, Blofeld, AI drafts).
- [x] Build and launch the focused GitHub Pages public reader with full client-side search, source/citation disclosure, lineage explorer, comparison matrix, gong'an index, and lexicon lookup.

### Phase 2: Ingestion Pipeline & CBETA Automation
- [ ] Implement automated Python/Node scrapers for CBETA XML/P5 format to extract Chan volumes (Taishō 47, 48, 51; Zokuzōkyō).
- [ ] Automatic punctuation normalization, stanza detection, and dialogue speaker attribution.
- [ ] Expand canonical text coverage to all 48 cases of *Wumenguan*, all 100 cases of *Biyanlu*, and all 100 cases of *Congronglu* (從容錄).
- [ ] Ingest *Jingde Chuandenglu* (景德傳燈錄) 30 fascicles with automated master-index cross-linking.

### Phase 3: Advanced Comparative Matrix & Scholarly Notes
- [ ] Ingest additional modern and academic translations (Anderl, Welter, Heine, McRae, Foulk, Kirchner).
- [ ] Add variant apparatus (*異文校勘*) noting textual differences between Dunhuang manuscripts, Song woodblocks, and Ming/Taishō editions.
- [ ] Interlinear commentary toggle: view Yuanwu's comments (*圓悟評唱*), Wumen's warnings (*無門關評*), and Dahui's letters side-by-side.

### Phase 4: Source Verification, Disclosure & Editorial Review
- [~] Complete exact canonical locators for every non-case seed unit (page/line or TEI anchors).
- [~] Complete exact book-page/episode references and human rights review for every verified modern translation.
- [x] Render AI drafts/reconstructions only with explicit disclosure, never as scholar quotations.
- [x] Provide source/translation/lineage citation details by hover, focus, and touch in public Pages surfaces.

### Phase 5: Phonetics, Middle Chinese & Multilingual Global Canon
- [ ] Audio chanting / pronunciation guide in Middle Chinese (*中古漢語*) reconstructions, Mandarin Pinyin, and Sino-Japanese readings (*Kanbun*).
- [ ] Expand rigorously verified multilingual translations and citation records.

### Phase 6: Community Ecosystem & Living Canon
- [ ] Community translation review and consensus voting on difficult classical passages (*難解字句*).
- [ ] Integration with universal Buddhist research databases (CBETA, SAT Daizōkyō, DDB / Digital Dictionary of Buddhism).
- [ ] Standalone offline PWA (Progressive Web App) deployment for offline monastery and retreat research.

---

## 8. Principles of Classical Chan Translation

Translating Classical Chinese Chan literature requires balancing three essential dimensions:

1. **Philological Rigor (*信 / Faithfulness*)**:  
   Respecting the unique Tang and Song vernacular Chinese (*唐宋白話/俗語*) idioms, colloquial particles (如 *底*, *甚麼*, *這箇*, *阿誰*, *沒交涉*), and technical monastic expressions without obscuring them behind generic Western theological language.
2. **Contextual Directness (*達 / Expressiveness*)**:  
   Preserving the abrupt, unmediated thrust of encounter dialogues (*機鋒*). Chan dialogues are not abstract philosophical treaties—they are lived existential encounters, shouting (*喝*), silence (*良久*), holding up a fly-whisk (*豎起拂子*), and direct pointing (*直指*).
3. **Transparent Comparison (*雅與照 / Comparative Clarity*)**:  
   No single translation is absolute. By laying historical translations side-by-side with original characters, readers and practitioners can perceive the multi-faceted nature of the Dharma without being trapped in any single translator's preconceptions.

---

*Fake Chan Factory is open-source, non-sectarian, and dedicated to the perpetual preservation and illumination of the wisdom of the ancient Chan masters.*
