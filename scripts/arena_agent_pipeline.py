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

_REQUIRED_SOURCE_FIELDS = ("work", "edition", "reference", "verification", "source_id")


def _load_rights_source_ids():
    """Return the set of valid source_ids from data/translations/rights_manifest.json.

    Returns an empty set if the file cannot be loaded (callers degrade gracefully).
    """
    try:
        rights_path = DATA_DIR / "translations" / "rights_manifest.json"
        manifest = json.loads(rights_path.read_text(encoding="utf-8"))
        return {s["source_id"] for s in manifest.get("sources", []) if s.get("source_id")}
    except Exception:
        return set()


def create_translation_entry(source_id, source_title, sentence_zh, sentence_pinyin, contemporary_translations=None, ai_drafts=None):
    """
    Constructs a standardized comparative matrix entry.

    Self-validation (O-2, 2026-09-13): when a caller passes status
    ``verified_quotation`` together with a ``source`` object, that object must
    carry all five required provenance keys (work, edition, reference,
    verification, source_id) and the ``source_id`` must resolve to an entry in
    ``data/translations/rights_manifest.json``. If either condition fails the
    entry is downgraded to ``reconstruction_unverified`` and a note is added
    rather than emitting a malformed record that the later gate would refuse.
    For ``reconstruction_unverified`` / ``ai_draft`` statuses, existing
    behaviour is preserved.
    """
    entry = {
        "id": source_id,
        "source_ref": source_title,
        "sentence_zh": sentence_zh,
        "sentence_pinyin": sentence_pinyin,
        "translators": []
    }
    rights_ids = _load_rights_source_ids()

    def _build_translator(base, status_default, source=None):
        status = base.get("status", status_default)
        out = dict(base)
        out["status"] = status
        # Caller may pass source either via the trans dict's 'source' key or
        # via the explicit kwarg; kwarg wins when provided.
        src = source if isinstance(source, dict) else base.get("source")
        downgrade_reason = None
        if status == "verified_quotation":
            if not isinstance(src, dict):
                downgrade_reason = "missing source object"
            elif not all(isinstance(src.get(k), str) and src.get(k).strip() for k in _REQUIRED_SOURCE_FIELDS):
                downgrade_reason = "incomplete source record"
            elif rights_ids and src["source_id"] not in rights_ids:
                downgrade_reason = f"source_id {src['source_id']!r} missing from rights_manifest"
            if downgrade_reason:
                out["status"] = "reconstruction_unverified"
                note_add = f"[self-validation downgraded from verified_quotation: {downgrade_reason}]"
                out["notes"] = ((out.get("notes") or "") + " " + note_add).strip()
                out.pop("source", None)
            else:
                out["source"] = src
        # For non-verified statuses, drop any stray source block (provenance
        # policy: source objects belong only to verified_quotation entries).
        if out["status"] != "verified_quotation":
            out.pop("source", None)
        return out

    # Add contemporary published translations.  Provenance policy v2.2: any
    # entry rendered in the Matrix needs an explicit status; a string-keyed
    # translator register without print collation is a register reconstruction,
    # never an unverified-by-default blank.  Callers collating a real edition
    # may pass status='verified_quotation' together with a full `source`
    # object ({work, edition, reference, verification, source_id}) — that
    # source_id must also exist in data/translations/rights_manifest.json or
    # the entry is downgraded here (O-2 self-validation); the validator is the
    # final backstop if this helper is bypassed.
    if contemporary_translations:
        for trans in contemporary_translations:
            entry["translators"].append(_build_translator({
                "translator": trans.get("translator"),
                "work": trans.get("work"),
                "style": trans.get("style", "Contemporary Scholarly"),
                "text": trans.get("text"),
                "notes": trans.get("notes", ""),
                "status": trans.get("status", "reconstruction_unverified"),
            }, "reconstruction_unverified", source=trans.get("source")))

    # Add Arena AI Agent generated drafts (always disclosed AI output).
    if ai_drafts:
        for draft in ai_drafts:
            entry["translators"].append(_build_translator({
                "translator": f"Arena AI Agent ({draft.get('model', 'Claude/GPT/DeepSeek')})",
                "work": f"TranslateChan AI Matrix: {draft.get('register_label', 'Multi-Register')}",
                "style": draft.get("style", "AI Synthesis"),
                "text": draft.get("text"),
                "notes": draft.get("notes", "Generated in sandboxed Arena AI session"),
            }, "ai_draft"))

    return entry

def main():
    print("=== TranslateChan Arena AI Agent Ingestion & Translation Pipeline ===")
    print("This utility provides structured prompt templates and ingestion harnesses for sessioned Arena AI agents.")
    print(f"Available Prompt Registers: {list(PROMPT_TEMPLATES.keys())}")

if __name__ == "__main__":
    main()
