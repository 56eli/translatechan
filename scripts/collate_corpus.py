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

Reference extraction (from CBETA XML P5):
  text of //text/body, skipping <note> elements, keeping <head>;
  then NFKC + graphic-variant map + CJK-only filter.
Acquisition (git protocol; raw CDN may be blocked in sandboxes):

    git clone --filter=blob:none --no-checkout --depth 1 \
        https://github.com/cbeta-org/xml-p5 /tmp/xmlp5
    cd /tmp/xmlp5
    git sparse-checkout set --no-cone '/T/T45/*' '/T/T47/*' '/T/T48/*' '/T/T51/*' \
        '/X/X63/*' '/X/X67/*' '/X/X68/*' '/X/X69/*' '/X/X73/*' '/X/X80/*' '/X/X86/*'
    git checkout
    # then extract each needed work with scripts/extract logic (see report) into
    # $REFS_DIR/ref_<WorkId>.txt  (e.g. ref_T48n2005.txt)

Reference digests for verification: sessions/COLLATION_W1_2026-09-09_refs_manifest.txt
Evidence report: sessions/COLLATION_W1_2026-09-09.md

Usage:
    COLLATION_REFS=/path/to/refs python3 scripts/collate_corpus.py [--doc KEY] [--out FILE]
"""
import argparse, json, os, re, sys, unicodedata
from collections import Counter
from difflib import SequenceMatcher

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
    'bodhidharma_erru': (['T48n2009'], []),
    'qinggui_monastic_codes': (['T48n2025', 'X63n1245'], []),
    'chuandenglu': (['T51n2076'], ['X80n1565']),
    'sengzhao_zhaolun': (['T45n1858'], []),
    'lidai_fabao_ji': (['T51n2075'], []),
    'dazhu_huihai': (['X63n1223', 'X63n1224'], []),
    'baizhang_guanglu': (['X69n1323', 'X68n1315'], []),
    'foyan_qingyuan': (['X68n1315'], []),
    'dahui_shobogenzo': (['X67n1309'], []),
    'mazu_yulu': (['X69n1321'], []),
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
    'deshan_yulu': 'Retellings; 0/6 content fields match T2076/X1315/X1565 phrasing.',
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--refs-dir', default=os.environ.get('COLLATION_REFS'))
    ap.add_argument('--doc', default=None)
    ap.add_argument('--out', default=None)
    args = ap.parse_args()
    if not args.refs_dir:
        sys.exit('Set --refs-dir or COLLATION_REFS to the extracted reference directory.')

    cache = {}

    def ref(name):
        if name not in cache:
            path = os.path.join(args.refs_dir, f'ref_{name}.txt')
            with open(path, encoding='utf-8') as fh:
                cache[name] = Ref(name, fh.read())
        return cache[name]

    docs = [args.doc] if args.doc else sorted(DOCS)
    out = {'harness': 'scripts/collate_corpus.py', 'documents': {}}
    for doc in docs:
        claimed, probes = DOCS[doc]
        with open(os.path.join(CORPUS_DIR, f'{doc}.json'), encoding='utf-8') as fh:
            d = json.load(fh)
        refs = [ref(n) for n in claimed]
        probe_refs = [ref(n) for n in probes]
        fields, stats = [], Counter()
        for path, raw in iter_fields(d):
            is_title = path.split('.')[-1] in ('title_zh', 'name_zh')
            if not claimed:
                cls, sim, rname, w = ('WITNESS_UNAVAILABLE', 0.0, None, '')
            elif is_title:
                cls, sim, rname, w = classify_title(refs, raw)
            else:
                cls, sim, rname, w = classify(refs, raw)
            stats[cls] += 1
            if cls in ('NOT_FOUND', 'DIVERGENT', 'SHORT_UNMATCHED') and probe_refs:
                hit = next((pr.name for pr in probe_refs if pr.t.find(norm(raw)) >= 0), None)
                fields.append({'path': path, 'class': cls, 'sim': sim, 'ref': rname,
                               'also_in': hit, 'corpus': norm(raw)[:120],
                               'ref_window': (w or '')[:120], 'simplified': simplified_in(raw)})
            elif cls not in ('EXACT', 'EMPTY'):
                fields.append({'path': path, 'class': cls, 'sim': sim, 'ref': rname,
                               'corpus': norm(raw)[:120], 'ref_window': (w or '')[:120],
                               'simplified': simplified_in(raw)})
        entry = {'witness': claimed,
                 'summary': {k: stats[k] for k in ('EXACT', 'REWORDED', 'MINOR', 'DIVERGENT',
                                                   'NOT_FOUND', 'TITLE_COMPOSITE',
                                                   'SHORT_UNMATCHED', 'WITNESS_UNAVAILABLE',
                                                   'EMPTY') if stats[k]},
                 'fields_total': sum(stats.values()), 'flagged': fields}
        if doc in WITNESS_NOTES:
            entry['witness_note'] = WITNESS_NOTES[doc]
        out['documents'][doc] = entry
        print(f"{doc:24s} {json.dumps(entry['summary'], ensure_ascii=False)}")
    if args.out:
        with open(args.out, 'w', encoding='utf-8') as fh:
            json.dump(out, fh, ensure_ascii=False, indent=1)
        print(f"register written: {args.out}")


if __name__ == '__main__':
    main()
