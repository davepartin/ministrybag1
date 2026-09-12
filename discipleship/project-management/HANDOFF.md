# Resume here

Updated September 12, 2026 after daily review REV-003. The board is [TASKS.md](TASKS.md); workflow is [PLAN.md](PLAN.md).

## Current position

- ENG-001 and ENG-003 are **DONE**. PRs #10 and #12 were independently reviewed; two missed edge cases were repaired in PR #13, merged as `915ba568`.
- REV-001 preserved malformed/unreadable saved data through startup and later saves, and fixed real iframe shrink behavior. Evidence and exact checks: [review log](logs/2026-09-11-REV-001-codex.md).
- ENG-002 / PR #11 is on main with passing asset checks. Status remains **REVIEW** for Dave's artwork and actual phone assessment.
- **ENG-005 is DONE. ENG-006a is cleared to start now.** REV-003 verified PR #16 and repaired unresolved-error visibility and clipboard feedback in PR #18, merged as `e4e06cf`. Evidence: [REV-003](logs/2026-09-12-REV-003-codex.md). ENG-006 is split into backup download, restore preview, then restore. Start only ENG-006a; leave it at REVIEW before proceeding.
- Dave is working with Claude on 202-08/09 now. Supply/review pastoral direction there and review the ENG-002 artwork. These do not block ENG-006a.
- EDIT-001 is complete: [201-08 benchmark proposal](reviews/201-08-benchmark-proposal.md) contains wording, source corrections and a short learner test. It is documentation only; L-201-08 approval and implementation remain pending.
- Login/provider remains undecided. Do not implement the old Supabase proposal automatically.

## Active worker split, reported by Dave

- Claude has produced **L-202-08 and L-202-09 manuscripts in the Obsidian NC vault**. Both were read by Codex; the app JSON remains empty/stub. See [manuscript review](reviews/2026-09-11-202-08-09-drafts.md) for the next revision/integration packet. Reserve `data/202-08.json`, `data/202-09.json` and their dedicated new assets for Claude. Claude has now submitted PR #17 on `claude/l-202-08-09-marriage-purity`. Its implementation/content diff was not reviewed during REV-003; it must remain unmerged pending lesson review. Draft/approval gates remain unchanged until evidence exists.
- Grokbot works on a **different computer using GitHub** for the engineering queue. ENG-005 is reviewed and complete. The coordinator has lifted the hold for ENG-006a only. Keep lesson prose/IDs out of the software packet.
- Workers should read AGENTS.md and use separate task branches. Claude must preserve the repaired 202-09 IDs. Shared `index.html`, scripts and shared widgets belong to engineering unless the coordinator explicitly reallocates them. Put a needed shared-code change in a task note rather than editing it concurrently.
- Coordinator owns TASKS/HANDOFF integration while both workers run. Each worker records evidence in its own task log; avoid competing edits to the shared board.
- GitHub carries committed and pushed changes only. Local edits are not automatically visible on the other computer. Push review branches, then integrate; do not merge unapproved lesson drafts to a publishing main branch.
- Do not pull into, switch branches in, reset, or clean Claude's active checkout while it is working. Review remote changes in a separate worktree. After Claude checkpoints its work, reconcile with current main without discarding its changes.
- Dave remains the final theology/art reviewer. Drafting underway does not establish that his DAVE-001 briefs or lesson approvals are complete.

## Remaining risks

- Failed-load guards and recovery controls are now present. Unresolved errors stay visible across unrelated successful saves. Guarded edits still remain in memory until recovery; never remove the guard just to make saving appear successful. ENG-006 will add versioned backup and validated restore.
- Historical ambiguous answers remain in recovery metadata. ENG-006 must provide usable recovery/backup access without assigning them automatically to a lesson.
- Credential remains in source/docs. Never reproduce its value; SEC-001 is a release blocker.
- 202-08/09 and 203-06/08/09/10 still need substantial writing; 301 placeholders and lesson approval gates remain on the board.
- Real iPhone/Safari, cross-device sync and production deployment were not verified in this review.

## Last review checkpoint

Verified integrated code commit: `e4e06cf34be900e18e19961d78c1332f03f4bc23` (PR #18, REV-003), including ENG-005 / PR #16 and earlier reviews. Pending lesson PR #17 has NOT been reviewed or approved. Planning-only commits after this checkpoint are not unchecked software. Inspect origin and pending PRs again at the next review.

## Next coding packet: ENG-006a, versioned backup download

The hold is lifted for this child packet. Start from current origin/main, including PR #18. Read AGENTS.md, the ENG-006/006a rows, scripts/answer-storage.js, scripts/save-feedback.js and the current in-memory store/recovery paths. Claude owns 202-08/09 and their dedicated assets; coordinate any shared file needs.

- Define and document a versioned JSON backup envelope for answers, completion and reading data, preserving stable IDs and retained ambiguous-answer metadata. Include explicit per-store load/state information so unknown data is not represented as a complete empty backup.
- Export current in-memory edits, including unsaved edits, with clear scope/counts. When original storage was unreadable, identify the backup as partial and retain access to the original recovery copy. Never silently replace or discard it.
- Offer a user-triggered local download from normal use as well as error recovery. Do not upload data, open email, choose accounts or implement any restore writes.
- Validate the actual downloaded file in tests, not a debug marker. Test all three stores, checklists, commitments, completion/reading flags, multiline and Unicode answers, empty valid data, retained ambiguity metadata and failed-load/unsaved states. Use synthetic data only and keep download contents out of Git/logs.
- Verify phone/laptop controls and keyboard use. Preserve ENG-005 failures/selector, export scope and the failed-load guard. Full import validation/preview is ENG-006b; confirmed writes and round trips are ENG-006c.
- Push a small PR and stop at REVIEW. Parent ENG-006 stays incomplete until all child and original restore gates pass. The coordinator owns shared board/handoff integration while workers run.

## Prompt for Grokbot

> Start ENG-006a only. The coordinator reviewed ENG-005 and merged corrective PR #18. Fetch current main and use a dedicated branch. Read AGENTS.md, project-management/HANDOFF.md and the ENG-006/006a task rows. Build a versioned local backup download for all three stores, with honest partial/unsaved status and real downloaded-file tests. Preserve existing data and recovery guards. No restore writes, login or Claude lesson edits. Push a PR with evidence and stop at REVIEW before merging or starting ENG-006b.

## Prompt for the daily reviewer

> Review Growing Together since the checkpoint in project-management/HANDOFF.md. Read AGENTS.md, fetch origin, inspect TASKS.md and recent task logs, and examine integrated changes and pending worker branches. Verify claims against actual diffs and targeted behavior tests. Fix bounded defects in the authorized scope; log larger findings. Preserve learner data and Dave's theology and voice. Integrate eligible reviewed work, update the board/log/checkpoint, sync to GitHub, and report completed work, corrections, the next three priorities and at most two decisions for Dave. Keep unapproved lesson revisions in review. Do not repeat the entire baseline audit.

## Before a handoff

Record task ID, owner, branch, commit or uncommitted files, checks, unresolved issue and exact next action. Push a safe checkpoint branch when possible. Never mark partial work DONE because usage is ending. Agents resume from these files and Git history; they may not see the conversation.
