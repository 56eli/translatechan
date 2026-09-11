# Task 005 — Re-key `xinxin_ming` to the T48n2010 witness (Wave 1, document 4)

You are working in `56eli/translatechan` ("Fake Chan Factory"). This is a **source-text
remediation** task on one canonical document. Read all 16 sections before touching data; §3 and
§12 are the ones that decide whether this PR passes review.

---

## 1. Mission

`data/corpus/xinxin_ming.json` (三祖僧璨大師 信心銘) claims CBETA **T48n2010** as its witness and
has **13 content fields** that do not match that witness. Adjudicate every one of the 13 against
the pinned, digest-verified witness text and repair them under the project's existing hybrid
R-A/R-B policy: **re-key to the witness verbatim where the witness carries the passage; keep the
project wording with an additive `editorial_note` where it does not.** Then regenerate every
derived artifact and update the two tracker records. One document per PR — no other document.

## 2. Repository state at your base

```bash
git rev-parse HEAD     # main at or after the merge of task 004 (tracker-drift PR)
git diff --name-only   # must be empty before you start
```

Precedent you must follow, not re-invent: **PR #29** (`wumenguan`), **PR #30** (`biyanlu_cases`),
**PR #32** (`linji_yulu`, Wave 1 document 3) each re-keyed flagged fields against a pinned witness
with an allowlisted pointer set. Read `.orchestrator/REMEDIATION_PLAN.md` and the `linji_yulu`
entry in `scripts/test_source_preservation.py` before editing.

## 3. Read this before you trust the register's `ref_window`

The published register `sessions/COLLATION_REGISTER_2026-09-10_CORRECTION.json` lists, per flag, a
`ref_window`. **`ref_window` is the highest-similarity window the collator found — it is *not*
guaranteed to be the substring that replaces your field.** On this document 5 of 13 `ref_window`
values are not even inside the witness file, and several that are inside are offset from the true
stanza. Copying `ref_window` in as the "witness text" is the single most likely way to fail this
task. Derive every replacement from the reference file itself (§5) and verify it by substring test
(§8) — never by eyeballing the register.

Two further traps, measured on this document:

- **Punctuation.** Corpus `zh` fields carry full-width `，`/`。`; the reference file is one line of
  CJK with **no punctuation and no trailing newline**. A naive substring test of a corpus field
  against the reference always fails. Compare after stripping punctuation, and write the new field
  with the **project's own punctuation pattern preserved** (see §6).
- **Clause pitch.** The reference file opens with the **3-graph title `信心銘`**, so the 4-graph
  verse clauses sit at offsets ≡ 3 (mod 4), not at multiples of 4. Do not assume a stanza starts
  where arithmetic says it should; locate it by its text.

## 4. Witness pinning and the digest gate

```bash
# 1. acquire the reference edition (git protocol; the raw CDN is blocked in this environment)
git clone --filter=blob:none --no-checkout --depth 1 \
    https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
cd /tmp/xmlp5
printf '/T/T48/T48n2010.xml\n' > /tmp/paths.txt
git sparse-checkout set --no-cone /T/T48/T48n2010.xml && git checkout
git rev-parse HEAD          # expect dbdea41071e1e260ad84b72faefd4587333cf76d (the rev the
                            # published evidence was produced at; if it differs, STOP and report)
# 2. extract + verify against the committed evidence manifest
cd /path/to/translatechan      # the repo root you cloned
python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
    --work-list sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
    --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt \
    --upstream-revision "$(git -C /tmp/xmlp5 rev-parse HEAD)" --require-verified
```

Requirements: `ref_T48n2010.txt` must have sha256
`9aaa3217647e519d24c3ecdf3fa6cd9fd6fcbead453334a8e03b60716a6e4635`
(= `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt` line 20), and the file is 588 CJK graphs.
If the digest or revision does not reproduce, **stop and report** — do not proceed on a different
text. Never write reference files into the repo; `/tmp/refs` only.

## 5. The 13 flags, adjudicated (reproduce this table, do not transcribe it)

Register facts to re-derive first (`probes` is empty for this doc; all evidence is in `flagged`):
`documents.xinxin_ming` → `fields_total 38`, `content_fields_total 37`, `content_fields_collated
24`, `flagged` 14 = 13 content + 1 metadata (`.title_zh`). Every content flag is a `.stanzas[i].zh`.

Generate the replacement from the reference file mechanically: for each flagged field, split the
field on `，`/`。` into clauses, find a clause that occurs **exactly once** in the reference, take
that clause's index to fix the span start, cut `span = ref[start : start + 4·len(clauses)]`, and
re-emit the field by replacing only its CJK graphs, leaving every punctuation character in place.
Then confirm `strip_punct(new_field) == span` and `span in ref`.

Expected outcome (verified at the revision above; every row was confirmed verbatim-in-witness and
every current form confirmed absent):

| idx | register class | current `zh` | witness `zh` to write | graphs changed |
|---|---|---|---|---|
| `stanzas[10]` | DIVERGENT | 二見不住，慎莫追尋。纔有是非，紛然失心。 | 二見不住，慎**勿**追尋。纔有是非，紛然失心。 | 1 |
| `stanzas[14]` | DIVERGENT | 一空同兩，齊含萬象。不見精粗，寧有偏黨。 | 一空同兩，齊含萬**像**。不見精**麁**，寧有偏黨。 | 2 |
| `stanzas[16]` | DIVERGENT | 執之失度，必入邪路。放之自然，體無去住。 | 執之失度，**心**入邪路。放之自然，體無去住。 | 1 |
| `stanzas[17]` | DIVERGENT | 任性合道，逍遙絕惱。繫念乖真，昏沉不好。 | 任性合道，逍遙絕惱。繫念乖真，**沈惛**不好。 | 2 |
| `stanzas[18]` | DIVERGENT | 不好勞神，何用疏親。欲取一乘，勿惡六塵。 | 不好勞神，何用**疎**親。欲**趣**一乘，勿惡六塵。 | 2 |
| `stanzas[21]` | DIVERGENT | 迷生寂亂，悟無好惡。一切二邊，良由斟酌。 | 迷生寂亂，悟無好惡。一切二邊，**妄自**斟酌。 | 2 |
| `stanzas[22]` | DIVERGENT | 夢幻空華，何用把捉。得失是非，一時放卻。 | 夢幻空華，何**勞**把捉。得失是非，一時放**却**。 | 2 |
| `stanzas[23]` | DIVERGENT | 眼若不寐，諸夢自除。心若不異，萬法一如。 | 眼若不**眠**，諸夢自除。心若不異，萬法一如。 | 1 |
| `stanzas[27]` | DIVERGENT | 契心平等，所作俱息。狐疑盡淨，正信調直。 | **啟**心平等，所作俱息。狐疑盡淨，正信調直。 | 1 |
| `stanzas[28]` | DIVERGENT | 一切不留，無可記憶。寂然虛明，不勞心力。 | 一切不留，無可記憶。**虛明自然**，不勞心力。 | 4 (reordered) |
| `stanzas[31]` | NOT_FOUND | 十方智者，皆入此宗。宗非促延，一念萬年。 | **keep as-is** — see §7 | — |
| `stanzas[32]` | DIVERGENT | 無在不在，十方目前。極小同大，忘絕境界。 | 無在不在，十方目前。極小同大，**妄**絕境界。 | 1 |
| `stanzas[34]` | DIVERGENT | 若不如此，必不須守。一即一切，一切即一。 | 若不**如是**，必不須守。一即一切，一切即一。 | 1 |

If your generated row for any index differs from this table in **any graph**, stop and report the
difference; do not choose between them silently. (`stanzas[23]`, `[27]` and `[34]` anchor on their
**second** clause, because their first clause is itself one of the divergences; the rest anchor on
clause 1. `stanzas[31]` anchors on clause 1 and then must be *rejected* per §7 — its aligned span
is the witness's next stanza opening, which is the tell that the project's fourth clause is not a
variant but a line the witness does not carry.)

## 6. Re-key contract (the 12 R-A fields)

For each of the 12 fields listed above except `stanzas[31]`:

1. `.stanzas[i].zh` ← the witness text, **with the project's existing punctuation positions kept**
   (do not introduce or remove punctuation; do not "fix" clause grouping).
2. `.stanzas[i].pinyin` ← recomputed **syllable by syllable** against the new `zh`, in the same
   format as the sibling fields already in the file (`Èr jiàn bù zhù, shèn mò zhuī xún. …` —
   comma/sentence punctuation and sentence case preserved). Note that several changes are
   graphic-only variants sharing one reading — 象/像 (`xiàng`), 疏/疎 (`shū`), 卻/却 (`què`) — so
   **recompute, then diff**: change a syllable only where the reading actually changes. Record in
   your report which pinyin fields you left byte-identical for that reason.
3. Nothing else in that stanza. `translations.suzuki.text` is a published translation: **do not
   edit, re-flow, or "align" it**, and do not add notes inside `translations`.

Do not add `witness_variant` or any other new key: the file's stanza schema is
`stanza_num, zh, pinyin, translations`, and `validate_data.py` will reject the rest.

## 7. `stanzas[31]` — keep, label, and say why (this is the one field that is not a variant)

`一念萬年` does **not** appear anywhere in `ref_T48n2010.txt` (verified: 0 occurrences), and the
witness's clause where the project puts it reads `無在不在` — which the project already carries as
the **opening clause of `stanzas[32]`**. So adopting the witness here would not correct a variant;
it would delete a canonical line and duplicate the next stanza. This is the same situation the
owner ruled on for `linji_yulu` 行錄 sections 71–73 on 2026-09-11: **do not delete or reorder
sections; label the field and keep it.**

Therefore: leave `.stanzas[31].zh` and `.pinyin` untouched and add
`.stanzas[31].editorial_note` recording, in prose, (a) that the fourth clause is not attested in
the claimed witness T48n2010 — full-text search, 0 hits; (b) that the witness instead reads
`無在不在` at that position; (c) that the clause is a standard reading of the 信心銘 transmitted in
other recensions, and that naming a specific one requires evidence you are not to assume. **Do not
quote a full witness clause inside the note** (a prior PR did and was flagged): describe it, don't
reproduce it. No `witness_attribution` of any kind.

## 8. Expected measurable outcome

- Collation: `collate_corpus.py --doc xinxin_ming` on the verified refs → content fields
  **24/37 → 36/37** EXACT; content flags **13 → 1** (the 1 is `stanzas[31]`, `NOT_FOUND`,
  kept-by-ruling). `EXACT` must be **36** and no field may be `MINOR`/`REWORDED`.
  **Do not** expect the single `.title_zh` metadata flag to change — §12.
- The verifier for every re-keyed field, in these terms:
  `strip_punct(new_zh) in ref_T48n2010.txt` → true, and `strip_punct(old_zh) in ref…` → false.
- `data/corpus/xinxin_ming.json`: 12 `zh` fields, up to 12 `pinyin` fields, 1 added
  `editorial_note`, 1 `coverage_note`. The file's 37 stanzas stay 37, same order, same
  `stanza_num` values.
- CJK totals: this is a like-for-like graph substitution except `stanzas[28]` (4→4) and
  `[31]` (untouched), so `zh_chars` should move only via the note text; the exact before/after
  numbers belong in your report, and `validate_data.py` must pass on them.

## 9. Files you may change (exactly this set)

```
data/corpus/xinxin_ming.json
data/project_metrics.json                      (via validate_data.py --write-metrics, §10)
scripts/test_source_preservation.py             (allowlist only — see below)
docs/data/corpus/xinxin_ming.json               (build-generated)
docs/data/project_metrics.json                  (build-generated)
app_data.js, docs/app_data.js                    (build-generated)
README.md, AUDIT.md, HANDOFF.md                  (regenerated counters/notes only, per PR #32)
.orchestrator/STATE.md, .orchestrator/REMEDIATION_PLAN.md
```

**Allowlist discipline.** `scripts/test_source_preservation.py` currently permits, for this file,
exactly `{".coverage_note"}`. Extend it with **exactly** the pointers you actually changed: 12
`.stanzas[i].zh`, the `.stanzas[i].pinyin` you modified, and `.stanzas[31].editorial_note`. Not the
13, not the whole file, not a prefix match — membership is the exact pointer string. After your
work, the set of allowlisted pointers for `xinxin_ming` (minus `.coverage_note`) must be
**set-equal** to the set of changed leaf pointers. Prove it in your report by listing both sets.

Forbidden: `scripts/smoke_test.mjs` (no assertion here depends on these strings — if a gate fails
because of one, stop and report instead of editing the test), `data/canonical_locators.json`,
`data/corpus_manifest.json`, `sessions/*`, `schemas/*`, `app.css`, `app.js`, `index.html`,
anything under `.github/`, and every other `data/corpus/*.json`.

## 10. Commit cadence — one commit per data-touching sub-task

This is a hard requirement (a previous PR lost a whole day of cadence by batching; §4 of this
brief is the reason it is now spelled out). Commit in this order, and do not amend after pushing:

1. `chore: pin T48n2010 witness refs for xinxin_ming re-key` — no repo file changes; this commit
   records the verified extraction (empty or notes-only is fine, but **record the sha256 + revision
   in the commit message body**).
2. `fix: re-key 12 xinxin_ming stanzas to the T48n2010 witness` — the 12 `.zh` fields only.
3. `fix: recompute xinxin_ming pinyin for the re-keyed stanzas` — the `.pinyin` fields only.
4. `docs: record xinxin_ming stanza 31 as a witness-absent retelling` — the `editorial_note` +
   `coverage_note`.
5. `chore: extend source-preservation allowlist for the xinxin_ming re-key` — allowlist only.
6. `chore: regenerate data artifacts and project metrics for xinxin_ming` — build outputs +
   `--write-metrics`.
7. `docs: record Wave 1 document 4 remediation state` — the two `.orchestrator/` files (+ any
   regenerated counters in README/AUDIT/HANDOFF if the counters were not already committed at 6).

If two adjacent sub-tasks genuinely cannot be separated, say so in the report and explain — do not
silently squash.

## 11. Gates, in order, all from a real clone (not a `git worktree`)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py --write-metrics      # regenerate metrics
python3 scripts/validate_data.py                      # then re-run clean, no flag
python3 scripts/collate_refs.py --refs-dir /tmp/refs \
    --verify-against sessions/COLLATION_W1_2026-09-10_refs_manifest.txt --require-verified
COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py --doc xinxin_ming   # §8 numbers
python3 scripts/build_data_bundle.py
git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
git diff --check
diff -rq data docs/data && cmp app_data.js docs/app_data.js
```

All exit 0. `--skip-docs` is **not** permitted on `validate_data.py`. Do not run
`scripts/w1_evidence.py` standalone (it is an imported module, not a CLI).

## 12. Explicit non-goals (scope discipline — over-reach fails review)

- **`.title_zh` stays flagged.** The single metadata flag on
  `三祖僧璨大師 信心銘` is composite-title rendering work, which the owner has ruled is a
  **separate PR** (same ruling that kept `linji_yulu`'s 74 title flags out of PR #32). Do not
  "fix" it here, and do not touch `title_pinyin`/`title_en` either.
- **No English translation edits.** If a Suzuki rendering now sits oddly against a re-keyed
  variant graph, record it as follow-up debt in your report — that is what PR #30 did for its 13
  `*_en` fields.
- **No status promotion.** `data/corpus_manifest.json` must stay **byte-identical**; the
  document's status remains `partial_or_failed_w1_collation` until the separate post-remediation
  evidence pass. The `stanzas[31]` flag alone keeps it non-exact, so nothing is being deferred
  that is actually finished.
- **No coverage-note overclaim.** The current note reads `24/37 …`. Update it to the true number
  and keep its closing sentence that representation does not establish complete selected-witness
  status. Do not write "complete", "all stanzas verified", or "37/37 collated".
- Do not add a `simplified`-character cleanup, do not normalise 麁/粗-style variants elsewhere in
  the file, and do not reflow JSON key order or indentation (the diff must be reviewable).

## 13. Report format (PR body)

1. Witness pin: `git -C /tmp/xmlp5 rev-parse HEAD`, `sha256sum` of `ref_T48n2010.txt`, and the
   collate_refs verification line (`39 verified / 0 drift` if you ran the full manifest).
2. The 13-row before/after table, plus for each re-keyed field the two substring verdicts from §8.
3. Pinyin: fields changed, fields left identical because the reading is unchanged (list both).
4. `stanzas[31]`: the 0-hit search result you ran, verbatim command + output.
5. Allowlist proof: the two pointer sets, and that they are set-equal.
6. Every §11 command, exit status, and the §8 numbers as measured.
7. Follow-up debt list (English renderings, `.title_zh`, anything you deliberately did not fix).
8. Anything that did not match this brief — stated plainly, with what you did not touch.

Do not paste the full JSON file. Do not claim a number you did not re-run in this session.

## 14. Handoff (do not merge)

Push to your working branch, open a PR against `main`, post §13, and stop. **Never press the merge
button**; the operator merges personally after independent review, and the review will re-run §11
and re-derive §5 from the reference file rather than reading your report.

## 15. If reality disagrees with this brief

Stop and report if: the witness digest does not reproduce; your generated table differs from §5;
`stanzas[31]` turns out to be attested after all (then say so and do not re-key it silently); a
gate fails for a reason outside your diff; or `main` has moved such that any of these 13 fields is
already changed. Guessing here is worth less than a short "unresolved" report.

## 16. Definition of done

12 fields re-keyed and verbatim in the pinned witness, 1 field kept with an honest additive note,
`.title_zh` untouched, manifest byte-identical, allowlist set-equal to the changed pointers,
`collate_corpus --doc xinxin_ming` reporting **36 EXACT / 1 NOT_FOUND**, all gates green in a
clean clone, and the two tracker records updated to say what is now true — nothing more.
