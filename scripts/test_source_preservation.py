#!/usr/bin/env python3
"""Source-Chinese preservation test for the active corpus.

The W1 containment and correction work must not alter a single character of the
corpus source-Chinese fields. This test compares every `data/corpus/*.json` file
against an *explicit base commit* (pinned below — a commit, not a mutable fixture)
and reports the exact changed paths.

Rules
-----
* The base is `BASE_COMMIT`: the tree the W1 work started from (`origin/main`
  before the W1 containment PR). It is fetched on demand when the local clone
  does not contain the object (shallow CI checkouts); if it cannot be fetched the
  test fails instead of skipping.
* Every corpus difference must be an exact, pre-declared JSON pointer in
  `ALLOWED_CHANGES` for that file. Membership is the pointer, not the leaf key
  name: a `coverage_note` (or `zh`) anywhere else — for instance
  `cases[0].coverage_note` in any of the 48 Wumenguan cases — is a corpus edit
  and fails. The allowlist is remediation-aware:
  - `data/corpus/biyanlu_cases.json`: the same root `.coverage_note`, plus exactly
    the pointers the owner-adopted R-A/R-B remediation (Wave 1, document 2 —
    re-keying biyanlu to the CBETA T48n2003 witness per the 2026-09-10 W1
    correction register) touched: each re-keyed source field and its rewritten
    sibling pinyin, two additive `editorial_note` provenance labels, and the
    recomputed `zh_chars` total.
  - `data/corpus/linji_yulu.json`: the same root `.coverage_note`, plus exactly
    the pointers the owner-adopted R-A/R-B remediation (Wave 1, document 3 —
    re-keying linji_yulu's W1-flagged content fields to the CBETA T47n1985
    witness per the 2026-09-10 W1 correction register, under the owner's
    2026-09-11 per-field ruling for the 行錄 division) touched: one
    single-grapheme re-key and the four 行錄 re-keys — each re-keyed source
    field with its rewritten sibling pinyin where the rewrite was needed —
    three additive `editorial_note` R-B provenance labels (kept project-authored
    retellings, no witness attribution — their `zh`/`pinyin`/translations stay
    untouched), and the recomputed `zh_chars` total.
  - `data/corpus/xinxin_ming.json`: the same root `.coverage_note`, plus exactly
    the pointers the owner-adopted R-A/R-B remediation (Wave 1, document 4 —
    re-keying xinxin_ming's W1-flagged content fields to the CBETA T48n2010
    witness per the 2026-09-10 W1 correction register) touched: 12 re-keyed
    source stanzas and the sibling pinyin rewritten to match (two stanzas whose
    substitution is graphic-only keep byte-identical pinyin and are therefore
    not listed), and the additive `.stanzas[31].editorial_note` R-B provenance
    label on the one kept retelling (project-authored text, no witness
    attribution — its `zh`/`pinyin`/translations stay untouched). No other field
    — in particular no unlisted source-Chinese field and no English/translation
    field — may differ from the base. This document declares no `zh_chars`, so
    no `zh_chars` pointer is allowlisted for it.
  - `data/corpus/wumenguan.json`: the same root `.coverage_note`, plus exactly
    the pointers the owner-adopted R-A/R-B remediation (PR re-keying wumenguan
    to the CBETA T2005 witness per the 2026-09-10 W1 correction register)
    touched: each re-keyed source field and its rewritten sibling pinyin, the
    additive `epilogue.editorial_note` provenance label (project-authored text,
    no witness attribution — the `zh`/`pinyin`/translations stay untouched), and
    the recomputed `zh_chars` total. No other field — in particular no
    unlisted source-Chinese field (`verse_zh`, `title_zh`, `name_zh`, …) and no
    English/translation field — may differ from the base.
  - `data/corpus/baojing_sanmei.json`: the same root `.coverage_note`, plus exactly the pointers
    the 2026-09-16 R-A re-key (task 015, PHASE2_PLAN rank 26 — RE-KEY 1 of 10) touched: the four
    W1-flagged stanzas re-keyed grapheme-for-grapheme to the pinned CBETA T47n1986A witness and
    the four sibling pinyin fields rewritten syllable-by-syllable to match. The two stanzas that
    were already verbatim in that witness stay byte-identical and carry no pointer, no
    English/translation field differs (those renderings keep their
    `reconstruction_unverified`/`ai_draft` status), and this document declares no `zh_chars`, so
    no `zh_chars` pointer is allowlisted for it.
  - `data/corpus/bodhidharma_erru.json`: the same root `.coverage_note`, plus exactly the pointers
    the 2026-09-16 R-A re-key (task 017, PHASE2_PLAN rank 52 — RE-KEY 3 of 10) touched: the five
    non-EXACT content fields (four DIVERGENT, one NOT_FOUND — the 無所求行 abridgment, re-keyed
    because the claimed witness carries the passage) re-keyed grapheme-for-grapheme to the pinned
    CBETA T48n2009 witness and the five sibling pinyin fields rewritten to match. The one field
    already verbatim in that witness stays byte-identical and carries no pointer, no
    English/translation field differs, and this document declares no `zh_chars`, so no
    `zh_chars` pointer is allowlisted for it.
* The allowlist is exercised by a focused regression on a temporary copy of the
  tree: a nested `coverage_note` change must exit nonzero and name the exact
  path. The repository's own corpus files are never modified by any check here.
* Three new corpus files are declared: `data/corpus/congronglu.json`, the
  2026-09-20 Congronglu reinstatement (task 043, owner-ruled) — a new
  extraction from the pinned CBETA T48n2004 witness (100 cases;
  `scripts/collate_corpus.py --doc congronglu`: 500/500 EXACT, 0 flagged) — and
  `data/corpus/chuandenglu_full.json`, the 2026-09-20 full 30-fascicle Jingde
  Chuandeng Lu (task 045) — a new extraction from the pinned CBETA T51n2076
  witness (1,274 units; `scripts/collate_corpus.py --doc chuandenglu_full`:
  2,549/2,549 EXACT, 0 flagged), a sibling of the untouched `chuandenglu`
  excerpt record, from which nothing is copied — and
  `data/corpus/caoshan_benji.json`, the 2026-09-20 Caoshan Benji record
  (task 046) — a new extraction from the pinned CBETA T47n1987A witness (84
  units tiling all 12,343 CJK characters of the fascicle;
  `scripts/collate_corpus.py --doc caoshan_benji`: 169/169 EXACT, 0 flagged,
  84/84 source-content fields collating), the last of the Five Houses'
  founders to enter the corpus — and 2026-09-21 (task 050), when six
  full-witness records entered the corpus
  (`data/corpus/huangbo_fayao_full.json`, `mazu_guanglu_full.json`,
  `yunmen_guanglu_full.json`, `dongshan_yulu_full.json`,
  `zhaozhou_yulu_full.json`, `dahui_yulu_full.json`), each produced by
  `scripts/segment_full_witness.py` from its pinned CBETA XML P5 witness with run-time
  tiling assertions (`scripts/collate_corpus.py --doc …`: 5,178/5,178 EXACT, 0 flagged,
  2,586/2,586 source-content fields collating, 302,592 new source-content CJK characters;
  declared evidence sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json).
  Any *other* new corpus file is a failure.
* The set of corpus files must not grow or shrink, except for the declared new
  documents above.
* The `docs/data/corpus` mirror must be byte-identical to `data/corpus`.

Run: python3 scripts/test_source_preservation.py   (exit 0 = preserved)
Also invoked from scripts/smoke_test.mjs so the CI gate covers it without
workflow changes.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from typing import Any
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CORPUS_DIR = ROOT / "data" / "corpus"
DOCS_CORPUS_DIR = ROOT / "docs" / "data" / "corpus"

#: The tree the W1 work started from. Pinned deliberately: the base must not move
#: when the corpus moves. (origin/main at the merge base of the W1 PR.)
BASE_COMMIT = "3cc7a8e9681ea8646d2b4fd8d86f1a4b1eea6b43"

#: Corpus files that may legitimately appear after the base commit, with the dated ruling that
#: declares them. A new corpus file is corpus expansion — normally out of scope for W1 work — so
#: entry here is the exception, and the docstring above records what backs it.
DECLARED_NEW_CORPUS = {
    "data/corpus/congronglu.json": (
        "2026-09-20 Congronglu reinstatement (task 043, owner-ruled): a new extraction from the "
        "pinned CBETA T48n2004 witness (100 cases, 500/500 source-content fields EXACT, 0 flagged, "
        "no quarantined record copied). Declared evidence: "
        "sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json + "
        "sessions/COLLATION_W1_2026-09-20_CORRECTION.md."
    ),
    "data/corpus/chuandenglu_full.json": (
        "2026-09-20 full 30-fascicle Jingde Chuandeng Lu (task 045): a new extraction from the "
        "pinned CBETA T51n2076 witness (1,274 units — 971 biography entries, 69 titled works, 234 "
        "sections — tiling all 350,269 CJK characters of the 30 fascicles; 2,549/2,549 fields "
        "EXACT, 0 flagged; sibling of the untouched `chuandenglu` excerpt record, nothing copied "
        "from it). Declared evidence: sessions/COLLATION_REGISTER_2026-09-20_CHUANDENGLU_FULL.json "
        "+ sessions/P1_CHUANDENGLU_FULL_2026-09-20.md."
    ),
    "data/corpus/caoshan_benji.json": (
        "2026-09-20 Caoshan Benji record (task 046, P1-3): a new extraction from the pinned CBETA "
        "T47n1987A witness (撫州曹山元證禪師語錄; 84 units — 1 preface, 1 opening heading, 75 record "
        "paragraphs, 6 Caodong treatises, 1 close — tiling all 12,343 CJK characters of the "
        "fascicle; 169/169 fields EXACT, 0 flagged; 84/84 source-content fields collating; the "
        "sibling T47n1987B recension, X68n1315, T51n2076 and T48n2006 are probes, not claimed "
        "witnesses, and nothing is copied from them). Declared evidence: "
        "sessions/COLLATION_REGISTER_2026-09-20_CAOSHAN_BENJI.json + "
        "sessions/P1_CAOSHAN_BENJI_2026-09-20.md."
    ),
    # 2026-09-21 (task 050, "enthusiast 100% closer"): the six full-witness records. Each is a new
    # extraction by scripts/segment_full_witness.py from pinned CBETA XML P5 witnesses at revision
    # dbdea41071e1e260ad84b72faefd4587333cf76d only — the four seeds they complete and the historical
    # Zhaozhou seed are untouched, and nothing is copied from any probe. Declared evidence:
    # sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json +
    # sessions/COLLATION_W1_2026-09-21_ENTHUSIAST_100PCT.md +
    # sessions/P2_ENTHUSIAST_100PCT_2026-09-20.md.
    "data/corpus/huangbo_fayao_full.json": (
        "2026-09-21 task 050: 黃檗山斷際禪師傳心法要, complete from the pinned T48n2012A witness "
        "(19 units tiling all 6,632 CJK characters; 39/39 fields EXACT, 0 flagged; T48n2012B and "
        "X68n1315 are probes, not claimed, and the earlier huangbo_chuanxin seed is untouched)."
    ),
    "data/corpus/mazu_guanglu_full.json": (
        "2026-09-21 task 050: the record printed as X69n1321 (catalogued 馬祖道一禪師廣錄, 四家語錄卷一), "
        "complete (35 units tiling all 4,732 CJK characters; 71/71 fields EXACT, 0 flagged; "
        "T51n2076 and X68n1315 are probes, and the earlier mazu_yulu seed is untouched)."
    ),
    "data/corpus/yunmen_guanglu_full.json": (
        "2026-09-21 task 050: 雲門匡真禪師廣錄, complete from the pinned T47n1988 witness (776 units "
        "tiling all 43,678 CJK characters; 1,553/1,553 fields EXACT, 0 flagged; the anthology "
        "parallel in X68n1315 is a probe, and the earlier ten-section yunmen_yulu seed — whose "
        "retellings collate 0 against their claim — is left as it stands, not patched)."
    ),
    "data/corpus/dongshan_yulu_full.json": (
        "2026-09-21 task 050: 洞山良价禪師語錄, both Taishō parts (T47n1986A 15,843 + T47n1986B "
        "8,596 CJK), 322 units tiling 24,439 CJK characters; 645/645 fields EXACT, 0 flagged; "
        "T47n1987A is a probe (its Five Ranks treatises are collated in caoshan_benji), and the "
        "earlier dongshan_yulu and baojing_sanmei records are untouched."
    ),
    "data/corpus/zhaozhou_yulu_full.json": (
        "2026-09-21 task 050: 趙州真際禪師語錄 as printed in the Guzunsu yulu (X68n1315 juan 13–14, "
        "region-pinned between the anthology work heading and 古尊宿語錄卷第十五), 80 units tiling "
        "21,038 CJK characters; 161/161 fields EXACT, 0 flagged. X68n1315 carries recorded historical "
        "reference drift (declared, not waived away); the corpus's prior 'T1987' claim stays "
        "recorded as false on the historical zhaozhou_yulu seed, which is untouched."
    ),
    "data/corpus/dahui_yulu_full.json": (
        "2026-09-21 task 050: 大慧普覺禪師語錄 T47n1998A (182,132 CJK, the juan 25–30 書 letters "
        "included) + 宗門武庫 T47n1998B (19,941 CJK), 1,354 units tiling 202,073 CJK characters; "
        "2,709/2,709 fields EXACT, 0 flagged. T48n2001 (Hongzhi's Guanglu — the corpus's "
        "dahui_hongzhi selection claims nothing from it and this record claims nothing from it "
        "either) is a probe; the six-field dahui_hongzhi selection is the untouched sibling."
    ),
}

#: Set only for the temporary copy that the nested-`coverage_note` regression runs: the copy
#: then performs the real comparison but not the regression that spawned it. Nothing else sets
#: it, so a normal run — including the smoke test — always runs the focused regression.
NESTED_REGRESSION_MARKER = "PRESERVATION_NESTED_REGRESSION"

#: The only corpus paths the W1 work may have touched: exact JSON pointers, per file. The
#: allowlist is the pointer itself, never the leaf key name — ``.cases[0].coverage_note`` in
#: any of the 48 Wumenguan cases is a *corpus content* change and must fail, even though its
#: final key is spelled the same as the two permitted root notes.
ALLOWED_CHANGES = {
    "data/corpus/baojing_sanmei.json": frozenset({
        # 2026-09-16 R-A re-key (task 015, PHASE2_PLAN rank 26 — RE-KEY 1 of 10): the four stanzas
        # the 2026-09-10 register flagged (DIVERGENT `.stanzas[1]`/`[2]`/`[3]`, NOT_FOUND
        # `.stanzas[5]`) are re-keyed grapheme-for-grapheme to the pinned CBETA witness T47n1986A
        # (upstream dbdea410; refs 39 verified / 0 drift), the one carrier that holds the song as
        # its own titled section (寶鏡三昧歌) and carries all six stanzas verbatim. The two stanzas
        # that were already EXACT in it are byte-identical and therefore carry no pointer. Each
        # re-keyed source field is allowlisted with its rewritten sibling pinyin — nine syllables
        # change in total (弗齊→不齊, 便赴→亦赴, 共忌→俱非, 如面臨鏡容色相覷→如臨寶鏡形影相覩),
        # and no syllable count changes because every substitution is one grapheme for one —
        # plus the additive honest `.coverage_note`, which records the primary-witness choice, the
        # carriers' variants (類之弗齊 / 銀怨盛雪) and the one residual metadata flag. The five
        # superseded clauses it replaces (銀碗盛雪 / 來機便赴 / 背觸共忌 / 如面臨鏡 / 容色相覷)
        # return 0 hits in all 39 pinned refs. There is no `zh_chars` pointer because this document
        # declares none (and the re-key is length-neutral: 104 graphs before and after). The
        # `.title_zh` composite-title metadata flag is deliberately absent (separate plan item), and
        # no English/translation field differs — those renderings stay labelled unverified.
        ".coverage_note",
        ".stanzas[1].pinyin",
        ".stanzas[1].zh",
        ".stanzas[2].pinyin",
        ".stanzas[2].zh",
        ".stanzas[3].pinyin",
        ".stanzas[3].zh",
        ".stanzas[5].pinyin",
        ".stanzas[5].zh",
    }),
    "data/corpus/biyanlu_cases.json": frozenset({
        # 2026-09-10 R-A re-key of the W1-flagged content fields to the T2003 witness (Wave 1,
        # document 2): each re-keyed source field and its rewritten sibling pinyin, the two additive
        # `editorial_note` R-B provenance labels (project-authored text moved out of a source field,
        # no witness attribution), the honest post-remediation `coverage_note`, and the recomputed
        # `zh_chars` total. No English/translation field and no title metadata may differ.
        # 2026-09-16 two-graph RE-KEY (task 016, PHASE2_PLAN ranks 68-69 — RE-KEY 2 of 10): the two
        # MINOR fields that were project readings rather than <g>-glyph residue, re-keyed verbatim
        # to the pinned CBETA T48n2003 witness (upstream dbdea410; refs 39 verified / 0 drift).
        # `.cases[10].commentary_zh` 築 → 𡎺 (築 is 0× in the pinned XML and ref; the witness
        # carries <g> CB05218 𡎺 at that position, the reading already used at the five other
        # CB05218 positions in this document) and `.cases[64].pointer_zh` trailing 看 removed
        # (the witness reads 試舉。 without 看 there; it uses 試舉看 at the 60 other 試舉
        # positions). Neither field has a pinyin sibling; `.coverage_note` (wording fix for the
        # 20/22 split) and `.zh_chars` (75854 → 75852) were already allowlisted.
        ".cases[0].dialogue[2].pinyin",
        ".cases[0].dialogue[2].zh",
        ".cases[0].pointer_zh",
        ".cases[10].commentary_zh",
        ".cases[11].dialogue[1].pinyin",
        ".cases[11].dialogue[1].zh",
        ".cases[14].dialogue[0].pinyin",
        ".cases[14].dialogue[0].zh",
        ".cases[17].dialogue[0].pinyin",
        ".cases[17].dialogue[0].zh",
        ".cases[19].editorial_note",
        ".cases[19].verse_zh",
        ".cases[1].dialogue[1].pinyin",
        ".cases[1].dialogue[1].zh",
        ".cases[1].pointer_zh",
        ".cases[22].dialogue[0].pinyin",
        ".cases[22].dialogue[0].zh",
        ".cases[2].dialogue[0].pinyin",
        ".cases[2].dialogue[0].zh",
        ".cases[2].pointer_zh",
        ".cases[30].dialogue[0].pinyin",
        ".cases[30].dialogue[0].zh",
        ".cases[50].dialogue[0].pinyin",
        ".cases[50].dialogue[0].zh",
        ".cases[64].pointer_zh",
        ".cases[74].dialogue[0].pinyin",
        ".cases[74].dialogue[0].zh",
        ".cases[80].pointer_zh",
        ".cases[81].dialogue[0].pinyin",
        ".cases[81].dialogue[0].zh",
        ".cases[87].dialogue[0].pinyin",
        ".cases[87].dialogue[0].zh",
        ".cases[95].dialogue[0].editorial_note",
        ".cases[95].dialogue[0].pinyin",
        ".cases[95].dialogue[0].zh",
        ".cases[97].dialogue[0].pinyin",
        ".cases[97].dialogue[0].zh",
        ".cases[98].dialogue[0].pinyin",
        ".cases[98].dialogue[0].zh",
        ".coverage_note",
        ".zh_chars",
    }),
    "data/corpus/bodhidharma_erru.json": frozenset({
        # 2026-09-16 R-A re-key (task 017, PHASE2_PLAN rank 52 — RE-KEY 3 of 10): the five
        # non-EXACT content fields (four DIVERGENT 0.9492–0.973, one NOT_FOUND 0.6615 — the
        # 無所求行 abridgment of the witness passage, re-keyed per REMEDIATION_PLAN §1 because
        # the claimed witness carries the passage) are re-keyed grapheme-for-grapheme to the
        # pinned CBETA witness T48n2009 (upstream dbdea410; refs 39 verified / 0 drift), so the
        # document collates 6/6 EXACT instead of 1/6. Each re-keyed source field is allowlisted
        # with its rewritten sibling pinyin; the re-keyed fields keep the witness's own Taishō
        # punctuation. The 2/6 fields that were verbatim in the second in-CBETA carrier
        # T51n2076 before the re-key are recorded in the note, which also names the four
        # residual NOT_FOUND title_zh metadata flags (composite-title plan item, untouched here).
        # This document declares no `zh_chars`, so no `zh_chars` pointer is allowlisted for it.
        ".coverage_note",
        ".sections[0].dialogue[1].pinyin",
        ".sections[0].dialogue[1].zh",
        ".sections[1].dialogue[0].pinyin",
        ".sections[1].dialogue[0].zh",
        ".sections[1].dialogue[1].pinyin",
        ".sections[1].dialogue[1].zh",
        ".sections[2].dialogue[0].pinyin",
        ".sections[2].dialogue[0].zh",
        ".sections[2].dialogue[1].pinyin",
        ".sections[2].dialogue[1].zh",
    }),
    "data/corpus/chuandenglu.json": frozenset({
        # 2026-09-16 R-A re-key (task 018, PHASE2_PLAN ranks 25 / 36 / 59 — RE-KEY 4 of 10):
        # rank 36's finding is attribution — three works carry parts of this selection and the
        # third was never cited. Two content fields are re-keyed grapheme-for-grapheme from the
        # digest-verified CBETA X80n1565 (五燈會元; upstream dbdea41071e1, refs 39 verified /
        # 0 drift): `.sample_records[0].dialogue[3].zh` 如人駕車 → 如牛駕車 (one graph; the field
        # carried X80n1565's 車若不行 clause with T51n2076's 人) and
        # `.sample_records[1].dialogue[1].zh` 士於言下大悟 → 士於言下頓領玄旨, each allowlisted
        # with its rewritten sibling pinyin. `.sample_records[1].dialogue[0].zh` (the 龐居士問馬祖
        # question) is NOT allowlisted because its text is byte-identical to base: it was already
        # verbatim in T48n2001 at offset 66315, so its defect was the uncited witness, fixed in
        # `scripts/collate_corpus.py`'s DOCS mapping rather than in the source.
        # `.sample_records[0].dialogue[2].editorial_note` is an additive R-B label recording that
        # 0 of that field's 30 twelve-graph windows occur in any of the 39 references, so it is a
        # retained project paraphrase and is not re-keyed. The document collates 4/6 content
        # fields instead of 1/6; s0.d0 stays DIVERGENT at 0.9677 (甚麼/什麼, one grapheme) and the
        # 2 NOT_FOUND title_zh metadata flags are untouched (composite-title plan item). This
        # document declares no `zh_chars`, so no `zh_chars` pointer is allowlisted for it.
        ".coverage_note",
        ".sample_records[0].dialogue[2].editorial_note",
        ".sample_records[0].dialogue[3].pinyin",
        ".sample_records[0].dialogue[3].zh",
        ".sample_records[1].dialogue[1].pinyin",
        ".sample_records[1].dialogue[1].zh",
    }),
    "data/corpus/dongshan_yulu.json": frozenset({
        # 2026-09-12 CITATION fix (task 014, rank 4): the `coverage_note` cited X1321 — the Mazu
        # record (X69n1321) — as a witness of this document. Rewritten to name the witnesses the
        # harness actually pins (T47n1986A/T47n1986B, the 筠州/瑞州洞山 records) and to state the
        # measured 1/21 collation. Only the note changes: no source text, no `zh`/`*_zh` field, no
        # `cbeta_id` change, and no `zh_chars` pointer (this document declares none). The 14
        # `title_zh` metadata flags are untouched (composite-title plan item).
        ".coverage_note",
        ".five_ranks[0].verse_zh",
        ".five_ranks[0].verse_pinyin",
        ".five_ranks[0].commentary_zh",
        ".five_ranks[1].verse_zh",
        ".five_ranks[1].verse_pinyin",
        ".five_ranks[1].commentary_zh",
        ".five_ranks[2].verse_zh",
        ".five_ranks[2].verse_pinyin",
        ".five_ranks[2].commentary_zh",
        ".five_ranks[3].verse_zh",
        ".five_ranks[3].verse_pinyin",
        ".five_ranks[3].commentary_zh",
        ".five_ranks[4].verse_zh",
        ".five_ranks[4].verse_pinyin",
        ".five_ranks[4].commentary_zh",
        ".dialogues[0].dialogue[0].zh",
        ".dialogues[0].dialogue[0].pinyin",
    }),
    "data/corpus/fayan_yulu.json": frozenset({
        # 2026-09-12 CITATION fix (task 014, rank 3): the `coverage_note` named T1985 / X1321 —
        # the Linji record and the Mazu record, neither a witness of this document. Rewritten to
        # name the witness the harness actually pins (T47n1991) plus X63n1226 for 宗門十規論, and to
        # state the measured 1/11 collation. Only the note changes: no source text, no `zh`/
        # `*_zh` field, no `cbeta_id` (already T1991 / X1226), and no `zh_chars` pointer (this
        # document declares none).
        ".coverage_note",
    }),
    "data/corpus/linji_yulu.json": frozenset({
        # 2026-09-11 R-A re-key of the W1-flagged content fields to the T47n1985 witness (Wave 1,
        # document 3), under the owner's 2026-09-11 per-field ruling for the 行錄 division: the
        # re-keyed source fields (each a contiguous verbatim witness span) and the sibling pinyin
        # rewritten to match, the three additive `editorial_note` R-B provenance labels on kept
        # project-authored retellings (no witness attribution; their text stays byte-identical),
        # the honest post-remediation `coverage_note`, and the recomputed `zh_chars` total. The two
        # MINOR fields and every `title_zh` (composite-title plan item) are deliberately absent.
        ".sections[0].dialogue[1].zh",
        ".sections[67].dialogue[0].pinyin",
        ".sections[67].dialogue[0].zh",
        ".sections[68].dialogue[0].pinyin",
        ".sections[68].dialogue[0].zh",
        ".sections[69].dialogue[0].pinyin",
        ".sections[69].dialogue[0].zh",
        ".sections[70].dialogue[0].pinyin",
        ".sections[70].dialogue[0].zh",
        ".sections[71].dialogue[0].editorial_note",
        ".sections[72].dialogue[0].editorial_note",
        ".sections[73].dialogue[0].editorial_note",
        ".coverage_note",
        ".zh_chars",
    }),
    "data/corpus/mazu_yulu.json": frozenset({
        # 2026-09-12 CITATION fix (task 014, rank 5): the `coverage_note` cited T1986 — a 洞山 work —
        # and said "6" where the harness evaluates 8 source-content fields. Rewritten to name the
        # witness the harness actually pins (X69n1321, 四家語錄卷一·馬祖道一禪師廣錄) and to state the
        # measured 0/8 collation. Only the note changes: no source text, no `zh`/`*_zh` field, no
        # `cbeta_id` change (already X1321), and no `zh_chars` pointer (this document declares none).
        #
        # 2026-09-16 R-A re-key (task 022, PHASE2_PLAN ranks 5 / 11 / 35 — RE-KEY 8 of 10): the six
        # content fields the claimed witness X69n1321 carries incompletely are re-keyed
        # grapheme-for-grapheme to the pinned CBETA X69n1321 (四家語錄卷一·馬祖道一禪師廣錄; upstream
        # dbdea41071e1, refs 39 verified / 0 drift): 道不用脩… (@1,470), 僧問和尚為甚麼說即心即佛…
        # (@3,846), 曰除此二種人來… (@3,877), 示眾云汝等諸人各信自心是佛此心即佛 (@662), the
        # 磨磚 exchange in the witness's own voice 唐開元中習定於衡嶽傳法院… (@69), and
        # 大梅山法常禪師…祖云梅子熟也 (@2,968) — each allowlisted with its rewritten sibling pinyin,
        # which is now a full romanization of the re-keyed text (the three formerly abridged pinyin
        # fields carried an ellipsis and a leading 師/馬祖 that the witness text does not have).
        # `.sections[3].dialogue[0].zh` is deliberately absent: it is byte-identical to the base — it
        # was already T2076 景德傳燈錄卷六 text (32/32 @57,513) and the harness change in this commit
        # claims T51n2076 as a second witness so the field collates where it stands. The one field with
        # no measured source anywhere (`.sections[1].dialogue[0].zh`, 33 graphs) stays as a labelled
        # R-B retelling and carries an additive `editorial_note` — its `zh`/`pinyin`/translations do not
        # differ. No English/translation field differs (those renderings keep their
        # `reconstruction_unverified` status), no `cbeta_id` change (X1321 stays the primary witness,
        # the T2076 stratum is disclosed in the note), and no `zh_chars` pointer (this document declares
        # none). The document collates 7/8 content fields instead of 0/8.
        ".coverage_note",
        ".sections[0].dialogue[0].pinyin",
        ".sections[0].dialogue[0].zh",
        ".sections[1].dialogue[0].editorial_note",
        ".sections[1].dialogue[1].pinyin",
        ".sections[1].dialogue[1].zh",
        ".sections[1].dialogue[2].pinyin",
        ".sections[1].dialogue[2].zh",
        ".sections[2].dialogue[0].pinyin",
        ".sections[2].dialogue[0].zh",
        ".sections[4].dialogue[0].pinyin",
        ".sections[4].dialogue[0].zh",
        ".sections[5].dialogue[0].pinyin",
        ".sections[5].dialogue[0].zh",
    }),
    "data/corpus/platform_sutra.json": frozenset({
        # 2026-09-11 label-only recension package (task 009, Dunhuang-primary ruling): provenance
        # labels under the owner's oldest-near-complete-copy ruling — CBETA T48n2007 (Dunhuang) is
        # the primary witness, T48n2008 (宗寶) the named alternative. Every pointer here is a note:
        # the root `.recension_note`, the corrected honest `.coverage_note`, and one
        # `.recension_note` per source-content field. `.chapters[8].recension_note` carries both
        # the précis label for `.chapters[8].zh` and the chapter-title disclosure (宗寶 titles that
        # chapter 宣詔第九; 護法 occurs 0 times in both witnesses) — one pointer, not two.
        # `.chapters[0].verses[2].recension_note` is deliberately ABSENT: that note predates this
        # package, its text is left intact, and an allowlist pointer that is not an actual change
        # fails this test. Not one character of Chinese was re-keyed, so there is no `.zh`,
        # `.pinyin`, `.title_*` or `translations.*` pointer here — and this document declares no
        # `zh_chars`, so there is no `.zh_chars` pointer either.
        ".chapters[0].verses[0].recension_note",
        ".chapters[0].verses[1].recension_note",
        ".chapters[1].dialogue[0].recension_note",
        ".chapters[1].dialogue[1].recension_note",
        ".chapters[2].recension_note",
        ".chapters[3].dialogue[0].recension_note",
        ".chapters[4].dialogue[0].recension_note",
        ".chapters[5].recension_note",
        ".chapters[6].recension_note",
        ".chapters[7].recension_note",
        ".chapters[8].recension_note",
        ".chapters[9].recension_note",
        ".coverage_note",
        ".recension_note",
    }),
    "data/corpus/sengzhao_zhaolun.json": frozenset({
        # 2026-09-17 R-A re-key (task 023, PHASE2_PLAN rank 23 — RE-KEY 9 of 10): all four
        # content fields the document held were NOT_FOUND or spliced against the claimed
        # witness T45n1858 (肇論; refs 39 verified / 0 drift at dbdea410), and all four
        # title_zh metadata fields were TITLE_COMPOSITE (project-appended taglines after the
        # witness's own title). Each content `zh` is re-keyed verbatim to a T45n1858 passage
        # (物不遷論 @1,564 既無往返之微朕…復何怪哉, @1,454 求向物於向…故知物不去; 不真空論
        # @2,406 夫至虛無生者…何能契神於有無之間哉; 涅槃無名論 @13,289 天地與我同根…而道存
        # 乎其間矣); each sibling `pinyin` is rewritten to match the new text; each `title_zh`
        # is shortened to the witness's attested title (with matching `title_pinyin`/
        # `title_en`); `section_id` `one_body_universe` is renamed to `nirvana_nameless` to
        # match the new title; the root metadata (`title_*`, `author_*`, `era`, `genre`,
        # `overview`, `cbeta_id`, `cbeta_note`) are rewritten for truthfulness (title → 肇論,
        # author → 後秦 釋僧肇 撰 per the XML <author>, era/genre/overview rewritten to match);
        # English `translations.*.text` for the three translators are updated to match the new
        # source wording (they were reconstructions against fabricated text and stay
        # `reconstruction_unverified`); additive honest `.coverage_note` and `.cbeta_note`
        # record the primary witness and the 0/12→12/12 measurement. No `zh_chars` pointer
        # (this document declares none, and the re-keyed content totals 185 CJK vs 188
        # previously — no byte-length metric is computed).
        ".author_en",
        ".author_zh",
        ".cbeta_id",
        ".cbeta_note",
        ".coverage_note",
        ".era",
        ".genre",
        ".overview",
        ".sections[0].dialogue[0].pinyin",
        ".sections[0].dialogue[0].translations.cleary.text",
        ".sections[0].dialogue[0].translations.liebenthal.text",
        ".sections[0].dialogue[0].translations.red_pine.text",
        ".sections[0].dialogue[0].zh",
        ".sections[0].dialogue[1].pinyin",
        ".sections[0].dialogue[1].translations.cleary.text",
        ".sections[0].dialogue[1].translations.liebenthal.text",
        ".sections[0].dialogue[1].translations.red_pine.text",
        ".sections[0].dialogue[1].zh",
        ".sections[0].title_en",
        ".sections[0].title_pinyin",
        ".sections[0].title_zh",
        ".sections[1].dialogue[0].pinyin",
        ".sections[1].dialogue[0].translations.cleary.text",
        ".sections[1].dialogue[0].translations.liebenthal.text",
        ".sections[1].dialogue[0].translations.red_pine.text",
        ".sections[1].dialogue[0].zh",
        ".sections[1].title_en",
        ".sections[1].title_pinyin",
        ".sections[1].title_zh",
        ".sections[2].dialogue[0].pinyin",
        ".sections[2].dialogue[0].translations.cleary.text",
        ".sections[2].dialogue[0].translations.liebenthal.text",
        ".sections[2].dialogue[0].translations.red_pine.text",
        ".sections[2].dialogue[0].zh",
        ".sections[2].section_id",
        ".sections[2].title_en",
        ".sections[2].title_pinyin",
        ".sections[2].title_zh",
        ".title_en",
        ".title_pinyin",
        ".title_zh",
    }),
    "data/corpus/wumenguan.json": frozenset({
        # .coverage_note: W1 containment re-wording into an honest status disclosure (prior PR)
        ".coverage_note",
        # 2026-09-10 R-A re-key of the W1-flagged fields to the T2005 witness (62 zh + 62 pinyin),
        # the additive R-B epilogue provenance label, and the recomputed zh_chars total:
        ".cases[0].commentary_pinyin",
        ".cases[0].commentary_zh",
        ".cases[10].dialogue[0].pinyin",
        ".cases[10].dialogue[0].zh",
        ".cases[10].dialogue[1].pinyin",
        ".cases[10].dialogue[1].zh",
        ".cases[11].commentary_pinyin",
        ".cases[11].commentary_zh",
        ".cases[12].dialogue[0].pinyin",
        ".cases[12].dialogue[0].zh",
        ".cases[13].dialogue[0].pinyin",
        ".cases[13].dialogue[0].zh",
        ".cases[13].dialogue[1].pinyin",
        ".cases[13].dialogue[1].zh",
        ".cases[16].verse_pinyin",
        ".cases[16].verse_zh",
        ".cases[17].commentary_pinyin",
        ".cases[17].commentary_zh",
        ".cases[18].commentary_pinyin",
        ".cases[18].commentary_zh",
        ".cases[18].dialogue[0].pinyin",
        ".cases[18].dialogue[0].zh",
        ".cases[18].dialogue[2].pinyin",
        ".cases[18].dialogue[2].zh",
        ".cases[18].dialogue[3].pinyin",
        ".cases[18].dialogue[3].zh",
        ".cases[19].commentary_pinyin",
        ".cases[19].commentary_zh",
        ".cases[19].dialogue[0].pinyin",
        ".cases[19].dialogue[0].zh",
        ".cases[19].verse_pinyin",
        ".cases[19].verse_zh",
        ".cases[1].commentary_pinyin",
        ".cases[1].commentary_zh",
        ".cases[1].dialogue[1].pinyin",
        ".cases[1].dialogue[1].zh",
        ".cases[1].dialogue[2].pinyin",
        ".cases[1].dialogue[2].zh",
        ".cases[20].commentary_pinyin",
        ".cases[20].commentary_zh",
        ".cases[22].commentary_pinyin",
        ".cases[22].commentary_zh",
        ".cases[22].dialogue[0].pinyin",
        ".cases[22].dialogue[0].zh",
        ".cases[22].dialogue[1].pinyin",
        ".cases[22].dialogue[1].zh",
        ".cases[22].dialogue[2].pinyin",
        ".cases[22].dialogue[2].zh",
        ".cases[22].verse_pinyin",
        ".cases[22].verse_zh",
        ".cases[24].verse_pinyin",
        ".cases[24].verse_zh",
        ".cases[26].dialogue[0].pinyin",
        ".cases[26].dialogue[0].zh",
        ".cases[28].commentary_pinyin",
        ".cases[28].commentary_zh",
        ".cases[28].dialogue[0].pinyin",
        ".cases[28].dialogue[0].zh",
        ".cases[28].dialogue[1].pinyin",
        ".cases[28].dialogue[1].zh",
        ".cases[28].verse_pinyin",
        ".cases[28].verse_zh",
        ".cases[29].verse_pinyin",
        ".cases[29].verse_zh",
        ".cases[2].commentary_pinyin",
        ".cases[2].commentary_zh",
        ".cases[2].dialogue[0].pinyin",
        ".cases[2].dialogue[0].zh",
        ".cases[2].dialogue[1].pinyin",
        ".cases[2].dialogue[1].zh",
        ".cases[2].verse_pinyin",
        ".cases[2].verse_zh",
        ".cases[31].dialogue[0].pinyin",
        ".cases[31].dialogue[0].zh",
        ".cases[31].dialogue[1].pinyin",
        ".cases[31].dialogue[1].zh",
        ".cases[32].verse_pinyin",
        ".cases[32].verse_zh",
        ".cases[34].commentary_pinyin",
        ".cases[34].commentary_zh",
        ".cases[36].verse_pinyin",
        ".cases[36].verse_zh",
        ".cases[39].commentary_pinyin",
        ".cases[39].commentary_zh",
        ".cases[39].dialogue[1].pinyin",
        ".cases[39].dialogue[1].zh",
        ".cases[39].verse_pinyin",
        ".cases[39].verse_zh",
        ".cases[3].commentary_pinyin",
        ".cases[3].commentary_zh",
        ".cases[3].dialogue[0].pinyin",
        ".cases[3].dialogue[0].zh",
        ".cases[3].verse_pinyin",
        ".cases[3].verse_zh",
        ".cases[43].verse_pinyin",
        ".cases[43].verse_zh",
        ".cases[45].verse_pinyin",
        ".cases[45].verse_zh",
        ".cases[46].commentary_pinyin",
        ".cases[46].commentary_zh",
        ".cases[46].verse_pinyin",
        ".cases[46].verse_zh",
        ".cases[47].commentary_pinyin",
        ".cases[47].commentary_zh",
        ".cases[47].dialogue[1].pinyin",
        ".cases[47].dialogue[1].zh",
        ".cases[4].commentary_pinyin",
        ".cases[4].commentary_zh",
        ".cases[4].dialogue[0].pinyin",
        ".cases[4].dialogue[0].zh",
        ".cases[4].verse_pinyin",
        ".cases[4].verse_zh",
        ".cases[5].commentary_pinyin",
        ".cases[5].commentary_zh",
        ".cases[5].dialogue[0].pinyin",
        ".cases[5].dialogue[0].zh",
        ".cases[5].verse_pinyin",
        ".cases[5].verse_zh",
        ".cases[6].dialogue[0].pinyin",
        ".cases[6].dialogue[0].zh",
        ".cases[9].verse_pinyin",
        ".cases[9].verse_zh",
        ".epilogue.editorial_note",
        ".preface.pinyin",
        ".preface.zh",
        ".zh_chars",
    }),
    "data/corpus/xinxin_ming.json": frozenset({
        # 2026-09-11 R-A re-key of the 12 DIVERGENT W1-flagged content stanzas to the T48n2010
        # witness (Wave 1, document 4): each re-keyed source field and the sibling pinyin
        # rewritten to match — two pinyin fields (.stanzas[14] and .stanzas[32]) are absent
        # because those substitutions are graphic-only and the reading is unchanged, so those
        # fields are byte-identical and are not allowlisted. Plus the additive
        # `.stanzas[31].editorial_note` R-B provenance label on the one NOT_FOUND stanza kept by
        # the owner ruling (project-authored retelling, no witness attribution; its zh/pinyin/
        # translations stay byte-identical), and the honest post-remediation `.coverage_note`.
        # There is no `.zh_chars` pointer because this document declares none. The single
        # `.title_zh` metadata flag (composite-title plan item) is deliberately absent.
        ".coverage_note",
        ".stanzas[10].pinyin",
        ".stanzas[10].zh",
        ".stanzas[14].zh",
        ".stanzas[16].pinyin",
        ".stanzas[16].zh",
        ".stanzas[17].pinyin",
        ".stanzas[17].zh",
        ".stanzas[18].pinyin",
        ".stanzas[18].zh",
        ".stanzas[21].pinyin",
        ".stanzas[21].zh",
        ".stanzas[22].pinyin",
        ".stanzas[22].zh",
        ".stanzas[23].pinyin",
        ".stanzas[23].zh",
        ".stanzas[27].pinyin",
        ".stanzas[27].zh",
        ".stanzas[28].pinyin",
        ".stanzas[28].zh",
        ".stanzas[31].editorial_note",
        ".stanzas[32].zh",
        ".stanzas[34].pinyin",
        ".stanzas[34].zh",
    }),
    "data/corpus/dahui_hongzhi.json": frozenset({
        # 2026-09-13 disclosure fix (task 014b-2): the document is brought into agreement with the
        # manifest row PR #43 corrected — `cbeta_id` names all three witnesses the collation harness
        # probes (T47n1998A, T47n1998B, T48n2001) and `cbeta_note` discloses that the T48n2001
        # pairing is bibliographic (it comes from the collate_corpus.py witness note) and that
        # 0 of 6 evaluated content fields collate in any of the three (harness probing is not
        # collation). Metadata-only: no `zh`/`*_zh` field, no status, no `zh_chars` pointer
        # (this document declares none).
        # 2026-09-16 RE-KEY (task 019, PHASE2_PLAN ranks 7 / 42 — RE-KEY 5 of 10): the six content
        # fields are re-keyed grapheme-for-grapheme to the pinned CBETA witnesses (upstream
        # dbdea41071e1, refs 39 verified / 0 drift): 2 默照銘 fields from T48n2001 whole poem
        # (previously fabricated tail 雪覆夜沼 etc 0 hits in 39 refs, now verbatim), 4 letters
        # from T47n1998A (狗子還有佛性也無 etc). Each re-keyed zh is allowlisted with its
        # rewritten sibling pinyin, plus the honest .coverage_note and updated .cbeta_note
        # (now 6/6 EXACT). Title 張九成 recipient 0 hits in T47n1998A disclosed in coverage_note.
        # This document declares no zh_chars, so no zh_chars pointer is allowlisted.
        ".cbeta_id",
        ".cbeta_note",
        ".coverage_note",
        ".sections[0].dialogue[0].pinyin",
        ".sections[0].dialogue[0].zh",
        ".sections[0].dialogue[1].pinyin",
        ".sections[0].dialogue[1].zh",
        ".sections[1].dialogue[0].pinyin",
        ".sections[1].dialogue[0].zh",
        ".sections[1].dialogue[1].pinyin",
        ".sections[1].dialogue[1].zh",
        ".sections[2].dialogue[0].pinyin",
        ".sections[2].dialogue[0].zh",
        ".sections[3].dialogue[0].pinyin",
        ".sections[3].dialogue[0].zh",
    }),
    "data/corpus/zhengdao_ge.json": frozenset({
        # 2026-09-14 LABEL fix (task 009 bundle 1, PHASE2_PLAN rank 70): the additive honest
        # `.coverage_note` records a metadata-only disclosure — content is 6/6 verbatim in the
        # claimed witness T48n2014 (no recension or re-key problem exists in the text), while the
        # root title_zh 永嘉真覺大師 證道歌 is a project heading rather than the witness's attested
        # title 永嘉證道歌. Only the note changes: no `zh`/`*_zh` field, no `title_zh` (left as
        # project composition by design), no `cbeta_id`, and no `zh_chars` pointer (this document
        # declares none).
        ".coverage_note",
    }),
    "data/corpus/yunmen_yulu.json": frozenset({
        # 2026-09-14 LABEL fix (task 009 bundle 1, PHASE2_PLAN rank 45): the `.coverage_note` is
        # rewritten from "10 signature encounter dialogues and sermons from T1988" — a witness
        # claim the measurement does not support, since 0 of 12 source-content fields are verbatim
        # in T47n1988 雲門匡真禪師廣錄 (11 NOT_FOUND, 1 DIVERGENT at 0.9583) — to the measured
        # disclosure: compressed project retellings whose nearest in-set proximity is X80n1565
        # (formulaic, not a verbatim carrier). Only the note changes: no `zh`/`*_zh` field, no
        # `title_zh` (composite-title plan item), no `cbeta_id` (T1988 is the right work), and no
        # `zh_chars` pointer (this document declares none).
        ".coverage_note",
    }),
    "data/corpus/yuanwu_letters.json": frozenset({
        # 2026-09-14 LABEL fix (task 009 bundle 1, PHASE2_PLAN rank 9): the additive honest
        # `.coverage_note` discloses the measured collation — 0 of 2 source-content fields collate
        # to either claimed witness (T47n1997, X69n1357) and no ref of the 39-work pinned set
        # carries the two letter fields, so the passages are disclosed as project-authored
        # retellings with the witness claim removed. Only the note changes: no `zh`/`*_zh` field,
        # no `title_zh` (the composite-title metadata flag is a separate plan item), no
        # `cbeta_id`, and no `zh_chars` pointer (this document declares none).
        ".coverage_note",
    }),
    "data/corpus/zhaozhou_yulu.json": frozenset({
        # 2026-09-12 CITATION fix (task 014, rank 1-2): the false T1987 witness claim is withdrawn,
        # not re-attributed — `cbeta_id` becomes the qualified candidate form, the `taisho_vol 47`
        # that belonged to the withdrawn claim is removed (X68n1315 is a 卍續藏 work, not a Taishō
        # one), `coverage_note` states what the document represents and what the witness
        # measurement shows in the same terms, and the additive `cbeta_note` records the probe
        # measurement and the volume removal. The two verified-quotation `reference` strings that
        # also cited T1987 are corrected to the candidate form; they are citation identifiers, not
        # source text, and their `(translation book episode/page pending)` state is unchanged, so
        # the verified-reference coverage counts do not move. Not one character of Chinese and no
        # `zh`/`*_zh` field changes, no `zh_chars` pointer (this document declares none). The 15
        # `title_zh` metadata flags are untouched (composite-title plan item).
        ".cbeta_id",
        ".cbeta_note",
        ".coverage_note",
        ".dialogues[1].dialogue[0].translations.hoffman.source.reference",
        ".dialogues[1].dialogue[1].translations.hoffman.source.reference",
        ".taisho_vol",
    }),
    "data/corpus/baizhang_guanglu.json": frozenset({
        # 2026-09-14 LABEL fix (task 010 bundle 2, PHASE2_PLAN ranks 20/31/57): the additive
        # honest `.coverage_note` records the measured collation — 0 of 6 source-content fields
        # are verbatim in either claimed witness (X69n1323, X68n1315) and no field carries a run
        # of 8 or more graphs in either claimed work, while the only measured carrier of the
        # project's wording is the UNCITED 五燈會元 X80n1565 (4 of the 6 fields, as 16–28-graph
        # fragments) and s0.d0/s0.d1 have no run in any of the 39 pinned refs. Only the note
        # changes: no `zh`/`*_zh` field, no `title_zh` (the composite-title metadata flag is a
        # separate plan item), no `cbeta_id` (ID-correct), and no `zh_chars` pointer (this
        # document declares none).
        ".coverage_note",
    }),
    "data/corpus/caoxi_zhuan.json": frozenset({
        # 2026-09-14 LABEL fix (task 010 bundle 2, PHASE2_PLAN ranks 19/58; rank 33 stays
        # HUMAN-SOURCE): the additive honest `.coverage_note` records the measured collation —
        # 0 of 4 source-content fields are verbatim in the claimed witness X86n1598; three have
        # no run of 8 or more graphs in it and the fourth (70 graphs) shares one 12-graph
        # fragment, while the measurable relatives are 壇經 recension fragments (T48n2008,
        # T48n2007). The Dunhuang manuscript P.3018 named by `cbeta_id` is out of CBETA, so
        # acquiring it is human OUT-OF-CBETA sourcing (Ruling 4), not agent work. Only the note
        # changes: no `zh`/`*_zh` field, no `title_zh` (composite-title metadata flag), no
        # `cbeta_id` (ID-corrected), and no `zh_chars` pointer (this document declares none).
        ".coverage_note",
    }),
    "data/corpus/dahui_shobogenzo.json": frozenset({
        # 2026-09-14 LABEL fix (task 010 bundle 2, PHASE2_PLAN ranks 17/41/60): the additive
        # honest `.coverage_note` records the measured collation — 0 of 4 source-content fields
        # are verbatim in the claimed witness X67n1309: two are carried by it only as
        # non-verbatim runs (21/40 @74,756 and 35/37 @7,536, DIVERGENT at 0.973), one has no
        # source in the claimed work and only a 9/56 run in the older 景德傳燈錄 T51n2076
        # @142,146, and the fourth (47 graphs) has no run of 8 or more graphs in any of the 39
        # pinned refs. Only the note changes: no `zh`/`*_zh` field, no `title_zh` (composite-title
        # metadata flag), no `cbeta_id` (ID-correct), and no `zh_chars` pointer (this document
        # declares none).
        ".coverage_note",
    }),
    "data/corpus/dazhu_huihai.json": frozenset({
        # 2026-09-14 LABEL fix (task 011 bundle 3, PHASE2_PLAN ranks 16/37/61): the additive
        # honest `.coverage_note` records the measured collation — 0 of 6 source-content fields
        # are verbatim in either claimed witness (X63n1223, X63n1224); two fields (s1.d0, s1.d1)
        # have no run of 8 or more graphs in all 39 refs, X63n1223 listed first contributes zero
        # runs, and the best carrier is T51n2076 (44/54 @58,336 for s0.d1). Project retellings
        # are retained. Only the note changes: no `zh`/`*_zh` field, no `title_zh` (composite-title
        # metadata flag), no `cbeta_id` (ID-correct), and no `zh_chars` pointer (this document
        # declares none).
        ".coverage_note",
    }),
    "data/corpus/deshan_yulu.json": frozenset({
        # 2026-09-14 LABEL fix (task 011 bundle 3, PHASE2_PLAN ranks 29/62): the additive honest
        # `.coverage_note` records the measured collation — 0 of 6 content fields match the
        # claimed T51n2076 phrasing (which carries nothing measurable), while the honest carriers
        # are the probes X80n1565 (five fields' runs) and X68n1315 (two fields). Retellings are
        # retained with the primary witness assignment disclosed as wrong. Only the note changes:
        # no `zh`/`*_zh` field, no `title_zh` (composite-title metadata flag), no `cbeta_id`, and
        # no `zh_chars` pointer (this document declares none).
        ".coverage_note",
    }),
    "data/corpus/foyan_qingyuan.json": frozenset({
        # 2026-09-14 LABEL fix (task 012 bundle 4, PHASE2_PLAN ranks 12/40/63): the additive
        # honest `.coverage_note` records the measured collation — 0 of 6 source-content fields
        # collate; four fields have no run of 8 or more graphs in any of the 39 pinned refs,
        # and the one substantial run (27/48) is double-carried by the claimed X68n1315 @4,284
        # and the older T51n2076 @87,323 (variant 迴/迥), the passage circulating in four works.
        # Project retellings are retained. Only the note changes: no `zh`/`*_zh` field, no
        # `title_zh` (composite-title metadata flag), no `cbeta_id` (ID-correct), and no
        # `zh_chars` pointer (this document declares none).
        ".coverage_note",
    }),
    "data/corpus/guiyang_yulu.json": frozenset({
        # 2026-09-14 LABEL fix (task 012 bundle 4, PHASE2_PLAN ranks 8/56): the additive honest
        # `.coverage_note` records the measured collation — 0 of 6 content fields are verbatim
        # in T47n1989/T47n1990 or in any of the 39 pinned refs (every field has zero
        # sixteen-graph windows in every ref), and the title's 九十六圓相 claim names content
        # the document does not carry (the witnesses merely mention 圓相 2x/3x). Retellings are
        # retained. Only the note changes: no `zh`/`*_zh` field, no `title_zh` (composite-title
        # metadata flag), no `cbeta_id`, and no `zh_chars` pointer (this document declares none).
        ".coverage_note",
    }),
    "data/corpus/huangbo_chuanxin.json": frozenset({
        # 2026-09-16 R-A re-key (task 021, PHASE2_PLAN rank 24 — RE-KEY 7 of 10): the two DIVERGENT
        # content fields that T48n2012A carries at a distance are re-keyed grapheme-for-grapheme
        # to the pinned CBETA witness T48n2012A 黃檗山斷際禪師傳心法要 (upstream dbdea41071e1,
        # refs 39 verified / 0 drift): `.sections[0].dialogue[1].zh` 不可度量 → 不可測度 and
        # `.sections[3].dialogue[0].zh` trailing 也 removed (即是佛也 → 即是佛), each allowlisted
        # with its rewritten sibling pinyin. The MINOR field (蹤跡 vs witness 縱跡) is left
        # untouched per REMEDIATION_PLAN §1. Six NOT_FOUND fields stay as labelled R-B retellings
        # (five have zero eight-graph windows in all 39 refs; s1.d0 is a splice whose 即心是佛
        # tail is not T48n2012A), each with an additive `editorial_note`. The document collates
        # 4/11 content fields instead of 2/11. This document declares no `zh_chars`, so no
        # `zh_chars` pointer is allowlisted for it.
        ".coverage_note",
        ".sections[0].dialogue[1].pinyin",
        ".sections[0].dialogue[1].zh",
        ".sections[1].dialogue[0].editorial_note",
        ".sections[2].dialogue[0].editorial_note",
        ".sections[3].dialogue[0].pinyin",
        ".sections[3].dialogue[0].zh",
        ".sections[5].dialogue[0].editorial_note",
        ".sections[7].dialogue[0].editorial_note",
        ".sections[8].dialogue[0].editorial_note",
        ".sections[9].dialogue[0].editorial_note",
    }),
    "data/corpus/huangbo_wanling.json": frozenset({
        # 2026-09-14 LABEL fix (task 012 bundle 4, PHASE2_PLAN ranks 10/47): the additive honest
        # `.coverage_note` records the measured collation — 0 of 7 in the claimed T48n2012B and
        # 0 of 7 in all 39 pinned refs (the 裴休/壁上畫像 and 噇酒糟漢 material is retold, not
        # quoted); the record names the 宛陵錄 as its witness but only one unit carries a note,
        # and until now no coverage_note stated that nothing is verbatim. Retellings are
        # retained. Only the note changes: no `zh`/`*_zh` field, no `title_zh` (composite-title
        # metadata flag), no `cbeta_id`, and no `zh_chars` pointer (this document declares none).
        ".coverage_note",
    }),
    "data/corpus/lidai_fabao_ji.json": frozenset({
        # 2026-09-14 LABEL fix (task 013 bundle 5, PHASE2_PLAN ranks 21/34): the additive honest
        # `.coverage_note` records the measured collation — 0 of 3 source-content fields collate:
        # field 1 condenses two witness runs (20 graphs of 53, at T51n2075@8,796 and @8,808),
        # and fields 2–3 share no run of 8 or more graphs with any of the 39 pinned refs. The
        # P.2125 named via `cbeta_id` is outside CBETA (the Dunhuang manuscript), so real sourcing
        # stays the human queue's (PHASE2_PLAN rule 2 — no agent fetch); the note says so, and the
        # project retellings are retained. Only the note changes: no `zh`/`*_zh` field, no
        # `title_zh` (composite-title metadata flag), no `cbeta_id`, and no `zh_chars` pointer
        # (this document declares none).
        ".coverage_note",
    }),
    "data/corpus/nanquan_yulu.json": frozenset({
        # 2026-09-14 LABEL fix (task 013 bundle 5, PHASE2_PLAN ranks 18/38/64): the additive
        # honest `.coverage_note` records the measured collation — 0 of 6 source-content fields
        # collate; the largest contiguous run is 23 graphs of 27, s1.d0 (19 graphs) has no run
        # of 8 or more graphs in any of the 39 pinned refs, three fields match the 傳燈錄 at
        # least as well as the claimed compendium, and s2.d0's windows all also sit in T47n1997.
        # The wording is fragmentary, parts are carried by other records, and the project
        # retellings are retained. Only the note changes: no `zh`/`*_zh` field, no `title_zh`
        # (composite-title metadata flag), no `cbeta_id` (the 2026-08-08 correction stands), and
        # no `zh_chars` pointer (this document declares none).
        ".coverage_note",
    }),
    "data/corpus/qinggui_monastic_codes.json": frozenset({
        # 2026-09-14 LABEL fix (task 013 bundle 5, PHASE2_PLAN ranks 22/48): the additive honest
        # `.coverage_note` records the measured collation — 0 of 5 source-content fields collate
        # in either claimed 清規 (T48n2025 敕修百丈清規, X63n1245 禪苑清規) or any of the 39
        # pinned refs; the document is a composite citing the two codes with no note saying which
        # field comes from which, and the only measured fragments are 百丈's 一日不作一日不食
        # (at T48n2025@10,064) and the 坐禪儀 passage 36/52 (in X63n1245@25,973). Project
        # retellings are retained. Only the note changes: no `zh`/`*_zh` field, no `title_zh`
        # (composite-title metadata flag), no `cbeta_id` (both IDs name the works they cite),
        # and no `zh_chars` pointer (this document declares none).
        ".coverage_note",
    }),
    "data/corpus/shitou_sandokai.json": frozenset({
        # 2026-09-17 R-A re-key (task 024, PHASE2_PLAN rank 51 — RE-KEY 10 of 10, final RE-KEY):
        # all 11 content fields now collate EXACT to claimed witness T51n2076 (景德傳燈錄卷三十).
        # Previously 6/11 collated (4 DIVERGENT at 0.93-0.97 in 參同契, 1 NOT_FOUND in 草庵歌).
        # The 4 DIVERGENT Sandokai stanzas were re-keyed grapheme-for-grapheme to T51n2076@347,446:
        # stanza 6 鹹酢→鹹醋, stanza 7 相睹…相睹→相遇…相覩, stanza 8 各有功→自有功,
        # stanza 10 山川→山河, with sibling pinyin rewritten to match.
        # Section 1 草庵歌 (previously an unattested 42-graph paraphrase 吾結草庵無箇事…
        # returning 0 hits at k≥12 in all 39 refs) was re-keyed to the witness's authentic opening
        # at T51n2076@350,849 (吾結草庵無寶貝，飯了從容圖睡快。成時初見茆草新，破後還將茆草蓋。),
        # with sibling pinyin and reconstruction translations updated against the new Chinese.
        # Additive honest .coverage_note records the 11/11 measurement.
        ".coverage_note",
        ".sections[0].stanzas[5].pinyin",
        ".sections[0].stanzas[5].zh",
        ".sections[0].stanzas[6].pinyin",
        ".sections[0].stanzas[6].zh",
        ".sections[0].stanzas[7].pinyin",
        ".sections[0].stanzas[7].zh",
        ".sections[0].stanzas[9].pinyin",
        ".sections[0].stanzas[9].zh",
        ".sections[1].stanzas[0].pinyin",
        ".sections[1].stanzas[0].translations.cleary.text",
        ".sections[1].stanzas[0].translations.red_pine.text",
        ".sections[1].stanzas[0].translations.sasaki.text",
        ".sections[1].stanzas[0].zh",
    }),
    "data/corpus/wudeng_huiyuan.json": frozenset({
        # 2026-09-16 LABEL fix (task 014 bundle 6, PHASE2_PLAN ranks 15/30/65): the additive
        # honest `.coverage_note` records the measured collation — 0 of 3 source-content fields
        # collate; s0.d0 (59 graphs) has no measured source in any of the 39 pinned refs, and
        # the measured carrier of the two 六祖 fields is the uncited 壇經 T48n2008 (18/40 at
        # @4,914; 35/67 at @4,952), not the claimed compendium X80n1565 (0/40 and 12/67). The
        # only prior note was the volume correction, and the project retellings are retained.
        # Only the note changes: no `zh`/`*_zh` field, no `title_zh` (synthesis-title metadata
        # flag), no `cbeta_id` (the ID names the compendium it cites), and no `zh_chars`
        # pointer (this document declares none).
        ".coverage_note",
    }),
    "data/corpus/xuansha_yulu.json": frozenset({
        # 2026-09-16 LABEL fix (task 014 bundle 6, PHASE2_PLAN ranks 13/39/66): the additive
        # honest `.coverage_note` records the measured collation — 0 of 5 source-content fields
        # collate; s2.d0 (72 graphs) has no run of 8 or more graphs in any of the 39 pinned
        # refs, X73n1445 carries only one 10-graph run across the five fields, and for three
        # fields the 傳燈錄 stratum equals or exceeds X73n1446. The cbeta_note is ID-correct
        # but states no coverage of the effectively unused X73n1445, and the project retellings
        # are retained. Only the note changes: no `zh`/`*_zh` field, no `title_zh`, no
        # `cbeta_id` (the 2026-08-08 correction stands), and no `zh_chars` pointer (this
        # document declares none).
        ".coverage_note",
    }),
    "data/corpus/xuefeng_yantou.json": frozenset({
        # 2026-09-16 LABEL fix (task 014 bundle 6, PHASE2_PLAN ranks 14/32/67): the additive
        # honest `.coverage_note` records the measured collation — 0 of 4 source-content fields
        # collate; s0.d0 (80 graphs) has no run of 8 or more graphs in any of the 39 pinned
        # refs (largest run anywhere is 21/49), and the `cbeta_id` claim of 景德傳燈錄 卷16
        # (T51n2076) as a witness is unmet — the project's wording has no ≥8-graph run in
        # T51n2076. The cbeta_note is ID-correct but states no coverage of the unmet claim,
        # and the project retellings are retained. Only the note changes: no `zh`/`*_zh`
        # field, no `title_zh`, no `cbeta_id` (the 2026-08-08 correction stands), and no
        # `zh_chars` pointer (this document declares none).
        ".coverage_note",
    }),
}


def run_git(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["git", "-C", str(ROOT), *args], capture_output=True, text=True)


def base_object_available() -> bool:
    return run_git("cat-file", "-e", f"{BASE_COMMIT}^{{commit}}").returncode == 0


def ensure_base_commit() -> str | None:
    """Return a usable base ref, fetching the pinned commit when the clone is shallow."""
    if base_object_available():
        return BASE_COMMIT
    # GitHub (and most servers) serve full reachable SHAs even from a shallow clone.
    result = run_git("fetch", "--depth", "1", "origin", BASE_COMMIT)
    if result.returncode != 0 or not base_object_available():
        return None
    return BASE_COMMIT


def base_file_listing(base_ref: str) -> set[str] | None:
    result = run_git("ls-tree", "--name-only", "-r", base_ref, "--", "data/corpus")
    if result.returncode != 0:
        return None
    return {line for line in result.stdout.splitlines() if line.endswith(".json")}


def base_file_bytes(base_ref: str, rel_path: str) -> bytes | None:
    result = run_git("show", f"{base_ref}:{rel_path}")
    if result.returncode != 0:
        return None
    return result.stdout.encode("utf-8")


def json_pointer(path_parts: list[str | int]) -> str:
    out = ""
    for part in path_parts:
        if isinstance(part, int):
            out += f"[{part}]"
        else:
            out += f".{part}"
    return out or "(root)"


def deep_diff(base: Any, current: Any, parts: list[str | int], out: list[str]) -> None:
    """Collect dotted/bracketed paths where base and current differ (structure or value)."""
    if type(base) is not type(current):
        out.append(json_pointer(parts))
        return
    if isinstance(base, dict):
        for key in sorted(set(base) | set(current), key=str):
            if key not in base or key not in current:
                out.append(json_pointer(parts + [key]))
            else:
                deep_diff(base[key], current[key], parts + [key], out)
    elif isinstance(base, list):
        for index in range(max(len(base), len(current))):
            if index >= len(base) or index >= len(current):
                out.append(json_pointer(parts + [index]))
            else:
                deep_diff(base[index], current[index], parts + [index], out)
    else:
        if base != current:
            out.append(json_pointer(parts))


def classify_changes(rel: str, diffs: list[str]) -> tuple[list[str], list[str]]:
    """Split one file's changed JSON pointers into (permitted, unauthorized).

    Membership is exact-pointer membership in `ALLOWED_CHANGES`. Matching the leaf key name
    instead is what used to let `data/corpus/wumenguan.json.cases[0].coverage_note` through:
    the same final key is a permitted disclosure at the document root and an unauthorized
    corpus edit anywhere below it.
    """
    allowed = ALLOWED_CHANGES.get(rel, frozenset())
    permitted = [pointer for pointer in diffs if pointer in allowed]
    unauthorized = [pointer for pointer in diffs if pointer not in allowed]
    return permitted, unauthorized


def focused_allowlist_regression() -> list[str]:
    """Prove the allowlist is exact: a nested `coverage_note` change must fail, by exact path.

    Two levels, both on throwaway copies — the repository's corpus files are never touched:

    * the classifier the real comparison uses, on a synthetic nested change, must report
      `.cases[0].coverage_note` as unauthorized and permit nothing;
    * the script itself, run in a temporary copy of the tree with a nested
      `cases[0].coverage_note` added to `data/corpus/wumenguan.json`, must exit nonzero and
      name that exact pointer, while the same copy unmutated must exit zero.
    """
    problems: list[str] = []

    base_doc = {"coverage_note": "before", "cases": [{"coverage_note": "case note", "zh": "一二三四"}]}
    nested_doc = {"coverage_note": "before", "cases": [{"coverage_note": "reworded", "zh": "一二三四"}]}
    diffs: list[str] = []
    deep_diff(base_doc, nested_doc, [], diffs)
    permitted, unauthorized = classify_changes("data/corpus/wumenguan.json", diffs)
    if permitted:
        problems.append(f"nested coverage_note change was permitted: {permitted}")
    if ".cases[0].coverage_note" not in unauthorized:
        problems.append("nested coverage_note change did not report the exact path "
                        f".cases[0].coverage_note (reported: {unauthorized or 'nothing'})")
    for rel in sorted(ALLOWED_CHANGES):
        permitted, unauthorized = classify_changes(rel, list(ALLOWED_CHANGES[rel]))
        if sorted(permitted) != sorted(ALLOWED_CHANGES[rel]) or unauthorized:
            problems.append(f"{rel}: an ALLOWED_CHANGES pointer was not recognised as permitted")
        permitted, unauthorized = classify_changes(rel, [".cases[0].coverage_note"])
        if permitted or ".cases[0].coverage_note" not in unauthorized:
            problems.append(f"{rel}: nested coverage_note change was not reported as unauthorized")

    sandbox = Path(tempfile.mkdtemp(prefix="preservation-nested-"))
    try:
        # Only what the comparison reads: the git objects (for the pinned base), the script,
        # the corpus, and the deploy mirror.
        for piece in (".git", "scripts", "data/corpus", "docs/data/corpus"):
            source = ROOT / piece
            if not source.exists():
                return problems + [f"nested-path regression: cannot copy {piece} into the temporary tree"]
            shutil.copytree(source, sandbox / piece, symlinks=True,
                            ignore=shutil.ignore_patterns("__pycache__", ".pytest_cache"))

        def run_in_sandbox() -> subprocess.CompletedProcess[str]:
            # NESTED_REGRESSION_MARKER tells the copied script it is the subject of this check:
            # without it the copy would copy and run itself again, forever. The marker is only
            # ever set here, so a normal run (and CI) always executes the full regression.
            env = dict(os.environ, **{NESTED_REGRESSION_MARKER: "1"})
            return subprocess.run([sys.executable, str(sandbox / "scripts" / "test_source_preservation.py")],
                                  cwd=sandbox, capture_output=True, text=True, timeout=600, env=env)

        clean = run_in_sandbox()
        if clean.returncode != 0:
            problems.append("the temporary copy fails before any mutation, so it cannot prove "
                            f"the nested change is what fails: {clean.stdout[-400:]}{clean.stderr[-400:]}")

        mutated = sandbox / "data" / "corpus" / "wumenguan.json"
        document = json.loads(mutated.read_text(encoding="utf-8"))
        document["cases"][0]["coverage_note"] = "unauthorized nested note"
        mutated.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        result = run_in_sandbox()
        output = result.stdout + result.stderr
        if result.returncode == 0:
            problems.append("nested coverage_note change passed the temporary-copy run")
        if ".cases[0].coverage_note" not in output:
            problems.append("nested coverage_note failure did not name the exact path "
                            ".cases[0].coverage_note in a temporary copy of the tree")
        if "0 unauthorized changes" in output:
            problems.append("nested coverage_note change was counted as authorized")
        print(f"Focused allowlist regression: unmutated copy exit={clean.returncode}, "
              f"nested coverage_note rejected (exit={result.returncode}) with the exact path reported")
    finally:
        shutil.rmtree(sandbox, ignore_errors=True)
    return problems


def main() -> int:
    if os.environ.get(NESTED_REGRESSION_MARKER):
        failures: list[str] = []
        print("nested-regression copy: focused self-test skipped, corpus comparison still enforced")
    else:
        failures = [f"focused allowlist regression: {line}" for line in focused_allowlist_regression()]
    changes: dict[str, dict[str, list[str]]] = {}

    base_ref = ensure_base_commit()
    if base_ref is None:
        print(f"🔴 source preservation FAILED: base commit {BASE_COMMIT} is not present in the clone "
              "and could not be fetched from origin; the corpus cannot be checked against its base. "
              "A missing base is a failure, not a skip — the base is an explicit commit, not a fixture.")
        return 1

    base_files = base_file_listing(base_ref)
    if base_files is None:
        print(f"🔴 source preservation FAILED: cannot list data/corpus at base commit {BASE_COMMIT}")
        return 1

    current_files = {f"data/corpus/{path.name}" for path in CORPUS_DIR.glob("*.json")}
    for rel in sorted(base_files - current_files):
        failures.append(f"corpus file {rel} exists at the base commit but is missing from the working tree "
                        "(corpus files are never deleted by W1 work)")
    for rel in sorted(current_files - base_files):
        if rel in DECLARED_NEW_CORPUS:
            print(f"  ℹ️  {rel}: declared new document — {DECLARED_NEW_CORPUS[rel]}")
            continue
        failures.append(f"corpus file {rel} is new since the base commit "
                        "(corpus expansion is out of scope for W1 work)")

    for rel in sorted(base_files & current_files):
        base_bytes = base_file_bytes(base_ref, rel)
        if base_bytes is None:
            failures.append(f"cannot read {rel} at base commit {BASE_COMMIT}")
            continue
        current_bytes = (CORPUS_DIR / Path(rel).name).read_bytes()
        if base_bytes == current_bytes:
            continue
        try:
            base_doc = json.loads(base_bytes.decode("utf-8"))
            current_doc = json.loads(current_bytes.decode("utf-8"))
        except json.JSONDecodeError as exc:
            failures.append(f"{rel} is no longer valid JSON: {exc}")
            continue
        diffs: list[str] = []
        deep_diff(base_doc, current_doc, [], diffs)
        if not diffs:
            # Same JSON, different bytes: formatting was touched. Allow nothing.
            failures.append(f"{rel}: whitespace/formatting differs from the base commit")
            continue
        permitted, unauthorized = classify_changes(rel, diffs)
        changes[rel] = {"permitted": permitted, "unauthorized": unauthorized}
        for pointer in unauthorized:
            failures.append(
                f"{rel}{pointer} differs from base commit {BASE_COMMIT[:12]} "
                f"(base: {json_get(base_doc, pointer)!r}, now: {json_get(current_doc, pointer)!r}); "
                "only the declared coverage_note fields may change, and no source-Chinese field may"
            )
    for rel in sorted(changes):
        permitted = changes[rel]["permitted"]
        if permitted:
            print(f"  ℹ️  {rel}: permitted allowlisted change: {', '.join(permitted)}")

    # The docs/ mirror is part of the shipped bundle: it must not drift from the
    # working corpus either.
    for path in sorted(CORPUS_DIR.glob("*.json")):
        mirror = DOCS_CORPUS_DIR / path.name
        if not mirror.is_file():
            failures.append(f"docs/data/corpus/{path.name} is missing from the deploy mirror")
            continue
        if mirror.read_bytes() != path.read_bytes():
            failures.append(f"docs/data/corpus/{path.name} differs from data/corpus/{path.name}; "
                            "rebuild with scripts/build_data_bundle.py")

    compared = len(base_files & current_files)
    permitted_total = sum(len(changes[rel]["permitted"]) for rel in changes)
    unauthorized_total = sum(len(changes[rel]["unauthorized"]) for rel in changes)
    declared_new = sorted(current_files - base_files & set(current_files))
    print(f"{compared} corpus files compared")
    if declared_new:
        print(f"{len(declared_new)} declared new corpus file(s): {', '.join(declared_new)}")
    print(f"{permitted_total} permitted allowlisted changes")
    print(f"{unauthorized_total} unauthorized changes")

    if failures:
        print(f"🔴 source preservation FAILED: {len(failures)} problem(s):")
        for line in failures:
            print(f"  ❌ {line}")
        return 1

    print(f"✅ SOURCE-PRESERVATION OK: {compared} corpus files match base commit "
          f"{BASE_COMMIT[:12]} ({BASE_COMMIT}) apart from the allowlisted remediation pointers; "
          "0 unauthorized changes")
    return 0


def json_get(doc: Any, pointer: str) -> Any:
    """The value at `pointer`, or a readable placeholder when the pointer is absent.

    An added key (a pointer present in one version only) must produce a report, not a
    traceback: the failure message is the thing that tells a reviewer which path moved.
    """
    node = doc
    rest = pointer.lstrip(".")
    try:
        while rest:
            if rest.startswith("["):
                index = int(rest[1:rest.index("]")])
                rest = rest[rest.index("]") + 1:].lstrip(".")
                node = node[index]
            else:
                dot = rest.find(".")
                bracket = rest.find("[")
                end = min(x for x in (dot, bracket, len(rest)) if x != -1)
                key = rest[:end]
                rest = rest[end:]
                node = node[key]
    except (KeyError, IndexError, TypeError):
        return "<absent in this version>"
    return node


if __name__ == "__main__":
    raise SystemExit(main())
