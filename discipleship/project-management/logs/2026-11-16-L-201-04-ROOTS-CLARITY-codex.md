# L-201-04-ROOTS-CLARITY: Codex

Date: November 16, 2026 (Dave's timezone). Branch: codex/201-04-roots-clarity. Base: cbaea1361cf1a438a7c95607cf73ba73173cf9f5. Status: REVIEW; not merged or live.

## Assignment and editorial choices

Dave authorized the two specific follow-ups from the 201 review: clarify roots/heart/Christ and distinguish the overlapping questions. The good-soil/gospel-heart picture and approved five-root widget are retained. Jesus supplies life; the heart receives His Word; spiritual disciplines are habits of depending on Him. The description, bridge, main reminder, root introduction, application and review use that distinction consistently.

Question 4.2 remains exactly as published. Question 4.3 now reads: "4.3 - Choose one root to deepen this month. What small practice will you begin, and when will you do it?" Its existing ID and saved answers remain. The practice follows that plan with concrete examples and a gracious restart; the numerical self-scoring exercise is removed. This is the other substantive wording change Dave should read.

## Preservation

Compared every block and field to base main. Only description and eight existing text fields differ (seven text blocks and question 201-04-3). All six question IDs, five other question objects, heading order, Scripture/parable bytes, widget placement/bytes, all six soil frames/stops and all other lesson metadata are preserved. No schema or runtime changes. No unrelated lesson, approved artwork, or Gold file changes. No U+2014 in changed files.

Read current standards and the relevant 201.04 research. Older research uses different numbering and a fertilizer picture; current assigned gospel-heart/five-root picture remains authoritative. No new passages or frameworks added.

## Local verification, actual exit codes

Pinned dependencies installed with npm ci, exit 0.

- bash scripts/qa_foundation.sh: exit 0, all foundation suites pass.
- node scripts/test_lesson_export.js: exit 0, 186 checks.
- node scripts/test_answer_storage.js: exit 0, 64 checks.
- node scripts/check_lesson_assets.js: exit 0, 144 references.
- node scripts/test_lesson_images.js: exit 0, 1525 checks.
- NODE_OPTIONS=--require=/workspace/scratch/chrome-shim.cjs L20104_BASE_URL=http://127.0.0.1:8844/index.html node scripts/l201_04_sequence_browser_check.js: exit 0, 61 checks; 375/390/1280 and reduced motion, six frames and question IDs preserved.
- Scratch Playwright smoke (no repository test added for prose): exit 0, 57 checks at 390x844, 1280x800 and reduced motion. Existing synthetic answers restore, edited 4.3 persists after reload, five other answers remain, new prose/prompt render, original iframe loads and fits after fonts settle, no horizontal overflow or page exceptions. Mobile screenshot inspected.
- Structured base comparison and git diff --check: exit 0.

No subjective grade or whole-lesson approval is assigned by passing these checks. Widget content/design is unchanged; this packet clarifies the surrounding lesson. Final wording belongs to Dave. Firebase preview evidence will be appended after the PR deploys.
