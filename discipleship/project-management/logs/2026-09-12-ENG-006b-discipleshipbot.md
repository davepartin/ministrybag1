# ENG-006b: backup validation and read-only restore preview
Date: 2026-09-12
Agent / reviewer: DiscipleshipBot / Cursor cloud agent
Status: REVIEW
Branch: cursor/eng-006b-backup-preview-2b79
Base commit: e621c4af (origin/main tip, includes docs e621c4af / checkpoint caab24d6)
Scope / files reserved: scripts/backup-preview.js, scripts/backup-format.md validation section, scripts/test_backup_preview.js, scripts/eng006b_browser_check.js, scripts/qa_foundation.sh step 13, index.html preview controls, PROJECT-BRIEF preview line, this log, TASKS.md ENG-006b row, HANDOFF next-packet hold. Did not edit data/202-08.json, data/202-09.json, login, lesson prose, Claude PR #17, or restore writes. Did not start ENG-006c.

## Changes and decisions

A user-selected local JSON file is size-checked at 1,048,576 bytes before read or parse. Malformed JSON, unsupported kind/version, invalid structures and invalid value types are rejected with a useful message. ENG-005 in-memory recovery snapshots and older raw storage copies are distinguished instead of treated as versioned backups.

Imported content is untrusted. Preview strings are assigned with textContent only. Keys named __proto__, constructor or prototype are rejected. Claimed counts, complete flags and duplicated ambiguity metadata are derived again from validated data; mismatches are listed. Multiline and Unicode strings, stable IDs, false flags and empty strings or arrays are kept.

The read-only preview shows all three stores with counts, existing-value conflicts, partial/unsaved status, unknown keys, file values as text and proposed selection semantics. Unknown keys stay listed and would be kept as stored keys, not dropped or assigned to a lesson. Ambiguous answers and candidate lessons are shown and stay unassigned. originalRaw stays recovery evidence and is not parsed into learner data. A partial file cannot claim to recover inaccessible stored data. There is no working Restore button. Applying a backup is not available yet.

Preview, cancel and invalid files do not write storage, change in-memory learner data, change migration flags or clear write guards. Home and lesson Preview a backup controls use the same hidden file input.

## Verification
Exact command or browser action, result, and evidence path.
All commands run from `discipleship/` unless noted. Browser prefix:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/SCRIPT.js
```

1. `node scripts/test_backup_preview.js`
   Result: 52 checks passed. Covered size limit before parse, recovery-snapshot and raw-copy distinction, malformed/unsupported/invalid types, dangerous keys, HTML strings as text, empty and false values, claimed-count mismatches, partial originalRaw evidence, unknown keys, conflict selection semantics, and no restore helper.

2. `node scripts/test_backup_download.js`
   Result: 53 checks passed.

3. `node scripts/test_save_feedback.js`
   Result: 41 checks passed.

4. `node scripts/test_answer_storage.js`
   Result: 44 checks passed.

5. `node scripts/test_lesson_export.js`
   Result: 40 checks passed.

6. `bash scripts/qa_foundation.sh`
   Result: passed, including new backup-preview checks as step 13.

7. `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/eng006b_browser_check.js`
   Result: all ENG-006b browser checks passed against `http://127.0.0.1:8765/index.html`. Used the actual file input and a current downloaded backup written only under `/tmp`. Covered conflicts after a later device edit, repeated selection, Escape/close cancel, HTML-as-text, unknown keys, false/empty values, partial originalRaw, malformed/recovery/raw/txt/version/type/dangerous/oversized rejections, failed-load guard preservation, home empty-valid preview, keyboard focus, and 375/390/1280 control fit. Compared learner state before and after each preview. Downloaded contents were not printed or committed.

8. `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/eng006a_browser_check.js`
   Result: all ENG-006a browser checks passed. Download path unchanged.

9. `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/review_save_recovery_browser_check.js`
   Result: 20 checks passed. Recovery selector, original copy and retries preserved.

10. `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/eng004_browser_check.js`
    Result: browser ENG-004 checks passed. Scoped export preview and keyboard wrap preserved.

Checks not run and why:
- Real iPhone/Safari, a physical full storage disk, screen reader and production deployment were not tested.

Known baseline failures distinguished from new regressions: SEC-001, ENG-006c restore writes, 202-08/09 writing, and ENG-002 Dave artwork review remain out of scope.

## Handoff
Changed files: backup preview helper and format validation section, unit and browser checks, foundation QA hook, index.html preview controls, PROJECT-BRIEF preview line, this log, TASKS.md ENG-006b row, HANDOFF hold for ENG-006c.
Remaining work / next command: reviewer verifies the diff and reruns the commands above. Do not start ENG-006c. Do not merge.
Blocker and unblock action, if any: none for ENG-006b. Parent ENG-006 stays incomplete until 006c passes.
Commit / PR / GitHub sync state: worker branch `cursor/eng-006b-backup-preview-2b79`; PR https://github.com/davepartin/ministrybag1/pull/20 awaiting independent review. Find this packet with `git log -- discipleship/project-management/logs/2026-09-12-ENG-006b-discipleshipbot.md` from repository root.
Pastoral approval evidence, if applicable: not required for this software packet.
