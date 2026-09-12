# PHASE2_PLAN — Consolidation of the three W1 witness inventories into one Phase-2 decision instrument

**Generated:** 2026-09-12 · **Task:** 008 — Phase-2 consolidation (prompt `008-phase2-consolidation.md`, retrieved from `origin/_orch`: 14,099 B, sha256 `9eea38587f3127b1d3224f6f17f9fca3e6df7923b848ceb5eb1c9ae013d865d4`) · **Role:** tracker-only. One new plan file plus the three §7 stale-fact corrections in `STATE.md` / `REMEDIATION_PLAN.md`. **No data path, no script, no artifact was modified** — `git diff --name-only` over this work shows exactly the three §8-allowed paths.
**Base:** branch `arena/01a0931e-translatechan` at `b3cd14f` (main; the merge of #36). Hard gate passed: `git merge-base --is-ancestor b3cd14f HEAD` exits 0, all three `WITNESS_INVENTORY*.md` present, working tree clean at start, and `git diff --name-status refs/remotes/origin/main HEAD` is empty (no `A` on `.scoreboard/**`, no deleted paths).

**Inputs, read in order:** `.orchestrator/WITNESS_INVENTORY.md` (006), `.orchestrator/WITNESS_INVENTORY_T48_T51.md` (007a), `.orchestrator/WITNESS_INVENTORY_XSERIES.md` (007b).

---

## 1. Confirmed counts — method published, numbers re-counted (§3)

Every figure below was re-counted on this checkout; the exact commands are the method, not an appendix.

**35 doc blocks (= all of `data/corpus`):**

```bash
grep -hoE '^### `[a-z_]+`$' .orchestrator/WITNESS_INVENTORY*.md \
  | sed -E 's/^### `([^`]+)`$/\1/' | while read -r d; do [ -f "data/corpus/$d.json" ] && echo "$d"; done | sort | wc -l
```

→ **35** (9 + 14 + 12). Cross-check: every one of the 35 `data/corpus/*.json` keys is covered exactly once (`comm -23` of corpus keys vs. block headings is empty; no block heading names a non-corpus key). The bare `^### \`` heading count is 10/15/13 because it also catches the three `### \`iter_fields()\` walk` headings — the corpus-key-anchored method is the one that measures document blocks.

**70 P0 bullets (16/19/35 per file):**

```bash
for f in .orchestrator/WITNESS_INVENTORY.md .orchestrator/WITNESS_INVENTORY_T48_T51.md .orchestrator/WITNESS_INVENTORY_XSERIES.md; do grep -cE '^  - \*\*[a-z-]+\*\* —' "$f"; done
```

→ **16, 19, 35** = **70**. The pattern's lowercase-only class `[a-z-]+` naturally excludes the six explicit `**NONE** —` entries (they are uppercase), so this is the count of real P0 findings; the six `NONE` entries are carried into the table as kind-`NONE` rows (76 rows total, §5).

**`OUT-OF-CBETA` markers:**

```bash
grep -o 'OUT-OF-CBETA' .orchestrator/WITNESS_INVENTORY.md .orchestrator/WITNESS_INVENTORY_T48_T51.md .orchestrator/WITNESS_INVENTORY_XSERIES.md | wc -l
```

→ **33** occurrences (9 / 12 / 12 per file). Composition: 31 documents carry a genuine OUT-OF-CBETA finding line (8 + 11 + 12); the remaining two occurrences are 006's closing prose ("where the older near-complete recension is not in CBETA, the line above says `OUT-OF-CBETA — human sourcing required, not agent work`") and 007a's `platform_sutra` line, which contains the token only in its negation ("…both in CBETA and in the refs, so no `OUT-OF-CBETA` line applies"). The authoring-time figure of 35 is **not reproduced by the token count**; the only method that lands on 35 is counting `grep -o 'human sourcing required'` (9 / 12 / 14 — the two extra hits are prose repetitions of the policy, not markers). This plan builds the §7 human-sourcing queue from the 33 marker occurrences / 31 documents, and records the difference rather than copying the prompt's number.

**`Reproduce` markers:**

```bash
grep -c 'Reproduce' .orchestrator/WITNESS_INVENTORY.md .orchestrator/WITNESS_INVENTORY_T48_T51.md .orchestrator/WITNESS_INVENTORY_XSERIES.md
```

→ **4 / 23 / 35** — exactly the authoring-time asymmetry (006 carries four, the other two carry 23 and 35).

## 2. Re-verification — extraction, collation, five spot-checks (§4)

**Extraction** (full 39-work run, pinned upstream, refs in `/tmp` only):

```bash
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
git -C /tmp/xmlp5 rev-parse HEAD   # dbdea41071e1e260ad84b72faefd4587333cf76d — the pin, unchanged
sed 's/.*  ref_//; s/\.txt$//' sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  | while read -r w; do printf '/%s/%s/%s.xml\n' "${w:0:1}" "${w:0:3}" "$w"; done > /tmp/paths.txt
git -C /tmp/xmlp5 sparse-checkout set --no-cone $(tr '\n' ' ' < /tmp/paths.txt) && git -C /tmp/xmlp5 checkout
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
  --work-list sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --upstream-revision "$(git -C /tmp/xmlp5 rev-parse HEAD)" --require-verified
```

→ `references: 39 work(s)` / `digest verification: 39 verified, 0 drift, 0 unlisted, 0 unavailable` → **39 verified / 0 drift** at `dbdea41071e1e260ad84b72faefd4587333cf76d`.

**Collation** (all 35 documents, one run, register in `/tmp` only):

```bash
COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 \
  --refs-manifest sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --compare-register sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json \
  --corrects sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json \
  --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
  --require-verified-refs --out /tmp/inv-full.json
```

→ 35 documents; the run flags **532** total fields (the figure 007b's header states) and reproduces every self-test row the inventories measure on current main: `linji_yulu` 84/89, `biyanlu_cases` 373/395, `wumenguan` 174/181, `xinxin_ming` 36/37, `platform_sutra` 4/13, `zhengdao_ge` 6/6, `hanshan_poems` 0/4 (WITNESS_UNAVAILABLE). The collation is therefore collating current `main`, not the stale 2026-09-10 register.

**Known method gap closed, not inherited:** the three inventories' only "graphs apart" distance claim is `sengzhao_zhaolun`'s "470 graphs apart" (007a; the task prompt names `dahui_hongzhi` here, but that document's block asserts no offset — see §6). Re-derived at fragment granularity, CJK-only windows (the reference is unpunctuated):

```bash
python3 -c "
import json,re
d=json.load(open('data/corpus/sengzhao_zhaolun.json'))
f=d['sections'][0]['dialogue'][0]['zh']
t=open('/tmp/refs/ref_T45n1858.txt').read()
cjk=re.sub(r'[^\u4e00-\u9fff]','',f)
print(t.find(cjk[0:10]),t.find(cjk[17:26]),t.find(cjk[27:49]))"
```

→ **1094 1564 1574** — run 1 (10 graphs) @1,094, run 2 (9 graphs) @1,564, run 3 (22 graphs) @1,574; 1,564 − 1,094 = **470 exactly**. The inventory's own published command (`t.find('夫生死交謝寒暑迭遷有')` / `t.find('旋嵐偃嶽而常靜')` → 1094 1564) reproduces identically. The claim is precise, not "loose but directionally right"; the prompt's hint that 8-gram anchors land ~493 apart is not reproduced under any anchoring of the quoted fragment boundaries and is recorded as a prompt-side misstatement (§6).

**Five spot-checks — each run with the inventories' own commands:**

| # | category (source) | finding checked | command(s) run | outcome |
|---|---|---|---|---|
| A | source-integrity (007a) | `sengzhao_zhaolun` splice, 0/4, passages 470 apart | offsets above; `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc sengzhao_zhaolun` → content 0/4 {NOT_FOUND 4} | **reproduces** (first probe with punctuation-inclusive windows returned −1 because the ref is unpunctuated; the CJK-only window semantics are the inventory's published method, and the inventory's own command reproduces exactly) |
| B | attribution (006) | `zhaozhou_yulu`'s claimed T1987 is the Caoshan record | `head -c 24 /tmp/refs/ref_T47n1987A.txt` → 曹山大師語錄序…; `python3 -c "t=open('/tmp/refs/ref_T47n1987A.txt').read();print(t.count('趙州'),t.count('曹山'))"` → 1 25; collator `--doc zhaozhou_yulu` → content 0/19 {NOT_FOUND 19}; `grep -o "excerpted from T1987" data/corpus/zhaozhou_yulu.json` → present | **reproduces** — this is the rank-1 finding (top 5) |
| C | labeling (006) | `fayan_yulu` coverage_note cites T1985 / X1321 (two unrelated works) | `head -c 24 /tmp/refs/ref_T47n1985.txt` → 臨濟慧照玄公大宗…; `head -c 20 /tmp/refs/ref_X69n1321.txt` → 江西馬祖道一…; `grep -o "from T1985 / X1321" data/corpus/fayan_yulu.json` → present | **reproduces** |
| D | OUT-OF-CBETA (007a, plus 007b's P.3018) | `niutou_juezhu` has no CBETA witness; P.3018 absent from refs | collator `--doc niutou_juezhu` → content 0/5 {WITNESS_UNAVAILABLE 5}; `ls /tmp/refs | grep -c P3018` → 0 | **reproduces** |
| E | fabricated text, run against the draft top-5 (006) | `dahui_hongzhi` 默照銘 tail attested in no ref | `grep -c 雪覆夜沼 /tmp/refs/*.txt | grep -v ":0"` → no output; `grep -c 只這箇是 /tmp/refs/*.txt | grep -v ":0"` → no output; `python3 -c "t=open('/tmp/refs/ref_T48n2001.txt').read();i=t.find('默默忘言');print(t[i:i+56])"` → …露月星河雪松雲嶠…; collator `--doc dahui_hongzhi` → content 0/6 {NOT_FOUND 6} | **reproduces** — final rank 7: the strict tier rule (false public claim > fabricated text) places the six false-citation rows first, so the top-5 slot itself is covered by spot-check B (rank 1) |

All five reproduce; none produces a difference. The spot-check table is the evidence that the ranking below is not "a better-formatted guess".

## 3. Classification — one kind per row, stated rules (§5)

| kind | meaning | who acts |
|---|---|---|
| `CITATION` | the public claim names a wrong or absent work | coder PR, highest urgency |
| `RE-KEY` | a witness exists in the pinned 39-work set and carries the passage; the project's field diverges | coder PR |
| `LABEL` | text absent from the claimed witness, no older substitute in the set → honest note, keep text | coder PR |
| `HUMAN-SOURCE` | older near-complete witness exists outside CBETA (`OUT-OF-CBETA`) | owner/operator; **never** an agent |
| `NONE` | already honest and labelled | none |

Rules applied, stated so the table is auditable:

1. **The P0 class is not the kind.** A finding's kind is set by its defect: a wrong/absent work named in a public claim (manifest `cbeta`, `cbeta_id`, `coverage_note` citation) is `CITATION` whatever the inventory called the bullet. Concretely: `zhaozhou_yulu`'s *labeling* bullet (coverage_note "excerpted from T1987") is `CITATION`, because the note repeats the false witness claim — its fix is the same citation-string edit, not a new disclosure.
2. **`HUMAN-SOURCE` never becomes `RE-KEY` by inference.** `caoxi_zhuan` (P.3018) and `lidai_fabao_ji` (P.2125) stay `HUMAN-SOURCE` even where an in-set work carries fragments of the same passages; the older witness is outside CBETA and stays a human queue item.
3. **`CITATION` outranks `RE-KEY` of the same document** in the ranking (tier 1 sits above everything).
4. **Nothing is dropped.** All 76 P0 entries (70 findings + 6 explicit `NONE` entries) appear in the table. The "deferred" list is **empty** — reason: every bullet was classifiable from the inventories' own text plus this run's measurements; no bullet required information that does not exist.

## 4. Ranking tiers (§6)

`false public claim` **>** `fabricated text (graphs attested in no ref)` **>** `unattested-and-undisclosed` **>** `divergent-but-labelled`; within a tier, by measured damage (fraction unattested, canonicality of the text, whether a re-key target exists in-set).

**Top 5:** all five are false-public-claim rows — (1) `zhaozhou_yulu`'s T1987 claim is false: T1987 (T47n1987A/B) is the Caoshan record, the master's name 趙州 occurs 1× in each claimed witness against 曹山 25×/28×; (2) the same false claim inside `zhaozhou_yulu`'s own coverage_note; (3) `fayan_yulu`'s note citing T1985 / X1321 (the Linji and Mazu records); (4) `dongshan_yulu`'s note citing X1321 (the Mazu record); (5) `mazu_yulu`'s note citing T1986 (a 洞山 work). `dahui_hongzhi`'s fabricated 默照銘 tail is rank 7 — the highest fabricated-text row, immediately after the six false-citation rows (rank 6 is `dahui_hongzhi`'s own citation defect: the public manifest omits T48n2001).

## 5. The consolidated table — one row per finding (76 rows: 70 P0 + 6 explicit NONE)

`C <key>` abbreviates `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-11 --doc <key>` (run on this base; refs are the §2 digest-verified set). Ranks are 1 (worst) → 76 (best).

| rank | tier | doc | finding | kind | acts | reproduce (carried forward) |
|---|---|---|---|---|---|---|
| 1 | 1 false public claim | `zhaozhou_yulu` | attribution: manifest `cbeta` and `cbeta_id` cite T1987 (T47n1987A/B); the pinned witnesses are the Caoshan records (attested m-titles 撫州曹山元證禪師語錄 / 撫州曹山本寂禪師語錄, extracted head 曹山大師語錄序); the claim is false and the claim-holder record still carries it | CITATION | coder PR | `head -c 24 /tmp/refs/ref_T47n1987A.txt` → 曹山大師語錄序…; `python3 -c "t=open('/tmp/refs/ref_T47n1987A.txt').read();print(t.count('趙州'),t.count('曹山'))"` → 1 25; `C zhaozhou_yulu` → content 0/19 {NOT_FOUND 19} |
| 2 | 1 false public claim | `zhaozhou_yulu` | labeling: coverage_note "15 signature encounter dialogues excerpted from T1987" is contradicted by the 0/19 measurement — the data note repeats the false Caoshan citation | CITATION | coder PR | `grep -o "excerpted from T1987" data/corpus/zhaozhou_yulu.json` → present; `C zhaozhou_yulu` → 0/19 |
| 3 | 1 false public claim | `fayan_yulu` | labeling: coverage_note "8 canonical sermons and dialogues from T1985 / X1321" cites two unrelated works — T47n1985 is the Linji record and X69n1321 is the Mazu record; neither is a claimed witness | CITATION | coder PR | `head -c 24 /tmp/refs/ref_T47n1985.txt` → 臨濟慧照玄公大宗…; `head -c 20 /tmp/refs/ref_X69n1321.txt` → 江西馬祖道一…; `grep -o "from T1985 / X1321" data/corpus/fayan_yulu.json` → present |
| 4 | 1 false public claim | `dongshan_yulu` | labeling: coverage_note cites X1321 — the Mazu record (X69n1321) — not a claimed witness and unrelated to the content; no recension_note for the measured verse gap | CITATION | coder PR | `grep -o "excerpted from T1986 / X1321" data/corpus/dongshan_yulu.json` → present |
| 5 | 1 false public claim | `mazu_yulu` | labeling: coverage_note names T1986 — a 洞山 work (the pinned T47n1986A/B are 筠州/瑞州洞山 records) — and says "6" fields where the document has 8 | CITATION | coder PR | `python3 -c "import json;print(json.load(open('data/corpus/mazu_yulu.json'))['coverage_note'])"`; `grep -o '<title level="m" xml:lang="zh-Hant">[^<]*' /tmp/xmlp5/T/T47/T47n1986A.xml /tmp/xmlp5/T/T47/T47n1986B.xml` → 筠州洞山悟本禪師語錄 / 瑞州洞山良价禪師語錄 |
| 6 | 1 false public claim | `dahui_hongzhi` | attribution: the public manifest citation (`cbeta: "T1998A"`) omits T48n2001 (宏智禪師廣錄), the actual witness of the 默照銘 the document's title presents; the data cbeta_note records T2001 being dropped 2026-08-08 while the title claim remains | CITATION | coder PR | `grep -o '"cbeta": "T1998A"' data/corpus_manifest.json` → present; `head -c 16 /tmp/refs/ref_T48n2001.txt` → 天童覺和尚語錄…; `grep -o "宏智禪師 默照銘" data/corpus/dahui_hongzhi.json` |
| 7 | 2 fabricated text | `dahui_hongzhi` | source-integrity: the 默照銘 fields match T48n2001 only through 露月星河 and then diverge — 雪覆夜沼 / 功見照中 and the tail lines 水天一色 / 纖塵無表 / 深根不動 / 只這箇是 occur in no ref of the 39; the four 看話 letter fields are verbatim in T47n1998A/B 0/4 | RE-KEY | coder PR | `grep -c 雪覆夜沼 /tmp/refs/*.txt | grep -v ":0"` → no output; `grep -c 只這箇是 /tmp/refs/*.txt | grep -v ":0"` → no output; `python3 -c "t=open('/tmp/refs/ref_T48n2001.txt').read();i=t.find('默默忘言');print(t[i:i+56])"` → …露月星河雪松雲嶠…; `C dahui_hongzhi` → content 0/6 {NOT_FOUND 6} |
| 8 | 2 fabricated text | `guiyang_yulu` | source-integrity: 0/6 content fields verbatim in T47n1989/T47n1990 or in any of the 39 refs — every field has zero sixteen-graph windows in every ref | LABEL | coder PR | `C guiyang_yulu` → content 0/6 {NOT_FOUND 6} |
| 9 | 2 fabricated text | `yuanwu_letters` | source-integrity: both letter fields (42 and 45 graphs) absent from both claimed witnesses (T47n1997, X69n1357) and from all 39 refs; no notes disclose it | LABEL | coder PR | `C yuanwu_letters` → content 0/2 {NOT_FOUND 2}; `grep -c 本分真人 /tmp/refs/*.txt | grep -v ":0"` → no output |
| 10 | 2 fabricated text | `huangbo_wanling` | source-integrity: 0/7 in the claimed T48n2012B and 0/7 in all 39 refs (the 裴休/壁上畫像 and 噇酒糟漢 material is retold, not quoted) | LABEL | coder PR | `C huangbo_wanling` → content 0/7 {DIVERGENT 1, NOT_FOUND 6} |
| 11 | 2 fabricated text | `mazu_yulu` | source-integrity: s1.d0 (33 graphs) has no ≥8-graph run in any of the 39 refs (project wording, no measured source); s3.d0 is absent from the claimed X69n1321 (its re-key target is rank 35) | LABEL | coder PR | `C mazu_yulu` → content 0/8 {DIVERGENT 4, NOT_FOUND 4} |
| 12 | 2 fabricated text | `foyan_qingyuan` | source-integrity: four of six fields have no ≥8-graph run in any of the 39 refs | LABEL | coder PR | `C foyan_qingyuan` → content 0/6 {NOT_FOUND 6} |
| 13 | 2 fabricated text | `xuansha_yulu` | source-integrity: s2.d0 (72 graphs) has no ≥8-graph run in any of the 39 refs; no field is verbatim | LABEL | coder PR | `C xuansha_yulu` → content 0/5 {NOT_FOUND 5} |
| 14 | 2 fabricated text | `xuefeng_yantou` | source-integrity: s0.d0 (80 graphs) has no ≥8-graph run in any of the 39 refs; the largest run anywhere is 21/49 | LABEL | coder PR | `C xuefeng_yantou` → content 0/4 {DIVERGENT 1, NOT_FOUND 3} |
| 15 | 2 fabricated text | `wudeng_huiyuan` | source-integrity: s0.d0 (59 graphs) has no measured source in the 39 refs | LABEL | coder PR | `C wudeng_huiyuan` → content 0/3 {NOT_FOUND 3} |
| 16 | 2 fabricated text | `dazhu_huihai` | source-integrity: two of six fields (s1.d0, s1.d1) have no ≥8-graph run in any of the 39 refs | LABEL | coder PR | `C dazhu_huihai` → content 0/6 {DIVERGENT 2, NOT_FOUND 4} |
| 17 | 2 fabricated text | `dahui_shobogenzo` | source-integrity: two of four fields have no ≥8-graph run in the claimed X67n1309 and s2.d0 (47 graphs) has none in the 39 refs | LABEL | coder PR | `C dahui_shobogenzo` → content 0/4 {DIVERGENT 1, NOT_FOUND 3} |
| 18 | 2 fabricated text | `nanquan_yulu` | source-integrity: 0/6 collated; the largest contiguous run is 23/27 graphs and s1.d0 (19 graphs) has no ≥8-graph run in any of the 39 refs | LABEL | coder PR | `C nanquan_yulu` → content 0/6 {NOT_FOUND 6} |
| 19 | 2 fabricated text | `caoxi_zhuan` | source-integrity: 0/4; three fields have no run in the claimed X86n1598 (the fourth has 12 of 70 graphs); the measurable parallels are 壇經-recension fragments | LABEL | coder PR | `C caoxi_zhuan` → content 0/4 {NOT_FOUND 4} |
| 20 | 2 fabricated text | `baizhang_guanglu` | source-integrity: 0/6; no ≥8-graph run in either claimed work (0/44…0/40 per field); s0.d0/s0.d1 have no run in any of the 39 refs | LABEL | coder PR | `C baizhang_guanglu` → content 0/6 {NOT_FOUND 6} |
| 21 | 2 fabricated text | `lidai_fabao_ji` | source-integrity: 0/3; field 1 condenses two witness runs (20/53 graphs at T51n2075@8,796/@8,808) and fields 2–3 share nothing ≥8 graphs with any ref | LABEL | coder PR | `C lidai_fabao_ji` → content 0/3 {NOT_FOUND 3} |
| 22 | 2 fabricated text | `qinggui_monastic_codes` | source-integrity: 0/5 in T48n2025/X63n1245 and in all 39 refs; three fields have no provenance (百丈's 一日不作一日不食 at T48n2025@10,064 and the 坐禪儀 passage 36/52 in X63n1245@25,973 are the only measured fragments) | LABEL | coder PR | `C qinggui_monastic_codes` → content 0/5 {NOT_FOUND 5}; `grep -o '一日不作一日不食' /tmp/refs/ref_T48n2025.txt | wc -l` → 2 |
| 23 | 2 fabricated text | `sengzhao_zhaolun` | source-integrity: 0/4; s0.d0 splices the 物不遷論 opening (ref@1,094) onto a later passage (ref@1,564ff, 470 graphs apart) into one field — 41 of its 49 graphs are witness text but the field is not; s1.d0 (不真空論) is absent from the witness and from all 39 refs | RE-KEY | coder PR | `python3 -c "t=open('/tmp/refs/ref_T45n1858.txt').read();print(t.find('夫生死交謝寒暑迭遷有'),t.find('旋嵐偃嶽而常靜'))"` → 1094 1564; `C sengzhao_zhaolun` → content 0/4 {NOT_FOUND 4}. Re-key covers the splice; s1.d0 has no in-set witness and must stay labelled (R-B) |
| 24 | 2 fabricated text | `huangbo_chuanxin` | source-integrity: five of the six NOT_FOUND fields have zero 8-graph windows in all 39 refs; the two DIVERGENT fields are witness text at a distance (不可度量 vs 不可測度; 即是佛也 vs 即是佛) | RE-KEY | coder PR | `C huangbo_chuanxin` → content 2/11 {MINOR 1, DIVERGENT 2, NOT_FOUND 6}. Re-key the carried fields; the five unattested fields stay labelled (R-B) |
| 25 | 2 fabricated text | `chuandenglu` | source-integrity: s0.d2 has no k=12 window in any ref (a paraphrase), and the document's single collated field (1/6) is a five-graph line | LABEL | coder PR | `C chuandenglu` → content 1/6 {DIVERGENT 2, NOT_FOUND 3} |
| 26 | 2 fabricated text | `baojing_sanmei` | source-integrity: 4/6 stanzas diverge from all three CBETA carriers, which agree with each other against the data — 銀碗盛雪 / 來機便赴 / 背觸共忌 / 如面臨鏡容色相覷 occur in no ref of the 39 (the carriers read 銀盌/銀怨盛雪…來機亦赴…背觸俱非…如臨寶鏡形影相覩) | RE-KEY | coder PR | `grep -c 銀碗盛雪 /tmp/refs/*.txt | grep -v ":0"` → no output; `grep -o "銀盌盛雪\|銀怨盛雪" /tmp/refs/ref_T47n1986A.txt /tmp/refs/ref_T47n1986B.txt /tmp/refs/ref_X80n1565.txt` → one hit per file; `C baojing_sanmei` → content 2/6 {DIVERGENT 3, NOT_FOUND 1} |
| 27 | 2 fabricated text | `dongshan_yulu` | source-integrity: all five five_ranks.commentary_zh (曹山曰…) are paraphrases verbatim in no ref — 正位即是空界…捨理就事 vs the actual Caoshan commentary 正位即空界…背理就事, whose source text lives in T47n1987B 曹洞語錄 (not a claimed witness) | RE-KEY | coder PR | `python3 -c "t=open('/tmp/refs/ref_T47n1987B.txt').read();i=t.find('五位君臣旨訣');print(t[i:i+60])"`; `grep -c 正位即是空界 /tmp/refs/*.txt | grep -v ":0"` → no output |
| 28 | 2 fabricated text | `dongshan_yulu` | source-integrity: 4/5 five_ranks verse_zh follow a recension absent from CBETA — 偏中正 白頭宮女卸殘妝… has 0 hits in all 39 refs, while the claimed T47n1986B carries 失曉老婆逢古鏡… (present in 6 refs); the river-story field rewrites 過水睹影 as 涉水睹影 | RE-KEY | coder PR | `grep -c 白頭宮女 /tmp/refs/*.txt | grep -v ":0"` → no output; `grep -c 涉水睹影 /tmp/refs/*.txt | grep -v ":0"` → no output; `grep -c 過水睹影 /tmp/refs/ref_T47n1986A.txt /tmp/refs/ref_T47n1986B.txt` → 1 1 |
| 29 | 3 unattested-and-undisclosed | `deshan_yulu` | attribution: the claimed witness carries nothing measurable (0 ≥8-graph runs in all six fields); the honest carriers are the probes — X80n1565 (five fields, 12–31-graph fragments, offsets in 007b) and X68n1315 (two fields) — and the record's primary-witness assignment is wrong for the text as written | LABEL | coder PR | `C deshan_yulu` → content 0/6 {NOT_FOUND 6} |
| 30 | 3 unattested-and-undisclosed | `wudeng_huiyuan` | attribution: the measured carrier of both 六祖 fields is the uncited T48n2008 (18/40 @4,914; 35/67 @4,952+@4,983), not the claimed X80n1565 (0/40 and 12/67) | LABEL | coder PR | `C wudeng_huiyuan` → content 0/3 {NOT_FOUND 3} |
| 31 | 3 unattested-and-undisclosed | `baizhang_guanglu` | attribution: the only measured carrier is the uncited X80n1565 (4 of 6 fields, 16–28-graph fragments, offsets in 007b); the cited X69n1323/X68n1315 carry none of the wording | LABEL | coder PR | `C baizhang_guanglu` → content 0/6 {NOT_FOUND 6} |
| 32 | 3 unattested-and-undisclosed | `xuefeng_yantou` | attribution: the `cbeta_id` claims 景德傳燈錄 卷16 (T51n2076) as a witness; the project's wording has no ≥8-graph run in T51n2076 (all six window counts 0) | LABEL | coder PR | `C xuefeng_yantou` → content 0/4 {DIVERGENT 1, NOT_FOUND 3} |
| 33 | 3 unattested-and-undisclosed | `caoxi_zhuan` | attribution: P.3018 is named as a witness but is out of CBETA (0 hits in the refs); the measurable parallels are with the 壇經 recensions — human sourcing, not agent work | HUMAN-SOURCE | owner/operator | `python3 -c "import json;print(json.load(open('data/corpus/caoxi_zhuan.json'))['cbeta_id'])"` → 「X1598 (曹溪大師別傳) / P.3018」; `ls /tmp/refs | grep -c P3018` → 0 |
| 34 | 3 unattested-and-undisclosed | `lidai_fabao_ji` | attribution: the record cites T2075 **and** P.2125; P.2125 is not in CBETA and not in the reference set, so the claim to follow it is unverifiable by agent measurement — a human-sourcing item | HUMAN-SOURCE | owner/operator | `python3 -c "import json;print(json.load(open('data/corpus/lidai_fabao_ji.json'))['cbeta_id'])"` → T2075 / P.2125; `ls /tmp/refs | grep -c P2125` → 0 |
| 35 | 3 unattested-and-undisclosed | `mazu_yulu` | attribution: s3.d0 is verbatim in T51n2076 @57,513 (32/32) and absent from the claimed X69n1321; s2.d0 is whole in T51n2076 (@106,667 + @57,267) — both offsets must appear in the record | RE-KEY | coder PR | `python3 -c "import sys;sys.path.insert(0,'/tmp');import analyze as A;print(A.ref('T51n2076').t[57513:57545])"` → the 32-graph field |
| 36 | 3 unattested-and-undisclosed | `chuandenglu` | attribution: three works carry parts of the selection — the claimed T51n2076, the probe X80n1565 (best for s0.d3 and s1.d1), and the uncited T48n2001, which alone carries s1.d0 whole (17/17 @66,315) | RE-KEY | coder PR | `python3 -c "import sys;sys.path.insert(0,'/tmp');import analyze as A;print(A.ref('T48n2001').t.find('龐居士問馬祖不與萬法為侶者是甚麼人'))"` → 66315 |
| 37 | 3 unattested-and-undisclosed | `dazhu_huihai` | attribution: X63n1223 is listed first but contributes zero runs (0/6); s0.d1 is carried better by the 傳燈錄 (T51n2076 44/54 @58,336) than by the claimed X63n1224 (40/54 @88) | LABEL | coder PR | `C dazhu_huihai` → content 0/6 {DIVERGENT 2, NOT_FOUND 4} |
| 38 | 3 unattested-and-undisclosed | `nanquan_yulu` | attribution: for three fields the 傳燈錄 matches at least as well as the claimed compendium (T51n2076 @75,502, @67,316, @74,875), and s2.d0's windows are all also in T47n1997 (4/4) | LABEL | coder PR | `C nanquan_yulu` → content 0/6 {NOT_FOUND 6} |
| 39 | 3 unattested-and-undisclosed | `xuansha_yulu` | attribution: X73n1445 carries one 10-graph run in five fields; for three fields the 傳燈錄 stratum equals or exceeds X73n1446 (T51n2076 @188,548+@188,561; @192,447; @192,463) | LABEL | coder PR | `C xuansha_yulu` → content 0/5 {NOT_FOUND 5} |
| 40 | 3 unattested-and-undisclosed | `foyan_qingyuan` | attribution: the one substantial run (27/48) is shared by the claimed X68n1315 @4,284 and the older 傳燈錄 stratum T51n2076 @87,323, with variant 迴/迥 at data[8]; the passage circulates in four works, so both offsets must be recorded | LABEL | coder PR | `python3 -c "import sys;sys.path.insert(0,'/tmp');import analyze as A;print(A.ref('X68n1315').t[4284:4311]);print(A.ref('T51n2076').t[87323:87350])"` → the two runs |
| 41 | 3 unattested-and-undisclosed | `dahui_shobogenzo` | attribution: s1.d0 has no source in the claimed X67n1309 and only a 9/56 run in T51n2076 @142,146; the record names neither the stratum nor the offset | LABEL | coder PR | `C dahui_shobogenzo` → content 0/4 {DIVERGENT 1, NOT_FOUND 3} |
| 42 | 3 unattested-and-undisclosed | `dahui_hongzhi` | attribution: section[1]'s title names the recipient 張九成, who does not occur in the claimed witness T47n1998A at all | LABEL | coder PR | `grep -c 張九成 /tmp/refs/ref_T47n1998A.txt` → 0 |
| 43 | 3 unattested-and-undisclosed | `bodhidharma_erru` | attribution: the citation names T2009 with the conventional text title 二入四行論; the pinned witness's attested title is 少室六門 and the text is its third section (第三門二種入) — the collection framing is undisclosed | LABEL | coder PR | `grep -o '<title level="m" xml:lang="zh-Hant">[^<]*' /tmp/xmlp5/T/T48/T48n2009.xml` → 少室六門; `grep -c '第三門二種入' /tmp/xmlp5/T/T48/T48n2009.xml` → 1 |
| 44 | 3 unattested-and-undisclosed | `huangbo_chuanxin` | attribution: the record's own title presents the material as 傳心法要 (T48n2012A); the six NOT_FOUND fields cannot be attributed to it, and s1.d0 measures to T51n2076 instead | LABEL | coder PR | `C huangbo_chuanxin` → content 2/11 |
| 45 | 3 unattested-and-undisclosed | `yunmen_yulu` | source-integrity: 0/12 verbatim in T47n1988 — the **correct** work, 雲門匡真禪師廣錄 (11 NOT_FOUND) — so the coverage note's "from T1988" is unsupported by measurement; compressed retelling with formulaic proximity to X80n1565 only | LABEL | coder PR | `C yunmen_yulu` → content 0/12 {DIVERGENT 1, NOT_FOUND 11} |
| 46 | 3 unattested-and-undisclosed | `fayan_yulu` | source-integrity: the 宗門十規論 component (s2, a five-item project summary) summarizes X63n1226, which is not in the 39-work reference set — a claimed component with no collatable witness, undisclosed | LABEL | coder PR | `grep -c X63n1226 sessions/COLLATION_W1_2026-09-10_refs_manifest.txt` → 0 |
| 47 | 3 unattested-and-undisclosed | `huangbo_wanling` | labeling: the record names the 宛陵錄 as its witness but only one unit carries a note; there is no coverage_note stating that nothing in the document is verbatim in T48n2012B | LABEL | coder PR | `grep -c coverage_note data/corpus/huangbo_wanling.json` → 0 |
| 48 | 3 unattested-and-undisclosed | `qinggui_monastic_codes` | labeling: a composite document citing two different 清規 (T48n2025 敕修百丈清規, X63n1245 禪苑清規) with no note saying which field comes from which, and no coverage note | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/qinggui_monastic_codes.json'));print([k for k in d if 'note' in k])"` → [] |
| 49 | 3 unattested-and-undisclosed | `sengzhao_zhaolun` | labeling: 0/4 collated content fields (including the splice of rank 23) and no coverage/recension note of any kind | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/sengzhao_zhaolun.json'));print([k for k in d if 'note' in k])"` → [] |
| 50 | 3 unattested-and-undisclosed | `shitou_sandokai` | labeling: no data-level coverage/recension note, and the harness note that stands in for one mis-states the 草庵歌 finding — "absent from T51n2076" is false: the text runs from T51n2076@350,849 | LABEL | coder PR | `grep -c '吾結草庵無寶貝' /tmp/refs/ref_T51n2076.txt` → 1; `grep -c '吾結草庵無寶貝' /tmp/refs/ref_X80n1565.txt` → 0 |
| 51 | 3 unattested-and-undisclosed | `shitou_sandokai` | source-integrity: 6/11 verbatim; four fields DIVERGENT (0.93–0.97) and the 草庵歌 field is a 42-graph paraphrase whose underlying text is present in full in the claimed T51n2076 (吾結草庵無寶貝… @350,849) | RE-KEY | coder PR | `C shitou_sandokai` → content 6/11 {DIVERGENT 4, NOT_FOUND 1}; `python3 -c "t=open('/tmp/refs/ref_T51n2076.txt').read();print(t.find('吾結草庵無寶貝'),t.find('庵雖小含法界'))"` → 350849 350904 |
| 52 | 3 unattested-and-undisclosed | `bodhidharma_erru` | source-integrity: 1/6 verbatim against T48n2009; four fields at 0.949–0.973 differ by single graphs and framing (但/俱, 言/文, 都/皆; the enumeration headings are project additions) and the 三無所求行 field is re-arranged (38/58 8-graph windows, 13/42 24-graph windows in the witness) | RE-KEY | coder PR | `C bodhidharma_erru` → content 1/6 {DIVERGENT 4, NOT_FOUND 1} |
| 53 | 3 unattested-and-undisclosed | `bodhidharma_erru` | labeling: zero notes on a document whose five of six content fields do not match the witness verbatim, and whose second in-CBETA carrier (T51n2076, 2/6 verbatim) is not mentioned | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/bodhidharma_erru.json'));print([k for k in d if 'note' in k])"` → [] |
| 54 | 3 unattested-and-undisclosed | `huangbo_chuanxin` | labeling: the coverage_note's "from T2012A" is contradicted by measurement — 9 of 11 content fields are not the witness's text — and the note discloses none of the nine | LABEL | coder PR | `C huangbo_chuanxin` → content 2/11 {MINOR 1, DIVERGENT 2, NOT_FOUND 6} |
| 55 | 3 unattested-and-undisclosed | `baojing_sanmei` | labeling: no recension_note or coverage_note exists although the measured recension divergence (4/6 stanzas) is material to any verbatim claim | LABEL | coder PR | `grep -c recension_note data/corpus/baojing_sanmei.json` → 0; `grep -c coverage_note data/corpus/baojing_sanmei.json` → 0 |
| 56 | 3 unattested-and-undisclosed | `guiyang_yulu` | labeling: the title 潭州溈山靈祐禪師語錄與溈仰九十六圓相 asserts the 九十六圓相, but no 圓相 content exists in the document's fields (the witnesses merely mention 圓相 2×/3×), and no coverage/recension note exists | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/guiyang_yulu.json'));print([s['title_zh'] for s in d['sections']])"` → 3 section titles, no 圓相 material |
| 57 | 3 unattested-and-undisclosed | `baizhang_guanglu` | labeling: cbeta_note is ID-correct but there is no coverage/recension note — the record nowhere states that neither claimed work carries the project's wording, nor that 五燈會元 does | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/baizhang_guanglu.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'] |
| 58 | 3 unattested-and-undisclosed | `caoxi_zhuan` | labeling: cbeta_note is ID-correct but there is no coverage note — nothing states that three of four fields have no measured text in the claimed witness, nor that P.3018 is out of CBETA | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/caoxi_zhuan.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'] |
| 59 | 3 unattested-and-undisclosed | `chuandenglu` | labeling: a six-field selection with no coverage, recension or ID note of any kind, and a 1/6 collated credit that rests on the five-graph line 一曰圖作佛 | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/chuandenglu.json'));print([k for k in d if 'note' in k])"` → [] |
| 60 | 3 unattested-and-undisclosed | `dahui_shobogenzo` | labeling: cbeta_note is ID-correct but no coverage/recension note records that one field is carried only by the 傳燈錄 and one by nothing | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/dahui_shobogenzo.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'] |
| 61 | 3 unattested-and-undisclosed | `dazhu_huihai` | labeling: cbeta_note is ID-correct but no coverage/recension note records that X63n1223 carries none of the data as written, nor that the 傳燈錄 carries the largest single run | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/dazhu_huihai.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'] |
| 62 | 3 unattested-and-undisclosed | `deshan_yulu` | labeling: the record has only a volume note; the honest sentence lives in the harness only ("Retellings; 0/6 content fields match T2076/X68n1315/X1565 phrasing") and its "0/6 … phrasing" understates the probe coverage (X80n1565 carries five fields' runs, X68n1315 two) — promote into the record, qualified | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/deshan_yulu.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note']; `grep -n deshan_yulu scripts/collate_corpus.py` → the WITNESS_NOTES line |
| 63 | 3 unattested-and-undisclosed | `foyan_qingyuan` | labeling: cbeta_note is ID-correct but no coverage/recension note states that four of six fields have no measured source, nor that the one real match is double-carried | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/foyan_qingyuan.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'] |
| 64 | 3 unattested-and-undisclosed | `nanquan_yulu` | labeling: cbeta_note is ID-correct but no coverage note records that the wording is fragmentary or that the 傳燈錄/雲門 records carry parts | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/nanquan_yulu.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'] |
| 65 | 3 unattested-and-undisclosed | `wudeng_huiyuan` | labeling: the only note is the volume correction; the record names only the compendium and never the 壇經 source of the two stories | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/wudeng_huiyuan.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'] |
| 66 | 3 unattested-and-undisclosed | `xuansha_yulu` | labeling: cbeta_note is ID-correct but no coverage note states that X73n1445 is effectively unused by the data or that the 傳燈錄 carries parts | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/xuansha_yulu.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'] |
| 67 | 3 unattested-and-undisclosed | `xuefeng_yantou` | labeling: cbeta_note is ID-correct but no coverage note says the T51n2076 claim is unmet for the wording | LABEL | coder PR | `python3 -c "import json;d=json.load(open('data/corpus/xuefeng_yantou.json'));print([k for k in d if 'note' in k])"` → ['cbeta_note'] |
| 68 | 4 divergent-but-labelled | `biyanlu_cases` | source-integrity: 2 of the 22 MINOR content fields are NOT witness text at the flagged graph — 築 in case 10 (0× in the pinned XML and ref) and 看 in case 64 (not at that position; the witness uses 試舉看 at 60 other places) — the other 20 are `<g>`-glyph / charDecl residue | RE-KEY | coder PR | `C biyanlu_cases` → content 373/395 {MINOR 22} |
| 69 | 4 divergent-but-labelled | `biyanlu_cases` | labeling: the coverage_note calls all 22 MINOR fields "edition-graphic residue"; the measurement splits them 20 `<g>`-glyph / 2 project readings, so the blanket description is 20/22 accurate — a wording fix, not a status change | LABEL | coder PR | graph-level diff of `.cases[10].commentary_zh` and `.cases[64].pointer_zh` against the witness windows |
| 70 | 4 divergent-but-labelled | `zhengdao_ge` | labeling: metadata-only — the root title_zh is a project heading (永嘉真覺大師 證道歌) rather than the witness's attested title 永嘉證道歌, and no note discloses it; content is 6/6 verbatim | LABEL | coder PR | `grep -o '<title level="m" xml:lang="zh-Hant">[^<]*' /tmp/xmlp5/T/T48/T48n2014.xml` → 永嘉證道歌; `C zhengdao_ge` → content 6/6 |
| 71 | 4 no P0 | `linji_yulu` | explicit NONE: residual flags documented and labelled (2 MINOR `<g>`-apparatus residue; 3 NOT_FOUND 行錄 fields carry per-field R-B labels; 73 project-composed title_zh headings are metadata) | NONE | none | `grep -c 机 /tmp/refs/ref_T47n1985.txt` → 2; `C linji_yulu` → content 84/89 {MINOR 2, NOT_FOUND 3} |
| 72 | 4 no P0 | `platform_sutra` | explicit NONE: 9/13 project précis disclosed by root recension_note + coverage_note via #35 (567 of 680 graphs labelled); no P0 | NONE | none | `C platform_sutra` → content 4/13 {DIVERGENT 1, NOT_FOUND 8} |
| 73 | 4 no P0 | `wumenguan` | explicit NONE: 174/181; the single NOT_FOUND field is the labelled project-authored epilogue; six MINOR residues are edition-graphic | NONE | none | `C wumenguan` → content 174/181 {MINOR 6, NOT_FOUND 1} |
| 74 | 4 no P0 | `xinxin_ming` | explicit NONE: 36/37; the one residual field carries a per-field editorial_note (project-authored reading, no witness attribution) | NONE | none | `C xinxin_ming` → content 36/37 {NOT_FOUND 1} |
| 75 | 4 no P0 | `hanshan_poems` | explicit NONE: no CBETA witness claimed; WITNESS_UNAVAILABLE is the honest, labelled status (SBCK / Zoku lineage, out of Taishō) | NONE | none | `C hanshan_poems` → content 0/4 {WITNESS_UNAVAILABLE 4} |
| 76 | 4 no P0 | `niutou_juezhu` | explicit NONE: no CBETA witness claimed; WITNESS_UNAVAILABLE is the honest, labelled status (Dunhuang P.2885 / S.5619) | NONE | none | `C niutou_juezhu` → content 0/5 {WITNESS_UNAVAILABLE 5} |

**Kind census (76 rows):** CITATION 6 · RE-KEY 11 · LABEL 51 · HUMAN-SOURCE 2 · NONE 6.

## 6. Disagreements

**(a) Cross-inventory disagreements** — expected with 70 bullets from three authors; here is what was found and checked, not smoothed over:

1. **`fayan_yulu`'s X1321 citation (006) vs. 007b's X-series pass — the prompt's named pair.** 006 flags Fayan's coverage_note citing X1321 (the Mazu record) as a false citation; 007b's family-3 table attests X69n1321 as 馬祖道一禪師廣錄（四家語錄卷一） and flags *Mazu's own* note citing T1986 (a 洞山 work) as false. Both files therefore treat X1321 as the Mazu record and both treat citing it for a non-Mazu document as false; neither describes the same defect with an opposite severity. Confirmed by this run's spot-check C plus the pinned-XML title grep: no contradiction, severities aligned.
2. **Witness-title authority differs between files.** 006 quotes the extracted text's body-head titles (曹山大師語錄 / 曹洞語錄 for T47n1987A/B; 江西馬祖道一禪師語錄 for X69n1321; 天童覺和尚語錄 for T48n2001), while 007b's identity table quotes `<title level="m">` (撫州曹山元證禪師語錄 / 撫州曹山本寂禪師語錄; 馬祖道一禪師廣錄（四家語錄卷一）; 宏智禪師廣錄). Verified against the pinned XML: both sets are present in the pinned files, at different title levels. Same works, no severity conflict — but Phase-2 citation edits must quote the m-level titles, and this difference is why the two files can both be "right" about the same witness.
3. **Both later inventories contradict the shipped harness, and both orders say: fix the prose, not the checker.** 007a measures the 草庵歌 text present in full at T51n2076@350,849, contradicting `WITNESS_NOTES`' "absent from T51n2076 and X80n1565 alike" (reproduced here: `grep -c '吾結草庵無寶貝' /tmp/refs/ref_T51n2076.txt` → 1). 007b measures X80n1565 carrying five and X68n1315 two of `deshan_yulu`'s six fields' runs, contradicting the harness's "0/6 content fields match T2076/X68n1315/X1565 phrasing" as a blanket claim. Both are recorded above as label fixes (ranks 50, 62), not gate/script edits — per the mandate, if a gate demands an out-of-scope edit, stop; nothing here does.
4. **The task prompt's §4 names `dahui_hongzhi` as the holder of the "~470 graphs apart" claim.** The three inventories' only such claim sits in `sengzhao_zhaolun` (007a); `dahui_hongzhi`'s block asserts no offset. Re-derived here (see §2): 1,094 / 1,564 / 1,574 → **470 exactly**, so the inventory's claim is precise; the prompt's "8-gram offsets land ~493 apart" is not reproduced under any anchoring of the quoted fragment boundaries and is recorded as a prompt-side misstatement.
5. **`STATE.md`'s platform_sutra entry contradicted the merged record.** The tracker said "blocked on an owner recension ruling: CBETA T2008 宗寶 vs Dunhuang T2007" while the repo already merged #35 (labelling, primary witness T48n2007). That is the mandated stale-fact correction (§7.1) and is made in the companion commit to this file.

**(b) Spot-checks that failed to reproduce:** none — all five reproduce (§2 table). The one procedural difference is recorded in the table: an initial fragment probe with punctuation-inclusive windows returned no hits because the extracted references are unpunctuated; the inventories' published CJK-only window semantics (and their own published commands) reproduce exactly.

**(c) Findings not classifiable from the text alone:** none — every bullet was classifiable from the inventories' text plus this run's measurements. Two classifications required an explicit rule decision, recorded in §3: `zhaozhou_yulu`'s labeling bullet is `CITATION` (the note repeats the false witness claim — same defect as the manifest claim, not a new disclosure), and `bodhidharma_erru`'s attribution bullet is `LABEL` (T2009 is the right work; the defect is the undisclosed collection-section framing, not a wrong work).

**(d) Count discrepancy, not smoothed:** the authoring-time "35 `OUT-OF-CBETA` markers" is not reproduced by any token count (33; see §1). The method that lands on 35 counts `human sourcing required` (9/12/14), which includes two prose repetitions of the policy. The human-sourcing queue below is therefore built from the 33 marker occurrences across 31 documents — the substance is unaffected.

## 7. HUMAN-SOURCE queue — the OUT-OF-CBETA witnesses (§11.3)

31 documents carry an OUT-OF-CBETA finding. The named witnesses, for a human to sequence (no priority is implied by the order — 006/007a/007b reading order):

| doc | out-of-CBETA witness named by the inventory |
|---|---|
| `linji_yulu` | 867 Dunhuang 鎮州臨濟惠運禪師語錄 (not among the 39 refs) |
| `zhaozhou_yulu` | Dunhuang Zhaozhou material / 趙州錄 editions (the true witness in-set is X68n1315, but the verbatim gap is a product of the retelling) |
| `baojing_sanmei` | a recension matching the data's readings (銀碗盛雪… — 0 hits in all 39) |
| `dongshan_yulu` | the 白頭宮女卸殘妝 recension of the Five Ranks (偏中正) |
| `yunmen_yulu` | an older near-complete recension of the 雲門廣錄 |
| `fayan_yulu` | an older near-complete recension of the 金陵清涼院 record |
| `guiyang_yulu` | an older candidate carrying the six dialogues |
| `yuanwu_letters` | an older near-complete candidate for the two letters |
| `biyanlu_cases` | a source for the two single-graph readings (築, 看) if they are to be sourced rather than re-keyed |
| `bodhidharma_erru` | the oldest witnesses of the 二種入 text |
| `huangbo_chuanxin` | a witness matching the text as written (five fields have zero 8-graph windows in all 39) |
| `huangbo_wanling` | a witness matching the text as written (0/7 in all 39) |
| `lidai_fabao_ji` | Dunhuang manuscript P.2125 (named by `cbeta_id`) |
| `qinggui_monastic_codes` | a witness matching the composite as written |
| `sengzhao_zhaolun` | a witness matching the text as written (the splice is re-keyable; the 不真空論 field has no in-set witness) |
| `wumenguan` | an older copy, if one exists outside CBETA |
| `xinxin_ming` | anything older than T48n2010 |
| `hanshan_poems` | SBCK / Zokuzōkyō-lineage 寒山詩 copy (no Taishō volume) |
| `niutou_juezhu` | Dunhuang manuscripts P.2885 / S.5619 (絕觀論) |
| `baizhang_guanglu` | an older complete copy (X80n1565 fragments are the only in-set carriers) |
| `caoxi_zhuan` | Dunhuang manuscript P.3018 (named by `cbeta_id`) |
| `chuandenglu` | an older stratum beyond the 傳燈錄/五燈會元/宏智廣錄 layers |
| `dahui_shobogenzo` | an older complete copy (one field is only in T51n2076, one nowhere) |
| `dazhu_huihai` | an older complete copy (two fields have no ≥8-graph run anywhere) |
| `deshan_yulu` | the underlying wording of the 德山 record (claimed T51n2076 carries none of it) |
| `foyan_qingyuan` | an older complete copy (four of six fields have no ≥8-graph run anywhere) |
| `mazu_yulu` | an older stratum beyond the 傳燈錄 layer (s1.d0 has no source anywhere) |
| `nanquan_yulu` | an older complete copy (one field has no ≥8-graph run anywhere) |
| `wudeng_huiyuan` | an older complete 壇經 text (one field has no measured source) |
| `xuansha_yulu` | an older complete copy (one field has no ≥8-graph run anywhere) |
| `xuefeng_yantou` | the older stratum for the phrasing (one 80-graph field has no run anywhere) |

**No agent work is authorised against this queue.** No agent may fetch, transcribe, or evaluate any of these witnesses; none of them may be fetched from CBETA (they are not there) or from any other source by an agent. The queue is presented for a human to sequence; until a human supplies the material, the only agent actions against these documents are the label/citation fixes already assigned above.

## Owner decision required

The following cannot be answered by measurement. This PR decides none of them; it frames them.

**1. Fabricated text.** `dahui_hongzhi`'s 默照銘 tail (attested in no ref of the 39), `guiyang_yulu` 0/6 and `yuanwu_letters` 0/2 (attested in nothing), and the other tier-2 rows above. Options: **(a)** replace with witness text where one exists in CBETA; **(b)** keep and label as project composition with the claim removed; **(c)** remove the document from the public set. **Recommendation: (b) now, (a) where the pinned set carries the passage** — because (c) is a curation decision that belongs to the operator, and (a) is already what the `RE-KEY` rows cover (for `dahui_hongzhi` the canonical poem is complete in T48n2001; for `guiyang_yulu`/`yuanwu_letters` no in-set witness exists, so only (b) or (c) is available there).

**2. False citations — the `CITATION` set (ranks 1–6).** There is no (b): a public claim naming the wrong work should simply stop being said. The asymmetry on record: `README.md`, `AUDIT.md` and `HANDOFF.md` are already gate-enforced (`validate_data.py`) to state that Zhaozhou's claimed T1987 is the Caoshan record and that the claim is false, while `data/corpus/zhaozhou_yulu.json` still asserts it via `cbeta_id`/`coverage_note` — the public documents and the data contradict each other by design of the gate, which is the strongest possible argument for fixing the record. Ask only: **fix all `CITATION` findings in one PR, or per document?** **Recommendation: one PR** — the edits are all note/citation strings of one kind (manifest `cbeta`, `cbeta_id`, `coverage_note`), and a single PR keeps the record consistent at one moment in time.

**3. The `HUMAN-SOURCE` queue (§7).** 31 documents' OUT-OF-CBETA witnesses — Dunhuang P.3018, P.2125, P.2885/S.5619, 趙州錄 editions, the 白頭宮女 recension of the Five Ranks, the SBCK/Zokuzōkyō Hanshan lineage, and the rest of the §7 table — for a human to sequence. **No agent work is authorised against this queue**, and no agent may fetch any of these witnesses. The sequencing decision (which witnesses to acquire, in what order, at whose cost) is the owner's.

Nothing above asks a question that measurement already settled: the measured facts (counts, offsets, which rows are `RE-KEY` vs `LABEL`) are in §1–§5 and are not re-asked here. This PR cannot resolve any of the three items; its output is the queue, not the fix.
