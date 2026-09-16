# 🔍 Fake Chan Factory — Current Audit

> **Current evidence (authoritative, dated correction overlay):** [`sessions/COLLATION_W1_2026-09-10_CORRECTION.md`](./sessions/COLLATION_W1_2026-09-10_CORRECTION.md) · [`sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`](./sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json) · [`sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`](./sessions/COLLATION_W1_2026-09-10_refs_manifest.txt)
>
> **Historical evidence (append-only):** [`sessions/COLLATION_W1_2026-09-09.md`](./sessions/COLLATION_W1_2026-09-09.md) · [`sessions/COLLATION_REGISTER_2026-09-09.json`](./sessions/COLLATION_REGISTER_2026-09-09.json)
> **Prior evidence:** [`sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md`](./sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md) · [`sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md) · [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md)
> **Convention:** this file is the current verdict and index; dated reports are immutable snapshots and may contain superseded metrics or conclusions.
>
> **⚠️ 2026-09-09 (W1 collation):** an independent collation of **every** corpus source-Chinese field in the 34-document W1 register against the official CBETA XML P5 edition ([report](./sessions/COLLATION_W1_2026-09-09.md), [register](./sessions/COLLATION_REGISTER_2026-09-09.json)) found that only 1 document collates 100% against its claimed witness; the register-derived figure is 22 documents with **no** collating source-content field (the report's tier table narrated 27 as failing outright, a different denominator), including fabricated preface/verses inside the former `complete_selected_witness` texts and a false canonical claim for Zhaozhou (T1987 is the Caoshan record). The manifest now contains a containment/status model; per-document remediation remains pending under the adopted hybrid R-A/R-B/R-C policy.

## 1. Current verdict — 2026-09-13 (Pages revamp Phases 1-3 complete, Phase 4 evidence)

**Not release-ready: audited score 7.2/10 and `repo_ready = fail` — Pages revamp system complete, pending owner light/dark desktop/mobile review.**

The owner reported that the prior Pages design was too plain/generic and over-emphasized Chinese characters, while selecting preservation of the walnut-hall direction (2026-08-11). The 2026-09-13 Checkpoint-C (`.orchestrator/STATE.md`) confirmed colors acceptable, everything else adaptable/replaceable, serif, subordinate, lazy, full plan. Phases 1-3 shipped as PRs #48 system+masthead (tokens 63→43, serif Source Serif 4, gate, hero, mobile bar, OG redraw), #49 Reader (minimal sheet, ledger drawer, thin register, 41 style=→0, render-lazy), #50 secondary rooms + CSP (collation table, transmission register, case catalogue, dictionary, 0 style=, CSP without `unsafe-inline`). **Frozen tracks PR-B CSP hardening folded into Phase 3 and PR-D perf measure-first folded into Phase 2 lazy per C-5 (a); PR-A real-browser still frozen.** No real-browser evidence exists — owner review on live Pages is Phase4 exit. Dated current-vision doc `WEB_VISION_2026-09-13.md` finalised in this PR.

Current generated measurements (main 3a6ae32, after Phases 1-3):

- Corpus: **35 documents**; Source review: **1 collated**, **32 partial/failed**, **2 unavailable**; **0 complete selected witnesses** after W1 containment. Wumenguan **48/48 cases** represented; W1 source-review status: `partial_or_failed_w1_collation`. Xinxin Ming has 37/37 represented stanzas with the same partial/failed state. Biyanlu **100/100 cases** represented; Biyanlu and Linji remain partial; **31 excerpt seeds**.
- Source volume: **105,012 content CJK / 111,709 all-string CJK**.
- Translations: **1252 corpus slots**; **177 verified quotations**; **21 matrix registers**; verified-reference coverage **176 recorded / 3 pending**.
- Locators: **148/148 case-level**; **33 document-level seeds**; case anchors do not prove every nested field was collated.
- Lineage: **34 masters**; **12 controlled `school_key` groups**; **30 edge records + 4 frontiers**; all 30 edges remain traditional/pending.
- Glossary: **31 terms**; Gong'an index: **24 entries**.
- Pages system: tokens **43 total** (35 in `:root` + 8 dark overrides, plus 6 scoped composition dials), serif **Source Serif 4** for hook/headings/translations, gate (lintel/directory/beam), sheet (minimal ruled), drawer (About this edition), register (thin static), secondary rooms re-composed (collation table / transmission register / case catalogue / dictionary), **0 `style=` literals** in `index.html` and `app.js`, **4 CSSOM custom-property writes** (`--shell-height`, `--zh-font-size`, `--pop-shift`) as runtime contracts, CSP `style-src 'self' https://fonts.googleapis.com` **without `unsafe-inline`**, **render-lazy** (Reader boot, others first activation), bundle raw 1,925,366 B (~1.84 MB) <2 MB, gzipped 586,529 B — `app_data.js` 1,642,473 B printed by build.
- Bundle: `app_data.js` and `docs/` are regenerated by `scripts/build_data_bundle.py`, which prints the authoritative byte count at build time.
- Rights: **12 sources need rights review; 2 need jurisdiction review**.
- W1 ledgers: The Reader keeps **five separate, always-visible ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review. Containment/remediation state, not a rights decision. Source collation does not approve reuse. Title and name metadata (title_zh, name_zh) is measured and reported separately from source content, so collated_to_claimed_witness is not proof that the excluded metadata fields were collated.
W1 evidence: **35 documents, 630 flagged source fields** (authoritative 2026-09-10 correction register: `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`; historical 2026-09-09 register: `sessions/COLLATION_REGISTER_2026-09-09.json` with 34 documents and 622 flagged fields — the 637 figure in the 2026-09-09 report is **superseded**); 593 of 924 source-content fields collate to their claimed witness, and 22 documents have no collating source-content field at all.
- Wave 1 re-keys (2026-09-10 → 2026-09-11): `wumenguan` (#29) → CBETA T48n2005, `biyanlu_cases` (#30) → T48n2003, `linji_yulu` (#32) → T47n1985, `xinxin_ming` (#34) → T48n2010, each re-keyed verbatim from a pinned, digest-verified witness; `platform_sutra` (#35) provenance-labelled (primary T48n2007 Dunhuang, alternative T48n2008 宗寶) with **zero characters re-keyed**. No document changed status and none became complete.
- Flagged fields after the campaign: the authoritative 2026-09-10 register holds **630**; a fresh collation of current `main` reports **532** (`COLLATION_REFS=<refs> python3 scripts/collate_corpus.py --require-verified-refs`, recorded in `.orchestrator/PHASE2_PLAN.md` §2) — the difference is the four merged re-keys — and the owner ruled on 2026-09-12 that the published post-remediation evidence pass (PR #41) does **not** supersede the register: **630** stays authoritative and **532** stays today's measurement of `main`.
- Witness inventories: [`WITNESS_INVENTORY.md`](./.orchestrator/WITNESS_INVENTORY.md), [`WITNESS_INVENTORY_T48_T51.md`](./.orchestrator/WITNESS_INVENTORY_T48_T51.md), [`WITNESS_INVENTORY_XSERIES.md`](./.orchestrator/WITNESS_INVENTORY_XSERIES.md) — consolidated and ranked in [`PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md).
- Pages revamp: Phases 1-3 merged (main 3a6ae32), Phase 4 evidence finalised in this PR — README interface, HANDOFF §3-§5, ROADMAP Phase4, dated vision `WEB_VISION_2026-09-13.md`, OPERATIONS Edit1 closed structurally by O-3. Owner light/dark desktop/mobile review pending.
- Deployment: native GitHub Pages from `main /docs`, HTTPS enforced; PR #18 merged as `63dfe37`; main Quality and Pages deployment passed, and the published text surface was confirmed.

## 2. Implemented (2026-08-11 session)

1. **English-first visual hierarchy:** brand, navigation, hero, room headings, Reader headings, cases/sections/chapters, lineage, Gong'an, lexicon, and mobile controls now lead with English while retaining smaller source-language labels where useful.
2. **Distinctive walnut identity:** asymmetric dark-walnut hero, `FC` monogram, edition numbering, proof-stamp motif, structural grain, editorial typography, and a matching Open Graph image.
3. **Balanced reading typography:** source Chinese default reduced from 1.35rem to 1.2rem; English translation text increased to 1rem.
4. **Resilience:** bundle-shape validation, visible `role="alert"` recovery panel, reload/reset actions, and top-level initialization recovery.
5. **Security:** CSP moved before `theme-init.js`; self-only script policy retained.
6. **Regression coverage:** smoke guards for CSP order, English-first identity/headings, recovery UI, and updated Gong'an/epilogue markup.
7. **Copy and disclosure cleanup:** removed repetitive hero/Matrix prose and Robo footers; compacted Lineage, Lexicon, verified citations, coverage, and search copy while preserving details on demand.

## 3. Implemented (2026-09-09/10 W1 sessions)

8. **W1 public-integrity containment:** added manifest-level W1 evidence metadata, explicit per-document source-review statuses, completion/status incompatibility validation, deterministic status counts, and a visible Reader source-review ledger without changing corpus source fields.
9. **Documentation hygiene:** current claims now distinguish represented units, W1 source collation, edition-verified English quotations, and rights review; dated W1 evidence remains immutable.

## 4. Active blockers

### P1 — release blockers

1. **Quotation rights:** all 14 manifest sources remain human/jurisdiction-review pending.
2. **Source depth:** W1 found only one of the 35 documents in the authoritative 2026-09-10 register fully collated to its claimed witness (the historical 2026-09-09 register covered 34 documents); per-document remediation remains incomplete, especially Wumenguan, Xinxin Ming, Biyanlu, Linji, Platform, and excerpt seeds.

### P2 — engineering and operations

3. **Browser evidence:** Playwright exits successfully when Chromium is unavailable; browser execution is not required in CI — **PR-A real-browser still frozen**.
4. **CI coverage — Edit 1 closed structurally by O-3 (2026-09-13).** The old line read “four mirrored deploy assets are omitted”; the structural check `git diff --exit-code -- app_data.js docs data/project_metrics.json` now covers root bundle, entire `docs/` mirror tree and metrics, so theme-init.js, robots.txt, sitemap.xml, og-image.svg are guarded without enumeration. Browser/a11y/link/performance checks are not required. **PR-B CSP hardening folded into Phase 3, PR-D perf measure-first folded into Phase 2 lazy** per Checkpoint-C C-5 (a).
5. **Performance — PR-D folded.** The complete data global still initializes up front; since Phase 2 hidden rooms defer *rendering* only (first tab activation, C-4 a — option B bundle-splitting not taken, remains open if browser measurements justify it). Bundle raw 1,925,366 B (~1.84 MB) <2 MB, gzipped 586,529 B — measured on main 3a6ae32.
6. **CSP/style debt — closed 2026-09-13 (Pages revamp Phase 3).** This line read “41 JS-generated
   inline styles still require `style-src 'unsafe-inline'`”; Phase 2 moved those 41 `style=` literals
   into classes and Phase 3 re-composed the four secondary rooms onto the same vocabulary, so `app.js`
   and `index.html` now carry **0** `style=` attributes (the smoke test counts the literals and audits
   every rendered room, the dossier and the lineage chart) and the CSP meta dropped `'unsafe-inline'`
   from `style-src` to `style-src 'self' https://fonts.googleapis.com`. Four CSSOM custom-property writes remain by design (the measured runtime contracts
   `--shell-height`, `--zh-font-size`, `--pop-shift`), which `style-src` does not govern. No real-browser
   evidence exists for the re-composition, so owner review on live Pages is still open.
7. **Validation depth — partially closed 2026-09-14 (task 008).** `scripts/validate_data.py` now optionally executes `schemas/translatechan-data.schema.json` against every corpus document, matrix translator record, the lineage-verification registry, and the lineage school vocabulary when the `jsonschema` library is installed (warn-only, never a hard dependency, so the validator stays dependency-free by default); it also checks gong'an `cross_refs` case-number references against the Wumenguan/Biyanlu corpus documents they cite and the `evidence_source` enum on every `data/translations/translator_profiles.json` entry. All of these pass cleanly on the current data. Non-case field-level validation is still lighter than case-level validation, and JSON Schema is not wired into CI as a required step (it remains an optional depth check, not a gate).

### P3 — polish

8. Repository description, homepage, and topics are empty; GitHub license detection returns `NOASSERTION`.
9. Google Fonts remains a third-party runtime request. **Closed 2026-09-14:** [`SECURITY.md`](./SECURITY.md) now exists — minimal disclosure policy, GitHub Security Advisories only, no email intake, `main` is the only supported branch.
10. **Closed 2026-09-14:** `og-image.png` (1200×630, 71,415 B, deterministically rasterized from `og-image.svg`) now ships alongside the SVG at root and in the `docs/` mirror; `index.html`'s `og:image`/`twitter:image` meta list the PNG first for broad platform compatibility, with the SVG as a secondary `og:image` entry.
11. Three lineage profiles lack linked corpus keys by design, not as a bug — `prajnatara`, `yangqi_fanghui`, and `dahong_zuzheng` are frontier scaffolds recorded with no active-corpus occurrence (reviewed 2026-09-09; each carries an explicit `profile_evidence` note and triggers the validator's own `alternative_names`/`linked_corpus_keys` empty-list warning, which is expected for these three and not a data-quality regression to chase). All 30 internal lineage edges remain `traditional_link_pending_exact_locator`, which is later-tranche editorial work (exact chart/record locator review), not a defect in the current seed graph.
12. **`docs/audits/` vs `sessions/` split documented 2026-09-14:** `docs/audits/` is a small, curated, Pages-deployable mirror of selected `sessions/` evidence for the public audit trail; `sessions/` is the full append-only evidence record. See `HANDOFF.md` §11 for the full convention.

## 5. Verification

```text
python3 -m py_compile scripts/*.py      PASS
python3 scripts/validate_data.py        PASS; 3 documented lineage warnings
python3 scripts/build_data_bundle.py    PASS; root/docs synchronized
node scripts/smoke_test.mjs             PASS; 35 renderers, 0 crashes plus W1 status-model checks
npm audit --package-lock-only           PASS; 0 vulnerabilities
diff -rq data docs/data                 PASS
git diff --check                        PASS
HTML parser / Markdown link scan        PASS
GitHub branch + PR Quality              PASS (through e6e24bf)
GitHub main Quality / Pages             PASS (runs 31490146548 / 31490145334)
npm run test:browser                    SKIP; Chromium unavailable
```

Chromium download failed with network `ECONNRESET`; apt installation also could not reach package sources. A skipped browser run is not visual or accessibility evidence.

## 6. Current score

The weighted score is **7.2/10**. The prior 7.6 summary was inconsistent with its aspect table, which calculated to 6.9; this audit corrects the arithmetic and records only evidenced improvements. All `user_score` values remain `null` because the owner supplied qualitative direction, not a numeric score. The scoreboard scoring system was retired on 2026-09-11; no live score file remains to consult.

## 7. Report index

| Date | Report | Scope |
|---|---|---|
| 2026-08-11 | [`sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md`](./sessions/AUDIT_RESPONSE_2026-08-11_019ff089.md) | **Current full audit**, owner feedback, English-first walnut redesign, resilience/security fixes |
| 2026-08-10 | [`sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019fec5c.md) | Secondary-room redesign, storage hotfix, responsive/contrast pass |
| 2026-08-10 | [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](./sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md) | Containment, behavior fixes, initial walnut shell and Reader |
| 2026-08-10 | [`FULL_AUDIT_2026-08-10_019feaf5.md`](./FULL_AUDIT_2026-08-10_019feaf5.md) | Earlier architecture/design audit; conclusions superseded where they conflict |
| 2026-08-08–10 | [`sessions/`](./sessions/) | Historical audit and implementation evidence |
| 2026-09-10 | [`sessions/COLLATION_W1_2026-09-10_CORRECTION.md`](./sessions/COLLATION_W1_2026-09-10_CORRECTION.md) | **Authoritative correction overlay** (W1): 35th document (Shitou Sandokai), hash-verified reference layer, per-digest provenance; supersedes the 2026-09-09 figures |
| 2026-09-09 | [`sessions/COLLATION_W1_2026-09-09.md`](./sessions/COLLATION_W1_2026-09-09.md) | **Independent full-corpus collation vs CBETA XML P5** (W1); per-field register + refs manifest (historical, append-only) |

## 8. Maintenance rule

- Update §§1–6 only when current evidence changes.
- Add one report-index row per completed audit session.
- Keep detailed process in dated `sessions/` reports.
- Never infer a numeric owner score from feedback, merge, or silence.
