# INTEGRATE-101-01-PEAKS

Date: November 13, 2026 (America/Chicago). Agent: Codex.
Source: PR #217, `gemini/widget-101-01-peaks-valleys`, approved `832da0a4f4b36e93fd5ce3dee409bbc56f2afcf6`.

Dave reported previewing and approving this widget and explicitly requested technical review and merge. Worked in an isolated worktree. Merged current main `6b2fdc1` normally before checks; resolved only the task-row append conflict, retaining both sides' rows. The previous mosaic and course-opener integrations remain intact.

## Scope and preservation

The new Peaks and Valleys widget replaces the static example PNG beside the paper timeline exercise in 101-01. Restoring that one original image block makes the full lesson JSON equal main: all prose, metadata, nine question objects/IDs, readings and other images are unchanged. The original PNG remains on disk unchanged.

Technical review found the tappable SVG points had no keyboard or screen-reader control semantics. Added named toggle-button roles, visible-only tab stops, Enter/Space activation and focus feedback using the existing selection ring. The SVG is an accessible group so its interactive descendants remain exposed. The approved drawing geometry, colors, teaching text and animation are unchanged. No new storage, external dependencies, Firebase settings or workflows.

## Verification

Fresh `npm ci`: exit 0. Commands from discipleship/:

| Command | Result | Exit |
|---|---|---|
| `bash scripts/qa_foundation.sh` | Pass, including 32 iframe and 415 bundled-John checks | 0 |
| `node scripts/test_lesson_export.js` | 177 checks | 0 |
| `node scripts/test_answer_storage.js` | 64 checks | 0 |
| `node scripts/check_lesson_assets.js` | 127 references resolve | 0 |
| `node scripts/test_lesson_images.js` | 1367 checks; the static example is now a widget block | 0 |

588 Peaks and Valleys checks passed across 6 cases, exit 0.

`scripts/peaks_valleys_browser_check.js` exercises the embedded lesson at 375, 390 and 1280 widths, with normal and reduced motion: six states, all nine point cards and mouse/keyboard toggles, hidden-point focus exclusion, constant card height, iframe/page fit, accessible step controls, Back and Start Over, zero idle mutation/resize loops, height-only resize stability, all nine saved answers, edit/reload, other-course preservation and Email output. Synthetic answers in isolated contexts; account script stubbed. `GT_BASE_URL` selects an exact hosted preview; `GT_CHROMIUM_PATH=/usr/bin/chromium` selects system Chromium.

The first browser run tapped the bounding center of an SVG group containing offset labels, which can be empty space outside its hit circle or under the sticky topbar after scrolling. The test now scrolls the iframe clear of the header and taps each actual point hit circle. No widget change was needed for that fixture correction.

Inspected 390px screenshots at start, the star stage and the finished timeline: labels, card and navigation fit. Card height is 112px at 390 and 128px at 375. Task, board, handoff and Dave component approval record updated. Exact browser totals, expected-head preview and merge/deploy verification are recorded on PR #217. Final whole-lesson approval remains Dave's. No manual deployment.
