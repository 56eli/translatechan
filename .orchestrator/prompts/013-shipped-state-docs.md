# Task 013 — Say what shipped: close the presentation and register claims that `main` still lists as owed

Working in `56eli/translatechan`. Owner directive 2026-09-12: *"update ALL documentation to the status quo."*
PR #40 shipped the note renderer and PR #41 published the post-remediation register; both are merged. **Four
documents still tell readers that neither happened.** This is a docs-only PR with nothing to design — nine known
locations, each already carrying the true state in a sibling sentence, plus two stale measured figures.

Read §1.3 before touching `vision.md`: one of its "verify" scripts now measures the wrong thing, and that is the
most valuable fix in this PR.

---

## 1. The defect, measured on `main`

### 1.1 Claims that are now false

| file:line | what it says | what `main` does |
|---|---|---|
| `ROADMAP.md:33` | "the corpus carries **49** provenance notes and the reader renders **one** site, so most labels never reach a reader" | renders all three passage-level keys at 17 call sites |
| `ROADMAP.md:163` | half (1): "renders **one** site … 16 recorded citation corrections and 8 labels … are invisible … `platform_sutra`'s root recension note … is unreachable … Rendering every note the data carries is queued work and is release-blocking" | shipped by #40; `RESEARCH_RELEASE_PLAN.md` blocker 2 is now closed |
| `ROADMAP.md:179` | "**Render the labels that already exist**: 49 provenance notes …, 1 rendered site … Until this ships, disclosure that exists in the data does not reach a reader" | it shipped |
| `RESEARCH_RELEASE_PLAN.md:32` | "… across 26 documents, and the reader renders **one** site. Blocker 2 below." | as above |
| `RESEARCH_RELEASE_PLAN.md:103` | `- [ ]` **2. Label visibility in the reader.** … "are never rendered … is unreachable" | every clause of its own *Exit* is met (§3.4 lists them one by one) |
| `vision.md:59` | "**What does not render yet — the objective's open gap.** … the reader surfaces one of them … are never rendered at all" | shipped |
| `vision.md:75` | "Until that gap closes, objective 4's disclosure element is **partial, not met** … the next presentation work package (**not started as of 2026-09-12**)" | met as to implementation; see §1.2 for the one caveat that must stay |
| `vision.md:309` | "Owed: … **rendering the 49 provenance notes the corpus carries** — the reader surfaces one of them (§1.1)" | no longer owed |
| `vision.md:315` | `- [ ]` "Surface every provenance label the data carries … currently 49 notes in data, 1 rendered site." | `- [x]` with the caveat phrasing of its neighbour `:314` |

Two stale **figures** ride along, both produced by commands a reader can run:

- `vision.md:55` and `ROADMAP.md:248` say `scripts/test_source_review_rules.py` runs **96** rule checks. The test
  prints its own count: **`120 W1 source-review rule checks passed`** on `main` (it grew when #40 added the
  note-render invariant). §2 prints it.
- `vision.md:59`'s `platform_sutra` arithmetic: it says the root note sits beside "its **12** chapter/dialogue
  notes". The register/data give **14** `recension_note` values = 1 root + 3 verse + **6 chapter + 4 dialogue** (so
  10 chapter/dialogue, 13 non-root). §3.3 prints the breakdown. Do not carry 12 forward to "look consistent".

`.orchestrator/STATE.md:39` on `main` already states the shipped state precisely (17 content sites, 3 → 38 rendered
note lines, `coverage_note` as an explained exemption, `104,564 / 110,165` unmoved). **Match its numbers** — it is
the tracker of record and it survived my own independent verification at review time. Prefer citing it over
re-deriving phrasing.

### 1.2 The one limit that must survive every `[x]` you write

Nothing on `main` evidences this in a real browser: `scripts/browser_test.mjs` has never run (no Chromium; the
2026-08-11 attempt died with `ECONNRESET`), and `RESEARCH_RELEASE_PLAN.md:40` records exactly that convention for the
suite. So the honest form is the one the repo already uses at `vision.md:314`:

> *Implemented and gate-guarded; no real-browser evidence exists, so it is not browser-verified.*

Every box you tick gets that qualifier or equivalent. **A `[x]` that implies a browser saw it is a new defect
replacing an old one** — the whole point of this PR is that prose tracks evidence.

### 1.3 Do not tick release blocker 1

`RESEARCH_RELEASE_PLAN.md:102` (post-remediation evidence pass) is **half** delivered: #41 published the dated
register and report, but its *Exit* also requires `data/project_metrics.json` regenerated via `--write-metrics` and
the gate-pinned figures in `README.md` / `AUDIT.md` / `HANDOFF.md` / `ROADMAP.md` re-pointed at the new record. That
is a re-designation of the evidence, and `scripts/w1_evidence.py:101-113`/`:752-758` pin exactly one historical
register plus one `w1-correction` overlay, so it cannot move without a deliberate, owner-ruled change to the
evidence model. Leave `- [ ]`, and rewrite the item so it states which half is done and which is held — with the
`documents_with_changed_status: 0` outcome from the new register, because a reader will otherwise ask whether the
re-measurement moved anything. It did not: statuses stay 1 / 32 / 2.

---

## 2. Base check (run all of it; paste the output)

```bash
git rev-parse --short origin/main                     # must be 0f8432a (PR #41) or a descendant
git merge-base --is-ancestor 0f8432a HEAD && echo "base ok"
python3 scripts/validate_data.py                      # run the checker FIRST; it owns the strings you must not move
python3 scripts/test_source_review_rules.py 2>&1 | tail -2      # → "120 W1 source-review rule checks passed"
python3 scripts/test_source_preservation.py 2>&1 | tail -2      # → "35 corpus files compared / 218 permitted…"
python3 - <<'PY'
import json, glob, collections
c = collections.Counter(); docs = collections.defaultdict(set)
def walk(o, doc):
    if isinstance(o, dict):
        for k, v in o.items():
            if k.endswith('_note') and isinstance(v, str) and v.strip():
                c[k] += 1; docs[k].add(doc)
            walk(v, doc)
    elif isinstance(o, list):
        for v in o: walk(v, doc)
for f in sorted(glob.glob('data/corpus/*.json')):
    walk(json.load(open(f, encoding='utf-8')), f.split('/')[-1][:-5])
print('total', sum(c.values()), 'notes:', dict(c))
print('documents carrying a rendered key:', len(docs['cbeta_note'] | docs['editorial_note'] | docs['recension_note']))
print('documents carrying any note:', len(set().union(*docs.values())))
js = open('app.js', encoding='utf-8').read()
print('PROVENANCE_NOTE_KEYS =', js.split('PROVENANCE_NOTE_KEYS = ')[1].split('\n')[0])
print('renderProvenanceNotes lines (1 def + call sites):', js.count('renderProvenanceNotes('))
PY
```

Expected on a correct base: `49` total with `{cbeta_note: 16, recension_note: 14, coverage_note: 11,
editorial_note: 8}`; **22** documents carrying a rendered key and **26** carrying any note — *both* numbers are
correct and mean different things, so never "harmonise" them; `PROVENANCE_NOTE_KEYS = ['recension_note',
'editorial_note', 'cbeta_note']`; **18** matching lines = 1 definition + **17** call sites. `218 permitted changes`
is current — do not "fix" it. If any number disagrees, the base moved: stop and re-sync rather than publishing your
own count into four documents.

---

## 3. What to change

### 3.1 One rule for every replacement

Write the *measured* state, not a victory lap. Each edited sentence must (a) name what is now true, (b) name the
artifact that makes it true (`app.js`'s `PROVENANCE_NOTE_KEYS`, `scripts/test_source_review_rules.py` §15,
`sessions/COLLATION_W1_2026-09-12_POSTREMEDIATION.md`), and (c) keep the exclusion honest — `coverage_note` is
deliberately *not* a passage label and is exempted with a recorded reason
(`NOTE_RENDER_EXEMPTIONS` in `scripts/test_source_review_rules.py`), so no sentence may claim "all 49 notes render".
38 rendered lines out of 49 is the true shape; say it that way.

### 3.2 `vision.md`

- `:55` — 96 → the count §2 prints. Leave `218` and the `--skip-docs` description alone.
- `:59` — replace the "What does not render yet" paragraph with the shipped state: which keys render, at how many
  sites, with what precedence, and that `coverage_note` stays in the dossier ledger by recorded exemption. Keep the
  substance that made the old paragraph worth reading — the `caoxi_zhuan` `X1458` → `X86n1598` correction and the
  `linji_yulu` 71–73 / `xinxin_ming` stanza 31 retelling labels are now *visible*; name them as examples of what the
  gate now protects, not as an apology. Fix the `platform_sutra` note arithmetic per §1.1.
- `:59`'s script — it prints `app.js mentions=` for each key, which stopped meaning "rendered" the moment #40 put
  `coverage_note` in an explanatory comment and the three rendered keys in one constant: mention counts now flatter
  the reader. Replace it with a script that measures the actual contract — parse `PROVENANCE_NOTE_KEYS`, count
  `renderProvenanceNotes(` call sites, and print `NOTE_RENDER_EXEMPTIONS`' keys from
  `scripts/test_source_review_rules.py` — then assert the invariant the repo promises: every `*_note` key present in
  `data/corpus/*.json` is either in the precedence list or exempted. Run it; paste its output; commit it only if the
  assertion holds on `main`.

  This one is written and verified green on `0f8432a` — use it, re-running it yourself first:

  ```python
  import json, glob, re, collections
  js = open('app.js', encoding='utf-8').read()
  rendered = tuple(k.strip().strip('"\"') for k in
                   re.search(r"PROVENANCE_NOTE_KEYS = \[(.*?)\]", js).group(1).split(','))
  sites = js.count('renderProvenanceNotes(') - 1          # minus the definition
  test = open('scripts/test_source_review_rules.py', encoding='utf-8').read()
  body = re.search(r"NOTE_RENDER_EXEMPTIONS: dict\[str, str\] = \{(.*?)\n\}", test, re.S).group(1)
  exempt = set(re.findall(r'^\s{4}"([a-z_]+)":', body, re.M))
  keys = collections.Counter()
  for f in glob.glob('data/corpus/*.json'):
      for k, v in re.findall(r'"([a-z_]+_note)"\s*:\s*"([^"]*)"', open(f, encoding='utf-8').read()):
          if v.strip(): keys[k] += 1
  print(f'rendered={rendered} call_sites={sites} exempt={sorted(exempt)}')
  print('per-key:', dict(keys))
  orphans = sorted(k for k in keys if k not in rendered and k not in exempt)
  print('ORPHANS:', orphans or 'none — every key is rendered or exempted')
  assert not orphans, orphans
  print(f'asserted: {sum(keys[k] for k in rendered)} of {sum(keys.values())} note strings render beside a passage')
  ```

  Its output — `17` call sites, `['recension_note', 'editorial_note', 'cbeta_note']`, `coverage_note` exempt, and
  **38 of 49** note strings rendering beside a passage — is the sentence you write into the three documents.
- `:75` — objective 4's disclosure element becomes met *as to implementation and gating*, with §1.2's browser caveat
  and a pointer that the gate is permanent (`test_source_review_rules.py` §15 enumerates note keys from the data at
  run time, so a future orphan fails CI).
- `:309` — remove label-rendering from "Owed", keeping exact unit locators (33 seeds), the 14-source rights review,
  and the 6 `CITATION` rows. Replace it with what *is* owed on the evidence side: the re-designation of §1.3.
- `:315` — `[x]` + the §1.2 qualifier, in the same parenthetical shape as the hover/focus item at `:314`

### 3.3 Numbers you may cite, and where each comes from

| figure | value on `main` | source to name |
|---|---|---|
| note strings / rendered keys | 49 total; 38 rendered, 11 exempt | §2 script over `data/corpus/*.json` |
| render call sites | 17 | `grep -c "renderProvenanceNotes(" app.js` minus 1 |
| precedence | `recension_note` → `editorial_note` → `cbeta_note`, one line each | `app.js:1600` |
| `platform_sutra` notes | 14 = 1 root + 3 verse + 6 chapter + 4 dialogue | walk `data/corpus/platform_sutra.json` |
| rule checks | 120 | the test's own line |
| register figures | 532 flagged, 691/924 content collated, statuses 1/32/2, changed statuses 0 | `sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json` |
| authoritative figures | 630 flagged, 593/924 | `data/project_metrics.json` (unchanged; the pinned sentences) |
| CJK totals | 104,564 content / 110,165 all-string | pinned at `README.md:48`, `AUDIT.md:20` — must not move |

### 3.4 Blocker 2's box: tick it against its own exit criteria

In `RESEARCH_RELEASE_PLAN.md:103`, keep the item text as the historical statement of the problem, then record each
*Exit* clause as met with its evidence: one shared renderer reusing the muted-note markup and `escHtml`; every node
type that carries a note (document root, preface/epilogue, case, section, dialogue, stanza, chapter, nested verse);
precedence in a single constant; the data-driven gate failing on an orphan key; zero data bytes and zero CJK
movement (`git diff --stat` on your own PR proves the docs-only scope; the CJK figures prove the rest). Add the
§1.2 caveat sentence. Then `:32`'s summary line must match the ticked state — same words, same qualifier, one place
each.

### 3.5 `HANDOFF.md:87-92` — "What's next — four items"

Two of the four are now history. Keep the list at four items (its count is load-bearing prose) and move each item to
the truth: label visibility → delivered by #40 with its gate; post-remediation evidence pass → **measurement
published** by #41 with its two `sessions/` paths, **designation held** for the owner ruling per §1.3; the
fabricated-text decision and the 31-document `OUT-OF-CBETA` queue → unchanged, still owner-held and explicitly not
agent-authorisable. The completion paragraph at `HANDOFF.md:85`, above the list, is still true — leave it alone rather
than widening it into a status upgrade. `HANDOFF.md` is a validator-framed document: the five-ledger
sentence, the verbatim `**35 documents, 630 flagged source fields**` string, both register paths, `2026-09-09`, and
the three generated disclosure sentences stay byte-identical.

### 3.6 `.orchestrator/STATE.md` — two small repairs

1. Find every tracker line that defers a status to the pass, by pattern rather than by my line numbers:
   `grep -rn "post-remediation evidence pass" --include="*.md" . | grep -v "^./sessions/"` — on `0f8432a` that
   is four lines ending "pending the separate post-remediation evidence pass" (`:21`, `:23`, `:25`, `:27`) and one
   ending "until the post-remediation evidence pass" (`:59`), all in `.orchestrator/STATE.md`. The pass ran: append
   to each the outcome in the register's own words — re-adjudicated 2026-09-12,
   `documents_with_changed_status: 0`, status unchanged — rather than deleting the history.
2. Add one dated entry for this PR in the style of `:39`, listing which claims were corrected and citing the two
   merged PRs. No `#NN` placeholders anywhere: push, read back your PR number with `gh pr view --json number`, and
   amend it in a final `docs:` commit.

---

## 4. Allowed paths (hard scope)

Modified: `vision.md`, `ROADMAP.md`, `RESEARCH_RELEASE_PLAN.md`, `HANDOFF.md`, `.orchestrator/STATE.md`. **Nothing
else.** Frozen: every path under `data/` and `docs/`, every `scripts/**` file, `app.js`, `schemas/**`,
`.github/workflows/**`, and **every existing file under `sessions/`** — including the two records #41 just published,
which are append-only evidence and must not gain a sentence. `README.md`, `AUDIT.md` and
`.orchestrator/REMEDIATION_PLAN.md` are not in this PR's list: if you believe one of them needs a matching edit,
stop and report the line instead of expanding scope.

---

## 5. Gates — all exit 0, in a real clone (never a `git worktree` or archive export)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py
git diff --exit-code data docs
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
diff -rq data docs/data
git diff --check
git diff --name-status origin/main...HEAD          # must print only the 5 paths of §4 (plus your #NN amend)
for f in README.md AUDIT.md HANDOFF.md ROADMAP.md .orchestrator/REMEDIATION_PLAN.md; do
  printf "%-34s 630=%s authreg=%s histreg=%s ledger=%s\n" "$f" \
    "$(grep -c '\*\*35 documents, 630 flagged source fields\*\*' $f)" \
    "$(grep -c 'COLLATION_REGISTER_2026-09-10_CORRECTION.json' $f)" \
    "$(grep -c 'COLLATION_REGISTER_2026-09-09.json' $f)" \
    "$(grep -c 'keeps \*\*five separate, always-visible ledgers\*\*' $f)"
done
python3 -c "import pathlib; [print(f, pathlib.Path(f).read_text().count(t)) for f, t in
  [('README.md','104,564'), ('README.md','110,165'), ('AUDIT.md','104,564'), ('AUDIT.md','110,165')]]"
```

`smoke_test.mjs` reports a `validate_data.py` failure as a bare number, so run the checker first. After the rebuild,
`git status --porcelain` must be empty. The last two blocks are the drift tripwires: every count must be unchanged
from what §2's `validate_data.py` pass implies, and `104,564` / `110,165` must each still appear exactly as often as
they did at your base (print the base counts too, and show they match).

---

## 6. Commits

Three, each independently reviewable:

1. `docs: record the shipped note renderer in vision and the roadmap` — `vision.md`, `ROADMAP.md`.
2. `docs: tick label visibility and split the evidence-pass blocker in the release plan` —
   `RESEARCH_RELEASE_PLAN.md`, `HANDOFF.md`.
3. `docs: repair the pending-evidence-pass tails in the canonical tracker` — `.orchestrator/STATE.md`
   (plus, if needed, your final `docs:` amend carrying the PR number).

Every doc-truthfulness-bearing file changes in exactly one commit; no reformatting of lines you did not come to
change; no scoreboard references; do not generate a "before/after" table that re-quotes the old false sentence at
length — one short clause of context is enough.

---

## 7. Report

Paste: the §2 output; the per-location diff (`git diff -U1` for each of the five files); the §5 gate block with the
two tripwire count blocks shown at base *and* at HEAD; the §3.2 replacement script's output; and a one-paragraph
statement that blocker 1 remains unticked with the reason. Then stop: do not merge, do not rebase onto `main`, do not
touch `sessions/`.

---

## 8. Non-goals

Rendering code of any kind (the renderer is shipped; do not improve it, refactor it, or add a note key); any CSS,
layout, or the deferred visual-system reset; `title_zh` composite titles (a separate PR, still unwritten); the
`platform_sutra` text decision; the six `CITATION` rows; the 51 `LABEL` / 11 `RE-KEY` rows; the 31-document
`OUT-OF-CBETA` queue; re-designating the ledger or regenerating `data/project_metrics.json` (`--write-metrics` is
mentioned only to explain what blocker 1 still owes — do not run it); editing `scripts/w1_evidence.py` or
`scripts/validate_data.py`; adding new numbers of your own — if a figure you want is not in §3.3, it does not go in.
