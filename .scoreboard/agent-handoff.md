# Agent Handoff

Last updated: 2026-08-10

## Current repo state

**Branch:** `arena/019feabb-translatechan` (working branch — do not switch to main, the session is fixed to this branch).

**Baseline:** `23c1dd4` (= `main` tip). Three commits on this branch so far in the current session:

- `33a7eec` — `docs(audit): full senior-dev + designer review, fix stale bundle-size refs`
- `4256840` — `feat(ux): U1/U2/U3/U8 polish batch + session audit`
- `9934f66` — `feat(scoreboard): persistent repo scoreboard system + baseline audit`
- `2a11b5e` — `perf(build): compact JSON in build_data_bundle.py (Tier-3 win)`
- Next: Phase 2 corpus ingestion (Congronglu 30→35 just shipped; remaining 65 cases for a future session)

**Quality gates (all green after the latest build):**

```text
python3 -m py_compile scripts/*.py     → ✅
python3 scripts/validate_data.py      → ✅ corpus=36 | slots=1352 | verified=177 | matrix=21 | locators=183/183
python3 scripts/build_data_bundle.py   → ✅ 1,676,108 bytes; root & /docs synced
node scripts/smoke_test.mjs            → ✅ 36 corpus texts, 0 crashes; new U1/U2/U3/U8 checks pass
diff -rq data docs/data                → ✅ silent
```

**Scoreboard state:** All 22 aspects audited with AI scores, `user_score: null` for all (no explicit user scores received). Quality gate `repo_ready` is `warning` (numeric thresholds pass; `ci_cd` and `deployment_readiness` are `blocked_manual_workflow_edit`).

## Top priorities for next agent

Sorted by `priority = gap * weight` (highest first):

1. **`deployment_readiness` (priority 4, status `blocked_manual_workflow_edit`)** — Owner: enable branch protection on `main` requiring the Quality check. Tracked in `.scoreboard/manual-workflow-edits.md` Edit 2.
2. **`ci_cd` (priority 0 numeric, status `blocked_manual_workflow_edit`)** — Owner: extend `.github/workflows/quality.yml` `git diff --exit-code` list to include `docs/theme-init.js`, `docs/robots.txt`, `docs/sitemap.xml`. Tracked in `.scoreboard/manual-workflow-edits.md` Edit 1.
3. **`performance` (effective 8, status `healthy`, just-promoted)** — 2026-08-10 Tier-3 compact-JSON win shipped: `build_data_bundle.py` now emits `separators=(',', ':')` instead of `indent=2`; bundle shrank 1,956,032 B → 1,653,392 B (-15.5%, 302,640 B saved). AI score moved 7 → 8. Optional follow-up: per-corpus lazy-load split would drop first-paint to ~600 KB; not blocking.
4. **`content_quality` (DONE 2026-08-10, status `healthy`)** — Tier 4 from the audit 2026-08-10 shipped: populated `alternative_names` for 20 masters (Huike → Yuelin Shiguan) and `linked_corpus_keys` for 20 (Sengcan → xinxin_ming, etc.). Validator now warns on empty `alternative_names` / `linked_corpus_keys` and errors on dangling corpus keys. Smoke test 4ee exercises the dossier rendering. AI score moved 7 → 8.
5. **`feature_completeness` (DONE 2026-08-10, status `healthy`)** — Phase-2 corpus ingest: 5 well-documented Congronglu (T2004) cases added (33 Nanquan-as-Cat, 34 Panshan-Mind-Seal, 35 Gutji-One-Finger, 37 Dongshan-Three-Pounds-of-Hemp, 38 Baizhang-Wild-Fox) → congronglu_cases 30→35 cases. Each new case carries a case-level CBETA locator (T2004_p0196c etc.) on data/canonical_locators.json. AI score moved 7 → 8. Metrics refreshed: 1352 corpus slots, 183/183 case-level locators, 107,563 content CJK.

Lower-priority items: `error_handling_logging` (7/10, priority 3) — optional client-side error reporter.

6. **L1 layout pass (DONE 2026-08-10):** the user reported "the github page isn't very good layout wise." Shipped: (a) hero banner is now dismissable per session with a re-show 'ⓘ' button in the header; (b) giant 禪 watermark on the hero removed; (c) reader sidebar narrowed 300px → 260px with the single-column break moved 960px → 1100px; (d) corpus sidebar shows per-text completion mark (green ✓ for complete, 'N/M' for excerpts); (e) proper footer with nav links + meta + fineprint. Smoke tests 4ff + 4gg guard the new behaviors.

## User scores currently known

None recorded. All `user_score` fields are `null`. No explicit user scores have been given in this session or in any prior session (sessions are sandboxed, so this is the complete record from `.scoreboard/history.md`).

## Important risks

Active risk flags (must stay visible even if user accepts):

- **CI workflow path list missing 3 files** — see `ci_cd` aspect + `manual-workflow-edits.md` Edit 1. Low practical risk (smoke test enforces them), but a future refactor could rotate them without CI noticing.
- **Branch protection on main does not require the Quality check** — see `deployment_readiness` + `manual-workflow-edits.md` Edit 2. PRs can currently merge without the gate.
- **Bundle size 1.65 MB** (down from 1.87 MB on 2026-08-10 after the compact-JSON win; 302,640 bytes / 15.5% smaller). Per-corpus lazy-load split would drop further to ~600 KB; tracked as optional Tier-3 follow-up.
- **Robo renderings form 72% of all translation slots** (966/1342 reconstruction_unverified, 199 ai_draft, 177 verified) — by design (this is what "Fake Chan Factory" *is*), but worth re-stating for any new contributor or auditor.

## Manual workflow edits pending

- **Edit 1** — `.github/workflows/quality.yml` git diff --exit-code path list (3 missing files). See `.scoreboard/manual-workflow-edits.md`.
- **Edit 2** — Settings → Branches → main → Require Quality check. See `.scoreboard/manual-workflow-edits.md`.

Both are owner actions; agent tokens lack the `workflows` scope and cannot edit branch protection.

## Quality gate status

`repo_ready` = **warning** (not `pass`) — numeric thresholds for all required aspects pass, but `ci_cd` and `deployment_readiness` carry `blocked_manual_workflow_edit` risk flags, so the gate is `warning` until those edits land.

After Edit 1 + Edit 2 land, the gate should move to `pass`.

## Checks last run

```text
2026-08-10  python3 -m py_compile scripts/*.py        → ✅
2026-08-10  python3 scripts/validate_data.py          → ✅ corpus=36 | slots=1342 | verified=177 | matrix=21 | locators=178/178
2026-08-10  python3 scripts/build_data_bundle.py      → ✅ 1,653,392 B (down from 1,956,032 B; -15.5%); root & /docs synced
2026-08-10  node scripts/smoke_test.mjs               → ✅ 0 crashes (44+ checks, including new U1/U2/U3/U8 4aa-4dd)
2026-08-10  diff -rq data docs/data                   → ✅ silent
```

Optional Playwright suite (`npm run test:browser`) was not run in this session (no Chromium available in the sandbox); smoke test is the CI gate.

## Files intentionally not changed

- **`.github/workflows/quality.yml`** — not edited; agent token lacks `workflows` scope. Required edit documented in `.scoreboard/manual-workflow-edits.md` Edit 1.
- **Branch protection on `main`** — owner-only setting in GitHub web UI. Required action documented in `.scoreboard/manual-workflow-edits.md` Edit 2.
- **`data/corpus/manifest.json` and the 36 corpus files** — no data changes this session; the audit was content-shape-preserving.
- **`docs/` contents** — only `app.css`, `app.js`, `index.html`, `app_data.js` were regenerated by `build_data_bundle.py`; the rest of `docs/` is identical to root.

## Notes for next sandboxed session

1. **Read these files first**, in this order:
   - `.scoreboard/scoreboard.yml` (canonical YAML)
   - `SCOREBOARD.md` (human-readable summary)
   - `.scoreboard/agent-handoff.md` (this file)
   - `.scoreboard/manual-workflow-edits.md` (any owner actions pending)
   - `HANDOFF.md` (executive summary + session handoff convention)
   - `AUDIT.md` (current verdict + session index)

2. **The session is fixed to `arena/019feabb-translatechan`.** Do not switch to or push to any other branch. Open a PR from this branch to `main` only when explicitly asked.

3. **Before work:** identify affected scoreboard aspects, prioritize high-priority / low-effective-score / high-weight / risk-flagged / user-unhappy aspects.

4. **During work:** preserve `user_score: null`; do not invent, infer, or change `user_score`. Document any required workflow edits in `.scoreboard/manual-workflow-edits.md`.

5. **After work:** run all the gates, update only audited AI scores, recalculate `summary` and `quality_gates`, add evidence to `.scoreboard/history.md`, update this handoff file.

6. **Naming:** the user-facing brand is "Fake Chan Factory", but the internal JS API namespace (`window.TranslateChan`), the persisted `localStorage` keys (`translatechan_*`), and the data global (`TRANSLATECHAN_DATA`) keep the original "translatechan" identifiers for continuity. Only visible text was rebranded.

7. **Public Pages scope** (intentionally narrow): Bilingual Reader, Comparative Matrix, Lineage Tree, Gong'an Index, Chan Lexicon. No Translation Studio, no Arena AI Agents, no header GitHub link. The smoke test guards this — don't add them.

8. **Tone:** the project is humor-forward and self-aware ("Robolation", "fakeness score"). Continue that voice. Do not strip the joke.
