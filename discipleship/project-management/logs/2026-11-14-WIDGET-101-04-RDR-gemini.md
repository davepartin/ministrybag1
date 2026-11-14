# 101-04 Read, Discover, Respond Widget Log

- **Date:** November 14, 2026
- **Agent:** Gemini
- **Branch:** `gemini/widget-101-04-discovery` (branched from `origin/main` at `ae1c78e`)
- **Status:** `REVIEW` (stopped at review for Dave visual/wording review and Codex integration)

## Summary of Changes

1. **New Studio Wash Widget (`discipleship/widgets/read-discover-respond.html`):**
   - Built an interactive **Studio Wash Edition** widget titled **Read, Discover, Respond** (`101-04` dark `#2C2416` top-right tag).
   - **Visual diagram (`viewBox="0 0 440 166"`):** Geometric Open Bible emblem (`READ` / `Slowly, twice`) connected by three curved color stems to the Three Discovery Question lanes:
     1. **About God** (Gold `#FCF2D6` / `#A8760A` — `says · does · cares`)
     2. **About People** (Harbour Blue `#E2EEF6` / `#2A5B7C` — `say · trust · do`)
     3. **Respond** (Sage Green `#E1F1E9` / `#1F684A` — `trust · obey · turn`)
     Completed Step 5 unites the Open Bible and all three lanes cleanly inside a Deep Crimson (`#8B1A2B`) double hairline.
   - **Worked Passage Strip (`John 1:11-12` ESV):** Because `101-01..101-03` cover John 1-9 while `101-04`'s exercise immediately below uses John 3 (`Try It: Nicodemus Meets Jesus`), the widget demonstrates all three Discovery Questions on `John 1:11-12` with non-overlapping Studio Wash highlights (`Gold` on God phrases, `Blue` on people's refusal, `Green` on trusting/receiving Jesus) that combine cleanly on the final step.
   - **Accessibility, stability & motion rules:** Wordless semantic `<button>` step dots (`>= 28x28px`), `>= 44px` navigation buttons (`Back` / `Begin ->` / `Next ->` / `Start Over`), clickable SVG landmarks (`#bible-group`, `#lane-1..3`), dynamic `<title>` and `<desc>`, pre-measured constant `--card-h` (width-only resize listener), instant completion under `prefers-reduced-motion: reduce`, zero `localStorage`, zero idle DOM timers/mutations, and zero em dashes (`U+2014`).
2. **Lesson Integration (`discipleship/data/101-04.json`, `discipleship/scripts/widget-iframe.js`):**
   - Added `{ "type": "widget", "src": "widgets/read-discover-respond.html", "title": "Read, Discover, Respond", "height": "550px" }` cleanly under **Read, Discover, Respond** right after *"These questions give you a place to begin..."* and immediately before **Try It: Nicodemus Meets Jesus**.
   - Preserved 100% of existing `101-04` wording, `The Three Discovery Questions` box, Scripture blocks, Bible reading (`John 10-12`), and all 9 question objects/IDs (`4-1`, `4-3`, `4-4`, `4-5`, `4-6`, `4-key`, `4-step`, `4-devos`, `4-prayer`).
   - Added `'read-discover-respond.html': 'Read, Discover, Respond'` fallback entry in `discipleship/scripts/widget-iframe.js`.
3. **Browser Regression Script (`discipleship/scripts/widget_101_04_rdr_browser_check.js`):**
   - Added automated Playwright regression test covering `375x812`, `390x844`, `1280x800`, and `390x844` `prefers-reduced-motion: reduce`.

## Exact Verification Results

- `bash scripts/qa_foundation.sh`: exited `0` (all JSON parse, lesson counts, uniqueness, and 32 widget iframe checks passed).
- `node scripts/test_lesson_export.js`: exited `0` (`177 check(s) passed`).
- `node scripts/test_answer_storage.js`: exited `0` (`64 check(s) passed`).
- `node scripts/check_lesson_assets.js`: exited `0` (`128` image/asset references resolved).
- `node scripts/widget_101_04_rdr_browser_check.js`: exited `0` (all assertions passed across `375/no-preference`, `390/no-preference`, `1280/no-preference`, and `390/reduce`; zero overflow, constant `--card-h`, lane spacing `>= 30px`, zero idle mutations, zero storage writes, zero errors).
- Visual inspection of `390x844` and `1280x800` screenshots confirmed balanced Studio Wash typography, clear lane label separation, crisp punctuation inside `John 1:11-12` highlights, and no clipped buttons or text.
