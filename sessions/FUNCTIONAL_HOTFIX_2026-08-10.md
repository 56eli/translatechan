# P1 Public-Behavior Hotfix — 2026-08-10

> **Session:** `arena/019febb1-translatechan`
> **Direction:** user selected “Fix P1 public behavior” after Congronglu containment.

## Changes

### 1. Lineage dossier visibility

`#master-dossier-panel` still carried HTML `hidden` while open code only set inline `display:block`; `.dossier-panel[hidden] { display:none !important; }` kept it invisible.

- Open now sets `panel.hidden = false` and removes the `hidden` attribute before focus/scroll.
- Close restores both semantic `hidden` and visual display state.
- Smoke behavior checks open → visible state and close → hidden state.
- Playwright now clicks a real SVG lineage node, requires computed visibility/focus, then closes and requires hidden state.

### 2. Platform Sutra direct chapter fields

Chapters 3, 6, 7, 8, 9, and 10 store direct chapter-level `zh`, `pinyin`, `speaker`, and `translations`; the renderer only supported nested `verses` or `dialogue`, producing six empty cards.

- `renderChapterItem()` now supports all three shapes in one chapter.
- Translation disclosures receive the chapter locator context.
- Every chapter card carries `data-chapter-num` and a Chapter source disclosure.
- Smoke and Playwright verify distinctive source excerpts in all six formerly empty chapters.

This fixes rendering only; Platform remains an honest excerpt seed, not a complete text.

### 3. Wumenguan epilogue order

The epilogue was appended immediately after the preface and before Case 1.

- End matter is now built early but appended after all rendered document units.
- Initial 12-case and full 48-case/print order are regression-tested.

### 4. Complete Print/PDF

Print CSS could expand collapsed nodes but could not print lazy units absent from the DOM. Wumenguan/Biyanlu initially printed 12 cases and Linji 12 sections.

- `printFullReader()` clears search-result state, sets the current case/section limit to the document total, rerenders, restores scroll, and only then invokes `window.print()`.
- The complete rendering remains available after print so the user can continue reading.
- Smoke captures the print DOM and requires 48 Wumenguan cases followed by the epilogue.
- Playwright starts from a fresh 12-case DOM, intercepts print, and requires a 48-case snapshot with end matter last.

### 5. Collection-specific commentary labels

All case collections used `無門評唱 / Commentary`, incorrectly attributing Biyanlu commentary to Wumen.

- Wumenguan: `無門評唱 / Wumen Commentary`, `無門頌 / Wumen Verse`.
- Biyanlu: `圜悟評唱 / Yuanwu Commentary`, `雪竇頌 / Xuedou Verse`.
- Other future case collections receive generic labels unless explicitly added.
- Smoke and Playwright enforce the correct Biyanlu labels and absence of the Wumen label.

## Regression coverage

```text
Dependency-free smoke:
- semantic dossier hidden-state toggle
- six direct Platform chapter excerpts + ten source disclosures
- Wumenguan/Biyanlu collection labels
- epilogue after lazy cases
- print snapshot: 48 cases + epilogue last

Playwright (runs where Chromium is available):
- visible/focused Lineage dossier and close behavior
- six direct Platform chapters
- Biyanlu labels
- epilogue DOM order
- print expansion from 12 → 48 cases
```

## Validation

```text
python3 -m py_compile scripts/*.py          PASS
python3 scripts/validate_data.py            PASS with 6 known lineage-link warnings
node --check app.js                         PASS
node --check scripts/smoke_test.mjs         PASS
node --check scripts/browser_test.mjs       PASS
python3 scripts/build_data_bundle.py        PASS; 35 documents; 1,594,154 bytes
diff -rq data docs/data                     PASS
node scripts/smoke_test.mjs                 PASS; 35 fixtures, 0 crashes
npm run test:browser                        SKIP in sandbox; Chromium unavailable
```

## Remaining release blockers

- all 14 quotation rights records still need their documented human rights/jurisdiction decisions;
- non-case field-level source coverage remains incomplete;
- responsive sticky geometry, mobile cross-view controls, contrast, and ARIA state relationships remain;
- no visible fatal-load state and malformed-storage hardening remain;
- CI/browser/action-major/branch-protection tasks remain.

## One-sentence summary

The five broken public reading paths now behave correctly and are regression-guarded, while the project remains release-blocked on rights, source-depth, responsive/accessibility, and operations work.
