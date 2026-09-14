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
* The allowlist is exercised by a focused regression on a temporary copy of the
  tree: a nested `coverage_note` change must exit nonzero and name the exact
  path. The repository's own corpus files are never modified by any check here.
* The set of corpus files must not grow or shrink.
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

#: Set only for the temporary copy that the nested-`coverage_note` regression runs: the copy
#: then performs the real comparison but not the regression that spawned it. Nothing else sets
#: it, so a normal run — including the smoke test — always runs the focused regression.
NESTED_REGRESSION_MARKER = "PRESERVATION_NESTED_REGRESSION"

#: The only corpus paths the W1 work may have touched: exact JSON pointers, per file. The
#: allowlist is the pointer itself, never the leaf key name — ``.cases[0].coverage_note`` in
#: any of the 48 Wumenguan cases is a *corpus content* change and must fail, even though its
#: final key is spelled the same as the two permitted root notes.
ALLOWED_CHANGES = {
    "data/corpus/biyanlu_cases.json": frozenset({
        # 2026-09-10 R-A re-key of the W1-flagged content fields to the T2003 witness (Wave 1,
        # document 2): each re-keyed source field and its rewritten sibling pinyin, the two additive
        # `editorial_note` R-B provenance labels (project-authored text moved out of a source field,
        # no witness attribution), the honest post-remediation `coverage_note`, and the recomputed
        # `zh_chars` total. No English/translation field and no title metadata may differ.
        ".cases[0].dialogue[2].pinyin",
        ".cases[0].dialogue[2].zh",
        ".cases[0].pointer_zh",
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
    "data/corpus/dongshan_yulu.json": frozenset({
        # 2026-09-12 CITATION fix (task 014, rank 4): the `coverage_note` cited X1321 — the Mazu
        # record (X69n1321) — as a witness of this document. Rewritten to name the witnesses the
        # harness actually pins (T47n1986A/T47n1986B, the 筠州/瑞州洞山 records) and to state the
        # measured 1/21 collation. Only the note changes: no source text, no `zh`/`*_zh` field, no
        # `cbeta_id` change, and no `zh_chars` pointer (this document declares none). The 14
        # `title_zh` metadata flags are untouched (composite-title plan item).
        ".coverage_note",
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
        ".coverage_note",
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
        ".cbeta_id",
        ".cbeta_note",
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
    print(f"{compared} corpus files compared")
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
