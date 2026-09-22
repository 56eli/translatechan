# Orchestrator Working State

## Orchestrator Branch
arena/01a09829-translatechan — current coding agent branch that served as orchestrator distribution for task 057; after merge, successor should create fresh orchestrator branch per v4.9.0 model (distribution channel, never merges, only prompts + working state). This file is now on main after PR #113 merge for handoff clarity.

## Continuation
Empty = new engagement. Previous orchestrator traces: `arena/01a09829-translatechan` (PR #113, P1 Biyanlu re-key). No active continuation branch — successor starts fresh.

## Canonical Project Tracker
docs/PROJECT_STATE.md (resolved per Phase 1 Step 7 — project has ROADMAP.md but canonical is now docs/PROJECT_STATE.md following Knowledge Bridge Doctrine). Legacy tracker `.orchestrator/STATE.md` remains as historical evidence, not canonical.

## Published Task Prompts
| Seq | Prompt path | Task | Agent branch | PR | Status |
|---|---|---|---|---|---|
| 042 | .orchestrator/prompts/042-p0-integrity-trust-baseline.md | P0 Integrity Trust Baseline | arena/01a0c046-translatechan | #? | Merged |
| 043 | .orchestrator/prompts/043-p1-congronglu-reinstatement.md | P1 Congronglu reinstatement | — | — | Pending (0-byte stub) |
| 045 | .orchestrator/prompts/045-p1-chuandenglu-full.md | P1 Chuandenglu full | — | — | Pending (0-byte stub) |
| 047 | .orchestrator/prompts/047-p2-baizhang-huangbo-authenticity.md | P2 Baizhang + Huangbo authenticity labels | — | #? | Merged |
| 048 | .orchestrator/prompts/048-p2-dazhu-nanquan-rekey.md | P2 Dazhu + Nanquan re-key attempt | — | #? | Merged (not landed, R-B labels) |
| 049 | .orchestrator/prompts/049-all-encompassing-roadmap.md | All-encompassing roadmap | — | — | Merged |
| 050 | .orchestrator/prompts/050-enthusiast-100pct.md | Enthusiast 100% | — | #? | Merged |
| 051 | .orchestrator/prompts/051-p3-lineage-batch1.md | P3 Lineage batch1 | — | — | Merged |
| 052 | .orchestrator/prompts/052-p3-lineage-batch2.md | P3 Lineage batch2 | — | — | Pending |
| 053 | .orchestrator/prompts/053-p3-lineage-batch3.md | P3 Lineage batch3 | — | — | Pending |
| 054 | .orchestrator/prompts/054-p2-dazhu-nanquan-retry.md | P2 Dazhu Nanquan retry | — | — | Merged |
| 055 | .orchestrator/prompts/055-p3-lineage-frontier-final.md | P3 Lineage frontier final | — | — | Pending |
| 056 | .orchestrator/prompts/056-p2-next-tier2-yulu.md | P2 Next Tier2 yulu | — | — | Pending |
| 057 | .orchestrator/prompts/057-p1-biyanlu-rekey.md | P1 Biyanlu Cases re-key 100/100 | arena/01a09829-translatechan | #113 | Merged (this PR, 17 docs, hash 937e5467fefe661773f4c0ad5397399963612794d5becf341865d0bee242071b) |
| 058 | .orchestrator/prompts/058-p1-complete-marking.md | P1 Complete marking 10 docs | — | — | Pending — next |
| 059 | .orchestrator/prompts/059-p2-tier2-yulu-batch1.md | P2 Tier2 yulu batch1 Guiyang+Fayan | — | — | Pending |
| 060 | .orchestrator/prompts/060-p3-lineage-expansion-150.md | P3 Lineage expansion 25 masters to 60 | — | — | Pending |

## Active Milestone
P1 — Restore Tier1 missing (Biyanlu done) + make 10 partial docs complete_selected_witness. W1 COMPLETE/CORRECTED, remediation in progress, Pages revamp Phases 1-3 complete, enthusiast fulls ingested (16 docs main), Biyanlu re-key (17 docs) merged.

## Task Queue
- [x] PR #29: Wumenguan re-keyed to T2005 (62 fields) — Merged
- [x] PR #30: Biyanlu first re-key (20 fields) — Merged, superseded by PR #113
- [x] PR #32: Linji Yulu re-key to T1985 — Merged, superseded by P2.9 purge/rebuild
- [x] PR #43: Six CITATION rows fix (Zhaozhou T1987 withdrawn etc.) — Merged
- [x] PR #46-#50: Pages revamp Phases 1-3 — Merged (main 3a6ae32)
- [x] PR #108: Wumenguan+Linji combined overlay (14 docs) — Merged (main 43be5c6)
- [x] PR #112: Tier2 batch1 (16 docs) — Merged (main 5d44864)
- [x] PR #113: P1 Biyanlu Cases re-key 100/100 T48n2003 (17 docs, 400/400 EXACT, 103020 zh_chars, hash 937e5467fefe661773f4c0ad5397399963612794d5becf341865d0bee242071b) — Merged (this session)
- [ ] 058-p1-complete-marking: 10 partial → complete_selected_witness with honest unit_targets — Pending, next single-PR
- [ ] 059-p2-tier2-yulu-batch1: Guiyang + Fayan authenticity labels or R-A re-key — Pending
- [ ] 060-p3-lineage-expansion-150: 25 new masters from Guzunsu yulu to 60 — Pending
- [ ] Later: 31 lineage edges exact-locator, W2 verified-quotation spot-check, real-browser verification (frozen), rights review (human)

## Interrupted Work
- None — PR #113 pushed cleanly, no expired agent branch. Previous session's arena/01a09829 branch was coding agent branch, not orchestrator branch; its work is now in main.

## Deferred / Technical Debt
- Congronglu front matter + 著語 apparatus, gongan indexing — open
- Caoshan Benji T47n1987B probe, not merged
- Translations for enthusiast fulls — human editorial sign-off pending
- 31/31 lineage edges traditional_link_pending_exact_locator — exact-locator work remains
- Real-browser screenshot/accessibility evidence unavailable (ECONNRESET 2026-08-11)
- Branch protection on main unconfirmed (403)
- JSON Schema declarative only; Python validator is enforced contract
- Rights review — all rights_manifest sources await human/jurisdiction review
- Provenance census now 47 total / 32 rendered / 16 docs / cbeta 16 — previous 49/38/22/16 stale lines fixed in this PR

## Scope Boundaries
- Public scope exactly 5 rooms (Reader, Matrix, Lineage, Gong'an Index, Lexicon), smoke-guarded; Translation Studio, Arena Agents, header GitHub link stay out.
- Never generate source-looking Classical Chinese — only pinned digest-verified CBETA witnesses.
- Never edit `.github/workflows/*` without owner approval; OPERATIONS.md sole register.
- OUT-OF-CBETA 31-doc human-sourcing queue is human work only — agents may only work label/citation rows already assigned (Ruling 4).
- Representation ≠ completion — only explicit completion_status counts.
- docs/ is generated — never hand-edit docs/ files.
- Never edit checker to make gate pass — fix prose, not checker.

## Architectural Invariants
- Pipeline fixed: data/ → validate_data.py → project_metrics.json → build_data_bundle.py → root + docs mirror → Pages publishes main/docs.
- Five gates pass before every push: py_compile, validate_data, build_data_bundle, test_source_preservation, test_source_review_rules, smoke_test, diff.
- Gate: unprivileged disposable clone, stdlib-only, read-only, Python 3.11 min, tested 3.11/3.12/3.13, sha256 every manifest file mandatory, deterministic bundle.
- Internal identifiers stay: translatechan_*, window.TranslateChan, TRANSLATECHAN_DATA; brand "Fake Chan Factory".
- Sessions append-only, dated evidence never edited/deleted.
- Completion rule: complete ⇔ complete_selected_witness + collated_to_claimed_witness + unit_targets met.
- Witness rule: ≥1 evaluated content field must collate to claim witness; reference listed in WITNESS map is bibliographic pairing, not collation evidence.
- R-A/R-B/R-C policy: R-A verbatim re-key where carrier exists, R-B label as retelling where not, R-C human work for OUT-OF-CBETA.
- Provenance labels precedence recension_note → editorial_note → cbeta_note, one line each, coverage_note ledger exemption.

## Known Gaps
- Per-document source remediation remains pending under R-A/R-B/R-C; public status model prevents unsupported completion claims.
- Real-browser evidence unavailable.
- Branch protection unconfirmed.
- 31 lineage edges pending exact locator.
- JSON Schema declarative only.
- Rights review human.

## Hardening Log
| Date | Seq | Category | Symptom | Impact | Disposition | Hardening |
|---|---|---|---|---|---|---|
| 2026-09-22 | 057 | Prompt | Task base main 43be5c6 (14 docs) but current main 5d44864 (16 docs) — adapt to 17 docs | blocked 10 min, required rebase to main 16 + biyanlu | Hardening candidate | Next prompts should pin base as "current main" not fixed SHA, and state "adapt to current doc count" |
| 2026-09-22 | 057 | Repository | vision.md line 64 stale census `cbeta_note` in 16 flagged even though measured 16 — validator hardcodes 16 as stale | blocked 15 min, required phrasing change to `cbeta_note` 16 without "in" | Hardening candidate | Validator should compare measured vs matched, not hardcode 16 as stale; update test_source_review_rules.py stale list to exclude current count |
| 2026-09-22 | 057 | Environment | git clone shallow with 2 commits, no merge-base between arena branch and main — merge unrelated histories | blocked 5 min, required reset --hard origin/main then re-apply biyanlu | Scoped | — |
| 2026-09-22 | 057 | Repository | .orchestrator/STATE.md legacy schema, no .orchestrator/local/ORCHESTRATOR_STATE.md, no docs/PROJECT_STATE.md canonical tracker | blocked 30 min for handoff prep | Hardening candidate | Create docs/PROJECT_STATE.md per Knowledge Bridge Doctrine + .orchestrator/local/ORCHESTRATOR_STATE.md per Repository State Protocol on next orchestrator bootstrap |

