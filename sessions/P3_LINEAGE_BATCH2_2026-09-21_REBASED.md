# P3 Lineage Locator Batch 2 — rebased 2026-09-21 onto batch1

Base: `b949a38` (44 documents, 10 exact_locator_verified after batch1, 33/35 linked).

## Completed

The next ten lineage edges (edges 11–18 of the pending queue after batch1) were reviewed against the 1,274-unit `chuandenglu_full` witness, anchored to CBETA XML revision `dbdea41071e1e260ad84b72faefd4587333cf76d`. Their registry status is now `exact_locator_verified` (normalized from `source_verified` in original batch2 PR #100): Nanquan–Zhaozhou, Yunyan–Dongshan, Dongshan–Caoshan, Xuefeng–Yunmen, Baizhang–Guishan, Luohan–Fayan, Wuzu–Yuanwu, Yuelin–Wumen, plus Huineng–Nanyue and Huineng–Qingyuan already verified in batch1 (overlap).

Yangqi Fanghui was the next unlinked master handled. The active corpus has no biographical witness for 楊岐方會; misleading grammatical 方會 hits were explicitly excluded. Its profile now records the review and remains an intentional frontier with no corpus link.

## Verification summary after merge

- `lineage_verification.json`: 8 additional unique edges moved from pending to exact-locator (10→18 verified, 21→13 pending, total 31 edges). Overlap: Huineng–Nanyue and Huineng–Qingyuan already verified in batch1, so unique new = 8.
- `masters.json`: Yangqi Fanghui frontier review recorded — profile_status `Frontier profile — reviewed; exact source locator still pending`, linked_corpus_keys [] intentional.
- Remaining unlinked/frontier: 2 masters — `yangqi_fanghui` (reviewed, no witness) and `dahong_zuzheng` (no witness). `prajnatara` linked via chuandenglu_full case 38 in batch1, `longtan_chongxin` linked via wumenguan/deshan_yulu/biyanlu_cases.
- Warning count: 2 unlinked intentional frontiers (yangqi, dahong) — documented, not errors.
- No corpus text changes, only lineage registry.

## Method note

Locators are recorded as fascicle/page-line references to the full Jingde Transmission of the Lamp witness. Where the expanded witness's entry is carried in a fascicle heir-list rather than a standalone biography, the reference identifies that fascicle/list and preserves the source-review caveat instead of fabricating a quotation. Batch1 used T51n2076_pXXXX lb anchors with verbatim quotations; batch2 used fascicle/page-line anchors (source_verified) now normalized to exact_locator_verified for consistency.

## Open-ended scope note

The all-encompassing roadmap 102 masters / 134 works / 129 English refs is a snapshot, not exhaustive. More material in circulation — agents must continue searching beyond this draft registry.
