# WIDGET-REMOVE-TAP-BEGIN (Gemini)

- Task ID: `WIDGET-REMOVE-TAP-BEGIN`
- Branch: `gemini/widgets-remove-tap-begin`
- Base commit: `origin/main` (`c297170`)
- Scope: Scan all interactive widgets across the discipleship series and remove redundant initial-slide instruction phrases telling learners to tap Begin or Start (because the `Begin ->` button already communicates what to do). Keep meaningful lesson hooks, card heights, accessibility attributes, `data/*.json` lesson copy/IDs, and button-less card-tap hints untouched.

## Summary of Changes
- `discipleship/widgets/covenant-triangle.html` (`202-08`):
  - Removed `'Tap Begin to see what draws them together.'` from `INTRO_CARD.text` (leaving `Two people, one faithful God.`) and updated `buildCard()` so optional empty `.card-text` is omitted and `.card-title` removes its bottom margin when no text/ref follows.
- `discipleship/widgets/guide-spirit2.html` (`201-03`):
  - Removed `'Begin the walk and watch GUIDE form one signpost at a time. '` from the intro card copy (`step === -1` and `window.gtCards[0]`), leaving `'Each stop shows one steady work of the Holy Spirit in the life of a believer.'`.
- `discipleship/widgets/oia-method.html` (`201-07`):
  - Trimmed initial `intro.textContent` from `'Three questions, asked in order. Tap Begin to walk through Psalm 23 with them.'` to `'Three questions, asked in order.'`.
- `discipleship/widgets/cross-the-road.html`:
  - Trimmed initial `intro.textContent` from `'Who counts as my neighbor? Tap Begin to walk the road from Jerusalem to Jericho.'` to `'Who counts as my neighbor?'`.
- `discipleship/widgets/personal-ministry-map.html` (`203-01`):
  - Trimmed initial `intro.textContent` from `'Who has God already placed around you? Tap Begin to draw your map.'` to `'Who has God already placed around you?'`.
- `discipleship/widgets/three-spaces.html` (`203-06`):
  - Trimmed initial `intro.textContent` from `'Where does your week actually happen? Tap Begin to see your three spaces.'` to `'Where does your week actually happen?'`.
- `discipleship/widgets/mission-map.html` (`203-09`):
  - Trimmed initial `intro.textContent` from `'Where does God want you on mission, and who is with you? Tap Begin to build your map.'` to `'Where does God want you on mission, and who is with you?'`.

## Verification Plan
- Check zero Unicode em dashes (`\u2014`) across all changed files.
- Run `bash scripts/qa_foundation.sh`, `node scripts/test_lesson_export.js`, `node scripts/test_answer_storage.js`, `node scripts/check_lesson_assets.js`, `node scripts/test_widget_iframe.js`, and `eng003_browser_check.js`.
- Verify all 7 edited widgets via Playwright across `390x844`, `375x812`, and `1280x800` viewports (zero console/page errors, zero horizontal overflow, reachable `Begin` button, working advance on click, and visually inspect initial-slide PNG captures).
