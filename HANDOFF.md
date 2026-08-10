# 🤝 Fake Chan Factory — Project Handoff

> **Repository:** `56eli/translatechan`
> **Public site:** `https://56eli.github.io/translatechan/`
> **Deployment:** native GitHub Pages from `main /docs`, HTTPS
> **Latest audit:** [`sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md) · [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md)
> **Latest design:** [gap plan](./sessions/WEB_DESIGN_GAP_PLAN_2026-08-10.md) · [Phase A+B implementation](./sessions/DESIGN_PHASE_AB_2026-08-10.md) · [Phase C+D implementation](./sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md)
> **Current gate:** `repo_ready = fail` (7.6/10; PR #17 merged into main with all five rooms in walnut Chan hall layout, responsive breakpoints unified to 1024px/768px, storage hotfix applied; screenshot verification remains)

## 1. Start here

1. Read [`AGENTS.md`](./AGENTS.md).
2. Read [`.scoreboard/scoreboard.yml`](./.scoreboard/scoreboard.yml).
3. Read [`.scoreboard/agent-handoff.md`](./.scoreboard/agent-handoff.md).
4. Read [`.scoreboard/manual-workflow-edits.md`](./.scoreboard/manual-workflow-edits.md).
5. Work only on the Arena-fixed `arena/<session>-translatechan` branch.
6. Never infer or change a `user_score`.

Historical session outcomes live under [`sessions/`](./sessions/) and in Git history. They are evidence, not current instructions.

## 2. Product and architecture

**Fake Chan Factory** is a zero-backend static reader for Classical Chinese Chan literature. Its public views are intentionally limited to:

- Bilingual Reader;
- Comparative Matrix;
- Lineage Tree;
- Gong’an Index;
- Chan Lexicon.

Internal identifiers remain `translatechan_*`, `window.TranslateChan`, and `TRANSLATECHAN_DATA` for continuity.

Build flow:

```text
data/*.json
  → scripts/validate_data.py
  → data/project_metrics.json
  → scripts/build_data_bundle.py
  → app_data.js + docs/app_data.js
  → root assets/data mirrored into docs/
  → GitHub Pages publishes main/docs
```

The browser has no runtime JavaScript package dependency. `playwright` is an optional development dependency for the real-browser suite. Google Fonts remains a browser-time third-party dependency.

## 3. Current measured snapshot

```text
corpus=35 | slots=1252 | verified=177 | matrix=21 | locators=148/148
content CJK=103,723 | all-string CJK=109,185
lineage=34 masters | glossary=31 terms | gong'an=24 entries
bundle=1,594,154 raw bytes | approximately 498 KB gzip-9
```

Verified citation reference coverage is **176 / 179**; the remaining **3** reference fields are explicitly pending. This does not mean rights review is complete: every rights-manifest source is still `needs_rights_review` or `jurisdiction_review_required`.

Completion now requires explicit `complete_selected_witness` status plus satisfied unit targets. Only Wumenguan and Xinxin Ming qualify. Biyanlu and Linji remain `partial_selected_witness`; Platform remains an excerpt seed despite 10/10 represented chapter headings.

## 4. Release blockers

### Contained P0 — Congronglu source integrity

The entire Congronglu seed, its locator claims, and four obsolete ingestion snapshots were removed from the active tree. Follow-up comparison with authoritative CBETA `T/T48/T48n2004.xml` showed that even the five records previously labeled collated had wrong case headings and page claims. See [`sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md`](./sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md). Do not reintroduce it without source-pinned TEI ingestion and field-level collation tests.

### Remaining P1/P2 blockers

- Design: Phase A+B shell/Reader is implemented; continue visual-system consolidation and the Matrix/Lineage/Gong’an/Lexicon redesign, then screenshot-based owner approval.
- Rights: all 14 sources remain pending; UI wording is corrected, but human decisions are not complete.
- Field-level source coverage and human review remain incomplete beyond the new document-level completion statuses.
- Responsive/accessibility, error-state, and operations work remains.

### Fixed public behavior

- Lineage dossier toggles semantic hidden state and receives focus.
- Six direct Platform chapter shapes render source text and disclosure.
- Wumenguan epilogue follows cases; Print/PDF expands all lazy units.
- Wumenguan/Biyanlu labels name their commentator and verse author.
- Smoke and Playwright regressions cover each path.

### Next correctness layer

- Responsive 1100/960 breakpoint mismatch and sticky toolbar/header overlap.
- Mobile Reader controls appear on every view.
- Active color contrast and ARIA pressed/radio/tooltip relationships need correction.
- JSON Schema is present but not executed; non-case source shapes are weakly validated.
- Browser title/count expectations are corrected, but the suite still exits zero when Chromium is unavailable.

See the full audit for evidence and exit criteria.

## 5. Quality commands

Run before every code/data push:

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
diff -rq data docs/data
```

If data legitimately changed:

```bash
python3 scripts/validate_data.py --write-metrics
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
diff -rq data docs/data
```

Optional real browser:

```bash
npm ci
npx playwright install chromium
npm run test:browser
```

**Important:** today, the browser suite prints SKIP and exits 0 when Chromium is unavailable. A skipped run is not release evidence. The dependency-free smoke test proves structural rendering/no-crash behavior, not visual correctness or content truth.

## 6. Safe content workflow

For any canonical source addition:

1. Name the selected edition/recension and stable locator.
2. Import from an authoritative source; do not write canonical-looking Chinese from memory or an AI prompt.
3. Store field-level provenance/collation status for pointer, case, commentary, verse, chapter, or stanza.
4. Add exact unit locators for every public source field.
5. Keep pinyin and English generation status distinct from canonical Chinese status.
6. Add negative validator fixtures before increasing completion claims.
7. Regenerate metrics/bundle/mirror and run all checks.
8. Obtain human editorial review before claiming source-checked or complete.

The four obsolete autonomous/content-wave ingestion snapshots were deleted during containment; Git history preserves them for forensics. Replace them with source-pinned tooling rather than restoring or replaying them.

For a verified modern quotation:

1. Record exact translator, work, edition, stable reference, wording verification, and `source_id`.
2. Resolve `source_id` in `data/translations/rights_manifest.json`.
3. Obtain and record an editorial rights decision; online availability is not a license.
4. Label the public status “edition-verified quotation,” not “public domain,” unless the rights record independently supports that claim for the distribution jurisdiction.

## 7. Repository map

```text
index.html / app.css / app.js / theme-init.js
app_data.js                         # generated browser data bundle
data/
  corpus/                           # 35 active source documents
  corpus_manifest.json             # reader order + count targets
  canonical_locators.json          # document/case locator registry
  project_metrics.json             # generated deterministic metrics
  editorial/                       # traceability queue
  glossary/                        # 31 Classical Chan & Buddhist lexicon terms
  gongan/                          # 24 Gong'an cross-references index entries
  lineage/                         # masters, vocabulary, verification, review queue
  translations/                    # matrix, profiles, provenance, rights
schemas/translatechan-data.schema.json
scripts/
  validate_data.py                 # authoritative semantic validator
  build_data_bundle.py             # bundle + docs mirror
  smoke_test.mjs                   # dependency-free structural regression
  browser_test.mjs                 # optional real-browser suite
  segment_classical.py             # offline segmentation helper
  migrate_translations.py          # historical idempotent shape migration
sessions/                           # dated audit/session evidence
docs/                              # GitHub Pages mirror
.scoreboard/                        # current machine score, history, handoff, manual edits
```

## 8. Deployment and GitHub administration

GitHub Pages currently reports `built`, source `main /docs`, HTTPS enforced. Quality and Pages runs passed at audited main commit `3ef7732`.

Workflow edits require explicit user approval under project policy. The current generated-artifact diff list omits:

```text
docs/theme-init.js
docs/robots.txt
docs/sitemap.xml
docs/og-image.svg
```

Exact replacement YAML is in [`.scoreboard/manual-workflow-edits.md`](./.scoreboard/manual-workflow-edits.md). The final branch run also warned that `actions/checkout@v4`, `setup-python@v5`, and `setup-node@v4` target deprecated Node 20 action runtimes; the manual file records a reviewed-major update task. It also asks an administrator to verify/enable required Quality checks on `main`; this audit’s integration received 403 when reading classic protection state, so protection status is not independently confirmed.

## 9. Documentation rule

- [`AUDIT.md`](./AUDIT.md): current verdict, blockers, checks, session index only.
- [`SCOREBOARD.md`](./SCOREBOARD.md) and `.scoreboard/scoreboard.yml`: current scores and planning evidence.
- `.scoreboard/agent-handoff.md`: current branch/session handoff.
- `response_summary.md`: disposable session summary, overwritten each session.
- `sessions/*.md`: dated immutable evidence.
- README/ROADMAP/RESEARCH_RELEASE_PLAN: public/project plans; update current-state claims together after metrics/editorial status changes.

Never append a full session narrative to this file. Link the dated report instead.

## 10. Current session

Session `arena/019febb1-translatechan` completed the audit, containment, public-behavior fixes, design plan, and owner-approved shell/Reader Phase A+B. Next: visual-system consolidation and the four secondary rooms, then screenshot/accessibility evidence and owner approval.

## 11. PR / merge handoff

PR [#15](https://github.com/56eli/translatechan/pull/15) — **“fix: restore content trust and redesign the walnut Reader”** — merged into `main` on 2026-08-10 as `26feff0dbc4286da0c7a1e4c46ff341288b9d0f3`.

Post-merge status:

- main Quality: success;
- GitHub Pages build/deploy: success;
- live URL: `https://56eli.github.io/translatechan/`;
- current live content confirmed with 35 active works and the new gate/Reader output.

The owner requested merge specifically so the real Pages deployment can be reviewed. The next agent must wait for that visual feedback before starting design Phase C/D. The vision remains partially implemented; do not declare completion without Phase E evidence and explicit owner approval.
