# Task Log: WIDGET-202-10-ORDINANCES (2026-11-14)

- Task: `L-202-10` (The Doorway and the Table / Baptism and the Lord's Supper, `discipleship/widgets/two-ordinances.html`)
- Owner: Gemini / `gemini/widget-202-10-ordinances`
- Base: `origin/main` (`ac4e99c`)

## Summary of Changes

1. Upgraded `discipleship/widgets/two-ordinances.html` to AAA Studio Wash standard ("One Doorway (Once) & One Table (Often) Under the Cross"):
   - Added a whiteboard-sketchable SVG diagram (`viewBox="0 0 440 138"`) showing `THE DOORWAY` (Harbour Blue arch + water + single `ONCE` entry arrow), `THE TABLE` (Warm Gold table + bread/cup + continuous `OFTEN` returning loop arrow), and the center `ONE GOSPEL` Deep Crimson double-hairline Cross connecting both.
   - Added prev/next/restart bottom navigation (`← Back`, progress dots, `Next →` / `↻ Start Over`) alongside the 5 existing `.facet` buttons (`0..4`), spotlighting each question stage in the SVG and illuminating the Cross reveal once all 5 questions are explored.
   - Pre-measured and locked `--card-h` on `#answer-b` / `#answer-s` AND `--footer-h` on `#footer` across all 5 states so toggling questions or revealing the gospel banner produces zero height jump.
   - Added Studio Wash `#2C2416` header with `202-10` tag (`460px` desktop card, full-bleed mobile), `@media (prefers-reduced-motion: reduce)` CSS and instant swap short-circuits, `:focus-visible` focus rings, and a `window.innerWidth`-only resize guard + `document.fonts.ready` refit.
   - Preserved all 5 exact `content` pairs verbatim.
2. Added `discipleship/scripts/widget_202_10_ordinances_browser_check.js` testing `375px`, `390px`, `1280px` across `no-preference` and `reduce` motion, `--card-h` and `--footer-h` height lock, `0` idle DOM mutations / `0` height writes, height-only resize guard, keyboard `Start Over`, and zero widget storage writes.

## Verification

- `node --check` on extracted inline script: exit `0`; zero `\u2014`/`\u2013`; zero `localStorage`.
- `bash scripts/qa_foundation.sh`: exit `0`.
- `node scripts/test_lesson_export.js`: exit `0`.
- `node scripts/test_answer_storage.js`: exit `0` (64 check(s) passed).
- `node scripts/check_lesson_assets.js`: exit `0`.
- `node scripts/test_widget_iframe.js`: exit `0` (32 widget iframe checks passed).
- `GT_BASE_URL=http://127.0.0.1:8770/index.html node scripts/widget_202_10_ordinances_browser_check.js`: exit `0` (PASSED 270 checks).
- `GT_BASE_URL=http://127.0.0.1:8770/index.html node scripts/widget_headers_browser_check.js`: exit `0` (4148 widget header checks passed across 78 embedded cases).
- Visually inspected `390x844` screenshots across all 5 comparison steps + gospel reveal.
