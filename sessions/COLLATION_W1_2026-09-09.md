# W1 — Independent Full-Corpus Collation vs Official CBETA (2026-09-09)

**Author:** Orchestrator agent (session `arena/01a087e2-translatechan`), acting on explicit
owner directive (2026-09-09): full collation of 100% of source Chinese fields against
official CBETA, W1/W2 exclusive before any other work.

## 1. Method and reproducibility

- **Reference:** official CBETA XML P5 (`github.com/cbeta-org/xml-p5`), sparse blob-filtered
  clone (T45/T47/T48/T51 + X63/X67/X68/X69/X73/X80/X86). Text extracted from `<body>`
  (skipping `<note>` apparatus, keeping `<head>`) by the committed harness.
- **Harness:** `scripts/collate_corpus.py` (committed with this report). Normalization on
  both sides: NFKC → graphic-variant map (説/說, 爲/為, 盡/尽, 却/卻, 沈/沉, 麁/粗, 疎/疏,
  啓/啟, 惛/昏, 窓/窗, 栢/柏, 谿/溪, 圜/圓, …) → CJK-only. Matching: strict containment →
  曰/云-neutralized containment (REWORDED) → 8-gram anchor voting + SequenceMatcher window.
- **Classes:** EXACT / REWORDED / MINOR (≥0.98, edition-graphic residue) / DIVERGENT
  (0.85–0.98, rewrite-suspect) / NOT_FOUND (<0.85, fabrication-suspect) / TITLE_COMPOSITE /
  SHORT_UNMATCHED / WITNESS_UNAVAILABLE.
- **Register:** `sessions/COLLATION_REGISTER_2026-09-09.json` — every flagged field with
  similarity, best reference window, and (for probes) where the text actually lives.
- **Reference manifests:** `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` (sha256 per
  extracted reference text, 174 files). To reproduce: see harness docstring (git
  sparse-checkout of cbeta-org/xml-p5; raw CDN was unreachable from this sandbox; git
  protocol worked).

## 2. Headline verdict

**The public claim that the corpus is "source-tracked Classical Chinese tied to named
CBETA/Taishō witnesses" does not survive collation.** Of 34 active documents, only 1
(Zhengdao Ge) collates 100% against its claimed witness; the two `complete_selected_witness`
flagships are partial (Wumenguan 62%, Xinxin Ming 68% of content fields); **27 documents
fail their claimed witness outright**, and 2 claim witnesses outside CBETA entirely.
913 content fields total; 588 (64%) collate to the *claimed* witness.

## 3. Per-document verdict table

Witness = the document's own `cbeta_id` claim. "content" excludes `title_zh`/`name_zh`
fields (predominantly project-authored composites — see §6).

| document | witness claimed | content | collates | rate | tier |
|---|---|---:|---:|---:|---|
| zhengdao_ge | T2014 | 6 | 6 | 100% | A |
| linji_yulu | T1985 | 89 | 79 | 89% | B |
| biyanlu_cases | T2003 | 395 | 353 | 89% | B |
| xinxin_ming | T2010 | 37 | 25 | 68% | B |
| wumenguan | T2005 | 181 | 113 | 62% | B |
| baojing_sanmei | T1986A/B | 6 | 2 | 33% | C |
| platform_sutra | T2008/T2007 | 13 | 4 | 31% | C (mixed recensions) |
| huangbo_chuanxin | T2012A | 11 | 2 | 18% | C |
| chuandenglu | T2076 | 6 | 1 | 17% | C |
| bodhidharma_erru | T2009 | 6 | 1 | 17% | C |
| fayan_yulu | T1991/X1226 | 11 | 1 | 9% | C (misattributed) |
| dongshan_yulu | T1986A/B | 21 | 1 | 5% | C |
| mazu_yulu … yuanwu_letters (18 docs) | various | 2–12 each | 0 each | 0% | C |
| hanshan_poems | (SBCK) | 4 | 0 | – | no-CBETA-witness |
| niutou_juezhu | (Dunhuang P.2885) | 5 | 0 | – | no-CBETA-witness |

Detailed per-field evidence: COLLATION_REGISTER JSON (`flagged` lists; 637 entries).

## 4. Verified fabrication suspects (absent from the claimed witness; some invented)

- **wumenguan preface** — rewrites T2005 (drops 「既是無門且作麼生透」, replaces
  「無風起浪好肉剜瘡」 with 「以拳指空畫地做餅」). **wumenguan epilogue** 「大路坦然…」 —
  not in T2005 at all.
- **wumenguan verses** for cases 3, 4, 6 (「拈起花來尾巴已露**天真地秀**迦葉無處」 —
  「天真地秀」 is a *Journey to the West* phrase; LLM-confabulation signature), 29, 37
  (「言不指事言不干機」 vs real 「言無展事語不投機」), 俱胝 verse 「剪刀截破大荒崖」.
- **wumenguan case 23 pointer** 「無門曰…心如擘栗蓬…」 — invented 無門曰 (real T2005:
  「事出急家老婆心切譬如新荔支剝了殼去了核」).
- **huangbo_wanling** opening 畫象/真容 story — absent; T2012B opens 「裴相公問：山中四五百人…」.
  Whole document: 0/12 collating.
- **biyanlu 垂示 (pointers) for cases 1, 2, 80** — different text from T2003's actual 垂示;
  the doc's own `coverage_note` claims these cases have "no 垂示 recorded" while carrying
  non-canonical pointer text.
- **deshan_yulu (whole doc)** — 擔疏鈔/婆子點心/龍潭吹燭 narratives are *retellings*;
  0/6 fields match T2076, X1315, or X1565 phrasing (the stories exist in the tradition,
  the wording does not match any claimed/checked witness).
- **qinggui_monastic_codes** — composed educational prose (「一日不作一日不食自此叢林普請之風大興」)
  around real quotes; matches neither T2025 nor X1245 text.

## 5. Verified witness misattributions

- **zhaozhou_yulu claims T1987 — T1987 is the Caoshan (曹山) record.** Real Zhaozhou
  material is in 古尊宿語錄 X1315 (10/35 flagged fields found there verbatim; rest are
  retellings). README/HANDOFF "Sayings of Zhaozhou T1987 (Vol. 47)" is **false**.
- **dahui_hongzhi**: Hongzhi's 默照銘 lives in T2001 宏智廣錄, not claimed T1998A.
- **platform_sutra**: mixes Dunhuang-recension readings (「明鏡亦無臥具/佛性常清淨」 verse)
  into a claimed 宗寶本 (T2008: 「明鏡亦非臺…本來無一物」) witness. T2007 (Dunhuang) is
  co-claimed, but a single reading surface cannot silently blend recensions.
- **fayan_yulu**: `coverage_note` attributes content to "T1985 / X1321" (Linji/Mazu!);
  content is mostly the Fayan biography/dialogues from 傳燈錄-class sources, not claimed T1991.
- **linji_yulu sections 67–73** (黃檗鏵地, 龍門普化, 達磨塔頭, 象田, 傳法偈 variant): not in
  T1985, X1315, T2076, or X1565 — 行錄-tradition retellings under a T1985 claim.

## 6. Systematic presentation problems

- **233/237 case/section/chapter `title_zh` fields do not collate**: titles are composite
  project-authored strings (「title + topic」, e.g. 「行由品第一傳承偈頌」) rendered as if
  they were source headings.
- **曰→云 drift**: corpus 曰:云 = 34:81 in Wumenguan vs T2005's 124:92 — systematic
  rewording of genuine passages (e.g. 「還可趣向**否**」 → 「還可趣向**也無**」).
- **Xinxin Ming** follows some other printed edition while claiming T2010 (勿→莫, 心→必,
  妄自→良由, 勞→用, 眠→寐, 啟→契; 「一念萬年」 absent from CBETA's recension).
- Simplified characters appear in corpus source fields (尽 etc.) — recorded per field in
  the register.
- Biyanlu `cases[95].dialogue[0].zh` embeds editorial commentary inside a source field
  (「…即在評唱所引」).

## 7. What is genuinely supported

- **Biyanlu main content is substantially real**: 353/395 content fields collate (368 EXACT
  overall incl. titles/subunits), 22 MINOR (graphic residue), i.e. the case/dialogue/verse/
  commentary bulk is the T2003 text, with the pointer/verse exceptions in §4.
- **Wumenguan dialogues/commentary are majority-genuine** (113/181) with specific fabricated
  verses/preface/epilogue/pointer.
- **Linji main sections** 79/89; **Zhengdao Ge** 6/6; the Senzaki & Reps verified-quotation
  layer (W2) is a separate question, not covered here.

## 8. Residual caveats

- Tier B/C rates measure collation **against the document's own claimed witness**. Some
  tier-C content may exist verbatim in *other* CBETA works not probed (register records
  probe hits where checked: e.g. 10/35 Zhaozhou fields found in X1315).
- DIVERGENT fields (0.85–0.98) are mostly real-text-with-variants (e.g. Xinxin Ming's other
  edition), distinct from NOT_FOUND retellings; the register keeps them separate.
- Two documents (hanshan, niutou) claim non-CBETA witnesses; they need manuscript/SBCK
  sources (not attempted: external archives unreachable from this sandbox).
- Harness conservatism: only unambiguous graphic variants normalized; any remaining
  edition-variant families would deflate EXACT counts slightly (never inflate them).

## 9. Remediation options (owner decision pending)

- **R-A Fix-in-place**: re-key every DIVERGENT/NOT_FOUND field from its witness (CBETA XML
  on hand); re-point misattributed witnesses; split composite titles out of `title_zh`.
  Highest integrity; large multi-PR effort; per-doc sequencing by tier and size.
- **R-B Honest relabel**: keep text, downgrade visible provenance (no witness claims on
  public surface; "project retelling" badges), keep CBETA IDs only where fields collate.
  Fast, honest, but shrinks the "source-tracked" surface to ~4 documents.
- **R-C Quarantine** (Congronglu precedent) for worst offenders (deshan_yulu, qinggui,
  composed sections) + R-A/R-B for the rest.
- Regardless: add validator rules (source fields must collate against committed reference
  digests; forbid editorial text inside source fields; forbid composite title strings) and
  correct README/HANDOFF/ROADMAP/AUDIT claims that this report falsifies.

## 10. Next steps

1. **W2** — spot-check the 177 "edition-verified quotations" against public-domain
   editions (Senzaki & Reps 1934 first).
2. Owner decision on R-A / R-B / R-C; then remediation PR series (delegate to coder agents,
   one document per PR, keyed to register entries).
