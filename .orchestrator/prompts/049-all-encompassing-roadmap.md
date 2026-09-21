# Task 049 — All-Encompassing Chan Scope Roadmap — Ideal Vision — Complete Document Draft — Agent Scopes Himself

0. FETCH AND VERIFY
   git fetch --depth 1 origin main
   git log --oneline origin/main -5
   Verify main is 83f1cbd (38 docs, 4 collated, 1,606 locators, 553k content CJK, 4.85M bundle, P0+P1 done, P2 dispatched)

1. TASK TITLE AND SCOPE
   All-Encompassing Chan Scope Roadmap — Ideal Vision — Complete Document Draft — Lands a roadmap onto main as a complete document drafting a roadmap of all-encompassing Chan scope. It doesn't have to be followed yet, it's an ideal vision. This agent must **scope out himself** what "full chan roadmap" actually entails by searching for teachers, books, translators, works, etc. — not just reduce to what previous agent found. What we found already is provided as starting point, but agent must search and expand.

   What we found already (starting point, not exhaustive):
   - 35 masters in data/lineage/masters.json, missing ~115-165 for exhaustive 150-200
   - 38 docs in data/corpus/, 0 complete, 31 excerpt_seed, 7 partial, 4 collated (zhengdao_ge, congronglu 100/100, chuandenglu_full 1,274 units, caoshan_benji 84 units)
   - Terebess 500+ entries textindex.html, Zen Mountain Monastery, Shambhala, BDK America, Columbia, Hawaii — English translations
   - Some renowned translations: Blue Cliff Record Cleary 2005, BDK 2006, Hinton 2024, Book of Serenity Cleary 2005, Gateless Gate Aitken, Sekida, Platform Sutra Yampolsky 1967, Red Pine 2006, McRae 2000, Linji Sasaki 1975, Kirchner 2009, Watson 1999, Zhaozhou Green 1998, Huangbo Blofeld 1958, Dongshan Powell 1986, Dogen Masunaga 1958 etc., translators Thomas Cleary 70+ vols, Burton Watson, Ruth Fuller Sasaki, D.T. Suzuki pioneer, John McRae, Jeffrey Broughton, Bernard Faure, Robert Buswell, etc.
   - But there are far more books — agent must scope himself via web_search and fetch_page

2. REQUIRED READING ORDER
   - .orchestrator/MASTER_REFERENCE_2026-09-20.md — 28KB draft master reference — starting point, not exhaustive — contains naming convention why Zhaozhou Yulu vs Zhaozhou Congshen, Baizhang Qinggui vs Baizhang Huaihai, popular/in-use names registry + aliases, all Chinese masters 35 current + missing, all works tiered, some English books with ISBN
   - .orchestrator/ROADMAP_100PCT_600-1400_2026-09-19.md — foundation roadmap 35 docs 0 complete 104975 CJK 1-2% volume, Tier1 missing, 0 teachers fully ingested
   - .orchestrator/NEXT_TASKS_2026-09-19.md — P0-P6 scoping
   - vision.md — objectives at full strength
   - data/lineage/masters.json — 35 masters with alternative_names
   - data/corpus_manifest.json — 38 items
   - data/project_metrics.json — 38 docs, 553k content CJK, 1,606 locators, 4 collated, 630 flagged

3. PROJECT CONTEXT
   TranslateChan 38 docs after P1, 1252 slots verified 177 matrix 21, locators 148→1606, 630 flagged authoritative stays, 0 unauthorized 373 permitted + 3 new docs, 145 checks, bundle 4.85M deterministic. Headline "The old texts are real; the translators are not." Objectives at full strength not renegotiated. Pages out of scope per 2026-09-19. Evidence model: authoritative 2026-09-20 register 38 docs (CAOSHAN_BENJI), 630 authoritative. P1 complete. P2 dispatched. Need all-encompassing roadmap ideal vision landed onto main as complete document — agent must scope himself what full Chan roadmap entails.

4. AGENT INSTRUCTIONS — SCOPE HIMSELF (CRITICAL)
   - **DO NOT reduce to the ISBNs or examples listed in previous prompts.** Those were examples from what we found already, not exhaustive.
   - **You must search yourself** for:
     - Chinese masters 600-1400: search web for "Chan masters Tang Song list Five Houses", "Zen lineage chart", "Caodong Soto masters", "Linji Rinzai masters", "Yunmen Ummon masters", "Guiyang Igyo masters", "Fayan Hogen masters", "Hongzhou school Mazu disciples", etc. Use web_search depth 2-3, fetch_page Terebess, Wikipedia Zen lineage, etc.
     - Works: search for "CBETA Chan works list T47 T48 T51 X", "Zen koan collections", "Chan yulu list", "Denglu transmission records list", "Chan monastic codes", "Chan treatises Xinxin Ming Zhengdao Ge Sandokai Baojing Sanmei", etc.
     - English books: search for "Terebess Zen textindex", "Zen Mountain Monastery teachings", "Shambhala Zen books", "BDK America Chan translations", "best English translations Zen classics", "Thomas Cleary Zen translations list", "Burton Watson Zen", "Red Pine Zen", "David Hinton Chan", "John McRae Chan", "Bernard Faure Chan", etc. Use web_search and fetch_page https://terebess.hu/zen/textindex.html and other sources. Extract author, translator, ISBN, publisher, year, pages, original Chinese title, CBETA ID where possible.
     - Translators: search for "renowned Zen translators Thomas Cleary Burton Watson Red Pine", "Zen translators list", etc.
     - Aliases: search for popular vs scholarly names — e.g., Zhaozhou Congshen also called Joshu Jushin, Zhao Zhou, Chao-chou, etc.; Baizhang Huaihai also called Hyakujo Ekai, etc.
   - **Tell what you found already as starting point, but expand far beyond it.** Previous agent found ~10 English books with ISBNs, but Terebess alone has 500+ entries — you must inventory far more.
   - **Goal:** If you wanted to build an all-exhaustive wiki + database + reference manifest for Chan 600-1400, what would you need? Everything to be aware of. So list all Chinese masters, all aliases, all works tiered by enthusiast/scholarly/long-tail, all English books renowned translations with metadata.
   - **Use web_search tool extensively** — at least 5-10 searches for masters, works, translators, English books, Terebess, etc. — and cite sources with [id](url) format.
   - **Do not hallucinate ISBNs** — only include ISBNs you can verify via search/fetch, or mark as "ISBN not verified, needs lookup". Better to have many books with honest "needs lookup" than few with specific ISBNs.

5. CORE OBJECTIVE
   Land the all-encompassing Chan scope roadmap onto main as a complete document drafting a roadmap of all-encompassing Chan scope — ideal vision, doesn't have to be followed yet. Agent scopes himself what full Chan roadmap entails via search, not just what previous agent found. This document should be the master list of all Chinese masters, all aliases, all works tiered, all English books with author/ISBN/translator, future wiki+database+reference manifest structure, naming convention fix, roadmap to overtake English front, and next steps.

6. EXACT DELIVERABLES
   - `.orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md` OR `docs/ROADMAP_ALL_ENCOMPASSING.md` OR `ROADMAP_ALL_ENCOMPASSING.md` — complete document (ideally .orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md + copy to docs/ or root for visibility) — contains:
     - §1 Naming Convention — Why Zhaozhou Yulu vs Zhaozhou Congshen, Baizhang Qinggui vs Baizhang Huaihai, etc. — popular/in-use names registry + aliases noted — example registry entry for zhaozhou_congshen — explain why we need popular_name + aliases
     - §2 All Chinese Masters 600-1400 With Aliases — current 35 + missing ~115-165 for 150-200 exhaustive — agent must search and list as many as possible via web_search, not just 35 — list with id, name_zh, name_en_popular, name_en_formal, aliases, works, popular_work_names — Five Houses founders 7, Tang ~50, Song ~50, Denglu compilers ~10, Indian frontier — cite sources
     - §3 All Works Tiered — Tier1 enthusiast daily practice top 10 most-read + Tier1 still missing for enthusiast 100% (Zhaozhou full, Mazu full, Huangbo full, Dongshan full, Yunmen full, Dahui Letters full) + Tier2 core yulu incomplete 0/6 P2 + Tier3 long tail scholarly ~80% volume — agent must search CBETA Chan works list T47 T48 T51 X, inventory as many works as possible, each work with id, title_zh, title_en_popular, title_en_scholarly, author_master_id, cbeta_id, tier, zh_chars, aliases, english_translations — cite sources
     - §4 All English Books Renowned Translations — agent must search Terebess 500+ entries, Zen Mountain Monastery, Shambhala, BDK, Columbia, Hawaii, etc. via web_search and fetch_page — inventory as many English translations as possible with author, translator, ISBN, publisher, year, pages, original Chinese title, CBETA ID, tier, rights_status, url, notes — do not reduce to 10 examples, aim for 50-100+ entries with honest metadata (ISBN verified or needs lookup) — cite sources with [id](url) — include translators list Thomas Cleary 70+ vols, Burton Watson, Ruth Fuller Sasaki, D.T. Suzuki pioneer, John McRae, Jeffrey Broughton, Bernard Faure, Robert Buswell, Red Pine, David Hinton, etc. — example entry JSON but many more
     - §5 Roadmap to Overtake English Front Draft (Not Working Yet) — 5 steps: Inventory Phase P6 English crawl Terebess 500+ + ZMM + Shambhala + BDK + Columbia + Hawaii extract all English translations with metadata, Gap Analysis vs 38 docs, Rights Manifest check, AI Translation Plan for 1,252 slots, Build data/english_references.json — agent scopes what overtaking entails
     - §6 Master List for Exhaustive Wiki+Database+Reference Manifest Future — data/masters/ one JSON per master, data/works/ one JSON per work, data/english_references/ one JSON per English book, data/aliases.json popular→canonical, data/popular_names.json registry
     - §7 Next Steps for Enthusiast 100% — land full Zhaozhou Yulu X68n1315, Mazu Yulu X1321, Huangbo Chuanxin Fayao T2012A, Dongshan Yulu full T1986, Yunmen Yulu full T1988, Dahui Letters full, finish P2 047/048, add popular names registry
     - §8 Next Steps for Exhaustive 600-1400 100% — 150-200 titles, 5-10M CJK, 200-300h, no auto ingestion, segment_classical.py manual, collate_refs.py pinned dbdea410, etc.
     - §9 Verification — current measured state 38 docs 0 complete 31 excerpt_seed 7 partial 4 collated 553k content CJK 1,606 locators 630 flagged 145 checks 4.85M bundle
     - Must include citations for searched facts [id](url)
   - `data/aliases.json` OR `data/popular_names.json` draft — popular/in-use names registry + aliases noted for masters and works — at least 20 entries example (zhaozhou_congshen, baizhang_huaihai, etc.) with popular_name, aliases
   - `data/english_references.json` draft OR `sessions/ENGLISH_REFERENCES_DRAFT_2026-09-20.json` — draft list of English books with metadata from search, at least 50 entries, honest ISBN verified or needs lookup, with citations
   - Report `sessions/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md` with gate outputs verbatim, before/after, search summary, counts

7. SUB-TASK BREAKDOWN
   1. Read .orchestrator/MASTER_REFERENCE_2026-09-20.md 28KB 376 lines draft — starting point, not exhaustive
   2. Web search for Chinese masters: at least 3 searches for Chan masters list, Five Houses, lineage chart — fetch pages, extract masters and aliases
   3. Web search for works: at least 2 searches for CBETA Chan works list, Zen koan collections, yulu list, denglu list — inventory works tiered
   4. Web search for English books: at least 5 searches for Terebess Zen textindex, Zen Mountain Monastery teachings, Shambhala Zen books, BDK America Chan translations, best English translations Zen classics, Thomas Cleary translations list, etc. — fetch Terebess textindex.html and other pages, extract English translations with metadata
   5. Expand into complete document .orchestrator/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md with all sections §1-§9, include as many masters, works, English books as found via search (aim 100+ masters, 100+ works, 50+ English books), with citations, honest ISBN verification
   6. Create data/aliases.json or data/popular_names.json draft with at least 20 entries popular→canonical
   7. Create data/english_references.json draft or sessions/ENGLISH_REFERENCES_DRAFT_2026-09-20.json with at least 50 English books from search
   8. Run gates: py_compile, validate_data corpus38 locators1606 collated4 flagged630, build_data_bundle 38 docs 4,851,526 B deterministic byte-identical, preservation 0 unauthorized, review 145+, smoke 38 texts, mirror diff — quote verbatim
   9. Create sessions/ROADMAP_ALL_ENCOMPASSING_2026-09-20.md report with search summary, counts, gate outputs verbatim
   10. Commit + push, PR description includes roadmap sections, master counts, work counts, English books counts (from search), gate outputs verbatim, search citations, BANNED COMMANDS followed

8. BRANCH AND TARGET
   Base: main 83f1cbd (38 docs, P0+P1 done, P2 dispatched)
   Target: docs/all-encompassing-roadmap
   Orchestrator: arena/01a09829-translatechan

9. WORK PERSISTENCE AND BANNED COMMANDS
   BANNED: git show <sha> without --name-only/--stat, git show | head, git diff without --name-only/--stat when bundle changed, git log -p on bundle. SAFE: --name-only, --stat, --oneline, ls -lh, cat, jq.
   Pages scope: github pages deployment and creation is outside of the scope of translatechan agents, unless specifically asked for. No Pages work.

10. TECHNICAL REQUIREMENTS
    - No edits to data/corpus/*.json manually — only new roadmap docs + aliases.json draft + english_references.json draft + generated metrics/bundle if needed (but bundle should stay same as no corpus change, only docs)
    - No new runtime deps, no secrets, no style= (must stay 0), no new setProperty (census stays 4)
    - Keep COMMON_QUALITIES, RULING_WEBSITE out-of-scope notice
    - Keep corpus integrity: 0 unauthorized for existing 38 must hold
    - Must use web_search tool extensively (at least 5-10 searches) and cite sources [id](url) — do not hallucinate ISBNs, mark needs lookup if not verified

11. SAFETY
    - No workflow edit (quality.yml retired text-integrity only, do not edit)
    - 630 authoritative stays authoritative, no re-designation
    - No claiming website beautiful/done — Pages out of scope
    - Ideal vision, doesn't have to be followed yet — no corpus edits required
    - Do not reduce to examples — scope himself what full chan roadmap entails via search

12. CLEANUP
    Clean worktree, no committed refs, no __pycache__, no /tmp/refs committed

13. OUT OF SCOPE
    - No Pages deployment/creation, no 36-layout work
    - No corpus ingestion — that's P1-2, P1-3 done, P2 dispatched, enthusiast 100% next agent (Task 050)
    - No English translations yet — roadmap draft only, not working on it yet per user — this task is scoping, not translating
    - No lineage exact locators — P3
    - No rights review — P4
    - No translation verified slots — P5

14. QUALITY CHECKS
    py_compile PASS, validate PASS corpus38 locators1606 collated4 flagged630, build PASS 38 docs 4,851,526 B deterministic byte-identical, preservation PASS 0 unauthorized, review PASS 145+, smoke PASS 38 texts, mirror diff PASS, no law verbatim, RULING_WEBSITE out-of-scope, quality.yml retired, roadmap complete with all sections §1-§9, aliases registry draft 20+ entries, english_references draft 50+ entries from search with citations, search summary, no hallucinated ISBNs

15. PR DESCRIPTION
    Summary all-encompassing Chan scope roadmap ideal vision complete document — agent scoped himself via web_search what full Chan roadmap entails (masters, works, translators, English books), master list all Chinese masters aliases works tiered English books with citations, naming convention fix popular/in-use names registry, roadmap to overtake English front Terebess ZMM Shambhala BDK, future wiki+database+reference manifest structure, next steps enthusiast 100% and exhaustive 100%, gate outputs verbatim, search citations, BANNED COMMANDS followed, Pages scope respected.

16. HARDENING REPORT
    Record roadmap sections, master counts, work counts, English books counts from search, search queries used, citations, branch mismatch if any, BANNED COMMANDS followed, gate outputs.

