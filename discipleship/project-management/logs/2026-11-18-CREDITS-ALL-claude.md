# CREDITS-ALL, step 1: one credits page, a small Credits link on every lesson
Date: 2026-11-18
Agent: Claude
Status: DONE (Dave approved merge of PR #309, 2026-11-18)
Branch: claude/credits-bottom

Dave in chat on November 18: credits should not sit on each lesson. "we can just have a small credits word at the bottom of each page that takes a person to the credits master page that has the lesson number and then this data on it... you can even put it on the page that i have for me the designer on the about page we can have acknowledgements and credits there at the bottom." (Earlier: "the writer of this Growing Together series isn't taking credit. It's passing it on to so many giants before me.")

- credits.json (discipleship root, next to curriculum-toc.csv): one list of lesson credits (lesson id, title from the TOC, credit sentences). It sits outside data/ so the lesson-file count stays 47.
- The 15 credit lines that sat at the end of lessons moved there word for word and are gone from the lesson pages: 101-06, 201-06, 201-07, 201-10, 202-05, 202-06, 202-08, 203-02, 203-03, 203-04, 203-05, 203-06, 203-08, 203-09, 203-10.
- Every lesson: a small "Credits" link below the Email/PDF and Previous/Next buttons. It opens the About page, opens Acknowledgments and Credits, and scrolls to that lesson's credit (or to the section when the lesson has none yet). The address becomes #about, so Back returns to the lesson.
- About page: the Acknowledgments section is now "Acknowledgments and Credits", with Dave's thank-you, then "Lesson Credits" (lesson number, title, credit) read from credits.json, then the ESV notice.

Step 2: Dave said the ten 101/201 ideas asked about (Peaks and Valleys, six prayer steps, Three Discovery Questions, aspen and potluck, Stop Turn Walk, the cross, GUIDE, Grace and Mercy cycle, one fruit nine expressions, both sons) need no credits. Dave also declined credits for the Great Exchange and the Romans Road (too general in Christianity) and confirmed the BLESS credit to Dave and Jon Ferguson. The credit list is complete for now.

Checks: qa_foundation 0; test_lesson_export 0 (186); test_answer_storage 0 (64); check_lesson_assets 0 (145); test_answer_sync 0 (39); lesson_navigation_browser_check 0 (964); Credits check at 375/390/1280 (link below every button, no credit text left in lessons, About opens with the section open and the lesson's credit in view, 15 lesson rows, Back returns to the lesson, a lesson without credits lands on the section, no overflow, no errors) 42 of 42; local render and saved-answer reload of #101-6, #201-10, #203-5, 18 of 18 each.
