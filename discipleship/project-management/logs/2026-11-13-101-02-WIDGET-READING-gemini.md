# 2026-11-13 Lesson 101-02 Update Gemini Log

- Task: Lesson `101-02` Salvation and Baptism package (`romans-road3.html` A-D updates, `Bible Reading` header v2 scoped to `101-02`, and `The Greenhouse` parable wording update)
- PR: [#206](https://github.com/davepartin/ministrybag1/pull/206)
- Branch: `gemini/101-02-updates` (isolated branch off current `origin/main` `a886cb7`)
- Worktree: `/Users/dpartin/github/ministrybag1-101-02-updates`
- Status: `REVIEW` (packaged for Codex review and automatic merge deployment; zero direct edits or pushes to `main`)

## Changed Files

1. `discipleship/widgets/romans-road3.html`
2. `discipleship/data/101-02.json`
3. `discipleship/index.html`
4. `discipleship/scripts/read101_a11y_browser_check.js`
5. `discipleship/project-management/TEAM-BOARD.md`
6. `discipleship/project-management/logs/2026-11-13-101-02-WIDGET-READING-gemini.md`

## Paragraph and UI Change Summary

1. `discipleship/data/101-02.json` (`blocks[2]`, `The Greenhouse`):
   - Paragraph 2 trimmed `", and everyone can see what was already true."` so it ends at `"Then one morning a green shoot breaks through the soil."`
   - Paragraph 3 changed `"Baptism is the first green shoot, the moment the life God started on the inside shows up where everyone can see it."` to `"Baptism is one of the ways that green shoot becomes visible."`
2. `discipleship/widgets/romans-road3.html` (`steps` array, lines 634-675):
   - `Start`: Replaced `"Paul's letter to the Romans lays out the road back to God..."` and instructional tap helper with `"These verses from the book of Romans show us the road of faith to a relationship with God."` followed by `Romans 3:23; 5:8; 6:23; 10:9; Luke 9:23`.
   - `A. Admit Sin`: Moved bold emphasis to `"wages of sin is death"` only in Romans 6:23, placed references inline after quotes (`Romans 3:23`, `Romans 6:23`), and set note to `"Your part: Admit your need of salvation. God's part: He has already provided salvation in Jesus."`
   - `B. Believe in Jesus as Savior`: Placed `Romans 5:8` after the quote and set note to `"Your part: Believe that Jesus died on a cross for you. God's part: Jesus was crucified to save you from your sins."`
   - `C. Confess Jesus as Lord`: Placed `Romans 10:9, 13` after the quote and set note to `"Your part: Confess Jesus as your Lord and give Him the throne of your life. God's part: Jesus rose from the dead to show He was the Son of God sent to save the world through faith in Him."`
   - `D. Discipleship: Follow Jesus` (new fourth stop): Quoted `"If anyone would come after me, let him deny himself and take up his cross daily and follow me." Luke 9:23` and set note to `"Your part: Live in dependence on the Spirit of God by fighting sin and following the ways of Jesus. God's part: Jesus will be with you every day."` Transition turns the gravel road and subtle horizon hills warm wood brown to form a cross beneath the sun.
3. `discipleship/index.html` (scoped strictly to Lesson `101-02` via `isV2Reading = (currentSeries === '101' && sessionNum === 2)`):
   - Updated `John 4`, `John 5`, and `John 6` dropdown bars (`.chapter-card--v2`) to show an open-Bible icon, `BIBLE READING` eyebrow, `Done` checkbox pill (`[ ] Done` when unread -> dark green `[✓] Done` on `#ECF6F0` bar when read), and white `Open` / `Close` button pill, and removed the footer `"Checks Done above"` hint text from `"I've read John X"`.
   - Preserved all existing IDs and storage keys (`notes-101-John-*`, `check-101-John-*`, `2-1`, `2-2`, `2-3`, `2-5`, `2-key`, `2-step`, `2-devos`, `2-prayer`) and WEB Scripture text.
4. `discipleship/scripts/read101_a11y_browser_check.js`:
   - Updated chapter button assertion so the 18 v1 headers still require `Open John` + `.chapter-done-badge`/`.chapter-card-toggle`, while the 3 `.chapter-card--v2` headers in `101-02` verify `Bible Reading` + `John` + `aria-hidden="true"` on `.chapter-status-pill` and `.chapter-action-pill`.

## Items for Dave to Reread

1. `101-02.json` (`The Greenhouse`, line 30): Added missing `"is"` and corrected `"visable"` -> `"visible"` in `"Baptism is one of the ways that green shoot becomes visible."`
2. `romans-road3.html` (`Step D`, lines 671-672): Drafted `"Your part: Live in dependence on the Spirit of God by fighting sin and following the ways of Jesus. God's part: Jesus will be with you every day."` from your brief note; confirm wording reads smoothly in your voice.
3. Unchanged neighboring paragraphs in `101-02.json` flagged for a future reread if you want them aligned later:
   - Line 61 (widget intro): still says `"three letters, the ABCs of salvation: Admit, Believe, and Confess"`, while `romans-road3.html` now includes stop `D` (`Discipleship`).
   - Line 141 (`Lesson 2 Review`): still says `"Baptism is the first green shoot, the outward sign of the life God has already started inside you."`

## Verification

- `bash scripts/qa_foundation.sh` -> exited `0` (`32 widget iframe checks passed`, `126 src/image/imageBw/imageColor/imageSequence references resolve to files`, `415 check(s) passed`, `1360 lesson image checks passed`)
- `node scripts/test_answer_storage.js` -> exited `0` (`64 check(s) passed`)
- `node scripts/read101_a11y_browser_check.js` -> exited `0` (`57 accessibility browser checks passed` across `375`, `390`, `1280` viewports)
- `node scripts/read101_notes_browser_check.js` -> exited `0` (`36 browser checks passed` across `375`, `390`, `1280` viewports)
- `node scripts/read101_retry_browser_check.js` -> exited `0` (`33 retry browser checks passed` across `375`, `390`, `1280` viewports)
- `101-02` mobile (`390x844`) + keyboard Playwright integration check -> exited `0` (`Greenhouse` text, `Start -> D` wood-brown cross via `Enter`, `Start Over`, `John 4` keyboard `Enter` expand, `Space` check updating `.completed` + green `Done` pill, `Enter` collapse, zero page errors, no horizontal overflow)
- `EM_DASHES=0` across diff
