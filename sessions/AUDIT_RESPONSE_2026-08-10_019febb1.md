# Full Senior Developer & Web Design Audit — 2026-08-10

> **Session:** `arena/019febb1-translatechan`
> **Baseline:** `3ef77320d28cc2a627723d8ad709f9a13ba83c29` (`main`, PR #14)
> **Audit commit:** see branch history for `arena/019febb1-translatechan`
> **Scope:** architecture, code, corpus/editorial integrity, rights, tests, CI/deployment, security/privacy, performance, responsive UX, visual system, accessibility, SEO, documentation, and repository operations.
> **Audit outcome:** one P0, four P1 groups, multiple P2/P3 findings; initial evidence-based score **5.8/10** and `repo_ready = fail`.
> **Post-audit update:** content containment and P1 functional work shipped with regressions. The owner then explicitly rejected the prior website-vision completion claim; a design re-audit found the generic dashboard composition remains. Current score: **6.8/10**. See [`CONTAINMENT_2026-08-10_CONGRONGLU.md`](./CONTAINMENT_2026-08-10_CONGRONGLU.md), [`FUNCTIONAL_HOTFIX_2026-08-10.md`](./FUNCTIONAL_HOTFIX_2026-08-10.md), and [`WEB_DESIGN_GAP_PLAN_2026-08-10.md`](./WEB_DESIGN_GAP_PLAN_2026-08-10.md).

## 1. Executive verdict

The project has a strong static architecture, unusually good provenance intent, deterministic artifacts, and a useful dependency-free regression harness. Those strengths are real. However, the previous “no P0/P1/P2” and 8.2/10 conclusions were too optimistic because the tests mostly check that rendering does not throw and that selected implementation strings exist; they do not verify content truth, visible behavior, responsive geometry, complete export, or actual accessibility.

The most urgent issue is a direct contradiction of the project’s moral premise: 28 of 35 published Congronglu cases repeat the exact same generic Chinese “Wansong commentary” and “Tiantong verse,” with equivalent repeated English, as though they were canonical case-specific text. The ingestion scripts contain those placeholders. They are neither structurally marked as generated nor visually disclosed as placeholders, while the site promises that its Classical Chinese is real CBETA text. Only five Congronglu entries have page-level, `collated_with_normalization` records; two other non-repeated seeds remain merely case-number anchored. This must be contained before more content work.

Other material defects include a falsely “complete” 680-CJK Platform Sutra, six Platform chapters rendering as empty cards, a lineage dossier that remains hidden because its `hidden` attribute is never removed, incomplete Print/PDF exports, epilogue misordering, unresolved quotation-rights decisions, and serious current-document drift. Green automation does not currently imply release readiness.

## 2. Commands, checks, and evidence

```text
python3 -m py_compile scripts/*.py          PASS
python3 scripts/validate_data.py            PASS with 6 lineage warnings
python3 scripts/build_data_bundle.py        PASS; app_data.js = 1,676,108 bytes
diff -rq data docs/data                     PASS
root/docs asset byte comparisons            PASS
node scripts/smoke_test.mjs                 PASS; 36 renderer fixtures, 0 crashes
npm audit --package-lock-only               PASS; 0 vulnerabilities
npm run test:browser                        SKIP; Chromium unavailable
npx playwright install chromium             FAIL; repeated network ECONNRESET
internal Markdown-link scan                 FOUND 2; fixed same session; final PASS
GitHub Quality run at main 3ef7732           PASS
GitHub Pages API                            built; main /docs; HTTPS enforced
branch-protection API                       INCONCLUSIVE; integration returned 403
live-site HTTP probe                        INCONCLUSIVE; sandbox TLS closed
```

Measured gzip-level-9 sizes:

| Asset | Raw | Gzip-9 |
|---|---:|---:|
| `index.html` | 19.9 KB | 5.8 KB |
| `app.css` | 45.0 KB | 9.9 KB |
| `app.js` | 145.6 KB | 37.8 KB |
| `app_data.js` | 1.676 MB | 522.2 KB |
| `theme-init.js` | 0.9 KB | 0.5 KB |
| `og-image.svg` | 2.9 KB | 1.3 KB |

Core measured data: 36 documents; 1,352 corpus translation slots (976 reconstruction, 199 AI draft, 177 verified quotation); 21 Matrix rows/register slots; 183 case-number locators; 34 masters; 31 glossary terms; 24 Gong’an index entries.

## 3. Severity-ranked findings

### P0 — Content integrity: canonical-looking Congronglu placeholders are public

**Evidence**

- `data/corpus/congronglu_cases.json` repeats `萬松老人云：此一則公案，直指人心，不可用思量卜度。` in **28 cases**.
- The same 28 cases repeat `天童頌云：古佛心印，直下透徹。`.
- Equivalent English commentary and verse are repeated 28 times.
- The placeholder literals are authored directly in `scripts/ingest_content_wave.py`, `scripts/ingest_autonomous_wave3.py`, and `scripts/ingest_autonomous_wave4.py`.
- Those cases carry `case_level_anchor` values such as `T2004, case 12`, not character-level collation evidence, and have no per-field generated/placeholder status.
- The coverage note calls all 35 “canonical cases recorded”; public copy says the Chinese source is real CBETA language.

**Impact**

The site attributes generic project text to Wansong and Hongzhi/Tiantong and visually presents it as canonical Classical Chinese. This is the exact trust failure the “Fake English, real Chinese” premise says it prevents. It also contaminates search, metrics, downloads, the generated bundle, and downstream reuse.

**Required action**

1. Immediately quarantine or remove all Congronglu units not byte-collated against the selected T2004 witness. Keep only demonstrably collated units public, or label every non-source field structurally and visibly as a project placeholder.
2. Add a validator failure for repeated source-field placeholders across case units.
3. Add per-field source status; a case-number anchor is not proof that each `pointer_zh`, `commentary_zh`, or `verse_zh` is canonical.
4. Replace one-shot AI-authored ingestion snapshots with a reproducible TEI ingestion/collation tool and review manifest.

### P1 — False completeness and empty Platform Sutra output

`complete_document_keys()` marks a document complete when list length reaches `unit_targets`. It does not establish that each unit is the complete canonical unit.

- `platform_sutra` has 10 chapter containers but only **680 source-content CJK characters**.
- Each chapter contains selected passages, not the entire chapter.
- Its `coverage_note` nevertheless says “10 / 10 canonical chapters complete across the entire Platform Sutra.”
- Metrics, Reader coverage, sidebar checkmark, AUDIT, HANDOFF, OG artwork, and other docs repeat the complete-text claim.
- Chapters 3, 6, 7, 8, 9, and 10 store direct `zh/pinyin/translations` fields. `renderChapterItem()` only renders `verses` or `dialogue`, so **six of ten chapter cards have headings but no passage content**.
- Chapter rendering has no chapter-level source disclosure.

Biyanlu’s 100 case containers are a valuable milestone, but the file’s own note says post-verse commentary/rendering and human sign-off remain pending. “100/100 case records” and “complete selected edition” must not share one boolean.

**Required action:** replace `complete_documents` with explicit coverage dimensions such as `unit_index_coverage`, `source_field_coverage`, `selected_witness_completion`, `human_review_status`, and `translation_coverage`. Relabel Platform Sutra as “10/10 chapter excerpts represented” until a full witness is actually present.

### P1 — Lineage dossier is functionally hidden

`#master-dossier-panel` ships with the HTML `hidden` attribute and CSS `.dossier-panel[hidden] { display:none !important; }`. `openDossierPanel()` only sets `panel.style.display = 'block'`; it never removes `hidden`. The `!important` hidden rule wins, so clicking a node/card populates an invisible panel and attempts to focus it.

The smoke test checks dossier HTML content and CSS strings, not computed visibility. The browser suite does not test the dossier at all.

**Required action:** use `panel.hidden = false/true` consistently, test computed visibility and focus restoration in a real browser, and add a Lineage end-to-end test.

### P1 — Rights release gate is unresolved and badge semantics conflate concepts

All 14 rights-manifest sources remain unapproved:

- 12 `needs_rights_review`;
- 2 `jurisdiction_review_required`;
- zero approved editorial decisions.

Of 177 verified corpus quotation slots, 53 resolve to copyrighted/uncertain or online-rights-unverified sources; the Matrix adds one unresolved Blyth quotation. The research-release plan itself says verified modern quotation acceptance requires an editorial rights decision.

The UI then describes `verified_quotation` as “Genuine public-domain (or verified)” and the hero/Matrix copy implies the Verified badge means public-domain text. It does not: status currently means the wording was checked against an edition. Rights are a separate unresolved field visible only in citation details.

This audit does **not** make a legal conclusion. It identifies a release-governance contradiction requiring qualified human review.

**Required action:** rename the badge to “Edition-verified quotation”; never imply public-domain status from verification status; add an explicit rights decision state; either approve each use after review or omit unresolved quotation text from the public bundle while retaining metadata.

### P1 — Current operational documentation is unsafe for the next agent

- `.scoreboard/agent-handoff.md` identifies an old session branch, old baseline, old commits, and “ready to merge” instructions.
- `response_summary.md` said already-merged PR #14 was still ready for merge.
- README, HANDOFF, ROADMAP, RESEARCH_RELEASE_PLAN, SCOREBOARD, and AUDIT disagree about document completion, locators, translation counts, and pending references.
- A future agent following the old handoff could work from the wrong assumptions and reintroduce stale migration scripts.

The current session refreshes the scoreboard, handoff, audit index, and live summary, but the larger historical/current prose cleanup remains a separate remediation task.

### P2 — Reader ordering and collection labels are wrong

- `renderReader()` appends the Wumenguan epilogue immediately after the preface and before all cases.
- Every case collection labels commentary `無門評唱 / Commentary`, including Biyanlu (Yuanwu) and Congronglu (Wansong).
- Scope/overview cards are appended after case or section content in several shapes despite being orientation material.
- Default Bilingual mode prefers Red Pine/Cleary Robo reconstructions over available verified quotations, weakening the promised citable baseline.

### P2 — Print/PDF exports are incomplete

The print button calls `window.print()` without rendering all lazy units. Wumenguan/Biyanlu start with 12 cases and Linji starts with 12 sections. The print stylesheet expands only nodes already in the DOM. The browser test checks only that one case remains visible, so the defect passes.

### P2 — Responsive geometry and sticky controls are structurally inconsistent

1. At 961–1100 px, Reader switches to one column while the desktop sidebar remains visible until 960 px. A large sticky 36-work selector is therefore placed above the reading content.
2. `.reader-toolbar` sticks at `top:.25rem` and `z-index:50`, behind the sticky global header at `z-index:100`; `.content-panel` is not a scroll container despite comments saying the toolbar is constrained by it.
3. Case-strip top is a fixed `4.4rem` even though the responsive header can wrap and change height.
4. The mobile Reader bar appears in Matrix, Lineage, Gong’an, and Lexicon views.
5. The wide mobile bar combines horizontal overflow with `justify-content:center`, which can clip leading controls.
6. Body bottom padding does not include the action bar’s safe-area inset.
7. The lineage graph still forces a 720 px minimum logical width on narrow screens.
8. The 48/100-case title strip becomes a multi-row sticky block at desktop widths, consuming substantial reading space.

### P2 — Accessibility claims exceed measured evidence

Calculated contrast examples:

- white on light gold `#9e7232`: **4.28:1**;
- white on dark-theme gold `#c89f55`: **2.46:1**;
- dark green/blue status colors on dark card: approximately **4.1:1**;
- dark red on dark card: approximately **3.45:1**.

These fail 4.5:1 for normal-sized text used by active tabs/buttons/statuses. Additional gaps:

- reader-mode and Gong’an filter buttons expose visual active state but no `aria-pressed`;
- settings uses `role=radio` without the expected arrow-key/roving behavior;
- tooltip nodes are not related to triggers with `aria-describedby`;
- search updates have no stable results live region/focus strategy;
- case toggles lack `aria-controls`;
- visual color differences in lineage edges need a stronger non-color legend;
- no screen-reader or axe-style pass exists.

### P2 — The published JSON Schema is not actually run

`validate_data.py` only checks that the schema file has `$schema` and `$defs`. It does not apply schema definitions to source files. The schema has no root instance target, omits most auxiliary records, and differs from the Python validator on strictness. Calling the process “schema validation” is misleading.

The Python validator remains valuable, but it deeply checks only case shape. It does not enforce required source content for sections/dialogues/stanzas/chapters/five ranks/sample records. That gap allowed six empty-rendering Platform chapter shapes and count-only completeness.

### P2 — Automated tests provide false confidence

- Browser test expects the title to contain `TranslateChan`; current title contains `Fake Chan Factory`, so it would fail if Chromium ran.
- Browser unavailability prints SKIP and exits 0, which is unsuitable for a required release gate.
- No browser CI job exists.
- The final branch Quality run passed but emitted GitHub's Node 20 action-runtime deprecation warning: `actions/checkout@v4`, `actions/setup-node@v4`, and `actions/setup-python@v5` are being forced onto Node 24. GitHub API showed current releases `checkout@v7.0.1`, `setup-node@v7.0.0`, and `setup-python@v7.0.0`; update majors as an owner-approved workflow edit before the compatibility fallback is removed.
- Smoke tests assert implementation strings such as `position:sticky` and “10/10 chapters” rather than correct computed behavior or content semantics; some checks codify current bugs.
- No tests cover dossier visibility, epilogue order, direct chapter shape output, full print output, 1024 px responsive behavior, horizontal overflow, contrast, bad localStorage shapes, repeated canonical placeholders, or negative completeness fixtures.
- No JS/HTML/CSS lint, link checker, or accessibility checker runs in CI.

### P2 — Documentation truthfulness gate accepts contradictions

The gate requires selected live snippets to appear but does not reject stale claims elsewhere. Confirmed current contradictions include:

- README: “34 of 36” excerpt seeds versus metrics’ 32; Xinxin “opening stanzas”; Platform “4/10”; elsewhere four works are called complete.
- HANDOFF: only Wumenguan/Biyanlu complete and 34 seeds; later four complete.
- ROADMAP: Platform 4/10, Linji 67 sections, 150 locators, 135 recorded/5 pending references.
- RESEARCH_RELEASE_PLAN current baseline: Wumenguan only complete, Biyanlu 14/100, 57 locators, 138 verified records, five pending references.
- SCOREBOARD risk copy: 1,342 slots/966 reconstructions rather than 1,352/976.
- AUDIT standing recommendation: Linji continuation despite current data claiming 74 sections complete.
- Two historical Markdown links are broken.

### P2 — Failure handling is blank rather than fail-soft

If `app_data.js` fails to load or is malformed, the app has no visible fatal state, retry, or diagnostic; major panels can remain empty. There is no top-level error boundary or lightweight client diagnostic. Storage helpers catch browser exceptions, but parsed storage is not fully shape-validated: a valid JSON primitive in `translatechan_collapsed_cases` can cause a strict-mode TypeError when a case is toggled.

### P3 — Security/privacy hardening

- CSP meta appears after synchronous `theme-init.js`, so that bootstrap executes before the policy applies. Place CSP before scripts or serve an HTTP header.
- `style-src 'unsafe-inline'` remains necessary because the static and generated markup contains many inline styles (19 static, approximately 65 generated template occurrences).
- Google Fonts creates a third-party request and availability/privacy dependency despite otherwise zero-runtime-dependency architecture.
- No `SECURITY.md` or documented vulnerability-reporting route exists.
- XSS escaping and no-inline-handler discipline are otherwise strong.

### P3 — Performance and long-term scalability

- Initial app payload is approximately 576 KB gzip before fonts/protocol overhead.
- All corpus data loads and parses before app initialization, and all five hidden views render at startup.
- Root/data/docs/generated mirrors account for most tracked repository bytes and create noisy reviews.
- `citationDetails` is a never-cleared `Map`; every rerender registers more detail objects.
- A per-document fetch strategy is warranted before substantially expanding corpus size, but content integrity and correctness come first.

### P3 — SEO, sharing, and repository presentation

- Hash routes expose only one sitemap URL and no static corpus/view pages.
- With JavaScript unavailable, the main research content is empty; there is no useful `<noscript>` summary.
- No case/unit permalink exists, limiting citation and sharing.
- Canonical source labels are text, not direct CBETA deep links.
- SVG Open Graph images have uneven platform support; no PNG/JPEG fallback or `og:image:width`, height, type, or alt metadata exists.
- Hero runtime shows 8 unique non-AI Matrix names while initial HTML/OG says 21 “Robo-Translators”; 21 is a slot/profile count, not the same metric.
- GitHub repository description, homepage, and topics are empty.
- No `CONTRIBUTING.md`, `SECURITY.md`, `CITATION.cff`, issue templates, `.editorconfig`, or JS lint config.

### P3 — Code/repository hygiene

- `app.js` is 2,978 lines, `app.css` 2,025, validator 1,169, smoke test 964; reasonable sectioning does not eliminate change-coupling.
- Documentation says case-card inline styles were migrated, but relevant renderer branches still use inline styles and the new CSS classes are unused.
- One-shot ingestion scripts are stale mutable snapshots, not safe production tools, and several are absent from docs.
- Comments contain stale numbers (“Linji 88 units”), stale behavior descriptions, and a typo (“about-bloock”).
- Dynamic markup places block source disclosure inside a `<span>` wrapper in case headers; HTML should be structurally validated.
- Buttons mostly omit `type="button"`; no forms exist today, but explicit type is safer.

## 4. Strengths confirmed

1. **Static deployment model:** no backend, no runtime JS package dependency, small operational surface.
2. **Deterministic build:** source data → validator/metrics → compact bundle → `/docs` mirror is reproducible.
3. **Current artifact synchronization:** root and published copies are byte-identical after the build.
4. **Escaping discipline:** dynamic text is consistently escaped; earlier self-XSS classes appear remediated.
5. **Structural translation statuses:** Robo reconstruction, AI draft, and verified quotation are explicit data rather than ad-hoc copy.
6. **Rights manifest intent:** every verified source resolves to an editorial record, even though approvals remain unfinished.
7. **Search:** diacritic folding, selected orthographic variants, field-match disclosure, capping, and caching are thoughtful.
8. **Interaction foundations:** hash routing, reduced-motion handling, persistent preferences, keyboard tab navigation, lazy rendering, and shared popovers are solid primitives.
9. **Controlled vocabularies:** school and Gong’an theme keys drive validation and UI consistently.
10. **CI baseline:** current Quality and Pages runs are green at the audited main commit.
11. **Audit trail:** prior sessions preserve valuable history, even though current-state material needs consolidation.

## 5. Revised scoreboard

| Aspect | Prior | Revised | Main reason |
|---|---:|---:|---|
| Project purpose / scope | 9 | 9 | Clear, differentiated premise |
| README / onboarding | 8 | 5 | Material contradictory current-state claims |
| Repo organization | 8 | 6 | Stale handoffs, audit sprawl, unsafe one-shot scripts |
| Code hygiene | 8 | 6 | Hidden dossier, empty shapes, dead/inline code, state-shape bug |
| Architecture | 8 | 7 | Strong static pipeline; weak completion/source model |
| Maintainability | 8 | 6 | Large coupled files and behavior/string tests |
| Type safety / validation | 9 | 6 | Schema not executed; non-case units weakly validated |
| Error handling / logging | 7 | 5 | No fatal state; malformed storage path |
| Dependency hygiene | 9 | 8 | Excellent JS hygiene; Google Fonts runtime dependency |
| Tests | 8 | 5 | Critical defects pass; browser test stale and optional |
| CI/CD | 7 | 6 | Missing mirrored asset paths and real-browser/lint gates |
| Security / privacy | 9 | 7 | Strong escaping/CSP intent; policy order/fonts/reporting gaps |
| Performance | 8 | 7 | ~576 KB gzip first load and eager hidden-view render |
| GitHub Pages presentation | 9 | 6 | Broken dossier, wrong counts/completeness, social gaps |
| UX / usability | 9 | 5 | Print, order, sticky, breakpoint, and global mobile-bar defects |
| Accessibility | 8 | 5 | Contrast failures and incomplete state/tooltip semantics |
| Content quality | 8 | 3 | Undisclosed canonical-looking placeholders; false completion |
| Feature completeness | 8 | 6 | Five public views exist, but key view/output paths are broken |
| Deployment readiness | 7 | 4 | Live deployment, but P0/P1 release blockers |
| Agent readiness | 8 | 4 | Handoff pointed to old fixed branch/state |
| Task hygiene | 8 | 5 | Stale duplicate current-state docs and scripts |
| Auditability | 9 | 6 | Rich evidence, but gates/prior audit missed severe defects |

**Weighted effective score:** **5.8/10**.
**Repo-ready gate:** **fail**; required scores for README, tests, CI, security, and agent readiness no longer pass, and active P0/P1 risk flags remain.

All `user_score` values remain `null`; no user score was invented or changed.

## 6. Remediation plan

### Phase 0 — Contain trust failures before feature work

1. Quarantine the 30 non-collated Congronglu records; retain only reviewed source text in public data.
2. Remove “complete” from Platform and distinguish case/chapter representation from full-text completion everywhere, including OG artwork.
3. Rename Verified copy to edition-verification language and resolve/withhold every rights-pending public quotation.
4. Stop running the old autonomous/content-wave scripts; mark them archived until replaced by source-driven imports.

**Exit gate:** no public Classical Chinese field is project-authored without structural and visible disclosure; no work is called complete on count-only evidence.

### Phase 1 — Functional correctness hotfix

1. Fix dossier `hidden` handling and add real-browser coverage.
2. Render direct chapter shapes and add chapter locators.
3. Move epilogue after cases.
4. Make collection-specific commentary labels data-driven.
5. Render all units before Print/PDF or explicitly label “print loaded units only.”
6. Validate `collapsedCases` as a plain record.
7. Add a visible fatal-load state.

**Exit gate:** Lineage opens visibly; all ten Platform cards show expected content; full Wumenguan print has 48 cases and epilogue last.

### Phase 2 — Validator and test credibility

1. Define explicit unit schemas for every content shape and negative fixtures.
2. Execute JSON Schema against applicable records or stop describing it as an executed gate.
3. Add per-field provenance/collation status and generic unit locators.
4. Replace count-only completion with multi-dimensional coverage.
5. Add duplicate source-text placeholder detection.
6. Fix browser title expectation; make required browser jobs fail when skipped.
7. Add behavior tests for all defects in this audit, plus HTML validation, link checking, JS lint, and accessibility checks.

**Exit gate:** each current P0/P1 has a failing-before/passing-after regression test.

### Phase 3 — Responsive and accessible design pass

1. Use one coherent sidebar/mobile-picker breakpoint.
2. Measure header height through CSS/JS and offset all sticky tools below it.
3. Show mobile reader controls only in Reader; use safe start-aligned overflow.
4. Simplify long sticky case indexes.
5. adopt contrast-safe active/status tokens in both themes.
6. Add `aria-pressed`, correct radio behavior, `aria-describedby`, live search announcements, and `aria-controls`.
7. Run keyboard, screen-reader, 320/375/768/1024/1440 px, zoom, and forced-colors review.

### Phase 4 — Documentation and operations cleanup

1. Choose one current-state truth file and make all other long reports explicitly historical.
2. Regenerate coverage tables from metrics rather than hand-copying values.
3. Update README/HANDOFF/ROADMAP/RESEARCH_RELEASE_PLAN contradictions and broken links.
4. Add repository description/homepage/topics, contribution/security/citation guidance, and issue templates.
5. Update the CI artifact list to include `docs/og-image.svg` as well as theme/robots/sitemap; this remains a manual workflow edit under repository policy.
6. Verify branch protection with an administrator; this audit’s token cannot read the setting.

### Phase 5 — Architecture/performance after correctness

1. Split app views and shared libraries into CSP-compatible ES modules.
2. Split validator concerns and create unit tests.
3. Lazy-load corpus documents and render hidden views on activation.
4. Bound/reset citation detail registries.
5. Consider a generated static research/citation layer for discoverability and unit permalinks.

## 7. Limitations

- Chromium could not be downloaded due sandbox network resets, so responsive and computed-style findings are code/CSS analysis rather than screenshots; the browser suite itself was reviewed line by line.
- Direct HTTPS requests to the live Pages host failed from the sandbox TLS path; GitHub’s Pages API and successful deployment run establish current deployment status, not full live visual correctness.
- This is not legal advice; rights findings compare repository policy, manifest state, public copy, and bundled records.
- This was not a complete sinological collation of 107,563 CJK characters. The Congronglu P0 is independently demonstrable from exact repeated placeholder strings and their generating scripts; other source text still needs qualified editorial review.
- Branch protection could not be read because the GitHub integration returned 403; any statement that it is definitely disabled should be re-verified by an administrator.

## 8. One-sentence summary

**The project’s static pipeline is strong, but it is not release-ready until undisclosed Congronglu placeholders, false completion, unresolved rights semantics, broken dossier/chapter/print behavior, and the validators/tests that missed them are corrected.**
