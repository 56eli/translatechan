# W1 Witness Inventory — family 3 (X-series witnesses)

**Generated:** 2026-09-11 · **Task:** 007b — independent witness inventory (prompt `007b-inventory-xseries.md`, retrieved from `origin/_orch`: 7,833 B, sha256 `9de5db47c22748ab…`) · **Role:** measurement only — nothing under `data/`, `docs/`, `sessions/`, `scripts/`, `.github/` or `app_data.js` was modified.
**Base:** branch `arena/01a092aa-translatechan` at `3c838db` (main). This file is the only artifact of its commit; no other path is touched.

## Run identity (header)

- **Upstream revision (pinned):** `dbdea41071e1e260ad84b72faefd4587333cf76d` — github.com/cbeta-org/xml-p5 (`git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5 && git -C /tmp/xmlp5 rev-parse HEAD` returned exactly this; the 39 manifest works were sparse-checked out with case preserved, e.g. `ls /tmp/xmlp5/X/X69/`).
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
- **Collation command line (family-3 evidence run):** `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --refs-manifest sessions/COLLATION_W1_2026-09-10_refs_manifest.txt --compare-register sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json --corrects sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d --require-verified-refs --out /tmp/inv-full.json` — all 35 documents in one run (no subsetting); the 12 in scope below are a subset of that result, and per-document evidence runs use `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc <key> --out /tmp/<key>.json`. Registers are written to `/tmp`, never the repo.
- **Published register compared against (baseline for Δ):** `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (generated 2026-09-10, same upstream revision).
- **Measurement semantics (calibrated against family 1 before any number was recorded):** "verbatim-in-witness" = the classifier's `norm()` of the field is a substring of `norm()` of the reference; "windows" = distinct k-graph windows of the field **as written** (NFKC + CJK-only, *without* the graphic-variant map) found in the union of the claimed witnesses, hit/total, at k = 8/12/16/24; cross-ref = the same 24-graph windows against the other 38 refs. Fragment offsets below come from a greedy longest-first LCS decomposition with a floor of **8 graphs** (`/tmp/stratum.py`, outputs `/tmp/stratum-fam3.txt` and `/tmp/probes-f3.txt`), so a "0" run count means "no contiguous run of 8 or more graphs"; shorter runs can exist. The method was calibrated by re-deriving family 1's published `linji_yulu` numbers (`linji` s73: 24/105 at k=8, 12/101, 5/97, 0/89; cross-ref {T47n1998A 5/89, T51n2076 3/89, X80n1565 7/89}) before this run was used.

**Family totals (this run, 12 documents):** collated **1/64** content fields, **102** flagged fields in the family (the full 35-document run flags 532). Eleven of the twelve have 0 collated content fields; the family's evidence problem is provenance, not quantity.

### Witness identities, verified from the pinned XML (not from memory)

| work | attested `<title level="m">` in the pinned file | role in this family |
|---|---|---|
| `T48n2001` | 宏智禪師廣錄 | uncited carrier (found by cross-coverage) |
| `T48n2003` | 佛果圜悟禪師碧巖錄 | cross-ref only |
| `T48n2005` | 無門關 | cross-ref only |
| `T48n2007` | 南宗頓教最上大乘摩訶般若波羅蜜經六祖惠能大師於韶州大梵寺施法壇經 | cross-ref only (壇經 recension) |
| `T48n2008` | 六祖大師法寶壇經 | measured carrier of the 六祖 fields |
| `T51n2076` | 景德傳燈錄 | claimed by three docs; stratum comparison for all |
| `T47n1986A` | 筠州洞山悟本禪師語錄 | read only to test the mazu coverage_note ("T1986") |
| `T47n1986B` | 瑞州洞山良价禪師語錄 | read only to test the mazu coverage_note ("T1986") |
| `X63n1223` | 頓悟入道要門論 | claimed |
| `X63n1224` | 諸方門人參問語錄 | claimed |
| `X67n1309` | 正法眼藏 | claimed |
| `X68n1315` | 古尊宿語錄 | claimed |
| `X69n1321` | 馬祖道一禪師廣錄（四家語錄卷一） | claimed |
| `X69n1323` | 百丈懷海禪師廣錄（四家語錄卷三） | claimed |
| `X69n1333` | 雪峰義存禪師語錄（真覺禪師語錄） | claimed |
| `X73n1445` | 玄沙師備禪師廣錄 | claimed |
| `X73n1446` | 玄沙師備禪師語錄 | claimed |
| `X80n1565` | 五燈會元 | claimed (and probe for chuandenglu/deshan) |
| `X86n1598` | 曹溪大師別傳 | claimed |

Every attribution claim in this file is checked against this table and against the extracted reference text. The two `T47n1986` rows are not family members: they are the 洞山 record and exist here only because the `mazu_yulu` coverage_note names "T1986".

### §2 Scope — computed from the live `DOCS` map, not from the prompt

Method: take the keys of `scripts/collate_corpus.py`'s `DOCS` object whose witness list contains an **X** id; subtract the nine keys task 006 owns (`linji_yulu`, `zhaozhou_yulu`, `baojing_sanmei`, `dongshan_yulu`, `yunmen_yulu`, `fayan_yulu`, `guiyang_yulu`, `dahui_hongzhi`, `yuanwu_letters`) and the four keys task 007a owns (`qinggui_monastic_codes`, `shitou_sandokai`, `hanshan_poems`, `niutou_juezhu`).

**Computed list (12):** `baizhang_guanglu`, `caoxi_zhuan`, `chuandenglu`, `dahui_shobogenzo`, `dazhu_huihai`, `deshan_yulu`, `foyan_qingyuan`, `mazu_yulu`, `nanquan_yulu`, `wudeng_huiyuan`, `xuansha_yulu`, `xuefeng_yantou`.

**Count: 12.** This **matches the prompt's authoring-time enumeration exactly** — `diff` of my computed set against the prompt's list is empty, so no difference has to be reported. 9 (006) + 14 (007a) + 12 (007b) = 35 = the size of the live `DOCS` map. `chuandenglu` and `deshan_yulu` are here because the X/compendium comparison is the point (their primary witness is the compendium `T51n2076` and the X works are probes); `qinggui_monastic_codes` and `shitou_sandokai` also cite X works but belong to 007a by the prompt's precedence rule.

### §3 Base check

```
git rev-parse --abbrev-ref HEAD   # arena/01a092aa-translatechan   (the pre-provisioned arena branch; no branch created)
git rev-parse --short HEAD        # 3c838db                        (main at the merge commit for the 006 inventory PR)
git status --porcelain            # empty at start of run
```

### §4 Method and §5 read-only discipline

Pin (above), then recompute with the full 39-work extraction — no subsetting, `--require-verified` clean, then one 35-document collation and per-document evidence runs, all with `--generated 2026-09-11`. `data/**`, `docs/**`, `app_data.js`, `data/project_metrics.json`, `sessions/**` and `scripts/**` stayed byte-identical: no `--write-metrics`, no build, no re-keying, no data-level label edits. The references live in `/tmp` only and are not in this commit.

### §6 Self-test — a check on *this run*, not on the data

`xinxin_ming` was re-keyed by PR #34; the published register predates it. Measured on current `main` with the 39 refs byte-verified:

| doc | register (stale) | measured by this run | movement |
|---|---|---|---|
| `xinxin_ming` | 24/37, {EXACT 24, DIVERGENT 12, NOT_FOUND 1} (13 flags) | **36/37, {EXACT 36, NOT_FOUND 1} (1 flag)** | moved ✓ |

The measured row is the required 36/37 with 1 content flag `{NOT_FOUND 1}` — not the stale 24/37 — so this run is collating current `main` and not the stale register. `git status --porcelain` was empty before the run and no corpus file was written to; the only diff is this new file.

### `iter_fields()` walk — exact per-doc field counts (nothing skipped)

Per §8 trap 1 this is the harness's own enumeration (`scripts/collate_corpus.py::iter_fields`, fully recursive, gated by `SRC_KEYS`), run on each data file — not inferred from `CONTENT_COLLECTIONS` or any neighbouring constant. Every count below equals the entry's `fields_total`.

| doc | fields reached | content fields | title/name fields |
|---|---|---|---|
| `baizhang_guanglu` | 10 | 6 | 4 |
| `caoxi_zhuan` | 8 | 4 | 4 |
| `chuandenglu` | 9 | 6 | 3 |
| `dahui_shobogenzo` | 8 | 4 | 4 |
| `dazhu_huihai` | 10 | 6 | 4 |
| `deshan_yulu` | 10 | 6 | 4 |
| `foyan_qingyuan` | 12 | 6 | 6 |
| `mazu_yulu` | 15 | 8 | 7 |
| `nanquan_yulu` | 10 | 6 | 4 |
| `wudeng_huiyuan` | 6 | 3 | 3 |
| `xuansha_yulu` | 9 | 5 | 4 |
| `xuefeng_yantou` | 7 | 4 | 3 |

### §7 Output fields (identical to family 2)

Each block below carries: doc / claimed witness(es) / reference sha256 (first 16) + length in graphs; `my_measured` (collated X/Y, flags by class, Δ vs the 2026-09-10 register); `per_flag` (path, class, sim, ref, verbatim-in-witness, probe-verbatim, 8/12/16/24-graph window counts for NOT_FOUND fields, cross-ref of the other 38 refs); **`carriers (measured work + offset)`** — the field the prompt asks for, naming *which* cited work carries a match and at what offset, including the `T51n2076` stratum; `candidate_older_witness` (with "near-complete" defined per document before ranking); `label_state`; `p0_findings` (each with a reproducing command); `proposed_label`.

### §8 Two traps (as reported, not re-litigated)

(1) No claim about the harness is made from `CONTENT_COLLECTIONS`: the nested `sections[*].dialogue[*].zh` fields of this family are collated, and every count above is pasted from an actual run. (2) Witness-form graphs are not treated as errors and no spellcheck proposal is filed; where a data graph is *not* in the witness at all the finding is filed at its measured scale — the variant residues named in the blocks (迴/迥 in `foyan_qingyuan`, 漆黑窠裏/漆桶不會 in `xuefeng_yantou`, 度量/測度 in `huangbo_chuanxin` in the family-2 file) are recorded as variants, not as corrections.

## Per-document blocks

"collated X/Y" = content fields classified EXACT+REWORDED over all content fields (titles are metadata, measured separately, outside the content denominator).

### `baizhang_guanglu`

- **doc / claimed witness(es):** `baizhang_guanglu` / `X69n1323`, `X68n1315`
- **reference sha256 (first 16) + length in graphs:** `X69n1323` `15e331904f26112b` … / 1,143 graphs; `X68n1315` `36727779ec415315` … / 445,450 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/6**, flags by class {"NOT_FOUND": 6} (full content summary {"NOT_FOUND": 6}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 4}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (10 flagged fields = every non-EXACT/non-EMPTY field of the 10-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 10 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/37, 0/33, 0/29, 0/21 | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/31, 0/27, 0/23, 0/15 | none-of-39 |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/27, 0/23, 0/19, 0/11 | {"X80n1565": "1/11"} |
| `.sections[1].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/20, 0/16, 0/12, 0/4 | none-of-39 |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/34, 0/30, 0/26, 0/18 | none-of-39 |
| `.sections[2].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/33, 0/29, 0/25, 0/17 | none-of-39 |

- **carriers (measured work + offset):** Measured per cited work (LCS runs >= 8 graphs; claimed first, then the others): `X69n1323` (claimed, 1,143 graphs) **0/6 fields, no run >= 8 graphs** (0/44, 0/38, 0/34, 0/27, 0/41, 0/40); `X68n1315` (claimed, 445,450 graphs) **0/6**, no run; `T51n2076` (358,501 graphs) **0/6**, no run; `X80n1565` (581,588 graphs, not cited) carries **4 of the 6 fields**: s1.d0 24/34 @60,222 (k=12 windows 13/23), s1.d1 16/27 @60,252 (5/16), s2.d0 18/41 (@60,428 + @60,441), s2.d1 28/40 (@60,465 + @60,485). s0.d0 and s0.d1 have no run in any of the 39 refs.

- **candidate_older_witness:** Near-complete is defined for this document as carrying all six 百丈 record fields. No work in the refs does. The two claimed works carry **none of the project's wording as written** (no run of >= 8 graphs in any field, 0/44 to 0/40 per field), and the 傳燈錄 carries none either; the four fields that do have a measured carrier are in the **uncited** 五燈會元 (`X80n1565`), as 16-28-graph fragments of dialogues. A copy older than those fragments is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** cbeta_note PRESENT and ID-correct: "Corrected 2026-08-08: prior 'T1985 / X1304' wrong — T1985 is strictly the Record of Linji; X1304 is 虗堂集. Baizhang's 廣錄 is 四家語錄卷三 (X69n1323); his 語錄 also in 古尊宿語錄 (X68n1315)." There is **no coverage_note and no recension_note**: the record nowhere states that neither claimed work carries the project's wording, nor that 五燈會元 does. Label state: ID-correct, coverage-silent.

- **p0_findings:**
  - **source-integrity** — 0/6 collated; no run of >= 8 graphs in either claimed work (0/44, 0/38, 0/34, 0/27, 0/41, 0/40). Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc baizhang_guanglu` → 0/6, {"NOT_FOUND": 6}; the fragment floor comes from the LCS decomposition (`/tmp/stratum.py`).
  - **attribution** — The only measured carrier is the uncited `X80n1565`: 4 of 6 fields as fragments (offsets above), e.g. s2.d1 28/40 @60,465/@60,485. The `cbeta_id` names X69n1323/X68n1315 only, and neither carries the wording. Reproduce: build the per-field file from data and run the LCS helper against `/tmp/refs/ref_X80n1565.txt` (command in `/tmp/probes-f3.txt`); e.g. the 28-graph run is at offset 60,465 of that ref.
  - **labeling** — No coverage or recension note. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/baizhang_guanglu.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'].

- **proposed_label:** A 百丈 project composition: 0/6 in its two claimed works, with four fields traceable only to the uncited 五燈會元 — needs a coverage label that says so and an attribution label naming X80n1565, or a re-key discussion.

---

### `caoxi_zhuan`

- **doc / claimed witness(es):** `caoxi_zhuan` / `X86n1598`
- **reference sha256 (first 16) + length in graphs:** `X86n1598` `8eaa7d17e617a08d` … / 7,438 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/4**, flags by class {"NOT_FOUND": 4} (full content summary {"NOT_FOUND": 4}); metadata (title/name, excluded from the denominator) {"EXACT": 1, "NOT_FOUND": 3}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (7 flagged fields = every non-EXACT/non-EMPTY field of the 8-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 7 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.2429 | X86n1598 | no | — | 5/63, 1/59, 0/55, 0/47 | none-of-39 |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/8, 0/4, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/29, 0/25, 0/21, 0/13 | none-of-39 |
| `.sections[1].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/49, 0/45, 0/41, 0/33 | none-of-39 |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/4, n/a, n/a, n/a | none-of-39 |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/68, 0/64, 0/60, 0/52 | none-of-39 |

- **carriers (measured work + offset):** Claimed `X86n1598` (7,438 graphs): s0.d0 12/70 @6,790 (one fragment); s1.d0 0/36; s1.d1 0/56; s2.d0 0/75. `T48n2008`: s0.d0 19/70 (@4,958 應無所住而生其心 + @3,376), s1.d1 22/56 (@3,570 + @3,588), s2.d0 10/75 @5,711. `T48n2007`: s0.d0 8/70 @4,901, s1.d1 8/56 @481. The recorded second witness **P.3018 is not in CBETA** and not in the 39 refs, so no offset can be given for it.

- **candidate_older_witness:** Near-complete is defined for this document as carrying all four 曹溪 field texts. No work in the refs does. The claimed 別傳 carries one 12-graph run (of a 70-graph field) and **nothing** of the other three fields; the 壇經 recensions carry fragments of three fields (T48n2008 19/70, 22/56, 10/75); the Dunhuang manuscript P.3018 named by the record is the only candidate for an older complete text and is out of CBETA: `candidate_older_witness: OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** cbeta_note PRESENT and ID-correct: "Corrected 2026-08-08: prior 'X1458' wrong — X1458 is 宗門寶積錄. The 曹溪大師別傳 is X86n1598 (卍續藏第86冊) plus the Dunhuang manuscript P.3018. The prior 'taisho_vol 86' was actually the 續藏 volume number." No coverage_note, no recension_note: nothing states that three of the four fields have no measured text in the claimed witness, nor that P.3018 is out of CBETA. Label state: ID-corrected, coverage-silent, human-sourcing item.

- **p0_findings:**
  - **source-integrity** — 0/4; three fields have no run >= 8 graphs in X86n1598 (0/25, 0/45, 0/64 windows at k=12) and the fourth has 12 of 70 graphs. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc caoxi_zhuan` → 0/4, {"NOT_FOUND": 4}.
  - **attribution** — P.3018 is named as a witness but is out of CBETA (0 hits in `/tmp/refs`), and the measurable parallels are with the 壇經 recensions (offsets above). Reproduce: `python3 -c "import json;print(json.load(open('data/corpus/caoxi_zhuan.json'))['cbeta_id'])"` → 「X1598 (曹溪大師別傳) / P.3018」; `ls /tmp/refs | grep -c P3018` → 0; probe fragments in `/tmp/probes-f3.txt`.
  - **labeling** — No coverage note. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/caoxi_zhuan.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'].

- **proposed_label:** A 曹溪大師別傳 selection with one 12-graph match against X86n1598 and three unsourced fields; P.3018 becomes a `human sourcing required` item, and the corrected X86n1598 ID stands (no stale X1458 remains in the repo).

---

### `chuandenglu`

- **doc / claimed witness(es):** `chuandenglu` / `T51n2076` (probes: `X80n1565`)
- **reference sha256 (first 16) + length in graphs:** `T51n2076` `a860907edd3d34b9` … / 358,501 graphs; `X80n1565` `a3d20a107ff69495` … / 581,588 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **1/6**, flags by class {"DIVERGENT": 2, "NOT_FOUND": 3} (full content summary {"EXACT": 1, "DIVERGENT": 2, "NOT_FOUND": 3}); metadata (title/name, excluded from the denominator) {"EXACT": 1, "NOT_FOUND": 1, "SHORT_UNMATCHED": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (7 flagged fields = every non-EXACT/non-EMPTY field of the 9-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 7 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.sample_records[0].title_zh` | SHORT_UNMATCHED | 0.0 | — | no | — | n/a (≤6 graphs) | — |
| `.sample_records[0].dialogue[0].zh` | DIVERGENT | 0.9677 | T51n2076 | no | — | — | — |
| `.sample_records[0].dialogue[2].zh` | NOT_FOUND | 0.8293 | T51n2076 | no | — | 4/34, 0/30, 0/26, 0/18 | none-of-39 |
| `.sample_records[0].dialogue[3].zh` | DIVERGENT | 0.9259 | T51n2076 | no | — | — | — |
| `.sample_records[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | none-of-39 |
| `.sample_records[1].dialogue[0].zh` | NOT_FOUND | 0.7647 | T51n2076 | no | — | 1/10, 0/6, 0/2, n/a | none-of-39 |
| `.sample_records[1].dialogue[1].zh` | NOT_FOUND | 0.8095 | T51n2076 | no | — | 6/14, 2/10, 0/6, n/a | none-of-39 |

- **carriers (measured work + offset):** Claimed `T51n2076` (358,501 graphs): s0.d0 29/31 @50,758; s0.d1 whole (5-graph line @50,789); s0.d2 18/41 (@50,799 + @50,811); s0.d3 25/27 (@50,833 + @50,845); s1.d0 8/17 @81,301; s1.d1 13/21 @81,314. Probe `X80n1565`: s0.d0 25/31 (@58,342 + @58,356); s0.d2 19/41 (@58,383 + @58,395); s0.d3 26/27 (@58,424 + @58,434); s1.d0 12/17 @532,266; s1.d1 19/21 @83,122 — better than the claimed witness for three fields. Uncited `T48n2001` (宏智禪師廣錄): s1.d0 **17/17 @66,315 (whole field)**, s1.d1 13/21 @45,585.

- **candidate_older_witness:** Near-complete is defined for this document as carrying all six sample-record fields. No work in the refs does. The claimed 傳燈錄 carries five fields as 8-29-graph runs plus one five-graph line, but for three fields the uncited 五燈會元 matches more (X80n1565 offsets above; k=12 windows 6/16 vs 3/16 for s0.d3 and 8/10 vs 2/10 for s1.d1), and `.sample_records[1].dialogue[0].zh` is carried whole only by the uncited `T48n2001` @66,315. A copy older than these layers is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** **No notes at all** — `cbeta_note`, `coverage_note` and `recension_note` are all ABSENT; the record holds only `cbeta_id` "T2076". Nothing states that the selection mixes 傳燈錄, 五燈會元 and 宏智禪師廣錄 wording, that two fields measure better to an uncited work, or that the only collated field is a five-graph line. Label state: unlabelled.

- **p0_findings:**
  - **labeling** — A six-field selection with no coverage, recension or ID note of any kind, and a 1/6 collated credit that rests on the five-graph line `.sample_records[0].dialogue[1].zh` 「一曰圖作佛」. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/chuandenglu.json'));print([k for k in d if 'note' in k])"` → []; collator → 1/6, {"EXACT": 1, "DIVERGENT": 2, "NOT_FOUND": 3}.
  - **attribution** — Three works carry parts of the selection: the claimed T51n2076, the probe X80n1565 (best for s0.d3 and s1.d1), and the uncited T48n2001, which alone carries s1.d0 whole (@66,315). Reproduce: `python3 -c "import sys;sys.path.insert(0,'/tmp');import analyze as A;print(A.ref('T48n2001').t.find('龐居士問馬祖不與萬法為侶者是甚麼人'))"` → 66315; probe fragments in `/tmp/probes-f3.txt`.
  - **source-integrity** — s0.d2 has no k=12 window in any ref (a paraphrase), and the 1/6 collated credit is a five-graph line. Reproduce: the collator run above; window counts in the block table.

- **proposed_label:** A three-work selection (T51n2076 + X80n1565 + T48n2001) whose 傳燈錄 attribution is incomplete and whose single collated field is five graphs — needs a coverage/attribution label naming all three works.

---

### `dahui_shobogenzo`

- **doc / claimed witness(es):** `dahui_shobogenzo` / `X67n1309`
- **reference sha256 (first 16) + length in graphs:** `X67n1309` `39dd5ae220a14062` … / 103,131 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/4**, flags by class {"DIVERGENT": 1, "NOT_FOUND": 3} (full content summary {"DIVERGENT": 1, "NOT_FOUND": 3}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 3, "TITLE_COMPOSITE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (8 flagged fields = every non-EXACT/non-EMPTY field of the 8-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 8 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/8, 0/4, n/a, n/a | none-of-39 |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.775 | X67n1309 | no | — | 14/33, 10/29, 6/25, 0/17 | {"T48n2005": "2/17"} |
| `.sections[0].dialogue[1].zh` | DIVERGENT | 0.973 | X67n1309 | no | — | — | — |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/49, 0/45, 0/41, 0/33 | none-of-39 |
| `.sections[2].title_zh` | TITLE_COMPOSITE | 0.29 | X67n1309 | no | — | — | — |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/40, 0/36, 0/32, 0/24 | none-of-39 |

- **carriers (measured work + offset):** Claimed `X67n1309` (103,131 graphs): s0.d0 21/40 @74,756 (windows 14/33 at k=8); s0.d1 35/37 @7,536; s1.d0 **0**; s2.d0 **0**. `T51n2076`: s1.d0 9/56 @142,146 only; nothing else. Cross-ref of the s0.d0 24-grams also hits `T48n2005` 2/17. So the document's wording is mostly X67n1309, with one field only in the 傳燈錄 and one field nowhere.

- **candidate_older_witness:** Near-complete is defined for this document as carrying all four 大慧 fields. No work in the refs does. The claimed `X67n1309` carries two fields substantially (21/40 and 35/37) but neither verbatim; `.sections[1].dialogue[0].zh` (56 graphs) has **nothing** in the claimed work and only a 9/56 run in the older 傳燈錄 stratum @142,146; `.sections[2].dialogue[0].zh` (47 graphs) has no run >= 8 graphs anywhere. An older complete copy is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** cbeta_note PRESENT and ID-correct: "Corrected 2026-08-08: prior 'T2002' wrong — T2002 is 如淨和尚語錄 (T48n2002A). Dahui's 正法眼藏 (宋 宗杲集並著語) is X67n1309 (卍續藏第67冊)." No coverage_note, no recension_note: the record does not say that one field is carried only by the 傳燈錄 and one by nothing. Label state: ID-correct, coverage-silent.

- **p0_findings:**
  - **attribution** — `.sections[1].dialogue[0].zh` has no source in the claimed X67n1309 and a 9/56 run in `T51n2076` @142,146; the record names neither the stratum nor the offset. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc dahui_shobogenzo` → 0/4, {"DIVERGENT": 1, "NOT_FOUND": 3}; fragment offsets via the LCS helper.
  - **source-integrity** — Two of four fields have no run >= 8 graphs in the claimed work and one (`sections[2].dialogue[0].zh`, 47 graphs) has none in the 39 refs. Reproduce: the collator run above; window counts 0/49…0/40 at k=8 for s1.d0 and s2.d0 in the block table.
  - **labeling** — No coverage or recension note. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/dahui_shobogenzo.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'].

- **proposed_label:** A 大慧 selection: X67n1309 carries two fields as non-verbatim runs, T51n2076 carries the third (@142,146), and the fourth has no measured source — needs a coverage label naming all three states.

---

### `dazhu_huihai`

- **doc / claimed witness(es):** `dazhu_huihai` / `X63n1223`, `X63n1224`
- **reference sha256 (first 16) + length in graphs:** `X63n1223` `7b7e6eb2515ec927` … / 8,669 graphs; `X63n1224` `413caffc888a9a88` … / 8,311 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/6**, flags by class {"DIVERGENT": 2, "NOT_FOUND": 4} (full content summary {"DIVERGENT": 2, "NOT_FOUND": 4}); metadata (title/name, excluded from the denominator) {"EXACT": 1, "NOT_FOUND": 3}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (9 flagged fields = every non-EXACT/non-EMPTY field of the 10-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 9 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/11, 0/7, 0/3, n/a | none-of-39 |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/1, n/a, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.75 | X63n1224 | no | — | 15/53, 4/49, 0/45, 0/37 | {"X80n1565": "7/37"} |
| `.sections[0].dialogue[1].zh` | DIVERGENT | 0.8519 | X63n1224 | no | — | — | — |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/2, n/a, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/14, 0/10, 0/6, n/a | none-of-39 |
| `.sections[1].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/43, 0/39, 0/35, 0/27 | none-of-39 |
| `.sections[2].dialogue[0].zh` | DIVERGENT | 0.9688 | X63n1224 | no | — | — | — |
| `.sections[2].dialogue[1].zh` | NOT_FOUND | 0.5814 | X63n1224 | no | — | 9/36, 5/32, 1/28, 0/20 | none-of-39 |

- **carriers (measured work + offset):** Claimed works: `X63n1223` (8,669 graphs) carries **no run >= 8 graphs of any field** (0/60, 0/54, 0/21, 0/50, 0/32, 0/43); `X63n1224` (8,311 graphs) carries s0.d0 43/60 (fragments @23, @32, @67, @54 — re-arranged), s0.d1 40/54 @88, s2.d0 28/32 @1,353, s2.d1 16/43 @1,381, and nothing of s1.d0/s1.d1. The 傳燈錄 stratum adds: s0.d0 26/60 (@58,280 + @58,302), s0.d1 **44/54 @58,336** (more than the claimed X witness), s2.d0 20/32 @59,580, s2.d1 16/43 @59,608.

- **candidate_older_witness:** Near-complete is defined for this document as carrying all six 大珠 fields. No work in the refs does. The two claimed works are not equivalent: `X63n1223` contributes **nothing** (0/6), and every measurable field comes from `X63n1224` and/or the older 傳燈錄 stratum — for s0.d1 the 傳燈錄 carries more of the field (44/54 @58,336) than the claimed X63n1224 does (40/54 @88). Two fields (s1.d0, 21 graphs; s1.d1, 50 graphs) have no run >= 8 graphs anywhere. An older copy is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** cbeta_note PRESENT and ID-correct: "Corrected 2026-08-08: prior 'X1258' wrong — X1258 is 禪宗直指 (明 石成金著). Dazhu Huihai's texts are X63n1223 頓悟入道要門論 and X63n1224 參問語錄 (唐 慧海撰)." No coverage_note, no recension_note: the record does not say that X63n1223 carries none of the data as written, nor that the 傳燈錄 carries the largest single run. Label state: ID-correct, coverage-silent.

- **p0_findings:**
  - **attribution** — X63n1223 is listed first but contributes zero runs; `.sections[0].dialogue[1].zh` is carried better by the 傳燈錄 (`T51n2076` 44/54 @58,336) than by `X63n1224` (40/54 @88). Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc dazhu_huihai` → 0/6; LCS offsets from `/tmp/stratum-fam3.txt` (this run).
  - **source-integrity** — Two of six fields have no run >= 8 graphs in any of the 39 refs (windows 0/14 and 0/43 at k=8 in the block table). Reproduce: the collator run above.
  - **labeling** — No coverage or recension note. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/dazhu_huihai.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'].

- **proposed_label:** A 大珠 selection actually carried by X63n1224 plus the 傳燈錄 stratum (T51n2076 @58,336 carries the largest single run); X63n1223 should not read as a carrier, and a coverage label is required for the two unsourced fields.

---

### `deshan_yulu`

- **doc / claimed witness(es):** `deshan_yulu` / `T51n2076` (probes: `X68n1315`, `X80n1565`)
- **reference sha256 (first 16) + length in graphs:** `T51n2076` `a860907edd3d34b9` … / 358,501 graphs; `X68n1315` `36727779ec415315` … / 445,450 graphs; `X80n1565` `a3d20a107ff69495` … / 581,588 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/6**, flags by class {"NOT_FOUND": 6} (full content summary {"NOT_FOUND": 6}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 4}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (10 flagged fields = every non-EXACT/non-EMPTY field of the 10-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 10 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/7, 0/3, n/a, n/a | none-of-39 |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/7, 0/3, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/35, 0/31, 0/27, 0/19 | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/32, 0/28, 0/24, 0/16 | none-of-39 |
| `.sections[0].dialogue[2].zh` | NOT_FOUND | 0.0 | — | no | — | 0/28, 0/24, 0/20, 0/12 | {"X80n1565": "1/12"} |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/43, 0/39, 0/35, 0/27 | none-of-39 |
| `.sections[1].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/32, 0/28, 0/24, 0/16 | none-of-39 |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/9, 0/5, 0/1, n/a | none-of-39 |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/24, 0/20, 0/16, 0/8 | none-of-39 |

- **carriers (measured work + offset):** Claimed `T51n2076` (358,501 graphs): **0 runs >= 8 graphs in all six fields** (0/42, 0/39, 0/35, 0/50, 0/39, 0/31) — the 傳燈錄 has the 德山 chapter but not this wording. Probe `X80n1565`: five of six fields — s0.d1 12/39 @157,994; s0.d2 24/35 @158,009; s1.d0 31/50 (@158,087 + @158,106 + @158,116); s1.d1 31/39 (@158,198 + @158,216); s2.d0 21/31 (@158,868 + @158,969). Probe `X68n1315`: s0.d2 19/35 @291,657; s2.d0 13/31 @39,956. s0.d0 has no run in any of the two probes or the claimed work.

- **candidate_older_witness:** Near-complete is defined for this document as carrying all six 德山 field texts. No work in the refs does. The claimed witness carries **none** of the project's wording (0 runs >= 8 graphs); the measured carriers are the two probes — 五燈會元 (X80n1565) for five fields and 古尊宿語錄 (X68n1315) for two — as 12-31-graph fragments. The underlying wording is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** cbeta_note PRESENT but volume-only: "Volume corrected 2026-08-08: T2076 (景德傳燈錄) is Taishō vol. 51 (was 47)." The merged harness `WITNESS_NOTES` states the situation — "Retellings; 0/6 content fields match T2076/X68n1315/X1565 phrasing" — measured here as **true for T51n2076** (0 runs) and **partly inaccurate for the two probes**: X68n1315 carries 2 fields' runs and X80n1565 carries 5. Label state: honest statement exists in the harness, not in the record, and needs the probe qualification.

- **p0_findings:**
  - **attribution** — The claimed witness carries nothing measurable and the honest carriers are the probes X80n1565 (five fields, offsets above) and X68n1315 (two); the record's `cbeta_id` "embedded: T2076 f.15 / X1565 f.7" names places but the primary-witness assignment is wrong for the text as written. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc deshan_yulu` → 0/6, {"NOT_FOUND": 6}; probe fragments in `/tmp/probes-f3.txt`.
  - **labeling** — The record has only a volume note; the honest sentence lives in the harness only, and its "0/6 ... X68n1315/X1565 phrasing" claim understates the probe coverage. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/deshan_yulu.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note']; `grep -n deshan_yulu scripts/collate_corpus.py` → the WITNESS_NOTES line.

- **proposed_label:** A 德山 retelling whose measurable carriers are X80n1565 (five fields) and X68n1315 (two), with the claimed T51n2076 carrying none of its wording — needs the harness statement promoted into the record, qualified for the probes, and the primary witness corrected.

---

### `foyan_qingyuan`

- **doc / claimed witness(es):** `foyan_qingyuan` / `X68n1315`
- **reference sha256 (first 16) + length in graphs:** `X68n1315` `36727779ec415315` … / 445,450 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/6**, flags by class {"NOT_FOUND": 6} (full content summary {"NOT_FOUND": 6}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 2, "TITLE_COMPOSITE": 4}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (12 flagged fields = every non-EXACT/non-EMPTY field of the 12-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 12 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.21 | X68n1315 | no | — | — | — |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/49, 0/45, 0/41, 0/33 | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.0 | — | no | — | 0/46, 0/42, 0/38, 0/30 | none-of-39 |
| `.sections[1].title_zh` | TITLE_COMPOSITE | 0.33 | X68n1315 | no | — | — | — |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.6667 | X68n1315 | no | — | 20/41, 16/37, 12/33, 4/25 | {"T48n2003": "4/25", "T51n2076": "4/25", "X67n1309": "4/25", "X80n1565": "4/25"} |
| `.sections[2].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | none-of-39 |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/56, 0/52, 0/48, 0/40 | none-of-39 |
| `.sections[3].title_zh` | TITLE_COMPOSITE | 0.53 | X68n1315 | no | — | — | — |
| `.sections[3].dialogue[0].zh` | NOT_FOUND | 0.1833 | X68n1315 | no | — | 1/53, 0/49, 0/45, 0/37 | none-of-39 |
| `.sections[4].title_zh` | TITLE_COMPOSITE | 0.57 | X68n1315 | no | — | — | — |
| `.sections[4].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/33, 0/29, 0/25, 0/17 | none-of-39 |

- **carriers (measured work + offset):** Claimed `X68n1315` (445,450 graphs): s1.d0 27/48 @4,284; s3.d0 8/60 @440,604; s0.d0, s0.d1, s2.d0, s4.d0 nothing. `T51n2076`: the **same 27/48 run** of s1.d0 @87,323; nothing else. Cross-ref of the s1.d0 24-grams also hits `T48n2003` 4/25, `X67n1309` 4/25 and `X80n1565` 4/25 — the passage circulates in four works, so its provenance cannot be settled by hit counts alone.

- **candidate_older_witness:** Near-complete is defined for this document as carrying all six 佛眼 fields. No work in the refs does. One field has a substantial run (s1.d0 27/48) and it is **shared** by the claimed compendium (`X68n1315` @4,284) and the older 傳燈錄 stratum (`T51n2076` @87,323), with a single-graph variant at data[8] (data 迴, witness 迥) — the compendium is quoting the older layer, so the two offsets must both be recorded. Four of six fields have no run >= 8 graphs in any of the 39 refs. An older complete copy is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** cbeta_note PRESENT and ID-correct: "Corrected 2026-08-08: prior 'T1995' is actually 法演禪師語錄 (Wuzu Fayan's record, T47n1995), NOT Foyan's. Foyan Qingyuan's record is 古尊宿語錄·佛眼語錄 (X68n1315, 卍續藏第68冊)." No coverage_note, no recension_note: nothing states that four of six fields have no measured source, nor that the one real match is double-carried. Label state: ID-correct, coverage-silent.

- **p0_findings:**
  - **source-integrity** — Four of six fields have no run >= 8 graphs in any of the 39 refs (windows 0/49, 0/46, 0/56, 0/33 at k=8). Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc foyan_qingyuan` → 0/6, {"NOT_FOUND": 6}.
  - **attribution** — The only substantial run is in two works at once: `X68n1315` @4,284 and `T51n2076` @87,323 (27/48), with data[8] 迴 against witness 迥. Reproduce: `python3 -c "import sys;sys.path.insert(0,'/tmp');import analyze as A;print(A.ref('X68n1315').t[4284:4311]);print(A.ref('T51n2076').t[87323:87350])"` → the two runs.
  - **labeling** — No coverage or recension note. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/foyan_qingyuan.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'].

- **proposed_label:** A 佛眼 selection with one mixed-witness passage (X68n1315 @4,284 = T51n2076 @87,323, 27/48 graphs, variant 迴/迥 at data[8]) and four fields with no measured source — needs a coverage label and must not claim verbatim status for the passage.

---

### `mazu_yulu`

- **doc / claimed witness(es):** `mazu_yulu` / `X69n1321`
- **reference sha256 (first 16) + length in graphs:** `X69n1321` `652ba08698e51d5e` … / 4,732 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/8**, flags by class {"DIVERGENT": 4, "NOT_FOUND": 4} (full content summary {"DIVERGENT": 4, "NOT_FOUND": 4}); metadata (title/name, excluded from the denominator) {"EXACT": 5, "NOT_FOUND": 1, "SHORT_UNMATCHED": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (10 flagged fields = every non-EXACT/non-EMPTY field of the 15-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 10 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.sections[0].dialogue[0].zh` | DIVERGENT | 0.8871 | X69n1321 | no | — | — | — |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/26, 0/22, 0/18, 0/10 | none-of-39 |
| `.sections[1].dialogue[1].zh` | DIVERGENT | 0.9118 | X69n1321 | no | — | — | — |
| `.sections[1].dialogue[2].zh` | DIVERGENT | 0.9 | X69n1321 | no | — | — | — |
| `.sections[2].dialogue[0].zh` | DIVERGENT | 0.8947 | X69n1321 | no | — | — | — |
| `.sections[3].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/25, 0/21, 0/17, 0/9 | {"T51n2076": "9/9"} |
| `.sections[4].title_zh` | SHORT_UNMATCHED | 0.375 | X69n1321 | no | — | n/a (≤6 graphs) | — |
| `.sections[4].dialogue[0].zh` | NOT_FOUND | 0.6375 | X69n1321 | no | — | 5/73, 1/69, 0/65, 0/57 | none-of-39 |
| `.sections[5].dialogue[0].zh` | NOT_FOUND | 0.5904 | X69n1321 | no | — | 14/76, 2/72, 0/68, 0/60 | none-of-39 |

- **carriers (measured work + offset):** Per field (claimed `X69n1321`, 4,732 graphs; then `T51n2076`, 358,501 graphs): s0.d0 — X69n1321 45/62 (@1,484 + @1,497), T51n2076 57/62 (@321,488/@321,502/@321,512/@321,528); s1.d0 — **0 in both**; s1.d1 — X69n1321 29/34 (@3,848 + @3,865); s1.d2 — X69n1321 28/40 (@3,877 + @3,896), T51n2076 19/40 (@57,547 + @57,567); s2.d0 — X69n1321 16/19 @662, T51n2076 **19/19** (@106,667 + @57,267); s3.d0 — X69n1321 **0/32**, T51n2076 **32/32 @57,513 (whole field verbatim)**; s4.d0 — X69n1321 12/80 @134; s5.d0 — X69n1321 35/83 (@2,977/@3,067/@3,080), T51n2076 33/83 (@69,468/@69,479/@69,493).

- **candidate_older_witness:** Near-complete is defined for this document as carrying all eight 馬祖 fields. No work in the refs does. The claimed `X69n1321` carries six of the eight fields partially (45/62 down to 12/80 graphs) and carries **nothing** of s1.d0 (33 graphs) or s3.d0 (32 graphs); the older 傳燈錄 stratum supplies s3.d0 **verbatim** (32/32 @57,513) and a fuller s2.d0 (19/19 @106,667 + @57,267) and s0.d0 (57/62), while s1.d0 has no run >= 8 graphs anywhere in the 39 refs. A copy older than the 傳燈錄 layer is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** Two notes, both problematic. cbeta_note is ID-correct (prior 'X1304 / T1985' wrong; Mazu's record is 四家語錄卷一, X69n1321, "also 馬祖大寂行狀 in X1315"). But the **coverage_note reads "6 foundational sermons and dialogues from T1986 / X1321"**: (i) T1986 is 寶鏡三昧歌 (洞山's text; the pinned T47n1986A/B are 洞山 records) — not a Mazu witness; (ii) the document has **8** content fields, not 6; (iii) measured collation is 0/8. No recension_note. Label state: misleading note.

- **p0_findings:**
  - **labeling** — The coverage_note names T1986, a 洞山 work, as the Taishō witness. Reproduce: `python3 -c "import json;print(json.load(open('data/corpus/mazu_yulu.json'))['coverage_note'])"` → the string; and `grep -o '<title level="m" xml:lang="zh-Hant">[^<]*' /tmp/xmlp5/T/T47/T47n1986A.xml /tmp/xmlp5/T/T47/T47n1986B.xml` → 筠州洞山悟本禪師語錄 / 瑞州洞山良价禪師語錄.
  - **attribution** — `.sections[3].dialogue[0].zh` is verbatim in `T51n2076` @57,513 and absent from the claimed `X69n1321`; `.sections[2].dialogue[0].zh` is whole in T51n2076 (@106,667 + @57,267). Both offsets must appear in the record. Reproduce: `python3 -c "import sys;sys.path.insert(0,'/tmp');import analyze as A;print(A.ref('T51n2076').t[57513:57545])"` → the 32-graph field; the field text is `即心即佛` exchange `僧問和尚為什麼說即心即佛...`.
  - **source-integrity** — Two of eight fields (s1.d0, 33 graphs; s3.d0, 32 graphs) have no run >= 8 graphs in the claimed work; s1.d0 has none in any of the 39 refs, so it is project wording with no measured source. Reproduce: the collator run above → 0/8.

- **proposed_label:** A 馬祖 selection spanning two strata: X69n1321 for the six partial fields, T51n2076 for the whole-verbatim s3.d0 @57,513, and s1.d0 flagged as sourced nowhere; the coverage note's 'T1986' and its '6' must be replaced with the measured carriers.

---

### `nanquan_yulu`

- **doc / claimed witness(es):** `nanquan_yulu` / `X68n1315`
- **reference sha256 (first 16) + length in graphs:** `X68n1315` `36727779ec415315` … / 445,450 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/6**, flags by class {"NOT_FOUND": 6} (full content summary {"NOT_FOUND": 6}); metadata (title/name, excluded from the denominator) {"EXACT": 1, "DIVERGENT": 1, "NOT_FOUND": 1, "TITLE_COMPOSITE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (9 flagged fields = every non-EXACT/non-EMPTY field of the 10-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 9 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | DIVERGENT | 0.9 | X68n1315 | no | — | — | — |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/6, 0/2, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.6 | X68n1315 | no | — | 1/8, 0/4, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.3939 | X68n1315 | no | — | 2/26, 0/22, 0/18, 0/10 | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/12, 0/8, 0/4, n/a | none-of-39 |
| `.sections[1].dialogue[1].zh` | NOT_FOUND | 0.3929 | X68n1315 | no | — | 2/21, 0/17, 0/13, 0/5 | none-of-39 |
| `.sections[2].title_zh` | TITLE_COMPOSITE | 0.36 | X68n1315 | no | — | — | — |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.8148 | X68n1315 | no | — | 9/20, 2/16, 0/12, 0/4 | {"T47n1997": "4/4"} |
| `.sections[2].dialogue[1].zh` | NOT_FOUND | 0.6923 | X68n1315 | no | — | 4/19, 0/15, 0/11, 0/3 | none-of-39 |

- **carriers (measured work + offset):** Claimed `X68n1315`: s0.d0 8/15 @92,337; s0.d1 9/33 @92,350; s1.d1 9/28 @93,279; s2.d0 23/27 (@433,963 + @433,978 — the largest run); s2.d1 11/26 @434,001; s1.d0 none. `T51n2076`: s0.d1 10/33 @75,502; s1.d1 9/28 @67,316; s2.d1 8/26 @74,875 — equal or longer than the claimed work for those three. Cross-ref: all four 24-gram windows of s2.d0 are also in `T47n1997` (4/4), i.e. the saying is carried by the 雲門 record as well.

- **candidate_older_witness:** Near-complete is defined for this document as carrying all six 南泉 fields. No work in the refs does. The claimed compendium carries five fields as 8-23-graph fragments and nothing of s1.d0 (19 graphs, 0/12 windows at k=8); the older 傳燈錄 stratum matches three fields at least as well (offsets above), and the s2.d0 saying also appears whole in `T47n1997`. An older complete copy is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** cbeta_note PRESENT and ID-correct: "Corrected 2026-08-08: dropped spurious '/T1985' pairing — T1985 is strictly the Record of Linji. Nanquan's record is 古尊宿語錄 (X68n1315, 卍續藏第68冊)." No coverage_note, no recension_note: nothing records that the wording is fragmentary or that the 傳燈錄/雲門 records carry parts. Label state: ID-correct, coverage-silent.

- **p0_findings:**
  - **source-integrity** — 0/6 collated; the largest contiguous run is 23/27 graphs and one field (s1.d0) has no >= 8-graph run in any of the 39 refs. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc nanquan_yulu` → 0/6, {"NOT_FOUND": 6}.
  - **attribution** — For three fields the 傳燈錄 matches at least as well as the claimed compendium (`T51n2076` @75,502, @67,316, @74,875), and s2.d0's windows are all in `T47n1997` too. Reproduce: the collator run plus the LCS offsets in `/tmp/stratum-fam3.txt`; the cross-ref column in the block table shows {"T47n1997": "4/4"} for s2.d0.
  - **labeling** — No coverage note. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/nanquan_yulu.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'].

- **proposed_label:** A 南泉 selection of fragments (max 23/27) with three fields measuring equal-or-better in T51n2076 and one saying also in T47n1997 — needs a coverage label; no verbatim claim is supportable.

---

### `wudeng_huiyuan`

- **doc / claimed witness(es):** `wudeng_huiyuan` / `X80n1565`
- **reference sha256 (first 16) + length in graphs:** `X80n1565` `a3d20a107ff69495` … / 581,588 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/3**, flags by class {"NOT_FOUND": 3} (full content summary {"NOT_FOUND": 3}); metadata (title/name, excluded from the denominator) {"NOT_FOUND": 2, "TITLE_COMPOSITE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (6 flagged fields = every non-EXACT/non-EMPTY field of the 6-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 6 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.4 | X80n1565 | no | — | — | — |
| `.sections[0].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/52, 0/48, 0/44, 0/36 | none-of-39 |
| `.sections[1].title_zh` | NOT_FOUND | 0.0 | — | no | — | 0/3, n/a, n/a, n/a | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/33, 0/29, 0/25, 0/17 | none-of-39 |
| `.sections[1].dialogue[1].zh` | NOT_FOUND | 0.209 | X80n1565 | no | — | 5/60, 1/56, 0/52, 0/44 | none-of-39 |

- **carriers (measured work + offset):** Claimed `X80n1565` (581,588 graphs): s1.d1 12/67 @25,713; s0.d0 and s1.d0 **nothing**. Uncited `T48n2008` (六祖大師法寶壇經, 26,043 graphs): s1.d0 18/40 @4,914, s1.d1 35/67 (@4,952 + @4,983); k=12 windows 7/29 vs 0/29 and 13/56 vs 1/56 in X80n1565. `T51n2076`: nothing.

- **candidate_older_witness:** Near-complete is defined for this document as carrying all three 五燈會元 fields. No work in the refs does. The claimed compendium carries one field in fragments (12/67 @25,713) and nothing of the other two; the two 六祖-story fields are text of the 壇經, which the compendium quotes, and the project's wording tracks the 壇經 (T48n2008: 18/40 and 35/67, offsets above) rather than the compendium. `.sections[0].dialogue[0].zh` (59 graphs) has no measured source in any of the 39 refs. An older complete 壇經 text is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** cbeta_note PRESENT but volume-only: "Volume field corrected 2026-08-08: X1565 五燈會元 is 卍續藏第80冊 (X80n1565) — the prior '80' was the 續藏 volume number stored under taisho_vol." No coverage_note, no recension_note: the record names only the compendium and never the 壇經 source of the two stories. Label state: volume-corrected, coverage-silent, carrier unnamed.

- **p0_findings:**
  - **attribution** — The measured carrier of both 六祖 fields is `T48n2008` (18/40 @4,914; 35/67 @4,952/@4,983), not the claimed `X80n1565` (0/40 and 12/67); the project's wording is on the 壇經 side of the quotation chain. Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc wudeng_huiyuan` → 0/3, {"NOT_FOUND": 3}; probe fragments in `/tmp/probes-f3.txt` (k=12 windows 7/29 vs 0/29, 13/56 vs 1/56).
  - **source-integrity** — `.sections[0].dialogue[0].zh` (59 graphs; 0/52 windows at k=8) has no measured source in the 39 refs. Reproduce: the collator run plus the block table.
  - **labeling** — No coverage note; the only note is the volume correction. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/wudeng_huiyuan.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'].

- **proposed_label:** A 五燈會元-attributed record whose two measurable fields are 壇經 text (T48n2008 18/40, 35/67) and whose first field is unsourced — needs an attribution/coverage label naming T48n2008.

---

### `xuansha_yulu`

- **doc / claimed witness(es):** `xuansha_yulu` / `X73n1445`, `X73n1446`
- **reference sha256 (first 16) + length in graphs:** `X73n1445` `6072f03b9f065cec` … / 36,543 graphs; `X73n1446` `87b584b080cc308a` … / 16,452 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/5**, flags by class {"NOT_FOUND": 5} (full content summary {"NOT_FOUND": 5}); metadata (title/name, excluded from the denominator) {"EXACT": 1, "DIVERGENT": 1, "NOT_FOUND": 1, "TITLE_COMPOSITE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (8 flagged fields = every non-EXACT/non-EMPTY field of the 9-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 8 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | DIVERGENT | 0.9 | X73n1445 | no | — | — | — |
| `.sections[0].title_zh` | NOT_FOUND | 0.75 | X73n1446 | no | — | 5/9, 1/5, 0/1, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.55 | X73n1446 | no | — | 2/33, 0/29, 0/25, 0/17 | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.75 | X73n1446 | no | — | 16/29, 12/25, 8/21, 0/13 | none-of-39 |
| `.sections[1].dialogue[0].zh` | NOT_FOUND | 0.5833 | X73n1446 | no | — | 9/26, 5/25, 1/21, 0/13 | none-of-39 |
| `.sections[1].dialogue[1].zh` | NOT_FOUND | 0.7727 | X73n1446 | no | — | 10/15, 6/11, 2/7, n/a | none-of-39 |
| `.sections[2].title_zh` | TITLE_COMPOSITE | 0.36 | X73n1445 | no | — | — | — |
| `.sections[2].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/65, 0/61, 0/57, 0/49 | none-of-39 |

- **carriers (measured work + offset):** Claimed works: `X73n1445` (廣錄, 36,543 graphs) carries one run only — s0.d1 10/36 @460. `X73n1446` (語錄, 16,452 graphs) carries s0.d0 9/40 @768, s0.d1 23/36 @804, s1.d0 26/36 (@12,317, two fragments), s1.d1 17/22 @12,333. `T51n2076` carries s0.d1 24/36 (@188,548 + @188,561), s1.d0 26/36 @192,447, s1.d1 16/22 @192,463 — equal or better than X73n1446 for three fields.

- **candidate_older_witness:** Near-complete is defined for this document as carrying all five 玄沙 fields. No work in the refs does. The two claimed works are far from equal: the 廣錄 X73n1445 contributes one 10-graph run, and every other measurable match is in the 語錄 X73n1446 or in the older 傳燈錄 stratum, which matches three fields at least as closely. `.sections[2].dialogue[0].zh` (72 graphs) has no run >= 8 graphs in any of the 39 refs. An older copy is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** cbeta_note PRESENT and ID-correct: "Corrected 2026-08-08: prior 'X1310 / T1991' wrong — X1310 is 拈八方珠玉集; T1991 is 金陵清涼院文益禪師語錄 (Fayan). Xuansha's records are X73n1445 廣錄 and X73n1446 語錄 (明 林弘衍編次)." No coverage_note, no recension_note: nothing states that X73n1445 is effectively unused by the data or that the 傳燈錄 carries parts. Label state: ID-correct, coverage-silent.

- **p0_findings:**
  - **attribution** — X73n1445 carries one 10-graph run in five fields; for three fields the 傳燈錄 stratum equals or exceeds X73n1446 (offsets above). Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc xuansha_yulu` → 0/5; LCS offsets in `/tmp/stratum-fam3.txt`.
  - **source-integrity** — `.sections[2].dialogue[0].zh` (72 graphs; 0/65 windows at k=8) has no source >= 8 graphs in any of the 39 refs, and no field is verbatim. Reproduce: the collator run plus the block table.
  - **labeling** — No coverage note. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/xuansha_yulu.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'].

- **proposed_label:** A 玄沙 selection actually carried by X73n1446 with a 傳燈錄 overlap (T51n2076 @192,447/@192,463); X73n1445 must not read as a carrier, and a coverage label is required.

---

### `xuefeng_yantou`

- **doc / claimed witness(es):** `xuefeng_yantou` / `X69n1333`, `T51n2076`
- **reference sha256 (first 16) + length in graphs:** `X69n1333` `01f64d7aca369a74` … / 31,776 graphs; `T51n2076` `a860907edd3d34b9` … / 358,501 graphs (digests verified byte-for-byte by the extraction step: 39 verified / 0 drift).
- **my_measured:** collated **0/4**, flags by class {"DIVERGENT": 1, "NOT_FOUND": 3} (full content summary {"DIVERGENT": 1, "NOT_FOUND": 3}); metadata (title/name, excluded from the denominator) {"EXACT": 1, "NOT_FOUND": 1, "TITLE_COMPOSITE": 1}. Δ vs register baseline: **none** (identical to the 2026-09-10 register — no re-key on main for this doc yet).
- **per_flag:** (6 flagged fields = every non-EXACT/non-EMPTY field of the 7-field walk; verbatim-in-witness = normalized field text is a substring of the claimed witness text; windows = distinct k-graph windows of the field as written (CJK-only, no variant map) found in the union of the claimed witnesses, hit/total; cross-ref = the same 24-graph windows searched against the other 38 refs, only non-zero hits shown. By construction every flagged field is non-verbatim in every claimed witness — the classifier tests containment first, and 0 of 6 flagged fields here contain a verbatim claimed witness, so the column reads uniformly `no`):

| path | class | sim | ref | verbatim-in-witness | probe-verbatim | windows 8/12/16/24 (NOT_FOUND) | cross-ref (other refs) |
|---|---|---|---|---|---|---|---|
| `.title_zh` | TITLE_COMPOSITE | 0.31 | T51n2076 | no | — | — | — |
| `.sections[0].title_zh` | NOT_FOUND | 0.75 | X69n1333 | no | — | 2/5, 0/1, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[0].zh` | NOT_FOUND | 0.0 | — | no | — | 0/73, 0/69, 0/65, 0/57 | none-of-39 |
| `.sections[0].dialogue[1].zh` | NOT_FOUND | 0.7857 | X69n1333 | no | — | 4/7, 0/3, n/a, n/a | none-of-39 |
| `.sections[0].dialogue[2].zh` | NOT_FOUND | 0.7551 | X69n1333 | no | — | 7/42, 2/38, 0/34, 0/26 | none-of-39 |
| `.sections[1].dialogue[0].zh` | DIVERGENT | 0.8889 | X69n1333 | no | — | — | — |

- **carriers (measured work + offset):** Claimed works: `X69n1333` (31,776 graphs) — s0.d1 11/14 @2,091; s0.d2 21/49 (@2,299 + @2,321); s1.d0 19/27 @17,021 (the DIVERGENT field); s0.d0 **0/80**. `T51n2076` (358,501 graphs) — **no run >= 8 graphs in any field**; its 卷16 carries the 雪峰/巖頭 biographies but not the project's wording.

- **candidate_older_witness:** Near-complete is defined for this document as carrying all four 雪峰/巖頭 fields. No work in the refs does. The claimed record carries three fields as 11-21-graph fragments; the first field (80 graphs) has no run anywhere in the 39 refs; the second claimed witness, `T51n2076`, carries none of the wording at all. The older stratum for the phrasing is `OUT-OF-CBETA — human sourcing required, not agent work`.

- **label_state:** cbeta_note PRESENT and ID-correct: "Corrected 2026-08-08: prior 'T1983 / T1985' wrong — T1983 is 淨土五會念佛略法事儀讚; T1985 is strictly the Record of Linji. Xuefeng's record is X69n1333 (真覺禪師語錄); Xuefeng & Yantou biographies in 景德傳燈錄 卷16 (T51n2076)." No coverage_note, no recension_note: nothing says the T51n2076 claim is unmet for the wording. Label state: ID-correct, coverage-silent.

- **p0_findings:**
  - **source-integrity** — 0/4; the largest run is 21/49 graphs and the first field (80 graphs) has no source >= 8 graphs in any of the 39 refs. The DIVERGENT s1.d0 differs in its closing graphs (data 漆黑窠裏 vs witness 漆桶不會). Reproduce: `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc xuefeng_yantou` → 0/4, {"DIVERGENT": 1, "NOT_FOUND": 3}.
  - **attribution** — The `cbeta_id` claims 景德傳燈錄 卷16 as a witness; the project's wording has no >= 8-graph run in T51n2076 (all six window counts 0). Reproduce: the collator run above plus the window columns in the block table.
  - **labeling** — No coverage note. Reproduce: `python3 -c "import json;d=json.load(open('data/corpus/xuefeng_yantou.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'].

- **proposed_label:** A 雪峰/巖頭 selection carried only by X69n1333 in fragments (11/14, 21/49, 19/27); the claimed T51n2076 carries none of the project's wording — needs a coverage label and a variant note for s1.d0.

---

## §9 The `T51n2076` stratum — ranking findings with both offsets

The prompt asks: where the project cites an X-series compendium but the same passage exists in an older stratum of `T51n2076` (景德傳燈錄), that is a ranking finding, with both offsets recorded. Measured pattern for the 12 documents:

- **`mazu_yulu`** — s3.d0 **verbatim** in T51n2076 @57,513 (32/32), **absent** from the claimed X69n1321; T51n2076 also carries a fuller s0.d0 (57/62 @321,488-@321,528), whole s2.d0 (@106,667 + @57,267) and 33/83 of s5.d0 (@69,468-@69,493).
- **`dazhu_huihai`** — T51n2076 @58,336 carries 44/54 of s0.d1, **more** than the claimed X63n1224 (40/54 @88); also s0.d0 26/60 (@58,280 + @58,302), s2.d0 20/32 @59,580, s2.d1 16/43 @59,608.
- **`foyan_qingyuan`** — the same 27/48 run is at X68n1315 @4,284 **and** T51n2076 @87,323 (data[8] 迴 vs witness 迥): the compendium is quoting the older layer, and the run also appears in T48n2003/X67n1309/X80n1565 (4/25 of 24-grams each).
- **`xuansha_yulu`** — T51n2076 24/36 @188,548+@188,561 (s0.d1), 26/36 @192,447 (s1.d0), 16/22 @192,463 (s1.d1): equal to or better than the claimed X73n1446 for three of five fields, and X73n1445 carries one 10-graph run in the whole document.
- **`nanquan_yulu`** — T51n2076 10/33 @75,502, 9/28 @67,316, 8/26 @74,875; s2.d0's 24-gram windows are all also in `T47n1997` (4/4).
- **`dahui_shobogenzo`** — s1.d0 is **only** in T51n2076 (9/56 @142,146; 0 in the claimed X67n1309).
- **`wudeng_huiyuan`** — not a 傳燈錄 stratum but the same class of finding: the 六祖 fields are 壇經 text (T48n2008 18/40 @4,914 and 35/67 @4,952+@4,983) that the claimed compendium quotes; the project's wording tracks the 壇經 (k=12 windows 7/29 vs 0/29 and 13/56 vs 1/56).
- **`chuandenglu`** — the claimed witness *is* T51n2076; the uncited X80n1565 carries three fields better (25/31 @58,342+@58,356; 26/27 @58,424+@58,434; 19/21 @83,122) and the uncited T48n2001 carries s1.d0 whole @66,315, so the selection mixes three strata.
- **`caoxi_zhuan`** — T51n2076 carries no run >= 8 graphs; the measurable parallels are with the 壇經 recensions (T48n2008 19/70 @4,958+@3,376, 22/56 @3,570+@3,588, 10/75 @5,711).
- **`baizhang_guanglu`, `deshan_yulu`, `xuefeng_yantou`** — T51n2076 carries no run >= 8 graphs of any field, so no 傳燈錄 ranking finding exists for these texts as written (for `baizhang_guanglu` the measured carrier is the uncited X80n1565; for `deshan_yulu` it is X80n1565/X68n1315; for `xuefeng_yantou` it is X69n1333).

### Special check — the corrected `X1458` claim

`grep -rn 'X1458' data/ docs/ .orchestrator/` returns the string **only inside the corrective note itself** (`data/corpus/caoxi_zhuan.json`), i.e. the project does not repeat the corrected claim anywhere as a witness; the record and its locator/metrics echoes carry the corrected `X1598 (曹溪大師別傳) / P.3018` value. P.3018 is out of CBETA and out of the 39 refs, so it is a `human sourcing required` item.

## §10 Priority feed — 0-or-1 collated content field *and* no honest label, most exposed first

Ranked from **this run's numbers** (not copied from the prompt). "No honest label" = no coverage_note and no recension_note in the data file, or a note whose stated provenance the measurement contradicts. The primary sort is the number of content fields with **no run >= 8 graphs in any claimed witness** (that is the exposure), ties broken by the collated count and by label severity.

| # | doc | collated content fields | fields with no run in any claimed witness | label state | P0 class |
|---|---|---|---|---|---|
| 1 | `baizhang_guanglu` | 0/6 | 6 of 6 | cbeta_note only (ID-correct) | source-integrity + attribution + labeling |
| 2 | `foyan_qingyuan` | 0/6 | 4 of 6 (one shared X68n1315 = T51n2076 run) | cbeta_note only (ID-correct) | source-integrity + attribution + labeling |
| 3 | `caoxi_zhuan` | 0/4 | 3 of 4 (three fields 0 runs) | cbeta_note only (ID-correct) | source-integrity + attribution + labeling |
| 4 | `mazu_yulu` | 0/8 | 2 of 8 (s1.d0 has no source anywhere) | coverage_note names a 洞山 work (T1986) and "6" fields | labeling + attribution + source-integrity |
| 5 | `dazhu_huihai` | 0/6 | 2 of 6 (plus X63n1223 contributes nothing) | cbeta_note only (ID-correct) | attribution + source-integrity + labeling |
| 6 | `dahui_shobogenzo` | 0/4 | 2 of 4 (s2.d0 has no source anywhere) | cbeta_note only (ID-correct) | attribution + source-integrity + labeling |
| 7 | `wudeng_huiyuan` | 0/3 | 2 of 3 (the carrier is an uncited work) | cbeta_note only (volume correction) | attribution + source-integrity + labeling |
| 8 | `nanquan_yulu` | 0/6 | 1 of 6 (max run 23/27) | cbeta_note only (ID-correct) | source-integrity + attribution + labeling |
| 9 | `xuansha_yulu` | 0/5 | 1 of 5 (s2.d0 has no source anywhere) | cbeta_note only (ID-correct) | attribution + source-integrity + labeling |
| 10 | `xuefeng_yantou` | 0/4 | 1 of 4 (80-graph field, 0 everywhere) | cbeta_note only (ID-correct) | source-integrity + attribution + labeling |
| 11 | `chuandenglu` | 1/6 | 0 of 6, but the single collated field is a five-graph line | **no notes at all** | labeling + attribution + source-integrity |

`deshan_yulu` (0/6) is the one family member excluded by the label test: its situation is stated in the merged harness `WITNESS_NOTES` ("Retellings; 0/6 content fields match T2076/X68n1315/X1565 phrasing") even though the data file itself has only a volume note — but that harness sentence needs the probe qualification recorded in its block (X80n1565 carries five fields' runs, X68n1315 carries two). The prompt's authoring-time estimate put ten documents in this set; the re-run agrees on those ten and **adds** `chuandenglu` (1/6 counts as 0-or-1 and its record is completely unlabelled).

## What this is not

No file under `data/`, `docs/`, `sessions/`, `scripts/`, `.github/`, `app_data.js` or `data/project_metrics.json` was touched: this commit adds this file and nothing else, and the PR's `git diff --stat` lists only the two new inventory files (family 2 and family 3, one per commit). No re-keying, no labels added to data, no new note keys, no status flips; the findings above are a priority feed for the next work packages. No rights work, and no non-CBETA source was fetched: where a passage is absent from the witness the output is a label, not text, and no Classical Chinese was generated for an unsourced field. The `P.3018` and `SBCK`/Dunhuang witnesses named by the records remain human-sourcing items.
