# WIDGET-202-10-LORDS-SUPPER (Gemini)

- Task ID: `WIDGET-202-10-LORDS-SUPPER`
- Branch: `gemini/widget-202-10-lords-supper`
- Base commit: `origin/main` (`0480267`)
- Scope: Build the companion **Lord's Supper** parallel-analogy widget (`discipleship/widgets/lords-supper-picture.html`) for `202-10` (to pair alongside the Baptism widget from PR #246), wire it into the Lord's Supper section of `discipleship/data/202-10.json`, retire `widgets/two-ordinances.html` from `202-10.json` (kept on disk), register its iframe title in `discipleship/scripts/widget-iframe.js`, and add Playwright verification `discipleship/scripts/widget_202_10_supper_browser_check.js`.

## Design & Dave's Selective-Color Revision
- **Right Side (`At the Cross`): Fixed Monochrome Hand on the Wooden Beam:**
  - Refined per Dave's uploaded close-up reference sketch and feedback: removed the small full cross, connector light bars, and dotted look-back/look-forward lines.
  - Shows a single calm 3/4 pen-and-ink close-up of Jesus' open upturned hand resting palm-up on the timber beam with an iron nail driven through the wrist and a modest blood trickle on the beam edge. The illustration never moves across steps.
- **Left Side (`At the Table`): Whole Bread -> Ragged Tear & Upright Cup -> Tilted Pour:**
  - Starts with one whole unbroken monochrome loaf and upright empty clear chalice (`Ready`).
  - **Step 1 (`1. The Bread: His Body`):** The single loaf tears apart with a jagged broken edge in warm bread color (`#E2B484` / `#C78950`), while **only Jesus' hand** illuminates in the exact same warm tone (`#E2B484` / `#C78950`). Copy: *"This is my body, which is given for you."* (`Luke 22:19 | 1 Corinthians 11:24`)
  - **Step 2 (`2. The Cup: His Blood`):** **Jesus' hand returns to black and white**, the cup tilts `-32deg` with a gravity-level crimson meniscus and pours out deep `#9B1C2E` wine, and **only the blood on the beam** turns the exact same `#9B1C2E` crimson. Copy: *"This cup is the new covenant in my blood, poured out for you."* (`Luke 22:20 | Matthew 26:28`)
  - **Step 3 (`3. Remember Until He Comes`):** Broken bread (`#E2B484`) and filled upright cup (`#9B1C2E`) appear together while both the hand and the blood glow together in color (`1 Corinthians 11:24-26`).
- **Studio Wash Standards:** `#2C2416` `.title-bar` (`What the Table Pictures` / `202-10` tag), 4-dot `.step-strip`, locked `--card-h`, `#E0A526` focus rings, `<svg role="img">` + dynamic `<title>`/`<desc>`, `prefers-reduced-motion: reduce`, zero `localStorage`, zero em dashes, zero tap-to-begin lines.

## Verification Plan
- Visually inspect `step2.png` after the pour-stream rim adjustment.
- Run all foundation/export/storage/asset/iframe/ENG-003 checks + `widget_202_10_supper_browser_check.js` post-final-edit.
