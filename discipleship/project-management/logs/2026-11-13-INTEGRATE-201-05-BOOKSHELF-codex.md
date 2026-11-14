# INTEGRATE-201-05-BOOKSHELF

November 13, 2026 (America/Chicago). Codex. PR #219.

Dave praised Gemini's preview and requested a merge/publication. Approved source: `7647927f8616ac9fcc7b28b9954c0f9050f47e47`. Worked in an isolated worktree, claimed the integration task, and normally merged current main `4fb3721` before editing. Existing 201-05 wording approvals and the newly merged #216 Creator wording remain intact.

## Change and preservation

Replace `widgets/bible-bookshelf.html` with `widgets/bible-bookshelf2.html` in 201-05 at its existing position. Add the descriptive iframe title Bible Bookshelf and a 600px fallback height; the existing iframe host sizes to actual content. Keep the original Bookshelf file on disk unchanged.

Restoring the original widget block makes the entire lesson JSON equal main, proving all prose, Scripture, metadata, six question objects/IDs and other blocks unchanged. The new widget differs from Dave's approved source by one accessibility attribute only: the SVG container uses role group so its ten interactive shelf buttons remain exposed to assistive technology. Drawing, colors, card copy and animation are unchanged. No artwork, saved-answer behavior, Firebase settings or workflows changed.

## Verification

Fresh `npm ci`: exit 0. Commands run from discipleship/:

| Command | Result | Exit |
|---|---|---|
| `bash scripts/qa_foundation.sh` | Pass, including 32 iframe and 415 bundled-John checks | 0 |
| `node scripts/test_lesson_export.js` | 177 checks | 0 |
| `node scripts/test_answer_storage.js` | 64 checks | 0 |
| `node scripts/check_lesson_assets.js` | 127 references resolve | 0 |
| `node scripts/test_lesson_images.js` | 1367 checks | 0 |
| `node scripts/widget_201_05_bookshelf_browser_check.js` | Standalone 375/390/1280 and reduced-motion cases pass | 0 |
| `GT_CHROMIUM_PATH=/usr/bin/chromium GT_SCREENSHOT_DIR=/workspace/scratch/bookshelf219-shots node scripts/bookshelf_lesson_browser_check.js` | 708 checks across six embedded cases | 0 |

The standalone command uses `NODE_OPTIONS=--require=/workspace/scratch/chrome-shim.cjs` to select system Chromium. Its local test server now returns 204 for Chromium's optional favicon request; actual widget asset errors remain visible. This fixture change does not alter widget behavior.

Embedded checks cover eleven states, 66 unique books in canonical shelf order (39 OT and 27 NT), all ten direct shelf selections and Enter/Space toggles, accessible buttons exposed by role, ArrowLeft/Right, Back and All Shelves, card/chip/heading/iframe fit, no overflow, stable idle DOM/iframe heights, height-only resize, all saved-answer fields, edit/reload, other-course answer preservation and Email export. Synthetic answers in isolated browser contexts; account script stubbed. Three widths, each with normal and reduced motion. Card height 207px at 375/390 and 164px at 1280. Inspected phone screenshots of overview, Poetry/Wisdom and Paul's Letters; no label or card clipping.

WIDGET-201-05-BOOKSHELF and integration task marked DONE. Board, handoff and Dave's component approval record updated. Exact-head Firebase Action preview, hosted integration check, expected-head merge and automatic live deployment evidence are recorded on PR #219. No manual deployment. This widget approval does not grant a new approval to unrelated lesson content.
