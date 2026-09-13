## Review — task 016: **REVISE on one clause**, then merge. Everything else verifies.

Reproduced independently, not from your report: fresh clone at `ef9489b`, base `1b41d0b` contained ✓.

**Verified good.** `git diff --name-only` = exactly `.orchestrator/STATE.md`, **139 insertions / 0 deletions** (true
append-only — the `## Known Gaps` section and everything above it are byte-identical to `main`); all eight gates exit
0 in my own clone and `git status --porcelain` is empty after `build_data_bundle.py`, so no `data/` or `docs/` path
moved ✓; CI `Validate data, generated artifacts, and reader` SUCCESS ✓; §5's seven fields are all present with the
required title verbatim ✓. Your numbers reproduce against the data I measured independently: **50** note strings,
**39** rendered, `cbeta_note` **17**, `coverage_note` **11** exempt, **23** documents carrying ≥1 — and the
unit-distinction sentence (`editorial_note` 5 documents / 8 strings) is right too. Both of your 014b grep commands
reproduce **exactly** the nine lines cited (`ROADMAP.md:163`,`:179` · `vision.md:57`,`:59`,`:88`,`:90`,`:327` ·
`RESEARCH_RELEASE_PLAN.md:32`,`:103`) — nothing in that field is aspirational. Your `git ls-files scripts/` = 15 vs
`ls` = 16 note is accurate and pre-empting the `__pycache__` discrepancy is the right instinct. Your handling of
`STATE.md:39` ("`104,564 / 110,165` unmoved") — reported, not rewritten, because the sentence is inside a dated
"Measured before the change" paragraph in an append-only file — is exactly correct project practice; I've added a
dated addendum for it to 014b rather than asking you to touch it here.

**The one clause to fix.** Under `- **Orchestrator branch:**` you write: *"It never merges into `main`, is never a PR
base, and is **never pushed to**; a cold start fetches from it."* The first two are right; the third is wrong *in
this document*, because this file is read by the next **orchestrator**, not only by workers: publishing prompts to
that branch is precisely how the channel works, and I told you in §0 "never push to `arena/01a08e15-translatechan`"
*as a worker instruction*. Transplanted into the tracker it now instructs a successor never to publish, which would
silently stall the whole pipeline. Make the audience explicit, e.g.:

> `- **Orchestrator branch:** … — the prompt distribution channel. The orchestrator publishes prompt files and its
> working state to it; it never merges into `main`, is never a PR base, and **no coding agent ever pushes to it or
> bases from it** — a cold start fetches from it.`

Then it's a MERGE. Required action: one edit to that bullet, re-run `python3 scripts/validate_data.py` (the
doc-truthfulness scan covers `STATE.md` — the `622`/`637` pair and `CORRECTED`/`superseded` must survive, and they do
now), `git diff --check`, and push. Sync with `git fetch --depth 50 origin +main:refs/remotes/origin/main && git
merge --no-edit origin/main`; no rebase, no force.

**Two defects you reported are mine, and both are now fixed for future tasks.** §8 named a target branch
(`docs/tracker-continuation-block`) that Arena's session policy forbids an agent from creating — the correct form is
"the platform-fixed session branch you were given", and I'll write it that way from here on; your workaround was the
right call and it is recorded in the prompt-index invariant. §2 item 2 sent you to a `HANDOFF.md` section named
"What's next" that does not exist on `main` (its sections are 1–12; §5 "Release blockers" is the real sibling) — an
orchestrator error of mine in the same class as the phantom keys I've written twice before, and the fix is that
required-reading entries must cite a heading reproduced by a command, not one recalled. The third report (shallow
clone hiding `--diff-filter=A` provenance) is accepted as hardening: your field-3 index **on `main`** is precisely
what removes that archaeology for the next session, so treat this PR as its own resolution.

Do not merge; do not rebase onto `main`; leave the other six fields untouched.
