# L-201-01: running father four-frame scroll sequence

Date: 2026-11-11. Owner: Cursor. Branch: `cursor/l-201-01-running-father-sequence`. Status: REVIEW.

## Why

Dave approved four gray 1248x832 frames (`images/running-father-seq-1.jpg` through `-4.jpg`). Frame 1 matches `running-father-bw3.jpeg`. Frames 2 to 4 show the father getting smaller as he runs up the road toward his son. This packet wires those frames into 201-01 as a scroll sequence. The frames themselves were not edited.

## What changed

In `data/201-01.json`, the image block that used `imageBw` `images/running-father-bw3.jpeg` and `imageColor` `images/running-father-color3.jpeg` is now an `imageSequence` plus `imageSequenceStops`, modeled on the 201-02 robe sequence. `touchNext` is kept. Alt text is now "A father running down the road toward his returning son, getting closer with each step".

Final stops: `[0, 0.18, 0.34, 0.5]`. That is the same scroll range as the three-frame robe stops `[0, 0.25, 0.45]`, with four even beats. Browser samples at 390px: frame 1 at progress 0, frame 2 by 0.26, frame 3 by 0.42, frame 4 nearly opaque at 0.5 and exclusive by 0.55. The last frame is still on screen with the parable card under it, so the run does not finish too early or too late.

Saved-answer IDs are unchanged: `201-01-1`, `201-01-2`, `201-01-3`, `201-01-key`, `201-01-step`, `201-01-prayer`. Login and provider code were not touched. The old `running-father-bw3.jpeg` and `running-father-color3.jpeg` files remain on disk; live 201-01 no longer references them.

## Checks (from `discipleship/`)

Local server: `python3 -m http.server 8765 --bind 127.0.0.1`. Playwright used the installed Chrome via `NODE_PATH=/tmp/gt-playwright/node_modules`. Synthetic data only.

- `bash scripts/qa_foundation.sh`: passed, including 415 bundled-John checks and 81 src/image/imageBw/imageColor/imageSequence references.
- `node scripts/test_answer_storage.js`: 64 passed.
- `node scripts/test_lesson_assets.js`: 8 passed.
- `node scripts/l201_01_sequence_browser_check.js`: 52 passed at 375, 390, and 1280. Four frames load, advance in order, keep touchNext, keep the six question IDs, do not render the old bw/color pair, and do not shift or overlap surrounding content.
- Manual Chrome pass of `http://127.0.0.1:8765/index.html#201-1` at 375, 390, and 1280: four frames advanced in order, parable card stayed under the image, no sideways scroll.

Not run: real iPhone/Safari, production deploy, Firebase preview. This packet does not claim Dave's visual approval of the wired sequence; that remains his gate.
