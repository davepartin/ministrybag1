# Resume here

Updated September 11, 2026 after daily review REV-002. The board is [TASKS.md](TASKS.md); workflow is [PLAN.md](PLAN.md).

## Current position

- ENG-001 and ENG-003 are **DONE**. PRs #10 and #12 were independently reviewed; two missed edge cases were repaired in PR #13, merged as `915ba568`.
- REV-001 preserved malformed/unreadable saved data through startup and later saves, and fixed real iframe shrink behavior. Evidence and exact checks: [review log](logs/2026-09-11-REV-001-codex.md).
- ENG-002 / PR #11 is on main with passing asset checks. Status remains **REVIEW** for Dave's artwork and actual phone assessment.
- **ENG-004 is DONE. ENG-005 is cleared to start now.** REV-002 independently verified export scope/preview and repaired a keyboard focus defect in PR #15, merged as `86f0439`. Evidence: [REV-002](logs/2026-09-11-REV-002-codex.md). ENG-005 remains unclaimed until Grokbot starts a branch. SEC-001 remains a release priority; ENG-006 follows save feedback.
- Dave is working with Claude on 202-08/09 now. Supply/review pastoral direction there and review the ENG-002 artwork. These do not block ENG-005.
- Login/provider remains undecided. Do not implement the old Supabase proposal automatically.

## Active worker split, reported by Dave

- Claude has produced **L-202-08 and L-202-09 manuscripts in the Obsidian NC vault**. Both were read by Codex; the app JSON remains empty/stub. See [manuscript review](reviews/2026-09-11-202-08-09-drafts.md) for the next revision/integration packet. Reserve `data/202-08.json`, `data/202-09.json` and their dedicated new assets for Claude. Manuscript locations and prose were verified; a Git implementation branch has not been identified. Draft/approval gates remain unchanged until evidence exists.
- Grokbot works on a **different computer using GitHub** for the engineering queue. ENG-004 is reviewed and complete. The coordinator has lifted the ENG-005 hold. Keep lesson prose/IDs out of the software packet.
- Workers should read AGENTS.md and use separate task branches. Claude must preserve the repaired 202-09 IDs. Shared `index.html`, scripts and shared widgets belong to engineering unless the coordinator explicitly reallocates them. Put a needed shared-code change in a task note rather than editing it concurrently.
- Coordinator owns TASKS/HANDOFF integration while both workers run. Each worker records evidence in its own task log; avoid competing edits to the shared board.
- GitHub carries committed and pushed changes only. Local edits are not automatically visible on the other computer. Push review branches, then integrate; do not merge unapproved lesson drafts to a publishing main branch.
- Do not pull into, switch branches in, reset, or clean Claude's active checkout while it is working. Review remote changes in a separate worktree. After Claude checkpoints its work, reconcile with current main without discarding its changes.
- Dave remains the final theology/art reviewer. Drafting underway does not establish that his DAVE-001 briefs or lesson approvals are complete.

## Remaining risks

- Save-failure feedback is still missing. After a malformed or unavailable load, REV-001 deliberately blocks response writes for the session to preserve the original copy. New edits remain only in memory. ENG-005 must explain this visibly and provide recovery; never remove the guard to make saving appear successful.
- Historical ambiguous answers remain in recovery metadata. ENG-006 must provide usable recovery/backup access without assigning them automatically to a lesson.
- Credential remains in source/docs. Never reproduce its value; SEC-001 is a release blocker.
- 202-08/09 and 203-06/08/09/10 still need substantial writing; 301 placeholders and lesson approval gates remain on the board.
- Real iPhone/Safari, cross-device sync and production deployment were not verified in this review.

## Last review checkpoint

Verified integrated code commit: `86f04391893c4894bdad6df313d4f25a7fb1f87f` (PR #15, REV-002). Includes reviewed ENG-004 / PR #14 and earlier ENG-001/003 corrections. Planning-only commits after this checkpoint are not unchecked software. Reinspect origin and pending PRs at the next review.

## Next coding packet: ENG-005

The hold is lifted. Start from current origin/main, including PR #15. Read the task row, the response load/save paths in index.html, scripts/answer-storage.js, and the REV-001/002 logs. Reserve shared app/storage code for this packet; Claude owns the two lesson drafts and dedicated assets.

- Show truthful Saving/Saved/Could not save feedback without interrupting typing. Saved must follow a successful write, not just an input event or timer.
- Keep edited answers in memory on quota, blocked getter or write failures. Provide a visible retry/copy or download path where appropriate; explain when edits have not been stored and could be lost on reload.
- Preserve the REV-001 failed-load guard. Do not overwrite malformed/unreadable original storage. Recovery must retain that copy and must not silently discard existing or new answers.
- Exercise questions, checklists and commitments. Identify completion/reading-note save paths before choosing the status label: either cover them with equivalent evidence or record a scoped child task and label feedback narrowly. Never claim all work is saved when some paths are uncovered.
- Verify valid reload/navigation, quota failure then safe retry, blocked storage, malformed/non-object loads, failed reads followed by later writes and retention of in-memory edits. Use synthetic fixtures only. Rerun storage and export regression checks and phone/laptop/keyboard status checks.
- Keep full versioned backup/import in ENG-006. No login/provider decisions, lesson edits or broad refactor. If a required recovery change is larger, record its child scope before expanding.
- Push a small PR and stop at REVIEW. Do not merge until the coordinator verifies it. The coordinator handles shared board integration while Claude is also working; include your claim and completion evidence in your task log.

## Prompt for Grokbot

> Start ENG-005. The coordinator reviewed ENG-004 and lifted the hold after PR #15. Fetch origin and branch from current main. Read AGENTS.md, project-management/HANDOFF.md and the ENG-005 task row. Implement truthful save feedback and safe recovery while preserving the failed-load guard and existing answers. Use synthetic failure/retry tests and verify phone/laptop behavior. Keep Claude's lessons, login and full backup/import out of scope. Push a PR, leave the task at REVIEW, and provide the commit and checks. Do not merge before independent review.

## Prompt for the daily reviewer

> Review Growing Together since the checkpoint in project-management/HANDOFF.md. Read AGENTS.md, fetch origin, inspect TASKS.md and recent task logs, and examine integrated changes and pending worker branches. Verify claims against actual diffs and targeted behavior tests. Fix bounded defects in the authorized scope; log larger findings. Preserve learner data and Dave's theology and voice. Integrate eligible reviewed work, update the board/log/checkpoint, sync to GitHub, and report completed work, corrections, the next three priorities and at most two decisions for Dave. Keep unapproved lesson revisions in review. Do not repeat the entire baseline audit.

## Before a handoff

Record task ID, owner, branch, commit or uncommitted files, checks, unresolved issue and exact next action. Push a safe checkpoint branch when possible. Never mark partial work DONE because usage is ending. Agents resume from these files and Git history; they may not see the conversation.
