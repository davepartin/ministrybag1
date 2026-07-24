# Heart52 V2

A static Scripture-memory app for 52 ESV passages. It runs directly on GitHub Pages and stores learning progress locally in the browser.

## Preview

```sh
python3 -m http.server 8765 --directory heart52-v2
```

Open `http://127.0.0.1:8765/`.

## Validate

```sh
python3 heart52-v2/tests/validate.py
```

## Regenerate narration

The committed MP3 files use a natural neural voice. Regeneration requires Python 3 and network access:

```sh
python3 -m venv heart52-v2/.audio-env
heart52-v2/.audio-env/bin/pip install -r heart52-v2/requirements.txt
heart52-v2/.audio-env/bin/python heart52-v2/tools/generate-audio.py --force
```

Use `--voice` or `--rate` to change the narration style. No credentials are stored in the site.
