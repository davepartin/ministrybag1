# BUTTONS-101-05-POTLUCK (Gemini)

- Task ID: `BUTTONS-101-05-POTLUCK`
- Branch: `gemini/101-05-potluck-buttons`
- Base commit: `origin/main` (`04c5c4f`)
- Scope: Upgrade the interactive checklist buttons (`checklist-101-service-interests`) directly in `discipleship/index.html` and clean up `service-interests` prompt and item labels in `discipleship/data/101-05.json` per Dave's direction (no slashes, split Men's/Women's Ministry while preserving saved indices and keeping `Other` last).

## Summary of Changes
- `discipleship/data/101-05.json`:
  - Updated `service-interests` prompt to `"Check the areas where you could see yourself getting involved in church?"`.
  - Removed all `/` slashes from visible items: `Welcome Team` (0), `Sound & Tech` (3), `Small Group` (4), `Setup & Teardown` (5), `Mentoring` (17).
  - Retired index `11` (`"Men's / Women's Ministry"`) in `retiredItemIndexes` (`[11, 14, 18, 19]`) and appended `"Men's Ministry"` (27) and `"Women's Ministry"` (28), leaving all prose, questions, and Aspen art untouched.
- `discipleship/index.html`:
  - Kept `"Other"` visually last via grid `style="order: 1; grid-column: 1 / -1;"` so DOM indices stay 1:1 with `b.items[]` (`0..28`) without altering saved numeric selections.
  - Upgraded `.checklist-grid` to a tight 3-column grid (`grid-template-columns: repeat(3, minmax(0, 1fr))`) and converted `.checklist-tile` elements to compact `<button type="button">` controls (`aria-pressed`, `0.685rem` font and `32px` min-height on mobile so the full widget fits on one phone screen without scrolling at `406px` on `390x844` and `413px` on `375x667`, crisp `:focus-visible`, `[hidden] { display: none !important; }`).
  - Unselected state stays crisp white (`#FFFFFF`, `#D8D1C4` border, tactile `2px` bottom push edge); `:hover` gated behind `@media (hover: hover)` so touch taps snap cleanly back to white when cleared.
  - Selected state relies purely on rich heritage color fill (no checkmark prefix) rotating in strict order across 3 WCAG AA/AAA tones:
    - `0`: `#224E70` (Blue / Heritage Navy, `#FFFFFF` text)
    - `1`: `#286C6A` (Teal / Camp Teal, `#FFFFFF` text)
    - `2`: `#E6AE2B` (Mustard Yellow, `#231A0F` dark charcoal ink, `#C48F14` border)
  - `setChecklistTileVisual` + `hydrateChecklistContainer`: pushing buttons ON rotates strictly `blue -> teal -> mustard -> blue...` (and toggling a tile off and back on avoids repeating its previous color); turning a tile OFF returns it to white; saved array `responses['checklist-101-service-interests']` stays unchanged (`[indices]`) and reloads in `blue -> teal -> mustard` order.
  - `@media (prefers-reduced-motion: reduce)` disables transitions and press transform.
- `discipleship/scripts/potluck_101_05_buttons_browser_check.js`: Multi-viewport (`390x844`, `375x812`, `375x667`, `1280x800`) and `prefers-reduced-motion: reduce` Playwright test on `index.html#101-5`.

## Verification (Post-Final-Edit)
- `bash scripts/qa_foundation.sh`: exit `0`
- `node scripts/test_lesson_export.js`: exit `0`
- `node scripts/test_answer_storage.js`: exit `0`
- `node scripts/check_lesson_assets.js`: exit `0`
- `node scripts/test_backup_download.js`: exit `0`
- `node scripts/test_backup_preview.js`: exit `0`
- `node scripts/test_backup_restore.js`: exit `0`
- `potluck_101_05_buttons_browser_check.js`: exit `0`
- `eng005_browser_check.js`: exit `0`
- Visually inspected `390x844` rendered PNG screenshots (`before_white.png`, `after_colored.png`).
