# WIDGET-202-08-FRAME: Update 202-08 Widget Frame to Studio Wash Clean Pattern

- **Owner:** Gemini (`gemini/widget-202-08-frame`)
- **Date:** November 14, 2026
- **Status:** `REVIEW` (ready for Dave review and Codex integration)

## Summary
- Updated `discipleship/widgets/covenant-triangle.html` outer frame and interactive card/navigation chrome to match the locked Studio Wash Edition pattern (`WIDGET-DESIGN-PLAYBOOK.md` / `STUDIO-WASH-GUIDE.md`) while keeping the base look of `202-08` (`The Closer to God Triangle` diagram artwork, gold/green/plum palette, step titles, copy, and Scripture quotes) untouched:
  - Kept the `#2C2416` dark `.title-bar` (`The Closer to God Triangle` / `202-08`) and crisp white `#FFFFFF` `.stage` triangle canvas.
  - Added the interactive wordless `.step-strip` (`>= 28x28px` touch targets with `.passed` and `.active` dot states) across Intro and Steps 1-4.
  - Unified Intro, Steps 1-4, and `Whole diagram` overview inside the height-locked Studio Wash `.verse-card` (`1px solid #EBE5D9`, `4px` `--step-color` top bar, constant `--card-h`) + `.nav-bar` (`Whole diagram` / `Ready` / `Begin ->`, `<- Back` / `N of 4` / `Next ->` / `Start Over`, `<- Steps` / `Whole diagram` / `Start Over`), eliminating height jumps across state transitions and keeping single-line buttons down to `375px`.
  - Updated chrome typography from `'Trebuchet MS'` to crisp `system-ui` (keeping italic Georgia for the diagram phrase and Georgia serif for card text), updated focus rings to `#E0A526`, gated SVG/fade transitions inside `@media (prefers-reduced-motion: no-preference)` with non-lingering backward fades, kept width-only `fitCards()`, zero `localStorage`, and zero em dashes.

## Changed Files
- `discipleship/widgets/covenant-triangle.html`
- `discipleship/project-management/TEAM-BOARD.md`
- `discipleship/project-management/logs/2026-11-14-WIDGET-202-08-FRAME-gemini.md`

## Untouched
- `discipleship/data/202-08.json`, question objects/IDs, saved answers, and `discipleship/index.html`.

## Verification
- `bash scripts/qa_foundation.sh`: passed (`32` widget iframe checks passed)
- `node scripts/test_lesson_export.js`: passed
- `node scripts/test_answer_storage.js`: passed (`64` checks)
- `node scripts/check_lesson_assets.js`: passed (`128` asset references resolved)
- `node scripts/review_202_08_09_browser_check.js`: passed (`26` lesson browser checks)
- `node scripts/widget_headers_browser_check.js`: passed (`4148` header checks across `78` embedded cases)
- Visual Playwright verification across `375px`, `390px`, `1280px`, and `reducedMotion: reduce` with PNG inspection (`ALL_202_08_FRAME_CHECKS_OK`).
