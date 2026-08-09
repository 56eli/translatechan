# 🔍 TranslateChan — Audit & Session Log (Current State)

> **What this file is**: the project's *current-state* audit summary, standing
> recommendations, and quality gates. **Dated, full-length session reports live
> in [`sessions/`](./sessions/)** — nothing is deleted; history is linked, not
> duplicated. This convention (audit 2026-08-09, P2-D) exists because this file
> had grown into an ~90 KB append-only log mixing durable verdicts with session
> process. When adding a session report, link it in the index below and update
> only the "Current" sections if the verdict changed.

---

## 1. Current verdict (2026-08-09, session `arena/019fe5d5-translatechan`)

**Healthy — no P0/P1 known.** All quality gates pass on `main` (PR #7) and on
every session change since; the app renders all 36 corpus documents, the
validator enforces the data contract (schema companion + semantics + rights +
locators + deterministic metrics + controlled school vocabulary + doc
truthfulness across README/HANDOFF/ROADMAP/index.html **and the §1 numbers of
this file**), and the dependency-free smoke suite covers rendering, search,
a11y/ARIA behavior, filter derivations, and escaping.

Current measured facts (validator-generated; the prose numbers below are
guarded by the doc-truthfulness gate where they appear in README/HANDOFF):

- Corpus: **36 documents**; Wumenguan **48/48 cases** complete; Biyanlu **14/100 cases** (cases 1–10 complete); **35 excerpt seeds**; **20,017 content CJK / 23,314 all-string CJK**.
- Translations: **874 corpus slots**; **138 verified quotations**; **21 matrix registers**; verified-reference coverage **135 recorded / 5 pending**.
- Locators: **64/64 case-level**; **33 document-level seeds** pending unit locators.
- Lineage: **34 masters** (30 seed + 4 frontier scaffolds), **12 controlled `school_key` groups**; **30 edge records + 4 frontiers**, source-status aware.
- Glossary: **31 terms**; Gong'an index: **23 entries** (7 validator-enforced theme groups).
- Bundle: ~795 KB zero-backend static build; root and `/docs` byte-identical by CI gate.

## 2. Standing recommendations (priority order)

1. **A1 — Repository ops (owner, ~2 min):** require the Quality workflow check *"Validate data, generated artifacts, and reader"* in branch protection/rulesets for `main` so a PR cannot merge without the green gate. Still unverified/unactioned by the owner.
2. **A2 — Scholarly release gate (editorial):** resolve the **5 pending verified-source references**; migrate the **33 document-level locators** to unit/page-line anchors via `data/editorial/traceability_queue.json`; human sign-off per rights-manifest record before expanding quotation reuse. The validator enforces structure, not collation/copyright — keep it that explicit.
3. **Content Phase 2:** continue the CBETA-collated completion campaign (ROADMAP.md); Biyanlu 11–100 and Linji are the natural next pilots; every new text runs the established locator/provenance/metrics workflow.
4. **Editorial candidates (small):** ~~gong'an theme taxonomy~~ ✅ delivered 2026-08-09; ~~semantic heading outline (a11y B2)~~ ✅ delivered 2026-08-09 (session `019fe64a`); `switchViewRaw` scroll-restore on back/forward.

### Independent audit 2026-08-09 (session `019fe64a`)

Full report: [`AUDIT_RESPONSE_2026-08-09.md`](./AUDIT_RESPONSE_2026-08-09.md). Verdict: healthy, no P0/P1/P2; all gates green. Findings catalogued as P3/P4. **B2 (semantic heading outline) shipped** in commit `0069953` — every view title is a real `<h1>` and every card/unit title a real `<h2>`, visual design unchanged (heading UA reset), smoke test `4m6` guards the outline; the matrix subtitle was also hardened from a hand-maintained translator list to a stable phrase. **A2 (data-derived graph colors) shipped** in the following commit — `school_vocabulary.json` now carries a per-school curated `color`, the validator requires a 6-digit hex (negative-tested), the schema declares it, `app.js` derives the graph palette from data (hardcoded map removed), and smoke `4m2b` guards it. **A1 (3 broken historical links)** fixed in the same pass; internal markdown-link check is now clean. **B1 (dark-theme FOUC)** also shipped: external `theme-init.js` applies the persisted `data-theme` before first paint (loaded before `app.css`, CSP-clean, build/CI/smoke-guarded). **A4 (bare-string translation migration)** also shipped: `scripts/migrate_translations.py` converted all 736 legacy string translations into explicit `{text,status}` records; the validator/schema now reject new bare strings, metrics are unchanged, and smoke `4m7` guards the contract (bundle grew ~74 KB because statuses are now serialized). **B3/B5/B6 (a11y/SEO/copy polish)** shipped in the final pass: decorative emoji are `aria-hidden`, the hero counts are data-derived, and `theme-color`, Open Graph/Twitter metadata, canonical URL, `robots.txt`, and `sitemap.xml` were added. **B4 (script loading/perf)** also shipped: `app_data.js` and `app.js` now use `defer` so the 873 KB bundle can download during HTML parsing while preserving execution order; smoke guards the attributes/order. **C3 (segmenter rename)** shipped: `ingest_cbeta.py` is now `segment_classical.py` with a deprecated compatibility wrapper and updated docs. Remaining prioritized items: C4 (lint in CI; workflow YAML requires owner/token permission), C1 (opportunistic module split), C2 (incremental schema strictness).

## 3. Quality gates (must pass before every push)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py          # data contract + metrics + doc truthfulness (+ school vocabulary)
python3 scripts/build_data_bundle.py      # deterministic bundle; root + docs/ synced
node scripts/smoke_test.mjs               # dependency-free renderer regression suite
node --check scripts/browser_test.mjs     # optional Playwright suite (skips without Chromium)
diff -rq data docs/data                   # byte-identical data mirror
```

## 4. Session archive index

| Date | Session | Report | Key outcomes |
|---|---|---|---|
| 2026-08-08 (pre-PRs) | repair campaign | [`sessions/AUDIT_archive_2026-08-08.md`](./sessions/AUDIT_archive_2026-08-08.md) §0–§8 | P0 fatal parse bug found & fixed; 6 runtime crashes; search/tooltip/provenance repairs; remediation log |
| 2026-08-08 | `019fe1b5` | [`sessions/SESSION_AUDIT_2026-08-08.md`](./sessions/SESSION_AUDIT_2026-08-08.md) + archive §9 | Second-pass audit B1–B10 fixed; CBETA canon-reference corrections; Wumenguan completed 48/48 |
| 2026-08-08 | `019fe2e0` | archive §10 | Independent post-PR#3 audit; locator/rights/editorial program started |
| 2026-08-08 | `019fe30b` | [`sessions/SESSION_AUDIT_2026-08-08_019fe30b.md`](./sessions/SESSION_AUDIT_2026-08-08_019fe30b.md) + archive §11 | a11y/CSP hardening; per-text metrics; Playwright suite; Biyanlu 4–10 (14/100); coverage disclosures |
| 2026-08-09 | `019fe5d5` | [`sessions/SESSION_AUDIT_2026-08-09_019fe5d5.md`](./sessions/SESSION_AUDIT_2026-08-09_019fe5d5.md) | Full audit; doc-truthfulness gate (P2-A); controlled school vocabulary + data-derived filters (P2-B, incl. dead-lexicon-filter bug fix); renderer escaping consistency + poison regression (P2-C); sessions convention + AUDIT.md slimming (P2-D); gong'an 7-group theme taxonomy. **Turn 2**: independent second-pass audit → A1–A5 remediation: verified-text spread 6→**7** (README/ROADMAP) + matrix "2 rows"→2 registers (HANDOFF); doc gate extended to 25 rules incl. **AUDIT.md §1 numbers** + new `verified_corpus_texts` metric; pipeline helper emits validator-shaped entries (status field); stale § pointers fixed; Lexicon occurrence **scope note** (smoke 4m5) |

## 5. Session artifact convention (est. 2026-08-09)

- **`sessions/`** holds dated session reports (`SESSION_AUDIT_<date>[_<session>].md`) and the historical audit archive. Nothing here is rewritten after the session ends.
- **`AUDIT.md`** (this file) stays slim: current verdict, standing items, gates, index.
- **`response_summary.md`** at repo root is the *live* working summary for the current session — agents overwrite it; it is not canonical documentation.
