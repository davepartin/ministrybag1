# Resume here

Updated September 12, 2026 after UX report review REV-006. The board is [TASKS.md](TASKS.md); workflow is [PLAN.md](PLAN.md).

## Current position

- ENG-001 and ENG-003 are **DONE**. PRs #10 and #12 were independently reviewed; two missed edge cases were repaired in PR #13, merged as `915ba568`.
- REV-001 preserved malformed/unreadable saved data through startup and later saves, and fixed real iframe shrink behavior. Evidence and exact checks: [review log](logs/2026-09-11-REV-001-codex.md).
- ENG-002 / PR #11 is on main with passing asset checks. Status remains **REVIEW** for Dave's artwork and actual phone assessment.
- **ENG-005 and ENG-006a are DONE. ENG-006b is in REVIEW.** PR #20 on `cursor/eng-006b-backup-preview-2b79` adds validation and a read-only restore preview. Evidence: [ENG-006b](logs/2026-09-12-ENG-006b-discipleshipbot.md). REV-004 independently reviewed PR #19, corrected misleading partial-backup wording, and verified actual downloaded files. Merged as `caab24d6`. Evidence: [REV-004](logs/2026-09-12-REV-004-codex.md). ENG-006c and parent ENG-006 remain incomplete. Do not start ENG-006c.
- Dave is working with Claude on 202-08/09 now. Supply/review pastoral direction there and review the ENG-002 artwork. These do not block ENG-006b review.
- EDIT-001 is complete: [201-08 benchmark proposal](reviews/201-08-benchmark-proposal.md) contains wording, source corrections and a short learner test. It is documentation only; L-201-08 approval and implementation remain pending.
- Login/provider remains undecided. Do not implement the old Supabase proposal automatically.

## Active worker split, reported by Dave

- Claude finished **L-202-08/09 app drafts** in PR #17 at `5e1c49d`. REV-005 reviewed both and added the ENG-001b storage-test correction on that PR at `4ec7277`. 202-08 is **ACTIVE** for Dave's new direction; 202-09 remains **REVIEW** with its finishing packet. Both are unmerged. [Coordinator review and finishing packet](reviews/2026-09-12-202-08-09-pr17-review.md): improve phone diagram text, tighten story/promise wording, resolve the Keller quotation source and add missing charcoal/color story art. Targeted storage/browser checks pass; editorial, visual, Dave and pilot gates remain pending. Claude retains the lesson files and dedicated assets. No Obsidian copy or preview was changed by the coordinator.

- Grokbot works on a **different computer using GitHub** for the engineering queue. ENG-006b is in REVIEW on `cursor/eng-006b-backup-preview-2b79`; PR #20 awaits independent review. ENG-006c remains held. Keep lesson prose/IDs out of the software packet. Do not start ENG-006c.
- Grok Build completed **UX-001a**, merged in PR #21 as `06a942f2` after REV-006 verified and qualified its findings. **UX-001b is now cleared**: only the Grace widget, its dedicated test and task log. Use its existing isolated checkout `/Users/dpartin/github/ministrybag1-grok-build-ux`, with a new branch from current main after confirming the old work is committed. Start has not yet been reported. Do not touch Claude's checkout or the older original main checkout.

- Workers should read AGENTS.md and use separate task branches. Claude must preserve the repaired 202-09 IDs. Shared `index.html`, scripts and shared widgets belong to engineering unless explicitly reallocated. Exception for UX-001b: Grok Build alone owns `widgets/grace-diagram.html` and the new `scripts/ux001b_browser_check.js`; Grokbot must leave those paths alone. Put a needed shared-code change in a task note rather than editing it concurrently.
- Coordinator owns TASKS/HANDOFF integration while workers run. Each worker records evidence in its own task log; avoid competing edits to the shared board.
- GitHub carries committed and pushed changes only. Local edits are not automatically visible on the other computer. Push review branches, then integrate; do not merge unapproved lesson drafts to a publishing main branch.
- Do not pull into, switch branches in, reset, or clean Claude's active checkout while it is working. Review remote changes in a separate worktree. After Claude checkpoints its work, reconcile with current main without discarding its changes.
- Dave remains the final theology/art reviewer. Drafting underway does not establish that his DAVE-001 briefs or lesson approvals are complete.

## Remaining risks

- Failed-load guards and recovery controls are now present. Unresolved errors stay visible across unrelated successful saves. Guarded edits still remain in memory until recovery; never remove the guard just to make saving appear successful. ENG-006a provides a versioned backup download. ENG-006b adds validation and a read-only preview. Confirmed restore writes remain ENG-006c.
- Historical ambiguous answers remain in recovery metadata. ENG-006 must provide usable recovery/backup access without assigning them automatically to a lesson.
- Credential remains in source/docs. Never reproduce its value; SEC-001 is a release blocker.
- 202-08/09 now have app drafts on PR #17, with finishing work and art still pending. 203-06/08/09/10 need substantial writing; 301 placeholders and lesson approval gates remain on the board.
- Real iPhone/Safari, cross-device sync and production deployment were not verified in this review.

## Last review checkpoint

Verified integrated code commit: `caab24d6a2602df02adb533bcab578d0aa17fe48` (PR #19, ENG-006a and REV-004), including the corrected partial-backup message. Backup unit tests: 53; actual-file browser assertions: 60; recovery browser assertions: 20; export browser assertions: 46; foundation QA passed. PR #17 draft content was reviewed separately in REV-005 at 5e1c49d; the test correction is 4ec7277. It has not been approved or merged. Planning-only commits after this checkpoint are not unchecked software. Inspect origin and pending PRs again at the next review.

## Next coding packet: hold ENG-006c

ENG-006b is in REVIEW on PR #20. Do not start ENG-006c until that review passes. ENG-006c remains held for confirmed writes, pre-restore preservation, stale-preview checks, rollback and round trips. Claude owns 202-08/09 and their dedicated assets. The coordinator owns shared board/handoff integration while workers run.

## Prompt for Grokbot

> ENG-006a is reviewed and merged in PR #19 at caab24d6, including a small coordinator fix to partial-backup wording. Start ENG-006b only from current origin/main on a new branch. Read AGENTS.md, project-management/HANDOFF.md, the ENG-006b row and scripts/backup-format.md. Build strict local-file validation and a read-only restore preview with counts, conflicts, partial status and retained ambiguity. No restore writes, uploads, login or Claude lesson edits. Test real file input and prove preview/cancel/invalid files leave data and guards unchanged. Push a PR with evidence and stop at REVIEW before merging or starting ENG-006c.

## Claude: focused finishing pass on PR #17

**Latest pastoral direction, September 12:** Dave does not want Ruth and Naomi as the marriage lesson's anchor. He prefers Ephesians 5 and is open to God's covenant with Abraham. This supersedes the earlier Ruth story/key-verse/artwork instructions. Stop producing Ruth/Naomi artwork for 202-08. Coordinator recommendation: center the teaching on Ephesians 5:21-33, with 5:25 as the proposed key verse; use a short Genesis 15 opening about God's faithful promise to Abram, then move promptly to Christ and the church and husband-wife application. Abraham illustrates God's covenant faithfulness, not an exemplary marriage. Keep Contract or Covenant as the single teaching diagram, meaningful unmarried-reader application and the pastoral safeguards. Update story, recap/review, question references, description, 202.08 TOC row, research and art prompts consistently. Preserve saved question meanings; if a prompt's meaning changes materially, use a new ID and retain old answers. Claude owns implementation; this is direction, not approval of an unseen revision.

> Dave's change of direction for 202-08: replace Ruth and Naomi as the main story and stop their artwork. Center marriage teaching on Ephesians 5, especially Christ's self-giving love in 5:25. A short Genesis 15 opening about God's covenant with Abram can establish promise-keeping love before the marriage application. Keep one main truth and the Contract or Covenant diagram. Update all Ruth-specific prose/questions/metadata/art prompts, preserve answer meanings and safeguards, and keep unmarried readers included. Read the latest HANDOFF; this supersedes the earlier Ruth finishing instructions. Continue on PR #17 and stop at REVIEW.

The draft review is complete. Read [the exact finishing packet](reviews/2026-09-12-202-08-09-pr17-review.md). The coordinator fixed ENG-001b on your PR at `4ec7277`; fetch and fast-forward your dedicated branch if clean, or merge normally if you have new work. Never reset or force-push. Do not repeat the test fix or send it to Grokbot.

Keep the two lesson files, dedicated diagrams/art, research and task log. Address phone typography, biblical retelling precision, the promise sentence and the unverified Keller source. Finish the two story-image pairs if your tools support generation; otherwise report that dependency explicitly. Refresh content hashes and any copies/previews you maintain, rerun the storage suite, foundation QA and the coordinator's new browser check, then return to REVIEW. Shared app code and tests remain outside your editing packet.

> The coordinator reviewed PR #17 and fixed ENG-001b at 4ec7277. Fetch your branch and current main normally, then read project-management/reviews/2026-09-12-202-08-09-pr17-review.md for the focused finishing list. Improve diagram readability on phones, address the specific source/wording corrections, and complete story art if you have image-generation access. Keep IDs and existing answers intact. Update your log, hashes and matching copies/previews; rerun storage, foundation and relevant browser checks. Push to PR #17 and stop at REVIEW. No shared-code/test edits, merge or 203-06 work yet.

203-06 remains the next proposed writing task after this finishing pass is reviewed. Dave can review the proposed FIGHT wording, proposed Ephesians key verse and pastoral safeguards now; final lesson approval waits for the finished version. Do not require retroactive DAVE-001 briefs as a separate paperwork gate.

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
