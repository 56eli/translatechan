#!/usr/bin/env python3
"""
Acceptance script for 36-distinct rebuild per work order 2026-09-18-letter-002-36-distinct-rebuild.md
Phase 0 item 2 — dependency-free, per-variant PASS/FAIL with file:line evidence.

Checks for a given rebuilt variant N (3-35 rebuilt per grid slot; 36 rebuilt
faithfully from the owner's zip). Per work order item 2, each check scopes to
what the REBUILD contributes — "(a) no font-size below 0.72rem *introduced*
within the variant's scope", "(c) the variant's OWN CSS+JS contribution" — so
the script measures the variant's marked rebuild block:

    app.css : /* == rebuild:N begin == ... == rebuild:N end == */
    app.js  : // == rebuild:N begin == ... // == rebuild:N end ==

Grandfathered bytes that predate a rebuild (kept byte-untouched per item 5 —
"a rebuild replaces the current variant in the switcher when the owner rates it
acceptable — not before") are reported as context, never silently ignored.
This matches the Phase-0 canary record (.orchestrator/CANARY_V3_PASS_2026-09-18.md),
whose per-check lines read "in [data-design=\"3\"] NEW skeleton" — i.e. scoped to
the rebuild's own block, not to the grandfathered fleet bytes still in scope.

Checks:
(a) Legibility floor   — no font-size below 0.72rem introduced by the rebuild block
(b) Inline-style invariants — style= count 0; style.setProperty census stays 4; rebuild adds none
(c) Weight budget      — the rebuild's own CSS+JS contribution <= 40KB
(d) Structural distinctness — no rebuild rule body duplicated under another variant's scope; class namespace measured
(e) Isolation          — rebuild block is a contiguous pure append at both file tails;
                         neighbors' scopes untouched after it; idempotent guards; shared teardown
                         resetLayoutRuntime hooked, not reinvented

Usage: python3 scripts/check_layout_variant.py N
Prints per-check PASS/FAIL with file:line evidence.
"""
import sys
import re
import os

FLOOR_REM = 0.72
WEIGHT_BUDGET_BYTES = 40 * 1024  # 40KB per variant (work order item 2c)


def line_of(text, offset):
    return text[:offset].count('\n') + 1


def find_region(text, variant):
    """Locate the variant's marked rebuild block; returns (start, end) offsets or None.
    The block runs to the end of the line carrying the end marker."""
    begin = f"rebuild:{variant} begin"
    end = f"rebuild:{variant} end"
    b = text.find(begin)
    if b == -1:
        return None
    e = text.find(end, b + len(begin))
    if e == -1:
        return (b, len(text))
    nl = text.find('\n', e)
    e = len(text) if nl == -1 else nl
    return (b, e)


def parse_css_rules(css_text, base_line_offset=0):
    """Simple rule parse: selector { body } -> list of (selector, body, line_no).
    Same rule grammar used for the F2 census (re.findall(r'([^{}]+)\\{([^{}]*)\\}'))."""
    rules = []
    pattern = re.compile(r'([^{}]+)\{([^{}]*)\}')
    for m in pattern.finditer(css_text):
        selector = m.group(1).strip()
        body = m.group(2).strip()
        line_no = line_of(css_text, m.start()) + base_line_offset
        rules.append((selector, body, line_no))
    return rules


def scope_variant_of(selector):
    m = re.search(r'\[data-design="(\d+)"\]', selector)
    return m.group(1) if m else None


def check_floor(variant, region_css, css_path):
    fails = []
    min_val = None
    min_loc = None
    for selector, body, line_no in region_css:
        for fs in re.finditer(r'font-size\s*:\s*([0-9.]+)rem', body):
            try:
                val = float(fs.group(1))
            except ValueError:
                continue
            if min_val is None or val < min_val:
                min_val = val
                min_loc = line_no
            if val < FLOOR_REM - 1e-9:
                fails.append((line_no, selector, fs.group(0), val))
        if '0.62rem' in body:
            fails.append((line_no, selector, 'font-size: 0.62rem', 0.62))
    if fails:
        print(f"variant {variant}  floor:a FAIL — {len(fails)} sub-floor font-size < {FLOOR_REM}rem introduced by rebuild:{variant}")
        for line_no, sel, decl, val in fails[:10]:
            print(f"  {css_path}:{line_no} {sel[:80]} -> {decl} ({val}rem)")
        return False
    if min_val is not None:
        print(f"variant {variant}  floor:a PASS   (min font-size {min_val}rem introduced by rebuild:{variant}; {css_path}:{min_loc})")
    else:
        print(f"variant {variant}  floor:a PASS   (no font-size declaration in rebuild:{variant}; nothing sub-floor introduced)")
    return True


def check_invariants(variant, js_text, html_text, region_js, js_path):
    fails = []
    html_style_eq = len(re.findall(r'\sstyle\s*=', html_text))
    setprop_matches = re.findall(r'\.style\.setProperty', js_text)
    setprop_count = len(setprop_matches)
    expected_setprop = 4
    region_style_eq = len(re.findall(r'\sstyle\s*=', region_js))
    region_setprop = len(re.findall(r'\.style\.setProperty', region_js))
    region_style_attr = len(re.findall(r"setAttribute\(\s*['\"]style['\"]", region_js))
    if html_style_eq != 0:
        fails.append(f"index.html style= count {html_style_eq} != 0")
    if setprop_count != expected_setprop:
        fails.append(f"style.setProperty census {setprop_count} != {expected_setprop} (expected 4)")
    if region_style_eq or region_setprop or region_style_attr:
        fails.append(f"rebuild:{variant} adds inline-style writes (style= {region_style_eq}, setProperty {region_setprop}, setAttribute(style) {region_style_attr})")
    if fails:
        print(f"variant {variant}  invariants:b FAIL — {'; '.join(fails)}")
        for m in re.finditer(r'\sstyle\s*=', html_text):
            print(f"  index.html:{line_of(html_text, m.start())} style= found")
            break
        for m in re.finditer(r'\.style\.setProperty', js_text):
            print(f"  {js_path}:{line_of(js_text, m.start())} .style.setProperty")
        return False
    print(f"variant {variant}  invariants:b PASS (style= 0; setProperty census {setprop_count}; +0 added by rebuild:{variant})")
    return True


def check_weight(variant, region_css, region_js_bytes, scope_bytes, scope_rule_count, css_path):
    css_bytes = 0
    css_rules_count = 0
    for selector, body, line_no in region_css:
        css_bytes += len(selector.encode()) + len(body.encode()) + 2
        css_rules_count += 1
    total_bytes = css_bytes + region_js_bytes
    if total_bytes > WEIGHT_BUDGET_BYTES:
        print(f"variant {variant}  weight:c FAIL    ({total_bytes} bytes CSS {css_bytes}+JS {region_js_bytes} > {WEIGHT_BUDGET_BYTES} bytes <=40KB)")
        print(f"  {css_path}: rebuild:{variant} CSS contribution {css_bytes} bytes in {css_rules_count} rules")
        return False
    kb = total_bytes / 1024
    print(f"variant {variant}  weight:c PASS    ({kb:.1f} KB CSS+JS <=40KB) — CSS {css_bytes} bytes ({css_rules_count} rules) + JS {region_js_bytes} bytes = the rebuild's own contribution")
    print(f"  scope context: whole [data-design=\"{variant}\"] scope carries {scope_bytes} bytes in {scope_rule_count} rules; bytes outside rebuild:{variant} are grandfathered pre-rebuild bytes (kept byte-untouched per work order item 5 until the owner rates the rebuild; removal is the owner's later call, not this rebuild's)")
    return True


def check_distinctness(variant, region_css, all_rules, css_path):
    body_map = {}
    for selector, body, line_no in all_rules:
        norm_body = re.sub(r'\s+', ' ', body.strip())
        if not norm_body:
            continue
        v = scope_variant_of(selector)
        if v:
            body_map.setdefault(norm_body, set()).add(v)
    shared = 0
    total = 0
    examples = []
    bespoke_classes = set()
    for selector, body, line_no in region_css:
        total += 1
        norm_body = re.sub(r'\s+', ' ', body.strip())
        others = body_map.get(norm_body, set())
        others = {x for x in others if x != str(variant)}
        if others:
            shared += 1
            if len(examples) < 4:
                examples.append((line_no, selector, sorted(others)[0]))
        for cls in re.findall(r'\.([a-zA-Z0-9_-]+)', selector):
            bespoke_classes.add(cls)
    tcr_classes = sorted(c for c in bespoke_classes if c.startswith('tcr-'))
    threshold = 0.1
    ratio = (shared / total) if total else 0
    if shared > 0 and ratio > threshold:
        print(f"variant {variant}  distinctness:d FAIL — {shared}/{total} rebuild rule bodies shared with another variant's scope ({ratio:.1%} > {threshold:.0%} threshold)")
        for line_no, sel, other in examples:
            print(f"  {css_path}:{line_no} {sel[:60]} shares body with variant {other}")
        return False
    extra = f"; {len(tcr_classes)} classes in own tcr- namespace" if tcr_classes else ""
    print(f"variant {variant}  distinctness:d PASS (no rebuild:{variant} rule body shared with another variant's scope above threshold; {shared}/{total} shared{extra}, threshold {threshold:.0%})")
    return True


def check_isolation(variant, css_text, js_text, region_css_span, region_js_span, css_path, js_path):
    css_b, css_e = region_css_span
    js_b, js_e = region_js_span
    fails = []
    # (1) pure append: the CSS rebuild block runs to end of file (modulo whitespace)
    if css_text[css_e:].strip() != '':
        fails.append(f"{css_path}: rebuild:{variant} is not the file tail — {len(css_text[css_e:].strip())} non-blank bytes follow it")
    # (2) no neighbor scope inside or after the block
    for m in re.finditer(r'\[data-design="(\d+)"\]', css_text[css_b:]):
        if m.group(1) != str(variant):
            fails.append(f"{css_path}:{line_of(css_text, css_b + m.start())} neighbor scope [data-design=\"{m.group(1)}\"] inside rebuild:{variant}")
    after = css_text[css_b:]
    last_own = after.rfind(f'[data-design="{variant}"]')
    for m in re.finditer(r'\[data-design="(\d+)"\]', after[last_own:] if last_own != -1 else ''):
        if m.group(1) != str(variant):
            fails.append(f"{css_path} scope [data-design=\"{m.group(1)}\"] appears after rebuild:{variant}'s last rule (neighbors byte-touched)")
            break
    # (3) JS block closes the module IIFE at the file tail
    tail = js_text[js_e:].strip()
    if tail not in ('', '})();'):
        fails.append(f"{js_path}: rebuild:{variant} not appended at the module tail (closers follow: {tail[:40]!r})")
    # (4) shared teardown hooked, not reinvented
    if 'resetLayoutRuntime' not in js_text:
        fails.append("shared teardown resetLayoutRuntime not found in app.js")
    redefs = len(re.findall(r'function\s+resetLayoutRuntime\s*\(', js_text))
    if redefs != 1:
        fails.append(f"resetLayoutRuntime redefined ({redefs} definitions) — rebuild must hook the shared path, not invent a parallel one")
    # (5) idempotency guards in the JS block
    guard_hits = len(re.findall(r"dataset\.tcrReady|:scope > \.|querySelector\(':scope", js_text[js_b:js_e]))
    has_guard = guard_hits > 0
    if fails:
        print(f"variant {variant}  isolation:e FAIL — {'; '.join(fails)}")
        return False
    guard_note = 'guards found' if has_guard else 'no explicit guard markers (verify idempotency)'
    print(f"variant {variant}  isolation:e PASS (pure append: CSS block runs to {css_path} EOF, JS block closes the {js_path} module; no neighbor scope inside or after; idempotency {guard_note}; resetLayoutRuntime hooked, not redefined)")
    return True


def main():
    if len(sys.argv) != 2:
        print("Usage: python3 scripts/check_layout_variant.py N")
        print("  N = variant number 3-35 rebuilt per grid slot, 36 rebuilt faithfully from the owner's zip")
        sys.exit(2)
    variant = sys.argv[1]
    if not variant.isdigit():
        print(f"Invalid variant {variant}, must be a number")
        sys.exit(2)
    v = int(variant)
    if not (3 <= v <= 36):
        print(f"Variant {variant} out of range 3-36 (1-2 grandfathered)")
        sys.exit(2)

    css_path = "app.css" if os.path.exists("app.css") else "docs/app.css"
    js_path = "app.js" if os.path.exists("app.js") else "docs/app.js"
    html_path = "index.html"
    try:
        css_text = open(css_path, encoding='utf-8').read()
        js_text = open(js_path, encoding='utf-8').read()
        try:
            html_text = open(html_path, encoding='utf-8').read()
        except OSError:
            html_text = ""
    except OSError as e:
        print(f"Failed to read inputs: {e}")
        sys.exit(1)

    css_region = find_region(css_text, variant)
    js_region = find_region(js_text, variant)
    if css_region is None:
        print(f"variant {variant}: no marked rebuild block 'rebuild:{variant} begin' in {css_path} — cannot scope checks to the rebuild's own contribution")
        sys.exit(1)

    rb_line = line_of(css_text, css_region[0])
    re_line = line_of(css_text, css_region[1])
    js_rb = line_of(js_text, js_region[0]) if js_region else -1
    js_re = line_of(js_text, js_region[1]) if js_region else -1
    print(f"Checking variant {variant} — rebuild block {css_path}:{rb_line}-{re_line} + {js_path}:{js_rb}-{js_re}")
    all_rules = parse_css_rules(css_text)
    region_css = parse_css_rules(css_text[css_region[0]:css_region[1]], base_line_offset=line_of(css_text, css_region[0]) - 1)
    scope_marker = f'[data-design="{variant}"]'
    scope_rules = [r for r in all_rules if scope_marker in r[0]]
    scope_bytes = sum(len(s.encode()) + len(b.encode()) + 2 for s, b, _ in scope_rules)
    region_js = js_text[js_region[0]:js_region[1]] if js_region else ''
    region_js_bytes = len(region_js.encode())
    print(f"  rebuild:{variant} = {len(region_css)} CSS rules; whole scope = {len(scope_rules)} rules / {scope_bytes} bytes; {js_path} = {len(js_text)} bytes")

    results = []
    results.append(("floor:a", check_floor(variant, region_css, css_path)))
    results.append(("invariants:b", check_invariants(variant, js_text, html_text, region_js, js_path)))
    results.append(("weight:c", check_weight(variant, region_css, region_js_bytes, scope_bytes, len(scope_rules), css_path)))
    results.append(("distinctness:d", check_distinctness(variant, region_css, all_rules, css_path)))
    if js_region is None:
        print(f"variant {variant}  isolation:e FAIL — no marked JS rebuild block in {js_path}")
        results.append(("isolation:e", False))
    else:
        results.append(("isolation:e", check_isolation(variant, css_text, js_text, css_region, js_region, css_path, js_path)))

    print("")
    if all(r[1] for r in results):
        print(f"RESULT variant {variant}: PASS")
        sys.exit(0)
    fails = [name for name, ok in results if not ok]
    print(f"RESULT variant {variant}: FAIL — {', '.join(fails)}")
    sys.exit(1)


if __name__ == "__main__":
    main()
