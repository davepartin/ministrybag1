# WIDGET-202-10-BAPTISM: Codex integration, November 15, 2026

PR #246: https://github.com/davepartin/ministrybag1/pull/246
Approved source: 3c3b32827cc419d856e5407eb928f7356133be22.
Integration branch: codex/review-246, normal push to gemini/widget-202-10-baptism.
Current main integrated: 5a7578e224004b1194c077bb2ff2c7f9ff0d80cc.

## Approval and preservation

Dave explicitly approved the Baptism / 202-10 widget and its block placement. This is component approval only, not whole-lesson Gold or new approval of 202-10 prose. Current main was merged normally. Only TASKS and TEAM-BOARD append conflicts required resolution; both histories and task rows are preserved, including completed navigation work. No generated image-map merge or edit.

The following remain byte-identical to the approved source: widgets/baptism-picture.html, data/202-10.json, scripts/widget-iframe.js and scripts/widget_202_10_baptism_browser_check.js. Widget SHA256: 99b66a63b472afd86fc6bfd8473cbe8f1525f8429b28f9c08b9d033fb2eeccba. No SVG curves, copy, layout, title/tag, color or animation changes by Codex. The new widget block follows exactly the paragraph ending Jesus gave the picture first, then did the work, and now you step into the same picture to point back at what He did for you. The helper adds only the Baptism fallback-title entry.

Removing that one block from the candidate JSON yields exactly current main's complete JSON object: all other prose, Scripture, questions/IDs, readings and metadata are unchanged. Main index.html, all other lessons, artwork, saved-answer logic and companion widgets/two-ordinances.html remain untouched. The companion is reserved for later Lord's Supper work; no replacement is part of this PR.

The approved submitted browser test is unchanged. Codex added only a separate integration script for standalone keyboard controls, card/navigation geometry and complete saved-answer/edit/reload/revisit/Email checks with isolated synthetic data. Board, TASKS and HANDOFF record the exact component approval.

## Verification

Actual exits 0:

- npm ci: 11 pinned packages installed in isolated worktree.
- bash scripts/qa_foundation.sh: all foundation suites passed.
- node scripts/test_lesson_export.js: 186 checks passed.
- node scripts/test_answer_storage.js: 64 checks passed.
- node scripts/check_lesson_assets.js: 137 references resolved.
- node scripts/test_lesson_images.js: 1465 checks passed.
- node scripts/test_widget_iframe.js: 32 checks passed.
- GT_BASE_URL=http://127.0.0.1:8822/index.html GT_CHROMIUM_PATH=/usr/bin/chromium node scripts/widget_202_10_baptism_browser_check.js: 112 assertions passed unchanged, 375/390/1280 and reduced motion embedded in 202-10.
- BAPTISM_BASE_URL=http://127.0.0.1:8822 node scripts/baptism_202_10_integration_browser_check.js: 114 checks passed. Standalone HTTP/title/tag, keyboard Begin/four stops, fixed card height and fitting navigation, Back/dots/restart, zero console/page errors/overflow. Embedded HTTP/fallback title, both widgets loaded, all seven current answers restored and retained through use/edit/reload/another-lesson navigation/revisit, correct Email inclusion/isolation. Current-format migration marker and another-lesson synthetic answer used; no real account/data.
- Inline scripts extracted: node --check passed. Zero em dashes in approved widget. git diff --check passed. Scope/byte guards passed.

Phone intro and New Life screenshots inspected. Final-head repository QA, exact-head Firebase preview/checks, CLEAN merge state, exact file comparisons, merge SHA and live HTTP/browser results are recorded on PR #246 after the tracking commit. No manual deploy, preview deletion or Hosting configuration changes.
