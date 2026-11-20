# WIDGET-203-10-MARKS: Marks of a True Christian (Romans 12:9-21) Widget for 203-10

- **Date:** 2026-11-20
- **Owner:** Gemini
- **Branch:** `gemini/widget-203-10-marks`
- **Status:** `REVIEW` (stopped before merge pending Dave's visual and wording approval; lesson JSON, `index.html`, images, and other scripts untouched)

## Scope

Built one standalone, self-contained Studio Wash interactive passage widget (`discipleship/widgets/marks-of-genuine-love.html`) for the 30th and final lesson (`203-10 Let Love Be Genuine`) and its Playwright verification script (`discipleship/scripts/widget_203_10_marks_browser_check.js`) off `origin/main` (`aa8beea`).

## Implementation Summary

- **Title bar:** `Marks of a True Christian` with lesson tag `203-10` (`#2C2416` Studio Wash chrome).
- **Four interactive directional lens pills (`1 Genuine`, `2 Up to God`, `3 Church`, `4 Outward`):**
  - **Step 1 (`1. A Genuine Heart`, Gold `#A8760A`):** Highlights the opening and closing bookends of the passage, **Romans 12:9 and 12:21** (*"Let love be genuine. Abhor what is evil; hold fast to what is good... Do not be overcome by evil, but overcome evil with good."*).
  - **Step 2 (`2. Up Toward God`, Forest Green `#1F684A`, *201 Course: Growing Deep*):** Highlights **Romans 12:11-12** (*"Do not be slothful in zeal, be fervent in spirit, serve the Lord. Rejoice in hope, be patient in tribulation, be constant in prayer."*).
  - **Step 3 (`3. Family in Christ`, Harbour Blue `#2A5B7C`, *The 202 Course: Growing Up*):** Highlights **Romans 12:10, 13, 15-16** (*"Love one another with brotherly affection. Outdo one another in showing honor... Contribute to the needs of the saints and seek to show hospitality... Rejoice with those who rejoice, weep with those who weep. Live in harmony with one another. Do not be haughty, but associate with the lowly. Never be wise in your own sight."*).
  - **Step 4 (`4. Out Toward Everyone, Even Enemies`, Royal Plum `#5F4684`, *This 203 Course: Growing Out*):** Highlights **Romans 12:14, 17-20** (*"Bless those who persecute you; bless and do not curse them... Repay no one evil for evil... live peaceably with all... never avenge yourselves... if your enemy is hungry, feed him; if he is thirsty, give him something to drink..."*).
  - **Step 5 (`Love Comes Down, Goes Up, and Reaches Out`):** Illuminates all four color groups simultaneously across the entire Romans 12:9-21 passage along with all four directional pills.
- **Direct interaction & accessibility:** Learners can step through via `Begin ->` / `Next ->` and `<- Back`, select any step dot (`>= 28x28`), select any of the four top lens pills, or select any verse phrase directly inside Romans 12:9-21 (pointer or keyboard `Enter`/`Space`). Includes `3px solid #E0A526` `:focus-visible`, `aria-live="polite"` teaching card, width-only `fitCardHeight()`, `prefers-reduced-motion: reduce` support, zero `localStorage`, zero idle DOM mutations, zero em dashes, and zero forbidden visible words (`tap`, `click`, `widget`, `diagram`).

## Verification

- `bash scripts/qa_foundation.sh`: exit `0`
- `node scripts/test_lesson_export.js`: exit `0` (`212 check(s) passed`)
- `node scripts/test_answer_storage.js`: exit `0` (`73 check(s) passed`)
- `node scripts/check_lesson_assets.js`: exit `0` (`148` references OK)
- `node scripts/widget_203_10_marks_browser_check.js`: exit `0` (`182` checks across `375x812`, `390x844`, `1280x800`, and `390/reduce`; `card=95px`, `widget=586px` at `390px` wide)
- Visually inspected `390x844` screenshots across Steps `0` through `5`.
