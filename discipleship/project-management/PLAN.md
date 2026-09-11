# Growing Together delivery plan

Started September 11, 2026. Planning horizon: twelve working weeks, September 14 through December 6, with December 7-11 as contingency. Dave approved the review's direction and the shared-agent workflow on September 11. This plan is an operating agreement, not a guarantee of calendar completion.

## The outcome

Deliver a dependable, phone-first discipleship curriculum that Dave can use for years and freely offer to other churches. Preserve the balance of story, Scripture, image, tool, reflection, and practice. Support laptop preparation and phone conversation from the same lesson and answers.

All 47 lessons remain in scope. Protect the quality of the 37 lessons in 101/201/202/203 first. At the end of week six, use observed review capacity to decide whether all ten 301 lessons can pass the same gates by December. A separate 301 release is a scope decision for Dave, not an excuse to quietly omit work.

## Where to look

| File | Owns |
|---|---|
| [TASKS.md](TASKS.md) | Single current task board, owners, dependencies, lesson readiness |
| [HANDOFF.md](HANDOFF.md) | Short resume note, immediate assignment, reusable prompts |
| [DAVE.md](DAVE.md) | Small pastoral decision queue and approval record |
| [logs/](logs/) | Per-task implementation and review evidence |
| [reviews/2026-09-11-baseline.md](reviews/2026-09-11-baseline.md) | Dated initial audit; read selectively |
| [../curriculum-toc.csv](../curriculum-toc.csv) | Lesson order, titles, tools, stories, browse metadata |

Do not duplicate full curriculum titles or reorder the curriculum in the task board. Do not put real prayer requests, learner answers, pilot names, credentials, or private church records in these GitHub files. Use anonymized pilot observations.

## Responsibilities and usage discipline

- **Dave:** one main burden per lesson, pastoral judgment, final theology/voice approval, pilot relationships, release decisions. Start with two short review blocks per week; increase only if useful.
- **Implementing agent:** one assigned software repair, lesson, image set, or widget. Any available capable agent with the needed access may do it. Claude or Grok drafts can also be supplied through chat and applied by the repository agent; do not assume a chat agent has Git access.
- **Daily reviewer:** inspect changes since the last reviewed commit, verify evidence, repair bounded defects, and maintain the next three priorities. Dave intends to use Astra here when available; another reviewer can follow the same checklist.

Spend the longest reasoning on architecture, data migration, theology, and integration. Use bounded assignments for routine edits and production. Do not ask every agent to audit all 47 lessons. Read HANDOFF, the assigned row, applicable standards, and the files being changed. Keep final worker updates to: outcome, files, checks, remaining issue, commit/branch.

No automatic agent switching or scheduled daily job is configured by this plan. Dave launches the saved worker or review prompt when ready. Keep the handoff current before changing tools/accounts or exhausting a work session.

## Task lifecycle

`TODO -> ACTIVE -> REVIEW -> DONE`. `BLOCKED` means an actual named dependency, missing access, or decision; record the unblock action. A task with unfinished prerequisites stays TODO and is not available to claim. Use `PAUSED` for an incomplete handoff that another agent can resume.

1. Coordinator chooses one task whose prerequisites are DONE. Worker records owner, branch, and date in its Owner cell and log.
2. Implement only the packet's scope. Add newly found work as a new stable task ID.
3. Run targeted checks; update the log with evidence and put the task in REVIEW.
4. Reviewer checks the actual diff and reruns relevant behavior checks. A broken test or incomplete acceptance criterion returns the task to ACTIVE/PAUSED, not DONE.
5. Software tasks become DONE after verification and integration to main. Lesson tasks additionally need Dave's approval and a recorded pilot result or explicit applicability decision for every gate.

Do not use percentage-complete guesses. Count verified tasks and approved lessons. Existing drafts begin with approval `unrecorded`, which means this board has not captured approval, not that Dave never reviewed them before.

## Lesson gates

Each lesson row has Draft, Editorial, Visual, Technical, Dave, and Pilot fields. Use `pending`, `pass`, or `n/a: reason + reviewer/date`; Dave's field starts `unrecorded` and becomes `approved YYYY-MM-DD` only from his actual review. If a substantial revision changes approved material, mark the affected gates pending again. Record the reviewed commit or content hash in the task log so approvals apply to a specific version.

- **Draft:** all intended teaching and reflection content exists. Existing substantive text can be marked `present`; this says nothing about topic fit or quality.
- **Editorial:** one big truth, accurate Scripture/translation labels, checked anecdotes, grace before command, distinct lesson scope, practical action, and ability to explain the tool. Preserve the 101 ending exception; the 200 series uses the standard closing trio. Record justified template exceptions.
- **Visual:** story and diagram reinforce the same truth; all assets load; artwork and controls are readable on phone and laptop; static/reduced-motion and print treatments are appropriate.
- **Technical:** schema and assets pass; input IDs are unique; answers survive reload and navigation; migrations preserve existing data; relevant widget states and exports behave correctly.
- **Dave:** approval of the exact theology and voice being released, with any denominational assumptions intentional.
- **Pilot:** an anonymized learner test records time, confusion, recall, usability, and a realistic next step. Use overlapping lesson samples; do not pretend anyone completed a 47-week journey in twelve weeks.

Course/release gates also require cross-device handoff, accessible controls, recovery from save failure, no unresolved data-loss defects, and a clear church-use guide. A task checkbox cannot substitute for these gates.

## Milestones

| Weeks | Deliverable | Exit evidence |
|---|---|---|
| 1-2: Sep 14-27 | Data protection and benchmark lessons | ENG-001 through ENG-004 checked; SEC-001 addressed or explicit blocker; 201-01/08 revisions reviewed; pilots recruited |
| 3-4: Sep 28-Oct 11 | Finish 202 writing and Read/Discuss prototype | 202-08/09 drafted and reviewed; 202-05/06/07 aligned; 201-08 prototype used in a conversation |
| 5-6: Oct 12-25 | Complete 200-series coverage | 203-06/09/10 written; 203-08 rebuilt; all 200 closings/metadata consistent; decide 301 release timing |
| 7-8: Oct 26-Nov 8 | Foundation refinement and first half of leadership | 101/201 editorial pass; 301-01 through 301-05 reviewed drafts; backup and device-handoff test |
| 9-10: Nov 9-22 | Remaining leadership and church pilots | 301-06 through 301-10 reviewed drafts; actual phone/laptop/print findings resolved |
| 11-12: Nov 23-Dec 6 | Release candidate | All chosen release lessons pass gates; migration/restore checks; reuse record and church guide; Dave release review |
| Contingency: Dec 7-11 | Remaining verified blockers | No quality gate waived solely to meet a date |

Writing and pilot work may overlap without multiple agents editing the same files. Update dates when actual throughput changes. Split large engineering rows into child tasks before starting them; prefer one reviewable commit or small PR per packet.

## GitHub workflow

Repository: `https://github.com/davepartin/ministrybag1`, project subfolder `discipleship/`. Main is the shared integrated state. The remote named `icloud` is not the GitHub sync target.

1. Inspect `git status --short`, current branch, and remote. Fetch `origin`. Never discard uncommitted work. On a clean main, use `git pull --ff-only origin main`.
2. For implementation, create a branch such as `codex/eng-001-answer-storage`; agents may use this common prefix regardless of model. Use a separate checkout/worktree if another worker is active. Claims from separate branches are not visible on main until integrated, so the coordinator must communicate assignments before dispatch.
3. Explicitly stage only assigned paths under `discipleship/`, plus their task log and relevant status changes. Include task IDs in commit messages. Inspect the staged diff for unrelated material and sensitive data.
4. Push the task branch to origin and open a PR when tooling is available. If PR tooling is unavailable, give the branch and commit and mark it awaiting integration. A branch push is backed up; it is not the same as main being updated.
5. The daily reviewer fetches, checks changes and conflicts, and integrates completed authorized work. Dave's approval is needed for final lesson wording/release, not repeated approval of ordinary repairs. Do not publish unapproved lesson revisions through a live main deployment; keep them in a review branch until approved or a verified draft/preview mechanism exists.
6. Push main normally and verify the remote commit. No force pushes. GitHub synchronization does not prove a website deployment succeeded. Log branch, commit, merge/sync status and any deployment evidence separately.

Planning/log-only updates may be committed directly to a clean, up-to-date main by the sole coordinator, as Dave requested repository synchronization. Do not impose that exception on implementation workers.

## Daily review checklist

- Read HANDOFF and REVIEW/ACTIVE/BLOCKED rows; inspect logs since the last checkpoint.
- Fetch origin and inspect the diff from the last reviewed commit. Include pending PR branches explicitly; main alone does not show unmerged work.
- Check scope, task ownership, data preservation, theology-sensitive edits, and source/TOC consistency.
- Run only relevant checks. Existing baseline command is `bash scripts/qa_foundation.sh` from `discipleship/`; it is not proof of visual quality or complete coverage.
- For UI changes, inspect affected states at 375/390 pixels and a laptop width, plus keyboard/text zoom/reduced motion where relevant. Record what was and was not tested.
- Fix small defects within approved scope. Turn substantial new issues into separate tasks. Do not fold an unsolicited redesign into review.
- Mark verified work DONE only after its gates; leave theological review with Dave. Update HANDOFF with the reviewed commit and next three priorities.
- Report to Dave: completed, corrections, decisions needed (ideally no more than two), and the next assignment. Do not contact pilot participants on Dave's behalf unless he explicitly asks.

## Task log template

Create `logs/YYYY-MM-DD-TASK-ID-agent.md`. One worker edits its own log; the coordinator owns shared-board integration during concurrent work.

```markdown
# TASK-ID: short outcome
Date:
Agent / reviewer:
Status:
Branch:
Base commit:
Scope / files reserved:

## Changes and decisions

## Verification
Exact command or browser action, result, and evidence path.
Checks not run and why:
Known baseline failures distinguished from new regressions:

## Handoff
Changed files:
Remaining work / next command:
Blocker and unblock action, if any:
Commit / PR / GitHub sync state:
Pastoral approval evidence, if applicable:
```

Use `git log -- <log-path>` to identify the commit containing a log; a commit cannot include its own hash. For mid-task stops, preserve work on its branch and mark PAUSED. Never call an untested partial patch complete.
