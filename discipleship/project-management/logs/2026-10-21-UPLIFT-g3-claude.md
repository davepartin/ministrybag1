# UPLIFT g3: polish 201-01, 201-02, 201-03, 201-08, 201-10

Date: 2026-10-21. Worker: Claude (g3). Branch: `claude/uplift-g3-201-polish`.
Sources: `project-management/reviews/2026-10-21-lesson-grades.md`, `project-management/reviews/201-08-benchmark-proposal.md`, coordinator brief.

Targeted edits only. No question id was renamed or reused. One id retired (201-02-2) and one added (201-02-4).

## Changes

### 201-01 Loving God (1,281 to 1,260 words)
- Collapsed the "Welcome to the Growing Courses" heading, course paragraph, 3-circles image and Growing Deep paragraph into one short welcome, so the Running Father story opens the lesson.
- Kept Dave's "double meaning" lines; moved them under "Because He Loved First".
- Reordered after the widget: cross text, boss-vs-Father text, 1.2 (now one question), 1.3 (now an explain-the-diagram prompt), then John 3:16 and the Trinity preview. The "say this line" content lives on in the practice.
- Added a one-line next-lesson bridge after the Review.
- Kept Mark 12:29-30 (the Shema teaching and the widget both use Mark 12). TOC key verse change requested.

### 201-02 New Identity in Jesus (1,274 to 1,271)
- Opening now bridges from lesson 1; cut the pre-story summary paragraph.
- Retired 2.2 (201-02-2). New 2.2 (201-02-4) after the widget: explain the Great Exchange in your own words.
- New practice: a two-sided card (old labels / "I have put on Christ") kept where you get dressed. Different form from 201-01's morning line.
- Next-lesson line split out of the Review.

### 201-03 Guiding of the Holy Spirit (1,398 to 1,531)
- Exodus 13:21 NIV with "GUIDE" kept exactly (parable text unchanged, asserted in script).
- Pillar labeled as a picture ("Just as the pillar went before Israel, the Spirit now leads..."), in the post-story text, the D step and the Review.
- "Only scene... whole Trinity is visible" changed to "one of the clearest moments... all three persons are revealed together."
- New discernment paragraph after D: Spirit never leads against Scripture, often confirms through mature believers (Proverbs 15:22 ESV), peace alone is not the test.
- Added This Week's Practice (morning prayer plus a three-question decision check). Replaced the closing "take a breath" line with a next-lesson bridge. Folded the "quiet comfort" paragraph into the wilderness paragraph.

### 201-08 Grace and Mercy Cycle (1,357 to 1,177)
- Applied the benchmark proposal: bridge, then story first; cut the four-definitions block and its lead-ins; Ephesians 2:8-10 and the diagram now follow 8.1; 8.2 sits directly under the widget.
- Justification defined as "God declares you righteous because of Jesus, received by faith" with the proposal's supporting explanation. "Just-if-I'd" removed from the lesson text.
- One word order everywhere in the lesson: Mercy, Justified, Righteous, Grace (matches the widget's cycle).
- Parable now includes the jailers and Matthew 18:35 (ESV), with one honest sentence: forgiving others does not earn God's forgiveness, but a heart that stubbornly refuses to forgive shows it has never truly received His.
- Added the proposal's boundaries sentence. 8.3 reworded so it does not ask for another person's details. Removed the duplicate Ephesians 2:8-9 verse block.

### 201-10 Repentance and the Learning Circle (1,664 to 1,589)
- Luke 15:17 NIV kept and labeled.
- Believe side now opens with Trust: receive His forgiveness, with 1 John 1:9 moved up to sit under it. Plan now quotes John 8:11 in full ("Neither do I condemn you...") to show mercy before the call.
- Course recap corrected: 101 Starting, 201 Growing Deep, 202 Growing Up (character and family), 203 Growing Out (mission).
- Trimmed the lesson-one retelling to three sentences; trimmed repeated "humility cracked you open" lines.
- Fixed "ditched" and "You have got this" (now Philippians 1:6). "his forgiveness" capitalized. 10.3 made a single prompt.
- Review now includes "trust His forgiveness"; added next-lesson line and a 3DM credit line.

## Checks
- `bash scripts/qa_foundation.sh`: pass. `test_answer_storage.js`: 64 pass. `test_lesson_assets.js`: 8 pass. `test_widget_iframe.js`: 32 pass.
- Playwright (chromium headless) at 390x844 and 1280x900, each lesson opened with `openFromDropdown('201', n)`, every widget stepped to the end (4, 9, 5, 5, 6 steps). No page or console errors. No horizontal overflow inside any widget iframe on any step. Screenshots reviewed (kept in scratch, not the repo).
- No em or en dashes in the five files.

## Open items
- TOC: 201.01 key verse to Mark 12:29-30; 201.08 summary word order and definition; 201.10 summary wording ("ditched").
- g7: grace-diagram justification wording and verse fixes; learning-circle Trust line. See the PR description.
- Optional for index.html owner: 201-01 no longer carries the 3-circles image, and `showLogo` skips idx 0, so lesson 1 shows no course art.
- Dave: Matthew 18:35 sentence, the discernment paragraph, the 201-02 card practice, John 8:11 use in 201-10.
