# ENG-006b: backup validation and read-only restore preview
Date: 2026-09-12
Agent / reviewer: DiscipleshipBot / Cursor cloud agent
Status: ACTIVE (implementation checkpoint before checks)
Branch: cursor/eng-006b-backup-preview-2b79
Base commit: e621c4af (origin/main tip, includes docs e621c4af / checkpoint caab24d6)
Scope / files reserved: scripts/backup-preview.js, scripts/backup-format.md validation section, scripts/test_backup_preview.js, scripts/eng006b_browser_check.js, scripts/qa_foundation.sh step 13, index.html preview controls, PROJECT-BRIEF preview line, this log, TASKS.md ENG-006b row. Did not edit data/202-08.json, data/202-09.json, login, lesson prose, Claude PR #17, or restore writes. Did not start ENG-006c.

## Changes and decisions

A user-selected local JSON file is size-checked at 1,048,576 bytes before read or parse. Malformed JSON, unsupported kind/version, invalid structures and invalid value types are rejected with a useful message. ENG-005 in-memory recovery snapshots and older raw storage copies are distinguished instead of treated as versioned backups.

Imported content is untrusted. Preview strings are assigned with textContent only. Keys named __proto__, constructor or prototype are rejected. Claimed counts, complete flags and duplicated ambiguity metadata are derived again from validated data; mismatches are listed. Multiline and Unicode strings, stable IDs, false flags and empty strings or arrays are kept.

The read-only preview shows all three stores with counts, existing-value conflicts, partial/unsaved status, unknown keys and proposed selection semantics. Unknown keys stay listed and would be kept as stored keys, not dropped or assigned to a lesson. Ambiguous answers and candidate lessons are shown and stay unassigned. originalRaw stays recovery evidence and is not parsed into learner data. A partial file cannot claim to recover inaccessible stored data. There is no working Restore button. Applying a backup is not available yet.

Preview, cancel and invalid files do not write storage, change in-memory learner data, change migration flags or clear write guards.

## Verification

Checks in this revision are pending. Exact commands and results will be recorded after the targeted unit, foundation and browser runs.

## Handoff

ENG-006b remains on this branch. Parent ENG-006 stays incomplete. Do not start ENG-006c. Do not merge until independent review.
