# FIX-LESSON-JUMP: home page lesson choice opened lesson 1
Date: 2026-11-27
Agent: Claude
Status: REVIEW
Branch: claude/fix-lesson-jump

Dave reported: from the home page, opening a course and choosing a lesson other than the first sometimes lands on lesson 1.

Cause: `openFromDropdown` (course card list) and `openTreeLesson` (full course list) started loading the course, then waited a fixed 400 ms before opening the chosen lesson. When the lesson files took longer than 400 ms (slower phones or networks), the early `showSession` call did nothing because the course was not loaded yet, and when loading finished, `loadSeries` opened the first lesson.

Fix (index.html): both functions now wait for `openSeries` (which returns the loading promise) to finish, then open the chosen lesson. No other behavior changed.

Reproduced on the live site with lesson files slowed by 900 ms: 202 lesson 6, 203 lesson 4, 201 lesson 9 and 101 lesson 3 all landed on lesson 1 (4 of 4 failures). With the fix, all open the chosen lesson, at normal speed and slowed.

New check: scripts/home_lesson_jump_browser_check.js (course card list at normal speed and with a 900 ms delay across four courses, plus the full course list path), 18 of 18.

Checks: qa_foundation 0; test_lesson_export 0 (212); test_answer_storage 0 (73); check_lesson_assets 0 (148); test_answer_sync 0 (39); lesson_navigation_browser_check 0 (964); home_lesson_jump_browser_check 0 (18).
