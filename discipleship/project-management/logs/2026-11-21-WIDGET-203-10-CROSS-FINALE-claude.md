# WIDGET-203-10-CROSS-FINALE: Claude, 2026-11-21

Branch claude/203-10-cross-finale from main 66895453.

## Direction

Dave was struggling with the Marks of a True Christian widget as the series ending and asked whether 203-10 should end with the Greatest Commandment instead: it sums up the Law and the Prophets (loving God, loving the church, loving the world), and the love for enemies is the model of the cross (Jesus loving God's enemies), so readers go and share the Jesus story and welcome people into the rescued family of God. Claude recommended ending with the 203 chapter of the cross (unused since 203-01 got the Great Commission circles) plus a new last step; Dave: "build what you think is best, just one widget on 203-10 and make it the greatest commandment idea you mentioned".

## Widget

- `widgets/great-command-v5.js`: new version `203-10` (title The Greatest Commandment, tag 203-10, opening card "One love, from the first lesson to the last.").
  - Start: Matthew 22:40 (the Law and the Prophets).
  - 1 God's Love Comes Down (1 John 4:19), gold.
  - 2 Love God With All You Are (Mark 12:30), green, labeled Growing Deep.
  - 3 Love One Another (John 13:35), blue, Growing Up.
  - 4 Love Everyone, Even Enemies (Romans 12:20), plum, Growing Out, with Elisha's army.
  - 5 The Cross Is Love for Enemies (Romans 5:10), the crimson double contour.
  - 6 Welcome Home (Ephesians 2:19): six people who stood outside the end of the outward arm walk in along it, through the center of the cross, change from plum to blue, and settle in the family arm. Card: "Now go and tell the Jesus story. The love that reached you is still reaching, and there is room in the family for one more."
- The figures exist only in version 203-10, are moved by the existing animation loop, land at once on Back, dots backward and reduced motion, and leave nothing running when the step ends. The 201, 202 and 203 versions are unchanged (checked: same dots, tags, no figures).
- `widgets/great-command-v5-203-10.html`: wrapper, same as the 201 wrapper with version 203-10.
- `scripts/widget-iframe.js`: known title for the new wrapper.

## Lesson (data/203-10.json)

- The Marks of a True Christian widget block is replaced by the Romans 12:9-21 verse block (ESV, as before PR #354). The three shape paragraphs, the growing-in-it paragraph and the opened-eyes paragraph are unchanged.
- The cross is placed after Mark 12:30-31 in Love Comes Down, Goes Up, and Reaches Out, with the diagram anchor; contents gain Diagram: Greatest Commandment.
- All other text and question IDs unchanged.

## Checks

- New `scripts/widget_203_10_cross_browser_check.js` (161 checks):
  - every step at 320, 375, 390 and 1280
  - steady card and widget height, no sideways scroll
  - finale positions and colors, still after the motion ends
  - Back and dots, reduced motion
  - the other three versions unchanged
  - one widget in the lesson, the full iframe shows, Diagram jump target, still while idle
- Removed `scripts/marks_203_10_integration_browser_check.js`, which checked the Marks widget inside 203-10. The standalone `widget_203_10_marks_browser_check.js` still passes (182), since the widget file is kept.
- Foundation QA, lesson export 212, answer storage 73, assets 144, widget iframe 32, update_203_10 92, lesson navigation 964, story art sequences 266: pass. Contents check across 203: 306 of 306.
- studio_v5 and widget_headers fail exactly as they do on a clean copy of main (201 active-state and the unembedded 203 cross); not changed here.

## Update: the last step is a loop (Dave, 2026-11-21)

Dave asked for the last slide to loop: church members get on the God conveyor belt (down the gold, up the green), go to church on the left, go out to the right to a crowd of seven, and only one or two come back, ride down the gold and up the green, and become part of the church; the crowd fills back up; it keeps going once started.

- The one-time SVG walk-in is replaced by `createWelcomeLoop` in `great-command-v5.js` (203-10 only). People are drawn on a canvas over the cross, so the loop changes nothing in the DOM while it runs. The lesson page re-measures a widget on every DOM change (widgets/widget.md), so a DOM-driven loop would make the lesson jump while scrolling; the canvas avoids that. Measured: 0 DOM mutations in 3 seconds of looping, 0 iframe re-measures in 2 seconds inside the lesson.
- Start: four members in the family arm and a crowd of seven past the end of the outward arm. A trip starts every 6.5 seconds: the longest-seated member rides the gold lane down and the green lane up at the same 95 px/s as the beam sweeps, walks out along the outward arm, and the nearest one or two in the crowd (pattern 1, 2, 1, 1, 2) come back. They ride down the gold (still plum) and up the green (turning blue) and take a seat; the member returns to their seat. Each place in the crowd fills back up 2.5 seconds after it empties. When the six seats are full, the longest-seated member walks off the far end of the family arm and fades, so the family keeps growing past what the picture shows.
- The loop runs only on step 6, stops on Back or any other step, pauses while the widget is off screen (IntersectionObserver), and shows a still picture (four members, crowd of seven) when reduced motion is on.
- Card text unchanged. Step 6 description updated for screen readers.
- Check updated: 169 checks, including two simulated minutes of looping (18 or more trips, the crowd refills to seven and never drops below four, the family arm never overflows), Back and dots stop and restart it, reduced motion still picture, no DOM changes while looping, and inside the lesson no re-measures plus pause when scrolled away and resume when scrolled back.
