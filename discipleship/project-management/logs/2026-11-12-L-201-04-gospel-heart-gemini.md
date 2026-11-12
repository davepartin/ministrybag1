# L-201-04: Gospel Heart soil in widget and lesson prose

Date: 2026-11-12. Owner: Gemini. Branch: `gemini/l-201-04-gospel-heart`. Status: REVIEW.

## Why

Dave requested changing the `201-04` widget (`widgets/deep-roots.html`) so the soil watermark reads "Gospel Heart" (with "Gospel" on top and "Heart" on the next line as bold words in the soil as the roots come down) instead of "JESUS", and cleaning up the `201-04` lesson wording so the good soil is described as a gospel heart (which shares both the heart posture and the nutrients of the soil) rather than describing Jesus Himself as the soil.

## What changed

1. **Widget (`widgets/deep-roots.html`)**:
   - Replaced the single-line `JESUS` soil watermark with two stacked bold SVG text lines: `Gospel` (`y: 164`) on top and `Heart` (`y: 232`) below in `font-size: 66`, `font-weight: 900`, centered in the soil behind the five roots.
   - Updated the initial card (`step === -1`, "A Gospel Heart") and `aria-label` attributes to describe the five spiritual disciplines as roots growing down into a gospel heart.
2. **Lesson Prose (`data/201-04.json`) and Browse Metadata (`curriculum-toc.csv`)**:
   - Updated `description`, the bridge after Mark 4:20, the `A Gospel Heart` section (formerly `Rooted in Him`), the `Five Roots in a Gospel Heart` heading and intro paragraph before the widget (also removing the old "Watch each root reach down, one at a time" widget-directing line per SWEEP-001/series standard), `Roots Before Fruit`, `This Week's Practice`, `Lesson 4 Review`, and the `201.04` row in `curriculum-toc.csv`.
   - Word count (story to review) went from 1,098 words to 1,106 words.
   - All six question IDs (`201-04-1`, `201-04-2`, `201-04-3`, `201-04-key`, `201-04-step`, `201-04-prayer`), question texts, and the 6-frame `soils-seq` block remain untouched.

## Checks (from `discipleship/` in worktree)

- `bash scripts/qa_foundation.sh`: All foundation QA checks passed (415 bundled-John checks, 88 asset references, 72 lesson image checks).
- `node scripts/test_lesson_export.js`: 143 check(s) passed.
- `node scripts/test_answer_storage.js`: 64 check(s) passed.
- `node scripts/check_lesson_assets.js`: PASS: 88 src/image/imageBw/imageColor/imageSequence references resolve to files.
- `node scripts/test_lesson_assets.js`: 8 asset check tests passed.
- `node scripts/test_lesson_images.js`: 72 lesson image checks passed.
- `node scripts/test_widget_iframe.js`: 32 widget iframe checks passed.
