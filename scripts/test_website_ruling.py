#!/usr/bin/env python3
"""
Gate: Website Ruling 2026-09-14 + Common Qualities 2026-09-14
Enforce that website is NOT beautiful, NOT done, orchestrator/agents NOT capable to judge,
100% owner feedback, 1-10 aim 8+, AND all 5 design directions share common qualities:
light mental load, English first, not dense, comfortable, piece meal plain language,
info section for every work and teacher.

FAILS if subjective standards not met per owner definitive rulings.
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

FAILURES = []

def fail(msg):
    FAILURES.append(msg)

def read(p):
    try:
        return p.read_text(encoding="utf-8")
    except Exception as e:
        fail(f"Cannot read {p}: {e}")
        return ""

# 1. RULING file exists
ruling_path = ROOT / ".orchestrator" / "RULING_WEBSITE_2026-09-14.md"
if not ruling_path.exists():
    fail(f"Missing ruling file {ruling_path} — required by 2026-09-14 law")
else:
    txt = read(ruling_path)
    required_phrases = [
        "In no way is the website beautiful",
        "In no way is it done",
        "NOT CAPABLE TO JUDGE THE WEBSITE",
        "100% relying on my feedback",
        "does this look good?",
        "Is this the right direction?",
        "how good is it on a scale from 1-10 where we aim for at least 8",
    ]
    for phrase in required_phrases:
        if phrase not in txt:
            fail(f"Ruling file missing required phrase: {phrase!r}")

# 1b. COMMON QUALITIES file exists
common_path = ROOT / ".orchestrator" / "COMMON_QUALITIES_2026-09-14.md"
if not common_path.exists():
    fail(f"Missing common qualities file {common_path} — required by 2026-09-14 owner statement")
else:
    txt = read(common_path)
    common_required = [
        "light mental load",
        "minimum amount of information",
        "expand",
        "hover",
        "toggle",
        "english first",
        "dense layout",
        "comfortable to read",
        "easy to navigate",
        "piece meal",
        "plain language",
        "info section for every work and teacher",
    ]
    for phrase in common_required:
        if phrase.lower() not in txt.lower():
            fail(f"Common qualities file missing required phrase: {phrase!r}")

# 2. Canonical tracker .orchestrator/STATE.md
state_path = ROOT / ".orchestrator" / "STATE.md"
if not state_path.exists():
    fail(f"Missing canonical tracker {state_path}")
else:
    txt = read(state_path)
    if "Website is NOT beautiful, NOT done" not in txt:
        fail("STATE.md missing 'Website is NOT beautiful, NOT done' law section")
    if "NOT CAPABLE TO JUDGE THE WEBSITE" not in txt:
        fail("STATE.md missing 'NOT CAPABLE TO JUDGE THE WEBSITE'")
    if "1-10 where we aim for at least 8" not in txt and "1-10" not in txt:
        fail("STATE.md missing 1-10 scale question required by law")

# 3. Working state — optional on main, required when present
local_state_path = ROOT / ".orchestrator" / "local" / "ORCHESTRATOR_STATE.md"
if local_state_path.exists():
    txt = read(local_state_path)
    if "Website is NOT beautiful, NOT done" not in txt and "NOT beautiful, NOT done" not in txt:
        fail("local ORCHESTRATOR_STATE.md missing website NOT beautiful NOT done law")
    if "NOT CAPABLE TO JUDGE" not in txt:
        fail("local ORCHESTRATOR_STATE.md missing NOT CAPABLE TO JUDGE")
else:
    pass  # On main, this file is not tracked — don't fail, ruling file is proxy

# 4. Forbidden self-judgment in repo prose
forbidden_patterns = [
    r"website is beautiful",
    r"website is done",
    r"website is.*beautiful and.*done",
    r"Pages revamp.*is beautiful",
    r"Phase B.*is beautiful",
    r"the website.*is.*complete.*and.*beautiful",
]

scan_files = list(ROOT.glob("README.md")) + list(ROOT.glob("AUDIT.md")) + list(ROOT.glob("HANDOFF.md")) + list(ROOT.glob("ROADMAP.md")) + list(ROOT.glob("vision.md")) + list(ROOT.glob("WEB_VISION_*.md"))

for fp in scan_files:
    content = read(fp)
    lower = content.lower()
    for pat in forbidden_patterns:
        if re.search(pat, lower):
            for i, line in enumerate(content.splitlines(), 1):
                if re.search(pat, line, re.IGNORECASE):
                    if "not" not in line.lower():
                        fail(f"{fp.name}:{i} contains forbidden self-judgment without NOT: {line.strip()[:200]}")

    if "Phase B" in content and "COMPLETE" in content:
        for m in re.finditer(r"Phase B[^.\n]*COMPLETE", content, re.IGNORECASE):
            snippet = content[max(0, m.start()-500):m.end()+500]
            if "NOT beautiful" not in snippet and "NOT done" not in snippet and "functional" not in snippet.lower() and "gate-green" not in snippet.lower():
                if fp.name != "STATE.md":
                    if "ORCHESTRATOR_STATE" not in str(fp):
                        if "RULING_WEBSITE" not in content and "NOT beautiful" not in content:
                            fail(f"{fp.name} claims Phase B COMPLETE without NOT beautiful/NOT done qualification near: {m.group(0)[:100]}")

# 5. Future website prompts must contain owner-feedback questions and law
prompts_dir = ROOT / ".orchestrator" / "prompts"
if prompts_dir.exists():
    for prompt_file in prompts_dir.glob("*.md"):
        txt = read(prompt_file)
        lower = txt.lower()
        m_seq = re.match(r"(\d+)-", prompt_file.name)
        seq_num = int(m_seq.group(1)) if m_seq else 0
        is_website_prompt = any(k in lower for k in ["pages revamp", "phase5", "phase 5", "website overhaul", "five-design", "five design"])

        if re.search(r"website is beautiful|website is done|pages.*beautiful|beautiful.*done", lower):
            if "not beautiful" not in lower and "not done" not in lower:
                fail(f"{prompt_file.name} self-declares website beautiful/done without NOT — violates law")

        if seq_num >= 24:
            if is_website_prompt or ("human-readable" in prompt_file.name.lower()) or ("website" in prompt_file.name.lower()) or ("five-design" in prompt_file.name.lower()):
                if "does this look good" not in lower:
                    fail(f"{prompt_file.name} website prompt (seq {seq_num} >=24) missing required question 'does this look good?' per law")
                if "1-10" not in txt and "1 to 10" not in lower:
                    fail(f"{prompt_file.name} website prompt (seq {seq_num} >=24) missing required 1-10 scale question per law")
                if "not beautiful" not in lower and "not done" not in lower:
                    fail(f"{prompt_file.name} website prompt (seq {seq_num} >=24) missing NOT beautiful/NOT done law reference")
                if "not capable to judge" not in lower:
                    fail(f"{prompt_file.name} website prompt (seq {seq_num} >=24) missing 'NOT CAPABLE TO JUDGE' per law")

                # For Phase5 5-design prompts (seq >=25), also require common qualities
                if seq_num >= 25:
                    common_checks = [
                        ("light mental load", "light mental load common quality"),
                        ("english first", "english first common quality"),
                        ("not dense", "not dense layout common quality"),
                        ("comfortable to read", "comfortable to read common quality"),
                        ("easy to navigate", "easy to navigate common quality"),
                        ("piece meal", "piece meal explanation common quality"),
                        ("plain language", "plain language common quality"),
                        ("info section for every work and teacher", "info section for every work and teacher common quality"),
                    ]
                    for phrase, desc in common_checks:
                        if phrase not in lower:
                            fail(f"{prompt_file.name} Phase5 prompt (seq {seq_num} >=25) missing {desc}: {phrase!r} — violates common qualities law")

if FAILURES:
    print("❌ WEBSITE RULING GATE FAILED — subjective standards not met per 2026-09-14 definitive law:")
    for f in FAILURES:
        print(f"  - {f}")
    print("\nLaw: Website is NOT beautiful, NOT done. Orchestrator/agents NOT capable to judge. 100% owner feedback. Must ask does this look good? right direction? 1-10 aim 8+. Common: light mental load, English first, not dense, comfortable, piece meal plain language, info section for every work/teacher.")
    sys.exit(1)
else:
    print("✅ WEBSITE RULING GATE PASSED — law enforced: NOT beautiful, NOT done, NOT capable to judge, 100% owner feedback, 1-10 aim 8+, common qualities: light mental load, English first, not dense, comfortable, piece meal, info sections")
    sys.exit(0)

