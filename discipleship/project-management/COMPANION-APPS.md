# Companion apps in Growing Together

Daily Prayers is the first companion-app model. A lesson introduces a practice; the companion helps someone keep practicing after that conversation. Use a companion when it provides ongoing value, not just another illustration or a required detour through a lesson.

## Daily Prayers

One authored app lives in `tools/daily-prayers/`. Growing Together serves it at `/tools/daily-prayers/`. MinistryBag keeps the established `/dailyprayers/` address using generated delivery copies in the repository's root `dailyprayers/` folder. Both have the same interface and behavior, including the existing MinistryBag satchel logo. Reading and practice screens use the same 640px maximum content width as Growing Together, with one column on laptops and phones. Edit the authored files, then run:

```sh
node discipleship/scripts/build_daily_prayers.js
node discipleship/scripts/build_daily_prayers.js --check
```

Keeping the established MinistryBag address on its original origin is important: existing browser prayers remain accessible there. Do not redirect it to a new origin and claim the prayers will follow. Browser storage is separate for MinistryBag, Growing Together and every preview URL. Growing Together is the primary entry: the home page has Browse All Lessons followed immediately by Your Growing Apps, which opens the separate tools/ page. That page lists compact full-width app buttons, starting with Your Daily Prayers. Lesson 101-03 links directly to tools/daily-prayers/. Only that tool URL changes in the lesson; its wording and questions are unchanged. The app returns to the separate Your Growing Apps page and prayer lesson on the same origin, including preview sites. The MinistryBag logo remains an attribution link; the legacy address remains available for earlier saved prayers.

The app keeps the original `lordsPrayerApp` and `lordsPrayerApp_generated` keys and prayer wording. Loading does not rewrite either store. It opens an existing generated prayer verbatim; a saved editing preference reopens a draft. Edits save locally on input. Create Your Daily Prayer combines the selected growth areas, names and requests into the generated reading copy. Unknown legacy metadata is retained. Unreadable records remain untouched and can be downloaded as a raw recovery file.

Save a copy downloads a versioned JSON file with both the current draft and reading copy. Restore a copy validates that file and asks before replacing prayers. A recovery copy is saved before replacement, and failed writes attempt rollback. Copies contain personal prayer information; the app sends no names or requests to a server. Copy, Email and Print remain explicit user actions. Email opens the person's email application; it does not send automatically.

There is no account synchronization in this version. The interface explicitly says prayers are saved in this browser on this device. Saved copies can move prayers between browsers or origins. Clearing browser data can remove local prayers and recovery copies. Recovery JSON for unreadable data preserves the raw stores for diagnosis; it is not a normal import file.

## Moving existing MinistryBag prayers

The two domains cannot read one another's browser storage. After both updated addresses are deployed, open the old MinistryBag app, expand Keep a copy or move to another device, and choose Save a copy. In Growing Together Daily Prayers, expand the same tools and choose Restore a copy. Review and confirm the import. The copy includes the draft and generated prayer; the original remains on MinistryBag. The canonical app explains these steps inside its backup tools. No names or requests travel through the home page, a URL, or analytics.

## Your Growing Apps page

Maintain the small collection in tools/index.html, using one app-button anchor per ready app. The page shares Daily Prayers base styling and logo, with compact spacing in tools/apps.css. The layout is designed for 3-6 full-width buttons on one page; a six-row synthetic layout is checked on common phone and laptop screens. Do not ship placeholder app links. Keep app names personal and clear, beginning with Your Daily Prayers. Return to courses through the breadcrumb or Growing Together wordmark. No SPA routing changes are needed for this static hub.

## Pattern for later apps

Keep the teaching in the lesson and give its recurring practice a separate, phone-friendly place. Link back to the related lesson. Match the series' warm paper, brown header, clear typography, accessible controls and quiet motion. Avoid adding complexity merely to make a tool feel new. Preserve established links and data, and explain storage accurately. Use one maintained implementation per tool.

Each adoption needs a bounded task, data-preservation evidence, mobile/keyboard checks, and Dave's visual and wording review. Do not infer that approval of this app approves rewrites of other MinistryBag tools or lessons. Account sync, dashboards and broader app migration are separate assignments.

## Verification

Run the repository's required checks plus:

```sh
node scripts/build_daily_prayers.js --check
BASE_URL=http://127.0.0.1:8826/discipleship LEGACY_URL=http://127.0.0.1:8826/dailyprayers/ node scripts/daily_prayers_browser_check.js
```

Serve the repository root for that local example. A Firebase PR preview serves the canonical app under `/tools/daily-prayers/`; set BASE_URL to the preview origin and omit LEGACY_URL. The browser check uses only synthetic data, including output captured from the previous app as a golden fixture. It covers legacy loading, exact prayer output, autosave/reload, removals/Undo, literal text handling, copy/email/print, portable backups, cancellation and restoration, rollback, malformed records and unavailable storage.

The generated MinistryBag copies deploy with the repository's existing website publishing process after review and merge. The Growing Together copy uses the existing Firebase workflow. This work changes neither publishing configuration nor Firebase services.

## Proposed AAA rollout, November 16

Dave requested a common visual family for MinistryBag and Growing Together, with Weekly Connection Time connected to 202-08. This is the overview, not authorization to silently restyle every app or rewrite lessons.

| Piece | Role | Shared look and next step |
| --- | --- | --- |
| Growing Together lessons | Teach, discuss and choose a practice | Protect edited lesson text, question IDs, approved widgets and art. Add a short optional companion link where the practice naturally follows the teaching. |
| Daily Prayers / 101-03 | Turn names and requests into a daily prayer | First implementation: 640px content width, paper reading surface, brown header, blue actions, MinistryBag satchel/link, clear Create Your Daily Prayer action. Pending Dave's visual review on PR #261. |
| Weekly Connection Time / 202-08 | Help married couples practice regular listening, service and prayer | Preserve the existing seven moments and connection_time_ storage keys. Align the header, content width, controls and storage messaging in a separate packet. Add optional lesson access after Keeping the Vow. |
| MinistryBag home | Help someone find a useful tool | Use the same logo, colors, typography, cards and action language. Group existing tools by purpose and make Daily Prayers / Weekly Connection Time easy to find. A discovery card grid may be wider than the 640px reading/practice column. No homepage edits in this packet. |

### Weekly Connection Time findings

The existing app already has a seven-part marriage check-in: Set your rhythm, Celebrate, Look back, Look ahead, Serve, Pray and grow, Your question. It has saved progress, a summary, copy/email/print and a confirmed clear action. Keep those strengths. The app stores twelve individual fields and its current step under connection_time_ keys; those identities and existing MinistryBag origin must survive any polish. Its current localStorage reads/writes are not guarded against browser failure, so explicit storage-error handling belongs in its future implementation and verification packet. Review the existing device-only privacy wording for accuracy; do not imply account syncing or absolute privacy on a shared device.

202-08 already teaches covenant love, marriage and Every Season Can Be Faithful. Weekly Connection Time should be an optional companion for married couples, after Keeping the Vow and before question 8.3, not an additional required widget for every learner. The lesson's existing covenant triangle remains intact. Proposed tool-card wording for Dave's later review:

> Weekly Connection Time: For married couples, set aside time this week to listen, encourage one another, plan together and pray. Open Weekly Connection Time.

Use the established https://ministrybag.com/weeklyconnectiontime/ address first so existing check-ins stay accessible. Add a return link to 202-08 in the app when its own packet is built. Preserve the lesson's welcome to single, dating, engaged, divorced and widowed learners; the companion must not become a requirement to finish the lesson. No 202-08 lesson edit or Weekly Connection Time app change has been made in the Daily Prayers packet.

### What AAA should mean for companion tools

A person can explain the tool's purpose in one sentence, recognize the next action and use it comfortably on a phone. The app supports a recurring practice without repeating the lesson or adding unnecessary proof texts. Visual consistency comes from the shared frame and readable proportions, while useful differences in the tools remain. Existing data, names and links survive. Saved status tells the truth. Keyboard, reduced motion, small screens, recovery, and preview verification pass. Dave approves the appearance and wording before publication, and that approved component is then protected from unsolicited redesign.

Recommended order: finish Daily Prayers review; adapt and verify Weekly Connection Time as its own job; add its optional 202-08 card with Dave; then polish the MinistryBag discovery page and assess the remaining apps one at a time. Account sync and a shared dashboard remain separate decisions.

## Weekly Connection Time implementation, November 17

REVIEW: Dave requested this app as the next companion. Its maintained source is tools/weekly-connection-time/. Run `node scripts/build_weekly_connection.js` to update root weeklyconnectiontime/ delivery copies; `--check` verifies parity. Never redirect the original MinistryBag route: its connection_time_ answers belong to that origin. The canonical app offers an explicit link to the old check-in and portable copies for transfer. Browser data does not sync to accounts/Firebase or between devices.

Twelve existing fields and all seven conversation steps are retained. The shared apps hub has a second full-width button, and 202-08 has an optional tool card within the practice section. Styling matches the existing 640px companion family. Blocked reads prevent overwriting unread data; failed writes retain the current screen, display Not saved and permit downloads. Restore validates a versioned copy, requires confirmation, keeps a previous-check-in recovery copy, and rolls back partial writes on failure. Confirmed clearing removes only the app's known fields/step/recovery; unknown keys and other app/lesson stores remain intact.

Browser verification: `WEEKLY_BASE_URL=http://127.0.0.1:8853/discipleship WEEKLY_LEGACY_URL=http://127.0.0.1:8853/weeklyconnectiontime/ node scripts/weekly_connection_browser_check.js` and `COMPANION_BASE_URL=http://127.0.0.1:8853/discipleship/index.html node scripts/companion_apps_browser_check.js`. Use system Chromium. New app styling and its short optional lesson-card wording await Dave's review. This packet is dependent on Daily Prayers/apps hub PR #261 and does not publish or merge either PR implicitly.


## Heart52, November 17, 2026

Authored source: `tools/heart52/`. Run `node scripts/build_heart52.js` from discipleship (or `node discipleship/scripts/build_heart52.js` from the repository root) after source edits; `--check` verifies the generated MinistryBag `heart52/` delivery. Do not edit generated files independently. Original logo, all 52 passage references/themes/text, and the existing v2 MP3 recordings are preserved. The original inline app had no persistent progress; valid `heart52-v2-progress` records are read without changing the old key. The new browser key is `heart52-progress-v1`.

Read & Listen, gradual word hints, phrase ordering, concealed recall and optional 1/3/7/14-day reviews form one small practice flow. Capitalization and punctuation are not graded. Self-reported spoken practice has no invented typed score. There is no streak penalty or automatic claim of mastery. Review dates use the learner's local calendar. Audio is requested only after a learner chooses Listen; failed recordings offer explicit device-voice fallback where supported.

Save/restore copies, recovery downloads and truthful storage-failure notices follow the companion family. Browser/device storage is separate across MinistryBag, previews and Growing Together; no Firebase/account sync or automatic cross-origin transfer. Root Heart52 remains available, without a forced redirect. 201-05 has one optional tool card; 101-04 has one short optional link. Every existing paragraph, question/ID, reading, widget and image stays intact. Claude's held 201-05 rewrite PR #292 is separate; carry the small optional tool card forward when it is approved.

New Heart52 UI is REVIEW, not approved for publication. Dependency order: Daily Prayers #261, Weekly Connection Time #288, then the Heart52 PR. Do not merge the held 201-05 rewrite to satisfy this task.
