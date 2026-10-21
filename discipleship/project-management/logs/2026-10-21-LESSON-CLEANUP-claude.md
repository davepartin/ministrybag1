# LESSON-CLEANUP: mechanical fixes from the October 21 grades (Claude)

Date: 2026-10-21
Branch: `claude/lesson-mechanical-cleanup` (from `origin/main` at `2ef7464`)
Source: the mechanical items in `reviews/2026-10-21-lesson-grades.md` (PR #53).
Scope: `data/201-03, 201-07, 201-10, 202-01, 202-02, 202-05, 202-06, 202-07, 203-01, 203-04, 203-07, 203-09, 203-10`, `widgets/grace-diagram.html`, `widgets/learning-circle2.html`, `scripts/test_answer_storage.js`, `scripts/eng001_browser_check.js`, this log.

203-02 and 203-03 were not touched. A separate session is revising them (PR #52). TASKS.md was left alone to avoid conflicts with PR #52 and PR #53. The board rows can be updated when Dave reviews.

## Done

Only changes that don't need Dave's voice. No stories were rewritten, no sections were cut, and no theology changed.

**Standard closing trio** in 202-05, 202-06, 202-07, 203-01, 203-04 and 203-07, copied from 202-08 and 203-06. The `-key` question keeps its ID and its text becomes "What is one key thing you learned from this lesson?". The Daily Devotions question is retired, and a new `-step` question takes its place. This follows the 202-09 precedent: the retired ID is never reused, and any stored value stays in the store.

| Lesson | Retired ID | New ID |
|---|---|---|
| 202-05 | `202-05-devos` | `202-05-step` |
| 202-06 | `201-05-devos` | `202-06-step` |
| 202-07 | `202-07-devos` | `202-07-step` |
| 203-01 | `203-01-devos` | `203-01-step` |
| 203-04 | `203-04-devos` | `203-04-step` |
| 203-07 | `203-07-devos` | `203-07-step` |

`scripts/answer-storage.js` is unchanged, as it was for 202-09 and 203-06. Its lists describe historical shared keys for the one-time migration.

**Lesson Reviews added** in 201-10, 202-05, 202-06, 202-07, 203-01 and 203-07. Each is a 4-sentence summary of what the lesson already says. 203-07 also gets the one-line bridge to 203-08 that the report asked for. 201-10's review sits after "Growing Up from Here", matching 202-10's placement.

**Visible numbering.** 202-05 questions now show 5.1-5.5 (they showed 9.x). 202-06 questions show 6.1-6.5 (they showed 5.x). The question `id` values are unchanged. The 202-07 JSON title now reads "Lesson 7: Giving & Generosity".

**ESV wording:**

- 201-03: Exodus 13:21 is now ESV. The NIV label and the added "GUIDE" caps are gone.
- 201-07: Psalm 23 now prints "LORD" twice.
- 201-10: Luke 15:17 and Isaiah 53:6 ("LORD") are now ESV. Also, not flagged by the report: "Go and sin no more" now reads "Go, and from now on sin no more" (John 8:11 ESV).
- 202-02: 1 Timothy 3:4-5 is now ESV. Whether to swap the passage for Colossians 3:12-14 is left to Dave.
- 202-07: Psalm 24:1 is now ESV.
- 203-07: Luke 10:19 now reads "tread" and "hurt".
- Not flagged by the report: 202-06 Isaiah 6:3 and 203-01 Deuteronomy 6:5 now print "LORD".
- `grace-diagram.html`: Ephesians 2:4-5, 2 Corinthians 5:21 and Ephesians 2:8-10 are now ESV, with verse 10 completed. So are the header line and the intro line for Ephesians 2:8. Romans 5:9 is now ESV, and the teaching glosses stay in square brackets: "blood [on the cross]" and "wrath [punishment]". ESV's dash in Ephesians 2:5 is printed as " - ".
- `learning-circle2.html`: Psalm 139:23-24, Psalm 119:59 and 2 Corinthians 7:10 are now ESV.

**Placeholder.** The visible "[PLACEHOLDER: Personal Ministry Map infographic ...]" line in 203-01 is removed. The map itself is left for Dave.

**Factual slips:**

- 202-01: the law teacher now quotes the two great commandments himself, and Jesus tells him he answered correctly (Luke 10:26-28).
- 203-10: the line now reads "the first person God named to build it was not a priest but a craftsman." This is the report's suggested sentence, which replaces "not a preacher. It was a builder." Dave may prefer to keep "preacher" and "builder".
- 203-09: "Wherever they lived" now reads "In Ephesus and in Rome".
- 202-05: "endurance produces character" is now credited to Paul (Romans 5:3-4), and James 1:3-4 keeps "the testing of your faith produces steadfastness."

**Also fixed:** 202-06 "require you to being honest" now reads "to be honest." The report listed it.

**Tests.** `test_answer_storage.js` now expects `-step` for 202-05 and 203-07. It also checks that none of the six retired IDs is reused, and that retired answers and new step answers survive migration and reload separately. `eng001_browser_check.js` now fills `202-05-step` and checks that the `202-05-devos` field is gone.

## Verification

- `bash scripts/qa_foundation.sh`: all foundation checks passed (415 sub-checks in the final stage).
- `node scripts/test_answer_storage.js`: 64 passed.
- `node scripts/test_lesson_assets.js`: 8 passed.
- `node scripts/test_widget_iframe.js`: 32 passed.
- `node scripts/test_lesson_export.js`: 40 passed.
- `eng001_browser_check.js`: 19 passed. It ran against a local static server using a scratch Playwright install with the installed Chrome (`channel: 'chrome'`), because Playwright is not installed in the repo.
- Headless render at 390 px of all 201, 202 and 203 lessons: every lesson except 203-02 and 203-03 shows a "Lesson N Review" and the key, step and prayer trio. No "Daily Devotions" or "PLACEHOLDER" text appears, and the 202-05 and 202-06 labels show 5.x and 6.x.
- I stepped through both widgets headlessly and screenshotted the longest card (Ephesians 2:8-10). The card grows to fit and the buttons stay in place.
- `scripts/build_answer_index.js` does not exist, so nothing was rebuilt.

## Left for Dave (from the report, needs his voice or judgment)

- 203-01: "Over the next three lessons" (BLESS now runs four lessons), the ministry map, and the question load.
- 201-10: the course recap in "Growing Up from Here" and a "Trust" step on the Believe side.
- 202-06: grounding Romans 12:1 in "by the mercies of God", and the duplicate lament section.
- 202-05: the Genesis 50:20 "caused vs directed" paragraph.
- Every story, tool, length and theology item in the report.
- This pass did not audit lessons outside the flagged list for translation drift.
