# WIDGET-101-03-HINT: Replace "Click any line" Hint in Lord's Prayer Widget

- **Date:** 2026-11-16
- **Owner:** Gemini
- **Branch:** `gemini/widget-101-03-hint`
- **Status:** `REVIEW` (stopped before merge)

## Scope

Follow-up copy polish on [lords-prayer.html](../../widgets/lords-prayer.html) after PR `#266`, leaving `discipleship/data/101-03.json`, `discipleship/scripts/widget-iframe.js`, `index.html`, story artwork, and all other files untouched.

## Changes

- Replaced `<span class="tap-hint" id="tap-hint">Click any line</span>` and `"Matthew 6:9-13 Pattern"` in `.prayer-meta` with `<span class="choose-hint" id="choose-hint">Choose a line to see its step</span>` paired with `<span class="prayer-kicker">Matthew 6:9-13</span>`.

## Verification

- Visible HTML/CSS check (`ZERO_EM_DASH_AND_VISIBLE_CLICK_WORD_OK`)
- `bash scripts/qa_foundation.sh`: exit `0`
- `node scripts/test_lesson_export.js`: exit `0` (`186 check(s) passed.`)
- `node scripts/test_answer_storage.js`: exit `0` (`64 check(s) passed.`)
- `node scripts/check_lesson_assets.js`: exit `0` (`144` references OK)
- `node scripts/test_widget_iframe.js`: exit `0` (`32 widget iframe checks passed.`)
- `node scripts/widget_101_03_lords_prayer_browser_check.js`: exit `0` (`225 101-03 Lord's Prayer widget checks passed.`, `500px` on phone / `520px` on desktop)
- Visually inspected `step-0.png` and `step-1.png` at `390x844`.
