# WIDGET-FIXES: 3 Circles last step and RUN button order
Date: 2026-11-27
Agent: Claude
Status: REVIEW
Branch: claude/widget-fixes

Dave asked Claude to make the two widget fixes from Grok's series review himself (November 27), instead of waiting for Gemini.

widgets/three-circles.html (203-05):
- The "ABC's" text that sat on top of the drawing in the last step is gone from the drawing.
- The last card now says: "Admit your sin, believe Jesus died and rose for you, and confess Him as Lord. Romans 10:9 If you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved."
- A simple hand-drawn cross now sits at the center of the cycle from the Gospel step on, so the cross stays at the heart of the picture.
- The brokenness arrows on the right were pulled inside the frame (they clipped at phone width).
- No other card text, colors or steps changed.

widgets/starting-gun.html (202-09):
- On the pit path, Back is now on the left ("← Back") and Next on the right ("Next →"), matching every other path and widget. "Climb out →" stays on the right at the bottom of the pit. Nothing else changed.

New check: scripts/widget_203_05_three_circles_browser_check.js (375, 390, 1280: no inner overflow at any step, drawing inside its frame, ABCs on the card and not the drawing, stable card height, no page errors).

DAVE.md: Claude may make widget fixes directly when Dave asks; Gemini remains the usual builder for new widgets.

Checks: qa_foundation 0; check_lesson_assets 0 (148); test_lesson_export 0; widget_202_09_starting_gun_browser_check 0 (294); lesson_navigation_browser_check 0 (964); widget_203_05_three_circles_browser_check 0 (42); pit path button order confirmed (back left, next right; back left, climb out right). Screenshots of both looked at by Claude at 390 and 1280.
