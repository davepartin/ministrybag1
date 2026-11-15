# WIDGET-201-10-CIRCLE (Gemini)

- Task ID: `WIDGET-201-10-CIRCLE`
- Branch: `gemini/widget-201-10-learning-circle`
- Base commit: `origin/main` (`4620a9e`)
- Scope: Slight visual path adjustment and Studio Wash header/frame upgrade for `discipleship/widgets/learning-circle2.html` (`201-10`). `discipleship/data/201-10.json`, `discipleship/index.html`, and image assets are untouched.

## Summary of Changes
- `discipleship/widgets/learning-circle2.html`:
  - Fixed the path geometry along the top (`PATH_Y = 56`, unified `#jesus-band` `y=42..70`, `#jesus-line` `x=24..340`) so `#drift-path` (`We Turn Away`) leaves directly from `The Path of Jesus` into `Conviction` at the circle top `(190, 126)` and `#return-path` (`Back on the Path`) curves smoothly back onto `The Path of Jesus` and continues forward.
  - Adjusted `#lbl-conviction` (`y=84`, `14.5px`, white paint-order halo) and `#turning-tick` (`y1=91..117`) into the clear V-pocket between the curves, with tangent arrowheads around the clockwise circle (`Repent`: `1. Reflect mind`, `2. Remorse heart`; `Believe`: `3. Plan steps`, `4. Obey act`).
  - Upgraded the outer frame to the Studio Wash pattern: `#2C2416` `.title-bar` (`The Learning Circle` left, `201-10` `.course-tag` right), wordless interactive `.step-strip` dots (`>=28x28`), height-locked `.verse-card` (`fitCards()`), second-person clarity ending with `Keep turning. Keep believing.`, `#E0A526` `:focus-visible` rings, `<svg role="img">` + dynamic `<title>`/`<desc>`, cancellable `requestAnimationFrame` animations, `prefers-reduced-motion: reduce`, zero `localStorage`, and zero em dashes.
- `discipleship/scripts/widget_201_10_learning_circle_browser_check.js`:
  - Playwright check embedded in `#201-10` across `375x667`, `390x844`, `1280x800`, and `prefers-reduced-motion: reduce`.
- Project management: `TEAM-BOARD.md`, `TASKS.md` (`WIDGET-201-10-CIRCLE` in `REVIEW`), and this log.

## Verification (Post-Final-Edit)
- Zero em dashes (`U+2014`) across widget, test script, and log: verified (`0` matches)
- `bash scripts/qa_foundation.sh`: exit `0` (includes `32 widget iframe checks passed`)
- `node scripts/test_lesson_export.js`: exit `0` (`186 check(s) passed`)
- `node scripts/test_answer_storage.js`: exit `0` (`64 check(s) passed`)
- `node scripts/check_lesson_assets.js`: exit `0` (`PASS: 140 src/image/imageBw/imageColor/imageSequence references resolve to files.`)
- `node scripts/widget_201_10_learning_circle_browser_check.js`: exit `0` (`ALL CHECKS PASSED (80 assertions)` across `375x667`, `390x844`, `1280x800`, and `prefers-reduced-motion: reduce`, embedded in `#201-10`)
- Visually inspected `390x844` screenshots in `scratch/201-10-v3/` (`learning-circle-1-path.png`, `learning-circle-5-believe.png`, `learning-circle-6-restored.png`).
