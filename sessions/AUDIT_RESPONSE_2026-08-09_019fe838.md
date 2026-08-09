# 🔍 Independent Full Audit & Remediation — 2026-08-09, session `arena/019fe838-translatechan`

> Dated session report (append-only per AUDIT.md §5). Scope: full repository —
> docs, app code, data, scripts, CI, and ops. Method: all quality gates re-run
> locally; complete read of root docs (`README`, `HANDOFF`, `ROADMAP`,
> `UX_ROADMAP`, `RESEARCH_RELEASE_PLAN`, `vision.md`, `AUDIT.md`); full scan of
> `app.js` (2,492 lines), `index.html`, `app.css` (1,555 lines), `theme-init.js`,
> all scripts; JSON cross-consistency checks over `data/`; canon-numbering spot
> checks against scholarly citations; live preview server; workflow-push probe.

---

## 1. Verdict

**Healthy — no P0/P1/P2 found.** All gates were green on arrival (`validate_data.py`
`corpus=36 | slots=1023 | verified=138 | matrix=21 | locators=150/150`;
`build_data_bundle.py`; `smoke_test.mjs` — 36 texts, 0 crashes; root↔docs
byte-identical; `diff -rq data docs/data` silent). Prior sessions' remediations
(N1–N10, B1–B10, A1–A5 waves) verified holding — no regressions found in the
escaping, ARIA, popover, search-index, or lazy-render paths re-inspected.

**8 new findings (M1–M8)**, all documentation-consistency or process class
(P3/P4/ops) — consistent with a maturing repo whose remaining drift is exactly
what the doc-truthfulness gate was built to catch; the findings share one root
cause: *two living docs were outside the gate.* All in-session findings shipped
below; the single owner-bound item was re-probed and re-documented (M8).

## 2. Findings & remediations (all shipped this session)

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| M1 | P3 | ROADMAP tech tree stale gong'an count | `ROADMAP.md` tree said `gongan_index.json (23 cases)`; data has **24** | → 24; doc-gate rule added (M7) |
| M2 | P3 | HANDOFF matrix roster names a translator with no matrix register | Exec-summary item 6 listed "Steven Heine" among matrix registers; `comparative_matrix.json` registers are Red Pine, Cleary, Sasaki, Suzuki, Blyth, Blofeld, Yampolsky (+ verified Senzaki & Reps; Heine exists only as 5 corpus slots) | Heine removed from the matrix roster + disclosure that his registers are corpus-only |
| M3 | P3 | `vision.md` canon table internally inconsistent & partly wrong vs CBETA | "Vol. 47 (T1957–T1984)" row listed T1986/T1987/T1988 works and *Linji Yulu* T1985 sat under a "Vol. 48" row; "Caoshan Benji Yulu (T1987)" conflicted with corpus `zhaozhou=T1987`; "Xuanling Yulu" typo for Xuansha; Phase-2 checkbox for the Wumenguan/Biyanlu completion left `- [ ]` though both are done | Vol-47 row → `(T1957–T1990)` incl. Linji T1985 + Zhaozhou T1987; Caoshan → T1987B (matches scholarly citation, e.g. JCBS 33: "Fuzhou Caoshan Benji chanshi yulu T 47, no. 1987b"); Xuanling→Xuansha (X1445, per repo canon audit); Vol-48 row → `(T1991–T2025)` without Linji; coverage checkbox marked complete with dates, Congronglu still open |
| M4 | P4 | Stale bundle-size comment | `index.html` D4 comment said "~873KB data bundle"; live bundle is 1,685,556 B (~1.65 MB after Biyanlu 100/100 + Linji pilot) | comment made size-agnostic ("don't hardcode it here; AUDIT.md §1 tracks it") |
| M5 | P3 | `RESEARCH_RELEASE_PLAN.md` baseline frozen at 2026-08-08 | claimed "Wumenguan is the only complete work", "Biyanlu cases 1–10 … (14/100)", "all 57 stored case units" — reality: Biyanlu 100/100 ✅, 150 case units, Linji pilot 67 sections; Phase-3 described as "the next content pilot" after completion | baseline refreshed (2026-08-09, session id noted); Phase-3 reframed as the completed campaign whose contract now governs Linji/Congronglu; pending items (post-verse 頌評唱 rendering, human sign-off) kept explicit |
| M6 | P4 | Gong'an view subtitle overpromises | `index.html`: "cross-indexed across Wumenguan, Biyanlu, Congronglu, and Chuandenglu" — index entries come only from Wumenguan+Biyanlu (cross-refs do reach Congronglu/Chuandenglu/others) | subtitle now: "indexed from the Wumenguan and Biyanlu, cross-referenced into the Congronglu, Chuandenglu, and related transmission records" |
| M7 | P2→resolved | Doc-truthfulness gate had uncovered living docs | M1/M5 classes were exactly the drift the gate exists to catch, but ROADMAP/RESEARCH plan were outside it | validator gained 4 rules: ROADMAP tree gong'an count; RESEARCH plan `all {case_locators} stored case units`; RESEARCH plan excerpt-seed count; RESEARCH plan Biyanlu coverage string — **negative-tested** (reverting values fails validation with the named rule) |
| M8 | P2 (owner) | CI generated-artifact gate still missing `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml` | HANDOFF documents this as token-blocked (no `workflows` scope) | **re-probed 2026-08-09:** one-line fix committed → push rejected (`without workflows permission`) → reverted; remains owner action (option: grant the sessions GitHub App token the `workflows` scope) |

**Housekeeping:** one broken relative link in the previous session's archived
report (`sessions/AUDIT_RESPONSE_2026-08-09_019fe731.md` → `data/corpus/…`
missing the `../` prefix; session files sit one level below root) was path-
repaired without touching its dated content — the repo-wide internal
markdown-link check is clean again. Same fix class as N10's "stale § pointers".

## 3. Areas re-verified (no findings)

- **Security / CSP**: no inline handlers (delegated `data-*` pattern holds);
  `escHtml` used consistently on every data-derived interpolation re-inspected
  (reader, matrix, lineage, gong'an, lexicon, search snippets);
  `makeSnippet`/`makeFieldSnippet` escape non-match text (poison regression
  still in smoke); storage access guarded; localStorage JSON parsed defensively.
- **Accessibility**: skip-link, ARIA tabs with roving tabindex, focus-managed
  non-modal dossier (Escape layering vs. popovers), focus-revealed glossary
  popover, `type="search"` + `role="search"` landmark, reduced-motion scroll
  gate, `lang="zh"` blocks — all intact in code.
- **Performance**: deferred scripts + preload reuse; once-per-session search
  index; lazy case/section rendering with `case-load-more-btn` (verified no
  corpus doc mixes `cases`+`sections`, so the shared button id can never
  collide); debounced search & lineage resize.
- **Data integrity**: duplicate-id checks clean (glossary/masters/gong'an);
  queue counts match docs (traceability 33 / profile 34); rights manifest 13
  sources; matrix 4 rows / 21 registers incl. exactly 2 verified (Blyth per
  Hokuseido 1966; Senzaki & Reps 1934 PD); corpus register census taken
  (21 keys) — matches README/HANDOFF claims.
- **Deploy**: `docs/` mirror byte-identical after rebuild; `.nojekyll`,
  `robots.txt`, `sitemap.xml` mirrored; Pages flow unchanged (native branch
  publishing; CI does not deploy).

## 4. UX/design observations (non-blocking, P4)

1. **Matrix remains thin next to the corpus** (4 exemplar rows). The app frames
   it honestly as exemplar-scale; natural growth is one matrix row per recently
   collated text, fed from verified registers the corpus already carries
   (e.g. a Biyanlu Case-1 row reusing its ✅ verified registers).
2. **Search result jump targets beyond cases**: `openDoc` loses the unit context
   (sections/stanzas/chapters have no anchors). A unit-anchor scheme for the
   Linji text would make search jumps precise for the new 67-section pilot.
3. **Known open item CF-2** (`switchViewRaw` scroll-restore on back/forward)
   confirmed real: every `switchViewRaw` hard-scrolls to top; hash history
   works, scroll memory doesn't. Small state map keyed by hash would fix it.
4. Bundle ~1.65 MB is still fine for a 107k-CJK-char corpus, but the day
   Congronglu lands at 100/100 (+~90K chars) the polite thing is per-text lazy
   `fetch('data/corpus/<key>.json')` — the mirror already ships those files;
   no rush, just don't let it surprise (RESEARCH plan phase-4 mobile budget
   task already names this).

## 5. Ops notes

- GitHub auth healthy throughout (no recurrence of session 019fe731's outage).
- Workflow-permission probe (M8): push of even a single-line workflow change is
  rejected server-side; branch left clean (probe commit reverted, tree
  identical to `main` tip before this session's own changes).
- Live preview server (`python3 -m http.server 8080`) exercised root app:
  HTML/JS/CSS/bundle all served 200; smoke suite covers rendering semantics.

## 6. Gate evidence (final tree)

```
python3 -m py_compile scripts/*.py            ✅
python3 scripts/validate_data.py              ✅ corpus=36 | slots=1023 | verified=138 | matrix=21 | locators=150/150
python3 scripts/build_data_bundle.py          ✅ 1,685,556 B bundle; root↔docs synced
node scripts/smoke_test.mjs                   ✅ 36 texts, 0 crashes
node --check scripts/browser_test.mjs         ✅ syntax
diff -rq data docs/data                       ✅ silent
doc-gate negative tests (M7 rules)            ✅ drift detected & named
```

## 7. Open items handed forward (owner / editorial / next session)

- **Owner**: require the Quality check in `main` branch protection (A1, still
  unactioned); CI gate path-list extension (M8) — either apply the one-liner as
  owner or grant the sessions token `workflows` scope.
- **Editorial**: 5 pending verified references; 33 document-level locator
  migrations (`traceability_queue.json`); human rights/sign-off per rights
  manifest; Biyanlu post-verse 頌評唱 rendering + human collation sign-off.
- **Next session candidates**: Linji completion beyond the pilot; Congronglu
  campaign under the §3 contract; CF-2 scroll-restore; search unit-anchors for
  section-shaped texts (§4.2 above); a Biyanlu Case-1 matrix row from existing
  verified registers (§4.1).
