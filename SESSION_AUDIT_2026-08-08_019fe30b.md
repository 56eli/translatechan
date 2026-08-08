# 🔍 TranslateChan — Full Project Audit (2026-08-08, session `arena/019fe30b-translatechan`)

> **Temporary response file** — created for review of this session's full-project audit. Durable log entry should be folded into [`AUDIT.md`](./AUDIT.md) §11 when the owner accepts it. Delete this file after review (it is not part of the project's canonical docs).
>
> **Audited snapshot:** commit `243fe3f` (single squashed commit on `main` = merge of PR #6) — the same tree the live GitHub Pages site serves (`main` → `/docs`).
>
> **Audit method:** every claim below was re-measured this session by running the project's own tooling (`validate_data.py`, `build_data_bundle.py`, `smoke_test.mjs`), plus independent greps/census of the source tree. This is a code/data/documentation integrity audit — not a line-by-line scholarly collation against CBETA/TEI, not a legal opinion on quotation rights, and not a cross-browser assistive-technology certification.

---

## 0. Executive Verdict

**The project is in strong, honest health — no P0, no P1 issue was found this pass.** The static app builds deterministically, all 36 corpus texts render across all reader modes, search is schema-comprehensive and truthful, provenance/rights/locator disclosure is genuinely disciplined, and the documentation culture (measured, not aspirational) is a real asset. The remaining work is the same class the project already tracks: **editorial migration (33 document-level locators, 5 pending references, rights review), a11y/CSP hardening, real-browser testing, and Phase-2 corpus expansion (Biyanlu 7/100)**.

| Area | Verdict | Grade |
|---|---|---|
| Build, determinism & deploy sync | Deterministic rebuild leaves tree clean; root↔`docs` byte-identical; `diff -rq data docs/data` silent; Pages live on `main`/`docs` (built, HTTPS) | 🟢 A |
| Runtime & rendering | All 36 texts × all reader modes; lazy 48-case Wumenguan; sparse case nav; hash routing; print CSS; pan/zoom lineage | 🟢 A− |
| Search | All schemas indexed incl. pointers; variant normalization (鉢/缽, 曰/云…); truthful "Showing N of M" cap accounting; HTML-escaped queries | 🟢 A− |
| Attribution & provenance | 138 verified corpus slots + 2 verified matrix rows, all resolving through 13 rights-manifest sources; 135/140 references recorded, 5 honest pending; AI/reconstruction badges everywhere | 🟢 A |
| Data contract & tooling | Shared manifest (36↔36↔36), schema companion + semantic validator, locator registry (57/57 case units), deterministic metrics, checked-in CI workflow | 🟢 A− |
| Documentation accuracy | Two stale CJK-count figures + one stale branch line found and fixed this session (F1/F2); otherwise consistent | 🟢 A− |
| Corpus coverage vs Phase-2 goals | Wumenguan complete (48/48); 35/36 still excerpt seeds; Biyanlu 7/100 — honestly measured, the main product gap | 🟠 C (known, tracked) |
| Accessibility / CSP | Good baseline (skip link, focus rings, contrast fixes, reduced motion); **keyboard gaps + inline `onclick` remediated this session** (delegated events, Enter/Space glossary terms, full ARIA tabs, restrictive CSP) | 🟢 B+ (was B−) |
| Release engineering | CI workflow checked in; branch-protection requirement **cannot be confirmed** (403 — token lacks admin); no real-browser suite yet | 🟠 B+ |

---

## 1. Verification Run (all commands executed this session)

```text
node --check app.js                                       → clean
node --check scripts/smoke_test.mjs                       → clean
python3 -m py_compile scripts/*.py                        → OK
python3 scripts/validate_data.py                          → ✅ PASSED  corpus=36 | slots=856 | verified=138 | matrix=21 | locators=57/57
python3 scripts/validate_data.py --write-metrics          → no diff (metrics fresh)
python3 scripts/build_data_bundle.py                      → deterministic (tree stays clean), bundle 728,245 B
node scripts/smoke_test.mjs                               → ✅ SMOKE TEST PASSED
cmp index.html docs/index.html  ·  app.js / app.css / app_data.js  → identical
diff -rq data docs/data                                   → silent
gh api repos/56eli/translatechan/pages                    → status: built · main → /docs · https_enforced: true
```

The smoke suite covers: 36 texts × all reader modes, schema-specific search (stanzas/chapters/sections/pointers/translations), variant search, HTML-injection search, sparse-case navigation (Biyanlu 3↔12, Congronglu 1↔9), lazy 48-case rendering, blocked-storage preference writes, citation popovers on hover/focus/touch, matrix provenance badges (21/21), lineage verification registry (30 edges + 4 frontiers), pan/zoom group, and public-scope exclusions (no studio/agents/GitHub link).

---

## 2. Verified Healthy (measured again this session)

1. **Deterministic build & sync contract** — rebuild is byte-identical; root and `/docs` (including `docs/data/`) match exactly. The B1 docs/data-mirror fix from the prior session holds.
2. **Metrics are fresh** — `--write-metrics` produces zero diff; committed `data/project_metrics.json` equals computed values. Current measured: **13,268 content CJK chars** / **16,457 all-string CJK chars** across 36 corpus files (see F1 — docs lagged this).
3. **Attribution honesty holds** — 138 `verified_quotation` objects (wumenguan 119, linji 6, zhaozhou 5, huangbo_chuanxin 2 + huangbo_wanling 2, platform 2, xinxin_ming 2) all carry `{text, status, source:{work, edition, reference, verification, source_id}}`; all 140 verified records (incl. 2 matrix) resolve through `rights_manifest.json` (13 sources). 692 reconstruction + 26 AI slots never claim verification. 135/140 references recorded; 5 explicitly pending.
4. **Canonical anchors re-spotted** — 狗子還有佛性也無？州云：無 (T2005 c1), 無位真人/乾屎橛 (T1985), 洗缽盂去 (T1987), 菩提本無樹 with Dunhuang-recension note (T2007), 至道無難，唯嫌揀擇 (T2010) — present and edition-authentic, incl. the documented 庭前柏樹 case-37 numbering (T2005 目次-verified).
5. **Lineage integrity** — 30 profiles render 26+ in-set teacher edges; all teacher refs resolve; `lineage_verification.json` (30 edges, 4 frontiers) matches the validator exactly; every internal edge honestly `traditional_link_pending_exact_locator`.
6. **Locator registry** — 36 documents + 57/57 case units covered; Linji (4 sections) and Xinxin Ming (7 stanzas) carry `collated_with_normalization` unit pilots (honest: below human sign-off); 33 non-case seeds explicitly `legacy_document_seed`.
7. **Reader resilience** — corrupted/blocked storage, HTML-bearing search queries, HTML-bearing saved-state, sparse case arrays, nonconsecutive case numbers, and variant orthography all have regression coverage and pass.
8. **Data contract** — 36 corpus files ↔ 36 manifest items ↔ 36 bundler entries ↔ 36 UI corpus-map keys agree; validator enforces manifest/registry/metrics alignment.

---

## 3. New Findings (this session, priority-ordered)

### F1 — 🟢 P3 (docs): CJK character counts stale in README and AUDIT §10.2
`data/project_metrics.json` (fresh, validator-generated) measures **13,268 content CJK / 16,457 all-string CJK**; README §"Honest status" and AUDIT §10.2 still print **13,090 / 16,270**. Counts changed ~178 chars when the corpus last grew; the prose docs weren't re-synced.
**Status: FIXED this session** — README + AUDIT §10.2 updated to the measured figures (root docs only; historical session files left untouched).

### F2 — 🟢 P3 (docs): HANDOFF.md points at the previous session's branch
HANDOFF §"Merge readiness" says *"Current branch: `arena/019fe2e0-translatechan`"* — that was PR #6's branch. The working convention is `arena/<session>-translatechan`, so the line should name the live session branch.
**Status: FIXED this session** — updated to `arena/019fe30b-translatechan`.

### F3 — 🟡 P2 (a11y/CSP): keyboard + CSP hardening — **REMEDIATED this session** ✅
Glossary `term-highlight` spans are focusable but **Enter/Space did not open the popover**; nav tabs had `role="tab"`/`aria-selected` but **no tabpanel roles, `aria-controls`, or arrow-key behavior**; case chips, case-nav footers, load-more, and search-jump buttons all used **inline `onclick`** → a strict Content-Security-Policy was impossible.
**Status: FIXED this session** (see §2.1 Remediation below) — all six inline handlers replaced with a document-level delegated click handler over `data-*` attributes; Enter/Space now opens glossary popovers; complete ARIA tabs (tablist/tab/tabpanel, `aria-controls`, roving tabindex, arrow/Home/End); restrictive CSP meta tag shipped (`script-src 'self'`); smoke test extended with 4u–4x regression checks.

### F4 — 🟡 P2 (data contract): per-file coverage metadata exists for only 1 of 36 files
The AUDIT §3.3 recommendation (`coverage_note` + `zh_chars`) was applied to `wumenguan.json` only. `project_metrics.json` gives aggregate CJK counts, but **per-text coverage lives only in README/AUDIT prose** (e.g. "Biyanlu 7/100"), so a doc/data mismatch like F1 can recur silently. Cheap fix: have `validate_data.py --write-metrics` emit a per-text `{zh_chars, coverage_note}` block (or generate it from data) and have README consume it.

### F5 — 🟢 P3 (performance, advisory): annotator and search-index scaling
`annotateClassicalChinese()` does a linear glossary scan + `indexOf` per term per unit per render (31 terms × ~13K chars — fine today, O(T×N) as the glossary grows toward 150+/1,000 terms). Search builds the full unit index **synchronously on first keystroke** (~fine now; will jank on mid-range phones once Biyanlu/Chuandenglu land). Both have comments acknowledging the trade-off; worth revisiting before Phase-2 corpus growth — not urgent.

### F6 — 🟢 P3 (docs nit): "Huangbo *Chuanxin* 4" vs actual split
AUDIT §10.2's verified-by-text row says *"Huangbo Chuanxin 4"* but the 4 verified slots are split **2 in `huangbo_chuanxin.json` (T2012A) + 2 in `huangbo_wanling.json` (T2012B)**. The README's "6 corpus texts" is defensible (Huangbo counted as one text entity), but the AUDIT row should read *"Huangbo (Chuanxin 2 + Wanling 2)"* for precision.
**Status: FIXED this session** (AUDIT §10.2 row).

### F7 — 🟡 P2 (release engineering): required-check enforcement still unconfirmed
The Quality workflow is checked in and triggers on `push` to `main`/`arena/**` + PRs to `main`. Whether it is a **required** check on `main` could not be confirmed (branch-protection API returns 403 for this token). This is the previous audit's A1, still open — needs the repo owner/admin to enable the requirement.

### F8 — 🟢 P3 (UX truth): "Zero-Backend Offline" chip vs Google Fonts
The hero chip "🌐 Zero-Backend Offline" is technically true (zero backend; offline works with fallback fonts) but the app loads Noto Serif SC + Inter from Google Fonts. `RESEARCH_RELEASE_PLAN` Phase 4 and C10 suggested rewording to "Zero-Backend Static" or self-hosting fonts. Minor.

### F9 — 🟢 P3 (tooling): script docstrings still overpromise (carried from C9)
`ingest_cbeta.py`'s docstring says *"Parses raw Classical Chinese… maps CBETA canonical IDs"* — it is a punctuation segmenter (no CBETA fetching, no ID mapping). `arena_agent_pipeline.py`'s docstring says *"translation & alignment pipeline"* — it is prompt scaffolding + an entry builder. Both were flagged in the prior audit (C9); still accurate to say the docstrings overstate. Either narrow the docstrings or implement real CBETA fetching (Kanripo/CBETA API) under Phase 2.

### F10 — 🟡 P2 (testing): no real-browser regression suite (carried from A4/C9)
The smoke test is a hand-built DOM stub + `eval` — excellent breadth, but it cannot validate layout/breakpoints, real hash navigation, pointer/keyboard semantics in a browser, CSP behavior, or screen-reader output. `RESEARCH_RELEASE_PLAN` Phase 0 lists a small Playwright/WebDriver suite (desktop + mobile) as open.

---

## 4. Measured Data Snapshot (this session)

| Dataset | Measured | Doc claim | Verdict |
|---|---|---|---|
| Corpus files / manifest / UI keys | 36 / 36 / 36 | 36 | ✅ |
| Content CJK chars (source `zh` fields, excl. metadata) | **13,268** | 13,090 (README/AUDIT — stale) | 🟠 F1 → fixed |
| All-string CJK chars | **16,457** | 16,270 (stale) | 🟠 F1 → fixed |
| Wumenguan | 48/48 + preface + epilogue | complete | ✅ |
| Biyanlu / Congronglu | 7 / 2 cases | 7/100, 2/100 | ✅ honest |
| Translation slots (corpus) | 856 (138 ✅ · 692 ⚠️ · 26 🤖) | — | ✅ |
| Verified matrix rows | 2 (Blyth; Senzaki & Reps) | 2 | ✅ |
| Verified reference coverage | 135 recorded / 5 pending | 135/140 | ✅ |
| Glossary / Lineage profiles / Gong'an index | 31 / 30(+4 frontiers) / 18 | 31 · 30+4 · 18 | ✅ |
| Locators | 36 docs + 57/57 case units | 57/57 | ✅ |
| Rights manifest sources | 13 (12 `needs_rights_review` / `jurisdiction_review_required`) | 13 | ✅ |
| Editorial queues | 33 traceability records (30 need unit locators) · 34 profile reviews (29 need exact locators) | same | ✅ |
| Bundle | `app_data.js` 728,245 B, deterministic | — | ✅ |

---

## 5. What's Genuinely Good (keep protecting)

1. **Zero-backend static architecture** — single deterministic bundle, no runtime fetches, no build step for contributors; ideal for GitHub Pages longevity.
2. **Deterministic build + validator + smoke suite** — the safety net that has made every prior audit's fixes stick; `diff -rq data docs/data` is a real guard now.
3. **Attribution-integrity discipline** — machine-readable provenance policy v2.2, per-column badges, honest negatives (5 pending references stay pending; Suzuki/Cleary unverifiable registers stay reconstruction), rights-manifest resolution enforced by the validator.
4. **Measured-not-aspirational documentation culture** — counts come from the validator; the "excerpt seed" honesty (35/36) is a genuine scholarly strength.
5. **Schema heterogeneity handled cleanly** — cases/sections/dialogues/stanzas/chapters/five_ranks/sample_records/preface/epilogue all render and all search; sparse case navigation resolves actual neighbors.
6. **Editorial queues exist and are enforced** — traceability (33), profile review (34), and lineage verification registries make the remaining work visible and auditable rather than hidden.

---

## 6. Open Items Carried From Prior Audits (unchanged, still open)

- **A1/F7** — require the Quality check on `main` (needs owner).
- **A2/C7** — editorial migration of 33 `legacy_document_seed` locators + rights review of the 13 sources before publication claims.
- **A4/F10** — real-browser (Playwright) suite.
- **A5/C10/F3** — ~~keyboard semantics + CSP (inline `onclick` removal)~~ **remediated this session** (§2.1); real-browser verification of the CSP/keyboard paths remains part of F10.
- **A6** — Phase-2 content: Biyanlu 7/100 is the agreed next pilot.
- **A7** — bundle payload growth strategy before major corpus expansion.
- **C11** — (historical; Studio/LaTeX export was retired from public scope with the Studio itself).
- **D3** — service worker: intentionally skipped by design (zero-magic policy).

---

## 7. Recommended Next Steps (proposal — awaiting direction)

1. **F4**: extend `validate_data.py` to emit per-text coverage metrics so README counts can never drift again (also closes the F1 class of bug permanently).
2. **F7**: ask the repo owner to require the Quality check on `main` (one admin action).
3. **F10**: add a small Playwright smoke suite (initial load, deep link, mobile picker, lazy cases, citation popover, keyboard, print).
4. **Then Phase 2 content**: complete Biyanlu under the locator/provenance/rights contract (first 10 cases as pilot).
5. **F9**: narrow the two script docstrings (2-minute fix) or budget real CBETA fetching.
6. **F5**: revisit annotator/search-index scaling before major corpus growth.

---

## 2.1 Remediation Log (same session, `arena/019fe30b-translatechan`)

### F3 — a11y/CSP hardening completed ✅

| Item | Change | Regression evidence |
|---|---|---|
| Six inline `onclick` handlers removed | Case chips, case prev/current/next footer, load-more, teacher links, master work links, and search-jump buttons now carry `data-*` attributes routed through one **document-level delegated click handler** (`[data-jump-case]`, `#case-load-more-btn`, `[data-open-case]`, `[data-open-doc]`, `[data-master-teacher]`) | Smoke 4v: simulated delegated clicks reach `scrollToCase`/`openDoc`; 4u greps `app.js` + `index.html` source and fails on any `onclick="…"`-style attribute |
| Glossary terms keyboard-activatable | Reader `keydown` now opens the shared popover on **Enter/Space** (Escape still closes) | Smoke 4w: Enter on a focused `.term-highlight` populates the `#term-popover` |
| Complete ARIA tabs | Nav buttons carry `id` + `aria-controls`; view sections carry `role="tabpanel"` + `aria-labelledby`; all `<li>` wrappers `role="none"`; JS applies **roving tabindex** (active `0`, others `-1`) and **ArrowLeft/Right + Home/End** navigation that activates like a click | Smoke 4x: after init only the active tab is tabbable; ArrowRight activates matrix→lineage; End activates lexicon |
| Restrictive CSP | `<meta http-equiv="Content-Security-Policy">` with `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'` — no inline scripts/event-handler attributes possible | Smoke 4u asserts the meta tag + `script-src 'self'`; `node --check` clean; full suite green; root↔`docs` byte-identical |

**Verification:** `python3 scripts/validate_data.py` ✅ · `python3 scripts/build_data_bundle.py` deterministic ✅ · `node scripts/smoke_test.mjs` ✅ (incl. new 4u–4x checks) · `diff -rq data docs/data` silent ✅ · `cmp` root↔docs app assets identical ✅.

**Boundary kept explicit:** remaining keyboard/CSP work per `RESEARCH_RELEASE_PLAN.md` Phase 4 — real-browser (Playwright) verification of the CSP and keyboard paths, plus a full a11y scan; not replaced by the DOM-stub suite.

---

## 8. Audit Limitations

This audit did not independently collate every Chinese passage against CBETA/TEI, verify every modern quotation against print editions, provide legal advice on copyright/fair use, execute a real browser matrix, or certify screen-reader support. Passing local checks establishes code/data/documentation consistency — not scholarly or legal publication clearance. GitHub API checks were read-only and token-scoped (branch protection returned 403).

---

**One-sentence completion summary:** This audit found a healthy, deterministic, honestly-labeled static reader with all quality gates green and every prior remediation holding, remediated the remaining a11y/CSP gaps (delegated events, ARIA tabs, keyboard glossary terms, restrictive CSP) with regression coverage, and left open only the tracked editorial migration, real-browser testing, branch-protection confirmation, and Phase-2 corpus expansion.
