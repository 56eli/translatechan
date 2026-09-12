# Task 014 — Stop saying six false citations: align the public claims with what the collation actually tested

Working in `56eli/translatechan`. Owner rulings of 2026-09-12 (`ask_user`, four questions) set this task's shape:

1. **The six `CITATION` rows are fixed in ONE PR, one commit per document** — packaging approved by the owner, so the
   standing "one document per PR" rule is deliberately relaxed for this class only (citation strings, no source text).
2. **The ledger stays as it is:** `630` remains the authoritative register figure and the 2026-09-12 record stays a
   dated measurement. **No re-designation in this PR** — no `scripts/w1_evidence.py`, no `FIXED_METADATA`, no
   retiring the pinned `630` sentences.
3. **Fabricated/unsupported text policy: replace with real source text where the pinned witness carries it, label it
   where it does not.** In this PR that policy shows up as the wording rule in §5 — nothing more.
4. **`OUT-OF-CBETA`:** acquisition work orders get prepared for the highest-value documents; no agent fetches or
   transcribes any of those witnesses.

---

## 1. What is actually wrong

Six public claims name a work that does not hold the text. They are all **`coverage_note` / `cbeta_id` / manifest
`cbeta` strings** — the collation harness already tests most of these documents against the *right* witness, so
this PR aligns what the project *says* with what the project *measures*:

| document | false claim in the data | what the harness actually pins (`scripts/collate_corpus.py`) |
|---|---|---|
| `zhaozhou_yulu` | `cbeta_id: "T1987"`, `coverage_note: "15 signature encounter dialogues excerpted from T1987"`, `taisho_vol: 47`, `data/canonical_locators.json` | `(['T47n1987A','T47n1987B'], probes ['X68n1315'])` → **0/19 content fields collate anywhere** |
| `fayan_yulu` | `coverage_note: "8 canonical sermons and dialogues from T1985 / X1321"` | `(['T47n1991'], [])` — T47n1985 is the Linji record, X69n1321 is Mazu's |
| `dongshan_yulu` | `coverage_note: "8 canonical encounter dialogues excerpted from T1986 / X1321"` | `(['T47n1986A','T47n1986B'], [])` — X1321 is Mazu's |
| `mazu_yulu` | `coverage_note: "6 foundational sermons and dialogues from T1986 / X1321"` | `(['X69n1321'], [])` — T1986 is Dongshan's, and the count is **8**, not 6 |
| `dahui_hongzhi` | manifest `cbeta: "T1998A"` (one `cbeta_id` string only) | `(['T47n1998A','T47n1998B','T48n2001'], [])` — the 默照銘 the title presents sits in T48n2001 |

Every cell above is reproducible; run §2 before editing anything. Do not fix a row from this table by shortening a
sentence — the claim has to stop being said, in every file that repeats it.

---

## 2. Base check and measurement (paste all of it)

```bash
git rev-parse --short origin/main                    # must be 77b4039 (PR #42) or a descendant
python3 scripts/validate_data.py                     # run the checker FIRST: it owns two rules you must satisfy
grep -rn "T1987\|T1985 / X1321\|T1986 / X1321\|from T1986 / X1321\|\"cbeta\": \"T1998A\"" \
  --include="*.json" data/ | cat                     # every data-side occurrence you must account for
python3 - <<'PY'
import json
for k in ('zhaozhou_yulu','fayan_yulu','dongshan_yulu','mazu_yulu','dahui_hongzhi'):
    d = json.load(open(f'data/corpus/{k}.json'))
    print(k, '| cbeta_id =', d.get('cbeta_id'), '| taisho_vol =', d.get('taisho_vol'))
    print('   coverage_note =', d.get('coverage_note'))
m = json.load(open('data/corpus_manifest.json'))
for it in m['items']:
    if it['key'] in ('zhaozhou_yulu','fayan_yulu','dongshan_yulu','mazu_yulu','dahui_hongzhi'):
        print('manifest', it['key'], '-> cbeta =', json.dumps(it.get('cbeta'), ensure_ascii=False))
loc = json.load(open('data/canonical_locators.json'))
print('locators containing T1987:', json.dumps(loc, ensure_ascii=False).count('T1987'))
PY
python3 scripts/test_source_preservation.py 2>&1 | tail -2      # baseline: 218 permitted allowlisted changes
python3 -c "import json; m=json.load(open('data/project_metrics.json'))['corpus']; print('CJK content =', m['content_cjk_characters'], '| all-string =', m['all_corpus_cjk_characters'])"
grep -c "104,564" README.md AUDIT.md HANDOFF.md; grep -c "110,165" README.md AUDIT.md HANDOFF.md
```

Those last three lines are the tripwires §6 re-checks: any change to a `coverage_note` moves CJK graph counts, which
moves the two figures pinned in `README.md:48` and `AUDIT.md:20`. They must be **regenerated in this same PR**, never
left mid-edit.

---

## 3. Two hard interlocks, so plan the commits around them

- **`validate_data.py:793` — `canonical_id` must exactly match corpus `cbeta_id`.** So for `zhaozhou_yulu`, editing
  `cbeta_id` without editing `data/canonical_locators.json` in the *same commit* fails the gate. Same for any other
  document whose locator repeats the claim (`grep -c T1987 data/canonical_locators.json` → 2).
- **`validate_data.py:1286-1290` — a line that mentions `T1987` must also say it is the Caoshan record.** The
  rule lives in the framed documents (`README.md`, `AUDIT.md`, `HANDOFF.md` + `ROADMAP.md`,
  `.orchestrator/REMEDIATION_PLAN.md`, `index.html`/`docs/index.html`). Do not "solve" it by deleting the
  explanation from the docs: the docs' qualified sentences are the *correct* ones and stay. What becomes stale is a
  different clause — the parts that say the data **still carries** the false claim (`ROADMAP.md:65`, `:95`, `:178`,
  `README.md:55`'s "claims **T1987**" column, `RESEARCH_RELEASE_PLAN.md:109`). §7 commit 6 handles them.

---

## 4. What must not change

No source-text field is touched: nothing under any `zh`, `pinyin`, `verse_zh`, `commentary_zh`, `pointer_zh` or
`title_zh` key, and no `data/corpus/*.json` line that carries CJK **source** text. `corpus.content_cjk_characters`
must stay **104,564** in the regenerated metrics — if it moves, you edited the wrong thing, so stop and report.
`all_corpus_cjk_characters` **will** move (the notes are prose) and the two pinned document figures follow it.
`source_review_status` for all five documents stays `partial_or_failed_w1_collation`; no status is upgraded anywhere;
`data/project_metrics.json`'s `corpus.source_review` block still reports the 2026-09-10 overlay with 630 (ruling 2).
Both `sessions/` register files and every existing evidence file stay byte-identical. `scripts/collate_corpus.py`'s
witness table stays as it is — it is already right, and editing it would silently change future measurements.

---

## 5. The one judgement call: no new unverified witness claim

For `zhaozhou_yulu`, several documents say "the true in-set witness is X68n1315" (古尊宿語錄). **Two records disagree about
whether that is a supportable claim, and you must not settle it by picking one:**

- `.orchestrator/REMEDIATION_PLAN.md:87` — "`zhaozhou_yulu` (true witness X68n1315; **10/35 verbatim there**)", inherited
  from the 2026-09-09 audit that the 2026-09-10 correction later superseded.
- `sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json` → `documents.zhaozhou_yulu` — `probes: ["X68n1315"]`,
  `content_fields_collated: 0` of 19, and its `.title_zh` row carries `also_in: "X68n1315"` with `sim: 0.0`, which in
  this harness records a **name mention** (the anthology's catalogue), not a text match.

Prefer measuring it, which is cheap and read-only: in a **throwaway clone** (never in the PR working tree, and commit
nothing from it) point `scripts/collate_corpus.py`'s `zhaozhou_yulu` entry at `X68n1315` alone, run
`COLLATION_REFS=<your refs dir> python3 scripts/collate_corpus.py --register /tmp/probe.json`, and report
`content_fields_collated` / `fields_total` for that witness. Then:

- **If the content is verifiably in X68n1315** → re-point `cbeta_id` and the manifest `cbeta` to it *as a measured
  claim*, quoting your probe register path and counts in the commit message and in `data/corpus/zhaozhou_yulu.json`'s
  `cbeta_note`.
- **If it is not** → the fix is a **withdrawal, not a re-attribution**: state the candidate without asserting
  collation, and route the document to the human-sourcing queue. Do not let "the docs already say X68n1315" do the
  work of a measurement.

Either way `coverage_note` says plainly what is represented and what is not. Report both numbers even if one is
awkward, and never write a locator you did not read in the witness. Idiomatic qualified form for this corpus (see
`deshan_yulu`'s `"embedded: T2076 f.15 / X1565 f.7"`) — the withdrawal case looks like:

```
"cbeta_id": "claimed: X68n1315 古尊宿語錄 — unverified (0 of 19 content fields collate against the pinned extraction); the prior T1987 claim was false (T1987 is the Caoshan record)"
```

Write the equivalent wording for `taisho_vol` (drop the `47` that belonged to the false claim, or state it as the
prior claim — your choice, but it must not read as a verified locator) and for the manifest `cbeta` +
`canonical_locators` in the same commit. `coverage_note` says what the document represents and what the witness
measurement shows, in the same terms used for `cbeta_id`, so the two can never be read as separate claims. For the
other four documents, the correct witness is the one the harness pins, so name it: `fayan_yulu`
→ T47n1991 (plus X63n1226 for 宗門十規論, which its own `cbeta_note` already records), `dongshan_yulu` → T47n1986A/B,
`mazu_yulu` → X69n1321 with the count corrected to 8, `dahui_hongzhi` → T47n1998A/B **and** T48n2001 for the
默照銘. Do not invent a page/line locator while you are in there: if you want one, it needs a source, and that is
queued owner work (ruling 4).

---

## 6. Allowed paths (hard scope)

Modified: `data/corpus/{zhaozhou_yulu,fayan_yulu,dongshan_yulu,mazu_yulu,dahui_hongzhi}.json`,
`data/corpus_manifest.json`, `data/canonical_locators.json`, `data/editorial/traceability_queue.json` and
`data/lineage/lineage_verification.json` **if and only if** they carry the same false string (they do: `grep`
counts 2 and 1), `data/project_metrics.json` **only** via `python3 scripts/validate_data.py --write-metrics`,
`scripts/test_source_preservation.py` **only** its allowlist pointer list, `docs/**` **only** as the
build-generated mirror, and the documents named in §7. Frozen: `scripts/collate_corpus.py`,
`scripts/collate_refs.py`, `scripts/w1_evidence.py`, `scripts/validate_data.py`, `scripts/test_source_review_rules.py`,
`app.js`/`app.css`/`theme-init.js` (never hand-edit `docs/app.css`), `schemas/**`, `.github/workflows/**`,
`sessions/**`, and every `data/corpus/*.json` field carrying CJK source text. If completion seems to require a frozen
file, stop and report what and why.

---

## 7. Commits (five fixes + two bookkeeping)

1. `fix(citation): zhaozhou_yulu — drop the false T1987 witness claim` — corpus record (`cbeta_id`, `taisho_vol`,
   `coverage_note`), its manifest `cbeta`, its `canonical_locators` entry (keep `canonical_id` matching), plus the
   `traceability_queue`/`lineage_verification` occurrences **for this document only**.
2. `fix(citation): fayan_yulu — coverage_note named the Linji and Mazu records`
3. `fix(citation): dongshan_yulu — coverage_note named the Mazu record`
4. `fix(citation): mazu_yulu — coverage_note named the Dongshan record and undercounted its fields`
5. `fix(citation): dahui_hongzhi — manifest citation omitted T48n2001, the 默照銘 witness`
6. `docs: record that the six false citations are gone` — mark `ROADMAP.md:178` delivered in the same form `:179`
   uses for PR #40 (with this PR's number, read back per commit 7); retire the clauses that said the data *still*
   carries the claims (`ROADMAP.md:65`, `:95`; `README.md:55`'s table cell; `RESEARCH_RELEASE_PLAN.md:109`); update
   `.orchestrator/REMEDIATION_PLAN.md:47`, `:87` and the `:167` wave-2 checkbox to whatever §5's measurement settled —
   including the "10/35 verbatim there" figure, which the 2026-09-12 register does not support; the regenerated
   CJK figures in `README.md` / `AUDIT.md` / `HANDOFF.md`, and any `ROADMAP.md:161` framing that quoted the old counts.
   Then align the supersession framing with ruling 2 — the one place this PR touches a sentence about the ledger:
   `AUDIT.md:30` ends "only the post-remediation evidence pass may supersede the register" and `HANDOFF.md:72` says
   "register superseded only by the post-remediation evidence pass", but the pass has since been published (PR #41)
   and the owner ruled that it does **not** supersede 630; both must state the ruling instead of a pending
   expectation, and `HANDOFF.md:89`'s "designation held for an owner ruling" becomes "owner ruled 2026-09-12: 630
   stays authoritative". Leave `HANDOFF.md:71`'s `w1-evidence:` line alone. Keep every gate-pinned string verbatim: the five-ledger sentence, the
   `**35 documents, 630 flagged source fields**` snippet, both register paths, `2026-09-09`, and — where the file
   requires them — the three generated disclosure sentences and the `622|637` + `CORRECTED|superseded` pair in
   `STATE.md`. If a correction appears to *require* editing a pinned sentence, the pin — not the sentence — is what
   is stale: stop and report it, and never edit `scripts/validate_data.py` to get a green gate.
7. `docs: record the 2026-09-12 owner rulings in the canonical tracker` — one `.orchestrator/STATE.md` entry stating
   all four rulings, each with what it authorises and what it forbids (no re-designation; no agent handling of
   out-of-CBETA witnesses), and this PR's number. Read the number back with `gh pr view --json number` after opening
   and amend it in this commit — no `#NN` placeholders in a committed tracker line.

Allowlist pointers go in the commit that changes the file they describe, never in a later "fix the gate" commit.

---

## 8. Gates — all exit 0, in a real clone (never a `git worktree` or archive export)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py --write-metrics        # legitimate data change: regenerate deterministically
python3 scripts/validate_data.py                        # then verify the regenerated file passes plain validation
python3 scripts/build_data_bundle.py
git diff --exit-code data docs/app_data.js docs/app.css docs/index.html   # mirror must be build-generated
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
diff -rq data docs/data
git diff --check
python3 - <<'PY'
import json, subprocess, pathlib
m = json.load(open('data/project_metrics.json'))['corpus']
assert m['content_cjk_characters'] == 104564, m['content_cjk_characters']   # no source text moved
files = subprocess.check_output(['git','diff','--name-only','origin/main...HEAD']).decode().split()
allowed = ('data/','docs/','scripts/test_source_preservation.py','README.md','AUDIT.md','HANDOFF.md',
           'ROADMAP.md','RESEARCH_RELEASE_PLAN.md','.orchestrator/STATE.md')
bad = [f for f in files if not f.startswith(allowed)]
assert not bad, bad
for f in ('README.md','AUDIT.md','HANDOFF.md','ROADMAP.md','.orchestrator/REMEDIATION_PLAN.md'):
    t = pathlib.Path(f).read_text(encoding='utf-8')
    for s in ('**35 documents, 630 flagged source fields**','COLLATION_REGISTER_2026-09-10_CORRECTION.json',
              'COLLATION_REGISTER_2026-09-09.json'):
        assert s in t, (f, s)
print('scope, metrics and pinned strings OK; all-string CJK =', m['all_corpus_cjk_characters'])
PY
grep -rn "excerpted from T1987\|from T1985 / X1321\|excerpted from T1986 / X1321\|from T1986 / X1321" data/ || echo "all five false claims are gone from data/ ✓"
```

Then confirm the two regenerated figures agree everywhere: `grep -c "<new all-string value>" README.md AUDIT.md
HANDOFF.md` must each be ≥1 and `data/project_metrics.json → corpus.all_corpus_cjk_characters` must equal it. A
`README.md` still showing `110,165` while metrics says otherwise is the single most likely way this PR fails review.

---

## 9. Report

Paste: §2 in full; for each of commits 1-5, a two-line before/after of the exact strings changed; the
`--write-metrics` diff (`git diff data/project_metrics.json`) with the CJK line highlighted and `content` proven
unchanged; the allowlist diff (`git diff scripts/test_source_preservation.py`) showing exactly the pointers added,
one line per changed field; all gate exits; the §8 assertion block's output; and one paragraph stating what this PR
**did not** do — no status change, no re-designation, no new locator, no source-text edit, no new witness asserted as
verified. Then stop: do not merge, do not rebase onto `main`, do not push to `main`.

---

## 10. Non-goals

Re-keying any CJK field (that is the `RE-KEY`/`LABEL` queue, one document per PR, unchanged); the 11 `RE-KEY` and 51
`LABEL` rows; any `title_zh` composite-title change; the deferred visual-system reset; `OUT-OF-CBETA` sourcing
(ruling 4 produces *work orders*, not witnesses); the ledger re-designation and anything touching
`scripts/w1_evidence.py` or the 630 sentences (ruling 2); repairing `scripts/collate_corpus.py`'s stale acquisition
docstring or the 2026-09-10 report's §7 `cmp` claim (both known, both reported-not-fixed by design); and any
`canonical_locators.json` upgrade for the 33 document-level seeds.
