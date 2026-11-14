# WIDGET-201-10-CIRCLE: Codex integration, November 14, 2026

PR #243: https://github.com/davepartin/ministrybag1/pull/243
Integration branch: codex/review-243, pushed normally to gemini/widget-201-10-learning-circle.
Initial base main: 4620a9efb4c3fc00806e41647fe626fb19b59b16. Updated normally onto c297170c911bb6473eed5733d9f58f0f6f5c1c08 after approved PR #202 merged during verification. No conflicts; the current main 202-01 changes are preserved, and are not part of this PR diff.

## Approval and scope

Dave explicitly approved the widget component at 9aee2c371e700b2badaef484230992e5a906c10a in chat and authorized technical integration/merge/live verification. This is not whole-lesson Gold or copy approval for 201-10.

widgets/learning-circle2.html is byte-identical to that approval. SHA256: 73503f6215404d830c81a1b70b11dfc8469cab55dc6f776601b7875e2e504dd4. SVG curves, spacing, frame, card copy and colors are unchanged by Codex. The only runtime diff from main is that widget. All lesson JSON files, index.html, images, other widgets, question objects/IDs, reading keys and saved-answer code remain unchanged. Existing lesson embed already points at learning-circle2.html; no new wiring is needed.

Codex strengthened only the submitted browser test: correct documented viewport heights, current-format migration marker, synthetic active/retired/other-lesson answers, keyboard Begin/dot controls, sizing/touch targets, console errors, actual answer edit/reload and Email retention/isolation. No learner data or account credentials used. TASKS, TEAM-BOARD and HANDOFF record the bounded approval and integration.

## Verification

All actual exit codes 0:

- npm ci: pinned dependencies installed in the isolated worktree.
- bash scripts/qa_foundation.sh: all foundation suites passed.
- node scripts/test_lesson_export.js: 186 checks passed.
- node scripts/test_answer_storage.js: 64 checks passed.
- node scripts/check_lesson_assets.js: 140 references resolved initially; 139 after main PR #202 retired its old Cross the Road embed. Both runs exit 0.
- node scripts/test_lesson_images.js: 1495 checks passed.
- node scripts/test_widget_iframe.js: 32 checks passed.
- GT_BASE_URL=http://127.0.0.1:8817/index.html GT_CHROMIUM_PATH=/usr/bin/chromium node scripts/widget_201_10_learning_circle_browser_check.js: 196 assertions passed, 375x667, 390x844 and 1280x800 plus 390x844 reduced motion.
- Extracted inline widget scripts: node --check passed. Zero em dashes in approved HTML. git diff --check passed.

Browser checks cover all six stops, Back, direct dots, restart, keyboard Enter/Space, fixed card height, visible navigation, no page/widget horizontal overflow, accessible SVG description, no widget storage writes, no idle iframe mutations, no page/console/widget HTTP errors, preserved synthetic current/retired/other-lesson data, edited response after reload and correct Email export isolation. Reviewed 390px screenshots of Path, Believe and restored states.

Final exact-head preview Action/checks, widget/lesson/index byte comparisons, CLEAN merge state, merge SHA and production deployment/browser results are recorded on PR #243 after the tracking commit. No manual deployment or Hosting configuration change is part of this task.

First integrated preview a7f9fb1: Action 43653239209 succeeded; bot comment confirmed that exact SHA. Widget, 201-10 JSON and index bytes matched. Embedded 196 assertions and direct-widget checks at 390/1280 passed, with CLEAN merge state and green checks. Main then advanced through PR #202; rerun results for the final combined head are recorded on PR #243.

Combined current-main repository rerun: foundation, export 186, storage 64, assets 139, images 1495 and iframe 32 all exit 0. No scope or approved widget changes.
