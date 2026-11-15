# NAV-LESSON-TOP: Codex, November 15, 2026

Branch: codex/lesson-next-top, isolated /workspace/ministrybag1-codex-lesson-next.
Base main: 1ec195666c4ef9d8914d3614e54b0c2561893363.
Authorization: Dave requested reliable bottom Next navigation to the top on every visit, including previously read lessons, and meaningful next-course labels. Technical integration under standing Codex authority; no lesson editorial/artwork change or new Gold approval.

## Problem and change

showSession previously called smooth scroll while retaining focus on the bottom button. Moving from the bottom of 101-01 left 101-02 far below its start during the animation. Only 101 had a next-course label; 201/202 endings disabled Next, and the 101 course transition did not update the URL to 201-1.

The runtime diff is limited to index.html navigation: refresh the destination widgets/layout first, focus the lesson heading with preventScroll and tabindex -1, then scroll immediately to top/left 0. No delayed resets fight later user scrolling. This applies equally to completed/revisited lessons and Previous/TOC/hash lesson selection, which already share showSession.

Next within a course says Next lesson. The last lesson names and opens the next available course in cached curriculum order, uses its first loaded lesson, and updates the URL. Current boundaries are 101 to 201 Growing Deep, 201 to 202 Growing Up and 202 to 203 Growing Out. Coming Soon courses remain excluded from automatic progression, so 203 ends with Back to courses and instant home top. Existing 301 content/status is unchanged. Duplicate Next activation while a course loads is ignored because the loaded lesson list is empty, and the control is disabled until the new navigation renders.

All lesson JSON, prose/Scripture, question IDs/objects, reading keys, saved-answer code, Gold content, artwork and widget files are unchanged. Navigation does not reset answers, completion or John reading notes. No manual deployment, Hosting settings or generated image-map changes.

## Verification

- npm ci: exit 0, pinned dependencies installed.
- Reproduction: scripts/lesson_navigation_browser_check.js against unchanged main fails the first 375px Next assertion, 101-02 immediately starts at top (expected baseline exit 1). The implemented fix passes.
- node scripts/lesson_navigation_browser_check.js: exit 0, 964 assertions across 375/390/1280 and 390 reduced motion. Every transition across all 37 published lessons; completed lessons, a real revisit using Previous then Next, keyboard activation, immediate and settled top, heading focus, mobile width, labels, correct first-lesson hashes, final home, all synthetic current/retired answers, actual edited response after course changes/reload, unchanged completion store, restored John 1 checkbox and notes.
- bash scripts/qa_foundation.sh: exit 0, all foundation suites passed.
- node scripts/test_lesson_export.js: exit 0, 186 checks.
- node scripts/test_answer_storage.js: exit 0, 64 checks.
- node scripts/check_lesson_assets.js: exit 0, 136 resolved references.
- node scripts/test_lesson_images.js: exit 0, 1465 checks.
- node scripts/test_widget_iframe.js: exit 0, 32 checks.
- ENG003_BASE_URL=http://127.0.0.1:8820/index.html node scripts/eng003_browser_check.js: exit 0, system Chromium launch shim.
- Extracted inline JavaScript parses; git diff --check passes; data/widgets/images diff is empty.

Browser cases use isolated contexts, synthetic data and stub account code. The test fixture uses the actual course-prefixed John storage/DOM keys. TASKS, board, handoff and technical brief record the behavior. Final-head QA, exact Firebase preview, merge and live verification evidence are recorded on the integration PR after this tracking commit.
