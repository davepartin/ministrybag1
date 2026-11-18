# 101: Dave's editing and component approvals

Updated November 14, 2026 for the approved 101-01 V2 component and exercise sentence in PR #223 at `ea26435`. Other rows retain the November 13 baseline at main `fc3be3c` unless separately updated. These review stages replace AI scorecards for deciding what Dave should personally edit next; dated grades remain historical evidence.

## Three stages

- **Bronze:** the text needs a substantial drafting pass before Dave's close edit.
- **Silver:** a healthy draft, awaiting confirmation of Dave's completed paragraph-by-paragraph review.
- **Gold:** Dave confirms that he has completed that personal review. Protect the reviewed wording. An AI grade, passing checks or permission to publish cannot award Gold.

Stages describe the text review, independently of widget and image approval. Gold does not mean that an unapproved image or widget is approved. It is not a release or pilot gate. No Bronze text is assigned in this 101 snapshot; missing art is shown separately.

## The five-column view

| Lesson | Title | Stage | Approved widget | Approved image |
|---|---|---|---|---|
| 101-01 | Welcome. Let's Start Growing. | Silver: Dave-edited, protected | Gold: Peaks and Valleys V2 | Gold: course logo |
| 101-02 | Salvation and Baptism | Gold: whole lesson approved and protected | Gold: A-B-C-D road to cross | Gold: greenhouse sequence |
| 101-03 | Prayer | Silver: Dave edits protected | Yes: The Lord's Prayer (#266, 3542e12) | Yes: Teach Us to Pray dawn dissolve (`101-03-prayer-bw/color.jpg`) |
| 101-04 | The Bible | Silver: Dave edits protected | Yes: Read, Discover, Respond compact polish (#262, 6a4c1e7) | Yes: Nicodemus oil-lamp dissolve (#263, b52e4f4) |
| 101-05 | The Church | Silver: Dave edits protected | Yes: compact potluck serving buttons (#232, b83efe3) | Yes: Aspen Grove separate-to-connected roots dissolve |
| 101-06 | Sharing Jesus with Others | Silver: earlier Dave edits protected | Yes: BLESS Rhythms (#233, 7949607) | Yes: Woman at the Well sunlit well dissolve |
| 101-07 | When You Drift | Silver | Yes: Repentance is 180 Degrees; B&W refinement (#254, a93a673), original component #251 retained in approval history | Yes: four-frame shepherd sequence; B&W frame 4 approved (#248, ae5c9d4) |

101-01 remains Silver with Dave edits protected. Dave has now explicitly approved the whole 101-02 lesson, its A-B-C-D widget and its greenhouse image sequence Gold (November14). Preserve the exact recorded text, questions, readings, widget and images; new edits require his specific direction. The record does not treat partial paragraph edits as approval of unseen paragraphs. Existing specific approvals remain in force even on Silver lessons.

"Approval unrecorded" means that the image exists but this check did not establish Dave's approval of its exact current version. Do not replace it. "Missing" describes the current lesson, not a failed image. A working exercise can satisfy the teaching-tool need without a new animated widget.

## Protection instructions for every agent

1. Protect Dave's edits to 101-01 and 101-02 immediately, regardless of stage. Protect the six exact edits recorded for 101-06 in PR #142 as well. Only the specifically approved BLESS section in PR #233 is assigned for 101-06; broader content work remains unassigned.
2. Do not rewrite a protected lesson to improve an AI score, make tone uniform or shorten it. Propose changes to Dave first. His specific new editing instruction authorizes that specific change.
3. Do not remove, swap, redraw or reorder any existing 101 story art or sequence without Dave's explicit direction, including art whose approval is unrecorded. Story art and widgets are independent approval decisions. Technical integration must preserve the approved appearance and wording; report any necessary technical correction.
4. Before touching a 101 lesson, compare current main and pending PRs with this record and the companion component fingerprints. A changed file does not automatically inherit an earlier approval. Record the version Dave actually reviewed, date, evidence and any exceptions.
5. After an authorized change, tell Dave exactly which paragraph or component changed and where to reread. Keep question IDs, saved answers, reading assignments and Scripture intact.

These instructions implement Dave's direct request in chat on November 13. They supersede older generic trim or art-refresh backlog assignments for protected work. They do not authorize new prose, widget or art jobs.

## Evidence and next focus

- 101-01: Dave's current report of personal editing; widget approved in his #217 merge request. Latest widget integration is `fc3be3c`; original approval source `832da0a`. All lesson prose was preserved by that integration.
- 101-02: Dave's direct A-B-C-D design direction, description of the completed widget as "amazing," and instruction to publish; integrated through #206. His exact baptism Review wording and accepted Scripture cuts are recorded in #209 and #212. Current widget remains `widgets/romans-road3.html`.
- 101-06: six wording edits from Dave followed by "merge it" recorded in DAVE.md, REWORK-101-06 / #142. This is evidence of protected specific edits, not automatic final approval of every component.
- Component fingerprints: [101-editorial-baseline.json](101-editorial-baseline.json). These are a reference snapshot, not an automated CI lock or a new approval.
- Next suggested conversation: **101-03 Prayer**. Its Father-centered story, approved Lord's Prayer widget and approved dawn story-art dissolve are present. Read it with Dave before proposing prose changes. 101-04 now has the approved Nicodemus oil-lamp pair (#263); preserve it. The 101-07 shepherd sequence is now approved in PR #240 and must be preserved. Do not generate or replace art under this documentation task.

One specific consistency suggestion, not implemented: 101-02 still introduces "three letters, the ABCs of salvation" and says "Each stop is one verse from Romans," while the approved widget now includes D for discipleship. Propose a short bridge that preserves A-B-C as the salvation response and introduces D as following Jesus afterward. Ask Dave to approve the wording; do not silently reopen his edited lesson.

November14 update: Dave approved the exact V2 widget at ea26435 and the one exercise sentence "Include 3 to 5 peaks and 3 to 5 valleys." All other 101-01 copy, questions, readings and artwork remain protected. Component fingerprints for 101-01 now reflect this approved update; all other lesson fingerprints retain their original baseline.

Gold update, November14: Dave explicitly said "101-02 widget gold and 101-02 image are gold.whole lesson is gold". Approval applies to current main ae1c78e and the recorded component hashes. This supersedes older in-progress notices for 101-02. It does not change 101-01 or 101-05 text stages or waive release/pilot gates.

November 14, Dave explicitly approved the 101-01 logo and widget Gold and requested removal of question 1.5. The prompt is retired under its original ID, so any earlier answer remains available in Email. Whole lesson remains Silver.

November 14: Dave confirms 101-05 Silver. His requested serving choices and the move of 5.3 after the potluck teaching are specific approved edits, not whole-lesson or component Gold. Preserve other wording and aspen art.

November 14: Dave explicitly approved only the 101-04 Read, Discover, Respond widget component in PR #229 at 21bb29b. Preserve the approved HTML bytes and placement after "These questions give you a place to begin..." before Try It: Nicodemus Meets Jesus. Whole-lesson text remains Silver for his later review; story art remains missing. No existing wording, Discovery Questions box, Scripture, John 10-12 readings or question IDs are changed.

November 14: Dave approved PR #233 at 79496076f1bca314c0a8d352180685b5408a627c, including the BLESS Rhythms widget, its section copy and placement. This specific assignment supersedes the earlier no-new-101-06-work restriction only for that approved section. Preserve both approved files exactly. The static BLESS graphic and box are replaced in the lesson; the original graphic remains on disk. Woman-at-the-well story art and all other copy, Scripture, readings and question objects are unchanged. Whole-lesson text stays Silver with Dave's earlier edits protected; no story-image or whole-lesson Gold approval is inferred.

November 14: Dave approved PR #232 at b83efe3, including the compact three-column single-screen service checklist, its prompt and blue/teal/mustard buttons. Preserve approved index.html styling/behavior and checklist JSON. Original numeric slots, including retired combined men's/women's ministry index 11, remain reserved; new separate choices append at 27 and 28. All other lesson content and aspen artwork are unchanged. Text stays Silver; no image or whole-lesson Gold approval is inferred.

November 14: Dave approved the four-frame 101-07 shepherd story sequence in PR #240 at 419c6a7. Image approval only; text stays Silver and all wording, questions, reading keys and existing tool remain unchanged. Preserve the approved frames, order, stops and placement.

November 15: Dave approved PR #248 at ae5c9d4: retain 101-07 sequence order/stops/placement and frames 1-3, replace only frame 4 and its delivery copies with the approved B&W cloak version. The recorded hash and image approval source now identify that exact replacement. Text stays Silver and unchanged. This supersedes the earlier frame-4 color approval only.

November 15: Dave directed a rethink of 101-07 (shorter; grace keeps you saved; obedience shows love; getting back up; room for a first conversation about sin). Draft on branch claude/rewrite-101-07 at REVIEW, not merged. The approved four-frame shepherd sequence and its parable text are unchanged. Stage stays Silver until Dave reads it.

November 16: Dave approved the 101-07 rewrite text in PR #249 ("approved, merge it, keep them retired") at 7963809. Questions 7-3 and 7-hand stay retired with IDs reserved. Protect the approved wording. The approved stop-turn-walk widget (#251) replaces the interim "The 180: Stop, Turn, Walk" box when Codex integrates it. Gold is not claimed; it needs Dave's confirmed personal review.

November 15: Dave approved widget PR #251 at 53d2d60. The 510px embed follows the three-step setup in the current approved #249 wording. All current prose, the teaching box, eight active questions, two retired question objects/IDs, John 19-21 and the approved B&W shepherd sequence are preserved. Text remains Silver.

Later November 15: Dave explicitly requested removing the interim The 180: Stop, Turn, Walk box now that #251 is merged. Only that box is deleted; the approved widget remains directly after the three-step setup. This supersedes the earlier box-retention note. All other wording, active/retired answers, reading keys and story art stay protected. Text remains Silver.

November 16: Dave's nine exact 101-07 wording edits applied word for word after the widget placement (#251). Protect them along with the approved rewrite.

November 16: Dave's exact 101-03 edits (summary and phrase "Prayer is talking with a Father who loves to listen", recap, Teach Us to Pray with his theology correction, Lord's Prayer label, 3.3 and 3.4 wording) merged in PR #258. Protect them. Stage stays Silver.

November 16: Dave approved the simpler 101-04 (PR #259): the approved Read, Discover, Respond widget now teaches the Three Discovery Questions alone; the duplicate box and paragraphs, the A Tool You Can Share section and 4.5 (4-6, retired) are removed. Dave's standing rule: 101 lessons do not need teach-it questions.

November 16: Dave explicitly approved PR #263 at b52e4f4ab59024193484e23eff0ad99d90904bae, the 1280x720 darker-to-lighter clay oil-lamp dissolve, its four delivery copies and placement directly before Questions in the Night. Image approval only. Current #259 simplification, all eight active questions, retired 4-6, Scripture, John 10-12 and the approved Read, Discover, Respond widget remain unchanged. Fingerprints now capture this current protected version and the approved image files. Text stays Silver; older missing-art notes are superseded.

November 16: Dave requested an earlier 101-04 lamp reveal after seeing it finish above the screen. Only the new imageDissolveOnEntry timing flag is enabled on this image. It brightens on entry and finishes when centered below the fixed header. Both approved JPGs, all WebP files, placement, prose, questions, readings and widget stay unchanged. The baseline records this timing-only update; text remains Silver.

November 16: Claude's 101 course review is saved at reviews/2026-11-16-101-course-review.md. Dave loves almost all of its ideas; work goes one lesson at a time, starting with 101-03. Read it before proposing 101 changes.

November 16: Dave explicitly approved PR #266 at 3542e12bc85b2d8793e4402d04b744737b9ebdca. Preserve the exact Lord's Prayer accordion widget, title and registration, replacing only the static prayer verse block in 101-03. All other prose, step teaching, eight questions/IDs, John 7-9 and Daily Prayers tool remain unchanged. Widget component approval only; text remains Silver and story art remains missing. The baseline now records this component and current protected lesson. The separate #267 course review is preserved.

November 16: Dave approved the Course 101 story art upgrades for 101-03 (`101-03-prayer-bw/color.jpg`), 101-05 (updated `aspen-bw.png` -> unchanged `aspen-color.png`), and 101-06 (unchanged `woman-well-bw.png` -> sunlit well `woman-well-color.png`), with `imageDissolveOnEntry: true` on all three so the full dissolve completes while centered and visible before scrolling to the top. Nonvisual prose, Scripture, questions, readings, and widgets remain unchanged; texts remain Silver.

PR #268 integration preserves the approved #266 Lord's Prayer widget and its component approval alongside the new 101-03 story art. The 101-05 checklist and 101-06 BLESS widget also remain exact. All three lesson texts stay Silver.

November 16: Dave approved the exact Lord's Prayer hint follow-up in PR #270 at 23660ca: Choose a line to see its step alongside MATTHEW 6:9-13. The current widget hash records that approved follow-up. Lesson JSON, all other widget behavior/copy, artwork and the new #271 B&W hold remain unchanged. Component-only approval; text stays Silver.

November 16: Dave approved merge of PR #269 at 65cc110, the exact eight-block voice revision for 101-03: second-person What Is Prayer, the Matthew 6:9-13 / Luke 11:2-4 introduction and six step explanations. Protect this wording. All headings, quoted prayer lines, practice, review, questions/readings, dawn art, #270 hint and #271 hold remain unchanged. Text remains Silver; this approval does not infer whole-lesson Gold.

November 17: PR for VOICE-101-05 (branch claude/101-05-church) applies Dave's six approved parts for 101-05. The aspen art and dissolve, every verse, and the checklist items and indexes are unchanged. The teach-it question 5-hand is retired, and 5-4 is renumbered 5.3. Awaiting Dave's review.
November 17: Dave approved merge of PR #275, the six-part 101-05 revision. Protect this wording. Aspen art, verses and checklist items and indexes are unchanged.

November 17: PR for CLEANUP-101-06 (branch claude/101-06-cleanup) applies Dave's three approved parts for 101-06. The BLESS widget, woman-at-the-well art, verses and earlier Dave edits are unchanged. All question IDs are kept. Awaiting Dave's review.
November 17: Dave approved merge of PR #276, the three-part 101-06 cleanup. Protect this wording. BLESS widget, art and verses unchanged.

November 17: PR for REVIEW-LINES-101 (branch claude/101-review-lines) changes one sentence in each of the 101-04 and 101-07 reviews, as Dave approved in chat. Awaiting Dave's review.
November 17: Dave approved merge of PR #278, the 101-04 and 101-07 review sentences. Protect this wording.

November 17: PR for FLOW-101-01-02 (branch claude/101-01-02-flow). In 101-01 the three opening questions are spread to the sections they belong to (IDs kept, wording unchanged). In 101-02, Dave approved reopening one sentence for the D-for-Discipleship bridge. Awaiting Dave's review. Dave decided the 101-03 practice may keep linking to the Daily Prayers site for now.
November 17: Dave approved merge of PR #280 (101-01 question flow, 101-02 D bridge). Protect this wording. Still open, offered to Dave and not yet approved: the 101-01 "Your Story So Far" line "The exercise below will help you..." (suggested "This exercise will help you...").


November 17: Dave approved PR #254 at a93a67350290bbe7520e2af8fb0c0c29650b8953 for the B&W stop-turn-walk refinement. The exact HTML and two browser scripts are preserved. Only the widget component fingerprint/approval changes; current 101-07 JSON, retired/active answers, John readings and shepherd sequence remain unchanged. Text stays Silver; no whole-lesson Gold is inferred.

November 17: PR for BELOW-101-01 (branch claude/101-01-below-line) makes the one-line "below" fix in 101-01, as Dave approved in chat. Awaiting Dave's review.
November 17: Dave approved merge of PR #281, the 101-01 "below" line. Protect this wording.

November 17: Dave approved the Daily Prayers look and requested same-site Growing Apps access from home and related lessons (PR #261). In 101-03 only the tool URL changes from ministrybag.com/dailyprayers/ to tools/daily-prayers/. Every paragraph, question/ID, reading, image and approved Lord's Prayer widget stays unchanged. Baseline fingerprints reflect this navigation-only change; text remains Silver.

November 17: Dave explicitly approved and requested merge of PR #262 at 6a4c1e7. Protect the compact widget HTML: half-size Bible, closed cover right-aligned so it opens left, right-to-left wipe, and 30 percent shorter diagram. Ready passage dimming and shorter Ready card are approved too. This supersedes the initial #229 widget bytes only. All 101-04 lesson wording, questions/readings, oil-lamp artwork and placement are unchanged; whole lesson stays Silver.
November 17: Course grade recorded in [2026-11-17-101-course-grade.md](2026-11-17-101-course-grade.md): AAA, all seven lessons. Dave: the series logo is 101-01's intended image; 7.2 stays. Gemini widget polish PRs #254 and #262 are both merged, so 101 is complete.


November 17: Dave requested a short Heart52 hint in 101-04. One optional linked sentence is added after This Week's Practice. All existing text, questions/IDs, John readings, approved lamp art and widget remain unchanged. This addition awaits review with the new companion; whole-lesson text remains Silver.

November 18: Dave explicitly authorized publication of #261/#288/#296. The previously requested101-04 Heart52 hint is approved as part of that companion integration; existing prose/questions/John readings/lamp/widget and lesson stage remain unchanged. Current-main course-grade history is retained.
