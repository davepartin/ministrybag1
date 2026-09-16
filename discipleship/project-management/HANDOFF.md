# Resume here

Updated September 16, 2026 at the coordinator change (COORD-002). Last code checkpoint was ENG-005b / PR #24. The board is [TASKS.md](TASKS.md); workflow is [PLAN.md](PLAN.md).

## Coordinator change, September 16

Claude (Cowork) is now the coordinator, replacing ChatGPT (Astra/Codex). Nothing on main changed for `discipleship/` between September 13 and 16. All unit suites and foundation QA pass on main, and PR #17 still merges cleanly with its checks passing. ENG-006c has not been started. See [COORD-002](logs/2026-09-16-COORD-002-claude.md). Next three priorities: DAVE-001 review of PR #17, then ENG-006c and SEC-001, then the L-203-06 writing packet.

Later on September 16, Claude Code took the coordinator seat and pushed COORD-002. All unit suites, foundation QA and all ten Playwright browser checks pass on main `1ebb1f1`. PR #17 still merges cleanly, but `scripts/eng001_browser_check.js` fails on the merged tree because it still fills the retired `202-09-devos` field. That is a stale test, not a lesson defect; repair it on the PR branch after DAVE-001 so Dave's review head does not move. ENG-006c and SEC-001 are unassigned until Dave names the workers. See [COORD-003](logs/2026-09-16-COORD-003-claude.md).

## Current position

- ENG-001 and ENG-003 are **DONE**. PRs #10 and #12 were independently reviewed; two missed edge cases were repaired in PR #13, merged as `915ba568`.
- REV-001 preserved malformed/unreadable saved data through startup and later saves, and fixed real iframe shrink behavior. Evidence and exact checks: [review log](logs/2026-09-11-REV-001-codex.md).
- ENG-002 / PR #11 is on main with passing asset checks. Status remains **REVIEW** for Dave's artwork and actual phone assessment.
- **ENG-005, ENG-005b, ENG-006a and ENG-006b are DONE.** Routine successful saves are now silent; only a real save failure opens the recovery banner. PR #24 merged as `64cfa9b`. ENG-006c is cleared as a separate confirmed-restore packet; parent ENG-006 remains incomplete.
- Claude has finished the 202-08/09 handoff. Dave now reviews its pastoral wording and artwork, along with the ENG-002 artwork. These do not block ENG-006c.
- EDIT-001 is complete: [201-08 benchmark proposal](reviews/201-08-benchmark-proposal.md) contains wording, source corrections and a short learner test. It is documentation only; L-201-08 approval and implementation remain pending.
- Login/provider remains undecided. Dave's desired destination is Google sign-in or a separate account the learner creates. Use provider authentication rather than collecting a Google password directly. Firebase, Supabase or another provider will be chosen in DATA-001; do not implement the old Supabase proposal automatically.

## Active worker split, reported by Dave

- Claude's **L-202-08/09 finishing pass is reviewed** at PR #17 head `6572477`. Commit `b7a4039` contains four Dave-approved review edits: a practical unmarried response in 8.3, narrower Genesis 15 covenant wording, a brief explanation of "Gentiles," and a concrete grace prayer. All question IDs and story artwork remain unchanged. The later coordinator commit only updates the lesson browser test for ENG-005b's quiet-save behavior. Both lessons and ART-003 remain REVIEW, unmerged for Dave's full theology/art approval and pilot gates. Storage 47, lesson browser 20, foundation QA and 72 image references pass. Production compression remains PERF-001. [Evidence and prompts](logs/2026-09-12-ART-003-codex.md). Do not overwrite the new art.

- Grokbot works on a **different computer using GitHub**. ENG-006b is integrated. The next reserved packet is ENG-006c from current main, including PR #24's quiet-save behavior, on a new branch. It owns confirmed restore and related host/storage tests only. Keep lesson prose/IDs, Claude assets and the merged Grace widget out of this packet.
- Grok Build completed **UX-001a and UX-001b**. PR #22 is reviewed and merged as `7495a03`, including a coordinator correction to native overview buttons and accessible definitions. The expanded browser suite passes 108 assertions; overview fits at 444px on phone and 478px on laptop. See [REV-007](logs/2026-09-12-REV-007-codex.md). Hold the wider Discuss implementation until shared app-code ownership is available. Do not change another worker's checkout.

- Workers should read AGENTS.md and use separate task branches. Claude must preserve the repaired 202-09 IDs. Shared `index.html`, scripts and shared widgets belong to engineering unless explicitly reallocated. UX-001b is integrated; its temporary ownership exception is complete. Do not start another widget or host change without a new bounded assignment. Put a needed shared-code change in a task note rather than editing it concurrently.
- Coordinator owns TASKS/HANDOFF integration while workers run. Each worker records evidence in its own task log; avoid competing edits to the shared board.
- GitHub carries committed and pushed changes only. Local edits are not automatically visible on the other computer. Push review branches, then integrate; do not merge unapproved lesson drafts to a publishing main branch.
- Do not pull into, switch branches in, reset, or clean Claude's active checkout while it is working. Review remote changes in a separate worktree. After Claude checkpoints its work, reconcile with current main without discarding its changes.
- Dave remains the final theology/art reviewer. Drafting underway does not establish that his DAVE-001 briefs or lesson approvals are complete.

## Remaining risks

- Failed-load guards and recovery controls are present. Versioned download and strict read-only preview are integrated. Confirmed restore, stale-preview protection and rollback remain ENG-006c. Never remove a guard merely to make saving appear successful.
- Historical ambiguous answers remain in recovery metadata. ENG-006 must provide usable recovery/backup access without assigning them automatically to a lesson.
- Credential remains in source/docs. Never reproduce its value; SEC-001 is a release blocker.
- 202-08/09 have reviewed finishing drafts and generated art on PR #17; Dave, pilot and delivery gates remain pending. 203-06/08/09/10 need substantial writing; 301 placeholders and lesson approval gates remain on the board.
- Real iPhone/Safari, cross-device sync and production deployment were not verified in this review.

## Last review checkpoint

Verified integrated code commit: `64cfa9ba3085a9d9d99c7d6608f29eafef392fb4` (PR #24, ENG-005b). Routine successful saves are absent at 390px and 1280px, persisted values survive navigation/reload, and real failures keep recovery controls. Foundation QA, save 41, recovery browser 20, backup download 53, backup preview 75, storage 44, export 40 and ENG-004/005/006a/006b browser checks pass. No restore exists yet. PR #17 remains separately reviewed and unmerged at `6572477`; its four new lesson edits preserve every ID and its 20 lesson browser checks pass. Inspect origin and pending PRs again at the next review.

## Next coding packet: ENG-006c confirmed restore

Start from current `origin/main`, including PR #24, on a new branch. Read the ENG-006 row, `scripts/backup-format.md`, current download/preview helpers, failed-load guards and REV-010. Preserve ENG-005b's quiet routine-save behavior: restore success should not recreate a persistent green save banner, while restore errors must remain visible. Coordinator owns TASKS/HANDOFF. This packet may add restore-specific helper/tests, host controls and its own task log. Do not edit lessons, widgets, artwork, login/provider code or Discuss UI.

- Only an exact version 1 file that passed the current validator may reach confirmation. Partial source backups remain preview-only for this first restore path. Preserve unknown keys as stored keys and retained ambiguity as unassigned metadata.
- Add a clear review-and-confirm step. Backup-only values may be added, device-only values stay, matching values stay, and every conflicting value requires an explicit keep-device or use-backup choice. No preselected destructive choice, bulk silent overwrite or automatic ambiguity assignment. Render all imported strings as text.
- Before any write, build and trigger a versioned backup of the current in-memory/device state, including guards, unsaved edits and captured original raw evidence. Require the learner to acknowledge that safety download before enabling the final Restore action. Do not claim the browser proved the user saved the file.
- Bind confirmation to a fingerprint of the exact validated file, chosen conflicts and a snapshot of current in-memory values, storage raw strings, load reasons and write guards. Any file change, answer edit, navigation, new preview, storage event or guard/status change makes confirmation stale and requires a fresh preview.
- Treat the three stores as one transaction. Keep a complete pre-write snapshot. If any storage write or verification read fails, roll back every store already changed. If rollback is incomplete, leave visible per-store errors and offer the pre-restore recovery download; never report success. Update in-memory state and UI only after all writes verify.
- For a malformed/unavailable destination, never clear its failed-load guard until its original raw evidence and current in-memory edits are included in the safety download and the explicit confirmed replacement succeeds. A cancel, stale confirmation or failed write leaves the original raw bytes, memory and guard unchanged.
- After success, preserve device-only keys, selected conflict outcomes, unknown keys and ambiguity metadata; reload all three stores from persisted bytes, clear only the guards actually recovered and show exact restored/kept/conflict counts. Provide no upload, login or cross-device claim.
- Test actual downloaded source and safety files, full download-to-restore-to-reload round trips, empty/false/multiline/Unicode, unknown and ambiguous data, every conflict choice, source/destination partial states, stale preview triggers, quota/unavailable writes at each store, rollback success/failure, repeated restore and cancel. Use synthetic data and temporary downloads only. Verify keyboard focus, confirmation wording and 375/390/1280 layout. Rerun download, preview, save/recovery, export and answer-storage regressions.
- Push a focused PR and stop at REVIEW. Parent ENG-006 remains incomplete until independent review. Do not merge, deploy or begin DATA-001.

> ENG-006b is reviewed and merged in PR #20 at 1a9fe9f, and ENG-005b is merged in PR #24 at 64cfa9b. Start ENG-006c from current origin/main on a new branch. Read the full packet in HANDOFF. Build explicit confirmed restore with a required pre-restore safety download, per-conflict choices, stale-preview rejection, all-store verification and rollback. Preserve failed-load guards, original raw evidence, unknown keys, unassigned ambiguity and the quiet routine-save behavior. Use synthetic data, add full round-trip and failure tests, push a PR, and stop at REVIEW. No lessons, widgets, Discuss UI, login, deployment or DATA-001. Coordinator owns TASKS/HANDOFF.

## Claude: handoff complete; awaiting Dave's review

Claude's latest PR #17 head is `65724774db2eacde319c1e8380c194c14b3d038d`, still open and unmerged. Claude's `b7a4039` applies four review edits Dave approved in a separate review: a practical unmarried response in 8.3, narrower Genesis 15 covenant wording, a brief explanation of "Gentiles," and a concrete prayer under Grace. Every question ID is unchanged. The story artwork is unchanged from ART-003. Shared main through PR #24 is merged, and the coordinator updated the one lesson-browser assertion that still expected the removed Saved banner. The full 20 lesson browser checks and foundation QA now pass on this exact tree.

Claude reports the Obsidian manuscripts/summaries and the same phone preview now include all artwork, with lightweight JPEG derivatives for the preview and a five-item decision box. These external copies were not independently inspected by the coordinator in this checkpoint. Claude reports 47 storage checks and foundation QA passing on its merged tree. No new coordinator runtime test was needed for the unchanged lesson/assets. Preview compression does not resolve PERF-001 for the production app's PNGs.

Claude should pause at REVIEW. Dave reviews Ephesians 5 submission/headship language, the Genesis 15 interpretation, FIGHT wording, both pastoral safety boxes and the story artwork. Ephesians 5:25 stays in both 202-02 and 202-08. No retroactive drafting brief is required. PR #17 stays unmerged until Dave reviews the exact version. 203-06 remains held pending a separate writing packet.

Gemini's independent read-only learner review can be collected alongside Dave's feedback; it does not replace pastoral approval or a human pilot. Consolidate feedback into one bounded revision packet rather than asking Claude for repeated uncoordinated passes. Grokbot may start ENG-006c; Grok Build's design is complete and implementation remains held while shared host/storage code is owned by ENG-006c.

## Grok Build: widget and Discuss design complete; hold implementation

PR #22 is reviewed and merged as `7495a03`. Restart returns to Begin; Show whole diagram is separate and Return to steps preserves the prior step. The coordinator corrected overview tiles to native buttons whose accessible names include the definitions and expanded the browser suite to 108 assertions. Teaching data and font sizes are unchanged. The whole diagram, definitions, arrows and controls fit below the header after ordinary outer scrolling, including the synthetic save-error state. Actual iPhone/Safari and a human meeting are still untested.

> Your Discuss design is reviewed and merged in PR #23 at 6512003. Read the coordinator corrections in project-management/reviews/201-08-discuss-design.md and REV-009. Fetch normally. Hold UI/shared-host edits while ENG-006c owns shared host/storage code; no further coding packet is assigned.

The accepted design verifies existing response IDs and explicitly covers source wording, full diagram definitions, long-answer jump links, current-page unsaved values, unreadable storage and resetting private disclosures on entry. It is a prototype specification, not measured layout or a human pilot. The next packet must use this corrected document.

Parent UX-001 remains TODO. Its next implementation packet must explicitly allocate shared index/navigation ownership, reuse the same lesson and answer IDs, avoid automatic disclosure, and test a real conversation before rollout. The Grace overview is one prerequisite, not a completed Discuss view.

## Prompt for the daily reviewer

> Review Growing Together since the checkpoint in project-management/HANDOFF.md. Read AGENTS.md, fetch origin, inspect TASKS.md and recent task logs, and examine integrated changes and pending worker branches. Verify claims against actual diffs and targeted behavior tests. Fix bounded defects in the authorized scope; log larger findings. Preserve learner data and Dave's theology and voice. Integrate eligible reviewed work, update the board/log/checkpoint, sync to GitHub, and report completed work, corrections, the next three priorities and at most two decisions for Dave. Keep unapproved lesson revisions in review. Do not repeat the entire baseline audit.

## Before a handoff

Record task ID, owner, branch, commit or uncommitted files, checks, unresolved issue and exact next action. Push a safe checkpoint branch when possible. Never mark partial work DONE because usage is ending. Agents resume from these files and Git history; they may not see the conversation.
