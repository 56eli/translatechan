# W1 Correction Overlay — the re-keyed Record of Linji (T47n1985) (2026-09-21)

**Author:** Arena agent (session `arena/01a0c4aa-translatechan`), task P2.9 ("Linji Yulu proper
re-key — most pressing"), under the dispatch that asked for the purged Linji retelling to be
replaced by a verbatim extraction of its claimed witness, with field-level collation and no
imperfections.
**Corrects:** `sessions/COLLATION_W1_2026-09-09.md` and `sessions/COLLATION_REGISTER_2026-09-09.json`.
**Inherits:** `sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json` — the 12 per-document
entries in this overlay are that record's entries, unchanged (see §1 and §5).
**Authoritative register for current status:** `sessions/COLLATION_REGISTER_2026-09-21_LINJI.json`
(generated 2026-09-21 by `scripts/record_linji_evidence.py`, whose register-level blocks are
produced by `scripts/collate_corpus.py`'s own functions; digests in
`sessions/COLLATION_W1_2026-09-21_LINJI_refs_manifest.txt`). Committed bytes: register sha256
`5b014b875771d6afceca60ba6ece2c06e4334c7b650b6a6a22f9cc925f59b444`, reference manifest sha256
`8d96cf264567d8f4230976d785bf4e8e5255d2b6002568170f8363332bd6c5db`.
**Status scope:** Containment/remediation state, not a rights decision. Source collation does not
approve reuse.

## 0. Relationship to the earlier records (read this first)

The 2026-09-09 report/register, the 2026-09-10 correction overlay, the 2026-09-20 Congrong Lu,
Chuandeng Lu and Caoshan Benji overlays and the 2026-09-21 enthusiast-fulls overlay are
**historical evidence and are append-only**: none of those files has been edited, moved, or
re-dated, and they keep their original paths and date metadata. This file is a **new dated
overlay**, not a replacement. The 637 flagged-entry figure in the 2026-09-09 report was already
**superseded** by its own register (622 entries) and stays recorded as superseded here as well.

| question | record to read |
|---|---|
| what did W1 claim on 2026-09-09, and on what evidence | `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries) — the 637 figure in the 2026-09-09 report prose is superseded by that same register |
| what the 2026-09-10 overlay corrected | `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` + `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (35 documents, 630 flagged entries) |
| what the 2026-09-20 overlays added | `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json`, `…_CHUANDENGLU_FULL.json`, `…_CAOSHAN_BENJI.json` (36 → 38 documents) |
| what the 2026-09-21 enthusiast-fulls overlay added | `sessions/COLLATION_W1_2026-09-21_ENTHUSIAST_100PCT.md` + `…_ENTHUSIAST_100PCT.json` |
| what is the authoritative W1 status of each of the 13 current manifest items | **this** overlay + `sessions/COLLATION_REGISTER_2026-09-21_LINJI.json` (13 documents, 15 flagged entries) |

## 1. What this overlay adds, and what it deliberately does not re-measure

This overlay adds **one document entry**, appended verbatim from one measured run of
`scripts/collate_corpus.py --doc linji_yulu` (committed as
`sessions/COLLATION_REGISTER_2026-09-21_LINJI_MEASUREMENT.json`): `linji_yulu`.

The 12 inherited entries are **not re-measured**. Re-measuring already-recorded documents would
move their measured classes and re-designate the evidence, which the standing rulings forbid; the
inherited entries are the enthusiast-fulls overlay's own entries, byte for byte.

The reference layer changes by exactly one line: the authoritative digest manifest is the
previous 17-work manifest **plus `T47n1985`** (18 works,
`sessions/COLLATION_W1_2026-09-21_LINJI_refs_manifest.txt`). That extraction's digest
(`4317e5fa14996b3f414187adb4264f1d52efb303392402f797d6e2019aeb8359`, 16,366 CJK characters) is
byte-identical to the entry the historical 2026-09-09 manifest already carries for the same work,
so **no new-document waiver is used**: the historical register already covered this document
(`witness: T47n1985`, 164 fields, 84 flagged entries, `partial_or_failed_w1_collation`), and this
overlay records the status move instead of hiding it behind a waiver. The register's
`generation_parameters.new_documents` list is therefore unchanged (the nine earlier waivers).

## 2. Flagged-entry reconciliation: 637 → 622, and the two totals this overlay stands on

The figures this overlay has to reconcile, with what each is:

| flagged entries | documents | what it measures | standing |
|---:|---:|---|---|
| **637** | 34 documents | the 2026-09-09 report's prose claim, contradicted by its own register | **superseded** |
| 622 | 34 documents | the historical 2026-09-09 register's flagged total | historical evidence, append-only |
| 15 | 34 documents | the four documents this overlay and the historical register share (`hanshan_poems`, `linji_yulu`, `niutou_juezhu`, `zhengdao_ge`), re-derived from the authoritative register | recorded, not a supersession |
| **15** | 13 documents | this overlay's authoritative register total | authoritative |

The reconciliation figures are computed, not transcribed: the historical register's per-document
`flagged` arrays sum to 622; the authoritative register's 13 documents sum to 15 flags (one
`NOT_FOUND` and fourteen `WITNESS_UNAVAILABLE` classes); the four-document overlap sums to 99 in the
historical register and 15 in this one, which is exactly the arithmetic of the Linji re-key (84
flagged entries left with the purged retelling) on top of the unchanged historical entries.

The earlier chain's figures stay where they were recorded and are not re-designated here: the
2026-09-10 overlay's reproduction summed to 623 over the same 34 documents, and the 2026-09-21
enthusiast-fulls register summed to the designated 630 over the 44 documents then present — the
document set the 2026-09-21 purge later removed (32 retellings). Nothing in this overlay
de-designates 630: it stays the published register's figure, and the owner's 2026-09-12 ruling
that the post-remediation pass does not supersede it stands. What this overlay changes is the
measurement of the active 13-document corpus, and it changes it in one place only: the re-keyed
Record of Linji, whose entry carries 0 flags.

## 3. Reference extraction, pinned upstream, and digest verification

The rule is unchanged (`scripts/collate_refs.py`, `cbeta-p5-body-cjk-v1`):

```
rule id   cbeta-p5-body-cjk-v1
rule      tei:text/tei:body document-order text; drop the subtree of every tei:note and tei:g
          (tails kept); tei:head kept; keep only U+3400-U+9FFF and U+F900-U+FAFF;
          one UTF-8 line, no trailing newline
upstream  https://github.com/cbeta-org/xml-p5 @ dbdea41071e1e260ad84b72faefd4587333cf76d
          (the witness file T/T47/T47n1985.xml sha256
          d095b9ca7e7b0c4818541889f16ae07bfbee04ff5812a7aa94c5108190c113d5, 138,324 bytes)
```

Verification results for the 18 works the collator actually reads:

| comparison | verified | drift | unlisted |
|---|---:|---:|---:|
| against `COLLATION_W1_2026-09-21_LINJI_refs_manifest.txt` (this overlay's anchor) | 18 | 0 | 0 |
| against `COLLATION_W1_2026-09-09_refs_manifest.txt` (historical anchor) | 14 | 4 | 0 |

The reference set is **the previous 17-work manifest plus one line** (`T47n1985`), and that line is
byte-identical to the historical anchor's entry, so `linji_yulu`'s claimed witness records
`historical_status = 'verified'` — unlike the four references whose bytes differ from the
2026-09-09 manifest (`T47n1987B`, `T48n2001`, `T48n2004`, `X68n1315`), the list of record since
2026-09-10 and unchanged by this overlay. Probes `X68n1315`, `T51n2076` and `X80n1565` are carried
for `linji_yulu`; `X68n1315` (the Guzunsu yulu printing of the same master's record) carries
historical drift as it already did for its other claimants, and a probe cannot move a class.
Re-extraction reproduces every digest in the manifest byte-for-byte from the pinned checkout
(`references: 18 work(s)` / `digest verification: 17 verified, 0 drift, 1 unlisted` against the
17-work manifest, `18 verified, 0 drift, 0 unlisted` against this one). Across all 187 manifest
works, the 2026-09-10 analysis stands: the historical bundle was built with a mixed per-file rule
that was never committed, so full byte-parity with it is not recoverable.

## 4. The re-keyed document, and the nine overlay-only records

**The producer.** `scripts/segment_linji_yulu.py` is the deterministic, witness-only producer for
this document (its only inputs are the pinned witness file — sha256-checked — and its
digest-verified reference extraction). It walks `tei:text/tei:body` counting CJK exactly as the
pinned rule serializes it, opens a unit boundary at every `p`, every `div` lead, both 卷 headings
and the body ends, and asserts at run time that (a) the boundaries tile the whole extraction
`[0, 16366)` contiguously, (b) the concatenation of the 107 section texts equals the reference
extraction character for character, and (c) the region bounds, region CJK count, unit count and
both digests match the **frozen pins** in the producer — so a witness-byte or upstream-structure
change fails the run instead of silently re-partitioning a published record. A rerun reproduces
`data/corpus/linji_yulu.json` byte for byte (sha256
`d1004987b6e9c886b58a6a6ea13a3f692c4037db424116d54cee7d15c70eb419`).

**The document** (`linji_yulu`, T47n1985, 16,366 CJK): Content fields: 107 measured,
107 collated, refs_verified = 1 / refs_total = 1, all EXACT, 0 flagged. 107 sections tiling the
whole fascicle — 4 序 prefaces (18 sections), the fascicle heading (1), the record body (39:
1 heading + 38 paragraphs), 勘辨 (24: 1 heading + 23 paragraphs), 行錄 (22: 1 heading + 21
paragraphs), the fascicle close (1) and the printing colophon (2). `title_zh` is the witness's own
目録/`jhead` text where it prints one and otherwise the section's first 12 CJK characters (verbatim
runs, never paraphrases — 108 metadata fields, all EXACT); the dialogue `zh` is the section's whole
text. Where the earlier Linji locator pilot named a passage, the section id is curated
(`true_person_of_no_rank`, `four_shouts`, `conduct_record_biography`, `death_record`) so the
project's existing anchors land on the same witness ranges; all 107 `lb`-anchored section locators
are published in `data/canonical_locators.json → documents.linji_yulu.unit_locators`
(`sessions/P2_LINJI_YULU_2026-09-21_locators.json`).

**The nine overlay-only records** — documents the historical register never covered, inherited
verbatim from the earlier overlays and not re-measured here (their lines state their own measured
figures):

| document | measured figures (one cell, so the figures sit beside the document name) |
|---|---|
| `congronglu` (T48n2004) — Content fields: 500 measured, 500 collated; refs_verified = 1 / refs_total = 1 |
| `chuandenglu_full` (T51n2076) — Content fields: 1274 measured, 1274 collated; refs_verified = 1 / refs_total = 1 |
| `caoshan_benji` (T47n1987A) — Content fields: 84 measured, 84 collated; refs_verified = 1 / refs_total = 1 |
| `huangbo_fayao_full` (T48n2012A) — Content fields: 19 measured, 19 collated; refs_verified = 1 / refs_total = 1 |
| `mazu_guanglu_full` (X69n1321) — Content fields: 35 measured, 35 collated; refs_verified = 1 / refs_total = 1 |
| `yunmen_guanglu_full` (T47n1988) — Content fields: 776 measured, 776 collated; refs_verified = 1 / refs_total = 1 |
| `dongshan_yulu_full` (T47n1986A + T47n1986B) — Content fields: 322 measured, 322 collated; refs_verified = 2 / refs_total = 2 |
| `zhaozhou_yulu_full` (X68n1315) — Content fields: 80 measured, 80 collated; refs_verified = 1 / refs_total = 1 |
| `dahui_yulu_full` (T47n1998A + T47n1998B) — Content fields: 1354 measured, 1354 collated; refs_verified = 2 / refs_total = 2 |

## 5. Recomputed status counts (from evidence, not transcribed)

Derived from the merged evidence for all 13 manifest items by `source_review.derive_status()`:

| status | count | documents |
|---|---:|---|
| `collated_to_claimed_witness` | 11 | `zhengdao_ge`, `congronglu`, `chuandenglu_full`, `caoshan_benji`, `linji_yulu`, and the six 2026-09-21 full-witness records |
| `partial_or_failed_w1_collation` | 0 | none |
| `witness_unavailable` | 2 | `hanshan_poems`, `niutou_juezhu` (no CBETA witness claimed in the corpus record) |

Field totals over the 13 entries: **8,733 total fields**, **4,566 content fields**, **4,557
collated content fields**, **4,167 metadata fields, 6 of them non-collating** (the surviving
`WITNESS_UNAVAILABLE` content fields of the two witness-unavailable seeds are measured, counted and
reported separately, and never proof of collation). The denominator for a status is **source
content only** (`zh`, `verse_zh`, `commentary_zh`, `pointer_zh`); title/name fields (`title_zh`,
`name_zh`) never make a document complete. `collated_to_claimed_witness` means every *source
content* field of that document collates to the claimed witness — for this overlay's document,
107 of 107, every one verbatim in the pinned witness. It is not a rights approval and not a
completion claim: `linji_yulu` stays `partial_selected_witness`; `corpus.complete_documents`
remains empty. Reproduction against the 2026-09-09 historical register (the harness's own
reconciliation code): documents_classification_identical = 3 of 4 compared,
documents_with_changed_status = 1 — `linji_yulu`, `partial_or_failed_w1_collation` (84 flagged
entries, 80 of 164 fields EXACT on the retelling) → `collated_to_claimed_witness` (0 flagged, 215
of 215 fields EXACT on the witness). The other three compared documents reproduce
classification-identical; the historical report's 637 is recorded as superseded and not
reproduced.

## 6. Reproduction

```bash
# 1. acquire the pinned witness (git protocol; raw CDN may be blocked in sandboxes)
git clone --filter=blob:none --no-checkout --depth 1 \
    https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
cd /tmp/xmlp5
sed 's/.*  ref_//; s/\.txt$//' repo/sessions/COLLATION_W1_2026-09-21_LINJI_refs_manifest.txt \
    | while read -r w; do printf '/%s/%s/%s.xml\n' "${w:0:1}" "${w:0:3}" "$w"; done > /tmp/paths.txt
git sparse-checkout set --no-cone $(tr '\n' ' ' < /tmp/paths.txt) && git checkout
git rev-parse HEAD   # must be dbdea41071e1e260ad84b72faefd4587333cf76d

# 2. extract and verify the 18 references
python3 repo/scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --work-list repo/sessions/COLLATION_W1_2026-09-21_LINJI_refs_manifest.txt \
    --verify-against repo/sessions/COLLATION_W1_2026-09-21_LINJI_refs_manifest.txt \
    --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d

# 3. regenerate the document (asserts the tiling, the digests and the pinned geometry)
cd repo && python3 scripts/segment_linji_yulu.py --source-dir /tmp/xmlp5 --refs-dir /tmp/refs \
    --out data/corpus/linji_yulu.json \
    --locators-out sessions/P2_LINJI_YULU_2026-09-21_locators.json \
    --report sessions/P2_LINJI_YULU_2026-09-21_extraction_report.json

# 4. measure the document (byte-identical output expected)
COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc linji_yulu \
    --out sessions/COLLATION_REGISTER_2026-09-21_LINJI_MEASUREMENT.json --generated 2026-09-21 \
    --refs-manifest sessions/COLLATION_W1_2026-09-21_LINJI_refs_manifest.txt \
    --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
    --compare-register sessions/COLLATION_REGISTER_2026-09-09.json \
    --historical-report-flagged 637 --kind w1-correction \
    --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d --require-verified-refs

# 5. regenerate the overlay (inherits the 12 entries, appends the measured one, recomputes the
#    register-level blocks with the harness's own functions); byte-identical output expected
python3 scripts/record_linji_evidence.py

# 6. the corpus-level gates
python3 scripts/validate_data.py --write-metrics --skip-docs && python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py && python3 scripts/build_data_bundle.py
diff -rq data docs/data
```

## 7. What this overlay does not claim

It does not claim the corpus is complete or that any document is a `complete_selected_witness`:
`complete_documents` stays empty — 13 active documents, 11 of them collated to their claimed
witness, is still not a finished corpus, and this document's manifest item stays
`partial_selected_witness`. It does not claim editorial sign-off: the section locators carry
`collated_with_normalization`, i.e. character-level collation measured and **human sign-off still
pending**, and the section `title_en`/`speaker` labels plus the four curated section ids are
project-authored metadata, not witness text. It does not claim the excluded metadata was collated
(the title/name fields are measured in a separate partition, as §5 says), it does not claim the
witness's dropped interlinear apparatus was represented, and it does not claim any other printing
of the record was consulted as a witness. It softens no prior finding: every flagged entry the
earlier registers recorded still stands in this register (15 active), the 2026-09-09 report's 637
stays superseded, and the purged retelling's own record — 0 of 6 fields collating, three 行錄
retellings labelled project text — stays on the historical chain with its witness_note. And it
grants no rights: witness text carries the pinned extraction's edition, not permission to reuse.
