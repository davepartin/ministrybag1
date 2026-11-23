# WIDGET-OPENING-SCREENS: Claude, 2026-11-23

Branch claude/widget-drawn-start from main 53ca4ae4.

## Direction

Dave, 2026-11-23: on widgets that do not draw from scratch, the opening screen should already show the diagram ("it is nice when you scroll down and there is an image there"), and Begin starts the motion. When the stage is a clean whiteboard, a little title box tells the reader something is about to happen. Make this the standard, review the widgets, and fix the ones that do not follow it.

## Review (all 33 widgets used in lessons, opening screen at 390 px)

- Empty stage with a short title card, correct (6): 201-01 and 202-01 Greatest Commandment, 202-02 Cornerstone, 202-07 Three Ts, 203-01 Great Commission, 203-10 cross finale.
- Drawing shown at once, correct (20): 101-01, 101-02, 101-03, 101-04, 101-06, 101-07, 201-02, 201-04, 201-05, 201-06, 201-07, 202-03, 202-05, 202-06, 202-08, 202-09, 202-10, 203-06, 203-08, 203-09.
- A card over a drawing, fixed here (7): 201-03, 201-08, 201-09, 201-10, 202-04, 203-05, 203-07.
- 203-04 (Gemini PR #369, not on main) also opened with a card; Dave's prompt to Gemini covers it.

## Changes

| Widget | Cover card removed | Where its verse went |
|---|---|---|
| 201-03 guide-spirit2 | John 14:16-17 verse card | opening card: "He will give you another Helper, to be with you forever." (John 14:16), note shortened to "Each stop shows one steady work of the Holy Spirit." |
| 201-08 grace-diagram | Ephesians 2:8 panel | a short italic line above Begin with the reference |
| 201-09 fruit-of-spirit | Galatians 5:22-23 overlay | opening card, italic, with the last sentence of the note removed for height |
| 201-10 learning-circle2 | "Repent and believe" inside the circle | opening card with Mark 1:15 (lowercase "believe" as in the ESV) |
| 202-04 five-gardeners | Ephesians 4:11-12 card | opening card; the note no longer repeats the five farmer names, which the stage already shows |
| 203-05 three-circles | "A Simple Way to Share Jesus" card | nothing to move; the opening card already says it |
| 203-07 armor-of-god | Ephesians 6:11 overlay | opening card, italic; note shortened to "God supplies the armor. Your job is to put it on." |

The faded "before" state of each drawing (faint boxes, fruit, circles, figure) is now the opening picture. Nothing else in the widgets changed.

## Guides

- widgets/widget.md: new section "Opening Screen (before Begin)" with the rule, examples, no "tap to begin", and keeping one height when a verse moves into the first card.
- widgets/STUDIO-WASH-GUIDE.md and widgets/WIDGET-DESIGN-PLAYBOOK.md: one line each pointing to it.

## Verification

- No cover card is visible on any of the seven at Start, all step through Begin and Next with no page errors.
- Height from Start to Begin at 320, 375 and 390 px: steady for six. Grace and Mercy changes as it already did on main (503 to 634 at 390 px before, now 557 to 634), because its opening shows buttons instead of a card.
- Checks: foundation QA, lesson export 212, widget iframe 32, lesson navigation 964, widget_201_10_learning_circle 192, widget_remove_tap_begin 415 (expected GUIDE line updated), widget_203_frames 890 (run against a server at the repository root, as the check expects).
