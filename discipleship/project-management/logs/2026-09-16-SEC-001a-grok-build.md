# SEC-001a: credential inventory and removal plan

Date: 2026-09-16
Agent / reviewer: Grok Build
Status: REVIEW
Branch: `codex/sec-001a-credential-plan`
Base commit: worktree started at `089482737e78e6f80ce3e678a8a7a34907e5b1c4`; fast-forwarded to `de8ec7d` (`origin/main`) before commit so the review includes Dave's later SEC-001 direction.
Scope / files reserved: `project-management/reviews/2026-09-16-SEC-001a-grok-build.md` and this log only. No `index.html`, `dailybiblereading/`, PROJECT-BRIEF.md, TASKS.md, or HANDOFF.md edits. Grokbot owns ENG-006c on `index.html` in another checkout.

## Changes and decisions

Created isolated worktree `~/github/ministrybag1-sec-001a` from `origin/main`. Did not use `~/github/ministrybag1-grok-build-ux` or `~/github/ministrybag1-l-202-08-09`.

Inventoried the ESV credential by path and line without writing the value into any file. Current HEAD copies: `discipleship/index.html:4785`, `discipleship/PROJECT-BRIEF.md:222`, `discipleship/dailybiblereading/config.js:4`, and root `dailybiblereading/config.js:4` (outside `discipleship/`, byte-identical to the discipleship copy). Both config files say not to commit and are tracked anyway.

`git log -S` on the current value: 2 commits (`1f985b9`, `4c3671b`). An older distinct value existed in `dailybiblereading/script.js` (`79c7a19`, removed around `8e45d0d`) and is absent from HEAD. Dave should revoke both keys. No history rewrite was performed.

While this packet was in progress, main recorded Dave's decision to drop the API and embed Scripture, and marked SEC-001a BLOCKED as superseded. This review still delivers the inventory the original prompt required. The recommendation now follows Dave: no API, no proxy; remove the published credential; do not embed John as ESV until he chooses translation or Crossway permission; use esv.org links in the meantime.

Coordinator still owns TASKS.md and HANDOFF.md, so those were not claimed or updated in this packet. The board's BLOCKED row is left for the coordinator.

## Verification

Credential-safe inventory (value never printed):

- Python walk of the worktree reporting path:line only for the current value (4 lines).
- `git log -S` on the current value, on `ESV_API_TOKEN`, and on the older historical value (commit hashes and subjects only).
- Fingerprints of assignment-line secrets across the four ESV-related commits, to confirm two distinct historical keys without emitting either value.
- Boolean HTTP GET of four `ministrybag.com` URLs: current value present on all four; older value absent.

Redacted reads of `fetchChapterESV` / `fetchESVText` and the `bible_reading` renderer. Counted 21 John chapter cards across 101-01..07 and 123 JSON `verse` blocks.

Packet-file scan before staging: grepped both packet files for the current credential value and for the older historical value (patterns held in memory, not printed). Match count 0 on each file (grep exit 1). Em dash count 0. After `git add`, `git diff --cached` was scanned the same way: current value present = false. Only the two packet files were staged.

Checks not run:

- Did not call `api.esv.org` with the credential, so today's live fetch success or exact error body is unverified.
- Did not revoke keys or rewrite history.
- Did not run foundation QA or browser suites; no application code changed.
- Did not inspect forks, clones, or GitHub cached raw blobs beyond the four live Pages URLs.
- Did not open Grokbot's ENG-006c branch; assumed the coordinator's hold on `index.html` is still in force.

Known baseline: SEC-001 remains the parent release blocker. Live Pages currently serve the credential.

## Handoff

Changed files:

- `discipleship/project-management/reviews/2026-09-16-SEC-001a-grok-build.md`
- `discipleship/project-management/logs/2026-09-16-SEC-001a-grok-build.md`

Remaining work / next command: coordinator review of this packet; Dave decides revocation and history rewrite; SEC-001b after ENG-006c REVIEW, with explicit expansion if root `dailybiblereading/` is in scope.

Blocker and unblock action: none for this documentation packet. Parent SEC-001 stays open until HEAD is clean and Dave revokes the keys.
