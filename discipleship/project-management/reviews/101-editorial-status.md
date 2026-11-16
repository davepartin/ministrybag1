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
| 101-03 | Prayer | Silver | No iframe widget; prayer exercise awaits review | Missing |
| 101-04 | The Bible | Silver: Dave edits protected | Yes: Read, Discover, Respond (#229, 21bb29b) | Yes: Nicodemus oil-lamp dissolve (#263, b52e4f4) |
| 101-05 | The Church | Silver: Dave edits protected | Yes: compact potluck serving buttons (#232, b83efe3) | Approval unrecorded: aspen pair |
| 101-06 | Sharing Jesus with Others | Silver: earlier Dave edits protected | Yes: BLESS Rhythms (#233, 7949607) | Approval unrecorded: woman-at-well pair |
| 101-07 | When You Drift | Silver | Yes: Repentance is 180 Degrees (#251, 53d2d60) | Yes: four-frame shepherd sequence; B&W frame 4 approved (#248, ae5c9d4) |

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
- Next suggested conversation: **101-03 Prayer**. Its Father-centered story and practical prayer exercise are present; its opening artwork is missing. Read it with Dave before proposing prose changes. 101-04 now has the approved Nicodemus oil-lamp pair (#263); preserve it. The 101-07 shepherd sequence is now approved in PR #240 and must be preserved. Do not generate or replace art under this documentation task.

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
