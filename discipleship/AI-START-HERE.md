---
title: AI Start Here
purpose: Entry point for AI and human collaborators working on this discipleship project
status: active
---

# AI Start Here

Start with **AGENTS.md**, **project-management/HANDOFF.md**, and your assigned row in **project-management/TASKS.md**. On first entry, read **PROJECT-STATE.md** and **project-management/PLAN.md**. Then use the applicable route below. Keep the work packet small so another agent can resume it without the whole conversation.

- **Lesson writing or review:** read DISCIPLESHIP-COMPASS.md, LESSON-TEMPLATE.md, AI-LESSON-CHECKLIST.md, the assigned JSON, and relevant research. Read PROJECT-BRIEF.md for block/schema changes. The template exemplars remain 201-08 and 201-10; 201-01 is also the production voice benchmark. Exemplars still need the corrections tracked on the board.
- **Software repair:** read the applicable architecture sections of PROJECT-BRIEF.md, the assigned code and affected data. Consult the Compass/template if a change affects teaching, order or learner-facing behavior. The technical brief contains a legacy credential: do not print or copy credential values into logs/prompts.
- **Image/widget work:** read the assigned lesson, Compass/template, relevant PROJECT-BRIEF sections and widgets/widget.md. Resolve documented guide conflicts in the assigned task rather than following stale examples blindly.
- **Daily review:** read the checkpoint, changed files and task logs; follow PLAN.md's review checklist. Do not re-audit every lesson or reread the whole historical report without a reason.

In an ongoing conversation, reuse standards already read unless they changed. The Compass remains the master editorial direction. Task files govern coordination and readiness, not a competing curriculum.

When working on lesson content, also read the relevant lesson JSON and any research files in `Lesson_research/`.

## What each file owns

| File | Owns | Does not own |
|------|------|-------------|
| project-management/TASKS.md | Work status, task owners, dependencies, lesson quality gates | Curriculum titles or theological authority |
| project-management/HANDOFF.md | Immediate next action and last review checkpoint | Full historical record |
| project-management/logs/ | Per-task changes, verification, branch and approval evidence | Current task priority |
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
- BUILD_VERSION is currently automatic (Date.now()). Do not bump it manually. The approved production-versioning change is scoped to PERF-001, which must update the technical guidance when implemented.
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
