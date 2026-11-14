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
| 101-04 | The Bible | Silver | No iframe widget; Discovery Questions exercise awaits review | Missing: Nicodemus lamplight planned |
| 101-05 | The Church | Silver: Dave edits protected | No iframe widget; serving checklist awaits review | Approval unrecorded: aspen pair |
| 101-06 | Sharing Jesus with Others | Silver: earlier Dave edits protected | No iframe widget; BLESS exercise awaits review | Approval unrecorded: woman-at-well pair / BLESS graphic |
| 101-07 | When You Drift | Silver | No iframe widget; Stop, Turn, Tell, Receive awaits review | Missing |

101-01 remains Silver with Dave edits protected. Dave has now explicitly approved the whole 101-02 lesson, its A-B-C-D widget and its greenhouse image sequence Gold (November14). Preserve the exact recorded text, questions, readings, widget and images; new edits require his specific direction. The record does not treat partial paragraph edits as approval of unseen paragraphs. Existing specific approvals remain in force even on Silver lessons.

"Approval unrecorded" means that the image exists but this check did not establish Dave's approval of its exact current version. Do not replace it. "Missing" describes the current lesson, not a failed image. A working exercise can satisfy the teaching-tool need without a new animated widget.

## Protection instructions for every agent

1. Protect Dave's edits to 101-01 and 101-02 immediately, regardless of stage. Protect the six exact edits recorded for 101-06 in PR #142 as well. No new 101-06 content work is assigned.
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
- Next suggested conversation: **101-03 Prayer**. Its Father-centered story and practical prayer exercise are present; its opening artwork is missing. Read it with Dave before proposing prose changes. Then consider 101-04's missing Nicodemus lamp art and 101-07's missing shepherd art. Do not generate or replace art under this documentation task.

One specific consistency suggestion, not implemented: 101-02 still introduces "three letters, the ABCs of salvation" and says "Each stop is one verse from Romans," while the approved widget now includes D for discipleship. Propose a short bridge that preserves A-B-C as the salvation response and introduces D as following Jesus afterward. Ask Dave to approve the wording; do not silently reopen his edited lesson.

November14 update: Dave approved the exact V2 widget at ea26435 and the one exercise sentence "Include 3 to 5 peaks and 3 to 5 valleys." All other 101-01 copy, questions, readings and artwork remain protected. Component fingerprints for 101-01 now reflect this approved update; all other lesson fingerprints retain their original baseline.

Gold update, November14: Dave explicitly said "101-02 widget gold and 101-02 image are gold.whole lesson is gold". Approval applies to current main ae1c78e and the recorded component hashes. This supersedes older in-progress notices for 101-02. It does not change 101-01 or 101-05 text stages or waive release/pilot gates.

November 14, Dave explicitly approved the 101-01 logo and widget Gold and requested removal of question 1.5. The prompt is retired under its original ID, so any earlier answer remains available in Email. Whole lesson remains Silver.

November 14: Dave confirms 101-05 Silver. His requested serving choices and the move of 5.3 after the potluck teaching are specific approved edits, not whole-lesson or component Gold. Preserve other wording and aspen art.
