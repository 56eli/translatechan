# Project State

Canonical project tracker for `56eli/translatechan` / Fake Chan Factory.

## 1. Owner vision and scope boundaries

- **Current layout authority:** the owner-uploaded root `index.html` stub. It is the
  only public layout authority. The rejected walnut-shell frontend was demolished
  on 2026-11-12; do not restore it, reskin it, or bend the stub back into it.
- **Product:** a zero-backend static GitHub Pages reader/research surface for
  Classical Chinese Chan literature, with honest source-review, translation,
  locator, and rights disclosures.
- **Current stub navigation:** Lineage, Library, Terms, Gallery, Account. The stub
  is a starting point, not a claim that every research room is already ported.
- **Non-goals without a new owner decision:** no backend accounts, no rights
  approval, no generated source-looking Chinese, no agent fetch/transcription of
  OUT-OF-CBETA witnesses, no resurrection of the retired runtime bundle or smoke
  gates.

## 2. Architectural invariants

- **Pipeline:** `data/` → `scripts/validate_data.py` → `data/project_metrics.json`
  → `scripts/build_pages.py` → `docs/index.html` + `docs/data/` + crawler files →
  GitHub Pages publishes `main /docs`.
- **Layout mirror:** `docs/index.html` must be byte-identical to root `index.html`.
  The build copies the stub; it does not compile a JavaScript data bundle.
- **Data mirror:** `docs/data/` must be byte-identical to `data/`.
- **Retired assets stay deleted:** `app.css`, `app.js`, `app_data.js`,
  `theme-init.js`, `og-image.svg`, `og-image.png`, and the old deploy shell.
- **Quality gates:** Python syntax, `validate_data.py`, `build_pages.py`,
  `test_source_preservation.py`, `test_source_review_rules.py`,
  `test_pages_contract.py`, committed-artifact diff, and `git diff --check`.
- **Source preservation:** `test_source_preservation.py` keeps the pinned base
  `f1207eaf461889d8819a9287904bdfaf354a3018` and the declared corpus-growth
  allowlist. Corpus growth requires dated evidence and an explicit declaration.
- **Completion rule:** `complete_selected_witness` is countable only with
  `collated_to_claimed_witness` and satisfied unit targets. Representation counts
  alone never establish completion.
- **Sessions append-only:** `sessions/` dated evidence is never edited or deleted.
  New dated records supersede old ones.

## 3. Settled decisions

- **2026-11-12 demolition:** the owner rejected the old walnut-shell layout and
  authorized exhaustive removal of the old layout, its build resurrection path,
  current documentation authority, and presentation-pinning tests. The Quality
  workflow was updated under that explicit request; see `OPERATIONS.md` Edit 7.
- **Retired design specs are non-authoritative:** `WEB_VISION_2026-09-13.md`,
  `WEB_VISION_2026-08-10.md`, `UX_ROADMAP.md`, old hero/design rulings, and old
  P2/P3 gate-repin stubs are historical evidence only.
- **Corpus-growth policy (owner, 2026-09-22):** preservation base remains pinned;
  new corpus files are admitted only through `DECLARED_NEW_CORPUS` with dated
  evidence.
- **W1 evidence rulings (2026-09-12, still binding for data):** false witness
  claims are withdrawn, not re-pointed at unverified candidates; OUT-OF-CBETA
  sourcing is human work; source collation does not approve reuse.
- **Botrunner export:** `docs/BOTRUNNER_EXPORT_SCHEMA_2026-09-23.md` remains a
  design contract. The root `export_manifest.json` / `export_ready.json` are known
  stale and fail closed; no exporter is implemented by this demolition.

## 4. Active milestone and current state

- **Active milestone:** layout demolition/reset plus the stub reader port are
  complete on the session branch; next work is porting the remaining research
  surfaces into the owner stub without restoring the retired shell.
- **Corpus:** 17 documents; 12 `complete_selected_witness`; 5 excerpt seeds.
  Content CJK 878,582; all-string CJK 937,884.
- **Source review:** 13 collated, 2 partial/failed, 2 witness-unavailable.
  Authoritative register:
  `sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json` — 17 documents,
  127 flagged source fields.
- **Translations:** 209 corpus slots; 2 verified quotations; 21 matrix registers.
- **Locators:** 4192/4192 case-level; 6 document-level seeds.
- **Lineage/indexes:** 60 masters; 31 terms; 24 gongan entries.
- **Reader port (2026-11-12):** the stub reader renders every validated corpus
  shape present (cases, sections, stanzas, Wumenguan preface/epilogue) with pinyin,
  per-unit locators, provenance notes, and disclosed English registers. Verified
  locally under a Node DOM shim: all 17 works render.
- **Known stub gaps:** Gallery placeholder; Account is a local UI gate only;
  comparative-matrix/gongan research rooms not yet ported; no real-browser CI
  evidence for the stub (local DOM-shim render evidence only).

## 5. Immediate next task

Port functionality into the owner stub in small, owner-visible slices:

1. Reader shape parity — DONE 2026-11-12 (all validated shapes render).
2. Reader disclosure of provenance notes and the five ledgers — DONE 2026-11-12;
   a dedicated ledger/research view remains optional.
3. Port comparative, gongan, and locator/research surfaces as needed.
4. Replace placeholder Gallery/Account behavior or label it clearly.
5. Add real-browser evidence for the new stub, not the retired DOM.

Do not satisfy these by recreating `app.js`/`app.css`/`app_data.js` or the old
smoke-test contract.
