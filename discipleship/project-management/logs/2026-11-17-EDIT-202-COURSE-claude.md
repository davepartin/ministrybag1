# EDIT-202-COURSE: Claude, 2026-11-17

Branch claude/202-01-welcome. Files changed: data/202-01.json through data/202-10.json and LESSON-TEMPLATE.md.

## Scope

Dave reviewed a course-level editorial read of 202 and directed a light pass across all ten lessons: keep his voice, change few words, keep safety wording brief. He approved the 202-01 wording as before/after. The wording in 202-02 through 202-10 was drafted under that direction and still needs his read.

## Changes

- 202-01: "Welcome to Growing Up" heading and two-paragraph welcome with a map of the course; Greatest Commandment widget moved to follow Matthew 22:37-39; the Samaritan sentence now says the story points to Jesus.
- 202-02: one bridge sentence before Ephesians 2:19-22; the roles paragraph split into three blocks with no wording change.
- 202-03: Baptist Faith and Message paragraph in plain words; three "we" phrases moved to self-paced voice; new question 202-03-hand (3.5).
- 202-04: two-sentence bridge on the five equippers as a lens; APEST name beside each farmer; clearer Pruner sentence.
- 202-05: arc sentence in the recap; new question 202-05-hand (5.5).
- 202-06: arc sentence; Isaiah 6:1-8 reference; repeated Hebrews 10:24-25 verse block removed and the two gathered-church paragraphs merged; 6.2 reworded as a hand-off (same ID); second practice paragraph removed; two "we/our" fixes.
- 202-07: arc sentence; widow paragraph ending; six hedged sentences tightened; Rung 3 opening line; pressured-giving caution stated once; second practice paragraph removed; new question 202-07-hand (7.5).
- 202-08: arc sentence; one "A word of care" line; references for Genesis 15, Luke 22:20, Ephesians 5:21; one sentence for wives; one for dating; one sentence setting up the chisel reveal; This Week's Practice; new question 202-08-hand (8.4).
- 202-09: arc sentence; "Centuries earlier"; God's design and a plain definition naming pornography; a line including women; 9.1 and 9.2 reworded (same IDs); repent section points to the Learning Circle; This Week's Practice; new question 202-09-hand (9.5).
- 202-10: recap adds "honoring marriage" and the new covenant; infant baptism paragraph; who the Supper is for; 1 Corinthians 11:27-32 reference; This Week's Practice; new question 202-10-hand (10.5).
- LESSON-TEMPLATE.md: Trust God arc (202.05 to 202.07) and Covenant arc (202.08 to 202.10) added to the arc list.

No existing question ID changed or moved to retiredQuestions. Mid-lesson question counts are four or five in every lesson.

## Verification

From discipleship/ with local static servers:
- bash scripts/qa_foundation.sh: exit 0.
- node scripts/test_lesson_export.js: 186 passed.
- node scripts/test_answer_storage.js: 64 passed.
- node scripts/check_lesson_assets.js: 144 references resolve.
- node scripts/test_widget_iframe.js: 32 passed.
- Browser checks, exit 0: l202_01_sequence 92, l202_02_sequence 77, l202_06_sequence 55, l202_06_story_image 55, l202_07_story_image 69, l202_10_dissolve 128, baptism_202_10_integration 114, review_202_08_09 26, mosaic_lesson 282.
- l202_05_story_image_browser_check.js: exit 1, 3 failures, "all eight saved-answer IDs render". The same 3 failures occur on main without these edits: the check still expects retired question 201-09-5. Not changed here.

Checks not run: Firebase preview, physical iPhone or Safari, widget-specific checks for 202-08, 202-09 and 202-10 widgets (widget files unchanged).

## For Dave

This reopens the 2026-11-14 approval of 202-01 and the 2026-09-26 approvals of 202-08, 202-09 and 202-10. Read 202-07, 202-08 and 202-09 first. Not done on purpose: no conflict or church-hurt question in 202-03 (five-question ceiling), two-part practices left in 202-01 and 202-05, short sentences in 202-09 left alone. curriculum-toc.csv still lists Cross the Road for 202-01.
