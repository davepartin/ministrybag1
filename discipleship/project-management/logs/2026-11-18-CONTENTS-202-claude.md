# CONTENTS-202: Claude, 2026-11-18

Branch claude/202-01-no-arrows (PR #287), merged with main a6bb93f.

## Request

Dave: keep the arrows; on a phone each row must stay on one line (smaller font or drop a word); make sure Study goes to the right part of the teaching, with authority to choose; do it for all ten 202 lessons.

## Changes

index.html
- Jump targets carry data-jump="NAME" instead of id="jump-NAME". The click handler looks inside the clicked link's own .session, because every lesson in a course is rendered on the page at once and ids would repeat.
- Contents rows: font-size clamp(0.8rem, 4.6cqi, 0.95rem) with the list as an inline-size container; titles nowrap with min-width 0 and an ellipsis fallback. Label column 70px (from 58px) so all titles align.

Lesson data (contents rows and anchors; no wording changed)

| Lesson | Story | Study (target heading) | Diagram |
|---|---|---|---|
| 202-01 | Luke 10:25-37 | Loving Your Neighbor (The Second Is Like the First) | Greatest Commandment |
| 202-02 | Matthew 7:24-27 | Jesus the Cornerstone (Jesus Is the Cornerstone) | Building a Life |
| 202-03 | Acts 2 | Now God's People (Once Not a People, Now God's People) | One Another |
| 202-04 | The Five Farmers | Equipped for Ministry (Equipped for the Work of Ministry) | Five Farmers, One Field |
| 202-05 | Genesis 37-50 | Suffering Is Real | Trust the Creator |
| 202-06 | Acts 16:16-34 | What Worship Is (What Worship Actually Is) | Reflecting God's Worth |
| 202-07 | Mark 12:41-44 | A Gift Before a Response | Time, Talents, Treasure |
| 202-08 | Marble and Chisel | Covenant Love (Covenant Love Starts with God) | Closer to God Triangle |
| 202-09 | 2 Samuel 11-12 | At First Thought | RUN from Sin |
| 202-10 | Luke 22:14-20 | Baptism: The Doorway (Baptism: The Doorway You Walk Through Once) | The Baptism Picture |

Story targets the story picture just above each story card. Study targets the first teaching heading after the story, where the teaching begins. Diagram targets the lesson's widget; titles follow each widget's own header. 202-01 Diagram was shortened from The Greatest Commandment after it was cut off at 375px and below.

## Verification

From discipleship/ with local static servers:
- New Playwright check, all ten lessons at 320, 360, 375, 390, 414 and 1280 wide: three rows, each title on one line and not cut off; at 320 and 390 every row lands its own lesson's target just below the top bar, focus moves, address stays #202-N, no page errors. 306 of 306 pass.
- Foundation QA, lesson export 186, answer storage 64, assets 144, lesson images 1542, widget iframe 32: pass.
- Browser checks: 202-01 sequence 95, 202-02 sequence 77, 202-06 sequence 55 and story image 55, 202-07 story image 69, 202-10 dissolve 128, baptism integration 114, review 202-08/09 26, mosaic 282, lesson navigation 964: pass.
- l202_05_story_image_browser_check: 3 failures on retired question 201-09-5, same as on main before this work.

Not run: physical iPhone or Safari.
