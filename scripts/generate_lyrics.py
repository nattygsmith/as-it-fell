#!/usr/bin/env python3
"""
generate_lyrics.py
==================
Merges all per-collection lyrics JSON files into the LYRICS constant
in src/App.jsx (or src/folk-quotes.jsx — update TARGET_FILE below).

Reads from:
  scripts/as-it-fell-lyrics-child.json
  scripts/as-it-fell-lyrics-sharp.json
  scripts/as-it-fell-lyrics-campbell-sharp.json

(Add future collections to LYRICS_FILES in the order you want them merged.)

Writes: replaces the `const LYRICS = { ... };` block in TARGET_FILE.

Run from the repo root:
  python3 scripts/generate_lyrics.py
"""

import json
import re
import os

# ── Configuration ──────────────────────────────────────────────────────────────

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

LYRICS_FILES = [
    os.path.join(SCRIPTS_DIR, "as-it-fell-lyrics-child.json"),
    os.path.join(SCRIPTS_DIR, "as-it-fell-lyrics-sharp.json"),
    os.path.join(SCRIPTS_DIR, "as-it-fell-lyrics-campbell-sharp.json"),
    # Add future collections here, e.g.:
    # os.path.join(SCRIPTS_DIR, "as-it-fell-lyrics-karpeles.json"),
]

TARGET_FILE = os.path.join(SCRIPTS_DIR, "..", "src", "App.jsx")

# ── Helpers ────────────────────────────────────────────────────────────────────

def escape_js_string(s):
    """Escape a string for use inside a JS template-literal-safe double-quoted string."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

def entry_to_js(key, entry):
    """Render one LYRICS entry as a JS object literal."""
    lines = []
    lines.append(f'  "{key}": {{')
    lines.append(f'    title: "{escape_js_string(entry["title"])}",')
    # Support both childNumber (Child Ballads) and a generic collectionLabel field
    if "childNumber" in entry:
        lines.append(f'    childNumber: "{escape_js_string(entry["childNumber"])}",')
    elif "collectionLabel" in entry:
        lines.append(f'    collectionLabel: "{escape_js_string(entry["collectionLabel"])}",')
    lines.append(f'    version: "{escape_js_string(entry["version"])}",')
    lines.append(f'    stanzas: [')
    for stanza in entry["stanzas"]:
        lines.append(f'      "{escape_js_string(stanza)}",')
    lines.append(f'    ],')
    lines.append(f'  }},')
    return "\n".join(lines)

# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    # Merge all lyrics files
    merged = {}
    for path in LYRICS_FILES:
        if not os.path.exists(path):
            print(f"  WARNING: {path} not found — skipping.")
            continue
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        overlap = set(merged.keys()) & set(data.keys())
        if overlap:
            print(f"  WARNING: duplicate keys in {os.path.basename(path)}: {overlap}")
        merged.update(data)
        print(f"  Loaded {len(data)} entries from {os.path.basename(path)}")

    print(f"  Total LYRICS entries: {len(merged)}")

    # Build the JS block
    entry_strings = [entry_to_js(k, v) for k, v in merged.items()]
    new_block = "const LYRICS = {\n" + "\n\n".join(entry_strings) + "\n};"

    # Read target file
    with open(TARGET_FILE, encoding="utf-8") as f:
        source = f.read()

    # Replace the existing LYRICS block
    pattern = re.compile(r"const LYRICS = \{.*?\};", re.DOTALL)
    if not pattern.search(source):
        print("ERROR: Could not find 'const LYRICS = { ... };' in target file.")
        return

    updated = pattern.sub(new_block, source)

    with open(TARGET_FILE, "w", encoding="utf-8") as f:
        f.write(updated)

    print(f"  Updated LYRICS block in {os.path.basename(TARGET_FILE)}")

if __name__ == "__main__":
    main()
