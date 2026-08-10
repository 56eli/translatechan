# 🔍 Fake Chan Factory — Current Audit & Session Index

> **Current evidence:** [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md)
> **Convention:** this file contains only the current verdict, blockers, checks, and session index. Dated reports are historical snapshots and may contain metrics or conclusions superseded here.

## 1. Current verdict — 2026-08-10, session `019febb1`

**Not release-ready: content/public behavior is fixed and shell/Reader Phase A+B is implemented; four-room visual completion, rights, and operations blockers remain; current score is 6.9/10 and `repo_ready = fail`.**

The user-selected containment pass removed the entire unreliable Congronglu seed, its locator claims, and the obsolete scripts that generated it. Authoritative CBETA T48n2004 headings showed that even the five records previously labeled collated had wrong case numbers and page claims. Completion now requires explicit editorial status instead of N/N arithmetic. The functional follow-up then fixed the hidden Lineage dossier, six direct Platform chapter bodies, Wumenguan epilogue order, full lazy-unit Print/PDF, and collection labels with regression coverage. Owner feedback then rejected the visual-completion claim. Owner-approved Phase A+B now implements the walnut shell and Reader literature hierarchy; visual-system consolidation, four secondary rooms, screenshots, and owner approval remain alongside rights/source/error/operations work.

Current generated measurements:

- Corpus: **35 documents**; Wumenguan **48/48 cases** complete selected witness and Xinxin Ming 37/37 complete selected witness; Biyanlu **100/100 cases** are represented but explicitly partial; Platform 10/10 headings are excerpt representation, not completion; **31 excerpt seeds** and two partial witnesses; **103,723 content CJK / 109,185 all-string CJK**.
- Translations: **1252 corpus slots**; **177 verified quotations**; **21 matrix registers**; verified-reference coverage **176 recorded / 3 pending**. “Verified” now means edition/wording checked; rights approval/public-domain status remains separate.
- Locators: **148/148 case-level**; **33 document-level seeds**. A case-number anchor does not prove every nested source field was collated.
- Lineage: **34 masters**; **12 controlled `school_key` groups**; **30 edge records + 4 frontiers**; all edges remain traditional/pending.
- Glossary: **31 terms**; Gong'an index: **24 entries**.
- Bundle: 1,594,154 raw bytes; about 498 KB at gzip level 9. Root and `/docs` are synchronized.
- Deployment: PR #15 merged as `26feff0`; main Quality and Pages deployment succeeded; live visual owner review pending.

## 2. Active blockers

1. **Contained P0 — Congronglu:** active data/locators/scripts removed; anti-placeholder validation added; reintroduction requires source-pinned T48n2004 TEI and field-level review.
2. **Fixed P1 — public behavior:** dossier, direct chapters, epilogue order, full Print/PDF, and collection labels are corrected and regression-tested.
3. **P1 — design completion:** shell/Reader Phase A+B is implemented; continue Phases C–E in [`sessions/WEB_DESIGN_GAP_PLAN_2026-08-10.md`](./sessions/WEB_DESIGN_GAP_PLAN_2026-08-10.md) and [`sessions/DESIGN_PHASE_AB_2026-08-10.md`](./sessions/DESIGN_PHASE_AB_2026-08-10.md).
4. **P1 — public quotation governance:** all 14 rights sources are still review/jurisdiction-pending; edition verification is separate from rights/public-domain status.
5. **P2 — source modeling:** extend explicit completion status into field-level coverage/human review, especially Biyanlu and Platform.
6. **P2 — test operations:** real-browser regressions now cover the fixed behavior, but execution remains skippable when Chromium is absent and is not in CI.
7. **P2 — responsive/accessibility:** fix sticky/header offsets, 1100/960 breakpoint mismatch, cross-view mobile Reader bar, contrast, pressed/radio/tooltip semantics.

Detailed evidence and phased exit criteria: [full audit §§3–7](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md#3-severity-ranked-findings).

## 3. Checks run

```text
python3 -m py_compile scripts/*.py          PASS
python3 scripts/validate_data.py            PASS with 6 lineage warnings
python3 scripts/build_data_bundle.py        PASS; 1,594,154 bytes; root/docs synced
node scripts/smoke_test.mjs                 PASS; 35 fixtures, 0 crashes
anti-placeholder negative fixture           PASS
diff -rq data docs/data                     PASS
npm audit --package-lock-only               PASS; 0 vulnerabilities
npm run test:browser                        SKIP; Chromium unavailable
Chromium install                            FAIL; sandbox network ECONNRESET
Markdown relative-link scan                 PASS after 2 documentation fixes
GitHub Quality + Pages at main 3ef7732       PASS
Audit branch Quality                          PASS; action-runtime deprecation warning
```

A passing validator/smoke run currently establishes structural consistency and no stub-render crash; it does **not** clear the blockers above.

## 4. Session reports

| Date | Session | Report | Historical outcome |
|---|---|---|---|
| 2026-08-10 | `019febb1` | [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md), [`sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md`](./sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md), [`sessions/FUNCTIONAL_HOTFIX_2026-08-10.md`](./sessions/FUNCTIONAL_HOTFIX_2026-08-10.md), [`sessions/WEB_DESIGN_GAP_PLAN_2026-08-10.md`](./sessions/WEB_DESIGN_GAP_PLAN_2026-08-10.md), [`sessions/DESIGN_PHASE_AB_2026-08-10.md`](./sessions/DESIGN_PHASE_AB_2026-08-10.md) | **Current:** audit, containment, functional hotfix, design plan, and owner-approved shell/Reader implementation |
| 2026-08-10 | `019feaf5` | [`FULL_AUDIT_2026-08-10_019feaf5.md`](./FULL_AUDIT_2026-08-10_019feaf5.md), [`WEB_VISION_2026-08-10.md`](./WEB_VISION_2026-08-10.md), [`AUDIT_UPDATE_2026-08-10_hero.md`](./AUDIT_UPDATE_2026-08-10_hero.md) | Website vision, hero/OG/footer changes; prior 8.2 verdict now superseded |
| 2026-08-10 | `019feabb` | [`sessions/SESSION_AUDIT_2026-08-10_019feabb.md`](./sessions/SESSION_AUDIT_2026-08-10_019feabb.md), [`docs/audits/2026-08-10-baseline.md`](./docs/audits/2026-08-10-baseline.md) | Scoreboard baseline, layout work, Congronglu expansion; prior verdict superseded |
| 2026-08-10 | `019fea62` | [`sessions/SESSION_AUDIT_2026-08-10_019fea62.md`](./sessions/SESSION_AUDIT_2026-08-10_019fea62.md) | Routing/scroll/a11y fixes |
| 2026-08-09 | `019fe8a2` | [`sessions/AUDIT_RESPONSE_2026-08-09_019fe8a2.md`](./sessions/AUDIT_RESPONSE_2026-08-09_019fe8a2.md), [`sessions/ROBO_REGISTERS_PILOT_Case1.md`](./sessions/ROBO_REGISTERS_PILOT_Case1.md) | Robo rebrand/profiles/settings and quotation campaign |
| 2026-08-09 | `019fe731` | [`sessions/AUDIT_RESPONSE_2026-08-09_019fe731.md`](./sessions/AUDIT_RESPONSE_2026-08-09_019fe731.md) | A11y/search fixes, Biyanlu/Linji campaign |
| 2026-08-09 | `019fe64a` | [`sessions/AUDIT_RESPONSE_2026-08-09_019fe64a.md`](./sessions/AUDIT_RESPONSE_2026-08-09_019fe64a.md), [`sessions/STRUCTURAL_ASSESSMENT_2026-08-09_019fe64a.md`](./sessions/STRUCTURAL_ASSESSMENT_2026-08-09_019fe64a.md) | Schema/provenance/SEO and structure work |
| 2026-08-09 | `019fe5d5` | [`sessions/SESSION_AUDIT_2026-08-09_019fe5d5.md`](./sessions/SESSION_AUDIT_2026-08-09_019fe5d5.md) | Vocabulary/doc-gate/escaping work |
| 2026-08-08 | `019fe30b` | [`sessions/SESSION_AUDIT_2026-08-08_019fe30b.md`](./sessions/SESSION_AUDIT_2026-08-08_019fe30b.md) | CSP/a11y/metrics/browser suite and early Biyanlu pilot |
| 2026-08-08 | earlier | [`sessions/SESSION_AUDIT_2026-08-08.md`](./sessions/SESSION_AUDIT_2026-08-08.md), [`sessions/AUDIT_archive_2026-08-08.md`](./sessions/AUDIT_archive_2026-08-08.md) | Initial repair and audit history |

## 5. Maintenance rule

- Update §§1–3 only when current evidence changes.
- Add one concise row per completed session.
- Keep detailed process in a dated `sessions/` report, not in this file or HANDOFF.
- Never infer user scores; see [`SCOREBOARD.md`](./SCOREBOARD.md).
