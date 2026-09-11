# W1 Remediation Plan — Adopted Hybrid R-A/R-B/R-C Policy (owner decision 2026-09-09)

**Audience:** the orchestrator agent(s) succeeding this W1 status-model session.
Everything needed to run this program is in the repository; no chat context is required.

## 0. Evidence base (read first)

1. `sessions/COLLATION_W1_2026-09-09.md` — method, per-document verdict table, verified
   fabrication suspects, witness misattributions.
2. `sessions/COLLATION_REGISTER_2026-09-09.json` — **the work-order**. Per document:
   `flagged[]` entries carry `path` (JSON pointer), `class`, `sim`, `ref` (claimed witness
   work id), `also_in` (where the text was found by probe, if anywhere), `corpus` (current
   normalized text), `ref_window` (best reference text window).
3. `scripts/collate_corpus.py` — harness; docstring documents reference acquisition.
4. `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` — sha256 of the 187 extracted
   reference texts the manifest lists (count the file, do not re-type a figure: the
   2026-09-09 report's "174 files" prose is stale and the committed manifest is the
   record); verify any freshly acquired refs against it before collating.

## 1. Strategy — adopted hybrid remediation policy (owner decision 2026-09-09)

The project adopts a hybrid policy rather than treating every document as an R-A rewrite:

- **R-A — authoritative witness available:** re-key source fields from the authoritative
  witness, correct the witness claim where the evidence supports a different source, and
  retain only text that can be mechanically tied to that witness.
- **R-B — retained project retelling:** keep a useful project retelling only when it is
  clearly labeled as such, remove unsupported witness claims from its public metadata and
  prose, and keep translation/rights disclosures separate.
- **R-C — quarantine:** quarantine material that cannot responsibly be sourced or relabeled
  without inventing authority; do not expose it as a canonical witness excerpt.

For each document and flagged field, choose R-A when authoritative witness text is available;
choose R-B for a retained project retelling whose witness claim is removed; choose R-C when
neither sourcing nor honest relabeling is responsible. Rules for the R-A work packages:

- **EXACT/MINOR fields:** leave untouched. MINOR fields may optionally be aligned to the
  witness grapheme, but punctuation/grapheme residue is acceptable and not required.
- **DIVERGENT fields (0.85–0.98):** re-key from the witness (preferred) unless a documented
  edition variant explains it — then cite the edition in the field's provenance note and
  keep, with witness unchanged.
- **NOT_FOUND fields:** the field is a retelling/composition. Re-key from the witness
  (preferred). If the claimed witness genuinely lacks the passage (e.g. Wumenguan
  preface/epilogue), either (a) remove the passage, or (b) keep it with an explicit
  project-authored label in structured metadata and NO witness attribution. Never leave a
  passage that implies witness authority without collating.
- **Witness misattributions:** fix `cbeta_id` and all derived claims (zhaozhou_yulu →
  X1315 古尊宿語錄 (X68n1315); fayan_yulu → correct source work(s); dahui_hongzhi →
  T1998A + T2001; platform_sutra → pick ONE recension per document and re-key or split).
- **Composite `title_zh` strings:** split into `title_zh` (witness heading only, collating)
  + a separate display/topic field for project-appended text. Update renderer references
  (`app.js`) and smoke guards as needed — check `scripts/smoke_test.mjs` expectations
  before renaming any field.
- **Editorial text inside source fields** (e.g. biyanlu cases[95].dialogue[0].zh 「…即在
  評唱所引」): move to a metadata/comment field.
- **After each document PR:** re-run `scripts/collate_corpus.py` for that document and
  include the before/after summary in the PR description. The register is the acceptance
  criterion: flagged count for the document must drop to the documented residual.

### 1.1 Wave-0 policy (recorded 2026-09-09, before Wave 1 PR 1)

Dialogue-marker & variant policy (R-A): Re-keyed fields reproduce the claimed witness's
own text verbatim (NFKC-normalized), preserving the witness's dialogue markers
(曰/云/問/…) and graphic variants (説/說, 爲/為, …) exactly; no repo-wide character or
marker normalization is applied to stored text — the collation harness already treats
曰/云 and listed variants as equivalent for matching, so residue is tolerated. Where a
document has more than one candidate recension, exactly one is chosen, recorded in the
field's provenance, and used for all re-keying in that document.

## 2. Sequencing (one document per PR; order below)

**Wave 1 — flagship partials (95% of volume, mostly genuine):**
1. `wumenguan` — 68 flagged (preface, epilogue, 6 verses, case-23 pointer, 曰/云 rewording:
   normalize dialogue markers to T2005 usage or record variant policy consistently repo-wide
   **first** as a one-line policy in this file before PR 1).
2. `biyanlu_cases` — 42 flagged (pointers for cases 1/2/80 vs "no 垂示" note; verse 19;
   dialogue retouches; cases[95] embedded commentary). Also correct the `coverage_note`
   claims that are falsified by the register.
3. `linji_yulu` — 10 flagged content + decide fate of sections 67–73 (行錄 retellings):
   re-key from a sourced edition, relabel, or drop. Also 73 titles.
4. `xinxin_ming` — 12 flagged: adopt T2010 recension OR document the printed edition
   actually followed (need editor decision per field: 「一念萬年」 etc.).
5. `platform_sutra` — decide recension policy FIRST (T2008 宗寶 vs Dunhuang T2007);
   currently mixed. Re-key chosen recension; 9 flagged + titles.

**Wave 2 — misattributed but partially findable content:**
6. `zhaozhou_yulu` (true witness X68n1315; 10/35 verbatim there) · 7. `dongshan_yulu`
   (20 flagged) · 8. `huangbo_chuanxin` · 9. `chuandenglu` · 10. `baojing_sanmei` ·
   11. `mazu_yulu` · 12. `bodhidharma_erru`.

**Wave 3 — wholesale failures (retellings under canonical claims):**
13–27. `deshan_yulu, qinggui_monastic_codes, yunmen_yulu, fayan_yulu, guiyang_yulu,
dahui_hongzhi, sengzhao_zhaolun, lidai_fabao_ji, dazhu_huihai, baizhang_guanglu,
foyan_qingyuan, dahui_shobogenzo, nanquan_yulu, xuefeng_yantou, wudeng_huiyuan,
xuansha_yulu, caoxi_zhuan, yuanwu_letters` — per-doc: locate true source text in the 187
refs the committed manifest lists (probe-first), re-key, or relabel as project retellings with
witness claims removed.

**Wave 4 — no-CBETA-witness docs:** `hanshan_poems`, `niutou_juezhu` — either acquire a
citable edition externally or mark witness unavailable honestly.

## 3. Coder-agent prompt template (use for every remediation PR)

```text
TASK TITLE AND SCOPE
Re-key <doc> to its claimed witness per the W1 collation register. ONE pull request.
REQUIRED READING ORDER
1. AGENTS.md  2. sessions/COLLATION_W1_2026-09-09.md (§1 method, §9 rules)
3. .orchestrator/REMEDIATION_PLAN.md (this file, §1 rules + §2 order)
4. sessions/COLLATION_REGISTER_2026-09-09.json -> documents.<doc>.flagged
5. data/corpus/<doc>.json  6. data/corpus_manifest.json (completion_status)
PROJECT CONTEXT
Zero-backend static reader; validator scripts/validate_data.py is the enforced spec;
docs quote live metrics. Reference texts: obtain per scripts/collate_corpus.py docstring
(git sparse-checkout of cbeta-org/xml-p5); verify against the refs manifest sha256.
CONFIRMED FACTS AND CONSTRAINTS
- Flagged fields and their classes are in the register; treat it as ground truth.
- Never generate source-looking Chinese from model memory; re-key ONLY from the
  extracted CBETA reference text, mechanically.
- Preserve schema shapes; keep every field the renderer reads (grep app.js first).
CORE OBJECTIVE
For every flagged field: re-keyed from witness OR explicitly relabeled; register
re-run for <doc> shows documented residual only.
EXACT DELIVERABLES
Modify: data/corpus/<doc>.json (+ derived: app_data.js, docs/ mirror via
python3 scripts/build_data_bundle.py). Modify: canonical_locators/editorial queues if
locator claims change. Update this plan's wave checklist.
BRANCH AND TARGET
Base: main. Sync rule: rebase onto origin/main first; on conflicts halt and report.
TECHNICAL REQUIREMENTS
TEST_COMMAND: COLLATION_REFS=<dir> python3 scripts/collate_corpus.py --doc <doc>
LINT_COMMAND: python3 -m py_compile scripts/*.py
BUILD_COMMAND: python3 scripts/build_data_bundle.py
Also: node scripts/smoke_test.mjs ; diff -rq data docs/data ; git diff --check
SAFETY AND COMPATIBILITY RULES
No renderer behavior change beyond data-driven text; no new public claims; do not
touch other documents; do not weaken validator rules; keep statuses honest
(verified_quotation only with rights-manifest source_id; edition != rights).
CLEANUP RULES
No scratch scripts, no debug output, no TODOs; only intended files in git status.
STRICT BOUNDARIES / OUT OF SCOPE
No app.js redesign, no rights-manifest changes, no scoreboard edits (queued for
separate PR), no new corpus documents.
QUALITY CHECKS
All five repo gates pass; collation re-run summary in PR description (before/after
flagged counts per class).
PR DESCRIPTION REQUIREMENTS
Register before/after table; per-field decisions (re-keyed vs relabeled, with witness
locators); witness changes; safety statement.
```

## 4. Invariants during remediation

- The five repo quality gates must pass on every PR.
- Honest-disclosure contract (AGENTS.md) applies to every edited field.
- No field may claim witness authority while failing collation.
- `data/project_metrics.json` CJK totals will change as fields are re-keyed; README/
  HANDOFF/AUDIT/ROADMAP/index.html guarded metrics must be regenerated in the same PR
  (validator enforces; run `validate_data.py --write-metrics` then rebuild).
- Keep `.orchestrator/STATE.md`'s task queue current; check off waves here as they merge.

## 5. Wave checklist

- [x] Policy note: 曰/云 + variant-grapheme policy (record BEFORE Wave 1 PR 1) — see §1.1
- [ ] Wave 1: wumenguan ☑ (PR #29, 2026-09-10) biyanlu_cases ☑ (PR #30, 2026-09-10) linji_yulu ☐ xinxin_ming ☐ platform_sutra ☐
- [ ] Wave 2: zhaozhou ☐ dongshan ☐ huangbo_chuanxin ☐ chuandenglu ☐ baojing ☐ mazu ☐ erru ☐
- [ ] Wave 3: (18 docs) ☐
- [ ] Wave 4: hanshan ☐ niutou ☐
- [ ] Post: README/HANDOFF/ROADMAP claim rewrite ☐ validator collation rule ☐ scoreboard removal ☑ (PR #N, 2026-09-11)

## Wave 1 progress — document 2: `biyanlu_cases` (PR #30, 2026-09-10)

**Witness:** T48n2003 (佛果圓悟禪師碧巖錄), CBETA XML P5 pinned at
`dbdea41071e1e260ad84b72faefd4587333cf76d`; `ref_T48n2003.txt` extracted by `scripts/collate_refs.py`
and byte-identical to `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`
(`47678e84c49a270aab932182dfc3b287b86d6a33a7aadc31e32c663f4a27be09`).

**Before → after** (`COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc biyanlu_cases`):

| | before | after |
|---|---:|---:|
| content fields collating to T2003 | 353 / 395 | **373 / 395** |
| flagged entries (total) | 128 | **108** |
| flagged content fields | 42 | **22** |
| DIVERGENT | 12 | **0** |
| NOT_FOUND | 7 | **0** |
| SHORT_UNMATCHED | 1 | **0** |
| MINOR (untouched by policy) | 22 | 22 |
| `title_zh` metadata flags (out of scope) | 86 | 86 |

**Per-class decisions taken (§1 rules):**

- **DIVERGENT (12)** — all re-keyed verbatim from the witness (R-A). Punctuation, speech markers and
  graphic variants follow the witness (Wave-0 policy §1.1): `。`-separated phrases, 曰/云/磨/州/門 markers,
  and witness readings such as 忠問師 (case 99) and 末句後 (case 51) kept as the witness has them. Where
  雪竇's 著語 sit in the witness's body text rather than in `<note>` apparatus (cases 23, 31), they are
  reproduced, because they are the witness's text at that location.
- **NOT_FOUND (7)** — the register's "no 垂示" work-order note is **falsified by the reference text** for
  cases 1, 3 and 81: all three carry a 垂示 in T48n2003, so all three pointers were re-keyed rather than
  removed. Case 20's `verse_zh` had joined the 頌 to 雪竇's separate 復成一頌 (two passages, 評唱 between
  them): the field now holds the 頌 alone and the joined form is disclaimed in an additive `editorial_note`
  (R-B). Cases 23 and 75 were re-keyed to the witness 舉. Case 96's 舉 is exactly 趙州示眾三轉語; the
  project parenthetical it carried was moved to `dialogue[0].editorial_note`.
- **SHORT_UNMATCHED (1)** — case 12's `dialogue[1].zh` (`洞山云麻三斤`) does not occur in the witness; the
  witness's marker is bare `山云`, so the field was re-keyed to `山云。麻三斤` (EXACT).
- **MINOR (22)** — left untouched (§1: "EXACT/MINOR fields: leave untouched").
- **`title_zh` metadata (86)** — out of scope; composite-title splitting is a separate plan item.

**Documented residual:** 22 MINOR content fields + 86 `title_zh` metadata flags, plus one disclosed and
deliberately unfixed coverage gap (case 42's 垂示 exists in the witness and is not represented in the
document — recorded in the new `coverage_note` rather than implied absent).

`source_review_status` stays `partial_or_failed_w1_collation`; the status flip belongs to the separate
post-remediation evidence pass.

## W1 evidence records and the five public ledgers (2026-09-10)

The Reader keeps **five separate, always-visible ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review. Containment/remediation state, not a rights decision. Source collation does not approve reuse. Title and name metadata (title_zh, name_zh) is measured and reported separately from source content, so collated_to_claimed_witness is not proof that the excluded metadata fields were collated.

W1 evidence: **35 documents, 630 flagged source fields** (authoritative 2026-09-10 correction register: `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`; historical 2026-09-09 register: `sessions/COLLATION_REGISTER_2026-09-09.json` with 34 documents and 622 flagged fields — the 637 figure in the 2026-09-09 report is **superseded**); 593 of 924 source-content fields collate to their claimed witness, and 22 documents have no collating source-content field at all.
