# REVIEW-CHART-37: current lesson counts and approval matrix

Date: November 12, 2026 (America/Chicago)
Agent: Codex
Branch: codex/lesson-approval-chart
Source: main be039c7
Status: REVIEW

Dave requested a chart for each lesson with word count and separate approval for length, questions, text, widgets and images, then explicitly added a grade. Scope is the active 37 lessons in 101/201/202/203; 301 remains deferred. Count current source and compare documented approvals with their actual versions. Publication, technical passes and production grades are not final approval. Preserve every lesson file, question, saved-answer key and asset.

## Deliverables

reviews/2026-11-12-lesson-review-chart.md, .csv, .xlsx and -evidence.json. Workbook includes the 37-lesson matrix, Grade detail, all 263 current question prompts, 185 component evidence records and instructions. A shared-workspace copy is at /workspace/shared/lesson-review-chart/Growing-Together-Lesson-Review.xlsx. The board links the report. No lesson files changed.

## Evidence method

Read DAVE.md, task gates, relevant source logs and current lesson/widget/image files. Compare approved text and question sets to their Git versions, compare documented approved widget/image assets to current blobs, and preserve scoped approvals as Partial rather than guessing whole-component approval. Daniel's age-only approved change is applied to its prior approved text for the match. 203-09 has later recap and story wording, so text is Recheck while its question set still matches. New working-draft integration is not final approval.

Current word count includes headings, mid-lesson questions, Bible quotations/references and box text before Closing Reflections; excludes title/summary, embedded widgets, the assigned John reading block and closing reflections. Method is explicit in every artifact because previous reports used different boundaries. No separately approved word counts are invented; Dave's accepted longer 203-08 is noted as an exception.

## Requested grade refresh

Refreshed the established ten-checkpoint production rubric from reviews/2026-11-12-aaa-37-scorecard.md against this source snapshot. Reused prior judgments for unchanged teaching and checked current openings, review paragraphs, all mid-lesson questions, counts and component inventory. Read the changed Bible/suffering/stewardship text and integration evidence. This is not a new exhaustive theological, physical-device or learner-pilot audit.

Every lesson has a grade, numeric score, reason and next improvement; Grade detail and JSON expose all ten points and the earlier score. Average 90.3, with five AAA (A+), ten A, eleven A-, six B+, three B and two B-. No lesson currently falls below B-. New grades replace pre-integration grades only for this dated snapshot; they never create Dave approval.

Explicit judgments are documented: 101-04 keeps its three-question guided practice plus reading and teach-it (Q=10); 201-10 retains depth and challenge, with deductions for flow/repeated setup, transfer and pending widget review; 203-08 retains its accepted length (L=10); 202-05 keeps Valley Road as a fitting exercise (V=10), without requiring the optional mosaic widget; 202-07 has partial question/transfer/length points for retained financial prompts and ladder load; 203-07 gets partial format credit for the static original sketch without rejecting Dave's artwork. Do not rewrite approved questions or generate new art just to increase a score.

## Verification

Fresh npm ci exit 0. Required foundation QA, export 167, storage 64, assets 126 and image 1360 checks all pass, actual exits 0. Artifact validation opens the saved XLSX and CSV, confirms exactly 37 unique lessons, reconciles all 263 question rows and verifies 185 approval evidence records; exit 0. Reviewed the generated Markdown table and key approval comparisons. No browser tests apply to these non-runtime documents. Final diff limited to planning reports/task/log/board, with no lesson, storage, widget, image or Firebase/workflow changes.

After the grade addition, reopened the saved five-sheet XLSX and CSV/JSON: all 37 grades sum correctly from ten checkpoints, earlier/current scores reconcile, 19 main columns match their rows, all 185 approval comments remain on the correct columns, five approval dropdown ranges and six dynamic formatting ranges exist, and 263 prompts/185 evidence records remain. Actual artifact validation exit 0. The already passing runtime checks still apply because this addition changes reports only.

Next: use the chart for Dave's review; update the versioned approval record when he actually approves a component. Snapshot approval dropdown changes do not automatically update repository approval records.
