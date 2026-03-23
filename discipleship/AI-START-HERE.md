---
title: AI Start Here
purpose: Entry point for AI and human collaborators working on this discipleship project
status: active
---

# AI Start Here

Read these files in this order before doing any work:

1. **DISCIPLESHIP-COMPASS.md** - who we are writing for, how we write, and what makes a lesson good. This is the master direction file and wins when guidance overlaps.
2. **PROJECT-BRIEF.md** - technical architecture, file structure, JSON format, course colors, numbering system, and app mechanics.
3. **PROJECT-STATE.md** - what has been built, what changed recently, and what is pending.
4. **AI-LESSON-CHECKLIST.md** - the practical checklist for drafting, revising, or reviewing any lesson.

When working on lesson content, also read the relevant lesson JSON and any research files in `Lesson_research/`.

## What each file owns

| File | Owns | Does not own |
|------|------|-------------|
| DISCIPLESHIP-COMPASS.md | Philosophy, audience, tone, writing standards, lesson standards, editorial decisions, non-negotiables | Technical details, file structure, session history |
| PROJECT-BRIEF.md | App architecture, JSON format, course colors, numbering, typography, file structure, how the app works | Tone, editorial philosophy, audience definition |
| PROJECT-STATE.md | Current progress, session history, known issues, logo inventory, lesson status | Stable direction (that belongs in the Compass) |
| AI-LESSON-CHECKLIST.md | Hands-on checklist for lesson work: before writing, during writing, readability test, reproducibility test | Project-level direction or technical specs |
| curriculum-toc.csv | Master lesson outline, Key Verse, Key Line, Key Framework, Key Story, Key Question for every lesson | Editorial direction, technical specs |

## AI behavior rules

- Always read DISCIPLESHIP-COMPASS.md before writing or editing any lesson content.
- Always read PROJECT-BRIEF.md before making any technical changes to index.html, JSON structure, or CSS.
- Always read PROJECT-STATE.md before starting work to know what has changed recently.
- Reference lessons by number (e.g. "101-04") and read the JSON file before editing.
- No em dashes anywhere. Ever. In any file. Use commas, colons, periods, or " - " instead.
- No bullet points in lesson prose. Write in paragraphs.
- Do not re-add Augustine quotes to 201-01.
- BUILD_VERSION is automatic (Date.now()). Never bump it manually.
- Dave does final theological review on every lesson. AI writes drafts; Dave approves.
- When priority conflicts, DISCIPLESHIP-COMPASS.md wins over all other files.

## What this project is building

A reproducible discipleship path for new believers that is simple enough to read, rich enough to return to, and structured enough to teach. The goal is not just informed learners but confident disciple-makers.

## Do not let the project drift into

- academic curriculum
- dense theology without application
- church insider language
- leader training too early
- content that is impressive but not transferable
