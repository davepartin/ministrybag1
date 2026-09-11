# ENG-001: unique runtime question keys and ambiguous shared-answer recovery
Date: 2026-09-11
Agent / reviewer: DiscipleshipBot / Cursor cloud agent
Status: ACTIVE
Branch: cursor/eng-001-answer-storage-6dbd
Base commit: d5c5533
Scope / files reserved: data/202-05.json, data/202-09.json, data/203-06.json, data/203-07.json, index.html save/load, scripts/answer-storage.js, scripts/test_answer_storage.js, scripts/qa_foundation.sh, this log, TASKS.md, HANDOFF.md

## Changes and decisions

Verified the baseline before editing: six shared runtime keys, three in each pair.
- 202-05 and 202-09 both used `201-09-key`, `201-09-devos`, `201-09-prayer` under the 202 course prefix.
- 203-06 and 203-07 both used `203-07-key`, `203-07-devos`, `203-07-prayer` under the 203 course prefix.

New stable JSON identities follow the existing `course-lesson-slot` pattern:
- 202-05: `202-05-key`, `202-05-devos`, `202-05-prayer`
- 202-09: `202-09-key`, `202-09-devos`, `202-09-prayer`
- 203-06: `203-06-key`, `203-06-devos`, `203-06-prayer`
- 203-07: kept `203-07-key`, `203-07-devos`, `203-07-prayer`

Migration (`scripts/answer-storage.js`) is the smallest compatible change:
- Old shared values are copied into `__gtAmbiguousSharedAnswers.items` with `status: ambiguous` and both candidate lessons listed.
- Those values are not copied into either lesson's new keys.
- For the 202 pair, the original `question-202-201-09-*` keys stay in place so the raw shared values remain recoverable.
- For the 203 pair, the old keys are also the live 203-07 identities. On first migrate, if 203-06 has no new values yet, the shared values are vacated from the live 203-07 keys so 203-07 does not silently claim them. If 203-06 already has new values, 203-07 live values are left alone.
- A `__gtSharedKeyMigrationV1` flag makes a second run a no-op, so later 203-07 answers are not vacated.
- Unrelated responses and established 101 / 201 keys are not rewritten.
- Already overwritten answers cannot be reconstructed. The remaining shared value is preserved as ambiguous only.
- Malformed or unavailable storage returns empty in-memory responses and does not throw.

Lesson theology, login, page layout, and other JSON files were not changed.

## Verification
Checks will be recorded after the first push. Planned commands:
- `node scripts/test_answer_storage.js` from `discipleship/`
- `bash scripts/qa_foundation.sh` from `discipleship/`
- Targeted browser reload/navigation if a local server is available

Checks not run and why: pending first implementation commit.
Known baseline failures distinguished from new regressions: missing images, iframe observer errors, export scope, save-failure UI, and SEC-001 remain out of scope.

## Handoff
Changed files: listed above.
Remaining work / next command: run synthetic checks, then mark REVIEW.
Blocker and unblock action, if any: none.
Commit / PR / GitHub sync state: pre-test implementation commit on the worker branch.
Pastoral approval evidence, if applicable: not required for this software repair.
