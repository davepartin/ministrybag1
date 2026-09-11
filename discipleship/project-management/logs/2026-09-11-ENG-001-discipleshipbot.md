# ENG-001: unique runtime question keys and ambiguous shared-answer recovery
Date: 2026-09-11
Agent / reviewer: DiscipleshipBot / Cursor cloud agent
Status: REVIEW
Branch: cursor/eng-001-answer-storage-6dbd
Base commit: d5c5533
Scope / files reserved: data/202-05.json, data/202-09.json, data/203-06.json (203-07 IDs already correct), index.html save/load, scripts/answer-storage.js, scripts/test_answer_storage.js, scripts/eng001_browser_check.js, scripts/qa_foundation.sh, this log, TASKS.md, HANDOFF.md

## Changes and decisions

Verified the baseline before editing: six shared runtime keys, three in each pair.
- 202-05 and 202-09 both used `201-09-key`, `201-09-devos`, `201-09-prayer` under the 202 course prefix (`question-202-201-09-*`).
- 203-06 and 203-07 both used `203-07-key`, `203-07-devos`, `203-07-prayer` under the 203 course prefix (`question-203-203-07-*`).

New stable JSON identities follow the existing `course-lesson-slot` pattern:
- 202-05: `202-05-key`, `202-05-devos`, `202-05-prayer`
- 202-09: `202-09-key`, `202-09-devos`, `202-09-prayer`
- 203-06: `203-06-key`, `203-06-devos`, `203-06-prayer`
- 203-07: kept `203-07-key`, `203-07-devos`, `203-07-prayer`

The renderer still prefixes course ID, not lesson number. Unique JSON IDs are enough to stop the collisions without rewriting every stored key in the app.

### Migration behavior
`scripts/answer-storage.js` runs once on load (`__gtSharedKeyMigrationV1`).
- Old shared values are copied into `__gtAmbiguousSharedAnswers.items` with `status: ambiguous` and both candidate lessons listed.
- Those values are not copied into either lesson's new keys, so a lesson textarea does not claim a value we cannot attribute.
- For the 202 pair, the original `question-202-201-09-*` keys stay in place. They are no longer bound to a live field.
- For the 203 pair, the old keys are also the live 203-07 identities. On first migrate, if 203-06 has no new values yet, the shared values are vacated from the live 203-07 keys. If 203-06 already has new values, 203-07 live values are left alone.
- A second run is a no-op, so a later 203-07 answer is not vacated.
- Unrelated responses and established 101 / 201 keys are not rewritten.
- Malformed or unavailable storage returns empty in-memory responses and does not throw.

### Limitations
- A shared leftover cannot be assigned to one lesson. Both closing fields start empty after migrate unless a lesson already had its own new key.
- If one lesson overwrote the other before this repair, only the last shared value exists. This packet does not claim to recover the overwritten answer.
- 203-07 users who only ever answered on the old shared keys will not see that text in the 203-07 boxes. The value remains in `__gtAmbiguousSharedAnswers` and, for 202, on the original unused keys.
- Other copied IDs (for example 202-06 still using `201-05-*` JSON ids) were left alone. They do not collide at runtime with another lesson in the same course. The new all-course uniqueness check would fail if they did.
- Save-failure UI remains ENG-005. This packet only avoids throwing when storage is missing or rejects a write.

Lesson theology, login, page layout, and other JSON files were not changed. SEC-001 was not opened or reproduced.

## Verification
Exact command or browser action, result, and evidence path.

1. `node scripts/test_answer_storage.js` from `discipleship/`
   Result: 40 checks passed. Covered independent new answers, reload of persisted store, repeated migration, existing new values, malformed/unavailable storage, 101/unrelated preservation, and all-course uniqueness including checklist IDs.

2. `bash scripts/qa_foundation.sh` from `discipleship/`
   Result: all previous foundation checks passed, plus `PASS: all-course runtime question and checklist IDs are unique.`

3. `NODE_PATH=... node scripts/eng001_browser_check.js` against `http://127.0.0.1:8765/index.html`
   Result: 17 browser checks passed. Seeded synthetic old shared keys, confirmed they were not shown in 202-05/09 or 203-06/07, typed independent SYN-* answers, navigated, and reloaded.

4. Interactive browser walk of 202-05/09 and 203-06/07 with SYN-* text: independent fields, navigation, and reload held. No answer-storage console errors.

Checks not run and why:
- Real iPhone Safari, print, offline, and cross-device sync were not tested.
- No real learner store was opened. Recovery of an already overwritten answer cannot be demonstrated because that data is gone.

Known baseline failures distinguished from new regressions: missing images, iframe observer errors, export scope, save-failure UI, 203-06 title/topic mismatch, 203-08 wrong content, and SEC-001 remain out of scope and were not treated as ENG-001 failures.

## Handoff
Changed files: the scoped JSON IDs, answer-storage helpers, index.html load/save wiring, QA uniqueness check, targeted tests, this log, TASKS.md, HANDOFF.md.
Remaining work / next command: reviewer verifies the diff and reruns `node scripts/test_answer_storage.js` and `bash scripts/qa_foundation.sh` from `discipleship/`, then integrates. Next implementation packet is ENG-002.
Blocker and unblock action, if any: none for ENG-001.
Commit / PR / GitHub sync state: worker branch `cursor/eng-001-answer-storage-6dbd`; PR https://github.com/davepartin/ministrybag1/pull/10 awaiting review. Find this packet with `git log -- discipleship/project-management/logs/2026-09-11-ENG-001-discipleshipbot.md` from repository root.
Pastoral approval evidence, if applicable: not required for this software repair.
