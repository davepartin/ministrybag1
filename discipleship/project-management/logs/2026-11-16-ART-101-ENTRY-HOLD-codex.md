# ART-101-ENTRY-HOLD: Codex integration, November 16, 2026

Dave explicitly requested review, verification and merge of PR #271, gemini/101-entry-dissolve-hold at b5aa6f52d8c869610e5c29a40659b754ca8255be. Isolated worktree: /workspace/ministrybag1-codex-review271; branch codex/review-271 published normally to the PR branch. Base main 46f0d65e1f69f97c23e08a49b611fb1c0ea19e5d. Claim 69254fa. No new wording or art approval is inferred.

## Review and preservation

The old entry calculation could open an already-visible picture partway through its fade. The submitted fix caps the entry start at the image's document position, then maps the first 20 percent of travel to pure B&W and the remaining 80 percent to the existing centered completion point. All math is confined to the entry opt-in branch. Legacy pair/sequence timing and reduced-motion static color behavior are unchanged.

Both submitted files, index.html and story-image.md, remain byte-identical to b5aa6f5. No lesson JSON, images/delivery copies, map, widget, saved-answer code, question/reading identity, dependency or publishing configuration changes. All existing approval fingerprints remain valid. TASKS, TEAM-BOARD and HANDOFF record this timing-only integration. Text stages unchanged.

## Verification

Pinned npm ci in the fresh worktree: exit 0, 11 packages. Actual exit codes checked:

- bash scripts/qa_foundation.sh: exit 0, all foundation suites.
- node scripts/test_lesson_export.js: exit 0, 186 checks.
- node scripts/test_answer_storage.js: exit 0, 64 checks.
- node scripts/check_lesson_assets.js: exit 0, 144 references.
- node scripts/test_lesson_images.js: exit 0, 1525 checks.
- node scripts/test_lesson_assets.js: exit 0, 8 checks.
- node scripts/test_widget_iframe.js: exit 0, 32 checks.
- NODE_OPTIONS=--require=/workspace/scratch/chrome-shim.cjs PERF001A_BASE_URL=http://127.0.0.1:8831/index.html node scripts/perf001a_browser_check.js: exit 0, 64 delivery checks. Launch-only shim selects installed Chromium without changing assertions.
- LAMP_BASE_URL=http://127.0.0.1:8831/index.html node scripts/l101_04_lamp_browser_check.js: exit 0, 128 checks including short phones and reduced motion.
- node scripts/entry_dissolve_hold_browser_check.js: exit 0, 216 focused checks across 101-03/04/05/06 at 375x667, 390x844, 1280x800 and reduced motion. Verifies actual scroll zero, pure B&W initially and through 10/20 percent, intermediate reveal, complete color with entire picture below the header, no image size shift, reverse to top and 390px resize to a shorter 568px viewport, no overflow/image/page errors.

The focused check fails on the prior main runtime's initial image state. Its completion scroll uses the next integer pixel at/after the geometric endpoint so fractional browser scroll rounding does not leave the assertion just short of completion. No runtime changes were needed to satisfy the test. No real learner data used.

## Preview and release

Final-head Firebase preview, PR status checks, merge result and live verification are recorded on PR #271. No manual deployment, preview deletion or Firebase setting changes. Publication uses the existing automatic workflows following Dave's explicit merge request.
