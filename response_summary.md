# 🪷 TranslateChan: Update & Milestone Report

> Latest session: **2026-08-08 — Full Project Audit** (branch `arena/019fe108-translatechan`)

### Summary of This Session:
1. **Full audit completed** → [`AUDIT.md`](./AUDIT.md).
2. **🔴 P0 found & FIXED**: `app.js` fatal syntax error + 6 runtime crashes repaired and verified ([`AUDIT.md` §8](./AUDIT.md)); new dependency-free regression tool `scripts/smoke_test.mjs`.
3. **🟠 Docs-truth pass DONE**: README/ROADMAP/HANDOFF now state measured reality (31 terms, 11/48 cases, 4 matrix entries, excerpt-scale corpus); missing `LICENSE` created (MIT code + CC BY-SA data + third-party rights notice); phantom `align_translations.py`/`deploy.yml` refs removed; stale branch/merge instructions rewritten; `.nojekyll` added; `vision.md` marked aspirational. Logged in [`AUDIT.md` §8](./AUDIT.md).
4. **Data measured**: 36 excerpt-scale files (≈9,610 zh chars; Wumenguan 11/48), glossary 31, lineage 18, matrix 4 — anchors verified authentic.
5. **⚖️ Attribution-integrity pass DONE**: provenance policy `data/translations/provenance.json` (v1.1) bundled into the app; every translation column now badges `⚠️ Register reconstruction` / `AI draft` / `✅ Verified quotation`; matrix-view disclaimer; mis-cited canon IDs fixed (hanshan "T2834"→SBCK/Zoku — T2834 is actually 大乘無生方便門; deshan/shitou wrong "T1985"→correct embedded refs).
6. **🟠 P1/P2 frontend hardening DONE**: search now indexes all 36 texts across every schema (counts + highlighting + jump buttons), reader modes truly differentiated (true Classical-Only mode), tooltips single-pass & valid HTML, Studio reads from the data bundle — regression checks added to `scripts/smoke_test.mjs` ([`AUDIT.md` §8](./AUDIT.md)).
7. **🔍 Verification pilot DONE**: Wumenguan Case 1 gained its first `✅ Verified quotation` registers — **Senzaki & Reps (1934, public domain)** and **Shimomissé** — verified verbatim against surviving texts with full source records in the app; Blyth verification pending print (fetch failed); provenance.json v1.2 ([`AUDIT.md` §8](./AUDIT.md)).
8. **Verified healthy**: deterministic bundle, `/docs` sync, smoke test green, Pages `status: built` (still serving pre-fix `main` until hotfix PR merges).
8. **🔍 Verification round 2 DONE**: +✅ Clarke (Xinxin Ming st. 1–2, verbatim via 2 mirrors), +✅ Yampolsky (Shenxiu p.130 — replaced a proven paraphrase; Huineng **Dunhuang recension** added as its own verse), corrected first inauthentic zh found (xinxin_ming st. 3 → T2010 canon). Blyth/Suzuki pending print.
8b. **🔍 Verification round 3 DONE**: +✅ Sekida, +✅ Sasaki (paraphrase replaced), +✅ Blofeld (publisher-verified, paraphrase replaced); unattributed verse/commentary blocks now labeled; Blyth retry pending.
8c. **🔍 Verification round 4 DONE**: Blyth Case 1 ✅ (via Morse illustrated reproduction; paraphrase replaced) — Case 1 now has 5 verified editions; Sasaki 乾屎橛 line completes the fully-verified Linji sermon; Suzuki Platform verse attribution found genuinely unresolvable (kept honest).
9. **Still open**: Phase 2 content (Wumenguan 48 — all substrates in hand), then the PR to `main`.

---
<details><summary>Previous session (pre-audit history)</summary>

### Summary of Completed Work:
1. **Zen Minimalist, Serene & Responsive Theme**: rice-paper/tea contemplative reading interface (`app.css`, `index.html`), Noto Serif SC typography, responsive layout, `A+`/`A-` font adjusters.
2. **GitHub Pages Deployment Preparedness**: `/docs/` bundle synchronization via `scripts/build_data_bundle.py`.
3. **Repository Cleanliness & GitHub Push**: committed and pushed to `origin arena/019fe05c-translatechan`; local static execution verified on port 8080.

</details>
