# W1 Correction Overlay — the six enthusiast full-witness documents (T48n2012A, X69n1321, T47n1988, T47n1986A+B, X68n1315, T47n1998A+B) (2026-09-21)

**Author:** Arena agent (session `arena/01a0c15b-translatechan`), task 050 (P2, "Enthusiast 100%
closer"), under the dispatch that asked for full-record ingestion of the six founder/major-record
gaps with field-level collation above 80%.
**Corrects:** `sessions/COLLATION_W1_2026-09-09.md` and `sessions/COLLATION_REGISTER_2026-09-09.json`.
**Inherits:** `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json` — the 38 per-document
entries in this overlay are that record's entries, unchanged (see §1 and §6).
**Authoritative register for current status:** `sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json`
(generated 2026-09-21 by `scripts/record_enthusiast_evidence.py`, whose register-level blocks are
produced by `scripts/collate_corpus.py`'s own functions; digests in
`sessions/COLLATION_W1_2026-09-21_ENTHUSIAST_100PCT_refs_manifest.txt`).
**Status scope:** Containment/remediation state, not a rights decision. Source collation does not
approve reuse.

## 0. Relationship to the earlier records (read this first)

The 2026-09-09 report/register, the 2026-09-10 correction overlay/refs manifest, the 2026-09-20
Congrong Lu overlay, the 2026-09-20 Chuandeng Lu overlay and the 2026-09-20 Caoshan Benji overlay
are **historical evidence and are append-only**: none of those files has been edited, moved, or
re-dated, and they keep their original paths and date metadata. This file is a **new dated overlay**,
not a replacement.

| question | record to read |
|---|---|
| what did W1 claim on 2026-09-09, and on what evidence | `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries) |
| what the 2026-09-10 overlay corrected, and how the 35 documents measured then | `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` + `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (35 documents, 630 flagged entries) |
| what the 2026-09-20 overlay added, the Congrong Lu reinstatement | `sessions/COLLATION_W1_2026-09-20_CORRECTION.md` + `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json` (36 documents, 630 flagged entries) |
| what the 2026-09-20 Chuandeng Lu overlay added | `sessions/COLLATION_W1_2026-09-20_CHUANDENGLU_FULL.md` + `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json` (37 documents, 630 flagged entries) |
| what the 2026-09-20 Caoshan Benji overlay added | `sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI.md` + `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json` (38 documents, 630 flagged entries) |
| what is the authoritative W1 status of each of the 44 current manifest items | **this** overlay + `sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json` (44 documents, 630 flagged entries) |

## 1. What this overlay adds, and what it deliberately does not re-measure

This overlay adds **six document entries**, appended verbatim from one measured run of
`scripts/collate_corpus.py --doc …` (committed as
`sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT_MEASUREMENT.json`):
`huangbo_fayao_full`, `mazu_guanglu_full`, `yunmen_guanglu_full`, `dongshan_yulu_full`,
`zhaozhou_yulu_full` and `dahui_yulu_full`. Each is a full-witness ingestion produced by
`scripts/segment_full_witness.py` from the pinned CBETA XML P5 witnesses at revision
`dbdea41071e1e260ad84b72faefd4587333cf76d`, and together they add **2,586 units, 302,592 source-content
CJK characters and 5,178 measured fields — all 5,178 EXACT, none flagged** — lifting field-level
source-content collation over the 44-item manifest from 2,451/2,782 to **5,037 of 5,368** (93.8%).

The 38 inherited entries are **not re-measured**. Re-measuring the already-recorded documents would
change their measured classes with no new extraction behind it — a re-designation of the evidence,
which the standing rulings forbid (the Congrong Lu overlay's ruling, reaffirmed by the owner's
2026-09-12 ruling on the post-remediation measurement: a lower number is not a new truth to
promote). Concretely this overlay:

- adds six `documents` entries copied verbatim from the harness's own measurement of the landed
  files, each carrying its `witness_note` from `collate_corpus.WITNESS_NOTES`;
- recomputes the register-level blocks (`reference_verification`, `aggregate`, `reproduction`) with
  the harness's own functions;
- keeps the designated flagged-entry total at **630** — the six new documents contribute no flags,
  so nothing re-enters the flagged pool;
- leaves every other corpus file untouched: the four earlier seeds these records complete
  (`huangbo_chuanxin`, `mazu_yulu`, `yunmen_yulu`, `dongshan_yulu`) and the historical
  `zhaozhou_yulu` seed with its false 'T1987' claim keep their data, their statuses and their notes
  exactly as the 2026-09-20 chain recorded them. They stay `partial_or_failed_w1_collation`; the
  full records do not launder them.

The measurement is reproducible: re-running `scripts/record_enthusiast_evidence.py` on the same
inputs rewrites `sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json` byte-for-byte (§7).

## 2. Flagged-entry reconciliation: 637 → 622 → 623 → 630

The four figures the chain has to reconcile, with what each is:

| flagged entries | documents | what it measures | standing |
|---:|---:|---|---|
| **637** | 34 documents | the 2026-09-09 report's prose claim, contradicted by its own register | **superseded** |
| 622 | 34 documents | the historical 2026-09-09 register's flagged total | historical evidence, append-only |
| 623 | 34 documents | the 2026-09-10 reproduction over the same 34 documents (the re-keys moved classes inside the overlap) | superseded by the later overlays |
| **630** | 44 documents | this overlay's authoritative register total — unchanged by the six new documents | authoritative |

The reconciliation rows are computed, not transcribed: the historical register's per-document
`flagged` arrays sum to 622; re-deriving the same 34 documents from the authoritative register
(after the chain's status-scope edits) gives 623; the authoritative register over all 44 documents
sums to 630. Nothing in this overlay moves those numbers.

## 3. Reference extraction, pinned upstream, and digest verification

The rule is unchanged (`scripts/collate_refs.py`, `cbeta-p5-body-cjk-v1`):

```
rule id   cbeta-p5-body-cjk-v1
rule      tei:text/tei:body document-order text; drop the subtree of every tei:note and tei:g
          (tails kept); tei:head kept; keep only U+3400-U+9FFF and U+F900-U+FAFF;
          one UTF-8 line, no trailing newline
upstream  https://github.com/cbeta-org/xml-p5 @ dbdea41071e1e260ad84b72faefd4587333cf76d
          (witness files pinned by scripts/segment_full_witness.py, e.g.
          T/T47/T47n1998A.xml sha256 995ce772f0f6bac1162d3cce427b861a03023cc98be9775bd2dc8cc05c693bc3)
```

Verification results for the 41 works the collator actually reads:

| comparison | verified | drift | unlisted |
|---|---:|---:|---:|
| against `sessions/COLLATION_W1_2026-09-21_ENTHUSIAST_100PCT_refs_manifest.txt` (this overlay's anchor) | 41 | 0 | 0 |
| against `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` (historical anchor) | 34 | 7 | 0 |

The reference set is **unchanged as a set**: every witness and probe the six documents read
(`T48n2012A`, `X69n1321`, `T47n1988`, `T47n1986A`, `T47n1986B`, `X68n1315`, `T47n1998A`, `T47n1998B`
claimed; `T48n2012B`, `T51n2076`, `T47n1987A`, `X80n1565`, `T48n2001` as probes) was already in the
manifest the Caoshan overlay committed, and this overlay's manifest is byte-identical to
`sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI_refs_manifest.txt` (41 lines, sha256
`9d5c107460226f540b27059a2460b0a988dad0dccabf045fedb1b84fe8893fa8`). The 2026-09-20 Caoshan manifest
and the 187-line historical anchor stay committed and unmodified.

The 7 references whose bytes differ from the 2026-09-09 manifest are `T47n1987B`, `T48n2001`,
`T48n2004`, `X67n1309`, `X68n1315`, `X69n1333`, `X73n1445` — the list of record since 2026-09-10,
unchanged by this overlay. Five of the six new documents claim references that verify byte-identically
against **both** anchors, so their entries record `historical_status = 'verified'` and they add no
drift. The sixth is the honest exception, recorded rather than waived away: `zhaozhou_yulu_full`
claims `X68n1315` (古尊宿語錄), whose reference carries historical **drift** — the entry records
refs_verified = 1 / refs_total = 1 against the authoritative anchor but refs_historically_verified
= 0, and the document therefore joins `documents_with_drifted_references` alongside `baizhang_guanglu`,
`congronglu`, `dahui_hongzhi`, `dahui_shobogenzo`, `foyan_qingyuan`, `nanquan_yulu`, `xuansha_yulu`,
`xuefeng_yantou` and the historical `zhaozhou_yulu` seed. The document's own extraction verifies
against the current authoritative manifest, which is what its collated claim rests on; the drift
against the 2026-09-09 bytes is disclosed in the corpus record's `cbeta_note` and in the register.
Probes `T48n2001` and `X68n1315` (as a probe of `huangbo_fayao_full` and `mazu_guanglu_full`) also
carry historical drift; that is recorded in their entries' `reference_verification` and changes
nothing, because a probe cannot move a class.

Re-extraction reproduces every digest in the manifest byte-for-byte from the pinned checkout
(`references: 41 work(s)` / `digest verification: 41 verified, 0 drift, 0 unlisted, 0 unavailable`).
Across all 187 manifest works, the 2026-09-10 analysis stands: the historical bundle was built with
a mixed per-file rule that was never committed, so full byte-parity with it is not recoverable, and
five works (`T51n2077`, `X67n1309`, `X68n1315`, `X69n1333`, `X73n1445`) match neither committed rule
at any CBETA release tested.

## 4. The six full-witness documents, and the ten overlay-only records

**The producer.** `scripts/segment_full_witness.py` is the deterministic, witness-only producer (its
only inputs are the pinned witness file — sha256-checked — and its digest-verified reference
extraction). For each document it walks `tei:text/tei:body` counting CJK exactly as the pinned rule
serializes it, opens a unit boundary at every `p`, `lg`, `div` and `juan` element start inside the
region, and asserts at run time that (a) the unit boundaries tile the region contiguously, (b) the
concatenation of the unit texts equals the reference slice character for character, and (c) the
region bounds, region CJK count and unit count match the **frozen pins** in the producer — so a
witness-byte or upstream-structure change fails the run instead of silently re-partitioning a
published record. `title_zh` is the unit's own 目録/`jhead` text where the witness prints one, and
the unit's first 12 CJK characters otherwise — always verbatim; every `title_en` and `speaker` is
project-authored metadata.

**The six documents** (units = source-content fields; each line states its measured figures):

- `huangbo_fayao_full` (T48n2012A, 6,632 CJK): Content fields: 19 measured,
  19 collated, refs_verified = 1 / refs_total = 1, all EXACT, 0 flagged. The whole Transmission
  of Mind in 19 units — Pei Xiu's preface block and 目録/head, the 唐大中十一年 dated close, the 14
  dharma-essentials paragraphs, the fascicle opening and close. The 宛陵錄 `T48n2012B` is a sibling
  corpus document and stays a probe here, not a claimed witness. The witness's close `jhead` prints
  黃檗山**際**禪師傳心法要終 (the 斷 is absent in the block); carried as printed, not corrected.

- `mazu_guanglu_full` (X69n1321, 4,732 CJK): Content fields: 35 measured, 35
  collated, refs_verified = 1 / refs_total = 1, all EXACT, 0 flagged. The whole record as printed in
  the Manji Zokuzōkyō, 35 units. The work-level catalogue title is 馬祖道一禪師廣錄（四家語錄卷一）
  while the record's own opening heading reads 江西馬祖道一禪師語錄 — the corpus record carries the
  heading the witness prints and says so in its `cbeta_note`; it is *this printing*, whole, and no
  other Mazu witness is merged (`T51n2076` juan 6–7 and the X68n1315 行狀 are probes).

- `yunmen_guanglu_full` (T47n1988, 43,678 CJK): Content fields: 776 measured,
  776 collated, refs_verified = 1 / refs_total = 1, all EXACT, 0 flagged. The complete Yunmen Guanglu
  in 776 units — 27 witness-titled sections (序, 對機三百二十則, 室中語要, 垂示代語, 勘辨, 遊方遺錄,
  行錄, the 三句頌 with its twelve verse titles…), the three fascicle openings and closes, 731 record
  paragraphs and 12 verse blocks. The earlier ten-section `yunmen_yulu` seed was never patched: its
  2026-09-16 retellings stay 0-collating against their own claim, and the 古尊宿語錄's parallel
  Yunmen printing (`X68n1315`) is a probe, not merged.

- `dongshan_yulu_full` (T47n1986A, 15,843 CJK + T47n1986B, 8,596 CJK): Content
  fields: 322 measured, 322 collated, refs_verified = 2 / refs_total = 2, all EXACT, 0 flagged. Both
  Taishō parts of number 1986 (筠州洞山悟本禪師語錄 and 瑞州洞山良价禪師語錄), 322 units — 25 titled
  sections including the 歌頌寶鏡三昧歌 with commentary, the two letters to his mother with the
  附孃回書, the three appended prefaces and the close. The Five Ranks *treatises* live in the Caoshan
  record ingested on 2026-09-20 as the 38th document (see its restated figures below); the standalone
  `baojing_sanmei` selection is untouched; `T47n1987A` is a probe.

- `zhaozhou_yulu_full` (X68n1315 juan 13–14, 21,038 CJK inside the anthology,
  region-pinned): Content fields: 80 measured, 80 collated, refs_verified = 1 / refs_total = 1, all
  EXACT, 0 flagged — with the X68n1315 historical drift recorded (§3). Zhaozhou as printed in the
  Guzunsu yulu, 80 units — 13 titled blocks (record+行狀 heading, the two 卷 openings and closes,
  the repeated 澄諟 colophon, 語錄之餘), two section leads and 64 record paragraphs, tiling the
  anthology's Zhaozhou span contiguously and stopping exactly at the next work's opening heading
  古尊宿語錄卷第十五. The famous cases verified inside the region: 狗子無佛性 (three exchanges),
  庭前柏樹子 (five occurrences), 喫茶去 and 木佛 暖炙 — all carried verbatim inside their units. The
  prior 'T1987' claim stays recorded as false on the historical seed and this document never cites
  it.

- `dahui_yulu_full` (T47n1998A, 182,132 CJK + T47n1998B, 19,941 CJK): Content
  fields: 1354 measured, 1354 collated, refs_verified = 2 / refs_total = 2, all EXACT, 0 flagged. The
  complete Dahui Yulu — thirty juan, the 書問 letters of juan 25–30 being individual 答…-titled
  units inside the tiling — plus the 宗門武庫: 1,354 units, 209 witness-titled sections, the 31
  openings and 31 closes, 840 record paragraphs and 243 verse blocks, unit CJK from 1 to 5,078.
  Hongzhi's own Guanglu (`T48n2001`) is carried as a probe only — this document claims nothing from
  it and is not a Hongzhi ingestion; the six-field `dahui_hongzhi` selection stays its untouched
  sibling.


**The seven earlier overlay-only records, restated so this document is self-contained** (their
entries are inherited verbatim; the figures are from the same register): `congronglu` (2026-09-20):
Content fields: 500 measured, 500 collated, refs_verified = 1 / refs_total = 1, status
`collated_to_claimed_witness` with its `T48n2004` drift waiver declared (§4 of the 2026-09-20
overlay). `chuandenglu_full` (2026-09-20): Content fields: 1274 measured, 1274 collated,
refs_verified = 1 / refs_total = 1. `caoshan_benji` (2026-09-20): Content fields: 84 measured, 84
collated, refs_verified = 1 / refs_total = 1. `shitou_sandokai` (2026-09-10): Content fields: 11
measured, 6 collated, refs_verified = 2 / refs_total = 2 — it stays `partial_or_failed_w1_collation`,
and this overlay changes nothing about it. The four seeds the six full records complete
(`huangbo_chuanxin`, `mazu_yulu`, `yunmen_yulu`, `dongshan_yulu`) and the `zhaozhou_yulu` seed are
**not** overlay-only and are not restated as successes: their own flagged entries (622-flag-era
figures, amended by the re-keys) stand unchanged in this register.

**The new-document declarations, stated in the open.** The register's
`generation_parameters.new_documents` is `['congronglu', 'chuandenglu_full', 'caoshan_benji',
'huangbo_fayao_full', 'mazu_guanglu_full', 'yunmen_guanglu_full', 'dongshan_yulu_full',
'zhaozhou_yulu_full', 'dahui_yulu_full']` — cumulative: the earlier overlays' declarations stay, and
the six new keys are added because the historical pass predates the documents. The policy sentence
this declaration suspends is: *"a drifted or unlisted reference never upgrades a W1 status."* For
`congronglu` it is load-bearing (its `T48n2004` historical anchor is a recorded `drift`); for
`zhaozhou_yulu_full` it lifts the historical-anchor veto for its claimed `X68n1315` while the drift
itself is **recorded** in the entry and in §3 above — a waiver suspends the veto, it does not deny
the bytes; for the other four declared keys the declaration is form, since their claimed references
verify byte-identically against both anchors (`historical_status = 'verified'`). The rule is
unchanged for every document the historical register covers, the pinned anchor must still verify
byte-identically for a declared key, and a declared key the historical register already covers fails
validation. The regression fixtures in `scripts/test_source_review_rules.py` pin the cumulative list
and the failure on a false declaration.

## 5. Recomputed status counts (from evidence, not transcribed)

Derived from the merged evidence for all 44 manifest items by `source_review.derive_status()`:

| status | count | documents |
|---|---:|---|
| `collated_to_claimed_witness` | 10 | `zhengdao_ge`, `congronglu`, `chuandenglu_full`, `caoshan_benji`, and the six new full records `huangbo_fayao_full`, `mazu_guanglu_full`, `yunmen_guanglu_full`, `dongshan_yulu_full`, `zhaozhou_yulu_full`, `dahui_yulu_full` |
| `partial_or_failed_w1_collation` | 32 | everything else with a claimed witness, including `shitou_sandokai`, `wumenguan`, `xinxin_ming`, and the four seeds the full records complete |
| `witness_unavailable` | 2 | `hanshan_poems`, `niutou_juezhu` (no CBETA witness claimed in the corpus record) |

Field totals over the 44 entries: **9,812 total fields**, **5,368 content fields**, **5,037 collated
content fields**, **4,444 metadata fields, 299 of them non-collating** (mostly `title_zh` composites
— measured and reported separately, and never proof of collation; the six new documents add 2,586
source-content and 2,592 title-metadata fields, all EXACT). The denominator for a status is **source content only**
(`zh`, `verse_zh`, `commentary_zh`, `pointer_zh`); title/name fields (`title_zh`, `name_zh`) never
make a document complete. `collated_to_claimed_witness` means every *source content* field of that
document collates to the claimed witness — for the six new records, 2,586 of 2,586, every one
verbatim in the pinned witness. It is not a rights approval and not a completion claim: all six
records stay `partial_selected_witness`; `corpus.complete_documents` remains empty; the historical
`documents_classification_identical = 33` of 34 overlap documents the 2026-09-10 reproduction
compares (the one difference is the adjudicated `shitou_sandokai`, unchanged by this overlay) and
documents_with_changed_status = 0 for the 34 documents the historical register covers — the six
additions are new keys, not status moves.

## 6. Invariants preserved by this correction

- No existing corpus file was edited. `data/corpus/*` differs from the base commit exactly by the
  six new documents (and the `docs/data/corpus/` mirror the bundle build writes), all declared in
  `scripts/test_source_preservation.py`; the allowlisted remediation pointers across the other 38
  files reproduce unchanged, 0 unauthorized changes.
- The 2026-09-09 register/report/manifest, the 2026-09-10 overlay/report/manifest, the 2026-09-20
  Congrong Lu overlay/report, the 2026-09-20 Chuandeng Lu overlay/report/measurement/manifest and
  the 2026-09-20 Caoshan Benji overlay/report/measurement/manifest are byte-identical to their
  committed versions; this overlay adds new dated files and re-dates nothing.
- No translation text, edition-verification record, or rights decision was changed. The designated
  authoritative flagged total stays **630**; nothing was re-designated, and the 2026-09-12
  post-remediation measurement record (486 flags over its own 34-document scope) is still itself —
  a fresh collation over all 44 documents reports **486** flags today as well, since the six new
  documents add none; that is this measurement, not the register, and buys no status.
- Reference texts stay out of the repository; only the digest manifests (this overlay's 41-line
  copy, the Caoshan original it byte-mirrors, and the 187-line historical anchor) and the rules that
  regenerate them are committed.
- `.github/workflows/*` untouched; no Pages work; no new runtime dependency; no secret.

## 7. Committed digests and how to reproduce this overlay

```
sha256(sessions/COLLATION_W1_2026-09-21_ENTHUSIAST_100PCT_refs_manifest.txt) 9d5c107460226f540b27059a2460b0a988dad0dccabf045fedb1b84fe8893fa8
sha256(sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json)        2539ae11329c013aee752f1dcb2c14c6f158ee221074f85cef8d6142e6f7b732
sha256(sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT_MEASUREMENT.json) b7d2da0e7d1188ee75407ec8ef6860b950736833ef5bc37c9af25cf9e569ddb3
sha256(data/corpus/huangbo_fayao_full.json)                                   6ad312d41a73122e7e2310b901ebb4675ee04e8af0923a0dd7164187127cb673
sha256(data/corpus/mazu_guanglu_full.json)                                    150222c07914a6b77d86a8204d76eb265c61a6cbe8ac65b7247dda975ccf3a4e
sha256(data/corpus/yunmen_guanglu_full.json)                                  b46337502bc37e36d1b17808c936fc361a3365d29024a72986499c585cdcb762
sha256(data/corpus/dongshan_yulu_full.json)                                   7c03aad95e930f5e45e06c0e6d70011c954a143d8fcb1d9c517eb5aceb86be1b
sha256(data/corpus/zhaozhou_yulu_full.json)                                   227ca40aebe6abd9cf1c9c7dc6eb6f90c8ba91c63bb09419f80a3ddb90c5b207
sha256(data/corpus/dahui_yulu_full.json)                                      af73aa19c9561c284b8d765170eb8c4d044b5f5f1623c1da9346fc4c39252a47
sha256(scripts/segment_full_witness.py)                                       2603f02461c1062e9756a4e9c3ea56b94782581c5a3d4905dde4354a1654c038
```

```bash
# 1. the pinned reference edition (git protocol; the raw CDN may be unreachable from a sandbox)
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
git -C /tmp/xmlp5 fetch --depth 1 origin dbdea41071e1e260ad84b72faefd4587333cf76d
git -C /tmp/xmlp5 checkout dbdea41071e1e260ad84b72faefd4587333cf76d

# 2. extract + verify the 41 references the harness reads (must print 41 verified, 0 drift)
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --from-digest-manifest sessions/COLLATION_W1_2026-09-21_ENTHUSIAST_100PCT_refs_manifest.txt --require-verified

# 3. build each witness document (asserts witness sha, tiling and the frozen region/unit pins)
for d in huangbo_fayao_full mazu_guanglu_full yunmen_guanglu_full dongshan_yulu_full \
         zhaozhou_yulu_full dahui_yulu_full; do
  python3 scripts/segment_full_witness.py --doc $d --source-dir /tmp/xmlp5 --refs-dir /tmp/refs \
      --out data/corpus/$d.json --locators-out data/staging/${d}_locators.json \
      --report data/staging/${d}_extraction_report.json
done
#    (merge the staging unit locators into data/canonical_locators.json; 1,606 -> 4,192)

# 4. measure the landed documents — this reproduces the overlay's six new entries
python3 scripts/collate_corpus.py --refs-dir /tmp/refs \
    --doc huangbo_fayao_full --doc mazu_guanglu_full --doc yunmen_guanglu_full \
    --doc dongshan_yulu_full --doc zhaozhou_yulu_full --doc dahui_yulu_full \
    --refs-manifest sessions/COLLATION_W1_2026-09-21_ENTHUSIAST_100PCT_refs_manifest.txt \
    --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
    --new-document huangbo_fayao_full --new-document mazu_guanglu_full \
    --new-document yunmen_guanglu_full --new-document dongshan_yulu_full \
    --new-document zhaozhou_yulu_full --new-document dahui_yulu_full \
    --require-verified-refs --generated 2026-09-21 \
    --out sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT_MEASUREMENT.json

# 5. regenerate the overlay (inherits the 38 entries, appends the six measured ones, recomputes the
#    register-level blocks with the harness's own functions); byte-identical output expected
python3 scripts/record_enthusiast_evidence.py

# 6. the corpus-level gates
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
node scripts/smoke_test.mjs
```

## 8. What this overlay does not claim

It does not claim the corpus is complete or that any document is a `complete_selected_witness`:
`complete_documents` is empty and stays empty, and six full records joining ten collated-to-witness
documents is still not a finished corpus — the four seeds these records complete, the Wumenguan /
Xinxin Ming / Biyanlu / Linji / Platform states, the 31 excerpt seeds and the missing front matter,
interlinear apparatus and human sign-off on every record here are unchanged facts. It does not
soften a single prior finding: every flagged entry the earlier registers recorded still stands in
this register, the 'T1987' misattribution stays on the historical seed, and the Yunmen seed's
retellings stay 0-collating. It does not designate the fresh 486-flag measurement authoritative —
630 remains the designated register figure per the owner's 2026-09-12 ruling. And it grants no
rights: witness text carries the pinned extraction's edition, not permission to reuse.
