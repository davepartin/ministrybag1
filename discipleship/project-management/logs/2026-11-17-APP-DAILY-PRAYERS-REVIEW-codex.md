# APP-DAILY-PRAYERS: Growing Together integration preview

Date: November 17, 2026. PR #261 / codex/daily-prayers-companion, own isolated worktree. Current base main: 70c977d (#283 approved 201-01 voice). Status: REVIEW, not merged/published.

## Dave's direction

Dave resumed Daily Prayers review, chose a walkthrough, then said "the app looks great" and requested it live within growingtogetherdiscipleship.com, with a Growing Apps section on home and access from related lessons. This authorizes expanding the original app-only packet to these entry/return links. The app look is approved; the new hub/navigation remains for review. User is separately editing 201-01 and #282; neither branch is edited here.

## Implementation

Daily Prayers lives at tools/daily-prayers/. The home page has a Growing Apps section with one available app, Daily Prayers. Its card links on the same site. The section has its own growing-apps hash for direct entry and return navigation; heading focus works from initial load and an already-open lesson. Existing course/navigation controls are preserved.

In data/101-03.json, only the tool URL changes from https://ministrybag.com/dailyprayers/ to tools/daily-prayers/. A full structured comparison confirms every other field/block/paragraph/question/reading/image/widget is unchanged. Baseline full/non-visual fingerprints reflect this explicitly authorized URL-only change; all other approvals and protected wording remain. No whole-lesson Gold inferred.

Canonical app header and footer return to the current site's home/apps section and prayer lesson, including on previews. The existing MinistryBag logo/attribution remains as Dave previously requested. No app style or prayer-generation wording changes. Existing storage keys, unknown metadata, recovery/restore safeguards and browser-local storage remain. The old MinistryBag app address stays available using generated copies of the same source. No redirect or automatic cross-origin data migration. The canonical backup section explains opening old prayers, saving a copy there and restoring here. No account synchronization, new Firebase services or workflow/config changes.

The new static app collection is not a personal account dashboard. Only Daily Prayers is included. Weekly Connection Time, other apps and MinistryBag homepage redesign remain separate future work.

## Verification

Pinned npm ci exit 0. Actual exits from discipleship are 0:

- bash scripts/qa_foundation.sh: all foundation suites.
- node scripts/test_lesson_export.js: 186.
- node scripts/test_answer_storage.js: 64.
- node scripts/check_lesson_assets.js: 144.
- node scripts/test_lesson_images.js: 1543.
- node scripts/test_widget_iframe.js: 32.
- node scripts/build_daily_prayers.js --check: four mirrors match maintained source.
- BASE_URL=http://127.0.0.1:8849/discipleship LEGACY_URL=http://127.0.0.1:8849/dailyprayers/ node scripts/daily_prayers_browser_check.js: 294 across both paths. Legacy prayer output and raw stores, autosave/reload, backup/restore and rollback, malformed/blocked storage, keyboard and 320/375/390/1280/reduced-motion coverage retained.
- GT_CHROMIUM_PATH=/usr/bin/chromium COMPANION_BASE_URL=http://127.0.0.1:8849/discipleship/index.html node scripts/companion_apps_browser_check.js: 140, home/app/lesson round trips, same origin including popup tool link, direct and in-page apps hashes, heading focus, existing prayer/unknown metadata unchanged, current lesson answers retained, migration instructions, no overflow/page errors.
- GT_CHROMIUM_PATH=/usr/bin/chromium NAV_BASE_URL=http://127.0.0.1:8849/discipleship/index.html node scripts/lesson_navigation_browser_check.js: 964 across all 37 published lessons, phone/desktop/reduced motion, Next/course boundaries/back/revisits, saved answers and reading notes.
- node --check tools/daily-prayers/app.js, structured preservation comparison, and git diff --check pass.

The new navigation test seeds the existing response migration markers so it checks a stable current answer store; core storage tests cover migration itself. Its initialization skips opaque about:blank frames and waits for actual heading focus after return navigation. No production storage code was changed to satisfy the fixture.

Phone/desktop home and editor screenshots inspected; synthetic data only. Exact-head Firebase preview and hosted verification evidence are posted on PR #261. No live change until review and merge.

## Dave navigation refinement

Dave requested renaming the home browse control to Browse All Lessons, placing Your Growing Apps immediately below it, and opening a separate single-page app list with a full-width Your Daily Prayers button. Replace the inline home app section with this hub. Keep the small collection ready for 3-6 apps without shipping placeholders. App/lesson data preservation and same-origin return links remain in force.

## Final navigation layout, replacing the inline section

Dave refined the home navigation to Browse All Lessons followed immediately by Your Growing Apps, with a separate page of full-width app buttons. Implemented this at tools/index.html and tools/apps.css, sharing the existing app's brand styles/logo. The sole available button reads Your Daily Prayers. The hub returns to courses, and Daily Prayers returns to this hub or 101-03 on the same site. No fake future apps are shipped. A test temporarily adds six rows to confirm they fit 375x667, 390x844 and 1280x800 screens, then removes them.

Removed the inline home card/section and custom growing-apps hash helper from the previous trial. All main-app script blocks now match origin/main exactly; only the home-control labels/link and matching-button CSS differ. Prayer lesson URL, protected baseline/content, actual prayer generator/storage and old MinistryBag compatibility copies remain as already documented. Changed the app's Growing Apps return target/label and regenerated mirrors.

Final local checks exit 0: foundation; export186; storage64; assets144; images1543; iframe32; mirror parity; new hub/round-trip168; existing all-37 lesson navigation964; existing Daily Prayers294 across both canonical and legacy paths. The first local browser launch needed the local server restarted after environment startup. A concurrent prayer-suite attempt also timed out waiting for a local page load; rerunning that suite on its own passed all294 without changing the app or assertions. Screenshots inspected for the matching home controls and compact app page. Main-app script equality, app/test syntax and whitespace checks pass.

The final hub test covers keyboard home entry, exact control ordering/labels, matching width/height/44px targets, separate same-origin hub, full-width app button, six-row capacity, shared logo, no sideways overflow, old prayer/unknown metadata and eight lesson answers retained through popup/return navigation, and no page exceptions. Reduced motion is included.

Final exact-head Firebase preview and hosted checks are posted on PR #261. APP-DAILY-PRAYERS remains REVIEW; no publishing approval is inferred for this new navigation layout.
