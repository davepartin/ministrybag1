# SERIES-FINISH: remaining items from Grok's series review
Date: 2026-11-27
Agent: Claude
Status: REVIEW
Branch: claude/series-finish

Dave on November 27: "Do all these things. Approve." (the remaining review items).

- Grok's report PR #374 merged as a record; its TASKS row and log marked DONE.
- 201-05: the trust paragraph is now "Can a book copied by hand for centuries still be trusted? The psalmist sang, "Forever, O LORD, your word is firmly fixed in the heavens" (Psalm 119:89), and God has kept His Word on earth too. You are opening a Word God has carried faithfully through time." (manuscript and Dead Sea Scrolls detail removed).
- 202-09: the When the Gun Goes Off widget (and its Diagram link) moved from before "R-U-N from Sin" to after the N section, just before 9.3, so the learner meets R, U and N before the branching picture.
- 101-04: added "You will see it first on a short passage, John 1:11-12, and then try it yourself with Nicodemus." so the widget's sample passage and the Nicodemus practice no longer surprise the learner.
- curriculum-toc.csv (lesson menu subtitles and tool names): builder words removed and stale rows fixed. 101.01 Peaks and Valleys; 101.03 The Lord's Prayer pattern; 101.04 Read, Discover, Respond; 101.05 The potluck, not the restaurant; 101.06 BLESS and the ABCs of the Gospel; 201.01 The Greatest Commandment; 201.02 tool The Great Exchange; 201.04 tool Five Roots; 201.05 A library of 66 books; 201.06 One story in four movements; 201.07 Observe, Interpret, Apply; 201.09 One fruit, nine expressions; 201.10 The Learning Circle; 202.02 Jesus the Cornerstone and the three R's of forgiveness (story no longer names the Forgiveness Loop); 202.03 Living the one anothers; 202.06 Reflect His Glory; 202.08 The Closer to God Triangle; 202.09 RUN: Remember the Cross, United with God, Need others; 202.10 The doorway and the table; 203.05 Three stories and the 3 Circles; 203.06 Your Three Spaces; 203.08 SPACES; 203.09 Your Mission Map (summary no longer names the Send Network); 203.10 Love comes down, goes up, and reaches out (was empty / Marks of a True Christian). 201.02 summary no longer says widget.
- Gemini prompt written for the two widget fixes that need drawing work (203-05 3 Circles last step; 202-09 Back and Next button order). Not part of this PR.

Checks: qa_foundation 0; test_lesson_export 0 (212); test_answer_storage 0 (73); check_lesson_assets 0 (148); test_answer_sync 0 (39); lesson_navigation_browser_check 0 (964); widget_202_09_starting_gun_browser_check 0 (294); review_202_08_09_browser_check 0 (26); widget_101_04_rdr_browser_check 0 (248); menu check (new labels in course menus, no builder words, 201-05 paragraph) 4 of 4; targeted 202-09 order and 101-04 sentence 6 of 6; local render and saved-answer reload of 201-05, 202-09 and 101-04, 18 of 18 each.
