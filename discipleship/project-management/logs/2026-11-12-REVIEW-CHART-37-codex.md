# REVIEW-CHART-37: current lesson counts and approval matrix

Date: November 12, 2026 (America/Chicago)
Agent: Codex
Branch: codex/lesson-approval-chart
Source: main be039c7
Status: REVIEW

Dave requested a chart for each lesson with word count and separate approval for length, questions, text, widgets and images. Scope is the active 37 lessons in 101/201/202/203; 301 remains deferred. Count current source and compare documented approvals with their actual versions. Publication and technical passes are not final approval. Preserve every lesson file, question, saved-answer key and asset.

## Deliverables

reviews/2026-11-12-lesson-review-chart.md, .csv, .xlsx and -evidence.json. Workbook includes the 37-lesson matrix, all 263 current question prompts, 185 component evidence records and instructions. A shared-workspace copy is at /workspace/shared/lesson-review-chart/Growing-Together-Lesson-Review.xlsx. The board links the report. No lesson files changed.

## Evidence method

Read DAVE.md, task gates, relevant source logs and current lesson/widget/image files. Compare approved text and question sets to their Git versions, compare documented approved widget/image assets to current blobs, and preserve scoped approvals as Partial rather than guessing whole-component approval. Daniel's age-only approved change is applied to its prior approved text for the match. 203-09 has later recap and story wording, so text is Recheck while its question set still matches. New working-draft integration is not final approval.

Current word count includes headings, mid-lesson questions, Bible quotations/references and box text before Closing Reflections; excludes title/summary, embedded widgets, the assigned John reading block and closing reflections. Method is explicit in every artifact because previous reports used different boundaries. No separately approved word counts are invented; Dave's accepted longer 203-08 is noted as an exception.

## Verification

Fresh npm ci exit 0. Required foundation QA, export 167, storage 64, assets 126 and image 1360 checks all pass, actual exits 0. Artifact validation opens the saved XLSX and CSV, confirms exactly 37 unique lessons, reconciles all 263 question rows and verifies 185 approval evidence records; exit 0. Reviewed the generated Markdown table and key approval comparisons. No browser tests apply to these non-runtime documents. Final diff limited to planning reports/task/log/board, with no lesson, storage, widget, image or Firebase/workflow changes.

Next: use the chart for Dave's review; update the versioned approval record when he actually approves a component. Snapshot approval dropdown changes do not automatically update repository approval records.
