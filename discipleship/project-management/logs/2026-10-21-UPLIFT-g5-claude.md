# UPLIFT-g5: 202-04 to 202-07 brought up to the A pattern (Claude)

Date: 2026-10-21
Branch: `claude/uplift-g5-202-gifts-giving` (from `origin/main` at `5c1fe2b`)
Scope: `data/202-04.json`, `data/202-05.json`, `data/202-06.json`, `data/202-07.json`, new `widgets/valley-road.html`, new `widgets/worship-is.html`, this log.
Source: `reviews/2026-10-21-lesson-grades.md` and the UPLIFT brief.

## Changes

**202-04 Discovering Your Gifts (polish).** "Five kinds of gifts" is now "five kinds of leaders" in the body and the Review. Added that in Ephesians 4:11 the gifts are people Jesus gives to equip the church, that APEST is a lens many churches use, and that "apostle" here means a sent, pioneering function, not one of the Twelve who wrote Scripture. Ephesians 4:11 now uses the ESV's lowercase office names (the bold stays). Five Farmers story and widget unchanged. 1,308 to 1,375 words.

**202-05 Suffering and Trials (rewrite).** New bridge from 202-04. Joseph (Genesis 37-50) is the parable block. New widget `valley-road.html` teaches James 1:2-4 as a four-stop road (Trials, Testing, Steadfast, Complete), with Joseph's matching moment on each card and a closing "Count It All Joy" card that points to Hebrews 12:2 and the cross. The Genesis 50:20 paragraph is rewritten: one event, two intentions; God sovereign over the brothers' evil without being its author (45:5-8; 50:20). Added a care paragraph about abuse and Psalm 34:18. The cross is the ground of hope (Matthew 27:46, Romans 8:32). Lament teaching kept; "nearly half the Psalms" removed. Practice no longer asks the learner to write "God meant it for good" under a wound; it offers Psalm 34:18 first. Review states the big truth: "God is with you in the valley, and He never wastes your pain." 1,873 to 1,636 words (about 1,440 of lesson text without questions and headings).

**202-06 Worship and the Glory of God (rewrite).** New bridge from 202-05. Paul and Silas at midnight (Acts 16:16-34) is the parable block. New widget `worship-is.html` builds Piper's definition one phrase at a time (His worth, reflecting back, gladly, in spirit, in truth) on a midnight scene, with John 4:23 on the final card. "Worship When It Hurts" and the Psalm 42 lament material are cut (202-05 owns them). Romans 12:1 is taught from "by the mercies of God." "In spirit" is tied to the Holy Spirit and "in truth" to Jesus (John 14:6). Isaiah 6 arc kept, with grace before sending. John 4:23-24 was already ESV and stays ESV. 1,673 to 1,430 words.

**202-07 Giving & Generosity (rewrite).** New bridge from 202-06. The widow's offering (Mark 12:41-44) is the parable block. 2 Corinthians 8:9 anchors the lesson before ownership. "16 of 38 parables" and "more than heaven and hell" are cut. Hilaros is "glad, cheerful". "Proves" and "lasting financial freedom" are gone, including from the description. Generosity Ladder is a box block with three rungs. Q7.4 now asks for a rung and a first amount. Stewardship Flip kept. En dash in "1-2%" removed. 1,398 to 1,373 words.

## Question IDs

All surviving IDs kept. No new IDs, none retired.

- 202-05: `201-09-1` to `201-09-5` (texts tightened to one question each), closing `202-05-key/step/prayer`.
- 202-06: `201-05-1` to `201-05-5`, reordered: `201-05-4` is now 6.1 (worship in a hard place, tied to the story), `201-05-1` is 6.2 (explain worship in your own words). Closing `201-05-key`, `202-06-step`, `201-05-prayer`.
- 202-07: `202-07-1` to `202-07-4`, closing unchanged.

## Checks

- `bash scripts/qa_foundation.sh`: all passed (415).
- `node scripts/test_answer_storage.js`: 64 passed.
- `node scripts/test_lesson_assets.js`: 8 passed.
- `node scripts/test_widget_iframe.js`: 32 passed.
- Playwright on a local server (port 8805): both new widgets stepped through every state at 375 and 1280. No page errors, no horizontal overflow, buttons hold position across steps (cards are sized to the tallest). Lessons 202-04 to 202-07 rendered at 390x844 and 1280x900 through `openFromDropdown('202', n)` with each widget stepped. Results below.

| Lesson | 390x844 | 1280x900 |
|---|---|---|
| 202-04 | five-gardeners 528 px tall, no overflow, no errors | 557 px, no overflow, no errors |
| 202-05 | valley-road 447 px, no overflow, no errors | 484 px, no overflow, no errors |
| 202-06 | worship-is 491 px, no overflow, no errors | 569 px, no overflow, no errors |
| 202-07 | stewardship-flip 790 px, no overflow, no errors | 801 px, no overflow, no errors |

No console errors or warnings on any lesson. Screenshots were read for clipped text; none found. Screenshots are kept in the session scratch folder, not the repo.

## Open items

- Art: none of 202-05, 202-06, 202-07 has story art yet. Prompts are in the PR report.
- TOC rows for 202-04 (tool), 202-05 (tool), 202-06 (tool) and 202-07 (summary) should change. Exact values are in the PR report.
- g7: `stewardship-flip.html` header quotes Psalm 24:1 in NIV wording. Suggest the ESV: "The earth is the LORD's and the fullness thereof."
- `widget-iframe.js` KNOWN_TITLES does not list the two new widgets. The lesson blocks pass `title`, so iframe titles are correct without it.
- Dave review items are listed in the PR report.
