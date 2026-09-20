# W1 Correction Overlay — Congrong Lu Reinstatement, Hash-Verified References (2026-09-20)

**Author:** Arena agent (session `arena/01a0c065-translatechan`), task 043, under the owner's
2026-09-20 ruling that authorised this evidence-model extension.
**Corrects:** `sessions/COLLATION_W1_2026-09-09.md` and `sessions/COLLATION_REGISTER_2026-09-09.json`.
**Inherits:** `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` — the 35 per-document entries in
this overlay are that record's entries, unchanged (see §1 and §6).
**Authoritative register for current status:** `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json`
(generated 2026-09-20 by `scripts/record_congronglu_evidence.py`, whose register-level blocks are
produced by `scripts/collate_corpus.py`'s own functions; digests in
`sessions/COLLATION_W1_2026-09-20_refs_manifest.txt`).
**Status scope:** Containment/remediation state, not a rights decision. Source collation does not
approve reuse.

## 0. Relationship to the earlier records (read this first)

The 2026-09-09 report/register and the 2026-09-10 correction overlay/refs manifest are **historical
evidence and are append-only**: none of those files has been edited, moved, or re-dated, and they keep
their original paths and date metadata. This file is a **new dated overlay**, not a replacement.

| question | record to read |
|---|---|
| what did W1 claim on 2026-09-09, and on what evidence | `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries) |
| what did the 2026-09-10 overlay correct, and how the 35 documents measured then | `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` + `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (35 documents, 630 flagged entries) |
| what is the authoritative W1 status of each of the 36 current manifest items | **this** overlay + `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json` (36 documents, 630 flagged entries) |

The validator merges the two registers: `scripts/validate_data.py` requires each of the 36 current
manifest items to have an evidence entry in the union of the historical register and this overlay, and
requires each declared `source_review_status` to equal the status derived from that entry. A status
with no evidence record — in either direction, including "absent because the harness never mapped the
document" — fails validation.

## 1. What this overlay adds, and what it deliberately does not re-measure

One document enters the active corpus: **`congronglu`** (《從容錄》, the Book of Serenity), quarantined
on 2026-08-10 and rebuilt from scratch out of the pinned CBETA witness `T48n2004` (upstream
`dbdea41071e1e260ad84b72faedf4587333cf76d`). It is recorded here as `collated_to_claimed_witness`:
Content fields: 500 measured, 500 collated, refs_verified = 1 / refs_total = 1 against the
authoritative manifest. Nothing in this paragraph is a completion claim: the document's English and
pinyin titles are project-authored metadata, and the witness's front matter and interlinear 著語
apparatus are unrepresented gaps disclosed in its own `coverage_note`/`cbeta_note`.

Two things this overlay does **not** do, on purpose:

1. **It does not re-measure the 35 existing documents.** Their entries are inherited from the
   2026-09-10 overlay unchanged. The corpus has been re-keyed since that run (PRs #29, #30, #32, #34,
   #35 and the later RE-KEY campaign), so a fresh full-corpus collation today would move several
   documents' *measured* classes — a re-designation of the evidence, not a cleanup, and exactly what
   the standing rulings forbid. The inheritance is mechanical and readable in the diff: 35 entries
   unchanged, 1 appended.
2. **It does not move the designated flagged total.** `congronglu` contributes **0** flagged fields,
   so the authoritative total stays **630**; only the document count moves, 35 → 36. "630 is the
   register, 486 is today's data as measured" therefore keeps both its numbers and its meaning — the
   new measurement is published as a measurement, never as a replacement register.

The 2026-09-10 overlay's own overlay-only document, `shitou_sandokai`, keeps its entry unchanged here:
Content fields: 11 measured, 6 collated, refs_verified = 2 / refs_total = 2, status
`partial_or_failed_w1_collation` (its 草庵歌 body is absent from both of its witnesses). Nothing about
that document was re-decided by this overlay; its figures are restated only because this report must
describe every document the authoritative register holds that the historical register does not.

The new entry is the harness's own measurement, not a transcription. Its provenance, all committed:

| file | what it is | sha256 |
|---|---|---|
| `data/corpus/congronglu.json` | the landed document (100 cases, 84,654 content CJK) | `4b5eb6f4723d14362dbd8e74ef31080e30f234097c24edeeccc8ce74e1e4d0d6` |
| `sessions/COLLATION_REGISTER_2026-09-20_CONGONGLU_CANDIDATE.json` | the pre-landing measurement of the candidate (no historical comparison supplied) | — |
| `sessions/COLLATION_REGISTER_2026-09-20_CONGONGLU_MEASUREMENT.json` | the same document measured again after it landed, with the historical comparison and the declared waiver; **this** entry is what the overlay records, plus the advisory `witness_note` of §4 | `5c09858f15cbae74e55a9fbea10043143e5d57b5b56d7be52778709d295e0d8e` |

The two measurements agree on every evaluated field; they differ only in the reference-anchor columns
the candidate run did not supply (`historical_status: none` there, `drift` here).

## 2. Flagged-entry reconciliation: 637 → 622 → 623 → 630

| figure | records covered | source | meaning |
|---|---|---|---|
| 637 | 34 documents | 2026-09-09 report §3 | **superseded.** Not reproducible from any committed artifact; it is not the sum of the register it cites. |
| 622 | 34 documents | `sessions/COLLATION_REGISTER_2026-09-09.json`, sum of `flagged` | the historical register total, confirmed arithmetically. |
| 623 | 34 documents | this overlay's reproduction over the same 34 documents | 622 + 1: `xinxin_ming .stanzas[14].zh` is `DIVERGENT` rather than `EXACT` (§2.1 of the 2026-09-10 overlay documents the normalisation difference). |
| **630** | **36 documents** | `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json` | **authoritative.** 623 + 7 recorded `shitou_sandokai` flags + **0** from the new `congronglu` entry. |

The reproduction block is recomputed by the validator from the two registers themselves:
`documents_classification_identical = 33` of 34, `documents_with_changed_status = 0`, flagged entries
622 → 623 over the compared documents.

## 3. Reference extraction, pinned upstream, and digest verification

The rule is unchanged (`scripts/collate_refs.py`, `cbeta-p5-body-cjk-v1`):

```
rule id   cbeta-p5-body-cjk-v1
rule      tei:text/tei:body document-order text; drop the subtree of every tei:note and tei:g
          (tails kept); tei:head kept; keep only U+3400-U+9FFF and U+F900-U+FAFF;
          one UTF-8 line, no trailing newline
upstream  https://github.com/cbeta-org/xml-p5 @ dbdea41071e1e260ad84b72faefd4587333cf76d
          (T/T48/T48n2004.xml sha256 838d8713596a7f53502d0e290801b123cb05a5fa09078a893a122b6668e37649)
```

Verification results for the 40 works the collator actually reads:

| comparison | verified | drift | unlisted |
|---|---:|---:|---:|
| against `sessions/COLLATION_W1_2026-09-20_refs_manifest.txt` (this overlay's anchor) | 40 | 0 | 0 |
| against `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` (historical anchor) | 33 | 7 | 0 |

The 7 references whose bytes differ from the 2026-09-09 manifest are `T47n1987B`, `T48n2001`,
**`T48n2004`**, `X67n1309`, `X68n1315`, `X69n1333`, `X73n1445` — the 2026-09-10 list plus the new
document's reference. Six of them belong to documents the historical register already covered, whose
classifications and statuses reproduce unchanged; `T48n2004` is adjudicated in §4.

Re-extraction reproduces every digest in the new manifest byte-for-byte from the pinned checkout
(`references: 40 work(s)` / `digest verification: 40 verified, 0 drift, 0 unlisted, 0 unavailable`),
which is how the 39 previously verified references were confirmed not to move when the 40th was added.
Across all 187 manifest works, the 2026-09-10 analysis stands: the historical bundle was built with a
mixed per-file rule that was never committed, so full byte-parity with it is not recoverable, and five
works (`T51n2077`, `X67n1309`, `X68n1315`, `X69n1333`, `X73n1445`) match neither committed rule at any
CBETA release tested.

## 4. The Congrong Lu reinstatement, and the one declared anchor exception

**The document.** `congronglu` is a new extraction from the pinned witness: 100 cases (`pointer_zh`
垂示, `dialogue[0].zh` 本則, `commentary_zh` 評唱, `verse_zh` 頌, `verse_commentary.commentary_zh` 頌後評唱,
plus the witness's `head` verbatim as `title_zh`), 84,654 content CJK characters, **601 fields
measured, 601 EXACT, 0 flagged** (500 source content + 101 metadata). Case locators anchor at the `lb`
line head printed *before* each case div — the convention the 2026-08-10 containment table recorded —
and reproduce all five of its anchors exactly (33 `p0249b21`, 34 `p0250a10`, 35 `p0250b19`, 37
`p0252a03`, 38 `p0252b28`) where the quarantined record's case-number and page claims were disproved.
No quarantined Congrong Lu record was read or copied: the producer's only input is the pinned witness
file, and every field is asserted to be a contiguous run of that extraction (100/100 cases at run
time, plus the five containment anchors above as a second, independent check). The entry carries a
`witness_note` recording this and the anchor caveat below.

**The exception, stated in the open.** The document's reference has **no historical anchor**: the
2026-09-09 manifest lists a `T48n2004` line whose digest is
`06d8ef7f44a1c51cef7af5ea9b98539cf23050b1e91b594947eab4226ee736e8`, and the committed rule does not
reproduce it from any CBETA revision tested (the 2026-08-10 containment record retrieved a different
master revision — `5899ca8f50ae9c1f3d9328424e2cc40187c96a4d6805e5b19239b3bfc5580457` — which is the
most plausible reading of that line: the 2026-08-10 pass read a pre-`2026R2` file whose text differs
from the pinned revision). Three adjudications were weighed:

1. **Treat the line as this document's historical anchor and refuse the collated claim.** Rejected:
   the 2026-09-09 pass never covered this document, so the line is an artifact of an earlier extraction,
   not evidence about *this* collation.
2. **Silently drop the line or rewrite it to the pinned digest.** Rejected outright: dated evidence is
   append-only, and re-dating or rewriting it is what this ledger exists to prevent.
3. **Record the drift truthfully and declare the waiver explicitly.** Chosen, under the owner's
   2026-09-20 ruling. The register records `historical_status = 'drift'` for `T48n2004`, lists
   `congronglu` under `aggregate.documents_with_drifted_references`, and declares the document in
   `generation_parameters.new_documents`.

The policy sentence this suspends is: *"a drifted or unlisted reference never upgrades a W1 status"* —
a collated claim whose claimed witness reference is not byte-verified against **both** digest anchors
was a validation failure. That rule stops a drifted reference from *rescuing* a weak claim, and it is
unchanged for every document the historical register already covered. It cannot apply to a document the
historical pass predates: no anchor for it could exist there, and reading the absence as a failed
collation would mislabel a document whose every represented field is verbatim in the pinned witness.
So for declared keys only:

* the historical state is recorded truthfully (`drift`/`unlisted`/`none`), never rewritten to
  `verified`, and stays visible in the aggregate's drifted-reference list;
* the authoritative (pinned) anchor must still verify byte-identically — a document whose pinned
  reference does not verify is a failure, waiver or not;
* the declaration is checked: a key the historical register already covers may not carry it, and a key
  named that is not in the register at all fails validation;
* every other document keeps the strict both-anchor rule, and a `--reproduce` replay of an overlay that
  declares no new documents behaves exactly as before.

That is the whole change: `--new-document` in `scripts/collate_corpus.py` (which passes the run gate
and prints a warning), the matching check in `scripts/w1_evidence.py`, and regression fixtures in
`scripts/test_source_review_rules.py` pinning both directions — the live overlay declares exactly
`['congronglu']`, dropping the declaration fails with the both-anchor rule named, and declaring a
document the historical register already covers fails too.

## 5. Recomputed status counts (from evidence, not transcribed)

Derived from the merged evidence for all 36 manifest items by `source_review.derive_status()`:

| status | count | documents |
|---|---:|---|
| `collated_to_claimed_witness` | 2 | `zhengdao_ge`, `congronglu` |
| `partial_or_failed_w1_collation` | 32 | everything else with a claimed witness, including `shitou_sandokai`, `wumenguan`, `xinxin_ming` |
| `witness_unavailable` | 2 | `hanshan_poems`, `niutou_juezhu` (no CBETA witness claimed in the corpus record) |

Field totals over the 36 entries: **1,916 total fields**, **1,424 content fields**, **1,093 collated
content fields**, **492 metadata fields, 299 of them non-collating** (mostly `title_zh` composites —
measured and reported separately, and never proof of collation). The denominator for a status is
**source content only** (`zh`, `verse_zh`, `commentary_zh`, `pointer_zh`); title/name fields (`title_zh`,
`name_zh`) never make a document complete. `collated_to_claimed_witness` means every *source content*
field of that document collates to the claimed witness — for `congronglu`, 500 of 500, with the anchor
caveat of §4 disclosed in the document's own `cbeta_note` and in this report. It is not a rights
approval and not a completion claim: `congronglu` stays `partial_selected_witness`, and its front matter
and the witness's interlinear 著語 apparatus are disclosed gaps rather than represented text.

## 6. Invariants preserved by this correction

- No existing corpus file was edited. `data/corpus/*` differs from the base commit exactly by the new
  `congronglu.json` (plus the `docs/data/corpus/` mirror the bundle build writes), declared in
  `scripts/test_source_preservation.py` as the one new document; 373 allowlisted remediation pointers
  across the other 35 files reproduce unchanged, 0 unauthorized changes.
- The 2026-09-09 register/report/manifest and the 2026-09-10 overlay/report/manifest are byte-identical
  to their committed versions; this overlay is a new file with a new date.
- No translation text, edition-verification record, or rights decision was changed.
- Reference texts (21 MB) stay out of the repository; only the digest manifests (the 40-line
  authoritative list and the 187-line historical anchor) and the rule that regenerates them are
  committed.
- `.github/workflows/*` untouched (the retired `quality.yml` text-integrity check is not revived); no
  Pages work; no new runtime dependency; no secret.

## 7. Committed digests and how to reproduce this overlay

```
sha256(sessions/COLLATION_W1_2026-09-20_refs_manifest.txt)      00854fc9c6b6df988ba2e1e1e6f34420b74c738d6b5d1e2730a970c9532fc4a1
sha256(sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json)  215bad6526d10b5d0811b910309bab2c92cc6ffa54d129e532346467846af5ca
sha256(data/corpus/congronglu.json)                             4b5eb6f4723d14362dbd8e74ef31080e30f234097c24edeeccc8ce74e1e4d0d6
```

```bash
# 1. the pinned reference edition (git protocol; the raw CDN may be unreachable from a sandbox)
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
git -C /tmp/xmlp5 fetch --depth 1 origin dbdea41071e1e260ad84b72faefd4587333cf76d
git -C /tmp/xmlp5 checkout dbdea41071e1e260ad84b72faefd4587333cf76d

# 2. extract + verify the 40 references the harness reads (must print 40 verified, 0 drift)
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --from-digest-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt --require-verified

# 3. measure the reinstated document on its own — this reproduces the overlay's new entry
python3 scripts/collate_corpus.py --doc congronglu --refs-dir /tmp/refs \
    --refs-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt \
    --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
    --require-verified-refs --new-document congronglu --generated 2026-09-20 \
    --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
    --kind w1-congronglu-reinstatement-measurement \
    --out sessions/COLLATION_REGISTER_2026-09-20_CONGONGLU_MEASUREMENT.json

# 4. regenerate the overlay (inherits the 35 entries, appends the measured one, recomputes the
#    register-level blocks with the harness's own functions); byte-identical output expected
python3 scripts/record_congronglu_evidence.py

# 5. the corpus-level gates
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
node scripts/smoke_test.mjs
```

## 8. What this overlay does not claim

The reinstated document is not a completed scholarly edition: no human editorial sign-off exists, its
front matter and interlinear 著語 apparatus are not represented, its English and pinyin titles are
project metadata, and its 100 cases are not yet indexed in the gong'an cross-reference index. Every one
of those limits is stated in the document's own `coverage_note`/`cbeta_note` and in
`sessions/P1_CONGRONGLU_2026-09-20.md`. And as everywhere in W1: **source collation does not approve
reuse.**
