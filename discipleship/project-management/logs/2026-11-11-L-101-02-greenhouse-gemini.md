# L-101-02: The Greenhouse four-frame scroll sequence and story-image guide

Date: 2026-11-11. Owner: Gemini. Branch: `gemini/l-101-02-greenhouse`. Status: REVIEW.

## Why

Lesson 101-02 ("The Greenhouse") opened with a parable block without a story image. Dave asked to document the scroll-animation patterns in `story-image.md` and generate a scratchy, blotty charcoal greenhouse story sequence for 101-02 matching the series style in 201-01 and 201-10.

## What changed

1. **Artwork (`images/greenhouse-seq-1.jpg` to `greenhouse-seq-4.jpg`, `1264x848`)**:
   - Four locked-background frames inside a greenhouse with a clay pot soil cutaway on a wooden potting bench:
     - Frame 1: Seed split open underground with tiny roots starting down; bare soil above.
     - Frame 2: Deeper root network underground and first shoot tip breaking the soil surface.
     - Frame 3: Young stem risen above the pot rim with two leaves unfurled in B&W charcoal.
     - Frame 4: Green shoot and warm golden sunbeam highlighted in color while the surrounding greenhouse stays in raw scratchy charcoal.
   - Generated `640w` and `1264w` WebP delivery copies in `images/optimized/` and registered them in `scripts/build_lesson_images.js` and `scripts/lesson-image-assets.js`.
2. **Lesson JSON (`data/101-02.json`)**:
   - Added a standalone `image` block before "The Greenhouse" parable with `imageSequence` (`greenhouse-seq-1.jpg` through `4.jpg`), `imageSequenceStops: [0, 0.18, 0.34, 0.5]`, `touchNext: true`, and descriptive `alt` text.
   - All saved-answer IDs (`2-1`, `2-2`, `2-3`, `2-5`, `2-6`, `2-key`, `2-step`, `2-devos`, `2-prayer`) and lesson prose are unchanged.
3. **Documentation (`story-image.md`, `AI-START-HERE.md`, `PROJECT-BRIEF.md`)**:
   - Documented Pattern A (`imageSequence` + `imageSequenceStops`) alongside Pattern B (`imageBw` + `imageColor`), stop presets, locked-plate artwork rules, build/QA commands, and the full 101-203 story image inventory.

## Checks (from `discipleship/` in worktree)

- `bash scripts/qa_foundation.sh`: passed (including 415 bundled-John checks, 88 asset references, 72 lesson image checks).
- `node scripts/test_lesson_images.js`: 72 passed.
- `node scripts/test_lesson_assets.js`: 8 passed.
- `node scripts/test_answer_storage.js`: 64 passed.
- `node scripts/test_lesson_export.js`: 46 passed.
