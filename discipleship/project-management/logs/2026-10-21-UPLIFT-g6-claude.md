# 2026-10-21 UPLIFT g6: course 203 polish

Branch `claude/uplift-g6-203-polish`. Owned: 203-01, 04, 05, 07, 08, 10 (content); 203-02, 03, 09 (bridges only); new widget `widgets/personal-ministry-map.html`.

## Changes

- **203-01 (C+ to A-, 1,522 to ~1,240 words).** New carrying story "On the Mountain" (Matthew 28:16-20: the eleven, "but some doubted," sent anyway). New Personal Ministry Map widget replaces the placeholder list: You, Home, Work & School, Neighborhood, then a dashed "to the end of the earth" ring that hands off to 203-09's mission map. Q1.3 now matches the map. Cut "Make Disciples, Not Just Converts" (203-08 owns 2 Timothy 2:2). "Next three lessons" now "next four lessons". Questions cut from 6 to 4 (kept ids -1, -2, -4, -6; retired -3, -5). Added course welcome, big truth, Review, next-lesson line. Fixed "before His ascension" (Matthew 28 is His last word in Matthew; Acts 1:8 is the pre-ascension word).
- **203-04 (B to A-, 1,781 to ~1,490).** Cut "Let Them Serve You First" and Q4.4 (id 203-04-4 retired). Removed one "run dry by Tuesday." Time, talents, and treasure now a box tool. Bridge now from 203-03 (Listen and Eat). Review rewritten, separate next-lesson line, BLESS and Piper (<em>Desiring God</em>) credits. Questions made single.
- **203-05 (B to A-, 1,705 to ~1,380).** Cut "What Keeps You Quiet" and "The Word of Your Testimony." Three Stories (theirs, yours, His) now a box that leads into the 3 Circles widget, with a John 9:38 tie-back. Cut the unattributed witnessing quote. "Earned the right" now "been given the opening." Bridge from 203-04. "This Week's Practice" heading. BLESS and NAMB 3 Circles credits.
- **203-07 (B- to A-, 1,498 to ~1,550).** Removed "wearing the armor before it had a name," wet shields and sandal spikes. New "Stand Together in Prayer" section (Ephesians 6:18-19, plural "you"). "This Week's Practice": pray through the armor each morning, memorize one sword verse, with a box of three lies and answering verses. Softened "likely looking at a soldier's armor." Review now names prayer and standing together.
- **203-08 (A- to A).** Four steps reframed as "a simple pattern drawn from how Jesus trained the Twelve" (Mark 6:30). Added Matthew 10:8 grace line.
- **203-10 (B+ to A-, ~810 to ~970).** "Putting It All Together" now walks through 101, 201, 202 and 203 with each course's key truth or tool. Added "This Week's Practice." Merged 10.2 and 10.3 (kept 203-10-shape, retired 203-10-see); 10.4 is now 10.3. Bezalel line checked: "the first person God named to build it" is accurate (Aaron in Exodus 28 is named as priest, not builder).
- **203-09 bridge.** Lesson 1 callback now names the three circles from 203-01 and says the map moves out from the church to city, new churches and nations.
- **Bridges.** Checked every 203 opener and next-lesson line; 203-02 and 203-03 needed no change.

## Checks

- `qa_foundation.sh`, `test_answer_storage.js`, `test_lesson_assets.js`, `test_widget_iframe.js`: all pass.
- Playwright at 390x844, 375x812 and 1280x900 for 203-01, 04, 05, 07, 08, 09, 10: every widget stepped through every state, plus overview. No page errors or console errors, no horizontal scroll on the page or inside any widget iframe, no overflowing card text or buttons. Map screenshots reviewed at 390 and 1280.
- No em dashes in edited lessons or the new widget.

## Open items

- Dave to review the new 203-01 story and widget, and the 203-07 sword-verse box.
- TOC row for 203-01 should be updated (story and tool), see PR body.
- Optional: add `personal-ministry-map.html` to `KNOWN_TITLES` in `scripts/widget-iframe.js` (the lesson block carries a `title` now, so it is not required).
