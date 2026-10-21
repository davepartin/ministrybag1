# UPLIFT-g7: existing widgets brought up to the A-standard look

Date: 2026-10-21. Owner: g7 (widget worker). Branch `claude/uplift-g7-widgets`.

## Goal

Dave wants every widget to show the "depth of care" of three-spaces, wheel, shape, covenant-triangle, starting-gun and mission-map: each step looks good, no words run out of a card or button, and the widget fits a phone.

## How the audit was done

* A Playwright crawler loaded each widget at 375x812, 390x844 and 1280x900, clicked through Begin/Next to the end, then tried every other control (dots, hotspots, overview, Back, Restart) once from each step.
* At every state it recorded: iframe horizontal overflow, text leaving the viewport, text escaping its card or button, clipped scroll boxes, SVG text clipped by its SVG, overlapping text, rendered font size under 11.5 px, Back/Next buttons moving between steps, and console/page errors. Full-page screenshots were read for every widget.
* Then each lesson was opened through `openFromDropdown()` at 390x844 and 1280x900 to confirm the iframe resizes, has no horizontal scroll, and throws no errors.

## What changed

Shared "A chrome" applied to the older widgets (same values as the A-standard files): green `#1D6B3F` title bar with 19 px Trebuchet title and no tagline; card title 16 px Trebuchet, body 15 px Georgia, reference 13 px; 44 px tall, 112 px wide nav buttons with a green primary; focus outline; Google Fonts imports removed; and the A-standard `fitCards` pattern (every card sized to the tallest step, refit only when the width changes) so the buttons never move.

| Widget | Lesson | Problems found | Fixed |
|---|---|---|---|
| romans-road | 101-02 | Card text 11 px in a locked 112 px box; B pill sat on the B marker; label text 9-11 px | yes |
| great-command | 201-01 | Mark 12:30/31 references clipped under the card; 9.6 px labels; Restart jumped | yes |
| great-exchange3 | 201-02 | Back/Next jumped on step 6; 11-13 px text | yes |
| guide-spirit2 | 201-03 | Five cards clipped 4 px at the bottom; 9-11 px refs | yes |
| deep-roots | 201-04 | Two cards clipped; 11 px refs | yes |
| bible-bookshelf | 201-05 | Shelves touched both phone edges (no gutter) | yes |
| biblical-storyline | 201-06 | 10 px step pill and 10.8 px story tags | yes |
| grace-diagram | 201-08 | Buttons jumped up to 70 px; widget grew from 445 to 786 px tall | yes |
| fruit-of-spirit | 201-09 | Wedge labels 7.8-8.8 px; Restart jumped | yes |
| learning-circle2 | 201-10 | Buttons jumped on three steps; 11 px sub-labels | yes |
| cornerstone | 202-02 | Community card clipped 15 px; brick labels 7.7 px | yes (labels now about 10 px, limited by brick width) |
| five-gardeners | 202-04 | Buttons jumped; 8.6 px APEST labels; all-caps title | yes (labels now about 10 px) |
| stewardship-flip | 202-07 | 790-908 px tall and grew by 117 px when flipped | partly: now a steady 736-774 px, still taller than one phone screen |
| three-circles | 203-05 | Card clipped; 10.8 px text; Restart pushed 39 px off screen on the last step | yes |
| armor-of-god | 203-07 | Seven of eight cards clipped (up to 26 px); body padding broke the full-bleed rule | yes |
| two-ordinances | 202-10 | None | n/a |
| covenant-triangle, starting-gun, three-spaces, wheel, mission-map, shape | A-standard | None (mission-map and shape overlaps are SVG bounding boxes, not visible) | n/a |
| biblical-timeline | none | Not used by any lesson; skipped as asked | no |

## Content changes (from the grade report and lesson workers)

* biblical-storyline: "Many stories in the Bible echo the same pattern"; Your Story body, fall and redemption labels; Paul's creation label.
* learning-circle2: Trust line (1 John 1:9, ESV) added before Plan on the Believe card.
* grace-diagram: Justified card title "Declared Righteous"; box text for Mercy, Justified and Righteous; Romans 5:9 inserts removed (exact ESV); Ephesians 2:4-5 and 2:8-10 labeled ESV; Ephesians 2:8-10 trimmed after "good works" with an ellipsis.
* deep-roots: intro "Paul says you are rooted in Jesus."; Ephesians 6:18 now ESV.
* stewardship-flip: Psalm 24:1 in ESV with its reference.
* mission-map: first step opens with "Your Lesson 1 map was your Jerusalem."
* scripts/widget-iframe.js: KNOWN_TITLES for cross-the-road, oia-method, one-another, personal-ministry-map, valley-road, worship-is.

## Checks

* `bash scripts/qa_foundation.sh`, `node scripts/test_answer_storage.js`, `node scripts/test_lesson_assets.js`, `node scripts/test_widget_iframe.js`: all pass.
* Every 101-203 lesson widget: no horizontal overflow at 375, 390 or 1280; no page errors; no button jumps; no clipped text.

## Open items

* stewardship-flip is still about 740 px on a phone. Making it fit one screen means dropping or collapsing something it teaches (the sub-labels or the verse); Dave should choose.
* bible-bookshelf is about 2,170 px on a phone. Starting the shelves collapsed would make it fit, but that changes how the lesson uses it.
* learning-circle2 is 652 px, a little over the 620 px budget.
* The corner numbers on the Learning Circle stay 1-4; the Trust line is unnumbered, as the 201-10 worker asked.
