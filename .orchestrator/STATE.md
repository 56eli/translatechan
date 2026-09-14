# Orchestrator State — Fake Chan Factory (`translatechan`)

> **Scope of this file:** the orchestrator's task queue and cross-session
> decisions only. The repository's own systems remain authoritative for agent
> contracts and operations: [`AGENTS.md`](../AGENTS.md),
> [`HANDOFF.md`](../HANDOFF.md), [`AUDIT.md`](../AUDIT.md),
> [`OPERATIONS.md`](../OPERATIONS.md), and append-only
> [`sessions/`](../sessions/).
> Maintained as a repository coordination file; it is not tied to an unrelated branch.
> Agents update it as a PR deliverable **only** when the task prompt says so;
> the human operator may also edit it directly.

## Active Milestone

**W1 COMPLETE (2026-09-09), CORRECTED (2026-09-10) — full-corpus collation evidence landed and is now reproducible.** Historical record (append-only): `sessions/COLLATION_W1_2026-09-09.md` + `sessions/COLLATION_REGISTER_2026-09-09.json` (34 documents, 622 flagged entries; the report's 637 figure is superseded and was never the register's arithmetic). Authoritative record: `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` + `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (35 documents — the 2026-09-10 overlay adds the Shitou Sandokai item the first run never mapped — 630 flagged entries) with `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`. Reference layer is now regenerable from the repository: `scripts/collate_refs.py` implements the extraction rule, pins CBETA XML P5 revision `dbdea41071e1e260ad84b72faefd4587333cf76d`, and verifies every reference digest (33 of 39 byte-identical to the 2026-09-09 manifest; the 6 drifted references change no document verdict). Verdict: only 1 of 35 documents collates 100% to its claimed witness; 22 have no collating source-content field at all (the 2026-09-09 report's tier table narrated 27 under a different denominator); verified fabrications exist inside both former `complete_selected_witness` texts (Wumenguan preface/epilogue/verses, case-23 pointer); Zhaozhou's canonical claim (T1987) is false (T1987 = Caoshan) and the corpus record still carries it — re-pointing is R-A work, deliberately not done here. Title/name metadata is excluded from the content denominator (391 metadata fields measured separately), so `collated_to_claimed_witness` never claims excluded metadata was collated.

**W1 public status model integrated (2026-09-09):** every manifest item now carries one of the exact source-review states `collated_to_claimed_witness`, `partial_or_failed_w1_collation`, or `witness_unavailable`; W1 report/register paths and evidence date are recorded at manifest level; completion/status incompatibilities are rejected; the Reader exposes the state visibly. This is a containment/remediation state, not a rights decision. No corpus source text was re-keyed. Per-document source remediation remains pending.

**W1 evidence contract hardened (2026-09-10, merged — PRs #25–#28):** `scripts/w1_evidence.py` now independently recomputes every derived figure instead of trusting stored ones — per-document field arithmetic (totals vs class summaries vs flagged arrays), per-document reference provenance against both committed digest manifests (a drifted/unlisted reference can never upgrade a status), the aggregate block, and the historical-vs-authoritative reproduction comparison; the correction report's numeric claims (document/flagged reconciliation, status counts, verification counts, cited register/manifest digests) and the report/register/manifest dates are validated. `--write-metrics` with any blocking evidence/data error exits nonzero and leaves `data/project_metrics.json` byte-identical (11-case mutation matrix in `scripts/test_source_review_rules.py`). One shared completion rule end-to-end: `complete` ⇔ `complete_selected_witness` + `collated_to_claimed_witness` (validator, `complete_document_keys()`, `per_text_metrics()`, Reader, shelf, smoke + runtime checks in `scripts/compat_runtime_check.mjs`). Source-Chinese preservation is CI-gated: `scripts/test_source_preservation.py` byte-compares `data/corpus/` against the pinned base commit `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43` and permits only allowlisted, exact JSON pointers (as of 2026-09-10 the two containment-era `coverage_note` disclosures plus the wumenguan R-A re-key pointers added by PR #29). The accidental public API `window.TranslateChan.getSourceReviewStatus` is removed (no replacement). The 2026-09-09 evidence files remain untouched (append-only).

**W1 remediation started (2026-09-10):** Wave 1, document 1 — wumenguan re-keyed to its claimed T2005 witness under the adopted R-A/R-B policy (PR #29): 62 re-keyable flagged fields (48 DIVERGENT + 14 NOT_FOUND) re-keyed verbatim from the pinned CBETA T48n2005 text; epilogue R-B-labeled (`editorial_note`, text untouched); `collate_corpus.py --doc wumenguan` residual = 9 documented flags; document status remains `partial_or_failed_w1_collation` pending the separate post-remediation evidence pass; the pass re-adjudicated this document on 2026-09-12 (`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`; `documents_with_changed_status: 0`) and this status is unchanged.

**W1 remediation, Wave 1 document 2 (2026-09-10):** biyanlu_cases re-keyed to its claimed T2003 witness (PR #30): all 20 adjudicated content fields (12 DIVERGENT + 7 NOT_FOUND + 1 SHORT_UNMATCHED) re-keyed verbatim from the pinned, digest-verified CBETA T48n2003 text — every one re-classifies EXACT; two fields additionally carry additive `editorial_note` R-B labels (case 20's `verse_zh` had joined the 頌 to 雪竇's separate 復成一頌; case 96's `dialogue[0].zh` carried a project parenthetical inside the source field, now moved to structured metadata). 15 sibling pinyin fields rewritten syllable-by-syllable in the PR #29 style. The witness — not the work-order paraphrase — was the authority: cases 1, 3 and 81 each DO carry a 垂示 in T48n2003, so all three pointers were re-keyed rather than removed. Harness before → after: content flags 42 → 22 (DIVERGENT 12 → 0, NOT_FOUND 7 → 0, SHORT_UNMATCHED 1 → 0, MINOR 22 unchanged), total flagged 128 → 108, collating content fields 353/395 → 373/395. Documented residual: 22 MINOR fields (left untouched by policy) + 86 `title_zh` metadata flags (out of scope, separate plan item) + one disclosed, unfixed coverage gap (case 42's 垂示 exists in the witness and is not represented). `coverage_note` rewritten honestly, `zh_chars` 75658 → 75854, corpus CJK totals 104,155 → 104,351 content / 109,614 → 109,848 all-string (README/AUDIT/HANDOFF §4 regenerated), allowlist extended with exactly the 39 changed pointers. Document status remains `partial_or_failed_w1_collation` pending the separate post-remediation evidence pass; the pass re-adjudicated this document on 2026-09-12 (`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`; `documents_with_changed_status: 0`) and this status is unchanged.

**W1 remediation, Wave 1 document 3 (2026-09-11):** linji_yulu re-keyed to its claimed T1985 witness (PR #32): all 10 W1-flagged content fields adjudicated against the pinned, digest-verified CBETA T47n1985 text (reference digest `4317e5fa…`, refs manifest byte-identical, 39/39 verified). 5 fields re-keyed verbatim from the witness (R-A) — 2 DIVERGENT (`.sections[0].dialogue[1].zh`: 甚麼 → witness 什麼, one grapheme; `.sections[68].dialogue[0].zh`: 栽松, restored 境致/钁頭/黃蘗 witness forms) and 3 witness-covered NOT_FOUND 行錄 retellings (`.sections[67].dialogue[0].zh`: the full 黃蘗-三度被打-大愚 episode as T47n1985 carries it; `.sections[69].dialogue[0].zh`: the 普請 empty-hands passage, witness 钁頭 not 拄杖; `.sections[70].dialogue[0].zh`: the 達磨塔頭 exchange) — all five re-classify EXACT; 4 sibling pinyin fields rewritten syllable-by-syllable in the PR #29/#30 style. 3 NOT_FOUND fields kept as project-authored R-B retellings with additive `editorial_note` labels and no witness attribution, per the owner's 2026-09-11 per-field ruling on the 行錄 division (sections 71–73: the 龍門普化 and 象田 dialogues are absent from T47n1985 — verified by full-file search — and section 73's 示寂 composite carries the 傳法偈 and 塔名 clauses the witness does not; the deathbed exchange it shares with `blind_donkey` is collated there). No section deleted or reordered; the division stays represented. 2 MINOR fields (㽄/㴸 `<g>`-apparatus residue in sections 43/58) left untouched by policy. Harness before → after: content flags 10 → 5 (DIVERGENT 2 → 0, NOT_FOUND 6 → 3, MINOR 2 unchanged), total flagged 84 → 79, collating content fields 79/89 → 84/89; the 74 `title_zh` metadata flags are untouched (composite-title PR scope). The false `coverage_note` completeness claim ("74 / 74 canonical sections complete across all 4 divisions" — five names under "4") replaced with the honest biyanlu-template disclosure. `zh_chars` 13993 → 14206; corpus CJK totals 104,351 → 104,564 content / 109,848 → 110,078 all-string (README/AUDIT/HANDOFF §4 regenerated); allowlist extended with exactly the 14 changed pointers; `data/canonical_locators.json` untouched — the `sections.four_shouts` anchor range still holds and every re-keyed span sits inside the existing loose 行錄 page ranges. Document status remains `partial_or_failed_w1_collation` pending the separate post-remediation evidence pass; the pass re-adjudicated this document on 2026-09-12 (`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`; `documents_with_changed_status: 0`) and this status is unchanged.

**W1 remediation, Wave 1 document 4 (2026-09-11):** xinxin_ming re-keyed to its claimed T2010 witness (PR #34): 12 of the 13 W1-flagged content fields are DIVERGENT and were re-keyed verbatim from the pinned, digest-verified CBETA T48n2010 text (reference digest `9aaa3217…`, 588 CJK graphs, refs manifest line 20) — all 12 re-classify EXACT. Every replacement was derived from the reference file, not from the register's `ref_window` (which on this document is the collator's highest-similarity window, not the replacement: 5 of 13 were not substrings of the witness at all); the derivation splits the field on ，/。 into clauses, fixes the span start from a clause occurring exactly once in the reference, cuts `span = ref[start : start + 4·len(clauses)]`, and re-emits the field by replacing only its CJK graphs so the project's punctuation positions are untouched. Two traps measured: the reference is one unpunctuated line with no trailing newline, and it opens with the 3-graph title 信心銘, so the 4-graph clauses sit at offsets ≡ 3 (mod 4). The 13th field, `.stanzas[31].zh`, is NOT_FOUND and was **kept**: its fourth clause 一念萬年 returns 0 hits in a full-text search of the witness (一念 0, 萬年 0), and the span the alignment rule produces for the field ends in the clause this document uses to open stanza 33 — so adopting it would delete a canonical line and duplicate stanza 33 rather than correct a variant. Kept whole with an additive `editorial_note` R-B label (no witness attribution, no witness clause quoted), per the owner's 2026-09-11 ruling for linji_yulu 行錄 71–73. 10 sibling pinyin fields rewritten syllable-by-syllable; 2 (`.stanzas[14]`, `.stanzas[32]`) left byte-identical because those substitutions are graphic-only and the reading is unchanged (象/像 xiàng, 忘/妄 wàng). Harness before → after: content flags 13 → 1 (DIVERGENT 12 → 0, NOT_FOUND 1 unchanged), total flagged 14 → 2, collating content fields 24/37 → 36/37; the single `.title_zh` metadata flag is untouched (composite-title PR scope). Content CJK is unchanged at 584 (like-for-like substitution, including `stanzas[28]`'s 4 → 4 reordering); document all-string CJK 604 → 607 (+3, the 信心銘 inside the new note); corpus `content_cjk_characters` stays 104,564 and `all_corpus_cjk_characters` moves 110,078 → 110,081 (README/AUDIT/HANDOFF §4 regenerated); allowlist extended with exactly the 24 changed leaf pointers (12 `.zh` + 10 `.pinyin` + `.stanzas[31].editorial_note` + `.coverage_note`; no `zh_chars` pointer — this document declares none). `data/corpus_manifest.json` byte-identical. Document status remains `partial_or_failed_w1_collation` pending the separate post-remediation evidence pass; the pass re-adjudicated this document on 2026-09-12 (`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`; `documents_with_changed_status: 0`) and this status is unchanged.

**W1 remediation, Wave 1 document 5 — `platform_sutra` labelled, not sourced (PR #35, 2026-09-11):** the owner's 2026-09-11 ruling (*prefer the oldest near-complete copy*) lands on this document as **provenance labels, not provenance fixes**: CBETA T48n2007 (Dunhuang, Taishō 48 no. 2007) is now the named primary witness and T48n2008 (宗寶, the later popular recension) the named alternative, recorded in a new root `recension_note`, 12 additive per-field `recension_note` labels and a rewritten honest `coverage_note` — 14 changed leaf pointers, allowlisted set-equal in `scripts/test_source_preservation.py`. Measured against both pinned witnesses (xml-p5 `dbdea410…`; `ref_T48n2007.txt` `4f6ac8de…`, `ref_T48n2008.txt` `71a340cb…`; 39 verified / 0 drift; 12,124 vs 26,043 graphs): of 13 source-content fields, **1 is verbatim in the primary witness, 3 in the alternative, 9 in neither** — 113 of 680 content graphs are witness text and 567 are project précis. **Zero characters of Chinese were re-keyed**, no `title_*`/`pinyin`/`translations.*` leaf changed, `corpus_manifest.json` and `canonical_locators.json` are byte-identical, no status flipped, and collation is unchanged at 4/13 collated with 9 content flags (labels do not improve collation). Structural facts now disclosed: 護法 occurs 0 times in both witnesses while 宗寶 titles that chapter 宣詔第九; none of the ten 品-numbered chapter-title cores is attested in either witness (the 宗寶 table of contents writes them without 品); the root title 六祖大師法寶壇經 is a 宗寶 title only. The **text decision** — replace the 9 précis fields with Dunhuang text, or keep them as labelled précis — is **deferred pending the 006–008 witness inventory**.

**Scoreboard retired (2026-09-11, PR #31):** `.scoreboard/` + `SCOREBOARD.md` deleted per the 2026-09-09 owner decision; the `.scoreboard/` history log and all `user_score` fields were deleted, not migrated (the owner decision superseded them); the owner-controlled workflow-edit record survives relocated to `OPERATIONS.md`, where the retired `blocked_manual_workflow_edit` status vocabulary is now a plain prose note.

**Active track — Wave 1 remediation (in progress):** per-document work under the adopted hybrid policy — R-A where authoritative witness text is available; R-B for retained project retellings with witness claims removed; R-C for material that cannot responsibly be sourced or relabeled. Done: wumenguan (PR #29), biyanlu_cases (PR #30), linji_yulu (PR #32), xinxin_ming (PR #34).

**W1 independent witness inventory (2026-09-11, task 006):** family 1 — the nine T47-recension documents — measured read-only against the pinned, digest-verified CBETA refs (39 verified / 0 drift @ `dbdea41071e1e260ad84b72faefd4587333cf76d`); self-test passed (linji_yulu 84/89, moved off the stale register as predicted); per-doc P0 findings and the worst-doc ranking (zhaozhou_yulu first: T1987 is the Caoshan record) are in [WITNESS_INVENTORY.md](WITNESS_INVENTORY.md) — measurement only, no data touched; the findings feed the next work packages.

**W1 independent witness inventories, families 2–3 (2026-09-11, tasks 007a/007b):** [WITNESS_INVENTORY_T48_T51.md](WITNESS_INVENTORY_T48_T51.md) (T45/T48/T51 documents + the witness-unavailable pair) and [WITNESS_INVENTORY_XSERIES.md](WITNESS_INVENTORY_XSERIES.md) (X-series witnesses) — measurement only, no data touched. The three inventories are consolidated, re-verified and ranked in [PHASE2_PLAN.md](PHASE2_PLAN.md) (task 008); the Phase-2 owner decisions live at the end of that file.

**Provenance labels made visible (2026-09-12, task 011):** the reader now renders every provenance note the corpus carries — the presentation half of the owner's 2026-09-12 directive (*source integrity, referencing and presentation*), companion to the 010/010b prose alignment. Measured before the change: **49 `*_note` values across 4 keys** in `data/corpus/*.json` and exactly **one** render site (a verse-level `recension_note` inline in `renderChapterItem`), so 16 root `cbeta_note` citation corrections (e.g. `caoxi_zhuan`'s "prior 'X1458' wrong — X1458 is 宗門寶積錄 … the 曹溪大師別傳 is X86n1598 … plus the Dunhuang manuscript P.3018"), 8 `editorial_note` witness-attribution labels (`linji_yulu` sections 71–73, `xinxin_ming` stanza 31, `wumenguan` epilogue, `biyanlu_cases` cases 20/96 and `huangbo_wanling`'s re-keyed Q&A section) and 11 of 14 `recension_note` labels (only the 3 verse-level ones were reachable) — including `platform_sutra`'s root recension ruling and its 6 chapter + 4 dialogue "condensed project précis" disclosures — were unreachable. One shared renderer (`renderProvenanceNoteLine` / `renderProvenanceNotes`) reuses the muted-note markup, the `ℹ️` affordance and the `escHtml` path that the single existing site already used, and is called at **17 content sites**: document root (in the header the reader already uses for `coverage_note`), front matter, end matter, case / section / dialogue / stanza / chapter units and their nested dialogue and verse entries, plus five-ranks and sample records. Precedence lives in one constant — `recension_note` → `editorial_note` → `cbeta_note`, one line each, never concatenated, because the three keys were introduced deliberately and mean different things; missing / empty / non-string render nothing. `coverage_note` stays exactly where it was (the "Reading" row of the represented-units ledger): it is a document-scale ledger field, not a passage label, and is recorded as an explained exemption rather than silently skipped. Rendered note lines across the 35 documents: **3 → 38**, an exact per-document match with the data (browser-free DOM-stub render of every document). The state is now permanent: `scripts/test_source_review_rules.py` §15 enumerates `[a-z_]+_note` keys **from the data at run time** and fails when one is neither in `app.js`'s `PROVENANCE_NOTE_KEYS` nor on the explained exemption list, also asserting the one-renderer/17-site shape; proved red on a scratch copy outside the repo by injecting an orphan key. Zero bytes changed under `data/**`, `docs/data/**`, `corpus_manifest.json`, `canonical_locators.json`, `project_metrics.json`; **104,564 / 110,165 unmoved**; no allowlist entry needed; `docs/app.js` moved only as the build-generated mirror of `app.js`; no new CSS, no class invention, no layout change (the visual reset stays a separate deferred track).

**Shipped-state documentation alignment (2026-09-12, task 013, PR #42):** docs-only PR recording what the two merged PRs shipped — #40 (task 011, the provenance-note renderer) and #41 (task 012, the post-remediation register) — which four top-level documents still described as unbuilt as of `0f8432a`. Nine stale claims were corrected to measured state: the reader renders all three passage-level note keys (`recension_note` → `editorial_note` → `cbeta_note`, one line each) at **17** call sites — **38 of 49** note strings beside passages, with the 11 `coverage_note` strings remaining dossier-ledger lines under `NOTE_RENDER_EXEMPTIONS`, so no sentence claims "all 49 render"; `vision.md`'s measuring script was replaced because `app.js` mention counts stopped measuring rendering once the keys moved into one constant and an explanatory exemption comment — the replacement parses `PROVENANCE_NOTE_KEYS`, counts the `renderProvenanceNotes(` call sites, reads the exemption map from `scripts/test_source_review_rules.py`, and asserts every `*_note` key in `data/corpus/*.json` is rendered or exempted (green on `main`, output pasted beside it); release blocker 2 is ticked in `RESEARCH_RELEASE_PLAN.md` clause by clause against its own exit (one shared renderer on muted-note/`escHtml` markup, every note-bearing node type, one precedence constant, data-driven orphan gate, zero data bytes and zero CJK movement), the Current-baseline disclosure summary and the `vision.md`/`ROADMAP.md`/`HANDOFF.md` siblings carry the same words and the not-browser-verified qualifier, and the Phase 4 checklist box is ticked in the parenthetical shape of the hover/focus item; two stale measured figures were corrected — the rule suite prints **120** checks, not 96 (§15 grew with #40), and `platform_sutra` holds **14** `recension_note` values = 1 root + 3 verse + 6 chapter + 4 dialogue (10 chapter/dialogue, not the previous 12); the five pass-deferral tails in this file append the pass's outcome (re-adjudicated 2026-09-12, `documents_with_changed_status: 0`, status unchanged) rather than losing their history. Release blocker 1 deliberately stays **unticked**: #41 delivered its measurement half (532 flagged fields, 691/924 content fields collating, statuses 1 / 32 / 2, no document's status moved) while the designation half — `--write-metrics` re-pointing the gate-pinned figures at the new record — is held for an owner-ruled change to the evidence model. Scope: only `vision.md`, `ROADMAP.md`, `RESEARCH_RELEASE_PLAN.md`, `HANDOFF.md` and this file; zero bytes under `data/`, `docs/`, `scripts/`, `app.js` or `sessions/`.

**Next (in order):**
1. `platform_sutra` — labelled via #35 (2026-09-11): provenance labels only (primary witness T48n2007 Dunhuang, alternative T48n2008 宗寶; zero characters re-keyed); the text decision (keep the 9 labelled précis fields or re-key to T48n2007) is framed for the owner in [PHASE2_PLAN.md](PHASE2_PLAN.md).

**Not part of remediation PRs:** the visual-system reset — deferred, separate track. PR-A/B/D remain frozen. W2 remains separate.

Reference state: extracted CBETA refs live OUTSIDE the repo (21 MB, never committed). Verify the committed authoritative register's file integrity with sha256 `5369af1163e55eb25e2695160a0ec04805efc13a606841a6d6cb19b1936d3d31` (refs manifest sha256 `f3ac90b2ae9c7b969f157185d83651bcb00c24e535a0ef1f5ac143c4aa8174a9`). To replay the collation against current data and obtain the current-state register (532 flagged entries, dated 2026-09-12) along with a reproduction-comparison block against the 2026-09-10 authoritative record, run `COLLATION_REFS=<refs> python3 scripts/collate_corpus.py --out /tmp/register.json --reproduce sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json`; `--reproduce` replays the `generation_parameters` block the register records and emits a current-state measurement, not a byte-for-byte copy of the historical 630-flagged file (which cannot be re-emitted because the underlying data has changed through the four merged re-keys). The rule that produces them is committed: `python3 scripts/collate_corpus.py --print-refs` lists the works, `scripts/collate_refs.py` extracts + verifies them against a digest manifest, and `scripts/collate_corpus.py` collates on top of them (`--refs-manifest`, `--compare-historical-refs`, `--require-verified-refs`). Full command sequence: `sessions/COLLATION_W1_2026-09-10_CORRECTION.md` §7.


**Phase B — Pages revamp COMPLETE pending owner approval (2026-09-13, main 3a6ae32):** Checkpoint-C C-1..C-5 answered 2026-09-13 (colors acceptable, everything else adaptable/replaceable, serif, subordinate, lazy, full plan) in proposal PR #46 (merged main a1ebcef). Phase 1 system+masthead PR #48 merged main 0d02c4c (tokens 63→43, serif Source Serif 4, shell/hero/mobile bar, OG redraw, 5 gates green). Phase 2 Reader PR #49 merged main cae8837 (sheet minimal, ledger drawer, thin register, 41 style=→0, render-lazy boot per C-4 a, 5 gates green). Phase 3 secondary rooms + CSP PR #50 merged main 3a6ae32 (collation table, transmission register, case catalogue, dictionary, 0 style=, CSP without unsafe-inline, 4 CSSOM writes remain, 5 gates green). Final measurements: 43 global tokens (35+8) + 6 scoped dials, 0 style= in index.html/app.js, CSP `style-src 'self' https://fonts.googleapis.com` without unsafe-inline, bundle raw 1,925,366 B (~1.84 MB) <2 MB gzipped 586,529 B, render-lazy. Dated current-vision doc `WEB_VISION_2026-09-13.md` created. Frozen tracks PR-B/PR-D closed as folded per C-5 (a), PR-A still frozen (no Chromium). Phase 4 evidence and approval in progress — owner light/dark desktop/mobile review on live Pages, docs finalization, release checklist, ask whether required real-browser CI job is approved.



**Phase 4 owner review (2026-09-14, via ask_user):**
- Visual: "Light dark and desktop mobile is functional, however the user experience on the website is insufficient. The layout is really bad for a human reader. Overhauling the website for a human-readable, easy-of-use, welcoming space is highest priority. Consider that AI agents are limited in their ability and heavily rely on user feedback to forge that vision."
- Real-browser CI: "keep_frozen — no required browser job" — owner chooses to keep PR-A frozen, owner review on live Pages remains visual evidence.
- Implication: Pages revamp Phases 1-3 (system+masthead, Reader sheet/drawer/register, secondary rooms, CSP without unsafe-inline, render-lazy, bundle <2MB) is **functionally complete and gate-green**, but **UX is insufficient for human reader** — next top priority is human-readable, easy-of-use, welcoming overhaul. This will be a new proposal-first track beyond Phase B, not part of this docs PR.
- Docs: this PR (docs/pages-phase4-evidence, PR #51 from arena/01a09f16-translatechan) finalises README/HANDOFF/AUDIT/ROADMAP + WEB_VISION_2026-09-13.md + OPERATIONS Edit1 closed by O-3 + frozen PR-B/PR-D closed as folded. No self-declared visual completion — owner feedback recorded verbatim.


## Standing Decisions (2026-09-09, owner)

- **Vision:** vision.md in full is the target; the audit serves that ambition.
- **Collation depth:** FULL — done (except 2 non-CBETA-witness docs: hanshan, niutou).
- **Scoreboard: REMOVE** `.scoreboard/` + `SCOREBOARD.md` entirely; orchestrator oversight replaces it (queued PR after W1/W2; update AGENTS.md contract accordingly; user_score protocol dies with the file). (executed — PR #31)
- **Sequencing:** Wave 1 remediation is the active track — wumenguan (PR #29), biyanlu_cases (PR #30), linji_yulu (PR #32) done; next `xinxin_ming`, then `platform_sutra` (blocked on an owner recension ruling: CBETA T2008 宗寶 vs Dunhuang T2007). The visual-system reset is deferred and is not part of remediation PRs; PR-A/B/D remain frozen; W2 remains separate.

## Standing Decisions (2026-09-12, owner — four rulings; executed by PR #43)

- **Ruling 1 — the six `CITATION` rows ship in ONE PR.** Authorises a single PR carrying one commit per document for citation strings only (no source text); forbids batching any other remediation class — `RE-KEY`/`LABEL` work stays one document per PR, unchanged.
- **Ruling 2 — the ledger stays as it is.** `630` remains the authoritative register figure and the 2026-09-12 post-remediation record stays a dated measurement; the published pass (PR #41, 2026-09-12) does **not** supersede the register. Authorises citing both figures with their dates; forbids re-designation — no `scripts/w1_evidence.py` or `FIXED_METADATA` change and no retiring the pinned `630` sentences.
- **Ruling 3 — fabricated/unsupported text is replaced with real source text where the pinned witness carries it, labelled where it does not.** In PR #43 this is the §5 wording rule only: the false T1987 claim is **withdrawn** rather than re-pointed (the candidate X68n1315 is unverified — a probe collates 2 of 19 content fields), the document goes to the human-sourcing queue, and no field is re-keyed.
- **Ruling 4 — `OUT-OF-CBETA` sourcing is human work.** Authorises acquisition work orders for the highest-value documents; forbids any agent fetch or transcription of those witnesses.

Executed so far: **PR #43 (2026-09-12)** fixes the six `CITATION` rows — `zhaozhou_yulu` (the false T1987 claim, withdrawn), `fayan_yulu`, `dongshan_yulu`, `mazu_yulu`, `dahui_hongzhi` — with no status change, no re-designation and no new locator.

## Standing Decisions (2026-09-14, owner — Ruling 1 exception for `LABEL` rows)

- **Ruling 1 exception 2026-09-14 (recorded verbatim):** "LABEL-only docs may ship up to 3 per PR (minor, ~1.5h), RE-KEY docs stay one per PR (major, ~1-2h). No batching of HUMAN-SOURCE or OUT-OF-CBETA. Each doc must be a separate commit with its own collation before/after note, and PR description must list per-doc measurements. Record verbatim in STATE.md."
- **What the exception relaxes:** Ruling 1's *one document per PR* rule, for `LABEL` rows only — additive disclosure notes with no Chinese re-key and no collation cross-talk, risk assessed LOW by the owner. It changes the queued PR count for the 28 remaining W1 documents from 28 to 16 (6 `LABEL` bundles of 3 + 10 `RE-KEY` PRs of 1).
- **What it does not relax:** one commit per document; the per-document collation before/after measurement; `RE-KEY` staying one document per PR; the ban on batching `HUMAN-SOURCE` or `OUT-OF-CBETA` rows; Ruling 2 (630 authoritative, 532 today's measurement); Ruling 3 (a false claim is withdrawn, not re-pointed); Ruling 4 (no agent fetch or transcription of OUT-OF-CBETA witnesses).
- **Executed first by LABEL bundle 1 (this PR, 2026-09-14):** `yuanwu_letters` (0/2 — both letter fields absent from both claimed witnesses and from all 39 pinned refs), `yunmen_yulu` (0/12 verbatim in the correct work T47n1988; its "from T1988" claim is withdrawn), `zhengdao_ge` (6/6 verbatim; the one flag is the root `title_zh`, disclosed as a project heading). Three commits, one per document, each with its own collation before/after note. No Chinese was re-keyed, no `source_review_status` moved, no locator was added, and all five gates stayed green (bundle 1,642,473 B → 1,646,833 B — the growth is the three note strings).

## Checkpoint-C — Pages Revamp Direction (2026-09-13, owner — proposal PR #46)

- Date: 2026-09-13
- Source: owner answers to C-1..C-5 via structured questions, recorded verbatim
- C-1 Visual intensity: "Colors are acceptable. Everything else can be adapted as seen fit, even fully replaced if suited." (owner custom)
- C-2 English typographic voice: "(a) Scholarly serif for hook/headings/translations, sans for controls" + sub-decision self-hosted vs Google-served pending? Owner selected (a) scholarly serif.
- C-3 Chinese/English balance: "(a) Present but subordinate everywhere except inside the Reader sheet where it is largest"
- C-4 Performance strategy: "(a) Render-lazy only — keep one bundle, hidden rooms render on first activation"
- C-5 Scope/sequencing: "(a) Full plan: system+masthead → Reader → secondary rooms → CSP tightening → evidence, fold PR-B/PR-D"
- Additional: "I merged. Continue with plain word, guided questioning."
- Implication: colors #2c2523 walnut etc acceptable, everything else may be replaced if suited; serif chosen; subordinate; lazy; full plan.

## Task Queue

- [x] **Lineage corpus-key curation (6 profiles)** — integrated in the current baseline
- [x] **W1 — Full-corpus collation vs CBETA** — evidence is recorded in the immutable report/register
- [x] **REMEDIATION Wave 1, doc 1 — wumenguan re-keyed to T2005 (PR #29, 2026-09-10)** — 62 re-keyable flagged source fields re-keyed verbatim from CBETA T48n2005 @ `dbdea41071e1e260ad84b72faefd4587333cf76d` per `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` (collation re-run after the prompt-002 revision: flagged 70 → 9, the documented residual 6 MINOR + 2 SHORT_UNMATCHED titles + R-B epilogue); sibling pinyin rewritten syllable-by-syllable; epilogue R-B-labeled in structured metadata; `source_review_status` legitimately remains `partial_or_failed_w1_collation` until the post-remediation evidence pass, which re-adjudicated this document on 2026-09-12 (`sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json`; `documents_with_changed_status: 0`) and left the status unchanged at `partial_or_failed_w1_collation`. Supersedes PR #23 (verdict DO-NOT-MERGE: 65/70 fields untouched, truncated register-window fragments pasted as text, one corrupted field, garbled pinyin, false "Complete" claim).
- [~] **W1 public status-model containment** — manifest statuses, validator guards, Reader disclosure, and current documentation integrated; evidence contract hardened (merged — PRs #25–#28); per-document source remediation remains pending
- [x] **Visual-system reset / Pages revamp — Phase B COMPLETE (2026-09-13, main 3a6ae32):** Checkpoint-C C-1..C-5 answered, proposal PR #46 merged, then Phases 1-3 executed: **Phase 1 system+masthead PR #48** (tokens 63→43, serif Source Serif 4, shell/hero/mobile bar, OG redraw, 5 gates green), **Phase 2 Reader PR #49** (sheet minimal, ledger drawer, thin register, 41 style=→0, render-lazy boot per C-4 a, 5 gates green), **Phase 3 secondary rooms + CSP PR #50** (collation table, transmission register, case catalogue, dictionary, 0 style=, CSP without unsafe-inline, 4 CSSOM writes remain, 5 gates green). Final measurements: 43 global tokens (35+8) + 6 scoped dials, 0 style= in index.html/app.js, CSP `style-src 'self' https://fonts.googleapis.com` without unsafe-inline, bundle raw 1,925,366 B (~1.84 MB) <2 MB gzipped 586,529 B, render-lazy. Dated vision `WEB_VISION_2026-09-13.md` created. Owner light/dark desktop/mobile review on live Pages pending — no self-declared completion. **PR-B CSP hardening folded into Phase 3, PR-D perf measure-first folded into Phase 2 lazy per C-5 (a).**
- [ ] **REMEDIATION hybrid policy**: per-doc work packages in `.orchestrator/REMEDIATION_PLAN.md`; delegate to coder agents, one document per PR. Wave 1 progress: wumenguan (PR #29), biyanlu_cases (PR #30), linji_yulu (PR #32); **next: xinxin_ming**, then platform_sutra
- [ ] **W2 — Verified-quotation spot-check** (177 slots vs public-domain editions; Senzaki & Reps 1934 first) — sequencing at successor's discretion (before or parallel to remediation)
- [x] **Scoreboard removal PR** — delete `.scoreboard/` + `SCOREBOARD.md`; update AGENTS.md contract (owner decision 2026-09-09; PR #31, 2026-09-11)
- [ ] **PR-A — Real-browser verification pass** (frozen during audit; resume after remediation starts) — still frozen in Phase4, no Chromium run on record, owner review is exit.
- [x] **PR-B — CSP hardening** · **PR-D — Performance, measure-first** — **CLOSED AS FOLDED (2026-09-13, main 3a6ae32):** per Checkpoint-C C-5 (a) these fold into the Pages revamp sequence — PR-B into Phase 3 (58→0 inline styles, CSP drop unsafe-inline), PR-D into Phase 2 (render-lazy only per C-4 a, bundle <2 MB). No standalone PRs.
- [ ] **Phase 4 — Evidence and approval (owner light/dark review, docs final, frozen tracks close) — IN PROGRESS (2026-09-13):** prompt 007 dispatched, branch `docs/pages-phase4-evidence`, final system measured (tokens 43, 0 style=, CSP without unsafe-inline, bundle 1.91MB raw, 4 CSSOM writes, lazy boot), docs finalization README/HANDOFF/AUDIT/ROADMAP + dated vision `WEB_VISION_2026-09-13.md`, OPERATIONS Edit1 closed structurally by O-3, PR-B/PR-D closed as folded, release checklist noted, ask whether required real-browser CI job is approved. Exit: owner approval recorded, no self-declared completion, 5 gates green.
- [ ] Later tranche — 30 lineage edges exact-locator groundwork
- [ ] Later tranche — Biyanlu / Linji / Platform / excerpt-seed field-level source review (fold into R-A packages)

## Deferred / Technical Debt

- **Congronglu reintroduction** — quarantined 2026-08-10 (generated source-looking placeholders). Blocked on source-pinned field-level collation from authoritative T48n2004 TEI. Do not restore.
- **`.github/workflows/quality.yml` artifact-diff gaps** (4 mirrored assets missing) — **CLOSED STRUCTURALLY BY O-3 (2026-09-13, main 3a6ae32):** documented in [`OPERATIONS.md`](../OPERATIONS.md) Edit 1, now resolved via structural check `git diff --exit-code -- app_data.js docs data/project_metrics.json` in Quality workflow (PR #45, O-3). The old per-file enumeration gap is gone; Edit 1 closed.
- **Rights review** — all 14 `rights_manifest.json` sources await human/jurisdiction review. Human decision; not agent work. Edition verification never implies rights approval.

## Architectural Invariants

1. **Never generate source-looking Classical Chinese.** Corpus text comes only from recorded authoritative sources (HANDOFF.md §8 workflow).
2. **N/N representation never establishes completion** — only explicit editorial `completion_status` counts; the validator is the spec.
3. **Edition verification ≠ rights approval**; both are tracked separately everywhere.
4. **Internal identifiers stay**: `translatechan_*` localStorage keys, `window.TranslateChan`, `TRANSLATECHAN_DATA`; public brand is "Fake Chan Factory". Humor-forward tone stays.
5. **Public scope is exactly 5 rooms** (Reader, Matrix, Lineage, Gong'an, Lexicon), smoke-guarded; Translation Studio / Arena Agents / header GitHub link stay out.
6. **No edits to `.github/workflows/*` without explicit owner approval**; `OPERATIONS.md` is the only record of owner-controlled CI/GitHub-side edits.
7. **Pipeline order is fixed**: `data/` → `validate_data.py` → `project_metrics.json` → `build_data_bundle.py` → root assets + byte-identical `/docs` mirror. All five quality gates pass before every push.
8. **Durable memory lives in repo files**, not chat; dated evidence in `sessions/` is immutable.

## Continuation (cold start) — added 2026-09-13

> **Why this section exists:** an orchestrator session expires. Everything a successor needs to
> resume the source-integrity campaign from `main` alone — the prompt channel, the published prompt
> index, the immediate next task, the owner's rulings, the frozen surface and the environment
> hazard — is recorded here, so continuing never depends on reading an unmerged branch. This
> section is additive: it rewords nothing above, and every figure in it was re-measured in the
> session that wrote it, at `main` = `1b41d0b8c300bcbe98639a62e4b13fda76714e18`.

Three campaign invariants that no other single file states together; every continuation inherits all three:

1. **The harness probing a witness is not the same as a field collating in it.** Cite no work as a text's witness unless ≥1 *evaluated content field* matches it — a reference merely listed in `scripts/collate_corpus.py`'s `WITNESS` map is a bibliographic pairing, not collation evidence. `dahui_hongzhi`'s T48n2001 pairing is the current recorded exception; see **Immediate next task** below.
2. **Representation never establishes completion.** Only explicit editorial `completion_status` counts and `scripts/validate_data.py` is the spec (invariant 2 of `## Architectural Invariants` above): N/N unit representation proves nothing, and `complete` ⇔ `complete_selected_witness` + `collated_to_claimed_witness`.
3. **Source collation does not approve reuse.** Edition verification and rights review are separate ledgers tracked separately everywhere; all 14 `rights_manifest.json` sources still await human/jurisdiction review, and no W1 status is a rights decision.

Measured baseline on that commit — reproduce it, do not copy it:

```bash
python3 - <<'PY'
import json
c = json.load(open('data/project_metrics.json'))['corpus']
sr = c['source_review']
man = json.load(open('data/corpus_manifest.json'))['items']
print('corpus documents', c['documents'], '| incomplete', c['incomplete_documents'],
      '| complete_selected_witness', sum(1 for i in man if i['completion_status'] == 'complete_selected_witness'))
print('source-content CJK', c['content_cjk_characters'], '| all-string CJK', c['all_corpus_cjk_characters'])
print('authoritative register', sr['authoritative']['register_path'], '| flagged', sr['authoritative']['flagged_entries'],
      '| evidence', sr['authoritative']['evidence_date'], '| statuses', sr['status_counts'])
print('superseded 2026-09-09 pair: register', sr['historical']['flagged_entries'],
      '| report', sr['superseded']['report_flagged_total'], '| status', sr['superseded']['status'])
r = json.load(open('sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json'))
a = r['aggregate']
print('dated measurement 2026-09-12 (not a re-designation): flagged', a['flagged_entries'],
      '| collating content fields', a['content_fields_collated'], '/', a['content_fields_total'],
      '| documents_with_changed_status', r['reproduction']['documents_with_changed_status'])
PY
```

```text
corpus documents 35 | incomplete 35 | complete_selected_witness 0
source-content CJK 104564 | all-string CJK 110252
authoritative register sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json | flagged 630 | evidence 2026-09-10 | statuses {'collated_to_claimed_witness': 1, 'partial_or_failed_w1_collation': 32, 'witness_unavailable': 2}
superseded 2026-09-09 pair: register 622 | report 637 | status superseded
dated measurement 2026-09-12 (not a re-designation): flagged 532 | collating content fields 691 / 924 | documents_with_changed_status 0
```

Provenance-label census on the same commit — **50** `*_note` strings, of which **39** render beside a passage (`cbeta_note` 17, `editorial_note` 8, `recension_note` 14) while the **11** `coverage_note` strings stay exempt by recorded design, and **23** documents carry at least one rendered label (script printed at `vision.md:61`-`:82`):

```text
rendered=('recension_note', 'editorial_note', 'cbeta_note') call_sites=17 exempt=['coverage_note']
per-key: {'cbeta_note': 17, 'editorial_note': 8, 'coverage_note': 11, 'recension_note': 14}
ORPHANS: none — every key is rendered or exempted
asserted: 39 of 50 note strings render beside a passage
```

Document-level and string-level counts are different units and must not be swapped: `cbeta_note` 17 documents / 17 strings (they coincide), `editorial_note` 5 documents / 8 strings, `recension_note` 1 document (`platform_sutra`) / 14 strings, `coverage_note` 11 documents / 11 strings — 23 documents with no overlap, 50 strings.

- **Orchestrator branch:** `arena/01a08e15-translatechan` — the prompt **distribution channel**. The orchestrator publishes prompt files and its working state to it; it never merges into `main`, is never a PR base, and **no coding agent ever pushes to it or bases from it** — a cold start fetches *from* it and works on the session branch the platform fixed. Tip when this section was written: `35021d04dd0c5a1113991e18413dccfbe67b72d8`.

  ```bash
  git ls-remote origin refs/heads/arena/01a08e15-translatechan
  # 35021d04dd0c5a1113991e18413dccfbe67b72d8	refs/heads/arena/01a08e15-translatechan
  ```

- **How to resume:** two commands, run from a clone of `main`. A single-branch clone has **no** `origin/arena/01a08e15-translatechan` ref and `FETCH_HEAD` is not a durable handle, so use the explicit refspec form; then read the prompt out of the fetched ref instead of checking the branch out.

  ```bash
  git fetch --depth 1 origin +arena/01a08e15-translatechan:refs/remotes/origin/_orch
  git show refs/remotes/origin/_orch:.orchestrator/prompts/<NNN>-<slug>.md > /tmp/task.md
  ```

  Both forms were run in the session that wrote this section, against a real prompt: `git show refs/remotes/origin/_orch:.orchestrator/prompts/014-citation-fixes.md` → 242 lines, first line `# Task 014 — Stop saying six false citations: align the public claims with what the collation actually tested`. The fetched prompt is the task; if it and a chat stub disagree, the fetched file wins. `/tmp/task.md` is scratch and is never committed. A successor **copies the prompt set and the working state forward** — new prompts go into the same `.orchestrator/prompts/` index, continuing its numbering; never start a second index, never renumber an existing prompt, and never re-dispatch a merged prompt as if it were new.

- **Prompt inventory:** every prompt published on the channel at `35021d0`, one line each — `NNN · title · PR · state`:

  ```bash
  git ls-tree --name-only refs/remotes/origin/_orch .orchestrator/prompts/
  # → 16 files: 002, 003, 004, 005, 006, 007a, 007b, 008, 009, 010, 010b, 011, 012, 013, 014, 016
  ```

  - `002` · Retire the repository scoreboard (`.scoreboard/` + `SCOREBOARD.md`, relocate the workflow-edit record) · PR #31 · merged 2026-09-11
  - `003` · Re-key `linji_yulu`'s W1-flagged content fields to T47n1985 (Wave 1, document 3) · PR #32 · merged 2026-09-11
  - `004` · Tracker and comment drift after the scoreboard removal (docs-only) · PR #33 · merged 2026-09-11
  - `005` · Re-key `xinxin_ming` to the T48n2010 witness (Wave 1, document 4) · PR #34 · merged 2026-09-11
  - `006` · Independent witness inventory, family 1 (T47 recensions) · PR #35 · merged 2026-09-11 — its `.orchestrator/WITNESS_INVENTORY.md` rode in #35 alongside task 009 (commit `654189a6`)
  - `007a` · Independent witness inventory, family 2 (T45/T48/T51 + the witness-unavailable pair) · PR #36 · merged 2026-09-11
  - `007b` · Independent witness inventory, family 3 (X-series witnesses) · PR #36 · merged 2026-09-11
  - `008` · Consolidate the three witness inventories into one Phase-2 decision instrument · PR #37 · merged 2026-09-12
  - `009` · `platform_sutra`: label the recensions honestly (Dunhuang-primary ruling, label-only) · PR #35 · merged 2026-09-11
  - `010` · Align the vision and roadmap documents to the measured status quo · PR #38 · merged 2026-09-12
  - `010b` · Bring the status documents to today: `README.md`, `AUDIT.md`, `HANDOFF.md` · PR #39 · merged 2026-09-12
  - `011` · Make the provenance labels visible: render every note the corpus carries · PR #40 · merged 2026-09-12
  - `012` · Publish the post-remediation evidence pass (a new dated record, no re-designation) · PR #41 · merged 2026-09-12
  - `013` · Say what shipped: close the presentation and register claims `main` still lists as owed · PR #42 · merged 2026-09-12
  - `014` · Stop saying six false citations: align the public claims with what the collation tested · PR #43 · merged 2026-09-12 (this is `main` = `1b41d0b`)
  - `015` · **not published** — no `015-*` file exists on the channel at `35021d0`; the gap is measured, not assumed, and the index is not renumbered to close it
  - `016` · Make `main` cold-startable: this Continuation block · the PR that adds this section · open when this was written

  Two pairs of prompts shipped in one PR each (`006`+`009` in #35, `007a`+`007b` in #36); that is recorded here so a successor does not hunt for a missing PR.

- **Immediate next task — `014b`, the two follow-ups PR #43 left open.** Both are disclosure work: neither re-keys a character of source text, and neither moves a status.

  1. **Sync the stale provenance-label census.** Nine lines still assert **49 / 38 / 22 / 16** (note strings carried / strings rendered beside a passage / documents carrying a label / `cbeta_note` count) where `main` now measures **50 / 39 / 23 / 17**: `ROADMAP.md:163` and `:179`, `vision.md:57`, `:59`, `:88`, `:90` and `:327`, `RESEARCH_RELEASE_PLAN.md:32` and `:103`. The +1 is PR #43's own `zhaozhou_yulu` `cbeta_note` — that document carried only `coverage_note` at `77b4039`, so one added note moved all four figures at once. `ROADMAP.md:161` is already correct (**23** documents, `cbeta_note` 17 + `editorial_note` 5 + `recension_note` 1, no overlap) and must not be "fixed" back. The 11 `coverage_note` strings stay an explained exemption, so the honest sentence remains "**39 of 50** render beside a passage", never "all 50". `vision.md:88` and `:90` sit **inside a `text` block of measured output** (`vision.md:86`-`:91`, printed by the script at `:61`-`:82` and introduced at `:84` as what that script prints on `main`) — they must be **regenerated by re-running that script**, not retyped, and the date on `:84` moves with them.
  2. **`data/corpus/dahui_hongzhi.json` disclosure.** PR #43 corrected the *manifest* row (`data/corpus_manifest.json` → `cbeta`: `T1998A / T1998B + T48n2001 (宏智禪師廣錄, 默照銘)`) and did not touch the document, so document and manifest now disagree. The document's `cbeta_note` still reads "dropped unverified '/T2001' pairing" and must disclose that the T48n2001 pairing is **bibliographic** — it comes from `scripts/collate_corpus.py`'s witness note, "Hongzhi's Mozhaoming lives in T2001 Hongzhi guanglu, not claimed T1998A" — and that **0 of 6** evaluated content fields collate in any of the three witnesses (invariant 1 above: a probe is not a collation). `cbeta_id`, currently `T1998A (大慧普覺禪師語錄)`, must either name all three works (T47n1998A, T47n1998B, T48n2001) or state that it covers the 看話書問 letters only.

  ```bash
  grep -n "of the 49\|49\*\* provenance\|22 documents carry\|cbeta_note\` in 16\|cbeta_note\` 16" ROADMAP.md vision.md RESEARCH_RELEASE_PLAN.md
  grep -n "cbeta_note': 16\|38 of 49\|provenance labels in \*\*22\*\*" ROADMAP.md vision.md RESEARCH_RELEASE_PLAN.md
  # → ROADMAP.md:163,:179 · vision.md:57,:59,:88,:90,:327 · RESEARCH_RELEASE_PLAN.md:32,:103
  python3 -c "import json;d=json.load(open('sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json'))['documents']['dahui_hongzhi'];print(d['witness'],d['content_fields_collated'],'/',d['content_fields_total'],d['witness_note'])"
  # → ['T47n1998A', 'T47n1998B', 'T48n2001'] 0 / 6 Hongzhi's Mozhaoming lives in T2001 Hongzhi guanglu, not claimed T1998A.
  ```

- **Owner rulings in force — the four 2026-09-12 rulings, recorded above under `## Standing Decisions (2026-09-12, owner — four rulings; executed by PR #43)` and still binding on every successor:**

  - **Ruling 1 — the six `CITATION` rows ship in ONE PR** (executed by PR #43). *Forbids* batching any other remediation class into that PR: `RE-KEY` and `LABEL` work stays one document per PR, unchanged.
  - **Ruling 2 — the ledger stays as it is.** `630` remains the authoritative register figure and the 2026-09-12 post-remediation record stays a dated measurement beside it. *Forbids* re-designation: no `scripts/w1_evidence.py` or `FIXED_METADATA` change, and no retiring the pinned `630` sentences — converting the fixed historical/overlay pair into a chain is its own owner-ruled change.
  - **Ruling 3 — fabricated or unsupported text is replaced with real source text where the pinned witness carries it, and labelled where it does not.** *Forbids* re-pointing a withdrawn claim at an unverified candidate: in PR #43 the false T1987 claim on `zhaozhou_yulu` (T1987 is the Caoshan record) was **withdrawn**, not re-pointed, because X68n1315 probes at only 2 of 19 evaluated content fields, the document went to the human-sourcing queue, and no field was re-keyed.
  - **Ruling 4 — `OUT-OF-CBETA` sourcing is human work.** *Forbids* any agent fetch, transcription or evaluation of the witnesses in the 31-document human-sourcing queue (`.orchestrator/PHASE2_PLAN.md` §7); agents may only work the label/citation rows already assigned.

- **Frozen surface — none of this is "improved" inside a continuation PR:**

  - **The five quality gates pass before every push** (CI runs the same set): `python3 -m py_compile scripts/*.py` · `python3 scripts/validate_data.py` · `python3 scripts/build_data_bundle.py` · `node scripts/smoke_test.mjs` · `diff -rq data docs/data`.
  - **Never edit the checker to make a gate pass.** When a gate and the prose disagree, the prose is wrong: fix the document, not `scripts/validate_data.py`, `scripts/test_source_review_rules.py` or `scripts/test_source_preservation.py`. If a gate ever demands an out-of-scope edit, stop and report it — the rule as applied in `.orchestrator/PHASE2_PLAN.md` §6(a)3 is "fix the prose, not the checker".
  - **`docs/` is generated.** `docs/app.css`, like every `docs/` mirror path, is rewritten only by `scripts/build_data_bundle.py` (its mirror list, `scripts/build_data_bundle.py:104`); hand-editing a `docs/` file is editing a build artifact at the wrong end, and a prose PR that moves `docs/index.html` has edited the wrong file.
  - **Internal identifiers stay:** `translatechan_*` localStorage keys, `window.TranslateChan`, `TRANSLATECHAN_DATA`; the public brand is "Fake Chan Factory" and the humor-forward tone stays.
  - **Public scope is exactly 5 rooms** (Reader, Comparative Matrix, Lineage, Gong'an Index, Chan Lexicon) and is smoke-guarded; Translation Studio, Arena AI Agents and the header GitHub link stay out.
  - **`sessions/*` is append-only:** dated evidence is never edited or deleted — a new dated record supersedes an old one. No `.github/workflows/*` edit without explicit owner approval; `OPERATIONS.md` is the only register of owner-controlled GitHub-side changes.

  ```bash
  ls scripts/        # __pycache__/ also appears locally; it is gitignored, not a tracked tool
  # arena_agent_pipeline.py  browser_test.mjs  build_data_bundle.py  collate_corpus.py  collate_refs.py
  # compat_runtime_check.mjs  ingest_cbeta.py  migrate_translations.py  segment_classical.py
  # smoke_test.mjs  source_review.py  test_source_preservation.py  test_source_review_rules.py
  # validate_data.py  w1_evidence.py            # = git ls-files scripts/, 15 tracked tools
  ```

- **Open environment hazard (Arena sandbox):** the sandbox can rewind the worktree to an old SHA and can drop GitHub credentials mid-session. Neither event is lost history and neither is a licence to reconstruct state from memory: before concluding that a commit or a branch is gone, confirm with `gh api repos/56eli/translatechan/commits/<sha>` and `git ls-remote origin refs/heads/<branch>` — and remember a `--depth 1` clone legitimately shows one commit. Never `git pull` to fix a rejected push: a non-fast-forward rejection is a base mismatch, so halt and report the raw text, then sync with `git fetch --depth 50 origin +main:refs/remotes/origin/main && git merge --no-edit origin/main`. Never force-push, never pass `--allow-unrelated-histories`, and never commit on `main`. If a push fails on auth or network, report it, keep working locally and retry at the next checkpoint — never claim pushed what is not on the remote.

## Known Gaps

- Per-document source remediation remains pending under the adopted hybrid R-A/R-B/R-C policy; the public status model prevents unsupported completion claims from being presented as verified and does not re-key source text.
- Real-browser screenshot/accessibility evidence for the current design is unavailable (Chromium network failure `ECONNRESET` in the 2026-08-11 session); do not describe the design as screenshot-verified.
- Branch protection on `main` unconfirmed (integration endpoint returns 403).
- 30/30 lineage edges remain `traditional_link_pending_exact_locator`; lineage corpus-key curation is complete for the recorded six-profile scope, while later exact-locator work remains.
- JSON Schema in `schemas/` is declarative only; the Python validator is the enforced contract.
