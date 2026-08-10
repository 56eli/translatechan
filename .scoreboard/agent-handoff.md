# Agent Handoff

> **Last updated:** 2026-08-10, session `arena/019febb1-translatechan`
> **Current fixed branch:** `arena/019febb1-translatechan` — do not switch or push elsewhere.
> **Baseline:** `3ef77320d28cc2a627723d8ad709f9a13ba83c29` (`main`, merged PR #14).

## Current state

The session completed a full audit and the user-selected P0 containment.

- Full audit: [`sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md`](../sessions/AUDIT_RESPONSE_2026-08-10_019febb1.md)
- Containment evidence: [`sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md`](../sessions/CONTAINMENT_2026-08-10_CONGRONGLU.md)
- Post-containment weighted score: **6.5/10**.
- `repo_ready`: **fail** because P1 rights/functional blockers remain.
- User scores: all `null`; never infer or change them.

## Containment completed

1. Removed the entire Congronglu seed from active corpus, manifest, locator registry, bundle, navigation, metrics, and deployment mirror.
2. Authoritative `cbeta-org/xml-p5/T/T48/T48n2004.xml` headings disproved the five records previously labeled collated:
   - 33 三聖金鱗, not 南泉見人作貓兒;
   - 34 風穴一塵, not 盤山心印;
   - 35 洛浦伏膺, not 俱胝豎指;
   - 37 溈山業識, not 洞山麻三斤;
   - 38 臨濟真人, not 百丈野狐.
3. Deleted four obsolete mutable ingestion snapshots; Git history preserves them.
4. Added manifest `completion_status` and validator enforcement:
   - Wumenguan, Xinxin Ming: `complete_selected_witness`;
   - Biyanlu, Linji: `partial_selected_witness`;
   - 31 others: `excerpt_seed`.
5. Added anti-placeholder validation for repeated case-specific source fields.
6. Added smoke assertions that Congronglu is absent and N/N representation does not imply completion.
7. Corrected active counts, completion claims, OG copy, and ✅ semantics. A checkmark means edition-verified wording; rights status remains separate.

## Current measured state

```text
corpus=35 | slots=1252 | verified=177 | matrix=21 | locators=148/148
content CJK=103,723 | all-string CJK=109,185
complete selected witnesses=2 | partial selected witnesses=2 | excerpt seeds=31
```

Generated bundle size must be read from the latest build output after the final sync.

## Active blockers, in order

1. **P1 public behavior:** Lineage dossier retains `hidden`; six direct-field Platform chapters render empty; print exports only lazy-loaded units; Wumenguan epilogue renders before cases; Biyanlu commentary is mislabeled as Wumen commentary.
2. **P1 rights:** all 14 rights sources remain review/jurisdiction-pending. Public wording is corrected, but human decisions remain.
3. **P2 source modeling:** document completion status is now honest, but field-level coverage and human review remain necessary for Biyanlu/Linji/Platform.
4. **P2 tests:** browser title/count expectations are fixed, but Chromium execution remains skippable and the remaining visible defects lack real-browser regressions.
5. **P2 responsive/accessibility:** sticky/header offsets, 1100/960 breakpoint mismatch, cross-view mobile Reader bar, contrast, and ARIA state relationships.
6. **Operations:** four generated deploy paths are omitted from CI diff; action majors emit Node 20 runtime deprecation; branch protection could not be read (403).

## Required next sequence

1. Fix dossier visibility, direct chapter rendering, epilogue order, complete Print/PDF, and collection-specific labels.
2. Add real-browser regressions for each.
3. Complete rights decisions and field-level source review.
4. Finish responsive/accessibility pass.
5. Apply owner-approved workflow/action/branch-protection edits.
6. Reintroduce Congronglu only under the containment report's source-pinned TEI gate.

## Stable contracts

- Public brand is Fake Chan Factory; internal `translatechan_*`, `window.TranslateChan`, and `TRANSLATECHAN_DATA` names remain.
- Public views: Reader, Matrix, Lineage, Gong’an, Lexicon only.
- Deployment: native GitHub Pages from `main /docs`, HTTPS.
- No source-looking Chinese may be generated or copied from quarantined history.
- Unit counts measure representation; only explicit editorial status can establish selected-witness completion.
- Edition verification and rights approval are separate.
- Before every push: compile, validate, build, smoke, and compare `data` with `docs/data`.
- Workflow changes require explicit user approval; exact edits are in `.scoreboard/manual-workflow-edits.md`.
