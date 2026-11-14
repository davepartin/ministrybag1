# WIDGET-101-05-POTLUCK (Gemini)

- Task ID: `WIDGET-101-05-POTLUCK`
- Branch: `gemini/widget-101-05-potluck`
- Base commit: `origin/main` (`11766f9`)
- Scope: Build an interactive AAA Studio Wash widget (`discipleship/widgets/church-potluck.html`) for Lesson `101-05` ("The Church") centered on the shared potluck table and Acts 2:42-47 community life, without altering existing `101-05.json` prose, saved question/checklist IDs (`service-interests`), or Aspen Grove artwork.

## Design Summary
- Visual metaphor (`440x278` inline SVG Studio Wash Edition):
  - **Step 0 (`1 Corinthians 12:27`):** Empty oak family table with dashed unfilled spots, one solitary plate, and `"A few serving / many watching"` to contrast the restaurant mindset with a shared family table.
  - **Steps 1-4 (Progressive Acts 2:42-47 table spotlights):** Locked Studio Wash colors reveal four joyful community rhythms one corner at a time while preserving prior corners in soft watercolor wash:
    1. **Gold (`#A8760A` / `#FCF2D6`) · Word & Prayer** (`Acts 2:42`): Prayer Team, Small Group Leader, Teaching / Bible Study, Mentoring / Discipleship.
    2. **Sage Green (`#1F684A` / `#E1F1E9`) · Welcome & Bread** (`Acts 2:46`): Greeting / Welcome, First Impressions, Meals for Families, Men's / Women's Ministry.
    3. **Harbour Blue (`#2A5B7C` / `#E2EEF6`) · Making Room** (`Acts 2:44`): Kids Ministry, Youth Ministry, Worship Team, Sound / Tech, Setup / Teardown, Creative Arts, Administration.
    4. **Royal Plum (`#5F4684` / `#EDE7F6`) · Care & Outreach** (`Acts 2:45, 47`): Visiting the Sick, Outreach Events, Missions, Financial Giving, Social Media.
  - **Step 5 (`Acts 2:42-47` Whole Table):** All four dishes illuminate around the glowing center lamp and woven runner, linked by drawn golden root connectors (echoing 101-05's Aspen Grove metaphor). Learners can select any dish interactively to claim a spot on the table before checking specific boxes in `service-interests` below.
- Accessibility & compliance:
  - Fixed-height caption card via width-only `fitCardHeight()` across all 6 step captions and 4 dish-focus notes.
  - Wordless step dots (`>= 28x28px`), nav buttons (`>= 44px`), keyboard `ArrowLeft`/`ArrowRight` and `Enter`/`Space` on all four interactive SVG dishes plus rounded `.dish-focus-ring`, dynamic `<title>`/`<desc>`, and `prefers-reduced-motion: reduce` support.
  - Zero em dashes, zero `localStorage`, zero external requests, zero idle DOM mutations, and zero `"tap"`/`"click"`/`"widget"`/`"diagram"` copy strings.

## Verification
All checks executed cleanly from `/Users/dpartin/github/ministrybag1-widget-101-05-potluck/discipleship` on the final file contents:
- Static audit (`em_dash_count == 0`, no `localStorage`, no external URLs, no forbidden UI words): exit `0`
- `bash scripts/qa_foundation.sh`: exit `0` (includes 32 widget iframe checks)
- `node scripts/test_lesson_export.js`: exit `0`
- `node scripts/test_answer_storage.js`: exit `0` (177 + 64 checks)
- `node scripts/check_lesson_assets.js`: exit `0` (127 references verified)
- `NODE_PATH=/Users/dpartin/github/ministrybag1-widget-101-02/discipleship/node_modules node scripts/widget_101_05_potluck_browser_check.js`: exit `0` (`390x844`, `375x812`, `1280x800`, and `prefers-reduced-motion: reduce`; zero console/page errors; zero overflow; constant `.verse-card` height; `0` idle DOM mutations; interactive dish clicks and keyboard `Enter`/`ArrowLeft` verified).
- Visually inspected `390x844` rendered PNG screenshots (`step0.png`, `step1.png`, `step2.png`, `step3.png`, `step4.png`, `step5.png`, `step5_picked.png`).

## Integration Note for Codex
When wiring into `discipleship/data/101-05.json`, embed:
```json
{
  "type": "widget",
  "src": "widgets/church-potluck.html",
  "title": "The Church Potluck"
}
```
directly before the existing `"type": "checklist", "id": "service-interests"` block, keeping `service-interests`, all 20 items, lesson prose, question IDs, and Aspen artwork unchanged.
