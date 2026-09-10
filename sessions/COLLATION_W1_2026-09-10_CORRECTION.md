# W1 Correction Overlay — Full-Corpus Collation Register, Hash-Verified References (2026-09-10)

**Author:** Arena agent (session `arena/01a08a4f-translatechan`), PR #24 remediation.
**Corrects:** `sessions/COLLATION_W1_2026-09-09.md` and `sessions/COLLATION_REGISTER_2026-09-09.json`.
**Authoritative register for current status:** `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`
(generated 2026-09-10 by `scripts/collate_corpus.py`; digests in
`sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`).
**Status scope:** Containment/remediation state, not a rights decision. Source collation does
not approve reuse.

## 0. Relationship to the 2026-09-09 records (read this first)

The 2026-09-09 report and register are **historical evidence and are append-only**: neither file
has been edited, moved, or re-dated, and both keep their original paths and their original
`2026-09-09` date metadata. This file is a **dated correction overlay**, not a replacement.

Two records now exist, and they answer different questions:

| question | record to read |
|---|---|
| what did W1 claim on 2026-09-09, and on what evidence | `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries) |
| what is the authoritative W1 status of each of the 35 current manifest items, reproducible from committed code | **this** overlay + `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (35 documents, 630 flagged entries) |

The validator merges both records: `scripts/validate_data.py` requires every
`data/corpus_manifest.json` item to have an evidence entry in the union of the two registers, and
requires each declared `source_review_status` to equal the status derived from its register entry.
A status with no evidence record — in either direction, including "absent because the harness
never mapped the document" — fails validation.

## 1. Findings that required a correction

1. **A manifest item had no evidence record at all.** `data/corpus.json` lists 35 documents; the
   2026-09-09 register lists 34. `shitou_sandokai` carries a W1 status in the manifest that was
   inferred from its *absence* in `scripts/collate_corpus.py`'s `DOCS` map. Absence of a harness
   mapping is a containment gap, not evidence, so that inference is withdrawn in §5 and the item is
   now classified from a completed collation.
2. **A headline aggregate was not reproducible.** §3 of the 2026-09-09 report cites "637 entries"
   of flagged fields; the register it points at sums to **622** over the same 34 documents. See §3.
3. **The reference layer was unverifiable in practice.** The 2026-09-09 report describes extraction
   ("`<body>`, skipping `<note>`, keeping `<head>`, by the committed harness") and publishes 187
   SHA-256 digests, but no committed program implements that description: `collate_corpus.py`
   *consumes* `ref_<WorkId>.txt` files and nothing in the repository produces them. Reproduction
   therefore depended on an unrecorded out-of-band step. `scripts/collate_refs.py` now commits the
   rule and the verifier (§4).

Nothing in the public W1 verdict changed as a result of items 2 and 3: the collation was
independently reproduced (§4) and 33 of 34 documents are classification-identical, with **zero**
status changes.

## 2. Flagged-entry reconciliation: 637 → 622 → 623 → 630

| figure | records covered | source | meaning |
|---|---|---|---|
| 637 | 34 documents | 2026-09-09 report §3 | **superseded.** Not reproducible from any committed artifact; it is not the sum of the register it cites. |
| 622 | 34 documents | `sessions/COLLATION_REGISTER_2026-09-09.json`, sum of `flagged` | the actual historical register total, confirmed arithmetically. |
| 623 | 34 documents | 2026-09-10 reproduction over the same 34 documents | 622 + 1: `xinxin_ming .stanzas[14].zh` is now `DIVERGENT` instead of `EXACT` (see §3.1). |
| **630** | **35 documents** | `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` | **authoritative.** 623 + 7 newly recorded `shitou_sandokai` flags. |

Arithmetic is reproduced by `scripts/validate_data.py` from the register files themselves (sum of
per-document `flagged` arrays), never transcribed; the numbers quoted by `README.md`, `AUDIT.md`,
`HANDOFF.md`, `ROADMAP.md`, `.orchestrator/STATE.md` and the built bundle are checked against the
metrics generated from it.

### 2.1 The single classification delta is a harness normalisation difference

`xinxin_ming` stanza 15: the corpus reads `一空同兩齊含萬象不見精粗寧有偏黨`, the pinned CBETA
witness (`T48n2010`) reads the same line with `萬像`. One differing character in sixteen scores
0.9375, which is below the `MINOR` floor (0.98) and inside the `DIVERGENT` band (0.85–0.98). The
committed harness's graphic-variant map has **no** `像`/`象` entry, and adding `VARIANT['像'] = '象'`
reproduces the 2026-09-09 numbers (25 EXACT, 11 DIVERGENT, 13 flagged) exactly. So the difference
comes from the generator, not from corpus data and not from the witness: the historical register
records `"harness": "collate_v2"` while this overlay records `"harness": "scripts/collate_corpus.py"`.

Decisions taken because of that: no `像`/`象` mapping was added (loosening the variant map would
inflate EXACT counts corpus-wide — the opposite of the containment goal); `xinxin_ming` stays
`partial_or_failed_w1_collation` and `excerpt_seed` under either reading, so no public claim moved.

## 3. Reference extraction, pinned upstream, and digest verification

`scripts/collate_refs.py` implements the rule the 2026-09-09 report described, and verifies it:

```
rule id   cbeta-p5-body-cjk-v1
rule      tei:text/tei:body document-order text; drop the subtree of every tei:note and tei:g
          (tails kept); tei:head kept; keep only U+3400-U+9FFF and U+F900-U+FAFF;
          one UTF-8 line, no trailing newline
upstream  https://github.com/cbeta-org/xml-p5 @ dbdea41071e1e260ad84b72faefd4587333cf76d (master, tag 2026R2)
```

Verification results for the 39 works the collator actually reads:

| comparison | verified | drift | unlisted |
|---|---:|---:|---:|
| against `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt` (this overlay's anchor) | 39 | 0 | 0 |
| against `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` (historical anchor) | 33 | 6 | 0 |

The 6 references whose bytes differ from the 2026-09-09 manifest are
`T47n1987B`, `T48n2001`, `X67n1309`, `X68n1315`, `X69n1333`, `X73n1445`. Per-document consequence:
**none** — all 8 documents that read those references reproduce their 2026-09-09 classification
exactly (`reproduction.documents_classification_identical = 33` of 34, `documents_with_changed_status
= 0`); the one difference is §2.1, whose reference is *not* drifted.

Across all 187 manifest works, the single rule above reproduces 80 digests; a variant that also
drops `<head>` text reproduces 157; the per-file union of the two rules reaches 182/187, and 5
works (`T51n2077`, `X67n1309`, `X68n1315`, `X69n1333`, `X73n1445`) match neither rule at any of the
CBETA releases tested (`2026R2`, `2026R1`, `2025R3`, `2024R3`, `2023Q4`). The honest conclusion is
that the 2026-09-09 bundle was built with a **mixed, per-file rule that was never committed**, and
that full byte-parity with it is therefore not recoverable. What *is* recoverable is the collation:
this overlay's rule reproduces 33/34 verdicts and 39/39 of its own digests, and the two documents
whose status the overlay touches at all rest on references verified against **both** anchors.
Claiming "hash-verified" for a reference that only matches one anchor would be exactly the kind of
unbacked claim W1 exists to remove, so `--require-verified-refs` demands both.

## 4. Shitou Sandokai resolution

The 2026-09-09 run never collated `shitou_sandokai`. It is now in the harness
(`DOCS['shitou_sandokai'] = (['T51n2076'], ['X80n1565'])`), matching the document's own
`cbeta_id` claim (`embedded: T2076 f.30 / X1565 f.14`, Taishō vol. 51): the record cites both the
`T51n2076` embedding and `X80n1565`, so **both** are collated as claimed witnesses (neither is demoted
to a probe) and both reference texts are byte-verified against **both** digest anchors (2/2).

| field | class | sim | evidence |
|---|---|---:|---|
| `.sections[0].stanzas[0..4].zh`, `[8].zh` | EXACT | 1.0000 | verbatim in `T51n2076` (傳燈錄卷五 石頭希遷章 Sandokai embedding) |
| `.sections[0].stanzas[5].zh` | DIVERGENT | 0.9667 | edition-graphic difference inside the same passage |
| `.sections[0].stanzas[6].zh` | DIVERGENT | 0.9333 | same |
| `.sections[0].stanzas[7].zh` | DIVERGENT | 0.9500 | same |
| `.sections[0].stanzas[9].zh` | DIVERGENT | 0.9500 | same |
| `.sections[1].stanzas[0].zh` (草庵歌 body) | NOT_FOUND | 0.2381 | absent from `T51n2076` **and** from `X80n1565` |
| `.title_zh` | TITLE_COMPOSITE | 0.4600 | project-authored composite, not a witness heading |
| `.sections[0].title_zh` | SHORT_UNMATCHED | 0.4444 | project-authored section title |
| `.sections[1].title_zh` | EXACT | 1.0000 | 「草庵歌」 is a heading in `T51n2076` |

Reference verification for this item: `refs_verified = 2 / refs_total = 2`, each verified against
`sessions/COLLATION_W1_2026-09-10_refs_manifest.txt` **and** `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt`.

Content fields: 11 measured, 6 collated (55%). Determination:

- `source_review_status = partial_or_failed_w1_collation`.
- **Not** `witness_unavailable`: a claimed witness exists, is cited in the corpus record, was
  fetched from the pinned edition, and 6 of its 11 content fields match it verbatim. The 2026-09-09
  omission must never be read as "no witness exists".
- **Not** `collated_to_claimed_witness`: 5 content fields do not collate, including a whole second
  section (`草庵歌`) present in the corpus document and absent from both witnesses checked.
- `completion_status` stays `excerpt_seed` (as declared in the manifest before this overlay), so
  `effective_completion_status()` and the five-ledger Reader disclosure need no change for this item;
  the translation rights record (`translations.red_pine.status = reconstruction_unverified`) is
  untouched — see §6.
- The document's own `coverage_note` claim that the Grass Hut song is "present here for teaching
  context" is now supported by evidence rather than assumption: it is genuinely not in either
  witness, which is why the entry carries a `witness_note` recording exactly that.

## 5. Recomputed status counts (from evidence, not transcribed)

Derived from the merged evidence for all 35 manifest items by `source_review.derive_status()`:

| status | count | documents |
|---|---:|---|
| `collated_to_claimed_witness` | 1 | `zhengdao_ge` |
| `partial_or_failed_w1_collation` | 32 | everything else with a claimed witness, including `shitou_sandokai`, `wumenguan`, `xinxin_ming` |
| `witness_unavailable` | 2 | `hanshan_poems`, `niutou_juezhu` (no CBETA witness claimed in the corpus record) |

The 2026-09-09 manifest's counts (1/32/2) are **confirmed, not carried over**: they were
re-derived from the 2026-09-10 register, which is the first register to cover all 35 items. No
item's status was changed by this overlay; `shitou_sandokai`'s status stays
`partial_or_failed_w1_collation`, but is now backed by a completed collation of both its witnesses
instead of by a missing mapping.

The denominator for a status is **source content only** (`zh`, `verse_zh`, `commentary_zh`,
`pointer_zh`). Title/name fields (`title_zh`, `name_zh`) are measured and reported separately
(391 metadata fields, 299 of them non-collating) because they are predominantly project-authored
composites. Consequence, stated plainly: `collated_to_claimed_witness` means every *source content*
field of that document collates to the claimed witness. It is **not** proof that excluded metadata
fields were collated — `zhengdao_ge` is the worked example, since its `title_zh` is `NOT_FOUND`
against `T48n2014` and it is still `collated_to_claimed_witness`. It is also never a rights
approval.

## 6. Invariants preserved by this correction

- No corpus source-Chinese field was reconstructed, re-keyed, deleted, or invented; `data/corpus/*`
  is byte-identical to the pre-correction branch except for `coverage_note` wording where the task
  required it.
- No translation text, edition-verification record, or rights decision was changed; R-A/R-B/R-C
  per-document remediation and W2 auditing were not started.
- `sessions/COLLATION_W1_2026-09-09.md`, `sessions/COLLATION_REGISTER_2026-09-09.json`, and
  `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` are unmodified.
- Reference texts (21 MB) stay out of the repository; only the digest manifests — the 39-line
  authoritative list and the 187-line historical anchor — and the rule that regenerates them are
  committed.
- The public interface remains the same five rooms; no localStorage key, CSP, room scope, or
  runtime API changed; `.github/workflows/*` and `.scoreboard/*` untouched.

## 7. How to reproduce this overlay

```bash
# 1. pinned reference edition (git protocol; the raw CDN is unreachable from this sandbox)
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
git -C /tmp/xmlp5 fetch --depth 1 origin dbdea41071e1e260ad84b72faefd4587333cf76d
git -C /tmp/xmlp5 checkout dbdea41071e1e260ad84b72faefd4587333cf76d 2>/dev/null || true
# work id T45n1858 -> path /T/T45/T45n1858.xml ; patterns must be passed as argv
# (this sandbox's git has no --from-file for sparse-checkout set, and --cone ignores patterns)
python3 scripts/collate_corpus.py --print-refs > /tmp/needed.txt
while read -r w; do printf '/%s/%s/%s.xml\n' "${w:0:1}" "${w:0:3}" "$w"; done \
  < /tmp/needed.txt > /tmp/needed_paths.txt
git -C /tmp/xmlp5 sparse-checkout set --no-cone $(tr '\n' ' ' < /tmp/needed_paths.txt)
git -C /tmp/xmlp5 checkout

# 2. extract the 39 reference texts and publish the digest manifest (must be byte-identical)
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
  --work-list sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
  --write-digest-manifest /tmp/refs/refs_manifest.txt
cmp /tmp/refs/refs_manifest.txt sessions/COLLATION_W1_2026-09-10_refs_manifest.txt   # silent = identical
# 2b. measure upstream drift against the historical (2026-09-09) anchor. With only the 39 needed
#     works checked out the expected finding is "33 verified, 6 drift, 0 unlisted, 148 unavailable":
#     the 148 are historical works this harness no longer reads, listed as unavailable rather than
#     as a mismatch. --allow-drift keeps the 6 upstream revisions a report instead of a failure.
python3 scripts/collate_refs.py --verify-against sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
  --refs-dir /tmp/refs --allow-drift

# 3. regenerate the register: --reproduce replays the generation parameters the register itself
#    records, so the documented command and the committed bytes cannot drift apart.
#    committed register  sha256 5369af1163e55eb25e2695160a0ec04805efc13a606841a6d6cb19b1936d3d31
#    committed refs manifest sha256 f3ac90b2ae9c7b969f157185d83651bcb00c24e535a0ef1f5ac143c4aa8174a9
COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py \
  --out /tmp/register.json --reproduce sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json
cmp /tmp/register.json sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json
sha256sum sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json \
          sessions/COLLATION_W1_2026-09-10_refs_manifest.txt

# 4. evidence checks
python3 scripts/validate_data.py            # merges both registers, re-derives every status
python3 scripts/smoke_test.mjs              # includes scripts/test_source_review_rules.py
```

The from-scratch equivalent of step 3 spells every flag out; the values below are exactly what the
committed register records in `generation_parameters`, including the two operator notes quoted from
`reproduction.operator_notes`:

```bash
COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py \
  --out /tmp/register.json --generated 2026-09-10 --kind w1-correction \
  --corrects sessions/COLLATION_REGISTER_2026-09-09.json \
  --refs-manifest sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
  --compare-register sessions/COLLATION_REGISTER_2026-09-09.json \
  --historical-report-flagged 637 --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
  --require-verified-refs --note "<operator note 1>" --note "<operator note 2>"
```

Every note and flag is therefore part of the evidence file, not a re-typable incantation: `--reproduce`
reads them back out of the register, so a reviewer who changes one gets a different file rather than a
silent mismatch, and the two operator notes stay verbatim. Everything else in the register — every
class count, every digest, every status, every aggregate — is computed from the corpus JSON, the
pinned CBETA revision, and the two digest manifests, and is never transcribed from the manifest,
the metrics, `app_data.js`, or the documents.
