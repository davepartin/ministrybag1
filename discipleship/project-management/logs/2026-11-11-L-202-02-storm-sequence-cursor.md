# L-202-02: five-frame storm sequence

Date: 2026-11-11. Owner: Cursor. Branch: `cursor/l-202-02-storm-sequence`. Status: REVIEW.

## Why

Dave approved five 1712x1152 frames (`images/house-rock-seq-1.jpg` through `-5.jpg`): calm with a storm gathering, heavy storm with both houses standing, the sand house tipping, the sand house fallen into the water, and the aftermath with planks washed up. Frame lines are already gone from all five. This packet wires those frames into 202-02 as a scroll sequence. The frames themselves were not edited.

## What changed

In `data/202-02.json`, the wise and foolish builders image block that used `images/house-rock-1.png`, doubled `house-rock-2.jpg`, and `house-rock-3.jpg` with stops `[0.1, 0.35, 0.4, 0.65]` now uses the five new frames. Frame 2 is still doubled so the storm holds. Final sequence:

`["images/house-rock-seq-1.jpg", "images/house-rock-seq-2.jpg", "images/house-rock-seq-2.jpg", "images/house-rock-seq-3.jpg", "images/house-rock-seq-4.jpg", "images/house-rock-seq-5.jpg"]`

Final stops: `[0.1, 0.3, 0.38, 0.46, 0.55, 0.65]`. Same last-stop point as before. The storm holds from 0.3 through 0.38, the collapse plays in two quick beats (tipping at 0.46, fallen at 0.55), and the aftermath is nearly opaque at 0.65. `touchNext` is kept. Alt text now mentions the sand house tipping and falling into the water.

`scripts/l202_02_sequence_browser_check.js` is modeled on `scripts/l201_01_sequence_browser_check.js`. It expects six sequence entries, the new stops, 1712x1152 frames, tipping/falling alt wording, and that the last frame is still on screen at the final stop.

Phone screenshots at 390px confirmed the visual beats at those stops: both houses in gathering weather, storm hold, tipping, fallen into the water, then aftermath with the rock house standing. No stop retune was needed.

Saved-answer IDs are unchanged: `202-02-1`, `202-02-2`, `202-02-forgive`, `202-02-hand`, `202-02-key`, `202-02-step`, `202-02-prayer`. Login and provider code were not touched. The old `house-rock-1.png`, `house-rock-2.jpg`, and `house-rock-3.jpg` files remain on disk; live 202-02 no longer references them.

## Checks (from `discipleship/`)

Local server: `python3 -m http.server 8765 --bind 127.0.0.1`. Playwright used the installed Chrome via `NODE_PATH=/tmp/gt-playwright/node_modules`. Synthetic data only.

- `bash scripts/qa_foundation.sh`: passed, including 415 bundled-John checks and 84 src/image/imageBw/imageColor/imageSequence references.
- `node scripts/test_answer_storage.js`: 64 passed.
- `node scripts/test_lesson_assets.js`: 8 passed.
- `node scripts/l202_02_sequence_browser_check.js`: 61 passed at 375, 390, and 1280. Six sequence entries load, advance in order, keep touchNext, keep the seven question IDs, do not render a bw/color pair, stay on screen at the final stop, and do not shift or overlap surrounding content.

Not run: real iPhone/Safari, production deploy, Firebase preview from this log. This packet does not claim Dave's visual approval of the wired sequence; that remains his gate.
