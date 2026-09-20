# P1 Congrong Lu Reinstatement — T48n2004 witness collation (task 043)

> **Date:** 2026-09-20 · **Branch:** `arena/01a0c065-translatechan` (base `main` f099932, P0) · **Task:** 043 (P1, Book of Serenity / 從容錄)
>
> **Outcome in one line.** The 100-case reinstatement was built from the pinned CBETA witness,
> **collates 100/100 against it — 601 of 601 fields EXACT (500 source-content + 101 metadata), zero
> flagged** — and **landed on 2026-09-20** under the owner's ruling that authorised the dated
> evidence-model extension it needed: `data/corpus/congronglu.json` is the 36th corpus document, the
> authoritative W1 record is now `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json` (the
> 2026-09-10 overlay's 35 entries inherited verbatim, plus this one measured document), and the
> bundle, mirror, metrics, reader and every doc citation were regenerated. All gates are green on the
> landed tree (§7). The one evidence caveat — this work id has no reproducible 2026-09-09 reference
> anchor — is recorded as drift and adjudicated in the overlay report §4, not hidden.

## 1. What this task produced

| Path | What it is |
|---|---|
| `data/corpus/congronglu.json` | the landed document — 100 cases, corpus-shaped (sha256 `4b5eb6f4723d14362dbd8e74ef31080e30f234097c24edeeccc8ce74e1e4d0d6`, 375,574 B) |
| `sessions/P1_CONGRONGLU_2026-09-20_locators.json` | the 100 per-case locators, merged into `data/canonical_locators.json` (`congronglu`, canonical id `T2004`, granularity `case`) |
| `sessions/P1_CONGRONGLU_2026-09-20_extraction_report.json` | extraction census, witness sha256, containment-anchor check |
| `scripts/segment_congronglu.py` | the reproducible producer; its only input is the pinned witness file |
| `sessions/COLLATION_REGISTER_2026-09-20_CONGONGLU_MEASUREMENT.json` | the harness's measurement of the landed document, with the historical comparison and the declared waiver (sha256 `5c09858f15cbae74e55a9fbea10043143e5d57b5b56d7be52778709d295e0d8e`) — **this entry is what the overlay records** |
| `sessions/COLLATION_REGISTER_2026-09-20_CONGRONGLU_CANDIDATE.json` | the pre-landing measurement of the same document (no historical comparison supplied) |
| `sessions/COLLATION_W1_2026-09-20_refs_manifest.txt` | 40-work digest manifest: the committed 39 + `T48n2004` (one added line) |
| `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json` (sha256 `215bad6526d10b5d0811b910309bab2c92cc6ffa54d129e532346467846af5ca`) + `sessions/COLLATION_W1_2026-09-20_CORRECTION.md` | the new authoritative W1 evidence record and its report |
| `scripts/record_congronglu_evidence.py` | the deterministic producer of the overlay (inherits 35 entries, appends the measured one, recomputes the register blocks with the harness's own functions) |

## 2. CBETA extraction and digest verification

**Upstream pin.** `cbeta-org/xml-p5` revision `dbdea41071e1e260ad84b72faefd4587333cf76d`;
witness file `T/T48/T48n2004.xml`, sha256
`838d8713596a7f53502d0e290801b123cb05a5fa09078a893a122b6668e37649`. (The 2026-08-10 containment
record quotes `5899ca8f50ae9c1f3d9328424e2cc40187c96a4d6805e5b19239b3bfc5580457` for the file it
retrieved through the GitHub API on 2026-08-10 — an earlier master revision, not a drift of this
one.)

**Reference extraction and verification.** The forty work ids (the 39 the harness reads plus
`T48n2004`) were extracted under the pinned rule `cbeta-p5-body-cjk-v1` and verified:

```
$ python3 scripts/collate_refs.py --from-digest-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt \
      --refs-dir /tmp/refs --require-verified
references: 40 work(s)
digest verification: 40 verified, 0 drift, 0 unlisted, 0 unavailable (against COLLATION_W1_2026-09-20_refs_manifest.txt)
✅ reference extraction/verification complete
```

`ref_T48n2004.txt` = 88,155 CJK characters (264,465 B = 88,155 × 3), sha256
`70413b279195b74148f03d6081c311511393dfaa65458f73e107116510738ba0`. The published manifest is the
committed 39-line file plus exactly one line (`diff` = `15a16`).

**Historical anchor caveat (blocker 3, now adjudicated).** The append-only 2026-09-09 manifest (187
works) lists `T48n2004` with `06d8ef7f44a1c51cef7af5ea9b98539cf23050b1e91b594947eab4226ee736e8`. The
pinned rule produces `70413b…` today, and the 2026-09-09 serialization was not reproduced by any of
the ten variants tested on 2026-09-20 — the most plausible reading is a pre-`cbeta-p5-body-cjk-v1`
extraction in that pass, i.e. the 2026-08-10 containment revision
(`5899ca8f…`) seen through an uncommitted rule. The same situation already exists for `T48n2001`.
Resolution (§5.3): the drift is **recorded**, the document is **declared** in
`generation_parameters.new_documents`, and every other document keeps the strict both-anchor rule.

## 3. The document: structure, anchors, fields

**Selection.** The witness's case containers are the 100 `cb:div` units carrying a numbered
`cb:mulu` (`"<n> <title>"`) and a `tei:head` (`"第…則<title>"`). Selecting by the numbered mulu is
required: four heads omit the 則 (cases 13, 16, 17, 59) and case 100 writes 第百則, so a naive
`^第\S+則` rule finds only 96 of 100.

**Fields per case** (each separately sourced, all verbatim under the pinned rule):

| Corpus field | Witness source | CJK |
|---|---|---|
| `pointer_zh` | the `示眾云…` paragraph (垂示) | 3,754 |
| `dialogue[0].zh` | the `舉…` paragraph (本則) | 6,203 |
| `commentary_zh` | the pre-verse `師云…` paragraph(s) (評唱) | 39,013 |
| `verse_zh` | the `lg` stanza (頌); cases 98–99 print it as a paragraph | 4,575 |
| `verse_commentary.commentary_zh` | the post-verse `師云…` paragraph(s) (頌後評唱) | 31,109 |
| `title_zh` (metadata, not content) | the `tei:head` verbatim, 則 numbering preserved | 857 |

`zh_chars` = **84,654** (500 source-content fields; the harness counts `title_zh` as metadata and
measures 101 metadata fields). Producer output (`scripts/segment_congronglu.py`):

```
cases: 100
reference characters under the pinned rule: 88155
  commentary_zh: 39013
  dialogue[0].zh: 6203
  pointer_zh: 3754
  title_zh: 857
  verse_commentary.commentary_zh: 31109
  verse_zh: 4575
zh_chars: 84654
verse carried in a paragraph (not lg): [98, 99]
containment anchors: {'33': '0249b21', '34': '0250a10', '35': '0250b19', '37': '0252a03', '38': '0252b28'}
```

**Locator anchoring** follows the 2026-08-10 containment table: a case is anchored at the `lb`
printed *before* its `div` (the line its heading sits on), not at the first `lb` inside it. All
five containment anchors reproduce exactly:

| Case | Containment record (`sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md`) | Landed document | Quarantined seed's claim (disproved) |
|---:|---|---|---|
| 33 | `T48n2004_p0249b21` — 第三十三則三聖金鱗 | `p.0249b21–p.0250a09` | 南泉見人作貓兒 |
| 34 | `T48n2004_p0250a10` — 第三十四則風穴一塵 | `p.0250a10–p.0250b18` | 盤山心印 |
| 35 | `T48n2004_p0250b19` — 第三十五則洛浦伏膺 | `p.0250b19–p.0251b15` | 俱胝豎指 |
| 37 | `T48n2004_p0252a03` — 第三十七則溈山業識 | `p.0252a03–p.0252b27` | 洞山麻三斤 |
| 38 | `T48n2004_p0252b28` — 第三十八則臨濟真人 | `p.0252b28–p.0253a19` | 百丈野狐 |

Case 1 runs `p.0227c28–p.0228b06`; case 100 runs `p.0291c05–p.0292a20` (the quarantined registry
claimed `T2004_p0196c`–`p0199c`).

**Recorded gaps** (the document's own `coverage_note`, in the file): the witness's interlinear 著語
annotations are `tei:note` elements that the pinned rule drops — 7,716 CJK characters of apparatus
are not represented; the front matter (two prefaces, the letter to Yelü Chucai, Wansong's preface,
the table of contents — 1,943 CJK) is not represented; the witness's own 則-numbering irregularities
are preserved rather than normalized. Representation is not completion.

## 4. Collation measurement (verbatim)

The landed document, measured by the harness with the historical comparison that the overlay records:

```
$ python3 scripts/collate_corpus.py --doc congronglu --refs-dir /tmp/refs \
      --refs-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt \
      --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
      --require-verified-refs --new-document congronglu --generated 2026-09-20 \
      --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
      --kind w1-congronglu-reinstatement-measurement \
      --out sessions/COLLATION_REGISTER_2026-09-20_CONGONGLU_MEASUREMENT.json
warning: congronglu: historical anchor for T48n2004 is 'drift'; accepted because congronglu is declared new to this overlay (no historical evidence record)
congronglu               {"EXACT": 601} -> collated_to_claimed_witness
aggregate: {"documents": 1, "flagged_entries": 0, "fields_total": 601, "content_fields_total": 500,
 "content_fields_collated": 500, "metadata_fields_total": 101, "class_totals": {"EXACT": 601},
 "source_review_status_counts": {"collated_to_claimed_witness": 1, …}, "documents_with_drifted_references": ["congronglu"]}
```

**100 of 100 cases collate** (every case 5/5 content fields EXACT) — the task's ≥90/100 bar is met at
100/100, and no field is flagged, so the document enters as `collated_to_claimed_witness` with 0
flags. The `warning:` line is the declared waiver doing its job: it names the drift, names the
declaration, and lets the pinned anchor carry the claim (the same run without `--new-document`
fails: `❌ congronglu: 'drift' claim rests on T48n2004 … a collated-to-witness claim requires
byte-verified references`, and `scripts/test_source_review_rules.py` pins both directions).

**The authoritative whole-corpus record** (`sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json`,
regenerated by `scripts/record_congronglu_evidence.py`):

```
aggregate: {"documents": 36, "flagged_entries": 630, "fields_total": 1916, "content_fields_total": 1424,
 "content_fields_collated": 1093, "metadata_fields_total": 492, "class_totals": {"DIVERGENT": 111, "EXACT": 1286,
 "MINOR": 30, "NOT_FOUND": 334, "SHORT_UNMATCHED": 109, "TITLE_COMPOSITE": 32, "WITNESS_UNAVAILABLE": 14},
 "source_review_status_counts": {"collated_to_claimed_witness": 2, "partial_or_failed_w1_collation": 32,
 "witness_unavailable": 2}, "documents_without_evidence": [],
 "documents_with_drifted_references": ["baizhang_guanglu", "congronglu", "dahui_hongzhi", "dahui_shobogenzo",
 "foyan_qingyuan", "nanquan_yulu", "xuansha_yulu", "xuefeng_yantou", "zhaozhou_yulu"]}
reference_verification: {"verified": 40, "drift": 0, "unlisted": 0, "none": 0} historical {"verified": 33, "drift": 7, "unlisted": 0, "none": 0}
reproduction: compared=34 identical=33 changed_status=0 flagged={'historical': 622, 'this_run': 623}
```

**Measurement, never designation.** `congronglu` contributes **0** flagged fields, so the
authoritative total stays **630** and only the document count moves 35 → 36. Per the standing
rulings, **630 stays "the register" and 486 stays "today's data as measured"**; the new measurement is
published as a measurement. The 2026-09-10 overlay and the 2026-09-09 register/report/manifest are
byte-identical to their committed versions.

## 5. The three blockers, and how the ruling resolved each

The candidate could not land on its own. Each blocker is recorded here with the verbatim evidence
from the pre-ruling run, and with the change the owner authorised on 2026-09-20.

**(1) A manifest item needs an evidence record in a pinned register — and there was no slot.**

```
❌ sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json.aggregate: harness documents without an evidence entry: congronglu
❌ data/corpus_manifest.json.source_review.items[congronglu]: declares source_review_status='collated_to_claimed_witness' with no evidence record in either W1 register — a status may not rest on the absence of a register entry
❌ data/corpus_manifest.json: manifest declares 2 item(s) with source_review_status='collated_to_claimed_witness' but the merged evidence derives 1; recompute the statuses from the registers
```

`FIXED_METADATA` pinned exactly one historical register (2026-09-09, 34 documents) plus one
`w1-correction` overlay (2026-09-10, 35 documents). **Resolution (authorised):** a new dated overlay
— `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json` — inherits the 2026-09-10 record's 35
per-document entries **verbatim** and appends the one measured document; `scripts/w1_evidence.py`
pins it as authoritative; the old records stay append-only. Document entries are inherited rather
than re-measured precisely because the corpus has been re-keyed since 2026-09-10: re-measuring would
move measured classes, which is a re-designation the rulings forbid.

**(2) The overlay check was single-document by construction.** `scripts/w1_evidence.py` iterated the
overlay-only documents and compared *the same* first prose matches against each document's figures,
so one prose match had to satisfy both `shitou_sandokai` (11/6) and a 500/500 candidate — with a
cross-document false positive already observed (`states Content fields 11/6 for congronglu`).
**Resolution (authorised):** the per-document pattern is now anchored to the document's own name
(`re.escape(key)[^|]{0,400}?Content fields: …`), the report states each overlay document's figures
beside its own name, and the same anchoring is applied to the reference-verification and register
figures. The check got *stricter*, not weaker: a document whose figures are absent now fails.

**(3) The 2026-09-09 reference anchor for `T48n2004` does not reproduce.**

```
❌ congronglu: 'drift' claim rests on T48n2004, which is 'drift' against sessions/COLLATION_W1_2026-09-09_refs_manifest.txt;
   a collated-to-witness claim requires byte-verified references
```

(the same run flags the pre-existing `dahui_hongzhi` / `T48n2001` drift). **Resolution
(authorised):** three adjudications were weighed — treat the line as this document's anchor and
refuse the claim (rejected: the 2026-09-09 pass never covered this document); silently drop or
rewrite the line (rejected: dated evidence is append-only); **record the drift truthfully and declare
the waiver** (chosen). `congronglu` is declared in `generation_parameters.new_documents`; the
historical state is recorded as `drift` and stays visible in
`aggregate.documents_with_drifted_references`; the pinned anchor must still verify byte-identically;
a key the historical register already covers may not carry the declaration, and naming a key that is
not in the register at all fails validation; a `--reproduce` replay of an overlay that declares
nothing behaves exactly as before. Full reasoning: overlay report §4.

**The documentation/metrics cascade** — fourteen validator errors while the corpus was unchanged —
is what the cascade sweep had to close alongside the evidence change. Every required snippet the
validator demanded is now in place, and the pre-ruling error list is preserved in the overlay report
§5. Net documentation effect of the landing (before → after):

| claim | before (35 documents) | after (36 documents) |
|---|---|---|
| corpus documents | 35 | **36** |
| W1 statuses | `1` collated · 32 partial/failed · 2 unavailable | **`2`** collated · 32 · 2 |
| register flagged fields | 630 | **630** (the new document flags none) |
| today's measured flags | 486 | 486 |
| source-content fields collating | 733 / 924 | **1,093 / 1,424** |
| metadata partition | 391 | **492** (299 non-collating) |
| canonical locators | 148 / 148 | **248 / 248** (36 documents) |
| bundle `app_data.js` | 1,693,251 B | **2,136,279 B** (deterministic, mirror byte-identical) |
| provenance-note census | 81 strings / 48 rendered / 18 `cbeta_note` | **83 / 49 / 19** |

## 6. No quarantined record was copied

* The producer's only input is the pinned witness file; every one of the 500 content fields is
  asserted to be a **contiguous CJK run of the pinned extraction** (100/100 at run time), so no text
  can come from anywhere else.
* The document carries the witness's own headings (三聖金鱗, 風穴一塵, 洛浦伏膺, 溈山業識, 臨濟真人 at
  33–38) — the five quarantined case identities the containment record disproved (南泉見人作貓兒,
  盤山心印, 俱胝豎指, 洞山麻三斤, 百丈野狐) appear nowhere in it, and the quarantined page claims
  (`T2004_p0196c`–`p0199c`) are contradicted by its anchors (p.0227c28–p.0292a20).
* `git log --oneline --grep=congrong` prints **nothing** in this clone — the history is a single
  squashed commit (`f099932`), so the quarantine commit is not queryable here; the positive evidence
  for "no copy" is the witness contiguity above plus the containment table, not git.
* `scripts/test_source_preservation.py` reports `1 declared new corpus file(s):
  data/corpus/congronglu.json` / `373 permitted allowlisted changes` / `0 unauthorized changes`: the
  other 35 corpus files differ from the base commit only by allowlisted remediation pointers, and no
  other corpus file was edited by hand.

## 7. Landing change set, landed and gated

The landing (all committed together) is: the corpus file + manifest item + the 100 locators; the
harness `DOCS` mapping; the evidence overlay + its report + the regenerated 40-work manifest; the
validator's pinned metadata and the smoke-test pins; the documentation cascade; and the regenerated
metrics/bundle/mirror.

```bash
cp sessions/P1_CONGRONGLU_2026-09-20.json data/corpus/congronglu.json     # sha256 4b5eb6f4…
#   manifest item:  {"key":"congronglu","title":"Book of Serenity (從容錄)","cbeta":"T2004",
#                    "unit_targets":{"cases":100}, "completion_status":"partial_selected_witness",
#                    "source_review_status":"collated_to_claimed_witness"}
#   locators:       sessions/P1_CONGRONGLU_2026-09-20_locators.json merged into
#                   data/canonical_locators.json documents.congronglu (canonical_id "T2004", granularity "case")
#   harness:        'congronglu': (['T48n2004'], []) in scripts/collate_corpus.py DOCS
python3 scripts/record_congronglu_evidence.py        # the authoritative 2026-09-20 overlay
python3 scripts/validate_data.py --write-metrics     # after the evidence amendment
python3 scripts/build_data_bundle.py                 # 36 documents, deterministic size
node scripts/smoke_test.mjs                          # pins updated to 36 / 2026-09-20
```

Gate outputs on the landed tree (verbatim; warnings are the validator's standing advisories, not
errors):

```
$ python3 -m py_compile scripts/*.py
(no output — all scripts compile)

$ python3 scripts/validate_data.py
⚠️  data/lineage/masters.json[30]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  schemas/translatechan-data.schema.json: jsonschema library not installed — declarative schema was not executed this run
⚠️  data/gongan/gongan_index.json[2]: protagonist 'juzhi' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
(… 8 further standing advisories of the same two kinds …)
✅ DATA VALIDATION PASSED
   corpus=36 | slots=1252 | verified=177 | matrix=21 | locators=248/248
   W1 source review: collated=2 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-20 → sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json

$ python3 scripts/build_data_bundle.py   (run twice; second run cmp-identical)
✅ Successfully compiled 36 corpus documents: /home/user/translatechan/app_data.js (2,136,279 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)

$ sha256sum app_data.js
8f52cde376b55b9ce7ab0fcd6ecc970aeb52fe835b364fb8d30c3a4b2393087e  app_data.js

$ python3 scripts/test_source_preservation.py
1 declared new corpus file(s): data/corpus/congronglu.json
373 permitted allowlisted changes
0 unauthorized changes
✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes

$ python3 scripts/test_source_review_rules.py
145 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK

$ node scripts/smoke_test.mjs
DATA loaded. corpus keys: 36
APP executed + init() completed without crash
RENDERER: 36 corpus texts exercised, 0 crashes
W1 source-review rule suite: ✅ W1 SOURCE-REVIEW RULES OK
Source-preservation suite: ✅ SOURCE-PRESERVATION OK: … 0 unauthorized changes
RENDER-LAZY: hidden rooms rendered on first tab activation

✅ SMOKE TEST PASSED
```

Acceptance carried by the lead reviewer, not by this file: commit + push + PR description on
`arena/01a0c065-translatechan`.
Acceptance carried by the lead reviewer, not by this file: commit + push + PR description on
`arena/01a0c065-translatechan`.

## 8. Honest limits

* **No human editorial sign-off.** The containment record's reintroduction gate item 6 ("obtain
  human editorial spot-check/sign-off before public release") is not satisfied; the document's
  locators therefore carry `collated_with_normalization` ("human sign-off pending"), never
  `source_checked_excerpt`.
* **Negative fixtures (gate item 5).** The validator's identical-field guard (a case-specific Chinese
  field repeated across ≥3 cases is an error) and the producer's own contiguity assertions cover
  source duplication and numbering/locator drift inside the document; `scripts/test_source_preservation.py`
  declares the file as the one authorized new corpus file and fails on any other corpus change.
* **Metadata is project-authored.** English and pinyin case titles are drafts, not witness text;
  `title_zh` is the witness heading verbatim (which is why all 101 metadata fields also classify
  EXACT). Of the 492 metadata fields corpus-wide, 299 are non-collating.
* **Front matter and interlinear 著語 are disclosed gaps**, not represented text (§3), and the 100
  cases are not in the gong'an cross-reference index.
* **Scope respected.** No Pages work, no `quality.yml` edit, no new dependency, no `style=`, no new
  `setProperty`, no law text, no other `data/corpus/*.json` edit, and no quarantined record read or
  copied.
