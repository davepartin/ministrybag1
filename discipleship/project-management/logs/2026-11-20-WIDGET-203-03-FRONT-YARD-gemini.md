# WIDGET-203-03-FRONT-YARD (Gemini)

- **Date:** 2026-11-20
- **Branch:** `gemini/widget-203-03-front-yard` (branched from `origin/main` `6689545`)
- **Status:** `REVIEW` (awaiting Dave's review and merge approval)

## Summary of Changes
1. **`discipleship/widgets/front-yard-life.html`** (new):
   - Compact `#2C2416` Studio Wash widget (`Front Yard Life` / `203-03`) built on one wide dollhouse side-cutaway scene (`viewBox="0 0 440 278"`): fenced backyard with string lights and patio table on the left, house with garage and front porch in the center, and front driveway, sidewalk, and street on the right.
   - 6 learner-controlled steps (`Start`, `Step 1 of 5` through `Step 5 of 5`):
     - **Start (`Backyard Life`):** Close friends around the backyard patio table and fire pit under warm string lights; side gate latched; garage closed and front porch dark (`Acts 2:46` ESV).
     - **Step 1 (`1. Carry Your Chairs Out Front`):** Side gate opens and a dashed outward arc carries the exact same lawn chairs and fire pit onto the front driveway while the backyard fence, patio table, and string lights remain (`Romans 15:7` ESV; `John 1:14`).
     - **Step 2 (`2. Open Up`):** Garage door rolls up smoothly (`translateY(-48px)`), porch lantern warms, and someone sits waving on the porch swing; includes the renter/apartment/student note ("No porch? Your front yard is wherever people can see you and stop by: the apartment steps, the break room, the dorm lounge.").
     - **Step 3 (`3. People Pop By`):** Dog walker and pup slow down on the sidewalk and a kid on a bicycle stops by the curb; connects to the Listen rhythm (`ask, ask again, remember`).
     - **Step 4 (`4. Pull Up a Chair`):** A neighbor sits in the open street-side chair by the fire and hot dogs appear (`Romans 12:13` ESV, love of strangers).
     - **Step 5 (`5. Front Yard Life`):** Warm dashed hospitality ellipse unites the expanded circle around one fire under the banner `Same chairs. Bigger circle.`, closing with Emmaus (`Luke 24:29` ESV).
   - Compositor-only `opacity`/`transform` transitions gated inside `@media (prefers-reduced-motion: no-preference)`.
   - Stable native `<button type="button">` controls (`#prev-btn`, `#next-btn`, 6 `.step-dot` dots) compatible with parent `scripts/focus-modality.js`.
   - Pre-measured `--card-h` locked on load and width-only resize; measured height `523px` at `390x844` and `530px` at `375x812`.
   - Zero `localStorage` usage, zero external dependencies, zero `"Tap Begin"` copy, and zero Unicode em dashes.
2. **`discipleship/data/203-03.json`** (edited):
   - Inserted `{ "type": "widget", "src": "widgets/front-yard-life.html", "title": "Front Yard Life", "height": "550px" }` directly after `"The Open Table"` box.
   - All existing lesson prose, `"Ask, Ask Again, Remember"` box, `"The Open Table"` box, Emmaus scroll sequence, and all 7 active question IDs (`203-03-heard`, `203-03-listen`, `203-03-2`, `203-03-6`, `203-03-key`, `203-03-step`, `203-03-prayer`) remain untouched.
3. **`discipleship/scripts/widget-iframe.js`** (edited):
   - Registered `'front-yard-life.html': 'Front Yard Life'` in `KNOWN_TITLES`.
4. **`discipleship/scripts/widget_203_03_front_yard_browser_check.js`** (new):
   - Playwright suite verifying standalone (`375px`, `390px`, `1280px`) and embedded `#203-3` (`375px`, `390px`, `1280px` across `no-preference` and `reduce` reduced motion), covering all 6 steps, renter note, keyboard + focus-modality cues, locked card height, height-only resize stability, iframe fit, preserved 7 active answers and Emmaus sequence, zero storage writes, and zero page/console/HTTP errors.
5. **`discipleship/project-management/TASKS.md`** (edited):
   - Added `WIDGET-203-03-FRONT-YARD` at `REVIEW`.

## Verification Results (Local)
- Zero Unicode em-dash scan across all changed files: `ZERO_EM_DASHES_OK` (exit 0)
- `bash scripts/qa_foundation.sh`: `All foundation QA checks passed.` (exit 0; includes 145 asset references, 32 widget iframe, 212 export, 41 save feedback, 53 backup download, 75 backup preview, 415 Bible text, 1619 lesson image checks)
- `node scripts/test_lesson_export.js`: `212 check(s) passed.` (exit 0)
- `node scripts/test_answer_storage.js`: `73 check(s) passed.` (exit 0)
- `node scripts/check_lesson_assets.js`: `PASS: 145 src/image/imageBw/imageColor/imageSequence references resolve to files.` (exit 0)
- `node scripts/test_widget_iframe.js`: `32 widget iframe checks passed.` (exit 0)
- `node scripts/widget_203_03_front_yard_browser_check.js`: `Total: 75 passed, 0 failed` (exit 0)
- `node scripts/l203_02_03_browser_check.js`: `39 L-203-02/03 browser checks passed.` (exit 0)

## Revision 2: Half-Detail Drawing Simplification (2026-11-20)
At Dave's request ("can it be more simple, like half the detail in the drawing"), simplified `discipleship/widgets/front-yard-life.html` (`viewBox="0 12 440 246"`, `496px` tall at `390px` wide):
- Removed sky backdrop box, background neighborhood trees, house siding lines, chimney, window mullions, garage interior clutter (shelves, boxes, bike wheel), garage windows/handle, coffee mugs, double light halos, porch step stack, double arrowheads, outer finish ring, and extra strokes on figures/dog/bike.
- Retained every storyboard element cleanly: privacy fence with 3 subtle vertical lines, latched-to-open gate, 4 string lights, simple patio table, smooth house/roof/rolling garage door/warm open garage glow, porch swing and lantern, matching Blue/Sage/Gold chairs and fire pit, dog walker + pup, kid on bike, roasting hot dogs, and final dashed circle under `Same chairs. Bigger circle.`.
- Re-verified all checks after simplification: zero em dashes, `qa_foundation.sh`, `test_lesson_export.js` (212), `test_answer_storage.js` (73), `check_lesson_assets.js` (145), `test_widget_iframe.js` (32), `widget_203_03_front_yard_browser_check.js` (75), and `l203_02_03_browser_check.js` (39) all exit 0.

## Revision 3: Equal Yards, No Swing, No Sky Pill (2026-11-20)
At Dave's direction:
- Removed `"Same chairs. Bigger circle."` from both the SVG sky pill and Step 5 card text.
- Removed the porch swing and swing sitter so Step 2 opens up cleanly with the rolling garage door and glowing porch light.
- Centered the house dead-center (`x=176..264`, peak at `x=220`) with equal `160px` Backyard (`x=16..176`) and `160px` Front Yard (`x=264..424`) zones and three balanced zone labels (`BACKYARD`, `HOME`, `FRONT YARD`) so the front yard visibly fills across steps (`viewBox="0 38 440 218"`, `489px` tall at `390px` wide).
- Re-verified all local checks (`qa_foundation.sh`, export 212, storage 73, assets 145, iframe 32, widget browser 75, L-203-02/03 browser 39) all pass.

## Revision 4: Evening Night Sky & Glowing Porch Light on Step 5 (2026-11-20)
At Dave's direction:
- Removed the red dashed oval around the fire pit completely.
- Replaced Step 5's highlight with an evening/night sky (`#finish-night-sky` with crescent moon and 4 soft stars above the ground line) and warm glowing lights (`#finish-night-glows`: golden porch light beam spilling into the front yard, cozy firelight halo backlighting the seated circle, and backyard string-light glows, all clipped cleanly above `y=210`), matching Luke 24:29 ("it is toward evening").
- Updated `scripts/widget_203_03_front_yard_browser_check.js` to assert `#finish-night-sky` and `#finish-night-glows` activation on Step 5.
- Re-verified all checks (`qa_foundation.sh`, export 212, storage 73, assets 145, iframe 32, widget browser 75, L-203-02/03 browser 39) all pass.

## Revision 5: Delayed Porch Light Warm-Up on Step 5 (2026-11-20)
At Dave's direction:
- Kept the porch light completely OFF on Steps 0 through 4 (removed daytime `#porch-light-wash`; updated Step 2 note to match the open garage).
- On Step 5 (`5. Front Yard Life`), night sky + ambient glows fade in over `0.45s`, followed by a `0.50s` pause in the dark (`0.95s` total delay), and then both `#porch-bulb-lit` and `#porch-night-beam` brighten smoothly over `1.5s` (`transition: opacity 1.5s ease-in-out 0.95s` inside `@media (prefers-reduced-motion: no-preference)`), turning off promptly (`0.25s`, `0s` delay) when stepping back or restarting.
- Real-time Playwright timing probe confirmed: Step 2 `porch=0`, Step 5 `@600ms` `sky=1, porch=0, bulb=0`, `@1650ms` `porch=0.54, bulb=0.54`, `@2600ms` `porch=1, bulb=1`.
- Re-verified all checks (`qa_foundation.sh`, export 212, storage 73, assets 145, iframe 32, widget browser 75, L-203-02/03 browser 39) all pass.

## Revision 6: 5 Unnumbered Hospitality-Posture Slides & Combined Garage/Move Step (2026-11-20)
At Dave's direction:
- Removed numbers from all slide titles (`Backyard Life`, `Move Into the Neighborhood`, `Be Quick to Listen`, `Make Room at the Table`, `Front Yard Life`).
- Folded the garage door opening directly into Step 1 (`Move Into the Neighborhood`) as chairs and fire pit move out front, tightening the sequence to 5 steps (`Start` + `Steps 1-4`).
- Added a short Bible verse excerpt and a crisp Christian hospitality posture sentence to every slide, opening Step 1 with John 1:14 (MSG): `"The Word became flesh and blood, and moved into the neighborhood."` (with Acts 2:46, James 1:19, Romans 12:13, and Luke 24:29 across the rest, plus the renter/apartment/dorm note on Step 1).
- Preserved the evening night sky + 0.5s dark pause + 1.5s porch light warm-up choreography on the final slide.
- Updated `scripts/widget_203_03_front_yard_browser_check.js` and `TASKS.md`; re-verified all checks (`qa_foundation.sh`, export 212, storage 73, assets 145, iframe 32, widget browser 75, L-203-02/03 browser 39) all pass.
