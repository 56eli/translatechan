# Research Release Plan

> **Current authority:** owner-stub layout + source-integrity gates. The retired
> walnut-shell release checklist is historical. This plan states what must be true
> before a research release is claimed.

## Release standard

A release is not ready because a layout merged or a gate passed. It requires:

1. source data validates and metrics are current;
2. preservation and W1 evidence gates pass;
3. public surfaces disclose source, translation, locator, and rights states honestly;
4. rights decisions remain human/jurisdiction work;
5. real-browser evidence exists for the public surface being released.

## Current corpus baseline

**12 of 17 documents** are `complete_selected_witness` under the validator rule:
explicit completion status, `collated_to_claimed_witness`, and satisfied unit
targets. The five non-complete documents are excerpt seeds: `zhengdao_ge`,
`hanshan_poems`, `niutou_juezhu`, `guiyang_yulu`, `fayan_yulu`.

W1 evidence: **17 documents, 127 flagged source fields**. Authoritative register:
`sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json`. Historical register:
`sessions/COLLATION_REGISTER_2026-09-09.json` (2026-09-09). The historical 637
report figure is superseded; the historical 622 register figure is historical.
Zhaozhou's former T1987 claim is false: T1987 is the Caoshan record.

## Release-blocking checklist

- [x] **Post-remediation evidence designation.** The authoritative register chain
  is pinned and recomputed by `scripts/w1_evidence.py`; `--write-metrics` fails
  closed on blocking evidence/data errors.
- [ ] **Stub disclosure port.** The retired renderer was deleted with the old
  layout. The owner stub must surface provenance notes and the five separate data
  ledgers before a research release is claimed.
- [ ] **Owner fabricated-text policy decisions.** Material attested in no pinned
  reference requires owner ruling: replace from witness, label as project
  composition, or remove from public set. Not agent-authorisable.
- [ ] **Human-sourcing queue for OUT-OF-CBETA witnesses.** Acquisition,
  transcription, and evaluation are human work. Agents may not fetch or transcribe
  those witnesses.
- [ ] **Rights review.** All rights-manifest sources remain pending human/jurisdiction
  review. Edition verification does not approve reuse.
- [ ] **Real-browser evidence.** No current stub browser/accessibility evidence is
  on record. A future suite must test the owner stub, not the retired DOM.

## Source growth workflow

For each new canonical source:

1. Record edition/recension and stable locator before adding text.
2. Import only from pinned authoritative witnesses; never generate source-looking
   Chinese.
3. Segment conservatively and keep pointer/case/commentary/verse distinct.
4. Add pinyin/English only with explicit disclosure status.
5. Add locators, provenance notes, and cross-references where genuine.
6. Run validator, protected metrics write if data changed, build, preservation,
   W1 rules, and Pages contract.
7. Commit source, metrics, and generated mirror together.

## Definition of done for every change

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py --write-metrics  # only when source data changed
python3 scripts/validate_data.py
python3 scripts/build_pages.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
python3 scripts/test_pages_contract.py
diff -rq data docs/data
git diff --check
```

Then push the session branch, require Quality to pass, and open a PR to `main`.
