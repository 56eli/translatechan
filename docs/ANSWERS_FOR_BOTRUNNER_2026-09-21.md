# Answers for Botrunner — Open Questions R2–R7 — Plain Language + Recommendations

**From:** translatechan orchestrator (Role 1) + owner answers 2026-09-21
**To:** botrunner orchestrator (Role 2) via owner
**Base:** main 78e7495 (44 docs, 10 collated, 4,192 locators, 8,826,431 B bundle, lineage 31 edges =20 exact+11 source =31/31 verified 0 pending, 4 frontiers derived from masters.json unchanged, masters 35 linked 33 unlinked 2 intentional yangqi+dahong, P2 Tier2 12 docs below 80% bar labels landed, all-encompassing roadmap 102 masters snapshot NOT exhaustive target 150-200 disclaimer 2026-09-21)
**Consumer doc:** TC-EXPORT-CONSUMER-REQUIREMENTS.md 2026-09-21
**Charter:** ROLE_CHARTER_nonduality_wiki_2026-09-20.md — translatechan database + gate, botrunner LOSSLESS middleman, owner holds secrets and merges.

---

## Q1 — Which entity types become books, chapters, pages? — CONFIRMED by owner

**Answer:** work=Book, fascicle=Chapter, passage=Page

**Plain:** Every corpus JSON file (e.g. `wumenguan` The Gateless Gate) becomes a BookStack **Book**. If that work has fascicles inside it (e.g. `chuandenglu_full` has 30 fascicles, `congronglu` has no fascicles but 100 cases), each fascicle becomes a **Chapter**. Every smallest readable unit inside — a case, a section, a dialogue, a stanza, a chapter entry — becomes a **Page** whose parent is the Chapter (or chapterless Page under Book if work has no fascicles). Example: `wumenguan` 48 cases → 48 Pages chapterless or under Chapter "Cases". `chuandenglu_full` case 128 洪州百丈山懷海禪師 fascicle 6 → Book `chuandenglu_full`, Chapter `Fascicle 6`, Page `Case 128 Baizhang Huaihai`.

We will add stable ids to every passage (e.g. `wumenguan_case_01`) plus explicit `type` (work, fascicle, case, section, dialogue, stanza, chapter), `parent_id` by id, `order` integer (R8) so you can map mechanically without heuristics. Mapping rule doc will be in schema.

---

## Q2 — What is the complete set of W1 codes, and what should each render as?

**Plain language — what collation means + what is a claimed witness:**

Your understanding is right: collation means our Chinese corpus correlates to Chinese woodblock prints, which are the authority of our work.

**Claimed witness = the specific old print we claim we copied from.**

For every fascicle/file we say: "This text is supposed to be exactly this old book, this edition." Example:

- `wumenguan` claims witness `T48n2005` Wumenguan — Song dynasty woodblock preserved in Taisho canon vol 48 no 2005, digitized as CBETA XML P5 revision `dbdea410`
- `chuandenglu_full` claims witness `T51n2076` Jingde Chuandenglu — Song 1004, 30 fascicles
- `linji_yulu` claims witness `T47n1985`
- `huangbo_yulu` claims witness `T48n2012A` + `X69n1360` (X = Xuzangjing, supplement)

That claimed witness is our authority. We publish its key in the file: `source_id: jingde-chuandenglu`, `source_edition: T51n2076`, `witness_path: T51n2076.xml`, `extraction_rule: cbeta-p5-body-cjk-v1`.

**Collation = proving the claim.** We take our field's CJK (e.g. dialogue zh), normalize it by rule `cbeta-p5-body-cjk-v1` (TEI body only, drop notes/g, keep only CJK U+3400-U+9FFF/U+F900-U+FAFF, NFC), and search for contiguous runs ≥8 chars inside the claimed witness's normalized body. If every content field appears verbatim as contiguous run, it's EXACT. If not, it's DIVERGENT, NOT_FOUND, etc.

So:

- **Claimed witness** = which old woodblock we say we are reproducing (the source of truth).
- **Collation** = mechanical proof that we actually did reproduce it character-for-character.
- **collated_to_claimed_witness** = proof succeeded 100% for content fields — our text = old print.
- **partial_or_failed_w1_collation** = proof failed — our text is NOT in that old print, it's our own retelling/composition, we label it honestly with coverage_note like `s1.d0 24/34 @60,222` (24 of 34 chars found at offset 60,222) + editorial_note "Project retelling — no witness attribution".
- **witness_unavailable** = we don't even have that old print digitized to check.

That is why `collated_to_claimed_witness` = 100% real old text, partial = hallucinated/project retelling.

**Original collation detail preserved:**

Collation checks character by character against CBETA XML P5 edition `dbdea41071e1e260ad84b72faefd4587333cf76d`. Rule `cbeta-p5-body-cjk-v1` takes TEI body, drops footnotes/apparatus, keeps only CJK, writes one line. Collator looks for contiguous runs ≥8 chars. If verbatim contiguous run found, EXACT.

**Complete set of W1 codes (source_review_status):**

From `scripts/source_review.py` — closed enum, never hand-entered, derived from register evidence:

1. **`collated_to_claimed_witness`** — Label: "Collated to claimed witness" — Means: we have the claimed witness text in our pinned reference set (e.g. T48n2001 for Hongzhi, T51n2076 for Chuandenglu), and **every** source-content field (zh, verse_zh, commentary_zh, pointer_zh) in this document is EXACT or REWORDED verbatim in that witness — no uncollated content fields. Metadata fields title_zh/name_zh are measured separately and excluded, so this never claims metadata was collated, and it never approves reuse. This is **100% collation** for content fields.

2. **`partial_or_failed_w1_collation`** — Label: "Partial or failed W1 collation" — Means: claimed witness present in reference set, but at least one content field is NOT collated (NOT_FOUND, DIVERGENT, MINOR etc). Example: `dazhu_huihai` 0/6 EXACT, `guiyang_yulu` 0/6, `fayan_yulu` 1/11 EXACT, `baizhang_guanglu` 0/6. These are **project retellings/compositions**, not direct excerpts — wording is ours, not verbatim from old text. They have honest `coverage_note` with per-field run measurements like `s1.d0 24/34 @60,222` (24 of 34 chars found at offset 60,222 in uncited X80n1565) and `editorial_note` "Project retelling — no witness attribution".

3. **`witness_unavailable`** — Label: "Witness unavailable — not collated" — Means: no claimed witness text in reference set at all — we don't have the source file to check. Example: some Dunhuang manuscripts not in CBETA.

**Completion statuses (separate ledger):**

- `complete_selected_witness` — editorial claim that work is complete representation of selected witness — only allowed when W1 is collated_to_claimed_witness (rule enforced in source_review.py + mirrored in app.js + smoke test). If incompatible (complete claim but partial collation), it degrades to partial_selected_witness everywhere but validator still rejects data.
- `partial_selected_witness` — partial representation
- `excerpt_seed` — excerpt seed, not complete

**Collation classes (per field, fixed order):**

- EXACT, REWORDED — collated classes (count as collated)
- MINOR, DIVERGENT, NOT_FOUND, TITLE_COMPOSITE, SHORT_UNMATCHED, WITNESS_UNAVAILABLE, EMPTY — non-collating finding grades

**Lineage statuses (separate ledger):**

- `exact_locator_verified` — we found exact lb range T51n2076_pXXXX–pYYYY + verbatim Chinese quote in pinned witness
- `source_verified` — we found fascicle/page-line reference (e.g. fasc 11 0287a24) but not exact lb range, or X-series witness like X80n1565
- `traditional_link_pending_exact_locator` — traditionally master A taught B but exact page not yet found — pending
- `disputed`

**Profile statuses:**

- Seed profile pending exact locator
- Frontier profile — no exact biographical/source locator recorded
- Frontier profile — reviewed; exact source locator still pending
- Frontier profile — exact corpus entry located; biography and teacher frontier remain unverified

**Disclosure ledgers (5 separate blocks, must stay visibly separate per source_review.py, app.js labels each with data-ledger, smoke test requires all 5):**

- source_collation (W1)
- represented_units
- translation_edition_verification
- canonical_locator
- rights_review

Ledger separation note: "Separate ledgers: none of these answers implies another."

**What should each render as on wiki:**

- W1 badge must show machine code + label + explanation, never paraphrase that upgrades claim. Example: Page shows badge "Collated to claimed witness (collated_to_claimed_witness) — 6/6 content fields EXACT in T51n2076, 0 flagged, evidence sessions/COLLATION_REGISTER_...json" with link to register.
- For partial: badge "Partial or failed W1 collation (partial_or_failed_w1_collation) — 0/6 EXACT, project retelling, no witness attribution, retained with honest coverage_note, see coverage_note for per-field runs" + coverage_note rendered verbatim.
- For unavailable: badge "Witness unavailable — not collated (witness_unavailable) — no reference text in pinned set to check".
- Lineage edge badge: "exact_locator_verified — T51n2076_p0249b26–p0250c26 fasc 6 洪州百丈山懷海禪師 case 128 — verbatim 即有溈山黃蘗當其首"
- If unknown code appears, importer must fail loudly, never default to reassuring badge. A page must never display better evidence state than data says, including through bugs.

**Owner answer to "I only want 100% verified stuff on wiki, rest as research projects, scared rest is hallucinated — is assessment reasonable?":**

**Yes, very reasonable, and aligns with headline "The old texts are real; the translators are not."** 

100% collation IS possible for every text IF we have its witness in CBETA and we re-key verbatim from that witness (like we did for 6 enthusiast fulls: Huangbo 19 units, Mazu 35, Yunmen 776, Dongshan 322, Zhaozhou 80, Dahui 1,354 = 2,586 units 302,592 CJK 5,178 EXACT 93.8% collation, plus congronglu 100 cases 500/500 EXACT, chuandenglu_full 1,274 units 2,549 EXACT, caoshan_benji 84 units 169 EXACT). Those 10 docs are 100% real old texts, not hallucinated.

The other 32 partial docs (baizhang_guanglu 0/6, dazhu_huihai 0/6, nanquan_yulu 0/6, guiyang_yulu 0/6, fayan_yulu 1/11, xuansha_yulu 0/5, xuefeng_yantou 0/4, deshan_yulu 0/6, etc) ARE hallucinated/reconstructed/project compositions — we measured 0/6 EXACT in 43 pinned refs (43 verified /0 drift), largest shared run 23/27 or no run ≥8. They have honest coverage_note saying "project retelling — no witness attribution" and editorial_note R-B labels. They should NOT be on public wiki as if real; they should stay as research projects, or be flagged with W1 badge partial_or_failed and maybe private.

**Owner ruling 2026-09-21 update (Q7 W3): Wiki receives ONLY 100% collated docs. Everything not 100% will NOT be exported at all. No imperfections on the wiki.**

**Recommendation now locked:** Wiki shows ONLY `collated_to_claimed_witness` docs as public Books/Pages. The 32 partial docs stay in translatechan as research projects, **not exported to BookStack at all**. No private "Research Projects" Shelf on wiki. Wiki = 100% real old texts only. This is simplest and avoids any risk of hallucinated text being cited.

---

## Q3 — What does absence from an export mean? (R7) — Owner confirms tombstones

**Plain:** If a book disappears from export, is it deleted, hidden, moved, or bug?

**Answer:** tombstones confirmed.

**Implementation:** Add lifecycle_status enum: active, withdrawn, superseded, retracted_pending_review + superseded_by id pointing to replacement. Entity stays in export with status withdrawn/superseded, not vanish. Absence alone never means deletion — botrunner default never deletes published page on basis of absence alone, reports absences as warnings until TC tells what absence means. We will add `lifecycle_status` field to every entity, plus `export_manifest.json` with files list checksums so botrunner can prove complete export not half-written.

---

## Q5 — Does any content need to be non-public at page granularity, or whole wiki public-read? — Owner consideration, not decided

**Plain:** Is everything allowed to be public on internet, or are some pages supposed to be hidden/private/embargoed?

**Owner answer 2026-09-21: Consideration only, not decided.** If maintenance burden isn't too high, want copyrighted material flagged as such and leave it up to me to change access as I see fit based on flags provided. Might make everything private with wiki account access only even. Proposal below is consideration, not ruling.

**Elaboration (consideration):** So we need per-page visibility control based on flags, but owner hasn't decided to use it yet.

**Current:** Charter says public read, owner-locked write, no embargoed material currently. But English translations have rights_status: in_copyright, public_domain_candidate, needs_review. And is_ai_styled boolean.

**What botrunner could do if owner decides (consideration, not requirement):**
- Add tags per page: W1 badge, source key, rights_status, is_ai_styled, lifecycle_status, plus maybe `copyrighted` boolean.
- For BookStack, pages have permissions — can be public or private or restricted to role.
- Consideration: Every page gets tags: `rights_status=in_copyright|public_domain_candidate|needs_review`, `is_ai_styled=true|false`, `w1_status=collated_to_claimed_witness|partial|unavailable`, `lifecycle_status=active|withdrawn|superseded|retracted`. Then BookStack Shelves: public Shelf "Verified Chan Texts (100% collated)" with only collated_to_claimed_witness and public_domain_candidate or is_ai_styled true (Robo fake is ours, not copyrighted), and maybe private Shelf "Copyrighted English References" with in_copyright flagged.
- Owner could make whole wiki private with wiki account access only — BookStack supports private Shelves/Books requiring login.
- Maintenance burden: low if flags are machine-readable — botrunner can set BookStack permissions based on flags mechanically, e.g. if rights_status=in_copyright then Book private, else public. Owner can override.

**But per Q7 W3 ruling:** wiki receives ONLY 100% collated docs, no imperfections. So Q5 flags would only apply to that 100% subset. Since those are old texts (public domain) plus our AI-styled English (ours), likely all can be public, but we still emit rights_status for future audit.

**Recommendation (consideration):** Add `rights_status` and `visibility` fields to export per R4 + R5 as metadata, even if wiki stays all-public for now. Botrunner importer reads flags but does not need to enforce private yet. If owner later decides private wiki, flags already present, no schema change needed. Provide dry-run diff so owner can see what would be public vs private before import.

---

## Q6 — Is corpus append-mostly or revised often? — Affirmed both

**Owner affirms:** Currently it's both: we added 6 new full-witness docs (append) + revised 6 Tier2 docs for labels (revisions). So answer: append-mostly plus revisions — importer must be idempotent keyed by stable id, re-running updates same page, never duplicates.

**Plain:** Do we mostly add new books or often edit existing books? Both. We added 38→44 docs (append), and we revised existing docs for authenticity labels (Baizhang, Huangbo, Dazhu, Nanquan, Guiyang, Fayan, Deshan, Xuansha, Xuefeng, Yuanwu, Foyan, Caoxi) with 0 unauthorized but permitted allowlisted changes (465 permitted /0 unauthorized vs base 3cc7a8e). So importer should optimize for updates: keyed by stable R1 id, re-running updates same page, never creates second page, keeps edit history. If title changes, id stays same, so no duplicate. That's why R1 stable id is most important.

---

## Q7 — Make some recommendations

**Recommendations for botrunner technical assessment — translatechan lane (owner approves wave):**

1. **Export manifest + sample:** Publish `export_manifest.json` with schema_version (e.g. 1.1), export_timestamp ISO8601, commit git rev-parse HEAD (78e7495), files array with path, sha256, size, plus ready marker `export_ready.json` written last for atomicity (R12). Provide sample export JSONL (one record per line, easiest to diff/stream) with 5 masters +5 passages including all required fields: id stable immutable never reused (R1), type (work, fascicle, case, section, dialogue) + parent_id by id + order integer (R2,R8), w1_status {code, label, explanation} closed enum (R3), provenance {source_key, source_edition, translator, edition_date, is_ai_styled boolean, import_reference} (R4), lang {zh-Hant, zh-Latn-pinyin, en} + script + transliteration_scheme (R11), body_format declared plain text/Markdown subset no arbitrary HTML (R9), cross-refs by id (R10), lifecycle_status active/withdrawn/superseded/retracted_pending_review + superseded_by (R7), rights_status + visibility flag (R5 answer).

2. **Schema doc + changelog:** Publish `docs/SCHEMA.md` or `schemas/translatechan-data.schema.json` with all enums documented: VALID_SOURCE_REVIEW_STATUSES (collated_to_claimed_witness, partial_or_failed_w1_collation, witness_unavailable), VALID_COMPLETION_STATUSES (complete_selected_witness, partial_selected_witness, excerpt_seed), VALID_LINEAGE_EDGE_STATUSES (exact_locator_verified, source_verified, traditional_link_pending_exact_locator, disputed), profile_status enum, editorial_note types, disclosure ledgers 5, collation classes 9, plus mapping rule work=Book fascicle=Chapter passage=Page (Q1 confirmed), plus BODY_FORMAT.md (plain CJK + Markdown subset bold/italic/code/links, no arbitrary HTML, footnotes as separate field, Unicode NFC), plus GATE.md (exact command `python3 scripts/validate_data.py` exit 0 safe non-zero do not publish read-only, plus `build_data_bundle.py` determinism check, needs checkout + Python 3.11). Changelog CHANGELOG.md with version bumps.

3. **W1 filtering for wiki — LOCKED per owner ruling Q7 W3:** Wiki receives ONLY 100% collated docs (`collated_to_claimed_witness`). Everything not 100% will NOT be exported at all. No imperfections on the wiki. No private "Research Projects" Shelf on wiki. Translatechan keeps 32 partial docs as research projects locally, never emitted in export. Export manifest lists only 10 collated docs. Botrunner importer can still have config `only_collated=true` but export already filtered — defense in depth: importer must fail if it ever sees partial_or_failed_w1_collation.

4. **Rights + visibility flags — Consideration only:** Add rights_status per unit (in_copyright, public_domain_candidate, needs_review) + is_ai_styled boolean + visibility suggestion as metadata, even if wiki stays all-public for now. Since only 100% collated old texts (public domain) + our AI-styled English (ours) are exported, likely all public. But emit flags for future audit. If owner later decides private wiki, flags already present. Provide dry-run diff before import so owner can see what would be public vs private. Owner has not decided, so this is consideration, not requirement.

5. **Tombstones (R7):** Implement lifecycle_status tombstones, never delete on absence alone. Export manifest with checksums proves complete export not half-written. Botrunner reports absences as warnings.

6. **Idempotency (R1+R2+R8):** Add explicit edge id to lineage edges (e.g. id = f"{teacher}_{disciple}"), stable passage ids (e.g. wumenguan_case_01), explicit type, parent_id, order integer. Ensure re-running import updates same page, never duplicates, even if title corrected.

7. **Gate as precondition (R6):** Botrunner runs `python3 scripts/validate_data.py` first, exit 0 safe to publish else import nothing, captures output for import report, read-only promise. Secondary gates build_data_bundle.py determinism and smoke_test.mjs optional.

8. **Sample worth more than spec:** Per consumer doc §7, publish 5 records + paragraph explanation, then botrunner writes importer as normal task: prompt published, one agent, one PR, gates-first, idempotent, provenance stamped (source key + W1 badge + import reference commit+timestamp), dry-run mode first.

**What is NOT asked for (per §5) and we will NOT do in translatechan lane:**
- Not BookStack-shaped export — we export domain, botrunner does mapping
- Not presentation decisions — layout, ordering-for-effect, SEO titles, theme — botrunner lane
- Not credentials — never hold secrets, owner applies
- Not performance work — volumes small
- Not delivery mechanism yet — owner decides release artifact, fetched file, manual copy

**Verdict:** Current exports 70% ready — R1,R2,R6,R10 mostly pass, R3-R5,R7-R9,R11-R12 need gaps closed via schema additions (edge id, passage id, w1_status explicit, is_ai_styled boolean, export_manifest with checksums+timestamp+commit+ready marker, tombstones, order, BODY_FORMAT, GATE, SCHEMA, CHANGELOG, lang). All gaps fixable without content changes, owner-approved wave.

*Botrunner lane advisory only — owner applies everything.*
