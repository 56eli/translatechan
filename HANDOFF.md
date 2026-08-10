# Fake Chan Factory — Project Handoff

> **Repository:** `56eli/translatechan`
> **Public site:** `https://56eli.github.io/translatechan/`
> **Deployment:** native GitHub Pages from `main /docs`, HTTPS
> **Current fixed branch:** `arena/019fecb1-translatechan`
> **Current audit:** [`sessions/AUDIT_RESPONSE_2026-08-10_019fecb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019fecb1.md)
> **Current gate:** `repo_ready = fail` (6.6/10)

## 1. Start here

1. Read [`AGENTS.md`](./AGENTS.md).
2. Read [`.scoreboard/scoreboard.yml`](./.scoreboard/scoreboard.yml).
3. Read [`.scoreboard/agent-handoff.md`](./.scoreboard/agent-handoff.md).
4. Read [`.scoreboard/manual-workflow-edits.md`](./.scoreboard/manual-workflow-edits.md).
5. Work only on the Arena-fixed `arena/<session>-translatechan` branch.
6. Never infer or change a `user_score`.

Historical session files are evidence, not current instructions.

## 2. Product and architecture

**Fake Chan Factory** is a zero-backend static reader for Classical Chinese Chan literature. Its intentionally narrow public views are:

- Bilingual Reader;
- Comparative Matrix;
- Lineage Tree;
- Gong'an Index;
- Chan Lexicon.

Internal identifiers remain `translatechan_*`, `window.TranslateChan`, and `TRANSLATECHAN_DATA`.

```text
data/*.json
  → scripts/validate_data.py
  → data/project_metrics.json
  → scripts/build_data_bundle.py
  → app_data.js + docs/app_data.js
  → root assets/data mirrored into docs/
  → GitHub Pages publishes main/docs
```

There is no browser runtime package dependency. Playwright is an optional development dependency; Google Fonts is a browser-time third-party dependency.

## 3. Current measured snapshot

```text
corpus=35 | slots=1252 | verified=177 | matrix=21 | locators=148/148
content CJK=103,723 | all-string CJK=109,185
complete=2 | partial=2 | excerpt seeds=31
lineage=34 masters | glossary=31 terms | gong'an=24 entries
bundle=1,594,154 raw bytes | 497,606 gzip-9
```

Verified citation reference coverage is **176 / 179**; the remaining **3** are pending. Every one of the 14 rights-manifest sources still requires human rights/jurisdiction review. Edition verification is not a reuse license.

Only Wumenguan and Xinxin Ming are `complete_selected_witness`. Biyanlu and Linji are partial; Platform is an excerpt seed despite 10/10 represented headings.

## 4. Current release blockers

1. **Lineage directory:** `#lineage-content-target` ships with `hidden`; its mode handler changes only inline display. Remove/restore semantic hidden state and add real-browser coverage.
2. **Rights/references:** complete 14 human rights decisions and resolve or downgrade 3 pending verified references.
3. **Non-case validation:** JSON Schema is inert and non-case unit records are shallowly checked; malformed/empty units can pass.
4. **Browser/a11y evidence:** Playwright exits zero on skip and is not in CI; current screenshots, dark/tablet coverage, axe, and owner approval are absent.
5. **Accessibility/responsive:** pinyin/Lineage mode states, tooltip relationships, radio behavior, stale collapse labels, search announcements, and mobile Lineage grid need work.
6. **Fatal state:** `.error-boundary-card` exists only in CSS; no runtime initialization boundary renders it.
7. **Operations:** four mirror paths are absent from CI diff; action majors emit Node 20 deprecation warnings; required branch protection is unverified.
8. **Editorial depth:** 33 document-level locator migrations, Biyanlu/Linji field review, 30 lineage edges, and 34 profile reviews remain.
9. **Contained P0:** do not reintroduce Congronglu without authoritative T48n2004 TEI, field-level provenance, negative fixtures, and human review.

## 5. Quality commands

Run before every code/data push:

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
diff -rq data docs/data
```

If data legitimately changed, run `python3 scripts/validate_data.py --write-metrics` before the normal validator.

Optional real browser:

```bash
npm ci
npx playwright install chromium
npm run test:browser
```

A browser-script exit 0 is not release evidence if output says **SKIPPED**.

## 6. Safe content workflow

For canonical source additions:

1. Name the selected edition/recension and stable locator.
2. Import from an authoritative source; never generate canonical-looking Chinese from memory or AI.
3. Store field-level provenance/collation status.
4. Add exact unit locators for every public source field.
5. Keep pinyin/English generation separate from canonical-Chinese status.
6. Add negative validator fixtures before increasing completion claims.
7. Regenerate metrics/bundle/mirror and run all checks.
8. Obtain human editorial review before claiming source-checked or complete.

For verified modern quotations, record translator/work/edition/reference/wording verification/source ID, resolve that ID in the rights manifest, and obtain a human rights decision. Online availability is not a license.

## 7. Repository map

```text
index.html / app.css / app.js / theme-init.js
app_data.js                         # generated browser data bundle
data/
  corpus/                           # 35 active source documents
  corpus_manifest.json
  canonical_locators.json
  project_metrics.json
  editorial/                       # source review queues
  glossary/                        # 31 Classical Chan & Buddhist lexicon terms
  gongan/                          # 24 Gong'an cross-references index entries
  lineage/                         # profiles, vocabulary, verification, queue
  translations/                    # matrix, profiles, provenance, rights
schemas/translatechan-data.schema.json
scripts/
  validate_data.py
  build_data_bundle.py
  smoke_test.mjs
  browser_test.mjs
  segment_classical.py
  migrate_translations.py
sessions/                           # dated evidence
docs/                               # GitHub Pages mirror
.scoreboard/                        # current score, history, handoff, workflow notes
```

## 8. Deployment and GitHub administration

GitHub Pages reports `built`, source `main /docs`, HTTPS enforced. Baseline main Quality and Pages runs passed at `27ca224`.

Workflow changes require explicit user approval. Exact required edits are in [`.scoreboard/manual-workflow-edits.md`](./.scoreboard/manual-workflow-edits.md):

- cover `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`, and `docs/og-image.svg` in generated-diff checks;
- review/update deprecated Node 20 action majors;
- have an administrator verify/require Quality on `main`;
- later add a non-skippable browser/accessibility path.

## 9. Documentation rule

- `AUDIT.md`: current verdict, blockers, checks, session index.
- `SCOREBOARD.md` and `.scoreboard/scoreboard.yml`: current scores/planning.
- `.scoreboard/agent-handoff.md`: current branch/session handoff.
- `response_summary.md`: disposable session summary, overwritten each session.
- `sessions/*.md`: dated immutable evidence.
- README/ROADMAP/RESEARCH_RELEASE_PLAN: public/project plans; update current-state claims together.

## 10. Recommended next sequence

1. Fix Lineage directory hidden state, mode semantics, and phone grid; browser-test it.
2. Implement fatal bundle recovery.
3. Add strict per-shape non-case validation and negative fixtures.
4. Add non-skippable browser/a11y/overflow evidence and obtain owner visual approval.
5. Complete rights/reference decisions and source review.
6. Apply owner-approved operations changes.
7. Clean remaining inline styles/dead CSS, then measure lazy room/data loading.

## 11. Stable contracts

- Public brand: Fake Chan Factory; internal identifiers remain `translatechan_*`.
- Public views: Reader, Matrix, Lineage, Gong'an, Lexicon only.
- No generated canonical-looking Chinese.
- N/N representation never establishes completion.
- Edition verification and rights approval are separate.
- No workflow edits without explicit user approval.
- No user-score changes without explicit numeric user instruction.
