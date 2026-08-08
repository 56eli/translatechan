# 🪷 TranslateChan: Vision & Architectural Blueprint

> **Document type**: *aspirational architecture* — this is the long-range blueprint. For **measured current status**, see [`AUDIT.md`](./AUDIT.md); for phase tracking, see [`ROADMAP.md`](./ROADMAP.md); for operational flow, see [`HANDOFF.md`](./HANDOFF.md).

> *"A special transmission outside the scriptures,  
> Not founded upon words and letters;  
> Pointing directly to the human mind,  
> Seeing into one's nature and attaining Buddhahood."*  
> — Bodhidharma (attributed)

---

## 1. Executive Summary & Mission

**TranslateChan** (`translatechan`) is a dedicated scholarly, comparative, and computational repository and platform designed to locate, source, digitize, categorize, compare, and translate the complete classical corpus of Chinese Chan (Zen) Masters of old (*唐宋諸祖語錄與傳燈公案文獻*).

Centuries of profound dialogues, encounter dialogues (*機緣問答*), recorded sayings (*語錄*), transmission of the lamp records (*傳燈錄*), monastic rules of purity (*清規*), and classic gong'an/koan collections (*公案*) form one of the richest spiritual and philosophical traditions in human history. Yet much of this vast literature remains untranslated, scattered across disparate volumes of the Taishō Tripiṭaka (*大正新脩大藏經*) and CBETA (*中華電子佛典協會*), or locked in isolated translations that often diverge radically in terminology, interpretation, and nuance.

### The Core Objectives of TranslateChan:
1. **Exhaustive Canonical Ingestion**: Systematically index and ingest the classical Chinese Chan literature preserved in CBETA / Taishō (principally Volumes 47, 48, and 51, alongside the *Zokuzōkyō* / 卍續藏經), establishing authoritative, verified Classical Chinese source texts with modern punctuation and paragraph segmentation.
2. **Comprehensive Lineage & Genre Taxonomy**: Build a multi-dimensional knowledge graph that links masters, disciples, monasteries, eras, genres, and gong'an cross-references from the legendary First Patriarch Bodhidharma (*達摩*) through the Six Patriarchs, the "Five Houses and Seven Schools" (*五家七宗*), and the Song/Yuan transmission zen masters.
3. **Multi-Translator Comparative Analysis**: Provide a sentence-aligned, side-by-side comparative matrix contrasting historical translations (e.g., Red Pine / Bill Porter, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, John Blofeld, R.H. Blyth, Steven Heine, Christoph Anderl) against one another and the original source.
4. **Hybrid Translation Pipeline**: Combine classical Chinese philology, Buddhist/Chan technical glossaries, automated AI-assisted multi-variant draft synthesis, and an interactive personal translation studio.
5. **Zero-Backend GitHub Pages Platform**: Deliver an ultra-fast, responsive, client-side web application directly hosted on GitHub Pages for personal study, research, side-by-side reading, translation note-taking, and offline exploration.

---

## 2. Corpus Scope & Canonical Taxonomy

The TranslateChan corpus is systematically structured around the standard historical Chinese Buddhist canons, cross-referenced with CBETA identifiers and historical lineage records.

```
                                  ┌──────────────────────────────────────────────┐
                                  │           TranslateChan Master Corpus        │
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

TranslateChan models the Chan tradition not merely as static text files, but as a dynamic **Lineage Knowledge Graph** connecting masters, dharma heirs, geographical temples, historical eras, and classic dialogue partners.

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

One of the central innovations of TranslateChan is its **Multi-Translator Sentence-Aligned Comparative Matrix**.

A single Gong'an or Yulu passage often carries multiple distinct translations in English, each reflecting a different translator's philosophical stance, poetic register, or understanding of classical Buddhist idioms.

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
| **AI Multi-Draft Engine** | Hybrid contextual / literal / poetic | **Draft A (Literal)**: *"Monk asked Zhaozhou: 'Does a dog still possess Buddha-nature or not?' Zhou said: 'Not.'"*<br>**Draft B (Philosophical)**: *"A monk inquired of Master Zhaozhou, 'Does even a humble dog possess the Buddha-nature?' Zhaozhou declared: 'Emptiness / Non-being.'"* | Multi-tier AI generation with Classical Chinese syntax breakdown and term mappings. |
| **Personal Translation Studio** | User customizable | *Editable workspace with custom footnotes, term overrides, and personal notes.* | Saved directly to browser local storage and exportable to clean JSON/Markdown for Git commit. |

---

## 5. The Arena AI Agent Sandboxed Translation Architecture

A foundational pillar of TranslateChan is that **all AI translations and canonical ingestion are produced by sandboxed, sessioned Arena AI agents**, working in synergy with contemporary scholarly editions and Git version control.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         Arena AI Agent Sandboxed Translation Flow                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [ CBETA Canonical XML / Taishō Source ]                                              │
│                     │                                                                  │
│                     ▼                                                                  │
│   ┌──────────────────────────────────────────────────────────┐                         │
│   │           Sandboxed Arena AI Agent Session               │                         │
│   ├──────────────────────────────────────────────────────────┤                         │
│   │  1. Classical Philology: Sentence Tokenization & Pinyin  │                         │
│   │  2. Master Terminology Lookup (Lexicon & Sanskrit roots) │                         │
│   │  3. Multi-Register Generation (Literal, Hermeneutic,     │                         │
│   │     Poetic Zen Cadence)                                  │                         │
│   │  4. Alignment of Contemporary Published Translations     │                         │
│   │     (Red Pine, Cleary, Sasaki, Suzuki, Blyth, Blofeld)   │                         │
│   │  5. Verification & Schema Formatting (data/corpus/*.json)│                         │
│   └──────────────────────────┬───────────────────────────────┘                         │
│                              │                                                         │
│                              ▼                                                         │
│                 [ Git Commit & Automated Push ]                                        │
│                              │                                                         │
│                              ▼                                                         │
│         [ Static GitHub Pages Web App & Research Studio ]                              │
│              (Zero-Backend Client-Side Execution)                                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Roles of the Arena AI Agent in TranslateChan:
1. **Philological Analysis & Sentence Alignment**: Parsing unpunctuated or complex classical Buddhist Chinese (*文言文/唐宋白話*), segmenting encounter dialogues into speaker units, and providing standard Hanyu Pinyin and Middle Chinese phonetics.
2. **Multi-Register Draft Generation**: Producing distinct translation registers to capture the multi-dimensional nature of the Dharma:
   - *Literal / Philological*: Strict syntactic fidelity preserving particles (底, 甚麼, 這箇, 阿誰).
   - *Philosophical / Hermeneutic*: Deep ontological unfolding of Mind-Only, Emptiness, and dialectics.
   - *Poetic / Zen Cadence*: Abrupt, sharp, living cadence matching the original encounter encounters.
3. **Collation of Contemporary Translations**: Aligning published translations (Red Pine, Thomas Cleary, Ruth Fuller Sasaki, D.T. Suzuki, R.H. Blyth, John Blofeld, Steven Heine, Philip Yampolsky) segment-by-segment with critical notes.
4. **Autonomous Git Integration**: Committing structured JSON datasets to the repository on branch `arena/019fe05c-translatechan`, updating data bundles, and deploying directly to static GitHub Pages.

---

## 6. Technical Architecture (Zero-Backend GitHub Pages)

The TranslateChan web application is architected to run **100% client-side on GitHub Pages** with zero backend server dependencies, ensuring maximum longevity, speed, offline accessibility, and portability.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               TranslateChan Client-Side Web App                        │
│                                  (Hosted on GitHub Pages)                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │ 📖 Bilingual Reader  │  │ ⚖️ Comparison Matrix │  │ 🌳 Interactive Lineage Graph │  │
│  │  • Sentence alignment│  │  • Side-by-side view │  │  • 6 Patriarchs & 5 Houses   │  │
│  │  • Hover term lookup │  │  • Historical transl.│  │  • Master biographies        │  │
│  │  • Pinyin & Hanzi    │  │  • AI multi-drafts   │  │  • Master-disciple links     │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────────────┘  │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │ ✍️ Translation Studio│  │ 📚 Classical Lexicon │  │ 🔍 Fast Full-Text Search     │  │
│  │  • Personal editor   │  │  • Chan/Buddhist Dict│  │  • Classical Chinese search  │  │
│  │  • Diff & notes      │  │  • Sanskrit roots    │  │  • English search            │  │
│  │  • JSON/MD export    │  │  • Occurrence count  │  │  • Filter by Master/Dynasty  │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                          Embedded Data Store (JSON / LocalStorage)                     │
│  • Corpus Index (T47/T48/T51) • Masters & Lineage Tree • Gong'an Cross-Index • Lexicon │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Technical Features:
1. **Zero-Dependency Static Bundle**: Fully self-contained HTML/CSS/JavaScript with responsive, accessible UI, dark/light Zen aesthetics, and typography optimized for Classical Chinese (FangSong, KaiTi, Noto Serif CJK) and English reading.
2. **Interactive Classical Chinese Lexicon**: Hovering over any term in the original text (e.g. *本來面目*, *祖師西來意*, *棒喝*, *頓悟*, *轉語*, *四料簡*) reveals the definition, Sanskrit origin where applicable, and contextual cross-references.
3. **Lineage Tree Visualizer**: Dynamic, interactive graphical tree of Chan transmission from Bodhidharma to the modern era, allowing users to filter texts and encounter dialogues by master and school.
4. **Personal Translation & Workspace Studio**: Users can draft their own translations for any sentence or case, compare them with Cleary/Sasaki/Suzuki/AI, take study notes, and export their research directly to JSON or Markdown.
5. **Client-Side Full-Text Search**: Instant search across both Classical Chinese and multiple English translation versions with highlighting and filter chips (by Dynasty, School, Master, or Genre).

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
- [x] Build and launch interactive, GitHub Pages-ready Web Application with full client-side search, lineage explorer, comparison matrix, lexicon lookup, and personal translation studio.

### Phase 2: Ingestion Pipeline & CBETA Automation
- [ ] Implement automated Python/Node scrapers for CBETA XML/P5 format to extract Chan volumes (Taishō 47, 48, 51; Zokuzōkyō).
- [ ] Automatic punctuation normalization, stanza detection, and dialogue speaker attribution.
- [ ] Expand canonical text coverage to all 48 cases of *Wumenguan*, all 100 cases of *Biyanlu*, and all 100 cases of *Congronglu* (從容錄).
- [ ] Ingest *Jingde Chuandenglu* (景德傳燈錄) 30 fascicles with automated master-index cross-linking.

### Phase 3: Advanced Comparative Matrix & Scholarly Notes
- [ ] Ingest additional modern and academic translations (Anderl, Welter, Heine, McRae, Foulk, Kirchner).
- [ ] Add variant apparatus (*異文校勘*) noting textual differences between Dunhuang manuscripts, Song woodblocks, and Ming/Taishō editions.
- [ ] Interlinear commentary toggle: view Yuanwu's comments (*圓悟評唱*), Wumen's warnings (*無門關評*), and Dahui's letters side-by-side.

### Phase 4: AI-Assisted Translation Studio & Prompt Engineering
- [ ] Build automated prompt templates for LLMs (Claude, GPT-4, DeepSeek, Qwen) specialized in Classical Chinese Chan hermeneutics.
- [ ] Provide multi-temperature generation modes:
  - Mode 1: *Literal & Philological* (syntax-preserving, interlinear).
  - Mode 2: *Philosophical & Contextual* (unfolding Buddhist technical terms).
  - Mode 3: *Poetic & Zen Idiomatic* (capturing the brisk, enigmatic cadence of Chan masters).
- [ ] Automated consistency checking against the TranslateChan Master Lexicon.

### Phase 5: Personal Study Notebook & Sync
- [ ] Local storage persistence with IndexedDB for extensive personal translation projects.
- [ ] One-click export of translation work as structured Git PRs, academic Markdown papers, or LaTeX formatted dual-language editions.
- [ ] Audio chanting / pronunciation guide in Middle Chinese (*中古漢語*) reconstructions, Mandarin Pinyin, and Sino-Japanese readings (*Kanbun*).

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

*TranslateChan is open-source, non-sectarian, and dedicated to the perpetual preservation and illumination of the wisdom of the ancient Chan masters.*
