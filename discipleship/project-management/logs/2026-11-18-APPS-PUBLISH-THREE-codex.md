# APPS-PUBLISH-THREE: publish the approved companion apps

Date: November 18, 2026 (Dave's local date). Owner: Codex. Status: DONE, merged and production verified. Dave explicitly requested merging #261, #288 and #296 in dependency order and making Your Growing Apps live. This authorizes these reviewed app designs and publishing; it does not change lesson Gold/editorial stages.

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


## Phase 2 merged and live

PR #288 merged ata7e00fb5c005fd613cee7ecafa8a546db6c5364c from reviewed head292d3c82eade2c1bd4db754fa31a8e7d1d1d19a3. Local Weekly618, layout180 and hub244 pass; hosted hub244 passes. Exact preview homepage/hub/app HTML/JS/CSS and202-08 match source. All3 PR checks passed (run44338917844). Production apps hub returns200 and shows Daily Prayers and Weekly Connection Time.

## Phase 3: Heart52, PR #296

Retargeted #296 to main and merged published foundations ata7e00fb. Conflicts were only added tracking history in HANDOFF/TASKS/TEAM-BOARD and101-editorial-status; retained both histories, including the latest101 course-grade note. No lesson/app conflict. Current201-05 voice/contents changes merge cleanly: the only addition is its authorized Heart52 tool card. Current101-04 gains only its authorized optional link. Every other lesson JSON is identical to main; all questions/readings/art/widgets remain intact. Historical held-lesson notes do not undo already approved edits on current main.

Heart52 canonical and legacy source remain byte-identical to approved681aebe: original logo, blue theme, compact category row above the card, square controls for assignment and separate category links for deck navigation, with no backup/record-management UI. Daily/Weekly app sources, their root delivery copies, shared index.html, widgets and image assets match current main exactly. Source/legacy mirrors and protected-file/whitespace guards pass.

Foundation/export186/storage64/assets145/images1560/iframe32 and unit1780 pass. Card/calendar, general app, category, hub and final hosted checks are recorded on PR #296 before merge. Final production verification and tracking completion follow the third merge.


## Phase 3 merged and all three apps live

PR #296 merged at8793a4c9f44cc08447a76e7aa485cdaa17e1d287 from reviewed final head a6257719ed5017a08ccba07f041c9ac5e58bb380. Local Heart599, cards498, categories136 and hub340 passed on current-main integration. Hosted final-head hub340 passed; all3 PR checks passed (run44339849280), exact source bytes matched deployed preview, and PR was MERGEABLE/CLEAN. Both prior apps/shared homepage remain exact current main.

Main Firebase hosting run44340412613 succeeded at8793a4c; GitHub Pages run44340410800 also succeeded. On growingtogetherdiscipleship.com, HTTP200 and exact deployed-byte comparison passed for homepage, apps hub, all3 app HTML/JS/CSS, Heart learning/storage/data and101-03/101-04/201-05/202-08 lesson JSONs (18 files). Your Growing Apps is present on the custom-domain homepage under Browse All Lessons. The hub has all3 app links. No manual deploy, Firebase config, new account sync or billing change.

Production browser verification:
- COMPANION_BASE_URL=https://growingtogetherdiscipleship.com/index.html with companion_apps_browser_check.js:340 checks passed across phone/laptop/reduced motion, all3 app routes/return links, all4 linked lessons and preserved synthetic answers/prayers.
- HEART52_BASE_URL=https://growingtogetherdiscipleship.com with heart52_categories_browser_check.js:136 checks passed, including distinct box-versus-word actions, checks visible through flip, reload, scoped/empty decks, no management UI, unchanged foreign data and no errors/overflow.
- WEEKLY_BASE_URL=https://growingtogetherdiscipleship.com with weekly_connection_browser_check.js:314 checks passed, including original fields, autosave/reload, navigation, keyboard and storage-failure safeguards.
- BASE_URL=https://growingtogetherdiscipleship.com with daily_prayers_browser_check.js:147 checks passed, including original-key preservation, editing/generation, reload and storage/restore safeguards.

All browser data was synthetic and isolated; no real learner answers were accessed or changed. Daily and Weekly retain their approved copy tools; Heart52 retains its explicitly simplified automatic-save interface without downloads/backup/reset panels. Existing local/legacy records are not deleted, and no cross-origin migration is implied. Lesson stages/Gold approvals are unchanged.

## Completion

APPS-PUBLISH-THREE, APP-DAILY-PRAYERS, APP-WEEKLY-CONNECTION and APP-HEART52 are DONE. Dave explicitly authorized publishing these versions. The former preview-only state and stacked-PR dependencies are resolved; all3 PRs are closed/merged. Board, handoff, project state and Dave's approval queue are updated in a documentation-only completion commit on main. That commit does not alter the verified production application files.

Live destinations:
- https://growingtogetherdiscipleship.com/tools/
- https://growingtogetherdiscipleship.com/tools/daily-prayers/
- https://growingtogetherdiscipleship.com/tools/weekly-connection-time/
- https://growingtogetherdiscipleship.com/tools/heart52/
