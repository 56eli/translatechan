# 002 — Revision for PR #29 (wumenguan re-key): case-5 glyph + rare-glyph pinyin readings

## 0. FETCH AND VERIFY

Fetch this prompt and the reviewed branch head; write outside the repository:

```bash
git fetch --depth 1 origin arena/01a08c93-translatechan:refs/remotes/origin/_orch
git show refs/remotes/origin/_orch:.orchestrator/prompts/002-wumenguan-revision-case5-glyphs.md > /tmp/task.md
git fetch --depth 1 origin arena/01a08caa-translatechan:refs/remotes/origin/_pr29
```

Verify: the file must not be empty and its title must match
`002 — Revision for PR #29 (wumenguan re-key): case-5 glyph + rare-glyph pinyin readings`.
Never commit this file, never push anything from /tmp, never push to the
orchestrator branch `arena/01a08c93-translatechan`. Halt and report if the
file is empty or the title mismatches.

## TASK: REVISION / FIX FOR PR #29

**Branch model for this revision:** you are a NEW Arena session with your own
provisioned branch `arena/<session>-translatechan` (project contract,
AGENTS.md: work only on your own session branch). PR #29's branch is
`arena/01a08caa-translatechan` (head `7285f95`) — you will NOT push to it.
Instead: branch your session branch from current `origin/main`, merge PR
#29's head into it as the starting state (`git merge --no-edit
refs/remotes/origin/_pr29` — this is a merge of reviewed, already-published
work into your unpublished branch, which is allowed before your first push),
apply the fixes below, push, and open ONE new PR against `main` that
supersedes PR #29. The new PR's description must state: "Supersedes PR #29
(close #29 after this merges)".

**SUPERSEDES:** `.orchestrator/prompts/001-rekey-wumenguan-t2005.md`

## FAILED ACCEPTANCE CRITERIA (from independent review, 2026-09-10)

1. **Witness-verbatim re-keying (case 5).** `.cases[4].dialogue[0].zh`
   currently reads `…如人上樹。口樹枝。手不攀枝。…` — the `口樹枝` gap is
   the collation-harness artifact (its extraction rule drops `<g>` element
   content), NOT the witness text. The T48n2005 XML (pinned revision
   `dbdea41071e1e260ad84b72faefd4587333cf76d`) reads
   `口<g ref="#CB03340">啣</g>樹枝`. Wave-0 policy: re-keyed fields reproduce
   the witness verbatim, NFKC-normalized. NFKC(啣 U+2F844) = 啣. Required
   corpus text: `口啣樹枝`, pinyin `Kǒu xián shù zhī`.
   Consequence (accepted, must be documented): because the committed
   extraction rule drops `<g>` content, the re-run will classify this field
   MINOR (~0.9804) rather than EXACT. That MINOR is an extraction-artifact
   flag on a verbatim-witness corpus field — exactly the "edition-graphic
   residue" the policy tolerates. Do NOT revert to the gap to game the flag.
2. **Rare-glyph pinyin readings (uncited, contextually wrong).** The re-key
   kept three rare witness glyphs; their pinyin readings were assigned
   without a citable source and conflict with the standard edition:
   - `.cases[11].commentary_pinyin` and `.cases[39].commentary_pinyin`:
     `何故𦗚` currently pinyin `Hé gù lóng`. Standard modern editions of
     無門關 print this spot as the interrogative `聻` (`何故聻`, reading
     nǐ, 乃里切); some print the 聾-family variant. The rhetorical context
     (`何故。一箇喚底。一箇應底。`) is interrogative. Correct the reading
     to `nǐ` (contextual standard-edition reading) unless you can cite an
     authoritative dictionary reading of 𦗚 (U+265DA) itself that overrides
     it; document the source per glyph in the PR description.
   - `.cases[47].dialogue[1].pinyin`: `扇子𨁝跳` currently `Shàn zi bó
     tiào`. 𨁝 (U+2805D) is the witness glyph for the jump-verb in this
     passage (standard modern editions print 踍/𨁝). Re-verify the reading
     against a citable source (e.g. CBETA gaiji database for #CB01387, or
     the standard-edition character's dictionary reading) and correct it;
     document the source. If no authoritative reading is citable, use the
     contextual standard-edition reading and state that explicitly.
   - Keep every other syllable in these three fields exactly as-is.

## REGRESSIONS / DEFECTS FOUND (nothing else)

Independent verification (2026-09-10) confirmed the rest of PR #29 correct:
62 re-keyable fields re-keyed verbatim from the pinned T48n2005 XML; a fresh
`collate_corpus.py --doc wumenguan` run reproduced the claimed before/after
(70 → 8 flagged: 5 MINOR + 2 SHORT_UNMATCHED + 1 R-B epilogue; EXACT 222;
175/181 content fields collated); 5 MINOR + 2 SHORT_UNMATCHED fields
byte-identical to main; translations/statuses/rights untouched; epilogue
R-B-labeled, text untouched; ALLOWED_CHANGES matches the diff exactly (128
pointers, 0 unauthorized); BASE_COMMIT pinned; all five quality gates green
locally and in CI. Only the two defects above fail acceptance.

## REQUIRED ACTIONS

1. **Fix case 5:** `.cases[4].dialogue[0].zh` `口樹枝` → `口啣樹枝`;
   `.cases[4].dialogue[0].pinyin` `Kǒu shù zhī` → `Kǒu xián shù zhī`.
   → commit + push
2. **Fix the three glyph readings** in `.cases[11].commentary_pinyin`,
   `.cases[39].commentary_pinyin`, `.cases[47].dialogue[1].pinyin` per the
   failed-criteria above, with per-glyph sources in the PR description.
   → commit + push
3. **Re-run the harness** (acquire refs per `scripts/collate_corpus.py`
   docstring; verify digests against
   `sessions/COLLATION_W1_2026-09-10_refs_manifest.txt`; run
   `COLLATION_REFS=<refs> python3 scripts/collate_corpus.py --doc wumenguan
   --out /tmp/wumenguan_after2.json --generated 2026-09-10`) and confirm the
   residual changes as expected: MINOR 5→6, EXACT 222→221, flagged 8→9
   (6 MINOR + 2 SHORT_UNMATCHED + 1 NOT_FOUND epilogue). Report the actual
   numbers. → commit + push
4. **Update the numbers everywhere they appear:** `coverage_note`
   (residual 8→9; "5 MINOR"→"6 MINOR"; state that the case-5 MINOR is an
   extraction-artifact flag on a verbatim-witness field — keep the
   "48/48 cases represented" and `partial_or_failed_w1_collation` wording,
   never write "Complete"); `zh_chars` (set to the validator's computed
   value, expected 5959→5960); `data/project_metrics.json` via
   `python3 scripts/validate_data.py --write-metrics`; README/HANDOFF/AUDIT
   doc-truthfulness figures the validator demands (expected content CJK
   104,154→104,155; all-string 109,612→109,613);
   `.orchestrator/STATE.md` wumenguan queue entry ("5 MINOR"→"6 MINOR").
   Regenerate `app_data.js` + `docs/` mirror via
   `python3 scripts/build_data_bundle.py`. → commit + push
5. **Stale STATE.md wording:** in `.orchestrator/STATE.md`, change the
   evidence-hardening paragraph's "current work — merge-ready PR pending"
   to "merged (PRs #25–#28, 2026-09-10)" and the task-queue `[~]` line's
   "(PR open, not merged)" to "(merged — PRs #25–#28)". Keep every
   validator-required string in that file intact (the authoritative W1
   flagged total 630, register paths, dates). → commit + push
6. **Full verification + PR:** run all five gates, the extra test scripts,
   and `git diff --check` (commands below); open ONE PR against `main` with
   the description per below. → commit + push

## PUSH CADENCE

- Your branch starts unpublished; the merge of `_pr29` happens before your
  first push. From then on the branch is published: do NOT rebase it.
- Sync with: `git fetch origin main && git merge --no-edit origin/main`
- Commit and push after each required action above (same one-command
  checkpoint forms as the original prompt; Conventional Commits, `chore:
  wip …`).
- Never push to the orchestrator branch. Never push to
  `arena/01a08caa-translatechan`. Never force-push.
- On merge conflict: halt and report the conflicting files.

## DO NOT TOUCH

- All 60 other re-keyed zh/pinyin fields — they passed verification.
- Any English translation, translation status, `source_id`, rights field.
- The epilogue text and its `editorial_note` label.
- `data/corpus_manifest.json`, `sessions/**`, the committed registers.
- `scripts/test_source_preservation.py` (pointers `.cases[4].dialogue[0].zh`
  / `.pinyin` are already allowlisted; BASE_COMMIT must stay pinned) — do
  not modify the allowlist.
- Other corpus documents, lineage/gongan/glossary layers, workflows,
  scoreboard, renderer code.
- Any claim of "Complete"; wumenguan remains
  `partial_or_failed_w1_collation`.

## CONTEXT

- The original prompt file was:
  `.orchestrator/prompts/001-rekey-wumenguan-t2005.md` (fetchable from the
  same orchestrator ref).
- PR #29's summary claimed: 62 fields re-keyed verbatim, residual 8, all
  gates green — confirmed true by independent re-verification EXCEPT the two
  failed criteria above.
- The actual diff additionally shows: the case-5 gap was chosen to force an
  EXACT flag against the extraction artifact; the three glyph readings were
  assigned without citation. These are the only defects this revision fixes.

## VERIFICATION COMMANDS

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py --write-metrics
python3 scripts/validate_data.py
python3 scripts/build_data_bundle.py && sha256sum app_data.js docs/app_data.js
python3 scripts/build_data_bundle.py && sha256sum app_data.js docs/app_data.js
node scripts/smoke_test.mjs
python3 scripts/test_source_review_rules.py
python3 scripts/test_source_preservation.py
diff -rq data docs/data
git diff --check
git status --short
```

All must pass; the two build hashes must be identical.

## PR DESCRIPTION REQUIREMENTS

- Summary: revision of PR #29 — supersedes it; PR #29 should be closed
  after merge.
- The two fixes with before/after text (zh + pinyin).
- Per-glyph reading sources (cited) for 𦗚 ×2 and 𨁝, including the
  edition-variance note (聻/聾) for 何故𦗚.
- Updated before/after collation table (register → after-revision re-run),
  with the case-5 MINOR explained as an extraction-artifact flag on a
  verbatim-witness field (collate_refs.py drops `<g>` content; the corpus
  carries the witness's NFKC-normalized glyph 啣).
- Updated residual explanation (9 flagged: 6 MINOR + 2 SHORT_UNMATCHED +
  1 R-B epilogue).
- Confirmation that everything else from PR #29 is unchanged.
- Full verification command outputs.
