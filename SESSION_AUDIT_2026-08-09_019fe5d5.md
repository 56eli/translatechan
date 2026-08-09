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
| Documentation truthfulness | Fixed again this session, but prose metrics have no automated guard and re-drifted within one session | B− |
| Data consistency | **Resolved this session**: 22 school variants → 12 validator-enforced `school_key` groups; school & lexicon-category filters now data-derived; gong'an themes remain per-entry free text | B+ |
| Renderer escaping hygiene | Matrix escapes rigorously; lineage/gong'an/lexicon/dossier interpolate raw (trusted data, latent inconsistency) | B |
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

### P2-A — Prose documentation has no automated truthfulness guard *(likely root cause of repeats)*

`project_metrics.json` is deterministic and CI-verified, but **nothing checks the prose** that quotes those numbers (README, HANDOFF, index.html copy). The same F1 class of drift has now occurred in two consecutive sessions — it will recur every corpus-growth session.

**Recommendation:** extend `scripts/validate_data.py` with a `--check-docs` gate that asserts the current `content_cjk_characters` / `all_corpus_cjk_characters` (and key unit counts: 36 docs, 23 gong'an, 31 terms, 34 masters) appear where referenced in README/HANDOFF — or, lighter-weight, replace prose constants with a single "Current numbers" section whose values docs explicitly say to read from `project_metrics.json`. Add to `quality.yml` once implemented. *Small, high-leverage.*

### P2-B — Master `school` labels are an unowned vocabulary ✅ **DELIVERED THIS SESSION**

22 distinct `school` strings across 34 masters: `"Caodong School"` **and** `"Caodong School (曹洞宗)"`; `"Linji / Yangqi Branch"` **and** `"Linji / Yangqi tradition"`; `"Hunan Lineage"` **and** `"Hunan Lineage (Caodong & Yunmen ancestor)"`; unlisted groups (`Hongzhou School`, `East Mountain Teaching`, `Southern School`, `Indian Patriarchal Tradition`). The lineage filter was a **hardcoded 6-option list** doing substring matching — newer lineage groups were unreachable by filter, and the SVG graph's color map (keyed on exact free-text school strings) mostly fell back to the default color.

**Delivered 2026-08-09:** `data/lineage/school_vocabulary.json` defines **12 canonical school_key groups** (Indian Patriarchs, Six Patriarchs, Tang branch roots, Hongzhou, Shitou/Hunan, Linji, Linji/Yangqi, Caodong, Yunmen, Guiyang, Fayan, transmission tradition); all 34 masters carry `school_key` + the canonical `school` display — `validate_data.py` errors on an unknown key or a mismatched display string. The lineage filter options and graph palette are now **derived from the vocabulary/data**, and the lexicon category filter is likewise data-derived. **Bug found while wiring:** the Lexicon "Category" dropdown had no change listener at all (inert UI since introduction) — now wired, with `<label for>` association. Smoke checks 4m2/4m3 guard the derived options, exact Linji group filtering, the school_key palette, and lexicon restrict/reset. *Remaining candidate: gong'an `theme` is still per-entry free text (23 entries → 23 themes); a curated taxonomy is future editorial work.*

### P2-C — Renderer HTML-escaping is inconsistent across views

`renderMatrix` escapes every interpolated field; `renderLineage`, `renderGonganIndex`, `renderLexicon`, and the master dossier interpolate raw (`m.summary`, `g.summary`, `item.definition`, `data-gongan-filter="${t}"`, …). Data today is trusted/committed, so this is **not an active XSS**, but it is latent injection surface (e.g. an `&`/quote in a theme attribute) and inconsistent with the project's own defense-disclosure discipline.

**Recommendation:** one mechanical pass escaping all interpolated data fields (and attribute values via a helper); add a smoke assertion with a poison fixture or a lint-style grep to prevent regressions.

### P2-D — Session artifacts accumulate at repo root

`response_summary.md` (dated 2026-08-08, session `019fe2e0`) is committed; two same-day `SESSION_AUDIT_2026-08-08*.md` files coexist; `AUDIT.md` is 84 KB of append-only log whose durable verdicts are mixed with session history.

**Recommendation:** adopt a convention — session artifacts either dated by name or in `docs/sessions/`; `AUDIT.md` links to session files instead of absorbing them; `response_summary.md` overwritten or removed at session end. (Left for user decision; this session writes its own dated audit file.)

### P3 — Minor UX/consistency notes (post-UX-roadmap)

1. Hero chips hardcode "36 Canonical Works / 8+ Translators" — same drift class as P2-A; either generate from data or accept as infrequently-true copy.
2. `switchViewRaw()` scrolls to top on every programmatic call, including hash-restore paths; acceptable, but scroll-restore would be nicer for back/forward.
3. Gong'an chips encode the filter value unescaped in a `data-*` attribute — works today, fits inside P2-C fix.
4. ~~Lexicon category filter, lineage filter live in markup~~ — resolved with P2-B: both filters are now data-derived.

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

1. **P2-A docs guard** (`validate_data.py --check-docs` + CI line) — kills the recurring drift class. *(S)*
2. ~~**P2-B school vocabulary normalization + data-derived lineage filter options.**~~ ✅ delivered this session.
3. **P2-C escaping consistency pass.** *(S)*
4. **P2-D sessions-folder convention + AUDIT.md slimming.** *(S)*
5. **Content**: next Phase-2 text pilot (e.g. Biyanlu 11–20 or Linji expansion), continuing the established CBETA-collated workflow. *(M–L)*
