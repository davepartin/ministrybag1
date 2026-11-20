# POLISH-201: Growing Deep, second pass from the Gemini review
Date: 2026-11-19
Agent: Claude
Status: DONE (Dave approved merge of PR #320, 2026-11-19)
Branch: claude/201-polish

Dave asked for a lesson-by-lesson look at a Gemini review of 201, with his principle: no practice for formula's sake (a closing question that already gives a next step is enough), but no lesson without application; add only what makes the lesson clearly better. Claude's test for each suggestion: would a new believer and their mentor clearly miss it? Dave approved each lesson in chat.

Applied:
- 201-01: "There is one God in three Persons: the Father, the Son, and the Holy Spirit. This is called the Trinity." before the Father/Son/Spirit lines; Dave added that the Father is Creator: "The Father, the Creator of the universe, loves you."; John 14:15 after the boss-or-Father paragraph ("Love comes first, and obedience follows.").
- 201-02: Romans 8:1 inside the proud-or-afraid paragraph (no new callout).
- 201-03: D adds conviction vs. condemnation (Romans 8:1; John 16:8 not used because it concerns the world); G adds "He also gives you power to tell others about Jesus (Acts 1:8)."
- 201-04: Psalm 1:3 in the tree paragraph before "Roots before fruit."; Daily Prayers card (same as 101-03) after the practice; "The order matters: mercy first, then offering." (was "Notice the order").
- 201-05: how the shelves read differently (history, psalm, proverb as wisdom not promise, prophet, letter), after the Bookshelf widget.
- 201-06: Redemption adds Abraham (Genesis 12:3) and David (2 Samuel 7:16) between Genesis 3:15 and the cross.
- 201-07: Interpret adds "read what comes right before and right after the verse." Luke 15:1-7 practice kept (Dave).
- 201-08: Romans 5:1 callout after Justified replaces the repeated 2 Corinthians 5:21; boundaries note adds handing the debt to God (Romans 12:19). No added practice: 8.3 is the application.
- 201-09: Galatians 5:16-17 (flesh vs. Spirit) before the Galatians 5:22-23 callout.
- 201-10: father running cut from five mentions to three; step labels "1) Reflect." "2) Remorse." match "3) Plan." "4) Obey." and the widget; Repent and Believe are subheadings; Stop, Turn, Walk bridge after "We all drift."; James 5:16 under Plan. No added practice: 10.2 is the application. Dave noted the lesson already has the two-brothers art.

Declined, with reasons given to Dave: trimming 201-02's last paragraphs; cutting or swapping 201-05's honey section, 201-06's echo stories or 201-07's Luke 15 practice; extra verse callouts; practices in 201-08 and 201-10; a mentor-graduation line in 201-10 (203-10 now does this for the series). For later: 201-07 sheep photo could become a marker sketch; an OIA journal app is an idea only.

Words (before -> after): 01 1,079 -> 1,118; 02 1,167 -> 1,183; 03 1,130 -> 1,172; 04 1,273 -> 1,301; 05 1,343 -> 1,413; 06 1,374 -> 1,416; 07 1,333 -> 1,351; 08 1,123 -> 1,138; 09 1,320 -> 1,394; 10 1,365 -> 1,383.

Checks: qa_foundation 0; test_lesson_export 0 (212); test_answer_storage 0 (73); check_lesson_assets 0 (150); test_answer_sync 0 (39); test_widget_iframe 0 (32); lesson_navigation 0 (964); story_art_sequences 0 (266); l201_01_sequence 0 (58); l201_04_sequence 0 (61); soils_201_04_pacing 0 (103); bookshelf_lesson 0 (708); widget_201_05_bookshelf 0; widget_remove_tap_begin 0 (416); widget_201_08_frame 0; widget_201_10_learning_circle 0 (192); studio_v5 all 201/203 cases pass (202 cases fail on main as before); every addition present in all ten lessons at 375 and 1280, no overflow, no errors (84 of 84); local render and saved-answer reload of 201-01 to 201-10, 18 of 18 each.
