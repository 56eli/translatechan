#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

replacements = {
    "README.md": [
        ("**751,084 source-content CJK characters** (or 802,284 across every corpus JSON string", "**758,747 source-content CJK characters** (or 814,652 across every corpus JSON string"),
        ("manifest (12 keys)", "manifest (13 keys)"),
        ("48 / 48 cases represented; W1 source-review status: `partial_or_failed_w1_collation`", "48 / 48 cases represented; W1 source-review status: `collated_to_claimed_witness`"),
        ("`collated_to_claimed_witness`: **10**", "`collated_to_claimed_witness`: **11**"),
        ("**12 documents, 15 flagged source fields**", "**13 documents, 15 flagged source fields**"),
        ("sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json", "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json"),
        ("**22** provenance", "**23** provenance"),
        ("22 documents carry provenance", "23 documents carry provenance"),
        ("provenance labels in **22**", "provenance labels in **23**"),
        ("`cbeta_note` in 11", "`cbeta_note` in 12"),
        ("(cbeta_note in 11,", "(cbeta_note in 12,"),
        ("22 of 22", "23 of 23"),
    ],
    "HANDOFF.md": [
        ("corpus=12 | slots=46 | verified=1 | matrix=21 | locators=4044/4044", "corpus=13 | slots=46 | verified=1 | matrix=21 | locators=4092/4092"),
        ("source-review: collated=10 | partial/failed=0 | unavailable=2", "source-review: collated=11 | partial/failed=0 | unavailable=2"),
        ("**12 documents, 15 flagged source fields**", "**13 documents, 15 flagged source fields**"),
        ("sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json", "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json"),
        ("**22** provenance", "**23** provenance"),
        ("22 of 22", "23 of 23"),
        ("`cbeta_note` in 11", "`cbeta_note` in 12"),
    ],
    "AUDIT.md": [
        ("Source review: **10 collated**, **0 partial/failed**, **2 unavailable**", "Source review: **11 collated**, **0 partial/failed**, **2 unavailable**"),
        ("Corpus: **12 documents**", "Corpus: **13 documents**"),
        ("**751,084 content CJK / 802,284 all-string CJK**", "**758,747 content CJK / 814,652 all-string CJK**"),
        ("Locators: **4044/4044 case-level**; **3 document-level seeds**", "Locators: **4092/4092 case-level**; **3 document-level seeds**"),
        ("Wumenguan **48/48 cases** represented; W1 source-review status: `partial_or_failed_w1_collation`", "Wumenguan **48/48 cases** represented; W1 source-review status: `collated_to_claimed_witness`"),
        ("**12 documents, 15 flagged source fields**", "**13 documents, 15 flagged source fields**"),
        ("sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json", "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json"),
        ("**22** provenance", "**23** provenance"),
        ("22 of 22", "23 of 23"),
        ("`cbeta_note` 11", "`cbeta_note` 12"),
    ],
    "ROADMAP.md": [
        ("**12 documents, 15 flagged source fields**", "**13 documents, 15 flagged source fields**"),
        ("sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json", "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json"),
        ("**22** provenance", "**23** provenance"),
        ("22 of 22", "23 of 23"),
        ("`cbeta_note` 11", "`cbeta_note` 12"),
    ],
    "vision.md": [
        ("**22** provenance", "**23** provenance"),
        ("22 of 22", "23 of 23"),
        ("`cbeta_note` 11", "`cbeta_note` 12"),
    ],
    "RESEARCH_RELEASE_PLAN.md": [
        ("**22** provenance", "**23** provenance"),
        ("22 of 22", "23 of 23"),
        ("`cbeta_note` 11", "`cbeta_note` 12"),
    ],
    "index.html": [
        ("12 Corpus Works", "13 Corpus Works"),
    ],
    ".orchestrator/STATE.md": [
        ("**12 documents, 15 flagged source fields**", "**13 documents, 15 flagged source fields**"),
        ("sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json", "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json"),
    ],
    ".orchestrator/REMEDIATION_PLAN.md": [
        ("**12 documents, 15 flagged source fields**", "**13 documents, 15 flagged source fields**"),
        ("sessions/COLLATION_REGISTER_2026-09-21_ENTHUSIAST_100PCT.json", "sessions/COLLATION_REGISTER_2026-09-21_WUMENGUAN.json"),
    ],
}

def main():
    for rel_path, pairs in replacements.items():
        file_path = ROOT / rel_path
        if not file_path.exists():
            print(f"Skipping {rel_path} (does not exist)")
            continue
        text = file_path.read_text(encoding="utf-8")
        orig = text
        for old, new in pairs:
            text = text.replace(old, new)
        if text != orig:
            file_path.write_text(text, encoding="utf-8")
            print(f"Updated {rel_path}")
        else:
            print(f"No changes for {rel_path}")

if __name__ == "__main__":
    main()
