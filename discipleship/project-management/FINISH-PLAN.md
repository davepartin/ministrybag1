# Growing Together finish plan

Undated backlog. Drafted November 2, 2026 from live main. Scope: the 37 lessons in 101, 201, 202 and 203. The 301 series is out of scope by Dave's decision on November 2, 2026, and its placeholders stay as they are. [TASKS.md](TASKS.md) stays the status board, [DAVE.md](DAVE.md) the approval record, and [LESSON-GRADES-SUMMARY.md](LESSON-GRADES-SUMMARY.md) the grades view. Being on main is not approval. Saturdays are Sabbath.

## Priorities

1. Lock the template lessons and the bar they set (see the grades summary): 203-08 SPACE, 201-08, 203-06, 202-08 and 202-09.
2. Re-grade current main and fix every lesson still below B+, starting with the lowest-graded ones.
3. Dave approves all 37 lessons. 5 are approved and 32 are unrecorded.
4. Run pilots with learner pairs.
5. Close out engineering and art needed for release.
Deferred: login and provider (DATA-001/002), the Read/Discuss rollout (UX-001 to UX-003).

## Lesson status

| Course | Lessons | State | Dave approval |
|---|---|---|---|
| 101 | 01 to 07 | Uplifted (PR #62), REVIEW | none |
| 201 | 01 to 10 | Uplifted (PRs #56, #57, #59), REVIEW | none |
| 202 | 01 to 07 | Uplifted (PRs #60, #61), REVIEW | none |
| 202 | 08 to 10 | Approved text, pilot pending | 2026-09-26 |
| 203 | 01, 04, 05, 07 | Uplifted (PR #58), REVIEW | none |
| 203 | 02, 03 | BLESS rewrite, REVIEW | none |
| 203 | 06, 09 | Approved, art missing | 2026-09-26 |
| 203 | 08, 10 | Dave rewrote with SPACE (PRs #66, #67). The board row is stale. | record |

## Backlog, in priority order

### Phase 1: set the bar
- [ ] Refresh the TASKS and HANDOFF rows for PRs #56 to #67, including 203-08 and 203-10. Mark 301 out of scope. Close DAVE-004 as decided. (Coordinator)
- [ ] Write the template checklist from 203-08 and 201-08 into AI-LESSON-CHECKLIST.md: think, talk, learn, do, one truth, grace first, one story plus one tool, 3 to 5 questions, practice, Review, closing trio, 1,000 to 1,500 words. (Review bot, Dave approves)
- [ ] Dave approves the 201-08 justification wording (DAVE-002) and records 203-08 and 203-10. (Dave)
- [ ] Re-grade all 32 unapproved lessons on current main and replace the pre-uplift grades. (Review bot)

### Phase 2: lift the low grades
- [ ] Dave makes the ten theology calls listed in the grades summary. (Dave)
- [ ] Fix lessons still below B+, lowest first: 203-02, 202-05, 203-03, 201-09, 202-06, 202-07, then the C+ group. One lesson per packet, stop at REVIEW. (Lesson bot)
- [ ] ESV audit of the non-ESV quotations in lessons and widgets. (Lesson bot, plus engineering for widgets)
- [ ] Trim lessons over 1,500 words and remove the repetition the grades file found. (Lesson bot)

### Phase 3: approvals
- [ ] Dave reads and approves by course: 203, 202, 201, 101. Record each approval in DAVE.md with its commit. (Dave, coordinator records)
- [ ] Apply Dave's edits from each read. (Lesson bot)

### Phase 4: pilots
- [ ] Name 4 to 6 pilot pairs (DAVE-003). Keep their names out of the repo. (Dave)
- [ ] Hold two pilot rounds on overlapping samples. Log only anonymized observations. (Dave, review bot logs)
- [ ] Fix the problems the pilots find. (Lesson bot)

### Phase 5: engineering and art closeout
- [ ] Bring PR #28 (UX-004) up to date with main, rerun build_answer_index.js and all suites, then get Dave's go-ahead. (Engineering)
- [ ] Decide whether to keep or close PR #2 (denomination guide). Reconcile or close the ORG-203 branch. (Dave, coordinator)
- [ ] Phone check of the 202-10 and 203-04 artwork (DAVE-006). Make the 203-06 art (ART-004) and the 203-09 story pair. (Dave, art bot)
- [ ] QA-001 full regression, PERF-001 images, A11Y-001, PRINT-001, cross-device handoff test. (Engineering)
- [ ] Church-use guide (CHURCH-001), then the release review of all 37 lessons (RELEASE-001). (Review bot, Dave)

## Bot lanes (one implementer per file set)

| Lane | Owns | Does not touch |
|---|---|---|
| Coordinator | TASKS.md, HANDOFF.md, this plan, merges after review | lesson prose |
| Lesson copy | assigned data/NNN-NN.json files, its log | index.html, scripts, shared widgets |
| Engineering | index.html, scripts/, shared widgets, tests | lesson prose; saved-answer IDs without a migration |
| Art | images/ for the assigned lessons | everything else |
| Review | reviews/ and logs/; read-only on lessons | direct edits |

Every packet works on its own branch, stops at REVIEW and writes a log. No real learner answers, no credentials, no em dashes.

## Waiting on Dave

| ID | Decision |
|---|---|
| DAVE-002 | 201-08 justification wording (unlocks the template) |
| Templates | Confirm the five template lessons |
| Theology calls | The ten items in the grades summary |
| Approvals | 32 unrecorded lessons, plus recording 203-08 and 203-10 |
| DAVE-003 | Pilot pairs |
| DAVE-006 | Artwork on the phone |
| PR #28, PR #2 | Merge or close |
