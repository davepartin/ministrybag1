# FIX-101-AUDIO

Date: November 12, 2026 (America/Chicago). Owner: Codex. Status: REVIEW.

Only the reading-plan paragraph in 101-01 changes. Before: "You can read them, listen to them, or both." After: "You can read them here, or listen using a separate audio Bible." This clarifies where listening is available without removing the option of using an audio Bible. All other JSON values, questions, IDs and readings compare unchanged. Dave only needs to reread that sentence. No lesson restructuring or theological change. Required checks and preview results will be attached to the PR.

Verification: fresh npm ci exit 0; foundation QA, export 167, storage 64, assets 126 and images 1360 all exit 0. No Firebase settings, workflows or artwork changed.

Browser check exit 0: corrected paragraph renders at 375, 390 and 1280, with no horizontal overflow. All question objects and every other lesson block compare unchanged.
