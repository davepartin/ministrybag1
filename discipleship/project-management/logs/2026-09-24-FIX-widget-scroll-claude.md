# FIX: widget measure/resize loop made the page snap back while scrolling (Claude)

Date: 2026-09-24
Branch: `claude/fix-widget-scroll-loop`
Reported by Dave: on 202-09, scrolling up from question 9.2 toward the widget "keeps resetting the page".

## Cause
Two pieces of code were feeding each other in a loop.
1. `scripts/widget-iframe.js` measures a widget by briefly setting its iframe to 0px high, reading the content height, then restoring it. It does this whenever anything inside the widget changes.
2. `covenant-triangle.html` (202-08) and `starting-gun.html` (202-09) refit their cards on every window `resize`. The 0px measurement is itself a resize of the iframe, so each widget refit its cards, adding and removing a hidden measuring element. The loader saw that change and measured again.

The loop ran about 5 to 10 times a second forever: 22 body changes and 11 iframe writes in 2 idle seconds. Each 0px collapse let the browser adjust the page's scroll. At phone size, scrolling up from 9.2 moved about 5 steps and then snapped back down about 450px (the widget's height), over and over.

## Fix
- Widgets now refit only when the width changes. A height-only resize cannot change card layout, so this breaks the loop.
- The loader now puts the page's scroll position back when a measurement ends at the same height. The restore is instant, because the page uses `scroll-behavior: smooth` and a smooth restore glided the page and broke ENG-003's control-position check. When the height really changes, the loader leaves scrolling alone so the browser's normal anchoring applies.
- The same widget fix is applied to `three-spaces.html` (PR #29) and `mission-map.html` (PR #33) on their branches.

## Verification
- Idle: 0 iframe writes in 1.5 seconds (was 11 in 2 seconds).
- Scrolling up from 9.2 at phone size: each step moves up evenly, with no snap-back, on both 202-08 and 202-09.
- New checks in `review_202_08_09_browser_check.js` ("stays still while idle" and "scrolls up past the widget without snapping back") fail on the old code and pass now.
- Passing: `qa_foundation.sh`; widget iframe 30; storage 47; assets 8; backup download 53, preview 75, restore 94; export 40; save feedback 41; 202-08/09 browser checks 24; review_eng 14; UX-001b; ENG-003.
- Note: ENG-003 was run with installed Chrome, because Playwright's bundled browser is not installed here. The script itself is unchanged.

## Follow-up: still jumpy on Dave's phone (branch `claude/fix-widget-toolbar-resize`)
- **iPhone trigger:** the loader re-measured every widget on every window `resize`, collapsing the frame to 0px each time. On a phone, scrolling up slides the address bar in and out, which fires `resize` with only the height changed. So the frame kept collapsing mid-scroll. My desktop test browser has no sliding toolbar, so it did not show this.
- **Fix:** the loader now re-measures on window resize only when the width changes. Only a width change can change a widget's content height.
- **Also removed:** PR #35's "restore scroll after measuring" step. It snapped the page back while the browser was still scrolling, and it made ENG-003 flaky:
  - with the restore: 3 of 8 runs failed;
  - loader from before PR #35: 0 of 11 failed;
  - this version: 1 of 11 failed, the same control-position timing check, which looks like normal test timing.
  The loop fix in the widgets is what actually stopped the snap-back, and it stays.
- **New tests:**
  - unit: a height-only resize does not re-measure; a width change still does. The first fails on the old loader.
  - browser: "ignores phone toolbar resizes while scrolling up" on 202-08 and 202-09 (the window height alternates while scrolling). It fails on the old loader.
- **Suite:** QA; widget iframe 32; storage 47; assets 8; backup download 53, preview 75, restore 94; export 40; save feedback 41; 202-08/09 browser checks 26; review_eng 14; UX-001b; ENG-003 (installed Chrome) 10 of 11.
- **Not verified:** no iPhone Simulator is installed on this Mac, so this was not tested in real iPhone Safari. Dave to confirm on his phone.
