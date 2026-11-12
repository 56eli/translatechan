# 🔍 Fake Chan Factory — Current Audit

> **Current verdict date:** 2026-11-12 layout demolition/reset.
> **Canonical tracker:** [`docs/PROJECT_STATE.md`](./docs/PROJECT_STATE.md).
> **Convention:** this file is the current verdict and index; dated reports under
> `sessions/` are immutable snapshots and may contain superseded conclusions.

## 1. Current verdict

**Not release-ready.** The rejected walnut-shell layout has been demolished, but
the owner stub is a reset point rather than a fully ported research reader.

Demolition completed on the session branch:

- retired root/docs frontend assets deleted: `app.css`, `app.js`, `app_data.js`,
  `theme-init.js`, old social-card assets;
- old `docs/index.html` shell replaced by the owner-stub mirror;
- retired presentation gates deleted: `smoke_test.mjs`,
  `compat_runtime_check.mjs`, `browser_test.mjs`;
- build replaced by `scripts/build_pages.py`, which publishes stub + JSON only;
- current docs and Quality workflow repinned to the owner-stub contract;
- retired design specs marked non-authoritative.

Current generated measurements:

- Corpus: **17 documents**; Source review: **13 collated**, **2 partial/failed**, **2 unavailable**; **12 of 17 documents** are `complete_selected_witness`; **5 excerpt seeds**.
- Biyanlu **100/100 cases**; Wumenguan **48/48 cases** represented; W1 source-review status: `collated_to_claimed_witness`.
- Source volume: **878,582 content CJK / 937,884 all-string CJK**.
- Translations: **209 corpus slots**; **2 verified quotations**; **21 matrix registers**; verified-reference coverage **3 recorded / 1 pending**.
- Locators: **4192/4192 case-level**; **6 document-level seeds**.
- Lineage: **60 masters**; **12 controlled `school_key` groups**; **48 edge records + 12 frontiers**.
- Glossary: **31 terms**; Gong'an index: **24 entries**.
- Rights: all rights-manifest sources remain human/jurisdiction-review pending.

The data contract keeps **five separate ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review. Containment/remediation state, not a rights decision. Source collation does not approve reuse. Title and name metadata (title_zh, name_zh) is measured and reported separately from source content, so collated_to_claimed_witness is not proof that the excluded metadata fields were collated.

W1 evidence: **17 documents, 127 flagged source fields**. Authoritative register:
`sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json`. Historical register:
`sessions/COLLATION_REGISTER_2026-09-09.json` (2026-09-09). The historical 637
report figure is superseded; the historical 622 register figure is historical.
Zhaozhou's former T1987 claim is false: T1987 is the Caoshan record.

## 2. Active blockers

### P1 — content/rights

1. Rights review remains human/jurisdiction work; no ledger approves reuse.
2. Partial/failed and witness-unavailable documents remain contained.
3. OUT-OF-CBETA sourcing is human work; agents may not fetch/transcribe those
   witnesses.

### P2 — stub port and evidence

4. The stub reader handles `cases` only; sections/dialogues/stanzas/chapters and
   other validated shapes need porting.
5. Provenance notes and the five separate ledgers must be surfaced honestly in
   the stub.
6. Comparative matrix, gongan index, and locator/research surfaces are not yet
   ported into the stub.
7. Gallery is placeholder; Account is local UI only.
8. No real-browser or accessibility evidence exists for the current stub.

### P3 — operations

9. Required Quality/branch protection on `main` remains owner-side verification.
10. Botrunner export manifest/ready marker are stale and fail closed; exporter is
    design-only.

## 3. Verification commands

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_pages.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
python3 scripts/test_pages_contract.py
diff -rq data docs/data
git diff --check
```

Do not report the retired smoke/browser suites as current evidence.

## 4. Report index

| Date | Report | Scope |
|---|---|---|
| 2026-11-12 | `sessions/LAYOUT_DEMOLITION_2026-11-12.md` | layout demolition/reset evidence |
| 2026-09-22 | `sessions/COLLATION_W1_2026-09-22_P1_BIYANLU_DIGESTS.md` | authoritative W1 overlay report |
| 2026-09-09 | `sessions/COLLATION_W1_2026-09-09.md` | historical full-corpus collation |
| earlier | `sessions/` | append-only historical audit/implementation evidence |

## 5. Maintenance rule

- Update current verdict only when current evidence changes.
- Add dated evidence under `sessions/`; never edit old session records.
- Never infer a numeric owner score from feedback, merge, or silence.
