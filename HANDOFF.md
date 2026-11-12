# 🤝 Fake Chan Factory — Project Handoff

> **Repository:** `56eli/translatechan`
> **Public site:** `https://56eli.github.io/translatechan/`
> **Deployment:** native GitHub Pages from `main /docs`, HTTPS
> **Canonical tracker:** [`docs/PROJECT_STATE.md`](./docs/PROJECT_STATE.md)
> **Current audit:** [`AUDIT.md`](./AUDIT.md)

## 1. Start here

1. Read [`AGENTS.md`](./AGENTS.md).
2. Read [`docs/PROJECT_STATE.md`](./docs/PROJECT_STATE.md).
3. Read [`OPERATIONS.md`](./OPERATIONS.md).
4. Work only on the Arena-fixed session branch.
5. Treat the root `index.html` owner stub as the sole layout authority.

Historical reports and retired design specs are evidence, not current instructions.

## 2. Product and architecture

Fake Chan Factory is a zero-backend static reader/research project for Classical
Chinese Chan literature. The current public stub navigation is Lineage, Library,
Terms, Gallery, Account. The old five-room walnut shell is retired.

```text
data/*.json
  → scripts/validate_data.py
  → data/project_metrics.json
  → scripts/build_pages.py
  → docs/index.html + docs/data/ + crawler files
  → GitHub Pages publishes main/docs
```

There is no runtime JavaScript bundle and no runtime npm package. The stub fetches
`data/` relative to the page. `docs/index.html` must remain byte-identical to root
`index.html`; `docs/data/` must remain byte-identical to `data/`.

## 3. Current design direction

Owner directive, 2026-11-12: exhaustively destroy the old layout protected by the
build process, documentation, and tests. The re-uploaded root stub is the design
the owner wants. Do not transform the stub back into the walnut shell, do not
restore `app.js`/`app.css`/`app_data.js`, and do not revive the old smoke/browser
DOM contract.

The stub is a reset point, not a finished port. Next work must add missing
functionality inside the stub's authority while preserving data integrity.

## 4. Measured snapshot

```text
corpus=17 | slots=209 | verified=2 | matrix=21 | locators=4192/4192
source-review: collated=13 | partial/failed=2 | unavailable=2
content CJK=878,582 | all-string CJK=937,884
lineage=60 masters | glossary=31 | gongan=24
```

Verified citation reference coverage is **3 / 4**; the remaining **1** reference
is explicitly pending. Edition verification still does not establish reuse rights.

The data contract keeps **five separate ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review. Containment/remediation state, not a rights decision. Source collation does not approve reuse. Title and name metadata (title_zh, name_zh) is measured and reported separately from source content, so collated_to_claimed_witness is not proof that the excluded metadata fields were collated.

W1 evidence: **17 documents, 127 flagged source fields**. Authoritative register:
`sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json`. Historical register:
`sessions/COLLATION_REGISTER_2026-09-09.json` (2026-09-09). The historical 637
report figure is superseded; the historical 622 register figure is not the current
active-corpus measurement. Zhaozhou's former T1987 claim is false: T1987 is the
Caoshan record.

Completion requires explicit `complete_selected_witness`, satisfied unit targets,
and `collated_to_claimed_witness`. **12 of 17 documents** are `complete_selected_witness`.
The five non-complete documents are `zhengdao_ge`,
`hanshan_poems`, `niutou_juezhu`, `guiyang_yulu`, and `fayan_yulu`.

## 5. Release blockers

### Content and rights

- All rights-manifest sources remain human/jurisdiction-review pending.
- Partial/failed and witness-unavailable source states remain contained; no
  rights approval is inferred from collation.
- OUT-OF-CBETA witness acquisition/transcription is human work, not agent work.
- Zhaozhou's false T1987 claim stays withdrawn; T1987 is the Caoshan record.

### Engineering and operations

- The stub reader is cases-only; non-case corpus shapes need porting.
- Comparative matrix, gongan index, locator/provenance ledgers, and research
  surfaces need to be ported into the stub without restoring the retired shell.
- Gallery is placeholder; Account is localStorage UI only, not authentication.
- No real-browser evidence exists for the current stub.
- Branch protection/required Quality on `main` remains an owner-side verification
  item; see `OPERATIONS.md`.
- Botrunner export manifest/ready marker are known stale and fail closed; no
  exporter was implemented by the demolition.

## 6. Quality commands

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_pages.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
python3 scripts/test_pages_contract.py
diff -rq data docs/data
git diff --check
```

The retired `smoke_test.mjs`, `compat_runtime_check.mjs`, and `browser_test.mjs`
are deleted. A future browser suite must test the owner stub, not the old DOM.

## 7. Safe content workflow

1. Name the selected edition/recension and stable locator.
2. Import only from authoritative pinned sources; never generate canonical-looking
   Chinese.
3. Keep source review, representation, translation verification, locators, and
   rights separate.
4. Add exact unit locators and provenance notes where claims change.
5. Regenerate metrics only through protected `--write-metrics`.
6. Rebuild the Pages mirror and run all gates.
7. Obtain human editorial/rights review before broader reuse claims.

## 8. Repository map

```text
index.html                         # owner-stub layout authority
data/                              # source-of-truth corpus and research indexes
  glossary/                        # 31 Classical Chan & Buddhist lexicon terms
  gongan/                          # 24 Gong'an cross-references index entries
schemas/                           # declarative schema; validator enforces semantics
scripts/                           # validator, build, preservation, W1, Pages contract
sessions/                          # full append-only evidence record
docs/                              # Pages mirror + curated docs/evidence
  audits/                          # curated public evidence mirror
OPERATIONS.md                      # owner-controlled CI/GitHub admin register
```

`docs/audits/` vs `sessions/`: `docs/audits/` is a small curated public mirror of
selected evidence; `sessions/` is the full append-only evidence record. Both are
evidence, never current layout instructions.

## 9. Documentation rule

- Current authority: `AGENTS.md`, `docs/PROJECT_STATE.md`, `HANDOFF.md`,
  `AUDIT.md`, `ROADMAP.md`, `GATE.md`, `OPERATIONS.md`.
- Retired design specs are explicitly non-authoritative.
- `sessions/` dated records are immutable; supersede with a new dated record.
- Never append a full session narrative here; link the dated report.
