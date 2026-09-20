# W1 Correction Overlay — Caoshan Benji's Record from the Pinned T47n1987A Witness (2026-09-20)

**Author:** Arena agent (session `arena/01a0c128-translatechan`), task 046 (P1-3), under the
dispatch that authorised the Caoshan Benji ingest — the last of the Five Houses' founders missing
from the corpus.
**Corrects:** `sessions/COLLATION_W1_2026-09-09.md` and `sessions/COLLATION_REGISTER_2026-09-09.json`.
**Inherits:** `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json` — the 37 per-document
entries in this overlay are that record's entries, unchanged (see §1 and §6).
**Authoritative register for current status:** `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json`
(generated 2026-09-20 by `scripts/record_caoshan_evidence.py`, whose register-level blocks are
produced by `scripts/collate_corpus.py`'s own functions; digests in
`sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI_refs_manifest.txt`).
**Status scope:** Containment/remediation state, not a rights decision. Source collation does not
approve reuse.

## 0. Relationship to the earlier records (read this first)

The 2026-09-09 report/register, the 2026-09-10 correction overlay/refs manifest, the 2026-09-20
Congrong Lu overlay and the 2026-09-20 Chuandeng Lu overlay are **historical evidence and are
append-only**: none of those files has been edited, moved, or re-dated, and they keep their original
paths and date metadata. This file is a **new dated overlay**, not a replacement.

| question | record to read |
|---|---|
| what did W1 claim on 2026-09-09, and on what evidence | `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries) |
| what the 2026-09-10 overlay corrected, and how the 35 documents measured then | `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` + `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (35 documents, 630 flagged entries) |
| what the 2026-09-20 overlay added, the Congrong Lu reinstatement | `sessions/COLLATION_W1_2026-09-20_CORRECTION.md` + `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json` (36 documents, 630 flagged entries) |
| what the 2026-09-20 Chuandeng Lu overlay added | `sessions/COLLATION_W1_2026-09-20_CHUANDENGLU_FULL.md` + `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json` (37 documents, 630 flagged entries) |
| what is the authoritative W1 status of each of the 38 current manifest items | **this** overlay + `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json` (38 documents, 630 flagged entries) |

The validator merges the two registers: `scripts/validate_data.py` requires each of the 38 current
manifest items to have an evidence entry in the union of the historical register and this overlay,
and requires each declared `source_review_status` to equal the status derived from that entry. A
status with no evidence record — in either direction, including "absent because the harness never
mapped the document" — fails validation.

## 1. What this overlay adds, and what it deliberately does not re-measure

One document enters the active corpus: **`caoshan_benji`** (《撫州曹山元證禪師語錄》, the Taishō
record of Caoshan Benji 曹山本寂, 840–901, Dongshan Liangjie's heir and the second founder of the
Caodong 曹洞 house), extracted from scratch out of the pinned CBETA witness `T47n1987A` (upstream
`dbdea41071e1e260ad84b72faefd4587333cf76d`). It is recorded here as `collated_to_claimed_witness`:
Content fields: 84 measured, 84 collated, refs_verified = 1 / refs_total = 1 against the
authoritative manifest, and its reference verifies byte-identically against the historical manifest
as well — so, as with the Chuandeng Lu ingest and unlike the Congrong Lu case, no anchor waiver is
needed for it; the declaration in `generation_parameters.new_documents` records only that the
document itself is newer than the historical pass. Nothing in this paragraph is a completion claim:
the document carries source text and structure only, no translations, and its unit model (§4) is a
verbatim partition, not a scholarly edition.

Two things this overlay does **not** do, on purpose:

1. **It does not re-measure the 37 existing documents.** Their entries are inherited from the
   2026-09-20 Chuandeng Lu overlay unchanged. A fresh full-corpus collation today would move several
   documents' *measured* classes — a re-designation of the evidence, not a cleanup, and exactly what
   the standing rulings forbid. The inheritance is mechanical and readable in the diff: 37 entries
   unchanged, 1 appended.
2. **It does not move the designated flagged total.** `caoshan_benji` contributes **0** flagged
   fields, so the authoritative total stays **630**; only the document count moves, 37 → 38.

The earlier overlays' overlay-only documents keep their entries unchanged here. `congronglu`
(2026-09-20): Content fields: 500 measured, 500 collated, refs_verified = 1 / refs_total = 1, status
`collated_to_claimed_witness` (its `T48n2004` historical-anchor drift stays recorded and waived
exactly as that report's §4 documents). `chuandenglu_full` (2026-09-20): Content fields: 1274
measured, 1274 collated, refs_verified = 1 / refs_total = 1, status `collated_to_claimed_witness`.
`shitou_sandokai` (2026-09-10): Content fields: 11 measured, 6 collated, refs_verified = 2 /
refs_total = 2, status `partial_or_failed_w1_collation` (its 草庵歌 body is absent from both of its
witnesses). Nothing about those documents was re-decided by this overlay; their figures are restated
only because this report must describe every document the authoritative register holds that the
historical register does not.

The new entry is the harness's own measurement, not a transcription. Its provenance, all committed:

| file | what it is | sha256 |
|---|---|---|
| `data/corpus/caoshan_benji.json` | the landed document (84 units tiling the whole fascicle, 12,343 CJK) | `3a790e52c461f3a7cadcf69150d82978b84b0b9c3b31e0256998c886a1da5d71` |
| `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI_MEASUREMENT.json` | the harness measurement of the landed document, with the historical comparison; **this** entry is what the overlay records, plus the advisory `witness_note` of §4 | `a96f16204506bc641f4cb336b2174d5d1c39da0b073e1f7c258f0f76bbaed999` |

The producer's staging artifacts (`data/staging/caoshan_benji.json` plus the locator map and
extraction report) are byte-identical to the landed corpus file's content partition and are the
reproducible working state of `scripts/segment_caoshan_benji.py`; they are not committed.

## 2. Flagged-entry reconciliation: 637 → 622 → 623 → 630

| figure | records covered | source | meaning |
|---|---|---|---|
| 637 | 34 documents | 2026-09-09 report §3 | **superseded.** Not reproducible from any committed artifact; it is not the sum of the register it cites. |
| 622 | 34 documents | `sessions/COLLATION_REGISTER_2026-09-09.json`, sum of `flagged` | the historical register total, confirmed arithmetically. |
| 623 | 34 documents | this overlay's reproduction over the same 34 documents | 622 + 1: `xinxin_ming .stanzas[14].zh` is `DIVERGENT` rather than `EXACT` (§2.1 of the 2026-09-10 overlay documents the normalisation difference). |
| **630** | **38 documents** | `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json` | **authoritative.** 623 + 7 recorded `shitou_sandokai` flags + **0** from `congronglu` + **0** from `chuandenglu_full` + **0** from the new `caoshan_benji` entry. |

The reproduction block is recomputed by the validator from the two registers themselves:
`documents_classification_identical = 33` of 34, `documents_with_changed_status = 0`, flagged
entries 622 → 623 over the compared documents.

## 3. Reference extraction, pinned upstream, and digest verification

The rule is unchanged (`scripts/collate_refs.py`, `cbeta-p5-body-cjk-v1`):

```
rule id   cbeta-p5-body-cjk-v1
rule      tei:text/tei:body document-order text; drop the subtree of every tei:note and tei:g
          (tails kept); tei:head kept; keep only U+3400-U+9FFF and U+F900-U+FAFF;
          one UTF-8 line, no trailing newline
upstream  https://github.com/cbeta-org/xml-p5 @ dbdea41071e1e260ad84b72faefd4587333cf76d
          (T/T47/T47n1987A.xml sha256 d0d0336d02c420f9b614be9a138322eb2ff4870853c5c8ac4afdca00342d1cfe)
```

Verification results for the 41 works the collator actually reads:

| comparison | verified | drift | unlisted |
|---|---:|---:|---:|
| against `sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI_refs_manifest.txt` (this overlay's anchor) | 41 | 0 | 0 |
| against `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` (historical anchor) | 34 | 7 | 0 |

The manifest grew by exactly one work with this task: **`T48n2006`** (人天眼目, 晦巖智昭 1188) enters
as a *probe* of `caoshan_benji`, because its 曹洞宗 section carries a parallel recension of the
record's 五位君臣旨訣 passage (the passage is printed there with 曹山 named as the answerer: 僧問曹山
五位君臣旨訣…). A probe only annotates `also_in`; it never claims a field, never contributes to
`content_fields_collated`, and its digest `11024c5f5bc0852ab5fad1cfcefc1459a6033f4de05f7e844dc3809e7a95c558`
is byte-identical to the 2026-09-09 manifest line 117 — so the reference set grew by one work and by
zero drift. The previous 40 works are unchanged; the previous 40-line manifest
(`sessions/COLLATION_W1_2026-09-20_refs_manifest.txt`, sha256
`00854fc9c6b6df988ba2e1e1e6f34420b74c738d6b5d1e2730a970c9532fc4a1`) stays committed and unmodified.

The 7 references whose bytes differ from the 2026-09-09 manifest are `T47n1987B`, `T48n2001`,
`T48n2004`, `X67n1309`, `X68n1315`, `X69n1333`, `X73n1445` — the list of record since 2026-09-10,
unchanged by this overlay. Six of them belong to documents the historical register already covered,
whose classifications and statuses reproduce unchanged; `T48n2004` remains adjudicated in §4 of the
2026-09-20 Congrong Lu overlay. The new document's own reference `T47n1987A` verifies byte-identically
against **both** anchors (the historical manifest already lists the same digest, `cdb2f4e2…`), so it
contributes no drift and needs no anchor waiver. Two of the document's probes (`T47n1987B`,
`X68n1315`) do carry historical drift as reference bytes; that is recorded in the entry's
`reference_verification` and changes nothing, because a probe cannot move a class — the drifted
document list in the aggregate is unchanged.

Re-extraction reproduces every digest in the manifest byte-for-byte from the pinned checkout
(`references: 41 work(s)` / `digest verification: 41 verified, 0 drift, 0 unlisted, 0 unavailable`).
Across all 187 manifest works, the 2026-09-10 analysis stands: the historical bundle was built with
a mixed per-file rule that was never committed, so full byte-parity with it is not recoverable, and
five works (`T51n2077`, `X67n1309`, `X68n1315`, `X69n1333`, `X73n1445`) match neither committed rule
at any CBETA release tested.

## 4. The Caoshan Benji ingest, and the three declared new documents

**The document.** `caoshan_benji` is a new extraction from the pinned witness: the deterministic
producer `scripts/segment_caoshan_benji.py` reads only the pinned witness file (and its
digest-verified reference) and partitions the fascicle — 12,343 CJK characters, from the preface's
目録 line to the closing heading — into **84 contiguous units**: 1 preface (`cb:div type="xu"`), 1
opening-heading unit (the `cb:juan` jhead 撫州曹山元證禪師語錄 plus the byline 遠孫沙門慧印校訂), **75
record units** (one per direct `p` of the main record div: the biography 師諱本寂…, the 五位君臣旨訣
passage, and the individual encounters — 雲門, 智炬, 金峯志, 鏡清, 紙衣道者, 陸亙大夫, 溈山 … down to
the master's death record 師於天復辛酉夏夜…諡元證禪師), **6 treatise units** (解釋洞山五位顯訣,
逐位頌竝注別揀, 五位旨訣, 三種墮, 四種異類, 三然燈 — each whole, carrying its own 目録 title, head and,
where the witness prints one, an editorial byline), and 1 closing unit. The producer asserts at run
time that the concatenation of the unit texts equals the pinned reference extraction character for
character; there are no overlaps, no gaps and no invented runs. The document's own text is verbatim:
**169 fields measured, 169 EXACT, 0 flagged** (84 source content + 85 metadata — the 84 unit texts and
the 85 `title_zh` fields, the root title among them). Unit locators anchor at the `lb` line head
printed before each unit, with the last `lb` inside the unit as its closing line.

Two witness details, recorded rather than smoothed over: (a) the closing `jhead` prints the title
plus the woodblock end-marker 終, and 終 sits inside an inline `tei:note` (place="inline") in the
pinned file, so the pinned rule drops it — the document's closing unit carries the title and no 終,
which is the extraction rule's output, not a loss in transcription; (b) three of the six treatises
print an editorial `byline` (自下本光重編 inside 解釋洞山五位顯訣), which is witness text and is
carried verbatim inside its unit. The witness's interlinear apparatus (the 卍續-CB and 大 collation
notes, 42 `tei:note` elements in this file) is dropped by the pinned rule and is not represented;
that is disclosed in the document's own `coverage_note`.

**What is not ingested, stated in the open.** The sibling part of the same Taishō number,
`T47n1987B` 撫州曹山本寂禪師語錄 (the Japanese 曹洞語錄 recension, three juan), is *not* claimed or
represented here; it is carried as a probe. Nor is any material borrowed from the anthologies that
also print Caoshan records (`X68n1315` 古尊宿語錄, `T51n2076` 景德傳燈錄). This document is the
1987A record, whole, and nothing else. Its record-unit `title_zh` values are the units' own first 12
CJK characters — verbatim prefixes, chosen by the project because the witness prints those
paragraphs without headings — and every `title_en` and `speaker` is project-authored metadata; the
document's `coverage_note` says so.

**The new-document declarations, stated in the open.** The register's
`generation_parameters.new_documents` is `['congronglu', 'chuandenglu_full', 'caoshan_benji']` —
cumulative: the earlier overlays' declarations stay, because the both-anchor rule reads the waiver
only from *this* register's parameters, and `caoshan_benji` is added because the historical pass
predates the document. The policy sentence this declaration suspends is: *"a drifted or unlisted
reference never upgrades a W1 status."* For `congronglu` it is load-bearing (its `T48n2004`
historical anchor is a recorded `drift`); for `chuandenglu_full` and `caoshan_benji` it is declarative
only, since both references verify against both anchors (`historical_status = 'verified'`). The rule
is unchanged for every document the historical register covers, the pinned anchor must still verify
byte-identically for a declared key, and a declared key the historical register already covers fails
validation. The regression fixtures in `scripts/test_source_review_rules.py` pin the cumulative list,
the failure on dropping it, and the failure on a false declaration.

## 5. Recomputed status counts (from evidence, not transcribed)

Derived from the merged evidence for all 38 manifest items by `source_review.derive_status()`:

| status | count | documents |
|---|---:|---|
| `collated_to_claimed_witness` | 4 | `zhengdao_ge`, `congronglu`, `chuandenglu_full`, `caoshan_benji` |
| `partial_or_failed_w1_collation` | 32 | everything else with a claimed witness, including `shitou_sandokai`, `wumenguan`, `xinxin_ming` |
| `witness_unavailable` | 2 | `hanshan_poems`, `niutou_juezhu` (no CBETA witness claimed in the corpus record) |

Field totals over the 38 entries: **4,634 total fields**, **2,782 content fields**, **2,451 collated
content fields**, **1,852 metadata fields, 299 of them non-collating** (mostly `title_zh` composites
— measured and reported separately, and never proof of collation). The denominator for a status is
**source content only** (`zh`, `verse_zh`, `commentary_zh`, `pointer_zh`); title/name fields
(`title_zh`, `name_zh`) never make a document complete. `collated_to_claimed_witness` means every
*source content* field of that document collates to the claimed witness — for `caoshan_benji`, 84 of
84, every one verbatim in the pinned witness. It is not a rights approval and not a completion
claim: `caoshan_benji` stays `partial_selected_witness`.

## 6. Invariants preserved by this correction

- No existing corpus file was edited. `data/corpus/*` differs from the base commit exactly by the
  three new documents, `congronglu.json`, `chuandenglu_full.json` and `caoshan_benji.json` (plus the
  `docs/data/corpus/` mirror the bundle build writes), all declared in
  `scripts/test_source_preservation.py`; the allowlisted remediation pointers across the other 35
  files reproduce unchanged, 0 unauthorized changes.
- The 2026-09-09 register/report/manifest, the 2026-09-10 overlay/report/manifest, the 2026-09-20
  Congrong Lu overlay/report and the 2026-09-20 Chuandeng Lu overlay/report, measurement register
  and 40-line refs manifest are byte-identical to their committed versions; this overlay is a new
  file with a new date.
- No translation text, edition-verification record, or rights decision was changed.
- Reference texts (21 MB) stay out of the repository; only the digest manifests (the new 41-line
  authoritative list, the superseded 40-line list, and the 187-line historical anchor) and the rule
  that regenerates them are committed.
- `.github/workflows/*` untouched (the retired `quality.yml` text-integrity check is not revived);
  no Pages work; no new runtime dependency; no secret.

## 7. Committed digests and how to reproduce this overlay

```
sha256(sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI_refs_manifest.txt) 9d5c107460226f540b27059a2460b0a988dad0dccabf045fedb1b84fe8893fa8
sha256(sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json)        920f659eae898c6028ccdd0913f4ba1980d4c0162c629b579bcecea33301e63b
sha256(sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI_MEASUREMENT.json) a96f16204506bc641f4cb336b2174d5d1c39da0b073e1f7c258f0f76bbaed999
sha256(data/corpus/caoshan_benji.json)                                    3a790e52c461f3a7cadcf69150d82978b84b0b9c3b31e0256998c886a1da5d71
```

```bash
# 1. the pinned reference edition (git protocol; the raw CDN may be unreachable from a sandbox)
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
git -C /tmp/xmlp5 fetch --depth 1 origin dbdea41071e1e260ad84b72faefd4587333cf76d
git -C /tmp/xmlp5 checkout dbdea41071e1e260ad84b72faefd4587333cf76d

# 2. extract + verify the 41 references the harness reads (must print 41 verified, 0 drift)
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --from-digest-manifest sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI_refs_manifest.txt --require-verified

# 3. partition the witness into the corpus document (asserts the exact tiling at run time)
python3 scripts/segment_caoshan_benji.py --source-dir /tmp/xmlp5 \
    --ref /tmp/refs/ref_T47n1987A.txt --out data/staging/caoshan_benji.json \
    --locators-out data/staging/caoshan_benji_locators.json \
    --report data/staging/caoshan_benji_extraction_report.json
cp data/staging/caoshan_benji.json data/corpus/caoshan_benji.json
#    (merge the staging unit locators into data/canonical_locators.json; 1,522 -> 1,606)

# 4. measure the landed document — this reproduces the overlay's new entry
python3 scripts/collate_corpus.py --doc caoshan_benji --refs-dir /tmp/refs \
    --refs-manifest sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI_refs_manifest.txt \
    --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
    --require-verified-refs --new-document caoshan_benji --generated 2026-09-20 \
    --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
    --kind w1-caoshan-benji-measurement \
    --out sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI_MEASUREMENT.json

# 5. regenerate the overlay (inherits the 37 entries, appends the measured one, recomputes the
#    register-level blocks with the harness's own functions); byte-identical output expected
python3 scripts/record_caoshan_evidence.py

# 6. the corpus-level gates
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
node scripts/smoke_test.mjs
```

## 8. What this overlay does not claim

The ingested document is not a completed scholarly edition: it carries no translations, no
page-level locators (the project's pages work remains out of scope), and no human editorial
sign-off; its unit model is a verbatim partition of the witness, and its English titles are project
metadata. Every one of those limits is stated in the document's own `coverage_note` and in
`sessions/P1_CAOSHAN_BENJI_2026-09-20.md`. The document is the T47n1987A record only: the master's
sayings as the sibling Taishō part (1987B) and the later anthologies print them are cross-referenced
as probes, not merged, and the project's existing `dongshan_yulu` record — whose five_ranks
commentaries are paraphrase-labeled — is left exactly as it stands. And as everywhere in W1:
**source collation does not approve reuse.**
