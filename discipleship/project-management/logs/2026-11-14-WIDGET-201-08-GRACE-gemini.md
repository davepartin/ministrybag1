# Task Log: WIDGET-201-08-GRACE (2026-11-14)

- Task: `L-201-08` (The Grace and Mercy Cycle, `discipleship/widgets/grace-diagram.html`)
- Owner: Gemini / `gemini/widget-201-08-grace`
- Base: `origin/main` (`ac4e99c`)

## Summary of Changes

1. Upgraded `discipleship/widgets/grace-diagram.html` to AAA Studio Wash standard ("The Cross in the Negative Space"):
   - Studio Wash `#2C2416` dark header with right-aligned `201-08` `.course-tag`, Warm Linen outer frame (`460px` desktop card, full-bleed mobile).
   - Paired Studio Wash quadrant colors (`Mercy` Sage `#1F684A`, `Justified` Crimson `#8B1A2B`, `Righteous` Harbour `#2A5B7C`, `Grace` Gold `#A8760A`) with crisp clockwise flow arrows.
   - Added negative-space Center Cross SVG revealed in Deep Crimson double-hairline (`3.5px` + `1.1px`) ink on step 5 and `Show whole diagram` overview.
   - Added `@media (prefers-reduced-motion: reduce)` CSS and SVG offset short-circuits, `:focus-visible` keyboard outlines, single-row mobile navigation pill wrapping protection (`white-space: nowrap`), and width-only resize refit (`fitCardHeight()`).
   - Preserved all verbatim `stops` and `boxDescriptions` teaching wording, `data-control` hooks, and native `<button>` overview accessibility semantics.
2. Updated `discipleship/scripts/ux001b_browser_check.js` line 380 regex from `/Mercy.*PUNISHMENT/i` to `/Mercy.*(JUDGMENT|PUNISHMENT)/i` so it aligns with existing `"JUDGMENT"` copy in `grace-diagram.html`.
3. Added `discipleship/scripts/widget_201_08_grace_browser_check.js` covering `375px`, `390px`, `1280px`, `prefers-reduced-motion` (`no-preference` + `reduce`), `--card-h` stability, `0` idle DOM mutations / `0` height writes, height-only resize guard, `0` widget storage writes, and zero em/en dashes.

## Verification

- `node --check` on extracted inline script: exit `0`; zero `\u2014`/`\u2013`; zero `localStorage`.
- `bash scripts/qa_foundation.sh`: exit `0`.
- `node scripts/test_lesson_export.js`: exit `0`.
- `node scripts/test_answer_storage.js`: exit `0` (64 check(s) passed).
- `node scripts/check_lesson_assets.js`: exit `0`.
- `node scripts/test_widget_iframe.js`: exit `0` (32 widget iframe checks passed).
- `UX001B_BASE_URL=http://127.0.0.1:8766/index.html node scripts/ux001b_browser_check.js`: exit `0`.
- `GT_BASE_URL=http://127.0.0.1:8766/index.html node scripts/widget_201_08_grace_browser_check.js`: exit `0` (PASSED 198 checks).
- Visual screenshot inspection at `390x844` across intro, steps 1-5, and overview: verified crisp single-row navigation bar, unobstructed arrow tips, and centered negative-space cross.
