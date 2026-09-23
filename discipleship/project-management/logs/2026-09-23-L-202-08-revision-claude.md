# L-202-08: cleaner lesson with the covenant triangle widget
Date: 2026-09-23
Agent / reviewer: Claude (Claude Code) / Dave
Status: REVIEW
Branch: claude/l-202-08-marriage-revision
Base commit: bd137b4 (origin/main, includes merged PR #17)
Scope / files: data/202-08.json, widgets/covenant-triangle.html (new, dedicated to this lesson), curriculum-toc.csv (202.08 tool label only), Lesson_research/202.08_research.md, scripts/review_202_08_09_browser_check.js (lesson 8 visual check now targets the widget), this log.

## Changes and decisions

This is the DAVE-001 revision packet for 202-08, from Dave's direct request: make it clean and to the point, draw the best from his sermons, and reconsider the diagram. Details and sources are in `Lesson_research/202.08_research.md`.

- **New widget:** a four-step covenant triangle replaces the static Contract or Covenant image and carries both of its phrases. Dave directly authorized a lesson-dedicated widget; no shared widget or host code was touched.
- **Prose:**
  - Bridge merged.
  - Contract/covenant tightened.
  - Husband paragraph adds Dave's "lay down your pride" line.
  - Chisel illustration added, unattributed, with a safeguard sentence.
  - Forgiveness paragraph added.
  - "Every Season" names blended and single-parent families.
  - Review shortened.
  - Proverbs 17:17 block removed.
- **Unchanged:** the Genesis 15 parable and its art, the recap, the Lamentations, Ephesians 5 and 1 Corinthians 7 verse blocks, the wives paragraph, and the "What covenant love is not" box.
- **Question blocks:** all seven are byte-identical to main. No new, retired or reworded questions.

## Verification

1. `bash scripts/qa_foundation.sh`: all checks passed.
2. `node scripts/test_answer_storage.js`: 47 passed.
3. `node scripts/check_lesson_assets.js`: 72 references resolve.
4. `review_202_08_09_browser_check.js`, with Playwright and Chrome against `python3 -m http.server 8767`: **20 passed**. The lesson 8 check now confirms the widget iframe loads its diagram and Begin control within page width at 375, 390 and 1280px.
5. Widget file opened alone with reduced motion at 375 and 1280px, every step plus the whole-diagram view screenshotted: 0 page errors; labels stay inside the drawing (smallest left label x = 12 after moving the base inward).
6. Inside the real app at 390 and 1280px: clicked Begin, Next three times, Restart visible. The iframe auto-sized to its content (568 and 581px). 0 page errors.
7. 0 em or en dashes in the lesson, widget and research notes.

Checks not run: physical iPhone Safari, screen reader, print, human pilot.

## Handoff

Remaining: Dave reviews the lesson text, the widget and the unattributed chisel wording, and decides between Genesis 15 and Joseph. Merge only on his approval.

## Follow-up the same day: Dave's decisions applied

- Widget labels changed to You and Them. The final card and the "Every Season" paragraph now cover spouse, fiancé and dating relationships.
- Kathy Keller's marble line is quoted exactly with credit (Dave confirmed it in his copy; it also matches secondary sources). Tim Keller's chisel point is paraphrased with credit.
- Genesis 15 stays as the story and image.
- Question blocks are still byte-identical to main.
- Checks rerun:
  - foundation QA passed;
  - storage 47 passed;
  - assets 72 resolve;
  - `review_202_08_09_browser_check.js` 20 passed;
  - widget clicked through in the app at 390 and 1280px with 0 errors;
  - every widget step screenshotted at 375 and 1280px, with labels inside the drawing.
