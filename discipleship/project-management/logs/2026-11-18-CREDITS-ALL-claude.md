# CREDITS-ALL, step 1: acknowledgments below the buttons
Date: 2026-11-18
Agent: Claude
Status: REVIEW
Branch: claude/credits-bottom

Dave in chat on November 18: small acknowledgments at the very bottom of each lesson, underneath all the buttons, "so that people know that the writer of this Growing Together series isn't taking credit. It's passing it on to so many giants before me." Then "go on the acknowledgments".

Step 1 (this PR): layout and the 15 existing credit lines.
- index.html: a small "Acknowledgments." line (#lesson-credits, 0.7rem, secondary color, centered) after the bottom navigation, below the Email/PDF and Previous/Next buttons. updateLessonCredits() fills it from the current lesson's "credits" array whenever the lesson changes, and hides it when a lesson has none.
- Lesson JSON: new top-level "credits" (array of strings). The 15 existing credit text blocks that sat after the closing questions moved there word for word: 101-06, 201-06, 201-07, 201-10, 202-05, 202-06, 202-08, 203-02, 203-03, 203-04, 203-05, 203-06, 203-08, 203-09, 203-10. No wording changed.

Step 2 (next): credits for the other lessons, drafted only from sources Dave confirms or that can be verified.

Checks: qa_foundation 0; test_lesson_export 0 (186); test_answer_storage 0 (64); check_lesson_assets 0 (145); test_answer_sync 0 (39); lesson_navigation_browser_check 0 (964); credits check at 375/390/1280 (shown on 201-10 and 101-06 below every button, small type, gone from the lesson body, hidden on a lesson without credits, updates when switching lessons and courses, no overflow, no errors) 27 of 27; local render and saved-answer reload of #101-6, #201-10, #203-5, 18 of 18 each.
