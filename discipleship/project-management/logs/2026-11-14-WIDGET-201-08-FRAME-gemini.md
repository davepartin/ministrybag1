# WIDGET-201-08-FRAME (Gemini)

- Task ID: `WIDGET-201-08-FRAME`
- Branch: `gemini/widget-201-08-frame`
- Base commit: `origin/main` (`ac4e99c`)
- Scope: Update the outer Studio Wash frame, accessibility, and reduced-motion chrome on `discipleship/widgets/grace-diagram.html` (`201-08`) while preserving the base look, diagram proportions, colors, step descriptions, overview mode, and Scripture cards of `201-08` untouched. `discipleship/data/201-08.json` is completely unchanged.

## Summary of Changes
- `discipleship/widgets/grace-diagram.html`:
  - Updated `<header class="title-bar">` to the locked Studio Wash pattern (`#2C2416` dark charcoal bar, left-aligned `17px` `system-ui` `<h1>` `The Grace and Mercy Cycle`, right-aligned `11px` uppercase `201-08` `.course-tag`), wrapped inside `<main class="widget-outer">`.
  - Removed the older `#1D6B3F` Oct-21 green override on the header and buttons so `Begin ->` uses clean `#2C2416` and `Next ->` / `Restart` match each step's own harmonious color (`#5B8A72`, `#8B4A5E`, `#4A6B8B`, `#9B7B2F`, `#6B5232`).
  - Added symmetric `16px` vertical breathing room inside `.diagram-wrapper` so the bottom borders of `Righteous` and `Justified` never clip or touch the `#F6F4EE` card tray divider.
  - Added `prefers-reduced-motion: reduce` handling, `#E0A526` `:focus-visible` outlines, accessible `<button type="button">` step dots (`aria-label`, `aria-pressed`), keyboard (`Enter`/`Space`) + `role="button"` support on active diagram boxes, `aria-live="polite"` on `#card-area`, and `<svg role="img">` with dynamic `<title>` and `<desc>`.
- `discipleship/scripts/widget_201_08_frame_browser_check.js`: Embedded `#201-8` iframe verification across `390x844`, `375x812`, `1280x800`, and `prefers-reduced-motion: reduce`.

## Verification (Post-Final-Edit)
- `bash scripts/qa_foundation.sh`: exit `0`
- `node scripts/test_lesson_export.js`: exit `0`
- `node scripts/test_answer_storage.js`: exit `0`
- `node scripts/check_lesson_assets.js`: exit `0`
- `node scripts/test_widget_iframe.js`: exit `0`
- `eng003_browser_check.js`: exit `0`
- `widget_201_08_frame_browser_check.js`: exit `0`
- Visually inspected `390x844` before/after PNG screenshots (`before_intro.png`, `before_step5.png`, `after_intro.png`, `after_step1.png`, `after_step5.png`, `after_overview.png`).
