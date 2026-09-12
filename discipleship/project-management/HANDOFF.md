# Resume here

Updated September 12, 2026 after ENG-006b review REV-008 / PR #20 (changes required). The board is [TASKS.md](TASKS.md); workflow is [PLAN.md](PLAN.md).

## Current position

- ENG-001 and ENG-003 are **DONE**. PRs #10 and #12 were independently reviewed; two missed edge cases were repaired in PR #13, merged as `915ba568`.
- REV-001 preserved malformed/unreadable saved data through startup and later saves, and fixed real iframe shrink behavior. Evidence and exact checks: [review log](logs/2026-09-11-REV-001-codex.md).
- ENG-002 / PR #11 is on main with passing asset checks. Status remains **REVIEW** for Dave's artwork and actual phone assessment.
- **ENG-005 and ENG-006a are DONE. ENG-006b is ACTIVE with Grokbot for REV-008 corrections.** REV-004 independently reviewed PR #19, corrected misleading partial-backup wording, and verified actual downloaded files. Merged as `caab24d6`. Evidence: [REV-004](logs/2026-09-12-REV-004-codex.md). ENG-006b is validation and preview only. ENG-006c and parent ENG-006 remain incomplete.
- Dave is working with Claude on 202-08/09 now. Supply/review pastoral direction there and review the ENG-002 artwork. These do not block ENG-006b.
- EDIT-001 is complete: [201-08 benchmark proposal](reviews/201-08-benchmark-proposal.md) contains wording, source corrections and a short learner test. It is documentation only; L-201-08 approval and implementation remain pending.
- Login/provider remains undecided. Do not implement the old Supabase proposal automatically.

## Active worker split, reported by Dave

- Claude's **L-202-08/09 finishing pass is reviewed** at `2dad678`. Codex generated and integrated the missing story art at **`6d3019b` on PR #17**. Both lessons and ART-003 remain REVIEW, unmerged for Dave's theology/art approval and pilot gates. Storage 47, lesson browser 20, foundation QA and 72 image references pass. Fresh phone/laptop checks cover art, diagrams and reduced motion; production compression remains PERF-001. [Evidence and prompts](logs/2026-09-12-ART-003-codex.md). Claude may refresh its checkout and copies from this commit; do not overwrite the new art. No Obsidian copy or hosted Claude preview was changed by Codex.

- Grokbot works on a **different computer using GitHub**. PR #20 at `94cff90` was independently reviewed in REV-008. Existing 52 unit / 69 browser checks and foundation QA pass, but four correction groups are required before merge: strict file contract, ambiguity-content comparison, unreadable destination status and stale file reads. [Exact packet and reproductions](reviews/2026-09-12-eng006b-pr20-review.md). ENG-006b returns to ACTIVE; ENG-006c remains held. Keep lesson prose/IDs and the merged Grace widget out of this packet.
- Grok Build completed **UX-001a and UX-001b**. PR #22 is reviewed and merged as `7495a03`, including a coordinator correction to native overview buttons and accessible definitions. The expanded browser suite passes 108 assertions; overview fits at 444px on phone and 478px on laptop. See [REV-007](logs/2026-09-12-REV-007-codex.md). Hold the wider Discuss implementation until shared app-code ownership is available. Do not change another worker's checkout.

- Workers should read AGENTS.md and use separate task branches. Claude must preserve the repaired 202-09 IDs. Shared `index.html`, scripts and shared widgets belong to engineering unless explicitly reallocated. UX-001b is integrated; its temporary ownership exception is complete. Do not start another widget or host change without a new bounded assignment. Put a needed shared-code change in a task note rather than editing it concurrently.
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

Verified integrated code commit: `7495a038b36b29cde9d12c3f77f36d53db2d2bf4` (PR #22, UX-001b and REV-007). The merge tree matches reviewed head 18a7221. New widget verification: 108 browser assertions, 30 iframe checks and foundation QA passed. Earlier ENG-006a checkpoint caab24d6 included the corrected partial-backup message; its verification remains: Backup unit tests: 53; actual-file browser assertions: 60; recovery browser assertions: 20; export browser assertions: 46; foundation QA passed. PR #17 was reviewed initially in REV-005 and again after Claude's finishing pass at 2dad678. The latest separately checked lesson/art commit is 6d3019b (ART-003); storage 47, browser 20 and foundation QA pass. It has not been approved or merged. Planning-only commits after this checkpoint are not unchecked software. Inspect origin and pending PRs again at the next review.

## Active correction packet: ENG-006b after REV-008

Read [the review and reproducible correction packet](reviews/2026-09-12-eng006b-pr20-review.md). PR #20 at `94cff90` remains unmerged. Fix these issues in the existing preview packet, not a restore implementation:

- Reject invalid kind values, absent required data/loadState and unsupported inherited-property state names; enforce the documented metadata contract without treating missing data as known empty.
- Detect same-key duplicated ambiguity content disagreements while retaining the answers-data copy unassigned.
- Distinguish source completeness from unreadable destination comparisons; do not claim unavailable stored matches/conflicts are absent.
- Cancel or ignore superseded asynchronous file reads, including stale success/failure after replacement, close or navigation, for File.text and FileReader.

Fetch and merge current main normally. Keep the coordinator's current TASKS/HANDOFF and Claude/UX records; no force push or worker edits to shared planning files. Scope is backup-preview.js, its host integration, format contract, dedicated tests and worker log. Add the missing regressions and rerun preview, foundation, download, recovery and export checks. Push to PR #20 and stop at REVIEW. No restore writes or ENG-006c yet.

> PR #20 was reviewed at 94cff90. Read project-management/reviews/2026-09-12-eng006b-pr20-review.md on current main and fix all four correction groups. Merge current main normally and preserve the latest coordinator records and merged UX widget. Add regression tests, rerun the relevant suites, push to PR #20, and stop at REVIEW. Do not merge or start ENG-006c. Coordinator owns TASKS/HANDOFF.

## Claude: finishing packet returned to REVIEW

The earlier Ruth direction and missing-image finishing packet are superseded. Claude completed Genesis 15 / Ephesians 5 teaching at `2dad678`; Codex reviewed it and delivered both image pairs at `6d3019b`. Keep Ephesians 5:25 in both 202-02 and 202-08. Dave supports returning to the passage with a special focus: household application in 202-02, covenant marriage reflecting Christ and His church in 202-08. No 202-02 edit is needed.

> Fetch your PR #17 branch normally. Codex added the four story images at 6d3019b and checked the finishing pass. Read the ART-003 log. Keep Ephesians 5:25 in both lessons; their emphasis is intentionally different. Refresh any Obsidian copies and preview you maintain from this version. Preserve all IDs and answers. Stop at REVIEW; no merge or 203-06 work yet.

Dave's next job is to review the finished 202-08/09 theology, FIGHT wording, safeguards and four story pictures. No retroactive drafting brief is required. The next writing packet remains 203-06 after this review handoff is settled; coordinator must define its scope separately. Grokbot continues ENG-006b; Grok Build has completed UX-001b and holds wider Discuss implementation.

## Grok Build: UX-001b complete; hold wider Discuss

PR #22 is reviewed and merged as `7495a03`. Restart returns to Begin; Show whole diagram is separate and Return to steps preserves the prior step. The coordinator corrected overview tiles to native buttons whose accessible names include the definitions and expanded the browser suite to 108 assertions. Teaching data and font sizes are unchanged. The whole diagram, definitions, arrows and controls fit below the header after ordinary outer scrolling, including the synthetic save-error state. Actual iPhone/Safari and a human meeting are still untested.

> UX-001b is reviewed and merged in PR #22 at 7495a03. Read the REV-007 log and fetch normally. Keep your existing work safe. Hold the wider Discuss UI and shared host edits while Grokbot finishes ENG-006b. No additional coding packet is assigned yet.

Parent UX-001 remains TODO. Its next implementation packet must explicitly allocate shared index/navigation ownership, reuse the same lesson and answer IDs, avoid automatic disclosure, and test a real conversation before rollout. The Grace overview is one prerequisite, not a completed Discuss view.

## Prompt for the daily reviewer

> Review Growing Together since the checkpoint in project-management/HANDOFF.md. Read AGENTS.md, fetch origin, inspect TASKS.md and recent task logs, and examine integrated changes and pending worker branches. Verify claims against actual diffs and targeted behavior tests. Fix bounded defects in the authorized scope; log larger findings. Preserve learner data and Dave's theology and voice. Integrate eligible reviewed work, update the board/log/checkpoint, sync to GitHub, and report completed work, corrections, the next three priorities and at most two decisions for Dave. Keep unapproved lesson revisions in review. Do not repeat the entire baseline audit.

## Before a handoff

Record task ID, owner, branch, commit or uncommitted files, checks, unresolved issue and exact next action. Push a safe checkpoint branch when possible. Never mark partial work DONE because usage is ending. Agents resume from these files and Git history; they may not see the conversation.
