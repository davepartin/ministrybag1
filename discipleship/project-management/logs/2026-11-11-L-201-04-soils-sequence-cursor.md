# L-201-04: six-frame soils sequence

Date: 2026-11-12. Owner: Cursor. Branch: `cursor/l-201-04-soils-sequence`. Status: REVIEW.

## Why

Dave approved six 1248x832 frames (`images/soils-seq-1.jpg` through `-6.jpg`): four side-by-side windows of hard path, rocky ground, thorny ground, and good soil, progressing together from seed falling to harvest. This packet wires those frames into 201-04 as a scroll sequence. The frames themselves were not edited.

## What changed

In `data/201-04.json`, the image block that used `imageBw` `images/soils-bw.jpeg` and `imageColor` `images/soils-color.jpg` is now an `imageSequence` plus `imageSequenceStops`, modeled on the 201-01 running father and 202-02 house-rock sequences, with the 201-02 robe as the precedent. `touchNext` is kept. Alt text now describes the four windows progressing together: birds take the seed, the sun scorches the shallow sprouts, thorns wrap and choke the plant, and good soil grows grain that multiplies.

Final sequence:

`["images/soils-seq-1.jpg", "images/soils-seq-2.jpg", "images/soils-seq-3.jpg", "images/soils-seq-4.jpg", "images/soils-seq-5.jpg", "images/soils-seq-6.jpg"]`

Final stops: `[0, 0.14, 0.27, 0.4, 0.53, 0.66]`. Browser samples at 390px: frame 1 at progress 0, frame 2 by 0.14, frame 3 by 0.335, frame 4 by 0.465, frame 5 by 0.595, frame 6 nearly opaque at 0.66 and exclusive by 0.71. The last frame is still on screen with the parable card under it. No stop retune was needed.

Saved-answer IDs are unchanged: `201-04-1`, `201-04-2`, `201-04-3`, `201-04-key`, `201-04-step`, `201-04-prayer`. Login and provider code were not touched. The old `soils-bw.jpeg` and `soils-color.jpg` files remain on disk; live 201-04 no longer references them.

## Checks (from `discipleship/`)

Local server: `python3 -m http.server 8765 --bind 127.0.0.1`. Playwright used the installed Chrome via `NODE_PATH=/tmp/gt-playwright/node_modules`. Synthetic data only.

- `bash scripts/qa_foundation.sh`: passed, including 415 bundled-John checks and 88 src/image/imageBw/imageColor/imageSequence references.
- `node scripts/test_answer_storage.js`: 64 passed.
- `node scripts/test_lesson_assets.js`: 8 passed.
- `node scripts/l201_04_sequence_browser_check.js`: 61 passed at 375, 390, and 1280. Six sequence entries load, advance in order, keep touchNext, keep the six question IDs, do not render a bw/color pair, stay on screen at the final stop, and do not shift or overlap surrounding content.

Phone screenshots at 390px confirmed the visual beats at those stops: seed falling, birds and first sprouts, birds taking seed and sun scorching, thorns wrapping with roots in good soil, thorns choking and two heads of grain, then harvest that multiplies. No stop retune was needed.

Not run: real iPhone/Safari, production deploy, Firebase preview from this log. This packet does not claim Dave's visual approval of the wired sequence; that remains his gate.
