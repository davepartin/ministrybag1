# Widget brief: Love Has Names (203-01 Personal Ministry Map, Studio Wash)

Date: November 14, 2026. Written by Claude from Dave's direction for 203-01. Task for Gemini: WIDGET-203-01-MAP. Status: ready for Dave to send. All card wording is a draft for Dave.

You are rebuilding one interactive widget for lesson 203-01, The Great Commission - Your Personal Ministry, in the Growing Together discipleship series (repository davepartin/ministrybag1, folder discipleship/). Work on your own branch off current origin/main, one PR, and stop at REVIEW. Codex handles technical integration. Dave approves the look and all wording. Do not merge.

## Read first

- discipleship/AGENTS.md, then add and claim a task row WIDGET-203-01-MAP in project-management/TASKS.md before editing.
- discipleship/widgets/STUDIO-WASH-GUIDE.md and discipleship/widgets/widget.md. Follow both exactly: the #2C2416 header bar with the title on the left and "203-01" on the right, luminous washes, crisp hairlines, calm pacing, locked card height.
- discipleship/widgets/great-command-v5.js and great-command-v5-203.html: the cross that opens this same lesson. This widget must feel like its sibling. Reuse its Go color (plum #5F4684, wash #EDE7F6) as the color of reaching out.
- discipleship/widgets/personal-ministry-map.html: the widget you are replacing. Keep its teaching; upgrade its look.
- discipleship/data/203-01.json on branch claude/rewrite-203-01 (or main once merged), especially the sections "Think Beyond Your Tree" and "Love Has Names".

## The big idea

Love has names. Your personal ministry is loving the people God has placed in your life and helping them know and follow Jesus. It starts with the people who already know you: home, work and school, and your neighborhood. Dave's second phrase belongs in the same picture: "Think beyond your tree. Pray for the orchard."

## The picture

One finished composition, designed first as a static image worthy of print:

- At the center, one small fruit tree: you, rooted and loved. Simple marker-style trunk and crown with a few gold fruit (Down gold #A8760A), because what God grows in you is for others.
- Around the tree, three soft concentric rings, drawn as hand-sketched hairlines with translucent washes: Home (nearest), Work and School, Neighborhood (widest). Label each ring along its curve.
- On the rings, small blank name tags, like luggage tags or place cards, each with a short handwritten-style line where a name would go. Do not print real names. A few tags may carry gentle prompts in small type: "a brother", "a coworker", "the neighbor across the street", "a teammate".
- In the final steps, a seedling sprouts beside some tags, so the map begins to look like a young orchard growing out from the one tree.
- Beyond the widest ring, a faint dashed horizon labeled "to the end of the earth".

## Steps and card text

Header title: "Love Has Names". Lesson tag: "203-01". Never say tap, click, "the widget" or "the diagram". No em dashes. Quote Scripture exactly from the ESV and double-check it.

Start (only the tree is visible): "God has been growing you. Now look at who He has placed around you."

Step 1, You. The tree's fruit appears.
Title: "Loved First"
Verse: "We love because he first loved us." (1 John 4:19)
Text: "You are rooted in God's love. What He grows in you is meant to feed someone else."

Step 2, Home. The first ring washes in with two or three tags.
Title: "Home"
Verse: "Go home to your friends and tell them how much the Lord has done for you." (Mark 5:19)
Text: "Start at your front door, with the people who see you most."

Step 3, Work and School. The second ring washes in with tags.
Title: "Work and School"
Verse: "Let your light shine before others." (Matthew 5:16)
Text: "Most of your week happens here, beside the same people."

Step 4, Neighborhood. The third ring washes in with tags.
Title: "Your Neighborhood"
Verse: "You shall love your neighbor as yourself." (Mark 12:31)
Text: "Neighbors, teammates, the barista, the parent at the ball field: everywhere else you keep showing up."

Step 5, the question. Some tags fill with a soft gold dot (they know the good news); others stay open.
Title: "Who Knows the Good News?"
Text: "Look at the names on your map. Does everyone who knows you know the good news of Jesus?"

Step 6, final. Seedlings rise beside several tags; the dashed horizon appears.
Title: "Pray for the Orchard"
Verse: "You will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth." (Acts 1:8)
Text: "Think beyond your tree. Love has names, and God can grow an orchard from the people you love one at a time."

## Care

- No guilt. The open tags are an invitation, not a score. Never show a count or a percentage of people "reached".
- People are not projects. Tags are people with names, not targets.

## Build rules

- One self-contained file: widgets/love-has-names.html. No external libraries, fonts or images. No localStorage. No text inputs: learners write their names in question 1.3, which saves with their answers.
- Phone first. Check at 375, 390 and 1280 pixels wide: no horizontal scroll, ring labels and tags readable, buttons at least 44px high, card height locked so the page does not jump.
- Keyboard and screen readers: Back and Next buttons, visible focus outline, aria-live on the card, an SVG title/desc describing each step. With prefers-reduced-motion, show each step's finished state without animation.
- Do NOT edit any lesson JSON, index.html, scripts/, images, other widgets or Firebase files. Keep personal-ministry-map.html in place. After Dave approves the look, Codex wires the new file into 203-01 where the current map sits.

## Delivery

- Put the direct preview link at the top of the PR body: the PR's Firebase preview URL followed by /widgets/love-has-names.html.
- Run from discipleship/ and report actual exit codes: bash scripts/qa_foundation.sh, node scripts/test_lesson_export.js, node scripts/test_answer_storage.js, node scripts/check_lesson_assets.js. Add a short Playwright check that walks every step at 375/390/1280, confirms Back restores the prior state and reduced motion shows finished states, and finds no page errors or overflow. Include 390-wide screenshots of the start and final steps.
- List every card's text in the PR body so Dave can edit wording in one place. Write a task log. Stop at REVIEW.
