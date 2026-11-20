# ART-203-02-STARS: Claude, 2026-11-20

Branch claude/203-02-abraham-stars from main 617a152c.

## Direction

Two open PRs touched the 203-02 story. Gemini's PR #318 added the approved expanded-sky Abraham dissolve (art only). Claude's PR #316 added the words that go with a stars picture (Genesis 15:5-6, Galatians 3:29) and was waiting for art. Dave, 2026-11-20: "use the gemini ... i want to use the gemini stars ... the one where the stars come out brighter." This branch combines Gemini's art with the #316 text so Dave can see them together; the stars sentence can be dropped if he prefers the art alone.

## Changes

- From PR #318, unchanged: images/203-02-abraham-bw.jpg and -color.jpg (1280x720) and the four optimized WebP copies; the image block (alt text, touchNext, imageDissolveOnEntry) placed after the BLESS logo and before the parable; the story anchor moves from the parable to the image; story-image.md (203-02 row and the imageDissolveOnEntry list). scripts/lesson-image-assets.js rebuilt with build_lesson_images.js (adds the 203-02 entries; all other delivery copies unchanged).
- From PR #316, unchanged: the parable's last paragraph (Genesis 15:5, and Abram "believed the LORD", Genesis 15:6); the "Notice the order" paragraph adds Galatians 3:29 and "Look up at that night sky with Abram. If you belong to Jesus, you are one of those stars."; contents Story row "Genesis 12 and 15"; course-plan Story column "Abram's call and the stars, blessed to be a blessing (Genesis 12:1-4; 15:5-6)".
- Question IDs and all other lesson content unchanged.

## Verification

Foundation QA, lesson export 212, answer storage 73, assets 143, asset tests 8, lesson images 1583, widget iframe 32, story art sequences 266, lesson navigation 964, l203_02_03 39: pass. At 390 px the dark layer fades from opacity 1 to 0 as the picture rises from 650 to 350 px from the top, and average brightness rises from about 36 to 51. Contents check: 303 of 306; the 3 misses are the 203-01 Study row, already fixed in PR #331. Not run: physical iPhone or Safari.

After this merges, PR #316 and PR #318 can be closed as included here.
