# P2 — Enthusiast 100% Closer: six full-witness records (task 050, 2026-09-21)

**Scope.** Close the corpus' founder-record gaps the enthusiast path can actually verify: the full
Huangbo 傳心法要, Mazu's record as printed in X69n1321, the whole Yunmen Guanglu, both Dongshan
fascicle parts, Zhaozhou's record inside the 古尊宿語錄 (the famous cases included), and the complete
Dahui Yulu **including the juan 25–30 letters** plus the 宗門武庫. Every one ingested as verbatim
witness text from the pinned CBETA XML P5 edition, with field-level collation measured by the W1
harness — no retellings, no patched seeds, no re-designated evidence.

**Base / branch.** `main` @ `83f1cbd` → this session branch `arena/01a0c15b-translatechan`
(target designation `feat/enthusiast-100pct`).

## 1. What landed

| document | witness | units (source-content fields) | region CJK | measured |
|---|---|---:|---:|---|
| `huangbo_fayao_full` | T48n2012A | 19 | 6,632 | 39/39 EXACT, 0 flagged |
| `mazu_guanglu_full` | X69n1321 | 35 | 4,732 | 71/71 EXACT, 0 flagged |
| `yunmen_guanglu_full` | T47n1988 | 776 | 43,678 | 1,553/1,553 EXACT, 0 flagged |
| `dongshan_yulu_full` | T47n1986A + T47n1986B | 322 | 24,439 | 645/645 EXACT, 0 flagged |
| `zhaozhou_yulu_full` | X68n1315 juan 13–14 (anthology region) | 80 | 21,038 | 161/161 EXACT, 0 flagged |
| `dahui_yulu_full` | T47n1998A + T47n1998B | 1,354 | 202,073 | 2,709/2,709 EXACT, 0 flagged |
| **total** | 8 witness files | **2,586** | **302,592** | **5,178/5,178 EXACT, 0 flagged** |

Each row includes its metadata partition: `title_zh` for every unit is the witness's own 目録/`jhead`
text or a verbatim first-12-character prefix — all EXACT. Every `title_en`/`speaker` is labelled
project metadata in the documents themselves.

**Coverage math (field level).** Over the 44-item authoritative register, source-content collation
moved from 2,451/2,782 (88.1%) to **5,037/5,368 = 93.8%** — above the task's 80% floor and inside
its 90%+ target. A fresh collation of the current tree (re-run 2026-09-21 over all 44 documents)
measures **486** flagged fields and **5,177/5,368** collating; 630 remains the designated register
figure and nothing was re-designated (owner ruling of 2026-09-12, applied unchanged).

## 2. Honesty ledger (what this is *not*)

- **No completion claim.** `corpus.complete_documents` stays empty; all six records are
  `partial_selected_witness` — interlinear commentary (古注/著語-type apparatus), prefatory material
  that lives in *other* witnesses, and human sign-off are out. The pinned extraction rule drops
  `tei:note`/`tei:g` subtrees, and every document's `coverage_note` says so.
- **No laundering of the old seeds.** `huangbo_chuanxin`, `mazu_yulu`, `yunmen_yulu`,
  `dongshan_yulu` and the `zhaozhou_yulu` seed with its false 'T1987' claim are untouched, flagged
  entries and all; their register rows are inherited verbatim.
- **Zhaozhou drift is recorded, not waived away.** The claimed `X68n1315` reference verifies
  byte-identically against the authoritative 41-work manifest but carries recorded drift against the
  2026-09-09 historical anchor (one of the seven). The entry carries `refs_historically_verified = 0`
  and the document joins `documents_with_drifted_references`; the document is `new_documents`-declared
  because the historical pass predates it — the two facts are both in the register.
- **Mazu title kept as printed.** X69n1321 is catalogued 馬祖道一禪師廣錄（四家語錄卷一）and its own
  heading reads 江西馬祖道一禪師語錄; the record carries the heading and discloses the catalogue title
  in `cbeta_note`. This is *this printing*, whole — not a merged four-fascicle 廣錄, and no other
  Mazu witness is claimed.
- **Dahui letters, exactly.** There is no separate "letters" file: the 書問 are juan 二十五–三十 of
  T47n1998A, and the letters' 答…-titled sections are individual units of the tiling. Hongzhi's
  T48n2001 side stays a probe; `dahui_hongzhi` is untouched.
- **630 stays.** The six documents add zero flagged entries, so the authoritative flagged total is
  unchanged; the overlay would fail its own `DESIGNATED_FLAGGED_TOTAL` assert otherwise.

## 3. How it was produced (deterministic, replayable)

`scripts/segment_full_witness.py` (new producer; witness-only inputs): pins each witness file's
sha256 and its reference extraction's sha256, re-derives the extraction through
`scripts/collate_refs.py`'s `cbeta-p5-body-cjk-v1` rule, walks the `tei:body`, opens units at every
`p`/`lg`/`div`/`juan` start, tiles the region contiguously, and asserts — at run time — that the
unit concatenation equals the reference slice and that region bounds/CJK/unit-count match the frozen
pins (region + census recorded in §0 of the overlay report; e.g. Zhaozhou `[101821, 122859]`,
80 units, ending exactly at the next work's heading 古尊宿語錄卷第十五). A witness or upstream change
fails the run instead of re-partitioning published evidence. The full replay command sequence is
§7 of [`COLLATION_W1_2026-09-21_ENTHUSIAST_100PCT.md`](./COLLATION_W1_2026-09-21_ENTHUSIAST_100PCT.md).

Evidence chain: `sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json` (44 documents,
630 flagged entries; sha256 `2539ae11329c013aee752f1dcb2c14c6f158ee221074f85cef8d6142e6f7b732`)
inherits the Caoshan overlay's 38 entries verbatim and appends the six measured entries from
`sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT_MEASUREMENT.json`. The refs manifest
(41 works) is byte-identical to the Caoshan overlay's — the reference set did not grow.

## 4. Data and gate surface

- `data/corpus/{six keys}.json` — 2,586 cases; `data/corpus_manifest.json` 38 → 44 items, all six
  `collated_to_claimed_witness` / `partial_selected_witness`, with the source_review block re-pointed
  to the 2026-09-21 overlay.
- `data/canonical_locators.json` — six case-granularity documents, 4,192/4,192 case locators
  (1,606 → 4,192), each anchored at the witness's own `lb` line head with the last `lb` in-unit as
  closing line; every entry's status is `collated_with_normalization` and says the normalization is
  the pinned rule, with human sign-off pending.
- `data/project_metrics.json` regenerated through the protected `--write-metrics` path (corpus=44,
  slots=1252, verified=177, matrix=21, locators=4192/4192; collated=10 | partial/failed=32 |
  unavailable=2; content CJK 855,603 / all-string CJK 917,776).
- Docs kept truthful: README/HANDOFF/AUDIT/ROADMAP/vision/RESEARCH_RELEASE_PLAN/REMEDIATION_PLAN/STATE
  re-pointed to the new overlay with the new census (99 notes; 57 of 99 rendered; 35 documents), the
  five-ledger separation lines intact, no completion language added.
- `scripts/collate_corpus.py` DOCS + WITNESS_NOTES; `scripts/w1_evidence.py` FIXED_METADATA;
  `scripts/record_enthusiast_evidence.py` (deterministic overlay recorder, inherits-without-re-measuring);
  `scripts/test_source_preservation.py` DECLARED_NEW_CORPUS +6; `scripts/test_source_review_rules.py`
  and `scripts/smoke_test.mjs` re-pinned to the new evidence totals (44 / 10 / 13 partial / 4,192 /
  41 works).

## 5. Gates (all re-run after the final bundle)

- `python3 -m py_compile` over every touched script — clean.
- `scripts/validate_data.py --write-metrics` — ✅ PASS (corpus=44, locators 4192/4192, flagged=630,
  evidence 2026-09-21); metrics regeneration is the gate that recomputes every cited number.
- `scripts/build_data_bundle.py` — `app_data.js` **8,729,363 bytes**, 44 documents, byte-identical
  across two consecutive builds (> 4,851,526 B previous bundle, +3,877,837 B).
- `scripts/test_source_preservation.py` — ✅ 0 unauthorized changes; 9 declared new corpus files; 35
  files match base apart from allowlisted pointers.
- `scripts/test_source_review_rules.py` — ✅ 145 checks including the 630-corruption, 9-key waiver
  list, partition (5,368/4,444) and metadata-claim (4,444) regressions.
- `node scripts/smoke_test.mjs` — ✅ PASS (44-item manifest, 10/32/2 counts, six new coverage ratios,
  ledger citations of the new register, shelf groups 13/31).

## 6. Remaining distance to 100% (honest)

The 22 documents with no collating source-content field are mostly *other* people's records
(re-)told in anthology phrasing or excerpt seeds; the next real steps are the same witness-pinned
producer for Hongzhi (T48n2001, whole), the Guifeng/Yangqi and Fayan lines, the monastic codes as
complete texts, the Wumenguan/Biyanlu verse-and-commentary apparatus re-keyed record-by-record —
plus owner review for sign-off, which no amount of collation can substitute. Every one of those
remains `partial_or_failed_w1_collation` until measured, exactly as before.
