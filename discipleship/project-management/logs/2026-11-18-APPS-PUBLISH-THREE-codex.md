# APPS-PUBLISH-THREE: publish the approved companion apps

Date: November 18, 2026 (Dave's local date). Owner: Codex. Status: ACTIVE integration. Dave explicitly requested merging #261, #288 and #296 in dependency order and making Your Growing Apps live. This authorizes these reviewed app designs and publishing; it does not change lesson Gold/editorial stages.

## Phase 1: Daily Prayers and homepage apps button, PR #261

Refreshed codex/daily-prayers-companion from 7feaa2d onto current main fb756d1 (approved lesson voice, contents and opener changes). Merge was clean. Reviewed app source and root MinistryBag delivery are byte-identical to 7feaa2d. The homepage diff is limited to the renamed Browse All Lessons button, matching Your Growing Apps link and supporting button styles; the current About button and account/recovery/lesson navigation remain intact. Every current-main lesson JSON matches except the authorized 101-03 tool URL becoming tools/daily-prayers/. No question/reading/image/widget/copy changes or new account sync.

Foundation QA, export186, storage64, asset145 and image1560 checks pass. Widget iframe, app/hub browser and final-head hosted results are recorded on PR #261 before merge. Mirror parity, full lesson comparison and whitespace guard pass. User's existing local prayer keys/unknown fields remain supported; no forced origin migration or storage deletion. Legacy MinistryBag URL remains a generated copy of the same app.

## Remaining order

After #261 passes final-head checks and merges, retarget #288 to main and merge current main into its branch. Preserve reviewed Weekly Connection Time bytes, and apply only its 202-08 tool card to the newest lesson. Then retarget #296 to main and preserve the latest simplified blue Heart52 UI at 681aebe while integrating the newest 201-05 text and approved 101-04 link. Do not resurrect any removed Heart52 backup/record interface. Verify the final homepage hub and all three apps on production before marking the publication task DONE.


## Phase 1 merged and live

PR #261 merged at9c4f3d5795983dda067fd7f8898a6bc94fd71213 from reviewed head ddebf945ba5d34baef1a2f8cee888a4e8ff0b5ad. All3 PR checks passed, hosted hub168 and local prayer294/hub168 pass. Exact deployed preview homepage/hub/app HTML/JS/CSS and101-03 JSON match source. Main hosting run44338525621 succeeded; custom-domain root, cache-busted root and default Firebase host all return200 with Your Growing Apps present. No manual deployment/config changes.

## Phase 2: Weekly Connection Time, PR #288

Retargeted #288 to main and merged current main9c4f3d5 into the branch. Conflicts affected only HANDOFF/TASKS/TEAM-BOARD additions; retained both histories and the publication claim. No lesson or app conflict. Approved canonical/legacy app bytes remain exact6416cf4, including laptop margins and phone fixed-control spacing. Every current-main lesson JSON matches after removing the one authorized202-08 tool card. Newer contents, questions, readings, story image and triangle remain unchanged. Daily Prayers and the current homepage are inherited from merged main.

Foundation/export186/storage64/assets145/images1560/iframe32, mirror parity, protected-file and whitespace guards pass. Final app/hub/layout and hosted results are recorded on PR #288 before merge. Publication remains ACTIVE until all3 apps are integrated and checked live.
