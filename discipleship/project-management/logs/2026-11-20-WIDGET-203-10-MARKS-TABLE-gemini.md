# WIDGET-203-10-MARKS-TABLE: Redesign 203-10 Marks of a True Christian Around One Growing Table

- **Date:** 2026-11-20
- **Owner:** Gemini
- **Branch:** `gemini/widget-203-10-marks-table`
- **Status:** `REVIEW` (stopped before merge pending Dave's visual and wording approval; lesson JSON `data/203-10.json` and `index.html` untouched)

## Scope

Redesigned `discipleship/widgets/marks-of-genuine-love.html` and updated `discipleship/scripts/widget_203_10_marks_browser_check.js` off `origin/main` (`b2cde3e`) so `203-10` feels like a warm picture of the life Jesus grows in us rather than abstract categories over a dense highlighted wall of text.

## Implementation Summary

- **Four everyday navigation tabs:** `Sincere Love`, `Faithfulness`, `Humility`, `Loving Enemies`.
- **Studio Wash visual progression (`viewBox="0 0 440 162"`, One Growing Table connecting Romans 12:9-21 to Elisha's feast in 2 Kings 6):**
  - **Start (`Ready`):** Warm open wooden table lit from above (`A Life Shaped by Jesus`).
  - **Step 1 (`1. Love Sincerely` · Romans 12:9-10 · Gold `#A8760A`):** Friends draw up to the same table, making room and honoring one another; 4 concise action lines labeled `Romans 12:9-21, summarized`.
  - **Step 2 (`2. Keep Following Jesus` · Romans 12:11-13 · Forest Green `#1F684A`):** Broken warm bread, pitcher, and cups shared across the center of the table; 5 concise action lines.
  - **Step 3 (`3. Share Life Humbly` · Romans 12:15-16 · Harbour Blue `#2A5B7C`):** Companion seated on a low bench beside someone grieving with a comforting arm across their shoulder; 5 concise action lines.
  - **Step 4 (`4. Love Through Conflict` · Romans 12:14, 17-21 · Royal Plum `#5F4684`):** Someone who stood apart steps inward toward an open seat as bread and drink are offered across the table; 6 concise action lines.
  - **Step 5 (`The Whole Table` · Forest Green `#1F684A`):** Everyone gathered together around the whole table framed in a clean Studio Wash double-hairline accent, closing with **"The love you have received becomes the love you give."** and **"Jesus stays with you as you grow. His Spirit helps you live this way."**
- **Clear separation of summary and Scripture:** Every slide clearly labels the summary (`Romans 12:9-21, summarized`), with a collapsible `<details>` disclosure underneath (`Read the full passage (Romans 12:9-21)`) holding the complete ESV text of verses 9 through 21 inside `.passage-text` paragraphs so existing embedded integration checks continue to pass.

## Verification

- `bash scripts/qa_foundation.sh`: exit `0`
- `node scripts/test_lesson_export.js`: exit `0`
- `node scripts/test_answer_storage.js`: exit `0`
- `node scripts/check_lesson_assets.js`: exit `0`
- `node scripts/widget_203_10_marks_browser_check.js`: exit `0` (`216` checks across `375x812`, `390x844`, `1280x800`, and `390/reduce`; `card=211px`, `widget=579px` at `375px`, `584px` at `390px`)
- `node scripts/marks_203_10_integration_browser_check.js`: exit `0` (embedded inside `discipleship/index.html#203-10` with zero iframe resize/scroll jump across all 5 steps and preserved learner answers)
- Visually inspected `390x844` screenshots across Steps `0` through `5` and with `Read the full passage` expanded.
