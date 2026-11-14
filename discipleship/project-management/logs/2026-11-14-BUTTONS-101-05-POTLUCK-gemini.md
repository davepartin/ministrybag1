# BUTTONS-101-05-POTLUCK (Gemini)

- Task ID: `BUTTONS-101-05-POTLUCK`
- Branch: `gemini/101-05-potluck-buttons`
- Base commit: `origin/main` (`d0c5634`)
- Scope: Upgrade the interactive checklist buttons (`checklist-101-service-interests`) directly in `discipleship/index.html` and clean up `service-interests` item labels in `discipleship/data/101-05.json` per Dave's direction (no slashes, split Men's/Women's Ministry while preserving saved indices and keeping `Other` last).

## Summary of Changes
- `discipleship/data/101-05.json`:
  - Removed all `/` slashes from visible items: `Welcome Team` (0), `Sound & Tech` (3), `Small Group` (4), `Setup & Teardown` (5), `Mentoring` (17).
  - Retired index `11` (`"Men's / Women's Ministry"`) in `retiredItemIndexes` (`[11, 14, 18, 19]`) and appended `"Men's Ministry"` (27) and `"Women's Ministry"` (28), leaving all prose, questions, and Aspen art untouched.
- `discipleship/index.html`:
  - Kept `"Other"` visually last via flexbox `style="order: 1;"` so DOM indices stay 1:1 with `b.items[]` (`0..28`) without altering saved numeric selections.
  - Converted `.checklist-tile` elements to accessible `<button type="button">` controls (`aria-pressed`, compact ~20% shorter `36px` min-height with `7px 10px` mobile padding keeping a clean 2-column layout, crisp `:focus-visible`, `[hidden] { display: none !important; }`).
  - Unselected state stays crisp white (`#FFFFFF`, `#D8D1C4` border, tactile `2px` bottom push edge); `:hover` gated behind `@media (hover: hover)` so touch taps snap cleanly back to white when cleared.
  - Selected state relies purely on rich L.L.Bean heritage color fill (no checkmark prefix) cycling across 6 WCAG AA/AAA tones:
    - `0`: `#245A3E` (Pine Green, `#FFFFFF` text)
    - `1`: `#C24A19` (Burnt Orange, `#FFFFFF` text)
    - `2`: `#E6AE2B` (Mustard Yellow, `#231A0F` dark charcoal ink, `#C48F14` border)
    - `3`: `#224E70` (Heritage Navy, `#FFFFFF` text)
    - `4`: `#B53129` (Barn Red, `#FFFFFF` text)
    - `5`: `#286C6A` (Camp Teal, `#FFFFFF` text)
  - `setChecklistTileVisual` + `hydrateChecklistContainer`: pushing a button ON assigns the next color in the cursor rotation (avoiding the button's previous color `data-last-color` if toggled off and back on); turning it OFF returns it to white; saved array `responses['checklist-101-service-interests']` stays unchanged (`[indices]`) and reloads with distributed colors.
  - `@media (prefers-reduced-motion: reduce)` disables transitions and press transform.
- `discipleship/scripts/potluck_101_05_buttons_browser_check.js`: Multi-viewport (`390x844`, `375x812`, `1280x800`) and `prefers-reduced-motion: reduce` Playwright test on `index.html#101-5`.

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
