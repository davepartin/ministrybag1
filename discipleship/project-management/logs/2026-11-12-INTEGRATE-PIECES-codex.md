# INTEGRATE-PIECES: assemble working lessons, widgets and sequences

Date: November 12, 2026
Agent: Codex
Status: integrated working pieces; final Dave wording/art/release approval remains pending
Work: isolated worktrees only; no shared main checkout touched

## Authorization

Dave explicitly instructed: "do all this, i can edit the lessons later, we are trying to get all the pieces in place ... grok is also making sequence images ... add them to the main". This supersedes prior stop-at-REVIEW/publishing holds for the named batch and authorizes working-draft integration, not a claim of final pastoral approval. Firebase settings and workflows remain unchanged.

## Integrated packets

| PR | Work | Technical evidence |
|---|---|---|
| 191 | Shorter 101-04 with early Nicodemus and Discovery Questions | Required checks, original nine question objects/John readings preserved, 30 local and 30 hosted browser checks |
| 195 | Claude's suffering draft | Required checks; restored original 5.5 question and verified it remains visible/exportable; 18 hosted render/data checks on the corrected head |
| 192 | Stewardship manuscript and Gemini brief | Documentation-only, merged without changing runtime by itself |
| 193 | Three-T stool | Required checks/iframe 32, all non-widget lesson data preserved, 64 hosted browser checks |
| 196 | Whole-life stewardship working lesson | Required checks and widow sequence 69; all seven original question objects and image blocks preserved; Matthew 6:24 and financial ladder retained for later editing |
| 190 | Good Samaritan four-frame sequence | Regenerated delivery map, required checks/images, 92 sequence checks |
| 181 | Widow's four-frame coin sequence | Refreshed with main and regenerated map, required checks/images, 69 sequence checks |
| 188 | House/rain sequence timing correction | Required checks/images, 77 sequence checks |
| 186 | Emmaus four-frame bread-breaking sequence | Regenerated map, required checks/images, 70 sequence checks |
| 189 | Newer side-view mirror | Required checks/iframe 32, 42 browser checks; fixed summary incorrectly presented as a Bible quotation |
| 194 | Forward-view Romans Road | Required checks/iframe 32, 39 browser checks, phone screenshot inspected |
| 197 | Grok's five worship-chain frames | New wiring/optimized copies and generated map; 55 local sequence checks, hosted verification tracked in final PR evidence |

All listed browser processes exited 0. Phone widths 375/390 and desktop 1280 were checked, with reduced motion in the relevant suites. Keyboard and host scroll/idle/toolbar behavior were checked for the widget packets. Physical iPhone/Safari and a human learner pilot are not claimed.

## Combined source checks

From discipleship/ in the final combined candidate:

- bash scripts/qa_foundation.sh: exit 0, all foundation checks pass.
- node scripts/test_lesson_export.js: exit 0, 167 checks pass.
- node scripts/test_answer_storage.js: exit 0, 64 checks pass.
- node scripts/check_lesson_assets.js: exit 0, 126 references resolve.
- node scripts/test_lesson_images.js: exit 0, 1,360 checks pass.
- node scripts/l202_06_sequence_browser_check.js: exit 0, 55 checks pass.
- Exact non-image comparison for 202-06: exit 0; all non-image lesson data preserved.

Every fresh worktree used npm ci, exit 0. Art integration regenerated scripts/lesson-image-assets.js with node scripts/build_lesson_images.js. No image map was combined by hand. Shared task/handoff conflicts were resolved by preserving the separate workers' entries; images, questions, lessons and widgets from current main were retained. The old 202-06 story-image test command now delegates to the new five-frame test with its prior base-URL environment setting supported.

## Queue cleanup

Closed 179 as superseded by 195, 183 as duplicate of integrated 185, 187 as a competing style guide superseded by integrated 184, and 182 as the older mirror superseded by 189. Branches/history were not deleted or force-pushed. Existing authoritative art guidance remains in story-image.md and TEAM-BOARD. Older unrelated 28/68 and denomination PR 2 remain outside this batch.

## Editorial work intentionally still open

Dave will edit one lesson at a time. Do not mark lesson readiness or A/AAA grades complete from these merges. Confirm suffering's sources/attribution, choose later mosaic treatment, and revise stewardship questions/ladder as Dave directs. Nicodemus lamp art and the proposed Psalm 119:105 connection remain a future packet. The 201-10 Learning Circle depth was preserved; no speculative rewrite was started. No 101-06 changes, course PDFs or background agents were introduced.

## Publishing and final handoff

All publishing used existing GitHub Actions. No manual deploy, Firebase billing/retention/configuration change, preview deletion or workflow edit. Intermediate main Firebase deployments through 312bd64 were confirmed successful via GitHub Actions; final combined deployment and live-file matching are reported in the final checkpoint PR comment. Temporary detailed tool logs/screenshots remain under /workspace/scratch, and each implementation PR contains source/preview evidence.
