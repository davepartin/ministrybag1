# APP-DAILY-PRAYERS: Codex, November 16, 2026

Status: REVIEW. Branch: codex/daily-prayers-companion. Base: aa134c558c7c439c479923925f45efeed2a6d9dd. Claim: 077c54f6. Dave requested polishing Daily Prayers first as the model for companion apps; this explicitly expands scope to the repository's /dailyprayers/ app. New visual design and interface wording need Dave's review before merge. No whole-lesson approval is inferred.

## Result

Built one authored companion under discipleship/tools/daily-prayers/ with generated delivery copies at the established MinistryBag /dailyprayers/ address. The original MinistryBag origin remains available so its browser storage is still accessible. The Firebase preview serves /tools/daily-prayers/. No redirect or automatic cross-origin migration is introduced. Existing 101-03 lesson wording/link remains unchanged.

The warm paper reading view opens existing generated prayers verbatim. Edit my prayers opens four sections for personal growth, family/others, church, and people to know Jesus. Edits save on input, including church requests missed by the original app's listeners. A draft reopens in the editor; Read my prayers updates the reading copy. Growth buttons use native pressed states, fields have labels, controls support keyboard and phone use, focus moves to the new view heading, and reduced motion is respected. Copy, Email and Print remain available.

Save a copy downloads a versioned JSON draft/reading snapshot; restore validates, previews and requires confirmation. A pre-restore recovery copy is retained; partial restore failures attempt rollback. Remove person has Undo. Malformed legacy data is never silently overwritten and can be downloaded raw. Storage read/write failures surface clearly and preserve open work for download. Data stays in this browser on this device. There is no account sync, server-side prayer storage or request/name analytics in this packet.

Original generated wording, growth choices, church prayer, Lord's Prayer display and email text are preserved. The regression golden fixture was captured by running the previous app with synthetic names/requests. Unknown legacy metadata is retained. No real learner data was accessed, copied or committed.

## Boundaries

No lesson JSON, discipleship/index.html, reading key, question object/ID, saved-answer implementation, Gold content, existing widget or artwork changes. Existing dailyprayers/ministrybagsatchel1.svg remains on disk. No dependency additions, Firebase settings, billing, retention, workflows or manual deployment changes. MinistryBag mirrors are generated from one source; build_daily_prayers.js --check detects drift. See COMPANION-APPS.md for the model and maintenance instructions.

## Local verification

Pinned npm ci: exit 0, 11 packages.

All commands run from discipleship/ unless otherwise specified. Actual exit codes checked:

- bash scripts/qa_foundation.sh: exit 0, all foundation QA checks pass.
- node scripts/test_lesson_export.js: exit 0, 186 checks.
- node scripts/test_answer_storage.js: exit 0, 64 checks.
- node scripts/check_lesson_assets.js: exit 0, 139 references resolve.
- node scripts/test_lesson_images.js: exit 0, 1485 checks.
- node scripts/test_widget_iframe.js: exit 0, 32 checks.
- node scripts/build_daily_prayers.js --check: exit 0, all three mirrors match.
- LEGACY_URL=http://127.0.0.1:8826/dailyprayers/ node scripts/daily_prayers_browser_check.js: exit 0, 270 assertions across both hosted paths.

Browser coverage: 320/375/390/1280 widths; reduced motion; literal existing-prayer loading and unchanged raw stores; exact legacy generator and Lord's Prayer; unknown metadata; autosave before blur/reload; remove/Undo; names as literal text; copy/email/print; versioned downloads; invalid/unsupported imports; Cancel/Escape; confirmed restore; recoverable previous copies; mid-restore write failure rollback; malformed records; quota failure; denied reads without overwriting existing stores; older partial family records; native labels, 44px growth controls and keyboard toggle/focus; no horizontal overflow or browser errors on the main workflows. Both generated and canonical app paths are exercised.

Phone/desktop screenshots inspected locally for both reading and editing. Synthetic data only. The final PR comment records exact-head Firebase deployment and hosted-browser results after the Action finishes. This packet stops at REVIEW, not DONE, because Dave has not yet reviewed the new visual design and interface wording. The existing live app stays unchanged until that review and merge.

## Dave follow-up: clearer action and common proportions

Dave requested that the generate action describe creating the prayer, that the app match Growing Together's width, and that the MinistryBag link include its logo. Updated the visible submit action to Create Your Daily Prayer; retained the existing DOM ID and generation/storage behavior. Matched the lesson app's --max-w: 640px with a 640px companion container/header, a single reading column and proportionate heading size. Added the existing MinistryBag satchel logo byte-identically beside its link and to the single-source build's asset list. No existing logo/artwork was redrawn. Initial 320/390/1280 measurements show no horizontal overflow and 640px maximum desktop main width. Browser regression now also asserts the action label, width cap and loaded logo.

Expanded COMPANION-APPS.md with the proposed AAA rollout for the MinistryBag home and Weekly Connection Time / 202-08, based on the existing app and current lesson. The seven moments and connection_time_ stores should be preserved, with storage failures handled explicitly in a future packet. Proposed an optional tool card after Keeping the Vow, retaining Every Season Can Be Faithful and the approved covenant widget. This follow-up does not edit the homepage, Weekly Connection Time or any lesson JSON.

Follow-up repository suite: foundation, export 186, storage 64, assets 139, images 1485, iframe 32 and four-file mirror parity all exit 0. Expanded local browser regression: 294 assertions, exit 0. Mobile and laptop screenshots inspected at 320/390/1280. Final-head check and preview results for this follow-up are recorded on PR #261. Status remains REVIEW for Dave's visual approval.
