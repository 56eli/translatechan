#!/usr/bin/env python3
"""Offline batch-1 evidence gate; optionally replay against the digest-pinned XML.

python3 scripts/test_lineage_batch1.py [--xml /path/to/T51n2076.xml]
No network, no writes. XML apparatus is omitted, but its lb anchors still advance.
"""
import argparse
import copy
import hashlib
import json
from pathlib import Path
from xml.etree import ElementTree as ET

from collate_refs import cjk_only
from validate_data import Issues, validate_lineage_verification

ROOT = Path(__file__).resolve().parent.parent


def load(path):
    return json.loads((ROOT / path).read_text())


def witness_lines(path, digest):
    assert hashlib.sha256(path.read_bytes()).hexdigest() == digest, 'Witness digest drift'
    body = ET.parse(path).getroot().find('.//{http://www.tei-c.org/ns/1.0}body')
    lines = {}
    current = None

    def walk(node, skipped=False):
        nonlocal current
        tag = node.tag.split('}')[-1]
        skipped = skipped or tag in ('note', 'g')
        if tag == 'lb' and node.get('ed') == 'T':
            current = node.get('n')
            lines.setdefault(current, '')
        if current and node.text and not skipped:
            lines[current] += node.text
        for child in node:
            walk(child, skipped)
            if current and child.tail and not skipped:
                lines[current] += child.tail

    walk(body)
    return {key: ''.join(text.split()) for key, text in lines.items()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--xml', type=Path)
    args = parser.parse_args()
    evidence = load('sessions/P3_LINEAGE_BATCH1_2026-09-21_evidence.json')
    registry = load('data/lineage/lineage_verification.json')
    masters = load('data/lineage/masters.json')
    cases = {c['case_num']: c for c in load('data/corpus/chuandenglu_full.json')['cases']}
    edges = {(e['teacher'], e['disciple']): e for e in registry['edges']}
    assert len(evidence['edges']) == 10
    # Batch 1 remains a ten-edge evidence fixture even as later reviewed
    # witnesses add exact edges to the shared registry.
    assert sum(e['status'] == 'exact_locator_verified' and e['source_id'] == 'jingde-chuandenglu'
               for e in edges.values()) >= 10
    assert sum(e['status'] == 'exact_locator_verified' and e['source_id'] == 'guzunsu-yulu'
               for e in edges.values()) == 10
    lines = witness_lines(args.xml, evidence['sha256']) if args.xml else None
    for record in evidence['edges']:
        edge = edges[record['teacher'], record['disciple']]
        case = cases[record['case_num']]
        assert edge['status'] == 'exact_locator_verified'
        assert edge['source_id'] == 'jingde-chuandenglu'
        assert edge['reference'] == record['reference']
        assert record['quotation'] in edge['note']
        assert record['entry'] == case['title_zh'] and record['fascicle'] == case['fascicle']
        assert case['locator']['page_line'] <= record['start_lb'] <= record['end_lb'] <= case['locator']['case_close_line']
        assert cjk_only(record['quotation']) in ''.join(d['zh'] for d in case['dialogue'])
        if lines is not None:
            assert record['start_lb'] in lines and record['end_lb'] in lines
            actual = ''.join(text for lb, text in lines.items() if record['start_lb'] <= lb <= record['end_lb'])
            assert actual == record['quotation'], record['reference']
    profile = next(m for m in masters if m['id'] == 'prajnatara')
    assert profile['linked_corpus_keys'] == ['chuandenglu_full']
    assert '般若多羅' in cases[38]['title_zh']
    assert cases[38]['locator']['page_line'] == evidence['profile']['start_lb']
    assert cases[38]['locator']['case_close_line'] == evidence['profile']['end_lb']
    # Empty project-corpus links are allowed and explicitly surfaced by the UI;
    # the lineage registry, rather than this count, is the edge evidence gate.
    assert all(isinstance(m['linked_corpus_keys'], list) for m in masters)
    if lines is not None:
        assert '般若多羅者' in lines['0216a19']
    # Fail closed for new exact status without an ordered locator, source, or quote.
    for field, value in [('reference', 'T2076 locator pending'),
                         ('reference', 'T51n2076_p0240a28–p0240a23'),
                         ('source_id', 'platform-sutra'), ('note', 'No evidence')]:
        bad = copy.deepcopy(registry)
        bad['edges'][0][field] = value
        issues = Issues()
        validate_lineage_verification(masters, bad, issues)
        assert issues.errors, (field, value)
    print('✅ LINEAGE BATCH 1: original 10 exact T2076 edges retained; expanded registry validated; 4 negative checks passed')
    print('✅ Pinned XML: digest, lb ranges and verbatim quotations replayed' if lines is not None else
          'XML replay not requested; offline corpus/registry/evidence checks passed')


if __name__ == '__main__':
    main()
