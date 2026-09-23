# Tier2 authenticity — Guiyang (`guiyang_yulu`), one document only (task 064)

**Date:** 2026-09-23 · **Branch:** `arena/01a0cbc1-translatechan` (session branch) · **Base:** `main` `9de5c80`
(rebased from the prompt's premise commit `b8472bd`; premise intact — `git merge-base --is-ancestor
b8472bd… origin/main` → `premise intact`. Main's movement `b8472bd..9de5c80` touched only
`bin/orchestrator-check`, `docs/BOTRUNNER_EXPORT_SCHEMA_2026-09-23.md`, `docs/PROJECT_STATE.md` prose,
and `orchestrator/*` — no corpus bytes, no register, no guiyang work; §4 re-verified on the rebased tree
before any change.)

**Determination: R-B** — label as project retelling. No re-key. Exactly one corpus document changed:
`data/corpus/guiyang_yulu.json` (the `coverage_note` extension below). No `zh`/`pinyin`/translation/
`cbeta_id` field touched; no other corpus document touched; no existing `sessions/` file edited (this
record is new).

**Reference layer:** CBETA XML P5 @ `dbdea41071e1e260ad84b72faefd4587333cf76d` (upstream HEAD at run
time, equal to the pinned revision), 23 works extracted with `scripts/collate_refs.py`
(`cbeta-p5-body-cjk-v1`), digests **23 verified / 0 drift / 0 unlisted / 0 unavailable** against
`sessions/COLLATION_W1_2026-09-22_P1_BIYANLU_refs_manifest.txt`; the freshly written digest manifest
is `cmp`-identical to the committed one.

---

## 1. What this task produced

* **`data/corpus/guiyang_yulu.json`** — `.coverage_note` extended (single sentence, ASCII-only addition
  so the all-string CJK figure is unchanged) with the dated 2026-09-23 re-determination: the
  authoritative register entry re-reproduced identically on its digest-verified 23-work layer, still
  0 of 6 source-content fields collated in the pinned witnesses T47n1989/T47n1990 (0 percent, bar
  80 percent = 5 of 6), so R-A is not available and the R-B labels stand. The six dialogue-level
  `editorial_note` R-B labels and the `cbeta_note` (tasks 056/059) are **unchanged** — the re-run
  below reproduces them exactly, so their quoted measurements stay true.
* **`data/corpus_manifest.json`** — **unchanged**: `completion_status: excerpt_seed` and
  `source_review_status: partial_or_failed_w1_collation` remain accurate at 0/6; no status code became
  inaccurate, and no new code was invented.
* **`data/project_metrics.json`** — regenerated (`--write-metrics`); only the echoed `coverage_note`
  string changed (content CJK and all-string CJK figures unchanged: the addition is ASCII-only).
* **`docs/PROJECT_STATE.md`** — 059 line: Guiyang half ticked (Fayan half left unticked — task 065);
  Active Milestone / Immediate Next Task updated to name the next lane (Fayan authenticity, task 065);
  bundle hash/bytes lines refreshed to this build; note census re-measured (see §4 — counts unchanged).
* **`app_data.js` / `docs/` mirror** — rebuilt twice, byte-identical (§5).
* **This record** — `sessions/TIER2_GUIYANG_2026-09-23.md`, new file, append-only.

## 2. Commands run, with real output

### 2.1 Print the required reference works (per §6.1)

```
$ python3 scripts/collate_corpus.py --reproduce sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json --print-refs
T47n1985
T47n1986A
T47n1986B
T47n1987A
T47n1987B
T47n1988
T47n1989
T47n1990
T47n1991
T47n1998A
T47n1998B
T48n2001
T48n2003
T48n2004
T48n2005
T48n2006
T48n2012A
T48n2012B
T48n2014
T51n2076
X68n1315
X69n1321
X80n1565
```

(23 works — the `generation_parameters.doc` list of the authoritative register.)

### 2.2 Acquire and verify the reference layer

```
$ git clone --filter=blob:none --no-checkout --depth 1 https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
$ git -C /tmp/xmlp5 rev-parse HEAD
dbdea41071e1e260ad84b72faefd4587333cf76d          # equals the register's pinned upstream_revision

$ python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --work-list sessions/COLLATION_W1_2026-09-22_P1_BIYANLU_refs_manifest.txt \
    --verify-against sessions/COLLATION_W1_2026-09-22_P1_BIYANLU_refs_manifest.txt \
    --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
    --write-digest-manifest /tmp/refs/refs_manifest.txt --allow-drift
references: 23 work(s)
digest verification: 23 verified, 0 drift, 0 unlisted, 0 unavailable (against COLLATION_W1_2026-09-22_P1_BIYANLU_refs_manifest.txt)
✅ reference extraction/verification complete

$ cmp /tmp/refs/refs_manifest.txt sessions/COLLATION_W1_2026-09-22_P1_BIYANLU_refs_manifest.txt
# (exit 0 — byte-identical)

$ python3 scripts/collate_refs.py --verify-against \
    sessions/COLLATION_W1_2026-09-22_P1_BIYANLU_refs_manifest.txt --refs-dir /tmp/refs --require-verified
references: 23 work(s)
digest verification: 23 verified, 0 drift, 0 unlisted, 0 unavailable (against COLLATION_W1_2026-09-22_P1_BIYANLU_refs_manifest.txt)
✅ reference extraction/verification complete
```

### 2.3 Re-run the collation (`--reproduce` of the authoritative register)

```
$ python3 scripts/collate_corpus.py \
    --reproduce sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json \
    --refs-dir /tmp/refs --out /tmp/repro_p1_biyanlu.json
warning: congronglu: historical anchor for T48n2004 is 'drift'; accepted because congronglu is declared new to this overlay (no historical evidence record)
warning: zhaozhou_yulu_full: historical anchor for X68n1315 is 'drift'; accepted because zhaozhou_yulu_full is declared new to this overlay (no historical evidence record)
wumenguan                {"EXACT": 207} -> collated_to_claimed_witness
linji_yulu               {"EXACT": 215} -> collated_to_claimed_witness
biyanlu_cases            {"EXACT": 415, "NOT_FOUND": 11, "TITLE_COMPOSITE": 4, "SHORT_UNMATCHED": 71} -> collated_to_claimed_witness
congronglu               {"EXACT": 601} -> collated_to_claimed_witness
chuandenglu_full         {"EXACT": 2549} -> collated_to_claimed_witness
caoshan_benji            {"EXACT": 169} -> collated_to_claimed_witness
huangbo_fayao_full       {"EXACT": 39} -> collated_to_claimed_witness
mazu_guanglu_full        {"EXACT": 71} -> collated_to_claimed_witness
yunmen_guanglu_full      {"EXACT": 1553} -> collated_to_claimed_witness
dongshan_yulu_full       {"EXACT": 645} -> collated_to_claimed_witness
zhaozhou_yulu_full       {"EXACT": 161} -> collated_to_claimed_witness
dahui_yulu_full          {"EXACT": 2709} -> collated_to_claimed_witness
zhengdao_ge              {"EXACT": 6, "NOT_FOUND": 1} -> collated_to_claimed_witness
hanshan_poems            {"WITNESS_UNAVAILABLE": 5} -> witness_unavailable
niutou_juezhu            {"WITNESS_UNAVAILABLE": 9} -> witness_unavailable
guiyang_yulu             {"NOT_FOUND": 9, "TITLE_COMPOSITE": 1} -> partial_or_failed_w1_collation
fayan_yulu               {"EXACT": 4, "NOT_FOUND": 11, "TITLE_COMPOSITE": 2, "SHORT_UNMATCHED": 3} -> partial_or_failed_w1_collation
aggregate: {"documents": 17, "flagged_entries": 127, "fields_total": 9471, "content_fields_total": 5134, "content_fields_collated": 5109, "metadata_fields_total": 4337, "class_totals": {"EXACT": 9344, "NOT_FOUND": 32, "SHORT_UNMATCHED": 74, "TITLE_COMPOSITE": 7, "WITNESS_UNAVAILABLE": 14}, "source_review_status_counts": {"collated_to_claimed_witness": 13, "partial_or_failed_w1_collation": 2, "witness_unavailable": 2}, ...}
register written: /tmp/repro_p1_biyanlu.json
```

Equivalence check against the authoritative register (core fields: witness, summaries, field counts,
flagged list, source_review_status, reference_verification, refs_*):

```
guiyang entry identical to authoritative register: True
all 17 documents identical: 17 / 17
```

Guiyang entry, as re-measured:

```
content_fields_total:      6
content_fields_collated:   0
content_summary:           {"NOT_FOUND": 6}
summary (all fields):      {"NOT_FOUND": 9, "TITLE_COMPOSITE": 1}
  .title_zh                TITLE_COMPOSITE sim 0.56 — corpus 潭州溈山靈祐禪師語錄與溈仰九十六圓相
                           vs witness 潭州溈山靈祐禪師語錄 + remainder 與溈仰九十六圓相
  every .sections[*] content field  NOT_FOUND at sim 0.0 (title_zh metadata fields NOT_FOUND too)
source_review_status:      partial_or_failed_w1_collation
refs:                      T47n1989 verified, T47n1990 verified (2/2)
```

## 3. The arithmetic and the determination

* Content fields total: **6** (the six `.sections[*].dialogue[*].zh` fields; `title_zh` and section
  `title_zh` are metadata, excluded from the content denominator per `source_review.METADATA_SOURCE_FIELDS`).
* Content fields collated (EXACT/REWORDED): **0**.
* Verbatim rate: **0 / 6 = 0.0000 = 0%**.
* The bar: **≥ 80% ⇒ R-A; below ⇒ R-B.** For 6 fields, 80% requires ⌈0.8 × 6⌉ = **5 of 6** fields
  collated. Measured 0 of 6.
* **0% < 80% ⇒ R-B (label as project retelling).** R-A is unavailable on this evidence: the pinned
  witnesses T47n1989/T47n1990 do not carry the text, and no field is verbatim anywhere in the
  digest-verified reference layer (the earlier 43-work task-056 sweep also measured 0 of 6).

## 4. Note census (§6.2a)

Re-measured after the `coverage_note` extension, same counting rule as
`scripts/validate_data.py` / `scripts/test_source_review_rules.py`:

```
total=47  cbeta=16  editorial=16  coverage=15  recension=0  rendered=32  docs=16
```

The counts are **unchanged** from the figures already written in `docs/PROJECT_STATE.md` line 29 —
the deliverable extends an existing note string; it adds no note key. The line already carries the
measured values, so no census edit is required beyond re-recording this measurement here.

## 5. Resulting label text, and where a reader encounters it

* **Where:** `data/corpus/guiyang_yulu.json` → `.coverage_note`, rendered once as the **“Reading” row**
  of the represented-units ledger in the Reader (`renderRepresentedUnitsLedger`; sole explained
  exemption in `NOTE_RENDER_EXEMPTIONS`), plus the six dialogue-level `editorial_note` labels rendered
  beside each passage (precedence `recension_note` → `editorial_note` → `cbeta_note`; guiyang carries
  no `recension_note`, so `editorial_note` renders at each dialogue and `cbeta_note` at the document).
* **Exact text added this task** (appended to the end of the existing `.coverage_note`):

  > Re-verified 2026-09-23 (task 064): the authoritative register entry (sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json) re-reproduced identically via scripts/collate_corpus.py --reproduce against its digest-verified 23-work reference layer (23 verified / 0 drift at CBETA XML P5 dbdea41071e1e260ad84b72faefd4587333cf76d) — still 0 of 6 source-content fields collated in the pinned witnesses T47n1989/T47n1990 (0 percent verbatim, bar 80 percent = 5 of 6), so R-A is not available on this evidence and the R-B project-retelling labels stand.

* **Pre-existing label text this determination leaves standing** (tasks 056/059, unchanged): the
  `.coverage_note` sentence “The wording is a project retelling/composition under the record's name,
  not an excerpt of either claimed work; every field is R-B-labelled and no field was re-keyed; an
  older complete copy is OUT-OF-CBETA human sourcing, not agent work.” and the six dialogue labels,
  e.g. `sections[0].dialogue[0].editorial_note`: “Retained project retelling, not witness text (R-B,
  2026-09-21, task 056). … Below the 80 percent re-key threshold. Kept as written rather than
  re-keyed.”

## 6. Which Rulings constrained the outcome

* **Ruling 3 (never re-point a withdrawn/unsupported claim at an unverified candidate):** T47n1989 /
  T47n1990 do not carry the text, so the claim is **labelled**, not re-pointed. Shopping for an
  X-series text that might carry fragments (X80n1565 is the best measured partial carrier) was
  forbidden and not done — an R-A on an unverified candidate would be exactly the re-pointing
  Ruling 3 forbids.
* **Ruling 4 (OUT-OF-CBETA sourcing is human-only):** the honest residual — an older complete copy
  may exist outside CBETA — is recorded in the note as human sourcing work, not agent work. No
  out-of-CBETA source was fetched, transcribed, or evaluated.
* **Ruling 2 (630 stays the historical register's designated figure; no `w1_evidence.py`
  `FIXED_METADATA` change):** respected — `w1_evidence.py` untouched; flagged stays 127 active /
  630 historical as designated.
* **Never edit a checker to make a gate pass:** respected — no checker, workflow, `AUTH_REGISTER`,
  `BASE_COMMIT`, or `DECLARED_NEW_CORPUS` edit was needed; the preservation allowlist already carries
  `.coverage_note` for this document (declared-new set), and no allowlist entry was added or widened.
* **Sessions append-only:** respected — this file is new; no existing `sessions/` file was edited.
* **R-A/R-B/R-C policy (PROJECT_STATE):** R-B is the labelled-retelling branch where no carrier
  exists; R-C would apply only to an OUT-OF-CBETA answer, which is human work.

## 7. Gate transcript (§14)

Recorded in the PR description with all seven commands, both determinism hashes, and the bundle-hash
delta (`b68eb436…` 8,143,493 B → `263b668b…` 8,144,589 B, caused solely by this document's
`coverage_note` extension).
