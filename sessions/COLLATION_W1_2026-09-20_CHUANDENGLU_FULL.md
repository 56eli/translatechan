# W1 Correction Overlay — Full 30-Fascicle Jingde Chuandeng Lu, Hash-Verified References (2026-09-20)

**Author:** Arena agent (session `arena/01a0c0eb-translatechan`), task 045 (P1-2), under the
dispatch that authorised the full-document ingestion of the 30-fascicle Jingde Chuandeng Lu.
**Corrects:** `sessions/COLLATION_W1_2026-09-09.md` and `sessions/COLLATION_REGISTER_2026-09-09.json`.
**Inherits:** `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json` — the 36 per-document entries
in this overlay are that record's entries, unchanged (see §1 and §6).
**Authoritative register for current status:** `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json`
(generated 2026-09-20 by `scripts/record_chuandenglu_evidence.py`, whose register-level blocks are
produced by `scripts/collate_corpus.py`'s own functions; digests in
`sessions/COLLATION_W1_2026-09-20_refs_manifest.txt`).
**Status scope:** Containment/remediation state, not a rights decision. Source collation does not
approve reuse.

## 0. Relationship to the earlier records (read this first)

The 2026-09-09 report/register, the 2026-09-10 correction overlay/refs manifest, and the 2026-09-20
Congrong Lu overlay are **historical evidence and are append-only**: none of those files has been
edited, moved, or re-dated, and they keep their original paths and date metadata. This file is a
**new dated overlay**, not a replacement.

| question | record to read |
|---|---|
| what did W1 claim on 2026-09-09, and on what evidence | `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries) |
| what the 2026-09-10 overlay corrected, and how the 35 documents measured then | `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` + `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (35 documents, 630 flagged entries) |
| what the 2026-09-20 overlay added, the Congrong Lu reinstatement | `sessions/COLLATION_W1_2026-09-20_CORRECTION.md` + `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json` (36 documents, 630 flagged entries) |
| what is the authoritative W1 status of each of the 37 current manifest items | **this** overlay + `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json` (37 documents, 630 flagged entries) |

The validator merges the two registers: `scripts/validate_data.py` requires each of the 37 current
manifest items to have an evidence entry in the union of the historical register and this overlay,
and requires each declared `source_review_status` to equal the status derived from that entry. A
status with no evidence record — in either direction, including "absent because the harness never
mapped the document" — fails validation.

## 1. What this overlay adds, and what it deliberately does not re-measure

One document enters the active corpus: **`chuandenglu_full`** (《景德傳燈錄》, the Transmission of
the Lamp, all 30 fascicles), extracted from scratch out of the pinned CBETA witness `T51n2076`
(upstream `dbdea41071e1e260ad84b72faefd4587333cf76d`). It is recorded here as
`collated_to_claimed_witness`: Content fields: 1274 measured, 1274 collated, refs_verified = 1 /
refs_total = 1 against the authoritative manifest, and its reference verifies byte-identically
against the historical manifest as well — so, unlike the Congrong Lu case, no anchor waiver is
needed for it; the declaration in `generation_parameters.new_documents` records only that the
document itself is newer than the historical pass. Nothing in this paragraph is a completion claim:
the document carries source text and structure only, no translations, and its unit model
(§4) is a verbatim partition, not a scholarly edition.

Two things this overlay does **not** do, on purpose:

1. **It does not re-measure the 36 existing documents.** Their entries are inherited from the
   2026-09-20 overlay unchanged. A fresh full-corpus collation today would move several documents'
   *measured* classes — a re-designation of the evidence, not a cleanup, and exactly what the
   standing rulings forbid. The inheritance is mechanical and readable in the diff: 36 entries
   unchanged, 1 appended.
2. **It does not move the designated flagged total.** `chuandenglu_full` contributes **0** flagged
   fields, so the authoritative total stays **630**; only the document count moves, 36 → 37.

The earlier overlays' overlay-only documents keep their entries unchanged here. `congronglu`
(2026-09-20): Content fields: 500 measured, 500 collated, refs_verified = 1 / refs_total = 1,
status `collated_to_claimed_witness` (its `T48n2004` historical-anchor drift stays recorded and
waived exactly as that report's §4 documents). `shitou_sandokai` (2026-09-10): Content fields:
11 measured, 6 collated, refs_verified = 2 / refs_total = 2, status `partial_or_failed_w1_collation`
(its 草庵歌 body is absent from both of its witnesses). Nothing about either document was re-decided
by this overlay; their figures are restated only because this report must describe every document
the authoritative register holds that the historical register does not.

The new entry is the harness's own measurement, not a transcription. Its provenance, all committed:

| file | what it is | sha256 |
|---|---|---|
| `data/corpus/chuandenglu_full.json` | the landed document (1,274 units tiling all 30 fascicles, 350,269 CJK) | `325f7c62cd4d3037ff3a4c436b8efc503509e1ae892cb14a1f388ef7a3145d76` |
| `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL_MEASUREMENT.json` | the harness measurement of the landed document, with the historical comparison; **this** entry is what the overlay records, plus the advisory `witness_note` of §4 | `afdc91fb73b912f4f1526e8c77ec98b03574761783063fee624a30a3b318bb68` |

The producer's staging artifacts (`data/staging/chuandenglu_full.json` plus the locators and
extraction report) are byte-identical to the landed corpus file's content partition and are the
reproducible working state of `scripts/segment_chuandenglu.py`.

## 2. Flagged-entry reconciliation: 637 → 622 → 623 → 630

| figure | records covered | source | meaning |
|---|---|---|---|
| 637 | 34 documents | 2026-09-09 report §3 | **superseded.** Not reproducible from any committed artifact; it is not the sum of the register it cites. |
| 622 | 34 documents | `sessions/COLLATION_REGISTER_2026-09-09.json`, sum of `flagged` | the historical register total, confirmed arithmetically. |
| 623 | 34 documents | this overlay's reproduction over the same 34 documents | 622 + 1: `xinxin_ming .stanzas[14].zh` is `DIVERGENT` rather than `EXACT` (§2.1 of the 2026-09-10 overlay documents the normalisation difference). |
| **630** | **37 documents** | `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json` | **authoritative.** 623 + 7 recorded `shitou_sandokai` flags + **0** from `congronglu` + **0** from the new `chuandenglu_full` entry. |

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
          (T/T51/T51n2076.xml sha256 41e4717ce9c71ff6892f8a83d6a28438cf67a1dc09e8e938165b1222daa9e40e)
```

Verification results for the 40 works the collator actually reads:

| comparison | verified | drift | unlisted |
|---|---:|---:|---:|
| against `sessions/COLLATION_W1_2026-09-20_refs_manifest.txt` (this overlay's anchor) | 40 | 0 | 0 |
| against `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` (historical anchor) | 33 | 7 | 0 |

The 7 references whose bytes differ from the 2026-09-09 manifest are `T47n1987B`, `T48n2001`,
`T48n2004`, `X67n1309`, `X68n1315`, `X69n1333`, `X73n1445` — the list of record since 2026-09-10,
unchanged by this overlay. Six of them belong to documents the historical register already covered,
whose classifications and statuses reproduce unchanged; `T48n2004` remains adjudicated in §4 of
the 2026-09-20 overlay. The new document's reference `T51n2076` verifies byte-identically against
**both** anchors (the 2026-09-09 manifest already lists the same digest, `a860907e…`), so it
contributes no drift and needs no waiver.

Re-extraction reproduces every digest in the manifest byte-for-byte from the pinned checkout
(`references: 40 work(s)` / `digest verification: 40 verified, 0 drift, 0 unlisted, 0
unavailable`), which is how the previously verified references were confirmed not to move. Across
all 187 manifest works, the 2026-09-10 analysis stands: the historical bundle was built with a
mixed per-file rule that was never committed, so full byte-parity with it is not recoverable, and
five works (`T51n2077`, `X67n1309`, `X68n1315`, `X69n1333`, `X73n1445`) match neither committed
rule at any CBETA release tested.

## 4. The full-document ingest, and the two declared new documents

**The document.** `chuandenglu_full` is a new extraction from the pinned witness: the deterministic
producer `scripts/segment_chuandenglu.py` reads only the pinned witness file (and its
digest-verified reference) and partitions the 30-fascicle region — 350,269 CJK characters, from
the 卷一 opening mark to the 卷三十 close — into **1,274 contiguous units: 971 biography
entries, 69 titled works, and 234 sections** (fascicle headings, tables of contents, and
generation lists). The partition tiles the region exactly at run time; the only overlaps are the
13 titled sub-verses the witness itself nests inside its multi-part works (770 CJK characters,
each listed in the committed extraction report), which are counted inside their parent works and
re-emitted as named sub-units rather than hidden. The document's own text is verbatim:
**2,549 fields measured, 2,549 EXACT, 0 flagged** (1,274 source content + 1,275 metadata). Case
locators anchor at the `lb` line head printed before each unit, with the last `lb` inside the unit
as its closing line — the convention the 2026-08-10 containment table recorded.

The true inventory, stated rather than force-fit: the book's later summaries count **1,701 persons
listed, 951 of them with records (機緣警句), roughly 750 listed-only (有名無文)**. This census
finds 971 biography units — 961 in fascicles 1–26 (957 distinct masters: four masters are recorded
again under a later generation, including the 臨濟義玄 repeat that the witness itself prints in
both fascicle 12 and the fascicle 13 opening) plus the 10 傳燈錄 Chan dharma-heirs of fascicle 27.
The difference between 957 and the book's 951 is recorded in the report
`sessions/P1_CHUANDENGLU_FULL_2026-09-20.md` and is not papered over. The sibling excerpt record
`data/corpus/chuandenglu.json` (T2076/51, two sample records) is untouched; nothing was copied
from it.

**The new-document declarations, stated in the open.** The register's
`generation_parameters.new_documents` is `['congronglu', 'chuandenglu_full']` — cumulative: the
2026-09-20 overlay's `congronglu` declaration stays, because the both-anchor rule reads the waiver
only from *this* register's parameters, and `chuandenglu_full` is added because the historical pass
predates the document. The policy sentence this declaration suspends is: *"a drifted or unlisted
reference never upgrades a W1 status."* For `congronglu` it is load-bearing (its `T48n2004`
historical anchor is a recorded `drift`); for `chuandenglu_full` it is declarative only, since its
`T51n2076` reference verifies against both anchors (`historical_status = 'verified'`). The rule is
unchanged for every document the historical register covers, the pinned anchor must still verify
byte-identically for a declared key, and a declared key the historical register already covers
fails validation. The regression fixtures in `scripts/test_source_review_rules.py` pin the
cumulative list, the failure on dropping it, and the failure on a false declaration.

## 5. Recomputed status counts (from evidence, not transcribed)

Derived from the merged evidence for all 37 manifest items by `source_review.derive_status()`:

| status | count | documents |
|---|---:|---|
| `collated_to_claimed_witness` | 3 | `zhengdao_ge`, `congronglu`, `chuandenglu_full` |
| `partial_or_failed_w1_collation` | 32 | everything else with a claimed witness, including `shitou_sandokai`, `wumenguan`, `xinxin_ming` |
| `witness_unavailable` | 2 | `hanshan_poems`, `niutou_juezhu` (no CBETA witness claimed in the corpus record) |

Field totals over the 37 entries: **4,465 total fields**, **2,698 content fields**, **2,367
collated content fields**, **1,767 metadata fields, 299 of them non-collating** (mostly
`title_zh` composites — measured and reported separately, and never proof of collation). The
denominator for a status is **source content only** (`zh`, `verse_zh`, `commentary_zh`,
`pointer_zh`); title/name fields (`title_zh`, `name_zh`) never make a document complete.
`collated_to_claimed_witness` means every *source content* field of that document collates to the
claimed witness — for `chuandenglu_full`, 1,274 of 1,274, every one verbatim in the pinned
witness. It is not a rights approval and not a completion claim: `chuandenglu_full` stays
`partial_selected_witness`.

## 6. Invariants preserved by this correction

- No existing corpus file was edited. `data/corpus/*` differs from the base commit exactly by the
  two new documents, `congronglu.json` and `chuandenglu_full.json` (plus the `docs/data/corpus/`
  mirror the bundle build writes), both declared in `scripts/test_source_preservation.py`; the
  allowlisted remediation pointers across the other 35 files reproduce unchanged, 0 unauthorized
  changes.
- The 2026-09-09 register/report/manifest, the 2026-09-10 overlay/report/manifest, and the
  2026-09-20 Congrong Lu overlay/report are byte-identical to their committed versions; this
  overlay is a new file with a new date.
- No translation text, edition-verification record, or rights decision was changed.
- Reference texts (21 MB) stay out of the repository; only the digest manifests (the 40-line
  authoritative list and the 187-line historical anchor) and the rule that regenerates them are
  committed.
- `.github/workflows/*` untouched (the retired `quality.yml` text-integrity check is not revived);
  no Pages work; no new runtime dependency; no secret.

## 7. Committed digests and how to reproduce this overlay

```
sha256(sessions/COLLATION_W1_2026-09-20_refs_manifest.txt)               00854fc9c6b6df988ba2e1e1e6f34420b74c738d6b5d1e2730a970c9532fc4a1
sha256(sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json)     d891e040a8a8b44ed3777dc18ce3df88c6c390428432df68f2c33458a261c077
sha256(sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL_MEASUREMENT.json) afdc91fb73b912f4f1526e8c77ec98b03574761783063fee624a30a3b318bb68
sha256(data/corpus/chuandenglu_full.json)                                325f7c62cd4d3037ff3a4c436b8efc503509e1ae892cb14a1f388ef7a3145d76
```

```bash
# 1. the pinned reference edition (git protocol; the raw CDN may be unreachable from a sandbox)
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
git -C /tmp/xmlp5 fetch --depth 1 origin dbdea41071e1e260ad84b72faefd4587333cf76d
git -C /tmp/xmlp5 checkout dbdea41071e1e260ad84b72faefd4587333cf76d

# 2. extract + verify the 40 references the harness reads (must print 40 verified, 0 drift)
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --from-digest-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt --require-verified

# 3. partition the witness into the corpus document (asserts the exact tiling at run time)
python3 scripts/segment_chuandenglu.py --source-dir /tmp/xmlp5 \
    --ref /tmp/refs/ref_T51n2076.txt --out data/staging/chuandenglu_full.json \
    --locators-out data/staging/chuandenglu_full_locators.json \
    --report data/staging/chuandenglu_full_extraction_report.json
cp data/staging/chuandenglu_full.json data/corpus/chuandenglu_full.json
#    (merge the staging case locators into data/canonical_locators.json; 248 -> 1,522)

# 4. measure the landed document — this reproduces the overlay's new entry
python3 scripts/collate_corpus.py --doc chuandenglu_full --refs-dir /tmp/refs \
    --refs-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt \
    --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
    --require-verified-refs --new-document chuandenglu_full --generated 2026-09-20 \
    --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
    --kind w1-chuandenglu-full-measurement \
    --out sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL_MEASUREMENT.json

# 5. regenerate the overlay (inherits the 36 entries, appends the measured one, recomputes the
#    register-level blocks with the harness's own functions); byte-identical output expected
python3 scripts/record_chuandenglu_evidence.py

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
sign-off; its unit model is a verbatim partition of the witness, and its English titles are
project metadata. Every one of those limits is stated in the document's own `coverage_note` and in
`sessions/P1_CHUANDENGLU_FULL_2026-09-20.md`. And as everywhere in W1: **source collation does not
approve reuse.**
