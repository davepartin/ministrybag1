# READ-101-RETRY: Retry Bible Downloads

Date: 2026-11-12. Owner: Codex. Branch: `codex/read-101-retry`.
Base: `4798597` (#168 notes integrated). Status: REVIEW.

Separate reader-only job under Dave's continue-through-queue and reviewed-passing merge delegation. Temporary failed John downloads gain a native Retry button with a busy guard. Preserve the existing shared book promise/cache, retry after repeated failures, saved notes/checks, WEB text and attribution. No lesson, ID, account, Firebase or PDF edits.

## Verification

- `bash scripts/qa_foundation.sh`: all pass, exit 0 (includes 1075 image checks).
- `node scripts/test_lesson_export.js`: 167 pass, exit 0.
- `node scripts/test_answer_storage.js`: 64 pass, exit 0.
- `node scripts/check_lesson_assets.js`: 102 references, exit 0.
- `node scripts/read101_retry_browser_check.js`: 33 pass, exit 0 at 375/390/1280. HTTP 503 then disconnected retry then real successful WEB download, repeated events, two chapters sharing one pending request, reopening, native keyboard Retry, focus after success, cache reuse and preserved notes/checks. Signed-out synthetic data. Phone screenshot inspected.
- `node scripts/read101_notes_browser_check.js`: 36 pass, exit 0.
- `git diff --check`: exit 0.

Initial retry test caught focus loss when the active native button became disabled. The final code remembers focus before disabling and returns it to the loaded text only if the learner has not focused another control. A repeated failure restores the Retry control. Final suites rerun green.

Predecessor #168 integrated verification: tree identical to reviewed head; all four required checks rerun exit 0; Firebase 43176161319 and Pages 43176161210 succeeded; public notes browser 36 pass. TASKS/HANDOFF updated from this evidence, not inferred completion.

Action preview and exact-head review/integration evidence will follow in this PR. REVIEW is the pre-integration checkpoint, not deployment or human content approval.

## Combined-Tree Refresh

While #170 waited for its preview, reviewed and integrated Grok's #169 from a separate `codex/review-169` worktree. Tested GitHub merge tree `029d729`; actual main `487fc3d` has the identical tree. All non-image lesson values and IDs are equal; image-map regeneration produced no diff; both originals and phone preview inspected. Required foundation/export 167/storage 64/assets 103, image 1094 and Action image browser 61 each exit 0. Firebase 43176902578 and Pages 43176902298 succeeded. Personal art approval remains pending; task status describes technical integration only.

Merged current main into this retry branch, preserving all #169 assets. Reran foundation QA, export 167, storage 64, assets 103, image 1094, local retry browser 33 and art browser 61: every exit 0. An updated Action preview is required before this retry PR merges. No generated map edited by hand.
