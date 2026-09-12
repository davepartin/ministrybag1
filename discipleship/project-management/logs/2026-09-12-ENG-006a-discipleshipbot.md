# ENG-006a: versioned local backup download
Date: 2026-09-12
Agent / reviewer: DiscipleshipBot / Cursor cloud agent
Status: ACTIVE
Branch: cursor/eng-006a-backup-download-47d8
Base commit: 8b1825ecba848023f65f79a6fe1d7b1735bb485e
Scope / files reserved: scripts/backup-download.js, scripts/backup-format.md, scripts/test_backup_download.js, scripts/eng006a_browser_check.js, scripts/qa_foundation.sh, index.html backup controls, PROJECT-BRIEF backup line, this log, TASKS.md ENG-006a row. Did not edit data/202-08.json, data/202-09.json, login, lesson prose, Claude PR #17, or restore writes.

## Changes and decisions

Backup format v1 is a local JSON envelope (`kind: growing-together-backup`). It always includes answers, completion and reading stores with explicit `loadState`, `complete`, `emptyValid` and `dataRepresents` fields. Valid empty stores stay complete. Unreadable or unavailable stores make the file partial and never look like a finished empty backup.

Current in-memory values, including unsaved edits, go into `data`. Stable IDs and `__gtAmbiguousSharedAnswers` are copied without assigning a lesson. When a store was unreadable, captured original bytes stay in `originalRaw` and the existing Download original copy path remains. Download does not write storage, open mail, choose accounts or upload.

User triggers: home Download backup, lesson Download backup, and recovery Download backup. ENG-005 per-store recovery snapshots and the failed-store selector stay as they were.

## Verification
Exact command or browser action, result, and evidence path.
All commands run from `discipleship/` unless noted.

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

Browser downloaded-file checks are next. Synthetic data only. Downloaded contents stay out of Git and this log.

Checks not run and why:
- Browser, phone/laptop layout, and keyboard evidence are pending the local server pass.
- Real iPhone/Safari, screen reader and production deployment are out of scope.

Known baseline failures distinguished from new regressions: SEC-001, ENG-006b/c restore, 202-08/09 writing, and ENG-002 Dave artwork review remain out of scope.

## Handoff
Changed files: backup helper and format doc, unit and browser checks, foundation QA hook, index.html download controls, PROJECT-BRIEF backup line, this log, TASKS.md ENG-006a row.
Remaining work / next command: finish browser downloaded-file checks, then leave ENG-006a at REVIEW. Do not start ENG-006b. Do not merge.
Blocker and unblock action, if any: none for ENG-006a.
Commit / PR / GitHub sync state: worker branch `cursor/eng-006a-backup-download-47d8` on current main `8b1825ec`.
Pastoral approval evidence, if applicable: not required for this software packet.
