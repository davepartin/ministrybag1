# Growing Together - Project State

*Last updated: April 17, 2026*

## What This File Is For

This file is the lightweight state snapshot for the project.

It should explain:

- what folders matter
- what the current build assumptions are
- what is actively being worked on
- what is still open or risky

It should not duplicate the full curriculum order, lesson titles, or lesson summaries. See `curriculum-toc.csv` for that.

## Current Focus

- **LESSON-TEMPLATE.md is now the structural law for every lesson.** All new drafts and stub completions start from its spine. Existing drafted lessons will be passed over against the template to close the gaps (Journey Recap, parable block, mid-question count, Lesson Review, closing reflections).
- The main build focus is still the 100 and 200 level lessons.
- The 300 level exists in the project structure but is not the active writing priority.
- Current work is centered on lesson quality, lesson order, readability, visuals, widgets, and reproducibility, not login or account features.
- Parable images move to a black-and-white Grok sketch paired with a scroll-reveal color-splash variant. One prototype lesson should be built first before commissioning the full set.

## Project Layout

- `index.html` is the app shell and lesson renderer.
- `data/` holds the lesson JSON files.
- `curriculum-toc.csv` is the single source of truth for lesson order and browse metadata.
- `widgets/` holds interactive lesson tools.
- `images/` holds lesson images and logos.
- `Lesson_research/` holds working research notes used while drafting lessons.

## Technical Notes

- `BUILD_VERSION` uses `Date.now()` in `index.html`.
- JSON, CSV, and lesson images get cache-busted automatically.
- The app is still a single-file web app with lesson content loaded from JSON.
- Home page dropdowns, the Tree view, and the lesson TOC now read lesson titles and subtitles from `curriculum-toc.csv`.

## TOC Policy

`curriculum-toc.csv` now owns:

- lesson order
- lesson browse title
- lesson browse subtitle
- tool label
- story label
- key verse
- short summary

Markdown files should point back to the TOC instead of restating lesson-by-lesson curriculum details.

## Lesson File Expectations

- Keep lesson prose in `data/`.
- Keep research notes in `Lesson_research/`.
- Keep images in `images/`.
- Keep interactive tools in `widgets/`.
- Keep lesson order and learner-facing browse metadata in `curriculum-toc.csv`.

## Visual System

- Course intro lessons can still use the orientation logos in content.
- Later lessons can use course logos through `COURSE_META` in `index.html`.
- The broader tree metaphor and course color system remain active.

## Known Open Work

- Some lesson numbering and recap continuity still need editorial cleanup inside the JSON files.
- Some lessons still need stronger consistency around early images, widgets, and question counts. The template rollout pass will address this across drafted lessons.
- 202 has five stubs to fill: 202-02 (Family), 202-04 (Gifts/APEST), 202-08 (Marriage), 202-09 (Purity/FIGHT), 202-10 (Ordinances).
- 203 has four stubs or near-stubs to fill: 203-05 (now cleanly scoped as Share), 203-06 (now cleanly scoped as 2nd Space), 203-09 (Church, Para-church, Missions, Planting), 203-10 (Your Calling, Putting It All Together).
- Some unfinished lessons still have sparse metadata in the TOC and may need a better subtitle or summary later.
- `font-sampler.html` is still a safe cleanup candidate if it is no longer needed.

## Working Rule

When content order or learner-facing browse metadata changes, update `curriculum-toc.csv` first.
