# 🤝 Fake Chan Factory — Project Handoff

> **Repository:** `56eli/translatechan`
> **Public site:** `https://56eli.github.io/translatechan/`
> **Deployment:** native GitHub Pages from `main /docs`, HTTPS
> **Current audit/status:** [`AUDIT.md`](./AUDIT.md) · W1 evidence (authoritative, dated): [`sessions/COLLATION_W1_2026-09-10_CORRECTION.md`](./sessions/COLLATION_W1_2026-09-10_CORRECTION.md) · W1 evidence (historical, append-only): [`sessions/COLLATION_W1_2026-09-09.md`](./sessions/COLLATION_W1_2026-09-09.md)
> **Current gate:** `repo_ready = fail` at **7.2/10**

## 1. Start here

1. Read [`AGENTS.md`](./AGENTS.md).
2. Read [`.orchestrator/STATE.md`](./.orchestrator/STATE.md).
3. Read [`OPERATIONS.md`](./OPERATIONS.md).
4. Work only on the Arena-fixed session branch.
5. AI scoring is retired; no file carries a score to update.

Historical reports are evidence, not current instructions.

## 2. Product and architecture

Fake Chan Factory is a zero-backend static reader for Classical Chinese Chan literature. Its public views are intentionally limited to:

- Reader;
- Comparative Matrix;
- Lineage;
- Gong'an Index;
- Chan Lexicon.

Internal identifiers remain `translatechan_*`, `window.TranslateChan`, and `TRANSLATECHAN_DATA`.

```text
data/*.json
  → scripts/validate_data.py
  → data/project_metrics.json
  → scripts/build_data_bundle.py
  → root assets + docs/ mirror
  → GitHub Pages publishes main/docs
```

There are no runtime JavaScript packages. Playwright is an optional development dependency; Google Fonts remains a browser-time third-party request.

## 3. Current design direction

Owner feedback on 2026-08-11:

- prior Pages page was **too plain and generic**;
- it put **too much focus on Chinese characters**;
- preserve, rather than replace, the **walnut-hall direction**.

Current implementation:

- English-first brand and room navigation;
- dark-walnut editorial/factory hero: “The old texts are real. The translators are not.”;
- English-first room, document, case, lineage, Gong'an, and lexicon headings;
- smaller but intact source-language labels and Reader source text;
- matching social image and `FC` monogram;
- compact English mobile controls;
- progressive disclosure that removes repeated Robo, citation, coverage, Lineage, Lexicon, and search prose from the reading surface;
- no added runtime or image payload.

This direction and the subsequent copy cleanup are implemented. PR #18 merged as `63dfe37`; main Quality and Pages deployment passed. Current real-browser screenshots were unavailable in the audit environment.

## 4. Measured snapshot

```text
corpus=35 | slots=1252 | verified=177 | matrix=21 | locators=148/148
content CJK=104,564 | all-string CJK=110,165
source-review: collated=1 | partial/failed=32 | unavailable=2
w1-evidence: flagged=630 (authoritative 2026-09-10) | historical=622 (2026-09-09) | report-figure-superseded=637
complete=0 | partial=4 | excerpt seeds=31
lineage=34 masters / 30 edges | glossary=31 | gong'an=24
app_data.js=<printed by scripts/build_data_bundle.py at build time>
local first-load estimate≈556 KB gzip before fonts
```

Verified citation reference coverage is **176 / 179**; the remaining **3** references are explicitly pending. Edition verification still does not establish reuse rights.

**W1 source-review disclosure:** the manifest records `collated_to_claimed_witness`, `partial_or_failed_w1_collation`, or `witness_unavailable` for every corpus item, and each status is re-derived from the merged evidence records (historical 2026-09-09 register + authoritative 2026-09-10 correction overlay). This is a containment/remediation state, not a rights decision. The Reader keeps **five separate, always-visible ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review. Containment/remediation state, not a rights decision. Source collation does not approve reuse. Title and name metadata (title_zh, name_zh) is measured and reported separately from source content, so collated_to_claimed_witness is not proof that the excluded metadata fields were collated.

W1 evidence: **35 documents, 630 flagged source fields** (authoritative 2026-09-10 correction register: `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`; historical 2026-09-09 register: `sessions/COLLATION_REGISTER_2026-09-09.json` with 34 documents and 622 flagged fields — the 637 figure in the 2026-09-09 report is **superseded**); 593 of 924 source-content fields collate to their claimed witness, and 22 documents have no collating source-content field at all.

Completion requires explicit `complete_selected_witness` status, satisfied unit targets, and a collated W1 source-review status. After the W1 containment update, no document qualifies as complete selected witness; Wumenguan and Xinxin Ming are represented at 48/48 and 37/37 units respectively but remain partial/failed W1 collation. Biyanlu and Linji remain partial; Platform remains an excerpt seed despite 10/10 represented chapter headings.

## 5. Release blockers

### Content and rights

- All 14 translation-rights records remain `needs_rights_review` or `jurisdiction_review_required`.
- W1 found only one of the 35 documents in the authoritative 2026-09-10 register fully collated to its claimed witness (the historical 2026-09-09 register covered 34 documents); Wumenguan and Xinxin Ming need per-document remediation, while the remaining partial/failed and unavailable states remain contained. Zhaozhou's claimed witness T1987 is the Caoshan record — W1 found the claim false, and re-pointing to X68n1315 is R-A work, deliberately not done here.
- Biyanlu, Linji, Platform, and excerpt seeds need broader field-level review.
- Three lineage profiles lack linked corpus keys (prajnatara, yangqi_fanghui, dahong_zuzheng — frontier scaffolds with no active-corpus occurrence; reviewed 2026-09-09); all 30 lineage edges await exact locators.
- Congronglu remains quarantined; do not restore it without source-pinned field-level collation.

### Engineering and operations

- Playwright skips with success when Chromium is unavailable and is not a required CI job.
- Quality’s artifact diff omits four mirrored assets (see [`OPERATIONS.md`](./OPERATIONS.md) Edit 1).
- Branch protection is unconfirmed because the integration receives 403.
- The full data bundle and all hidden rooms initialize up front.
- Forty-one JS-generated inline styles keep CSP `style-src 'unsafe-inline'` necessary.
- JSON Schema is not executed and non-case field-level validation remains incomplete.

### Presentation

- PR #18 merged after the English-first design and copy-cleanup iterations; real-browser desktop/mobile light/dark evidence remains unavailable.
- SVG social-card support varies; a PNG fallback is recommended.
- Repository description/homepage/topics are empty.

## 6. Fixed behavior and resilience

- Lineage dossier toggles semantic hidden state and focus correctly.
- Platform direct chapter shapes render source text.
- Wumenguan epilogue follows cases; Print/PDF expands all lazy units.
- Wumenguan/Biyanlu labels name their commentator and verse author.
- Persisted state is fail-soft and collapsed-case data is shape-validated.
- Missing/malformed bundles and top-level initialization failures render a visible recovery panel with reload/reset actions.
- CSP now precedes all scripts.

## 7. Quality commands

Run before every code/data push:

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
diff -rq data docs/data
git diff --check
```

Optional browser suite:

```bash
npm ci
npx playwright install chromium
npm run test:browser
```

A skipped browser run is not visual, responsive, accessibility, or release evidence.

## 8. Safe content workflow

For canonical source additions:

1. Name the selected edition/recension and stable locator.
2. Import from an authoritative source; never generate canonical-looking Chinese.
3. Store field-level provenance and source-review status separately from representation, translation, edition-verification, and rights status.
4. Add exact unit locators for each public source field.
5. Keep pinyin/English generation status separate from Chinese source status.
6. Add negative validator fixtures before increasing completion claims.
7. Regenerate metrics/bundle/mirror and run all checks.
8. Obtain human editorial review before claiming source-checked or complete.

For verified modern quotations:

1. Record translator, work, edition, stable reference, wording verification, and `source_id`.
2. Resolve the source in `rights_manifest.json`.
3. Obtain and record a human rights decision.
4. Label wording “edition-verified quotation”; do not infer public-domain permission.

## 9. Repository map

```text
index.html / app.css / app.js / theme-init.js
app_data.js                         # generated data bundle
data/                               # source-of-truth corpus and research indexes
  glossary/                        # 31 Classical Chan & Buddhist lexicon terms
  gongan/                          # 24 Gong'an cross-references index entries
schemas/                            # declarative schema
scripts/                            # validator, build, smoke, browser, migration helpers
sessions/                           # dated audit/implementation evidence
docs/                               # GitHub Pages mirror
OPERATIONS.md                       # owner-controlled CI/GitHub admin edits
response_summary.md                 # disposable current-session summary
```

## 10. Workflow and administration

Agents must not edit `.github/workflows/*` without explicit owner approval. Exact pending changes are documented in [`OPERATIONS.md`](./OPERATIONS.md):

- include `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`, and `docs/og-image.svg` in artifact-diff coverage;
- review/update Action majors;
- verify required Quality checks and branch protection;
- later add a non-skippable browser/accessibility job.

No custom Pages deployment workflow is needed.

## 11. Documentation rule

- [`AUDIT.md`](./AUDIT.md): current verdict and report index.
- [`OPERATIONS.md`](./OPERATIONS.md): owner-controlled CI/GitHub administration edits.
- [`response_summary.md`](./response_summary.md): disposable user-facing summary.
- `sessions/*.md`: dated immutable evidence.

Never append a full session narrative here; link the dated report.

The repository scoreboard (`SCOREBOARD.md` + `.scoreboard/`) was retired
by this PR; orchestrator oversight replaces it.

## 12. Merge and deployment status

PR [#18](https://github.com/56eli/translatechan/pull/18) merged into `main` as `63dfe379e026b829349b1ff78752c771e5c7e5d3`. Main Quality run `31490146548` and Pages deployment `31490145334` passed; Pages reports `built` with HTTPS enforced.
