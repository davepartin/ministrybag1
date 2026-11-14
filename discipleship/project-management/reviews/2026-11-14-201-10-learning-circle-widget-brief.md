# Widget brief: The Learning Circle in Studio Wash (201-10)

Date: November 14, 2026. Written by Claude for Gemini. Task: WIDGET-201-10-CIRCLE. Status: ready for Dave to send. The November 12 review held 201-10 below AAA partly for an older-widget review; this upgrade closes it. All card wording is a draft for Dave.

You are upgrading one existing widget, discipleship/widgets/learning-circle2.html, for lesson 201-10, Repentance and the Learning Circle, in the Growing Together discipleship series (repository davepartin/ministrybag1). Work on your own branch off current origin/main, one PR, stop at REVIEW. Codex handles technical integration. Dave approves the look and wording. Do not merge.

## Read first

- discipleship/AGENTS.md, then add and claim WIDGET-201-10-CIRCLE in project-management/TASKS.md.
- discipleship/widgets/STUDIO-WASH-GUIDE.md and widgets/widget.md. Use the same Studio Wash frame as the recent 201-08 and 202-08 frame updates: the #2C2416 header bar, title "The Learning Circle" on the left and "201-10" on the right, luminous washes, crisp hairlines, wordless step dots, 44px Back / Next buttons, locked card height.
- discipleship/data/201-10.json, including Dave's nine November 13 edits. The lesson teaches: notice the drift; on the right side, Repent (1. Reflect, 2. Remorse); on the left side, Believe (receive His forgiveness, then 3. Plan, 4. Obey); return to the path further along. Its phrase is "Keep turning. Keep believing."

## What to keep

The drawing and its meaning: the path of Jesus across the top, the drift away, the turning point labeled Conviction, the circle with Repent on the right and Believe on the left, the four numbered steps with their small words (mind, heart, steps, act), and the return to the path. Keep the Scripture already on the cards (Mark 1:15, Isaiah 53:6, Psalm 139:23-24, Psalm 119:59, 2 Corinthians 7:10, 1 John 1:9) exactly as ESV.

## What to change

1. Frame: Studio Wash, as above. Map the two halves to calm Studio Wash colors (Repent a muted blue, Believe a warm gold) and the finished circle to the deep crimson hairline used for the cross.
2. Words: second person, never "we", "us" or "our", and never "this diagram". Suggested:
   - Start card, title "Getting Back on the Path": "Everyone wanders at times. Here is how the gospel turns you around: notice the drift, repent, believe, and follow Jesus again."
   - The sin card: "Sin is any thought, word, or action that goes against God. You drift when you leave His way and choose your own path instead."
   - Final card, title "Back on the Path": "The same gospel that saves you keeps drawing you back to Jesus. Each time you turn, you come home a little further along. Keep turning. Keep believing."
3. Accessibility: add aria-live to the card, an SVG title/desc that describes each step, visible focus outlines, and a prefers-reduced-motion mode that shows each step's finished drawing without animation. The current file has neither aria-live nor a reduced-motion mode.

## Do not

Edit lesson JSON, index.html, scripts/, images or Firebase files, or remove any of the four steps. Keep the same file name so the lesson needs no rewiring, or name a new file and let Codex wire it after Dave approves.

## Delivery

Direct preview link at the top of the PR body (the PR's Firebase preview URL plus /widgets/learning-circle2.html, or the new file). Run qa_foundation, test_lesson_export, test_answer_storage and check_lesson_assets from discipleship/ and report exit codes; add a Playwright walk of every step at 375/390/1280 with Back, reduced motion, no overflow and no page errors; include 390-wide screenshots of the start and final steps; list every card's text in the PR body. Write a task log. Stop at REVIEW.
