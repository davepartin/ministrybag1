#!/usr/bin/env python3
"""Runtime-independent content validation for Heart52 V2."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
verses = json.loads((ROOT / "data/verses.json").read_text(encoding="utf-8"))
source = (ROOT.parent / "heart52/index.html").read_text(encoding="utf-8")
block = re.search(r"const verses = \[(.*?)\n\s*\];", source, re.S)
canonical = re.findall(r'\{\s*reference:\s*"([^"]+)",\s*theme:\s*"([^"]+)",\s*text:\s*"([^"]+)"\s*\}', block.group(1))
assert len(verses) == 52
assert len(canonical) == 52
assert len({v["week"] for v in verses}) == 52
assert len({v["reference"] for v in verses}) == 52
required = {"week", "reference", "theme", "text", "translation", "audio"}
for week, verse in enumerate(verses, 1):
    assert required <= verse.keys(), f"week {week}: missing required field"
    assert verse["week"] == week
    assert verse["translation"] == "ESV"
    assert re.search(r"""[.!?]["']?$""", verse["text"]), f"week {week}: punctuation"
    assert verse["audio"] == f"assets/audio/week-{week:02d}.mp3"
    reference, theme, text = canonical[week - 1]
    if not re.search(r"""[.!?]["']?$""", text):
        text = text.rstrip(",;:") + "."
    assert (verse["reference"], verse["theme"], verse["text"]) == (reference, theme, text), f"week {week}: source mismatch"

helpers = (ROOT / "js/game-helpers.js").read_text(encoding="utf-8")
for function in ("words", "normalize", "phraseChunks", "shuffled", "blankIndexes", "scoreAnswers", "nextReviewDate"):
    assert f"export function {function}" in helpers
app = (ROOT / "js/app.js").read_text(encoding="utf-8")
assert "onclick=" not in app.lower()

print("✓ 52 unique passages and required fields")
print("✓ punctuation, ESV attribution, and audio paths")
print("✓ text matches the canonical source")
print("✓ game helper exports and event-handler policy")
