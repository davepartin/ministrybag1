# WIDGET-202-10-BAPTISM (Gemini)

- Task ID: `WIDGET-202-10-BAPTISM`
- Branch: `gemini/widget-202-10-baptism`
- Base commit: `origin/main` (`0480267`)
- Scope: Create the Baptism parallel-analogy widget (`discipleship/widgets/baptism-picture.html`), wire it into the Baptism section of `discipleship/data/202-10.json`, register its title in `discipleship/scripts/widget-iframe.js`, and add Playwright test `discipleship/scripts/widget_202_10_baptism_browser_check.js`. All `202-10` prose, verses, question IDs, `widgets/two-ordinances.html` (pending Widget 2 for Lord's Supper), `index.html`, and image assets are untouched.

## Summary of Changes
- `discipleship/widgets/baptism-picture.html`:
  - Split-stage Studio Wash diagram showing **Your Baptism** (sloping riverbank, translucent blue water pool, waiting baptizer, animated candidate figure) on the left and **What Jesus Did** (Calvary hillside, timber cross, arched rock tomb with animated rolling stone, dawn glow, and union beam) on the right across Intro + 4 parallel slides:
    1. **Death (`1. Death: Crucified with Christ`):** Stepping down the bank as old self ends (`Old Self Dies`) alongside the cross glow (`Jesus Died on the Cross`), with Galatians 2:20 and Romans 6:6.
    2. **Burial (`2. Burial: Buried with Him`):** Reclined beneath translucent water with surface ripples (`Buried Under Water`) as the heavy stone rolls shut across the tomb doorway (`Buried in the Tomb`), with Romans 6:4 and Colossians 2:12.
    3. **Resurrection (`3. Resurrection: Raised with Christ`):** Rising mid-water with splash arcs and greening bank (`Raised to Life`) as the stone rolls away and golden dawn light pours from the empty tomb (`Stone Rolled Away`), with Romans 6:4 and Colossians 3:1.
    4. **New Life (`4. New Life: Old Has Gone, New Has Come`):** Walking up the green far bank with inner cross-light (`Walk in New Life`) illuminated by a golden ray from the risen hillside (`Christ Lives in You`), blending 2 Corinthians 5:17 and Galatians 2:20.
  - Studio Wash `#2C2416` `.title-bar` (`What Baptism Pictures` / `202-10` tag), wordless 5-dot `.step-strip`, height-locked `.verse-card`, `#E0A526` `:focus-visible` rings, `<svg role="img">` + dynamic `<title>`/`<desc>`, `prefers-reduced-motion: reduce`, zero `localStorage`, and zero em dashes.
- `discipleship/data/202-10.json`:
  - Inserted `widgets/baptism-picture.html` (`height: "600px"`) immediately after `"Jesus gave the picture first, then did the work, and now you step into the same picture to point back at what He did for you."` in the Baptism section. All prose, question IDs, and `widgets/two-ordinances.html` remain untouched.
- `discipleship/scripts/widget-iframe.js`:
  - Added `'baptism-picture.html': 'What Baptism Pictures'` to `KNOWN_TITLES`.
- `discipleship/scripts/widget_202_10_baptism_browser_check.js`:
  - Playwright check embedded in `#202-10` across `375x667`, `390x844`, `1280x800`, and `prefers-reduced-motion: reduce`.

## Verification (Post-Final-Edit)
- Zero em dashes (`U+2014`) across widget, `data/202-10.json`, `scripts/widget-iframe.js`, test script, and log: verified (`0` matches)
- `bash scripts/qa_foundation.sh`: exit `0`
- `node scripts/test_lesson_export.js`: exit `0`
- `node scripts/test_answer_storage.js`: exit `0` (`64 check(s) passed`)
- `node scripts/check_lesson_assets.js`: exit `0` (`PASS: 140 src/image/imageBw/imageColor/imageSequence references resolve to files.`)
- `node scripts/test_widget_iframe.js`: exit `0` (`32 widget iframe checks passed`)
- `node scripts/widget_202_10_baptism_browser_check.js`: exit `0` (`ALL CHECKS PASSED (108 assertions)` across `375x844`, `390x844`, `1280x844`, and `prefers-reduced-motion: reduce`, embedded in `#202-10`)
- Visually inspected `390x844` screenshots across Intro and Steps 1-4 (`scratch/202-10-baptism-v1/` and `scratch/202-10-baptism-v3/`).
