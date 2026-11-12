# L-201-09: The Vine and the Branches four-frame scroll sequence

Date: 2026-11-12. Owner: Gemini. Branch: `gemini/l-201-09-vine-art`. Status: REVIEW.

## Why

Top item in the Gemini lane on `TEAM-BOARD.md`: add story art for Lesson 201-09 ("The Vine and the Branches", John 15:1-5) in the series charcoal style, wired as a scroll sequence per `story-image.md` with WebP delivery copies.

## What changed

1. **Artwork (`images/vine-branches-seq-1.jpg` to `vine-branches-seq-4.jpg`, `1264x848`)**:
   - Four locked-background frames showing an ancient grapevine trunk on a terraced Judean hillside with a connected branch along a wooden trellis and a severed, dry branch on the ground below:
     - Frame 1: Dormant connected branch with small early buds in scratchy B&W charcoal; severed branch on the ground is bare and lifeless.
     - Frame 2: Fresh grape leaves, tendrils, and early blossom clusters form along the connected branch in B&W charcoal.
     - Frame 3: Full, heavy grape clusters hang from the connected branch in B&W charcoal.
     - Frame 4: Warm golden light flows from the vine trunk into the connected branch, illuminating the green leaves and deep purple grape clusters while the surrounding hillside and severed branch stay in scratchy B&W charcoal.
   - Generated `640w` and `1264w` WebP delivery copies in `images/optimized/` and registered them in `scripts/build_lesson_images.js` and `scripts/lesson-image-assets.js`.
2. **Lesson JSON (`data/201-09.json`)**:
   - Added a standalone `image` block before "The Vine and the Branches" parable with `imageSequence` (`vine-branches-seq-1.jpg` through `4.jpg`), `imageSequenceStops: [0, 0.18, 0.34, 0.5]`, `touchNext: true`, and descriptive `alt` text.
   - All saved-answer IDs (`201-09-1`, `201-09-2`, `201-09-3`, `201-09-4`, `201-09-key`, `201-09-step`, `201-09-prayer`) and lesson prose are unchanged.
3. **Inventory & Board (`story-image.md`, `project-management/TASKS.md`)**:
   - Updated the `201-09` row in `story-image.md` and `TASKS.md`.

## Checks (from `discipleship/` in worktree)

- `bash scripts/qa_foundation.sh`: passed (415 bundled-John checks, 92 asset references, 80 lesson image checks).
- `node scripts/test_lesson_export.js`: 143 passed.
- `node scripts/test_answer_storage.js`: 64 passed.
- `node scripts/test_lesson_assets.js`: 8 passed.
- `node scripts/test_lesson_images.js`: 80 passed.
