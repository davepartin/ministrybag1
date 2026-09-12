# Resume here

Updated September 12, 2026 after Claude finishing review and ART-003. The board is [TASKS.md](TASKS.md); workflow is [PLAN.md](PLAN.md).

## Current position

- ENG-001 and ENG-003 are **DONE**. PRs #10 and #12 were independently reviewed; two missed edge cases were repaired in PR #13, merged as `915ba568`.
- REV-001 preserved malformed/unreadable saved data through startup and later saves, and fixed real iframe shrink behavior. Evidence and exact checks: [review log](logs/2026-09-11-REV-001-codex.md).
- ENG-002 / PR #11 is on main with passing asset checks. Status remains **REVIEW** for Dave's artwork and actual phone assessment.
- **ENG-005 and ENG-006a are DONE. ENG-006b is ACTIVE with Grokbot, as confirmed by Dave.** REV-004 independently reviewed PR #19, corrected misleading partial-backup wording, and verified actual downloaded files. Merged as `caab24d6`. Evidence: [REV-004](logs/2026-09-12-REV-004-codex.md). ENG-006b is validation and preview only. ENG-006c and parent ENG-006 remain incomplete.
- Dave is working with Claude on 202-08/09 now. Supply/review pastoral direction there and review the ENG-002 artwork. These do not block ENG-006b.
- EDIT-001 is complete: [201-08 benchmark proposal](reviews/201-08-benchmark-proposal.md) contains wording, source corrections and a short learner test. It is documentation only; L-201-08 approval and implementation remain pending.
- Login/provider remains undecided. Do not implement the old Supabase proposal automatically.

## Active worker split, reported by Dave

- Claude's **L-202-08/09 finishing pass is reviewed** at `2dad678`. Codex generated and integrated the missing story art at **`6d3019b` on PR #17**. Both lessons and ART-003 remain REVIEW, unmerged for Dave's theology/art approval and pilot gates. Storage 47, lesson browser 20, foundation QA and 72 image references pass. Fresh phone/laptop checks cover art, diagrams and reduced motion; production compression remains PERF-001. [Evidence and prompts](logs/2026-09-12-ART-003-codex.md). Claude may refresh its checkout and copies from this commit; do not overwrite the new art. No Obsidian copy or hosted Claude preview was changed by Codex.

- Grokbot works on a **different computer using GitHub** for the engineering queue. ENG-006a is reviewed and complete. Grokbot is running ENG-006b on `cursor/eng-006b-backup-preview-2b79`; PR #20 is open but has not been reviewed. ENG-006c remains held. Keep lesson prose/IDs out of the software packet.
- Grok Build completed **UX-001a**, merged in PR #21 as `06a942f2` after REV-006 verified and qualified its findings. **UX-001b is now cleared**: only the Grace widget, its dedicated test and task log. Use its existing isolated checkout `/Users/dpartin/github/ministrybag1-grok-build-ux`, with a new branch from current main after confirming the old work is committed. Start has not yet been reported. Do not touch Claude's checkout or the older original main checkout.

- Workers should read AGENTS.md and use separate task branches. Claude must preserve the repaired 202-09 IDs. Shared `index.html`, scripts and shared widgets belong to engineering unless explicitly reallocated. Exception for UX-001b: Grok Build alone owns `widgets/grace-diagram.html` and the new `scripts/ux001b_browser_check.js`; Grokbot must leave those paths alone. Put a needed shared-code change in a task note rather than editing it concurrently.
- Coordinator owns TASKS/HANDOFF integration while workers run. Each worker records evidence in its own task log; avoid competing edits to the shared board.
- GitHub carries committed and pushed changes only. Local edits are not automatically visible on the other computer. Push review branches, then integrate; do not merge unapproved lesson drafts to a publishing main branch.
- Do not pull into, switch branches in, reset, or clean Claude's active checkout while it is working. Review remote changes in a separate worktree. After Claude checkpoints its work, reconcile with current main without discarding its changes.
- Dave remains the final theology/art reviewer. Drafting underway does not establish that his DAVE-001 briefs or lesson approvals are complete.

## Remaining risks

- Failed-load guards and recovery controls are now present. Unresolved errors stay visible across unrelated successful saves. Guarded edits still remain in memory until recovery; never remove the guard just to make saving appear successful. ENG-006a now provides a versioned backup download; validated preview and restore remain to be built.
- Historical ambiguous answers remain in recovery metadata. ENG-006 must provide usable recovery/backup access without assigning them automatically to a lesson.
- Credential remains in source/docs. Never reproduce its value; SEC-001 is a release blocker.
- 202-08/09 have reviewed finishing drafts and generated art on PR #17; Dave, pilot and delivery gates remain pending. 203-06/08/09/10 need substantial writing; 301 placeholders and lesson approval gates remain on the board.
- Real iPhone/Safari, cross-device sync and production deployment were not verified in this review.

## Last review checkpoint

Verified integrated code commit: `caab24d6a2602df02adb533bcab578d0aa17fe48` (PR #19, ENG-006a and REV-004), including the corrected partial-backup message. Backup unit tests: 53; actual-file browser assertions: 60; recovery browser assertions: 20; export browser assertions: 46; foundation QA passed. PR #17 was reviewed initially in REV-005 and again after Claude's finishing pass at 2dad678. The latest separately checked lesson/art commit is 6d3019b (ART-003); storage 47, browser 20 and foundation QA pass. It has not been approved or merged. Planning-only commits after this checkpoint are not unchecked software. Inspect origin and pending PRs again at the next review.

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

## Claude: finishing packet returned to REVIEW

The earlier Ruth direction and missing-image finishing packet are superseded. Claude completed Genesis 15 / Ephesians 5 teaching at `2dad678`; Codex reviewed it and delivered both image pairs at `6d3019b`. Keep Ephesians 5:25 in both 202-02 and 202-08. Dave supports returning to the passage with a special focus: household application in 202-02, covenant marriage reflecting Christ and His church in 202-08. No 202-02 edit is needed.

> Fetch your PR #17 branch normally. Codex added the four story images at 6d3019b and checked the finishing pass. Read the ART-003 log. Keep Ephesians 5:25 in both lessons; their emphasis is intentionally different. Refresh any Obsidian copies and preview you maintain from this version. Preserve all IDs and answers. Stop at REVIEW; no merge or 203-06 work yet.

Dave's next job is to review the finished 202-08/09 theology, FIGHT wording, safeguards and four story pictures. No retroactive drafting brief is required. The next writing packet remains 203-06 after this review handoff is settled; coordinator must define its scope separately. Grokbot continues ENG-006b and Grok Build retains UX-001b unchanged.

## Grok Build: UX-001b, isolated Grace-widget improvement

UX-001a is DONE as a reviewed report, not as implementation. Its merge is `06a942f2`. Read the coordinator qualifications in the report: the whole widget can fit after careful alignment without a save banner; the problem is ordinary positioning, space budget and lack of direct access. The alt text is a minor wording suggestion, not this packet's scope.

In your existing isolated checkout `/Users/dpartin/github/ministrybag1-grok-build-ux`, preserve any local work, fetch current main, and start a new dedicated branch. Do not continue implementation on the merged UX-001a branch. Read AGENTS.md, the UX-001b row, the corrected UX-001a report, current `widgets/grace-diagram.html` and applicable widget guide. Shared host files remain owned by Grokbot for ENG-006b.

- **Allowed edits only:** `widgets/grace-diagram.html`, new `scripts/ux001b_browser_check.js`, and `project-management/logs/2026-09-12-UX-001b-grok-build.md`. Coordinator owns board/handoff. No lesson JSON, `index.html`, iframe helper, backup code, foundation QA, other widgets, artwork or shared styles.
- Make Restart return to the true intro/Begin state, matching 201-01. Keep Begin, Next and Back behavior predictable through every step.
- Add a separate clearly labeled **Show whole diagram** control reachable without completing the tour. The resulting compact view must show all four names, existing definitions and the existing cycle. Use the existing in-file diagram data/rendering rather than a second copied diagram. Provide a clear way back to the guided steps with well-defined state preservation. Restart must remain a restart, not become the overview action.
- Preserve theological wording, Scripture text/references, colors and the established visual identity. Editorial corrections to 201-08 remain separate. Do not trade readability for fit by shrinking teaching labels. Aim for a compact overview around 530-560px or less with readable teaching text; if the guide's target conflicts with readable content, report measured constraints. The complete view need not repeat the full step-by-step verse card.
- Use native buttons with clear names, visible focus and usable touch targets. Keep keyboard focus predictable when rerendering controls. Overview, return, Back and Restart must work with keyboard and pointer and must not create traps.
- Test the widget embedded in the existing app at 375x812, 390x844 and 1280x800, with fresh synthetic contexts. Walk every guided step, Back, Restart, overview from intro and mid-tour, return, and repeated switches. Verify actual rendered sizes, all labels, primary controls, no internal clipping/outer overflow, and iframe growth/shrink after mode changes. Check normal header and synthetic save-error banner states; record which view fits versus requires outer scrolling. Do not change the parent host to solve a positioning issue in this packet; report host-only issues separately.
- Keep the browser regression reproducible in the new script, supporting the existing Chrome-channel environment and a configurable local base URL. Keep screenshots and synthetic downloaded/test data outside Git. Run relevant existing iframe checks. Do not claim actual Safari/iPhone or a human conversation test from headless browser checks.
- Push a small PR with evidence and stop at REVIEW. Do not merge or begin the wider Discuss UI. That remains UX-001 and will reuse the single lesson source/answer IDs after shared-code ownership is free.

> UX-001a is reviewed and merged in PR #21 at 06a942f2. Start UX-001b on a new branch from current main in your existing isolated checkout. Read project-management/HANDOFF.md for the full packet. Edit only widgets/grace-diagram.html, your new browser test and task log. Fix Restart to return to Begin and add an accessible, compact Show whole diagram view using existing diagram data. Preserve teaching and verify embedded phone/laptop layout, keyboard use and iframe resizing. No shared host, backup or lesson edits. Push a PR with evidence and stop at REVIEW.

## Prompt for the daily reviewer

> Review Growing Together since the checkpoint in project-management/HANDOFF.md. Read AGENTS.md, fetch origin, inspect TASKS.md and recent task logs, and examine integrated changes and pending worker branches. Verify claims against actual diffs and targeted behavior tests. Fix bounded defects in the authorized scope; log larger findings. Preserve learner data and Dave's theology and voice. Integrate eligible reviewed work, update the board/log/checkpoint, sync to GitHub, and report completed work, corrections, the next three priorities and at most two decisions for Dave. Keep unapproved lesson revisions in review. Do not repeat the entire baseline audit.

## Before a handoff

Record task ID, owner, branch, commit or uncommitted files, checks, unresolved issue and exact next action. Push a safe checkpoint branch when possible. Never mark partial work DONE because usage is ending. Agents resume from these files and Git history; they may not see the conversation.
