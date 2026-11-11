# L-201-01: add father-arrives fifth frame

Date: 2026-11-11. Owner: Cursor. Branch: `cursor/l-201-01-father-arrives-frame5`. Status: REVIEW.

## Why

Dave approved a fifth gray 1248x832 frame (`images/running-father-seq-5.jpg`) in which the father stands upright beside his son on the road. This packet wires that frame into the 201-01 running-father scroll sequence. The image file was already on the branch and was not edited.

## What changed

In `data/201-01.json`, `images/running-father-seq-5.jpg` is the fifth `imageSequence` entry. Stops are `[0, 0.16, 0.3, 0.44, 0.58]`, five even beats over a similar scroll range as the four-frame stops `[0, 0.18, 0.34, 0.5]`. Alt text is now "A father running down the road toward his returning son until he reaches him". `touchNext` is kept.

`scripts/l201_01_sequence_browser_check.js` now expects five frames, the new stops, arrival wording in the alt, and that the last frame is still on screen at the final stop.

Browser samples at 390px: frame 1 at progress 0, frame 2 by 0.23, frame 3 by 0.37, frame 4 by 0.51, frame 5 nearly opaque at 0.58 (0.931) and exclusive by 0.63. At 0.58 the wrap top is about 120px with viewport 844, so the arrival is still on screen with the parable card under it. No stop retune was needed.

Saved-answer IDs are unchanged: `201-01-1`, `201-01-2`, `201-01-3`, `201-01-key`, `201-01-step`, `201-01-prayer`. Login and provider code were not touched.

## Checks (from `discipleship/`)

Local server: `python3 -m http.server 8765 --bind 127.0.0.1`. Playwright used the installed Chrome via `NODE_PATH=/tmp/gt-playwright/node_modules`. Synthetic data only.

- `bash scripts/qa_foundation.sh`: passed, including 415 bundled-John checks and 82 src/image/imageBw/imageColor/imageSequence references.
- `node scripts/test_answer_storage.js`: 64 passed.
- `node scripts/test_lesson_assets.js`: 8 passed.
- `node scripts/l201_01_sequence_browser_check.js`: 58 passed at 375, 390, and 1280. Five frames load, advance in order, keep touchNext, keep the six question IDs, do not render the old bw/color pair, stay on screen at the final stop, and do not shift or overlap surrounding content.

Not run: real iPhone/Safari, production deploy, Firebase preview from this log. This packet does not claim Dave's visual approval of the five-frame sequence; that remains his gate.
