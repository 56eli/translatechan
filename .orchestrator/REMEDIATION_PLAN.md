# W1 Remediation Plan — R-A Fix-in-Place (owner decision 2026-09-09)

**Audience:** the orchestrator agent(s) succeeding session `arena/01a087e2-translatechan`.
Everything needed to run this program is in the repository; no chat context is required.

## 0. Evidence base (read first)

1. `sessions/COLLATION_W1_2026-09-09.md` — method, per-document verdict table, verified
   fabrication suspects, witness misattributions.
2. `sessions/COLLATION_REGISTER_2026-09-09.json` — **the work-order**. Per document:
   `flagged[]` entries carry `path` (JSON pointer), `class`, `sim`, `ref` (claimed witness
   work id), `also_in` (where the text was found by probe, if anywhere), `corpus` (current
   normalized text), `ref_window` (best reference text window).
3. `scripts/collate_corpus.py` — harness; docstring documents reference acquisition.
4. `sessions/COLLATION_W1_2026-09-09_refs_manifest.txt` — sha256 of the 174 extracted
   reference texts; verify any freshly acquired refs against it before collating.

## 1. Strategy (R-A, confirmed by owner)

For every document, and every flagged field, make the corpus text **actually be the
claimed witness's text** — or make the claim match reality. Rules:

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
xuansha_yulu, caoxi_zhuan, yuanwu_letters` — per-doc: locate true source text in the 174
refs (probe-first), re-key, or relabel as project retellings with witness claims removed.

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
- [ ] Wave 1: wumenguan ☐ biyanlu_cases ☐ linji_yulu ☐ xinxin_ming ☐ platform_sutra ☐
- [ ] Wave 2: zhaozhou ☐ dongshan ☐ huangbo_chuanxin ☐ chuandenglu ☐ baojing ☐ mazu ☐ erru ☐
- [ ] Wave 3: (18 docs) ☐
- [ ] Wave 4: hanshan ☐ niutou ☐
- [ ] Post: README/HANDOFF/ROADMAP claim rewrite ☐ validator collation rule ☐ scoreboard removal ☐
