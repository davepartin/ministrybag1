# ART-101-04-LAMP-TIMING: November 16, 2026

Dave requested that the 101-04 lamp reach full brightness sooner, while still on screen. This is an explicitly requested technical timing repair to approved artwork. Branch: codex/10104-lamp-timing. Isolated worktree: /workspace/ministrybag1-codex-lamp-timing. Base: a30438431c31634970cf4286497b86b286f45773. Claim: d3334a8.

## Cause and fix

The legacy two-layer dissolve starts when the image top reaches 40% down the content viewport and ends after its top moves 22% above the fixed lesson header. Thus the final lamp light is hidden as the picture leaves the screen, matching Dave's screenshots.

Added a strict boolean opt-in, imageDissolveOnEntry, only to the 101-04 lamp image block. The two-layer renderer exposes this flag as a data attribute. Enabled pairs begin fading at 90% down the area below the fixed header and finish with the image centered in that visible area. The endpoint accounts for the image height, so the complete image remains visible when it fits the viewport. Oversized images finish at the header edge. Resize uses the current viewport and image measurements. Reduced motion remains a static lighter image.

The default formula and all sequence code are unchanged. No other lesson opts in. No art source, delivery file, generated image map, lesson wording, Scripture, placement, widget, current/retired question, reading or answer-storage code changes. Only the timing flag changes in 101-04.json. Baseline visual blocks and whole-file fingerprint record that change; its nonvisual fingerprint and all artwork/widget hashes remain identical. Text stays Silver. The image guide and technical block documentation describe the opt-in.

## Evidence

The updated browser regression first ran against the old runtime and failed lighter layer fully revealed when the picture was centered. It passes after the fix. It checks actual viewport/header/image rectangles, rather than accepting completion off screen. On a short desktop page, the page cannot scroll above zero to place an already-visible image at the theoretical entry start; the test allows that physical constraint while still requiring full visibility and complete light at the endpoint.

Pinned npm ci in the fresh worktree: exit 0, 11 packages. Required repository checks, actual exit codes:

- bash scripts/qa_foundation.sh: exit 0, all foundation suites pass.
- node scripts/test_lesson_export.js: exit 0, 186 checks.
- node scripts/test_answer_storage.js: exit 0, 64 checks.
- node scripts/check_lesson_assets.js: exit 0, 141 references.
- node scripts/test_lesson_images.js: exit 0, 1505 checks.
- node scripts/test_lesson_assets.js: exit 0, 8 checks.
- node scripts/test_widget_iframe.js: exit 0, 32 checks.
- node scripts/l101_04_lamp_browser_check.js: exit 0, 128 checks at 375x667, 390x844, 1280x800, 390 reduced motion and short 375x568; full lighter image while entirely visible below the header, monotonic fade, aligned layers, no layout shift, current/retired synthetic answers and Email, no overflow or image/widget errors.
- SUPPER_BASE_URL=http://127.0.0.1:8828/index.html node scripts/l202_10_dissolve_browser_check.js: exit 0, 128 checks proving unchanged legacy timing for both other approved dissolves across phone/desktop/reduced motion.

No real learner data used. All approved six Nicodemus artwork/delivery files, generated image map and RDR widget remain byte-identical to main. Removing only the new flag restores the original 101-04 JSON exactly. Screenshot at the new completion point inspected on phone layout.

## Publication

Final-head preview, merge and production evidence are recorded on the task PR. No manual deploy or Firebase setting change. Publication uses the existing reviewed technical-fix workflow and standing merge authority; no new wording or artwork approval is inferred.
