# Dispatch 2026-09-22 — Post 14-doc Law Glaring Issues

Base main 43be5c6 → 718fb9e after rollup: 14 docs (12 collated +2 unavailable), 1 complete wumenguan, 13 partial, 775k CJK, 4092 locators, 7.5M bundle.

## Glaring Issues (corpus wise)

**Tier1 missing after purge (practitioner impact):**
- biyanlu_cases 100 cases — historically 100/100 records 353/395 collating, now missing, top 3 koan collection
- platform_sutra 10 chapters — 680 CJK recension split Dunhuang T48n2007 vs Zongbao T48n2008, needs honest recension_note + R-B labels
- xinxin_ming 37 stanzas — 24/37 collating historically
- Only 1 complete (wumenguan) — 13 docs tile verbatim but marked partial, need unit_targets + complete_selected_witness

**Tier2 core yulu 0/6 (13 works per ROADMAP_ALL_ENCOMPASSING §3.3, 4 done):**
- baizhang_guanglu 0/6 only X80n1565 fragments, huangbo_wanling 0/7, dazhu_huihai 0/6, nanquan 0/6, guiyang 0/6, fayan 0/6, xuansha partial, xuefeng_yantou partial, deshan 0/6 — need WITNESS_INVENTORY + authenticity labels per 047 or R-A re-key if ≥80%

**Tier3 long tail:** Wudeng Huiyuan full, Guzunsu yulu 48 fascicles ~20 masters, Zutangji 952 — 80% volume missing

**Lineage/Gongan:** 35 masters vs 150-200 target, 30 edges pending exact locator, 24 gongan vs 248 potential

## Dispatched Agents

- **Agent 057 — P1 Biyanlu Re-key** — `fix/p1-biyanlu-rekey` — T48n2003 100 cases verbatim 400+ fields EXACT
- **Agent 058 — P1 Complete Marking** — `fix/p1-complete-marking` — 10 docs complete_selected_witness via unit_targets
- **Agent 059 — P2 Tier2 Batch1 Guiyang+Fayan** — `fix/p2-tier2-batch1` — authenticity labels or re-key ≥80%
- **Agent 060 — P3 Lineage Expansion 25 masters** — `fix/p3-lineage-60` — Guzunsu yulu to reach 60 masters

Each PR: one doc per PR per Ruling 3 (except complete marking batch), py_compile PASS, validate PASS corpus14-15, build deterministic byte-identical root/docs twice, preservation 0 unauthorized, review 145+, smoke PASS, mirror clean, collate output verbatim quoted, no generated placeholders, no workflow edit, 630 stays authoritative, Pages out of scope.

See stubs:
- .orchestrator/stubs/057-STUB-FORMATTED.md
- .orchestrator/stubs/058-STUB-FORMATTED.md
- .orchestrator/stubs/059-STUB-FORMATTED.md
- .orchestrator/stubs/060-STUB-FORMATTED.md

Prompts:
- .orchestrator/prompts/057-p1-biyanlu-rekey.md
- .orchestrator/prompts/058-p1-complete-marking.md
- .orchestrator/prompts/059-p2-tier2-yulu-batch1.md
- .orchestrator/prompts/060-p3-lineage-expansion-150.md
