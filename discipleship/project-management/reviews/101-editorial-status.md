# 101: Dave's editing and component approvals

Updated November 13, 2026. Baseline: main `fc3be3c`. Checked current main and open PRs; no pending 101 lesson revision was found. This replaces older scorecards for the question of what Dave should personally edit next. Those dated grades remain historical evidence.

## Three stages

- **Bronze:** the text needs a substantial drafting pass before Dave's close edit.
- **Silver:** a healthy draft, awaiting confirmation of Dave's completed paragraph-by-paragraph review.
- **Gold:** Dave confirms that he has completed that personal review. Protect the reviewed wording. An AI grade, passing checks or permission to publish cannot award Gold.

Stages describe the text review, independently of widget and image approval. Gold does not mean that an unapproved image or widget is approved. It is not a release or pilot gate. No Bronze text is assigned in this 101 snapshot; missing art is shown separately.

## The five-column view

| Lesson | Title | Stage | Approved widget | Approved image |
|---|---|---|---|---|
| 101-01 | Welcome. Let's Start Growing. | Silver: Dave-edited, protected | Yes: Peaks and Valleys V2 (#223) | Approval unrecorded: course graphic |
| 101-02 | Salvation and Baptism | Silver: Dave-edited, protected | Yes: A-B-C-D road to cross | Approval unrecorded: greenhouse sequence |
| 101-03 | Prayer | Silver | No iframe widget; prayer exercise awaits review | Missing |
| 101-04 | The Bible | Silver | No iframe widget; Discovery Questions exercise awaits review | Missing: Nicodemus lamplight planned |
| 101-05 | The Church | Silver | No iframe widget; serving checklist awaits review | Approval unrecorded: aspen pair |
| 101-06 | Sharing Jesus with Others | Silver: earlier Dave edits protected | No iframe widget; BLESS exercise awaits review | Approval unrecorded: woman-at-well pair / BLESS graphic |
| 101-07 | When You Drift | Silver | No iframe widget; Stop, Turn, Tell, Receive awaits review | Missing |

Silver on 101-01/02 is conservative, not a request to rewrite them. Dave says he has worked hard on both. Dave confirmed both personal read-throughs are still in progress; promote either to Gold only when he confirms completion. The record does not treat partial paragraph edits as approval of unseen paragraphs. Existing specific approvals remain in force even on Silver lessons.

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
