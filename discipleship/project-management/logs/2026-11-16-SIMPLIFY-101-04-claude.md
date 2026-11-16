# SIMPLIFY-101-04: one teacher for the Three Discovery Questions
Date: 2026-11-16
Agent: Claude
Status: REVIEW. Dave's read pending.
Branch: claude/101-04-simplify

## Assignment

Dave: "do we need the block out text and this new widget... it is too much for a 101 lesson, i love the widget, but is there a reason we need all of this, review the teaching and the widget and let's make this amazing."

## Finding

The approved Read, Discover, Respond widget (#229) repeats three pieces of lesson text almost word for word: the setup paragraph ("Choose a short passage and read it slowly..."), the Three Discovery Questions box (same three questions and explanations, plus a worked example in the widget), and the "These questions give you a place to begin... ask a trusted Christian... hidden message" paragraph (the widget's last card). Learners met the questions in a paragraph, a box, the widget, the John 3 practice, a recap, the share section, the practice and the review.

## Changes (prose only)

- Setup paragraph replaced by a one-line lead-in: "Here is a simple way to listen to God in any passage: read it slowly, then ask three questions." The widget follows it.
- Removed the Three Discovery Questions box and the "These questions give you a place to begin" paragraph.
- Recap after the John 3 questions: "That is the rhythm: Read, discover, respond. Begin with what is clear, and keep asking about what you do not yet understand."
- Share paragraph: "You do not have to know every answer to read the Bible with a friend. Open a short passage together and ask the same three questions."

Unchanged: recap, Nicodemus story, God Speaks Through His Word, 2 Timothy 3:16-17, the widget file (byte-identical) and its slot between the section heading and Try It, John 3:1-4, 16-17 with 4.2-4.4 (which name the three questions, so email and print exports still carry them), Live What You Discover, 4.5, the practice, review, John 10-12 reading and closing four. Lesson words 1,070 to 940.

scripts/widget_101_04_rdr_browser_check.js: the placement assertion now anchors on the new lead-in line instead of the removed paragraph.

## Verification

qa_foundation 0; test_lesson_export 0 (186); test_answer_storage 0 (64); check_lesson_assets 0 (139); widget_101_04_rdr_browser_check 226 passed (temporary copy pointed at /opt/pw-browsers/chromium); local render of #101-4 at 375/390/1280, 18 of 18.
