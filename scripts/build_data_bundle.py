#!/usr/bin/env python3
"""
TranslateChan Data Bundler
Combines all canonical texts, lineage graphs, glossaries, comparative translations,
and gong'an indices into a consolidated, high-speed dataset for client-side execution.
"""

import json
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_FILE = BASE_DIR / "app_data.js"

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def main():
    print("Bundling TranslateChan Classical Corpus...")

    data_bundle = {
        "glossary": load_json(DATA_DIR / "glossary" / "chan_terms.json"),
        "lineage": load_json(DATA_DIR / "lineage" / "masters.json"),
        "translations_matrix": load_json(DATA_DIR / "translations" / "comparative_matrix.json"),
        "gongan_index": load_json(DATA_DIR / "gongan" / "gongan_index.json"),
        "corpus": {
            "wumenguan": load_json(DATA_DIR / "corpus" / "wumenguan.json"),
            "linji_yulu": load_json(DATA_DIR / "corpus" / "linji_yulu.json"),
            "huangbo_chuanxin": load_json(DATA_DIR / "corpus" / "huangbo_chuanxin.json"),
            "zhaozhou_yulu": load_json(DATA_DIR / "corpus" / "zhaozhou_yulu.json"),
            "xinxin_ming": load_json(DATA_DIR / "corpus" / "xinxin_ming.json"),
            "baojing_sanmei": load_json(DATA_DIR / "corpus" / "baojing_sanmei.json"),
            "biyanlu_cases": load_json(DATA_DIR / "corpus" / "biyanlu_cases.json"),
            "platform_sutra": load_json(DATA_DIR / "corpus" / "platform_sutra.json"),
            "chuandenglu": load_json(DATA_DIR / "corpus" / "chuandenglu.json"),
            "qinggui_monastic_codes": load_json(DATA_DIR / "corpus" / "qinggui_monastic_codes.json"),
            "dongshan_yulu": load_json(DATA_DIR / "corpus" / "dongshan_yulu.json"),
            "yunmen_yulu": load_json(DATA_DIR / "corpus" / "yunmen_yulu.json")
        },
        "meta": {
            "version": "1.0.0",
            "project": "TranslateChan",
            "license": "CC-BY-SA 4.0 / MIT",
            "cbeta_sources": ["T47", "T48", "T51", "X-Series"]
        }
    }

    js_content = f"// Auto-generated TranslateChan Master Corpus Bundle\nwindow.TRANSLATECHAN_DATA = {json.dumps(data_bundle, ensure_ascii=False, indent=2)};\n"

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"✅ Successfully compiled bundle to {OUTPUT_FILE} ({os.path.getsize(OUTPUT_FILE):,} bytes)")

if __name__ == "__main__":
    main()
