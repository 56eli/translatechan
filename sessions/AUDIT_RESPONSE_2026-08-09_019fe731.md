# 🔍 TranslateChan — Full Independent Audit (2026-08-09, session `019fe731`)

> **One-sentence verdict:** The project remains in genuinely strong shape — every quality gate is green, the validator/smoke/doc-truthfulness toolchain is unusually mature for a zero-backend static corpus app, and I confirmed **no P0/P1/P2 defects**; everything below is P3/P4 polish, a11y depth, search UX, and small documentation-housekeeping inconsistencies.

This is a temporary response file for review. Durable session history lives in
`sessions/` and the slim current-state summary in `AUDIT.md`.

---

## 0. How I audited (all locally re-verified)

- Full gate chain, all pass:
  - `python3 -m py_compile scripts/*.py` ✅
  - `python3 scripts/validate_data.py` → `corpus=36 | slots=874 | verified=138 | matrix=21 | locators=64/64` ✅
  - `node scripts/smoke_test.mjs` → 36 texts exercised, 0 crashes ✅
  - `diff -rq data docs/data` ✅; root ↔ docs mirrors byte-identical for `index.html`, `app.js`, `app.css`, `theme-init.js`, `robots.txt`, `sitemap.xml` ✅
- Read all 2,346 lines of `app.js`, all 1,529 lines of `app.css`, `index.html`, `theme-init.js`, `build_data_bundle.py`, the doc-truthfulness section of `validate_data.py`, the CI workflow, the smoke test, and spot-checked the data layer (wumenguan/biyanlu shapes, matrix labels, pinyin characteristics, metrics).
- Cross-checked every claim against prior audit artifacts (`AUDIT.md`, `sessions/AUDIT_RESPONSE_2026-08-09_019fe64a.md`, `sessions/STRUCTURAL_ASSESSMENT_2026-08-09_019fe64a.md`, session reports) so this report only carries **genuinely new findings** plus carried-forward standing items.

Prior audits already shipped: heading outline, data-derived graph colors, FOUC guard, bare-string→record migration (736 slots), aria-hidden emoji, data-derived hero counts, OG/Twitter/robots/sitemap/canonical, deferred scripts, segmenter rename, schema strictness wave 1–2. Verified all present and guarded.

---

## 1. New findings (P3 = low-risk polish, P4 = nice-to-have)

### Front-end / accessibility

**N1 — JS smooth-scrolling ignores `prefers-reduced-motion` (P3, a11y)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
All 7 programmatic scrolls (case-strip jump, scroll-to-top ×2, view switch, dossier open ×2, case deep-link) now route through a centralized `motionBehavior()` helper that returns `'auto'` for reduced-motion users; CSS still covers declarative animation. Smoke-guarded (no `behavior: 'smooth'` literal may regress).
`app.css:1513` neutralizes CSS animation/scroll-behavior for reduced-motion users, but `app.js` performs 7 programmatic `behavior: 'smooth'` scrolls (`window.scrollTo` ×4, `scrollIntoView` ×3 — lines 441–446, 639, 1918, 1970, 2317) without consulting `matchMedia('(prefers-reduced-motion: reduce)')`. CSS `scroll-behavior: auto !important` does **not** override behavior passed explicitly to the scroll APIs. Vestibular-sensitive users still get animated scrolling for case jumps, view switches, dossier opens, and "load more". Fix: one `prefersReducedMotion()` helper returning `'auto'` vs `'smooth'` (~10 lines), centralized like `escHtml`.

**N2 — Dossier panel is not a dialog (P3, a11y)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
`#master-dossier-panel` now carries `role="dialog" aria-labelledby="dossier-name-zh" tabindex="-1"`; shared `openDossierPanel()` moves focus into the panel on open (both master and edge views) and records the invoking control; `closeDossierPanel()` is reached from the ✕ button and Escape (with an open tooltip absorbing the first press) and restores focus to the invoker. Smoke-guarded.
`#master-dossier-panel` opens on node/card/edge activation but has no `role="dialog"`/`aria-modal`/`aria-labelledby`, focus is not moved into it, Escape does not close it (only citation/term popovers handle Escape), and background content is not inert. Keyboard/SR users get no signal that content appeared above their position. Fix: set focus to the panel (or close button) on open, `Escape` → close + restore focus to the invoker, add role/aria attributes. All static markup already exists — pure JS/attribute change, no redesign.

**N3 — Glossary popover not shown on keyboard focus (P3, a11y/discoverability)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
Tab-focusing a `.term-highlight` now reveals the shared definition popover (gated on `:focus-visible` so mouse click-to-toggle semantics are unchanged); both the glossary and citation popovers now carry `role="tooltip"`. Enter/Space toggle still works. Smoke-guarded.
`.term-highlight` spans are `tabindex="0"` and Enter/Space toggles the popover, but plain Tab-focus shows nothing (only a dotted-outline style change). The shared document-level `focusin` handler covers `.citation-trigger` only; terms get `mouseover`/`click`/`keydown` on the reader root. Keyboard users cannot discover that a definition exists without guessing a key. Fix: handle `focusin`/`focusout` for `.term-highlight` the same way the citation popover does. Related P4: neither popover carries `role="tooltip"` or an `aria-describedby` link from the trigger.

**N4 — English/translation search hits never surface the matched text (P3, UX)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
Result cards now render a `.search-match-note` disclosing the field that satisfied the query: the first matching translation register by name with a windowed quote (“⚖️ Matched in translations — **Red Pine (Bill Porter)**: …”), or the pinyin line, or the title/speaker label. Units carry per-register English pairs alongside the search blob; empty-Chinese title units no longer render an empty zh block. Behaviorally smoke-guarded (`Buddha-nature` → "Matched in translations").
`handleGlobalSearch()` matches against `u.blob` (zh + pinyin + **all translation text**), but the result card only renders `makeSnippet(u.zh, q)` — a windowed snippet of the *Classical Chinese only*. Query `emptiness` or `fox` matches translations and titles, yet the card shows 80 chars of unmarked Chinese (`raw.search(re) === -1` → `center = 0`). The user cannot see *what* matched. Fix: when zh doesn't contain the query, render the matched field instead (translation/pinyin/title) with a small "matched in translations" label, or append a translation snippet under the Chinese.

**N5 — Toneless/partial pinyin search fails (P3, UX)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
`normalizeForSearch()` now applies NFD + combining-mark strip (on top of the CJK variant map, which is unaffected), so `foxing`, `zhaozhou`, `wu`… match `fóxìng`/`Zhàozhōu`/`wú`. Behaviorally smoke-guarded with `foxing` — a word that exists in the corpus **only** as tone-marked pinyin (6× `fóxìng`, 0× plain ASCII), so the match can only come through folding.
Corpus pinyin is tone-marked (14,660 combining-mark characters across `data/corpus/*.json`, e.g. `Zhàozhōu … fóxìng`), and `normalizeForSearch()` lowercases + maps 5 glyph variants but never strips diacritics. A user typing `wu`, `foxing`, or `zhaozhou` (the realistic romanization query) gets zero pinyin hits. Fix: NFD-normalize and strip `\p{M}` in addition to the variant map (one line with Unicode property escapes; Node 22 + all modern browsers support it).

**N6 — Global search input has no accessible name (P4, a11y)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
The input is now `type="search"` with `aria-label="Search all corpus texts — Chinese, pinyin, or English"` inside a `role="search"` landmark wrapper. Smoke-guarded.
`<input id="global-search" type="text" placeholder="Search Chinese / English...">` relies on the placeholder alone (the three `<select>`s all have `aria-label`; this input doesn't). Add `aria-label="Search all corpus texts"` and consider `type="search"` for semantics/mobile keyboards. One-attribute fix.

**N7 — Lineage graph never re-lays out on viewport change (P4, UX)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
A debounced (220 ms) `resize` listener re-renders the lineage view while it is visible, recomputing the layout from the live viewport width; pan/zoom state survives by design (`svg._panzoom` re-applies on redraw). Smoke-guarded.
`renderVisualLineageGraph()` computes `width` once per render from `svg.clientWidth`; there is no `resize` listener. Rotate a phone or resize a desktop window and the viewBox keeps the stale width until the user changes a filter/sort. Fix: debounced `resize` listener that re-renders while the lineage view is visible (preserve pan/zoom state, which already survives re-renders by design).

**N8 — Popovers can't be scrolled and guess their height (P4, UX)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
Both popovers are now capped at `min(60vh, …)` with internal scrolling and are interactive surfaces (hovering into them keeps them open; click/tap-outside and Escape dismiss). A shared `positionFloatingPopover()` measures the real rendered height for the flip decision, replacing the ~160/190 px guesses. Smoke-guarded (CSS invariants + shared positioner).
`.citation-popover`/`.term-popover` are `pointer-events: none` with no `max-height`/`overflow`, and the flip logic hardcodes ~160–190 px content guesses. A long citation near the viewport bottom on mobile can overflow with no way to read it. Fix: `max-height: 60vh; overflow-y: auto` (keep `pointer-events: none` if hover-to-dismiss is preferred, but measure real height for the flip).

### Documentation / repo hygiene

**N9 — Session `019fe64a` is missing from AUDIT.md §4 index; its report lives at root (P3, convention consistency)** 🆕 — ✅ FIXED 2026-08-09 (session `019fe731`)
Both files were archived with session-dated names (`sessions/AUDIT_RESPONSE_2026-08-09_019fe64a.md`, `sessions/STRUCTURAL_ASSESSMENT_2026-08-09_019fe64a.md`), links in AUDIT.md §2/HANDOFF.md pointed at the new locations, and §4 gained index rows for sessions `019fe64a` and `019fe731` (this report marked **live — archive at close**). Root is convention-clean; this live report is the only remaining temp file, by design.

**N10 — Small doc drift the gates can't see (P4)** 🆕
- ~~`theme-init.js:4` comment still says "~799 KB data bundle"~~ ✅ FIXED 2026-08-09 (session `019fe731`): comment now reads ~873 KB.
- ~~README "Repository Structure" tree omits `theme-init.js`, `robots.txt`, `sitemap.xml`, `.nojekyll`, `package.json/package-lock.json`, `scripts/ingest_cbeta.py` (deprecated wrapper), `scripts/migrate_translations.py`, `gongan/theme_vocabulary.json`, and `response_summary.md`~~ ✅ FIXED 2026-08-09 (session `019fe731`): tree refreshed to cover every gated file and script.
- ~~`.translation-source` renders at **0.62 rem (~10 px)**~~ ✅ FIXED 2026-08-09 (session `019fe731`): raised to 0.72 rem; smoke-guarded legibility floor.

---

## 2. Carried forward (already documented, still open — verified unchanged)

| ID | Item | Owner/Blocker |
|---|---|---|
| CF-1 | **CI artifact gate misses `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`** (workflow line 48 path list). Files can drift root→docs without CI failing. **Attempted 2026-08-09 (session `019fe731`): the one-line fix was committed and pushed, but GitHub rejected it — this session's token also lacks the `workflows` permission; the workflow file was reverted and local gates (HANDOFF checklist + smoke existence checks) continue to cover these mirrors. Owner must apply the path addition (or grant the sessions token `workflows` scope).** | owner / token permission (confirmed blocked) |
| CF-2 | `switchViewRaw` scroll-restore on back/forward (AUDIT.md §2 editorial candidate) | editorial |
| CF-3 | A1 ops: require the Quality check in `main` branch protection (~2 min, owner-only) | owner |
| CF-4 | A2 editorial: 5 pending verified-source references; 33 doc-level locator migrations; rights sign-off | editorial |
| CF-5 | C1 module split (opportunistic, zero-build preserved); C2 schema strictness wave 3 (corpus shape objects); C4 lint in CI (also blocked on workflows permission) | structural |
| CF-6 | Content Phase 2: Biyanlu 11–100, Linji completion pilots | content |

## 3. Recommended order (all batches independently shippable, gates all green after each)

1. ~~**Housekeeping batch**~~ ✅ done · 2. ~~**A11y depth batch**~~ ✅ done · 3. ~~**Search UX batch**~~ ✅ done · 4. ~~**P4 sweep**~~ ✅ done (all sessions same day).

**Addendum 2 — Provenance integrity repair discovered during collation (2026-08-09):** comparing the four Biyanlu seed cases against CBETA T48n2003 exposed pre-existing seed defects worse than excerpt-scale: **case 14 was entirely mis-seeded** (it carried the Wumenguan-case-14 Nanquan-cat story and a non-canonical verse — Biyanlu 14 is actually 雲門『對一說』), **case 12's verse was fabricated** beyond its first line, and **cases 1–3 carried truncated Xuedou verses** (all presented under the project's "authentic canonical language" claim with only a `case_level_anchor` locator). **Repaired this session:** case 14 fully replaced with the canonical text, case 12's verse replaced with the canonical 頌, cases 1–3 verses completed to canon, every locator record now states the replacement and its date explicitly, and the corpus [`coverage_note`](data/corpus/biyanlu_cases.json) discloses it. Cases 21/43 (still `case_level_anchor`) are queued for the same re-verification. **Lesson worth encoding:** any seed whose locator is still `case_level_anchor` is unverified by definition — treat it as suspect until collated.

**Addendum 5 — juan 1–3 fully ingested (2026-08-09):** Biyanlu cases **22–30** completed the third juan: 雪峯鼈鼻蛇 (incl. Xuedou's printed closing shout, noted), 保福妙峯頂, 劉鐵磨, 蓮花峯庵主, 百丈獨坐, 雲門體露金風, 南泉不說法, 大隋隨他去, 趙州大蘿蔔. Cases 26/28/30 canonically carry **no 垂示** (recorded in their locators, like 6/14/18). Locator spans for 22–30 were corrected to exact TEI-derived page ranges after an initial hand-estimate was caught pre-push. Coverage **31/100** (1–30, 43), slots 880, locators **81/81**, CJK 39,190/42,674. Remaining: 31–42, 44–100.

**Addendum 4 — Sequential campaign continued autonomously (2026-08-09):** Biyanlu cases **15–20** ingested from the local cbeta-org/xml-p5 TEI (垂示/本則/評唱/頌 each: 雲門倒一說, 鏡清啐啄, 香林西來意, 肅宗無縫塔 — canonically without 垂示, 俱胝一指, 龍牙西來意 — with its two 頌 joined and noted); case-level locators carry exact page spans per layer; case 18 documents that T has no pointer for it. Coverage now **22/100** (1–21, 43), slots 871, locators **72/72**, CJK 32,087/35,483. Juan 2 (cases 11–20) and the case-21 region are complete; next natural batches: 22–30 (juan 3) then 31–40.

**Addendum 3 — Re-verification of the last two seeds closed the file (2026-08-09):** with the full cbeta-org/xml-p5 TEI for T48n2003 pulled via `gh` (usable offline via `scripts/…` pattern `gh api repos/…/contents/… -H Accept: application/vnd.github.raw`), **case 21 was ALSO mis-seeded** (it carried Wumenguan-21 雲門乾屎橛 material + a fabricated verse — the true Biyanlu 21 is 智門蓮花) and was fully replaced with canonical text; **case 43 was authentic** (dialogue verbatim) and gained its missing 垂示 + pre-verse 評唱, with the verse corrected to the printed 韓獹 (+T's one-character closing 獹。). The gong'an entry `biyan_21` carried the same collection-confusion and now indexes the canonical 智門蓮花. **All 16 ingested Biyanlu cases (1–14, 21, 43) are now canon-complete, and every Biyanlu locator is `collated_with_normalization`.** New case 13 (巴陵銀椀) was ingested in the same pass — coverage stands at **16/100**, slots 865, CJK 25,926/29,258, all gates green.

**Addendum — Content Phase 2 pilot (2026-08-09, session `019fe731`):** Biyanlu case **11** (黃檗酒糟 / "Huangbo's Wine-Lees Guzzlers") ingested after the cases 4–10 pattern: pointer + main case + full pre-verse 評唱 + 頌, collated from CBETA Online T48n2003 juan 2 (垂示 p.0151b08–b11, 本則 p.0151b12–b17, 評唱 p.0151b18–p.0152a29, 頌 p.0152b01–b04; 著語 normalized out; post-verse 評唱 p.0152b05–c13 noted as not yet ingested in the locator record). Corpus now **15/100 cases** (locators **65/65**, slots **875**, CJK **21,336/24,641**); AI-only drafts honestly badged (`ai_draft`); every doc surface (README/HANDOFF/ROADMAP/AUDIT §1) and both smoke coverage assertions moved by the doc gate. Natural next step of the campaign: case 13 (following the sequence; case 12 already present as a seed) or upgrading seeds 12/14/21/43 to the complete shape, then the Linji pilot.

---

## 4. Explicitly checked and cleared (no action needed)

- Escaping/XSS: every `innerHTML` interpolation routes through `escHtml()`; no inline `on*` handlers; poison-fixture smoke test guards it.
- Data contract: all 36 corpus JSON + support files parse; matrix labels (9 unique, 8 non-AI) match validator tallies; wumenguan/biyanlu shapes match renderer field expectations.
- Deterministic build, docs mirror, metrics/doc-truthfulness rules (27 active checks incl. AUDIT.md §1).
- Hero counts are data-derived at runtime (static HTML fallback is gated against the live count).
- CSP (`script-src 'self'`), storage hardening, smoke coverage of all 36 texts/modes/search.
- Git state clean; single-commit shallow history is the environment's checkout, not a project issue.

---

## 5. Session status & GitHub outage note

- ✅ **Corpus campaign COMPLETE: the Biyanlu is the second fully-collated text (100/100 cases, working autonomously).** All 100 cases carry canonical 垂示 (where canon provides one), 本則, pre-verse 評唱, and 頌, collated from cbeta-org/xml-p5 + CBETA Online with exact case-level locator spans; 22 T-cases have no 垂示 (recorded per-case); post-verse commentary render and human sign-off are tracked as pending in `coverage_note` and every locator. Metrics: 949 slots, locators 150/150, CJK 88,263/92,450.
- **Integrity repairs en route (the session's most consequential finding):** pre-existing seed cases 12/14/21 contained fabricated or collection-confused Chinese presented under the project's "authentic canonical language" framing — all replaced with CBETA-collated text and every locator record discloses the replacement explicitly. Root cause for future editors: **any seed whose locator is `case_level_anchor` is unverified by definition.**
- ⚠️ **GitHub access lapsed at ~17:20 UTC** (`gh auth status`: "token in GH_TOKEN is no longer valid"; pushes rejected). All work is **committed locally** on `arena/019fe731-translatechan` (13 unpushed commits) and the sandbox auto-saves files. **Reconnect GitHub in Arena; re-push to sync.**
- Gates (validator, build, smoke, mirrors) pass on the local tree for every batch, including the final 100/100 state.

---

## 6. Session close-out (2026-08-09, second turn)

- ✅ **GitHub auth recovered**; however the sandbox had restarted from a filesystem snapshot taken before the local commits were written to `.git`, so the 13 local commit objects were lost while every file change survived in the working tree (net-zero loss: the commits had never reached origin). The full session delta was re-committed as a consolidated set and pushed to `arena/019fe731-translatechan`.
- ✅ **Validator truthfulness fix at close:** `complete_documents` was hardcoded to `key == "wumenguan" and len(cases) == 48`; it now derives completeness generically from manifest `unit_targets` (Wumenguan 48/48 + Biyanlu 100/100 both counted) — self-inflicted drift the doc gate caught immediately (`**35 excerpt seeds**` → `**34**` in AUDIT.md §1/README honest-status).
- ✅ **Docs refresh for handoff:** HANDOFF "Current Session Handoff" rewritten for this session (PR #9 moved to Historical Deltas, stale `019fe5d5` branch refs removed, duplicate owner-action paragraphs merged); ROADMAP Phase-2 Biyanlu item checked at 100/100 with pending commentary/sign-off disclosed; Lexicon scope-note copy de-staled ("14 ingested cases"); bundle-size fact updated (~1.36 MB).
- ✅ This report was archived from repo root to `sessions/AUDIT_RESPONSE_2026-08-09_019fe731.md` at session close per the §5 convention; gates re-run green on the final tree; PR to `main` opened and merged per the handoff instruction.
- ⏳ **Owner/editorial items that remain:** CF-1 CI artifact-gate path list (token lacks `workflows` scope); branch protection requiring the Quality check (A1); human collation sign-off + post-verse 頌評唱 ingestion; 5 pending verified references; 33 document-level locator migrations; Linji yulu completion pilot; CF-2 `switchViewRaw` scroll-restore.
