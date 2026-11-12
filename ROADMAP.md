# 🗺️ Fake Chan Factory Roadmap

> **Current authority:** root `index.html` owner stub. The walnut-shell roadmap is
> retired. This roadmap tracks porting functionality into the stub and preserving
> the source-integrity layer.

## Milestone overview

| Phase | Scope | Status |
|---|---|---|
| 0 | Layout demolition/reset | Complete on session branch, 2026-11-12 |
| 1 | Stub reader parity for validated corpus shapes | Next |
| 2 | Honest disclosure/provenance surfaces in stub | Next |
| 3 | Comparative/gongan/locator research surfaces | Planned |
| 4 | Real-browser evidence and owner review | Planned |
| 5 | Corpus growth/remediation under preservation gates | Ongoing |
| 6 | Botrunner/export implementation after owner rulings | Design-only |

## Phase 0 — demolition/reset

- [x] Delete retired frontend assets and old deploy shell.
- [x] Replace bundle build with `scripts/build_pages.py`.
- [x] Delete retired presentation gates and add `scripts/test_pages_contract.py`.
- [x] Update Quality workflow under owner-authorized demolition.
- [x] Mark retired design specs non-authoritative.

## Phase 1 — stub reader parity

- [ ] Render all validated corpus shapes: cases, sections, dialogues, stanzas,
  chapters, five-ranks/sample records where present.
- [ ] Preserve pagination/navigation behavior without restoring the old shell.
- [ ] Keep source Chinese, pinyin, and disclosed English registers honest.

**Phase 2 — `12/17 complete`** is the current corpus completion measurement, not a
UI completion claim. Completion requires explicit status, collated W1 evidence,
and satisfied unit targets.

## Phase 2 — disclosure/provenance

The data contract keeps **five separate ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review.

W1 evidence: **17 documents, 127 flagged source fields**. Authoritative register:
`sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json`. Historical register:
`sessions/COLLATION_REGISTER_2026-09-09.json` (2026-09-09).

- [ ] Surface document-level W1 status and coverage notes.
- [ ] Surface passage-level `recension_note`, `editorial_note`, `cbeta_note`
  without concatenating their meanings.
- [ ] Keep rights review separate from collation and edition verification.

Current measured English layer: **2 verified corpus quotation slots across 2 texts + 2 verified Matrix entries**.

## Phase 3 — research surfaces

- [ ] Port comparative matrix data into the stub.
- [ ] Port gongan index/theme filtering.
- [ ] Port canonical locator and traceability disclosures.
- [ ] Replace or clearly label Gallery placeholder and Account UI gate.

## Phase 4 — evidence

- [ ] Add a real-browser suite for the owner stub, not the retired DOM.
- [ ] Capture desktop/mobile and light/dark evidence.
- [ ] Record owner review; do not self-declare visual approval.

## Phase 5 — corpus growth/remediation

- [ ] Continue R-A/R-B/R-C remediation one document per PR where independent.
- [ ] Keep preservation base pinned; declare new corpus files with dated evidence.
- [ ] OUT-OF-CBETA acquisition/transcription remains human work.
- [ ] Rights decisions remain human/jurisdiction work.

## Phase 6 — export/botrunner

- [ ] Resolve owner questions in `docs/BOTRUNNER_EXPORT_SCHEMA_2026-09-23.md`.
- [ ] Implement exporter only after ruling; reissue manifest/ready marker atomically.
- [ ] Keep botrunner gate fail-closed on stale or mismatched export artifacts.

## Tech stack and directory structure

```text
index.html              # owner-stub layout authority
data/                   # authoritative JSON
docs/                   # Pages mirror: index.html + data/ + crawler files
scripts/
  validate_data.py
  build_pages.py
  test_source_preservation.py
  test_source_review_rules.py
  test_pages_contract.py
sessions/               # append-only evidence
```

Deployment is native GitHub Pages branch publishing (`main` + `/docs`). Quality
verifies repository integrity and the generated mirror; it does not deploy Pages.
