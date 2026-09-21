# P2 Tier2 remaining works — authenticity labels (2026-09-21)

* **Dispatch:** `docs/P2_STUB.md` (presented stub, "P2 — Tier2 remaining 7"), session branch `arena/01a0c42c-translatechan`, base `5982e3e` (P3 frontier final rebased).
* **Scope:** the seven Tier2 works that had not yet been measured/labelled — `deshan_yulu`, `xuansha_yulu`, `xuefeng_yantou`, `yuanwu_letters`, `foyan_qingyuan`, `caoxi_zhuan`, `sengzhao_zhaolun`. Rule: re-key verbatim from the pinned CBETA `dbdea41071e1e260ad84b72faefd4587333cf76d` (extraction rule `cbeta-p5-body-cjk-v1`) only if ≥80 % of the document's source-content fields are EXACT; below the bar keep the project retellings with honest `coverage_note` / `editorial_note` / `cbeta_note` labels (047/054/056 pattern), no generated placeholders, W1 status stays `partial_or_failed`.
* **Outcome:** 0 of the 6 re-keyable documents met the 80 % bar (measured 0/6, 0/5, 0/4, 0/2, 0/6, 0/4 EXACT) → labels landed on all six; `sengzhao_zhaolun` was already re-keyed and is confirmed 4/4 content EXACT in its claimed T45n1858 (no changes). No re-key landed in this task.

## 1. Deviations from the stub (recorded, per 047/048/056 precedent)

1. **Report filename.** The stub names `sessions/P2_TIER2_NEXT_2026-09-21.md`. That path already holds task 056's committed record at base `5982e3e` (`git log --follow`: added in `5982e3e`). Overwriting it would destroy committed evidence, so this report is `sessions/P2_TIER2_REMAINING_2026-09-21.md`.
2. **Extraction digest.** The stub's "40→43 refs verified / 0 drift" is stale: the committed base already carries the 43-work digest manifest `sessions/COLLATION_W1_2026-09-21_P2_TIER2_refs_manifest.txt` (056's layer), and every witness the seven works claim — including the stub's witness-inventory works X69n1323 (manifest line 34), X68n1315 and X80n1565 — is already in that set. Honest landing: **43 refs verified / 0 drift** against the committed manifest, no 44th work added (same defect class 056's session §1 documented for its own "39→43").
3. **Branch.** The stub names `fix/p2-tier2-next`; this Arena session is locked to `arena/01a0c42c-translatechan`, so the work lands on the session branch (047/048/056 all recorded the same mismatch).

## 2. Reference layer (verbatim)

Clone: `git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5` → HEAD `dbdea41071e1e260ad84b72faefd4587333cf76d` (== pin). Sparse-checkout of the 43 manifest paths, then:

```
$ python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
      --work-list sessions/COLLATION_W1_2026-09-21_P2_TIER2_refs_manifest.txt \
      --verify-against sessions/COLLATION_W1_2026-09-21_P2_TIER2_refs_manifest.txt \
      --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
      --write-digest-manifest /tmp/refs/refs_manifest.txt
references: 43 work(s)
digest verification: 43 verified, 0 drift, 0 unlisted, 0 unavailable (against COLLATION_W1_2026-09-21_P2_TIER2_refs_manifest.txt)
✅ reference extraction/verification complete

$ cmp /tmp/refs/refs_manifest.txt sessions/COLLATION_W1_2026-09-21_P2_TIER2_refs_manifest.txt
MANIFEST cmp: identical

$ python3 scripts/collate_refs.py --verify-against sessions/COLLATION_W1_2026-09-21_P2_TIER2_refs_manifest.txt \
      --refs-dir /tmp/refs --require-verified
references: 43 work(s)
digest verification: 43 verified, 0 drift, 0 unlisted, 0 unavailable (against COLLATION_W1_2026-09-21_P2_TIER2_refs_manifest.txt)
✅ reference extraction/verification complete
```

### Witness inventory (titles verified from the pinned XML P5 at `dbdea410…`; CJK size = extracted reference)

| work | title (pinned XML `<title level="m">`) | CJK graphs |
|---|---|---|
| **X69n1323** | 百丈懷海禪師廣錄（四家語錄卷三） | 1,143 |
| **X68n1315** | 古尊宿語錄 | 445,450 |
| **X80n1565** | 五燈會元 | 581,588 |
| T51n2076 | 景德傳燈錄 | 358,501 |
| X73n1445 | 玄沙師備禪師廣錄 | 36,543 |
| X73n1446 | 玄沙師備禪師語錄 | 16,452 |
| X69n1333 | 雪峰義存禪師語錄（真覺禪師語錄） | 31,776 |
| T47n1997 | 圓悟佛果禪師語錄 | 134,134 |
| X69n1357 | 佛果克勤禪師心要 | 62,651 |
| X86n1598 | 曹溪大師別傳 | 7,438 |
| T45n1858 | 肇論 | 15,960 |

The bold rows are the stub's witness-inventory works (X69n1323 is Baizhang's claimed witness — the "Baizhang pattern" origin; its 廣錄 body is only 1,143 CJK in the pinned extraction).

## 3. Collation (verbatim)

Harness (per-doc, same invocation as 056): `COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --generated 2026-09-21 --doc <id> … --require-verified-refs --refs-manifest sessions/COLLATION_W1_2026-09-21_P2_TIER2_refs_manifest.txt --upstream-revision dbdea410… --kind p2-tier2-measurement --note … --out sessions/COLLATION_REGISTER_2026-09-21_P2_TIER2_REMAINING_MEASUREMENT.json` (all seven `--doc` flags in one run).

```
deshan_yulu              {"NOT_FOUND": 10} -> partial_or_failed_w1_collation
xuansha_yulu             {"EXACT": 1, "DIVERGENT": 1, "NOT_FOUND": 6, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
xuefeng_yantou           {"EXACT": 1, "DIVERGENT": 1, "NOT_FOUND": 4, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
yuanwu_letters           {"NOT_FOUND": 4, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
foyan_qingyuan           {"NOT_FOUND": 8, "TITLE_COMPOSITE": 4} -> partial_or_failed_w1_collation
caoxi_zhuan              {"EXACT": 1, "NOT_FOUND": 7} -> partial_or_failed_w1_collation
sengzhao_zhaolun         {"EXACT": 8} -> collated_to_claimed_witness
aggregate: {"documents": 7, "flagged_entries": 48, "fields_total": 59, "content_fields_total": 31, "content_fields_collated": 4, "metadata_fields_total": 28, "class_totals": {"DIVERGENT": 2, "EXACT": 11, "NOT_FOUND": 39, "TITLE_COMPOSITE": 7}, "source_review_status_counts": {"collated_to_claimed_witness": 1, "partial_or_failed_w1_collation": 6, "witness_unavailable": 0}, "documents_with_drifted_references": []}
register written: sessions/COLLATION_REGISTER_2026-09-21_P2_TIER2_REMAINING_MEASUREMENT.json
```

(The per-document `EXACT`/`TITLE_COMPOSITE`/`DIVERGENT` metadata entries are section-title fields; every content `zh` field of the six re-keyable documents is NOT_FOUND or DIVERGENT — `content_fields_collated: 4` is entirely `sengzhao_zhaolun`.)

### Per-field carrier measurement (greedy maximal-run decomposition, 8-graph floor, offsets in the CJK-only normalized reference — WITNESS_INVENTORY/047/048/056 method)

**deshan_yulu — 0/6 EXACT** (claimed T51n2076 景德 卷15; record cites X1565 f.7; probes X68n1315/X80n1565)
* s0.d0 (42g) 婆子: no run of 8+ graphs in any of the 43 refs.
* s0.d1 (39g): X80n1565 12/39 @157,994 (若答得施與點心若答不得且; the witness continues 且別處去 vs the field's 且請他去).
* s0.d2 (35g): X80n1565 24/35 @158,009 + @527,436; X68n1315 19/35 @291,657 + @390,643/649; T47n1998A 18/35 @16,176/16,266 (三心不可得 formula, pan-sectarian).
* s1.d0 (50g) 龍潭 candle: the Jingde carries the story in its own recension at T51n2076 @152,456 (龍問何不歸來師對曰黑龍乃點燭與師師擬接龍便吹滅) — no run of 8+ against the field; X80n1565 31/50 @158,087 + @158,106 + @158,116.
* s1.d1 (39g) 焚經: X80n1565 31/39 @158,198 + @444,681 + @158,216 + @444,692; T48n2003 23/39 @6,260 (窮諸玄辯若一毫置於太虛竭世樞機似).
* s2.d0 (31g) 德山棒: X80n1565 21/31 @158,868 + @158,969; T47n1985 13/31 @12,455; X68n1315 13/31 @39,956.
* The X80n1565 德山 chapter is 鼎州德山宣鑒禪師 (fasc. 7), chapter heading at offset 157,793, runs spanning 157,793–158,969.

**xuansha_yulu — 0/5 EXACT** (claimed X73n1445 + X73n1446)
* s0.d0 (40g) 踏痛腳指: X73n1446 9/40 @768 (曰是身非有痛從何來; witness 築著脚指流血痛楚歎曰…便回雪峯); X73n1445 0.
* s0.d1 (36g) 達摩不來東土: X73n1446 23/36 @804 (witness closes 峯然之 vs 雪峰大喜印可之); X73n1445 10/36 @460 (初祖 attribution); uncited T51n2076 24/36 @188,548 + @188,561.
* s1.d0 (36g) 明珠: X73n1446 26/36 (four 10-graph formula runs + 16-run @12,317); identical 26/36 in uncited T51n2076 @192,447–192,503 and X80n1565 @171,433–171,491 — strongest near-carrier, no complete copy.
* s1.d1 (22g): X73n1446 17/22 @12,333 (師曰盡十方世界是一顆明珠用會作麼; witness 僧便休 vs 僧於言下有省); X80n1565 17/22; T51n2076 16/22.
* s2.d0 (72g) 盲聾啞: no run of 8+ graphs in any of the 43 refs.

**xuefeng_yantou — 0/4 EXACT** (one DIVERGENT 0.8889) (claimed X69n1333 + T51n2076 卷16)
* s0.d0 (80g) 鰲山: no run of 8+ in any ref; X69n1333 holds the story @~2,000–2,340 in its own recension (噇眠去…自點胸曰…盇天盇地…鼇山成道).
* s0.d1 (14g): X69n1333 11/14 @2,091 (witness 自點胸 / 謾 vs 師撫胸 / 瞞); X80n1565 11/14 @161,679.
* s0.d2 (49g): X69n1333 21/49 @2,299 + @2,321; best carrier uncited T48n2003 32/49 @31,811 + @31,824 + @31,850/58; X80n1565 28/49.
* s1.d0 (27g) 盡大地撮來: X69n1333 19/27 @17,021 — DIVERGENT 0.8889 (witness 漆桶不會打鼓普請看 vs 漆黑窠裏。打鼓普請看); T47n1997 / T48n2003 18/27.

**yuanwu_letters — 0/2 EXACT** (claimed T47n1997 + X69n1357)
* s0.d0 (42g) 本分真人: 0 of 35 eight-graph windows in any of the 43 refs.
* s1.d0 (45g) 塗毒之鼓: 0 of 38 eight-graph windows in any of the 43 refs.
* X69n1357's attested title is 佛果克勤禪師心要 — a letter collection to named addressees (示華藏明首座, 寄張宣撫相公, …); T47n1997 the 134,134-CJK 語錄. Neither carries either project 示眾 field.

**foyan_qingyuan — 0/6 EXACT** (claimed X68n1315 古尊宿語錄·佛眼語錄)
* s0.d0 (56g) / s0.d1 (53g) 騎驢覓驢 二種病: no run of 8+ in any ref.
* s1.d0 (48g) 靈光獨耀: X68n1315 27/48 — the field core 脫根塵體露真常不拘文字心性無染本自圓成但離妄緣即如如佛 as runs @4,284 and @282,150 (witness frame 上堂云靈光獨耀迥脫根塵 — 迥 vs 迴 — plus sub-runs @384,214/378,573); the identical 27/48 recurs in T48n2003 @71,657, T51n2076 @87,323, X67n1309 @95,918, X80n1565 @61,229/87,087/468,418 — a formula, not a copy.
* s2.d0 (63g) 聽雨聲: 0 in the claimed work; best carrier T48n2001 9/63 (山河大地草木叢林 formula).
* s3.d0 (60g) 省力處: X68n1315 8/60 @440,604 (省力處便是得力處, inside the emperor's conversation); T47n1998A 8/60 @160,099.
* s4.d0 (40g) 坐禪銘: no run of 8+ in any ref.

**caoxi_zhuan — 0/4 EXACT** (claimed X86n1598 曹溪大師別傳; record also cites Dunhuang P.3018, out of CBETA)
* s0.d0 (70g) 聞經開悟: X86n1598 12/70 — longest claimed-witness run 應無所住而生其心言下大悟 @6,790, inside the 別傳's 壇經-comparison passage (獨壇經記曰三鼓入室…為說金剛經至應無所住而生其心言下大悟今謂…), not the market-awakening narrative; the field's 應無所住而生其心 span also matches three shorter 別傳 occurrences @6,745/6,881/6,986. Relatives: T48n2008 19/70 @4,958 + @3,376; X68n1315 16/70.
* s1.d0 (36g) 嶺南新州百姓: no run of 8+ in any ref.
* s1.d1 (56g) 獦獠: 0 in the claimed work; T48n2008 22/56 @3,570 + @3,588; T48n2007 8/56 @481.
* s2.d0 (75g) 獵人隊: 0 in the claimed work; T48n2008 10/75 @5,711 (每至飯時以菜寄煮肉鍋).

**sengzhao_zhaolun — 4/4 content EXACT** (claimed T45n1858 肇論; already re-keyed — the record's `coverage_note` "0/12→12/12 after re-key" stands)
* s0.d0 48/48 @1,548; s0.d1 40/40 @1,454; s1.d0 38/38 @2,416; s2.d0 39/39 @13,289 (all in T45n1858, single whole-field runs). **No changes, no labels** — it is the batch's one `collated_to_claimed_witness`.

## 4. Labels landed (047/054/056 pattern; no source-text movement)

Six documents, 45 note pointers (allowlist extended in the same change, one provenance comment per entry):

| document | pointers | content result |
|---|---|---|
| `deshan_yulu` | 9 — `.coverage_note` (rewrite), `.cbeta_note` (extend), `.editorial_note` (root, 054-pattern "Project retelling — no witness attribution"), 6 dialogue `editorial_note` R-B | 0/6 EXACT |
| `xuansha_yulu` | 8 — same pattern, 5 dialogue R-B | 0/5 EXACT |
| `xuefeng_yantou` | 7 — same pattern, 4 dialogue R-B (s1.d0 "measured near-carrier" wording, DIVERGENT 0.8889) | 0/4 EXACT |
| `yuanwu_letters` | 5 — `.cbeta_note` **additive** (the document had none), root + 2 dialogue R-B | 0/2 EXACT |
| `foyan_qingyuan` | 9 — same pattern, 6 dialogue R-B | 0/6 EXACT |
| `caoxi_zhuan` | 7 — same pattern, 4 dialogue R-B | 0/4 EXACT |

Every label names its field's measured carrier state (claimed-witness runs + best uncited carriers + offsets + window counts). No `zh`/`pinyin`/translation/`cbeta_id`/`zh_chars` byte changed (pointer diff against base verified: note pointers only). W1 `source_review_status` values and the manifest are untouched; the authoritative register chain (630 flagged, ending `COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json`) is untouched — the new register is a separate measurement artifact: `sessions/COLLATION_REGISTER_2026-09-21_P2_TIER2_REMAINING_MEASUREMENT.json`.

## 5. Docs reconciliation + gate rectification

* **Note census** (measured by the gate): **150 → 184** provenance-note strings (`cbeta_note` 29→30, `coverage_note` 42, `editorial_note` 65→98, `recension_note` 14); **108 → 142** rendered beside a passage; **36 → 37** documents with a rendered label (new: `yuanwu_letters`). Dated census-refresh / measured-correction lines prepended in README, AUDIT, HANDOFF, ROADMAP, vision, RESEARCH_RELEASE_PLAN.
* **All-string CJK 918,065 → 919,112** (+1,047 note text; content CJK unchanged at 855,603): README honest-status, AUDIT current-verdict, HANDOFF quick-count reconciled; `data/project_metrics.json` regenerated via `validate_data.py --write-metrics`.
* **Smoke pin rectification (pre-existing drift, verified at HEAD before this task's changes):** the pinned lineage census in `scripts/smoke_test.mjs` (task 056's pin: 18 exact / 9 source / 4 pending) was red on the session base because the P3 frontier-final rebase (HEAD `5982e3e`: "3 frontier edges verified") moved the registry to **20 exact_locator_verified + 10 source_verified + 1 traditional_link_pending_exact_locator** (31 edges, 4 frontiers). The pin "tracks the registry, not a target" (its own comment) → pin updated to the measured registry values with a dated comment, per 056's gate-rectification precedent.

## 6. Gates (verbatim, final fresh run)

```
$ python3 -m py_compile scripts/*.py
PASS (no output)

$ python3 scripts/validate_data.py
✅ DATA VALIDATION PASSED
   corpus=44 | slots=1252 | verified=177 | matrix=21 | locators=4192/4192
   W1 source review: collated=10 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-21 → sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json

$ python3 scripts/build_data_bundle.py   (x2, sha256 compared)
✅ Successfully compiled 44 corpus documents: /home/user/translatechan/app_data.js (8,815,389 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)
(twice) → two consecutive builds byte-identical (sha256 41b483801d6ff6f3a6c6748391cab405c446d00929d7d9cc5f6386e1c1a5f548, app_data.js == docs/app_data.js)

$ diff -rq data docs/data
(clean — no output)

$ python3 scripts/test_source_preservation.py
0 unauthorized changes
✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes

$ python3 scripts/test_source_review_rules.py
145 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK

$ node scripts/smoke_test.mjs
✅ SMOKE TEST PASSED    (44 corpus texts exercised, 0 crashes)
```

Bundle size 8,783,101 B → **8,815,389 B** (the 34 new note strings + regenerated metrics). `node scripts/compat_runtime_check.mjs`: ✅ COMPAT-RUNTIME OK. `node scripts/browser_test.mjs`: not run in this sandbox (playwright not installed; not a CI gate; the PR-A browser track stays frozen per the owner ruling — same as 056's environment note).

## 7. What this task did NOT do (inherited, unchanged)

* No re-key: every re-keyable document measured below the 80 % bar; the honest carriers (X80n1565 五燈會元 德山 chapter; T48n2008 壇經 recension; T48n2003/X80n1565 formula carriers; X69n1333's own recensions) are named in the notes as candidates for future RE-KEY work items.
* 630 flagged stays authoritative; no manifest `source_review_status` moved; the 2026-09-21 enthusiast overlay and the W1 register chain are unmodified.
* `.orchestrator/STATE.md` untouched (agents update it only when the dispatch says so; the stub does not, and 056 did not).
* `sengzhao_zhaolun` left byte-identical (its earlier re-key stands; confirmed 4/4 EXACT on the 43-ref layer).
