# WIDGET-202-07-HANDS: Open Hands Widget for 202-07 Giving & Generosity

- **Date:** 2026-11-20
- **Owner:** Gemini
- **Branch:** `gemini/widget-202-07-open-hands`
- **Status:** `REVIEW` (stopped before merge pending Dave's visual and wording approval; `data/202-07.json`, `index.html`, `widgets/stewardship-three-ts.html`, `widgets/stewardship-flip.html`, images, and other scripts untouched)

## Scope

Built one self-contained Studio Wash widget (`discipleship/widgets/open-hands-202.html`) and its Playwright verification script (`discipleship/scripts/widget_202_07_hands_browser_check.js`) off `origin/main` (`6689545`) for lesson `202-07` ("Giving & Generosity").

## Implementation Summary

- **Title bar:** `Open Hands` with lesson tag `202-07` (`#2C2416` Studio Wash chrome).
- **Napkin-simple Studio Wash composition (`viewBox="0 0 440 292"`, `514px` total height at `390px` wide):**
  - **God's hand (top, entering upper-left):** Open and tipped downward with Down gold wash (`#FCF2D6`), `#A8760A` inner accents, and five short crisp `#C48F10` rays (no glow).
  - **Your hand (middle, entering right):** Plain `#2C2416` ink with soft neutral warm wash (`#F4EFE4`), transitioning cleanly across three unmistakable poses: open cupped palm-up (Step 2), calm rounded closed fist with faint trapped object outlines (Step 3), and open hand tipped downward to pass gifts on (Steps 4 and 5).
  - **Another person's hand (bottom, entering lower-left):** Cupped open hand reaching upward in Belong blue (`#E2EEF6` wash, `#2A5B7C` ink accents).
  - **Three labeled objects along `185 px/s` dotted paths (`maskUnits="userSpaceOnUse"`):** Green clock (`Time`, `#1F684A`), purple hammer (`Talents`, `#5F4684`), and minted gold `$` coin (`Treasure`, `#A8760A`), each with a crisp `14px` bold system-sans label never overlapping hands or icons.
  - **Final Step (Step 5, `God Owns It All`):** Full three-hand flow framed in a crisp Studio Wash double hairline (`#A8760A` outer, `#2A5B7C` inner, traced via `stroke-dashoffset`, zero glow).
- **Motion, chrome & accessibility:** Six wordless color-coded step dots (`>= 28x28`), native `<button>` controls (`>= 44px` tall), `3px solid #E0A526` `:focus-visible`, `aria-live="polite"` card locked via width-only `fitCardHeight()` (`120px` at `390px` wide), dynamic SVG `<title>` and `<desc>`, Back instant restore, `prefers-reduced-motion: reduce` instant finished drawings, zero `localStorage`, zero idle DOM mutations, zero em dashes, and zero forbidden visible words (`tap`, `click`, `widget`, `diagram`).

## Verification

- `bash scripts/qa_foundation.sh`: exit `0`
- `node scripts/test_lesson_export.js`: exit `0`
- `node scripts/test_answer_storage.js`: exit `0`
- `node scripts/check_lesson_assets.js`: exit `0`
- `node scripts/widget_202_07_hands_browser_check.js`: exit `0` (`188` checks across `375x812`, `390x844`, `1280x800`, and `390/reduce`; `card=139px/widget=523px` at `375px`, `card=120px/widget=514px` at `390px`, `card=120px/widget=561px` at `1280px`, `card=120px/widget=514px` at `390/reduce`)
- Visually inspected `390x844` screenshots across Steps `0` through `5`, confirming all three hands are clearly distinct, the closed fist is tightly closed and non-aggressive, the open giving hand and blue receiving hand are clearly open, all three dotted paths and labels are crisp with zero overlap, and the double-hairline frame fits cleanly around the entire scene.
