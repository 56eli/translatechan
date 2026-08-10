# 🏯 Fake Chan Factory — Website Vision (Final — Chinese Chan Hall, Minimal)

> **Purpose:** Make the GitHub Pages site *want-to-stay* appealing, so every function has a home. Written after full audit 2026-08-10, updated after owner feedback (Chinese Chan focus, minimal, no gimmicks).  
> **Status:** Final direction — Chinese Chan hall, dark walnut, literature-first, Robo joke as practical joke once.  
> **Related:** `vision.md` = scholarly/architectural blueprint. This doc = public-facing experience blueprint.  
> **Feedback incorporated:** Audience = me and friends introduced to niche Chan content mixed with my humor. First 30s = Chan hall/literature/Zen feeling with robo joke theme. After that = all serious literature composition, readability, transparent flow, no choppiness, no overflow, no distraction, no gimmicks, sophisticated but minimal. Lean into wood dark walnut, drop vermillion keep ✓, humor disappears except Robo names. No Japanese aesthetics — Chinese temple wood + Chinese calligraphy. No footer, no conveyor, no CTA (deferred per feedback).

---

## 0. One-line premise (final)

**Fake Chan Factory should feel like entering a Chinese Chan hall in dark walnut — first 30 seconds you get the practical joke (Robo monks at work), then it's all serious, sophisticated minimal reading with transparent flow, no choppiness, no gimmicks; humor lives only in the Robo names.**

Previous draft said Kyoto workshop + factory conveyor — replaced per feedback: Chinese Chan, not Japanese dojo/tatami/torii.

---

## 1. Audience & first 30 seconds (final)

**Audience:** You and friends you introduce into niche Chan content mixed with your humor. Not generic Zen-curious dev — personal, friends-first, literature with honesty.

**First 30 seconds:**
1. **Chan hall gate (2s):** 假禪工廠 in big Kai 900 dark walnut (#1f1a18 / #2c2523), FAKE CHAN FACTORY small caps tracked, 🤖 as practical joke monk once.
2. **Literature snap (5s):** 36 canonical works from CBETA, real Classical Chinese sources, Robo renderings marked 🤖 Robo, verified marked ✅ — honest scale.
3. **Invitation (10-30s):** Directly below hero, first case (Wumenguan) appears big, generous, zh + pinyin + 2 Robo side-by-side, tappable glossary — no extra CTA buttons needed (deferred per feedback). You are already in reading hall.

**What we removed vs draft:** No conveyor belt animation (you said defer, no gimmicks), no CTA buttons "Open Wumenguan" / "See Blueprint" (you said you don't know what hero CTA means, defer), no factory press floor metaphor that felt Japanese/industrial. Now hall gate + reading hall immediately.

Today first paint after V1 implementation: hero 1.25rem padding, 4px walnut bottom beam, dark walnut lean, short, dismissable, counts accessible. Feels calm, not work.

---

## 2. Brand pillars (final — wood lean)

### 2.1 Four materials — final palette

- **Dark walnut wood** `#2c2523` for header border, text-primary, bottom beam, ink. Lean into this — Chinese temple hall timber, not light rice paper only. Header already `bg-secondary #f4efe6` with `border-bottom 1px #e6decb`, plus hero `border-bottom 4px #2c2523` gives timber beam.
- **Rice paper** `--bg-primary #faf8f5`, `--bg-card #ffffff`, `--bg-card-subtle #fcfbfa` — layered paper, shadow = print lifted off table. Keep.
- **Ink** `#1f1a18` for zh reading, not pure black — contemplative.
- **Gold accent** `#9e7232` for interactive (hover, focus, case-num-title) — not vermillion. You said drop vermillion, keep checkmark ✓ for verified. So verified badge stays green `#3d6e58`, not red. Lineage verified also green. Seal red removed from vision.

### 2.2 Typography — calm to confident, Chinese

- **Display zh:** `clamp(1.9rem,4vw,2.4rem)` Noto Serif SC 900, 0.06em tracking — hall sign.
- **Small caps EN:** 0.78rem 700 0.18em uppercase secondary — not shouting.
- **Zen quote:** Kai 1.2rem 700 primary, not gold — serious after joke.
- **Reading zh:** `--zh-font-size 1.35rem` Kai + Serif SC, line-height 2.0 — keep, proven readable.
- **En translation:** 0.95rem secondary — not competing with zh.
- **Mono:** `ui-monospace` for counts 48/48, 37/37 — engineering meets woodblock.

### 2.3 Motion — ink, not bounce, minimal

- Keep `cubic-bezier(0.16,1,0.3,1)` existing.
- **No conveyor stagger** — you said no gimmicks, deferred. Only micro-motions that aid reading: none. Maybe seal stamp on verified hover (`scale 0.9→1`) but even that could be gimmick — defer unless needed. Respect `prefers-reduced-motion` already `animation:none`.

### 2.4 Voice — humor only in Robo names

- **Hero only:** "「平常心是道。」— Robo monks at work, practical joke." — joke lives here once.
- **After hero:** serious literature — no "robots searched shelves twice" microcopy, no "pull prints off line". Keep empty states plain: "No canonical works match xyz." Previous vision had playful empty states — removed per your "humor disappears from serious reading except Robo Translator mention".
- **Robo names stay:** `Robo Red Pine`, `Robo T-Cleary`, `Robozuki`, `Roblofeld` — practical joke continues only in matrix/reader translator tags + hover real-fakeness score. Provenance badges stay cold factual.

---

## 3. Site map — same 5 tabs, Chan hall framing (approved)

You approved agree_sitemap — reframing as Chan hall rooms, not factory press.

- **Reader = Chan Hall / 閱藏堂** — where you read side-by-side (primary)
- **Matrix = Comparative Study / 對勘** — compare Robo vs verified proofs
- **Lineage = Transmission Hall / 傳法堂** — Bodhidharma → Five Houses
- **Gong'an = Koan Shelf / 公案架** — 24 cases by theme group
- **Lexicon = Glossary Grove / 詞林** — 31 terms

We keep tab labels English (Bilingual Reader, Comparative Matrix, Lineage Tree, Gong'an Index, Chan Lexicon) for public scope smoke-guarded, but add Chinese sublabels / 閱藏堂 etc in view headers muted. No Japanese: not Zendo, not Dojo.

---

## 4. Concrete redesign slices — final, no gimmicks

### 4.1 Hero — Chan hall gate (S) ✅ SHIPPED commit b0aeb4d

**Implementation this pass:**
- HTML: `.hero-brand-row` with `.hero-zh` 假禪工廠 + `.hero-en` FAKE CHAN FACTORY + `.hero-icon` 🤖 (practical joke once). Quote main `「平常心是道。」— Robo monks at work, practical joke.` Sub: CBETA real sources, Robo marked 🤖, verified ✅, serious after joke.
- CSS: `border-bottom: 4px solid var(--text-primary)` walnut beam, padding 1.25rem 1.5rem, flex space-between, shadow-sm. New classes `.hero-main`, `.hero-brand-row`, `.hero-zh`, `.hero-en`, `.hero-icon`, `.hero-meta`.
- A11y: meta chips no longer `aria-hidden=true`; emoji inside inner `<span aria-hidden="true">` so counts accessible + smoke decorative emoji check passes.
- Removed: conveyor belt CSS animation (deferred), CTA buttons (deferred per feedback you didn't know what hero CTA means), giant 禪 watermark (already removed L1).

### 4.2 Reader — scroll, no choppiness (S) — NEXT

**Today:** sidebar 260px list + content panel + sticky toolbar (z 50 now > strip 40 after fix) + case chips sticky 4.4rem + collapsible cards.

**Vision final, no gimmicks:**
- Sidebar grouping: Complete Scrolls (4: wumenguan 48/48, biyanlu 100/100, xinxin_ming 37/37, platform_sutra 10/10) with gold left stripe sticky top, Excerpt Seeds (32) muted below. Already have ✓ / N/M marks, grouping makes hall shelf clear.
- Reader header breadcrumb `📚 Reader › T2005 Wumenguan` keep — helps orientation, no gimmick.
- Case card: keep `background var(--bg-card-subtle) border 1px border-color radius-md`, hover `border-color border-focus shadow-sm` — subtle lift okay, not gimmick. Remove dotted glossary underline? Keep `box-shadow inset 0 -0.35em rgba(158,114,50,0.18)` brushed highlight is minimal, not gimmick — evaluate.
- Mobile bottom bar already fixed 44px min + env(safe-area-inset-bottom) in this pass.

### 4.3 Matrix — proof sheet minimal (S)

Keep cards, no ruler line gimmick. Only ensure translation cols equal, status badge checkmark for verified (you approved keep checkmark, drop vermillion). Already: verified green, Robo blue.

### 4.4 Lineage — transmission hall (M)

Current SVG vertically layered generations, pan/zoom, halo nodes, gold pending links. Vision final: no blueprint blue grid gimmick — keep rice paper card bg. Maybe lower bound width 720 → 360 for mobile overflow (P3 from full audit). Dossier panel already card system with gold left stripe — good, not gimmick.

### 4.5 Gong'an & Lexicon — shelves

Filter chips grouped by theme_group (7 groups) — keep, not gimmick. Cards minimal.

### 4.6 Footer — REMOVED per feedback

You said remove footer, haven't seen conveyor, defer CTA. Footer element `<footer>` removed from `index.html` + CSS block stripped from `app.css`. Site now ends after content + mobile bar — literature-first, minimal. Real sources note lives in hero sub + docs (not footer). If later you want minimal colophon, we can add 1-line fineprint at bottom of main, but for now removed.

### 4.7 OG image — 1200×630 (S) ✅ SHIPPED

Created `og-image.svg` 2.9KB: rice paper #faf8f5, walnut top/bottom beams 14px/12px, subtle noise circles 4% opacity, central 假禪工廠 128px 900 + seal square 禪 gold, EN small caps, tagline Kai italic practical joke + second line verified/Robo note, counts mono, bottom colophon mono + robot. Hosted at `/og-image.svg`, referenced via `og:image` + `twitter:image` `summary_large_image`. Build copies to `docs/og-image.svg` via `build_data_bundle.py` (added to copy list).

---

## 5. What NOT to do (final anti-goals — you approved)

- ✅ No framework, no backend, no external JS — static
- ✅ No heavy illustrations/photos — <10KB decorative SVGs only (og-image 2.9KB)
- ✅ No carousels, popups, onboarding tour — calm by default
- ✅ No gamification
- ✅ No removing provenance honesty — checkmark ✓ for verified stays, Robo badges stay
- ✅ No adding new tabs — 5 tabs scope smoke-guarded
- ✅ No changing content shapes — validator stays king
- ✅ **No Japanese aesthetics — lean Chinese temple wood, Chinese calligraphy, not zen-minimal Japanese (tatami, torii, etc)** — you approved yes yes yes
- ✅ **No humor in reading flow except Robo names** — hero joke once, then serious literature, sophisticated minimal
- ✅ **No footer** — removed per feedback
- ✅ **No conveyor animation** — deferred, no gimmicks
- ✅ **No hero CTA buttons** — deferred per feedback you didn't know what CTA means

---

## 6. Implementation plan — final order (V1 done)

### Phase V1 ✅ DONE commit b0aeb4d (2026-08-10)

1. OG desc channels→robolates, add og:image + twitter:image summary_large_image
2. Hero redesign Chinese Chan hall gate — dark walnut 4px bottom, big Kai, joke once, counts accessible, no conveyor, no CTA, shorter
3. Footer removal
4. Tier-1 a11y/perf: hero chips inner aria-hidden, ellipsis … standardized, mobile bar 44px + safe-area, toolbar z 20→50
5. Build: copy og-image.svg to docs/, validator relaxed hero chip check
6. Gates: validate_data ✅ corpus=36 verified=177 locators=183/183, build_data_bundle ✅ 1,676,108 B, smoke ✅ 36 texts 0 crashes

### Phase V2 Reader Polish (next, 1 session, no gimmicks) — optional

- Sidebar grouping Complete (4) vs Excerpt (32) sticky header for complete group
- Case card hover lift subtle (if not gimmick) + glossary brushed highlight evaluation
- Lineage graph width lower bound 720→360 (mobile overflow fix)
- Reader header seal ✓ checkmark for complete (small, not red seal)
- No conveyor, no CTA, no footer re-add unless you want minimal 1-line colophon

### Phase V3 Matrix + Lineage minimal (optional)

- Matrix card subtle ruler removal (keep minimal)
- Lineage container blueprint grid removal (keep rice paper, per no gimmick)
- Dossier stays card + gold left stripe — good

### Phase V4 Motion — deferred (you said no gimmicks)

- No seal stamp animation unless requested — respect minimal

---

## 7. Metrics for "more appealing" (final)

- Qualitative: screenshot shareability — hero with big 假禪工廠 + walnut beam wants screenshot? Yes, minimal Chinese hall.
- Quantitative: Time to first meaningful print <1.5s on 4G — deferred scripts + preload app_data.js helps.
- A11y: Lighthouse a11y ≥95 — hero chips accessible now, skip-link present, ARIA tabs roving, dossier dialog focus-managed.
- Bundle: raw 1,676,108 B + og-image.svg 2.9K, gz est ~400KB — keep <2MB.
- No regression: smoke 50+ checks green including new 4gg hero dismissable + 4ff/4gg/4hh/4ii/4jj/4kk L1 guard + 4ee dossier.

---

## 8. Open questions — resolved per feedback

- Footer GitHub link? You said remove footer entirely — resolved, footer removed, no GitHub link anywhere (header GitHub link already smoke-guarded forbidden).
- Vermillion seal for verified? You said drop vermillion keep checkmark ✓ — resolved, verified stays green check, no red.
- Conveyor animation? You said defer, haven't seen, no gimmicks — resolved, removed from vision, not implemented.
- Hero CTA? You said don't know what hero CTA means defer — resolved, CTA buttons removed from V1, no CTA.
- OG image SVG vs PNG? SVG 2.9K shipped, Twitter may rasterize loosely but works; PNG fallback could be added later if preview fails.

---

## 9. One-sentence vision (final — you approved: Good one-sentence vision)

**Fake Chan Factory should feel like a Chinese Chan hall in dark walnut — first 30 seconds Chan literature/Zen feeling with Robo monks as practical joke, then all serious literature composition, sophisticated minimal reading with transparent flow, no choppiness, no overflow, no distraction, no gimmicks, humor only in Robo Translator names.**

---

> Final vision rewritten 2026-08-10, session `arena/019feaf5-translatechan`, after owner feedback loop (dojo → Chinese Chan, wood lean dark walnut, no Japanese, no footer, no conveyor, no CTA, humor only Robo). Phase V1 hero shipped b0aeb4d, audit update 8bfbe81. No new functions added in V1, only appeal. Next: Reader V2 grouping if you want.
