#!/usr/bin/env python3
"""
Gate: Website Ruling 2026-09-14 — enforce that website is NOT beautiful, NOT done,
and orchestrator/agents are NOT capable to judge, 100% owner feedback, 1-10 scale aim 8+.

This gate FAILS if subjective standards are not met per owner definitive ruling.

Checks:
1. RULING file exists and contains verbatim law phrases
2. Canonical tracker .orchestrator/STATE.md contains law
3. Working state .orchestrator/local/ORCHESTRATOR_STATE.md contains law
4. No repo prose claims website is beautiful/done without NOT qualification
5. Future website prompts (pages/web/human-readable/Phase5) must contain owner-feedback questions
   and must not self-declare beauty/completeness
6. README/AUDIT/HANDOFF/ROADMAP/vision.md must not contain forbidden self-judgment

Exit 0 = PASS, non-zero = FAIL with details.
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

# 2. Canonical tracker .orchestrator/STATE.md
state_path = ROOT / ".orchestrator" / "STATE.md"
if not state_path.exists():
    fail(f"Missing canonical tracker {state_path}")
else:
    txt = read(state_path)
    # Must contain law section
    if "Website is NOT beautiful, NOT done" not in txt:
        fail("STATE.md missing 'Website is NOT beautiful, NOT done' law section")
    if "NOT CAPABLE TO JUDGE THE WEBSITE" not in txt:
        fail("STATE.md missing 'NOT CAPABLE TO JUDGE THE WEBSITE'")
    if "1-10 where we aim for at least 8" not in txt and "1-10" not in txt:
        fail("STATE.md missing 1-10 scale question required by law")

# 3. Working state
local_state_path = ROOT / ".orchestrator" / "local" / "ORCHESTRATOR_STATE.md"
if not local_state_path.exists():
    fail(f"Missing working state {local_state_path}")
else:
    txt = read(local_state_path)
    if "Website is NOT beautiful, NOT done" not in txt and "NOT beautiful, NOT done" not in txt:
        fail("local ORCHESTRATOR_STATE.md missing website NOT beautiful NOT done law")
    if "NOT CAPABLE TO JUDGE" not in txt:
        fail("local ORCHESTRATOR_STATE.md missing NOT CAPABLE TO JUDGE")

# 4. Forbidden self-judgment in repo prose (README, AUDIT, HANDOFF, ROADMAP, vision.md, WEB_VISION)
# We allow historical "Phase B COMPLETE" ONLY if qualified as functional gate-green, not beauty.
# The gate fails if it finds unqualified beauty claims.

forbidden_patterns = [
    r"website is beautiful",
    r"website is done",
    r"website is.*beautiful and.*done",
    r"Pages revamp.*is beautiful",
    r"Phase B.*is beautiful",
    r"the website.*is.*complete.*and.*beautiful",
]

# Files to scan
scan_files = list(ROOT.glob("README.md")) + list(ROOT.glob("AUDIT.md")) + list(ROOT.glob("HANDOFF.md")) + list(ROOT.glob("ROADMAP.md")) + list(ROOT.glob("vision.md")) + list(ROOT.glob("WEB_VISION_*.md"))

for fp in scan_files:
    content = read(fp)
    lower = content.lower()
    # Check forbidden patterns case-insensitive
    for pat in forbidden_patterns:
        if re.search(pat, lower):
            # Allow if same line also contains NOT
            # Find lines with pattern
            for i, line in enumerate(content.splitlines(), 1):
                if re.search(pat, line, re.IGNORECASE):
                    if "not" not in line.lower():
                        fail(f"{fp.name}:{i} contains forbidden self-judgment without NOT: {line.strip()[:200]}")

    # If file claims "Phase B COMPLETE" or "Pages revamp COMPLETE" it must also mention NOT beautiful/NOT done or functional gate-green qualification nearby (within 500 chars)
    if "Phase B" in content and "COMPLETE" in content:
        # Find occurrences
        for m in re.finditer(r"Phase B[^.\n]*COMPLETE", content, re.IGNORECASE):
            snippet = content[max(0, m.start()-500):m.end()+500]
            if "NOT beautiful" not in snippet and "NOT done" not in snippet and "functional" not in snippet.lower() and "gate-green" not in snippet.lower():
                # Only fail if it's a strong claim without qualification and not in historical Active Milestone section that already has qualification elsewhere
                # We check if the file is STATE.md — already handled, so for other files we require qualification
                if fp.name != "STATE.md":
                    # Check if file is local state — already has law
                    if "ORCHESTRATOR_STATE" not in str(fp):
                        # Allow if file contains ruling reference elsewhere
                        if "RULING_WEBSITE" not in content and "NOT beautiful" not in content:
                            fail(f"{fp.name} claims Phase B COMPLETE without NOT beautiful/NOT done qualification near: {m.group(0)[:100]}")

# 5. Future website prompts must contain owner-feedback questions and must not self-declare beauty
prompts_dir = ROOT / ".orchestrator" / "prompts"
if prompts_dir.exists():
    for prompt_file in prompts_dir.glob("*.md"):
        txt = read(prompt_file)
        lower = txt.lower()
        # Extract seq number from filename like 008-... or 023-...
        m_seq = re.match(r"(\d+)-", prompt_file.name)
        seq_num = int(m_seq.group(1)) if m_seq else 0
        # Only enforce strict questions for prompts >= 024 (after ruling 2026-09-14)
        # Older prompts (001-023) are exempt from the feedback-question requirement, but still must not self-declare beauty
        is_website_prompt = any(k in lower for k in ["pages revamp", "phase5", "phase 5", "website overhaul"])
        is_human_readable_explicit = ("human-readable" in lower and "phase5" in lower) or ("human-readable phase5" in lower) or ("phase5" in lower and "human-readable" in lower)

        # Check self-declaration for ALL prompts (no one may claim beautiful/done without NOT)
        if re.search(r"website is beautiful|website is done|pages.*beautiful|beautiful.*done", lower):
            if "not beautiful" not in lower and "not done" not in lower:
                fail(f"{prompt_file.name} self-declares website beautiful/done without NOT — violates law")

        # Strict enforcement only for prompts >= 024 that are website work
        if seq_num >= 24:
            # If it's a website/human-readable Phase5 prompt, require law
            if is_website_prompt or is_human_readable_explicit or ("human-readable" in prompt_file.name.lower()) or ("website" in prompt_file.name.lower()):
                if "does this look good" not in lower:
                    fail(f"{prompt_file.name} website prompt (seq {seq_num} >=24) missing required question 'does this look good?' per law")
                if "1-10" not in txt and "1 to 10" not in lower:
                    fail(f"{prompt_file.name} website prompt (seq {seq_num} >=24) missing required 1-10 scale question per law")
                if "not beautiful" not in lower and "not done" not in lower:
                    fail(f"{prompt_file.name} website prompt (seq {seq_num} >=24) missing NOT beautiful/NOT done law reference")
                if "not capable to judge" not in lower:
                    fail(f"{prompt_file.name} website prompt (seq {seq_num} >=24) missing 'NOT CAPABLE TO JUDGE' per law")

# 6. Ensure this gate itself is documented as required
# Check that HANDOFF or AUDIT mentions this gate
handoff = read(ROOT / "HANDOFF.md")
if "test_website_ruling" not in handoff and "Website Ruling" not in handoff:
    # Not failing yet, just warning — but we want it documented, so we will fail if not present after Phase5 starts
    # For now, only warn by not failing, but record as info
    pass

if FAILURES:
    print("❌ WEBSITE RULING GATE FAILED — subjective standards not met per 2026-09-14 definitive law:")
    for f in FAILURES:
        print(f"  - {f}")
    print("\nLaw: Website is NOT beautiful, NOT done. Orchestrator/agents NOT capable to judge. 100% owner feedback. Must ask does this look good? right direction? 1-10 aim 8+.")
    sys.exit(1)
else:
    print("✅ WEBSITE RULING GATE PASSED — law enforced: NOT beautiful, NOT done, NOT capable to judge, 100% owner feedback, 1-10 scale aim 8+")
    sys.exit(0)
