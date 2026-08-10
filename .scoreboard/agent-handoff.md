# Agent Handoff

> **Last updated:** 2026-08-10, session `arena/019fecb1-translatechan`
> **Current fixed branch:** `arena/019fecb1-translatechan` — do not switch or push elsewhere.
> **Baseline:** `27ca2243ed9d9bc012c2b41119e6f160cffe9694` (`main`, merged PR #17).
> **Evidence:** [`sessions/AUDIT_RESPONSE_2026-08-10_019fecb1.md`](../sessions/AUDIT_RESPONSE_2026-08-10_019fecb1.md)

## Current state

A full senior engineering/web-design audit is complete. Current weighted score is **6.6/10** (`551/83`); `repo_ready = fail`. All `user_score` fields remain `null`.

This session changed documentation only: it reconciled the unsupported 7.6 summary, stale branch/design claims, README release wording, roadmap counts, current audit/handoff, and scoreboard arithmetic. Application code, data, generated assets, and workflow YAML remain unchanged.

## Highest-priority findings

1. **Lineage directory is hidden:** `#lineage-content-target` retains its semantic `hidden` attribute; the mode handler sets only `style.display='grid'`. The dossier code correctly removes `hidden`, which demonstrates the required pattern.
2. **Non-case validation is weak:** JSON Schema has no root application and is not executed. Direct negative fixtures with `sections:[42]` and a heading-only chapter passed with zero errors.
3. **Browser evidence is optional:** Playwright exits 0 on missing Chromium, is absent from CI, and currently could not install. There are no current screenshots, dark/tablet coverage, axe, or owner approval.
4. **Rights/references are open:** all 14 rights records need human review; 3 verified quotations have pending references.
5. **Fatal state is CSS-only:** `.error-boundary-card` is never rendered by the application.
6. **Accessibility/responsive gaps:** pinyin and Lineage mode state, stale case-toggle labels, tooltip relationships, radio arrows, search announcements, and mobile Lineage quote-grid behavior.
7. **Operations:** four mirrored paths absent from CI diff; action majors emit Node 20 deprecation warnings; branch protection is unverified.

## Current measured state

```text
corpus=35 | slots=1252 | verified=177 | matrix=21 | locators=148/148
content CJK=103,723 | all-string CJK=109,185
complete=2 | partial=2 | excerpt seeds=31
rights sources=14 pending | verified refs=176 recorded / 3 pending
lineage=34 profiles | 30 pending edges | 4 frontiers
bundle=1,594,154 bytes raw | 497,606 gzip-9
```

## Recommended next sequence

1. Fix Lineage directory hidden state, pressed/selected semantics, and phone grid; add real-browser coverage.
2. Implement fatal bundle/init recovery and tests.
3. Add strict per-shape non-case validation and checked-in negative fixtures.
4. Add non-skippable browser/axe/overflow/screenshots; obtain explicit owner visual approval.
5. Complete rights/reference and field-level source review.
6. Apply owner-approved operations edits.
7. Remove remaining 49 inline styles/dead CSS, then measure lazy room/data loading.

## Quality evidence from this audit

```text
compile / validator / build / JS syntax / smoke / mirrors   PASS
npm audit                                                    PASS; 0 vulnerabilities
Markdown links / duplicate IDs / XML                         PASS
focused ESLint                                               0 errors; 3 warnings
focused Stylelint                                            1 duplicate declaration
HTML validator                                               35 findings
Playwright                                                   SKIP with exit 0
Chromium installation                                        FAIL; ECONNRESET
GitHub main Quality + Pages                                  PASS at 27ca224
```

## Manual workflow/admin work

Do not edit `.github/workflows/*` without explicit user instruction. Exact edits are in [`manual-workflow-edits.md`](./manual-workflow-edits.md): add all mirror paths, update deprecated action majors after review, and have an administrator verify/require Quality. A future non-skippable browser/a11y job also requires approval.

## Stable contracts

- Public brand: Fake Chan Factory; internal `translatechan_*`, `window.TranslateChan`, and `TRANSLATECHAN_DATA` remain.
- Public views: Reader, Matrix, Lineage, Gong'an, Lexicon only.
- No generated canonical-looking Chinese.
- N/N representation never establishes completion.
- Edition verification and rights approval are separate.
- Congronglu stays quarantined without authoritative TEI/per-field review.
- Do not infer approval or user scores from merge/silence.
- Before every code/data push: compile, validate, build, smoke, and compare mirrors.
