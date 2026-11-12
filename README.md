# 🤖 Fake Chan Factory (`translatechan`)

> A proudly-fake AI translation factory robolating Chan/Zen translator registers
> over Classical Chinese corpus records with explicit source-review states.

**Current layout authority:** the owner-uploaded root `index.html` stub. On
2026-11-12 the rejected walnut-shell frontend was demolished: `app.css`, `app.js`,
`app_data.js`, `theme-init.js`, the old deploy shell, old social-card assets, and
the presentation-pinning smoke/browser gates are gone. The build now publishes
the stub and authoritative JSON data only.

Most English renderings are **🤖 Robo** versions — AI text written in a famous
translator's register, not their words and not citable as their work. A verified
quotation badge means wording was checked against a recorded edition; rights
review is separate.

## Current public stub

The stub is a self-contained static HTML/CSS/JS page with hash navigation:

- Lineage
- Library
- Terms
- Gallery
- Account

It fetches `data/` relative to the page. GitHub Pages publishes `main /docs`, so
`scripts/build_pages.py` mirrors root `index.html` and `data/` into `docs/`.
There is no runtime JavaScript bundle and no runtime npm dependency.

Known stub gaps are tracked in [`docs/PROJECT_STATE.md`](./docs/PROJECT_STATE.md):
the reader is currently cases-only, Gallery is a placeholder, Account is a local
UI gate only, and the comparative/provenance research surfaces still need to be
ported into the stub.

## Measured corpus status

The active manifest (17 keys) contains **17 documents**. **12 of 17 documents** are `complete_selected_witness`
under the validator rule: explicit completion status,
`collated_to_claimed_witness`, and satisfied unit targets. The remaining documents
are excerpt seeds: `zhengdao_ge`, `hanshan_poems`, `niutou_juezhu`,
`guiyang_yulu`, and `fayan_yulu`.

Generated metrics report **878,582 source-content CJK characters** (or 937,884 across every corpus JSON string, including metadata). Representation counts never
establish completion by themselves.

- Wumenguan: **48 / 48 cases represented; W1 source-review status: `collated_to_claimed_witness`**.
- Biyanlu: **100/100 cases** represented; completion is separately validated.
- Lineage data: currently **60 master profiles**.
- Gong'an index data: — **24 indexed cases** at present.
- Lexicon data: **31 terms** today.

## W1 source-review status model

The data contract keeps **five separate ledgers**: Source collation (W1) · Represented units · Translation & edition verification · Canonical source locator · Rights review. Containment/remediation state, not a rights decision. Source collation does not approve reuse. Title and name metadata (title_zh, name_zh) is measured and reported separately from source content, so collated_to_claimed_witness is not proof that the excluded metadata fields were collated.

Current manifest source-review counts:

- `collated_to_claimed_witness`: **13**
- `partial_or_failed_w1_collation`: **2**
- `witness_unavailable`: **2**

W1 evidence: **17 documents, 127 flagged source fields**. Authoritative register:
`sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json`. Historical register:
`sessions/COLLATION_REGISTER_2026-09-09.json` (2026-09-09). The historical report's
637 figure is superseded; the historical register's 622 figure is historical, not
the current active-corpus measurement.

Zhaozhou's former claimed witness T1987 is false: T1987 is the Caoshan record.
The claim was withdrawn, not re-pointed at an unverified candidate.

## Translation disclosure

Current measured English layer: **2 verified quotation slots across 2 corpus texts + 2 verified comparative-matrix entries**. Edition verification does not
grant reuse rights. All rights-manifest sources still require their documented
human/jurisdiction review.

## Repository structure

```text
index.html                 # owner-stub layout authority
robots.txt / sitemap.xml   # crawler files
.nojekyll                  # Pages marker
data/                      # authoritative JSON corpus and research indexes
  corpus_manifest.json     # manifest (17 keys)
  corpus/                  # source documents
  lineage/                 # masters, verification, queues, school vocabulary
  glossary/                # chan_terms.json
  gongan/                  # gongan_index.json and theme vocabulary
  translations/            # matrix, provenance, profiles, rights manifest
  canonical_locators.json
  project_metrics.json     # deterministic generated metrics
docs/                      # GitHub Pages mirror + curated evidence/docs
  index.html               # byte-identical owner stub
  data/                    # byte-identical data mirror
  audits/                  # curated public evidence mirror
scripts/
  validate_data.py
  build_pages.py
  test_source_preservation.py
  test_source_review_rules.py
  test_pages_contract.py
sessions/                  # append-only dated evidence
```

## Local development and checks

```bash
python3 -m py_compile scripts/*.py
python3 scripts/validate_data.py
python3 scripts/build_pages.py
python3 scripts/test_source_preservation.py
python3 scripts/test_source_review_rules.py
python3 scripts/test_pages_contract.py
diff -rq data docs/data
git diff --check

# Preview either the repo root or docs/ after building:
python3 -m http.server 8080
```

Use `--write-metrics` only after a legitimate source-data change. It must fail
closed on blocking data/evidence errors.

## GitHub Pages deployment

Pages publishes from branch **`main`**, folder **`/docs`**, HTTPS enforced.
Live URL: `https://56eli.github.io/translatechan/`.

Publishing flow:

1. Run the gates above.
2. Commit source, metrics, root stub, and the generated `docs/` mirror together.
3. Push the Arena session branch and open a PR to `main`.
4. Require Quality to pass before merge. Pages then publishes `main /docs`.

## Documentation

- [`AGENTS.md`](./AGENTS.md) — agent contract.
- [`docs/PROJECT_STATE.md`](./docs/PROJECT_STATE.md) — canonical tracker.
- [`HANDOFF.md`](./HANDOFF.md) — current handoff and blockers.
- [`AUDIT.md`](./AUDIT.md) — current verdict and evidence index.
- [`ROADMAP.md`](./ROADMAP.md) — next work.
- [`GATE.md`](./GATE.md) — integrity gate.
- [`OPERATIONS.md`](./OPERATIONS.md) — owner-controlled GitHub/workflow register.
- [`SECURITY.md`](./SECURITY.md) — disclosure policy.

Retired design specs (`WEB_VISION_*`, `UX_ROADMAP.md`, old design rulings and
gate-repin stubs) are historical and non-authoritative. `sessions/` is the
append-only evidence record.

## License

See [`LICENSE`](./LICENSE). Code is MIT; corpus/translation data carries its own
CC-BY-SA and third-party quotation/rights caveats.
