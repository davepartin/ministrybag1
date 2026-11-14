# WIDGET-202-HEADERS: integration review

November 13, 2026 (America/Chicago). Codex. PR #220.

Dave explicitly approved `315fc757fa5fdec04382d86d766f73ca16d93593` and requested review, repository/browser checks on the PR preview, merge and live verification. Used an isolated worktree. Cleared reinstallable node_modules from completed Codex worktrees after the first checkout ran out of storage; repository files and commits were retained. Fresh checkout and `npm ci` then completed, exit 0.

Normally merged current main `ce81ce3` into the approved branch, preserving the Bookshelf and other integrations. Resolved only TEAM-BOARD/TASKS append conflicts by retaining both sides' entries.

## Scope and invariants

All eleven approved runtime files remain byte-identical to `315fc75`: great-command-v5.js and the ten named 202 HTML widgets. Both widget guides are also unchanged from the approved source. The ten HTML interaction programs are byte-identical to their pre-header versions; the shared engine changes only the three courseTag strings to 201-01, 202-01 and 203-01. No lesson JSON, questions/IDs, saved answers, Scripture, index.html, images, storage/export/iframe runtime code, Firebase settings or workflows changed.

Component approval is recorded in DAVE.md. The board/handoff and task row point to this review. This does not approve unrelated lesson material or alter protected wording/artwork.

## Repository verification

Commands run from discipleship/, actual exit codes:

| Command | Result | Exit |
|---|---|---|
| `bash scripts/qa_foundation.sh` | Pass, including 32 iframe and 415 bundled-John checks | 0 |
| `node scripts/test_lesson_export.js` | 177 checks | 0 |
| `node scripts/test_answer_storage.js` | 64 checks | 0 |
| `node scripts/check_lesson_assets.js` | 127 references resolve | 0 |
| `node scripts/test_lesson_images.js` | 1367 checks | 0 |
| `node scripts/widget_202_05_mosaic_browser_check.js` | 200 checks | 0 |
| `GT_CHROMIUM_PATH=/usr/bin/chromium GT_SCREENSHOT_DIR=/workspace/scratch/headers220-shots node scripts/widget_headers_browser_check.js` | 4154 checks across 78 embedded cases | 0 |
| `GT_REVIEW_BASE_URL=http://127.0.0.1:8804/index.html node scripts/review_202_08_09_browser_check.js` | 26 saved-answer, backup, export, layout and scrolling checks | 0 |

The standalone mosaic test uses NODE_OPTIONS to select system Chromium via the cloud shim. No product change is needed for browser selection.

## Browser scope

The embedded header matrix covers all thirteen widgets (the three v5 variants plus ten active 202 widgets), 375/390/1280 widths, and normal/reduced motion. It checks exact titles/tags, dark background/type colors, no header overlap or horizontal overflow, iframe height, teaching states, steady idle iframe sizing, every question's saved-answer restoration, zero widget storage writes, phone edit/reload and other-course answer preservation. Exercises include One Another picks, Mirror angles, all Three-Ts tabs/whole picture, all ordinance facets, and sequential teaching cards in the remaining widgets. No real learner data; isolated contexts, synthetic answers, account script stubbed.

Inspected a gallery of all thirteen 390px headers. Reviewed embedded final-state screenshots, including Mirror, Three-Ts and ordinances. Header color remains dark in the Mirror/Three-Ts final states, and the new ordinance wrapper sizes to its content. Screenshot positioning keeps the sticky lesson toolbar clear of the widget header.

Initial new-test runs exposed fixture mistakes: forward navigation needed to wait for v5's declared animation duration, and a broad Begin text match selected the 202 step dot labeled Love Begins With God. The fixture now selects the actual navigation control and waits for its animation. Approved runtime files were not modified to fix a test.

The older review_202_08_09_browser_check.js still targeted the removed lesson backup button. Updated only its test journey to Home > Backups and recovery > Download backup, keeping the existing download/storage/scroll assertions. No backup runtime behavior changed. Exact final regression totals and preview evidence are recorded on PR #220.

After pushing the tested head, wait for its Firebase Action preview, verify served runtime bytes and run the embedded matrix plus existing v5/mosaic and 202-08/09 regressions against that exact preview. The PR discussion records their results, expected-head merge and automatic Firebase/Pages deployment verification. No manual deployment.
