# 🤖 Fake Chan Factory: Vision & Architectural Blueprint

> **Current layout authority:** the owner-uploaded root `index.html` stub.
> This document is aspirational architecture, not a license to restore the retired
> walnut-shell frontend. For measured current state see [`AUDIT.md`](./AUDIT.md)
> and [`docs/PROJECT_STATE.md`](./docs/PROJECT_STATE.md).

## 1. Mission

Fake Chan Factory is a source-aware, playfully honest research project for
Classical Chinese Chan literature. It aims to:

1. ingest and preserve canonical Chinese sources from pinned witnesses;
2. map lineage, genre, and cross-references without overstating verification;
3. compare disclosed English registers and verified quotations side by side;
4. keep source collation, representation, translation verification, locators, and
   rights review separate;
5. deliver a zero-backend static public reader.

The joke remains: most English renderings are Robolations, not scholar quotations.
The integrity layer is real even when the English is openly fake.

## 2. Current public surface

The current stub navigation is Lineage, Library, Terms, Gallery, Account. It is a
reset point. The old five-room walnut shell, its runtime bundle, and its smoke/DOM
contract are retired. Future surfaces must be ported into the stub's authority or
introduced by a new owner decision.

## 3. Data and evidence architecture

```text
data/                           # authoritative JSON
  corpus_manifest.json
  corpus/
  lineage/
  glossary/
  gongan/
  translations/
  canonical_locators.json
  project_metrics.json
scripts/validate_data.py        # enforced semantic contract
scripts/source_review.py        # shared W1 completion/status semantics
scripts/w1_evidence.py          # dated evidence recomputation
scripts/build_pages.py          # stub + JSON Pages mirror
```

The data contract keeps **five separate ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review. Containment/remediation state, not a rights decision. Source collation does not approve reuse.

## 4. Editorial rules

1. Primary-source fidelity: every displayed Chinese passage carries a canonical
   locator or explicit pending state.
2. Book verification: verified modern translations carry translator, work,
   edition, and page/section reference; pending pagination is surfaced.
3. AI disclosure: project/AI wording is displayed only with explicit status.
4. Lineage verification: links distinguish verified, disputed, traditional-pending,
   and frontier states.
5. Rights: edition verification never implies reuse permission.

## 5. Distance to objectives

- **Canonical ingestion:** partial. The active corpus has 17 documents; growth is
  gated by preservation and dated W1 evidence.
- **Lineage/taxonomy:** partial. Profiles and edges exist, but verification states
  remain explicit and uneven.
- **Comparative analysis:** data contract exists; public stub port is pending.
- **Disclosure workflow:** data ledgers exist; stub must surface them honestly.
- **Public reader:** stub deployed by mirror; real-browser evidence pending.

## 6. Non-goals without owner decision

- No backend accounts or real access control.
- No generated source-looking Classical Chinese.
- No agent acquisition/transcription of OUT-OF-CBETA witnesses.
- No rights approval by agents.
- No resurrection of the retired walnut shell, `app_data.js`, or old smoke gates.
