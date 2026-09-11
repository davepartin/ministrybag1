# Growing Together: agent entry point

This folder is one project inside the ministrybag1 repository. Work only inside `discipleship/` unless Dave explicitly expands the assignment.

## Start small

1. Read [HANDOFF.md](project-management/HANDOFF.md) for the current task and next action.
2. Read [TASKS.md](project-management/TASKS.md), then claim one available task by recording your agent name, branch, and date before editing. A claim is coordination, not a distributed lock; the coordinator serializes assignments across separate checkouts.
3. On first entry, read [PLAN.md](project-management/PLAN.md) for the workflow. Follow the applicable reading route in [AI-START-HERE.md](AI-START-HERE.md).
4. Inspect current files and Git state. Historical reports are evidence from their date, not current truth. Read only the relevant report section when needed.

## Work and handoff

- Default to one implementing agent at a time. For concurrent work, use separate branches/worktrees and coordinator-assigned, non-overlapping files. Never let two agents edit the same checkout concurrently.
- Do not spawn extra agents just to fill available slots. Dave is conserving usage; use his chosen available agent for each bounded assignment.
- Keep scope small. Record newly discovered work in the board instead of expanding the assignment silently.
- Preserve saved answers and stable IDs. Any identity change needs a migration and regression evidence.
- Do not print, copy, or commit credentials or real learner answers. Use synthetic data for checks. The existing exposed-token issue is tracked as SEC-001.
- Run checks appropriate to changed behavior. Record exact commands, results, and limitations in a task log.
- Before stopping, update your task, create/update `project-management/logs/YYYY-MM-DD-TASK-ID-agent.md`, and update HANDOFF if you are the sole worker/coordinator. Never claim checks you could not run.
- Stop a work packet at REVIEW after implementation and checks. DONE requires the review gates in PLAN.md; lesson approval always belongs to Dave. His acceptance of a plan authorizes drafting and repairs, not a claim that he reviewed unseen lesson text.
- Routine fixes already authorized by the plan do not need repeated permission. Surface actual decisions briefly and continue independent authorized work.
- Use normal Git commits and pushes. Never force-push, overwrite another agent's changes, or stage unrelated projects. Follow PLAN.md for worker branches and integration.

## Stable direction

The Compass governs theology/editorial direction; the template governs lesson structure; the technical brief governs architecture; the TOC owns lesson order and browse metadata. The board owns work status. The handoff owns only the immediate next action.

No em dashes in project files. No bullets in lesson prose. Keep the voice warm, clear, biblical, and grace-first. Preserve the intentional 101 closing-question exception.
