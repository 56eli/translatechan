#!/usr/bin/env python3
"""TranslateChan: Arena AI agent prompt registers & entry-builder helpers.

This module is NOT an ingestion/alignment pipeline. It provides (a) structured
prompt templates for sandboxed Arena AI sessions (literal-philological,
philosophical-hermeneutic, poetic-Zen registers) and (b) a helper that builds a
standardized comparative-matrix entry from given translations/AI drafts. The
helper emits validator-shaped entries (status attached per provenance policy
v2.2 — reconstruction_unverified by default, ai_draft for Arena drafts,
verified_quotation only with a full source record that also exists in the
rights manifest), so its output passes scripts/validate_data.py as-is.
"""

import json
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

PROMPT_TEMPLATES = {
    "literal_philological": """You are an expert philologist in Tang and Song Classical Chinese and Buddhist Chinese.
Translate the following Classical Chinese passage with strict syntactic fidelity, preserving grammatical particles (底, 甚麼, 這箇, 阿誰) and technical terminology.

Passage:
{chinese_text}

Output JSON format:
{
  "register": "literal_philological",
  "translation": "...",
  "grammatical_breakdown": { ... },
  "terms_glossed": [ ... ]
}
""",
    "philosophical_hermeneutic": """You are a scholar of Chan / Mahayana Buddhist philosophy and ontology.
Unfold the deep philosophical and hermeneutic nuances of the following passage, explaining non-duality, Mind-Only, and dialectical structures.

Passage:
{chinese_text}

Output JSON format:
{
  "register": "philosophical_hermeneutic",
  "translation": "...",
  "philosophical_context": "..."
}
""",
    "poetic_zen_cadence": """You are a master literary translator specializing in Tang and Song Zen poetry and encounter dialogues.
Translate the following passage capturing the sharp, brisk, enigmatic, and living cadence of ancient Chan masters (Red Pine, Gary Snyder, Cleary style).

Passage:
{chinese_text}

Output JSON format:
{
  "register": "poetic_zen_cadence",
  "translation": "..."
}
"""
}

def create_translation_entry(source_id, source_title, sentence_zh, sentence_pinyin, contemporary_translations=None, ai_drafts=None):
    """
    Constructs a standardized comparative matrix entry.
    """
    entry = {
        "id": source_id,
        "source_ref": source_title,
        "sentence_zh": sentence_zh,
        "sentence_pinyin": sentence_pinyin,
        "translators": []
    }

    # Add contemporary published translations.  Provenance policy v2.2: any
    # entry rendered in the Matrix needs an explicit status; a string-keyed
    # translator register without print collation is a register reconstruction,
    # never an unverified-by-default blank.  Callers collating a real edition
    # may pass status='verified_quotation' together with a full `source`
    # object ({work, edition, reference, verification, source_id}) — that
    # source_id must also exist in data/translations/rights_manifest.json or
    # the validator will refuse the commit.
    if contemporary_translations:
        for trans in contemporary_translations:
            entry["translators"].append({
                "translator": trans.get("translator"),
                "work": trans.get("work"),
                "style": trans.get("style", "Contemporary Scholarly"),
                "text": trans.get("text"),
                "notes": trans.get("notes", ""),
                "status": trans.get("status", "reconstruction_unverified"),
                **({"source": trans["source"]} if isinstance(trans.get("source"), dict) else {}),
            })

    # Add Arena AI Agent generated drafts (always disclosed AI output).
    if ai_drafts:
        for draft in ai_drafts:
            entry["translators"].append({
                "translator": f"Arena AI Agent ({draft.get('model', 'Claude/GPT/DeepSeek')})",
                "work": f"TranslateChan AI Matrix: {draft.get('register_label', 'Multi-Register')}",
                "style": draft.get("style", "AI Synthesis"),
                "text": draft.get("text"),
                "notes": draft.get("notes", "Generated in sandboxed Arena AI session"),
                "status": draft.get("status", "ai_draft"),
            })

    return entry

def main():
    print("=== TranslateChan Arena AI Agent Ingestion & Translation Pipeline ===")
    print("This utility provides structured prompt templates and ingestion harnesses for sessioned Arena AI agents.")
    print(f"Available Prompt Registers: {list(PROMPT_TEMPLATES.keys())}")

if __name__ == "__main__":
    main()
