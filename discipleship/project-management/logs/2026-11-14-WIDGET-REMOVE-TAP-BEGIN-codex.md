# WIDGET-REMOVE-TAP-BEGIN: Codex integration, November 14, 2026

PR #244: https://github.com/davepartin/ministrybag1/pull/244
Approved source: d10db55f60d7456c600e7b5c44c57a4fad9e3fbd.
Integration branch: codex/review-244, normal push to gemini/widgets-remove-tap-begin.
Base main: e8d56eff1e45e013202751a790a825c526b7d23d.

## Scope and preservation

Dave explicitly requested this seven-widget initial-instruction cleanup and integration. Each widget file is byte-identical to d10db55: covenant-triangle.html, cross-the-road.html, guide-spirit2.html, mission-map.html, oia-method.html, personal-ministry-map.html and three-spaces.html. Question/meaning hooks and Begin controls remain; only the triangle also skips empty card text and its trailing title margin. The GUIDE card measurement copy matches its cleaned intro.

Merged current main normally; resolved only TASKS append conflict by retaining both task rows, including completed #243. No generated image maps merged manually. learning-circle2.html stays byte-identical to its 9aee2c3 approval. All lesson JSON, index.html, images, other widget files and Gold files are unchanged from main. Questions/IDs, readings and saved-answer code are untouched. Cross the Road remains on disk but its retired lesson embed is not restored. This assignment specifically supersedes the older triangle byte freeze only for the approved intro cleanup; it grants no other wording/art changes or Gold status.

## Verification

All actual exits 0:

- npm ci: pinned dependencies installed in isolated worktree.
- bash scripts/qa_foundation.sh: all foundation suites passed.
- node scripts/test_lesson_export.js: 186 checks passed.
- node scripts/test_answer_storage.js: 64 checks passed.
- node scripts/check_lesson_assets.js: 139 references resolved.
- node scripts/test_lesson_images.js: 1495 checks passed.
- node scripts/test_widget_iframe.js: 32 checks passed.
- ENG003_BASE_URL=http://127.0.0.1:8818/index.html node scripts/eng003_browser_check.js: passed using system Chromium launch shim.
- node scripts/widget_remove_tap_begin_browser_check.js: passed all 34 direct/embedded cases. Three sizes (375x812, 390x844, 1280x800), reduced motion, retained hooks, removed instructions, keyboard Begin, Back, every Next step, restart, no horizontal overflow/console/page errors. Six active lesson embeds check iframe navigation fit and synthetic current/retired answer preservation and actual edit/reload. Account code stubbed in test contexts only. Local static server lacks a favicon; fixture returns 204 for that unrelated request rather than changing runtime files.
- Inline scripts extracted from all seven widgets: node --check passed. Zero em dashes. git diff --check passed. Runtime diff restricted to the seven authorized widgets; no JSON/index/image or unrelated widget changes.

TASKS, TEAM-BOARD and HANDOFF updated. Final-head core QA, Firebase preview Action/head evidence, exact file comparisons, CLEAN merge state, merge SHA and production browser/deployment results are recorded on PR #244 after the tracking commit. No manual deploy or Hosting configuration change.
