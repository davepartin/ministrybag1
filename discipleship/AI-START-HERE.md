---
title: AI Start Here
purpose: Entry point for AI and human collaborators working on this discipleship project
status: active
---

# AI Start Here

Read these files in this order before doing any work:

1. **DISCIPLESHIP-COMPASS.md** - who we are writing for, how we write, and what makes a lesson good. This is the master direction file and wins when guidance overlaps.
2. **LESSON-TEMPLATE.md** - the structural law for every lesson. The spine, the eight-goal check, and the 200-level closing question standard. Read alongside the two exemplar lessons, `data/201-08.json` and `data/201-10.json`.
3. **PROJECT-BRIEF.md** - technical architecture, file structure, JSON format, course colors, numbering system, and app mechanics.
4. **PROJECT-STATE.md** - what has been built, what changed recently, and what is pending.
5. **AI-LESSON-CHECKLIST.md** - the practical slot-by-slot checklist for drafting, revising, or reviewing any lesson. Uses LESSON-TEMPLATE.md as its spine.

When working on lesson content, also read the relevant lesson JSON and any research files in `Lesson_research/`.

## What each file owns

| File | Owns | Does not own |
|------|------|-------------|
| DISCIPLESHIP-COMPASS.md | Philosophy, audience, tone, writing standards, lesson standards, editorial decisions, non-negotiables | Technical details, file structure, session history |
| LESSON-TEMPLATE.md | The structural law for every lesson: slot order, eight-goal check, closing-reflection trio (200-level) and 101 exception, parable and scroll-reveal image convention | Tone, editorial philosophy, JSON technical schema |
| PROJECT-BRIEF.md | App architecture, JSON format, course colors, numbering, typography, file structure, how the app works | Tone, editorial philosophy, audience definition, lesson spine |
| PROJECT-STATE.md | Current focus, build assumptions, open risks, and folder responsibilities | Stable direction (that belongs in the Compass) |
| AI-LESSON-CHECKLIST.md | Hands-on checklist for lesson work: before writing, during writing, readability test, reproducibility test. Uses LESSON-TEMPLATE.md as its spine | Project-level direction, template structure itself, or technical specs |
| curriculum-toc.csv | Single source of truth for lesson order, browse title, browse subtitle, tool, story, key verse, and short summary | Editorial direction, technical specs |

## AI behavior rules

- Always read DISCIPLESHIP-COMPASS.md before writing or editing any lesson content.
- Always read LESSON-TEMPLATE.md before drafting, revising, or reviewing a lesson. Lessons follow its spine.
- Always read PROJECT-BRIEF.md before making any technical changes to index.html, JSON structure, or CSS.
- Always read PROJECT-STATE.md before starting work to know what has changed recently.
- Treat `curriculum-toc.csv` as the source of truth for lesson order and learner-facing browse metadata.
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
