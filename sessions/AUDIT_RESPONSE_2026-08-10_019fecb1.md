# Senior Developer & Web Designer Full Audit — Session `019fecb1`

> **Date:** 2026-08-10 UTC
> **Branch:** `arena/019fecb1-translatechan`
> **Baseline:** `27ca2243ed9d9bc012c2b41119e6f160cffe9694` (`main`)
> **Scope:** repository architecture, frontend implementation, responsive design, UX, accessibility, security/privacy, data integrity, editorial governance, tests, CI/CD, deployment, documentation, and maintainability.
> **Follow-up:** after this audit, the user selected “Fix release blockers”; the Lineage directory and fatal bundle/init boundary were repaired and regression-covered in [`RELEASE_BLOCKERS_2026-08-10_019fecb1.md`](./RELEASE_BLOCKERS_2026-08-10_019fecb1.md). Source data and workflow YAML were not changed.

## 1. Executive verdict

**Current post-fix verdict: `repo_ready = fail`; weighted score is 7.0/10.** The original audit baseline was 6.6/10; two selected release blockers are now resolved.

Fake Chan Factory has a distinctive, coherent purpose and an unusually honest provenance model. Its zero-backend architecture is appropriate for GitHub Pages, the deterministic data/build pipeline is strong, the public five-room scope is disciplined, and the dependency-free smoke suite exercises substantial behavior. The active Congronglu integrity incident is properly contained.

The repository remains below its own release standard for four evidence-backed reasons:

1. **Human rights/editorial decisions remain open for all 14 quotation sources.** Three records labeled `verified_quotation` still contain pending references. The UI separates edition verification from rights, but prior README language overstated one register as “guaranteed-citable” while its rights record still requires jurisdiction review.
2. **Validation has a material blind spot.** The JSON Schema has definitions but no top-level application schema and is not executed. The Python validator strictly checks cases, but accepts invalid non-case units: both `sections: [42]` and a heading-only chapter with no renderable source body produced zero validation errors in direct negative fixtures.
3. **Real-browser evidence is optional and success-skippable.** The Playwright script exits 0 when Chromium is unavailable; CI does not run it; the current sandbox could not download Chromium. CSS geometry, dark mode, accessibility, and screenshots therefore have no current automated release evidence.
4. **Editorial, accessibility, security, and operations gates remain incomplete.** Thirty-three non-case documents remain in the unit-locator migration queue, all 30 internal lineage edges remain traditional/pending, several accessibility relationships are incomplete, CI omits mirrored paths, CSP/font hardening remains, and branch protection could not be verified.

**Resolved after audit:** the Lineage mode now synchronizes semantic hidden/pressed state and its phone grid, while missing/malformed data now renders a focusable reload boundary; both paths have dependency-free and Playwright regressions.

### Score summary

| Area | Score | Verdict |
|---|---:|---|
| Product purpose/scope | 9 | Distinct, narrow, and honest |
| Frontend architecture | 7 | Appropriate static design; coupled implementation |
| Code hygiene / maintainability | 7 / 6 | Selected defect fixed; monolithic/inline/dead-style debt remains |
| Validation | 6 | Strong semantic core; schema and non-case gaps are material |
| Tests / CI | 7 / 6 | Added behavioral regressions; no mandatory browser/a11y/layout gate |
| Security/privacy | 7 | Strong escaping/minimal data collection; CSP/font caveats |
| Performance | 7 | Acceptable today; heavy monolithic first load |
| Web presentation / UX / accessibility | 7 / 7 / 7 | Selected mode fixed; current browser/owner evidence remains absent |
| Content / feature completeness | 6 / 7 | Honest containment; feature mode fixed; editorial work remains |
| Deployment readiness | 6 | Live and green is not equivalent to release-ready |
| Agent/task/audit readiness | 8 / 7 / 8 | Reconciled this session; historical sprawl remains |

All `user_score` values remain `null`; no user approval or satisfaction score was inferred.

## 2. Verified baseline

### Current generated facts

```text
corpus=35 | complete=2 | partial=2 | excerpt seeds=31
source-content CJK=103,723 | all-string CJK=109,185
corpus translation slots=1,252
  reconstruction_unverified=876 | ai_draft=199 | verified_quotation=177
matrix registers=21
  reconstruction_unverified=18 | ai_draft=1 | verified_quotation=2
verified references=176 recorded / 3 pending
locators=148/148 case-level | 33 document-level migration records
lineage=34 profiles | 30 pending internal edges | 4 frontiers
glossary=31 terms | gong'an=24 entries
rights=14 manifest sources | 0 completed rights/jurisdiction reviews
bundle=1,594,154 raw bytes | 497,606 gzip-9
first-party initial assets≈554 KB gzip-9 before Google Fonts
```

Approximately 85.9% of corpus translation slots and 90.5% of Matrix registers are project reconstructions/drafts. That ratio is the disclosed product premise, not an undisclosed defect, but it makes clear status language a permanent core requirement.

### Checks executed

```text
python3 -m py_compile scripts/*.py                           PASS
python3 scripts/validate_data.py                             PASS; 6 known lineage warnings
python3 scripts/build_data_bundle.py                         PASS; 35 docs / 1,594,154 bytes
node --check app.js && node --check theme-init.js            PASS
node scripts/smoke_test.mjs                                  PASS; 35 fixtures / 0 crashes
diff -rq data docs/data                                      PASS
generated/deploy asset diff                                  PASS, including all 4 CI-omitted paths
npm audit --package-lock-only --audit-level=low               PASS; 0 vulnerabilities
npm ci                                                       PASS
npm run test:browser                                         SKIP with exit 0; no Chromium
npx playwright install chromium                              FAIL; network ECONNRESET
Markdown relative-link scan                                  PASS
HTML duplicate-ID scan                                       PASS; 52 IDs / no duplicates
sitemap.xml + og-image.svg XML parse                         PASS
html-validate index.html                                     35 findings
ESLint focused correctness rules                             0 errors / 3 unused warnings
Stylelint focused correctness rules                          1 duplicate declaration
GitHub Pages API                                             built; main/docs; HTTPS enforced
Main Quality + Pages runs at baseline                        PASS
GitHub branch-protection API                                 403; status unverified
GitHub rulesets API                                          no visible rulesets
```

The live Pages HTML and assets were also fetched successfully through the page retrieval tool. Direct `curl` TLS requests and local screenshot tooling were unavailable in this sandbox, so fetched content and GitHub APIs—not a visual browser session—establish live deployment evidence.

## 3. Severity-ranked findings

### P1-1 — Lineage Master Directory cannot reliably become visible — RESOLVED POST-AUDIT

**Evidence:**

- `index.html`: `#lineage-content-target` is emitted with `hidden`.
- `app.js`: the directory-mode click handler adds `.active`, sets the graph to `display:none`, and sets the directory to `display:grid`, but never clears `hidden`.
- The dossier implementation later in the same file explicitly notes that inline display cannot override semantic hidden state and correctly calls `panel.hidden = false` plus `removeAttribute('hidden')`.
- Smoke tests inspect generated directory HTML but do not activate the mode; browser tests activate only graph nodes.

**Impact:** a primary control in one of five public rooms can announce a selected mode while rendering no directory. This also invalidates prior Phase D “all rooms implemented” claims.

**Resolution:** one mode-state function now synchronizes `hidden`, CSS class, and `aria-pressed`; smoke activates both directions; Playwright checks computed visibility/attributes and phone overflow. Real Chromium execution remains part of the broader evidence blocker.

### P1-2 — Rights governance and public-domain copy remain below release standard

**Evidence:**

- `rights_manifest.json`: 12 `needs_rights_review`, 2 `jurisdiction_review_required`, zero completed decisions.
- The data contains 179 verified quotations in corpus + Matrix, from 13 used source IDs; 176 references are recorded and 3 remain explicitly pending.
- The project’s own research-release standard requires a stable reference and editorial rights decision for a verified modern quotation.
- Prior README copy called the Senzaki/Reps register “public-domain-complete” and a “guaranteed-citable baseline,” while the rights record calls it a jurisdiction-specific claim requiring review.

**Impact:** edition accuracy is well disclosed, but release/legal copy can still be read as stronger than the underlying control record. This is the largest non-code blocker.

**Exit criteria:** human review of all 14 records; replace or downgrade the 3 pending references; use jurisdiction-qualified language consistently; never infer permission from online availability or edition verification.

### P1-3 — Non-case corpus validation can certify empty or malformed public units

**Evidence:**

- `validate_case_shape()` has meaningful case-specific checks.
- Other content collections are checked only to confirm that the collection itself is a list.
- Direct negative fixtures produced no errors for:
  - a document with `sections: [42]`;
  - a chapter with headings but no `zh`, `dialogue`, or `verses`, which renders an empty card.
- `schemas/translatechan-data.schema.json` contains `$defs` but no root `type`, `properties`, `$ref`, or `oneOf`; as a complete schema it accepts arbitrary root data.
- `validate_data.py` only checks that the schema file contains `$schema` and `$defs`; it never validates source documents with it.

**Impact:** a green validator/build/smoke run does not prove that future non-case data has required IDs, bodies, source fields, translation maps, or renderable content.

**Exit criteria:** define and execute per-shape schemas or equivalent strict Python validators for sections, chapters, dialogues, stanzas, sample records, five ranks, and nested dialogue/verse records; add checked-in negative fixtures; require a source-body invariant for every rendered unit.

### P1-4 — Browser, layout, accessibility, and visual claims lack a mandatory evidence path

**Evidence:**

- `scripts/browser_test.mjs` deliberately exits 0 if Chromium cannot launch.
- `.github/workflows/quality.yml` does not install Playwright or run browser checks.
- Current browser download failed with `ECONNRESET`; no screenshots could be generated.
- The suite has no axe/accessibility scan, dark-theme scenario, tablet viewport, secondary-room mode assertion, or screenshot diff.

**Impact:** the exact classes of defect most likely in a visual SPA—hidden-state behavior, responsive overflow, sticky collisions, contrast regressions, focus semantics, and print geometry—can merge while all required checks remain green.

**Exit criteria:** retain an optional local script if useful, but add a separate non-skippable CI command/job; cover 390, 768, 1024, and desktop widths; test both themes and every room; add axe plus keyboard assertions; archive current approved screenshots.

### P1-5 — Current-state documentation and scoreboard drifted out of sync (reconciled in this audit)

**Baseline evidence:**

- Persisted scoreboard aspect scores weighted to 6.9 (`573 / 83`), while summary fields claimed 7.6.
- Score history recorded updates not reflected in YAML aspect values.
- `AUDIT.md`, `HANDOFF.md`, `SCOREBOARD.md`, `WEB_VISION`, the scoreboard handoff, and the disposable response summary disagreed about whether Phases C/D were complete, which branch was current, and whether the 1100/960 mismatch still existed.
- `README.md` contained a duplicated/corrupted deployment paragraph and claimed a nonexistent fatal error boundary.
- `ROADMAP.md` said 23 Gong'an records instead of 24 and reported old 135/5 reference counts instead of 176/3.
- The “doc truthfulness” validator still passed because it checks selected snippets, not contradictory or false surrounding prose.

**Resolution:** current summaries, handoffs, planning docs, README claims, score arithmetic, and this dated report were reconciled without editing historical session evidence.

**Remaining debt:** multiple historical root audits remain outside `sessions/`; the doc gate should be generated from metrics where possible and should test current-state status claims, not merely the presence of one correct snippet.

### P2-1 — Fatal initialization has presentation CSS but no behavior — RESOLVED POST-AUDIT

At audit time, `.error-boundary-card` and companion styles existed, but no JS or HTML code created one. Missing or malformed `app_data.js` left a loading Reader and blank secondary rooms.

**Resolution:** the app now validates the required bundle contract before setup, catches initialization failures, renders/focuses a `role="alert"` recovery panel, logs a concise diagnostic, and wires reload. An isolated VM smoke test executes the missing-bundle path; Playwright aborts `app_data.js` and checks the computed recovery UI.

### P2-2 — Accessibility state and interaction semantics are incomplete

Confirmed gaps:

- the mobile pinyin toggle changes class/data but not `aria-pressed`;
- Lineage graph/directory mode buttons have no pressed/selected state;
- case-collapse buttons update `aria-expanded` but retain stale action labels/titles after toggling;
- glossary terms are focusable `<span>` elements with Enter/Space behavior but no button role or explicit tooltip relationship;
- citation and Robo tooltip triggers do not establish `aria-describedby`/expanded relationships;
- custom radio buttons do not implement radio-group arrow-key behavior;
- search-result updates are not announced through a stable live region;
- no screen-reader or automated accessibility run is release evidence.

Strengths include semantic headings, a skip link, ARIA tabs with roving focus, dossier focus return, visible focus rules, reduced-motion handling, Chinese `lang` attributes, and contrast-safe primary tokens.

### P2-3 — Mobile Lineage directory has an implicit-column overflow risk — RESOLVED POST-AUDIT

At `max-width:1024px`, `.master-dir-quote` receives `grid-column:2`. At `max-width:768px`, the parent becomes a one-column grid, but the quote’s `grid-column` is not reset. Once the hidden-mode bug is fixed, CSS Grid can create an implicit second column on phones.

**Resolution:** the phone breakpoint now resets `grid-column:auto` and Playwright asserts no horizontal overflow with the mobile directory visible.

### P2-4 — CSP and privacy are good in intent but not fully hardened

Strengths: all runtime code is first party, dynamic text is consistently escaped, no inline event handlers/eval/new Function exist in production code, no user data is sent to a backend, storage calls fail soft, and CSP includes restrictive defaults.

Gaps:

- the CSP meta appears after synchronous `theme-init.js`, so that script is outside the meta-delivered policy;
- `style-src 'unsafe-inline'` remains necessary because of JS-created styles and 49 template `style=` occurrences;
- Google Fonts creates third-party requests and an availability/privacy dependency;
- `frame-ancestors` cannot be enforced by meta and no deploy headers are available on native Pages;
- no `SECURITY.md` or repository vulnerability-reporting policy exists.

**Improve by:** move CSP before all governed resources, finish inline-style extraction, self-host/subset fonts or use system stacks, add `color-scheme`, and document security reporting.

### P2-5 — CI is deterministic but incomplete

What is strong:

- least-privilege `contents:read` permissions;
- a 10-minute timeout;
- Python syntax, semantic validation, deterministic build, generated-diff, and smoke checks;
- successful main and branch runs.

Gaps:

- the diff list omits `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`, and `docs/og-image.svg`;
- action versions emit confirmed Node 20 deprecation annotations;
- no JS/HTML/CSS lint, Markdown-link, schema-negative-fixture, browser, accessibility, or screenshot job;
- no visible ruleset exists, and classic protection returned 403;
- required Quality status on `main` remains unverified.

Exact owner-approved workflow changes remain documented in `.scoreboard/manual-workflow-edits.md`; workflow YAML was not edited because project policy requires explicit approval.

### P2-6 — Monolithic rendering limits maintainability and first-load performance

Current source sizes:

```text
app.js                    3,076 lines / 150,836 bytes
app.css                   2,277 lines / 57,501 bytes
validate_data.py          1,216 lines
smoke_test.mjs            1,043 lines
app_data.js               1,594,154 bytes / 497,606 gzip-9
```

`init()` renders all five rooms even though four are hidden. The entire corpus, translation metadata, lineage graph, glossary, and index arrive in one classic-script global. This is acceptable at current scale but does not align with the planned corpus expansion.

**Improve in order:** first measure parse/render/interaction timing in a real browser; then render rooms on first activation; then consider a small manifest/core bundle plus per-document lazy data; preserve static hosting and deterministic offline generation.

### P2-7 — CSS/JS cleanup remains despite the Phase C/D consolidation

Focused static checks found:

- 49 dynamic inline-style occurrences in `app.js`;
- dead legacy component CSS for `.matrix-card`, `.master-card`, and `.term-card` after new room layouts replaced them;
- one duplicate `.reader-toolbar` background declaration;
- three unused JS values/parameters (`nextAll`, a dead Robo disclosure detail object, and `corpKey`);
- 13 media blocks using only two max-width thresholds plus a 600px min-width rule—thresholds are standardized, but declarations remain fragmented;
- 35 HTML-validator findings, mostly missing explicit button types, plus raw ampersands and dynamic-markup limitations.

None alone blocks release, but together they make the visual system harder to reason about and weaken CSP hardening.

### P3-1 — Public sharing and repository presentation are underconfigured

The site has canonical, description, Open Graph, Twitter, robots, sitemap, theme colors, and a 1200×630 SVG. However:

- SVG social images are less universally supported than PNG/JPEG previews;
- width/height/alt metadata are not supplied for social cards;
- the GitHub repository has no description, homepage URL, topics, custom social image, security policy, or release;
- Pages has no custom 404 (low impact for this hash-routed app).

**Improve by:** ship a PNG social card and set complete OG/Twitter metadata; configure repository description/homepage/topics/custom image; add a concise changelog/release only when there is a genuine release standard.

## 4. Web design and UX audit

### What is working

- The dark-walnut lintel, rice-paper surfaces, serif Chinese typography, restrained rule lines, and bilingual room labels form a recognizable identity rather than a generic dashboard.
- Reader hierarchy is substantially better than the historical version: corpus shelf, status grouping, progressive source ledger, collapsed front matter, case rail, constrained reading surfaces, and reader-only mobile controls.
- Matrix proof sheets, Gong'an catalogue rows, and Lexicon definition rows move in the correct literature-first direction.
- Light and dark primary token pairs tested here meet WCAG AA for normal text; examples include light muted text at 6.13:1 and light accent gold at 5.11:1 against rice paper.
- The design does not obscure the product’s central joke or the provenance warning.

### What remains inconsistent

- The advertised Lineage directory is inaccessible through its mode control, making the four-room completion claim visually and functionally incomplete.
- The Reader still contains most of the legacy inline styling and decorative emoji density; secondary rooms use named CSS primitives while many heterogeneous Reader shapes remain template-styled.
- Old rounded/card/shadow styles and component selectors remain in the stylesheet even after the new layouts stopped using them.
- Visual confidence is based on code inspection, not current light/dark screenshots or owner approval.
- The social card palette still uses older color values and emoji/font-dependent SVG text, so its rendering can differ across crawlers.
- Secondary-room responsive behavior is under-tested; the Lineage quote-grid rule is one concrete example.

### Recommended design finish line

1. Fix and test Lineage mode switching first.
2. Capture all five rooms at 390, 768, 1024, and 1440 widths in both themes.
3. Remove remaining Reader inline styles into a small set of content-shape primitives.
4. Delete dead card CSS and merge breakpoint blocks by responsibility.
5. Run keyboard, screen-reader, axe, overflow, sticky-offset, and print checks.
6. Obtain explicit owner approval from current screenshots; do not infer approval from merge or silence.

## 5. Architecture, data, and editorial audit

### Architecture strengths

- No runtime package dependency or backend.
- Manifest-driven corpus loading and deterministic generated metrics.
- Root and `/docs` deployment mirrors are byte-identical for all published assets.
- Controlled lineage and Gong'an vocabularies prevent display-key drift.
- Translation statuses and source IDs are structural, not prose-only.
- The build is simple enough to reproduce and inspect.

### Architecture improvement potential

- Replace the inert schema claim with executable per-artifact contracts.
- Split validator responsibilities into shape, cross-file, metrics, and documentation modules after negative fixtures stabilize behavior.
- Replace one global render-everything IIFE with small room modules or at minimum view-local functions and first-activation rendering.
- Generate repeated metric/status documentation fragments rather than checking that hand-written prose merely contains selected strings.
- Treat the bundle version as a real generated contract or remove the fixed `1.1.0` label.

### Editorial strengths

- Congronglu is quarantined rather than cosmetically patched.
- Completion is explicitly editorial and no longer inferred from N/N counts.
- Rights status is structurally separate from edition verification.
- Case locator coverage is complete for the two case collections.
- Traceability and lineage review queues state that queue membership is not evidence.

### Editorial blockers

- 33 documents are still document-level seeds for locator purposes.
- Biyanlu and Linji remain partial witnesses.
- All 30 in-set lineage edges await exact locators.
- All 34 lineage profiles remain in review queues: 29 need exact locators, 1 is in review, and 4 need frontier sources.
- Six master dossiers intentionally warn that corpus links are uncurated.
- Three verified quotation references are pending.
- All 14 rights decisions remain open.

## 6. Test coverage audit

The dependency-free smoke test is a genuine strength: it executes the production bundle in a hand-built DOM stub, renders all 35 corpus documents, exercises search escaping, storage failure behavior, data disclosures, lazy loading, print expansion, dossier output, filters, and public-scope guards.

Its limitation is equally important: it validates generated strings and stub state more often than browser semantics or computed layout. It did not catch the directory’s persistent `hidden` attribute because it never activates that mode in a real browser. It cannot establish CSS visibility, focus behavior, overflow, sticky geometry, font loading, print fidelity, or accessibility-tree correctness.

The Playwright suite covers 12 useful scenarios, but optional-success skip semantics make “exit 0” ambiguous. Future scripts should distinguish `PASS`, `FAIL`, and `SKIP` with a machine-readable result, and release CI must call a non-skippable entry point.

## 7. Operations and deployment audit

- Public Pages is built from `main /docs` with HTTPS enforced.
- Baseline main Quality and Pages runs succeeded.
- The current branch push also triggered Quality successfully after the first audit checkpoint.
- There are no open issues or pull requests at audit time.
- The repository is public and has zero npm vulnerabilities.
- GitHub repository presentation fields are mostly empty.
- Branch protection cannot be confirmed with the integration’s permissions.
- Workflow action runtime warnings are current and verified, not historical speculation.

A green Pages deployment proves that static files were published; it does not clear content rights, browser behavior, accessibility, or visual acceptance.

## 8. Final scoreboard

| Aspect | Weight | Target | AI / Effective | Status | Main evidence |
|---|---:|---:|---:|---|---|
| Project purpose / scope | 4 | 8 | 9 | healthy | clear differentiated premise and five-room contract |
| README / onboarding | 4 | 7 | 7 | healthy | corrected current quickstart/status |
| Repo organization | 3 | 8 | 7 | needs_work | strong split; generated and audit duplication |
| Code hygiene | 4 | 8 | 7 | needs_work | mode/fatal/unused warnings fixed; inline/dead CSS/style-validation debt remains |
| Architecture | 4 | 8 | 7 | needs_work | appropriate deterministic static pipeline; global monolith |
| Maintainability | 4 | 8 | 6 | needs_work | coupled large files and heterogeneous render branches |
| Type safety / validation | 3 | 8 | 6 | needs_work | strong semantics; inert schema and non-case blind spot |
| Error handling / logging | 3 | 8 | 7 | needs_work | fatal recovery and storage resilience; broader diagnostics remain minimal |
| Dependency hygiene | 3 | 8 | 8 | healthy | no runtime package; zero audit findings; external fonts |
| Tests | 5 | 7 | 7 | needs_work | behavioral regressions added; browser still success-skippable/not CI |
| CI/CD | 4 | 7 | 6 | blocked_manual_workflow_edit | omitted paths, old actions, limited jobs |
| Security / privacy | 5 | 8 | 7 | needs_work | escaping/no backend strong; CSP order/unsafe-inline/fonts |
| Performance | 3 | 8 | 7 | needs_work | compact/lazy cases; 554 KB gzip and eager hidden views |
| GitHub Pages presentation | 5 | 8 | 7 | needs_work | directory fixed; no current approved browser visuals |
| UX / usability | 4 | 8 | 7 | needs_work | Reader/search and both Lineage modes; broader evidence gaps |
| Accessibility | 3 | 8 | 7 | needs_work | mode/fatal semantics fixed; other state/tooltips/no formal pass |
| Content quality | 3 | 8 | 6 | needs_work | P0 contained; rights/source review incomplete |
| Feature completeness | 4 | 8 | 7 | needs_work | five views and repaired primary mode; content remains seeded |
| Deployment readiness | 4 | 8 | 6 | needs_work | live/green but rights/validation/CI/security gates unresolved |
| Agent readiness | 5 | 8 | 8 | healthy | refreshed audit, scoreboard, handoff, and workflow notes |
| Task hygiene | 3 | 8 | 7 | needs_work | current docs reconciled; historical root sprawl remains |
| Auditability | 3 | 8 | 8 | healthy | behavioral evidence and corrected arithmetic; browser gap explicit |

**Weighted total:** `582 / 83 = 7.012...`, rounded to **7.0/10**.
**Required gate failures:** CI/CD 6 < 7, security/privacy 7 < 8, and overall 7.0 < 8. Tests 7, agent readiness 8, and README 7 meet their thresholds.
**Gate:** `repo_ready = fail`.

## 9. Recommended implementation order

### Release lane — do these first

1. ~~**Repair Lineage mode switching** and mobile directory grid; add regressions.~~ **Completed post-audit** (real Chromium execution remains under the broader evidence task).
2. ~~**Implement fatal bundle/init recovery** and malformed-bundle tests.~~ **Completed post-audit.**
3. **Add strict non-case validators plus negative fixtures**; either execute a meaningful JSON Schema or narrow/remove the schema claim.
4. **Create a non-skippable browser/a11y/overflow CI path** and collect current light/dark responsive screenshots.
5. **Complete the 3 pending quotation references and all 14 rights decisions.**
6. **Obtain explicit owner visual approval** only after the current implementation is shown at all target widths.

### Hardening lane

7. Apply the documented owner-approved workflow path/action updates and verify required Quality protection on `main`.
8. Finish tooltip/toggle/radio/search accessibility state relationships and run a screen-reader pass.
9. Extract the remaining 49 inline styles, delete dead room-card CSS, remove static-lint findings, and consolidate media blocks.
10. Render secondary rooms on first activation; measure before splitting the data bundle.

### Research lane

11. Migrate unit locators for the 33 queued documents, prioritizing Matrix/Gong'an-visible records.
12. Complete Biyanlu/Linji field-level review and lineage profile/edge evidence.
13. Reintroduce Congronglu only through authoritative TEI ingestion, per-field provenance, negative fixtures, and human review.
14. Expand glossary/corpus only after the release and source contracts are demonstrably enforced.

## 10. Documentation reconciliation completed in this session

Updated current-state documentation to remove contradictory score/design/branch claims and false release wording:

- `AUDIT.md`
- `HANDOFF.md`
- `README.md`
- `ROADMAP.md`
- `RESEARCH_RELEASE_PLAN.md`
- `SCOREBOARD.md`
- `WEB_VISION_2026-08-10.md`
- `UX_ROADMAP.md` status note
- `.scoreboard/scoreboard.yml`
- `.scoreboard/agent-handoff.md`
- `.scoreboard/history.md`
- `response_summary.md`

Historical dated reports remain unchanged by design. After the user selected the release-blocker follow-up, application/test/docs mirrors were updated for Lineage mode and fatal recovery; source data and workflow YAML remain unchanged.

## 11. Audit limitations

- No Chromium could be installed, so there is no current computed-style, screenshot, Lighthouse, axe, or screen-reader evidence.
- Visual findings are based on HTML/CSS/JS inspection, standards behavior, existing test code, fetched live content, and token calculations—not subjective owner approval.
- This is not legal advice and does not decide quotation rights.
- Classical Chinese accuracy was not independently re-collated in this session; the audit assesses the repository’s evidence and controls.
- Branch-protection status remains unknown because GitHub returned 403 to this integration.

## One-sentence summary

Completed the full audit and documentation reconciliation, then repaired the selected Lineage/fatal-state release blockers with regressions, raising the evidence-based gate from 6.6 to 7.0/10 while validation, rights, browser/CI, security, and editorial work remain.
