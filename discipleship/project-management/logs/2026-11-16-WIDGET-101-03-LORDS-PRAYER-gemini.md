# WIDGET-101-03-LORDS-PRAYER: 101-03 The Lord's Prayer Widget

- **Date:** 2026-11-16
- **Owner:** Gemini
- **Branch:** `gemini/widget-101-03-lords-prayer`
- **Status:** `REVIEW` (stopped before merge pending Dave's visual approval)

## Changes

1. **Interactive Widget (`discipleship/widgets/lords-prayer.html`)**
   - Studio Wash header (`The Lord's Prayer` / `101-03`), `Matthew 6:9-13 Pattern` + `Click any line` pill cue.
   - Seven native `<button type="button" class="prayer-line">` controls containing the exact wording of the Lord's Prayer (`Our Father, who is in heaven,`, `Holy is your name,`, `your kingdom come, your will be done / on earth as it is in heaven.`, `Give us this day our daily bread.`, `Forgive us our sins, as we forgive those who sin against us.`, `And lead us not into temptation, but deliver us from evil.`, and `For yours is the kingdom, and the power, and the glory forever, Amen.`).
   - Clicking any line or stepping with the 8-dot strip / `Begin ->` / `Next ->` / `<- Back` highlights the selected Scripture phrase (Studio Wash highlight tint + bottom border) and updates the compact Step Heading card below with zero long teaching text (`Connect Relationally`, `Worship His Name`, `Pray His Agenda First`, `Depend on Him for Everything`, `Forgive and Be Forgiven`, `Engage in Spiritual Warfare`, and `Return the Glory to God`).
   - Accessibility and safety: native `<button>` toggle states (`aria-pressed`), `>= 24x24px` touch targets, high-contrast `:focus-visible` ring, `aria-live="polite"` on `#card-heading`, `prefers-reduced-motion: reduce` support (`.is-instant`), width-only resize measurement for constant `--card-h`, zero `localStorage` writes, zero idle DOM mutations, zero em dashes.

2. **Lesson Placement & Registration**
   - Replaced only the static `"verse": "The Lord's Prayer"` block in `discipleship/data/101-03.json` with `{ "type": "widget", "src": "widgets/lords-prayer.html", "title": "The Lord's Prayer", "height": "520px" }`, preserving all protected `101-03` prose, step teaching, questions/IDs (`3-1`..`3-prayer`), reading plan, and Daily Prayers tool link.
   - Registered `'lords-prayer.html': "The Lord's Prayer"` in `discipleship/scripts/widget-iframe.js`.

3. **Browser Regression (`discipleship/scripts/widget_101_03_lords_prayer_browser_check.js`)**
   - Verifies placement inside `#101-3`, all 8 `101-03` questions and synthetic answers across reload and Email export, direct line clicks + dot/Next/Back/Start Over keyboard navigation, `>= 24x24px` target sizes, constant `--card-h`, zero overflow, zero idle mutations, zero widget storage writes, and zero HTTP/page errors across `375x812`, `390x844`, `1280x800`, and `390/reduce`.

## Verification

- Em-dash check: `ZERO_EM_DASHES_OK`
- `bash scripts/qa_foundation.sh`: exit `0` (`All foundation QA checks passed.`)
- `node scripts/test_lesson_export.js`: exit `0` (`186 check(s) passed.`)
- `node scripts/test_answer_storage.js`: exit `0` (`64 check(s) passed.`)
- `node scripts/check_lesson_assets.js`: exit `0` (`142` references OK)
- `node scripts/test_widget_iframe.js`: exit `0` (`32 widget iframe checks passed.`)
- `widget_101_03_lords_prayer_browser_check.js`: exit `0` (`329 101-03 Lord's Prayer widget checks passed.`, `--card-h` locked at `54px`, widget height `583px` on phone / `585px` on desktop).
