# ENG-004: current-lesson export with visible preview
Date: 2026-09-11
Agent / reviewer: DiscipleshipBot / Cursor cloud agent
Status: ACTIVE
Branch: cursor/eng-004-export-preview-42be
Base commit: 3174265131299a9cf85dcf4035d16d23c5169817
Scope / files reserved: export UI and helpers in index.html, scripts/lesson-export.js, scripts/test_lesson_export.js, scripts/eng004_browser_check.js, scripts/qa_foundation.sh, this log, TASKS.md ENG-004 row. Did not edit data/202-08.json, data/202-09.json, answer-storage write guard, login, answer keys, or lesson prose.

## Changes and decisions

Email Lesson now opens a preview instead of a mail draft. Default scope is the current lesson. Course-wide export requires an explicit This course choice. Cancel, Escape, and backdrop click close the preview without opening mail.

Outgoing text is built from the selected lesson's actual question and checklist fields, not from stored-key prefixes. That keeps copied historical IDs such as 202-05's `201-09-1` and excludes another lesson's prayer, course commitment, and `__gt` migration/recovery metadata unless course scope is chosen and those fields belong there.

Copy text is always available. A length note appears only as an advisory when a mailto URI is long. The note does not claim a universal mailto size limit. No automatic send. REV-001's failed-load write guard is unchanged.

## Verification
Checks are being recorded after the first review branch push.

## Handoff
Remaining work / next command: run unit, foundation, and browser checks, then move ENG-004 to REVIEW.
Blocker and unblock action, if any: none.
Commit / PR / GitHub sync state: first implementation push on `cursor/eng-004-export-preview-42be`.
Pastoral approval evidence, if applicable: not required for this software repair.
