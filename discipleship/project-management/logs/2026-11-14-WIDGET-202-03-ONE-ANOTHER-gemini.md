# Task Log: WIDGET-202-03-ONE-ANOTHER (2026-11-14)

- Task: `L-202-03` (One Another / Loving Your Church Family, `discipleship/widgets/one-another.html`)
- Owner: Gemini / `gemini/widget-202-03-one-another`
- Base: `origin/main` (`ac4e99c`)

## Summary of Changes

1. Upgraded `discipleship/widgets/one-another.html` to AAA Studio Wash standard ("Christ First -> The Family Table Loop"):
   - Added a whiteboard-sketchable SVG diagram (`#table-svg`, `viewBox="0 0 440 132"`) showing the Deep Crimson double-hairline Cross (`CHRIST FIRST`) sending a Gold `AS HE LOVED` flow arrow into an 8-seat `ONE ANOTHER` Family Table oval with clockwise Harbour Blue flow arrows.
   - Synced interactive card selection with the Family Table seat nodes and highlighted `Pick one for this week` with a Deep Crimson double-hairline ring and Gold checkmark (`&#10003;`) + updated center diagram label.
   - Styled anchor banner, study card bands (`Jesus First` Gold wash, `Try This Week` Harbour Blue wash), and controls in Studio Wash `#2C2416` chrome (`460px` desktop card, full-bleed mobile).
   - Added `@media (prefers-reduced-motion: reduce)` CSS and SVG offset short-circuits plus `:focus-visible` outlines while preserving `--card-h` measurement, width-only resize refit (`fitCards()`), and all 8 `cards` texts and `data-control` hooks (`clear`, `pick`, `picked`).
2. Added `discipleship/scripts/widget_202_03_one_another_browser_check.js` testing `375px`, `390px`, `1280px` across `no-preference` and `reduce` motion, `--card-h` stability, `0` idle DOM mutations / `0` height writes, height-only resize guard, keyboard interactions, and zero widget storage writes.

## Verification

- `node --check` on extracted inline script: exit `0`; zero `\u2014`/`\u2013`; zero `localStorage`.
- `bash scripts/qa_foundation.sh`: exit `0`.
- `node scripts/test_lesson_export.js`: exit `0`.
- `node scripts/test_answer_storage.js`: exit `0` (64 check(s) passed).
- `node scripts/check_lesson_assets.js`: exit `0`.
- `node scripts/test_widget_iframe.js`: exit `0` (32 widget iframe checks passed).
- `GT_BASE_URL=http://127.0.0.1:8767/index.html node scripts/widget_202_03_one_another_browser_check.js`: exit `0` (PASSED 318 checks).
- `GT_BASE_URL=http://127.0.0.1:8767/index.html node scripts/widget_headers_browser_check.js`: exit `0` (4148 widget header checks passed across 78 embedded cases).
- Visually inspected `390x844` screenshots across initial, active, and picked states.
