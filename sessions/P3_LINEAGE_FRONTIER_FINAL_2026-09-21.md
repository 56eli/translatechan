# P3 Lineage Frontier Finalization — 2026-09-21

**Task:** `.orchestrator/prompts/055-p3-lineage-frontier-final.md` (stub: 4 frontiers + X1565 lb anchors — final 0 pending or fully documented frontier).
**Base:** `5982e3e` (main) — 44 docs, 4,192 locators, 10 collated, 630 flagged, lineage 31 edges = 20 `exact_locator_verified` + 10 `source_verified` + 1 `traditional_link_pending_exact_locator`, 4 frontiers, masters 35 (33 linked, 2 unlinked intentional), bundle 8,783,101 B.
**Branch:** session branch `arena/01a0c42e-translatechan` (this session is pinned to it and cannot create `fix/p3-lineage-frontier-final`; the stub's branch name is recorded here rather than acted on).
**Outcome:** **31 / 31 edges now carry a reviewed locator — 0 pending.** The fourth frontier (`dahong_zuzheng → yuelin_shiguan`) was closed with witnesses the earlier batches had not extracted, and a line-by-line re-verification pass found and corrected one class of defect the registry still carried: three `source_verified` edges whose recorded page-line pointed at unrelated text, plus four quoted spans that were paraphrase fragments rather than the witness's own words.

---

## 1. The four frontiers, old status → new status

| Edge | Base status | Final status | Witness (pinned revision `dbdea410…`) |
|---|---|---|---|
| `prajnatara → bodhidharma` | `exact_locator_verified` (batch: 3) | **UNCHANGED, re-verified** | T51n2076_p0216a19–p0216b20 (case 38) + p0217a09–p0220b22 (case 41) |
| `longtan_chongxin → deshan_xuanjian` | `exact_locator_verified` (batch: 3) | **UNCHANGED, re-verified + 1 witness-graph fix** | T51n2076_p0317b13–p0318a27 (case 452) + p0313b10–p0313c05 (case 429) |
| `yangqi_fanghui → baiyun_shouduan` | `source_verified` (batch: 3) | **UNCHANGED, re-verified + witness-graph fix** | X80n1565 fasc. 19, p0721b05 + p0724a11 |
| `dahong_zuzheng → yuelin_shiguan` | `traditional_link_pending_exact_locator` (frontier) | **`source_verified` — frontier closed** | X80n1566 juan 2, p0902b07–p0902b08 + T51n2077 juan 33, p0701a01–p0701a02 |

### 1.1 `prajnatara → bodhidharma` — re-verified

The recorded spans were re-located graph-by-graph in the digest-verified `ref_T51n2076.txt`: the 76-graph quoted block maps to **lb p0217a10–p0217a14** (inside the recorded `p0217a09–p0220b22`) and the 27th-patriarch verse `我今囑汝聽吾偈曰心地生諸種因事復生理果滿菩提圓華開世界起` maps to **lb p0216b13–p0216b16** (inside `p0216a19–p0216b20`). The 26th-patriarch case the profile cites (`p0215c15–p0216a18`, case 37) exists and is headed `第二十六祖不如密多`.

### 1.2 `longtan_chongxin → deshan_xuanjian` — re-verified, one fix

- `因造龍潭信禪師…` maps to **lb p0317b17–p0317b22**; the Longtan close `德山問久嚮龍潭到來潭又不見龍亦不現師曰子親到龍潭德山即休` maps to **lb p0313c03–p0313c05**; the naming `悟曰汝昔崇福善今信吾言可名崇信` maps to **lb p0313b17–p0313b18** — all inside the recorded ranges.
- **Fix:** the reference field labelled the fascicle heading `朗州德山宣鑑禪師`; the witness prints **`朗州德山宣鑒禪師`** (鑒). The label now uses the witness graph. The master's display name (`德山宣鑑`, master id `deshan_xuanjian`) is unchanged — that is the project's naming choice, not a locator claim.

### 1.3 `yangqi_fanghui → baiyun_shouduan` — re-verified, witness-graph fix

- X80n1565 fasc. 19 is confirmed: `袁州楊歧方會禪師` at **p0721b05**, immediately preceded by the heir heading `石霜圓禪師法嗣` at **p0721b03–p0721b04**; `舒州白雲守端禪師` at **p0724a11**, preceded by `楊歧會禪師法嗣` at **p0724a10**; `蘄州五祖法演禪師` at **p0729a07**, preceded by `白雲端禪師法嗣` at **p0729a06**.
- Verbatim spans re-checked: `冠依茶陵郁禪師披削往參楊歧` (Baiyun case) and `歧曰渠愛人笑汝怕人笑師大悟巾侍久之` — both present in the pinned extraction.
- **Fix:** the record and the profile note spelled the master `楊岐`; this witness writes **`歧`** in all four places (case heading, heir headings, both quotes). The quotes now reproduce the witness. Heading anchors were added, so the "listed under the 石霜圓禪師法嗣 / 楊歧會禪師法嗣 heir section" claim is now anchored (`p0721b04` / `p0724a10`).
- Status stays `source_verified`: the `exact_locator_verified` tier is defined for the T51n2076 witness only, and this Song-era pair postdates T2076's 1004 close.

### 1.4 `dahong_zuzheng → yuelin_shiguan` — closed with two witnesses

The frontier note in `masters.json` documented a negative search (X1565, chuandenglu_full, active corpus 44 documents). That search was correct for the witnesses used, but two Southern-Song lamp records still untapped by the earlier batches carry the answer:

- **五燈會元續略 X80n1566 juan 2, p0902b07–p0902b08** — heir section **`大洪證禪師法嗣` → `萬壽月林師觀禪師`** (with Yuelin's verse on Xuansha's three ailments).
- **續傳燈錄 T51n2077 juan 33, p0701a01–p0701a02** — independent heir index **`大洪證禪師法嗣四人 … 萬壽師觀禪師`**.

Status recorded: `source_verified` (X1566, with the T2077 heir index as corroboration) — **not** `exact_locator_verified`, because that tier is attested for T51n2076 only and the pair postdates it (in T2076: `大洪` 0, `祖證` 0, `月林` 0, `師觀` only as the verb phrases `塑師觀之` / `祖師觀此土`).

The master's **own upstream teacher remains an open frontier** and the registry still lists it: his own case (X1565 fasc. 20, `隨州大洪老衲祖證禪師`, lb p0823b11) is sayings-only (`上堂萬象之中獨露身…師曰速禮三拜`) with no teacher line, and X1566/T2077 print only his heir section. `linked_corpus_keys` stays `[]` intentional (no active-corpus document carries content about him).

**Frontier-item accounting:** the `frontiers` array lists masters whose *teacher* is not profiled (`prajnatara`, `longtan_chongxin`, `yangqi_fanghui`, `dahong_zuzheng` — 4, unchanged). Closing the fourth *edge* does not close those upstream gaps, and the validator derives that array from `masters.json`, so it stays at 4.

---

## 2. X1565 / X1566 / T2077 extraction verification

Upstream pin unchanged: **`dbdea41071e1e260ad84b72faefd4587333cf76d`** (wiki-mirror default branch `master`, verified with `git -C /tmp/xmlp5 rev-parse HEAD`).

```console
$ python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --work-list <(printf 'T51n2076\nX80n1565\n') \
    --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
    --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
    --write-digest-manifest /tmp/refs/manifest2.txt
references: 2 work(s)
digest verification: 2 verified, 0 drift, 0 unlisted, 0 unavailable (against COLLATION_W1_2026-09-10_refs_manifest.txt)
✅ reference extraction/verification complete
a860907edd3d34b99927b157849b8ac45c5e6c134abd67cde7b6a3400797ab10  ref_T51n2076.txt
a3d20a107ff69495609d555f261d28af9c4de62952fde0b32ac630dbcfe56766  ref_X80n1565.txt
```

**X1565 = 581,588 CJK graphs, sha256 `a3d20a107ff69495609d555f261d28af9c4de62952fde0b32ac630dbcfe56766`** — reproduced in this session and byte-identical to the digest recorded in `COLLATION_W1_2026-09-10_refs_manifest.txt` and in the orchestrator's witness inventories. The tracked lineage notes already cited this digest; the citation is now independently confirmed rather than merely repeated.

New witnesses extracted the same way (not part of the 44-reference corpus manifest; used as lineage witnesses only, digests recorded here so the claims can be re-run):

| Work | Graphs (CJK) | sha256 |
|---|---|---|
| 五燈會元續略 X80n1566 | 129,305 | `e09dfeeb45f415bf61df2d5395a3dd2436fb5d14b57deb778e524b2efdca4d87` |
| 續傳燈錄 T51n2077 | 334,417 | `da9e4e8aaff4484e56c9c257ab1fc148a8a7176b1ea209339b896d211dd5d488` |
| 月林師觀禪師語錄 X69n1354 | 9,494 | `fd9bf666006bf0a4527d75f72f23116645fedc2685e81aa975ec0bc3f26ae324` |
| (searched, not cited) 無門開和尚語錄 X69n1355 | 17,134 | `e7f660a9c75e940a8b9bac5ae3ddd4c3ec6028c9fc74152db9896194ca7b79c8` |
| (searched, not cited) 五燈嚴統 X80n1568 (juan 1–9) | 230,159 | `e382bc364c2b87b249f5503d9a727439348b4b43099dfd8247feaf08958cf044` |

`profile_review_queue.json`, `masters.json` and `lineage_verification.json` now name X1566 and T2077 as registered lineage sources (`wudeng-huiyuan-xulue`, `xudeng-lu`) with these digests in the source record, so no locator rests on an unrecorded extraction.

Additional searches recorded (all negative for the frontier, positive for the fix): X1566 `無門` 20 hits / `慧開` 3; T2077 `慧開` 4 / `無門` 18; X69n1355 names 月林 in its preface (`月林和尚開山師為第二代`) but never `師觀`; T2076 `五祖法演` 0, `克勤` 0, `無門慧開` 0, `慧開` 0 (the record closes 1004).

---

## 3. Corrections found by the re-verification pass

The pass checked **every** registered edge: each CJK span quoted in a note or reference was located in a digest-verified witness extraction, and each page-line/lb anchor was mapped to the text it is supposed to carry. Result: **0 unexplained quoted spans remain in any edge note or reference** (audit run: 31 edges, 9 sources, 4 frontier entries, all CJK runs ≥6 graphs either present in a pinned witness or explicitly framed as a superseded reading). The only CJK strings the audit still cannot match anywhere are display labels and work titles — `德山宣鑑禪師` (the project's display spelling against the witness's `宣鑒`), `玄沙宗一禪師`, the Caoshan work titles, and the X1354/T1985 titles — and none of them sits inside an evidence claim.

Four defects were corrected inside the registry (statuses unchanged except 1.4):

1. **`mazu_daoyi → nanquan_puyuan`** — quoted `…姓王氏初在江西大寂禪師處`, which is not contiguous in the Jingde record. Replaced with the witness reading `池州南泉普願禪師者鄭州新鄭人也姓王氏唐至德二年依大隗山大慧禪師受業三十詣嵩嶽受戒初習相部舊章究毘尼篇聚次遊諸講肆歷聽楞伽華嚴入中百門觀精練玄義後扣大寂之室頓然忘筌` (maps to **lb p0257b18–p0257b22**, inside the recorded range). The teacher link rests on `後扣大寂之室` (大寂 = Mazu).
2. **`shitou_xiqian → yaoshan_weiyan`** — quoted `…絳州人也姓韓氏年十七出家納戒後二十事南嶽希操律師…`; the witness reads `澧州藥山惟儼禪師絳州人姓韓氏年十七依潮陽西山慧照禪師出家唐大歷八年納戒于衡嶽希操律師乃曰大丈夫當離法自淨豈能屑屑事細行於布巾耶即謁石頭密領玄旨` (**lb p0311b16–p0311b20**). The heir heading `藥山惟儼禪師法嗣` (**p0314a10**) was added as its own span.
3. **`yaoshan_weiyan → yunyan_tansheng`** — the note spliced biography + heir heading into one "verbatim" quotation. Split into the two real spans: `師問雲巖作什麼巖曰擔屎` (**lb p0311c22–p0311c23**) and the Yunyan case opening `潭州雲巖曇晟禪師鍾陵建昌人也姓王氏少出家於石門初參百丈海禪師未悟玄旨侍左右二十年百丈歸寂師乃謁藥山言下契會` (**lb p0314c24–p0314c27**).
4. **Three `source_verified` locators that did not point at the claimed text** — the most serious defect found:
   - **`xuefeng_yicun → yunmen_wenyan`** — recorded `T2076 fascicle 16, page-line 0329a01 (雪峰義存法嗣 → 雲門文偃)`; p0329a01 carries `廬山棲賢懷祐禪師`. The witness's actual evidence is fascicle 19: heir directory heading `福州雪峯義存禪師法嗣下四十二人` (**p0353a11**, `韶州雲門文偃禪師` listed at **p0353a26**) and the Yunmen case `韶州雲門山文偃禪師…後造雪峯而益資玄要` (**p0356b27**). Locator replaced.
   - **`wuzu_fayan → yuanwu_keqin`** — recorded `T2076 fascicle 20, page-line 0363c10 (五祖法演法嗣)`; T2076 closes 1004 and contains neither `五祖法演` nor `克勤`, and p0363c10 carries `前撫州曹山本寂禪師法嗣`. Re-pointed to **續傳燈錄 T51n2077**: juan 25 **p0633c27–p0633c28** (`五祖演禪師法嗣` → `昭覺克勤禪師` / `成都府昭覺寺克勤佛果禪師`) + juan 20 **p0601c14** (`蘄州五祖法演禪師` case, with `佛果曰看脚下師曰滅吾宗者乃克勤爾` at p0604a23). `source_id` changed `jingde-chuandenglu` → `xudeng-lu`.
   - **`yuelin_shiguan → wumen_huikai`** — recorded `T2076 fascicle 24, page-line 0408a01 (無門慧開)`; Wumen Huikai (1183–1260) postdates T2076 entirely (`無門慧開`/`慧開` 0 occurrences) and p0408a01 carries an unrelated dialogue. Re-pointed to **X80n1566 juan 2 p0906a09–p0906a15** (`萬壽觀禪師法嗣` → `杭州黃龍無門慧開禪師`, biography `杭州梁氏子參月林看無字話六年無省 … 林遽曰何處見神見鬼了也師便喝林亦喝師又喝自此機語脗合`, i.e. 月林 named as his teacher), with the **T51n2077 juan 35 p0708b28–p0708b29** heir list (`黃龍慧開禪師字無門杭州人`) as corroboration. `source_id` changed `yuelin-shiguan-record` → `wudeng-huiyuan-xulue`.
     - Heading variance kept in the record instead of being smoothed over: X1566 prints `萬壽觀禪師法嗣` (its own index calls the same master `萬壽月林師觀禪師` under `大洪證禪師法嗣`, p0902b08); T2077 prints `萬壽崇觀禪師法嗣`. The decisive sentence is the biography's `參月林`.
     - X1354's claim in the profile (`his attendant Wumen Huikai edited his record`) is **confirmed**: the pinned CBETA header of X69n1354 reads `(侍者)法寶．法璹．慶會．法清．有宗．惟珪．道果．慧開．德秀 編`. The X1354 body extraction does not contain the compiler list, so this evidence lives in the profile note, not in a `Verbatim text` span.

Profiles updated accordingly (`data/lineage/masters.json`): `yangqi_fanghui` (witness graph 歧, heading anchors), `dahong_zuzheng` (edge closed, upstream teacher still open, corpus-search paragraph corrected — `師觀` in the active corpus is **not** zero, it is the verb phrase `祖師觀此土` in `biyanlu_cases` and `塑師觀之`/`祖師觀此土` in `chuandenglu_full`, while `月林`/`祖證`/`祖政`/`大洪老衲` are 0), `yuelin_shiguan` (locator review recorded; dates/location stay seed, no dated biography was found).

---

## 4. Profile review queue

| master | base | final |
|---|---|---|
| `prajnatara` | `frontier_source_needed` | **`complete`** (case + edge locators, review date) |
| `longtan_chongxin` | `frontier_source_needed` | **`complete`** |
| `yangqi_fanghui` | `frontier_source_needed` | **`complete`** (X1565 heir section + biography) |
| `dahong_zuzheng` | `frontier_source_needed` | **`frontier_source_needed`** (unchanged, note + next_action now name the open upstream-teacher gap and the candidate works) |
| `yuelin_shiguan` | `needs_exact_locator` | **`complete`** (locator review closed; biographical values stay seed) |

Final census: 35 records = 29 `needs_exact_locator` + 4 `complete` + 1 `in_review` + 1 `frontier_source_needed`. This is **one item more than the stub's "3 complete + 1 frontier_source_needed"**: the extra closure is `yuelin_shiguan`, whose locators the new witnesses reviewed (§1.4/§3). It is recorded here as a deliberate deviation, not a silent one.

---

## 5. Files changed

| File | Change |
|---|---|
| `data/lineage/lineage_verification.json` | 2 new sources (`wudeng-huiyuan-xulue` X1566, `xudeng-lu` T2077); 4 frontier-edge records re-verified/corrected; `dahong_zuzheng → yuelin_shiguan` pending → `source_verified`; dahong frontier reference updated |
| `data/lineage/masters.json` | `yangqi_fanghui`, `dahong_zuzheng`, `yuelin_shiguan` profile_status/profile_evidence reviewed and corrected |
| `data/lineage/profile_review_queue.json` | 4 frontier-adjacent records closed, 1 kept open with a named next action |
| `data/project_metrics.json` | regenerated (`validate_data.py --write-metrics`) |
| `app_data.js`, `docs/app_data.js`, `docs/data/**` | regenerated bundle + mirror (deterministic) |
| `scripts/smoke_test.mjs` | lineage pins updated (see §7) |
| `sessions/P3_LINEAGE_FRONTIER_FINAL_2026-09-21.md` | this report |

**No corpus text was touched.** `data/corpus/` is untouched: `test_source_preservation.py` reports 0 unauthorized changes against base `3cc7a8e9681e`, and the 630-flagged W1 review stays 630.

---

## 6. Gates (verbatim, final run)

```console
### py_compile
PASS (exit 0, no output)

### validate_data.py
✅ DATA VALIDATION PASSED
   corpus=44 | slots=1252 | verified=177 | matrix=21 | locators=4192/4192
   W1 source review: collated=10 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-21 → sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json

### build_data_bundle.py (run 1)
✅ Successfully compiled 44 corpus documents: /home/user/translatechan/app_data.js (8,794,143 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)
8794143 app_data.js
8794143 docs/app_data.js
### build_data_bundle.py (run 2)
✅ Successfully compiled 44 corpus documents: /home/user/translatechan/app_data.js (8,794,143 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)
d06efc3b5a70b93ab7e4955f711420a1  app_data.js
d06efc3b5a70b93ab7e4955f711420a1  docs/app_data.js

### test_source_preservation.py
0 unauthorized changes
✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes

### test_source_review_rules.py
145 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK

### smoke_test.mjs
DATA loaded. corpus keys: 44
APP executed + init() completed without crash
RENDERER: 44 corpus texts exercised, 0 crashes
W1 source-review rule suite: ✅ W1 SOURCE-REVIEW RULES OK
Source-preservation suite: ✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes
RENDER-LAZY: hidden rooms rendered on first tab activation

✅ SMOKE TEST PASSED

### mirror diff
MIRROR OK index.html | app.js | app.css | app_data.js | theme-init.js | og-image.svg | og-image.png | robots.txt | sitemap.xml | .nojekyll
diff -rq data docs/data → no differences
```

Bundle: **8,794,143 B** (base 8,783,101 B, Δ +11,042 B of new evidence text), byte-identical root/docs and across two consecutive builds (md5 `d06efc3b5a70b93ab7e4955f711420a1`).

---

## 7. Smoke-pin rectification (main was red)

`scripts/smoke_test.mjs` carried a lineage pin of **18 exact / 9 source / 4 pending** (batch-3 state) while the registry at base `5982e3e` was **20 exact / 10 source / 1 pending**. Reproduced on the pristine base before any edit of this session:

```console
$ git stash push -m p3-wip && node scripts/smoke_test.mjs
RENDER-LAZY: hidden rooms rendered on first tab activation
❌ lineage exact/pending census drift

🔴 SMOKE TEST: 1 failures
```

After this work the registry is **20 exact / 11 source / 0 pending**, so the pin was moved to the measured registry (the file's own documented rule: the pin tracks the registry, not a target):

- census assertion → `11 source verified` / `20 exact locators` / `0 locator pending`;
- the layered-chart assertion pinned `graph-link is-pending`; with no pending edge the graph renders none, so it now pins `graph-link is-verified` (the class every reviewed edge carries).

Result: `✅ SMOKE TEST PASSED` (0 failures) — the first green smoke run on this line since the locator batches moved the edges.

---

## 8. Warnings before → after

`validate_data.py` emits two `linked_corpus_keys is empty` warnings (`masters.json[33]` `yangqi_fanghui`, `[34]` `dahong_zuzheng`) plus the standing `jsonschema library not installed` notice and seven `gongan_index` protagonist notices. The two lineage warnings are **documented intentional, not silent**:

- neither master has a document about him in the active 44-document corpus (both cases live in X1565/X1566/T2077, which are witnesses, not corpus documents);
- `scripts/smoke_test.mjs` explicitly requires both dossiers to disclose `Project corpus link not yet curated`.

So the count stays **2 → 2, intentional**, and the "0 pending" target is met on the axis that matters: *edges*, where the frontier is now empty.

---

## 9. Method and reproduction

```console
# 1. pinned witness tree
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
git -C /tmp/xmlp5 rev-parse HEAD        # dbdea41071e1e260ad84b72faefd4587333cf76d
cd /tmp/xmlp5
git sparse-checkout set --no-cone /T/T51/T51n2076.xml /T/T51/T51n2077.xml \
    /X/X80/X80n1565.xml /X/X80/X80n1566.xml /X/X69/X69n1354.xml && git checkout

# 2. extract + digest-verify (repo rule cbeta-p5-body-cjk-v1)
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --work-list <(printf 'T51n2076\nX80n1565\n') \
    --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
    --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --work-list <(printf 'X80n1566\nT51n2077\nX69n1354\n') \
    --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d

# 3. anchor mapping: rebuild the extraction with a per-character (juan, pb, lb) map and
#    report the anchor range that covers each quoted span (throwaway analysis scripts,
#    not committed — the spans and anchors they produced are recorded above and in the JSON).

# 4. gates
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py --write-metrics
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py && python3 scripts/build_data_bundle.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
node scripts/smoke_test.mjs
```

No new runtime dependency, no secret, no workflow edit; `style=` count and the `setProperty` census are untouched (`app.js`/`index.html` not modified this session — only the generated `app_data.js`).

**BANNED COMMANDS followed:** no `git show <sha>` without `--name-only`/`--stat`, no `git log -p` on the bundle, no `git diff` dump of `app_data.js`; the bundle was compared with `md5sum`/`cmp` and `ls -l`.

---

## 10. Deviations, open items, and what a reviewer should check

**Deviations from the stub (all deliberate, all in the direction of evidence):**
1. The fourth frontier edge is **closed**, not documented-as-pending: 31/31 edges verified, 0 pending.
2. The profile queue closes **4** items, not 3 (`yuelin_shiguan` added).
3. Three `source_verified` locators and four quoted spans were corrected outside the strict frontier list — they were impossible to leave in place once the verification pass ran, and two of them (`wuzu_fayan → yuanwu_keqin`, `yuelin_shiguan → wumen_huikai`) pointed at text that has nothing to do with the claim.
4. `scripts/smoke_test.mjs` pins were updated because the registry moved and `main` was red (§7).
5. Branch: session branch `arena/01a0c42e-translatechan` (the stub's `fix/p3-lineage-frontier-final` cannot be created from this session).

**Open items (not claimed as done):**
- `dahong_zuzheng`'s own teacher and every descriptive field (dates, era, location) of the four frontier masters remain unverified; nothing was invented to fill them.
- `longtan`/`prajnatara` upstream identities, `yangqi`'s own teacher profile (石霜圓 慈明, named but unprofiled) — all still unprofiled frontiers.
- 29 `needs_exact_locator` queue records remain for masters whose *profiles* (not edges) are still seed data.
- X1566/X1568/T2077 are cited as lineage witnesses only; they are not corpus documents, so `linked_corpus_keys` stays empty for masters whose only witness is one of them.
- Open-ended scope note stands: the 102-master snapshot is not exhaustive (target 150–200 per `ROADMAP_ALL_ENCOMPASSING_2026-09-20.md`).
