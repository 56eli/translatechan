# Stub Reader Port — 2026-11-12

**Branch:** `arena/ab741fb2-translatechan`
**Companion to:** `sessions/LAYOUT_DEMOLITION_2026-11-12.md`
**Owner request:** after the demolition, port required functionality into the
owner-uploaded `index.html` stub without recreating the retired walnut shell, and
land it in one PR merge.

## What changed

Only the owner stub's inline reader (`index.html`) and current docs changed. No
corpus data, manifest status, locator, translation, rights record, or
`data/project_metrics.json` was touched. The retired `app.js`/`app.css`/`app_data.js`
were NOT restored; the port lives entirely inside the stub's own inline script.

The previous stub reader rendered `w.cases` only, so 6 works (4 `sections`, 2
`stanzas`) showed zero units, Wumenguan's `preface`/`epilogue` were dropped, and
case `pointer_zh` / `verse_commentary_zh` were silently omitted.

The ported reader:

- collects units shape-driven from `preface`, `cases`, `sections`, `stanzas`,
  `epilogue` (the unit arrays present in the current 17-document corpus);
- renders cases (title, pointer, dialogue, commentary, verse, verse commentary),
  sections (with their `kind` marker), stanzas, and front/back matter;
- shows pinyin where present and the per-unit canonical locator;
- surfaces document `coverage_note` / `cbeta_note` / `recension_note` and
  passage-level `recension_note` / `editorial_note` / `cbeta_note`, one line each,
  never concatenated;
- shows the disclosed `translations` dict in a native `<details>` fold with honest
  status badges (`verified_quotation`, `reconstruction_unverified`, `ai_draft`;
  unknown codes shown verbatim, never upgraded);
- labels unmarked project English (`pointer_en`, `verse_en`) explicitly as
  "Project English · unverified" rather than implying verification;
- carries a reader disclosure line: English renderings are disclosed AI/register
  reconstructions unless marked verified quotation; edition verification is not
  rights approval;
- keeps the stub's pagination, source-review gate, nav, Lineage, Terms, Gallery
  placeholder, and localStorage-only Account UI unchanged.

## Render evidence (local, Node DOM shim — not a browser, not a CI gate)

The inline script was extracted and run under Node v22 with a minimal DOM/fetch/
localStorage shim, signed in so uncollated works are visible. Every manifest work
was rendered and asserted to produce >0 units:

```text
OK   zhengdao_ge            units= 6  translations=y notes=y
OK   niutou_juezhu          units= 3  translations=y notes=y
OK   hanshan_poems          units= 4  translations=y notes=y
OK   congronglu             units=25  notes=y
OK   chuandenglu_full       units=25  notes=y
OK   caoshan_benji          units=25  notes=y
OK   huangbo_fayao_full     units=19  notes=y
OK   mazu_guanglu_full      units=25  notes=y
OK   yunmen_guanglu_full    units=25  notes=y
OK   dongshan_yulu_full     units=25  notes=y
OK   zhaozhou_yulu_full     units=25  notes=y
OK   dahui_yulu_full        units=25  notes=y
OK   wumenguan              units=25  notes=y   (55 units total incl. preface/epilogue)
OK   linji_yulu             units=25  notes=y   (107 sections)
OK   guiyang_yulu           units= 3  translations=y notes=y
OK   fayan_yulu             units= 8  translations=y notes=y
OK   biyanlu_cases          units=25  translations=y notes=y

PASS zhengdao_ge shows 6 stanzas
PASS zhengdao_ge shows a verified-quotation badge
PASS zhengdao_ge shows reconstruction disclosure
PASS reader carries translation disclosure line
PASS linji sections render (25 on page 1)
PASS linji shows section kind label
PASS wumenguan includes preface+epilogue (55 units total)
RENDER CHECK: ALL DOCUMENTS RENDER + ASSERTIONS PASS
```

This is functional render evidence under a DOM shim, not real-browser or
accessibility evidence; a required real-browser CI job remains an owner decision.
The Node shim was a local check only and is not committed as a gate — the permanent
quality gates stay Python-only.

## Gate evidence

```text
python3 -m py_compile scripts/*.py bin/orchestrator-check  → OK
python3 scripts/validate_data.py                           → PASS
python3 scripts/build_pages.py                             → OK (docs/index.html mirrors stub)
python3 scripts/test_source_preservation.py                → PASS, 0 unauthorized
python3 scripts/test_source_review_rules.py                → PASS
python3 scripts/test_pages_contract.py                     → PASS
python3 scripts/test_lineage_batch1.py                     → PASS
python3 bin/orchestrator-check                             → OK
diff -rq data docs/data                                    → clean
git diff --check                                           → clean
```

## Remaining stub gaps (unchanged by this port)

- Gallery is a placeholder; Account is a localStorage UI gate, not authentication.
- Comparative-matrix and gongan-index research rooms are not yet ported.
- No real-browser CI evidence; local DOM-shim render evidence only.
- Rights review and OUT-OF-CBETA sourcing remain human work.
