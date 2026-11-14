# WIDGET-GREAT-CMD-CROSS Task Log

- **Task ID**: `WIDGET-GREAT-CMD-CROSS`
- **Owner / Branch**: Gemini / `gemini/widget-great-command-cross`
- **Status**: `REVIEW`
- **Date**: 2026-11-13

## What Changed

Built a single shared marker-drawn interactive SVG widget engine with three thin course shells (leaving all lesson JSONs, `index.html`, `scripts/`, `images/`, Firebase files, `widgets/great-command.html`, and `widgets/cross-the-road.html` untouched), refined with Dave's visual review feedback:

- `discipleship/widgets/great-command-cross.js`: Shared CSS, balanced `44px` cross geometry (`upright x=198..242, y=14..254`, crossbar center 33.3% down from top), zero dotted spoiler lines, all four outer labels placed horizontally in surrounding white space (`God loves us` gold left of upright beam, `We love God` green right of upright beam, `Love the Church` blue above left arm, `Love the Lost` purple `#6D4C9E` above right arm), split `Love the Church` (Step 3 blue) and `Love the Lost` (Step 4 purple) into separate 201 slides/buttons (`6` steps in 201), purple `#6D4C9E` Go palette across 201 & 203, closed deep-red outer contour with zero arrowhead, Belong house + table icons (`202`/`203`), Go Acts 1:8 widening rings (`203`), uniform constant linear arrow speed (`85 px/s`, ~30% of prior ~282 px/s speed) with exact pixel-length RAF scheduling (`3329ms` upright arrows, `3495ms` horizontal arm top->bottom->connect sequence, `4804ms` / `3753ms` red contours), wordless step-count color circle buttons (`.step-dot` 28x28px hit target), width-only card-height stabilization, Back/Next keyboard controls, `prefers-reduced-motion` instant state, `aria-live="polite"`, and live SVG `<title>`/`<desc>`.
- `discipleship/widgets/great-command-cross-201.html`: Thin shell for 201 (`The Greatest Commandment`) loading `great-command-cross.js` + `location.search`.
- `discipleship/widgets/great-command-cross-202.html`: Thin shell for 202 (`Love Reaches Out`) loading `great-command-cross.js` + `location.search`.
- `discipleship/widgets/great-command-cross-203.html`: Thin shell for 203 (`Love Goes Out`) loading `great-command-cross.js` + `location.search`.
- `discipleship/project-management/TASKS.md`: Claimed and updated `WIDGET-GREAT-CMD-CROSS` to `REVIEW`.

## Verification Results (Post-Final Edit)

- `bash scripts/qa_foundation.sh` (from `discipleship/`): **exit 0** (including 32 widget iframe checks)
- `node scripts/test_lesson_export.js` (from `discipleship/`): **exit 0** (167 checks passed)
- `node scripts/test_answer_storage.js` (from `discipleship/`): **exit 0** (64 checks passed)
- `node scripts/check_lesson_assets.js` (from `discipleship/`): **exit 0** (126 asset references verified)
- Temporary Playwright verification (`test_great_command_cross.js` across `201`, `202`, `203` with `?v=smoke1` query preservation): **exit 0**
  - `375px` mobile: `widgetH=506`, `cardH=129` across all steps, zero overflow, button heights >= 44px
  - `390px` mobile: `widgetH=515` across all three versions, `cardH=129` across all steps, zero overflow, button heights >= 44px
  - `1280px` desktop: `widgetH=566` (`201`/`203`) / `548` (`202`), stable `cardH` (`134` / `116`), zero overflow
  - Verified every forward step draws strokes (`strokeDashoffset === 0px`), `Back` restores prior step state immediately, `prefers-reduced-motion: reduce` shows completed drawings immediately with zero animation, zero `localStorage` keys written, zero em dashes, zero console/page/HTTP errors.

## Update 2026-11-13 (Version 5 Studio Wash + 202/203 Final Slide Refinement)

### Added / Changed Files
- `discipleship/widgets/great-command-v5.js`: Shared Studio Wash Edition engine for `201` (unchanged), `202` (refined final slide `focus202`), and `203` (refined final slide `focus203`, preserving `"The Cross Holds It All"` at Step 3).
- `discipleship/widgets/great-command-v5-201.html`, `great-command-v5-202.html`, `great-command-v5-203.html`: Thin Studio Wash shells.
- `discipleship/widgets/STUDIO-WASH-GUIDE.md`, `discipleship/widgets/WIDGET-DESIGN-PLAYBOOK.md`: Studio Wash visual standard and widget design workflow docs requested by Dave.
- `discipleship/project-management/TEAM-BOARD.md`: Recorded exact 202 and 203 final-card wording, changed files, and check results for `REVIEW`.

### Exact Final-Card Wording (`202` and `203`)
- **202 Growing Up (`focus202`):**
  - Heading: `Love in Everyday Life`
  - Scripture: `"So then, as we have opportunity, let us do good to everyone, and especially to those who are of the household of faith."` (`Galatians 6:10`)
  - Paragraph: `Growing Up helps you put God's love into practice at home, in your church family, and among your neighbors, through generosity, faithful relationships, and care in hard seasons.`
  - Visual: Keeps both horizontal arms (`Belong` blue `#2A5B7C`, `Neighbors` purple `#5F4684`), replaces the left table/right crossing-road icons with a single welcoming house (`Belong` / `Family & God's family`) on the left and a three-house neighborhood (`BLESS` / `your neighborhood`) on the right, adds one gentle curved dual stroke reveal from the horizontal arms down to both scenes, and leaves clean white space below (no bottom bubble).
- **203 Growing Out (`focus203`, Step 3 remains `"The Cross Holds It All"`):**
  - Heading: `Make Disciples Where You Are`
  - Scripture: `"Go therefore and make disciples of all nations"` (`Matthew 28:19`)
  - Paragraph: `Pray, listen, eat, serve, and share Jesus with the people around you. Go out and make disciples who will make disciples.`
  - Visual: Keeps cross recognizable with purple `Go` arm bright, removes earlier person arcs and place labels, and animates a `1 -> 2 -> 4` pyramid of `203-08` tables (`spaces-tables.html` style, 2 seated people per table with the left person in purple `#5F4684`) linked downward by angled multiplication arrows in the white space under `Go`.

### Post-Final-Edit Verification (`exit 0`)
- `bash scripts/qa_foundation.sh` (from `discipleship/`): **exit 0** (32 widget iframe checks passed)
- `node scripts/test_lesson_export.js` (from `discipleship/`): **exit 0** (177 checks passed)
- `node scripts/test_answer_storage.js` (from `discipleship/`): **exit 0** (64 checks passed)
- `node scripts/check_lesson_assets.js` (from `discipleship/`): **exit 0** (126 asset references passed)
- Em-dash check (`! grep -rn $'\xe2\x80\x94'` on `great-command-v5*` + guides): **exit 0**
- Playwright `test_v5_all.js` across `great-command-v5-201.html`, `202.html`, `203.html`: **exit 0**
  - Phone (`390x844`): `201` unchanged (`cardH=129`, `widgetH=523`), `202` (`cardH=163`, `widgetH=557`), `203` (`cardH=128`, `widgetH=522`), zero horizontal overflow, button heights >= 44px, Back/Next/Start Over verified, keyboard `Enter`/`Space` navigation verified, zero `localStorage` usage, zero page/console errors
  - Desktop (`1280x800`): `cardH` stable (`134` / `132` / `116`), zero overflow
  - `prefers-reduced-motion: reduce`: `stepDur=0` across every step, all active `.mission-arc` strokes at `strokeDashoffset=0`, all `.v5-stage-item.is-visible` at `opacity=1`

