# ENG-004: current-lesson export with visible preview
Date: 2026-09-11
Agent / reviewer: DiscipleshipBot / Cursor cloud agent
Status: REVIEW
Branch: cursor/eng-004-export-preview-42be
Base commit: 3174265131299a9cf85dcf4035d16d23c5169817
Scope / files reserved: export UI and helpers in index.html, scripts/lesson-export.js, scripts/test_lesson_export.js, scripts/eng004_browser_check.js, scripts/qa_foundation.sh, this log, TASKS.md ENG-004 row. Did not edit data/202-08.json, data/202-09.json, answer-storage write guard, login, answer keys, or lesson prose.

## Changes and decisions

Email Lesson now opens a preview instead of a mail draft. Default scope is the current lesson. Course-wide export requires an explicit This course choice. Cancel, Escape, and backdrop click close the preview without opening mail.

Outgoing text is built from the selected lesson's actual question and checklist fields, not from stored-key prefixes. That keeps copied historical IDs such as 202-05's `201-09-1` and excludes another lesson's prayer, course commitment, and `__gt` migration/recovery metadata unless course scope is chosen and those fields belong there.

Copy text is always available. A length note appears only as an advisory when a mailto URI is long. The note does not claim a universal mailto size limit. No automatic send. REV-001's failed-load write guard is unchanged.

## Verification
Exact command or browser action, result, and evidence path.
All commands run from `discipleship/`.

1. `node scripts/test_lesson_export.js`
   Result: 40 checks passed. Covered copied historical IDs vs prefix guessing, lesson-only exclusion of another lesson's prayer, course commitment, and recovery/migration metadata, course-scope inclusion when selected, lesson/course switching, empty responses, multiline/quotes/ampersands/Unicode, mailto encoding, live in-memory edits, and an advisory-only long-draft note.

2. `bash scripts/qa_foundation.sh`
   Result: passed, including the new export unit checks as step 10. Previous JSON, TOC, uniqueness, asset, and iframe checks still passed.

3. `node scripts/test_answer_storage.js`
   Result: 44 checks passed. REV-001 malformed/unavailable preservation checks were not removed or weakened.

4. Local server: `python3 -m http.server 8765 --bind 127.0.0.1`
   Then `NODE_PATH=/tmp/gt-playwright/node_modules GT_BROWSER_CHANNEL=chrome node scripts/eng004_browser_check.js`
   Result: 42 browser checks passed against `http://127.0.0.1:8765/index.html`. Synthetic answers only. Preview defaulted to 202-05, hid 202-06 prayer/commitment/recovery, showed them only after This course, updated after lesson and course switches, cancelled by Escape and Cancel without mailto, copied exact typed multiline/ampersand/quote/Unicode text, encoded the mail draft, and kept preview/actions readable at 390x844 and 1280x800.

Checks not run and why:
- Real iPhone/Safari, a physical mail app, and production deployment were not tested.
- No universal mailto size limit was measured; the copy path is the fallback when a client rejects a long draft.
- Interactive reduced-motion and text-zoom were not separately recorded beyond the 390/1280 preview layout checks.

Known baseline failures distinguished from new regressions: save-failure UI (ENG-005), SEC-001, 202-08/09 writing, 203-06 title/topic mismatch, 203-08 wrong content, and ENG-002 Dave artwork review remain out of scope.

## Handoff
Changed files: lesson export helper, unit and browser checks, foundation QA hook, index.html preview UI, this log, TASKS.md ENG-004 row.
Remaining work / next command: reviewer verifies the diff and reruns `node scripts/test_lesson_export.js` and `bash scripts/qa_foundation.sh` from `discipleship/`, then integrates. Next implementation packet is ENG-005.
Blocker and unblock action, if any: none for ENG-004.
Commit / PR / GitHub sync state: worker branch `cursor/eng-004-export-preview-42be`; PR https://github.com/davepartin/ministrybag1/pull/14 awaiting review. Find this packet with `git log -- discipleship/project-management/logs/2026-09-11-ENG-004-discipleshipbot.md` from repository root.
Pastoral approval evidence, if applicable: not required for this software repair.
