# READ-101-NOTES: Chapter Notes in Email

Date: 2026-11-12. Owner: Codex. Branch: `codex/read-101-notes`.
Base: `8d4dccf`. Status: REVIEW.

Dave asked the acting coordinator to continue through the ordered queue while he is away and already authorized reviewed, passing merges. New lesson wording and personal artwork approval remain with Dave. This job changes no lesson content, IDs, account code, Firebase settings or PDF behavior.

Email selection derives chapter references from the selected lesson's actual reading block. Nonempty reading notes follow its existing summary and answers. Live textarea values override memory/storage, including deliberate clearing. No store-wide scan, other-lesson notes, blank-note clutter or malformed values are exported.

## Verification

- `bash scripts/qa_foundation.sh`: exit 0; all foundation suites pass, including 1075 image checks.
- `node scripts/test_lesson_export.js`: 167 pass, exit 0. Covers all seven 101 assignments, other-lesson/course exclusion, live overrides/clearing, malformed/duplicate/blank notes, literal multiline values and legacy explicit selection.
- `node scripts/test_answer_storage.js`: 64 pass, exit 0.
- `node scripts/check_lesson_assets.js`: 102 references resolve, exit 0.
- `node scripts/read101_notes_browser_check.js`: 36 pass, exit 0 at 375/390/1280. Real Email preview, live-only edits, clearing, navigation, failed-save notes, literal text, PDF placeholder, no auto-mail or page errors. Synthetic signed-out data only. Phone screenshot inspected.
- `node scripts/ux005_browser_check.js`: 84 pass, exit 0. Existing test assumed the full About notice was the only ESV element and expected an obsolete bare-number answer label. Scoped its acknowledgment lookup to About and matched the existing short-question format. No runtime behavior changed for these stale assertions.
- `git diff --check`: exit 0.

Initial browser run caught an overly broad patch matching an earlier textarea selector instead of the export selector. Corrected before the final green rerun. No lesson JSON or reading text changed.

Action preview and exact-head review/integration evidence will be posted in the PR after the Action runs. This REVIEW log is the pre-integration checkpoint, not a claim of deployment or human approval.
