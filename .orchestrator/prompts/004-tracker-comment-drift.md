# Task 004 — Tracker and comment drift after the scoreboard removal (docs-only PR)

You are working in `56eli/translatechan` ("Fake Chan Factory"). This is a **small, mechanical,
documentation-only** task. Read all 13 sections before editing anything.

---

## 1. Mission

Three places in the repository still describe a state of the project that no longer exists.
Wave 1 of the collation remediation has advanced two documents since the scoreboard was retired
(PR #31), and the roadmap block in `.orchestrator/STATE.md` still says the scoreboard removal is
*upcoming*. Two CSS comments still cite the scoreboard as their provenance. Fix exactly those
stale statements. **No code behaviour changes. No data changes.**

## 2. Repository state at your base (verify, then trust)

Run these and confirm they match before you start:

```bash
git rev-parse HEAD                     # must be main at or after b82d904 (PR #32 merged)
grep -c . .orchestrator/STATE.md       # tracker exists
grep -n "Then scoreboard-removal" .orchestrator/STATE.md    # expect exactly 1 hit, line ~34
grep -n "Scoreboard P2 resiliency" app.css docs/app.css     # expect 2 hits, same line number in each
```

Recent history you are cleaning up after:

| PR | What it landed | Drift it left behind |
|---|---|---|
| #31 | deleted `.scoreboard/` + `SCOREBOARD.md`, added root `OPERATIONS.md` | `STATE.md` sequencing block still lists the scoreboard PR as pending; `app.css` comments still cite it |
| #32 | re-keyed `linji_yulu` to witness T47n1985 | `STATE.md` "next planned task" still says "visual-system reset" ahead of the remaining Wave 1 documents |

## 3. The drift inventory (measured on main at `b82d904`; re-measure, do not copy)

1. **`.orchestrator/STATE.md`, the sequencing block.** Current shape (lines ~29–43):
   - a `**Next planned task:** visual-system reset …` line,
   - a numbered `**Next (after the visual-system reset, in order):**` list whose item 3 reads
     `3. Then scoreboard-removal PR + PR-A/B/D per earlier queue.`,
   - a `- **Sequencing:** … The visual-system reset is the next planned task; …` bullet.
   The scoreboard removal is **done** (PR #31). Wave 1 remediation is **in progress**, not later.
2. **`HANDOFF.md`, the repository map in §9** (around line 174): the `OPERATIONS.md` line has one
   extra leading space relative to its siblings, so the map's comment column is misaligned by one
   character.
3. **`app.css` line ~2186 and `docs/app.css` line ~2186**: the comment
   `/* Error Boundary UI (Scoreboard P2 resiliency fix) */` attributes this block to a retired
   subsystem. The rule that bans scoreboard references must not be re-opened by a stale comment.
4. **Do not touch** `HANDOFF.md` ~line 198 ("The repository scoreboard … was retired") — that
   statement is correct and historical. `STATE.md` lines 27, 42, 54 are likewise correct
   historical records (they say *retired/executed*), not drift.

## 4. What to write

- **(1) Sequencing block.** Replace the stale block with text that states, in this order:
  Wave 1 remediation is the active track — `wumenguan` (PR #29), `biyanlu_cases` (PR #30),
  `linji_yulu` (PR #32) done; **next `xinxin_ming`, then `platform_sutra`** (the latter blocked on
  an owner recension ruling: CBETA T2008 宗寶 vs Dunhuang T2007); the visual-system reset is
  deferred and explicitly **not** part of remediation PRs; PR-A/B/D remain frozen; W2 remains
  separate. Keep the existing markdown list style and keep it under ~12 lines. Do not invent
  statuses, do not assert any document is `complete_selected_witness`, and do not restate counts.
- **(2) Map alignment.** Remove the single extra space so `OPERATIONS.md` aligns with the other
  entries in the fenced map block.
- **(3) CSS comments.** In `app.css` only, change the comment to a provenance-neutral one-line
  description of what the block does, e.g. `/* Error boundary UI (reader resilience) */`. Do not
  alter a single selector, property, brace or byte of CSS outside that comment line.

## 5. The `docs/` mirror contract (this is how this PR can break the build)

`docs/` is a **generated** copy. `scripts/build_data_bundle.py` copies `index.html`, `app.css`,
`app.js`, `theme-init.js`, `robots.txt`, `sitemap.xml`, `og-image.svg` (and the data tree) into
`docs/`. Therefore:

- Edit the **root** `app.css`. Run the build. Let it regenerate `docs/app.css`.
- **Never hand-edit `docs/app.css`.** If the artifact check fails after your build, your edit
  diverged the two files — fix the source, rebuild, re-check.

## 6. Allowed paths (hard scope — the review will diff against exactly these)

```
.orchestrator/STATE.md
HANDOFF.md
app.css
docs/app.css          (build-generated; must byte-match app.css after the build)
```

Nothing else. In particular: **no** files under `data/`, `docs/data/`, `scripts/`, `.github/`,
`sessions/`, `schemas/`, `src/`, and **no** `.orchestrator/prompts/*`.

## 7. Forbidden

- Any edit under `.github/workflows/` (owner-controlled; touching it fails review outright).
- Any change to `data/**` or `docs/data/**`, to status fields, or to `data/corpus_manifest.json`.
- Re-introducing the word `scoreboard` anywhere, in any casing, in any file — including in a
  "we removed the scoreboard" note. Your edits must **reduce** the count of matches.
- Reformatting, tidying, sorting or "improving" any line not listed in §4.
- Editing `AGENTS.md`, or any file not in §6.

## 8. Self-verification before push (all five quality gates)

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py                      # no --skip-docs flag
python3 scripts/build_data_bundle.py
git diff --exit-code -- app_data.js docs/app_data.js docs/index.html docs/app.css docs/app.js docs/data data/project_metrics.json  # the CI artifact gate: docs/ must be in sync
node scripts/smoke_test.mjs
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
git diff --check
diff -rq data docs/data && cmp app.css docs/app.css
```

Every command must exit 0. Expect **zero** behavioural deltas from your diff: if any gate output
changes relative to `main` other than the docs mirror being regenerated, you edited something you
should not have — revert and redo.

A non-empty output from `git diff --exit-code -- …` means a generated file in the repo is
out of step with the build — rebuild rather than hand-editing anything under `docs/`.

Also run the drift-specific checks:

```bash
git diff --name-only                  # must be exactly the §6 paths
grep -rni "scoreboard" --include='*.css' . | wc -l     # must be 0 (was 2)
grep -n "Then scoreboard-removal" .orchestrator/STATE.md   # must now be empty
grep -c "OPERATIONS.md" HANDOFF.md                       # unchanged (1)
```

## 9. Commit policy

**One commit.** Message: `docs: retire scoreboard-era tracker and comment drift`. One commit is
correct here because there are no data-touching sub-tasks; do not split, do not amend after push.

## 10. Handoff (do not merge)

Push to your working branch, open a PR against `main`, then report:

- the exact `git diff --name-only` list and the diff of each §4 item, before/after;
- each §8 command with its exit status and the one-line reason it could not have changed
  (e.g. "no data or JS touched");
- the grep results from §8 proving the `scoreboard` CSS hits went 2 → 0;
- `cmp app.css docs/app.css` output (empty) and the `git diff --check` output.

**Never press the merge button.** The operator merges personally after an independent review.

## 11. If something doesn't match this brief

If `main` has moved and any line in §3 has already been fixed, or a grep in §8 disagrees with the
inventory, **stop and report** rather than improvising: state what you found, what you did not
touch, and which item you could not reconcile. A correct "2 of 3 items were already fixed" beats
an invented third edit.

## 12. What happens after this PR

On merge, the orchestrator marks task 004 done and dispatches **005 — Wave 1 document
`xinxin_ming`** (`data/corpus/xinxin_ming.json`, 13 content flags). That task touches data and has
its own rules; nothing here prepares it, and nothing here should be done "in advance" of it.

## 13. Non-goals (do not do these)

- Updating the repo description/homepage/topics or deleting orphaned remote branches — those are
  GitHub settings, not files, and are outside the PR model.
- Editing `.orchestrator/local/ORCHESTRATOR_STATE.md` — it does not exist on `main` and is the
  orchestrator's own ledger, not yours.
- "Modernizing" the CSS block whose comment you are changing, or rewrapping any markdown prose
  beyond the §4 items.
