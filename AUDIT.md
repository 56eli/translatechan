# 🔍 Fake Chan Factory — Current Audit & Session Index

> **Current evidence:** [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md)
> **Convention:** this file contains only the current verdict, blockers, checks, and session index. Dated reports are historical snapshots and may contain metrics or conclusions superseded here.

## 1. Current verdict — 2026-08-10, session `019febb1`

**Not release-ready: one P0, four P1 groups, `repo_ready = fail`, weighted score 5.8/10.**

The deterministic static pipeline is sound, but prior “no P0/P1/P2” conclusions missed content-trust and visible-behavior defects. Most urgently, 28/35 published Congronglu cases repeat identical generic Chinese commentary/verse inserted by old ingestion scripts without placeholder disclosure. Additional blockers include false full-text completion, unresolved quotation-rights decisions, an always-hidden Lineage dossier, six empty Platform chapter bodies, incomplete print exports, and stale current documentation.

Current generated measurements (these are counts, **not proof of scholarly completion**):

- Corpus: **36 documents**; Wumenguan **48/48 cases** complete under its selected case/preface/epilogue contract; Biyanlu **100/100 cases** represented under its current field contract; metrics currently label Xinxin Ming 37/37 and Platform Sutra 10/10 as complete, but the latest audit rejects count-only completion for Platform; **32 excerpt seeds**; **107,563 content CJK / 113,410 all-string CJK**.
- Translations: **1352 corpus slots**; **177 verified quotations**; **21 matrix registers**; verified-reference coverage **176 recorded / 3 pending**. “Verified” means edition/wording checked, not automatically rights-approved or public-domain.
- Locators: **183/183 case-level**; **33 document-level seeds**. A case-number anchor does not prove every nested source field was collated.
- Lineage: **34 masters**; **12 controlled `school_key` groups**; **30 edge records + 4 frontiers**; all edges remain traditional/pending.
- Glossary: **31 terms**; Gong'an index: **24 entries**.
- Bundle: 1,676,108 raw bytes; about 522 KB at gzip level 9. Root and `/docs` are synchronized.

## 2. Active blockers

1. **P0 — Congronglu source integrity:** quarantine every non-collated source field/case; add field-level provenance and placeholder rejection.
2. **P1 — completion truth:** relabel Platform as chapter excerpts represented; separate unit-count, source-field, witness, and human-review coverage.
3. **P1 — public quotation governance:** all 14 rights sources are still review/jurisdiction-pending; separate edition verification from rights/public-domain status.
4. **P1 — broken public behavior:** remove dossier `hidden`, support direct chapter fields, move epilogue, and print all units.
5. **P2 — test credibility:** add failing regressions for all above; current smoke passes and optional browser test is stale/skippable.
6. **P2 — responsive/accessibility:** fix sticky/header offsets, 1100/960 breakpoint mismatch, cross-view mobile Reader bar, contrast, pressed/radio/tooltip semantics.
7. **P2 — documentation:** reconcile README, HANDOFF, ROADMAP, RESEARCH_RELEASE_PLAN, OG artwork, and broken links after editorial decisions.

Detailed evidence and phased exit criteria: [full audit §§3–7](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md#3-severity-ranked-findings).

## 3. Checks run

```text
python3 -m py_compile scripts/*.py          PASS
python3 scripts/validate_data.py            PASS with 6 lineage warnings
python3 scripts/build_data_bundle.py        PASS; root/docs synced
node scripts/smoke_test.mjs                 PASS; 36 fixtures, 0 crashes
diff -rq data docs/data                     PASS
npm audit --package-lock-only               PASS; 0 vulnerabilities
npm run test:browser                        SKIP; Chromium unavailable
Chromium install                            FAIL; sandbox network ECONNRESET
Markdown relative-link scan                 PASS after 2 documentation fixes
GitHub Quality + Pages at main 3ef7732       PASS
```

A passing validator/smoke run currently establishes structural consistency and no stub-render crash; it does **not** clear the blockers above.

## 4. Session reports

| Date | Session | Report | Historical outcome |
|---|---|---|---|
| 2026-08-10 | `019febb1` | [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md) | **Current:** deep re-audit; P0/P1 findings; 5.8/10; remediation plan |
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
