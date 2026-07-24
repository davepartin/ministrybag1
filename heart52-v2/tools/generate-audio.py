#!/usr/bin/env python3
"""Generate Heart52 narration MP3s with Microsoft Edge neural TTS."""
import argparse
import asyncio
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]

async def generate(verse, voice, rate, force):
    output = ROOT / verse["audio"]
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists() and output.stat().st_size > 0 and not force:
        return "skipped", output
    narration = f'{verse["reference"]}. {verse["text"]}'
    temp = output.with_suffix(".tmp.mp3")
    try:
        await edge_tts.Communicate(narration, voice, rate=rate).save(str(temp))
        temp.replace(output)
        return "created", output
    except Exception:
        temp.unlink(missing_ok=True)
        raise

async def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--voice", default="en-US-JennyNeural", help="Edge TTS neural voice")
    parser.add_argument("--rate", default="-5%", help="Speech rate adjustment")
    parser.add_argument("--force", action="store_true", help="Replace existing MP3s")
    args = parser.parse_args()
    verses = json.loads((ROOT / "data/verses.json").read_text(encoding="utf-8"))
    created = skipped = failed = 0
    for verse in verses:
        try:
            status, output = await generate(verse, args.voice, args.rate, args.force)
            created += status == "created"
            skipped += status == "skipped"
            print(f'{status:7} week {verse["week"]:02d}: {output.name}')
        except Exception as error:
            failed += 1
            print(f'failed  week {verse["week"]:02d}: {type(error).__name__}: {error}')
    print(f"\nCreated {created}, skipped {skipped}, failed {failed}.")
    if failed:
        raise SystemExit(1)

if __name__ == "__main__":
    asyncio.run(main())
