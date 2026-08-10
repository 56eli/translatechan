# Congronglu Containment Record — 2026-08-10

> **Session:** `arena/019febb1-translatechan`
> **Trigger:** user selected “Contain P0 content” after the full audit.
> **Decision:** remove the entire Congronglu seed from active corpus, bundle, navigation, metrics, and locator claims; delete obsolete scripts capable of recreating it.

## Why the whole document was quarantined

The initial audit proved that 28/35 cases shared identical generic `commentary_zh` and `verse_zh` values authored in old ingestion scripts. A containment follow-up then checked the five records previously labeled `collated_with_normalization` against the authoritative CBETA P5 source:

- Repository: `cbeta-org/xml-p5`
- File: `T/T48/T48n2004.xml`
- Raw source: `https://raw.githubusercontent.com/cbeta-org/xml-p5/master/T/T48/T48n2004.xml`
- Retrieved through GitHub API on 2026-08-10
- Retrieved-file SHA-256: `5899ca8f50ae9c1f3d9328424e2cc40187c96a4d6805e5b19239b3bfc5580457`

The active data's five “collated” cases did not match the source headings:

| Case | Quarantined record | Authoritative T48n2004 heading | Authoritative line head |
|---:|---|---|---|
| 33 | 南泉見人作貓兒 | 第三十三則三聖金鱗 | `T48n2004_p0249b21` |
| 34 | 盤山心印 | 第三十四則風穴一塵 | `T48n2004_p0250a10` |
| 35 | 俱胝豎指 | 第三十五則洛浦伏膺 | `T48n2004_p0250b19` |
| 37 | 洞山麻三斤 | 第三十七則溈山業識 | `T48n2004_p0252a03` |
| 38 | 百丈野狐 | 第三十八則臨濟真人 | `T48n2004_p0252b28` |

The quarantined registry had claimed `T2004_p0196c` through `p0199c`, while the authoritative headings above are on pages 249–252. This disproved both numbering and locator claims. Since the remaining records were generated/uncollated or had only case-number anchors, none met the project's release standard.

## Changes

1. Removed `data/corpus/congronglu_cases.json` from the active source tree.
2. Removed its manifest item and canonical locator registry entry.
3. Removed four obsolete mutable ingestion snapshots:
   - `scripts/ingest_autonomous_wave3.py`
   - `scripts/ingest_autonomous_wave4.py`
   - `scripts/ingest_content_wave.py`
   - `scripts/ingest_linji_and_platform_sutra.py`
4. Added explicit manifest `completion_status` to all active documents:
   - `complete_selected_witness`
   - `partial_selected_witness`
   - `excerpt_seed`
5. Changed completion metrics/UI so N/N representation never creates a complete checkmark by itself.
6. Added a validator error when a substantial case-specific Chinese source field repeats identically across three or more cases.
7. Added smoke regressions proving Congronglu is absent from the active bundle/navigation and Biyanlu/Platform remain incomplete despite N/N representation.
8. Corrected public verification language: a checkmark now means edition-verified wording; rights/public-domain status remains separate.
9. Updated README, Roadmap, research-release plan, hero/metadata, and OG artwork to the containment state.

## Reintroduction gate

Congronglu may return only through a new authoritative T48n2004 ingestion:

1. pin a CBETA revision/file hash;
2. map actual case headings and line heads from TEI;
3. preserve pointer, main case, commentary, verse, and post-verse commentary as separately sourced fields;
4. store field-level provenance and collation status;
5. add negative fixtures for numbering, source duplication, and locator drift;
6. obtain human editorial spot-check/sign-off before public release.

Git history preserves the removed seed for forensic comparison; it must not be copied into a new ingest.
