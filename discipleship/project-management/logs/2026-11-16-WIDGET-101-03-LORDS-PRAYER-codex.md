# WIDGET-101-03-LORDS-PRAYER: Codex integration, November 16, 2026

Dave explicitly approved PR #266 at 3542e12bc85b2d8793e4402d04b744737b9ebdca and requested checks, merge and live verification. Worktree: /workspace/ministrybag1-codex-review266. Integration branch: codex/review-266, published normally to gemini/widget-101-03-lords-prayer. Claim: 3ca3134. Current main #267 course-review documentation was merged normally with no conflicts; both histories remain intact.

## Scope and review

Preserve exact approved widgets/lords-prayer.html, title The Lord's Prayer, scripts/widget-iframe.js registration, data/101-03.json and submitted browser-check bytes. The accordion uses native named details/summary plus an exclusivity fallback, native keyboard controls, inline heading drawers, six teaching steps and closing praise, reduced motion and responsive sizing. No learner data or browser storage is written by the widget.

Widget SHA-256: 973a5c6cb3b5b0d460ae51df4b949e921cb6cc1019428d36718d5c40c33fcfaf.

A structural comparison proves that replacing just the new widget block with the original static The Lord's Prayer verse block yields current main 101-03.json exactly. All other prose, Scripture, six-step teaching, active question objects (3-1, 3-2, 3-4, 3-hand, 3-key, 3-step, 3-devos, 3-prayer), John 7-9 and the existing Daily Prayers tool are unchanged. No retired question identity, saved-answer implementation, index.html, other lesson, existing widget or artwork changes.

The original Gemini task/board/log history and the #267 course review remain intact. TASKS/TEAM-BOARD mark the approved widget DONE; HANDOFF and 101 baseline/status record the exact component. Text remains Silver with Dave's existing edits protected. This is not whole-lesson Gold, a wording rewrite or new story-art approval. No Firebase settings, billing, retention, publishing workflow or manual deploy changes.

## Local verification

Pinned npm ci: exit 0, 11 packages. All commands from discipleship/; actual exit codes checked:

- bash scripts/qa_foundation.sh: exit 0, all foundation suites pass.
- node scripts/test_lesson_export.js: exit 0, 186 checks.
- node scripts/test_answer_storage.js: exit 0, 64 checks.
- node scripts/check_lesson_assets.js: exit 0, 142 references.
- node scripts/test_lesson_images.js: exit 0, 1505 checks.
- node scripts/test_widget_iframe.js: exit 0, 32 checks.
- GT_CHROMIUM_PATH=/usr/bin/chromium LP_BASE_URL=http://127.0.0.1:8829/index.html LP_SCREENSHOT_DIR=/workspace/scratch/pr266-screens node scripts/widget_101_03_lords_prayer_browser_check.js: exit 0, 225 checks unchanged.

Browser jobs: 375x812, 390x844, 1280x800 and 390 reduced motion. Coverage includes all seven accordion rows, exclusivity and inline headings, each navigation state, stable fitting iframe sizing, direct row taps, native keyboard operation, reduced-motion state, no horizontal overflow/errors, zero widget storage writes/idle mutations, all eight existing synthetic answers restored and retained through edit/reload/Email. No real learner data used. Screenshot of closing praise inspected; no approved visual changes made.

## Exact-head preview and production

Final head, deployed-byte comparisons, Action results, merge and live #101-3 browser evidence are recorded in PR #266 verification comments. These must pass before the task is called released. User approved merge explicitly; no further visual approval is required for preserved approved bytes.
