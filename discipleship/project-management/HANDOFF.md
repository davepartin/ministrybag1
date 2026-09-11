# Resume here

Updated September 11, 2026. Keep this file short. The detailed board is [TASKS.md](TASKS.md); the workflow is [PLAN.md](PLAN.md).

## Current position

- Planning packet PM-001 complete. Initial audit is archived in `reviews/2026-09-11-baseline.md` for selective reference.
- ENG-001 is **DONE** on main (merge commit `dc14f625`, PR #10).
- ENG-002 is in **REVIEW** on `cursor/eng-002-missing-images-52ec`. Evidence: logs/2026-09-11-ENG-002-discipleshipbot.md.
- Next worker after review/integration: **ENG-003, iframe initialization**. Then ENG-004 export. SEC-001 must be addressed before broader release.
- Dave's next action: DAVE-001, the two short pastoral briefs in [DAVE.md](DAVE.md), plus the ENG-002 artwork and phone-display lock below. It does not block ENG-003.
- Login/provider remains undecided. Do not implement the old Supabase proposal automatically.

## Known baseline failures

- Saved-answer collisions: repaired and merged in ENG-001.
- Last Supper and foot-washing teaching pairs are now on this ENG-002 branch. They were created in the Growing Together charcoal style because no originals existed in git history or elsewhere in ministrybag1. Dave must approve the artwork and confirm phone display before ENG-002 can be DONE.
- Iframe MutationObserver exceptions observed during browser review.
- Email Lesson exports a course; storage writes have no failure feedback.
- 203-06 has mismatched title/topic; 203-08 contains older Belonging content.
- Credential present in source/docs; never reproduce its value in a log or prompt.
- Foundation QA now includes read-only asset checks. Passing those checks does not clear Dave's art review.

## Last review checkpoint

Initial app/content review checkpoint: `fce80bc`. ENG-001 integrated as `dc14f625`. The daily reviewer should replace this checkpoint with the exact last verified code/content commit after the next review. Record reviewed branches separately so unmerged work is not overlooked.

## Prompt for a coding agent

> Work on Growing Together in the discipleship folder of davepartin/ministrybag1. Read AGENTS.md and project-management/HANDOFF.md, then claim ENG-001 in TASKS.md. Complete only its scoped repair and regression checks, preserving existing saved answers and documenting ambiguous old values. Use a dedicated branch. Update your task log and status to REVIEW, push the branch to origin, and give the commit/PR, checks, and next action. Do not implement login or unrelated lesson edits. If you lack repository or browser access, say exactly what cannot be verified instead of marking it complete.

For later tasks, replace ENG-001 with the next coordinator-assigned task ID. For agents without filesystem access, provide the task row and its required files, request complete replacement files or a patch, and have the repository agent apply and verify them. A chat reply is not a GitHub commit.

## Prompt for the daily reviewer

> Review Growing Together since the checkpoint in project-management/HANDOFF.md. Read AGENTS.md, fetch origin, inspect TASKS.md and recent task logs, and examine both integrated changes and pending worker branches. Verify completed claims against the actual diffs and targeted tests. Fix bounded defects in the authorized scope; log larger findings as tasks. Preserve learner data and Dave's approved theology and voice. Integrate eligible reviewed work, update the board/log/checkpoint, sync to GitHub, and report completed work, corrections, the next three priorities, and at most two decisions for Dave. Keep unapproved lesson revisions in review. Do not repeat the whole baseline audit.

## Before a handoff

Record task ID, owner, branch, commit or uncommitted files, checks run, unresolved issue, and the exact next action. Push a safe checkpoint branch when possible. Never mark a partial task DONE because a usage window is ending. Another agent resumes from files and Git history; do not assume it can see the previous conversation.
