# UPLIFT-g4: the 202 love trilogy (202-01, 202-02, 202-03)

Date: 2026-10-21. Worker: Claude. Branch: `claude/uplift-g4-202-love`. Source: the 2026-10-21 lesson grades plus the coordinator brief.

## Changes

### 202-01 Loving Your Neighbors
- The parable now opens with the Luke 10:25-29 setup in the correct order: the law teacher quotes both commandments, Jesus says he answered correctly, and then he asks "And who is my neighbor?" The parable ends with Luke 10:36-37.
- The inn and innkeeper allegory is cut. "The Samaritan is Jesus" stays, introduced as the story pointing past itself. The payment line is now "The Samaritan paid ... out of his own pocket. Jesus paid for yours with His own life."
- The self-love and Golden Rule sections are merged into "Love Your Neighbor as Yourself". Philippians 2:3-4 is added, with a pointer to 2:5-8 for grace.
- The reused `great-command.html` (owned by 201-01) is replaced by a NEW widget, `widgets/cross-the-road.html` ("Cross the Road"). It is a six-step road from Jerusalem to Jericho: Who is my neighbor, Two passed by, One crossed over, The question flips, Jesus crossed to you, and Now cross the road. It uses no circles, so it does not duplicate cornerstone or the 203 circle maps.
- The course orientation is trimmed to one bridge paragraph plus the logo. There is a new Review sentence of the big truth and a next-lesson bridge.
- Big truth: "Because Jesus crossed the road to you, you can cross the road to others."
- Words (my count of body text, which runs about 4% above the grade report's): 2,172 before, 1,480 after.

### 202-02 Loving Your Family at Home
- "Loving as a Spouse" is replaced by a one-line pointer to Lesson 8.
- The 1 Timothy 3:4-5 verse (NLT, an elder qualification) and its paragraph are removed.
- New section "Where Love Is Most Tested: Forgiveness", built on Colossians 3:12-14 (ESV), with grace first ("chosen, holy, and beloved", "as the Lord has forgiven you"). It then walks the Forgiveness Loop: Examine (Matthew 7:3-5), Confess, Forgive, Rebuild.
- New question `202-02-forgive` (shown as 2.3).
- New short "If You Are Single" section, using Psalm 68:6 ESV. It avoids 202-08's 1 Corinthians 7 and "Jesus never married" lines.
- "When the Family Story Is Broken" is kept. It gains a safety line: forgiveness is not trust and never requires staying in harm's way.
- Q2.4 (`202-02-4`) is retired and folded into This Week's Practice.
- The cornerstone widget, the builders story and the image sequence are unchanged.
- Big truth: "Build your home on Jesus, and forgive the people closest to you the way He has forgiven you."
- Words: 1,568 before, 1,531 after.

### 202-03 Loving Your Church Family
- New carrying story: "The Early Church", a parable block covering Pentecost and Acts 2:41, then the ESV text of Acts 2:42-47 (verse 43 elided).
- The Jonathan story is removed so there is one story. 1 Peter 2:9-10 (the TOC key verse) gets its own section.
- Removed: the Ephesians 2 block (202-02 owns it) and the 1 Corinthians 12 body section, which is now a one-sentence pointer to 202-04.
- New widget, `widgets/one-another.html` ("One Another"). It shows eight New Testament one-another cards under John 13:34. Each card has an ESV verse, a "Jesus first" line and a "Try this" line. The learner picks one, and the practice says to live it out.
- New "When Family Disagrees" paragraph using Matthew 18:15 and Ephesians 4:32. The "Belonging That Blesses the World" section is folded into "Love One Another".
- Q3.3 (`202-03-3`) and Q3.6 (`202-03-6`) are dropped, leaving 4 questions. Ids kept: `202-03-4`, `-2`, `-1` and `-5`, relabeled 3.1 to 3.4. `-1` is reworded as a single question.
- Big truth: "God has made you part of His family, so love one another the way Jesus has loved you."
- Words: 1,342 before, 1,231 after.

## Checks
- `bash scripts/qa_foundation.sh`: all foundation QA checks passed (415).
- `node scripts/test_answer_storage.js`: 64 passed.
- `node scripts/test_lesson_assets.js`: 8 passed.
- `node scripts/test_widget_iframe.js`: 32 passed.
- Ran Playwright headless Chromium on a local server at 127.0.0.1:8804. Each lesson was opened with `openFromDropdown('202', n)` at 390x844 and 1280x900. Results: no page errors or console errors or warnings, no broken images, and page scrollWidth equal to clientWidth. Inside every widget iframe, scrollWidth is less than or equal to clientWidth.
- Both new widgets were stepped through every state at 375 and 1280, and the screenshots were reviewed. No clipped text and no console errors. The nav buttons keep the same position across steps. In one-another, both right-hand buttons have a fixed min-width.
- No em dashes in the owned files.

## Open items
- These need Dave's review: the "Samaritan is Jesus" framing, the Forgiveness Loop wording, the singleness paragraph, the Acts 2 retelling, and the one-another card copy.
- The widget block carries `title`, because `scripts/widget-iframe.js` KNOWN_TITLES does not list the two new widgets. The iframe also picks up each document's `<title>`.
- TOC row changes are proposed in the PR or report for the coordinator.
- The Acts 2 story has no art yet. The report has an art prompt.
