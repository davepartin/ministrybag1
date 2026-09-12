# Resume here

Updated September 12, 2026 after daily review REV-004. The board is [TASKS.md](TASKS.md); workflow is [PLAN.md](PLAN.md).

## Current position

- ENG-001 and ENG-003 are **DONE**. PRs #10 and #12 were independently reviewed; two missed edge cases were repaired in PR #13, merged as `915ba568`.
- REV-001 preserved malformed/unreadable saved data through startup and later saves, and fixed real iframe shrink behavior. Evidence and exact checks: [review log](logs/2026-09-11-REV-001-codex.md).
- ENG-002 / PR #11 is on main with passing asset checks. Status remains **REVIEW** for Dave's artwork and actual phone assessment.
- **ENG-005 and ENG-006a are DONE. ENG-006b is cleared to start now.** REV-004 independently reviewed PR #19, corrected misleading partial-backup wording, and verified actual downloaded files. Merged as `caab24d6`. Evidence: [REV-004](logs/2026-09-12-REV-004-codex.md). ENG-006b is validation and preview only. ENG-006c and parent ENG-006 remain incomplete.
- Dave is working with Claude on 202-08/09 now. Supply/review pastoral direction there and review the ENG-002 artwork. These do not block ENG-006b.
- EDIT-001 is complete: [201-08 benchmark proposal](reviews/201-08-benchmark-proposal.md) contains wording, source corrections and a short learner test. It is documentation only; L-201-08 approval and implementation remain pending.
- Login/provider remains undecided. Do not implement the old Supabase proposal automatically.

## Active worker split, reported by Dave

- Claude has produced **L-202-08 and L-202-09 manuscripts in the Obsidian NC vault**. Both were read by Codex; the app JSON remains empty/stub. See [manuscript review](reviews/2026-09-11-202-08-09-drafts.md) for the next revision/integration packet. Reserve `data/202-08.json`, `data/202-09.json` and their dedicated new assets for Claude. Claude has now submitted PR #17 on `claude/l-202-08-09-marriage-purity`. Its implementation/content diff was not reviewed during REV-003; it must remain unmerged pending lesson review. Draft/approval gates remain unchanged until evidence exists.
- Grokbot works on a **different computer using GitHub** for the engineering queue. ENG-006a is reviewed and complete. The coordinator has lifted the hold for ENG-006b only. Keep lesson prose/IDs out of the software packet.
- Workers should read AGENTS.md and use separate task branches. Claude must preserve the repaired 202-09 IDs. Shared `index.html`, scripts and shared widgets belong to engineering unless the coordinator explicitly reallocates them. Put a needed shared-code change in a task note rather than editing it concurrently.
- Coordinator owns TASKS/HANDOFF integration while both workers run. Each worker records evidence in its own task log; avoid competing edits to the shared board.
- GitHub carries committed and pushed changes only. Local edits are not automatically visible on the other computer. Push review branches, then integrate; do not merge unapproved lesson drafts to a publishing main branch.
- Do not pull into, switch branches in, reset, or clean Claude's active checkout while it is working. Review remote changes in a separate worktree. After Claude checkpoints its work, reconcile with current main without discarding its changes.
- Dave remains the final theology/art reviewer. Drafting underway does not establish that his DAVE-001 briefs or lesson approvals are complete.

## Remaining risks

- Failed-load guards and recovery controls are now present. Unresolved errors stay visible across unrelated successful saves. Guarded edits still remain in memory until recovery; never remove the guard just to make saving appear successful. ENG-006a now provides a versioned backup download; validated preview and restore remain to be built.
- Historical ambiguous answers remain in recovery metadata. ENG-006 must provide usable recovery/backup access without assigning them automatically to a lesson.
- Credential remains in source/docs. Never reproduce its value; SEC-001 is a release blocker.
- 202-08/09 and 203-06/08/09/10 still need substantial writing; 301 placeholders and lesson approval gates remain on the board.
- Real iPhone/Safari, cross-device sync and production deployment were not verified in this review.

## Last review checkpoint

Verified integrated code commit: `caab24d6a2602df02adb533bcab578d0aa17fe48` (PR #19, ENG-006a and REV-004), including the corrected partial-backup message. Backup unit tests: 53; actual-file browser assertions: 60; recovery browser assertions: 20; export browser assertions: 46; foundation QA passed. Pending lesson PR #17 has NOT been reviewed or approved. Planning-only commits after this checkpoint are not unchecked software. Inspect origin and pending PRs again at the next review.

## Next coding packet: ENG-006b, validation and read-only restore preview

The hold is lifted for this child packet only. Fetch current origin/main, including PR #19 and its coordinator correction. Use a new dedicated branch. Read AGENTS.md, the ENG-006/006b rows, `scripts/backup-format.md`, `scripts/backup-download.js`, and current storage/recovery paths. Claude owns 202-08/09 and their dedicated assets.

- Add user-selected local JSON file validation and preview for the version 1 backup contract. Document and enforce a reasonable size limit before reading/parsing; reject malformed JSON, unsupported kind/version and invalid structures or value types with a useful message. Distinguish older recovery snapshots instead of pretending they are versioned backups.
- Treat imported content as untrusted. Display strings as text, never executable markup. Reject dangerous object keys/prototype paths. Do not trust claimed counts, complete flags or duplicated ambiguity metadata: derive/check them against validated data and surface inconsistencies. Preserve multiline/Unicode answers, stable IDs and valid false/empty values.
- Preview all three stores with counts, existing-value conflicts, partial/unsaved status, unknown keys and clear proposed selection semantics. Define handling of unknown keys explicitly; do not silently lose historical data or infer lesson attribution. Show retained ambiguous answers and candidate lessons without assigning them automatically.
- Keep unreadable `originalRaw` as recovery evidence, not automatically parsed or restored learner data. A partial file cannot claim to recover inaccessible data. Explain what could and could not be restored in a future step.
- Preview/cancel/invalid file must not change in-memory learner data, storage, migration state or write guards. No restore/apply writes, uploads, account work or email. Do not add a working restore button; explain that applying a backup is not available yet.
- Test actual file input with a current downloaded backup, all stores, empty values, malformed/oversized/unsupported files, invalid types, adversarial keys/HTML strings, partial and ambiguous data, repeated selection and cancel. Compare state before and after the preview operation. Use synthetic data only; keep downloaded contents outside Git/logs.
- Verify phone/laptop layout, readable preview, keyboard entry/focus/close, and regression behavior for download, recovery and scoped export. Add validation tests to foundation QA as appropriate.
- Push a small PR with evidence and stop at REVIEW. ENG-006c remains held for confirmed writes, pre-restore preservation, stale-preview checks, rollback and round trips. The coordinator owns shared board/handoff integration while workers run; record evidence in your own task log.

## Prompt for Grokbot

> ENG-006a is reviewed and merged in PR #19 at caab24d6, including a small coordinator fix to partial-backup wording. Start ENG-006b only from current origin/main on a new branch. Read AGENTS.md, project-management/HANDOFF.md, the ENG-006b row and scripts/backup-format.md. Build strict local-file validation and a read-only restore preview with counts, conflicts, partial status and retained ambiguity. No restore writes, uploads, login or Claude lesson edits. Test real file input and prove preview/cancel/invalid files leave data and guards unchanged. Push a PR with evidence and stop at REVIEW before merging or starting ENG-006c.

## Prompt for the daily reviewer

> Review Growing Together since the checkpoint in project-management/HANDOFF.md. Read AGENTS.md, fetch origin, inspect TASKS.md and recent task logs, and examine integrated changes and pending worker branches. Verify claims against actual diffs and targeted behavior tests. Fix bounded defects in the authorized scope; log larger findings. Preserve learner data and Dave's theology and voice. Integrate eligible reviewed work, update the board/log/checkpoint, sync to GitHub, and report completed work, corrections, the next three priorities and at most two decisions for Dave. Keep unapproved lesson revisions in review. Do not repeat the entire baseline audit.

## Before a handoff

Record task ID, owner, branch, commit or uncommitted files, checks, unresolved issue and exact next action. Push a safe checkpoint branch when possible. Never mark partial work DONE because usage is ending. Agents resume from these files and Git history; they may not see the conversation.
