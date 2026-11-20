# UI-WIDGET-OPENING-CUES

Date: 2026-11-20
Agent: Codex
Status: ACTIVE
Branch: codex/widget-opening-cues
Base: 2c217a9

Dave authorized implementing the reviewed proposal. Add Love begins with God to201-01 and His love keeps moving outward to203-01. Fade for320ms, start drawing at340ms, skip transition under reduced motion. Repeated taps do not skip steps; returning to start restores cue. Existing201-02/202-01/other widget teaching and openings unchanged. Parent mobile-only pseudo-element supplies1px muted side lines without consuming layout space or intercepting input. No lesson JSON, images, questions, readings or saved-answer code changed.

Foundation QA, export212, storage73, assets144, images1593 and iframe32 checks pass.192 new embedded browser checks pass at375/390/1280, normal/reduced motion: initial cues, fade-before-draw, rapid taps, restoring/canceling via start dot, stable card/iframe height and scroll, phone-only boundaries, no overflow/page exceptions. Initial test found the203 dot handler ignored a tap on its already-active start dot during the pending fade; fixed that guard. Phone screenshots inspected at /workspace/scratch/opening-cues-{201,203}.png.

The broad historical widget_headers_browser_check.js inventory includes removed/replaced lesson embeds. Stopped that broad invocation and ran its unchanged checks filtered to the current201/202 shared-engine widgets from a scratch copy. Final results and hosted verification follow. An initial attempt to create the new script used a duplicated discipleship path from the app directory; corrected the path before running it.
