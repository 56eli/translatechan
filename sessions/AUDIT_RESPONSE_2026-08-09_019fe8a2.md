# TranslateChan — Independent Full Audit (2026-08-09, session `arena/019fe8a2-translatechan`)

> Senior-developer + web-designer pass over the whole repository. Scope:
> architecture, code quality, data integrity, web design/UX, performance,
> accessibility, documentation, and ops. This is an *audit* document — no code
> was changed to produce it. Follow-up actions are proposed at the end as
> questions for the owner.

---

## 0. Verdict

**Healthy and mature. No P0 / P1 / P2 issues found.** All quality gates pass on
the current tree:

```
python3 scripts/validate_data.py   →  ✅ corpus=36 | slots=1023 | verified=138 | matrix=21 | locators=150/150
node   scripts/smoke_test.mjs      →  ✅ 36 texts exercised, 0 crashes
diff -rq data docs/data            →  identical (root↔docs mirror in sync)
```

The project has clearly been through many disciplined audit cycles (7 archived
sessions, a 1153-line semantic validator, a doc-truthfulness gate). This pass
confirms that discipline holds and focuses on **inconsistencies** and
**improvement potential** the existing process has not yet captured.

---

## 1. What the project is (one-paragraph orientation)

TranslateChan is a **zero-backend static GitHub Pages web app** — a scholarly
reader for Classical Chinese Chan/Zen literature (CBETA / Taishō 47, 48, 51).
Five views: Bilingual Reader, Comparative Translation Matrix, Lineage Knowledge
Graph, Gong'an Index, and Chan Lexicon. Stack: vanilla JS (one ~2,500-line
`app.js`, no framework, no build step for the app itself), one generated
`app_data.js` data bundle, hand-written `app.css`, strict CSP
(`script-src 'self'`), and a Python data-validation/build pipeline. 36 corpus
texts (Wumenguan 48/48 and Biyanlu 100/100 fully collated; 34 excerpt seeds),
34 lineage masters, 24 gong'an, 31 lexicon terms.

---

## 2. Strengths worth preserving

| Area | Observation |
|---|---|
| **Provenance discipline** | Every translation carries one of three self-describing statuses (`verified_quotation` / `reconstruction_unverified` / `ai_draft`) and a rights-manifest source id. This is rare and genuinely scholarly. The UI renders the distinction visibly and in popovers. |
| **Validator** | `scripts/validate_data.py` (1,153 lines) enforces schema + semantic invariants + rights/locator coverage + deterministic metrics + **doc-truthfulness** (README/HANDOFF/ROADMAP/index.html/AUDIT must quote live numbers). This single gate is what keeps the docs from drifting, and it is the project's crown jewel. |
| **Defensive front-end** | `app.js` treats `localStorage` and persisted prefs as untrusted (try/catch everywhere, bounded numeric ranges), escapes all data interpolation (`escHtml`), and uses delegated `data-*` handlers instead of inline `onclick` to keep CSP satisfiable. |
| **Accessibility** | ARIA tabs with roving tabindex + arrow/Home/End, non-modal focus-managed dossier dialog (Escape/✕ restores focus), `:focus-visible` glossary popovers, reduced-motion scroll gate, skip-link, semantic `<h1>/<h2>` outline. Above average for a hand-rolled SPA. |
| **Security** | Strict CSP, no inline scripts/handlers, `object-src 'none'; base-uri 'none'; form-action 'none'`, source metadata kept out of the DOM (citation details in a JS `Map`, not data-attributes). |
| **Test coverage** | Dependency-free `smoke_test.mjs` is the CI gate (renders all 36 texts × 3 modes, search, a11y, escaping, scope guards); optional Playwright suite degrades gracefully to SKIP. |
| **History discipline** | Append-only `sessions/`, slim `AUDIT.md`, live `response_summary.md`. Clear conventions, nothing deleted. |

---

## 3. Inconsistencies found (concrete, verifiable)

These are small but real drifts the existing gate does not catch because the
gate checks *numbers*, not *prose comments*.

### 3.1 Stale bundle-size comments — "~873 KB" (3 occurrences) ⚠️
The data bundle grew to **~1.69 MB on disk / ~465 KB gzipped** after the
Biyanlu-100/100 and Linji-pilot campaigns, but three comments still cite the
old size:

- `index.html:33` — `<!-- D4: parse the ~873KB data bundle as early as possible. ...`
- `theme-init.js:4` — `before the stylesheet and the ~873 KB data bundle`
- `scripts/smoke_test.mjs:53` — `~873 KB bundle downloads`

Fix: reword to a size-agnostic phrasing (e.g. "the multi-megabyte data bundle")
or update to the current number. The doc-truthfulness gate does not cover code
comments, so this rots silently. Consider wording that never needs updating.

### 3.2 Hero chip fallback vs. live value (cosmetic)
`index.html` hard-codes `📜 36 Canonical Works` and `⚖️ 8+ Translators Aligned`.
`updateHeroCounts()` correctly overwrites both from live data after init, but
before JS runs (or if it fails) the "8+" is a static guess. Low impact; the
fallback is reasonable. The corpus count (36) happens to match today.

### 3.3 "873 KB" preload is fine; the *preload rationale* comment is now misleading
The `<link rel="preload" href="app_data.js" as="script">` + `defer` ordering is
correct and worth keeping. Only the *comment* is stale (see 3.1).

### 3.4 No other dead links / dead references
Markdown internal-link check across all `*.md` and `sessions/*.md`: **0 dead
links**. No `TODO`/`FIXME`/`XXX`/`HACK` markers in any code or test file. Good.

---

## 4. Improvement potential (prioritized, with effort/impact)

### 🟡 Performance

**P-perf-1 — The data bundle is pretty-printed (`indent=2`).** Measured:
1.69 MB on disk → compact JSON is ~1.12 MB (**−18% disk / −244 KB**). *However*,
gzipped wire transfer only goes 465 KB → 454 KB (**−2.4%**), because gzip
crushes whitespace. **Net: this is a repo-cleanliness and parse-time win, not a
meaningful wire win.** Worth doing for tidiness; do **not** expect a user-facing
speedup. (One-line change in `build_data_bundle.py`.)

**P-perf-2 — Entire corpus ships in one upfront global.** Search is full-corpus
and client-side, so the index needs all data — but the *Reader* only ever shows
one text. Splitting per-text corpus into individually-fetched JSON (loaded on
first view, cached) would cut initial work and let the search index build
incrementally. This is a **larger architectural change** and trades the elegant
"one global script" model for fetch+cache complexity. Probably not worth it
while the gzipped payload is a healthy 465 KB; revisit only if the corpus
grows 3–5×. Document the decision either way.

### 🟡 Code maintainability

**M-1 — 65 inline `style="…"` attributes generated in `app.js`.** Examples:
`text-align: center; margin: 1.5rem 0;`, the five-ranks grid, the matrix note,
dossier rows. These are hard to theme, duplicate intent, and bypass the CSS
custom-property system. Recommend extracting the recurring ones into named
classes (`.load-more-wrap`, `.five-ranks-grid`, `.dossier-meta-row`, …). Effort:
medium; payoff: theming + dark-mode consistency + smaller JS.

**M-2 — `app.js` is a single 2,492-line IIFE.** It is well-organized and
commented, but it has grown past comfortable navigation. Constrained by the
no-build / `script-src 'self'` model. Options, in rising effort:
  - (a) Split into a few ES modules (`<script type="module">` is CSP-`'self'`
    compatible) — Reader / Matrix / Lineage / Search / Popovers.
  - (b) Keep one file but extract the data-shape renderers into a clearly
    delimited section with a table-of-contents header comment.
  - (c) Status quo is acceptable given the comment quality. **Low urgency.**

**M-3 — Repeated HTML template strings.** The dialogue-block markup
(`<div class="case-speaker">…classical-zh…pinyin…translations`) is rebuilt
inline in ~6 render functions (`renderCaseItem`, `renderSectionItem`,
`renderDialogueItem`, `renderStanzaItem`, `renderChapterItem`,
`renderSampleRecords`). A single `renderDialogueBlock(d, locator)` helper would
remove ~80 lines of near-duplicate code and guarantee these schemas never
visually diverge. **Good first refactor.**

### 🟢 Data / editorial (mostly already tracked in AUDIT.md §2)

- **D-1** — 33 document-level locators still pending unit/page anchors; 5
  verified-source references still pending. Both tracked in
  `data/editorial/traceability_queue.json` and surfaced honestly in the UI.
- **D-2** — Lexicon is 31 terms vs. a 150+ roadmap target. Content work, not code.
- **D-3** — Matrix has 4 rows / 21 registers. Honest and disclosed; growth is
  editorial.

### 🟢 Architecture / ops

**A-1 — `docs/` duplicates the entire app + `data/` (3.5 MB vs 1.7 MB root).**
This is deliberate (GitHub Pages serves `/docs`; root copy supports local dev),
and a CI `diff -rq` gate keeps them byte-identical. It doubles committed size
and the maintenance surface, though. Alternatives:
  - Serve Pages from **root** (set Pages source to the branch root) → delete
    `docs/` entirely. Simplest win; removes ~half the committed app weight and
    the sync gate.
  - Or **gitignore `docs/`** and build it in CI before deploy (needs a deploy
    step, which the workflow currently intentionally avoids).
  This is an owner decision tied to the Pages source setting.

**A-2 — `app_data.js` and `docs/app_data.js` are both committed (≈3.4 MB
together).** Same trade-off as A-1: the project values zero-build deployability
over a lean repo. Defensible; just flag it.

**A-3 — Branch protection (standing item A1).** The Quality workflow is not yet
*required* on `main`. Repeatedly flagged; owner action.

### 🟢 Web design / UX

- **UX-1 — Good.** The "rice-paper / ink" palette, Noto Serif SC typography,
  calm spacing, and dark-mode parity read as intentionally contemplative and
  suit the subject. WCAG AA contrast is actively maintained (a code comment
  records darkening `--text-muted` from ~2.8:1).
- **UX-2 — The lineage SVG forces `height` up to the full generation span.**
  Long lineages produce a tall canvas; pan/zoom is provided, but a
  fit-to-container initial transform (or a "fit" button next to "Reset View")
  would improve first impression. Minor.
- **UX-3 — Mobile bottom action bar + sidebar hidden < 960px** is well handled.
  The case-jump strip only appears for texts with ≥10 cases — good
  progressive disclosure.
- **UX-4 — No empty-state illustration/copy polish** beyond the search
  "no matches" card. Fine for a scholarly tool.

---

## 5. Things explicitly checked and found **clean**

- Root↔`docs` byte-identity (app assets + data mirror).
- Validator metrics match live data; doc-truthfulness gate passes.
- No dead internal markdown links; no leftover TODO/FIXME markers.
- Search: diacritic-folded pinyin, orthographic-variant normalization,
  per-field match disclosure, debounced, cached index, capped results with
  honest "showing N of M".
- Escaping: all data interpolation routes through `escHtml`; snippet highlighter
  escapes non-match text too (no injection path).
- Provenance: verified quotations resolve to the rights manifest; AI/recon
  registers carry explicit do-not-cite disclosure.
- Accessibility: tablist keyboard model, focus management, reduced motion,
  semantic headings, ARIA roles on tabs/tooltip/dialog.

---

## 6. Suggested next actions (owner to choose)

1. **Quick wins (≈15 min, no behavior change):** fix the three "~873 KB"
   stale comments (§3.1); optionally compact the bundle JSON (§P-perf-1).
2. **Small refactor (≈1–2 h):** extract `renderDialogueBlock` helper (§M-3) and
   pull the 65 inline styles into named classes (§M-1).
3. **Owner decision:** resolve the `docs/` duplication by pointing Pages at root
   (§A-1) — biggest repo-leanliness win for ~zero risk.
4. **Editorial (ongoing):** continue the Phase-2 completion campaign (remaining
   Linji divisions, Congronglu 100/100), the 33 locator migrations, and the 5
   pending verified references (all already tracked).
5. **Defer:** module split (§M-2) and per-text lazy-loading (§P-perf-2) — worth
   doing eventually, not urgent at the current scale.
