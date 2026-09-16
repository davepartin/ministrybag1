# SEC-001a: ESV credential inventory and removal plan

Date: 2026-09-16
Agent: Grok Build
Status: REVIEW
Branch: `codex/sec-001a-credential-plan`
Base commit: `de8ec7d` (`origin/main` after fast-forward; worktree originally created at `0894827`)
Parent task: SEC-001
Follow-on: SEC-001b (implementation). Do not start SEC-001b until ENG-006c reaches REVIEW, because both edit `discipleship/index.html`.

This packet is documentation only. No application code was changed. The ESV credential value is never reproduced here. Dave owns key revocation and any Git history rewrite.

After this worktree was created, `origin/main` recorded Dave's September 16 direction (DAVE.md, HANDOFF): stop the ESV API and put Scripture text in the lessons; agents may edit root `dailybiblereading/` for this fix; translation for the John chapters is still open. The inventory below is unchanged. The recommendation follows that direction rather than keeping an API or adding a proxy.

## 1. Current locations (HEAD)

A whole-tree scan for the current credential value found four lines. Two are inside `discipleship/`. Two are outside it, in the repository-root Daily Bible Reading app. The two `config.js` files are byte-identical.

| Path | Line | Inside `discipleship/`? | What it is |
|---|---|---|---|
| `discipleship/index.html` | 4785 | yes | Inline `ESV_API_TOKEN` assignment used by `fetchChapterESV()` |
| `discipleship/PROJECT-BRIEF.md` | 222 | yes | Documentation that repeats the live credential |
| `discipleship/dailybiblereading/config.js` | 4 | yes | `ESV_API_TOKEN` loaded by `index.html` before `script.js` |
| `dailybiblereading/config.js` | 4 | **no** | Same file as the discipleship copy, served as its own GitHub Pages app |

Related code that names the token or calls the API, but does not itself store the value on HEAD:

| Path | Lines | Notes |
|---|---|---|
| `discipleship/index.html` | 4783-4858 | `fetchChapterESV` posts `Authorization: ESV_API_TOKEN` to `https://api.esv.org/v3/passage/html/` |
| `discipleship/index.html` | 3627-3673 | `bible_reading` renderer; loading placeholder then fetch |
| `discipleship/dailybiblereading/script.js` | 411-465 | `fetchESVText`; comment says token is loaded from `config.js` |
| `dailybiblereading/script.js` | 411-465 | Identical copy, outside `discipleship/` |
| `discipleship/dailybiblereading/index.html` | 178-180 | Loads `config.js` then `script.js` |
| `dailybiblereading/index.html` | 178-180 | Same, outside `discipleship/` |

Both `config.js` files begin with the comment "DO NOT COMMIT THIS FILE TO GITHUB". They are tracked anyway. `dailybiblereading/.gitignore` and `discipleship/dailybiblereading/.gitignore` ignore only `.DS_Store`.

Docs and board rows that discuss the exposure without containing the value (not a leak, listed so SEC-001b does not treat them as credential files):

- `discipleship/project-management/reviews/2026-09-11-baseline.md` line 29
- `discipleship/project-management/TASKS.md` SEC-001 and SEC-001a rows
- `discipleship/project-management/HANDOFF.md` SEC-001a prompt
- `discipleship/AGENTS.md` (points at SEC-001)

`PROJECT-BRIEF.md` line 156 describes the `bible_reading` block as using "ESV API text". That sentence is accurate architecture, not a credential.

No other HEAD file in this worktree contained the current credential value. Lesson `verse` blocks store labeled ESV quotations in JSON and do not call the API. `heart52-v2/` ships bundled ESV memory passages and does not contain this credential.

Live GitHub Pages (`CNAME` is `ministrybag.com`) currently serves the same value. Boolean presence checks on 2026-09-16, without printing the value:

- `https://ministrybag.com/discipleship/index.html` (present)
- `https://ministrybag.com/discipleship/PROJECT-BRIEF.md` (present)
- `https://ministrybag.com/discipleship/dailybiblereading/config.js` (present)
- `https://ministrybag.com/dailybiblereading/config.js` (present)

## 2. Git history

Pickaxe search for the **current** credential value (`git log -S`, no patch, no values):

- Commit count: **2**
- `1f985b9` 2026-01-12 `new api again` (adds root `dailybiblereading/config.js`)
- `4c3671b` 2026-02-27 `Update discipleship app layout, curriculum, and sync repo changes` (adds the value to `discipleship/index.html`, `discipleship/PROJECT-BRIEF.md`, and `discipleship/dailybiblereading/config.js`)

Pickaxe search for the identifier `ESV_API_TOKEN` (name only): **4** commits. The extra two are earlier Daily Bible Reading work:

- `79c7a19` 2026-01-11 `esv update`
- `8a8a224` 2026-01-12 `esv audio and text working`

Those earlier commits used a **different** credential, inlined in `dailybiblereading/script.js`. A fingerprint of that older value is distinct from the current one. Pickaxe on the older value: **2** commits (`79c7a19` and `8e45d0d` 2026-01-12 `update api`). The older value is **not** in HEAD and was **not** present on the four live URLs checked above. It still exists in Git objects.

Implication for Dave, not for this worker: revoke **both** Crossway application keys that ever lived in this repository. Removing HEAD copies does not remove history. History rewrite is a separate, explicit Dave decision and is not part of SEC-001b.

## 3. What each use does, and what the learner sees if the key stops working

### Growing Together lesson quotations (`verse` blocks)

123 `verse` blocks already include `reference` and `text` in lesson JSON. They render without the API. If the key dies, these quotations still appear.

### Growing Together chapter reader (`bible_reading` in `index.html`)

Used only in 101-01 through 101-07: 21 chapter cards (John 1-21). Opening a card calls `fetchChapterESV`, which requests HTML and an audio link from `api.esv.org` with the browser credential.

Learner intent: read or listen to that week's John chapters inside the lesson, check "I've read ...", and keep notes. Notes and checkboxes are local and do not need the API.

If the key is revoked, rate-limited, or the request fails:

- `fetchChapterESV` does not check `res.ok`. A JSON body without `passages` shows "Text not available."
- A network or parse failure shows "Could not load text. Check your connection."
- The in-app audio control stays hidden if no `mp3link` is returned.
- The card, checkbox, and notes still work.

I did not call the API with the credential, so I did not verify today's live success or the exact Crossway error body.

### Daily Bible Reading app (root and `discipleship/` copies)

A 365-day reader. `config.js` supplies the credential. `fetchESVText` loads chapter HTML and builds an audio playlist from ESV `mp3link` URLs.

If the key stops working: "Text not available." or "Error loading text." Audio playlist entries are not added. Calendar, progress, and notes can still exist locally. This app has no bundled chapter text, so it is unusable as a reader without the API or a replacement.

`discipleship/dailybiblereading/` is a duplicate of the root app, not a lesson inside Growing Together.

## 4. Removal options on current hosting

Current hosting is static GitHub Pages with custom domain `ministrybag.com`. There is no GitHub Pages secret store that a browser script can use. A server-side route is **not** available in the current hosting environment. Adding one means adding a new service.

Crossway ESV API terms used for this comparison (from Crossway's published API conditions and `api.esv.org` authorization docs):

- Non-commercial church/ministry use, free
- 5,000 queries per day, 1,000 per hour, 60 per minute, throttled if exceeded
- At most 500 verses or half a book per query, per page, and in local storage (whichever is less)
- Standard ESV copyright notice and a link to `www.esv.org` on pages that show the text
- **You may not sell, share, or publish your access key**
- Authorization header form: `Authorization: Token <key>`

Publishing the key in Git and on Pages already violates the "do not publish your access key" rule. Quota is per key, so every learner share one limit.

### Option A. No-key fallback (link out, keep in-lesson quotations)

Remove the credential from all four HEAD files. Stop calling `api.esv.org` from the browser.

For `bible_reading` cards: keep heading, intro, checkbox, and notes. Replace the fetch with a clear message and an `esv.org` link for that reference (example pattern: `https://www.esv.org/John+1/`). Do not claim in-app audio.

For Daily Bible Reading: same link-out (or a short "open this day's passages on esv.org" list). Do not keep an empty `config.js` that invites a future key commit.

Lesson `verse` blocks stay as they are (already in JSON, within ordinary quotation practice).

| | |
|---|---|
| Cost | $0. No new host. |
| Privacy | Learner devices no longer send our published key. Opening esv.org is the learner's own visit. |
| ESV terms | Linking to esv.org is ordinary public access. Stops publishing a key. In-lesson quotations remain subject to the 500-verse / half-book / 25% work guidelines. Do not bundle John's 21 chapters into the repo; that would exceed local-storage limits. |
| Effort | Small. `index.html` fetch path, two `config.js` files, PROJECT-BRIEF, Daily Bible Reading fetch path. |
| Risk | Learners leave the app to read full chapters. In-app listen-along goes away. Daily Bible Reading becomes a plan-plus-links tool unless a later packet restores fetching. |

### Option B. Small serverless proxy (new service)

GitHub Pages cannot hold the secret. A Cloudflare Worker can.

Shape: Pages keep serving the static app. `fetchChapterESV` / `fetchESVText` call `https://<worker>.workers.dev/passage?q=John+1` (or a `ministrybag.com` worker route). The Worker reads a **new** Crossway key from a Cloudflare secret (`wrangler secret put`, or dashboard Variables and Secrets). It forwards to `api.esv.org` and returns HTML. The browser never sees the key.

Cloudflare Workers Free (documented limits at review time): 100,000 requests/day, 1,000 requests/minute, 10 ms CPU on the free plan, 64 combined vars/secrets per Worker. The secret lives only in the Cloudflare account, never in Git. Dave would create the account and paste the new key into the secret field.

Crossway's own cap (5,000 queries/day per key) is the tighter ministry limit, not Cloudflare's 100,000.

| | |
|---|---|
| Cost | $0 on the free Worker tier at expected church traffic, until Crossway or Cloudflare limits bite. |
| Privacy | Learner IPs hit Cloudflare, then Crossway. Worker logs need a retention decision. One shared key still identifies the ministry application, not a person. |
| ESV terms | Stops publishing the key, which is the required fix. Display, quota, notice, and non-commercial rules still apply. Reusing the **already published** key in the Worker does not make it secret; Dave must issue a **new** key after HEAD is clean. |
| Effort | Medium. New Worker repo or folder, CORS, caching policy that stays inside the 500-verse storage rule, deploy, and cutover of two apps. Outside current Pages hosting. |
| Risk | New vendor and 2FA. Free-plan CPU is short; HTML pass-through should fit but needs a measured check. If the Worker URL is guessed, it is an open proxy unless origin-restricted. Does not erase Git history. |

Netlify Functions (125,000 invocations/month on the free tier, secrets in Netlify env vars) could do the same job. It is also a new host. GitHub Actions cannot proxy live learner traffic.

### Option C. Licensed or bundled alternative

Three sub-paths, none of which keep the current browser key:

1. Bundle only the 21 John chapters used by 101. Crossway's API and quotation rules cap local storage at 500 verses or half a book. John is larger than that, so bundling the 101 plan as ESV text is not a compliant shortcut.
2. Keep ESV in `verse` blocks (short quotations) and use a public-domain translation (for example World English Bible) for in-app chapter reading. That preserves a reader without a secret. It breaks the project's "ESV for Scripture" template unless Dave records an exception for the chapter reader only.
3. Apply to Crossway for a formal license or a new API application that assumes a server. That is Option B plus paperwork, not a Pages-only path. API.Bible does not currently offer ESV.

| | |
|---|---|
| Cost | $0 for WEB; unknown/custom for a Crossway license. |
| Privacy | Bundled text never calls Crossway at read time. |
| ESV terms | Bundling John as ESV is the high-risk path. WEB avoids ESV API terms and loses ESV consistency. |
| Effort | Medium to high (content pipeline, copyright notices, Dave's translation decision). |
| Risk | Theological/voice drift if 101 chapters are not ESV. License delay if waiting on Crossway. |

## 5. Recommendation

**Do not keep the API. Do not add a proxy.** Dave already chose to drop the ESV API and put Scripture in the lessons. GitHub Pages cannot hide a browser secret, and the current credential is already public on `ministrybag.com`.

SEC-001b should remove every HEAD copy of the credential and stop all `api.esv.org` calls first, so the live leak ends. Lesson `verse` blocks already carry their text. For the 101 John cards (21 chapters, 879 verses) and the 365-day app, **do not embed ESV** until Dave either obtains Crossway written permission or chooses a different translation. Until that choice, open those chapters on `esv.org` so the app stays usable without violating the 500-verse / complete-book limit. After HEAD is clean, Dave revokes both Crossway keys that ever appeared in this repo. History rewrite remains a separate Dave decision.

## 6. Ready-to-paste SEC-001b packet

Start SEC-001b only after ENG-006c is in REVIEW or merged, and after Dave's translation choice for John (or an explicit "use esv.org links until then" instruction). Dave already authorized root `dailybiblereading/` for this fix. Default worker is Claude unless Dave names someone else. Do not start a history rewrite. Do not revoke keys from the agent session.

> You are the worker for SEC-001b in Growing Together, `discipleship/` in https://github.com/davepartin/ministrybag1. Read AGENTS.md, TASKS.md (SEC-001), DAVE.md (2026-09-16 SEC-001 decision), and `project-management/reviews/2026-09-16-SEC-001a-grok-build.md`. Fetch origin. Create a dedicated branch from current main after ENG-006c's `index.html` work is in REVIEW or merged. Do not overlap ENG-006c files until that is true.
>
> Absolute rule: never print, copy, quote, abbreviate, or partially reveal any ESV credential value in terminal output, files, commits, or replies. Refer to it only as "the ESV credential." Search with `grep -rln` or with output cut off before any value.
>
> Goal: remove the published browser credential and stop every `api.esv.org` call. Follow Dave's direction: no ESV API. Keep existing lesson `verse` JSON text. Do not embed the Gospel of John as ESV unless Dave has recorded Crossway written permission or has chosen a different translation. If that choice is not yet recorded, use esv.org links for chapter cards so the leak can end without waiting.
>
> Files (exact):
> - `discipleship/index.html` (remove the inline token; change `fetchChapterESV` / `bible_reading` open behavior; do not otherwise restyle the lesson)
> - `discipleship/PROJECT-BRIEF.md` (delete the credential line; describe the no-API chapter behavior)
> - `discipleship/dailybiblereading/config.js` (remove the credential; do not replace it with a new key)
> - `discipleship/dailybiblereading/script.js` and `index.html` as needed so a missing token cannot fetch
> - `dailybiblereading/config.js`, `dailybiblereading/script.js`, and `dailybiblereading/index.html` (Dave authorized this root folder for the SEC-001 fix; it is a live duplicate)
> - `discipleship/project-management/logs/YYYY-MM-DD-SEC-001b-<agent>.md`
> - TASKS.md only to claim and move SEC-001b / parent SEC-001 per coordinator rules
>
> Behavior:
> - Lesson `verse` blocks keep using JSON text. Do not strip existing quotations.
> - `bible_reading` cards keep heading, intro, checkbox, and notes. On open they must not call `api.esv.org`. If Dave has not yet chosen an embeddable translation, show a short fallback that names the reference and links to the matching `esv.org` passage. Hide or omit in-app ESV audio.
> - Daily Bible Reading must not request `api.esv.org`. Use the same link-out until Dave sets that app's direction. Do not leave a tracked `config.js` that still holds a token.
> - Keep ESV copyright notice where ESV text still appears.
> - No login, no Cloudflare Worker in this packet, no Git history rewrite, no key revocation.
>
> Acceptance checks:
> - `git grep` / a scripted scan for the previous credential value returns no HEAD matches. Confirm the staged diff the same way.
> - No `Authorization` header and no `ESV_API_TOKEN` assignment remain in tracked source.
> - `PROJECT-BRIEF.md` no longer stores a credential.
> - Foundation QA still passes: from `discipleship/`, `bash scripts/qa_foundation.sh`.
> - Synthetic notes and reading checkboxes on 101-01 still persist after reload.
>
> Browser test plan (local `python3 -m http.server` from `discipleship/`, 375 and 1280 widths; also open root `dailybiblereading/` if in scope):
> 1. 101-01: a `verse` quotation still renders from JSON with no network call to `api.esv.org` (DevTools).
> 2. Open John 1 card: no `api.esv.org` request; fallback text and esv.org link are visible and keyboard reachable; cancel/back does not lose the lesson.
> 3. Check "I've read John 1", type a synthetic note, reload: both survive.
> 4. Repeat John 21 on 101-07.
> 5. Phone-width: fallback and link remain readable; checkbox still works.
> 6. Daily Bible Reading day view: no credential file in the served page, no `api.esv.org` request, learner can still reach the day's passages via esv.org links.
> 7. Confirm `https://api.esv.org` does not appear as a successful authorized client call.
>
> Finish: commit with `[SEC-001b]`, push, open a PR titled "SEC-001b: remove browser ESV credential (REVIEW)", stop at REVIEW. Tell Dave the parent SEC-001 remains open until he revokes the Crossway keys. No em dashes.

## Dave decisions

Already recorded 2026-09-16 (DAVE.md): drop the ESV API; put Scripture text in the lessons; root `dailybiblereading/` may be edited for this fix.

Still needed from Dave (not taken by this worker):

1. Translation for the 101 John 1-21 cards: Crossway written permission to embed ESV, a different translation, or esv.org links until permission arrives.
2. Direction for the 365-day Daily Bible Reading app (link-out, different translation, or retire in-app fetch).
3. Revoke the current Crossway key, and the earlier key that still exists only in Git history.
4. Whether to rewrite Git history. Default: no, unless Dave orders it. Rewriting would not un-copy clones, forks, or the public Pages cache by itself.
