# ENG-006a: versioned local backup download
Date: 2026-09-12
Agent / reviewer: DiscipleshipBot / Cursor cloud agent
Status: REVIEW
Branch: cursor/eng-006a-backup-download-47d8
Base commit: 8b1825ecba848023f65f79a6fe1d7b1735bb485e
Scope / files reserved: scripts/backup-download.js, scripts/backup-format.md, scripts/test_backup_download.js, scripts/eng006a_browser_check.js, scripts/qa_foundation.sh, index.html backup controls, PROJECT-BRIEF backup line, this log, TASKS.md ENG-006a row. Did not edit data/202-08.json, data/202-09.json, login, lesson prose, Claude PR #17, or restore writes.

## Changes and decisions

Backup format v1 is a local JSON envelope (`kind: growing-together-backup`). It always includes answers, completion and reading stores with explicit `loadState`, `complete`, `emptyValid` and `dataRepresents` fields. Valid empty stores stay complete. Unreadable or unavailable stores make the file partial and never look like a finished empty backup.

Current in-memory values, including unsaved edits, go into `data`. Stable IDs and `__gtAmbiguousSharedAnswers` are copied without assigning a lesson. When a store was unreadable, captured original bytes stay in `originalRaw` and the existing Download original copy path remains. Download does not write storage, open mail, choose accounts or upload.

User triggers: home Download backup, lesson Download backup, and recovery Download backup. ENG-005 per-store recovery snapshots, the failed-store selector and the failed-load write guard stay as they were. Full import preview is ENG-006b. Confirmed restore writes are ENG-006c.

## Verification
Exact command or browser action, result, and evidence path.
All commands run from `discipleship/` unless noted. Browser prefix:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/SCRIPT.js
```

1. `node scripts/test_backup_download.js`
   Result: 51 checks passed. Covered all three stores, checklists, commitments, completion/reading flags, multiline and Unicode answers, empty valid data, retained ambiguity metadata, failed-load/unsaved states, and no restore helper.

2. `node scripts/test_save_feedback.js`
   Result: 41 checks passed.

3. `node scripts/test_answer_storage.js`
   Result: 44 checks passed. Failed-load preservation checks were not removed.

4. `node scripts/test_lesson_export.js`
   Result: 40 checks passed.

5. `bash scripts/qa_foundation.sh`
   Result: passed, including new backup-envelope checks as step 12.

6. `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/eng006a_browser_check.js`
   Result: all ENG-006a browser checks passed against `http://127.0.0.1:8765/index.html`. Validated the actual downloaded file, not a debug marker. Covered lesson/home/recovery/laptop downloads, multiline and Unicode answers, checklists, commitments, completion/reading flags, empty valid data, retained ambiguity metadata, failed-load/unsaved partial files, original-copy retention, no storage writes, keyboard Enter, and 375/390/1280 control fit.

7. `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/eng005_browser_check.js`
   Result: 77 checks passed. Failures, selector, recovery snapshot and failed-load guard preserved.

8. `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/review_save_recovery_browser_check.js`
   Result: 20 checks passed. Multi-store selector, actual recovery/original downloads and retries preserved.

9. `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/eng004_browser_check.js`
   Result: 46 checks passed. Export scope and keyboard wrap preserved.

10. `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/review_eng_browser_check.js`
    Result: 14 checks passed. Failed-load preservation and real iframe sizing preserved.

Manual walkthrough at home and 101-5: Download backup produced `growing-together-backup.json` and the status "Downloaded a local backup of answers, completion and reading notes. The file stays on this device. Restore is not available yet." Email Lesson stayed visible. Phone ~390 and laptop ~1280 controls remained usable. Keyboard Enter started another local download. Synthetic data only. Downloaded contents were not printed or committed.

Checks not run and why:
- Real iPhone/Safari, a physical full storage disk, screen reader and production deployment were not tested.

Known baseline failures distinguished from new regressions: SEC-001, ENG-006b/c restore, 202-08/09 writing, and ENG-002 Dave artwork review remain out of scope.

## Handoff
Changed files: backup helper and format doc, unit and browser checks, foundation QA hook, index.html download controls, PROJECT-BRIEF backup line, this log, TASKS.md ENG-006a row.
Remaining work / next command: reviewer verifies the diff and reruns the commands above. Do not start ENG-006b. Do not merge.
Blocker and unblock action, if any: none for ENG-006a. Parent ENG-006 stays incomplete until 006b and 006c pass.
Commit / PR / GitHub sync state: worker branch `cursor/eng-006a-backup-download-47d8`; PR https://github.com/davepartin/ministrybag1/pull/19 awaiting independent review. Find this packet with `git log -- discipleship/project-management/logs/2026-09-12-ENG-006a-discipleshipbot.md` from repository root.
Pastoral approval evidence, if applicable: not required for this software packet.
