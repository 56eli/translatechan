# BookStack Wiki Vision — Exhaustive Chan 600-1400 — Wiki + Database + Reference Manifest — 2026-09-21

**Purpose:** Scope out vision assuming we have a full registry of all teachers — we could register and reference all their translated work in English, source their Chinese origin texts, give % of what is published in books and what hasn't been translated yet, put all information on wiki pages (books, teacher cards, lineage trees), then when all is gathered and different translations comparable or missing we could add AI translations — an exhaustive wiki project hosted with BookStack on a VPS.

Base: main ddce5c3 (44 docs, 10 collated, 4,192 locators, 553k+302k content CJK, 8.7M bundle, P0+P1+P2+enthusiast 100% done)

## 1. Vision Summary — One Paragraph

**Assuming full registry of all teachers 600-1400 (~150-200 masters), we build an exhaustive wiki + database + reference manifest hosted with BookStack on a VPS.** For each teacher: teacher card with popular/in-use names + aliases, dates, lineage depth, teacher, disciples, school (Five Houses: Linji, Caodong/Soto, Yunmen, Guiyang, Fayan + Hongzhou), location, key quote zh/en, Chinese origin texts sourced via CBETA pin dbdea410 with exact lb-anchored locators, English translations referenced via english_references.json with author/translator/ISBN/publisher/year/pages/rights_status/url, and % published in books vs not translated yet. For each work: book page with title_zh, title_en_popular, title_en_scholarly, author_master_id, cbeta_id, taisho_vol, genre (gongan, yulu, denglu, qinggui, treatise), tier (enthusiast daily practice / scholarly / long-tail), zh_chars, coverage_note, cbeta_note, canonical locators, lineage links, English translations list, % translated. For lineage: lineage trees graph from lineage_verification.json with exact locators (T51n2076 or chuandenglu_full lb-anchored), interactive tree. Then when all is gathered and different translations comparable or missing, add AI translations to fill 1,252 slots (177 verified quotations, 876 reconstructions, 199 AI drafts) — Robo fake by design now, but future AI translations verified.

## 2. Full Registry of All Teachers — What It Entails

**Current:** 35 masters in data/lineage/masters.json with alternative_names, lineage_depth, teacher, disciples, texts, key_quote_zh/en, cbeta_id, summary, profile_status Seed profile pending exact locator, linked_corpus_keys, profile_evidence

**Exhaustive 600-1400:** ~150-200 masters per ROADMAP_100PCT

- **Foundational Patriarchs (達摩至六祖):** Bodhidharma, Huike, Sengcan, Daoxin, Hongren, Huineng — 6 — all have profiles
- **Tang Masters (618-907):** Mazu Daoyi, Shitou Xiqian, Baizhang Huaihai, Huangbo Xiyun, Linji Yixuan, Zhaozhou Congshen, Dongshan Liangjie, Caoshan Benji, Yunmen Wenyan, Guishan Lingyou, Yangshan Huiji, Fayan Wenyi, Deshan Xuanjian, Xuefeng Yicun, Xuansha Shibei, Luohan Guichen, Nanquan Puyuan, Yaoshan Weiyan, Yunyan Tansheng, Changsha Jingcen, etc. — ~50
- **Five Houses Founders:** Linji Yixuan (Linji/Rinzai), Dongshan Liangjie + Caoshan Benji (Caodong/Soto), Yunmen Wenyan (Yunmen/Ummon), Guishan Lingyou + Yangshan Huiji (Guiyang/Igyo), Fayan Wenyi (Fayan/Hogen) — 7 — now all have at least seed
- **Song Masters (960-1279):** Yuanwu Keqin, Wumen Huikai, Hongzhi Zhengjue 1091-1157 (Caodong, Soto, Book of Serenity verse author, Hongzhi Guanglu), Dahui Zonggao 1089-1163 (Linji, letters, Zhengfayan Cang 680 cases), Wansong Xingxiu 1166-1246 (Congrong Lu compiler), Xuedou Chongxian 980-1052 (Biyan Lu verse), Foyan Qingyuan, Xutang Zhiyu 1185-1269, etc. — ~50
- **Yangqi Branch:** Yangqi Fanghui (founder), Baiyun Shouduan, Wuzu Fayan, Yuanwu Keqin, Dahui Zonggao — Linji Yangqi line
- **Huanglong Branch:** Huanglong Huinan 1002-1069 — Linji Huanglong line
- **Denglu Compilers:** Daoyuan (Jingde Chuandeng Lu 1004), Puhui (Wudeng Huiyuan 1252), etc. — ~10
- **Indian Patriarchs:** Prajnatara — frontier unlinked
- **Missing for exhaustive:** Hongzhi Zhengjue, Dahui Zonggao, Wansong Xingxiu, Xuedou Chongxian, Yangqi Fanghui, Huanglong Huinan, etc.

**For each teacher, teacher card needs:**

- id (canonical lineage ID, e.g., zhaozhou_congshen)
- name_zh (趙州從諗)
- name_pinyin (Zhàozhōu Cóngshěn)
- name_en_popular (Zhaozhou) — popular/in-use name registered
- name_en_formal (Zhaozhou Congshen)
- name_ja (Jōshū Jūshin), name_ko, name_vi, etc.
- aliases array (Wade-Giles Chao-chou Ts'ung-shen, Joshu, Zhaozhou Zhenji, 趙州真際, 從諗, etc.) — popular or in-use names registered and aliases noted
- dates (778-897)
- era (Tang Dynasty)
- school (Five Houses: Linji, Caodong, Yunmen, Guiyang, Fayan) + school_key
- lineage_depth, teacher, disciples
- location (Zhaozhou, Hebei)
- key_quote_zh/en
- cbeta_id (T2076 etc.)
- summary
- texts (works attributed)
- works cross-ref (list of work IDs)
- popular_work_names (The Recorded Sayings of Zen Master Joshu)
- profile_status (Seed profile pending exact locator → exact_locator_verified after P3)
- linked_corpus_keys (corpus file IDs linked, e.g., [zhaozhou_yulu, zhaozhou_yulu_full])
- profile_evidence (status, note, exact locator)
- **NEW:** english_translations (list of english_reference IDs for this master)
- **NEW:** chinese_origin_texts (list of corpus file IDs + CBETA IDs + exact locators)
- **NEW:** percent_published_books (e.g., 30% of works published in English books)
- **NEW:** percent_not_translated (e.g., 70% not translated yet)
- **NEW:** wiki_page_url (BookStack URL for teacher card)

**Implementation:** Extend data/lineage/masters.json with popular_name, english_translations, chinese_origin_texts, percent fields, wiki_page_url. Create data/masters/ one JSON per master for wiki.

## 3. Register and Reference All Translated Work in English

**Current:** 0% English by design (Robo fake, 1,252 slots 177 verified quotations, 876 reconstructions, 199 AI drafts, 21 translator profiles, 21 matrix registers). English front roadmap draft (Task 049) — agent must scope himself via web_search what full Chan roadmap entails.

**Exhaustive English front — what Terebess, Zen Mountain Monastery, Shambhala, BDK, etc. have that we don't have:**

- Terebess textindex.html ~500+ English translations indexed — Guzunsu Yulu (1267), Chanlin Sengbao Zhuan, Linjian Lu, Chanyuan Qinggui Yifa, Xutang Yulu, Lidai Fabao Ji, Baolin Zhuan, Zongmen Tongyao Ji, Chuanfa Zhengzong Ji, short texts Song of Enlightenment multiple translations, etc.
- Zen Mountain Monastery teachings — Wumen Guan translations, Biyan Lu excerpts, Dogen translations
- Shambhala catalogue — Blue Cliff Record Cleary 2005 ISBN 978-1590302323 688p, Book of Serenity Cleary 2005 ISBN 978-1590302491 512p, etc.
- BDK America — Blue Cliff Record BDK 2006 ISBN 978-0962561887 454p, Platform Sutra McRae 2000 ISBN 978-1886439990, etc.
- Columbia University Press — Platform Sutra Yampolsky 1967 ISBN 978-0231085466
- University of Hawaii Press — Record of Tung-shan Powell 1986 ISBN 978-0824809266, Record of Linji Kirchner 2009 ISBN 978-0824833190
- etc.

**For each English book, need:**

- id (e.g., blue_cliff_record_cleary_2005)
- title_en (The Blue Cliff Record)
- title_zh (碧巖錄)
- author_zh (圓悟克勤)
- translator_en (Thomas Cleary & J.C. Cleary)
- publisher (Shambhala)
- year (2005)
- isbn_10, isbn_13 (978-1590302323)
- pages (688)
- original_cbeta_id (T2003)
- tier (enthusiast / scholarly)
- rights_status (public_domain / in_copyright / needs_review)
- url (https://www.shambhala.com/the-blue-cliff-record-250.html)
- notes (100 cases with Yuanwu commentary + Xuedou verses, Foreword by Taizan Maezumi)
- **NEW:** master_ids (list of master IDs this book covers)
- **NEW:** work_ids (list of work IDs this book translates)
- **NEW:** percent_of_work_translated (e.g., 100% of Biyan Lu 100 cases, or 15/100 dialogues of Zhaozhou)
- **NEW:** comparison_notes (how this translation compares to others — e.g., Cleary vs Hinton lyric vs BDK)
- **NEW:** wiki_page_url (BookStack URL for book page)

**Implementation:** Build data/english_references.json with at least 50-100+ entries from search, honest ISBN verified or needs lookup, with citations [id](url). Create data/english_references/ one JSON per English book.

## 4. Source Chinese Origin Texts — % Published in Books vs Not Translated Yet

**Current:** 44 docs after enthusiast 100% closer (38→44), 10 collated_to_claimed_witness (zhengdao_ge, congronglu 100/100 EXACT, chuandenglu_full 1,274 units 2,549/2,549 EXACT, caoshan_benji 84 units 169/169 EXACT, plus 6 full-witness records Huangbo 19, Mazu 35, Yunmen 776, Dongshan 322, Zhaozhou 80, Dahui 30 juan + huku 1,354 — 2,586 units 302,592 CJK, 5,178/5,178 EXACT 0 flagged, collation 93.8%, locators 4,192, bundle 8.7M deterministic, 630 flagged authoritative preserved)

**Exhaustive Chinese origin texts 600-1400:** ~150-200 titles, 5-10M CJK per ROADMAP_100PCT

- **Gongan Collections:** Wumen Guan 48 cases, Biyan Lu 100 cases, Congrong Lu 100 cases, Zhengfayan Cang 680 cases (Dahui) — 4 major — 3/4 done (Wumen 48/48 but 113/181 collating, Biyan 100/100 but 353/395, Congrong 100/100 EXACT done)
- **Denglu (Transmission Records):** Jingde Chuandeng Lu 30 fascicles ~1,701 persons (1,274 units full done), Tiansheng Guangdeng Lu X1556, Zongmen Liandeng Huiyao X1557, Jiatai Pudeng Lu X1559, Wudeng Huiyuan X1565 full (3 sections), etc. — ~10 major — 1/10 full done
- **Yulu (Recorded Sayings):** Linji Yulu T1985 74 sections, Mazu Yulu X1321 full 35 units done, Zhaozhou Yulu X68n1315 full 80 units done, Dongshan Yulu T1986 full 322 units done, Yunmen Yulu T1988 full 776 units done, Baizhang Guanglu X1323/X1315 0/6, Huangbo Chuanxin Fayao T2012A full 19 units done + Wanling Lu T2012B 0/7, Dazhu Huihai X1223/X1224 0/6, Nanquan Yulu X1315 0/6, Deshan Yulu, Fayan Yulu, Guiyang Yulu, Xuansha Yulu, Xuefeng Yulu, Yuanwu Letters, Caoshan Benji Yulu 84 units done, Dahui Yulu full 30 juan + huku 1,354 done, etc. — ~100+ minor yulu — ~10/100 full done after enthusiast
- **Monastic Codes:** Chanyuan Qinggui 1103 T2025/X1245, Baizhang Qinggui, etc. — ~5 — 1 seed
- **Treatises:** Xinxin Ming T2010 37/37 but 24/37 collating, Zhengdao Ge T2014 6/6 collated, Sandokai, Baojing Sanmei T1986, Five Ranks, Erru Sixing Lun T2009, etc. — ~20 — ~2/20 collated
- **Histories:** Lidai Fabao Ji T2075/P.2125 0/3 collated, Baolin Zhuan, etc. — ~10 — 0/10

**For each work, need % published vs not translated:**

- **Chinese origin text sourced:** CBETA pin dbdea410, extraction rule cbeta-p5-body-cjk-v1, 41 refs verified / 0 drift after Caoshan, now 44 docs, deterministic producer only input pinned witness, contiguous-CJK assertions, lb-anchored locators, 100% EXACT 0 flagged for new docs
- **English translations referenced:** list of english_reference IDs that translate this work
- **% published in books:** e.g., Biyan Lu 100% published (3 English translations: Cleary 2005, BDK 2006, Hinton 2024), Zhaozhou Yulu 15/80 dialogues published (Green 1998 240p), Mazu Yulu 0% full English translation (no complete exists), etc.
- **% not translated yet:** e.g., Wudeng Huiyuan full 0% English (only 3 sections), Lidai Fabao Ji 0% full English (only fragments), etc.
- **Implementation:** Extend data/corpus_manifest.json with english_translations, percent_published, percent_not_translated, wiki_page_url

## 5. Wiki Pages — Books, Teacher Cards, Lineage Trees — BookStack Structure

**BookStack on VPS — Exhaustive wiki project hosted:**

BookStack is open-source wiki (https://www.bookstackapp.com/) — shelves, books, chapters, pages — self-hosted on VPS, with search, permissions, WYSIWYG, Markdown, attachments, etc.

**Proposed BookStack structure for Chan 600-1400:**

- **Shelves:**
  - **Teachers** — all Chinese masters 600-1400 — one book per school or era, or one shelf per Five Houses
    - **Books:** Foundational Patriarchs, Tang Masters, Five Houses Founders, Song Masters, Yangqi Branch, Huanglong Branch, etc.
      - **Chapters:** One chapter per master (e.g., Zhaozhou Congshen)
        - **Pages:** Teacher card with popular/in-use names + aliases, dates, lineage, disciples, works, Chinese origin texts sourced, English translations referenced, % published vs not translated, key quote zh/en, summary, profile_evidence, wiki_page_url, lineage tree snippet
  - **Works** — all works 600-1400 — tiered by enthusiast/scholarly/long-tail
    - **Books:** Gongan Collections, Denglu, Yulu, Monastic Codes, Treatises, Histories
      - **Chapters:** One chapter per work (e.g., Zhaozhou Yulu)
        - **Pages:** Book page with title_zh, title_en_popular, title_en_scholarly, author_master_id, cbeta_id, taisho_vol, genre, tier, zh_chars, coverage_note, cbeta_note, canonical locators, lineage links, English translations list, % translated, comparison notes, wiki_page_url
  - **English References** — all English books 600-1400
    - **Books:** By translator (Thomas Cleary, Burton Watson, Red Pine, etc.) or by original work (Blue Cliff Record translations, Platform Sutra translations, etc.)
      - **Chapters:** One chapter per English book
        - **Pages:** English book page with title_en, title_zh, author_zh, translator_en, publisher, year, isbn_10, isbn_13, pages, original_cbeta_id, tier, rights_status, url, notes, master_ids, work_ids, percent_of_work_translated, comparison_notes, wiki_page_url
  - **Lineage Trees** — interactive lineage trees
    - **Books:** Five Houses Lineage, Hongzhou School, Caodong/Soto Lineage, Linji/Rinzai Lineage, etc.
      - **Chapters:** One chapter per lineage tree
        - **Pages:** Lineage tree graph from lineage_verification.json with exact locators (T51n2076 or chuandenglu_full lb-anchored), interactive D3.js or similar, with teacher cards linked
  - **Roadmaps** — ideal vision roadmaps
    - **Books:** ROADMAP_100PCT_600-1400, ROADMAP_ALL_ENCOMPASSING, BOOKSTACK_WIKI_VISION, MASTER_REFERENCE, etc.

**Wiki page features:**

- **Teacher cards:** Photo (if available, e.g., statues), name_zh, name_en_popular, name_en_formal, aliases, dates, era, school, lineage_depth, teacher, disciples, location, key_quote_zh/en, cbeta_id, summary, texts, works, popular_work_names, profile_status, linked_corpus_keys, profile_evidence, english_translations, chinese_origin_texts, percent_published_books, percent_not_translated, wiki_page_url, lineage tree snippet, related works, related masters
- **Book pages:** Title_zh, title_en_popular, title_en_scholarly, author_master_id, cbeta_id, taisho_vol, era, genre, tier, zh_chars, coverage_note, cbeta_note, sections, dialogues, stanzas, cases, canonical locators, lineage links, English translations list, % translated, comparison notes, wiki_page_url, related masters, related works
- **English reference pages:** Title_en, title_zh, author_zh, translator_en, publisher, year, isbn_10, isbn_13, pages, original_cbeta_id, tier, rights_status, url, notes, master_ids, work_ids, percent_of_work_translated, comparison_notes, wiki_page_url, related works, related masters
- **Lineage trees:** Interactive tree from lineage_verification.json with exact locators, teacher cards linked, works linked, English translations linked, % published vs not translated per edge

**Implementation:** BookStack instance on VPS (e.g., Hetzner, DigitalOcean) — install via Docker or manual, with MySQL, PHP, Nginx, Let's Encrypt SSL, backups, etc. Import data from data/lineage/masters.json, data/corpus_manifest.json, data/english_references.json via BookStack API or manual pages. Use BookStack's search, tags, shelves.

## 6. % Published in Books vs Not Translated Yet — How to Calculate

**For each teacher:**

- **Total works attributed to teacher** (from data/lineage/masters.json texts + data/corpus_manifest.json author_master_id)
- **Works with at least one English translation** (from data/english_references.json master_ids)
- **% published = (works with English translation / total works) * 100**
- **% not translated = 100 - % published**

Example: Zhaozhou Congshen — total works 1 (Zhaozhou Yulu X68n1315 80 units), English translations 1 (Green 1998 Recorded Sayings of Zen Master Joshu ISBN 978-1570628702 240p) — but Green only covers 15/80 dialogues? Actually Green 1998 is full? Need check — but if Green covers 80/80, then 100% published, 0% not translated. If Green covers 15/80, then 18.75% published, 81.25% not translated.

**For each work:**

- **Total sections/dialogues/cases** (e.g., Zhaozhou Yulu 80 units, Biyan Lu 100 cases, Wumen Guan 48 cases)
- **Sections/dialogues/cases with English translation** (from english_references work_ids + percent_of_work_translated)
- **% published = (translated sections / total sections) * 100**
- **% not translated = 100 - % published**

Example: Biyan Lu 100 cases — 3 English translations (Cleary 2005, BDK 2006, Hinton 2024) all cover 100/100 cases — 100% published, 0% not translated. Wudeng Huiyuan full — 0 English translations full, only 3 sections excerpt_seed — 0% published full, 100% not translated full.

**Overall:**

- **Total works 600-1400:** ~150-200 titles, 5-10M CJK
- **Works with English translation:** ~50-100 titles (Terebess 500+ entries but many are same work multiple translations, so distinct works maybe 50-100)
- **% published overall = (works with English translation / total works) * 100** — e.g., 50/150 = 33% published, 67% not translated
- **% not translated overall = 100 - % published**

**Implementation:** Extend data/project_metrics.json with percent_published, percent_not_translated per work and overall. Create report sessions/PERCENT_PUBLISHED_2026-09-21.md with calculations.

## 7. When All Is Gathered and Different Translations Comparable or Missing — Add AI Translations

**Current:** 1,252 translation slots (177 verified quotations, 876 unverified reconstructions, 199 AI drafts), 21 translator profiles, 21 matrix registers, 4 exemplar passages carrying 21 translator registers. English Robo explicitly fake and badged 🤖. Headline "The old texts are real; the translators are not." — Chinese real measured, English Robo fake by design.

**Future AI translations:**

- When full registry of teachers, all works tiered, all English books referenced, Chinese origin texts sourced, % published vs not translated calculated, wiki pages with teacher cards, book pages, lineage trees are gathered — then we have exhaustive database
- Then we can compare different translations for same work (e.g., Blue Cliff Record 3 translations: Cleary 2005, BDK 2006, Hinton 2024) — which is more accurate, which is more readable, which is more scholarly, etc. — comparison_notes in english_references.json
- For works with no English translation (e.g., Wudeng Huiyuan full, Lidai Fabao Ji full, Zongmen Liandeng Huiyao, etc. — ~67% not translated), we can add AI translations to fill 1,252 slots — but must be marked as AI draft, not verified, with source collation (Chinese origin text sourced via CBETA pin dbdea410, 100% EXACT 0 flagged) and with comparison to existing translations if any
- AI translations should be generated via deterministic producer only input pinned witness + existing English translations as reference, with run-time tiling assertions, and with human review queue per rights_manifest.json and profile_review_queue.json
- AI translations should be stored in data/translations/ with translator profile AI, with verification status AI draft, not verified, with source collation, with comparison_notes

**Implementation:** Extend data/translations/ with AI translations for missing works, with translator profile AI, verification status AI draft, source collation, comparison_notes. Create report sessions/AI_TRANSLATIONS_PLAN_2026-09-21.md with plan.

## 8. Exhaustive Wiki Project Hosted with BookStack on a VPS — Technical Vision

**BookStack on VPS — Technical stack:**

- **VPS:** Oracle Cloud Free Tier Ampere A1 Flex — 2 OCPU, 12GB RAM, 100GB boot volume — Ubuntu 24.04 LTS — domain nonduality.duckdns.org (http://nonduality.duckdns.org) — or larger for 44 docs 8.7M bundle + future 150-200 docs 5-10M CJK + English references 50-100+ books
- **OS:** Ubuntu 22.04 LTS
- **Web server:** Nginx with Let's Encrypt SSL (certbot)
- **Database:** MySQL 8.0 or MariaDB 10.6
- **PHP:** PHP 8.1 with extensions
- **BookStack:** Latest version via Docker or manual install — https://www.bookstackapp.com/docs/admin/installation/
- **Backups:** Daily MySQL dump + file backup to S3 or Oracle Object Storage or local backup
- **Monitoring:** Uptime Kuma, etc.
- **Domain:** nonduality.duckdns.org or similar — DNS A record to VPS IP
- **Search:** BookStack built-in search + Meilisearch or Elasticsearch for advanced
- **API:** BookStack API for importing data from data/lineage/masters.json, data/corpus_manifest.json, data/english_references.json
- **Authentication:** BookStack built-in auth + LDAP or OAuth if needed
- **Permissions:** Public read, owner write, etc.
- **Theme:** Custom theme with Chan colors, light mental load minimum info expand/hover/toggle, English first, not dense, comfortable to read easy to navigate, piece meal plain language, info section for every work and teacher where from / related / background per COMMON_QUALITIES_2026-09-14.md
- **Zero-backend reader vs wiki:** Current zero-backend reader (5 rooms exactly, CSP without unsafe-inline, render-lazy, 0 style=, 4 CSSOM writes) is met on surface, unmet on evidence (no real-browser evidence) — Pages deployment now out of scope per RULING_WEBSITE_2026-09-14.md — BookStack wiki is separate, exhaustive, not replacing zero-backend reader, but complementary — wiki for reference, zero-backend reader for reading

**BookStack import plan:**

1. Install BookStack on VPS via Docker Compose (bookstack, mysql, etc.)
2. Create shelves: Teachers, Works, English References, Lineage Trees, Roadmaps
3. Create books: Foundational Patriarchs, Tang Masters, Five Houses Founders, etc. for Teachers shelf; Gongan Collections, Denglu, Yulu, etc. for Works shelf; By Translator, By Original Work for English References shelf; Five Houses Lineage, etc. for Lineage Trees shelf; ROADMAP_100PCT, ROADMAP_ALL_ENCOMPASSING, BOOKSTACK_WIKI_VISION, MASTER_REFERENCE for Roadmaps shelf
4. Create chapters: One chapter per master, per work, per English book, per lineage tree
5. Create pages: Teacher cards, book pages, English reference pages, lineage tree pages with data from JSON files via BookStack API (POST /api/books, /api/chapters, /api/pages)
6. Add attachments: CBETA XML snippets, etc.
7. Add tags: master IDs, work IDs, school, era, tier, etc.
8. Configure search, permissions, theme

**Cost estimate:**

- Domain $10-15/year if custom, but DuckDNS free — Oracle Free Tier VPS free
- Domain $10-15/year
- Object Storage backups $0-1/month (Oracle free tier)
- Total ~$0-5/month for exhaustive wiki on Oracle Free Tier + DuckDNS

**Next steps for BookStack wiki vision:**

1. Land all-encompassing roadmap ideal vision onto main (Task 049) — agent scopes himself via search for teachers, books, translators, works, etc.
2. Land enthusiast 100% closer (Task 050) — 6 full-witness records done, merged ddce5c3
3. Land P2 core yulu authenticity labels + re-key attempt (Tasks 047/048) — done, merged 71b8772
4. Land P3 lineage exact locators batch1+batch2 (Tasks 051/052) — dispatched, in flight
5. Land P6 CBETA full inventory defining 100% denominator
6. Land P4 rights work order list
7. Build data/english_references.json draft with 50-100+ English books from search (Task 049)
8. Build data/aliases.json draft with 20+ popular→canonical entries (Task 049)
9. Install BookStack on VPS via Docker Compose
10. Import data via BookStack API
11. Configure theme, search, permissions, domain, SSL, backups
12. When all gathered and different translations comparable or missing, add AI translations to fill 1,252 slots

## 9. Verification — Current Measured State

- Corpus: 44 docs, 0 complete, 31 excerpt_seed, 7 partial_selected_witness? Actually after enthusiast 100% closer, we have 10 collated_to_claimed_witness (zhengdao_ge, congronglu, chuandenglu_full, caoshan_benji, plus 6 full-witness records Huangbo 19, Mazu 35, Yunmen 776, Dongshan 322, Zhaozhou 80, Dahui 30 juan + huku 1,354) — so 10 collated, 32 partial_or_failed, 2 witness_unavailable? Need check via validate_data.py
- CJK volume: 553k content CJK / 583k all-string at 38 docs, now after enthusiast 100% closer 44 docs, content CJK 553k+302k=855k? Actually project_metrics.json at 44 docs should show content_cjk_characters ~855k? Need check
- Slots: 1252 translation slots (177 verified quotations, 876 unverified reconstructions, 199 AI drafts), 21 translator profiles, 21 matrix registers, 4,192 locators (1,606→4,192 after enthusiast), 630 flagged authoritative stays, 0 unauthorized 373 permitted + 9 new docs, 145 checks, bundle 8.7M deterministic byte-identical
- Lineage: 35 masters, 31 edges, 30 edges traditional_link_pending_exact_locator, 29 masters needs_exact_locator, 3 unlinked frontier prajnatara/yangqi_fanghui/dahong_zuzheng + longtan_chongxin frontier — P3 batch1+batch2 dispatched to provide exact locators
- Gates: validate_data.py PASS corpus44 locators4192 collated10 flagged630, build_data_bundle.py 44 docs 8.7M deterministic byte-identical, test_source_preservation.py 0 unauthorized, test_source_review_rules.py 145 PASS, smoke_test.mjs 44 texts

## 10. Conclusion — Ideal Vision, Doesn't Have to Be Followed Yet

This document is the ideal vision for an exhaustive wiki + database + reference manifest for Chan 600-1400 hosted with BookStack on a VPS — assuming full registry of all teachers, we could register and reference all their translated work in English, source their Chinese origin texts, give % of what is published in books and what hasn't been translated yet, put all information on wiki pages (books, teacher cards, lineage trees), then when all is gathered and different translations comparable or missing we could add AI translations — an exhaustive wiki project.

It doesn't have to be followed yet, it's an ideal vision — but it scopes out what "full chan roadmap" actually entails and what we would need if we wanted to build an all-exhaustive wiki + database + reference manifest in the future. Everything to be aware of.

Next: Land Task 049 all-encompassing roadmap ideal vision (agent scopes himself via search) + Task 050 enthusiast 100% closer (6 full-witness records done) + Task 051/052 P3 lineage exact locators batch1+batch2 (dispatched) + P6 CBETA full inventory + P4 rights work order list + install BookStack on VPS + import data via API + add AI translations.

