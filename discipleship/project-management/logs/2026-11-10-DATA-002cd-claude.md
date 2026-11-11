# DATA-002c and DATA-002d: private per-person answers that follow you (Claude)

Date: 2026-11-10
Branch: `claude/data-002cd-sync` (from `origin/main` after PR #115)

## Why
Dave signed in on his laptop, answered the first 201-01 question, then signed in on his phone and did not see it. That was expected after DATA-002b, which added sign-in only. He asked for 002c and 002d together.

## How it works
- **Account copy:**
  - Each signed-in person has three Firestore documents: `users/{uid}/stores/answers`, `completion` and `reading`.
  - Each holds `entries: { key: { v: value, t: time of the edit } }`, plus `updatedAt`.
  - The browser keeps saving to localStorage first, exactly as before, so nothing depends on the network.
- **Edit times:**
  - `scripts/answer-sync.js` stamps each key with the time it changed on this device.
  - The times are kept in `growingTogetherSyncMeta` in localStorage.
  - The stamping happens in `persistNamedStore`, so every existing save path is covered, including the periodic save.
  - Keys starting with `__` (the shared-key migration bookkeeping) never leave the device.
- **Signed in (`scripts/account.js`):**
  - Firestore listens to the person's three documents.
  - On each update, the newest edit wins, key by key. Answers saved before sync existed have no time, so they count as older than anything already in the account.
  - Local edits go up after a 1.5 second pause, so typing does not send a write per keystroke.
  - Waiting edits are sent when the page hides or closes.
  - Edits that never left (offline, page closed) go up on the next visit, because their times are newer.
- **First sign-in on a device:** the device's existing answers are added to the account. This is Dave's laptop case.
- **A different person on the same device:**
  - The device was last synced with another account, so it shows the new account's answers instead.
  - First it keeps a copy of what was there in `growingTogetherSyncSwitchBackup`.
  - The first person's answers never go into the second account. Signing back in brings them back from the first account.
- **Typing while an edit arrives:**
  - If the person typed in the focused box within the last 5 seconds, their text stays and saves again as the newest edit, so every device ends up the same.
  - Otherwise the arriving edit shows.
- **Backup restore:** a restore counts as a new edit, so the restored values win on other devices.
- **Never deleted:** nothing is removed from an account. The rules forbid deletes.
- **Home screen line:**
  - Signed out: "Sign in to keep your answers on all your devices."
  - Signing in: "Connecting to your account."
  - Then: "Your answers save to your account and show on every device where you sign in."
  - If Firestore cannot be reached: "Could not reach your account just now. Your answers are still saved on this device."
- **ministrybag.com:** none of this runs there. The tracker starts only where sign-in runs.

## Rules (DATA-002c)
`firestore.rules`:
- Read: only the owner, only those three documents.
- Create or update: only the owner, only those three documents, only the fields `entries` (a map) and `updatedAt`.
- Everything else is denied, including deletes, other collections and listing someone else's documents.

## Checked
All against the local Auth and Firestore emulators, with synthetic accounts only. The Firestore emulator needs Java; a Temurin JDK 21 was downloaded into the session scratchpad with Dave's OK, and nothing was installed system-wide.

- **`data002c_rules_check.js`: 18 passed, using two accounts.**
  - The owner can save and read all three stores.
  - The other person cannot read, change or delete them.
  - Someone signed out cannot read or write them.
  - No deletes, no other stores, no extra fields, `entries` must be a map, and nothing else is open.
- **`data002d_browser_check.js`: 18 passed on 3 of 3 runs.** A 1280 px "laptop" and a 390 px "phone" checked:
  - an answer typed before sign-in moves into the account on first sign-in;
  - the phone shows it after signing in;
  - a phone answer appears on the open laptop page without reloading;
  - the newer edit wins in both directions;
  - typing is not overwritten by an arriving edit, and then wins everywhere;
  - an offline phone edit arrives after reconnecting;
  - sign-out keeps answers on the device;
  - a second account on the phone sees none of the first person's answers, gets none of them in its account, and a copy is kept;
  - the first person's answers return when they sign back in;
  - a lesson check mark syncs;
  - no page errors.
- **`data002b_browser_check.js`: 28 passed.** It now expects the new home-screen wording and runs with both emulators.
- **Code tests:** `test_answer_sync.js` 39 passed and `test_account_helpers.js` 26 passed.
- **Unchanged checks:**
  - QA foundation;
  - storage 64, assets 8, widget iframe 32, save feedback 41, export 40;
  - backup restore 94, backup preview 75, backup download 53;
  - L-203-08 browser 34, review save recovery 20;
  - ENG-005, ENG-006b, ENG-006c, ENG-001 and SEC-001b browser checks.
  - ENG-001 and SEC-001b launch Playwright's own Chromium, which is not installed here, so they were run with the installed Chrome.

## Not done yet
- **Rules deploy:** the rules are not deployed. Deploying them changes the real project, so it waits for Dave's OK. The live site does not use Firestore yet, so deploying the rules alone changes nothing people see.
- **Preview link:** not made yet. It needs the rules first.
- **Real devices:** not tried. Dave should try his laptop and iPhone on the preview.
- **ministrybag.com:** pointing ministrybag.com/discipleship at the new address is the last part of DATA-002d. It waits until Dave is happy with sync.
- **Known limits:**
  - If someone restores a backup that is missing some answers, those answers come back from the account. Merge never deletes.
  - Firestore's free plan allows 20,000 writes and 50,000 reads a day. The 1.5 second pause keeps writes low, and that is ample before launch.

## Rules deployed and preview made, 2026-11-10

Dave said "deploy the rules and make the preview".
- `firebase deploy --only firestore:rules` released the per-person rules. A signed-out request for any user's answers now returns 403.
- `firebase hosting:channel:deploy data-002d --expires 7d` gave https://growing-together-discipleship--data-002d-uuf93prl.web.app (expires 2026-11-17).
- The preview loads with the sign-in block, starts the sync tracker, loads Firestore, and shows no console errors.
- The live site is unchanged: `scripts/answer-sync.js` returns 404 there.
- Each web address has its own browser storage. Answers typed earlier on growingtogetherdiscipleship.com are not visible on the preview address. They move into the account the first time the person signs in on growingtogetherdiscipleship.com after this goes live.

## Dave's test on real devices, 2026-11-10

Dave opened the preview on his laptop (Chrome) and his iPhone, and at first nothing synced.

The home line read "Sign in to keep your answers on all your devices." Sign-in belongs to each web address, so his sign-in on growingtogetherdiscipleship.com did not carry over to the preview address.

After he signed in on the preview on both devices, he reported: "it works now, both are syncing". This is the first real-device check of DATA-002d.

A debugging attempt through the Mac connector (screenshots, then one keystroke) set off macOS Accessibility and Privacy & Security prompts on Dave's screen. Dave was asked to cancel them, and the connector was not used further.
