# APP-DAILY-PRAYERS: refreshed collaborative review

Date: November 17, 2026. PR #261 / codex/daily-prayers-companion, own existing isolated worktree. Status: REVIEW, not merged or published.

Dave is separately working on 201-01 and PR #282. He asked Codex to work with him on Daily Prayers now and chose "Walk through it from the beginning". No design/wording approval is inferred from this request.

## Refresh and preservation

Merged current main efbd2b4 normally. Only HANDOFF, TASKS and TEAM-BOARD append blocks conflicted; kept both histories. All canonical Daily Prayers files and root MinistryBag delivery files remain byte-identical to b181bd1749d35fb4bc49d0d28272904c2dc7612e. Existing prayer wording and legacy storage schema stay unchanged. Create Your Daily Prayer, 640px reading width, satchel link and removed decorative hero line remain.

No lesson JSON, main app runtime, 201-01, jump-link work, widgets, artwork, dependency or Firebase configuration changes. Companion-app style and Weekly Connection Time documents remain proposals; neither the MinistryBag homepage nor Weekly Connection Time is implemented by this packet. No real prayer names/requests were accessed; all browser checks use synthetic data in isolated contexts.

## Verification

npm ci: exit 0. From discipleship, all actual exits 0:

- bash scripts/qa_foundation.sh: foundation suites pass.
- node scripts/test_lesson_export.js: 186.
- node scripts/test_answer_storage.js: 64.
- node scripts/check_lesson_assets.js: 144 references.
- node scripts/test_lesson_images.js: 1543.
- node scripts/test_widget_iframe.js: 32.
- node scripts/build_daily_prayers.js --check: all four mirror files match.
- BASE_URL=http://127.0.0.1:8849/discipleship LEGACY_URL=http://127.0.0.1:8849/dailyprayers/ node scripts/daily_prayers_browser_check.js: 294 across both hosted paths, legacy prayer/unknown metadata preservation, autosave/reload, backup/restore rollback and blocked storage, keyboard, phone/desktop/reduced motion, and no horizontal overflow/browser errors.

First-time editor screenshots inspected at 390 and 1280. The new preview at 648ece103a94441ead541f72af2bf53ffdebce7a deployed successfully via Action 44170359544. All four canonical hosted files returned HTTP 200 and matched the reviewed source exactly. Final refreshed preview/browser evidence is posted on PR #261; source app bytes do not change in this tracking update.

## Walkthrough start

Open /tools/daily-prayers/index.html. New visitors start in the editor. Returning visitors with a generated prayer may start in the reading view; Edit my prayers returns to the editor. Start with Pray for myself, select one or two growth areas and optionally add a specific request. The following sections cover family/others, church, and people to know Jesus; Create Your Daily Prayer assembles the reading view. These are review instructions, not new app copy or a publishing decision.

## Authorized same-site integration

Dave: "the app looks great" and requested the app live in the Growing Together domain, with Growing Apps access from the home page and related lessons. This authorizes expanding this packet to a home-page Growing Apps section, the 101-03 tool URL only, and companion return navigation. Approved 101-03 wording/questions/readings/art/widget remain protected. Start with Daily Prayers; no new Weekly Connection Time implementation or lesson changes. Preserve old MinistryBag storage/origin and provide the existing save/restore route for moving prayers. No redirect, automatic cross-origin migration or account synchronization is implied. New hub/navigation preview remains for Dave's review before publishing.
