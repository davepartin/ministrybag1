# ART-203-10-DOTHAN-SKETCH: Claude, 2026-11-23

Branch claude/203-10-dothan-sketch from main 2c18365f.

## Direction

Dave, 2026-11-23: replace the 203-10 images with two new marker drawings, first then second. Earlier direction for this story: the first picture has no army of fire, the second shows it.

## Work

- Frame 1 (no chariots) arrived at 1168x784; frame 2 (chariots of fire on the hills) at 1712x1152, a slightly different crop.
- Found the best fit by searching scale and offset against the wall, the two figures and the camp (areas both drawings share): frame 2 scaled to 1164x782, frame 1 cropped by 2px left and 1px top to the same 1164x782. A red and cyan overlay shows the wall, figures and camp lined up; only the hills differ, where frame 2 adds the horses and chariots.
- Saved as `images/203-10-dothan-sketch-1.jpg` and `images/203-10-dothan-sketch-2.jpg` (JPEG quality 90) and ran `scripts/build_lesson_images.js` for the 640 and 1164 web copies.
- `data/203-10.json`: the story image keeps the on-entry dissolve and now uses the new files. Description updated to match the drawing (city wall, camp, "the mountain full of horses and chariots of fire" from 2 Kings 6:17).
- `story-image.md` 203-10 row updated. The earlier `203-10-dothan-1.jpg` and `-2.jpg` stay in the folder unused.

## Verification

- Foundation QA passed; lesson export 212; answer storage 73; lesson assets 148 references resolve; lesson images 1657; lesson assets tests 8; 203-10 update check 92.
- In the lesson at 390x844 the dissolve runs from frame 1 to frame 2 as the picture scrolls in (top layer opacity 0.87, 0.33, 0), with no page errors.
