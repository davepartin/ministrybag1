# WIDGET-203-01-GREAT-COMMISSION Handoff Log (Gemini)

- **Date:** 2026-11-19
- **Branch:** `gemini/widget-203-01-great-commission` (branched from `origin/main` `b365d2a`)
- **Status:** `REVIEW` (stopped before merge/publish for Dave's review)

## Summary of Changes
1. **New Studio Wash Widget (`discipleship/widgets/great-commission.html`):**
   - Header: `#2C2416` bar with `The Great Commission` on the left and `203-01` on the right.
   - One stable concentric-circle composition (`viewBox="0 0 440 278"`, centered at `(220, 139)`) using the locked Studio Wash palette (`Gold #A8760A/#FCF2D6`, `Harbour Blue #2A5B7C/#E2EEF6`, `Royal Plum #5F4684/#EDE7F6`, `Sage Green #1F684A/#E1F1E9`, and `Deep Crimson #8B1A2B` double-hairline climax contour):
     - **Step 1 (`Loved First: Growing Deep`):** Sunlit gold `God` center (`201 · Growing Deep`), Matthew 28:18 ESV.
     - **Step 2 (`Love Beside You: Growing Up`):** Harbour blue `Home & Church` circle (`202 · Growing Up`) around the visible center.
     - **Step 3 (`Go and Make Disciples: Growing Out`):** Royal plum `203 · Growing Out` outer circle with four gentle outward paths and double-chevron watermarks, Matthew 28:19 ESV.
     - **Step 4 (`Help Them Follow Jesus`):** Compact `Baptize · Teach to obey` pill seated inside the lower outward band, Matthew 28:19-20 ESV.
     - **Step 5 (`Beyond Your Familiar Circle`):** Outward ripples crossing the familiar boundary plus faint orthographic graticules, Acts 1:8 ESV (kept explicitly distinct from Matthew 28).
     - **Step 6 (`All Nations. Never Alone.`):** Outer circle becomes a crimson double-hairline globe rim as a restrained translucent sage-earth wash reveals orthographic Europe, Africa, and Asia beneath all three circles while keeping God at the center and every label crisp; closes with Matthew 28:20 ESV and `Love Has Names`.
   - Transitions use compositor-friendly `opacity` and `transform` gated inside `@media (prefers-reduced-motion: no-preference)`.
   - Stable DOM controls (`Back`, `Next`/`Start Over`, 6 native step-dot buttons) preserve keyboard access and the host page's `scripts/focus-modality.js` pointer/keyboard focus behavior.
   - Pre-measured `--card-h` across all 6 steps; resize listener ignores height-only viewport changes.
   - Zero `localStorage`, zero answer fields, zero external libraries/map services, zero Unicode em dashes (`\u2014`), zero `"Tap Begin"` copy.

2. **Lesson Integration & Protection (`discipleship/data/203-01.json`, `discipleship/scripts/widget-iframe.js`):**
   - Replaced `widgets/great-command-v5-203.html` embed with `widgets/great-commission.html` (`title: "The Great Commission"`, `height: "560px"`, `anchor: "diagram"`).
   - Updated `contents[2].title` from `"Greatest Commandment"` to `"The Great Commission"`.
   - Removed only the adjacent static `images/203-01-love-moves-out.png` embed block while keeping both `widgets/great-command-v5-203.html` and `images/203-01-love-moves-out.png` untouched on disk.
   - Preserved all lesson prose, Scripture blocks, all 7 active question objects/IDs, `retiredQuestions`, `courseLogo`, and the roof-drop story sequence untouched.
   - Registered `'great-commission.html': 'The Great Commission'` in `discipleship/scripts/widget-iframe.js`.
   - Left `201` and `202` Greatest Commandment widgets untouched.

3. **Verification Suite (`discipleship/scripts/widget_203_01_great_commission_browser_check.js`):**
   - Direct standalone checks at `375px`, `390px`, and `1280px`.
   - Embedded `#203-1` checks across `375px`, `390px`, and `1280px` in both `no-preference` and `reduce` reduced-motion modes (all 6 steps, globe reveal, Back/Next/dots/Start Over, keyboard navigation, host `focus-modality.js` behavior, locked card height, height-only resize stability, iframe height fit, zero `localStorage` writes, preserved answers/logo/roof-drop, zero console/page/HTTP errors).

## Verification Results
- Zero em dashes check across all modified/added files: PASS (`ZERO_EM_DASHES_OK`)
- `bash scripts/qa_foundation.sh`: PASS (exit 0)
- `node scripts/test_lesson_export.js`: PASS (exit 0)
- `node scripts/test_answer_storage.js`: PASS (exit 0)
- `node scripts/check_lesson_assets.js`: PASS (exit 0, 147 references resolved)
- `node scripts/test_widget_iframe.js`: PASS (exit 0, 32 widget iframe checks passed)
- `node scripts/widget_203_01_great_commission_browser_check.js`: PASS (exit 0, 83 passed, 0 failed)
- `node scripts/eng003_browser_check.js`: 35 passed, 1 pre-existing unrelated failure on `202-10` (`FAIL: 202-10 iframe title names the ordinances widget | Baptism`, already present on `origin/main` `b365d2a`).
