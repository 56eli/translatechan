# Senior Developer & Web Designer Audit — Session `019fecb1`

> **Date:** 2026-08-10 UTC  
> **Branch:** `arena/019fecb1-translatechan`  
> **Baseline:** `27ca2243ed9d9bc012c2b41119e6f160cffe9694` (`main`)  
> **Scope:** repository architecture, frontend implementation, responsive design, UX, accessibility, security/privacy, data integrity, editorial governance, tests, CI/CD, deployment, documentation, and maintainability.

## Audit status

Full audit in progress. This dated report is the durable evidence file for the session; current summaries and handoff documents will be reconciled only after all findings have been verified.

## Verified automated baseline

```text
Python compile                              PASS
Semantic data/document validator            PASS with 6 known lineage-link warnings
Deterministic bundle build                  PASS (35 documents; 1,594,154 bytes)
JavaScript syntax                           PASS
Dependency-free renderer smoke              PASS (35 documents; 0 crashes)
Root/docs data mirror                       PASS
Root/docs deploy assets                     PASS, including all four CI-omitted paths
npm audit                                   PASS (0 vulnerabilities)
Markdown relative links                     PASS
HTML duplicate IDs                          PASS (52 IDs; no duplicates)
XML parse (sitemap and OG SVG)               PASS
Live GitHub Pages API                       BUILT; main/docs; HTTPS enforced
Main Quality and Pages runs                 PASS at baseline commit
Real-browser suite                          SKIP with exit 0 (Chromium unavailable)
Playwright Chromium installation            FAIL (sandbox network ECONNRESET)
```

Current generated facts:

```text
corpus=35 | complete=2 | partial=2 | excerpt seeds=31
slots=1252 | verified corpus quotations=177 | matrix registers=21
verified references=176 recorded / 3 pending
locators=148/148 case-level | 33 document-level migration records
lineage=34 profiles | 30 pending internal edges | 4 frontiers
rights=14 manifest sources | 0 completed rights/jurisdiction reviews
glossary=31 terms | gong'an=24 entries
bundle=1,594,154 raw bytes | 497,606 gzip-9
first-party initial payload≈554 KB gzip-9 before fonts
```

## Confirmed interim findings

1. The machine scoreboard is arithmetically inconsistent: its 22 persisted effective scores produce **6.9/10** (`573 / 83` weighted points), while summary fields claim **7.6/10**.
2. Current documentation contradicts itself about whether design Phases C/D are complete, whether the old 1100/960 responsive mismatch remains, and whether the current score is 6.9 or 7.6.
3. `README.md` claims a top-level bundle-failure boundary was added, but only `.error-boundary-card` CSS exists; there is no fatal initialization fallback in `app.js`.
4. `README.md` contains a duplicated/corrupted deployment paragraph (`node scripts/mit to branches...`).
5. The CSP meta element follows the synchronous `theme-init.js`, so that script is outside the meta policy; the policy also retains `style-src 'unsafe-inline'` and runtime Google Fonts requests.
6. JSON Schema is loaded only enough to confirm `$schema` and `$defs`; source data is not actually evaluated against it.
7. The optional Playwright script explicitly exits zero when Chromium is absent and is not run by CI; therefore it cannot currently supply release evidence.
8. Static checks found 49 generated inline-style occurrences, one duplicate CSS declaration block, three unused JS values/parameters, and 35 HTML-validator findings (mostly implicit button types, plus raw ampersands and incomplete dynamic-dialog markup).
9. Accessibility state is incomplete for the mobile pinyin toggle and Lineage graph/directory mode buttons; tooltip relationships and a formal keyboard/screen-reader pass remain absent.
10. Editorial governance remains the largest product risk: all 14 rights records await human review, 33 non-case documents remain in the locator migration queue, all 30 internal lineage edges remain pending, and 3 verified quotations still have pending references.

The final report will severity-rank these findings, separate release blockers from maintainability debt, reconcile the scoreboard, and provide an ordered remediation plan.
