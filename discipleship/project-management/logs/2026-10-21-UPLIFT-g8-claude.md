# UPLIFT-g8: 101 Starting in Discipleship brought toward the A pattern
Date: 2026-10-21
Agent / reviewer: Claude (worker g8)
Status: REVIEW (pending Dave)
Branch: claude/uplift-g8-101
Base commit: 5c1fe2b
Scope / files reserved: data/101-01.json to 101-07.json; images/aspen-bw.png, aspen-color.png, woman-well-bw.png, woman-well-color.png (each referenced only by 101-05 or 101-06, checked with grep); this log.

## Grades (same eight criteria as reviews/2026-10-21-lesson-grades.md, adjusted for brand-new believers)

The 101 ending exception (combined key-plus-step, devotions, prayer) was kept everywhere and not graded against the 200-series trio.

| Lesson | Before | Work | Biggest problem before | After |
|---|---|---|---|---|
| 101-01 Welcome | B | Polish | No stated big truth or grace line; 1.4 two-part; thin Review | A- |
| 101-02 Salvation and Baptism | B- | Revise | Romans 6:3-4 misquoted; greenhouse frame did not carry; assurance promised by TOC but not taught; 6 questions; no baptism step | A- |
| 101-03 Prayer | C+ | Revise | 7 questions (one per step); no story; thin grace; unlabeled non-ESV Lord's Prayer; 631 words | B+ |
| 101-04 The Bible | B | Polish | 1,661 words; 6 questions; thin grace; description said "DBS" but text never did | A- |
| 101-05 The Church | B+ | Polish | Questions shown out of order (5.3 first); Hebrews 10:24 wording; aspen storm overclaim; ~6 MiB image pair | A- |
| 101-06 Sharing Jesus | B- | Revise | Romans 10:14 misquoted; BLESS taught out of order with Eat missing; three competing tools; 6 questions; unattributed quote | B+ |
| 101-07 When You Drift | B | Revise | Story buried as a verse; no tool; Micah 7:8 wording; running-father image mixed in; two-part questions; 1,609 words | A- |

## Changes and decisions

Every lesson: an opening bridge, one big truth stated in bold and repeated in the Review, a one-line "In the next lesson" bridge, no dashes used as punctuation, and the 101 closing trio unchanged.

- 101-01: tightened the opener; added grace line plus Philippians 1:6; a short valleys paragraph; 1.4 now one question; John reading section moved above the Review; new description.
- 101-02: Dave's greenhouse is now a parable block that carries the lesson (salvation is life God gives underground, baptism is the first green shoot); grace line after the Romans Road widget; Romans 6:3-4 corrected to ESV; baptism step ("tell a pastor or the person walking through this study with you"); assurance paragraph with 1 John 5:13; description added. Retired 2-4. Shown labels renumbered (2-5 shows 2.4, 2-6 shows 2.5).
- 101-03: new "Teach Us to Pray" parable (Luke 11:1-2, Mark 1:35, Luke 6:12), Romans 8:15 grace anchor, "This Week's Practice" around the Daily Prayers tool, Review and description. Step headings, Step 3 "PRAY HIS AGENDA FIRST" and the tool block kept intact for 203-02. Retired 3-3 and 3-6. Lord's Prayer wording kept and labeled (see below).
- 101-04: Three Discovery Questions became one box tool; cut the duplicated builder summary; grace lines ("He gave you this book because He wants to be known by you"; obedience is not how you earn love); "This Week's Practice" absorbs the old 4.2. Retired 4-2. Description no longer claims "DBS".
- 101-05: targeted only. Shown labels now run 5.1 to 5.4 in page order (ids unchanged: 5-3, 5-1, 5-2, 5-4); Hebrews 10:24 to ESV "stir up one another"; storm line softened to "their roots are woven together"; bold big truth; "next lesson" bridge. Checklist untouched.
- 101-06: reordered so BLESS is one in-order "first taste" box (Eat restored), then Story with the ABCs from Lesson 2; Romans 10:14 corrected ("how are they to hear"); D. T. Niles credited; "wrong tribe" and "no one else would be there" softened; grace paragraph (Jesus came to her first); prayer to receive Jesus moved from a verse block to a box so it is not styled as Scripture; BLESS credit line added. Retired 6-4 and 6-6.
- 101-07: lost sheep is now a parable block (Luke 15:4-5, 7 ESV); new "The Way Home: Stop, Turn, Tell, Receive" box tool built from Dave's own closing sentence; running-father wording replaced with the Shepherd; Micah 7:8 fixed to ESV; questions made single. Retired 7-2. Prodigal son and the Learning Circle left to 201-10.
- Images: aspen and woman-at-the-well pairs resized to 1400 px wide, same filenames and PNG format. B&W files saved as 8-bit grayscale, color files as 256-color palettes. Pair total about 10.4 MB down to 2.7 MB. Checked side-by-side crops at 1:1; aspen-bw loses a faint warm tint, nothing else visible.

Retired IDs (never reuse): 2-4, 3-3, 3-6, 4-2, 6-4, 6-6, 7-2 (7-5 was already absent). Pre-launch, so no learner data.

## Verification

- `bash scripts/qa_foundation.sh`: all foundation QA checks passed (415).
- `node scripts/test_answer_storage.js`: 64 passed. `test_lesson_assets.js`: 8 passed. `test_widget_iframe.js`: 32 passed.
- Playwright (scratch script, not committed) at 390x844 and 1280x900 on port 8808: every lesson opened with `openFromDropdown('101', n)`; all surviving questions render, retired IDs absent, Review present, no broken images, no page sideways scroll, no page errors; Romans Road widget stepped through all states with iframe scrollWidth <= clientWidth. 80 pass, 0 fail. Screenshots reviewed in scratch.
- Checks not run: real phone, print, reduced motion.

## Handoff
Changed files: the seven 101 JSON files, four images, this log.
Remaining work: Dave's review (see PR "Dave must read"). TOC values for 101.02, 101.05, 101.06, 101.07 proposed in the PR for the coordinator.
Commit / PR / GitHub sync state: see `git log -- discipleship/project-management/logs/2026-10-21-UPLIFT-g8-claude.md`; PR open, not merged.
