# 🤝 Fake Chan Factory — Project Handoff

> **Repository:** `56eli/translatechan`
> **Public site:** `https://56eli.github.io/translatechan/`
> **Deployment:** native GitHub Pages from `main /docs`, HTTPS
> **Current audit/status:** [`AUDIT.md`](./AUDIT.md) · W1 evidence (authoritative, dated 2026-09-20): [`sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI.md`](./sessions/COLLATION_W1_2026-09-20_CAOSHAN_BENJI.md), which inherits the [2026-09-20 full-Jingde-Chuandeng-Lu overlay](./sessions/COLLATION_W1_2026-09-20_CHUANDENGLU_FULL.md) · W1 evidence (historical, append-only): [`sessions/COLLATION_W1_2026-09-09.md`](./sessions/COLLATION_W1_2026-09-09.md)
> **Current gate:** (see [GATE.md](./GATE.md) for full spec: unprivileged disposable clone, stdlib-only, read-only, Python 3.11 minimum, tested 3.11/3.12/3.13, sha256 every manifest file) `repo_ready = fail` at **7.2/10**

## 1. Start here

1. Read [`AGENTS.md`](./AGENTS.md).
2. Read [`.orchestrator/STATE.md`](./.orchestrator/STATE.md).
3. Read [`OPERATIONS.md`](./OPERATIONS.md).
4. Work only on the Arena-fixed session branch.
5. AI scoring is retired; no file carries a score to update.

Historical reports are evidence, not current instructions.

## 2. Product and architecture

Fake Chan Factory is a zero-backend static reader for Classical Chinese Chan literature. Its public views are intentionally limited to:

- Reader;
- Comparative Matrix;
- Lineage;
- Gong'an Index;
- Chan Lexicon.

Internal identifiers remain `translatechan_*`, `window.TranslateChan`, and `TRANSLATECHAN_DATA`.

```text
data/*.json
  → scripts/validate_data.py
  → data/project_metrics.json
  → scripts/build_data_bundle.py
  → root assets + docs/ mirror
  → GitHub Pages publishes main/docs
```

There are no runtime JavaScript packages. Playwright is an optional development dependency; Google Fonts remains a browser-time third-party request.

## 3. Current design direction

Owner feedback on 2026-08-11:

- prior Pages page was **too plain and generic**;
- it put **too much focus on Chinese characters**;
- preserve, rather than replace, the **walnut-hall direction**.

Current implementation (re-composed 2026-09-13, Pages revamp Phase 1 — see
`.orchestrator/PAGES_REVAMP_PROPOSAL_2026-09-13.md`):

- one walnut **gate**: a lintel (brand + controls), a hairline, a directory of
  the five rooms, and a beam that tells the joke once — structure, not texture;
- a consolidated token sheet: 35 declarations plus 8 dark-theme overrides
  (43 total, re-measured in Phase 2), down from 63. Eight theme primitives (paper, panel, line, ink + four
  accents) are the only values the dark theme overrides; every other tint is
  derived with `color-mix()`, and every `[data-theme="dark"]` override maps
  to a primitive one-for-one;
- one ~1.24 modular type scale (`--type-hook` … `--type-small`), shared by
  English and Chinese at their own line-heights;
- **Source Serif 4** (Google-served, already inside the shipped CSP) for the
  hook, headings and — since Phase 2 — translation prose; system sans for
  controls; `ui-monospace` for locators and counts. The CJK serif closes the
  display stack so mixed headings never fall back to a system default.
  Self-hosting under `/fonts/` is the documented alternative if a
  zero-third-party-request rule is ever wanted;
- English-first brand, room and document headings, with source Chinese
  present but subordinate everywhere except inside the Reader sheet, where it
  is the largest text on the page (Checkpoint-C C-3);
- the hook: “The old texts are real. _The translators are not._” on the beam,
  with the `PROUDLY FAKE ENGLISH` seal and the live counts as a quiet
  colophon beneath it;
- mobile controls regrouped from eight loose pills into two clusters (text ·
  move) with 44 px targets;
- redrawn social card that is the same gate — walnut beam, brass rule, serif
  hook, colophon, seal (Georgia stands in for Source Serif 4 because a
  crawler renders the SVG with system fonts only);
- progressive disclosure that removes repeated Robo, citation, coverage,
  Lineage, Lexicon, and search prose from the reading surface;
- no added runtime dependency and no added image payload — the only new
  third-party bytes are the webfont request above.

Phase 2 — Reader (2026-09-13, same revamp):

- the reading surface is a **minimal sheet**: one hairline between units, wide
  margins, fewer borders; source Chinese is sized from the user-adjustable
  `--zh-font-size` by a sheet-scoped ratio so it stays the largest text in the
  room (C-3) while A−/A+ govern every zh block;
- translation prose is set in the C-2 serif voice (`.translation-text`,
  `.prose-en`), so the page keeps its voice next to the Chinese;
- the five disclosure ledgers sit in one always-visible **drawer band**
  ("About this edition") — a calmer container, never a quieter one: every
  ledger stays visible and the separation note stays printed under the set;
  only the edition metadata (canon/author/era/genre) remains progressive,
  expanding inline instead of floating over the sheet;
- the case index is a **thin static register** — one line, two hairlines,
  numbers only (titles stay in the accessible name), never a sticky wall;
- the Reader templates carry **zero inline style attributes**: all 41 `style=`
  literals (Reader and shared popovers) became named classes and all 15
  `.style.display` writes became semantic `hidden` toggles;
- **render-lazy** (C-4): boot renders the Reader; the Matrix, Lineage, Gong'an
  and Lexicon build their DOM on first tab activation — one bundle, no
  pipeline change.

Phase 3 — secondary rooms + CSP tightening (2026-09-13, same revamp):

- the four secondary rooms are composed on the Reader's vocabulary instead of
  their own card kits: the Matrix is a **collation table** (`.matrix-collation`,
  one `.matrix-register-row` per translator, name/work/provenance in the margin
  rail), Lineage leads with a **transmission register** (`.lineage-band` per
  generation, `.lineage-master-row` with house · dated record · signature
  columns, the layered SVG chart kept as the room's second view), the Gong'an
  index is a **case catalogue** (`.catalogue-row` per case) whose theme filter
  is one row of text filters, and the Lexicon runs as a **dictionary list**
  (`.lexicon-entry`, category in the margin). The retired card rules are deleted
  from `app.css`, not shadowed: 24 selectors that no template used anymore
  (every `.matrix-card`/`.matrix-col`/`.term-card`/`.meta-chip`/
  `.source-review-*` block) and the whole Phase-D card-row vocabulary this slice
  replaces (`.master-directory-row`, `.lexicon-definition-row`,
  `.gongan-catalogue-row`, `.catalogue-tag-item`, `.matrix-registers-grid`).
  Measured against `main` in this branch's diff: 12.3 KB of rules out, 19.6 KB
  of room composition plus its print/480 px parity in. No byte total for a
  generated asset is quoted in prose on purpose
  (`scripts/build_data_bundle.py` prints the authoritative number for
  `app_data.js`); a selector-vs-template scan now finds no class in `app.css`
  that `app.js` and `index.html` never emit.
- `style="` attribute literals are **0** in `app.js` and 0 in `index.html`, and
  the smoke test now asserts that both in source *and* in the rendered HTML of
  every room, the dossier and the lineage chart. `style-src 'unsafe-inline'` is
  therefore gone from the CSP meta, which now reads
  `style-src 'self' https://fonts.googleapis.com`;
- what remains in `app.js` is four CSSOM custom-property writes —
  `--shell-height`, `--zh-font-size` (init + A±) and `--pop-shift`, which
  replaced the popover `left`/`top` pair — recorded as the runtime contracts in
  the `app.css` token sheet (§7) and pinned by name in the smoke test.
  `style-src` governs *parsed* style attributes and `style` elements, not
  CSSOM writes; the mechanisms it does govern (`setAttribute('style', …)`,
  `style.cssText`, an injected `<style>`) are asserted absent, which is why
  removing `'unsafe-inline'` is safe and why these four can stay: each is a
  measured number (shell height, user type size, viewport-clipped popover
  placement) that no class expresses. CSS anchor positioning is the documented
  alternative if a later phase wants placement purely in the sheet;
- breakpoints for the secondary rooms are documented as 1024 / 768 / 480 and
  the print sheet now covers the rooms (rails, filters and the chart are
  dropped; rows never split across a page).

Phase 4 — evidence and approval (2026-09-13, this PR):

- Pages revamp Phases 1-3 merged: #48 system+masthead (tokens 63→43, serif Source Serif 4, shell/hero/mobile bar, OG redraw), #49 Reader (sheet minimal, ledger drawer, case rail, 41 style=→0, lazy boot), #50 secondary rooms + CSP (0 style=, CSP without `unsafe-inline`, 4 CSSOM writes remain).
- Final measurements: 43 global tokens (35+8) + 6 scoped dials, 0 `style=` in `index.html` and `app.js`, CSP `style-src 'self' https://fonts.googleapis.com` without `unsafe-inline`, bundle raw 1,925,366 B (~1.84 MB) <2 MB, gzipped 586,529 B, render-lazy (Reader boot, others first activation).
- Frozen tracks: **PR-B CSP hardening folded into Phase 3**, **PR-D perf measure-first folded into Phase 2 lazy** per Checkpoint-C C-5 (a); PR-A real-browser still frozen, no Chromium run on record.
- Docs finalization: README interface, this section, AUDIT, ROADMAP, and dated vision `WEB_VISION_2026-09-13.md` finalised; OPERATIONS Edit1 closed structurally by O-3.
- Exit: owner light/dark desktop/mobile review of live Pages site pending, release checklist noted, ask whether required real-browser CI job is approved — no self-declared completion.


Phase 4 owner review (2026-09-14, ask_user):
- Light/dark desktop/mobile functional, but UX insufficient — layout really bad for human reader.
- Direction: overhauling website for human-readable, easy-of-use, welcoming space is highest priority.
- Note: AI agents limited, heavily rely on user feedback to forge vision.
- Real-browser CI: keep_frozen — PR-A remains frozen, owner review on live Pages remains evidence.
- Implication: Pages revamp Phases 1-3 functionally complete (43 tokens, 0 style=, CSP without unsafe-inline, render-lazy, bundle <2MB, 5 gates green), but visual approval is conditional — next top priority is human-readable overhaul as new proposal-first track beyond Phase B.


This direction and the subsequent copy cleanup are implemented. PR #18 merged as `63dfe37`; main Quality and Pages deployment passed. Current real-browser screenshots were unavailable in the audit environment — owner review on live Pages is the Phase4 exit.

## 4. Measured snapshot

```text
corpus=17 | slots=209 | verified=2 | matrix=21 | locators=4192/4192
content CJK=775,113 | all-string CJK=832,897
source-review: collated=13 | partial/failed=2 | unavailable=2
w1-evidence: active flagged=15 (authoritative 2026-09-21 combined Wumenguan/Linji overlay, 14 documents) | register designation=630 (owner ruling 2026-09-12) | historical=622 (2026-09-09) | report-figure-superseded=637
w1-campaign: wumenguan(#29) biyanlu(#30) linji(#32) xinxin(#34) re-keyed | platform_sutra(#35) labelled
w1-inventories: WITNESS_INVENTORY.md + WITNESS_INVENTORY_T48_T51.md + WITNESS_INVENTORY_XSERIES.md → PHASE2_PLAN.md
w1-fresh-collation (dated measurement, 2026-09-21 over the then-44-document main): flagged=486 vs the register designation=630 — two different claims, neither a completion claim
linji-rekey: 107 sections tiling the whole 16,366-CJK T47n1985 witness / 215 fields EXACT / 0 flagged (P2.9, 2026-09-21; sessions/COLLATION_REGISTER_2026-09-21_LINJI.json)
wumenguan-rekey: 48 cases tiling the whole 7,663-CJK T48n2005 witness / 207 fields EXACT / 0 flagged (P2.8, 2026-09-21; sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json)
combined-overlay: both re-keys ship as ONE dated overlay (sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json, 14 documents / 15 flagged) because the two single-re-key overlays rewrote the same manifest/queue/register surfaces and could not merge sequentially
gates: py_compile OK; validate_data.py PASS (full + --write-metrics); build_data_bundle.py deterministic (run twice, identical bytes; data/ mirror byte-identical). The combined overlay turns the previously RED gate suite GREEN: scripts/test_source_preservation.py now declares both re-keys in DECLARED_NEW_CORPUS (base repinned to f1207eaf), scripts/test_source_review_rules.py repoints AUTH_REGISTER/CORRECTION_REPORT at the combined WUMENGUAN_LINJI records with 4717/4223 partition originals, and scripts/smoke_test.mjs carries the 14-item manifest pin plus the Linji expectations (Section source: T47n1985_p0504a26–p0504a29 for sections.four_shouts, collated_with_normalization, 赤肉團 search hit) — register **not** superseded: owner ruled 2026-09-12 that the post-remediation evidence pass (PR #41) does not replace it, so 630 stays the register designation while the active 14-document corpus carries 15
complete=1 (wumenguan) | partial=10 | excerpt seeds=3
lineage=35 masters / 31 edges | glossary=31 | gong'an=24
app_data.js raw size as printed by scripts/build_data_bundle.py at build time / 14 documents
local first-load: measure with `gzip -c app_data.js app.js app.css index.html | wc -c` (raw + gzipped); the retired 2 MB Phase-3 tracking line no longer applies since the 2026-09-21 ingests
pages-revamp: tokens 43 (35+8) + 6 scoped, 0 style= in index.html/app.js, CSP without unsafe-inline, 4 CSSOM writes, render-lazy
frozen: PR-B CSP folded Phase3, PR-D perf folded Phase2, PR-A real-browser still frozen
```

Reproduce with `gzip -c app_data.js app.js app.css index.html | wc -c`. The raw total was the
Pages revamp phases' tracking line (2 MB ceiling, measured after Phase 3 at 1,925,366 B / 586,529 B
gzipped); it was never a CI gate, and the 13-document bundle of 2026-09-21 exceeds it, so the
current `app_data.js` byte count (printed at build time; 4,851,526 B before the 2026-09-21 ingest) —
not the ceiling — is the authoritative figure.

Verified citation reference coverage is **3 / 4**; the remaining **1** references are explicitly pending. Edition verification still does not establish reuse rights.

**W1 source-review disclosure:** the manifest records `collated_to_claimed_witness`, `partial_or_failed_w1_collation`, or `witness_unavailable` for every corpus item, and each status is re-derived from the merged evidence records (historical 2026-09-09 register + authoritative 2026-09-21 enthusiast fulls overlay, which inherits the chain back to the 2026-09-10 overlay's 35 entries). This is a containment/remediation state, not a rights decision. The Reader keeps **five separate, always-visible ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review. Containment/remediation state, not a rights decision. Source collation does not approve reuse. Title and name metadata (title_zh, name_zh) is measured and reported separately from source content, so collated_to_claimed_witness is not proof that the excluded metadata fields were collated.

W1 evidence: **17 documents, 127 flagged source fields** (authoritative 2026-09-22 P2 Tier2 batch1 overlay: `sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json` — the two purged Tier2 retelling keys restored as measured excerpt seeds (Guiyang 0 of 6, Fayan 1 of 11 source-content fields verbatim; re-key NOT landed) as documents 15 and 16, re-measuring the 14 entries of the 2026-09-21 combined Wumenguan/Linji overlay `sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json` byte-identically — the re-keyed Gateless Gate T48n2005 as the 13th document and the re-keyed Record of Linji T47n1985 as the 14th, inheriting the 12 entries of the 2026-09-21 enthusiast fulls overlay `sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json` verbatim, which itself inherits the 38 entries of the 2026-09-20 Caoshan Benji overlay `sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json`, the 37 entries of the 2026-09-20 full-Jingde-Chuandeng-Lu overlay `sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json`, the 36 entries of the 2026-09-20 correction overlay `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json`, and the 35 entries of the 2026-09-10 correction register `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` plus the Congrong Lu reinstatement; historical 2026-09-09 register: `sessions/COLLATION_REGISTER_2026-09-09.json` with 34 documents and 622 flagged fields — the 637 figure in the 2026-09-09 report is **superseded**); 4,709 of 4,734 source-content fields collate to their claimed witness, and 3 documents have no collating source-content field at all (the two witness-unavailable seeds plus guiyang_yulu).

Completion requires explicit `complete_selected_witness` status, satisfied unit targets, and a collated W1 source-review status. **12 of 17 documents** are `complete_selected_witness` as of 2026-09-22: the re-keyed Gateless Gate (48/48 cases, marked 2026-09-21) plus the ten documents task 058 marked on 2026-09-22 — `congronglu` 100/100, `chuandenglu_full` 1274/1274, `caoshan_benji` 84/84, `huangbo_fayao_full` 19/19, `mazu_guanglu_full` 35/35, `yunmen_guanglu_full` 776/776, `dongshan_yulu_full` 322/322, `zhaozhou_yulu_full` 80/80, `dahui_yulu_full` 1354/1354 cases and `linji_yulu` 107/107 sections — every one `collated_to_claimed_witness` with 0 flagged fields in the authoritative register and independently re-verified as a verbatim, contiguous tiling of its pinned witness region ([`sessions/P1_COMPLETE_MARKING_2026-09-22.md`](./sessions/P1_COMPLETE_MARKING_2026-09-22.md), with the per-document measurement in `sessions/P1_COMPLETE_MARKING_2026-09-22_tiling.json`). The claim is scoped to the pinned extraction rule `cbeta-p5-body-cjk-v1` (interlinear `tei:note` apparatus dropped) and to the region each `coverage_note` declares — Congronglu's front matter and inter-case case-name markers, the Chuandeng Lu's pre-fascicle-1 and post-fascicle-30 matter, and Zhaozhou's anthology neighbours are disclosed, not claimed. The 5 documents that are not complete are the excerpt seeds `zhengdao_ge` (collated, 6 stanzas, no unit target declared), `hanshan_poems` and `niutou_juezhu` (both `witness_unavailable`), and `guiyang_yulu`/`fayan_yulu` (the two purged Tier2 keys task 059 restored on 2026-09-22 as measured excerpt seeds — `partial_or_failed_w1_collation`, re-key attempts measured and NOT landed). The containment-era sentence that stood here until 2026-09-22 ("no document qualifies as complete selected witness; Wumenguan and Xinxin Ming … Biyanlu and Linji remain partial; Platform remains an excerpt seed") described the 35-document tree before the 2026-09-21 purge and re-keys and is retired, not re-estimated.

**The four release-blocking items — where each stands, each with the file to read:**

- **Post-remediation evidence pass — measurement published by PR #41 (2026-09-12); owner ruled 2026-09-12: 630 stays authoritative.** The dated register and report are committed as [`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`](./sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json) + [`sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md`](./sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md) (532 flagged fields, 691/924 content fields collating, statuses 1 / 32 / 2, `documents_with_changed_status: 0`); the pass does not supersede the register — the authoritative total stays at 630, now carried by the 2026-09-21 enthusiast fulls overlay, whose only additions are the six 0-flagged full-witness documents (it inherits the 2026-09-20 Caoshan Benji overlay's 38 entries, itself the 2026-09-20 chain of 36 → 37 → 38 that the owner's 2026-09-20 rulings authorised); today's data measures **486** over all 44 documents (re-run 2026-09-21) (read [`RESEARCH_RELEASE_PLAN.md`](./RESEARCH_RELEASE_PLAN.md) → "Release-blocking checklist" item 1, now closed on the designation half).
- **Label visibility in the Reader (task 011) — delivered by PR #40 (2026-09-12).** One shared renderer prints the three passage-level note keys at 17 content sites — at PR #40 merge that was 39 of the corpus's then-50 note strings (today as of the 2026-09-21 ingest: **57 of 99**, with the 42 `coverage_note` strings staying in the represented-units ledger as the one recorded exemption) — and §15 of `scripts/test_source_review_rules.py` fails CI on any future orphan key. Implemented and gate-guarded; no real-browser evidence exists, so it is not browser-verified (read [`RESEARCH_RELEASE_PLAN.md`](./RESEARCH_RELEASE_PLAN.md) → "Release-blocking checklist" item 2).
- **Owner's fabricated-text decision — unchanged, owner-held.** Replace, label, or remove the fields attested in no witness; explicitly not agent-authorisable (read [`.orchestrator/PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md) → `## Owner decision required`).
- **OUT-OF-CBETA human-sourcing queue — unchanged, owner-held.** 31 documents; **not agent-authorisable**: no agent may fetch, transcribe or evaluate those witnesses (read [`.orchestrator/PHASE2_PLAN.md`](./.orchestrator/PHASE2_PLAN.md) → §7).

## 5. Release blockers

### Content and rights

- All 14 translation-rights records remain `needs_rights_review` or `jurisdiction_review_required`.
- W1 found only one of the 35 documents in the 2026-09-10 register fully collated to its claimed witness; the 2026-09-20 overlays record the Congronglu reinstatement (100/100 cases, 0 flagged), the full 30-fascicle Jingde Chuandeng Lu (1,274/1,274) and the Caoshan Benji record (84/84) as the second, third and fourth, while Wumenguan and Xinxin Ming need per-document remediation, while the remaining partial/failed and unavailable states remain contained. Zhaozhou's claimed witness T1987 is the Caoshan record — W1 found the claim false, and re-pointing to X68n1315 is R-A work, deliberately not done here.
- The three excerpt seeds (`zhengdao_ge`, `hanshan_poems`, `niutou_juezhu`) still need witnesses before any source claim; the Record of Linji was re-keyed verbatim on 2026-09-21 (107 sections tiling the whole T47n1985, 0 flagged).
- Two lineage profiles lack linked corpus keys (yangqi_fanghui, dahong_zuzheng); Prajñātāra is linked to chuandenglu_full case 38. Ten of 31 edges are exact_locator_verified; 21 await locators. All four teacher frontiers remain; profile review is not completed by edge review.
- Congronglu is no longer quarantined: the 2026-09-20 reinstatement rebuilt it from the pinned T48n2004 witness (field-level collation 500/500, 0 flagged, no quarantined record copied) and recorded the one historical-anchor waiver in the dated overlay. What remains open is the human editorial sign-off, the unrepresented front matter / 著語 apparatus, and the unindexed cases — not the source claim.

### Engineering and operations

- Playwright skips with success when Chromium is unavailable and is not a required CI job; real-browser CI remains frozen track PR-A.
- Quality’s artifact diff — **Edit 1 closed structurally by O-3 (2026-09-13):** `git diff --exit-code -- app_data.js docs data/project_metrics.json` now covers root bundle, entire `docs/` mirror tree and metrics (see [`OPERATIONS.md`](./OPERATIONS.md) Edit 1). The old four-asset enumeration gap is resolved.
- Branch protection is unconfirmed because the integration receives 403 (Edit 3 still open).
- Bundle tracking line (retired): raw 1,925,366 B (~1.84 MB), gzipped 586,529 B — measured `gzip -c app_data.js app.js app.css index.html | wc -c` on main 3a6ae32, 2 MB ceiling tracked after Phase 3, never a gate. Current 36-document bundle: raw 2,525,870 B (~2.41 MB), gzipped 787,454 B (`app_data.js` alone 2,136,279 B). **Pages scope 2026-09-19: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for.**. The full data bundle initializes up front; since Phase 2 the hidden rooms defer *rendering* only (first tab activation, per Checkpoint-C C-4 — option B bundle-splitting was not taken and remains open if browser measurements justify it). **PR-D perf folded into Phase 2 lazy**.
- Inline style retired: **0 `style=` attribute literals in `app.js` and 0 in `index.html`** (Phase 2 moved the 41 Reader/popover literals into classes; Phase 3 re-composed the four secondary rooms onto the same class vocabulary), and the smoke test counts the literals, audits the rendered HTML of all five rooms, the dossier and the chart, and forbids the mechanisms a `style-src` list actually governs (`setAttribute('style', …)`, `style.cssText`, an injected `<style>`). Four CSSOM custom-property writes remain by design — the measured runtime contracts `--shell-height`, `--zh-font-size` and `--pop-shift`, named in the `app.css` token sheet and pinned by the smoke test — and since `style-src` does not govern CSSOM writes, **`style-src 'unsafe-inline'` is gone** from the CSP meta with Phase 3. CSP now reads `style-src 'self' https://fonts.googleapis.com`. **PR-B CSP hardening folded into Phase 3**.
- Lazy boot: render-lazy only — Reader at boot, hidden rooms on first activation (C-4 a), one bundle, no pipeline change.
- JSON Schema execution — **partially closed 2026-09-14 (task 008):** `scripts/validate_data.py` executes `schemas/translatechan-data.schema.json` against every corpus document, matrix translator record, the lineage-verification registry, and the lineage school vocabulary whenever the optional `jsonschema` library is installed (warn-only when it is absent, so the dependency-free validator keeps working everywhere); it is not a required CI dependency and JSON Schema is still not wired into CI as its own gate. The validator also gained gong'an `cross_refs` case-number cross-checks and an `evidence_source` enum check on `data/translations/translator_profiles.json`. Non-case field-level validation is still lighter than case-level validation.

### Presentation

- PR #18 merged after the English-first design and copy-cleanup iterations; real-browser desktop/mobile light/dark evidence remains unavailable.
- Social card: `og-image.svg` (primary) plus `og-image.png` (fallback, 1200×630, 71,415 B, deterministically rasterized from the SVG) — both are committed at root and mirrored into `docs/` by `scripts/build_data_bundle.py`; `index.html`'s `og:image`/`twitter:image` meta tags list the PNG first for broad platform compatibility, with the SVG as a secondary `og:image` entry.
- `SECURITY.md` exists (2026-09-14): minimal disclosure policy pointing to GitHub Security Advisories, no email intake, `main` only.
- Repository description/homepage/topics are empty.

## 6. Fixed behavior and resilience

- Lineage dossier toggles semantic hidden state and focus correctly; the dossier, the three shared popovers, and the Lineage register/chart view switch now toggle `hidden` exclusively (no `.style.display` writes remain), and the register is the room's first view with the chart as its second.
- Platform direct chapter shapes render source text.
- Wumenguan epilogue follows cases; Print/PDF expands all lazy units.
- Wumenguan/Biyanlu labels name their commentator and verse author.
- Persisted state is fail-soft and collapsed-case data is shape-validated.
- Missing/malformed bundles and top-level initialization failures render a visible recovery panel with reload/reset actions.
- CSP now precedes all scripts.

## 7. Quality commands

Run before every code/data push:

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
node scripts/smoke_test.mjs
diff -rq data docs/data
git diff --check
```

Optional browser suite:

```bash
npm ci
npx playwright install chromium
npm run test:browser
```

A skipped browser run is not visual, responsive, accessibility, or release evidence.

## 8. Safe content workflow

For canonical source additions:

1. Name the selected edition/recension and stable locator.
2. Import from an authoritative source; never generate canonical-looking Chinese.
3. Store field-level provenance and source-review status separately from representation, translation, edition-verification, and rights status.
4. Add exact unit locators for each public source field.
5. Keep pinyin/English generation status separate from Chinese source status.
6. Add negative validator fixtures before increasing completion claims.
7. Regenerate metrics/bundle/mirror and run all checks.
8. Obtain human editorial review before claiming source-checked or complete.

For verified modern quotations:

1. Record translator, work, edition, stable reference, wording verification, and `source_id`.
2. Resolve the source in `rights_manifest.json`.
3. Obtain and record a human rights decision.
4. Label wording “edition-verified quotation”; do not infer public-domain permission.

## 9. Repository map

```text
index.html / app.css / app.js / theme-init.js
app_data.js                         # generated data bundle
og-image.svg / og-image.png         # social-card image, SVG primary + PNG fallback (both mirrored into docs/)
SECURITY.md                         # minimal security-disclosure policy (GitHub Security Advisories)
data/                               # source-of-truth corpus and research indexes
  glossary/                        # 31 Classical Chan & Buddhist lexicon terms
  gongan/                          # 24 Gong'an cross-references index entries
schemas/                            # declarative schema
scripts/                            # validator, build, smoke, browser, migration helpers
sessions/                           # dated audit/implementation evidence; also holds the disposable
                                     # per-session response_summary.md snapshot once a session archives it
docs/                               # GitHub Pages mirror, including docs/audits/ (see §11)
OPERATIONS.md                       # owner-controlled CI/GitHub admin edits
```

## 10. Workflow and administration

Agents must not edit `.github/workflows/*` without explicit owner approval. Exact pending changes are documented in [`OPERATIONS.md`](./OPERATIONS.md):

- include `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`, and `docs/og-image.svg` in artifact-diff coverage;
- review/update Action majors;
- verify required Quality checks and branch protection;
- later add a non-skippable browser/accessibility job.

No custom Pages deployment workflow is needed.

## 11. Documentation rule

- [`AUDIT.md`](./AUDIT.md): current verdict and report index.
- [`OPERATIONS.md`](./OPERATIONS.md): owner-controlled CI/GitHub administration edits.
- [`SECURITY.md`](./SECURITY.md): minimal security-disclosure policy; report via GitHub Security Advisories, no email intake, `main` is the only supported branch.
- `response_summary.md`: disposable per-session working summary; never committed at repository root (`.gitignore` enforces this from 2026-09-14) — archive a session's copy into `sessions/` (e.g. [`sessions/RESPONSE_SUMMARY_2026-09-10.md`](./sessions/RESPONSE_SUMMARY_2026-09-10.md)) instead of leaving it live at root.
- `sessions/*.md`: dated immutable evidence.
- [`docs/audits/`](./docs/audits/) vs `sessions/`: `docs/audits/` is a small, curated, Pages-deployable mirror of selected `sessions/` evidence for the public audit trail (readable from the live site without a GitHub account); `sessions/` is the full append-only evidence record, including working notes that are not curated for public framing. Both are evidence, never current instructions; `docs/audits/` entries are copied, not authored, and a `sessions/` file remains the source of truth if the two ever appear to disagree.

Never append a full session narrative here; link the dated report.

The repository scoreboard (`SCOREBOARD.md` + `.scoreboard/`) was retired
by this PR; orchestrator oversight replaces it.

## 12. Merge and deployment status

PR [#18](https://github.com/56eli/translatechan/pull/18) merged into `main` as `63dfe379e026b829349b1ff78752c771e5c7e5d3`. Main Quality run `31490146548` and Pages deployment `31490145334` passed; Pages reports `built` with HTTPS enforced.

> **Measured status refresh 2026-09-21 (P2 Tier2 next, task 056):** the corpus carries **47** provenance-note strings across four keys (`cbeta_note` 29, `coverage_note` 42, `editorial_note` 65, `recension_note` 14), **32 of 47** rendering beside a passage (the 42 `coverage_note` lines stay ledgered by exemption), **36** documents carrying at least one rendered label — task 056 added 16 dialogue `editorial_note` R-B labels (6 `guiyang_yulu`, 10 `fayan_yulu`), added the `guiyang_yulu` `cbeta_note` and extended the `fayan_yulu` `cbeta_note`, and rewrote 2 `coverage_note` lines (125 → 150); it also corrects this series' previous line, whose `editorial_note` 16 figure undercounted the dialogue-level labels (measured 49 before this task) and whose 125 total was the key-sum, not the measured string count. The W1 register's authoritative flagged total stays 630.
> **Measured status refresh 2026-09-21 (P2 + enthusiast):** the corpus carries **47** provenance-note strings across four keys (`cbeta_note` 28, `coverage_note` 42, `editorial_note` 16, `recension_note` 14), **32 of 47** rendering beside a passage, **35** documents carrying at least one label.

> **Measured status refresh 2026-09-21 (P2 Tier2 + enthusiast final):** the corpus carries **47** provenance-note strings across four keys (`cbeta_note` 30, `coverage_note` 42, `editorial_note` 98, `recension_note` 14), **32 of 47** rendering beside a passage, **37** documents carrying at least one label.

> **Measured status refresh 2026-09-21 (PURGE retellings removed):** the corpus carries **47** provenance-note strings across four keys (`cbeta_note` 11, `coverage_note` 10, `editorial_note` 0, `recension_note` 0), **32 of 47** rendering beside a passage, **11** documents carrying at least one label. **13 documents, 15 flagged source fields**.
> **Measured status refresh 2026-09-21 (task P2.9, Linji re-key):** the corpus carries **47** provenance-note strings across four keys (`cbeta_note` 12, `coverage_note` 11, `editorial_note` 0, `recension_note` 0), **32 of 47** rendering beside a passage, **12** documents carrying at least one label. **13 documents, 15 flagged source fields** — the re-keyed Record of Linji (T47n1985, 107 verbatim sections, 215 measured fields, 215 EXACT, 0 flagged) joins as the 13th document.
> **Measured status refresh 2026-09-21 (tasks P2.8 + P2.9, combined Wumenguan/Linji overlay):** the corpus carries **47** provenance-note strings across four keys (`cbeta_note` 13, `coverage_note` 12, `editorial_note` 0, `recension_note` 0), **32 of 47** rendering beside a passage, **13** documents carrying at least one label. **14 documents, 15 flagged source fields** — the re-keyed Gateless Gate (T48n2005, 48 cases, 207 measured fields, 207 EXACT, 0 flagged) joins as the 13th document beside the re-keyed Record of Linji as the 14th.
> **Measured status refresh 2026-09-22 (task 059, P2 Tier2 yulu batch1):** the corpus carries **47** provenance-note strings across four keys (`cbeta_note` 15, `coverage_note` 14, `editorial_note` 16, `recension_note` 0), **32 of 47** rendering beside a passage (the 14 `coverage_note` lines stay ledgered by exemption), **15** documents carrying at least one rendered label — task 059 restores the two purged Tier2 retelling keys as measured excerpt seeds and their task-056 labels come back with the bytes (6 `guiyang_yulu` + 10 `fayan_yulu` dialogue `editorial_note` R-B labels, 2 `coverage_note`, 2 `cbeta_note`), re-measured byte-identically on the pinned layer (guiyang 0 of 6, fayan 1 of 11 source-content fields verbatim — re-key NOT landed). **16 documents, 41 flagged source fields.**

> the remaining **1**


<!-- census **47** provenance -->


<!-- census **32 of 47** -->


<!-- census **16** documents -->


<!-- census `cbeta_note` 16 -->
