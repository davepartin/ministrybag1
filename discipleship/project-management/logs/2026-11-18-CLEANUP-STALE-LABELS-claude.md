# CLEANUP-STALE-LABELS: Claude, 2026-11-18

Branch claude/cleanup-stale-labels from main.

Dave asked for simple cleanup fixes when found, and to be told about each. The lesson menus show the Subtitle column of curriculum-toc.csv under each lesson title, and lesson pages take their h1 title from the Title column.

## Changed

- curriculum-toc.csv Subtitle and Tool columns (only these two columns, four rows):
  - 202.01: Cross the Road (widget removed in PR #202) to The Greatest Commandment (who is my neighbor?)
  - 202.05: The Valley Road (James 1:2-4) to Trust the Creator (the mosaic)
  - 202.07: Stewardship Flip and Generosity Ladder to Time, Talents, Treasure and the Generosity Ladder
  - 203.01: a working note naming the widget to Love moves out: who's your one?
- 203-05: "the question that sits under your Personal Ministry Map" to "under every circle on your map".
- 203-09: "you drew your Personal Ministry Map" to "you wrote the names on your map".
- 203-10 review box: "You drew your Personal Ministry Map" to "You wrote the names on your map".

The Personal Ministry Map widget left 203-01 in PR #299; the map itself remains as the names readers write in 1.3.

## Reported, not changed

Four lesson pages show the course-plan title, which differs from the lesson file title: 201-06 (Biblical Storyline / The Biblical Storyline), 202-02 (Loving Your Family at Home - Your First Neighbors / Loving Your Family at Home), 202-04 (Discovering Your Gifts - APEST - Equip the saints for the work of ministry / Discovering Your Gifts), 202-05 (Suffering / Suffering and Trials). Choosing the title is Dave's decision.

## Verification

Only columns 4 and 5 of four rows changed in the CSV. Foundation QA, lesson export 186, 203-09 browser 14, 203-09 story image 61, lesson navigation 964: pass. Browser: the four new subtitles show in the lesson menus.
