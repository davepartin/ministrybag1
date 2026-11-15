# ART-STORY-SEQUENCES-B2: Codex integration, November 15, 2026

PR #248: https://github.com/davepartin/ministrybag1/pull/248
Approved source: ae5c9d450d1b4bfbcd1fdead69190fd8bde4bdac.
Base main: 0480267243cd3e1a4d4ba05af1960b7003c1b247.
Branch: codex/review-248, normal push to gemini/story-art-sequences-batch2.

## Scope and exact approval

Dave authorized these artwork changes and production integration. 101-07 keeps its exact JSON and first three frames; frame 4 JPG and two WebPs match ae5c9d4 exactly. Frame-4 SHA256 6a01c0840b317dea7d9e1d2d24581d145c52a6a46cbe2b5b58e53bb005a178e3 matches the editorial baseline. Reviewed the image: cloak has no terracotta accent. Decoded JPEG has zero pixels with channel spread >24 (before: 5194). Small near-neutral JPEG residuals remain in the approved source; no re-encoding by Codex.

203-02 JSON is byte-identical to pre-#240 a3beacb. Only its sequence image block is removed relative to current main. Three source JPGs and six WebP copies deleted as approved. No replacement artwork added. All non-image JSON, prose, Scripture, questions/IDs and reading keys compare unchanged. 201-05, 203-07 and 203-08 JSON are byte-identical to main. Their assets, original jesus-sends-72.jpg, static Paul/Timothy image, all widgets, index and saved-answer code are untouched.

node scripts/build_lesson_images.js exits 0 and leaves approved image assets/map byte-identical to ae5c9d4. Every retained manifest entry besides frame 4 is unchanged; only the three prayer entries disappear. No manual image-map edit or merge.

PROJECT-STATE, DAVE, HANDOFF, TASKS and TEAM-BOARD supersede the affected historical four-story inventory. The 101 status/baseline record the new frame-4 approval. 203-08 stays static; unassigned ART-008 color work is paused. Whole-lesson approval/stages unchanged.

## Verification

Actual exits 0:

- npm ci: pinned dependencies installed in the isolated worktree.
- node scripts/build_lesson_images.js: cached build; no diff from approved assets/map.
- bash scripts/qa_foundation.sh: all foundation suites passed.
- node scripts/test_lesson_export.js: 186 checks passed.
- node scripts/test_answer_storage.js: 64 checks passed.
- node scripts/check_lesson_assets.js: 136 references resolved.
- node scripts/test_lesson_images.js: 1465 checks passed.
- node scripts/test_lesson_assets.js: 8 tests passed.
- node scripts/test_widget_iframe.js: 32 checks passed.
- GT_STORY_SEQ_BASE_URL=http://127.0.0.1:8819/index.html node scripts/story_art_sequences_browser_check.js: 266 checks passed. 101-07/201-05/203-07 frame load, stops/scroll, last-frame visibility, touchNext, no layout shift, current answers/edit/reload/Email and reduced motion. Added explicit 203-02 no-sequence/no-old-asset-request checks and 203-08 single static image/load/touchNext guards at 375/390/1280 and reduced motion.
- L20302_BASE_URL=http://127.0.0.1:8819/index.html node scripts/l203_02_03_browser_check.js: 39 checks passed.
- L20307_STORY_BASE_URL=http://127.0.0.1:8819/index.html node scripts/l203_07_story_image_browser_check.js: 69 checks passed.
- L20308_BASE_URL=http://127.0.0.1:8819/index.html node scripts/l203_08_browser_check.js: 34 checks passed.

Browser runs use system Chromium via launch shim, synthetic answers and no real accounts. Final-head QA, exact-head Firebase preview, byte comparisons, CLEAN state, merge SHA and production results are recorded on PR #248 after the tracking commit. No manual deploy or Hosting configuration change.
