# APP-HEART52: Growing Together companion

Date: November 17, 2026 (Dave's local date). Owner: Codex. Branch: codex/heart52-companion. PR: #296, targeting codex/weekly-connection-companion. Status: REVIEW, pending hosted preview and Dave's new UI review.

## Scope and result

Dave requested his first MinistryBag app inside Growing Together, alongside Daily Prayers and Weekly Connection Time, with stronger memorization and links in 201-05 and 101-04. This branch is based on Weekly Connection Time #288 at 6416cf4, which depends on Daily Prayers #261 at 7feaa2d. These remain unmerged review work. No lesson approval or account-sync approval is implied.

The authored app is discipleship/tools/heart52/, with a generated copy at the established root heart52/ address. Original SVG branding, all 52 original references/themes/passage strings and 52 existing v2 audio recordings are preserved verbatim. Some original excerpts deliberately end with a comma; these were not silently rewritten to match the v2 data. The v2 validator now reads the generated canonical data instead of expecting an inline HTML array. The v2 app itself remains unchanged.

The 640px warm-paper family provides a searchable passage library, Read & Listen, fewer-word/first-letter hints, phrase ordering, concealed typed or spoken recall, fair word comparison, and optional local-calendar review intervals. Reading/games do not fabricate recall attempts or mastery. Audio is lazy and stops when leaving its mode; explicit device voice is a fallback. All 52 passages can be practiced at the learner's pace.

Device-only progress uses heart52-progress-v1. Valid old heart52-v2-progress is read non-destructively; the original root app stored no persistent progress. Portable copies preserve unknown metadata. Invalid input and canceled restores are inert; failed restores roll back, corrupt records remain downloadable and unreadable storage cannot be silently overwritten. Reset affects only Heart52's new record/recovery, leaving old v2 and other app/lesson stores intact. No real learner data was used.

A third compact app button joins Your Growing Apps. 201-05 receives a single optional tool card after practice. 101-04 receives one brief optional link, with its editorial baseline updated only for that authorized addition. Removing those additions reproduces current origin/main lesson JSONs exactly, including all prose, Scripture, question objects/IDs, readings, images and widget placement. Existing Daily Prayers, Weekly Connection Time, index.html, widgets and images are byte-identical to the stacked base.

Claude's 201-05 voice rewrite PR #292 (b46d4e4) explicitly says hold/do not merge. It is untouched. The optional Heart52 card is portable to that later approved rewrite; this app packet grants no authority to merge it.

## Verification

- bash scripts/qa_foundation.sh: passed all foundation suites.
- node scripts/test_lesson_export.js: 186 checks passed.
- node scripts/test_answer_storage.js: 64 checks passed.
- node scripts/check_lesson_assets.js: 144 references resolve.
- node scripts/test_lesson_images.js: 1542 checks passed.
- node scripts/test_widget_iframe.js: 32 checks passed.
- TZ=America/Chicago node scripts/test_heart52.js: 299 checks passed, including exact original collection/audio, recall fairness, dates/DST, compatibility, recovery and foreign-data preservation.
- node scripts/build_heart52.js --check: source/legacy parity passed.
- node heart52-v2/tests/validate.mjs and python3 heart52-v2/tests/validate.py (root): both passed.
- HEART52_LEGACY_URL=http://127.0.0.1:8854/heart52/ node scripts/heart52_browser_check.js: 674 browser checks passed across canonical and legacy paths, 320/375/390/648-at-2x/1280 and reduced motion, all 52 rendered passages, actual audio, hints/phrase order/recall, review dates, keyboard, reload/copies/reset and seven failure/compatibility scenarios.
- GT_CHROMIUM_PATH=/usr/bin/chromium COMPANION_BASE_URL=http://127.0.0.1:8854/discipleship/index.html node scripts/companion_apps_browser_check.js: 340 checks passed for all three apps, synthetic six-row layout, both new lesson links and preserved synthetic lesson/prayer answers.
- Phone practice/recall and laptop library screenshots inspected. No horizontal overflow or page errors in the app suite.
- Exact-head Firebase preview at 3156c54118fd91e59082ab0ebed75c20ca42d1b4: all three PR checks passed (hosting run 44235489248). PR is OPEN/MERGEABLE/CLEAN against Weekly Connection Time base.
- Preview: https://growing-together-discipleship--pr296-codex-heart52-com-dl8mm33z.web.app/tools/heart52/
- Hosted Heart52 browser suite: 404 checks passed, including real narration, all 52 rendered passages, six viewport/motion combinations and seven compatibility/failure scenarios.
- HTTP 200 and byte parity verified for app HTML/JS/CSS/data, first/last MP3s, hub HTML and both lesson JSONs. No live deployment performed.
- Hosted hub/lesson-navigation suite: all 340 checks passed at 375/390/1280 and reduced motion, including both new lesson links and preserved answers.
- This final documentation update does not change the tested app, lessons, hub or runtime.

The check packet helper's extra iframe command was initially passed without its node prefix and exited 127; the explicit node scripts/test_widget_iframe.js rerun passed all 32. The keyboard browser test initially assumed the inactive Read tab changed the current mode on focus; corrected it to select Read before testing ArrowRight. No product shortcut was taken.

## Integration

Stop at REVIEW. Merge #261 and #288 only after their review gates; then retarget Heart52 onto main, keep concurrent lesson work and reverify. No Firebase config, billing, hosting workflow or manual deployment changes. New preview is reviewable; this task does not publish an unseen app.
