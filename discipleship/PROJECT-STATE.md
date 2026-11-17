# Growing Together - Project State

## 101-04 compact widget approved for integration: November 17, 2026

Dave approved PR #262 at exact 6a4c1e7977719842941e72a3cee339c67899c2f6 and said to merge. Preserve these widget bytes: half-size Bible, closed cover aligned right within its opening footprint, wipe opening left, 30 percent shorter diagram, dimmed Ready passage and simpler Ready card. This is component approval only; 101-04 text stays Silver. All lesson JSON, questions/IDs/answers, readings, approved oil-lamp art, placement and shared runtime remain unchanged. Core QA and 248 focused browser checks pass. Approved component hash/status are recorded. Final exact-head preview, merge and live verification are on PR #262. [Integration log](project-management/logs/2026-11-17-WIDGET-101-04-RDR-POLISH-codex.md).


## 202-09 roof marker artwork: November 17, 2026

Dave approved PR #279 at c053695. ART-202-09-MARKER replaces the roof illustration with the 1280x720 marker pair and four optimized deliveries; framed touchNext entry dissolve finishes while centered. Older PNGs remain unchanged on disk. All lesson wording, Scripture, question/answer identity, readings, widget bytes and 202-03/04 remain unchanged. Image approval only. Integration and deployment evidence: [Codex log](project-management/logs/2026-11-17-ART-202-09-MARKER-codex.md) and PR #279.

## Course 101 story art integrated: November 16, 2026

ART-101-03-05-06 DONE, PR #268. Dave asked Codex to merge Gemini's completed art at 17684f32bb846bda53cc91fd0ffb45ec777bb751: the new 101-03 pre-dawn prayer pair before Teach Us to Pray, revised individual roots in 101-05 aspen-bw.png with the existing color layer preserved, and the 101-06 sunlit well/terracotta reveal with its B&W layer preserved. All three use imageDissolveOnEntry so full light appears while the complete image is visible. Approved art/delivery/map bytes are unchanged from Gemini's submission.

Current main #266 Lord's Prayer widget and approval records are retained. Merge conflicts were confined to editorial baseline/status; both widget and new art records are preserved. No lesson prose, Scripture, question/answer identity, reading, existing widget or runtime index changes. All three texts stay Silver; image approval does not grant whole-lesson Gold. Local checks include repository QA, 464 four-lesson reveal checks, 225 Lord's Prayer widget checks, 128 lamp checks and 64 delivery checks. Final preview/live evidence is on PR #268. Evidence: [Codex log](project-management/logs/2026-11-16-ART-101-03-05-06-codex.md).

## 101-04 Nicodemus lamp artwork approved: November 16, 2026

Dave approved PR #263 at b52e4f4ab59024193484e23eff0ad99d90904bae: the 1280x720 darker-to-lighter clay oil-lamp pair, four optimized 640/1280 WebP copies, generated image map, and touchNext placement immediately before Questions in the Night. Preserve these approved bytes. Older notes describing 101-04 story art as missing are superseded.

Current main 0b4a799 (#259) is preserved: all prose, Scripture, eight active questions, retired 4-6, John 10-12 and Read, Discover, Respond widget are unchanged. In particular, do not restore the retired share section/question or duplicate Discovery Questions box. All unrelated lessons, index, saved-answer code and existing art stay unchanged. Image approval only; text remains Silver with Dave edits protected. The 101 status and baseline now record the current protected content and exact approved image hashes.

Core QA, asset/image/export/storage/iframe checks and targeted widget/dissolve browser verification are recorded in the integration log. Final exact-head Firebase preview, merge and production deployment evidence are on PR #263. Evidence: [Codex integration log](project-management/logs/2026-11-16-ART-101-04-LAMP-codex.md).

## 202-10 Lord's Supper update approved: November 16, 2026

Dave approved PR #252 at 169a7d54c50689e814ae0ff5455421f6172147bd. SUPPER-202-10 DONE: the approved 1152x864 (4:3) bread-and-cup B&W/color pair and four 640/1152 WebP copies are added as a framed, touchNext dissolve immediately after The Lord's Supper: The Table You Return To. Both source JPGs, delivery copies, lesson placement and generated image map remain byte-identical to the approved PR. The existing opening Last Supper pair is retained.

The two-ordinances.html placeholder embed is removed; its file stays on disk. Baptism picture remains in its approved section, unchanged from 3c3b328. TOC subtitle/tool now say Baptism picture. All prose, Scripture, seven question objects/IDs, readings, saved-answer code, index, other lessons and existing artwork remain unchanged. This supersedes older notes that the bread-and-cup files are missing or the Lord's Supper placeholder remains active. No new Gold stage is assigned.

Current main e35a32a was merged normally, preserving Dave's latest 101-03/101-07 edits and both task records. Repository checks pass: export 186, storage 64, assets 139, images 1485, asset-validator 8, iframe 32, foundation. Browser checks pass: Baptism 112, integration/answers 112, both dissolves 128 across mobile/desktop/reduced motion. Exact-head preview and live deployment evidence are recorded on PR #252. Evidence: [Codex integration log](project-management/logs/2026-11-16-SUPPER-202-10-codex.md).

## Story-art decisions: November 15, 2026 (supersedes the affected PR #240 inventory)

Dave approved PR #248 at ae5c9d450d1b4bfbcd1fdead69190fd8bde4bdac. 101-07 retains its four-frame sequence, order/stops and touchNext placement, with the frame-4 cloak now B&W/grey marker. The approved replacement JPG, both WebP copies and new SHA-256 are preserved. 203-02 is restored byte-for-byte to pre-#240 a3beacb; its three source JPGs and six WebP copies are removed. Its story/teaching remains; there is no replacement story image under this task. Do not restore the removed sequence from old four-story completion notes.

201-05 keeps its two-frame lamp sequence. 203-07 keeps its four-frame Jesus sends the 72 sequence and the unchanged original jesus-sends-72.jpg. 203-08 keeps the single static 203.08-paul-timothy-bw.jpg with touchNext: true; no color/sequence work is assigned, and ART-008 is paused pending new direction. All lesson prose, Scripture, questions/IDs, readings, widgets, index and saved-answer code are unchanged. 101-07 text remains Silver; this is specific artwork approval only.

ART-STORY-SEQUENCES-B2 DONE. Foundation/export/storage/assets/images/iframe and browser checks pass: sequences plus static/revert guards (266), prayer/listen (39), Jesus sends (69), Timothy (34). Exact-head Firebase preview, production checks and merge evidence are recorded on PR #248. Evidence: [Codex integration log](project-management/logs/2026-11-15-ART-STORY-SEQUENCES-B2-codex.md).

## Historical story-art delivery checkpoint, November 14, 2026 (affected decisions superseded above)

Dave approved all four story-art sequences in PR #240 at 419c6a7: 101-07 shepherd (4 frames), 201-05 lamp (2), 203-02 Nehemiah (3), and 203-07 Jesus sends the 72 (4). All 13 original frames, 26 optimized WebP copies, stops/order, touchNext placement and image-map additions are preserved. The original jesus-sends-72.jpg remains unchanged on disk. Lesson wording, Scripture, questions/IDs, reading keys, index.html and the recently approved widgets remain untouched. This records story-image approval only, not whole-lesson Gold or new wording approval. This supersedes older missing/static-art inventory notes for these four lessons only. Current task status and verification are in project-management/TASKS.md and logs/2026-11-14-ART-STORY-SEQUENCES-4-codex.md.

202 and 203 status refreshed October 12, 2026. Other project status below retains its prior audit dates. This is a lightweight orientation. Current task status lives in [project-management/TASKS.md](project-management/TASKS.md); immediate next work is in [project-management/HANDOFF.md](project-management/HANDOFF.md). Lesson order and browse metadata remain in curriculum-toc.csv.

## Current direction

Dave approved the baseline review's direction on September 11: protect saved work, preserve the pastoral story/Scripture/image/tool/practice rhythm, finish the curriculum, and add a Read/Discuss presentation for laptop preparation and phone conversations. The full project is 47 lessons; the 37 foundational lessons receive production priority. Leadership release timing will be reviewed at week six.

The working plan, all-lesson checklist, approval queue and portable agent prompts are now in `project-management/`. Routine agents take one bounded task. As of September 16, 2026, Claude (Cowork) is the coordinator and daily reviewer. This is a manual workflow; no scheduler or automatic account/model switch has been configured.

## Current 202 status

As of October 12, 2026, all ten current 202 lesson JSON files contain substantive teaching, Scripture, discussion questions and closing reflections. There are no empty lessons or brief placeholders in 202. Draft coverage does not establish editorial, visual, technical, pilot or release readiness. Dave's recorded September 26 approvals for 202-08, 202-09 and 202-10 match the current lesson text; final approval for 202-01 through 202-07 is unrecorded. See [the 202 review checklist](project-management/DAVE.md#202-review-checklist-october-12-2026).

## Current 203 organization, October 12, 2026

Ten active files stay in their numbered positions; five JSON title fields now match curriculum-toc.csv. Existing 06 work/school and 09 missions drafts are integrated with September 26 approvals recorded on the board. Chapters 02 and 03 need scope revision, 08 still teaches Belonging, and 10 is a brief stub. Original 08 material is preserved in data/standby. No lesson prose, saved-answer IDs or pastoral approval records changed. See [the placement checkpoint](project-management/reviews/2026-10-12-203-placement.md). This supersedes historical 203 coverage claims below, without establishing release readiness.

## Verified baseline (historical, September 11)

The September 11 audit examined app/content commit `fce80bc`. There are 47 JSON lesson files: 32 with substantive material and 15 empty/brief placeholders. These are writing categories, not approval status. One substantive draft also needs a topic rebuild.

- 101: all seven have substantive text; production/editorial checks remain.
- 201: all ten have substantive text and widgets; priority edits include 201-03/04/08/09. 201-01 and 201-08 are production benchmarks to refine; 201-10 remains a template exemplar.
- 202: the September 11 baseline found 202-08 empty and 202-09 a brief stub. Both have since been written and approved. The current 202 status above supersedes this historical finding.
- 203: 203-06 and 203-10 are brief stubs; 203-09 is empty. 203-08 contains older Belonging material that does not match its current purpose. 203-05 is substantive.
- 301: all ten are placeholders requiring full development.

The baseline foundation QA passes. Additional audit found shared saved-answer IDs in two lesson pairs, four missing images, iframe errors, misleading export scope, and metadata/content drift. See the task board for fixes and the dated review for evidence. None of those app/content repairs were implemented by the initial planning packet.

## Immediate work

ENG-001 is next: preserve saved answers while repairing the ID collisions in 202-05/09 and 203-06/07, with regression checks. ENG-002 restores missing image assets; ENG-003 handles iframe initialization/resizing; ENG-004 corrects export behavior. Security cleanup is tracked separately as SEC-001.

The former 202-08/09 drafting and approval request is superseded by the recorded September approvals. The current 202 review checklist is in project-management/DAVE.md. His general approval authorizes drafting and fixes; final wording approval is recorded against specific lesson versions.

## Architecture and folder responsibilities

- `index.html`: app shell, styles, lesson renderer, navigation and local answer persistence.
- `data/`: lesson sources; `data/standby/`: historical/alternative material, not current published lessons.
- `curriculum-toc.csv`: lesson order, titles, subtitles, tool/story labels, key verse and summary.
- `widgets/`: standalone interactive HTML tools.
- `images/`: lesson artwork and logos.
- `Lesson_research/`: drafting research.
- `project-management/`: plan, task status, handoff, approval queue, task logs and dated reviews.

The current app stores work in the current browser/device. Login and a database provider are undecided. DATABASE-PLAN.md is a prior proposal, not authorization to select Supabase. Stable IDs, backup/recovery and the device-handoff requirements can be established now.

The current app uses Date.now cache busting. PERF-001 owns the approved future production-versioning change and must update the technical brief when it is implemented. Do not change this as an incidental cleanup.

## Source and coordination rules

Read AGENTS.md and AI-START-HERE.md for task-specific context. Keep theology/voice aligned with the Compass and lesson structure aligned with the template. Keep the intentional 101 closing-question exception. Update the TOC when learner-facing metadata changes. Before stopping, log checks and the next action so another agent can continue from the repository.
