# Agent Handoff

> **Last updated:** 2026-08-10, session `arena/019fecb1-translatechan`
> **Current fixed branch:** `arena/019fecb1-translatechan` — do not switch or push elsewhere.
> **Baseline:** `27ca2243ed9d9bc012c2b41119e6f160cffe9694` (`main`, merged PR #17).
> **Evidence:** [`sessions/AUDIT_RESPONSE_2026-08-10_019fecb1.md`](../sessions/AUDIT_RESPONSE_2026-08-10_019fecb1.md) · [`sessions/RELEASE_BLOCKERS_2026-08-10_019fecb1.md`](../sessions/RELEASE_BLOCKERS_2026-08-10_019fecb1.md)

## Current state

The full senior engineering/web-design audit and the user-selected release-blocker follow-up are complete. Current weighted score is **7.0/10** (`582/83`); `repo_ready = fail`. All `user_score` fields remain `null`.

## Completed this session

- Reconciled unsupported 7.6 score arithmetic, stale branch/design claims, release wording, current audit/handoff, and plans.
- Fixed Lineage graph/directory mode with one semantic `hidden` / `.active` / `aria-pressed` state path.
- Added explicit button/group/target semantics and reset phone quote placement to one column.
- Added required-bundle validation and top-level initialization recovery.
- Added a focusable `role="alert"` fatal panel with safe explanatory copy, reload, and diagnostic.
- Smoke behavior-tests both modes and executes missing-bundle recovery in an isolated VM.
- Playwright covers computed mode visibility/attributes, mobile directory overflow, and aborted-bundle recovery.

Source corpus data and workflow YAML remain unchanged.

## Highest-priority remaining findings

1. **Non-case validation:** JSON Schema has no root application and is not executed; `sections:[42]` and a heading-only chapter pass with zero errors.
2. **Browser evidence:** Playwright exits 0 on missing Chromium, is absent from CI, and currently could not install; screenshots, dark/tablet, axe, and owner approval remain.
3. **Rights/references:** all 14 rights records need human review; 3 verified quotations have pending references.
4. **Security/privacy:** CSP follows the synchronous theme script, allows inline styles, runtime fonts are external, and no security policy exists.
5. **Accessibility:** pinyin/collapse state, tooltip relationships, radio arrows, search announcements, and formal screen-reader evidence remain.
6. **Operations:** four mirrored paths are absent from CI diff; actions emit Node 20 deprecation warnings; branch protection is unverified.
7. **Editorial depth:** 33 document-level locator migrations, Biyanlu/Linji field review, 30 lineage edges, and 34 profile reviews remain.

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

1. Add strict per-shape non-case validation and checked-in negative fixtures.
2. Add non-skippable browser/axe/overflow/screenshots; obtain explicit owner visual approval.
3. Complete rights/reference and field-level source review.
4. Harden CSP/fonts/security guidance and remaining interaction semantics.
5. Apply owner-approved operations edits.
6. Remove remaining inline styles/dead CSS, then measure lazy room/data loading.

## Quality evidence

```text
compile / validator / build / JS syntax / smoke / mirrors   PASS
isolated missing-bundle recovery                            PASS
semantic Lineage mode regression                            PASS
npm audit                                                    PASS; 0 vulnerabilities
Markdown links / duplicate IDs / XML                         PASS
focused ESLint                                               PASS; 0 errors / 0 warnings after fixes
focused Stylelint                                            1 duplicate declaration
HTML validator                                               35 findings before fixes
Playwright runtime                                           SKIP; no Chromium
Chromium installation                                        FAIL; ECONNRESET
GitHub main Quality + Pages                                  PASS at 27ca224
```

## Manual workflow/admin work

Do not edit `.github/workflows/*` without explicit user instruction. Exact edits are in [`manual-workflow-edits.md`](./manual-workflow-edits.md): add all mirror paths, review/update deprecated action majors, and have an administrator verify/require Quality. A future non-skippable browser/a11y job also requires approval.

## Stable contracts

- Public brand: Fake Chan Factory; internal identifiers remain `translatechan_*`.
- Public views: Reader, Matrix, Lineage, Gong'an, Lexicon only.
- No generated canonical-looking Chinese.
- N/N representation never establishes completion.
- Edition verification and rights approval are separate.
- Congronglu stays quarantined without authoritative TEI/per-field review.
- Do not infer approval or user scores from merge/silence.
- Before every code/data push: compile, validate, build, smoke, and compare mirrors.
