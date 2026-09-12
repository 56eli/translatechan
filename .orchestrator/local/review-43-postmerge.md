## Post-merge check of this PR on `main` — healthy; two follow-ups, neither a revert

Merged as `1b41d0b` (all seven commits present, CI green). Re-checked in my own fresh clone, not from your report:

- **All eight gates exit 0 on `main`**; `git status --porcelain` empty after `build_data_bundle.py`; `diff -rq data
  docs/data` clean; metrics regenerate to `content 104,564` / `all-string 110,233` with **only** the CJK lines moving.
  `README.md:48`, `AUDIT.md:20`, `HANDOFF.md:67` all carry 110,233 and the five pinned disclosure sentences survive.
- **Zero drift on frozen surfaces:** `sessions/**` byte-identical (0 of 30 files changed), `scripts/` touched only in
  `test_source_preservation.py`'s allowlist, `index.html`/`app.js`/`app.css` and `docs/index.html` untouched, and only
  the four intended `data/corpus/*.json` (+ their mirrors). `source_review` still reports 630 authoritative / 622
  historical / 637 superseded — ruling 2 honoured, and your rewrites of `HANDOFF.md:72`/`:89` and `AUDIT.md:30` state
  the ruling rather than a pending expectation.
- **Every T1987 mention in the framed set is qualified** (README 1/1, AUDIT 1/1, HANDOFF 1/1, ROADMAP 3/3,
  `index.html` 0). The `REMEDIATION_PLAN` 10/35 contradiction is resolved with your probe, and keeping the qualified
  sentence in `canonical_locator` for the reason in your commit message — the validator interlock means a reader can
  never meet "X68n1315" without "unverified" — is the better call. I withdraw my item 6.

**Follow-up 1 — the provenance-label census is stale in 9 lines, because of me.** Adding `zhaozhou_yulu.cbeta_note`
makes it **50** note strings, **39** rendered, **23** documents, `cbeta_note` **17**. Your commit 6 updated
`ROADMAP.md:33` ("**50** provenance-note strings") and stopped; these still assert the old figures:
`ROADMAP.md:163` (two), `ROADMAP.md:179`, `vision.md:57` (two), `vision.md:59`, `vision.md:88`, `vision.md:90`,
`vision.md:327`, `RESEARCH_RELEASE_PLAN.md:32` (two) and `:103`. `vision.md:88`/`:90` are inside a `text` block of
measured output — regenerate that block, do not hand-edit numbers in it. Nothing in `validate_data.py` covers this
census, which is why it drifted silently; pinning it is a checker change and needs its own owner-ruled task.

**Follow-up 2 — `dahui_hongzhi`'s manifest citation is now stronger than the corpus record.** The pairing is *not*
invented — `collate_corpus.py`'s own witness note records "Hongzhi's Mozhaoming lives in T2001 Hongzhi guanglu", and
your distinction between the August correction (bare `T2001` for the *letters*) and the volume-qualified witness for
the 默照銘 is sound. But `sessions/COLLATION_REGISTER_2026-09-12_POSTREMEDIATION.json` measures this document at
**0 of 6** content fields collating, with the only T48n2001 touch being `.sections[0].title_zh` at sim 0.57 in the
metadata partition — a title mention, which the project's own doctrine says never establishes content collation. And
`data/corpus/dahui_hongzhi.json` still claims `cbeta_id: "T1998A"` alone, so after this PR the manifest is the *only*
place pairing 默照銘 with T48n2001 and no data field discloses the 0/6. Fix in one or two sentences, same class as
`zhaozhou_yulu`: extend `dahui_hongzhi.cbeta_note` to state that the T48n2001 pairing is bibliographic (from the
harness witness note) and that 0 of 6 evaluated content fields collate in any of the three pinned witnesses — and
either align `cbeta_id` to name all three works or say in the note that it covers the letters only.

No action on `WITNESS_INVENTORY.md:207`/`:211`/`:283`/`:362`, which still quote the old `coverage_note` strings: those
are dated measurement records and quoting what the data said at the time is correct — though `:211`'s `reproduce:`
command (`grep -o "excerpted from T1987" data/corpus/zhaozhou_yulu.json`) now returns nothing, which a future reader
should be told means "the claim is gone", not "the check failed".
