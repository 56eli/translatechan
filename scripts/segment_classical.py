#!/usr/bin/env python3
"""TranslateChan offline Classical Chinese sentence segmenter.

Splits raw Classical Chinese into sentence units on standard punctuation and
dialogue delimiters (。！？； 「」『』). Manual/offline input only: it does NOT
fetch from CBETA, generate pinyin, or map CBETA canonical IDs yet — those are
Phase-2 ingestion-tooling goals (see ROADMAP.md). Output is written next to the
input file as '<name>.segmented.json' when a file argument is given; with no
argument it prints a demo segmentation of a Linji passage.
"""

import sys
import json
import re
from pathlib import Path

def segment_classical_chinese(text: str):
    """
    Segments Classical Chinese into sentence units based on standard punctuation
    and dialogue delimiters (。, 「」, 『』, ：, ？, ！, ；).
    """
    sentences = []
    # Split while preserving delimiters
    raw_parts = re.split(r'([。！？；]+)', text)
    curr = ""
    for part in raw_parts:
        if not part:
            continue
        curr += part
        if re.match(r'^[。！？；]+$', part):
            cleaned = curr.strip()
            if cleaned:
                sentences.append(cleaned)
            curr = ""
    if curr.strip():
        sentences.append(curr.strip())
    return sentences

def extract_speakers(dialogue_text: str):
    """
    Identifies speaker patterns such as 師云, 師曰, 僧問, 州云, 帝曰 etc.
    """
    pattern = r'([^「『：]+)[：云曰]([「『].*?[」』]|.*)'
    matches = re.findall(pattern, dialogue_text)
    return matches

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/segment_classical.py <input_cbeta_txt_or_json>")
        print("Demo: Running sample segmentation on Linji Yulu passage...")
        sample_passage = "師示眾云：赤肉團上有一無位真人，常從諸人面門出入。未證據者看看！時有僧出問：如何是無位真人？師下禪床，把住云：道！道！僧擬議。師託開云：無位真人是什麼乾屎橛！便歸方丈。"
        segmented = segment_classical_chinese(sample_passage)
        print("\n--- Segmented Units ---")
        for idx, seg in enumerate(segmented, 1):
            print(f"[{idx}] {seg}")
        return

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"Error: {input_path} not found.")
        sys.exit(1)

    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    segmented = segment_classical_chinese(content)
    output = {
        "source_file": input_path.name,
        "segment_count": len(segmented),
        "segments": [{"id": i+1, "zh": s} for i, s in enumerate(segmented)]
    }

    out_file = input_path.with_suffix('.segmented.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(segmented)} segments to {out_file}")

if __name__ == "__main__":
    main()
