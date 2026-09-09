# Agent Handoff

> **Last updated:** 2026-09-09 · **Session:** `arena/01a087ea-translatechan`
> **Fixed branch:** `arena/01a087ea-translatechan` — do not switch or push elsewhere.
> **Main deployment:** `63dfe37` (PR #18 merged) · **Latest implementation:** lineage corpus-key curation PR (this session) · **Pages:** built

## Current state

**2026-09-09 (PR-C):** lineage corpus-key curation closed the six-profile `linked_corpus_keys` gap. Yaoshan Weiyan, Yunyan Tansheng, and Longtan Chongxin gained passage-verified keys (Longtan confirmed as one master across Wumenguan/Deshan/Biyanlu); prajnatara, yangqi_fanghui, and dahong_zuzheng keep empty keys with dated 2026-09-09 corpus-negative notes in `profile_evidence.note` and the review queue (the biyanlu 方會 hits are the grammatical phrase "would then understand", not the master). Validator lineage warnings dropped **6 → 3**; all remaining empties are documented honest negatives. Cross-reference metadata only — no evidence status, review status, priority, or completion claim changed.

The owner said the GitHub Pages design was **too plain/generic** and focused **too heavily on Chinese characters**, then selected **preserve the walnut-hall direction**. The 2026-08-11 session implemented a bolder English-first walnut/factory identity across the shell, hero, room headings, Reader hierarchy, secondary rooms, mobile controls, and Open Graph image.

That session also added visible recovery for missing/malformed data and top-level initialization failures, moved CSP before every script, progressively removed repetitive visible copy while retaining on-demand provenance, extended smoke/browser coverage, completed a full repository audit, and corrected scoreboard arithmetic. The owner then requested documentation/handoff completion and PR #18 merge; main Quality and Pages deployment both passed.

Current weighted score: **7.2/10**; `repo_ready = fail`. All `user_score` fields remain `null`; the owner supplied qualitative, not numeric, feedback. PR-C raised `content_quality` AI 6 → 7 on evidence (weighted overall unchanged when rounded).

## Current measured state

```text
corpus=35 | slots=1252 | verified=177 | matrix=21 | locators=148/148
content CJK=103,723 | all-string CJK=109,185
complete=2 | partial=2 | excerpt seeds=31
lineage=34/30 edges | glossary=31 | gong'an=24
bundle=1,594,154 bytes raw | 497,352 gzip-9
local first-load estimate≈556 KB gzip before fonts
```

## Verification

```text
compile                         PASS
semantic validator             PASS; 3 lineage warnings (was 6 before 2026-09-09)
build + root/docs sync         PASS
smoke (35 renderers)           PASS
npm audit                      PASS; 0 vulnerabilities
HTML / Markdown link scan      PASS
branch + PR Quality            PASS; through e6e24bf
main Quality + Pages           PASS; 31490146548 / 31490145334
Playwright                     SKIP; Chromium unavailable
```

Browser download failed with network `ECONNRESET`; apt package sources were also unreachable. Do not describe this session as screenshot-verified.

## Remaining blockers

1. All 14 rights-manifest sources require human or jurisdiction review.
2. Biyanlu, Linji, Platform, and excerpt seeds need deeper field-level source review.
3. Browser execution remains skippable and is not required in CI; current screenshots are unavailable.
4. CI omits four mirrored paths; branch protection is unconfirmed.
5. Full bundle and all hidden rooms initialize up front.
6. Forty-one generated inline styles keep CSP `unsafe-inline` necessary.
7. Three lineage profiles lack linked corpus keys (prajnatara, yangqi_fanghui, dahong_zuzheng — frontier scaffolds with no active-corpus occurrence; reviewed 2026-09-09); 30 edges await exact locators.

## Recommended next sequence

1. Verify the published site in a real browser when Chromium is available.
2. Continue human rights/source review as a separate content tranche.
3. Apply workflow/browser/a11y changes only with explicit owner approval.
4. Measure browser performance before lazy-rendering rooms or splitting the bundle.

## Stable contracts

- Public brand: Fake Chan Factory; internal `translatechan_*`, `window.TranslateChan`, and `TRANSLATECHAN_DATA` remain.
- Public views: Reader, Matrix, Lineage, Gong'an, Lexicon only.
- Deployment: native GitHub Pages from `main /docs`, HTTPS.
- No source-looking Chinese may be generated or restored from quarantined history.
- N/N unit representation never establishes completion without explicit editorial status.
- Edition verification and rights approval are separate.
- Workflow changes require explicit user approval; exact edits remain in `.scoreboard/manual-workflow-edits.md`.
- Before each push: compile, validate, build, smoke, and compare root/docs mirrors.

## Canonical evidence

- [`../sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md`](../sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md)
- [`../AUDIT.md`](../AUDIT.md)
- [`../SCOREBOARD.md`](../SCOREBOARD.md)
- [`../HANDOFF.md`](../HANDOFF.md)
