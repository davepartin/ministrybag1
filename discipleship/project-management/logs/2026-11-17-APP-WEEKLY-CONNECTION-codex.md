# APP-WEEKLY-CONNECTION

November 17, 2026 (America/Chicago). Codex, branch codex/weekly-connection-companion, isolated own worktree /workspace/ministrybag1-codex-compact-header. Status REVIEW, not merged or live. Dave requests Weekly Connection Time from MinistryBag/repo in Growing Together and linked from the marriage lesson, following Daily Prayers.

## Dependency and source

Daily Prayers/apps hub PR #261 was still open at cf32777. Refreshed it with main a6bb93f normally, preserving both documentation histories, all current compact headers/lesson navigation and exact Daily Prayers authored/delivery bytes. Foundation QA, mirror parity, 294 prayer checks and original 168 hub checks pass on refreshed 7feaa2d. The new weekly branch is based on that commit; its PR targets codex/daily-prayers-companion so the diff contains only this bounded weekly integration. Do not silently merge #261. After Dave reviews the new companion, integrate #261 first, retarget the weekly PR to main and verify current main before merging.

Authored weekly source lives under discipleship/tools/weekly-connection-time/. Root weeklyconnectiontime/ HTML/JS/CSS are generated from that source; existing logo, OG image and satchel assets are copied byte-identically. No new artwork is generated. Keep the MinistryBag route on its original origin so existing saved answers remain accessible. Add one same-origin hub button and one optional tool block after 202-08's practice paragraph. All existing 202-08 blocks, prose, Scripture, question objects/IDs, readings, widget and art remain exact. Daily Prayers bytes stay unchanged.

## Behavior and storage

Retain seven steps, twelve field IDs and connection_time_ storage keys. Narrow 640px layout, warm paper, brown shared header/MinistryBag logo, Back to marriage lesson, return to Your Growing Apps, quiet/reduced motion and keyboard controls. Existing copy/email/print behavior remains; email uses a native mailto link. Browser-only autosave, not Firebase/account sync. No automatic transfer between MinistryBag, Growing Together or previews. Explicit Save a copy / Restore a copy works across origins/devices with a versioned JSON file.

Opening saved answers does not write their fields or step. Blocked reads forbid writes to unread data; failed autosave keeps current edits visible and downloadable, announces Not saved and retries pending values on the next save. Restore validates all fields/version/step before a native confirmation dialog, retains a previous-check-in copy and rolls back partial persistence failures. Cancellation/malformed files are inert. Confirmed clearing touches only known app fields/step/recovery, retaining unknown keys and foreign stores. No credential or real learner data access.

## Actual checks

From discipleship, successful exits:

- bash scripts/qa_foundation.sh: all suites pass.
- node scripts/test_lesson_export.js: 186.
- node scripts/test_answer_storage.js: 64.
- node scripts/check_lesson_assets.js: 144.
- node scripts/test_lesson_images.js: 1542.
- node scripts/test_widget_iframe.js: 32.
- node scripts/build_weekly_connection.js --check and build_daily_prayers.js --check: exact authored/generated parity.
- WEEKLY_BASE_URL=http://127.0.0.1:8853/discipleship WEEKLY_LEGACY_URL=http://127.0.0.1:8853/weeklyconnectiontime/ GT_CHROMIUM_PATH=/usr/bin/chromium node scripts/weekly_connection_browser_check.js: 618 assertions, canonical and legacy at 375/390/1280/reduced motion, all original fields, raw-key preservation, seven-step summary, literal HTML text, copy/mailto/print, backups, invalid/cancelled imports, recovery, reload, scoped clear, unknown/foreign data, read/write failures and partial-restore rollback.
- COMPANION_BASE_URL=http://127.0.0.1:8853/discipleship/index.html GT_CHROMIUM_PATH=/usr/bin/chromium node scripts/companion_apps_browser_check.js: 244 checks for home/hub/both apps, synthetic six-app one-screen capacity, new marriage lesson link and answer persistence, return navigation and zero page errors.
- Full 202-08 JSON object compares identical after removing the one inserted tool block. Existing Daily Prayers authored and legacy files compare exact refreshed base. No unrelated lesson/widget/image changes. git diff --check passes.

Visual review caught and fixed inherited footer contrast and a mobile-hidden save-status label. After adding the longer second app name, synthetic six-row capacity overflowed by 3px on 375x667; trimming intro spacing 4px fixed it without reducing button touch targets or weakening the test. Screenshots inspected after animation settles. Source app questions remain unchanged; project files contain no added em dashes.

Local results are actual, not prior-PR claims. Final dependent PR number, exact-head preview/check status, hosted byte checks and browser results are recorded in the PR discussion. No deployment settings/workflows or automatic publication changes. Dave's new visual/wording review remains pending.

## Native navigation hardening

The first hosted hub run caught a startup race: the welcome markup was visible before the script rewrote production return links for the preview. Corrected authored HTML to native relative course/lesson/hub links. The mirror builder substitutes absolute Growing Together links only in the legacy MinistryBag HTML. Return links now work before JavaScript, including with scripts disabled; a noscript notice explains the interactive requirement. The latest local app suite passes 618 checks across both routes, including eight new native-link/no-script assertions; the full integration hub suite passes 244 again. App script/questions/storage behavior are unchanged by this fix. The initial hosted app-only run passed 310; hosted navigation evidence before the fix is superseded by the final-head rerun on PR #288.

## Dave laptop-margin follow-up

Dave reviewed the Chrome laptop preview and requested more comfortable margins in the conversation panel. Claiming the same packet for a CSS-only layout follow-up. Preserve all questions, field/storage behavior, routes and lesson content. Verify both a 1280px laptop and 648 CSS pixels at 2x density (matching the supplied screenshot), plus phone layouts.

Implemented 24px conversation-card padding on laptops and 16px side padding on phones, with a defined paper-card edge. Removed minimum heights inherited from the old desktop-sidebar layout. Kept extra phone bottom space so fixed Back/Continue controls do not cover the last fields or footer return link. Page width remains centered at 640px. The heading focus ring stays accessible inside the new insets. Only CSS/layout tests and coordination records change; all JS/data/questions remain exact prior head.

Local verification passes: weekly_connection_layout_browser_check.js 180 physical layout assertions at 375/390/648@2x/1280/1440 and reduced motion, all seven steps; weekly_connection_browser_check.js 618 app assertions across canonical and legacy routes; build_weekly_connection.js --check and git diff --check pass. Laptop 1280 and zoom-equivalent 648@2x Celebrate screenshots inspected. Final exact-head preview evidence and links are on PR #288. Status returns to REVIEW, not published.
