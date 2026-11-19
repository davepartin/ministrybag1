# WIDGET-203-01-COMMISSION: The Great Commission Widget for 203-01

- **Date:** 2026-11-19
- **Owner:** Gemini
- **Branch:** `gemini/widget-203-01-great-commission`
- **Status:** `REVIEW` (stopped before merge pending Dave's visual and wording approval; lesson JSON, `index.html`, images, and other scripts untouched)

## Scope

Built one standalone, self-contained Studio Wash widget (`discipleship/widgets/great-commission-203.html`) and its Playwright verification script (`discipleship/scripts/widget_203_01_commission_browser_check.js`) off `origin/main` (`b365d2a`), leaving `data/203-01.json`, `index.html`, existing scripts, images, and Firebase config untouched for Claude's later placement.

## Implementation Summary

- **Title bar:** `The Great Commission` with lesson tag `203-01` (`#2C2416` Studio Wash chrome).
- **Concentric circles (`viewBox="0 0 440 318"`, `cx=220, cy=160`):**
  - Center (`r=40`): Down gold (`#A8760A` / `#FCF2D6`) + thin Up green inner hairline (`#1F684A`, `r=37`), labeled `You` / `loved by God` with muted `Growing Deep` caption.
  - Ring 1 (`r=66`): Belong blue (`#2A5B7C` / `#E2EEF6`), labeled `Home and Church` with muted `Growing Up` caption.
  - Ring 2 (`r=95`): Go purple (`#5F4684` / `#EDE7F6`), labeled `Your Jerusalem` / `work, school, neighborhood` with muted `Growing Out` caption.
  - Ring 3 (`r=124`): lighter Go purple wash (`#6E5792`), labeled `Judea and Samaria` / `your region, and people unlike you`.
  - Ring 4 (`r=152`): dashed Go purple outer ring (`#7E68A1`, lightest wash) with symmetric Studio Wash double-chevron outward watermarks on the active ring.
- **Inline SVG Eastern Hemisphere Globe (Step 5 and Final):** Simplified hand-drawn-feeling orthographic projection of Europe, Africa, the Middle East, India, Asia, and Russia with subtle spherical graticule arcs behind the translucent concentric rings (`0.20` wash / `0.32` faint ink) and a small gold dot marking Jerusalem (`220, 174.9`) beneath the center of the circles.
- **Final Step (Step 6):** Crisp Deep Crimson (`#8B1A2B`) double-hairline cross traced at the upper bullseye (no glow).
- **Motion & Accessibility:** Each forward ring draws symmetrically via `stroke-dashoffset` at `185 px/s` then washes in softly; Back and non-adjacent jumps redraw instantly; `prefers-reduced-motion: reduce` shows each finished drawing with zero animation; native `<button>` controls (`>= 44px` tall, `>= 28x28` wordless dots), `3px solid #E0A526` `:focus-visible`, `aria-live="polite"` card, dynamic SVG `<title>` / `<desc>`, width-only `fitCardHeight()`, zero `localStorage`, zero idle DOM mutations, zero em dashes, and zero forbidden words (`tap`, `click`, `widget`, `diagram`) in visible copy.

## Verification

- `bash scripts/qa_foundation.sh`: exit `0`
- `node scripts/test_lesson_export.js`: exit `0` (`212 check(s) passed`)
- `node scripts/test_answer_storage.js`: exit `0` (`73 check(s) passed`)
- `node scripts/check_lesson_assets.js`: exit `0` (`148` references OK)
- `node scripts/widget_203_01_commission_browser_check.js`: exit `0` (`213` checks across `375x812`, `390x844`, `1280x800`, and `390/reduce`; `card=145px`, `widget=544px` at `375px`, `555px` at `390px`, `590px` at `1280px`)
- Visually inspected `390x844` screenshots across Steps `0` through `6`.
