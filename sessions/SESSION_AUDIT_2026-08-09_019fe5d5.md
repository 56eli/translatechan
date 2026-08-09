# 🔍 TranslateChan — Full Project Audit (session `arena/019fe5d5-translatechan`)

> **Audited:** 2026-08-09 UTC · branch `arena/019fe5d5-translatechan` · baseline merge `33f3fcf` (= `main` = PR #7)
> **Scope:** runtime/renderer, build & deploy path, data-contract tooling, test coverage, documentation truthfulness, data consistency, a11y/design consistency, release operations.
> **Verdict in one line:** the project is healthy and every quality gate passes; the findings are **drift and consistency issues, not breakage** — a documentation-truthfulness guard and a small set of data-normalization passes are the recommended next phase.

---

## 1. Executive assessment

TranslateChan remains a sound zero-backend scholarly reader. The validator, deterministic bundle, deploy mirror, and smoke test all pass at baseline; the previous session's a11y/CSP hardening is holding. This audit did **not** find any P0/P1 defects.

What this audit did find is a *pattern*: **prose documentation and hard-coded UI copy drift from the validator-generated ground truth** every time the corpus grows, because nothing machine-checks the prose. The CJK counts fixed in session `019fe30b` (F1) were already stale again at merge time of PR #7 (Biyanlu expansion landed in the same session after the prose sync). The same mechanism produced a stale matrix subtitle (names a translator who is not in the data; omits two who are), a stale structure tree in HANDOFF, and a stale code comment.

| Area | Assessment | Grade |
|---|---|---:|
| Runtime/rendering | All gates green; delegation-based handlers, CSP, ARIA tabs all in place | A− |
| Build/deployment | Deterministic bundle; root↔docs byte-identical; CI mirrors local gates | A− |
| Data integrity tooling | Validator + metrics + locator registry remain the strongest part of the project | A− |
| Documentation truthfulness | **Resolved this session**: validator now enforces a 13-rule doc-truthfulness gate (README/HANDOFF/index.html must quote live metrics); all current drift fixed | A− |
| Data consistency | **Resolved this session**: 22 school variants → 12 validator-enforced `school_key` groups; school & lexicon-category filters now data-derived; gong'an themes remain per-entry free text | B+ |
| Renderer escaping hygiene | **Resolved this session**: ~60 sites escaped consistently across reader/lineage/gong'an/lexicon/dossier; poison-fixture regression (smoke 4y) efficacy-verified | A− |
| Test automation | Dependency-free smoke suite + optional Playwright; no prose-doc or vocabulary checks | B+ |
| Content breadth | Unchanged: 1/36 complete (Wumenguan), Biyanlu 14/100; excerpt seeds elsewhere | C |

**Baseline evidence** (all re-run this session, 2026-08-09):

```text
python3 scripts/validate_data.py   → ✅ corpus=36 | slots=874 | verified=138 | matrix=21 | locators=64/64
python3 scripts/build_data_bundle.py → ✅ 36 docs, app_data.js 791,312 bytes, /docs synchronized
node scripts/smoke_test.mjs        → ✅ 36 texts exercised, 0 crashes
python3 -m py_compile scripts/*.py → ✅
```

Measured facts: 36 corpus docs; 31 glossary terms; 34 masters (30 seed + 4 frontier); 23 gong'an entries with 23 distinct free-text themes; matrix = 4 rows / 9 translator registers (Cleary, Red Pine, Sasaki, Suzuki, Blyth, Blofeld, Yampolsky, Senzaki & Reps, AI engine); metrics: **20,017 content CJK / 23,314 all-string CJK**.

---

## 2. Fixed in this session (factual, unambiguous drift)

| # | Item | Was | Now |
|---|---|---|---|
| F1 | README "Honest status" CJK counts | 13,268 / 16,457 (stale since Biyanlu grew) | 20,017 / 23,314 (= `project_metrics.json`) |
| F2 | README repo-structure tree | `ingest_cbeta.py` listed twice | duplicate removed |
| F3 | `index.html` comment | "600KB data bundle" | "~790KB data bundle" (791,312 B) |
| F4 | Matrix subtitle (`index.html`) | named **Heine** (absent from data), omitted Yampolsky + Senzaki & Reps (present) | matches the 9 registers actually in `comparative_matrix.json` |
| F5 | HANDOFF structure tree | gong'an "18 entries" (actual 23; HANDOFF's own §Deliverables says 23); scripts list missing `arena_agent_pipeline.py`, `browser_test.mjs` | corrected + completed |
| F6 | `#lineage-school-filter` | only `<select>` without an accessible name | `aria-label` added (sort/lexicon selects already had one) |

Gates re-run after fixes: validator ✅, build ✅ (root↔docs re-synced), smoke ✅.

---

## 3. Open findings (priority-ordered)

### P2-A — Prose documentation has no automated truthfulness guard ✅ **DELIVERED THIS SESSION**

`project_metrics.json` is deterministic and CI-verified, but **nothing checked the prose** that quotes those numbers (README, HANDOFF, index.html copy). The same F1 class of drift occurred in two consecutive sessions and recurred every corpus-growth session.

**Delivered 2026-08-09:** `validate_data.py` now runs a **doc-truthfulness gate** (`validate_doc_truthfulness`) on every invocation — 13 rules asserting that README.md, HANDOFF.md, and index.html contain exact snippets built from live metrics (CJK counts, corpus/manifest/gong'an/glossary/master counts, Wumenguan+Biyanlu coverage strings, the HANDOFF quality-gate line, the 135/140 verified-reference split, the hero corpus chip). Historical session logs (AUDIT.md, SESSION_AUDIT_*) are intentionally excluded as dated records. Negative-tested: drift produces exit-1 with a precise error naming the rule; `--skip-docs` bypasses while intentionally editing prose. CI enforces it with no workflow change (the Quality job already runs the validator).

### P2-B — Master `school` labels are an unowned vocabulary ✅ **DELIVERED THIS SESSION**

22 distinct `school` strings across 34 masters: `"Caodong School"` **and** `"Caodong School (曹洞宗)"`; `"Linji / Yangqi Branch"` **and** `"Linji / Yangqi tradition"`; `"Hunan Lineage"` **and** `"Hunan Lineage (Caodong & Yunmen ancestor)"`; unlisted groups (`Hongzhou School`, `East Mountain Teaching`, `Southern School`, `Indian Patriarchal Tradition`). The lineage filter was a **hardcoded 6-option list** doing substring matching — newer lineage groups were unreachable by filter, and the SVG graph's color map (keyed on exact free-text school strings) mostly fell back to the default color.

**Delivered 2026-08-09:** `data/lineage/school_vocabulary.json` defines **12 canonical school_key groups** (Indian Patriarchs, Six Patriarchs, Tang branch roots, Hongzhou, Shitou/Hunan, Linji, Linji/Yangqi, Caodong, Yunmen, Guiyang, Fayan, transmission tradition); all 34 masters carry `school_key` + the canonical `school` display — `validate_data.py` errors on an unknown key or a mismatched display string. The lineage filter options and graph palette are now **derived from the vocabulary/data**, and the lexicon category filter is likewise data-derived. **Bug found while wiring:** the Lexicon "Category" dropdown had no change listener at all (inert UI since introduction) — now wired, with `<label for>` association. Smoke checks 4m2/4m3 guard the derived options, exact Linji group filtering, the school_key palette, and lexicon restrict/reset. *Gong'an theme taxonomy: **delivered 2026-08-09** — `data/gongan/theme_vocabulary.json` curates the 23 per-entry free-text themes into **7 validator-enforced groups** (Buddha-Nature, Beyond Duality, What is Buddha, Direct Pointing, Everyday Way, Transmission & Causality, Existential Barrier); chips derive from groups with counts, cards keep the rich descriptor, smoke 4m4 guards it.*

### P2-C — Renderer HTML-escaping is inconsistent across views ✅ **DELIVERED THIS SESSION**

`renderMatrix` escaped every interpolated field; `renderReader` (headers, case/section/dialogue/stanza/chapter/five-ranks/sample-record fields incl. pinyin/accented speaker lines), `renderLineage`, `renderGonganIndex` (incl. the `data-gongan-filter` attribute), `renderLexicon`, and the master dossier interpolated raw (`m.summary`, `g.summary`, `item.definition`, …). Data today is trusted/committed, so this was **not an active XSS**, but it was latent injection surface (e.g. an `&`/quote in a theme attribute) and inconsistent with the project's own disclosure discipline.

**Delivered 2026-08-09:** ~60 interpolation sites across the reader, lineage cards, gong'an index + filter chips, lexicon cards, and dossier now consistently apply `escHtml()` (attributes included); text content already assigned via `textContent`/citation rows stays as-is. **Regression guard (smoke 4y):** a poison fixture (`<img src=x onerror=…>` injected into a master name, a gong'an theme, a glossary term, and a case title) must render **escaped** in all four views — efficacy-verified by temporarily reverting one escape and watching the check fail, then restoring.

### P2-D — Session artifacts accumulate at repo root ✅ **DELIVERED THIS SESSION**

`response_summary.md` was a committed leftover; two same-day `SESSION_AUDIT_2026-08-08*.md` files coexisted; `AUDIT.md` was 84 KB of append-only log mixing durable verdicts with session process.

**Delivered 2026-08-09:** `sessions/` now holds all dated reports + the audit history archive (`sessions/AUDIT_archive_2026-08-08.md`, nothing lost); repo-root `AUDIT.md` is a slim current-state summary (verdict, standing items, gates, index, convention) — all links in README/HANDOFF/ROADMAP/index.html updated to archive paths; the validator's doc-truthfulness gate continues to pass on every edited doc; root `response_summary.md` is documented as the *live* per-session working file. Convention recorded in AUDIT.md §5 and HANDOFF.md.

### Standing (carried from previous audits, still open)

- **A1 (ops):** branch protection "require Quality check on `main`" — owner-only ~2-minute action, still unverified.
- **A2 (editorial):** 5 verified source records pending page/section reference; 33 document-level locators; rights sign-off before expanding quotation reuse; schema companion is not an executed validation gate (documented as known).
- **Content:** Phase-2 corpus completion (Wumenguan done; Biyanlu 14/100; 34 excerpt seeds) remains the long pole for scholarly value.

---

## 4. What is notably good (protect in future sessions)

1. **Validator-as-contract**: `zh_chars`/`coverage_note`/per-text metrics are validator-enforced and immediately caught real drift (5,876→5,528 case). Extending the same philosophy to prose (P2-A) is the natural next guard.
2. **Honest-UI discipline** survives growth: coverage disclosures, ✓/⚠️/🤖 badges, locator granularity statements.
3. **Deterministic build + committed-artifact CI gate** makes root↔docs drift a compile error rather than a silent skew.
4. **Dependency-free smoke test** with real behavioral coverage (ARIA tabs, delegation handlers, escaped search, sparse case navigation) plus an *optional* Playwright suite that doesn't burden contributors.
5. CSS is token-driven with documented WCAG contrast decisions; dark theme and print CSS are first-class.

---

## 5. Recommended next actions (choose)

1. ~~**P2-A docs guard** (`validate_data.py --check-docs` + CI line) — kills the recurring drift class.~~ ✅ delivered this session.
2. ~~**P2-B school vocabulary normalization + data-derived lineage filter options.**~~ ✅ delivered this session.
3. ~~**P2-C escaping consistency pass.**~~ ✅ delivered this session.
4. ~~**P2-D sessions-folder convention + AUDIT.md slimming.**~~ ✅ delivered this session.
5. **Content**: next Phase-2 text pilot (e.g. Biyanlu 11–20 or Linji expansion), continuing the established CBETA-collated workflow. *(M–L)*
