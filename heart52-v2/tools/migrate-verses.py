#!/usr/bin/env python3
"""One-time, deterministic migration of the canonical Heart52 verse array."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "heart52" / "index.html"
OUTPUT = ROOT / "heart52-v2" / "data" / "verses.json"

source = SOURCE.read_text(encoding="utf-8")
block = re.search(r"const verses = \[(.*?)\n\s*\];", source, re.S)
if not block:
    raise SystemExit("Canonical verse array not found")

pattern = re.compile(
    r'\{\s*reference:\s*"([^"]+)",\s*theme:\s*"([^"]+)",\s*text:\s*"([^"]+)"\s*\}'
)
items = pattern.findall(block.group(1))
if len(items) != 52:
    raise SystemExit(f"Expected 52 verses, found {len(items)}")

verses = []
for week, (reference, theme, text) in enumerate(items, 1):
    if text[-1] not in ".?!'\"":
        text = text.rstrip(",;:") + "."
    verses.append({
        "week": week,
        "reference": reference,
        "theme": theme,
        "text": text,
        "translation": "ESV",
        "audio": f"assets/audio/week-{week:02d}.mp3",
    })

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(json.dumps(verses, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Wrote {len(verses)} verses to {OUTPUT}")
