# Resume here

Updated September 12, 2026 after draft review REV-005. The board is [TASKS.md](TASKS.md); workflow is [PLAN.md](PLAN.md).

## Current position

- ENG-001 and ENG-003 are **DONE**. PRs #10 and #12 were independently reviewed; two missed edge cases were repaired in PR #13, merged as `915ba568`.
- REV-001 preserved malformed/unreadable saved data through startup and later saves, and fixed real iframe shrink behavior. Evidence and exact checks: [review log](logs/2026-09-11-REV-001-codex.md).
- ENG-002 / PR #11 is on main with passing asset checks. Status remains **REVIEW** for Dave's artwork and actual phone assessment.
- **ENG-005 and ENG-006a are DONE. ENG-006b is ACTIVE with Grokbot, as confirmed by Dave.** REV-004 independently reviewed PR #19, corrected misleading partial-backup wording, and verified actual downloaded files. Merged as `caab24d6`. Evidence: [REV-004](logs/2026-09-12-REV-004-codex.md). ENG-006b is validation and preview only. ENG-006c and parent ENG-006 remain incomplete.
- Dave is working with Claude on 202-08/09 now. Supply/review pastoral direction there and review the ENG-002 artwork. These do not block ENG-006b.
- EDIT-001 is complete: [201-08 benchmark proposal](reviews/201-08-benchmark-proposal.md) contains wording, source corrections and a short learner test. It is documentation only; L-201-08 approval and implementation remain pending.
- Login/provider remains undecided. Do not implement the old Supabase proposal automatically.

## Active worker split, reported by Dave

- Claude finished **L-202-08/09 app drafts** in PR #17 at `5e1c49d`. REV-005 reviewed both and added the ENG-001b storage-test correction on that PR at `4ec7277`. Both drafts remain **REVIEW**, unmerged. [Coordinator review and finishing packet](reviews/2026-09-12-202-08-09-pr17-review.md): improve phone diagram text, tighten story/promise wording, resolve the Keller quotation source and add missing charcoal/color story art. Targeted storage/browser checks pass; editorial, visual, Dave and pilot gates remain pending. Claude retains the lesson files and dedicated assets. No Obsidian copy or preview was changed by the coordinator.

- Grokbot works on a **different computer using GitHub** for the engineering queue. ENG-006a is reviewed and complete. Grokbot is running ENG-006b on `cursor/eng-006b-backup-preview-2b79`; PR #20 is open but has not been reviewed. ENG-006c remains held. Keep lesson prose/IDs out of the software packet.
- Grok Build in Dave's terminal is a separate worker from Grokbot. Dave confirmed it is running **UX-001a**, a read-only phone/laptop learner-journey review of 201-01 and 201-08. Its dedicated checkout is `/Users/dpartin/github/ministrybag1-grok-build-ux`, branch `codex/grok-build-ux001a`. Dave confirmed all three workers are running on September 12; finished output has not yet been reviewed. Do not run it in Claude's checkout or the older original main checkout.
- Workers should read AGENTS.md and use separate task branches. Claude must preserve the repaired 202-09 IDs. Shared `index.html`, scripts and shared widgets belong to engineering unless the coordinator explicitly reallocates them. Put a needed shared-code change in a task note rather than editing it concurrently.
- Coordinator owns TASKS/HANDOFF integration while workers run. Each worker records evidence in its own task log; avoid competing edits to the shared board.
- GitHub carries committed and pushed changes only. Local edits are not automatically visible on the other computer. Push review branches, then integrate; do not merge unapproved lesson drafts to a publishing main branch.
- Do not pull into, switch branches in, reset, or clean Claude's active checkout while it is working. Review remote changes in a separate worktree. After Claude checkpoints its work, reconcile with current main without discarding its changes.
- Dave remains the final theology/art reviewer. Drafting underway does not establish that his DAVE-001 briefs or lesson approvals are complete.

## Remaining risks

- Failed-load guards and recovery controls are now present. Unresolved errors stay visible across unrelated successful saves. Guarded edits still remain in memory until recovery; never remove the guard just to make saving appear successful. ENG-006a now provides a versioned backup download; validated preview and restore remain to be built.
- Historical ambiguous answers remain in recovery metadata. ENG-006 must provide usable recovery/backup access without assigning them automatically to a lesson.
- Credential remains in source/docs. Never reproduce its value; SEC-001 is a release blocker.
- 202-08/09 now have app drafts on PR #17, with finishing work and art still pending. 203-06/08/09/10 need substantial writing; 301 placeholders and lesson approval gates remain on the board.
- Real iPhone/Safari, cross-device sync and production deployment were not verified in this review.

## Last review checkpoint

Verified integrated code commit: `caab24d6a2602df02adb533bcab578d0aa17fe48` (PR #19, ENG-006a and REV-004), including the corrected partial-backup message. Backup unit tests: 53; actual-file browser assertions: 60; recovery browser assertions: 20; export browser assertions: 46; foundation QA passed. PR #17 draft content was reviewed separately in REV-005 at 5e1c49d; the test correction is 4ec7277. It has not been approved or merged. Planning-only commits after this checkpoint are not unchecked software. Inspect origin and pending PRs again at the next review.

## Active coding packet: ENG-006b, validation and read-only restore preview

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

## Claude: focused finishing pass on PR #17

The draft review is complete. Read [the exact finishing packet](reviews/2026-09-12-202-08-09-pr17-review.md). The coordinator fixed ENG-001b on your PR at `4ec7277`; fetch and fast-forward your dedicated branch if clean, or merge normally if you have new work. Never reset or force-push. Do not repeat the test fix or send it to Grokbot.

Keep the two lesson files, dedicated diagrams/art, research and task log. Address phone typography, biblical retelling precision, the promise sentence and the unverified Keller source. Finish the two story-image pairs if your tools support generation; otherwise report that dependency explicitly. Refresh content hashes and any copies/previews you maintain, rerun the storage suite, foundation QA and the coordinator's new browser check, then return to REVIEW. Shared app code and tests remain outside your editing packet.

> The coordinator reviewed PR #17 and fixed ENG-001b at 4ec7277. Fetch your branch and current main normally, then read project-management/reviews/2026-09-12-202-08-09-pr17-review.md for the focused finishing list. Improve diagram readability on phones, address the specific source/wording corrections, and complete story art if you have image-generation access. Keep IDs and existing answers intact. Update your log, hashes and matching copies/previews; rerun storage, foundation and relevant browser checks. Push to PR #17 and stop at REVIEW. No shared-code/test edits, merge or 203-06 work yet.

203-06 remains the next proposed writing task after this finishing pass is reviewed. Dave can review the proposed FIGHT wording, Ruth key verse and pastoral safeguards now; final lesson approval waits for the finished version. Do not require retroactive DAVE-001 briefs as a separate paperwork gate.

## Grok Build: UX-001a review packet

Use `/Users/dpartin/github/ministrybag1-grok-build-ux/discipleship` on `codex/grok-build-ux001a`. Read AGENTS.md, PLAN.md, this packet and the UX-001a row. Record your start/branch/commit in your own task log; the coordinator owns the shared board while workers run.

- Review **only 201-01 and 201-08**, plus the navigation needed to reach them. Use the existing app from this checkout in a fresh browser profile with synthetic answers. Leave Claude's lessons and Grokbot's development branch alone.
- At 375x812, 390x844 and approximately 1280x800, walk through reading, finding the big truth, viewing each image, using every step/back/reset of the lesson tool, answering a reflection, navigating away and returning, and locating the insight/action/prayer for a one-on-one meeting.
- Test laptop and phone-sized views separately; do not claim changing viewport transfers data between devices. Account sync and cross-device transfer are undecided. This is an agent usability review, not a human pilot or actual iPhone/Safari test.
- Record at most five prioritized findings. For each: exact lesson/step, viewport, expected and observed behavior, reproduction steps, relevant file location and suggested smallest improvement. Label observed defects separately from design suggestions. Capture screenshots when useful; use synthetic data and keep credentials/private information out of output.
- Propose a concise 201-08 Discuss view showing the main truth, complete teaching diagram, saved insight, next step and prayer. Describe how a learner would reach it. Preserve existing source and answers; this packet is a proposal, not an implementation.
- Write only `project-management/reviews/2026-09-12-UX-001a-grok-build.md` and `project-management/logs/2026-09-12-UX-001a-grok-build.md`. No changes to app code, tests, lesson JSON, images, widgets, board or shared handoff. Report unavailable browser checks honestly instead of treating code inspection as visual verification.
- Push the branch and open a documentation-only PR at REVIEW. Do not merge. The coordinator uses the evidence to scope UX-001 implementation after shared-code ownership is free. This task does not complete UX-001 or any lesson/pilot gate.

> Work on UX-001a only in /Users/dpartin/github/ministrybag1-grok-build-ux/discipleship. Read AGENTS.md and project-management/HANDOFF.md for the full packet. Review the 201-01 and 201-08 learner journey on phone-sized and laptop browser views, using synthetic answers. Produce at most five evidenced findings and a concise 201-08 Discuss-view proposal. Write only your assigned review and task log. No application, lesson, widget or shared-board edits. Push a documentation-only PR and stop at REVIEW.

## Prompt for the daily reviewer

> Review Growing Together since the checkpoint in project-management/HANDOFF.md. Read AGENTS.md, fetch origin, inspect TASKS.md and recent task logs, and examine integrated changes and pending worker branches. Verify claims against actual diffs and targeted behavior tests. Fix bounded defects in the authorized scope; log larger findings. Preserve learner data and Dave's theology and voice. Integrate eligible reviewed work, update the board/log/checkpoint, sync to GitHub, and report completed work, corrections, the next three priorities and at most two decisions for Dave. Keep unapproved lesson revisions in review. Do not repeat the entire baseline audit.

## Before a handoff

Record task ID, owner, branch, commit or uncommitted files, checks, unresolved issue and exact next action. Push a safe checkpoint branch when possible. Never mark partial work DONE because usage is ending. Agents resume from these files and Git history; they may not see the conversation.
