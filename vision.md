# 🤖 Fake Chan Factory: Vision & Architectural Blueprint

> **Document type**: *aspirational architecture with a current public-scope note*, aligned to the measured status quo **as of 2026-09-20 (Caoshan Benji ingest + P2 core-yulu authenticity labels refresh)**. Prose blocks below carry their own dated measurements (the 2026-09-12 figures in §1.1 are the last full recompute and remain authoritative for those passages); current gate-run totals are **101** provenance-note strings across four keys (`cbeta_note` 22, `recension_note` 14, `coverage_note` 36, `editorial_note` 29) with **65 of 101** passage-level strings rendered across **29** documents. For **measured current status**, see [`AUDIT.md`](./AUDIT.md); for phase tracking and each phase's denominator, see [`ROADMAP.md`](./ROADMAP.md); for release gating, see [`RESEARCH_RELEASE_PLAN.md`](./RESEARCH_RELEASE_PLAN.md); for operational flow, see [`HANDOFF.md`](./HANDOFF.md). The public Pages interface is deliberately limited to Reader, Matrix, Lineage, Gong'an Index, and Lexicon; it does not expose browser drafting, Arena-agent branding, or a header GitHub link.

> **The public scope is exactly five rooms — measured, not intended.** `index.html` carries five room buttons (`grep -c 'data-room-index' index.html` → **5**: `data-room-index` 01–05 = `reader`, `matrix`, `lineage`, `gongan`, `lexicon`), and `scripts/smoke_test.mjs` guards that surface. Client-side full-text search is a cross-room feature, not a sixth room. Everything this document describes beyond those five rooms — a Translation Studio, Arena-agent surfaces, phonetics/chanting modules, community review and consensus voting, graph-database navigation, an offline PWA — is **outside the public scope today** and would require an explicit scope decision plus a smoke-guard update before it could appear. Where a section below reads as though more surface exists, this note is the correction.

> **Where the corpus actually stands (2026-09-20).** **36 documents**, **0 complete**, **31 excerpt seeds**, **189,629** source-content CJK characters (**199,094** across every corpus JSON string) — `python3 -c "import json;m=json.load(open('data/project_metrics.json'))['corpus'];print(m['documents'],m['complete_documents'],m['excerpt_seed_documents'],m['content_cjk_characters'],m['all_corpus_cjk_characters'])"`. W1 source-review states: **2** `collated_to_claimed_witness` (`zhengdao_ge`, `congronglu`), **32** `partial_or_failed_w1_collation`, **2** `witness_unavailable`. The Wave 1 integrity campaign (PRs #29, #30, #32, #34, #35) re-keyed four documents to their pinned CBETA witnesses and labelled a fifth; three independent witness inventories plus [`.orchestrator/PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md) now cover the 36 documents, and [`ROADMAP.md`](./ROADMAP.md) records the campaign. §1.1 below states, objective by objective and element by element, how far each ambition is from being met. **Nothing here is softened**: the objectives keep their full strength, *Congronglu* is reinstated and fully collated (§2 note) without human sign-off, and no reduction in flagged fields is presented as completion.

> 🤖 **Brand note (2026-08-09).** The public app is branded **Fake Chan Factory**: the English renderings are *Robolations* — AI text written in a famous translator's register, clearly badged and not citable as that translator's work. Edition-verified quotations are badged **✅ Edition-verified quotation** and keep their real attribution; rights/public-domain status remains separate. This document describes the *architecture and scholarly infrastructure* (canonical sources, lineage graph, locators, provenance) that the Factory runs on — that infrastructure is real whether a given rendering is Robo or verified.

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

### 1.1 Distance to each objective (measured 2026-09-12)

The five objectives above are stated at full strength and are **not** renegotiated here. What follows is the measured distance to each, with the command that produces every number, so a reader can check this section without opening `data/`.

1. **Exhaustive Canonical Ingestion — not met.** 36 documents are ingested (`ls data/corpus/*.json | wc -l` → 36) out of a stated scope spanning Taishō 47/48/51 and the *Zokuzōkyō*; **0 are complete** (`corpus.complete_documents` is empty) and **31 are excerpt seeds**. 1,093 of 1,424 source-content fields collate to their claimed witness, and 22 documents have no collating source-content field at all (`data/project_metrics.json` → `corpus.source_review`). *Jingde Chuandenglu*'s 30 fascicles, the monastic codes as complete texts, and Zhaozhou's full dialogue record are not ingested; *Congronglu* is reinstated with **100/100** cases collating, but its front matter, interlinear 著語 apparatus and human sign-off are not (§2 note). No automated CBETA ingestion exists — `scripts/segment_classical.py` is an offline manual segmenter and `scripts/ingest_cbeta.py` is a deprecated wrapper; the W1 harness (`scripts/collate_refs.py`) extracts pinned witnesses for collation only, not for ingestion.
2. **Comprehensive Lineage & Genre Taxonomy — partial.** 35 master profiles (12 controlled `school_key` groups), 31 internal edge records and 4 frontiers, 7 lineage source records — **all 31 edges remain `traditional_link_pending_exact_locator`** (`data/lineage/lineage_verification.json`), and the profile queue holds 30 `needs_exact_locator`, 1 `in_review`, 4 `frontier_source_needed`. Gong'an cross-referencing covers 24 indexed cases in 7 curated theme groups. Monasteries, eras, and genre axes are modeled in metadata, not as a queryable graph.
3. **Multi-Translator Comparative Analysis — partial.** The sentence-aligned format is complete and populated with **4 exemplar passages carrying 21 translator registers** (18 `reconstruction_unverified`, 2 `verified_quotation`, 1 `ai_draft`); corpus-side there are 1,252 translation slots (177 verified quotations, 876 unverified register reconstructions, 199 AI drafts). This is a demonstrated contract, not a comparative corpus: most of the roster's real published wording is not held, and reconstructive registers are badged as such precisely because they are not quotations.
4. **Source Verification & Disclosure Workflow — partial; the element-by-element checklist is below.** This objective has moved furthest in the last campaign and also carries the campaign's clearest unfilled gap (disclosure that exists in data but does not render).
5. **Zero-Backend Public Research Reader — met on surface, unmet on evidence.** Five rooms ship from `main /docs` with no backend, CSP `script-src 'self'`, and a green dependency-free smoke suite (`node scripts/smoke_test.mjs`). Against "ultra-fast": the bundle is monolithic (all 35 documents initialize up front), mobile first-load performance has never been measured; the 41 JS-generated inline styles that once required `style-src 'unsafe-inline'` are gone (Phase 2 moved them to classes, Phase 3 re-composed the secondary rooms onto it, and the CSP dropped `'unsafe-inline'` on 2026-09-13). Against "responsive, accessible": **no real-browser or screen-reader evidence exists** (Chromium failed with `ECONNRESET` in the 2026-08-11 session; `scripts/browser_test.mjs` is optional and not in CI), so the design must not be described as screenshot- or accessibility-verified.

**Objective 4, element by element.** The objective's own words are *primary-source locators, book/edition references, page-or-section states, rights records, and hover/focus/touch citation details*. Each element, marked honestly:

| Objective 4 element | State 2026-09-12 | Check with |
| :--- | :--- | :--- |
| **primary-source locators** | **Partial.** `data/canonical_locators.json` covers all 36 documents and 248/248 declared case records (48 *Wumenguan* + 100 *Biyanlu* + 100 *Congronglu*) — but only **3** documents are case-level and **33** remain document-level seeds, and the editorial queue holds 30 `needs_unit_locator` + 3 `in_review` records. Page/line or TEI anchors for those 33 do not exist. A case-number anchor is not proof that every nested source field was collated. | `python3 -c "import json;print(json.load(open('data/project_metrics.json'))['canonical_locator_coverage'])"` |
| **book/edition references** | **Exists for the English quotation layer.** 176 of 179 verified source records carry a recorded reference and 3 are pending; 13 distinct verified source ids resolve into the rights manifest's 14 source records. | `…['translations']['verified_reference_coverage']` → `{'recorded': 176, 'pending': 3}`; `…['rights_coverage']` |
| **page-or-section states** | **Partial, and honest where missing.** Of the 177 verified corpus quotation slots, 175 `reference` fields record a case/page/section state and 2 state `translation book episode/page pending` explicitly (both in `zhaozhou_yulu`). The "135 recorded / 5 pending" figure that `ROADMAP.md`'s Phase 4 carried was stale and is corrected there in this alignment; measured 2026-09-12 it is 175/2 in the corpus and 176/3 across all 179 verified source records. | walk every `"reference"` string in `data/corpus/*.json` and count `pending` |
| **rights records** | **Partial — policy-level, not per-item.** `data/translations/rights_manifest.json` carries one `policy` block plus **14** `sources` records; **all 14 still await human/jurisdiction review**, and there are no per-quotation rights entries. Edition verification never implies rights approval, and no ledger approves reuse. | `python3 -c "import json;print(len(json.load(open('data/translations/rights_manifest.json'))['sources']))"` → 14 |
| **hover/focus/touch citation details** | **Implemented, not browser-evidenced.** Reader and Matrix render canonical location, translator + status, book/edition, page-or-section state, verification state, and rights identifier through hover, keyboard-focus and touch popups, and the smoke suite asserts that markup — but no real-browser or screen-reader run is on record, so the affordances are unverified in a browser. | `node scripts/smoke_test.mjs`; `scripts/browser_test.mjs` (optional, skips without Chromium) |

**What now exists beyond the objective's 2026-08 wording** (the W1 source-integrity layer, built 2026-09-09 → 2026-09-12):

- A **witness-pinned collation harness**: `scripts/collate_refs.py` extracts 39 reference texts from CBETA XML P5 pinned at revision `dbdea41071e1e260ad84b72faefd4587333cf76d` and verifies every digest (39 verified / 0 drift against `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`); `scripts/collate_corpus.py` collates every source-content field against them; `scripts/w1_evidence.py` recomputes each published figure instead of trusting stored ones.
- **Preservation and rule gates**: `scripts/test_source_preservation.py` byte-compares `data/corpus/` against the pinned base commit `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43` and permits only exact allowlisted JSON pointers (218 permitted changes, 0 unauthorized on this run); `scripts/test_source_review_rules.py` runs 120 source-review rule checks, including the doc-truthfulness rules that pin the W1 sentences in the public documents.
- **A public per-document source-review state** in `data/corpus_manifest.json`, rendered as a visible Reader ledger, with completion/status incompatibility rejected by the validator: `complete` ⇔ `complete_selected_witness` + `collated_to_claimed_witness`.
- **Census refresh 2026-09-20 (P2 core-yulu authenticity labels, task 047):** the corpus carries **101** provenance-note strings across four keys (`cbeta_note` 22, `coverage_note` 36, `editorial_note` 29, `recension_note` 14), **65 of 101** rendering beside a passage (the 36 `coverage_note` lines stay ledgered by exemption), **29** documents carrying at least one label (unchanged — `baizhang_guanglu` and `huangbo_wanling` already carried labels). Task 047 lands per-field R-B labels — 6 `editorial_note` on `baizhang_guanglu` and 7 on `huangbo_wanling` plus one new `cbeta_note` (the T2012A/T2012B fascicle split) — rewrites the Huangbo `coverage_note` as the full per-field disclosure of the re-measured 0/7 (40-work pinned set, refs 40 verified / 0 drift) and closes the Huangbo section-4 pending-collation note; no re-key lands (no verbatim carrier in any of the 40 refs). The line below is the 2026-09-20 Caoshan Benji snapshot and stays readable as such.
- **Census refresh 2026-09-20 (Caoshan Benji ingest):** the corpus carries **87** provenance-note strings across four keys (`cbeta_note` 21, `coverage_note` 36, `editorial_note` 16, `recension_note` 14), **51 of 87** rendering beside a passage (the 36 `coverage_note` lines stay ledgered by exemption), **29** documents carrying at least one label. The line below is the 2026-09-20 Jingde-Chuandeng-Lu snapshot and stays readable as such.
- **Census refresh 2026-09-20 (full 30-fascicle Jingde Chuandeng Lu ingest):** the corpus carries **85** provenance-note strings across four keys (`cbeta_note` 20, `coverage_note` 35, `editorial_note` 16, `recension_note` 14), **50 of 85** rendering beside a passage (the 35 `coverage_note` lines stay ledgered by exemption), **28** documents carrying at least one label. The line below is the 2026-09-20 Congronglu snapshot and stays readable as such.
- **Census refresh 2026-09-20 (Congronglu reinstatement):** the corpus carries **83** provenance-note strings across four keys (`cbeta_note` 19, `coverage_note` 34, `editorial_note` 16, `recension_note` 14), **49 of 83** rendering beside a passage (the 34 `coverage_note` lines stay ledgered by exemption), **27** documents carrying at least one label. The figures in this section's next lines are the 2026-09-17 snapshot and stay readable as such.
- **25 documents carry provenance labels** (`cbeta_note` in 17, `editorial_note` in 16, `recension_note` in 14) recording citation corrections, retained project retellings with no witness attribution, and recension provenance.

**What now renders — the presentation gap is closed (PR #40, 2026-09-12); it is implemented and gate-guarded, not browser-verified.** The corpus carries **78** provenance-note strings across four keys. One shared renderer now prints the three passage-level keys — precedence `recension_note` → `editorial_note` → `cbeta_note`, one line each, never concatenated — at **17** content sites covering every node type that carries a note (document root, preface/epilogue, case, section, dialogue, stanza, chapter and nested verse entries), so **47 of the 78** strings reach the passage they describe. The labels this paragraph previously named as unreachable are now visible and are the examples the permanent gate protects: `caoxi_zhuan`'s `cbeta_note` correction that the prior "X1458" citation was wrong (X1458 is 宗門寶積錄; the 曹溪大師別傳 is X86n1598 plus Dunhuang P.3018), the `editorial_note` labels marking `linji_yulu` sections 71–73 and `xinxin_ming` stanza 31 as project retellings with no witness attribution, and `platform_sutra`'s root recension note — the disclosure that 9 of its 13 source-content fields are project précis — now reachable beside its **10** chapter/dialogue notes (6 chapter + 4 dialogue); the document holds **14** `recension_note` values in all, 1 root + 3 verse + 6 chapter + 4 dialogue, and only the 3 verse-level ones rendered before. The remaining **31** strings are `coverage_note`, a document-scale dossier ledger field rather than a passage label: it keeps its single rendering as the "Reading" row of the represented-units ledger and is the sole explained exemption, with its reason recorded in `NOTE_RENDER_EXEMPTIONS` in `scripts/test_source_review_rules.py`. The true shape at that measurement was therefore **47 rendered beside passages of 78 carried; 31 ledgered by recorded exemption** (2026-09-16; the 2026-09-20 census refresh above measures 49 of 83 rendered, 34 ledgered) — no older sentence may claim "all notes render", and none does. The contract is measured, not asserted: parse the precedence constant, count the renderer's call sites, enumerate the note keys from the data, and assert every one is either rendered or exempted:

```bash
python3 - <<'PY'
import json, glob, re, collections
js = open('app.js', encoding='utf-8').read()
rendered = tuple(k.strip().strip('"\'') for k in
                 re.search(r"PROVENANCE_NOTE_KEYS = \[(.*?)\]", js).group(1).split(','))
sites = js.count('renderProvenanceNotes(') - 1          # minus the definition
test = open('scripts/test_source_review_rules.py', encoding='utf-8').read()
body = re.search(r"NOTE_RENDER_EXEMPTIONS: dict\[str, str\] = \{(.*?)\n\}", test, re.S).group(1)
exempt = set(re.findall(r'^\s{4}"([a-z_]+)":', body, re.M))
keys = collections.Counter()
for f in glob.glob('data/corpus/*.json'):
    for k, v in re.findall(r'"([a-z_]+_note)"\s*:\s*"([^"]*)"', open(f, encoding='utf-8').read()):
        if v.strip(): keys[k] += 1
print(f'rendered={rendered} call_sites={sites} exempt={sorted(exempt)}')
print('per-key:', dict(keys))
orphans = sorted(k for k in keys if k not in rendered and k not in exempt)
print('ORPHANS:', orphans or 'none — every key is rendered or exempted')
assert not orphans, orphans
print(f'asserted: {sum(keys[k] for k in rendered)} of {sum(keys.values())} note strings render beside a passage')
PY
```

It prints on `main` (2026-09-16):

```text
rendered=('recension_note', 'editorial_note', 'cbeta_note') call_sites=17 exempt=['coverage_note']
per-key: {'cbeta_note': 17, 'coverage_note': 31, 'editorial_note': 16, 'recension_note': 14}
ORPHANS: none — every key is rendered or exempted
asserted: 47 of 78 note strings render beside a passage
```

Objective 4's disclosure element is therefore **met as to implementation and gating**: every passage-level note key the data carries renders at every node that carries one, and the gate is permanent — `scripts/test_source_review_rules.py` §15 enumerates `[a-z_]+_note` keys from `data/corpus/*.json` at run time and fails if a key is neither in `app.js`'s `PROVENANCE_NOTE_KEYS` nor on the explained exemption list, so a future orphan label goes red in CI. The qualifier is the same one the hover/focus row carries: this is **implemented and gate-guarded, not browser-verified** — `scripts/browser_test.mjs` has never run (no Chromium; the 2026-08-11 attempt died with `ECONNRESET`), so no real-browser or screen-reader evidence exists. [`RESEARCH_RELEASE_PLAN.md`](./RESEARCH_RELEASE_PLAN.md) release blocker 2 is ticked on exactly this basis.

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
   • Huangbo Chuanxin      • Congronglu †         • Wudeng Huiyuan        • Chiting Qinggui       • Baojing Sanmei
   • Dongshan Yulu         • Xuetang Yulu          • Jiatai Pudeng         • Ruzhong Riyong        • Zhengdao Ge
```

> **† *Congronglu* (從容錄, T2004) — reinstated 2026-09-20.** The seed was removed from the active bundle on 2026-08-10 after the audit found generated source-looking placeholders and case-number/page claims that the authoritative T48n2004 headings disproved. It has since been rebuilt from scratch out of that pinned witness under the same contract the Wave 1 re-keys used: **100/100 cases and 500/500 source-content fields EXACT, 0 flagged**, none of the quarantined generated records copied, and the one evidence caveat (no reproducible 2026-09-09 reference anchor for that work) adjudicated in `sessions/COLLATION_W1_2026-09-20_CORRECTION.md` §4. The corpus therefore holds **100** *Congronglu* cases (`ls data/corpus/*.json | wc -l` → 36 documents). What is still *not* held: the witness's front matter and interlinear 著語 apparatus, a human editorial sign-off, and the gong'an indexing of the 100 cases — the "all 100 cases" ambition in §7 Phase 2 is met for *representation*, not for completion.

### 2.1 Canonical Volume Breakdown

| CBETA / Taishō Canon | Category | Key Classical Works Included | Focus & Structure |
| :--- | :--- | :--- | :--- |
| **Taishō Vol. 48 (T1985–T2025)** | **Discourse & Gong'an (諸宗部五)** | *Wumenguan* (無門關 T2005), *Biyanlu* (碧巖錄 T2003), *Congronglu* (從容錄 T2004 — **reinstated 2026-09-20; 100/100 cases held**, see the §2 † note), *Linji Yulu* (臨濟語錄 T1985), *Platform Sutra* (六祖壇經 — T2007 Dunhuang recension primary, T2008 宗寶 recension alternative), *Huangbo Chuanxin Fayao* (傳心法要 T2012A) | Foundational recorded sayings, classic encounter dialogues, case pointers (*垂示*), main cases (*本則*), verses (*頌*), and commentary (*評唱*). |
| **Taishō Vol. 47 (T1957–T1984)** | **Sectarian & Recorded Sayings (諸宗部四)** | *Zhaozhou Yulu* (趙州語錄 — the corpus record still cites T1987 as its witness and that claim is **false**: T1987 is the Caoshan record, 曹山本寂語錄; re-pointing it is a queued citation fix), *Dongshan Liangjie Yulu* (洞山良价語錄 T1986), *Caoshan Benji Yulu* (曹山本寂語錄 T1987), *Yunmen Yulu* (雲門語錄 T1988), *Xuanling Yulu* (玄沙語錄) | Detailed monastics discourse records, sermons (*上堂*), evening instructions (*晚參*), and question-and-answer encounters. |
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

A single Gong'an or Yulu passage often carries multiple distinct translations in English, each reflecting a different translator's philosophical stance, poetic register, or understanding of classical Buddhist idioms. In the live **Fake Chan Factory** app these comparative registers are presented as **🤖 Robolations** (AI text in the scholar's style, *not* their published words); only a genuinely verified quotation keeps the real name and the **✅ Edition-verified quotation** badge. The table below illustrates the *comparative concept*.

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
- [ ] Expand canonical text coverage to all 48 cases of *Wumenguan*, all 100 cases of *Biyanlu*, and all 100 cases of *Congronglu* (從容錄) — **a named goal, with its true distance attached (measured 2026-09-12).** *Wumenguan* represents 48/48 cases and *Biyanlu* 100/100 case records, but representation is not completion: both were re-keyed to their pinned witnesses (PRs #29, #30) and both remain `partial_or_failed_w1_collation` with documented residuals, and neither document is `complete_selected_witness`. **The corpus now holds 100/100 *Congronglu* cases**: the quarantined 2026-08-10 seed was replaced by a fresh extraction from the pinned T48n2004 witness (2026-09-20 reinstatement — 500/500 source-content fields EXACT, 0 flagged, no quarantined record copied), represented but not complete: front matter, the interlinear 著語 apparatus and human sign-off remain open. Reinstating the 100 cases requires field-level collation of every case against T48n2004 — the same contract the Wave 1 re-keys used — before any *Congronglu* text re-enters the bundle; none of the quarantined generated records may be copied back.
- [ ] Ingest *Jingde Chuandenglu* (景德傳燈錄) 30 fascicles with automated master-index cross-linking.

### Phase 3: Advanced Comparative Matrix & Scholarly Notes
- [ ] Ingest additional modern and academic translations (Anderl, Welter, Heine, McRae, Foulk, Kirchner).
- [ ] Add variant apparatus (*異文校勘*) noting textual differences between Dunhuang manuscripts, Song woodblocks, and Ming/Taishō editions.
- [ ] Interlinear commentary toggle: view Yuanwu's comments (*圓悟評唱*), Wumen's warnings (*無門關評*), and Dahui's letters side-by-side.

### Phase 4: Source Verification, Disclosure & Editorial Review

> **Status as of 2026-09-13:** this phase moved furthest in the Wave 1 campaign and still carries its clearest gap. Delivered: the witness-pinned collation harness and its preservation/rule gates, independent witness inventories covering **35/35** documents, provenance labels in **24** documents, and **5** documents re-keyed to a pinned witness or labelled (PRs #29, #30, #32, #34, #35). Owed: exact unit locators for the 33 document-level seeds, human rights review for all 14 manifest sources, the six queued false-citation fixes, and — on the evidence side — the **designation half** of the post-remediation evidence pass: its measurement half is published at [`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`](./sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json) + [`sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md`](./sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md) (re-adjudicated 2026-09-12: 532 flagged fields, 691/924 content fields collating, statuses unchanged at 1 / 32 / 2, `documents_with_changed_status: 0`), but the authoritative total stays the 2026-09-10 register's 630 until the owner-ruled evidence-model change that release blocker 1 describes. The rendering debt this sentence carried in earlier revisions — *rendering the 50 provenance notes* — shipped through PR #40: 40 of 70 render beside passages and 30 stay in the dossier ledger by recorded exemption (§1.1). The checklist below is unchanged; the element-by-element measurement is in §1.1.

- [~] Complete exact canonical locators for every non-case seed unit (page/line or TEI anchors).
- [~] Complete exact book-page/episode references and human rights review for every verified modern translation.
- [x] Render AI drafts/reconstructions only with explicit disclosure, never as scholar quotations.
- [x] Provide source/translation/lineage citation details by hover, focus, and touch in public Pages surfaces. *(Implemented and smoke-guarded; no real-browser or screen-reader evidence exists, so it is not browser-verified — §1.1.)*
- [x] Surface every provenance label the data carries (`cbeta_note`, `editorial_note`, `recension_note`) beside the passage it describes — PR #40 renders **40 of the corpus's 70 note strings** at 17 shared-renderer call sites, one line each; the other 30 are `coverage_note` ledger strings under the single recorded exemption. *(Implemented and gate-guarded; no real-browser evidence exists, so it is not browser-verified — §1.1.)*

### Phase 5: Phonetics, Middle Chinese & Multilingual Global Canon

> **Scope note (2026-09-12):** every item in Phases 5–6 sits **outside** the current public surface, which is exactly five rooms (Reader, Matrix, Lineage, Gong'an Index, Lexicon — the header note carries the measuring command). None of them may be read as an existing feature or as approved scope; each needs an explicit scope decision, a smoke-guard update, and its own evidence before it appears publicly.

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
