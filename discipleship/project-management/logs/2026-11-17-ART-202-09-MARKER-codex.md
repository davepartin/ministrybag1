# ART-202-09-MARKER: Codex integration

Date: November 17, 2026. PR #279, source branch gemini/202-09-story-art. Own isolated worktree /workspace/ministrybag1-codex-review279, local branch codex/review-279. Approved source: c053695840939c50bc48e67803b8ec463b4e7d77. Base main: 03524f6616094917e89b042e114193b432cf0bfc.

## Authorization and preservation

Dave explicitly requested review, verification and merge of the approved PR. Inspected both 1280x720 source JPGs. B&W marker linework, color accents and composition match the approved submission. All nine submitted source/delivery/map/JSON/image-guide files remain byte-identical to c053695. No manual map edit or asset regeneration during integration.

Compared each 202-09 top-level field and block to current main. Exactly one image block differs; all other metadata, prose, Scripture, question objects/IDs and reading keys are identical. New image block retains frame and touchNext and enables imageDissolveOnEntry. All widget and runtime bytes remain unchanged. Explicit byte comparisons pass for 202-03.json, 202-04.json, starting-gun.html, index.html and both older 202.09-david-roof PNGs. No lesson Gold approval is inferred.

Only project-management tracking is added during integration. No edits to submitted artwork or other authored content. Prior 201-04 timing draft PR #274 remains separate and unmerged.

## Local verification

Pinned dependencies installed with npm ci, exit 0. Commands run from discipleship; actual exits checked.

- bash scripts/qa_foundation.sh: exit 0, all foundation suites.
- node scripts/test_lesson_export.js: exit 0, 186.
- node scripts/test_answer_storage.js: exit 0, 64.
- node scripts/check_lesson_assets.js: exit 0, 144.
- node scripts/test_lesson_images.js: exit 0, 1543.
- node scripts/test_lesson_assets.js: exit 0, 8.
- node scripts/test_widget_iframe.js: exit 0, 32.
- NODE_OPTIONS=--require=/workspace/scratch/chrome-shim.cjs GT_REVIEW_BASE_URL=http://127.0.0.1:8847/index.html node scripts/review_202_08_09_browser_check.js: exit 0, 26.
- NODE_OPTIONS=--require=/workspace/scratch/chrome-shim.cjs PERF001B_BASE_URL=http://127.0.0.1:8847/index.html node scripts/perf001b_browser_check.js: exit 0, 387.
- GT_CHROMIUM_PATH=/usr/bin/chromium GT_BASE_URL=http://127.0.0.1:8847/index.html node scripts/widget_202_09_starting_gun_browser_check.js: exit 0, 294.
- Scratch focused roof dissolve/answer check: exit 0, 111 across 375x667, 390x844, 1280x800 and reduced motion. New responsive copies load; layers align; framed image stays joined to story; B&W initial hold, partial dissolve and fully colored centered finish work; entire image visible at finish; synthetic saved answers restore and survive edit/reload; no page exceptions or sideways overflow. No real learner data used.
- Structured source/main preservation comparisons pass. git diff --check passes.

## Preview and publication evidence

Final exact-head Action/check status, hosted-byte comparison, browser results, merge SHA and production Action/live results are posted on PR #279. Tracking marks the authorized integration complete; final deployment evidence is attached after automatic publication, without creating a documentation-only deployment loop. Firebase settings, workflows and manual deployments are untouched.
