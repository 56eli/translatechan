# 🤝 Fake Chan Factory — Project Handoff

> **Repository:** `56eli/translatechan`
> **Public site:** `https://56eli.github.io/translatechan/`
> **Deployment:** native GitHub Pages from `main /docs`, HTTPS
> **Current audit:** [`sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md`](./sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md)
> **Current gate:** `repo_ready = fail` at **7.2/10**

## 1. Start here

1. Read [`AGENTS.md`](./AGENTS.md).
2. Read [`.scoreboard/scoreboard.yml`](./.scoreboard/scoreboard.yml).
3. Read [`.scoreboard/agent-handoff.md`](./.scoreboard/agent-handoff.md).
4. Read [`.scoreboard/manual-workflow-edits.md`](./.scoreboard/manual-workflow-edits.md).
5. Work only on the Arena-fixed session branch.
6. Never infer or change a `user_score`.

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

Owner feedback on 2026-08-11 (two passes recorded):

1. First pass: prior Pages page was **too plain and generic** with **too much focus on Chinese characters**; preserve the walnut-hall direction. PR #18 (English-first walnut redesign) merged on that instruction.
2. Second pass (this session): the site improved, but **reading surfaces felt unintegrated and shallow**, and the hero banner **“The old texts are real. The translators are not.” read as a horrible popup**. Direction: **full Chan-hall immersion** — the page itself is the hall.

Current implementation:

- fixed walnut wall with timber posts and lamp falloff behind everything; night-hall variant in dark theme;
- sticky top beam carries the `FC` monogram, English room plaques, search, theme, and settings;
- one paper sheet per room (`.paper-sheet` / `.room-sheet`) with cut edges and hall shadows;
- the corpus sidebar is a wooden shelf with pinned paper slips; the active work is the pulled slip with a cinnabar edge;
- the Reader toolbar is the sheet lintel and sticks flush under the beam; typography-first controls replace bordered pills;
- document headbands use a double rule, shelf-mark breadcrumb docket, hairline-separated colophon ledger, and one small red seal slip per room;
- folio units separate with a hairline + gold lozenge dinkus; source text reads at 1.95 line height; commentary/verse sit as flat ruled insets;
- the mobile bottom bar is a walnut tray; print flattens sheets to white;
- retired surfaces carry smoke guards so the popup/tagline cannot return (index.html, app.js, app.css, og-image.svg);
- no added runtime or image payload.

**Browser evidence exists now.** Arena sandboxes cannot reach Playwright/apt font sources, but `npm install @sparticuz/chromium puppeteer-core` delivers a working headless Chromium via the npm registry; inflate its `al2023.tar.br` into `/tmp` and export `LD_LIBRARY_PATH=/tmp/al2023/lib`, convert npm-hosted Noto Serif SC woff2 subsets with `wawoff2` into `/tmp/fonts/ttf`, and point `FONTCONFIG_FILE` there. Ten states (desktop/mobile, light/dark, all five rooms) were screenshot-reviewed this session and drove five fixes. Screenshots are session scratch (`.arena/`, gitignored), not committed artifacts.

## 4. Measured snapshot

```text
corpus=35 | slots=1252 | verified=177 | matrix=21 | locators=148/148
content CJK=103,723 | all-string CJK=109,185
complete=2 | partial=2 | excerpt seeds=31
lineage=34 masters / 30 edges | glossary=31 | gong'an=24
app_data.js=1,594,154 raw bytes / 497,352 gzip-9
local first-load estimate≈556 KB gzip before fonts
```

Verified citation reference coverage is **176 / 179**; the remaining **3** references are explicitly pending. Edition verification still does not establish reuse rights.

Completion requires explicit `complete_selected_witness` status plus satisfied unit targets. Only Wumenguan and Xinxin Ming qualify. Biyanlu and Linji remain partial; Platform remains an excerpt seed despite 10/10 represented chapter headings.

## 5. Release blockers

### Content and rights

- All 14 translation-rights records remain `needs_rights_review` or `jurisdiction_review_required`.
- Biyanlu, Linji, Platform, and excerpt seeds need broader field-level review.
- Six lineage masters lack linked corpus keys; all 30 lineage edges await exact locators.
- Congronglu remains quarantined; do not restore it without source-pinned field-level collation.

### Engineering and operations

- Playwright skips with success when Chromium is unavailable and is not a required CI job.
- Quality’s artifact diff omits four mirrored assets.
- Branch protection is unconfirmed because the integration receives 403.
- The full data bundle and all hidden rooms initialize up front.
- Forty-one JS-generated inline styles keep CSP `style-src 'unsafe-inline'` necessary.
- JSON Schema is not executed and non-case field-level validation remains incomplete.

### Presentation

- Owner requested merge after the English-first design and copy-cleanup iterations; real-browser desktop/mobile light/dark evidence remains unavailable.
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
3. Store field-level provenance/collation status.
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
.scoreboard/                        # current score, history, handoff, manual operations
response_summary.md                 # disposable current-session summary
```

## 10. Workflow and administration

Agents must not edit `.github/workflows/*` without explicit owner approval. Exact pending changes are documented in [`.scoreboard/manual-workflow-edits.md`](./.scoreboard/manual-workflow-edits.md):

- include `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`, and `docs/og-image.svg` in artifact-diff coverage;
- review/update Action majors;
- verify required Quality checks and branch protection;
- later add a non-skippable browser/accessibility job.

No custom Pages deployment workflow is needed.

## 11. Documentation rule

- [`AUDIT.md`](./AUDIT.md): current verdict and report index.
- [`SCOREBOARD.md`](./SCOREBOARD.md): human-readable current scores.
- [`.scoreboard/scoreboard.yml`](./.scoreboard/scoreboard.yml): machine-readable score source.
- [`.scoreboard/agent-handoff.md`](./.scoreboard/agent-handoff.md): current branch/session handoff.
- [`response_summary.md`](./response_summary.md): disposable user-facing summary.
- `sessions/*.md`: dated immutable evidence.

Never append a full session narrative here; link the dated report.

## 12. Current pull request

PR [#18](https://github.com/56eli/translatechan/pull/18) is **merged** (baseline `63dfe37`). The current session branch is `arena/019ff0c0-translatechan` (Chan-hall immersion pass); open a PR into `main` when the owner approves the new direction.
