# 2026-11-21 - WIDGET-203-04-CLIMB-DOWN (Gemini)

- **Task:** `WIDGET-203-04-CLIMB-DOWN`
- **Branch:** `gemini/widget-203-04-climb-down` (off `origin/main` `417564b`)
- **Status:** `REVIEW` (not merged)

## Visual Exploration Summary (Kept Out of Learner UI)

Before committing to the final drawing, three rough whiteboard circle arrangements were sketched in scratch outside the repository:

1. **Option A: Inverted Pyramid (`1-2-3` upright triangle flipping 180 degrees into `3-2-1` inverted triangle) - CHOSEN.**
   - Immediately recognizable as the exact same six-circle arrangement after turning over.
   - Genuinely changes both who benefits (one person chasing a lone peak vs. five people rising in a wide supported community) and how people relate (stepping stones under pressure vs. Christ-anchored bonds where lifted people help others grow).
   - Easy to sketch on a whiteboard in 20 seconds while teaching.
2. **Option B: Stepped Staircase - Rejected.**
   - Rotating a staircase 180 degrees leaves an awkward ceiling overhang that obscures how support flows upward.
3. **Option C: Single Vertical Pillar - Rejected.**
   - Reads only as a narrow one-to-one stack without the structural contrast of one peak vs. a broad supported community.

## Files Changed

- `discipleship/widgets/climb-down-lift-up.html`: New self-contained teaching widget (`516px` tall at `390px` wide; compact dark header `Climb Down to Lift Others Up` / `203-04`; centered opening cue `What does greatness look like?` fading for `0.32s` before Step 1 draws; SVG-only `#flip-group` 180-degree rotation keeping all labels upright; Jesus' cross anchor `Held by Jesus` on Steps 2-5; Step 4 reach-down, lift-up, and first green support bond; Step 5 connected eight-link community inside a Studio Wash double-hairline frame with a calm 5.2s compositor-only pulse wave that pauses when offscreen via `content-visibility: auto`, `contentvisibilityautostatechange`, `IntersectionObserver`, and `visibilitychange`, and stops cleanly under `prefers-reduced-motion: reduce`).
- `discipleship/data/203-04.json`: Added one widget block (`{"type": "widget", "src": "widgets/climb-down-lift-up.html", "title": "Climb Down to Lift Others Up", "height": "550px"}`) right before the existing `"What Is in Your Hands?"` box. All existing lesson prose, Scripture, questions, active/retired IDs, readings, images, and saved-answer behavior are unchanged.
- `discipleship/scripts/widget-iframe.js`: Registered `'climb-down-lift-up.html': 'Climb Down to Lift Others Up'` in `KNOWN_TITLES`.
- `discipleship/scripts/widget_203_04_climb_down_browser_check.js`: Automated Playwright verification covering standalone and embedded `#203-04` at `375px`, `390px`, `1280px`, and `390px` with `prefers-reduced-motion: reduce`, plus offscreen loop pausing, stable iframe height, zero lesson scroll jump, zero idle DOM mutations, zero widget `localStorage` writes, and active + retired synthetic answer preservation across reload and export.
- `discipleship/project-management/TASKS.md`: Claimed and updated `WIDGET-203-04-CLIMB-DOWN` to `REVIEW`.

## Dave Feedback Revision (2026-11-22: 4-3-2-1 Circle Pyramid & Flippable Side Greatness Scale)

- Updated `discipleship/widgets/climb-down-lift-up.html` to a **4-3-2-1 pyramid of 10 circles with no outer triangle sides**:
  - **Step 1 (The World's Way):** `You` starts in the **bottom row (row of 4), 3rd spot to the right** (`(300, 196)`), and climbs to the top by reaching up with a small arm to pull down and switch places with someone in Row 3, then Row 2, then Row 1, while the side **World's Scale** points UP to `GREATEST` at the top and `LEAST` at the bottom.
  - **Step 2 (Jesus Came Down First):** At the top peak, `You` **meets Jesus** (`Jesus meets you`), and Jesus' golden path sweeps all the way down to the cross foundation below the bottom row (`Jesus came down first`).
  - **Step 3 (Greatness Turns Over):** The side **Greatness Scale flips 180 degrees** into the upside-down **Kingdom Scale** (`GREATEST / High in Heaven` at the bottom row, `LIFTED UP` at the top, keeping all text upright via counter-rotating carriages), and `You` switches places at the top by reaching with an upward-cradling arm to lift another person into the #1 spot.
  - **Step 4 (Climb Down to Lift Others Up):** `You` continues climbing down row by row with the lifting arm, helping people move up past `You` until `You` returns to the 3rd spot of the bottom row, anchored to Jesus' cross (`Held by Jesus`) right beside `GREATEST / High in Heaven`.
  - **Step 5 (A Life That Builds Others Up):** From the bottom row, the whole 4-3-2-1 community lifts the rows above them with upward-cradling support palms and a calm 5.2s offscreen-pausing wave (`Others rise`).

## Dave Feedback Revision 2 (2026-11-22: Simplified Scale, 10 Distinctly Colored Dots, Zero Lingering Arrows, 30% Swap Speed)

- Simplified `discipleship/widgets/climb-down-lift-up.html` per Dave's follow-up review:
  - **No lingering arrows or extra icons:** Removed all persistent swap arrows, link lines, and Jesus diagram icons so the stage focuses cleanly on the scale and the 10 dots in the 4-3-2-1 pyramid.
  - **Clearer Scale Wording:** Simplified the flippable left-side scale to `WORLD'S SCALE` -> `KINGDOM SCALE` with only two endpoint pills (`GREATEST` and `LEAST`) that physically flip 180 degrees so `GREATEST` is at the bottom aligned with the serving row. Replaced James 4:10 ("lifted up later by God") on Step 5 with `Matthew 23:11` (`"The greatest among you shall be your servant"`).
  - **Distinct Dot Colors + Dark "You" Dot:** Each of the 9 other dots has its own distinct color (Amber-Gold, Sage-Teal, Sky Blue, Lavender, Coral-Terracotta, Olive-Moss, Dusty Rose, Warm Apricot, Cool Periwinkle) while the Hero dot is bold dark `#2C2416` with white `You` text so every swap is easy to follow visually.
  - **30% Swap Speed:** Slowed each pair swap to `1200ms` (30% of the previous `360ms` speed) with smooth sine ease-in-out and a `260ms` pause between consecutive swaps.

## Dave Feedback Revision 3 (2026-11-23: Exact ESV Copy, Unnumbered 4-Card Flow, Diagram Labels Only)

- Applied all 3 `MUST FIX` items in `discipleship/widgets/climb-down-lift-up.html`:
  1. **Exact ESV Verses Only:** Replaced all card text with Dave's exact 4-card copy (`Title or Towel` / `Mark 10:31`, `Climbing for the Title` / `Matthew 23:6`, `Jesus Served You First` / `Mark 10:45`, `Taking Up the Towel` / `Matthew 23:11-12`).
  2. **Unnumbered Headings:** Removed leading numbers from all card headings.
  3. **Diagram Labels Only:** Removed every sentence and caption from the SVG diagram, keeping only `THE WORLD` / `THE KINGDOM`, `GREATEST`, `LEAST`, and `You`.

## Dave Feedback Revision 4 (2026-11-23: Final Step 4 "Well Done" & Gold FAITHFUL SERVANT Pill)

- Added final Step 4 (`Start` plus 4 steps, 5 dots total) in `discipleship/widgets/climb-down-lift-up.html`:
  - **Step 4 (`Well Done`):** `"Well done, good and faithful servant."` `Matthew 25:21` / `The world gives its titles to those at the top. God gives His to servants.`
  - Keeps Step 3's end state stationary (`THE KINGDOM` scale flipped, `You` in the bottom serving row) and fades in a small gold `#A8760A` pill (`FAITHFUL SERVANT`) directly under the `You` dot.
  - Step 4 button reads `Start Over`; `Back` from Step 4 removes the gold pill immediately; `prefers-reduced-motion: reduce` shows it at once; locked `--card-h` re-measured across all 5 cards.

## Dave Feedback Revision 5 (2026-11-23: Pyramid Visible at Start, Title Bar "Title or Towel", Diagram Anchor Move)

- **Start Screen (No Overlay Card):** Removed `.opening-cue` (`"What does greatness look like?"`) so the full 4-3-2-1 pyramid of 10 colored dots and `THE WORLD` scale (`GREATEST` at top, `LEAST` at bottom) are visible immediately at Start (`step 0`), with `"You"` in the 3rd spot of the bottom row. Clicking `Begin ->` immediately starts Step 1's climbing motion.
- **Title Bar & Registration:** Updated `<title>`, `.title-bar h1`, and `scripts/widget-iframe.js` (`KNOWN_TITLES['climb-down-lift-up.html']`) to `Title or Towel` (with `203-04` tag on the right).
- **Lesson Wiring (`data/203-04.json`):** Updated the widget block `title` to `"Title or Towel"`, moved `"anchor": "diagram"` from the `"What Is in Your Hands?"` box to the widget block, and changed the contents `Diagram` row title to `"Title or Towel"`. No other lesson prose, Scripture, questions, IDs, or images changed.

## Verification Results (Local)

- `bash scripts/qa_foundation.sh`: PASS
- `node scripts/test_lesson_export.js`: 212 passed
- `node scripts/test_answer_storage.js`: 73 passed
- `node scripts/check_lesson_assets.js`: 147 references resolved
- `node scripts/test_widget_iframe.js`: 32 passed
- `node scripts/widget_203_04_climb_down_browser_check.js`: 497 passed (`standalone` + `embedded` across `375`, `390`, `1280`, `390/reduce`)
- Em-dash audit (`U+2014`) across all modified/created files: 0 found
