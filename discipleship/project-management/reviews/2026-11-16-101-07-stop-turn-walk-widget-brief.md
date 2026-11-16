# Widget brief: The 180, Stop, Turn, Walk (101-07)

Date: November 16, 2026. Written by Claude from Dave's direction. Task for Gemini: WIDGET-101-07-180. Status: ready for Dave to send. All card wording is a draft for Dave.

You are building one interactive widget for lesson 101-07, When You Drift, the last lesson of the Starting course in the Growing Together discipleship series (repository davepartin/ministrybag1, folder discipleship/). This is a 101 course for brand-new Christians, so keep everything simple: few words, big clear shapes. Work on your own branch off current origin/main, one PR, and stop at REVIEW. Codex handles technical integration. Dave approves the look and all wording. Do not merge.

## Read first

- discipleship/AGENTS.md, then add and claim WIDGET-101-07-180 in project-management/TASKS.md.
- discipleship/project-management/reviews/101-editorial-status.md (101 protection rules).
- discipleship/widgets/STUDIO-WASH-GUIDE.md and widgets/widget.md. Use the Studio Wash frame: #2C2416 header bar, title on the left, "101-07" on the right, luminous washes, crisp hairlines, calm pacing, wordless step dots, 44px Back / Next buttons, locked card height.
- discipleship/widgets/romans-road3.html: the 101-02 road widget Dave loves. This widget should feel like its sibling: a path you walk.
- discipleship/data/101-07.json on branch claude/rewrite-101-07 (or main once merged), section "When You Fall, Turn Around".

## The big idea

Repentance is a 180-degree turn. You were walking away from God; you stop, turn all the way around, and walk back toward Him. Three steps: Stop, Turn, Walk. It is not a 360 (feel bad for a moment, keep going the same way) and not a 90 (trade a bad habit for a better plan but never come back to Jesus).

## The picture

A simple horizontal path across the stage, drawn like the Romans Road: a soft road line with a small walker (a simple figure or a dot with a direction arrow).

- At the far left, a plain cross on a small rise, drawn as a crisp crimson hairline (#8B1A2B), quiet at first.
- To the right, the path fades into grey toward a label "My Way".
- The walk away is drawn in muted grey ink. The walk home is a warm gold wash (#A8760A, wash #FCF2D6), so the return feels like light, not punishment.
- No faces, no red warning colors, nothing that feels like shame.

## Steps and card text

Header title: "The 180". Lesson tag: "101-07". Never say tap, click, "the widget" or "the diagram". Never use "we", "us" or "our". No em dashes. Quote Scripture exactly from the ESV and double-check it.

Start (walker near the cross, facing right): Title "Which Way Are You Facing?" Text: "Every follower of Jesus drifts sometimes. Here is how to turn around."

Step 1, the walker moves right, away from the cross, toward "My Way". Title "Going Your Own Way". Text: "Sin pulls you away from God one step at a time."

Step 2, the walker spins a full circle and keeps going right. Small label "360". Title "Not a Spin". Text: "Feeling bad for a moment and then going the same way is not repentance."

Step 3, the walker turns 90 degrees onto a side path labeled "A Better Plan", still not facing the cross. Small label "90". Title "Not a Sidestep". Text: "Trading a bad habit for a better plan, without coming back to Jesus, is not repentance either." Then the walker returns to the main path, still facing right, before Step 4.

Step 4, a short vertical stop line appears in front of the walker. Label "1. Stop". Title "Stop". Verse: "If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness." (1 John 1:9) Text: "Be honest with God that you are headed the wrong way. Name your sin without excuses."

Step 5, a U-turn arc draws from the walker's position back toward the left, with a small "180" in the bend. Label "2. Turn". Title "Turn". Verse: "you turned to God from idols to serve the living and true God" (1 Thessalonians 1:9) Text: "Turn all the way around, away from your sin and back to Jesus."

Step 6, the path from the turn back to the cross fills with the warm gold wash as the walker moves left; the cross brightens. Label "3. Walk". Title "Walk". Verse: "Repent therefore, and turn back, that your sins may be blotted out, that times of refreshing may come from the presence of the Lord" (Acts 3:19). Text: "Walk forward forgiven, with Jesus, in the new direction."

Step 7, final. All three labels visible along the U-turn; the walker stands near the cross. Title "The 180". Verse: "let him return to the LORD, that he may have compassion on him, and to our God, for he will abundantly pardon" (Isaiah 55:7). Text: "You can make this turn on any day, as many times as you need. Stop, Turn, Walk."

## Build rules

- One self-contained file: widgets/stop-turn-walk.html. Inline SVG, no external libraries, fonts or images, no localStorage.
- Phone first. Check at 375, 390 and 1280 pixels wide: no horizontal scroll, labels readable, buttons at least 44px high, card height locked so the page does not jump.
- Keyboard and screen readers: Back and Next buttons, visible focus outline, aria-live on the card, an SVG title/desc describing each step. With prefers-reduced-motion, show each step's finished state without animation.
- Do NOT edit any lesson JSON, index.html, scripts/, images, other widgets or Firebase files. After Dave approves, Codex places the widget in 101-07 in place of the "The 180: Stop, Turn, Walk" box, right after the line "Repentance has three simple steps: Stop, Turn, Walk."

## Delivery

- Put the direct preview link at the top of the PR body: the PR's Firebase preview URL followed by /widgets/stop-turn-walk.html.
- Run from discipleship/ and report actual exit codes: bash scripts/qa_foundation.sh, node scripts/test_lesson_export.js, node scripts/test_answer_storage.js, node scripts/check_lesson_assets.js. Add a short Playwright check that walks every step at 375/390/1280, confirms Back restores the prior state and reduced motion shows finished states, and finds no page errors or overflow. Include 390-wide screenshots of the start and final steps.
- List every card's text in the PR body so Dave can edit wording in one place. Write a task log. Stop at REVIEW.
