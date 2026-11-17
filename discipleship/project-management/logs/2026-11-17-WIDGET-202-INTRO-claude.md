# WIDGET-202-INTRO: Claude, 2026-11-17

Branch claude/202-widget-intro from main 17c7f4f. Files: widgets/great-command-v5.js, widgets/cornerstone.html, widgets/stewardship-three-ts.html. No lesson JSON changed.

## Change

Dave asked that the three widgets with a nearly empty start screen show a few words in a clean text box that dissolves on Begin, leaving a white screen as the drawing starts, with no preview of the drawing.

- great-command-v5.js: new optional CONFIG.intro, set only for 202: "One love, pointed in two directions." / "Tap Begin to draw it". The 201 and 203 configs have no intro and render as before.
- cornerstone.html: the unused buildIntro() verse card is replaced by a persistent card, "Every life is being built.", toggled by step so it can dissolve.
- stewardship-three-ts.html: an HTML card, "Three Ts. One life.", replaces the SVG hint text; the dashed guide triangle is hidden at Start and returns at 0.28 once drawing begins. Start aria-label updated to match.

All three share one card style: white card, Georgia 17px phrase, 10.5px uppercase hint at #75664A. Opacity fades over 0.55s; with reduced motion it switches instantly.

## Verification

From discipleship/ with local static servers:
- Custom Playwright check at 390 wide, motion and reduced motion, all three widgets: card visible on load, no sideways scroll, mid-dissolve after Begin (instant with reduced motion), fully gone after, returns on Start Over or Restart, no page errors. 42 of 42 pass.
- bash scripts/qa_foundation.sh: pass. test_widget_iframe 32, test_lesson_export 186, check_lesson_assets 144: pass.
- rewrite_203_01_browser_check 240, l202_01_sequence 92, l202_02_sequence 77, l202_07_story_image 69: pass.
- studio_v5_browser_check: all 12 201 and 203 cases pass. The 202 cases fail on "working tool retained", which looks for cross-the-road.html in 202-01. The same failures occur on main without this change; that widget was removed 2026-11-14.
- widget_headers_browser_check: 12 failures for cross-the-road.html and two-ordinances.html, both no longer in any lesson. Same 12 on main.

Not run: physical iPhone or Safari, Firebase preview.

## Follow-ups noted, not done

studio_v5_browser_check and widget_headers_browser_check still expect widgets that were removed from lessons and need updating.
