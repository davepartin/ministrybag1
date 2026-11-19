# COMMISSION-203-01: the Great Commission circles in 203-01
Date: 2026-11-19
Agent: Claude
Status: DONE (Dave approved merge of PR #328, 2026-11-19)
Branch: claude/203-01-commission (built on Gemini's gemini/widget-203-01-great-commission, PR #324, merged with main)

Dave in chat on November 19: use Gemini's approved Great Commission widget (widgets/great-commission-203.html) in 203-01, remove the Greatest Commandment widget and the circles picture, introduce personal ministry well, and rewrite as needed so the lesson connects with the widget without repeating it.

Lesson changes (1,468 to 1,331 words):
- The opening (recap, Four Friends story, "Carried people become carriers", the personal ministry definition, 1.1) is unchanged.
- "Loved First, Then Sent" (the cross recap that introduced great-command-v5-203) and the cross widget are removed. The widget's own cards now name Growing Deep, Growing Up and Growing Out.
- "Jesus Sends Ordinary People" (the mountain, Matthew 28:18-20, "You do not have to be fearless or finished to be sent") now comes before the widget and is the Study quick link.
- New "Where the Mission Goes": "Jesus did not leave His followers guessing where to begin. The mission moves out one circle at a time, and it starts at the center, with you." Then the Great Commission widget (Diagram quick link), then: "You do not start at the edge. You start at your own front door, with the people who already know you, and love keeps moving out from there. One day your one may reach their own one. That is how the gospel fills every circle: disciples who make disciples."
- The circles picture (images/203-01-love-moves-out.png) and its caption are removed; the file stays in the folder.
- The separate Acts 1:8 callout and its two paragraphs are removed, because the widget walks through Acts 1:8 step by step.
- Love Has Names and 1.3 now use the widget's circles: home and church, work and school, neighborhood and city (1.3 id kept).
- Teach-it 1.4 (203-01-hand) retired.
- Review: "Now Jesus sends you, and His love keeps moving out from the center: to your home and church, your work and school, your neighborhood and city, and the world."
- Fruit tree paragraph and 1.2, Who's your one, A Life Not a Project with BLESS, You Carry Jesus Heals, practice and closing trio unchanged.
- Description and quick links (Study "Jesus Sends Ordinary People", Diagram "The Great Commission") updated; curriculum-toc 203.01 row updated.

Scripts: rewrite_203_01_browser_check.js now expects six fields and the Great Commission widget, and checks the old picture and cross widget are gone; studio_v5_browser_check.js no longer runs the 203 lesson case (that lesson no longer uses great-command-v5-203).

Checks: qa_foundation 0; test_lesson_export 0 (212); test_answer_storage 0 (73); check_lesson_assets 0 (147); test_answer_sync 0 (39); rewrite_203_01_browser_check 0 (168); widget_203_01_commission_browser_check 0 (241); widget_remove_tap_begin_browser_check 0 (416); lesson_navigation_browser_check 0 (964); studio_v5 201 cases pass (202 cases fail on main as before); placement check at 375/390/1280 (iframe tall enough for the whole widget, Next visible, widget after Matthew 28, no repeated Acts 1:8 callout, quick links on one line, no overflow, no errors) 39 of 39; local render and saved-answer reload of #203-1, 18 of 18.
