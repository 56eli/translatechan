# Agent Handoff

> **Last updated:** 2026-08-10, session `arena/019febb1-translatechan`
> **Current fixed branch:** `arena/019febb1-translatechan` — do not switch or push elsewhere.
> **Baseline:** `3ef77320d28cc2a627723d8ad709f9a13ba83c29` (`main`, merged PR #14).

## Current state

A fresh full-project audit is complete at [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](../sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md). It supersedes the previous “no P0/P1/P2 / 8.2” current verdict.

- Revised weighted score: **5.8/10**.
- `repo_ready`: **fail**.
- User scores: all `null`; do not infer or change them.
- Initial audit checkpoint was pushed as `45ea61b`; consult `git log` for the final documentation commit.
- No application/corpus remediation was made in this audit-only task.

## Active blockers, in order

1. **P0 Congronglu content integrity:** 28/35 public cases repeat the same generic Chinese Wansong commentary and Tiantong verse (plus repeated English), inserted by `scripts/ingest_*` snapshots and not marked as placeholders. Only five cases have page-level `collated_with_normalization` records; two custom seeds remain case-number anchored. Quarantine uncollated cases before expansion.
2. **P1 false completion:** Platform Sutra has 680 content CJK in excerpt-sized records but is labeled a complete 10/10 work. Biyanlu case-index coverage is also conflated with full selected-witness completion.
3. **P1 empty Platform chapters:** chapters 3, 6, 7, 8, 9, 10 use direct fields that `renderChapterItem()` ignores.
4. **P1 Lineage dossier:** HTML `hidden` is never removed; inline `display:block` cannot beat `.dossier-panel[hidden] { display:none !important; }`.
5. **P1 rights semantics:** all 14 rights sources remain review/jurisdiction-pending; public copy conflates edition verification with public-domain status.
6. **P2 reader/export:** Wumenguan epilogue renders before cases; Print/PDF includes only lazy-loaded units; all collections use the Wumen commentary label.
7. **P2 test credibility:** smoke passes all above; optional browser test expects the old `TranslateChan` title and exits 0 when skipped.
8. **P2 responsive/a11y:** 1100/960 breakpoint gap, sticky toolbar under header, Reader controls on every mobile view, and active-color contrast failures.

## Required remediation sequence

1. Contain source-integrity/completeness/rights-status issues.
2. Fix dossier, direct chapters, order, print, labels, storage shape, and fatal-load state.
3. Add failing regression tests and strict per-shape/field provenance validation.
4. Complete responsive/accessibility pass.
5. Clean stale current-state prose and apply owner-approved CI/branch-protection changes.
6. Resume corpus expansion or module/performance work only after re-audit.

Full exit criteria are in the audit’s [Remediation plan](../sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md#6-remediation-plan).

## Checks run during audit

```text
python3 -m py_compile scripts/*.py          PASS
python3 scripts/validate_data.py            PASS with 6 known lineage warnings
python3 scripts/build_data_bundle.py        PASS; 1,676,108-byte bundle
node scripts/smoke_test.mjs                 PASS; 36 fixtures, 0 crashes
diff -rq data docs/data                     PASS
npm audit --package-lock-only               PASS; 0 vulnerabilities
npm run test:browser                        SKIP; no Chromium
npx playwright install chromium             FAIL; network ECONNRESET
Markdown relative-link scan                 PASS after 2 documentation fixes
GitHub Quality + Pages at main 3ef7732       PASS
```

Browser/live-site limitations and legal/editorial scope are documented in audit §7.

## Manual GitHub work

Repository policy forbids editing `.github/workflows/*` without explicit user instruction. `.scoreboard/manual-workflow-edits.md` now records:

- add `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`, and `docs/og-image.svg` to the generated-artifact diff list;
- have an administrator verify/enable required Quality status checks on `main` (the integration returned 403 when this audit tried to read protection state).

## Stable project contracts

- Public brand: Fake Chan Factory; internal `translatechan_*`, `window.TranslateChan`, and `TRANSLATECHAN_DATA` names remain for continuity.
- Public scope: Reader, Matrix, Lineage, Gong’an, Lexicon only.
- Static Pages deployment: `main /docs`, HTTPS.
- Keep Robo/verified disclosure explicit, but distinguish **edition verification** from **rights approval/public-domain status**.
- Preserve the approved minimal Chinese Chan-hall direction; correctness and scholarly trust come before more visual polish.
- Before any push after code/data work: compile, validate, build, smoke, and compare `data` with `docs/data`.
