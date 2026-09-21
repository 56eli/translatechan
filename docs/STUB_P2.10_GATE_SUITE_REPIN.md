# Stub P2.10 — Re-pin the three pinned suites to the 13-document corpus

> **STATUS — COMPLETED 2026-09-21 (combined overlay):** the three pinned suites were repinned to the **14-document** combined corpus in the same branch as the Wumenguan + Linji overlay — `test_source_preservation.py` (base repinned to f1207eaf, both re-keys declared in `DECLARED_NEW_CORPUS`), `test_source_review_rules.py` (AUTH_REGISTER/CORRECTION_REPORT → `COLLATION_REGISTER_2026-09-21_WUMENGUAN_LINJI.json`, partition originals 4717/4223) and `smoke_test.mjs` (14-item manifest pin, 12/0/2 counts, WUMENGUAN_LINJI authoritativeEvidence paths, Linji pins). This stub describes the 13-document-era plan as written.

**Priority:** High — `main` currently merges red. `.github/workflows/quality.yml` runs
`validate_data.py` (green), `build_data_bundle.py` (green, deterministic), then
`test_source_preservation.py`, `test_source_review_rules.py` and `smoke_test.mjs`. All three of
those still pin the **pre-purge 44-document set** and fail on the committed history
(`f1207ea`) *and* on any branch carrying the 2026-09-21 purge/re-key work. Verification that
these are pre-existing, and not regressions from the Linji work, was done this session by
running each suite in a clean clone of `f1207ea` — see §4.

**Scope note:** this is deliberately **not** part of P2.9 (Linji re-key). P2.9 moved only the
*evidence pointers* the suites should follow (the authoritative register/report/refs-manifest
paths and the status counts), because those are P2.9's own outputs. Everything below is the
structural re-pin: which documents the suites exercise, which register keys they mutate, which
byte totals they assert, and how a purge and a declared-new document are expressed at all.

---

## 1. `scripts/smoke_test.mjs` — 13-item manifest repin + purged-document behaviour pins

**Already repinned for P2.9** (lawful, because these values are P2.9's own evidence contract):

| location | was | now |
|---|---|---|
| `manifestItems.length !== 44` (+ message) | 44 | 13 |
| `expectedSourceReviewCounts` | `10 / 32 / 2` | `11 / 0 / 2` |
| `authoritativeEvidence` paths | `…ENTHUSIAST_100PCT.{md,json}` + `…ENTHUSIAST_100PCT_refs_manifest.txt` | `sessions/COLLATION_W1_2026-09-21_LINJI.md`, `sessions/COLLATION_REGISTER_2026-09-21_LINJI.json`, `sessions/COLLATION_W1_2026-09-21_LINJI_refs_manifest.txt` |
| `authoritativeEvidence` counts | `44 / 630` | `13 / 15` |
| `corpus_files`, `canonical_locators` doc count, `per_text` count, `restoredCount` | 44 | 13 |
| `per_text` coverage expectations | included `wumenguan`, `biyanlu_cases`, `platform_sutra` | purged keys dropped, `['linji_yulu', '107/107 sections']` added |
| ledger register path (`for (const required of [...])`) | `…ENTHUSIAST_100PCT.json` | `…LINJI.json` |
| Wumenguan completion/status conflict block (`savedWumenguanCompletion` …) | — | **deleted**: Wumenguan is not in the corpus, and `wumenguanManifestItem` is `undefined` |

With those edits applied, the **whole manifest/evidence header runs clean except two rules**
(measured this session, 2026-09-21; the probe ran the header with every `throw` downgraded to a
collected log so a single run reports every red):

1. `witness works absent from the published refs manifest` — the rule parses every claimed
   witness id out of `scripts/collate_corpus.py`'s `DOCS` table and requires each one to be a
   line in the authoritative refs manifest. `DOCS` still carries 23 works the harness can
   collate for documents that **no longer exist in the corpus** (the 32 purged retellings) plus
   works that were never in the reduced manifest (`T48n2005`, `T48n2010`, `T48n2003`,
   `T48n2008`, `T48n2007`, `T47n1991`, `T47n1989`, `T47n1990`, `T48n2009`, `T48n2025`,
   `X63n1245`, `T45n1858`, `T51n2075`, `X63n1223`, `X63n1224`, `X69n1323`, `X67n1309`,
   `X69n1333`, `X73n1445`, `X73n1446`, `X86n1598`, `T47n1997`, `X69n1357`).
   **Repair options** (pick one, in order of preference): (a) scope the rule to the *active*
   manifest keys' claimed witnesses — i.e. intersect the parsed harness works with the witness
   ids the active corpus documents actually claim (`data/canonical_locators.json` +
   `corpus_manifest.json` items), which keeps the anti-staleness intent ("a declared witness
   must have a digest line") without demanding lines for deleted documents; or (b) keep the
   rule global and add the missing works' digest lines to the authoritative refs manifest —
   but that would re-introduce digests for the purged documents' witnesses, which the purge
   deliberately dropped, so (a) is the honest fix.
2. `editorial completion status must distinguish W1-contained witnesses from represented unit
   counts` — the pin names four purged documents (`wumenguan`, `xinxin_ming`, `biyanlu_cases`,
   `platform_sutra`). Re-point it at documents that exist and carry the same intended
   distinction: e.g. `congronglu` (100/100 cases, `partial_selected_witness`,
   `collated_to_claimed_witness`) and `zhaozhou_yulu_full` (80/80, same pair) must render
   `is_complete === false` while their unit counts stay represented, and `zhengdao_ge` /
   `niutou_juezhu` / `hanshan_poems` (excerpt seeds, `witness_unavailable`) must not render a
   complete mark.

**Body still fails ~44 checks** that exercise purged documents directly. Verified list
(2026-09-21 probe, first 40): `corpusClicks.xinxin_ming is not a function`,
`corpusClicks.platform_sutra is not a function`, full-schema search misses for
`平台… / 早知是火`, `Wumenguan commentary/verse labels missing`, `Wumenguan epilogue must render
after the case units`, `Biyanlu sparse prev/next navigation is incorrect`, `Biyanlu case 4/6/8 …
content missing`, `Biyanlu commentary/verse labels are not collection-specific`, `corpus
selection was not persisted`, `case strip has 100 chips (expected 48)`, `load-more button still
present after all cases loaded`, `Wumenguan coverage disclosure missing`, `mobile corpus picker
not populated`, `4ff: missing Partial witnesses (13) shelf group`, `4ff: missing Excerpt seeds
(31) shelf group`, `4hh: corpus filter "wumenguan" …`, `4ii: literary document
heading/breadcrumb is incomplete`, `4ee: Sengcan dossier should link to xinxin_ming (T2010)`,
`Print/PDF did not receive all 48 cases followed by the epilogue`, `reader missing case 1
pinyin line`, … (44 total). Each needs a 13-document counterpart: the Biyanlu/Wumenguan/Xinxin
Ming/Platform behaviour pins should be re-pointed at an equivalent surviving document with the
same shape (case-level: `congronglu`, `zhaozhou_yulu_full`, `dahui_yulu_full`; stanza-level:
`zhengdao_ge`; chapter/section-level: `linji_yulu`), and the shelf/filter/case-strip counters to
the live numbers (`10 partial selected witness`, `3 excerpt seeds`, `107` Linji sections).

**Do not** simply delete the purged pins: the suite is the only automated check that the Reader
renders the five ledgers, the W1 badge, source disclosures and search for the Live corpus. The
repair is a re-point, not a pruning.

## 2. `scripts/test_source_review_rules.py` — mutation matrix still keys `wumenguan`

```
scripts/test_source_review_rules.py:185  register["documents"]["wumenguan"]["fields_total"] += 1
KeyError: 'wumenguan'
```

The matrix mutates the **authoritative register** to prove `--write-metrics` refuses forged
totals. `wumenguan` is no longer a register key. Repairs:

- `mutation_fields_total`, `mutation_content_fields_and_aggregate` and any other `wumenguan`
  mutation target → a key that exists in `sessions/COLLATION_REGISTER_2026-09-21_LINJI.json`
  (e.g. `congronglu` or `linji_yulu`).
- The hard-coded totals at line ~171 — `metrics["content_fields_total"] == 5368`,
  `metadata_fields_total == 4444` — belong to the 44-document era; the live values are
  `content_fields_total = 4566`, `metadata_fields_total = 4167` (see
  `data/project_metrics.json` → `corpus.source_review`). These must be **read from the
  register** in the test, not re-typed, so the next re-key cannot re-break the suite.
- After the mutation targets move, re-check that each matrix case still produces the *expected
  refusal message*; the partition case asserts `"cited digest no longer matches" not in output`,
  which depends on the register's citation block — verify against the LINJI register.

## 3. `scripts/test_source_preservation.py` — the base-commit comparison needs purge and re-key declarations

```
scripts/test_source_preservation.py   FileNotFoundError: …/data/corpus/wumenguan.json
```

Two distinct rules fail:

1. **`corpus files are never deleted by W1 work`** — `base_files - current_files` is 32 files
   (the purge). The purge was an owner directive, so the test needs the same kind of declaration
   `DECLARED_NEW_CORPUS` already provides, e.g. an `ALLOWED_PURGED_CORPUS` map
   (`key → the dated ruling that removed it`, here the 2026-09-21 purge commit `a6972c1`)
   which prints an `ℹ️` line and skips the failure, mirroring `DECLARED_NEW_CORPUS`'s docstring
   style.
2. **`data/corpus/linji_yulu.json` is new since the base commit** — needs a `DECLARED_NEW_CORPUS`
   entry in the established style: the producer (`scripts/segment_linji_yulu.py`), the pinned
   witness (T47n1985, CBETA XML P5 `dbdea410…`), the tiling assertion (107 units, all 16,366
   CJK characters, concatenation == reference extraction), the measured collation
   (`scripts/collate_corpus.py --doc linji_yulu`: 215/215 EXACT, 0 flagged) and the declared
   evidence (`sessions/COLLATION_REGISTER_2026-09-21_LINJI.json`).
3. **The nested-regression self-test** (`focused_allowlist_regression`, line ~1279) mutates
   `data/corpus/wumenguan.json`'s `.cases[0].coverage_note` to prove an undeclared nested
   `coverage_note` fails. With only `zhengdao_ge`, `niutou_juezhu` and `hanshan_poems` surviving
   from the base tree (the other ten documents are declared-new), and none of the survivors
   carrying a `cases` array, the mutation target must move to an equivalent undeclared nested
   string pointer on a surviving document (e.g. `.stanzas[0].coverage_note` for `zhengdao_ge`,
   or `.poems[0].coverage_note` for `hanshan_poems`) — the assertions that name the exact
   pointer and that `0 unauthorized changes` must not appear stay as they are.
4. Note the base commit is pinned to `3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43` ("the tree W1
   work started from"). Do **not** move it to a post-purge commit: the purge and the re-key are
   exactly the changes the allowlist exists to declare.

## 4. Evidence that these are pre-existing reds (do not re-diagnose)

Run in a clean clone of the committed commit, 2026-09-21:

```bash
git clone /home/user/translatechan /tmp/headcheck && cd /tmp/headcheck   # HEAD = f1207ea
python3 scripts/test_source_preservation.py     # → FileNotFoundError …/data/corpus/wumenguan.json
python3 scripts/test_source_review_rules.py     # → KeyError: 'wumenguan'
node scripts/smoke_test.mjs                     # → "app_data.js is missing the shared 44-item corpus manifest"
```

All three fail on `f1207ea` itself, i.e. they were already red when the 13-document corpus and
the P2.9 re-key arrived; the P2.9 PR only moves their evidence pointers. The repo's honest
status lines (`HANDOFF.md` §4 "gates:" row, this stub) must keep saying so until this stub is
worked.

## 5. Acceptance for this stub

- `python3 -m py_compile scripts/*.py` · `python3 scripts/validate_data.py` · `python3
  scripts/build_data_bundle.py` (twice, byte-identical) · `python3
  scripts/test_source_preservation.py` · `python3 scripts/test_source_review_rules.py` ·
  `node scripts/smoke_test.mjs` — **all green on the 13-document corpus**, with no purged
  document named as if it were live, and no re-typed byte/count total anywhere in the three
  suites.
- No `.github/workflows/*` edit: the workflow already calls all five suites (per `AGENTS.md`,
  a workflow change would have to be documented in `OPERATIONS.md` instead).
- One PR, one task: if the smoke body repin turns out to need Reader-behaviour changes rather
  than pin changes, split that out and say so here rather than weakening a check.
