# Full Senior-Developer & Web-Design Audit — 2026-08-11

> **Session:** `arena/019ff089-translatechan` · **Baseline:** `27ca224` (`main`, merged PR #17) · **Audited change:** `d2e9887`
> **Scope:** product fit, information architecture, visual system, responsive UX, accessibility, application architecture, code quality, data integrity, security/privacy, performance, tests, CI/CD, Pages deployment, SEO, repository hygiene, and documentation.
> **Owner feedback collected:** the Pages site felt **too plain and generic** and placed **too much visual emphasis on Chinese characters**; the owner selected **preserve the current walnut-hall direction** rather than replacing it.

## 1. Executive verdict

**The repository is structurally sound and unusually honest about translation provenance, but it is not release-ready under its own gate: audited score 7.2/10, `repo_ready = fail`.**

No new P0 defect was found. The prior Congronglu P0 remains contained. This pass fixed the most visible design mismatch by turning the restrained-but-generic walnut layout into an English-first editorial/factory identity while keeping source Chinese available where it belongs: the Reader. It also closed the missing-bundle blank-screen failure and corrected CSP ordering.

The remaining release blockers are not cosmetic:

1. all 14 quotation-rights records still require human review or jurisdiction review;
2. real-browser execution is skippable and could not run in this environment;
3. CI still omits mirrored assets and has no required browser/accessibility job;
4. source-field review remains incomplete beyond the two complete selected witnesses;
5. the new visual direction still needs owner review in a real browser.

## 2. Measured state

```text
Corpus documents                    35
Translation slots                   1,252
Edition-verified quotations         177
Matrix registers                    21
Case-level locators                 148 / 148
Complete selected witnesses         2
Partial selected witnesses          2
Excerpt seeds                       31
Content CJK characters              103,723
All-string CJK characters           109,185
Lineage masters / edges             34 / 30
Glossary / Gong'an entries          31 / 24
app_data.js                         1,594,154 B raw / 497,352 B gzip-9
First-load local gzip estimate      ~556 KB before fonts
app.js / app.css                    3,120 / 2,537 lines
Generated inline style attributes   41 (index.html: 0)
Lineage validator warnings          6 empty linked_corpus_keys
Rights review status                12 needs review / 2 jurisdiction review
Lineage edge verification           30 traditional links pending exact locator
```

Root and `/docs` assets and data are synchronized. GitHub Pages reports `built`, publishes `main /docs`, and enforces HTTPS.

## 3. Product and visual design

### What was wrong

The prior implementation followed the walnut-hall specification literally but not persuasively. Its first impression was a small Chinese title, a thin rule, a list of chips, and quiet paper surfaces. The result was competent but generic. Chinese text dominated the brand, room navigation, document headings, case headings, lineage nodes, Gong'an rows, and lexicon headwords—even when the user was trying to navigate an English interface.

### Implemented response

- Replaced the passive intro strip with an asymmetric dark-walnut identity panel and the plain-language hook **“The old texts are real. The translators are not.”**
- Added an `FC` cut-corner monogram, edition numbering, proof-stamp motif, source/register statistics, structural grain, and stronger editorial typography without adding image weight or animation.
- Made navigation English-first (`Read`, `Compare`, `Lineage`, `Cases`, `Terms`) while retaining smaller Chinese room labels.
- Made static room headings, Reader document headings, case/chapter/section headings, lineage directory names, Gong'an titles, and lexicon definitions English-first.
- Replaced Chinese characters inside lineage graph nodes with readable Romanized-name monograms.
- Reduced default source-Chinese scale from 1.35rem to 1.2rem and increased English translation text to 1rem; source Chinese remains present and semantically marked with `lang="zh"`.
- Replaced glyph-only mobile controls with compact English labels (`Bi`, `All`, `Zh`, `Py`, `#`).
- Rebuilt the Open Graph image around the same English-first identity.
- Preserved the five-room scope, dark walnut shell, source honesty, rice-paper palette, zero-backend architecture, and serious reading flow.

### Current design assessment

The implementation now has a distinct product idea and a clearer hierarchy. It no longer asks decorative Chinese to carry the identity by itself. The source language remains central in reading content, where it is meaningful rather than ornamental. The score is capped at 7/10 until desktop/mobile light/dark screenshots and owner approval exist.

## 4. UX and accessibility

### Strengths

- Hash routing, deep links, Back/Forward scroll restoration, corpus persistence, lazy long-text rendering, complete Print/PDF expansion, search normalization, and source disclosure are mature.
- Navigation uses the ARIA tabs pattern with roving `tabindex` and keyboard movement.
- Reader modes and filters expose pressed state; dossier open/close is focus-managed; Escape paths exist.
- Programmatic scrolls honor `prefers-reduced-motion`.
- Dynamic source text uses `lang="zh"`; the new hierarchy does not remove source access.
- Mobile Reader controls are hidden outside the Reader and use safe-area padding.

### Remaining gaps

- Real-browser and screen-reader verification remains absent in this environment.
- Case collapse buttons do not expose `aria-controls` relationships.
- Settings use ARIA radio roles but do not implement full radio-group arrow-key behavior.
- Citation/term/robo popovers are tested structurally, not against a screen reader.
- The new large hero and responsive navigation need measured tablet/mobile screenshot review.
- Browser tests cover overflow at 1280×900 and 390×844 but not the 768/1024 boundary edges or dark mode.

## 5. Application architecture and code quality

### Strengths

- Deterministic pipeline: source JSON → semantic validator → generated metrics → data bundle → byte-identical `/docs` mirror.
- No runtime JavaScript dependencies and no backend.
- Strong escaping discipline around dynamic HTML and no inline event-handler attributes.
- Data contracts distinguish verified quotation, reconstruction, and AI draft; citation rights are separate from edition verification.
- Storage access is fail-soft and malformed collapsed-case state is shape-validated.
- Smoke tests exercise every corpus renderer and core interaction paths.

### Debt

- `app.js` (3,120 lines), `app.css` (2,537), validator (1,216), and smoke suite (1,070) are still monoliths.
- `app.js` retains 41 generated inline-style attributes, keeping CSP `style-src 'unsafe-inline'` necessary.
- All five hidden views render during startup; lineage SVG and catalogue/dictionary markup are generated before activation.
- Data is one 1.59 MB raw global classic-script bundle, so opening a single excerpt downloads every corpus and index.
- There are 23 `innerHTML` assignment sites; escaping is currently disciplined, but the attack surface merits continued regression tests.
- Comments and documentation from several historical design phases remain mixed into current source.

## 6. Error handling and resilience

This pass closed a real gap:

- startup now verifies the bundle has corpus, manifest, and matrix structures;
- missing/malformed data displays a visible `role="alert"` recovery panel;
- users can reload or reset display preferences without developer tools;
- top-level initialization failures use the same recovery path;
- smoke tests guard the recovery implementation structurally.

Remaining limitation: a JavaScript parse failure cannot invoke an in-script boundary, and browser/network failure behavior still needs a real-engine test.

## 7. Security and privacy

### Good

- CSP now appears before `theme-init.js`, so it governs every script resource.
- `script-src 'self'`; no inline scripts, inline handlers, `eval`, or `new Function`.
- Dynamic data is escaped and smoke-tested with poisoned fields.
- npm audit reports zero known vulnerabilities.
- No credentials are required or stored by the static app.

### Remaining

- Generated inline presentation requires `style-src 'unsafe-inline'`.
- Google Fonts creates browser-time third-party requests and prevents a fully self-contained/offline claim.
- No `SECURITY.md` vulnerability-reporting path exists.
- Dependabot alerts are disabled; secret-scanning visibility is unavailable to this integration.
- The public dual-license file is not recognized by GitHub’s license API (`NOASSERTION`), which can confuse reuse tooling.

## 8. Data, content, and research integrity

### Strong controls

- Validator-enforced completion status prevents raw N/N representation from certifying a complete witness.
- Active Congronglu placeholders remain removed and anti-placeholder checks remain in force.
- 148/148 case-level locators resolve; unit-level pilots exist.
- Every translation slot uses an explicit status record.
- Edition verification and rights status remain separate in data and UI.

### Release blockers

- Rights manifest: 12 `needs_rights_review`, 2 `jurisdiction_review_required`; none is human-cleared under the project workflow.
- Biyanlu’s 100 represented cases remain a partial selected witness because nested source-field review is incomplete.
- Platform’s 10/10 chapter headings remain excerpts, not completion.
- All 30 lineage edges remain `traditional_link_pending_exact_locator`.
- Six masters have empty `linked_corpus_keys` and produce validator warnings.
- Non-case field-level source completeness and JSON Schema execution remain weaker than the case validator.

## 9. Performance

The local first-load gzip estimate is approximately 556 KB before Google Fonts. This is acceptable for a research reader but expensive on mobile for a first visit. Compact JSON and lazy case DOM rendering help, but they do not reduce the initial bundle transfer or parse.

Recommended next performance sequence:

1. measure cold-load LCP/INP/parse time in real Chromium;
2. render secondary rooms only on first activation;
3. split corpus documents from indexes and load the selected document on demand;
4. set a CI budget only after representative browser measurements exist.

Do not modularize solely to reduce source-file line counts; prioritize transfer and activation cost.

## 10. Tests, CI/CD, and deployment

### Passing

- Python syntax
- semantic data validation
- deterministic build
- root/docs data comparison
- 35-document dependency-free renderer smoke
- npm audit
- HTML parser and Markdown relative-link scan
- branch Quality workflow (`d2e9887`)

### Gaps

- Playwright remains optional and exits 0 when Chromium is missing.
- Chromium download and apt installation both failed due sandbox network access; browser execution is therefore **SKIP**, not evidence.
- Quality’s generated-artifact diff omits `docs/theme-init.js`, `robots.txt`, `sitemap.xml`, and `og-image.svg`.
- Browser, accessibility, HTML/link, and performance checks are not required in CI.
- Current Action majors produced a runtime-deprecation warning in the prior audit; exact owner-approved changes remain documented.
- Branch-protection state is unreadable (403) and no visible ruleset was returned.

No workflow file was edited because repository policy requires explicit owner approval.

## 11. SEO, GitHub Pages, and repository presentation

### Good

- canonical URL, description, Open Graph/Twitter metadata, robots, sitemap, HTTPS, and synchronized Pages artifact exist;
- Open Graph artwork now matches the live English-first identity;
- hash routes avoid server-side deep-link 404s.

### Gaps

- Repository description, homepage, and topics are empty; an attempted metadata update was blocked by the integration with HTTP 403.
- GitHub reports no custom 404 page.
- SVG Open Graph support varies by social platform; a 1200×630 PNG fallback would be safer.
- Repository-level license detection returns `NOASSERTION` because the project combines software and content terms in one file.
- Historical root audits remain noisy despite the `sessions/` convention.

## 12. Severity-ranked actions

### P1 — release blockers

1. Complete human quotation-rights and jurisdiction decisions.
2. Obtain explicit owner visual approval of the new desktop/mobile light/dark result.
3. Continue field-level source review for Biyanlu, Platform, Linji, and excerpt seeds.

### P2 — next engineering work

4. Add an owner-approved non-skippable browser/accessibility CI job and complete mirrored-artifact coverage.
5. Remove the 41 generated inline styles, then remove CSP `unsafe-inline` if feasible.
6. Lazy-render secondary rooms and measure before splitting the data bundle.
7. Add non-case field validators/negative fixtures and execute or narrow the JSON Schema contract.

### P3 — polish and operations

8. Add `SECURITY.md`, repository metadata, and a social-preview PNG fallback.
9. Resolve six lineage corpus-link warnings and exact locators for 30 edges.
10. Consolidate historical root audit documents into the established archive convention.

## 13. Audited scorecard

| Aspect | Score | Status |
|---|---:|---|
| Purpose/scope | 9 | healthy |
| README/onboarding | 7 | healthy |
| Repository organization | 7 | needs work |
| Code hygiene | 7 | needs work |
| Architecture | 7 | needs work |
| Maintainability | 7 | needs work |
| Type safety/validation | 7 | needs work |
| Error handling | **7** | improved; needs browser evidence |
| Dependency hygiene | 8 | healthy |
| Tests | 7 | browser can skip |
| CI/CD | 6 | blocked on owner-approved workflow work |
| Security/privacy | **8** | improved; inline styles/fonts remain |
| Performance | 7 | needs measurement |
| GitHub Pages presentation | **7** | redesigned; owner approval pending |
| UX/usability | 7 | needs browser review |
| Accessibility | 7 | needs real-engine/screen-reader review |
| Content quality | 6 | rights and field review pending |
| Feature completeness | 7 | intended five-view scope works |
| Deployment readiness | 6 | release blockers remain |
| Agent readiness | **8** | current audit/handoff synchronized |
| Task hygiene | 7 | historical root clutter remains |
| Auditability | 8 | healthy |

**Weighted effective score: 7.2/10.** The prior 7.6 summary was arithmetically inconsistent with its own aspect table (which calculated to 6.9); this audit corrects that drift rather than preserving an unsupported score.

## 14. Verification record

```text
python3 -m py_compile scripts/*.py      PASS
python3 scripts/validate_data.py        PASS; 6 documented lineage warnings
python3 scripts/build_data_bundle.py    PASS; root/docs synchronized
node scripts/smoke_test.mjs             PASS; 35 renderers, 0 crashes
npm audit --package-lock-only           PASS; 0 vulnerabilities
diff -rq data docs/data                 PASS
git diff --check                        PASS
HTML parser                             PASS
Markdown relative-link scan             PASS after one historical-link repair
GitHub branch Quality                   PASS (run 31486895570)
npm run test:browser                    SKIP; Chromium unavailable
Playwright browser download             FAIL; network ECONNRESET
apt Chromium installation               FAIL; package network unavailable
```

A green structural suite does not substitute for current screenshots, screen-reader verification, human content review, rights decisions, or owner approval.
