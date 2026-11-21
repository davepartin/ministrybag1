# 203-04 Who Can I Lift? Whiteboard Widget Log

- **Date:** November 20, 2026
- **Agent:** Gemini
- **Task ID:** `WIDGET-203-04-SERVE`
- **Branch:** `gemini/widget-203-04-serve` (PR #365, branched from `origin/main` at `6689545`)
- **Status:** `REVIEW` (stopped at review for Dave visual and wording approval before integrating into `data/203-04.json`)

## Summary of Changes

1. **Standalone Whiteboard Studio Wash Widget (`discipleship/widgets/who-can-i-lift-203.html`):**
   - Replaced the initial Love Through Serving foot-washing draft at Dave's direction with a clean, whiteboard-drawable Studio Wash diagram built around one fixed side-view scene (`viewBox="0 0 440 278"`): a ladder rising on the left toward `BEST SEATS`, a `SOLID ROCK` in the center, and `THE PIT` cut below ground on the right.
   - Self-contained single HTML file with inline CSS and JS, zero external libraries/fonts/images, zero `localStorage`, and zero em dashes (`U+2014`) or en dashes (`U+2013`).
   - Title bar: `Who Can I Lift?` with right-aligned `203-04` tag (`#2C2416` header).
   - Progressive steps changing the same scene:
     - **Start (`Who Can I Lift?`, Mark 10:43):** Ladder and Best Seats up top, Solid Rock in the middle, someone stuck in the pit below.
     - **Step 1 (`He Lifted You First`, gold, Psalm 40:2; Mark 10:45):** Jesus climbs into the pit in warm gold and lifts the one inside up onto the Solid Rock.
     - **Step 2 (`Everyone Wants the Best Seat`, Mark 10:37, 42):** Climbers push upward on the ladder toward the Best Seats while someone else sits stuck in the pit.
     - **Step 3 (`Greatness Turned Over`, Mark 10:43-44):** One green servant figure leaves the ladder and climbs down into another person's pit on purpose.
     - **Step 4 (`What's in Your Hands`, `"Who can I lift?"`):** A braided rope anchored to the rock drops into the pit, labeled with `Time`, `Strength`, `Skills`, `Money`, and `Voice` beneath `"Who can I lift?"`.
     - **Step 5 (`Lift Up Jesus`, 2 Corinthians 4:5):** The person lifted out stands on the Solid Rock looking up to a radiant gold `JESUS` cross emblem above, while the humble servant beside the pit points upward to Him.
     - **Step 6 (`The Last Will Be First`, James 4:10):** The ladder and Best Seats fade quietly into grey while warm golden light shines straight down onto the servant who climbed down, lifting them upward.
   - Accessibility, stability, and motion:
     - Seven wordless `<button>` step dots (`>= 28x28`), `>= 44px` navigation buttons, `:focus-visible` (`3px solid #E0A526`), `aria-live="polite"` card, and dynamic SVG `<title>` and `<desc>`.
     - Pre-measured constant `--card-h` via `fitCardHeight()`, re-measured only on `window.innerWidth` changes.
     - `Back` restores prior states instantly; `prefers-reduced-motion: reduce` snaps every step instantly with zero idle timers.
   - Untouched scope: `data/203-04.json`, `index.html`, images, and Firebase config files untouched pending Dave's visual and wording sign-off.
2. **Playwright Verification Script (`discipleship/scripts/widget_203_04_lift_browser_check.js`):**
   - Verifies Start plus Steps 1 to 6 across `375x667`, `390x844`, `1280x800`, and `390x844` `prefers-reduced-motion: reduce`, checking every progressive layer, dimmed ladder and exalted servant on Step 6, instant `Back` restore, `Start Over`, constant card height, zero horizontal overflow, zero `localStorage` writes, zero forbidden words or em dashes, and zero page/console errors.
3. **Board Update (`discipleship/project-management/TASKS.md`):**
   - Updated `WIDGET-203-04-SERVE` at `REVIEW`.

## Verification Results (Run from `discipleship/`)

- `bash scripts/qa_foundation.sh`: exit `0`
- `node scripts/test_lesson_export.js`: exit `0` (`212 check(s) passed`)
- `node scripts/test_answer_storage.js`: exit `0` (`73 check(s) passed`)
- `node scripts/check_lesson_assets.js`: exit `0` (`144` references resolve)
- `node scripts/widget_203_04_lift_browser_check.js`: exit `0` (`329 checks passed`)
- Visually inspected `390x844` PNG screenshots for all 7 states (`0` through `6`) confirming crisp whiteboard readability, zero label collisions, clean downward-then-upward movement, clean beam landing at ground level, and constant card height.
