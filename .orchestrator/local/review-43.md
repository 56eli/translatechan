## Review — task 014: **REVISE** (do not merge yet; the data half is strong, the bookkeeping half is missing)

Verified independently in a fresh clone of `2dc8a64` at base `77b4039`, not from this PR's report.

**What is right — keep it as it is.** `content_cjk_characters` stays **104,564** (no source text moved) and I
confirmed the only metrics fields that move are `all_corpus_cjk_characters` → **110,233**, the five per-document
`all_cjk_chars`, and the echoed note strings — 10 lines total, no status count and no verified-quotation coverage
count moves, so your "episode/page pending state is unchanged" claim checks out. The §5 judgement went the right way:
you *measured* X68n1315 in a throwaway clone instead of inheriting `REMEDIATION_PLAN.md:87`, and the withdrawal —
plus decomposing "10/35 verbatim" into 9 `title_zh` EXACT fields in a separate partition — is the correct
resolution of a contradiction the project carried for three days. Dropping `taisho_vol: 47` (X68n1315 is a 卍續藏
work) is better judgement than what I asked for. The allowlist additions are pointer-only with per-document
rationale and `test_source_preservation.py` exits 0 ✓. `mazu_yulu`'s "6/6 sections carrying 8 evaluated fields"
reconciles the count discrepancy more honestly than my prompt's "8, not 6" did.

**Six items to finish.**

1. **`data/project_metrics.json` is stale** — `❌ data/project_metrics.json: is stale; run
   scripts/validate_data.py --write-metrics`. Run it and commit the result.
2. **The two generated doc figures must follow it.** `validate_data.py:1171` requires in `README.md:48`
   the snippet `(or 110,233 across every corpus JSON string`, and `:1203` requires in `AUDIT.md:20`
   `**104,564 content CJK / 110,233 all-string CJK**`. `HANDOFF.md:67` (`all-string CJK=110,165`) is *not*
   gate-pinned but sits in the same block and is now false — update it too. Do not edit the script: the pins are
   correct, the documents are stale.
3. **The build outputs are not committed.** After `python3 scripts/build_data_bundle.py`, `git status --porcelain`
   still lists `app_data.js`, `docs/app_data.js`, `docs/data/corpus_manifest.json`, `docs/data/canonical_locators.json`
   and the four `docs/data/corpus/*.json`, so `diff -rq data docs/data` fails on the branch. (`docs/index.html`
   correctly does not move — there is no markdown mirror.)
4. **Commit 6 (`docs: record that the six false citations are gone`) is absent**, so the branch now *contradicts*
   main's prose: `ROADMAP.md:65`, `:95` and `README.md:55`'s table cell still say the data carries the T1987 claim;
   `ROADMAP.md:178` needs to be marked delivered in the form `:179` uses for PR #40; `RESEARCH_RELEASE_PLAN.md:109`
   likewise. Also `.orchestrator/REMEDIATION_PLAN.md:47`, `:87` and the `:167` wave-2 checkbox — **your PR body
   states the `10/35` figure was "corrected in `.orchestrator/REMEDIATION_PLAN.md`", and that file is not in this
   diff**; land the correction or fix the sentence. Then the supersession wording your ruling changed:
   `AUDIT.md:30` ("only the post-remediation evidence pass may supersede the register"), `HANDOFF.md:72`, and
   `HANDOFF.md:89`'s "designation held for an owner ruling" — 630 stays authoritative by owner ruling of 2026-09-12,
   so those state a ruling, not a pending expectation.
5. **Commit 7 is absent**: the `.orchestrator/STATE.md` entry recording the four 2026-09-12 owner rulings, with this
   PR's number read back via `gh pr view 43 --json number`.
6. **One design note, before you push again:** the ~200-character qualified sentence now sits in
   `data/canonical_locators.json`'s `canonical_locator` and `current_locator`, which are the *location* fields the
   Reader and Matrix render as citation chips. `canonical_id` has to carry it (the validator requires it to equal
   `cbeta_id`), but the locator reads better mechanical — e.g. `X68n1315 (candidate, unverified)` — with the
   measurement staying in `cbeta_note`. Your call; if you keep the prose, say so in the commit message so the next
   reviewer does not "fix" it back.

**Gate state I reproduced:** `validate_data.py` 3 errors → 2 after the metrics regeneration alone;
`test_source_review_rules.py` fails on its own invariant ("the shipped plan passes the documentation-truthfulness
checks"), which item 2 also clears; `smoke_test.mjs` reports it as a cascade; `py_compile`,
`test_source_preservation.py`, `git diff --check` pass. CI agrees — *Validate data, generated artifacts, and reader*
is red on `2dc8a64`.

One of my own prompt's faults: §8's diff line named only `docs/app_data.js`, not root `app_data.js` or
`docs/data/**` — the check should have been "empty `git status --porcelain` after the build". Not yours to catch,
but it explains the miss. Finish 1–5, re-run every gate in §8, and stop for another review; do not merge, do not
rebase onto `main`.
