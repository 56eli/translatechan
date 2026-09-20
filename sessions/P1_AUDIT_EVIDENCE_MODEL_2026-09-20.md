# P1 Audit — Evidence-Model Extension 35 → 36 (Task 044)

**Audit date:** 2026-09-20 UTC

**Audited base / main:** `72539fe55fa22633570275bbc9fe536f6f654e7e` (PR #93)

**Landing parent:** `f099932` (PR #92)

**Audit branch:** `arena/01a0c0cf-translatechan`

**Dispatch:** `da1d7f1`, fetched from `arena/01a09829-translatechan`; its only changes relative to the audited base are the task-044 prompt and stub.

## 1. Verdict and scope

**PASS — the landed evidence-model extension is sound within its declared scope.** The authoritative overlay inherits **35/35 per-document entries literally byte-for-byte**, adds the independently reproduced Congrong Lu measurement (**100/100 cases; 500/500 source-content fields EXACT; 0 flags**), and recomputes its totals without replacing existing designations. **630 remains authoritative.** All required repository gates pass; the review suite now has **145** checks. No corpus, runtime, workflow, historical evidence, or generated artifact is changed by this audit: the deliverable is this report.

The extraction is independently reproduced from pinned CBETA git objects: **40 verified / 0 current-anchor drift**. Historical drift is a different comparison: **33 verified / 7 drift**, including `T48n2004`, and remains visible. The existing `dahui_hongzhi` / `T48n2001` strict full-corpus collation failure is **not waived** or disguised as a green run (§5). The required current-register validation is green.

**Ready for P1-2 full Jingde Chuandeng Lu and P1-3 Caoshan Benji evidence work.** This is not a release, rights approval, blanket waiver for future additions, or completion sign-off. Congrong Lu remains `partial_selected_witness`; front matter, interlinear 著語 apparatus, and human editorial sign-off remain open.

The extension follows the separately owner-ruled dated-overlay route reserved by the **2026-09-12 standing decision**, as recorded in the landed task-043 report, correction report §4, and `HANDOFF.md`. The September 12 ruling by itself did **not** authorise changing `FIXED_METADATA`; the landed September 20 amendment authorises this particular extension. No authority is moved to the September 12 measurement or to today's fresh full-corpus measurement.

### Scope/command guard

- The requested `fix/p1-audit-evidence-model` target is not used: this Arena session is fixed to **`arena/01a0c0cf-translatechan`**. No switch to or push to the orchestrator, main, or another working branch.
- **BANNED COMMANDS followed.** No bare `git show`, `git show | head`, bundle patch dump, `git log -p`, or copying of quarantined corpus records. The prompt's initial `git show … | head` conflicts with its own guard; this audit used `git cat-file` for named text/blob objects and `git diff --stat` / `--name-only` instead. Bundle blobs were read into Python for byte comparisons, never dumped to the terminal.
- No Pages deployment or creation; no workflow edits. The build's stock “synchronized /docs … deployment” output below describes a **local mirror build only**. No server or browser deployment was started.
- Pinned upstream objects, extracted references, fresh measurements, optional schema dependencies, and scratch checks stayed in `/tmp/task044`, outside Git. No new runtime dependency or manually edited corpus record.

## 2. Base and live metrics

`git fetch --depth 1 origin main` and `git log --oneline origin/main -3` confirmed `72539fe`; a later `--deepen=1` exposed `f099932` for parent comparisons. `gh pr view 93 --json number,state,mergedAt,mergeCommit,title,url` confirmed PR #93 is merged at `72539fe55fa22633570275bbc9fe536f6f654e7e` (2026-09-20T21:48:07Z).

| Check | Independently verified result |
|---|---|
| Corpus files / manifest items / locator documents | 36 / 36 / 36 |
| Completion | 0 complete; 31 excerpt seeds; 5 partial selected witnesses |
| Source-content / all-string CJK | 189,629 / 199,094 |
| Congrong Lu | 100 ordered cases; `zh_chars=84654`; `cbeta_id=T2004`; `taisho_vol=48` |
| Translation slots / verified quotations / matrix entries | 1,252 / 177 / 21; unchanged by reinstatement |
| Case locators | 248/248: 48 Wumenguan + 100 Biyanlu + 100 Congrong Lu |
| Authoritative source review | 2 collated / 32 partial-or-failed / 2 unavailable; 630 flagged; 2026-09-20 |
| Historical register | 34 documents; 622 flagged (not 630); 637 report claim remains superseded |
| Bundle | 2,136,279 B; parent 1,693,251 B; increase 443,028 B |

The metrics/doc cascade is present in `data/project_metrics.json`, `data/corpus_manifest.json`, `data/canonical_locators.json`, the bundle and mirror, and the current claims in `README.md`, `HANDOFF.md`, `AUDIT.md`, `ROADMAP.md`, `RESEARCH_RELEASE_PLAN.md`, `vision.md`, `index.html`, `.orchestrator/STATE.md` and `.orchestrator/REMEDIATION_PLAN.md`. The required doc-truthfulness validator passes. “14” in task-043 §5 describes pre-landing **validator errors**, not evidence of exactly fourteen distinct edited prose files.

Dated older measurements remain readable rather than mechanically replaced: `vision.md` has a September 20 headline, §1.1 census refresh, and §2 † reinstatement note beside older dated passages. The September 19 roadmap/next-task documents still describe the pre-landing baseline, including a “quarantined at 0 cases” dispatch and a proposed `cbeta_id=T48n2004`. They are **stale dispatch context, not current authority**. Task 044 supersedes that recipe; T2004/48 is the correct repository representation (§7).

## 3. Independent CBETA extraction and targeted collation

### 3.1 Acquisition and pin

The raw GitHub CDN attempt failed with a TLS EOF before extraction. Acquisition succeeded through git instead; no mutable `master` content was used:

```bash
git init -q /tmp/task044/upstream
git -C /tmp/task044/upstream fetch --filter=blob:none --depth 1 \
  https://github.com/cbeta-org/xml-p5.git dbdea41071e1e260ad84b72faefd4587333cf76d
# For each work W selected by the 40-line manifest, read the pinned git object:
# git -C /tmp/task044/upstream cat-file blob <pin>:<W[0]>/<W[:3]>/<W>.xml
# Write it to /tmp/task044/xmlp5/<W[0]>/<W[:3]>/<W>.xml for the extractor.
```

All 40 XML files came from that exact commit. `T/T48/T48n2004.xml` is **648,602 B**, SHA-256 **`838d8713596a7f53502d0e290801b123cb05a5fa09078a893a122b6668e37649`**. Its `cbeta-p5-body-cjk-v1` reference is **88,155 CJK characters / 264,465 B**, SHA-256 **`70413b279195b74148f03d6081c311511393dfaa65458f73e107116510738ba0`**.

### 3.2 Extraction and byte-verification — verbatim

Command/output blocks preserve stdout/stderr text. `[exit N]` lines are audit annotations; silent successful commands are not given invented PASS output.

```text
$ python3 scripts/collate_refs.py --source-dir /tmp/task044/xmlp5 --out-dir /tmp/task044/refs --from-digest-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d --write-digest-manifest /tmp/task044/refs_manifest.txt --report /tmp/task044/extraction.json --require-verified
references: 40 work(s)
digest verification: 40 verified, 0 drift, 0 unlisted, 0 unavailable (against COLLATION_W1_2026-09-20_refs_manifest.txt)
✅ reference extraction/verification complete
[exit 0]
```

```text
$ python3 scripts/collate_refs.py --from-digest-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt --refs-dir /tmp/task044/refs --require-verified
references: 40 work(s)
digest verification: 40 verified, 0 drift, 0 unlisted, 0 unavailable (against COLLATION_W1_2026-09-20_refs_manifest.txt)
✅ reference extraction/verification complete
[exit 0]
```

```text
$ cmp sessions/COLLATION_W1_2026-09-20_refs_manifest.txt /tmp/task044/refs_manifest.txt
[exit 0]
```

### 3.3 Segmentation — verbatim

The producer reads the single XML file, splits numbered `cb:mulu` case containers, extracts each field from its own case, and checks nonempty contiguous CJK membership. It preserves irregular witness numbering and paragraph-form verses in cases 98–99. It does not read a quarantined seed. The audit additionally compares all five anchors against the independent containment table; the producer prints those anchors, but its `CONTAINMENT_ANCHORS` constant is **not itself a complete equality assertion**. This audit's explicit comparisons are in Appendix A.

```text
$ python3 scripts/segment_congronglu.py --source-dir /tmp/task044/xmlp5 --out /tmp/task044/congronglu.json --locators-out /tmp/task044/locators.json --report /tmp/task044/segment_report.json
cases: 100
reference characters under the pinned rule: 88155
  commentary_zh: 39013
  dialogue[0].zh: 6203
  pointer_zh: 3754
  title_zh: 857
  verse_commentary.commentary_zh: 31109
  verse_zh: 4575
zh_chars: 84654
verse carried in a paragraph (not lg): [98, 99]
containment anchors: {'33': '0249b21', '34': '0250a10', '35': '0250b19', '37': '0252a03', '38': '0252b28'}
[exit 0]
```

### 3.4 Landed measurement replay — verbatim

`--reproduce` replays the committed parameters, including `doc=['congronglu']`, `require_verified_refs=true`, historical comparison, pinned revision, and `new_documents=['congronglu']`. Its output JSON is byte-identical to the committed measurement. The actual committed filenames intentionally retain the spelling **`CONGONGLU`**, not `CONGRONGLU`.

```text
$ python3 scripts/collate_corpus.py --reproduce sessions/COLLATION_REGISTER_2026-09-20_CONGONGLU_MEASUREMENT.json --refs-dir /tmp/task044/refs --out /tmp/task044/measurement.json
warning: congronglu: historical anchor for T48n2004 is 'drift'; accepted because congronglu is declared new to this overlay (no historical evidence record)
congronglu               {"EXACT": 601} -> collated_to_claimed_witness
aggregate: {"documents": 1, "flagged_entries": 0, "fields_total": 601, "content_fields_total": 500, "content_fields_collated": 500, "metadata_fields_total": 101, "class_totals": {"EXACT": 601}, "source_review_status_counts": {"collated_to_claimed_witness": 1, "partial_or_failed_w1_collation": 0, "witness_unavailable": 0}, "documents_without_evidence": ["baizhang_guanglu", "baojing_sanmei", "biyanlu_cases", "bodhidharma_erru", "caoxi_zhuan", "chuandenglu", "dahui_hongzhi", "dahui_shobogenzo", "dazhu_huihai", "deshan_yulu", "dongshan_yulu", "fayan_yulu", "foyan_qingyuan", "guiyang_yulu", "hanshan_poems", "huangbo_chuanxin", "huangbo_wanling", "lidai_fabao_ji", "linji_yulu", "mazu_yulu", "nanquan_yulu", "niutou_juezhu", "platform_sutra", "qinggui_monastic_codes", "sengzhao_zhaolun", "shitou_sandokai", "wudeng_huiyuan", "wumenguan", "xinxin_ming", "xuansha_yulu", "xuefeng_yantou", "yuanwu_letters", "yunmen_yulu", "zhaozhou_yulu", "zhengdao_ge"], "documents_with_drifted_references": ["congronglu"]}
register written: /tmp/task044/measurement.json
[exit 0]
```

The harness prints **601 EXACT** = **500 source-content + 101 metadata**. The register's `content_summary` is exactly `{"EXACT":500}` and `flagged=[]`; the document has cases 1–100 in order with five source-content fields each. A separate direct membership test checks every one of the 500 nonempty CJK fields against the fresh reference **without fuzzy matching**, yielding 100/100 cases and 500/500 fields. That strengthens, rather than substitutes for, the collation result.

### 3.5 Candidate vs measurement vs overlay

The candidate corpus JSON, landed corpus JSON, and regenerated producer JSON are byte-identical, SHA-256 `4b5eb6f4723d14362dbd8e74ef31080e30f234097c24edeeccc8ce74e1e4d0d6`. All three evidence entries carry the same witness digest `70413b…` and the same classes, flags and source/metadata denominators.

- Candidate entry: `historical_status=none`, `refs_historically_verified=1` (the harness's no-history convention).
- Landed measurement: `historical_status=drift`, `refs_historically_verified=0`; all other entry fields identical.
- Authoritative overlay: exactly the landed measurement entry **plus** its advisory `witness_note`.

**Reproducibility qualification:** replaying the older candidate register with the landed harness adds `generation_parameters.new_documents=[]`. Apart from that one empty parameter, the complete parsed register is identical; the candidate register itself is **not byte-identical** under the newer writer. This does not affect the corpus, landed measurement, authoritative register, or bundle, all of which reproduce byte-for-byte. Do not claim all three register file hashes are equal.

| Artifact | SHA-256 |
|---|---|
| Committed candidate register | `c794b56aa32ae290b8f2c3f9cb6737846d08bed075534c05e28b2819eacb6c60` |
| Candidate replay with explicit empty `new_documents` | `e686795c37551e2b3b6be368c92183be1bfa274ab6c347ce1e2a673afa05d874` |
| Committed and replayed landed measurement | `5c09858f15cbae74e55a9fbea10043143e5d57b5b56d7be52778709d295e0d8e` |
| Committed and regenerated authoritative overlay | `215bad6526d10b5d0811b910309bab2c92cc6ffa54d129e532346467846af5ca` |

The initial attempt to replay the `CONGRONGLU_CANDIDATE` path named in task-043's artifact table failed because that filename does not exist. Retrying the actual committed `CONGONGLU_CANDIDATE` path succeeded:

```text
$ python3 scripts/collate_corpus.py --reproduce sessions/COLLATION_REGISTER_2026-09-20_CONGONGLU_CANDIDATE.json --refs-dir /tmp/task044/refs --out /tmp/task044/candidate.json
congronglu               {"EXACT": 601} -> collated_to_claimed_witness
aggregate: {"documents": 1, "flagged_entries": 0, "fields_total": 601, "content_fields_total": 500, "content_fields_collated": 500, "metadata_fields_total": 101, "class_totals": {"EXACT": 601}, "source_review_status_counts": {"collated_to_claimed_witness": 1, "partial_or_failed_w1_collation": 0, "witness_unavailable": 0}, "documents_without_evidence": ["baizhang_guanglu", "baojing_sanmei", "biyanlu_cases", "bodhidharma_erru", "caoxi_zhuan", "chuandenglu", "dahui_hongzhi", "dahui_shobogenzo", "dazhu_huihai", "deshan_yulu", "dongshan_yulu", "fayan_yulu", "foyan_qingyuan", "guiyang_yulu", "hanshan_poems", "huangbo_chuanxin", "huangbo_wanling", "lidai_fabao_ji", "linji_yulu", "mazu_yulu", "nanquan_yulu", "niutou_juezhu", "platform_sutra", "qinggui_monastic_codes", "sengzhao_zhaolun", "shitou_sandokai", "wudeng_huiyuan", "wumenguan", "xinxin_ming", "xuansha_yulu", "xuefeng_yantou", "yuanwu_letters", "yunmen_yulu", "zhaozhou_yulu", "zhengdao_ge"], "documents_with_drifted_references": []}
register written: /tmp/task044/candidate.json
[exit 0]
```

## 4. Evidence-model audit

### 4.1 Inheritance, arithmetic, and append-only history

The independent checks in Appendix A compare both parsed entries and their **literal JSON value spans**: all 35 entries are identical; the sole addition is `congronglu`. Raw bytes of all eight September 9/10/12 register/report/manifest artifacts are also identical to `f099932`, and the 35 existing corpus files are unchanged across PR #93. The current manifest is the previous 39 lines unchanged plus one T48n2004 line.

Authoritative arithmetic, recomputed from entries rather than trusting the aggregate: **36 documents; 630 flags; 1,916 fields; 1,424 content; 1,093 collating content; 492 metadata**; status counts **2/32/2**. The historical comparison reproduces **34 compared, 33 classification-identical, 0 status changes; 622 → 623** flags over those 34. Adding Shitou's inherited 7 and Congrong Lu's 0 yields 630.

`FIXED_METADATA` (`scripts/w1_evidence.py:109–126` at the audited base) pins paths/dates/scope, not numeric flag constants. The manifest declares **historical_flagged_total=622** and **authoritative_flagged_total=630**; `w1_evidence.py:1470–1488` independently recomputes both. The dispatch shorthand “FIXED_METADATA 630” must not be read as saying both totals are 630.

`record_congronglu_evidence.py` copies the prior documents map, appends the measured entry with a witness note, uses the harness/source-review functions to recompute the register blocks, and refuses a designated total other than 630. It does not freshly collate the inherited entries. Its reference-verification block is constructed from committed manifests; **that alone is not proof of acquisition**. This audit supplies the independent 40-file byte verification in §3.

### 4.2 Multi-document report checks and bounded waiver

The dispatch's line numbers have shifted: the multi-document prose checks are at **`w1_evidence.py:1249–1285`** on `72539fe`. Each overlay-only key (`congronglu`, `shitou_sandokai`) must be named and have its own nearby content/reference counts, using `re.escape(key)` and the bounded prose pattern, instead of reusing one global match. Removing either document's counts, substituting the sibling's counts, or substituting its reference counts fails (eight focused negative controls below).

The waiver is bounded at both the declaration and evidence layers:

- `w1_evidence.py:852–876`: `new_documents` must be a list of string keys actually in the overlay and absent from the historical register. The live list is exactly `['congronglu']`.
- `w1_evidence.py:605–618`: the declaration waives only the **historical** half of the both-anchor rule; the authoritative anchor still must verify. Digest equality is separately checked against the committed manifest.
- `collate_corpus.py:741–763`: strict collation prints the explicit warning for a declared new document's historical drift. The CLI records the declaration; authoritative-register validation supplies the historical-membership boundary. A CLI flag alone is not permission to designate evidence.
- `test_source_review_rules.py:956–1002`: the shipped regression suite tests the live declaration, visible drift, removal failure, and failure when `wumenguan` is falsely declared new.

The no-waiver targeted CLI control fails as required:

```text
$ python3 scripts/collate_corpus.py --doc congronglu --refs-dir /tmp/task044/refs --refs-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt --require-verified-refs --generated 2026-09-20 --out /tmp/task044/no-waiver.json
❌ congronglu: 'drift' claim rests on T48n2004, which is 'drift' against sessions/COLLATION_W1_2026-09-09_refs_manifest.txt; a collated-to-witness claim requires byte-verified references
congronglu               {"EXACT": 601} -> collated_to_claimed_witness
[exit 1]
```

Additional focused checks called the real report/register validators on **in-memory copies**; their executable source is Appendix B. These are eight checks beyond the shipped 145, not a claim that the permanent suite grew in this audit.

```text
$ python3 /tmp/task044/mutation_checks.py
baseline: report and authoritative-register validation have zero errors
PASS remove congronglu counts: sessions/COLLATION_W1_2026-09-20_CORRECTION.md: correction report does not state the congronglu content-field figures ('Content fields: N measured, M collated' beside the document name)
PASS substitute sibling counts: sessions/COLLATION_W1_2026-09-20_CORRECTION.md: correction report states Content fields 11/6 for congronglu but its entry holds 500/500
PASS remove shitou counts: sessions/COLLATION_W1_2026-09-20_CORRECTION.md: correction report does not state the shitou_sandokai content-field figures ('Content fields: N measured, M collated' beside the document name)
PASS substitute sibling refs: sessions/COLLATION_W1_2026-09-20_CORRECTION.md: correction report states refs_verified/refs_total 2/2 for congronglu but its entry holds 1/1
PASS remove waiver: sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json.documents.congronglu: congronglu: claims collated_to_claimed_witness but reference(s) T48n2004 do not verify against both digest anchors; a drifted or unlisted reference never upgrades a W1 status
PASS waive historical document: sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json: generation_parameters.new_documents names 'wumenguan', which the historical register already covers; the waiver is only for documents this overlay adds
PASS waive absent key: sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json: generation_parameters.new_documents names 'not_a_document', which is not a document in this register
PASS forge pinned anchor: sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json.documents.congronglu.reference_verification.T48n2004: recorded digest 000000000000… does not match the committed T48n2004 digest 70413b279195… in the authoritative manifest
PASS: 8 focused negative controls; no working-tree mutation
[exit 0]
```

### 4.3 Historical drift adjudication

The September 9 T48n2004 digest remains **`06d8ef7f44a1c51cef7af5ea9b98539cf23050b1e91b594947eab4226ee736e8`**, whereas the pinned extraction produces **`70413b279195b74148f03d6081c311511393dfaa65458f73e107116510738ba0`**. This is recorded as drift, not overwritten. `congronglu` appears in the overlay's `documents_with_drifted_references`, and correction report §4 explains the chosen declaration/waiver and rejected alternatives.

The historical-anchor situation is analogous to T48n2001, but the **policy treatment is not interchangeable**: `dahui_hongzhi` already had a historical evidence entry and cannot receive this new-document waiver. The strict full-corpus failure below proves the difference.

The old report's proposed cause (earlier source revision / an uncommitted mixed extraction rule) remains a **historical hypothesis**. This audit confirms the two distinct digests, current pin and explicit adjudication; it does not claim to have reproduced the missing historical serialization or repeated every historical variant experiment.

## 5. Fresh whole-corpus measurement — not a designation

The task's **532** is the committed **2026-09-12** snapshot. A fresh measurement of the landed tree is **486**, with **1,233/1,424** collating source-content fields and measured classifications **7/27/2**. The other five measured collated documents are not promoted in the authoritative manifest. The three counts must stay distinct:

| Record | Flags | Content collating | Status counts | Role |
|---|---:|---:|---|---|
| 2026-09-12 post-remediation | 532 | 691/924 | 1/32/2 | Historical measurement, unchanged |
| 2026-09-20 overlay | **630** | **1,093/1,424** | **2/32/2** | **Authoritative**; inherits old designations |
| This audit's fresh whole-corpus run | 486 | 1,233/1,424 | 7/27/2 | Diagnostic measurement only; not eligible as a strict both-anchor replacement |

The measured 532 → 486 delta is fully accounted for by later changes: baojing_sanmei −4, biyanlu_cases −2, bodhidharma_erru −5, chuandenglu −3, dahui_hongzhi −6, dongshan_yulu −4, huangbo_chuanxin −2, mazu_yulu −7, sengzhao_zhaolun −8, shitou_sandokai −5; Congrong Lu adds 0. Total −46. Neither 532 nor 486 replaces 630.

### 5.1 Strict whole-corpus attempt — expected pre-existing failure, verbatim

This optional audit run is **not green**. All current reference bytes are verified, but `dahui_hongzhi` now measures as collated while its historical T48n2001 reference is drifted. The unchanged both-anchor rule rejects it. The task-043 report §5 already records this pre-existing condition. No new-document waiver was granted to that historical document and no output register was written by this failed command.

```text
$ python3 scripts/collate_corpus.py --refs-dir /tmp/task044/refs --refs-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt --compare-register sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json --require-verified-refs --new-document congronglu --generated 2026-09-20 --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d --kind task044-audit-measurement-not-authoritative --out /tmp/task044/full-corpus.json
warning: congronglu: historical anchor for T48n2004 is 'drift'; accepted because congronglu is declared new to this overlay (no historical evidence record)
❌ dahui_hongzhi: 'drift' claim rests on T48n2001, which is 'drift' against sessions/COLLATION_W1_2026-09-09_refs_manifest.txt; a collated-to-witness claim requires byte-verified references
baizhang_guanglu         {"NOT_FOUND": 10} -> partial_or_failed_w1_collation
baojing_sanmei           {"EXACT": 6, "TITLE_COMPOSITE": 1} -> collated_to_claimed_witness
biyanlu_cases            {"EXACT": 390, "MINOR": 20, "NOT_FOUND": 11, "TITLE_COMPOSITE": 4, "SHORT_UNMATCHED": 71} -> partial_or_failed_w1_collation
bodhidharma_erru         {"EXACT": 6, "NOT_FOUND": 4} -> collated_to_claimed_witness
caoxi_zhuan              {"EXACT": 1, "NOT_FOUND": 7} -> partial_or_failed_w1_collation
chuandenglu              {"EXACT": 5, "DIVERGENT": 1, "NOT_FOUND": 2, "SHORT_UNMATCHED": 1} -> partial_or_failed_w1_collation
congronglu               {"EXACT": 601} -> collated_to_claimed_witness
dahui_hongzhi            {"EXACT": 6, "NOT_FOUND": 2, "TITLE_COMPOSITE": 3} -> collated_to_claimed_witness
dahui_shobogenzo         {"DIVERGENT": 1, "NOT_FOUND": 6, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
dazhu_huihai             {"EXACT": 1, "DIVERGENT": 2, "NOT_FOUND": 7} -> partial_or_failed_w1_collation
deshan_yulu              {"NOT_FOUND": 10} -> partial_or_failed_w1_collation
dongshan_yulu            {"EXACT": 12, "DIVERGENT": 5, "NOT_FOUND": 12, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 4} -> partial_or_failed_w1_collation
fayan_yulu               {"EXACT": 4, "NOT_FOUND": 11, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 3} -> partial_or_failed_w1_collation
foyan_qingyuan           {"NOT_FOUND": 8, "TITLE_COMPOSITE": 4} -> partial_or_failed_w1_collation
guiyang_yulu             {"NOT_FOUND": 9, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
hanshan_poems            {"WITNESS_UNAVAILABLE": 5} -> witness_unavailable
huangbo_chuanxin         {"EXACT": 6, "MINOR": 1, "NOT_FOUND": 7, "TITLE_COMPOSITE": 1, "SHORT_UNMATCHED": 7} -> partial_or_failed_w1_collation
huangbo_wanling          {"DIVERGENT": 1, "NOT_FOUND": 11} -> partial_or_failed_w1_collation
lidai_fabao_ji           {"NOT_FOUND": 7} -> partial_or_failed_w1_collation
linji_yulu               {"EXACT": 85, "MINOR": 2, "DIVERGENT": 1, "NOT_FOUND": 76} -> partial_or_failed_w1_collation
mazu_yulu                {"EXACT": 12, "NOT_FOUND": 2, "SHORT_UNMATCHED": 1} -> partial_or_failed_w1_collation
nanquan_yulu             {"EXACT": 1, "DIVERGENT": 1, "NOT_FOUND": 7, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
niutou_juezhu            {"WITNESS_UNAVAILABLE": 9} -> witness_unavailable
platform_sutra           {"EXACT": 5, "DIVERGENT": 1, "NOT_FOUND": 18} -> partial_or_failed_w1_collation
qinggui_monastic_codes   {"NOT_FOUND": 8, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
sengzhao_zhaolun         {"EXACT": 8} -> collated_to_claimed_witness
shitou_sandokai          {"EXACT": 12, "TITLE_COMPOSITE": 1, "SHORT_UNMATCHED": 1} -> collated_to_claimed_witness
wudeng_huiyuan           {"NOT_FOUND": 5, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
wumenguan                {"EXACT": 221, "MINOR": 6, "NOT_FOUND": 1, "SHORT_UNMATCHED": 2} -> partial_or_failed_w1_collation
xinxin_ming              {"EXACT": 36, "NOT_FOUND": 2} -> partial_or_failed_w1_collation
xuansha_yulu             {"EXACT": 1, "DIVERGENT": 1, "NOT_FOUND": 6, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
xuefeng_yantou           {"EXACT": 1, "DIVERGENT": 1, "NOT_FOUND": 4, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
yuanwu_letters           {"NOT_FOUND": 4, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
yunmen_yulu              {"EXACT": 4, "DIVERGENT": 1, "NOT_FOUND": 13, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 3} -> partial_or_failed_w1_collation
zhaozhou_yulu            {"NOT_FOUND": 20, "SHORT_UNMATCHED": 15} -> partial_or_failed_w1_collation
zhengdao_ge              {"EXACT": 6, "NOT_FOUND": 1} -> collated_to_claimed_witness
[exit 1]
```

### 5.2 Diagnostic aggregate with historical drift retained — verbatim

To publish the requested optional aggregate, the next command intentionally omits `--require-verified-refs` while retaining the named current and historical manifests and all drift columns. This is **measurement-only**, labelled as such by `--kind`; the prior independent extraction still proves 40/40 current-anchor byte identity. It is not a way to make the strict failure pass, and its JSON stays outside the repository. The full numerical result is published here, not installed as evidence authority.

```text
$ python3 scripts/collate_corpus.py --refs-dir /tmp/task044/refs --refs-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt --compare-register sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json --new-document congronglu --generated 2026-09-20 --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d --kind task044-audit-measurement-not-authoritative --out /tmp/task044/full-corpus-measurement.json
baizhang_guanglu         {"NOT_FOUND": 10} -> partial_or_failed_w1_collation
baojing_sanmei           {"EXACT": 6, "TITLE_COMPOSITE": 1} -> collated_to_claimed_witness
biyanlu_cases            {"EXACT": 390, "MINOR": 20, "NOT_FOUND": 11, "TITLE_COMPOSITE": 4, "SHORT_UNMATCHED": 71} -> partial_or_failed_w1_collation
bodhidharma_erru         {"EXACT": 6, "NOT_FOUND": 4} -> collated_to_claimed_witness
caoxi_zhuan              {"EXACT": 1, "NOT_FOUND": 7} -> partial_or_failed_w1_collation
chuandenglu              {"EXACT": 5, "DIVERGENT": 1, "NOT_FOUND": 2, "SHORT_UNMATCHED": 1} -> partial_or_failed_w1_collation
congronglu               {"EXACT": 601} -> collated_to_claimed_witness
dahui_hongzhi            {"EXACT": 6, "NOT_FOUND": 2, "TITLE_COMPOSITE": 3} -> collated_to_claimed_witness
dahui_shobogenzo         {"DIVERGENT": 1, "NOT_FOUND": 6, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
dazhu_huihai             {"EXACT": 1, "DIVERGENT": 2, "NOT_FOUND": 7} -> partial_or_failed_w1_collation
deshan_yulu              {"NOT_FOUND": 10} -> partial_or_failed_w1_collation
dongshan_yulu            {"EXACT": 12, "DIVERGENT": 5, "NOT_FOUND": 12, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 4} -> partial_or_failed_w1_collation
fayan_yulu               {"EXACT": 4, "NOT_FOUND": 11, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 3} -> partial_or_failed_w1_collation
foyan_qingyuan           {"NOT_FOUND": 8, "TITLE_COMPOSITE": 4} -> partial_or_failed_w1_collation
guiyang_yulu             {"NOT_FOUND": 9, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
hanshan_poems            {"WITNESS_UNAVAILABLE": 5} -> witness_unavailable
huangbo_chuanxin         {"EXACT": 6, "MINOR": 1, "NOT_FOUND": 7, "TITLE_COMPOSITE": 1, "SHORT_UNMATCHED": 7} -> partial_or_failed_w1_collation
huangbo_wanling          {"DIVERGENT": 1, "NOT_FOUND": 11} -> partial_or_failed_w1_collation
lidai_fabao_ji           {"NOT_FOUND": 7} -> partial_or_failed_w1_collation
linji_yulu               {"EXACT": 85, "MINOR": 2, "DIVERGENT": 1, "NOT_FOUND": 76} -> partial_or_failed_w1_collation
mazu_yulu                {"EXACT": 12, "NOT_FOUND": 2, "SHORT_UNMATCHED": 1} -> partial_or_failed_w1_collation
nanquan_yulu             {"EXACT": 1, "DIVERGENT": 1, "NOT_FOUND": 7, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
niutou_juezhu            {"WITNESS_UNAVAILABLE": 9} -> witness_unavailable
platform_sutra           {"EXACT": 5, "DIVERGENT": 1, "NOT_FOUND": 18} -> partial_or_failed_w1_collation
qinggui_monastic_codes   {"NOT_FOUND": 8, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
sengzhao_zhaolun         {"EXACT": 8} -> collated_to_claimed_witness
shitou_sandokai          {"EXACT": 12, "TITLE_COMPOSITE": 1, "SHORT_UNMATCHED": 1} -> collated_to_claimed_witness
wudeng_huiyuan           {"NOT_FOUND": 5, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
wumenguan                {"EXACT": 221, "MINOR": 6, "NOT_FOUND": 1, "SHORT_UNMATCHED": 2} -> partial_or_failed_w1_collation
xinxin_ming              {"EXACT": 36, "NOT_FOUND": 2} -> partial_or_failed_w1_collation
xuansha_yulu             {"EXACT": 1, "DIVERGENT": 1, "NOT_FOUND": 6, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
xuefeng_yantou           {"EXACT": 1, "DIVERGENT": 1, "NOT_FOUND": 4, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
yuanwu_letters           {"NOT_FOUND": 4, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
yunmen_yulu              {"EXACT": 4, "DIVERGENT": 1, "NOT_FOUND": 13, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 3} -> partial_or_failed_w1_collation
zhaozhou_yulu            {"NOT_FOUND": 20, "SHORT_UNMATCHED": 15} -> partial_or_failed_w1_collation
zhengdao_ge              {"EXACT": 6, "NOT_FOUND": 1} -> collated_to_claimed_witness
aggregate: {"documents": 36, "flagged_entries": 486, "fields_total": 1916, "content_fields_total": 1424, "content_fields_collated": 1233, "metadata_fields_total": 492, "class_totals": {"DIVERGENT": 16, "EXACT": 1430, "MINOR": 29, "NOT_FOUND": 291, "SHORT_UNMATCHED": 108, "TITLE_COMPOSITE": 28, "WITNESS_UNAVAILABLE": 14}, "source_review_status_counts": {"collated_to_claimed_witness": 7, "partial_or_failed_w1_collation": 27, "witness_unavailable": 2}, "documents_without_evidence": [], "documents_with_drifted_references": ["baizhang_guanglu", "chuandenglu", "congronglu", "dahui_hongzhi", "dahui_shobogenzo", "foyan_qingyuan", "nanquan_yulu", "xuansha_yulu", "xuefeng_yantou", "zhaozhou_yulu"]}
register written: /tmp/task044/full-corpus-measurement.json
[exit 0]
```

## 6. Deterministic reproduction and preservation

The segmented corpus, locator sidecar and extraction report match their committed artifacts byte-for-byte. The landed measurement replay does too. The authoritative overlay was regenerated with its producer and compared against its original bytes; rebuilding the bundle again left **64 files unchanged** (root bundle, generated metrics, entire `docs/` tree). The root bundle also equals the committed `72539fe` blob and `docs/app_data.js`.

```text
$ python3 scripts/record_congronglu_evidence.py
register written: sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json
aggregate: {"documents": 36, "flagged_entries": 630, "fields_total": 1916, "content_fields_total": 1424, "content_fields_collated": 1093, "metadata_fields_total": 492, "class_totals": {"DIVERGENT": 111, "EXACT": 1286, "MINOR": 30, "NOT_FOUND": 334, "SHORT_UNMATCHED": 109, "TITLE_COMPOSITE": 32, "WITNESS_UNAVAILABLE": 14}, "source_review_status_counts": {"collated_to_claimed_witness": 2, "partial_or_failed_w1_collation": 32, "witness_unavailable": 2}, "documents_without_evidence": [], "documents_with_drifted_references": ["baizhang_guanglu", "congronglu", "dahui_hongzhi", "dahui_shobogenzo", "foyan_qingyuan", "nanquan_yulu", "xuansha_yulu", "xuefeng_yantou", "zhaozhou_yulu"]}
reference_verification: {"verified": 40, "drift": 0, "unlisted": 0, "none": 0} historical {"verified": 33, "drift": 7, "unlisted": 0, "none": 0}
reproduction: compared=34 identical=33 changed_status=0 flagged={'historical': 622, 'this_run': 623}
[exit 0]
overlay byte-identical to committed artifact: 215bad6526d10b5d0811b910309bab2c92cc6ffa54d129e532346467846af5ca
```

```text
$ python3 scripts/build_data_bundle.py
Bundling TranslateChan Classical Corpus...
✅ Successfully compiled 36 corpus documents: /home/user/translatechan/app_data.js (2,136,279 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)
[exit 0]
rebuild byte comparison: 64 files unchanged (root bundle, metrics, entire docs tree)
bundle: 2,136,279 B; landing parent: 1,693,251 B; delta: 443,028 B
root = docs = committed bundle sha256: 8f52cde376b55b9ce7ab0fcd6ecc970aeb52fe835b364fb8d30c3a4b2393087e
```

### Independent assertion results — verbatim

Appendix A contains the one-off checker used for these results. It leaves corpus files untouched, checks literal entry inheritance and historical bytes, recounts aggregates, verifies reference digests, and checks raw CJK containment and anchor equality.

```text
$ python3 /tmp/task044/check_evidence.py
inheritance: 35/35 entries literal-byte-identical; exactly one addition: congronglu
overlay entry = fresh measurement + advisory witness_note; new_documents = [congronglu]
recomputed authoritative aggregate: {"documents": 36, "flagged_entries": 630, "fields_total": 1916, "content_fields_total": 1424, "content_fields_collated": 1093, "metadata_fields_total": 492, "class_totals": {"DIVERGENT": 111, "EXACT": 1286, "MINOR": 30, "NOT_FOUND": 334, "SHORT_UNMATCHED": 109, "TITLE_COMPOSITE": 32, "WITNESS_UNAVAILABLE": 14}, "source_review_status_counts": {"collated_to_claimed_witness": 2, "partial_or_failed_w1_collation": 32, "witness_unavailable": 2}, "documents_without_evidence": [], "documents_with_drifted_references": ["baizhang_guanglu", "congronglu", "dahui_hongzhi", "dahui_shobogenzo", "foyan_qingyuan", "nanquan_yulu", "xuansha_yulu", "xuefeng_yantou", "zhaozhou_yulu"]}
historical comparison: compared=34 identical=33 changed_status=0 flagged={'historical': 622, 'this_run': 623}
reference set: 39 old manifest lines unchanged + T48n2004; 40/40 bytes verified
historical reference comparison: {"verified": 33, "drift": 7, "unlisted": 0, "none": 0}
historical drift refs: T47n1987B, T48n2001, T48n2004, X67n1309, X68n1315, X69n1333, X73n1445
metrics: corpus=36; CJK=189629; 31 excerpt_seed + 5 partial; complete=0; locators=248; authoritative=630 historical=622
corpus ID conventions: congronglu T2004/48; biyanlu_cases T2003/48; wumenguan T2005/48
harness witness: T48n2004; canonical_id=T2004; 100 exact case locators
direct CJK containment (no fuzzy matching): 100/100 cases, 500/500 nonempty source fields
containment case 33: 第三十三則三聖金鱗 p.0249b21
containment case 34: 第三十四則風穴一塵 p.0250a10
containment case 35: 第三十五則洛浦伏膺 p.0250b19
containment case 37: 第三十七則溈山業識 p.0252a03
containment case 38: 第三十八則臨濟真人 p.0252b28
witness case span: p.0227c28-p.0292a20 (not quarantined p.0196c-p.0199c)
landing vs f099932: 8/8 historical evidence artifacts unchanged; 35/35 existing corpus files unchanged
byte-identical: data/corpus/congronglu.json sha256=4b5eb6f4723d14362dbd8e74ef31080e30f234097c24edeeccc8ce74e1e4d0d6
byte-identical: sessions/P1_CONGRONGLU_2026-09-20.json sha256=4b5eb6f4723d14362dbd8e74ef31080e30f234097c24edeeccc8ce74e1e4d0d6
byte-identical: sessions/P1_CONGRONGLU_2026-09-20_locators.json sha256=92ae54333984f8c593cd06a286a6f0c3115f714131231ec04adc84a6fbe90998
byte-identical: sessions/P1_CONGRONGLU_2026-09-20_extraction_report.json sha256=dec01327d5616adcbe15ef758df44045d78fe734b4b151b62540672b77ecacea
byte-identical: sessions/COLLATION_REGISTER_2026-09-20_CONGONGLU_MEASUREMENT.json sha256=5c09858f15cbae74e55a9fbea10043143e5d57b5b56d7be52778709d295e0d8e
candidate replay: semantic identity except added generation_parameters.new_documents=[]; NOT byte-identical
candidate vs landed measurement: only historical_status none->drift and refs_historically_verified 1->0 differ
PASS: independent evidence audit assertions
[exit 0]
```

## 7. Repository IDs, locators, and no quarantined copy

`congronglu` uses **T2004 + volume 48**, matching `biyanlu_cases` **T2003/48** and `wumenguan` **T2005/48**. `canonical_locators.json.documents.congronglu` has `canonical_id=T2004`, `granularity=case`, and 100 anchors identical to the regenerated sidecar. `collate_corpus.DOCS['congronglu']` is `(['T48n2004'], [])`; its claimed witness, reference filename and producer use **T48n2004**, separate from the corpus's compact ID.

`app.js:2906` uses `/T\d{4}/` with `taisho_vol` to append the volume label. Executing that exact condition in Node produced:

```text
congronglu: T2004 · Vol. 48
biyanlu_cases: T2003 · Vol. 48
wumenguan: T2005 · Vol. 48
```

No ID rewrite was needed or performed. Smoke exercises all 36 rendered texts without crashes; this is not a browser visual claim.

**Positive provenance evidence for no quarantined copy:** the sole external producer input was the freshly acquired pinned XML, it regenerated the entire landed corpus byte-for-byte, and all 500 content fields are nonempty contiguous CJK runs. English/pinyin titles and disclosure strings are deterministic project-authored constants, not additional external source texts. Comparison to `sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md` confirms:

| Case | Fresh witness heading | Reproduced anchor | Disproved quarantined identity at that case |
|---:|---|---|---|
| 33 | 第三十三則三聖金鱗 | p0249b21 | 南泉見人作貓兒 |
| 34 | 第三十四則風穴一塵 | p0250a10 | 盤山心印 |
| 35 | 第三十五則洛浦伏膺 | p0250b19 | 俱胝豎指 |
| 37 | 第三十七則溈山業識 | p0252a03 | 洞山麻三斤 |
| 38 | 第三十八則臨濟真人 | p0252b28 | 百丈野狐 |

The real first-to-last case span is **p.0227c28–p.0292a20**, not the quarantined p0196c–p0199c claim. “No copy” is supported by reproducible witness derivation, not by a git-log absence or a claim that all old title strings must be globally absent. In particular **百丈野狐 legitimately occurs at case 8**; task-043 §6's statement that all five strings “appear nowhere” is overbroad. The old claim is disproved **at case 38**. No quarantined record was fetched or used as an input during this audit.

## 8. Required gates — full verbatim outputs

All seven required commands below exited 0. The first validator run lacked optional `jsonschema` and said so. The standard-library validation remained green; to avoid calling a skipped schema check “verified”, this audit also installed `jsonschema==4.26.0` into the external `/tmp/task044/python-deps` directory and repeated validation with `PYTHONPATH` (§8.2). No package manifest or runtime dependency changed. The remaining warnings are the known three unlinked lineage profiles and seven intentionally unprofiled/uncertain protagonist keys, not new evidence-model failures.

### 8.1 Standard gates

```text
$ python3 -m py_compile scripts/*.py
[exit 0]
```

```text
$ python3 scripts/validate_data.py
⚠️  data/lineage/masters.json[30]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/lineage/masters.json[32]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/lineage/masters.json[33]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  schemas/translatechan-data.schema.json: jsonschema library not installed — declarative schema was not executed this run (pip install jsonschema to enable; see scripts/validate_data.py run_json_schema_checks)
⚠️  data/gongan/gongan_index.json[2]: protagonist 'juzhi' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[3]: protagonist 'huoan_shiti' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[4]: protagonist 'xiangyan_zhixian' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[5]: protagonist 'shakyamuni_and_mahakasyapa' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[14]: protagonist 'dongshan_shouchu' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[16]: protagonist 'zhimen_kuan' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[23]: protagonist 'huangbo' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
✅ DATA VALIDATION PASSED
   corpus=36 | slots=1252 | verified=177 | matrix=21 | locators=248/248
   W1 source review: collated=2 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-20 → sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json
[exit 0]
```

```text
$ python3 scripts/build_data_bundle.py
Bundling TranslateChan Classical Corpus...
✅ Successfully compiled 36 corpus documents: /home/user/translatechan/app_data.js (2,136,279 bytes)
✅ Successfully synchronized /docs for GitHub Pages deployment: /home/user/translatechan/docs (incl. data/ mirror)
[exit 0]
```

```text
$ python3 scripts/test_source_preservation.py
Focused allowlist regression: unmutated copy exit=0, nested coverage_note rejected (exit=1) with the exact path reported
  ℹ️  data/corpus/congronglu.json: declared new document — 2026-09-20 Congronglu reinstatement (task 043, owner-ruled): a new extraction from the pinned CBETA T48n2004 witness (100 cases, 500/500 source-content fields EXACT, 0 flagged, no quarantined record copied). Declared evidence: sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json + sessions/COLLATION_W1_2026-09-20_CORRECTION.md.
  ℹ️  data/corpus/baizhang_guanglu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/baojing_sanmei.json: permitted allowlisted change: .coverage_note, .stanzas[1].pinyin, .stanzas[1].zh, .stanzas[2].pinyin, .stanzas[2].zh, .stanzas[3].pinyin, .stanzas[3].zh, .stanzas[5].pinyin, .stanzas[5].zh
  ℹ️  data/corpus/biyanlu_cases.json: permitted allowlisted change: .cases[0].dialogue[2].pinyin, .cases[0].dialogue[2].zh, .cases[0].pointer_zh, .cases[1].dialogue[1].pinyin, .cases[1].dialogue[1].zh, .cases[1].pointer_zh, .cases[2].dialogue[0].pinyin, .cases[2].dialogue[0].zh, .cases[2].pointer_zh, .cases[10].commentary_zh, .cases[11].dialogue[1].pinyin, .cases[11].dialogue[1].zh, .cases[14].dialogue[0].pinyin, .cases[14].dialogue[0].zh, .cases[17].dialogue[0].pinyin, .cases[17].dialogue[0].zh, .cases[19].editorial_note, .cases[19].verse_zh, .cases[22].dialogue[0].pinyin, .cases[22].dialogue[0].zh, .cases[30].dialogue[0].pinyin, .cases[30].dialogue[0].zh, .cases[50].dialogue[0].pinyin, .cases[50].dialogue[0].zh, .cases[64].pointer_zh, .cases[74].dialogue[0].pinyin, .cases[74].dialogue[0].zh, .cases[80].pointer_zh, .cases[81].dialogue[0].pinyin, .cases[81].dialogue[0].zh, .cases[87].dialogue[0].pinyin, .cases[87].dialogue[0].zh, .cases[95].dialogue[0].editorial_note, .cases[95].dialogue[0].pinyin, .cases[95].dialogue[0].zh, .cases[97].dialogue[0].pinyin, .cases[97].dialogue[0].zh, .cases[98].dialogue[0].pinyin, .cases[98].dialogue[0].zh, .coverage_note, .zh_chars
  ℹ️  data/corpus/bodhidharma_erru.json: permitted allowlisted change: .coverage_note, .sections[0].dialogue[1].pinyin, .sections[0].dialogue[1].zh, .sections[1].dialogue[0].pinyin, .sections[1].dialogue[0].zh, .sections[1].dialogue[1].pinyin, .sections[1].dialogue[1].zh, .sections[2].dialogue[0].pinyin, .sections[2].dialogue[0].zh, .sections[2].dialogue[1].pinyin, .sections[2].dialogue[1].zh
  ℹ️  data/corpus/caoxi_zhuan.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/chuandenglu.json: permitted allowlisted change: .coverage_note, .sample_records[0].dialogue[2].editorial_note, .sample_records[0].dialogue[3].pinyin, .sample_records[0].dialogue[3].zh, .sample_records[1].dialogue[1].pinyin, .sample_records[1].dialogue[1].zh
  ℹ️  data/corpus/dahui_hongzhi.json: permitted allowlisted change: .cbeta_id, .cbeta_note, .coverage_note, .sections[0].dialogue[0].pinyin, .sections[0].dialogue[0].zh, .sections[0].dialogue[1].pinyin, .sections[0].dialogue[1].zh, .sections[1].dialogue[0].pinyin, .sections[1].dialogue[0].zh, .sections[1].dialogue[1].pinyin, .sections[1].dialogue[1].zh, .sections[2].dialogue[0].pinyin, .sections[2].dialogue[0].zh, .sections[3].dialogue[0].pinyin, .sections[3].dialogue[0].zh
  ℹ️  data/corpus/dahui_shobogenzo.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/dazhu_huihai.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/deshan_yulu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/dongshan_yulu.json: permitted allowlisted change: .coverage_note, .five_ranks[0].verse_pinyin, .five_ranks[0].verse_zh, .five_ranks[1].verse_pinyin, .five_ranks[1].verse_zh, .five_ranks[2].verse_pinyin, .five_ranks[2].verse_zh, .five_ranks[3].verse_pinyin, .five_ranks[3].verse_zh, .five_ranks[4].verse_pinyin
  ℹ️  data/corpus/fayan_yulu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/foyan_qingyuan.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/guiyang_yulu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/huangbo_chuanxin.json: permitted allowlisted change: .coverage_note, .sections[0].dialogue[1].pinyin, .sections[0].dialogue[1].zh, .sections[1].dialogue[0].editorial_note, .sections[2].dialogue[0].editorial_note, .sections[3].dialogue[0].pinyin, .sections[3].dialogue[0].zh, .sections[5].dialogue[0].editorial_note, .sections[7].dialogue[0].editorial_note, .sections[8].dialogue[0].editorial_note, .sections[9].dialogue[0].editorial_note
  ℹ️  data/corpus/huangbo_wanling.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/lidai_fabao_ji.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/linji_yulu.json: permitted allowlisted change: .coverage_note, .sections[0].dialogue[1].zh, .sections[67].dialogue[0].pinyin, .sections[67].dialogue[0].zh, .sections[68].dialogue[0].pinyin, .sections[68].dialogue[0].zh, .sections[69].dialogue[0].pinyin, .sections[69].dialogue[0].zh, .sections[70].dialogue[0].pinyin, .sections[70].dialogue[0].zh, .sections[71].dialogue[0].editorial_note, .sections[72].dialogue[0].editorial_note, .sections[73].dialogue[0].editorial_note, .zh_chars
  ℹ️  data/corpus/mazu_yulu.json: permitted allowlisted change: .coverage_note, .sections[0].dialogue[0].pinyin, .sections[0].dialogue[0].zh, .sections[1].dialogue[0].editorial_note, .sections[1].dialogue[1].pinyin, .sections[1].dialogue[1].zh, .sections[1].dialogue[2].pinyin, .sections[1].dialogue[2].zh, .sections[2].dialogue[0].pinyin, .sections[2].dialogue[0].zh, .sections[4].dialogue[0].pinyin, .sections[4].dialogue[0].zh, .sections[5].dialogue[0].pinyin, .sections[5].dialogue[0].zh
  ℹ️  data/corpus/nanquan_yulu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/platform_sutra.json: permitted allowlisted change: .chapters[0].verses[0].recension_note, .chapters[0].verses[1].recension_note, .chapters[1].dialogue[0].recension_note, .chapters[1].dialogue[1].recension_note, .chapters[2].recension_note, .chapters[3].dialogue[0].recension_note, .chapters[4].dialogue[0].recension_note, .chapters[5].recension_note, .chapters[6].recension_note, .chapters[7].recension_note, .chapters[8].recension_note, .chapters[9].recension_note, .coverage_note, .recension_note
  ℹ️  data/corpus/qinggui_monastic_codes.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/sengzhao_zhaolun.json: permitted allowlisted change: .author_en, .author_zh, .cbeta_note, .coverage_note, .era, .genre, .overview, .sections[0].dialogue[0].pinyin, .sections[0].dialogue[0].translations.cleary.text, .sections[0].dialogue[0].translations.liebenthal.text, .sections[0].dialogue[0].translations.red_pine.text, .sections[0].dialogue[0].zh, .sections[0].dialogue[1].pinyin, .sections[0].dialogue[1].translations.cleary.text, .sections[0].dialogue[1].translations.liebenthal.text, .sections[0].dialogue[1].translations.red_pine.text, .sections[0].dialogue[1].zh, .sections[0].title_en, .sections[0].title_pinyin, .sections[0].title_zh, .sections[1].dialogue[0].pinyin, .sections[1].dialogue[0].translations.cleary.text, .sections[1].dialogue[0].translations.liebenthal.text, .sections[1].dialogue[0].translations.red_pine.text, .sections[1].dialogue[0].zh, .sections[1].title_en, .sections[1].title_pinyin, .sections[1].title_zh, .sections[2].dialogue[0].pinyin, .sections[2].dialogue[0].translations.cleary.text, .sections[2].dialogue[0].translations.liebenthal.text, .sections[2].dialogue[0].translations.red_pine.text, .sections[2].dialogue[0].zh, .sections[2].section_id, .sections[2].title_en, .sections[2].title_pinyin, .sections[2].title_zh, .title_en, .title_pinyin, .title_zh
  ℹ️  data/corpus/shitou_sandokai.json: permitted allowlisted change: .coverage_note, .sections[0].stanzas[5].zh, .sections[0].stanzas[6].pinyin, .sections[0].stanzas[6].zh, .sections[0].stanzas[7].pinyin, .sections[0].stanzas[7].zh, .sections[0].stanzas[9].pinyin, .sections[0].stanzas[9].zh, .sections[1].stanzas[0].pinyin, .sections[1].stanzas[0].translations.cleary.text, .sections[1].stanzas[0].translations.red_pine.text, .sections[1].stanzas[0].translations.sasaki.text, .sections[1].stanzas[0].zh
  ℹ️  data/corpus/wudeng_huiyuan.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/wumenguan.json: permitted allowlisted change: .cases[0].commentary_pinyin, .cases[0].commentary_zh, .cases[1].commentary_pinyin, .cases[1].commentary_zh, .cases[1].dialogue[1].pinyin, .cases[1].dialogue[1].zh, .cases[1].dialogue[2].pinyin, .cases[1].dialogue[2].zh, .cases[2].commentary_pinyin, .cases[2].commentary_zh, .cases[2].dialogue[0].pinyin, .cases[2].dialogue[0].zh, .cases[2].dialogue[1].pinyin, .cases[2].dialogue[1].zh, .cases[2].verse_pinyin, .cases[2].verse_zh, .cases[3].commentary_pinyin, .cases[3].commentary_zh, .cases[3].dialogue[0].pinyin, .cases[3].dialogue[0].zh, .cases[3].verse_pinyin, .cases[3].verse_zh, .cases[4].commentary_pinyin, .cases[4].commentary_zh, .cases[4].dialogue[0].pinyin, .cases[4].dialogue[0].zh, .cases[4].verse_pinyin, .cases[4].verse_zh, .cases[5].commentary_pinyin, .cases[5].commentary_zh, .cases[5].dialogue[0].pinyin, .cases[5].dialogue[0].zh, .cases[5].verse_pinyin, .cases[5].verse_zh, .cases[6].dialogue[0].pinyin, .cases[6].dialogue[0].zh, .cases[9].verse_pinyin, .cases[9].verse_zh, .cases[10].dialogue[0].pinyin, .cases[10].dialogue[0].zh, .cases[10].dialogue[1].pinyin, .cases[10].dialogue[1].zh, .cases[11].commentary_pinyin, .cases[11].commentary_zh, .cases[12].dialogue[0].pinyin, .cases[12].dialogue[0].zh, .cases[13].dialogue[0].pinyin, .cases[13].dialogue[0].zh, .cases[13].dialogue[1].pinyin, .cases[13].dialogue[1].zh, .cases[16].verse_pinyin, .cases[16].verse_zh, .cases[17].commentary_pinyin, .cases[17].commentary_zh, .cases[18].commentary_pinyin, .cases[18].commentary_zh, .cases[18].dialogue[0].pinyin, .cases[18].dialogue[0].zh, .cases[18].dialogue[2].pinyin, .cases[18].dialogue[2].zh, .cases[18].dialogue[3].pinyin, .cases[18].dialogue[3].zh, .cases[19].commentary_pinyin, .cases[19].commentary_zh, .cases[19].dialogue[0].pinyin, .cases[19].dialogue[0].zh, .cases[19].verse_pinyin, .cases[19].verse_zh, .cases[20].commentary_pinyin, .cases[20].commentary_zh, .cases[22].commentary_pinyin, .cases[22].commentary_zh, .cases[22].dialogue[0].pinyin, .cases[22].dialogue[0].zh, .cases[22].dialogue[1].pinyin, .cases[22].dialogue[1].zh, .cases[22].dialogue[2].pinyin, .cases[22].dialogue[2].zh, .cases[22].verse_pinyin, .cases[22].verse_zh, .cases[24].verse_pinyin, .cases[24].verse_zh, .cases[26].dialogue[0].pinyin, .cases[26].dialogue[0].zh, .cases[28].commentary_pinyin, .cases[28].commentary_zh, .cases[28].dialogue[0].pinyin, .cases[28].dialogue[0].zh, .cases[28].dialogue[1].pinyin, .cases[28].dialogue[1].zh, .cases[28].verse_pinyin, .cases[28].verse_zh, .cases[29].verse_pinyin, .cases[29].verse_zh, .cases[31].dialogue[0].pinyin, .cases[31].dialogue[0].zh, .cases[31].dialogue[1].pinyin, .cases[31].dialogue[1].zh, .cases[32].verse_pinyin, .cases[32].verse_zh, .cases[34].commentary_pinyin, .cases[34].commentary_zh, .cases[36].verse_pinyin, .cases[36].verse_zh, .cases[39].commentary_pinyin, .cases[39].commentary_zh, .cases[39].dialogue[1].pinyin, .cases[39].dialogue[1].zh, .cases[39].verse_pinyin, .cases[39].verse_zh, .cases[43].verse_pinyin, .cases[43].verse_zh, .cases[45].verse_pinyin, .cases[45].verse_zh, .cases[46].commentary_pinyin, .cases[46].commentary_zh, .cases[46].verse_pinyin, .cases[46].verse_zh, .cases[47].commentary_pinyin, .cases[47].commentary_zh, .cases[47].dialogue[1].pinyin, .cases[47].dialogue[1].zh, .coverage_note, .epilogue.editorial_note, .preface.pinyin, .preface.zh, .zh_chars
  ℹ️  data/corpus/xinxin_ming.json: permitted allowlisted change: .coverage_note, .stanzas[10].pinyin, .stanzas[10].zh, .stanzas[14].zh, .stanzas[16].pinyin, .stanzas[16].zh, .stanzas[17].pinyin, .stanzas[17].zh, .stanzas[18].pinyin, .stanzas[18].zh, .stanzas[21].pinyin, .stanzas[21].zh, .stanzas[22].pinyin, .stanzas[22].zh, .stanzas[23].pinyin, .stanzas[23].zh, .stanzas[27].pinyin, .stanzas[27].zh, .stanzas[28].pinyin, .stanzas[28].zh, .stanzas[31].editorial_note, .stanzas[32].zh, .stanzas[34].pinyin, .stanzas[34].zh
  ℹ️  data/corpus/xuansha_yulu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/xuefeng_yantou.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/yuanwu_letters.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/yunmen_yulu.json: permitted allowlisted change: .coverage_note
  ℹ️  data/corpus/zhaozhou_yulu.json: permitted allowlisted change: .cbeta_id, .cbeta_note, .coverage_note, .dialogues[1].dialogue[0].translations.hoffman.source.reference, .dialogues[1].dialogue[1].translations.hoffman.source.reference, .taisho_vol
  ℹ️  data/corpus/zhengdao_ge.json: permitted allowlisted change: .coverage_note
35 corpus files compared
1 declared new corpus file(s): data/corpus/congronglu.json
373 permitted allowlisted changes
0 unauthorized changes
✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes
[exit 0]
```

```text
$ python3 scripts/test_source_review_rules.py
Focused mutation partition: exit=1, metrics_byte_identical=True
Focused mutation report-metadata: exit=1, metrics_byte_identical=True

  corpus *_note keys measured now (data-driven):
    cbeta_note       occurrences=19  files=19  app.js mentions=2   nodes=$ -> RENDERED
    coverage_note    occurrences=34  files=34  app.js mentions=4   nodes=$ -> EXEMPT
    editorial_note   occurrences=16  files=8   app.js mentions=2   nodes=$.cases[], $.cases[].dialogue[], $.epilogue, $.sample_records[].dialogue[], $.sections[], $.sections[].dialogue[], $.stanzas[] -> RENDERED
    recension_note   occurrences=14  files=1   app.js mentions=2   nodes=$, $.chapters[], $.chapters[].dialogue[], $.chapters[].verses[] -> RENDERED

145 W1 source-review rule checks passed
✅ W1 SOURCE-REVIEW RULES OK
[exit 0]
```

```text
$ node scripts/smoke_test.mjs
DATA loaded. corpus keys: 36
APP executed + init() completed without crash
RENDERER: 36 corpus texts exercised, 0 crashes
W1 source-review rule suite: ✅ W1 SOURCE-REVIEW RULES OK
Source-preservation suite: ✅ SOURCE-PRESERVATION OK: 35 corpus files match base commit 3cc7a8e9681e (3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43) apart from the allowlisted remediation pointers; 0 unauthorized changes
RENDER-LAZY: hidden rooms rendered on first tab activation

✅ SMOKE TEST PASSED
[exit 0]
```

```text
$ diff -rq data docs/data
[exit 0]
```

### 8.2 Additional schema-enabled validation

The initial system-wide pip attempt was refused by the externally managed Python environment; `python3 -m pip install --target /tmp/task044/python-deps jsonschema` succeeded without overriding that protection. The schema-enabled validator then exited 0:

```text
$ PYTHONPATH=/tmp/task044/python-deps python3 scripts/validate_data.py
⚠️  data/lineage/masters.json[30]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/lineage/masters.json[32]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/lineage/masters.json[33]: linked_corpus_keys is empty — dossier 'Cross-referenced project works' will show 'Project corpus link not yet curated'
⚠️  data/gongan/gongan_index.json[2]: protagonist 'juzhi' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[3]: protagonist 'huoan_shiti' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[4]: protagonist 'xiangyan_zhixian' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[5]: protagonist 'shakyamuni_and_mahakasyapa' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[14]: protagonist 'dongshan_shouchu' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[16]: protagonist 'zhimen_kuan' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
⚠️  data/gongan/gongan_index.json[23]: protagonist 'huangbo' looks like an internal lineage key but is not in data/lineage/masters.json — confirm it is an intentionally unprofiled figure
✅ DATA VALIDATION PASSED
   corpus=36 | slots=1252 | verified=177 | matrix=21 | locators=248/248
   W1 source review: collated=2 | partial/failed=32 | unavailable=2 | flagged=630 | evidence=2026-09-20 → sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json
[exit 0]
```

## 9. Findings, qualifications, and handoff

### Non-blocking corrections to inherited prose/dispatch assumptions

1. **532 vs 486:** 532 is the September 12 measurement; the fresh September 20 measurement is 486. **630 is authoritative in both cases.** A raw full-corpus measured status is not an upgrade permission (§5).
2. **Candidate replay:** the older candidate register gains only `new_documents=[]` under the current writer; semantic identity is verified, byte identity is not claimed. Both committed register basenames are spelled `CONGONGLU`; the task-043 artifact table's `CONGRONGLU_CANDIDATE` spelling is a broken path (§3.5).
3. **Pin typo in correction report §1:** that paragraph spells the pin `dbdea41071e1e260ad84b72faedf4587333cf76d`; the actual pin is `dbdea41071e1e260ad84b72faefd4587333cf76d` (as in the same report §3, code, register and acquired git object). Verification used the latter.
4. **Mixed denominator in task-043 §5:** its “733/924 → 1,093/1,424” table mixes a current measurement with the authoritative overlay. Like-for-like authority is **593/924 → 1,093/1,424**; fresh measurement is **733/924 → 1,233/1,424**. The machine registers and this report distinguish them.
5. **Quarantined title wording:** “nowhere” is too broad; case-identity and page claims, not global string absence, are the relevant test (§7).
6. **Stale planning context:** the September 19 trackers are not updated dispatch instructions for the landed 36-document state (§2). Future dispatch should use this audit/current manifest, preserve T2004/48, and not reinstate an already completed task.

These are documentary/replay-contract qualifications, not evidence of altered inherited entries, hidden current-reference drift, a failed required gate, or unauthorised source changes. Because this is an audit of append-only evidence, the older reports/registers are not silently repaired here.

### Remaining constraints

- **Human editorial sign-off and completeness remain open.** Field-level exactness under the documented normalization drops `tei:note`/`tei:g`; it does not assert unnormalized diplomatic transcription, coverage of front matter/apparatus, translation accuracy, or rights approval.
- **Future additions need their own evidence.** P1-2 should preserve/extend the existing Chuandeng Lu record under a dated plan; P1-3 must pin and collate the Caoshan witness. A historical key cannot be labelled “new” to bypass the strict anchor rule. No automatic permission to promote today's five extra measured-collated documents.
- **Operations:** `OPERATIONS.md` Edit 1 is structurally closed; Edits **2** (owner review/update of Action majors off deprecated runtimes) and **3** (owner verification/enforcement of required Quality checks on main) remain owner-held. Edits 4–6 are retired. No workflow or branch-protection change was made.
- Pages ruling remains the out-of-scope notice; `quality.yml` still runs text-integrity checks, without reviving the retired website/per-variant gates. No changes to `COMMON_QUALITIES`, website ruling, inline styles, `setProperty`, runtime dependencies, or secrets.

**Final audit conclusion:** the specific **35 → 36 dated evidence-model extension is sound**, the declared T48n2004 historical-anchor exception is explicit and bounded, and the live landed artifacts satisfy the required gates and deterministic reproduction checks. **Ready for P1-2 full Chuandeng Lu and P1-3 Caoshan**, subject to their own provenance, preservation and editorial gates; not a full-corpus release/completeness certification.

## Appendix A. Reproducible independent audit assertions

After acquisition and commands in §3, save the following outside the repository as `/tmp/task044/check_evidence.py` and run from the repository root. It uses only current files, the pinned extracted references, and the fetched parent git objects; it never edits the corpus.

```python
import collections, copy, hashlib, json, pathlib, re, subprocess, sys
sys.path.insert(0, str(pathlib.Path('scripts').resolve()))
import collate_corpus, collate_refs, source_review, w1_evidence
P=pathlib.Path
load=lambda f: json.loads(P(f).read_text())
old_path='sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json'
new_path='sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json'
old,new=load(old_path),load(new_path)
hist=load('sessions/COLLATION_REGISTER_2026-09-09.json')
# Capture the literal per-document JSON value spans, not only parsed equality.
def raw_docs(path):
 text=P(path).read_text(); dec=json.JSONDecoder()
 i=re.search(r'"documents"\s*:\s*\{',text).end(); out={}
 while True:
  while text[i].isspace() or text[i]==',': i+=1
  if text[i]=='}':return out
  key,i=dec.raw_decode(text,i)
  while text[i].isspace() or text[i]==':':i+=1
  start=i; _,i=dec.raw_decode(text,i);out[key]=text[start:i]
oldraw,newraw=raw_docs(old_path),raw_docs(new_path)
assert len(oldraw)==35 and set(newraw)-set(oldraw)=={'congronglu'}
assert all(oldraw[k]==newraw[k] for k in oldraw)
assert all(old['documents'][k]==new['documents'][k] for k in old['documents'])
print('inheritance: 35/35 entries literal-byte-identical; exactly one addition: congronglu')
entry=new['documents']['congronglu']; measured=load('/tmp/task044/measurement.json')['documents']['congronglu']
assert {k:v for k,v in entry.items() if k!='witness_note'}==measured
assert entry['flagged']==[] and entry['content_summary']=={'EXACT':500}
assert new['generation_parameters']['new_documents']==['congronglu']
assert 'congronglu' not in hist['documents']
assert 'congronglu' in new['aggregate']['documents_with_drifted_references']
print('overlay entry = fresh measurement + advisory witness_note; new_documents = [congronglu]')
for key in ('fields_total','content_fields_total','content_fields_collated','metadata_fields_total'):
 assert new['aggregate'][key]==sum(d[key] for d in new['documents'].values())
counts=collections.Counter()
for d in new['documents'].values():counts.update(d['summary'])
assert dict(counts)==new['aggregate']['class_totals']
assert new['aggregate']['flagged_entries']==sum(len(d['flagged']) for d in new['documents'].values())==630
assert new['aggregate']['source_review_status_counts']==dict(collections.Counter(source_review.derive_status(d) for d in new['documents'].values()))
assert len(new['documents'])==new['aggregate']['documents']==36
print('recomputed authoritative aggregate: '+json.dumps(new['aggregate'],ensure_ascii=False))
repro=collate_corpus.reproduce(new['documents'],'sessions/COLLATION_REGISTER_2026-09-09.json',637,new['generation_parameters']['note'])
assert repro==new['reproduction']
print('historical comparison: compared=%s identical=%s changed_status=%s flagged=%s'%(repro['documents_compared'],repro['documents_classification_identical'],repro['documents_with_changed_status'],repro['flagged_entries']))
cur=collate_refs.read_digest_manifest('sessions/COLLATION_W1_2026-09-20_refs_manifest.txt')
prev=collate_refs.read_digest_manifest('sessions/COLLATION_W1_2026-09-10_refs_manifest.txt')
historical=collate_refs.read_digest_manifest('sessions/COLLATION_W1_2026-09-09_refs_manifest.txt')
assert len(prev)==39 and len(cur)==40 and set(cur)-set(prev)=={'T48n2004'}
assert all(cur[k]==v for k,v in prev.items())
assert P('sessions/COLLATION_W1_2026-09-10_refs_manifest.txt').read_text().splitlines()==[line for line in P('sessions/COLLATION_W1_2026-09-20_refs_manifest.txt').read_text().splitlines() if 'ref_T48n2004.txt' not in line]
for work,sha in cur.items():
 assert hashlib.sha256(P('/tmp/task044/refs',f'ref_{work}.txt').read_bytes()).hexdigest()==sha
 detail=new['reference_verification']['refs'][work]
 assert detail['sha256']==sha and detail['status']=='verified'
 assert detail['historical_status']==('verified' if historical[work]==sha else 'drift')
print('reference set: 39 old manifest lines unchanged + T48n2004; 40/40 bytes verified')
print('historical reference comparison: '+json.dumps(new['reference_verification']['historical_counts']))
print('historical drift refs: '+', '.join(sorted(k for k,v in cur.items() if historical[k]!=v)))
manifest=load('data/corpus_manifest.json');metrics=load('data/project_metrics.json');locators=load('data/canonical_locators.json')['documents']
assert manifest['source_review']['historical_flagged_total']==622
assert manifest['source_review']['authoritative_flagged_total']==630
assert w1_evidence.FIXED_METADATA['authoritative_register_path']==new_path
assert metrics['corpus']['source_review']['flagged_entries']==630
assert len(manifest['items'])==len(locators)==len(list(P('data/corpus').glob('*.json')))==36
assert sum(len(d.get('case_locators',{})) for d in locators.values())==248
assert metrics['corpus']['content_cjk_characters']==189629
assert metrics['corpus']['completion_statuses']=={'excerpt_seed':31,'partial_selected_witness':5}
assert metrics['corpus']['complete_documents']==[]
print('metrics: corpus=36; CJK=189629; 31 excerpt_seed + 5 partial; complete=0; locators=248; authoritative=630 historical=622')
for key,want in [('congronglu','T2004'),('biyanlu_cases','T2003'),('wumenguan','T2005')]:
 d=load(f'data/corpus/{key}.json');assert d['cbeta_id']==want and d['taisho_vol']==48
print('corpus ID conventions: congronglu T2004/48; biyanlu_cases T2003/48; wumenguan T2005/48')
assert collate_corpus.DOCS['congronglu'][0]==['T48n2004']
assert locators['congronglu']['canonical_id']=='T2004' and locators['congronglu']['granularity']=='case'
assert locators['congronglu']['case_locators']==load('/tmp/task044/locators.json')['congronglu']
assert len(locators['congronglu']['case_locators'])==100
print('harness witness: T48n2004; canonical_id=T2004; 100 exact case locators')
doc=load('data/corpus/congronglu.json');ref=P('/tmp/task044/refs/ref_T48n2004.txt').read_text()
assert [c['case_num'] for c in doc['cases']]==list(range(1,101))
for case in doc['cases']:
 fields=[case['pointer_zh'],case['dialogue'][0]['zh'],case['commentary_zh'],case['verse_zh'],case['verse_commentary']['commentary_zh']]
 assert all(collate_refs.cjk_only(f) and collate_refs.cjk_only(f) in ref for f in fields)
assert doc['zh_chars']==84654
print('direct CJK containment (no fuzzy matching): 100/100 cases, 500/500 nonempty source fields')
anchors={'33':'0249b21','34':'0250a10','35':'0250b19','37':'0252a03','38':'0252b28'}
for n,anchor in anchors.items():
 case=doc['cases'][int(n)-1];assert case['locator']['page_line']==anchor
 print(f"containment case {n}: {case['title_zh']} p.{anchor}")
assert load('/tmp/task044/segment_report.json')['containment_anchors']==anchors
assert doc['cases'][0]['locator']['page_line']=='0227c28'
assert doc['cases'][-1]['locator']['case_close_line']=='0292a20'
print('witness case span: p.0227c28-p.0292a20 (not quarantined p.0196c-p.0199c)')
# Earlier artifacts are append-only across the landing, not merely untouched during this audit.
paths=['sessions/COLLATION_REGISTER_2026-09-09.json','sessions/COLLATION_W1_2026-09-09.md','sessions/COLLATION_W1_2026-09-09_refs_manifest.txt',old_path,'sessions/COLLATION_W1_2026-09-10_CORRECTION.md','sessions/COLLATION_W1_2026-09-10_refs_manifest.txt','sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json','sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md']
for path in paths:assert P(path).read_bytes()==subprocess.check_output(['git','cat-file','blob',f'f099932:{path}'])
for path in P('data/corpus').glob('*.json'):
 if path.stem!='congronglu':assert path.read_bytes()==subprocess.check_output(['git','cat-file','blob',f'f099932:{path}'])
print('landing vs f099932: 8/8 historical evidence artifacts unchanged; 35/35 existing corpus files unchanged')
# Byte-reproducible producer products, with the legacy candidate schema delta spelled out.
for a,b in [('/tmp/task044/congronglu.json','data/corpus/congronglu.json'),('/tmp/task044/congronglu.json','sessions/P1_CONGRONGLU_2026-09-20.json'),('/tmp/task044/locators.json','sessions/P1_CONGRONGLU_2026-09-20_locators.json'),('/tmp/task044/segment_report.json','sessions/P1_CONGRONGLU_2026-09-20_extraction_report.json'),('/tmp/task044/measurement.json','sessions/COLLATION_REGISTER_2026-09-20_CONGONGLU_MEASUREMENT.json')]:
 assert P(a).read_bytes()==P(b).read_bytes()
 print('byte-identical: '+b+' sha256='+hashlib.sha256(P(b).read_bytes()).hexdigest())
candidate=load('sessions/COLLATION_REGISTER_2026-09-20_CONGONGLU_CANDIDATE.json');replay=load('/tmp/task044/candidate.json')
assert replay['generation_parameters'].pop('new_documents')==[]
assert replay==candidate
compare=copy.deepcopy(candidate['documents']['congronglu'])
compare['reference_verification']['T48n2004']['historical_status']='drift';compare['refs_historically_verified']=0
assert compare==measured
print('candidate replay: semantic identity except added generation_parameters.new_documents=[]; NOT byte-identical')
print('candidate vs landed measurement: only historical_status none->drift and refs_historically_verified 1->0 differ')
print('PASS: independent evidence audit assertions')
```

## Appendix B. Focused in-memory negative controls

Save outside the repository as `/tmp/task044/mutation_checks.py` and run from the repository root. These directly exercise the landed validation functions without mutating committed artifacts.

```python
import copy, hashlib, json, pathlib, sys
sys.path.insert(0, str(pathlib.Path('scripts').resolve()))
import collate_corpus, collate_refs, w1_evidence as w
P=pathlib.Path
load=lambda f:json.loads(P(f).read_text())
a='sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json'
m='sessions/COLLATION_W1_2026-09-20_refs_manifest.txt'
r='sessions/COLLATION_W1_2026-09-20_CORRECTION.md'
auth=load(a); hist=load('sessions/COLLATION_REGISTER_2026-09-09.json')['documents']
meta=load('data/corpus_manifest.json')['source_review']
cur=collate_refs.read_digest_manifest(m); old=collate_refs.read_digest_manifest(w.HISTORICAL_REFS_MANIFEST)
sha=lambda f:hashlib.sha256(P(f).read_bytes()).hexdigest()
def report(text):
 issues=w.EvidenceIssues()
 w.validate_correction_report(text,r,meta,auth['documents'],hist,637,cur,old,sha(a),sha(m),issues)
 return issues.errors
def register(reg):
 issues=w.EvidenceIssues()
 w.validate_authoritative_register(reg,a,meta,cur,old,hist,set(collate_corpus.DOCS),issues)
 return issues.errors
assert not report(P(r).read_text()) and not register(auth)
print('baseline: report and authoritative-register validation have zero errors')
for label,old_text,new_text,want in [
 ('remove congronglu counts','Content fields: 500 measured, 500 collated','Content fields omitted','does not state the congronglu content-field figures'),
 ('substitute sibling counts','Content fields: 500 measured, 500 collated','Content fields: 11 measured, 6 collated','for congronglu but its entry holds 500/500'),
 ('remove shitou counts','Content fields: 11 measured, 6 collated','Content fields omitted','does not state the shitou_sandokai content-field figures'),
 ('substitute sibling refs','refs_verified = 1 / refs_total = 1','refs_verified = 2 / refs_total = 2','for congronglu but its entry holds 1/1')]:
 text=P(r).read_text(); assert text.count(old_text)==1
 errors=report(text.replace(old_text,new_text));assert any(want in e for e in errors),errors
 print('PASS '+label+': '+next(e for e in errors if want in e))
for label,mode,want in [('remove waiver','remove','do not verify against both digest anchors'),('waive historical document','old','historical register already covers'),('waive absent key','absent','not a document in this register'),('forge pinned anchor','digest','does not match the committed T48n2004 digest')]:
 reg=copy.deepcopy(auth)
 if mode=='remove':reg['generation_parameters'].pop('new_documents')
 if mode=='old':reg['generation_parameters']['new_documents'].append('wumenguan')
 if mode=='absent':reg['generation_parameters']['new_documents'].append('not_a_document')
 if mode=='digest':reg['documents']['congronglu']['reference_verification']['T48n2004']['sha256']='0'*64
 errors=register(reg);assert any(want in e for e in errors),errors
 print('PASS '+label+': '+next(e for e in errors if want in e))
print('PASS: 8 focused negative controls; no working-tree mutation')
```
