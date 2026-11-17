# UI-202-01-COMPACT-HEADER

November 17, 2026. Owner Codex, branch codex/compact-lesson-header, own worktree /workspace/ministrybag1-codex-compact-header. Base main c748ea71497a51c8814a0e2b765b24f2ee6446a9.

## Authorization and scope

Dave asked for a smaller sticky header with no progress strip, Back on the left, lesson code and title in the middle, Menu on the right, applied to one lesson and merged for a live test. Chosen pilot: 202-01. This is direct authorization to publish this bounded UI experiment, not permission to change lesson wording, approved components or roll it out series-wide.

index.html adds scoped is-compact styles and updates the class from updateNav only when course 202 lesson 1 is current. Its extra identity label uses textContent and the current canonical lesson title. Existing course labels/progress computation remain for other lessons. The compact layout removes those elements from layout and accessibility presentation on the pilot. Header measured 49px vs original 85.1875px at all tested widths: 42.5 percent shorter. Back/Menu retain 44px targets; full title fits at standard phone widths, with ellipsis and full title attribute at 320px if necessary. Existing sticky/safe-area/save-warning positioning is retained.

No JSON, widget, artwork, answer-storage or question identity changes. No Firebase settings, workflows or manual deploys. Only index.html, a focused regression script and coordination/technical documentation change.

## Verification

Commands from discipleship, actual successful exits:

- bash scripts/qa_foundation.sh: all foundation suites pass.
- node scripts/test_lesson_export.js: 186.
- node scripts/test_answer_storage.js: 64.
- node scripts/check_lesson_assets.js: 144.
- node scripts/test_lesson_images.js: 1542.
- node scripts/test_widget_iframe.js: 32.
- GT_CHROMIUM_PATH=/usr/bin/chromium HEADER_SCREENSHOT_DIR=/workspace/scratch/compact-header node scripts/compact_lesson_header_browser_check.js: 89 checks at 320/375/390/1280 and reduced motion. Covers physical height, code/title, hidden progress, 44px targets, sticky placement, menu/Back including keyboard, return to original header on 202-02, restored pilot on return, synthetic answers across navigation/reload, overflow and zero console/page errors. Initial test expected an active home class; corrected to the existing visible/not-hidden home semantics, with no product changes.
- GT_CHROMIUM_PATH=/usr/bin/chromium NAV_BASE_URL=http://127.0.0.1:8851/index.html node scripts/lesson_navigation_browser_check.js: 964.
- NODE_OPTIONS=--require=/workspace/scratch/chrome-shim.cjs L20201_BASE_URL=http://127.0.0.1:8851/index.html node scripts/l202_01_sequence_browser_check.js: 95. Final frame remains visible below the new 49px header; iframe/art behavior is preserved.
- git diff --check and protected data/widget/art comparisons pass.

Phone screenshot inspected: 202-01 code/title on one row between Back/Menu, clear content below. Status DONE upon authorized merge/integration; final exact-head preview, PR, merge SHA and production verification are recorded in the PR discussion. Dave should test 202-01 and compare 202-02; all other headers intentionally retain their current design.
