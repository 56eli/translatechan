# Robo Registers — methodology + Wumenguan Case 1 (Mu) pilot · for review

> **Methodology update (per owner direction).** Robo personalities are now built
> on **REAL translation evidence**, not general characteristics — see
> [`data/translations/translator_profiles.json`](../data/translations/translator_profiles.json)
> (21 profiles). Two tiers: **13 `in_corpus_verified`** (features extracted from
> the translator's own verified slots in this corpus) and **7
> `documented_external`** (honestly flagged evidence-pending — no in-corpus
> verified sample yet). Cast renames: **Robo D.T. Suzuki → Robozuki**, **Robo
> Blofeld → Roblofeld**.
>
> Committed across `2d1b6dc` (Case 1 voices) → `0292e2b` (profiles + renames);
> live in the preview.

## Source (canonical, unchanged)
> 趙州和尚因僧問：「狗子還有佛性也無？」  → 州云：「無。」

## The 6 Robo channelings in Case 1 (evidence tier in brackets)

| Robo | Evidence tier | The question | "Mu" |
|---|---|---|---|
| **Robo Red Pine** | documented_external ⏳ | A monk asked Zhaozhou, 'Does a dog have Buddha-nature or not?' | Zhaozhou said, 'No.' |
| **Robo T-Cleary** | documented_external ⏳ | A monk asked Master Zhaozhou, 'Does a dog have the Buddha-nature?' | Zhaozhou said, 'No.' |
| **Robo Ruth** (Sasaki) | ✅ in_corpus_verified | A monk asked the Master Jōshū, 'Does even a dog have the Buddha-nature or not?' | Jōshū said, 'Mu!' |
| **Robozuki** (Suzuki) | documented_external ⏳ | A monk asked the Master Chao-chou, 'Has a dog the Buddha-nature, or has it not?' | To which the Master replied, 'Mu.' |
| **Roblofeld** (Blofeld) | ✅ in_corpus_verified | A monk enquired of the Master Chao-chou, saying, 'Has a dog the Buddha-nature, or has it not?' | The Master made answer, 'None!' |
| **Robo-Literal** | not_applicable (control) | Zhaozhou-monk, because [a] monk asked: 'Dog, also have Buddha-nature, or not?' | Zhou said: 'Wú [not-have].' |

✅ = Robo voice grounded in that translator's verified samples in this corpus.
⏳ = no in-corpus verified sample yet; profile is documented-external / evidence-pending.

## The 6 verified rows (real public-domain text — untouched)
Blyth · Senzaki & Reps (1934) · Shimomissé · Sekida · Yamada · Aitken — all badged ✅ Real text (verified).

## Open methodological decision (owner)
The 3 highest-volume Robos — **Red Pine (204 slots), Cleary (221), Robozuki (41)** — are `documented_external` because the corpus has **no verified sample** for them. To make them evidence-backed, the honest path is to add a verified public-domain (or properly-cited) sample per translator and promote their profiles. Options:
1. Keep them as documented-external Robos (current) — clearly badged and disclosed.
2. Acquire one verified sample each (rights-checked) and promote to in_corpus_verified.
3. Dial them back / re-badge as "documented-style" until evidence lands.

Tell me which, and whether to wire the profiles into the UI (a "why this Robo reads this way" popover citing the evidence) and/or roll the in_corpus_verified voices out across Wumenguan.
