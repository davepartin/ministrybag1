# UX-005/006 cleanup of PR #145 (Claude)

Date: 2026-11-12. Branch: claude/ux-005-cleanup, built on top of codex/lesson-footer-email (PR #145) plus main. Dave: "will you clean this up and make it look good."

## What changed on top of ChatGPT's work

- Email labels: each numbered question now appears as its number plus a short form of the question (cut at about 90 characters with an ellipsis). The closing questions are labeled Key thing, This week's step, Daily devotions, and Prayer request instead of being numbered 8.4 to 8.6, which were numbers that do not exist in any lesson.
- Summary source: scripts/lesson-email-summaries.js (37 hand-written summaries, a second copy of every lesson that would drift) is removed. The email summary is the lesson's own description field. PROJECT-BRIEF updated.
- ESV acknowledgment: the full notice stays in About; one short line returns to the bottom of every lesson (class lesson-esv-footnote), so the required notice is on the page where the text is quoted.
- About page: "30 years in ministry" corrected to 25 (Young Life from 2001 per Dave's ministry profile). Banned-word and dash scan of the About copy: clean.
- Tests: test_lesson_export.js now checks every lesson has a plain-text description, every question and checklist gets exactly one label and never a bare number, and long questions are shortened. ux005 and ux006 browser checks updated for the lesson ESV line and the description summary (not rerun here; they need Playwright).

## Checks

qa_foundation pass; test_lesson_export 143 pass; test_answer_storage 64 pass; check_lesson_assets 88 resolve. Email body verified on the PR preview in the browser.
