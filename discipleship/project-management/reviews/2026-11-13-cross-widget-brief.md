# Widget brief: the Great Commandment cross, three versions

Date: November 13, 2026. Written by Claude from Dave's direction; see [the cross arc plan](2026-11-13-cross-arc-plan.md). Task: WIDGET-CROSS-ARC. Status: ready for Dave to send to Gemini. All card wording is a draft for Dave.

You are building one interactive widget, in three versions, for the Growing Together discipleship series (repository davepartin/ministrybag1, folder discipleship/). Work on your own branch off current origin/main, one PR, and stop at REVIEW. Codex handles technical integration. Dave approves the look and all wording. Do not merge.

## Read first

- discipleship/AGENTS.md, then claim the WIDGET-CROSS-ARC row in project-management/TASKS.md before editing.
- discipleship/widgets/widget.md (layout, heights, resizing and scroll rules). Follow it exactly.
- discipleship/story-image.md, the section "The look". The series art is black felt-tip marker on white paper with one or two small color accents. Match that feel.
- discipleship/widgets/great-command.html. This is the widget you are upgrading. It is used in 201-01 today.
- discipleship/widgets/romans-road3.html. This is the quality bar for drawing and animation in this series. Reuse its structure for cards, Back/Next navigation, reduced motion and accessibility.
- The three lessons this widget will serve: data/201-01.json, data/202-01.json, data/203-01.json.

## The big idea

The Greatest Commandment has the shape of a cross. The upright beam is love between God and you: His love comes down first, and your love goes back up to Him (1 John 4:19). The crossbeam is that love overflowing to people. The left arm reaches to the people closest to you, your home and your church family. Dave's church calls this BELONG. The right arm reaches to people who do not yet know Jesus. Call this GO. The three courses follow the cross:

- 201 Growing Deep: the upright beam (loving God).
- 202 Growing Up: the left arm, Belong (home and church family).
- 203 Growing Out: the right arm, Go (people not yet in the family of God).

Series line, shown at the end of every version: "Love comes down, goes up, and reaches out."

## The drawing (the most important part)

Draw the cross step by step, as if someone is sketching it with a marker on a whiteboard, instead of fading in filled shapes.

- Use inline SVG paths animated with stroke-dasharray / stroke-dashoffset. Use slightly irregular, hand-drawn paths (small wobbles, round caps, a second thinner pass offset by about 1px for marker texture). Avoid perfect geometric rectangles.
- Upright beam: draw its LEFT edge from top to bottom (God's love comes down, with a small downward arrowhead in gold), then its RIGHT edge from bottom to top (your love goes up, with a small upward arrowhead in green). The two strokes together close the beam. After a beam's outline is finished, add a light color wash inside it.
- Each arm is drawn as an outline, moving outward from the center, then gets its wash.
- Ink is near-black (#2C2416) on white. Accent colors, used only as washes, arrowheads and labels: Down gold #B8860B, Up green #2E7D5B, Belong blue #4A708B, Go rust #B5562B, the finished cross deep red #8B1A2B. Keep everything else black, white and grey.
- A beam that is not the focus of a version is drawn faint (light grey, dashed), never hidden, so the learner always sees the whole cross.
- Arm labels in a hand-lettered feel using system fonts (no web fonts): "Belong" on the left arm, "Go" on the right arm. Small simple marker icons are welcome: a house and a table of people at the end of the Belong arm; widening rings at the end of the Go arm labeled home, work and school, neighborhood, nations.
- Back redraws the previous state instantly. Next animates only the new stroke. With prefers-reduced-motion, show each step's finished drawing with no animation.

## One engine, three versions

Build one shared engine so the three versions never drift apart. The app loads every widget as widgets/<file>.html with "?v=<build>" appended, and scripts/check_lesson_assets.js requires each widget src to be a real file. So do NOT add your own query string or hash to the src. Instead:

- widgets/great-command-cross.js: all drawing, steps, cards and navigation.
- widgets/great-command-cross-201.html, great-command-cross-202.html, great-command-cross-203.html: thin pages that set the version and load the engine with the page's own ?v value, for example "great-command-cross.js" + location.search, so caching stays correct.

Keep great-command.html and cross-the-road.html in the folder, unchanged.

## Card text

Every card has a title, the verse (ESV), the reference and one short teaching line. Copy each verse exactly from the ESV and double-check it. Never say tap, click, "the widget" or "the diagram".

Shared cards:

- DOWN: "God's Love Comes Down". 1 John 4:19, "We love because he first loved us." Line: "Everything starts with God. His love comes to you before you do anything."
- UP: "Love God With All You Are". Mark 12:30, "And you shall love the Lord your God with all your heart and with all your soul and with all your mind and with all your strength." Line: "Your love goes back up to Him, not to earn His love, but because you already have it."
- NEIGHBOR: "Love Your Neighbor as Yourself". Mark 12:31, "The second is this: 'You shall love your neighbor as yourself.' There is no other commandment greater than these." Line: "The second command is the overflow of the first. It reaches out in both directions."
- BELONG: "Belong: Love Your Family in Christ". John 13:34, "A new commandment I give to you, that you love one another: just as I have loved you, you also are to love one another." Line: "Love reaches first to the people closest to you: your home and the family of God."
- GO: "Go: Love Those Not Yet in the Family". John 20:21, "As the Father has sent me, even so I am sending you." Line: "The same love keeps reaching, to people who do not yet know Jesus."

### Version 1, 201-01 Loving God

Title bar: "The Greatest Commandment". Focus: the upright beam.

- Start card (nothing drawn): "Jesus was asked which commandment matters most. Watch His answer take shape."
- Step 1 DOWN. Step 2 UP (the full upright beam is now drawn and washed).
- Step 3 NEIGHBOR: draw both arms together, lighter, labeled simply "others".
- Step 4 final, "The Cross Holds It All". Ephesians 5:2, "And walk in love, as Christ loved us and gave himself up for us, a fragrant offering and sacrifice to God." Line: "Receive and respond. Love comes down, goes up, and reaches out." On the finished cross, show three small grey captions: "Growing Deep" on the upright, "Growing Up" under the left arm, "Growing Out" under the right arm, as a quiet preview of the path ahead.

### Version 2, 202-01 Loving Your Neighbors

Title bar: "Love Reaches Out". Focus: the left arm, Belong.

- Start card: "Before you learn to love others, remember where love starts."
- Step 1 REVIEW: redraw the whole upright beam in one quick motion. Card title "Loved First". 1 John 4:19. Line: "God's love came down to you, and your love goes back up to Him."
- Step 2 NEIGHBOR: draw the whole crossbeam, both arms, in blue-grey. Line: "Like the Samaritan, love does not ask who qualifies. It reaches out in both directions."
- Step 3 BELONG: the left arm redraws bold blue with its wash, house and table icons, label "Belong". The right arm fades to faint dashed grey with the small caption "Go: Growing Out".
- Step 4 final, "Especially the Household of Faith". Galatians 6:10, "So then, as we have opportunity, let us do good to everyone, and especially to those who are of the household of faith." Line: "Love comes down, goes up, and reaches out, starting with your home and your church family."

### Version 3, 203-01 The Great Commission

Title bar: "Love Goes Out". Focus: the right arm, Go.

- Start card: "Remember the shape of the love you have received."
- Step 1 REVIEW: redraw the upright beam and the Belong arm quickly together. Card title "Loved and Belonging". Line: "God loved you first, and He placed you in His family."
- Step 2 GO: the right arm draws bold rust, outward, ending in widening rings labeled home, work and school, neighborhood, nations (Acts 1:8 order). Use the GO card.
- Step 3 final, "You Are Sent". Matthew 28:19, "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit." Line: "Love comes down, goes up, and reaches out, starting with the people already around you."

## Build rules

- Phone first. Check at 375, 390 and 1280 pixels wide: no horizontal scroll, labels readable, buttons at least 44px high, card height stable between steps so the page does not jump (see widget.md, Measuring, Resizing and Scroll Safety).
- Keyboard: Back and Next buttons, visible focus outline, aria-live on the card, an SVG title/desc that describes the current drawing.
- No external libraries, fonts or images. No localStorage. No em dashes in any text.
- Do NOT edit any lesson JSON, index.html, scripts/, images or Firebase files. Claude will adjust the lesson prose and wire the widget into 201-01, 202-01 and 203-01 (task CROSS-ARC-LESSONS) after Dave approves the look.

## Delivery

- Open each version directly on the PR's Firebase preview at /widgets/great-command-cross-201.html (and -202, -203) and put those three links at the top of the PR body, so Dave can view all three on his phone.
- Run from discipleship/ and report actual exit codes: bash scripts/qa_foundation.sh, node scripts/test_lesson_export.js, node scripts/test_answer_storage.js, node scripts/check_lesson_assets.js. Add a short Playwright check that steps through all three versions at 375/390/1280, confirms every step draws, Back restores the prior state, reduced motion shows finished drawings, and there are no page errors or horizontal overflow.
- In the PR body, list every card's text so Dave can edit wording in one place. Write a task log in project-management/logs/. Stop at REVIEW.
