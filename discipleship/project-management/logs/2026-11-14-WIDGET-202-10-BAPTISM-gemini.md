# WIDGET-202-10-BAPTISM (Gemini)

- Task ID: `WIDGET-202-10-BAPTISM`
- Branch: `gemini/widget-202-10-baptism`
- Base commit: `origin/main` (`0480267`)
- Scope: Create the Baptism parallel-analogy widget (`discipleship/widgets/baptism-picture.html`), wire it into the Baptism section of `discipleship/data/202-10.json`, register its title in `discipleship/scripts/widget-iframe.js`, and add Playwright test `discipleship/scripts/widget_202_10_baptism_browser_check.js`. All `202-10` prose, verses, question IDs, `widgets/two-ordinances.html` (pending Widget 2 for Lord's Supper), `index.html`, and image assets are untouched.

## Summary of Changes
- `discipleship/widgets/baptism-picture.html`:
  - Split-stage Studio Wash diagram with matching terrain stepping up toward higher ground on the right: **Your Baptism** (compact sloping bank, waist-high translucent blue pool, helping pastor, constant-green baptized believer) on the left and **What Jesus Did** (stone tomb on the left of Jesus' higher hillside and Calvary cross on the right, with Jesus on the cross, in the sealed tomb, and risen in a white robe) across Intro + 4 parallel slides:
    1. **Death (`1. Death: Crucified with Christ`):** Standing waist-deep in water beside the pastor (`Old Self Dies in Water`) while Jesus hangs on the Cross (`Christ Died on the Cross`), with Galatians 2:20 and Romans 6:6.
    2. **Burial (`2. Burial: Buried with Him`):** Bending backwards under the translucent water with the pastor supporting (`Lowered Under Water`) as the cross empties and the stone rolls shut over the tomb (`Buried in the Tomb`), with Romans 6:4 and Colossians 2:12.
    3. **Resurrection (`3. Resurrection: Raised with Christ`):** Rising up out of the water onto the greening bank (`Raised Out of Water`) as the stone rolls open and white-robed Jesus rises from the sunlit empty tomb on higher ground (`Jesus Raised to Life`), with Romans 6:4 and Colossians 3:1.
    4. **New Life (`4. New Life: Old Has Gone, New Has Come`):** Believer kneeling reverently on the right bank (`Kneeling Before Jesus`) directly facing across the center line toward the higher-up white-robed risen Jesus standing outside the open tomb (`Risen Savior & New Life`), blending 2 Corinthians 5:17 and Galatians 2:20.
  - Studio Wash `#2C2416` `.title-bar` (`What Baptism Pictures` / `202-10` tag), wordless 5-dot `.step-strip`, height-locked `.verse-card`, `#E0A526` `:focus-visible` rings, `<svg role="img">` + dynamic `<title>`/`<desc>`, `prefers-reduced-motion: reduce`, zero `localStorage`, and zero em dashes.
- `discipleship/data/202-10.json`:
  - Inserted `widgets/baptism-picture.html` (`height: "600px"`) immediately after `"Jesus gave the picture first, then did the work, and now you step into the same picture to point back at what He did for you."` in the Baptism section.
- `discipleship/scripts/widget-iframe.js`:
  - Added `'baptism-picture.html': 'What Baptism Pictures'` to `KNOWN_TITLES`.
- `discipleship/scripts/widget_202_10_baptism_browser_check.js`:
  - Playwright check embedded in `#202-10` across `375x844`, `390x844`, `1280x844`, and `prefers-reduced-motion: reduce`.

## Verification (Post-Final-Edit)
- Zero em dashes (`U+2014`): verified (`0` matches across widget, data, iframe registry, test script, and logs)
- `bash scripts/qa_foundation.sh`: exit `0`
- `node scripts/test_lesson_export.js`: exit `0`
- `node scripts/test_answer_storage.js`: exit `0` (`64 check(s) passed`)
- `node scripts/check_lesson_assets.js`: exit `0` (`140` image refs resolved)
- `node scripts/test_widget_iframe.js`: exit `0` (`32 widget iframe checks passed`)
- `node scripts/widget_202_10_baptism_browser_check.js`: exit `0` (`ALL CHECKS PASSED (112 assertions)`)
- Visually inspected `390x844` screenshots across Intro and Steps 1-4 (`scratch/202-10-baptism-v4/` and `scratch/202-10-baptism-v5/`).
