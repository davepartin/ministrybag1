# INTEGRATE-STUDIO-V5: approved course widgets

Date: November 13, 2026 (America/Chicago). Agent: Codex. Branch: codex/integrate-studio-v5. PR: 211. Status: REVIEW for technical integration.

Dave explicitly approved the three Studio Wash v5 widgets at bd7000ca40eb8a83514d1d25128cdd8465673f4f and requested wiring and merging. The four approved files remain byte-identical to that commit: great-command-v5-201.html, great-command-v5-202.html, great-command-v5-203.html and great-command-v5.js. No widget copy, visual design or animation change was made. Earlier cross engine/shells and guides in the PR remain as historical standalone artifacts; lessons point only to v5.

## Placement

- 201-01: replace great-command.html at its existing teaching position with great-command-v5-201.html. Preserve its initial 520px height and give its iframe a descriptive title.
- 202-01: add great-command-v5-202.html after the welcome/logo, immediately before the Samaritan image and story. Keep the image/story pair adjacent and keep the existing Cross the Road tool.
- 203-01: add great-command-v5-203.html after the welcome/logo and before On the Mountain. Keep the Personal Ministry Map tool.

Current main 69c358d, including the newer approved 201-05 and framework/story/skill edits, was merged before wiring. This integration preserves those changes. Claude's separate 202-01 editorial revision in PR202 remains open; it must retain this v5 intro when later integrated. This packet does not claim that pending prose has been published.

## Preservation and approval scope

Reversing only the new widget insertions and the 201 widget source/title restores each complete original lesson object. Raw-string insertion also preserves every existing paragraph, question/ID, Scripture, reading object and image stop literal byte-for-byte. Existing Cross the Road and Personal Ministry Map objects are unchanged. No stored answer migration, image map regeneration, lesson rewrite, Firebase setting or workflow change.

Recorded approval is for the v5 widget files at bd7000c, not a new whole-lesson or release approval. Placement was explicitly authorized by Dave's integration request.

## Independent checks

Fresh npm ci exit 0. Required foundation QA, export 177, storage 64, assets 127, lesson images 1368 and widget iframe 32 checks all exited 0.

Local Studio Wash browser review: 768 assertions passed across 18 cases (201/202/203 x 375/390/1280 x normal/reduced motion), exit 0. Every slide was checked for active state, card fit/stable height, responsive width, >=44px navigation, accessible SVG descriptions and completed reduced-motion state. Also verified Back, keyboard selection, Start Over, idle DOM and iframe stability, height-only resize stability, script query/version preservation, no widget storage writes, existing answer restoration, edited answer persistence, other-course answer retention and no widget HTTP/page errors. Original lesson prose renders and existing working tools remain. All three final phone screenshots inspected.

The portable committed regression command is:
GT_BASE_URL=<preview>/index.html GT_CHROMIUM_PATH=/usr/bin/chromium node scripts/studio_v5_browser_check.js
GT_SCREENSHOT_DIR is optional. Default browser is Chrome when no executable override is provided. Uses isolated contexts and synthetic answers only. No physical iPhone/Safari, sign-in/cloud sync, printing or learner pilot is claimed.

Exact-head preview and automatic deployment results will be attached to PR211 after the wired version is pushed. No manual deployment.
