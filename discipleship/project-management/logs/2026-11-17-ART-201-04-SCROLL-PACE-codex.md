# ART-201-04-SCROLL-PACE: Codex

Date: November 17, 2026. Branch: codex/20104-soils-scroll-timing. Base: a9e43536be413e171d803161d05ef978f82283c8. Status: REVIEW, no merge/live change.

## Request and diagnosis

Dave: "201-04 widget starts too fast and switches too fast, take a look at it for me". Asked which component; Dave clarified "Opening four-soils scroll illustration". The five-roots widget is manual and remains unchanged. The six story frames previously completed across 66 percent of a 62-percent-viewport scroll range, about 300px on a phone. Extending the stops alone would finish after most of the image had left the screen.

## Trial behavior

Added opt-in imageSequencePaced on this sequence only. The picture stays centered below the lesson header during an ordinary scroll section of at least 600px, or 1.2 times the available viewport height. The opening holds for 20 percent of travel; the existing stops play over 70 percent; the ending holds for the last 10 percent. Then the image rejoins the story in normal document flow. No automatic advance, wheel/touch interception, forced scroll or added controls. Reverse scroll rewinds. The picture remains entirely visible, including a short 390x568 viewport. Reduced motion keeps the final static frame with no extra travel; print removes the spacer.

Preserved every approved source image, delivery copy, frame order/stop, widget byte, question ID/object, Scripture and #273 lesson wording. Compared full lesson JSON to main after removing the new boolean flag: exact equality. Shared renderer/engine changes are opt-in; legacy sequences/pairs keep their existing timing. Updated the existing 201-04 browser helper to target the paced scroll coordinates without removing any assertions. New physical browser regression checks holds, slower travel, every frame, visibility, reversal, normal release, attachment to parable, resize, print and reduced motion. It fails on old main with "longer scroll travel enabled".

## Verification

All actual exit 0 unless noted:

- npm ci.
- bash scripts/qa_foundation.sh: all foundation suites.
- node scripts/test_lesson_export.js: 186.
- node scripts/test_answer_storage.js: 64.
- node scripts/check_lesson_assets.js: 144.
- node scripts/test_lesson_images.js: 1525.
- node scripts/soils_201_04_pacing_browser_check.js: 154 at 375x812, 390x844, 1280x800, 390x568 and reduced motion.
- NODE_OPTIONS=--require=/workspace/scratch/chrome-shim.cjs L20104_BASE_URL=http://127.0.0.1:8845/index.html node scripts/l201_04_sequence_browser_check.js: all 61 assertions retained/pass.
- Scratch roots lesson/answer smoke: 57, six answers restore, edit/reload preserves 4.3, other answers retained, original root widget fits, no horizontal overflow/page errors.
- GT_CHROMIUM_PATH=/usr/bin/chromium LP_BASE_URL=http://127.0.0.1:8845/index.html node scripts/widget_101_03_lords_prayer_browser_check.js: 225.
- GT_CHROMIUM_PATH=/usr/bin/chromium ENTRY_HOLD_BASE_URL=http://127.0.0.1:8845/index.html node scripts/entry_dissolve_hold_browser_check.js: 216 unchanged two-layer entry/hold checks.
- NODE_OPTIONS=--require=/workspace/scratch/chrome-shim.cjs L20101_BASE_URL=http://127.0.0.1:8845/index.html node scripts/l201_01_sequence_browser_check.js: 58 unchanged legacy-sequence checks.
- Structured preservation comparison and git diff --check: pass.

Inspected the mobile screenshot with the full picture centered and unobscured. Final exact-head Firebase preview and any remaining regression results will be posted on the PR. This visual pacing change is awaiting Dave's review; no whole-lesson Gold or art replacement.
