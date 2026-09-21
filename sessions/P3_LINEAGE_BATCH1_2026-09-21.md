# P3 lineage batch 1 — ten exact edges and one linked frontier profile

**Date:** 2026-09-21. **Base:** main `ddce5c3987e452a7d92b5ad4d4175871feab91df`.
**Branch:** `arena/01a0c19c-translatechan`; requested `fix/p3-lineage-batch1` not created because this session is branch-fixed.

## Result and boundaries

- 31 internal edges inventoried: **10 `exact_locator_verified`, 21 pending**; all four upstream teacher frontiers unchanged.
- **Prajñātāra** now links to `chuandenglu_full`, case 38, 第二十七祖般若多羅,
  **T51n2076_p0216a19–p0216b20**, fascicle 2. The entry begins
  `第二十七祖般若多羅者。東印度人也。既得` at lb 0216a19 (the preceding mulu heading is also in the XML).
  The 2026-09-09 no-occurrence note is explicitly superseded. This is a corpus cross-reference,
  not historical biography verification; the profile stays `frontier_profile_unverified`.
  Its upstream teacher and Prajñātāra → Bodhidharma edge remain pending. No invented quotation,
  teacher, dates or profile completion. Longtan was already linked and was not one of the three warnings.
- Linked profiles **32/35 → 33/35**; empty-corpus-link warnings **3 → 2** (`yangqi_fanghui`, `dahong_zuzheng`).
  This is not a claim of only two warnings overall: seven pre-existing gong’an protagonist warnings remain.
- Profile review is a separate ledger: the baseline actually has 30 `needs_exact_locator` records (not the task summary’s 29),
  and review statuses are unchanged. Prajñātāra’s next-action prose now supersedes its stale no-occurrence note. Ten witnessed edge claims do not verify whole biographies, attributed works or sayings.
- Corpus stays **44 documents**, **10 collated**, **4,192/4,192 locators**, **630 designated flagged fields**.
  All 44 corpus files, corpus manifest and canonical locator registry are byte-identical to base (46 files).
  The 1,274-unit Chuandeng Lu corpus and its inherited 2,549/2,549 EXACT collation are not re-designated.
- BANNED COMMANDS guard followed: no unrestricted `git show`, `git show | head`, bundle-bearing
  full `git diff`, or bundle `git log -p`. Inspection used `git diff --stat`, `git status`, and
  targeted `git cat-file blob` reads for base JSON/file equality. No branch switching.
- Pages deployment, workflow editing, redesign, browsing and release settings are out of scope and untouched.
  The only renderer adjustment is status compatibility: label `exact_locator_verified` accurately and
  count its ten attestations separately from `source_verified`; smoke assertions follow the changed data.
  `/docs` changes are the existing builder's required byte-identical mirrors, not deployment work.

## Witness and reproducibility

Witness: **CBETA XML P5 T51n2076**, revision
`dbdea41071e1e260ad84b72faefd4587333cf76d`.
SHA-256: `41e4717ce9c71ff6892f8a83d6a28438cf67a1dc09e8e938165b1222daa9e40e`.
This is the same pin as `scripts/segment_chuandenglu.py`, not a moving reader edition.
Raw-host curl failed; authenticated GitHub API retrieval succeeded:

```sh
mkdir -p .cache/lineage
gh api 'repos/cbeta-org/xml-p5/contents/T/T51/T51n2076.xml?ref=dbdea41071e1e260ad84b72faefd4587333cf76d' \
  -H 'Accept: application/vnd.github.raw+json' > .cache/lineage/T51n2076.xml
python3 scripts/test_lineage_batch1.py --xml .cache/lineage/T51n2076.xml
```

The saved evidence JSON records each pair, exact range, fascicle, entry, local case number and quotation.
The replay checks the digest and actual `lb ed="T"` anchors; it omits `note`/`g` apparatus,
retains tails, joins whitespace, and keeps punctuation and mulu headings verbatim. Crucially,
line anchors **inside omitted notes still advance**: Mazu's 0245c27 ends at 心印, and the
post-note tail belongs to 0246a01, not 0245c27. The offline run (omit `--xml`) also verifies
CJK quotation containment in each full-corpus unit, unit bounds, registry agreement, profile link,
and the 10/21 census. Four negative mutations exercise rejection of absent/reversed locators,
wrong source and missing evidence notes. No remote files or dependencies are committed.

`exact_locator_verified` means that **this traditional transmission record attests the claim**.
It is not a finding that the genealogy is independently established historical fact.
All ten edges now name `jingde-chuandenglu`, including the previous Platform Sutra/Wudeng
candidate pointers; unrelated pending edges retain their original references verbatim.

## Exact edge evidence (verbatim, with the normalization above)

### 1. `bodhidharma` → `huike`

**T51n2076_p0219c04–p0219c08 · fasc. 3 · 第二十八祖菩提達磨 · chuandenglu_full case 41**

> 一法可得。師曰。汝得吾骨。最後慧可禮拜後依位而立。師曰。汝得吾髓。乃顧慧可而告之曰。昔如來以正法眼付迦葉大士。展轉囑累而至於我。我今付汝。汝當護持。并授汝袈裟以為法信。各有所表宜可知矣。可曰。請師

### 2. `huike` → `sengcan`

**T51n2076_p0220c22–p0220c27 · fasc. 3 · 第二十九祖慧可大師 · chuandenglu_full case 42**

> 無二也。大師深器之。即為剃髮。云是吾寶也。宜名僧璨。其年三月十八日於光福寺受具。自茲疾漸愈。執侍經二載。大師乃告曰。菩提達磨遠自竺乾以正法眼藏密付於吾。吾今授汝并達磨信衣。汝當守護無令斷絕。聽吾偈曰。

### 3. `sengcan` → `daoxin`

**T51n2076_p0221c18–p0221c22 · fasc. 3 · 第三十祖僧璨大師 · chuandenglu_full case 46**

> 隋開皇十二年壬子歲。有沙彌道信。年始十四。來禮師曰。願和尚慈悲乞與解脫法門。師曰。誰縛汝。曰無人縛。師曰。何更求解脫乎。信於言下大悟服勞九載。後於吉州受戒侍奉尤謹。師屢試以玄微。知其緣熟乃付衣法。

### 4. `daoxin` → `hongren`

**T51n2076_p0222b14–p0222b16 · fasc. 3 · 第三十一祖道信大師 · chuandenglu_full case 47**

> 識其法器。即俾侍者至其家。於父母所乞令出家。父母以宿緣故殊無難色。遂捨為弟子。名曰弘忍

### 5. `hongren` → `huineng`

**T51n2076_p0223a08–p0223a19 · fasc. 3 · 第三十二祖弘忍大師 · chuandenglu_full case 48**

> 大師後見此偈云。此是誰作亦未見性。眾聞師語遂不之顧。逮夜乃潛令人自碓坊召能行者入室。告曰。諸佛出世為一大事故。隨機小大而引導之。遂有十地三乘頓漸等旨。以為教門。然以無上微妙祕密圓明真實正法眼藏。付于上首大迦葉尊者。展轉傳授二十八世。至達磨屆于此土。得可大師。承襲以至于吾。今以法寶及所傳袈裟用付於汝。善自保護無令斷絕。聽吾偈曰。有情來下種因地果還生無情既無種無性亦無生能居士跪受衣法。啟曰。法則既授衣付何人。

### 6. `huineng` → `nanyue_huairang`

**T51n2076_p0240c11–p0240c17 · fasc. 5 · 南嶽懷讓禪師 · chuandenglu_full case 105**

> 尚。安啟發之。乃直詣曹谿參六祖。祖問。什麼處來。曰嵩山來。祖曰。什麼物恁麼來。曰說似一物即不中。祖曰。還可修證否。曰修證即不無。污染即不得。祖曰。只此不污染諸佛之所護念。汝既如是吾亦如是。西天般若多羅讖。汝足下出一馬駒。蹋殺天下人。並在汝心不須速說。師豁然契會。執侍左右一十五載。唐

### 7. `huineng` → `qingyuan_xingsi`

**T51n2076_p0240a23–p0240a28 · fasc. 5 · 吉州青原山行思禪師 · chuandenglu_full case 104**

> 不言少林謂之得髓矣。一日祖謂師曰。從上衣法雙行師資遞授。衣以表信。法乃印心。吾今得人何患不信。吾受衣以來遭此多難。況乎後代爭競必多。衣即留鎮山門。汝當分化一方無令斷絕。師既得法。住吉州青原山靜居寺。六祖將示滅。有沙彌希遷問曰。

### 8. `nanyue_huairang` → `mazu_daoyi`

**T51n2076_p0245c23–p0245c27 · fasc. 6 · 江西道一禪師 · chuandenglu_full case 114**

> 江西道一禪師江西道一禪師漢州什邡人也。姓馬氏。容貌奇異牛行虎視。引舌過鼻。足下有二輪文。幼歲依資州唐和尚落髮。受具於渝州圓律師。唐開元中習禪定於衡嶽傳法院。遇讓和尚。同參九人唯師密受心印

### 9. `qingyuan_xingsi` → `shitou_xiqian`

**T51n2076_p0240c03–p0240c06 · fasc. 5 · 吉州青原山行思禪師 · chuandenglu_full case 104**

> 問。如何是佛法大意。師曰。廬陵米作麼價。師既付法石頭。唐開元二十八年庚辰十二月十三日。陞堂告眾跏趺而逝。僖宗諡弘濟禪師歸真之塔。

### 10. `mazu_daoyi` → `baizhang_huaihai`

**T51n2076_p0249b26–p0249c02 · fasc. 6 · 洪州百丈山懷海禪師 · chuandenglu_full case 128**

> 洪州百丈山懷海禪師洪州百丈山懷海禪師者。福州長樂人也。丱歲離塵三學該練。屬大寂闡化南康乃傾心依附。與西堂智藏禪師同號入室。時二大士為角立焉。一夕二士隨侍馬祖翫月次。祖曰。正恁麼時如何。西堂云。正好供養。師云。正好修行。祖云。經入藏禪歸海。馬祖上堂

The entry context supplies the antecedents for 師/祖. For Qingyuan → Shitou the
explicit `師既付法石頭` closes Qingyuan’s biography; Shitou’s own case 413 also records
following 青原山思禪師 at T51n2076_p0309b06–p0309b07. For Mazu → Baizhang, the named
Baizhang entry describes 入室 and service to 馬祖 (大寂 is Mazu’s title). The Nanyue and
Qingyuan entries sit beneath the fascicle-5 Huineng 法嗣 heading; their passages describe
respectively realization/service and 得法, rather than mere co-occurrence of names.

## Complete 31-edge inventory

Every row started `traditional_link_pending_exact_locator`. “Exact” means reviewed in this
batch; “pending” means byte-for-byte unchanged. All four frontier records are also unchanged.

| Teacher | Disciple | After batch 1 |
|---|---|---|
| bodhidharma | huike | exact |
| huike | sengcan | exact |
| sengcan | daoxin | exact |
| daoxin | hongren | exact |
| hongren | huineng | exact |
| nanyue_huairang | mazu_daoyi | exact |
| qingyuan_xingsi | shitou_xiqian | exact |
| mazu_daoyi | baizhang_huaihai | exact |
| baizhang_huaihai | huangbo_xiyun | pending |
| huangbo_xiyun | linji_yixuan | pending |
| nanquan_puyuan | zhaozhou_congshen | pending |
| yunyan_tansheng | dongshan_liangjie | pending |
| dongshan_liangjie | caoshan_benji | pending |
| xuefeng_yicun | yunmen_wenyan | pending |
| baizhang_huaihai | guishan_lingyou | pending |
| luohan_guichen | fayan_wenyi | pending |
| wuzu_fayan | yuanwu_keqin | pending |
| yuelin_shiguan | wumen_huikai | pending |
| huineng | nanyue_huairang | exact |
| huineng | qingyuan_xingsi | exact |
| mazu_daoyi | nanquan_puyuan | pending |
| shitou_xiqian | yaoshan_weiyan | pending |
| yaoshan_weiyan | yunyan_tansheng | pending |
| deshan_xuanjian | xuefeng_yicun | pending |
| xuefeng_yicun | xuansha_shibei | pending |
| xuansha_shibei | luohan_guichen | pending |
| baiyun_shouduan | wuzu_fayan | pending |
| prajnatara | bodhidharma | pending |
| longtan_chongxin | deshan_xuanjian | pending |
| yangqi_fanghui | baiyun_shouduan | pending |
| dahong_zuzheng | yuelin_shiguan | pending |

## Metrics, baseline corrections and deterministic build

Baseline validation failed **before any edits** with six errors: README/AUDIT all-string CJK
counts, ROADMAP/vision/RESEARCH_RELEASE_PLAN note census, and stale metrics. Live unchanged
corpus text measures **855,603 content CJK / 917,778 all-string CJK**, not 917,776;
**125 provenance notes / 83 rendered / 35 documents**, not 99/57; cbeta_note=28,
coverage_note=42, editorial_note=41, recension_note=14. Corrected current summaries explicitly;
dated historical snapshots remain historical. No relaxation of gates and no source edits.
Metrics were regenerated using `--write-metrics`; source-review counts and locators did not change.

Bundle: **8,754,636 bytes** (base 8,729,363; +25,273), still approximately 8.7 MB.
It cannot remain byte-identical to the base bundle because lineage and metrics are bundled.
**Two successive builds are byte-identical**, and the root and docs bundles match:

```text
388aa6eec699574eb320558dfd6db0201c03fec87dec5c5f3744d61d21ec6c55  app_data.js
388aa6eec699574eb320558dfd6db0201c03fec87dec5c5f3744d61d21ec6c55  docs/app_data.js
```

## Gates — verbatim outputs

[Complete verbatim gate transcript](./P3_LINEAGE_BATCH1_2026-09-21_gates.md), including
both builds, preservation’s full per-file output, the baseline failure and all warnings.
Every final gate exited 0. `py_compile` and `diff -rq data docs/data` produced no output.
JSON Schema was actually executed with jsonschema 4.26.0 installed under ignored `.cache`.
The project has no new dependency requirement.

### `python3 scripts/validate_data.py`

```text
⚠️  data/lineage/masters.json[33]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/lineage/masters.json[34]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/gongan/gongan_index.json[2]: protagonist 'juzhi' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[3]: protagonist 'huoan_shiti' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[4]: protagonist 'xiangyan_zhixian' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[5]: protagonist 'shakyamuni_and_mahakasyapa' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[14]: protagonist 'dongshan_shouchu' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[16]: protagonist 'zhimen_kuan' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[23]: protagonist 'huangbo' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
✅ DATA VALIDATION PASSED
   corpus=44 | slots=1252 | verified=177 | matrix=21 | locators=4192/4192
   W1 source review: collated=10 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-21 → sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json
```

### `python3 scripts/test_lineage_batch1.py --xml .cache/lineage/T51n2076.xml`

```text
✅ LINEAGE BATCH 1: 10 exact edges, 21 pending, 4 frontiers; 33/35 profiles linked; 4 negative checks passed
✅ Pinned XML: digest, lb ranges and verbatim quotations replayed
```

### `python3 scripts/build_data_bundle.py`

```text
Bundling TranslateChan Classical Corpus...
✅ Successfully compiled 44 corpus documents: /home/user/translatechan/app_data.js (8,754,636 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)
```

### `python3 scripts/test_source_review_rules.py`

```text
Focused mutation partition: exit=1, metrics_byte_identical=True
Focused mutation report-metadata: exit=1, metrics_byte_identical=True

  corpus *_note keys measured now (data-driven):
    cbeta_note       occurrences=28  files=28  app.js mentions=2   nodes=$ -> RENDERED
    coverage_note    occurrences=42  files=42  app.js mentions=4   nodes=$ -> EXEMPT
    editorial_note   occurrences=41  files=11  app.js mentions=2   nodes=$.cases[], $.cases[].dialogue[], $.epilogue, $.sample_records[].dialogue[], $.sections[], $.sections[].dialogue[], $.stanzas[] -> RENDERED
    recension_note   occurrences=14  files=1   app.js mentions=2   nodes=$, $.chapters[], $.chapters[].dialogue[], $.chapters[].verses[] -> RENDERED

145 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK
```

### `node scripts/smoke_test.mjs`

```text
DATA loaded. corpus keys: 44
APP executed + init() completed without crash
RENDERER: 44 corpus texts exercised, 0 crashes
W1 source-review rule suite: ✅ W1 SOURCE-REVIEW RULES OK
Source-preservation suite: ✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes
RENDER-LAZY: hidden rooms rendered on first tab activation

✅ SMOKE TEST PASSED
```

## Remaining work

21 edges still need exact review; no promise that all can be evidenced from T2076 (some
masters postdate it). Two unlinked profiles and all four teacher frontiers remain explicit.
Profile-review statuses are unchanged. No browser verification or human historical sign-off claimed.
`OPERATIONS.md` owner-held Edit 2 (Action majors/runtime migration) and Edit 3 (verify/require
Quality branch protection) remain pending; Edit 1 is already structurally closed. No workflow changes.
