# TITLE-MATCH-4: Claude, 2026-11-20

Branch claude/title-matches from main 617a152c.

The course plan (curriculum-toc.csv) sets the title readers see in the lesson heading, the phone top bar and the lesson menu; the lesson file's title is used in the email export. Four lessons disagreed. Dave chose, 2026-11-20, the lesson-file title for all four:

- 201-06: The Biblical Storyline (plan said Biblical Storyline).
- 202-02: Loving Your Family at Home (plan said Loving Your Family at Home - Your First Neighbors).
- 202-04: Discovering Your Gifts (plan said Discovering Your Gifts - APEST - Equip the saints for the work of ministry).
- 202-05: Suffering and Trials (plan said Suffering).

Changes: those four Title cells in curriculum-toc.csv (csv module, only column 3 of those rows), and the credits.json titles for 201-06 and 202-05 (202-02 and 202-04 have no credits entry). Lesson files unchanged.

Top bar fit, measured against the space the bar gives the title: all four fit at 375 and 390 px. At 360 px three fit; Loving Your Family at Home is a few pixels too wide. At 320 px only Suffering and Trials fits whole. The old 202-02 and 202-04 titles were cut at every phone width.

Check fix: scripts/l202_02_sequence_browser_check.js required frame index 4 to show at progress 0.48, which is the boundary between index 4 and 5, both house-rock-seq-3 (the frame is listed twice so it holds). The shorter 202-02 heading moved the page by a fraction of a pixel, so index 5 (the same picture) showed instead. The check now accepts either copy. Nothing changes on screen.

Verification: foundation QA, lesson export 212, answer storage 73, widget iframe 32, lesson navigation 964, l202_02_sequence 77, widget_202_05_mosaic 200: pass. l202_05_story_image fails 3 checks exactly as on main (it still expects a retired question; not changed here). The four headings and top bars show the new titles at 390 px.
