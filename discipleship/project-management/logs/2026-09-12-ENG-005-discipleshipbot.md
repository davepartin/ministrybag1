# ENG-005: truthful save feedback and safe recovery
Date: 2026-09-12
Agent / reviewer: DiscipleshipBot / Cursor cloud agent
Status: REVIEW
Branch: cursor/eng-005-save-feedback-2d2c
Base commit: fef7841b494574a9a0ef6c198fdec04c6007152d
Scope / files reserved: save-status helpers and host wiring in scripts/save-feedback.js, scripts/test_save_feedback.js, scripts/eng005_browser_check.js, scripts/qa_foundation.sh, index.html persist/status UI, this log, TASKS.md ENG-005 row. Did not edit data/202-08.json, data/202-09.json, login, lesson prose, or ENG-006 backup/import.

## Changes and decisions

Saved is returned only after a successful write. An input event or the 30-second timer can start Saving; they cannot mark Saved by themselves.

Questions, checklists, and commitments persist through the answers store. Lesson completion and reading notes use the same status words with store-specific detail, so the banner never claims all work is stored when only one path succeeded. No child task was added for those paths because they have equivalent persist, guard, retry, copy, and download coverage.

The REV-001 failed-load guard remains. Malformed or unreadable original bytes are not replaced. Recovery copy/download uses the in-memory object. Download original copy is offered only when the raw unreadable bytes were captured. Versioned backup/import stays in ENG-006.

## Verification
Exact command or browser action, result, and evidence path.
All commands run from `discipleship/` unless noted.

1. `node scripts/test_save_feedback.js`
   Result: 36 checks passed. Covered write-gated Saved, malformed/unavailable classification, quota/blocked reasons, recovery JSON, and completion/reading store keys.

2. `node scripts/test_answer_storage.js`
   Result: 44 checks passed. REV-001 malformed/unavailable preservation checks were not removed or weakened.

3. `node scripts/test_lesson_export.js`
   Result: 40 checks passed.

4. `bash scripts/qa_foundation.sh`
   Result: passed, including the new save-feedback unit checks as step 11.

5. Local server: `python3 -m http.server 8765 --bind 127.0.0.1`
   Then `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/eng005_browser_check.js`
   Result: 77 browser checks passed against `http://127.0.0.1:8765/index.html`. Synthetic values only. Covered valid write/reload/navigation, questions, checklists, commitments, completion, reading notes, quota then retry, copy/download, blocked getter, malformed and non-object loads, failed read then later writes, in-memory retention, 390 and 1280 status layout, and keyboard focus on recovery controls. Typing kept focus in the active field.

6. `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/review_eng_browser_check.js`
   Result: 14 review browser checks passed, including malformed/failed-read/blocked-getter preservation.

7. `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/eng004_browser_check.js`
   Result: 46 browser checks passed. Export preview, cancel, encoding, and radio-group keyboard wrap still pass.

Manual walkthrough at laptop width: typed SYN-walkthrough in 101 lesson 5 and saw Saved / Lesson answers are stored on this device. Phone 390 and laptop 1280 screenshots recorded Could not save plus Retry/Copy/Download, then Saved after retry.

Checks not run and why:
- Real iPhone/Safari, a physical full storage disk, screen reader, and production deployment were not tested.
- 375 px was not a separate banner layout pass; phone evidence is 390 px. Review iframe checks still used 375/390/1280.
- A recorded happy-path video already showed Saved before the final SYN-walkthrough keystroke, likely from an earlier successful write while opening the lesson. Automated checks still prove a valid first load does not claim Saved before a write.

Known baseline failures distinguished from new regressions: SEC-001, ENG-006 backup/import, 202-08/09 writing, and ENG-002 Dave artwork review remain out of scope.

## Handoff
Changed files: save-feedback helper, unit and browser checks, foundation QA hook, index.html status/recovery UI, this log, TASKS.md ENG-005 row.
Remaining work / next command: reviewer verifies the diff and reruns `node scripts/test_save_feedback.js`, `node scripts/test_answer_storage.js`, and `bash scripts/qa_foundation.sh` from `discipleship/`, plus `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/eng005_browser_check.js` with a local server. Do not merge before that review.
Blocker and unblock action, if any: none for ENG-005.
Commit / PR / GitHub sync state: worker branch `cursor/eng-005-save-feedback-2d2c`; PR https://github.com/davepartin/ministrybag1/pull/16 awaiting independent review. Find this packet with `git log -- discipleship/project-management/logs/2026-09-12-ENG-005-discipleshipbot.md` from repository root.
Pastoral approval evidence, if applicable: not required for this software repair.
