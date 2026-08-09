#!/usr/bin/env python3
"""Deprecated compatibility wrapper for the Classical Chinese segmenter.

The tool was renamed to segment_classical.py in 2026-08-09 because it does not
fetch or ingest CBETA data. This wrapper preserves old command-line invocation
while pointing contributors to the new script.
"""

from __future__ import annotations

import runpy
import sys
from pathlib import Path

if __name__ == "__main__":
    target = Path(__file__).with_name("segment_classical.py")
    print(
        "warning: scripts/ingest_cbeta.py is deprecated; "
        "use scripts/segment_classical.py instead",
        file=sys.stderr,
    )
    sys.argv[0] = str(target)
    runpy.run_path(str(target), run_name="__main__")
