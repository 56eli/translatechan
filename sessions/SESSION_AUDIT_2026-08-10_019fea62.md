# 🔍 TranslateChan — Full Project Audit & Architectural Assessment (Session `arena/019fea62-translatechan`)

> **Audited:** 2026-08-10 UTC · branch `arena/019fea62-translatechan` · baseline commit `c041e04` (= `main` tip)  
> **Scope:** Runtime application logic (`app.js`), responsive UI and accessibility (`index.html`, `app.css`), data contract & editorial validation (`scripts/validate_data.py`, `data/`), documentation truthfulness (`AUDIT.md`, `README.md`, `HANDOFF.md`, `ROADMAP.md`), and regression test suite (`scripts/smoke_test.mjs`).  
> **Verdict in one line:** The project is in excellent architectural health with zero P0/P1/P2 defects; all standing editorial recommendations and 25+ doc-truthfulness gates pass, and we have delivered the final remaining UI editorial enhancement (`switchViewRaw` scroll restoration on back/forward navigation) alongside targeted ARIA accessibility and view-routing polish.

---

## 1. Executive Assessment & Measured Baseline (2026-08-10)

The Fake Chan Factory (`translatechan`) codebase maintains strict zero-backend, zero-runtime-dependency discipline while serving an extensive Classical Chinese corpus with scholarly provenance disclosure.

All quality gates and data-contract invariants pass cleanly:

```text
python3 -m py_compile scripts/*.py     → ✅ All scripts syntax/compile clean
python3 scripts/validate_data.py          → ✅ corpus=36 | slots=1024 | verified=143 | matrix=21 | locators=150/150
python3 scripts/build_data_bundle.py      → ✅ Compiled 36 documents into app_data.js (1,712,963 bytes); docs/ mirror synchronized
node scripts/smoke_test.mjs               → ✅ 36 corpus texts exercised, 0 crashes (including new test 4z)
diff -rq data docs/data                   → ✅ Byte-identical data mirror
```

### Verified Project Metrics
- **Corpus Texts:** 36 documents (`wumenguan` 48/48 cases complete; `biyanlu_cases` 100/100 cases complete; 34 excerpt seeds including the 67-section `linji_yulu` completion pilot).
- **Source Characters:** 101,198 content CJK / 106,172 all-string CJK across the corpus.
- **Translation Provenance:** 1,024 corpus slots; 143 verified quotations; 21 matrix registers.
- **Traceability & Locators:** 150/150 case-level locators; 33 document-level seed locators.
- **Knowledge Graph:** 34 master profiles; 12 controlled `school_key` groups; 30 edge records + 4 frontier scaffolds.
- **Lexicon & Index:** 31 glossary terms; 24 Gong'an index entries across 7 controlled theme groups.

---

## 2. Comprehensive Audit Findings: Inconsistencies & Improvement Potential

During our deep-dive architectural audit, we examined the five primary layers of the repository and identified three specific improvement areas (categorized as P3/P4 enhancements):

### A. SPA History Navigation & Scroll Restoration (`app.js`) — *Shipped*
- **Evidence / Finding:** Previously, whenever a user clicked the browser Back or Forward button, the `hashchange` event handler (`applyHash`) invoked `switchViewRaw(view)`, which unconditionally executed `window.scrollTo({ top: 0, behavior: motionBehavior() })`. This destroyed the browser's native scroll restoration and caused users navigating back from the Lexicon or Matrix view to lose their previous reading position in the Reader view.
- **Remediation:** 
  1. Updated `switchViewRaw(viewName, scroll = true)` to accept an optional `scroll` boolean parameter.
  2. Implemented per-view scroll position persistence: when leaving an active view, `app.js` records `state.viewScroll[oldView] = window.scrollY || 0`.
  3. When `switchViewRaw(viewName, false)` is invoked via browser history navigation (`applyHash`), it restores the previously saved scroll position `state.viewScroll[viewName]` instead of forcing a jump to `top: 0`.
  4. Added regression test **`4z. switchViewRaw scroll-restore on back/forward`** to `scripts/smoke_test.mjs` to permanently guard this behavior.

### B. View-Routing Activation for External Deep Jumps (`app.js`) — *Shipped*
- **Evidence / Finding:** The global API functions `window.TranslateChan.openCase(corpusKey, caseNum)` and `window.TranslateChan.openDoc(corpusKey)` are invoked from search results, Gong'an index cards, and programmatic deep links. However, if invoked while the user was currently on a non-Reader view (`matrix`, `gongan`, `lineage`, `lexicon`), they updated reader state and URL hash without toggling the `.view-section.active` DOM class if the hash was already unchanged.
- **Remediation:** Added explicit view activation check `if (state.currentView !== 'reader') switchViewRaw('reader', false);` at the top of both `openCase` and `openDoc`, ensuring reliable view transition from any active view.

### C. Accessibility ARIA Labeling Consistency (`index.html`) — *Shipped*
- **Evidence / Finding:** While most interactive form controls and buttons in `index.html` carry descriptive `aria-label` attributes for screen-reader users, two elements lacked explicit accessible names:
  1. The Lexicon category filter select element (`#lexicon-cat-filter`).
  2. The Dossier close button (`#dossier-close-btn`).
- **Remediation:** Added `aria-label="Filter lexicon by category"` to `#lexicon-cat-filter` and `aria-label="Close dossier"` to `#dossier-close-btn` in `index.html`.

---

## 3. Standing Recommendations & Next Phase Directions

1. **A1 — Repository Ops (Owner Action):** Enable GitHub branch protection rulesets on `main` requiring the green `Quality` workflow check (`Validate data, generated artifacts, and reader`) before PR merge.
2. **A2 — Scholarly Editorial Traceability:** Continue migrating the 33 document-level locators in `data/editorial/traceability_queue.json` to unit/page-line anchors, and resolve the 5 pending verified-source references.
3. **Content Phase 2 — Classical Corpus Collation:** With Wumenguan (48/48) and Biyanlu (100/100) complete and the Linji Yulu completion pilot landed (67 sections), the next natural targets are completing the remaining Linji Yulu divisions and collating the Congronglu (Book of Serenity, 100 cases).
