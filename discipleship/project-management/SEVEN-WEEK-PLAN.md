# Seven-week finish plan: November 2 to December 19, 2026

Owner: Dave Partin. Drafted November 2, 2026 from live main (latest discipleship commit 2026-10-30, PR #67). This file tracks the plan; [TASKS.md](TASKS.md) stays the status board and [DAVE.md](DAVE.md) the approval record. Being on main is not approval. Saturdays are Sabbath.

## Priorities, in order

1. Dave reads and approves the 37 written lessons in 101, 201, 202 and 203 (only 5 approvals recorded).
2. Close the open reviews: UX-004 (PR #28), PRs #56 to #65 uplift rows, ORG-203, DOC-202-STATUS, ENG-002 art.
3. Decide 301 scope now (DAVE-004, overdue since week six): all ten 301 lessons are placeholders.
4. Pilot at least two learner pairs on overlapping samples (PILOT-001/002).
5. Release candidate for the 37 lessons by December 19; 301 drafts only if Dave chooses.
Deferred unless Dave says otherwise: login/provider (DATA-001/002), Read/Discuss rollout (UX-001 to UX-003).

## Lesson status board

| Course | Lessons | On main | Board status | Dave approval recorded |
|---|---|---|---|---|
| 101 | 01 to 07 | uplifted draft (PR #62) | REVIEW | none |
| 201 | 01 to 10 | uplifted draft (PRs #56, #57, #59) | REVIEW | none; 201-08 also needs DAVE-002 justification wording |
| 202 | 01 to 07 | uplifted draft (PRs #60, #61) | REVIEW | none |
| 202 | 08, 09, 10 | approved text | DONE (pilot pending) | 2026-09-26 |
| 203 | 01, 04, 05, 07 | uplifted draft (PR #58) | REVIEW | none |
| 203 | 02, 03 | BLESS rewrite (prayer, listen and eat) | REVIEW | none |
| 203 | 06, 09 | approved text; art missing (ART-004, 203-09 pair) | DONE (pilot pending) | 2026-09-26 |
| 203 | 08, 10 | Dave rewrote Oct 29 to 30 (SPACE loop, PRs #66, #67) | board row stale, says PR #58 | Dave authored; record approval |
| 301 | 01 to 10 | placeholder stubs (under 1 KB each); ideas in data/standby and Lesson_research | TODO | n/a |

Grades: reviews/2026-10-21-lesson-grades.md is the pre-uplift snapshot (6 Ready, 10 Polish, 13 Revise, 1 Rework). Uplift logs claim most lessons now reach B+ to A-. Theology calls only Dave can make are listed in that file (201-09 vine roles, 201-04 good soil, 202-05 Genesis 50:20, 202-04 APEST, 201-08 justification, 201-03 Trinity, 201-06 personal fall, 202-07 cross, 202-01 Luke 10, 203-10 Bezalel); confirm each was fixed during the uplift.

## Open engineering and PRs

| Item | State | Next |
|---|---|---|
| PR #28 UX-004 restore labels | REVIEW since Sep 16, likely stale vs main | Rebase check, rerun build_answer_index.js and suites, then Dave go-ahead |
| PR #2 denomination guide | DRAFT since July | Dave: keep or close |
| ORG-203 branch | REVIEW, superseded in part by PRs #58, #66, #67 | Coordinator reconciles or closes |
| ENG-002 / DAVE-006 art | REVIEW | Dave phone check of 202-10 and 203-04 pairs |
| ART-004 and 203-09 story art | TODO | Image worker |
| PERF-001, A11Y-001, PRINT-001, QA-001 | TODO | Needed for release gates |
| Release-check scripts | present in scripts/ | Run qa_foundation.sh plus all tests each week |

## Week by week

| Week | Dates | Dave | Bots |
|---|---|---|---|
| 1 | Nov 2 to 7 | Decide 301 scope (DAVE-004). Read 203 course (02, 03, 08, 10 first). Name pilot pairs (DAVE-003). | Coordinator: refresh TASKS/HANDOFF for PRs #56 to #67; reconcile ORG-203; rebase and verify PR #28. Review bot: re-grade all 37 against current main. |
| 2 | Nov 9 to 14 | Approve or mark edits for 203 and 202-01 to 07. Decide the ten theology calls. | Lesson bot: apply Dave's 203/202 edits. Engineering bot: QA-001 full regression, ESV quotation audit list. |
| 3 | Nov 16 to 21 | Read 201 (incl. DAVE-002 201-08). First pilot sessions on 201-01/08. | Lesson bot: 201 edits. Art bot: ART-004, 203-09 pair, DAVE-006 fixes. If 301 in scope: draft 301-01 to 03. |
| 4 | Nov 23 to 28 (Thanksgiving, light) | Read 101. | Engineering bot: PERF-001 image compression, A11Y-001 pass. 301 drafts 04 to 06 if in scope. |
| 5 | Nov 30 to Dec 5 | Second pilot round; approve 101. | Lesson bot: pilot fixes. Engineering bot: PRINT-001, cross-device handoff test. 301 drafts 07 to 10 if in scope. |
| 6 | Dec 7 to 12 | Release review of all 37; read 301 drafts if any. | Review bot: full gate audit; church-use guide draft (CHURCH-001). |
| 7 | Dec 14 to 19 | Final approval, release decision. | Fix verified blockers only; no gate waived for the date. |

## Bot lanes (one implementer per file set)

| Lane | Owns | Does not touch |
|---|---|---|
| Coordinator | TASKS.md, HANDOFF.md, this file, merges after review | lesson prose |
| Lesson copy | data/NNN-NN.json for assigned lessons, its log | index.html, scripts, shared widgets |
| Engineering | index.html, scripts/, shared widgets, tests | lesson prose, saved-answer IDs without migration |
| Art | images/ for assigned lessons | everything else |
| Review | reviews/ and logs/ only; read-only on lessons | direct edits |

Every packet: own branch, stop at REVIEW, log in logs/, no real learner answers or credentials, no em dashes.

## Waiting on Dave

| ID | Decision | Needed by |
|---|---|---|
| DAVE-004 | 301 in this release or later | Nov 7 |
| DAVE-003 | pilot pairs | Nov 7 |
| Approvals | 32 unrecorded lessons | rolling, Weeks 1 to 5 |
| Theology calls | ten items above | Nov 14 |
| DAVE-002 | 201-08 justification wording | Nov 21 |
| DAVE-006 | art on phone | Nov 21 |
| UX-004, PR #2 | merge or close | Nov 14 |
