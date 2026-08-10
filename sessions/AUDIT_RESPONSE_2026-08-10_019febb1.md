# Full Senior Developer & Web Design Audit — 2026-08-10

> **Session:** `arena/019febb1-translatechan`  
> **Baseline:** `3ef77320d28cc2a627723d8ad709f9a13ba83c29` (`main`, PR #14)  
> **Scope:** architecture, code, data/editorial integrity, rights, tests, CI/deployment, security/privacy, performance, responsive UX, visual system, accessibility, SEO, documentation, and repository operations.  
> **Status:** audit in progress; this checkpoint is pushed to preserve the evidence collected so far.

## Checkpoint verdict

The static architecture and deterministic data pipeline are strong, and all current automated gates pass, but previous “no P0/P1/P2” and 8.2/10 conclusions are too optimistic. The audit has already confirmed material scholarly-completeness, rights-release, responsive-layout, print, accessibility, schema, browser-test, and documentation-truthfulness gaps that the existing gates do not detect.

## Checks completed

```text
python3 -m py_compile scripts/*.py          PASS
python3 scripts/validate_data.py            PASS with 6 lineage warnings
python3 scripts/build_data_bundle.py        PASS; 1,676,108-byte bundle
node scripts/smoke_test.mjs                 PASS; 36 renderer fixtures, 0 crashes
diff -rq data docs/data                     PASS
npm audit --package-lock-only               PASS; 0 vulnerabilities
npm run test:browser                        SKIP; Chromium unavailable
npx playwright install chromium             FAIL; repeated network ECONNRESET
internal Markdown-link scan                 2 broken relative links
root/docs asset byte comparisons            PASS
GitHub Quality run at main 3ef7732           PASS
GitHub Pages API                            built; main /docs; HTTPS enforced
live-site HTTP probe                        INCONCLUSIVE; sandbox TLS closed
```

Measured transfer sizes at gzip level 9: `index.html` 5.8 KB, `app.css` 9.9 KB, `app.js` 37.8 KB, `app_data.js` 522.2 KB; approximately 576 KB before fonts and protocol overhead.

## Confirmed high-priority findings so far

### 1. “Complete text” is inferred from container counts, not textual completeness

`complete_document_keys()` only asks whether a file has as many top-level units as its manifest target. It never validates whether each chapter/case contains the complete selected source. This makes `platform_sutra` “10/10 chapters complete” despite only 680 source-content CJK characters and excerpt-sized selections in each chapter. The file itself claims “complete across the entire Platform Sutra,” the UI gives it a green complete-text check, metrics call it complete, and multiple docs repeat the claim. This is a scholarly-disclosure defect, not a cosmetic wording nit.

Biyanlu is similarly “100/100 cases” under a narrowed field contract while its own coverage note says post-verse commentary/rendering and human sign-off remain pending. Case-index completeness and full-work completeness must become separate statuses.

### 2. The public release contains unresolved modern-quotation rights decisions

All 14 rights-manifest records remain either `needs_rights_review` (12) or `jurisdiction_review_required` (2); none has an approved editorial decision. Of 177 verified corpus quotations, 53 resolve to copyrighted/uncertain or online-rights-unverified sources; the Matrix adds one more unresolved Blyth quotation. The project’s own research-release plan says a verified quotation requires an editorial rights decision, yet these records are publicly bundled now.

The UI compounds this by describing the verified badge as “genuine public-domain (or verified)” and repeatedly saying verified public-domain text receives the badge, even though “verified” currently means wording/edition verification, not public-domain or reuse approval. This is a release-governance risk, not a finding of infringement; qualified human rights review is required.

### 3. Reader order is wrong for Wumenguan

`renderReader()` appends the epilogue immediately after the preface and only then appends cases. The reader therefore presents Wumen’s epilogue before cases 1–48. The source file may be ordered correctly, but the public reading experience is not.

### 4. Print/PDF silently exports only lazy-loaded units

The print button calls `window.print()` without first rendering all units. Wumenguan and Biyanlu initially have only 12 cases in the DOM, and Linji only 12 sections. The print stylesheet expands collapsed DOM nodes but cannot print units that were never rendered. The current browser test checks only that one case remains visible in print, so it misses the incomplete export.

### 5. Responsive layout and sticky controls have structural defects

- At 961–1100 px, `.reader-layout` becomes one column but the desktop sidebar is not hidden until 960 px. A large, sticky, up-to-viewport-height 36-work selector is placed above the reading content on common tablet/laptop widths.
- `.reader-toolbar` is `position: sticky; top: .25rem; z-index: 50`, while the global header is sticky at `z-index: 100`. The toolbar sticks behind the header because `.content-panel` is not a scrolling container; the comment claiming otherwise is incorrect.
- The mobile reading bar appears on Matrix, Lineage, Gong’an, and Lexicon views even though all of its controls affect the hidden Reader.
- The horizontally overflowing mobile bar uses `justify-content: center`, a combination that can clip its leading controls, and body bottom padding does not include the bar’s safe-area inset.
- The lineage graph still forces a 720 px minimum logical width on narrow devices.

### 6. WCAG contrast and state semantics are not at the claimed level

White text on the light gold active background is about 4.28:1 and on the dark-theme gold about 2.46:1, failing 4.5:1 for the small nav/filter text. Dark-theme green and blue status text on cards are also around 4.1:1, and red is around 3.45:1. Active reader modes and Gong’an filters do not expose `aria-pressed`; settings use `role=radio` without the expected keyboard radio-group behavior; generated tooltips are not related to their triggers with `aria-describedby`.

### 7. The “JSON Schema” is not executed as a schema

`validate_data.py` only confirms that the schema file contains `$schema` and `$defs`; it never applies those definitions to any data. The schema has no root validation target, omits most auxiliary shapes, and disagrees with the Python validator on strictness. The Python semantic validator is valuable, but documentation calling the setup schema validation is misleading.

The validator only deeply checks case units. Non-case collections can contain structurally incomplete unit objects, and completion can still be awarded from list length. Generic per-shape unit validation and unit-level locator enforcement are missing.

### 8. The optional browser suite is stale and can report a false-successful skip

The real-browser suite’s first test expects the page title to contain `TranslateChan`, while the current title is `Fake Chan Factory`; it would fail if Chromium ran. In this environment it prints SKIP and exits 0, so unavailable browser coverage looks successful to automation. The suite also does not detect incomplete printing, responsive 1024 px behavior, horizontal overflow, contrast, or visual regressions.

### 9. “Doc truthfulness” checks presence, not contradictions

The validator looks for selected live snippets but does not reject stale contradictory text. Confirmed examples:

- README says 34/36 excerpt seeds while metrics say 32; it later names four complete works.
- README says Xinxin Ming has only opening stanzas and Platform Sutra is 4/10 while elsewhere calling both complete.
- HANDOFF says only Wumenguan/Biyanlu are complete and 34 files are seeds, then later says four complete.
- ROADMAP still says Platform 4/10, Linji 67 sections, and 150 case locators.
- RESEARCH_RELEASE_PLAN’s “current baseline” says Wumenguan alone is complete, Biyanlu is 14/100, there are 57 locators, 138 verified records, and five pending references.
- SCOREBOARD’s risk text uses 1,342 slots / 966 reconstructions instead of 1,352 / 976.
- `.scoreboard/agent-handoff.md` tells the next agent to work on an old fixed branch and says it is ready to merge.
- `response_summary.md` says the already-merged PR #14 is still ready for PR merge.
- Two historical Markdown links are broken.

### 10. CSP placement and privacy claims need correction

The CSP meta tag appears after synchronous `theme-init.js`, so that bootstrap script is parsed/executed before the policy applies. Move CSP immediately after charset/viewport or serve it as an HTTP header. The app also contacts Google Fonts on every uncached visit; that is a third-party privacy/performance dependency despite “zero runtime dependencies.” Self-hosting or system fonts would make the privacy and resilience story match the architecture.

## Other confirmed inconsistencies

- Hero code computes 8 unique non-AI Matrix translator names and displays “8 Robo-Translators,” while initial HTML and OG artwork say 21; 21 is the number of Matrix rows/register slots or profiles, not unique Matrix translators.
- `og-image.svg` repeats the questionable “4 complete scrolls” status, uses SVG despite uneven social-card support, and lacks `og:image:width`, `height`, `type`, and alt metadata.
- Citation detail registrations accumulate in a never-cleared `Map` on rerenders.
- Malformed but valid JSON in `translatechan_collapsed_cases` (for example `1`) can cause a strict-mode TypeError when a case is toggled; the storage code handles syntax errors but does not validate the parsed shape.
- Default Bilingual mode prefers Red Pine/Cleary Robo entries over available verified quotations, weakening the promised citable baseline.
- There is no shareable URL for an individual case/unit and no direct canonical-source deep link.
- Hash-only views have one sitemap URL and no static/noscript corpus content, limiting discoverability and link previews.
- The public repository has no description, homepage, topics, `CONTRIBUTING.md`, `SECURITY.md`, `CITATION.cff`, editor config, JS lint configuration, or issue templates.
- Generated/source mirroring accounts for most tracked bytes; useful for no-build Pages deployment, but repository organization and review diffs are noisy.

## Strengths confirmed

- Deterministic source → metrics → bundle → `/docs` flow is simple and reproducible.
- Root and deployed mirrors are synchronized.
- Translation status is structural, visible, and aggressively escaped in the UI.
- No runtime JavaScript package dependency and no npm audit findings.
- Search normalization, lazy rendering, hash routing, storage fail-soft behavior, reduced-motion support, controlled vocabularies, and shared popovers are thoughtful.
- Current Quality and Pages runs are green at the audited main commit.
- Data counts, rights source resolution, manifest agreement, case locator coverage, and generated artifact freshness are guarded better than in most small static research apps.

## Audit work remaining after this checkpoint

Finalize severity ranking and score changes, reconcile the prior scoreboard with this evidence, complete the design/architecture recommendations and phased remediation plan, update durable handoff/summary documentation, rerun all gates, commit, and push the final report.
