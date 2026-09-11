# W1 Witness Inventory — family 2 (T45/T48/T51 documents + the witness-unavailable pair)

**Generated:** 2026-09-11 · **Task:** 007a — independent witness inventory (prompt `007a-inventory-t48-t51.md`, retrieved from `origin/_orch`: 10,524 B, sha256 `1159dc87342c03d5…`) · **Role:** measurement only — nothing under `data/`, `docs/`, `sessions/`, `scripts/`, `.github/` was modified.
**Base:** branch `arena/01a092aa-translatechan` at `3c838db` (main). This file is the only artifact in this commit; no other path is touched.

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
- **Collation command line (family-2 evidence run):** `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --refs-manifest sessions/COLLATION_W1_2026-09-10_refs_manifest.txt --compare-register sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json --corrects sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d --require-verified-refs --out /tmp/inv-full.json` — all 35 documents in one run (no subsetting); the 14 below are in scope. Per-document evidence runs use `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc <key> --out /tmp/<key>.json`. Registers are written to `/tmp`, never the repo.
- **Published register compared against (baseline for Δ):** `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (generated 2026-09-10, same upstream revision).
- **Measurement semantics used below (calibrated against family 1 before any number was recorded):** "verbatim-in-witness" = the classifier's `norm()` of the field is a substring of `norm()` of the reference; "windows" = distinct k-graph windows of the field **as written** (NFKC + CJK-only, *without* the graphic-variant map) found in the union of the claimed witnesses, hit/total, at k = 8/12/16/24; cross-ref = the same 24-graph windows against the other 38 refs. The method was calibrated by re-deriving family 1's published numbers for `linji_yulu` `.sections[71]/[72]/[73].dialogue[0].zh` exactly (0/46, 0/42, 0/38, 0/30 and 24/105, 12/101, 5/97, 0/89, with cross-ref {T47n1998A 5/89, T51n2076 3/89, X80n1565 7/89}) before this run was used.

### Witness identities, verified from the pinned XML (not from memory)

| claimed witness | attested `<title level="m">` in the pinned file |
|---|---|
| `T48n2005` | 無門關 |
| `T48n2003` | 佛果圜悟禪師碧巖錄 |
| `T48n2014` | 永嘉證道歌 |
| `T48n2010` | 信心銘 |
| `T48n2008` | 六祖大師法寶壇經 |
| `T48n2007` | 南宗頓教最上大乘摩訶般若波羅蜜經六祖惠能大師於韶州大梵寺施法壇經 |
| `T48n2009` | 少室六門 |
| `T48n2012A` | 黃檗山斷際禪師傳心法要 |
| `T48n2012B` | 黃檗斷際禪師宛陵錄 |
| `T45n1858` | 肇論 |
| `T51n2075` | 曆代法寶記 |
| `T48n2025` | 勅修百丈清規 |
| `X63n1245` | (重雕補註)禪苑清規 |
| `X80n1565` | 五燈會元 |

Every attribution claim in this file is checked against this table and against the extracted reference text.

### §2 Scope — computed from the live `DOCS` map, not from the prompt

Method: parse `scripts/collate_corpus.py`'s `DOCS` object and apply the ownership rules in order — (1) exclude the nine keys task 006 owns (`linji_yulu`, `zhaozhou_yulu`, `baojing_sanmei`, `dongshan_yulu`, `yunmen_yulu`, `fayan_yulu`, `guiyang_yulu`, `dahui_hongzhi`, `yuanwu_letters`); (2) exclude the X-series set, which task 007b owns; (3) add back, by the prompt's precedence rule, the four keys whose witness list touches X but which are assigned to this task (`qinggui_monastic_codes`, `shitou_sandokai`, `hanshan_poems`, `niutou_juezhu`). All 35 `DOCS` keys are covered by 9 + 14 + 12 = 35.

**Computed list (14):** `biyanlu_cases`, `bodhidharma_erru`, `hanshan_poems`, `huangbo_chuanxin`, `huangbo_wanling`, `lidai_fabao_ji`, `niutou_juezhu`, `platform_sutra`, `qinggui_monastic_codes`, `sengzhao_zhaolun`, `shitou_sandokai`, `wumenguan`, `xinxin_ming`, `zhengdao_ge`.

**Count: 14 documents = 12 in the collation table + 2 in the witness-unavailable section** (`hanshan_poems`, `niutou_juezhu`). **This matches the prompt's authoring-time enumeration exactly** — `diff` of my computed set against the prompt's list is empty, so no difference has to be reported. Two consequences worth recording: `qinggui_monastic_codes` (T48n2025 + X63n1245) and `shitou_sandokai` (T51n2076 + X80n1565) do cite X-series works and are here only by the prompt's precedence rule.

### §3 Base check

```
git rev-parse --abbrev-ref HEAD   # arena/01a092aa-translatechan   (the pre-provisioned arena branch; no new branch created)
git rev-parse --short HEAD        # 3c838db                        (main at the merge commit for the 006 inventory PR)
git status --porcelain            # empty at start of run
```

### §6 Self-test — a check on *this run*, not on the data

The published register predates four merged remediations. Measured on current `main`, with refs 39/39 byte-verified:

| doc | register (stale) | measured by this run | movement |
|---|---|---|---|
| `wumenguan` | 113/181, {NOT_FOUND 15, DIVERGENT 48, MINOR 5} | **174/181, 7 flags {NOT_FOUND 1, MINOR 6}** | moved ✓ |
| `biyanlu_cases` | 353/395, 42 non-EXACT content fields | **373/395, 22 flags {MINOR 22}** | moved ✓ |
| `xinxin_ming` | 24/37, 13 flags | **36/37, 1 flag {NOT_FOUND 1}** | moved ✓ |
| `zhengdao_ge` | 6/6, 0 flags | **6/6, 0 flags** | unchanged on purpose ✓ |

Three rows moved and one did not, exactly as §6 requires, so this run is collating current `main` and not the stale register. `git status --porcelain` was empty before the run and no corpus file was written to; the only diff is this new file.

### `iter_fields()` walk — exact per-doc field counts (nothing skipped)

Per §8 trap 1 this is the harness's own enumeration (`scripts/collate_corpus.py::iter_fields`, fully recursive, gated by `SRC_KEYS`), run on each data file — not inferred from a neighbouring constant. Every count below equals the entry's `fields_total`.

| doc | fields reached | content fields | title/name fields |
|---|---|---|---|
| `biyanlu_cases` | 496 | 395 | 101 |
| `bodhidharma_erru` | 10 | 6 | 4 |
| `hanshan_poems` | 5 | 4 | 1 |
| `huangbo_chuanxin` | 22 | 11 | 11 |
| `huangbo_wanling` | 12 | 7 | 5 |
| `lidai_fabao_ji` | 7 | 3 | 4 |
| `niutou_juezhu` | 9 | 5 | 4 |
| `platform_sutra` | 24 | 13 | 11 |
| `qinggui_monastic_codes` | 9 | 5 | 4 |
| `sengzhao_zhaolun` | 8 | 4 | 4 |
| `shitou_sandokai` | 14 | 11 | 3 |
| `wumenguan` | 230 | 181 | 49 |
| `xinxin_ming` | 38 | 37 | 1 |
| `zhengdao_ge` | 7 | 6 | 1 |

## Per-document blocks

Fields per block, exactly as in family 1: doc / claimed witness(es) / reference sha256 (first 16) + length in graphs; `my_measured`; `per_flag` (path, class, sim, ref, verbatim-in-witness, probe-verbatim, windows 8/12/16/24, cross-ref of the other 38 refs); `candidate_older_witness`; `label_state`; `p0_findings` (each with the command that reproduces it); `proposed_label`. "collated X/Y" = content fields classified EXACT+REWORDED over all content fields (titles are metadata, measured separately, outside the content denominator).

### `biyanlu_cases`

- **doc / claimed witness(es):** `biyanlu_cases` / `T48n2003`
- **reference sha256 (first 16) + length in graphs:** `T48n2003` `47678e84c49a270a` … / 111,150 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **373/395**, flags by class {"MINOR": 22} (full content summary {"EXACT": 373, "MINOR": 22}); metadata (title/name, excluded from the denominator) {"EXACT": 15, "NOT_FOUND": 11, "SHORT_UNMATCHED": 71, "TITLE_COMPOSITE": 4}. Δ vs register baseline: **353/395 {"EXACT": 353, "MINOR": 22, "DIVERGENT": 12, "NOT_FOUND": 7, "SHORT_UNMATCHED": 1} → 373/395 {"EXACT": 373, "MINOR": 22}**
- **per_flag:** (108 flagged fields = every non-EXACT/non-EMPTY field of the 496-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 108 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.cases[0].title_zh` | TITLE_COMPOSITE | 0.6 | T48n2003 | no | — | — | — |
| `.cases[0].commentary_zh` | MINOR | 0.999 | T48n2003 | no | — | — | — |
| `.cases[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.cases[3].title_zh` | TITLE_COMPOSITE | 0.56 | T48n2003 | no | — | — | — |
| `.cases[4].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.cases[5].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | none-of-39 |
| `.cases[6].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.cases[8].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[9].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[10].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[10].commentary_zh` | MINOR | 0.9991 | T48n2003 | no | — | — | — |
| `.cases[11].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[12].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[14].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[15].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[16].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[17].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[18].title_zh` | SHORT_UNMATCHED | 0.375 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[19].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[19].commentary_zh` | MINOR | 0.9993 | T48n2003 | no | — | — | — |
| `.cases[21].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[22].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[25].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[26].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[27].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[27].commentary_zh` | MINOR | 0.9982 | T48n2003 | no | — | — | — |
| `.cases[28].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[28].commentary_zh` | MINOR | 0.9981 | T48n2003 | no | — | — | — |
| `.cases[29].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[30].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[31].title_zh` | SHORT_UNMATCHED | 0.3333 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[32].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[33].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[35].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[36].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[36].commentary_zh` | MINOR | 0.9976 | T48n2003 | no | — | — | — |
| `.cases[37].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[38].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[39].title_zh` | SHORT_UNMATCHED | 0.3333 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[40].title_zh` | SHORT_UNMATCHED | 0.375 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[41].title_zh` | SHORT_UNMATCHED | 0.3333 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[42].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[42].commentary_zh` | MINOR | 0.9982 | T48n2003 | no | — | — | — |
| `.cases[43].commentary_zh` | MINOR | 0.9947 | T48n2003 | no | — | — | — |
| `.cases[44].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[45].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[45].commentary_zh` | MINOR | 0.998 | T48n2003 | no | — | — | — |
| `.cases[46].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[47].title_zh` | SHORT_UNMATCHED | 0.6 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[49].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[50].title_zh` | SHORT_UNMATCHED | 0.3333 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[52].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[54].title_zh` | SHORT_UNMATCHED | 0.375 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[55].title_zh` | SHORT_UNMATCHED | 0.5556 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[55].commentary_zh` | MINOR | 0.9981 | T48n2003 | no | — | — | — |
| `.cases[56].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[57].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[58].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[59].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[60].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[61].title_zh` | SHORT_UNMATCHED | 0.375 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[62].title_zh` | SHORT_UNMATCHED | 0.375 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[63].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[64].title_zh` | TITLE_COMPOSITE | 0.67 | T48n2003 | no | — | — | — |
| `.cases[64].pointer_zh` | MINOR | 0.9844 | T48n2003 | no | — | — | — |
| `.cases[65].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[65].dialogue[0].zh` | MINOR | 0.9878 | T48n2003 | no | — | — | — |
| `.cases[65].commentary_zh` | MINOR | 0.9971 | T48n2003 | no | — | — | — |
| `.cases[66].title_zh` | SHORT_UNMATCHED | 0.3333 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[67].title_zh` | SHORT_UNMATCHED | 0.5 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[68].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[69].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | none-of-39 |
| `.cases[71].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[72].title_zh` | SHORT_UNMATCHED | 0.4444 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[72].commentary_zh` | MINOR | 0.9986 | T48n2003 | no | — | — | — |
| `.cases[73].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[74].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[75].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | none-of-39 |
| `.cases[75].commentary_zh` | MINOR | 0.9986 | T48n2003 | no | — | — | — |
| `.cases[77].title_zh` | TITLE_COMPOSITE | 0.67 | T48n2003 | no | — | — | — |
| `.cases[78].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[78].dialogue[0].zh` | MINOR | 0.9841 | T48n2003 | no | — | — | — |
| `.cases[78].commentary_zh` | MINOR | 0.9937 | T48n2003 | no | — | — | — |
| `.cases[79].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[80].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[80].commentary_zh` | MINOR | 0.9972 | T48n2003 | no | — | — | — |
| `.cases[81].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[81].commentary_zh` | MINOR | 0.9952 | T48n2003 | no | — | — | — |
| `.cases[82].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[83].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[84].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[85].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[86].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | none-of-39 |
| `.cases[87].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[88].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[88].verse_zh` | MINOR | 0.9833 | T48n2003 | no | — | — | — |
| `.cases[89].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[90].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[91].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.cases[93].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | none-of-39 |
| `.cases[94].title_zh` | SHORT_UNMATCHED | 0.3333 | T48n2003 | no | — | n/a (≤6 graphs) | — |
| `.cases[95].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[96].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | none-of-39 |
| `.cases[96].pointer_zh` | MINOR | 0.9851 | T48n2003 | no | — | — | — |
| `.cases[97].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[98].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | none-of-39 |
| `.cases[98].commentary_zh` | MINOR | 0.9992 | T48n2003 | no | — | — | — |
| `.cases[99].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |

- **candidate_older_witness:** Near-complete is defined for this document as carrying the whole 碧巖錄 100-case text; measured by normalized verbatim coverage of its 395 content fields, the claimed `T48n2003` carries **373/395** and no other work comes within two orders of magnitude: `T48n2001` 20/395, `X68n1315` 12/395, `T47n1997` 12/395, `T47n1998A` 7/395, everything else ≤2. Every non-claimed hit is quotation overlap inside another compendium, so there is no rival near-complete copy and no re-key candidate in the 39 refs. Nothing in the refs evidences a witness older than the claimed one; the two single-graph readings that are absent from T48n2003 (below) are `OUT-OF-CBETA — human sourcing required, not agent work` if a source is wanted for them.

- **label_state:** coverage_note PRESENT, and every count in it verifies exactly: it claims 373/395 and 108 residual flags — measured 373/395 with 22 MINOR content fields (17 `commentary_zh`, 2 `pointer_zh`, 2 dialogue `zh`, 1 `verse_zh` — the note's own breakdown) plus 86 `title_zh` metadata flags (71 SHORT_UNMATCHED, 11 NOT_FOUND, 4 TITLE_COMPOSITE). Its two re-key references check out: the note's "case 20" and "case 96" are `.cases[19].editorial_note` and `.cases[95].dialogue[0].editorial_note` (1-based), both present. recension_note ABSENT — not needed: no material recension divergence was measured. A graph-by-graph opcode census of the 22 MINOR fields splits them 20/2: 20 carry a graph the pinned XML declares only as a `<g>` glyph — raw glyph text 㦬/㘞/㞘/䗫/㵎, or the `charDecl` normalized form 璿/剜/鐙/懂/陡/澗/壒 — which the extraction rule strips, so the residual graph is edition-graphic; 2 (`.cases[10].commentary_zh` 築, `.cases[64].pointer_zh` 看) carry a single project graph the witness does not have.

- **p0_findings:**
  - **source-integrity** — 2 of the 22 MINOR content fields are NOT witness text at the flagged graph. `.cases[10].commentary_zh` reads 「…濟於大愚脇下**築**三拳…」 where T48n2003 reads 「脇下三拳」 — 築 occurs 0× in the pinned XML and 0× in the extracted reference. `.cases[64].pointer_zh` ends 「…是向上人事。試舉**看**」 where the witness reads 「…是向上人事。試舉。」 followed by the next case marker; 看 is not at that position in the witness (the witness uses 試舉看 at 60 other places in the same file, so the graph exists — just not here). Both are single-graph residues out of 395 content fields; the other 20 MINOR fields carry a graph the pinned XML declares only as a `<g>` glyph — either the glyph's own text the extraction rule strips (`grep -o '<g ref="#CB01334">.' /tmp/xmlp5/T/T48/T48n2003.xml` → 㦬, as in `.cases[0].commentary_zh`; 㘞/㞘/䗫/㵎 likewise) or a `charDecl` normalized form of such a glyph (`<char xml:id="CB05361">` declares 壒 / U+213D6 for the glyph 𡏖, as in `.cases[88].verse_zh`; 璿/剜/鐙/懂/陡/澗 likewise — the pinned file carries 39 `<g>` elements and 18 declared normalized forms). One of the 20, `.cases[88].verse_zh`, places its 壒 at the verse end where the witness reads 咄 followed by the next unit's 遍, a one-graph placement difference inside an otherwise `<g>`-explained field. The 20/2 split is the `difflib` opcode census of the 22 MINOR fields against their own best windows; the file is at `/tmp/xmlp5/T/T48/T48n2003.xml`. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc biyanlu_cases` → 373/395, {"EXACT": 373, "MINOR": 22}.
  - **labeling** — The coverage_note calls all 22 MINOR fields "edition-graphic residue"; the measurement splits them 20 `<g>`-glyph / 2 project readings, so the blanket description is 20/22 accurate. This is a wording fix, not a status change. Reproduce: `python3 minor.py 2` (helper used for this run) or the graph-level diff of `.cases[10].commentary_zh` against `cc.classify()`'s own window.

- **proposed_label:** A T48n2003 (碧巖錄) text: 373/395 content fields verbatim; the 22 MINOR residues are edition-graphic — 20 verified as graphs the pinned XML declares only as `<g>` glyphs (raw glyph text, or the charDecl normalized form) that the extraction rule strips, and 2 single-graph project readings (築, 看) the witness does not carry — and the 86 remaining flags are project-composed `title_zh` case headings outside the content denominator.

---

### `bodhidharma_erru`

- **doc / claimed witness(es):** `bodhidharma_erru` / `T48n2009`
- **reference sha256 (first 16) + length in graphs:** `T48n2009` `3bfb3d0d54d9b6f3` … / 15,163 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **1/6**, flags by class {"DIVERGENT": 4, "NOT_FOUND": 1} (full content summary {"EXACT": 1, "DIVERGENT": 4, "NOT_FOUND": 1}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 4}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (9 flagged fields = every non-EXACT/non-EMPTY field of the 10-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 9 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | n/a, n/a, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[1].zh` | DIVERGENT | 0.973 | T48n2009 | no | — | — | — |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | DIVERGENT | 0.9583 | T48n2009 | no | — | — | — |
| `.sections[1].dialogue[1].zh` | DIVERGENT | 0.9577 | T48n2009 | no | — | — | — |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.6615 | T48n2009 | no | — | 38/58, 29/54, 21/50, 13/42 | {"T51n2076": "13/42"} |
| `.sections[2].dialogue[1].zh` | DIVERGENT | 0.9492 | T48n2009 | no | — | — | — |

- **candidate_older_witness:** Near-complete is defined for this document as carrying all six section fields of the 二種入 text. Two carriers exist in the refs and neither is complete in the project's wording: the claimed `T48n2009` (少室六門; the text is its third section) carries each field as 89–100% contiguous witness runs (21/21, 72/74, 88/96, 63/71, 59/65, 55/59 graphs) but only 1/6 fields verbatim as a whole field, while `T51n2076` carries 2/6 fields verbatim (the same text quoted inside the 傳燈錄). Measured verbatim coverage: `T51n2076` 2/6 > claimed `T48n2009` 1/6; by fragment coverage the claimed witness is the fuller carrier of the project's six fields. Neither is demonstrably older from anything in the refs, and the oldest witnesses of this text are not in the 39 refs at all: `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** **No notes at all** — recension_note, editorial_note and coverage_note ABSENT; the record carries only `cbeta_id` "T2009". That is inconsistent with the measurement: 5 of 6 content fields are flagged (4 DIVERGENT at 0.949–0.973 — witness text plus project enumeration headings 一報冤行/二隨緣行/三無所求行/四稱法行 and single graphs 但/俱, 言/文, 都/皆, 我/皆 — and 1 NOT_FOUND at 0.6615 whose 8-graph windows are 38/58 present while the witness replaces its second half with other text). The project title 「達摩大師 二入四行論」 also names neither the witness's attested title (少室六門) nor the section's own head (第三門二種入), and the record does not say the text is a section of a collection.

- **p0_findings:**
  - **source-integrity** — The six content fields are witness-derived but not witness text as written: against T48n2009 the diffs are single graphs and framing — 但/俱 (「深信含生同一真性**但**為客塵…」 vs the witness's 俱), 言/文, 都/皆, and the enumeration headings (data 「一報冤行修道行人…」 where the witness reads 「冤行。謂修道行人…」, the heading being a project addition) — and the 三無所求行 field is further re-arranged (NOT_FOUND at 0.6615 while 38/58 of its 8-graph windows and 13/42 of its 24-graph windows sit in the witness; its second half 「經云有求皆苦無求即樂判知無求真為道行故言無所求行」 is replaced there by 「功德黑暗常相隨逐三界久居猶如火宅有身皆苦誰得而安」). Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc bodhidharma_erru` → 1/6, {"EXACT": 1, "DIVERGENT": 4, "NOT_FOUND": 1}.
  - **attribution** — The citation names T2009 with the conventional work title 二入四行論; the pinned witness's attested title is 少室六門 and the text is its third section, whose own head is 第三門二種入. Reproduce: `grep -o '<title level="m" xml:lang="zh-Hant">[^<]*' /tmp/xmlp5/T/T48/T48n2009.xml` → 少室六門; `grep -c '第三門二種入' /tmp/xmlp5/T/T48/T48n2009.xml` → 1.
  - **labeling** — Zero notes on a document whose five of six content fields do not match the witness verbatim, and whose second in-CBETA carrier (T51n2076, 2/6 verbatim) is not mentioned. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/bodhidharma_erru.json'));print([k for k in d if 'note' in k])"` → [] .

- **proposed_label:** A 二種入 text reproduced from T48n2009 少室六門 (third section, head 第三門二種入): 1/6 fields verbatim, 4/6 at 0.949–0.973 differing by single graphs (但/俱, 言/文, 都/皆) and one field further re-arranged — a recension_note and an attribution to the collection's third section are required before any verbatim claim.

---

### `huangbo_chuanxin`

- **doc / claimed witness(es):** `huangbo_chuanxin` / `T48n2012A`
- **reference sha256 (first 16) + length in graphs:** `T48n2012A` `8f46065b6d1be313` … / 6,632 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **2/11**, flags by class {"MINOR": 1, "DIVERGENT": 2, "NOT_FOUND": 6} (full content summary {"EXACT": 2, "MINOR": 1, "DIVERGENT": 2, "NOT_FOUND": 6}); metadata (title/name, excluded from the denominator) {"EXACT": 2, "NOT_FOUND": 1, "SHORT_UNMATCHED": 7, "TITLE_COMPOSITE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (18 flagged fields = every non-EXACT/non-EMPTY field of the 22-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 18 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | MINOR | 0.9851 | T48n2012A | no | — | — | — |
| `.sections[0].dialogue[1].zh` | DIVERGENT | 0.9714 | T48n2012A | no | — | — | — |
| `.sections[1].title_zh` | TITLE_COMPOSITE | 0.5 | T48n2012A | no | — | — | — |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.7059 | T48n2012A | no | — | 28/44, 24/40, 20/36, 12/28 | {"T51n2076": "12/28"} |
| `.sections[2].title_zh` | SHORT_UNMATCHED | 0.5 | T48n2012A | no | — | n/a (≤6 graphs) | — |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/33, 0/29, 0/25, 0/17 | none-of-39 |
| `.sections[3].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.sections[3].dialogue[0].zh` | DIVERGENT | 0.9762 | T48n2012A | no | — | — | — |
| `.sections[4].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.sections[5].dialogue[0].zh` | NOT_FOUND | 0.3235 | T48n2012A | no | — | 2/27, 0/23, 0/19, 0/11 | none-of-39 |
| `.sections[6].title_zh` | SHORT_UNMATCHED | 0.375 | T48n2012A | no | — | n/a (≤6 graphs) | — |
| `.sections[7].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.sections[7].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/28, 0/24, 0/20, 0/12 | none-of-39 |
| `.sections[8].title_zh` | SHORT_UNMATCHED | 0.375 | T48n2012A | no | — | n/a (≤6 graphs) | — |
| `.sections[8].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/22, 0/18, 0/14, 0/6 | none-of-39 |
| `.sections[9].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.sections[9].dialogue[0].zh` | NOT_FOUND | 0.5 | T48n2012A | no | — | 1/13, 0/9, 0/5, n/a | none-of-39 |

- **candidate_older_witness:** Near-complete is defined for this document as carrying all 11 section fields. Measured verbatim coverage: claimed `T48n2012A` **2/11**; `T48n2012B` **0/11** — so the two recensions do not cross-match this document's content at all, which is the §9 cross-match answer for the A/B pair. No other ref carries any field verbatim, and five of the six NOT_FOUND fields have zero 8-graph windows in any of the 39 refs; the sixth, `.sections[1].dialogue[0].zh`, shares its first 28 graphs with `T51n2076` (12/28 at k=24), so for that sermon the honest carrier is the 傳燈錄, not the claimed 傳心法要. There is no in-CBETA near-complete carrier for the text as written; a witness matching it is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** coverage_note PRESENT but its claim is not supported: it reads "10 foundational sermons and dialogues from T2012A" while the measurement gives 2/11 verbatim, 1 MINOR (variant 蹤/縱, 0.9851), 2 DIVERGENT (0.9714/0.9762) and 6 NOT_FOUND — the note discloses none of the nine non-verbatim fields. recension_note ABSENT, editorial_note ABSENT. Inconsistent: the document asserts T2012A provenance that 9 of its 11 content fields do not bear out.

- **p0_findings:**
  - **labeling** — The coverage_note's "from T2012A" is contradicted by measurement: 9 of the 11 content fields are not the witness's text — 2 DIVERGENT (0.9714/0.9762) and 6 NOT_FOUND at field level; of the six, only `.sections[1].dialogue[0].zh` has any k=24 windows anywhere (12/28 in T51n2076), while the other five have zero 8-graph windows in all 39 refs. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc huangbo_chuanxin` → 2/11, {"EXACT": 2, "MINOR": 1, "DIVERGENT": 2, "NOT_FOUND": 6}.
  - **source-integrity** — The fields that do match are witness text at a distance: `.sections[0].dialogue[1].zh` reads 「…不可**度**量…」 where T48n2012A reads 「…不可**測**度…」, and `.sections[3].dialogue[0].zh` ends 「…即是佛**也**」 where the best witness window reads 「…即是佛」 with the next unit's 八 at the edge (opcode replace 也→八, 0.9762). `.sections[1].dialogue[0].zh` (NOT_FOUND, 0.7059) is the 傳燈錄 paraphrase cited above. Reproduce: the collator run above; the opcodes are each field's `difflib` diff against its own best window.
  - **attribution** — The record's own title says the material is 傳心法要 (T48n2012A, attested title `grep -o '<title level="m" xml:lang="zh-Hant">[^<]*' /tmp/xmlp5/T/T48/T48n2012A.xml` → 黃檗山斷際禪師傳心法要); the six NOT_FOUND fields cannot be attributed to it, and `.sections[1].dialogue[0].zh` measures to T51n2076 instead.

- **proposed_label:** A project selection loosely following T48n2012A (傳心法要): only 2/11 content fields are verbatim in the claimed witness, nine are not, and one of the six NOT_FOUND fields is a 傳燈錄 paraphrase, so the coverage note's "from T2012A" must give way to a provenance label recording that most of the text is unattributed paraphrase.

---

### `huangbo_wanling`

- **doc / claimed witness(es):** `huangbo_wanling` / `T48n2012B`
- **reference sha256 (first 16) + length in graphs:** `T48n2012B` `94a75d508303b70b` … / 4,534 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/7**, flags by class {"DIVERGENT": 1, "NOT_FOUND": 6} (full content summary {"DIVERGENT": 1, "NOT_FOUND": 6}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 5}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (12 flagged fields = every non-EXACT/non-EMPTY field of the 12-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 12 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/8, 0/4, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/31, 0/27, 0/23, 0/15 | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/14, 0/10, 0/6, n/a | none-of-39 |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/8, 0/4, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/26, 0/22, 0/18, 0/10 | none-of-39 |
| `.sections[1].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/20, 0/16, 0/12, 0/4 | none-of-39 |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/37, 0/33, 0/29, 0/21 | none-of-39 |
| `.sections[3].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/7, 0/3, n/a, n/a | none-of-39 |
| `.sections[3].dialogue[0].zh` | DIVERGENT | 0.9333 | T48n2012B | no | — | — | — |
| `.sections[3].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/29, 0/25, 0/21, 0/13 | none-of-39 |

- **candidate_older_witness:** Near-complete is defined for this document as carrying all 7 section fields. Measured verbatim coverage of the 39 refs: **0/7 for every ref**, including the claimed `T48n2012B` (宛陵錄, 4,534 graphs) itself. The 裴公 story's namesake 裴休 occurs in 7 refs but not in T48n2012B (which writes 裴相公) — and `T48n2012A`/`B` cross-match each other 0 times on this document. No in-CBETA carrier matches the text as written: a witness that would is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** One editorial_note PRESENT (`.sections[3]`: "Moved from the T2012A-labelled seed on 2026-08-08… Unit-level collation remains pending") and a `cbeta_id` "T2012B"; coverage_note ABSENT, recension_note ABSENT. Partially labelled: the note concedes for one unit what the measurement shows for the whole document — 0/7 content fields verbatim in the claimed witness, and 0/7 in all 39 refs.

- **p0_findings:**
  - **source-integrity** — Every content field is flagged: 1 DIVERGENT (0.9333 — 「休問諸佛…」 vs the witness 「別問諸佛…」) + 6 NOT_FOUND, and the 24-graph windows of the NOT_FOUND fields return no hits in any of the 39 refs. The text as written is nowhere in CBETA's 39 works; the famous 裴休/壁上畫像 and 噇酒糟漢 material is retold, not quoted. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc huangbo_wanling` → 0/7; and `python3 -c "print([(w,open('/tmp/refs/ref_'+w+'.txt').read().count('裴休')) for w in ('T48n2012A','T48n2012B')])"` → [('T48n2012A', 1), ('T48n2012B', 0)].
  - **labeling** — The record names the 宛陵錄 as its witness but only one unit carries a note admitting pending collation; there is no coverage_note stating that nothing in the document is verbatim in T48n2012B. Reproduce: `grep -c 'coverage_note' data/corpus/huangbo_wanling.json` → 0.

- **proposed_label:** A project retelling bearing the 宛陵錄 name: 0/7 content fields are verbatim in the claimed T48n2012B or in any of the 39 refs, so it must be labelled a retelling pending the unit-level collation its own §3 note already concedes.

---

### `lidai_fabao_ji`

- **doc / claimed witness(es):** `lidai_fabao_ji` / `T51n2075`
- **reference sha256 (first 16) + length in graphs:** `T51n2075` `25a6810288964758` … / 25,101 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/3**, flags by class {"NOT_FOUND": 3} (full content summary {"NOT_FOUND": 3}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 4}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (7 flagged fields = every non-EXACT/non-EMPTY field of the 7-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 7 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/7, 0/3, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.4528 | T51n2075 | no | — | 6/46, 0/42, 0/38, 0/30 | none-of-39 |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/63, 0/59, 0/55, 0/47 | none-of-39 |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/39, 0/35, 0/31, 0/23 | none-of-39 |

- **candidate_older_witness:** Near-complete is defined for this document as carrying all 3 section fields. Measured verbatim coverage: the claimed `T51n2075` (曆代法寶記, 25,101 graphs) 0/3, and 0/3 for all 39 refs. Fragment measurement: `.sections[0].dialogue[0].zh` condenses two witness runs (20 of 53 graphs at ref@8,796/@8,808), while `.sections[1]` and `.sections[2]` share no 8-graph run with the witness at all. The record's second cited witness, the Dunhuang manuscript **P.2125**, is not in CBETA and not in the 39 refs: `candidate_older_witness: OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** **No notes at all** — only `cbeta_id` "T2075 / P.2125". Inconsistent: 0/3 content fields are verbatim in the in-CBETA witness, and the record's second witness (P.2125) is out of CBETA, so no measurement here can support the citation. recension_note, editorial_note and coverage_note all ABSENT.

- **p0_findings:**
  - **source-integrity** — 0/3 verbatim; the one measurable field is a condensation (20/53 graphs in two witness runs) and two fields share nothing ≥8 graphs with T51n2075 or any ref. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc lidai_fabao_ji` → 0/3, {"NOT_FOUND": 3}.
  - **attribution** — The record cites T2075 **and** P.2125. P.2125 is not in CBETA and not in the reference set, so the document's claim to follow it is unverifiable by any agent measurement — it is a human-sourcing item. Reproduce: `python3 -c "import json;print(json.load(open('data/corpus/lidai_fabao_ji.json'))['cbeta_id'])"` → T2075 / P.2125; `ls /tmp/refs | grep -c P2125` → 0.

- **proposed_label:** A précis of 歷代法寶記 material: 0/3 content fields are verbatim in T51n2075 (field 1 condenses two witness runs at @8,796/@8,808; fields 2–3 are paraphrase absent from all 39 refs), and the record's second witness P.2125 is outside CBETA — labelling plus human sourcing required.

---

### `platform_sutra`

- **doc / claimed witness(es):** `platform_sutra` / `T48n2008`, `T48n2007`
- **reference sha256 (first 16) + length in graphs:** `T48n2008` `71a340cb4b01ad28` … / 26,043 graphs; `T48n2007` `4f6ac8de1ae5abb8` … / 12,124 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **4/13**, flags by class {"DIVERGENT": 1, "NOT_FOUND": 8} (full content summary {"EXACT": 4, "DIVERGENT": 1, "NOT_FOUND": 8}); metadata (title/name, excluded from the denominator) {"EXACT": 1, "NOT_FOUND": 10}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (19 flagged fields = every non-EXACT/non-EMPTY field of the 24-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 19 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.chapters[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.chapters[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/7, 0/3, n/a, n/a | none-of-39 |
| `.chapters[1].dialogue[0].zh` | NOT_FOUND | 0.7167 | T48n2008 | no | — | 25/53, 20/49, 16/45, 8/37 | none-of-39 |
| `.chapters[1].dialogue[1].zh` | NOT_FOUND | 0.74 | T48n2007 | no | — | 11/43, 6/39, 2/35, 0/27 | none-of-39 |
| `.chapters[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.chapters[2].zh` | NOT_FOUND | 0.6867 | T48n2008 | no | — | 19/76, 8/72, 3/68, 0/60 | none-of-39 |
| `.chapters[3].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.chapters[4].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.chapters[4].dialogue[0].zh` | NOT_FOUND | 0.7273 | T48n2008 | no | — | 34/48, 22/44, 11/40, 1/32 | none-of-39 |
| `.chapters[5].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/7, 0/3, n/a, n/a | none-of-39 |
| `.chapters[5].zh` | NOT_FOUND | 0.4286 | T48n2008 | no | — | 11/49, 7/45, 3/41, 0/33 | none-of-39 |
| `.chapters[6].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/10, 0/6, 0/2, n/a | none-of-39 |
| `.chapters[6].zh` | NOT_FOUND | 0.8082 | T48n2008 | no | — | 29/66, 17/62, 7/58, 0/50 | {"T51n2076": "29/50", "X67n1309": "2/50"} |
| `.chapters[7].title_zh` | NOT_FOUND | 0.7692 | T48n2008 | no | — | 1/6, 0/2, n/a, n/a | none-of-39 |
| `.chapters[7].zh` | DIVERGENT | 0.9444 | T48n2008 | no | — | — | — |
| `.chapters[8].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/7, 0/3, n/a, n/a | none-of-39 |
| `.chapters[8].zh` | NOT_FOUND | 0.759 | T48n2008 | no | — | 28/76, 11/72, 4/68, 0/60 | none-of-39 |
| `.chapters[9].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.chapters[9].zh` | NOT_FOUND | 0.5211 | T48n2008 | no | — | 10/64, 3/60, 0/56, 0/48 | none-of-39 |

- **candidate_older_witness:** Near-complete is defined for this document as carrying all 13 source-content fields; no witness does, and none can, because 9 of the 13 fields (567 of 680 graphs) are project précis that are verbatim in neither recension. Measured among the refs: `T48n2008` 3/13, `T48n2007` 1/13 (both claimed), `X80n1565` 1/13, `T48n2003` 1/13, `T47n1997` 1/13. The oldest-near-complete rule therefore cannot choose a better witness for the text as written; it governs the *re-key* decision, for which the primary witness is T48n2007 (Dunhuang) and the alternative T48n2008 (宗寶) — both in CBETA and in the refs, so no `OUT-OF-CBETA` line applies.

- **label_state:** recension_note ×14, coverage_note and a root note all PRESENT, and every number in the coverage_note verifies exactly: 1 field (20 graphs) verbatim in the primary T48n2007 (`.chapters[0].verses[2]` at offset 1,496); 3 fields (20+20+53 = 93 graphs) verbatim in the alternative T48n2008 (`.chapters[0].verses[0]`@4,141, `.chapters[0].verses[1]`@4,799, `.chapters[3].dialogue[0]`@9,871); 9 fields (567 graphs) précis verbatim in neither — 113 witness graphs + 567 project graphs = 680 ✓. The 10 chapter headings are labelled as the 宗寶 division and attested in neither witness, which the notes state. Consistent.

- **p0_findings:**
  - **NONE** — No P0. The document is 9/13 project condensation, but it says so in the root recension_note and the coverage_note; the residual 1 DIVERGENT + 8 NOT_FOUND content fields are exactly those declared précis, and the metadata NOT_FOUND 10 are the declared 宗寶 chapter frame. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc platform_sutra` → 4/13, {"EXACT": 4, "DIVERGENT": 1, "NOT_FOUND": 8}; and `python3 -c "t=open('/tmp/refs/ref_T48n2007.txt').read();print(t.find('菩提本無樹明鏡亦無臺佛性常清淨何處有塵埃'))"` → 1496 (the one Dunhuang-verbatim field).

- **proposed_label:** A mixed-recension text, labelled as such: 4/13 content fields are witness text (1 in the Dunhuang primary T48n2007, 3 in the 宗寶 alternative T48n2008) and 9/13 — 567 of 680 graphs — are condensed project précis verbatim in neither witness, with the 宗寶 chapter frame declared a reading convenience.

---

### `qinggui_monastic_codes`

- **doc / claimed witness(es):** `qinggui_monastic_codes` / `T48n2025`, `X63n1245`
- **reference sha256 (first 16) + length in graphs:** `T48n2025` `583f60b9f593a68a` … / 61,532 graphs; `X63n1245` `2866f7fec3feee1d` … / 38,014 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/5**, flags by class {"NOT_FOUND": 5} (full content summary {"NOT_FOUND": 5}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 3, "TITLE_COMPOSITE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (9 flagged fields = every non-EXACT/non-EMPTY field of the 9-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 9 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.36 | X63n1245 | no | — | — | — |
| `.sections[0].title_zh` | NOT_FOUND | 0.7273 | T48n2025 | no | — | 1/4, n/a, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.3261 | T48n2025 | no | — | 2/39, 0/35, 0/31, 0/23 | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/37, 0/33, 0/29, 0/21 | none-of-39 |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/52, 0/48, 0/44, 0/36 | none-of-39 |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.8077 | X63n1245 | no | — | 22/45, 14/41, 9/37, 1/29 | none-of-39 |
| `.sections[2].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/31, 0/27, 0/23, 0/15 | none-of-39 |

- **candidate_older_witness:** Near-complete is defined for this document as carrying all 5 section fields; no ref does. Measured verbatim coverage: claimed `T48n2025` 0/5 and claimed `X63n1245` 0/5, and 0/5 across the 39 refs. Fragment measurement gives partial provenance: `.sections[0].dialogue[0].zh` carries the 百丈 phrase 一日不作一日不食 (9 graphs at T48n2025@10,064) inside a project narrative, and `.sections[2].dialogue[0].zh` is a condensation of the 坐禪儀 passage — 25/52 graphs in T48n2025 (@39,993) and 36/52 in X63n1245 (@25,973) — while `.sections[0].dialogue[1]`, `.sections[1]` and `.sections[2].dialogue[1]` share no 8-graph run with either witness. No in-CBETA carrier matches the text as written: a matching witness is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** **No notes at all** — only `cbeta_id` "T2025 / X1245". Inconsistent: 0/5 content fields are verbatim in either claimed witness, and nothing discloses that the document is a composite condensing material from both of them plus project text. recension_note, editorial_note and coverage_note all ABSENT.

- **p0_findings:**
  - **source-integrity** — 0/5 verbatim in either claimed witness and in all 39 refs; two fields have measurable but non-contiguous provenance (百丈's 一日不作一日不食 at T48n2025@10,064; the 坐禪儀 passage 36/52 in X63n1245@25,973) and three fields have none. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc qinggui_monastic_codes` → 0/5; `grep -o '一日不作一日不食' /tmp/refs/ref_T48n2025.txt | wc -l` → 2.
  - **labeling** — A composite document citing two different 清規 (T48n2025 敕修百丈清規 and X63n1245 禪苑清規) with no note saying which field comes from which, and no coverage note. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/qinggui_monastic_codes.json'));print([k for k in d if 'note' in k])"` → [] .

- **proposed_label:** A 清規 composite: 0/5 content fields are verbatim in the claimed T48n2025/X63n1245 or in any of the 39 refs; measurable provenance is partial (一日不作一日不食 at T48n2025@10,064; the 坐禪儀 passage 36/52 in X63n1245@25,973) — a composite/no-attribution label is required.

---

### `sengzhao_zhaolun`

- **doc / claimed witness(es):** `sengzhao_zhaolun` / `T45n1858`
- **reference sha256 (first 16) + length in graphs:** `T45n1858` `44bb1b16320a2fc6` … / 15,960 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/4**, flags by class {"NOT_FOUND": 4} (full content summary {"NOT_FOUND": 4}); metadata (title/name, excluded from the denominator) {"TITLE_COMPOSITE": 4}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (8 flagged fields = every non-EXACT/non-EMPTY field of the 8-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 8 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.31 | T45n1858 | no | — | — | — |
| `.sections[0].title_zh` | TITLE_COMPOSITE | 0.36 | T45n1858 | no | — | — | — |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.6531 | T45n1858 | no | — | 20/42, 11/38, 7/34, 0/26 | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 1/45, 0/41, 0/37, 0/29 | none-of-39 |
| `.sections[1].title_zh` | TITLE_COMPOSITE | 0.5 | T45n1858 | no | — | — | — |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/44, 0/40, 0/36, 0/28 | none-of-39 |
| `.sections[2].title_zh` | TITLE_COMPOSITE | 0.25 | T45n1858 | no | — | — | — |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.3889 | T45n1858 | no | — | 5/29, 1/25, 0/21, 0/13 | none-of-39 |

- **candidate_older_witness:** Near-complete is defined for this document as carrying all 4 section fields; no ref does. Measured verbatim coverage of the claimed `T45n1858` (肇論, 15,960 graphs): 0/4, and 0/4 for all 39 refs. Fragment measurement shows why: `.sections[0].dialogue[0].zh` is a **conflation**: 41 of its 49 graphs sit in three witness fragments — data[0:10]@1,094 and data[17:26]@1,564 / data[27:49]@1,574, the latter two 470 graphs after the first, `.sections[0].dialogue[1].zh` shares one 8-graph run (ref@1,454), `.sections[2].dialogue[0].zh` one 12-graph run (ref@13,289), and `.sections[1].dialogue[0].zh` (the 不真空論 passage) is absent from the witness and from all 39 refs. There is no re-key candidate for the text as written; a matching witness is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** **No notes at all** — only `cbeta_id` "T1858". Inconsistent with the measurement: 4/4 content fields are non-verbatim, one of them is a conflation of two separated witness passages, and one is absent from all 39 refs. recension_note, editorial_note and coverage_note all ABSENT.

- **p0_findings:**
  - **source-integrity** — 0/4 verbatim against the claimed 肇論. `.sections[0].dialogue[0].zh` splices the 物不遷論 opening (ref@1,094) onto a later passage (ref@1,564ff, 470 graphs away) into a single field — 41 of its 49 graphs are witness text but the field is not; `.sections[1].dialogue[0].zh` is the only field with 0 8-graph windows in the witness and 0 in all 39 refs. Reproduce: `python3 -c "t=open('/tmp/refs/ref_T45n1858.txt').read();print(t.find('夫生死交謝寒暑迭遷有'),t.find('旋嵐偃嶽而常靜'))"` → 1094 1564; `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc sengzhao_zhaolun` → 0/4.
  - **labeling** — A document with 0/4 collated content fields and no coverage/recension note of any kind. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/sengzhao_zhaolun.json'));print([k for k in d if 'note' in k])"` → [] .

- **proposed_label:** A 肇論 selection that is not witness text as written: 0/4 content fields are verbatim in T45n1858; `.sections[0].dialogue[0]` conflates two passages ~470 graphs apart in the witness and `.sections[1].dialogue[0]` is absent from all 39 refs — a source and recension label is required before any quotation claim.

---

### `shitou_sandokai`

- **doc / claimed witness(es):** `shitou_sandokai` / `T51n2076`, `X80n1565`
- **reference sha256 (first 16) + length in graphs:** `T51n2076` `a860907edd3d34b9` … / 358,501 graphs; `X80n1565` `a3d20a107ff69495` … / 581,588 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **6/11**, flags by class {"DIVERGENT": 4, "NOT_FOUND": 1} (full content summary {"EXACT": 6, "DIVERGENT": 4, "NOT_FOUND": 1}); metadata (title/name, excluded from the denominator) {"EXACT": 1, "SHORT_UNMATCHED": 1, "TITLE_COMPOSITE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (7 flagged fields = every non-EXACT/non-EMPTY field of the 14-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 7 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.46 | T51n2076 | no | — | — | — |
| `.sections[0].title_zh` | SHORT_UNMATCHED | 0.4444 | T51n2076 | no | — | n/a (≤6 graphs) | — |
| `.sections[0].stanzas[5].zh` | DIVERGENT | 0.9667 | T51n2076 | no | — | — | — |
| `.sections[0].stanzas[6].zh` | DIVERGENT | 0.9333 | T51n2076 | no | — | — | — |
| `.sections[0].stanzas[7].zh` | DIVERGENT | 0.95 | T51n2076 | no | — | — | — |
| `.sections[0].stanzas[9].zh` | DIVERGENT | 0.95 | T51n2076 | no | — | — | — |
| `.sections[1].stanzas[0].zh` | NOT_FOUND | 0.2381 | T51n2076 | no | — | 2/35, 0/31, 0/27, 0/19 | none-of-39 |

- **candidate_older_witness:** Near-complete is defined for this document as carrying both parts (the 參同契 verses and the 草庵歌). Measured verbatim coverage of the 11 content fields: claimed `T51n2076` **6/11**, claimed `X80n1565` **5/11**; no other ref carries any field. Stanza 3 of the 參同契 is a full 20/20 match at T51n2076@347,486 but only a 9/20 window at X80n1565@112,174, so T51n2076 is the fuller carrier and the ranking order is T51n2076 > X80n1565. Both are claimed, so no re-key is proposed.

- **label_state:** cbeta_note PRESENT (a 2026-08-08 volume correction) plus the harness's own `WITNESS_NOTES` string, but no data-level coverage_note or recension_note. Partially labelled — and one clause of the harness note does not survive measurement: it says "1 NOT_FOUND: the 草庵歌 body, absent from T51n2076 and X80n1565 alike". The 草庵歌 body **is** in T51n2076: `吾結草庵無寶貝…庵雖小含法界…住庵人…青松下` runs from offset 350,849 (`python3 -c "t=open('/tmp/refs/ref_T51n2076.txt').read();print(t.find('吾結草庵無寶貝'),t.find('庵雖小含法界'))"` → 350849 350904). What is absent from both witnesses is the *project's 42-graph wording* (2/35 eight-graph windows in T51n2076, 0/35 at k≥12; 0/35 in X80n1565) — a paraphrase gap, not an absent text.

- **p0_findings:**
  - **source-integrity** — 4 fields are DIVERGENT (0.93–0.97) and the 草庵歌 field is NOT_FOUND. The 草庵歌 field is a paraphrase of a text the claimed T51n2076 carries in full (see label_state); the four DIVERGENT fields are single-graph and phrasing gaps against the two claimed witnesses. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc shitou_sandokai` → 6/11, {"EXACT": 6, "DIVERGENT": 4, "NOT_FOUND": 1}.
  - **labeling** — The document carries no coverage/recension note of its own, and the harness note that stands in for one mis-states the 草庵歌 finding ("absent from T51n2076"). Reproduce: `grep -c '吾結草庵無寶貝' /tmp/refs/ref_T51n2076.txt` → 1; `grep -c '吾結草庵無寶貝' /tmp/refs/ref_X80n1565.txt` → 0.

- **proposed_label:** A two-part text: 6/11 content fields verbatim in the claimed witnesses (the 參同契 verses, stanza 3 in T51n2076 only), 4 fields at 0.93–0.97, and the 草庵歌 section a 42-graph paraphrase whose underlying text is present in full in T51n2076@350,849 — a coverage note stating exactly that is required, and the "absent from T51n2076" clause in the harness note must be corrected.

---

### `wumenguan`

- **doc / claimed witness(es):** `wumenguan` / `T48n2005`
- **reference sha256 (first 16) + length in graphs:** `T48n2005` `83a298cc4ab4f3be` … / 8,151 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **174/181**, flags by class {"MINOR": 6, "NOT_FOUND": 1} (full content summary {"EXACT": 174, "MINOR": 6, "NOT_FOUND": 1}); metadata (title/name, excluded from the denominator) {"EXACT": 47, "SHORT_UNMATCHED": 2}. Δ vs register baseline: **113/181 {"EXACT": 113, "MINOR": 5, "DIVERGENT": 48, "NOT_FOUND": 15} → 174/181 {"EXACT": 174, "MINOR": 6, "NOT_FOUND": 1}**
- **per_flag:** (9 flagged fields = every non-EXACT/non-EMPTY field of the 230-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 9 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.epilogue.zh` | NOT_FOUND | 0.0 | — | no | — | 0/42, 0/38, 0/34, 0/26 | none-of-39 |
| `.cases[2].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.cases[4].dialogue[0].zh` | MINOR | 0.9804 | T48n2005 | no | — | — | — |
| `.cases[10].commentary_zh` | MINOR | 0.9885 | T48n2005 | no | — | — | — |
| `.cases[13].title_zh` | SHORT_UNMATCHED | 0.375 | T48n2005 | no | — | n/a (≤6 graphs) | — |
| `.cases[14].dialogue[0].zh` | MINOR | 0.98 | T48n2005 | no | — | — | — |
| `.cases[15].commentary_zh` | MINOR | 0.9881 | T48n2005 | no | — | — | — |
| `.cases[16].commentary_zh` | MINOR | 0.9831 | T48n2005 | no | — | — | — |
| `.cases[41].dialogue[1].zh` | MINOR | 0.9867 | T48n2005 | no | — | — | — |

- **candidate_older_witness:** Near-complete is defined for this document as carrying the whole 無門關; ranked by measured verbatim coverage of its 181 content fields, the claimed `T48n2005` carries **174/181** (the only carrier of the work; 8,151 graphs) ≫ `X68n1315` 6/181, `X80n1565` 5/181, `X67n1309`/`T47n1997`/`T47n1998A`/`T48n2003` at 4/181 — every non-claimed hit is fragmentary quotation overlap. No re-key candidate exists in the refs, and nothing in them evidences an older copy: an older witness, if it exists outside CBETA, is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** coverage_note PRESENT and every count verified: it claims 174/181 and 9 residual flags — measured exactly 174/181 with 6 MINOR + 1 NOT_FOUND content flags and 2 `title_zh` metadata flags = 9. editorial_note PRESENT on `.epilogue` ("Project-authored verse; T48n2005 contains no epilogue") and the epilogue is the single NOT_FOUND field. Two of the note's claims were checked graph-by-graph instead of trusted: (i) `.cases[4].dialogue[0].zh` 啣 **is** the normalized form of the witness's own `<g ref="#CB03340">` glyph (`grep -o '<g ref="#CB03340">.' /tmp/xmlp5/T/T48/T48n2005.xml` → 1 hit), which the extraction rule strips — the field is witness text; (ii) the other five MINOR fields are five single-graph variant pairs 豎/竪, 查/査, 雙/双, 餐/飡, 敕/勅, each differing from the witness by exactly one graph. recension_note ABSENT — not needed: no material recension divergence was measured.

- **p0_findings:**
  - **NONE** — No source-integrity, attribution or labeling P0. The collation moved off the stale register exactly as predicted (§6), the residual flags are the labelled epilogue, two metadata titles and edition-graphic residue, and the document's own note describes them. Per §8 trap 2 no misspelling finding is filed for the five variant pairs or for the `<g>`-derived 啣: they are witness/edition graphs, and the only advisory observation is that the collator's `VARIANT` map does not cover 豎/竪, 查/査, 雙/双, 餐/飡, 敕/勅 (advisory by design). Reproduce: `python3 -c "t=open('/tmp/refs/ref_T48n2005.txt').read();print([(a,b) for a,b in [('豎','竪'),('查','査'),('雙','双'),('餐','飡'),('敕','勅')] if a not in t and b in t])"` → all five pairs.

- **proposed_label:** A T48n2005 (無門關) text — 174/181 content fields verbatim; the six MINOR residues are edition-graphic (five single-graph variant pairs 豎/竪, 查/査, 雙/双, 餐/飡, 敕/勅 and one `<g>`-glyph normalization, 啣 = CB03340, that the extraction rule strips) and the single NOT_FOUND field is the project-authored epilogue, labelled with no witness attribution.

---

### `xinxin_ming`

- **doc / claimed witness(es):** `xinxin_ming` / `T48n2010`
- **reference sha256 (first 16) + length in graphs:** `T48n2010` `9aaa3217647e519d` … / 588 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **36/37**, flags by class {"NOT_FOUND": 1} (full content summary {"EXACT": 36, "NOT_FOUND": 1}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 1}. Δ vs register baseline: **24/37 {"EXACT": 24, "DIVERGENT": 12, "NOT_FOUND": 1} → 36/37 {"EXACT": 36, "NOT_FOUND": 1}**
- **per_flag:** (2 flagged fields = every non-EXACT/non-EMPTY field of the 38-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 2 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.stanzas[31].zh` | NOT_FOUND | 0.75 | T48n2010 | no | — | 5/9, 1/5, 0/1, n/a | none-of-39 |

- **candidate_older_witness:** Near-complete is defined for this document as carrying all 37 stanza fields; by measured verbatim coverage the claimed `T48n2010` carries **36/37** (588 graphs — the work is short and the witness complete), followed by two compendium carriers that quote it in part: `X80n1565` 25/37 and `T51n2076` 24/37, then ≤2 for everything else. The claimed witness is the only near-complete in-CBETA carrier; the two partial carriers are quotation strata, not alternatives. No older copy is present in the 39 refs; anything older is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** coverage_note PRESENT and verified: it claims 36/37, 1 residual content field and 1 out-of-scope `title_zh` flag — measured exactly 36/37 with one NOT_FOUND (`.stanzas[31].zh`) and one metadata NOT_FOUND. editorial_note PRESENT on `.stanzas[31]` with the full reasoning (0 hits in T48n2010; the witness carries a different four-graph clause at that position, the same clause the document uses to open the following stanza). recension_note ABSENT — not needed: the one gap is a labelled project-authored reading, and no other stanza diverges.

- **p0_findings:**
  - **NONE** — No P0. The self-test row for this document moved 24/37 → 36/37 exactly as §6 requires, the single residual flag carries a per-field editorial_note, and the metadata flag is a `title_zh` outside the content denominator. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc xinxin_ming` → content 36/37, {"EXACT": 36, "NOT_FOUND": 1}.

- **proposed_label:** A T48n2010 (信心銘) text — 36/37 stanza fields verbatim; `.stanzas[31]`'s fourth clause is absent from the witness (full-text search, 0 hits) and is a labelled project-authored reading with no witness attribution.

---

### `zhengdao_ge`

- **doc / claimed witness(es):** `zhengdao_ge` / `T48n2014`
- **reference sha256 (first 16) + length in graphs:** `T48n2014` `d11dcda1e84c2e8c` … / 2,180 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **6/6**, flags by class {} (full content summary {"EXACT": 6}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (1 flagged fields = every non-EXACT/non-EMPTY field of the 7-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 1 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |

- **candidate_older_witness:** Near-complete is defined for this document as carrying all 6 stanza fields; the claimed `T48n2014` carries **6/6** (2,180 graphs — a complete short text) and `T51n2076` carries 5/6 (quotation overlap, the same poem quoted inside a compendium). The claimed witness is already the near-complete copy; there is no re-key candidate and nothing in the refs evidences an older copy.

- **label_state:** No notes of any kind (recension_note, editorial_note and coverage_note all ABSENT; the record carries only `cbeta_id` "T2014"). That is tolerable for content — 6/6 verbatim means there is no recension problem to disclose — but the one flag is the root `.title_zh`: the project title reads 「永嘉真覺大師 證道歌」 while the witness's attested title is 永嘉證道歌 (`grep -o '<title level="m" xml:lang="zh-Hant">[^<]*' /tmp/xmlp5/T/T48/T48n2014.xml` → 永嘉證道歌), so the record's title is a project heading with an author prefix, not witness text. A one-line coverage note would close the record.

- **p0_findings:**
  - **labeling** — Metadata-only: the document's `title_zh` is not the witness's attested title (永嘉真覺大師 證道歌 vs 永嘉證道歌) and no note discloses it. Content is unaffected (6/6 verbatim). Reproduce: the grep above plus `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc zhengdao_ge` → 6/6, metadata NOT_FOUND 1.

- **proposed_label:** A T48n2014 text: all 6 stanza fields are verbatim in 永嘉證道歌; the record's title 「永嘉真覺大師 證道歌」 is a project heading, and a coverage note stating 6/6 would make the record self-describing.

---

## The witness-unavailable pair — `hanshan_poems` / `niutou_juezhu`

These two documents cite **no** CBETA witness at all, so they get no collation table: the collator returns `WITNESS_UNAVAILABLE` for every content field without reading a reference, and there is nothing to rank. Stated plainly, as §7 requires:

### `hanshan_poems`

- **doc / claimed witness(es):** `hanshan_poems` / **(none — no CBETA witness claimed)**
- **reference sha256 (first 16) + length in graphs:** — none: no CBETA witness is claimed, so the collator produced `WITNESS_UNAVAILABLE` for every content field without reading a reference.
- **my_measured:** collated **0/4**, flags by class {"WITNESS_UNAVAILABLE": 4} (full content summary {"WITNESS_UNAVAILABLE": 4}); metadata (title/name, excluded from the denominator) {"WITNESS_UNAVAILABLE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (5 flagged fields = every non-EXACT/non-EMPTY field of the 5-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 5 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.stanzas[0].zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.stanzas[1].zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.stanzas[2].zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.stanzas[3].zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |

- **candidate_older_witness:** `candidate_older_witness: OUT-OF-CBETA — human sourcing required, not agent work`. The record cites no CBETA witness (`cbeta_id` "SBCK / Zoku lineage (not in Taishō)"), the collator produced WITNESS_UNAVAILABLE for all 4 content fields, and the 39 refs contain no Hanshan witness: 3 of the 4 content fields are verbatim in none of them, and the fourth (`.stanzas[0]` 吾心似秋月碧潭清皎潔無物堪比倫教我如何說) appears in `X80n1565` only as a 寒山偈 quoted inside another master's sermon, not as a witness copy.

- **label_state:** cbeta_note PRESENT and honest: "Volume removed 2026-08-08: prior 'taisho_vol 85' implied a Taishō location, contradicting the label — Hanshan's poems are not in Taishō proper (SBCK / Zokuzōkyō lineage)." There is no content to collate, so no recension/coverage problem arises; the record's status is `witness_unavailable`, which is the correct one.

- **p0_findings:**
  - **NONE** — No P0. The document states that its witness is not in Taishō and the measurement confirms no CBETA witness exists in the 39 refs (4/4 fields WITNESS_UNAVAILABLE, `refs_total` 0). The sourcing of an SBCK/Zokuzōkyō text is human work by standing decision. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc hanshan_poems` → 0/4, {"WITNESS_UNAVAILABLE": 4}.

- **proposed_label:** A witness-unavailable document: no CBETA witness exists for the 寒山詩 in the 39-work reference set, the record says so, and sourcing an SBCK/Zokuzōkyō copy is human work — no agent label can claim a witness here.

---

### `niutou_juezhu`

- **doc / claimed witness(es):** `niutou_juezhu` / **(none — no CBETA witness claimed)**
- **reference sha256 (first 16) + length in graphs:** — none: no CBETA witness is claimed, so the collator produced `WITNESS_UNAVAILABLE` for every content field without reading a reference.
- **my_measured:** collated **0/5**, flags by class {"WITNESS_UNAVAILABLE": 5} (full content summary {"WITNESS_UNAVAILABLE": 5}); metadata (title/name, excluded from the denominator) {"WITNESS_UNAVAILABLE": 4}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (9 flagged fields = every non-EXACT/non-EMPTY field of the 9-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 9 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.sections[0].title_zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.sections[0].dialogue[0].zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.sections[0].dialogue[1].zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.sections[1].title_zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.sections[1].dialogue[0].zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.sections[1].dialogue[1].zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.sections[2].title_zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |
| `.sections[2].dialogue[0].zh` | WITNESS_UNAVAILABLE | 0.0 | — | no | — | — | — |

- **candidate_older_witness:** `candidate_older_witness: OUT-OF-CBETA — human sourcing required, not agent work`. The record cites no CBETA witness (`cbeta_id` "Dunhuang P.2885 / S.5619"), the collator produced WITNESS_UNAVAILABLE for all 5 content fields, and no ref in the 39 carries the 絕觀論 text (the claimed manuscripts are not in CBETA).

- **label_state:** cbeta_note PRESENT and honest: "Volume removed 2026-08-08: 絕觀論 survives as Dunhuang manuscripts (P.2885, S.5619) — no Taishō volume." The record's status `witness_unavailable` is the correct one; no recension/coverage question arises because there is no witness in the set to measure against.

- **p0_findings:**
  - **NONE** — No P0. The document states its witnesses are Dunhuang manuscripts outside Taishō, and the measurement confirms no CBETA witness exists in the 39 refs (5/5 fields WITNESS_UNAVAILABLE, `refs_total` 0). Manuscript sourcing is human work. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc niutou_juezhu` → 0/5, {"WITNESS_UNAVAILABLE": 5}.

- **proposed_label:** A witness-unavailable document: the 絕觀論 survives only as Dunhuang manuscripts (P.2885, S.5619), not in CBETA or in the 39-work reference set, and sourcing them is human work.

---

**What the data claims instead, and why this is not agent work:** `hanshan_poems` `cbeta_id` is "SBCK / Zoku lineage (not in Taishō)" with a `cbeta_note` recording that a prior `taisho_vol 85` was removed on 2026-08-08 because it implied a Taishō location; `niutou_juezhu` `cbeta_id` is "Dunhuang P.2885 / S.5619" with a `cbeta_note` recording that the 絕觀論 survives as Dunhuang manuscripts and has no Taishō volume. In both cases the witness is real but outside CBETA and outside the 39-work reference set, so the only correct agent output is a label plus the statement that acquisition is human work. No Classical Chinese was generated for any field, and no non-CBETA source was fetched.

## §10 Priority feed — 0-or-1 collated content field *and* no honest label, most exposed first

Ranked from **this run's numbers** (not copied from the prompt). "No honest label" = no coverage_note and no recension_note in the data file, or a note whose stated provenance the measurement contradicts.

| # | doc | collated content fields | label state | P0 class |
|---|---|---|---|---|
| 1 | `sengzhao_zhaolun` | 0/4 | no notes at all | source-integrity (one field is a conflation of passages 470 graphs apart; one absent from all 39 refs) + labeling |
| 2 | `qinggui_monastic_codes` | 0/5 | no notes at all | source-integrity + labeling (composite of two 清規, undisclosed) |
| 3 | `lidai_fabao_ji` | 0/3 | no notes at all; cites P.2125, out of CBETA | source-integrity + attribution |
| 4 | `huangbo_wanling` | 0/7 | one unit-level editorial_note; no coverage_note | source-integrity (0/7 in all 39 refs) + labeling |
| 5 | `bodhidharma_erru` | 1/6 | no notes at all | source-integrity + attribution (collection section) + labeling |

These five are exactly the family-2 documents whose collated-content count is 0 or 1 and whose labels do not state the situation. The rest of the family is excluded by the criterion itself, not by judgement: `huangbo_chuanxin` (2/11 — its misleading coverage_note is a P0 in its block above, but the count is above the threshold), `platform_sutra` (4/13 — fully labelled précis), `shitou_sandokai` (6/11 — only the 草庵歌 part is paraphrase and the harness note is the labelling problem), `biyanlu_cases` 373/395, `wumenguan` 174/181, `xinxin_ming` 36/37, `zhengdao_ge` 6/6. `hanshan_poems` and `niutou_juezhu` are 0/X but carry honest `cbeta_note` labels for witnesses that do not exist in CBETA, so they are the human-sourcing pair, not exposure candidates; `deshan_yulu`/`chuandenglu` are outside this task's set (007b).

## What this is not

No file under `data/`, `docs/`, `sessions/`, `scripts/`, `.github/` or `app_data.js` was touched: this commit adds this file and nothing else, and the PR's `git diff --stat` lists only the two new inventory files (family 2 and family 3, one per commit). No re-keying, no label edits, no new note keys, no status changes — the findings above feed the next work packages. No rights assessment (`rights_manifest.json` sources remain human-reviewed by standing decision), no non-CBETA source was fetched, and no Classical Chinese was generated for any unsourced field: where a passage is absent from the witness the output here is a label, not text.

Method notes for the reviewer, so the traps of §8 do not have to be re-litigated: (i) every per-field count comes from running `iter_fields()`, never from `CONTENT_COLLECTIONS` or another harness constant; (ii) witness-form graphs that look like errors — 机/麁/沈惛/疎/却 and, in this family, 竪/査/双/飡/勅 and the `<g>`-derived 啣 — are treated as witness forms and no misspelling P0 is filed against them; the two places where a data graph is *not* in the witness at all (`築`, `看` in `biyanlu_cases`) are filed at their measured two-graph scale, with the reproducing greps.
