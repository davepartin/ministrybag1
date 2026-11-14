# 202-01 Opening Flow and Greatest Commandment Widget Placement Log

- **Date:** November 13, 2026
- **Agent:** Gemini
- **Branch:** `gemini/202-01-great-command-flow` (branched from `origin/main` at `ce81ce3`)
- **Status:** `REVIEW` (stopped at review for Dave and Codex integration)
- **Relationship to open PR #202 (`claude/trim-202-01`):** Open PR #202 trims prose across `202-01.json` and pre-dates PR #211's `great-command-v5-202.html` wiring on `main`. This branch builds on `main` (`ce81ce3`), restructures the `202-01` opening flow and Greatest Commandment placement, and removes `cross-the-road.html` without touching PR #220 (`gemini/widget-202-headers`).

## Summary of Changes

1. **Top 3-Circle Logo Support (`discipleship/index.html`):**
   - Added optional `"placement": "top"` support for an image block at `blocks[0]` via shared `renderImageBlockHtml()`, rendering the top hero image above `.session-title-row` without duplicating image-rendering logic and skipping index `0` in the block loop.
   - Added `.block-image.block-image-top-hero` (`margin: 0 0 20px;`) and `.session-description:has(+ .block-text)` (`margin-bottom: 16px;`) so `202-01`'s two opening paragraphs group cleanly between the Lesson 1 title and the Good Samaritan sequence.
2. **Lesson `202-01` Structure & Copy (`discipleship/data/202-01.json`):**
   - Moved `images/202-3circles-logo.png` to `blocks[0]` with `"placement": "top"` so it appears at the top above `Lesson 1: Loving Your Neighbors`.
   - Revised the opening 2 paragraphs (`description` + `blocks[1]`) to introduce the entire `202` **Growing Up** course on the foundation of `201` (**Growing Deep** / Greatest Commandment: God loved us first and sends us out to love others), naming **your family, your church family, and your neighbors**, and leading directly into the Good Samaritan sequence.
   - Placed the Good Samaritan scroll sequence (`images/202-01-good-samaritan-seq-1.jpg` ... `seq-4.jpg`), parable, and `202-01-1` immediately after the two opening paragraphs (removing the early pre-story `great-command-v5-202.html` block).
   - Placed `widgets/great-command-v5-202.html` (`"title": "The Greatest Commandment"`, `"height": "560px"`) inside **"The Second Is Like the First"** right after `Matthew 22:37-39` and the `"Christ loved you first"` teaching paragraph, with a concise transition sentence inviting learners to explore the widget.
   - Removed `widgets/cross-the-road.html` and the orphaned `"Walk down the road and watch the question turn around."` sentence from **"Who Is My Neighbor?"**.
   - Updated **"Lesson 1 Review"** to reinforce that Jesus loved us first and sends us out to love our family, church family, and neighbors.
   - Preserved all seven existing question IDs (`202-01-1`, `202-01-2`, `202-01-3`, `202-01-4`, `202-01-key`, `202-01-step`, `202-01-prayer`), Good Samaritan sequence assets/stops, and zero em dashes (`U+2014`).
3. **Browser Regression Check Update (`discipleship/scripts/studio_v5_browser_check.js`):**
   - Updated the `202` layout assertion on line 34 to verify `cross-the-road.html` is removed (`count() === 0`) and `great-command-v5-202.html` follows `.block-parable`, keeping `201` and `203` assertions intact.

## Exact Verification Results

- `bash scripts/qa_foundation.sh`: exit `0` (all JSON parse, lesson counts, question IDs, uniqueness, assets, 32 widget iframe checks passed).
- `node scripts/test_lesson_export.js`: exit `0` (`177 check(s) passed`).
- `node scripts/test_answer_storage.js`: exit `0` (`64 check(s) passed`).
- `node scripts/check_lesson_assets.js`: exit `0` (`126 src/image/imageBw/imageColor/imageSequence references resolve to files`).
- `node scripts/l202_01_sequence_browser_check.js`: exit `0` (`92 L-202-01 sequence browser checks passed` across `375`, `390`, `1280`).
- `node scripts/studio_v5_browser_check.js`: all `202` layout/flow assertions passed (`cross-the-road replaced`, `v5 widget follows parable teaching`, `all existing prose renders`, `all question fields unchanged`, `saved answer restored`, `correct final course introduction`, `Back`/`keyboard`/`Start Over`, `no widget HTTP or page errors`); pre-existing `idle DOM/height stable` timing assertion on line 55 failed intermittently after `Start Over` across unmodified `201`, `202/1280`, and `203` due to `widget-iframe.js` initial `560px -> 606px` height adjustment (`DIAG mut: [] fw: [ '606px', '606px' ]`).
- Playwright visual inspection (`390x844` and `1280x800`): verified `202-3circles-logo.png` centered at top, `Lesson 1: Loving Your Neighbors` + 2 course-setup paragraphs + Good Samaritan sequence immediately below, `The Greatest Commandment` 202 widget cleanly integrated after `Matthew 22:37-39`, and `scrollWidth === innerWidth` (`0px` horizontal overflow).
