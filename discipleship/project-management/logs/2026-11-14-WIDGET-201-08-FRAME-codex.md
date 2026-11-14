# WIDGET-201-08-FRAME

Dave approved the 201-08 Grace and Mercy Cycle Studio Wash frame at 1404ab8 in PR #238. Diagram artwork, colors, step text, Scripture and lesson JSON remain unchanged. Integration found and corrected only the sizing helper: measure the tray content width without its horizontal padding, so the long grace card no longer moves the navigation by 22px. All approved frame styling remains unchanged. This is component approval, not whole-lesson or image approval.

Exact technical exception to approved HTML: the old area.clientWidth included the tray padding, underestimating wrapped card height (163/185px in the initial supplied browser check). Subtracting computed left/right padding is the sole runtime delta from 1404ab8. A reversal comparison proves every other byte unchanged. No data, index, image or other widget changes.

Verification, actual exits 0 after correction: npm ci; foundation; export 186; storage 64; assets 128; images 1366; iframe 32; supplied frame browser at 390/375/1280 and reduced motion; ENG-003 browser. The ENG-003 harness previously compared parent/child bounding boxes across automatic focus scrolling; it now checks the button against its own iframe viewport in one synchronous measurement, retaining the clipping assertion. This removes a false positive without changing production behavior. Supplied fixture supports remote URLs and favicon 204. Inline script parses. Approved-source comparison and exact preview/live evidence belong on PR #238.

Integrated widget SHA256: 3ff79d55a2b12f2636ea9f924938cb7e1d4b543a1ed0066b48ba56caa8bcd089
