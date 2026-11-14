# WIDGET-202-09-STARTING-GUN (Gemini Handoff)

- **Date:** November 14, 2026
- **Branch:** `gemini/widget-202-09-starting-gun` (branched cleanly from `origin/main` at `04c5c4f`)
- **Status:** `REVIEW` (ready for Dave review and Codex technical integration)

## What Changed

Upgraded `discipleship/widgets/starting-gun.html` (`RUN from Sin`, Lesson `202-09`: *Fighting for Purity*) from its basic stick-figure SVG diagram to the full AAA **Studio Wash Illustrated Edition**:

- **Header:** Preserved `#2C2416` dark bar with `RUN from Sin` top-left and `202-09` top-right.
- **Illustrated Landscape & Mood:**
  - Stratified stone pit chasm on the left (`THE PIT`) with cavern depth strata, crumbling cliff cracks, dry rim bramble, and a smooth twilight dusk atmosphere wash on the temptation / pit path.
  - Sunlit emerald hillside meadow rising to the `FULL LIFE` summit sanctuary with radiating golden sunrise beams and summit grove trees.
  - Handcrafted beveled timber Cross bridge (`#cross-post` + crossbeam + warm gold double hairline aura) revealing purposefully from the summit down into the pit floor to illustrate grace rescuing out of the pit (`Psalm 32:5`) and empowering uphill obedience (`1 Corinthians 6:19-20`).
- **Traveler Silhouettes & Mileposts:**
  - Replaced geometric stick lines with sculpted runner silhouettes across active running stride (with motion streak lines), humble crouching inside the pit (`3. Hide in Shame`), and Harbour Blue running companion joining alongside on `N: Need Others` (`2 Timothy 2:22`) and arriving at `Full Life` (`John 10:10`).
  - Replaced floating grey boxes with interactive `R GRACE`, `U SPIRIT`, `N OTHERS` hillside signposts clickable via pointer or keyboard (`Enter` / `Space`).
- **Studio Wash UI Chrome & Stability:**
  - Directional step strip (`<- Pit` | Pit steps | Temptation | RUN steps | `RUN ->`) with `28px+` circle dot targets (`aria-pressed`, `aria-label`).
  - Pre-measured constant `--card-h` across all 10 states via `fitCardHeight()` (`window.innerWidth` resize only; zero idle DOM writes; zero `localStorage`; zero em dashes `U+2014`).
  - Full `prefers-reduced-motion: reduce` support and explicit `#E0A526` `:focus-visible` outlines.
- **Untouched:** `discipleship/data/202-09.json` (lesson prose, Scripture, question IDs, and `"height": "580px"` unchanged), `index.html`, and all other lessons/widgets.

## Regression Test Added

- `discipleship/scripts/widget_202_09_starting_gun_browser_check.js`: Playwright end-to-end check inside `#202-9` across `375px`, `390px`, `1280px`, and `reducedMotion: reduce` verifying intro, temptation choice, Stay-into-Pit path, Cross rescue climb-out, RUN path with companion, SVG marker jump, constant card height, zero idle iframe writes, zero `localStorage` writes, zero overflow, zero page errors, and zero em dashes.

## Verification

- `bash scripts/qa_foundation.sh` -> exit `0`
- `node scripts/test_lesson_export.js` -> exit `0` (`186` checks passed)
- `node scripts/test_answer_storage.js` -> exit `0` (`64` checks passed)
- `node scripts/check_lesson_assets.js` -> exit `0` (`128` asset refs resolved)
- `node scripts/review_202_08_09_browser_check.js` -> exit `0`
- `node scripts/widget_headers_browser_check.js` -> exit `0` (`4148` checks across `78` embedded cases)
- `node scripts/widget_202_09_starting_gun_browser_check.js` -> exit `0` (`120` assertions across `375/390/1280` + reduced motion)
- Playwright screenshots inspected directly at `375px`, `390px`, and `1280px`.
