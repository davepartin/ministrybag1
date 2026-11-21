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
