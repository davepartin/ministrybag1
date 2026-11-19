# WIDGET-203-01-COMMISSION: The Great Commission Widget for 203-01

- **Date:** 2026-11-19
- **Owner:** Gemini
- **Branch:** `gemini/widget-203-01-great-commission`
- **Status:** `REVIEW` (stopped before merge pending Dave's visual and wording approval; lesson JSON, `index.html`, images, and other scripts untouched)

## Scope

Built one standalone, self-contained Studio Wash widget (`discipleship/widgets/great-commission-203.html`) and its Playwright verification script (`discipleship/scripts/widget_203_01_commission_browser_check.js`) off `origin/main` (`b365d2a`), leaving `data/203-01.json`, `index.html`, existing scripts, images, and Firebase config untouched for Claude's later placement.

## Implementation Summary (Revised per Dave's Review)

- **Title bar:** `The Great Commission` with lesson tag `203-01` (`#2C2416` Studio Wash chrome).
- **Forest/Sage Green concentric circles (`viewBox="0 0 440 314"`, `cx=220, cy=158`) with everyday circles of influence:**
  - Center (`r=38`): deep forest green (`#1F684A` fill, `#164E37` contour) with crisp white `You` / `loved by God`.
  - Ring 1 (`r=65`): rich sage wash (`#9EC8AF`, `#236649` contour), minimal bottom label `Home & Church`.
  - Ring 2 (`r=93`): medium sage wash (`#BBDAC7`, `#357A5A` contour), minimal bottom label `Work & School`.
  - Ring 3 (`r=121`): light sage wash (`#CFE6D8`, `#518F70` contour), minimal bottom label `Neighborhood & City`.
  - Ring 4 (`r=149`): pale sage wash (`#DCEEE3`) with dashed outer contour (`#7EA38F`), minimal bottom label `The World`.
  - All Bible city names (`Jerusalem`, `Judea and Samaria`, `end of the earth`) and `Growing Deep` / `Growing Up` / `Growing Out` course explanations live cleanly in the description card below each circle.
- **Upward Outward Arrows (Steps 2-6):** Two diagonal forest-green arrows (`#2A6B4F`) radiating up-left (`-135°`) and up-right (`-45°`) from the center circle out to the edge of each active ring.
- **Blue-Ocean & Green-Land Eastern Hemisphere Globe (Step 5 and Final):** Simplified orthographic projection of Europe, Africa, the Middle East, India, Asia, and Russia with a soft ocean-blue water sphere (`#CBE7F8`), subtle blue spherical graticule arcs, and sage-green continents (`#7BB48F`) fading in behind softened ring washes (`svg.globe-active`), with a small gold dot marking Jerusalem (`220, 180.2`) beneath the center of the circles.
- **Final Step (Step 6):** Crisp Deep Crimson (`#8B1A2B`) double-hairline cross with clean `#FFFDF8` under-stroke for high contrast on the deep forest-green center (no glow).
- **Motion & Accessibility:** Each forward ring draws symmetrically via `stroke-dashoffset` at `185 px/s` then washes in softly; Back and non-adjacent jumps redraw instantly; `prefers-reduced-motion: reduce` shows each finished drawing with zero animation; native `<button>` controls (`>= 44px` tall, `>= 28x28` wordless dots), `3px solid #E0A526` `:focus-visible`, `aria-live="polite"` card, dynamic SVG `<title>` / `<desc>`, width-only `fitCardHeight()`, zero `localStorage`, zero idle DOM mutations, zero em dashes, and zero forbidden words (`tap`, `click`, `widget`, `diagram`) in visible copy.

## Verification

- `bash scripts/qa_foundation.sh`: exit `0`
- `node scripts/test_lesson_export.js`: exit `0` (`212 check(s) passed`)
- `node scripts/test_answer_storage.js`: exit `0` (`73 check(s) passed`)
- `node scripts/check_lesson_assets.js`: exit `0` (`147` references OK)
- `node scripts/widget_203_01_commission_browser_check.js`: exit `0` (`213` checks across `375x812`, `390x844`, `1280x800`, and `390/reduce`; `card=145px`, `widget=541px` at `375px`, `552px` at `390px`, `586px` at `1280px`)
- Visually inspected `390x844` screenshots across Steps `0` through `6`.
