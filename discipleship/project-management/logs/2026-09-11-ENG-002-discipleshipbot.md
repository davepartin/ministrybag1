# ENG-002: Last Supper and foot-washing teaching pairs plus asset checks
Date: 2026-09-11
Agent / reviewer: DiscipleshipBot / Cursor cloud agent
Status: REVIEW
Branch: cursor/eng-002-missing-images-52ec
Base commit: dc14f625
Scope / files reserved: images/last-supper-bw.jpg, images/last-supper-color.jpg, images/jesus-washing-feet-bw.png, images/jesus-washing-feet-color.png, scripts/check_lesson_assets.js, scripts/test_lesson_assets.js, scripts/eng002_browser_check.js, scripts/qa_foundation.sh, this log, TASKS.md, HANDOFF.md. Lesson JSON paths were verified and not rewritten.

## Changes and decisions

Searched current tree and full git history for `last-supper*` and `jesus-washing-feet*`. Those four files were never committed. No matching originals were found elsewhere in ministrybag1. Recovery was not possible.

202-10 already pointed at `images/last-supper-bw.jpg` and `images/last-supper-color.jpg`. 203-04 already pointed at `images/jesus-washing-feet-bw.png` and `images/jesus-washing-feet-color.png`. Those references and alt texts were left unchanged because they already describe the intended scenes.

New charcoal teaching pairs were generated to match the existing Growing Together sketch style (loose ink, cream paper, restrained color). They are not recovered Dave originals.

- Created: Last Supper B&W/color pair for 202-10. Color master shows Jesus breaking the loaf at a simple upper-room table. B&W is a grayscale of that same composition so the scroll dissolve can register.
- Created: Foot-washing B&W/color pair for 203-04. Jesus kneels with a towel at his waist and a basin. Color adds a small water tint. B&W is a grayscale of the same composition.
- No generic placeholder images were added for missing teaching art.

Read-only asset checks now walk every lesson JSON for `src`, `image`, `imageBw`/`imageColor`, and `imageSequence`. Incomplete pairs, empty paths, and missing files fail. The checker never writes files.

### Dave lock
ENG-002 cannot be marked DONE until Dave:
1. Eye-checks both teaching pairs and accepts or rejects the generated charcoal art.
2. Confirms they read clearly on his phone, including the B&W-to-color dissolve.

## Verification
Exact command or browser action, result, and evidence path.

1. Inventory of all `src` / `image` / `imageBw` / `imageColor` / `imageSequence` lesson references before adding files: 66 references, exactly four missing (the 202-10 and 203-04 pairs). No other missing lesson assets.
2. `node scripts/test_lesson_assets.js` from `discipleship/`
   Result: recorded in the same work session after implementation.
3. `node scripts/check_lesson_assets.js` and `bash scripts/qa_foundation.sh` from `discipleship/`
   Result: recorded in the same work session after implementation.
4. `node scripts/eng002_browser_check.js` against `http://127.0.0.1:8765/index.html`
   Result: recorded after the local server check.

Checks not run and why:
- Real iPhone Safari was not available in this environment. Playwright used 390 x 844 and 1280 x 800. Dave's phone check remains required.
- Print, offline, and reduced-motion dissolve timing were not treated as this packet's acceptance gate.

Known baseline failures distinguished from new regressions: iframe observer errors, export scope, save-failure UI, 203-06 title/topic mismatch, 203-08 wrong content, and SEC-001 remain out of scope.

## Handoff
Changed files: four new teaching images, asset checker and tests, foundation QA hook, this log, TASKS.md, HANDOFF.md. Lesson theology, login, and ENG-003+ were not opened.
Remaining work / next command: reviewer verifies the diff and reruns `node scripts/test_lesson_assets.js` and `bash scripts/qa_foundation.sh` from `discipleship/`. Dave reviews artwork on a phone. Next implementation packet is ENG-003.
Blocker and unblock action, if any: DONE is blocked on Dave art and phone verification.
Commit / PR / GitHub sync state: worker branch `cursor/eng-002-missing-images-52ec`. Find this packet with `git log -- discipleship/project-management/logs/2026-09-11-ENG-002-discipleshipbot.md` from repository root.
Pastoral approval evidence, if applicable: not yet. Generated teaching art needs Dave's eye-check.
