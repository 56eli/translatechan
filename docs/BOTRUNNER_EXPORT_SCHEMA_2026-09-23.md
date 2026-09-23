# Botrunner Export Schema — Design (2026-09-23)

**From:** translatechan (Role 1) — corpus and gates, content authority
**To:** owner (rulings) and botrunner (Role 2) via owner
**Status: DESIGN ONLY.** No exporter exists, no export was generated, no id was written into any file under `data/`. This document specifies the contract; implementation waits for the owner rulings in §8.
**Base:** `main` `b8472bd` — 17 corpus documents; source review: 13 `collated_to_claimed_witness`, 2 `partial_or_failed_w1_collation` (guiyang_yulu, fayan_yulu), 2 `witness_unavailable` (hanshan_poems, niutou_juezhu); 127 flagged fields; bundle `b68eb436ac8c847a0f92ec0dea8d0f74597aa8ee79778b5e5dfe8920bb9cdba7`, 8,143,493 bytes.
**Governs:** TC-EXPORT-CONSUMER-REQUIREMENTS R1–R12 as assessed in `docs/TC_EXPORT_CONSUMER_ASSESSMENT_2026-09-21.md`, answered in `docs/ANSWERS_FOR_BOTRUNNER_2026-09-21.md`, ruled by `docs/BOTRUNNER_REVIEW_2026-09-21_LAW.md` (owner ruling Q7 W3: the wiki receives ONLY 100%-collated material), superseding `docs/SCHEMA.md` v1.1 wherever this document is more specific.
**Why design-before-implementation:** the id scheme below fixes stable public identifiers for every passage in the corpus. Once botrunner publishes against them, a changed id silently re-points a live page or orphans it. The scheme is cheap to get right now and expensive to fix later; the owner rules first.

---

## 0. What is already settled (not re-derived here)

These are prior rulings this design implements, not open questions:

- Work = BookStack Book, fascicle = Chapter, passage = Page (owner, Q1). The wiki hierarchy is Shelf → Book → Chapter → Page, one level only.
- Wiki receives only `collated_to_claimed_witness` material; everything else is not exported at all (owner, Q7 W3). No "research projects" shelf.
- Official delivery is a git clone at the commit pinned in `export_manifest.json`; sha256 verification of every manifest file is mandatory; the gate is `python3 scripts/validate_data.py`, exit 0 = safe, non-zero = do not publish (`docs/GATE.md`).
- Idempotent import keyed by stable id; a title change never changes an id (Q6).
- A withdrawn claim is withdrawn, never re-pointed (Ruling 3, `docs/PROJECT_STATE.md` §3).
- Absence from an export never means deletion; retraction is a tombstone (Q3).
- Five disclosure ledgers stay visibly separate; source collation does not approve reuse (W1 ledger rule, `scripts/source_review.py`).

Everything below specifies the parts of R1–R12 that were still missing: passage ids, machine status at passage scope, the enforcement mechanism, edge ids, tombstone representation, the manifest field list, and exit codes.

---

## 1. Stable passage identifiers (R1, R2 — the core of this design)

### 1.1 What an id is

- An id is a **string**, lowercase letters, digits, and underscores: regex `^[a-z0-9_]+$`.
- Every exported entity and every dialogue subunit has exactly one id, assigned **once**, at its first appearance in a generated export.
- **Never reused.** An id that was ever assigned is reserved forever. Because tombstones never leave the export (§5), the export file set *is* the reservation ledger: an implementer checks "does this id exist in the previous export?" before assigning.
- **Never renumbered.** The digit part of an id is frozen at assignment. Later insertion, deletion, reordering, or retitling never changes any existing id. Ids of a container do **not** have to be contiguous.
- **Global uniqueness.** All ids across all record types (works, fascicles, passages, dialogue anchors, masters, edges) must be pairwise distinct within one export; the export builder refuses on collision. This is what makes the unprefixed edge form in §4 safe forever: a work key can look exactly like a `{teacher}_{disciple}` pair — the purged `bodhidharma_erru` proves the shape is reachable.

### 1.2 Grammar

```
work        {key}                                    e.g.  wumenguan
fascicle    {work}_fascicle_{nn}                     e.g.  chuandenglu_full_fascicle_06
passage     {work}_{container}_{seq}                  e.g.  wumenguan_case_01
dialogue    {passage}_dialogue_{dd}                  e.g.  wumenguan_case_01_dialogue_01
```

where `{container}` ∈ `case`, `section`, `stanza`, `preface`, `epilogue` — the literal name of the array in the corpus document; and `seq`/`nn`/`dd` are 1-based integers, zero-padded.

### 1.3 Derivation rule — exactly how `{seq}` is chosen, per real shape

The corpus currently has five passage-bearing shapes (verified against all 17 documents at `b8472bd`):

| Shape | Documents | Numbering field in data | Seq at first assignment |
|---|---|---|---|
| `cases` with `case_num` | wumenguan (48), biyanlu_cases (100), congronglu (100), chuandenglu_full (1,274), caoshan_benji (84), dahui_yulu_full (1,354), dongshan_yulu_full (322), huangbo_fayao_full (19), mazu_guanglu_full (35), yunmen_guanglu_full (776), zhaozhou_yulu_full (80) | `case_num`, currently contiguous 1..n in every one of these files | `case_num` of the entry |
| `stanzas` with `stanza_num` | zhengdao_ge (6), hanshan_poems (4) | `stanza_num`, contiguous | `stanza_num` of the entry |
| `sections` with `section_id` slug, no integer | linji_yulu (107), fayan_yulu (8), guiyang_yulu (3), niutou_juezhu (3) | none (`section_id` is a slug, not a number) | 1-based position in the `sections` array |
| `preface` / `epilogue` arrays, no numbering at all | wumenguan (`preface`: 2, `epilogue`: 5) | none | 1-based position in that array |
| `fascicle` grouping | chuandenglu_full (`fascicle` field on every case, 1..30, plus the `fascicle_structure` list) | `fascicle` integer | `fascicle` value, zero-padded to 2 digits |

After first assignment the rule changes: **a newly inserted passage takes `max(existing seq in that container) + 1`, never its array position.** Position determines `order` (§2.3), never `id`. Because today every `case_num`/`stanza_num` equals its 1-based array position, both readings coincide for this export — a convenient coincidence that must not be relied on for the next one.

`section_id` slugs (linji_yulu: 103 of 107 contain digits, 4 do not — `true_person_of_no_rank`, `four_shouts`, `conduct_record_biography`, `death_record`) are **not** ids. They are mutable content; they ride along as the `source_slug` alias on the record so a human can cross-check, but nothing keys on them.

**Padding.** `{seq}` is zero-padded to the width of the container's highest assigned id at that moment, minimum 2. Concretely: wumenguan pads to 2 (…`_48`), zhengdao_ge and guiyang_yulu also to the 2-digit minimum (`zhengdao_ge_stanza_01`), congronglu and linji_yulu to 3 (`congronglu_case_001`, `linji_yulu_section_078`), chuandenglu_full to 4 (`chuandenglu_full_case_1274`). If a container later grows past its width (say a 1,000th `congronglu` case), new ids simply use more digits (`congronglu_case_1000`); no existing id is ever re-padded, because an id is an exact string, not a rendered number.

### 1.4 Why array indices fail (what we are replacing)

Today a passage is identified by nothing more than "element 127 of `cases` in `data/corpus/chuandenglu_full.json`". Test that against the requirements:

- **Insertion.** Add one biography between `case_num` 127 and 128 of `chuandenglu_full` and every element from that point on shifts by one: index 127 becomes a different text, and 1,147 downstream pages are silently re-pointed. A stable id (`chuandenglu_full_case_0128`) survives because it was pinned to `case_num` at assignment, and a genuinely new passage gets `case_1275`, not a renumber.
- **Reordering.** If fascicles are ever re-flowed or a section is moved (e.g. `fayan_yulu` `stone_in_mind` swapped with `ten_rules`), positions change; ids do not.
- **Deletion/retraction.** Closing a gap silently repoints; leaving a hole confuses "removed" with "never existed". The lifecycle state (§5) says which it is, and the hole is proof of the first.
- **Addressability.** `cases[127]` is meaningless in a wiki URL, an import log, or a bug report; `chuandenglu_full_case_0128` cites one entity across the whole corpus without a document argument.
- **Cross-document collisions.** Every document has a "index 1"; ids are namespaced by work key and collide with nothing.

### 1.5 Worked examples — real data, real ids

**Simple document — `wumenguan` (無門關, T48n2005).** First array entry: `case_num` 1, `title_zh` 趙州狗子, `dialogue[0].speaker` `本則 / The Case`, one dialogue entry, plus `commentary_zh`, `verse_zh`, `locator`.

- Passage id: `wumenguan_case_01` (container `case`, seq = `case_num` = 1, width = digits of 48 → 2).
- Dialogue anchor: `wumenguan_case_01_dialogue_01`.
- Preface entry 1 (`title_zh` 禪宗無門關): `wumenguan_preface_01`; epilogue entries: `wumenguan_epilogue_01` … `wumenguan_epilogue_05` (array position; no numbering field exists).

**Nested document — `chuandenglu_full` (景德傳燈錄, T51n2076).** The entry at array index 127: `case_num` 128, `fascicle` 6, `kind` `biography`, `title_zh` 洪州百丈山懷海禪師, one dialogue entry, `locator` page/line anchors (`page_line` `0249b26`).

- Fascicle id: `chuandenglu_full_fascicle_06` (seq = `fascicle` field, 2 digits).
- Passage id: `chuandenglu_full_case_0128` (seq = `case_num` = 128, width = digits of 1,274 → 4).
- Parent: `chuandenglu_full_fascicle_06`; `order`: 16 (fascicle 6 carries `case_num` 113..130; 128 is the 16th of them). Note `case_num` is a *whole-work* counter — ids and `order` differ per level and neither is the array index of the file (file index 127 ≠ id 0128 ≠ order 16).
- Dialogue anchor: `chuandenglu_full_case_0128_dialogue_01`.

**Unnumbered sections — `linji_yulu` (T47n1985).** Section at array index 77: `section_id` `four_shouts`, `kind` `kanbian`, `title_zh` 師問僧有時一喝如金剛王寶…, `locator.reference` `T47n1985_p0504a26–p0504a29`.

- Passage id: `linji_yulu_section_078` (no integer field exists → 1-based position 78; width = digits of 107 → 3). This is the id already used in `docs/sample_export.jsonl` — the design confirms and freezes it.
- No fascicle level: `parent_id` is the work. `order` 78 happens to equal the id number *only because no insertion has occurred yet*.

**Stanzas — `zhengdao_ge` (證道歌, T51n2014).** First entry: `stanza_num` 1, `zh` 君不見：絕學無為閒道人…, `pinyin`, `translations.red_pine.status` `reconstruction_unverified`.

- Passage id: `zhengdao_ge_stanza_01`; parent `zhengdao_ge`; `order` 1.

---

## 2. Entity typing, hierarchy, and the BookStack mapping (R2, R8)

### 2.1 Closed `type` enum

Every export record carries `type` from exactly this set:

| `type` | Role | id container token | Can become a Page? |
|---|---|---|---|
| `work` | container: one corpus document | (the work key itself) | No — Book |
| `fascicle` | container inside a work | `fascicle` | No — Chapter |
| `case` | passage | `case` | Yes |
| `section` | passage | `section` | Yes |
| `stanza` | passage | `stanza` | Yes |
| `front_matter` | passage (a `preface` array entry) | `preface` | Yes (OQ2) |
| `back_matter` | passage (an `epilogue` array entry) | `epilogue` | Yes (OQ2) |
| `dialogue` | subunit inside a passage | `dialogue` | No — folded (§2.4) |
| `master` | lineage person (outside corpus lane) | n/a (data `id`, prefixed `master_`) | Not a corpus Page |
| `lineage_edge` | teacher→disciple claim | §4 | Not a corpus Page |

`type` is structural, never literary: the free-text `genre` field (all 17 documents carry a one-off prose `genre`, e.g. `Gong'an & Songgu`) is **not** a type and not an enum; it travels as metadata. A corpus shape that needs a new `type` value requires a schema-version bump and an owner ruling first — adding a silent value is forbidden.

### 2.2 `parent_id`

- `work`: `null`. The work is its own file; the manifest `items` list (17 entries keyed by `key`) is the only document inventory.
- `fascicle`: the work id.
- `case`/`section`/`stanza`/`front_matter`/`back_matter`: the fascicle id **iff** the unit carries an explicit `fascicle` integer (today: only `chuandenglu_full`, where every case has `fascicle` 1..30 and the document also carries `fascicle_structure` with `open_heading`/`close_heading`); otherwise the work id. Works whose *only* fascicle evidence is `kind: juan-head` / `kind: juan-close` marker entries inside the flat `cases` array (dahui_yulu_full 31 pairs, yunmen_guanglu_full, zhaozhou_yulu_full, dongshan_yulu_full, mazu_guanglu_full, huangbo_fayao_full) get **no** fascicle level in v1 — see OQ3; the markers are exported as ordinary passage records (`kind` preserved), so no information is lost, only grouping is withheld.
- `dialogue`: the containing passage id. Dialogue entries are never parentless.
- `lineage_edge`: `null`; its `teacher`/`disciple` fields are the hierarchy (§4).

Every non-null `parent_id` must resolve to a record id present in the same export — the builder refuses otherwise. The sample's known defect (its master record cross-refs `bodhidharma_erru`, a work purged on 2026-09-21 and absent from the current manifest) is exactly what this rule prevents.

### 2.3 `order`

Every record carries an explicit integer `order`, 1-based, consecutive among siblings sharing the same `parent_id`, computed at export time from current array positions. `order` may change between exports (insertion, re-flow); `id` may never. A consumer renders and sorts by `order`, keys and upserts by `id`.

### 2.4 The flattening rule

BookStack is one level deep below Book (Chapter → Page); the corpus nests up to four (work → fascicle → case → dialogue entry → translation variants; plus per-case `verse_commentary` objects and `translations` dictionaries). Rule, per level:

1. **work → Book, fascicle → Chapter, passage → Page.** Settled (Q1). Works without fascicles produce **chapterless Pages** directly under the Book — that branch is already in the owner's Q1 answer ("chapterless Page under Book if work has no fascicles"), so `wumenguan_case_01` lives directly under Book `wumenguan`. translatechan guarantees only id + `parent_id` + `order`; if botrunner later synthesizes an organizational Chapter for very large flat Books, that is presentation, and it must never change an exported `parent_id`.
2. **Dialogue entries fold into the Page body of their parent passage**, never a Page of their own. Each folded entry becomes a labeled block in the page, carrying: `speaker` (verbatim, e.g. `Emperor Wu / 梁武帝` in `biyanlu_cases`, `錄 / The Record` in `chuandenglu_full`), `zh`, `pinyin` when present (`wumenguan` dialogue entries have only `speaker` and `zh` — export omits the absent key, never invents an empty one), `translations` when present (`biyanlu_cases` dialogue entries carry a `translations` dict keyed by translator id, e.g. `red_pine`, `cleary`, `sasaki`, `suzuki`, each with `text` and `status`), and `editorial_note` when present (`fayan_yulu` 10 of 11 dialogue entries and `guiyang_yulu` all 6 carry one — a dialogue-level R-B label must travel, §3.5).
3. **Case-level composite objects fold the same way**: `verse_commentary` (congronglu: an object whose only key is `commentary_zh`) and flat siblings `verse_commentary_zh`, `pointer_en`, `verse_en` (biyanlu_cases) fold as labeled blocks. Their label is the source field name; never dropped, never paraphrased.
4. **Block order inside a page is the source JSON's own field order**, which is already the traditional reading order (title → 垂示/示眾 pointer → 舉 case text → 評唱 commentary → 頌 verse → commentary-on-verse `verse_commentary`). The exporter iterates source keys in document order; no separately invented ordering table exists to get wrong. `texts[]` (below) preserves this order as an array.
5. **Structural metadata that is not prose** — `kind` (`biography`/`section`/`work` in chuandenglu_full; `record`/`heading`/`juan-head`/`juan-close`/`verse` in the yulu fulls; `preface`/`kanbian`/`xinglu`/`colophon` and their `-heading` siblings in linji_yulu), `witness` (`T47n1998A`/`T47n1998B` on each dahui_yulu_full case), `case_num`/`section_id`, `source_slug`, `zh_chars`, unit `locator` — rides on the record as named fields, not prose. Nothing in the corpus dies at a fold; the fold only changes which level carries the bytes.

### 2.5 Record shape (passage)

One JSON object per line in the export JSONL (JSONL primary per R12; one-JSON aggregate optional):

```
{schema_version, id, type, parent_id, order, lifecycle_status, superseded_by,
 work_key, container_index?, case_num?|section_id?|stanza_num?, source_slug?, kind?,
 title: {zh, pinyin?, en?},
 texts: [ {origin, lang, script, transliteration_scheme?, field, speaker?,
           translator?, translation_status?, body, is_ai_styled}, … ],
 w1_status: {code, label, explanation, evidence_path},
 completion_status,
 canonical_locator: {...} | null, canonical_locator_source,
 notes: [ {source, text}, … ],            (verbatim document + unit notes, §3.5)
 provenance: {source_key, source_edition, cbeta_id, taisho_vol, witness_path,
              extraction_rule, witness_revision, import_reference},
 rights_status, visibility,
 body_format: "plain_cjk_markdown_subset_v1"}
```

- `origin` is the exact JSON pointer in the source file (e.g. `cases[127].dialogue[0].zh`). One `texts[]` element per source string; `body` must equal the source string at `origin` after NFC normalization and nothing else — a consumer can verify losslessness file-by-file without trusting the exporter.
- `field` names the source key (`pointer_zh`, `commentary_zh`, `verse_zh`, `verse_commentary.commentary_zh`, `zh`, …) for rendering labels.
- `canonical_locator_source` ∈ `case_registry` (from `data/canonical_locators.json` → `documents[work].case_locators[String(case_num)]` — exists for exactly 11 documents: congronglu, chuandenglu_full, caoshan_benji, huangbo_fayao_full, mazu_guanglu_full, yunmen_guanglu_full, dongshan_yulu_full, zhaozhou_yulu_full, dahui_yulu_full, wumenguan, biyanlu_cases — covering all 4,192 case locators) | `unit_field` (the unit's own `locator` object, as in linji_yulu, caoshan_benji, chuandenglu_full, wumenguan) | `document_seed` (document-level `legacy_document_seed`, e.g. `zhengdao_ge` — a passage then inherits the work-level locator and says so). `case_registry` wins when present; the exporter never fabricates a locator.

### 2.6 `texts[]` language and styling fields (R11, R4)

| Source of the string | `lang` | `script` | `transliteration_scheme` | `is_ai_styled` |
|---|---|---|---|---|
| `zh`, `commentary_zh`, `verse_zh`, `pointer_zh`, preface/epilogue `zh` | `zh-Hant` | `Hant` | null | false |
| `pinyin` | `zh-Latn` | `Latn` | `Hanyu Pinyin` | false |
| `title_en`, `*note*` prose, project `overview` | `en` | `Latn` | null | false |
| `translations.*.text` with status `verified_quotation` | `en` | `Latn` | null | false |
| `translations.*.text` with status `reconstruction_unverified` or `ai_draft` | `en` | `Latn` | null | true |

`is_ai_styled` is mandatory on every `texts[]` element (absent = importer refuses, per v1.1 R4): the Robo-fake honesty rule travels structurally, not in prose. `translation_status` carries the source status enum (`verified_quotation` / `reconstruction_unverified` / `ai_draft`, `AGENTS.md` "Data contract") so the label and the boolean never drift apart, and `translator` the dictionary key (`red_pine`, `cleary`, …).

---

## 3. Machine-readable evidence status (R3) — and the mechanism that enforces the wiki filter

### 3.1 The `w1_status` object

Present on **every** `work`, `fascicle`, and passage record:

```
w1_status = {code, label, explanation, evidence_path}
```

- `code` — closed enum, verbatim from `scripts/source_review.py` `VALID_SOURCE_REVIEW_STATUSES`: `collated_to_claimed_witness`, `partial_or_failed_w1_collation`, `witness_unavailable`. Unknown code = importer aborts; there is no default badge.
- `label` — fixed strings, from `SOURCE_REVIEW_STATUS_LABELS`: "Collated to claimed witness" · "Partial or failed W1 collation" · "Witness unavailable — not collated".
- `explanation` — one generated sentence quoting register figures, e.g. biyanlu_cases: `400/400 content fields EXACT in T48n2003, 0 content flagged, 86 metadata flagged, evidence sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json`. Generated from the register, never hand-written; never upgrades the claim.
- `evidence_path` — repo-relative path of the authoritative register that proved the number.

### 3.2 Status at document scope

`code` = `corpus_manifest.json → items[key == work].source_review_status`; `completion_status` = the same item's `completion_status` (`complete_selected_witness` / `partial_selected_witness` / `excerpt_seed`). The two are **separate ledgers** and export as separate fields; `complete_selected_witness` is only legal with `collated_to_claimed_witness` (validator-enforced today; the export builder re-checks and refuses otherwise). Today: collated 13, partial 2, unavailable 2 — at `b8472bd`.

### 3.3 Status at passage scope — derived, never stored, never inferred from prose

For each passage, take the set of its source content fields (keys named `zh` inside `dialogue[]` and preface/epilogue entries, `commentary_zh`, `verse_zh`, `pointer_zh`, `verse_commentary_zh`, `verse_commentary.commentary_zh`, `pointer_en`… — i.e. the `CONTENT_SOURCE_FIELDS` families present on that unit). In the authoritative register entry for the document, the `flagged` array lists per-field findings with paths like `.sections[0].dialogue[0].zh` and a `class` from `COLLATION_CLASSES` (`EXACT`, `REWORDED` = collated; `MINOR`, `DIVERGENT`, `NOT_FOUND`, `TITLE_COMPOSITE`, `SHORT_UNMATCHED`, `WITNESS_UNAVAILABLE`, `EMPTY` = findings). A passage's `code`:

- `collated_to_claimed_witness` — its document is collated **and** no finding outside `EXACT`/`REWORDED` points into any of its content fields. (Metadata `title_zh`/`name_zh` findings, like biyanlu's 86 flagged `TITLE_COMPOSITE` titles, classify as metadata — they are measured separately and do not degrade a passage, mirroring the `metadata_field_note` in the manifest.)
- `partial_or_failed_w1_collation` — any content-field finding of a non-collating class points into the passage.
- `witness_unavailable` — the document's code is `witness_unavailable` (all passages inherit; nothing can be collated).

Fascicles inherit from their passages: a fascicle record's code is the best common value (all-collated → collated; any degraded passage → partial) — a Chapter badge can never look better than its worst Page.

This derivation is mechanical: `flagged` paths are the same JSON pointers as `texts[].origin` — the register writes them with a leading dot (`.sections[0].dialogue[0].zh`), the export writes them without (`sections[0].dialogue[0].zh`); strip the dot and compare, nothing else — so an independent consumer can recompute passage status from (corpus file, register file) alone. `coverage_note` prose stays as a note (§3.5), it is never the status source.

### 3.4 The 100%-collated-only rule — the enforcement mechanism

The rule: **only documents whose `source_review_status == collated_to_claimed_witness` appear in a wiki export at all** (owner ruling Q7 W3). A filter an implementer can get wrong is not a mechanism, so the mechanism is a closed equation with three independent checkers and one fail-safe default:

1. **Set equation the builder must satisfy.** The exported document set is *computed*, not curated: `EXPORT_SET = { item.key | items[].source_review_status == collated_to_claimed_witness }` from `corpus_manifest.json`. At `b8472bd` `EXPORT_SET` holds exactly the 13 collated documents — biyanlu_cases, caoshan_benji, chuandenglu_full, congronglu, dahui_yulu_full, dongshan_yulu_full, huangbo_fayao_full, linji_yulu, mazu_guanglu_full, wumenguan, yunmen_guanglu_full, zhaozhou_yulu_full, zhengdao_ge — and excludes the other four: guiyang_yulu and fayan_yulu (partial), hanshan_poems and niutou_juezhu (unavailable). `fayan_yulu` contains one EXACT content field (register: `s4.d0` 曹源一滴水 @3,813); it is still excluded — the document, not the passage, is the atomic unit of ruling Q7 W3, and a failed document contributes nothing, not even its collated fragments. Passage-level cherry-picking across a failed document is forbidden by design.
2. **Builder refusal.** The exporter emits `only_collated: true` and `w1_filter: "collated_to_claimed_witness"` in `export_manifest.json`; before writing a single record it re-reads each candidate's manifest status and aborts (non-zero exit) on any non-collated or unknown value. It cannot "forget" a document in: the only enumeration path in the code is the equation in (1).
3. **Validator gate re-check (new rule in the implementation wave).** `scripts/validate_data.py` gains: for a present export payload, `files[]` in `export_manifest.json` must enumerate exactly `EXPORT_SET`'s corpus files (plus the §6 fixed non-corpus entries), every listed file's sha256 and size must match the working tree, every passage record's `origin` must exist in the listed corpus file and equal its `body` under NFC, and every `texts[].is_ai_styled` must equal the §2.6 mapping. Any mismatch, any record whose document is not in `EXPORT_SET`, any unknown enum value → exit 1 → "do not publish". Because the gate is the same stdlib-only read-only checker botrunner already runs, the filter is *checked arithmetic* end to end, not a convention inside the exporter.
4. **Consumer fail-safe.** The importer aborts on `only_collated != true`, on any record whose `w1_status.code` is not `collated_to_claimed_witness`, and on any record absent from a checksummed file — defense in depth already ruled in Q7 W3. A page can therefore only reach the wiki if the status rode with it as data and three checkers agreed; silently publishing unlabelled retold text is structurally impossible, which is the point of the ruling.

### 3.5 Provenance notes travel with every passage

Document-level keys `recension_note`, `editorial_note`, `cbeta_note`, `coverage_note` (rendering precedence `recension_note` → `editorial_note` → `cbeta_note` per `docs/PROJECT_STATE.md` §2; document-level census at `b8472bd`: `cbeta_note` 16, `coverage_note` 15, `editorial_note` 0, `recension_note` 0 — the 16 `editorial_note` strings in PROJECT_STATE's census are the dialogue-level ones below; absence is legal, dropping is not) and passage/dialogue-level `editorial_note` (16 strings inside fayan_yulu + guiyang_yulu dialogue entries) are exported as `notes[]` entries:

```
notes = [ {source: "coverage_note", text: "<verbatim document string>"}, … ,
          {source: "cases[127].dialogue[0].editorial_note", text: "<verbatim unit string>"} ]
```

- **Every** record of an exported document — work, fascicle, and each passage — repeats the document-level notes verbatim (self-contained pages; the importer never joins). Dialogue/unit-level notes attach only to the passage that owns them.
- The export builder refuses (non-zero) if any note string present in a source document is absent from any record's `notes[]`; the validator gate recomputes the multiset of note strings per document and compares with the union across that document's records (any missing note or any paraphrase = gate red). Coverage notes like `wumenguan`'s "All 48 cases verbatim and contiguous in claimed witness T48n2005 under pinned extraction rule cbeta-p5-body-cjk-v1…" and every R-B dialogue-level label (they begin "Retained project retelling, not witness text (R-B, 2026-09-21, task 056)." in `fayan_yulu`/`guiyang_yulu`) therefore cannot be dropped by an exporter bug without the gate going red.

---

## 4. Lineage edge ids (R1 — the gap the assessment calls "MOSTLY PASS, 1 GAP")

Today `data/lineage/lineage_verification.json` carries 48 edges keyed only by the pair `(teacher, disciple)` (statuses at `b8472bd`: 30 `exact_locator_verified`, 11 `source_verified`, 7 `traditional_link_pending_exact_locator`). Pair-matching breaks idempotency the moment an edge is split or retracted, because the pair *is* the identity.

Rules:

- Edge id = `{teacher}_{disciple}` (v1.1 precedent: `docs/SCHEMA.md` §1, restated in `docs/ANSWERS_FOR_BOTRUNNER_2026-09-21.md` Q7.6). Uniqueness verified against the live file: all 48 pairs are distinct, so all 48 ids assign cleanly; the global-uniqueness rule of §1.1 (checked at build time) is what keeps the unprefixed form safe forever.
- Ids are never reused. If a retracted edge is later re-established with the *same* pair but a *different* claim (new witness, new reference), the new edge gets `{teacher}_{disciple}_2` — the base string stays reserved by the tombstone; `_3` for the next; never "the same id with new meaning".
- **Split.** One traditional edge later found to be two distinct transmissions: the original keeps its id and becomes `superseded` with `superseded_by: ["a_b_2", "a_b_3"]` (§5.1); the two successors take fresh never-used ids (`a_b_2`, `a_b_3`) and are separately `active` records with their own evidence. No pair-matching fallback is left anywhere in the schema.
- **Retraction.** A withdrawn edge keeps its id and status record, content fields emptied (§5). Per Ruling 3 (the fabricated T1987 Zhaozhou attribution "withdrawn, not re-pointed to X68n1315"): a false claim is tombstoned `withdrawn`, `superseded_by: null`, and the existence of an unverified candidate never re-points the tombstone — the candidate, if ever verified, is a new edge with its own id and its own evidence.
- Edge records carry `status` from the full 4-value closed set `VALID_LINEAGE_EDGE_STATUSES` (`exact_locator_verified`, `source_verified`, `traditional_link_pending_exact_locator`, `disputed` — the fourth is legal today though its count is 0), plus `source_id`, `reference`, `note` verbatim from the registry. Unknown status → importer aborts. Frontiers (`frontiers[]`, 12 records whose teacher is a label like "Indian patriarchal tradition — teacher/source not yet recorded", `status: frontier_unprofiled`) are **not** edges and are not exported as pages or edges; they stay internal research state.
- `masters.json` (60 masters) keeps its data `id` (`bodhidharma`) for translatechan; the export id is `master_{id}` (`master_bodhidharma`, v1.1 + sample precedent). `teacher`/`disciples` inside the record are expressed as export ids (`master_prajnatara`), not data ids, so the consumer's key space has exactly one shape per type.

---

## 5. Lifecycle and tombstones (R7) — so a consumer unpublishes instead of orphaning

### 5.1 Fields (on every record)

```
lifecycle_status: "active" | "withdrawn" | "superseded" | "retracted_pending_review"
superseded_by:    <id> | [<id>, …] | null    (list only for splits, §4; empty list illegal)
lifecycle_note:   optional free-text, verbatim corpus string
```

Default rule: **absence of a lifecycle object in the corpus source means `active`** — the corpus gains fields only when an entity's state changes; no migration writes `active` into 17 files. Where a `lifecycle` object exists on a document root, passage, or fascicle entry in `data/corpus/*.json`, the exporter copies its value. The field names are fixed now so the later data change is *adding data*, not debating vocabulary.

### 5.2 Meaning of each state (closed, four values)

| State | Meaning | `superseded_by` | Consumer action |
|---|---|---|---|
| `active` | publish now | must be `null` | upsert page |
| `withdrawn` | the claim is false or retracted | must be `null` — a withdrawn claim is withdrawn, never re-pointed (Ruling 3) | unpublish; keep id reserved; never delete |
| `superseded` | replaced by a specific successor entity | must be a non-null id (or ids, split case) present in the same export | unpublish old; the successor is separately `active` |
| `retracted_pending_review` | content suspect, under review — presumed guilty until proven | must be `null` | unpublish immediately; may re-activate later under the same id |

The validator enforces the two "must" columns both ways (`superseded` without a resolvable `superseded_by` is a gate failure; `withdrawn`/`retracted_pending_review` *with* one is a gate failure — that pointer is exactly Ruling 3's forbidden re-pointing).

### 5.3 Tombstone records

A non-`active` entity stays in the export forever:

- It appears in the export JSONL with its full key fields (`id`, `type`, `parent_id`, `order`, `lifecycle_status`, `superseded_by`, `w1_status`) and `title` unchanged or corrected (titles may be fixed — the id still matches). `texts` must be the empty list: a tombstone carrying any body block is a gate failure — a state change must never smuggle retracted prose back onto the wiki.
- Its file is still checksummed in `export_manifest.json`; the export is a superset view of the *whole* id space, not a publish list. What the wiki publishes is decided by `lifecycle_status == active` **and** the §3.4 filter — two independent axes (lifecycle = "is this entity still claimed"; collation = "is its text the witness's words").
- **Reinstatement is legal and precedented** — the 2026-09-20 correction overlay records "the Congrong Lu reinstatement"; a `retracted_pending_review` entity that clears review flips back to `active` with its **same id**, so the consumer updates the one page it already owns instead of minting a second. That is idempotency working, and it is only possible because ids are never reused.
- **Absence never means deletion** (settled): a record missing from `files[]` is a truncated export — abort (§6.3). The only representation of "this entity is gone from the wiki" is a tombstone with `lifecycle_status: withdrawn`. If the owner ever chooses the "purge outright" alternative from Q8 (delete the 32 retelling files from the repo), tombstones for those ids live on as `lifecycle` entries on manifest items; that path is the owner's call, not this document's.

---

## 6. `export_manifest.json` (R5, R12) — field list and end-to-end verification

A manifest *already exists* at the repo root — and is **stale**: it describes the 14-doc world (commit `1753ca0`, 12 exported corpus files, no `biyanlu_cases`), and its `data/corpus_manifest.json` entry declares sha256 `cece9d6ecf076593e794d7356c12a0f685172736af6449f37919f90a5340bb41` while the file at `b8472bd` is `95b730d0a923e1cf2b3b043fb170aef162861312111c8393074a2052e885d2c1` — the checksum of a manifest nobody re-ran since task 061. Nothing in `scripts/` or the workflows generates or validates the manifest today. The design therefore specifies both the artifact and the mechanism that keeps it honest; re-issue is an implementation-wave deliverable, not this PR's.

### 6.1 Exact fields

```
schema_version           "1.2" for the export schema this document defines (see 6.2)
export_timestamp         ISO8601 UTC, generated, e.g. "2026-09-23T12:00:00Z"
commit                   full 40-hex of the commit whose tree the payload was generated from
                         (git rev-parse HEAD of the export source tree, not of a scratch build)
only_collated            true (literal; owner ruling Q7 W3)
w1_filter                "collated_to_claimed_witness" (literal)
exported_set             array of work keys, exactly EXPORT_SET of §3.4(1), sorted ascending
counts                   {documents, exported_passages, tombstones} — integers the gate recomputes
description              one-line human string; never load-bearing
files                    [ {path, sha256, size} ] sorted by path
changelog                path of the version history entry (docs/CHANGELOG.md)
```

`export_ready.json` (written last, atomicity marker per R12): `{schema_version, export_timestamp, commit, ready: true, only_collated: true}` — its `export_timestamp`+`commit` must match the manifest byte-for-byte; `ready: true` literal.

- `files[]` lists: every exported corpus file under `data/corpus/` (exactly `exported_set`), plus `data/corpus_manifest.json`, `data/canonical_locators.json`, `data/project_metrics.json`, `data/lineage/masters.json`, `data/lineage/lineage_verification.json`, `data/gongan/gongan_index.json`, `data/editorial/traceability_queue.json`, the export records themselves (`export/corpus_export.jsonl` + `export/masters_export.jsonl`, in the wave's payload layout), `docs/SCHEMA.md`, this document, `docs/GATE.md`, `docs/BODY_FORMAT.md`, and the authoritative register path cited by every `w1_status.evidence_path` (today `sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json`). Sessions files are listed read-only evidence — never edited, only hashed (append-only rule).
- No self-referential hashes: `export_manifest.json` and `export_ready.json` never appear inside `files[]` (their integrity is the git object the clone checks out; a hash of the manifest inside itself is either redundant or circular).

### 6.2 Versioning

- One version string governs the whole export: `export_manifest.json.schema_version`; every record repeats it verbatim (`schema_version` on every line). Mixed-version export = abort.
- `docs/SCHEMA.md` v1.1 stays the enum/source-of-truth doc; this design lands as **v1.2** when the implementation wave merges (breaking additions: mandatory passage ids, `type`/`parent_id`/`order` on every record, passage-scope `w1_status`, tombstone records, `exported_set`/`counts` manifest fields). Rule: additive optional field = minor bump; anything that changes key semantics (id derivation, lifecycle vocabulary, filter rule) = major bump + owner ruling. `docs/CHANGELOG.md` records each bump with the commit that caused it — R5's changelog gap closes with one file and a merge habit.

### 6.3 How a consumer verifies end to end (R6-adjacent, mandatory per law amendment (a))

```bash
# 1. obtain the payload at the pinned commit — official delivery is the clone itself
COMMIT=$(jq -r .commit export_manifest.json)
git clone https://github.com/56eli/translatechan.git /tmp/tc-$COMMIT
cd /tmp/tc-$COMMIT && git checkout "$COMMIT"
# 2. atomicity: ready marker matches manifest
jq -e --arg c "$COMMIT" \
      --arg t "$(jq -r .export_timestamp export_manifest.json)" \
      '.commit==$c and .export_timestamp==$t and .ready==true' export_ready.json
# 3. integrity: every payload file, fail-closed
jq -r '.files[] | "\(.sha256)  \(.path)"' export_manifest.json | sha256sum -c -
# 4. truthfulness of the manifest's own claims:
#    exported_set == { items[].key | source_review_status=="collated_to_claimed_witness" } (jq)
#    counts.* == recomputed;  all exported_set keys exist in items[]  (gate does all three)
# 5. content: the gate
python3 scripts/validate_data.py; echo "gate exit=$?"   # must be 0
# 6. losslessness spot-check: for sampled records, body == NFC(source[origin])
```

Any failed step: abort, report, import nothing, notify owner. Steps 1–3 and 5 are already the law (`docs/GATE.md`); steps 4 and 6 are new checks the implementation wave adds to the same gate, so "manifest says 13, payload says 12" cannot happen unobserved.

---

## 7. Gate exit codes for an external consumer (R6 — the documentation gap)

What the law promises, in one table. Exact behavior as implemented at `b8472bd` (`scripts/validate_data.py::main`, `scripts/build_data_bundle.py`, `scripts/smoke_test.mjs`):

| Command | Exit | Meaning for botrunner |
|---|---|---|
| `python3 scripts/validate_data.py` | 0 | PASS — safe to publish (`✅ DATA VALIDATION PASSED`, metrics line on stdout) |
| | 1 | FAIL — do not publish; every finding is an `❌ …` line on stderr plus `Validation failed with N error(s).`; warnings (`⚠️`) are printed but do not fail the run |
| | 2 | argparse usage error (bad flag) — the gate did not run; treat as FAIL, do not publish. Any uncaught exception (missing file, corrupt JSON) exits 1 with a traceback — also FAIL |
| `python3 scripts/build_data_bundle.py` | 0 | bundle rebuilt; determinism = two consecutive builds byte-identical (compare sha256 of `app_data.js`) |
| | ≠0 | exception during build; do not trust the payload mirror |
| `node scripts/smoke_test.mjs` | 0 | reader smoke passed (`✅ SMOKE TEST PASSED`) |
| | 1 | N failures printed (`🔴 SMOKE TEST: N failures`); treat as FAIL |

Environment contract (unchanged law): run in an unprivileged disposable clone at `export_manifest.json.commit`; stdlib-only, read-only, no network, no BookStack credentials; minimum Python 3.11, tested 3.11/3.12; `--write-metrics` is translatechan-lane only and never part of the consumer gate. Non-zero is publish-not-safe regardless of which script says it.

---

## 8. Open questions for the owner

Decisions this design could not make on the evidence — each with a recommendation and its consequence. Everything else above is specified so an implementer has no choices left.

1. **Filter denominator: `w1_status` only, or `w1_status` + `completion_status`?** Ruling Q7 W3 says "only 100%-collated"; it does not say "only complete works". `zhengdao_ge` is `collated_to_claimed_witness` **and** `excerpt_seed` (6 stanzas of a longer work — every exported passage is verbatim witness text, but the work is a selection). *Recommend:* filter on collation only → export `zhengdao_ge` (13 documents). *Consequence if the other way:* 12 documents; a perfectly real, honestly-labelled excerpt of a Chan classic stays off the wiki for a completeness reason the ruling never stated. Either answer is enforceable by §3.4 — this only picks `EXPORT_SET`.
2. **Are `wumenguan`'s preface (2) and epilogue (5) exported as Pages?** They are collated content fields (they are inside `wumenguan`'s 151 content fields), but they are not cases; "passage = Page" never named them. *Recommend:* yes — `front_matter`/`back_matter` Pages, ordered before/after the cases (`wumenguan_preface_01` … `wumenguan_epilogue_05`). *Consequence if excluded:* the Book silently omits Wumen's own framing text — a reader cannot tell it is missing, which this project does not do; folding them into the Book description instead is also legal but must be stated, since BookStack descriptions are presentation surface.
3. **Chapters for `kind`-marker works.** Only `chuandenglu_full` has a per-unit `fascicle` integer, so only it gets Chapters (§2.2). `dahui_yulu_full` (31 juan by head/close markers), `yunmen_guanglu_full` (3), `zhaozhou_yulu_full`, `dongshan_yulu_full` etc. would ship up to 1,354 chapterless Pages under one Book. *Recommend:* ship flat in v1 (no invented grouping data); derive Chapters only from the explicit field. *Consequence:* BookStack navigation depth differs between works until/unless the corpus lane adds per-unit fascicle numbers (a corpus PR, not an export bug fix); if the owner wants Chapters now, the ruling becomes a translatechan data task first, and the id scheme above already accommodates it (`{work}_fascicle_{nn}` ids get assigned whenever the field appears, without disturbing passage ids).
4. **Re-verification cadence for tombstoned pages.** `retracted_pending_review` means unpublish-but-keep-the-id; nothing currently *forces* anyone to re-check it. *Recommend:* the register/overlay workflow keeps a standing owed-review list derived from live `retracted_pending_review` entries (validator could count them into `project_metrics`). *Consequence if skipped:* pages vanish from the wiki and nobody owns their return; the state exists on paper only. This question is about a review *habit*, not the schema — the fields work either way.
5. **Q5 visibility/rights flags stay open (carried, not new).** The 2026-09-21 note is still "consideration only, not decided": `rights_status` and `visibility` are emitted on every record exactly as the sample shows, wiki currently all-public. *Recommend:* keep as is. *Consequence:* none for this export; if the owner later makes the wiki account-only or splits a private shelf, the flags already exist and no schema bump is needed.

---

## 9. Where the prior documents are stale (measured at `b8472bd`)

The consumer requirements and answers remain correct in substance; figures moved:

- `TC_EXPORT_CONSUMER_ASSESSMENT_2026-09-21.md`: "44 docs, 8,783,101 B bundle, masters 35, edges 20+10+1=30, 32 partial docs" → now **17 docs, 8,143,493 B** (hash `b68eb436…`), **60 masters, 48 edges (30 exact + 11 source + 7 pending), 2 partial + 2 unavailable** — the 2026-09-21 purge and the Wumenguan/Linji/Biyanlu re-keys happened after its base `5982e3e`. Its "R1 gap: edges matched by pair" and "R2 gap: passages are array indices" both still hold verbatim today (§1, §4).
- R6 "gap: exit codes not documented for an external consumer" and "recommend publishing `docs/GATE.md`" → already done: `docs/GATE.md` exists on main; §7 completes the table with per-exit codes.
- `BOTRUNNER_REVIEW_2026-09-21_LAW.md`: "14 docs, 12 exported, manifest lists 12 collated docs" → the root manifest still describes that world; current `EXPORT_SET` is 13 (Biyanlu added by `sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json`). The manifest file is the stale artifact (§6), not the ruling.
- `docs/sample_export.jsonl` is hand-authored and carries defects a generated export would reject: its `master_bodhidharma` cross-refs the purged `bodhidharma_erru`; its `congronglu_case_001` en text is Emperor-Wu/Bodhidharma text (biyanlu's case 1), and its congronglu `completion_status` says `partial_selected_witness` where the manifest says `complete_selected_witness`. §2.2/§2.5/§3.4 mechanisms exist precisely so the *sample of record* becomes generated output; the sample should be regenerated, not patched, in the implementation wave.
- `BOTRUNNER_REVIEW_2026-09-21_LAW.md` Q2 states `partial_or_failed_w1_collation` is "Not present in current corpus (0)" — true at its base; there are now two (the restored Guiyang/Fayan excerpt seeds), still zero of them exported.

## 10. Implementation handoff (explicitly NOT in this document's PR)

When the owner rules on §8, one export wave implements: `scripts/build_export.py` (new) generating the export JSONL whose **committed output is the id reservation ledger** — the builder diffs against the previous export, never assigns a used id, never drops a record, never renumbers (§1.1); `lifecycle` fields added to `data/` only for entities §5 actually changes, subject to the corpus-growth rules (`test_source_preservation` allowlist, gate re-pins — `docs/PROJECT_STATE.md` §3); §3.4(3)/§6.3(4,6) rules added to `scripts/validate_data.py`; `export_manifest.json` + `export_ready.json` regenerated at that wave's merge commit (curing its known staleness, §6); `docs/SCHEMA.md` bumped to v1.2 with a CHANGELOG line; the sample regenerated from the exporter. Bundle determinism, the seven gates, and the append-only `sessions/` rule apply to that wave unchanged.
