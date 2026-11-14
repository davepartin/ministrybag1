# INTEGRATE-202-05-MOSAIC

Date: November 13, 2026 (America/Chicago). Agent: Codex.
Task: WIDGET-202-05-MOSAIC / PR #215.

Dave approved the widget's look and wording at `e82ed365cbf412378aa3e930296b620137e407af` and explicitly authorized technical review, optional wiring and merge. Integrated the latest main (`d4fdea8`) with a normal merge before editing. Only TASKS.md conflicted; both agents' task rows were preserved.

## Final change

Replace the Valley Road embed with `widgets/trust-the-artist.html`, titled Trust the Creator, and place it immediately after the cross paragraph under God Meant It for Good, before the pastoral care paragraph. The existing same-origin iframe host sizes it to its contents. Keep `widgets/valley-road.html` on disk and byte-identical to main.

The approved mosaic HTML is byte-identical to `e82ed36`. Comparing the complete JSON objects with widget blocks excluded proves all lesson metadata, block order, prose, Scripture and eight question objects unchanged. No question IDs, answer keys, reading keys, images, Firebase settings or workflows changed. This component approval does not approve the complete lesson or decide its Piper credit.

## Verification

Fresh `npm ci` in the isolated worktree: exit 0. Commands below run from discipleship/:

| Command | Result | Exit |
|---|---|---|
| `bash scripts/qa_foundation.sh` | Pass, including 32 iframe checks and 415 bundled-John checks | 0 |
| `node scripts/test_lesson_export.js` | 177 checks | 0 |
| `node scripts/test_answer_storage.js` | 64 checks | 0 |
| `node scripts/check_lesson_assets.js` | 127 references resolved | 0 |
| `node scripts/test_lesson_images.js` | 1368 checks | 0 |
| `node scripts/widget_202_05_mosaic_browser_check.js` | 200 checks | 0 |
| `GT_CHROMIUM_PATH=/usr/bin/chromium GT_SCREENSHOT_DIR=/workspace/scratch/mosaic215-shots node scripts/mosaic_lesson_browser_check.js` | 270 checks across 375/390/1280 widths and both motion preferences | 0 |

The standalone command uses `NODE_OPTIONS=--require=/workspace/scratch/chrome-shim.cjs` to select system Chromium in this cloud environment. The first standalone run had 199 passes and one console error caused by the local fixture's missing favicon. Its server now returns 204 for that exact optional request, while actual asset failures remain visible; the rerun passed all 200 checks. The approved widget HTML was not edited.

Embedded checks cover placement, all six states, card and iframe fit, keyboard step selection and Start Over, Back, no horizontal overflow, idle height stability, all eight saved-answer fields, edit/reload, preservation of other-course answers and Email output. Synthetic answers only, isolated browser contexts, account script stubbed. Manually inspected embedded 390px screenshots at start, grey full-window stage and finished color state; text, drawing and controls fit.

TASKS marks WIDGET-202-05-MOSAIC DONE, as requested by Dave. Board, handoff and approval record identify this widget approval separately from whole-lesson approval. PR #215 records the exact tested head, Firebase Action preview, expected-head merge and automatic live deployment verification. No manual deployment.
