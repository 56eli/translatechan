# Coder-agent task: repair PR #24 W1 containment review findings

## How to obtain this task prompt

Before doing any work, fetch the orchestrator branch and read this file without switching to that branch:

```bash
git fetch origin arena/01a08852-translatechan
git show origin/arena/01a08852-translatechan:.orchestrator/PR24_REMEDIATION_TASK_PROMPT.md
```

The orchestrator branch is a source of instructions only. Work on the Arena-assigned ephemeral `arena/<session>-translatechan` branch. Do not checkout, commit to, or push `arena/01a08852-translatechan`.

## Assignment

You are the implementation agent for `56eli/translatechan`. Make the W1 public-integrity containment work represented by PR #24 merge-ready in one focused remediation PR.

PR under review:

- PR: #24
- Head: `f7b81ef24d618ad4992286d67586a818764a21e5`
- Base: `main`
- Title: `Contain W1 source-review status in public corpus`

Do not merely describe the fixes. Implement them, test them, commit them, push the Arena-assigned session branch, and open one PR. Do not amend, force-push, merge, or close PR #24.

## Objective

Preserve the valid intent of PR #24 while fixing every review blocker:

1. All 35 manifest items have an evidence-backed, explicit, valid W1 source-review status.
2. W1 report/register/date metadata is exact, committed, internally consistent, and validator-checked.
3. Wumenguan and Xinxin Ming remain non-complete selected witnesses.
4. No code path or generated metric can represent `complete_selected_witness` unless W1 status is `collated_to_claimed_witness`.
5. Reader disclosures visibly separate:
   - source collation status;
   - represented units;
   - translation and edition verification;
   - canonical source locators;
   - rights review.
6. Metrics, `app_data.js`, root assets, and `docs/` are synchronized and deterministic.
7. Current documentation does not repeat known false or unsupported claims.
8. Existing project scope and invariants remain intact.

## Mandatory scope boundaries

Do not:

- modify, reconstruct, re-key, delete, or invent corpus source-Chinese fields;
- perform R-A/R-B/R-C per-document remediation;
- perform W2 quotation auditing;
- change translation text, edition-verification records, or rights decisions;
- redesign the visual system;
- add or remove corpus works;
- edit `.github/workflows/*`;
- edit `.scoreboard/`, `SCOREBOARD.md`, or scoreboard values;
- change localStorage keys, CSP policy, public room scope, or existing runtime APIs.

The public interface must remain exactly five rooms: Reader, Comparative Matrix, Lineage Tree, Gong’an Index, and Chan Lexicon.

The original dated 2026-09-09 W1 report/register are append-only evidence. Do not silently rewrite or overwrite them. If they need correction, add a clearly dated correction/addendum and explicitly identify the authoritative current record.

## 1. Preflight audit

Start by inspecting PR #24 and the current repository contract. Before editing, produce a local audit showing:

- all 35 `data/corpus_manifest.json` keys;
- all W1 register keys;
- missing and extra keys;
- the number of `flagged` register entries;
- report-stated aggregate counts;
- manifest source-review status counts;
- changed-file scope relative to the base.

Known defects to resolve:

- `shitou_sandokai` is present in the manifest and assigned `partial_or_failed_w1_collation`;
- it is absent from `scripts/collate_corpus.py`’s `DOCS` map;
- it is absent from `sessions/COLLATION_REGISTER_2026-09-09.json`;
- the committed register has 34 keys, not 35;
- the W1 report and `.orchestrator/STATE.md` say 637 flagged entries, while summing the committed register’s `flagged` arrays gives 622.

Do not infer a status merely from a missing register entry.

## 2. Resolve the W1 evidence gap

Use the committed reference digest manifest:

`sessions/COLLATION_W1_2026-09-09_refs_manifest.txt`

The manifest includes references relevant to Shitou, including T51n2076 and X80n1565. Reproduce the collation with hash-verified references and add the correct Shitou witness mapping to the harness if the corpus claim is supported.

The final authoritative evidence must cover all 35 manifest items. If the original 2026-09-09 report/register are immutable:

- add an append-only, clearly dated correction/addendum under `sessions/`;
- add an authoritative correction/register overlay covering the missing item;
- preserve the original report/register paths and date metadata;
- explicitly document which record is historical and which is authoritative for current status;
- make the validator merge/check the original evidence and correction evidence;
- never classify Shitou as `witness_unavailable` solely because the harness previously omitted it.

If reproducible evidence cannot be obtained, do not guess or fabricate a result. Report the blocker instead of producing a misleading “fixed” PR.

Recompute all final status counts after resolving Shitou. Do not blindly preserve `1 / 32 / 2`; retain those counts only if the corrected evidence actually produces them.

## 3. Reconcile report/register arithmetic

Confirm the arithmetic from the actual files. The report says 637 flagged entries, while the current register contains 622. Do not blindly preserve either number.

Reconcile the discrepancy through an append-only correction record if the dated report is immutable. Current documentation and metrics must use the authoritative, reproducible number. If the historical 637 figure remains visible, label it explicitly as superseded rather than current.

Ensure:

- `sum(len(document["flagged"]) ...)` matches the authoritative register total;
- `fields_total` reconciles with register summaries;
- aggregate report claims derive from authoritative evidence;
- the 35-document status counts derive from evidence rather than hand-entered claims.

## 4. Strengthen validator evidence checks

Extend `scripts/validate_data.py` beyond literal path/existence checks. It must fail when:

- any manifest item lacks `source_review_status`;
- a status is unknown;
- W1 report/register paths, date, or scope are missing or wrong;
- an evidence file is absent;
- the authoritative register is missing a manifest key;
- the authoritative register has an extra unknown key;
- evidence dates do not match declared metadata;
- authoritative status counts do not match the manifest;
- a status is assigned without a corresponding evidence record;
- `complete_selected_witness` is paired with any non-collated W1 status.

Keep this exact semantic distinction explicit:

`Containment/remediation state, not a rights decision.`

Document the evidence scope precisely. If title/name metadata fields are intentionally excluded from content collation, state that explicitly and ensure `collated_to_claimed_witness` cannot be misunderstood as proof that excluded metadata fields were collated.

Do not weaken checks merely to make current files pass.

## 5. Enforce completion compatibility everywhere

Create one shared compatibility rule and use it in:

- manifest validation;
- `complete_document_keys()`;
- `per_text_metrics()`;
- runtime Reader rendering;
- corpus shelf grouping and completion marks;
- smoke tests.

A work is complete only when both are true:

```text
completion_status == "complete_selected_witness"
source_review_status == "collated_to_claimed_witness"
```

Change `--write-metrics` so invalid source data cannot cause invalid metrics to be written before the command exits nonzero.

Add a regression test that mutates a temporary copy of the manifest to pair:

```text
completion_status = complete_selected_witness
source_review_status = partial_or_failed_w1_collation
```

The test must confirm:

- validation fails;
- no invalid metrics are written;
- `complete_documents` does not contain the work;
- `per_text.is_complete` is false;
- runtime rendering never displays “Complete witness” or a complete mark.

## 6. Preserve Wumenguan/Xinxin containment

Confirm that:

- Wumenguan remains `partial_selected_witness`;
- Xinxin Ming remains `partial_selected_witness`;
- both have `partial_or_failed_w1_collation`;
- both have `is_complete: false`;
- their corpus changes remain limited to the intended `coverage_note` changes;
- no source-Chinese field changed.

Keep represented-unit claims such as 48/48 cases and 37/37 stanzas, but label them as representation, never as source completion.

## 7. Fix current documentation truthfulness

Update current documentation without performing source remediation.

At minimum:

- `README.md` must not present Zhaozhou’s T1987 claim as an unqualified valid witness. The W1 report states that T1987 is the Caoshan record and explicitly calls the README/HANDOFF claim false. Qualify or remove the claim without changing corpus source fields.
- `.orchestrator/STATE.md` must not repeat 637 flagged entries as a current authoritative count.
- `AUDIT.md`, `HANDOFF.md`, `README.md`, `ROADMAP.md`, and `.orchestrator/REMEDIATION_PLAN.md` must distinguish represented units, W1 source collation, edition-verified English quotations, canonical locators, and rights review.
- Do not describe W1 status as rights approval.
- Explain the relationship between the original 34-key evidence and corrected authoritative 35-item status evidence.
- Ensure current numeric claims come from deterministic metrics or authoritative evidence.
- Correct the approximate bundle-size statement if it contradicts generated metrics.

Add or update documentation-truthfulness checks for the known false Zhaozhou claim and corrected W1 totals.

## 8. Reader disclosure requirements

Keep the Reader disclosure visible in every document header. It must show:

- human-readable W1 status;
- exact machine status;
- evidence date;
- report/register or authoritative correction path;
- containment/remediation scope;
- an explicit statement that source collation does not approve reuse.

Keep it visibly separate from:

- canonical source-location disclosure;
- represented coverage/unit disclosure;
- translation status and edition-verification disclosure;
- rights-manifest status.

Do not make source-review status hover-only. Details may use the existing keyboard/focus/touch citation mechanism, but the status itself must remain visible.

Add smoke assertions for at least:

- Wumenguan;
- Xinxin Ming;
- Shitou;
- one `witness_unavailable` item;
- the single collated item.

## 9. Generated artifacts and mirrors

After source changes:

1. Regenerate `data/project_metrics.json`.
2. Build `app_data.js`.
3. Synchronize root assets and `docs/`.
4. Run the build twice.
5. Confirm identical hashes between both builds.
6. Confirm byte identity for all relevant root/`docs` pairs, including:

```text
app.js
app.css
app_data.js
index.html
data/project_metrics.json
data/corpus_manifest.json
data/corpus/wumenguan.json
data/corpus/xinxin_ming.json
```

No generated artifact may contain a stale 34-item manifest, stale status counts, or stale evidence metadata.

## 10. Required verification commands

Run all of these on the final branch:

```bash
python3 -m py_compile scripts/*.py

python3 scripts/validate_data.py --write-metrics
python3 scripts/validate_data.py

python3 scripts/build_data_bundle.py
sha256sum app_data.js docs/app_data.js
python3 scripts/build_data_bundle.py
sha256sum app_data.js docs/app_data.js

node scripts/smoke_test.mjs

diff -rq data docs/data
npm audit --package-lock-only
git diff --check
git status --short
```

Also run an explicit scope audit:

```bash
git diff --name-only <base>...HEAD
git diff --stat <base>...HEAD
```

The changed-file list must not include workflows, scoreboard files, unrelated corpus files, W2 data, or visual redesign work.

Add an explicit source-preservation check proving Wumenguan and Xinxin Ming are identical to the base version except for intended `coverage_note` changes.

If Chromium is unavailable, the browser suite may be reported as skipped, but do not describe that as visual, responsive, accessibility, or release evidence.

## 11. Completion criteria

Do not open the remediation PR until all of the following are true:

- all 35 manifest keys have evidence-backed statuses;
- Shitou is no longer silently omitted;
- report/register arithmetic is reconciled;
- current docs do not repeat the false Zhaozhou T1987 claim;
- completion compatibility is enforced in validation, metrics, runtime, and tests;
- invalid `--write-metrics` input cannot write complete metrics;
- Reader disclosures visibly separate all five required ledgers;
- root and `docs/` artifacts are deterministic and byte-identical;
- no prohibited scope changed;
- all required commands pass.

In the final response, report:

- the new branch and PR URL;
- exact final status counts;
- authoritative W1 evidence paths and dates;
- the Shitou resolution;
- files changed;
- every verification command and result;
- any browser-test limitation;
- confirmation that no source text, W2 work, rights decision, workflow, scoreboard, public scope, or unrelated visual work changed.

Do not merge the PR. Leave the orchestrator a concise handoff for the next planned task.
