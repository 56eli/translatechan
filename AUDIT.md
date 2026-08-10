# Fake Chan Factory — Current Audit & Session Index

> **Current evidence:** [`sessions/AUDIT_RESPONSE_2026-08-10_019fecb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019fecb1.md)
> **Convention:** this file contains only the current verdict, blockers, checks, and session index. Dated reports are historical snapshots and may contain metrics or conclusions superseded here.

## 1. Current verdict — 2026-08-10, session `019fecb1`

**Not release-ready: 7.0/10 and `repo_ready = fail`.** The product purpose, static pipeline, provenance disclosure, visual direction, Lineage directory modes, and fatal bundle recovery are strong, but non-case source shapes are weakly validated, browser/accessibility evidence is optional, all quotation-rights decisions remain open, security hardening remains, and operations gates are incomplete.

Current generated measurements:

- Corpus: **35 documents**; Wumenguan **48/48 cases** complete selected witness and Xinxin Ming 37/37 complete selected witness; Biyanlu **100/100 cases** is explicitly partial; Platform 10/10 headings are excerpt representation, not completion; **31 excerpt seeds** and two partial witnesses; **103,723 content CJK / 109,185 all-string CJK**.
- Translations: **1252 corpus slots**; **177 verified quotations**; **21 matrix registers**; verified-reference coverage **176 recorded / 3 pending**. Edition verification is separate from rights approval.
- Locators: **148/148 case-level**; **33 document-level seeds**. A case-number anchor does not prove every nested source field was collated.
- Lineage: **34 masters**; **12 controlled `school_key` groups**; **30 edge records + 4 frontiers**; all internal edges remain traditional/pending.
- Glossary: **31 terms**; Gong'an index: **24 entries**.
- Bundle: 1,594,154 raw bytes; 497,606 bytes at gzip level 9. Root and `/docs` are synchronized.

## 2. Active blockers

1. **P1 — rights and citations:** all 14 rights records require human review; 3 verified quotations retain pending references.
2. **P1 — validation:** JSON Schema is not executed and has no root application; malformed/empty non-case units pass the Python validator.
3. **P1 — browser evidence:** Playwright exits zero when unavailable and is not in CI; no current screenshots, axe run, dark/tablet suite, or owner approval exists.
4. **P2 — accessibility:** pinyin/collapse state, tooltip relationships, radio behavior, search announcements, and full screen-reader evidence need correction.
5. **P2 — security/privacy:** CSP order, `unsafe-inline` style dependence, runtime Google Fonts, and missing security policy remain.
6. **P2 — operations:** four mirrored paths are absent from CI diff coverage; action versions emit Node 20 deprecation warnings; branch protection remains unverified.
7. **P2 — editorial depth:** 33 document-level locator migrations, Biyanlu/Linji review, 30 lineage edges, and 34 profile reviews remain.
8. **Contained P0 — Congronglu:** active unreliable data/locators/scripts remain removed; reintroduction requires authoritative TEI, per-field provenance, negative fixtures, and human review.

Completed after the audit: Lineage graph/directory mode now synchronizes `hidden` and `aria-pressed`, its phone grid is reset, and missing/malformed bundles render a focusable reload boundary; see [`sessions/RELEASE_BLOCKERS_2026-08-10_019fecb1.md`](./sessions/RELEASE_BLOCKERS_2026-08-10_019fecb1.md).

## 3. Checks run

```text
Python compile + JS syntax                  PASS
Data validator                              PASS with 6 known lineage warnings
Build + root/docs mirrors                   PASS (1,594,154 bytes)
Dependency-free smoke                       PASS (35 fixtures; 0 crashes; mode/fatal regressions)
npm audit                                   PASS (0 vulnerabilities)
Markdown links / IDs / XML                  PASS
Focused ESLint                              0 errors; 3 warnings
Focused Stylelint                           1 duplicate declaration
HTML validation                             35 findings
Playwright                                  SKIP with exit 0; Chromium unavailable
Chromium install                            FAIL; sandbox network ECONNRESET
GitHub Quality + Pages at main 27ca224       PASS
Pages API                                   built; main/docs; HTTPS enforced
Branch-protection API                       403; unverified
```

Passing validator/smoke checks establish deterministic structure and stub-render behavior; they do **not** establish content rights, valid non-case source bodies, computed visibility, responsive layout, accessibility, or visual acceptance.

## 4. Session reports

| Date | Session | Report | Outcome |
|---|---|---|---|
| 2026-08-10 | `019fecb1` | [`sessions/AUDIT_RESPONSE_2026-08-10_019fecb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019fecb1.md), [`sessions/RELEASE_BLOCKERS_2026-08-10_019fecb1.md`](./sessions/RELEASE_BLOCKERS_2026-08-10_019fecb1.md) | **Current:** full audit/document reconciliation, then Lineage/fatal-state fixes; 7.0/10 |
| 2026-08-10 | `019fec5c` | [`sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md) | Phase C+D layouts, breakpoint/token changes, storage fix, Robo-badge cleanup; prior 7.6 summary was arithmetically unsupported |
| 2026-08-10 | `019febb1` | [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md), [`sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md`](./sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md), [`sessions/FUNCTIONAL_HOTFIX_2026-08-10.md`](./sessions/FUNCTIONAL_HOTFIX_2026-08-10.md), [`sessions/WEB_DESIGN_GAP_PLAN_2026-08-10.md`](./sessions/WEB_DESIGN_GAP_PLAN_2026-08-10.md), [`sessions/DESIGN_PHASE_AB_2026-08-10.md`](./sessions/DESIGN_PHASE_AB_2026-08-10.md) | Containment, functional hotfix, design plan, shell/Reader Phase A+B |
| 2026-08-10 | `019feaf5` | [`FULL_AUDIT_2026-08-10_019feaf5.md`](./FULL_AUDIT_2026-08-10_019feaf5.md), [`WEB_VISION_2026-08-10.md`](./WEB_VISION_2026-08-10.md) | Website vision and earlier audit; verdict superseded |
| 2026-08-10 | `019feabb` | [`sessions/SESSION_AUDIT_2026-08-10_019feabb.md`](./sessions/SESSION_AUDIT_2026-08-10_019feabb.md), [`docs/audits/2026-08-10-baseline.md`](./docs/audits/2026-08-10-baseline.md) | Scoreboard baseline and prior data/layout work; verdict superseded |
| 2026-08-09 and earlier | — | [`sessions/`](./sessions/) | Historical evidence; see Git history and dated files |

## 5. Maintenance rule

- Update §§1–3 only when current evidence changes.
- Add one concise row per completed session.
- Keep detailed process in a dated `sessions/` report, not here or in `HANDOFF.md`.
- Never infer user scores; see [`SCOREBOARD.md`](./SCOREBOARD.md).
