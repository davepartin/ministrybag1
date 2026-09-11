# Resume here

Updated September 11, 2026. Keep this file short. The detailed board is [TASKS.md](TASKS.md); the workflow is [PLAN.md](PLAN.md).

## Current position

- Planning packet PM-001 complete. Initial audit is archived in `reviews/2026-09-11-baseline.md` for selective reference.
- App/content baseline examined: `fce80bc` on main. No app, lesson, image or widget repairs have been implemented by this planning packet.
- Next worker: **ENG-001, saved-answer collisions**, fully scoped at the bottom of the software board. No owner assigned yet.
- Next after that: ENG-002 missing images; ENG-003 iframe initialization. ENG-004 export follows. SEC-001 must be addressed before broader release.
- Dave's next action: DAVE-001, the two short pastoral briefs in [DAVE.md](DAVE.md). It does not block ENG-001.
- Login/provider remains undecided. Do not implement the old Supabase proposal automatically.

## Known baseline failures

- Six shared runtime question IDs: 202-05 with 202-09; 203-06 with 203-07. Three closing answers in each pair can overwrite one another.
- Four missing image files in 202-10 and 203-04.
- Iframe MutationObserver exceptions observed during browser review.
- Email Lesson exports a course; storage writes have no failure feedback.
- 203-06 has mismatched title/topic; 203-08 contains older Belonging content.
- Credential present in source/docs; never reproduce its value in a log or prompt.
- Foundation QA passes despite these issues. Passing it alone does not clear them.

## Last review checkpoint

Initial app/content review checkpoint: `fce80bc`. Planning-only changes are recorded by `git log -- discipleship/project-management/logs/2026-09-11-PM-001-codex.md` from repository root. The daily reviewer should replace this checkpoint with the exact last verified code/content commit after the next review. Record reviewed branches separately so unmerged work is not overlooked.

## Prompt for a coding agent

> Work on Growing Together in the discipleship folder of davepartin/ministrybag1. Read AGENTS.md and project-management/HANDOFF.md, then claim ENG-001 in TASKS.md. Complete only its scoped repair and regression checks, preserving existing saved answers and documenting ambiguous old values. Use a dedicated branch. Update your task log and status to REVIEW, push the branch to origin, and give the commit/PR, checks, and next action. Do not implement login or unrelated lesson edits. If you lack repository or browser access, say exactly what cannot be verified instead of marking it complete.

For later tasks, replace ENG-001 with the next coordinator-assigned task ID. For agents without filesystem access, provide the task row and its required files, request complete replacement files or a patch, and have the repository agent apply and verify them. A chat reply is not a GitHub commit.

## Prompt for the daily reviewer

> Review Growing Together since the checkpoint in project-management/HANDOFF.md. Read AGENTS.md, fetch origin, inspect TASKS.md and recent task logs, and examine both integrated changes and pending worker branches. Verify completed claims against the actual diffs and targeted tests. Fix bounded defects in the authorized scope; log larger findings as tasks. Preserve learner data and Dave's approved theology/voice. Integrate eligible reviewed work, update the board/log/checkpoint, sync to GitHub, and report completed work, corrections, the next three priorities, and at most two decisions for Dave. Keep unapproved lesson revisions in review. Do not repeat the whole baseline audit.

## Before a handoff

Record task ID, owner, branch, commit or uncommitted files, checks run, unresolved issue, and the exact next action. Push a safe checkpoint branch when possible. Never mark a partial task DONE because a usage window is ending. Another agent resumes from files and Git history; do not assume it can see the previous conversation.
