# Resume here

Updated September 11, 2026 after daily review REV-001. The board is [TASKS.md](TASKS.md); workflow is [PLAN.md](PLAN.md).

## Current position

- ENG-001 and ENG-003 are **DONE**. PRs #10 and #12 were independently reviewed; two missed edge cases were repaired in PR #13, merged as `915ba568`.
- REV-001 preserved malformed/unreadable saved data through startup and later saves, and fixed real iframe shrink behavior. Evidence and exact checks: [review log](logs/2026-09-11-REV-001-codex.md).
- ENG-002 / PR #11 is on main with passing asset checks. Status remains **REVIEW** for Dave's artwork and actual phone assessment.
- **ENG-004 is now on origin/main via PR #14 at c04efb7, awaiting independent review.** This was observed during manuscript review, not tested here. Next: review ENG-004, then ENG-005 and SEC-001.
- Dave is working with Claude on 202-08/09 now. Supply/review pastoral direction there and review the ENG-002 artwork. These do not block ENG-004.
- Login/provider remains undecided. Do not implement the old Supabase proposal automatically.

## Active worker split, reported by Dave

- Claude has produced **L-202-08 and L-202-09 manuscripts in the Obsidian NC vault**. Both were read by Codex; the app JSON remains empty/stub. See [manuscript review](reviews/2026-09-11-202-08-09-drafts.md) for the next revision/integration packet. Reserve `data/202-08.json`, `data/202-09.json` and their dedicated new assets for Claude. Manuscript locations and prose were verified; a Git implementation branch has not been identified. Draft/approval gates remain unchanged until evidence exists.
- Grokbot works on a **different computer using GitHub** for the engineering queue. ENG-004 was delivered on `cursor/eng-004-export-preview-42be` and merged via PR #14; independent review is pending. Keep lesson prose/IDs out of that packet.
- Workers should read AGENTS.md and use separate task branches. Claude must preserve the repaired 202-09 IDs. Shared `index.html`, scripts and shared widgets belong to engineering unless the coordinator explicitly reallocates them. Put a needed shared-code change in a task note rather than editing it concurrently.
- Coordinator owns TASKS/HANDOFF integration while both workers run. Each worker records evidence in its own task log; avoid competing edits to the shared board.
- GitHub carries committed and pushed changes only. Local edits are not automatically visible on the other computer. Push review branches, then integrate; do not merge unapproved lesson drafts to a publishing main branch.
- Do not pull into, switch branches in, reset, or clean Claude's active checkout while it is working. Review remote changes in a separate worktree. After Claude checkpoints its work, reconcile with current main without discarding its changes.
- Dave remains the final theology/art reviewer. Drafting underway does not establish that his DAVE-001 briefs or lesson approvals are complete.

## Remaining risks

- ENG-004 implements export scope/preview in PR #14; its acceptance checks still need independent review.
- Save-failure feedback is still missing. After a malformed or unavailable load, REV-001 deliberately blocks response writes for the session to preserve the original copy. New edits remain only in memory. ENG-005 must explain this visibly and provide recovery; never remove the guard to make saving appear successful.
- Historical ambiguous answers remain in recovery metadata. ENG-006 must provide usable recovery/backup access without assigning them automatically to a lesson.
- Credential remains in source/docs. Never reproduce its value; SEC-001 is a release blocker.
- 202-08/09 and 203-06/08/09/10 still need substantial writing; 301 placeholders and lesson approval gates remain on the board.
- Real iPhone/Safari, cross-device sync and production deployment were not verified in this review.

## Last review checkpoint

Verified integrated code commit: `915ba568a50ff8944ae36e95c5321df667d5efaa` (PR #13, REV-001). This includes reviewed PRs #10, #11 and #12. Planning-only commits after this checkpoint do not represent unchecked software. No discipleship worker PR remained open at review completion. Check GitHub again before the next review.

## ENG-004 review criteria (implementation now merged)

Read the task row, the export controls and `exportAllResponses()` in `index.html`, session rendering/IDs, and answer-storage helpers. Use the actual selected lesson's fields; copied historical JSON IDs make prefix guessing unsafe.

- Current lesson is the default. Course-wide export requires an explicit scope selection.
- Show a readable preview with selected lesson/course title and the exact outgoing text before opening the mail draft. Allow cancel without opening mail.
- Verify another lesson's synthetic prayer, course commitment and internal migration/recovery metadata stay out of a lesson-only export unless explicitly selected and shown. Do not silently attach extra data.
- Test switching lessons/courses, empty responses, multiline text, quotes, ampersands, Unicode and mailto encoding. Keep a copy-text option for content too long for a mail draft if needed; do not claim a universal mailto size limit.
- No automatic send, login implementation, answer-key changes or lesson prose edits. Preserve REV-001's storage guard.
- Scope: export UI/helpers, targeted tests and task records. Review phone/laptop preview and keyboard/cancel behavior. Push a small PR and stop at REVIEW.

## Earlier ENG-004 assignment (do not start a duplicate)

> Start ENG-004 in Growing Together, the discipleship folder of davepartin/ministrybag1. The coordinator has cleared the hold after REV-001. Read AGENTS.md, project-management/HANDOFF.md and your TASKS.md row; fetch origin and start from current main, which includes PR #13. Claim ENG-004 on a dedicated branch. Implement only current-lesson export by default, explicit optional course scope, and a visible preview before opening a mail draft. Use synthetic answers to prove other lessons' prayers do not leak into lesson scope, and test encoding/cancel/phone layout. Preserve the saved-data guard. Update your log and board to REVIEW, push and provide the PR and evidence. Keep ENG-005, login and lesson content out of this packet.

For agents without repository access, request a complete patch and have the repository worker apply and verify it. A chat reply is not a GitHub commit.

## Prompt for the daily reviewer

> Review Growing Together since the checkpoint in project-management/HANDOFF.md. Read AGENTS.md, fetch origin, inspect TASKS.md and recent task logs, and examine integrated changes and pending worker branches. Verify claims against actual diffs and targeted behavior tests. Fix bounded defects in the authorized scope; log larger findings. Preserve learner data and Dave's theology and voice. Integrate eligible reviewed work, update the board/log/checkpoint, sync to GitHub, and report completed work, corrections, the next three priorities and at most two decisions for Dave. Keep unapproved lesson revisions in review. Do not repeat the entire baseline audit.

## Before a handoff

Record task ID, owner, branch, commit or uncommitted files, checks, unresolved issue and exact next action. Push a safe checkpoint branch when possible. Never mark partial work DONE because usage is ending. Agents resume from these files and Git history; they may not see the conversation.
