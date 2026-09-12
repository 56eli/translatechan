# W1 Post-Remediation Measurement — Full-Corpus Collation Register (2026-09-12)

**Author:** Arena agent (session `arena/01a09543-translatechan`), task 012 (post-remediation evidence pass).
**Measures:** the corpus of `main` at `faff161` (PR #40), i.e. after the Wave-1 remediation PRs
#29, #30, #32, #34 and #35.
**Authoritative register for current status:** `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`
— unchanged by this record. `data/project_metrics.json` still reports it, and the five documents that
cite it (`README.md`, `AUDIT.md`, `HANDOFF.md`, `ROADMAP.md`, `.orchestrator/REMEDIATION_PLAN.md`) keep
doing so verbatim.
**This record:** `sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json` (generated 2026-09-12 by
`scripts/collate_corpus.py`, kind `w1-post-remediation-measurement`, no `corrects`; reference digests
anchored by `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`).
**Status scope:** Containment/remediation state, not a rights decision. Source collation does
not approve reuse.

## 0. Status of this record (read this first)

This is a dated post-remediation **measurement** of the corpus as it stands on `main` at `faff161`;
it is **not designated authoritative**. The authoritative register remains
`sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`, `data/project_metrics.json` and the five
documents that cite the 2026-09-10 register are unchanged by this PR, and moving authority to a newer
record is a separate, deliberate change to the evidence model (`scripts/w1_evidence.py` fixes the
historical/overlay pair in `FIXED_METADATA` and requires an authoritative record to be a
`w1-correction` that corrects the 2026-09-09 register — this record is neither, on purpose). The
project's standing scope limits apply to this record exactly as to its predecessors:
**Source collation does not approve reuse.** and **Containment/remediation state, not a rights
decision.** Nothing here adjudicates, upgrades or downgrades any document's status.

## 1. What moved, per document

Taken from this register's own `reproduction.differences` (compared register:
`sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`): `documents_compared = 35`,
`documents_classification_identical = 31`, `documents_differing = 4`,
`documents_with_changed_status = 0`.

| document | class counts 2026-09-10 → 2026-09-12 | flagged then → now |
|---|---|---|
| `biyanlu_cases` | EXACT 368→388, MINOR 22→22, DIVERGENT 12→0, NOT_FOUND 18→11, TITLE_COMPOSITE 4→4, SHORT_UNMATCHED 72→71 | **128 → 108** |
| `linji_yulu` | EXACT 80→85, MINOR 2→2, DIVERGENT 3→1, NOT_FOUND 79→76 | **84 → 79** |
| `wumenguan` | EXACT 160→221, MINOR 5→6, DIVERGENT 48→0, NOT_FOUND 15→1, SHORT_UNMATCHED 2→2 | **70 → 9** |
| `xinxin_ming` | EXACT 24→36, DIVERGENT 12→0, NOT_FOUND 2→2 | **14 → 2** |

Two further documents were touched by the campaign but carry **no** classification delta:

- `platform_sutra` (PR #35, label-only): its register entry is byte-identical to the 2026-09-10
  register's — the recension labels are disclosure, not re-keying, and moved no collation class.
- `deshan_yulu` differs from the 2026-09-10 register in exactly one key, `witness_note`, where this
  run prints `X68n1315` and the 2026-09-10 register prints `X1315`. That is a harness-side id
  normalisation (the hard-coded witness table in `scripts/collate_corpus.py`, ids normalised in
  `7cde460`), not a corpus change: `data/corpus/deshan_yulu.json` contains neither string.

All other 30 documents, the whole reference layer, and both digest manifests reproduce byte-for-byte
(§5).

## 2. Reconciliation: 630 → 532

| figure | records covered | source | meaning |
|---|---|---|---|
| **630** | 35 documents | `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` | **still authoritative.** Quoted verbatim by the five citing documents; generated into `data/project_metrics.json`; untouched by this PR. |
| **532** | 35 documents | `sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json` (this record, `aggregate.flagged_entries`) | measured today. A dated snapshot, not a designation. |

The −98 delta is accounted for by the merged remediation PRs, per document (register
`reproduction.differences`, `historical_flagged_entries` → `corrected_flagged_entries`):

| PR | document | action | flagged delta |
|---|---|---|---:|
| #29 (2026-09-10) | `wumenguan` | re-keyed to the T2005 witness | −61 (70 → 9; DIVERGENT 48 → 0) |
| #30 (2026-09-11) | `biyanlu_cases` | re-keyed to the T2003 witness | −20 (128 → 108; DIVERGENT 12 → 0) |
| #32 (2026-09-11) | `linji_yulu` | re-keyed to the T47n1985 witness | −5 (84 → 79; DIVERGENT 3 → 1) |
| #34 (2026-09-11) | `xinxin_ming` | re-keyed to the T48n2010 witness | −12 (14 → 2; DIVERGENT 12 → 0) |
| #35 (2026-09-11) | `platform_sutra` | recension labels only | 0 (no class moved) |
| #36, #37 (2026-09-11/12) | — | witness inventories / consolidation plan (docs only) | 0 |

−61 − 20 − 5 − 12 = −98 = 630 → 532. **No document's status moved**: the register's own
`reproduction.documents_with_changed_status` is **0**, and `source_review_status_counts` is
unchanged at 1 / 32 / 2. A reduced flag count is not a finished corpus.

## 3. What did NOT move

- **Status counts stay 1 / 32 / 2** (`collated_to_claimed_witness` / `partial_or_failed_w1_collation`
  / `witness_unavailable`) — identical to the 2026-09-10 register; `documents_with_changed_status = 0`.
- **`corpus.complete_documents` stays empty** (`data/project_metrics.json`, unchanged by this PR);
  `zhengdao_ge` remains the single `collated_to_claimed_witness` document.
- **The two adjudicated residuals survive as exactly one `DIVERGENT` field each**:
  `linji_yulu` `.sections[66].title_zh` (sim 0.8571, the 序四 composite title) and `platform_sutra`
  `.chapters[7].zh` (sim 0.9444, 師示眾云 where the T48n2008 witness reads 師謂眾曰). The 行錄 division
  (sections 67–73) that PR #32 adjudicated per field now contributes no `DIVERGENT` field at all:
  sections 67–70 were re-keyed to T47n1985 (now EXACT) and sections 71–73 are kept as labelled
  retellings (`NOT_FOUND`), per the owner's binding 2026-09-11 ruling.
- **The 31 `OUT-OF-CBETA` documents still have no witness to collate against** — the human-sourcing
  queue is owner-held and explicitly not agent-authorisable; nothing in this measurement changes that.

## 4. Reference layer

- **Pinned upstream:** `https://github.com/cbeta-org/xml-p5` @
  `dbdea41071e1e260ad84b72faefd4587333cf76d` (master, tag 2026R2), equal to
  `w1_evidence.PINNED_UPSTREAM_REVISION`; the clone's `git rev-parse HEAD` matched it exactly (§5).
- **Digest verification:** `39 verified, 0 drift, 0 unlisted, 0 unavailable` against
  `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt` — the same anchor as the authoritative
  register, so the two records are comparable field-for-field.
- **No new digest manifest was written.** The re-extracted references are byte-identical to the
  committed digests (that is what `0 drift` means); re-publishing them under a new name would create
  two files claiming authority over the same references. The 2026-09-10 manifest remains the single
  digest anchor, and the 2026-09-09 manifest remains the historical anchor: this run's
  `historical_counts` (33 verified, 6 drift) reproduce the 2026-09-10 register's own historical
  counts exactly, so the anchor state itself has not moved.

## 5. Reproduction: how this record was produced, and the expected `cmp` failure

All commands below were run on 2026-09-12 in a fresh clone at base `faff161`; outputs are pasted, not
summarised. The path list is built from the manifest in Python (work ids contain a lowercase `n`, so
they must never be sliced):

```console
$ python3 - <<'PY'
  import re
  ids=sorted({m for l in open('sessions/COLLATION_W1_2026-09-10_refs_manifest.txt')
              for m in re.findall(r'ref_([TX]\d{2}n\d{3,4}[A-Z]?)\.txt', l)})
  assert len(ids)==39, len(ids)
  open('/tmp/paths.txt','w').write(''.join(f'/{i[0]}/{i[:3]}/{i}.xml\n' for i in ids))
  print(len(ids),'works')
  PY
39 works

$ git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
$ git -C /tmp/xmlp5 sparse-checkout set --no-cone $(tr '\n' ' ' < /tmp/paths.txt) && git -C /tmp/xmlp5 checkout
$ find /tmp/xmlp5 -name '*.xml' | wc -l
39
$ git -C /tmp/xmlp5 rev-parse HEAD
dbdea41071e1e260ad84b72faefd4587333cf76d        # == w1_evidence.PINNED_UPSTREAM_REVISION

$ python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --work-list sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
    --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt
references: 39 work(s)
digest verification: 39 verified, 0 drift, 0 unlisted, 0 unavailable (against COLLATION_W1_2026-09-10_refs_manifest.txt)
✅ reference extraction/verification complete
```

**The §7 `cmp` check of the 2026-09-10 report now fails — and that failure is the finding.**

```console
$ COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --out /tmp/replay.json \
    --reproduce sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json
register written: /tmp/replay.json
$ cmp /tmp/replay.json sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json
/tmp/replay.json sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json differ: char 8938, line 265
```

`--reproduce` replays the recorded *generation parameters*, but the corpus under those parameters has
moved since 2026-09-10. Census of the differing JSON keys: **47 — 7 in `aggregate`, 5 in
`reproduction`, 35 inside `documents`, affecting exactly 5 documents** (`biyanlu_cases`,
`deshan_yulu`, `linji_yulu`, `wumenguan`, `xinxin_ming` — the four re-keyed documents plus
`deshan_yulu`'s harness-side `witness_note` id normalisation). The other 30 documents, the whole
reference layer and both manifests reproduce byte-for-byte. So the 2026-09-10 report's §7 claim that
"the documented command and the committed bytes cannot drift apart" holds only while the corpus is
static; the `cmp` failure is evidence of remediation, not a broken environment, and the report is
append-only history that this PR deliberately does not edit. Corollary recorded for future runs:
part of the witness claim lives in the harness (the hard-coded witness table in
`scripts/collate_corpus.py`), not in `data/corpus/*.json` — a witness id is never "corrected" by
editing corpus data.

The record itself was then generated (this is the exact command; it is also recoverable from the
register's `generation_parameters`):

```console
$ RUN_DATE=$(date -u +%F); echo "RUN_DATE=$RUN_DATE"
RUN_DATE=2026-09-12
$ COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py \
    --out /tmp/register_${RUN_DATE}.json --generated "$RUN_DATE" \
    --kind w1-post-remediation-measurement \
    --refs-manifest sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
    --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
    --compare-register sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json \
    --require-verified-refs \
    --upstream-revision "$(git -C /tmp/xmlp5 rev-parse HEAD)" \
    --note "measurement-only record: this register is not designated authoritative, data/project_metrics.json still reports the 2026-09-10 overlay, and the five documents that cite it keep doing so verbatim" \
    --note "deshan_yulu's witness_note delta versus the 2026-09-10 register is a harness-side id normalisation (7cde460), not a corpus change"
register written: /tmp/register_2026-09-12.json
$ cmp /tmp/register_2026-09-12.json sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json
$ echo $?
0
```

**Regeneration note (2026-09-12, post-review):** the register was regenerated once with
`--upstream-revision "$(git -C /tmp/xmlp5 rev-parse HEAD)"` added, so the record itself pins the
clone's HEAD instead of printing `unrecorded`. A leaf-by-leaf diff against the first generation
(without that flag) differs in **exactly 2 leaf keys**: `upstream.revision` (`"unrecorded"` →
`dbdea41071e1e260ad84b72faefd4587333cf76d`) and `generation_parameters.upstream_revision`
(absent → the same hash). Everything else — the whole `aggregate`, `reproduction`, `documents` and
`reference_verification` blocks, and both manifest declarations — is unchanged; the aggregate line
below is identical in both generations.

`--corrects` is deliberately absent and the kind is deliberately not `w1-correction`: the validator
requires an authoritative record to correct the 2026-09-09 register, and pointing this record at
2026-09-10 while claiming that kind would be a contract violation, while pointing it at 2026-09-09
would create a second overlay competing for authority. Its aggregate line, pasted from the run:

```json
{"documents": 35, "flagged_entries": 532, "fields_total": 1315, "content_fields_total": 924, "content_fields_collated": 691, "metadata_fields_total": 391, "class_totals": {"DIVERGENT": 37, "EXACT": 783, "MINOR": 31, "NOT_FOUND": 310, "SHORT_UNMATCHED": 108, "TITLE_COMPOSITE": 32, "WITNESS_UNAVAILABLE": 14}, "source_review_status_counts": {"collated_to_claimed_witness": 1, "partial_or_failed_w1_collation": 32, "witness_unavailable": 2}, "documents_without_evidence": [], "documents_with_drifted_references": ["baizhang_guanglu", "dahui_hongzhi", "dahui_shobogenzo", "foyan_qingyuan", "nanquan_yulu", "xuansha_yulu", "xuefeng_yantou", "zhaozhou_yulu"]}
```

## 6. Invariants

- `git diff --name-only origin/main...HEAD` for this PR is exactly three paths:
  `ROADMAP.md`, `sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`,
  `sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md`. No path under `data/`, `docs/`,
  `scripts/`, `schemas/`, `.github/`, and no pre-existing `sessions/` file is touched.
- The register is committed **exactly as the harness wrote it**:
  `cmp /tmp/register_2026-09-12.json sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`
  is clean. Every number in this report is copied from that JSON or pasted from a command above.
- No re-designation: `data/project_metrics.json`, `scripts/w1_evidence.py`,
  `scripts/validate_data.py` and the five documents that cite the 2026-09-10 register are
  unchanged; `python3 scripts/validate_data.py` still reports
  `flagged=630 | evidence=2026-09-10 → sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`.
- No new digest manifest; the two committed manifests are byte-identical to their committed selves.
- After the data-bundle rebuild, `git diff --exit-code data docs` is clean, `diff -rq data docs/data`
  reports no differences, and `git status --porcelain` is empty.
- The new register's top-level key set equals the authoritative register's exactly (15 keys:
  `aggregate`, `content_denominator`, `corrects`, `documents`, `generated`, `generation_parameters`,
  `harness`, `historical_refs_manifest`, `kind`, `reference_extraction`, `reference_verification`,
  `refs_manifest`, `reproduction`, `status_scope`, `upstream`). That is key-set parity, not
  adoptability. Before this record could be designated authoritative, `scripts/w1_evidence.py`
  requires three things of it: `kind == "w1-correction"`, `corrects ==
  "sessions/COLLATION_REGISTER_2026-09-09.json"`, and `upstream.revision ==
  PINNED_UPSTREAM_REVISION` (`dbdea41071e1e260ad84b72faefd4587333cf76d`). This record carries the
  pinned `upstream.revision` but deliberately not the overlay `kind` and not `corrects` — it is a
  measurement, and re-designation remains a separate, owner-ruled change to the evidence model.

## 7. How to reproduce this record

```bash
# 1. pinned reference edition (git protocol; the raw CDN is unreachable from this sandbox).
#    Work ids contain a lowercase 'n' — build paths from the manifest, never by slicing.
python3 - <<'PY'
import re
ids=sorted({m for l in open('sessions/COLLATION_W1_2026-09-10_refs_manifest.txt')
            for m in re.findall(r'ref_([TX]\d{2}n\d{3,4}[A-Z]?)\.txt', l)})
assert len(ids)==39, len(ids)
open('/tmp/paths.txt','w').write(''.join(f'/{i[0]}/{i[:3]}/{i}.xml\n' for i in ids))
print(len(ids),'works')
PY
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
git -C /tmp/xmlp5 sparse-checkout set --no-cone $(tr '\n' ' ' < /tmp/paths.txt) && git -C /tmp/xmlp5 checkout
git -C /tmp/xmlp5 rev-parse HEAD   # must equal dbdea41071e1e260ad84b72faefd4587333cf76d

# 2. extract and verify the reference layer with the committed rule (no new digest manifest;
#    verification against the committed manifest must report 39 verified, 0 drift)
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
  --work-list sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt

# 3. (finding, not a gate) replay the 2026-09-10 overlay; the cmp now FAILS by design —
#    the corpus has moved under the recorded generation parameters. The failure is the
#    evidence of remediation; do not "fix" it and do not edit the 2026-09-10 report.
COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --out /tmp/replay.json \
  --reproduce sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json
cmp /tmp/replay.json sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json

# 4. generate this measurement record (RUN_DATE = the day of the run)
RUN_DATE=$(date -u +%F)
COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py \
  --out /tmp/register_${RUN_DATE}.json --generated "$RUN_DATE" \
  --kind w1-post-remediation-measurement \
  --refs-manifest sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
  --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
  --compare-register sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json \
  --require-verified-refs \
  --upstream-revision "$(git -C /tmp/xmlp5 rev-parse HEAD)" \
  --note "measurement-only record: this register is not designated authoritative, data/project_metrics.json still reports the 2026-09-10 overlay, and the five documents that cite it keep doing so verbatim" \
  --note "deshan_yulu's witness_note delta versus the 2026-09-10 register is a harness-side id normalisation (7cde460), not a corpus change"
cmp /tmp/register_${RUN_DATE}.json sessions/COLLATION_REGISTER_${RUN_DATE}_POSTREMEDIATION.json

# 5. gates
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
git diff --exit-code data docs
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
diff -rq data docs/data
git diff --check
```

    committed register sha256 22d21b2881b30cc1d48c492ca75aa578dbfc226656e3b146b0ebe52b28d06317
      (sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json, the harness's own bytes;
       regenerated with --upstream-revision, see the regeneration note in §5)

Every flag and note above is part of the evidence file via `generation_parameters`, not a re-typable
incantation; every class count, digest, status and aggregate in the register is computed from the
corpus JSON, the pinned CBETA revision and the two committed digest manifests, and is never
transcribed from the metrics, `app_data.js`, or any document.
