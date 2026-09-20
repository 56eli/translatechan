#!/usr/bin/env python3
"""Deterministic corpus-vs-CBETA collation harness (W1 audit, 2026-09-09).

Collates every source-Chinese field of data/corpus/*.json against extracted
reference text from the official CBETA XML P5 edition (github.com/cbeta-org/xml-p5)
and classifies each field:

  EXACT            normalized field text found verbatim in the claimed witness
  REWORDED         found after unambiguous dialogue-marker neutralization (yuē<->yun)
  MINOR            >= 0.98 window similarity (edition-graphic residue)
  DIVERGENT        0.85..0.98 (rewrite-suspect; human adjudication needed)
  NOT_FOUND        < 0.85 (fabrication-suspect)
  TITLE_COMPOSITE  leading title substring matches; remainder is project-appended
  SHORT_UNMATCHED  <= 6 CJK chars, not contained (manual review)
  WITNESS_UNAVAILABLE  claimed witness text not present in the local reference set

Reference extraction (from CBETA XML P5) — implemented by `scripts/collate_refs.py`:
  text of //text/body, dropping the <note> and <g> subtrees (tails kept), keeping
  <head>; then NFKC + graphic-variant map + CJK-only filter.
A register is authoritative evidence only when its `reference_verification` block says
which digest manifest the refs were checked against and which refs matched byte-for-byte.
The 2026-09-09 run predates that: `sessions/COLLATION_W1_2026-09-20_CORRECTION.md`
records what reproduces and what drifted (superseding the 2026-09-10 record it inherits its 35
per-document entries from), and `sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json` is the
authoritative record.
Acquisition (git protocol; raw CDN may be blocked in sandboxes):

    git clone --filter=blob:none --no-checkout --depth 1 \
        https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
    cd /tmp/xmlp5
    cd /tmp/xmlp5
    # check out exactly the works this harness needs (paths are /<letter>/<dir>/<work>.xml)
    sed 's/.*  ref_//; s/\.txt$//' /repo/sessions/COLLATION_W1_2026-09-20_refs_manifest.txt \
        | while read -r w; do printf '/%s/%s/%s.xml\n' "${w:0:1}" "${w:0:3}" "$w"; done > /tmp/paths.txt
    git sparse-checkout set --no-cone $(tr '\n' ' ' < /tmp/paths.txt) && git checkout

    # extract them with the committed rule (same directory as $REFS_DIR below)
    python3 scripts/collate_refs.py --source-dir /tmp/xmlp5 --out-dir /tmp/refs \
        --work-list sessions/COLLATION_W1_2026-09-20_refs_manifest.txt \
        --verify-against sessions/COLLATION_W1_2026-09-20_refs_manifest.txt
    # and re-check the published digests against the refs on disk (no checkout needed):
    python3 scripts/collate_refs.py --verify-against \
        sessions/COLLATION_W1_2026-09-20_refs_manifest.txt --refs-dir /tmp/refs

Reference digests for verification: sessions/COLLATION_W1_2026-09-20_refs_manifest.txt
(authoritative for the 40 works the current harness reads; the 2026-09-09 manifest is kept as the
historical anchor for all 187 works and is where upstream drift is measured)
Evidence reports: sessions/COLLATION_W1_2026-09-09.md (historical) and
sessions/COLLATION_W1_2026-09-20_CORRECTION.md (authoritative)

Usage:
    COLLATION_REFS=/path/to/refs python3 scripts/collate_corpus.py [--doc KEY] [--out FILE]

Authoritative correction run (hash-verified refs, explicit date, aggregate block):

    COLLATION_REFS=/tmp/refs python3 scripts/collate_corpus.py \
        --out sessions/COLLATION_REGISTER_2026-09-20_CORRECTION.json \
        --generated 2026-09-20 \
        --refs-manifest sessions/COLLATION_W1_2026-09-20_refs_manifest.txt \
        --corrects sessions/COLLATION_REGISTER_2026-09-09.json \
        --compare-historical-refs sessions/COLLATION_W1_2026-09-09_refs_manifest.txt \
        --compare-register sessions/COLLATION_REGISTER_2026-09-09.json \
        --historical-report-flagged 637 --kind w1-correction --upstream-revision dbdea41071e1e260ad84b72faefd4587333cf76d \
        --new-document congronglu --require-verified-refs
"""
import argparse, datetime, hashlib, json, os, re, sys, unicodedata
from collections import Counter
from difflib import SequenceMatcher

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import collate_refs  # noqa: E402 - deterministic reference extraction + digest verification
import source_review  # noqa: E402 - shared status semantics (validator/runtime use the same module)

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORPUS_DIR = os.path.join(REPO, 'data', 'corpus')

# Conservative graphic-variant map (applied identically to both sides).
# 像/象 and 敘 intentionally NOT mapped (distinct lexemes).
VARIANT = {'説': '說', '爲': '為', '麽': '麼', '敎': '教', '廻': '迴', '龎': '龐',
           '裡': '裏', '峯': '峰', '畧': '略', '眞': '真', '歎': '嘆', '懽': '歡',
           '庒': '莊', '麄': '麤', '囘': '回', '囬': '回', '牀': '床', '缽': '鉢',
           '旣': '既', '飮': '飲', '氷': '冰', '尽': '盡', '却': '卻', '沉': '沈',
           '麁': '粗', '疎': '疏', '啓': '啟', '惛': '昏', '窓': '窗', '强': '強',
           '栢': '柏', '谿': '溪', '圜': '圓'}

# Advisory-only simplified-character flag list (not a classification input).
SIMPLIFIED = set('无说为么与东两严临举义乐习乡书买乱争亏从优会传众伤断诗诚话误说请诸谈谢贝贞负货贯贵费资赛赏赵趋踪轨转辑辞迁达违运还这进远迹适选逊递逻遗邮邻郑释针钱铁银错长门开问闲间闻阅队际陆陈险随隐难类风飞饭饮马骑体仅价们俭债倾偿储儿军农冲决况冻净准减凑凭凯击划刘则刚创删别剑剥剧劝办务动励劲劳势勋医华协单卖占卢卫厂厅历厉压厌县参双变叙叠叶号叹后吓吕吗团围国图圆园币师帐帘帜带席帮广庄庆庐库应庙庞废异弃张弥弯弹强归当录彻径忆忧怀怜态总恶恺恻恼恳悬悯惊惧惨惩惫惬惭惮惯愈愿慑恋灭灯灵点炼烂烦烧热爱牵犹猪猎猫献盖盗盘眠睁确让议讯记讲许论设访证评识诉词译试调谁谬谱读课账贸赌赐')


def cjk_only(s):
    return ''.join(ch for ch in s if '\u3400' <= ch <= '\u9fff' or '\uf900' <= ch <= '\ufaff')


def norm(s, lenient=False):
    s = unicodedata.normalize('NFKC', s)
    s = ''.join(VARIANT.get(ch, ch) for ch in s)
    s = cjk_only(s)
    if lenient:
        s = s.replace('曰', '云')
    return s


def simplified_in(s):
    s = unicodedata.normalize('NFKC', s)
    return sorted(set(ch for ch in s if ch in SIMPLIFIED))


class Ref:
    __slots__ = ('name', 't', 't_len', 'idx')

    def __init__(self, name, raw):
        self.name = name
        self.t = norm(raw)
        self.t_len = self.t.replace('曰', '云')
        self.idx = {}
        for i in range(len(self.t) - 8):
            self.idx.setdefault(self.t[i:i + 8], []).append(i)

    def anchors(self, f):
        votes = Counter()
        L = len(f)
        step = max(1, (L - 7) // 14)
        for off in range(0, L - 7, step):
            for p in self.idx.get(f[off:off + 8], ()):
                votes[p - off] += 1
        return [c for c, _ in votes.most_common(6)]


def classify(refs, raw):
    f = norm(raw)
    L = len(f)
    if L == 0:
        return ('EMPTY', 0.0, None, '')
    for r in refs:
        p = r.t.find(f)
        if p >= 0:
            return ('EXACT', 1.0, r.name, r.t[p:p + min(L, 72)])
    fl = norm(raw, lenient=True)
    if fl != f:
        for r in refs:
            p = r.t_len.find(fl)
            if p >= 0:
                return ('REWORDED', 1.0, r.name, r.t[p:p + min(L, 72)])
    if L <= 6:
        best, bn, bw = 0.0, None, ''
        for r in refs:
            start = 0
            while True:
                p = r.t.find(f[:3], start)
                if p < 0:
                    break
                w = r.t[max(0, p - 4):p + L + 4]
                sm = SequenceMatcher(None, f, w, autojunk=False).ratio()
                if sm > best:
                    best, bn, bw = sm, r.name, w
                start = p + 1
        cls = 'MINOR' if best >= 0.98 else ('DIVERGENT' if best >= 0.85 else 'SHORT_UNMATCHED')
        return (cls, round(best, 4), bn, bw)
    best = (0.0, None, '')
    for r in refs:
        for cand in r.anchors(f):
            if cand < 0 or cand + L > len(r.t):
                continue
            w = r.t[cand:cand + L]
            ratio = SequenceMatcher(None, f, w, autojunk=False).ratio()
            if ratio > best[0]:
                best = (ratio, r.name, w)
    ratio, rname, w = best
    if ratio >= 0.98:
        cls = 'MINOR'
    elif ratio >= 0.85:
        cls = 'DIVERGENT'
    else:
        cls = 'NOT_FOUND'
    return (cls, round(ratio, 4), rname, w)


def classify_title(refs, raw):
    cls, sim, rname, w = classify(refs, raw)
    if cls in ('EXACT', 'REWORDED', 'MINOR', 'DIVERGENT'):
        return (cls, sim, rname, w)
    f = norm(raw)
    for r in refs:
        for cut in range(len(f), 3, -1):
            p = r.t.find(f[:cut])
            if p >= 0:
                return ('TITLE_COMPOSITE', round(cut / len(f), 2), r.name,
                        r.t[p:p + cut] + ' | remainder:' + f[cut:])
    return (cls, sim, rname, w)


SRC_KEYS = {'zh', 'verse_zh', 'commentary_zh', 'pointer_zh', 'title_zh', 'name_zh'}

# Fixed class order so a regenerated register is byte-deterministic. The vocabulary lives in
# `source_review.COLLATION_CLASSES` (the validator enforces the same tuple), so a class cannot
# be produced here and simultaneously be unknown to the evidence validator.
SUMMARY_ORDER = source_review.COLLATION_CLASSES


def iter_fields(obj, path=''):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from iter_fields(v, f'{path}.{k}')
    elif isinstance(obj, list):
        for i, el in enumerate(obj):
            yield from iter_fields(el, f'{path}[{i}]')
    elif isinstance(obj, str):
        key = path.split('.')[-1].split('[')[0]
        if key in SRC_KEYS and any('\u3400' <= c <= '\u9fff' for c in obj):
            tail = '.'.join(path.split('.')[-2:])
            if not any(sp in tail for sp in ('speaker', 'author')):
                yield path, obj


# document -> (claimed witness refs, extra probe refs)
DOCS = {
    # 2026-09-20 (task 043): Congrong Lu reinstated from the pinned T48n2004 witness —
    # 100/100 cases collating, 0 flagged. The work id has no reproducible 2026-09-09
    # reference anchor, so its reference is verified against the authoritative manifest
    # only and that drift is declared via --new-document (see the 2026-09-20 overlay).
    'congronglu': (['T48n2004'], []),
    # 2026-09-20 (task 045): full 30-fascicle Jingde Chuandeng Lu from the pinned T51n2076
    # witness (sibling of the `chuandenglu` excerpt record). 1,274 units (971 biography
    # entries, 69 titled works, 234 sections) tiling all 350,269 CJK characters of the
    # 30 fascicles verbatim. T51n2076 carries the same digest in the 2026-09-09 and the
    # 2026-09-20 manifests, so its reference has a verified historical anchor; the
    # document itself is new to the evidence record and declared via --new-document.
    'chuandenglu_full': (['T51n2076'], []),
    'wumenguan': (['T48n2005'], []),
    'xinxin_ming': (['T48n2010'], []),
    'biyanlu_cases': (['T48n2003'], []),
    'linji_yulu': (['T47n1985'], ['X68n1315', 'T51n2076', 'X80n1565']),
    'platform_sutra': (['T48n2008', 'T48n2007'], []),
    'huangbo_chuanxin': (['T48n2012A'], []),
    'huangbo_wanling': (['T48n2012B'], []),
    'zhaozhou_yulu': (['T47n1987A', 'T47n1987B'], ['X68n1315']),
    'baojing_sanmei': (['T47n1986A', 'T47n1986B'], []),
    'dongshan_yulu': (['T47n1986A', 'T47n1986B'], []),
    'yunmen_yulu': (['T47n1988'], []),
    'fayan_yulu': (['T47n1991'], []),
    'guiyang_yulu': (['T47n1989', 'T47n1990'], []),
    'dahui_hongzhi': (['T47n1998A', 'T47n1998B', 'T48n2001'], []),
    'zhengdao_ge': (['T48n2014'], []),
    # Added 2026-09-10: the 2026-09-09 run omitted this document even though the
    # corpus claims `embedded: T2076 f.30 / X1565 f.14`. Both texts are claimed by
    # the corpus record (`cbeta_id` = 'embedded: T2076 f.30 / X1565 f.14'), so both
    # are collated as claimed witnesses (Jingde Chuandeng lu T51n2076 and Wudeng
    # huiyuan X80n1565) rather than one being demoted to a probe.
    'shitou_sandokai': (['T51n2076', 'X80n1565'], []),
    'bodhidharma_erru': (['T48n2009'], []),
    'qinggui_monastic_codes': (['T48n2025', 'X63n1245'], []),
    # 2026-09-16 (task 018, PHASE2_PLAN rank 36): X80n1565 was a probe and T48n2001 was
    # not cited at all, but a probe only annotates `also_in` and never contributes to
    # `content_fields_collated`, so the attribution rank 36 found could not be measured.
    # Measured on the digest-verified refs (39 verified / 0 drift at dbdea41071e1): the
    # selection's six content fields are carried by three different works, none of which
    # carries all six — T51n2076 carries 一曰圖作佛 whole; X80n1565 carries the 磨磚 and
    # 西江水 exchanges (offsets 58424 and 83122); T48n2001 alone carries the 龐居士問馬祖
    # question whole (17/17 graphs at offset 66315), which no other reference carries.
    # All three are therefore claimed witnesses rather than one being demoted to a probe,
    # in the shitou_sandokai pattern. All three are already in the 39-work refs manifest
    # (lines 14, 26, 38), so the reference allowlist is unchanged as a set.
    'chuandenglu': (['T51n2076', 'T48n2001', 'X80n1565'], []),
    'sengzhao_zhaolun': (['T45n1858'], []),
    'lidai_fabao_ji': (['T51n2075'], []),
    'dazhu_huihai': (['X63n1223', 'X63n1224'], []),
    'baizhang_guanglu': (['X69n1323', 'X68n1315'], []),
    'foyan_qingyuan': (['X68n1315'], []),
    'dahui_shobogenzo': (['X67n1309'], []),
    # 2026-09-16 (task 022, PHASE2_PLAN ranks 5 / 11 / 35 — RE-KEY 8 of 10): T51n2076 carries
    # one content field of this selection whole and the record did not cite it, while the
    # claimed X69n1321 carries nothing of it. A probe only annotates `also_in` and never
    # contributes to `content_fields_collated`, so the ranking finding could not be measured;
    # T51n2076 is therefore a claimed witness (shitou_sandokai / chuandenglu pattern). Measured
    # on the digest-verified refs (39 verified / 0 drift at dbdea41071e1): 僧問和尚為什麼說即心即佛…
    # 師云非心非佛 is T51n2076 @57,513 verbatim (32/32) and absent from X69n1321; the same chapter
    # (卷六 江西道一禪師) carries the fuller 謂眾曰…此心即是佛心 reading @57,259; the other six
    # content fields were re-keyed to X69n1321. Both works are already in the 39-work refs
    # manifest, so the reference allowlist is unchanged as a set.
    'mazu_yulu': (['X69n1321', 'T51n2076'], []),
    'nanquan_yulu': (['X68n1315'], []),
    'deshan_yulu': (['T51n2076'], ['X68n1315', 'X80n1565']),
    'xuefeng_yantou': (['X69n1333', 'T51n2076'], []),
    'wudeng_huiyuan': (['X80n1565'], []),
    'xuansha_yulu': (['X73n1445', 'X73n1446'], []),
    'caoxi_zhuan': (['X86n1598'], []),
    'yuanwu_letters': (['T47n1997', 'X69n1357'], []),
    'hanshan_poems': ([], []),
    'niutou_juezhu': ([], []),
}

WITNESS_NOTES = {
    'zhaozhou_yulu': 'Corpus claims T1987; T1987 is the Caoshan record (misattribution). True Zhaozhou witness: Guzunsu yulu X68n1315.',
    'dahui_hongzhi': 'Hongzhi\'s Mozhaoming lives in T2001 Hongzhi guanglu, not claimed T1998A.',
    'platform_sutra': 'Content mixes Dunhuang (T2007) and Zongbao (T2008) recension readings.',
    'linji_yulu': 'Sections 67-73 are Xinglu-tradition retellings, not claimed T1985 text.',
    'deshan_yulu': 'Retellings; 0/6 content fields match T2076/X68n1315/X1565 phrasing.',
    'shitou_sandokai': ('Both claimed witnesses were fetched and collated. Sandokai content fields '
                        'collate 6/11 (6 EXACT against the T51n2076 embedding, 4 DIVERGENT at '
                        '0.93-0.97, 1 NOT_FOUND: the 草庵歌 body, absent from T51n2076 and X80n1565 '
                        'alike), and the combined document title is a project composite. Witness '
                        'supported, collation partial — neither complete nor witness-unavailable.'),
}


def relpath(path):
    """Repo-relative POSIX path for a CLI argument that may be None."""
    if not path:
        return None
    return os.path.relpath(path, REPO).replace(os.sep, '/')


def digest_status(name, digest, expected, manifest_path):
    """`verified` / `drift` / `unlisted`, or `none` when no manifest was supplied.

    `unlisted` (the manifest never names the work) is deliberately distinct from `drift`
    (the manifest names it with different bytes): only drift is evidence that the
    reference layer moved underneath the collation.
    """
    if not manifest_path:
        return 'none'
    want = expected.get(name)
    if want is None:
        return 'unlisted'
    return 'verified' if want == digest else 'drift'


def ref_digest(path):
    with open(path, 'rb') as fh:
        return hashlib.sha256(fh.read()).hexdigest()


SUMMARY_ORDER = source_review.COLLATION_CLASSES


def document_entry(doc, claimed, probes, d, refs, probe_refs):
    """Classify every source field of one document and derive its W1 status.

    Titles (`title_zh`/`name_zh`) are measured but excluded from the content
    denominator, so `collated_to_claimed_witness` never claims metadata was collated.
    """
    fields, stats = [], Counter()
    content_stats, metadata_stats = Counter(), Counter()
    for path, raw in iter_fields(d):
        is_title = path.split('.')[-1] in ('title_zh', 'name_zh')
        if not claimed:
            cls, sim, rname, w = ('WITNESS_UNAVAILABLE', 0.0, None, '')
        elif is_title:
            cls, sim, rname, w = classify_title(refs, raw)
        else:
            cls, sim, rname, w = classify(refs, raw)
        stats[cls] += 1
        (metadata_stats if is_title else content_stats)[cls] += 1
        record = {'path': path, 'class': cls, 'sim': sim, 'ref': rname,
                  'corpus': norm(raw)[:120], 'ref_window': (w or '')[:120],
                  'simplified': simplified_in(raw)}
        if cls in ('NOT_FOUND', 'DIVERGENT', 'SHORT_UNMATCHED') and probe_refs:
            hit = next((pr.name for pr in probe_refs if pr.t.find(norm(raw)) >= 0), None)
            record['also_in'] = hit
            fields.append(record)
        elif cls not in ('EXACT', 'EMPTY'):
            fields.append(record)
    entry = {
        'witness': claimed,
        'probes': probes,
        'summary': {k: stats[k] for k in SUMMARY_ORDER if stats[k]},
        'content_summary': {k: content_stats[k] for k in SUMMARY_ORDER if content_stats[k]},
        'metadata_summary': {k: metadata_stats[k] for k in SUMMARY_ORDER if metadata_stats[k]},
        'fields_total': sum(stats.values()),
        'content_fields_total': sum(content_stats.values()),
        'content_fields_collated': sum(content_stats[k] for k in source_review.COLLATED_CLASSES),
        'metadata_fields_total': sum(metadata_stats.values()),
        'flagged': fields,
    }
    entry['source_review_status'] = source_review.derive_status(entry)
    if doc in WITNESS_NOTES:
        entry['witness_note'] = WITNESS_NOTES[doc]
    return entry


# Fields that carry the collation verdict. `probes`, `simplified` and the per-reference
# digests are advisory/metadata: how they are recorded changed between harness versions,
# so they are deliberately excluded from cross-run agreement (the docstring of
# `simplified_in` already states it is not a classification input).
CLASSIFICATION_FIELDS = ('witness', 'summary', 'fields_total')
CLASSIFICATION_FLAG_FIELDS = ('path', 'class', 'sim', 'ref', 'also_in')


def normalize_entry(entry):
    """Canonical JSON of the classification-bearing parts of a register entry."""
    payload = {k: entry.get(k) for k in CLASSIFICATION_FIELDS}
    payload['flagged'] = [
        {k: flag.get(k) for k in CLASSIFICATION_FLAG_FIELDS if flag.get(k) is not None}
        for flag in (entry.get('flagged') or [])
    ]
    return json.dumps(payload, ensure_ascii=False, sort_keys=True)


def reproduce(documents, compare_register, historical_report_flagged=None, notes=None):
    """Reconcile this run against an earlier evidence register, difference by difference.

    Agreement is reported per document; a document whose *derived status* moved is called
    out separately, because that is the only kind of difference that changes what the
    project may claim publicly.
    """
    with open(compare_register, encoding='utf-8') as fh:
        earlier = json.load(fh)['documents']
    compared = sorted(set(earlier) & set(documents))
    identical, differences = 0, []
    for key in compared:
        before, after = earlier[key], documents[key]
        if normalize_entry(before) == normalize_entry(after):
            identical += 1
            continue
        flag_paths = lambda entry: sorted(f'{f["path"]}:{f["class"]}' for f in entry.get('flagged') or [])
        only_here = set(flag_paths(after)) - set(flag_paths(before))
        only_there = set(flag_paths(before)) - set(flag_paths(after))
        keep = ('path', 'class', 'sim', 'ref', 'corpus', 'ref_window', 'also_in')
        detail = lambda entry, paths: [
            {k: v for k, v in flag.items() if k in keep}
            for flag in entry.get('flagged') or [] if f'{flag["path"]}:{flag["class"]}' in paths
        ]
        before_status = before.get('source_review_status') or source_review.derive_status(before)
        after_status = after.get('source_review_status') or source_review.derive_status(after)
        differences.append({
            'key': key,
            'historical_summary': before.get('summary'),
            'corrected_summary': after.get('summary'),
            'historical_flagged_entries': len(before.get('flagged') or []),
            'corrected_flagged_entries': len(after.get('flagged') or []),
            'flags_only_in_historical': sorted(only_there),
            'flags_only_in_this_run': sorted(only_here),
            'flag_details_only_in_historical': detail(before, only_there),
            'flag_details_only_in_this_run': detail(after, only_here),
            'status_changed': before_status != after_status,
            'historical_source_review_status': before_status,
            'corrected_source_review_status': after_status,
        })
    block = {
        'compared_register': os.path.relpath(compare_register, REPO).replace(os.sep, '/'),
        'documents_compared': len(compared),
        'documents_classification_identical': identical,
        'documents_differing': len(differences),
        'documents_with_changed_status': sum(1 for d in differences if d['status_changed']),
        'flagged_entries': {
            'historical': source_review.flagged_total({k: earlier[k] for k in compared}),
            'this_run': source_review.flagged_total({k: documents[k] for k in compared}),
        },
        'differences': differences,
        'operator_notes': notes or [],
        'notes': [
            'Field classes are computed from the reference text plus the harness variant map; '
            'a difference can come from the reference layer or from harness normalization, and '
            'each one is listed above rather than folded into a total.',
        ],
    }
    if historical_report_flagged is not None:
        block['historical_report_flagged_total'] = historical_report_flagged
        block['historical_report_flagged_reproduced'] = (
            historical_report_flagged == block['flagged_entries']['historical']
        )
        if block['historical_report_flagged_reproduced'] is False:
            block['historical_report_flagged_status'] = (
                f'superseded: the earlier report claimed {historical_report_flagged} flagged '
                f'entries, its own committed register sums to '
                f'{block["flagged_entries"]["historical"]}, and this run sums to '
                f'{block["flagged_entries"]["this_run"]}'
            )
    return block


# Generation parameters that define a register's identity. They are recorded verbatim in the register's
# `generation_parameters` block, so `--reproduce` can replay an evidence run byte-for-byte instead of a
# reviewer re-typing a flag list (and silently getting a different denominator or gate).
REPLAYED_FLAGS = {
    'kind': '--kind',
    'generated': '--generated',
    'corrects': '--corrects',
    'refs_manifest': '--refs-manifest',
    'compare_historical_refs': '--compare-historical-refs',
    'compare_register': '--compare-register',
    'historical_report_flagged': '--historical-report-flagged',
    'upstream_repo': '--upstream-repo',
    'upstream_revision': '--upstream-revision',
    'note': '--note',
    'doc': '--doc',
    'new_documents': '--new-document',
}

#: Replayed like the flags above, but recorded by `load_generation_parameters` rather than read
#: straight out of the params map: the strict reference gate is part of the run's identity, so
#: typing it alongside `--reproduce` is a conflict too.
REPLAYED_GATE_FLAGS = {'require_verified_refs': '--require-verified-refs'}

#: Every option a register can record, keyed by the internal name the CLI normalization produces.
REPLAYABLE_FLAGS = {**REPLAYED_FLAGS, **REPLAYED_GATE_FLAGS}

#: Operational options that stay under the operator's control during a replay. They are not part
#: of the register's identity — where the reference checkout lives, where output goes, what to
#: print, and the replay switch itself — so `--reproduce` may be combined with them.
REPLAY_OPERATIONAL_FLAGS = frozenset({'refs_dir', 'out', 'print_refs', 'reproduce'})


def cli_option_names(argv):
    """Option names present in `argv`, normalized for comparison on both sides.

    `--generated 1999-01-01` and `--generated=1999-01-01` are the same option, and the old
    comparison normalized neither side, so the equals form slipped past the conflict check and
    replayed with a re-typed date. Names are reduced to their internal spelling (`--a-b` ->
    `a_b`) so the CLI form and the register key cannot disagree about whether a flag was given.
    """
    names = set()
    for token in argv:
        if not token.startswith('--'):
            continue
        name = token.split('=', 1)[0].lstrip('-').replace('-', '_')
        if name:
            names.add(name)
    return names


def _abs_recorded(value):
    """Recorded paths are repo-relative; make them usable again from any working directory."""
    if not value:
        return value
    return value if os.path.isabs(value) else os.path.join(REPO, value)


def load_generation_parameters(path: str) -> dict:
    try:
        with open(path, encoding='utf-8') as fh:
            register = json.load(fh)
    except OSError as exc:
        raise SystemExit(f'--reproduce: cannot read {path}: {exc}')
    except json.JSONDecodeError as exc:
        raise SystemExit(f'--reproduce: {path} is not valid JSON: {exc}')
    params = register.get('generation_parameters')
    if not isinstance(params, dict) or not params:
        raise SystemExit(
            f'--reproduce: {path} records no generation_parameters block, so it cannot be replayed. '
            'Registers written before that block existed must be reproduced with the explicit flags '
            'listed in sessions/COLLATION_W1_2026-09-10_CORRECTION.md.'
        )
    replayed = {name: params[name] for name in REPLAYED_FLAGS if name in params}
    for key in ('corrects', 'refs_manifest', 'compare_historical_refs', 'compare_register'):
        if replayed.get(key):
            replayed[key] = _abs_recorded(replayed[key])
    if 'note' in replayed:
        replayed['note'] = list(replayed['note'] or [])
    if not replayed.get('doc'):
        replayed.pop('doc', None)
    # The strict reference gate is part of the run, not an opinion: honour what the register recorded.
    replayed['require_verified_refs'] = bool(params.get('require_verified_refs'))
    return replayed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--refs-dir', default=os.environ.get('COLLATION_REFS'))
    ap.add_argument('--doc', action='append', default=None,
                    help='limit to one document key (repeatable); default: every DOCS key')
    ap.add_argument('--out', default=None)
    ap.add_argument('--generated', default=None,
                    help='declared evidence date (YYYY-MM-DD) written into the register; required '
                         'for a committed evidence record so the file is byte-reproducible')
    ap.add_argument('--refs-manifest', default=os.environ.get('COLLATION_REFS_MANIFEST') or None,
                    help='digest manifest the reference texts must match; defaults to '
                         'sessions/COLLATION_W1_2026-09-09_refs_manifest.txt when it exists')
    ap.add_argument('--compare-historical-refs', default=None,
                    help='earlier digest manifest to report byte-identity against. Drift is recorded '
                         'per reference and per document, never hidden, and it never changes a class.')
    ap.add_argument('--new-document', dest='new_documents', action='append', default=[], metavar='KEY',
                    help='document key this overlay adds to the evidence for the first time (no '
                         'evidence record in the historical register). Such a document cannot have a '
                         'historical reference anchor, so its historical state is still recorded '
                         'truthfully (drift/unlisted/none) but does not by itself veto a collated '
                         'claim; the waiver is listed in generation_parameters.new_documents so the '
                         'register declares it instead of implying it.')
    ap.add_argument('--require-verified-refs', action='store_true',
                    help='fail when any claimed-witness reference is not byte-identical to --refs-manifest')
    ap.add_argument('--compare-register', default=None,
                    help='earlier evidence register to reconcile against; per-document agreement and '
                         'every difference are recorded in the output register')
    ap.add_argument('--historical-report-flagged', type=int, default=None,
                    help='flagged-entry total claimed by the earlier human-readable report, recorded '
                         'for reconciliation (a claim this run cannot reproduce is labelled superseded)')
    ap.add_argument('--corrects', default=None,
                    help='path of the evidence record this register corrects or extends (recorded verbatim; '
                         'the original stays append-only and is never rewritten)')
    ap.add_argument('--kind', default='collation-register',
                    help='what this register is, e.g. `w1-correction` for a dated corrective overlay')
    ap.add_argument('--note', action='append', default=[],
                    help='operator annotation recorded verbatim in the reproduction block (repeatable); '
                         'explains a difference instead of editing the register afterwards')
    ap.add_argument('--upstream-repo', default=collate_refs.UPSTREAM_REPO)
    ap.add_argument('--upstream-revision', default=None,
                    help='pinned CBETA XML P5 revision the references were extracted from')
    ap.add_argument('--reproduce', default=None, metavar='REGISTER.json',
                    help='replay the `generation_parameters` block recorded in an existing register, so the '
                         'documented reproduction is one command instead of a re-typed flag list (the refs '
                         'directory still comes from --refs-dir/COLLATION_REFS)')
    ap.add_argument('--print-refs', action='store_true',
                    help='print the sorted work ids this harness needs, one per line, and exit '
                         '(the input for scripts/collate_refs.py --work-list)')
    args = ap.parse_args()
    if args.reproduce:
        replayed = load_generation_parameters(args.reproduce)
        given = cli_option_names(sys.argv[1:]) - set(REPLAY_OPERATIONAL_FLAGS)
        # Only options the register actually records are conflicts: a flag its generation_parameters
        # block has nothing to say about is not part of the identity being replayed. The gate is
        # recorded by `load_generation_parameters` on every replay, so it is always replayable.
        supplied = {name: value for name, value in REPLAYED_FLAGS.items() if name in replayed}
        supplied.update(REPLAYED_GATE_FLAGS)
        conflicts = sorted(name for name in given if name in supplied)
        if conflicts:
            # Rejecting here, before `--refs-dir` is required, keeps the failure about the
            # command the operator typed rather than about a missing 21 MB checkout.
            flags = ', '.join(supplied[name] for name in conflicts)
            sys.exit(f'--reproduce already supplies {flags} from {args.reproduce}; drop {flags} or drop '
                     '--reproduce — a replayed flag list must not silently disagree with the register '
                     'it reproduces')
        # The register records absence as well as presence: a replayed identity that the register
        # never recorded cannot be reproduced from it, so say so instead of quietly folding a
        # different run into a command that claims to replay the register.
        unrecorded = sorted(name for name in given if name not in supplied and name in REPLAYABLE_FLAGS)
        if unrecorded:
            flags = ', '.join(REPLAYABLE_FLAGS[name] for name in unrecorded)
            print(f'warning: --reproduce does not replay {flags}: {args.reproduce} records no value for '
                  f'{flags}, so the replayed run is no longer identical to the register it names',
                  file=sys.stderr)
        for name, value in replayed.items():
            setattr(args, name, value)
    if args.print_refs:
        selected = args.doc if args.doc else sorted(DOCS)
        for doc in selected:
            if doc not in DOCS:
                sys.exit(f'unknown document key {doc!r}')
        needed = sorted({name for doc in selected for name in DOCS[doc][0] + list(DOCS[doc][1])})
        print('\n'.join(needed))
        return 0
    if not args.refs_dir:
        sys.exit('Set --refs-dir or COLLATION_REFS to the extracted reference directory.')
    if not args.generated:
        sys.exit('--generated YYYY-MM-DD is required: an evidence register must declare its date '
                 'instead of inheriting the clock (that is what made the 2026-09-09 records '
                 'impossible to re-derive).')
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', args.generated):
        sys.exit(f'--generated must be YYYY-MM-DD, got {args.generated!r}')
    if args.refs_manifest is None:
        candidate = os.path.join(REPO, 'sessions', 'COLLATION_W1_2026-09-09_refs_manifest.txt')
        args.refs_manifest = candidate if os.path.isfile(candidate) else None

    expected_digests = (
        collate_refs.read_digest_manifest(args.refs_manifest) if args.refs_manifest else {}
    )
    historical_digests = (
        collate_refs.read_digest_manifest(args.compare_historical_refs)
        if args.compare_historical_refs else {}
    )
    verification = {}
    cache = {}

    def ref(name):
        if name not in cache:
            path = os.path.join(args.refs_dir, f'ref_{name}.txt')
            with open(path, encoding='utf-8') as fh:
                cache[name] = Ref(name, fh.read())
            if args.refs_manifest or args.compare_historical_refs:
                digest = ref_digest(path)
                verification[name] = {
                    'sha256': digest,
                    'manifest': relpath(args.refs_manifest),
                    'status': digest_status(name, digest, expected_digests, args.refs_manifest),
                    'historical_manifest': relpath(args.compare_historical_refs),
                    'historical_status': digest_status(name, digest, historical_digests,
                                                        args.compare_historical_refs),
                }
        return cache[name]

    docs = args.doc if args.doc else sorted(DOCS)
    out = {
        'kind': args.kind,
        'generated': args.generated,
        'harness': 'scripts/collate_corpus.py',
        'corrects': relpath(args.corrects) if args.corrects else None,
        'reference_extraction': {'generator': 'scripts/collate_refs.py',
                                 'rule_id': collate_refs.RULE_ID,
                                 'rule': collate_refs.EXTRACTION_RULE},
        'upstream': {'repo': args.upstream_repo, 'revision': args.upstream_revision or 'unrecorded'},
        'refs_manifest': relpath(args.refs_manifest),
        'historical_refs_manifest': relpath(args.compare_historical_refs),
        # What to replay, recorded in the evidence itself: a register that cannot be re-derived is a
        # receipt, not evidence. Paths are stored repo-relative so the block survives a different
        # checkout location; the refs directory deliberately is not recorded (it is a 21 MB external
        # checkout, identified instead by the digest manifest above).
        'generation_parameters': {
            **{
                name: (relpath(getattr(args, name)) if name in ('corrects', 'refs_manifest',
                                                                 'compare_historical_refs', 'compare_register')
                       and getattr(args, name) else getattr(args, name))
                for name in REPLAYED_FLAGS
                if name != 'upstream_repo' and getattr(args, name) not in (None, [], 'collation-register')
            },
            'kind': args.kind,
            'upstream_repo': args.upstream_repo,
            'require_verified_refs': bool(args.require_verified_refs),
            'refs_dir_provided': bool(args.refs_dir),
            # Declared, not implied: the documents this overlay adds to the evidence with no
            # historical evidence record, whose historical reference anchor is therefore empty.
            'new_documents': sorted(set(args.new_documents or [])),
        },
        'content_denominator': 'source content fields only ('
                               + ', '.join(sorted(source_review.CONTENT_SOURCE_FIELDS))
                               + '); metadata fields ('
                               + ', '.join(source_review.METADATA_SOURCE_FIELDS)
                               + ') are measured separately and are not proof of collation',
        'status_scope': source_review.STATUS_SCOPE,
        'documents': {},
    }
    failures = []
    for doc in docs:
        if doc not in DOCS:
            sys.exit(f'unknown document key {doc!r}: scripts/collate_corpus.py DOCS has no mapping. '
                     'A manifest item without a harness mapping is a containment gap, not evidence.')
        claimed, probes = DOCS[doc]
        with open(os.path.join(CORPUS_DIR, f'{doc}.json'), encoding='utf-8') as fh:
            d = json.load(fh)
        refs = [ref(n) for n in claimed]
        probe_refs = [ref(n) for n in probes]
        out['documents'][doc] = document_entry(doc, claimed, probes, d, refs, probe_refs)
        entry = out['documents'][doc]
        used = list(dict.fromkeys(claimed + list(probes)))
        if verification:
            entry['reference_verification'] = {
                name: {
                    'sha256': verification[name]['sha256'],
                    'status': verification[name]['status'],
                    'historical_status': verification[name]['historical_status'],
                }
                for name in used if name in verification
            }
            entry['refs_total'] = len(claimed)
            entry['refs_verified'] = sum(1 for name in claimed
                                        if verification.get(name, {}).get('status') == 'verified')
            entry['refs_historically_verified'] = sum(
                1 for name in claimed
                if verification.get(name, {}).get('historical_status') in ('verified', 'none'))
        if args.require_verified_refs and entry['source_review_status'] == source_review.COLLATED_STATUS:
            for name in claimed:
                seen = verification.get(name, {})
                for key, label in (('status', args.refs_manifest),
                                   ('historical_status', args.compare_historical_refs or 'no history')):
                    state = seen.get(key, 'unverified')
                    if state in ('verified', 'none'):
                        continue
                    if key == 'historical_status' and doc in set(args.new_documents):
                        # The historical pass predates this document's evidence record, so its
                        # reference cannot have a historical anchor. The state is still recorded —
                        # the entry carries it and the aggregate lists the document under
                        # documents_with_drifted_references — but it does not veto the claim, and
                        # the waiver is declared by --new-document and echoed into the register.
                        print(f'warning: {doc}: historical anchor for {name} is {state!r}; accepted '
                              f'because {doc} is declared new to this overlay (no historical evidence '
                              'record)', file=sys.stderr)
                        continue
                    failures.append(
                        f'{doc}: {state!r} claim rests on {name}, which is {state!r} against {label}; '
                        'a collated-to-witness claim requires byte-verified references')
        print(f"{doc:24s} {json.dumps(entry['summary'], ensure_ascii=False)} -> {entry['source_review_status']}")
    if failures:
        for line in failures:
            print(f'❌ {line}', file=sys.stderr)
        sys.exit(1)

    documents = out['documents']
    statuses = Counter(entry['source_review_status'] for entry in documents.values())
    out['reference_verification'] = {
        'manifest': out['refs_manifest'],
        'historical_manifest': out['historical_refs_manifest'],
        'rule': 'statuses are byte-identity of the reference file against a named digest '
                'manifest; `drift` never rescues a claim and never upgrades one',
        'counts': {key: sum(1 for v in verification.values() if v['status'] == key)
                   for key in ('verified', 'drift', 'unlisted', 'none')},
        'historical_counts': {key: sum(1 for v in verification.values()
                                       if v['historical_status'] == key)
                              for key in ('verified', 'drift', 'unlisted', 'none')},
        'drifted_refs': sorted(name for name, v in verification.items()
                               if 'drift' in (v['status'], v['historical_status'])),
        'refs': {name: verification[name] for name in sorted(verification)},
    }
    if args.compare_register:
        out['reproduction'] = reproduce(out['documents'], args.compare_register,
                                        args.historical_report_flagged, args.note)

    out['aggregate'] = {
        'documents': len(documents),
        'flagged_entries': source_review.flagged_total(documents),
        'fields_total': sum(e['fields_total'] for e in documents.values()),
        'content_fields_total': sum(e['content_fields_total'] for e in documents.values()),
        'content_fields_collated': sum(e['content_fields_collated'] for e in documents.values()),
        'metadata_fields_total': sum(e['metadata_fields_total'] for e in documents.values()),
        'class_totals': source_review.summary_flags(documents),
        'source_review_status_counts': {status: statuses.get(status, 0)
                                        for status in source_review.VALID_SOURCE_REVIEW_STATUSES},
        'documents_without_evidence': sorted(set(DOCS) - set(documents)),
        'documents_with_drifted_references': sorted(
            doc for doc, entry in documents.items()
            if entry.get('refs_total', 0) > entry.get('refs_verified', 0)
            or entry.get('refs_verified', 0) > entry.get('refs_historically_verified', 0)
        ),
    }
    print(f"aggregate: {json.dumps(out['aggregate'], ensure_ascii=False)}")
    if args.out:
        with open(args.out, 'w', encoding='utf-8') as fh:
            json.dump(out, fh, ensure_ascii=False, indent=1)
            fh.write('\n')
        print(f'register written: {args.out}')


if __name__ == '__main__':
    main()
