# APPS-PUBLISH-THREE: publish the approved companion apps

Date: November 18, 2026 (Dave's local date). Owner: Codex. Status: ACTIVE integration. Dave explicitly requested merging #261, #288 and #296 in dependency order and making Your Growing Apps live. This authorizes these reviewed app designs and publishing; it does not change lesson Gold/editorial stages.

## Phase 1: Daily Prayers and homepage apps button, PR #261

Refreshed codex/daily-prayers-companion from 7feaa2d onto current main fb756d1 (approved lesson voice, contents and opener changes). Merge was clean. Reviewed app source and root MinistryBag delivery are byte-identical to 7feaa2d. The homepage diff is limited to the renamed Browse All Lessons button, matching Your Growing Apps link and supporting button styles; the current About button and account/recovery/lesson navigation remain intact. Every current-main lesson JSON matches except the authorized 101-03 tool URL becoming tools/daily-prayers/. No question/reading/image/widget/copy changes or new account sync.

Foundation QA, export186, storage64, asset145 and image1560 checks pass. Widget iframe, app/hub browser and final-head hosted results are recorded on PR #261 before merge. Mirror parity, full lesson comparison and whitespace guard pass. User's existing local prayer keys/unknown fields remain supported; no forced origin migration or storage deletion. Legacy MinistryBag URL remains a generated copy of the same app.

## Remaining order

After #261 passes final-head checks and merges, retarget #288 to main and merge current main into its branch. Preserve reviewed Weekly Connection Time bytes, and apply only its 202-08 tool card to the newest lesson. Then retarget #296 to main and preserve the latest simplified blue Heart52 UI at 681aebe while integrating the newest 201-05 text and approved 101-04 link. Do not resurrect any removed Heart52 backup/record interface. Verify the final homepage hub and all three apps on production before marking the publication task DONE.
