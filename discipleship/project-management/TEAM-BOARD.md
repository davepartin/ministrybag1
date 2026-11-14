# Growing Together Team Board

## 101-02 is Gold: November 14, 2026

Dave explicitly approved the whole 101-02 lesson, the A-B-C-D widget and the greenhouse sequence Gold. No runtime or lesson file changed. The [101 tracker](reviews/101-editorial-status.md) and component fingerprints record the exact ae1c78e source and file hashes. Protect its text, questions, readings, widget and artwork; no generic trim, art refresh or style-uniformity task overrides this approval. This supersedes older notices that 101-02 was still in progress. Other lesson text stages remain separate.


## 101-01 Peaks and Valleys V2 approved: November 14, 2026

Dave explicitly approved PR #223 at `ea26435`, including the paper/six-dot widget and exactly one lesson sentence: **Include 3 to 5 peaks and 3 to 5 valleys.** All other lesson copy, nine question objects/IDs, John readings and artwork are unchanged. The approved widget bytes are preserved. [Integration evidence](logs/2026-11-14-WIDGET-101-01-PEAKS-V2-codex.md).

101-01 and 101-02 remain Silver: Dave confirmed his personal editing is still in progress and his existing edits must stay protected. This component/sentence approval does not award Gold or reopen other paragraphs. The 101 tracker and 101-01 component fingerprints identify V2 so future work must not restore V1 accidentally.

## 202-05 trimmed draft authorized for merge: November 14, 2026

Dave requested merge of PR #221's exact `2d6c258` draft. It folds question 5.5 into the practice and trims repeated prose; four discussion questions and the closing trio remain. The retired `201-09-5` metadata reserves its original ID, and existing answers remain stored and appear under Earlier saved responses in Email. All other question objects, quoted Scripture, headings, the Joseph artwork and the approved Creator mosaic/header are preserved. [Integration record](logs/2026-11-14-TRIM-202-05-INTEGRATE-codex.md).

This is authorization to publish the draft for Dave's continuing lesson editing, not an inferred final whole-lesson Gold review. Use the newest verified live link after merge; the closed-PR preview will be removed automatically under his cleanup authorization.

## Automatic closed-PR preview cleanup authorized: November 14, 2026

Dave explicitly authorized automatic preview cleanup and merging PR #224. This supersedes the earlier Firebase hold only for the new close-event workflow: delete the closing same-repository PR's preview channels, never live or another PR's channels. The existing preview/deploy workflows, billing and retention settings remain unchanged. No manual sweep is authorized or performed. [Review and synthetic tests](logs/2026-11-14-FIREBASE-PR-CLEANUP-codex.md).

The workflow pins Firebase CLI 15.36.0 on Node22, validates the complete channel list before deletion, rejects unexpected responses, uses a private temporary credential, and removes it on success/failure. Closed-PR preview links disappear; after a merge, use the verified live lesson link. Automatic cleanup execution and deployment evidence are recorded on PR #224 and subsequent merged PRs.


## Approved widget header rollout: PR #220

Dave approved `315fc75`: all ten active 202 widgets use the dark `#2C2416` header with title on the left and lesson number on the right. The shared v5 engine now displays `201-01`, `202-01` and `203-01` instead of Course labels. Approved titles include Building From the Cornerstone and Reflecting God's Worth. [Technical review and verification](logs/2026-11-13-WIDGET-202-HEADERS-codex.md).

All eleven approved runtime files remain byte-identical to Dave's reviewed source. The ten HTML interaction scripts are unchanged from before the header update; the shared engine changes only three tag strings. All lesson JSON, question IDs, saved answers, Scripture, images and index.html are untouched. Existing Bookshelf, mosaic and other integrations remain intact. Preview, merge and live deployment evidence is recorded on PR #220. No Firebase configuration changes or manual deployment.


## 202 Widget Header Standardization & Lesson Tag Format: November 13, 2026

- **Task / Branch:** `WIDGET-202-HEADERS` on `gemini/widget-202-headers` (`DONE`: Dave approved315fc75; Codex technical review and integration, PR220)
- **Summary:** Dropped the word `Course` in favor of `<course>-<lesson>` top-right tags (`201-01`, `202-01`, `203-01` in `great-command-v5.js` + Studio Wash docs) and standardized all active `202` widgets (`202-01` through `202-10`) to the `#2C2416` bar (`36px` tall, `17px` `#FAF8F3` title top-left, `11px` `#E5DEC9` lesson number top-right), including Dave's confirmed titles **`Building From the Cornerstone`** (`202-02`) and **`Reflecting God's Worth`** (`202-06`) and `202-05` (`trust-the-artist.html`: **`Trust the Creator`**).
- **Untouched:** all lesson JSON files (`data/*.json`), question IDs, saved answers, `index.html`, `scripts/`, `images/`, and Firebase config.
- **Checks (all exit `0`):** Playwright across all 13 widgets (`390x844` and `1280x800`, zero overflow/errors/overlap, screenshots inspected), `qa_foundation.sh`, `test_lesson_export.js` (`177`), `test_answer_storage.js` (`64`), `check_lesson_assets.js` (`127`). [Evidence](logs/2026-11-13-WIDGET-202-HEADERS-gemini.md).
## 201-05 approved Studio Wash Bookshelf integration: November 13, 2026

Dave praised the PR #219 preview and requested publication. The new `widgets/bible-bookshelf2.html` replaces the old Bookshelf embed in 201-05 at the same position. Existing lesson wording, Scripture, metadata, questions/IDs and images are unchanged; `widgets/bible-bookshelf.html` stays on disk unchanged. The new widget's approved appearance and wording remain; only the SVG accessibility container role changes so the ten shelf controls are exposed to assistive technology. [Integration evidence](logs/2026-11-13-INTEGRATE-201-05-BOOKSHELF-codex.md).

This completes the widget component, not a new approval of unrelated lesson material. Existing 201-05 wording approvals remain in force. Exact-head preview, merge and automatic live deployment results are recorded on PR #219. No manual deployment or Firebase configuration changes.


## 101 personal-editing protection and simple status

Dave requested Bronze/Silver/Gold stages and separate widget/image approvals. Use the [five-column 101 tracker](reviews/101-editorial-status.md) before any 101 work. Protect his edits to 101-01/02 now and the earlier exact 101-06 edits; do not swap or remove story art without his direction. Gold requires his confirmed completed personal read-through, never an AI grade. Existing approved components stay approved independently. Lesson/widget/image files are unchanged by this documentation packet.


## 101-01 Peaks and Valleys widget integration: November 13, 2026

Dave approved the Peaks and Valleys widget in PR #217 at `832da0a` and requested technical review and merge. It replaces only the static example image beside the paper timeline exercise. All lesson prose, question objects/IDs, readings and metadata are preserved; the original example PNG remains on disk. Technical review added keyboard activation, named toggle semantics and focus feedback for the timeline points, with hidden points excluded from focus. Approved visual design and wording remain unchanged. [Integration evidence](logs/2026-11-13-INTEGRATE-101-01-PEAKS-codex.md).

This is widget-component approval, not a new final approval of 101-01. Use PR #217's exact-head preview and deployment record; earlier preview links represent the version before the accessibility fix. The preceding mosaic and Studio Wash course-opener integrations remain intact.


## Approved suffering mosaic integrated: November 13, 2026

Dave approved PR #215 at `e82ed36` and requested integration and merge. **Trust the Creator** now replaces the Valley Road embed in 202-05, immediately after the cross paragraph under **God Meant It for Good**, before the pastoral care paragraph. The approved widget is byte-identical; `widgets/valley-road.html` remains on disk. All lesson wording, Scripture, metadata and eight question objects/answer IDs are unchanged. `WIDGET-202-05-MOSAIC` is DONE. [Technical evidence](logs/2026-11-13-INTEGRATE-202-05-MOSAIC-codex.md).

This supersedes earlier notices that the mosaic still needs building or Claude wiring. Dave's approval covers this widget's look/wording, not final approval of the complete suffering lesson. Its prose and Piper credit remain for his lesson editing pass. Exact preview, merge and automatic-deploy results are recorded on PR #215.


## Approved Studio Wash v5 widgets: course openers

Dave approved PR #211's v5 widgets at `bd7000c` and requested integration. All four approved files are unchanged. 201-01 replaces the earlier Great Commandment widget at its existing position; 202-01 and 203-01 gain v5 introductions after their welcome/logo blocks and before their stories. Cross the Road and Personal Ministry Map remain in place. All original lesson copy, questions, IDs, Scripture and art are preserved. [Integration log](logs/2026-11-13-INTEGRATE-STUDIO-V5-codex.md).

Independent checks: foundation QA/export 177/storage 64/assets 127/images 1368/iframe 32 pass, exit 0. Local browser 768 assertions across all three courses, three widths and both motion settings pass. Exact wired preview and live deployment are recorded on #211. Widget approval is separate from whole-lesson approval. Older standalone preview URLs in the original PR description refer to the earlier engine; use the v5 lesson pages after integration.

**Pending text:** 202-01's separate editorial PR #202 remains open and must preserve this widget insertion. The widget rollout does not replace its pending lesson draft or authorize unrelated copy changes.


## Greatest Commandment Cross Widgets (Version 5 Studio Wash, 202 and 203 final-slide refinement): November 13, 2026

- **Task / PR:** `WIDGET-GREAT-CMD-CROSS` / [PR #211](https://github.com/davepartin/ministrybag1/pull/211) on branch `gemini/widget-great-command-cross` (`REVIEW` for Dave visual/wording review and Codex integration)
- **Changed files (new/updated in this pass):**
  - `discipleship/widgets/great-command-v5.js`
  - `discipleship/widgets/great-command-v5-201.html` (201 unchanged Studio Wash Edition baseline)
  - `discipleship/widgets/great-command-v5-202.html` (202 Growing Up with refined final slide)
  - `discipleship/widgets/great-command-v5-203.html` (203 Growing Out with refined final slide)
  - `discipleship/widgets/STUDIO-WASH-GUIDE.md`
  - `discipleship/widgets/WIDGET-DESIGN-PLAYBOOK.md`
  - `discipleship/project-management/TEAM-BOARD.md`
  - `discipleship/project-management/logs/2026-11-13-WIDGET-GREAT-CMD-CROSS-gemini.md`
- **Untouched:** all lesson JSON files (`data/*.json`), question IDs, saved answers, `index.html`, `scripts/`, `images/`, Firebase settings/workflows, and 201 slides/colors/navigation.
- **Exact wording for Dave to review (`201`, `202`, and `203`):**
  - **Widget header & `<title>` across all 3 (`201`, `202`, `203`):** `The Greatest Commandment`
  - **202 Growing Up & 203 Growing Out (`Step 3` Cross card):**
    - Heading: `The Cross is our Example`
    - Scripture: `"Walk in love, as Christ loved us and gave himself up for us."` (`Ephesians 5:2`, with **`Walk in love`** and **`Christ loved us`** bolded)
    - Paragraph: `Jesus loved you first and gave Himself for you. His love enables you to love God and your neighbors. You learn to love by receiving His love and following His example.`
  - **202 Growing Up (`focus202`, Step 4):**
    - Heading: `Love in Everyday Life`
    - Scripture: `"So then, as we have opportunity, let us do good to everyone, and especially to those who are of the household of faith."` (`Galatians 6:10`)
    - Paragraph: `Growing Up helps you put God's love into practice at home, in your church family, and among your neighbors, through generosity, faithful relationships, and care in hard seasons.`
    - Stage visuals: single house (`Belong` / `Family & God's family`) on the left and a three-house neighborhood (`BLESS` / `your neighborhood`) on the right, with no bottom pill bubble.
  - **203 Growing Out (`focus203`, Step 4):**
    - Heading: `Make Disciples Where You Are`
    - Scripture: `"Go therefore and make disciples of all nations"` (`Matthew 28:19`)
    - Paragraph: `Pray, listen, eat, serve, and share Jesus with the people around you. Go out and make disciples who will make disciples.`
    - Stage visuals: `1 -> 2 -> 4` pyramid of `203-08` tables (2 seated people per table, purple disciple-maker across from another person) connected by angled multiplication arrows below the `Go` arm, with earlier place labels removed.
- **Checks (all exit `0` after final edit):** `qa_foundation.sh` (32 widget iframe checks), `test_lesson_export.js` (177 checks), `test_answer_storage.js` (64 checks), `check_lesson_assets.js` (126 asset references), and Playwright V5 suite across `201`/`202`/`203` (`390x844` phone, `1280x800` desktop, keyboard `Enter`/`Space`, `Back`/`Next`/`Start Over`, `prefers-reduced-motion: reduce`, zero `localStorage`, zero overflow, `201` unchanged at `cardH=129`/`widgetH=523`). Details in [log](logs/2026-11-13-WIDGET-GREAT-CMD-CROSS-gemini.md).


## 201-10: Dave's nine edits, November13

Dave confirmed nine items. Applied his exact cuts/rewrites, added Repent/Believe headings, integrated trust with Believe, removed the hardest-step prompt, rewrote the process question, and shortened The Father at the Gate 30% while preserving Romans2:4. Three discussion prompts now display10.1-10.3; original IDs remain. Earlier answers to the removed prompt remain exportable only when present; no new prompt is shown. Lesson body1536 to1373 words. All Scripture, art, widget and the approved opening are unchanged. [Evidence](logs/2026-11-13-DAVE-201-10-ROUND2-codex.md). Use the newest live draft after deployment; older PR201 previews are historical.


## 201-10 newest editing draft: November13

Dave asked to stop reviewing outdated lesson versions. Integration of Claude PR201 now combines his full flow revision, teach-it question and course handoff with Dave's approved two-sentence opening. All6original questions, Scripture and Learning Circle steps are preserved. See [integration log](logs/2026-11-13-INTEGRATE-201-10-codex.md). Previous notes that PR201 is waiting or the live lesson lacks its teach-it question are historical after this integration. The November12 B-minus is a score for the older package, not a fresh grade for this draft.

**Review freshness:** before giving Dave an editing link or current grade, check main AND pending lesson PRs. Name the newest version and whether it is live or preview-only. Do not direct him to older live wording without explaining the pending changes. This does not authorize merging unrelated work.


## 201-10 story callback: November13

Dave approved a two-sentence return to the prodigal story:201-01 Father welcome,201-02 new identity, now the son coming to his senses. Replaced only the old Jesus-once-told opening; the rest of the story and Learning Circle are untouched. [Log](logs/2026-11-13-INTRO-201-10-codex.md). Claude PR201 remains open as a separate larger flow revision: **preserve this approved opening when integrating it**. This packet does not replace Claude's other work.


Latest exact wording from Dave: the101-02 Review now says "Baptism is one of the first outward signs of the life God has already started inside you." Its following assurance sentence and all other lesson content are unchanged. See [wording log](logs/2026-11-13-WORD-101-02-BAPTISM-codex.md). This supersedes older notes that the Review sentence was being left for later.

## 101-02 Scripture focus: November 13

Dave accepted the two-cut proposal: remove the inline Galatians2:20 quotation and2Corinthians5:17,21 block, folding new life/adoption into the assurance paragraph under You Can Be Sure. John3:16-17, Romans6:3-4 and1John5:13 remain. Lesson prose count1136 to1049,87 fewer words. All8questions, saved keys, John4-6 assignments, artwork and A-D widget unchanged. Dave only needs to reread the second baptism paragraph and assurance ending. See [log](logs/2026-11-13-FOCUS-101-02-codex.md). This supersedes the earlier suggestion-only status below; final whole-lesson approval remains separate.

## Shared chapter header standard: November 13

Dave chose the John4-6 design as the standard for all embedded Bible chapter headers. READ-HEADER-STANDARD removes the101-02-only gate and duplicate legacy renderer. It covers all21 assigned John chapters today and future bible_reading blocks. No lesson text, question, reading assignment or saved key changes. See [log](logs/2026-11-13-READ-HEADER-STANDARD-codex.md) for scope and the separate101-02 Scripture-load suggestion; that suggestion is not implemented.


## Lesson 101-02 integrated working draft: November 13, 2026

- **Task / PR:** [PR #206](https://github.com/davepartin/ministrybag1/pull/206) on isolated branch `gemini/101-02-updates` off `origin/main` (`a886cb7`)
- **Firebase preview:** https://growing-together-discipleship--pr206-gemini-101-02-upd-psslq7ph.web.app/#101-2
- **Status:** technically integrated through #206 as `4b5dc3c`; final editorial/visual approval remains with Dave ( preserves all question IDs `2-1`, `2-2`, `2-3`, `2-5`, `2-key`, `2-step`, `2-devos`, `2-prayer`, saved reading keys `notes-101-John-*` / `check-101-John-*`, and Scripture blocks). Details in [log](logs/2026-11-13-101-02-WIDGET-READING-gemini.md).
- **Changed files:** `discipleship/widgets/romans-road3.html`, `discipleship/data/101-02.json`, `discipleship/index.html`, `discipleship/scripts/read101_a11y_browser_check.js`, `discipleship/project-management/TEAM-BOARD.md`, `discipleship/project-management/logs/2026-11-13-101-02-WIDGET-READING-gemini.md`.
- **Changed paragraph / card summaries:**
  1. `101-02.json` (`The Greenhouse`, lines 28-31): trimmed `", and everyone can see what was already true."` in paragraph 2, and updated the end of paragraph 3 to `"Baptism is one of the ways that green shoot becomes visible."`
  2. `romans-road3.html` (`Start`, `A`, `B`, `C`, `D` cards, lines 634-675): updated the `Start` intro sentence and removed the instructional helper line; added inline Scripture refs (`Romans 3:23`, `Romans 6:23`, `Romans 5:8`, `Romans 10:9, 13`, `Luke 9:23`), updated `Your part / God's part` across `A..C` (`wages of sin is death` bolded, `"save you from your sins"` in `B`), and added Step `D` (`D. Discipleship: Follow Jesus`, Luke 9:23) with the wood-brown cross transformation and `Start` / `A` / `B` / `C` / `D` pills.
  3. `index.html` (`101-02` `Bible Reading` cards only): added `BIBLE READING` eyebrow + book icon, empty/checked-box `Done` pill, crisp `Open` / `Close` pill, and cleaned `"I've read John X"` footer without trailing hint text; updated `read101_a11y_browser_check.js` for v1 + v2 headers.
- **Items for Dave to reread:**
  1. `101-02.json` (`The Greenhouse`, line 30): `"Baptism is one of the ways that green shoot becomes visible."` (tidied missing `"is"` and `"visable"` -> `"visible"`).
  2. `romans-road3.html` (`Step D`): `"Your part: Live in dependence on the Spirit of God by fighting sin and following the ways of Jesus. God's part: Jesus will be with you every day."`
  3. Adjacent `101-02.json` paragraphs left untouched for your next pass: line 61 (`"three letters, the ABCs of salvation..."` above the 4-stop `A-D` widget) and line 141 (`"Baptism is the first green shoot..."` in `Lesson 2 Review`).
- **Checks (all exit `0`):** `qa_foundation.sh` (`32` iframe, `126` assets, `415` Bible text, `1360` image checks), `test_answer_storage.js` (`64`), `read101_a11y_browser_check.js` (`57`), `read101_notes_browser_check.js` (`36`), `read101_retry_browser_check.js` (`33`), and `101-02` phone (`390x844`) + keyboard integration check.

Codex independent integration review: required QA/export 167/storage 64/assets 126/images 1360 all exit 0; exact-preview reader accessibility 57, notes/Email 36, retry 33, widget 45 and new-header checks 21 all exit 0. Screenshots at phone widths inspected. Runtime source is unchanged by this status note. See [Codex review](logs/2026-11-13-REVIEW-206-codex.md).

## Overnight handoff: November 12

Dave assigned Claude 201-05, 201-10 and 202-01 as three separate editorial jobs. Codex leaves those files untouched. Dave is editing paragraphs; preserve his edits and avoid broad rewrites.

Codex prepared a [37-lesson cadence/editing guide](reviews/2026-11-12-series-editing-guide.md), with measurements and one pointer per lesson. It changes no lesson prose or grades. Separately, FIX-101-AUDIO corrects only the reading-plan sentence in 101-01 to distinguish reading here from listening in a separate audio Bible. RESTORE-LABEL-REVIEW documents why old PR #28 needs a fresh port: 61 current keys are missing from its old label index, 64 old keys are retired, and 109 shared labels differ. Restore behavior remains unchanged. Each packet has its own PR/log and technical checks; final editorial approval stays with Dave.

**Dave tomorrow:** reread just the corrected audio sentence in 101-01. No other paragraphs were rewritten by this batch. Use the chart and editing guide as optional pointers as you comb through each lesson. Check Claude's three PRs before editing those lessons. No new artwork or widget rebuild is claimed.


## Lesson-by-lesson review chart

Dave requested a single chart with a grade, current word count and separate approval for length, questions, lesson text, widgets and images. The [37-lesson review chart](reviews/2026-11-12-lesson-review-chart.md) and [Excel workbook](reviews/2026-11-12-lesson-review-chart.xlsx) use main be039c7, with a consistent count method, all 263 current question prompts and exact-version evidence. The workbook adds a Grade detail sheet with all ten checkpoint scores, the earlier score, the reason and the next improvement for every lesson.

Recorded approval is separated from scoped/partial approval, changed-since-approval and unrecorded status. Ten current lesson texts match recorded approvals (Daniel includes the separately approved age correction); 203-09 has later wording to recheck. Length sign-off is not inferred from the roughly 1,400-word guide; 203-08 keeps Dave's accepted-longer exception. Use this chart for Dave's one-lesson-at-a-time review; do not treat publication or a high grade as approval.

**Refreshed production grades:** average 90.3/100; five AAA (A+), ten A, eleven A-, six B+, three B and two B-. This refresh supersedes the pre-integration grades below for the current assembled packages. Lowest are 201-05 Bible overview and 201-10 Learning Circle at B-. Preserve Dave's requested Learning Circle depth; its review concerns flow, repeated setup, explicit transfer and the older widget review. Suffering is now A- after Joseph art and the pastoral rewrite; stewardship is B+ with the stool and widow sequence, with its retained money-focused questions still to align. These are Codex production estimates using the existing rubric, separate from Dave's final approval. No lesson is edited to raise a grade.

## Current publishing checkpoint: working drafts assembled, November 12, 2026

Dave's latest instruction is to integrate the working pieces now so he can edit one lesson at a time later: "do all this, i can edit the lessons later ... add them to the main". This supersedes earlier per-packet publishing holds for the items below. Integration is not final pastoral, wording, personal artwork or release approval. Preserve Dave's artwork and saved-answer contracts. Firebase configuration, billing, retention and workflows remain unchanged.

| Piece | Integrated work | Later editorial/visual gate |
|---|---|---|
| 101-02 Salvation | New forward-perspective Romans Road, #194. Required suites and 39 independent phone/desktop browser checks pass. | Dave's final widget and wording pass. |
| 101-04 The Bible | Shorter Nicodemus/Discovery Questions lesson, #191; all original question and reading objects preserved. | Nicodemus lamplight artwork/Psalm 119:105 connection remains a separate future packet, not already built. |
| 202-01 Loving neighbors | Grok's four Samaritan frames wired with holds and slow last dissolve, #190; 92 sequence checks pass. | Dave's final art/lesson pass. |
| 202-02 Family | Grok's house sequence timing/rain correction, #188; 77 sequence checks pass. | Final visual/lesson pass; preserve Dave's existing wording. |
| 202-05 Suffering | Claude's Trust the Artist working draft, #195. Codex restored original question 5.5 so saved answers remain visible and exportable; 18 hosted render/data checks pass. | Dave edits wording, length and sources. Mosaic remains prose; no mosaic widget was created. Valley Road retained. |
| 202-06 Worship widget | Gemini's newer side-view mirror, #189; 42 browser checks pass. Corrected its teaching summary so it is not presented as a direct Bible quotation. | Dave's final visual/copy pass. Older #182 closed as superseded. |
| 202-06 Worship artwork | Grok's five prison-chain frames wired in #197; 55 local and 55 exact-preview sequence checks pass on the combined tree; Action 43321746289 succeeded and #197 is integrated. | Final visual editing remains pending. Old artwork retained. |
| 202-07 Stewardship | Widow's four-frame sequence #181, three-T stool #193, source manuscript/brief #192, and assembled whole-life lesson #196. All seven original question objects preserved; Matthew 6:24 and the financial Generosity Ladder retained for Dave's later decision. Widow sequence 69 checks and stool 64 checks pass. | Dave's lesson-by-lesson edit, including final question wording, ladder length, visuals and final approval. |
| 203-03 Emmaus | Grok's four bread-breaking frames, #186; 70 sequence checks pass. Earlier image files retained. | Dave's final art/wording pass. |

Queue cleanup: #179 superseded by #195; #183 duplicate of integrated #185; #187 competing style-guide packet superseded by #184; #182 superseded by #189. Closed without deleting branches or history. The unrelated older #28/#68 and denomination PR #2 remain outside this integration batch.

Required foundation/export/storage/assets/image checks passed throughout the isolated integrations. Final combined source checked at 126 asset references and 1,360 image checks, export 167 and storage 64, all actual exits 0. Saved answers, WEB readings, question IDs and Dave's original artwork files remain protected. See the [integration log](logs/2026-11-12-INTEGRATE-PIECES-codex.md) for exact commands, PR heads and deployment evidence. No physical iPhone/Safari or learner pilot is claimed by desktop automation.

## What the team does next

- **Dave:** edit and approve one lesson at a time on the live site. The integrated pieces are working drafts, not final pastoral/art/release approvals.
- **Codex:** maintain technical integration and address concrete issues Dave finds. This integration batch is complete; no background monitor or unfinished merge job is running.
- **Claude / Fable:** resume editorial work with Dave when tokens are available. Do not restart suffering or stewardship from scratch; read the current main lesson and source notes.
- **Gemini:** the stool, newer mirror and forward-view Romans Road are integrated. Take a new bounded widget assignment or Dave's specific corrections, not another competing implementation.
- **Grok:** Samaritan, house timing, widow, Emmaus and five-frame worship sequences are integrated. Take Dave's next art assignment; do not recreate or rewire these as new jobs.
- **Future design needs, not launched jobs:** 101-04 Nicodemus lamplight art and Psalm 119:105 connection; a possible 202-05 mosaic widget. Keep the 201-10 Learning Circle's depth as Dave requested.

**Verified publishing:** checkpoint main `972c26de`; Firebase Action [43322478865](https://github.com/davepartin/ministrybag1/actions/runs/43322478865) and Pages Action [43322476847](https://github.com/davepartin/ministrybag1/actions/runs/43322476847) both succeeded. All eight affected live lesson JSON files, three widgets and the generated image map matched the tested combined version. Evidence: [integration log](logs/2026-11-12-INTEGRATE-PIECES-codex.md) and [checkpoint #198](https://github.com/davepartin/ministrybag1/pull/198). This board-only refresh makes no runtime change.

**Open PRs rechecked:** only older #28 (restore labels), #68 (finish-plan documents), and #2 (denomination guide, outside this project packet) remain open. None is part of this completed batch. Closed as superseded: #179, #182, #183 and #187. Branches/history retained.

## Claude overnight editorial batch, November 13, 2026

Dave assigned Claude three bounded editorial jobs on the night of November 12, from the [review chart](reviews/2026-11-12-lesson-review-chart.md): focused improvements to existing drafts, not rewrites. One lesson per branch and PR, stopped at REVIEW. Prose only: question objects, IDs, Scripture quotations, readings, widgets, images and sequences unchanged. Question proposals are in each PR body for Dave; on November 13 Dave had the three teach-it questions applied. Codex handles technical integration; Dave approves wording. The three PRs touch different lesson files and different TASKS rows, so they can merge in any order.

| Task | Lesson | PR | Status |
|---|---|---|---|
| TRIM-201-05 | 201-05 Overview of the Bible | [#200](https://github.com/davepartin/ministrybag1/pull/200) | MERGED, Dave approved 2026-11-14. Rewritten around Psalm 119 (The Longest Song) at Dave's direction, replacing Josiah; 1,508 to 1,366 words; teach-it 5.4 added. [Log](logs/2026-11-13-TRIM-201-05-claude.md) |
| FLOW-201-10 | 201-10 Repentance and the Learning Circle | [#201](https://github.com/davepartin/ministrybag1/pull/201) | REVIEW. Story moved up after the recap; 1,534 to 1,503 words, depth kept, teach-it 10.4 added. Log in that PR: logs/2026-11-13-FLOW-201-10-claude.md |
| TRIM-202-01 | 202-01 Loving Your Neighbors | [#202](https://github.com/davepartin/ministrybag1/pull/202) | REVIEW. 1,442 to 1,422 words, teach-it 1.5 added (now five mid-lesson questions); Grok sequence byte-identical, 92 sequence checks pass. Log in that PR: logs/2026-11-13-TRIM-202-01-claude.md |

## Current standing roles: Dave's instruction, November 12, 2026

This is the current operating setup until Dave changes it. Dave finalized these roles in conversation and explicitly asked Codex to post them here so every agent can read the same instructions. This section supersedes conflicting temporary-director, night-shift, lane and merge-authority passages below and in older handoffs. Historical task evidence and completed work remain valid.

| Agent | Standing responsibility |
|---|---|
| GPT / Codex | Technical lead and integration owner: site reliability, saved answers, accessibility, technical tests, PR and preview verification, merging reviewed and approved work, and checking automatic deployments. |
| Claude / Fable | Editorial and design direction, lesson wording with Dave, and team-board organization. |
| Gemini | Widget design and implementation, one bounded assigned widget at a time. |
| Grok | Primary story artwork and image-sequence artist across the series, maintaining the style Dave approves. |
| Dave | Priorities and final pastoral, lesson wording, personal artwork and release approval. |

### How these roles work together

- Each worker uses an isolated branch/worktree, claims a bounded task, commits and pushes its own work, and opens one job per PR. Workers stop at REVIEW.
- Codex has standing technical merge authority for reviewed, passing work. This replaces the previous temporary or night-only delegation; a separate "night shift on" instruction is not required. Codex checks the diff, real test exit codes, applicable phone/keyboard/image behavior and the Action preview, then verifies the automatic live deployment after merging.
- Technical merge authority does not approve unseen lesson wording, theology, personal artwork or a release on Dave's behalf. Dave's applicable approvals must be present before publishing that work.
- Claude coordinates editorial/design work and maintains the board with Dave. Codex owns technical integration; this split does not make Codex the editorial director.
- Gemini's Google affiliation does not itself grant Firebase access. Use connected tools and granted permissions, not product affiliation, to determine access.
- Firebase settings, billing, retention, preview deletion, hosting configuration and workflows remain outside this role change. Dave's instruction to leave Firebase unchanged remains in force unless he explicitly changes it. Use the existing automatic publishing process; no manual deployment.
- The older art assignments to Gemini, widget-build assignments to Grok, and standing prose-trim queue for Codex below are superseded as future default lanes. Preserve in-progress work and existing PRs; do not discard, duplicate or silently take over a claimed task. Reconcile individual task ownership on the board before starting another job.
- Keep lessons, question IDs, reading keys, saved answers and WEB text intact outside an expressly assigned change. No course PDFs and no new 101-06 changes are authorized here.
- These are standing responsibilities, not an instruction to launch background agents or begin every backlog item. Dave may assign exceptions.

This update changes coordination documentation only. It does not merge an existing implementation PR or claim that an earlier preview, test or deployment passed.

## Content source for Claude: 202-05 suffering

Dave asked Codex to preserve his spoken thoughts for future writing in [202-05: Dave's collected thoughts on suffering](reviews/2026-11-12-202-05-dave-content-collection.md). Read this before drafting 202-05. It captures three possible suffering categories, sharing Christ's sufferings, future glory, peace in God's presence, suffering versus punishment, Job's limited perspective, the stained-glass idea, refining, empathy and resilience. Dave's ideas are distinguished from Codex's research suggestions. This is source material, not final wording approval or an instruction to build a widget. Claude owns the editorial follow-up under the standing roles.

Update, November 12: Claude's redraft is integrated through #195, with original question 5.5 restored so existing responses stay visible and exportable. The phrase is "Trust the Artist"; the mosaic is taught in prose and Valley Road remains. Dave's final edit/source review is pending. #179 is closed as superseded; do not restart that trim. The mosaic widget is still unassigned. Details: [rework log](logs/2026-11-12-L-202-05-REWORK-claude.md).

## Content source for Claude and Gemini: 202-07 stewardship

Dave wants time, talents and treasure to become the memorable center of 202-07, with whole-self stewardship rather than money alone. He proposed replacing the upside-down bills treatment with a stool drawn from three Ts: the upper strokes form a triangular seat and the stems become three legs. Read [Dave's stewardship and three-T stool direction](reviews/2026-11-12-202-07-dave-stewardship-stool.md) before drafting or building. The note includes Dave's actual words and candidate design steps. Claude develops wording with Dave; Gemini handles a separately claimed widget packet; Codex verifies integration. 203-04 already applies the three Ts to serving and remains unchanged. This collection remains the source direction. The manuscript/brief #192, stool #193, widow sequence #181 and assembled whole-life lesson #196 are now integrated. All seven original question objects, Matthew 6:24 and the financial ladder remain for Dave's later edit. No final wording or visual approval is implied.

## Worker handoff: completed integration batch

| Work | Current main state | Next action |
|---|---|---|
| 202-05 suffering | #195 integrated. Question 5.5 restored, with existing responses visible and included in Email. Former data-access hold resolved. | Dave's wording/source/length review. No competing rewrite. |
| 202-07 widget and lesson | #181/#192/#193/#196 integrated: widow sequence, source manuscript, stool, whole-life teaching. Original question objects preserved. | Dave edits the complete lesson; Claude assists when available. |
| 202-06 worship | Newer mirror #189, Grok's five-frame chain sequence #197 integrated. Older mirror #182 closed. | Dave's visual/wording pass; no pending sequence wiring. |

Use the live site for review: [Suffering](https://growingtogetherdiscipleship.com/#202-5), [Stewardship](https://growingtogetherdiscipleship.com/#202-7), [Worship](https://growingtogetherdiscipleship.com/#202-6). Prior temporary preview links and pre-integration findings are historical evidence in the logs.

## Earlier discussion record: November 12, 2026

This records the earlier conversation and its decisions. Status and next-action statements in this dated record are superseded by the current publishing and worker-handoff sections above. Four lessons received substantive discussion; final wording and artwork approval remain Dave's.

| Lesson | What Dave clarified or requested | Material / current status | Next owner and action |
|---|---|---|---|
| 202-05 Suffering and Trials | Keep Joseph and Genesis 50:20 central, with a mosaic/stained-glass picture of our limited view and God's greater purpose. Teach three or fewer kinds of suffering, sovereignty/providence, peace within pain, Christ's sufferings and future glory, refining and practical care. Honor real pain; a lesson should be a salve, with companionship and mourning alongside those who mourn. Use fewer well-developed Scripture passages. | [Content collection with Dave's own words](reviews/2026-11-12-202-05-dave-content-collection.md), organized into seven preparation themes. No live rewrite or new widget built. | Claude develops a focused manuscript with Dave. The mosaic remains a candidate widget idea, not a launched Gemini/Grok job. Verify recalled Piper attribution before using it. |
| 101-04 The Bible | Preserve why Scripture matters and the Three Discovery Questions exercise; shorten repeated setup because three John chapters already add reading load. Nicodemus should open the story and revisit John 3 from the learner's earlier reading. Keep the connection to 201's map/story/OIA progression. Proposed two-image oil-lamp reveal recalls Psalm 119:105. | [PR #191](https://github.com/davepartin/ministrybag1/pull/191), head ef04432: 1,514 to 1,167 words; all nine question objects, three existing verse blocks and John 10-12 unchanged. Required suites pass; Action preview succeeds; 30 local and 30 preview browser checks pass, actual exits 0. Additional lamp/Psalm direction is in the PR comments and is not yet in the draft. | Dave/Claude review exact prose and the five-question exception. Grok owns a separately claimed Nicodemus art packet. Psalm 119:105 and proposed connecting prose still need wording review. No merge performed. |
| 201-10 Repentance and the Learning Circle | Dave values the existing tool and its healthy teaching. As the final 201 lesson, it can appropriately challenge learners with more depth. Preserve that depth; assess whether the follow-up helps someone learn the tool or unnecessarily makes them learn it twice. | Discussion only. No revision, widget rebuild, question change or new audit completed. Earlier B-minus is not an instruction to simplify away the tool. | Claude/Dave review flow when this packet is assigned. Do not start a rewrite from the old grade alone. |
| 202-07 Giving and Generosity | Dave explicitly called for a rewrite. Stewardship comes first: caring for what belongs to God. Main framework: time, talents, treasure, one whole life entrusted to Him. Replace the draft upside-down bills concept with a stool built from three Ts. Faithfulness with little does not promise wealth; Dave explicitly rejects prosperity teaching and affirms faithful people in poverty. | [Source words and concept](reviews/2026-11-12-202-07-dave-stewardship-stool.md). [PR #192](https://github.com/davepartin/ministrybag1/pull/192) contains a complete 1,210-word review manuscript, proposed questions mapped to existing IDs, and a Gemini widget brief. Required baseline suites pass, actual exits 0. Markdown only; current JSON/widget unchanged. Action result will be posted on the PR. | Dave/Claude review manuscript and the proposed ladder/question changes. Gemini claims the bounded stool widget implementation after brief review. Codex verifies integration. Preserve Grok's separate widow-art PR #181. 203-04 already uses the three Ts for serving and remains unchanged. |

### Other outcomes from this conversation

- Standing team roles are established at the top of this board: Codex technical integration; Claude editorial/design direction and board organization; Gemini widgets; Grok story art/sequences; Dave final priorities, pastoral/wording/art/release approval.
- GitHub is the current source of truth; Dave said he is working in the cloud. Do not require Mac access to continue ordinary repo work.
- The 37-lesson scorecard is a dated production estimate, not final pastoral approval. Correction: 203-10 was B, not C-plus. 202-05 was the C-plus.
- Other B-minus lessons discussed as possible later conversations: 101-03 prayer, 101-07 repentance, 201-05 Bible overview, 202-01 loving neighbors. These mentions are not new implementation assignments or fresh audits. Read current files before recommending repairs.
- Work remains one bounded job per PR. 101-04 is at REVIEW; 202-07 is a manuscript/widget proposal at REVIEW. No live lesson changes, manual deployment or Firebase configuration changes were performed for these packets.

## Earlier board and task history

The following sections retain prior assignments and dated evidence. Read them subject to the current standing roles above.

Started 2026-11-12 at Dave's request. This is the one page every agent reads before working. Dave Partin owns the content and final pastoral approval. Claude (Fable 5.1) is the usual director; ChatGPT/Codex is temporarily covering coordination and reviewed merges under Dave's delegation below. New question wording and changes to Dave's voice still go to Dave for approval.

## Temporary coordinator, 2026-11-12 (ended; see Batch 1 note)

**Update, 2026-11-12 morning:** Claude is back and reviewing again. The night-shift delegation (ChatGPT merges reviewed, passing art and reader fixes while Dave sleeps, never lesson wording) continues only if Dave says so; until he does, PRs stop at REVIEW for Claude and Dave.

Claude is unavailable. Dave asked ChatGPT/Codex to lead and confirmed: "Merge reviewed, passing PRs." Only the acting coordinator has this merge delegation. Other agents still push one job per PR and stop for review. Use separate worktrees, verify process exit codes and previews, and let the automatic Actions deploy. No manual deployment or force push. This temporary arrangement ends when Dave restores Claude or changes the instruction; it does not confer lesson, theology, or personal art approval.

Integrated after coordinator review: #161 tooling, #155 Daniel story art for 203-06, and #162 early-church art for 202-03. Checks and automatic deployments pass. Evidence: logs/2026-11-12-COORD-003-codex.md. Older #28 and #68 need a fresh current-state review; #2 is outside this discipleship assignment.

Companion documents: `HANDOFF.md` (how the system works), `TASKS.md` (the task rows), `reviews/2026-11-11-series-review.md` (the lesson standard and Dave's editing patterns), `DAVE.md` (approvals), `logs/` (evidence).

## The team

| Agent | Model | Lane | Branch prefix |
|---|---|---|---|
| Dave | | Reads previews on his phone, sends revisions, says "merge it" | |
| Claude | Fable 5.1 | Usual director, currently unavailable. New voice/question wording remains subject to Dave's approval. | `claude/` |
| ChatGPT | GPT 6.1 | Acting coordinator and reviewer under the temporary delegation; code and mechanics remain its implementation lane. | `codex/` |
| Gemini | Gemini 4 | Story art for 201 and 202, and the documentation set (templates, checklist, compass) | `gemini/` |
| Grok | Grok | Story art for 203 and 101, widget art and polish | `cursor/` or `grok/` |

## Standing rules for every agent

1. Work in your own git worktree or branch, never in the main checkout at `~/github/ministrybag1`. Push, open a PR, wait. Merge publishes both sites. Only the acting coordinator may merge reviewed, passing PRs under Dave's temporary delegation; other workers must stop. No agent deploys by hand.
2. One job per PR. Run from `discipleship/`: `bash scripts/qa_foundation.sh`, `node scripts/test_lesson_export.js`, `node scripts/test_answer_storage.js`, `node scripts/check_lesson_assets.js`, plus `node scripts/test_lesson_images.js` for images and `node scripts/test_widget_iframe.js` for widgets. Paste the results in the PR.
3. Write a log in `logs/YYYY-MM-DD-<ID>-<agent>.md` and add or update your TASKS row. The acting coordinator maintains the boards and DAVE.md; delegated integration is not a new pastoral or personal art approval.
4. The Firebase Action posts the preview link on the PR within a few minutes. Put the lesson hash on it when you report to Dave, for example `#201-3`.
5. Lesson text: read the standard and "How Dave edits" in the review plan first. Do not change a question Dave has approved; propose the new wording in the PR and let the current coordinator take it to Dave. No em dashes, never the words "record", "arc" or "gives way". One bold line per section at most.
6. Images: run `node scripts/build_lesson_images.js` so new art ships as small WebP copies, keep originals, and follow `story-image.md` for sequences and stops.
7. Never store Dave's email, keys or passwords in the repo. Never touch Firebase configuration, workflows or the sign-in code without a task from Claude.
8. If you are blocked or the task changes shape, stop and write it in the PR instead of guessing.

## Lessons learned (read these, they cost us time)

- **The art is one look, Dave's marker-sketch look, and it drifted on 2026-11-12.** Read "The look" and "Already made: check before you generate" at the top of `story-image.md` before any art job. Attach `images/good-samaritan-story.jpg` as the style reference when generating. Black ink, grey marker, white paper, at most one or two small color accents. No full-color paintings, no sunsets, no storybook faces. Never replace a file Dave drew without his word; several of his finished pieces were replaced by generated scenes this week.

- **Firebase hosting storage is finite (10 GB on the free plan) and every preview is a full copy of the site.** On 2026-11-12 fifty preview channels filled it and new previews were refused with HTTP 429. Claude deleted the 48 channels of merged PRs with Dave's approval; previews now expire after 3 days; original JPG and PNG files are no longer uploaded to hosting because every lesson serves the WebP copies (the originals stay in the repo and on ministrybag.com). If a 429 appears again: do not delete anything yourself; tell Dave and Claude. Dave can also lower "release storage settings" in the Firebase console (Hosting, Usage) so old live versions are pruned automatically.
- **Claim before you start.** Put your name on the TASKS row (owner column) and push that row in your first commit before generating art or code. On 2026-11-12 Grokbot worked Gemini's queue under a gemini/ branch name; the work was good but two bots could easily have done the same lesson.

- **Install the pinned tools in each worktree.** TOOLING-001 merged as #161. From `discipleship/`, run `npm ci` for sharp and Playwright; no desktop-specific NODE_PATH is needed. See README.md for Node and browser prerequisites. If a build prints only a Node version line, it crashed and wrote nothing. Check the process exit code and generated outputs before committing.
- **Check exit codes, not the last line.** `bash scripts/qa_foundation.sh | tail -1` always exits 0. Run the script, then `echo $?`, or use `set -o pipefail`. Claude merged a red asset map on 2026-11-12 because of this.
- **Do not edit the image list by hand.** Since #154 the build script finds every file in `images/` on its own. Art PRs add the image files, run the build, and commit the regenerated `scripts/lesson-image-assets.js`. Two art PRs editing the list at once caused a conflict on 2026-11-12.
- **Parse-check widget scripts.** An apostrophe inside a single-quoted string took a widget down for one preview build. Run `node --check` on each inline script, or write text with double quotes.

## AAA scorecard (37-lesson production audit)

Refreshed November 12, 2026 against main `d9065c7`, including #155, #162 and #164. Full [scorecard, rubric and measured inventory](reviews/2026-11-12-aaa-37-scorecard.md). All 37 lessons are substantive drafts. **Overall: 86.8%, about 87%, toward the scored production standard; three AAA (A+) lessons and seven at 95%.**

Ten production checkpoints score 0/5/10 each. **100 = AAA (A+), 95 = A, 90 = A-, 85 = B+, 80 = B, 75 = B-, 70 = C+.** These are current production-completeness estimates, not hours-left, new pastoral/art approval, or release/pilot readiness. The previous "7 AAA" summary was inconsistent with its own six marked rows; the current count below uses one explicit rubric. No approved lesson wording is changed by a grade.

| Lesson | Toward AAA | Grade | Remaining Work / Next Action |
|---|---:|---|---|
| 101-01 | 85% | B+ | Trim repeated introduction and mentor material; remove promised audio; add a pass-it-on question; settle opener art. |
| 101-02 | 95% | A | Reduce five questions to three or four. The explain-to-a-friend question already exists (2.3). |
| 101-03 | 75% | B- | Add story art and a teach-it question; reduce five questions. Daily Prayers already supplies the reusable tool. |
| 101-04 | 75% | B- | Move Nicodemus into an opening story; add art; trim repeated framing; reduce five questions. Keep Discovery Questions and 4.5. |
| 101-05 | 85% | B+ | Let the potluck carry the lesson; add a teach-it question. The service checklist counts as its tool. |
| 101-06 | 95% | A | Propose shorter versions of 6.2/6.4; preserve Dave's wording until he approves. No new widget is required. |
| 101-07 | 75% | B- | Add story art and a teach-it question; light trim. Stop, Turn, Tell, Receive is already a usable exercise. |
| 201-01 | 95% | A | Finish the queued great-command widget review; keep the existing explain-it question. |
| 201-02 | 95% | A | Finish the queued great-exchange3 widget review; existing 2.2 already teaches the idea back. |
| 201-03 | 100% | AAA (A+) | No known production gap in this rubric; retain GUIDE and the existing explain-it question. |
| 201-04 | 85% | B+ | Light trim and add a teach-it question; keep Gospel Heart and the completed root sequence. |
| 201-05 | 75% | B- | Replace plain story art; trim reliability/translations material; add teach-it; review bookshelf widget. |
| 201-06 | 90% | A- | Trim the extra resource and repeat framing; review storyline widget. Existing 6.4 is already teach-it. |
| 201-07 | 90% | A- | Reduce five questions; turn the strong practice/sharing section into an explicit teach-it question. |
| 201-08 | 85% | B+ | Add teach-it and complete grace-diagram review; keep any remaining theology/wording decisions with Dave. |
| 201-09 | 80% | B | Trim the pruning detour; simplify the long question by proposal; add teach-it; review fruit widget. |
| 201-10 | 75% | B- | Move the story earlier; trim the opening/repeats; add teach-it; review circle widget/setup and translation labels. |
| 202-01 | 75% | B- | Use one story-art treatment; trim stacked teaching and widget setup; propose simpler questions plus teach-it. |
| 202-02 | 100% | AAA (A+) | No known production gap in this rubric; preserve the three R's, family roles and teach-it question. |
| 202-03 | 90% | A- | Retell the formal church-definition paragraph plainly; add teach-it. New early-church art is integrated. |
| 202-04 | 100% | AAA (A+) | No required production gap in this rubric; optional shorter lead-in/4.4 can be proposed without replacing Dave's wording. |
| 202-05 | 70% | C+ | Add Joseph art; combine repeated suffering sections and widget setup; reduce five questions and add teach-it. |
| 202-06 | 85% | B+ | Add midnight-prison story art; reduce five questions. 6.2 already asks for worship in the learner's own words. |
| 202-07 | 75% | B- | Add widow story art and teach-it; review stewardship widget. The Generosity Ladder is already present. |
| 202-08 | 90% | A- | Propose one teach-it question for Dave; keep his approved covenant/chisel wording. |
| 202-09 | 85% | B+ | Propose shorter 9.1/9.2 and a teach-it question; do not replace approved questions without Dave. |
| 202-10 | 95% | A | 10.4 names an observer but not what the learner would explain; propose an explicit teach-it version for Dave. |
| 203-01 | 85% | B+ | Upgrade plain mountain art; add a teach-it question tied to the ministry map. |
| 203-02 | 90% | A- | Upgrade plain Nehemiah art and trim the performance section; make the prayer-card step stand alone without an earlier map. |
| 203-03 | 90% | A- | Add Emmaus/table story art; keep the two practical tools; make the prayer-card reference self-contained. |
| 203-04 | 95% | A | Propose shorter 4.2/4.3 without losing Dave's wording. The time/talents/treasure exercise is sufficient; no widget is required. |
| 203-05 | 90% | A- | Trim bridge/faithfulness repetition and the lengthy walkthrough; review three-circles setup/widget. Existing draw-it step is strong. |
| 203-06 | 95% | A | Make the prayer-name application an explicit pass-it-on step by proposal. Daniel art and age clarification are live; art approval remains separate. |
| 203-07 | 90% | A- | Add story art for Jesus sending the 72. Verse-sharing in 7.4 already passes the transfer test. |
| 203-08 | 90% | A- | Finish Paul/Timothy color art; propose shorter questions for Dave. Keep his accepted longer lesson and SPACES. |
| 203-09 | 85% | B+ | Add Priscilla/Aquila art; strengthen the mission-choice question into an explicit teach-it step by proposal. |
| 203-10 | 80% | B | Add art for the current body-of-Christ story and teach-it; reconcile older Bezalel metadata without changing lesson scope. |

Current inventory: 21 lessons have sequence/dissolve art, six have plain pictures needing an upgrade, ten have no story art. The 16 art assignments remain nine Gemini and seven Grok. Six lessons have five mid-lesson questions: 101-02, 101-03, 101-04, 201-07, 202-05, 202-06. Transfer is strong/present in 16, implicit/weak in four, missing in 17; use the linked report instead of the older teach-it list. In particular, 101-02 2.3 and 202-06 6.2 already provide transfer; 202-10, 203-06 and 203-09 need clearer transfer proposals.

Shared checks currently pass: foundation QA, export 143, storage 64, assets 102, lesson images 1075, widget iframe 32, public-site browser 387; each process exited 0. This does not finish the older-widget review or physical-device/pilot gates. The older-widget review remains queued; no new widget is mandatory where an exercise works. Optional candidates remain 101-04 Three Discovery Questions, 101-07 Stop Turn Tell Receive, 203-02 prayer card and 203-03 listening; Dave decides.

## Lanes and queues (take the top item of your lane)

## Batch 1 (November 12, overnight): complete

All nine jobs merged: ART-202-05 Joseph, ART-203-07 Sends the 72, ART-203-03 Emmaus, READ-101-NOTES, READ-101-RETRY, READ-101-A11Y, plus 202-03 and 203-06 art and TOOLING-001. Claude is back as reviewer. The night-shift merge delegation to ChatGPT applies only when Dave says "night shift on" for that night.

## Batch 2: an A in every lesson (opened November 12, 2026)

Goal from Dave: every one of the 37 lessons at an A on ChatGPT's audit (`reviews/2026-11-12-aaa-37-scorecard.md`), then AAA. Today 3 lessons are AAA, 8 are A, 9 are A-, and 17 sit at B+ or below. This batch goes after the lowest grades first. Same rules as Batch 1: one job per PR, your own worktree, claim the TASKS row in your first commit, checks with exit codes, `npm ci` then `node scripts/build_lesson_images.js` for any art, stop at REVIEW. Nobody but Claude words a question; proposals go in the PR body.

| Agent | Order | Task ID | Lesson (grade) | Job and acceptance |
|---|---:|---|---|---|
| ChatGPT | 1 | TRIM-202-05 | 202-05 Suffering (C+) | SUPERSEDED 2026-11-12 by Claude's redraft from Dave's direction (see top of board); skip to TRIM-101-04. Original brief: Joseph art is in. Combine the repeated suffering sections and the widget set-up, bring the lesson under 1,400 words, and in the PR body propose which of the five questions to drop and one teach-it question. Text only; no art, no widget edits. |
| ChatGPT | 2 | TRIM-101-04 | 101-04 The Bible (B-) | Center the lesson on the Three Discovery Questions and the practice; cut repeated framing; under 1,400 words; propose which of five questions to drop (keep 4.5). Leave room for the Nicodemus opening story that Gemini's art will illustrate. |
| ChatGPT | 3 | TRIM-201-10 | 201-10 Repentance (B-) | Move the prodigal story earlier, trim the opening and repeats, under 1,400 words, propose a teach-it question. Keep the Learning Circle steps and credits. |
| Gemini | 1 | ART-202-01 | 202-01 Neighbors (B-) | Replace the plain picture with one charcoal treatment (dissolve or sequence) for the lesson's actual story. New art and image block only. |
| Gemini | 2 | ART-201-05 | 201-05 Overview of the Bible (B-) | Replace the plain story art with a charcoal treatment of the lesson's story. Do not touch the bookshelf widget; Claude reviews it. |
| Gemini | 3 | ART-101-04 | 101-04 The Bible (B-) | Charcoal dissolve for Nicodemus coming to Jesus at night (John 3), to sit as the opening story. Coordinate with ChatGPT's TRIM-101-04 only by merge order; do not edit prose. |
| Grok | 1 | ART-202-06 | 202-06 Worship (B+) | Paul and Silas at midnight, the pair Grok already generated. Wire, optimize, check, PR. |
| Grok | 2 | ART-202-07 | 202-07 Generosity (B-) | The widow's two coins, the pair Grok already generated. Wire, optimize, check, PR. |
| Grok | 3 | ART-203-09 | 203-09 Missions (B+) | Priscilla and Aquila at the tentmaking bench, charcoal dissolve. |
| Claude | 1 | QUESTIONS-A | all | Word with Dave the teach-it questions and shorter questions the audit asks for: 101-05, 201-04, 201-07, 201-08, 202-03, 202-08, 202-09, 202-10, 203-01, 203-04, 203-06, 203-09, and the proposals ChatGPT files. One PR per course. |
| Claude | 2 | WIDGET-REVIEW | 201-01, 201-02, 201-05, 201-06, 201-08, 201-09, 201-10, 202-07, 203-05 | Review each pre-standard widget on a phone; list rebuild or keep; Dave picks; Claude rebuilds like romans-road2. |
| Claude | 3 | SCORECARD-SCRIPT | all | `scripts/aaa_scorecard.js` so the grade table regenerates from the lesson files. |

After this batch, the next grades to lift are 101-03, 101-07, 203-10, 201-09, 101-01, 203-02 and 203-08 art, then the A- lessons' light trims (201-06, 201-07, 202-03, 203-02, 203-05). Those are the lane backlogs below.

### ChatGPT (GPT 6.1)
1. Batch 2: TRIM-101-04, TRIM-201-10, in that order (TRIM-202-05 superseded by Claude's redraft).
2. Backlog, one lesson per PR, light touch: 201-05, 202-01, 101-07, 101-01 (also remove the sentence promising audio), 101-05, 201-09, 201-06, 201-07, 202-03, 203-02, 203-05, 202-06, 203-03. In each PR, propose question changes and a teach-it question in the body; never change an approved question.
3. After the trims: run the scorecard script and report which lessons are A and AAA.

### Gemini (Gemini 4)
1. Batch 2: ART-202-01, ART-201-05, ART-101-04, in that order.
2. Backlog art: 101-07, 101-03, 101-01.
3. DOCS-STANDARD: update `LESSON-TEMPLATE.md` (101 closing is four questions), `AI-LESSON-CHECKLIST.md` (new exemplars 202-08, 202-09, 202-10, 203-06, 203-09, 203-08; teach-it question; never name a widget in prose), and `DISCIPLESHIP-COMPASS.md` (the seven-point standard).
4. Keep the inventory in `story-image.md` current as art lands.

### Grok
1. Batch 2: ART-202-06, ART-202-07, ART-203-09, in that order.
2. Backlog art: 203-10, 203-01, 203-02, 203-08 (Paul and Timothy color layer).
3. Widget builds only from a spec Claude posts here, after Dave picks from the widget candidates.

### Claude (Fable 5.1)
1. Review every PR the day it opens: checks with exit codes, preview on a phone-size screen, the plan checklist, Dave's editing patterns. Verdict for Dave.
2. Batch 2: QUESTIONS-A, WIDGET-REVIEW, SCORECARD-SCRIPT.
3. Keep this board, TASKS, DAVE.md and HANDOFF current. Anything touching Dave's voice, sign-in, Firebase or the workflows.

## Review order

The acting coordinator reviews in this priority: anything blocking a learner (broken page, lost answers) first, then content Dave asked for by name, then the lanes in the order above. Under the current delegation, Codex merges reviewed, passing PRs one at a time and verifies the automatic deployments. Dave can change or end the delegation. Coverage is manual in the current chat; no background monitor is configured.

## How to add to this board

Any agent may add a row under "Proposed" in TASKS.md. Only the current coordinator moves work onto a lane here, after Dave agrees.
