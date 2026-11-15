# WIDGET-202-10-LORDS-SUPPER (Gemini)

- Task ID: `WIDGET-202-10-LORDS-SUPPER`
- Branch: `gemini/widget-202-10-lords-supper`
- Base commit: `origin/main` (`0480267`)
- Scope: Build the companion **Lord's Supper** parallel-analogy widget (`discipleship/widgets/lords-supper-picture.html`) for `202-10` (to serve alongside the Baptism widget from PR #246), wire it into the Lord's Supper section of `discipleship/data/202-10.json`, retire `widgets/two-ordinances.html` from `202-10.json` (kept on disk), register its iframe title in `discipleship/scripts/widget-iframe.js`, and add Playwright verification `discipleship/scripts/widget_202_10_supper_browser_check.js`.

## Design & Creative Direction
- **Split-Stage Parallel Analogy (`At the Table` Left | `At the Cross` Right):**
  - **Studio Wash Frame (`#2C2416` bar, `What the Table Pictures`, `202-10` tag):** Matches `baptism-picture.html` directly (`#F6F4EE` tray, 5-dot wordless `.step-strip`, height-locked `.verse-card`, `#E0A526` focus rings, `<svg role="img">` with dynamic `<title>`/`<desc>`, `prefers-reduced-motion: reduce`, zero `localStorage`, zero em dashes, zero tap-to-begin lines).
  - **1:1 Color-Matching Spark:**
    - `--flesh-light` (`#E2B484`), `--flesh-mid` (`#C98A52`), and `--flesh-stroke` (`#8C5324`) paint BOTH the **unleavened bread halves** (`At the Table`) and Jesus' **close-up outstretched palm & nailed hand on the crossbeam** (`At the Cross`), linked diagonally on **Step 1 (`1. The Bread: His Body`, Luke 22:19 | 1 Corinthians 11:24)**.
    - `--crimson` (`#9B1C2E`), `--crimson-hi` (`#BD2C41`), and `--crimson-dark` (`#6D1220`) paint BOTH the **wine inside the clear chalice** (`At the Table`) and the **crimson stream & drops shed down the cross** (`At the Cross`), linked horizontally on **Step 2 (`2. The Cup: His Blood`, Luke 22:20 | Matthew 26:28)**.
  - **Cross Composition:** Timber cross with stylized woven **crown of thorns** across the upper post plus the close-up **open nailed hand**, allowing immediate recognition of the cross while keeping both matching color fields unmistakable on phone screens.
  - **Four Purpose Steps (Christ's Words, Minimal Prose):**
    - Intro (`Ready` / `Begin ->`): `A Meal That Points to the Cross` (whole loaf + empty chalice on linen table beside bare wooden cross & crown of thorns).
    - Step 1 (`1 of 4`): `1. The Bread: His Body` (`"This is my body, which is given for you."`).
    - Step 2 (`2 of 4`): `2. The Cup: His Blood` (`"This cup is the new covenant in my blood."`).
    - Step 3 (`3 of 4`): `3. Look Back: Remember Me` (`"Do this in remembrance of me."`, both bread & wine visible with `Look Back` dashed arrow from Cross to Table).
    - Step 4 (`4 of 4`): `4. Look Forward: Until He Comes` (`"You proclaim the Lord's death until he comes."`, dawn halo behind Cross, `Look Forward` arc, `"One Shared Table"` / `"Until He Comes"`).

## Verification Plan
- Check zero Unicode em dashes (`\u2014`) across all changed files.
- Run `bash scripts/qa_foundation.sh`, `node scripts/test_lesson_export.js`, `node scripts/test_answer_storage.js`, `node scripts/check_lesson_assets.js`, `node scripts/test_widget_iframe.js`, `node scripts/eng003_browser_check.js`, and `node scripts/widget_202_10_supper_browser_check.js`.
- Visually inspect `390x844` screenshots across all 5 steps (`scratch/supper-v2/step0.png`..`step4.png`).
