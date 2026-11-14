# WIDGET-202-HEADERS Task Log

- **Task ID**: `WIDGET-202-HEADERS`
- **Owner / Branch**: Gemini / `gemini/widget-202-headers`
- **Status**: `REVIEW`
- **Date**: 2026-11-13

## What Changed

Standardized the widget header across the Studio Wash v5 course-opener engine (`great-command-v5.js`), the two widget design guides, and all active `202` widgets (`202-01` through `202-10`) using the `#2C2416` dark charcoal bar with the widget title top-left (`17px` `#FAF8F3`) and lesson badge top-right (`11px` uppercase `#E5DEC9`, dropping `Course`):

- `discipleship/widgets/great-command-v5.js`: Updated `courseTag` from `'Course 201'`, `'Course 202'`, `'Course 203'` to `'201-01'`, `'202-01'`, and `'203-01'`.
- `discipleship/widgets/STUDIO-WASH-GUIDE.md`, `discipleship/widgets/WIDGET-DESIGN-PLAYBOOK.md`: Documented the `<course>-<lesson>` top-right tag rule (`201-01`, `202-01`, `203-01`, no `COURSE` prefix).
- `discipleship/widgets/cross-the-road.html` (`202-01`): Applied Studio Wash `#2C2416` bar (`Cross the Road` / `202-01`).
- `discipleship/widgets/cornerstone.html` (`202-02`): Aligned `<title>` and `<h1>` to `Building From the Cornerstone` with `202-02` tag in `#2C2416` bar.
- `discipleship/widgets/one-another.html` (`202-03`): Applied Studio Wash `#2C2416` bar (`One Another` / `202-03`).
- `discipleship/widgets/five-gardeners.html` (`202-04`): Applied Studio Wash `#2C2416` bar (`Five Farmers, One Field` / `202-04`).
- `discipleship/widgets/trust-the-artist.html` (`202-05`): Replaced `Genesis 50:20` right-hand subtitle with `202-05` in the unified `36px` `#2C2416` bar (`Trust the Creator` / `202-05`).
- `discipleship/widgets/mirror-angles.html` (`202-06`): Aligned `<h1>` and `<title>` to `Reflecting God's Worth` with `202-06` tag in `#2C2416` bar; moved `.hint` cleanly underneath `<header>`.
- `discipleship/widgets/stewardship-three-ts.html` (`202-07`): Applied consistent `#2C2416` Studio Wash bar (`Time, Talents, Treasure` / `202-07`).
- `discipleship/widgets/covenant-triangle.html` (`202-08`): Applied Studio Wash `#2C2416` bar (`The Closer to God Triangle` / `202-08`).
- `discipleship/widgets/starting-gun.html` (`202-09`): Applied Studio Wash `#2C2416` bar (`RUN from Sin` / `202-09`).
- `discipleship/widgets/two-ordinances.html` (`202-10`): Wrapped content in `.widget-outer` with `#2C2416` bar (`The Doorway and the Table` / `202-10`), keeping subtitle below.

Untouched: all lesson JSON files (`data/*.json`), question IDs, saved answers, `index.html`, `scripts/`, `images/`, `valley-road.html` (historical unused file), and `101`/`201`/`203` lesson widgets.

## Verification Results

- Playwright `test_202_headers.js` across all 13 widgets (`great-command-v5-201.html`, `202.html`, `203.html` + `cross-the-road.html` through `two-ordinances.html`) at `390x844` phone and `1280x800` desktop: **exit 0**
  - Verified exact left title, right `<course>-<lesson>` badge, `#2C2416` (`rgb(44, 36, 22)`) bar height `36px`, positive horizontal gap (`>= 66px` on phone, `>= 134px` on desktop), zero horizontal overflow, zero `localStorage` usage, zero console/page errors, and visual inspection of all mobile PNG captures.
- `bash scripts/qa_foundation.sh`: **exit 0** (`1367 lesson image checks passed`, all foundation QA checks passed)
- `node scripts/test_lesson_export.js`: **exit 0** (`177 check(s) passed`)
- `node scripts/test_answer_storage.js`: **exit 0** (`64 check(s) passed`)
- `node scripts/check_lesson_assets.js`: **exit 0** (`PASS: 127 src/image/imageBw/imageColor/imageSequence references resolve to files`)
- Zero em dashes (`! grep -rn $'\xe2\x80\x94'`): **exit 0**
