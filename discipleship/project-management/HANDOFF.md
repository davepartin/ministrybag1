# Resume here

## 203-01 Claude rewrite approved, November 14, 2026

Dave explicitly approved Claude's 203-01 rewrite and accompanying work in chat on November 14 ("i approve of the work that claude did"). Approval source: PR #225 at 96fd1a685b89cb116304d989bdb70996cb1e4164. The exact approved lesson and TOC wording are preserved: Four Friends and a Roof, Love has names, Think beyond your tree, the Great Commission, the existing map and the practice. Four discussion questions and three closing questions remain. The original names question 203-01-4 and closing trio are unchanged; three original retired prompts reserve their IDs and existing answers. Protect this approved wording from unassigned rewrites. This is approval to integrate the work, not a separate Gold-stage or pilot/release declaration.

The Love Has Names map brief and Four Friends art brief are approved planning documents only. Neither replacement widget nor story art is built by this PR. Both current widgets remain unchanged and functional; new components need their own implementation, preview and Dave visual approval. The existing 203-02 names-map dependency is preserved. PR #221 was already merged and verified live; Claude's earlier note that it is still waiting is historical.

Evidence: [Codex integration log](logs/2026-11-14-REWRITE-203-01-codex.md), [Claude writing log](logs/2026-11-14-REWRITE-203-01-claude.md), and PR #225 for preview/live checks.

## Approved four-story sequence integration, November 14, 2026

Dave approved all four story-art sequences in PR #240 at 419c6a7: 101-07 shepherd (4 frames), 201-05 lamp (2), 203-02 Nehemiah (3), and 203-07 Jesus sends the 72 (4). All 13 original frames, 26 optimized WebP copies, stops/order, touchNext placement and image-map additions are preserved. The original jesus-sends-72.jpg remains unchanged on disk. Lesson wording, Scripture, questions/IDs, reading keys, index.html and the recently approved widgets remain untouched. This records story-image approval only, not whole-lesson Gold or new wording approval.

Evidence: [Codex integration log](logs/2026-11-14-ART-STORY-SEQUENCES-4-codex.md), PR #240 for exact-head preview and production verification.

## Approved 202-09 RUN integration after triangle #239, November 14, 2026

Dave approved only the RUN from Sin widget at 3e1325b6ad2af3019ebea5384d805e019a577dfa in PR #234, following already-merged triangle PR #239 (81b028b). Both starting-gun.html and covenant-triangle.html remain byte-identical to their approved commits (3e1325b and 2c2eb09). Main was merged normally into this branch, retaining all newer frame integrations and both board histories. The sole runtime diff from current main is starting-gun.html. All lesson JSON, index.html, question objects/IDs, reading keys, saved answers and unrelated lessons remain unchanged. Component approval only; no new whole-lesson or image approval is inferred.

Evidence: [Codex integration log](logs/2026-11-14-WIDGET-202-09-STARTING-GUN-codex.md), PR #234 for exact-head preview and live verification.

## Approved 202-08 frame integration, November 14, 2026

Dave approved only the 202-08 covenant-triangle.html frame at 2c2eb09804ccab6bf7478b24c2e93bda8ea0ce17 in PR #239. The approved HTML bytes are unchanged. All lesson JSON, index.html, question objects/IDs, reading keys, saved answers, diagram artwork and unrelated runtime files remain unchanged. The four original step titles, teaching text and Scripture strings compare exactly to main. This component approval does not award whole-lesson or image approval.

Evidence: [Codex integration log](logs/2026-11-14-WIDGET-202-08-FRAME-codex.md), PR #239 for preview and live verification.

## Approved 201-08 frame integration, November 14, 2026

Dave approved the 201-08 Grace and Mercy Cycle Studio Wash frame at 1404ab8 in PR #238. Diagram artwork, colors, step text, Scripture and lesson JSON remain unchanged. Integration found and corrected only the sizing helper: measure the tray content width without its horizontal padding, so the long grace card no longer moves the navigation by 22px. All approved frame styling remains unchanged. This is component approval, not whole-lesson or image approval.

Evidence: [Codex integration log](logs/2026-11-14-WIDGET-201-08-FRAME-codex.md), PR #238 for preview and live verification.

## Approved 101-05 potluck buttons, November 14, 2026

Dave approved PR #232 at b83efe3: the compact three-column single-screen checklist, prompt and blue/teal/mustard serving buttons. Approved index.html and 101-05 JSON are byte-preserved. Old numeric slots remain reserved, including combined men's/women's ministry at 11; new choices append at 27 and 28. Other stays visually last without moving its DOM/storage index. All other wording, question objects, readings and aspen artwork remain unchanged. Whole-lesson text remains Silver and Dave edits stay protected.

Evidence: [Codex integration log](logs/2026-11-14-BUTTONS-101-05-POTLUCK-codex.md), PR #232 for preview and live verification.

## Approved 101-06 BLESS integration, November 14, 2026

Dave approved PR #233 at 7949607: BLESS Rhythms widget and the BLESS section copy/placement. Both runtime files remain byte-identical to that approval. The approved change replaces the static BLESS graphic and box and adjusts the invitation to tap through. The original graphic remains on disk; woman-at-the-well story art, other prose, Scripture, John 16-18 readings and all eight question objects/IDs remain unchanged. Text remains Silver and earlier Dave edits stay protected. This is a specific new 101-06 assignment, not permission for broader changes or new art.

Evidence: [Codex integration log](logs/2026-11-14-WIDGET-101-06-BLESS-codex.md) and PR #233 for exact-head preview and live deployment.

## Approved 101-04 widget integration, November 14, 2026

Dave approved only the Read, Discover, Respond widget in PR #229 at 21bb29b. Its HTML bytes and placement are preserved: after "These questions give you a place to begin..." and before Try It: Nicodemus Meets Jesus. All existing 101-04 copy, Discovery Questions box, Scripture, John 10-12 readings and nine question IDs remain unchanged. Text remains Silver for Dave's later review; no image or whole-lesson Gold approval is inferred.

## 101-05 requested serving and teaching flow edits, November 14, 2026

Dave confirms 101-05 remains Silver. Applied only his requested serving choices and moved the unchanged 5.3 prompt after the potluck teaching (including its supporting verse), before the checklist. Teaching and Discipleship Group are separate; Cleaning Team, Community Service Team, Lawn Team, Hospitality and Other are added. First Impressions, Financial Giving and the old combined Teaching / Bible Study tile are hidden. Original numeric positions remain reserved so saved selections are not reinterpreted; Email identifies a selected old option as an earlier selection. All other copy, question objects/IDs, reading keys and images stay unchanged.

## 101-01 component Gold and question retirement, November 14, 2026

Dave approved the 101-01 course logo and Peaks and Valleys V2 widget Gold. Only question 1.5 (Who will you tell...) is removed from view; its unchanged original object is reserved in retiredQuestions so saved answers still export. All other wording, readings, questions, logo and widget bytes stay unchanged. Whole-lesson text remains Silver and protected.

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


## Studio Wash v5 integration, November 13

PR #211 is being integrated at Dave's request. His approved source is `bd7000c`; the four v5 files remain byte-identical. The wired lessons are 201-01 (replacement), 202-01 and 203-01 (new opening widgets). All original copy/questions/IDs/Scripture remain; Cross the Road and Personal Ministry Map are retained. [Verification and placement](logs/2026-11-13-INTEGRATE-STUDIO-V5-codex.md). Use the verified v5 lesson pages after deployment, not the older cross-engine preview links in the historical PR body. 202-01's text revision in #202 is still separate and must retain the v5 intro.


## Latest201-10 edit pass: nine items from Dave

Dave's exact prose changes and clearer Repent/Believe sections are applied. The removed hardest-step question is absent from the lesson; prior answers remain in Email only when saved. Display questions are10.1-10.3 with existing IDs. Father section 30% shorter, Scripture/widget/art/opening preserved. [Full change record](logs/2026-11-13-DAVE-201-10-ROUND2-codex.md). This supersedes the earlier201-10 flow-only editing link.


## Edit the newest201-10 draft

Claude PR201 is being integrated with his full flow revision and teach-it question plus Dave's approved story callback. [Integration evidence](logs/2026-11-13-INTEGRATE-201-10-codex.md). Use the verified live version after deployment; older PR201 previews lack the callback. Before sending Dave to another lesson, check main and pending PRs and clearly identify the newest version. Older201-10 waiting notices below are historical after this integration. Final wording approval remains with Dave.


Latest201-10 edit: Dave approved the two-sentence callback to the first two Growing Deep lessons, then a return to the pigpen and repentance. Only that story opening changed. Claude PR201 remains open; preserve this callback when integrating his flow revision. [Evidence](logs/2026-11-13-INTRO-201-10-codex.md).


Latest101-02 wording: Dave supplied the exact Review sentence "Baptism is one of the first outward signs of the life God has already started inside you." Applied without any other lesson-text changes. See [log](logs/2026-11-13-WORD-101-02-BAPTISM-codex.md); older notes about the Review wording being left untouched are superseded.


## Latest editorial packet: 101-02 lighter ending

Dave accepted FOCUS-101-02: remove the inline Galatians2:20 quotation and2Corinthians5:17,21 block; fold the brief new-life/adoption thought into assurance under You Can Be Sure. John3, Romans6 and1John5 remain as the three quoted anchors. Widget, questions, readings and saved keys are preserved. Reread pointers and checks: [log](logs/2026-11-13-FOCUS-101-02-codex.md). Earlier proposal-only notices below are historical.


## Shared chapter header standard: November 13

Dave approved the John4-6 header design for every embedded chapter reader. READ-HEADER-STANDARD uses one shared renderer for all21 assigned John chapters and future bible_reading blocks. Lesson JSON, Bible text and reading keys are untouched. This supersedes the earlier101-02-only appearance note below. Dave is considering a lighter101-02 Scripture ending; see the task log for the suggestion, which is not implemented.


## Latest integration: 101-02, November 13

Gemini PR #206 is integrated as 4b5dc3c: A-D Romans Road with the cross reveal, new John 4-6 reading headers, and the Greenhouse baptism wording. Independent technical/preview checks passed. Dave should reread the Greenhouse ending and Step D; the neighboring ABC introduction and older baptism sentence in the Review remain intentionally untouched for his later edit. The other six 101 lessons retain their previous reader appearance.

Codex handles technical integration under current standing roles. Workers open a complete widget-plus-wording PR, record changed paragraphs on TEAM-BOARD and stop at REVIEW. No separate Claude technical review is required. Saved answers, reading keys and Scripture blocks are preserved. See [review log](logs/2026-11-13-REVIEW-206-codex.md).


## Latest review aid: 37-lesson approval chart

Dave requested a lesson-by-lesson chart with grades, words and separate approvals for length, questions, text, widgets and images. Start at [the review chart](reviews/2026-11-12-lesson-review-chart.md), with its Excel/CSV downloads and all 263 current questions. It is a snapshot of main be039c7 and distinguishes matching recorded approvals, scoped/partial approvals, changed components and unrecorded gates. The five-sheet workbook includes the ten grading checkpoints, earlier/current scores, reasons and next improvements. Refreshed production average is 90.3/100; five AAA (A+). These grades supersede the older pre-integration scorecard for this snapshot and remain separate from Dave approval. No lesson content or approval record was changed by creating it. Use it for Dave's one-lesson-at-a-time review and put new actual approvals in DAVE.md against the reviewed version.

## Current checkpoint: integrated working pieces, November 12, 2026

Dave authorized assembling the pieces into main before his later lesson-by-lesson edit. The current publishing table at the top of TEAM-BOARD supersedes older REVIEW/publishing-hold passages below for this batch. Integrated: #191 Bible, #195 suffering with question 5.5 restored, #192 source manuscript, #193 stool, #196 whole-life stewardship draft, #190 Samaritan sequence, #181 widow sequence, #188 house timing, #186 Emmaus sequence, #189 mirror and #194 Romans Road. Grok's worship-chain wiring #197 is also integrated after 55 local and 55 exact-preview checks. The integration log records the final combined verification.

Next work is Dave's one-lesson-at-a-time wording and visual pass. Keep the 201-10 Learning Circle depth as he requested; no new rewrite of it was started. Mosaic and Nicodemus lamp art remain future design packets. Do not restart completed reader repairs or re-open the superseded PRs. Final pastoral/art/release approval remains pending. No Firebase settings or workflow changes and no manual deploy.

## 202-07 whole-self stewardship proposal: REVIEW, November 12, 2026

Dave directly asked Codex to work now on a full rewrite centered on stewardship of time, talents and treasure, with a three-T stool replacing the draft bills concept. Review `reviews/2026-11-12-202-07-whole-self-draft.md` and `reviews/2026-11-12-202-07-stool-widget-brief.md` on branch `codex/rewrite-202-07-proposal`. The complete manuscript is 1,210 words including headings/questions/closing. Dave explicitly rejected prosperity teaching; the draft honors that distinction.

These are review documents. No current lesson JSON, questions/IDs, artwork, widget or Firebase files changed. Claude/Dave review prose; Gemini claims the widget implementation; Codex checks final integration. Preserve Grok's open widow-art #181. Required baseline suites pass, exit 0. Action preview evidence will be posted on the PR; the preview does not contain the Markdown manuscript. See `logs/2026-11-12-REWRITE-202-07-codex.md`.

## 202-05 suffering redraft waiting for Dave, November 12, 2026

Claude redrafted 202-05 from Dave's collected direction on branch `claude/dazzling-brown-x7g9um` (not merged, no PR yet). Next action: Dave reads it and sends changes. Open decisions: the mosaic widget, the Piper credit line, and length. See logs/2026-11-12-L-202-05-REWORK-claude.md.


## 101-04 focused revision: REVIEW, November 12, 2026

Dave directly assigned Codex to revamp 101-04 in voice, an exception to the default editorial lane established at the top of TEAM-BOARD. Branch: `codex/revamp-101-04`. Nicodemus now opens the lesson, repeated setup is shorter, and the Three Discovery Questions lead into practice sooner. All nine question objects, three verse blocks and the John 10-12 reading block are unchanged. The lesson remains introductory and complements the map/story/OIA sequence in 201-05/06/07; those lessons are unchanged.

Local required suites and 30 targeted browser checks pass with actual exit 0. Await the PR's Action preview and Dave's exact-wording review before integration. Existing art is unchanged; Nicodemus art is a separate Grok assignment under current roles. See `logs/2026-11-12-TRIM-101-04-codex.md`. Current standing roles on TEAM-BOARD supersede conflicting historical delegation passages below. No wider 101/201 audit or 101-06 edit started.

## Temporary coordinator, November 12, 2026

Current 37-lesson production scorecard: [Road to AAA](reviews/2026-11-12-aaa-37-scorecard.md), audited at main `d9065c7`. Overall 86.8% toward the explicitly scored standard; three AAA (A+) and seven at 95%. All 37 are substantive drafts, not partly unwritten lessons. TEAM-BOARD and the series plan now use the current gap list. Grades are not new pastoral/art approval or pilot/release readiness.

Dave asked Codex to cover Claude while Claude is unavailable and confirmed: "Merge reviewed, passing PRs." This supersedes the older per-PR "merge it" restriction only for Codex as acting coordinator. Other workers still use separate worktrees, one job per PR, real exit-code checks and Firebase previews, then stop. Dave's theology, wording and personal art approval remain separate; never infer them from a technical merge. No manual deploys or force pushes.

Reviewed and merged #161 tooling (`4c255cd`), #155 Daniel art (`a6cb9d5`) and #162 early-church art (`6cab588`). Checks and automatic Firebase deployments pass. The combined tree exactly matches the tested integration. Evidence: logs/2026-11-12-COORD-003-codex.md.

Dave's separately requested one-sentence Daniel age clarification is integrated in #164 as `d9065c7`, with successful automatic deployment and 28 public-site checks. L-203-06-AGE is done; #165 is a later duplicate and is not another pending lesson change. Questions, Scripture quotations and art stayed unchanged. See logs/2026-11-12-L-203-06-AGE-codex.md and #164's final evidence comment.

Dave assigned a three-project batch per agent on November 12. Gemini: ART-202-05 Joseph, ART-202-06 Paul/Silas, ART-202-07 widow. Grok: ART-203-07 Jesus sends the 72, ART-203-03 Emmaus, ART-203-09 tentmakers. Codex: READ-101-NOTES, READ-101-RETRY, READ-101-A11Y, in that order. Each is a separate project/PR; jobs 2 and 3 wait for the owner's prior integration. These are assigned TODOs, not proof an agent has launched. TEAM-BOARD.md contains the bounded briefs and generated-map integration rules.

READ-101-NOTES is integrated in #168 (`4798597`), with successful automatic Firebase/Pages deployments and 36 public-site notes checks. READ-101-RETRY is integrated in #170 (`857bbd6`), automatic deployments succeeded and public retry browser 33 passes. READ-101-A11Y is at REVIEW, with 57 local keyboard/label/focus checks plus retry/notes regressions green. Codex continues under Dave's instruction to keep going through the queue while he is away. No new lesson wording, course PDF or artwork approval is implied.

Grok's ART-203-07 is technically integrated in #169 (`487fc3d`): all non-image lesson values/IDs unchanged, image map reproducible, required/image checks and 61 Action/public browser checks pass; automatic deployments succeeded. Dave's personal art approval remains pending. Grok may take ART-203-03 next from fresh main.

Keep approved questions untouched. Do not merge old #28 or #68 without a fresh current-state review; #165 is a duplicate of the integrated Daniel wording; #2 is outside this assignment. The older Claude-only instructions below are historical while the temporary delegation is active.

**Hosting storage (2026-11-12):** previews expire after 3 days and originals in `images/*.jpg|jpeg|png` are not uploaded to Firebase (WebP copies serve every lesson). See Lessons learned on the board before touching previews.

**Image build needs sharp:** see Lessons learned in TEAM-BOARD.md before running `build_lesson_images.js`.

**Team board (2026-11-12):** every agent starts at `TEAM-BOARD.md`; Codex temporarily coordinates and merges reviewed, passing work under Dave's delegation above.

## Series review and rework, November 11, 2026

Dave reviewed the whole 101 to 203 series with Claude and approved the direction. The standard, the lesson-by-lesson calls, the seven rewrites in order, the trims, and the review checklist are in [reviews/2026-11-11-series-review.md](reviews/2026-11-11-series-review.md). Read it before any lesson review or revision. The three sweeps (#118, #119, #120) and the plan (#121) merged on 2026-11-11, and so did the first two rewrites, 203-07 (#123) and 203-04 (#124). 202-02 (#129, then Dave's three R's in #134) and 202-04 (#132) merged too. 201-03 (#140) merged too. 101-06 (#142) merged too. The 203-08 light trim (#144) merged too, so section A of the plan, all seven rewrites, is complete as of 2026-11-11. ChatGPT's first 101 fix, image lazy-loading (#143, PERF-001a), merged the same day after Claude's review. Remaining: ChatGPT's fixes 2 to 4 (chapter notes in export, retry on failed chapter download, reader accessibility), then TRIM-SERIES (plan section B) and TEACH-IT (section C); Claude reviews each PR against the plan's checklist before Dave's "merge it". A later PR should run scripts/build_lesson_images.js over the remaining large JPGs.

**Working rule for every bot (added 2026-11-12):** never edit files in the main checkout at `~/github/ministrybag1`. Make a worktree or branch of your own and open a PR. On 2026-11-12 uncommitted edits (a 101-02 greenhouse sequence and story-image.md) were found sitting in the main checkout, which blocks other agents from pulling main and risks losing the work. The footer and email work landed as #149: emails show each question's number plus a short form of the question, closing questions are labeled, the summary is the lesson description, and one short ESV line sits at the bottom of every lesson with the full notice on the About page. The home page sign-in pill (#133, #138, #139) is live: Starting blue, reads Sign in or Sign out. Note: on 2026-11-11 afternoon GitHub's hosted runners stalled for over 30 minutes; Dave said "deploy" and Claude ran the manual Firebase deploy as the written fallback. Read the "How Dave edits" section of the plan before drafting. Claude is producer/director for this rework; Dave's "merge it" is the only approval.

## Firebase move (DATA-002), November 10, 2026

Dave chose Firebase for sign-in and saved answers (DATA-001 is decided) and owns **growingtogetherdiscipleship.com**. Stay on the free Spark plan. The work runs in four steps: DATA-002a Hosting and preview links, then DATA-002b to d for sign-in and private per-person answers.

**Status (2026-11-10):** Firebase project `growing-together-discipleship` exists under davepartin@gmail.com (Dave's own account; Growing Together is his work) on the Spark plan. `discipleship/.firebaserc` points at it. The deny-all Firestore rules are deployed. The app is live, unchanged, at https://growing-together-discipleship.web.app. https://growingtogetherdiscipleship.com is connected with its own certificate, and www redirects to it. Authorized domains for sign-in: growingtogetherdiscipleship.com, www.growingtogetherdiscipleship.com, ministrybag.com (plus Firebase's defaults). DATA-002a to c are complete. DATA-002d sync is live: signed-in people's answers, check marks and reading notes save to their account and follow them between devices (see logs/2026-11-10-DATA-002cd-claude.md). Left: send ministrybag.com/discipleship to the new address when Dave is ready to announce it.

**Do not touch ministrybag.com/discipleship.** It stays on GitHub Pages, with no redirect and no change, until sign-in exists. Saved answers live in each browser per web address, so learners must keep using the old address until DATA-002b to d. Do not announce the new address yet.

**Sign-in:** the command-line tools are already signed in as davepartin@gmail.com, the owning account. If they ever need signing in again, Dave runs `firebase login` himself. Never ask for his password.

**Publishing is automatic (since 2026-11-11).** Two GitHub Actions workflows in `.github/workflows/` do all deploying. `firebase-hosting-merge.yml` deploys `discipleship/` to the live site every time main changes, so a merge to main is a publish on both growingtogetherdiscipleship.com and ministrybag.com. `firebase-hosting-pull-request.yml` builds a preview link for every pull request and posts it as a comment on the PR. No agent should run `firebase deploy` or `firebase hosting:channel:deploy` by hand, and no agent other than the GitHub Action needs Firebase credentials. The key lives in the repo secret `FIREBASE_SERVICE_ACCOUNT_GROWING_TOGETHER_DISCIPLESHIP`; the service account has Hosting admin only. Because merge is publish, Dave's "merge it" is the only approval that merges lesson content, for every bot.

**Commands, always run from `discipleship/`:**
- Preview links and live deploys are automatic; see above. Manual fallback only if the Action is broken: `firebase hosting:channel:deploy <short-name> --expires 7d` for a preview, `firebase deploy --only hosting` to go live.
- Update the database rules: `firebase deploy --only firestore:rules`
- Test offline before any project exists: copy `firebase.json` to a temporary config with an `emulators` block, then run `firebase emulators:exec --only hosting --project demo-growing-together "<command>"`. The emulator ignores the upload leave-out list, so test that list with a real preview deploy.

**Sign-in (DATA-002b, live since 2026-11-10):** `scripts/account.js` loads Firebase Authentication from gstatic (SDK 13.1.0) and runs only on growingtogetherdiscipleship.com and the project's web.app and firebaseapp.com addresses, including preview links (`scripts/account-helpers.js` decides). ministrybag.com never shows sign-in or downloads Firebase. To test locally without touching real accounts, serve `discipleship/` on 127.0.0.1:8765 and run `firebase emulators:exec --only auth "node scripts/data002b_browser_check.js"` (set `NODE_PATH` for Playwright). Open `index.html?auth=emulator` to try it by hand while the emulator runs.

**What gets uploaded:** everything in `discipleship/` except planning and research folders (`project-management`, `Lesson_research`, `leadership-archive`, `cru_followup_material`), Markdown, spreadsheets, temp files and the test and build scripts. Runtime scripts in `scripts/` (answer storage, backups, export, widget loader, save feedback) must stay uploaded. HTML, JSON, JS and CSS are served with `Cache-Control: no-cache`, so lesson edits show right away.

**The Firebase web key is not a secret.** When sign-in begins, the web config (including `apiKey`) goes into the app. Google designs it to be public: it only identifies the project. The real protection is the Firestore security rules (DATA-002c) and the list of authorized domains in Authentication. This is different from the old ESV key (SEC-001), which unlocked a paid-style service account.

## Start here, November 3, 2026: 203-08 How to Disciple Others

Dave is working on lesson 203-08 with an agent, section by section. Main is the reading environment: when Dave asks for a change, make it, run the checks below, and merge it to main so he can see it on the live site. Being on main is not approval; his approval for 203-08 is still unrecorded on [TASKS.md](TASKS.md). Full history and evidence: [the 203-08 log](logs/2026-11-02-L-203-08-SEND-claude.md).

**Why this lesson matters.** Dave calls it the calling behind the whole series: we disciple others so they can disciple others (multiplication, not just addition). Paul and Timothy (2 Timothy 3:10 and 2:2) and life-on-life ministry (1 Thessalonians 2:8) carry it, along with Jesus' command to go and make disciples who make disciples.

**How Dave wants to work.** Keep his wording and the sound of a real conversation. Fix grammar lightly without asking, and say what you fixed. Do not trim, rewrite or "tighten" his content unless he asks; an earlier pass cut too much and had to be reverted. When he asks for options, give two or three short ones with a recommendation. "Personal ministry" is his term for having a disciple; keep it. Some small groups will use the series as their Bible study, so welcome one-on-one and group settings. No em dashes, no bullets in lesson prose.

**Current lesson shape (data/203-08.json).** Recap; Paul and Timothy story image (black and white only, see ART-008); Four Generations story; 2 Timothy 2:2; Dave's reflection with "his own personal ministry"; 8.1; Jesus Calls Ordinary People to Make Disciples (Mark 3:14 with bold "with him" and "send them", quietly echoing study, practice, appropriate challenge, encourage, sent; Matthew 28:19-20; "you will not do it alone"); Sit Down Together (one friend or a small group); the widget; Make SPACES with key words; Study: Learn; Practice: Talk; Appropriate Challenge: Do; Encourage: Keep Going; Send: Go; 8.2; Addition or Multiplication (ten-year doubling picture); Life on Life (1 Thessalonians 2:8 and Dave's tasting versus "chewing it up and consuming it" picture); Your Appropriate Challenge (use Growing Together with one person or a few; the learner who has been receiving is now sent; "I will be here to help and encourage you all along the way"); 8.3; God Gives the Growth; 8.4 (dream question); Review; closing trio. All seven saved-answer IDs are unchanged. About 1,730 words, above the 1,500 target; trim only after Dave reads it.

**The widget (widgets/spaces-tables.html, title "Make Space").** A whiteboard drawing. Black marker for everyone; green marker and a backpack mark people who have been discipled. Letter boxes spell SPACES as the steps happen, and the camera widens until Send, then the tables multiply. All eight captions are Dave's words: Making Space; Study (bold **learn**); Practice (**talk**); Appropriate Challenge (**do**, the open Bible slides across to the friend); Encourage (**keep**, mentor thumbs-up and a plain speech bubble, both nod); Send ("Making Space to Multiply Spaces. As we have been sent, so we send." plus Jesus' "**Go** therefore and make disciples..."); Teach Others about Growing Together (2 Timothy 2:2); Growing Worship (Mark 4:20, the series key verse on the home page). Do not reintroduce the heart, the staircase, the pointing gesture or the header hint line; Dave removed them.

**Where Dave left off.** He finished the widget and the text before it, and asked for the full draft after the widget (PR #98). His section-by-section read of that draft is next, starting with Make SPACES and the five step sections.

**Open questions for Dave, only if they come up.**
1. Should the Encourage speech bubble be completely empty (it now has two short lines like Practice)?
2. Should the thumbs-up hand be a little bigger on that zoomed-out frame?
3. Optional idea he has not answered: the widget header could change from "Make Space" to "Make SPACES" on the Send frame.
4. Should the step sections and Review pair each letter with its key word more explicitly? (The Make SPACES paragraph already does.)

**Checks to run from discipleship/** (serve with `python3 -m http.server 8765 --bind 127.0.0.1`): `bash scripts/qa_foundation.sh` (415), `node scripts/test_answer_storage.js` (64), `node scripts/test_lesson_assets.js` (8), `node scripts/test_widget_iframe.js` (32), and `node scripts/l203_08_browser_check.js` (34; set `NODE_PATH` to the global node_modules for Playwright). For widget drawing changes, also screenshot the affected frame at 390 px and look at it before merging.

**Also open.** PR #68 (FINISH-PLAN.md and LESSON-GRADES-SUMMARY.md) is still unmerged; read it from branch `cursor/seven-week-plan-tracker-94c4`. 301 stays deferred until March 2027 (DAVE-004 done). New board rows: ENG-007 done (widget scroll-jump fix for every lesson), QA-002 (flaky ENG-003 browser check), ART-008 (color version of the 203-08 story image).


## 203 organization checkpoint, October 12, 2026

ORG-203 is ready for review on `codex/203-curriculum-organization`, not integrated. Ten active files stay in their numbered positions; five JSON title fields now match curriculum-toc.csv. Existing 06 work/school and 09 missions drafts are integrated with September 26 approvals recorded on the board. Chapters 02 and 03 need scope revision, 08 still teaches Belonging, and 10 is a brief stub. Original 08 material is preserved in data/standby. No lesson prose, saved-answer IDs or pastoral approval records changed. See [the placement checkpoint](reviews/2026-10-12-203-placement.md).

Next 203 writing: prayer focus in 02, listening plus hospitality in 03, disciple-making rebuild in 08, then full calling/integration in 10. Older instructions below to draft 06/09 or gather their initial approval are historical. Artwork and pilot gates remain separate.

## 202 documentation checkpoint, October 12, 2026

All ten current 202 lessons contain substantive drafts. None are empty or brief placeholders. Dave's September 26 approvals for 202-08/09/10 match the current lesson text; 202-01 through 202-07 have no final approval recorded. Use [DAVE.md's 202 checklist](DAVE.md#202-review-checklist-october-12-2026). The September narrative below is historical; its 202-08/09 drafting/review requests are superseded. This documentation refresh does not re-audit engineering or other courses, change lesson content, or establish release readiness.


Updated September 16, 2026 at the coordinator change (COORD-002). Last code checkpoint was ENG-005b / PR #24. The board is [TASKS.md](TASKS.md); workflow is [PLAN.md](PLAN.md).

## Checkpoint, September 16 (REV-011)

Verified integrated commit: `8dd3dc1` (PR #27, ENG-006c). ENG-006 and SEC-001 are DONE. REV-011 fixed a rollback gap and stale restore wording before merge; see [REV-011](logs/2026-09-16-REV-011-claude.md). All unit suites (restore 94), foundation QA and every browser check pass on the merged tree; foundation QA and the restore suite were rerun on main. Grok and ChatGPT/Codex have no further assignments.

Next three priorities:
1. DAVE-001: 202-08 and 202-09 are published on the alpha site for review (PR #17 merged as `7210c2f` at Dave's direction, stale ENG-001 browser expectation fixed first). Not approved; gather Dave's and others' feedback into one revision packet.
2. L-203-06 Faith at Work and School: full draft on PR #29 (`claude/l-203-06-faith-at-work`), all checks passing. Needs Dave's review, an esv.org check of every quotation and parable art (ART-004).
3. UX-004 plain-language restore labels: PR #28 (`claude/ux-004-restore-labels`), all checks passing, waiting for Dave's go-ahead to merge. Whichever of PR #28 and #29 merges second must rerun `node scripts/build_answer_index.js` if #28 is already on main.

## Coordinator change, September 16

Claude (Cowork) is now the coordinator, replacing ChatGPT (Astra/Codex). Nothing on main changed for `discipleship/` between September 13 and 16. All unit suites and foundation QA pass on main, and PR #17 still merges cleanly with its checks passing. ENG-006c has not been started. See [COORD-002](logs/2026-09-16-COORD-002-claude.md). Next three priorities: DAVE-001 review of PR #17, then ENG-006c and SEC-001, then the L-203-06 writing packet.

Later on September 16, Claude Code took the coordinator seat and pushed COORD-002. All unit suites, foundation QA and all ten Playwright browser checks pass on main `1ebb1f1`. PR #17 still merges cleanly, but `scripts/eng001_browser_check.js` fails on the merged tree because it still fills the retired `202-09-devos` field. That is a stale test, not a lesson defect; repair it on the PR branch after DAVE-001 so Dave's review head does not move. Dave assigned ENG-006c to Grokbot; the paste-ready prompt is directly below the ENG-006c packet. Grok Build has SEC-001a, a documentation-only credential inventory and removal plan; the `index.html` change waits for SEC-001b after ENG-006c reaches REVIEW. Its prompt is in the section below. See [COORD-003](logs/2026-09-16-COORD-003-claude.md).

## Current position

- ENG-001 and ENG-003 are **DONE**. PRs #10 and #12 were independently reviewed; two missed edge cases were repaired in PR #13, merged as `915ba568`.
- REV-001 preserved malformed/unreadable saved data through startup and later saves, and fixed real iframe shrink behavior. Evidence and exact checks: [review log](logs/2026-09-11-REV-001-codex.md).
- ENG-002 / PR #11 is on main with passing asset checks. Status remains **REVIEW** for Dave's artwork and actual phone assessment.
- **ENG-005, ENG-005b, ENG-006a and ENG-006b are DONE.** Routine successful saves are now silent; only a real save failure opens the recovery banner. PR #24 merged as `64cfa9b`. ENG-006c is cleared as a separate confirmed-restore packet; parent ENG-006 remains incomplete.
- Claude has finished the 202-08/09 handoff. Dave now reviews its pastoral wording and artwork, along with the ENG-002 artwork. These do not block ENG-006c.
- EDIT-001 is complete: [201-08 benchmark proposal](reviews/201-08-benchmark-proposal.md) contains wording, source corrections and a short learner test. It is documentation only; L-201-08 approval and implementation remain pending.
- Login/provider remains undecided. Dave's desired destination is Google sign-in or a separate account the learner creates. Use provider authentication rather than collecting a Google password directly. Firebase, Supabase or another provider will be chosen in DATA-001; do not implement the old Supabase proposal automatically.

## Active worker split, reported by Dave

- Claude's **L-202-08/09 finishing pass is reviewed** at PR #17 head `6572477`. Commit `b7a4039` contains four Dave-approved review edits: a practical unmarried response in 8.3, narrower Genesis 15 covenant wording, a brief explanation of "Gentiles," and a concrete grace prayer. All question IDs and story artwork remain unchanged. The later coordinator commit only updates the lesson browser test for ENG-005b's quiet-save behavior. Both lessons and ART-003 remain REVIEW, unmerged for Dave's full theology/art approval and pilot gates. Storage 47, lesson browser 20, foundation QA and 72 image references pass. Production compression remains PERF-001. [Evidence and prompts](logs/2026-09-12-ART-003-codex.md). Do not overwrite the new art.

- Grokbot works on a **different computer using GitHub**. ENG-006b is integrated. The next reserved packet is ENG-006c from current main, including PR #24's quiet-save behavior, on a new branch. It owns confirmed restore and related host/storage tests only. Keep lesson prose/IDs, Claude assets and the merged Grace widget out of this packet.
- Grok Build completed **UX-001a and UX-001b**. PR #22 is reviewed and merged as `7495a03`, including a coordinator correction to native overview buttons and accessible definitions. The expanded browser suite passes 108 assertions; overview fits at 444px on phone and 478px on laptop. See [REV-007](logs/2026-09-12-REV-007-codex.md). Hold the wider Discuss implementation until shared app-code ownership is available. Do not change another worker's checkout.

- Workers should read AGENTS.md and use separate task branches. Claude must preserve the repaired 202-09 IDs. Shared `index.html`, scripts and shared widgets belong to engineering unless explicitly reallocated. UX-001b is integrated; its temporary ownership exception is complete. Do not start another widget or host change without a new bounded assignment. Put a needed shared-code change in a task note rather than editing it concurrently.
- Coordinator owns TASKS/HANDOFF integration while workers run. Each worker records evidence in its own task log; avoid competing edits to the shared board.
- GitHub carries committed and pushed changes only. Local edits are not automatically visible on the other computer. Push review branches, then integrate; do not merge unapproved lesson drafts to a publishing main branch.
- Do not pull into, switch branches in, reset, or clean Claude's active checkout while it is working. Review remote changes in a separate worktree. After Claude checkpoints its work, reconcile with current main without discarding its changes.
- Dave remains the final theology/art reviewer. Drafting underway does not establish that his DAVE-001 briefs or lesson approvals are complete.

## Remaining risks

- Failed-load guards and recovery controls are present. Versioned download and strict read-only preview are integrated. Confirmed restore, stale-preview protection and rollback remain ENG-006c. Never remove a guard merely to make saving appear successful.
- Historical ambiguous answers remain in recovery metadata. ENG-006 must provide usable recovery/backup access without assigning them automatically to a lesson.
- The free ESV key remains only in the root reading app and Git history, accepted by Dave. Never reproduce its value.
- 202-08/09 have reviewed finishing drafts and generated art on PR #17; Dave, pilot and delivery gates remain pending. 203-06/08/09/10 need substantial writing; 301 placeholders and lesson approval gates remain on the board.
- Real iPhone/Safari, cross-device sync and production deployment were not verified in this review.

## Last review checkpoint

Verified integrated code commit: `64cfa9ba3085a9d9d99c7d6608f29eafef392fb4` (PR #24, ENG-005b). Routine successful saves are absent at 390px and 1280px, persisted values survive navigation/reload, and real failures keep recovery controls. Foundation QA, save 41, recovery browser 20, backup download 53, backup preview 75, storage 44, export 40 and ENG-004/005/006a/006b browser checks pass. No restore exists yet. PR #17 remains separately reviewed and unmerged at `6572477`; its four new lesson edits preserve every ID and its 20 lesson browser checks pass. Inspect origin and pending PRs again at the next review.

## Next coding packet: ENG-006c confirmed restore

Start from current `origin/main`, including PR #24, on a new branch. Read the ENG-006 row, `scripts/backup-format.md`, current download/preview helpers, failed-load guards and REV-010. Preserve ENG-005b's quiet routine-save behavior: restore success should not recreate a persistent green save banner, while restore errors must remain visible. Coordinator owns TASKS/HANDOFF. This packet may add restore-specific helper/tests, host controls and its own task log. Do not edit lessons, widgets, artwork, login/provider code or Discuss UI.

- Only an exact version 1 file that passed the current validator may reach confirmation. Partial source backups remain preview-only for this first restore path. Preserve unknown keys as stored keys and retained ambiguity as unassigned metadata.
- Add a clear review-and-confirm step. Backup-only values may be added, device-only values stay, matching values stay, and every conflicting value requires an explicit keep-device or use-backup choice. No preselected destructive choice, bulk silent overwrite or automatic ambiguity assignment. Render all imported strings as text.
- Before any write, build and trigger a versioned backup of the current in-memory/device state, including guards, unsaved edits and captured original raw evidence. Require the learner to acknowledge that safety download before enabling the final Restore action. Do not claim the browser proved the user saved the file.
- Bind confirmation to a fingerprint of the exact validated file, chosen conflicts and a snapshot of current in-memory values, storage raw strings, load reasons and write guards. Any file change, answer edit, navigation, new preview, storage event or guard/status change makes confirmation stale and requires a fresh preview.
- Treat the three stores as one transaction. Keep a complete pre-write snapshot. If any storage write or verification read fails, roll back every store already changed. If rollback is incomplete, leave visible per-store errors and offer the pre-restore recovery download; never report success. Update in-memory state and UI only after all writes verify.
- For a malformed/unavailable destination, never clear its failed-load guard until its original raw evidence and current in-memory edits are included in the safety download and the explicit confirmed replacement succeeds. A cancel, stale confirmation or failed write leaves the original raw bytes, memory and guard unchanged.
- After success, preserve device-only keys, selected conflict outcomes, unknown keys and ambiguity metadata; reload all three stores from persisted bytes, clear only the guards actually recovered and show exact restored/kept/conflict counts. Provide no upload, login or cross-device claim.
- Test actual downloaded source and safety files, full download-to-restore-to-reload round trips, empty/false/multiline/Unicode, unknown and ambiguous data, every conflict choice, source/destination partial states, stale preview triggers, quota/unavailable writes at each store, rollback success/failure, repeated restore and cancel. Use synthetic data and temporary downloads only. Verify keyboard focus, confirmation wording and 375/390/1280 layout. Rerun download, preview, save/recovery, export and answer-storage regressions.
- Push a focused PR and stop at REVIEW. Parent ENG-006 remains incomplete until independent review. Do not merge, deploy or begin DATA-001.

### Prompt for Grokbot (paste as is)

> You are Grokbot, the implementing worker for ENG-006c in Growing Together, the discipleship app in the `discipleship/` folder of https://github.com/davepartin/ministrybag1. Claude is now the coordinator.
>
> Setup: fetch origin and create a new branch `cursor/eng-006c-confirmed-restore` from current `origin/main` (at or after `aeb5676`). Do not reuse an old branch or checkout.
>
> Read, in order: `discipleship/AGENTS.md`, the section "Next coding packet: ENG-006c confirmed restore" in `discipleship/project-management/HANDOFF.md` (that packet is your full specification), the ENG-006 and ENG-006c rows in `project-management/TASKS.md`, `scripts/backup-format.md`, `scripts/backup-download.js`, `scripts/backup-preview.js`, `scripts/answer-storage.js`, `scripts/save-feedback.js`, the failed-load guard and backup preview code in `index.html`, and `project-management/logs/2026-09-12-REV-010-codex.md`.
>
> Build explicit confirmed restore on top of the ENG-006b preview: only an exact version 1 file that passes the current validator reaches confirmation; per-conflict keep-device or use-backup choices with nothing preselected; a required pre-restore safety download the learner acknowledges before Restore is enabled; a confirmation fingerprint that goes stale on any file, answer, navigation, preview, storage event or guard change; all three stores written as one transaction with verification reads and full rollback; failed-load guards cleared only after their raw evidence is in the safety download and the confirmed replacement verifies. Preserve unknown keys, unassigned ambiguity metadata and the quiet routine-save behavior from PR #24. Restore errors stay visible; success shows exact restored, kept and conflict counts without a persistent green banner.
>
> Scope: restore helper and its unit tests, the restore controls in `index.html`, a new browser check, `scripts/qa_foundation.sh` only to add your unit suite, and your own log `project-management/logs/2026-09-16-ENG-006c-grokbot.md`. Do not edit lesson JSON, widgets, images, login/provider code, Discuss UI, the Scripture/ESV fetch code (SEC-001 owns it), TASKS.md or HANDOFF.md.
>
> Tests: synthetic data and temporary downloads only. Cover real downloaded source and safety files, download to restore to reload round trips, empty/false/multiline/Unicode values, unknown and ambiguous data, every conflict choice, partial source and destination states, each stale-preview trigger, quota or unavailable writes at each store, rollback success and rollback failure, repeated restore and cancel. Check keyboard focus, confirmation wording and layout at 375, 390 and 1280 pixels. From `discipleship/`, rerun every `node scripts/test_*.js`, `bash scripts/qa_foundation.sh` and every `scripts/*browser_check.js` (Playwright, served with `python3 -m http.server 8765`). Report exact counts and anything you could not run.
>
> Finish: stage only your scoped paths, commit with `[ENG-006c]` in the message, push the branch, open a PR titled "ENG-006c: confirmed restore (REVIEW)", and stop at REVIEW. Do not merge, deploy, force push or start DATA-001. Final reply to Dave: outcome, files, checks with counts, remaining issue, branch, commit and PR number. No em dashes in anything you write.


## Worker availability, September 16

Dave's Grok and ChatGPT usage is nearly exhausted. ENG-006c (Grokbot) is the last packet for Grok or ChatGPT/Codex; do not assign them further work. Claude reviews ENG-006c. If Grokbot stops before finishing, it should push its branch and mark its log PAUSED, and Claude resumes from that branch. Later packets, including SEC-001b, default to Claude unless Dave names Cursor or Gemini.

## SEC-001 status, September 16

SEC-001 is DONE. SEC-001a (Grok Build inventory) merged as `1fa5206`; SEC-001b merged as `3661ac8` with Dave's go-ahead. The 101 John reading cards load bundled World English Bible text, the ESV API and key are gone from `discipleship/`, and the duplicate reading app copy is deleted. Dave keeps the root `dailybiblereading/` app as is and accepted the free key's remaining exposure there and in Git history. Do not alter the Bible text. ENG-006c touches different lines of `index.html` and should rebase cleanly onto `3661ac8`.

## Claude: handoff complete; awaiting Dave's review

Claude's latest PR #17 head is `65724774db2eacde319c1e8380c194c14b3d038d`, still open and unmerged. Claude's `b7a4039` applies four review edits Dave approved in a separate review: a practical unmarried response in 8.3, narrower Genesis 15 covenant wording, a brief explanation of "Gentiles," and a concrete prayer under Grace. Every question ID is unchanged. The story artwork is unchanged from ART-003. Shared main through PR #24 is merged, and the coordinator updated the one lesson-browser assertion that still expected the removed Saved banner. The full 20 lesson browser checks and foundation QA now pass on this exact tree.

Claude reports the Obsidian manuscripts/summaries and the same phone preview now include all artwork, with lightweight JPEG derivatives for the preview and a five-item decision box. These external copies were not independently inspected by the coordinator in this checkpoint. Claude reports 47 storage checks and foundation QA passing on its merged tree. No new coordinator runtime test was needed for the unchanged lesson/assets. Preview compression does not resolve PERF-001 for the production app's PNGs.

Claude should pause at REVIEW. Dave reviews Ephesians 5 submission/headship language, the Genesis 15 interpretation, FIGHT wording, both pastoral safety boxes and the story artwork. Ephesians 5:25 stays in both 202-02 and 202-08. No retroactive drafting brief is required. PR #17 stays unmerged until Dave reviews the exact version. 203-06 remains held pending a separate writing packet.

Gemini's independent read-only learner review can be collected alongside Dave's feedback; it does not replace pastoral approval or a human pilot. Consolidate feedback into one bounded revision packet rather than asking Claude for repeated uncoordinated passes. Grokbot may start ENG-006c; Grok Build's design is complete and implementation remains held while shared host/storage code is owned by ENG-006c.

## Grok Build: widget and Discuss design complete; hold implementation

PR #22 is reviewed and merged as `7495a03`. Restart returns to Begin; Show whole diagram is separate and Return to steps preserves the prior step. The coordinator corrected overview tiles to native buttons whose accessible names include the definitions and expanded the browser suite to 108 assertions. Teaching data and font sizes are unchanged. The whole diagram, definitions, arrows and controls fit below the header after ordinary outer scrolling, including the synthetic save-error state. Actual iPhone/Safari and a human meeting are still untested.

> Your Discuss design is reviewed and merged in PR #23 at 6512003. Read the coordinator corrections in project-management/reviews/201-08-discuss-design.md and REV-009. Fetch normally. Hold UI/shared-host edits while ENG-006c owns shared host/storage code; no further coding packet is assigned.

The accepted design verifies existing response IDs and explicitly covers source wording, full diagram definitions, long-answer jump links, current-page unsaved values, unreadable storage and resetting private disclosures on entry. It is a prototype specification, not measured layout or a human pilot. The next packet must use this corrected document.

Parent UX-001 remains TODO. Its next implementation packet must explicitly allocate shared index/navigation ownership, reuse the same lesson and answer IDs, avoid automatic disclosure, and test a real conversation before rollout. The Grace overview is one prerequisite, not a completed Discuss view.

## Prompt for the daily reviewer

> Review Growing Together since the checkpoint in project-management/HANDOFF.md. Read AGENTS.md, fetch origin, inspect TASKS.md and recent task logs, and examine integrated changes and pending worker branches. Verify claims against actual diffs and targeted behavior tests. Fix bounded defects in the authorized scope; log larger findings. Preserve learner data and Dave's theology and voice. Integrate eligible reviewed work, update the board/log/checkpoint, sync to GitHub, and report completed work, corrections, the next three priorities and at most two decisions for Dave. Keep unapproved lesson revisions in review. Do not repeat the entire baseline audit.

## Before a handoff

Record task ID, owner, branch, commit or uncommitted files, checks, unresolved issue and exact next action. Push a safe checkpoint branch when possible. Never mark partial work DONE because usage is ending. Agents resume from these files and Git history; they may not see the conversation.
