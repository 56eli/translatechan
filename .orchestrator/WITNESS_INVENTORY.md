# W1 Witness Inventory — family 1 (nine T47-recension documents)

**Generated:** 2026-09-11 · **Task:** 006 — independent witness inventory (prompt `006-witness-inventory-t47.md`) · **Role:** measurement only — nothing under `data/`, `docs/`, `sessions/`, `scripts/`, `.github/` was modified.
**Base:** branch `arena/01a091ad-translatechan` at `ef13b26` (main). This file is the only new artifact; the W1-tracker PR-number placeholder fixes (four occurrences in STATE.md / REMEDIATION_PLAN.md, resolved to the verified number #34) land in the second commit.

## Run identity (header)

- **Upstream revision (pinned):** `dbdea41071e1e260ad84b72faefd4587333cf76d` — github.com/cbeta-org/xml-p5 (`git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5 && git -C /tmp/xmlp5 rev-parse HEAD` returned exactly this; `ls /tmp/xmlp5/T/T47/ | wc -l` = 12, case preserved).
- **Manifest:** `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt` (39 works).
- **Extraction — full 39-work run, no subsetting:**

  ```bash
  sed 's/.*  ref_//; s/\.txt$//' sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
    | while read -r w; do printf '/%s/%s/%s.xml\n' "${w:0:1}" "${w:0:3}" "$w"; done > /tmp/paths.txt
  git -C /tmp/xmlp5 sparse-checkout set --no-cone $(tr '\n' ' ' < /tmp/paths.txt) && git -C /tmp/xmlp5 checkout
  python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --work-list sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
    --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
    --upstream-revision "$(git -C /tmp/xmlp5 rev-parse HEAD)" --require-verified
  ```
  Output: `references: 39 work(s)` / `digest verification: 39 verified, 0 drift, 0 unlisted, 0 unavailable` → **39 verified / 0 drift**.
- **Collation command line:** `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --out /tmp/inv.json` (35 documents collated; the nine below are in scope; register written to `/tmp/inv.json`, outside the repo).
- **Published register compared against (baseline for Δ):** `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (generated 2026-09-10, same upstream revision) — its per-doc baselines equal the §3 table of the task prompt.

### §3 self-test result (the point of this run)

The task prompt predicted my `linji_yulu` row would read **84/89 with {MINOR 2, NOT_FOUND 3}** while the stale published register says 79/89 with 10 flags ({DIVERGENT 2, MINOR 2, NOT_FOUND 6}).

| source | collated | content flags |
|---|---|---|
| published register (2026-09-10, pre-remediation) | 79/89 | {MINOR 2, DIVERGENT 2, NOT_FOUND 6} |
| **this run (2026-09-11, refs 39/39 byte-verified)** | **84/89** | **{MINOR 2, NOT_FOUND 3}** |

**The self-test PASSES: my run does NOT agree with the stale register.** It moved in exactly the predicted direction — 5 fields (2 DIVERGENT: `.sections[0].dialogue[1].zh`, `.sections[68].dialogue[0].zh`; 3 NOT_FOUND: `.sections[67]/[69]/[70].dialogue[0].zh`) re-classified EXACT by the PR #32 re-key that is present on main at this base (the document's own `coverage_note` already states 84/89 "after the 2026-09-11 R-A re-key"). Had my run agreed with the stale register, the collation would not have actually happened; it moved, on digest-verified references (39 verified / 0 drift), so the collation is real. The other eight documents measured identical to the published register (Δ = 0), as expected — no other re-key is on main yet.

### `iter_fields()` walk — exact per-doc field counts (nothing skipped)

Per the §8 trap-1 rule, this was obtained by **running the harness's own enumeration** (`scripts/collate_corpus.py::iter_fields`, fully recursive, gated by `SRC_KEYS = {zh, verse_zh, commentary_zh, pointer_zh, title_zh, name_zh}` minus speaker/author tails) on each data file — not inferred from a neighbouring constant. Every count below equals the register's `fields_total` for the same document, so nothing was skipped: nested `chapters[*].verses[*].zh`-style paths ARE reached by the enumerator.

| doc | fields reached | content fields | title/name fields |
|---|---|---|---|
| `linji_yulu` | 164 | 89 | 75 |
| `zhaozhou_yulu` | 35 | 19 | 16 |
| `baojing_sanmei` | 7 | 6 | 1 |
| `dongshan_yulu` | 35 | 21 | 14 |
| `yunmen_yulu` | 23 | 12 | 11 |
| `fayan_yulu` | 20 | 11 | 9 |
| `guiyang_yulu` | 10 | 6 | 4 |
| `dahui_hongzhi` | 11 | 6 | 5 |
| `yuanwu_letters` | 5 | 2 | 3 |

Note on the §8 trap-2 rule: **no misspelling finding is filed for a witness-verbatim graph.** Specifically, `linji_yulu .sections[66].dialogue[0].zh` contains 机 in 辭焚机案 and T47n1985 itself carries 机 twice (機 11 times); the field is EXACT in this run. Same discipline applied to 麁/粗, 沈惛/昏沉, 疎/疏, 却/卻 (the collator's `simplified` list is advisory and no spellcheck pass is proposed anywhere in this file).

---

## Per-document blocks

Fields per block, exactly as specified: doc / claimed witness(es) / reference sha256 (first 16) + length in graphs; `my_measured`; `per_flag` (path, class, verbatim-in-witness yes/no per claimed witness; for NOT_FOUND: my own full-text search — distinct k-graph windows of the field found in the union of the claimed witnesses, hit/total, at 8/12/16/24, plus a cross-search of the same windows against the other 35 refs); `candidate_older_witness` (near-complete defined per document before ranking, per §7); `label_state`; `p0_findings` (each with the command that reproduces it); `proposed_label`. "collated X/Y" = content fields classified EXACT+REWORDED over all content fields (titles are metadata, measured separately, outside the content denominator).

### `linji_yulu`

- **doc / claimed witness(es):** `linji_yulu` / `T47n1985` (probes: `X68n1315`, `T51n2076`, `X80n1565`)
- **reference sha256 (first 16) + length in graphs:** `T47n1985` `4317e5fa14996b3f` … / 16,366 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **84/89**, flags by class {"MINOR": 2, "NOT_FOUND": 3} (full content summary {"EXACT": 84, "MINOR": 2, "NOT_FOUND": 3}); metadata (title/name, excluded from the denominator) {"EXACT": 1, "DIVERGENT": 1, "NOT_FOUND": 73}. Δ vs register baseline: **79/89 {"MINOR": 2, "DIVERGENT": 2, "NOT_FOUND": 6} → 84/89 {"MINOR": 2, "NOT_FOUND": 3}** — see §3 self-test above.
- **per_flag:** (79 flagged fields = every non-EXACT/non-EMPTY field of the 164-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field found in the union of the claimed witnesses, hit/total; cross-ref = the same windows searched against the other 35 refs, only non-zero hits shown):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.sections[0].title_zh` | NOT_FOUND | 0.7368 | T47n1985 | no | — | 6/12, 2/8, 0/4, n/a | none-of-39 |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[3].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[4].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | — |
| `.sections[5].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[6].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[7].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[8].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[9].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[10].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[11].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[12].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[13].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[14].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[15].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[16].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[17].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[18].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[19].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[20].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[21].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[22].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[23].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[24].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | none-of-39 |
| `.sections[25].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[26].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[27].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | — |
| `.sections[28].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | {"T47n1998A": "1/4", "T48n2001": "1/4"} |
| `.sections[29].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[30].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[31].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[32].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[33].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | — |
| `.sections[34].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[35].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[36].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[37].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[38].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[39].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[40].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | — |
| `.sections[41].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[42].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[43].title_zh` | NOT_FOUND | 0.7273 | T47n1985 | no | — | 1/4, n/a, n/a, n/a | none-of-39 |
| `.sections[43].dialogue[0].zh` | MINOR | 0.9975 | T47n1985 | no | — | — | — |
| `.sections[44].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | none-of-39 |
| `.sections[45].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | — |
| `.sections[46].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[47].title_zh` | NOT_FOUND | 0.6667 | T47n1985 | no | — | 1/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[48].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | none-of-39 |
| `.sections[49].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[50].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[51].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[52].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[53].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[54].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[55].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | — |
| `.sections[56].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[57].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[58].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[58].dialogue[0].zh` | MINOR | 0.997 | T47n1985 | no | — | — | — |
| `.sections[59].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[60].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[61].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | none-of-39 |
| `.sections[62].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[63].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[64].title_zh` | NOT_FOUND | 0.6154 | T47n1985 | no | — | 1/6, 0/2, n/a, n/a | none-of-39 |
| `.sections[65].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[66].title_zh` | DIVERGENT | 0.8571 | T47n1985 | no | — | — | — |
| `.sections[67].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/9, 0/5, 0/1, n/a | none-of-39 |
| `.sections[68].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[69].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[70].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[71].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[71].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/46, 0/42, 0/38, 0/30 | none-of-39 |
| `.sections[72].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[72].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/31, 0/27, 0/23, 0/15 | none-of-39 |
| `.sections[73].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[73].dialogue[0].zh` | NOT_FOUND | 0.5804 | T47n1985 | no | — | 24/105, 12/101, 5/97, 0/89 | {"T47n1998A": "5/89", "T51n2076": "3/89", "X80n1565": "7/89"} |

- **candidate_older_witness:** OUT-OF-CBETA — human sourcing required, not agent work (the 867 Dunhuang 鎮州臨濟惠運禪師語錄 is not among the 39-work refs and no Dunhuang Linji work is in the manifest). In-CBETA candidates ranked by measured (normalized) verbatim coverage of the 89 content fields: T47n1985 (claimed) 84/89 — exactly the 84 collated fields (the 2 MINOR are <g>-apparatus residue; the 3 NOT_FOUND are the documented 行錄 retellings) ≫ X68n1315 21/89 (anthology fragment) > T51n2076 1/89 = X80n1565 1/89. The claimed witness is already the best in-CBETA candidate; "older" is not established from anything visible in the 39 refs, and no re-key toward an unverifiable text is proposed.

- **label_state:** coverage_note PRESENT — counts consistent with this measurement: claims 84/89, residual 5 flags (2 MINOR at .sections[43]/[58].dialogue[0].zh + 3 NOT_FOUND at .sections[71]/[72]/[73].dialogue[0].zh) and 74/74 sections; this run measures exactly 84/89 with exactly those 5 flags and 74 sections. recension_note ABSENT; editorial_note ABSENT at top level but PRESENT as per-field R-B labels on sections 71–73 ("Project-authored Xinglu-tradition retelling… No witness attribution") — consistent.

- **p0_findings:**
  - **NONE** — No P0: the residual flags are documented and labelled. The 2 MINOR fields are 㽄/㴸 <g>-apparatus residue verified in the raw T47n1985.xml (count=1 each, inside <g ref="#CB00542"> / <g ref="#CB05273">); the 3 NOT_FOUND fields carry per-field editorial_note R-B labels; the 73 title_zh NOT_FOUND flags are project-composed section headings (titles are collation-excluded metadata, outside the content denominator). No misspelling finding is filed: .sections[66].dialogue[0].zh contains 机 in 辭焚机案 and T47n1985 itself carries 机 twice (機 11×) — the field is EXACT, verbatim in the witness (reproduce: `grep -c 机 /tmp/refs/ref_T47n1985.txt` → 2; `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc linji_yulu` → section 66 dialogue[0] not in the flagged list).

- **proposed_label:** A Taishō T47n1985 (宣和庚子 1120) recension is verbatim for 84 of 89 source-content fields; sections 67–70 of the 行錄 division are re-keyed to the same witness and sections 71–73 are explicitly labelled project-authored retellings with no witness attribution; the older Dunhuang recension (867 鎮州臨濟惠運禪師語錄) is not in CBETA and requires human sourcing before any re-key.

---

### `zhaozhou_yulu`

- **doc / claimed witness(es):** `zhaozhou_yulu` / `T47n1987A`, `T47n1987B` (probes: `X68n1315`)
- **reference sha256 (first 16) + length in graphs:** `T47n1987A` `cdb2f4e2f2982ecf` … / 12,343 graphs; `T47n1987B` `eb16d53cf0add1d6` … / 10,254 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/19**, flags by class {"NOT_FOUND": 19} (full content summary {"NOT_FOUND": 19}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 1, "SHORT_UNMATCHED": 15}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (35 flagged fields = every non-EXACT/non-EMPTY field of the 35-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field found in the union of the claimed witnesses, hit/total; cross-ref = the same windows searched against the other 35 refs, only non-zero hits shown):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | NOT_FOUND | 0.0 | — | no | X68n1315 | 0/1, n/a, n/a, n/a | {"X68n1315": "1/1"} |
| `.dialogues[0].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.dialogues[0].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | X68n1315 | 0/3, n/a, n/a, n/a | {"T47n1985": "2/3", "T47n1986B": "2/3", "T47n1988": "2/3", "T47n1989": "3/3", "T47n1990": "1/3", "T47n1991": "3/3", "T47n1997": "2/3", "T47n1998A": "3/3", "T47n1998B": "1/3", "T48n2001": "1/3", "T48n2003": "3/3", "T48n2005": "3/3", "T51n2076": "3/3", "X67n1309": "3/3", "X68n1315": "3/3", "X69n1321": "1/3", "X69n1333": "3/3", "X69n1357": "2/3", "X73n1445": "2/3", "X80n1565": "3/3"} |
| `.dialogues[0].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | — |
| `.dialogues[0].dialogue[2].zh` | NOT_FOUND | 0.0 | — | no | — | 0/27, 0/23, 0/19, 0/11 | none-of-39 |
| `.dialogues[1].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.dialogues[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | {"T51n2076": "1/1", "X80n1565": "1/1"} |
| `.dialogues[1].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/18, 0/14, 0/10, 0/2 | none-of-39 |
| `.dialogues[2].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | X68n1315 | n/a (≤6 graphs) | — |
| `.dialogues[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/8, 0/4, n/a, n/a | {"T51n2076": "1/4"} |
| `.dialogues[2].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/18, 0/14, 0/10, 0/2 | none-of-39 |
| `.dialogues[3].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | X68n1315 | n/a (≤6 graphs) | — |
| `.dialogues[3].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/14, 0/10, 0/6, n/a | none-of-39 |
| `.dialogues[4].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.dialogues[4].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/10, 0/6, 0/2, n/a | {"X68n1315": "1/2"} |
| `.dialogues[5].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | X68n1315 | n/a (≤6 graphs) | — |
| `.dialogues[5].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/34, 0/30, 0/26, 0/18 | none-of-39 |
| `.dialogues[6].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.dialogues[6].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/26, 0/24, 0/20, 0/12 | none-of-39 |
| `.dialogues[7].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | X68n1315 | n/a (≤6 graphs) | — |
| `.dialogues[7].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/35, 0/31, 0/27, 0/19 | none-of-39 |
| `.dialogues[8].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | X68n1315 | n/a (≤6 graphs) | — |
| `.dialogues[8].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/50, 0/46, 0/42, 0/34 | {"T48n2001": "14/34", "T48n2003": "23/34", "X80n1565": "25/34"} |
| `.dialogues[9].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.dialogues[9].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/17, 0/13, 0/9, 0/1 | none-of-39 |
| `.dialogues[10].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | X68n1315 | n/a (≤6 graphs) | — |
| `.dialogues[10].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/21, 0/17, 0/13, 0/5 | none-of-39 |
| `.dialogues[11].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.dialogues[11].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/13, 0/9, 0/5, n/a | none-of-39 |
| `.dialogues[12].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.dialogues[12].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/30, 0/26, 0/22, 0/14 | none-of-39 |
| `.dialogues[13].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.dialogues[13].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/30, 0/26, 0/22, 0/14 | none-of-39 |
| `.dialogues[14].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | X68n1315 | n/a (≤6 graphs) | — |
| `.dialogues[14].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | none-of-39 |

- **candidate_older_witness:** OUT-OF-CBETA — human sourcing required, not agent work (Dunhuang Zhaozhou material is not in the reference set). In-CBETA candidates by measured (normalized) verbatim coverage of the 19 content fields: claimed T47n1987A/B 0/19 (wrong work: 曹山大師語錄 / 曹洞語錄, attested titles); T51n2076 2/19 (generic formulaic question lines only); X68n1315 重刻古尊宿語錄 1/19 verbatim — but it is the actual Zhaozhou record in the set (趙州 251×, 栢樹子 17×, 狗子 31×, 石橋 25×, 放下著 11×, 好事不如無 8×, 趙州關 9×; the cases exist in different wording), so it is the best measurable in-CBETA candidate on identity and topical presence; the verbatim-count gap is a product of the retelling, not of the witnesses. No candidate can be evidenced as "older" from what is visible; the best measurable in-CBETA candidate is X68n1315.

- **label_state:** coverage_note PRESENT — "15 signature encounter dialogues excerpted from T1987": the count (15 dialogues) is consistent, the witness claim is not (0/19 verbatim in T47n1987A/B, which is the Caoshan record). recension_note ABSENT, editorial_note ABSENT — inconsistent: the misattribution is undisclosed in the document.

- **p0_findings:**
  - **attribution** — The public citation (manifest cbeta "T1987"; data cbeta_id "T1987") attributes 15 Zhaozhou cases to T47n1987A/B, whose attested witness titles are 曹山大師語錄 and 曹洞語錄 — the Caoshan record. 趙州 occurs 1× in each claimed witness; 曹山 25×/28×; 0/19 content fields verbatim. The true Zhaozhou witness in the reference set is X68n1315 (趙州 251×; the document title 趙州真際禪師語錄 verbatim there). Reproduce: `head -c 24 /tmp/refs/ref_T47n1987A.txt` (→ 曹山大師語錄序…); `python3 -c "t=open('/tmp/refs/ref_T47n1987A.txt').read();print(t.count('趙州'),t.count('曹山'))"` (→ 1 25); `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc zhaozhou_yulu` (→ content 0/19, NOT_FOUND 19).
  - **labeling** — coverage_note "15 signature encounter dialogues excerpted from T1987" is contradicted by the 0/19 measurement (reproduce: `grep -o "excerpted from T1987" data/corpus/zhaozhou_yulu.json`).

- **proposed_label:** A project retelling of fifteen signature Zhaozhou cases — 0/19 content fields verbatim in the claimed T47n1987A/B (the Caoshan record) or in the true Zhaozhou witness X68n1315 — so it must be labelled a retelling, not a witness excerpt, and the T1987 citation must be corrected.

---

### `baojing_sanmei`

- **doc / claimed witness(es):** `baojing_sanmei` / `T47n1986A`, `T47n1986B`
- **reference sha256 (first 16) + length in graphs:** `T47n1986A` `c53e4ffde1dccb93` … / 15,843 graphs; `T47n1986B` `7ed62050f1b6321d` … / 8,596 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **2/6**, flags by class {"DIVERGENT": 3, "NOT_FOUND": 1} (full content summary {"EXACT": 2, "DIVERGENT": 3, "NOT_FOUND": 1}); metadata (title/name, excluded from the denominator) {"TITLE_COMPOSITE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (5 flagged fields = every non-EXACT/non-EMPTY field of the 7-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field found in the union of the claimed witnesses, hit/total; cross-ref = the same windows searched against the other 35 refs, only non-zero hits shown):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.36 | T47n1986A | no | — | — | — |
| `.stanzas[1].zh` | DIVERGENT | 0.9375 | T47n1986B | no | — | — | — |
| `.stanzas[2].zh` | DIVERGENT | 0.9375 | T47n1986A | no | — | — | — |
| `.stanzas[3].zh` | DIVERGENT | 0.875 | T47n1986A | no | — | — | — |
| `.stanzas[5].zh` | NOT_FOUND | 0.8333 | T47n1986A | no | — | 3/17, 0/13, 0/9, 0/1 | none-of-39 |

- **candidate_older_witness:** In-CBETA candidates ranked by measured stanza coverage: T47n1986A 2/6 = T47n1986B 2/6 (both carry the full song) > X80n1565 1/6. All three carriers agree against the data on the four divergent points (銀盌/銀怨 vs data 銀碗; 亦赴 vs 便赴; 俱非 vs 共忌; 如臨寶鏡形影相覩 vs 如面臨鏡容色相覷), and the data's readings return 0 hits in all 39 refs — a recension matching the data's text would be OUT-OF-CBETA — human sourcing required, not agent work.

- **label_state:** recension_note ABSENT, editorial_note ABSENT, coverage_note ABSENT — inconsistent: 4/6 stanzas are recension-variant against all three CBETA carriers and nothing in the document discloses that.

- **p0_findings:**
  - **source-integrity** — 4/6 stanzas are not verbatim in either claimed witness, and all three CBETA carriers agree against the data: T47n1986A 銀盌盛雪…來機亦赴…背觸俱非…如臨寶鏡形影相覩; T47n1986B 銀怨盛雪…來機亦赴…背觸俱非…如臨寶鏡形影相覩; X80n1565 銀盌盛雪…來機亦赴…背觸俱非…如臨寶鏡形影相覩 — the data reads 銀碗盛雪/來機便赴/背觸共忌/如面臨鏡容色相覷, none of which occurs in any of the 39 refs. Reproduce: `grep -c 銀碗盛雪 /tmp/refs/*.txt | grep -v ":0"` (→ no output); `grep -o "銀盌盛雪\|銀怨盛雪" /tmp/refs/ref_T47n1986A.txt /tmp/refs/ref_T47n1986B.txt /tmp/refs/ref_X80n1565.txt` (→ one hit per file); `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc baojing_sanmei` (→ 2/6, DIVERGENT 3, NOT_FOUND 1).
  - **labeling** — No recension_note or coverage_note exists although the measured recension divergence (4/6 stanzas) is material to any verbatim claim (reproduce: `grep -c "recension_note" data/corpus/baojing_sanmei.json` and `grep -c "coverage_note" data/corpus/baojing_sanmei.json` → both 0; the same grep returns a non-zero hit for any of the nine docs that carry a note).

- **proposed_label:** The 寶鏡三昧 text follows a recension that matches no CBETA witness in the reference set — 2/6 stanzas verbatim in T47n1986A/B, 4/6 diverging from all three carriers, which agree with each other against the data — so a recension_note is required before any verbatim claim may be made.

---

### `dongshan_yulu`

- **doc / claimed witness(es):** `dongshan_yulu` / `T47n1986A`, `T47n1986B`
- **reference sha256 (first 16) + length in graphs:** `T47n1986A` `c53e4ffde1dccb93` … / 15,843 graphs; `T47n1986B` `7ed62050f1b6321d` … / 8,596 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **1/21**, flags by class {"DIVERGENT": 8, "NOT_FOUND": 12} (full content summary {"EXACT": 1, "DIVERGENT": 8, "NOT_FOUND": 12}); metadata (title/name, excluded from the denominator) {"EXACT": 7, "NOT_FOUND": 1, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 4}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (27 flagged fields = every non-EXACT/non-EMPTY field of the 35-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field found in the union of the claimed witnesses, hit/total; cross-ref = the same windows searched against the other 35 refs, only non-zero hits shown):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.67 | T47n1986B | no | — | — | — |
| `.five_ranks[0].verse_zh` | DIVERGENT | 0.9524 | T47n1986B | no | — | — | — |
| `.five_ranks[0].commentary_zh` | NOT_FOUND | 0.0 | — | no | — | 0/25, 0/21, 0/17, 0/9 | none-of-39 |
| `.five_ranks[1].verse_zh` | NOT_FOUND | 0.0 | — | no | — | 0/14, 0/10, 0/6, n/a | none-of-39 |
| `.five_ranks[1].commentary_zh` | NOT_FOUND | 0.0 | — | no | — | 0/17, 0/13, 0/9, 0/1 | none-of-39 |
| `.five_ranks[2].verse_zh` | DIVERGENT | 0.9524 | T47n1986B | no | — | — | — |
| `.five_ranks[2].commentary_zh` | NOT_FOUND | 0.0 | — | no | — | 0/18, 0/14, 0/10, 0/2 | none-of-39 |
| `.five_ranks[3].verse_zh` | DIVERGENT | 0.9048 | T47n1986B | no | — | — | — |
| `.five_ranks[3].commentary_zh` | NOT_FOUND | 0.0 | — | no | — | 0/17, 0/13, 0/9, 0/1 | none-of-39 |
| `.five_ranks[4].commentary_zh` | NOT_FOUND | 0.0 | — | no | — | 0/20, 0/16, 0/12, 0/4 | none-of-39 |
| `.dialogues[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.dialogues[0].dialogue[0].zh` | NOT_FOUND | 0.7612 | T47n1986A | no | — | 13/60, 1/56, 0/52, 0/44 | none-of-39 |
| `.dialogues[0].dialogue[1].zh` | DIVERGENT | 0.975 | T47n1986B | no | — | — | — |
| `.dialogues[1].title_zh` | TITLE_COMPOSITE | 0.5 | T47n1986A | no | — | — | — |
| `.dialogues[1].dialogue[0].zh` | NOT_FOUND | 0.7692 | T47n1986A | no | — | 2/6, 0/2, n/a, n/a | none-of-39 |
| `.dialogues[1].dialogue[1].zh` | DIVERGENT | 0.9615 | T47n1986A | no | — | — | — |
| `.dialogues[1].dialogue[2].zh` | DIVERGENT | 0.9062 | T47n1986B | no | — | — | — |
| `.dialogues[2].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.dialogues[2].dialogue[0].zh` | NOT_FOUND | 0.8444 | T47n1986B | no | — | 9/38, 2/34, 0/30, 0/22 | {"T47n1998A": "11/22", "T48n2001": "7/22", "T48n2003": "14/22"} |
| `.dialogues[3].dialogue[0].zh` | DIVERGENT | 0.9615 | T47n1986B | no | — | — | — |
| `.dialogues[4].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.dialogues[4].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | {"T47n1997": "2/2", "T47n1998A": "2/2", "T48n2003": "2/2", "X68n1315": "2/2"} |
| `.dialogues[5].title_zh` | SHORT_UNMATCHED | 0.375 | T47n1986A | no | — | n/a (≤6 graphs) | — |
| `.dialogues[5].dialogue[0].zh` | NOT_FOUND | 0.6154 | T47n1986B | no | — | 1/6, 0/2, n/a, n/a | none-of-39 |
| `.dialogues[6].dialogue[0].zh` | DIVERGENT | 0.875 | T47n1986A | no | — | — | — |
| `.dialogues[7].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.dialogues[7].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/12, 0/8, 0/4, n/a | none-of-39 |

- **candidate_older_witness:** In-CBETA candidates ranked by measured (normalized) coverage of the 21 content fields: T47n1986B 1/21 verbatim (the 兼中到 verse) + 8 DIVERGENT at 0.875–0.975; X80n1565 2/21 (anthology); T47n1987B 曹洞語錄 0/21 verbatim but carries the source of the five 曹山 commentaries (正位即空界…背理就事); T51n2076 0/21. The 偏中正 recension the data uses (白頭宮女卸殘妝…) returns 0 hits in all 39 refs → for that recension, OUT-OF-CBETA — human sourcing required, not agent work.

- **label_state:** coverage_note PRESENT — "8 canonical encounter dialogues excerpted from T1986 / X1321": the count (8 dialogues) is consistent; T1986 is a claimed witness (partially supported: 1/21 content verbatim overall); X1321 is the Mazu record (attested title 江西馬祖道一禪師語錄) and is not a claimed witness — a false citation. recension_note ABSENT — inconsistent with the measured 偏中正 recension gap and the paraphrased 曹山 commentaries.

- **p0_findings:**
  - **source-integrity** — All 5 five_ranks.commentary_zh (曹山曰…) are not verbatim in any of the 39 refs — they are paraphrases (正位即是空界…捨理就事 vs the actual Caoshan commentary 正位即空界…背理就事 in T47n1987B 曹洞語錄, which is not a claimed witness of this document). Reproduce: `python3 -c "t=open('/tmp/refs/ref_T47n1987B.txt').read();i=t.find('五位君臣旨訣');print(t[i:i+60])"`; `grep -c 正位即是空界 /tmp/refs/*.txt | grep -v ":0"` (→ no output); `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc dongshan_yulu` (→ five_ranks commentaries all NOT_FOUND 0.0).
  - **source-integrity** — 4/5 five_ranks verse_zh follow a recension absent from CBETA: 偏中正 白頭宮女卸殘妝… returns 0 hits in all 39 refs, while the claimed T47n1986B carries 失曉老婆逢古鏡… (present in 6 refs); 正中偏 昔 vs witness 舊, 正中來 出 vs 隔, 兼中至 相交/沖 vs 交鋒/冲. The river-story field .dialogues[0].dialogue[0].zh is a rewrite: 涉水睹影 (0 hits in all 39 refs) vs witness 過水睹影; 歸鄉去 vs 莫歸鄉去. Reproduce: `grep -c 白頭宮女 /tmp/refs/*.txt | grep -v ":0"` (→ no output); `grep -c 涉水睹影 /tmp/refs/*.txt | grep -v ":0"` (→ no output); `grep -c 過水睹影 /tmp/refs/ref_T47n1986A.txt /tmp/refs/ref_T47n1986B.txt` (→ 1 1).
  - **labeling** — coverage_note cites X1321 — the Mazu record (attested title 江西馬祖道一禪師語錄), not a claimed witness and unrelated to the content — and no recension_note exists for the measured verse-recension gap (reproduce: `grep -o "excerpted from T1986 / X1321" data/corpus/dongshan_yulu.json`).

- **proposed_label:** The Five Ranks verses follow a recension absent from CBETA (偏中正 白頭宮女卸殘妆… in no ref of the 39-work set; the claimed T47n1986B carries 失曉老婆逢古鏡…), the five 曹山 commentaries are paraphrases verbatim in no ref (the source text lives in T47n1987B 曹洞語錄, not a claimed witness), and 1/21 content fields is verbatim — so a recension_note and the T47n1987B citation are required.

---

### `yunmen_yulu`

- **doc / claimed witness(es):** `yunmen_yulu` / `T47n1988`
- **reference sha256 (first 16) + length in graphs:** `T47n1988` `38b9347dda4c5f5c` … / 43,678 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/12**, flags by class {"DIVERGENT": 1, "NOT_FOUND": 11} (full content summary {"DIVERGENT": 1, "NOT_FOUND": 11}); metadata (title/name, excluded from the denominator) {"EXACT": 4, "NOT_FOUND": 2, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 3}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (19 flagged fields = every non-EXACT/non-EMPTY field of the 23-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field found in the union of the claimed witnesses, hit/total; cross-ref = the same windows searched against the other 35 refs, only non-zero hits shown):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.sections[0].title_zh` | TITLE_COMPOSITE | 0.67 | T47n1988 | no | — | — | — |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.4643 | T47n1988 | no | — | 1/21, 0/17, 0/13, 0/5 | none-of-39 |
| `.sections[1].title_zh` | TITLE_COMPOSITE | 0.5 | T47n1988 | no | — | — | — |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.7714 | T47n1988 | no | — | 6/28, 0/24, 0/20, 0/12 | none-of-39 |
| `.sections[2].title_zh` | SHORT_UNMATCHED | 0.3333 | T47n1988 | no | — | n/a (≤6 graphs) | — |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[2].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[2].dialogue[2].zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[3].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[3].dialogue[0].zh` | NOT_FOUND | 0.6486 | T47n1988 | no | — | 10/30, 6/26, 2/22, 0/14 | {"X80n1565": "7/14"} |
| `.sections[4].dialogue[0].zh` | NOT_FOUND | 0.8438 | T47n1988 | no | — | 6/25, 0/21, 0/17, 0/9 | {"T47n1997": "1/9"} |
| `.sections[5].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/9, 0/5, 0/1, n/a | none-of-39 |
| `.sections[6].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.sections[6].dialogue[0].zh` | DIVERGENT | 0.9583 | T47n1988 | no | — | — | — |
| `.sections[7].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[7].dialogue[0].zh` | NOT_FOUND | 0.7273 | T47n1988 | no | — | 10/26, 6/22, 2/18, 0/10 | {"X80n1565": "7/10"} |
| `.sections[8].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | {"T47n1998A": "2/2", "T47n1998B": "2/2", "X68n1315": "2/2"} |
| `.sections[9].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.sections[9].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/9, 0/5, 0/1, n/a | none-of-39 |

- **candidate_older_witness:** T47n1988 (claimed; the correct work, 雲門匡真禪師廣錄) 0/12 verbatim. No other ref in the 39-work set carries the 12 fields verbatim; the closest measured proximity is X80n1565 (7/14 24-graph windows in .sections[3].dialogue[0].zh — formulaic proximity, not verbatim). No older near-complete recension is in CBETA → OUT-OF-CBETA — human sourcing required, not agent work.

- **label_state:** coverage_note PRESENT — "10 signature encounter dialogues and sermons from T1988": the count (10 sections) is consistent; T1988 is the correct work, but 0/12 content fields are verbatim in it, so "from T1988" is unsupported by measurement. recension_note ABSENT.

- **p0_findings:**
  - **source-integrity** — 11/12 content fields NOT_FOUND in T47n1988 (the correct work, 雲門匡真禪師廣錄); 0/12 verbatim; the coverage note's "from T1988" is unsupported by measurement (reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc yunmen_yulu` → content 0/12, NOT_FOUND 11, DIVERGENT 1 at 0.9583).

- **proposed_label:** Ten signature Yunmen dialogues retold in compressed phrasing — 0/12 content fields verbatim in T47n1988 (the correct work), 11 NOT_FOUND — so it must be labelled a retelling, not an excerpt from T1988.

---

### `fayan_yulu`

- **doc / claimed witness(es):** `fayan_yulu` / `T47n1991`
- **reference sha256 (first 16) + length in graphs:** `T47n1991` `c26a529c44aaa84e` … / 7,670 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **1/11**, flags by class {"NOT_FOUND": 9, "SHORT_UNMATCHED": 1} (full content summary {"EXACT": 1, "NOT_FOUND": 9, "SHORT_UNMATCHED": 1}); metadata (title/name, excluded from the denominator) {"EXACT": 3, "NOT_FOUND": 2, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 2}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (16 flagged fields = every non-EXACT/non-EMPTY field of the 20-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field found in the union of the claimed witnesses, hit/total; cross-ref = the same windows searched against the other 35 refs, only non-zero hits shown):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.65 | T47n1991 | no | — | — | — |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.6154 | T47n1991 | no | — | 2/32, 0/28, 0/24, 0/16 | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.5714 | T47n1991 | no | — | 1/7, 0/3, n/a, n/a | none-of-39 |
| `.sections[1].title_zh` | TITLE_COMPOSITE | 0.5 | T47n1991 | no | — | — | — |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.4333 | T47n1991 | no | — | 2/23, 0/19, 0/15, 0/7 | none-of-39 |
| `.sections[1].dialogue[1].zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.sections[1].dialogue[2].zh` | NOT_FOUND | 0.0 | — | no | — | 0/17, 0/13, 0/9, 0/1 | none-of-39 |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | — |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/60, 0/56, 0/52, 0/44 | none-of-39 |
| `.sections[3].dialogue[0].zh` | NOT_FOUND | 0.5 | T47n1991 | no | — | 3/17, 0/13, 0/9, 0/1 | none-of-39 |
| `.sections[5].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.sections[5].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/13, 0/9, 0/5, n/a | none-of-39 |
| `.sections[6].dialogue[0].zh` | NOT_FOUND | 0.6471 | T47n1991 | no | — | 3/10, 0/6, 0/2, n/a | none-of-39 |
| `.sections[7].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.sections[7].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/7, 0/3, n/a, n/a | none-of-39 |

- **candidate_older_witness:** T47n1991 (claimed) 1/11 verbatim (the 曹源一滴水 case); the other sections are compressed retellings of T1991 biographical/case material (measured 8-graph window hits 2/32, 2/23, 3/17, 3/10 in the flagged fields). X63n1226 (宗門十規論, per the document's own cbeta_note) is NOT in the 39-work manifest → the 綱要 field (.sections[2]) has no witness in the reference set at all (a coverage gap to flag, not repair). No older near-complete recension in CBETA → OUT-OF-CBETA — human sourcing required, not agent work.

- **label_state:** coverage_note PRESENT — "8 canonical sermons and dialogues from T1985 / X1321": the count (8 sections) is consistent; BOTH citations are to unrelated works (T47n1985 attested title 臨濟慧照玄公大宗師語錄; X69n1321 attested title 江西馬祖道一禪師語錄) and neither is a claimed witness. cbeta_note PRESENT (2026-08-08 correction: T47n1991 + X63n1226) — the pairing it states is consistent with cbeta_id, but X63n1226 is absent from the 39-work reference set, so the 宗門十規論 component has no collatable witness (undisclosed gap).

- **p0_findings:**
  - **labeling** — coverage_note "8 canonical sermons and dialogues from T1985 / X1321" cites two unrelated works: T47n1985 attested title 臨濟慧照玄公大宗師語錄 (the Linji record) and X69n1321 attested title 江西馬祖道一禪師語錄 (the Mazu record) — neither is a claimed witness and neither contains the content (reproduce: `head -c 24 /tmp/refs/ref_T47n1985.txt`; `head -c 20 /tmp/refs/ref_X69n1321.txt`; `grep -o "from T1985 / X1321" data/corpus/fayan_yulu.json`).
  - **source-integrity** — sections[2] 宗門十規論綱要 is a five-item project summary; the work it summarizes (X63n1226, per the document's own cbeta_note) is not in the 39-work reference set, so a claimed component of the document has no collatable witness at all (reproduce: `grep -c X63n1226 sessions/COLLATION_W1_2026-09-10_refs_manifest.txt` → 0).

- **proposed_label:** A project summary of eight Fayan items — 1/11 verbatim in T47n1991, the rest compressed retellings of T1991 biographical and case material, plus a five-point 宗門十規論 outline whose source work (X63n1226) has no witness in the reference set — so the coverage note's T1985/X1321 citations must be corrected and the un-collatable 十規論 component disclosed.

---

### `guiyang_yulu`

- **doc / claimed witness(es):** `guiyang_yulu` / `T47n1989`, `T47n1990`
- **reference sha256 (first 16) + length in graphs:** `T47n1989` `1473f11292a9f93d` … / 6,186 graphs; `T47n1990` `c06ae879fb7d2bce` … / 7,149 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/6**, flags by class {"NOT_FOUND": 6} (full content summary {"NOT_FOUND": 6}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 3, "TITLE_COMPOSITE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (10 flagged fields = every non-EXACT/non-EMPTY field of the 10-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field found in the union of the claimed witnesses, hit/total; cross-ref = the same windows searched against the other 35 refs, only non-zero hits shown):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.56 | T47n1989 | no | — | — | — |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.5 | T47n1989 | no | — | 4/25, 0/21, 0/17, 0/9 | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[2].zh` | NOT_FOUND | 0.72 | T47n1989 | no | — | 3/18, 0/14, 0/10, 0/2 | none-of-39 |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/34, 0/30, 0/26, 0/18 | none-of-39 |
| `.sections[1].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/19, 0/15, 0/11, 0/3 | none-of-39 |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/37, 0/33, 0/29, 0/21 | none-of-39 |

- **candidate_older_witness:** T47n1989 0/6, T47n1990 0/6 verbatim; no ref in the 39-work set carries any of the 6 fields verbatim (each field: 0 sixteen-graph windows in every ref). No older near-complete candidate in CBETA → OUT-OF-CBETA — human sourcing required, not agent work.

- **label_state:** recension_note ABSENT, editorial_note ABSENT, coverage_note ABSENT — inconsistent: 0/6 content fields are verbatim in either claimed witness (and in no ref of the 39-work set) and the title's 九十六圓相 claim is not represented by any field in the document.

- **p0_findings:**
  - **source-integrity** — All 6 content fields are absent from both claimed witnesses (T47n1989/T47n1990) and from all 39 refs (every field: 0 sixteen-graph windows in every ref) (reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc guiyang_yulu` → 0/6, NOT_FOUND 6).
  - **labeling** — The title 潭州溈山靈祐禪師語錄與溈仰九十六圓相 asserts the 九十六圓相, but no 圓相 content exists in the document's fields (the witnesses merely mention 圓相 2×/3×), and no coverage/recension note exists (reproduce: `python3 -c "import json;d=json.load(open('data/corpus/guiyang_yulu.json'));print([s['title_zh'] for s in d['sections']])"` → 3 section titles, no 圓相 material).

- **proposed_label:** Six Weishan/Yangshan dialogues present in no CBETA text of the reference set (0/6 verbatim in T47n1989/T47n1990; zero sixteen-graph windows in any of the 39 refs), and no 圓相 material despite the title's 九十六圓相 claim — so it must be labelled a retelling with no witness in the reference set and the 圓相 title claim dropped or the material added.

---

### `dahui_hongzhi`

- **doc / claimed witness(es):** `dahui_hongzhi` / `T47n1998A`, `T47n1998B`, `T48n2001`
- **reference sha256 (first 16) + length in graphs:** `T47n1998A` `eb71385d71e5c3ff` … / 182,132 graphs; `T47n1998B` `8b37b4663395ac69` … / 19,941 graphs; `T48n2001` `8b6d2fd2302e743b` … / 157,496 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/6**, flags by class {"NOT_FOUND": 6} (full content summary {"NOT_FOUND": 6}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 2, "TITLE_COMPOSITE": 3}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (11 flagged fields = every non-EXACT/non-EMPTY field of the 11-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field found in the union of the claimed witnesses, hit/total; cross-ref = the same windows searched against the other 35 refs, only non-zero hits shown):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.33 | T47n1998A | no | — | — | — |
| `.sections[0].title_zh` | TITLE_COMPOSITE | 0.57 | T48n2001 | no | — | — | — |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.7 | T48n2001 | no | — | 14/33, 9/29, 5/25, 0/17 | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/18, 0/14, 0/10, 0/2 | none-of-39 |
| `.sections[1].title_zh` | TITLE_COMPOSITE | 0.4 | T47n1998A | no | — | — | — |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.4468 | T47n1998A | no | — | 11/40, 7/36, 3/32, 0/24 | none-of-39 |
| `.sections[1].dialogue[1].zh` | NOT_FOUND | 0.4889 | T47n1998A | no | — | 13/38, 7/34, 3/30, 0/22 | none-of-39 |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/62, 0/58, 0/54, 0/46 | none-of-39 |
| `.sections[3].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[3].dialogue[0].zh` | NOT_FOUND | 0.6176 | T47n1998A | no | — | 8/27, 4/23, 0/19, 0/11 | none-of-39 |

- **candidate_older_witness:** All three claimed witnesses ARE the relevant works (T47n1998A 進大慧禪師語錄奏劄 182,132 graphs; T47n1998B 大慧普覺禪師宗門武庫 19,941; T48n2001 天童覺和尚語錄 157,496, attested titles) — there is no "older" question; the finding is that the 6 data fields are retellings verbatim in none of them. The canonical 默照銘 text is complete in T48n2001 (默默忘言…不要賺舉), so a future fix target is verifiable in CBETA (not done here — measurement only).

- **label_state:** cbeta_note PRESENT — "Corrected 2026-08-08: dropped unverified '/T2001' pairing; the 看話書問 (letters) material is the 示/答 sections of the 語錄 itself (T47n1998A)": internally inconsistent with the document, whose title still presents the 默照銘 (a T48n2001 text) and whose letter fields are verbatim in T47n1998A 0/4 (measured). No coverage_note, no recension_note.

- **p0_findings:**
  - **source-integrity** — The 默照銘 fields are not the witness text: the data matches T48n2001 only through 露月星河 (phrase 9 of the poem) and then diverges — witness 雪松雲嶠 vs data 雪覆夜沼, witness 功忘照中 vs data 功見照中 — and the tail lines 水天一色/纖塵無表/深根不動/只這箇是 return 0 hits in all 39 refs (reproduce: `grep -c 雪覆夜沼 /tmp/refs/*.txt | grep -v ":0"` (→ no output); `grep -c 只這箇是 /tmp/refs/*.txt | grep -v ":0"` (→ no output); `python3 -c "t=open('/tmp/refs/ref_T48n2001.txt').read();i=t.find('默默忘言');print(t[i:i+56])"` → …露月星河雪松雲嶠…). The four 看話 letter fields (sections 1–3) are likewise verbatim in T47n1998A/B 0/4 (破生死底大刀斧, 單提這箇無字, 官事佛事, 大疑大悟 all 0 hits in all 39 refs).
  - **attribution** — The public manifest citation (cbeta "T1998A") omits T48n2001 天童覺和尚語錄, the actual witness of the 默照銘 the document's title presents; the data cbeta_note records T2001 being dropped on 2026-08-08 but the title claim remains (reproduce: `grep -o '"cbeta": "T1998A"' data/corpus_manifest.json`; `grep -o "宏智禪師 默照銘" data/corpus/dahui_hongzhi.json`; `head -c 16 /tmp/refs/ref_T48n2001.txt` → 天童覺和尚語錄…).
  - **attribution** — section[1]'s title names the recipient 張九成, who does not occur in the claimed witness T47n1998A at all (reproduce: `grep -c 張九成 /tmp/refs/ref_T47n1998A.txt` → 0).

- **proposed_label:** Four 看話 passages and the 默照銘 are condensed retellings (0/6 verbatim in T47n1998A/B or T48n2001) — the 默照銘 fields stop at the poem's ninth phrase and continue with lines absent from every ref in the set — so the public citation must name T48n2001 (the poem's actual witness) and the text must be labelled a retelling.

---

### `yuanwu_letters`

- **doc / claimed witness(es):** `yuanwu_letters` / `T47n1997`, `X69n1357`
- **reference sha256 (first 16) + length in graphs:** `T47n1997` `f643beee3fce96d8` … / 134,134 graphs; `X69n1357` `c05a9ccfda625acc` … / 62,651 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/2**, flags by class {"NOT_FOUND": 2} (full content summary {"NOT_FOUND": 2}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 2, "TITLE_COMPOSITE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (5 flagged fields = every non-EXACT/non-EMPTY field of the 5-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field found in the union of the claimed witnesses, hit/total; cross-ref = the same windows searched against the other 35 refs, only non-zero hits shown):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.55 | T47n1997 | no | — | — | — |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/35, 0/31, 0/27, 0/19 | none-of-39 |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/38, 0/34, 0/30, 0/22 | none-of-39 |

- **candidate_older_witness:** Both claimed witnesses are in the reference set (T47n1997 134,134 graphs; X69n1357 62,651 graphs); neither — nor any of the other 37 refs — carries the two letter fields (each: 0 sixteen-graph windows in every ref). No older near-complete candidate in CBETA → OUT-OF-CBETA — human sourcing required, not agent work.

- **label_state:** recension_note ABSENT, editorial_note ABSENT, coverage_note ABSENT — inconsistent: 0/2 content fields are verbatim in either claimed witness (and in no ref of the 39-work set).

- **p0_findings:**
  - **source-integrity** — Both content fields (42 and 45 graphs) are absent from both claimed witnesses (T47n1997, X69n1357) and from all 39 refs (each: 0 sixteen-graph windows in every ref); no notes disclose this (reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc yuanwu_letters` → 0/2, NOT_FOUND 2; `grep -c 本分真人 /tmp/refs/*.txt | grep -v ":0"` (→ no output); `grep -c 聞者皆死 /tmp/refs/*.txt | grep -v ":0"` (→ no output)).

- **proposed_label:** Two Yuanwu "letters" (42 and 45 graphs) present in neither claimed witness (T47n1997, X69n1357) nor in any of the 39 refs — so they must be labelled project-authored retellings with no witness in the reference set.

---

## Ranking — which document is worst, and why

Ranked 1 (worst) → 9 (best) by measured severity: fraction of content not verbatim in the claimed witness, whether the public citation names the wrong work, whether the text is absent from *all* 39 refs (fabrication risk), and whether a canonical fixed text is involved.

1. **zhaozhou_yulu** — the only document in the family whose public citation names the wrong work: the claimed
   T47n1987A/B is the Caoshan record (attested titles 曹山大師語錄 / 曹洞語錄), 0/19 content fields are verbatim in it, and the
   master's own name 趙州 occurs once in each claimed witness while 曹山 occurs 25×/28×. The content is genuine Zhaozhou
   material retold in compressed phrasing — but the public T1987 claim is flatly false on the pinned witness.
2. **dahui_hongzhi** — a canonical, fixed poem (the 默照銘) is presented with a fabricated tail: the data matches T48n2001
   only through phrase 9 (露月星河) and then diverges (雪松雲嶠 → 雪覆夜沼; 功忘照中 → 功見照中), and its tail lines
   (水天一色, 纖塵無表, 深根不動, 只這箇是) occur in no ref of the 39-work set. The public citation omits T48n2001, the
   poem's actual witness, and a named recipient (張九成) is absent from the claimed witness.
3. **guiyang_yulu** — the strongest measured absence in the family: 0/6 content fields, every field with zero
   sixteen-graph windows in every one of the 39 refs; the title overclaims 九十六圓相 that no field represents; and no
   coverage/recension note exists at all.
4. **yuanwu_letters** — 0/2: both fields (42/45 graphs) absent from both claimed witnesses and from all 39 refs, with no
   notes of any kind. Smallest document, but 100% unattested and 100% undisclosed.
5. **fayan_yulu** — the coverage note cites two unrelated works (T1985 = the Linji record, X1321 = the Mazu record —
   both attested by their witness titles), 1/11 content fields is verbatim in the actual witness T47n1991, and one
   claimed component (宗門十規論, X63n1226) has no witness in the reference set at all.
6. **yunmen_yulu** — 0/12 content fields verbatim in T47n1988 (the right work, 11 NOT_FOUND); the coverage note's "from
   T1988" is unsupported by measurement; the text is compressed retelling with formulaic proximity to X80n1565 only.
7. **dongshan_yulu** — 1/21 verbatim; the Five Ranks verses follow a recension absent from CBETA (白頭宮女卸殘妆… in no
   ref) while the claimed T47n1986B carries a different verse; the five 曹山 commentaries are paraphrases verbatim in
   no ref (the source text lives in the unclaimed T47n1987B); the coverage note cites the unrelated X1321.
8. **baojing_sanmei** — 2/6 verbatim; 4/6 stanzas diverge from all three CBETA carriers, which agree with each other
   against the data; zero notes. A clean recension problem, but the witness text exists and is identified in CBETA.
9. **linji_yulu** — best in the family: 84/89 content fields EXACT; the 2 MINOR flags are fully explained and verified
   (㽄/㴸 inside the witness's own <g> apparatus); the 3 NOT_FOUND flags are per-field-labelled project retellings; the
   coverage note's counts match this measurement exactly. Its worst residual (73 project-composed section headings) is
   title metadata outside the content denominator.

## What this is not

No file under `data/`, `docs/`, `sessions/`, `scripts/` or `.github/` was touched (verified: `git diff --name-only` over the whole branch shows only the §11 path list). No re-keying, no label edits, no schema changes — the P0 findings above are filed for the next work packages (prompts 007–009), not repaired here. No rights assessment (`rights_manifest.json` sources remain human-reviewed by standing decision), and no text absent from CBETA was sourced or generated: where the older near-complete recension is not in CBETA, the line above says `OUT-OF-CBETA — human sourcing required, not agent work`, and it stops there.
