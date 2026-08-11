# 🔍 Fake Chan Factory — Current Audit

> **Current evidence:** [`sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md`](./sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md)
> **Prior evidence:** [`sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md) · [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md)
> **Convention:** this file is the current verdict and index; dated reports are immutable snapshots and may contain superseded metrics or conclusions.

## 1. Current verdict — 2026-08-11

**Not release-ready: audited score 7.2/10 and `repo_ready = fail`.**

The owner reported that the prior Pages design was too plain/generic and over-emphasized Chinese characters, while selecting preservation of the walnut-hall direction. The current branch implements a bolder English-first factory/editorial identity, keeps source Chinese in the Reader, adds recoverable startup failure UI, and corrects CSP ordering. The result still needs real-browser screenshot review and explicit owner approval.

Current generated measurements:

- Corpus: **35 documents**; Wumenguan **48/48 cases** complete and Xinxin Ming 37/37 complete are the **2 complete selected witnesses**; Biyanlu **100/100 cases** represented and Linji remain partial; **31 excerpt seeds**.
- Source volume: **103,723 content CJK / 109,185 all-string CJK**.
- Translations: **1252 corpus slots**; **177 verified quotations**; **21 matrix registers**; verified-reference coverage **176 recorded / 3 pending**.
- Locators: **148/148 case-level**; **33 document-level seeds**; case anchors do not prove every nested field was collated.
- Lineage: **34 masters**; **12 controlled `school_key` groups**; **30 edge records + 4 frontiers**; all 30 edges remain traditional/pending.
- Glossary: **31 terms**; Gong'an index: **24 entries**.
- Bundle: **1,594,154 raw bytes / 497,352 gzip-9**; first-load local assets total about **556 KB gzip before fonts**.
- Rights: **12 sources need rights review; 2 need jurisdiction review**.
- Deployment: native GitHub Pages from `main /docs`, HTTPS enforced; branch Quality for `d2e9887` passed.

## 2. Implemented this session

1. **English-first visual hierarchy:** brand, navigation, hero, room headings, Reader headings, cases/sections/chapters, lineage, Gong'an, lexicon, and mobile controls now lead with English while retaining smaller source-language labels where useful.
2. **Distinctive walnut identity:** asymmetric dark-walnut hero, `FC` monogram, edition numbering, proof-stamp motif, structural grain, editorial typography, and a matching Open Graph image.
3. **Balanced reading typography:** source Chinese default reduced from 1.35rem to 1.2rem; English translation text increased to 1rem.
4. **Resilience:** bundle-shape validation, visible `role="alert"` recovery panel, reload/reset actions, and top-level initialization recovery.
5. **Security:** CSP moved before `theme-init.js`; self-only script policy retained.
6. **Regression coverage:** smoke guards for CSP order, English-first identity/headings, recovery UI, and updated Gong'an/epilogue markup.
7. **Documentation hygiene:** one broken historical relative link fixed; canonical audit, scoreboard, handoffs, and disposable response summary synchronized.

## 3. Active blockers

### P1 — release blockers

1. **Owner visual approval:** current desktop/mobile light/dark browser output has not been approved.
2. **Quotation rights:** all 14 manifest sources remain human/jurisdiction-review pending.
3. **Source depth:** non-case field review remains incomplete, especially Biyanlu, Linji, Platform, and excerpt seeds.

### P2 — engineering and operations

4. **Browser evidence:** Playwright exits successfully when Chromium is unavailable; browser execution is not required in CI.
5. **CI coverage:** four mirrored deploy assets are omitted from the generated-artifact diff; browser/a11y/link/performance checks are not required.
6. **Performance:** the complete data global and all hidden views initialize up front.
7. **CSP/style debt:** 41 JS-generated inline styles still require `style-src 'unsafe-inline'`.
8. **Validation depth:** JSON Schema is not executed and non-case field-level validation remains weaker than case validation.

### P3 — polish

9. Repository description, homepage, and topics are empty; GitHub license detection returns `NOASSERTION`.
10. Google Fonts is a third-party runtime request; no `SECURITY.md` exists.
11. SVG social cards have uneven platform support; a PNG fallback would be safer.
12. Six lineage profiles lack linked corpus keys and all 30 edges await exact locators.

## 4. Verification

```text
python3 -m py_compile scripts/*.py      PASS
python3 scripts/validate_data.py        PASS; 6 documented lineage warnings
python3 scripts/build_data_bundle.py    PASS; root/docs synchronized
node scripts/smoke_test.mjs             PASS; 35 renderers, 0 crashes
npm audit --package-lock-only           PASS; 0 vulnerabilities
diff -rq data docs/data                 PASS
git diff --check                        PASS
HTML parser / Markdown link scan        PASS
GitHub branch Quality                   PASS (run 31486895570)
npm run test:browser                    SKIP; Chromium unavailable
```

Chromium download failed with network `ECONNRESET`; apt installation also could not reach package sources. A skipped browser run is not visual or accessibility evidence.

## 5. Current score

The weighted score is **7.2/10**. The prior 7.6 summary was inconsistent with its aspect table, which calculated to 6.9; the current [scoreboard](./SCOREBOARD.md) corrects the arithmetic and records only evidenced improvements. All `user_score` values remain `null` because the owner supplied qualitative direction, not a numeric score.

## 6. Report index

| Date | Report | Scope |
|---|---|---|
| 2026-08-11 | [`sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md`](./sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md) | **Current full audit**, owner feedback, English-first walnut redesign, resilience/security fixes |
| 2026-08-10 | [`sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md) | Secondary-room redesign, storage hotfix, responsive/contrast pass |
| 2026-08-10 | [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md) | Containment, behavior fixes, initial walnut shell and Reader |
| 2026-08-10 | [`FULL_AUDIT_2026-08-10_019feaf5.md`](./FULL_AUDIT_2026-08-10_019feaf5.md) | Earlier architecture/design audit; conclusions superseded where they conflict |
| 2026-08-08–10 | [`sessions/`](./sessions/) | Historical audit and implementation evidence |

## 7. Maintenance rule

- Update §§1–5 only when current evidence changes.
- Add one report-index row per completed audit session.
- Keep detailed process in dated `sessions/` reports.
- Never infer a numeric owner score from feedback, merge, or silence.
