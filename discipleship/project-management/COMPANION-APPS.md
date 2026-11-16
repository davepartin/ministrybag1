# Companion apps in Growing Together

Daily Prayers is the first companion-app model. A lesson introduces a practice; the companion helps someone keep practicing after that conversation. Use a companion when it provides ongoing value, not just another illustration or a required detour through a lesson.

## Daily Prayers

One authored app lives in `tools/daily-prayers/`. Growing Together serves it at `/tools/daily-prayers/`. MinistryBag keeps the established `/dailyprayers/` address using generated delivery copies in the repository's root `dailyprayers/` folder. Both have the same interface and behavior. Edit the authored files, then run:

```sh
node discipleship/scripts/build_daily_prayers.js
node discipleship/scripts/build_daily_prayers.js --check
```

Keeping the established MinistryBag address on its original origin is important: existing browser prayers remain accessible there. Do not redirect it to a new origin and claim the prayers will follow. Browser storage is separate for MinistryBag, Growing Together and every preview URL. The existing 101-03 link still points to MinistryBag; lesson wording and questions are unchanged in this packet.

The app keeps the original `lordsPrayerApp` and `lordsPrayerApp_generated` keys and prayer wording. Loading does not rewrite either store. It opens an existing generated prayer verbatim; a saved editing preference reopens a draft. Edits save locally on input. Read my prayers updates the generated reading copy. Unknown legacy metadata is retained. Unreadable records remain untouched and can be downloaded as a raw recovery file.

Save a copy downloads a versioned JSON file with both the current draft and reading copy. Restore a copy validates that file and asks before replacing prayers. A recovery copy is saved before replacement, and failed writes attempt rollback. Copies contain personal prayer information; the app sends no names or requests to a server. Copy, Email and Print remain explicit user actions. Email opens the person's email application; it does not send automatically.

There is no account synchronization in this version. The interface explicitly says prayers are saved in this browser on this device. Saved copies can move prayers between browsers or origins. Clearing browser data can remove local prayers and recovery copies. Recovery JSON for unreadable data preserves the raw stores for diagnosis; it is not a normal import file.

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
