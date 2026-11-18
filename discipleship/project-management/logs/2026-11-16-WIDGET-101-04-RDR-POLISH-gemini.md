# WIDGET-101-04-RDR-POLISH: 101-04 Read, Discover, Respond Widget Polish

- **Date:** 2026-11-16
- **Owner:** Gemini
- **Branch:** `gemini/widget-101-04-rdr-polish`
- **Status:** `REVIEW` (stopped before merge pending Dave's visual sign-off)

## Scope

In-place visual and copy polish on [read-discover-respond.html](../../widgets/read-discover-respond.html) for lesson `101-04`, leaving `discipleship/data/101-04.json`, `index.html`, and all other lessons/widgets completely untouched.

## Changes

1. **Closed-to-Open Bible progression (`#bible-closed` -> `#bible-open-part`)**
   - Step 0 (`Ready`, `closedBible: true`) renders a closed Bible (`#bible-closed`) positioned on the left half of the Bible emblem slot (`x = 24..72`), with `READ / Slowly, twice` labels gently subdued (`opacity: 0.45`).
   - Step 1 (`Read Slowly`, `closedBible: false`) hides `#bible-closed` and unfolds `#bible-open-part` rightward across `#clip-bible` (`width: 50 -> 114`) while bringing the `READ` labels to `opacity: 1`.
   - Steps 2-5 keep the open Bible steady without repeating a wipe animation.

2. **Dimmed Worked-Example Passage + Watermark on Step 0 (`#passage-box.is-dim`)**
   - Preserves the white `#FFFFFF` box and `#E6DFD1` border while fading `.passage-meta` (`opacity: 0.22`) and `.passage-text` (`opacity: 0.14`, `#7C7468`) far into the background.
   - Displays a centered `John 1:11-12` watermark (`.passage-watermark`) in Georgia serif across `#passage-box` on Step 0, then fades it out on Step 1 as the passage text rises cleanly to `opacity: 1` at the forefront.

3. **Simplified Step 0 Card Copy (`STEPS[0]`)**
   - Replaced duplicated slow-reading instructions in `STEPS[0]` with concise rhythm framing (`Open any passage with three simple movements: read it well, notice what it says, and respond.` / `Step through John 1:11-12 to see how the rhythm works.`), keeping Step 1 (`Listen Before Answering`) distinct.

4. **Regression Test Updates (`widget_101_04_rdr_browser_check.js`)**
   - Added computed opacity assertions confirming closed Bible (`#bible-closed` opacity `1`, `#bible-open-part` opacity `0`), active `.is-dim`, watermark (`opacity: 1`), and dimmed text (`<= 0.25`) on Step 0, and reversed forefront state on Step 1 across `375x812`, `390x844`, `1280x800`, and `390x844 (prefers-reduced-motion: reduce)`.
   - Added optional `RDR_SCREENSHOT_DIR` capture across Steps `0`, `1`, `2`, and `5` at `390/no-preference`.

## Verification

- Em-dash check (`widgets/read-discover-respond.html`, `scripts/widget_101_04_rdr_browser_check.js`, and project-management files): `ZERO_EM_DASHES_OK`
- `bash scripts/qa_foundation.sh`: exit `0` (`All foundation QA checks passed.`)
- `node scripts/test_lesson_export.js`: exit `0` (`186 check(s) passed.`)
- `node scripts/test_answer_storage.js`: exit `0` (`64 check(s) passed.`)
- `node scripts/check_lesson_assets.js`: exit `0` (`139 src/image/imageBw/imageColor/imageSequence references resolve to files.`)
- `node scripts/test_widget_iframe.js`: exit `0` (`32 widget iframe checks passed.`)
- `NODE_PATH=/Users/dpartin/github/fleetdice/node_modules RDR_BASE_URL=http://127.0.0.1:8798/index.html node scripts/widget_101_04_rdr_browser_check.js`: exit `0` (`234 101-04 Read, Discover, Respond widget checks passed.`, `--card-h` locked at `166px` mobile / `147px` desktop, `0` idle DOM mutations, `0` widget storage writes, `0` HTTP/page errors, all 9 synthetic `101-04` answers preserved across edit/reload/Email export)
- Visually inspected `390/no-preference` screenshots (`step-0.png`, `step-1.png`, `step-2.png`, `step-5.png`) with zero clipping or overflow.
