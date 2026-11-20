# UI-WIDGET-OPENING-CUES

Date: 2026-11-20
Agent: Codex
Status: DONE
Branch: codex/widget-opening-cues
Base: 2c217a9

Dave authorized implementing the reviewed proposal. Add Love begins with God to201-01 and His love keeps moving outward to203-01. Fade for320ms, start drawing at340ms, skip transition under reduced motion. Repeated taps do not skip steps; returning to start restores cue. Existing201-02/202-01/other widget teaching and openings unchanged. Parent mobile-only pseudo-element supplies1px muted side lines without consuming layout space or intercepting input. No lesson JSON, images, questions, readings or saved-answer code changed.

Foundation QA, export212, storage73, assets144, images1593 and iframe32 checks pass.192 new embedded browser checks pass at375/390/1280, normal/reduced motion: initial cues, fade-before-draw, rapid taps, restoring/canceling via start dot, stable card/iframe height and scroll, phone-only boundaries, no overflow/page exceptions. Initial test found the203 dot handler ignored a tap on its already-active start dot during the pending fade; fixed that guard. Phone screenshots inspected at /workspace/scratch/opening-cues-{201,203}.png.

The broad historical widget_headers_browser_check.js inventory includes removed/replaced lesson embeds. Stopped that broad invocation and ran its unchanged checks filtered to the current201/202 shared-engine widgets from a scratch copy. Final results and hosted verification follow. An initial attempt to create the new script used a duplicated discipleship path from the app directory; corrected the path before running it.

Shared-engine regression:604 checks pass across12 embedded201/202 cases, including saved answers. First preview run exposed a flaky intermediate-opacity assertion: browser scheduling can skip the sampled100ms point. Replaced that wall-clock assumption with synchronous checks of the waiting step and320ms CSS fade plus the existing eventual fully-hidden check. No implementation change was needed.

## Integration and live verification

PR #357 final headf3ed82b901b263b079868b327fc03145f47f2b84 passed all GitHub checks and CLEAN merge state. Firebase preview44796775221 succeeded.192 hosted opening checks pass; final-head index, shared engine and203 widget bytes match the tested application payload exactly (last commit only repaired test scheduling and recorded evidence). Merged0b4f9fbe33599e03d6d990111b09698c3d3c9f60.

Production Firebase44797004262 succeeded. Live index.html, widgets/great-command-v5.js and widgets/great-commission-203.html return HTTP200 with exact merged bytes.192 production opening checks pass at375/390/1280, normal/reduced motion. Both cues restore correctly, rapid taps do not skip, canceling the fade works, card/iframe heights and lesson scroll stay stable. Phone boundaries are1px with pointer-events:none; desktop has no new boundary.

Commands: GT_BASE_URL=<local,preview,production index.html URL> GT_CHROMIUM_PATH=/usr/bin/chromium node scripts/widget_opening_cues_browser_check.js. Filtered shared regression: same env and node /workspace/scratch/opening-shared-headers.cjs (604 checks across12 cases). Core QA captured in /workspace/scratch/OPENINGCUES-*.log; browser evidence /workspace/scratch/opening-cues-{browser,preview-browser,production-browser,shared-headers}.log. All lesson JSON, images, question identities and saved-data source are untouched. No further work remains in this packet.
